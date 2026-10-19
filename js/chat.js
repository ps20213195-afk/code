const chatState = {
  channel: null,
  presenceChannel: null,
  presenceRoomId: null,
  rows: [],
  rooms: [],
  profiles: new Map(),
  knownMessageKeys: new Set(),
  currentUserId: null,
  currentRoomId: null,
  isLoading: false
};

const chatElements = {
  tabs: [...document.querySelectorAll('.view-tab')],
  homeView: document.getElementById('homeView'),
  achievementsView: document.getElementById('achievementsView'),
  chatView: document.getElementById('chatView'),
  settingsView: document.getElementById('settingsView'),
  gamesView: document.getElementById('gamesView'),
  musicView: document.getElementById('musicView'),
  messages: document.getElementById('chatMessages'),
  form: document.getElementById('chatForm'),
  input: document.getElementById('chatInput'),
  status: document.getElementById('chatStatus'),
  roomSelect: document.getElementById('chatRoomSelect'),
  roomForm: document.getElementById('chatRoomForm'),
  roomInput: document.getElementById('chatRoomInput'),
  joinForm: document.getElementById('chatJoinForm'),
  inviteInput: document.getElementById('chatInviteInput'),
  inviteShare: document.getElementById('chatInviteShare'),
  inviteCode: document.getElementById('chatInviteCode'),
  copyInviteButton: document.getElementById('copyChatInviteBtn'),
  onlineCount: document.getElementById('chatOnlineCount')
};

const CENSORED_WORDS = ['asshole', 'bastard', 'bitch', 'crap', 'damn', 'fuck', 'shit'];

function censorMessage(message) {
  const words = CENSORED_WORDS.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${words})(?=$|[^\\p{L}\\p{N}])`, 'giu');
  return String(message).replace(pattern, (match, prefix, word) => `${prefix}${'*'.repeat(word.length)}`);
}

function getChatText(row) {
  return censorMessage(row.msg || '');
}

function getMessageKey(row) {
  return row.id || `${row.uuid || 'anonymous'}:${row.created_at || ''}:${getChatText(row)}`;
}

function notifyNewMessages(rows) {
  rows
    .filter((row) => row.uuid !== chatState.currentUserId)
    .forEach((row) => {
      const profile = chatState.profiles.get(row.uuid);
      const username = profile?.username || row.uuid || 'Somebody';
      if (chatElements.chatView.hidden) {
        showPopup(`${username} sent a new message`, 'info');
      } else {
        playNotificationSound('info');
      }
    });
}

function renderChat() {
  chatElements.messages.replaceChildren();
  if (!chatState.rows.length) {
    const empty = document.createElement('p');
    empty.className = 'chat-empty';
    empty.textContent = 'No messages yet.';
    chatElements.messages.append(empty);
    return;
  }

  chatState.rows.forEach((row) => {
    const message = document.createElement('article');
    message.className = 'chat-message';
    const meta = document.createElement('p');
    meta.className = 'chat-message-meta';
    const profile = chatState.profiles.get(row.uuid);
    const username = document.createElement('span');
    username.className = 'chat-username';
    username.textContent = profile?.username || row.uuid || 'Anonymous';
    meta.append(username);
    if (profile?.flair) {
      const separator = document.createTextNode(' | ');
      const flair = document.createElement('span');
      flair.className = 'chat-flair';
      flair.textContent = profile.flair;
      flair.style.setProperty('--flair-color', profile.flair_color || '#000000');
      meta.append(separator, flair);
    }
    const text = document.createElement('p');
    text.className = 'chat-message-text';
    text.textContent = getChatText(row);
    message.append(meta, text);
    chatElements.messages.append(message);
  });
  chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
}

function renderRooms() {
  chatElements.roomSelect.replaceChildren();
  chatState.rooms.forEach((room) => {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = room.name;
    chatElements.roomSelect.append(option);
  });
  if (chatState.currentRoomId) chatElements.roomSelect.value = chatState.currentRoomId;
}

async function loadRooms() {
  const { data, error } = await _supabase
    .from('chat_rooms')
    .select('id, name, created_by, created_at')
    .order('name', { ascending: true });
  if (error) {
    chatElements.status.textContent = 'Setup required';
    chatElements.messages.replaceChildren();
    const setupMessage = document.createElement('p');
    setupMessage.className = 'chat-empty';
    setupMessage.textContent = 'Chat rooms are not set up yet. Run the updated chat-rls.sql in Supabase.';
    chatElements.messages.append(setupMessage);
    return false;
  }

  chatState.rooms = data || [];
  if (!chatState.rooms.some((room) => room.id === chatState.currentRoomId)) {
    chatState.currentRoomId = chatState.rooms[0]?.id || null;
    chatState.knownMessageKeys.clear();
  }
  renderRooms();
  if (!chatState.currentRoomId) {
    chatElements.messages.replaceChildren();
    const empty = document.createElement('p');
    empty.className = 'chat-empty';
    empty.textContent = 'No chats yet. Create a private chat or join one with a single-use sharing code.';
    chatElements.messages.append(empty);
    chatElements.status.textContent = 'Private chats';
  }
  return Boolean(chatState.currentRoomId);
}

function updateOnlineCount() {
  if (!chatElements.onlineCount) return;
  const presence = chatState.presenceChannel?.presenceState() || {};
  const uniqueUsers = new Set();
  Object.values(presence).flat().forEach((entry) => {
    if (entry.user_id) uniqueUsers.add(entry.user_id);
  });
  chatElements.onlineCount.textContent = `${uniqueUsers.size} online`;
}

async function connectRoomPresence(roomId, userId) {
  if (chatState.presenceRoomId === roomId && chatState.presenceChannel) {
    updateOnlineCount();
    return;
  }
  if (chatState.presenceChannel) {
    const previousChannel = chatState.presenceChannel;
    chatState.presenceChannel = null;
    chatState.presenceRoomId = null;
    await _supabase.removeChannel(previousChannel);
  }
  if (!roomId || !userId) {
    chatElements.onlineCount.textContent = 'Sign in to see online users';
    return;
  }

  chatState.presenceRoomId = roomId;
  chatState.presenceChannel = _supabase.channel(`chat-presence-${roomId}`, {
    config: { presence: { key: userId } }
  });
  chatState.presenceChannel
    .on('presence', { event: 'sync' }, updateOnlineCount)
    .on('presence', { event: 'join' }, updateOnlineCount)
    .on('presence', { event: 'leave' }, updateOnlineCount)
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await chatState.presenceChannel.track({ user_id: userId, online_at: new Date().toISOString() });
        updateOnlineCount();
      }
    });
}

async function loadChat() {
  if (chatState.isLoading) return;
  chatState.isLoading = true;
  try {
    const roomsAvailable = await loadRooms();
    if (!roomsAvailable) return;
    const [{ data, error }, { data: { user } }] = await Promise.all([
      _supabase.from('chat').select('*').eq('room_id', chatState.currentRoomId).order('created_at', { ascending: true }).limit(200),
      _supabase.auth.getUser()
    ]);
    if (error) {
      chatElements.status.textContent = 'Unavailable';
      chatElements.messages.replaceChildren();
      const errorMessage = document.createElement('p');
      errorMessage.className = 'chat-empty';
      errorMessage.textContent = `Could not load chat: ${error.message}`;
      chatElements.messages.append(errorMessage);
      return;
    }
    chatState.currentUserId = user?.id || null;
    await connectRoomPresence(chatState.currentRoomId, chatState.currentUserId);
    const rows = data || [];
    const newRows = chatState.knownMessageKeys.size === 0
      ? []
      : rows.filter((row) => !chatState.knownMessageKeys.has(getMessageKey(row)));
    chatState.knownMessageKeys = new Set(rows.map(getMessageKey));
    chatState.rows = rows;
    chatState.profiles = new Map();
    const uuids = [...new Set(chatState.rows.map((row) => row.uuid).filter(Boolean))];
    if (uuids.length) {
      const { data: profiles } = await _supabase
        .from('profiles')
        .select('id, username, flair, flair_color')
        .in('id', uuids);
      (profiles || []).forEach((profile) => chatState.profiles.set(profile.id, profile));
    }
    notifyNewMessages(newRows);
    chatElements.status.textContent = 'Connected · refreshes every 2 seconds';
    renderChat();
  } catch (error) {
    chatElements.status.textContent = 'Unavailable';
    console.error('Could not refresh chat:', error);
  } finally {
    chatState.isLoading = false;
  }
}

function connectChatRealtime() {
  chatState.channel = _supabase
    .channel('chat-table-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' }, loadChat)
    .subscribe();
}

chatElements.tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const isHome = tab.dataset.view === 'home';
    const isChat = tab.dataset.view === 'chat';
    const isSettings = tab.dataset.view === 'settings';
    const isGames = tab.dataset.view === 'games';
    const isMusic = tab.dataset.view === 'music';
    const selectedView = isHome ? chatElements.homeView
      : isChat ? chatElements.chatView
      : isSettings ? chatElements.settingsView
        : isGames ? chatElements.gamesView
        : isMusic ? chatElements.musicView
        : chatElements.achievementsView;
    chatElements.tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    [chatElements.homeView, chatElements.achievementsView, chatElements.chatView, chatElements.settingsView, chatElements.gamesView, chatElements.musicView]
      .forEach((view) => {
        view.hidden = view !== selectedView;
      });
    if (!isGames) window.closeActiveGame?.();
    if (isChat) {
      loadChat();
      chatElements.input.focus();
    }
  });
});

chatElements.roomSelect.addEventListener('change', async () => {
  chatState.currentRoomId = chatElements.roomSelect.value;
  chatState.knownMessageKeys.clear();
  await loadChat();
});

chatElements.roomForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = chatElements.roomInput.value.trim().replace(/\s+/g, ' ');
  if (!name) return;
  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    showPopup('Sign in before creating a chat', 'warning');
    return;
  }

  const { data, error } = await _supabase.rpc('create_private_chat', { p_name: name });
  if (error) {
    showPopup(`Could not create private chat: ${error.message}`, 'error');
    return;
  }
  const created = Array.isArray(data) ? data[0] : data;
  if (!created?.room_id || !created?.share_code) {
    showPopup('The server did not return a private chat sharing code.', 'error');
    return;
  }
  chatElements.roomInput.value = '';
  chatState.rooms.push({ id: created.room_id, name: created.room_name });
  chatState.currentRoomId = created.room_id;
  chatState.knownMessageKeys.clear();
  renderRooms();
  chatElements.inviteCode.textContent = created.share_code;
  chatElements.inviteShare.hidden = false;
  await loadChat();
});

chatElements.joinForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const code = chatElements.inviteInput.value.trim().toLowerCase();
  if (!code) return;
  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    showPopup('Sign in before joining a private chat', 'warning');
    return;
  }

  const { data: roomId, error } = await _supabase.rpc('join_chat_with_code', { p_code: code });
  if (error) {
    showPopup(`Could not join private chat: ${error.message}`, 'error');
    return;
  }
  chatElements.inviteInput.value = '';
  chatElements.inviteShare.hidden = true;
  chatState.currentRoomId = roomId;
  chatState.knownMessageKeys.clear();
  await loadChat();
  showPopup('Joined the private chat. That sharing code can no longer be used.', 'success');
});

chatElements.copyInviteButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(chatElements.inviteCode.textContent);
    showPopup('One-time sharing code copied', 'success');
  } catch {
    showPopup('Copy was blocked by the browser. Select the code and copy it manually.', 'warning');
  }
});

chatElements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = censorMessage(chatElements.input.value.trim());
  if (!message) return;

  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    showPopup('Sign in before sending a message', 'warning');
    return;
  }

  chatElements.status.textContent = 'Sending...';
  const { error } = await _supabase.from('chat').insert({
    uuid: user.id,
    room_id: chatState.currentRoomId,
    msg: message
  });
  if (error) {
    chatElements.status.textContent = 'Send blocked';
    const details = error.code === '42501'
      ? 'Run the chat RLS policy SQL in Supabase.'
      : error.message;
    showPopup(`Could not send message: ${details}`, 'error');
    return;
  }
  chatElements.input.value = '';
  await loadChat();
});

loadChat();
setInterval(() => {
  if (!chatElements.chatView.hidden) loadChat();
}, 2000);
connectChatRealtime();
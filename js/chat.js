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
  isLoading: false,
  reloadRequested: false
};

const chatElements = {
  tabs: [...document.querySelectorAll('.view-tab')],
  homeView: document.getElementById('homeView'),
  achievementsView: document.getElementById('achievementsView'),
  chatView: document.getElementById('chatView'),
  settingsView: document.getElementById('settingsView'),
  gamesView: document.getElementById('gamesView'),
  musicView: document.getElementById('musicView'),
  blogView: document.getElementById('blogView'),
  extensionsView: document.getElementById('extensionsView'),
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
  makeInviteButton: document.getElementById('makeChatInviteBtn'),
  copyInviteButton: document.getElementById('copyChatInviteBtn'),
  onlineCount: document.getElementById('chatOnlineCount'),
  onlineUsers: document.getElementById('chatOnlineUsers')
};

const onlineProfileCache = new Map();

const CENSORED_WORDS = ['asshole', 'bastard', 'bitch', 'crap', 'damn', 'fuck', 'shit',
  'thats what she said', 'whore', 'slut', 'dick', 'cock', 'pussy', 'cunt', 'fag', 'faggot', 'nigger', 'nigga', 'retard', 'retarded'
];

function censorMessage(message) {
  const words = CENSORED_WORDS.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${words})(?=$|[^\\p{L}\\p{N}])`, 'giu');
  return String(message).replace(pattern, (match, prefix, word) => `${prefix}${'*'.repeat(word.length)}`);
}

function getChatText(row) {
  return censorMessage(row.msg || '');
}

function getMessageKey(row) {
  return row.id || row.chat_row_id || `${row.uuid || 'anonymous'}:${row.created_at || ''}:${getChatText(row)}`;
}

function getChatUsername(userId, username) {
  const name = typeof username === 'string' ? username.trim() : '';
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(name);
  if (name && !isUuid && name.toLowerCase() !== String(userId || '').toLowerCase()) return name;
  return userId ? `User ${userId.slice(0, 6)}` : 'User';
}

function notifyNewMessages(rows) {
  rows
    .filter((row) => row.uuid !== chatState.currentUserId)
    .forEach((row) => {
      const profile = chatState.profiles.get(row.uuid);
      const username = getChatUsername(row.uuid, profile?.username);
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
    username.textContent = getChatUsername(row.uuid, profile?.username);
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

async function updateOnlineCount() {
  if (!chatElements.onlineCount || !chatElements.onlineUsers) return;
  const presence = chatState.presenceChannel?.presenceState() || {};
  const onlineUsers = new Map();
  Object.values(presence).flat().forEach((entry) => {
    if (entry.user_id) onlineUsers.set(entry.user_id, entry.username || '');
  });

  const missingProfiles = [...onlineUsers.keys()].filter((userId) => !onlineProfileCache.has(userId));
  if (missingProfiles.length) {
    try {
      const { data } = await _supabase
        .from('profiles')
        .select('id, username')
        .in('id', missingProfiles);
      (data || []).forEach((profile) => onlineProfileCache.set(profile.id, profile.username));
    } catch (error) {
      console.warn('Could not load names for online chat members.', error);
    }
    missingProfiles.forEach((userId) => {
      if (!onlineProfileCache.has(userId)) onlineProfileCache.set(userId, '');
    });
  }

  chatElements.onlineCount.textContent = `${onlineUsers.size} online`;
  chatElements.onlineUsers.replaceChildren();
  onlineUsers.forEach((presenceName, userId) => {
    const chip = document.createElement('span');
    chip.className = 'chat-online-user';
    const username = getChatUsername(userId, presenceName || onlineProfileCache.get(userId));
    chip.title = username;
    chip.textContent = username;
    chatElements.onlineUsers.append(chip);
  });
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
    chatElements.onlineUsers.replaceChildren();
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
        const profileName = document.getElementById('displayUsername')?.textContent;
        const username = profileName && profileName !== 'Loading...' ? profileName : '';
        await chatState.presenceChannel.track({
          user_id: userId,
          username,
          online_at: new Date().toISOString()
        });
        updateOnlineCount();
      }
    });
}

async function loadChat() {
  if (window.GUEST_MODE) {
    chatElements.status.textContent = 'Guest preview · chat is read-only';
    chatElements.messages.replaceChildren();
    const previewMessage = document.createElement('p');
    previewMessage.className = 'chat-empty';
    previewMessage.textContent = 'Sign in to view private chats or send messages.';
    chatElements.messages.append(previewMessage);
    return;
  }
  if (chatState.isLoading) {
    chatState.reloadRequested = true;
    return;
  }
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
      const { data: profiles, error: profilesError } = await _supabase
        .from('profiles')
        .select('id, username, flair, flair_color')
        .in('id', uuids);
      if (profilesError) {
        console.warn('Could not load chat player profiles. Check the profiles SELECT policy in chat-rls.sql.', profilesError);
      }
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
    if (chatState.reloadRequested) {
      chatState.reloadRequested = false;
      void loadChat();
    }
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
    const isBlog = tab.dataset.view === 'blog';
    const isExtensions = tab.dataset.view === 'extensions';
    const selectedView = isHome ? chatElements.homeView
      : isChat ? chatElements.chatView
      : isSettings ? chatElements.settingsView
        : isGames ? chatElements.gamesView
        : isMusic ? chatElements.musicView
          : isBlog ? chatElements.blogView
            : isExtensions ? chatElements.extensionsView
        : chatElements.achievementsView;
    chatElements.tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    [chatElements.homeView, chatElements.achievementsView, chatElements.chatView, chatElements.settingsView, chatElements.gamesView, chatElements.musicView, chatElements.blogView, chatElements.extensionsView]
      .forEach((view) => {
        view.hidden = view !== selectedView;
      });
    document.querySelectorAll('.extension-view').forEach((view) => {
      view.hidden = true;
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
  const code = chatElements.inviteInput.value
    .trim()
    .toLowerCase()
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, '');
  if (!code) return;
  if (!/^[a-z]+-[a-z]+-\d{9}$/.test(code)) {
    showPopup('Sharing codes should look like funny-apple-123456789', 'warning');
    return;
  }
  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    showPopup('Sign in before joining a private chat', 'warning');
    return;
  }

  const { data: roomId, error } = await _supabase.rpc('join_chat_with_code', { p_code: code });
  if (error) {
    const hint = /Could not find the function|schema cache/i.test(error.message || '')
      ? 'Run the latest chat-rls.sql in Supabase, then retry the code.'
      : error.message;
    showPopup(`Could not join private chat: ${hint}`, 'error');
    return;
  }
  const joinedRoomId = typeof roomId === 'string'
    ? roomId
    : Array.isArray(roomId)
      ? roomId[0]?.join_chat_with_code || roomId[0]?.room_id
      : roomId?.join_chat_with_code || roomId?.room_id || roomId?.id;
  if (!joinedRoomId) {
    showPopup('The join request succeeded but returned no room. Apply the latest chat-rls.sql and try a fresh code.', 'error');
    return;
  }
  chatElements.inviteInput.value = '';
  chatElements.inviteShare.hidden = true;
  chatState.currentRoomId = joinedRoomId;
  chatState.knownMessageKeys.clear();
  const selectedOptionExists = [...chatElements.roomSelect.options].some((option) => option.value === joinedRoomId);
  if (!selectedOptionExists) {
    const selectedRoom = chatState.rooms.find((room) => room.id === joinedRoomId);
    if (selectedRoom) renderRooms();
  }
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

chatElements.makeInviteButton.addEventListener('click', async () => {
  if (!chatState.currentRoomId) {
    showPopup('Create or select a private chat first', 'warning');
    return;
  }
  chatElements.makeInviteButton.disabled = true;
  try {
    const { data, error } = await _supabase.rpc('create_chat_invite', {
      p_room_id: chatState.currentRoomId
    });
    if (error) {
      showPopup(`Could not make a sharing code: ${error.message}`, 'error');
      return;
    }
    chatElements.inviteCode.textContent = data;
    chatElements.inviteShare.hidden = false;
    showPopup('New one-time sharing code created', 'success');
  } finally {
    chatElements.makeInviteButton.disabled = false;
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

if (!window.GUEST_MODE) loadChat();
setInterval(() => {
  if (!window.GUEST_MODE && !chatElements.chatView.hidden) loadChat();
}, 2000);
if (!window.GUEST_MODE) connectChatRealtime();
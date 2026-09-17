const chatState = {
  channel: null,
  rows: [],
  profiles: new Map()
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
  status: document.getElementById('chatStatus')
};

function getChatText(row) {
  return row.msg || '';
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

async function loadChat() {
  chatElements.status.textContent = 'Loading...';
  const { data, error } = await _supabase.from('chat').select('*');
  if (error) {
    chatElements.status.textContent = 'Unavailable';
    chatElements.messages.replaceChildren();
    const errorMessage = document.createElement('p');
    errorMessage.className = 'chat-empty';
    errorMessage.textContent = `Could not load chat: ${error.message}`;
    chatElements.messages.append(errorMessage);
    return;
  }
  chatState.rows = data || [];
  chatState.profiles = new Map();
  const uuids = [...new Set(chatState.rows.map((row) => row.uuid).filter(Boolean))];
  if (uuids.length) {
    const { data: profiles } = await _supabase
      .from('profiles')
      .select('id, username, flair, flair_color')
      .in('id', uuids);
    (profiles || []).forEach((profile) => chatState.profiles.set(profile.id, profile));
  }
  chatElements.status.textContent = 'Connected';
  renderChat();
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

chatElements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = chatElements.input.value.trim();
  if (!message) return;

  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    showPopup('Sign in before sending a message', 'warning');
    return;
  }

  chatElements.status.textContent = 'Sending...';
  const { error } = await _supabase.from('chat').insert({ uuid: user.id, msg: message });
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
connectChatRealtime();
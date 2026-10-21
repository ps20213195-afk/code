const builtInGames = [
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', mode: 'board', size: 3, win: 3, difficulty: 'Easy', description: 'A quick head-to-head classic. Get three marks in a row.' },
  { id: 'connect-four', name: 'Connect Four', mode: 'board', size: 7, rows: 6, win: 4, gravity: true, difficulty: 'Easy', description: 'Drop counters, block your rival, and connect four.' },
  { id: 'grid-four', name: 'Grid Four', mode: 'board', size: 4, win: 3, difficulty: 'Medium', description: 'A tighter 4 × 4 strategy board. Make a line of three.' },
  { id: 'gomoku-mini', name: 'Gomoku Mini', mode: 'board', size: 9, win: 5, difficulty: 'Hard', description: 'Think ahead and connect five on a bigger board.' },
  { id: 'quick-trivia', name: 'Quick Trivia', mode: 'quiz', difficulty: 'Easy', description: 'Race to answer general-knowledge questions.' },
  { id: 'cosmic-trivia', name: 'Cosmic Trivia', mode: 'quiz', difficulty: 'Hard', description: 'A tougher space, science, and nature quiz.' },
  { id: 'math-sprint', name: 'Math Sprint', mode: 'math', difficulty: 'Medium', description: 'Solve quick arithmetic problems before your friends.' },
  { id: 'word-sprint', name: 'Word Sprint', mode: 'word', difficulty: 'Easy', description: 'Type the displayed word accurately to score.' },
  { id: 'reaction-tap', name: 'Reaction Tap', mode: 'reaction', difficulty: 'Easy', description: 'Wait for GO, then tap as quickly as you can.' },
  { id: 'color-flash', name: 'Color Flash', mode: 'reaction', color: true, difficulty: 'Medium', description: 'Spot the target color and hit it fast.' },
  { id: 'memory-match', name: 'Memory Match', mode: 'memory', difficulty: 'Medium', description: 'Take turns finding matching pairs on a shared board.' },
  { id: 'pattern-keeper', name: 'Pattern Keeper', mode: 'pattern', difficulty: 'Medium', description: 'Repeat a growing sequence of colored tiles.' },
  { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', mode: 'rps', difficulty: 'Easy', description: 'Choose your move secretly, then reveal together.' },
  { id: 'number-hunter', name: 'Number Hunter', mode: 'guess', difficulty: 'Medium', description: 'Guess the hidden number with hot/cold clues.' },
  { id: 'codebreaker', name: 'Codebreaker', mode: 'code', difficulty: 'Hard', description: 'Crack the four-digit code with feedback clues.' },
  { id: 'co-op-builder', name: 'Co-op Builder', mode: 'builder', difficulty: 'Easy', description: 'Work together to gather materials and build a beacon.' },
  { id: 'neon-platformer', name: 'Neon Rooftops', mode: 'platformer', theme: 'neon', difficulty: 'Medium', description: 'Jump between glowing rooftops and collect energy orbs.' },
  { id: 'crystal-platformer', name: 'Crystal Caverns', mode: 'platformer', theme: 'cave', difficulty: 'Easy', description: 'Explore a crystal cave, leap over gaps, and gather gems.' },
  { id: 'starship-platformer', name: 'Starship Scramble', mode: 'platformer', theme: 'space', difficulty: 'Hard', description: 'Hop across a starship wreck and reach the escape pod.' },
  { id: 'sky-island-platformer', name: 'Sky Island Hop', mode: 'platformer', theme: 'sky', difficulty: 'Easy', description: 'Cross floating islands above the clouds.' },
  { id: 'pixel-maze-platformer', name: 'Pixel Maze Jumper', mode: 'platformer', theme: 'maze', difficulty: 'Hard', description: 'Climb a tricky pixel maze and find the exit portal.' },
  { id: 'alien-platformer', name: 'Alien Planet Rescue', mode: 'platformer', theme: 'alien', difficulty: 'Medium', description: 'Rescue a stranded rover on a strange alien world.' },
  { id: 'lunar-platformer', name: 'Lunar Leap', mode: 'platformer', theme: 'moon', difficulty: 'Easy', description: 'Use low lunar gravity to leap between moon rocks.' },
  { id: 'jungle-platformer', name: 'Jungle Temple Hop', mode: 'platformer', theme: 'jungle', difficulty: 'Hard', description: 'Climb the jungle temple, avoid spikes, and reach the treasure.' },
  { id: 'treasure-quiz', name: 'Treasure Quiz', mode: 'quiz', difficulty: 'Medium', description: 'Answer your way through a co-op treasure hunt.' },
  { id: 'category-chain', name: 'Category Chain', mode: 'word', category: true, difficulty: 'Medium', description: 'Take turns naming something in the displayed category.' }
];

const externalGames = [
  { name: 'Poxel.io', url: 'https://poxel.io/', note: 'Multiplayer voxel shooter' },
  { name: 'Bloxd.io', url: 'https://bloxd.io/', note: 'Multiplayer block worlds' },
  { name: 'Shell Shockers', url: 'https://shellshock.io/', note: 'Online arena shooter' },
  { name: 'Bonk.io', url: 'https://bonk.io/', note: 'Physics party battles' },
  { name: 'Krunker.io', url: 'https://krunker.io/', note: 'Fast browser FPS' },
  { name: 'Gartic Phone', url: 'https://garticphone.com/', note: 'Drawing and guessing party' },
  { name: 'skribbl.io', url: 'https://skribbl.io/', note: 'Draw-and-guess rooms' },
  { name: 'TETR.IO', url: 'https://tetr.io/', note: 'Competitive online blocks' },
  { name: 'Lichess', url: 'https://lichess.org/', note: 'Free online chess' },
  { name: 'Codenames Online', url: 'https://codenames.game/', note: 'Team word party game' }
];

const gamesList = document.getElementById('gamesList');
const externalGamesList = document.getElementById('externalGamesList');
const gameSearchInput = document.getElementById('gameSearchInput');
const gameSearchCount = document.getElementById('gameSearchCount');
const externalGameCount = document.getElementById('externalGameCount');
const gameChooserWindow = document.getElementById('gameChooserWindow');
const gamePlayWindow = document.getElementById('gamePlayWindow');
const gameFrame = document.getElementById('gameFrame');
const gameFrameWrap = document.querySelector('.game-frame-wrap');
const externalGameLink = document.getElementById('externalGameLink');
const gameEmpty = document.getElementById('gameEmpty');
const gameTitle = document.getElementById('gameTitle');
const gameDescription = document.getElementById('gameDescription');
const builtInGame = document.getElementById('builtInGame');
const gamePlayArea = document.querySelector('.game-play-area');
const fullscreenGameBtn = document.getElementById('fullscreenGameBtn');
const gameAdminForm = document.getElementById('gameAdminForm');
const gameAdminStatus = document.getElementById('gameAdminStatus');
const gameRoomStatus = document.getElementById('gameRoomStatus');
const gameRoomPlayers = document.getElementById('gameRoomPlayers');
const gameRoomInvite = document.getElementById('gameRoomInvite');
const gameRoomCode = document.getElementById('gameRoomCode');
const ADMIN_UUID = '13df2e26-2285-43de-855d-ba42c9c9ff8d';
const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const playerId = () => gameRoomUser?.id || 'solo-player';

let gameRoomUser = null;
let gameRoomChannel = null;
let gameRoomCodeValue = null;
let activeGame = null;
let gameState = null;
let roomSnapshot = null;
let roomPlayerList = [];
let reactionTimer = null;
let memoryTimer = null;
let activeCanvas = null;
let platformerFrame = null;
let platformerPreviousTime = 0;
let platformerLastBroadcast = 0;
const platformerKeys = new Set();

function setText(element, value) {
  if (element) element.textContent = value;
}

function makeButton(label, onClick, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  if (className) button.className = className;
  button.addEventListener('click', onClick);
  return button;
}

function makeCard() {
  const card = document.createElement('section');
  card.className = 'mini-game-card';
  return card;
}

function getPlayerName(id) {
  if (id === gameRoomUser?.id) {
    const display = document.getElementById('displayUsername')?.textContent?.trim();
    if (display && display !== 'Loading...') return display;
  }
  const known = roomPlayerList.find((player) => player.id === id);
  return known?.name || `Player ${String(id).slice(0, 5)}`;
}

function makeGameState(game) {
  const players = roomPlayerList.map((player) => player.id);
  const state = { gameId: game.id, scores: {}, status: 'Ready', round: 1, playerOrder: players };
  if (game.mode === 'board') {
    const rows = game.rows || game.size;
    state.board = Array(rows * game.size).fill('');
    state.turn = 0;
    state.winner = null;
  } else if (game.mode === 'quiz') {
    state.questionIndex = 0;
  } else if (game.mode === 'memory') {
    state.cards = shuffle(['🍋', '🍋', '⭐', '⭐', '🌙', '🌙', '🍀', '🍀', '🔥', '🔥', '💎', '💎', '🪐', '🪐', '🎈', '🎈']);
    state.open = [];
    state.matched = [];
  } else if (game.mode === 'pattern') {
    state.sequence = [Math.floor(Math.random() * 4)];
    state.patternInput = {};
  } else if (game.mode === 'rps') {
    state.choices = {};
  } else if (game.mode === 'guess' || game.mode === 'code') {
    state.secret = 1 + Math.floor(Math.random() * (game.mode === 'code' ? 9999 : 100));
    state.guesses = [];
  } else if (game.mode === 'builder') {
    state.materials = 0;
    state.goal = 20;
    state.builders = {};
  } else if (game.mode === 'platformer') {
    state.platformers = {};
    state.platformers[playerId()] = createPlatformerPlayer();
    state.coins = getPlatformerLevel(game).coins.map((coin) => ({ ...coin, collected: false }));
  }
  players.forEach((id) => { state.scores[id] = 0; });
  return state;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function refreshRoomPlayers() {
  if (!gameRoomChannel) {
    roomPlayerList = [];
    setText(gameRoomPlayers, 'No room connected');
    return;
  }
  const presence = gameRoomChannel.presenceState();
  const uniquePlayers = new Map();
  Object.values(presence).flat().forEach((entry) => {
    if (entry.user_id) uniquePlayers.set(entry.user_id, {
      id: entry.user_id,
      name: entry.username || `Player ${String(entry.user_id).slice(0, 5)}`
    });
  });
  roomPlayerList = [...uniquePlayers.values()];
  setText(gameRoomPlayers, `${roomPlayerList.length} connected: ${roomPlayerList.map((player) => player.name).join(', ') || 'waiting...'}`);
  if (gameState && activeGame) {
    const nextOrder = roomPlayerList.map((player) => player.id);
    const existingOrder = gameState.playerOrder || [];
    if (nextOrder.length && (nextOrder.length !== existingOrder.length || nextOrder.some((id, index) => id !== existingOrder[index]))) {
      gameState.playerOrder = nextOrder;
      nextOrder.forEach((id) => { gameState.scores[id] ??= 0; });
      renderActiveGame();
      publishGameState();
    }
  }
  if (gameState && !gameState.gameId && activeGame) {
    gameState = makeGameState(activeGame);
    publishGameState();
  }
}

function showGameWindow(windowName) {
  const chooserVisible = windowName === 'chooser';
  if (chooserVisible) platformerKeys.clear();
  gameChooserWindow.hidden = !chooserVisible;
  gamePlayWindow.hidden = chooserVisible;
  document.getElementById('gamesHeaderStatus').textContent = chooserVisible
    ? 'Choose a game to play'
    : gameRoomChannel ? `Playing with ${roomPlayerList.length} connected player${roomPlayerList.length === 1 ? '' : 's'}` : 'Solo practice';
  if (!chooserVisible) window.closeActiveGame?.();
}

function renderGameCatalog(filter = '') {
  gamesList.replaceChildren();
  const normalizedFilter = filter.trim().toLowerCase();
  const games = builtInGames.filter((game) => {
    const searchableText = `${game.name} ${game.id} ${game.description} ${game.difficulty} ${game.mode} ${game.theme || ''} ${game.mode === 'platformer' ? '2d platform jump' : ''}`;
    return searchableText.toLowerCase().includes(normalizedFilter);
  });
  gameSearchCount.textContent = normalizedFilter ? `${games.length} of ${builtInGames.length} built-in` : `${builtInGames.length} built-in games`;
  games.forEach((game) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-choice';
    button.dataset.gameId = game.id;
    const name = document.createElement('span');
    name.textContent = `${game.mode === 'platformer' ? '▰ ' : ''}${game.name}`;
    const detail = document.createElement('small');
    detail.textContent = `${game.difficulty}${game.mode === 'platformer' ? ' · 2D platformer' : ''}`;
    button.append(name, detail);
    button.addEventListener('click', () => {
      selectBuiltInGame(game);
      showGameWindow('play');
    });
    gamesList.append(button);
  });
  if (!games.length) {
    const empty = document.createElement('p');
    empty.className = 'game-room-status';
    empty.textContent = 'No games match that search.';
    gamesList.append(empty);
  }
}

function appendExternalGame(game) {
  if ([...externalGamesList.querySelectorAll('a')].some((link) => link.href === game.url)) return;
  const link = document.createElement('a');
  link.className = 'external-game-link';
  link.href = game.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.dataset.searchText = `${game.name} ${game.note || ''}`.toLowerCase();
  const label = document.createElement('span');
  label.textContent = game.name;
  const note = document.createElement('span');
  note.textContent = game.note || 'Open game ↗';
  link.append(label, note);
  link.addEventListener('click', (event) => {
    event.preventDefault();
    selectExternalGame(game);
  });
  externalGamesList.append(link);
}

function filterExternalGames(filter = '') {
  const query = filter.trim().toLowerCase();
  let visible = 0;
  externalGamesList.querySelectorAll('.external-game-link').forEach((link) => {
    const match = !query || link.dataset.searchText.includes(query);
    link.hidden = !match;
    if (match) visible += 1;
  });
  externalGameCount.textContent = query ? `${visible} of ${externalGamesList.children.length} games` : `${externalGamesList.children.length} games`;
}

function showPlayArea() {
  gameFrameWrap.hidden = true;
  gameFrame.src = 'about:blank';
  builtInGame.hidden = false;
}

function selectBuiltInGame(game) {
  clearGameTimers();
  platformerKeys.clear();
  activeGame = game;
  gameState = makeGameState(game);
  showPlayArea();
  gameTitle.textContent = game.name;
  gameDescription.textContent = `${game.description} ${game.difficulty} difficulty${gameRoomChannel ? ' · Live room connected' : ' · Solo practice'}.`;
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.toggle('is-active', item.dataset.gameId === game.id));
  renderActiveGame();
  if (gameRoomChannel) publishGameState();
  showGameWindow('play');
}

function selectExternalGame(game) {
  activeGame = null;
  gameState = null;
  builtInGame.hidden = true;
  gameFrameWrap.hidden = false;
  gameFrame.hidden = true;
  externalGameLink.href = game.url;
  externalGameLink.textContent = `Open ${game.name} in a new tab ↗`;
  externalGameLink.onclick = (event) => {
    event.preventDefault();
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };
  gameTitle.textContent = game.name;
  gameDescription.textContent = `${game.note || 'External multiplayer game'} · Opens in a separate tab.`;
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.remove('is-active'));
  showGameWindow('play');
}

function sendRoomEvent(event, payload) {
  if (!gameRoomChannel) return;
  void gameRoomChannel.send({ type: 'broadcast', event, payload });
}

function publishGameState() {
  if (!gameState || !gameRoomChannel) return;
  roomSnapshot = { gameId: activeGame?.id || null, state: gameState };
  sendRoomEvent('game-state', roomSnapshot);
}

function handleRemoteSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return;
  const game = builtInGames.find((item) => item.id === snapshot.gameId);
  if (!game || !snapshot.state) return;
  roomSnapshot = snapshot;
  activeGame = game;
  gameState = snapshot.state;
  showPlayArea();
  gameTitle.textContent = game.name;
  gameDescription.textContent = `${game.description} ${game.difficulty} difficulty · Live room connected.`;
  showGameWindow('play');
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.toggle('is-active', item.dataset.gameId === game.id));
  renderActiveGame();
}

function sendState() {
  publishGameState();
  renderActiveGame();
}

function createRoomCode() {
  const bytes = new Uint8Array(6);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return [...bytes].map((byte) => ROOM_ALPHABET[byte % ROOM_ALPHABET.length]).join('');
}

async function connectGameRoom(code, isHost) {
  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) {
    setText(gameRoomStatus, 'Sign in to create or join multiplayer rooms.');
    return;
  }
  if (gameRoomChannel) await _supabase.removeChannel(gameRoomChannel);
  gameRoomUser = user;
  gameRoomCodeValue = code;
  gameRoomCode.textContent = code;
  gameRoomInvite.hidden = false;
  setText(gameRoomStatus, 'Connecting to room...');
  roomSnapshot = isHost && activeGame && gameState ? { gameId: activeGame.id, state: gameState } : null;
  gameRoomChannel = _supabase.channel(`multiplayer-game-${code}`, {
    config: { presence: { key: user.id } }
  });
  gameRoomChannel
    .on('presence', { event: 'sync' }, refreshRoomPlayers)
    .on('presence', { event: 'join' }, refreshRoomPlayers)
    .on('presence', { event: 'leave' }, refreshRoomPlayers)
    .on('broadcast', { event: 'game-state' }, ({ payload }) => handleRemoteSnapshot(payload))
    .on('broadcast', { event: 'platformer-player' }, ({ payload }) => {
      if (!activeGame || activeGame.mode !== 'platformer' || !payload?.userId || !payload?.player) return;
      gameState.platformers ||= {};
      gameState.platformers[payload.userId] = payload.player;
      if (Array.isArray(payload.coins)) gameState.coins = payload.coins;
      if (typeof payload.score === 'number') gameState.scores[payload.userId] = payload.score;
      if (activeCanvas) drawPlatformer(activeCanvas);
    })
    .on('broadcast', { event: 'sync-request' }, () => {
      if (roomSnapshot) sendRoomEvent('game-state', roomSnapshot);
    })
    .subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        setText(gameRoomStatus, `Room status: ${status}`);
        return;
      }
      const username = document.getElementById('displayUsername')?.textContent?.trim();
      await gameRoomChannel.track({
        user_id: user.id,
        username: username && username !== 'Loading...' ? username : `Player ${user.id.slice(0, 6)}`,
        joined_at: new Date().toISOString()
      });
      setText(gameRoomStatus, isHost ? 'Room ready. Share the code with friends.' : 'Joined room. Waiting for the host to choose a game...');
      refreshRoomPlayers();
      if (isHost && activeGame) publishGameState();
      else sendRoomEvent('sync-request', { user_id: user.id });
    });
}

async function leaveGameRoom() {
  if (gameRoomChannel) await _supabase.removeChannel(gameRoomChannel);
  gameRoomChannel = null;
  gameRoomCodeValue = null;
  roomSnapshot = null;
  roomPlayerList = [];
  gameRoomInvite.hidden = true;
  setText(gameRoomStatus, 'Create a room or join with a code. Rooms are live while players stay connected.');
  refreshRoomPlayers();
  if (activeGame) {
    gameState = makeGameState(activeGame);
    gameDescription.textContent = `${activeGame.description} ${activeGame.difficulty} difficulty · Solo practice.`;
    renderActiveGame();
  }
}

function showStatus(card, text) {
  const status = card.querySelector('.mini-game-status');
  if (status) status.textContent = text;
}

function addScores(card) {
  const list = document.createElement('p');
  list.className = 'mini-game-status';
  const entries = Object.entries(gameState.scores || {});
  list.textContent = entries.length
    ? entries.map(([id, score]) => `${getPlayerName(id)}: ${score}`).join(' · ')
    : 'Scores appear when players join.';
  card.append(list);
}

function renderBoard(card) {
  const size = activeGame.size;
  const rows = activeGame.rows || size;
  const board = document.createElement('div');
  board.className = 'board-grid';
  board.style.setProperty('--board-size', size);
  const currentMark = gameState.turn % 2 === 0 ? 'X' : 'O';
  const status = document.createElement('p');
  status.className = 'mini-game-status';
  const order = gameState.playerOrder?.length ? gameState.playerOrder : [playerId()];
  const currentOwner = order[gameState.turn % order.length];
  status.textContent = gameState.winner
    ? gameState.status
    : gameState.board.every(Boolean) ? 'Draw game! Start a new round.' : `${getPlayerName(currentOwner)} · ${currentMark}'s turn`;
  card.append(status);
  gameState.board.forEach((mark, index) => {
    const button = makeButton(mark || '·', () => {
      if (gameState.winner || gameState.board[index]) return;
      if (roomPlayerList.length > 1 && currentOwner !== playerId()) {
        showStatus(card, `Wait for ${getPlayerName(currentOwner)} to play.`);
        return;
      }
      if (activeGame.gravity) {
        const column = index % size;
        const actualIndex = findGravityCell(column, rows, size);
        if (actualIndex < 0) return;
        gameState.board[actualIndex] = currentMark;
      } else {
        gameState.board[index] = currentMark;
      }
      if (isWinningBoard(gameState.board, size, rows, activeGame.win, currentMark)) {
        gameState.winner = currentMark;
        gameState.scores[currentOwner] = (gameState.scores[currentOwner] || 0) + 1;
        gameState.status = `${getPlayerName(currentOwner)} wins the round.`;
      } else if (gameState.board.every(Boolean)) gameState.status = 'Board full.';
      gameState.turn += 1;
      sendState();
    }, 'board-cell');
    button.disabled = Boolean(gameState.winner || mark);
    board.append(button);
  });
  card.append(board, makeButton('New round', () => {
    gameState = makeGameState(activeGame);
    sendState();
  }, 'btn-secondary'));
}

function findGravityCell(column, rows, columns) {
  for (let row = rows - 1; row >= 0; row -= 1) {
    const index = row * columns + column;
    if (!gameState.board[index]) return index;
  }
  return -1;
}

function isWinningBoard(board, size, rows, target, mark) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < size; column += 1) {
      for (const [dr, dc] of directions) {
        let count = 0;
        for (let step = 0; step < target; step += 1) {
          const r = row + dr * step;
          const c = column + dc * step;
          if (r < 0 || r >= rows || c < 0 || c >= size || board[r * size + c] !== mark) break;
          count += 1;
        }
        if (count === target) return true;
      }
    }
  }
  return false;
}

const quizQuestions = [
  { q: 'Which planet is known as the Red Planet?', a: ['Mars', 'Venus', 'Neptune', 'Mercury'], c: 0 },
  { q: 'How many sides does a hexagon have?', a: ['Five', 'Six', 'Seven', 'Eight'], c: 1 },
  { q: 'Which ocean is the largest?', a: ['Arctic', 'Indian', 'Pacific', 'Atlantic'], c: 2 },
  { q: 'What do bees collect from flowers?', a: ['Pollen', 'Pebbles', 'Dew only', 'Seeds'], c: 0 },
  { q: 'Which gas do plants take in?', a: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Helium'], c: 1 },
  { q: 'What is the closest star to Earth?', a: ['Sirius', 'The Sun', 'Polaris', 'Vega'], c: 1 },
  { q: 'Which animal is the largest mammal?', a: ['Elephant', 'Blue whale', 'Giraffe', 'Orca'], c: 1 },
  { q: 'How many minutes are in an hour?', a: ['50', '60', '70', '100'], c: 1 },
  { q: 'Which shape has three sides?', a: ['Triangle', 'Square', 'Pentagon', 'Circle'], c: 0 },
  { q: 'What is frozen water called?', a: ['Steam', 'Ice', 'Mist', 'Salt'], c: 1 },
  { q: 'Which planet has famous rings?', a: ['Saturn', 'Earth', 'Mars', 'Mercury'], c: 0 },
  { q: 'What is the process plants use to make food?', a: ['Photosynthesis', 'Evaporation', 'Orbiting', 'Digestion'], c: 0 }
];
const sprintWords = ['comet', 'waffle', 'pixel', 'planet', 'forest', 'rocket', 'puzzle', 'otter', 'lantern', 'rainbow', 'crystal', 'thunder'];
const wordCategories = ['Name a fruit', 'Name an animal', 'Name something in space', 'Name a color', 'Name a sport'];

function renderQuiz(card) {
  const question = quizQuestions[(gameState.questionIndex || 0) % quizQuestions.length];
  const prompt = document.createElement('h3');
  prompt.textContent = question.q;
  card.append(prompt);
  const actions = document.createElement('div');
  actions.className = 'mini-game-actions';
  question.a.forEach((answer, index) => actions.append(makeButton(answer, () => {
    const scores = gameState.scores || (gameState.scores = {});
    scores[playerId()] = (scores[playerId()] || 0) + (index === question.c ? 1 : 0);
    gameState.questionIndex = (gameState.questionIndex || 0) + 1;
    gameState.status = index === question.c ? `${getPlayerName(playerId())} got it!` : 'Next question!';
    sendState();
  })));
  card.append(actions);
  showStatus(card, gameState.status || 'Answer any time; fastest correct answers score.');
}

function renderMath(card) {
  const a = 8 + ((gameState.round * 7) % 20);
  const b = 3 + ((gameState.round * 5) % 13);
  const operation = gameState.round % 3 === 0 ? '×' : gameState.round % 3 === 1 ? '+' : '−';
  const answer = operation === '×' ? a * b : operation === '+' ? a + b : a - b;
  const prompt = document.createElement('h3');
  prompt.textContent = `${a} ${operation} ${b} = ?`;
  const input = document.createElement('input');
  input.className = 'mini-game-input';
  input.type = 'number';
  input.placeholder = 'Your answer';
  input.setAttribute('aria-label', 'Your answer');
  const submit = makeButton('Submit answer', () => {
    if (Number(input.value) === answer) {
      gameState.scores[playerId()] = (gameState.scores[playerId()] || 0) + 1;
      gameState.round += 1;
      gameState.status = `${getPlayerName(playerId())} solved it!`;
      sendState();
    } else showStatus(card, 'Not quite—try again!');
  });
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') submit.click(); });
  card.append(prompt, input, submit);
  showStatus(card, gameState.status || 'First correct answer scores a point.');
}

function renderWord(card) {
  const word = sprintWords[(gameState.round - 1) % sprintWords.length];
  const prompt = document.createElement('h3');
  prompt.textContent = activeGame.category ? wordCategories[(gameState.round - 1) % wordCategories.length] : `Type: ${word}`;
  const input = document.createElement('input');
  input.className = 'mini-game-input';
  input.type = 'text';
  input.maxLength = 40;
  input.placeholder = activeGame.category ? 'Your answer' : 'Type the word';
  const submit = makeButton('Send', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) return;
    if (activeGame.category || value === word) {
      gameState.scores[playerId()] = (gameState.scores[playerId()] || 0) + 1;
      gameState.round += 1;
      gameState.status = `${getPlayerName(playerId())} scored!`;
      sendState();
    } else showStatus(card, 'Check the spelling and try again.');
  });
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') submit.click(); });
  card.append(prompt, input, submit);
  showStatus(card, gameState.status || (activeGame.category ? 'Take turns—repeating an answer is allowed.' : 'First accurate entry scores.'));
}

function renderReaction(card) {
  const target = activeGame.color ? ['MINT', 'CORAL', 'VIOLET', 'GOLD'][(gameState.round - 1) % 4] : 'GO';
  if (gameState.reactionReady && !gameState.goAt && gameState.startAt && !reactionTimer) {
    reactionTimer = setTimeout(() => {
      reactionTimer = null;
      if (!gameState?.reactionReady || gameState.goAt) return;
      gameState.goAt = Date.now();
      gameState.status = 'GO!';
      sendState();
    }, Math.max(0, gameState.startAt - Date.now()));
  } else if (!gameState.reactionReady && reactionTimer) {
    clearTimeout(reactionTimer);
    reactionTimer = null;
  }
  const prompt = document.createElement('h3');
  prompt.textContent = gameState.reactionReady ? target : activeGame.color ? `Wait for ${target}` : 'Wait for GO';
  const button = makeButton(gameState.reactionReady ? `TAP ${target}` : 'Start round', () => {
    if (!gameState.reactionReady) {
      gameState.reactionReady = true;
      gameState.startAt = Date.now() + 1200 + Math.random() * 1800;
      gameState.status = 'Get ready...';
      sendState();
      return;
    }
    if (!gameState.goAt) {
      gameState.status = `${getPlayerName(playerId())} jumped the start!`;
      gameState.reactionReady = false;
      sendState();
      return;
    }
    const ms = Math.max(1, Date.now() - gameState.goAt);
    gameState.scores[playerId()] = Math.max(gameState.scores[playerId()] || 0, Math.max(0, 1000 - ms));
    gameState.round += 1;
    gameState.reactionReady = false;
    gameState.startAt = null;
    gameState.goAt = null;
    gameState.status = `${getPlayerName(playerId())}: ${ms} ms`;
    sendState();
  });
  card.append(prompt, button);
  showStatus(card, gameState.status || 'Start a round, then be first to tap when the signal appears.');
}

function renderMemory(card) {
  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  gameState.cards.forEach((value, index) => {
    const shown = gameState.open.includes(index) || gameState.matched.includes(index);
    const button = makeButton(shown ? value : '?', () => {
      if (shown || gameState.open.length >= 2) return;
      gameState.open.push(index);
      if (gameState.open.length === 2) {
        const [first, second] = gameState.open;
        if (gameState.cards[first] === gameState.cards[second]) {
          gameState.matched.push(first, second);
          gameState.scores[playerId()] = (gameState.scores[playerId()] || 0) + 1;
          gameState.open = [];
          gameState.status = `${getPlayerName(playerId())} found a pair!`;
        } else {
          gameState.status = 'No match—cards flip back shortly.';
          sendState();
          if (memoryTimer) clearTimeout(memoryTimer);
          memoryTimer = setTimeout(() => {
            memoryTimer = null;
            if (!gameState || gameState.open.length !== 2) return;
            gameState.open = [];
            sendState();
          }, 900);
        }
      }
      sendState();
    }, 'memory-card');
    button.disabled = shown || gameState.open.length >= 2;
    grid.append(button);
  });
  card.append(grid, makeButton('Shuffle', () => { gameState = makeGameState(activeGame); sendState(); }, 'btn-secondary'));
  showStatus(card, gameState.status || 'Find matching pairs. Everyone sees the same board.');
}

function renderPattern(card) {
  const expected = gameState.sequence;
  const output = document.createElement('p');
  output.textContent = `Sequence length ${expected.length} · Repeat the sequence:`;
  const actions = document.createElement('div');
  actions.className = 'mini-game-actions';
  ['🔵', '🟣', '🟢', '🟠'].forEach((emoji, index) => actions.append(makeButton(emoji, () => {
    const progress = gameState.patternInput[playerId()] || [];
    progress.push(index);
    if (progress.length >= expected.length) {
      const correct = progress.every((tile, position) => tile === expected[position]);
      if (correct) {
        gameState.scores[playerId()] = (gameState.scores[playerId()] || 0) + 1;
        gameState.sequence.push(Math.floor(Math.random() * 4));
        gameState.status = `${getPlayerName(playerId())} remembered it!`;
      } else {
        gameState.status = `${getPlayerName(playerId())} missed the pattern.`;
      }
      gameState.patternInput = {};
    } else gameState.patternInput[playerId()] = progress;
    sendState();
  })));
  card.append(output, actions);
  showStatus(card, gameState.status || 'Repeat the same tile order to grow your score.');
}

function renderRps(card) {
  const actions = document.createElement('div');
  actions.className = 'mini-game-actions';
  const choices = ['🪨 Rock', '📄 Paper', '✂️ Scissors'];
  choices.forEach((choice, index) => actions.append(makeButton(choice, () => {
    gameState.choices[playerId()] = index;
    const players = roomPlayerList.map((player) => player.id);
    if (players.length >= 2 && players.every((id) => gameState.choices[id] !== undefined)) {
      const [a, b] = players;
      const diff = (gameState.choices[a] - gameState.choices[b] + 3) % 3;
      if (diff !== 0) gameState.scores[diff === 1 ? a : b] = (gameState.scores[diff === 1 ? a : b] || 0) + 1;
      gameState.status = diff === 0 ? 'Tie round!' : `${getPlayerName(diff === 1 ? a : b)} wins the round!`;
      gameState.choices = {};
      gameState.round += 1;
    } else gameState.status = `Move locked: ${choice}. Waiting for an opponent.`;
    sendState();
  })));
  card.append(actions);
  showStatus(card, gameState.status || 'Choose secretly, then wait for the other player.');
}

function renderGuess(card) {
  const input = document.createElement('input');
  input.className = 'mini-game-input';
  input.type = 'number';
  input.min = '1';
  input.max = activeGame.mode === 'code' ? '9999' : '100';
  input.placeholder = activeGame.mode === 'code' ? 'Four-digit code' : 'Guess 1–100';
  const submit = makeButton('Guess', () => {
    const guess = Number(input.value);
    if (!Number.isFinite(guess)) return;
    gameState.guesses.push(guess);
    if (guess === gameState.secret) {
      gameState.scores[playerId()] = (gameState.scores[playerId()] || 0) + 1;
      gameState.secret = 1 + Math.floor(Math.random() * (activeGame.mode === 'code' ? 9999 : 100));
      gameState.guesses = [];
      gameState.status = `${getPlayerName(playerId())} cracked it! New code generated.`;
    } else {
      const difference = Math.abs(gameState.secret - guess);
      gameState.status = activeGame.mode === 'code'
        ? `Incorrect. ${difference < 100 ? 'Very close!' : 'Keep decoding.'}`
        : `${guess < gameState.secret ? 'Higher!' : 'Lower!'} · ${difference <= 5 ? 'Very close!' : difference <= 15 ? 'Getting warm.' : 'Cold.'}`;
    }
    input.value = '';
    sendState();
  });
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') submit.click(); });
  card.append(input, submit);
  showStatus(card, gameState.status || (activeGame.mode === 'code' ? 'Guess the four-digit number.' : 'First to find the secret number scores.'));
}

function renderBuilder(card) {
  const progress = document.createElement('h3');
  progress.textContent = `Beacon materials: ${gameState.materials} / ${gameState.goal}`;
  const help = document.createElement('p');
  help.textContent = 'Everyone contributes to the shared build. Gather enough materials to light the beacon.';
  const actions = document.createElement('div');
  actions.className = 'mini-game-actions';
  ['Gather wood 🪵', 'Mine stone 🪨', 'Find a crystal 💎'].forEach((label) => actions.append(makeButton(label, () => {
    gameState.materials += label.startsWith('Find') ? 3 : 1;
    gameState.builders[playerId()] = (gameState.builders[playerId()] || 0) + 1;
    gameState.status = gameState.materials >= gameState.goal ? 'The beacon is built! You did it together!' : `${getPlayerName(playerId())} added materials.`;
    sendState();
  })));
  card.append(progress, help, actions);
  showStatus(card, gameState.status || 'Co-op objective');
}

const platformerWorlds = {
  neon: { sky: '#111532', far: '#252b61', ground: '#25203e', platform: '#5446b8', accent: '#50f2d2', hazard: '#ff4f9a' },
  cave: { sky: '#171325', far: '#34284b', ground: '#30253c', platform: '#655078', accent: '#6fffe0', hazard: '#ff784e' },
  space: { sky: '#090e24', far: '#1a2850', ground: '#1c263e', platform: '#394c76', accent: '#72d7ff', hazard: '#ff6b82' },
  sky: { sky: '#85d5ff', far: '#b7eaff', ground: '#537a8c', platform: '#6cab72', accent: '#fff0a6', hazard: '#fa7764' },
  maze: { sky: '#1b202c', far: '#303a4a', ground: '#394556', platform: '#60758a', accent: '#f7d66b', hazard: '#ff5364' },
  alien: { sky: '#101c22', far: '#23433e', ground: '#284a3b', platform: '#46755a', accent: '#bdff62', hazard: '#ff61d5' },
  moon: { sky: '#171a31', far: '#292c49', ground: '#55566c', platform: '#77798e', accent: '#e5f0ff', hazard: '#ff9c67' },
  jungle: { sky: '#143528', far: '#24573e', ground: '#3d5634', platform: '#668747', accent: '#ffd66f', hazard: '#ff6155' }
};

function createPlatformerPlayer() {
  return { x: 48, y: 0, vx: 0, vy: 0, onGround: false, score: 0, lives: 3, collected: [], won: false };
}

function getPlatformerLevel(game) {
  const seed = game.id.length;
  const platforms = [
    { x: 0, y: 478, w: 420, h: 70 }, { x: 500, y: 430, w: 145, h: 18 },
    { x: 710, y: 375, w: 150, h: 18 }, { x: 940, y: 430, w: 170, h: 18 },
    { x: 1190, y: 365, w: 150, h: 18 }, { x: 1430, y: 420, w: 170, h: 18 },
    { x: 1680, y: 350, w: 180, h: 18 }, { x: 1900, y: 478, w: 320, h: 70 }
  ];
  if (seed % 2) platforms.splice(3, 0, { x: 875, y: 315, w: 110, h: 16 });
  const coins = [
    { x: 270, y: 430 }, { x: 555, y: 385 }, { x: 770, y: 330 },
    { x: 985, y: 385 }, { x: 1245, y: 320 }, { x: 1490, y: 375 },
    { x: 1740, y: 305 }, { x: 2040, y: 430 }
  ];
  const hazards = [
    { x: 335, y: 458, w: 36, h: 20 }, { x: 1020, y: 410, w: 40, h: 20 },
    { x: 1510, y: 400, w: 38, h: 20 }
  ];
  return { width: 2220, height: 548, platforms, coins, hazards, goal: { x: 2130, y: 398, w: 28, h: 80 } };
}

function renderPlatformer(card) {
  const canvas = document.createElement('canvas');
  canvas.className = 'game-canvas platformer-canvas';
  canvas.width = 960;
  canvas.height = 548;
  canvas.setAttribute('aria-label', `${activeGame.name} 2D platform game`);
  const help = document.createElement('p');
  help.className = 'game-key-help';
  help.textContent = 'Move: ←/→ or A/D · Jump: ↑, W, or Space. Touch controls are below.';
  const controls = document.createElement('div');
  controls.className = 'platformer-controls';
  [['◀', 'left'], ['JUMP', 'jump'], ['▶', 'right']].forEach(([label, action]) => {
    const button = makeButton(label, () => {}, 'platformer-control');
    button.setAttribute('aria-label', action === 'jump' ? 'Jump' : `Move ${action}`);
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      platformerKeys.add(action);
      if (action === 'jump') jumpPlatformer();
    });
    const stop = () => platformerKeys.delete(action);
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointercancel', stop);
    button.addEventListener('lostpointercapture', stop);
    controls.append(button);
  });
  const restart = makeButton('Restart level', restartPlatformer, 'btn-secondary platformer-restart');
  card.append(canvas, help, controls, restart);
  activeCanvas = canvas;
  gameState.platformers ||= {};
  gameState.platformers[playerId()] ||= createPlatformerPlayer();
  if (!gameState.platformers[playerId()].y) {
    gameState.platformers[playerId()].y = 430;
    gameState.platformers[playerId()].onGround = true;
  }
  platformerPreviousTime = 0;
  drawPlatformer(canvas);
  if (platformerFrame) cancelAnimationFrame(platformerFrame);
  platformerFrame = requestAnimationFrame(tickPlatformer);
  showStatus(card, 'Collect glowing orbs, avoid hazards, and touch the beacon to finish.');
}

function drawPlatformer(canvas) {
  if (!canvas || !gameState || activeGame?.mode !== 'platformer') return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const palette = platformerWorlds[activeGame.theme] || platformerWorlds.neon;
  const level = getPlatformerLevel(activeGame);
  const players = gameState.platformers || {};
  const localPlayer = players[playerId()] || createPlatformerPlayer();
  const cameraX = Math.max(0, Math.min(level.width - canvas.width, localPlayer.x - canvas.width * 0.35));
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = palette.sky;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = palette.far;
  for (let i = 0; i < 7; i += 1) {
    const x = (i * 190 - (cameraX * 0.2) % 190);
    context.beginPath();
    context.arc(x + 80, 380, 120 + (i % 3) * 20, Math.PI, 0);
    context.fill();
  }
  context.save();
  context.translate(-cameraX, 0);
  level.platforms.forEach((platform) => {
    context.fillStyle = palette.ground;
    context.fillRect(platform.x, platform.y, platform.w, platform.h);
    context.fillStyle = palette.platform;
    context.fillRect(platform.x, platform.y, platform.w, Math.min(9, platform.h));
  });
  (gameState.coins || []).forEach((coin) => {
    if (coin.collected) return;
    context.fillStyle = palette.accent;
    context.beginPath();
    context.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.stroke();
  });
  level.hazards.forEach((hazard) => {
    context.fillStyle = palette.hazard;
    context.beginPath();
    context.moveTo(hazard.x, hazard.y + hazard.h);
    context.lineTo(hazard.x + hazard.w / 2, hazard.y);
    context.lineTo(hazard.x + hazard.w, hazard.y + hazard.h);
    context.closePath();
    context.fill();
  });
  context.fillStyle = palette.accent;
  context.fillRect(level.goal.x, level.goal.y, level.goal.w, level.goal.h);
  context.fillStyle = '#fff';
  context.font = 'bold 15px sans-serif';
  context.fillText('GOAL', level.goal.x - 3, level.goal.y - 9);
  Object.entries(players).forEach(([id, player], index) => {
    context.fillStyle = id === playerId() ? '#ffdf66' : '#ff78b4';
    context.fillRect(player.x, player.y, 28, 40);
    context.fillStyle = '#17212b';
    context.fillRect(player.x + 6, player.y + 9, 5, 5);
    context.fillRect(player.x + 18, player.y + 9, 5, 5);
    context.fillStyle = '#fff';
    context.font = '12px sans-serif';
    context.fillText(id === playerId() ? 'YOU' : getPlayerName(id), player.x - 8, player.y - 6 - index * 12);
  });
  context.restore();
  context.fillStyle = '#fff';
  context.font = 'bold 18px sans-serif';
  context.fillText(`${activeGame.name}  ·  Orbs ${localPlayer.score}/${level.coins.length}  ·  Lives ${localPlayer.lives}`, 16, 28);
  if (localPlayer.won) {
    context.fillStyle = 'rgba(0,0,0,.65)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.font = 'bold 36px sans-serif';
    context.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2);
    context.font = '18px sans-serif';
    context.fillText(`You collected ${localPlayer.score} orbs. Press Restart to play again.`, canvas.width / 2, canvas.height / 2 + 34);
    context.textAlign = 'start';
  } else if (localPlayer.lives <= 0) {
    context.fillStyle = 'rgba(0,0,0,.68)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.font = 'bold 36px sans-serif';
    context.fillText('OUT OF LIVES', canvas.width / 2, canvas.height / 2);
    context.font = '18px sans-serif';
    context.fillText('Press Restart level to try again.', canvas.width / 2, canvas.height / 2 + 34);
    context.textAlign = 'start';
  }
}

function tickPlatformer(timestamp) {
  if (activeGame?.mode !== 'platformer' || gamePlayWindow.hidden || !activeCanvas) {
    platformerFrame = null;
    return;
  }
  const dt = platformerPreviousTime ? Math.min((timestamp - platformerPreviousTime) / 1000, 0.04) : 0;
  platformerPreviousTime = timestamp;
  updatePlatformer(dt);
  drawPlatformer(activeCanvas);
  platformerFrame = requestAnimationFrame(tickPlatformer);
}

function updatePlatformer(dt) {
  const level = getPlatformerLevel(activeGame);
  const players = gameState.platformers || (gameState.platformers = {});
  const player = players[playerId()] || (players[playerId()] = createPlatformerPlayer());
  if (player.won || player.lives <= 0) return;
  const previousY = player.y;
  const moveLeft = platformerKeys.has('left') || platformerKeys.has('arrowleft') || platformerKeys.has('a');
  const moveRight = platformerKeys.has('right') || platformerKeys.has('arrowright') || platformerKeys.has('d');
  player.vx = (moveRight ? 230 : 0) - (moveLeft ? 230 : 0);
  player.x = Math.max(0, Math.min(level.width - 28, player.x + player.vx * dt));
  player.vy = Math.min(760, player.vy + 1450 * dt);
  player.y += player.vy * dt;
  player.onGround = false;
  level.platforms.forEach((platform) => {
    const overlapsX = player.x + 28 > platform.x && player.x < platform.x + platform.w;
    const crossedTop = previousY + 40 <= platform.y && player.y + 40 >= platform.y;
    if (overlapsX && crossedTop && player.vy >= 0) {
      player.y = platform.y - 40;
      player.vy = 0;
      player.onGround = true;
    }
  });
  if (player.y > level.height + 80) resetPlatformerPlayer(player, true);
  (gameState.coins || []).forEach((coin) => {
    if (coin.collected) return;
    if (player.x + 28 > coin.x - 10 && player.x < coin.x + 10 && player.y + 40 > coin.y - 10 && player.y < coin.y + 10) {
      coin.collected = true;
      player.score += 1;
      gameState.scores[playerId()] = player.score;
    }
  });
  level.hazards.forEach((hazard) => {
    if (player.x + 28 > hazard.x && player.x < hazard.x + hazard.w && player.y + 40 > hazard.y && player.y + 40 < hazard.y + hazard.h + 18) {
      resetPlatformerPlayer(player, true);
    }
  });
  if (player.x + 28 > level.goal.x && player.y + 40 > level.goal.y - 30) {
    player.won = true;
    gameState.status = `${getPlayerName(playerId())} completed ${activeGame.name}!`;
  }
  if (gameRoomChannel && (moveLeft || moveRight || !player.onGround) && timestamp - platformerLastBroadcast > 100) {
    platformerLastBroadcast = timestamp;
    gameRoomChannel.send({
      type: 'broadcast',
      event: 'platformer-player',
      payload: { userId: playerId(), player, coins: gameState.coins, score: player.score }
    });
  }
}

function jumpPlatformer() {
  const player = gameState?.platformers?.[playerId()];
  if (activeGame?.mode === 'platformer' && player?.onGround && !player.won && player.lives > 0) {
    player.vy = -560;
    player.onGround = false;
  }
}

function resetPlatformerPlayer(player, loseLife = false) {
  if (loseLife) player.lives = Math.max(0, player.lives - 1);
  player.x = 48;
  player.y = 438;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  if (player.lives <= 0) gameState.status = 'Out of lives! Press Restart to try again.';
}

function restartPlatformer() {
  const level = getPlatformerLevel(activeGame);
  gameState.platformers[playerId()] = createPlatformerPlayer();
  gameState.platformers[playerId()].y = 438;
  gameState.coins = level.coins.map((coin) => ({ ...coin, collected: false }));
  gameState.status = 'Level restarted.';
  sendState();
}

function renderActiveGame() {
  if (!activeGame || !gameState) return;
  builtInGame.replaceChildren();
  activeCanvas = null;
  const card = makeCard();
  const title = document.createElement('h3');
  title.textContent = activeGame.name;
  const difficulty = document.createElement('p');
  difficulty.textContent = `${activeGame.difficulty} · ${roomPlayerList.length > 1 ? `${roomPlayerList.length} players connected` : 'solo or room play'}${activeGame.mode === 'platformer' ? ' · 2D platformer' : ''}`;
  card.append(title, difficulty);
  if (activeGame.mode === 'board') renderBoard(card);
  else if (activeGame.mode === 'quiz') renderQuiz(card);
  else if (activeGame.mode === 'math') renderMath(card);
  else if (activeGame.mode === 'word') renderWord(card);
  else if (activeGame.mode === 'reaction') renderReaction(card);
  else if (activeGame.mode === 'memory') renderMemory(card);
  else if (activeGame.mode === 'pattern') renderPattern(card);
  else if (activeGame.mode === 'rps') renderRps(card);
  else if (activeGame.mode === 'guess' || activeGame.mode === 'code') renderGuess(card);
  else if (activeGame.mode === 'builder') renderBuilder(card);
  else if (activeGame.mode === 'platformer') renderPlatformer(card);
  addScores(card);
  builtInGame.append(card);
}

function clearGameTimers() {
  if (reactionTimer) clearTimeout(reactionTimer);
  if (memoryTimer) clearTimeout(memoryTimer);
  reactionTimer = null;
  memoryTimer = null;
  platformerKeys.clear();
  if (platformerFrame) cancelAnimationFrame(platformerFrame);
  platformerFrame = null;
}

function updateFullscreenButton() {
  const isFullscreen = document.fullscreenElement === gamePlayArea;
  fullscreenGameBtn.textContent = isFullscreen ? '⤢' : '⛶';
  fullscreenGameBtn.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
  fullscreenGameBtn.setAttribute('aria-label', fullscreenGameBtn.title);
}

async function openGameRoom() {
  const code = createRoomCode();
  await connectGameRoom(code, true);
}

document.getElementById('createGameRoomBtn').addEventListener('click', openGameRoom);
document.getElementById('joinGameRoomForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('joinGameRoomCode');
  const code = input.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
    setText(gameRoomStatus, 'Room codes are six letters/numbers (excluding confusing characters).');
    return;
  }
  await connectGameRoom(code, false);
  input.value = '';
});
document.getElementById('leaveGameRoomBtn').addEventListener('click', leaveGameRoom);
document.getElementById('copyGameRoomCodeBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(gameRoomCodeValue || '');
    setText(gameRoomStatus, 'Room code copied. Send it to your friends.');
  } catch {
    setText(gameRoomStatus, 'Copy was blocked—select the code and copy it manually.');
  }
});
gameSearchInput.addEventListener('input', () => {
  renderGameCatalog(gameSearchInput.value);
  filterExternalGames(gameSearchInput.value);
});
document.getElementById('clearGameSearchBtn').addEventListener('click', () => {
  gameSearchInput.value = '';
  renderGameCatalog();
  filterExternalGames();
  gameSearchInput.focus();
});
document.getElementById('chooseGamesBtn').addEventListener('click', () => showGameWindow('chooser'));

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
  if (!activeGame || activeGame.mode !== 'platformer' || gamePlayWindow.hidden || document.getElementById('gamesView').hidden) return;
  const key = event.key.toLowerCase();
  const action = ['arrowleft', 'a'].includes(key) ? 'left'
    : ['arrowright', 'd'].includes(key) ? 'right'
      : ['arrowup', 'w', ' '].includes(key) ? 'jump' : null;
  if (!action) return;
  event.preventDefault();
  if (action === 'jump') jumpPlatformer();
  else platformerKeys.add(action);
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if (['arrowleft', 'a'].includes(key)) platformerKeys.delete('left');
  if (['arrowright', 'd'].includes(key)) platformerKeys.delete('right');
});
window.addEventListener('blur', () => platformerKeys.clear());

fullscreenGameBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await gamePlayArea.requestFullscreen();
    else await document.exitFullscreen();
    updateFullscreenButton();
  } catch {
    setText(gameDescription, 'Fullscreen is unavailable in this browser.');
  }
});
document.addEventListener('fullscreenchange', updateFullscreenButton);

window.closeActiveGame = () => {
  platformerKeys.clear();
  if (document.fullscreenElement === gamePlayArea) document.exitFullscreen().catch(() => {});
};

externalGames.forEach(appendExternalGame);
renderGameCatalog();
filterExternalGames();

gameAdminForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('gameNameInput').value.trim();
  const url = document.getElementById('gameUrlInput').value.trim();
  if (!/^https?:\/\//i.test(url)) {
    gameAdminStatus.textContent = 'Use a valid http or https game URL.';
    return;
  }
  gameAdminStatus.textContent = 'Adding...';
  const { data: { user } } = await _supabase.auth.getUser();
  if (user?.id !== ADMIN_UUID) {
    gameAdminStatus.textContent = 'Admin access required.';
    return;
  }
  const { error } = await _supabase.from('games').insert({ name, url, created_by: user.id });
  if (error) {
    gameAdminStatus.textContent = `Could not add game: ${error.message}`;
    return;
  }
  gameAdminForm.reset();
  gameAdminStatus.textContent = 'Game added.';
  appendExternalGame({ name, url, note: 'Community game · opens externally' });
});

async function loadPublishedGames() {
  const { data, error } = await _supabase.from('games').select('id, name, url').order('created_at', { ascending: false });
  if (error) return;
  (data || []).forEach((game) => appendExternalGame({ ...game, note: 'Community game · opens externally' }));
}

async function setupGameAdmin() {
  const { data: { user } } = await _supabase.auth.getUser();
  gameRoomUser = user || null;
  if (user?.id === ADMIN_UUID) gameAdminForm.hidden = false;
}

loadPublishedGames();
setupGameAdmin();

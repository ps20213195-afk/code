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
  { id: 'neon-runner-3d', name: 'Neon Runner 3D', mode: 'explore', theme: 'neon', difficulty: 'Medium', immersive: true, description: 'Dodge glowing gates in a first-person neon tunnel.' },
  { id: 'crystal-caverns-3d', name: 'Crystal Caverns 3D', mode: 'explore', theme: 'cave', difficulty: 'Medium', immersive: true, description: 'Race through a gem-lit cavern and collect crystals.' },
  { id: 'starship-canyon-3d', name: 'Starship Canyon 3D', mode: 'explore', theme: 'space', difficulty: 'Hard', immersive: true, description: 'Pilot through a star canyon without hitting asteroids.' },
  { id: 'sky-island-dash', name: 'Sky Island Dash', mode: 'explore', theme: 'sky', difficulty: 'Easy', immersive: true, description: 'Weave between floating islands above the clouds.' },
  { id: 'pixel-maze-3d', name: 'Pixel Maze 3D', mode: 'explore', theme: 'maze', difficulty: 'Hard', immersive: true, description: 'Navigate a perspective maze and find the exit.' },
  { id: 'alien-asteroid-dodge', name: 'Alien Asteroid Dodge', mode: 'explore', theme: 'alien', difficulty: 'Hard', immersive: true, description: 'Survive the asteroid lane and outlast your rivals.' },
  { id: 'lunar-relay', name: 'Lunar Relay', mode: 'explore', theme: 'moon', difficulty: 'Medium', immersive: true, description: 'Dash across the lunar track and pass the relay beacon.' },
  { id: 'jungle-temple-run', name: 'Jungle Temple Run', mode: 'explore', theme: 'jungle', difficulty: 'Hard', immersive: true, description: 'Run the ancient temple course and dodge its hazards.' },
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
  } else if (game.mode === 'explore') {
    state.racers = {};
    state.started = Date.now();
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

function renderGameCatalog(filter = '') {
  gamesList.replaceChildren();
  const normalizedFilter = filter.trim().toLowerCase();
  const games = builtInGames.filter((game) => `${game.name} ${game.description} ${game.difficulty}`.toLowerCase().includes(normalizedFilter));
  games.forEach((game) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-choice';
    button.dataset.gameId = game.id;
    const name = document.createElement('span');
    name.textContent = `${game.immersive ? '◈ ' : ''}${game.name}`;
    const detail = document.createElement('small');
    detail.textContent = `${game.difficulty}${game.immersive ? ' · 3D-style' : ''}`;
    button.append(name, detail);
    button.addEventListener('click', () => selectBuiltInGame(game));
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
  const label = document.createElement('span');
  label.textContent = game.name;
  const note = document.createElement('span');
  note.textContent = game.note || 'Open game ↗';
  link.append(label, note);
  externalGamesList.append(link);
}

function showPlayArea() {
  gameFrameWrap.hidden = true;
  gameFrame.src = 'about:blank';
  builtInGame.hidden = false;
}

function selectBuiltInGame(game) {
  clearGameTimers();
  activeGame = game;
  gameState = makeGameState(game);
  showPlayArea();
  gameTitle.textContent = game.name;
  gameDescription.textContent = `${game.description} ${game.difficulty} difficulty${gameRoomChannel ? ' · Live room connected' : ' · Solo practice'}.`;
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.toggle('is-active', item.dataset.gameId === game.id));
  renderActiveGame();
  if (gameRoomChannel) publishGameState();
}

function selectExternalGame(game) {
  activeGame = null;
  gameState = null;
  builtInGame.hidden = true;
  gameFrameWrap.hidden = false;
  gameFrame.hidden = true;
  externalGameLink.href = game.url;
  externalGameLink.textContent = `Open ${game.name} in a new tab ↗`;
  gameTitle.textContent = game.name;
  gameDescription.textContent = `${game.note || 'External multiplayer game'} · Opens in a separate tab.`;
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.remove('is-active'));
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

function renderExplore(card) {
  const canvas = document.createElement('canvas');
  canvas.className = 'game-canvas';
  canvas.width = 800;
  canvas.height = 450;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', `${activeGame.name} first-person runner`);
  const help = document.createElement('p');
  help.className = 'game-key-help';
  help.textContent = 'Use ← / → or A / D to dodge lanes · ↑ / W to advance · Space to jump.';
  card.append(canvas, help);
  activeCanvas = canvas;
  drawExplore(canvas);
  showStatus(card, gameState.status || 'First-person 3D-style runner · move to race, dodge, and collect.');
}

function drawExplore(canvas) {
  if (!canvas || !gameState || !activeGame || activeGame.mode !== 'explore') return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const colors = {
    neon: ['#07142d', '#16e0bd', '#f54fc7'], cave: ['#1d1029', '#55e5d3', '#fa9c68'],
    space: ['#07091c', '#73c7ff', '#ff6b6b'], sky: ['#365b91', '#f6f1c3', '#ff9d74'],
    maze: ['#111827', '#9ca3af', '#fbbf24'], alien: ['#07150f', '#8cff52', '#fd4bff'],
    moon: ['#242638', '#dce6ff', '#ffca68'], jungle: ['#102417', '#a2e17b', '#f5cb68']
  }[activeGame.theme] || ['#101629', '#8ad4ff', '#ff76c8'];
  const [sky, edge, accent] = colors;
  const { width, height } = canvas;
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  const horizon = height * 0.43;
  const gradient = context.createLinearGradient(0, horizon, 0, height);
  gradient.addColorStop(0, '#36475c');
  gradient.addColorStop(1, '#10131d');
  context.fillStyle = gradient;
  context.fillRect(0, horizon, width, height - horizon);
  context.fillStyle = edge;
  context.globalAlpha = 0.75;
  context.beginPath();
  context.moveTo(width * 0.28, horizon);
  context.lineTo(width * 0.44, height);
  context.lineTo(width * 0.56, height);
  context.lineTo(width * 0.72, horizon);
  context.closePath();
  context.fill();
  context.globalAlpha = 1;
  context.strokeStyle = 'rgba(255,255,255,.28)';
  context.lineWidth = 2;
  for (let step = 1; step <= 7; step += 1) {
    const ratio = step / 7;
    const y = horizon + (height - horizon) * ratio ** 1.8;
    context.beginPath();
    context.moveTo(width * (0.28 - ratio * 0.16), y);
    context.lineTo(width * (0.72 + ratio * 0.16), y);
    context.stroke();
  }
  for (let lane = 0; lane < 4; lane += 1) {
    const ratio = lane / 3;
    context.beginPath();
    context.moveTo(width * (0.5 + (ratio - 0.5) * 0.18), horizon);
    context.lineTo(width * ratio, height);
    context.stroke();
  }
  const runners = gameState.racers || {};
  const me = runners[playerId()] || { lane: 1, distance: 0 };
  for (let depth = 1; depth <= 5; depth += 1) {
    const obstacleDistance = Math.floor(me.distance / 8) * 8 + depth * 8;
    const obstacleLane = ((obstacleDistance * 7 + activeGame.id.length) % 3) - 1;
    const perspective = 1 - depth / 7;
    const x = width * (0.5 + obstacleLane * 0.15 * perspective);
    const y = horizon + (height - horizon) * perspective ** 1.8;
    const size = 12 + perspective * 70;
    context.fillStyle = depth % 3 === 0 ? accent : edge;
    context.fillRect(x - size / 2, y - size / 2, size, size * 0.65);
    context.strokeStyle = '#fff';
    context.strokeRect(x - size / 2, y - size / 2, size, size * 0.65);
  }
  context.fillStyle = '#fff';
  context.font = 'bold 20px sans-serif';
  context.fillText(`${activeGame.name} · ${Math.floor(me.distance)} m`, 18, 30);
  context.font = '14px sans-serif';
  context.fillText(`Lane ${me.lane + 2} · Score ${gameState.scores[playerId()] || 0}`, 18, 54);
  const visiblePlayers = Object.entries(runners).filter(([id]) => id !== playerId());
  visiblePlayers.forEach(([id, runner], index) => {
    context.fillStyle = accent;
    context.fillText(`${getPlayerName(id)} · ${Math.floor(runner.distance)} m`, 18, height - 20 - index * 20);
  });
  context.fillStyle = '#fff';
  context.beginPath();
  context.moveTo(width / 2, height - 22);
  context.lineTo(width / 2 - 14, height - 4);
  context.lineTo(width / 2 + 14, height - 4);
  context.closePath();
  context.fill();
}

function moveExplore(key) {
  if (!activeGame || activeGame.mode !== 'explore' || !gameState) return;
  const runners = gameState.racers || (gameState.racers = {});
  const runner = runners[playerId()] || (runners[playerId()] = { lane: 0, distance: 0, energy: 3 });
  if (key === 'ArrowLeft' || key.toLowerCase() === 'a') runner.lane = Math.max(-1, runner.lane - 1);
  else if (key === 'ArrowRight' || key.toLowerCase() === 'd') runner.lane = Math.min(1, runner.lane + 1);
  else if (key === 'ArrowUp' || key.toLowerCase() === 'w' || key === ' ') {
    runner.distance += key === ' ' ? 3 : 5;
    const hazardLane = (Math.floor(runner.distance / 10) * 7 + activeGame.id.length) % 3 - 1;
    if (Math.floor(runner.distance) % 10 < 6 && runner.lane === hazardLane) {
      runner.energy = Math.max(0, runner.energy - 1);
      runner.distance = Math.max(0, runner.distance - 3);
      gameState.status = runner.energy ? 'Bump! Change lanes before the next gate.' : `${getPlayerName(playerId())} is out of energy—keep going carefully!`;
    } else {
      gameState.scores[playerId()] = Math.floor(runner.distance / 10);
      gameState.status = `${getPlayerName(playerId())} is at ${Math.floor(runner.distance)} m · ${runner.energy} energy`;
    }
  } else return;
  publishGameState();
  if (activeCanvas) drawExplore(activeCanvas);
  const status = builtInGame.querySelector('.mini-game-status');
  if (status) status.textContent = gameState.status;
}

function renderActiveGame() {
  if (!activeGame || !gameState) return;
  builtInGame.replaceChildren();
  activeCanvas = null;
  const card = makeCard();
  const title = document.createElement('h3');
  title.textContent = activeGame.name;
  const difficulty = document.createElement('p');
  difficulty.textContent = `${activeGame.difficulty} · ${roomPlayerList.length > 1 ? `${roomPlayerList.length} players connected` : 'solo or room play'}${activeGame.immersive ? ' · immersive 3D-style view' : ''}`;
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
  else if (activeGame.mode === 'explore') renderExplore(card);
  addScores(card);
  builtInGame.append(card);
}

function clearGameTimers() {
  if (reactionTimer) clearTimeout(reactionTimer);
  if (memoryTimer) clearTimeout(memoryTimer);
  reactionTimer = null;
  memoryTimer = null;
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
document.getElementById('gameSearchInput').addEventListener('input', (event) => renderGameCatalog(event.target.value));

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (activeGame?.mode === 'explore' && !document.getElementById('gamesView').hidden) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(event.key) || ['a', 'd', 'w'].includes(event.key.toLowerCase())) {
      event.preventDefault();
      moveExplore(event.key);
    }
  }
});

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
  if (document.fullscreenElement === gamePlayArea) document.exitFullscreen().catch(() => {});
};

externalGames.forEach(appendExternalGame);
renderGameCatalog();

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

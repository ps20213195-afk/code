const embeddedGames = [
  { name: 'Poxel.io', url: 'https://poxel.io/' },
  { name: 'Bloxd.io', url: 'https://bloxd.io/' },
  { name: 'Shell Shockers', url: 'https://shellshock.io/' }
];

const gamesList = document.getElementById('gamesList');
const gameFrame = document.getElementById('gameFrame');
const gameEmpty = document.getElementById('gameEmpty');
const gameTitle = document.getElementById('gameTitle');
const fullscreenGameBtn = document.getElementById('fullscreenGameBtn');
const gameAdminForm = document.getElementById('gameAdminForm');
const gameAdminStatus = document.getElementById('gameAdminStatus');
const ADMIN_UUID = '13df2e26-2285-43de-855d-ba42c9c9ff8d';

function selectGame(game, button) {
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  gameTitle.textContent = game.name;
  gameEmpty.hidden = true;
  gameFrame.hidden = false;
  gameFrame.src = game.url;
}

function closeActiveGame() {
  if (document.fullscreenElement === document.querySelector('.game-frame-wrap')) {
    document.exitFullscreen().catch(() => {});
  }
  gameFrame.src = 'about:blank';
  gameFrame.hidden = true;
  gameEmpty.hidden = false;
  gameTitle.textContent = 'Select a game';
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.remove('is-active'));
}

window.closeActiveGame = closeActiveGame;

function appendGameButton(game) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game-choice';
  button.textContent = game.name;
  button.addEventListener('click', () => selectGame(game, button));
  gamesList.append(button);
}

embeddedGames.forEach(appendGameButton);

async function loadPublishedGames() {
  const { data, error } = await _supabase.from('games').select('id, name, url').order('created_at', { ascending: false });
  if (error) return;
  (data || []).forEach(appendGameButton);
}

async function setupGameAdmin() {
  const { data: { user } } = await _supabase.auth.getUser();
  if (user?.id === ADMIN_UUID) gameAdminForm.hidden = false;
}

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
  await loadPublishedGames();
});

function updateFullscreenButton() {
  const isFullscreen = document.fullscreenElement === document.querySelector('.game-frame-wrap');
  fullscreenGameBtn.textContent = isFullscreen ? '⤢' : '⛶';
  fullscreenGameBtn.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
  fullscreenGameBtn.setAttribute('aria-label', fullscreenGameBtn.title);
}

fullscreenGameBtn.addEventListener('click', async () => {
  const frameWrap = document.querySelector('.game-frame-wrap');
  if (!document.fullscreenElement) {
    await frameWrap.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
  updateFullscreenButton();
});

document.addEventListener('fullscreenchange', updateFullscreenButton);

loadPublishedGames();
setupGameAdmin();
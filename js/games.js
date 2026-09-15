const embeddedGames = [
  { name: 'Poxel.io', url: 'https://poxel.io/' }
];

const gamesList = document.getElementById('gamesList');
const gameFrame = document.getElementById('gameFrame');
const gameEmpty = document.getElementById('gameEmpty');
const gameTitle = document.getElementById('gameTitle');
const fullscreenGameBtn = document.getElementById('fullscreenGameBtn');

function selectGame(game, button) {
  document.querySelectorAll('.game-choice').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  gameTitle.textContent = game.name;
  gameEmpty.hidden = true;
  gameFrame.hidden = false;
  gameFrame.src = game.url;
}

embeddedGames.forEach((game) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game-choice';
  button.textContent = game.name;
  button.addEventListener('click', () => selectGame(game, button));
  gamesList.append(button);
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
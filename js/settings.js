const settingsDefaults = {
  theme: 'classic',
  font: 'capsmall',
  textSize: '1',
  motion: true
};

const settingsControls = {
  theme: document.getElementById('themeSetting'),
  font: document.getElementById('fontSetting'),
  textSize: document.getElementById('textSizeSetting'),
  motion: document.getElementById('motionSetting'),
  reset: document.getElementById('resetSettingsBtn')
};

function readSettings() {
  try {
    return { ...settingsDefaults, ...JSON.parse(localStorage.getItem('skybase-settings') || '{}') };
  } catch {
    return { ...settingsDefaults };
  }
}

function applySettings(settings) {
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.style.setProperty('--font-family', `'${settings.font}'`);
  root.style.setProperty('--font-multiplier', settings.textSize);
  root.style.setProperty('--motion-scale', settings.motion ? '1' : '0');
  settingsControls.theme.value = settings.theme;
  settingsControls.font.value = settings.font;
  settingsControls.textSize.value = settings.textSize;
  settingsControls.motion.checked = settings.motion;
}

function saveSettings() {
  const settings = {
    theme: settingsControls.theme.value,
    font: settingsControls.font.value,
    textSize: settingsControls.textSize.value,
    motion: settingsControls.motion.checked
  };
  localStorage.setItem('skybase-settings', JSON.stringify(settings));
  applySettings(settings);
}

[settingsControls.theme, settingsControls.font, settingsControls.textSize, settingsControls.motion]
  .forEach((control) => control.addEventListener('change', saveSettings));
settingsControls.reset.addEventListener('click', () => {
  localStorage.removeItem('skybase-settings');
  applySettings(settingsDefaults);
});

applySettings(readSettings());
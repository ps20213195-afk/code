const cloakElements = {
  title: document.getElementById('cloakTitleInput'),
  domain: document.getElementById('cloakDomainInput'),
  applyButton: document.getElementById('applyCloakBtn'),
  resetButton: document.getElementById('resetCloakBtn'),
  status: document.getElementById('cloakStatus')
};

const originalPageTitle = document.title;
const originalFaviconUrl = document.getElementById('favicon')?.href;
const CLOAK_STORAGE_KEY = 'skybase-tab-cloak';

function applyTabCloak(title, domain) {
  const cleanTitle = title.trim();
  const cleanDomain = domain.trim().toLowerCase();
  const validDomain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/i.test(cleanDomain);

  if (!cleanTitle || !validDomain) {
    cloakElements.status.textContent = 'Enter a title and a valid domain name.';
    return;
  }

  document.title = cleanTitle;
  changeFavicon(`https://a.favicon.im/${encodeURIComponent(cleanDomain)}`);
  localStorage.setItem(CLOAK_STORAGE_KEY, JSON.stringify({ title: cleanTitle, domain: cleanDomain }));
  cloakElements.status.textContent = `Tab cloaked as ${cleanTitle}.`;
}

cloakElements.applyButton.addEventListener('click', () => {
  applyTabCloak(cloakElements.title.value, cloakElements.domain.value);
});

cloakElements.resetButton.addEventListener('click', () => {
  localStorage.removeItem(CLOAK_STORAGE_KEY);
  document.title = originalPageTitle;
  if (originalFaviconUrl) changeFavicon(originalFaviconUrl);
  cloakElements.title.value = 'Google';
  cloakElements.domain.value = 'google.com';
  cloakElements.status.textContent = 'Tab title and favicon restored.';
});

try {
  const savedCloak = JSON.parse(localStorage.getItem(CLOAK_STORAGE_KEY) || 'null');
  if (savedCloak?.title && savedCloak?.domain) {
    cloakElements.title.value = savedCloak.title;
    cloakElements.domain.value = savedCloak.domain;
    applyTabCloak(savedCloak.title, savedCloak.domain);
  }
} catch (error) {
  console.warn('Saved tab cloak settings could not be loaded.', error);
}

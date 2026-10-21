const extensionElements = {
  status: document.getElementById('extensionsStatus'),
  catalog: document.getElementById('extensionCatalog'),
  installed: document.getElementById('installedExtensions')
};

const EXTENSION_INDEX_URL = './extensions/index.json';
const EXTENSION_STORAGE_KEY = 'skybase-installed-extensions';
const EXTENSION_SCRIPT_APPROVAL_KEY = 'skybase-approved-extension-scripts';
const EXTENSION_THEME_STORAGE_KEY = 'skybase-active-extension-theme';
const EXTENSION_TYPES = new Set(['WIN', 'COL', 'PAR', 'CSS', 'THEME']);
const executedExtensionScripts = new Set();
const EXTENSION_THEME_SELECTORS = {
  '^theme': ':root',
  '^colorset': ':root',
  '^body': 'body',
  '^panel': '.panel',
  '^header': '.panel-header',
  '^button': 'button',
  '^text': 'body, button, input, textarea, select',
  '^heading': '.panel h1, .panel h2, .panel h3',
  '^tab': '.view-tab',
  '^input': 'input, textarea, select'
};

function getInstalledExtensionIds() {
  try {
    const value = JSON.parse(localStorage.getItem(EXTENSION_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveInstalledExtensionIds(ids) {
  localStorage.setItem(EXTENSION_STORAGE_KEY, JSON.stringify([...ids]));
}

function getApprovedScriptExtensionIds() {
  try {
    const value = JSON.parse(localStorage.getItem(EXTENSION_SCRIPT_APPROVAL_KEY) || '[]');
    return new Set(Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function confirmExtensionScripts(extension, scriptCount) {
  const approved = getApprovedScriptExtensionIds();
  if (!scriptCount || approved.has(extension.id)) return true;
  const accepted = window.confirm(
    `${extension.name} contains ${scriptCount} script${scriptCount === 1 ? '' : 's'}. `
    + 'Scripts run with this website’s privileges and may read or change data available to the site, including your signed-in session. '
    + 'Only continue if you trust the extension. Script installation is at your own risk. Continue?'
  );
  if (accepted) {
    approved.add(extension.id);
    localStorage.setItem(EXTENSION_SCRIPT_APPROVAL_KEY, JSON.stringify([...approved]));
  }
  return accepted;
}

function enablePersistentExtensionControls(extension, container) {
  container.querySelectorAll('input[type="checkbox"][data-extension-persist]').forEach((checkbox) => {
    const controlId = checkbox.dataset.extensionPersist;
    if (!controlId) return;
    const storageKey = `skybase-extension-state:${extension.id}:${controlId}`;
    try {
      checkbox.checked = localStorage.getItem(storageKey) === 'true';
    } catch {
      // Keep the checkbox usable for this session if browser storage is unavailable.
    }
    checkbox.addEventListener('change', () => {
      try {
        localStorage.setItem(storageKey, String(checkbox.checked));
      } catch {
        // The extension still works without persistence when storage is unavailable.
      }
    });
  });
}

function parseExtensionFile(text, id) {
  const typeMatch = text.match(/^\s*!@TYPE:\s*(WIN|COL|PAR|CSS|THEME)\s*;/im);
  const nameMatch = text.match(/^\s*!@NAME:\s*([^;\r\n]+)\s*;/im);
  const type = typeMatch?.[1]?.toUpperCase();
  if (!type || !EXTENSION_TYPES.has(type)) throw new Error('Missing or unsupported !@TYPE directive.');

  const blocks = [];
  const blockPattern = type === 'THEME'
    ? /\^\/\\\^([\s\S]*?)v\\\/v/g
    : /&&START(\d+)&&;([\s\S]*?)&&END\1&&;/g;
  let match;
  while ((match = blockPattern.exec(text))) blocks.push(type === 'THEME' ? match[1].trim() : match[2].trim());
  if (!blocks.length) {
    throw new Error(type === 'THEME'
      ? 'No theme block found. Use ^/\\^ to start and v\\/v to end it.'
      : 'No matching &&STARTn&&; / &&ENDn&&; content blocks were found.');
  }

  if (type === 'THEME') {
    return {
      id,
      name: (nameMatch?.[1] || id).trim(),
      type,
      blocks: [],
      themeCss: blocks.map(parseThemeBlock).join('\n')
    };
  }

  const sanitized = blocks.map((html) => {
    const source = new DOMParser().parseFromString(html, 'text/html');
    const scripts = [...source.querySelectorAll('script')]
      .filter((script) => {
        const scriptType = (script.getAttribute('type') || '').trim().toLowerCase();
        return !scriptType || ['text/javascript', 'application/javascript', 'module'].includes(scriptType);
      })
      .map((script) => ({
        src: script.getAttribute('src') || '',
        code: script.textContent || '',
        type: (script.getAttribute('type') || '').trim().toLowerCase()
      }));
    const css = [...source.querySelectorAll('style, script[type="text/css"], script[data-extension-css]')]
      .map((script) => script.textContent || '')
      .join('\n');
    source.querySelectorAll('script, style, iframe, object, embed, form, base, meta, link').forEach((element) => element.remove());
    const cleanHtml = window.DOMPurify
      ? DOMPurify.sanitize(source.body.innerHTML, { USE_PROFILES: { html: true } })
      : source.body.textContent || '';
    return { html: cleanHtml, css: sanitizeExtensionCss(css), scripts };
  });

  return {
    id,
    name: (nameMatch?.[1] || id).trim(),
    type,
    blocks: sanitized
  };
}

function parseThemeBlock(block) {
  const rules = [];
  let currentSelector = null;
  let declarations = [];
  const flush = () => {
    if (!currentSelector || !declarations.length) return;
    rules.push(`${currentSelector} { ${declarations.join(' ')} }`);
    declarations = [];
  };

  block.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) return;
    if (line.startsWith('^')) {
      flush();
      currentSelector = EXTENSION_THEME_SELECTORS[line.toLowerCase()];
      if (!currentSelector) throw new Error(`Unknown theme token: ${line}`);
      return;
    }
    if (!currentSelector) throw new Error('Theme declarations must follow a selector token such as ^colorset or ^body.');
    if (!/^(--[a-z0-9-]+|[a-z][a-z0-9-]*)\s*:\s*[^{};]+;?$/i.test(line)) {
      throw new Error(`Invalid theme declaration: ${line}`);
    }
    if (/url\s*\(|expression\s*\(|javascript:|@import/i.test(line)) {
      throw new Error('Theme declarations cannot load external or executable content.');
    }
    declarations.push(`${line.replace(/;?$/, ';')}`);
  });
  flush();
  if (!rules.length) throw new Error('Theme block did not contain any valid rules.');
  return rules.join('\n');
}

function sanitizeExtensionCss(css) {
  if (!css || /@import|url\s*\(|expression\s*\(|javascript:|behavior\s*:|-moz-binding/i.test(css)) return '';
  const rules = [];
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = rulePattern.exec(css))) {
    const selectors = match[1].trim();
    const declarations = match[2].trim();
    if (!selectors || !declarations || selectors.startsWith('@')) continue;
    const safeSelectors = selectors.split(',').map((selector) => selector.trim())
      .filter((selector) => selector && !/(^|\s)(html|body|:root)(\b|\s|$)/i.test(selector));
    if (safeSelectors.length) rules.push(`${safeSelectors.map((selector) => `.installed-extension-content ${selector}`).join(', ')} { ${declarations} }`);
  }
  return rules.join('\n');
}

function applyExtensionTheme(extension, notify = true) {
  const styleId = 'active-extension-theme';
  document.getElementById(styleId)?.remove();
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = extension.themeCss;
  document.head.append(style);
  localStorage.setItem(EXTENSION_THEME_STORAGE_KEY, extension.id);
  if (notify) showPopup(`${extension.name} theme applied`, 'success');
}

function executeExtensionScripts(extension, view) {
  const scriptCount = extension.blocks.reduce((count, block) => count + (block.scripts?.length || 0), 0);
  if (!scriptCount || executedExtensionScripts.has(extension.id)) return;
  if (!confirmExtensionScripts(extension, scriptCount)) return;
  executedExtensionScripts.add(extension.id);
  extension.blocks.forEach((block) => {
    block.scripts?.forEach((scriptInfo) => {
      const script = document.createElement('script');
      script.dataset.extensionId = extension.id;
      if (scriptInfo.type === 'module') script.type = 'module';
      if (scriptInfo.src) script.src = scriptInfo.src;
      else script.textContent = scriptInfo.code;
      view.append(script);
    });
  });
}

function renderInstalledExtensions(extensions) {
  document.querySelectorAll('.extension-view, .extension-view-tab').forEach((element) => element.remove());
  extensionElements.installed.replaceChildren();
  if (!extensions.length) {
    const empty = document.createElement('p');
    empty.className = 'extension-empty';
    empty.textContent = 'No extensions installed in this browser yet.';
    extensionElements.installed.append(empty);
    return;
  }

  extensions.forEach((extension) => {
    const viewId = `extension-view-${extension.id.replace(/[^a-z0-9_-]/gi, '-')}`;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'view-tab extension-view-tab';
    tab.dataset.extensionPanel = viewId;
    tab.setAttribute('aria-selected', 'false');
    const icon = document.createElement('span');
    icon.className = 'view-tab-icon icon-extensions';
    icon.setAttribute('aria-hidden', 'true');
    const tabLabel = document.createElement('span');
    tabLabel.textContent = extension.name;
    tab.append(icon, tabLabel);
    const settingsTab = document.querySelector('.view-tab[data-view="settings"]');
    document.getElementById('viewTabs').insertBefore(tab, settingsTab);

    const view = document.createElement('section');
    view.id = viewId;
    view.className = 'panel extension-view';
    view.hidden = true;
    view.setAttribute('aria-label', `${extension.name} extension`);
    const title = document.createElement('h3');
    title.textContent = extension.name;
    const description = document.createElement('p');
    description.textContent = extension.type === 'THEME'
      ? 'Theme extension · changes the appearance of the whole website.'
      : `${extension.type} · ${extension.blocks.length} content block${extension.blocks.length === 1 ? '' : 's'}`;
    const content = document.createElement('div');
    content.className = 'installed-extension-content';
    extension.blocks.forEach((block) => {
      const blockElement = document.createElement('div');
      blockElement.className = 'extension-content-block';
      blockElement.innerHTML = block.html;
      content.append(blockElement);
      if (block.css) {
        const style = document.createElement('style');
        style.textContent = block.css;
        view.append(style);
      }
    });
    enablePersistentExtensionControls(extension, content);
    const header = document.createElement('div');
    header.className = 'panel-header';
    header.append(title);
    const body = document.createElement('div');
    body.className = 'panel-body extension-view-body';
    body.append(description);

    if (extension.type === 'THEME') {
      const applyTheme = document.createElement('button');
      applyTheme.type = 'button';
      applyTheme.textContent = 'Apply theme';
      applyTheme.addEventListener('click', () => applyExtensionTheme(extension));
      body.append(applyTheme);
    } else {
      body.append(content);
    }

    const uninstallExtension = () => {
      const installedIds = getInstalledExtensionIds();
      installedIds.delete(extension.id);
      saveInstalledExtensionIds(installedIds);
      const approvedScripts = getApprovedScriptExtensionIds();
      approvedScripts.delete(extension.id);
      localStorage.setItem(EXTENSION_SCRIPT_APPROVAL_KEY, JSON.stringify([...approvedScripts]));
      executedExtensionScripts.delete(extension.id);
      renderInstalledExtensions((window.extensionCatalog || []).filter((item) => installedIds.has(item.id)));
      renderExtensionCatalog(window.extensionCatalog || []);
      if (localStorage.getItem(EXTENSION_THEME_STORAGE_KEY) === extension.id) {
        localStorage.removeItem(EXTENSION_THEME_STORAGE_KEY);
        document.getElementById('active-extension-theme')?.remove();
      }
      document.querySelector('.view-tab[data-view="extensions"]')?.click();
    };
    const makeUninstallButton = () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-secondary';
      button.textContent = 'Uninstall';
      button.addEventListener('click', uninstallExtension);
      return button;
    };
    const shortcut = document.createElement('article');
    shortcut.className = 'installed-extension';
    const shortcutTitle = document.createElement('h3');
    shortcutTitle.textContent = extension.name;
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Open extension tab';
    open.addEventListener('click', () => tab.click());
    shortcut.append(shortcutTitle, open, makeUninstallButton());
    extensionElements.installed.append(shortcut);
    view.append(header, body);
    body.append(makeUninstallButton());
    document.querySelector('main.page').append(view);

    tab.addEventListener('click', () => {
      document.querySelectorAll('main.page > *').forEach((panel) => {
        if (panel.matches('section, .view-content')) panel.hidden = panel !== view;
      });
      document.querySelectorAll('.view-tab').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      window.closeActiveGame?.();
      executeExtensionScripts(extension, view);
    });
  });
}

function renderExtensionCatalog(extensions) {
  const installedIds = getInstalledExtensionIds();
  extensionElements.catalog.replaceChildren();
  if (!extensions.length) {
    const empty = document.createElement('p');
    empty.className = 'extension-empty';
    empty.textContent = 'No extensions are listed in extensions/index.json.';
    extensionElements.catalog.append(empty);
    return;
  }

  extensions.forEach((extension) => {
    const card = document.createElement('article');
    card.className = 'extension-card';
    const title = document.createElement('h3');
    title.textContent = extension.name;
    const type = document.createElement('p');
    type.className = 'extension-kind';
    const scriptCount = extension.blocks.reduce((count, block) => count + (block.scripts?.length || 0), 0);
    const scriptsApproved = getApprovedScriptExtensionIds().has(extension.id);
    type.textContent = extension.type === 'THEME'
      ? 'THEME · custom site-wide colors and styles'
      : `${extension.type} · ${extension.blocks.length} content block${extension.blocks.length === 1 ? '' : 's'}${scriptCount ? ` · ${scriptCount} script${scriptCount === 1 ? '' : 's'}` : ''}`;
    const filename = document.createElement('p');
    filename.textContent = extension.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = installedIds.has(extension.id)
      ? scriptCount && !scriptsApproved ? 'Review scripts' : 'Installed'
      : 'Install';
    button.disabled = installedIds.has(extension.id) && (!scriptCount || scriptsApproved);
    button.addEventListener('click', () => {
      if (!confirmExtensionScripts(extension, scriptCount)) return;
      const ids = getInstalledExtensionIds();
      ids.add(extension.id);
      saveInstalledExtensionIds(ids);
      const installed = (window.extensionCatalog || []).filter((item) => ids.has(item.id));
      renderInstalledExtensions(installed);
      renderExtensionCatalog(window.extensionCatalog || []);
    });
    card.append(title, type, filename, button);
    extensionElements.catalog.append(card);
  });
}

async function loadExtensions() {
  extensionElements.status.textContent = 'Loading extensions...';
  try {
    const indexResponse = await fetch(EXTENSION_INDEX_URL);
    if (!indexResponse.ok) throw new Error(`Could not load extension index (${indexResponse.status}).`);
    const index = await indexResponse.json();
    const ids = Array.isArray(index.extensions) ? index.extensions : [];
    const extensions = await Promise.all(ids
      .filter((id) => typeof id === 'string' && /^[a-z0-9._-]+\.extensionformywebsite$/i.test(id))
      .map(async (id) => {
        const response = await fetch(`./extensions/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error(`Could not load ${id} (${response.status}).`);
        return parseExtensionFile(await response.text(), id);
      }));
    window.extensionCatalog = extensions;
    const installedIds = getInstalledExtensionIds();
    const installed = extensions.filter((extension) => installedIds.has(extension.id));
    renderExtensionCatalog(extensions);
    renderInstalledExtensions(installed);
    extensionElements.status.textContent = `${extensions.length} available · ${installed.length} installed`;
    const activeThemeId = localStorage.getItem(EXTENSION_THEME_STORAGE_KEY);
    const activeTheme = installed.find((extension) => extension.id === activeThemeId && extension.type === 'THEME');
    if (activeTheme) applyExtensionTheme(activeTheme, false);
    else document.getElementById('active-extension-theme')?.remove();
  } catch (error) {
    extensionElements.status.textContent = 'Could not load extensions';
    const message = document.createElement('p');
    message.className = 'extension-empty';
    message.textContent = error.message;
    extensionElements.catalog.replaceChildren(message);
  }
}

loadExtensions();

(() => {
  const STORAGE_PREFIX = 'skybase-site-shop-v1';
  const STARTING_POINTS = 25;
  const balanceEl = document.getElementById('shopPointBalance');
  const summaryEl = document.getElementById('shopSummary');
  const catalogEl = document.getElementById('shopCatalog');
  const PRODUCTS = [
    { id: 'double-jump', name: 'Double Jump', description: 'Unlock a second jump before landing.', cost: [50], maxLevel: 1 },
    { id: 'swift-boots', name: 'Swift Boots', description: 'Move faster in platformers. Each level adds 35 movement speed.', cost: [30, 45, 60], maxLevel: 3 },
    { id: 'orb-magnet', name: 'Orb Magnet', description: 'Collect platformer orbs from farther away. Each level increases pickup range.', cost: [35, 50, 65], maxLevel: 3 },
    { id: 'heart-container', name: 'Heart Container', description: 'Start each platformer run with one extra life per level purchased.', cost: [45, 65], maxLevel: 2 }
  ];

  let accountKey = `${STORAGE_PREFIX}:local`;
  let state = { points: STARTING_POINTS, upgrades: {}, receipts: [] };

  function normalizeState(value) {
    const candidate = value && typeof value === 'object' ? value : {};
    const points = Number(candidate.points);
    const upgrades = candidate.upgrades && typeof candidate.upgrades === 'object' ? candidate.upgrades : {};
    return {
      points: Number.isSafeInteger(points) && points >= 0 ? points : STARTING_POINTS,
      upgrades: Object.fromEntries(PRODUCTS.map((product) => {
        const level = Number(upgrades[product.id]);
        return [product.id, Number.isInteger(level) ? Math.max(0, Math.min(product.maxLevel, level)) : 0];
      })),
      receipts: Array.isArray(candidate.receipts) ? candidate.receipts.filter((item) => typeof item === 'string').slice(-5000) : []
    };
  }

  function loadState(key = accountKey) {
    try {
      const raw = localStorage.getItem(key);
      state = raw ? normalizeState(JSON.parse(raw)) : { points: STARTING_POINTS, upgrades: {}, receipts: [] };
      if (!raw) saveState();
    } catch (error) {
      console.warn('Shop data could not be read; using a fresh local balance.', error);
      state = { points: STARTING_POINTS, upgrades: {}, receipts: [] };
    }
    render();
  }

  function saveState() {
    try {
      localStorage.setItem(accountKey, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Shop data could not be saved.', error);
      if (summaryEl) summaryEl.textContent = 'Could not save shop progress in this browser.';
      return false;
    }
  }

  function getUpgradeLevel(id) {
    return state.upgrades[id] || 0;
  }

  function hasUpgrade(id) {
    return getUpgradeLevel(id) > 0;
  }

  function earn(amount, receiptId) {
    const value = Number(amount);
    if (!Number.isSafeInteger(value) || value <= 0 || typeof receiptId !== 'string' || !receiptId) return false;
    if (state.receipts.includes(receiptId)) return false;
    state.points += value;
    state.receipts.push(receiptId);
    if (state.receipts.length > 5000) state.receipts.splice(0, state.receipts.length - 5000);
    saveState();
    render();
    return true;
  }

  function nextCost(product, level) {
    return product.cost[level] ?? null;
  }

  function buy(productId) {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product) return;
    const level = getUpgradeLevel(productId);
    const cost = nextCost(product, level);
    if (cost === null) return;
    if (state.points < cost) {
      if (summaryEl) summaryEl.textContent = `You need ${cost - state.points} more points for ${product.name}. Play platformers to earn points.`;
      return;
    }
    state.points -= cost;
    state.upgrades[productId] = level + 1;
    if (!saveState()) {
      state.points += cost;
      state.upgrades[productId] = level;
      return;
    }
    render();
    window.showPopup?.(`${product.name} purchased!`, 'success');
  }

  function render() {
    if (balanceEl) balanceEl.textContent = `${state.points} spendable points`;
    if (!catalogEl) return;
    catalogEl.replaceChildren();
    PRODUCTS.forEach((product) => {
      const level = getUpgradeLevel(product.id);
      const cost = nextCost(product, level);
      const card = document.createElement('article');
      card.className = 'shop-item';
      const titleRow = document.createElement('div');
      titleRow.className = 'shop-item-heading';
      const title = document.createElement('h2');
      title.textContent = product.name;
      const levelLabel = document.createElement('span');
      levelLabel.className = 'shop-item-level';
      levelLabel.textContent = product.maxLevel > 1 ? `Level ${level}/${product.maxLevel}` : level ? 'Owned' : 'Not owned';
      titleRow.append(title, levelLabel);
      const description = document.createElement('p');
      description.textContent = product.description;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'shop-buy-button';
      button.disabled = cost === null || state.points < cost;
      button.textContent = cost === null ? 'Purchased' : `Buy · ${cost} points`;
      button.addEventListener('click', () => buy(product.id));
      card.append(titleRow, description, button);
      catalogEl.append(card);
    });
    if (summaryEl) summaryEl.textContent = 'Earn 5 points for each platformer orb and 25 points for reaching the goal. Progress is saved in this browser for your account.';
  }

  window.SiteShop = { earn, getUpgradeLevel, hasUpgrade, getPoints: () => state.points, render };
  loadState();

  if (!window.GUEST_MODE && window._supabase?.auth) {
    window._supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) {
        accountKey = `${STORAGE_PREFIX}:${data.user.id}`;
        loadState();
      }
    }).catch((error) => console.warn('Could not identify the shop account; keeping local progress.', error));
  }

  window.addEventListener('storage', (event) => {
    if (event.key === accountKey) loadState();
  });
})();

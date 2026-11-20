// Leonida Trophy Guide: loads the local trophy file, renders the checklist and
// roadmap, and keeps earned ticks plus the spoiler setting in localStorage.
// Everything it loads lives under app/; it makes no network request.
const STORAGE_KEY = 'leonida-trophy-guide-v1';
const DATA_URL = 'data/trophies.json';

const params = new URLSearchParams(location.search);
const demoMode = params.has('demo');

const listEl = document.getElementById('trophyList');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindFiltersEl = document.getElementById('kindFilters');
const spoilerEl = document.getElementById('spoilerToggle');
const earnedOnlyEl = document.getElementById('earnedOnly');
const hideEarnedEl = document.getElementById('hideEarned');
const countEl = document.getElementById('countLine');
const progressTextEl = document.getElementById('progressText');
const progressPctEl = document.getElementById('progressPct');
const progressFillEl = document.getElementById('progressFill');

let doc = null;
let earned = new Set();
let spoiler = false;
let kind = params.get('kind') || 'all';
let openId = params.get('open') ? Number(params.get('open')) : null;

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.earned)) earned = new Set(saved.earned.filter(Number.isInteger));
    if (typeof saved.spoiler === 'boolean') spoiler = saved.spoiler;
  } catch {
    earned = new Set();
  }
}

function saveProgress() {
  if (demoMode) return; // screenshot demo state is not the reader's progress
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned].sort((a, b) => a - b), spoiler }));
  } catch {
    // storage full or unavailable: the page still works for this visit
  }
}

function kindLabel(t) {
  if (t.kind === 'story') return 'Story';
  if (t.kind === 'collectibles') return 'Collectibles';
  return 'Activities';
}

function gradeName(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function spoilerHidden(t) {
  // The platinum is not a story spoiler, so it always shows its name.
  if (t.id === 1) return false;
  return spoiler && t.kind === 'story' && !earned.has(t.id);
}

function trophyMatches(t) {
  if (kind === 'online') return false; // the game has no online trophies at launch
  if (kind === 'missable' && !t.missable) return false;
  if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (earnedOnlyEl.checked && !earned.has(t.id)) return false;
  if (hideEarnedEl.checked && earned.has(t.id)) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sourceList(t) {
  if (!t.sources || !t.sources.length) return '';
  const parts = t.sources.map((s) => {
    if (s.url) return `<a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a>`;
    return escapeHtml(s.name);
  });
  return `<p class="sources"><span class="label">Sources:</span> ${parts.join(' · ')}</p>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function trophyCard(t) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(t.id) ? ' earned' : '') + (openId === t.id ? ' highlight' : '');
  card.id = `trophy-${t.id}`;
  const hidden = spoilerHidden(t);
  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveProgress();
    renderAll();
  });
  const title = document.createElement('div');
  title.className = 'card-title';
  const name = document.createElement('h3');
  name.innerHTML = `<span class="num">#${t.id}</span>` + escapeHtml(hidden ? 'Hidden story trophy' : t.name);
  const official = document.createElement('p');
  official.className = 'official';
  official.innerHTML = hidden
    ? '<span class="label">Official — PlayStation</span> <span class="spoiler-hidden">Name and description hidden until earned (spoiler-safe mode is on).</span>'
    : `<span class="label">Official — PlayStation</span> ${escapeHtml(t.description)}`;
  title.append(name, official);
  head.append(box, title);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${t.grade}`;
  gradeBadge.textContent = gradeName(t.grade);
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge';
  kindBadge.textContent = kindLabel(t);
  badges.append(kindBadge);
  const stageBadge = document.createElement('span');
  stageBadge.className = 'badge';
  stageBadge.textContent = `Roadmap stage ${t.stage}`;
  badges.append(stageBadge);
  if (t.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge hidden-flag';
    hiddenBadge.textContent = 'Hidden on PS5';
    badges.append(hiddenBadge);
  }
  if (t.missable) {
    const missBadge = document.createElement('span');
    missBadge.className = 'badge missable';
    missBadge.textContent = '⚠ Possibly missable';
    badges.append(missBadge);
  }
  if (t.confirmed === false) {
    const unBadge = document.createElement('span');
    unBadge.className = 'badge unconfirmed';
    unBadge.textContent = 'Unconfirmed';
    badges.append(unBadge);
  }
  card.append(badges);

  if (t.missable && t.missableNote) {
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = t.missableNote;
    card.append(note);
  }

  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.innerHTML = hidden
    ? '<span class="label">Guide</span> <span class="spoiler-hidden">Hidden until earned — tick the trophy to reveal its guide.</span>'
    : `<span class="label">Guide</span> ${escapeHtml(t.guide)}`;
  card.append(guide);

  if (!hidden) {
    const sources = document.createElement('div');
    sources.innerHTML = sourceList(t);
    card.append(sources.firstChild);
  }
  return card;
}

function renderRoadmap() {
  const grid = document.getElementById('stageGrid');
  grid.replaceChildren();
  for (const stage of doc.roadmap) {
    const card = document.createElement('div');
    card.className = 'stage-card';
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const count = document.createElement('p');
    count.className = 'stage-count';
    const done = stage.trophies.filter((id) => earned.has(id)).length;
    count.textContent = `${done} of ${stage.trophies.length} trophies in this stage earned`;
    card.append(h, p, count);
    grid.append(card);
  }
  const warnings = document.getElementById('warningList');
  warnings.replaceChildren();
  for (const w of doc.meta.warnings) {
    const li = document.createElement('li');
    li.textContent = w;
    warnings.append(li);
  }
  document.getElementById('sourceNote').textContent =
    `Trophy list: ${doc.meta.listSource} Guide sources: PowerPyx, PSNProfiles, GTABase, GTA Zone, FullSweep. Checked 20 November 2026.`;
}

function renderProgress() {
  const total = doc.trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  progressTextEl.textContent = `${done} of ${total} earned`;
  progressPctEl.textContent = `${pct}%`;
  progressFillEl.style.width = `${pct}%`;
}

function renderList() {
  listEl.replaceChildren();
  const shown = doc.trophies.filter(trophyMatches);
  if (kind === 'online') {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No online trophies: Grand Theft Auto VI launches as a single-player game, and none of the 55 trophies needs online play (PowerPyx, PSNProfiles).';
    listEl.append(empty);
  } else if (!shown.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
    listEl.append(empty);
  } else {
    for (const t of shown) listEl.append(trophyCard(t));
  }
  const shownCount = kind === 'online' ? 0 : shown.length;
  const earnedShown = shown.filter((t) => earned.has(t.id)).length;
  countEl.textContent = `Showing ${shownCount} of ${doc.trophies.length} trophies` +
    (shownCount ? ` · ${earnedShown} earned in this view` : '') +
    (spoiler ? ' · Spoiler-safe mode on: story trophies stay hidden until earned.' : '');
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderList();
}

function applyKindButtons() {
  for (const btn of kindFiltersEl.querySelectorAll('.kind-btn')) {
    btn.classList.toggle('active', btn.dataset.kind === kind);
  }
}

function setKind(next) {
  kind = next;
  applyKindButtons();
  renderList();
}

async function init() {
  loadSaved();
  if (params.get('spoiler') === '1') spoiler = true;
  if (params.has('demo')) {
    for (const raw of params.get('demo').split(',')) {
      const id = Number(raw);
      if (Number.isInteger(id)) earned.add(id);
    }
  }
  const response = await fetch(DATA_URL);
  doc = await response.json();
  spoilerEl.checked = spoiler;
  kindFiltersEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.kind-btn');
    if (btn) setKind(btn.dataset.kind);
  });
  searchEl.addEventListener('input', renderList);
  gradeEl.addEventListener('change', renderList);
  spoilerEl.addEventListener('change', () => {
    spoiler = spoilerEl.checked;
    saveProgress();
    renderAll();
  });
  earnedOnlyEl.addEventListener('change', renderList);
  hideEarnedEl.addEventListener('change', renderList);
  document.getElementById('exportBtn').addEventListener('click', () => {
    const payload = {
      app: 'leonida-trophy-guide',
      game: doc.game,
      platform: doc.platform,
      exportedAt: new Date().toISOString(),
      spoiler,
      earned: [...earned].sort((a, b) => a - b),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const ids = Array.isArray(imported) ? imported : imported.earned;
      if (!Array.isArray(ids)) throw new Error('no earned list');
      const valid = new Set(doc.trophies.map((t) => t.id));
      earned = new Set(ids.filter((id) => Number.isInteger(id) && valid.has(id)));
      if (typeof imported.spoiler === 'boolean') {
        spoiler = imported.spoiler;
        spoilerEl.checked = spoiler;
      }
      saveProgress();
      renderAll();
    } catch {
      countEl.textContent = 'That file could not be imported: it is not a progress file from this guide.';
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    earned = new Set();
    saveProgress();
    renderAll();
  });
  applyKindButtons();
  renderAll();
  if (openId) {
    const target = document.getElementById(`trophy-${openId}`);
    if (target) target.scrollIntoView({ block: 'center' });
  }
}

init();

(() => {
  'use strict';

  const entries = Array.isArray(window.FV_MYTHOLOGY_DICTIONARY_ENTRIES)
    ? window.FV_MYTHOLOGY_DICTIONARY_ENTRIES
    : [];
  if (!entries.length) return;

  const root = document.querySelector('[data-myth-global-search]');
  if (!root) return;

  const input = root.querySelector('[data-myth-search-input]');
  const results = root.querySelector('[data-myth-search-results]');
  const detail = root.querySelector('[data-myth-vocab-detail]');
  const clear = root.querySelector('[data-myth-search-clear]');
  const badge = root.querySelector('.myth-dictionary-badge');
  if (!input || !results || !detail) return;

  if (badge) badge.textContent = `${entries.length} entrées`;

  const normalize = (value = '') => String(value)
    .replace(/[Œœ]/g, 'oe')
    .replace(/[Ææ]/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const esc = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const index = entries.map((entry, position) => {
    const aliases = Array.isArray(entry.aliases) ? entry.aliases : (entry.aliases ? [entry.aliases] : []);
    const related = Array.isArray(entry.related) ? entry.related : [];
    return {
      entry,
      position,
      title: normalize(entry.term),
      aliases: aliases.map(normalize),
      hay: normalize([
        entry.term,
        entry.category,
        entry.definition,
        entry.nuance,
        entry.example,
        ...aliases,
        ...related
      ].join(' '))
    };
  });

  const findEntry = (term) => {
    const q = normalize(term);
    return index.find(item => item.title === q || item.aliases.includes(q))?.entry || null;
  };

  const nativeExactVisible = (q) => {
    const openTitle = !detail.hidden ? normalize(detail.querySelector('h3')?.textContent || '') : '';
    if (openTitle === q) return true;
    return [...results.querySelectorAll('.myth-search-result strong')]
      .some(node => normalize(node.textContent) === q && !node.closest('[data-myth-extra-term]'));
  };

  const fallbackRelated = (entry) => entries
    .filter(item => item.term !== entry.term && item.category === entry.category)
    .slice(0, 4)
    .map(item => item.term);

  function renderEntry(entry, scroll = false) {
    if (!entry) return;
    const requested = Array.isArray(entry.related) && entry.related.length ? entry.related : fallbackRelated(entry);
    const related = requested
      .map(term => findEntry(term))
      .filter(Boolean)
      .filter((item, i, arr) => arr.findIndex(x => normalize(x.term) === normalize(item.term)) === i)
      .slice(0, 5);

    detail.hidden = false;
    detail.innerHTML = `
      <div class="myth-dictionary-answer-top">
        <span>${esc(entry.category || 'Entrée')}</span>
        <small>Dictionnaire mythologique · base enrichie</small>
      </div>
      <div class="myth-dictionary-answer-main">
        <h3>${esc(entry.term)}</h3>
        <p class="myth-dictionary-definition">${esc(entry.definition || '')}</p>
        <div class="myth-dictionary-answer-grid">
          ${entry.example ? `<section class="myth-dictionary-example-card"><span>Repère / exemple</span><p>${esc(entry.example)}</p></section>` : ''}
          ${entry.nuance ? `<section><span>Nuance importante</span><p>${esc(entry.nuance)}</p></section>` : ''}
        </div>
        ${related.length ? `<div class="myth-dictionary-related"><span>À rapprocher de</span>${related.map(item => `<button type="button" data-myth-extra-related="${esc(item.term)}">${esc(item.term)}</button>`).join('')}</div>` : ''}
      </div>`;
    results.hidden = true;
    results.innerHTML = '';
    if (clear) clear.hidden = false;
    if (scroll) document.getElementById('myth-search-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function score(item, q, words) {
    let value = 0;
    if (item.title === q || item.aliases.includes(q)) value += 180;
    else if (item.title.startsWith(q) || item.aliases.some(a => a.startsWith(q))) value += 110;
    else if (item.title.includes(q) || item.aliases.some(a => a.includes(q))) value += 75;
    if (words.every(word => item.hay.includes(word))) value += 35;
    else value += words.filter(word => item.hay.includes(word)).length * 8;
    return value;
  }

  function syncExpandedDictionary() {
    const q = normalize(input.value);
    if (!q) return;

    // Si le dictionnaire natif a déjà une entrée exacte, on préserve son
    // comportement (notamment les liens vers les fiches de personnages).
    if (nativeExactVisible(q)) return;

    const exact = index.find(item => item.title === q || item.aliases.includes(q));
    if (exact) {
      renderEntry(exact.entry);
      return;
    }

    const words = q.split(' ').filter(Boolean);
    const existingTitles = new Set(
      [...results.querySelectorAll('.myth-search-result strong')].map(node => normalize(node.textContent))
    );
    const current = results.querySelectorAll('.myth-search-result').length;
    const room = Math.max(0, 12 - current);
    if (!room) return;

    const matches = index
      .map(item => ({ item, score: score(item, q, words) }))
      .filter(row => row.score > 0 && !existingTitles.has(row.item.title))
      .sort((a, b) => b.score - a.score || String(a.item.entry.term).localeCompare(String(b.item.entry.term), 'fr'))
      .slice(0, room);

    if (!matches.length) return;
    results.hidden = false;
    results.insertAdjacentHTML('beforeend', matches.map(({ item }) => `
      <button type="button" class="myth-search-result" data-myth-extra-term="${esc(item.entry.term)}">
        <span class="myth-search-result-type">${esc(item.entry.category || 'Dictionnaire')}</span>
        <span><strong>${esc(item.entry.term)}</strong><small>Dictionnaire mythologique · base enrichie</small></span>
        <span aria-hidden="true">→</span>
      </button>`).join(''));
  }

  // Le script principal est chargé avant ce pont : son gestionnaire traite donc
  // la recherche en premier, puis nous complétons ses résultats sans le remplacer.
  input.addEventListener('input', syncExpandedDictionary);

  results.addEventListener('click', (event) => {
    const button = event.target.closest('[data-myth-extra-term]');
    if (!button) return;
    const entry = findEntry(button.dataset.mythExtraTerm);
    if (!entry) return;
    input.value = entry.term;
    renderEntry(entry, true);
  });

  detail.addEventListener('click', (event) => {
    const button = event.target.closest('[data-myth-extra-related]');
    if (!button) return;
    const entry = findEntry(button.dataset.mythExtraRelated);
    if (!entry) return;
    input.value = entry.term;
    renderEntry(entry);
  });
})();

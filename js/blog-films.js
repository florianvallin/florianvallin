(() => {
  const root = document.querySelector('[data-film-selector]');
  if (!root || !window.FV_FILM_SELECTOR_DATA) return;

  const select = root.querySelector('[data-film-select]');
  const result = root.querySelector('[data-film-result]');
  const data = window.FV_FILM_SELECTOR_DATA;
  if (!select || !result) return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>\"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));
  const levelClass = (key) => ({major:'blog-film-level--major', comp:'blog-film-level--comp', explore:'blog-film-level--explore'}[key] || 'blog-film-level--comp');

  const render = () => {
    const key = select.value;
    const current = data[key] || data[Object.keys(data)[0]];
    if (!current) return;

    const films = (current.films || []).map((film) => `
      <article class="blog-film-selector-card" data-level="${escapeHtml(film.levelKey)}">
        <span class="blog-film-level ${levelClass(film.levelKey)}">${escapeHtml(film.level)}</span>
        <strong>${escapeHtml(film.title)}</strong>
        <small>${escapeHtml(film.credit)}</small>
        <p>${escapeHtml(film.why)}</p>
        <footer>
          <span>${escapeHtml(film.concepts)}</span>
          <b>${escapeHtml(film.authors)}</b>
        </footer>
      </article>`).join('');

    const links = (current.links || []).length ? `
      <nav class="blog-film-text-links blog-film-selector-links" aria-label="Textes associés à ${escapeHtml(current.label)}">
        <span>À relire dans la bibliothèque</span>
        ${(current.links || []).map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join('')}
      </nav>` : '';

    result.innerHTML = `
      <p class="blog-film-selector-intro">${escapeHtml(current.intro)}</p>
      ${films}
      ${links}`;
  };

  const selectFromHash = () => {
    const match = location.hash.match(/^#notion-(.+)$/);
    if (match && data[match[1]]) select.value = match[1];
  };

  select.addEventListener('change', () => {
    render();
    const hash = `#notion-${select.value}`;
    history.replaceState(null, '', hash);
  });

  window.addEventListener('hashchange', () => {
    selectFromHash();
    render();
  });

  selectFromHash();
  render();
})();

/* Thème commun, exécuté dans le head avant l'affichage de la page. */
(() => {
  'use strict';
  const KEY = 'philosophal-site-theme-v1';
  const root = document.documentElement;
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const valid = value => value === 'dark' || value === 'light';
  let saved = read();
  // Le premier affichage reste clair ; seul un choix explicite active le sombre.
  let current = valid(saved) ? saved : 'light';
  const moon = '<path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z"/>';
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  function paint(button) {
    const dark = current === 'dark';
    const label = dark ? 'Activer le mode clair' : 'Activer le mode sombre';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(dark));
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dark ? sun : moon}</svg>`;
  }
  function syncChrome() {
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = current === 'dark' ? '#19171f' : '#f8f7fc';
    });
  }
  function apply(value, persist = false) {
    current = value === 'dark' ? 'dark' : 'light';
    root.dataset.siteTheme = current;
    root.style.colorScheme = current;
    if (persist) { saved = current; try { localStorage.setItem(KEY, current); } catch {} }
    document.body?.classList.toggle('editor-dark', current === 'dark' && !!document.querySelector('.editor-app'));
    document.querySelectorAll('[data-site-theme-toggle]').forEach(paint);
    syncChrome();
    window.dispatchEvent(new CustomEvent('philosophal:themechange', {detail:{theme:current}}));
  }
  window.PHILOSOPHAL_THEME = Object.freeze({get:()=>current, set:value=>apply(value,true), toggle:()=>apply(current==='dark'?'light':'dark',true), syncChrome});
  apply(current);
  function mount() {
    let button = document.querySelector('[data-site-theme-toggle]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'ph-theme-toggle';
      button.dataset.siteThemeToggle = '';
      const target = document.querySelector('.nav-header-actions, .reader-top-actions, .editor-topbar-actions, .image-top-actions, .pdf-top-actions, .pomo-top-actions, .prompt-actions, .art-topbar-actions, .hub-header .header-actions, .topbar .top-actions, .course-top-actions')
        || document.querySelector('.media-topbar, .hub-header, .course-topbar, .topbar, .prompt-header, .art-topbar, .pomo-topbar');
      const toolbar = document.querySelector('.links-toolbar');
      if (target) {
        if (target.matches?.('.pdf-top-actions')) target.insertBefore(button, target.lastElementChild);
        else if (target.matches?.('.topbar, .art-topbar') && target.lastElementChild?.matches('button, a.site-return')) {
          const group = document.createElement('div'); group.className = 'ph-theme-header-actions';
          const last = target.lastElementChild; target.insertBefore(group, last); group.append(last, button);
        } else target.append(button);
      }
      else if (toolbar) {
        const group = document.createElement('div'); group.className = 'ph-theme-links-actions';
        const share = toolbar.querySelector('.links-share'); if (share) group.append(share);
        group.append(button); toolbar.append(group);
      } else { button.classList.add('ph-theme-floating'); document.body.append(button); }
    }
    apply(current);
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-site-theme-toggle]')) window.PHILOSOPHAL_THEME.toggle();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    saved = event.key === null ? null : event.newValue;
    apply(valid(saved) ? saved : 'light');
  });
})();

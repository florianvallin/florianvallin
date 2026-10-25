/* Thème global Philosophal : choix explicite, persistance et correctifs communs. */
(() => {
  'use strict';
  // Les anciennes pages portent des querystrings favicon périmées. Plutôt que
  // dupliquer des modifications dans 600+ pages, un lien versionné commun.
  function refreshFavicon() {
    const oldIcons = document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]');
    oldIcons.forEach((icon) => icon.remove());
    const icon = document.createElement('link');
    icon.rel = 'icon'; icon.type = 'image/svg+xml';
    icon.href = '/favicon.svg?v=20261017-official-transparent5';
    document.head.append(icon);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshFavicon, { once:true });
  else refreshFavicon();
  const KEY = 'philosophal-session-theme-v2';
  const root = document.documentElement;
  const valid = (value) => value === 'dark' || value === 'light';
  const read = () => { try { return sessionStorage.getItem(KEY); } catch (_) { return null; } };
  // Aucune consultation du thème système : première visite toujours en clair.
  let current = valid(read()) ? read() : 'light';
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
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.content = current === 'dark' ? '#171720' : '#f8f7fc';
    });
  }
  function apply(value, persist = false) {
    current = value === 'dark' ? 'dark' : 'light';
    root.dataset.siteTheme = current;
    root.style.colorScheme = current;
    if (persist) { try { sessionStorage.setItem(KEY, current); } catch (_) {} }
    document.body?.classList.toggle('editor-dark', current === 'dark' && !!document.querySelector('.editor-app'));
    document.querySelectorAll('[data-site-theme-toggle]').forEach(paint);
    syncChrome();
    window.dispatchEvent(new CustomEvent('philosophal:themechange', { detail: { theme: current } }));
  }
  window.PHILOSOPHAL_THEME = Object.freeze({ get: () => current, set: (value) => apply(value, true), toggle: () => apply(current === 'dark' ? 'light' : 'dark', true), syncChrome });
  apply(current);

  // Insérer les ajustements APRÈS toutes les feuilles de page et de module.
  // Capturer l'URL de ce script sans dépendre de document.currentScript lors du mount.
  const scriptURL = document.currentScript?.src || new URL('js/site-theme.js', document.baseURI).href;
  function mountStyles() {
    const ensure = () => {
      if (document.querySelector('link[data-ph-dark-v4]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('../css/site-theme-v4.css?v=20261022-v39', scriptURL).href;
      link.dataset.phDarkV4 = '';
      document.head.append(link);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensure, {once:true});
    } else ensure();
  }
  mountStyles();
  function mount() {
    let button = document.querySelector('.navbar [data-site-theme-toggle], [data-site-theme-toggle]');
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
      } else if (toolbar) {
        const group = document.createElement('div'); group.className = 'ph-theme-links-actions';
        const share = toolbar.querySelector('.links-share'); if (share) group.append(share);
        group.append(button); toolbar.append(group);
      } else { button.classList.add('ph-theme-floating'); document.body.append(button); }
    }
    // Navigation d’outils compacte pour les pages qui ne reconstruisent pas le header.
    const navLinks=document.querySelector('.navbar .nav-links');
    const headerActions=document.querySelector('.navbar .nav-header-actions');
    navLinks?.querySelectorAll('.nav-tools-link').forEach(link=>link.remove());
    if(headerActions && !headerActions.querySelector('[data-nav-tools-icon]')){
      const link=document.createElement('a');link.className='nav-tools-icon';link.href='/outils/';
      link.dataset.navToolsIcon='';link.title='Outils';link.setAttribute('aria-label','Outils');
      link.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.3 6.1a5 5 0 0 0-6.4 6.4L3 17.4a2.1 2.1 0 0 0 3 3l4.9-4.9a5 5 0 0 0 6.4-6.4l-3 3-3.4-.6-.7-3.4z"/><path d="M19 3l2 2-2.9 2.9"/></svg>';
      button.insertAdjacentElement('afterend',link);
    }
    apply(current);
    // Délégation globale : le header peut être reconstruit après le montage.
    document.addEventListener('click', (event) => {
      if (event.target.closest?.('[data-site-theme-toggle]')) window.PHILOSOPHAL_THEME.toggle();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    const saved = event.key === null ? null : event.newValue;
    apply(valid(saved) ? saved : 'light');
  });
})();

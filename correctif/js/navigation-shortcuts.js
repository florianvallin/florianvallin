/* Destinations communes aux pages, lecteurs et éditeurs de Philosophal. */
(() => {
  'use strict';
  const VERSION = '20261021-routes5';
  const previous = window.PHILOSOPHAL_NAVIGATION;
  if (previous?.version === VERSION) {
    // document.write, utilisé par les espaces privés, réinitialise les écouteurs.
    window.removeEventListener('keydown', previous.handleAlt, true);
    window.addEventListener('keydown', previous.handleAlt, true);
    return;
  }
  if (previous?.handleAlt) window.removeEventListener('keydown', previous.handleAlt, true);
  const script = document.currentScript?.src;
  const prefix = script ? new URL('../', script).pathname.replace(/\/$/, '') : '';
  const routes = Object.freeze({
    a: '/art/',
    l: '/lecture/?view=library',
    c: '/mediatheque/',
    b: '/textes/theologie/boussole/',
    m: '/textes/mythologie/boussole/',
    p: '/textes/philosophie/boussole/',
    h: '/'
  });
  const codes = {KeyA:'a',KeyL:'l',KeyC:'c',KeyB:'b',KeyM:'m',KeyP:'p',KeyH:'h'};
  const resolve = path => path.startsWith('/') && !path.startsWith('//')
    ? prefix + path : path;
  function go(path) {
    const destination = new URL(resolve(path), window.location.href);
    const current = new URL(window.location.href);
    const normalize = pathname => pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    if (normalize(destination.pathname) === normalize(current.pathname) && destination.search === current.search && destination.hash === current.hash) return;
    window.location.assign(destination.pathname + destination.search + destination.hash);
  }
  function handleAlt(event) {
    if (event.defaultPrevented || event.repeat || event.isComposing || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches('input,textarea,select,[role="textbox"]') || target.isContentEditable)) return;
    const key = String(event.key || '').toLocaleLowerCase('fr');
    // La lettre saisie est prioritaire : A a le code KeyQ sur un clavier AZERTY.
    const letter = /^[a-z]$/.test(key) ? key : codes[event.code];
    if (!routes[letter]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    go(routes[letter]);
  }
  window.PHILOSOPHAL_NAVIGATION = Object.freeze({version:VERSION,routes,resolve,go,handleAlt});
  window.addEventListener('keydown', handleAlt, true);
})();

/* Une ancienne copie d'index ne doit pas afficher le dernier article ou outil du dossier. */
(() => {
  'use strict';
  const prefix = new URL('../', document.currentScript.src).pathname.replace(/\/$/, '');
  const hubs = {
    '/textes/': ['[data-text-catalog]', '/textes/catalogue.html'],
    '/blog/': ['[data-blog-card]', '/blog/tous-les-billets.html'],
    '/outils/': ['.tools-grid', '/outils/tous-les-outils.html'],
    '/mediatheque/': ['[data-media-search]', '/mediatheque/accueil.html']
  };
  function check() {
    let path = location.pathname;
    if (prefix && path.startsWith(prefix + '/')) path = path.slice(prefix.length);
    path = path.replace(/index\.html$/, '');
    if (hubs[path]) {
      const [selector, fallback] = hubs[path];
      if (!document.querySelector(selector)) location.replace(prefix + fallback + location.search + location.hash);
      return;
    }
    for (const [canonical, [selector, fallback]] of Object.entries(hubs)) {
      if (path === fallback && document.querySelector(selector)) {
        history.replaceState(history.state, '', prefix + canonical + location.search + location.hash);
        return;
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check, {once:true}); else check();
})();

/* La rubrique Blog garde sa destination, même dans un header déjà construit. */
(() => {
  'use strict';
  const prefix = new URL('../', document.currentScript.src).pathname.replace(/\/$/, '');
  const destinations = { 'nav-blog-link': '/blog/', 'nav-texts-link': '/textes/', 'nav-tools-link': '/outils/' };
  function targetFor(link) {
    if (!link || !link.closest('.navbar, .site-header')) return '';
    return Object.entries(destinations).find(([name]) => link.classList.contains(name))?.[1] || '';
  }
  function refresh() {
    document.querySelectorAll?.('.navbar a, .site-header a').forEach(link => {
      const destination = targetFor(link);
      if (destination) link.setAttribute('href', prefix + destination);
    });
  }
  const previous = window.PHILOSOPHAL_HEADER_NAV;
  if (previous) window.removeEventListener('click', previous, true);
  function onClick(event) {
    if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target?.closest?.('a');
    const destination = targetFor(link);
    if (!destination || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    link.setAttribute('href', prefix + destination);
    window.PHILOSOPHAL_NAVIGATION.go(destination);
  }
  window.PHILOSOPHAL_HEADER_NAV = onClick;
  window.addEventListener('click', onClick, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once: true}); else refresh();
})();

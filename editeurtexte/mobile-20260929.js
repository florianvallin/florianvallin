(() => {
  'use strict';

  const mobileQuery = window.matchMedia('(max-width: 760px)');
  const root = document.documentElement;
  const body = document.body;
  let baseViewportHeight = window.innerHeight;

  function viewportHeight() {
    return Math.round(window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0);
  }

  function syncViewport() {
    const h = viewportHeight();
    if (!h) return;
    root.style.setProperty('--editor-mobile-vh', `${h}px`);

    if (!mobileQuery.matches) {
      body.classList.remove('editor-mobile-keyboard');
      baseViewportHeight = window.innerHeight;
      return;
    }

    baseViewportHeight = Math.max(baseViewportHeight, window.innerHeight);
    const keyboardLikelyOpen = h < baseViewportHeight * 0.76;
    body.classList.toggle('editor-mobile-keyboard', keyboardLikelyOpen);
  }

  function applyMobileDefaults() {
    syncViewport();
    if (!mobileQuery.matches) return;

    /* Une seule rangée d'outils au chargement mobile. Le bouton « Outils »
       créé par editor-v3.js permet toujours de rouvrir la seconde rangée. */
    if (!sessionStorage.getItem('philosophal-editor-toolbar-choice')) {
      body.classList.add('v3-toolbar-collapsed');
    }

    /* Un zoom enregistré sur ordinateur ne doit jamais agrandir la feuille mobile. */
    const paper = document.querySelector('[data-paper]');
    if (paper) {
      paper.style.zoom = '1';
      paper.style.transform = 'none';
    }
  }

  function rememberToolbarChoice(event) {
    const trigger = event.target.closest('.v3-tool-chip-toggle,[data-v3-toolbar-toggle]');
    if (!trigger || !mobileQuery.matches) return;
    sessionStorage.setItem('philosophal-editor-toolbar-choice', '1');
  }

  document.addEventListener('click', rememberToolbarChoice, true);
  window.addEventListener('resize', syncViewport, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(() => {
    baseViewportHeight = window.innerHeight;
    applyMobileDefaults();
  }, 180), { passive: true });
  window.visualViewport?.addEventListener('resize', syncViewport, { passive: true });
  window.visualViewport?.addEventListener('scroll', syncViewport, { passive: true });
  mobileQuery.addEventListener?.('change', applyMobileDefaults);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(applyMobileDefaults, 0), { once: true });
  } else {
    setTimeout(applyMobileDefaults, 0);
  }
})();

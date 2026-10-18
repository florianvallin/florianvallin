/* Philosophal — première visite de chaque session en clair.
   La préférence de la session est lue avant les CSS et le premier rendu. */
(function () {
  'use strict';
  var theme = 'light';
  try {
    if (window.sessionStorage.getItem('philosophal-session-theme-v2') === 'dark') {
      theme = 'dark';
    }
  } catch (_) { /* stockage bloqué : rester en clair */ }
  var root = document.documentElement;
  root.setAttribute('data-site-theme', theme);
  root.style.colorScheme = theme;
})();

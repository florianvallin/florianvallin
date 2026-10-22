/* Préférence de lecture commune aux séries, appliquée avant le premier rendu. */
(() => {
  'use strict';
  const key = 'philosophal-series-view-v1';
  const root = document.documentElement;
  let view = 'detailed';
  try { if (localStorage.getItem(key) === 'compact') view = 'compact'; } catch (_) {}
  root.dataset.seriesView = view;
  function mount() {
    const buttons = [...document.querySelectorAll('[data-series-view-choice]')];
    const apply = (next, persist) => {
      if (!['detailed','compact'].includes(next)) return;
      view = next;
      root.dataset.seriesView = view;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.seriesViewChoice === view)));
      if (persist) { try { localStorage.setItem(key, view); } catch (_) {} }
    };
    buttons.forEach(button => button.addEventListener('click', () => apply(button.dataset.seriesViewChoice, true)));
    document.querySelectorAll('[data-series-view-control]').forEach(control => {control.hidden = false;});
    apply(view, false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();

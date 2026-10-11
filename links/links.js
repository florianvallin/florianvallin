(() => {
  'use strict';
  const root = document.documentElement;
  const tabs = Array.from(document.querySelectorAll('.links-tab'));
  const panels = Array.from(document.querySelectorAll('.links-panel'));
  const tablist = document.querySelector('.links-tabs');
  const share = document.querySelector('.links-share');
  const toast = document.querySelector('.links-toast');
  const theme = document.querySelector('meta[name="theme-color"]');
  let toastTimer;
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.hash.slice(1));
  });
  panels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.id}`);
  });
  function select(view, updateUrl = false) {
    const selected = view === 'perso' ? 'perso' : 'pro';
    root.dataset.linksView = selected;
    tabs.forEach((tab) => {
      const active = tab.id === `tab-${selected}`;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== selected; });
    document.title = selected === 'perso' ? 'Apocalupso — Mes liens · Philosophal' : 'Philosophal — Mes liens pro';
    theme.content = selected === 'perso' ? '#1c1a22' : '#f7f5fc';
    toast.textContent = '';
    if (updateUrl && location.hash !== `#${selected}`) {
      try { history.pushState(null, '', `#${selected}`); }
      catch (_) { /* The selector also works when opening the file locally. */ }
    }
  }
  const readHash = () => select(location.hash.toLowerCase().slice(1));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(tab.hash.slice(1), true);
    });
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === ' ') next = index;
      else return;
      event.preventDefault();
      select(tabs[next].hash.slice(1), true);
      tabs[next].focus();
    });
  });
  window.addEventListener('hashchange', readHash);
  window.addEventListener('popstate', readHash);
  readHash();
  function announce(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toastTimer = setTimeout(() => { toast.textContent = ''; }, 3500);
  }
  share.hidden = false;
  share.addEventListener('click', async () => {
    const url = `https://philosophal.fr/links/#${root.dataset.linksView}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('textarea');
        input.value = url;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        let copied;
        try { input.select(); copied = document.execCommand('copy'); }
        finally { input.remove(); share.focus(); }
        if (!copied) throw new Error('Copy unavailable');
      }
      announce('Lien copié !');
    } catch (_) { announce('Copiez le lien depuis la barre d’adresse.'); }
  });
})();

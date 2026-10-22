/* Un seul lecteur est déplacé : même passage, mêmes commandes et même sauvegarde. */
(() => {
  'use strict';
  function create(hooks) {
    let popup = null, placeholder = null, opening = false, observer = null, fallback = false;
    const player = hooks.player, button = document.querySelector('[data-floating]');
    const isActive = () => !!popup && !popup.closed;
    function restore(close = true) {
      if (!popup) return;
      const previous = popup, anchor = hooks.before(); popup = null; observer?.disconnect(); observer = null;
      if (placeholder?.isConnected) placeholder.replaceWith(player);
      placeholder = null; document.body.classList.remove('has-floating-reader');
      button.setAttribute('aria-pressed','false'); button.querySelector('[data-floating-label]').textContent = 'Fenêtre flottante';
      hooks.attach(window,false); hooks.after(anchor);
      if (close && !previous.closed) previous.close();
    }
    async function open() {
      if (opening || !hooks.ready()) return;
      if (isActive()) { restore(); return; }
      opening = true; button.disabled = true;
      let next = null, moved = false, anchor = null;
      try {
        const pip = !fallback && window.documentPictureInPicture?.requestWindow;
        if (pip) {
          try { next = await window.documentPictureInPicture.requestWindow({width:720,height:580}); }
          catch { fallback = true; }
        }
        if (!next) next = window.open('','philosophal-prompt-' + (crypto.randomUUID?.() || Date.now()),'popup,width=720,height=580,resizable=yes,scrollbars=no');
        if (!next) throw new Error('Autorisez la fenêtre détachée pour ce site, puis cliquez de nouveau sur Fenêtre flottante.');
        const doc = next.document; doc.documentElement.lang = 'fr'; doc.documentElement.dataset.promptFloating = '';
        doc.head.replaceChildren(); doc.body.replaceChildren(); doc.title = 'Lecture flottante — Philosophal';
        const viewport = doc.createElement('meta'); viewport.name = 'viewport'; viewport.content = 'width=device-width,initial-scale=1'; doc.head.append(viewport);
        const loaded = [];
        for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
          const copy = doc.createElement('link'); copy.rel = 'stylesheet'; copy.href = link.href;
          loaded.push(new Promise(resolve => { copy.addEventListener('load',resolve,{once:true}); copy.addEventListener('error',resolve,{once:true}); })); doc.head.append(copy);
        }
        const syncTheme = () => { const theme = document.documentElement.getAttribute('data-site-theme'); if (theme) doc.documentElement.setAttribute('data-site-theme',theme); };
        syncTheme(); observer = new MutationObserver(syncTheme); observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-site-theme']});
        doc.body.className = 'teleprompteur-v2 teleprompteur-v3 teleprompteur-v4 teleprompteur-v5 teleprompteur-v6 prompt-floating-surface';
        const bar = doc.createElement('header'), title = doc.createElement('span'), back = doc.createElement('button');
        bar.className = 'prompt-floating-bar'; title.textContent = pip && !fallback ? 'Lecture flottante · au premier plan' : 'Lecture détachée';
        back.type = 'button'; back.textContent = 'Ramener au site'; back.addEventListener('click',() => restore()); bar.append(title,back); doc.body.append(bar);
        anchor = hooks.before();
        placeholder = document.createElement('section'); placeholder.className = 'prompt-floating-placeholder'; placeholder.setAttribute('aria-label','Lecture dans une fenêtre séparée');
        const heading = document.createElement('h2'), note = document.createElement('p'), actions = document.createElement('div'), show = document.createElement('button'), bring = document.createElement('button');
        heading.textContent = 'Votre lecture a sa fenêtre.'; note.textContent = 'Placez-la près de votre caméra. Votre texte, vos réglages et vos prises restent accessibles ici.';
        show.type = 'button'; show.textContent = 'Afficher la fenêtre'; show.addEventListener('click',() => popup?.focus());
        bring.type = 'button'; bring.textContent = 'Ramener la lecture'; bring.addEventListener('click',() => restore());
        actions.append(show,bring); placeholder.append(heading,note,actions); player.before(placeholder);
        popup = next; doc.body.append(player); moved = true; document.body.classList.add('has-floating-reader'); hooks.attach(next,true);
        next.addEventListener('pagehide',() => { if (popup === next) restore(false); },{once:true});
        button.setAttribute('aria-pressed','true'); button.querySelector('[data-floating-label]').textContent = 'Ramener la lecture';
        await Promise.race([Promise.all(loaded),new Promise(resolve => setTimeout(resolve,2200))]);
        if (popup !== next || next.closed) return;
        await Promise.race([doc.fonts?.ready || Promise.resolve(),new Promise(resolve => setTimeout(resolve,1200))]);
        if (popup === next && !next.closed) { hooks.after(anchor); next.focus(); }
      } catch (error) {
        if (moved) restore(); else { if (next && !next.closed) next.close(); if (anchor) hooks.after(anchor); }
        hooks.toast(error.message || 'Cette fenêtre n’est pas disponible. Réessayez avec la fenêtre détachée.');
      } finally { opening = false; button.disabled = !hooks.ready(); }
    }
    button.addEventListener('click',open);
    window.addEventListener('pagehide',() => restore());
    return {open,restore,isActive,get window(){return popup;}};
  }
  window.PhilosophalPromptFloating = {create};
})();

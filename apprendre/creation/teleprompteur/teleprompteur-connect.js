/* Association du téléphone depuis le lecteur principal. Les codes restent en mémoire. */
(() => {
  'use strict';
  const R = window.PhilosophalPromptRemote, $ = selector => document.querySelector(selector);
  function create(hooks) {
    const dialog = $('[data-remote-dialog]'), open = $('[data-remote-open]'), start = $('[data-remote-create]'), connect = $('[data-remote-accept]'), link = $('[data-remote-link]'), answer = $('[data-remote-answer]');
    let connection = null, epoch = 0, busy = false;
    const supported = window.isSecureContext && typeof window.RTCPeerConnection === 'function';
    function message(value,error = false) { const node = $('[data-remote-message]'); node.textContent = value; node.classList.toggle('is-error',error); }
    function paint(phase = 'idle') {
      const connected = phase === 'connected'; open.dataset.connected = String(connected); open.setAttribute('aria-label',connected ? 'Télécommande connectée' : 'Télécommande sur téléphone');
      start.disabled = busy || !supported; connect.disabled = busy || !connection || !answer.value.trim() || !['waiting','connecting'].includes(connection.phase);
      $('[data-remote-disconnect]').disabled = !connection;
      $('[data-remote-steps]').hidden = connected; $('[data-remote-connected]').hidden = !connected;
      $('[data-remote-copy]').disabled = !link.value || busy;
      $('[data-remote-share]').hidden = !navigator.share; $('[data-remote-share]').disabled = !link.value || busy;
    }
    function address(code) {
      const local = /^(?:localhost|127(?:\.\d+){3}|\[::1\])$/.test(location.hostname);
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const root = local && canonical ? canonical : location.href;
      const url = new URL('./telecommande/',root); url.hash = code; return url.href;
    }
    function disconnect() {
      epoch++; const previous = connection; connection = null; previous?.close(); hooks.pause(); busy = false;
      link.value = ''; answer.value = ''; $('[data-remote-invite]').hidden = true;
      message('Télécommande déconnectée. Vous pouvez créer un nouveau lien.'); paint();
    }
    async function createLink() {
      if (!supported || busy) return;
      const current = ++epoch; connection?.close(); hooks.pause(); busy = true; link.value = ''; answer.value = ''; paint('preparing');
      const session = R.connect({role:'host',getState:hooks.state,onCommand:hooks.command,
        onLoss:() => { if (current === epoch) { hooks.pause(); hooks.toast('Télécommande déconnectée · lecture en pause.'); } },
        onStatus:(phase,text) => {
          if (current !== epoch) return;
          message(text || 'Prêt à créer une connexion.',phase === 'disconnected' || phase === 'expired' || phase === 'failed'); paint(phase);
          if (phase === 'connected' && dialog.open) { dialog.close(); hooks.toast('Télécommande connectée.'); }
        }
      });
      connection = session;
      try {
        const code = await session.offer(); if (current !== epoch) return;
        link.value = address(code); $('[data-remote-invite]').hidden = false;
        const local = /^(?:localhost|127(?:\.\d+){3}|\[::1\])$/.test(location.hostname);
        $('[data-remote-local-note]').hidden = !local;
      } catch (error) { if (current === epoch) { session.close(); connection = null; message(error.message || 'La connexion n’a pas pu être préparée.',true); } }
      finally { if (current === epoch) { busy = false; paint(connection?.phase); } }
    }
    async function accept() {
      if (busy || !connection) return;
      const current = epoch; busy = true; paint(connection.phase);
      try { await connection.accept(answer.value); }
      catch (error) { if (current === epoch) message(error.message || 'Cette réponse n’a pas pu être utilisée.',true); }
      finally { if (current === epoch) { busy = false; paint(connection?.phase); } }
    }
    async function copy() {
      try { await navigator.clipboard.writeText(link.value); hooks.toast('Lien copié. Ouvrez-le sur votre téléphone.'); }
      catch { link.focus(); link.select(); message('Lien sélectionné. Copiez-le avec Ctrl+C.'); }
    }
    open.addEventListener('click',() => {
      hooks.pause(); dialog.showModal();
      if (!supported) message('Ouvrez cette page en HTTPS avec un navigateur compatible pour utiliser la télécommande.',true);
      paint(connection?.phase);
    });
    $('[data-remote-close]').addEventListener('click',() => dialog.close());
    start.addEventListener('click',createLink); connect.addEventListener('click',accept); answer.addEventListener('input',() => paint(connection?.phase));
    $('[data-remote-copy]').addEventListener('click',copy);
    $('[data-remote-share]').addEventListener('click',async () => { try { await navigator.share({title:'Télécommande Philosophal',url:link.value}); } catch (error) { if (error.name !== 'AbortError') message('Utilisez Copier le lien pour l’ouvrir sur votre téléphone.'); } });
    $('[data-remote-disconnect]').addEventListener('click',disconnect);
    window.addEventListener('pagehide',() => { epoch++; connection?.close(); });
    paint(); return {publish:() => connection?.publish(),get connected(){return connection?.connected === true;}};
  }
  window.PhilosophalPromptConnect = {create};
})();

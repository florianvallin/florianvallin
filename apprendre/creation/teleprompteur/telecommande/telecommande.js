(() => {
  'use strict';
  const R = window.PhilosophalPromptRemote, $ = selector => document.querySelector(selector);
  let connection = null, snapshot = R.state(), connected = false, busy = false, epoch = 0, wakeLock = null;
  const offer = $('[data-phone-offer]'), response = $('[data-phone-response-code]');
  const clock = value => { const seconds = Math.round(value || 0); return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2,'0'); };
  function message(text,error = false) { $('[data-phone-message]').textContent = text; $('[data-phone-message]').classList.toggle('is-error',error); }
  function paint() {
    const play = $('[data-phone-play]'); play.dataset.phoneCommand = snapshot.playing || snapshot.counting ? 'pause' : 'play';
    play.textContent = snapshot.counting ? 'Annuler le départ' : snapshot.playing ? 'Pause' : 'Lire'; play.setAttribute('aria-pressed',String(snapshot.playing || snapshot.counting));
    for (const button of document.querySelectorAll('[data-phone-command]')) button.disabled = !connected || snapshot.empty || snapshot.busy && button.dataset.phoneCommand !== 'pause';
    $('[data-phone-answer]').disabled = busy || connected || !offer.value.trim(); $('[data-phone-disconnect]').disabled = !connection;
    $('[data-phone-title]').textContent = snapshot.title; $('[data-phone-scope]').textContent = snapshot.scope;
    $('[data-phone-reader-status]').textContent = snapshot.status; $('[data-phone-progress]').value = snapshot.progress;
    $('[data-phone-time]').textContent = clock(snapshot.elapsed) + ' · ' + clock(snapshot.remaining) + ' restantes';
    $('[data-phone-speed]').textContent = Math.round(snapshot.speed) + ' px/s'; $('[data-phone-take]').textContent = snapshot.take ? 'Prise ' + snapshot.take : 'Aucune prise';
    $('[data-phone-connection]').textContent = connected ? 'Connectée' : busy ? 'Association…' : 'Hors connexion'; $('[data-phone-connection]').dataset.connected = String(connected);
  }
  async function keepScreen() {
    if (!connected || document.hidden || wakeLock) return;
    try { const lock = await navigator.wakeLock?.request('screen'); if (connected) wakeLock = lock; else lock?.release(); } catch {}
  }
  function releaseScreen() { wakeLock?.release().catch(() => {}); wakeLock = null; }
  function disconnect() {
    epoch++; const previous = connection; connection = null; previous?.close(); connected = false; busy = false; snapshot = R.state(); releaseScreen();
    offer.value = ''; response.value = ''; $('[data-phone-response]').hidden = true; $('[data-phone-pairing]').hidden = false; $('[data-phone-dashboard]').hidden = true;
    message('Télécommande déconnectée. Créez un nouveau lien sur l’ordinateur pour recommencer.'); paint();
  }
  async function answer() {
    if (busy || connected || !offer.value.trim()) return;
    if (!window.isSecureContext || typeof RTCPeerConnection !== 'function') { message('Ouvrez la télécommande en HTTPS avec un navigateur compatible.',true); return; }
    const current = ++epoch; connection?.close(); busy = true; connected = false; response.value = ''; $('[data-phone-response]').hidden = true; paint();
    const session = R.connect({role:'remote',onState:value => { if (current === epoch) { snapshot = value; paint(); } },
      onLoss:() => { if (current === epoch) { connected = false; releaseScreen(); paint(); } },
      onStatus:(phase,text) => {
        if (current !== epoch) return;
        connected = phase === 'connected'; message(text || 'Association en cours…',['failed','disconnected','expired'].includes(phase));
        if (connected) { $('[data-phone-pairing]').hidden = true; $('[data-phone-dashboard]').hidden = false; keepScreen(); }
        paint();
      }
    }); connection = session;
    try { const code = await session.answer(offer.value); if (current !== epoch) return; response.value = code; $('[data-phone-response]').hidden = false; }
    catch (error) { if (current === epoch) { session.close(); connection = null; message(error.message || 'Cette connexion n’a pas pu être préparée.',true); } }
    finally { if (current === epoch) { busy = false; paint(); } }
  }
  $('[data-phone-answer]').addEventListener('click',answer); offer.addEventListener('input',paint);
  $('[data-phone-copy]').addEventListener('click',async () => {
    try { await navigator.clipboard.writeText(response.value); message('Réponse copiée. Collez-la dans le téléprompteur sur l’ordinateur.'); }
    catch { response.focus(); response.select(); message('Code sélectionné. Utilisez la commande Copier de votre téléphone.'); }
  });
  for (const button of document.querySelectorAll('[data-phone-command]')) button.addEventListener('click',() => {
    if (connection?.command(button.dataset.phoneCommand)) { try { navigator.vibrate?.(20); } catch {} }
  });
  $('[data-phone-disconnect]').addEventListener('click',disconnect);
  document.addEventListener('visibilitychange',() => { if (document.hidden) releaseScreen(); else keepScreen(); });
  window.addEventListener('pagehide',() => { epoch++; connection?.close(); releaseScreen(); });
  if (location.hash) { offer.value = location.hash.slice(1,50001); history.replaceState(null,'',location.pathname + location.search); }
  paint();
})();

(async () => {
  'use strict';
  let floatingDocument = null, floating = null, remote = null, moving = false, frameOwner = window;
  const $ = selector => document.querySelector(selector) || floatingDocument?.querySelector(selector);
  const {blocks, mapOffset, wordCount, clamp} = window.PhilosophalPromptText;
  let workspace = null, persistence = 0, director = null, windowCache = null, boundaryHold = 0, camera = null, captureBusy = false;
  let initialAnchor = {offset:0,fraction:.5,pin:'start'};
  const reader = $('[data-reader]'), text = $('[data-prompt-text]'), player = $('[data-player]'), script = $('[data-script]');
  const inputs = Object.fromEntries([
    ['speed','speed'], ['size','size'], ['line','line'], ['width','width'], ['offset','offset'],
    ['font','font'], ['mirror','mirror'], ['guide','guide'], ['guidePosition','guide-position'],
    ['guideStyle','guide-style'], ['loop','loop'], ['theme','theme'], ['countdown','countdown'],
    ['rate','rate'], ['textColor','text-color'], ['backgroundColor','background-color']
  ].map(([key, attr]) => [key, $(`[data-${attr}]`)]));
  const moods = [
    {id:'dark', name:'Studio', text:'#f2f5fa', background:'#111a28'},
    {id:'light', name:'Clair', text:'#19263a', background:'#ffffff'},
    {id:'sepia', name:'Papier', text:'#3d3329', background:'#f7f1e4'},
    {id:'night', name:'Nuit', text:'#d7e4ff', background:'#090e1a'},
    {id:'lavender', name:'Lavande', text:'#ede4ff', background:'#281b3d'},
    {id:'ocean', name:'Océan', text:'#cff3ff', background:'#072b38'},
    {id:'forest', name:'Forêt', text:'#def6e3', background:'#103527'},
    {id:'amber', name:'Ambre', text:'#ffe6ae', background:'#37250d'},
    {id:'rose', name:'Rose', text:'#ffe1ee', background:'#3b172c'},
    {id:'slate', name:'Ardoise', text:'#edf0f5', background:'#29323e'}
  ];
  let playing = false, counting = false, frame = 0, last = 0, position = 0, elapsed = 0;
  let wakeLock = null, saveTimer = 0, editTimer = 0, toastTimer = 0, countdownEnd = 0;
  let renderedSource = '', paragraphs = [], geometry = {width:0, height:0};
  let stableAnchor = {offset:0, fraction:.5, pin:'start'}, anchorAt = 0, savedAt = 0;
  let fullscreenFocus = false, loading = true, dragId = null, interacted = false;
  const maxScroll = () => Math.max(0, reader.scrollHeight - reader.clientHeight);
  const guideY = () => geometry.guide ?? reader.clientHeight * Number(inputs.guidePosition.value) / 100;
  const clock = seconds => {
    const s = Math.max(0, Math.round(Number(seconds) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2,'0')}`;
  };
  function toast(message) {
    const el = $('[data-toast]'); el.textContent = message; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 3500);
  }

  // Un caractère du texte source sert d'ancre. Il reste le même après un changement
  // de largeur, de police ou d'écran, contrairement à un pourcentage de défilement.
  function characterRect(part, index) {
    const range = part.node.ownerDocument.createRange(), node = part.node.firstChild;
    const at = clamp(index, 0, node.length - 1);
    range.setStart(node, at); range.setEnd(node, at + 1);
    const rect = range.getBoundingClientRect();
    return rect.height ? rect : part.node.getBoundingClientRect();
  }
  function captureAnchor() {
    if (!paragraphs.length) return {offset:0, fraction:.5, pin:'start'};
    const target = reader.getBoundingClientRect().top + guideY();
    let low = 0, high = paragraphs.length - 1;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (paragraphs[middle].node.getBoundingClientRect().bottom < target) low = middle + 1;
      else high = middle;
    }
    const part = paragraphs[low];
    low = 0; high = part.text.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (characterRect(part, middle).top <= target) low = middle;
      else high = middle - 1;
    }
    const rowTop = characterRect(part, low).top;
    high = low; low = 0;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (characterRect(part, middle).top < rowTop - .5) low = middle + 1;
      else high = middle;
    }
    const rect = characterRect(part, low);
    const anchor = {offset:part.start + low, fraction:clamp((target - rect.top) / (rect.height || 1), -10, 10)};
    if (reader.scrollTop < .5) anchor.pin = 'start';
    else if (maxScroll() > 1 && reader.scrollTop >= maxScroll() - 1) anchor.pin = 'end';
    return anchor;
  }
  function rememberAnchor() { stableAnchor = captureAnchor(); anchorAt = performance.now(); }
  function restoreAnchor(anchor = stableAnchor) {
    if (!paragraphs.length || anchor?.pin === 'start') reader.scrollTop = 0;
    else if (anchor?.pin === 'end') reader.scrollTop = maxScroll();
    else {
      const offset = clamp(Number(anchor?.offset) || 0, 0, renderedSource.length);
      const part = paragraphs.find(p => p.end > offset) || paragraphs[paragraphs.length - 1];
      const rect = characterRect(part, clamp(offset - part.start, 0, part.text.length - 1));
      const fraction = clamp(Number(anchor?.fraction) || 0, -10, 10);
      reader.scrollTop = clamp(reader.scrollTop + rect.top - reader.getBoundingClientRect().top - guideY() + fraction * rect.height, 0, maxScroll());
    }
    position = reader.scrollTop; last = 0; boundaryHold = 0; rememberAnchor(); updateProgress();
  }
  function scrollForOffset(offset,fraction = .5) {
    const part = paragraphs.find(part => part.end > offset) || paragraphs[paragraphs.length - 1];
    if (!part) return 0;
    const rect = characterRect(part,clamp(offset - part.start,0,part.text.length - 1));
    return clamp(reader.scrollTop + rect.top - reader.getBoundingClientRect().top - guideY() + fraction * rect.height,0,maxScroll());
  }
  function playWindow() {
    if (windowCache) return windowCache;
    const range = director?.range, start = range ? scrollForOffset(range.start) : 0;
    const end = range ? Math.max(start,scrollForOffset(range.end - 1,.9)) : maxScroll();
    const words = wordCount(range ? script.value.slice(range.start,range.end) : script.value);
    return windowCache = {start,end,hold:end - start < 2 ? Math.max(.8,words / Number(inputs.rate.value) * 60) : range ? .8 : 0};
  }
  function highlightPhrase(phrase) {
    const surface = text.ownerDocument.defaultView;
    if (!surface.CSS?.highlights || !surface.Highlight) return;
    surface.CSS.highlights.delete('prompt-phrase'); if (!phrase || !paragraphs.length) return;
    const first = paragraphs.find(part => part.end > phrase.start), last = [...paragraphs].reverse().find(part => part.start < phrase.end);
    if (!first || !last) return;
    const range = text.ownerDocument.createRange();
    range.setStart(first.node.firstChild,clamp(phrase.start - first.start,0,first.text.length));
    range.setEnd(last.node.firstChild,clamp(phrase.end - last.start,0,last.text.length));
    surface.CSS.highlights.set('prompt-phrase',new surface.Highlight(range));
  }
  function measure() {
    windowCache = null;
    const height = reader.clientHeight, lineHeight = parseFloat(text.ownerDocument.defaultView.getComputedStyle(text).lineHeight) || Number(inputs.size.value) * Number(inputs.line.value);
    const guide = height * Number(inputs.guidePosition.value) / 100;
    $('[data-top-spacer]').style.height = `${Math.max(0, guide - lineHeight / 2)}px`;
    $('[data-bottom-spacer]').style.height = `${Math.max(0, height - guide - lineHeight / 2)}px`;
    player.style.setProperty('--guide-top', `${reader.offsetTop + guide}px`);
    player.style.setProperty('--guide-height', `${lineHeight}px`);
    geometry = {width:reader.clientWidth, height, guide};
  }
  function changeLayout(change) {
    flushEdit();
    const anchor = captureAnchor(); change(); measure(); restoreAnchor(anchor); save();
  }

  const isColor = value => /^#[0-9a-f]{6}$/i.test(String(value));
  function luminance(color) {
    const channels = color.slice(1).match(/.{2}/g).map(value => {
      const c = parseInt(value,16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
    });
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }
  function contrast(a,b) { const x = luminance(a), y = luminance(b); return (Math.max(x,y) + .05) / (Math.min(x,y) + .05); }
  function setPalette(id) {
    const mood = moods.find(p => p.id === id); if (!mood) return;
    inputs.theme.value = ['dark','light','sepia'].includes(id) ? id : 'custom';
    inputs.textColor.value = mood.text; inputs.backgroundColor.value = mood.background;
  }
  function applyColors() {
    const foreground = inputs.textColor.value, background = inputs.backgroundColor.value;
    const ink = contrast('#19263a',background) >= contrast('#f2f5fa',background) ? '#19263a' : '#f2f5fa';
    player.style.setProperty('--reader-text',foreground); player.style.setProperty('--reader-bg',background);
    player.style.setProperty('--reader-muted',ink); player.style.setProperty('--reader-rule',ink + '24'); player.style.setProperty('--reader-guide',ink);
    for (const button of document.querySelectorAll('[data-color-preset]')) {
      const mood = moods.find(p => p.id === button.dataset.colorPreset);
      button.setAttribute('aria-pressed', String(mood.text === foreground && mood.background === background));
    }
    const ratio = contrast(foreground,background), output = $('[data-color-contrast]');
    output.textContent = `Contraste ${ratio.toLocaleString('fr-FR',{maximumFractionDigits:1})} : 1 · ${ratio >= 4.5 ? 'Bonne lisibilité' : 'Contraste faible'}`;
    output.classList.toggle('is-low-contrast',ratio < 4.5);
    for (const el of document.querySelectorAll('[data-color-hex]')) if (el !== document.activeElement) el.value = inputs[el.dataset.colorHex].value.toUpperCase();
  }
  function applyPrefs() {
    player.style.setProperty('--text-size', `${inputs.size.value}px`);
    player.style.setProperty('--text-line', inputs.line.value);
    player.style.setProperty('--text-width', `${inputs.width.value}%`);
    player.style.setProperty('--text-offset', Number(inputs.offset.value) / 100);
    player.dataset.theme = inputs.theme.value;
    player.classList.toggle('is-mirrored', inputs.mirror.checked); player.classList.toggle('is-serif', inputs.font.value === 'serif');
    $('[data-reading-guide]').hidden = !inputs.guide.checked; $('[data-reading-guide]').dataset.style = inputs.guideStyle.value;
    $('[data-speed-value]').textContent = `${inputs.speed.value} px/s`; $('[data-mini-speed]').textContent = `${inputs.speed.value} px/s`;
    $('[data-size-value]').textContent = `${inputs.size.value} px`; $('[data-line-value]').textContent = Number(inputs.line.value).toLocaleString('fr-FR');
    $('[data-width-value]').textContent = `${inputs.width.value} %`; $('[data-guide-position-value]').textContent = `${inputs.guidePosition.value} %`;
    $('[data-offset-value]').textContent = Number(inputs.offset.value) === 50 ? 'Centre' : `${inputs.offset.value} %`;
    for (const button of document.querySelectorAll('[data-align]')) button.setAttribute('aria-pressed', String(button.dataset.align === inputs.offset.value));
    applyColors(); stats();
  }
  function stats() {
    const words = wordCount(script.value);
    $('[data-word-count]').textContent = words.toLocaleString('fr-FR');
    $('[data-reading-duration]').textContent = clock(words / Number(inputs.rate.value) * 60);
    $('[data-play]').disabled = moving || loading || workspace?.isBusy() || !script.value.trim(); surfaceButtons(); updateProgress();
  }
  function updateProgress() {
    const max = maxScroll(), percent = max ? clamp(reader.scrollTop / max * 100,0,100) : 0;
    $('[data-position]').value = percent; $('[data-position-value]').textContent = `${Math.round(percent)} %`;
    $('[data-elapsed]').textContent = clock(elapsed);
    $('[data-remaining]').textContent = clock(script.value.trim() ? Math.max(0,playWindow().end - reader.scrollTop) / Number(inputs.speed.value) + Math.max(0,playWindow().hold - boundaryHold) : 0);
  }
  function renderScript({fresh = false, anchor: suppliedAnchor} = {}) {
    clearTimeout(editTimer); editTimer = 0;
    let anchor = suppliedAnchor || captureAnchor();
    if (!suppliedAnchor && !fresh && renderedSource) {
      anchor = {...anchor, offset:mapOffset(renderedSource,script.value,anchor.offset)};
      // Ajouter une conclusion ne doit pas envoyer le lecteur à la nouvelle fin.
      if (anchor.pin === 'end') delete anchor.pin;
    }
    if (fresh) { anchor = {offset:0, fraction:.5, pin:'start'}; elapsed = 0; }
    const hadText = !!renderedSource.trim();
    pause(false, false);
    if (director && !suppliedAnchor && renderedSource !== script.value) director.rebase(renderedSource,script.value);
    renderedSource = script.value; text.replaceChildren();
    const select = $('[data-paragraph]'); select.replaceChildren(new Option('Repères du script…',''));
    paragraphs = blocks(renderedSource);
    if (!paragraphs.length) {
      const title = document.createElement('p'), note = document.createElement('p');
      title.className = 'prompt-placeholder'; title.textContent = 'Une idée, votre voix.';
      note.className = 'prompt-placeholder-small'; note.textContent = 'Ajoutez votre script, trouvez votre rythme, puis lancez la lecture.';
      text.append(title,note);
    } else for (const [index,part] of paragraphs.entries()) {
      const p = document.createElement('p'); p.textContent = part.text; p.dataset.paragraphIndex = index;
      part.node = p; text.append(p);
      select.append(new Option(`${index + 1}. ${part.text.split('\n')[0].slice(0,60)}`,String(index)));
    }
    measure(); restoreAnchor(anchor); stats();
    if (!loading) $('[data-play-status]').textContent = fresh || !hadText ? 'Prêt à vous suivre' : 'Texte corrigé · passage conservé';
  }
  function flushEdit() { if (editTimer) renderScript(); }

  function preferences() { return Object.fromEntries(Object.entries(inputs).map(([key,input]) => [key,input.type === 'checkbox' ? input.checked : input.value])); }
  function persist() {
    clearTimeout(saveTimer); saveTimer = 0;
    if (!workspace) return Promise.resolve(true);
    const token = ++persistence; savedAt = performance.now();
    const snapshot = {text:script.value,reading:captureAnchor(),elapsed,production:director?.snapshot()};
    return workspace.save(snapshot,preferences()).then(result => {
      if (token === persistence) $('[data-save-state]').textContent = result.saved ? 'Enregistré ici' : result.journaled ? 'Copie de secours · exporter' : 'Export conseillé';
      return true;
    }).catch(() => {
      $('[data-save-state]').textContent = 'Export conseillé'; workspace.error(); return false;
    });
  }
  function save() {
    if (loading) return;
    clearTimeout(saveTimer); $('[data-save-state]').textContent = 'Sauvegarde…';
    saveTimer = setTimeout(() => { flushEdit(); persist(); },450);
  }
  // Un premier usage sur téléphone/tablette part d'une colonne plus large.
  // Les choix déjà enregistrés, eux, sont repris tels quels ci-dessous.
  if (window.matchMedia('(max-width:1000px)').matches) { inputs.size.value = 36; inputs.width.value = 88; }
  function animate(callback) {
    frameOwner = reader.ownerDocument.defaultView || window;
    return frameOwner.requestAnimationFrame(() => callback(performance.now()));
  }
  function surfaceButtons() {
    const disabled = loading || moving || workspace?.isBusy();
    for (const selector of ['[data-floating]','[data-remote-open]','[data-focus-mode]','[data-fullscreen]']) {
      const button = $(selector); if (button) button.disabled = disabled;
    }
  }
  function remoteState() {
    const hidden = document.hidden && !floating?.isActive(), dialog = !!document.querySelector('dialog[open]');
    const busy = loading || moving || workspace?.isBusy() || hidden || dialog;
    return {title:$('[data-script-title]').value,scope:$('[data-scope-label]').textContent,
      status:hidden ? 'Affichez le lecteur sur l’ordinateur.' : dialog ? 'Terminez la fenêtre ouverte sur l’ordinateur.' : (camera?.recording ? 'REC · ' : '') + $('[data-play-status]').textContent,
      playing,counting,busy:!!busy,empty:!script.value.trim(),speed:Number(inputs.speed.value),progress:Number($('[data-position]').value),elapsed,
      remaining:Math.max(0,playWindow().end - reader.scrollTop) / Number(inputs.speed.value) + Math.max(0,playWindow().hold - boundaryHold),take:director?.takeNumber || 0};
  }
  function remoteCommand(command) {
    if (command === 'pause') { pause(); return; }
    if (remoteState().busy) return;
    switch (command) {
      case 'play': if (!playing && !counting) start(); break;
      case 'retake': director.retake(); break;
      case 'previous': director.previous(); break;
      case 'new-take': director.startTake(); break;
      case 'keep': director.verdict('keep'); break;
      case 'retry': director.verdict('retry'); break;
      case 'slower': speedChange(-5); break;
      case 'faster': speedChange(5); break;
      case 'begin': reset(); break;
      case 'quiet': setQuiet(!player.classList.contains('commands-hidden')); break;
    }
  }
  function controls(label) {
    const active = playing || counting, button = $('[data-play]');
    const icon = button.querySelector('[data-icon]'); if (window.PhilosophalIcons) icon.innerHTML = window.PhilosophalIcons.svg(active ? 'pause' : 'play');
    $('[data-play-label]').textContent = label || (active ? 'Pause' : director?.range ? 'Lire le passage' : 'Lire le script');
    button.setAttribute('aria-pressed',String(active)); player.classList.toggle('is-playing',playing); director?.paint(); surfaceButtons(); remote?.publish(); camera?.paint();
  }
  async function acquireWakeLock() {
    try {
      const screenNavigator = reader.ownerDocument.defaultView.navigator;
      if (!screenNavigator.wakeLock || !playing) return;
      const lock = await screenNavigator.wakeLock.request('screen');
      if (playing) wakeLock = lock; else await lock.release();
    } catch { /* Certains navigateurs ne permettent pas de maintenir l’écran éveillé. */ }
  }
  function releaseWakeLock() { wakeLock?.release().catch(() => {}); wakeLock = null; }
  function pause(announce = true, shouldSave = true) {
    const active = playing || counting; playing = false; counting = false;
    try { frameOwner.cancelAnimationFrame(frame); } catch {} frame = 0; last = 0;
    $('[data-countdown-overlay]').hidden = true; releaseWakeLock(); camera?.reading(null); director?.pause(); controls();
    if (active && announce) $('[data-play-status]').textContent = 'En pause';
    if (shouldSave && !loading) { rememberAnchor(); save(); }
  }
  function startScrolling() {
    counting = false; playing = true; position = reader.scrollTop; last = 0; boundaryHold = 0;
    $('[data-countdown-overlay]').hidden = true; $('[data-play-status]').textContent = 'Lecture en cours';
    camera?.reading(director?.currentTake || {id:'lecture',number:0,excerpt:script.value.slice(captureAnchor().offset,captureAnchor().offset + 500)});
    controls(); acquireWakeLock(); frame = animate(step);
  }
  function start() {
    flushEdit(); if (loading || moving || workspace?.isBusy() || !script.value.trim()) return;
    if (playing || counting) { pause(); return; }
    const bounds = playWindow();
    if (reader.scrollTop < bounds.start - 1 || reader.scrollTop >= bounds.end - .5) { reader.scrollTop = bounds.start; position = bounds.start; elapsed = 0; }
    const delay = Number(inputs.countdown.value);
    if (!delay) { startScrolling(); return; }
    counting = true; countdownEnd = performance.now() + delay * 1000;
    $('[data-countdown-overlay]').hidden = false; $('[data-countdown-overlay]').textContent = delay;
    $('[data-play-status]').textContent = `Départ dans ${delay} secondes`; controls('Annuler');
    frame = animate(countdownStep);
  }
  function countdownStep(now) {
    if (!counting) return;
    const left = Math.ceil((countdownEnd - now) / 1000);
    if (left <= 0) { startScrolling(); return; }
    $('[data-countdown-overlay]').textContent = left; frame = animate(countdownStep);
  }
  function step(now) {
    if (!playing) return;
    if (!last) last = now;
    const dt = Math.min(.15,(now - last) / 1000); last = now;
    const bounds = playWindow();
    elapsed += dt; director?.tick(dt); position = Math.min(bounds.end,position + Number(inputs.speed.value) * dt); reader.scrollTop = position; updateProgress();
    if (now - anchorAt > 250) rememberAnchor();
    if (now - savedAt > 5000) persist();
    if (position >= bounds.end - .25) {
      boundaryHold += dt;
      if (boundaryHold >= bounds.hold) {
        if (director?.loop && director.repeat()) return;
        if (!director?.range && inputs.loop.checked && director.repeat(true)) return;
        director?.finish(); pause(false);
        $('[data-play-status]').textContent = director?.range ? 'Passage terminé' : 'Lecture terminée'; controls('Relire'); return;
      }
    } else boundaryHold = 0;
    frame = animate(step);
  }
  function seek(value) { boundaryHold = 0; reader.scrollTop = clamp(value,0,maxScroll()); position = reader.scrollTop; last = 0; rememberAnchor(); updateProgress(); save(); }
  function reset() {
    flushEdit(); pause(false); director?.finish(); elapsed = 0; seek(playWindow().start);
    $('[data-play-status]').textContent = 'Prêt pour une nouvelle prise';
  }
  function speedChange(delta) {
    inputs.speed.value = clamp(Number(inputs.speed.value) + delta,5,180); applyPrefs(); save();
  }
  function setFocus(on) {
    changeLayout(() => {
      document.body.classList.toggle('prompt-focus',on);
      $('[data-focus-mode]').setAttribute('aria-pressed',String(on));
      $('[data-focus-mode]').setAttribute('aria-label',on ? 'Script et réglages' : 'Mode lecture');
      $('[data-focus-label]').textContent = on ? 'Script et réglages' : 'Mode lecture';
      $('#prompt-panel').inert = on || moving;
    });
    if (on && window.matchMedia('(max-width:1000px)').matches) window.scrollTo({top:0,behavior:'instant'});
  }
  function setQuiet(on) {
    changeLayout(() => {
      player.classList.toggle('commands-hidden',on);
      const button = $('[data-quiet-mode]'); button.setAttribute('aria-pressed',String(on));
      button.setAttribute('aria-label',on ? 'Afficher les commandes' : 'Masquer les commandes'); button.title = button.getAttribute('aria-label');
      $('[data-quiet-label]').textContent = on ? 'Afficher les commandes' : 'Commandes';
      button.querySelector('[data-icon]').innerHTML = window.PhilosophalIcons.svg(on ? 'eye' : 'hidden');
      $('.prompt-transport').inert = on;
    });
  }
  async function fullscreen() {
    if (floating?.isActive()) floating.restore();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else {
        if (!document.documentElement.requestFullscreen) { setFocus(true); toast('Mode lecture activé. Le plein écran n’est pas disponible dans ce navigateur.'); return; }
        fullscreenFocus = !document.body.classList.contains('prompt-focus');
        await document.documentElement.requestFullscreen();
      }
    } catch { setFocus(true); toast('Mode lecture activé. Le plein écran n’est pas disponible dans ce navigateur.'); }
  }
  document.addEventListener('fullscreenchange',() => {
    const on = !!document.fullscreenElement;
    $('[data-fullscreen]').setAttribute('aria-pressed',String(on));
    $('[data-fullscreen]').setAttribute('aria-label',on ? 'Quitter le plein écran' : 'Plein écran');
    $('[data-fullscreen]').querySelector('span:last-child').textContent = on ? 'Quitter le plein écran' : 'Plein écran';
    if (on) setFocus(true); else if (fullscreenFocus) { setFocus(false); fullscreenFocus = false; }
    pause();
  });

  for (const mood of moods) {
    const button = document.createElement('button'), swatch = document.createElement('span'), name = document.createElement('span');
    button.type = 'button'; button.dataset.colorPreset = mood.id; button.setAttribute('aria-pressed','false');
    button.style.setProperty('--mood-ink',mood.text); button.style.setProperty('--mood-bg',mood.background);
    swatch.className = 'prompt-mood-swatch'; swatch.textContent = 'Aa'; swatch.setAttribute('aria-hidden','true');
    name.textContent = mood.name; button.append(swatch,name); $('[data-color-presets]').append(button);
  }
  const tabs = [...document.querySelectorAll('[data-tab]')];
  function selectTab(tab, focus = false) {
    for (const button of tabs) {
      const active = button === tab; button.setAttribute('aria-selected',String(active)); button.tabIndex = active ? 0 : -1;
      document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
    }
    if (focus) tab.focus(); camera?.paint();
  }
  for (const tab of tabs) {
    tab.addEventListener('click',() => selectTab(tab));
    tab.addEventListener('keydown',event => {
      let next;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') next = tabs[(tabs.indexOf(tab) + (event.key === 'ArrowLeft' ? tabs.length - 1 : 1)) % tabs.length];
      else if (event.key === 'Home') next = tabs[0]; else if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) { event.preventDefault(); event.stopPropagation(); selectTab(next,true); }
    });
  }
  script.addEventListener('input',() => {
    pause(false); clearTimeout(editTimer);
    editTimer = setTimeout(() => { renderScript(); save(); },100); save();
  });
  for (const input of Object.values(inputs)) input.addEventListener('input',() => {
    // L'événement arrive après la mise à jour de la valeur, mais avant le reflow du texte.
    changeLayout(() => {
      if (input === inputs.theme) { if (input.value !== 'custom') setPalette(input.value); }
      else if (input.type === 'color') inputs.theme.value = 'custom';
      applyPrefs();
    });
  });
  for (const el of document.querySelectorAll('[data-color-hex]')) {
    el.addEventListener('input',() => {
      const value = el.value.startsWith('#') ? el.value : '#' + el.value;
      el.setAttribute('aria-invalid',String(!isColor(value)));
      if (!isColor(value)) return;
      inputs[el.dataset.colorHex].value = value; inputs[el.dataset.colorHex].dispatchEvent(new Event('input',{bubbles:true}));
    });
    el.addEventListener('change',() => {
      if (el.getAttribute('aria-invalid') === 'true') toast('Saisissez un code comme #62409B.');
      el.value = inputs[el.dataset.colorHex].value.toUpperCase(); el.removeAttribute('aria-invalid');
    });
  }
  $('[data-color-presets]').addEventListener('click',event => {
    const button = event.target.closest('[data-color-preset]'); if (!button) return;
    changeLayout(() => { setPalette(button.dataset.colorPreset); applyPrefs(); });
  });
  $('[data-reset-colors]').addEventListener('click',() => changeLayout(() => { setPalette('dark'); applyPrefs(); }));
  for (const button of document.querySelectorAll('[data-align]')) button.addEventListener('click',() => changeLayout(() => { inputs.offset.value = button.dataset.align; applyPrefs(); }));
  $('[data-reset-layout]').addEventListener('click',() => changeLayout(() => {
    inputs.offset.value = 50; inputs.width.value = window.matchMedia('(max-width:1000px)').matches ? 88 : 64;
    inputs.guidePosition.value = 35; inputs.guide.checked = true; applyPrefs();
  }));
  const handle = $('[data-guide-handle]');
  function moveGuide(clientY) {
    const value = Math.round(clamp((clientY - reader.getBoundingClientRect().top) / reader.clientHeight * 100,15,75));
    changeLayout(() => { inputs.guidePosition.value = value; applyPrefs(); });
  }
  handle.addEventListener('pointerdown',event => {
    if (event.button !== 0) return;
    event.preventDefault(); handle.focus({preventScroll:true}); pause(); dragId = event.pointerId; handle.setPointerCapture(dragId); moveGuide(event.clientY);
  });
  handle.addEventListener('pointermove',event => { if (dragId === event.pointerId) moveGuide(event.clientY); });
  const stopDrag = () => { dragId = null; save(); };
  handle.addEventListener('pointerup',stopDrag); handle.addEventListener('pointercancel',stopDrag); handle.addEventListener('lostpointercapture',stopDrag);
  handle.addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault(); event.stopPropagation(); pause();
    changeLayout(() => { inputs.guidePosition.value = clamp(Number(inputs.guidePosition.value) + (event.key === 'ArrowUp' ? -1 : 1),15,75); applyPrefs(); });
  });
  reader.addEventListener('scroll',() => {
    if (loading) return;
    if (!playing) { position = reader.scrollTop; rememberAnchor(); save(); }
    updateProgress();
  },{passive:true});
  for (const type of ['pointerdown','wheel','touchstart']) reader.addEventListener(type,() => {
    if (playing || counting) pause();
  },{passive:true});
  $('[data-position]').addEventListener('input',event => { const value = Number(event.target.value); flushEdit(); pause(); director?.finish(); seek(value / 100 * maxScroll()); });
  $('[data-paragraph]').addEventListener('change',event => {
    const value = event.target.value; flushEdit(); const part = paragraphs[Number(value)]; if (value === '' || !part) return;
    pause(); director?.finish(); restoreAnchor({offset:part.start,fraction:.5}); save(); $('[data-play-status]').textContent = `Passage ${Number(value) + 1}`;
  });
  $('[data-play]').addEventListener('click',() => { start(); reader.focus({preventScroll:true}); });
  $('[data-reset]').addEventListener('click',reset); $('[data-slower]').addEventListener('click',() => speedChange(-5)); $('[data-faster]').addEventListener('click',() => speedChange(5));
  $('[data-focus-mode]').addEventListener('click',() => setFocus(!document.body.classList.contains('prompt-focus')));
  $('[data-fullscreen]').addEventListener('click',fullscreen); $('[data-quiet-mode]').addEventListener('click',() => setQuiet(!player.classList.contains('commands-hidden')));
  $('[data-calibrate]').addEventListener('click',() => {
    flushEdit(); const words = wordCount(script.value);
    if (!words) { toast('Ajoutez un script pour estimer la vitesse.'); return; }
    inputs.speed.value = clamp(Math.round(text.scrollHeight / words * Number(inputs.rate.value) / 60),5,180); applyPrefs(); save();
    toast('Vitesse estimée pour cette mise en page. Affinez-la avec + et −.');
  });
  $('[data-copy]').addEventListener('click',async () => {
    try { await navigator.clipboard.writeText(script.value); toast('Script copié.'); }
    catch { script.select(); toast('Texte sélectionné : utilisez Ctrl+C.'); }
  });
  $('[data-template]').addEventListener('click',() => {
    if (captureBusy) { toast('Arrêtez l’enregistrement avant de modifier le script.'); return; }
    script.setRangeText('ACCROCHE\nUne phrase pour ouvrir la question.\n\nIDÉE PRINCIPALE\nUne idée, un exemple, une référence.\n\nCONCLUSION\nLa question à garder en tête.\n',script.selectionStart,script.selectionEnd,'end');
    renderScript(); save(); script.focus();
  });
  function onKeyDown(event) {
    if ($('dialog[open]') || workspace?.isBusy()) return;
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const target = event.target?.nodeType === 1 ? event.target : null;
    const typing = target?.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
    if (typing) return;
    if (event.key === 'Escape') { pause(); if (player.classList.contains('commands-hidden')) setQuiet(false); return; }
    // Laisser Espace et Entrée activer normalement les boutons et les accordéons.
    if (target?.closest('button,a,summary,[role="tab"]')) return;
    const key = event.key.toLowerCase();
    if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) start(); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); speedChange(5); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); speedChange(-5); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); pause(); director?.finish(); seek(reader.scrollTop + reader.clientHeight * (event.key === 'ArrowLeft' ? -.3 : .3)); }
    else if (key === 'r' && !event.repeat) { event.preventDefault(); director?.retake(); }
    else if (key === 'p' && !event.repeat) { event.preventDefault(); director?.previous(); }
    else if (key === 'n' && !event.repeat) { event.preventDefault(); director?.startTake(); }
    else if (key === 'g' && !event.repeat) { event.preventDefault(); director?.verdict('keep'); }
    else if (event.key === 'Home') { event.preventDefault(); if (!event.repeat) reset(); }
    else if (key === 'f' && !event.repeat) { event.preventDefault(); fullscreen(); }
    else if (key === 'l' && !event.repeat) { event.preventDefault(); setFocus(!document.body.classList.contains('prompt-focus')); }
  }
  window.addEventListener('keydown',onKeyDown);
  function suspend() {
    const pending = playing || counting || editTimer || saveTimer;
    flushEdit(); pause(false,false);
    camera?.suspend(); if (pending) persist();
  }
  document.addEventListener('visibilitychange',() => { if (document.hidden && !floating?.isActive()) suspend(); });
  window.addEventListener('pagehide',suspend);
  new ResizeObserver(() => {
    if (moving || geometry.width === reader.clientWidth && geometry.height === reader.clientHeight) return;
    const anchor = loading && !interacted ? initialAnchor : stableAnchor; measure(); restoreAnchor(anchor); save();
  }).observe(reader);
  for (const type of ['pointerdown','keydown','wheel','touchstart']) window.addEventListener(type,() => { interacted = true; },{capture:true,passive:true});
  let floatingKeys = null;
  function floatingVisibility() { if (reader.ownerDocument.hidden) suspend(); }
  floating = window.PhilosophalPromptFloating.create({player,toast,ready:() => !loading && !moving && !workspace?.isBusy(),
    before:() => {
      flushEdit(); const anchor = reader.clientHeight > 0 && reader.ownerDocument.defaultView && !reader.ownerDocument.defaultView.closed ? captureAnchor() : stableAnchor;
      pause(false,false); highlightPhrase(null); moving = true; $('#prompt-panel').inert = true; surfaceButtons(); return anchor;
    },
    attach:(surface,on) => {
      if (floatingKeys) { try { floatingKeys.removeEventListener('keydown',onKeyDown); floatingKeys.document?.removeEventListener('visibilitychange',floatingVisibility); } catch {} }
      floatingKeys = on ? surface : null; floatingDocument = on ? surface.document : null;
      if (on) { surface.addEventListener('keydown',onKeyDown); surface.document.addEventListener('visibilitychange',floatingVisibility); }
    },
    after:anchor => {
      measure(); restoreAnchor(anchor); moving = false; $('#prompt-panel').inert = document.body.classList.contains('prompt-focus');
      controls(); stats(); save();
    }
  });
  remote = window.PhilosophalPromptConnect.create({pause:() => pause(),state:remoteState,command:remoteCommand,toast});
  director = window.PhilosophalPromptProduction.create({
    find:$,source:() => script.value,anchor:captureAnchor,clock,toast,flush:flushEdit,save,
    takeUpdated:take => camera?.updateTake(take),
    ready:() => !loading && !moving && !workspace?.isBusy(),
    selection:() => ({start:script.selectionStart,end:script.selectionEnd}),
    invalidate:() => { windowCache = null; controls(); },
    go:offset => { boundaryHold = 0; restoreAnchor({offset,fraction:.5}); save(); },
    pause:() => pause(false,false),start,
    status:message => { $('[data-play-status]').textContent = message; },
    tab:name => selectTab($(`[data-tab="${name}"]`)),highlight:highlightPhrase
  });
  workspace = await window.PhilosophalPromptWorkspace.create({
    find:$,toast, scheduleSave:save,
    readOnly:() => captureBusy,
    guard:() => captureBusy ? 'Arrêtez l’enregistrement avant de modifier ou changer le script.' : null,
    capture:() => { flushEdit(); return {text:script.value,reading:captureAnchor(),elapsed,production:director.snapshot()}; },
    flush:() => { flushEdit(); return persist().then(ok => { if (!ok) throw new Error('L’enregistrement a échoué. Exportez votre texte avant de changer de script.'); }); },
    pause:() => pause(false,false),
    setBusy:on => { director?.setBusy(on); script.disabled = on || captureBusy; $('[data-script-title]').disabled = on || captureBusy; $('[data-script-collection]').disabled = on || captureBusy; $('[data-play]').disabled = on || moving || !script.value.trim(); surfaceButtons(); },
    tab:name => selectTab($(`[data-tab="${name}"]`)),
    load:doc => {
      pause(false,false); clearTimeout(saveTimer); clearTimeout(editTimer); editTimer = 0;
      script.value = doc.text; elapsed = doc.elapsed; initialAnchor = doc.reading; director.load(doc.production);
      renderScript({anchor:doc.reading}); controls();
      $('[data-play-status]').textContent = doc.reading?.offset ? 'Votre passage a été retrouvé' : 'Prêt à vous suivre';
      $('[data-save-state]').textContent = workspace?.offline ? 'Export conseillé' : 'Enregistré ici';
    }
  });
  camera = await window.PhilosophalPromptCamera.create({find:$,toast,pause:() => pause(false,false),
    ready:() => !loading && !moving && !workspace.isBusy() && !!script.value.trim(),
    flush:async () => { flushEdit(); if (!await persist()) throw new Error('Exportez votre script avant de commencer la vidéo.'); },
    script:() => ({id:workspace.current.id,title:$('[data-script-title]').value,collection:$('[data-script-collection]').value,text:script.value}),
    startTake:() => director.startTake(),
    changed:on => { const changed=captureBusy!==on; captureBusy=on;
      if (changed) workspace.refreshBusy();
      const disabled=on || loading || workspace.isBusy(); script.disabled=disabled; $('[data-script-title]').disabled=disabled; $('[data-script-collection]').disabled=disabled;
    }
  });
  const prefs = workspace.prefs;
  for (const [key,value] of Object.entries(prefs || {})) {
    const input = inputs[key]; if (!input) continue;
    if (input.type === 'checkbox') input.checked = value === true;
    else if (input.type === 'range' && Number.isFinite(Number(value))) input.value = clamp(Number(value),Number(input.min),Number(input.max));
    else if (input.type === 'color') { if (isColor(value)) input.value = value; }
    else if (input.options && [...input.options].some(o => o.value === String(value))) input.value = value;
  }
  if (!isColor(prefs?.textColor) || !isColor(prefs?.backgroundColor)) setPalette(inputs.theme.value === 'custom' ? 'dark' : inputs.theme.value);
  script.value = workspace.current.text; elapsed = workspace.current.elapsed; initialAnchor = workspace.current.reading; director.load(workspace.current.production);
  applyPrefs(); renderScript({anchor:initialAnchor}); controls(); script.disabled = false;
  // Le passage est replacé après les polices locales et la restauration du navigateur.
  const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load',resolve,{once:true}));
  Promise.all([document.fonts?.ready || Promise.resolve(),loaded]).then(() => requestAnimationFrame(() => {
    const anchor = interacted ? stableAnchor : initialAnchor; measure(); restoreAnchor(anchor); loading = false; stats(); director.paint(); camera.paint(); surfaceButtons();
    $('[data-save-state]').textContent = workspace.offline ? 'Export conseillé' : 'Enregistré ici';
    if (!interacted && reader.scrollTop > 1) $('[data-play-status]').textContent = 'Votre passage a été retrouvé';
  }));
})();

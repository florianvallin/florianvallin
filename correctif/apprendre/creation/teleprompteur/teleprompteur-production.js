/* Préparation des passages et carnet de prises. Le lecteur garde la maîtrise du défilement. */
(() => {
  'use strict';
  const R = window.PhilosophalPromptTakes, T = window.PhilosophalPromptText, $ = selector => document.querySelector(selector);
  function create(hooks) {
    const $ = hooks.find || (selector => document.querySelector(selector));
    let state = R.normalize({},''), active = null, duration = 0, busy = false;
    const list = $('[data-take-list]'), select = $('[data-take-passage]');
    const latest = () => state.takes[state.takes.length - 1];
    const label = {review:'À évaluer',keep:'À garder',retry:'À refaire'};
    function update(id,patch) {
      state = {...state,takes:state.takes.map(take => take.id === id ? {...take,...patch,updatedAt:Date.now()} : take)};
      if ('status' in patch || 'note' in patch) hooks.takeUpdated?.(state.takes.find(take => take.id === id));
    }
    function sync() {
      const take = state.takes.find(take => take.id === active);
      if (take && Math.abs(take.duration - duration) > .01) update(active,{duration});
    }
    function scopeName() {
      if (!state.range) return 'Tout le script';
      const index = T.blocks(hooks.source()).findIndex(part => part.start === state.range.start && part.end === state.range.end);
      return index < 0 ? 'Sélection du script' : `Passage ${index + 1} / ${T.blocks(hooks.source()).length}`;
    }
    function paint() {
      const take = latest(), empty = !hooks.source().trim(), disabled = busy || !hooks.ready();
      $('[data-take-count]').textContent = `${state.takes.length} prise${state.takes.length > 1 ? 's' : ''}`;
      $('[data-takes-empty]').hidden = state.takes.length > 0;
      $('[data-new-take]').disabled = disabled || empty;
      $('[data-keep-take]').disabled = disabled || !take;
      $('[data-retry-take]').disabled = disabled || !take;
      $('[data-keep-take]').setAttribute('aria-pressed',String(take?.status === 'keep'));
      $('[data-retry-take]').setAttribute('aria-pressed',String(take?.status === 'retry'));
      $('[data-export-takes]').disabled = !state.takes.length || busy;
      $('[data-passage-loop]').disabled = !state.range || disabled;
      $('[data-passage-loop]').checked = state.loop;
      select.disabled = disabled || empty;
      $('[data-scope-label]').textContent = scopeName() + (state.loop ? ' · en boucle' : '');
      $('[data-scope-label]').title = $('[data-scope-label]').textContent;
      $('[data-attempt-label]').textContent = take ? `Prise ${take.number}${take.status === 'keep' ? ' ✓' : ''}` : '';
      $('[data-retake]').disabled = disabled || empty;
      $('[data-previous-phrase]').disabled = disabled || empty;
      for (const item of list.children) {
        const entry = state.takes.find(take => take.id === item.dataset.takeId);
        if (!entry) continue;
        item.dataset.verdict = entry.status;
        item.querySelector('[data-take-duration]').textContent = hooks.clock(entry.duration);
        item.querySelector('[data-take-status]').value = entry.status;
      }
    }
    function renderList() {
      list.replaceChildren();
      for (const take of [...state.takes].reverse()) {
        const item = document.createElement('li'), heading = document.createElement('div'), title = document.createElement('strong'), meta = document.createElement('span'), time = document.createElement('span');
        item.dataset.takeId = take.id; item.dataset.verdict = take.status;
        heading.className = 'prompt-take-heading'; title.textContent = `Prise ${String(take.number).padStart(2,'0')}`;
        meta.append(new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(take.createdAt) + ' · ');
        time.dataset.takeDuration = ''; time.textContent = hooks.clock(take.duration); meta.append(time); heading.append(title,meta);
        const excerpt = document.createElement('p'); excerpt.className = 'prompt-take-excerpt'; excerpt.textContent = take.excerpt;
        const verdict = document.createElement('select'); verdict.dataset.takeStatus = ''; verdict.setAttribute('aria-label',`État de la prise ${take.number}`);
        for (const [value,text] of Object.entries(label)) verdict.append(new Option(text,value)); verdict.value = take.status;
        const details = document.createElement('details'), summary = document.createElement('summary'), note = document.createElement('textarea');
        summary.textContent = take.note ? 'Note de montage · renseignée' : 'Note de montage';
        note.dataset.takeNote = ''; note.maxLength = 600; note.rows = 2; note.placeholder = 'Intonation, coupe à prévoir, fichier vidéo…'; note.value = take.note;
        note.setAttribute('aria-label',`Note de montage de la prise ${take.number}`); details.append(summary,note);
        item.append(heading,excerpt,verdict,details); list.append(item);
      }
    }
    function renderScope() {
      const source = hooks.source(), parts = T.blocks(source);
      select.replaceChildren(new Option('Tout le script','all'));
      for (const [index,part] of parts.entries()) select.append(new Option(`${index + 1}. ${part.text.split('\n')[0].slice(0,65)}`,String(index)));
      if (state.range) {
        const index = parts.findIndex(part => part.start === state.range.start && part.end === state.range.end);
        if (index < 0) { select.append(new Option('Sélection du script','selection')); select.value = 'selection'; } else select.value = String(index);
      }
      $('[data-passage-preview]').textContent = state.range ? source.slice(state.range.start,state.range.end).replace(/\s+/g,' ').slice(0,180) : 'Une ligne vide entre deux paragraphes crée un passage. Vous pouvez aussi sélectionner du texte dans l’onglet Script.';
      hooks.invalidate(); paint();
    }
    function pause() { sync(); paint(); }
    function finish() { sync(); active = null; duration = 0; paint(); }
    function startTake(from = null) {
      if (!hooks.ready() || !hooks.source().trim()) return false;
      hooks.flush();
      if (state.takes.length >= R.MAX_TAKES) { hooks.pause(); hooks.toast('Ce script contient 500 prises. Exportez son journal, puis dupliquez le script pour continuer.'); return false; }
      hooks.pause(); finish();
      const source = hooks.source(), bounds = state.range || R.range({start:0,end:source.length},source);
      const start = from === null ? bounds.start : T.clamp(from,bounds.start,bounds.end - 1), now = Date.now();
      const take = {id:R.id(),number:state.nextNumber,createdAt:now,updatedAt:now,duration:0,status:'review',note:'',start,end:bounds.end,excerpt:source.slice(start,bounds.end).replace(/\s+/g,' ').slice(0,500)};
      state = {...state,nextNumber:state.nextNumber + 1,takes:[...state.takes,take]}; active = take.id; duration = 0;
      renderList(); paint(); hooks.go(start); hooks.save(); hooks.start(); return true;
    }
    function retake() {
      hooks.flush(); const phrase = R.phraseAt(hooks.source(),hooks.anchor().offset,false,state.range);
      if (phrase && startTake(phrase.start)) hooks.highlight(phrase);
    }
    function previous() {
      if (!hooks.ready()) return;
      hooks.flush(); const phrase = R.phraseAt(hooks.source(),hooks.anchor().offset,true,state.range); if (!phrase) return;
      hooks.pause(); finish(); hooks.go(phrase.start); hooks.highlight(phrase); hooks.status('Phrase précédente · prête à relire'); hooks.save();
    }
    function selectRange(range) {
      hooks.pause(); finish(); state = {...state,range,loop:!!range && state.loop};
      renderScope(); hooks.highlight(null); hooks.go(range?.start || 0); hooks.status(range ? 'Passage prêt à répéter' : 'Prêt à vous suivre'); hooks.save();
    }
    function verdict(status) {
      if (busy || !hooks.ready() || !latest()) return;
      sync(); update(latest().id,{status}); paint(); hooks.save();
      hooks.toast(`Prise ${latest().number} · ${label[status].toLocaleLowerCase('fr-FR')}.`);
    }
    select.addEventListener('change',() => {
      hooks.flush(); const part = T.blocks(hooks.source())[Number(select.value)];
      if (select.value === 'selection') return;
      selectRange(select.value === 'all' || !part ? null : {start:part.start,end:part.end});
    });
    $('[data-use-selection]').addEventListener('click',() => {
      if (!hooks.ready()) return;
      hooks.flush(); const selected = hooks.selection(), range = R.range(selected,hooks.source());
      if (!range) { hooks.toast('Sélectionnez le passage à travailler dans votre texte, puis cliquez sur ce bouton.'); return; }
      selectRange(range); hooks.tab('takes');
    });
    $('[data-passage-loop]').addEventListener('change',event => {
      const checked = event.target.checked; hooks.pause(); state = {...state,loop:!!state.range && checked}; renderScope(); hooks.save();
    });
    $('[data-new-take]').addEventListener('click',() => startTake());
    $('[data-keep-take]').addEventListener('click',() => verdict('keep'));
    $('[data-retry-take]').addEventListener('click',() => verdict('retry'));
    $('[data-retake]').addEventListener('click',retake); $('[data-previous-phrase]').addEventListener('click',previous);
    list.addEventListener('focusin',event => {
      if (event.target.matches('select,textarea')) hooks.pause();
    });
    list.addEventListener('change',event => {
      if (!event.target.matches('[data-take-status]')) return;
      const id = event.target.closest('[data-take-id]').dataset.takeId; update(id,{status:event.target.value}); paint(); hooks.save();
    });
    list.addEventListener('input',event => {
      if (!event.target.matches('[data-take-note]')) return;
      const item = event.target.closest('[data-take-id]'); update(item.dataset.takeId,{note:event.target.value});
      item.querySelector('summary').textContent = event.target.value ? 'Note de montage · renseignée' : 'Note de montage'; hooks.save();
    });
    $('[data-export-takes]').addEventListener('click',() => {
      sync(); const title = $('[data-script-title]').value.trim() || 'Mon script', url = URL.createObjectURL(new Blob([R.journal(title,state)],{type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'prises-' + title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').slice(0,80) + '.txt'; link.click();
      setTimeout(() => URL.revokeObjectURL(url),1500); hooks.toast('Journal de prises exporté.');
    });
    return {
      get currentTake(){return state.takes.find(take => take.id === active) || null;},get range(){return state.range;},get loop(){return state.loop;},get takeNumber(){return latest()?.number || 0;},
      snapshot:() => { sync(); return JSON.parse(JSON.stringify(state)); },
      tick:dt => { if (active) duration = Math.min(86400,duration + dt); },pause,finish,paint,retake,previous,startTake,verdict,
      setBusy:value => { busy = value; paint(); for (const field of list.querySelectorAll('select,textarea')) field.disabled = value; },
      load:value => { active = null; duration = 0; state = R.normalize(value,hooks.source()); renderScope(); renderList(); paint(); hooks.highlight(null); },
      rebase:(before,after) => { const wasLooping = state.loop; finish(); state = R.rebase(state,before,after); renderScope(); renderList(); paint(); hooks.highlight(null); if (wasLooping && before !== after) hooks.toast('Texte modifié · boucle désactivée. Vérifiez votre passage avant de la réactiver.'); },
      repeat:(whole = false) => {
        if ((!state.range || !state.loop) && !whole) return false;
        if (active) return startTake();
        hooks.pause(); hooks.go(state.range?.start || 0); hooks.start(); return true;
      }
    };
  }
  window.PhilosophalPromptProduction = {create};
})();

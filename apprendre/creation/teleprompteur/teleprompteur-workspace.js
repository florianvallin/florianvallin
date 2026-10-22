/* Interface de la bibliothèque. Le lecteur reste responsable de sa position et de ses réglages. */
(() => {
  'use strict';
  const L = window.PhilosophalPromptLibrary, $ = selector => document.querySelector(selector);
  const date = (value,precise = false) => new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',...(precise ? {second:'2-digit'} : {})}).format(value);
  const words = value => window.PhilosophalPromptText.wordCount(value);
  const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,90) || 'script';
  function download(value,type,name) {
    const url = URL.createObjectURL(new Blob([value],{type})), link = document.createElement('a');
    link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url),1500);
  }
  async function create(hooks) {
    const $ = hooks.find || (selector => document.querySelector(selector));
    let store, state, offline = false, busy = false, autoTimer = 0, queue = Promise.resolve();
    const owner = L.id(), revisions = new Map(), aliases = new Map();
    try { store = await L.open(); state = await store.initialize(); }
    catch (error) {
      offline = true;
      const legacy = L.storageRead(L.LEGACY), pending = (() => { try { return Object.keys(localStorage).filter(key => key.startsWith(L.DRAFT)).map(key => L.storageRead(key)).sort((a,b) => (b?.at || 0) - (a?.at || 0))[0]?.doc; } catch { return null; } })();
      const doc = L.normalize(pending || {text:typeof legacy?.text === 'string' ? legacy.text.slice(0,L.MAX_TEXT) : '',title:'Script à exporter',reading:legacy?.reading,elapsed:legacy?.elapsed});
      state = {active:doc,documents:[doc],prefs:L.storageRead(L.PREFS) || legacy?.prefs || {}};
      store = {all:async () => [doc],save:async value => value,history:async () => [],checkpoint:async () => {},export:async () => L.encodeArchive([active],[])};
      const warning = $('[data-library-warning]'); warning.hidden = false;
      warning.textContent = 'La bibliothèque ne peut pas être enregistrée dans ce navigateur. Vous pouvez lire et exporter votre texte, puis réessayer après avoir rechargé la page.';
    }
    let active = state.active, documents = state.documents, selectedVersion = null, versions = [], archivedView = false;
    for (const doc of documents) revisions.set(doc.id,doc.revision);
    function titleFields() {
      $('[data-script-title]').value = active.title; $('[data-script-collection]').value = active.collection;
      $('[data-current-title]').textContent = active.title; $('[data-current-title]').title = active.title;
      document.title = `${active.title} — Téléprompteur · Philosophal`;
    }
    function warning(message) { $('[data-library-warning]').textContent = message; $('[data-library-warning]').hidden = false; }
    function setBusy(value) {
      busy = value; $('#prompt-panel').setAttribute('aria-busy',String(value)); hooks.setBusy(value);
      for (const el of document.querySelectorAll('[data-workspace-action]')) el.disabled = value || hooks.readOnly?.() || offline && el.dataset.workspaceAction !== 'export';
      for (const el of document.querySelectorAll('[data-open-script]')) el.disabled = value || hooks.readOnly?.();
      $('[data-version-restore]').disabled = value || hooks.readOnly?.() || offline || !selectedVersion || L.sameContent(active,selectedVersion);
    }
    async function run(action) {
      if (busy) return;
      const blocked = hooks.guard?.(); if (blocked) { hooks.toast(blocked); return; }
      setBusy(true);
      try { await action(); } catch (error) { hooks.toast(error.message || 'L’opération a échoué. Votre script reste disponible.'); }
      finally { setBusy(false); }
    }
    function renderLibrary() {
      const merged = documents.map(doc => doc.id === active.id ? active : doc);
      const collections = [...new Set(merged.filter(doc => !doc.archived).map(doc => doc.collection).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fr'));
      const collectionSelect = $('[data-library-collection]'), selected = collectionSelect.value;
      collectionSelect.replaceChildren(new Option('Toutes les séries',''));
      for (const value of collections) collectionSelect.append(new Option(value,value));
      if ([...collectionSelect.options].some(o => o.value === selected)) collectionSelect.value = selected;
      const suggestions = $('[data-collections]'); suggestions.replaceChildren();
      for (const value of collections) suggestions.append(new Option(value,value));
      const matches = L.filterScripts(merged,{query:$('[data-library-search]').value,collection:collectionSelect.value,archived:archivedView,sort:$('[data-library-sort]').value});
      const total = merged.filter(doc => doc.archived === archivedView).length;
      $('[data-library-count]').textContent = `${matches.length}${matches.length !== total ? ' / ' + total : ''} script${matches.length > 1 ? 's' : ''}`;
      const list = $('[data-library-list]'); list.replaceChildren();
      for (const doc of matches) {
        const item = document.createElement('li'), open = document.createElement('button'), title = document.createElement('strong'), collection = document.createElement('span'), meta = document.createElement('span');
        item.className = 'prompt-library-item'; item.classList.toggle('is-current',doc.id === active.id);
        open.disabled = busy || hooks.readOnly?.(); open.type = 'button'; open.className = 'prompt-library-open'; open.dataset.openScript = doc.id;
        open.setAttribute('aria-label',`${archivedView ? 'Restaurer' : 'Ouvrir'} ${doc.title}`);
        if (doc.id === active.id) open.setAttribute('aria-current','true');
        title.textContent = doc.title; collection.className = 'prompt-library-series'; collection.textContent = doc.collection || 'Sans série';
        meta.className = 'prompt-library-meta'; meta.textContent = `${words(doc.text).toLocaleString('fr-FR')} mots · ${date(doc.updatedAt)}`;
        open.append(collection,title,meta); item.append(open); list.append(item);
      }
      $('[data-library-empty]').hidden = matches.length > 0;
      $('[data-library-empty]').textContent = total ? 'Aucun script ne correspond à votre recherche.' : archivedView ? 'Aucun script archivé.' : 'Votre prochain script commence ici.';
      $('[data-archive-view]').setAttribute('aria-pressed',String(archivedView));
      $('[data-active-view]').setAttribute('aria-pressed',String(!archivedView));
    }
    function queueSave(snapshot,prefs) {
      const payload = {...active,...snapshot,title:$('[data-script-title]').value.trim().slice(0,120) || 'Sans titre',collection:$('[data-script-collection]').value.trim().slice(0,90)};
      const changed = !L.sameContent(active,payload);
      active = {...active,...payload};
      $('[data-current-title]').textContent = active.title; $('[data-current-title]').title = active.title;
      document.title = `${active.title} — Téléprompteur · Philosophal`;
      try { localStorage.setItem(L.PREFS,JSON.stringify(prefs)); } catch {}
      const journaled = L.journal({...payload,revision:revisions.get(payload.id) ?? payload.revision},owner);
      const at = L.storageRead(L.DRAFT + payload.id)?.at;
      const operation = queue.then(async () => {
        const alias = aliases.get(payload.id), originalId = payload.id;
        if (alias) { payload.id = alias.id; if (payload.title === alias.before) payload.title = alias.after; }
        payload.revision = revisions.get(payload.id) ?? payload.revision;
        let result;
        try { result = await store.save(payload); }
        catch (error) {
          if (error.name !== 'ConflictError') throw error;
          result = await store.create({...payload,title:`${payload.title.slice(0,90)} — copie de sécurité`});
          aliases.set(originalId,{id:result.id,before:payload.title,after:result.title});
          if (active.id === originalId) { active = {...active,id:result.id,title:result.title}; titleFields(); }
          hooks.toast('Un autre onglet a modifié ce script. Votre travail est conservé dans une copie.');
        }
        revisions.set(result.id,result.revision);
        if (active.id === result.id) { active.revision = result.revision; active.updatedAt = result.updatedAt; }
        if (!offline) {
          L.acknowledge({...result,id:originalId},owner,at);
          $('[data-library-warning]').hidden = true;
          documents = await store.all(); renderLibrary();
        }
        return {saved:!offline,journaled};
      });
      queue = operation.catch(() => {});
      if (changed && !offline) {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => { checkpoint('Version automatique').catch(() => {}); },2200);
      }
      return operation;
    }
    async function checkpoint(label) {
      if (offline) return;
      await hooks.flush(); await queue; await store.checkpoint(active.id,label);
    }
    async function beforeSwitch() { clearTimeout(autoTimer); hooks.pause(); await hooks.flush(); await queue; if (!offline) await store.checkpoint(active.id,'Version automatique'); }
    function load(doc,tab = 'script') {
      active = doc; revisions.set(doc.id,doc.revision); L.selectActive(doc.id); titleFields(); hooks.load(doc); renderLibrary(); hooks.tab(tab);
    }
    async function newScript(source = {}) {
      await beforeSwitch(); const doc = await store.create({text:'',title:'Nouveau script',...source});
      $('[data-library-search]').value = ''; $('[data-library-collection]').value = ''; archivedView = false;
      documents = await store.all(); load(doc);
      $('[data-script-title]').focus(); $('[data-script-title]').select();
    }
    async function openScript(id) {
      await beforeSwitch(); let doc = await store.get(id); if (!doc) return;
      if (doc.archived) doc = await store.save({...doc,archived:false});
      documents = await store.all(); load(doc);
    }
    async function archiveActive() {
      await beforeSwitch();
      const result = await store.save({...active,revision:revisions.get(active.id),archived:true}); revisions.set(result.id,result.revision);
      documents = await store.all(); const next = L.filterScripts(documents)[0] || await store.create({text:'',title:'Nouveau script'});
      documents = await store.all(); load(next,'library'); hooks.toast('Script archivé. Vous pouvez le retrouver dans Archives.');
    }
    function selectVersion(version) {
      selectedVersion = version; $('[data-version-preview]').value = version.text;
      $('[data-version-info]').textContent = `${version.title} · ${words(version.text)} mots · ${date(version.createdAt,true)}`;
      $('[data-version-restore]').disabled = L.sameContent(active,version);
      for (const button of document.querySelectorAll('[data-version-id]')) button.setAttribute('aria-pressed',String(button.dataset.versionId === version.id));
    }
    async function renderHistory() {
      versions = await store.history(active.id); const list = $('[data-history-list]'); list.replaceChildren();
      $('[data-history-title]').textContent = `Historique — ${active.title}`;
      for (const version of versions) {
        const item = document.createElement('li'), button = document.createElement('button'), label = document.createElement('strong'), stamp = document.createElement('span');
        button.type = 'button'; button.dataset.versionId = version.id; button.setAttribute('aria-pressed','false');
        label.textContent = version.label; stamp.textContent = date(version.createdAt,true); button.append(label,stamp); item.append(button); list.append(item);
      }
      $('[data-history-empty]').hidden = versions.length > 0;
      $('[data-version-preview]').value = ''; $('[data-version-info]').textContent = ''; $('[data-version-restore]').disabled = true; selectedVersion = null;
      if (versions[0]) selectVersion(versions[0]);
    }
    async function showHistory() {
      hooks.pause(); await checkpoint('Version automatique'); await renderHistory(); $('[data-history-dialog]').showModal();
    }
    async function restoreVersion() {
      if (!selectedVersion) return;
      await checkpoint('Avant restauration');
      const version = selectedVersion, saved = await store.get(active.id);
      const doc = await store.save({...saved,title:version.title,collection:version.collection,text:version.text,reading:{offset:0,fraction:.5,pin:'start'},elapsed:0,production:window.PhilosophalPromptTakes.rebase(saved.production,saved.text,version.text)});
      await store.checkpoint(doc.id,'Version restaurée'); documents = await store.all(); load(doc); $('[data-history-dialog]').close();
      hooks.toast('Version restaurée. Le texte précédent reste dans l’historique.');
    }
    async function importFiles(files) {
      const entries = []; let bytes = 0;
      for (const file of files) {
        bytes += file.size; if (bytes > 104857600) throw new Error('Choisissez au plus 100 Mo de fichiers par import.');
        const value = (await file.text()).replace(/^\uFEFF/,'');
        if (/\.json$/i.test(file.name)) {
          let parsed; try { parsed = JSON.parse(value); } catch { throw new Error('Ce fichier JSON n’est pas lisible. Aucun script n’a été importé.'); }
          entries.push(...L.decodeArchive(parsed));
        } else {
          if (!/\.(?:txt|md)$/i.test(file.name)) throw new Error('Choisissez des fichiers .txt, .md ou une bibliothèque .json.');
          entries.push({document:L.normalize({text:value,title:file.name.replace(/\.(?:txt|md)$/i,'')}),versions:[]});
        }
      }
      if (entries.length > 5000) throw new Error('Importez au plus 5 000 scripts à la fois.');
      await beforeSwitch(); const result = await store.importEntries(entries); documents = await store.all();
      $('[data-library-search]').value = ''; $('[data-library-collection]').value = ''; archivedView = false;
      if (result.documents[0]) load(result.documents[0]); else { const updated = await store.get(active.id); if (updated) load(updated,'library'); else { renderLibrary(); hooks.tab('library'); } }
      hooks.toast(`${result.documents.length} script${result.documents.length > 1 ? 's' : ''} ajouté${result.documents.length > 1 ? 's' : ''}${result.skipped ? ` · ${result.skipped} déjà présent${result.skipped > 1 ? 's' : ''}` : ''}${result.merged ? ' · historique complété' : ''}${result.updated ? ' · journal de prises complété' : ''}.`);
    }
    for (const button of document.querySelectorAll('[data-new-script]')) button.addEventListener('click',() => run(() => newScript()));
    $('[data-duplicate-script]').addEventListener('click',() => run(async () => {
      await beforeSwitch(); const doc = await store.create({text:active.text,title:`${active.title.slice(0,105)} — copie`,collection:active.collection});
      $('[data-library-search]').value = ''; $('[data-library-collection]').value = ''; archivedView = false;
      await store.checkpoint(doc.id,'Copie du script'); documents = await store.all(); load(doc); hooks.toast('Copie créée. Le script d’origine est conservé.');
    }));
    $('[data-archive-script]').addEventListener('click',() => run(archiveActive));
    $('[data-library-list]').addEventListener('click',event => { const button = event.target.closest('[data-open-script]'); if (button) run(() => openScript(button.dataset.openScript)); });
    for (const selector of ['[data-script-title]','[data-script-collection]']) $(selector).addEventListener('input',() => hooks.scheduleSave());
    for (const selector of ['[data-library-search]','[data-library-collection]','[data-library-sort]']) $(selector).addEventListener('input',renderLibrary);
    $('[data-archive-view]').addEventListener('click',() => { archivedView = true; renderLibrary(); });
    $('[data-active-view]').addEventListener('click',() => { archivedView = false; renderLibrary(); });
    $('[data-history]').addEventListener('click',() => run(showHistory));
    $('[data-history-close]').addEventListener('click',() => $('[data-history-dialog]').close());
    $('[data-history-list]').addEventListener('click',event => { const button = event.target.closest('[data-version-id]'); const version = versions.find(v => v.id === button?.dataset.versionId); if (version) selectVersion(version); });
    $('[data-version-save]').addEventListener('click',() => run(async () => { await checkpoint('Version conservée'); await renderHistory(); hooks.toast('Version conservée.'); }));
    $('[data-version-restore]').addEventListener('click',() => run(restoreVersion));
    for (const button of document.querySelectorAll('[data-import]')) button.addEventListener('click',() => $('[data-script-file]').click());
    $('[data-script-file]').addEventListener('change',event => {
      const files = [...event.target.files]; event.target.value = ''; if (files.length) run(() => importFiles(files));
    });
    $('[data-download]').addEventListener('click',() => download(hooks.capture().text,'text/plain;charset=utf-8',slug(active.title) + '.txt'));
    $('[data-library-export]').addEventListener('click',() => run(async () => {
      await beforeSwitch(); const archive = await store.export();
      download(JSON.stringify(archive,null,2),'application/json;charset=utf-8',`philosophal-scripts-${new Date().toISOString().slice(0,10)}.json`);
      hooks.toast('Bibliothèque exportée avec les scripts, les archives, les versions et les prises.');
    }));
    titleFields(); renderLibrary(); setBusy(false);
    if (state.migrated) hooks.toast('Votre script et vos réglages ont été repris dans la bibliothèque.');
    else if (state.recovered) hooks.toast('Votre dernier brouillon a été récupéré.');
    return {get current(){return active;},prefs:state.prefs,save:queueSave,isBusy:() => busy,offline,
      filename:() => slug(active.title) + '.txt',checkpoint,refreshBusy:() => setBusy(busy),
      error:() => warning('L’enregistrement a échoué. Gardez une copie avec Exporter .txt ou Exporter la bibliothèque.')};
  }
  window.PhilosophalPromptWorkspace = {create};
})();

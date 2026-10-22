/* Bibliothèque locale du téléprompteur : documents et versions, transactions atomiques. */
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhilosophalPromptLibrary = api;
})(typeof globalThis === 'object' ? globalThis : this, () => {
  'use strict';
  const R = typeof module === 'object' && module.exports ? require('./teleprompteur-takes.js') : globalThis.PhilosophalPromptTakes;
  const DB_NAME = 'philosophal-teleprompteur';
  const FORMAT = 'philosophal-teleprompteur', MAX_TEXT = 250000, MAX_VERSIONS = 30;
  const LEGACY = 'philosophal-teleprompteur-v1', PREFS = 'philosophal-teleprompteur-prefs-v3';
  const ACTIVE = 'philosophal-teleprompteur-active-v3', DRAFT = 'philosophal-teleprompteur-draft-v3-';
  const id = () => globalThis.crypto?.randomUUID?.() || `p${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const copy = value => JSON.parse(JSON.stringify(value));
  const plain = value => value && typeof value === 'object' && !Array.isArray(value);
  const fold = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr-FR');
  function normalize(source = {}) {
    if (!plain(source) || typeof source.text !== 'string' || source.text.length > MAX_TEXT) throw new Error('Un script doit contenir au plus 250 000 caractères.');
    const number = (value,min,max) => Math.max(min,Math.min(max,Number(value) || 0));
    const now = Date.now(), reading = plain(source.reading) ? source.reading : {};
    const anchor = {offset:number(reading.offset,0,source.text.length),fraction:number(reading.fraction,-10,10)};
    if (['start','end'].includes(reading.pin)) anchor.pin = reading.pin;
    return {
      id:typeof source.id === 'string' && /^[a-z0-9_-]{1,90}$/i.test(source.id) ? source.id : id(),
      title:typeof source.title === 'string' ? source.title.trim().slice(0,120) || 'Sans titre' : 'Sans titre',
      collection:typeof source.collection === 'string' ? source.collection.trim().slice(0,90) : '',
      text:source.text, archived:source.archived === true,
      createdAt:number(source.createdAt || now,1,now), updatedAt:number(source.updatedAt || now,1,now),
      revision:number(source.revision,0,Number.MAX_SAFE_INTEGER), reading:anchor, elapsed:number(source.elapsed,0,86400),production:R.normalize(source.production,source.text)
    };
  }
  const sameContent = (a,b) => a.title === b.title && a.collection === b.collection && a.text === b.text;
  function filterScripts(documents,{query = '',collection = '',archived = false,sort = 'recent'} = {}) {
    const terms = fold(query.trim()).split(/\s+/).filter(Boolean);
    return documents.filter(doc => doc.archived === archived && (!collection || doc.collection === collection) && terms.every(term => fold(`${doc.title}\n${doc.collection}\n${doc.text}`).includes(term)))
      .sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title,'fr',{numeric:true,sensitivity:'base'}) : b.updatedAt - a.updatedAt || a.title.localeCompare(b.title,'fr'));
  }
  function decodeArchive(value) {
    if (!plain(value) || value.format !== FORMAT || ![3,4].includes(value.version) || !Array.isArray(value.documents) || value.documents.length > 5000) throw new Error('Choisissez une bibliothèque JSON exportée par le téléprompteur V3 ou V4 (5 000 scripts maximum par import).');
    return value.documents.map(source => {
      const document = normalize(source);
      if (source.versions !== undefined && (!Array.isArray(source.versions) || source.versions.length > MAX_VERSIONS)) throw new Error('Chaque script peut contenir au plus 30 versions.');
      const versions = (source.versions || []).map(version => {
        if (!plain(version)) throw new Error('Une version du fichier est invalide.');
        const normalized = normalize({...version,text:version.text,collection:version.collection ?? document.collection});
        return {title:normalized.title,collection:normalized.collection,text:normalized.text,createdAt:normalized.createdAt,label:typeof version.label === 'string' ? version.label.slice(0,80) : 'Version importée'};
      });
      return {document,versions};
    });
  }
  function encodeArchive(documents,versions) {
    return {format:FORMAT,version:4,exportedAt:new Date().toISOString(),documents:documents.map(doc => ({...doc,versions:versions.filter(v => v.scriptId === doc.id).sort((a,b) => b.createdAt - a.createdAt).map(({id,scriptId,...version}) => version)}))};
  }
  const request = action => new Promise((resolve,reject) => { action.onsuccess = () => resolve(action.result); action.onerror = () => reject(action.error); });
  function done(tx) { return new Promise((resolve,reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Enregistrement interrompu.')); }); }
  function storageRead(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
  function selectActive(value) { try { localStorage.setItem(ACTIVE,JSON.stringify(value)); sessionStorage.setItem(ACTIVE,JSON.stringify(value)); } catch {} }
  function journal(doc,owner) { try { const previous = storageRead(DRAFT + doc.id); localStorage.setItem(DRAFT + doc.id,JSON.stringify({doc,owner,at:Math.max(Date.now(),(previous?.at || 0) + 1)})); return true; } catch { return false; } }
  function acknowledge(doc,owner,at) {
    const pending = storageRead(DRAFT + doc.id); if (!pending || pending.owner !== owner) return;
    try {
      if (pending.at === at) localStorage.removeItem(DRAFT + doc.id);
      else { pending.doc.revision = doc.revision; localStorage.setItem(DRAFT + doc.id,JSON.stringify(pending)); }
    } catch {}
  }
  async function open() {
    if (!globalThis.indexedDB) throw new Error('Ce navigateur ne permet pas d’enregistrer la bibliothèque. Exportez votre texte pour le conserver.');
    const opening = indexedDB.open(DB_NAME,1);
    opening.onupgradeneeded = () => {
      const db = opening.result;
      db.createObjectStore('scripts',{keyPath:'id'});
      const versions = db.createObjectStore('versions',{keyPath:'id'}); versions.createIndex('scriptId','scriptId');
      db.createObjectStore('meta',{keyPath:'key'});
    };
    const db = await new Promise((resolve,reject) => {
      opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
      opening.onblocked = () => reject(new Error('Fermez les autres onglets du téléprompteur, puis rechargez cette page.'));
    });
    db.onversionchange = () => db.close();
    async function all(store) { return request(db.transaction(store).objectStore(store).getAll()); }
    async function get(store,key) { return request(db.transaction(store).objectStore(store).get(key)); }
    async function create(source) {
      const doc = normalize({text:'',...source,id:id(),revision:0,createdAt:Date.now(),updatedAt:Date.now()});
      const tx = db.transaction('scripts','readwrite'), complete = done(tx); tx.objectStore('scripts').add(doc); await complete; return doc;
    }
    async function save(source) {
      const doc = normalize(source), tx = db.transaction('scripts','readwrite'), complete = done(tx), store = tx.objectStore('scripts');
      let result = doc, conflict = false;
      const lookup = store.get(doc.id);
      lookup.onsuccess = () => {
        const previous = lookup.result;
        if (previous && previous.revision !== doc.revision && (!sameContent(previous,doc) || previous.archived !== doc.archived || !R.same(R.normalize(previous.production,previous.text),doc.production))) { conflict = true; tx.abort(); return; }
        const changed = !previous || !sameContent(previous,doc) || previous.archived !== doc.archived;
        const productionChanged = !previous || !R.same(R.normalize(previous.production,previous.text),doc.production);
        result = {...doc,revision:(previous?.revision || 0) + (changed || productionChanged ? 1 : 0),updatedAt:changed ? Date.now() : previous.updatedAt};
        store.put(result);
      };
      try { await complete; } catch (error) { if (conflict) { const issue = new Error('Ce script a été modifié dans un autre onglet.'); issue.name = 'ConflictError'; throw issue; } throw error; }
      return result;
    }
    async function history(scriptId) { return (await request(db.transaction('versions').objectStore('versions').index('scriptId').getAll(scriptId))).sort((a,b) => b.createdAt - a.createdAt); }
    async function checkpoint(scriptId,label = 'Version automatique') {
      const tx = db.transaction(['scripts','versions'],'readwrite'), complete = done(tx), scripts = tx.objectStore('scripts'), versions = tx.objectStore('versions');
      let doc, previous; const readDoc = scripts.get(scriptId), readVersions = versions.index('scriptId').getAll(scriptId);
      function write() {
        if (!doc || !previous || !doc.text.trim()) return;
        previous.sort((a,b) => b.createdAt - a.createdAt);
        if (previous[0] && sameContent(previous[0],doc)) {
          if (label === 'Version conservée') versions.put({...previous[0],label});
          return;
        }
        const createdAt = Math.max(Date.now(),(previous[0]?.createdAt || 0) + 1);
        versions.add({id:id(),scriptId,title:doc.title,collection:doc.collection,text:doc.text,createdAt,label});
        for (const old of previous.slice(MAX_VERSIONS - 1)) versions.delete(old.id);
      }
      readDoc.onsuccess = () => { doc = readDoc.result; write(); };
      readVersions.onsuccess = () => { previous = readVersions.result; write(); };
      await complete;
    }
    async function importEntries(entries) {
      // Tout valider avant d'ouvrir la transaction : un fichier invalide n'importe rien.
      const normalized = entries.map(entry => ({document:normalize(entry.document),versions:entry.versions || []}));
      const existing = await all('scripts'), existingVersions = await all('versions');
      const signature = doc => JSON.stringify([doc.title,doc.collection,doc.text]);
      const signatures = new Map(existing.map(doc => [signature(doc),doc]));
      const versionSignature = version => JSON.stringify([version.title,version.collection,version.text,version.createdAt]);
      const documents = [], versions = [], affected = new Set(), updates = new Map(); let skipped = 0, merged = 0;
      for (const entry of normalized) {
        const key = signature(entry.document), found = signatures.get(key);
        const doc = found || {...entry.document,id:id(),revision:0};
        if (found) {
          skipped++;
          const production = R.merge(updates.get(doc.id)?.production || doc.production,entry.document.production,doc.text);
          if (!R.same(R.normalize(doc.production,doc.text),production)) updates.set(doc.id,{...doc,production});
        } else { documents.push(doc); signatures.set(key,doc); }
        const known = new Set([...existingVersions,...versions].filter(v => v.scriptId === doc.id).map(versionSignature));
        for (const source of entry.versions) {
          const key = versionSignature(source); if (known.has(key)) continue; known.add(key);
          versions.push({...source,id:id(),scriptId:doc.id}); affected.add(doc.id); if (found) merged++;
        }
      }
      const tx = db.transaction(['scripts','versions'],'readwrite'), complete = done(tx);
      for (const doc of documents) tx.objectStore('scripts').add(doc);
      for (const update of updates.values()) {
        const scripts = tx.objectStore('scripts'), lookup = scripts.get(update.id);
        lookup.onsuccess = () => {
          const current = lookup.result; if (!current) return;
          try {
            if (!sameContent(current,update)) { tx.abort(); return; }
            const production = R.merge(current.production,update.production,current.text);
            scripts.put({...current,production,revision:current.revision + 1});
          } catch { tx.abort(); }
        };
      }
      for (const version of versions) tx.objectStore('versions').add(version);
      for (const scriptId of affected) {
        const ordered = [...existingVersions,...versions].filter(v => v.scriptId === scriptId).sort((a,b) => b.createdAt - a.createdAt);
        for (const old of ordered.slice(MAX_VERSIONS)) tx.objectStore('versions').delete(old.id);
      }
      await complete; return {documents:await Promise.all(documents.map(doc => get('scripts',doc.id))),skipped,merged,updated:updates.size};
    }
    async function initialize() {
      const legacy = storageRead(LEGACY); let migrated = false, recovered = 0;
      if (!(await get('meta','legacy-migrated'))) {
        let documents = await all('scripts');
        if (plain(legacy) && typeof legacy.text === 'string' && legacy.text.length <= MAX_TEXT) {
          let doc = documents.find(d => d.text === legacy.text);
          if (!doc) doc = await create({text:legacy.text,title:legacy.text.trim().split('\n')[0].slice(0,120) || 'Mon premier script',reading:legacy.reading,elapsed:legacy.elapsed});
          selectActive(doc.id); await checkpoint(doc.id,'Import de la V1 / V2'); migrated = true;
        }
        const tx = db.transaction('meta','readwrite'), complete = done(tx); tx.objectStore('meta').put({key:'legacy-migrated',at:Date.now()}); await complete;
      }
      let keys = []; try { keys = Object.keys(localStorage).filter(key => key.startsWith(DRAFT)); } catch {}
      for (const key of keys) {
        const pending = storageRead(key); if (!plain(pending?.doc)) continue;
        try {
          let doc = normalize(pending.doc), previous = await get('scripts',doc.id);
          if (previous && sameContent(previous,doc) && R.same(R.normalize(previous.production,previous.text),doc.production)) doc.revision = previous.revision;
          try { doc = await save(doc); } catch (error) {
            if (error.name !== 'ConflictError') throw error;
            doc = await create({...doc,title:`${doc.title.slice(0,95)} — récupéré`});
          }
          await checkpoint(doc.id,'Brouillon récupéré'); selectActive(doc.id); recovered++;
          try { localStorage.removeItem(key); } catch {}
        } catch { /* Un brouillon invalide reste en place et ne remplace aucun document. */ }
      }
      let documents = await all('scripts');
      let activeId; try { activeId = JSON.parse(sessionStorage.getItem(ACTIVE) || 'null'); } catch {}
      activeId ||= storageRead(ACTIVE);
      let active = documents.find(doc => doc.id === activeId && !doc.archived) || filterScripts(documents)[0];
      if (!active) { active = await create({text:'',title:'Mon premier script'}); documents.push(active); }
      selectActive(active.id);
      return {active,documents,prefs:storageRead(PREFS) || legacy?.prefs || {},migrated,recovered};
    }
    return {all:() => all('scripts'),get:scriptId => get('scripts',scriptId),create,save,history,checkpoint,importEntries,initialize,
      export:async () => encodeArchive(await all('scripts'),await all('versions')),close:() => db.close()};
  }
  return {open,normalize,filterScripts,decodeArchive,encodeArchive,sameContent,id,copy,storageRead,selectActive,journal,acknowledge,DB_NAME,FORMAT,PREFS,DRAFT,LEGACY,MAX_VERSIONS,MAX_TEXT};
});

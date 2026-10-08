(() => {
  'use strict';
  if (window.PHILOSOPHAL_BACKUP) return;
  const FORMAT = 'philosophal-global-backup';
  const DB_NAMES = ['philosophal-editor-v1', 'philosophal-local-books'];
  const excluded = /(access|private-library|owner-access|vault|password|token|auth|handoff|open-site-search)/i;
  const allowedKey = k => typeof k === 'string' && /^(philosophal[-.]|fv-|fvReader)/.test(k) && !excluded.test(k) && k.length < 250;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const req = r => new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  function base64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768)); return btoa(s); }
  function bytes(value) { const s = atob(value); return Uint8Array.from(s, c => c.charCodeAt(0)); }
  async function encode(v) {
    if (v === undefined) return {$t:'undefined'};
    if (typeof v === 'bigint') return {$t:'bigint', v:String(v)};
    if (v instanceof Blob) return {$t:v instanceof File ? 'file' : 'blob', v:base64(new Uint8Array(await v.arrayBuffer())), mime:v.type, name:v.name || '', modified:v.lastModified || 0};
    if (v instanceof ArrayBuffer) return {$t:'buffer', v:base64(new Uint8Array(v))};
    if (ArrayBuffer.isView(v)) return {$t:'view', name:v.constructor.name, v:base64(new Uint8Array(v.buffer, v.byteOffset, v.byteLength))};
    if (v instanceof Date) return {$t:'date', v:v.toISOString()};
    if (Array.isArray(v)) return {$t:'array', v:await Promise.all(v.map(encode))};
    if (v && typeof v === 'object') return {$t:'object', v:await Promise.all(Object.entries(v).map(async ([k, val]) => [k, await encode(val)]))};
    if (typeof v === 'number' && !Number.isFinite(v)) return {$t:'number', v:String(v)};
    return v;
  }
  function decode(v, depth = 0) {
    if (depth > 100) throw new Error('Structure trop profonde.');
    if (v === null || typeof v !== 'object') return v;
    const next = x => decode(x, depth + 1);
    switch (v.$t) {
      case 'undefined': return undefined;
      case 'bigint': return BigInt(v.v);
      case 'blob': return new Blob([bytes(v.v)], {type:v.mime || ''});
      case 'file': return new File([bytes(v.v)], v.name || 'fichier', {type:v.mime || '', lastModified:v.modified || 0});
      case 'buffer': return bytes(v.v).buffer;
      case 'view': { const constructors = {Uint8Array,Uint8ClampedArray,Int8Array,Uint16Array,Int16Array,Uint32Array,Int32Array,Float32Array,Float64Array,DataView}; const Type = constructors[v.name]; if (!Type) throw new Error('Type binaire inconnu.'); return new Type(bytes(v.v).buffer); }
      case 'date': return new Date(v.v);
      case 'number': return Number(v.v);
      case 'array': if (!Array.isArray(v.v)) throw new Error('Tableau invalide.'); return v.v.map(next);
      case 'object': { const out = {}; if (!Array.isArray(v.v)) throw new Error('Objet invalide.'); for (const [k, value] of v.v) { if (['__proto__','prototype','constructor'].includes(k)) throw new Error('Clé interdite.'); Object.defineProperty(out, k, {value:next(value), enumerable:true, writable:true, configurable:true}); } return out; }
      default: throw new Error('Valeur de sauvegarde inconnue.');
    }
  }
  function readStorage(store) {
    const out = {};
    for (let i = 0; i < store.length; i++) { const key = store.key(i); if (allowedKey(key)) out[key] = store.getItem(key); }
    return out;
  }
  function openExisting(name) {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(name); let missing = false;
      r.onupgradeneeded = () => { missing = true; r.transaction.abort(); };
      r.onerror = () => missing ? resolve(null) : reject(r.error);
      r.onsuccess = () => resolve(r.result);
      r.onblocked = () => reject(new Error('Fermez les autres onglets Philosophal avant de continuer.'));
    });
  }
  async function readDatabase(name) {
    const db = await openExisting(name); if (!db) return null;
    try {
      const stores = [];
      for (const storeName of [...db.objectStoreNames]) {
        const tx = db.transaction(storeName, 'readonly'), store = tx.objectStore(storeName);
        // Les deux requêtes sont ouvertes avant d'attendre, pour conserver la transaction active.
        const keysPromise = req(store.getAllKeys()), valuesPromise = req(store.getAll());
        const schema = {name:storeName,keyPath:store.keyPath,autoIncrement:store.autoIncrement, indexes:[...store.indexNames].map(n => { const x = store.index(n); return {name:n,keyPath:x.keyPath,unique:x.unique,multiEntry:x.multiEntry}; })};
        const [keys, values] = await Promise.all([keysPromise, valuesPromise]);
        const records = await Promise.all(values.map(async (value, i) => ({key:await encode(keys[i]), value:await encode(value)})));
        stores.push({...schema,records});
      }
      return {name:db.name,version:db.version,stores};
    } finally { db.close(); }
  }
  async function snapshot() {
    const databases = [];
    if (window.indexedDB) for (const name of DB_NAMES) { const db = await readDatabase(name); if (db) databases.push(db); }
    return {format:FORMAT,version:1,exportedAt:new Date().toISOString(),local:readStorage(localStorage),session:readStorage(sessionStorage),databases};
  }
  function download(data, suffix = '') {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'application/json'}));
    link.download = `philosophal-sauvegarde${suffix}-${new Date().toISOString().slice(0,10)}.json`;
    link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }
  function validate(data) {
    if (data?.format === 'philosophal-atelier-backup') {
      const local = {}; for (const [k, v] of Object.entries(data.stores || {})) if (allowedKey(k) && typeof v?.raw === 'string') local[k] = v.raw;
      data = {format:FORMAT,version:1,exportedAt:data.exportedAt,local,session:{},databases:[]};
    }
    if (data?.format !== FORMAT || data.version !== 1 || !data.local || !Array.isArray(data.databases)) throw new Error('Choisissez une sauvegarde complète Philosophal ou un ancien export Atelier.');
    for (const part of [data.local, data.session || {}]) {
      if (Array.isArray(part) || typeof part !== 'object') throw new Error('Stockage invalide.');
      for (const [key, val] of Object.entries(part)) if (!allowedKey(key) || typeof val !== 'string') throw new Error('La sauvegarde contient une entrée non autorisée.');
    }
    if (data.databases.length > DB_NAMES.length || new Set(data.databases.map(d => d.name)).size !== data.databases.length) throw new Error('Bases de données invalides.');
    for (const db of data.databases) {
      if (!DB_NAMES.includes(db.name) || !Number.isInteger(db.version) || db.version < 1 || db.version > 50 || !Array.isArray(db.stores)) throw new Error('Base de données non reconnue.');
      const expected = db.name === 'philosophal-editor-v1' ? 'documents' : 'books';
      if (db.stores.length !== 1 || db.stores[0].name !== expected) throw new Error('Organisation de la base non reconnue.');
      for (const store of db.stores) {
        if (store.keyPath !== 'id' || !Array.isArray(store.records) || !Array.isArray(store.indexes)) throw new Error('Structure de documents invalide.');
        for (const x of store.indexes) if (!/^[\w-]{1,80}$/.test(x.name) || typeof x.keyPath !== 'string') throw new Error('Index invalide.');
        for (const record of store.records) { const key = decode(record.key), value = decode(record.value); if (typeof key !== 'string' || !value || value.id !== key) throw new Error('Document invalide.'); }
      }
    }
    return data;
  }
  async function restoreDatabase(saved, keepExisting) {
    const records = saved.stores.map(s => ({...s,records:s.records.map(r => ({key:decode(r.key),value:decode(r.value)}))}));
    const old = await openExisting(saved.name); const version = old ? Math.max(old.version, saved.version) : saved.version; old?.close();
    const db = await new Promise((resolve, reject) => {
      const r = indexedDB.open(saved.name, version);
      r.onupgradeneeded = () => { for (const s of records) if (!r.result.objectStoreNames.contains(s.name)) { const store = r.result.createObjectStore(s.name, {keyPath:s.keyPath,autoIncrement:s.autoIncrement}); for (const x of s.indexes) store.createIndex(x.name,x.keyPath,{unique:x.unique,multiEntry:x.multiEntry}); } };
      r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); r.onblocked = () => reject(new Error('Fermez les autres onglets qui utilisent les documents ou les livres.'));
    });
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(records.map(s => s.name), 'readwrite');
        tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Restauration interrompue.'));
        for (const s of records) {
          const store = tx.objectStore(s.name);
          for (const record of s.records) {
            if (!keepExisting) store.put(record.value);
            else { const r = store.getKey(record.key); r.onsuccess = () => { if (r.result === undefined) store.put(record.value); }; }
          }
        }
      });
    } finally { db.close(); }
  }
  async function restore(data, keepExisting = true) {
    const valid = validate(data);
    // Une copie de récupération est créée avant toute écriture.
    download(await snapshot(), '-avant-restauration');
    for (const db of valid.databases) await restoreDatabase(db, keepExisting);
    const writes = [];
    try {
      for (const [storage, part] of [[localStorage, valid.local], [sessionStorage, valid.session || {}]]) for (const [key, value] of Object.entries(part)) {
        const old = storage.getItem(key); if (keepExisting && old !== null) continue;
        writes.push({storage,key,old}); storage.setItem(key,value);
      }
    } catch (error) {
      for (const {storage,key,old} of writes.reverse()) { try { old === null ? storage.removeItem(key) : storage.setItem(key,old); } catch {} }
      throw new Error('Le stockage de cet appareil est insuffisant. Une sauvegarde de récupération a été téléchargée.');
    }
  }
  window.PHILOSOPHAL_BACKUP = Object.freeze({snapshot,validate,restore,exportAll:async () => download(await snapshot())});
  let pending = null;
  const statusNode = () => document.querySelector('[data-global-backup-status]') || document.querySelector('[data-restore-preview]');
  const status = msg => { const node = statusNode(); if (node) { node.hidden = false; node.textContent = msg; } };
  const previewNode = () => document.querySelector('[data-global-backup-preview]') || document.querySelector('[data-restore-preview]');
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-global-backup-export], [data-export-backup]');
    if (button) {
      event.preventDefault(); event.stopImmediatePropagation(); button.disabled = true; status('Préparation des documents, livres et données…');
      try { await window.PHILOSOPHAL_BACKUP.exportAll(); status('Sauvegarde complète téléchargée.'); } catch (error) { status(`Sauvegarde impossible : ${error.message}`); } finally { button.disabled = false; }
      return;
    }
    const restoreButton = event.target.closest('[data-global-backup-confirm]');
    if (restoreButton && pending) {
      event.preventDefault(); event.stopImmediatePropagation(); restoreButton.disabled = true;
      const box = previewNode(), keep = box.querySelector('[data-backup-keep]').checked;
      try { await restore(pending, keep); status('Restauration terminée. Rechargez les outils pour retrouver les données.'); box.hidden = true; pending = null; } catch (error) { status(`Restauration incomplète : ${error.message}`); } finally { restoreButton.disabled = false; }
    }
  }, true);
  document.addEventListener('change', async event => {
    const input = event.target.closest('[data-global-backup-import], [data-import-backup]');
    if (!input) return;
    event.stopImmediatePropagation(); const file = input.files?.[0]; if (!file) return;
    pending = null;
    try {
      if (file.size > 250 * 1024 * 1024) throw new Error('Cette sauvegarde dépasse 250 Mo.');
      pending = validate(JSON.parse(await file.text()));
      const count = pending.databases.reduce((sum, d) => sum + d.stores.reduce((s, st) => s + st.records.length, 0), 0);
      const box = previewNode(); box.hidden = false; box.classList.add('backup-preview');
      box.innerHTML = `<strong>Sauvegarde du ${esc(new Date(pending.exportedAt || Date.now()).toLocaleString('fr-FR'))}</strong><p>${Object.keys(pending.local).length} entrées locales · ${count} document(s) ou livre(s).</p><label><input type="checkbox" data-backup-keep checked> Conserver les données déjà présentes en cas de conflit</label><p>Les données absentes de la sauvegarde sont conservées. Une copie de récupération sera téléchargée avant la restauration.</p><button data-global-backup-confirm>Restaurer cette sauvegarde</button>`;
    } catch (error) { status(`Import impossible : ${error.message}`); }
  }, true);
})();


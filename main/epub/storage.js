(() => {
  "use strict";

  const DB_NAME = "philosophal-local-books";
  const DB_VERSION = 1;
  const STORE = "books";
  const SUPPORTED_EXTENSIONS = ["epub", "txt", "text", "html", "htm", "xhtml", "md", "markdown", "fb2"];

  function extensionOf(name = "") {
    const part = String(name).toLowerCase().split(".").pop();
    return part === String(name).toLowerCase() ? "" : part;
  }

  function formatOf(file) {
    const ext = extensionOf(file?.name || "");
    if (ext === "text") return "txt";
    if (ext === "htm" || ext === "xhtml") return "html";
    if (ext === "markdown") return "md";
    return ext;
  }

  function isSupported(file) {
    if (!file || typeof file.name !== "string") return false;
    const ext = extensionOf(file.name);
    if (ext === "pdf") return false;
    return SUPPORTED_EXTENSIONS.includes(ext);
  }

  function hashString(value) {
    let hash = 2166136261;
    const str = String(value);
    for (let i = 0; i < str.length; i += 1) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function idForFile(file) {
    const stamp = [file.name, file.size, file.lastModified || 0].join("|");
    return `book-${hashString(stamp)}`;
  }

  function titleFromName(name = "") {
    return String(name)
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Livre sans titre";
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB indisponible dans ce navigateur."));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("lastOpenedAt", "lastOpenedAt");
          store.createIndex("importedAt", "importedAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Impossible d’ouvrir la bibliothèque locale."));
    });
  }

  async function transaction(mode, run) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      let result;
      try { result = run(store); } catch (error) { db.close(); reject(error); return; }
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error("Erreur de stockage local.")); };
      tx.onabort = () => { db.close(); reject(tx.error || new Error("Opération interrompue.")); };
    });
  }

  async function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Erreur de lecture locale."));
    });
  }

  async function saveFile(file) {
    if (!isSupported(file)) {
      throw new Error("Format non pris en charge. Utilisez EPUB, TXT, HTML, Markdown ou FB2.");
    }

    const id = idForFile(file);
    const existing = await getBook(id).catch(() => null);
    const now = Date.now();
    const record = {
      id,
      name: file.name,
      title: existing?.title || titleFromName(file.name),
      author: existing?.author || "",
      language: existing?.language || "",
      format: formatOf(file),
      size: file.size,
      lastModified: file.lastModified || 0,
      importedAt: existing?.importedAt || now,
      lastOpenedAt: now,
      cover: existing?.cover || null,
      blob: file instanceof Blob ? file : new Blob([file]),
      metadataReady: existing?.metadataReady || false
    };

    await transaction("readwrite", (store) => store.put(record));
    try {
      if (navigator.storage?.persist) await navigator.storage.persist();
    } catch (_) {}
    return record;
  }

  async function getBook(id) {
    const db = await openDb();
    try {
      const tx = db.transaction(STORE, "readonly");
      return await requestResult(tx.objectStore(STORE).get(id));
    } finally {
      db.close();
    }
  }

  async function listBooks() {
    const db = await openDb();
    try {
      const tx = db.transaction(STORE, "readonly");
      const items = await requestResult(tx.objectStore(STORE).getAll());
      return (items || []).sort((a, b) => (b.lastOpenedAt || b.importedAt || 0) - (a.lastOpenedAt || a.importedAt || 0));
    } finally {
      db.close();
    }
  }

  async function updateBook(id, patch = {}) {
    const book = await getBook(id);
    if (!book) return null;
    const next = { ...book, ...patch, id: book.id };
    await transaction("readwrite", (store) => store.put(next));
    return next;
  }

  async function deleteBook(id) {
    await transaction("readwrite", (store) => store.delete(id));
  }

  async function storageEstimate() {
    try {
      if (!navigator.storage?.estimate) return null;
      return await navigator.storage.estimate();
    } catch (_) {
      return null;
    }
  }

  window.PhilosophalBooks = {
    supportedExtensions: [...SUPPORTED_EXTENSIONS],
    extensionOf,
    formatOf,
    isSupported,
    idForFile,
    titleFromName,
    saveFile,
    getBook,
    listBooks,
    updateBook,
    deleteBook,
    storageEstimate
  };
})();

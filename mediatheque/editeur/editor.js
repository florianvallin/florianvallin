(() => {
  "use strict";

  const APP_VERSION = "20260928-editor4";
  const DB_NAME = "philosophal-editor-v1";
  const STORE_NAME = "documents";
  const ACTIVE_KEY = "philosophal-editor-active-v1";
  const FALLBACK_KEY = "philosophal-editor-documents-v1";
  const DATA = window.FV_MEDIATHEQUE_DATA || { resources: [] };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const app = $("[data-editor-app]");
  const editor = $("[data-editor]");
  const titleInput = $("[data-document-title]");
  const documentList = $("[data-document-list]");
  const libraryEmpty = $("[data-library-empty]");
  const documentSearch = $("[data-document-search]");
  const fileInput = $("[data-file-input]");
  const saveState = $("[data-save-state]");
  const wordCount = $("[data-word-count]");
  const charCount = $("[data-char-count]");
  const lastSave = $("[data-last-save]");
  const sourcePill = $("[data-source-pill]");
  const exportPopover = $("[data-export-popover]");
  const exportTrigger = $("[data-export-trigger]");
  const formatBlock = $("[data-format-block]");
  const fontFamily = $("[data-font-family]");
  const textColor = $("[data-text-color]");
  const highlightColor = $("[data-highlight-color]");
  const textColorPreview = $("[data-text-color-preview]");
  const highlightColorPreview = $("[data-highlight-color-preview]");
  const privateGate = $("[data-private-gate]");
  const privateForm = $("[data-private-form]");
  const privatePassword = $("[data-private-password]");
  const privateError = $("[data-private-error]");
  const toastEl = $("[data-toast]");

  const state = {
    documents: [],
    activeId: "",
    current: null,
    saveTimer: 0,
    savedRange: null,
    initialized: false,
    importingCourse: false,
    database: null,
    storageMode: "indexeddb"
  };

  const nowIso = () => new Date().toISOString();
  const uid = () => `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const slug = (value = "document") => String(value || "document")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "document";

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toastEl.hidden = true; }, 2600);
  }

  function formatDate(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "";
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();
    return sameDay
      ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: date.getFullYear() === today.getFullYear() ? undefined : "numeric" });
  }

  function setSaveState(kind, label) {
    saveState.classList.toggle("is-saving", kind === "saving");
    saveState.classList.toggle("is-saved", kind === "saved");
    saveState.textContent = label;
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("indexeddb unavailable"));
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("indexeddb error"));
    });
  }

  function fallbackRead() {
    try {
      const value = JSON.parse(localStorage.getItem(FALLBACK_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }

  function fallbackWrite(list) {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(list));
  }

  async function storageInit() {
    try {
      state.database = await openDb();
      state.storageMode = "indexeddb";
    } catch (_) {
      state.database = null;
      state.storageMode = "localstorage";
    }
  }

  function dbRequest(mode, handler) {
    return new Promise((resolve, reject) => {
      const tx = state.database.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const request = handler(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAllDocuments() {
    if (state.storageMode === "localstorage") return fallbackRead();
    return dbRequest("readonly", store => store.getAll());
  }

  async function putDocument(doc) {
    if (state.storageMode === "localstorage") {
      const list = fallbackRead().filter(item => item.id !== doc.id);
      list.push(doc);
      fallbackWrite(list);
      return doc;
    }
    await dbRequest("readwrite", store => store.put(doc));
    return doc;
  }

  async function deleteDocumentFromStorage(id) {
    if (state.storageMode === "localstorage") {
      fallbackWrite(fallbackRead().filter(item => item.id !== id));
      return;
    }
    await dbRequest("readwrite", store => store.delete(id));
  }

  function normalizeDoc(doc = {}) {
    return {
      id: String(doc.id || uid()),
      title: String(doc.title || "Sans titre"),
      html: String(doc.html || ""),
      createdAt: doc.createdAt || nowIso(),
      updatedAt: doc.updatedAt || nowIso(),
      sourceCourseId: doc.sourceCourseId || "",
      sourceCourseTitle: doc.sourceCourseTitle || "",
      sourceContentUrl: doc.sourceContentUrl || "",
      appVersion: APP_VERSION
    };
  }

  function sortDocuments() {
    state.documents.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function renderDocumentList() {
    const query = (documentSearch.value || "").trim().toLowerCase();
    const list = state.documents.filter(doc => !query || doc.title.toLowerCase().includes(query));
    libraryEmpty.hidden = list.length > 0;
    documentList.innerHTML = list.map(doc => `
      <button type="button" class="editor-document-item ${doc.id === state.activeId ? "is-active" : ""}" data-open-document="${esc(doc.id)}">
        <strong>${esc(doc.title || "Sans titre")}</strong>
        <i>${doc.sourceCourseId ? "Cours" : "Note"}</i>
        <small>Modifié ${esc(formatDate(doc.updatedAt))}</small>
      </button>`).join("");
  }

  function updateSourcePill(doc) {
    if (!doc?.sourceCourseId) {
      sourcePill.hidden = true;
      sourcePill.textContent = "";
      return;
    }
    sourcePill.hidden = false;
    sourcePill.textContent = `Copie de travail · ${doc.sourceCourseTitle || "Cours écrit"}`;
    sourcePill.title = "Cette copie est enregistrée dans ce navigateur. L’export .md permet de la remettre ensuite dans tes cours du site.";
  }

  function updateCounts() {
    const text = (editor.innerText || "").replace(/\u00a0/g, " ").trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    wordCount.textContent = `${words} mot${words > 1 ? "s" : ""}`;
    charCount.textContent = `${chars} caractère${chars > 1 ? "s" : ""}`;
  }

  function loadDocument(doc) {
    if (!doc) return;
    clearTimeout(state.saveTimer);
    state.current = normalizeDoc(doc);
    state.activeId = state.current.id;
    try { localStorage.setItem(ACTIVE_KEY, state.activeId); } catch (_) {}
    titleInput.value = state.current.title;
    editor.innerHTML = state.current.html || "";
    updateSourcePill(state.current);
    updateCounts();
    lastSave.textContent = `Enregistré ${formatDate(state.current.updatedAt)}`;
    setSaveState("saved", "Enregistré");
    renderDocumentList();
    editor.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent("philosophal:documentloaded", { detail: { id: state.current.id } }));
  }

  async function createDocument(options = {}) {
    await flushSave();
    const doc = normalizeDoc({
      id: uid(),
      title: options.title || "Sans titre",
      html: options.html || "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      sourceCourseId: options.sourceCourseId || "",
      sourceCourseTitle: options.sourceCourseTitle || "",
      sourceContentUrl: options.sourceContentUrl || ""
    });
    await putDocument(doc);
    state.documents.push(doc);
    sortDocuments();
    loadDocument(doc);
    closeLibrary();
    if (options.selectTitle !== false) {
      requestAnimationFrame(() => { titleInput.focus(); titleInput.select(); });
    }
    return doc;
  }

  async function flushSave() {
    clearTimeout(state.saveTimer);
    if (!state.current) return;
    const current = state.current;
    const newTitle = (titleInput.value || "").trim() || "Sans titre";
    const newHtml = editor.innerHTML;
    if (current.title === newTitle && current.html === newHtml && !current._dirty) return;
    setSaveState("saving", "Enregistrement…");
    current.title = newTitle;
    current.html = newHtml;
    current.updatedAt = nowIso();
    current._dirty = false;
    const persisted = { ...current };
    delete persisted._dirty;
    await putDocument(persisted);
    const index = state.documents.findIndex(item => item.id === current.id);
    if (index >= 0) state.documents[index] = { ...persisted };
    sortDocuments();
    renderDocumentList();
    lastSave.textContent = `Enregistré ${formatDate(current.updatedAt)}`;
    setSaveState("saved", "Enregistré");
    window.dispatchEvent(new CustomEvent("philosophal:documentsaved", { detail: { id: current.id, updatedAt: current.updatedAt } }));
  }

  function scheduleSave() {
    if (!state.current) return;
    state.current._dirty = true;
    setSaveState("saving", "Modifications…");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => flushSave().catch(() => setSaveState("", "Erreur d’enregistrement")), 550);
  }

  function openLibrary() {
    document.body.classList.add("editor-library-open");
    $("[data-open-library]")?.setAttribute("aria-expanded", "true");
    $("[data-library-backdrop]").hidden = false;
  }

  function closeLibrary() {
    document.body.classList.remove("editor-library-open");
    $("[data-open-library]")?.setAttribute("aria-expanded", "false");
    $("[data-library-backdrop]").hidden = true;
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount < 1) return;
    const range = sel.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) state.savedRange = range.cloneRange();
  }

  function restoreSelection() {
    if (!state.savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(state.savedRange);
  }

  function exec(command, value = null) {
    editor.focus();
    restoreSelection();
    try { document.execCommand(command, false, value); } catch (_) {}
    saveSelection();
    scheduleSave();
    updateCounts();
    updateToolbarState();
  }

  function updateToolbarState() {
    for (const command of ["bold","italic","underline","strikeThrough","insertUnorderedList","insertOrderedList","justifyLeft","justifyCenter","justifyRight","justifyFull"]) {
      const button = document.querySelector(`[data-command="${command}"]`);
      if (!button) continue;
      let active = false;
      try { active = document.queryCommandState(command); } catch (_) {}
      button.classList.toggle("is-active", Boolean(active));
    }
    try {
      const value = String(document.queryCommandValue("formatBlock") || "p").replace(/[<>]/g, "").toLowerCase();
      if (["p","h1","h2","h3","blockquote"].includes(value)) formatBlock.value = value;
    } catch (_) {}
    if (fontFamily) {
      try {
        const raw = String(document.queryCommandValue("fontName") || "").replace(/["']/g, "").trim().toLowerCase();
        const option = [...fontFamily.options].find(item => item.value && item.value.toLowerCase() === raw);
        fontFamily.value = option?.value || "";
      } catch (_) { fontFamily.value = ""; }
    }
  }

  function selectionParentElement() {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return null;
    let node = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
    return node instanceof Element ? node : null;
  }

  function insertLink() {
    saveSelection();
    const parent = selectionParentElement();
    const existing = parent?.closest?.("a");
    const initial = existing?.getAttribute("href") || "https://";
    const url = window.prompt("Adresse du lien :", initial);
    if (!url) return;
    if (existing) {
      existing.href = url;
      existing.target = "_blank";
      existing.rel = "noopener noreferrer";
      scheduleSave();
      return;
    }
    exec("createLink", url);
    const link = selectionParentElement()?.closest?.("a");
    if (link) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
  }

  function insertTable() {
    saveSelection();
    const rows = Math.min(12, Math.max(1, Number(window.prompt("Nombre de lignes :", "3")) || 0));
    if (!rows) return;
    const cols = Math.min(8, Math.max(1, Number(window.prompt("Nombre de colonnes :", "3")) || 0));
    if (!cols) return;
    const head = `<thead><tr>${Array.from({length: cols}, (_, i) => `<th>Colonne ${i + 1}</th>`).join("")}</tr></thead>`;
    const body = `<tbody>${Array.from({length: Math.max(0, rows - 1)}, () => `<tr>${Array.from({length: cols}, () => "<td><br></td>").join("")}</tr>`).join("")}</tbody>`;
    exec("insertHTML", `<table>${head}${body}</table><p><br></p>`);
  }

  function insertTextAtSelection(text) {
    editor.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    saveSelection();
    scheduleSave();
    updateCounts();
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function exportHtml() {
    const title = state.current?.title || "Document";
    const html = `<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{max-width:820px;margin:50px auto;padding:0 32px;color:#29262d;font:16px/1.7 Georgia,serif}h1,h2,h3{font-family:Arial,sans-serif;line-height:1.25}blockquote{border-left:3px solid #b6aac5;margin:1em 0;padding-left:18px;color:#625b69}img{max-width:100%}</style></head><body><h1>${esc(title)}</h1>${editor.innerHTML}</body></html>`;
    downloadBlob(`${slug(title)}.html`, new Blob([html], { type: "text/html;charset=utf-8" }));
  }

  function nearestNamedHighlight(hex) {
    const palette = {
      yellow: "#fff2a8", green: "#ccefcf", blue: "#cfe8ff", pink: "#ffd6e7", red: "#ffd5d5", orange: "#ffe0b8"
    };
    const toRgb = h => {
      const value = h.replace("#", "");
      if (value.length !== 6) return [255,255,255];
      return [0,2,4].map(i => parseInt(value.slice(i, i + 2), 16));
    };
    const rgb = toRgb(hex);
    let best = "yellow", score = Infinity;
    Object.entries(palette).forEach(([name, value]) => {
      const p = toRgb(value);
      const d = p.reduce((sum, v, i) => sum + ((v - rgb[i]) ** 2), 0);
      if (d < score) { score = d; best = name; }
    });
    return best;
  }

  function cssColorToHex(color) {
    if (!color) return "";
    if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return "";
    return `#${[m[1],m[2],m[3]].map(v => Number(v).toString(16).padStart(2,"0")).join("")}`;
  }

  function nodeToMarkdown(node, context = {}) {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node;
    const tag = el.tagName.toLowerCase();
    const children = () => [...el.childNodes].map(child => nodeToMarkdown(child, context)).join("");
    let body = children();
    if (["strong","b"].includes(tag)) return `**${body}**`;
    if (["em","i"].includes(tag)) return `*${body}*`;
    if (tag === "u") return `[[fmt:underline]]${body}[[/fmt]]`;
    if (["s","strike","del"].includes(tag)) return `~~${body}~~`;
    if (tag === "a") return `[${body}](${el.getAttribute("href") || "#"})`;
    if (tag === "br") return "  \n";
    if (tag === "hr") return "\n---\n\n";
    if (["h1","h2","h3"].includes(tag)) return `${"#".repeat(Number(tag[1]))} ${body.trim()}\n\n`;
    if (tag === "blockquote") return body.trim().split("\n").map(line => `> ${line}`).join("\n") + "\n\n";
    if (tag === "li") {
      const marker = context.ordered ? `${context.index || 1}. ` : "- ";
      return `${marker}${body.trim()}\n`;
    }
    if (tag === "ul" || tag === "ol") {
      return [...el.children].map((child, i) => nodeToMarkdown(child, { ordered: tag === "ol", index: i + 1 })).join("") + "\n";
    }
    if (tag === "table") {
      const rows = [...el.querySelectorAll(":scope > thead > tr, :scope > tbody > tr, :scope > tr")];
      if (!rows.length) return "";
      const matrix = rows.map(row => [...row.children].map(cell => (cell.innerText || "").replace(/\|/g, "\\|").trim()));
      const width = Math.max(...matrix.map(row => row.length), 1);
      const normalized = matrix.map(row => [...row, ...Array(Math.max(0, width - row.length)).fill("")]);
      const header = normalized[0];
      const rest = normalized.slice(1);
      return `| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n${rest.map(row => `| ${row.join(" | ")} |`).join("\n")}\n\n`;
    }
    if (tag === "span") {
      if (el.classList.contains("ph-comment-anchor")) return body;
      const style = getComputedStyle(el);
      const bg = cssColorToHex(style.backgroundColor);
      const fg = cssColorToHex(style.color);
      let formats = [];
      if (bg && bg !== "#ffffff" && bg !== "#000000") formats.push(nearestNamedHighlight(bg));
      if (fg) {
        const [r,g,b] = [fg.slice(1,3),fg.slice(3,5),fg.slice(5,7)].map(v => parseInt(v,16));
        if (r > g * 1.25 && r > b * 1.25) formats.push("red-text");
        else if (g > r * 1.15 && g > b * 1.1) formats.push("green-text");
      }
      if (formats.length) body = `[[fmt:${formats.join(",")}]]${body}[[/fmt]]`;
      return body;
    }
    if (["p","div"].includes(tag)) return `${body.trim()}\n\n`;
    return body;
  }

  function exportMarkdown() {
    const title = state.current?.title || "Document";
    let md = nodeToMarkdown(editor).replace(/\n{3,}/g, "\n\n").trim() + "\n";
    if (!/^#\s/.test(md)) md = `# ${title}\n\n${md}`;
    downloadBlob(`${slug(title)}.md`, new Blob([md], { type: "text/markdown;charset=utf-8" }));
    toast("Cours Markdown exporté.");
  }

  function exportBackup() {
    const doc = { ...state.current, html: editor.innerHTML, title: (titleInput.value || "Sans titre").trim() || "Sans titre", exportedAt: nowIso(), format: "philosophal-editor-document", version: 1 };
    downloadBlob(`${slug(doc.title)}.philosophal.json`, new Blob([JSON.stringify(doc, null, 2)], { type: "application/json;charset=utf-8" }));
  }

  function printableHtml() {
    const title = state.current?.title || "Document";
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4;margin:20mm}body{color:#29262d;font:11.5pt/1.6 Georgia,serif}h1,h2,h3{font-family:Arial,sans-serif;line-height:1.25}h1{font-size:24pt}h2{font-size:17pt;margin-top:1.4em}h3{font-size:13pt;margin-top:1.2em}blockquote{border-left:3px solid #aaa;padding-left:12px;color:#555}a{color:inherit}hr{border:0;border-top:1px solid #bbb}</style></head><body><h1>${esc(title)}</h1>${editor.innerHTML}</body></html>`;
  }

  function exportPdf() {
    const win = window.open("", "_blank");
    if (!win) { toast("Le navigateur a bloqué la fenêtre d’impression."); return; }
    win.document.open();
    win.document.write(printableHtml());
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  }

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function u16(value) { return new Uint8Array([value & 255, (value >>> 8) & 255]); }
  function u32(value) { return new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]); }
  function concatBytes(parts) {
    const size = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(size);
    let offset = 0;
    parts.forEach(part => { out.set(part, offset); offset += part.length; });
    return out;
  }

  function makeZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    for (const file of files) {
      const name = encoder.encode(file.name);
      const data = typeof file.data === "string" ? encoder.encode(file.data) : file.data;
      const crc = crc32(data);
      const local = concatBytes([
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name, data
      ]);
      localParts.push(local);
      const central = concatBytes([
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name
      ]);
      centralParts.push(central);
      offset += local.length;
    }
    const locals = concatBytes(localParts);
    const centrals = concatBytes(centralParts);
    const end = concatBytes([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(centrals.length), u32(locals.length), u16(0)]);
    return concatBytes([locals, centrals, end]);
  }

  function xmlEsc(value = "") {
    return String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  }

  function wordRun(text, styles = {}) {
    if (!text) return "";
    const props = [];
    if (styles.bold) props.push("<w:b/>");
    if (styles.italic) props.push("<w:i/>");
    if (styles.underline) props.push('<w:u w:val="single"/>');
    if (styles.strike) props.push("<w:strike/>");
    if (styles.color) props.push(`<w:color w:val="${styles.color.replace("#", "").toUpperCase()}"/>`);
    if (styles.background) props.push(`<w:shd w:val="clear" w:color="auto" w:fill="${styles.background.replace("#", "").toUpperCase()}"/>`);
    if (styles.font) props.push(`<w:rFonts w:ascii="${xmlEsc(styles.font)}" w:hAnsi="${xmlEsc(styles.font)}" w:cs="${xmlEsc(styles.font)}"/>`);
    return `<w:r>${props.length ? `<w:rPr>${props.join("")}</w:rPr>` : ""}<w:t xml:space="preserve">${xmlEsc(text)}</w:t></w:r>`;
  }

  function collectWordRuns(node, inherited = {}) {
    if (node.nodeType === Node.TEXT_NODE) return wordRun(node.nodeValue || "", inherited);
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node;
    const tag = el.tagName.toLowerCase();
    const style = { ...inherited };
    if (["strong","b"].includes(tag)) style.bold = true;
    if (["em","i"].includes(tag)) style.italic = true;
    if (tag === "u") style.underline = true;
    if (["s","strike","del"].includes(tag)) style.strike = true;
    if ((tag === "span" || tag === "font" || el.hasAttribute("style")) && !el.classList.contains("ph-comment-anchor")) {
      const computed = getComputedStyle(el);
      const color = cssColorToHex(computed.color);
      const bg = cssColorToHex(computed.backgroundColor);
      if (color && color !== "#29262d" && color !== "#000000") style.color = color;
      if (bg && bg !== "#ffffff" && bg !== "#000000") style.background = bg;
      const explicitFont = tag === "font" ? (el.getAttribute("face") || computed.fontFamily) : el.style.fontFamily;
      if (explicitFont) style.font = String(explicitFont).split(",")[0].replace(/["']/g, "").trim();
    }
    if (tag === "br") return "<w:r><w:br/></w:r>";
    return [...el.childNodes].map(child => collectWordRuns(child, style)).join("");
  }

  function paragraphToWord(el, options = {}) {
    const tag = el.tagName?.toLowerCase?.() || "p";
    const props = [];
    if (["h1","h2","h3"].includes(tag)) props.push(`<w:pStyle w:val="Heading${tag[1]}"/>`);
    if (tag === "blockquote") props.push('<w:ind w:left="720"/>');
    const align = getComputedStyle(el).textAlign;
    if (["center","right","justify"].includes(align)) props.push(`<w:jc w:val="${align === "justify" ? "both" : align}"/>`);
    const prefix = options.prefix ? wordRun(options.prefix, { bold: false }) : "";
    return `<w:p>${props.length ? `<w:pPr>${props.join("")}</w:pPr>` : ""}${prefix}${collectWordRuns(el)}</w:p>`;
  }

  function htmlToWordBody() {
    const parts = [];
    [...editor.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue?.trim()) parts.push(`<w:p>${wordRun(node.nodeValue)}</w:p>`);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node;
      const tag = el.tagName.toLowerCase();
      if (el.classList?.contains("ph-toc") || el.classList?.contains("ph-private-marker")) return;
      if (tag === "ul" || tag === "ol") {
        [...el.children].forEach((li, index) => parts.push(paragraphToWord(li, { prefix: tag === "ol" ? `${index + 1}. ` : "• " })));
      } else if (tag === "hr") {
        parts.push('<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="B9B1C1"/></w:pBdr></w:pPr></w:p>');
      } else {
        parts.push(paragraphToWord(el));
      }
    });
    return parts.join("");
  }

  function exportDocx() {
    const title = state.current?.title || "Document";
    let settings = { pageSize: "A4", margin: 20, header: "", footer: "", pageNumbers: true, cover: false, toc: false };
    try { settings = { ...settings, ...(JSON.parse(localStorage.getItem("philosophal-editor-export-v3") || "{}") || {}) }; } catch (_) {}
    let docMeta = {};
    try { const allMeta = JSON.parse(localStorage.getItem("philosophal-editor-doc-meta-v3") || "{}") || {}; docMeta = allMeta[state.activeId] || {}; } catch (_) {}
    const page = settings.pageSize === "Letter" ? { w: 12240, h: 15840 } : { w: 11906, h: 16838 };
    const margin = Math.max(8, Math.min(40, Number(settings.margin) || 20));
    const twips = Math.round(margin * 56.6929);
    const titleXml = `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr>${wordRun(title)}</w:p>`;
    const coverXml = settings.cover
      ? `${titleXml}${docMeta.author ? `<w:p>${wordRun(docMeta.author)}</w:p>` : ""}<w:p>${wordRun(new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date()))}</w:p><w:p><w:r><w:br w:type="page"/></w:r></w:p>`
      : titleXml;
    const tocXml = settings.toc
      ? `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>${wordRun("Table des matières")}</w:p><w:p><w:fldSimple w:instr="TOC \\o &quot;1-3&quot; \\h \\z \\u"><w:r><w:t>Mettre à jour la table des matières dans Word si nécessaire.</w:t></w:r></w:fldSimple></w:p><w:p><w:r><w:br w:type="page"/></w:r></w:p>`
      : "";
    const headerRef = settings.header ? '<w:headerReference w:type="default" r:id="rId2"/>' : "";
    const footerRef = (settings.footer || settings.pageNumbers) ? `<w:footerReference w:type="default" r:id="${settings.header ? "rId3" : "rId2"}"/>` : "";
    const sectPr = `<w:sectPr>${headerRef}${footerRef}<w:pgSz w:w="${page.w}" w:h="${page.h}"/><w:pgMar w:top="${twips}" w:right="${twips}" w:bottom="${twips}" w:left="${twips}" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>`;
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${coverXml}${tocXml}${htmlToWordBody()}${sectPr}</w:body></w:document>`;
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="23"/><w:szCs w:val="23"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="40"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="34"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style></w:styles>`;
    let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`;
    if (settings.header) contentTypes += `<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>`;
    if (settings.footer || settings.pageNumbers) contentTypes += `<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`;
    contentTypes += `</Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    let wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;
    let nextRid = 2;
    if (settings.header) wordRels += `<Relationship Id="rId${nextRid++}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>`;
    if (settings.footer || settings.pageNumbers) wordRels += `<Relationship Id="rId${nextRid++}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>`;
    wordRels += `</Relationships>`;
    const files = [
      { name: "[Content_Types].xml", data: contentTypes },
      { name: "_rels/.rels", data: rels },
      { name: "word/document.xml", data: documentXml },
      { name: "word/styles.xml", data: stylesXml },
      { name: "word/_rels/document.xml.rels", data: wordRels }
    ];
    if (settings.header) files.push({ name: "word/header1.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr>${wordRun(settings.header)}</w:p></w:hdr>` });
    if (settings.footer || settings.pageNumbers) {
      const pageField = settings.pageNumbers ? `<w:r><w:t xml:space="preserve">${settings.footer ? " · p. " : "p. "}</w:t></w:r><w:fldSimple w:instr="PAGE"><w:r><w:t>1</w:t></w:r></w:fldSimple>` : "";
      files.push({ name: "word/footer1.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr>${settings.footer ? wordRun(settings.footer) : ""}${pageField}</w:p></w:ftr>` });
    }
    const zip = makeZip(files);
    downloadBlob(`${slug(title)}.docx`, new Blob([zip], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    toast("Document Word exporté.");
  }

  function stripInlineMarkup(text = "") {
    return String(text).replace(/\[\[fmt:[^\]]+\]\]/gi, "").replace(/\[\[\/fmt\]\]/gi, "").replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1");
  }

  function markdownInline(text = "") {
    let out = esc(text);
    const colors = { yellow: "#fff2a8", green: "#ccefcf", blue: "#cfe8ff", pink: "#ffd6e7", red: "#ffd5d5", orange: "#ffe0b8" };
    out = out.replace(/\[\[fmt:([a-z0-9,-]+)\]\]([\s\S]*?)\[\[\/fmt\]\]/gi, (_, raw, body) => {
      const rules = raw.split(",").map(x => x.trim().toLowerCase()).map(name => {
        if (name === "bold") return "font-weight:700";
        if (name === "italic") return "font-style:italic";
        if (name === "underline") return "text-decoration:underline";
        if (name === "red-text") return "color:#a64040";
        if (name === "green-text") return "color:#39724a";
        if (colors[name]) return `background:${colors[name]}`;
        return "";
      }).filter(Boolean).join(";");
      return rules ? `<span style="${rules}">${body}</span>` : body;
    });
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
  }

  function markdownToHtml(md = "") {
    const lines = String(md).replace(/\r/g, "").split("\n");
    const html = [];
    let para = [], list = null, table = null;
    const flushPara = () => { if (para.length) { html.push(`<p>${markdownInline(para.join(" "))}</p>`); para = []; } };
    const flushList = () => { if (list) { html.push(`<${list.type}>${list.items.map(x => `<li>${markdownInline(x)}</li>`).join("")}</${list.type}>`); list = null; } };
    const flushTable = () => {
      if (!table) return;
      const [head, ...rows] = table;
      html.push(`<table><thead><tr>${head.map(c => `<th>${markdownInline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${markdownInline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      table = null;
    };
    const flush = () => { flushPara(); flushList(); flushTable(); };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) { flush(); continue; }
      if (/^\|.*\|$/.test(line)) {
        flushPara(); flushList();
        const cells = line.slice(1, -1).split("|").map(x => x.trim());
        const next = (lines[i + 1] || "").trim();
        if (!table && /^\|\s*:?-+/.test(next)) { table = [cells]; i++; continue; }
        if (table) { table.push(cells); continue; }
      } else if (table) flushTable();
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) { flush(); html.push(`<h${h[1].length}>${markdownInline(h[2])}</h${h[1].length}>`); continue; }
      if (/^>\s?/.test(line)) { flush(); html.push(`<blockquote>${markdownInline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }
      if (/^---+$/.test(line)) { flush(); html.push("<hr>"); continue; }
      let m = line.match(/^[-*]\s+(.+)$/);
      if (m) { flushPara(); flushTable(); if (!list || list.type !== "ul") { flushList(); list = { type: "ul", items: [] }; } list.items.push(m[1]); continue; }
      m = line.match(/^\d+[.)]\s+(.+)$/);
      if (m) { flushPara(); flushTable(); if (!list || list.type !== "ol") { flushList(); list = { type: "ol", items: [] }; } list.items.push(m[1]); continue; }
      para.push(line);
    }
    flush();
    return html.join("\n");
  }

  async function importFile(file) {
    const name = file.name || "Document";
    const lower = name.toLowerCase();
    const text = await file.text();
    let title = name.replace(/\.[^.]+$/, "") || "Document importé";
    let html = "";
    let sourceCourseId = "", sourceCourseTitle = "", sourceContentUrl = "";
    if (lower.endsWith(".json") || lower.endsWith(".phil") || lower.endsWith(".philosophal")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed?.html != null) {
          title = parsed.title || title;
          html = String(parsed.html || "");
          sourceCourseId = parsed.sourceCourseId || "";
          sourceCourseTitle = parsed.sourceCourseTitle || "";
          sourceContentUrl = parsed.sourceContentUrl || "";
        } else throw new Error("invalid backup");
      } catch (_) { toast("Ce fichier de sauvegarde n’est pas reconnu."); return; }
    } else if (lower.endsWith(".html") || lower.endsWith(".htm")) {
      const doc = new DOMParser().parseFromString(text, "text/html");
      html = doc.body?.innerHTML || "";
      title = doc.title || title;
    } else if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
      html = markdownToHtml(text);
      const heading = text.match(/^#\s+(.+)$/m);
      if (heading) title = stripInlineMarkup(heading[1]).trim() || title;
    } else {
      html = text.split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
    }
    await createDocument({ title, html, sourceCourseId, sourceCourseTitle, sourceContentUrl, selectTitle: false });
    toast("Document importé.");
  }

  function resolveUrl(url = "") {
    if (/^https?:/i.test(url)) return url;
    const pathname = location.pathname.replace(/\/index\.html$/i, "/");
    const marker = "/mediatheque/";
    const i = pathname.indexOf(marker);
    const prefix = i > 0 ? pathname.slice(0, i) : "";
    return url.startsWith("/") ? `${prefix}${url}` || url : new URL(url, location.href).href;
  }

  async function importCourseFromQuery() {
    const requested = new URLSearchParams(location.search).get("course");
    if (!requested || state.importingCourse) return false;
    const item = (DATA.resources || []).find(x => x.kind === "cours" && (x.id === requested || String(x.id).split(":").pop() === requested));
    if (!item?.contentUrl) { toast("Cours introuvable."); return false; }
    const already = state.documents.find(doc => doc.sourceCourseId === item.id);
    if (already) {
      loadDocument(already);
      toast("La copie de travail existante a été ouverte.");
      history.replaceState(null, "", location.pathname);
      return true;
    }
    state.importingCourse = true;
    try {
      const response = await fetch(resolveUrl(item.contentUrl), { cache: "no-store" });
      if (!response.ok) throw new Error("fetch");
      const md = await response.text();
      await createDocument({
        title: item.title || "Cours",
        html: markdownToHtml(md),
        sourceCourseId: item.id,
        sourceCourseTitle: item.title || "Cours écrit",
        sourceContentUrl: item.contentUrl,
        selectTitle: false
      });
      toast("Copie du cours créée dans l’éditeur.");
      history.replaceState(null, "", location.pathname);
      return true;
    } catch (_) {
      toast("Impossible de charger ce cours.");
      return false;
    } finally { state.importingCourse = false; }
  }

  async function duplicateCurrent() {
    if (!state.current) return;
    await flushSave();
    await createDocument({
      title: `${state.current.title} — copie`,
      html: state.current.html,
      sourceCourseId: state.current.sourceCourseId,
      sourceCourseTitle: state.current.sourceCourseTitle,
      sourceContentUrl: state.current.sourceContentUrl,
      selectTitle: true
    });
  }

  async function deleteCurrent() {
    if (!state.current) return;
    const title = state.current.title || "ce document";
    if (!window.confirm(`Supprimer « ${title} » de ce navigateur ?`)) return;
    const id = state.current.id;
    await deleteDocumentFromStorage(id);
    state.documents = state.documents.filter(doc => doc.id !== id);
    state.current = null;
    state.activeId = "";
    try { localStorage.removeItem(ACTIVE_KEY); } catch (_) {}
    sortDocuments();
    if (state.documents.length) loadDocument(state.documents[0]);
    else await createDocument({ title: "Sans titre", selectTitle: false });
    toast("Document supprimé.");
  }

  async function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    document.body.classList.remove("editor-locked");
    app.setAttribute("aria-hidden", "false");
    await storageInit();
    state.documents = (await getAllDocuments()).map(normalizeDoc);
    sortDocuments();
    renderDocumentList();

    if (await importCourseFromQuery()) return;

    let activeId = "";
    try { activeId = localStorage.getItem(ACTIVE_KEY) || ""; } catch (_) {}
    const active = state.documents.find(doc => doc.id === activeId) || state.documents[0];
    if (active) loadDocument(active);
    else await createDocument({ title: "Sans titre", selectTitle: false });
  }

  editor.addEventListener("input", () => { scheduleSave(); updateCounts(); });
  editor.addEventListener("keyup", () => { saveSelection(); updateToolbarState(); });
  editor.addEventListener("mouseup", () => { saveSelection(); updateToolbarState(); });
  editor.addEventListener("focus", saveSelection);
  titleInput.addEventListener("input", scheduleSave);
  documentSearch.addEventListener("input", renderDocumentList);

  documentList.addEventListener("click", async event => {
    const button = event.target.closest("[data-open-document]");
    if (!button) return;
    await flushSave();
    const doc = state.documents.find(item => item.id === button.dataset.openDocument);
    if (doc) { loadDocument(doc); closeLibrary(); }
  });

  $("[data-new-document]").addEventListener("click", () => createDocument({ title: "Sans titre" }));
  $("[data-import-document]").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    fileInput.value = "";
    if (file) await importFile(file);
  });
  $("[data-duplicate-document]").addEventListener("click", duplicateCurrent);
  $("[data-delete-document]").addEventListener("click", deleteCurrent);
  $("[data-open-library]").addEventListener("click", openLibrary);
  $("[data-close-library]").addEventListener("click", closeLibrary);
  $("[data-library-backdrop]").addEventListener("click", closeLibrary);

  $$('[data-command]').forEach(button => {
    button.addEventListener("mousedown", event => { event.preventDefault(); saveSelection(); });
    button.addEventListener("click", () => exec(button.dataset.command));
  });

  formatBlock.addEventListener("mousedown", saveSelection);
  formatBlock.addEventListener("change", () => exec("formatBlock", formatBlock.value));
  fontFamily?.addEventListener("mousedown", saveSelection);
  fontFamily?.addEventListener("change", () => {
    if (!fontFamily.value) return;
    exec("fontName", fontFamily.value);
  });
  textColor.addEventListener("mousedown", saveSelection);
  highlightColor.addEventListener("mousedown", saveSelection);
  textColor.addEventListener("input", () => { textColorPreview.style.background = textColor.value; exec("foreColor", textColor.value); });
  highlightColor.addEventListener("input", () => { highlightColorPreview.style.background = highlightColor.value; exec("hiliteColor", highlightColor.value); });
  $("[data-link]").addEventListener("mousedown", saveSelection);
  $("[data-link]").addEventListener("click", insertLink);
  $("[data-insert-table]").addEventListener("mousedown", saveSelection);
  $("[data-insert-table]").addEventListener("click", insertTable);
  $("[data-insert-date]").addEventListener("mousedown", saveSelection);
  $("[data-insert-date]").addEventListener("click", () => insertTextAtSelection(new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())));

  exportTrigger.addEventListener("click", () => {
    exportPopover.hidden = !exportPopover.hidden;
    exportTrigger.setAttribute("aria-expanded", String(!exportPopover.hidden));
  });
  exportPopover.addEventListener("click", async event => {
    const button = event.target.closest("[data-export]");
    if (!button) return;
    await flushSave();
    exportPopover.hidden = true;
    exportTrigger.setAttribute("aria-expanded", "false");
    const kind = button.dataset.export;
    if (kind === "docx") exportDocx();
    if (kind === "pdf") exportPdf();
    if (kind === "html") exportHtml();
    if (kind === "markdown") exportMarkdown();
    if (kind === "backup") exportBackup();
  });

  document.addEventListener("click", event => {
    if (!event.target.closest("[data-export-menu]")) {
      exportPopover.hidden = true;
      exportTrigger.setAttribute("aria-expanded", "false");
    }
  });

  $("[data-focus-mode]").addEventListener("click", event => {
    const active = !document.body.classList.contains("editor-focus");
    document.body.classList.toggle("editor-focus", active);
    event.currentTarget.setAttribute("aria-pressed", String(active));
    event.currentTarget.textContent = active ? "Quitter écriture" : "Mode écriture";
  });

  $("[data-fullscreen]").addEventListener("click", async event => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) { toast("Le plein écran n’est pas disponible ici."); }
    event.currentTarget.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
  });
  document.addEventListener("fullscreenchange", () => {
    const button = $("[data-fullscreen]");
    button.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
  });

  document.addEventListener("keydown", event => {
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "s") { event.preventDefault(); flushSave().then(() => toast("Document enregistré.")); }
    if (mod && event.shiftKey && event.key.toLowerCase() === "s") { event.preventDefault(); exportBackup(); }
    if (event.key === "Escape") {
      closeLibrary();
      exportPopover.hidden = true;
      if (document.body.classList.contains("editor-focus")) {
        document.body.classList.remove("editor-focus");
        const button = $("[data-focus-mode]");
        button.setAttribute("aria-pressed", "false");
        button.textContent = "Mode écriture";
      }
    }
  });

  window.addEventListener("beforeunload", () => {
    if (!state.current) return;
    const title = (titleInput.value || "").trim() || "Sans titre";
    const html = editor.innerHTML;
    if (title !== state.current.title || html !== state.current.html) {
      state.current.title = title;
      state.current.html = html;
      state.current.updatedAt = nowIso();
      if (state.storageMode === "localstorage") {
        try {
          const list = fallbackRead().filter(item => item.id !== state.current.id);
          list.push({ ...state.current, _dirty: undefined });
          fallbackWrite(list);
        } catch (_) {}
      }
    }
  });

  window.PhilosophalEditor = {
    version: APP_VERSION,
    state, editor, titleInput, documentList, documentSearch,
    createDocument, loadDocument, flushSave, scheduleSave, putDocument, getAllDocuments,
    deleteDocumentFromStorage, normalizeDoc, sortDocuments, renderDocumentList,
    exportBackup, exportHtml, exportMarkdown, exportPdf, exportDocx,
    exec, saveSelection, restoreSelection, toast, nowIso, uid, esc, slug
  };

  initialize().catch(() => toast("Impossible d’initialiser l’éditeur."));
})();

(() => {
  "use strict";

  const API = window.PhilosophalEditor;
  if (!API) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const editor = API.editor;
  const titleInput = API.titleInput;
  const paper = $(`[data-paper]`);
  const pageScroll = $(`[data-page-scroll]`);

  const SETTINGS_KEY = "philosophal-editor-doc-settings-v2";
  const TABS_KEY = "philosophal-editor-tabs-v2";
  const THEME_KEY = "philosophal-editor-theme-v2";
  const META_DB = "philosophal-editor-meta-v2";
  const META_VERSION = 1;
  const MAX_VERSIONS = 30;
  const AUTO_VERSION_MS = 5 * 60 * 1000;

  const adv = {
    tabs: [],
    settings: {},
    currentFindIndex: -1,
    findRanges: [],
    slashBlock: null,
    commandIndex: 0,
    commandMatches: [],
    draggedHeading: null,
    metaDb: null,
    metaFallback: false,
    syncing: false
  };

  const esc = API.esc;
  const nowIso = API.nowIso;
  const uid = API.uid;

  const templates = [
    {
      id: "blank", icon: "✎", name: "Document vierge", description: "Une page blanche pour écrire librement.",
      title: "Sans titre", html: "<p><br></p>"
    },
    {
      id: "university", icon: "🎓", name: "Cours universitaire", description: "Plan, notions, auteurs, exemples et synthèse.",
      title: "Nouveau cours", html: `<h1>Titre du cours</h1><div class="ph-block ph-problem"><div class="ph-block-label" contenteditable="false">Problème</div><p>Question directrice du cours…</p></div><h2>I. Première partie</h2><h3>1. Notion / argument</h3><p>Développement…</p><div class="ph-block ph-definition"><div class="ph-block-label" contenteditable="false">Définition</div><p><strong>Notion</strong> — définition.</p></div><h2>II. Deuxième partie</h2><p>Développement…</p><div class="ph-block ph-remember"><div class="ph-block-label" contenteditable="false">À retenir</div><p>Synthèse du cours.</p></div>`
    },
    {
      id: "reading", icon: "📖", name: "Fiche de lecture", description: "Référence, résumé, concepts, citations et analyse.",
      title: "Fiche de lecture", html: `<h1>Titre de l’œuvre</h1><div class="ph-block ph-reference"><div class="ph-block-label" contenteditable="false">Référence</div><p>Auteur, <em>Titre</em>, édition, année.</p></div><h2>Résumé</h2><p>Résumé de l’œuvre…</p><h2>Concepts principaux</h2><ul><li>Concept 1</li><li>Concept 2</li></ul><h2>Citations</h2><blockquote>« Citation importante… »</blockquote><h2>Analyse personnelle</h2><p>Interprétation, liens, objections…</p><div class="ph-block ph-remember"><div class="ph-block-label" contenteditable="false">À retenir</div><p>Idées essentielles.</p></div>`
    },
    {
      id: "author", icon: "👤", name: "Fiche auteur", description: "Contexte, concepts, œuvres, textes et héritage.",
      title: "Fiche auteur", html: `<h1>Nom de l’auteur</h1><h2>Repères</h2><p>Dates, contexte, courant…</p><h2>Concepts essentiels</h2><div class="ph-block ph-definition"><div class="ph-block-label" contenteditable="false">Définition</div><p>Concept — définition.</p></div><h2>Œuvres principales</h2><ul><li>Œuvre 1</li><li>Œuvre 2</li></ul><h2>Texte / citation</h2><blockquote>« Citation… »</blockquote><h2>Liens et postérité</h2><p>Influences, critiques, héritage…</p>`
    },
    {
      id: "terminale", icon: "🏛", name: "Cours de Terminale", description: "Notion, problème, thèses, auteurs et exemples.",
      title: "Cours — Notion", html: `<h1>Notion</h1><div class="ph-block ph-problem"><div class="ph-block-label" contenteditable="false">Problème</div><p>Question philosophique centrale…</p></div><h2>I. Première thèse</h2><div class="ph-block ph-author"><div class="ph-block-label" contenteditable="false">Auteur</div><p><strong>Auteur</strong> — idée principale.</p></div><p>Explication…</p><div class="ph-block ph-example"><div class="ph-block-label" contenteditable="false">Exemple</div><p>Exemple permettant de comprendre l’argument.</p></div><h2>II. Limite / objection</h2><p>Développement…</p><h2>III. Dépassement</h2><p>Développement…</p><div class="ph-block ph-remember"><div class="ph-block-label" contenteditable="false">À retenir</div><p>Synthèse.</p></div>`
    },
    {
      id: "dissertation", icon: "§", name: "Dissertation", description: "Sujet, analyse, problématique et plan en trois parties.",
      title: "Dissertation", html: `<h1>Sujet de dissertation</h1><h2>Analyse du sujet</h2><p>Définition des termes, tensions et présupposés…</p><div class="ph-block ph-problem"><div class="ph-block-label" contenteditable="false">Problématique</div><p>Formulation précise du problème…</p></div><h2>I. Thèse</h2><h3>A. Argument</h3><p>Développement…</p><h3>B. Argument</h3><p>Développement…</p><h2>II. Antithèse / limite</h2><p>Développement…</p><h2>III. Dépassement</h2><p>Développement…</p><h2>Conclusion</h2><p>Réponse synthétique et ouverture mesurée.</p>`
    },
    {
      id: "explanation", icon: "¶", name: "Explication de texte", description: "Thèse, structure, concepts, passages et enjeu.",
      title: "Explication de texte", html: `<h1>Auteur — œuvre / extrait</h1><div class="ph-block ph-problem"><div class="ph-block-label" contenteditable="false">Problème</div><p>Quel problème l’auteur cherche-t-il à résoudre ?</p></div><h2>Thèse du texte</h2><p>La thèse défendue est…</p><h2>Mouvement du texte</h2><ol><li>Premier mouvement</li><li>Deuxième mouvement</li><li>Troisième mouvement</li></ol><h2>Explication détaillée</h2><blockquote>« Passage à expliquer… »</blockquote><p>Analyse conceptuelle…</p><h2>Enjeu philosophique</h2><p>Ce que ce texte permet de comprendre…</p>`
    },
    {
      id: "blog", icon: "✦", name: "Article de blog", description: "Accroche, sections, exemples, ressources et conclusion.",
      title: "Nouvel article", html: `<h1>Titre de l’article</h1><p><strong>Introduction.</strong> Une entrée courte qui présente la question et l’intérêt pratique.</p><h2>1. Première idée</h2><p>Développement…</p><div class="ph-block ph-example"><div class="ph-block-label" contenteditable="false">Exemple</div><p>Exemple concret.</p></div><h2>2. Deuxième idée</h2><p>Développement…</p><h2>Pour aller plus loin</h2><ul><li>Ressource 1</li><li>Ressource 2</li></ul><h2>Conclusion</h2><p>Résumé et ouverture.</p>`
    },
    {
      id: "quick", icon: "⚡", name: "Notes rapides", description: "Date, idées, tâches et questions en vrac.",
      title: "Notes rapides", html: `<h1>Notes</h1><p><strong>Date :</strong> ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}</p><h2>Idées</h2><ul><li><br></li></ul><h2>À faire</h2><ul><li><br></li></ul><h2>Questions</h2><ul><li><br></li></ul>`
    }
  ];

  const blocks = {
    definition: ["Définition", "ph-definition", "Définition de la notion…"],
    citation: ["Citation", "ph-citation", "« Citation… »"],
    example: ["Exemple", "ph-example", "Exemple concret…"],
    author: ["Auteur", "ph-author", "Auteur — idée, concept ou thèse…"],
    remember: ["À retenir", "ph-remember", "Idée essentielle à retenir…"],
    warning: ["Attention", "ph-warning", "Nuance, difficulté ou erreur fréquente…"],
    problem: ["Problème", "ph-problem", "Question ou tension à examiner…"],
    reference: ["Référence", "ph-reference", "Auteur, Titre, édition, année…"]
  };

  const slashCommands = [
    { id: "h1", icon: "H1", label: "Titre 1", hint: "Grande partie", run: () => API.exec("formatBlock", "h1") },
    { id: "h2", icon: "H2", label: "Titre 2", hint: "Sous-partie", run: () => API.exec("formatBlock", "h2") },
    { id: "h3", icon: "H3", label: "Titre 3", hint: "Sous-section", run: () => API.exec("formatBlock", "h3") },
    { id: "bullet", icon: "•", label: "Liste à puces", hint: "Liste non ordonnée", run: () => API.exec("insertUnorderedList") },
    { id: "number", icon: "1.", label: "Liste numérotée", hint: "Étapes ou arguments", run: () => API.exec("insertOrderedList") },
    { id: "quote", icon: "❝", label: "Citation longue", hint: "Bloc de citation", run: () => API.exec("formatBlock", "blockquote") },
    { id: "definition", icon: "D", label: "Définition", hint: "Bloc Philosophal", run: () => insertBlock("definition") },
    { id: "example", icon: "E", label: "Exemple", hint: "Bloc Philosophal", run: () => insertBlock("example") },
    { id: "author", icon: "A", label: "Auteur", hint: "Bloc Philosophal", run: () => insertBlock("author") },
    { id: "remember", icon: "★", label: "À retenir", hint: "Synthèse importante", run: () => insertBlock("remember") },
    { id: "problem", icon: "?", label: "Problème", hint: "Question directrice", run: () => insertBlock("problem") },
    { id: "warning", icon: "!", label: "Attention", hint: "Nuance ou erreur fréquente", run: () => insertBlock("warning") },
    { id: "reference", icon: "R", label: "Référence", hint: "Référence bibliographique", run: () => insertBlock("reference") },
    { id: "table", icon: "▦", label: "Tableau", hint: "Insérer un tableau", run: () => $(`[data-insert-table]`)?.click() },
    { id: "line", icon: "—", label: "Séparateur", hint: "Ligne horizontale", run: () => API.exec("insertHorizontalRule") },
    { id: "footnote", icon: "¹", label: "Note de bas de page", hint: "Ajouter une note", run: () => insertFootnote() },
    { id: "date", icon: "28", label: "Date", hint: "Insérer la date du jour", run: () => $(`[data-insert-date]`)?.click() },
    { id: "toc", icon: "≡", label: "Table des matières", hint: "Générée depuis les titres", run: () => window.PhilosophalEditorV3?.insertToc() },
    { id: "comment", icon: "💬", label: "Commentaire privé", hint: "Annotation non exportée", run: () => window.PhilosophalEditorV3?.openComment() },
    { id: "smart-citation", icon: "❞", label: "Citation sourcée", hint: "Auteur, œuvre, page", run: () => window.PhilosophalEditorV3?.openCitation() },
    { id: "wiki", icon: "[[ ]]", label: "Lien vers un document", hint: "Lien wiki + backlinks", run: () => window.PhilosophalEditorV3?.insertWiki() },
    { id: "properties", icon: "☷", label: "Propriétés", hint: "Tags, statut, matière…", run: () => window.PhilosophalEditorV3?.openInspector("info") },
    { id: "source", icon: "◫", label: "Source en double panneau", hint: "PDF, vidéo, texte ou URL", run: () => window.PhilosophalEditorV3?.openSource() },
    { id: "revision", icon: "◎", label: "Mode révision", hint: "Rappel actif automatique", run: () => window.PhilosophalEditorV3?.openRevision() },
    { id: "styles", icon: "Aa", label: "Styles personnalisés", hint: "Créer et appliquer un style", run: () => window.PhilosophalEditorV3?.openStyles() },
    { id: "global-search", icon: "⌕", label: "Recherche globale", hint: "Chercher dans tous les documents", run: () => window.PhilosophalEditorV3?.openGlobalSearch() },
    { id: "layout", icon: "▣", label: "Mise en page", hint: "Export avancé", run: () => window.PhilosophalEditorV3?.openExport() },
    { id: "bibliography", icon: "B", label: "Générer la bibliographie", hint: "Citations sourcées + références", run: () => window.PhilosophalEditorV3?.generateBibliography() },
    { id: "context", icon: "◇", label: "Contexte médiathèque", hint: "Ressources liées aux figures citées", run: () => window.PhilosophalEditorV3?.openContext() },
    { id: "cards", icon: "▦", label: "Basculer liste / cartes", hint: "Vue de la bibliothèque", run: () => window.PhilosophalEditorV3?.toggleLibraryView() }
  ];

  const specialChars = ["—","–","…","«","»","“","”","‘","’","•","·","§","¶","©","®","™","°","±","×","÷","≠","≈","≤","≥","∞","→","←","↔","⇒","⇔","∀","∃","∅","∈","∉","⊂","⊃","∧","∨","¬","∴","α","β","γ","δ","ε","λ","μ","π","σ","φ","ψ","ω","Ω"];

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed == null ? fallback : parsed;
    } catch (_) { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function openMetaDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("indexeddb unavailable"));
      const request = indexedDB.open(META_DB, META_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("versions")) {
          const store = db.createObjectStore("versions", { keyPath: "id" });
          store.createIndex("docId", "docId", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("trash")) {
          const store = db.createObjectStore("trash", { keyPath: "id" });
          store.createIndex("deletedAt", "deletedAt", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("meta db"));
    });
  }

  function metaReq(storeName, mode, action) {
    return new Promise((resolve, reject) => {
      if (!adv.metaDb) return reject(new Error("no db"));
      const tx = adv.metaDb.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const req = action(store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("meta request"));
    });
  }

  function fallbackMetaKey(name) { return `philosophal-editor-meta-${name}-v2`; }

  async function metaInit() {
    try {
      adv.metaDb = await openMetaDb();
      adv.metaFallback = false;
    } catch (_) {
      adv.metaDb = null;
      adv.metaFallback = true;
    }
  }

  async function getVersions(docId) {
    if (!docId) return [];
    if (adv.metaFallback) {
      const all = readJson(fallbackMetaKey("versions"), []);
      return all.filter(v => v.docId === docId).sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    }
    const list = await metaReq("versions", "readonly", store => store.index("docId").getAll(docId));
    return (list || []).sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  async function putVersion(version) {
    if (adv.metaFallback) {
      const all = readJson(fallbackMetaKey("versions"), []).filter(v => v.id !== version.id);
      all.push(version);
      writeJson(fallbackMetaKey("versions"), all);
      return;
    }
    await metaReq("versions", "readwrite", store => store.put(version));
  }

  async function deleteVersion(id) {
    if (adv.metaFallback) {
      writeJson(fallbackMetaKey("versions"), readJson(fallbackMetaKey("versions"), []).filter(v => v.id !== id));
      return;
    }
    await metaReq("versions", "readwrite", store => store.delete(id));
  }

  async function listTrash() {
    if (adv.metaFallback) return readJson(fallbackMetaKey("trash"), []).sort((a,b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
    const list = await metaReq("trash", "readonly", store => store.getAll());
    return (list || []).sort((a,b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
  }

  async function putTrash(item) {
    if (adv.metaFallback) {
      const all = readJson(fallbackMetaKey("trash"), []).filter(v => v.id !== item.id);
      all.push(item);
      writeJson(fallbackMetaKey("trash"), all);
      return;
    }
    await metaReq("trash", "readwrite", store => store.put(item));
  }

  async function deleteTrash(id) {
    if (adv.metaFallback) {
      writeJson(fallbackMetaKey("trash"), readJson(fallbackMetaKey("trash"), []).filter(v => v.id !== id));
      return;
    }
    await metaReq("trash", "readwrite", store => store.delete(id));
  }

  function getDocSettings(id = API.state.activeId) {
    const base = { lineHeight: "1.72", paragraphSpacing: "0.72", margin: "normal", zoom: "1" };
    return { ...base, ...(adv.settings[id] || {}) };
  }

  function setDocSettings(patch) {
    const id = API.state.activeId;
    if (!id) return;
    adv.settings[id] = { ...getDocSettings(id), ...patch };
    writeJson(SETTINGS_KEY, adv.settings);
    applyDocSettings();
  }

  function applyDocSettings() {
    const settings = getDocSettings();
    editor.style.setProperty("--doc-line-height", settings.lineHeight);
    editor.style.setProperty("--doc-paragraph-spacing", `${settings.paragraphSpacing}em`);
    paper.dataset.margin = settings.margin;
    paper.style.zoom = settings.zoom;
    $(`[data-line-height]`).value = settings.lineHeight;
    $(`[data-paragraph-spacing]`).value = settings.paragraphSpacing;
    $(`[data-page-margin]`).value = settings.margin;
    $(`[data-page-zoom]`).value = settings.zoom;
  }

  function renderTemplates() {
    const grid = $(`[data-template-grid]`);
    grid.innerHTML = templates.map(item => `
      <button type="button" class="editor-template-option" data-template="${esc(item.id)}">
        <span class="template-icon">${item.icon}</span>
        <strong>${esc(item.name)}</strong>
        <p>${esc(item.description)}</p>
      </button>`).join("");
  }

  function openTemplateModal() {
    $(`[data-template-modal]`).hidden = false;
  }

  function closeTemplateModal() {
    $(`[data-template-modal]`).hidden = true;
  }

  async function createFromTemplate(id) {
    const tpl = templates.find(item => item.id === id) || templates[0];
    closeTemplateModal();
    const doc = await API.createDocument({ title: tpl.title, html: tpl.html, selectTitle: true });
    addTab(doc.id);
    setDocSettings({ lineHeight: "1.72", paragraphSpacing: "0.72", margin: "normal", zoom: "1" });
    renderOutline();
  }

  function addTab(id) {
    if (!id) return;
    if (!adv.tabs.includes(id)) adv.tabs.push(id);
    adv.tabs = adv.tabs.filter(tabId => API.state.documents.some(doc => doc.id === tabId));
    writeJson(TABS_KEY, adv.tabs);
    renderTabs();
  }

  function removeTab(id) {
    adv.tabs = adv.tabs.filter(tabId => tabId !== id);
    writeJson(TABS_KEY, adv.tabs);
    renderTabs();
  }

  function renderTabs() {
    const wrap = $(`[data-tabs]`);
    const docs = adv.tabs.map(id => API.state.documents.find(doc => doc.id === id)).filter(Boolean);
    wrap.innerHTML = docs.map(doc => `
      <div class="editor-tab ${doc.id === API.state.activeId ? "is-active" : ""}" data-tab="${esc(doc.id)}">
        <button type="button" class="editor-tab-label" data-tab-open="${esc(doc.id)}" title="${esc(doc.title || "Sans titre")}">${esc(doc.title || "Sans titre")}</button>
        <button type="button" class="editor-tab-close" data-tab-close="${esc(doc.id)}" aria-label="Fermer l’onglet">×</button>
      </div>`).join("") + `<button type="button" class="editor-tab editor-tab-add" data-open-templates title="Nouveau document">＋</button>`;
  }

  async function switchTab(id) {
    const doc = API.state.documents.find(item => item.id === id);
    if (!doc) return;
    await API.flushSave();
    API.loadDocument(doc);
  }

  function currentHeadingNodes(heading) {
    const level = Number(heading.tagName.slice(1));
    const nodes = [heading];
    let node = heading.nextSibling;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && /^H[1-3]$/.test(node.tagName)) {
        const nextLevel = Number(node.tagName.slice(1));
        if (nextLevel <= level) break;
      }
      nodes.push(node);
      node = node.nextSibling;
    }
    return nodes;
  }

  function applyCollapsedSections() {
    [...editor.childNodes].forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) node.classList.remove("editor-collapsed-node");
    });
    $$(`h1[data-collapsed="true"],h2[data-collapsed="true"],h3[data-collapsed="true"]`, editor).forEach(heading => {
      const level = Number(heading.tagName.slice(1));
      let node = heading.nextSibling;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && /^H[1-3]$/.test(node.tagName)) {
          const nextLevel = Number(node.tagName.slice(1));
          if (nextLevel <= level) break;
        }
        if (node.nodeType === Node.ELEMENT_NODE) node.classList.add("editor-collapsed-node");
        node = node.nextSibling;
      }
    });
  }

  function renderOutline() {
    if (adv.syncing) return;
    const list = $(`[data-outline-list]`);
    const empty = $(`[data-outline-empty]`);
    const headings = $$(`h1,h2,h3`, editor);
    empty.hidden = headings.length > 0;
    list.innerHTML = headings.map((heading, index) => {
      const level = Number(heading.tagName.slice(1));
      const text = (heading.innerText || "Titre sans nom").trim() || "Titre sans nom";
      const collapsed = heading.dataset.collapsed === "true";
      return `<div class="editor-outline-item level-${level}" draggable="true" data-outline-index="${index}">
        <span class="editor-outline-grip" title="Faire glisser">⋮⋮</span>
        <button type="button" class="editor-outline-jump" data-outline-jump="${index}" title="${esc(text)}">${esc(text)}</button>
        <button type="button" class="editor-outline-collapse" data-outline-duplicate="${index}" title="Dupliquer la section">⧉</button>
        <button type="button" class="editor-outline-collapse" data-outline-collapse="${index}" title="${collapsed ? "Déplier" : "Replier"}">${collapsed ? "▸" : "▾"}</button>
      </div>`;
    }).join("");
    applyCollapsedSections();
  }

  function outlineHeading(index) {
    return $$(`h1,h2,h3`, editor)[Number(index)] || null;
  }

  function jumpToHeading(index) {
    const heading = outlineHeading(index);
    if (!heading) return;
    if (heading.classList.contains("editor-collapsed-node")) {
      heading.classList.remove("editor-collapsed-node");
    }
    heading.scrollIntoView({ behavior: "smooth", block: "center" });
    const range = document.createRange();
    range.selectNodeContents(heading);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function toggleCollapse(index) {
    const heading = outlineHeading(index);
    if (!heading) return;
    heading.dataset.collapsed = heading.dataset.collapsed === "true" ? "false" : "true";
    applyCollapsedSections();
    API.scheduleSave();
    renderOutline();
  }

  function duplicateSection(index) {
    const heading = outlineHeading(index);
    if (!heading) return;
    const nodes = currentHeadingNodes(heading);
    const fragment = document.createDocumentFragment();
    nodes.forEach(node => fragment.appendChild(node.cloneNode(true)));
    const last = nodes[nodes.length - 1];
    last.parentNode.insertBefore(fragment, last.nextSibling);
    API.scheduleSave();
    renderOutline();
    API.toast("Section dupliquée.");
  }

  function moveSection(sourceHeading, targetHeading) {
    if (!sourceHeading || !targetHeading || sourceHeading === targetHeading) return;
    const nodes = currentHeadingNodes(sourceHeading);
    if (nodes.includes(targetHeading)) return;
    const fragment = document.createDocumentFragment();
    nodes.forEach(node => fragment.appendChild(node));
    targetHeading.parentNode.insertBefore(fragment, targetHeading);
    API.scheduleSave();
    renderOutline();
    API.toast("Section déplacée.");
  }

  function openOutline() {
    document.body.classList.add("editor-outline-open");
    $(`[data-outline-toggle]`).setAttribute("aria-pressed", "true");
    renderOutline();
  }

  function closeOutline() {
    document.body.classList.remove("editor-outline-open");
    $(`[data-outline-toggle]`).setAttribute("aria-pressed", "false");
  }

  function toggleOutline() {
    document.body.classList.contains("editor-outline-open") ? closeOutline() : openOutline();
  }

  function insertBlock(type) {
    const def = blocks[type];
    if (!def) return;
    API.restoreSelection();
    const [label, className, placeholder] = def;
    const html = `<div class="ph-block ${className}"><div class="ph-block-label" contenteditable="false">${esc(label)}</div><p>${esc(placeholder)}</p></div><p><br></p>`;
    API.exec("insertHTML", html);
    closeBlocksPopover();
    setTimeout(renderOutline, 20);
  }

  function positionPopover(popover, anchor) {
    const r = anchor.getBoundingClientRect();
    const width = popover.offsetWidth || 180;
    const left = Math.min(window.innerWidth - width - 10, Math.max(10, r.left));
    const top = Math.min(window.innerHeight - 260, r.bottom + 6);
    popover.style.left = `${left}px`;
    popover.style.top = `${Math.max(10, top)}px`;
  }

  function openBlocksPopover() {
    const pop = $(`[data-blocks-popover]`);
    pop.hidden = false;
    positionPopover(pop, $(`[data-blocks-trigger]`));
  }

  function closeBlocksPopover() { $(`[data-blocks-popover]`).hidden = true; }

  function currentEditableBlock() {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return null;
    let node = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!(node instanceof Element)) return null;
    return node.closest("p,h1,h2,h3,blockquote,li,div.ph-block") || null;
  }

  function commandRect() {
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect && (rect.width || rect.height)) return rect;
    }
    return editor.getBoundingClientRect();
  }

  function renderCommandPalette(query = "") {
    const q = query.trim().toLowerCase();
    adv.commandMatches = slashCommands.filter(item => !q || `${item.label} ${item.hint}`.toLowerCase().includes(q));
    adv.commandIndex = Math.min(adv.commandIndex, Math.max(0, adv.commandMatches.length - 1));
    const list = $(`[data-command-list]`);
    list.innerHTML = adv.commandMatches.map((item, index) => `<button type="button" class="editor-command-option ${index === adv.commandIndex ? "is-active" : ""}" data-slash-command="${item.id}"><i>${item.icon}</i><span><strong>${esc(item.label)}</strong><small>${esc(item.hint)}</small></span></button>`).join("") || `<div class="editor-empty-panel">Aucune commande.</div>`;
  }

  function openCommandPalette(block, query = "") {
    adv.slashBlock = block;
    const palette = $(`[data-command-palette]`);
    const rect = commandRect();
    palette.hidden = false;
    palette.style.left = `${Math.max(10, Math.min(window.innerWidth - 370, rect.left))}px`;
    palette.style.top = `${Math.max(70, Math.min(window.innerHeight - 380, rect.bottom + 8))}px`;
    $(`[data-command-query]`).value = query;
    adv.commandIndex = 0;
    renderCommandPalette(query);
  }

  function closeCommandPalette() {
    $(`[data-command-palette]`).hidden = true;
    adv.slashBlock = null;
  }

  function detectSlashCommand() {
    const block = currentEditableBlock();
    if (!block || block.closest(".ph-block")) { closeCommandPalette(); return; }
    const text = (block.innerText || "").trim();
    const m = text.match(/^\/([^\n]*)$/);
    if (!m) { closeCommandPalette(); return; }
    openCommandPalette(block, m[1]);
  }

  function runSlashCommand(id) {
    const item = slashCommands.find(cmd => cmd.id === id);
    if (!item) return;
    const block = adv.slashBlock;
    closeCommandPalette();
    if (block && editor.contains(block)) {
      block.innerHTML = "<br>";
      const range = document.createRange();
      range.selectNodeContents(block);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      API.saveSelection();
    }
    item.run();
  }

  function collectTextMatches(query) {
    if (!query) return [];
    const lower = query.toLocaleLowerCase("fr");
    const ranges = [];
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.parentElement?.closest(`[contenteditable="false"]`)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue;
      const low = text.toLocaleLowerCase("fr");
      let start = 0;
      while ((start = low.indexOf(lower, start)) !== -1) {
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, start + query.length);
        ranges.push(range);
        start += Math.max(1, query.length);
      }
    }
    return ranges;
  }

  function applyFindHighlights() {
    if (window.CSS?.highlights && window.Highlight) {
      CSS.highlights.delete("editor-find");
      CSS.highlights.delete("editor-find-current");
      if (adv.findRanges.length) CSS.highlights.set("editor-find", new Highlight(...adv.findRanges));
      if (adv.currentFindIndex >= 0 && adv.findRanges[adv.currentFindIndex]) CSS.highlights.set("editor-find-current", new Highlight(adv.findRanges[adv.currentFindIndex]));
    }
  }

  function updateFind() {
    const query = $(`[data-find-input]`).value;
    adv.findRanges = collectTextMatches(query);
    if (!adv.findRanges.length) adv.currentFindIndex = -1;
    else if (adv.currentFindIndex < 0 || adv.currentFindIndex >= adv.findRanges.length) adv.currentFindIndex = 0;
    $(`[data-find-count]`).textContent = `${adv.findRanges.length} résultat${adv.findRanges.length > 1 ? "s" : ""}`;
    applyFindHighlights();
  }

  function selectFind(index) {
    if (!adv.findRanges.length) return;
    adv.currentFindIndex = (index + adv.findRanges.length) % adv.findRanges.length;
    const range = adv.findRanges[adv.currentFindIndex];
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range.cloneRange());
    const rect = range.getBoundingClientRect();
    if (rect) pageScroll.scrollBy({ top: rect.top - pageScroll.getBoundingClientRect().top - pageScroll.clientHeight / 2, behavior: "smooth" });
    applyFindHighlights();
  }

  function openSearch(replace = false) {
    const bar = $(`[data-searchbar]`);
    bar.hidden = false;
    const find = $(`[data-find-input]`);
    find.focus();
    find.select();
    if (replace) $(`[data-replace-input]`).style.display = "";
    updateFind();
  }

  function closeSearch() {
    $(`[data-searchbar]`).hidden = true;
    adv.findRanges = [];
    adv.currentFindIndex = -1;
    if (window.CSS?.highlights) {
      CSS.highlights.delete("editor-find");
      CSS.highlights.delete("editor-find-current");
    }
    editor.focus();
  }

  function replaceCurrent() {
    if (adv.currentFindIndex < 0 || !adv.findRanges[adv.currentFindIndex]) return;
    const replacement = $(`[data-replace-input]`).value;
    const range = adv.findRanges[adv.currentFindIndex];
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    API.scheduleSave();
    updateFind();
    selectFind(Math.min(adv.currentFindIndex, Math.max(0, adv.findRanges.length - 1)));
  }

  function replaceAll() {
    const replacement = $(`[data-replace-input]`).value;
    const count = adv.findRanges.length;
    [...adv.findRanges].reverse().forEach(range => {
      range.deleteContents();
      range.insertNode(document.createTextNode(replacement));
    });
    API.scheduleSave();
    updateFind();
    API.toast(`${count} remplacement${count > 1 ? "s" : ""}.`);
  }

  function applyFontSize(px) {
    if (!px) return;
    editor.focus();
    API.restoreSelection();
    try {
      document.execCommand("fontSize", false, "7");
      $$(`font[size="7"]`, editor).forEach(font => {
        font.removeAttribute("size");
        font.style.fontSize = `${px}px`;
      });
    } catch (_) {}
    API.saveSelection();
    API.scheduleSave();
  }

  function insertAtSelection(text) {
    editor.focus();
    API.restoreSelection();
    try { document.execCommand("insertText", false, text); }
    catch (_) {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
    API.saveSelection();
    API.scheduleSave();
  }

  function insertFootnote() {
    API.saveSelection();
    const note = window.prompt("Texte de la note de bas de page :", "");
    if (!note) return;
    let section = $(`.ph-footnotes`, editor);
    const n = (section?.querySelectorAll("li").length || 0) + 1;
    editor.focus();
    API.restoreSelection();
    document.execCommand("insertHTML", false, `<sup><a href="#fn-${n}" id="fnref-${n}">${n}</a></sup>`);
    if (!section) {
      section = document.createElement("section");
      section.className = "ph-footnotes";
      section.innerHTML = `<h2>Notes</h2><ol></ol>`;
      editor.appendChild(section);
    }
    const li = document.createElement("li");
    li.id = `fn-${n}`;
    li.innerHTML = `${esc(note)} <a href="#fnref-${n}" aria-label="Retour à la note">↩</a>`;
    section.querySelector("ol").appendChild(li);
    API.scheduleSave();
    API.toast("Note de bas de page ajoutée.");
  }

  function renderSymbols() {
    $(`[data-symbol-grid]`).innerHTML = specialChars.map(char => `<button type="button" data-symbol="${esc(char)}" title="Insérer ${esc(char)}">${esc(char)}</button>`).join("");
  }

  function openSymbols() {
    API.saveSelection();
    const pop = $(`[data-symbols-popover]`);
    pop.hidden = false;
    const anchor = $(`[data-symbols]`);
    const rect = anchor.getBoundingClientRect();
    pop.style.top = `${Math.min(window.innerHeight - 330, rect.bottom + 7)}px`;
    pop.style.right = `${Math.max(10, window.innerWidth - rect.right)}px`;
  }

  function closeSymbols() { $(`[data-symbols-popover]`).hidden = true; }

  function cleanCloneForPreview() {
    const clone = editor.cloneNode(true);
    $$(`.editor-collapsed-node`, clone).forEach(el => el.classList.remove("editor-collapsed-node"));
    $$(`[data-collapsed]`, clone).forEach(el => el.removeAttribute("data-collapsed"));
    return clone.innerHTML;
  }

  function openPreview() {
    const title = (titleInput.value || "Sans titre").trim() || "Sans titre";
    $(`[data-preview-title]`).textContent = title;
    const content = $(`[data-preview-content]`);
    const html = cleanCloneForPreview();
    const firstHeading = editor.querySelector("h1");
    const sameTitle = firstHeading && (firstHeading.textContent || "").trim().toLowerCase() === title.toLowerCase();
    content.innerHTML = `${sameTitle ? "" : `<h1>${esc(title)}</h1>`}${html}`;
    $(`[data-preview-modal]`).hidden = false;
  }

  function closePreview() { $(`[data-preview-modal]`).hidden = true; }

  async function createVersion(label = "Version manuelle", silent = false) {
    const doc = API.state.current;
    if (!doc) return;
    await API.flushSave();
    const settings = getDocSettings(doc.id);
    const version = {
      id: `${doc.id}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      docId: doc.id,
      title: (titleInput.value || doc.title || "Sans titre").trim() || "Sans titre",
      html: editor.innerHTML,
      createdAt: nowIso(),
      label,
      settings
    };
    const existing = await getVersions(doc.id);
    if (existing[0] && existing[0].html === version.html && existing[0].title === version.title && label !== "Version manuelle") return;
    await putVersion(version);
    const all = await getVersions(doc.id);
    for (const old of all.slice(MAX_VERSIONS)) await deleteVersion(old.id);
    if (!silent) API.toast("Version enregistrée.");
    if (!$(`[data-versions-modal]`).hidden) renderVersions();
  }

  function fmtFullDate(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  }

  async function renderVersions() {
    const list = $(`[data-version-list]`);
    const versions = await getVersions(API.state.activeId);
    list.innerHTML = versions.length ? versions.map(v => `<div class="editor-version-item">
      <div><strong>${esc(v.label || "Version")}</strong><small>${esc(fmtFullDate(v.createdAt))} · ${esc(v.title || "Sans titre")}</small></div>
      <div class="editor-version-actions"><button type="button" data-restore-version="${esc(v.id)}">Restaurer</button><button type="button" data-delete-version="${esc(v.id)}">Suppr.</button></div>
    </div>`).join("") : `<div class="editor-empty-panel">Aucune version enregistrée pour ce document.</div>`;
  }

  async function openVersions() {
    await renderVersions();
    $(`[data-versions-modal]`).hidden = false;
  }

  function closeVersions() { $(`[data-versions-modal]`).hidden = true; }

  async function restoreVersion(id) {
    const versions = await getVersions(API.state.activeId);
    const version = versions.find(v => v.id === id);
    if (!version) return;
    if (!window.confirm("Restaurer cette version ? La version actuelle sera conservée dans l’historique.")) return;
    await createVersion("Avant restauration", true);
    titleInput.value = version.title || "Sans titre";
    editor.innerHTML = version.html || "";
    if (version.settings) {
      adv.settings[API.state.activeId] = { ...getDocSettings(), ...version.settings };
      writeJson(SETTINGS_KEY, adv.settings);
      applyDocSettings();
    }
    API.scheduleSave();
    await API.flushSave();
    renderOutline();
    closeVersions();
    API.toast("Version restaurée.");
  }

  async function autoVersionIfNeeded() {
    const id = API.state.activeId;
    if (!id) return;
    const versions = await getVersions(id);
    const latest = versions[0];
    const age = latest ? Date.now() - new Date(latest.createdAt).getTime() : Infinity;
    if (age >= AUTO_VERSION_MS) await createVersion("Version automatique", true);
  }

  async function moveCurrentToTrash() {
    const doc = API.state.current;
    if (!doc) return;
    await API.flushSave();
    const title = doc.title || "ce document";
    if (!window.confirm(`Déplacer « ${title} » dans la corbeille ?`)) return;
    await createVersion("Avant mise en corbeille", true);
    const snapshot = {
      ...doc,
      title: (titleInput.value || doc.title || "Sans titre").trim() || "Sans titre",
      html: editor.innerHTML,
      deletedAt: nowIso(),
      settings: getDocSettings(doc.id)
    };
    await putTrash(snapshot);
    await API.deleteDocumentFromStorage(doc.id);
    API.state.documents = API.state.documents.filter(item => item.id !== doc.id);
    removeTab(doc.id);
    delete adv.settings[doc.id];
    writeJson(SETTINGS_KEY, adv.settings);
    API.state.current = null;
    API.state.activeId = "";
    API.sortDocuments();
    API.renderDocumentList();
    const nextId = adv.tabs[adv.tabs.length - 1];
    const next = API.state.documents.find(item => item.id === nextId) || API.state.documents[0];
    if (next) API.loadDocument(next);
    else await API.createDocument({ title: "Sans titre", html: "<p><br></p>", selectTitle: false });
    await updateTrashCount();
    API.toast("Document placé dans la corbeille.");
  }

  async function updateTrashCount() {
    const trash = await listTrash();
    $(`[data-trash-count]`).textContent = String(trash.length);
  }

  async function renderTrash() {
    const list = $(`[data-trash-list]`);
    const trash = await listTrash();
    list.innerHTML = trash.length ? trash.map(item => `<div class="editor-trash-item">
      <div><strong>${esc(item.title || "Sans titre")}</strong><small>Supprimé ${esc(fmtFullDate(item.deletedAt))}</small></div>
      <div class="editor-trash-actions"><button type="button" data-restore-trash="${esc(item.id)}">Restaurer</button><button type="button" class="is-danger" data-delete-trash="${esc(item.id)}">Supprimer</button></div>
    </div>`).join("") : `<div class="editor-empty-panel">La corbeille est vide.</div>`;
  }

  async function openTrash() {
    await renderTrash();
    $(`[data-trash-modal]`).hidden = false;
  }

  function closeTrash() { $(`[data-trash-modal]`).hidden = true; }

  async function restoreTrash(id) {
    const trash = await listTrash();
    const item = trash.find(x => x.id === id);
    if (!item) return;
    const restored = API.normalizeDoc(item);
    await API.putDocument(restored);
    if (!API.state.documents.some(doc => doc.id === restored.id)) API.state.documents.push(restored);
    API.sortDocuments();
    API.renderDocumentList();
    if (item.settings) {
      adv.settings[restored.id] = item.settings;
      writeJson(SETTINGS_KEY, adv.settings);
    }
    await deleteTrash(id);
    addTab(restored.id);
    API.loadDocument(restored);
    await renderTrash();
    await updateTrashCount();
    API.toast("Document restauré.");
  }

  async function permanentlyDeleteTrash(id) {
    if (!window.confirm("Supprimer définitivement ce document de la corbeille ?")) return;
    await deleteTrash(id);
    await renderTrash();
    await updateTrashCount();
  }

  async function backupLibrary() {
    await API.flushSave();
    const trash = await listTrash();
    const payload = {
      format: "philosophal-editor-library",
      version: 2,
      exportedAt: nowIso(),
      documents: API.state.documents,
      settings: adv.settings,
      trash
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `philosophal-bibliotheque-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    API.toast("Bibliothèque sauvegardée.");
  }

  function toggleTheme() {
    const active = !document.body.classList.contains("editor-dark");
    document.body.classList.toggle("editor-dark", active);
    $(`[data-theme-toggle]`).setAttribute("aria-pressed", String(active));
    try { localStorage.setItem(THEME_KEY, active ? "dark" : "light"); } catch (_) {}
  }

  function initTheme() {
    let theme = "";
    try { theme = localStorage.getItem(THEME_KEY) || ""; } catch (_) {}
    const dark = theme === "dark";
    document.body.classList.toggle("editor-dark", dark);
    $(`[data-theme-toggle]`).setAttribute("aria-pressed", String(dark));
  }

  function syncDocumentUi() {
    const id = API.state.activeId;
    if (!id) return;
    addTab(id);
    applyDocSettings();
    renderTabs();
    renderOutline();
    setTimeout(() => {
      renderTabs();
      const activeTab = $(`.editor-tab.is-active`);
      activeTab?.scrollIntoView({ inline: "nearest", block: "nearest" });
    }, 0);
  }

  function bindEvents() {
    // Intercepte les deux actions que la V2 remplace : Nouveau (modèles) et Supprimer (corbeille).
    document.addEventListener("click", event => {
      if (event.target.closest(`[data-new-document]`)) {
        event.preventDefault(); event.stopImmediatePropagation();
        openTemplateModal();
        return;
      }
      if (event.target.closest(`[data-delete-document]`)) {
        event.preventDefault(); event.stopImmediatePropagation();
        moveCurrentToTrash();
      }
    }, true);

    $(`[data-open-templates]`)?.addEventListener("click", openTemplateModal);
    $(`[data-template-grid]`).addEventListener("click", event => {
      const button = event.target.closest(`[data-template]`);
      if (button) createFromTemplate(button.dataset.template);
    });
    $$(`[data-close-template]`).forEach(el => el.addEventListener("click", closeTemplateModal));

    $(`[data-tabs]`).addEventListener("click", event => {
      const open = event.target.closest(`[data-tab-open]`);
      if (open) switchTab(open.dataset.tabOpen);
      const close = event.target.closest(`[data-tab-close]`);
      if (close) {
        event.stopPropagation();
        const id = close.dataset.tabClose;
        const wasActive = id === API.state.activeId;
        removeTab(id);
        if (wasActive) {
          const next = adv.tabs.map(tabId => API.state.documents.find(doc => doc.id === tabId)).filter(Boolean).pop() || API.state.documents.find(doc => doc.id !== id);
          if (next) API.loadDocument(next);
        }
      }
      if (event.target.closest(`[data-open-templates]`)) openTemplateModal();
    });

    $(`[data-outline-toggle]`).addEventListener("click", toggleOutline);
    $(`[data-close-outline]`).addEventListener("click", closeOutline);
    $(`[data-outline-list]`).addEventListener("click", event => {
      const jump = event.target.closest(`[data-outline-jump]`);
      const collapse = event.target.closest(`[data-outline-collapse]`);
      const duplicate = event.target.closest(`[data-outline-duplicate]`);
      if (jump) jumpToHeading(jump.dataset.outlineJump);
      if (collapse) toggleCollapse(collapse.dataset.outlineCollapse);
      if (duplicate) duplicateSection(duplicate.dataset.outlineDuplicate);
    });
    $(`[data-outline-list]`).addEventListener("dragstart", event => {
      const item = event.target.closest(`[data-outline-index]`);
      if (!item) return;
      adv.draggedHeading = outlineHeading(item.dataset.outlineIndex);
      item.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
    });
    $(`[data-outline-list]`).addEventListener("dragend", () => {
      $$(`.editor-outline-item`).forEach(el => el.classList.remove("is-dragging", "is-drop-target"));
      adv.draggedHeading = null;
    });
    $(`[data-outline-list]`).addEventListener("dragover", event => {
      const item = event.target.closest(`[data-outline-index]`);
      if (!item || !adv.draggedHeading) return;
      event.preventDefault();
      $$(`.editor-outline-item`).forEach(el => el.classList.remove("is-drop-target"));
      item.classList.add("is-drop-target");
    });
    $(`[data-outline-list]`).addEventListener("drop", event => {
      const item = event.target.closest(`[data-outline-index]`);
      if (!item || !adv.draggedHeading) return;
      event.preventDefault();
      moveSection(adv.draggedHeading, outlineHeading(item.dataset.outlineIndex));
    });

    $(`[data-blocks-trigger]`).addEventListener("mousedown", API.saveSelection);
    $(`[data-blocks-trigger]`).addEventListener("click", () => $(`[data-blocks-popover]`).hidden ? openBlocksPopover() : closeBlocksPopover());
    $(`[data-blocks-popover]`).addEventListener("click", event => {
      const button = event.target.closest(`[data-block]`);
      if (button) insertBlock(button.dataset.block);
    });

    editor.addEventListener("input", () => {
      detectSlashCommand();
      renderOutline();
      if (!$(`[data-searchbar]`).hidden) updateFind();
    });

    $(`[data-command-list]`).addEventListener("mousedown", event => event.preventDefault());
    $(`[data-command-list]`).addEventListener("click", event => {
      const button = event.target.closest(`[data-slash-command]`);
      if (button) runSlashCommand(button.dataset.slashCommand);
    });

    $(`[data-open-search]`).addEventListener("click", () => openSearch(false));
    $(`[data-close-search]`).addEventListener("click", closeSearch);
    $(`[data-find-input]`).addEventListener("input", () => { adv.currentFindIndex = 0; updateFind(); });
    $(`[data-find-next]`).addEventListener("click", () => selectFind(adv.currentFindIndex + 1));
    $(`[data-find-prev]`).addEventListener("click", () => selectFind(adv.currentFindIndex - 1));
    $(`[data-replace-one]`).addEventListener("click", replaceCurrent);
    $(`[data-replace-all]`).addEventListener("click", replaceAll);
    $(`[data-find-input]`).addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); selectFind(adv.currentFindIndex + (event.shiftKey ? -1 : 1)); }
      if (event.key === "Escape") closeSearch();
    });

    $(`[data-font-size]`).addEventListener("mousedown", API.saveSelection);
    $(`[data-font-size]`).addEventListener("change", event => applyFontSize(event.target.value));

    $(`[data-line-height]`).addEventListener("change", event => setDocSettings({ lineHeight: event.target.value }));
    $(`[data-paragraph-spacing]`).addEventListener("change", event => setDocSettings({ paragraphSpacing: event.target.value }));
    $(`[data-page-margin]`).addEventListener("change", event => setDocSettings({ margin: event.target.value }));
    $(`[data-page-zoom]`).addEventListener("change", event => setDocSettings({ zoom: event.target.value }));

    $(`[data-footnote]`).addEventListener("mousedown", API.saveSelection);
    $(`[data-footnote]`).addEventListener("click", insertFootnote);
    $(`[data-symbols]`).addEventListener("mousedown", API.saveSelection);
    $(`[data-symbols]`).addEventListener("click", openSymbols);
    $(`[data-close-symbols]`).addEventListener("click", closeSymbols);
    $(`[data-symbol-grid]`).addEventListener("click", event => {
      const button = event.target.closest(`[data-symbol]`);
      if (!button) return;
      insertAtSelection(button.dataset.symbol);
      closeSymbols();
    });

    $(`[data-preview-document]`).addEventListener("click", openPreview);
    $$(`[data-close-preview]`).forEach(el => el.addEventListener("click", closePreview));

    $(`[data-open-versions]`).addEventListener("click", openVersions);
    $(`[data-create-version]`).addEventListener("click", () => createVersion("Version manuelle"));
    $(`[data-manual-version]`).addEventListener("click", () => createVersion("Version manuelle"));
    $$(`[data-close-versions]`).forEach(el => el.addEventListener("click", closeVersions));
    $(`[data-version-list]`).addEventListener("click", event => {
      const restore = event.target.closest(`[data-restore-version]`);
      const del = event.target.closest(`[data-delete-version]`);
      if (restore) restoreVersion(restore.dataset.restoreVersion);
      if (del && window.confirm("Supprimer cette version de l’historique ?")) deleteVersion(del.dataset.deleteVersion).then(renderVersions);
    });

    $(`[data-open-trash]`).addEventListener("click", openTrash);
    $$(`[data-close-trash]`).forEach(el => el.addEventListener("click", closeTrash));
    $(`[data-trash-list]`).addEventListener("click", event => {
      const restore = event.target.closest(`[data-restore-trash]`);
      const del = event.target.closest(`[data-delete-trash]`);
      if (restore) restoreTrash(restore.dataset.restoreTrash);
      if (del) permanentlyDeleteTrash(del.dataset.deleteTrash);
    });

    $(`[data-backup-library]`).addEventListener("click", backupLibrary);
    $(`[data-theme-toggle]`).addEventListener("click", toggleTheme);

    window.addEventListener("philosophal:documentloaded", () => syncDocumentUi());
    window.addEventListener("philosophal:documentsaved", () => {
      renderTabs();
      autoVersionIfNeeded().catch(() => {});
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(`[data-blocks-trigger], [data-blocks-popover]`)) closeBlocksPopover();
      if (!event.target.closest(`[data-symbols], [data-symbols-popover]`)) closeSymbols();
    });

    // Raccourcis avancés capturés avant le gestionnaire historique.
    window.addEventListener("keydown", event => {
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      const targetInEditor = editor.contains(document.activeElement) || document.activeElement === editor;

      if (mod && event.shiftKey && key === "s") {
        event.preventDefault(); event.stopImmediatePropagation();
        const pop = $(`[data-export-popover]`);
        pop.hidden = false;
        $(`[data-export-trigger]`).setAttribute("aria-expanded", "true");
        return;
      }
      if (mod && key === "f") {
        event.preventDefault(); event.stopImmediatePropagation(); openSearch(false); return;
      }
      if (mod && key === "h") {
        event.preventDefault(); event.stopImmediatePropagation(); openSearch(true); return;
      }
      if (mod && key === "k" && targetInEditor) {
        event.preventDefault(); event.stopImmediatePropagation();
        API.saveSelection(); $(`[data-link]`).click(); return;
      }
      if (mod && ["1","2","3"].includes(event.key) && targetInEditor) {
        event.preventDefault(); event.stopImmediatePropagation(); API.exec("formatBlock", `h${event.key}`); return;
      }
      if (event.key === "Tab" && targetInEditor && !document.activeElement.closest?.("table")) {
        event.preventDefault(); event.stopImmediatePropagation(); API.exec(event.shiftKey ? "outdent" : "indent"); return;
      }

      const palette = $(`[data-command-palette]`);
      if (!palette.hidden) {
        if (event.key === "ArrowDown") { event.preventDefault(); adv.commandIndex = Math.min(adv.commandMatches.length - 1, adv.commandIndex + 1); renderCommandPalette($(`[data-command-query]`).value); }
        if (event.key === "ArrowUp") { event.preventDefault(); adv.commandIndex = Math.max(0, adv.commandIndex - 1); renderCommandPalette($(`[data-command-query]`).value); }
        if (event.key === "Enter" && targetInEditor) { event.preventDefault(); const cmd = adv.commandMatches[adv.commandIndex]; if (cmd) runSlashCommand(cmd.id); }
        if (event.key === "Escape") closeCommandPalette();
      }
      if (event.key === "Escape") {
        closePreview(); closeVersions(); closeTrash(); closeTemplateModal(); closeBlocksPopover(); closeSymbols();
      }
    }, true);

    window.addEventListener("resize", () => { closeBlocksPopover(); closeSymbols(); });
  }

  async function initializeAdvanced() {
    adv.settings = readJson(SETTINGS_KEY, {});
    adv.tabs = readJson(TABS_KEY, []);
    if (!Array.isArray(adv.tabs)) adv.tabs = [];
    await metaInit();
    renderTemplates();
    renderSymbols();
    initTheme();
    bindEvents();
    await updateTrashCount();

    // Le moteur principal charge IndexedDB de façon asynchrone : on synchronise dès que le premier document est prêt.
    const syncWhenReady = (attempt = 0) => {
      if (API.state.activeId && API.state.current) {
        syncDocumentUi();
        return;
      }
      if (attempt < 40) setTimeout(() => syncWhenReady(attempt + 1), 75);
    };
    syncWhenReady();
  }

  initializeAdvanced().catch(() => API.toast("Certaines fonctions avancées n’ont pas pu être initialisées."));
})();

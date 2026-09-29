(() => {
  "use strict";
  const API = window.PhilosophalEditor;
  if (!API) return;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const editor = API.editor;
  const META_KEY = "philosophal-editor-doc-meta-v3";
  const STYLES_KEY = "philosophal-editor-custom-styles-v3";
  const FAV_KEY = "philosophal-editor-favorites-v3";
  const ACTIVITY_KEY = "philosophal-editor-activity-v3";
  const EXPORT_KEY = "philosophal-editor-export-v3";
  const UI_KEY = "philosophal-editor-ui-v3";
  const STATUS = { draft: "Brouillon", review: "À relire", final: "Final", archive: "Archive" };
  const TYPES = { note: "Note", course: "Cours", reading: "Fiche de lecture", author: "Fiche auteur", essay: "Dissertation", article: "Article", research: "Recherche" };
  let metaAll = readJson(META_KEY, {});
  let customStyles = readJson(STYLES_KEY, defaultStyles());
  let favorites = readJson(FAV_KEY, ["h2", "bold", "highlight", "definition", "remember"]);
  let activity = readJson(ACTIVITY_KEY, {});
  let exportSettings = readJson(EXPORT_KEY, { pageSize: "A4", margin: 20, header: "", footer: "", pageNumbers: true, cover: false, toc: false });
  let sourceObjectUrl = "";
  let revisionCards = [];
  let revisionIndex = 0;
  let inspectorTab = "info";
  let lastActivityWrite = 0;

  function readJson(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (_) { return fallback; } }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function esc(v = "") { return API.esc ? API.esc(v) : String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function normalize(v = "") { return String(v).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }
  function stripHtml(html = "") { const d = document.createElement("div"); d.innerHTML = html; return (d.innerText || d.textContent || "").replace(/\s+/g, " ").trim(); }
  function words(text = "") { const t = String(text).replace(/\s+/g, " ").trim(); return t ? t.split(" ").length : 0; }
  function currentId() { return API.state.activeId || API.state.current?.id || ""; }
  function defaultMeta() { return { status: "draft", type: "note", author: "", subject: "", semester: "", tags: [], privateNotes: "", comments: [], source: { kind: "url", url: "", text: "", title: "" } }; }
  function getMeta(id = currentId()) { const base = defaultMeta(); const own = metaAll[id] || {}; return { ...base, ...own, tags: Array.isArray(own.tags) ? own.tags : [], comments: Array.isArray(own.comments) ? own.comments : [], source: { ...base.source, ...(own.source || {}) } }; }
  function setMeta(patch, id = currentId()) { if (!id) return; metaAll[id] = { ...getMeta(id), ...patch }; writeJson(META_KEY, metaAll); decorateLibrary(); renderInspector(); }
  function updateMetaNested(key, patch, id = currentId()) { const m = getMeta(id); setMeta({ [key]: { ...(m[key] || {}), ...patch } }, id); }
  function toast(msg) { API.toast(msg); }
  function appPath(path) {
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const localMain = localHost && /^\/main(?:\/|$)/.test(window.location.pathname);
    return `${localMain ? "/main" : ""}${path}`;
  }
  function goApp(path) { window.location.assign(appPath(path)); }
  function closeV3Overlays(except = "") { if (except !== "inspector") closeInspector(); if (except !== "source") closeSource(); }

  function defaultStyles() {
    return [
      { id: "concept", name: "Concept important", color: "#5f4776", background: "#f0e8f7", size: "17", font: "Georgia", bold: true, italic: false, underline: false },
      { id: "citation", name: "Citation personnelle", color: "#51495a", background: "#faf8fb", size: "16", font: "Georgia", bold: false, italic: true, underline: false },
      { id: "reference", name: "Référence discrète", color: "#746b78", background: "#ffffff", size: "13", font: "Arial", bold: false, italic: false, underline: false }
    ];
  }

  function injectUI() {
    const top = $(".editor-topbar-actions");
    if (top && !$("[data-v3-global]")) top.insertAdjacentHTML("afterbegin", `
      <button class="editor-quiet-button v3-top-action" type="button" data-v3-global title="Recherche dans tous les documents (Ctrl+Maj+F)">⌕ <span>Tout rechercher</span></button>
      <button class="editor-quiet-button v3-top-action" type="button" data-v3-revise>◎ <span>Réviser</span></button>
      <button class="editor-quiet-button v3-top-action" type="button" data-v3-inspector>☷ <span>Infos</span></button>
      <button class="editor-quiet-button v3-top-action" type="button" data-v3-source>◫ <span>Source</span></button>`);

    const toolbar = $("[data-toolbar]");
    if (toolbar && !$("[data-v3-style-select]")) {
      const originalGroups = [...toolbar.children];
      const blockGroup = $("[data-blocks-trigger]", toolbar)?.closest(".editor-toolbar-group") || null;
      const primaryRow = document.createElement("div");
      primaryRow.className = "v3-toolbar-row v3-toolbar-row-primary";
      const advancedRow = document.createElement("div");
      advancedRow.className = "v3-toolbar-row v3-toolbar-row-advanced";

      originalGroups.forEach(group => {
        if (group === blockGroup) advancedRow.appendChild(group);
        else primaryRow.appendChild(group);
      });

      const toggle = document.createElement("div");
      toggle.className = "v3-toolbar-group v3-toolbar-toggle-group";
      toggle.innerHTML = `<button type="button" class="v3-tool-chip v3-tool-chip-toggle" data-v3-toggle-toolbar aria-expanded="true" title="Afficher ou masquer la barre d’outils avancée"><span aria-hidden="true">▾</span><span>Outils −</span></button>`;
      const firstPrimaryGroup = primaryRow.querySelector(".editor-toolbar-group");
      if (firstPrimaryGroup) firstPrimaryGroup.after(toggle);
      else primaryRow.appendChild(toggle);

      advancedRow.insertAdjacentHTML("beforeend", `
        <div class="v3-toolbar-group v3-toolbar-group-main">
          <div class="v3-style-select-wrap">
            <select data-v3-style-select title="Styles personnalisés"><option value="">Style perso…</option></select>
          </div>
          <button type="button" class="v3-tool-chip" data-v3-manage-styles title="Créer ou modifier des styles"><span aria-hidden="true">✦</span><span>Styles</span></button>
          <button type="button" class="v3-tool-chip" data-v3-comment title="Commentaire personnel non exporté"><span aria-hidden="true">💬</span><span>Commenter</span></button>
          <button type="button" class="v3-tool-chip" data-v3-citation title="Citation avec source"><span aria-hidden="true">❝</span><span>Citation</span></button>
          <button type="button" class="v3-tool-chip" data-v3-toc title="Insérer / actualiser une table des matières"><span aria-hidden="true">☰</span><span>Sommaire</span></button>
          <button type="button" class="v3-tool-chip v3-tool-chip-accent" data-v3-export title="Mise en page et export avancé"><span aria-hidden="true">▣</span><span>Mise en page</span></button>
        </div>
        <div class="v3-toolbar-group v3-toolbar-group-favorites"><div class="v3-favorites" data-v3-favorites></div><button type="button" class="v3-tool-icon" data-v3-manage-favorites title="Choisir les favoris" aria-label="Choisir les favoris">★</button></div>`);

      toolbar.classList.add("v3-toolbar-structured");
      toolbar.append(primaryRow, advancedRow);
    }

    const libTools = $(".editor-library-tools");
    if (libTools && !$("[data-v3-library-view]")) libTools.insertAdjacentHTML("beforeend", `<button type="button" class="v3-library-view" data-v3-library-view>▦ Cartes</button>`);
    const ui = readJson(UI_KEY, {});
    if (ui.libraryView === "cards") document.body.classList.add("v3-library-cards");
    const compactByDefault = !("toolbarCollapsed" in ui) && window.matchMedia("(max-width: 760px)").matches;
    if (ui.toolbarCollapsed || compactByDefault) document.body.classList.add("v3-toolbar-collapsed");
    updateLibraryViewButton();
    updateToolbarToggleButton();

    const statusSpacer = $(".editor-status-spacer");
    if (statusSpacer && !$("[data-v3-today]")) statusSpacer.insertAdjacentHTML("beforebegin", `<button type="button" class="v3-today" data-v3-today title="Historique d’écriture du jour">Aujourd’hui · 0 mot</button>`);

    document.body.insertAdjacentHTML("beforeend", inspectorHtml() + sourceHtml() + modalsHtml());
    renderStyleSelect(); renderFavorites();
  }

  function inspectorHtml() { return `
    <aside class="v3-inspector" data-v3-inspector-panel hidden aria-label="Informations du document">
      <div class="v3-inspector-head"><div><span>Document</span><strong data-v3-inspector-title>Informations</strong></div><button type="button" data-v3-close-inspector>×</button></div>
      <div class="v3-inspector-tabs"><button data-v3-tab="info" class="is-active">Infos</button><button data-v3-tab="comments">Commentaires</button><button data-v3-tab="links">Liens</button><button data-v3-tab="context">Contexte</button></div>
      <div class="v3-inspector-body">
        <section class="v3-inspector-pane" data-v3-pane="info"></section>
        <section class="v3-inspector-pane" data-v3-pane="comments" hidden></section>
        <section class="v3-inspector-pane" data-v3-pane="links" hidden></section>
        <section class="v3-inspector-pane" data-v3-pane="context" hidden></section>
      </div>
    </aside>`; }

  function sourceHtml() { return `
    <aside class="v3-source-panel" data-v3-source-panel hidden aria-label="Source de travail">
      <div class="v3-source-head"><div><span>Double panneau</span><strong>Source / lecture</strong></div><button type="button" data-v3-close-source>×</button></div>
      <div class="v3-source-controls"><select data-v3-source-kind><option value="url">URL / PDF / vidéo</option><option value="text">Texte / notes</option></select><input data-v3-source-url type="text" placeholder="Coller une URL…"><button type="button" data-v3-load-source>Ouvrir</button></div>
      <div class="v3-source-file"><button type="button" data-v3-pick-source>Ouvrir un fichier PDF / texte</button><input type="file" data-v3-source-file accept=".pdf,.txt,.md,.markdown,.html,.htm" hidden><button type="button" data-v3-open-external>Nouvel onglet ↗</button></div>
      <div class="v3-source-note">Les URL et textes saisis sont mémorisés avec ce document. Un fichier local n’est conservé que pendant la session du navigateur.</div>
      <div class="v3-source-stage" data-v3-source-stage><div class="v3-source-empty">Ajoute une source pour lire à droite tout en écrivant à gauche.</div></div>
    </aside>`; }

  function modal(id, eyebrow, title, body, actions = "", small = false) { return `<div class="v3-modal" data-v3-modal="${id}" hidden><button class="v3-modal-backdrop" type="button" data-v3-close="${id}"></button><section class="v3-modal-card ${small ? "is-small" : ""}"><header class="v3-modal-head"><div><span>${eyebrow}</span><h2>${title}</h2></div><button type="button" data-v3-close="${id}">×</button></header><div class="v3-modal-body">${body}</div>${actions ? `<footer class="v3-modal-actions">${actions}</footer>` : ""}</section></div>`; }

  function modalsHtml() {
    const global = modal("global", "Bibliothèque locale", "Rechercher partout", `<div class="v3-global-search-row"><input data-v3-global-q type="search" placeholder="Mot, auteur, concept…" autocomplete="off"><select data-v3-global-status><option value="">Tous les statuts</option>${Object.entries(STATUS).map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}</select><select data-v3-global-type><option value="">Tous les types</option>${Object.entries(TYPES).map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}</select></div><p class="v3-search-summary" data-v3-global-summary></p><div class="v3-search-results" data-v3-global-results></div>`);
    const comment = modal("comment", "Annotation personnelle", "Ajouter un commentaire", `<p class="v3-search-summary">Le commentaire reste dans ton navigateur et n’est pas inclus dans les exports.</p><div class="v3-field"><span>Passage</span><textarea data-v3-comment-excerpt readonly></textarea></div><div class="v3-field"><span>Commentaire</span><textarea data-v3-comment-note placeholder="À développer, vérifier la référence, faire un lien avec…"></textarea></div>`, `<button class="v3-secondary" data-v3-close="comment">Annuler</button><button class="v3-primary" data-v3-save-comment>Ajouter</button>`, true);
    const cite = modal("citation", "Référence", "Citation sourcée", `<div class="v3-field"><span>Citation</span><textarea data-v3-cite-text></textarea></div><div class="v3-property-grid"><label class="v3-field"><span>Auteur</span><input data-v3-cite-author></label><label class="v3-field"><span>Œuvre</span><input data-v3-cite-work></label><label class="v3-field"><span>Page / section</span><input data-v3-cite-page></label><label class="v3-field"><span>Année</span><input data-v3-cite-year></label></div>`, `<button class="v3-secondary" data-v3-close="citation">Annuler</button><button class="v3-primary" data-v3-save-citation>Insérer</button>`, true);
    const revise = modal("revision", "Rappel actif", "Mode révision", `<div data-v3-revision-content></div>`);
    const styles = modal("styles", "Mise en forme", "Styles personnalisés", `<div class="v3-style-builder"><label class="v3-field v3-field-wide"><span>Nom du style</span><input data-v3-style-name placeholder="Ex. Concept essentiel"></label><label class="v3-field"><span>Police</span><select data-v3-style-font><option>Georgia</option><option>Arial</option><option>Calibri</option><option>Times New Roman</option><option>Garamond</option><option>Verdana</option><option>Trebuchet MS</option><option>Courier New</option></select></label><label class="v3-field"><span>Taille</span><input data-v3-style-size type="number" min="9" max="48" value="16"></label><label class="v3-field"><span>Couleur</span><input data-v3-style-color type="color" value="#29262d"></label><label class="v3-field"><span>Fond</span><input data-v3-style-bg type="color" value="#ffffff"></label><div class="v3-checks v3-field-wide"><label><input type="checkbox" data-v3-style-bold> Gras</label><label><input type="checkbox" data-v3-style-italic> Italique</label><label><input type="checkbox" data-v3-style-underline> Souligné</label></div></div><button type="button" class="v3-primary" data-v3-add-style>＋ Enregistrer ce style</button><div class="v3-style-list" data-v3-style-list></div>`);
    const favoritesModal = modal("favorites", "Barre d’outils", "Mes favoris", `<p class="v3-search-summary">Choisis les actions que tu veux garder accessibles en permanence.</p><div class="v3-style-list" data-v3-favorite-options></div>`, `<button class="v3-primary" data-v3-close="favorites">Terminer</button>`, true);
    const exp = modal("export", "Document final", "Mise en page & export avancé", `<div class="v3-export-grid"><label class="v3-field"><span>Format de page</span><select data-v3-export-size><option value="A4">A4</option><option value="Letter">Letter</option></select></label><label class="v3-field"><span>Marges (mm)</span><input data-v3-export-margin type="number" min="8" max="40"></label><label class="v3-field v3-field-wide"><span>En-tête</span><input data-v3-export-header placeholder="Ex. Philosophal — Psychologie sociale"></label><label class="v3-field v3-field-wide"><span>Pied de page</span><input data-v3-export-footer placeholder="Ex. Notes personnelles"></label><div class="v3-checks v3-field-wide"><label><input type="checkbox" data-v3-export-pages> Numéros de page</label><label><input type="checkbox" data-v3-export-cover> Page de garde</label><label><input type="checkbox" data-v3-export-toc> Table des matières automatique</label></div></div><p class="v3-export-help">Ces réglages sont utilisés par l’export PDF avancé et par l’export Word. La numérotation PDF dépend des capacités d’impression du navigateur.</p>`, `<button class="v3-secondary" data-v3-export-html>HTML avancé</button><button class="v3-secondary" data-v3-export-pdf>PDF avancé</button><button class="v3-primary" data-v3-export-word>Word (.docx)</button>`);
    const activityModal = modal("activity", "Écriture", "Historique du jour", `<div data-v3-activity-summary></div><div class="v3-activity-list" data-v3-activity-list></div>`, "", true);
    return global + comment + cite + revise + styles + favoritesModal + exp + activityModal;
  }

  function openModal(id) { const el = $(`[data-v3-modal="${id}"]`); if (el) el.hidden = false; }
  function closeModal(id) { const el = $(`[data-v3-modal="${id}"]`); if (el) el.hidden = true; }

  function renderInspector() {
    const id = currentId(); if (!id) return;
    const m = getMeta(id); const title = API.state.current?.title || "Document";
    $(`[data-v3-inspector-title]`).textContent = title;
    $$(`[data-v3-tab]`).forEach(b => b.classList.toggle("is-active", b.dataset.v3Tab === inspectorTab));
    $$(`[data-v3-pane]`).forEach(p => p.hidden = p.dataset.v3Pane !== inspectorTab);
    const info = $(`[data-v3-pane="info"]`);
    info.innerHTML = `<div class="v3-property-grid"><label class="v3-field"><span>Statut</span><select data-v3-prop="status">${Object.entries(STATUS).map(([v,l])=>`<option value="${v}" ${m.status===v?"selected":""}>${l}</option>`).join("")}</select></label><label class="v3-field"><span>Type</span><select data-v3-prop="type">${Object.entries(TYPES).map(([v,l])=>`<option value="${v}" ${m.type===v?"selected":""}>${l}</option>`).join("")}</select></label></div><label class="v3-field"><span>Auteur / figure</span><input data-v3-prop="author" value="${esc(m.author)}" placeholder="Kant, Augustin…"></label><div class="v3-property-grid"><label class="v3-field"><span>Matière</span><input data-v3-prop="subject" value="${esc(m.subject)}" placeholder="Philosophie"></label><label class="v3-field"><span>Semestre / niveau</span><input data-v3-prop="semester" value="${esc(m.semester)}" placeholder="L2 · S4"></label></div><label class="v3-field"><span>Tags</span><input data-v3-tags-input placeholder="liberté, Kant, cours…"><div class="v3-tags">${m.tags.map(t=>`<span class="v3-tag">${esc(t)} <button data-v3-remove-tag="${esc(t)}">×</button></span>`).join("")}</div></label><label class="v3-field"><span>Notes privées</span><textarea data-v3-prop="privateNotes" placeholder="Remarques de travail qui ne sont jamais exportées…">${esc(m.privateNotes)}</textarea></label>`;
    renderComments(); renderBacklinks(); renderContext();
  }

  function renderComments() {
    const pane = $(`[data-v3-pane="comments"]`); if (!pane) return;
    const m = getMeta();
    pane.innerHTML = `<button type="button" class="v3-primary" data-v3-new-comment>＋ Commenter la sélection</button><div class="v3-section-title"><strong>${m.comments.length} commentaire${m.comments.length>1?"s":""}</strong><small>non exportés</small></div>${m.comments.length ? m.comments.map(c=>`<article class="v3-comment-card ${c.resolved?"is-resolved":""}" data-v3-comment-card="${esc(c.id)}"><strong>« ${esc((c.excerpt||"").slice(0,100))}${(c.excerpt||"").length>100?"…":""} »</strong><p>${esc(c.note||"")}</p><small>${new Date(c.createdAt).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"})}</small><div class="v3-comment-actions"><button data-v3-jump-comment="${esc(c.id)}">Voir</button><button data-v3-resolve-comment="${esc(c.id)}">${c.resolved?"Rouvrir":"Résolu"}</button><button data-v3-delete-comment="${esc(c.id)}">Supprimer</button></div></article>`).join("") : `<p class="v3-search-summary">Sélectionne un passage puis utilise « Commenter ».</p>`}`;
  }

  async function renderBacklinks() {
    const pane = $(`[data-v3-pane="links"]`); if (!pane) return;
    const title = API.state.current?.title || ""; const target = normalize(title);
    const docs = await API.getAllDocuments(); const links = [];
    docs.filter(d=>d.id!==currentId()).forEach(d=>{
      const box=document.createElement("div"); box.innerHTML=d.html||"";
      const linked=[...box.querySelectorAll(".ph-wikilink[data-wiki-title]")].some(a=>normalize(a.dataset.wikiTitle)===target);
      const raw=(box.innerText||"");
      if (linked || normalize(raw).includes(normalize(`[[${title}]]`))) links.push(d);
    });
    const outgoing=[...editor.querySelectorAll(".ph-wikilink[data-wiki-title]")].map(a=>a.dataset.wikiTitle).filter(Boolean);
    pane.innerHTML = `<div class="v3-section-title"><strong>Liens sortants</strong><small>${outgoing.length}</small></div>${outgoing.length?outgoing.map(t=>`<button class="v3-backlink" data-v3-open-wiki="${esc(t)}"><strong>→ ${esc(t)}</strong><small>Ouvrir le document lié</small></button>`).join(""):`<p class="v3-search-summary">Écris <strong>[[Titre du document]]</strong> pour créer un lien.</p>`}<div class="v3-section-title"><strong>Backlinks</strong><small>${links.length}</small></div>${links.length?links.map(d=>`<button class="v3-backlink" data-v3-open-doc="${esc(d.id)}"><strong>← ${esc(d.title)}</strong><small>Ce document renvoie ici</small></button>`).join(""):`<p class="v3-search-summary">Aucun autre document ne renvoie encore vers celui-ci.</p>`}`;
  }

  function renderContext() {
    const pane = $(`[data-v3-pane="context"]`); if (!pane) return;
    const resources = window.FV_MEDIATHEQUE_DATA?.resources || [];
    const hay = normalize(`${API.state.current?.title || ""} ${editor.innerText || ""} ${getMeta().author || ""} ${(getMeta().tags || []).join(" ")}`);
    const peopleMap = new Map();
    resources.forEach(r => {
      const names = [...(Array.isArray(r.people) ? r.people : []), r.figure].filter(Boolean);
      names.forEach(name => { const key = normalize(name); if (key.length < 4) return; if (!peopleMap.has(key)) peopleMap.set(key, { name, resources: [] }); peopleMap.get(key).resources.push(r); });
    });
    const matches = [...peopleMap.values()].filter(x => hay.includes(normalize(x.name))).sort((a,b)=>b.resources.length-a.resources.length).slice(0,6);
    if (!matches.length) { pane.innerHTML = `<p class="v3-search-summary">Le contexte apparaîtra ici lorsque le document mentionnera une figure déjà présente dans la médiathèque (Kant, Saint Augustin, Dante, etc.).</p>`; return; }
    pane.innerHTML = `<p class="v3-search-summary">Ressources de la médiathèque détectées à partir du contenu du document.</p>` + matches.map(x => `<section class="v3-context-person"><header><strong>${esc(x.name)}</strong><small>${x.resources.length} ressource${x.resources.length>1?"s":""}</small></header>${x.resources.slice(0,6).map(r => r.url ? `<a class="v3-context-resource" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="v3-context-kind">${esc(r.kind || r.format || "ressource")}</span>${esc(r.title || r.subtitle || "Ressource")}</a>` : `<div class="v3-context-resource"><span class="v3-context-kind">${esc(r.kind || r.format || "ressource")}</span>${esc(r.title || r.subtitle || "Ressource")}</div>`).join("")}</section>`).join("");
  }

  function openInspector(tab = "info") { closeSource(); inspectorTab = tab; renderInspector(); $(`[data-v3-inspector-panel]`).hidden=false; }
  function closeInspector() { const p=$(`[data-v3-inspector-panel]`); if(p)p.hidden=true; }

  function addTag(raw) { const tag=String(raw||"").trim().replace(/^#/,''); if(!tag)return; const m=getMeta(); if(!m.tags.some(t=>normalize(t)===normalize(tag))) setMeta({tags:[...m.tags,tag]}); }

  function processWikiAtCaret() {
    const sel=window.getSelection(); if(!sel.rangeCount||!sel.isCollapsed)return false; const node=sel.anchorNode; if(!node||node.nodeType!==Node.TEXT_NODE||!editor.contains(node))return false;
    const offset=sel.anchorOffset; const before=node.nodeValue.slice(0,offset); const match=before.match(/\[\[([^\[\]]{1,100})\]\]$/); if(!match)return false;
    const title=match[1].trim(); if(!title)return false; const start=offset-match[0].length; const range=document.createRange(); range.setStart(node,start); range.setEnd(node,offset); range.deleteContents();
    const a=document.createElement("a"); a.href="#"; a.className="ph-wikilink"; a.dataset.wikiTitle=title; a.textContent=title; range.insertNode(a); const space=document.createTextNode("\u00a0"); a.after(space); const caret=document.createRange(); caret.setStartAfter(space); caret.collapse(true); sel.removeAllRanges(); sel.addRange(caret); API.scheduleSave(); renderBacklinks(); return true;
  }

  async function openWiki(title) { const docs=await API.getAllDocuments(); const doc=docs.find(d=>normalize(d.title)===normalize(title)); if(doc){await API.flushSave(); API.loadDocument(doc); return;} if(confirm(`Aucun document « ${title} ». Le créer maintenant ?`)){ await API.createDocument({title,html:`<h1>${esc(title)}</h1><p><br></p>`,selectTitle:false}); setMeta({tags:["wiki"]}); } }

  function selectionInfo() { const sel=window.getSelection(); if(!sel.rangeCount||sel.isCollapsed||!editor.contains(sel.anchorNode))return null; return { sel, range:sel.getRangeAt(0).cloneRange(), text:sel.toString().trim() }; }
  let pendingCommentRange=null;
  function openCommentModal() { const s=selectionInfo(); if(!s||!s.text){toast("Sélectionne d’abord un passage à commenter.");return;} pendingCommentRange=s.range; $(`[data-v3-comment-excerpt]`).value=s.text; $(`[data-v3-comment-note]`).value=""; openModal("comment"); setTimeout(()=> $(`[data-v3-comment-note]`).focus(),30); }
  function saveComment() { if(!pendingCommentRange)return; const note=$(`[data-v3-comment-note]`).value.trim(); if(!note){toast("Écris un commentaire.");return;} const id=`com-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; const span=document.createElement("span"); span.className="ph-comment-anchor"; span.dataset.commentId=id; try{pendingCommentRange.surroundContents(span);}catch(_){ const frag=pendingCommentRange.extractContents(); span.append(frag); pendingCommentRange.insertNode(span); } const m=getMeta(); setMeta({comments:[...m.comments,{id,excerpt:span.innerText||span.textContent||"",note,createdAt:new Date().toISOString(),resolved:false}]}); API.scheduleSave(); closeModal("comment"); pendingCommentRange=null; openInspector("comments"); }
  function unwrap(el){const p=el?.parentNode;if(!p)return;while(el.firstChild)p.insertBefore(el.firstChild,el);p.removeChild(el);p.normalize();}
  function jumpComment(id){const el=editor.querySelector(`[data-comment-id="${CSS.escape(id)}"]`);if(!el){toast("Le passage commenté n’existe plus dans le texte.");return;}el.classList.add("is-active");el.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>el.classList.remove("is-active"),1800);}
  function toggleComment(id){const m=getMeta();setMeta({comments:m.comments.map(c=>c.id===id?{...c,resolved:!c.resolved}:c)});}
  function deleteComment(id){const m=getMeta(); const el=editor.querySelector(`[data-comment-id="${CSS.escape(id)}"]`); if(el)unwrap(el);setMeta({comments:m.comments.filter(c=>c.id!==id)});API.scheduleSave();}

  let pendingCitationRange=null;
  function openCitationModal(){const s=selectionInfo();pendingCitationRange=s?.range||null;$(`[data-v3-cite-text]`).value=s?.text||"";["author","work","page","year"].forEach(k=>$(`[data-v3-cite-${k}]`).value="");openModal("citation");}
  function saveCitation(){const text=$(`[data-v3-cite-text]`).value.trim(),author=$(`[data-v3-cite-author]`).value.trim(),work=$(`[data-v3-cite-work]`).value.trim(),page=$(`[data-v3-cite-page]`).value.trim(),year=$(`[data-v3-cite-year]`).value.trim();if(!text){toast("La citation est vide.");return;}const q=document.createElement("blockquote");q.className="ph-smart-citation";const p=document.createElement("p");p.textContent=`« ${text.replace(/^«|»$/g,"").trim()} »`;q.append(p);const f=document.createElement("footer");f.innerHTML=`${esc(author||"Auteur")}${work?`, <cite>${esc(work)}</cite>`:""}${year?` (${esc(year)})`:""}${page?`, ${esc(page)}`:""}`;q.append(f);if(pendingCitationRange){pendingCitationRange.deleteContents();pendingCitationRange.insertNode(q);}else{editor.append(q);}q.after(document.createElement("p"));API.scheduleSave();closeModal("citation");pendingCitationRange=null;}

  function ensureHeadingIds(){const used=new Set();$$('h1,h2,h3',editor).forEach((h,i)=>{let base=API.slug(h.textContent||`section-${i+1}`)||`section-${i+1}`,id=base,n=2;while(used.has(id)||($(`#${CSS.escape(id)}`,editor)&&h.id!==id))id=`${base}-${n++}`;used.add(id);h.id=id;});}
  function tocHtml(){ensureHeadingIds();const hs=$$('h1,h2,h3',editor).filter(h=>!h.closest('.ph-toc'));if(!hs.length)return"";return `<strong class="ph-toc-title">Table des matières</strong><ol>${hs.map(h=>`<li data-level="${h.tagName.slice(1)}"><a href="#${esc(h.id)}">${esc((h.textContent||"Sans titre").trim())}</a></li>`).join("")}</ol>`;}
  function updateTocs(){const html=tocHtml();$$('.ph-toc',editor).forEach(t=>t.innerHTML=html);}
  function insertToc(){const html=tocHtml();if(!html){toast("Ajoute d’abord des titres H1, H2 ou H3.");return;}const existing=$('.ph-toc',editor);if(existing){existing.innerHTML=html;existing.scrollIntoView({behavior:"smooth",block:"center"});}else{const nav=document.createElement('nav');nav.className='ph-toc';nav.contentEditable='false';nav.innerHTML=html;const first=editor.firstElementChild;if(first)first.after(nav);else editor.append(nav);}API.scheduleSave();toast("Table des matières actualisée.");}

  function generateBibliography(){
    const entries=[];
    $$('.ph-smart-citation footer',editor).forEach(f=>{const t=(f.innerText||f.textContent||'').replace(/^—\s*/,'').trim();if(t)entries.push(t);});
    $$('.ph-reference',editor).forEach(b=>{const clone=b.cloneNode(true);clone.querySelector('.ph-block-label')?.remove();const t=(clone.innerText||clone.textContent||'').trim();if(t)entries.push(t);});
    const unique=[...new Map(entries.map(x=>[normalize(x),x])).values()].sort((a,b)=>a.localeCompare(b,'fr'));
    if(!unique.length){toast('Ajoute d’abord des citations sourcées ou des blocs « Référence ».');return;}
    let section=$('.ph-bibliography',editor);
    if(!section){section=document.createElement('section');section.className='ph-bibliography';editor.append(section);}
    section.innerHTML=`<h2>Bibliographie</h2><ul>${unique.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    API.scheduleSave();section.scrollIntoView({behavior:'smooth',block:'center'});toast('Bibliographie générée.');
  }

  function renderStyleSelect(){const s=$(`[data-v3-style-select]`);if(!s)return;s.innerHTML=`<option value="">Style perso…</option>`+customStyles.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("");}
  function applyStyle(id){const st=customStyles.find(s=>s.id===id);if(!st)return;const s=selectionInfo();if(!s){toast("Sélectionne du texte pour appliquer le style.");return;}const span=document.createElement('span');span.dataset.customStyle=id;span.style.fontFamily=st.font||'';span.style.fontSize=st.size?`${st.size}px`:'';span.style.color=st.color||'';span.style.backgroundColor=st.background==="#ffffff"?'':(st.background||'');span.style.fontWeight=st.bold?'700':'';span.style.fontStyle=st.italic?'italic':'';span.style.textDecoration=st.underline?'underline':'';try{s.range.surroundContents(span);}catch(_){const frag=s.range.extractContents();span.append(frag);s.range.insertNode(span);}API.scheduleSave();}
  function renderStylesModal(){const list=$(`[data-v3-style-list]`);list.innerHTML=customStyles.map(s=>`<div class="v3-style-row"><span class="v3-style-preview" style="font-family:${esc(s.font)};font-size:${Number(s.size)||16}px;color:${esc(s.color)};background:${esc(s.background)};font-weight:${s.bold?700:400};font-style:${s.italic?'italic':'normal'};text-decoration:${s.underline?'underline':'none'}">${esc(s.name)}</span><button class="v3-secondary" data-v3-apply-style="${esc(s.id)}">Appliquer</button><button class="v3-secondary" data-v3-delete-style="${esc(s.id)}">Supprimer</button></div>`).join('');}
  function addCustomStyle(){const name=$(`[data-v3-style-name]`).value.trim();if(!name){toast("Donne un nom au style.");return;}const st={id:`style-${Date.now()}`,name,font:$(`[data-v3-style-font]`).value,size:$(`[data-v3-style-size]`).value,color:$(`[data-v3-style-color]`).value,background:$(`[data-v3-style-bg]`).value,bold:$(`[data-v3-style-bold]`).checked,italic:$(`[data-v3-style-italic]`).checked,underline:$(`[data-v3-style-underline]`).checked};customStyles.push(st);writeJson(STYLES_KEY,customStyles);renderStyleSelect();renderStylesModal();$(`[data-v3-style-name]`).value="";}

  const favoriteActions={h1:{label:'H1',run:()=>API.exec('formatBlock','h1')},h2:{label:'H2',run:()=>API.exec('formatBlock','h2')},bold:{label:'G',run:()=>API.exec('bold')},italic:{label:'I',run:()=>API.exec('italic')},highlight:{label:'▰',run:()=>{API.saveSelection();$(`[data-highlight-color]`)?.click();}},definition:{label:'Déf.',run:()=>clickBlock('definition')},remember:{label:'★',run:()=>clickBlock('remember')},comment:{label:'💬',run:openCommentModal},toc:{label:'Som.',run:insertToc},revision:{label:'Rév.',run:openRevision},wiki:{label:'[[ ]]',run:insertWikiPrompt},bibliography:{label:'Biblio',run:generateBibliography}};
  function clickBlock(kind){const trigger=$(`[data-blocks-trigger]`);trigger?.click();setTimeout(()=>$(`[data-block="${kind}"]`)?.click(),0);}
  function renderFavorites(){const root=$(`[data-v3-favorites]`);if(!root)return;root.innerHTML=favorites.filter(id=>favoriteActions[id]).map(id=>`<button type="button" class="v3-favorite-btn" data-v3-favorite="${id}" title="Favori : ${esc(favoriteActions[id].label)}"><span>${favoriteActions[id].label}</span></button>`).join('');}
  function renderFavoriteOptions(){const root=$(`[data-v3-favorite-options]`);root.innerHTML=Object.entries(favoriteActions).map(([id,a])=>`<label class="v3-style-row"><span>${esc(a.label)}</span><span></span><input type="checkbox" data-v3-fav-check="${id}" ${favorites.includes(id)?'checked':''}></label>`).join('');}
  function insertWikiPrompt(){const title=prompt('Titre du document à lier :');if(!title)return;API.restoreSelection?.();document.execCommand('insertHTML',false,`<a href="#" class="ph-wikilink" data-wiki-title="${esc(title)}">${esc(title)}</a>&nbsp;`);API.scheduleSave();}

  async function globalSearch(){openModal('global');$(`[data-v3-global-q]`).focus();await renderGlobalSearch();}
  function snippet(text,q){if(!q)return text.slice(0,170);const n=normalize(text),k=normalize(q),idx=n.indexOf(k);const start=Math.max(0,idx-65);return text.slice(start,start+190)+(text.length>start+190?'…':'');}
  async function renderGlobalSearch(){const q=$(`[data-v3-global-q]`).value.trim(),status=$(`[data-v3-global-status]`).value,type=$(`[data-v3-global-type]`).value;const docs=await API.getAllDocuments();const nq=normalize(q);const results=docs.map(d=>({doc:d,meta:getMeta(d.id),text:stripHtml(d.html)})).filter(x=>(!status||x.meta.status===status)&&(!type||x.meta.type===type)&&(!nq||[x.doc.title,x.text,x.meta.author,x.meta.subject,x.meta.semester,...x.meta.tags].some(v=>normalize(v).includes(nq)))).slice(0,100);$(`[data-v3-global-summary]`).textContent=`${results.length} document${results.length>1?'s':''} trouvé${results.length>1?'s':''}${q?` pour « ${q} »`:''}.`;$(`[data-v3-global-results]`).innerHTML=results.length?results.map(x=>`<button type="button" class="v3-search-result" data-v3-search-doc="${esc(x.doc.id)}"><div><strong>${esc(x.doc.title)}</strong><div class="v3-result-meta"><span class="v3-chip">${esc(STATUS[x.meta.status]||x.meta.status)}</span><span class="v3-chip">${esc(TYPES[x.meta.type]||x.meta.type)}</span>${x.meta.tags.slice(0,4).map(t=>`<span class="v3-chip">#${esc(t)}</span>`).join('')}</div></div><small>${new Date(x.doc.updatedAt).toLocaleDateString('fr-FR')}</small><p>${esc(snippet(x.text,q))}</p></button>`).join(''):`<p class="v3-search-summary">Aucun résultat. Essaie un autre mot ou enlève un filtre.</p>`;}

  function buildRevisionCards(){const cards=[];$$('.ph-definition,.ph-remember,.ph-author,.ph-problem',editor).forEach(el=>{const label=$('.ph-block-label',el)?.textContent?.trim()||'À retenir';const clone=el.cloneNode(true);$('.ph-block-label',clone)?.remove();const txt=(clone.innerText||clone.textContent||'').trim();if(!txt)return;let question=`Que faut-il retenir de ce bloc « ${label} » ?`;const strong=clone.querySelector('strong')?.textContent?.trim();if(label.toLowerCase().includes('définition')&&strong)question=`Comment définir « ${strong} » ?`;if(label.toLowerCase().includes('auteur')&&strong)question=`Que faut-il savoir sur ${strong} ?`;if(label.toLowerCase().includes('problème'))question='Quel est le problème posé ici ?';cards.push({question,answer:txt});});$$('h2,h3',editor).forEach(h=>{let parts=[],n=h.nextElementSibling;while(n&&!/^H[123]$/.test(n.tagName)){if(!n.classList.contains('ph-toc'))parts.push((n.innerText||'').trim());n=n.nextElementSibling;}const a=parts.filter(Boolean).join(' ').trim();if(a.length>25)cards.push({question:`Que contient la partie « ${(h.textContent||'').trim()} » ?`,answer:a.slice(0,900)});});return cards;}
  function openRevision(){revisionCards=buildRevisionCards();revisionIndex=0;if(!revisionCards.length){toast('Ajoute des définitions, blocs « À retenir » ou titres pour générer des cartes.');return;}openModal('revision');renderRevision(false);}
  function renderRevision(show){const root=$(`[data-v3-revision-content]`),c=revisionCards[revisionIndex];root.innerHTML=`<div class="v3-revision-shell"><div class="v3-revision-progress">Carte ${revisionIndex+1} / ${revisionCards.length}</div><div class="v3-revision-card"><div><h3>${esc(c.question)}</h3>${show?`<div class="v3-revision-answer">${esc(c.answer)}</div>`:''}</div></div><div class="v3-revision-actions">${show?`<button data-v3-revision-prev>← Précédente</button><button data-v3-revision-next>Suivante →</button><button data-v3-revision-shuffle>Mélanger</button>`:`<button data-v3-revision-show>Afficher la réponse</button>`}</div></div>`;}

  function updateLibraryViewButton(){ const b=$(`[data-v3-library-view]`); if(b)b.textContent=document.body.classList.contains("v3-library-cards")?"☷ Liste":"▦ Cartes"; }
  function toggleLibraryView(){ const on=document.body.classList.toggle("v3-library-cards"); const ui=readJson(UI_KEY,{}); ui.libraryView=on?"cards":"list"; writeJson(UI_KEY,ui); updateLibraryViewButton(); }

  function updateToolbarToggleButton(){ const b=$(`[data-v3-toggle-toolbar]`); if(!b) return; const collapsed=document.body.classList.contains('v3-toolbar-collapsed'); b.setAttribute('aria-expanded', collapsed ? 'false' : 'true'); b.classList.toggle('is-collapsed', collapsed); const icon=b.querySelector('span[aria-hidden="true"]'); const label=b.querySelector('span:last-child'); if(icon) icon.textContent = collapsed ? '▸' : '▾'; if(label) label.textContent = collapsed ? 'Outils +' : 'Outils −'; }
  function toggleToolbarRow(){ const collapsed=document.body.classList.toggle('v3-toolbar-collapsed'); const ui=readJson(UI_KEY,{}); ui.toolbarCollapsed=collapsed; writeJson(UI_KEY,ui); updateToolbarToggleButton(); }

  function decorateLibrary(){const m=metaAll;$$('[data-open-document]',API.documentList).forEach(btn=>{const id=btn.dataset.openDocument,meta=m[id];if(!meta)return;const i=btn.querySelector('i');if(i)i.textContent=`${STATUS[meta.status]||'Brouillon'} · ${TYPES[meta.type]||'Note'}`;});}

  function openSource(){closeInspector();const m=getMeta(),s=m.source;$(`[data-v3-source-panel]`).hidden=false;document.body.classList.add('v3-source-open');$(`[data-v3-source-kind]`).value=s.kind||'url';$(`[data-v3-source-url]`).value=s.url||'';renderSource();}
  function closeSource(){const p=$(`[data-v3-source-panel]`);if(p)p.hidden=true;document.body.classList.remove('v3-source-open');}
  function youtubeEmbed(url){try{const u=new URL(url);let id='';if(u.hostname.includes('youtu.be'))id=u.pathname.slice(1);else if(u.hostname.includes('youtube.com'))id=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();return id?`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:'';}catch(_){return'';}}
  function renderSource(){const m=getMeta(),s=m.source,stage=$(`[data-v3-source-stage]`);$(`[data-v3-source-kind]`).value=s.kind||'url';$(`[data-v3-source-url]`).disabled=s.kind==='text';if(s.kind==='text'){stage.innerHTML=`<textarea data-v3-source-text placeholder="Colle ici un texte, un extrait, une transcription…">${esc(s.text||'')}</textarea>`;return;}const url=s.url||'';if(!url){stage.innerHTML=`<div class="v3-source-empty">Colle une URL de PDF, de vidéo YouTube ou de page web. Certains sites empêchent leur affichage dans une iframe : le bouton « Nouvel onglet » reste alors disponible.</div>`;return;}const yt=youtubeEmbed(url);stage.innerHTML=`<iframe src="${esc(yt||url)}" title="Source de travail" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;}
  function loadSource(){const kind=$(`[data-v3-source-kind]`).value,url=$(`[data-v3-source-url]`).value.trim();updateMetaNested('source',{kind,url});renderSource();}
  function pickSourceFile(file){if(sourceObjectUrl){URL.revokeObjectURL(sourceObjectUrl);sourceObjectUrl='';}if(!file)return;if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){sourceObjectUrl=URL.createObjectURL(file);const stage=$(`[data-v3-source-stage]`);stage.innerHTML=`<iframe src="${sourceObjectUrl}" title="${esc(file.name)}"></iframe>`;}else{const r=new FileReader();r.onload=()=>{updateMetaNested('source',{kind:'text',text:String(r.result||''),title:file.name});renderSource();};r.readAsText(file);}}

  function activityKey(id=currentId()){return id||'none';}
  function recordActivity(force=false){const id=currentId();if(!id)return;const now=Date.now();if(!force&&now-lastActivityWrite<60000)return;lastActivityWrite=now;const key=activityKey(id),list=Array.isArray(activity[key])?activity[key]:[],count=words(editor.innerText||'');const today=new Date().toISOString().slice(0,10);const todayList=list.filter(e=>String(e.at).slice(0,10)===today);const last=todayList[todayList.length-1];if(!force&&last&&Math.abs(count-last.words)<5)return;list.push({at:new Date().toISOString(),words:count});activity[key]=list.slice(-240);writeJson(ACTIVITY_KEY,activity);renderToday();}
  function todayEntries(){const today=new Date().toISOString().slice(0,10);return (activity[activityKey()]||[]).filter(e=>String(e.at).slice(0,10)===today);}
  function renderToday(){const list=todayEntries(),now=words(editor.innerText||''),base=list.length?list[0].words:now,delta=now-base;const el=$(`[data-v3-today]`);if(el)el.textContent=`Aujourd’hui · ${delta>=0?'+':''}${delta} mot${Math.abs(delta)>1?'s':''}`;}
  function openActivity(){recordActivity(true);const list=todayEntries();const now=words(editor.innerText||''),base=list.length?list[0].words:now,delta=now-base;$(`[data-v3-activity-summary]`).innerHTML=`<p><strong>${delta>=0?'+':''}${delta} mots aujourd’hui</strong> · ${now} mots dans le document actuellement.</p>`;$(`[data-v3-activity-list]`).innerHTML=list.slice().reverse().map((e,i,arr)=>`<div class="v3-activity-row"><span>${new Date(e.at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span><strong>${e.words} mots</strong><em>${i<arr.length-1?`${e.words-arr[i+1].words>=0?'+':''}${e.words-arr[i+1].words}`:'début'}</em></div>`).join('')||'<p class="v3-search-summary">Pas encore d’activité enregistrée aujourd’hui.</p>';openModal('activity');}

  function loadExportSettings(){exportSettings=readJson(EXPORT_KEY,exportSettings);$(`[data-v3-export-size]`).value=exportSettings.pageSize;$(`[data-v3-export-margin]`).value=exportSettings.margin;$(`[data-v3-export-header]`).value=exportSettings.header||'';$(`[data-v3-export-footer]`).value=exportSettings.footer||'';$(`[data-v3-export-pages]`).checked=!!exportSettings.pageNumbers;$(`[data-v3-export-cover]`).checked=!!exportSettings.cover;$(`[data-v3-export-toc]`).checked=!!exportSettings.toc;}
  function saveExportSettings(){exportSettings={pageSize:$(`[data-v3-export-size]`).value,margin:Math.max(8,Math.min(40,Number($(`[data-v3-export-margin]`).value)||20)),header:$(`[data-v3-export-header]`).value.trim(),footer:$(`[data-v3-export-footer]`).value.trim(),pageNumbers:$(`[data-v3-export-pages]`).checked,cover:$(`[data-v3-export-cover]`).checked,toc:$(`[data-v3-export-toc]`).checked};writeJson(EXPORT_KEY,exportSettings);return exportSettings;}
  function cleanExportClone(){const c=editor.cloneNode(true);$$('.ph-comment-anchor',c).forEach(el=>{el.classList.remove('ph-comment-anchor','is-active');el.removeAttribute('data-comment-id');});$$('.ph-private-marker',c).forEach(el=>el.remove());return c;}
  function exportTocHtml(root){const hs=$$('h1,h2,h3',root);if(!hs.length)return'';return `<nav class="print-toc"><h2>Table des matières</h2><ol>${hs.map(h=>`<li class="l${h.tagName.slice(1)}">${esc((h.textContent||'').trim())}</li>`).join('')}</ol></nav>`;}
  function advancedHtml(){const s=saveExportSettings(),title=API.state.current?.title||'Document',clone=cleanExportClone(),toc=s.toc?exportTocHtml(clone):'',cover=s.cover?`<section class="cover"><h1>${esc(title)}</h1>${getMeta().author?`<p>${esc(getMeta().author)}</p>`:''}<small>${new Date().toLocaleDateString('fr-FR',{dateStyle:'long'})}</small></section>`:'';return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:${s.pageSize};margin:${s.margin}mm}*{box-sizing:border-box}body{color:#29262d;font:11.5pt/1.6 Georgia,serif;margin:0}h1,h2,h3{font-family:Arial,sans-serif;line-height:1.25}h1{font-size:24pt}h2{font-size:17pt;margin-top:1.4em}h3{font-size:13pt;margin-top:1.2em}blockquote{border-left:3px solid #aaa;padding-left:12px;color:#555}.print-header,.print-footer{position:fixed;left:0;right:0;color:#777;font:8.5pt Arial,sans-serif}.print-header{top:-${Math.max(6,s.margin-7)}mm}.print-footer{bottom:-${Math.max(6,s.margin-7)}mm;display:flex;justify-content:space-between}.page-number:after{content:counter(page)}.cover{height:75vh;display:grid;place-content:center;text-align:center;page-break-after:always}.cover h1{font:34pt Georgia,serif}.print-toc{page-break-after:always}.print-toc ol{padding-left:1.4em}.print-toc li{margin:.3em 0}.print-toc .l3{margin-left:1.2em}.ph-toc{border:1px solid #ddd;padding:12px}.ph-wikilink{color:inherit;text-decoration:underline}.ph-comment-anchor{background:none;border:0}</style></head><body>${s.header?`<div class="print-header">${esc(s.header)}</div>`:''}<div class="print-footer"><span>${esc(s.footer||'')}</span>${s.pageNumbers?`<span>p. <span class="page-number"></span></span>`:''}</div>${cover}${toc}<main>${!s.cover?`<h1>${esc(title)}</h1>`:''}${clone.innerHTML}</main></body></html>`;}
  function advancedPdf(){const w=window.open('','_blank');if(!w){toast('Le navigateur a bloqué la fenêtre d’impression.');return;}w.document.open();w.document.write(advancedHtml());w.document.close();w.focus();setTimeout(()=>w.print(),300);}
  function advancedHtmlDownload(){const s=advancedHtml(),title=API.state.current?.title||'document';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/html;charset=utf-8'}));a.download=`${API.slug(title)}-mise-en-page.html`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function exportWord(){saveExportSettings();writeJson(EXPORT_KEY,exportSettings);API.exportDocx();}

  function bindEvents(){
    document.addEventListener('click',async e=>{
      const t=e.target.closest('button,a,[data-v3-prop],select,input,textarea');
      if(e.target.closest('[data-v3-global]'))globalSearch();
      if(e.target.closest('[data-v3-revise]'))openRevision();
      if(e.target.closest('[data-v3-inspector]'))openInspector('info');
      if(e.target.closest('[data-v3-source]'))openSource();
      if(e.target.closest('[data-v3-close-inspector]'))closeInspector();
      if(e.target.closest('[data-v3-close-source]'))closeSource();
      const tab=e.target.closest('[data-v3-tab]');if(tab){inspectorTab=tab.dataset.v3Tab;renderInspector();}
      const close=e.target.closest('[data-v3-close]');if(close)closeModal(close.dataset.v3Close);
      if(e.target.closest('[data-v3-comment]')||e.target.closest('[data-v3-new-comment]')){API.saveSelection();openCommentModal();}
      if(e.target.closest('[data-v3-save-comment]'))saveComment();
      if(e.target.closest('[data-v3-citation]')){API.saveSelection();openCitationModal();}
      if(e.target.closest('[data-v3-save-citation]'))saveCitation();
      if(e.target.closest('[data-v3-toc]'))insertToc();
      if(e.target.closest('[data-v3-manage-styles]')){renderStylesModal();openModal('styles');}
      const as=e.target.closest('[data-v3-apply-style]');if(as)applyStyle(as.dataset.v3ApplyStyle);
      const ds=e.target.closest('[data-v3-delete-style]');if(ds&&confirm('Supprimer ce style personnalisé ?')){customStyles=customStyles.filter(x=>x.id!==ds.dataset.v3DeleteStyle);writeJson(STYLES_KEY,customStyles);renderStyleSelect();renderStylesModal();}
      if(e.target.closest('[data-v3-add-style]'))addCustomStyle();
      const fav=e.target.closest('[data-v3-favorite]');if(fav)favoriteActions[fav.dataset.v3Favorite]?.run();
      if(e.target.closest('[data-v3-manage-favorites]')){renderFavoriteOptions();openModal('favorites');}
      if(e.target.closest('[data-v3-toggle-toolbar]'))toggleToolbarRow();
      if(e.target.closest('[data-v3-today]'))openActivity();
      if(e.target.closest('[data-v3-library-view]'))toggleLibraryView();
      if(e.target.closest('[data-v3-load-source]'))loadSource();
      if(e.target.closest('[data-v3-pick-source]'))$(`[data-v3-source-file]`).click();
      if(e.target.closest('[data-v3-open-external]')){const u=getMeta().source.url;if(u)window.open(u,'_blank','noopener');else toast('Aucune URL enregistrée.');}
      const wiki=e.target.closest('.ph-wikilink[data-wiki-title]');if(wiki&&editor.contains(wiki)){e.preventDefault();openWiki(wiki.dataset.wikiTitle);}
      const openWikiBtn=e.target.closest('[data-v3-open-wiki]');if(openWikiBtn)openWiki(openWikiBtn.dataset.v3OpenWiki);
      const openDoc=e.target.closest('[data-v3-open-doc]');if(openDoc){const docs=await API.getAllDocuments(),d=docs.find(x=>x.id===openDoc.dataset.v3OpenDoc);if(d){API.loadDocument(d);closeInspector();}}
      const sr=e.target.closest('[data-v3-search-doc]');if(sr){const docs=await API.getAllDocuments(),d=docs.find(x=>x.id===sr.dataset.v3SearchDoc);if(d){API.loadDocument(d);closeModal('global');}}
      const jump=e.target.closest('[data-v3-jump-comment]');if(jump)jumpComment(jump.dataset.v3JumpComment);
      const res=e.target.closest('[data-v3-resolve-comment]');if(res)toggleComment(res.dataset.v3ResolveComment);
      const del=e.target.closest('[data-v3-delete-comment]');if(del&&confirm('Supprimer ce commentaire ?'))deleteComment(del.dataset.v3DeleteComment);
      const remTag=e.target.closest('[data-v3-remove-tag]');if(remTag){const m=getMeta();setMeta({tags:m.tags.filter(x=>x!==remTag.dataset.v3RemoveTag)});}
      if(e.target.closest('[data-v3-export]')){loadExportSettings();openModal('export');}
      if(e.target.closest('[data-v3-export-pdf]'))advancedPdf();
      if(e.target.closest('[data-v3-export-html]'))advancedHtmlDownload();
      if(e.target.closest('[data-v3-export-word]'))exportWord();
      if(e.target.closest('[data-v3-revision-show]'))renderRevision(true);
      if(e.target.closest('[data-v3-revision-next]')){revisionIndex=(revisionIndex+1)%revisionCards.length;renderRevision(false);}
      if(e.target.closest('[data-v3-revision-prev]')){revisionIndex=(revisionIndex-1+revisionCards.length)%revisionCards.length;renderRevision(false);}
      if(e.target.closest('[data-v3-revision-shuffle]')){revisionCards.sort(()=>Math.random()-.5);revisionIndex=0;renderRevision(false);}
    });

    document.addEventListener('change',e=>{
      if(e.target.matches('[data-v3-prop]'))setMeta({[e.target.dataset.v3Prop]:e.target.value});
      if(e.target.matches('[data-v3-style-select]')&&e.target.value){API.restoreSelection?.();applyStyle(e.target.value);e.target.value='';}
      if(e.target.matches('[data-v3-source-kind]')){updateMetaNested('source',{kind:e.target.value});renderSource();}
      if(e.target.matches('[data-v3-source-file]')){pickSourceFile(e.target.files?.[0]);e.target.value='';}
      if(e.target.matches('[data-v3-fav-check]')){favorites=$$('[data-v3-fav-check]').filter(x=>x.checked).map(x=>x.dataset.v3FavCheck);writeJson(FAV_KEY,favorites);renderFavorites();}
    });
    document.addEventListener('input',e=>{
      if(e.target.matches('[data-v3-prop="privateNotes"]'))setMeta({privateNotes:e.target.value});
      if(e.target.matches('[data-v3-tags-input]')&&/[;,]$/.test(e.target.value)){e.target.value.split(/[;,]/).forEach(addTag);e.target.value='';}
      if(e.target.matches('[data-v3-global-q]'))renderGlobalSearch();
      if(e.target.matches('[data-v3-global-status],[data-v3-global-type]'))renderGlobalSearch();
      if(e.target.matches('[data-v3-source-text]'))updateMetaNested('source',{kind:'text',text:e.target.value});
    });
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-v3-tags-input]')&&e.key==='Enter'){e.preventDefault();addTag(e.target.value);e.target.value='';}});

    editor.addEventListener('keyup',e=>{if(e.key===']')processWikiAtCaret();});
    editor.addEventListener('input',()=>{clearTimeout(updateTocs._t);updateTocs._t=setTimeout(()=>{updateTocs();renderToday(); if(inspectorTab==="context"&&!$(`[data-v3-inspector-panel]`).hidden)renderContext();},400);});

    window.addEventListener('philosophal:documentloaded',()=>{renderInspector();renderSource();renderStyleSelect();decorateLibrary();recordActivity(true);renderToday();updateTocs();});
    window.addEventListener('philosophal:documentsaved',()=>{recordActivity(false);decorateLibrary();});
    const obs=new MutationObserver(()=>decorateLibrary());if(API.documentList)obs.observe(API.documentList,{childList:true,subtree:true});

    window.addEventListener('keydown',e=>{
      const key=String(e.key||'').toLowerCase();
      const code=e.code||'';
      if(e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(code==='KeyC'||key==='c')){e.preventDefault();e.stopImmediatePropagation();goApp('/mediatheque/');return;}
      if(e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(code==='KeyH'||key==='h')){e.preventDefault();e.stopImmediatePropagation();goApp('/');return;}
      const typing=e.target instanceof HTMLElement&&(e.target.matches('input,textarea,select,[role="textbox"]')||e.target.isContentEditable);
      if(!typing&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(code==='KeyP'||key==='p')){e.preventDefault();e.stopImmediatePropagation();goApp('/pomodoro/');return;}
      const mod=e.ctrlKey||e.metaKey;
      if(mod&&e.shiftKey&&key==='f'){e.preventDefault();e.stopImmediatePropagation();globalSearch();return;}
      if(e.key==='Escape'){closeInspector();closeSource();$$('[data-v3-modal]').forEach(m=>m.hidden=true);}
    },true);
  }

  function exposeForSlash(){window.PhilosophalEditorV3={openGlobalSearch:globalSearch,openInspector,openSource,openRevision,insertToc,generateBibliography,openComment:openCommentModal,openCitation:openCitationModal,insertWiki:insertWikiPrompt,openStyles:()=>{renderStylesModal();openModal('styles');},openExport:()=>{loadExportSettings();openModal('export');},openContext:()=>openInspector('context'),toggleLibraryView};}

  function init(){injectUI();exposeForSlash();bindEvents();renderInspector();decorateLibrary();recordActivity(true);renderToday();}
  init();
})();

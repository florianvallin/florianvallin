(async () => {
  "use strict";

  // Attendre la synchronisation du catalogue /textes/ avant de construire la médiathèque.
  try { await (window.FV_MEDIATHEQUE_TEXT_SYNC || Promise.resolve()); } catch (_) {}

  const DATA = window.FV_MEDIATHEQUE_DATA || { resources: [], dossiers: [] };
  const MINDMAP_CUSTOM_KEY = "fv-mindmap-custom-v2";
  const MINDMAP_SESSION_KEY = "fv-mindmap-session-v2";
  const MINDMAP_RELATIONS_KEY = "fv-mindmap-relations-v2";

  function readMindmapJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function readCustomMindmaps() {
    const list = readMindmapJson(MINDMAP_CUSTOM_KEY, []);
    if (!Array.isArray(list)) return [];
    return list.filter((item) => item && typeof item === "object" && item.tree && item.title).map((item) => ({
      ...item,
      id: String(item.id || `mindmap:personal:${Date.now()}`),
      kind: "mindmap",
      mindmapCategory: "custom",
      isPersonalMindmap: true
    }));
  }

  const baseResources = Array.isArray(DATA.resources) ? DATA.resources : [];
  const mindmapResources = Array.isArray(window.FV_MEDIATHEQUE_MINDMAPS) ? window.FV_MEDIATHEQUE_MINDMAPS : [];
  const builtInMindmapIds = new Set(mindmapResources.map((item) => item.id));
  const customMindmapResources = readCustomMindmaps().filter((item) => !builtInMindmapIds.has(item.id));
  const resources = [...baseResources, ...mindmapResources, ...customMindmapResources];
  const dossiers = Array.isArray(DATA.dossiers) ? DATA.dossiers : [];
  const byId = new Map(resources.map((item) => [item.id, item]));
  let mindmapManualRelations = readMindmapJson(MINDMAP_RELATIONS_KEY, {});
  if (!mindmapManualRelations || typeof mindmapManualRelations !== "object" || Array.isArray(mindmapManualRelations)) mindmapManualRelations = {};

  const $ = (selector) => document.querySelector(selector);
  const search = $("[data-media-search]");
  const clearSearch = $("[data-media-clear]");
  const types = $("[data-media-types]");
  const home = $("[data-media-home]");
  const listShell = $("[data-media-list-shell]");
  const count = $("[data-media-count]");
  const activeFilters = $("[data-active-filters]");
  const summaryKicker = $("[data-summary-kicker]");
  const summaryTitle = $("[data-summary-title]");
  const resetButton = $("[data-media-reset]");
  const empty = $("[data-media-empty]");
  const pinnedToggle = $("[data-toggle-pinned]");
  const explorer = $("[data-media-explorer]");
  const explorerTabs = $("[data-explorer-tabs]");
  const explorerSearch = $("[data-explorer-search]");
  const explorerList = $("[data-explorer-list]");
  const player = $("[data-media-player]");
  const playerFrame = $("[data-player-frame]");
  const courseSearchShell = $("[data-course-search-shell]");
  const courseSearch = $("[data-course-search]");
  const courseSearchClear = $("[data-course-search-clear]");
  const courseSearchStatus = $("[data-course-search-status]");
  const advancedToggle = $("[data-toggle-advanced]");
  const advancedFilters = $("[data-advanced-filters]");
  const authorFilter = $("[data-filter-author]");
  const conceptFilter = $("[data-filter-concept]");
  const levelFilter = $("[data-filter-level]");
  const difficultyFilter = $("[data-filter-difficulty]");
  const difficultyField = $("[data-difficulty-field]");
  const durationFilter = $("[data-filter-duration]");
  const usageFilter = $("[data-filter-usage]");
  const detail = $("[data-resource-detail]");
  const detailTitle = $("[data-detail-title]");
  const detailContent = $("[data-detail-content]");
  const usefulLinks = $("[data-useful-links]");
  const accessSwitch = $("[data-media-access-switch]");
  const privateGate = $("[data-private-gate]");
  const privateGateForm = $("[data-private-gate-form]");
  const privatePassword = $("[data-private-password]");
  const privateError = $("[data-private-error]");
  const PRIVATE_KINDS = new Set(["livre", "manuel", "cours", "cours-video", "mindmap"]);

  const FILTERS = [
    { key: "all", label: "Tout", plural: "Toutes les ressources", description: "Une vue simple de l’ensemble de la médiathèque." },
    { key: "texte", label: "Textes", plural: "Textes", description: "Extraits, œuvres et fiches de lecture.", glyph: "T" },
    { key: "livre", label: "Livres", plural: "Livres", description: "Bibliothèque de lecture personnelle.", glyph: "L" },
    { key: "manuel", label: "Manuels", plural: "Manuels", description: "Manuels scolaires et universitaires réunis dans un même rayon.", glyph: "M" },
    { key: "audio", label: "Audio", plural: "Audio", description: "Podcasts, émissions et conférences audio.", glyph: "A" },
    { key: "video", label: "Vidéo", plural: "Vidéos", description: "Films, extraits, documentaires, cours et conférences externes.", glyph: "V" },
    { key: "cours", label: "Cours écrits", plural: "Cours écrits", description: "Archives de Licence, Master et autres enseignements.", glyph: "C" },
    { key: "cours-video", label: "Cours vidéo", plural: "Cours vidéo", description: "Cours et ressources pédagogiques vidéo réalisés pour Philosophal.", glyph: "▶" },
    { key: "mindmap", label: "Mind-maps", plural: "Mind-maps", description: "Cartes mentales en mode plan ou schéma interactif, navigables et légères.", glyph: "⌘" }
  ];
  const filterMeta = new Map(FILTERS.map((item) => [item.key, item]));

  function readMindmapView() {
    try {
      const saved = localStorage.getItem("fv-mindmap-view");
      return ["plan", "map", "mixed"].includes(saved) ? saved : "plan";
    } catch (_) {
      return "plan";
    }
  }

  function saveMindmapView(value) {
    try { localStorage.setItem("fv-mindmap-view", value); } catch (_) {}
  }

  function readMindmapPalette() {
    try {
      const saved = localStorage.getItem("fv-mindmap-palette");
      return ["color", "violet"].includes(saved) ? saved : "color";
    } catch (_) {
      return "color";
    }
  }

  function saveMindmapPalette(value) {
    try { localStorage.setItem("fv-mindmap-palette", value); } catch (_) {}
  }

  const MINDMAP_PALETTES = {
    color: ["#6c5a91", "#526fa4", "#a05f83", "#9b7048", "#6b63a7", "#9a645c", "#7d5f9e", "#657b9f"],
    violet: ["#665584", "#756391", "#826fa0", "#5b4c78", "#8d79aa", "#6d5c8d", "#9a88b4", "#79669a"]
  };

  function mindmapBranchColor(branch) {
    const palette = MINDMAP_PALETTES[state.mindmapPalette] || MINDMAP_PALETTES.color;
    return palette[((Number(branch) % palette.length) + palette.length) % palette.length];
  }

  const state = {
    access: "public",
    kind: "all",
    query: "",
    courseQuery: "",
    person: "",
    theme: "",
    dossier: "",
    pinnedOnly: false,
    pinned: readPinned(),
    explorerView: "people",
    explorerQuery: "",
    author: "",
    concept: "",
    level: "",
    difficulty: "",
    duration: "",
    usage: "",
    advancedOpen: false,
    mapConcept: "Liberté",
    mindmapId: "",
    mindmapQuery: "",
    mindmapView: readMindmapView(),
    mindmapPalette: readMindmapPalette(),
    mindmapExpanded: new Set(),
    mindmapExpansionOwner: "",
    mindmapSelectedPath: "",
    mindmapFocusPath: "",
    mindmapScale: 1,
    mindmapPanX: 0,
    mindmapPanY: 0,
    mindmapViewportRestored: false,
    mindmapFullscreen: false,
    mindmapRelationsVisible: true,
    mindmapRevision: false,
    mindmapRevisionRevealed: new Set(),
    mindmapRevisionScope: "",
    mindmapLinkSourcePath: "",
    expandedSections: new Set()
  };

  function isPrivateResource(item) {
    return PRIVATE_KINDS.has(groupOf(item));
  }

  function resourceInCurrentAccess(item) {
    if (groupOf(item) === "hidden") return false;
    // La version privée est la médiathèque complète :
    // ressources publiques + ressources réservées.
    if (state.access === "private") return true;
    return !isPrivateResource(item);
  }

  function scopedResources() {
    return resources.filter(resourceInCurrentAccess);
  }

  function availableFilters() {
    // En privé, tous les rayons restent accessibles afin d'éviter
    // d'avoir à basculer constamment entre les deux versions.
    if (state.access === "private") return FILTERS;
    return FILTERS.filter((meta) => meta.key === "all" || !PRIVATE_KINDS.has(meta.key));
  }

  function closePrivateGate() {
    if (!privateGate) return;
    privateGate.hidden = true;
    if (privateError) privateError.hidden = true;
    if (privatePassword) privatePassword.value = "";
    document.body.classList.remove("media-modal-open");
  }

  function openPrivateGate() {
    if (!privateGate) return;
    privateGate.hidden = false;
    if (privateError) privateError.hidden = true;
    document.body.classList.add("media-modal-open");
    requestAnimationFrame(() => privatePassword?.focus());
  }

  function resetAccessFilters() {
    state.kind = "all";
    state.query = "";
    state.courseQuery = "";
    state.person = "";
    state.theme = "";
    state.dossier = "";
    state.pinnedOnly = false;
    state.author = "";
    state.concept = "";
    state.level = "";
    state.difficulty = "";
    state.duration = "";
    state.usage = "";
    state.mindmapId = "";
    state.mindmapQuery = "";
    state.advancedOpen = false;
    state.expandedSections.clear();
    if (search) search.value = "";
    if (courseSearch) courseSearch.value = "";
  }

  function setAccessMode(mode) {
    state.access = mode === "private" ? "private" : "public";
    resetAccessFilters();
    accessSwitch?.querySelectorAll("[data-access-mode]").forEach((button) => {
      const active = button.dataset.accessMode === state.access;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.body.dataset.mediaAccess = state.access;
    render();
  }

  function normalize(value = "") {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function esc(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  const PROGRAM_NOTIONS = ["Art", "Bonheur", "Conscience", "Devoir", "État", "Inconscient", "Justice", "Langage", "Liberté", "Nature", "Raison", "Religion", "Science", "Technique", "Temps", "Travail", "Vérité"];
  const CONCEPT_GRAPH = {
    "Liberté": ["Déterminisme", "Autonomie", "Responsabilité", "Libre arbitre", "Obéissance"],
    "Déterminisme": ["Liberté", "Causalité", "Conditionnement", "Nécessité", "Habitude"],
    "Autonomie": ["Liberté", "Hétéronomie", "Devoir", "Responsabilité", "Raison"],
    "Hétéronomie": ["Autonomie", "Obéissance", "Autorité", "Conditionnement", "Devoir"],
    "Conditionnement": ["Habitude", "Apprentissage", "Obéissance", "Déterminisme", "Autorité"],
    "Obéissance": ["Autorité", "Responsabilité", "Hétéronomie", "Liberté", "Conditionnement"],
    "Responsabilité": ["Liberté", "Devoir", "Conscience", "Autonomie", "Justice"],
    "Science": ["Expérience", "Causalité", "Raison", "Technique", "Vérité"],
    "Vérité": ["Raison", "Science", "Expérience", "Langage", "Conscience"],
    "Raison": ["Vérité", "Science", "Devoir", "Langage", "Expérience"],
    "Justice": ["État", "Droit", "Devoir", "Liberté", "Égalité"],
    "État": ["Justice", "Droit", "Liberté", "Autorité", "Société"],
    "Devoir": ["Autonomie", "Responsabilité", "Morale", "Raison", "Justice"],
    "Bonheur": ["Désir", "Plaisir", "Liberté", "Sagesse", "Temps"],
    "Conscience": ["Inconscient", "Responsabilité", "Liberté", "Identité", "Perception"],
    "Inconscient": ["Conscience", "Désir", "Déterminisme", "Mémoire", "Responsabilité"],
    "Technique": ["Travail", "Nature", "Science", "Progrès", "Liberté"],
    "Nature": ["Technique", "Culture", "Science", "Liberté", "Travail"],
    "Langage": ["Pensée", "Vérité", "Conscience", "Raison", "Communication"],
    "Religion": ["Foi", "Raison", "Mystique", "Morale", "Vérité"],
    "Travail": ["Technique", "Liberté", "Aliénation", "Nature", "Société"],
    "Temps": ["Mémoire", "Identité", "Bonheur", "Conscience", "Mort"],
    "Art": ["Beauté", "Création", "Technique", "Imagination", "Vérité"],
    "Causalité": ["Déterminisme", "Science", "Expérience", "Nécessité", "Habitude"],
    "Expérience": ["Science", "Vérité", "Causalité", "Conscience", "Raison"],
    "Habitude": ["Conditionnement", "Causalité", "Apprentissage", "Déterminisme", "Comportement"],
    "Autorité": ["Obéissance", "État", "Hétéronomie", "Responsabilité", "Pouvoir"],
    "Mystique": ["Religion", "Contemplation", "Expérience", "Foi", "Spiritualité"]
  };
  const CONCEPT_ALIASES = {
    "Liberté": ["libre", "libre arbitre", "choix"],
    "Déterminisme": ["determinisme", "déterminé", "determine", "nécessité causale", "demon de laplace", "démon de laplace"],
    "Autonomie": ["autonome", "se donner la loi"],
    "Hétéronomie": ["heteronomie", "hétéronome", "heteronome"],
    "Conditionnement": ["conditionne", "pavlov", "skinner", "bandura"],
    "Obéissance": ["obeissance", "soumission", "milgram"],
    "Responsabilité": ["responsable", "responsabilite"],
    "Causalité": ["causalite", "cause", "causal"],
    "Expérience": ["experience", "empirique", "expérimental", "experimental"],
    "Habitude": ["habitudes", "accoutumance"],
    "Autorité": ["autorite", "pouvoir"],
    "Mystique": ["mysticisme", "contemplation", "oraison"],
    "État": ["etat", "politique"],
    "Vérité": ["verite", "vrai"],
    "Inconscient": ["freud", "psychanalyse"],
    "Technique": ["technologie", "machine"],
    "Travail": ["aliénation", "alienation"],
    "Langage": ["parole", "communication"],
    "Religion": ["foi", "spiritualite", "spiritualité"],
    "Art": ["beauté", "beaute", "esthétique", "esthetique"],
    "Bonheur": ["plaisir", "eudemonisme", "eudémonisme"]
  };
  const DIFFICULTY_LABELS = { accessible: "Accessible", intermediate: "Intermédiaire", deep: "Approfondi" };
  const LEVEL_LABELS = { terminale: "Terminale", hlp: "HLP", licence: "Licence", master: "Master", general: "Tous niveaux" };
  const USAGE_LABELS = { dissertation: "Dissertation", cours: "Cours", revision: "Révision", exemple: "Exemple", approfondir: "Approfondir" };
  const DURATION_LABELS = { short5: "≤ 5 min", short15: "≤ 15 min", short30: "≤ 30 min", hour: "≤ 1 h", long: "Long" };

  function mindmapTreeText(tree) {
    if (!tree) return "";
    const parts = [];
    const visit = (node) => {
      if (!node) return;
      if (typeof node === "string") { parts.push(node); return; }
      if (node.label) parts.push(node.label);
      if (node.note) parts.push(node.note);
      (node.children || []).forEach(visit);
    };
    visit(tree);
    return parts.join(" ");
  }

  function rawConceptHaystack(item) {
    return normalize([item.title, item.creator, item.subtitle, item.description, item.source, item.section, mindmapTreeText(item.tree), ...(item.themes || []), ...(item.people || []), ...(item.keywords || [])].filter(Boolean).join(" "));
  }

  function canonicalConcept(value = "") {
    const token = normalize(value);
    if (!token) return "";
    const names = new Set([...Object.keys(CONCEPT_GRAPH), ...Object.values(CONCEPT_GRAPH).flat(), ...PROGRAM_NOTIONS]);
    for (const name of names) {
      if (normalize(name) === token) return name;
      if ((CONCEPT_ALIASES[name] || []).some((alias) => normalize(alias) === token)) return name;
    }
    return "";
  }

  function relatedConceptNames(concept = "") {
    const direct = CONCEPT_GRAPH[concept] || [];
    const reverse = Object.entries(CONCEPT_GRAPH).filter(([, values]) => values.includes(concept)).map(([name]) => name);
    return [...new Set([...direct, ...reverse])];
  }

  function directConcepts(item) {
    const haystack = rawConceptHaystack(item);
    const names = new Set([...Object.keys(CONCEPT_GRAPH), ...Object.values(CONCEPT_GRAPH).flat(), ...PROGRAM_NOTIONS]);
    return [...names].filter((name) => {
      const candidates = [name, ...(CONCEPT_ALIASES[name] || [])].map(normalize).filter(Boolean);
      return candidates.some((candidate) => haystack.includes(candidate));
    });
  }

  function conceptsFor(item, options = {}) {
    const direct = directConcepts(item);
    if (!options.expanded) return direct;
    const expanded = new Set(direct);
    direct.forEach((concept) => relatedConceptNames(concept).forEach((name) => expanded.add(name)));
    return [...expanded];
  }

  function difficultyFor(item) {
    // Les niveaux de difficulté sont réservés aux extraits de texte.
    if (groupOf(item) !== "texte") return "";
    if (["accessible", "intermediate", "deep"].includes(item.difficulty)) return item.difficulty;
    const creator = normalize(item.creator || "");
    if (/kant|hegel|heidegger|derrida|deleuze|spinoza|horkheimer|adorno/.test(creator)) return "deep";
    if (/epictete|epicure|camus|platon|pascal|montaigne|la boetie/.test(creator)) return "accessible";
    return "intermediate";
  }

  function minutesFor(item) {
    const explicit = Number(item.minutes || item.durationMinutes || 0);
    if (explicit > 0) return explicit;
    // Une vidéo n'affiche jamais de durée estimée : uniquement une durée explicitement renseignée.
    if (["video", "cours-video", "mindmap"].includes(groupOf(item))) return null;
    const match = [item.subtitle, item.description, item.source].filter(Boolean).join(" ").match(/(\d{1,3})\s*(?:min|minutes?)/i);
    if (match) return Number(match[1]);
    return ({ texte: 10, livre: 180, manuel: 180, podcast: 45, audio: 35, cours: 20, article: 12 })[item.kind] || 15;
  }

  function durationBucket(item) {
    const minutes = minutesFor(item);
    if (!Number.isFinite(minutes) || minutes <= 0) return "";
    if (minutes <= 5) return "short5";
    if (minutes <= 15) return "short15";
    if (minutes <= 30) return "short30";
    if (minutes <= 60) return "hour";
    return "long";
  }

  function durationLabel(item) {
    const minutes = minutesFor(item);
    if (!Number.isFinite(minutes) || minutes <= 0) return "";
    return ["livre", "manuel"].includes(item.kind) ? "Lecture longue" : `≈ ${minutes} min`;
  }

  function durationMatches(item, filter) {
    if (!filter) return true;
    const minutes = minutesFor(item);
    if (!Number.isFinite(minutes) || minutes <= 0) return false;
    if (filter === "short5") return minutes <= 5;
    if (filter === "short15") return minutes <= 15;
    if (filter === "short30") return minutes <= 30;
    if (filter === "hour") return minutes <= 60;
    if (filter === "long") return minutes > 60;
    return true;
  }

  function pedagogyMeta(item) {
    const parts = [];
    const difficulty = difficultyFor(item);
    const duration = durationLabel(item);
    if (difficulty) parts.push(`<span class="is-difficulty is-${difficulty}">${esc(DIFFICULTY_LABELS[difficulty])}</span>`);
    if (duration) parts.push(`<span>${esc(duration)}</span>`);
    return parts.length ? `<div class="media-row-pedagogy">${parts.join("")}</div>` : "";
  }

  function levelsFor(item) {
    const levels = new Set();
    const haystack = rawConceptHaystack(item);
    if (item.kind === "cours") {
      const level = normalize([item.degree, item.year].join(" "));
      if (/master|m1|m2/.test(level)) levels.add("master");
      else levels.add("licence");
    } else if (item.kind === "texte") {
      levels.add("terminale");
      if (/hlp/.test(haystack)) levels.add("hlp");
    } else if (item.kind === "mindmap") {
      if (/terminale|programme|notions|reperes/.test(haystack)) levels.add("terminale");
      else levels.add("general");
    } else {
      levels.add("general");
    }
    return [...levels];
  }

  function usagesFor(item) {
    if (Array.isArray(item.usages) && item.usages.length) return item.usages;
    if (item.kind === "texte") return ["dissertation", "cours", "revision"];
    if (item.kind === "cours") return ["cours", "revision", "approfondir"];
    if (item.kind === "video") return ["cours", "exemple", "approfondir"];
    if (["podcast", "audio"].includes(item.kind)) return ["cours", "approfondir"];
    if (["livre", "manuel"].includes(item.kind)) return ["approfondir", "revision"];
    if (item.kind === "mindmap") return ["cours", "revision", "dissertation"];
    return ["approfondir"];
  }

  function conceptMatches(item, concept) {
    if (!concept) return true;
    return conceptsFor(item, { expanded: true }).includes(concept);
  }

  function semanticTermMatches(item, term) {
    const haystack = searchIndex?.get(item.id) || rawConceptHaystack(item);
    if (haystack.includes(term)) return true;
    const concept = canonicalConcept(term);
    return concept ? conceptMatches(item, concept) : false;
  }

  function readPinned() {
    try {
      const value = JSON.parse(localStorage.getItem("fv-mediatheque-pinned") || "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch (_) {
      return new Set();
    }
  }

  function savePinned() {
    try { localStorage.setItem("fv-mediatheque-pinned", JSON.stringify([...state.pinned])); } catch (_) {}
  }

  function groupOf(item) {
    if (["podcast", "audio"].includes(item.kind)) return "audio";
    if (item.kind === "article") return "texte";
    if (item.kind === "art") return "hidden";
    if (item.kind === "video" && videoType(item) === "cours-video") return "cours-video";
    return item.kind;
  }

  function videoType(item) {
    if (item.kind !== "video") return "";
    if (item.videoType === "cours-video") return "cours-video";
    if (item.videoType === "cours") return "cours";
    if (item.videoType === "film") return "film";
    const hint = normalize([item.title, item.description, item.source, ...(item.keywords || [])].join(" "));
    if (/conference|cours|seminaire|entretien|lecon|masterclass/.test(hint)) return "cours";
    return "film";
  }

  function groupLabel(item) {
    if (item.kind === "podcast") return "Podcast";
    if (item.kind === "article") return "Article";
    if (item.kind === "cours") return "Cours écrit";
    if (item.kind === "mindmap") return "Mind-map";
    if (item.kind === "video") {
      const type = videoType(item);
      if (type === "cours-video") return "Cours vidéo";
      return type === "cours" ? "Cours / conférence" : "Film / extrait";
    }
    return ({ texte: "Texte", livre: "Livre", manuel: "Manuel", audio: "Audio", video: "Vidéo", "cours-video": "Cours vidéo", mindmap: "Mind-map" })[groupOf(item)] || "Ressource";
  }

  function actionLabel(item) {
    return ({ texte: "Lire", livre: "Lire", manuel: "Consulter", audio: "Écouter", video: "Regarder", cours: "Ouvrir", "cours-video": "Regarder", mindmap: "Explorer" })[groupOf(item)] || "Consulter";
  }

  function courseDomain(item) {
    const formation = normalize(item.formation || "");
    if (formation.includes("psych")) return "psycho";
    if (formation.includes("philo") || formation.includes("esthet")) return "philo";
    return "other";
  }

  function courseThemeKey(item) {
    const key = normalize(item.courseTheme || "").replace(/\s+/g, "-");
    return ["clinique", "histoire", "developpement", "sociale", "cognition", "methodologie"].includes(key) ? key : "general";
  }

  function courseThemeLabel(item) {
    return ({
      clinique: "Clinique & psychopathologie",
      histoire: "Histoire & épistémologie",
      developpement: "Développement",
      sociale: "Psychologie sociale",
      cognition: "Cognition & intelligence",
      methodologie: "Méthodologie",
      general: "Général"
    })[courseThemeKey(item)] || "Général";
  }

  function courseClass(item) {
    if (item.kind !== "cours") return "";
    return ` is-domain-${courseDomain(item)} is-theme-${courseThemeKey(item)}`;
  }

  function icon(kind) {
    const group = ["podcast", "audio"].includes(kind) ? "audio" : kind === "article" ? "texte" : kind;
    const icons = {
      texte: '<svg viewBox="0 0 24 24"><path d="M6 3.5h9l3 3V20.5H6z"/><path d="M15 3.5v4h3M9 11h6M9 14h6M9 17h4"/></svg>',
      livre: '<svg viewBox="0 0 24 24"><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h5v17H7a2.5 2.5 0 0 0-2.5 2z"/><path d="M19.5 5.5A2.5 2.5 0 0 0 17 3h-5v17h5a2.5 2.5 0 0 1 2.5 2z"/></svg>',
      manuel: '<svg viewBox="0 0 24 24"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12.5H7.5A2.5 2.5 0 0 1 5 17z"/><path d="M8 8h7M8 11h7M8 14h5"/><path d="M18 7h1.5v12.5H8"/></svg>',
      audio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M7.5 14.5a6.3 6.3 0 1 1 9 0M5 17a9.5 9.5 0 1 1 14 0M10 15.5l-1 5M14 15.5l1 5"/></svg>',
      video: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>',
      cours: '<svg viewBox="0 0 24 24"><path d="M5 3.5h11l3 3v14H5z"/><path d="M16 3.5v4h3M8 11h8M8 14h8M8 17h5"/></svg>',
      "cours-video": '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/><path d="M7 3h10"/></svg>',
      mindmap: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="19" cy="10" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="19" cy="20" r="2"/><path d="M7 11l3.5-4M7 13l3.5 4M14 6l3-1.5M14 7l3 2M14 18l3-6.5M14 18.5l3 1"/></svg>'
    };
    return icons[group] || icons.texte;
  }

  // Compatible avec philosophal.fr (racine /) et un Live Server qui sert /main/.
  function sitePrefix() {
    const path = location.pathname.replace(/\/index\.html$/i, "/");
    const marker = "/mediatheque/";
    const index = path.indexOf(marker);
    return index > 0 ? path.slice(0, index) : "";
  }
  const SITE_PREFIX = sitePrefix();

  function resolveUrl(url = "") {
    const value = String(url || "").trim();
    if (!value) return "#";
    if (/^(?:https?:|mailto:|tel:|#)/i.test(value)) return value;
    if (value.startsWith("/")) return `${SITE_PREFIX}${value}` || value;
    try { return new URL(value, location.href).href; } catch (_) { return value; }
  }

  function isExternal(url = "") {
    return /^https?:\/\//i.test(String(url));
  }

  function searchable(item) {
    return normalize([
      item.title, item.creator, item.subtitle, item.description, item.source, item.section,
      item.formation, item.degree, item.year, item.semester, item.ue, item.module, item.subject, item.format,
      item.teacher, item.enseignant, item.courseTeacher, item.sourceType, mindmapTreeText(item.tree),
      ...(item.themes || []), ...(item.people || []), ...(item.keywords || []),
      ...conceptsFor(item, { expanded: true }), ...levelsFor(item), ...usagesFor(item),
      difficultyFor(item) ? DIFFICULTY_LABELS[difficultyFor(item)] : ""
    ].filter(Boolean).join(" "));
  }

  const searchIndex = new Map(resources.map((item) => [item.id, searchable(item)]));
  let courseContentIndex = null;
  let courseContentIndexPromise = null;

  async function ensureCourseContentIndex() {
    if (courseContentIndex) return courseContentIndex;
    if (courseContentIndexPromise) return courseContentIndexPromise;
    if (courseSearchStatus) courseSearchStatus.textContent = "Chargement de l’index des contenus…";
    courseContentIndexPromise = fetch(resolveUrl("/mediatheque/cours/search-index.json"), { cache: "no-store" })
      .then((response) => { if (!response.ok) throw new Error("course-search-index"); return response.json(); })
      .then((data) => {
        courseContentIndex = new Map(Object.entries(data || {}));
        if (courseSearchStatus) courseSearchStatus.textContent = "Recherche par titre, matière, année, thème et contenu.";
        return courseContentIndex;
      })
      .catch(() => {
        courseContentIndex = new Map();
        if (courseSearchStatus) courseSearchStatus.textContent = "Recherche dans les métadonnées des cours.";
        return courseContentIndex;
      });
    return courseContentIndexPromise;
  }

  function courseMatchesQuery(item) {
    const query = normalize(state.courseQuery);
    if (!query) return true;
    const meta = searchIndex.get(item.id) || "";
    const content = courseContentIndex?.get(item.id) || "";
    const haystack = `${meta} ${content}`;
    return query.split(" ").filter(Boolean).every((term) => haystack.includes(term));
  }

  function relevance(item, query) {
    if (!query) return 0;
    const title = normalize(item.title);
    const creator = normalize(item.creator);
    const themes = normalize((item.themes || []).join(" "));
    const haystack = searchIndex.get(item.id) || "";
    let score = 0;
    if (title === query) score += 100;
    if (title.startsWith(query)) score += 65;
    if (title.includes(query)) score += 45;
    if (creator.includes(query)) score += 34;
    if (themes.includes(query)) score += 25;
    const queryConcept = canonicalConcept(query);
    if (queryConcept && conceptMatches(item, queryConcept)) score += 38;
    query.split(" ").filter(Boolean).forEach((term) => { if (semanticTermMatches(item, term)) score += 8; });
    return score;
  }

  function matchesQuery(item) {
    const query = normalize(state.query);
    if (!query) return true;
    const haystack = searchIndex.get(item.id) || "";
    if (haystack.includes(query)) return true;
    const fullConcept = canonicalConcept(query);
    if (fullConcept && conceptMatches(item, fullConcept)) return true;
    return query.split(" ").filter(Boolean).every((term) => semanticTermMatches(item, term));
  }

  function currentDossierIds() {
    if (!state.dossier) return null;
    const dossier = dossiers.find((item) => item.id === state.dossier);
    return dossier ? new Set(dossier.resourceIds || []) : null;
  }

  function filteredResources() {
    const dossierIds = currentDossierIds();
    let list = scopedResources().filter((item) => {
      if (state.kind !== "all" && groupOf(item) !== state.kind) return false;
      if (state.person && !(item.people || []).includes(state.person) && item.creator !== state.person) return false;
      if (state.author && !(item.people || []).includes(state.author) && item.creator !== state.author) return false;
      if (state.theme && !(item.themes || []).includes(state.theme)) return false;
      if (state.concept && !conceptMatches(item, state.concept)) return false;
      if (state.level && !levelsFor(item).includes(state.level)) return false;
      if (state.difficulty && (groupOf(item) !== "texte" || difficultyFor(item) !== state.difficulty)) return false;
      if (state.duration && !durationMatches(item, state.duration)) return false;
      if (state.usage && !usagesFor(item).includes(state.usage)) return false;
      if (dossierIds && !dossierIds.has(item.id)) return false;
      if (state.pinnedOnly && !state.pinned.has(item.id)) return false;
      if (state.kind === "cours" && item.kind === "cours" && !courseMatchesQuery(item)) return false;
      return matchesQuery(item);
    });

    const query = normalize(state.query);
    if (query) {
      list.sort((a, b) => relevance(b, query) - relevance(a, query) || a.title.localeCompare(b.title, "fr"));
    } else if (state.dossier) {
      const dossier = dossiers.find((item) => item.id === state.dossier);
      const order = new Map((dossier?.resourceIds || []).map((id, index) => [id, index]));
      list.sort((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999));
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    }
    return list;
  }

  function countGroups() {
    const counts = { all: 0 };
    scopedResources().forEach((item) => {
      const group = groupOf(item);
      if (!filterMeta.has(group)) return;
      counts.all += 1;
      counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }

  function renderTypes() {
    const counts = countGroups();
    types.innerHTML = availableFilters().map((meta) => {
      const active = state.kind === meta.key;
      return `<button type="button" class="media-type-button is-${meta.key}${active ? " is-active" : ""}" data-kind="${meta.key}" aria-pressed="${active}">
        ${meta.key !== "all" ? `<span class="media-type-glyph">${meta.glyph}</span>` : ""}
        <span>${esc(meta.label)}</span><small>${counts[meta.key] || 0}</small>
      </button>`;
    }).join("");
  }

  function renderActiveFilters() {
    const chips = [];
    if (state.query) chips.push(["query", `Recherche : ${state.query}`]);
    if (state.person) chips.push(["person", `Personne : ${state.person}`]);
    if (state.author) chips.push(["author", `Auteur : ${state.author}`]);
    if (state.theme) chips.push(["theme", `Thème : ${state.theme}`]);
    if (state.concept) chips.push(["concept", `Concept : ${state.concept}`]);
    if (state.level) chips.push(["level", `Niveau : ${LEVEL_LABELS[state.level] || state.level}`]);
    if (state.difficulty) chips.push(["difficulty", `Difficulté : ${DIFFICULTY_LABELS[state.difficulty] || state.difficulty}`]);
    if (state.duration) chips.push(["duration", `Durée : ${DURATION_LABELS[state.duration] || state.duration}`]);
    if (state.usage) chips.push(["usage", `Usage : ${USAGE_LABELS[state.usage] || state.usage}`]);
    if (state.dossier) {
      const dossier = dossiers.find((item) => item.id === state.dossier);
      chips.push(["dossier", `Dossier : ${dossier?.title || state.dossier}`]);
    }
    if (state.pinnedOnly) chips.push(["pinned", "Favoris"]);

    activeFilters.hidden = !chips.length;
    activeFilters.innerHTML = chips.map(([key, label]) => `<button class="media-filter-chip" type="button" data-clear-filter="${key}">${esc(label)} <span>×</span></button>`).join("");
    resetButton.hidden = !chips.length && state.kind === "all";
  }

  function uniqueAuthors() {
    return [...new Set(scopedResources().map((item) => item.creator).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  }

  function uniqueConcepts() {
    const counts = new Map();
    scopedResources().forEach((item) => directConcepts(item).forEach((concept) => counts.set(concept, (counts.get(concept) || 0) + 1)));
    const priority = new Map(PROGRAM_NOTIONS.map((name, index) => [name, index]));
    return [...counts.keys()].sort((a, b) => (priority.get(a) ?? 99) - (priority.get(b) ?? 99) || a.localeCompare(b, "fr"));
  }

  function fillSelect(select, options, value) {
    if (!select) return;
    const first = select.options[0]?.outerHTML || '<option value="">Tous</option>';
    select.innerHTML = first + options.map(([key, label]) => `<option value="${esc(key)}">${esc(label)}</option>`).join("");
    select.value = value || "";
  }

  function renderAdvancedFilters() {
    if (!advancedFilters || !advancedToggle) return;
    advancedFilters.hidden = !state.advancedOpen;
    advancedToggle.setAttribute("aria-expanded", String(state.advancedOpen));
    fillSelect(authorFilter, uniqueAuthors().map((name) => [name, name]), state.author);
    fillSelect(conceptFilter, uniqueConcepts().map((name) => [name, name]), state.concept);
    fillSelect(levelFilter, Object.entries(LEVEL_LABELS), state.level);
    if (difficultyField) difficultyField.hidden = state.kind !== "texte";
    fillSelect(difficultyFilter, Object.entries(DIFFICULTY_LABELS), state.difficulty);
    fillSelect(durationFilter, Object.entries(DURATION_LABELS), state.duration);
    fillSelect(usageFilter, Object.entries(USAGE_LABELS), state.usage);
  }

  function getEmbed(item) {
    if (item.embedUrl) return { url: item.embedUrl, type: item.embedType || "generic" };
    const url = String(item.url || "");
    try {
      const parsed = new URL(url);
      if (/(^|\.)youtube\.com$/.test(parsed.hostname) || /(^|\.)youtu\.be$/.test(parsed.hostname)) {
        let id = parsed.hostname.includes("youtu.be") ? parsed.pathname.split("/").filter(Boolean)[0] : parsed.searchParams.get("v");
        if (!id && parsed.pathname.includes("/embed/")) id = parsed.pathname.split("/embed/")[1]?.split("/")[0];
        if (id) return { url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`, type: "youtube" };
      }
      if (/(^|\.)soundcloud\.com$/.test(parsed.hostname)) {
        return {
          url: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`,
          type: "soundcloud"
        };
      }
    } catch (_) {}
    return null;
  }

  function sourceLine(item) {
    if (item.kind === "cours") return [item.sourceType, item.format, item.module || item.subject].filter(Boolean).slice(0, 3).join(" · ");
    const parts = [item.creator, item.subtitle || item.source].filter(Boolean);
    return parts.slice(0, 2).join(" · ");
  }

  function resourceAction(item) {
    const embed = getEmbed(item);
    const group = groupOf(item);
    const label = actionLabel(item);
    if (group === "mindmap") {
      return `<button class="media-row-action" type="button" data-mindmap-open="${esc(item.id)}">${esc(label)} →</button>`;
    }
    if (embed && ["audio", "video", "cours-video"].includes(group)) {
      return `<button class="media-row-action is-play" type="button" data-play="${esc(item.id)}">▶ ${esc(label)}</button>`;
    }
    const href = resolveUrl(item.url || "#");
    const external = isExternal(item.url);
    return `<a class="media-row-action" href="${esc(href)}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}${external ? " ↗" : ""}</a>`;
  }

  function resourceRow(item, options = {}) {
    const group = groupOf(item);
    const themes = (item.themes || []).slice(0, 2);
    const showKind = options.showKind !== false;
    const courseMeta = group === "cours"
      ? `<div class="media-course-row-meta"><span class="media-course-domain-badge">${esc(item.formation || "Cours")}</span><span class="media-course-theme-badge">${esc(courseThemeLabel(item))}</span></div>`
      : "";
    return `<article class="media-resource-row is-${group}${courseClass(item)}" data-open-resource="${esc(item.id)}" tabindex="0" role="link" aria-label="${esc(`${actionLabel(item)} : ${item.title}`)}">
      <span class="media-row-icon" aria-hidden="true">${icon(item.kind)}</span>
      <div class="media-row-main">
        ${showKind ? `<span class="media-row-kind">${esc(groupLabel(item))}</span>` : ""}
        ${courseMeta}
        <h3>${esc(item.title)}</h3>
        ${sourceLine(item) ? `<p>${esc(sourceLine(item))}</p>` : ""}
        ${pedagogyMeta(item)}
      </div>
      <div class="media-row-themes">${themes.map((theme) => `<span>${esc(theme)}</span>`).join("")}</div>
      <div class="media-row-tools">
        <button class="media-row-relate" type="button" data-resource-details="${esc(item.id)}" aria-label="Explorer les connexions de cette ressource">Relier</button>
        <button class="media-row-pin${state.pinned.has(item.id) ? " is-pinned" : ""}" type="button" data-pin="${esc(item.id)}" aria-label="${state.pinned.has(item.id) ? "Retirer des favoris" : "Ajouter aux favoris"}">${state.pinned.has(item.id) ? "★" : "☆"}</button>
        ${resourceAction(item)}
      </div>
    </article>`;
  }

  function browseGroup(item, kind) {
    if (kind === "mindmap") return ({ programme: "Programme & notions", reperes: "Repères conceptuels", methodologie: "Méthodologie" })[item.mindmapCategory] || "Autres";
    if (kind === "cours") return [item.formation, item.year].filter(Boolean).join(" · ") || item.subject || "Cours non classés";
    if (kind === "audio") return item.source || item.creator || "Autres";
    if (kind === "video") {
      const type = videoType(item);
      if (type === "cours-video") return "Cours vidéo";
      return type === "cours" ? "Cours & conférences" : "Films & extraits";
    }
    return item.creator || item.source || "Sans auteur";
  }

  function homeShelf(kind, list) {
    const meta = filterMeta.get(kind);
    const samples = list.slice(0, 3);
    return `<section class="media-shelf is-${kind}">
      <button class="media-shelf-head" type="button" data-kind-focus="${kind}">
        <span class="media-shelf-icon" aria-hidden="true">${icon(kind)}</span>
        <span class="media-shelf-title"><strong>${esc(meta.plural)}</strong><small>${esc(meta.description)}</small></span>
        <span class="media-shelf-count">${list.length}</span>
        <span class="media-shelf-arrow" aria-hidden="true">→</span>
      </button>
      <div class="media-shelf-preview">
        ${samples.length ? samples.map((item) => `<button type="button" class="media-shelf-item" data-open-resource="${esc(item.id)}"><span>${esc(item.title)}</span><small>${esc(item.creator || item.source || "")}</small></button>`).join("") : '<p class="media-shelf-empty">Aucune ressource pour l’instant.</p>'}
      </div>
    </section>`;
  }

  function courseHomeShelf(list) {
    const meta = filterMeta.get("cours");
    const groups = new Map();
    list.forEach((item) => {
      const name = item.formation || "Autres";
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(item);
    });
    return `<section class="media-shelf is-cours is-course-split">
      <button class="media-shelf-head" type="button" data-kind-focus="cours">
        <span class="media-shelf-icon" aria-hidden="true">${icon("cours")}</span>
        <span class="media-shelf-title"><strong>${esc(meta.plural)}</strong><small>${esc(meta.description)}</small></span>
        <span class="media-shelf-count">${list.length}</span>
        <span class="media-shelf-arrow" aria-hidden="true">→</span>
      </button>
      <div class="media-course-home-branches">
        ${[...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0],"fr")).map(([formation, entries]) => {
          const sample = entries[0] || {};
          const path = [sample.degree, sample.year, sample.semester].filter(Boolean).join(" · ");
          return `<button type="button" class="is-domain-${courseDomain(sample)}" data-kind-focus="cours"><strong>${esc(formation)}</strong><small>${entries.length} document${entries.length > 1 ? "s" : ""}${path ? ` · ${esc(path)}` : ""}</small></button>`;
        }).join("") || '<p class="media-shelf-empty">Aucun cours pour l’instant.</p>'}
      </div>
    </section>`;
  }

  function videoHomeShelf(list) {
    const films = list.filter((item) => videoType(item) === "film");
    const courses = list.filter((item) => videoType(item) === "cours");
    const meta = filterMeta.get("video");
    return `<section class="media-shelf is-video is-video-split">
      <button class="media-shelf-head" type="button" data-kind-focus="video">
        <span class="media-shelf-icon" aria-hidden="true">${icon("video")}</span>
        <span class="media-shelf-title"><strong>${esc(meta.plural)}</strong><small>${esc(meta.description)}</small></span>
        <span class="media-shelf-count">${list.length}</span><span class="media-shelf-arrow" aria-hidden="true">→</span>
      </button>
      <div class="media-video-branches">
        <button type="button" data-video-branch="film"><strong>Films & extraits</strong><small>${films.length} ressource${films.length > 1 ? "s" : ""}</small></button>
        <button type="button" data-video-branch="cours"><strong>Cours & conférences</strong><small>${courses.length} ressource${courses.length > 1 ? "s" : ""}</small></button>
      </div>
    </section>`;
  }


  const MINDMAP_CATEGORY_META = {
    programme: { label: "Programme & notions", description: "Programme, architecture des notions et connexions conceptuelles." },
    reperes: { label: "Repères conceptuels", description: "Repères structurants associés aux notions et aux thèmes du programme." },
    methodologie: { label: "Méthodologie", description: "Cartes de méthode pour analyser, problématiser et construire un travail philosophique." },
    custom: { label: "Mes cartes", description: "Mind-maps personnelles importées ou sauvegardées dans ce navigateur." }
  };

  function mindmapNodeCount(tree) {
    let count = 0;
    const visit = (entry) => {
      if (!entry) return;
      count += 1;
      if (typeof entry === "object") (entry.children || []).forEach(visit);
    };
    visit(tree);
    return Math.max(0, count - 1);
  }

  function mindmapNodeMatches(entry, query) {
    if (!query) return true;
    if (!entry) return false;
    if (typeof entry === "string") return normalize(entry).includes(query);
    if (normalize([entry.label, entry.note].filter(Boolean).join(" ")).includes(query)) return true;
    return (entry.children || []).some((child) => mindmapNodeMatches(child, query));
  }

  function mindmapEntry(entry) {
    return typeof entry === "string" ? { label: entry } : (entry || { label: "" });
  }

  function mindmapOwnMatches(entry, query) {
    if (!query) return false;
    const item = mindmapEntry(entry);
    return normalize([item.label, item.note].filter(Boolean).join(" ")).includes(query);
  }

  function mindmapEntryAtPath(tree, path) {
    if (!tree || !path || path === "root") return tree || null;
    let node = tree;
    for (const part of String(path).split(".")) {
      const index = Number(part);
      const children = mindmapEntry(node).children || [];
      if (!Number.isInteger(index) || !children[index]) return null;
      node = children[index];
    }
    return node;
  }

  function mindmapChildPath(parentPath, index) {
    return !parentPath || parentPath === "root" ? String(index) : `${parentPath}.${index}`;
  }

  function mindmapPathLabels(tree, path) {
    const labels = [];
    if (!tree) return labels;
    labels.push(mindmapEntry(tree).label || "Mind-map");
    if (!path || path === "root") return labels;
    let node = tree;
    String(path).split(".").forEach((part) => {
      const index = Number(part);
      const children = mindmapEntry(node).children || [];
      node = children[index];
      if (node) labels.push(mindmapEntry(node).label || "");
    });
    return labels.filter(Boolean);
  }

  function mindmapPathPrefixes(path) {
    if (!path || path === "root") return [];
    const parts = String(path).split(".");
    return parts.map((_, index) => parts.slice(0, index + 1).join("."));
  }

  function mindmapExpandablePaths(tree) {
    const paths = [];
    const visit = (entry, path) => {
      const item = mindmapEntry(entry);
      const children = item.children || [];
      if (path !== "root" && children.length) paths.push(path);
      children.forEach((child, index) => visit(child, mindmapChildPath(path, index)));
    };
    if (tree) visit(tree, "root");
    return paths;
  }

  function mindmapFlatNodes(tree) {
    const rows = [];
    const visit = (entry, path, depth = 0) => {
      const item = mindmapEntry(entry);
      rows.push({ path, entry: item, depth });
      (item.children || []).forEach((child, index) => visit(child, mindmapChildPath(path, index), depth + 1));
    };
    if (tree) visit(tree, "root");
    return rows;
  }

  function canonicalMindmapLabel(value) {
    return normalize(String(value || "")
      .replace(/^\s*\d+[.)-]?\s*/u, "")
      .replace(/^\s*[\/—–-]+\s*/u, "")
      .replace(/^(le|la|les|l'|l’|un|une|des)\s+/iu, "")
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim());
  }

  function readMindmapSession(id) {
    const all = readMindmapJson(MINDMAP_SESSION_KEY, {});
    return all && typeof all === "object" ? (all[id] || null) : null;
  }

  let mindmapPersistTimer = 0;
  function persistMindmapSessionNow() {
    if (!state.mindmapId) return;
    const all = readMindmapJson(MINDMAP_SESSION_KEY, {});
    const safe = all && typeof all === "object" && !Array.isArray(all) ? all : {};
    safe[state.mindmapId] = {
      scale: state.mindmapScale,
      panX: state.mindmapPanX,
      panY: state.mindmapPanY,
      expanded: [...state.mindmapExpanded],
      focusPath: state.mindmapFocusPath || "",
      relationsVisible: Boolean(state.mindmapRelationsVisible)
    };
    try { localStorage.setItem(MINDMAP_SESSION_KEY, JSON.stringify(safe)); } catch (_) {}
  }

  function queueMindmapPersist() {
    clearTimeout(mindmapPersistTimer);
    mindmapPersistTimer = window.setTimeout(persistMindmapSessionNow, 180);
  }

  function initializeMindmapExpansion(item, force = false) {
    if (!item?.tree) return;
    if (!force && state.mindmapExpansionOwner === item.id) return;
    state.mindmapExpansionOwner = item.id;
    const saved = readMindmapSession(item.id);
    const validPaths = new Set(mindmapExpandablePaths(item.tree));
    if (saved?.expanded && Array.isArray(saved.expanded)) {
      state.mindmapExpanded = new Set(saved.expanded.filter((path) => validPaths.has(path)));
    } else {
      state.mindmapExpanded = new Set();
      (item.tree.children || []).forEach((child, index) => {
        if ((mindmapEntry(child).children || []).length) state.mindmapExpanded.add(String(index));
      });
    }
    state.mindmapSelectedPath = "";
    state.mindmapFocusPath = saved?.focusPath && mindmapEntryAtPath(item.tree, saved.focusPath) ? saved.focusPath : "";
    state.mindmapScale = Number.isFinite(saved?.scale) ? Math.max(0.32, Math.min(2.2, saved.scale)) : 1;
    state.mindmapPanX = Number.isFinite(saved?.panX) ? saved.panX : 0;
    state.mindmapPanY = Number.isFinite(saved?.panY) ? saved.panY : 0;
    state.mindmapViewportRestored = Boolean(saved && Number.isFinite(saved.scale));
    state.mindmapRelationsVisible = saved?.relationsVisible !== false;
    state.mindmapRevision = false;
    state.mindmapRevisionRevealed = new Set();
    state.mindmapRevisionScope = "";
    state.mindmapLinkSourcePath = "";
  }

  function mindmapPathsRelated(pathA, pathB) {
    if (!pathA || !pathB || pathA === "root" || pathB === "root") return true;
    return pathA === pathB || pathA.startsWith(`${pathB}.`) || pathB.startsWith(`${pathA}.`);
  }

  function mindmapFocusedRoot(item) {
    const path = state.mindmapFocusPath && mindmapEntryAtPath(item?.tree, state.mindmapFocusPath) ? state.mindmapFocusPath : "root";
    return { path, entry: mindmapEntryAtPath(item?.tree, path) || item?.tree };
  }

  function mindmapRevisionShouldHide(path, relativeDepth) {
    if (!state.mindmapRevision || state.mindmapRevisionRevealed.has(path)) return false;
    const focused = Boolean(state.mindmapFocusPath);
    return focused ? relativeDepth >= 0 : relativeDepth >= 1;
  }

  function mindmapRevisionProgress(item) {
    if (!state.mindmapRevision) return { hidden: 0, revealed: 0, total: 0 };
    const root = mindmapFocusedRoot(item);
    const rows = [];
    const visit = (entry, path, depth) => {
      (mindmapEntry(entry).children || []).forEach((child, index) => {
        const childPath = mindmapChildPath(path, index);
        const childDepth = depth + 1;
        if (mindmapRevisionShouldHide(childPath, childDepth - 1) || state.mindmapRevisionRevealed.has(childPath)) rows.push(childPath);
        visit(child, childPath, childDepth);
      });
    };
    visit(root.entry, root.path, 0);
    const revealed = rows.filter((path) => state.mindmapRevisionRevealed.has(path)).length;
    return { hidden: Math.max(0, rows.length - revealed), revealed, total: rows.length };
  }

  function renderMindmapNode(entry, query = "", depth = 0, branch = 0, path = "") {
    if (!entry || !mindmapNodeMatches(entry, query)) return "";
    const item = mindmapEntry(entry);
    const children = (item.children || []).map((child, index) => ({ child, index })).filter(({ child }) => mindmapNodeMatches(child, query));
    const hidden = mindmapRevisionShouldHide(path, depth);
    const label = hidden ? "À retrouver…" : (item.label || "");
    const note = !hidden && item.note ? `<small>${esc(item.note)}</small>` : "";
    const hit = query && mindmapOwnMatches(item, query) ? " is-search-hit" : "";
    const color = mindmapBranchColor(branch);
    const hiddenClass = hidden ? " is-revision-hidden" : "";
    const revealAttr = hidden ? ` data-mindmap-reveal-path="${esc(path)}"` : "";
    if (!children.length) {
      return `<div class="media-mindmap-leaf${hit}${hiddenClass}" data-mindmap-plan-path="${esc(path)}"${revealAttr} style="--mindmap-depth:${Math.min(depth, 8)};--branch:${color}" tabindex="0"><span aria-hidden="true"></span><div><strong>${esc(label)}</strong>${note}</div></div>`;
    }
    return `<details class="media-mindmap-node${hit}${hiddenClass}" ${query || depth < 1 ? "open" : ""} style="--mindmap-depth:${Math.min(depth, 8)};--branch:${color}">
      <summary data-mindmap-plan-path="${esc(path)}"${revealAttr}><span class="media-mindmap-toggle" aria-hidden="true">+</span><div><strong>${esc(label)}</strong>${note}</div><em>${children.length}</em></summary>
      <div class="media-mindmap-children">${children.map(({ child, index }) => renderMindmapNode(child, query, depth + 1, branch, mindmapChildPath(path, index))).join("")}</div>
    </details>`;
  }

  function renderMindmapTree(item, rawQuery = "", showInspector = false) {
    const query = normalize(rawQuery);
    const focused = mindmapFocusedRoot(item);
    const tree = focused.entry;
    if (!tree) return '<p class="media-mindmap-empty">Cette mind-map ne contient pas encore de données.</p>';
    const children = (mindmapEntry(tree).children || []).map((child, index) => ({ child, index, path: mindmapChildPath(focused.path, index) })).filter(({ child }) => mindmapNodeMatches(child, query));
    if (query && !children.length && !mindmapOwnMatches(tree, query)) {
      return `<p class="media-mindmap-empty">Aucun élément ne correspond à « ${esc(rawQuery)} » dans cette mind-map.</p>`;
    }
    const rootBranch = focused.path === "root" ? -1 : Number(String(focused.path).split(".")[0]);
    return `${tree.label ? `<div class="media-mindmap-root" style="--branch:${rootBranch >= 0 ? mindmapBranchColor(rootBranch) : "#51416f"}"><span aria-hidden="true">${icon("mindmap")}</span><strong>${esc(tree.label)}</strong></div>` : ""}
      <div class="media-mindmap-tree">${children.map(({ child, index, path }) => renderMindmapNode(child, query, 0, focused.path === "root" ? index : rootBranch, path)).join("")}</div>
      ${showInspector ? renderMindmapInspector(item, true) : ""}`;
  }

  function buildMindmapGraph(item, rawQuery = "") {
    initializeMindmapExpansion(item);
    const query = normalize(rawQuery);
    const focus = mindmapFocusedRoot(item);
    const tree = focus.entry;
    if (!tree) return { nodes: [], edges: [], width: 1200, height: 760 };

    const root = mindmapEntry(tree);
    const rootPath = focus.path;
    const rootBranch = rootPath === "root" ? -1 : Number(String(rootPath).split(".")[0]);
    const nodes = [{ path: rootPath, entry: root, depth: 0, branch: rootBranch, parent: "", x: 0, y: 0, hasChildren: Boolean((root.children || []).length), expanded: true, graphRoot: true }];
    const edgePairs = [];

    const include = (entry, path, depth, branch, parentPath) => {
      if (query && !mindmapNodeMatches(entry, query)) return null;
      const node = mindmapEntry(entry);
      const children = node.children || [];
      const expanded = Boolean(query) || state.mindmapExpanded.has(path);
      const graphNode = { path, entry: node, depth, branch, parent: parentPath, x: 0, y: 0, hasChildren: Boolean(children.length), expanded, graphRoot: false };
      nodes.push(graphNode);
      edgePairs.push([parentPath, path]);
      if (expanded) {
        children.forEach((child, index) => include(child, mindmapChildPath(path, index), depth + 1, branch, path));
      }
      return graphNode;
    };

    (root.children || []).forEach((child, index) => {
      const path = mindmapChildPath(rootPath, index);
      const branch = rootPath === "root" ? index : rootBranch;
      include(child, path, 1, branch, rootPath);
    });

    const childrenByParent = new Map();
    nodes.forEach((node) => {
      if (!node.parent) return;
      if (!childrenByParent.has(node.parent)) childrenByParent.set(node.parent, []);
      childrenByParent.get(node.parent).push(node);
    });

    const weightMemo = new Map();
    const weightFor = (path) => {
      if (weightMemo.has(path)) return weightMemo.get(path);
      const children = childrenByParent.get(path) || [];
      const value = children.length ? children.reduce((sum, child) => sum + weightFor(child.path), 0) : 1;
      weightMemo.set(path, Math.max(1, value));
      return Math.max(1, value);
    };

    const top = childrenByParent.get(rootPath) || [];
    const totalWeight = Math.max(1, top.reduce((sum, node) => sum + weightFor(node.path), 0));
    let cursor = -Math.PI / 2;
    const radialGap = 235;

    const assign = (node, startAngle, endAngle) => {
      const angle = (startAngle + endAngle) / 2;
      const radius = node.depth * radialGap;
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
      node.angle = angle;
      const children = childrenByParent.get(node.path) || [];
      if (!children.length) return;
      const total = Math.max(1, children.reduce((sum, child) => sum + weightFor(child.path), 0));
      const width = endAngle - startAngle;
      const inset = Math.min(width * 0.08, 0.12);
      let childCursor = startAngle + inset;
      const usable = Math.max(0.08, width - inset * 2);
      children.forEach((child) => {
        const portion = usable * (weightFor(child.path) / total);
        assign(child, childCursor, childCursor + portion);
        childCursor += portion;
      });
    };

    top.forEach((node) => {
      const span = Math.PI * 2 * (weightFor(node.path) / totalWeight);
      assign(node, cursor, cursor + span);
      cursor += span;
    });

    const maxX = Math.max(0, ...nodes.map((node) => Math.abs(node.x)));
    const maxY = Math.max(0, ...nodes.map((node) => Math.abs(node.y)));
    const width = Math.max(1280, Math.ceil(maxX * 2 + 520));
    const height = Math.max(820, Math.ceil(maxY * 2 + 340));
    const nodeMap = new Map(nodes.map((node) => [node.path, node]));
    const edges = edgePairs.map(([from, to]) => ({ from: nodeMap.get(from), to: nodeMap.get(to) })).filter((edge) => edge.from && edge.to);
    return { nodes, edges, width, height, rootPath };
  }

  function mindmapRelatedResources(entry, limit = 6) {
    const node = mindmapEntry(entry);
    const rawLabel = String(node.label || "").replace(/^\s*\d+[.)-]?\s*/u, "").trim();
    const needle = canonicalMindmapLabel(rawLabel);
    if (!needle || needle.length < 3) return [];
    const generic = new Set(["programme", "notions", "philosophie", "methode", "methodologie", "ancien programme", "cours"]);
    if (generic.has(needle)) return [];
    const tokens = needle.split(" ").filter((token) => token.length >= 4);
    return resources.filter((resource) => groupOf(resource) !== "mindmap" && resourceInCurrentAccess(resource)).map((resource) => {
      const title = normalize(resource.title || "");
      const creator = normalize(resource.creator || "");
      const themes = (resource.themes || []).map(normalize);
      const keywords = (resource.keywords || []).map(normalize);
      const people = (resource.people || []).map(normalize);
      const haystack = normalize([resource.title, resource.creator, resource.subtitle, resource.description, resource.source, ...(resource.themes || []), ...(resource.keywords || []), ...(resource.people || [])].filter(Boolean).join(" "));
      let score = 0;
      if (title === needle || title.includes(needle)) score += 9;
      if (themes.some((value) => value === needle || value.includes(needle))) score += 7;
      if (keywords.some((value) => value === needle || value.includes(needle))) score += 6;
      if (people.some((value) => value === needle || value.includes(needle)) || creator.includes(needle)) score += 5;
      tokens.forEach((token) => { if (haystack.includes(token)) score += 1.4; });
      if (haystack.includes(needle)) score += 3;
      return { resource, score };
    }).filter(({ score }) => score >= 4).sort((a, b) => b.score - a.score || String(a.resource.title).localeCompare(String(b.resource.title), "fr")).slice(0, limit).map(({ resource }) => resource);
  }

  function mindmapManualRelationsFor(id) {
    const list = mindmapManualRelations[id];
    return Array.isArray(list) ? list.filter((rel) => rel && rel.from && rel.to) : [];
  }

  function saveMindmapManualRelations() {
    try { localStorage.setItem(MINDMAP_RELATIONS_KEY, JSON.stringify(mindmapManualRelations)); } catch (_) {}
  }

  function addMindmapManualRelation(id, from, to) {
    if (!id || !from || !to || from === to) return;
    const list = mindmapManualRelationsFor(id).slice();
    const exists = list.some((rel) => (rel.from === from && rel.to === to) || (rel.from === to && rel.to === from));
    if (!exists) list.push({ from, to, manual: true });
    mindmapManualRelations[id] = list;
    saveMindmapManualRelations();
  }

  function mindmapRelationsFor(item) {
    if (!item?.tree) return [];
    const rows = mindmapFlatNodes(item.tree);
    const byCanonical = new Map();
    rows.forEach(({ path, entry }) => {
      const key = canonicalMindmapLabel(entry.label);
      if (!key || key.length < 3) return;
      if (!byCanonical.has(key)) byCanonical.set(key, []);
      byCanonical.get(key).push(path);
    });
    const relations = [];
    const add = (from, to, type = "inferred", label = "") => {
      if (!from || !to || from === to) return;
      const key = [from, to].sort().join("|");
      if (relations.some((rel) => rel.key === key)) return;
      relations.push({ key, from, to, type, label });
    };
    const resolveLabel = (value, sourcePath) => {
      const key = canonicalMindmapLabel(value);
      if (!key) return "";
      const exact = (byCanonical.get(key) || []).find((path) => path !== sourcePath);
      if (exact) return exact;
      const candidate = rows.find(({ path, entry }) => path !== sourcePath && (canonicalMindmapLabel(entry.label).includes(key) || key.includes(canonicalMindmapLabel(entry.label))));
      return candidate?.path || "";
    };
    rows.forEach(({ path, entry }) => {
      if (Array.isArray(entry.relations)) entry.relations.forEach((target) => add(path, mindmapEntryAtPath(item.tree, target) ? target : resolveLabel(target, path), "explicit"));
      const note = String(entry.note || "");
      const match = note.match(/liens?\s*:\s*(.+)$/i);
      if (match) match[1].split(/[\/,;·]|\bet\b/i).map((value) => value.trim()).filter(Boolean).forEach((target) => add(path, resolveLabel(target, path), "note", target));
    });
    byCanonical.forEach((paths, key) => {
      if (paths.length > 1 && key.length >= 4) paths.slice(1).forEach((path) => add(paths[0], path, "same-concept"));
    });
    mindmapManualRelationsFor(item.id).forEach((rel) => add(rel.from, rel.to, "manual"));
    return relations;
  }

  function mindmapRelationsForPath(item, path) {
    return mindmapRelationsFor(item).filter((rel) => rel.from === path || rel.to === path).map((rel) => ({ ...rel, other: rel.from === path ? rel.to : rel.from }));
  }

  function renderMindmapInspector(item, isStatic = false) {
    if (!state.mindmapSelectedPath) return "";
    const entry = mindmapEntryAtPath(item.tree, state.mindmapSelectedPath);
    if (!entry) return "";
    const node = mindmapEntry(entry);
    const trail = mindmapPathLabels(item.tree, state.mindmapSelectedPath);
    const related = mindmapRelatedResources(node, 6);
    const relations = mindmapRelationsForPath(item, state.mindmapSelectedPath);
    return `<aside class="media-mindmap-inspector${isStatic ? " is-static" : ""}">
      <button type="button" data-mindmap-focus-clear aria-label="Fermer les détails">×</button>
      <span>Nœud sélectionné</span>
      <strong>${esc(node.label || "")}</strong>
      ${node.note ? `<p>${esc(node.note)}</p>` : ""}
      <small>${trail.map(esc).join(" <i>›</i> ")}</small>
      <div class="media-mindmap-inspector-actions">
        <button type="button" data-mindmap-focus-path="${esc(state.mindmapSelectedPath)}">Focus</button>
        <button type="button" data-mindmap-revision-path="${esc(state.mindmapSelectedPath)}">Réviser cette branche</button>
        <button type="button" data-mindmap-link-start="${esc(state.mindmapSelectedPath)}">Relier à…</button>
      </div>
      ${relations.length ? `<section class="media-mindmap-inspector-section"><h4>Connexions <small>${relations.length}</small></h4><div class="media-mindmap-related-nodes">${relations.slice(0, 7).map((rel) => { const other = mindmapEntryAtPath(item.tree, rel.other); return other ? `<button type="button" data-mindmap-select-path="${esc(rel.other)}"><i aria-hidden="true"></i>${esc(mindmapEntry(other).label || "")}</button>` : ""; }).join("")}</div></section>` : ""}
      ${related.length ? `<section class="media-mindmap-inspector-section"><h4>Ressources liées <small>${related.length}</small></h4><div class="media-mindmap-related-resources">${related.map((resource) => `<button type="button" data-mindmap-related-resource="${esc(resource.id)}"><span>${esc(groupLabel(resource))}</span><strong>${esc(resource.title)}</strong>${resource.creator ? `<small>${esc(resource.creator)}</small>` : ""}</button>`).join("")}</div></section>` : `<em>Aucune ressource directement liée trouvée dans la médiathèque.</em>`}
    </aside>`;
  }

  function renderMindmapLegend(item) {
    const branches = (item?.tree?.children || []).map((entry, index) => ({ entry: mindmapEntry(entry), index }));
    if (branches.length < 2) return "";
    return `<div class="media-mindmap-legend" aria-label="Légende des branches">
      <span>Branches</span>
      <div>${branches.map(({ entry, index }) => `<button type="button" data-mindmap-legend-path="${index}" style="--branch:${mindmapBranchColor(index)}" title="Centrer l’attention sur ${esc(entry.label || `Branche ${index + 1}`)}"><i aria-hidden="true"></i>${esc(entry.label || `Branche ${index + 1}`)}</button>`).join("")}</div>
    </div>`;
  }

  function renderMindmapMap(item, rawQuery = "", compact = false) {
    const query = normalize(rawQuery);
    const graph = buildMindmapGraph(item, rawQuery);
    if (!graph.nodes.length) return '<p class="media-mindmap-empty">Cette mind-map ne contient pas encore de données.</p>';
    if (query && graph.nodes.length === 1 && !mindmapOwnMatches(graph.nodes[0].entry, query)) {
      return `<p class="media-mindmap-empty">Aucun élément ne correspond à « ${esc(rawQuery)} » dans cette mind-map.</p>`;
    }

    const cx = graph.width / 2;
    const cy = graph.height / 2;
    const selected = state.mindmapSelectedPath;
    const branchColor = (branch) => mindmapBranchColor(branch);
    const nodeMap = new Map(graph.nodes.map((node) => [node.path, node]));

    const edges = graph.edges.map(({ from, to }) => {
      const x1 = cx + from.x;
      const y1 = cy + from.y;
      const x2 = cx + to.x;
      const y2 = cy + to.y;
      const color = branchColor(to.branch);
      const dim = selected && !mindmapPathsRelated(to.path, selected) ? " is-dimmed" : "";
      const mx = (x1 + x2) / 2;
      return `<path class="media-mindmap-edge${dim}" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${mx.toFixed(1)} ${y1.toFixed(1)}, ${mx.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" style="--branch:${color}"/>`;
    }).join("");

    const relationEdges = state.mindmapRelationsVisible ? mindmapRelationsFor(item).map((relation) => {
      const from = nodeMap.get(relation.from);
      const to = nodeMap.get(relation.to);
      if (!from || !to) return "";
      const x1 = cx + from.x;
      const y1 = cy + from.y;
      const x2 = cx + to.x;
      const y2 = cy + to.y;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const bend = Math.max(38, Math.min(120, Math.hypot(dx, dy) * .15));
      const nx = -dy / (Math.hypot(dx, dy) || 1);
      const ny = dx / (Math.hypot(dx, dy) || 1);
      const mx = (x1 + x2) / 2 + nx * bend;
      const my = (y1 + y2) / 2 + ny * bend;
      const selectedRelation = selected && (relation.from === selected || relation.to === selected) ? " is-related-selected" : "";
      return `<path class="media-mindmap-relation is-${relation.type}${selectedRelation}" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
    }).join("") : "";

    const nodes = graph.nodes.map((node) => {
      const root = node.graphRoot;
      const color = root ? (node.branch >= 0 ? branchColor(node.branch) : "#51416f") : branchColor(node.branch);
      const hit = query && mindmapOwnMatches(node.entry, query);
      const selectedClass = selected === node.path ? " is-selected" : "";
      const dim = selected && !mindmapPathsRelated(node.path, selected) ? " is-dimmed" : "";
      const hitClass = hit ? " is-search-hit" : "";
      const relativeDepth = Math.max(0, node.depth - 1);
      const hidden = !root && mindmapRevisionShouldHide(node.path, relativeDepth);
      const hiddenClass = hidden ? " is-revision-hidden" : "";
      const label = hidden ? "À retrouver…" : (node.entry.label || "");
      const note = !hidden && node.entry.note ? `<small>${esc(node.entry.note)}</small>` : "";
      const expander = !root && node.hasChildren && !hidden ? `<i aria-hidden="true">${node.expanded ? "−" : "+"}</i>` : (hidden ? `<i aria-hidden="true">?</i>` : "");
      const tag = root ? "div" : "button";
      const attrs = root ? ` data-mindmap-root-path="${esc(node.path)}"` : hidden ? ` type="button" data-mindmap-reveal-path="${esc(node.path)}" aria-label="Révéler ce nœud"` : ` type="button" data-mindmap-node-path="${esc(node.path)}" aria-label="${esc(node.entry.label || "Branche")}${node.hasChildren ? node.expanded ? ", replier" : ", déplier" : ""}"`;
      return `<${tag}${attrs} class="media-mindmap-graph-node${root ? " is-root" : ""}${selectedClass}${dim}${hitClass}${hiddenClass}" style="left:${(cx + node.x).toFixed(1)}px;top:${(cy + node.y).toFixed(1)}px;--branch:${color}">${expander}<span><strong>${esc(label)}</strong>${note}</span></${tag}>`;
    }).join("");

    return `<div class="media-mindmap-map-shell${compact ? " is-compact" : ""}">
      <div class="media-mindmap-map-hint"><span>Glisser pour déplacer</span><span><kbd>Espace</kbd> + glisser depuis un nœud</span><span>Double-clic : focus</span><span>Clic droit : actions</span></div>
      ${renderMindmapLegend(item)}
      <div class="media-mindmap-viewport" data-mindmap-viewport>
        <div class="media-mindmap-stage" data-mindmap-stage style="transform:translate(${state.mindmapPanX}px,${state.mindmapPanY}px) scale(${state.mindmapScale})">
          <div class="media-mindmap-canvas" style="width:${graph.width}px;height:${graph.height}px;transform:translate(-50%,-50%)">
            <svg class="media-mindmap-lines" width="${graph.width}" height="${graph.height}" viewBox="0 0 ${graph.width} ${graph.height}" aria-hidden="true">${edges}${relationEdges}</svg>
            ${nodes}
          </div>
        </div>
      </div>
      ${renderMindmapInspector(item)}
    </div>`;
  }

  function renderMindmapFocusBar(item) {
    if (!state.mindmapFocusPath) return "";
    const labels = mindmapPathLabels(item.tree, state.mindmapFocusPath);
    const prefixes = mindmapPathPrefixes(state.mindmapFocusPath);
    return `<nav class="media-mindmap-focusbar" aria-label="Focus dans la mind-map"><button type="button" data-mindmap-focus-home>Carte complète</button>${prefixes.map((path, index) => `<span aria-hidden="true">›</span><button type="button" data-mindmap-focus-path="${esc(path)}" ${index === prefixes.length - 1 ? 'aria-current="page"' : ""}>${esc(labels[index + 1] || "Branche")}</button>`).join("")}</nav>`;
  }

  function renderMindmapRevisionBar(item) {
    if (!state.mindmapRevision) return "";
    const progress = mindmapRevisionProgress(item);
    return `<div class="media-mindmap-revisionbar"><div><span>Mode révision</span><strong>Rappel actif</strong><p>Les sous-notions sont masquées. Essayez de les retrouver puis cliquez pour révéler.</p></div><div><b>${progress.revealed}/${progress.total}</b><button type="button" data-mindmap-revision-reveal-all>Tout révéler</button><button type="button" data-mindmap-revision-reset>Recommencer</button><button type="button" data-mindmap-revision-off>Quitter</button></div></div>`;
  }

  function renderMindmapLinkBanner(item) {
    if (!state.mindmapLinkSourcePath) return "";
    const source = mindmapEntryAtPath(item.tree, state.mindmapLinkSourcePath);
    return `<div class="media-mindmap-link-banner"><span>Créer une relation depuis <strong>${esc(mindmapEntry(source).label || "ce nœud")}</strong></span><span>Cliquez sur un autre nœud pour terminer.</span><button type="button" data-mindmap-link-cancel>Annuler</button></div>`;
  }

  function renderMindmapContent(item) {
    if (state.mindmapView === "map") return renderMindmapMap(item, state.mindmapQuery);
    if (state.mindmapView === "mixed") {
      return `<div class="media-mindmap-mixed-grid">
        <section class="media-mindmap-mixed-panel"><header><span>Vue schématique</span><strong>Mind-map</strong></header>${renderMindmapMap(item, state.mindmapQuery, true)}</section>
        <section class="media-mindmap-mixed-panel"><header><span>Vue détaillée</span><strong>Plan</strong></header>${renderMindmapTree(item, state.mindmapQuery, false)}</section>
      </div>`;
    }
    return renderMindmapTree(item, state.mindmapQuery, true);
  }

  function persistCustomMindmaps() {
    const list = resources.filter((item) => groupOf(item) === "mindmap" && item.isPersonalMindmap).map((item) => ({
      id: item.id, kind: "mindmap", title: item.title, creator: item.creator || "", subtitle: item.subtitle || "Carte personnelle",
      description: item.description || "", mindmapCategory: "custom", themes: item.themes || ["Philosophie"], people: item.people || [], keywords: item.keywords || ["mind-map"],
      tree: item.tree, isPersonalMindmap: true
    }));
    try { localStorage.setItem(MINDMAP_CUSTOM_KEY, JSON.stringify(list)); } catch (_) {}
  }

  function cloneMindmapData(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  }

  function uniquePersonalMindmapId() {
    return `mindmap:personal:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
  }

  function saveMindmapSnapshot(item) {
    if (!item?.tree) return;
    if (item.isPersonalMindmap) {
      persistCustomMindmaps();
      return item.id;
    }
    const id = uniquePersonalMindmapId();
    const copy = {
      ...cloneMindmapData(item), id, kind: "mindmap", title: `${item.title} — copie personnelle`, subtitle: "Carte personnelle",
      mindmapCategory: "custom", isPersonalMindmap: true
    };
    resources.push(copy); byId.set(id, copy);
    const rels = mindmapManualRelationsFor(item.id);
    if (rels.length) { mindmapManualRelations[id] = cloneMindmapData(rels); saveMindmapManualRelations(); }
    persistCustomMindmaps();
    return id;
  }

  function exportMindmap(item) {
    if (!item?.tree) return;
    const payload = {
      format: "philosophal-mindmap", version: 2,
      mindmap: { title: item.title, creator: item.creator || "", subtitle: item.subtitle || "", description: item.description || "", themes: item.themes || [], keywords: item.keywords || [], tree: item.tree },
      relations: mindmapManualRelationsFor(item.id)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${String(item.title || "mindmap").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "mindmap"}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importMindmapFile() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json"; input.hidden = true;
    input.addEventListener("change", async () => {
      const file = input.files?.[0]; input.remove(); if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const source = parsed?.mindmap || parsed;
        if (!source || typeof source !== "object" || !source.tree || !source.title) throw new Error("Format invalide");
        const id = uniquePersonalMindmapId();
        const item = {
          id, kind: "mindmap", title: String(source.title), creator: String(source.creator || ""), subtitle: String(source.subtitle || "Carte personnelle"),
          description: String(source.description || "Mind-map importée."), mindmapCategory: "custom", themes: Array.isArray(source.themes) ? source.themes : ["Philosophie"],
          people: Array.isArray(source.people) ? source.people : [], keywords: Array.isArray(source.keywords) ? source.keywords : ["mind-map", "import"], tree: cloneMindmapData(source.tree), isPersonalMindmap: true
        };
        resources.push(item); byId.set(id, item);
        if (Array.isArray(parsed.relations)) { mindmapManualRelations[id] = parsed.relations.filter((rel) => rel?.from && rel?.to); saveMindmapManualRelations(); }
        persistCustomMindmaps();
        state.kind = "mindmap"; state.mindmapId = id; state.mindmapExpansionOwner = ""; state.mindmapQuery = ""; render();
      } catch (_) { window.alert("Ce fichier ne correspond pas à une mind-map Philosophal valide."); }
    }, { once: true });
    document.body.appendChild(input); input.click();
  }

  function deletePersonalMindmap(item) {
    if (!item?.isPersonalMindmap) return;
    if (!window.confirm(`Supprimer « ${item.title} » de ce navigateur ?`)) return;
    const index = resources.findIndex((entry) => entry.id === item.id);
    if (index >= 0) resources.splice(index, 1);
    byId.delete(item.id); delete mindmapManualRelations[item.id]; saveMindmapManualRelations(); persistCustomMindmaps();
    state.mindmapId = ""; state.mindmapExpansionOwner = ""; render();
  }

  function renderMindmapDirectory(list) {
    const categoryOrder = ["programme", "reperes", "methodologie", "custom"];
    return `<div class="media-mindmap-library">
      <section class="media-mindmap-intro">
        <div><span>MIND-MAPS</span><h3>Cartes mentales interactives</h3><p>Explorez, focalisez une branche, révisez en rappel actif, visualisez les connexions et reliez chaque notion aux ressources de la médiathèque.</p></div>
        <div class="media-mindmap-library-actions"><button type="button" data-mindmap-import>Importer JSON</button></div>
      </section>
      ${categoryOrder.map((key) => {
        const meta = MINDMAP_CATEGORY_META[key];
        const entries = list.filter((item) => (item.mindmapCategory || (item.isPersonalMindmap ? "custom" : "")) === key);
        if (!entries.length) return "";
        return `<section class="media-mindmap-category">
          <header><div><span>Collection</span><h3>${esc(meta.label)}</h3><p>${esc(meta.description)}</p></div><strong>${entries.length}</strong></header>
          <div class="media-mindmap-grid">
            ${entries.map((item) => `<button class="media-mindmap-card" type="button" data-mindmap-open="${esc(item.id)}">
              <span class="media-mindmap-card-icon" aria-hidden="true">${icon("mindmap")}</span>
              <span class="media-mindmap-card-copy"><small>${esc(item.isPersonalMindmap ? "Carte personnelle" : (item.subtitle || meta.label))}</small><strong>${esc(item.title)}</strong><em>${esc(item.description || "")}</em></span>
              <span class="media-mindmap-card-meta">${mindmapNodeCount(item.tree)} éléments <i aria-hidden="true">→</i></span>
            </button>`).join("")}
          </div>
        </section>`;
      }).join("")}
    </div>`;
  }

  function renderMindmapViewer(item) {
    if (!item) return renderMindmapDirectory(filteredResources().filter((entry) => groupOf(entry) === "mindmap"));
    initializeMindmapExpansion(item);
    const category = MINDMAP_CATEGORY_META[item.mindmapCategory] || { label: "Mind-map" };
    const isMapView = state.mindmapView === "map" || state.mindmapView === "mixed";
    const relationsCount = mindmapRelationsFor(item).length;
    return `<section class="media-mindmap-workspace${state.mindmapFullscreen ? " is-pseudo-fullscreen" : ""}" data-mindmap-workspace>
      <div class="media-mindmap-topline"><button class="media-mindmap-back" type="button" data-mindmap-back>← Toutes les mind-maps</button><div class="media-mindmap-data-actions"><button type="button" data-mindmap-save>${item.isPersonalMindmap ? "Sauvegarder" : "Sauvegarder une copie"}</button><button type="button" data-mindmap-export>Exporter JSON</button><button type="button" data-mindmap-import>Importer</button>${item.isPersonalMindmap ? '<button class="is-danger" type="button" data-mindmap-delete>Supprimer</button>' : ""}</div></div>
      <header class="media-mindmap-workspace-head">
        <div><span>${esc(item.isPersonalMindmap ? "Carte personnelle" : category.label)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description || "")}</p></div>
        <strong>${mindmapNodeCount(item.tree)}<small> éléments</small></strong>
      </header>
      ${renderMindmapFocusBar(item)}
      ${renderMindmapRevisionBar(item)}
      ${renderMindmapLinkBanner(item)}
      <div class="media-mindmap-viewbar">
        <div class="media-mindmap-view-controls">
          <div class="media-mindmap-view-switch" role="group" aria-label="Mode d’affichage de la mind-map">
            <button type="button" data-mindmap-view="plan" aria-pressed="${state.mindmapView === "plan"}"><span aria-hidden="true">☷</span> Plan</button>
            <button type="button" data-mindmap-view="map" aria-pressed="${state.mindmapView === "map"}"><span aria-hidden="true">⌘</span> Mind-map</button>
            <button type="button" data-mindmap-view="mixed" aria-pressed="${state.mindmapView === "mixed"}"><span aria-hidden="true">◫</span> Mixte</button>
          </div>
          <div class="media-mindmap-palette-switch" role="group" aria-label="Couleurs de la mind-map">
            <button type="button" data-mindmap-palette="color" aria-pressed="${state.mindmapPalette === "color"}"><span class="media-mindmap-palette-dots" aria-hidden="true"><i></i><i></i><i></i></span> Couleurs</button>
            <button type="button" data-mindmap-palette="violet" aria-pressed="${state.mindmapPalette === "violet"}"><span class="media-mindmap-palette-one" aria-hidden="true"></span> Violet</button>
          </div>
        </div>
        <small>${state.mindmapView === "plan" ? "Lecture linéaire, rapide et précise." : state.mindmapView === "map" ? "Vue spatiale : double-clic pour focaliser une branche." : "Schéma et plan détaillé réunis."}</small>
      </div>
      <div class="media-mindmap-toolbar">
        <label class="media-mindmap-search">
          <span class="sr-only">Rechercher dans cette mind-map</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 4.5 4.5"></path></svg>
          <input type="search" data-mindmap-search value="${esc(state.mindmapQuery)}" autocomplete="off" spellcheck="false" placeholder="Rechercher dans cette carte…">
        </label>
        <div class="media-mindmap-toolbar-actions">
          <button type="button" data-mindmap-expand>Tout ouvrir</button>
          <button type="button" data-mindmap-collapse>Tout fermer</button>
          <button type="button" data-mindmap-revision-toggle class="${state.mindmapRevision ? "is-active" : ""}">Révision</button>
          ${isMapView ? `<button type="button" data-mindmap-relations-toggle class="${state.mindmapRelationsVisible ? "is-active" : ""}" title="Afficher ou masquer les relations transversales">Relations <small>${relationsCount}</small></button><span class="media-mindmap-zoom-group"><button type="button" data-mindmap-zoom-out aria-label="Dézoomer">−</button><span class="media-mindmap-zoom-value" data-mindmap-zoom-value>${Math.round(state.mindmapScale * 100)}%</span><button type="button" data-mindmap-zoom-in aria-label="Zoomer">+</button><button type="button" data-mindmap-fit>Ajuster</button><button type="button" data-mindmap-center>Centrer</button></span>` : ""}
          <button class="media-mindmap-fullscreen-button${state.mindmapFullscreen ? " is-active" : ""}" type="button" data-mindmap-fullscreen aria-label="${state.mindmapFullscreen ? "Quitter le plein écran" : "Afficher la mind-map en plein écran"}"><span aria-hidden="true">⛶</span><b>${state.mindmapFullscreen ? "Réduire" : "Plein écran"}</b></button>
        </div>
      </div>
      <div data-mindmap-view-shell>${renderMindmapContent(item)}</div>
      <div class="media-mindmap-shortcuts"><span><kbd>F</kbd> plein écran</span><span><kbd>0</kbd> ajuster</span><span><kbd>R</kbd> recentrer</span><span><kbd>+</kbd>/<kbd>−</kbd> zoom</span><span><kbd>Espace</kbd> + glisser</span><span>double-clic : focus</span><span>clic droit : actions</span></div>
    </section>`;
  }

  function renderVideoDirectory(list, initialBranch = "") {
    const branches = [
      ["film", "Films & extraits", "Extraits de films, documentaires et ressources vidéo liées aux thèmes ou à vos centres d’intérêt."],
      ["cours", "Cours & conférences", "Cours filmés, conférences, séminaires, entretiens et interventions savantes."]
    ];
    return `<div class="media-video-directory">${branches.map(([key, title, description]) => {
      const entries = list.filter((item) => videoType(item) === key);
      return `<section class="media-video-branch${initialBranch === key ? " is-highlighted" : ""}" data-video-section="${key}">
        <header><div><span>${key === "film" ? "FILM" : "COURS"}</span><h3>${title}</h3><p>${description}</p></div><strong>${entries.length}</strong></header>
        ${entries.length ? `<div class="media-resource-list">${entries.map((item) => resourceRow(item, { showKind: false })).join("")}</div>` : '<p class="media-branch-empty">Aucune ressource dans cette catégorie pour l’instant.</p>'}
      </section>`;
    }).join("")}</div>`;
  }

  function renderCourseDirectory(list) {
    if (!list.length) return `<section class="media-course-empty"><span>COURS ÉCRITS</span><h3>Votre bibliothèque de cours est prête.</h3><p>Les documents sont stockés en texte léger et chargés seulement à l’ouverture.</p></section>`;

    const formationGroups = new Map();
    list.forEach((item) => {
      const formation = item.formation || "Formation non précisée";
      if (!formationGroups.has(formation)) formationGroups.set(formation, []);
      formationGroups.get(formation).push(item);
    });

    const moduleOrder = new Map([
      ["CM — Thèmes de psychologie", 1],
      ["CM — Histoire de la psychologie", 2],
      ["TD — Histoire & Thème", 3]
    ]);

    return `<div class="media-course-library">${[...formationGroups.entries()]
      .sort((a,b)=>a[0].localeCompare(b[0],"fr"))
      .map(([formation, entries]) => {
        const sample = entries[0];
        const domain = courseDomain(sample);
        const path = [sample.degree, sample.year, sample.semester].filter(Boolean).join(" · ");
        const ueGroups = new Map();
        entries.forEach((item) => {
          const ue = item.ue || "Enseignement non précisé";
          if (!ueGroups.has(ue)) ueGroups.set(ue, []);
          ueGroups.get(ue).push(item);
        });

        return `<section class="media-course-formation is-domain-${domain}">
          <header class="media-course-formation-head">
            <div><span>Formation</span><h3>${esc(formation)}</h3><p>${esc(path)}</p></div>
            <strong>${entries.length}<small> documents</small></strong>
          </header>
          ${[...ueGroups.entries()].map(([ue, ueEntries]) => {
            const modules = new Map();
            ueEntries.forEach((item) => {
              const module = item.module || item.subject || "Cours";
              if (!modules.has(module)) modules.set(module, []);
              modules.get(module).push(item);
            });
            return `<section class="media-course-ue">
              <header><span>UE</span><h4>${esc(ue)}</h4></header>
              <div class="media-course-modules">
                ${[...modules.entries()].sort((a,b)=>(moduleOrder.get(a[0])||99)-(moduleOrder.get(b[0])||99) || a[0].localeCompare(b[0],"fr")).map(([module, moduleEntries]) => {
                  const themeGroups = new Map();
                  moduleEntries.forEach((item) => {
                    const theme = courseThemeKey(item);
                    if (!themeGroups.has(theme)) themeGroups.set(theme, []);
                    themeGroups.get(theme).push(item);
                  });
                  return `<details class="media-course-module" open>
                    <summary><div><span>${esc(module.startsWith("TD") ? "TD" : "CM")}</span><strong>${esc(module.replace(/^(?:CM|TD)\s*[—-]\s*/, ""))}</strong></div><small>${moduleEntries.length} document${moduleEntries.length > 1 ? "s" : ""}</small><i aria-hidden="true">+</i></summary>
                    <div class="media-course-module-body">
                      ${[...themeGroups.entries()].map(([theme, themeEntries]) => `<section class="media-course-theme is-theme-${theme}">
                        <header><span class="media-course-theme-dot" aria-hidden="true"></span><strong>${esc(courseThemeLabel(themeEntries[0]))}</strong><small>${themeEntries.length}</small></header>
                        <div class="media-resource-list">${themeEntries.sort((a,b)=>(a.sequence||999)-(b.sequence||999) || a.title.localeCompare(b.title,"fr")).map((item)=>resourceRow(item,{showKind:false})).join("")}</div>
                      </section>`).join("")}
                    </div>
                  </details>`;
                }).join("")}
              </div>
            </section>`;
          }).join("")}
        </section>`;
      }).join("")}</div>`;
  }

  function renderHome() {
    const grouped = new Map(["texte", "livre", "manuel", "audio", "video", "cours", "cours-video", "mindmap"].map((kind) => [kind, []]));
    scopedResources().forEach((item) => {
      const group = groupOf(item);
      if (grouped.has(group)) grouped.get(group).push(item);
    });
    grouped.forEach((list) => list.sort((a, b) => a.title.localeCompare(b.title, "fr")));

    const pinned = scopedResources().filter((item) => state.pinned.has(item.id)).slice(0, 5);

    home.innerHTML = `
      ${pinned.length ? `<section class="media-resume"><div class="media-resume-head"><span>Favoris</span><small>${pinned.length} ressource${pinned.length > 1 ? "s" : ""}</small></div><div class="media-resume-list">${pinned.map((item) => resourceRow(item, { showKind: true })).join("")}</div></section>` : ""}
      <div class="media-shelves">
        ${availableFilters().filter((meta) => meta.key !== "all").map(({ key: kind }) => kind === "video" ? videoHomeShelf(grouped.get(kind)) : kind === "cours" ? courseHomeShelf(grouped.get(kind)) : homeShelf(kind, grouped.get(kind))).join("")}
      </div>`;
  }

  function renderGroupedSections(list) {
    const order = ["texte", "livre", "manuel", "audio", "video", "cours", "cours-video", "mindmap"];
    const grouped = new Map(order.map((kind) => [kind, []]));
    list.forEach((item) => {
      const group = groupOf(item);
      if (grouped.has(group)) grouped.get(group).push(item);
    });

    return order.map((kind) => {
      const entries = grouped.get(kind);
      if (!entries.length) return "";
      const meta = filterMeta.get(kind);
      const sectionKey = `results:${kind}`;
      const expanded = state.expandedSections.has(sectionKey);
      const visible = expanded ? entries : entries.slice(0, 8);
      return `<section class="media-result-section is-${kind}">
        <header class="media-result-section-head"><div><span class="media-section-icon">${icon(kind)}</span><h3>${esc(meta.plural)}</h3></div><small>${entries.length}</small></header>
        <div class="media-resource-list">${visible.map((item) => resourceRow(item, { showKind: ["video", "cours-video"].includes(kind) })).join("")}</div>
        ${entries.length > 8 ? `<button class="media-section-more" type="button" data-expand-section="${sectionKey}">${expanded ? "Réduire" : `Afficher les ${entries.length} ${meta.plural.toLowerCase()}`}</button>` : ""}
      </section>`;
    }).join("");
  }

  function renderDirectory(list, kind) {
    if (list.length <= 12) {
      return `<div class="media-resource-list is-standalone">${list.map((item) => resourceRow(item, { showKind: false })).join("")}</div>`;
    }

    const groups = new Map();
    list.forEach((item) => {
      const label = browseGroup(item, kind);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(item);
    });

    const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
    return `<div class="media-directory">${sorted.map(([label, entries]) => `<details class="media-directory-group is-${kind}">
      <summary><span>${esc(label)}</span><small>${entries.length} ressource${entries.length > 1 ? "s" : ""}</small><i aria-hidden="true">+</i></summary>
      <div class="media-resource-list">${entries.map((item) => resourceRow(item, { showKind: false })).join("")}</div>
    </details>`).join("")}</div>`;
  }

  function renderManualDirectory(list) {
    const groups = new Map();

    list.forEach((item) => {
      let key;
      let label;

      if (item.manualGroup === "annales") {
        key = "00-annales";
        label = "Annales";
      } else if (item.manualGroup === "reperes") {
        key = "05-reperes-conceptuels";
        label = "Repères conceptuels";
      } else if (item.manualGroup === "sujets") {
        key = "06-sujets-philosophie";
        label = "Recueils de sujets";
      } else if (item.manualGroup === "methodologie") {
        key = "07-methodologie";
        label = "Méthodologie philosophique";
      } else if (item.manualGroup === "technologique") {
        key = `20-tech-${normalize(item.publisher || item.creator || "")}`;
        label = `Série technologique · ${item.publisher || item.creator || "Autres"}`;
      } else {
        key = `10-general-${normalize(item.publisher || item.creator || "")}`;
        label = item.publisher || item.creator || "Autres éditeurs";
      }

      if (!groups.has(key)) groups.set(key, { label, entries: [] });
      groups.get(key).entries.push(item);
    });

    const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));

    return `<div class="media-directory is-manual-directory">${sorted.map(([key, group]) => {
      group.entries.sort((a, b) => (Number(a.year) || 9999) - (Number(b.year) || 9999) || a.title.localeCompare(b.title, "fr"));
      if (key === "07-methodologie") {
        const subgroups = new Map();
        group.entries.forEach((item) => {
          const sublabel = item.manualSubgroup || item.creator || "Autres";
          if (!subgroups.has(sublabel)) subgroups.set(sublabel, []);
          subgroups.get(sublabel).push(item);
        });
        const subgroupOrder = ["ASP", "Maxicours", "Studyrama", "Méthodologie de manuels", "Kartable", "Lycée / FAC"];
        const sortedSubgroups = [...subgroups.entries()].sort((a, b) => {
          const ai = subgroupOrder.indexOf(a[0]);
          const bi = subgroupOrder.indexOf(b[0]);
          if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          return a[0].localeCompare(b[0], "fr");
        });
        return `<details class="media-directory-group is-manuel is-manual-methodology" open>
          <summary>
            <span>${esc(group.label)}</span>
            <small>${group.entries.length} références · ${sortedSubgroups.length} sources</small>
            <i aria-hidden="true">+</i>
          </summary>
          <div class="media-manual-subgroups">
            ${sortedSubgroups.map(([sublabel, entries]) => `<details class="media-manual-subgroup">
              <summary><span>${esc(sublabel)}</span><small>${entries.length} document${entries.length > 1 ? "s" : ""}</small><i aria-hidden="true">+</i></summary>
              <div class="media-resource-list">${entries.map((item) => resourceRow(item, { showKind: false })).join("")}</div>
            </details>`).join("")}
          </div>
        </details>`;
      }
      return `<details class="media-directory-group is-manuel" ${["00-annales", "05-reperes-conceptuels", "06-sujets-philosophie"].includes(key) ? "open" : ""}>
        <summary>
          <span>${esc(group.label)}</span>
          <small>${group.entries.length} référence${group.entries.length > 1 ? "s" : ""}</small>
          <i aria-hidden="true">+</i>
        </summary>
        <div class="media-resource-list">
          ${group.entries.map((item) => resourceRow(item, { showKind: false })).join("")}
        </div>
      </details>`;
    }).join("")}</div>`;
  }

  function isHomeView() {
    return state.kind === "all" && !state.query && !state.person && !state.author && !state.theme && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage && !state.dossier && !state.pinnedOnly;
  }

  function renderResults() {
    const list = filteredResources();
    const homeView = isHomeView();
    home.hidden = !homeView;
    const courseEmptyView = !homeView && state.kind === "cours" && !state.query && !state.courseQuery && !state.person && !state.theme && !state.dossier && !state.pinnedOnly && !state.author && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage;
    const mindmapView = !homeView && state.kind === "mindmap" && Boolean(state.mindmapId);
    listShell.hidden = homeView || (!list.length && !courseEmptyView && !mindmapView);
    empty.hidden = homeView || list.length > 0 || courseEmptyView || mindmapView;

    if (homeView) {
      renderHome();
      summaryKicker.textContent = "Vue d’ensemble";
      summaryTitle.textContent = "Rayons";
      count.innerHTML = `<strong>${scopedResources().length}</strong> ressources`;
      return;
    }

    const dossier = dossiers.find((item) => item.id === state.dossier);
    const meta = filterMeta.get(state.kind);
    const activeMindmap = state.mindmapId ? byId.get(state.mindmapId) : null;
    summaryKicker.textContent = activeMindmap ? "Mind-map" : state.courseQuery && state.kind === "cours" ? "Résultats dans les cours" : state.query ? "Résultats" : state.kind !== "all" ? "Rayon" : "Sélection";
    summaryTitle.textContent = activeMindmap?.title || dossier?.title || state.person || state.author || state.theme || state.concept || (state.pinnedOnly ? "Favoris" : meta?.plural || "Ressources");
    count.innerHTML = activeMindmap
      ? `<strong>${mindmapNodeCount(activeMindmap.tree)}</strong> éléments`
      : `<strong>${list.length}</strong> ressource${list.length > 1 ? "s" : ""}`;

    const shouldGroupByKind = state.kind === "all";
    const shouldDirectory = state.kind !== "all" && !state.query && !state.courseQuery && !state.person && !state.theme && !state.dossier && !state.pinnedOnly && !state.author && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage;

    if (state.kind === "mindmap" && activeMindmap) listShell.innerHTML = renderMindmapViewer(activeMindmap);
    else if (shouldGroupByKind) listShell.innerHTML = renderGroupedSections(list);
    else if (shouldDirectory && state.kind === "video") listShell.innerHTML = renderVideoDirectory(list);
    else if (shouldDirectory && state.kind === "cours") listShell.innerHTML = renderCourseDirectory(list);
    else if (shouldDirectory && state.kind === "manuel") listShell.innerHTML = renderManualDirectory(list);
    else if (shouldDirectory && state.kind === "mindmap") listShell.innerHTML = renderMindmapDirectory(list);
    else if (shouldDirectory) listShell.innerHTML = renderDirectory(list, state.kind);
    else listShell.innerHTML = `<div class="media-resource-list is-standalone">${list.map((item) => resourceRow(item, { showKind: false })).join("")}</div>`;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.kind !== "all") params.set("type", state.kind);
    if (state.kind === "mindmap" && state.mindmapId) {
      params.set("carte", state.mindmapId);
      if (state.mindmapView !== "plan") params.set("vue", state.mindmapView);
    }
    if (state.person) params.set("personne", state.person);
    if (state.author) params.set("auteur", state.author);
    if (state.theme) params.set("theme", state.theme);
    if (state.concept) params.set("concept", state.concept);
    if (state.level) params.set("niveau", state.level);
    if (state.difficulty) params.set("difficulte", state.difficulty);
    if (state.duration) params.set("duree", state.duration);
    if (state.usage) params.set("usage", state.usage);
    if (state.dossier) params.set("dossier", state.dossier);
    if (state.pinnedOnly) params.set("favoris", "1");
    history.replaceState(null, "", `${location.pathname}${params.toString() ? `?${params}` : ""}`);
  }

  function render() {
    if (state.kind !== "mindmap" || !state.mindmapId) state.mindmapFullscreen = false;
    document.body.classList.toggle("has-mindmap-pseudo-fullscreen", Boolean(state.mindmapFullscreen));
    renderTypes();
    renderAdvancedFilters();
    renderActiveFilters();
    renderResults();
    search.value = state.query;
    clearSearch.hidden = !state.query;
    if (courseSearchShell) courseSearchShell.hidden = state.kind !== "cours";
    if (courseSearch && document.activeElement !== courseSearch) courseSearch.value = state.courseQuery;
    if (courseSearchClear) courseSearchClear.hidden = !state.courseQuery;
    pinnedToggle.setAttribute("aria-pressed", String(state.pinnedOnly));
    pinnedToggle.querySelector("span").textContent = state.pinnedOnly ? "★" : "☆";
    updateUrl();
  }

  function resetFilters() {
    state.kind = "all";
    state.query = "";
    state.courseQuery = "";
    state.person = "";
    state.author = "";
    state.theme = "";
    state.concept = "";
    state.level = "";
    state.difficulty = "";
    state.duration = "";
    state.usage = "";
    state.dossier = "";
    state.pinnedOnly = false;
    state.mindmapId = "";
    state.mindmapQuery = "";
    state.mindmapExpansionOwner = "";
    state.mindmapExpanded = new Set();
    state.mindmapSelectedPath = "";
    state.mindmapScale = 1;
    state.mindmapPanX = 0;
    state.mindmapPanY = 0;
    state.expandedSections.clear();
    render();
  }

  function initFromUrl() {
    const params = new URLSearchParams(location.search);
    state.query = params.get("q") || "";
    const type = params.get("type");
    const requestedKind = FILTERS.some((item) => item.key === type) ? type : "all";
    state.kind = requestedKind !== "all" && PRIVATE_KINDS.has(requestedKind) ? "all" : requestedKind;
    state.person = params.get("personne") || "";
    state.author = params.get("auteur") || "";
    state.theme = params.get("theme") || "";
    state.concept = canonicalConcept(params.get("concept") || "") || "";
    state.level = LEVEL_LABELS[params.get("niveau")] ? params.get("niveau") : "";
    state.difficulty = DIFFICULTY_LABELS[params.get("difficulte")] ? params.get("difficulte") : "";
    if (state.kind !== "texte") state.difficulty = "";
    state.duration = DURATION_LABELS[params.get("duree")] ? params.get("duree") : "";
    state.usage = USAGE_LABELS[params.get("usage")] ? params.get("usage") : "";
    state.dossier = dossiers.some((dossier) => dossier.id === params.get("dossier")) ? params.get("dossier") : "";
    state.advancedOpen = Boolean(state.author || state.concept || state.level || state.difficulty || state.duration || state.usage);
    state.pinnedOnly = params.get("favoris") === "1";
    state.mindmapId = state.kind === "mindmap" && byId.has(params.get("carte")) ? params.get("carte") : "";
    state.mindmapQuery = "";
    const requestedMindmapView = params.get("vue");
    if (["plan", "map", "mixed"].includes(requestedMindmapView)) state.mindmapView = requestedMindmapView;
    state.mindmapExpansionOwner = "";
  }

  function entityCounts(key) {
    const map = new Map();
    scopedResources().forEach((item) => {
      const values = key === "people"
        ? [...new Set((item.people || []).filter(Boolean))]
        : [...new Set((item.themes || []).filter(Boolean))];
      values.forEach((value) => map.set(value, (map.get(value) || 0) + 1));
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"));
  }

  function conceptResourceCount(concept) {
    return scopedResources().filter((item) => conceptMatches(item, concept)).length;
  }

  function mapRoot() {
    const query = normalize(state.explorerQuery);
    if (query) {
      const exact = canonicalConcept(query);
      if (exact) return exact;
      const names = [...new Set([...Object.keys(CONCEPT_GRAPH), ...Object.values(CONCEPT_GRAPH).flat(), ...PROGRAM_NOTIONS])];
      const match = names.find((name) => normalize(name).includes(query));
      if (match) return match;
    }
    return state.mapConcept || "Liberté";
  }

  function renderConceptMap() {
    const root = mapRoot();
    state.mapConcept = root;
    const related = relatedConceptNames(root).slice(0, 7);
    const radius = 37;
    const points = related.map((name, index) => {
      const angle = (-90 + (360 / Math.max(related.length, 1)) * index) * Math.PI / 180;
      return { name, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
    });
    return `<section class="media-concept-map-wrap">
      <div class="media-concept-map-head"><span>Carte conceptuelle</span><h3>${esc(root)}</h3><p>Explorez les notions voisines puis affichez les ressources qui leur sont reliées.</p></div>
      <div class="media-concept-map" role="group" aria-label="Concepts liés à ${esc(root)}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${points.map((point) => `<line x1="50" y1="50" x2="${point.x.toFixed(2)}" y2="${point.y.toFixed(2)}"></line>`).join("")}</svg>
        <button class="media-concept-node is-center" type="button" data-concept-filter="${esc(root)}" style="left:50%;top:50%"><strong>${esc(root)}</strong><small>${conceptResourceCount(root)} ressources</small></button>
        ${points.map((point) => `<button class="media-concept-node" type="button" data-map-concept="${esc(point.name)}" style="left:${point.x.toFixed(2)}%;top:${point.y.toFixed(2)}%"><strong>${esc(point.name)}</strong><small>${conceptResourceCount(point.name)}</small></button>`).join("")}
      </div>
      <div class="media-map-actions"><button type="button" data-concept-filter="${esc(root)}">Voir les ressources sur « ${esc(root)} »</button><a href="${esc(resolveUrl(`/textes/philosophie/boussole/?dict=${encodeURIComponent(root)}`))}">Ouvrir dans la Boussole →</a></div>
    </section>`;
  }

  function relationScore(a, b) {
    let score = 0;
    const themesA = new Set(a.themes || []);
    const peopleA = new Set(a.people || []);
    const conceptsA = new Set(directConcepts(a));
    (b.themes || []).forEach((value) => { if (themesA.has(value)) score += 4; });
    (b.people || []).forEach((value) => { if (peopleA.has(value)) score += 5; });
    directConcepts(b).forEach((value) => { if (conceptsA.has(value)) score += 5; else if ([...conceptsA].some((concept) => relatedConceptNames(concept).includes(value))) score += 2; });
    if (a.creator && a.creator === b.creator) score += 4;
    if (groupOf(a) !== groupOf(b)) score += 1;
    return score;
  }

  function relatedResources(item) {
    return scopedResources().filter((candidate) => candidate.id !== item.id)
      .map((candidate) => [candidate, relationScore(item, candidate)])
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1] || a[0].title.localeCompare(b[0].title, "fr"))
      .slice(0, 6)
      .map(([candidate]) => candidate);
  }

  function philosophalLinks(item) {
    const concept = directConcepts(item)[0] || (item.themes || [])[0] || "Philosophie";
    const section = normalize(item.section || "");
    const compass = section.includes("myth") ? "/textes/mythologie/boussole/" : section.includes("theolog") || section.includes("bible") ? "/textes/theologie/boussole/" : "/textes/philosophie/boussole/";
    return [
      ["Textes liés", `/textes/?recherche=${encodeURIComponent(concept)}`],
      ["Boussole", compass],
      ["Dictionnaire", `${compass}?dict=${encodeURIComponent(concept)}`]
    ];
  }

  function openResourceDetail(id) {
    const item = byId.get(id);
    if (!item || !detail || !detailContent) return;
    const concepts = directConcepts(item).slice(0, 8);
    const related = relatedResources(item);
    detailTitle.textContent = item.title;
    const detailDifficulty = difficultyFor(item);
    const detailDuration = durationLabel(item);
    detailContent.innerHTML = `<div class="media-detail-meta">
        <span class="is-kind">${esc(groupLabel(item))}</span>
        ${detailDifficulty ? `<span class="is-difficulty is-${detailDifficulty}">${esc(DIFFICULTY_LABELS[detailDifficulty])}</span>` : ""}
        ${detailDuration ? `<span>${esc(detailDuration)}</span>` : ""}
        <span>${esc(levelsFor(item).map((level) => LEVEL_LABELS[level]).join(" · "))}</span>
      </div>
      ${item.description ? `<p class="media-detail-description">${esc(item.description)}</p>` : ""}
      <section class="media-detail-section"><h3>Concepts</h3><div class="media-detail-concepts">${(concepts.length ? concepts : (item.themes || []).slice(0, 6)).map((concept) => `<button type="button" data-concept-filter="${esc(concept)}">${esc(concept)}</button>`).join("") || '<span class="media-detail-muted">Aucun concept indexé.</span>'}</div></section>
      <section class="media-detail-section"><h3>À rapprocher de</h3><div class="media-detail-related">${related.length ? related.map((candidate) => `<button type="button" data-resource-details="${esc(candidate.id)}"><span>${esc(groupLabel(candidate))}</span><strong>${esc(candidate.title)}</strong><small>${esc(candidate.creator || candidate.source || "")}</small></button>`).join("") : '<p class="media-detail-muted">Pas encore de ressource suffisamment proche.</p>'}</div></section>
      <section class="media-detail-section"><h3>Continuer dans Philosophal</h3><nav class="media-detail-links">${philosophalLinks(item).map(([label, href]) => `<a href="${esc(resolveUrl(href))}">${esc(label)} <span>→</span></a>`).join("")}</nav></section>
      <div class="media-detail-action">${resourceAction(item)}</div>`;
    detail.hidden = false;
    document.body.classList.add("media-modal-open");
    requestAnimationFrame(() => detail.querySelector("[data-close-resource-detail]")?.focus({ preventScroll: true }));
  }

  function closeResourceDetail() {
    if (!detail) return;
    detail.hidden = true;
    if (player.hidden && explorer.hidden) document.body.classList.remove("media-modal-open");
  }

  function renderExplorer() {
    explorerTabs.querySelectorAll("[data-explorer-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.explorerView === state.explorerView);
    });
    const query = normalize(state.explorerQuery);
    explorerSearch.placeholder = state.explorerView === "map" ? "Rechercher un concept…" : "Filtrer…";

    if (state.explorerView === "map") {
      explorerList.innerHTML = renderConceptMap();
      return;
    }

    if (state.explorerView === "dossiers") {
      const list = dossiers.filter((dossier) => !query || normalize([dossier.title, dossier.description, ...(dossier.themes || [])].join(" ")).includes(query));
      explorerList.innerHTML = list.length
        ? list.map((dossier) => `<button class="media-explore-item media-explore-dossier" type="button" data-dossier="${esc(dossier.id)}"><strong>${esc(dossier.title)}</strong><p>${esc(dossier.description || "")}</p><span>${(dossier.resourceIds || []).length} ressources</span></button>`).join("")
        : '<div class="media-explore-empty">Aucun dossier.</div>';
      return;
    }

    const key = state.explorerView;
    const list = entityCounts(key).filter(([name]) => !query || normalize(name).includes(query)).slice(0, 180);
    const attr = key === "people" ? "person" : "theme";
    explorerList.innerHTML = list.length
      ? list.map(([name, total]) => `<button class="media-explore-item" type="button" data-${attr}="${esc(name)}"><strong>${esc(name)}</strong><span>${total} ressource${total > 1 ? "s" : ""}</span></button>`).join("")
      : '<div class="media-explore-empty">Aucun résultat.</div>';
  }

  function openExplorer() {
    state.explorerQuery = "";
    explorerSearch.value = "";
    renderExplorer();
    explorer.hidden = false;
    document.body.classList.add("media-modal-open");
    requestAnimationFrame(() => explorerSearch.focus({ preventScroll: true }));
  }

  function closeExplorer() {
    explorer.hidden = true;
    if (player.hidden && (!detail || detail.hidden)) document.body.classList.remove("media-modal-open");
  }

  function openPlayer(id) {
    const item = byId.get(id);
    const embed = item && getEmbed(item);
    if (!item || !embed) return;
    $("[data-player-kind]").textContent = groupLabel(item);
    $("[data-player-title]").textContent = item.title;
    $("[data-player-meta]").textContent = [item.creator, item.subtitle].filter(Boolean).join(" · ");
    $("[data-player-source]").href = resolveUrl(item.url);
    $("[data-player-tags]").innerHTML = (item.themes || []).slice(0, 5).map((theme) => `<span>${esc(theme)}</span>`).join("");
    playerFrame.className = `media-player-frame is-${embed.type}`;
    playerFrame.innerHTML = `<iframe src="${esc(embed.url)}" title="${esc(item.title)}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="eager"></iframe>`;
    player.hidden = false;
    document.body.classList.add("media-modal-open");
    requestAnimationFrame(() => player.querySelector("[data-close-player]")?.focus({ preventScroll: true }));
  }

  function closePlayer() {
    player.hidden = true;
    playerFrame.innerHTML = "";
    playerFrame.className = "media-player-frame";
    if (explorer.hidden && (!detail || detail.hidden)) document.body.classList.remove("media-modal-open");
  }

  function openResource(id) {
    const item = byId.get(id);
    if (!item) return;
    if (!resourceInCurrentAccess(item)) {
      if (isPrivateResource(item) && window.FV_PRIVATE_ACCESS?.isUnlocked()) setAccessMode("private");
      else if (isPrivateResource(item)) openPrivateGate();
      return;
    }
    if (groupOf(item) === "mindmap") {
      state.kind = "mindmap";
      state.mindmapId = item.id;
      state.mindmapQuery = "";
      state.mindmapExpansionOwner = "";
      state.mindmapSelectedPath = "";
      state.mindmapFocusPath = "";
      state.mindmapViewportRestored = false;
      state.query = "";
      state.person = "";
      state.theme = "";
      state.dossier = "";
      state.pinnedOnly = false;
      render();
      requestAnimationFrame(() => {
        listShell?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (state.mindmapView !== "plan") requestAnimationFrame(() => state.mindmapViewportRestored ? applyMindmapTransform() : fitMindmapToView());
      });
      return;
    }
    const embed = getEmbed(item);
    if (embed && ["audio", "video", "cours-video"].includes(groupOf(item))) {
      openPlayer(id);
      return;
    }
    const target = resolveUrl(item.url);
    if (isExternal(item.url)) window.open(target, "_blank", "noopener,noreferrer");
    else window.location.assign(target);
  }

  accessSwitch?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-access-mode]");
    if (!button) return;
    const mode = button.dataset.accessMode;
    if (mode === "public") { setAccessMode("public"); return; }
    if (window.FV_PRIVATE_ACCESS?.isUnlocked()) { setAccessMode("private"); return; }
    openPrivateGate();
  });

  privateGateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = await window.FV_PRIVATE_ACCESS?.unlock(privatePassword?.value || "");
    if (!valid) {
      if (privateError) privateError.hidden = false;
      privatePassword?.select();
      return;
    }
    closePrivateGate();
    setAccessMode("private");
  });

  search.addEventListener("input", () => {
    state.query = search.value.trim();
    state.expandedSections.clear();
    render();
  });

  clearSearch.addEventListener("click", () => {
    state.query = "";
    search.value = "";
    state.expandedSections.clear();
    render();
    search.focus();
  });

  courseSearch?.addEventListener("input", async () => {
    state.courseQuery = courseSearch.value.trim();
    courseSearchClear.hidden = !state.courseQuery;
    if (state.courseQuery && !courseContentIndex) {
      renderResults();
      await ensureCourseContentIndex();
      renderResults();
      return;
    }
    renderResults();
  });

  courseSearchClear?.addEventListener("click", () => {
    state.courseQuery = "";
    courseSearch.value = "";
    courseSearchClear.hidden = true;
    renderResults();
    courseSearch.focus();
  });

  advancedToggle?.addEventListener("click", () => {
    state.advancedOpen = !state.advancedOpen;
    renderAdvancedFilters();
  });

  [[authorFilter, "author"], [conceptFilter, "concept"], [levelFilter, "level"], [difficultyFilter, "difficulty"], [durationFilter, "duration"], [usageFilter, "usage"]].forEach(([control, key]) => {
    control?.addEventListener("change", () => {
      state[key] = control.value;
      state.expandedSections.clear();
      render();
    });
  });

  home.addEventListener("click", (event) => {
    const branch = event.target.closest("[data-video-branch]");
    if (!branch) return;
    state.kind = "video";
    state.query = "";
    state.person = "";
    state.theme = "";
    state.dossier = "";
    state.pinnedOnly = false;
    render();
    requestAnimationFrame(() => document.querySelector(`[data-video-section="${branch.dataset.videoBranch}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  });

  types.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button) return;
    state.kind = button.dataset.kind;
    state.mindmapId = "";
    state.mindmapQuery = "";
    if (state.kind !== "texte") state.difficulty = "";
    if (state.kind !== "cours") state.courseQuery = "";
    state.expandedSections.clear();
    render();
  });

  pinnedToggle.addEventListener("click", () => {
    state.pinnedOnly = !state.pinnedOnly;
    state.expandedSections.clear();
    render();
  });

  $("[data-open-explorer]").addEventListener("click", openExplorer);
  resetButton.addEventListener("click", resetFilters);
  $("[data-empty-reset]")?.addEventListener("click", resetFilters);

  explorerTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-explorer-view]");
    if (!button) return;
    state.explorerView = button.dataset.explorerView;
    state.explorerQuery = "";
    explorerSearch.value = "";
    renderExplorer();
  });

  explorerSearch.addEventListener("input", () => {
    state.explorerQuery = explorerSearch.value;
    renderExplorer();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-private-gate-close]")) { closePrivateGate(); return; }
    if (usefulLinks?.open && !usefulLinks.contains(event.target)) usefulLinks.removeAttribute("open");
    if (event.target.closest("[data-close-explorer]")) { closeExplorer(); return; }
    if (event.target.closest("[data-close-player]")) { closePlayer(); return; }
    if (event.target.closest("[data-close-resource-detail]")) { closeResourceDetail(); return; }

    const detailsTrigger = event.target.closest("[data-resource-details]");
    if (detailsTrigger) { event.preventDefault(); event.stopPropagation(); openResourceDetail(detailsTrigger.dataset.resourceDetails); return; }

    const mapConcept = event.target.closest("[data-map-concept]");
    if (mapConcept) { state.mapConcept = mapConcept.dataset.mapConcept; state.explorerQuery = ""; explorerSearch.value = ""; renderExplorer(); return; }

    const conceptChoice = event.target.closest("[data-concept-filter]");
    if (conceptChoice) {
      state.concept = canonicalConcept(conceptChoice.dataset.conceptFilter) || conceptChoice.dataset.conceptFilter;
      state.query = ""; state.person = ""; state.author = ""; state.theme = ""; state.dossier = ""; state.pinnedOnly = false;
      state.advancedOpen = true;
      closeResourceDetail(); closeExplorer(); render();
      return;
    }

    const kindFocus = event.target.closest("[data-kind-focus]");
    if (kindFocus) {
      state.kind = kindFocus.dataset.kindFocus;
      state.mindmapId = "";
      state.mindmapQuery = "";
      if (state.kind !== "texte") state.difficulty = "";
      state.query = "";
      state.courseQuery = "";
      state.person = "";
      state.theme = "";
      state.dossier = "";
      state.pinnedOnly = false;
      state.expandedSections.clear();
      render();
      return;
    }

    const expand = event.target.closest("[data-expand-section]");
    if (expand) {
      const key = expand.dataset.expandSection;
      state.expandedSections.has(key) ? state.expandedSections.delete(key) : state.expandedSections.add(key);
      renderResults();
      return;
    }

    const mindmapOpen = event.target.closest("[data-mindmap-open]");
    if (mindmapOpen) { event.preventDefault(); openResource(mindmapOpen.dataset.mindmapOpen); return; }

    if (event.target.closest("[data-mindmap-import]")) { event.preventDefault(); importMindmapFile(); return; }

    if (event.target.closest("[data-mindmap-back]")) {
      persistMindmapSessionNow();
      state.mindmapId = "";
      state.mindmapQuery = "";
      state.mindmapExpansionOwner = "";
      state.mindmapSelectedPath = "";
      state.mindmapFocusPath = "";
      state.mindmapRevision = false;
      render();
      return;
    }

    if (event.target.closest("[data-mindmap-save]")) {
      const item = byId.get(state.mindmapId);
      const id = saveMindmapSnapshot(item);
      if (id && id !== item?.id) { state.mindmapId = id; state.mindmapExpansionOwner = ""; render(); }
      else if (id) { const button = event.target.closest("[data-mindmap-save]"); const old = button.textContent; button.textContent = "Sauvegardé ✓"; setTimeout(() => { if (button.isConnected) button.textContent = old; }, 1200); }
      return;
    }

    if (event.target.closest("[data-mindmap-export]")) { exportMindmap(byId.get(state.mindmapId)); return; }
    if (event.target.closest("[data-mindmap-delete]")) { deletePersonalMindmap(byId.get(state.mindmapId)); return; }

    const mindmapView = event.target.closest("[data-mindmap-view]");
    if (mindmapView) {
      const value = mindmapView.dataset.mindmapView;
      if (["plan", "map", "mixed"].includes(value)) {
        state.mindmapView = value;
        saveMindmapView(value);
        render();
        if (value !== "plan") requestAnimationFrame(() => requestAnimationFrame(() => state.mindmapViewportRestored ? applyMindmapTransform() : fitMindmapToView()));
      }
      return;
    }

    const mindmapPalette = event.target.closest("[data-mindmap-palette]");
    if (mindmapPalette) {
      const value = mindmapPalette.dataset.mindmapPalette;
      if (["color", "violet"].includes(value)) {
        state.mindmapPalette = value;
        saveMindmapPalette(value);
        renderResults();
      }
      return;
    }

    const mindmapLegend = event.target.closest("[data-mindmap-legend-path]");
    if (mindmapLegend) {
      const path = mindmapLegend.dataset.mindmapLegendPath;
      state.mindmapSelectedPath = state.mindmapSelectedPath === path ? "" : path;
      if (path) state.mindmapExpanded.add(path);
      queueMindmapPersist(); renderResults(); return;
    }

    if (event.target.closest("[data-mindmap-fullscreen]")) { toggleMindmapFullscreen(); return; }

    const focusHome = event.target.closest("[data-mindmap-focus-home]");
    if (focusHome) { setMindmapFocus(""); return; }
    const focusPathButton = event.target.closest("[data-mindmap-focus-path]");
    if (focusPathButton) { setMindmapFocus(focusPathButton.dataset.mindmapFocusPath || ""); return; }
    const revisionPathButton = event.target.closest("[data-mindmap-revision-path]");
    if (revisionPathButton) { setMindmapFocus(revisionPathButton.dataset.mindmapRevisionPath || "", true); return; }

    const relatedResource = event.target.closest("[data-mindmap-related-resource]");
    if (relatedResource) { openResource(relatedResource.dataset.mindmapRelatedResource); return; }
    const selectPath = event.target.closest("[data-mindmap-select-path]");
    if (selectPath) { state.mindmapSelectedPath = selectPath.dataset.mindmapSelectPath || ""; renderResults(); return; }

    const reveal = event.target.closest("[data-mindmap-reveal-path]");
    if (reveal) {
      event.preventDefault(); event.stopPropagation();
      state.mindmapRevisionRevealed.add(reveal.dataset.mindmapRevealPath);
      renderResults(); return;
    }

    const linkStart = event.target.closest("[data-mindmap-link-start]");
    if (linkStart) { state.mindmapLinkSourcePath = linkStart.dataset.mindmapLinkStart || ""; state.mindmapRelationsVisible = true; closeMindmapContextMenu(); renderResults(); return; }
    if (event.target.closest("[data-mindmap-link-cancel]")) { state.mindmapLinkSourcePath = ""; renderResults(); return; }

    const mindmapGraphNode = event.target.closest("[data-mindmap-node-path]");
    if (mindmapGraphNode) {
      const path = mindmapGraphNode.dataset.mindmapNodePath;
      if (state.mindmapLinkSourcePath && path !== state.mindmapLinkSourcePath) {
        addMindmapManualRelation(state.mindmapId, state.mindmapLinkSourcePath, path);
        state.mindmapLinkSourcePath = ""; state.mindmapRelationsVisible = true; state.mindmapSelectedPath = path; renderResults(); return;
      }
      scheduleMindmapNodeClick(path);
      return;
    }

    if (event.target.closest("[data-mindmap-focus-clear]")) { state.mindmapSelectedPath = ""; renderResults(); return; }

    if (event.target.closest("[data-mindmap-expand]")) {
      const item = byId.get(state.mindmapId);
      if (item?.tree) state.mindmapExpanded = new Set(mindmapExpandablePaths(item.tree));
      queueMindmapPersist(); renderResults();
      requestAnimationFrame(() => document.querySelectorAll("[data-mindmap-view-shell] details").forEach((details) => { details.open = true; }));
      return;
    }

    if (event.target.closest("[data-mindmap-collapse]")) {
      state.mindmapExpanded = new Set(); state.mindmapSelectedPath = "";
      queueMindmapPersist(); renderResults();
      requestAnimationFrame(() => document.querySelectorAll("[data-mindmap-view-shell] details").forEach((details) => { details.open = false; }));
      return;
    }

    if (event.target.closest("[data-mindmap-revision-toggle]")) {
      state.mindmapRevision = !state.mindmapRevision; state.mindmapRevisionRevealed = new Set(); state.mindmapSelectedPath = ""; renderResults(); return;
    }
    if (event.target.closest("[data-mindmap-revision-reveal-all]")) {
      const item = byId.get(state.mindmapId); if (item?.tree) mindmapFlatNodes(item.tree).forEach(({ path }) => { if (path !== "root") state.mindmapRevisionRevealed.add(path); }); renderResults(); return;
    }
    if (event.target.closest("[data-mindmap-revision-reset]")) { state.mindmapRevisionRevealed = new Set(); renderResults(); return; }
    if (event.target.closest("[data-mindmap-revision-off]")) { state.mindmapRevision = false; state.mindmapRevisionRevealed = new Set(); renderResults(); return; }

    if (event.target.closest("[data-mindmap-relations-toggle]")) { state.mindmapRelationsVisible = !state.mindmapRelationsVisible; queueMindmapPersist(); renderResults(); return; }

    if (event.target.closest("[data-mindmap-zoom-in]")) { state.mindmapScale = Math.min(2.2, Number((state.mindmapScale + 0.15).toFixed(2))); state.mindmapViewportRestored = true; applyMindmapTransform(); queueMindmapPersist(); return; }
    if (event.target.closest("[data-mindmap-zoom-out]")) { state.mindmapScale = Math.max(0.32, Number((state.mindmapScale - 0.15).toFixed(2))); state.mindmapViewportRestored = true; applyMindmapTransform(); queueMindmapPersist(); return; }
    if (event.target.closest("[data-mindmap-fit]")) { fitMindmapToView(); return; }
    if (event.target.closest("[data-mindmap-center]")) { centerMindmapView(); return; }

    const play = event.target.closest("[data-play]");
    if (play) { event.preventDefault(); openPlayer(play.dataset.play); return; }

    const pin = event.target.closest("[data-pin]");
    if (pin) {
      event.preventDefault();
      const id = pin.dataset.pin;
      state.pinned.has(id) ? state.pinned.delete(id) : state.pinned.add(id);
      savePinned();
      render();
      return;
    }

    const person = event.target.closest("[data-person]");
    if (person) {
      state.person = person.dataset.person;
      state.theme = "";
      state.dossier = "";
      state.query = "";
      state.courseQuery = "";
      state.kind = "all";
      state.pinnedOnly = false;
      closeExplorer();
      render();
      return;
    }

    const theme = event.target.closest("[data-theme]");
    if (theme) {
      state.theme = theme.dataset.theme;
      state.person = "";
      state.dossier = "";
      state.query = "";
      state.courseQuery = "";
      state.kind = "all";
      state.pinnedOnly = false;
      closeExplorer();
      render();
      return;
    }

    const dossier = event.target.closest("[data-dossier]");
    if (dossier) {
      state.dossier = dossier.dataset.dossier;
      state.person = "";
      state.theme = "";
      state.query = "";
      state.courseQuery = "";
      state.kind = "all";
      state.pinnedOnly = false;
      closeExplorer();
      render();
      return;
    }

    const clear = event.target.closest("[data-clear-filter]");
    if (clear) {
      const key = clear.dataset.clearFilter;
      if (key === "query") state.query = "";
      if (key === "person") state.person = "";
      if (key === "author") state.author = "";
      if (key === "theme") state.theme = "";
      if (key === "concept") state.concept = "";
      if (key === "level") state.level = "";
      if (key === "difficulty") state.difficulty = "";
      if (key === "duration") state.duration = "";
      if (key === "usage") state.usage = "";
      if (key === "dossier") state.dossier = "";
      if (key === "pinned") state.pinnedOnly = false;
      state.expandedSections.clear();
      render();
      return;
    }

    const openTarget = event.target.closest("[data-open-resource]");
    if (openTarget) {
      // Les aperçus des rayons sont eux-mêmes des boutons : ils ouvrent directement la ressource.
      if (openTarget.matches("button[data-open-resource]")) {
        openResource(openTarget.dataset.openResource);
        return;
      }
      // Dans une ligne, les contrôles (favori, statut, action) gardent leur comportement propre.
      if (!event.target.closest("a,button,summary,input,select,textarea")) {
        openResource(openTarget.dataset.openResource);
      }
    }
  });

  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("[data-mindmap-search]");
    if (!input) return;
    state.mindmapQuery = input.value;
    state.mindmapSelectedPath = "";
    const item = byId.get(state.mindmapId);
    const shell = document.querySelector("[data-mindmap-view-shell]");
    if (item && shell) shell.innerHTML = renderMindmapContent(item);
  });

  function applyMindmapTransform() {
    document.querySelectorAll("[data-mindmap-stage]").forEach((stage) => {
      stage.style.transform = `translate(${state.mindmapPanX}px,${state.mindmapPanY}px) scale(${state.mindmapScale})`;
    });
    document.querySelectorAll("[data-mindmap-zoom-value]").forEach((label) => { label.textContent = `${Math.round(state.mindmapScale * 100)}%`; });
  }

  function fitMindmapToView() {
    const viewport = document.querySelector("[data-mindmap-viewport]");
    const canvas = viewport?.querySelector(".media-mindmap-canvas");
    if (!viewport || !canvas) return;
    const vw = Math.max(1, viewport.clientWidth), vh = Math.max(1, viewport.clientHeight), cw = Math.max(1, canvas.offsetWidth), ch = Math.max(1, canvas.offsetHeight);
    const horizontalPadding = vw < 640 ? 36 : 90, verticalPadding = vh < 520 ? 36 : 90;
    const scale = Math.min((vw - horizontalPadding) / cw, (vh - verticalPadding) / ch, 1.25);
    state.mindmapScale = Math.max(0.32, Math.min(1.25, Number(scale.toFixed(2))));
    state.mindmapPanX = 0; state.mindmapPanY = 0; state.mindmapViewportRestored = true;
    applyMindmapTransform(); queueMindmapPersist();
  }

  function centerMindmapView() {
    state.mindmapScale = 1; state.mindmapPanX = 0; state.mindmapPanY = 0; state.mindmapViewportRestored = true;
    applyMindmapTransform(); queueMindmapPersist();
  }

  function setMindmapFocus(path = "", revision = false) {
    const item = byId.get(state.mindmapId); if (!item?.tree) return;
    const valid = path && mindmapEntryAtPath(item.tree, path) ? path : "";
    state.mindmapFocusPath = valid; state.mindmapSelectedPath = ""; state.mindmapLinkSourcePath = "";
    if (revision) { state.mindmapRevision = true; state.mindmapRevisionRevealed = new Set(); }
    state.mindmapPanX = 0; state.mindmapPanY = 0; state.mindmapScale = 1; state.mindmapViewportRestored = false;
    queueMindmapPersist(); renderResults();
    if (state.mindmapView !== "plan") requestAnimationFrame(() => requestAnimationFrame(fitMindmapToView));
  }

  function mindmapFullscreenActive() { return Boolean(state.mindmapFullscreen); }
  function syncMindmapFullscreenButton() {
    const workspace = document.querySelector("[data-mindmap-workspace]");
    const active = mindmapFullscreenActive(); const button = workspace?.querySelector("[data-mindmap-fullscreen]"); if (!button) return;
    const label = button.querySelector("b"); if (label) label.textContent = active ? "Réduire" : "Plein écran";
    button.setAttribute("aria-label", active ? "Quitter le plein écran" : "Afficher la mind-map en plein écran"); button.classList.toggle("is-active", active);
  }
  function toggleMindmapFullscreen() {
    const workspace = document.querySelector("[data-mindmap-workspace]"); if (!workspace) return;
    state.mindmapFullscreen = !state.mindmapFullscreen; workspace.classList.toggle("is-pseudo-fullscreen", state.mindmapFullscreen);
    document.body.classList.toggle("has-mindmap-pseudo-fullscreen", state.mindmapFullscreen); syncMindmapFullscreenButton();
    requestAnimationFrame(() => { if (state.mindmapView !== "plan") applyMindmapTransform(); });
  }

  let mindmapNodeClickTimer = 0;
  function scheduleMindmapNodeClick(path) {
    clearTimeout(mindmapNodeClickTimer);
    mindmapNodeClickTimer = window.setTimeout(() => {
      const item = byId.get(state.mindmapId); const entry = item ? mindmapEntryAtPath(item.tree, path) : null;
      state.mindmapSelectedPath = path;
      if (entry && (mindmapEntry(entry).children || []).length) state.mindmapExpanded.has(path) ? state.mindmapExpanded.delete(path) : state.mindmapExpanded.add(path);
      queueMindmapPersist(); renderResults(); updateUrl();
    }, 230);
  }

  let mindmapContextMenu = null;
  function closeMindmapContextMenu() { mindmapContextMenu?.remove(); mindmapContextMenu = null; }
  function showMindmapContextMenu(path, x, y) {
    closeMindmapContextMenu();
    const item = byId.get(state.mindmapId); const entry = item ? mindmapEntryAtPath(item.tree, path) : null; if (!entry) return;
    const node = mindmapEntry(entry); const menu = document.createElement("div"); menu.className = "media-mindmap-context"; menu.setAttribute("role", "menu"); menu.dataset.mindmapContextPath = path;
    menu.innerHTML = `<div><span>Actions</span><strong>${esc(node.label || "Nœud")}</strong></div><button type="button" data-mindmap-context-action="focus">Focus sur cette branche</button><button type="button" data-mindmap-context-action="revision">Réviser cette branche</button><button type="button" data-mindmap-context-action="resources">Voir les ressources liées</button><button type="button" data-mindmap-context-action="link">Créer une relation depuis ici</button><button type="button" data-mindmap-context-action="copy">Copier le titre</button>`;
    document.body.appendChild(menu); mindmapContextMenu = menu;
    const rect = menu.getBoundingClientRect(); menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`; menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
    requestAnimationFrame(() => menu.querySelector("button")?.focus({ preventScroll: true }));
  }

  document.addEventListener("contextmenu", (event) => {
    if (state.kind !== "mindmap" || !state.mindmapId) return;
    const node = event.target.closest?.("[data-mindmap-node-path],[data-mindmap-plan-path]"); if (!node) return;
    const path = node.dataset.mindmapNodePath || node.dataset.mindmapPlanPath; if (!path) return;
    event.preventDefault(); showMindmapContextMenu(path, event.clientX, event.clientY);
  });

  document.addEventListener("click", async (event) => {
    const action = event.target.closest?.("[data-mindmap-context-action]");
    if (action && mindmapContextMenu) {
      const path = mindmapContextMenu.dataset.mindmapContextPath || ""; const item = byId.get(state.mindmapId); const entry = item ? mindmapEntryAtPath(item.tree, path) : null;
      const type = action.dataset.mindmapContextAction; closeMindmapContextMenu();
      if (type === "focus") { setMindmapFocus(path); return; }
      if (type === "revision") { setMindmapFocus(path, true); return; }
      if (type === "resources") { state.mindmapSelectedPath = path; renderResults(); return; }
      if (type === "link") { state.mindmapLinkSourcePath = path; state.mindmapRelationsVisible = true; renderResults(); return; }
      if (type === "copy" && entry) { try { await navigator.clipboard.writeText(mindmapEntry(entry).label || ""); } catch (_) {} return; }
    }
    if (mindmapContextMenu && !event.target.closest?.(".media-mindmap-context")) closeMindmapContextMenu();
  });

  document.addEventListener("dblclick", (event) => {
    if (state.kind !== "mindmap" || !state.mindmapId) return;
    const node = event.target.closest?.("[data-mindmap-node-path],[data-mindmap-plan-path]"); if (!node) return;
    const path = node.dataset.mindmapNodePath || node.dataset.mindmapPlanPath; if (!path) return;
    event.preventDefault(); clearTimeout(mindmapNodeClickTimer); setMindmapFocus(path);
  });

  let mindmapSpaceDown = false;
  let mindmapDrag = null;
  document.addEventListener("pointerdown", (event) => {
    const viewport = event.target.closest?.("[data-mindmap-viewport]"); if (!viewport) return;
    const overInteractive = Boolean(event.target.closest("button,a,input,summary"));
    if (overInteractive && !mindmapSpaceDown) return;
    mindmapDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, panX: state.mindmapPanX, panY: state.mindmapPanY, viewport };
    viewport.classList.add("is-dragging"); try { viewport.setPointerCapture(event.pointerId); } catch (_) {}
    if (mindmapSpaceDown) event.preventDefault();
  });
  document.addEventListener("pointermove", (event) => {
    if (!mindmapDrag || event.pointerId !== mindmapDrag.pointerId) return;
    state.mindmapPanX = mindmapDrag.panX + (event.clientX - mindmapDrag.startX); state.mindmapPanY = mindmapDrag.panY + (event.clientY - mindmapDrag.startY); state.mindmapViewportRestored = true; applyMindmapTransform();
  });
  const endMindmapDrag = (event) => {
    if (!mindmapDrag || (event.pointerId != null && event.pointerId !== mindmapDrag.pointerId)) return;
    mindmapDrag.viewport?.classList.remove("is-dragging"); mindmapDrag = null; queueMindmapPersist();
  };
  document.addEventListener("pointerup", endMindmapDrag); document.addEventListener("pointercancel", endMindmapDrag);

  document.addEventListener("keydown", (event) => {
    if (state.kind !== "mindmap" || !state.mindmapId) return;
    const tag = event.target?.tagName?.toLowerCase(); const typing = ["input", "textarea", "select"].includes(tag) || event.target?.isContentEditable;
    if (event.code === "Space" && !typing && state.mindmapView !== "plan") { event.preventDefault(); mindmapSpaceDown = true; document.querySelector("[data-mindmap-viewport]")?.classList.add("is-space-pan"); }
    if (typing) return;
    const key = event.key.toLocaleLowerCase("fr");
    if (event.key === "Escape") {
      closeMindmapContextMenu(); state.mindmapLinkSourcePath = "";
      const workspace = document.querySelector("[data-mindmap-workspace]");
      if (state.mindmapFullscreen) { state.mindmapFullscreen = false; workspace?.classList.remove("is-pseudo-fullscreen"); document.body.classList.remove("has-mindmap-pseudo-fullscreen"); syncMindmapFullscreenButton(); return; }
      if (state.mindmapSelectedPath) { state.mindmapSelectedPath = ""; renderResults(); }
      return;
    }
    if (key === "f") { event.preventDefault(); event.stopPropagation(); toggleMindmapFullscreen(); return; }
    if (key === "r") { event.preventDefault(); event.stopImmediatePropagation(); if (state.mindmapView !== "plan") centerMindmapView(); return; }
    if (state.mindmapView === "plan") return;
    if (event.key === "0") { event.preventDefault(); fitMindmapToView(); return; }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); state.mindmapScale = Math.min(2.2, Number((state.mindmapScale + 0.15).toFixed(2))); state.mindmapViewportRestored = true; applyMindmapTransform(); queueMindmapPersist(); return; }
    if (event.key === "-" || event.key === "_") { event.preventDefault(); state.mindmapScale = Math.max(0.32, Number((state.mindmapScale - 0.15).toFixed(2))); state.mindmapViewportRestored = true; applyMindmapTransform(); queueMindmapPersist(); }
  }, true);

  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") { mindmapSpaceDown = false; document.querySelector("[data-mindmap-viewport]")?.classList.remove("is-space-pan"); }
  }, true);

  window.addEventListener("blur", () => { mindmapSpaceDown = false; document.querySelector("[data-mindmap-viewport]")?.classList.remove("is-space-pan"); });

  document.addEventListener("wheel", (event) => {
    const viewport = event.target.closest?.("[data-mindmap-viewport]"); if (!viewport) return;
    event.preventDefault(); const delta = event.deltaY < 0 ? 0.1 : -0.1;
    state.mindmapScale = Math.max(0.32, Math.min(2.2, Number((state.mindmapScale + delta).toFixed(2)))); state.mindmapViewportRestored = true; applyMindmapTransform(); queueMindmapPersist();
  }, { passive: false });

  document.addEventListener("keydown", (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !typing) {
      event.preventDefault();
      search.focus();
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && !typing) {
      const row = event.target.closest?.("[data-open-resource]");
      if (row && event.target === row) {
        event.preventDefault();
        openResource(row.dataset.openResource);
        return;
      }
    }

    if (event.key === "Escape") {
      if (privateGate && !privateGate.hidden) { closePrivateGate(); return; }
      if (detail && !detail.hidden) { closeResourceDetail(); return; }
      if (!player.hidden) { closePlayer(); return; }
      if (!explorer.hidden) { closeExplorer(); return; }
      if (document.activeElement === courseSearch && state.courseQuery) {
        state.courseQuery = "";
        courseSearch.value = "";
        if (courseSearchClear) courseSearchClear.hidden = true;
        renderResults();
        return;
      }
      const mindmapSearch = document.activeElement?.matches?.("[data-mindmap-search]") ? document.activeElement : null;
      if (mindmapSearch && state.mindmapQuery) {
        state.mindmapQuery = "";
        mindmapSearch.value = "";
        const item = byId.get(state.mindmapId);
        const shell = document.querySelector("[data-mindmap-view-shell]");
        if (item && shell) shell.innerHTML = renderMindmapContent(item);
        return;
      }
      if (document.activeElement === search && state.query) {
        state.query = "";
        search.value = "";
        render();
      }
    }
  });

  document.body.dataset.mediaAccess = "public";
  initFromUrl();
  render();
})();

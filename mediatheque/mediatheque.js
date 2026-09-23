(async () => {
  "use strict";

  // Attendre la synchronisation du catalogue /textes/ avant de construire la médiathèque.
  try { await (window.FV_MEDIATHEQUE_TEXT_SYNC || Promise.resolve()); } catch (_) {}

  const DATA = window.FV_MEDIATHEQUE_DATA || { resources: [], dossiers: [] };
  const resources = Array.isArray(DATA.resources) ? DATA.resources : [];
  const dossiers = Array.isArray(DATA.dossiers) ? DATA.dossiers : [];
  const byId = new Map(resources.map((item) => [item.id, item]));

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

  const FILTERS = [
    { key: "all", label: "Tout", plural: "Toutes les ressources", description: "Une vue simple de l’ensemble de la médiathèque." },
    { key: "texte", label: "Textes", plural: "Textes", description: "Extraits, œuvres et fiches de lecture.", glyph: "T" },
    { key: "livre", label: "Livres", plural: "Livres", description: "Bibliothèque de lecture personnelle.", glyph: "L" },
    { key: "audio", label: "Audio", plural: "Audio", description: "Podcasts, émissions et conférences audio.", glyph: "A" },
    { key: "video", label: "Vidéo", plural: "Vidéos", description: "Films et extraits d’un côté ; cours et conférences de l’autre.", glyph: "V" },
    { key: "cours", label: "Cours écrits", plural: "Cours écrits", description: "Archives de Licence, Master et autres enseignements.", glyph: "C" }
  ];
  const filterMeta = new Map(FILTERS.map((item) => [item.key, item]));

  const state = {
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
    expandedSections: new Set()
  };

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

  function rawConceptHaystack(item) {
    return normalize([item.title, item.creator, item.subtitle, item.description, item.source, item.section, ...(item.themes || []), ...(item.people || []), ...(item.keywords || [])].filter(Boolean).join(" "));
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
    if (groupOf(item) === "video") return null;
    const match = [item.subtitle, item.description, item.source].filter(Boolean).join(" ").match(/(\d{1,3})\s*(?:min|minutes?)/i);
    if (match) return Number(match[1]);
    return ({ texte: 10, livre: 180, podcast: 45, audio: 35, cours: 20, article: 12 })[item.kind] || 15;
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
    return item.kind === "livre" ? "Lecture longue" : `≈ ${minutes} min`;
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
    if (item.kind === "livre") return ["approfondir"];
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
    return item.kind;
  }

  function videoType(item) {
    if (item.kind !== "video") return "";
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
    if (item.kind === "video") return videoType(item) === "cours" ? "Cours / conférence" : "Film / extrait";
    return ({ texte: "Texte", livre: "Livre", audio: "Audio", video: "Vidéo" })[groupOf(item)] || "Ressource";
  }

  function actionLabel(item) {
    return ({ texte: "Lire", livre: "Lire", audio: "Écouter", video: "Regarder", cours: "Ouvrir" })[groupOf(item)] || "Consulter";
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
      audio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M7.5 14.5a6.3 6.3 0 1 1 9 0M5 17a9.5 9.5 0 1 1 14 0M10 15.5l-1 5M14 15.5l1 5"/></svg>',
      video: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>',
      cours: '<svg viewBox="0 0 24 24"><path d="M5 3.5h11l3 3v14H5z"/><path d="M16 3.5v4h3M8 11h8M8 14h8M8 17h5"/></svg>'
    };
    return icons[group] || icons.texte;
  }

  // Compatible avec florianvallin.fr (racine /) et un Live Server qui sert /main/.
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
      item.teacher, item.enseignant, item.courseTeacher, item.sourceType,
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
    let list = resources.filter((item) => {
      if (groupOf(item) === "hidden") return false;
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
    resources.forEach((item) => {
      const group = groupOf(item);
      if (group === "hidden" || !filterMeta.has(group)) return;
      counts.all += 1;
      counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }

  function renderTypes() {
    const counts = countGroups();
    types.innerHTML = FILTERS.map((meta) => {
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
    return [...new Set(resources.map((item) => item.creator).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  }

  function uniqueConcepts() {
    const counts = new Map();
    resources.forEach((item) => directConcepts(item).forEach((concept) => counts.set(concept, (counts.get(concept) || 0) + 1)));
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
    if (embed && ["audio", "video"].includes(group)) {
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
    if (kind === "cours") return [item.formation, item.year].filter(Boolean).join(" · ") || item.subject || "Cours non classés";
    if (kind === "audio") return item.source || item.creator || "Autres";
    if (kind === "video") return videoType(item) === "cours" ? "Cours & conférences" : "Films & extraits";
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
    const grouped = new Map(["texte", "livre", "audio", "video", "cours"].map((kind) => [kind, []]));
    resources.forEach((item) => {
      const group = groupOf(item);
      if (grouped.has(group)) grouped.get(group).push(item);
    });
    grouped.forEach((list) => list.sort((a, b) => a.title.localeCompare(b.title, "fr")));

    const pinned = resources.filter((item) => groupOf(item) !== "hidden" && state.pinned.has(item.id)).slice(0, 5);

    home.innerHTML = `
      ${pinned.length ? `<section class="media-resume"><div class="media-resume-head"><span>Favoris</span><small>${pinned.length} ressource${pinned.length > 1 ? "s" : ""}</small></div><div class="media-resume-list">${pinned.map((item) => resourceRow(item, { showKind: true })).join("")}</div></section>` : ""}
      <div class="media-shelves">
        ${["texte", "livre", "audio", "cours", "video"].map((kind) => kind === "video" ? videoHomeShelf(grouped.get(kind)) : kind === "cours" ? courseHomeShelf(grouped.get(kind)) : homeShelf(kind, grouped.get(kind))).join("")}
      </div>`;
  }

  function renderGroupedSections(list) {
    const order = ["texte", "livre", "audio", "cours", "video"];
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
        <div class="media-resource-list">${visible.map((item) => resourceRow(item, { showKind: kind === "video" })).join("")}</div>
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

  function isHomeView() {
    return state.kind === "all" && !state.query && !state.person && !state.author && !state.theme && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage && !state.dossier && !state.pinnedOnly;
  }

  function renderResults() {
    const list = filteredResources();
    const homeView = isHomeView();
    home.hidden = !homeView;
    const courseEmptyView = !homeView && state.kind === "cours" && !state.query && !state.courseQuery && !state.person && !state.theme && !state.dossier && !state.pinnedOnly && !state.author && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage;
    listShell.hidden = homeView || (!list.length && !courseEmptyView);
    empty.hidden = homeView || list.length > 0 || courseEmptyView;

    if (homeView) {
      renderHome();
      summaryKicker.textContent = "Vue d’ensemble";
      summaryTitle.textContent = "Rayons";
      count.innerHTML = `<strong>${resources.filter((item) => groupOf(item) !== "hidden").length}</strong> ressources`;
      return;
    }

    const dossier = dossiers.find((item) => item.id === state.dossier);
    const meta = filterMeta.get(state.kind);
    summaryKicker.textContent = state.courseQuery && state.kind === "cours" ? "Résultats dans les cours" : state.query ? "Résultats" : state.kind !== "all" ? "Rayon" : "Sélection";
    summaryTitle.textContent = dossier?.title || state.person || state.author || state.theme || state.concept || (state.pinnedOnly ? "Favoris" : meta?.plural || "Ressources");
    count.innerHTML = `<strong>${list.length}</strong> ressource${list.length > 1 ? "s" : ""}`;

    const shouldGroupByKind = state.kind === "all";
    const shouldDirectory = state.kind !== "all" && !state.query && !state.courseQuery && !state.person && !state.theme && !state.dossier && !state.pinnedOnly && !state.author && !state.concept && !state.level && !state.difficulty && !state.duration && !state.usage;

    if (shouldGroupByKind) listShell.innerHTML = renderGroupedSections(list);
    else if (shouldDirectory && state.kind === "video") listShell.innerHTML = renderVideoDirectory(list);
    else if (shouldDirectory && state.kind === "cours") listShell.innerHTML = renderCourseDirectory(list);
    else if (shouldDirectory) listShell.innerHTML = renderDirectory(list, state.kind);
    else listShell.innerHTML = `<div class="media-resource-list is-standalone">${list.map((item) => resourceRow(item, { showKind: false })).join("")}</div>`;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.kind !== "all") params.set("type", state.kind);
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
    state.expandedSections.clear();
    render();
  }

  function initFromUrl() {
    const params = new URLSearchParams(location.search);
    state.query = params.get("q") || "";
    const type = params.get("type");
    state.kind = FILTERS.some((item) => item.key === type) ? type : "all";
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
  }

  function entityCounts(key) {
    const map = new Map();
    resources.forEach((item) => {
      if (groupOf(item) === "hidden") return;
      const values = key === "people"
        ? [...new Set((item.people || []).filter(Boolean))]
        : [...new Set((item.themes || []).filter(Boolean))];
      values.forEach((value) => map.set(value, (map.get(value) || 0) + 1));
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"));
  }

  function conceptResourceCount(concept) {
    return resources.filter((item) => groupOf(item) !== "hidden" && conceptMatches(item, concept)).length;
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
    return resources.filter((candidate) => candidate.id !== item.id && groupOf(candidate) !== "hidden")
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
    const embed = getEmbed(item);
    if (embed && ["audio", "video"].includes(groupOf(item))) {
      openPlayer(id);
      return;
    }
    const target = resolveUrl(item.url);
    if (isExternal(item.url)) window.open(target, "_blank", "noopener,noreferrer");
    else window.location.assign(target);
  }

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
      if (document.activeElement === search && state.query) {
        state.query = "";
        search.value = "";
        render();
      }
    }
  });

  initFromUrl();
  render();
})();

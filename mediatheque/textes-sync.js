(() => {
  "use strict";

  /*
   * Synchronisation automatique /textes/ → médiathèque
   * --------------------------------------------------
   * La source de vérité des textes est l'index global utilisé par la recherche du site.
   * Les fiches déjà présentes dans mediatheque/data.js sont conservées en priorité,
   * car elles contiennent souvent des métadonnées plus riches.
   * Seuls les textes absents sont ajoutés ici.
   */

  const DATA = window.FV_MEDIATHEQUE_DATA || (window.FV_MEDIATHEQUE_DATA = { resources: [], dossiers: [] });
  if (!Array.isArray(DATA.resources)) DATA.resources = [];

  const TERMINALE_THEMES = [
    "Art", "Bonheur", "Conscience", "Devoir", "État", "Inconscient", "Justice",
    "Langage", "Liberté", "Nature", "Raison", "Religion", "Science", "Technique",
    "Temps", "Travail", "Vérité"
  ];

  const EXTRA_THEMES = [
    "Culture", "Désir", "Morale", "Histoire", "Humanité", "Éducation",
    "Politique", "Violence", "Amour", "Amitié", "Théorie et expérience"
  ];

  const cleanText = (value = "") => String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  const normalizeUrl = (value = "") => {
    try {
      const url = new URL(value, location.origin);
      return url.pathname.replace(/\/+$/, "/");
    } catch (_) {
      return String(value).split(/[?#]/)[0].replace(/\/+$/, "/");
    }
  };

  const slugFromUrl = (url = "") => {
    const match = normalizeUrl(url).match(/^\/textes\/([^/]+)\/$/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const splitMeta = (meta = "") => {
    const parts = cleanText(meta).split(/\s+[—–]\s+/).filter(Boolean);
    return {
      creator: parts.shift() || "",
      subtitle: parts.join(" — ")
    };
  };

  const inferSection = (item) => {
    const label = cleanText(item.kindLabel || "");
    if (/Mythologie/i.test(label)) return "Mythologie";
    if (/Th[ée]ologie|Bible|Biblique/i.test(label)) return "Théologie";
    if (/Litt[ée]rature|Autres/i.test(label)) return "Autres";
    return "Philosophie";
  };

  const inferThemes = (item) => {
    const haystack = ` ${cleanText([item.kindLabel, item.meta, item.keywords].filter(Boolean).join(" · "))} `;
    const themes = [...TERMINALE_THEMES, ...EXTRA_THEMES].filter((theme) => {
      const escaped = theme.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[\\s·,;:/—–()])${escaped}($|[\\s·,;:/—–()])`, "i").test(haystack);
    });
    const label = cleanText(item.kindLabel || "");
    if (/HLP\s*Premi[èe]re/i.test(label)) themes.unshift("HLP Première");
    if (/HLP\s*Terminale/i.test(label)) themes.unshift("HLP Terminale");
    return [...new Set(themes)].slice(0, 8);
  };

  const toMediaResource = (item) => {
    const slug = slugFromUrl(item.url);
    if (!slug) return null;
    const { creator, subtitle } = splitMeta(item.meta);
    const keywords = cleanText(item.keywords || "")
      .split(/\s*·\s*/)
      .map((value) => value.trim())
      .filter(Boolean);

    return {
      id: `texte:${slug}`,
      kind: "texte",
      title: cleanText(item.title || slug),
      creator,
      subtitle,
      description: "",
      url: normalizeUrl(item.url),
      source: "Textes",
      section: inferSection(item),
      themes: inferThemes(item),
      people: creator ? [creator] : [],
      keywords: [...new Set(keywords)]
    };
  };

  async function synchronize() {
    const response = await fetch(`/js/site-search-index.json?v=${Date.now()}`, {
      cache: "no-store",
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error(`Index des textes indisponible (${response.status})`);

    const index = await response.json();
    if (!Array.isArray(index)) throw new Error("Index des textes invalide");

    const existingIds = new Set(DATA.resources.map((item) => item && item.id).filter(Boolean));
    const existingUrls = new Set(DATA.resources.map((item) => normalizeUrl(item && item.url || "")).filter(Boolean));

    let added = 0;
    index.forEach((item) => {
      if (!item || item.kind !== "texte" || !item.url || !item.title) return;
      const resource = toMediaResource(item);
      if (!resource) return;
      if (existingIds.has(resource.id) || existingUrls.has(resource.url)) return;
      DATA.resources.push(resource);
      existingIds.add(resource.id);
      existingUrls.add(resource.url);
      added += 1;
    });

    const totalTexts = DATA.resources.filter((item) => item && item.kind === "texte").length;
    window.FV_MEDIATHEQUE_TEXT_SYNC_STATUS = {
      ok: true,
      added,
      totalTexts,
      sourceTexts: index.filter((item) => item && item.kind === "texte").length
    };

    document.documentElement.dataset.textSync = "ready";
    document.documentElement.dataset.textCount = String(totalTexts);
    return window.FV_MEDIATHEQUE_TEXT_SYNC_STATUS;
  }

  window.FV_MEDIATHEQUE_TEXT_SYNC = synchronize().catch((error) => {
    console.warn("[Médiathèque] Synchronisation des textes impossible :", error);
    window.FV_MEDIATHEQUE_TEXT_SYNC_STATUS = { ok: false, error: String(error && error.message || error) };
    document.documentElement.dataset.textSync = "fallback";
    // La médiathèque reste parfaitement utilisable avec data.js même si l'index global ne charge pas.
    return window.FV_MEDIATHEQUE_TEXT_SYNC_STATUS;
  });
})();

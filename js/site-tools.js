(() => {
  "use strict";

  const VERSION = "20260926-prod4";
  const ready = (fn) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn, { once: true })
    : fn();

  const PLATFORM_NAME = String(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || "");
  const IS_MAC = /mac/i.test(PLATFORM_NAME);
  const KEY_LABELS = {
    alt: IS_MAC ? "⌥" : "Alt",
    shift: IS_MAC ? "⇧" : "Maj",
    meta: IS_MAC ? "⌘" : "Ctrl"
  };

  const keyLabel = (name) => KEY_LABELS[name] || name;

  // Le service worker n'a besoin de contrôler que le lecteur /lecture/.
  // Les anciennes versions l'enregistraient à la racine du site, ce qui pouvait
  // interférer avec des pages comme /textes/. On migre silencieusement vers un
  // scope limité au lecteur, sans rechargement automatique de la page courante.
  manageReaderServiceWorker();

  ready(() => {
    ensureStylesheet();
    document.body.classList.add("fv-site-tools-ready");
    applyPlatformShortcutLabels(document);
    initShortcuts();
    initFloatingTools();
  });

  function manageReaderServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const migrate = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(async (registration) => {
          const scopePath = new URL(registration.scope).pathname;
          const worker = registration.active || registration.waiting || registration.installing;
          const scriptPath = worker ? new URL(worker.scriptURL).pathname : "";
          const isPhilosophalWorker = scriptPath.endsWith("/sw.js") || scopePath === "/" || scopePath === "/main/";
          const isReaderScope = scopePath === "/lecture/" || scopePath === "/main/lecture/";
          if (isPhilosophalWorker && !isReaderScope) await registration.unregister();
        }));

        // Live Server doit lire directement les fichiers du disque.
        if (localHost) return;

        await navigator.serviceWorker.register("/sw.js?v=20260926-prod4", {
          scope: "/lecture/",
          updateViaCache: "none"
        });
      } catch (_) {}
    };

    if (document.readyState === "complete") migrate();
    else window.addEventListener("load", migrate, { once: true });
  }

  function ensureStylesheet() {
    if (document.querySelector('link[data-fv-site-tools-css], link[href*="site-tools.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${resolveSitePath("/css/site-tools.css")}?v=${VERSION}`;
    link.dataset.fvSiteToolsCss = "";
    document.head.append(link);
  }

  function isTypingTarget(target) {
    return target instanceof HTMLElement && (
      target.matches("input, textarea, select, [role='textbox']") || target.isContentEditable
    );
  }

  function normalizeKey(event) {
    return String(event.key || "").toLocaleLowerCase("fr");
  }

  function consumeShortcut(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  function resolveSitePath(path) {
    const value = String(path || "");
    if (!value.startsWith("/")) return value;

    // Quand Live Server sert le dossier parent et que le site se trouve dans /main/,
    // on conserve les mêmes routes logiques tout en ajoutant le préfixe local.
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (localHost && /^\/main(?:\/|$)/.test(window.location.pathname) && !value.startsWith("/main/")) {
      return `/main${value}`;
    }
    return value;
  }

  function go(path) {
    window.location.assign(resolveSitePath(path));
  }

  async function openBlogHub() {
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

    // En local, d'anciens service workers / caches de Live Server peuvent servir
    // une ancienne copie de /blog/index.html. On nettoie uniquement l'environnement
    // de développement avant d'ouvrir une route dédiée, non ambiguë.
    if (localHost) {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch (_) {}

      window.location.assign(resolveSitePath("/blog/tous-les-billets.html?v=20260923-github-refresh1"));
      return;
    }

    go("/blog/");
  }

  function openPrivateLibrary() {
    go("/lecture/?view=library");
  }

  function applyPlatformShortcutLabels(root = document) {
    root.querySelectorAll("[data-fv-key]").forEach((node) => {
      const name = node.dataset.fvKey;
      if (KEY_LABELS[name]) node.textContent = KEY_LABELS[name];
    });
    root.querySelectorAll("[data-fv-platform]").forEach((node) => {
      node.textContent = IS_MAC ? "macOS" : "Windows / Linux";
    });
  }

  function initShortcuts() {
    // Raccourcis globaux : uniquement sur keydown. event.code reste fiable
    // avec un clavier AZERTY, y compris lorsque Alt modifie event.key.
    const codeMatches = (event, code, fallbackKey = "") => {
      if (event.code === code) return true;
      return fallbackKey && normalizeKey(event) === fallbackKey;
    };

    const shortcutHelpIsOpen = () => Boolean(shortcutShell && !shortcutShell.hidden);

    const onKeyDown = (event) => {
      // L'aide clavier est prioritaire : Échap doit toujours la fermer,
      // quel que soit l'élément qui a actuellement le focus.
      if (event.key === "Escape" && shortcutHelpIsOpen()) {
        consumeShortcut(event);
        closeShortcutHelp();
        return;
      }

      if (isTypingTarget(event.target)) return;
      if (event.metaKey) return;

      const questionMark = event.key === "?" || (event.shiftKey && ["Slash", "Comma"].includes(event.code));

      // Aide complète : Alt + Maj + ?
      if (event.altKey && event.shiftKey && questionMark) {
        consumeShortcut(event);
        openShortcutHelp("complete");
        return;
      }

      // Aide générale : Maj + ?
      if (!event.altKey && !event.ctrlKey && event.shiftKey && questionMark) {
        consumeShortcut(event);
        openShortcutHelp("standard");
        return;
      }

      // Accès privés : Alt uniquement. Toute combinaison contenant Ctrl est ignorée.
      if (event.altKey && !event.ctrlKey && !event.shiftKey) {
        const destinations = [
          ["KeyA", "a", "/art/"],
          ["KeyL", "l", "__library__"],
          ["KeyC", "c", "/mediatheque/"],
          ["KeyB", "b", "/textes/theologie/boussole/"],
          ["KeyM", "m", "/textes/mythologie/boussole/"],
          ["KeyP", "p", "/textes/philosophie/boussole/"]
        ];

        for (const [code, key, path] of destinations) {
          if (!codeMatches(event, code, key)) continue;
          consumeShortcut(event);
          closeShortcutHelp();
          if (path === "__library__") openPrivateLibrary();
          else go(path);
          return;
        }
        return;
      }

      if (event.ctrlKey) return;

      const plain = !event.altKey && !event.shiftKey;
      if (!plain) return;

      if (codeMatches(event, "KeyD", "d")) {
        consumeShortcut(event);
        closeShortcutHelp();
        openDictionary();
        return;
      }
      if (codeMatches(event, "KeyR", "r")) {
        consumeShortcut(event);
        // Ne jamais laisser l'aide clavier au-dessus de la recherche.
        closeShortcutHelp();
        openSiteSearch();
        return;
      }
      if (codeMatches(event, "KeyT", "t")) {
        consumeShortcut(event);
        closeShortcutHelp();
        go("/textes/");
        return;
      }
      if (codeMatches(event, "KeyB", "b")) {
        consumeShortcut(event);
        closeShortcutHelp();
        openBlogHub();
        return;
      }
      if (codeMatches(event, "KeyH", "h")) {
        consumeShortcut(event);
        closeShortcutHelp();
        go("/");
        return;
      }
      if (codeMatches(event, "KeyC", "c")) {
        consumeShortcut(event);
        closeShortcutHelp();
        go("/#contact");
        return;
      }
      if (codeMatches(event, "KeyS", "s")) {
        consumeShortcut(event);
        closeShortcutHelp();
        openStudentAccess();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
  }

  function openMediatheque() {
    if (window.location.pathname.startsWith("/mediatheque/")) {
      const input = document.querySelector("[data-media-search]");
      if (input) {
        input.focus({ preventScroll: true });
        input.select?.();
        return;
      }
    }
    go("/mediatheque/");
  }

  function openSiteSearch() {
    closeShortcutHelp();
    if (window.FVSiteSearch?.open) {
      window.FVSiteSearch.open();
      return;
    }

    const trigger = document.querySelector("[data-site-search-open]");
    if (trigger) {
      trigger.click();
      return;
    }

    // Les quelques pages autonomes (lecteur, art, anciennes redirections)
    // n’embarquent pas la recherche complète : on revient à l’accueil et
    // on l’ouvre automatiquement une fois le script principal chargé.
    try { sessionStorage.setItem("fv-open-site-search", "1"); } catch (_) {}
    go("/");
  }

  function icon(name) {
    const icons = {
      dictionary: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.7 4.7c0-1 .8-1.8 1.8-1.8h4.1c1.1 0 2 .35 2.4 1.05.4-.7 1.3-1.05 2.4-1.05h4.1c1 0 1.8.8 1.8 1.8v12.45c0 .55-.45 1-1 1h-4.65c-1.25 0-2.15.35-2.65 1.05-.5-.7-1.4-1.05-2.65-1.05H4.7c-.55 0-1-.45-1-1V4.7Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M12 4.05v15.1M6.5 7.25h3M6.5 10.15h2.35M14.65 7.25h2.85" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><circle cx="17.35" cy="16.45" r="2.25" fill="white" stroke="currentColor" stroke-width="1.45"/><path d="m19 18.1 1.8 1.8" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>',
      contact: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>',
      up: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M12 5 6 11M12 5l6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" stroke-width="1.5"/><path d="m15.6 15.6 4.1 4.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
    };
    return icons[name] || "";
  }

  function initFloatingTools() {
    const isMainIndex = Boolean(document.querySelector("#contact.contact-section"));
    let backToTop = document.getElementById("backToTop");
    let generatedBackToTop = false;

    if (!backToTop) {
      generatedBackToTop = true;
      backToTop = document.createElement("button");
      backToTop.type = "button";
      backToTop.className = "fv-tools-up";
      backToTop.setAttribute("aria-label", "Retour en haut");
      backToTop.dataset.fvLabel = "Retour en haut";
      backToTop.innerHTML = icon("up");
      document.body.append(backToTop);
      backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    } else {
      backToTop.dataset.fvLabel = "Retour en haut";
    }

    let dictionary = null;
    if (!isMainIndex) {
      dictionary = document.createElement("button");
      dictionary.type = "button";
      dictionary.className = "fv-tools-fab fv-tools-dictionary";
      dictionary.setAttribute("aria-label", "Ouvrir les dictionnaires");
      dictionary.dataset.fvLabel = "Dictionnaires";
      dictionary.innerHTML = icon("dictionary");
      dictionary.addEventListener("click", openDictionary);
      document.body.append(dictionary);
    }

    const contact = document.createElement("a");
    contact.className = "fv-tools-fab fv-tools-contact";
    contact.href = "/#contact";
    contact.setAttribute("aria-label", "Aller au contact");
    contact.dataset.fvLabel = "Contact";
    contact.innerHTML = icon("contact");
    document.body.append(contact);

    const update = () => {
      const visible = window.scrollY > 400;
      dictionary?.classList.toggle("is-visible", visible);
      contact.classList.toggle("is-visible", visible);
      if (generatedBackToTop) backToTop.classList.toggle("is-visible", visible);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  const sources = {
    philosophy: {
      label: "Philosophie",
      short: "Philo",
      global: "FV_PHILOSOPHY_DICTIONARY_ENTRIES",
      src: `/js/philosophy-dictionary-data.js?v=${VERSION}`,
      full: "/textes/philosophie/boussole/#dictionnaire",
      example: "liberté"
    },
    mythology: {
      label: "Mythologie",
      short: "Mythes",
      global: "FV_MYTHOLOGY_DICTIONARY_ENTRIES",
      src: `/js/mythology-dictionary-data.js?v=${VERSION}`,
      full: "/textes/mythologie/boussole/",
      example: "hubris"
    },
    bible: {
      label: "Bible",
      short: "Bible",
      global: "BIBLE_GLOSSARY",
      src: `/js/bible-glossary-data.js?v=${VERSION}`,
      full: "/textes/theologie/boussole/#glossaire",
      example: "alliance"
    }
  };

  let dictionaryShell = null;
  let activeSource = "all";
  let activeEntrySource = null;
  const loading = new Map();

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("fr")
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function cleanInline(value) {
    return String(value || "")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  function truncate(value, max = 150) {
    const text = cleanInline(value);
    return text.length <= max ? text : `${text.slice(0, max - 1).trim()}…`;
  }

  function loadSource(key) {
    const source = sources[key];
    if (Array.isArray(window[source.global])) return Promise.resolve(window[source.global]);
    if (loading.has(key)) return loading.get(key);

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source.src;
      script.async = true;
      script.onload = () => Array.isArray(window[source.global])
        ? resolve(window[source.global])
        : reject(new Error(`Données ${key} indisponibles`));
      script.onerror = reject;
      document.head.append(script);
    });

    loading.set(key, promise);
    return promise;
  }

  function loadAllSources() {
    return Promise.allSettled(Object.keys(sources).map(loadSource));
  }

  function createDictionary() {
    if (dictionaryShell) return dictionaryShell;

    dictionaryShell = document.createElement("div");
    dictionaryShell.className = "fv-dictionary-shell";
    dictionaryShell.hidden = true;
    dictionaryShell.innerHTML = `
      <button class="fv-dictionary-backdrop" type="button" data-fv-dict-close aria-label="Fermer les dictionnaires"></button>
      <aside class="fv-dictionary-panel" role="dialog" aria-modal="true" aria-labelledby="fv-dictionary-title">
        <header class="fv-dictionary-head">
          <div class="fv-dictionary-head-top">
            <div class="fv-dictionary-brand">
              <span class="fv-dictionary-brand-icon" aria-hidden="true">${icon("dictionary")}</span>
              <div>
                <span class="fv-dictionary-eyebrow">Recherche transversale</span>
                <h2 id="fv-dictionary-title">Dictionnaires</h2>
              </div>
            </div>
            <button class="fv-dictionary-close" type="button" data-fv-dict-close aria-label="Fermer">×</button>
          </div>
          <p class="fv-dictionary-intro">Un seul outil pour chercher dans la philosophie, la mythologie et la Bible.</p>
          <div class="fv-dictionary-search">
            ${icon("search")}
            <input type="search" data-fv-dict-search autocomplete="off" spellcheck="false" placeholder="Rechercher dans les 3 dictionnaires…" aria-label="Rechercher dans les dictionnaires">
            <button class="fv-dictionary-clear" type="button" data-fv-dict-clear aria-label="Effacer la recherche" hidden>×</button>
          </div>
          <div class="fv-dictionary-tabs" role="tablist" aria-label="Filtrer le dictionnaire">
            <button type="button" role="tab" data-fv-dict-tab="all" class="is-active" aria-selected="true">Tous</button>
            ${Object.entries(sources).map(([key, source]) => `<button type="button" role="tab" data-fv-dict-tab="${key}" aria-selected="false">${source.label}</button>`).join("")}
          </div>
        </header>
        <div class="fv-dictionary-content">
          <div class="fv-dictionary-status" data-fv-dict-status></div>
          <div class="fv-dictionary-results" data-fv-dict-results></div>
          <div data-fv-dict-detail></div>
          <div class="fv-dictionary-footer" data-fv-dict-footer></div>
        </div>
      </aside>`;

    document.body.append(dictionaryShell);

    dictionaryShell.querySelectorAll("[data-fv-dict-close]").forEach((el) => el.addEventListener("click", closeDictionary));
    dictionaryShell.querySelectorAll("[data-fv-dict-tab]").forEach((button) => button.addEventListener("click", () => switchDictionary(button.dataset.fvDictTab)));

    const input = dictionaryShell.querySelector("[data-fv-dict-search]");
    const clear = dictionaryShell.querySelector("[data-fv-dict-clear]");
    input.addEventListener("input", () => {
      clear.hidden = !input.value;
      renderDictionary();
    });
    clear.addEventListener("click", () => {
      input.value = "";
      clear.hidden = true;
      input.focus();
      renderDictionary();
    });

    dictionaryShell.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDictionary();
    });

    return dictionaryShell;
  }

  function openDictionary() {
    const root = createDictionary();
    activeSource = "all";
    activeEntrySource = null;
    root.querySelectorAll("[data-fv-dict-tab]").forEach((button) => {
      const on = button.dataset.fvDictTab === "all";
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-selected", String(on));
    });
    const input = root.querySelector("[data-fv-dict-search]");
    input.value = "";
    root.querySelector("[data-fv-dict-clear]").hidden = true;
    root.hidden = false;
    document.body.classList.add("fv-dictionary-open");
    root.querySelector("[data-fv-dict-status]").textContent = "Chargement des 3 dictionnaires…";
    root.querySelector("[data-fv-dict-results]").innerHTML = "";
    root.querySelector("[data-fv-dict-detail]").innerHTML = "";
    loadAllSources().then((states) => {
      renderDictionary();
      const failed = states.filter((state) => state.status === "rejected").length;
      if (failed) {
        const status = root.querySelector("[data-fv-dict-status]");
        status.textContent += ` · ${failed} source${failed > 1 ? "s" : ""} indisponible${failed > 1 ? "s" : ""}.`;
      }
      requestAnimationFrame(() => input?.focus({ preventScroll: true }));
    });
  }

  function closeDictionary() {
    if (!dictionaryShell) return;
    dictionaryShell.hidden = true;
    document.body.classList.remove("fv-dictionary-open");
  }

  function switchDictionary(key) {
    if (key !== "all" && !sources[key]) return;
    activeSource = key;
    activeEntrySource = null;
    const root = createDictionary();
    root.querySelectorAll("[data-fv-dict-tab]").forEach((button) => {
      const on = button.dataset.fvDictTab === key;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-selected", String(on));
    });
    root.querySelector("[data-fv-dict-detail]").innerHTML = "";
    renderDictionary();
  }

  function getEntryText(entry, key) {
    if (key === "philosophy") {
      return [entry.term, entry.aliases, entry.category, entry.lead, entry.etymology, ...(entry.senses || []), ...(entry.authors || []).flatMap(a => [a.name, a.text]), ...(entry.related || [])].join(" ");
    }
    if (key === "bible") {
      return [entry.term, ...(entry.aliases || []), entry.category, entry.origin, entry.definition, entry.context, entry.history, entry.literary, entry.theology, entry.nuance, entry.refs, ...(entry.related || [])].join(" ");
    }
    return [entry.term, entry.category, entry.definition, entry.nuance, entry.example].join(" ");
  }

  function entryPreview(entry, key) {
    if (key === "philosophy") return entry.lead || entry.senses?.[0] || "";
    return entry.definition || entry.nuance || "";
  }

  function rankEntry(entry, key, q, terms) {
    const title = normalize(entry.term);
    const hay = normalize(getEntryText(entry, key));
    const aliases = normalize(Array.isArray(entry.aliases) ? entry.aliases.join(" ") : entry.aliases);

    if (!q) return 1;

    let score = 0;
    if (title === q) score += 150;
    else if (title.startsWith(q)) score += 100;
    else if (title.includes(q)) score += 70;
    if (aliases.split(" ").includes(q)) score += 80;
    else if (aliases.includes(q)) score += 45;
    if (terms.every((term) => hay.includes(term))) score += 35;
    else if (terms.some((term) => hay.includes(term))) score += 10;
    return score;
  }

  function availableEntries() {
    const keys = activeSource === "all" ? Object.keys(sources) : [activeSource];
    return keys.flatMap((key) => (window[sources[key].global] || []).map((entry) => ({ entry, key })));
  }

  function renderDictionary() {
    if (!dictionaryShell || dictionaryShell.hidden) return;

    const input = dictionaryShell.querySelector("[data-fv-dict-search]");
    const status = dictionaryShell.querySelector("[data-fv-dict-status]");
    const results = dictionaryShell.querySelector("[data-fv-dict-results]");
    const detail = dictionaryShell.querySelector("[data-fv-dict-detail]");
    const q = normalize(input.value);
    const terms = q.split(" ").filter(Boolean);
    const allEntries = availableEntries();

    detail.innerHTML = "";
    activeEntrySource = null;
    renderDictionaryFooter();

    if (!q && activeSource === "all") {
      const counts = Object.fromEntries(Object.entries(sources).map(([key, source]) => [key, (window[source.global] || []).length]));
      const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
      status.textContent = `${total} entrées disponibles dans 3 dictionnaires.`;
      results.innerHTML = `
        <div class="fv-dictionary-overview">
          ${Object.entries(sources).map(([key, source]) => `
            <button type="button" class="fv-dictionary-source-card" data-fv-source-card="${key}">
              <span class="fv-dictionary-source-name">${source.label}</span>
              <strong>${counts[key]}</strong>
              <small>entrées · ex. « ${source.example} »</small>
            </button>`).join("")}
        </div>
        <div class="fv-dictionary-hint"><strong>Astuce :</strong> saisissez un mot, un auteur, une figure ou une notion. Les résultats des trois dictionnaires seront mélangés et identifiés par source.</div>`;
      results.querySelectorAll("[data-fv-source-card]").forEach((button) => button.addEventListener("click", () => switchDictionary(button.dataset.fvSourceCard)));
      return;
    }

    const matches = allEntries
      .map(({ entry, key }) => ({ entry, key, score: rankEntry(entry, key, q, terms) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || String(a.entry.term).localeCompare(String(b.entry.term), "fr"));
    const limit = q ? 30 : 18;
    const ranked = matches.slice(0, limit);

    const totalSourceEntries = allEntries.length;
    if (q) {
      if (matches.length) {
        const scope = activeSource === "all" ? "les 3 dictionnaires" : sources[activeSource].label;
        status.textContent = matches.length > limit
          ? `${matches.length} résultats dans ${scope} · ${limit} premiers affichés.`
          : `${matches.length} résultat${matches.length > 1 ? "s" : ""} dans ${scope}.`;
      } else {
        status.textContent = "Aucun résultat. Essayez un terme plus simple ou passez sur « Tous ».";
      }
    } else {
      status.textContent = `${totalSourceEntries} entrées · ${sources[activeSource].label}.`;
    }

    results.innerHTML = ranked.length ? ranked.map(({ entry, key }, index) => `
      <button type="button" class="fv-dictionary-result" data-fv-entry-index="${index}">
        <span class="fv-dictionary-result-top">
          <strong>${esc(entry.term)}</strong>
          <span class="fv-dictionary-source-badge fv-dictionary-source-badge--${key}">${esc(sources[key].short)}</span>
        </span>
        <span class="fv-dictionary-result-category">${esc(entry.category || "Entrée")}</span>
        <span class="fv-dictionary-result-preview">${esc(truncate(entryPreview(entry, key), 155))}</span>
      </button>`).join("") : '<div class="fv-dictionary-empty">Aucune entrée trouvée.</div>';

    results.querySelectorAll("[data-fv-entry-index]").forEach((button) => button.addEventListener("click", () => {
      const item = ranked[Number(button.dataset.fvEntryIndex)];
      if (item) renderEntry(item.entry, item.key);
    }));
  }

  function renderDictionaryFooter() {
    const footer = dictionaryShell.querySelector("[data-fv-dict-footer]");
    if (activeSource === "all") {
      footer.innerHTML = `<span>Ouvrir en grand :</span><div>${Object.entries(sources).map(([, source]) => `<a href="${source.full}">${source.short}</a>`).join("")}</div>`;
      return;
    }
    footer.innerHTML = `<span>${sources[activeSource].label}</span><a href="${sources[activeSource].full}">Ouvrir le dictionnaire complet →</a>`;
  }

  function renderEntry(entry, key) {
    activeEntrySource = key;
    const detail = dictionaryShell.querySelector("[data-fv-dict-detail]");
    const results = dictionaryShell.querySelector("[data-fv-dict-results]");
    results.innerHTML = "";
    dictionaryShell.querySelector("[data-fv-dict-status]").textContent = "";

    let main = "";
    const blocks = [];
    const related = entry.related || [];

    if (key === "philosophy") {
      main = entry.lead || "";
      if (entry.etymology) blocks.push(["Étymologie / repère", entry.etymology]);
      if (entry.senses?.length) blocks.push(["Sens et usages", entry.senses.join(" ")]);
      if (entry.authors?.length) blocks.push(["Auteurs", entry.authors.map(a => `${a.name} — ${a.text}`).join(" ")]);
    } else if (key === "bible") {
      main = entry.definition || "";
      if (entry.origin) blocks.push(["Origine", entry.origin]);
      if (entry.context) blocks.push(["Dans les textes", entry.context]);
      if (entry.nuance) blocks.push(["Nuance importante", entry.nuance]);
      if (entry.refs) blocks.push(["Textes & repères", entry.refs]);
    } else {
      main = entry.definition || "";
      if (entry.example) blocks.push(["Exemple dans les récits", entry.example]);
      if (entry.nuance) blocks.push(["Nuance importante", entry.nuance]);
    }

    detail.innerHTML = `<article class="fv-dictionary-detail">
      <button type="button" class="fv-dictionary-back" data-fv-dict-back>← Retour aux résultats</button>
      <div class="fv-dictionary-detail-meta">
        <span class="fv-dictionary-source-badge fv-dictionary-source-badge--${key}">${esc(sources[key].label)}</span>
        <span>${esc(entry.category || "Entrée")}</span>
      </div>
      <h3>${esc(entry.term)}</h3>
      <p>${esc(cleanInline(main))}</p>
      ${blocks.length ? `<dl>${blocks.map(([title, text]) => `<dt>${esc(title)}</dt><dd>${esc(cleanInline(text))}</dd>`).join("")}</dl>` : ""}
      ${related.length ? `<div class="fv-dictionary-related"><span>Voir aussi</span>${related.slice(0, 8).map(term => `<button type="button" data-fv-related="${esc(term)}">${esc(term)}</button>`).join("")}</div>` : ""}
    </article>`;

    detail.querySelector("[data-fv-dict-back]")?.addEventListener("click", renderDictionary);
    detail.querySelectorAll("[data-fv-related]").forEach((button) => button.addEventListener("click", () => {
      const entries = window[sources[key].global] || [];
      const wanted = normalize(button.dataset.fvRelated);
      const next = entries.find(item => normalize(item.term) === wanted);
      if (next) renderEntry(next, key);
      else {
        const input = dictionaryShell.querySelector("[data-fv-dict-search]");
        input.value = button.dataset.fvRelated;
        dictionaryShell.querySelector("[data-fv-dict-clear]").hidden = false;
        if (activeSource !== "all" && activeSource !== key) switchDictionary(key);
        renderDictionary();
      }
    }));
  }

  let shortcutShell = null;

  function createShortcutHelp() {
    if (shortcutShell) return shortcutShell;
    shortcutShell = document.createElement("div");
    shortcutShell.className = "fv-shortcuts-shell";
    shortcutShell.hidden = true;
    document.body.append(shortcutShell);
    shortcutShell.addEventListener("keydown", (event) => { if (event.key === "Escape") closeShortcutHelp(); });
    shortcutShell.addEventListener("click", (event) => {
      if (event.target.closest("[data-fv-shortcuts-close]")) closeShortcutHelp();
    });
    return shortcutShell;
  }

  function shortcutRow(...parts) {
    const label = parts.pop();
    return `<div class="fv-shortcut-row"><span>${parts.map((part) => `<kbd>${esc(part)}</kbd>`).join('<i>+</i>')}</span><strong>${esc(label)}</strong></div>`;
  }

  function shortcutSection(title, eyebrow, rows, className = "") {
    return `<section class="fv-shortcuts-section${className ? ` ${className}` : ""}">
      <div class="fv-shortcuts-section-head"><span>${esc(eyebrow)}</span><h3>${esc(title)}</h3></div>
      <div class="fv-shortcuts-grid">${rows.join("")}</div>
    </section>`;
  }

  function shortcutMarkup(mode) {
    const standardRows = [
      shortcutRow("H", "Accueil"),
      shortcutRow("R", "Recherche du site"),
      shortcutRow("D", "Dictionnaires"),
      shortcutRow("T", "Textes"),
      shortcutRow("B", "Blog"),
      shortcutRow("C", "Contact"),
      shortcutRow("S", "Espace élève · S’identifier"),
      shortcutRow(keyLabel("shift"), "?", "Afficher cette aide")
    ];

    const compassRows = [
      shortcutRow(keyLabel("alt"), "P", "Boussole philosophique"),
      shortcutRow(keyLabel("alt"), "M", "Boussole mythologique"),
      shortcutRow(keyLabel("alt"), "B", "Boussole biblique")
    ];

    const privateRows = [
      shortcutRow(keyLabel("alt"), "A", "Art"),
      shortcutRow(keyLabel("alt"), "L", "Livres"),
      shortcutRow(keyLabel("alt"), "C", "Médiathèque"),
      shortcutRow(keyLabel("alt"), keyLabel("shift"), "?", "Afficher l’aide complète")
    ];

    const readerRows = [
      shortcutRow("←", "→", "Changer de page"),
      shortcutRow("/", "Rechercher dans le livre"),
      shortcutRow(keyLabel("shift"), "B", "Ajouter / retirer un marque-page"),
      shortcutRow(keyLabel("shift"), "T", "Changer le thème du lecteur"),
      shortcutRow(keyLabel("shift"), "M", "Mode focus"),
      shortcutRow("F", "Plein écran"),
      shortcutRow(keyLabel("alt"), "← / →", "Historique de lecture"),
      shortcutRow("Échap", "Fermer les panneaux")
    ];

    const mediaRows = [
      shortcutRow("/", "Rechercher dans la médiathèque"),
      shortcutRow("Échap", "Fermer le lecteur intégré / l’exploration")
    ];

    const complete = mode === "complete";
    return `
      <button class="fv-shortcuts-backdrop" type="button" data-fv-shortcuts-close aria-label="Fermer l’aide"></button>
      <section class="fv-shortcuts-panel${complete ? " is-complete" : ""}" role="dialog" aria-modal="true" aria-labelledby="fv-shortcuts-title">
        <div class="fv-shortcuts-head">
          <div><span>${complete ? "Aide complète" : "Navigation"}</span><h2 id="fv-shortcuts-title">Raccourcis clavier</h2></div>
          <button type="button" data-fv-shortcuts-close aria-label="Fermer">×</button>
        </div>
        <p>${complete ? "Tous les raccourcis disponibles sur le site." : "Les raccourcis essentiels pour naviguer plus rapidement."} <span class="fv-shortcuts-platform">${IS_MAC ? "Touches macOS" : "Touches Windows / Linux"}</span></p>
        ${shortcutSection("Navigation", complete ? "Général" : "Raccourcis", standardRows)}
        ${shortcutSection("Boussoles", "Explorer", compassRows, "is-compasses")}
        ${complete ? shortcutSection("Accès supplémentaires", "Accès direct", privateRows) : ""}
        ${complete ? shortcutSection("Lecteur de livres", "Contexte · /lecture/", readerRows) : ""}
        ${complete ? shortcutSection("Médiathèque", "Contexte · /mediatheque/", mediaRows) : ""}
        <div class="fv-shortcuts-note"><kbd>Échap</kbd><span>ferme cette fenêtre et la plupart des panneaux du site.</span></div>
      </section>`;
  }

  function openShortcutHelp(mode = "standard") {
    const root = createShortcutHelp();
    root.innerHTML = shortcutMarkup(mode);
    root.hidden = false;
    document.body.classList.add("fv-shortcuts-open");
    requestAnimationFrame(() => root.querySelector("[data-fv-shortcuts-close]")?.focus({ preventScroll: true }));
  }

  function closeShortcutHelp() {
    if (!shortcutShell) return;
    shortcutShell.hidden = true;
    document.body.classList.remove("fv-shortcuts-open");
  }

  let fallbackStudentShell = null;

  function openStudentAccess() {
    if (window.FVStudentAccess?.open) {
      window.FVStudentAccess.open();
      return;
    }

    const existingButton = document.querySelector("[data-student-access]");
    if (existingButton) {
      existingButton.click();
      return;
    }

    const root = createFallbackStudentAccess();
    root.hidden = false;
    requestAnimationFrame(() => root.querySelector("[data-fv-student-password]")?.focus({ preventScroll: true }));
  }

  function createFallbackStudentAccess() {
    if (fallbackStudentShell) return fallbackStudentShell;

    const portals = {
      didier: "https://bold-beanie-f93.notion.site/Cours-Philosophie-Didier-35781643740b80b28dc8cd07c1e59ea7?source=copy_link",
      art: "/art/",
      livre: "/lecture/",
      livres: "/lecture/",
      media: "/mediatheque/",
      mediatheque: "/mediatheque/",
      bible: "/textes/theologie/boussole/"
    };

    fallbackStudentShell = document.createElement("div");
    fallbackStudentShell.className = "fv-student-shell";
    fallbackStudentShell.hidden = true;
    fallbackStudentShell.innerHTML = `
      <button class="fv-student-backdrop" type="button" data-fv-student-close aria-label="Fermer"></button>
      <section class="fv-student-panel" role="dialog" aria-modal="true" aria-labelledby="fv-student-title">
        <button class="fv-student-close" type="button" data-fv-student-close aria-label="Fermer">×</button>
        <span>Espace élève</span>
        <h2 id="fv-student-title">S’identifier</h2>
        <form data-fv-student-form>
          <label for="fv-student-password">Mot de passe</label>
          <div><input id="fv-student-password" type="password" autocomplete="current-password" placeholder="Mot de passe" data-fv-student-password><button type="submit">Accéder <span aria-hidden="true">→</span></button></div>
          <p data-fv-student-feedback aria-live="polite"></p>
        </form>
      </section>`;
    document.body.append(fallbackStudentShell);

    const input = fallbackStudentShell.querySelector("[data-fv-student-password]");
    const feedback = fallbackStudentShell.querySelector("[data-fv-student-feedback]");

    const close = () => { fallbackStudentShell.hidden = true; };
    fallbackStudentShell.querySelectorAll("[data-fv-student-close]").forEach((el) => el.addEventListener("click", close));
    fallbackStudentShell.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
    fallbackStudentShell.querySelector("[data-fv-student-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const key = normalize(input.value).replace(/\s+/g, "");
      const destination = portals[key];
      if (!destination) {
        feedback.textContent = "Mot de passe non reconnu.";
        return;
      }
      feedback.textContent = "Accès reconnu — ouverture de votre espace…";
      window.location.href = resolveSitePath(destination);
    });

    input.addEventListener("input", () => {
      const key = normalize(input.value).replace(/\s+/g, "");
      if (!portals[key]) {
        feedback.textContent = "";
        return;
      }
      window.location.href = resolveSitePath(portals[key]);
    });

    return fallbackStudentShell;
  }
})();

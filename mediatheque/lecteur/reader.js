(() => {
  "use strict";

  const Books = window.PhilosophalBooks;
  if (!Books) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const welcome = $("[data-welcome]");
  const workspace = $("[data-workspace]");
  const render = $("[data-render]");
  const plain = $("[data-plain]");
  const loading = $("[data-loading]");
  const fileInput = $("[data-file-input]");
  const progress = $("[data-progress]");
  const progressLabel = $("[data-progress-label]");
  const headTitle = $("[data-head-title]");
  const headAuthor = $("[data-head-author]");
  const recentBooks = $("[data-recent-books]");
  const recentEmpty = $("[data-recent-empty]");
  const libraryDrawer = $("[data-library-drawer]");
  const libraryList = $("[data-library-list]");
  const libraryEmpty = $("[data-library-empty]");
  const storageInfo = $("[data-storage-info]");
  const tocDrawer = $("[data-toc-drawer]");
  const toc = $("[data-toc]");
  const tocEmpty = $("[data-toc-empty]");
  const settingsPanel = $("[data-settings]");
  const settingsToggle = $("[data-toggle-settings]");
  const globalDrop = $("[data-global-drop]");
  const toast = $("[data-toast]");
  const focusButtons = $$("[data-focus-reader]");

  const settingsInputs = {
    fontSize: $("[data-font-size]"),
    lineHeight: $("[data-line-height]"),
    fontFamily: $("[data-font-family]"),
    theme: $("[data-theme]"),
    flow: $("[data-flow]")
  };

  const DEFAULT_SETTINGS = {
    fontSize: 100,
    lineHeight: 1.6,
    fontFamily: "serif",
    theme: "paper",
    flow: "paginated"
  };

  let currentRecord = null;
  let epubBook = null;
  let rendition = null;
  let currentFormat = "";
  let locationsReady = false;
  let dragDepth = 0;
  let toastTimer = null;
  let plainProgressSyncBound = false;
  let pageTurnBusy = false;
  let resizeTimer = null;

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function bytes(value = 0) {
    const units = ["o", "Ko", "Mo", "Go"];
    let size = Number(value) || 0;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) { size /= 1024; index += 1; }
    return `${size < 10 && index ? size.toFixed(1) : Math.round(size)} ${units[index]}`;
  }

  function showToast(message, delay = 2600) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, delay);
  }

  function positionKey(id) { return `philosophal.reader.position.${id}`; }
  function plainScrollKey(id) { return `philosophal.reader.scroll.${id}`; }
  function settingsKey() { return "philosophal.reader.settings"; }

  function loadSettings() {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(settingsKey()) || "{}") };
    } catch (_) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(next) {
    try { localStorage.setItem(settingsKey(), JSON.stringify(next)); } catch (_) {}
  }

  let readerSettings = loadSettings();

  function syncSettingsControls() {
    settingsInputs.fontSize.value = readerSettings.fontSize;
    settingsInputs.lineHeight.value = readerSettings.lineHeight;
    settingsInputs.fontFamily.value = readerSettings.fontFamily;
    settingsInputs.theme.value = readerSettings.theme;
    settingsInputs.flow.value = readerSettings.flow;
    document.body.dataset.theme = readerSettings.theme;
  }

  function themeRules(theme) {
    if (theme === "night") return { body: { color: "#e6e0d7 !important", background: "#1f211f !important" }, a: { color: "#d7b487 !important" } };
    if (theme === "white") return { body: { color: "#222 !important", background: "#fff !important" } };
    return { body: { color: "#2a2926 !important", background: "#fffdf9 !important" }, a: { color: "#795a39 !important" } };
  }

  function applyReadingSettings() {
    document.body.dataset.theme = readerSettings.theme;
    const family = readerSettings.fontFamily === "sans"
      ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      : 'Georgia, "Times New Roman", serif';

    // Important : ne pas rappeler rendition.flow() ici.
    // EPUB.js reconstruit alors sa mise en page et peut revenir à la position
    // précédente au moment même où l'utilisateur tourne une page. Les réglages
    // visuels (thème, police, taille, interligne) peuvent, eux, être appliqués
    // sans réinitialiser la navigation.
    if (rendition) {
      try {
        rendition.themes.register("philosophal-paper", themeRules("paper"));
        rendition.themes.register("philosophal-white", themeRules("white"));
        rendition.themes.register("philosophal-night", themeRules("night"));
        rendition.themes.select(`philosophal-${readerSettings.theme}`);
        rendition.themes.fontSize(`${readerSettings.fontSize}%`);
        rendition.themes.override("line-height", String(readerSettings.lineHeight), true);
        rendition.themes.override("font-family", family, true);
      } catch (_) {}
    }

    if (plain) {
      plain.style.fontSize = `${18 * (readerSettings.fontSize / 100)}px`;
      plain.style.lineHeight = String(readerSettings.lineHeight);
      plain.style.fontFamily = family;
      if (readerSettings.theme === "night") {
        plain.style.background = "#1f211f";
        plain.style.color = "#e6e0d7";
      } else if (readerSettings.theme === "white") {
        plain.style.background = "#fff";
        plain.style.color = "#222";
      } else {
        plain.style.background = "#fffdf9";
        plain.style.color = "#2a2926";
      }
    }
  }

  async function applyFlowSetting(nextFlow) {
    if (!rendition || currentFormat !== "epub") return;
    const targetFlow = nextFlow === "scrolled-doc" ? "scrolled-doc" : "paginated";
    const currentCfi = rendition.currentLocation()?.start?.cfi || null;
    try {
      pageTurnBusy = true;
      rendition.flow(targetFlow);
      if (typeof rendition.spread === "function") rendition.spread("none");
      if (currentCfi) await rendition.display(currentCfi);
    } catch (error) {
      console.warn("Impossible de changer le mode de lecture", error);
    } finally {
      pageTurnBusy = false;
    }
  }

  function setLoading(value, message = "Ouverture du livre…") {
    if (!loading) return;
    loading.hidden = !value;
    const strong = $("strong", loading);
    if (strong) strong.textContent = message;
  }

  function openDrawer(drawer) {
    closeDrawers();
    drawer.hidden = false;
    document.body.classList.add("reader-drawer-open");
  }

  function closeDrawers() {
    [libraryDrawer, tocDrawer].forEach((item) => { if (item) item.hidden = true; });
    document.body.classList.remove("reader-drawer-open");
  }

  function setSettingsOpen(open) {
    settingsPanel.hidden = !open;
    settingsToggle?.setAttribute("aria-expanded", String(open));
  }

  function formatLabel(format) {
    return ({ epub: "EPUB", txt: "TXT", html: "HTML", md: "Markdown", fb2: "FB2" })[format] || String(format || "Livre").toUpperCase();
  }

  function bookCard(book) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reader-book-card";
    button.dataset.bookId = book.id;
    button.innerHTML = `
      <span class="reader-book-card-format">${esc(formatLabel(book.format))}</span>
      <span class="reader-book-card-copy">
        <strong>${esc(book.title || Books.titleFromName(book.name))}</strong>
        <small>${esc(book.author || book.name || "")}</small>
      </span>`;
    button.addEventListener("click", () => openBook(book.id));
    return button;
  }

  async function refreshLibrary() {
    const items = await Books.listBooks().catch(() => []);
    if (recentBooks) {
      recentBooks.innerHTML = "";
      items.slice(0, 4).forEach((book) => recentBooks.appendChild(bookCard(book)));
      recentEmpty.hidden = items.length > 0;
    }

    if (libraryList) {
      libraryList.innerHTML = "";
      items.forEach((book) => {
        const row = document.createElement("div");
        row.className = "reader-library-row";
        row.innerHTML = `
          <button type="button" class="reader-library-open">
            <strong>${esc(book.title || Books.titleFromName(book.name))}</strong>
            <small>${esc(book.author ? `${book.author} · ${formatLabel(book.format)} · ${bytes(book.size)}` : `${formatLabel(book.format)} · ${bytes(book.size)}`)}</small>
          </button>
          <button type="button" class="reader-library-delete" aria-label="Supprimer ${esc(book.title || book.name)}">×</button>`;
        $(".reader-library-open", row).addEventListener("click", () => { closeDrawers(); openBook(book.id); });
        $(".reader-library-delete", row).addEventListener("click", async () => {
          if (!confirm(`Retirer « ${book.title || book.name} » de la bibliothèque locale ?`)) return;
          await Books.deleteBook(book.id);
          if (currentRecord?.id === book.id) closeCurrentBook();
          await refreshLibrary();
          showToast("Livre retiré de la bibliothèque locale.");
        });
        libraryList.appendChild(row);
      });
      libraryEmpty.hidden = items.length > 0;
    }

    const estimate = await Books.storageEstimate();
    if (storageInfo && estimate?.quota) {
      storageInfo.textContent = `${bytes(estimate.usage || 0)} utilisés sur environ ${bytes(estimate.quota)} disponibles pour ce site.`;
    } else if (storageInfo) {
      storageInfo.textContent = "Les livres sont conservés localement dans ce navigateur.";
    }
  }

  function closeCurrentBook() {
    try { rendition?.destroy(); } catch (_) {}
    try { epubBook?.destroy(); } catch (_) {}
    rendition = null;
    epubBook = null;
    currentRecord = null;
    currentFormat = "";
    locationsReady = false;
    render.innerHTML = "";
    plain.innerHTML = "";
    plain.hidden = true;
    render.hidden = false;
    workspace.hidden = true;
    welcome.hidden = false;
    headTitle.textContent = "Lecteur";
    headAuthor.textContent = "Bibliothèque locale";
    progress.value = 0;
    progressLabel.textContent = "0 %";
    history.replaceState({}, "", location.pathname);
  }

  async function importFile(file) {
    if (!Books.isSupported(file)) {
      showToast("Format non pris en charge : EPUB, TXT, HTML, Markdown ou FB2.", 3600);
      return;
    }
    try {
      setLoading(true, "Import du livre…");
      const record = await Books.saveFile(file);
      await refreshLibrary();
      await openBook(record.id, true);
    } catch (error) {
      setLoading(false);
      showToast(error?.message || "Impossible d’importer ce fichier.", 3600);
    }
  }

  async function openBook(id, fresh = false) {
    const record = await Books.getBook(id).catch(() => null);
    if (!record) {
      showToast("Ce livre n’est plus disponible dans ce navigateur.");
      return;
    }

    closeDrawers();
    setSettingsOpen(false);
    welcome.hidden = true;
    workspace.hidden = false;
    setLoading(true);
    currentRecord = record;
    currentFormat = record.format;
    headTitle.textContent = record.title || Books.titleFromName(record.name);
    headAuthor.textContent = record.author || formatLabel(record.format);

    try {
      if (record.format === "epub") await openEpub(record, fresh);
      else await openPlain(record, fresh);
      await Books.updateBook(record.id, { lastOpenedAt: Date.now() });
      await refreshLibrary();
      const url = new URL(location.href);
      url.searchParams.set("book", record.id);
      url.searchParams.delete("fresh");
      history.replaceState({}, "", `${url.pathname}${url.search}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("Impossible d’ouvrir ce livre. Le fichier est peut-être endommagé ou protégé.", 4600);
      closeCurrentBook();
    }
  }

  async function openEpub(record, fresh) {
    if (typeof window.ePub !== "function") {
      throw new Error("Le moteur EPUB n’a pas pu être chargé. Vérifiez la connexion internet et rechargez la page.");
    }

    try { rendition?.destroy(); } catch (_) {}
    try { epubBook?.destroy(); } catch (_) {}
    render.innerHTML = "";
    render.hidden = false;
    plain.hidden = true;
    locationsReady = false;

    const buffer = await record.blob.arrayBuffer();
    epubBook = window.ePub(buffer);
    const metadata = await epubBook.loaded.metadata;
    const navigationPromise = epubBook.loaded.navigation;

    const patch = {
      title: metadata?.title || record.title || Books.titleFromName(record.name),
      author: metadata?.creator || record.author || "",
      language: metadata?.language || record.language || "",
      metadataReady: true
    };
    currentRecord = await Books.updateBook(record.id, patch) || { ...record, ...patch };
    headTitle.textContent = currentRecord.title;
    headAuthor.textContent = currentRecord.author || "EPUB";

    rendition = epubBook.renderTo(render, {
      width: "100%",
      height: "100%",
      manager: "default",
      flow: readerSettings.flow === "scrolled-doc" ? "scrolled-doc" : "paginated",
      // Une seule page/colonne à la fois : beaucoup plus stable pour un lecteur
      // personnel, notamment sur les EPUB dont le CSS éditorial force des largeurs.
      spread: "none",
      allowScriptedContent: false
    });

    rendition.on("relocated", (location) => {
      const cfi = location?.start?.cfi;
      if (cfi) {
        try { localStorage.setItem(positionKey(record.id), cfi); } catch (_) {}
      }
      updateEpubProgress(cfi, location);
    });

    // Les thèmes EPUB.js restent actifs lors du passage d'une section à l'autre :
    // les réappliquer à chaque évènement "rendered" provoquait un reflow et
    // pouvait annuler le changement de page.
    applyReadingSettings();

    const saved = !fresh ? localStorage.getItem(positionKey(record.id)) : null;
    await rendition.display(saved || undefined);
    setLoading(false);

    buildToc(await navigationPromise);

    epubBook.locations.generate(1200).then(() => {
      locationsReady = true;
      try {
        const cfi = rendition.currentLocation()?.start?.cfi;
        updateEpubProgress(cfi, rendition.currentLocation());
      } catch (_) {}
    }).catch(() => { locationsReady = false; });
  }

  function updateEpubProgress(cfi, location) {
    let ratio = null;
    if (locationsReady && cfi && epubBook?.locations?.length()) {
      try { ratio = epubBook.locations.percentageFromCfi(cfi); } catch (_) {}
    }
    if (ratio == null && location?.start?.percentage != null) ratio = location.start.percentage;
    if (ratio == null) return;
    const bounded = Math.max(0, Math.min(1, Number(ratio) || 0));
    progress.value = Math.round(bounded * 1000);
    progressLabel.textContent = `${Math.round(bounded * 100)} %`;
  }

  function buildToc(navigation) {
    toc.innerHTML = "";
    const items = navigation?.toc || [];
    const flat = [];
    const walk = (nodes, depth = 0) => {
      (nodes || []).forEach((item) => {
        flat.push({ ...item, depth });
        if (item.subitems?.length) walk(item.subitems, depth + 1);
      });
    };
    walk(items);
    flat.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `depth-${Math.min(3, item.depth || 0)}`;
      button.textContent = item.label || "Section";
      button.addEventListener("click", async () => {
        closeDrawers();
        if (rendition) await rendition.display(item.href);
      });
      toc.appendChild(button);
    });
    tocEmpty.hidden = flat.length > 0;
  }

  async function openPlain(record, fresh) {
    render.hidden = true;
    plain.hidden = false;
    plain.innerHTML = "";
    toc.innerHTML = "";
    tocEmpty.hidden = false;
    const text = await record.blob.text();
    let html = "";

    if (record.format === "html") html = sanitizeHtml(text);
    else if (record.format === "md") html = markdownToHtml(text);
    else if (record.format === "fb2") html = fb2ToHtml(text);
    else html = `<pre>${esc(text)}</pre>`;

    plain.innerHTML = html;
    applyReadingSettings();
    if (!fresh) {
      const y = Number(localStorage.getItem(plainScrollKey(record.id)) || 0);
      requestAnimationFrame(() => { plain.scrollTop = Math.max(0, y); syncPlainProgress(); });
    } else {
      plain.scrollTop = 0;
      syncPlainProgress();
    }
    if (!plainProgressSyncBound) {
      plain.addEventListener("scroll", syncPlainProgress, { passive: true });
      plainProgressSyncBound = true;
    }
    setLoading(false);
  }

  function syncPlainProgress() {
    if (!currentRecord || currentFormat === "epub" || plain.hidden) return;
    const max = Math.max(1, plain.scrollHeight - plain.clientHeight);
    const ratio = Math.max(0, Math.min(1, plain.scrollTop / max));
    progress.value = Math.round(ratio * 1000);
    progressLabel.textContent = `${Math.round(ratio * 100)} %`;
    try { localStorage.setItem(plainScrollKey(currentRecord.id), String(Math.round(plain.scrollTop))); } catch (_) {}
  }

  function sanitizeHtml(source) {
    const doc = new DOMParser().parseFromString(source, "text/html");
    doc.querySelectorAll("script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,select").forEach((node) => node.remove());
    doc.querySelectorAll("*").forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        if (name.startsWith("on") || ((name === "href" || name === "src") && value.startsWith("javascript:"))) node.removeAttribute(attr.name);
        if (name === "style" && /url\s*\(|expression\s*\(/i.test(attr.value)) node.removeAttribute("style");
      });
    });
    return doc.body?.innerHTML || `<pre>${esc(source)}</pre>`;
  }

  function markdownToHtml(source) {
    const safe = esc(source).replace(/\r\n?/g, "\n");
    const blocks = safe.split(/\n{2,}/).map((block) => {
      const value = block.trim();
      if (!value) return "";
      if (/^###\s/.test(value)) return `<h3>${inlineMd(value.replace(/^###\s+/, ""))}</h3>`;
      if (/^##\s/.test(value)) return `<h2>${inlineMd(value.replace(/^##\s+/, ""))}</h2>`;
      if (/^#\s/.test(value)) return `<h1>${inlineMd(value.replace(/^#\s+/, ""))}</h1>`;
      if (/^(?:[-*]\s.+\n?)+$/.test(value)) {
        return `<ul>${value.split("\n").map((line) => `<li>${inlineMd(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (/^&gt;\s/.test(value)) return `<blockquote>${inlineMd(value.replace(/^&gt;\s?/gm, "").replace(/\n/g, "<br>"))}</blockquote>`;
      return `<p>${inlineMd(value).replace(/\n/g, "<br>")}</p>`;
    });
    return blocks.join("");
  }

  function inlineMd(value) {
    return value
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function fb2ToHtml(source) {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    if (doc.querySelector("parsererror")) return `<pre>${esc(source)}</pre>`;
    const body = doc.querySelector("body");
    if (!body) return `<pre>${esc(source)}</pre>`;
    const convert = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return esc(node.nodeValue || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const tag = node.localName?.toLowerCase();
      const inner = [...node.childNodes].map(convert).join("");
      if (tag === "title") return `<h2>${inner}</h2>`;
      if (tag === "subtitle") return `<h3>${inner}</h3>`;
      if (tag === "p") return `<p>${inner}</p>`;
      if (tag === "emphasis") return `<em>${inner}</em>`;
      if (tag === "strong") return `<strong>${inner}</strong>`;
      if (tag === "epigraph" || tag === "cite") return `<blockquote>${inner}</blockquote>`;
      if (tag === "empty-line") return "<br>";
      return inner;
    };
    return convert(body);
  }

  async function turnEpub(direction) {
    if (!rendition || pageTurnBusy) return;
    pageTurnBusy = true;
    const before = rendition.currentLocation?.()?.start?.cfi || null;
    try {
      if (direction === "prev") await rendition.prev();
      else await rendition.next();

      // Laisser EPUB.js terminer la translation de colonnes avant un éventuel
      // contrôle de secours. Cela évite les doubles clics qui se superposent.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const after = rendition.currentLocation?.()?.start?.cfi || null;
      if (before && after === before && locationsReady && epubBook?.locations?.length()) {
        try {
          const index = epubBook.locations.locationFromCfi(before);
          const step = direction === "prev" ? -1 : 1;
          const targetIndex = Math.max(0, Math.min(epubBook.locations.length() - 1, index + step));
          const target = epubBook.locations.cfiFromLocation(targetIndex);
          if (target && target !== before) await rendition.display(target);
        } catch (_) {}
      }
    } catch (error) {
      console.warn("Navigation EPUB impossible", error);
    } finally {
      pageTurnBusy = false;
    }
  }

  async function previous() {
    if (!currentRecord) return;
    if (currentFormat === "epub" && rendition) await turnEpub("prev");
    else plain.scrollBy({ top: -Math.max(240, plain.clientHeight * .82), behavior: "smooth" });
  }

  async function next() {
    if (!currentRecord) return;
    if (currentFormat === "epub" && rendition) await turnEpub("next");
    else plain.scrollBy({ top: Math.max(240, plain.clientHeight * .82), behavior: "smooth" });
  }

  async function seek(value) {
    if (!currentRecord) return;
    const ratio = Math.max(0, Math.min(1, Number(value) / 1000));
    if (currentFormat === "epub" && rendition && locationsReady) {
      const cfi = epubBook.locations.cfiFromPercentage(ratio);
      if (cfi) await rendition.display(cfi);
    } else if (!plain.hidden) {
      const max = Math.max(0, plain.scrollHeight - plain.clientHeight);
      plain.scrollTop = max * ratio;
    }
  }

  function wireImportButtons() {
    $$('[data-import-book]').forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        fileInput.value = "";
        fileInput.click();
      });
    });
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) importFile(file);
    });
  }

  function wireDragAndDrop() {
    const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes("Files");
    window.addEventListener("dragenter", (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth += 1;
      globalDrop.hidden = false;
    });
    window.addEventListener("dragover", (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
    window.addEventListener("dragleave", (event) => {
      if (!hasFiles(event)) return;
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) globalDrop.hidden = true;
    });
    window.addEventListener("drop", (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth = 0;
      globalDrop.hidden = true;
      const file = Array.from(event.dataTransfer?.files || []).find((candidate) => Books.isSupported(candidate));
      if (file) importFile(file);
      else showToast("Format non pris en charge : EPUB, TXT, HTML, Markdown ou FB2.");
    });
  }

  function applyFocusMode(active) {
    const enabled = Boolean(active);
    document.body.classList.toggle("reader-focus", enabled);
    focusButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(enabled));
      if (button.classList.contains("reader-focus-exit")) button.hidden = !enabled;
    });
    try { window.localStorage.setItem("fvReaderFocus", enabled ? "1" : "0"); } catch (_) {}
  }

  function wireUi() {
    $("[data-prev]")?.addEventListener("click", previous);
    $("[data-next]")?.addEventListener("click", next);
    progress?.addEventListener("change", () => seek(progress.value));
    progress?.addEventListener("input", () => { progressLabel.textContent = `${Math.round(Number(progress.value) / 10)} %`; });
    $$('[data-open-library]').forEach((button) => button.addEventListener("click", async () => { await refreshLibrary(); openDrawer(libraryDrawer); }));
    $("[data-open-toc]")?.addEventListener("click", () => openDrawer(tocDrawer));
    $$('[data-close-drawers]').forEach((button) => button.addEventListener("click", closeDrawers));
    settingsToggle?.addEventListener("click", () => setSettingsOpen(settingsPanel.hidden));
    focusButtons.forEach((button) => button.addEventListener("click", () => applyFocusMode(!document.body.classList.contains("reader-focus"))));
    $("[data-fullscreen]")?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) { showToast("Le plein écran n’est pas disponible ici."); }
    });

    Object.entries(settingsInputs).forEach(([key, input]) => {
      const eventName = input?.tagName === "INPUT" ? "input" : "change";
      input?.addEventListener(eventName, async () => {
        const value = key === "fontSize" || key === "lineHeight" ? Number(input.value) : input.value;
        readerSettings = { ...readerSettings, [key]: value };
        saveSettings(readerSettings);
        if (key === "flow") await applyFlowSetting(value);
        else applyReadingSettings();
      });
    });

    document.addEventListener("click", (event) => {
      if (!settingsPanel.hidden && !settingsPanel.contains(event.target) && !settingsToggle.contains(event.target)) setSettingsOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); next(); }
      if (event.key === "Escape") { closeDrawers(); setSettingsOpen(false); if (document.body.classList.contains("reader-focus")) applyFocusMode(false); }
    });

    let touchX = null;
    const stage = $("[data-stage]");
    stage?.addEventListener("touchstart", (event) => { touchX = event.touches?.[0]?.clientX ?? null; }, { passive: true });
    stage?.addEventListener("touchend", (event) => {
      if (touchX == null) return;
      const end = event.changedTouches?.[0]?.clientX ?? touchX;
      const delta = end - touchX;
      touchX = null;
      if (Math.abs(delta) < 55) return;
      if (delta > 0) previous(); else next();
    }, { passive: true });

    // Recalculer la pagination sans perdre le passage courant lorsque la fenêtre
    // change réellement de taille (rotation, redimensionnement, barre mobile).
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => {
        if (!rendition || currentFormat !== "epub" || pageTurnBusy) return;
        const cfi = rendition.currentLocation?.()?.start?.cfi || null;
        try {
          pageTurnBusy = true;
          const width = Math.max(320, render.clientWidth);
          const height = Math.max(320, render.clientHeight);
          rendition.resize(width, height);
          if (cfi) await rendition.display(cfi);
        } catch (_) {} finally {
          pageTurnBusy = false;
        }
      }, 180);
    }, { passive: true });
  }

  async function init() {
    syncSettingsControls();
    applyReadingSettings();
    wireImportButtons();
    wireDragAndDrop();
    wireUi();
    await refreshLibrary();

    const params = new URLSearchParams(location.search);
    const focusParam = params.get("focus");
    let storedFocus = false;
    try { storedFocus = window.localStorage.getItem("fvReaderFocus") === "1"; } catch (_) {}
    applyFocusMode(focusParam === "1" || (focusParam !== "0" && storedFocus));
    const bookId = params.get("book");
    if (bookId) await openBook(bookId, params.get("fresh") === "1");
  }

  init().catch((error) => {
    console.error(error);
    showToast("Le lecteur n’a pas pu s’initialiser.", 4000);
  });
})();

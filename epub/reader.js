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
  const pagesDrawer = $("[data-pages-drawer]");
  const pageThumbs = $("[data-page-thumbs]");
  const pagesSummary = $("[data-pages-summary]");
  const pagesEmpty = $("[data-pages-empty]");
  const thumbSizeInput = $("[data-thumb-size]");
  const goPageInput = $("[data-go-page]");
  const spreadLocker = $("[data-spread-locker]");
  const spreadSelectionLabel = $("[data-spread-selection]");
  const spreadLockList = $("[data-spread-lock-list]");
  const lockSpreadButton = $("[data-lock-spread]");
  const unlockSpreadButton = $("[data-unlock-spread]");
  const clearSpreadLocksButton = $("[data-clear-spread-locks]");
  const searchDrawer = $("[data-search-drawer]");
  const bookSearchInput = $("[data-book-search]");
  const searchStatus = $("[data-search-status]");
  const searchResults = $("[data-search-results]");
  const bookmarksDrawer = $("[data-bookmarks-drawer]");
  const bookmarksList = $("[data-bookmarks-list]");
  const bookmarksEmpty = $("[data-bookmarks-empty]");
  const notesDrawer = $("[data-notes-drawer]");
  const notesList = $("[data-notes-list]");
  const notesEmpty = $("[data-notes-empty]");
  const shortcutsDrawer = $("[data-shortcuts-drawer]");
  const currentPosition = $("[data-current-position]");
  const readingMeta = $("[data-reading-meta]");
  const selectionTools = $("[data-selection-tools]");
  const historyBackButton = $("[data-history-back]");
  const historyForwardButton = $("[data-history-forward]");
  const settingsPanel = $("[data-settings]");
  const settingsToggle = $("[data-toggle-settings]");
  const globalDrop = $("[data-global-drop]");
  const toast = $("[data-toast]");
  const focusButtons = $$("[data-focus-reader]");
  const zoomLabel = $("[data-zoom-label]");
  const zoomButtons = {
    out: $("[data-zoom-out]"),
    in: $("[data-zoom-in]")
  };

  const settingsInputs = {
    zoom: $("[data-zoom]"),
    fontSize: $("[data-font-size]"),
    lineHeight: $("[data-line-height]"),
    fontFamily: $("[data-font-family]"),
    theme: $("[data-theme]"),
    brightness: $("[data-brightness]"),
    textWidth: $("[data-text-width]"),
    pageMargin: $("[data-page-margin]"),
    paragraphSpace: $("[data-paragraph-space]"),
    textAlign: $("[data-text-align]"),
    flow: $("[data-flow]"),
    pageView: $("[data-page-view]"),
    comicDirection: $("[data-comic-direction]")
  };

  const DEFAULT_SETTINGS = {
    zoom: 100,
    fontSize: 100,
    lineHeight: 1.6,
    fontFamily: "serif",
    theme: "paper",
    brightness: 100,
    textWidth: "normal",
    pageMargin: 24,
    paragraphSpace: 0.8,
    textAlign: "left",
    flow: "paginated",
    pageView: "auto",
    comicDirection: "ltr",
    settingsVersion: 2
  };

  const FOLIATE_FORMATS = new Set(["azw", "azw3", "mobi", "cbz"]);
  const KINDLE_FORMATS = new Set(["azw", "azw3", "mobi"]);
  const FOLIATE_MODULE_URL = "/epub/vendor/foliate/view.js?v=20261005-v32";

  function isFoliateFormat(format) {
    return FOLIATE_FORMATS.has(String(format || "").toLowerCase());
  }

  function isFoliateActive() {
    return !!foliateView && (isFoliateFormat(currentFormat) || epubFoliateMode);
  }

  async function getFoliateModule() {
    if (!foliateModulePromise) {
      foliateModulePromise = import(FOLIATE_MODULE_URL);
    }
    return foliateModulePromise;
  }

  let currentRecord = null;
  let epubBook = null;
  let rendition = null;
  let foliateView = null;
  let foliateBook = null;
  let foliateModulePromise = null;
  let currentFormat = "";
  let locationsReady = false;
  let dragDepth = 0;
  let toastTimer = null;
  let plainProgressSyncBound = false;
  let pageTurnBusy = false;
  let resizeTimer = null;
  let pageModels = [];
  let pageModelsBookId = "";
  let searchRunId = 0;
  let currentChapterLabel = "";
  let currentRatio = 0;
  let navigationHistory = [];
  let navigationHistoryIndex = -1;
  let suppressHistoryPush = false;
  let lastSelection = null;
  let sessionStartedAt = 0;
  let sessionProgressStart = 0;
  let sessionTimer = null;
  let readerUiHidden = false;
  let comicThumbObserver = null;
  let epubFixedLayout = false;
  let epubFoliateMode = false;
  let fixedPageThumbUrls = [];
  let visualPageThumbUrls = [];
  let comicInfo = null;
  let visualReaderActive = false;
  let visualPages = [];
  let visualSpreads = [];
  let visualSpreadIndex = 0;
  let visualDisplayUrls = [];
  let visualThumbUrls = new Map();
  let visualSpreadRoot = null;
  let spreadPairSelection = new Set();
  let bookGeneration = 0;
  let visualRenderRun = 0;
  let paginationRun = 0;
  let pageModelsPromise = null;
  let visualTurnQueue = Promise.resolve();
  const quickPageView = $("[data-page-view-quick]");
  const spreadStartInput = $("[data-spread-start]");

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
  function readerDataKey(id) { return `philosophal.reader.data.${id}`; }
  function progressKey(id) { return `philosophal.reader.progress.${id}`; }

  function loadReaderData(id) {
    if (!id) return { bookmarks: [], notes: [], spreadPairs: [] };
    try {
      const raw = JSON.parse(localStorage.getItem(readerDataKey(id)) || "{}");
      return {
        ...raw,
        bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks : [],
        notes: Array.isArray(raw.notes) ? raw.notes : [],
        spreadPairs: Array.isArray(raw.spreadPairs) ? raw.spreadPairs : []
      };
    } catch (_) {
      return { bookmarks: [], notes: [], spreadPairs: [] };
    }
  }

  function saveReaderData(id, data) {
    if (!id) return;
    try { localStorage.setItem(readerDataKey(id), JSON.stringify(data)); } catch (_) {}
  }

  function saveSimpleProgress(id, ratio) {
    if (!id || !Number.isFinite(ratio)) return;
    try { localStorage.setItem(progressKey(id), String(Math.max(0, Math.min(1, ratio)))); } catch (_) {}
  }

  function loadSimpleProgress(id) {
    try { return Math.max(0, Math.min(1, Number(localStorage.getItem(progressKey(id)) || 0))); }
    catch (_) { return 0; }
  }

  function loadSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(settingsKey()) || "{}");
      const next = { ...DEFAULT_SETTINGS, ...stored };
      if (!stored.settingsVersion || Number(stored.settingsVersion) < 2) {
        next.pageView = "auto";
        next.comicDirection = stored.comicDirection || "ltr";
        next.settingsVersion = 2;
        try { localStorage.setItem(settingsKey(), JSON.stringify(next)); } catch (_) {}
      }
      return next;
    } catch (_) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(next) {
    try { localStorage.setItem(settingsKey(), JSON.stringify(next)); } catch (_) {}
  }

  let readerSettings = loadSettings();

  function syncSettingsControls() {
    if (settingsInputs.zoom) settingsInputs.zoom.value = readerSettings.zoom;
    if (zoomLabel) zoomLabel.textContent = `${readerSettings.zoom} %`;
    if (settingsInputs.fontSize) settingsInputs.fontSize.value = readerSettings.fontSize;
    if (settingsInputs.lineHeight) settingsInputs.lineHeight.value = readerSettings.lineHeight;
    if (settingsInputs.fontFamily) settingsInputs.fontFamily.value = readerSettings.fontFamily;
    if (settingsInputs.theme) settingsInputs.theme.value = readerSettings.theme;
    if (settingsInputs.brightness) settingsInputs.brightness.value = readerSettings.brightness;
    if (settingsInputs.textWidth) settingsInputs.textWidth.value = readerSettings.textWidth;
    if (settingsInputs.pageMargin) settingsInputs.pageMargin.value = readerSettings.pageMargin;
    if (settingsInputs.paragraphSpace) settingsInputs.paragraphSpace.value = readerSettings.paragraphSpace;
    if (settingsInputs.textAlign) settingsInputs.textAlign.value = readerSettings.textAlign;
    if (settingsInputs.flow) settingsInputs.flow.value = readerSettings.flow;
    if (settingsInputs.pageView) settingsInputs.pageView.value = readerSettings.pageView;
    if (quickPageView) quickPageView.value = readerSettings.pageView;
    if (spreadStartInput) spreadStartInput.value = currentReaderData().spreadStart === "first" ? "first" : "cover";
    if (settingsInputs.comicDirection) settingsInputs.comicDirection.value = readerSettings.comicDirection;
    const comic = currentFormat === "cbz";
    const fixedVisual = comic || epubFoliateMode || visualReaderActive;
    if (settingsInputs.fontSize) settingsInputs.fontSize.disabled = fixedVisual;
    if (settingsInputs.lineHeight) settingsInputs.lineHeight.disabled = fixedVisual;
    if (settingsInputs.fontFamily) settingsInputs.fontFamily.disabled = fixedVisual;
    if (settingsInputs.paragraphSpace) settingsInputs.paragraphSpace.disabled = fixedVisual;
    if (settingsInputs.textAlign) settingsInputs.textAlign.disabled = fixedVisual;
    if (settingsInputs.textWidth) settingsInputs.textWidth.disabled = fixedVisual;
    if (settingsInputs.flow) settingsInputs.flow.disabled = visualReaderActive || fixedVisual || (currentFormat && currentFormat !== "epub");
    if (settingsInputs.pageView) settingsInputs.pageView.disabled = !visualReaderActive && (fixedVisual || (currentFormat && currentFormat !== "epub"));
    if (settingsInputs.comicDirection) settingsInputs.comicDirection.disabled = !visualReaderActive && currentFormat !== "cbz";
    document.body.dataset.theme = readerSettings.theme;
  }

  function themeRules(theme) {
    if (theme === "night") return { body: { color: "#e6e0d7 !important", background: "#1f211f !important" }, a: { color: "#d7b487 !important" } };
    if (theme === "white") return { body: { color: "#222 !important", background: "#fff !important" }, a: { color: "#66507b !important" } };
    if (theme === "sepia") return { body: { color: "#3b3228 !important", background: "#f4ead8 !important" }, a: { color: "#8a5d32 !important" } };
    return { body: { color: "#2a2926 !important", background: "#fffdf9 !important" }, a: { color: "#795a39 !important" } };
  }

  function themePalette(theme) {
    if (theme === "night") return { bg: "#1f211f", fg: "#e6e0d7" };
    if (theme === "white") return { bg: "#ffffff", fg: "#222222" };
    if (theme === "sepia") return { bg: "#f4ead8", fg: "#3b3228" };
    return { bg: "#fffdf9", fg: "#2a2926" };
  }

  function textWidthValue() {
    return ({ narrow: "620px", normal: "760px", wide: "920px", full: "none" })[readerSettings.textWidth] || "760px";
  }

  function applyDocumentAdvancedSettings(doc, { paginated = false } = {}) {
    if (!doc?.documentElement || !doc?.body || currentFormat === "cbz" || epubFoliateMode) return;
    const styleId = "philosophal-reader-advanced";
    let style = doc.getElementById(styleId);
    if (!style) {
      style = doc.createElement("style");
      style.id = styleId;
      (doc.head || doc.documentElement).appendChild(style);
    }
    const margin = Math.max(0, Number(readerSettings.pageMargin) || 0);
    const paragraph = Math.max(0, Number(readerSettings.paragraphSpace) || 0);
    const maxWidth = textWidthValue();
    const align = readerSettings.textAlign === "justify" ? "justify" : "left";
    const scrolled = !paginated && readerSettings.flow === "scrolled-doc";
    const css = `
      html, body { box-sizing:border-box !important; }
      body {
        ${scrolled ? `${maxWidth !== "none" ? `max-width:${maxWidth} !important; margin-left:auto !important; margin-right:auto !important;` : ""}padding-left:${margin}px !important;padding-right:${margin}px !important;` : ""}
        text-align:${align} !important;
      }
      p { margin-bottom:${paragraph}em !important; }
      img, svg, video { max-width:100% !important; height:auto !important; }
      .philosophal-reader-highlight { background:#eadb79 !important; color:inherit !important; border-radius:.15em; }
    `;
    if (style.textContent !== css) style.textContent = css;
  }

  function applyFoliateDocumentSettings(doc) {
    if (!doc || currentFormat === "cbz" || epubFoliateMode) return;
    const family = readerSettings.fontFamily === "sans"
      ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      : 'Georgia, "Times New Roman", serif';
    const body = doc.body;
    const root = doc.documentElement;
    if (!body || !root) return;
    root.style.fontSize = `${readerSettings.fontSize}%`;
    body.style.lineHeight = String(readerSettings.lineHeight);
    body.style.fontFamily = family;
    const palette = themePalette(readerSettings.theme);
    root.style.background = palette.bg;
    body.style.background = palette.bg;
    body.style.color = palette.fg;
    applyDocumentAdvancedSettings(doc);
    restoreExcerptHighlights(doc);
  }

  function scaleElementToViewport(element, factor) {
    if (!element) return;
    const safe = Math.max(.7, Math.min(2.2, Number(factor) || 1));
    element.style.transformOrigin = "0 0";
    element.style.transform = safe === 1 ? "" : `scale(${safe})`;
    element.style.width = safe === 1 ? "" : `${100 / safe}%`;
    element.style.height = safe === 1 ? "" : `${100 / safe}%`;
  }

  function applyVisualZoom() {
    const factor = Math.max(.7, Math.min(2.2, Number(readerSettings.zoom) / 100 || 1));
    if (zoomLabel) zoomLabel.textContent = `${Math.round(factor * 100)} %`;
    document.body.style.setProperty("--reader-zoom", String(factor));

    if (visualReaderActive && visualSpreadRoot) {
      const canvas = visualSpreadRoot.querySelector("[data-visual-spread-canvas]");
      if (canvas) {
        const spread = visualSpreads[visualSpreadIndex] || [];
        const sizes = spread.map(index => visualPages[index]?.size || { width: 800, height: 1200 });
        const contentHeight = Math.max(1, ...sizes.map(size => size.height || 1200));
        const widths = sizes.map(size => contentHeight * (size.width || 800) / (size.height || 1200));
        const contentWidth = widths.reduce((sum, width) => sum + width, 0) || 800;
        const style = getComputedStyle(visualSpreadRoot);
        const availableWidth = Math.max(1, visualSpreadRoot.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
        const availableHeight = Math.max(1, visualSpreadRoot.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
        const fit = Math.min(availableWidth / contentWidth, availableHeight / contentHeight) * factor;
        canvas.style.transform = "";
        canvas.style.width = `${Math.max(1, contentWidth * fit)}px`;
        canvas.style.height = `${Math.max(1, contentHeight * fit)}px`;
        canvas.querySelectorAll(".reader-visual-page").forEach(figure => {
          const page = visualPages[Number(figure.dataset.pageIndex)];
          const size = page?.size || { width: 800, height: 1200 };
          figure.style.width = `${contentHeight * size.width / size.height * fit}px`;
          const frame = figure.querySelector("iframe");
          if (frame) {
            frame.style.width = `${size.width}px`;
            frame.style.height = `${size.height}px`;
            frame.style.transform = `scale(${contentHeight / size.height * fit})`;
          }
        });
      }
      render.classList.toggle("is-visual-zoomed", factor !== 1);
    }

    // EPUB.js: magnifie réellement la vue (pas seulement la taille de police).
    // Pour un EPUB de texte, le zoom recalcule les colonnes. Transformer un
    // iframe déjà paginé tronquait les lignes et désynchronisait les pages.

    // Foliate (AZW/AZW3/MOBI/CBZ): zoom du composant complet.
    if (foliateView) {
      scaleElementToViewport(foliateView, factor);
      render.classList.toggle("is-comic", currentFormat === "cbz");
    }

    // Formats texte/HTML/Markdown/FB2.
    if (plain) {
      plain.style.zoom = String(factor);
      plain.style.width = factor === 1 ? "" : `${100 / factor}%`;
    }

    render?.classList.toggle("is-zoomed", factor !== 1);
  }

  function applyReadingSettings() {
    document.body.dataset.theme = readerSettings.theme;
    const family = readerSettings.fontFamily === "sans"
      ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      : 'Georgia, "Times New Roman", serif';
    const palette = themePalette(readerSettings.theme);
    if (rendition && !epubFixedLayout) {
      render.classList.add("is-text-epub");
      const baseWidth = ({ narrow: 620, normal: 760, wide: 920 })[readerSettings.textWidth];
      const double = readerSettings.pageView === "double" || (readerSettings.pageView === "auto" && window.innerWidth >= 1000);
      render.style.setProperty("--epub-reading-width", baseWidth ? `${baseWidth * (double ? 2 : 1)}px` : "100%");
    }

    if (rendition) {
      try {
        ["paper","white","night","sepia"].forEach((name) => rendition.themes.register(`philosophal-${name}`, themeRules(name)));
        rendition.themes.select(`philosophal-${readerSettings.theme}`);
        rendition.themes.fontSize(`${readerSettings.fontSize * readerSettings.zoom / 100}%`);
        rendition.themes.override("line-height", String(readerSettings.lineHeight), true);
        rendition.themes.override("font-family", family, true);
        rendition.getContents?.().forEach((contents) => {
          const doc = contents?.document || contents?.doc;
          applyDocumentAdvancedSettings(doc);
          attachSelectionHandlers(doc, contents);
        });
      } catch (_) {}
    }

    try {
      foliateView?.renderer?.getContents?.().forEach(({ doc }) => {
        applyFoliateDocumentSettings(doc);
        attachSelectionHandlers(doc, null);
      });
    } catch (_) {}

    render.style.filter = `brightness(${Math.max(.7, Math.min(1.25, Number(readerSettings.brightness) / 100 || 1))})`;
    plain.style.filter = render.style.filter;
    applyVisualZoom();

    if (plain) {
      plain.style.fontSize = `${18 * (readerSettings.fontSize / 100)}px`;
      plain.style.lineHeight = String(readerSettings.lineHeight);
      plain.style.fontFamily = family;
      plain.style.background = palette.bg;
      plain.style.color = palette.fg;
      plain.style.textAlign = readerSettings.textAlign === "justify" ? "justify" : "left";
      plain.style.setProperty("--reader-paragraph-space", `${readerSettings.paragraphSpace}em`);
      plain.style.setProperty("--reader-text-max", textWidthValue());
      plain.style.paddingLeft = `${readerSettings.pageMargin}px`;
      plain.style.paddingRight = `${readerSettings.pageMargin}px`;
    }
  }

  async function applyFlowSetting(nextFlow) {
    if (!rendition || currentFormat !== "epub") return;
    const targetFlow = nextFlow === "scrolled-doc" ? "scrolled-doc" : "paginated";
    const currentCfi = rendition.currentLocation()?.start?.cfi || null;
    try {
      pageTurnBusy = true;
      rendition.flow(targetFlow);
      if (typeof rendition.spread === "function") {
        const spreadMode = epubSpreadMode();
        rendition.spread(targetFlow === "paginated" ? spreadMode.spread : "none", spreadMode.min);
      }
      if (currentCfi) await rendition.display(currentCfi);
    } catch (error) {
      console.warn("Impossible de changer le mode de lecture", error);
    } finally {
      pageTurnBusy = false;
    }
  }

  async function applyPageViewSetting(mode) {
    if (!rendition || currentFormat !== "epub") return;
    const currentCfi = rendition.currentLocation?.()?.start?.cfi || null;
    try {
      pageTurnBusy = true;
      const spreadMode = epubSpreadMode();
      rendition.spread(spreadMode.spread, spreadMode.min);
      if (currentCfi) await rendition.display(currentCfi);
    } catch (error) {
      console.warn("Impossible de modifier l’affichage en double page", error);
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

  let drawerOrigin=null;
  function openDrawer(drawer) {
    const origin=document.activeElement;closeDrawers(false);drawerOrigin=origin;
    drawer.hidden=false;document.body.classList.add("reader-drawer-open");
    requestAnimationFrame(()=>{const panel=drawer.querySelector('.reader-drawer-panel');(panel?.querySelector('input:not([type="file"]),button')||panel)?.focus({preventScroll:true});});
  }
  function closeDrawers(restoreFocus=true) {
    const drawers=[libraryDrawer,tocDrawer,pagesDrawer,searchDrawer,bookmarksDrawer,notesDrawer,shortcutsDrawer],wasOpen=drawers.some(item=>item&&!item.hidden);
    drawers.forEach(item=>{if(item)item.hidden=true;});document.body.classList.remove("reader-drawer-open");
    if(restoreFocus&&wasOpen&&drawerOrigin?.isConnected&&drawerOrigin.getClientRects().length)drawerOrigin.focus({preventScroll:true});
  }
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;const drawer=[libraryDrawer,tocDrawer,pagesDrawer,searchDrawer,bookmarksDrawer,notesDrawer,shortcutsDrawer].find(item=>item&&!item.hidden);if(!drawer)return;
    const controls=[...drawer.querySelectorAll('.reader-drawer-panel button,.reader-drawer-panel input,.reader-drawer-panel select,.reader-drawer-panel textarea,.reader-drawer-panel a[href]')].filter(el=>!el.disabled&&el.getClientRects().length),first=controls[0],last=controls.at(-1);if(!first)return;
    if(event.shiftKey&&(document.activeElement===first||!drawer.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!drawer.contains(document.activeElement))){event.preventDefault();first.focus();}
  },true);

  function setSettingsOpen(open) {
    settingsPanel.hidden = !open;
    settingsToggle?.setAttribute("aria-expanded", String(open));
  }

  function formatLabel(format) {
    return ({ epub: "EPUB", azw: "AZW", azw3: "AZW3", mobi: "MOBI", cbz: "CBZ", txt: "TXT", html: "HTML", md: "Markdown", fb2: "FB2", docx: "Word · DOCX", odt: "OpenDocument · ODT" })[format] || String(format || "Livre").toUpperCase();
  }

  function bookCard(book) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reader-book-card";
    button.dataset.bookId = book.id;
    const ratio = loadSimpleProgress(book.id);
    const pct = Math.round(ratio * 100);
    button.innerHTML = `
      <span class="reader-book-card-format">${esc(formatLabel(book.format))}</span>
      <span class="reader-book-card-copy">
        <strong>${esc(book.title || Books.titleFromName(book.name))}</strong>
        <small>${esc(book.author || book.name || "")}</small>
        <span class="reader-book-card-progress"><i style="width:${pct}%"></i></span>
        <em>${pct > 1 ? `Reprendre à ${pct} %` : "Commencer"}</em>
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
            <span class="reader-library-progress"><i style="width:${Math.round(loadSimpleProgress(book.id)*100)}%"></i></span>
            <em>${Math.round(loadSimpleProgress(book.id)*100)} % lu</em>
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
    bookGeneration += 1;
    visualRenderRun += 1;
    invalidatePageModels();
    try { rendition?.destroy(); } catch (_) {}
    try { epubBook?.destroy(); } catch (_) {}
    try { foliateView?.close?.(); } catch (_) {}
    try { foliateBook?.destroy?.(); } catch (_) {}
    try { foliateView?.remove?.(); } catch (_) {}
    rendition = null;
    epubBook = null;
    foliateView = null;
    foliateBook = null;
    stopReadingSession();
    currentRecord = null;
    currentFormat = "";
    currentRatio = 0;
    currentChapterLabel = "";
    pageModels = [];
    pageModelsBookId = "";
    revokeFixedPageThumbs();
    revokeVisualPageThumbs();
    epubFixedLayout = false;
    epubFoliateMode = false;
    comicInfo = null;
    visualReaderActive = false;
    visualPages = [];
    visualSpreads = [];
    visualSpreadIndex = 0;
    visualSpreadRoot = null;
    spreadPairSelection.clear();
    revokeVisualDisplayUrls();
    revokeVisualThumbUrls();
    searchRunId += 1;
    comicThumbObserver?.disconnect?.();
    comicThumbObserver = null;
    if (searchResults) searchResults.innerHTML = "";
    if (bookSearchInput) bookSearchInput.value = "";
    navigationHistory = [];
    navigationHistoryIndex = -1;
    lastSelection = null;
    hideSelectionTools();
    updateHistoryButtons();
    render.classList.remove("is-comic", "is-text-epub", "is-visual-zoomed", "is-zoomed");
    syncSettingsControls();
    locationsReady = false;
    render.innerHTML = "";
    plain.innerHTML = "";
    plain.hidden = true;
    render.hidden = false;
    workspace.hidden = true;
    welcome.hidden = false;
    document.body.classList.add("reader-empty");
    headTitle.textContent = "Lecteur";
    headAuthor.textContent = "Bibliothèque locale";
    progress.value = 0;
    progressLabel.textContent = "0 %";
    if (currentPosition) currentPosition.textContent = "Début du livre";
    history.replaceState({}, "", location.pathname);
  }

  async function importFile(file) {
    if (!Books.isSupported(file)) {
       showToast("Format non pris en charge : EPUB, AZW3, MOBI, CBZ, TXT, HTML, Markdown, FB2, DOCX ou ODT.", 3600);
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
    const generation = ++bookGeneration;
    visualRenderRun += 1;
    invalidatePageModels();

    closeDrawers();
    setSettingsOpen(false);
    hideSelectionTools();
    stopReadingSession();
    try { rendition?.destroy(); } catch (_) {}
    try { epubBook?.destroy(); } catch (_) {}
    try { foliateView?.close?.(); } catch (_) {}
    try { foliateBook?.destroy?.(); } catch (_) {}
    try { foliateView?.remove?.(); } catch (_) {}
    rendition = null;
    epubBook = null;
    foliateView = null;
    foliateBook = null;
    revokeFixedPageThumbs();
    revokeVisualPageThumbs();
    epubFixedLayout = false;
    epubFoliateMode = false;
    comicInfo = null;
    visualReaderActive = false;
    visualPages = [];
    visualSpreads = [];
    visualSpreadIndex = 0;
    visualSpreadRoot = null;
    spreadPairSelection.clear();
    revokeVisualDisplayUrls();
    revokeVisualThumbUrls();
    render.innerHTML = "";
    render.classList.remove("is-comic", "is-text-epub", "is-visual-zoomed", "is-zoomed");
    plain.innerHTML = "";
    plain.hidden = true;
    render.hidden = false;
    welcome.hidden = true;
    document.body.classList.remove("reader-empty");
    workspace.hidden = false;
    setLoading(true);
    currentRecord = record;
    currentFormat = record.format;
    const savedView = loadReaderData(record.id);
    if (["auto", "single", "double"].includes(savedView.pageView)) readerSettings.pageView = savedView.pageView;
    if (["ltr", "rtl"].includes(savedView.direction)) readerSettings.comicDirection = savedView.direction;
    currentRatio = loadSimpleProgress(record.id);
    currentChapterLabel = "";
    pageModels = [];
    pageModelsBookId = "";
    navigationHistory = [];
    navigationHistoryIndex = -1;
    updateHistoryButtons();
    syncSettingsControls();
    headTitle.textContent = record.title || Books.titleFromName(record.name);
    headAuthor.textContent = record.author || formatLabel(record.format);

    try {
      if (record.format === "epub") await openEpub(record, fresh);
      else if (record.format === "cbz") await openVisualBook(record, fresh);
      else if (isFoliateFormat(record.format)) await openFoliate(record, fresh);
      else await openPlain(record, fresh);
      if (generation !== bookGeneration) return;
      await Books.updateBook(record.id, { lastOpenedAt: Date.now() });
      startReadingSession();
      renderBookmarks();
      renderNotes();
      await refreshLibrary();
      const url = new URL(location.href);
      url.searchParams.set("book", record.id);
      url.searchParams.delete("fresh");
      history.replaceState({}, "", `${url.pathname}${url.search}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
      const kindleProtected = KINDLE_FORMATS.has(record.format);
      const documentFormat=["docx","odt"].includes(record.format);
      showToast(
        documentFormat ? error?.message || "Impossible de lire ce document." : kindleProtected
          ? "Impossible d’ouvrir ce livre Kindle. Les fichiers AZW/AZW3/MOBI sans DRM sont pris en charge ; les fichiers protégés ne peuvent pas être lus."
          : "Impossible d’ouvrir ce livre. Le fichier est peut-être endommagé ou protégé.",
        5200
      );
      closeCurrentBook();
    }
  }

  function buildFoliateToc(book) {
    toc.innerHTML = "";
    const flat = [];
    const walk = (nodes, depth = 0) => {
      (nodes || []).forEach((item) => {
        flat.push({ ...item, depth });
        if (item.subitems?.length) walk(item.subitems, depth + 1);
      });
    };
    walk(book?.toc || []);
    flat.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `depth-${Math.min(3, item.depth || 0)}`;
      button.textContent = item.label || "Section";
      button.addEventListener("click", async () => {
        let target = null;
        try {
          const resolved = foliateBook?.resolveHref?.(item.href);
          target = { type: "foliate", index: resolved?.index ?? null, ratio: currentRatio, chapter: item.label || "" };
        } catch (_) {}
        if (target?.index != null) await navigateToLocator(target);
        else {
          addHistoryPair({ type: "foliate", ratio: currentRatio, chapter: item.label || "" });
          closeDrawers();
          try { await foliateView?.goTo?.(item.href); } catch (_) {}
        }
      });
      toc.appendChild(button);
    });
    tocEmpty.hidden = flat.length > 0;
  }

  function updateFoliateProgress(detail = {}) {
    let ratio = Number(detail.fraction);
    const index = Number(detail.index);
    const count = foliateBook?.sections?.length || 0;
    if (!Number.isFinite(ratio) && Number.isFinite(index) && count > 0) ratio = (index + 1) / count;
    if (!Number.isFinite(ratio)) ratio = currentRatio || 0;
    ratio = Math.max(0, Math.min(1, ratio));
    const tocLabel = detail.tocItem?.label || detail.chapter?.label || detail.heading || "";
    if (tocLabel) currentChapterLabel = String(tocLabel);
    const fixedVisual = currentFormat === "cbz" || epubFoliateMode;
    const page = fixedVisual && Number.isFinite(index) ? index + 1 : null;
    const total = fixedVisual ? count : (pageModels.length || null);
    updateReaderPosition({ ratio, chapter: currentChapterLabel, page: page || (total ? Math.round(ratio * Math.max(0,total-1))+1 : null), total });
  }

  async function sectionVisualAsset(section) {
    let blob = null;
    try {
      // EPUB: use Foliate's internal resolver first. This avoids trying to resolve
      // "../Images/page.jpg" against a blob: URL, which was the cause of the
      // text placeholders in the previous patch.
      if (section?.createDocument) {
        try {
          const doc = await section.createDocument();
          const rootSvg = doc?.documentElement?.localName === "svg";
          const node = doc?.querySelector?.("img[src],image[href],image[xlink\\:href],object[data]");
          const src = node?.getAttribute("src")
            || node?.getAttribute("href")
            || node?.getAttribute("xlink:href")
            || node?.getAttribute("data");

          if (src && typeof foliateBook?.loadBlob === "function") {
            const resolved = section.resolveHref?.(src) || src;
            const raw = await foliateBook.loadBlob(resolved);
            if (raw) blob = raw instanceof Blob ? raw : new Blob([raw]);
          } else if (rootSvg) {
            // Standalone SVG page.
            const markup = new XMLSerializer().serializeToString(doc.documentElement);
            blob = new Blob([markup], { type: "image/svg+xml" });
          }
        } catch (_) {}
      }

      // CBZ and fallback path: Foliate's section.load() usually resolves the
      // resource tree to blob URLs already.
      if (!blob) {
        const pageUrl = await section?.load?.();
        if (!pageUrl) return null;
        const response = await fetch(pageUrl);
        const type = (response.headers.get("content-type") || "").toLowerCase();

        if (type.startsWith("image/")) {
          blob = await response.blob();
        } else {
          const markup = await response.text();
          const parserType = /xhtml|xml|svg/.test(type) ? "application/xhtml+xml" : "text/html";
          let doc = new DOMParser().parseFromString(markup, parserType);
          if (doc.querySelector("parsererror")) doc = new DOMParser().parseFromString(markup, "text/html");

          const node = doc.querySelector("img[src],image[href],image[xlink\\:href],object[data]");
          let src = node?.getAttribute("src")
            || node?.getAttribute("href")
            || node?.getAttribute("xlink:href")
            || node?.getAttribute("data");

          if (!src) {
            const cssMatch = markup.match(/(?:background(?:-image)?\s*:\s*url\(\s*["']?)([^"')]+)/i);
            src = cssMatch?.[1] || null;
          }

          if (src) {
            if (/^(?:blob:|data:|https?:)/i.test(src)) {
              blob = await (await fetch(src)).blob();
            } else if (typeof foliateBook?.loadBlob === "function") {
              const resolved = section.resolveHref?.(src) || src;
              const raw = await foliateBook.loadBlob(resolved);
              if (raw) blob = raw instanceof Blob ? raw : new Blob([raw]);
            }
          }

          if (!blob) {
            const svg = doc.querySelector("svg") || (doc.documentElement?.localName === "svg" ? doc.documentElement : null);
            if (svg) {
              const markupSvg = new XMLSerializer().serializeToString(svg);
              blob = new Blob([markupSvg], { type: "image/svg+xml" });
            }
          }
        }
      }

      if (!blob) return null;

      let size = null;
      try {
        if ("createImageBitmap" in window) {
          const bitmap = await createImageBitmap(blob);
          size = { width: bitmap.width, height: bitmap.height };
          bitmap.close?.();
        }
      } catch (_) {}
      if (!size) {
        size = await new Promise((resolve) => {
          const url = URL.createObjectURL(blob);
          const image = new Image();
          image.onload = () => {
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
            URL.revokeObjectURL(url);
          };
          image.onerror = () => {
            resolve(null);
            URL.revokeObjectURL(url);
          };
          image.src = url;
        });
      }
      return { blob, size };
    } catch (error) {
      console.warn("Extraction visuelle impossible pour une page", error);
      return null;
    } finally {
      try { section?.unload?.(); } catch (_) {}
    }
  }

  async function inspectVisualSection(section) {
    let pageUrl = null;
    try {
      pageUrl = await section?.load?.();
      if (!pageUrl) return { visual: false };
      const response = await fetch(pageUrl);
      const type = (response.headers.get("content-type") || "").toLowerCase();
      if (type.startsWith("image/")) return { visual: true, viewport: true };

      const markup = await response.text();
      let doc = new DOMParser().parseFromString(markup, /xhtml|xml|svg/.test(type) ? "application/xhtml+xml" : "text/html");
      if (doc.querySelector("parsererror")) doc = new DOMParser().parseFromString(markup, "text/html");
      doc.querySelectorAll("style,script,title").forEach(node => node.remove());
      const text = (doc.body?.textContent || doc.documentElement?.textContent || "").replace(/\s+/g, " ").trim();
      const imageCount = doc.querySelectorAll("img,svg image,object[type^='image/']").length;
      const rootSvg = doc.documentElement?.localName === "svg";
      const viewport = !!doc.querySelector('meta[name="viewport"]') || rootSvg || !!doc.querySelector("svg[viewBox]");
      const viewportText = doc.querySelector('meta[name="viewport"]')?.content || "";
      const viewBox = (doc.querySelector("svg[viewBox]")?.getAttribute("viewBox") || "").split(/[ ,]+/).map(Number);
      const width = Number(viewportText.match(/width\s*=\s*([\d.]+)/i)?.[1]) || viewBox[2];
      const height = Number(viewportText.match(/height\s*=\s*([\d.]+)/i)?.[1]) || viewBox[3];
      return { visual: rootSvg || (imageCount === 1 && text.length < 20), viewport,
        size: width > 0 && height > 0 ? { width, height } : null, textLength: text.length, imageCount };
    } catch (_) {
      return { visual: false };
    } finally {
      try { section?.unload?.(); } catch (_) {}
    }
  }

  async function detectVisualFixedBook(book) {
    if (!book?.sections?.length) return false;
    if (String(book.rendition?.layout || "").toLowerCase() === "pre-paginated") return true;
    const sample = book.sections.slice(0, Math.min(8, book.sections.length));
    let visual = 0, viewport = 0;
    for (let i = 0; i < sample.length; i += 1) {
      const info = await inspectVisualSection(sample[i]);
      if (info.visual) visual += 1;
      if (info.viewport) viewport += 1;
      if (i % 3 === 2) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return sample.length >= 2 && visual / sample.length >= .65 && (viewport > 0 || visual === sample.length);
  }

  async function sectionImageDimensions(section) {
    const asset = await sectionVisualAsset(section);
    return asset?.size || null;
  }

  async function createSectionThumbnailUrl(section) {
    const asset = await sectionVisualAsset(section);
    if (!asset?.blob) return null;
    const url = URL.createObjectURL(asset.blob);
    visualPageThumbUrls.push(url);
    return { url, size: asset.size || null };
  }

  function hasExplicitSpread(section) {
    return ["left","right","center"].includes(section?.pageSpread);
  }

  async function prepareFixedVisualBook(book, { comic = false } = {}) {
    if (!book?.sections?.length) return book;
    if (comic) book.dir = readerSettings.comicDirection === "rtl" ? "rtl" : "ltr";
    const explicitBookSpread = String(book.rendition?.spread || "").toLowerCase();
    book.rendition = {
      ...(book.rendition || {}),
      layout: "pre-paginated",
      spread: explicitBookSpread === "none" ? "none" : (explicitBookSpread || "auto")
    };

    return book;
  }

  async function prepareComicBook(book) {
    return prepareFixedVisualBook(book, { comic: true });
  }

  function revokeFixedPageThumbs() {
    fixedPageThumbUrls.forEach((url) => { try { URL.revokeObjectURL(url); } catch (_) {} });
    fixedPageThumbUrls = [];
  }

  function revokeVisualPageThumbs() {
    visualPageThumbUrls.forEach((url) => { try { URL.revokeObjectURL(url); } catch (_) {} });
    visualPageThumbUrls = [];
  }

  async function fixedEpubThumbnail(section) {
    if (!section) return null;
    const asset = await createSectionThumbnailUrl(section);
    if (!asset?.url) return null;
    fixedPageThumbUrls.push(asset.url);
    return asset.url;
  }


  function revokeVisualDisplayUrls() {
    visualDisplayUrls.forEach((url) => { try { URL.revokeObjectURL(url); } catch (_) {} });
    visualDisplayUrls = [];
  }

  function revokeVisualThumbUrls() {
    for (const url of visualThumbUrls.values()) {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }
    visualThumbUrls.clear();
  }

  function savedSpreadPairs() {
    if (!currentRecord) return [];
    return (currentReaderData().spreadPairs || [])
      .map((pair) => Array.isArray(pair) ? pair.map(Number) : null)
      .filter((pair) => pair && pair.length === 2 && Number.isInteger(pair[0]) && Number.isInteger(pair[1]) && Math.abs(pair[0] - pair[1]) === 1)
      .map((pair) => pair[0] < pair[1] ? pair : [pair[1], pair[0]])
      .filter((pair) => pair[0] >= 0 && pair[1] < visualPages.length);
  }

  function saveSpreadPairs(pairs) {
    if (!currentRecord) return;
    const data = currentReaderData();
    data.spreadPairs = pairs;
    saveReaderData(currentRecord.id, data);
  }

  function isVisualWide(page) {
    if (!page) return false;
    const ratio = page.size?.width && page.size?.height ? page.size.width / page.size.height : 0;
    return ratio >= 1.18;
  }

  function buildVisualSpreads() {
    if (!visualPages.length) {
      visualSpreads = [];
      return visualSpreads;
    }

    const mode = readerSettings.pageView || "auto";
    if (mode === "single") {
      visualSpreads = visualPages.map((_, index) => [index]);
      return visualSpreads;
    }

    const locks = savedSpreadPairs();
    const lockByStart = new Map(locks.map((pair) => [pair[0], pair]));
    const lockedSecond = new Set(locks.map((pair) => pair[1]));
    const spreads = [];
    let i = 0;

    while (i < visualPages.length) {
      // Manual pairing always wins over automatic heuristics.
      if (lockByStart.has(i)) {
        spreads.push([...lockByStart.get(i)]);
        i += 2;
        continue;
      }

      // Never steal the second half of a manually locked pair.
      if (lockedSecond.has(i)) {
        spreads.push([i]);
        i += 1;
        continue;
      }

      const current = visualPages[i];
      const next = visualPages[i + 1];

      // La couverture et les images panoramiques restent entières, même en
      // mode deux pages. Le premier appariement est réglable pour chaque livre.
      const coverAlone = currentReaderData().spreadStart !== "first";
      if ((i === 0 && coverAlone) || isVisualWide(current) || (current.pageSpread === "center" && !(i === 0 && !coverAlone))) {
        spreads.push([i]); i += 1; continue;
      }
      if (mode === "auto") {
        if (render.clientWidth < 760 || String(foliateBook?.rendition?.spread || "") === "none") {
          spreads.push([i]);
          i += 1;
          continue;
        }
        if (!next) {
          spreads.push([i]);
          i += 1;
          continue;
        }
        if (lockByStart.has(i + 1) || isVisualWide(next)) {
          spreads.push([i]);
          i += 1;
          continue;
        }

        // Respect explicit EPUB left/right information when it exists.
        const a = current.pageSpread || "";
        const b = next.pageSpread || "";
        const explicitA = a === "left" || a === "right";
        const explicitB = b === "left" || b === "right";
        const firstSide = readerSettings.comicDirection === "rtl" ? "right" : "left";
        const secondSide = readerSettings.comicDirection === "rtl" ? "left" : "right";
        if ((explicitA && a !== firstSide) || (explicitB && b !== secondSide)) {
          spreads.push([i]);
          i += 1;
          continue;
        }
      }

      // Force-double mode pairs every available pair except a manually
      // locked boundary. Auto mode reaches this branch for ordinary portrait pages.
      if (next && !lockByStart.has(i + 1) && !isVisualWide(next) && next.pageSpread !== "center") {
        spreads.push([i, i + 1]);
        i += 2;
      } else {
        spreads.push([i]);
        i += 1;
      }
    }

    visualSpreads = spreads;
    return spreads;
  }

  function visualSpreadForPage(pageIndex) {
    const page = Math.max(0, Math.min(visualPages.length - 1, Number(pageIndex) || 0));
    const found = visualSpreads.findIndex((spread) => spread.includes(page));
    return found >= 0 ? found : 0;
  }

  async function visualPageAssetUrl(pageIndex) {
    const page = visualPages[pageIndex];
    if (!page?.section) return null;
    if (page.document) return page.section.load();
    const asset = await sectionVisualAsset(page.section);
    if (!asset?.blob) return null;
    return URL.createObjectURL(asset.blob);
  }

  async function makeSmallThumbnail(blob, maxWidth = 240, maxHeight = 340) {
    if (!blob) return null;
    try {
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#fffdf9";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close?.();
      const thumbBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", .72));
      return thumbBlob || blob;
    } catch (_) {
      return blob;
    }
  }

  async function visualThumbnailUrl(pageIndex) {
    if (visualThumbUrls.has(pageIndex)) return visualThumbUrls.get(pageIndex);
    const page = visualPages[pageIndex];
    if (!page?.section) return null;
    const asset = await sectionVisualAsset(page.section);
    if (!asset?.blob) return null;
    const small = await makeSmallThumbnail(asset.blob);
    const url = URL.createObjectURL(small);
    visualThumbUrls.set(pageIndex, url);
    return url;
  }

  async function prepareVisualPages(book) {
    visualPages = [];
    revokeVisualThumbUrls();
    const total = book?.sections?.length || 0;
    for (let i = 0; i < total; i += 1) {
      const section = book.sections[i];
      const info = currentFormat === "cbz" ? { visual: true } : await inspectVisualSection(section);
      const size = info.size || section?.philosophalSize || (info.visual ? await sectionImageDimensions(section) : null);
      visualPages.push({
        index: i,
        section,
        size: size || { width: 800, height: 1200 },
        document: !info.visual,
        pageSpread: section?.pageSpread || (i === 0 ? "center" : ""),
        href: section?.href || ""
      });
      if (i % 8 === 7) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    buildVisualSpreads();
  }

  function buildVisualToc(book) {
    toc.innerHTML = "";
    const flat = [];
    const walk = (nodes, depth = 0) => {
      (nodes || []).forEach((item) => {
        flat.push({ ...item, depth });
        if (item.subitems?.length) walk(item.subitems, depth + 1);
      });
    };
    walk(book?.toc || []);
    flat.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `depth-${Math.min(3, item.depth || 0)}`;
      button.textContent = item.label || "Section";
      button.addEventListener("click", async () => {
        let index = null;
        try {
          const resolved = book.resolveHref?.(item.href);
          index = Number(resolved?.index);
        } catch (_) {}
        if (!Number.isFinite(index)) {
          const href = String(item.href || "").split("#")[0];
          index = visualPages.findIndex((page) => String(page.href || "").split("#")[0] === href);
        }
        if (Number.isFinite(index) && index >= 0) {
          await goToVisualPage(index);
          closeDrawers();
        }
      });
      toc.appendChild(button);
    });
    tocEmpty.hidden = flat.length > 0;
  }

  async function renderVisualSpread(spreadIndex, { announce = false } = {}) {
    if (!visualReaderActive || !visualSpreads.length) return;
    const run = ++visualRenderRun;
    const generation = bookGeneration;
    const targetIndex = Math.max(0, Math.min(visualSpreads.length - 1, Number(spreadIndex) || 0));
    const spread = visualSpreads[targetIndex];
    const canvas = document.createElement("div");
    canvas.className = "reader-visual-spread-canvas";
    canvas.dataset.visualSpreadCanvas = "";
    canvas.classList.toggle("is-double", spread.length === 2);
    canvas.classList.toggle("is-single", spread.length === 1);
    const createdUrls = [];
    const ordered = readerSettings.comicDirection === "rtl" && spread.length === 2 ? [...spread].reverse() : [...spread];
    const nodes = await Promise.all(ordered.map(async (pageIndex) => {
      const url = await visualPageAssetUrl(pageIndex);
      const page = visualPages[pageIndex];
      const figure = document.createElement("figure");
      figure.className = "reader-visual-page";
      figure.dataset.pageIndex = String(pageIndex);
      if (isVisualWide(page)) figure.classList.add("is-wide");
      if (page.document) {
        const frame = document.createElement("iframe");
        frame.title = `Page ${pageIndex + 1}`;
        frame.setAttribute("sandbox", "allow-same-origin");
        frame.addEventListener("load", () => {
          attachSelectionHandlers(frame.contentDocument);
          applyVisualZoom();
        });
        if (url) frame.src = url;
        figure.appendChild(frame);
      } else {
        if (url) createdUrls.push(url);
        const img = document.createElement("img");
        img.alt = `Page ${pageIndex + 1}`;
        img.draggable = false;
        if (url) img.src = url;
        figure.appendChild(img);
        if (url) await img.decode().catch(() => {});
      }
      if (!url) {
        const caption = document.createElement("figcaption");
        caption.textContent = `Page ${pageIndex + 1} indisponible`;
        figure.appendChild(caption);
      }
      return figure;
    }));
    if (run !== visualRenderRun || generation !== bookGeneration) {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
      return;
    }
    revokeVisualDisplayUrls();
    visualDisplayUrls = createdUrls;
    visualSpreadIndex = targetIndex;
    if (!visualSpreadRoot) {
      render.innerHTML = "";
      visualSpreadRoot = document.createElement("div");
      visualSpreadRoot.className = "reader-visual-spread";
      visualSpreadRoot.tabIndex = 0;
      visualSpreadRoot.setAttribute("role", "region");
      visualSpreadRoot.setAttribute("aria-label", "Pages de la bande dessinée ou du livre illustré");
      render.appendChild(visualSpreadRoot);
    }
    nodes.forEach((node) => canvas.appendChild(node));
    visualSpreadRoot.replaceChildren(canvas);
    visualSpreadRoot.scrollTop = 0;
    visualSpreadRoot.scrollLeft = 0;

    const firstPage = Math.min(...spread);
    const lastPage = Math.max(...spread);
    const ratio = visualPages.length <= 1 ? 0 : firstPage / (visualPages.length - 1);
    const pageLabel = spread.length === 2 ? `${firstPage + 1}–${lastPage + 1}` : `${firstPage + 1}`;
    currentRatio = ratio;
    updateReaderPosition({
      ratio,
      chapter: currentChapterLabel,
      page: pageLabel,
      total: visualPages.length
    });
    try { localStorage.setItem(positionKey(currentRecord.id), `visual:${firstPage}`); } catch (_) {}
    applyVisualZoom();
    updateCurrentPageThumb();

    if (announce) showToast(spread.length === 2 ? `Pages ${pageLabel}` : `Page ${pageLabel}`, 900);
  }

  async function goToVisualPage(pageIndex, options = {}) {
    if (!visualReaderActive || !visualPages.length) return;
    const target = Math.max(0, Math.min(visualPages.length - 1, Number(pageIndex) || 0));
    const spreadIndex = visualSpreadForPage(target);
    await renderVisualSpread(spreadIndex, options);
  }

  async function openVisualBook(record, fresh, preparedBook = null, preparedFile = null) {
    setLoading(true, record.format === "cbz" ? "Préparation des pages de la BD…" : "Préparation des pages illustrées…");
    const foliateModule = await getFoliateModule();
    const type = record.blob?.type || (record.format === "cbz" ? "application/vnd.comicbook+zip" : "application/epub+zip");
    const file = preparedFile || (record.blob instanceof File
      ? record.blob
      : new File([record.blob], record.name || `livre.${record.format}`, { type }));

    foliateBook = preparedBook || (typeof foliateModule?.makeBook === "function" ? await foliateModule.makeBook(file) : null);
    if (!foliateBook?.sections?.length) throw new Error("Livre illustré non exploitable.");
    if (record.format === "epub" && !currentReaderData().direction) readerSettings.comicDirection = foliateBook.dir === "rtl" ? "rtl" : "ltr";

    if (record.format === "cbz") await prepareComicBook(foliateBook);
    else await prepareFixedVisualBook(foliateBook, { comic: false });

    visualReaderActive = true;
    epubFoliateMode = record.format === "epub";
    epubFixedLayout = record.format === "epub";
    render.innerHTML = "";
    render.hidden = false;
    plain.hidden = true;
    foliateView = null;
    rendition = null;
    epubBook = null;

    await prepareVisualPages(foliateBook);
    if (!visualPages.length) throw new Error("Aucune page visuelle détectée.");

    const metadata = foliateBook?.metadata || {};
    const authorRaw = metadata.author ?? metadata.creator ?? "";
    const author = Array.isArray(authorRaw)
      ? authorRaw.map((x) => typeof x === "string" ? x : x?.name).filter(Boolean).join(", ")
      : (typeof authorRaw === "object" ? authorRaw?.name || "" : String(authorRaw || ""));

    const patch = {
      title: metadata.title || record.title || Books.titleFromName(record.name),
      author: author || record.author || "",
      language: metadata.language || record.language || "",
      metadataReady: true
    };
    currentRecord = await Books.updateBook(record.id, patch) || { ...record, ...patch };
    headTitle.textContent = currentRecord.title;
    headAuthor.textContent = currentRecord.author || formatLabel(record.format);

    buildVisualToc(foliateBook);
    syncSettingsControls();

    let startPage = 0;
    if (!fresh) {
      const saved = localStorage.getItem(positionKey(record.id)) || "";
      const match = /^visual:(\d+)$/.exec(saved);
      if (match) startPage = Number(match[1]) || 0;
      else startPage = Math.round(loadSimpleProgress(record.id) * Math.max(0, visualPages.length - 1));
    }
    await goToVisualPage(startPage);
    setLoading(false);
  }

  function refreshSpreadLocker() {
    const available = visualReaderActive && visualPages.length > 1;
    if (spreadLocker) spreadLocker.hidden = !available;
    if (!available) return;

    const selected = [...spreadPairSelection].sort((a,b) => a-b);
    const consecutive = selected.length === 2 && selected[1] === selected[0] + 1;
    const locks = savedSpreadPairs();
    const locked = consecutive && locks.some((pair) => pair[0] === selected[0] && pair[1] === selected[1]);

    if (spreadSelectionLabel) {
      spreadSelectionLabel.textContent = selected.length
        ? `Sélection : ${selected.map((x) => x + 1).join(" + ")}${selected.length === 2 && !consecutive ? " · choisissez deux pages voisines" : ""}`
        : "Aucune page sélectionnée";
    }
    if (lockSpreadButton) lockSpreadButton.disabled = !consecutive || locked;
    if (unlockSpreadButton) unlockSpreadButton.disabled = !locked;

    if (spreadLockList) {
      spreadLockList.innerHTML = "";
      locks.forEach((pair) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "reader-spread-lock-chip";
        chip.textContent = `${pair[0] + 1} + ${pair[1] + 1} ×`;
        chip.title = "Supprimer ce verrouillage";
        chip.addEventListener("click", async () => {
          saveSpreadPairs(locks.filter((x) => !(x[0] === pair[0] && x[1] === pair[1])));
          buildVisualSpreads();
          spreadPairSelection.clear();
          await renderPagesDrawer();
          await goToVisualPage(Math.round(currentRatio * Math.max(0, visualPages.length - 1)));
        });
        spreadLockList.appendChild(chip);
      });
    }

    pageThumbs?.querySelectorAll("[data-pair-select]").forEach((button) => {
      const index = Number(button.dataset.pairSelect);
      const selectedNow = spreadPairSelection.has(index);
      const lockedNow = locks.some((pair) => pair.includes(index));
      button.checked = selectedNow;
      button.closest(".reader-page-thumb")?.classList.toggle("is-pair-selected", selectedNow);
      button.closest(".reader-page-thumb")?.classList.toggle("is-pair-locked", lockedNow);
    });
  }

  async function lockSelectedSpread() {
    const selected = [...spreadPairSelection].sort((a,b) => a-b);
    if (selected.length !== 2 || selected[1] !== selected[0] + 1) {
      showToast("Sélectionne deux pages consécutives.");
      return;
    }
    let locks = savedSpreadPairs();
    locks = locks.filter((pair) => !pair.some((page) => selected.includes(page)));
    locks.push(selected);
    locks.sort((a,b) => a[0] - b[0]);
    saveSpreadPairs(locks);
    if (readerSettings.pageView === "single") {
      readerSettings.pageView = "double";
      const data = currentReaderData(); data.pageView = "double";
      saveReaderData(currentRecord.id, data); saveSettings(readerSettings); syncSettingsControls();
    }
    buildVisualSpreads();
    refreshSpreadLocker();
    await goToVisualPage(selected[0]);
    showToast(`Pages ${selected[0] + 1} et ${selected[1] + 1} verrouillées ensemble.`);
  }

  async function unlockSelectedSpread() {
    const selected = [...spreadPairSelection].sort((a,b) => a-b);
    if (selected.length !== 2) return;
    saveSpreadPairs(savedSpreadPairs().filter((pair) => !(pair[0] === selected[0] && pair[1] === selected[1])));
    buildVisualSpreads();
    refreshSpreadLocker();
    await goToVisualPage(selected[0]);
    showToast("Verrouillage supprimé.");
  }

  function epubSpreadMode() {
    if (readerSettings.flow === "scrolled-doc" && !epubFixedLayout) return { spread: "none", min: 999999 };
    if (readerSettings.pageView === "single") return { spread: "none", min: 999999 };
    if (readerSettings.pageView === "double") return { spread: "always", min: 0 };
    // Auto : pour les BD / EPUB fixed-layout, respecte les paires prévues par le livre
    // et repasse à une page sur les écrans trop étroits.
    return { spread: "auto", min: 1000 };
  }

  async function openFoliate(record, fresh, preparedBook = null, preparedFile = null) {
    setLoading(true, record.format === "cbz" ? "Ouverture de la bande dessinée…" : epubFoliateMode ? "Ouverture de l’EPUB illustré…" : "Ouverture du livre Kindle…");
    const foliateModule = await getFoliateModule();

    try { foliateView?.close?.(); } catch (_) {}
    try { if (foliateBook && foliateBook !== preparedBook) foliateBook?.destroy?.(); } catch (_) {}
    render.innerHTML = "";
    render.hidden = false;
    plain.hidden = true;
    locationsReady = false;

    const type = record.blob?.type || (record.format === "cbz" ? "application/vnd.comicbook+zip" : record.format === "epub" ? "application/epub+zip" : "application/octet-stream");
    const file = preparedFile || (record.blob instanceof File
      ? record.blob
      : new File([record.blob], record.name || `livre.${record.format}`, { type }));

    foliateView = document.createElement("foliate-view");
    foliateView.className = "reader-foliate-view";
    foliateView.setAttribute("tabindex", "0");
    render.appendChild(foliateView);

    foliateView.addEventListener("load", (event) => {
      const doc = event.detail?.doc;
      applyFoliateDocumentSettings(doc);
      attachSelectionHandlers(doc, null);
      requestAnimationFrame(applyVisualZoom);
    });

    foliateView.addEventListener("relocate", (event) => {
      const detail = event.detail || {};
      if (detail.cfi) {
        try { localStorage.setItem(positionKey(record.id), detail.cfi); } catch (_) {}
      }
      updateFoliateProgress(detail);
    });

    if (preparedBook) {
      foliateBook = preparedBook;
      await foliateView.open(foliateBook);
    } else if (record.format === "cbz" && typeof foliateModule?.makeBook === "function") {
      foliateBook = await foliateModule.makeBook(file);
      await prepareComicBook(foliateBook);
      await foliateView.open(foliateBook);
    } else {
      await foliateView.open(file);
      foliateBook = foliateView.book;
    }

    const metadata = foliateBook?.metadata || {};
    const authorRaw = metadata.author ?? metadata.creator ?? "";
    const author = Array.isArray(authorRaw)
      ? authorRaw.map((x) => typeof x === "string" ? x : x?.name).filter(Boolean).join(", ")
      : (typeof authorRaw === "object" ? authorRaw?.name || "" : String(authorRaw || ""));

    const patch = {
      title: metadata.title || record.title || Books.titleFromName(record.name),
      author: author || record.author || "",
      language: metadata.language || record.language || "",
      metadataReady: true
    };
    currentRecord = await Books.updateBook(record.id, patch) || { ...record, ...patch };
    headTitle.textContent = currentRecord.title;
    headAuthor.textContent = currentRecord.author || (epubFoliateMode ? "EPUB illustré" : formatLabel(record.format));

    buildFoliateToc(foliateBook);
    syncSettingsControls();

    const saved = !fresh ? localStorage.getItem(positionKey(record.id)) : null;
    await foliateView.init({ lastLocation: saved || null, showTextStart: !saved });
    applyReadingSettings();
    updateFoliateProgress(foliateView.lastLocation || {});
    setLoading(false);
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

    // Fixed-layout EPUBs are routed through Foliate rather than EPUB.js.
    // EPUB.js 0.3.x is known not to reliably honor page-spread-left/right,
    // which shifts illustrated spreads. Foliate's fixed-layout renderer does.
    let preparedFoliateBook = null;
    try {
      const foliateModule = await getFoliateModule();
      if (typeof foliateModule?.makeBook === "function") {
        const file = record.blob instanceof File
          ? record.blob
          : new File([record.blob], record.name || "livre.epub", { type: record.blob?.type || "application/epub+zip" });
        preparedFoliateBook = await foliateModule.makeBook(file);
        const fixedByMetadata = String(preparedFoliateBook?.rendition?.layout || "").toLowerCase() === "pre-paginated";
        const fixedByContent = fixedByMetadata ? true : await detectVisualFixedBook(preparedFoliateBook);
        if (fixedByContent) {
          epubFixedLayout = true;
          epubFoliateMode = true;
          await openVisualBook(record, fresh, preparedFoliateBook, file);
          return;
        }
        try { preparedFoliateBook?.destroy?.(); } catch (_) {}
        preparedFoliateBook = null;
      }
    } catch (error) {
      console.warn("Inspection visuelle EPUB via Foliate impossible ; retour au moteur EPUB standard.", error);
      try { preparedFoliateBook?.destroy?.(); } catch (_) {}
    }

    const buffer = await record.blob.arrayBuffer();
    epubBook = window.ePub(buffer);
    const metadata = await epubBook.loaded.metadata;
    const navigationPromise = epubBook.loaded.navigation;
    epubFixedLayout = String(metadata?.layout || epubBook?.package?.metadata?.layout || "").toLowerCase() === "pre-paginated";

    const patch = {
      title: metadata?.title || record.title || Books.titleFromName(record.name),
      author: metadata?.creator || record.author || "",
      language: metadata?.language || record.language || "",
      metadataReady: true
    };
    currentRecord = await Books.updateBook(record.id, patch) || { ...record, ...patch };
    headTitle.textContent = currentRecord.title;
    headAuthor.textContent = currentRecord.author || "EPUB";

    const spreadMode = epubSpreadMode();
    rendition = epubBook.renderTo(render, {
      width: "100%",
      height: "100%",
      manager: "default",
      flow: epubFixedLayout ? "paginated" : (readerSettings.flow === "scrolled-doc" ? "scrolled-doc" : "paginated"),
      layout: epubFixedLayout ? "pre-paginated" : undefined,
      spread: spreadMode.spread,
      minSpreadWidth: spreadMode.min,
      gap: Math.max(32, Number(readerSettings.pageMargin) * 2),
      allowScriptedContent: false
    });

    rendition.on("rendered", () => {
      try {
        rendition.getContents?.().forEach((contents) => {
          const doc = contents?.document || contents?.doc;
          applyDocumentAdvancedSettings(doc);
          attachSelectionHandlers(doc, contents);
        });
      } catch (_) {}
      restoreEpubAnnotations();
      requestAnimationFrame(applyVisualZoom);
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

    const openedBook = epubBook;
    openedBook.locations.generate(1200).then(() => {
      if (epubBook !== openedBook) return;
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
    if (ratio == null) ratio = currentRatio || 0;
    const bounded = Math.max(0, Math.min(1, Number(ratio) || 0));
    const chapter = chapterLabelFromEpubLocation(location) || currentChapterLabel;
    const actualPages = pageModels[0]?.kind === "epub-page";
    const pageIndex = actualPages ? window.PhilosophalPagination.indexAt(pageModels, cfi) : null;
    const endIndex = actualPages ? window.PhilosophalPagination.indexAt(pageModels, location?.end?.cfi) : null;
    const total = actualPages ? pageModels.length : null;
    updateReaderPosition({
      ratio: bounded,
      chapter,
      page: pageIndex >= 0 && pageIndex != null ? (endIndex > pageIndex ? `${pageIndex + 1}–${Math.min(pageIndex + 2,endIndex + 1)}` : pageIndex + 1) : null,
      total
    });
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
        if (!rendition) return;
        try {
          const section = epubBook?.spine?.get?.(item.href);
          const locator = { type: "epub", cfi: section?.cfiBase || null, ratio: currentRatio, chapter: item.label || "" };
          if (locator.cfi) await navigateToLocator(locator);
          else {
            const before = currentLocator();
            closeDrawers();
            await rendition.display(item.href);
            const after = currentLocator();
            if (before && after) { navigationHistory.push(before, after); navigationHistoryIndex = navigationHistory.length - 1; updateHistoryButtons(); }
          }
        } catch (_) {
          closeDrawers();
          try { await rendition.display(item.href); } catch (_) {}
        }
      });
      toc.appendChild(button);
    });
    tocEmpty.hidden = flat.length > 0;
  }

  function buildPlainToc() {
    toc.innerHTML = "";
    const headings = [...plain.querySelectorAll("h1,h2,h3")];
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `reader-heading-${index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      const depth = heading.tagName === "H1" ? 0 : heading.tagName === "H2" ? 1 : 2;
      button.className = `depth-${depth}`;
      button.textContent = heading.textContent?.trim() || `Section ${index + 1}`;
      button.addEventListener("click", () => {
        const before = currentLocator();
        heading.scrollIntoView({ block: "start", behavior: "smooth" });
        setTimeout(() => {
          syncPlainProgress();
          const after = currentLocator();
          if (before && after) {
            if (navigationHistoryIndex < navigationHistory.length - 1) navigationHistory.splice(navigationHistoryIndex + 1);
            navigationHistory.push(before, after);
            navigationHistoryIndex = navigationHistory.length - 1;
            updateHistoryButtons();
          }
        }, 300);
        closeDrawers();
      });
      toc.appendChild(button);
    });
    tocEmpty.hidden = headings.length > 0;
  }

  function plainChapterAtScroll() {
    const headings = [...plain.querySelectorAll("h1,h2,h3")];
    let label = "";
    const top = plain.scrollTop + 36;
    for (const heading of headings) {
      if (heading.offsetTop <= top) label = heading.textContent?.trim() || label;
      else break;
    }
    return label;
  }

  async function openPlain(record, fresh) {
    render.hidden = true;
    plain.hidden = false;
    plain.innerHTML = "";
    toc.innerHTML = "";
    tocEmpty.hidden = false;
    const documentFormat=["docx","odt"].includes(record.format);
    const text=documentFormat?"":await record.blob.text();
    let html = "";

    if(documentFormat){
      const result=await window.PhilosophalDocuments.read(record.blob,record.format);html=result.html;
      const metadata={title:result.title||record.title,author:result.author||record.author,metadataReady:true};await Books.updateBook(record.id,metadata);Object.assign(record,metadata);headTitle.textContent=record.title;headAuthor.textContent=record.author||formatLabel(record.format);
    }
    else if (record.format === "html") html = sanitizeHtml(text);
    else if (record.format === "md") html = markdownToHtml(text);
    else if (record.format === "fb2") html = fb2ToHtml(text);
    else html = `<pre>${esc(text)}</pre>`;

    plain.innerHTML = html;
    buildPlainToc();
    applyReadingSettings();
    attachPlainSelectionHandlers();
    restorePlainHighlights();
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
    const total = pageModels.length || Math.max(1, Math.ceil(plain.scrollHeight / Math.max(1, plain.clientHeight)));
    const page = Math.min(total, Math.max(1, Math.round(ratio * Math.max(0,total-1)) + 1));
    currentChapterLabel = plainChapterAtScroll() || currentChapterLabel;
    updateReaderPosition({ ratio, chapter: currentChapterLabel, page, total });
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

      // Un saut de secours calculé en caractères pouvait changer la destination.
    } catch (error) {
      console.warn("Navigation EPUB impossible", error);
    } finally {
      pageTurnBusy = false;
    }
  }

  function setZoom(nextZoom, { announce = true } = {}) {
    const value = Math.max(70, Math.min(220, Math.round(Number(nextZoom) / 10) * 10));
    readerSettings = { ...readerSettings, zoom: value };
    saveSettings(readerSettings);
    syncSettingsControls();
    invalidatePageModels();
    if (rendition) refreshTextLayout();
    else { applyReadingSettings(); requestAnimationFrame(applyVisualZoom); }
    if (announce) showToast(`Zoom ${value} %`, 1200);
  }

  async function jumpPages(delta) {
    const amount = Math.max(1, Math.abs(Number(delta) || 0));
    const forward = Number(delta) > 0;
    if (!amount || pageTurnBusy) return;
    try {
      pageTurnBusy = true;
      if (visualReaderActive) {
        const currentPage = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
        await goToVisualPage(currentPage + (forward ? amount : -amount), { announce: true });
      } else if (currentFormat === "epub" && rendition) {
        const models = await buildPageModels();
        const index = window.PhilosophalPagination.indexAt(models, rendition.currentLocation()?.start?.cfi);
        const target = models[Math.max(0, Math.min(models.length - 1, Math.max(0,index) + (forward ? amount : -amount)))];
        if (target) await rendition.display(target.cfi);
      } else if (isFoliateActive()) {
        for (let i = 0; i < amount; i += 1) {
          await (forward ? foliateView.next() : foliateView.prev());
        }
      } else if (!plain.hidden) {
        plain.scrollBy({
          top: (forward ? 1 : -1) * Math.max(240, plain.clientHeight * .82) * amount,
          behavior: "smooth"
        });
      }
      showToast(`${forward ? "+" : "−"}${amount} pages`, 1100);
    } catch (_) {
      showToast("Impossible d’aller plus loin dans ce sens.", 1600);
    } finally {
      pageTurnBusy = false;
    }
  }

  async function previous() {
    if (!currentRecord) return;
    if (visualReaderActive) await turnVisual(-1);
    else if (currentFormat === "epub" && rendition) await turnEpub("prev");
    else if (isFoliateActive()) await foliateView.prev();
    else plain.scrollBy({ top: -Math.max(240, plain.clientHeight * .82), behavior: "smooth" });
  }

  async function next() {
    if (!currentRecord) return;
    if (visualReaderActive) await turnVisual(1);
    else if (currentFormat === "epub" && rendition) await turnEpub("next");
    else if (isFoliateActive()) await foliateView.next();
    else plain.scrollBy({ top: Math.max(240, plain.clientHeight * .82), behavior: "smooth" });
  }

  async function turnVisual(direction) {
    const generation = bookGeneration;
    const task = visualTurnQueue.catch(() => {}).then(async () => {
      if (generation !== bookGeneration || !visualReaderActive) return;
      await renderVisualSpread(visualSpreadIndex + direction);
    });
    visualTurnQueue = task;
    return task;
  }

  async function seek(value) {
    if (!currentRecord) return;
    const ratio = Math.max(0, Math.min(1, Number(value) / 1000));
    if (visualReaderActive) {
      const target = Math.round(ratio * Math.max(0, visualPages.length - 1));
      await goToVisualPage(target);
    } else if (currentFormat === "epub" && rendition && locationsReady) {
      const cfi = epubBook.locations.cfiFromPercentage(ratio);
      if (cfi) await rendition.display(cfi);
    } else if (isFoliateActive() && foliateView?.goToFraction) {
      try { await foliateView.goToFraction(ratio); } catch (_) {}
    } else if (!plain.hidden) {
      const max = Math.max(0, plain.scrollHeight - plain.clientHeight);
      plain.scrollTop = max * ratio;
    }
  }


  function uid(prefix = "item") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function truncateText(value, max = 220) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  }

  function formatDuration(seconds) {
    const sec = Math.max(0, Math.round(Number(seconds) || 0));
    if (sec < 60) return `${sec} s`;
    const min = Math.round(sec / 60);
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h} h ${m.toString().padStart(2, "0")}` : `${h} h`;
  }

  function currentReaderData() {
    return loadReaderData(currentRecord?.id);
  }

  function updateReaderPosition({ ratio = currentRatio, chapter = currentChapterLabel, page = null, total = null } = {}) {
    currentRatio = Math.max(0, Math.min(1, Number(ratio) || 0));
    if (chapter) currentChapterLabel = String(chapter);
    const pct = Math.round(currentRatio * 100);
    progress.value = Math.round(currentRatio * 1000);
    progressLabel.textContent = `${pct} %`;
    saveSimpleProgress(currentRecord?.id, currentRatio);

    const parts = [];
    if (currentChapterLabel) parts.push(currentChapterLabel);
    if (page && total) parts.push(`page ${page}/${total}`);
    else if (page) parts.push(`page ${page}`);
    parts.push(`${pct} %`);
    if (currentPosition) currentPosition.textContent = parts.filter(Boolean).join(" · ");
    updateReadingMeta();
    updateCurrentPageThumb();
  }

  function updateReadingMeta() {
    if (!readingMeta || !currentRecord || !sessionStartedAt) {
      if (readingMeta) readingMeta.textContent = "";
      return;
    }
    const elapsed = Math.max(0, (Date.now() - sessionStartedAt) / 1000);
    let text = `session ${formatDuration(elapsed)}`;
    const delta = currentRatio - sessionProgressStart;
    if (elapsed >= 90 && delta > .015 && currentRatio < .995) {
      const perRatio = elapsed / delta;
      const remain = perRatio * (1 - currentRatio);
      if (Number.isFinite(remain) && remain < 60 * 60 * 20) text += ` · ≈ ${formatDuration(remain)} restantes`;
    }
    readingMeta.textContent = text;
  }

  function startReadingSession() {
    sessionStartedAt = Date.now();
    sessionProgressStart = currentRatio || loadSimpleProgress(currentRecord?.id);
    clearInterval(sessionTimer);
    sessionTimer = setInterval(updateReadingMeta, 30000);
    updateReadingMeta();
  }

  function stopReadingSession() {
    clearInterval(sessionTimer);
    sessionTimer = null;
    sessionStartedAt = 0;
    if (readingMeta) readingMeta.textContent = "";
  }

  function currentLocator() {
    if (!currentRecord) return null;
    const base = { format: currentFormat, ratio: currentRatio, chapter: currentChapterLabel || "", at: Date.now() };
    if (visualReaderActive) {
      return { ...base, type: "visual", pageIndex: visualSpreads[visualSpreadIndex]?.[0] ?? 0 };
    }
    if (currentFormat === "epub" && rendition) {
      const location = rendition.currentLocation?.();
      return { ...base, type: "epub", cfi: location?.start?.cfi || null };
    }
    if (isFoliateActive()) {
      const loc = foliateView.lastLocation || {};
      return {
        ...base,
        type: "foliate",
        cfi: loc.cfi || null,
        index: Number.isFinite(Number(loc.index)) ? Number(loc.index) : null
      };
    }
    if (!plain.hidden) return { ...base, type: "plain", ratio: currentRatio };
    return base;
  }

  function locatorsEqual(a, b) {
    if (!a || !b) return false;
    if (a.cfi && b.cfi) return a.cfi === b.cfi;
    if (a.type === "foliate" && b.type === "foliate" && a.index != null && b.index != null) return a.index === b.index && Math.abs((a.ratio || 0) - (b.ratio || 0)) < .01;
    return Math.abs((a.ratio || 0) - (b.ratio || 0)) < .006;
  }

  function updateHistoryButtons() {
    if (historyBackButton) historyBackButton.disabled = navigationHistoryIndex <= 0;
    if (historyForwardButton) historyForwardButton.disabled = navigationHistoryIndex < 0 || navigationHistoryIndex >= navigationHistory.length - 1;
  }

  function addHistoryPair(target) {
    const current = currentLocator();
    if (!current || !target) return;
    if (navigationHistoryIndex < navigationHistory.length - 1) navigationHistory.splice(navigationHistoryIndex + 1);
    const last = navigationHistory[navigationHistory.length - 1];
    if (!locatorsEqual(last, current)) navigationHistory.push(current);
    if (!locatorsEqual(navigationHistory[navigationHistory.length - 1], target)) navigationHistory.push(target);
    navigationHistory = navigationHistory.slice(-50);
    navigationHistoryIndex = navigationHistory.length - 1;
    updateHistoryButtons();
  }

  async function navigateToLocator(locator, { history = true, close = true } = {}) {
    if (!locator || !currentRecord) return;
    if (history && !suppressHistoryPush) addHistoryPair(locator);
    try {
      suppressHistoryPush = true;
      if (visualReaderActive) {
        const pageIndex = Number.isFinite(Number(locator.pageIndex))
          ? Number(locator.pageIndex)
          : Math.round((Number(locator.ratio) || 0) * Math.max(0, visualPages.length - 1));
        await goToVisualPage(pageIndex);
      } else if (currentFormat === "epub" && rendition) {
        if (locator.cfi) await rendition.display(locator.cfi);
        else if (locator.href) await rendition.display(locator.href);
        else if (Number.isFinite(locator.ratio) && locationsReady) {
          const cfi = epubBook.locations.cfiFromPercentage(locator.ratio);
          if (cfi) await rendition.display(cfi);
        }
      } else if (isFoliateActive()) {
        if (locator.cfi) await foliateView.goTo(locator.cfi);
        else if (Number.isFinite(locator.index)) await foliateView.goTo(locator.index);
        else if (Number.isFinite(locator.ratio) && foliateView.goToFraction) await foliateView.goToFraction(locator.ratio);
      } else if (!plain.hidden && Number.isFinite(locator.ratio)) {
        const max = Math.max(0, plain.scrollHeight - plain.clientHeight);
        plain.scrollTop = max * locator.ratio;
        syncPlainProgress();
      }
      if (close) closeDrawers();
    } catch (error) {
      console.warn("Navigation vers le repère impossible", error);
      showToast("Impossible d’atteindre ce repère.");
    } finally {
      suppressHistoryPush = false;
      updateHistoryButtons();
    }
  }

  async function historyMove(delta) {
    const nextIndex = navigationHistoryIndex + delta;
    if (nextIndex < 0 || nextIndex >= navigationHistory.length) return;
    navigationHistoryIndex = nextIndex;
    updateHistoryButtons();
    await navigateToLocator(navigationHistory[nextIndex], { history: false, close: false });
  }

  function chapterLabelFromEpubLocation(location) {
    const href = location?.start?.href;
    if (!href || !epubBook?.navigation) return "";
    try {
      const direct = epubBook.navigation.get(href) || epubBook.navigation.get(String(href).split("#")[0]);
      if (direct?.label) return direct.label;
      const clean = String(href).split("#")[0];
      const flat = [];
      const walk = (nodes) => (nodes || []).forEach((item) => { flat.push(item); if (item.subitems?.length) walk(item.subitems); });
      walk(epubBook.navigation.toc || []);
      const found = flat.find((item) => String(item.href || "").split("#")[0] === clean);
      return found?.label || "";
    } catch (_) { return ""; }
  }

  function pageIndexFromEpubCfi(cfi) {
    if (!locationsReady || !cfi || !epubBook?.locations?.length?.()) return null;
    try { return epubBook.locations.locationFromCfi(cfi); } catch (_) { return null; }
  }

  async function extractEpubText() {
    if (!epubBook?.spine) return "";
    const chunks = [];
    const sections = [];
    epubBook.spine.each((section) => sections.push(section));
    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      try {
        const doc = await section.load(epubBook.load.bind(epubBook));
        const text = doc?.body?.textContent || doc?.documentElement?.textContent || "";
        if (text.trim()) chunks.push(text.replace(/\s+/g, " ").trim());
      } catch (_) {}
      try { section.unload(); } catch (_) {}
      if (i % 5 === 4) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return chunks.join("\n\n");
  }

  async function extractFoliateText() {
    const sections = foliateBook?.sections || [];
    const chunks = [];
    for (let i = 0; i < sections.length; i += 1) {
      try {
        const doc = await sections[i].createDocument?.();
        const text = doc?.body?.textContent || doc?.documentElement?.textContent || "";
        if (text.trim()) chunks.push(text.replace(/\s+/g, " ").trim());
      } catch (_) {}
      if (i % 5 === 4) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return chunks.join("\n\n");
  }

  function chunkExcerpt(text, index, total) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    const ratio = total <= 1 ? 0 : index / (total - 1);
    const pos = Math.max(0, Math.min(clean.length - 1, Math.round(ratio * clean.length)));
    const start = Math.max(0, pos - 50);
    return truncateText(clean.slice(start, start + 320), 280);
  }

  function invalidatePageModels() {
    paginationRun += 1;
    pageModels = [];
    pageModelsBookId = "";
    pageModelsPromise = null;
  }

  async function refreshTextLayout() {
    if (!rendition) return;
    const active = rendition;
    const cfi = active.currentLocation()?.start?.cfi;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(async () => {
      if (active !== rendition) return;
      try {
        applyReadingSettings();
        const spread = epubSpreadMode();
        active.settings.gap = Math.max(32, Number(readerSettings.pageMargin) * 2);
        active.manager.settings.gap = active.settings.gap;
        active.spread(spread.spread, spread.min);
        active.resize(render.clientWidth, render.clientHeight);
        if (cfi) await active.display(cfi);
        if (!pagesDrawer.hidden) await renderPagesDrawer();
      } catch (error) { console.warn("Mise en page EPUB impossible", error); }
    }, 150);
  }

  async function setPageView(value) {
    if (!["auto", "single", "double"].includes(value)) return;
    readerSettings.pageView = value;
    saveSettings(readerSettings);
    if (currentRecord) {
      const data = currentReaderData(); data.pageView = value;
      saveReaderData(currentRecord.id, data);
    }
    syncSettingsControls();
    invalidatePageModels();
    if (visualReaderActive) {
      const currentPage = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
      buildVisualSpreads();
      await goToVisualPage(currentPage);
      if (!pagesDrawer.hidden) await renderPagesDrawer();
    } else if (rendition) refreshTextLayout();
  }

  async function buildPageModels(force = false) {
    if (!currentRecord) return [];
    if (force) invalidatePageModels();
    if (pageModelsBookId === currentRecord.id && pageModels.length) return pageModels;
    if (pageModelsPromise) return pageModelsPromise;
    const run = paginationRun;
    const id = currentRecord.id;
    const cancelled = () => run !== paginationRun || currentRecord?.id !== id;
    pageModelsPromise = (async () => {
      let models = [];
      if (pagesSummary) pagesSummary.textContent = "Préparation des miniatures…";
      if (visualReaderActive) {
        const total = visualPages.length;
        models = visualPages.map((page, index) => ({
          index, number: index + 1, total,
          ratio: total <= 1 ? 0 : index / (total - 1),
          kind: page.document ? "visual-document" : "visual-page",
          sectionIndex: index, size: page.size, pageSpread: page.pageSpread,
          wide: isVisualWide(page), title: `Page ${index + 1}`,
          locator: { type: "visual", pageIndex: index }
        }));
      } else if (currentFormat === "epub" && rendition && window.PhilosophalPagination) {
        const spread = epubSpreadMode();
        models = await window.PhilosophalPagination.build({
          blob: currentRecord.blob, width: render.clientWidth, height: render.clientHeight,
          options: { spread: spread.spread, minSpreadWidth: spread.min,
            gap: Math.max(32, Number(readerSettings.pageMargin) * 2) }, cancelled,
          configure(view) {
            ["paper", "white", "night", "sepia"].forEach(name => view.themes.register(`philosophal-${name}`, themeRules(name)));
            view.themes.select(`philosophal-${readerSettings.theme}`);
            view.themes.fontSize(`${readerSettings.fontSize * readerSettings.zoom / 100}%`);
            view.themes.override("line-height", String(readerSettings.lineHeight), true);
            view.themes.override("font-family", readerSettings.fontFamily === "sans" ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : 'Georgia, "Times New Roman", serif', true);
            view.hooks.content.register(contents => applyDocumentAdvancedSettings(contents.document, { paginated: true }));
          },
          onProgress(done, total, count) {
            if (!cancelled() && pagesSummary) pagesSummary.textContent = `Création des aperçus · ${done}/${total} sections · ${count} pages`;
          }
        });
      } else {
        const text = isFoliateActive() ? await extractFoliateText() : plain.textContent || "";
        const total = Math.max(1, Math.ceil(Math.max(text.length, 1) / 1200));
        models = Array.from({ length: total }, (_, index) => ({
          index, number: index + 1, total, kind: "text", excerpt: chunkExcerpt(text, index, total),
          ratio: total <= 1 ? 0 : index / (total - 1),
          locator: { type: isFoliateActive() ? "foliate" : "plain", ratio: total <= 1 ? 0 : index / (total - 1) }
        }));
      }
      if (cancelled()) return [];
      pageModels = models;
      pageModelsBookId = id;
      if (pagesSummary) {
        pagesSummary.textContent = visualReaderActive
          ? `${models.length} pages du livre · les pages affichées sont encadrées`
          : currentFormat === "epub"
            ? `${models.length} pages · recalculées selon l’écran, le zoom et la police${readerSettings.flow === "scrolled-doc" ? " · aperçus du mode paginé" : ""}`
            : `${models.length} repères de lecture · aperçus textuels`;
      }
      if (goPageInput) goPageInput.max = String(models.length);
      if (rendition) updateEpubProgress(rendition.currentLocation()?.start?.cfi, rendition.currentLocation());
      return models;
    })();
    const promise = pageModelsPromise;
    try { return await promise; }
    finally { if (pageModelsPromise === promise) pageModelsPromise = null; }
  }

  async function loadComicThumbnail(element, model) {
    if (!element || element.dataset.loaded === "1") return;
    const id = currentRecord?.id;
    element.dataset.loaded = "1";
    try {
      if (model.kind === "visual-document") {
        const url = await visualPages[model.sectionIndex].section.load();
        if (currentRecord?.id !== id || !element.isConnected) return;
        element.src = url;
        const fit = () => {
          const size = model.size || { width: 800, height: 1200 };
          const paper = element.parentElement;
          const factor = Math.min(paper.clientWidth / size.width, paper.clientHeight / size.height);
          element.style.width = `${size.width}px`; element.style.height = `${size.height}px`;
          element.style.transform = `scale(${factor})`;
        };
        element.addEventListener("load", fit, { once: true });
        fit();
      } else {
        const url = await visualThumbnailUrl(model.sectionIndex);
        if (currentRecord?.id !== id || !element.isConnected) return;
        if (url) element.src = url;
        else element.closest(".reader-page-thumb")?.classList.add("is-thumb-error");
      }
    } catch (_) { element.closest(".reader-page-thumb")?.classList.add("is-thumb-error"); }
  }

  function observeComicThumbnail(element, model) {
    if (!("IntersectionObserver" in window)) { loadComicThumbnail(element, model); return; }
    if (!comicThumbObserver) {
      comicThumbObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          comicThumbObserver.unobserve(entry.target);
          const model = pageModels[Number(entry.target.dataset.sectionIndex)];
          if (model) loadComicThumbnail(entry.target, model);
        });
      }, { root: pagesDrawer.querySelector(".reader-drawer-panel"), rootMargin: "160px" });
    }
    element.dataset.sectionIndex = String(model.sectionIndex);
    comicThumbObserver.observe(element);
  }

  function updateCurrentPageThumb() {
    if (!pageThumbs || !pageModels.length) return;
    let selected;
    if (visualReaderActive) selected = visualSpreads[visualSpreadIndex] || [];
    else if (rendition && pageModels[0]?.kind === "epub-page") {
      const loc = rendition.currentLocation();
      const first = window.PhilosophalPagination.indexAt(pageModels, loc?.start?.cfi);
      const last = window.PhilosophalPagination.indexAt(pageModels, loc?.end?.cfi);
      selected = Array.from({ length: Math.min(2, Math.max(1,last - first + 1)) }, (_, offset) => first + offset);
    } else selected = [Math.round(currentRatio * Math.max(0, pageModels.length - 1))];
    pageThumbs.querySelectorAll("[data-page-thumb]").forEach(card => {
      const active = selected.includes(Number(card.dataset.pageThumb));
      card.classList.toggle("is-current", active);
      card.querySelector(".reader-thumb-open")?.setAttribute("aria-current", active ? "page" : "false");
    });
    if (goPageInput && document.activeElement !== goPageInput) goPageInput.value = String(Math.max(0,selected[0] || 0) + 1);
  }

  async function renderPagesDrawer() {
    openDrawer(pagesDrawer);
    const id = currentRecord?.id;
    const run = paginationRun;
    comicThumbObserver?.disconnect(); comicThumbObserver = null;
    pageThumbs.innerHTML = "";
    pageThumbs.setAttribute("aria-busy", "true");
    let models;
    try { models = await buildPageModels(); }
    catch (error) {
      console.warn("Miniatures indisponibles", error);
      pagesSummary.textContent = "Impossible de préparer les aperçus. Fermez ce panneau et réessayez.";
      pageThumbs.setAttribute("aria-busy", "false");
      return;
    }
    if (currentRecord?.id !== id || run !== paginationRun || pagesDrawer.hidden) return;
    pageThumbs.setAttribute("aria-busy", "false");
    pagesEmpty.hidden = models.length > 0;
    const fragment = document.createDocumentFragment();
    models.forEach(model => {
      const card = document.createElement("div");
      card.className = "reader-page-thumb";
      card.dataset.pageThumb = String(model.index);
      card.style.setProperty("--thumb-size", `${Number(thumbSizeInput.value)}px`);
      const open = document.createElement("button");
      open.type = "button"; open.className = "reader-thumb-open";
      open.setAttribute("aria-label", `Ouvrir la page ${model.number}`);
      const visual = ["visual-page", "visual-document", "epub-page"].includes(model.kind);
      const content = model.kind === "visual-document"
        ? `<iframe title="Miniature de la page ${model.number}" loading="lazy" sandbox="allow-same-origin" tabindex="-1" aria-hidden="true"></iframe>`
        : model.kind === "visual-page"
          ? `<img alt="Miniature de la page ${model.number}" loading="lazy">`
          : model.thumbUrl ? `<img src="${esc(model.thumbUrl)}" alt="Miniature de la page ${model.number}" loading="lazy">`
            : `<em>${esc(model.excerpt || "Page " + model.number)}</em>`;
      open.innerHTML = `<span class="reader-page-thumb-paper${visual ? " reader-page-thumb-comic" : ""}">${content}</span><span class="reader-thumb-caption"><strong>${model.number}</strong><small>${model.wide ? "Panoramique" : ""}</small></span>`;
      if (model.wide) card.classList.add("is-wide-page");
      card.appendChild(open);
      open.addEventListener("click", () => navigateToLocator(model.locator));
      if (visualReaderActive) {
        const label = document.createElement("label"); label.className = "reader-pair-select";
        label.title = `Sélectionner la page ${model.number} pour une double page`;
        const check = document.createElement("input"); check.type = "checkbox";
        check.dataset.pairSelect = String(model.index);
        check.setAttribute("aria-label", label.title);
        label.appendChild(check); card.appendChild(label);
        check.addEventListener("change", () => {
          if (!check.checked) spreadPairSelection.delete(model.index);
          else {
            if (spreadPairSelection.size >= 2) spreadPairSelection.clear();
            spreadPairSelection.add(model.index);
          }
          refreshSpreadLocker();
        });
        requestAnimationFrame(() => observeComicThumbnail(open.querySelector("img,iframe"), model));
      }
      fragment.appendChild(card);
    });
    pageThumbs.replaceChildren(fragment);
    refreshSpreadLocker(); updateCurrentPageThumb();
    pageThumbs.querySelector(".is-current")?.scrollIntoView({ block: "center" });
  }

  async function goToVirtualPage(number) {
    const models = await buildPageModels();
    const index = Math.max(0, Math.min(models.length - 1, Math.round(Number(number) || 1) - 1));
    if (models[index]) await navigateToLocator(models[index].locator);
  }

  function searchExcerpt(text, start, query) {
    const left = Math.max(0, start - 90), right = Math.min(text.length, start + query.length + 140);
    return truncateText(text.slice(left, right).replace(/\s+/g, " "), 250);
  }

  async function searchInCurrentBook(query) {
    const q = String(query || "").trim();
    if (q.length < 2 || !currentRecord) return [];
    if (currentFormat === "cbz") return [];
    const runId = ++searchRunId;
    const results = [];
    const lowerQ = q.toLocaleLowerCase("fr");
    const push = (entry) => { if (results.length < 150) results.push(entry); };

    if (currentFormat === "epub" && epubBook?.spine) {
      const sections = []; epubBook.spine.each((section) => sections.push(section));
      for (let i = 0; i < sections.length && results.length < 150; i += 1) {
        if (runId !== searchRunId) return [];
        const section = sections[i];
        try {
          await section.load(epubBook.load.bind(epubBook));
          const matches = section.find(q) || [];
          matches.slice(0, 25).forEach((match) => push({
            label: `Résultat ${results.length + 1}`,
            excerpt: match.excerpt || q,
            locator: { type: "epub", cfi: match.cfi, ratio: currentRatio }
          }));
        } catch (_) {}
        try { section.unload(); } catch (_) {}
        if (i % 4 === 3) await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else if (isFoliateActive() && foliateBook?.sections) {
      const sections = foliateBook.sections;
      for (let i = 0; i < sections.length && results.length < 150; i += 1) {
        if (runId !== searchRunId) return [];
        try {
          const doc = await sections[i].createDocument?.();
          const text = (doc?.body?.textContent || doc?.documentElement?.textContent || "").replace(/\s+/g, " ");
          const lower = text.toLocaleLowerCase("fr");
          let at = 0, local = 0;
          while ((at = lower.indexOf(lowerQ, at)) >= 0 && local < 20 && results.length < 150) {
            push({
              label: `Section ${i + 1}`,
              excerpt: searchExcerpt(text, at, q),
              locator: { type: "foliate", index: i, ratio: sections.length <= 1 ? 0 : i / (sections.length - 1) }
            });
            at += Math.max(1, q.length); local += 1;
          }
        } catch (_) {}
        if (i % 4 === 3) await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else if (!plain.hidden) {
      const text = plain.textContent || "", lower = text.toLocaleLowerCase("fr");
      let at = 0;
      while ((at = lower.indexOf(lowerQ, at)) >= 0 && results.length < 150) {
        push({
          label: `≈ ${Math.round(at / Math.max(1, text.length) * 100)} %`,
          excerpt: searchExcerpt(text, at, q),
          locator: { type: "plain", ratio: at / Math.max(1, text.length) }
        });
        at += Math.max(1, q.length);
      }
    }
    return results;
  }

  async function runBookSearch() {
    const query = bookSearchInput?.value?.trim() || "";
    if (query.length < 2) {
      searchStatus.textContent = "Saisis au moins 2 caractères.";
      searchResults.innerHTML = "";
      return;
    }
    searchStatus.textContent = "Recherche en cours…";
    searchResults.innerHTML = "";
    const results = await searchInCurrentBook(query);
    searchStatus.textContent = currentFormat === "cbz"
      ? "Un CBZ contient principalement des images : aucune recherche textuelle n’est possible sans OCR."
      : (epubFoliateMode && !results.length)
        ? "Aucun texte exploitable trouvé dans cet EPUB illustré. Les pages constituées uniquement d’images nécessitent un OCR pour être recherchées."
        : `${results.length} résultat${results.length > 1 ? "s" : ""}${results.length >= 150 ? " (limite atteinte)" : ""}.`;
    results.forEach((result, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reader-search-result";
      button.innerHTML = `<span>${esc(result.label || `Résultat ${index + 1}`)}</span><strong>${esc(result.excerpt || query)}</strong>`;
      button.addEventListener("click", () => navigateToLocator(result.locator));
      searchResults.appendChild(button);
    });
  }

  function defaultBookmarkLabel() {
    const models = pageModels.length ? pageModels : null;
    const page = models ? Math.round(currentRatio * Math.max(0, models.length - 1)) + 1 : null;
    return currentChapterLabel || (page ? `Page ${page}` : `${Math.round(currentRatio * 100)} %`);
  }

  async function addBookmark() {
    if (!currentRecord) return;
    const locator = currentLocator();
    const label = prompt("Nom du marque-page :", defaultBookmarkLabel());
    if (label == null) return;
    const data = currentReaderData();
    data.bookmarks.unshift({
      id: uid("bookmark"),
      label: label.trim() || defaultBookmarkLabel(),
      locator,
      chapter: currentChapterLabel || "",
      progress: currentRatio,
      createdAt: Date.now()
    });
    saveReaderData(currentRecord.id, data);
    renderBookmarks();
    showToast("Marque-page ajouté.");
  }

  function renderBookmarks() {
    if (!currentRecord) return;
    const data = currentReaderData();
    bookmarksList.innerHTML = "";
    bookmarksEmpty.hidden = data.bookmarks.length > 0;
    data.bookmarks.forEach((bookmark) => {
      const row = document.createElement("article");
      row.className = "reader-saved-item";
      row.innerHTML = `<button type="button" class="reader-saved-open"><strong>${esc(bookmark.label)}</strong><small>${esc(bookmark.chapter || "")}${bookmark.chapter ? " · " : ""}${Math.round((bookmark.progress || 0) * 100)} %</small></button><div><button type="button" data-rename>✎</button><button type="button" data-delete>×</button></div>`;
      $(".reader-saved-open", row).addEventListener("click", () => navigateToLocator(bookmark.locator));
      $("[data-rename]", row).addEventListener("click", () => {
        const value = prompt("Renommer ce marque-page :", bookmark.label);
        if (value == null) return;
        bookmark.label = value.trim() || bookmark.label;
        saveReaderData(currentRecord.id, data); renderBookmarks();
      });
      $("[data-delete]", row).addEventListener("click", () => {
        data.bookmarks = data.bookmarks.filter((x) => x.id !== bookmark.id);
        saveReaderData(currentRecord.id, data); renderBookmarks();
      });
      bookmarksList.appendChild(row);
    });
  }

  function captureSelection(doc, contents = null) {
    const selection = doc?.getSelection?.();
    const text = selection?.toString?.().replace(/\s+/g, " ").trim() || "";
    if (!text || text.length < 2) return null;
    let cfi = null;
    try {
      if (contents?.cfiFromRange && selection.rangeCount) cfi = contents.cfiFromRange(selection.getRangeAt(0));
    } catch (_) {}
    return {
      text: truncateText(text, 1200),
      cfi,
      locator: cfi ? { type: "epub", cfi, ratio: currentRatio } : currentLocator(),
      chapter: currentChapterLabel || "",
      progress: currentRatio
    };
  }

  function showSelectionTools(selection) {
    if (!selectionTools || !selection?.text) return;
    lastSelection = selection;
    selectionTools.hidden = false;
  }

  function hideSelectionTools() {
    if (selectionTools) selectionTools.hidden = true;
  }

  function attachSelectionHandlers(doc, contents = null) {
    if (!doc?.documentElement || doc.documentElement.dataset.philosophalSelectionBound === "1") return;
    doc.documentElement.dataset.philosophalSelectionBound = "1";
    const handler = () => {
      setTimeout(() => {
        const selection = captureSelection(doc, contents);
        if (selection) showSelectionTools(selection);
      }, 0);
    };
    doc.addEventListener("mouseup", handler, { passive: true });
    doc.addEventListener("touchend", handler, { passive: true });
    doc.addEventListener("dblclick", handler, { passive: true });
    doc.addEventListener("keydown", event => {
      if (event.target?.closest?.("input,textarea,select,[contenteditable='true']")) return;
      const forwarded = new KeyboardEvent("keydown", {
        key: event.key, code: event.code, ctrlKey: event.ctrlKey, metaKey: event.metaKey,
        altKey: event.altKey, shiftKey: event.shiftKey, repeat: event.repeat,
        bubbles: true, cancelable: true
      });
      if (!document.dispatchEvent(forwarded)) event.preventDefault();
    }, true);
  }

  function attachPlainSelectionHandlers() {
    if (!plain || plain.dataset.selectionBound === "1") return;
    plain.dataset.selectionBound = "1";
    const handler = () => {
      setTimeout(() => {
        const selection = window.getSelection?.();
        const text = selection?.toString?.().replace(/\s+/g, " ").trim() || "";
        if (!text || !selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        if (!plain.contains(range.commonAncestorContainer)) return;
        showSelectionTools({
          text: truncateText(text, 1200),
          cfi: null,
          locator: currentLocator(),
          chapter: currentChapterLabel || "",
          progress: currentRatio
        });
      }, 0);
    };
    plain.addEventListener("mouseup", handler, { passive: true });
    plain.addEventListener("touchend", handler, { passive: true });
    plain.addEventListener("dblclick", handler, { passive: true });
  }

  function wrapFirstTextMatchInRoot(root, excerpt, noteId) {
    if (!root || !excerpt) return false;
    const needle = String(excerpt).replace(/\s+/g, " ").trim();
    if (needle.length < 2) return false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    const first = needle.slice(0, Math.min(needle.length, 80));
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || "";
      const at = value.indexOf(first);
      if (at < 0) continue;
      const range = document.createRange();
      range.setStart(node, at);
      range.setEnd(node, Math.min(value.length, at + first.length));
      const mark = document.createElement("mark");
      mark.className = "philosophal-reader-highlight";
      mark.dataset.noteId = noteId;
      try { range.surroundContents(mark); return true; } catch (_) { return false; }
    }
    return false;
  }

  function restorePlainHighlights() {
    if (!currentRecord || plain.hidden) return;
    const notes = currentReaderData().notes.filter((n) => n.kind === "highlight" && !n.cfi && n.excerpt);
    notes.forEach((note) => {
      if (plain.querySelector(`[data-note-id="${CSS.escape(note.id)}"]`)) return;
      wrapFirstTextMatchInRoot(plain, note.excerpt, note.id);
    });
  }

  function wrapFirstTextMatch(doc, excerpt, noteId) {
    if (!doc?.body || !excerpt) return false;
    const needle = String(excerpt).replace(/\s+/g, " ").trim();
    if (needle.length < 2) return false;
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    let node;
    const first = needle.slice(0, Math.min(needle.length, 80));
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || "";
      const at = value.indexOf(first);
      if (at < 0) continue;
      const range = doc.createRange();
      range.setStart(node, at);
      range.setEnd(node, Math.min(value.length, at + first.length));
      const mark = doc.createElement("mark");
      mark.className = "philosophal-reader-highlight";
      mark.dataset.noteId = noteId;
      try { range.surroundContents(mark); return true; } catch (_) { return false; }
    }
    return false;
  }

  function restoreExcerptHighlights(doc) {
    if (!currentRecord || !doc?.body) return;
    const notes = currentReaderData().notes.filter((n) => n.kind === "highlight" && !n.cfi && n.excerpt);
    notes.forEach((note) => {
      if (doc.querySelector(`[data-note-id="${CSS.escape(note.id)}"]`)) return;
      wrapFirstTextMatch(doc, note.excerpt, note.id);
    });
  }

  function restoreEpubAnnotations() {
    if (!rendition || !currentRecord) return;
    const notes = currentReaderData().notes.filter((n) => n.kind === "highlight" && n.cfi);
    notes.forEach((note) => {
      try {
        rendition.annotations.remove(note.cfi, "highlight");
        rendition.annotations.add("highlight", note.cfi, { noteId: note.id }, null, "philosophal-reader-highlight", {
          fill: "#eadb79",
          "fill-opacity": "0.55",
          "mix-blend-mode": "multiply"
        });
      } catch (_) {}
    });
  }

  async function addSelectionHighlight(withComment = false) {
    if (!currentRecord || !lastSelection?.text) return;
    const comment = withComment ? prompt("Votre note :", "") : "";
    if (withComment && comment == null) return;
    const data = currentReaderData();
    const note = {
      id: uid("note"),
      kind: "highlight",
      excerpt: lastSelection.text,
      comment: String(comment || "").trim(),
      cfi: lastSelection.cfi || null,
      locator: lastSelection.locator || currentLocator(),
      chapter: lastSelection.chapter || currentChapterLabel || "",
      progress: lastSelection.progress ?? currentRatio,
      createdAt: Date.now()
    };
    data.notes.unshift(note);
    saveReaderData(currentRecord.id, data);
    if (note.cfi && rendition) restoreEpubAnnotations();
    else {
      try {
        if (!plain.hidden) wrapFirstTextMatchInRoot(plain, note.excerpt, note.id);
        foliateView?.renderer?.getContents?.().forEach(({ doc }) => wrapFirstTextMatch(doc, note.excerpt, note.id));
      } catch (_) {}
    }
    hideSelectionTools();
    renderNotes();
    showToast(withComment ? "Note et surlignage enregistrés." : "Passage surligné.");
  }

  async function addCurrentNote() {
    if (!currentRecord) return;
    const comment = prompt("Note à propos de cette position :", "");
    if (comment == null || !comment.trim()) return;
    const data = currentReaderData();
    data.notes.unshift({
      id: uid("note"),
      kind: "note",
      excerpt: "",
      comment: comment.trim(),
      locator: currentLocator(),
      chapter: currentChapterLabel || "",
      progress: currentRatio,
      createdAt: Date.now()
    });
    saveReaderData(currentRecord.id, data);
    renderNotes();
    showToast("Note enregistrée.");
  }

  function renderNotes() {
    if (!currentRecord) return;
    const data = currentReaderData();
    notesList.innerHTML = "";
    notesEmpty.hidden = data.notes.length > 0;
    data.notes.forEach((note) => {
      const row = document.createElement("article");
      row.className = "reader-note-item";
      row.innerHTML = `<button type="button" class="reader-note-open"><span>${note.kind === "highlight" ? "Surlignage" : "Note"} · ${Math.round((note.progress || 0) * 100)} %</span>${note.excerpt ? `<blockquote>${esc(note.excerpt)}</blockquote>` : ""}${note.comment ? `<p>${esc(note.comment)}</p>` : ""}<small>${esc(note.chapter || "")}</small></button><div><button type="button" data-cite title="Copier la citation">❝</button><button type="button" data-edit title="Modifier">✎</button><button type="button" data-delete title="Supprimer">×</button></div>`;
      $(".reader-note-open", row).addEventListener("click", () => navigateToLocator(note.locator));
      $("[data-cite]", row).addEventListener("click", () => copyCitation(note));
      $("[data-edit]", row).addEventListener("click", () => {
        const value = prompt("Modifier la note :", note.comment || "");
        if (value == null) return;
        note.comment = value.trim(); saveReaderData(currentRecord.id, data); renderNotes();
      });
      $("[data-delete]", row).addEventListener("click", () => {
        if (note.cfi && rendition) { try { rendition.annotations.remove(note.cfi, "highlight"); } catch (_) {} }
        data.notes = data.notes.filter((x) => x.id !== note.id);
        saveReaderData(currentRecord.id, data); renderNotes();
      });
      notesList.appendChild(row);
    });
  }

  function citationText(item = lastSelection) {
    const quote = item?.text || item?.excerpt || "";
    const title = currentRecord?.title || Books.titleFromName(currentRecord?.name || "") || "Livre";
    const author = currentRecord?.author || "";
    const chapter = item?.chapter || currentChapterLabel || "";
    const source = [author, title, chapter].filter(Boolean).join(", ");
    return quote ? `« ${quote} »${source ? ` — ${source}` : ""}` : source;
  }

  async function copyCitation(item = lastSelection) {
    const value = citationText(item);
    if (!value) return;
    try { await navigator.clipboard.writeText(value); showToast("Citation copiée."); }
    catch (_) { showToast("Impossible de copier automatiquement la citation."); }
  }

  function exportNotes(format = "md") {
    if (!currentRecord) return;
    const data = currentReaderData(), title = currentRecord.title || Books.titleFromName(currentRecord.name), author = currentRecord.author || "";
    let text = format === "md" ? `# Notes — ${title}\n\n${author ? `**${author}**\n\n` : ""}` : `NOTES — ${title}\n${author ? `${author}\n` : ""}\n`;
    data.notes.forEach((note) => {
      const place = [note.chapter, `${Math.round((note.progress || 0) * 100)} %`].filter(Boolean).join(" · ");
      if (format === "md") {
        text += `## ${note.kind === "highlight" ? "Surlignage" : "Note"}${place ? ` — ${place}` : ""}\n\n`;
        if (note.excerpt) text += `> ${note.excerpt.replace(/\n/g, "\n> ")}\n\n`;
        if (note.comment) text += `${note.comment}\n\n`;
      } else {
        text += `--- ${note.kind === "highlight" ? "SURLIGNAGE" : "NOTE"}${place ? ` · ${place}` : ""} ---\n`;
        if (note.excerpt) text += `${note.excerpt}\n`;
        if (note.comment) text += `${note.comment}\n`;
        text += "\n";
      }
    });
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${String(title).replace(/[\\/:*?"<>|]+/g, "-")}-notes.${format === "md" ? "md" : "txt"}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function openDictionaryFor(text) {
    const term = String(text || "").trim().split(/\s+/).slice(0, 5).join(" ");
    const button = document.querySelector(".fv-tools-dictionary");
    if (!button) { showToast("Le dictionnaire global n’est pas encore disponible."); return; }
    button.click();
    setTimeout(() => {
      const input = document.querySelector("[data-fv-dict-search]");
      if (!input) return;
      input.value = term;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }, 120);
    hideSelectionTools();
  }

  function safeSelectionTerm() {
    const text = lastSelection?.text || "";
    return text.length <= 80 ? text : text.split(/\s+/).slice(0, 4).join(" ");
  }

  function toggleReaderUi() {
    readerUiHidden = !readerUiHidden;
    document.body.classList.toggle("reader-ui-hidden", readerUiHidden);
  }

  function wireImportButtons() {
    $('[data-open-example]')?.addEventListener('click',()=>{const text="# Lire à son rythme\n\nUn livre peut ouvrir une question avant d’apporter une réponse. Prenez le temps de lire, puis de revenir sur une phrase.\n\n## Une idée à suivre\n\nCe lecteur vous permet de changer la taille du texte, de choisir un thème et de garder votre place.\n\n## Quelques repères\n\n- Ouvrez le sommaire pour changer de partie.\n- Ajoutez un marque-page à un passage.\n- Sélectionnez une phrase pour la surligner et prendre une note.\n\n## Une question pour continuer\n\nQu’est-ce qui change dans notre manière de penser quand nous prenons le temps de lire ?";importFile(new File([text],'Découvrir le lecteur.md',{type:'text/markdown',lastModified:0}));});
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
      else showToast("Format non pris en charge : EPUB, AZW3, MOBI, CBZ, TXT, HTML, Markdown, FB2, DOCX ou ODT.");
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
    zoomButtons.out?.addEventListener("click", () => setZoom(readerSettings.zoom - 10));
    zoomButtons.in?.addEventListener("click", () => setZoom(readerSettings.zoom + 10));
    quickPageView?.addEventListener("change", () => setPageView(quickPageView.value));
    spreadStartInput?.addEventListener("change", async () => {
      if (!visualReaderActive) return;
      const currentPage = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
      const data = currentReaderData(); data.spreadStart = spreadStartInput.value;
      saveReaderData(currentRecord.id, data);
      buildVisualSpreads(); await goToVisualPage(currentPage);
      refreshSpreadLocker();
    });

    progress?.addEventListener("change", () => seek(progress.value));
    progress?.addEventListener("input", () => { progressLabel.textContent = `${Math.round(Number(progress.value) / 10)} %`; });

    $$('[data-open-library]').forEach((button) => button.addEventListener("click", async () => { await refreshLibrary(); openDrawer(libraryDrawer); }));
    $("[data-open-toc]")?.addEventListener("click", () => openDrawer(tocDrawer));
    $("[data-open-pages]")?.addEventListener("click", renderPagesDrawer);
    $("[data-open-search]")?.addEventListener("click", () => { openDrawer(searchDrawer); setTimeout(() => bookSearchInput?.focus(), 30); });
    $("[data-open-bookmarks]")?.addEventListener("click", () => { renderBookmarks(); openDrawer(bookmarksDrawer); });
    $("[data-open-notes]")?.addEventListener("click", () => { renderNotes(); openDrawer(notesDrawer); });
    $("[data-open-shortcuts]")?.addEventListener("click", () => openDrawer(shortcutsDrawer));

    $$('[data-close-drawers]').forEach((button) => button.addEventListener("click", closeDrawers));
    settingsToggle?.addEventListener("click", () => setSettingsOpen(settingsPanel.hidden));
    focusButtons.forEach((button) => button.addEventListener("click", () => applyFocusMode(!document.body.classList.contains("reader-focus"))));

    $("[data-add-bookmark]")?.addEventListener("click", addBookmark);
    $("[data-add-bookmark-drawer]")?.addEventListener("click", addBookmark);
    $("[data-note-current]")?.addEventListener("click", addCurrentNote);
    $$("[data-export-notes]").forEach((button) => button.addEventListener("click", () => exportNotes(button.dataset.exportNotes)));

    $("[data-run-search]")?.addEventListener("click", runBookSearch);
    bookSearchInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); runBookSearch(); }
    });

    thumbSizeInput?.addEventListener("input", () => {
      pageThumbs.style.setProperty("--thumb-size", `${thumbSizeInput.value}px`);
      pageThumbs?.querySelectorAll(".reader-page-thumb").forEach((button) => button.style.setProperty("--thumb-size", `${thumbSizeInput.value}px`));
      pageThumbs.querySelectorAll("iframe").forEach(frame => {
        const model = pageModels[Number(frame.closest("[data-page-thumb]").dataset.pageThumb)];
        if (model?.size) frame.style.transform = `scale(${Math.min(frame.parentElement.clientWidth/model.size.width,frame.parentElement.clientHeight/model.size.height)})`;
      });
    });
    $("[data-go-page-button]")?.addEventListener("click", () => goToVirtualPage(goPageInput?.value));
    goPageInput?.addEventListener("keydown", (event) => { if (event.key === "Enter") goToVirtualPage(goPageInput.value); });
    lockSpreadButton?.addEventListener("click", lockSelectedSpread);
    unlockSpreadButton?.addEventListener("click", unlockSelectedSpread);
    clearSpreadLocksButton?.addEventListener("click", async () => {
      if (!visualReaderActive) return;
      const currentPage = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
      saveSpreadPairs([]);
      spreadPairSelection.clear();
      buildVisualSpreads();
      refreshSpreadLocker();
      await goToVisualPage(currentPage);
      showToast("Verrouillages de doubles pages réinitialisés.");
    });

    historyBackButton?.addEventListener("click", () => historyMove(-1));
    historyForwardButton?.addEventListener("click", () => historyMove(1));

    $("[data-selection-highlight]")?.addEventListener("click", () => addSelectionHighlight(false));
    $("[data-selection-note]")?.addEventListener("click", () => addSelectionHighlight(true));
    $("[data-selection-cite]")?.addEventListener("click", () => { copyCitation(lastSelection); hideSelectionTools(); });
    $("[data-selection-dictionary]")?.addEventListener("click", () => openDictionaryFor(safeSelectionTerm()));
    $("[data-selection-close]")?.addEventListener("click", hideSelectionTools);

    $("[data-fullscreen]")?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) { showToast("Le plein écran n’est pas disponible ici."); }
    });

    Object.entries(settingsInputs).forEach(([key, input]) => {
      const eventName = input?.tagName === "INPUT" ? "input" : "change";
      input?.addEventListener(eventName, async () => {
        if (key === "pageView") { await setPageView(input.value); return; }
        if (key === "zoom") { setZoom(Number(input.value), { announce: false }); return; }
        const numeric = new Set(["zoom","fontSize","lineHeight","brightness","pageMargin","paragraphSpace"]);
        const value = numeric.has(key) ? Number(input.value) : input.value;
        readerSettings = { ...readerSettings, [key]: value };
        saveSettings(readerSettings);
        const affectsLayout = ["fontSize","fontFamily","lineHeight","textWidth","pageMargin","paragraphSpace","textAlign","flow","theme"].includes(key);
        if (affectsLayout) invalidatePageModels();
        if (visualReaderActive && (key === "pageView" || key === "comicDirection")) {
          const currentPage = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
          buildVisualSpreads();
          await goToVisualPage(currentPage);
          if (!pagesDrawer.hidden) await renderPagesDrawer();
        } else if (key === "flow") {
          await applyFlowSetting(value); refreshTextLayout();
        }
        else if (key === "pageView") await applyPageViewSetting(value);
        else if (key === "comicDirection" && currentFormat === "cbz") {
          showToast("Sens de lecture mis à jour.");
        } else if (rendition && affectsLayout) refreshTextLayout();
        else applyReadingSettings();
        if (key === "comicDirection" && currentRecord) {
          const data = currentReaderData(); data.direction = value; saveReaderData(currentRecord.id, data);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!settingsPanel.hidden && !settingsPanel.contains(event.target) && !settingsToggle.contains(event.target)) setSettingsOpen(false);
      if (!selectionTools?.hidden && !selectionTools.contains(event.target) && !event.target.closest?.(".reader-note-item")) {
        // Ne pas fermer instantanément lorsqu'un iframe vient de produire la sélection.
        if (event.target === document.body || event.target.closest?.(".reader-topbar,.reader-progressbar")) hideSelectionTools();
      }
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isField = target && /input|textarea|select/i.test(target.tagName);
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawers();
        setSettingsOpen(false);
        hideSelectionTools();
        if (document.body.classList.contains("reader-focus")) applyFocusMode(false);
        return;
      }
      if (isField || workspace.hidden || !currentRecord || [libraryDrawer,tocDrawer,pagesDrawer,searchDrawer,bookmarksDrawer,notesDrawer,shortcutsDrawer].some(item=>item&&!item.hidden) || target.closest?.("button,a,summary")) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() !== "f") return;
      if ((event.shiftKey || event.altKey) && /^Arrow/.test(event.key)) return;
      if (!pagesDrawer.hidden && !["Escape", "p", "P"].includes(event.key)) return;

      const key = event.key.toLowerCase();
      let handled = true;
      if ((event.ctrlKey || event.metaKey) && key === "f") {
        openDrawer(searchDrawer); setTimeout(() => bookSearchInput?.focus(), 30);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") previous();
      else if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") next();
      else if (event.key === "ArrowUp") jumpPages(10);
      else if (event.key === "ArrowDown") jumpPages(-10);
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "+" || event.key === "=")) setZoom(readerSettings.zoom + 10);
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === "-") setZoom(readerSettings.zoom - 10);
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "s") openDrawer(tocDrawer);
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "p") renderPagesDrawer();
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "f") { openDrawer(searchDrawer); setTimeout(() => bookSearchInput?.focus(), 30); }
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "m") addBookmark();
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "n") { renderNotes(); openDrawer(notesDrawer); }
      else if (event.key === "?") openDrawer(shortcutsDrawer);
      else handled = false;

      if (handled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    let touchStart = null;
    const stage = $("[data-stage]");
    stage?.addEventListener("touchstart", (event) => {
      const touch = event.touches?.[0];
      touchStart = touch ? { x: touch.clientX, y: touch.clientY, time: Date.now() } : null;
    }, { passive: true });
    stage?.addEventListener("touchend", (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches?.[0];
      const endX = touch?.clientX ?? touchStart.x;
      const endY = touch?.clientY ?? touchStart.y;
      const dx = endX - touchStart.x, dy = endY - touchStart.y, dt = Date.now() - touchStart.time;
      touchStart = null;
      if (Number(readerSettings.zoom) > 100 || document.querySelector("[data-selection-tools]:not([hidden])")) return;

      if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) previous(); else next();
        return;
      }

      if (window.innerWidth > 820 || dt > 450 || Math.abs(dx) > 18 || Math.abs(dy) > 18) return;
      const sel = window.getSelection?.()?.toString?.().trim();
      if (sel) return;
      const target = event.target;
      if (target?.closest?.("button,a,input,select,textarea,.reader-selection-tools")) return;
      const rect = stage.getBoundingClientRect(), localX = endX - rect.left;
      if (localX < rect.width * .30) previous();
      else if (localX > rect.width * .70) next();
      else toggleReaderUi();
    }, { passive: true });

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => {
        invalidatePageModels();
        if (visualReaderActive) {
          const page = visualSpreads[visualSpreadIndex]?.[0] ?? 0;
          buildVisualSpreads(); await goToVisualPage(page);
          applyVisualZoom();
          if (!pagesDrawer.hidden) await renderPagesDrawer();
          return;
        }
        if (!rendition || currentFormat !== "epub" || pageTurnBusy) return;
        const cfi = rendition.currentLocation?.()?.start?.cfi || null;
        try {
          pageTurnBusy = true;
          const width = Math.max(320, render.clientWidth);
          const height = Math.max(320, render.clientHeight);
          rendition.resize(width, height);
          const spreadMode = epubSpreadMode();
          rendition.spread(readerSettings.flow === "paginated" || epubFixedLayout ? spreadMode.spread : "none", spreadMode.min);
          if (cfi) await rendition.display(cfi);
        } catch (_) {} finally {
          pageTurnBusy = false;
        }
      }, 180);
    }, { passive: true });
  }

  async function init() {
    if ("ResizeObserver" in window) {
      const bar = $(".reader-topbar");
      new ResizeObserver(() => document.documentElement.style.setProperty("--reader-topbar-height", `${bar.getBoundingClientRect().height}px`)).observe(bar);
    }
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


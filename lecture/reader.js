(() => {
  "use strict";

  const LIBRARY = Array.isArray(window.FV_LIBRARY) ? window.FV_LIBRARY : [];
  if (!LIBRARY.length) return;

  const BOOK_CACHE = new Map();
  const STORE_KEY = "fv-reader-data-v2";
  const STACK_KEY = "fv-reader-stack-v1";
  const THEMES = ["paper", "sepia", "night"];
  const REVIEW_INTERVALS = {
    hard: [1, 1, 2, 3, 5, 8, 13],
    good: [3, 7, 14, 30, 60, 120],
    easy: [7, 14, 30, 60, 120, 240],
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    app: $("reader-app"), paper: $("reader-paper"),
    title: $("book-title"), author: $("book-author"), authorSelect: $("author-select"), bookSelect: $("book-select"),
    drawerToggle: $("drawer-toggle"), drawer: $("reader-drawer"), drawerClose: $("drawer-close"), drawerBackdrop: $("drawer-backdrop"), drawerTabs: $("drawer-tabs"),
    tocList: $("toc-list"), bookMap: $("book-map"), libraryGrid: $("library-grid"), libraryAuthorFilter: $("library-author-filter"),
    bookNote: $("book-note"), chapterSummary: $("chapter-summary"), copyDeepLink: $("copy-deep-link"),
    extractScope: $("extract-scope"), tagFilter: $("tag-filter"), tagCloud: $("tag-cloud"), extractList: $("extract-list"),
    reviewList: $("review-list"), stackList: $("stack-list"), statsSummary: $("stats-summary"), historyList: $("history-list"), goalMinutes: $("goal-minutes"), goalPages: $("goal-pages"),
    fontFamily: $("font-family"), fontSize: $("font-size"), lineHeight: $("line-height"), textWidth: $("text-width"), readingSpeed: $("reading-speed"), textOnly: $("text-only"), citationFormat: $("citation-format"), fullscreenButton: $("fullscreen-button"), backupButton: $("backup-button"), restoreInput: $("restore-input"),
    searchToggle: $("search-toggle"), searchPanel: $("search-panel"), searchScope: $("search-scope"), searchInput: $("search-input"), searchPrev: $("search-prev"), searchNext: $("search-next"), searchClear: $("search-clear"), searchResults: $("search-results"),
    trailBack: $("trail-back"), trailForward: $("trail-forward"), bookmarkToggle: $("bookmark-toggle"), focusToggle: $("focus-toggle"), themeToggle: $("theme-toggle"), focusReturn: $("focus-return"),
    content: $("page-content"), scroll: $("page-scroll"), pageNumber: $("page-number"), progressText: $("progress-text"), chapterTime: $("chapter-time"),
    chapterSelect: $("chapter-select"), pageLabel: $("page-label"), pageInput: $("page-input"), pageTotal: $("page-total"), progress: $("progress-range"), chapterTicks: $("chapter-ticks"), prev: $("prev-page"), next: $("next-page"), prevEdge: $("prev-edge"), nextEdge: $("next-edge"),
    comparePane: $("compare-pane"), compareContent: $("compare-content"), compareClose: $("compare-close"),
    selectionToolbar: $("selection-toolbar"),
    annotationDialog: $("annotation-dialog"), annotationForm: $("annotation-form"), annotationQuote: $("annotation-quote"), annotationColor: $("annotation-color"), annotationNote: $("annotation-note"), annotationTags: $("annotation-tags"), annotationReview: $("annotation-review"), annotationLinkBook: $("annotation-link-book"), annotationLinkPage: $("annotation-link-page"), annotationDelete: $("annotation-delete"),
    bookmarkDialog: $("bookmark-dialog"), bookmarkForm: $("bookmark-form"), bookmarkNote: $("bookmark-note"), bookmarkTags: $("bookmark-tags"), bookmarkDelete: $("bookmark-delete"),
    footnoteDialog: $("footnote-dialog"), footnoteText: $("footnote-text"),
    toast: $("toast"),
  };

  const DEFAULT_STATE = {
    version: 2,
    lastBookId: LIBRARY[0].id,
    settings: {
      theme: "paper", fontSize: 100, fontFamily: "book", lineHeight: 1.72, textWidth: 760,
      readingSpeed: 220, textOnly: false, citationFormat: "reference", goalMinutes: 30, goalPages: 20,
    },
    books: {},
    recent: [],
    daily: {},
  };

  class ReaderStore {
    constructor() {
      this.state = this.load();
      this.saveTimer = 0;
      this.syncTimer = 0;
      this.migrateLegacy();
    }
    load() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
        if (parsed && parsed.version === 2) return this.merge(parsed);
      } catch (_) {}
      return structuredClone(DEFAULT_STATE);
    }
    merge(state) {
      return {
        ...structuredClone(DEFAULT_STATE), ...state,
        settings: { ...DEFAULT_STATE.settings, ...(state.settings || {}) },
        books: state.books || {}, recent: Array.isArray(state.recent) ? state.recent : [], daily: state.daily || {},
      };
    }
    book(id) {
      if (!this.state.books[id]) {
        this.state.books[id] = {
          position: null, lastOpened: null, totalSeconds: 0,
          bookmarks: {}, annotations: [], bookNote: "", chapterSummaries: {}, marker: null,
        };
      }
      return this.state.books[id];
    }
    migrateLegacy() {
      for (const meta of LIBRARY) {
        const bs = this.book(meta.id);
        if (bs.position == null) {
          try {
            const old = Number(localStorage.getItem(`fv-reader-position:${meta.id}`));
            if (old > 0) bs.position = old;
          } catch (_) {}
        }
        if (!Object.keys(bs.bookmarks || {}).length) {
          try {
            const old = JSON.parse(localStorage.getItem(`fv-reader-bookmarks:${meta.id}`) || "[]");
            if (Array.isArray(old)) old.forEach((page) => { bs.bookmarks[String(page)] = { page: Number(page), note: "", tags: [], created: Date.now() }; });
          } catch (_) {}
        }
      }
      try {
        const oldLast = localStorage.getItem("fv-reader-last-book");
        if (LIBRARY.some((x) => x.id === oldLast)) this.state.lastBookId = oldLast;
      } catch (_) {}
      this.saveNow();
    }
    save() {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => this.saveNow(), 120);
    }
    saveNow() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); } catch (_) {}
      clearTimeout(this.syncTimer);
      this.syncTimer = setTimeout(() => {
        const adapter = window.FV_READER_SYNC_ADAPTER;
        if (adapter && typeof adapter.push === "function") {
          Promise.resolve(adapter.push(structuredClone(this.state))).catch(() => {});
        }
      }, 800);
    }
    replace(state) {
      this.state = this.merge(state);
      this.saveNow();
    }
  }

  const store = new ReaderStore();

  let book = null;
  let pageIndex = 0;
  let currentSelection = null;
  let editingAnnotationId = null;
  let editingBookmarkPage = null;
  let showEditorialOnce = false;
  let searchMatches = [];
  let activeSearchIndex = -1;
  let searchToken = 0;
  let currentTab = "toc";
  let navBack = [];
  let navForward = [];
  let focusTimer = 0;
  let toastTimer = 0;
  let sessionSeconds = 0;
  let pendingSeconds = 0;
  let timedBookId = null;

  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, " ").replace(/\s+/g, " ").trim();
  const chapterFullTitle = (item) => item?.subtitle ? `${item.label} — ${item.subtitle}` : (item?.label || "");
  const compactChapterTitle = (item, max = 118) => {
    const value = chapterFullTitle(item);
    return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
  };
  const parseTags = (value) => [...new Set(String(value || "").split(",").map((x) => x.trim()).filter(Boolean))];
  const getMeta = (id) => LIBRARY.find((x) => x.id === id) || LIBRARY[0];
  const currentPage = () => book?.pages?.[pageIndex] || null;
  const bookState = (id = book?.id) => store.book(id || store.state.lastBookId);

  async function loadBook(id) {
    const meta = getMeta(id);
    if (BOOK_CACHE.has(meta.id)) return BOOK_CACHE.get(meta.id);
    const response = await fetch(meta.file, { credentials: "same-origin" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    BOOK_CACHE.set(meta.id, data);
    return data;
  }

  function toast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2200);
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  }

  async function copyText(value, label = "Copié") {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    toast(label);
  }

  function applySettings() {
    const s = store.state.settings;
    document.body.dataset.theme = s.theme;
    document.documentElement.style.setProperty("--scale", String(s.fontSize / 100));
    document.documentElement.style.setProperty("--leading", String(s.lineHeight));
    document.documentElement.style.setProperty("--text-width", `${s.textWidth}px`);
    const fonts = {
      serif: 'Georgia,"Times New Roman",serif',
      sans: 'Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      book: '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif',
    };
    document.documentElement.style.setProperty("--book-font", fonts[s.fontFamily] || fonts.book);
    syncSettingsPanel();
  }

  function syncSettingsPanel() {
    const s = store.state.settings;
    els.fontFamily.value = s.fontFamily;
    els.fontSize.value = s.fontSize;
    els.lineHeight.value = s.lineHeight;
    els.textWidth.value = s.textWidth;
    els.readingSpeed.value = s.readingSpeed;
    els.textOnly.checked = !!s.textOnly;
    els.citationFormat.value = s.citationFormat;
    els.goalMinutes.value = s.goalMinutes;
    els.goalPages.value = s.goalPages;
  }

  function cycleTheme() {
    const s = store.state.settings;
    s.theme = THEMES[(THEMES.indexOf(s.theme) + 1) % THEMES.length];
    store.save();
    applySettings();
  }

  function nearestPageIndex(targetBook, number) {
    const wanted = clamp(Math.round(Number(number) || targetBook.firstPage), targetBook.firstPage, targetBook.lastPage);
    let best = 0;
    let distance = Infinity;
    targetBook.pages.forEach((p, i) => {
      const d = Math.abs(p.number - wanted);
      if (d < distance) { best = i; distance = d; }
    });
    return best;
  }

  function currentChapterIndex(targetBook = book, number = currentPage()?.number) {
    let best = 0;
    (targetBook?.toc || []).forEach((item, i) => {
      if (Number(item.page) <= Number(number)) best = i;
    });
    return best;
  }

  function sourceRef(target, pageNumber) {
    return `${target.author}, ${target.title}, ${target.pagination === "paper" ? `p. ${pageNumber}` : `position ${pageNumber}`}.`;
  }

  function deepLink(target = book, pageNumber = currentPage()?.number) {
    const url = new URL(location.href);
    url.searchParams.set("book", target.id);
    url.searchParams.set("page", pageNumber);
    return url.href;
  }

  function updateUrl() {
    if (!book || !currentPage()) return;
    const url = new URL(location.href);
    url.searchParams.set("book", book.id);
    url.searchParams.set("page", currentPage().number);
    try { history.replaceState(null, "", `${url.pathname}${url.search}`); } catch (_) {}
  }

  function annotationList(id = book.id) {
    return bookState(id).annotations || [];
  }

  function renderText(container, block, blockIndex) {
    const raw = block.x || "";
    const annotations = annotationList().filter((a) => a.page === currentPage().number && a.block === blockIndex && a.start < a.end);
    const notes = Array.isArray(block.n) ? block.n : [];
    const boundaries = new Set([0, raw.length]);
    annotations.forEach((a) => { boundaries.add(clamp(a.start, 0, raw.length)); boundaries.add(clamp(a.end, 0, raw.length)); });
    notes.forEach((n) => boundaries.add(clamp(Number(n.o) || 0, 0, raw.length)));
    const points = [...boundaries].sort((a, b) => a - b);

    const appendNoteAt = (offset) => {
      notes.filter((n) => Number(n.o) === offset).forEach((n) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reader-footnote-button";
        button.textContent = n.l || "•";
        button.dataset.noteText = n.x || "Note indisponible.";
        button.setAttribute("aria-label", `Note ${n.l || ""}`);
        container.appendChild(button);
      });
    };

    appendNoteAt(0);
    for (let i = 0; i < points.length - 1; i += 1) {
      const start = points[i];
      const end = points[i + 1];
      if (end > start) {
        const text = raw.slice(start, end);
        const active = annotations.filter((a) => a.start <= start && a.end >= end).sort((a, b) => (b.created || 0) - (a.created || 0))[0];
        if (active) {
          const mark = document.createElement("mark");
          mark.className = `reader-highlight hl-${active.color || "violet"}`;
          mark.dataset.annotationId = active.id;
          mark.textContent = text;
          container.appendChild(mark);
        } else {
          container.appendChild(document.createTextNode(text));
        }
      }
      appendNoteAt(end);
    }
  }

  function updateChapterSelect() {
    const idx = currentChapterIndex();
    els.chapterSelect.value = String(idx);
    const bs = bookState();
    els.bookNote.value = bs.bookNote || "";
    els.chapterSummary.value = bs.chapterSummaries?.[String(idx)] || "";
  }

  function updateChapterEstimate() {
    const idx = currentChapterIndex();
    const next = book.toc?.slice(idx + 1).find((x) => Number(x.page) > currentPage().number);
    const endPage = next ? Number(next.page) : book.lastPage + 1;
    let words = 0;
    for (let i = pageIndex; i < book.pages.length && book.pages[i].number < endPage; i += 1) {
      words += Number(book.pages[i].words || 0);
    }
    const minutes = Math.max(1, Math.ceil(words / Math.max(100, Number(store.state.settings.readingSpeed) || 220)));
    els.chapterTime.textContent = `≈ ${minutes} min dans ce chapitre`;
  }

  function updateBookmarkButton() {
    const active = !!bookState().bookmarks[String(currentPage().number)];
    els.bookmarkToggle.textContent = active ? "★" : "☆";
    els.bookmarkToggle.setAttribute("aria-pressed", String(active));
  }

  function markPageVisited() {
    const date = today();
    if (!store.state.daily[date]) store.state.daily[date] = { seconds: 0, pages: {} };
    store.state.daily[date].pages[`${book.id}:${currentPage().number}`] = 1;
    store.save();
  }

  function renderPage(index, { focus = false, restoreMarker = true } = {}) {
    pageIndex = clamp(index, 0, book.pages.length - 1);
    const p = currentPage();
    els.content.replaceChildren();

    if (store.state.settings.textOnly && p.editorial && !showEditorialOnce) {
      const notice = document.createElement("div");
      notice.className = "editorial-notice";
      const inner = document.createElement("div");
      const text = document.createElement("p");
      text.textContent = "Cette page appartient aux éléments éditoriaux masqués.";
      const button = document.createElement("button");
      button.className = "tool-button";
      button.textContent = "Afficher cette page";
      button.addEventListener("click", () => { showEditorialOnce = true; renderPage(pageIndex); });
      inner.append(text, button);
      notice.appendChild(inner);
      els.content.appendChild(notice);
    } else {
      showEditorialOnce = false;
      (p.blocks || []).forEach((block, i) => {
        if (block.t === "i" && block.src) {
          const figure = document.createElement("figure");
          figure.className = "reader-figure";
          const image = document.createElement("img");
          image.src = block.src;
          image.alt = block.alt || "Illustration";
          image.loading = "lazy";
          figure.appendChild(image);
          if (block.alt) {
            const caption = document.createElement("figcaption");
            caption.textContent = block.alt;
            figure.appendChild(caption);
          }
          els.content.appendChild(figure);
          return;
        }
        const element = document.createElement(block.t === "h" ? "h2" : "p");
        element.className = `reader-block${block.t === "s" ? " reader-separator" : ""}${block.t === "r" ? " reader-right" : ""}`;
        element.dataset.blockIndex = i;
        element.dataset.rawText = block.x || "";
        const pin = document.createElement("button");
        pin.type = "button";
        pin.className = "paragraph-pin";
        pin.textContent = "●";
        pin.title = "Marquer ce paragraphe";
        pin.dataset.pinBlock = i;
        element.appendChild(pin);
        renderText(element, block, i);
        const marker = bookState().marker;
        if (marker && marker.page === p.number && marker.block === i) element.classList.add("is-marker");
        els.content.appendChild(element);
      });
    }

    const percent = Math.round((pageIndex / Math.max(1, book.pages.length - 1)) * 100);
    els.pageNumber.textContent = book.pagination === "paper" ? `Page ${p.number}` : `Position ${p.number}`;
    els.progressText.textContent = `${percent} %`;
    els.pageInput.value = p.number;
    els.progress.value = p.number;
    els.prev.disabled = pageIndex === 0;
    els.prevEdge.disabled = pageIndex === 0;
    els.next.disabled = pageIndex === book.pages.length - 1;
    els.nextEdge.disabled = pageIndex === book.pages.length - 1;

    updateChapterSelect();
    updateChapterEstimate();
    updateBookmarkButton();
    updateUrl();
    markPageVisited();

    const bs = bookState();
    bs.position = p.number;
    bs.lastOpened = Date.now();
    store.state.lastBookId = book.id;
    store.save();
    els.scroll.scrollTop = 0;

    if (restoreMarker && bs.marker && bs.marker.page === p.number) {
      setTimeout(() => els.content.querySelector(`[data-block-index="${bs.marker.block}"]`)?.scrollIntoView({ block: "center" }), 0);
    }
    if (focus) els.scroll.focus({ preventScroll: true });
    refreshPanel();
  }

  function nextReadableIndex(direction) {
    let i = pageIndex + direction;
    while (i >= 0 && i < book.pages.length) {
      if (!store.state.settings.textOnly || !book.pages[i].editorial) return i;
      i += direction;
    }
    return clamp(i, 0, book.pages.length - 1);
  }

  function previousPage() {
    const next = nextReadableIndex(-1);
    if (next !== pageIndex) renderPage(next, { focus: true, restoreMarker: false });
  }

  function nextPage() {
    const next = nextReadableIndex(1);
    if (next !== pageIndex) renderPage(next, { focus: true, restoreMarker: false });
  }

  function authorNames() {
    return [...new Set(LIBRARY.map((meta) => meta.author).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  }

  function fillAuthorSelect(select, { includeAll = true } = {}) {
    if (!select) return;
    const previous = select.value;
    select.replaceChildren();
    if (includeAll) {
      const all = document.createElement("option");
      all.value = "";
      all.textContent = "Tous les auteurs";
      select.appendChild(all);
    }
    authorNames().forEach((authorName) => {
      const option = document.createElement("option");
      option.value = authorName;
      option.textContent = authorName;
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
  }

  function booksForAuthor(authorName) {
    return authorName ? LIBRARY.filter((meta) => meta.author === authorName) : LIBRARY;
  }

  function populateBookSelect(authorName = "", selectedId = null) {
    const choices = booksForAuthor(authorName);
    els.bookSelect.replaceChildren();
    choices.forEach((meta) => {
      const option = document.createElement("option");
      option.value = meta.id;
      option.textContent = meta.title;
      els.bookSelect.appendChild(option);
    });
    const wanted = selectedId && choices.some((meta) => meta.id === selectedId) ? selectedId : choices[0]?.id;
    if (wanted) els.bookSelect.value = wanted;
    return wanted;
  }

  function buildBookSelect() {
    fillAuthorSelect(els.authorSelect, { includeAll: false });
    fillAuthorSelect(els.libraryAuthorFilter);

    els.annotationLinkBook.replaceChildren();
    LIBRARY.forEach((meta) => {
      const option = document.createElement("option");
      option.value = meta.id;
      option.textContent = `${meta.author} — ${meta.title}`;
      els.annotationLinkBook.appendChild(option);
    });

    const initial = getMeta(store.state.lastBookId);
    if (els.authorSelect) els.authorSelect.value = initial.author;
    populateBookSelect(initial.author, initial.id);
  }

  function buildChapterSelect() {
    els.chapterSelect.replaceChildren();
    (book.toc || []).forEach((item, i) => {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = `${" ".repeat(Math.min(item.depth || 0, 3))}${compactChapterTitle(item)}`;
      option.title = chapterFullTitle(item);
      els.chapterSelect.appendChild(option);
    });
    els.chapterSelect.disabled = !book.toc?.length;
  }

  function renderChapterTicks() {
    els.chapterTicks.replaceChildren();
    const span = Math.max(1, book.lastPage - book.firstPage);
    (book.toc || []).filter((x) => (x.depth || 0) <= 1).forEach((item) => {
      const tick = document.createElement("span");
      tick.className = "chapter-tick";
      tick.style.left = `${((Number(item.page) - book.firstPage) / span) * 100}%`;
      tick.title = chapterFullTitle(item);
      els.chapterTicks.appendChild(tick);
    });
  }

  function buildPageControls() {
    els.pageInput.min = book.firstPage;
    els.pageInput.max = book.lastPage;
    els.pageTotal.textContent = book.lastPage;
    els.progress.min = book.firstPage;
    els.progress.max = book.lastPage;
    els.progress.step = 1;
    els.pageLabel.textContent = book.pagination === "paper" ? "Page" : "Position";
    renderChapterTicks();
  }

  async function selectBook(id, targetPage = null, { recordTrail = true, resumeToast = false } = {}) {
    const meta = getMeta(id);
    if (book && recordTrail) pushTrail({ bookId: book.id, page: currentPage().number });
    flushTime();
    els.title.textContent = `Ouverture de ${meta.title}…`;
    try {
      const data = await loadBook(meta.id);
      book = data;
      timedBookId = book.id;
      els.title.textContent = book.title;
      els.author.textContent = book.author;
      if (els.authorSelect) els.authorSelect.value = book.author;
      populateBookSelect(book.author, book.id);
      buildChapterSelect();
      buildPageControls();
      renderToc();
      renderBookMap();
      const bs = bookState();
      const start = targetPage ?? bs.position ?? book.firstPage;
      renderPage(nearestPageIndex(book, start));
      recordRecent();
      if (resumeToast && bs.position) toast(`Reprise — ${book.pagination === "paper" ? "p. " : "position "}${bs.position}`);
    } catch (error) {
      console.error(error);
      els.title.textContent = meta.title;
      toast("Impossible d’ouvrir ce livre");
    }
  }

  function pushTrail(location) {
    if (!location || !book) return;
    navBack.push(location);
    if (navBack.length > 60) navBack.shift();
    navForward = [];
    updateTrailButtons();
  }

  function updateTrailButtons() {
    els.trailBack.disabled = !navBack.length;
    els.trailForward.disabled = !navForward.length;
  }

  async function jumpTo(bookId, pageNumber, { recordTrail = true } = {}) {
    if (book && recordTrail) pushTrail({ bookId: book.id, page: currentPage().number });
    if (!book || book.id !== bookId) {
      await selectBook(bookId, pageNumber, { recordTrail: false });
    } else {
      renderPage(nearestPageIndex(book, pageNumber), { focus: true });
    }
  }

  async function goTrailBack() {
    if (!navBack.length || !book) return;
    const target = navBack.pop();
    navForward.push({ bookId: book.id, page: currentPage().number });
    await jumpTo(target.bookId, target.page, { recordTrail: false });
    updateTrailButtons();
  }

  async function goTrailForward() {
    if (!navForward.length || !book) return;
    const target = navForward.pop();
    navBack.push({ bookId: book.id, page: currentPage().number });
    await jumpTo(target.bookId, target.page, { recordTrail: false });
    updateTrailButtons();
  }

  function bookmarks(id = book.id) {
    return store.book(id).bookmarks || {};
  }

  function openBookmarkEditor(pageNumber = currentPage().number) {
    editingBookmarkPage = pageNumber;
    const value = bookmarks()[String(pageNumber)] || { page: pageNumber, note: "", tags: [] };
    els.bookmarkNote.value = value.note || "";
    els.bookmarkTags.value = (value.tags || []).join(", ");
    els.bookmarkDelete.hidden = !bookmarks()[String(pageNumber)];
    els.bookmarkDialog.showModal();
  }

  function toggleBookmark() {
    const key = String(currentPage().number);
    if (!bookmarks()[key]) {
      bookmarks()[key] = { page: currentPage().number, note: "", tags: [], created: Date.now() };
      store.save();
      updateBookmarkButton();
    }
    openBookmarkEditor(currentPage().number);
  }

  function textOffset(blockElement, node, offset) {
    const walker = document.createTreeWalker(blockElement, NodeFilter.SHOW_TEXT, {
      acceptNode(textNode) {
        if (textNode.parentElement?.closest(".reader-footnote-button,.paragraph-pin")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let total = 0;
    let current;
    while ((current = walker.nextNode())) {
      if (current === node) return total + clamp(offset, 0, current.nodeValue.length);
      total += current.nodeValue.length;
    }
    return total;
  }

  function hideSelectionToolbar() {
    els.selectionToolbar.hidden = true;
    currentSelection = null;
  }

  function captureSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount || !book) {
      hideSelectionToolbar();
      return;
    }
    const range = selection.getRangeAt(0);
    if (!els.content.contains(range.commonAncestorContainer)) {
      hideSelectionToolbar();
      return;
    }
    const blocks = [...els.content.querySelectorAll(".reader-block")].filter((element) => {
      try { return range.intersectsNode(element); } catch (_) { return false; }
    });
    const parts = [];
    blocks.forEach((element) => {
      const raw = element.dataset.rawText || "";
      let start = 0;
      let end = raw.length;
      if (element.contains(range.startContainer)) start = textOffset(element, range.startContainer, range.startOffset);
      if (element.contains(range.endContainer)) end = textOffset(element, range.endContainer, range.endOffset);
      start = clamp(start, 0, raw.length);
      end = clamp(end, start, raw.length);
      const quote = raw.slice(start, end).trim();
      if (quote) parts.push({ block: Number(element.dataset.blockIndex), start, end, quote });
    });
    if (!parts.length) {
      hideSelectionToolbar();
      return;
    }
    const rect = range.getBoundingClientRect();
    currentSelection = { parts, quote: parts.map((x) => x.quote).join("\n"), rect };
    els.selectionToolbar.hidden = false;
    requestAnimationFrame(() => {
      const w = els.selectionToolbar.offsetWidth;
      const h = els.selectionToolbar.offsetHeight;
      els.selectionToolbar.style.left = `${clamp(rect.left + rect.width / 2 - w / 2, 8, innerWidth - w - 8)}px`;
      els.selectionToolbar.style.top = `${Math.max(8, rect.top - h - 8)}px`;
    });
  }

  function createAnnotations({ color = "violet", review = false } = {}) {
    if (!currentSelection) return [];
    const group = uid();
    const created = Date.now();
    const items = currentSelection.parts.map((part) => ({
      id: uid(), group, page: currentPage().number, block: part.block, start: part.start, end: part.end,
      quote: part.quote, color, note: "", tags: [], created,
      review: review ? { due: today(), stage: 0 } : null, link: null,
    }));
    bookState().annotations.push(...items);
    store.save();
    renderPage(pageIndex, { restoreMarker: false });
    return items;
  }

  function findAnnotation(id) {
    return bookState().annotations.find((a) => a.id === id);
  }

  function openAnnotationEditor(annotation) {
    if (!annotation) return;
    editingAnnotationId = annotation.id;
    els.annotationQuote.textContent = annotation.quote;
    els.annotationColor.value = annotation.color || "violet";
    els.annotationNote.value = annotation.note || "";
    els.annotationTags.value = (annotation.tags || []).join(", ");
    els.annotationReview.checked = !!annotation.review;
    els.annotationLinkBook.value = annotation.link?.bookId || book.id;
    els.annotationLinkPage.value = annotation.link?.page || "";
    els.annotationDelete.hidden = false;
    els.annotationDialog.showModal();
  }

  function copyCitation(quote, pageNumber, target = book) {
    const format = store.state.settings.citationFormat;
    let value = quote;
    if (format === "reference") value = `${quote}\n— ${sourceRef(target, pageNumber)}`;
    if (format === "markdown") value = `> ${quote.replace(/\n/g, "\n> ")}\n\n— *${target.author}, ${target.title}*, ${target.pagination === "paper" ? `p. ${pageNumber}` : `position ${pageNumber}`}.`;
    copyText(value, "Citation copiée");
  }

  function selectionAction(action) {
    if (!currentSelection) return;
    const quote = currentSelection.quote;
    if (action === "highlight") {
      createAnnotations({ color: "violet" });
      toast("Passage surligné");
    } else if (action === "note" || action === "review") {
      const created = createAnnotations({ color: "none", review: action === "review" });
      if (created[0]) openAnnotationEditor(created[0]);
    } else if (action === "copy") {
      copyText(quote);
    } else if (action === "citation") {
      copyCitation(quote, currentPage().number);
    } else if (action === "define") {
      window.open(`https://www.cnrtl.fr/definition/${encodeURIComponent(quote.slice(0, 80))}`, "_blank", "noopener");
    } else if (action === "search") {
      openSearch();
      els.searchScope.value = "book";
      els.searchInput.value = quote;
      renderSearch();
    } else if (action === "stack") {
      addToStack({ bookId: book.id, page: currentPage().number, quote, created: Date.now() });
      toast("Passage épinglé dans la pile");
    } else if (action === "compare") {
      showCompare({ bookId: book.id, page: currentPage().number, quote });
    }
    window.getSelection()?.removeAllRanges();
    hideSelectionToolbar();
  }

  function openFootnote(text) {
    els.footnoteText.textContent = text || "Note indisponible.";
    els.footnoteDialog.showModal();
  }

  function toggleMarker(blockIndex) {
    const bs = bookState();
    if (bs.marker && bs.marker.page === currentPage().number && bs.marker.block === blockIndex) bs.marker = null;
    else bs.marker = { page: currentPage().number, block: blockIndex, created: Date.now() };
    store.save();
    renderPage(pageIndex, { restoreMarker: false });
    toast(bs.marker ? "Repère placé" : "Repère retiré");
  }

  function renderToc() {
    if (!book) return;
    els.tocList.replaceChildren();
    const active = currentChapterIndex();
    (book.toc || []).forEach((item, i) => {
      const button = document.createElement("button");
      button.className = `toc-item${i === active ? " is-current" : ""}`;
      button.style.paddingLeft = `${8 + Math.min(item.depth || 0, 3) * 13}px`;
      button.title = chapterFullTitle(item);

      const label = document.createElement("strong");
      label.textContent = item.label;
      button.appendChild(label);

      if (item.subtitle) {
        const subtitle = document.createElement("small");
        subtitle.textContent = item.subtitle;
        button.appendChild(subtitle);
      }

      button.addEventListener("click", async () => { await jumpTo(book.id, item.page); closeDrawer(); });
      els.tocList.appendChild(button);
    });
  }

  function renderBookMap() {
    if (!book) return;
    els.bookMap.replaceChildren();
    const top = (book.toc || []).filter((x) => (x.depth || 0) === 0);
    const source = top.length >= 2 ? top : (book.toc || []).filter((x) => (x.depth || 0) <= 1).slice(0, 20);
    source.forEach((item, i) => {
      const next = source[i + 1]?.page || book.lastPage + 1;
      const button = document.createElement("button");
      button.className = "book-map-segment";
      button.style.flexGrow = Math.max(1, Number(next) - Number(item.page));
      button.title = chapterFullTitle(item);
      button.addEventListener("click", () => jumpTo(book.id, item.page));
      els.bookMap.appendChild(button);
    });
  }

  function renderLibrary() {
    els.libraryGrid.replaceChildren();
    const authorFilter = els.libraryAuthorFilter?.value || "";
    LIBRARY.forEach((meta) => {
      if (authorFilter && meta.author !== authorFilter) return;
      const bs = store.book(meta.id);
      const pos = bs.position ?? meta.firstPage;
      const pct = Math.round(clamp((pos - meta.firstPage) / Math.max(1, meta.lastPage - meta.firstPage), 0, 1) * 100);
      const card = document.createElement("article");
      card.className = "library-card";
      const title = document.createElement("strong");
      title.textContent = meta.title;
      const info = document.createElement("small");
      info.textContent = `${meta.author} · ${pct}% · ${bs.lastOpened ? new Date(bs.lastOpened).toLocaleDateString("fr-FR") : "jamais ouvert"}`;
      const progress = document.createElement("div");
      progress.className = "library-progress";
      const bar = document.createElement("span");
      bar.style.width = `${pct}%`;
      progress.appendChild(bar);
      card.append(title, info, progress);
      card.addEventListener("click", async () => { await selectBook(meta.id, pos); closeDrawer(); });
      els.libraryGrid.appendChild(card);
    });
  }

  function allTags(scope) {
    const ids = scope === "all" ? LIBRARY.map((x) => x.id) : [book.id];
    const tags = new Set();
    ids.forEach((id) => {
      const bs = store.book(id);
      bs.annotations.forEach((a) => (a.tags || []).forEach((tag) => tags.add(tag)));
      Object.values(bs.bookmarks || {}).forEach((m) => (m.tags || []).forEach((tag) => tags.add(tag)));
    });
    return [...tags].sort((a, b) => a.localeCompare(b, "fr"));
  }

  function renderExtracts() {
    if (!book) return;
    const scope = els.extractScope.value;
    const filter = normalize(els.tagFilter.value);
    const ids = scope === "all" ? LIBRARY.map((x) => x.id) : [book.id];
    els.tagCloud.replaceChildren();
    allTags(scope).forEach((tag) => {
      const button = document.createElement("button");
      button.className = "tag-chip";
      button.textContent = tag;
      button.addEventListener("click", () => { els.tagFilter.value = tag; renderExtracts(); });
      els.tagCloud.appendChild(button);
    });

    const entries = [];
    ids.forEach((id) => {
      const meta = getMeta(id);
      const bs = store.book(id);
      bs.annotations.forEach((a) => entries.push({ type: "annotation", meta, data: a }));
      Object.values(bs.bookmarks || {}).forEach((m) => entries.push({ type: "bookmark", meta, data: m }));
    });
    entries.sort((a, b) => (b.data.created || 0) - (a.data.created || 0));
    els.extractList.replaceChildren();
    entries.filter((entry) => {
      if (!filter) return true;
      return normalize(`${entry.data.quote || ""} ${entry.data.note || ""} ${(entry.data.tags || []).join(" ")}`).includes(filter);
    }).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "extract-card";
      const metaLine = document.createElement("div");
      metaLine.className = "extract-meta";
      metaLine.textContent = `${entry.meta.title} · ${entry.meta.pagination === "paper" ? "p. " : "pos. "}${entry.data.page}`;
      card.appendChild(metaLine);
      if (entry.data.quote) {
        const q = document.createElement("blockquote"); q.textContent = entry.data.quote; card.appendChild(q);
      }
      if (entry.data.note) {
        const n = document.createElement("p"); n.textContent = entry.data.note; card.appendChild(n);
      }
      if (entry.data.tags?.length) {
        const tags = document.createElement("div"); tags.className = "tag-cloud";
        entry.data.tags.forEach((tag) => { const chip = document.createElement("span"); chip.className = "tag-chip"; chip.textContent = tag; tags.appendChild(chip); });
        card.appendChild(tags);
      }
      const actions = document.createElement("div"); actions.className = "card-actions";
      const open = document.createElement("button"); open.textContent = "Ouvrir"; open.addEventListener("click", async () => { await jumpTo(entry.meta.id, entry.data.page); closeDrawer(); });
      const edit = document.createElement("button"); edit.textContent = "Modifier"; edit.addEventListener("click", async () => {
        await jumpTo(entry.meta.id, entry.data.page);
        if (entry.type === "annotation") openAnnotationEditor(findAnnotation(entry.data.id)); else openBookmarkEditor(entry.data.page);
      });
      actions.append(open, edit);
      if (entry.data.link?.bookId && entry.data.link?.page) {
        const link = document.createElement("button"); link.textContent = "Passage lié"; link.addEventListener("click", async () => { await jumpTo(entry.data.link.bookId, entry.data.link.page); closeDrawer(); }); actions.appendChild(link);
      }
      card.appendChild(actions);
      els.extractList.appendChild(card);
    });
    if (!els.extractList.children.length) els.extractList.innerHTML = '<p class="panel-intro">Aucun extrait ou marque-page correspondant.</p>';
  }

  function dueAnnotations() {
    const due = today();
    const result = [];
    LIBRARY.forEach((meta) => {
      store.book(meta.id).annotations.forEach((annotation) => {
        if (annotation.review?.due && annotation.review.due <= due) result.push({ meta, annotation });
      });
    });
    return result.sort((a, b) => a.annotation.review.due.localeCompare(b.annotation.review.due));
  }

  function scheduleReview(entry, quality) {
    const annotation = entry.annotation;
    const stage = Math.max(0, Number(annotation.review?.stage || 0));
    const intervals = REVIEW_INTERVALS[quality];
    const days = intervals[Math.min(stage, intervals.length - 1)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    annotation.review = { due: date.toISOString().slice(0, 10), stage: quality === "hard" ? Math.max(0, stage - 1) : stage + 1 };
    store.save();
    renderReview();
    toast(`À revoir dans ${days} jour${days > 1 ? "s" : ""}`);
  }

  function renderReview() {
    els.reviewList.replaceChildren();
    const items = dueAnnotations();
    items.forEach((entry) => {
      const card = document.createElement("article"); card.className = "review-card";
      const metaLine = document.createElement("div"); metaLine.className = "card-meta"; metaLine.textContent = `${entry.meta.title} · ${entry.meta.pagination === "paper" ? "p. " : "pos. "}${entry.annotation.page}`;
      const quote = document.createElement("blockquote"); quote.textContent = entry.annotation.quote;
      const actions = document.createElement("div"); actions.className = "card-actions";
      [["Difficile", "hard"], ["Bien", "good"], ["Facile", "easy"]].forEach(([label, key]) => {
        const button = document.createElement("button"); button.textContent = label; button.addEventListener("click", () => scheduleReview(entry, key)); actions.appendChild(button);
      });
      const open = document.createElement("button"); open.textContent = "Ouvrir"; open.addEventListener("click", async () => { await jumpTo(entry.meta.id, entry.annotation.page); closeDrawer(); }); actions.appendChild(open);
      card.append(metaLine, quote, actions); els.reviewList.appendChild(card);
    });
    if (!items.length) els.reviewList.innerHTML = '<p class="panel-intro">Rien à revoir aujourd’hui.</p>';
  }

  function loadStack() {
    try { const value = JSON.parse(sessionStorage.getItem(STACK_KEY) || "[]"); return Array.isArray(value) ? value : []; } catch (_) { return []; }
  }

  function saveStack(items) {
    try { sessionStorage.setItem(STACK_KEY, JSON.stringify(items.slice(-12))); } catch (_) {}
  }

  function addToStack(item) {
    const items = loadStack();
    items.push({ id: uid(), ...item });
    saveStack(items);
    renderStack();
  }

  function renderStack() {
    els.stackList.replaceChildren();
    const items = loadStack();
    items.slice().reverse().forEach((item) => {
      const meta = getMeta(item.bookId);
      const card = document.createElement("article"); card.className = "stack-card";
      const info = document.createElement("div"); info.className = "card-meta"; info.textContent = `${meta.title} · ${meta.pagination === "paper" ? "p. " : "pos. "}${item.page}`;
      const quote = document.createElement("blockquote"); quote.textContent = item.quote || "Passage épinglé";
      const actions = document.createElement("div"); actions.className = "card-actions";
      const compare = document.createElement("button"); compare.textContent = "Comparer"; compare.addEventListener("click", () => { showCompare(item); closeDrawer(); });
      const open = document.createElement("button"); open.textContent = "Ouvrir"; open.addEventListener("click", async () => { await jumpTo(item.bookId, item.page); closeDrawer(); });
      const remove = document.createElement("button"); remove.textContent = "Retirer"; remove.addEventListener("click", () => { saveStack(loadStack().filter((x) => x.id !== item.id)); renderStack(); });
      actions.append(compare, open, remove); card.append(info, quote, actions); els.stackList.appendChild(card);
    });
    if (!items.length) els.stackList.innerHTML = '<p class="panel-intro">La pile est vide.</p>';
  }

  async function showCompare(item) {
    const meta = getMeta(item.bookId);
    els.compareContent.replaceChildren();
    const info = document.createElement("div"); info.className = "card-meta"; info.textContent = `${meta.title} · ${meta.pagination === "paper" ? "p. " : "pos. "}${item.page}`;
    els.compareContent.appendChild(info);
    if (item.quote) {
      const q = document.createElement("blockquote"); q.textContent = item.quote; els.compareContent.appendChild(q);
    } else {
      try {
        const data = await loadBook(meta.id);
        const targetPage = data.pages[nearestPageIndex(data, item.page)];
        (targetPage.blocks || []).slice(0, 10).forEach((block) => { const element = document.createElement(block.t === "h" ? "h3" : "p"); element.textContent = block.x; els.compareContent.appendChild(element); });
      } catch (_) {}
    }
    els.comparePane.hidden = false;
    els.paper.classList.add("has-compare");
  }

  function closeCompare() {
    els.comparePane.hidden = true;
    els.paper.classList.remove("has-compare");
  }

  function recordRecent() {
    const entry = { bookId: book.id, page: currentPage().number, ts: Date.now() };
    store.state.recent = [entry, ...store.state.recent.filter((x) => !(x.bookId === entry.bookId && x.page === entry.page))].slice(0, 60);
    store.save();
  }

  function dailyBucket() {
    const date = today();
    if (!store.state.daily[date]) store.state.daily[date] = { seconds: 0, pages: {} };
    return store.state.daily[date];
  }

  function startTimer() {
    setInterval(() => {
      if (!document.hidden && book) {
        sessionSeconds += 1;
        pendingSeconds += 1;
        if (pendingSeconds >= 15) flushTime();
        if (currentTab === "stats" && !els.drawer.hidden) renderStats();
      }
    }, 1000);
  }

  function flushTime() {
    if (!pendingSeconds || !timedBookId) return;
    const seconds = pendingSeconds;
    pendingSeconds = 0;
    dailyBucket().seconds += seconds;
    store.book(timedBookId).totalSeconds = Number(store.book(timedBookId).totalSeconds || 0) + seconds;
    store.saveNow();
  }

  function renderStats() {
    const bucket = dailyBucket();
    const seconds = Number(bucket.seconds || 0) + pendingSeconds;
    const pageCount = Object.keys(bucket.pages || {}).length;
    const goalMinutes = Number(store.state.settings.goalMinutes || 0);
    const goalPages = Number(store.state.settings.goalPages || 0);
    els.statsSummary.replaceChildren();
    const stats = [
      [formatDuration(seconds), `Aujourd’hui · ${goalMinutes ? Math.min(100, Math.round((seconds / 60 / goalMinutes) * 100)) : 0}% de l’objectif`],
      [`${pageCount} pages`, `Aujourd’hui · ${goalPages ? Math.min(100, Math.round((pageCount / goalPages) * 100)) : 0}% de l’objectif`],
      [formatDuration(sessionSeconds), "Session en cours"],
      [formatDuration(bookState().totalSeconds || 0), `Total · ${book.title}`],
    ];
    stats.forEach(([value, label]) => {
      const box = document.createElement("div"); box.className = "stat-box";
      const strong = document.createElement("strong"); strong.textContent = value;
      const span = document.createElement("span"); span.textContent = label;
      box.append(strong, span); els.statsSummary.appendChild(box);
    });
    els.historyList.replaceChildren();
    store.state.recent.slice(0, 12).forEach((item) => {
      const meta = getMeta(item.bookId);
      const card = document.createElement("div"); card.className = "history-card";
      const time = document.createElement("div"); time.className = "card-meta"; time.textContent = new Date(item.ts).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
      const line = document.createElement("div"); line.textContent = `${meta.title} · ${meta.pagination === "paper" ? "p. " : "pos. "}${item.page}`;
      card.append(time, line); card.addEventListener("click", async () => { await jumpTo(meta.id, item.page); closeDrawer(); }); els.historyList.appendChild(card);
    });
  }

  function noteSearch(query) {
    const terms = normalize(query).split(" ").filter(Boolean);
    const matches = [];
    LIBRARY.forEach((meta) => {
      const bs = store.book(meta.id);
      bs.annotations.forEach((a) => {
        const haystack = normalize(`${a.quote} ${a.note} ${(a.tags || []).join(" ")}`);
        if (terms.every((term) => haystack.includes(term))) matches.push({ meta, page: a.page, text: `${a.quote} ${a.note || ""}`.trim() });
      });
      if (bs.bookNote && terms.every((term) => normalize(bs.bookNote).includes(term))) matches.push({ meta, page: bs.position || meta.firstPage, text: bs.bookNote });
      Object.entries(bs.chapterSummaries || {}).forEach(([_, summary]) => {
        if (summary && terms.every((term) => normalize(summary).includes(term))) matches.push({ meta, page: bs.position || meta.firstPage, text: summary });
      });
    });
    return matches;
  }

  function highlightedSnippet(container, raw, terms) {
    const normalized = normalize(raw);
    const at = terms.length ? normalized.indexOf(terms[0]) : -1;
    const start = Math.max(0, at - 75);
    const end = Math.min(raw.length, Math.max(at, 0) + 190);
    const snippet = `${start ? "…" : ""}${raw.slice(start, end).trim()}${end < raw.length ? "…" : ""}`;
    if (!terms.length) { container.textContent = snippet; return; }
    const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "ig");
    snippet.split(regex).forEach((part) => {
      const node = document.createElement(terms.some((term) => normalize(part) === term) ? "mark" : "span");
      node.textContent = part;
      container.appendChild(node);
    });
  }

  async function renderSearch() {
    const token = ++searchToken;
    const query = els.searchInput.value.trim();
    els.searchResults.replaceChildren();
    searchMatches = [];
    activeSearchIndex = -1;
    if (!query) {
      const hint = document.createElement("p"); hint.className = "search-info"; hint.textContent = "Recherche dans le texte, toute la bibliothèque, ou tes notes et tags."; els.searchResults.appendChild(hint); return;
    }
    const terms = normalize(query).split(" ").filter(Boolean);
    const scope = els.searchScope.value;
    if (scope === "notes") {
      searchMatches = noteSearch(query);
    } else {
      const targets = scope === "all" ? LIBRARY : [getMeta(book.id)];
      const loading = document.createElement("p"); loading.className = "search-info"; loading.textContent = scope === "all" ? "Recherche dans la bibliothèque…" : "Recherche…"; els.searchResults.appendChild(loading);
      const datasets = await Promise.all(targets.map(async (meta) => ({ meta, data: await loadBook(meta.id) })));
      if (token !== searchToken) return;
      datasets.forEach(({ meta, data }) => {
        data.pages.forEach((p) => {
          const raw = (p.blocks || []).map((block) => block.x).join(" ");
          const haystack = normalize(raw);
          if (terms.every((term) => haystack.includes(term))) searchMatches.push({ meta, page: p.number, text: raw });
        });
      });
    }
    if (token !== searchToken) return;
    searchMatches = searchMatches.slice(0, 100);
    els.searchResults.replaceChildren();
    const info = document.createElement("p"); info.className = "search-info"; info.textContent = searchMatches.length ? `${searchMatches.length} résultat${searchMatches.length > 1 ? "s" : ""}.` : "Aucun résultat."; els.searchResults.appendChild(info);
    searchMatches.slice(0, 30).forEach((match, i) => {
      const button = document.createElement("button"); button.className = "search-result"; button.dataset.searchIndex = i;
      const metaLine = document.createElement("strong"); metaLine.textContent = `${match.meta.title} · ${match.meta.pagination === "paper" ? "p. " : "pos. "}${match.page}`;
      const snippet = document.createElement("span"); highlightedSnippet(snippet, match.text, terms);
      button.append(metaLine, snippet); button.addEventListener("click", () => activateSearch(i)); els.searchResults.appendChild(button);
    });
  }

  async function activateSearch(index) {
    if (!searchMatches.length) return;
    activeSearchIndex = (index + searchMatches.length) % searchMatches.length;
    const match = searchMatches[activeSearchIndex];
    await jumpTo(match.meta.id, match.page);
    els.searchResults.querySelectorAll(".search-result").forEach((element, i) => element.classList.toggle("is-active", i === activeSearchIndex));
  }

  function openSearch() {
    els.searchPanel.hidden = false;
    els.searchToggle.setAttribute("aria-expanded", "true");
    setTimeout(() => els.searchInput.focus({ preventScroll: true }), 20);
  }

  function closeSearch() {
    els.searchPanel.hidden = true;
    els.searchToggle.setAttribute("aria-expanded", "false");
  }

  function openDrawer(tab = "toc") {
    els.drawer.hidden = false;
    els.drawerBackdrop.hidden = false;
    els.drawerToggle.setAttribute("aria-expanded", "true");
    switchTab(tab);
  }

  function closeDrawer() {
    els.drawer.hidden = true;
    els.drawerBackdrop.hidden = true;
    els.drawerToggle.setAttribute("aria-expanded", "false");
  }

  function switchTab(tab) {
    currentTab = tab;
    els.drawerTabs.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    els.drawer.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === tab));
    refreshPanel();
  }

  function refreshPanel() {
    if (els.drawer.hidden || !book) return;
    if (currentTab === "toc") { renderToc(); renderBookMap(); }
    if (currentTab === "library") renderLibrary();
    if (currentTab === "extracts") renderExtracts();
    if (currentTab === "review") renderReview();
    if (currentTab === "stack") renderStack();
    if (currentTab === "stats") renderStats();
    if (currentTab === "settings") syncSettingsPanel();
  }

  function showFocus(enabled) {
    els.app.classList.toggle("is-focus", enabled);
    els.focusReturn.hidden = !enabled;
    if (enabled) {
      els.app.classList.add("is-peek");
      scheduleFocusHide();
    } else {
      els.app.classList.remove("is-peek");
    }
  }

  function toggleFocus() {
    showFocus(!els.app.classList.contains("is-focus"));
  }

  function scheduleFocusHide() {
    clearTimeout(focusTimer);
    focusTimer = setTimeout(() => els.app.classList.remove("is-peek"), 1700);
  }

  function requestFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }

  function backupData() {
    flushTime();
    const payload = { kind: "fv-reader-backup", version: 2, exportedAt: new Date().toISOString(), state: store.state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lecture-sauvegarde-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Sauvegarde créée");
  }

  function restoreData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.kind !== "fv-reader-backup" || data?.version !== 2 || !data.state) throw new Error("invalid");
        store.replace(data.state);
        location.reload();
      } catch (_) { toast("Sauvegarde invalide"); }
    };
    reader.readAsText(file);
  }

  function registerOffline() {
    if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });

    navigator.serviceWorker
      .register("/lecture/sw.js", { scope: "/lecture/", updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  }

  function bindEvents() {
    els.prev.addEventListener("click", previousPage);
    els.prevEdge.addEventListener("click", previousPage);
    els.next.addEventListener("click", nextPage);
    els.nextEdge.addEventListener("click", nextPage);
    els.authorSelect?.addEventListener("change", async () => {
      const nextId = populateBookSelect(els.authorSelect.value);
      if (nextId) await selectBook(nextId);
    });
    els.bookSelect.addEventListener("change", () => selectBook(els.bookSelect.value));
    els.libraryAuthorFilter?.addEventListener("change", renderLibrary);
    els.chapterSelect.addEventListener("change", () => {
      const item = book.toc?.[Number(els.chapterSelect.value)];
      if (item) jumpTo(book.id, item.page);
    });
    els.pageInput.addEventListener("change", () => jumpTo(book.id, els.pageInput.value));
    els.pageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); jumpTo(book.id, els.pageInput.value); els.pageInput.blur(); }
    });
    els.progress.addEventListener("input", () => { els.pageInput.value = els.progress.value; });
    els.progress.addEventListener("change", () => jumpTo(book.id, els.progress.value));

    els.trailBack.addEventListener("click", goTrailBack);
    els.trailForward.addEventListener("click", goTrailForward);
    els.bookmarkToggle.addEventListener("click", toggleBookmark);
    els.themeToggle.addEventListener("click", cycleTheme);
    els.focusToggle.addEventListener("click", toggleFocus);
    els.focusReturn.addEventListener("click", () => showFocus(false));

    els.searchToggle.addEventListener("click", () => els.searchPanel.hidden ? openSearch() : closeSearch());
    els.searchInput.addEventListener("input", renderSearch);
    els.searchScope.addEventListener("change", renderSearch);
    els.searchClear.addEventListener("click", () => { els.searchInput.value = ""; renderSearch(); els.searchInput.focus(); });
    els.searchPrev.addEventListener("click", () => activateSearch(activeSearchIndex - 1));
    els.searchNext.addEventListener("click", () => activateSearch(activeSearchIndex + 1));

    els.drawerToggle.addEventListener("click", () => els.drawer.hidden ? openDrawer("toc") : closeDrawer());
    els.drawerClose.addEventListener("click", closeDrawer);
    els.drawerBackdrop.addEventListener("click", closeDrawer);
    els.drawerTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-tab]");
      if (button) switchTab(button.dataset.tab);
    });

    els.content.addEventListener("click", (event) => {
      const note = event.target.closest(".reader-footnote-button");
      if (note) { openFootnote(note.dataset.noteText); return; }
      const mark = event.target.closest("[data-annotation-id]");
      if (mark) { openAnnotationEditor(findAnnotation(mark.dataset.annotationId)); return; }
      const pin = event.target.closest("[data-pin-block]");
      if (pin) { toggleMarker(Number(pin.dataset.pinBlock)); event.preventDefault(); }
    });

    document.addEventListener("mouseup", () => setTimeout(captureSelection, 0));
    document.addEventListener("touchend", () => setTimeout(captureSelection, 60));
    els.selectionToolbar.addEventListener("mousedown", (event) => event.preventDefault());
    els.selectionToolbar.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (button) selectionAction(button.dataset.action);
    });

    document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog")?.close()));

    els.annotationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const annotation = findAnnotation(editingAnnotationId);
      if (!annotation) return;
      annotation.color = els.annotationColor.value;
      annotation.note = els.annotationNote.value.trim();
      annotation.tags = parseTags(els.annotationTags.value);
      if (els.annotationReview.checked && !annotation.review) annotation.review = { due: today(), stage: 0 };
      if (!els.annotationReview.checked) annotation.review = null;
      const linkedPage = Number(els.annotationLinkPage.value);
      annotation.link = linkedPage ? { bookId: els.annotationLinkBook.value, page: linkedPage } : null;
      store.save();
      els.annotationDialog.close();
      renderPage(pageIndex, { restoreMarker: false });
      toast("Annotation enregistrée");
    });

    els.annotationDelete.addEventListener("click", () => {
      bookState().annotations = bookState().annotations.filter((a) => a.id !== editingAnnotationId);
      store.save();
      els.annotationDialog.close();
      renderPage(pageIndex, { restoreMarker: false });
    });

    els.bookmarkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const key = String(editingBookmarkPage);
      const value = bookmarks()[key] || { page: editingBookmarkPage, created: Date.now() };
      value.note = els.bookmarkNote.value.trim();
      value.tags = parseTags(els.bookmarkTags.value);
      bookmarks()[key] = value;
      store.save();
      els.bookmarkDialog.close();
      updateBookmarkButton();
      refreshPanel();
    });

    els.bookmarkDelete.addEventListener("click", () => {
      delete bookmarks()[String(editingBookmarkPage)];
      store.save();
      els.bookmarkDialog.close();
      updateBookmarkButton();
      refreshPanel();
    });

    els.compareClose.addEventListener("click", closeCompare);

    els.bookNote.addEventListener("input", () => { bookState().bookNote = els.bookNote.value; store.save(); });
    els.chapterSummary.addEventListener("input", () => { bookState().chapterSummaries[String(currentChapterIndex())] = els.chapterSummary.value; store.save(); });
    els.copyDeepLink.addEventListener("click", () => copyText(deepLink(), "Lien copié"));
    els.extractScope.addEventListener("change", renderExtracts);
    els.tagFilter.addEventListener("input", renderExtracts);

    const settingInputs = [
      [els.fontFamily, "fontFamily", false], [els.fontSize, "fontSize", true], [els.lineHeight, "lineHeight", true],
      [els.textWidth, "textWidth", true], [els.readingSpeed, "readingSpeed", true], [els.citationFormat, "citationFormat", false],
    ];
    settingInputs.forEach(([element, key, numeric]) => element.addEventListener("input", () => {
      store.state.settings[key] = numeric ? Number(element.value) : element.value;
      store.save();
      applySettings();
      if (key === "readingSpeed" && book) updateChapterEstimate();
    }));

    els.textOnly.addEventListener("change", () => { store.state.settings.textOnly = els.textOnly.checked; store.save(); renderPage(pageIndex, { restoreMarker: false }); });
    els.goalMinutes.addEventListener("change", () => { store.state.settings.goalMinutes = Number(els.goalMinutes.value) || 0; store.save(); renderStats(); });
    els.goalPages.addEventListener("change", () => { store.state.settings.goalPages = Number(els.goalPages.value) || 0; store.save(); renderStats(); });
    els.fullscreenButton.addEventListener("click", requestFullscreen);
    els.backupButton.addEventListener("click", backupData);
    els.restoreInput.addEventListener("change", () => { const file = els.restoreInput.files?.[0]; if (file) restoreData(file); });

    els.app.addEventListener("pointermove", () => {
      if (els.app.classList.contains("is-focus")) { els.app.classList.add("is-peek"); scheduleFocusHide(); }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideSelectionToolbar();
        if (!els.searchPanel.hidden) closeSearch();
        if (!els.drawer.hidden) closeDrawer();
        if (els.app.classList.contains("is-focus")) showFocus(false);
        return;
      }
      if (event.target.matches?.("input,textarea,select,button") || event.target.isContentEditable) return;
      if (event.altKey && event.key === "ArrowLeft") { event.preventDefault(); goTrailBack(); return; }
      if (event.altKey && event.key === "ArrowRight") { event.preventDefault(); goTrailForward(); return; }
      if (event.key === "ArrowRight" || event.key === "PageDown") { event.preventDefault(); nextPage(); }
      else if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); previousPage(); }
      else if (event.key === "/") { event.preventDefault(); openSearch(); }
      else if (event.key.toLowerCase() === "b") { event.preventDefault(); toggleBookmark(); }
      else if (event.key.toLowerCase() === "t") { event.preventDefault(); cycleTheme(); }
      else if (event.key.toLowerCase() === "m") { event.preventDefault(); toggleFocus(); }
      else if (event.key.toLowerCase() === "f") { event.preventDefault(); requestFullscreen(); }
    });

    let startX = null;
    let startY = null;
    els.scroll.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches?.[0];
      if (touch) { startX = touch.clientX; startY = touch.clientY; }
    }, { passive: true });
    els.scroll.addEventListener("touchend", (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch || startX === null || startY === null) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      startX = startY = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.35) (dx < 0 ? nextPage : previousPage)();
    }, { passive: true });

    window.addEventListener("beforeunload", () => { flushTime(); store.saveNow(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) flushTime(); });
  }

  async function start() {
    buildBookSelect();
    bindEvents();
    applySettings();
    registerOffline();
    startTimer();

    const params = new URLSearchParams(location.search);
    const requestedId = LIBRARY.some((x) => x.id === params.get("book")) ? params.get("book") : store.state.lastBookId;
    const requestedPage = Number(params.get("page"));
    await selectBook(requestedId, Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : null, { recordTrail: false, resumeToast: !requestedPage });
    updateTrailButtons();
  }

  start();
})();

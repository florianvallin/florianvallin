window.FV_LIBRARY = [
  {
    "id": "therese-avila-chemins-perfection",
    "title": "Les chemins de la perfection",
    "author": "Thérèse d’Avila",
    "pagination": "paper",
    "firstPage": 7,
    "lastPage": 331,
    "mainStartPage": 19,
    "file": "books/therese-avila-chemins-perfection.json?v=20260825-9",
    "category": "Spiritualité · Mystique",
    "tags": ["Thérèse d’Avila", "Mystique", "Spiritualité"]
  },
  {
    "id": "therese-avila-chemin-perfection",
    "title": "Le Chemin de la perfection",
    "author": "Thérèse d’Avila",
    "pagination": "reader",
    "firstPage": 1,
    "lastPage": 43,
    "mainStartPage": 1,
    "file": "books/therese-avila-chemin-perfection.json?v=20260906-1",
    "category": "Spiritualité · Mystique",
    "tags": ["Thérèse d’Avila", "Mystique", "Spiritualité", "Oraison"]
  },
  {
    "id": "therese-avila-chateau-ame",
    "title": "Le Château de l’âme",
    "author": "Thérèse d’Avila",
    "pagination": "reader",
    "firstPage": 1,
    "lastPage": 136,
    "mainStartPage": 5,
    "file": "books/therese-avila-chateau-ame.json?v=20260825-9",
    "category": "Spiritualité · Mystique",
    "tags": ["Thérèse d’Avila", "Mystique", "Spiritualité"]
  },
  {
    "id": "therese-avila-livre-vie",
    "title": "Livre de la vie",
    "author": "Thérèse d’Avila",
    "pagination": "paper",
    "firstPage": 7,
    "lastPage": 527,
    "mainStartPage": 39,
    "file": "books/therese-avila-livre-vie.json?v=20260825-9",
    "category": "Spiritualité · Mystique",
    "tags": ["Thérèse d’Avila", "Mystique", "Spiritualité"]
  }
  ,{
    "id": "jean-croix-oeuvres-completes",
    "title": "Œuvres complètes",
    "author": "Jean de la Croix",
    "pagination": "paper",
    "firstPage": 11,
    "lastPage": 1072,
    "mainStartPage": 45,
    "file": "books/jean-croix-oeuvres-completes.json?v=20260907-1",
    "category": "Spiritualité · Mystique",
    "tags": ["Jean de la Croix", "Mystique", "Spiritualité", "Carmel"]
  }
];

(() => {
  "use strict";

  const EXTERNAL_PREFIX = "__FV_EXTERNAL_BOOK__:";
  const FILTER_ID = "library-author-filter";

  function injectStyles() {
    if (document.getElementById("fv-library-enhancements-style")) return;
    const style = document.createElement("style");
    style.id = "fv-library-enhancements-style";
    style.textContent = `
      .fv-library-filter {
        display: flex;
        align-items: end;
        gap: 12px;
        margin: 0 0 16px;
        padding: 0 0 14px;
        border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
      }
      .fv-library-filter label {
        display: grid;
        gap: 6px;
        min-width: min(280px, 100%);
        font-size: .72rem;
        letter-spacing: .08em;
        text-transform: uppercase;
        opacity: .72;
      }
      .fv-library-filter select {
        width: 100%;
        min-height: 40px;
        border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
        border-radius: 10px;
        padding: 0 34px 0 12px;
        color: inherit;
        background: color-mix(in srgb, Canvas 94%, transparent);
        font: inherit;
        font-size: .9rem;
        letter-spacing: normal;
        text-transform: none;
        outline: none;
      }
      .fv-library-filter select:focus-visible {
        border-color: currentColor;
      }
      .fv-external-book-shell {
        width: 100%;
        min-height: 68vh;
        display: grid;
        grid-template-rows: minmax(560px, 72vh) auto;
        gap: 10px;
      }
      .fv-external-book-frame {
        width: 100%;
        height: 100%;
        min-height: 560px;
        border: 0;
        border-radius: 8px;
        background: #fff;
      }
      .fv-external-book-fallback {
        margin: 0;
        font-size: .78rem;
        text-align: right;
        opacity: .65;
      }
      .fv-external-book-fallback a { color: inherit; }
      @media (max-width: 720px) {
        .fv-library-filter { align-items: stretch; }
        .fv-library-filter label { min-width: 100%; }
        .fv-external-book-shell { grid-template-rows: minmax(480px, 70vh) auto; }
        .fv-external-book-frame { min-height: 480px; }
      }
    `;
    document.head.appendChild(style);
  }

  function initAuthorFilter() {
    const grid = document.getElementById("library-grid");
    if (!grid || document.getElementById(FILTER_ID)) return;

    const authors = [...new Set((window.FV_LIBRARY || []).map((book) => book.author).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "fr"));

    const wrap = document.createElement("div");
    wrap.className = "fv-library-filter";
    const label = document.createElement("label");
    label.setAttribute("for", FILTER_ID);
    label.appendChild(document.createTextNode("Auteur"));
    const select = document.createElement("select");
    select.id = FILTER_ID;
    select.setAttribute("aria-label", "Filtrer les livres par auteur");

    const all = document.createElement("option");
    all.value = "";
    all.textContent = "Tous les auteurs";
    select.appendChild(all);
    authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author;
      option.textContent = author;
      select.appendChild(option);
    });

    label.appendChild(select);
    wrap.appendChild(label);
    grid.insertAdjacentElement("beforebegin", wrap);

    const apply = () => {
      const selected = select.value;
      const cards = [...grid.children].filter((node) => node.classList?.contains("library-card"));
      cards.forEach((card, index) => {
        const meta = (window.FV_LIBRARY || [])[index];
        card.hidden = !!selected && !!meta && meta.author !== selected;
      });
    };

    select.addEventListener("change", apply);
    new MutationObserver(apply).observe(grid, { childList: true });
    apply();
  }

  function initExternalBookRenderer() {
    const content = document.getElementById("page-content");
    if (!content) return;

    const render = () => {
      const marker = [...content.querySelectorAll(".reader-block")].find((block) =>
        String(block.dataset.rawText || "").startsWith(EXTERNAL_PREFIX)
      );
      if (!marker) return;

      const url = String(marker.dataset.rawText || "").slice(EXTERNAL_PREFIX.length).trim();
      if (!/^https:\/\//i.test(url)) return;
      if (content.dataset.externalBookUrl === url && content.querySelector(".fv-external-book-frame")) return;

      const shell = document.createElement("div");
      shell.className = "fv-external-book-shell";

      const frame = document.createElement("iframe");
      frame.className = "fv-external-book-frame";
      frame.src = url;
      frame.title = "Texte du Chemin de la perfection";
      frame.loading = "eager";
      frame.referrerPolicy = "no-referrer";

      const fallback = document.createElement("p");
      fallback.className = "fv-external-book-fallback";
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Ouvrir ce chapitre dans un nouvel onglet";
      fallback.appendChild(link);

      shell.append(frame, fallback);
      content.replaceChildren(shell);
      content.dataset.externalBookUrl = url;
    };

    new MutationObserver(render).observe(content, { childList: true, subtree: true });
    render();
  }

  function init() {
    injectStyles();
    initAuthorFilter();
    initExternalBookRenderer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

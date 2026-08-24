(() => {
  "use strict";

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    ensureBlogLinks();
    initSiteSearch();
    initBlogIndexSearch();
    initNavigation();
    initFaq();
    initBackToTop();
    initMethodologyReveal();
    initReviews();
    initTooltips();
  });

  function ensureBlogLinks() {
    const textsLink = document.querySelector(".nav-links .nav-texts-link");
    if (textsLink && !document.querySelector(".nav-links .nav-blog-link")) {
      const blogLink = document.createElement("a");
      blogLink.className = "nav-blog-link";
      blogLink.href = "/blog/";
      blogLink.textContent = "Blog";
      if (window.location.pathname.startsWith("/blog")) blogLink.setAttribute("aria-current", "page");
      textsLink.insertAdjacentElement("afterend", blogLink);
    }

    const footerTexts = document.querySelector(".footer-container .footer-textes");
    if (footerTexts && !footerTexts.querySelector(".footer-blog-link")) {
      footerTexts.insertAdjacentHTML("beforeend", '<p class="footer-title footer-blog-link"><a href="/blog/">Blog</a></p>');
    }
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function initSiteSearch() {
    const nav = document.querySelector(".nav-links");
    const blogLink = nav?.querySelector(".nav-blog-link");
    if (!nav || !blogLink || nav.querySelector(".nav-site-search")) return;

    const navbar = nav.closest(".navbar");
    const wrap = document.createElement("div");
    wrap.className = "nav-site-search";
    wrap.innerHTML = `
      <button class="nav-site-search-toggle" type="button" aria-label="Rechercher sur le site" aria-expanded="false" aria-controls="site-search-panel">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.4"></circle><path d="m16 16 4 4"></path></svg>
        <span class="nav-site-search-label">Rechercher</span>
      </button>
      <div class="nav-site-search-panel" id="site-search-panel" hidden>
        <div class="nav-site-search-field">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.4"></circle><path d="m16 16 4 4"></path></svg>
          <input type="search" autocomplete="off" spellcheck="false" placeholder="Auteur, notion, titre…" aria-label="Rechercher sur florianvallin.fr">
          <button class="nav-site-search-clear" type="button" aria-label="Effacer la recherche" hidden>×</button>
        </div>
        <div class="nav-site-search-results" aria-live="polite"></div>
      </div>`;
    blogLink.insertAdjacentElement("afterend", wrap);
    nav.classList.add("has-site-search");

    const toggle = wrap.querySelector(".nav-site-search-toggle");
    const panel = wrap.querySelector(".nav-site-search-panel");
    const input = wrap.querySelector("input");
    const clear = wrap.querySelector(".nav-site-search-clear");
    const results = wrap.querySelector(".nav-site-search-results");
    let indexPromise = null;
    let firstResult = null;

    const shortcuts = [
      { title:"Bibliothèque de textes", meta:"Philosophie · Mythologie · Théologie", url:"/textes/", accent:"texts" },
      { title:"Blog", meta:"Repères · programmes · méthode", url:"/blog/", accent:"blog" },
      { title:"Boussole philosophique", meta:"Dictionnaire · chronologie · parcours · ressources", url:"/textes/philosophie/boussole/", accent:"compass" }
    ];

    const loadIndex = () => {
      if (!indexPromise) {
        indexPromise = fetch("/js/site-search-index.json?v=20260816-1", { credentials:"same-origin" })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
          })
          .then((items) => Array.isArray(items) ? items : [])
          .catch(() => []);
      }
      return indexPromise;
    };

    const makeResult = (item, label) => {
      const link = document.createElement("a");
      link.className = "nav-site-search-result";
      link.href = item.url;
      const labelText = String(label || item.kindLabel || "").toLowerCase();
      const accent = item.accent
        || (labelText.includes("mythologie") ? "mythologie"
          : labelText.includes("théologie") || labelText.includes("theologie") ? "theologie"
          : labelText.includes("autres") ? "autres"
          : item.kind === "blog" || labelText.includes("blog") ? "blog"
          : labelText.includes("boussole") ? "compass"
          : labelText.includes("philosophie") ? "philosophie"
          : item.kind === "texte" ? "texts" : "compass");
      link.dataset.searchAccent = accent;
      const kind = document.createElement("span");
      kind.textContent = label || item.kindLabel || "Page";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const meta = document.createElement("small");
      meta.textContent = item.meta || "";
      link.append(kind, title, meta);
      return link;
    };

    const showShortcuts = () => {
      firstResult = null;
      results.replaceChildren();
      const intro = document.createElement("p");
      intro.className = "nav-site-search-hint";
      intro.textContent = "Rechercher un auteur, une notion, un texte ou un billet.";
      const list = document.createElement("div");
      list.className = "nav-site-search-shortcuts";
      shortcuts.forEach((item) => list.append(makeResult(item, "Accès rapide")));
      results.append(intro, list);
    };

    const scoreItem = (item, terms) => {
      const title = normalizeSearchText(item.title);
      const meta = normalizeSearchText(item.meta);
      const keywords = normalizeSearchText(item.keywords);
      const haystack = `${title} ${meta} ${keywords}`;
      if (!terms.every((term) => haystack.includes(term))) return -1;
      let score = 0;
      terms.forEach((term) => {
        if (title === term) score += 120;
        else if (title.startsWith(term)) score += 70;
        else if (title.includes(term)) score += 45;
        if (meta.includes(term)) score += 22;
        if (keywords.includes(term)) score += 14;
      });
      if (item.kind === "texte") score += 4;
      return score;
    };

    const renderSearch = async () => {
      const query = normalizeSearchText(input.value);
      clear.hidden = !query;
      if (!query) {
        showShortcuts();
        return;
      }
      results.innerHTML = '<p class="nav-site-search-loading">Recherche…</p>';
      const items = await loadIndex();
      if (normalizeSearchText(input.value) !== query) return;
      const terms = query.split(" ").filter(Boolean);
      const matches = items
        .map((item) => ({ item, score:scoreItem(item, terms) }))
        .filter((entry) => entry.score >= 0)
        .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "fr"))
        .slice(0,8);
      results.replaceChildren();
      firstResult = null;
      if (!matches.length) {
        const empty = document.createElement("p");
        empty.className = "nav-site-search-empty";
        empty.textContent = "Aucun résultat. Essayez un auteur, une notion ou un mot du titre.";
        results.append(empty);
        return;
      }
      const count = document.createElement("p");
      count.className = "nav-site-search-count";
      count.textContent = `${matches.length} résultat${matches.length > 1 ? "s" : ""} affiché${matches.length > 1 ? "s" : ""}`;
      const list = document.createElement("div");
      list.className = "nav-site-search-list";
      matches.forEach(({item}) => {
        const link = makeResult(item);
        if (!firstResult) firstResult = link;
        list.append(link);
      });
      results.append(count, list);
    };

    let closeTimer = 0;
    const open = () => {
      window.clearTimeout(closeTimer);
      panel.hidden = false;
      wrap.classList.add("is-open");
      navbar?.classList.add("site-search-open");
      toggle.setAttribute("aria-expanded", "true");
      if (!input.value.trim()) showShortcuts();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => panel.classList.add("is-visible"));
      });
      window.setTimeout(() => input.focus({ preventScroll:true }), 170);
    };
    const close = () => {
      wrap.classList.remove("is-open");
      panel.classList.remove("is-visible");
      toggle.setAttribute("aria-expanded", "false");
      closeTimer = window.setTimeout(() => {
        if (!wrap.classList.contains("is-open")) {
          panel.hidden = true;
          navbar?.classList.remove("site-search-open");
        }
      }, 440);
    };

    toggle.addEventListener("click", () => wrap.classList.contains("is-open") ? close() : open());
    input.addEventListener("input", renderSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && firstResult) {
        event.preventDefault();
        window.location.href = firstResult.href;
      }
    });
    clear.addEventListener("click", () => {
      input.value = "";
      clear.hidden = true;
      showShortcuts();
      input.focus();
    });
    document.addEventListener("click", (event) => {
      if (!panel.hidden && !wrap.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        close();
        toggle.focus();
      }
    });
  }

  function initBlogIndexSearch() {
    const search = document.querySelector("[data-blog-search]");
    const grid = document.querySelector("[data-blog-grid]");
    const cards = [...document.querySelectorAll("[data-blog-card]")];
    if (!search || !grid || !cards.length) return;
    const input = search.querySelector("[data-blog-search-input]");
    const clear = search.querySelector("[data-blog-search-clear]");
    const status = document.querySelector("[data-blog-search-status]");
    if (!input || !clear || !status) return;

    const searchable = cards.map((card) => ({
      card,
      haystack:normalizeSearchText(`${card.dataset.blogSearchText || ""} ${card.textContent || ""}`)
    }));

    const apply = () => {
      const query = normalizeSearchText(input.value);
      const terms = query.split(" ").filter(Boolean);
      clear.hidden = !query;
      let visible = 0;
      searchable.forEach(({card,haystack}) => {
        const match = !terms.length || terms.every((term) => haystack.includes(term));
        card.hidden = !match;
        if (match) visible += 1;
      });
      grid.classList.toggle("blog-grid--filtered", Boolean(query));
      status.hidden = !query;
      if (query) status.textContent = visible ? `${visible} billet${visible > 1 ? "s" : ""} trouvé${visible > 1 ? "s" : ""}.` : "Aucun billet ne correspond à cette recherche.";
    };

    input.addEventListener("input", apply);
    clear.addEventListener("click", () => {
      input.value = "";
      apply();
      input.focus();
    });
  }

  function initNavigation() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelectorAll(".nav-links a");
    if (!navbar) return;

    const closeMenu = () => {
      navbar.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    };

    toggle?.addEventListener("click", () => {
      const open = navbar.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });

    const updateNavbar = () => navbar.classList.toggle("scrolled", window.scrollY > 70);
    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();
  }

  function initFaq() {
    document.querySelectorAll(".faq-question").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        if (!item) return;
        const open = item.classList.toggle("active");
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;
    const update = () => button.classList.toggle("visible", window.scrollY > 400);
    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    update();
  }

  function initMethodologyReveal() {
    const steps = [...document.querySelectorAll(".methodologie-steps-grid .stepper-step")];
    if (!steps.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steps.forEach((step) => step.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    steps.forEach((step) => observer.observe(step));
  }

  function initReviews() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const track = root.querySelector("[data-track]");
    const viewport = root.querySelector("[data-viewport]");
    const previous = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const dots = document.querySelector("[data-dots]");
    if (!track || !viewport) return;

    const reviews = [
      { name: "Élodie Jannin", date: "28/02/2025", rating: 5, text: "Explications claires et structurées. Une aide précieuse pour préparer mes échéances en licence de philosophie. On sent l'exigence, mais aussi l'envie sincère de faire progresser." },
      { name: "Olivier Le Pioufle", date: "01/03/2025", rating: 5, text: "Les conseils reçus ont été déterminants pour l'obtention de mon master et la réalisation de mon mémoire. Un travail rigoureux, avec beaucoup de pédagogie et de patience." },
      { name: "Louna Schroetter", date: "21/03/2026", rating: 5, text: "Je recommande vivement pour les études de philosophie. Florian est de très bon conseil, très pédagogue et passionné par son travail." },
      { name: "Marion Wright", date: "23/03/2026", rating: 5, text: "Un professeur attentif, rigoureux et à l'écoute. Ses cours sont clairs et répondent aux besoins personnels. Les méthodes apprises me servent encore aujourd'hui." }
    ];

    const googleBusinessUrl = "https://share.google/fLWaP9lVpo7r8feO4";
    const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

    track.innerHTML = reviews.map((review) => `
      <a
        class="review-card"
        href="${googleBusinessUrl}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Voir l’avis de ${review.name} sur Google"
      >
        <div class="review-head">
          <div class="review-person">
            <span class="review-avatar" aria-hidden="true">${initials(review.name)}</span>
            <div><div class="review-name">${review.name}</div><div class="review-date">${review.date}</div></div>
          </div>
          <span class="review-google-mini" aria-hidden="true">G</span>
        </div>
        <div class="review-stars" aria-label="${review.rating} étoiles">${"★".repeat(review.rating)}</div>
        <p class="review-text">${review.text}</p>
      </a>`).join("");

    let active = 0;
    let perView = 3;
    let timer = null;

    const cards = () => [...track.querySelectorAll(".review-card")];
    const calculatePerView = () => viewport.clientWidth <= 620 ? 1 : viewport.clientWidth <= 980 ? 2 : 3;

    const renderDots = () => {
      if (!dots) return;
      dots.innerHTML = reviews.map((_, index) => `<button type="button" class="reviews-dot${index === active ? " is-active" : ""}" data-review-dot="${index}" aria-label="Afficher l'avis ${index + 1}"></button>`).join("");
      dots.querySelectorAll("[data-review-dot]").forEach((dot) => dot.addEventListener("click", () => {
        active = Number(dot.dataset.reviewDot);
        update();
        restart();
      }));
    };

    const update = () => {
      perView = calculatePerView();
      const allCards = cards();
      const first = allCards[0];
      const step = first ? first.getBoundingClientRect().width + 18 : 0;
      const maxStart = Math.max(0, reviews.length - perView);
      const start = Math.min(maxStart, Math.max(0, active - (perView > 1 ? 1 : 0)));
      track.style.transform = `translateX(${-start * step}px)`;
      allCards.forEach((card, index) => card.classList.toggle("is-active", index === active));
      previous && (previous.disabled = active === 0);
      next && (next.disabled = active === reviews.length - 1);
      dots?.querySelectorAll(".reviews-dot").forEach((dot, index) => dot.classList.toggle("is-active", index === active));
    };

    const go = (direction) => {
      active = Math.max(0, Math.min(reviews.length - 1, active + direction));
      update();
      restart();
    };
    previous?.addEventListener("click", () => go(-1));
    next?.addEventListener("click", () => go(1));

    let startX = 0;
    viewport.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    }, { passive: true });

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        active = active >= reviews.length - 1 ? 0 : active + 1;
        update();
      }, 6000);
    };

    renderDots();
    update();
    restart();
    window.addEventListener("resize", update);
  }

  function initTooltips() {
    const targets = [...document.querySelectorAll(".info-tooltip")];
    if (!targets.length) return;
    const tooltip = document.createElement("div");
    tooltip.className = "floating-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tooltip);
    let activeTarget = null;

    const position = (target) => {
      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const margin = 14;
      let left = targetRect.left + targetRect.width / 2;
      left = Math.max(margin + tooltipRect.width / 2, Math.min(window.innerWidth - margin - tooltipRect.width / 2, left));
      const below = targetRect.top < tooltipRect.height + 18;
      tooltip.classList.toggle("is-below", below);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${below ? targetRect.bottom : targetRect.top}px`;
    };

    const show = (target) => {
      const text = target.dataset.tooltip;
      if (!text) return;
      activeTarget = target;
      tooltip.textContent = text;
      tooltip.classList.add("is-visible");
      tooltip.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => position(target));
    };
    const hide = () => {
      activeTarget = null;
      tooltip.classList.remove("is-visible", "is-below");
      tooltip.setAttribute("aria-hidden", "true");
    };

    targets.forEach((target) => {
      target.addEventListener("mouseenter", () => show(target));
      target.addEventListener("mouseleave", hide);
      target.addEventListener("focus", () => show(target));
      target.addEventListener("blur", hide);
    });
    window.addEventListener("scroll", () => activeTarget && position(activeTarget), { passive: true });
    window.addEventListener("resize", () => activeTarget && position(activeTarget));
  }
})();

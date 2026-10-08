(() => {
  const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (document.querySelector('script[data-fv-site-tools], script[src*="/js/site-tools.js"]')) return;
  const script = document.createElement("script");
  const localMain = localHost && /^\/main(?:\/|$)/.test(window.location.pathname);
  script.src = `${localMain ? "/main" : ""}/js/site-tools.js?v=20261004-home-index1`;
  script.defer = true;
  script.dataset.fvSiteTools = "";
  document.head.append(script);
})();

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
    initOrganisedHeader();
    ensureBlogLinks();
    enhanceNavigationShortcuts();
    initNavigation();
    initFaq();
    initBackToTop();
    initMethodologyReveal();
    initReviews();
    initTooltips();
    enhanceFooter();
    initBlogIndexFilters();
    initGlobalSearch();
    initStudentAccess();
  });

  function initOrganisedHeader() {
    const navbar = document.querySelector(".navbar");
    const container = navbar?.querySelector(".nav-container");
    const nav = container?.querySelector(".nav-links");
    const brand = container?.querySelector(".nav-brand");
    const toggle = container?.querySelector(".nav-toggle");
    if (!container || !nav || !brand || !toggle || navbar.classList.contains("ph-header-organised")) return;

    const script = document.querySelector('script[src*="js/script.js"]');
    const siteRoot = script ? new URL("../", script.src).pathname : "/";
    const existingLinks = [...nav.querySelectorAll("a")];
    const takeLink = (className, label, destination, hash = "") => {
      const link = existingLinks.find((item) => item.classList.contains(className) ||
        (hash && new URL(item.href).hash === hash)) || document.createElement("a");
      link.classList.add(className);
      link.href = destination;
      link.textContent = label;
      return link;
    };
    const home = `${siteRoot}index.html`;
    const onHome = window.location.pathname === siteRoot || window.location.pathname === home;
    const homeAnchor = (hash) => onHome ? hash : `${home}${hash}`;
    const texts = takeLink("nav-texts-link", "Textes", `${siteRoot}textes/`);
    const blog = takeLink("nav-blog-link", "Blog", `${siteRoot}blog/`);
    const services = takeLink("nav-services-link", "Prestations", homeAnchor("#philosophie"), "#philosophie");
    const about = takeLink("nav-about-link", "Qui suis-je ?", homeAnchor("#quisuisje"), "#quisuisje");
    const faq = takeLink("nav-faq-link", "FAQ", homeAnchor("#faq"), "#faq");
    const tools = takeLink("nav-tools-link", "Outils", `${siteRoot}outils/`);
    const contact = takeLink("nav-contact-link", "Contactez-moi", homeAnchor("#contact"), "#contact");

    const makeGroup = (label, className, links) => {
      const group = document.createElement("details");
      group.className = `nav-group ${className}`;
      const summary = document.createElement("summary");
      summary.textContent = label;
      const chevron = document.createElement("span");
      chevron.className = "nav-group-chevron";
      chevron.setAttribute("aria-hidden", "true");
      summary.append(chevron);
      const panel = document.createElement("div");
      panel.className = "nav-group-links";
      panel.append(...links);
      group.append(summary, panel);
      return group;
    };
    const explorer = makeGroup("Explorer", "nav-group-explorer", [texts, blog]);
    const information = makeGroup("À propos", "nav-group-about", [about, faq]);
    const mobileContact = contact.cloneNode(true);
    mobileContact.classList.add("nav-contact-mobile");
    contact.classList.add("nav-contact-desktop");
    nav.replaceChildren(explorer, tools, services, information, mobileContact);
    nav.id ||= "primary-navigation";

    brand.href = home;
    const logo = brand.querySelector(".nav-brand-logo");
    if (logo) {
      logo.alt = "";
      logo.width = 40;
      logo.height = 40;
    }
    const wordmark = document.createElement("span");
    wordmark.className = "nav-brand-name";
    wordmark.textContent = "Philosophal";
    brand.append(wordmark);

    const search = document.createElement("button");
    search.type = "button";
    search.className = "nav-search-trigger";
    search.dataset.siteSearchOpen = "";
    search.setAttribute("aria-label", "Rechercher sur le site");
    search.setAttribute("aria-keyshortcuts", "R");
    search.title = "Rechercher sur le site — raccourci R";
    search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.4"></circle><path d="m16 16 4 4"></path></svg>';
    toggle.setAttribute("aria-controls", nav.id);
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span class="nav-menu-word">Menu</span>';
    const actions = document.createElement("div");
    actions.className = "nav-header-actions";
    actions.append(search, contact, toggle);
    container.replaceChildren(brand, nav, actions);
    navbar.classList.add("ph-header-organised");

    const canonicalPath = (pathname) => pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
    const updateCurrentLinks = () => {
      const currentPath = canonicalPath(window.location.pathname);
      navbar.querySelectorAll("nav a, .nav-contact-desktop").forEach((link) => {
        const url = new URL(link.href);
        const samePath = canonicalPath(url.pathname) === currentPath;
        const current = samePath && (url.hash ? url.hash === window.location.hash : !window.location.hash);
        if (current) link.setAttribute("aria-current", url.hash ? "location" : "page");
        else link.removeAttribute("aria-current");
      });
      explorer.classList.toggle("has-current-link", window.location.pathname.startsWith(`${siteRoot}textes/`) ||
        window.location.pathname.startsWith(`${siteRoot}blog/`));
      information.classList.toggle("has-current-link", !!information.querySelector("[aria-current]"));
    };
    updateCurrentLinks();
    window.addEventListener("hashchange", updateCurrentLinks);
  }

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

  function enhanceNavigationShortcuts() {
    const shortcuts = [
      [".nav-texts-link", "T", "extes"],
      [".nav-blog-link", "B", "log"]
    ];

    shortcuts.forEach(([selector, key, rest]) => {
      document.querySelectorAll(selector).forEach((link) => {
        if (link.querySelector(".nav-shortcut-letter")) return;
        const label = `${key}${rest}`;
        if (link.textContent.trim() !== label) return;
        link.replaceChildren();
        const letter = document.createElement("span");
        letter.className = "nav-shortcut-letter";
        letter.textContent = key;
        letter.setAttribute("aria-hidden", "true");
        link.append(letter, document.createTextNode(rest));
        link.setAttribute("aria-label", `${label} — raccourci clavier ${key}`);
        link.title = `Raccourci clavier : ${key}`;
      });
    });
  }

  function initNavigation() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    if (!navbar) return;
    const groups = [...navbar.querySelectorAll(".nav-group")];
    const mobile = window.matchMedia("(max-width: 900px)");

    const closeGroups = () => groups.forEach((group) => { group.open = false; });
    const closeMenu = () => {
      closeGroups();
      navbar.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Ouvrir le menu");
    };

    toggle?.addEventListener("click", () => {
      const open = navbar.classList.toggle("nav-open");
      if (!open) closeGroups();
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    groups.forEach((group) => group.addEventListener("toggle", () => {
      if (!group.open || mobile.matches) return;
      groups.forEach((other) => { if (other !== group) other.open = false; });
    }));
    navbar.querySelectorAll("a, [data-site-search-open]").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("philosophal:searchopen", closeMenu);
    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) closeMenu();
    });
    navbar.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!navbar.contains(document.activeElement)) closeMenu();
      }, 0);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector(".site-search-shell:not([hidden])")) return;
      const openGroup = event.target.closest?.(".nav-group[open]") || groups.find((group) => group.open);
      if (openGroup) {
        closeGroups();
        openGroup.querySelector("summary")?.focus();
        event.preventDefault();
      } else if (navbar.classList.contains("nav-open")) {
        closeMenu();
        toggle?.focus();
        event.preventDefault();
      }
    });
    mobile.addEventListener("change", closeMenu);

    const updateNavbar = () => {
      const compact = navbar.classList.contains("scrolled");
      navbar.classList.toggle("scrolled", window.scrollY > (compact ? 12 : 48));
    };
    let scrollFramePending = false;
    window.addEventListener("scroll", () => {
      if (scrollFramePending) return;
      scrollFramePending = true;
      window.requestAnimationFrame(() => {
        scrollFramePending = false;
        updateNavbar();
      });
    }, { passive: true });
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
    const items = [...document.querySelectorAll("#methodologie .methodo-reveal")];
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = items.indexOf(entry.target);
        window.setTimeout(() => entry.target.classList.add("is-visible"), Math.max(0, index) * 70);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    items.forEach((item) => observer.observe(item));
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
      { name: "Didier Marlot", date: "16/09/2026", rating: 5, text: "Quand la philosophie devient un vrai plaisir d\'apprendre ! Tout est là : convivialité, rigueur, explications structurées et approfondies, connaissances inépuisables... Un vrai bonheur pour l\'adulte que je suis d\'avoir trouvé la perle « philosophique » en la personne de Florian !", url: "https://share.google/2xTdqNWDUXxZtW5YY" },
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
        href="${review.url || googleBusinessUrl}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Voir l’avis de ${review.name} sur Google"
      >
        <div class="review-head">
          <div class="review-person">
            <span class="review-avatar" aria-hidden="true">${initials(review.name)}</span>
            <div><div class="review-name">${review.name}</div>${review.date ? `<div class="review-date">${review.date}</div>` : ""}</div>
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

  function normalizeSearch(value) {
    return String(value || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function enhanceFooter() {
    document.querySelectorAll(".footer-textes").forEach((column) => {
      if (!column.querySelector(".footer-blog-link")) {
        column.insertAdjacentHTML("beforeend", '<p class="footer-title footer-blog-link"><a href="/blog/">Blog</a></p>');
      }
    });

    // L’espace Art reste volontairement discret : aucun lien public dans le footer.
    document.querySelectorAll(".footer-art-link").forEach((item) => item.remove());
    document.querySelectorAll("[data-student-access]").forEach((item) => {
      if (!item.closest(".footer-right")) item.remove();
    });

    document.querySelectorAll(".footer-right").forEach((column) => {
      let stack = column.querySelector(".footer-access-stack");
      if (!stack) {
        stack = document.createElement("div");
        stack.className = "footer-access-stack";
        column.appendChild(stack);
      }

      let accessButton = column.querySelector("[data-student-access]");
      if (!accessButton) {
        stack.insertAdjacentHTML("beforeend", '<button class="footer-student-access" type="button" data-student-access>S\'identifier</button>');
        accessButton = stack.querySelector("[data-student-access]");
      } else if (!stack.contains(accessButton)) {
        stack.appendChild(accessButton);
      }

      if (!stack.querySelector(".footer-shortcut-hint")) {
        stack.insertAdjacentHTML("beforeend", '<p class="footer-shortcut-hint" aria-label="Afficher les raccourcis clavier : Maj plus point d’interrogation"><span>Raccourcis</span><kbd>Maj</kbd><i>+</i><kbd>?</kbd></p>');
      }
    });
  }

  function initBlogIndexFilters() {
    const root = document.querySelector("[data-blog-tools]");
    if (!root) return;
    const buttons = [...root.querySelectorAll("[data-blog-filter]")];
    const input = root.querySelector("[data-blog-search]");
    const cards = [...document.querySelectorAll("[data-blog-card]")];
    const count = document.querySelector("[data-blog-count]");
    const empty = document.querySelector("[data-blog-empty]");
    let topic = "all";

    const render = () => {
      const query = normalizeSearch(input?.value);
      let visible = 0;
      cards.forEach((card) => {
        const topics = normalizeSearch(card.dataset.blogTopic).split(" ");
        const haystack = normalizeSearch(`${card.textContent} ${card.dataset.blogSearch || ""}`);
        const topicMatch = topic === "all" || topics.includes(topic);
        const queryMatch = !query || query.split(" ").every((word) => haystack.includes(word));
        const show = topicMatch && queryMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = `${visible} billet${visible > 1 ? "s" : ""}`;
      if (empty) empty.hidden = visible !== 0;
    };

    buttons.forEach((button) => button.addEventListener("click", () => {
      topic = button.dataset.blogFilter || "all";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      render();
    }));
    input?.addEventListener("input", render);
    render();
  }

  function initGlobalSearch() {
    if (!document.getElementById("philosophal-search-style")) {
      const stylesheet = document.createElement("link");
      stylesheet.id = "philosophal-search-style";
      stylesheet.rel = "stylesheet";
      stylesheet.href = "/css/search.css?v=20261008-recherche1";
      document.head.append(stylesheet);
    }
    const nav = document.querySelector(".nav-links");
    if (nav && !document.querySelector(".navbar [data-site-search-open]")) {
      const anchor = nav.querySelector(".nav-tools-link") || nav.querySelector(".nav-blog-link");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav-search-trigger";
      button.dataset.siteSearchOpen = "";
      button.setAttribute("aria-label", "Rechercher sur le site");
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.4"></circle><path d="m16 16 4 4"></path></svg><kbd>R</kbd>';
      if (anchor) anchor.insertAdjacentElement("afterend", button); else nav.prepend(button);
    }

    if (!document.querySelector("[data-site-search-dialog]")) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="site-search-shell" data-site-search-dialog hidden>
          <button class="site-search-backdrop" type="button" data-site-search-close aria-label="Fermer la recherche"></button>
          <section class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
            <header class="site-search-head">
              <div><span>Recherche du site</span><h2 id="site-search-title">Que cherchez-vous ?</h2></div>
              <button class="site-search-close" type="button" data-site-search-close aria-label="Fermer">×</button>
            </header>
            <label class="site-search-field">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.4"></circle><path d="m16 16 4 4"></path></svg>
              <input type="search" autocomplete="off" spellcheck="false" placeholder="Ex. liberté, désir, Kant, bonheur…" aria-label="Rechercher sur le site" data-site-search-input>
              <kbd>Esc</kbd>
            </label>
            <div class="site-search-hints" data-site-search-hints><button type="button" data-site-search-example="liberté">Liberté</button><button type="button" data-site-search-example="désir">Désir</button><button type="button" data-site-search-example="Kant">Kant</button><button type="button" data-site-search-example="religion">Religion</button></div>
            <div class="site-search-status" role="status" data-site-search-status>Commencez à écrire pour chercher dans les parcours, les textes, le blog et les dictionnaires.</div>
            <div class="site-search-results" data-site-search-results></div>
          </section>
        </div>`);
    }

    const shell = document.querySelector("[data-site-search-dialog]");
    const input = shell?.querySelector("[data-site-search-input]");
    const results = shell?.querySelector("[data-site-search-results]");
    const status = shell?.querySelector("[data-site-search-status]");
    let dataPromise = null;
    let indexPromise = null;
    let searchTimer = null;
    let searchVersion = 0;
    let composing = false;
    let opener = null;
    const inertElements = new Map();
    const yieldToInput = () => new Promise((resolve) => setTimeout(resolve, 0));

    const cancelSearch = () => {
      clearTimeout(searchTimer);
      searchTimer = null;
      searchVersion += 1;
    };

    const ensureData = () => {
      if (window.FV_SITE_SEARCH_DATA) return Promise.resolve(window.FV_SITE_SEARCH_DATA);
      if (dataPromise) return dataPromise;
      dataPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/js/site-search-data.js?v=20260923-github-refresh1";
        script.onload = () => resolve(window.FV_SITE_SEARCH_DATA || []);
        script.onerror = () => { script.remove(); reject(new Error("site-search-data")); };
        document.head.append(script);
      }).catch((error) => {
        dataPromise = null;
        throw error;
      });
      return dataPromise;
    };

    const escapeHtml = (value) => String(value || "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
    const highlight = (value, query) => {
      const tokens = normalizeSearch(query).split(" ").filter((token) => token.length > 1);
      if (!tokens.length) return escapeHtml(value);
      return String(value || "").split(/([\p{L}\p{N}’'-]+)/gu).map((part) => {
        const normalized = normalizeSearch(part);
        const match = normalized && tokens.some((token) => normalized.includes(token));
        return match ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part);
      }).join("");
    };

    const synonymMap = {
      "liberte":["liberte","libre","autonomie","emancipation"],
      "desir":["desir","passion","manque","appetit"],
      "bonheur":["bonheur","heureux","plaisir"],
      "religion":["religion","dieu","foi","croyance"],
      "travail":["travail","labeur","activite"],
      "verite":["verite","vrai","certitude"]
    };

    const ensureIndex = () => {
      if (indexPromise) return indexPromise;
      indexPromise = (async () => {
        const data = await ensureData();
        const index = [];
        let deadline = performance.now() + 6;
        for (const item of data) {
          const title = normalizeSearch(item.title);
          const meta = normalizeSearch(item.meta);
          const keywords = normalizeSearch(item.keywords);
          const excerpt = normalizeSearch(item.excerpt);
          index.push({ item, title, meta, keywords, excerpt,
            all: `${title} ${meta} ${keywords} ${excerpt}`,
            titleWords: new Set(title.split(" ")), keywordWords: new Set(keywords.split(" ")) });
          if (performance.now() >= deadline) {
            await yieldToInput();
            deadline = performance.now() + 6;
          }
        }
        return index;
      })().catch((error) => { indexPromise = null; throw error; });
      return indexPromise;
    };

    const scoreItem = (entry, q, groups) => {
      const { item, title, meta, keywords, excerpt, all, titleWords, keywordWords } = entry;
      if (!groups.every((variants) => variants.some((variant) => all.includes(variant)))) return 0;
      let score = Number(item.boost || 0);
      if (title === q) score += 220;
      if (title.includes(q)) score += 130;
      groups.forEach((variants) => variants.forEach((term, variantIndex) => {
        const synonymFactor = variantIndex === 0 ? 1 : .42;
        if (titleWords.has(term)) score += 70 * synonymFactor;
        else if (title.includes(term)) score += 45 * synonymFactor;
        if (keywordWords.has(term)) score += 60 * synonymFactor;
        else if (keywords.includes(term)) score += 28 * synonymFactor;
        if (meta.includes(term)) score += 20 * synonymFactor;
        if (excerpt.includes(term)) score += 8 * synonymFactor;
      }));
      const typeBoost = {"Parcours":80,"Thème":65,"Blog":20,"Texte":15,"Dictionnaire":5,"Bible":0};
      score += typeBoost[item.type] || 0;
      return score;
    };

    const renderResults = async (version = searchVersion) => {
      if (!input || !results || !status) return;
      const isCurrent = () => version === searchVersion && !shell.hidden;
      if (!isCurrent()) return;
      const query = input.value.trim();
      if (query.length < 2) {
        results.innerHTML = "";
        status.textContent = "Commencez à écrire pour chercher dans les parcours, les textes, le blog et les dictionnaires.";
        return;
      }
      status.textContent = "Recherche…";
      results.setAttribute("aria-busy", "true");
      try {
        const index = await ensureIndex();
        if (!isCurrent()) return;
        const q = normalizeSearch(query);
        const groups = q.split(" ").filter(Boolean).map((term) => synonymMap[term] || [term]);
        const found = [];
        let deadline = performance.now() + 6;
        for (const entry of index) {
          const score = groups.length ? scoreItem(entry, q, groups) : 0;
          if (score > 0) {
            const place = found.findIndex((candidate) => score > candidate.score);
            if (place >= 0) found.splice(place, 0, { item: entry.item, score });
            else if (found.length < 12) found.push({ item: entry.item, score });
            if (found.length > 12) found.pop();
          }
          if (performance.now() >= deadline) {
            await yieldToInput();
            if (!isCurrent()) return;
            deadline = performance.now() + 6;
          }
        }
        if (!isCurrent()) return;
        status.textContent = found.length ? `${found.length} résultat${found.length > 1 ? "s" : ""} parmi les plus pertinents.` : "Aucun résultat. Essayez un auteur, une notion ou un mot voisin.";
        results.innerHTML = found.map(({item}) => `
          <a class="site-search-result" href="${escapeHtml(item.url)}">
            <span class="site-search-result-type">${escapeHtml(item.type || "Ressource")}</span>
            <strong>${highlight(item.title, query)}</strong>
            ${item.meta ? `<small>${highlight(item.meta, query)}</small>` : ""}
            ${item.excerpt ? `<p>${highlight(item.excerpt, query)}</p>` : ""}
            <i aria-hidden="true">→</i>
          </a>`).join("");
      } catch (_) {
        if (isCurrent()) status.textContent = "La recherche n’a pas pu être chargée.";
      } finally {
        if (isCurrent()) results.removeAttribute("aria-busy");
      }
    };

    const queueSearch = (immediate = false) => {
      cancelSearch();
      results?.removeAttribute("aria-busy");
      if (composing) return;
      if (input?.value.trim().length < 2 || immediate) {
        renderResults(searchVersion);
        return;
      }
      const version = searchVersion;
      searchTimer = setTimeout(() => { searchTimer = null; renderResults(version); }, 160);
    };

    const open = (seed = "") => {
      if (!shell || !input) return;
      if (shell.hidden) opener = document.activeElement;
      document.dispatchEvent(new Event("philosophal:searchopen"));
      shell.hidden = false;
      for (const element of document.body.children) {
        if (element === shell || element.contains(shell) || element.matches("script,style,link")) continue;
        if (!inertElements.has(element)) inertElements.set(element, element.inert);
        element.inert = true;
      }
      document.body.classList.add("site-search-open");
      if (seed) input.value = seed;
      input.focus({preventScroll:true});
      ensureIndex().catch(() => {});
      queueSearch(true);
    };
    const close = () => {
      if (!shell) return;
      cancelSearch();
      composing = false;
      results?.removeAttribute("aria-busy");
      shell.hidden = true;
      document.body.classList.remove("site-search-open");
      inertElements.forEach((wasInert, element) => { element.inert = wasInert; });
      inertElements.clear();
      if (opener?.isConnected) {
        const summary = opener.closest(".nav-group")?.querySelector("summary");
        const toggle = opener.closest(".navbar")?.querySelector(".nav-toggle");
        const collapsedGroup = opener.closest(".nav-group:not([open]) .nav-group-links");
        const target = [collapsedGroup ? summary : opener, summary, toggle].find((element) => element?.getClientRects().length);
        target?.focus({ preventScroll: true });
      }
    };

    window.FVSiteSearch = { open, close };

    document.querySelectorAll("[data-site-search-open]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        open();
        // Le clic sur le bouton / la touche visuelle « R » doit permettre
        // de commencer à taper immédiatement, sans second clic dans le champ.
        if (input && typeof input.setSelectionRange === "function") {
          const end = input.value.length;
          input.setSelectionRange(end, end);
        }
      });
    });
    shell?.querySelectorAll("[data-site-search-close]").forEach((button) => button.addEventListener("click", close));
    shell?.querySelectorAll("[data-site-search-example]").forEach((button) => button.addEventListener("click", () => {
      if (!input) return;
      input.value = button.dataset.siteSearchExample || "";
      input.focus();
      queueSearch(true);
    }));
    input?.addEventListener("input", (event) => {
      if (event.isComposing) { cancelSearch(); return; }
      queueSearch();
    });
    input?.addEventListener("compositionstart", () => { composing = true; cancelSearch(); });
    input?.addEventListener("compositionend", () => { composing = false; queueSearch(); });
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing && !composing) {
        event.preventDefault(); queueSearch(true);
      }
    });

    try {
      if (sessionStorage.getItem("fv-open-site-search") === "1") {
        sessionStorage.removeItem("fv-open-site-search");
        open();
      }
    } catch (_) {}

    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && shell && !shell.hidden) {
        const controls = [...shell.querySelectorAll('.site-search-panel a[href], .site-search-panel button, .site-search-panel input')]
          .filter((element) => !element.disabled && element.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || !shell.contains(document.activeElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !shell.contains(document.activeElement))) {
          event.preventDefault(); first?.focus();
        }
      }
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.matches("input,textarea,select") || target.isContentEditable);
      if (!typing && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLocaleLowerCase("fr") === "r") {
        event.preventDefault();
        open();
      } else if (event.key === "Escape" && !shell?.hidden) {
        close();
      }
    });
  }

  function initStudentAccess() {
    if (!document.querySelector("[data-student-dialog]")) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="student-access-shell" data-student-dialog hidden>
          <button class="student-access-backdrop" type="button" data-student-close aria-label="Fermer"></button>

          <section class="student-access-panel" role="dialog" aria-modal="true" aria-labelledby="student-access-title">
            <button class="student-access-close" type="button" data-student-close aria-label="Fermer">×</button>
            <span>Espace élève</span>
            <h2 id="student-access-title">S’identifier</h2>

            <form data-student-form>
              <label for="student-password">Mot de passe</label>
              <div>
                <input
                  id="student-password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="Mot de passe"
                  data-student-password
                >
                <button type="submit">Accéder <span aria-hidden="true">→</span></button>
              </div>
              <p data-student-feedback aria-live="polite"></p>
            </form>
          </section>
        </div>`);
    }

    const shell = document.querySelector("[data-student-dialog]");
    const input = shell?.querySelector("[data-student-password]");
    const feedback = shell?.querySelector("[data-student-feedback]");
    let navigating = false;

    const open = () => {
      if (!shell || !input) return;
      shell.hidden = false;
      if (feedback) feedback.textContent = "";
      requestAnimationFrame(() => input.focus({ preventScroll: true }));
    };

    const close = () => {
      if (shell) shell.hidden = true;
    };

    // API légère utilisée par les raccourcis globaux (touche S).
    window.FVStudentAccess = { open, close };

    const enter = async () => {
      if (navigating) return;
      navigating=true;
      if(feedback)feedback.textContent="Vérification…";
      try {
        await window.FV_PRIVATE_ACCESS.ready;
        const role=await window.FV_PRIVATE_ACCESS.unlockRole(input.value);
        if(!role){if(feedback)feedback.textContent="Mot de passe incorrect.";navigating=false;return;}
        window.location.href=role==="private"?"/atelier/":"/mediatheque/";
      }catch(error){if(feedback)feedback.textContent=error.message;navigating=false;}
    };

    document
      .querySelectorAll("[data-student-access]")
      .forEach((button) => button.addEventListener("click", open));

    shell
      ?.querySelectorAll("[data-student-close]")
      .forEach((button) => button.addEventListener("click", close));

    shell
      ?.querySelector("[data-student-form]")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        enter(true);
      });

    input?.addEventListener("input",()=>{if(feedback)feedback.textContent="";});

    shell?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

})();

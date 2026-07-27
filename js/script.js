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
    initNavigation();
    initFaq();
    initBackToTop();
    initMethodologyReveal();
    initReviews();
    initTooltips();
  });

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

    const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    track.innerHTML = reviews.map((review) => `
      <article class="review-card">
        <div class="review-head">
          <div class="review-person">
            <span class="review-avatar" aria-hidden="true">${initials(review.name)}</span>
            <div><div class="review-name">${review.name}</div><div class="review-date">${review.date}</div></div>
          </div>
          <span class="review-google-mini" aria-hidden="true">G</span>
        </div>
        <div class="review-stars" aria-label="${review.rating} étoiles">${"★".repeat(review.rating)}</div>
        <p class="review-text">${review.text}</p>
      </article>`).join("");

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

// ===============================
// Chargement dynamique du header
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  fetch("partials/header.html")
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("afterbegin", data);
      initNavbar(); // on initialise le menu après insertion
    });

  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav-links");

    if (!navbar || !toggle || !nav) return;

    function closeMenu() {
  navbar.classList.remove("nav-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function openMenu() {
  navbar.classList.add("nav-open");
  toggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

    toggle.addEventListener("click", () => {
      const isOpen = navbar.classList.contains("nav-open");
      isOpen ? closeMenu() : openMenu();
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }
});


document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("active");
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const scrollY = window.scrollY;

  // Limite à 300px pour éviter un blur excessif
  const maxScroll = 300;
  const scrollRatio = Math.min(scrollY / maxScroll, 1);

  // Blur progressif de 6px à 12px
  const blurValue = 6 + (6 * scrollRatio);

  // Opacité progressive de 0.8 à 0.95
  const opacityValue = 0.8 + (0.15 * scrollRatio);

  navbar.style.backdropFilter = `blur(${blurValue}px)`;
  navbar.style.background = `rgba(255, 255, 255, ${opacityValue})`;
});

// ===============================
// BACK TO TOP – Scroll fluide
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

// Animation au scroll : étapes méthodologie
(() => {
  const steps = document.querySelectorAll('.methodologie-steps-grid .stepper-step');
  if (!steps.length) return;

  // Si l'utilisateur préfère réduire les animations, on affiche tout directement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    steps.forEach(s => s.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // une seule fois
      }
    });
  }, { threshold: 0.18 });

  steps.forEach(s => io.observe(s));
})();

// ===============================
// Animation au scroll : bloc "clarification" (2 cartes)
// ===============================
(() => {
  const cards = document.querySelectorAll(
    '.clarification-grid .before-clarification, .clarification-grid .after-clarification'
  );
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    cards.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();

// ===============================
// AVIS (Google) — carrousel simple
// ===============================
(() => {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const track = root.querySelector('[data-track]');
  const viewport = root.querySelector('[data-viewport]');
  const btnPrev = root.querySelector('[data-prev]');
  const btnNext = root.querySelector('[data-next]');
  const dotsWrap = document.querySelector('[data-dots]');

  // ---- À REMPLACER par tes vrais avis (copier/coller) ----
  // Conseil : garde des extraits courts, lisibles, sans surcharger.
  const reviewsData = [
  {
    name: "Elodie Jannin",
    date: "2025-02-28",
    rating: 5,
    text: "Explications claires et structurées. Une aide précieuse pour préparer mes échéances en licence de philosophie. On sent l'exigence, mais aussi l'envie sincère de faire progresser."
  },
  {
    name: "Olivier Le Pioufle",
    date: "2025-03-01",
    rating: 5,
    text: "J'ai suivi des cours en parallèle de mes études de philosophie. Les conseils reçus ont été déterminants pour l'obtention de mon master et la réalisation de mon mémoire. Un travail rigoureux sur la dissertation et les commentaires, avec beaucoup de pédagogie et de patience."
  },
  {
    name: "Louna Schroetter",
    date: "2026-03-21",
    rating: 5,
    text: "Je recommande vivement si vous êtes en études de philosophie !\nIl est de très bon conseil et très pédagogue. Et ça ce voit qu'il aime se qu'il fait !"
  },
  {
    name: "Marion Wright",
    date: "2026-03-23",
    rating: 5,
    text: "Monsieur Vallin est un professeur attentif, rigoureux à l'écoute. Ses cours sont clairs et répondent bien aux besoins personnels. Il a une grande palette d'outils pour mieux comprendre et structurer la compréhension et la manière de travailler.\nIl m'a beaucoup aidée en parallèle de mes études et grâce à lui j'ai appris des méthodes de travail qui me servent encore aujourd'hui !"
  }
];

  // ---- Résumé (optionnel) ----
  const scoreEl = document.getElementById('reviewsScore');
  const labelEl = document.getElementById('reviewsLabel');
  const countEl = document.getElementById('reviewsCount');
  const starsEl = document.getElementById('reviewsStars');

  // Mets tes chiffres réels ici
  const summary = { score: "5,0", label: "Excellent", count: 19 };

  if (scoreEl) scoreEl.textContent = summary.score;
  if (labelEl) labelEl.textContent = summary.label;
  if (countEl) countEl.textContent = `Basé sur ${summary.count} avis`;
  if (starsEl) starsEl.textContent = "★★★★★";

  function initials(name){
    const parts = String(name).trim().split(/\s+/).slice(0,2);
    return parts.map(p => p[0]?.toUpperCase()).join("") || "A";
  }

  function formatDate(iso){
    // format neutre : AAAA-MM-JJ → JJ/MM/AAAA
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return iso;
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  function stars(n){
    const full = "★★★★★".slice(0, Math.max(0, Math.min(5, n)));
    const empty = "☆☆☆☆☆".slice(0, 5 - Math.max(0, Math.min(5, n)));
    return full + empty;
  }

  // Render cards
  track.innerHTML = reviewsData.map(r => `
    <article class="review-card">
      <div class="review-head">
        <div class="review-person">
          <span class="review-avatar" aria-hidden="true">${initials(r.name)}</span>
          <div style="min-width:0">
            <div class="review-name">${r.name}</div>
            <div class="review-date">${formatDate(r.date)}</div>
          </div>
        </div>
        <span class="review-google-mini" aria-hidden="true">G</span>
      </div>
      <div class="review-stars" aria-hidden="true">${stars(r.rating)}</div>
      <p class="review-text">${r.text}</p>
    </article>
  `).join("");

  let activeCard = 0;  // Quelle carte est "active"
  let index = 0;        // Position de scroll calculée
  let perView = 3;
  let stepPx = 0;
  let maxIndex = 0;

  function compute(){
  const w = viewport.clientWidth;

  // Si moins de 3 avis → 1 carte
  if (reviewsData.length < 3){
    perView = 1;
  } else {
    if (w <= 620) perView = 1;
    else if (w <= 980) perView = 2;
    else perView = 3;
  }

  // Mesurer la largeur réelle des cartes plutôt que de la calculer
  const firstCard = track.querySelector('.review-card');
  if (firstCard) {
    const cardWidth = firstCard.offsetWidth;
    const gap = 18;
    stepPx = cardWidth + gap;
  } else {
    // Fallback au calcul si pas de cartes
    const gap = 18;
    stepPx = (w - (gap * (perView - 1))) / perView + gap;
  }

  maxIndex = Math.max(0, reviewsData.length - perView);

  updateIndexFromActiveCard();
  update();
  buildDots();
}

  // Calcule l'index de scroll basé sur la carte active
  function updateIndexFromActiveCard() {
    // Pour afficher la carte active à la bonne position:
    // activeCard=0 → index=0 (affiche 0,1,2)
    // activeCard=1 → index=0 (affiche 0,1,2, 1 au centre)
    // activeCard=2 → index=1 (affiche 1,2,3)
    // activeCard=3 → index=1 (affiche 1,2,3, 3 à droite)
    index = Math.max(0, Math.min(maxIndex, activeCard - (perView === 1 ? 0 : 1)));
  }

  function update(){
    track.style.transform = `translateX(${-index * stepPx}px)`;

// Gestion focus actif
const cards = track.querySelectorAll('.review-card');
cards.forEach((card, i) => {
  card.classList.toggle('is-active', i === activeCard);
});
    if (btnPrev) btnPrev.disabled = (activeCard === 0);
    if (btnNext) btnNext.disabled = (activeCard === reviewsData.length - 1);
    updateDots();
  }

  function buildDots(){
    if (!dotsWrap) return;
    const dotsCount = reviewsData.length;
    dotsWrap.innerHTML = Array.from({ length: dotsCount }).map((_, i) =>
      `<span class="reviews-dot ${i===activeCard ? 'is-active' : ''}" data-dot="${i}"></span>`
    ).join("");

    dotsWrap.querySelectorAll('[data-dot]').forEach(d => {
      d.addEventListener('click', () => {
        activeCard = Number(d.getAttribute('data-dot')) || 0;
        updateIndexFromActiveCard();
        update();
      });
    });
  }

  function updateDots(){
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === activeCard);
    });
  }

  // Buttons
  if (btnPrev) btnPrev.addEventListener('click', () => {
  if (activeCard <= 0) activeCard = reviewsData.length - 1;
  else activeCard--;
  updateIndexFromActiveCard();
  update();
  resetAutoRotate();
});

if (btnNext) btnNext.addEventListener('click', () => {
  if (activeCard >= reviewsData.length - 1) activeCard = 0;
  else activeCard++;
  updateIndexFromActiveCard();
  update();
  resetAutoRotate();
});

  // Touch swipe (mobile-friendly)
  let startX = 0;
  let dx = 0;
  viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dx = 0;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    dx = e.touches[0].clientX - startX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (Math.abs(dx) < 35) return;
    if (dx < 0){
      activeCard = (activeCard >= reviewsData.length - 1) ? 0 : activeCard + 1;
    } else {
      activeCard = (activeCard <= 0) ? reviewsData.length - 1 : activeCard - 1;
    }
    updateIndexFromActiveCard();
    update();
    resetAutoRotate();
  });

  // Auto-rotation toutes les 5 secondes
  let autoRotateInterval;

  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      activeCard = (activeCard >= reviewsData.length - 1) ? 0 : activeCard + 1;
      updateIndexFromActiveCard();
      update();
    }, 5000);
  }

  function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
  }

  // Ajouter resetAutoRotate aux clics sur les dots
  if (dotsWrap) {
    dotsWrap.addEventListener('click', () => {
      resetAutoRotate();
    });
  }

  window.addEventListener('resize', compute);
  compute();
  startAutoRotate();
})();

let lastScroll = 0;

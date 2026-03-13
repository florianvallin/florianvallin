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

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("revealPhoneBtn");
  const phone = document.getElementById("phoneNumber");

  if (toggle && phone) {
    toggle.addEventListener("click", function () {
      phone.classList.remove("hidden-phone");
      toggle.style.display = "none";
    });
  }
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
    name: "Olivier Le Pioufle",
    date: "2025-03-01",
    rating: 5,
    text: "J’ai suivi des cours en parallèle de mes études de philosophie. Les conseils reçus ont été déterminants pour l’obtention de mon master et la réalisation de mon mémoire. Un travail rigoureux sur la dissertation et les commentaires, avec beaucoup de pédagogie et de patience."
  },
  {
    name: "Elodie Jannin",
    date: "2025-02-28",
    rating: 5,
    text: "Explications claires et structurées. Une aide précieuse pour préparer mes échéances en licence de philosophie. On sent l’exigence, mais aussi l’envie sincère de faire progresser."
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

  let index = 0;
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

  const gap = 18;
  stepPx = (w - (gap * (perView - 1))) / perView + gap;

  maxIndex = Math.max(0, reviewsData.length - perView);

  index = Math.min(index, maxIndex);
  update();
  buildDots();
}

  function update(){
    track.style.transform = `translateX(${-index * stepPx}px)`;

// Gestion focus actif
const cards = track.querySelectorAll('.review-card');
cards.forEach((card, i) => {
  card.classList.toggle('is-active', i === index);
});
    if (btnPrev) btnPrev.disabled = (index === 0);
    if (btnNext) btnNext.disabled = (index === maxIndex);
    updateDots();
  }

  function buildDots(){
    if (!dotsWrap) return;
    const dotsCount = maxIndex + 1;
    dotsWrap.innerHTML = Array.from({ length: dotsCount }).map((_, i) =>
      `<span class="reviews-dot ${i===index ? 'is-active' : ''}" data-dot="${i}"></span>`
    ).join("");

    dotsWrap.querySelectorAll('[data-dot]').forEach(d => {
      d.addEventListener('click', () => {
        index = Number(d.getAttribute('data-dot')) || 0;
        update();
      });
    });
  }

  function updateDots(){
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
    });
  }

  // Buttons
  if (btnPrev) btnPrev.addEventListener('click', () => {
  if (index <= 0) index = maxIndex;
  else index--;
  update();
});

if (btnNext) btnNext.addEventListener('click', () => {
  if (index >= maxIndex) index = 0;
  else index++;
  update();
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
    index = (index >= maxIndex) ? 0 : index + 1;
    } else {
    index = (index <= 0) ? maxIndex : index - 1;
    }
    update();
  });

  window.addEventListener('resize', compute);
  compute();
})();

let lastScroll = 0;

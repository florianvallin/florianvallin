(() => {
  'use strict';
  const offers = {
    individuel: ['Philosophie', 'Séance individuelle de philosophie', '50 € / heure'],
    collectif: ['Philosophie', 'Cours collectif de philosophie', '35 € / élève à deux · 25 € / élève de trois à cinq'],
    express: ['Philosophie', 'Pack Express', '2 × 2 h · 175 €'],
    remise: ['Philosophie', 'Pack Remise à niveau', '6 × 1 h · 250 €'],
    excellence: ['Philosophie', 'Pack Excellence', '8 × 1 h · 320 €'],
    methodologie: ['Méthodologie', 'Séance de méthodologie', '40 € / heure']
  };
  const ready = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const service = form.querySelector('#prestation'), message = form.querySelector('#message');
    const choice = form.querySelector('[data-contact-offer]'), summary = form.querySelector('[data-offer-summary]');
    let lastTemplate = '';
    function selectOffer(id, focus = false) {
      const item = offers[id];
      choice.value = item ? id : '';
      if (item) service.value = item[0];
      summary.textContent = item ? `${item[1]} — ${item[2]}` : '';
      summary.hidden = !item;
      const template = item ? `Bonjour,\n\nJe souhaite en savoir plus sur l’offre « ${item[1]} ».\n\nMon niveau :\nMon objectif ou mes difficultés :\nMes disponibilités :\n\nMerci !` : '';
      // Une nouvelle sélection ne remplace jamais un message déjà personnalisé.
      if (!message.value.trim() || message.value === lastTemplate) message.value = template;
      lastTemplate = template;
      form.querySelector('[name="offre"]').value = item ? `${item[1]} — ${item[2]}` : '';
      const url = new URL(location.href);
      if (item) url.searchParams.set('offre', id); else url.searchParams.delete('offre');
      if (focus) url.hash = 'contact';
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      if (focus) { form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); service.focus({ preventScroll: true }); }
    }
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-contact-offer-id]');
      if (!link) return;
      event.preventDefault(); selectOffer(link.dataset.contactOfferId, true);
    });
    choice.addEventListener('change', () => selectOffer(choice.value));
    service.addEventListener('change', () => { if (offers[choice.value]?.[0] !== service.value) selectOffer(''); });
    form.addEventListener('reset', () => { setTimeout(() => { lastTemplate = ''; selectOffer(''); }, 0); });
    const initial = new URLSearchParams(location.search).get('offre');
    if (offers[initial]) selectOffer(initial);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
})();

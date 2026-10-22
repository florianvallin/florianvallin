/* Une page laissée ouverte vérifie l'arrivée de la nouvelle publication.
   Les contenus futurs sont absents des fichiers publics : changer l'horloge
   du téléphone ne peut pas les faire apparaître. */
(() => {
  'use strict';
  const page = document.querySelector('[data-series-calendar]');
  if (!page) return;
  const renderedDay = page.dataset.seriesAsOf;
  let timer, checking = false;
  const parisDay = () => {
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get = kind => parts.find(part => part.type === kind).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  };
  async function check() {
    clearTimeout(timer);
    if (checking) return;
    checking = true;
    try {
      if (document.visibilityState !== 'hidden' && parisDay() > renderedDay) {
        const response = await fetch('/series/philosophie-de-l-amour/episodes.json', {cache:'no-store'});
        if (response.ok) {
          const calendar = await response.json();
          if (calendar.asOf > renderedDay) {location.reload(); return;}
        }
      }
    } catch (_) {
      // Une absence de connexion ne remplace pas la page déjà affichée.
    } finally {
      checking = false;
      timer = setTimeout(check, 300000);
    }
  }
  document.addEventListener('visibilitychange', check);
  check();
})();

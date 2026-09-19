(() => {
  const accordions = [...document.querySelectorAll('details.blog-program-authors')];
  if (!accordions.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openImmediately = (details) => {
    details.open = true;
    details.style.height = 'auto';
  };

  const closeImmediately = (details) => {
    details.open = false;
    details.style.height = '';
  };

  const animateOpen = (details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.blog-program-author-list');
    if (!summary || !content) return openImmediately(details);
    if (reduceMotion) return openImmediately(details);

    details.open = true;
    const startHeight = summary.getBoundingClientRect().height;
    const endHeight = startHeight + content.getBoundingClientRect().height;
    details.style.height = `${startHeight}px`;
    details.offsetHeight;
    details.dataset.animating = 'true';
    requestAnimationFrame(() => { details.style.height = `${endHeight}px`; });

    const done = (event) => {
      if (event.propertyName !== 'height') return;
      details.style.height = 'auto';
      delete details.dataset.animating;
      details.removeEventListener('transitionend', done);
    };
    details.addEventListener('transitionend', done);
  };

  const animateClose = (details) => {
    const summary = details.querySelector('summary');
    if (!summary) return closeImmediately(details);
    if (reduceMotion) return closeImmediately(details);

    const startHeight = details.getBoundingClientRect().height;
    const endHeight = summary.getBoundingClientRect().height;
    details.style.height = `${startHeight}px`;
    details.offsetHeight;
    details.dataset.animating = 'true';
    requestAnimationFrame(() => { details.style.height = `${endHeight}px`; });

    const done = (event) => {
      if (event.propertyName !== 'height') return;
      details.open = false;
      details.style.height = '';
      delete details.dataset.animating;
      details.removeEventListener('transitionend', done);
    };
    details.addEventListener('transitionend', done);
  };

  accordions.forEach((details) => {
    details.removeAttribute('open');
    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.dataset.animating === 'true') return;
      if (details.open) animateClose(details);
      else animateOpen(details);
    });
  });

  // A direct link to an author still opens the relevant period automatically.
  if (location.hash) {
    const target = document.querySelector(location.hash);
    const parent = target?.closest('details.blog-program-authors');
    if (parent) openImmediately(parent);
  }
})();

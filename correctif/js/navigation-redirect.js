/* Alias statiques : conserver les filtres et l'ancre, sans redirection vers un contenu voisin. */
(() => {
  'use strict';
  const path=document.body.dataset.navigationDestination;
  if(!path || !path.startsWith('/') || path.startsWith('//'))return;
  const url=new URL(path,location.origin);url.search=location.search;url.hash=location.hash;
  const normalize=value=>value.replace(/index\.html$/,'').replace(/\/$/,'')||'/';
  if(normalize(url.pathname)!==normalize(location.pathname))location.replace(url.pathname+url.search+url.hash);
})();

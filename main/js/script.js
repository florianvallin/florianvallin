/* Compatibilité : utiliser le gestionnaire actuel du site. */
(() => {const entry=document.createElement('script');entry.src=new URL('../../js/script.js?v=20261021-videos2',document.currentScript.src).href;entry.defer=true;document.head.append(entry);})();

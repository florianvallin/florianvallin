/* Compatibilité HLP : les données ont été consolidées dans /js/textes-hlp-tle.js. */
(() => {
  if (window.FV_HLP_FINAL_PATCH) return;
  if (document.readyState === "loading") {
    document.write('<script src="/js/textes-hlp-tle.js?v=20260919-publish2"><\/script>');
    return;
  }
  const s = document.createElement("script");
  s.src = "/js/textes-hlp-tle.js?v=20260919-publish2";
  s.async = false;
  document.head.appendChild(s);
})();

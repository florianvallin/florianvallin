(() => {
  const entries = {
    "/textes/platon-glaucon-devoir-contrainte/": "Anneau de Gygès",
    "/textes/rawls-justice-equite-inegalites/": "Voile d’ignorance"
  };
  const path = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  const label = entries[path];
  if (!label) return;

  const addStyles = () => {
    if (document.getElementById("thought-backlink-style")) return;
    const style = document.createElement("style");
    style.id = "thought-backlink-style";
    style.textContent = `
      .text-context-thought-link{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:7px;padding:8px 10px;border:1px solid rgba(108,99,255,.14);border-radius:9px;background:#faf9ff;color:#5148cf!important;font-family:Inter,Arial,sans-serif;text-decoration:none!important;transition:border-color .18s ease,background .18s ease,transform .18s ease}
      .text-context-thought-link:hover{border-color:rgba(108,99,255,.30);background:#f5f3ff;transform:translateY(-1px)}
      .text-context-thought-link span{min-width:0}.text-context-thought-link small{display:block;color:#8b8497;font-size:8px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.text-context-thought-link strong{display:block;margin-top:2px;color:#5148cf;font-size:10px;font-weight:720;line-height:1.35}.text-context-thought-link i{flex:none;color:#6c63ff;font-size:15px;font-style:normal}
    `;
    document.head.appendChild(style);
  };

  const inject = () => {
    const compass = document.querySelector(".text-context-philo-compass");
    if (!compass || document.querySelector(".text-context-thought-link")) return false;
    addStyles();
    const link = document.createElement("a");
    link.className = "text-context-thought-link";
    link.href = "/blog/experiences-de-pensee-philosophie/" + (label === "Anneau de Gygès" ? "#gyges" : "#rawls");
    link.innerHTML = `<span><small>Article associé</small><strong>10 expériences de pensée · ${label}</strong></span><i aria-hidden="true">→</i>`;
    const host = compass.closest(".text-context-compasses") || compass;
    host.insertAdjacentElement("afterend", link);
    return true;
  };

  if (inject()) return;
  const observer = new MutationObserver(() => { if (inject()) observer.disconnect(); });
  observer.observe(document.documentElement, {childList:true, subtree:true});
  setTimeout(() => observer.disconnect(), 8000);
})();

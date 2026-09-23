(() => {
  "use strict";

  // Aside highlighting
  const links = [...document.querySelectorAll('.atomic-aside a[href^="#"]')].filter((a) => a.getAttribute("href") !== "#sources");
  if (links.length && "IntersectionObserver" in window) {
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach((a) => a.classList.remove("is-active"));
      map.get(visible.target.id)?.classList.add("is-active");
    }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });
    document.querySelectorAll(".blog-atomic-page .blog-prose > section[id]").forEach((section) => observer.observe(section));
  }

  // Legacy builder support (kept graceful if the block comes back later)
  const root = document.querySelector("[data-atomic-builder]");
  if (!root) return;

  const STORAGE_KEY = "philosophal-atomic-habit-v1";
  const fields = [...root.querySelectorAll("[data-atomic-field]")];
  const output = root.querySelector("[data-atomic-output]");
  const status = root.querySelector("[data-atomic-status]");
  const copyButton = root.querySelector("[data-atomic-copy]");
  const resetButton = root.querySelector("[data-atomic-reset]");

  const read = () => Object.fromEntries(fields.map((field) => [field.dataset.atomicField, field.value.trim()]));

  const sentence = (data) => {
    const parts = [];
    if (data.trigger) parts.push(`Après ${data.trigger.replace(/^après\s+/i, "")},`);
    if (data.place) parts.push(`à ${data.place.replace(/^à\s+/i, "")},`);
    if (data.minimum) parts.push(`je commence par ${data.minimum.replace(/^je\s+/i, "")}.`);
    if (data.normal) parts.push(`Ma séance normale : ${data.normal}.`);
    if (data.friction) parts.push(`Je réduis la friction : ${data.friction}.`);
    if (data.goal) parts.push(`Objectif : ${data.goal}.`);
    if (!parts.length) return "Remplissez quelques champs : votre plan apparaîtra ici.";
    return parts.join(" ").replace(/\s+/g, " ").replace(/,\s*\./g, ".");
  };

  const render = (save = true) => {
    const data = read();
    output.textContent = sentence(data);
    if (save) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
    }
    if (status) status.textContent = save && Object.values(data).some(Boolean) ? "Plan enregistré sur cet appareil." : "";
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      fields.forEach((field) => { field.value = saved[field.dataset.atomicField] || ""; });
    }
  } catch (_) {}

  fields.forEach((field) => field.addEventListener("input", () => render(true)));

  copyButton?.addEventListener("click", async () => {
    const text = output?.textContent?.trim() || "";
    if (!text || text.startsWith("Remplissez")) return;
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = "Plan copié.";
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      try { document.execCommand("copy"); } catch (_) {}
      area.remove();
      if (status) status.textContent = "Plan copié.";
    }
  });

  resetButton?.addEventListener("click", () => {
    fields.forEach((field) => { field.value = ""; });
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    render(false);
    fields[0]?.focus();
    if (status) status.textContent = "Plan réinitialisé.";
  });

  render(false);
})();

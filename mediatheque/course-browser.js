(() => {
  "use strict";

  const STYLE_ID = "fv-course-browser-styles";
  const NAV_ID = "fv-course-browser";
  let scheduled = false;

  function esc(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function normalize(value = "") {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function naturalNumber(value = "") {
    const match = String(value).match(/(\d+)/);
    return match ? Number(match[1]) : 999;
  }

  function sortLabel(a, b) {
    const na = naturalNumber(a);
    const nb = naturalNumber(b);
    return na - nb || String(a).localeCompare(String(b), "fr", { numeric: true });
  }

  function groupBy(items, keyFn) {
    const map = new Map();
    items.forEach((item) => {
      const key = keyFn(item) || "Non classé";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }

  function isResearch(item) {
    return item.collectionType === "research" || normalize(item.formation) === "etudes recherches";
  }

  function courseItems() {
    const data = window.FV_MEDIATHEQUE_DATA || {};
    const resources = Array.isArray(data.resources) ? data.resources : [];
    return resources.filter((item) => item && item.kind === "cours" && item.url);
  }

  function hrefFor(item) {
    return esc(item.url || "#");
  }

  function documentRow(item) {
    const meta = [item.creator, item.format || item.sourceType].filter(Boolean).join(" · ");
    return `<a class="fvc-doc" href="${hrefFor(item)}">
      <span class="fvc-doc-mark" aria-hidden="true">${Number.isFinite(Number(item.sequence)) ? esc(item.sequence) : "·"}</span>
      <span class="fvc-doc-main"><strong>${esc(item.title || "Document")}</strong>${meta ? `<small>${esc(meta)}</small>` : ""}</span>
      <span class="fvc-doc-arrow" aria-hidden="true">→</span>
    </a>`;
  }

  function moduleBlock(label, items, research = false) {
    const sorted = [...items].sort((a, b) => (Number(a.sequence) || 999) - (Number(b.sequence) || 999) || String(a.title).localeCompare(String(b.title), "fr"));
    return `<section class="fvc-module${research ? " is-research" : ""}">
      <header><strong>${esc(label)}</strong><small>${items.length} document${items.length > 1 ? "s" : ""}</small></header>
      <div class="fvc-doc-list">${sorted.map(documentRow).join("")}</div>
    </section>`;
  }

  function academicBody(items) {
    const formations = groupBy(items, (item) => item.formation || "Formation non précisée");
    return `<div class="fvc-formations">${[...formations.entries()].sort((a,b)=>a[0].localeCompare(b[0],"fr")).map(([formation, formationItems]) => {
      const levels = groupBy(formationItems, (item) => [item.degree, item.year].filter(Boolean).join(" · ") || "Parcours");
      return `<section class="fvc-formation">
        <header class="fvc-formation-head"><div><span>FORMATION</span><h4>${esc(formation)}</h4></div><strong>${formationItems.length}<small> docs</small></strong></header>
        ${[...levels.entries()].sort((a,b)=>a[0].localeCompare(b[0],"fr",{numeric:true})).map(([level, levelItems]) => {
          const semesters = groupBy(levelItems, (item) => item.semester || "Sans semestre");
          return `<div class="fvc-level"><div class="fvc-level-label">${esc(level)}</div>
            <div class="fvc-semester-grid">${[...semesters.entries()].sort((a,b)=>sortLabel(a[0],b[0])).map(([semester, semesterItems]) => {
              const ues = groupBy(semesterItems, (item) => item.ue || "Enseignement non précisé");
              return `<details class="fvc-semester">
                <summary><div><span>SEMESTRE</span><strong>${esc(String(semester).replace(/^Semestre\s*/i, "S"))}</strong><small>${ues.size} UE</small></div><b>${semesterItems.length}<small> documents</small></b><i aria-hidden="true">+</i></summary>
                <div class="fvc-semester-body">${[...ues.entries()].sort((a,b)=>sortLabel(a[0],b[0])).map(([ue, ueItems]) => {
                  const modules = groupBy(ueItems, (item) => item.module || item.subject || "Cours");
                  return `<details class="fvc-ue">
                    <summary><span>${esc(ue)}</span><small>${ueItems.length}</small><i aria-hidden="true">+</i></summary>
                    <div class="fvc-ue-body">${[...modules.entries()].sort((a,b)=>a[0].localeCompare(b[0],"fr",{numeric:true})).map(([module, moduleItems]) => moduleBlock(module, moduleItems)).join("")}</div>
                  </details>`;
                }).join("")}</div>
              </details>`;
            }).join("")}</div>
          </div>`;
        }).join("")}
      </section>`;
    }).join("")}</div>`;
  }

  const RESEARCH_ORDER = [
    "Philosophie & histoire des idées",
    "Esthétique, art & corps",
    "Esthétique & musique",
    "Mythologies & religions",
    "Podcasts & émissions",
    "Conférences & entretiens",
    "Méthodes & pratiques",
    "Recherche — Mémoire"
  ];

  function researchRank(label) {
    const index = RESEARCH_ORDER.indexOf(label);
    return index >= 0 ? index : 999;
  }

  function researchBody(items) {
    const dossiers = groupBy(items, (item) => item.ue || "Autres recherches");
    return `<div class="fvc-research-grid">${[...dossiers.entries()].sort((a,b)=>researchRank(a[0])-researchRank(b[0]) || a[0].localeCompare(b[0],"fr")).map(([dossier, dossierItems]) => {
      const series = groupBy(dossierItems, (item) => item.module || item.subject || "Documents");
      return `<details class="fvc-research-dossier">
        <summary><div><span>DOSSIER</span><strong>${esc(dossier)}</strong><small>${series.size} série${series.size > 1 ? "s" : ""}</small></div><b>${dossierItems.length}<small> docs</small></b><i aria-hidden="true">+</i></summary>
        <div class="fvc-research-body">${[...series.entries()].sort((a,b)=>a[0].localeCompare(b[0],"fr",{numeric:true})).map(([seriesName, seriesItems]) => moduleBlock(seriesName, seriesItems, true)).join("")}</div>
      </details>`;
    }).join("")}</div>`;
  }

  function overviewView(academic, research) {
    const formations = groupBy(academic, (item) => item.formation || "Formation");
    const semesters = [...new Set(academic.map((item) => item.semester).filter(Boolean))].sort(sortLabel);
    const dossiers = new Set(research.map((item) => item.ue).filter(Boolean));
    return `<div class="fvc-overview">
      <header class="fvc-intro"><span>PARCOURIR</span><h3>Choisir d’abord un ensemble</h3><p>Ouvre une collection, puis descends progressivement jusqu’au document. La recherche reste disponible si tu connais déjà un mot-clé.</p></header>
      <div class="fvc-collections">
        <details class="fvc-collection is-academic" name="fvc-main-collection">
          <summary class="fvc-door">
            <span class="fvc-door-index">01</span>
            <span class="fvc-door-copy"><small>CURSUS</small><strong>Parcours universitaires</strong><em>${academic.length} documents · ${formations.size} formation${formations.size > 1 ? "s" : ""}${semesters.length ? ` · ${semesters.map((s)=>esc(String(s).replace(/^Semestre\s*/i,"S"))).join(" · ")}` : ""}</em></span>
            <span class="fvc-door-arrow" aria-hidden="true">+</span>
          </summary>
          <div class="fvc-collection-body">${academicBody(academic)}</div>
        </details>
        <details class="fvc-collection is-research" name="fvc-main-collection">
          <summary class="fvc-door">
            <span class="fvc-door-index">02</span>
            <span class="fvc-door-copy"><small>FONDS PERSONNEL</small><strong>Études & recherches</strong><em>${research.length} documents · ${dossiers.size} dossiers thématiques</em></span>
            <span class="fvc-door-arrow" aria-hidden="true">+</span>
          </summary>
          <div class="fvc-collection-body">${researchBody(research)}</div>
        </details>
      </div>
      <p class="fvc-hint"><span aria-hidden="true">⌕</span> La barre au-dessus recherche toujours dans le contenu intégral des cours.</p>
    </div>`;
  }

  function courseSignature(courses) {
    return `${courses.length}:${courses.map((item) => item.id || item.url || item.title || "").join("|")}`;
  }

  function renderNavigator(nav, courses) {
    const signature = courseSignature(courses);
    if (nav.dataset.fvcSignature === signature && nav.childElementCount) return;
    const research = courses.filter(isResearch);
    const academic = courses.filter((item) => !isResearch(item));
    nav.innerHTML = overviewView(academic, research);
    nav.dataset.fvcSignature = signature;
  }

  function hasCourseFilters() {
    const globalSearch = document.querySelector("[data-media-search]");
    const courseSearch = document.querySelector("[data-course-search]");
    if (globalSearch && globalSearch.value.trim()) return true;
    if (courseSearch && courseSearch.value.trim()) return true;
    const params = new URLSearchParams(location.search);
    for (const [key, value] of params.entries()) {
      if (key === "type" && value === "cours") continue;
      if (key === "collection") continue; // compatibilité avec l'ancien navigateur
      if (value) return true;
    }
    return false;
  }

  function ensureNavigator() {
    const listShell = document.querySelector("[data-media-list-shell]");
    const courseSearchShell = document.querySelector("[data-course-search-shell]");
    if (!listShell || !courseSearchShell) return;

    let nav = document.getElementById(NAV_ID);
    if (!nav) {
      nav = document.createElement("section");
      nav.id = NAV_ID;
      nav.className = "fvc-browser";
      nav.hidden = true;
      listShell.parentNode.insertBefore(nav, listShell);
    }

    const isCourseView = !courseSearchShell.hidden;
    if (!isCourseView || hasCourseFilters()) {
      nav.hidden = true;
      if (listShell.dataset.fvcHidden === "1") {
        listShell.hidden = false;
        delete listShell.dataset.fvcHidden;
      }
      return;
    }

    nav.hidden = false;
    listShell.hidden = true;
    listShell.dataset.fvcHidden = "1";
    renderNavigator(nav, courseItems());
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureNavigator();
    });
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .fvc-browser{margin:2px 0 30px;--fvc-accent:var(--cours,#7557a8);--fvc-line:var(--line,#e7e3ec);--fvc-muted:var(--muted,#74717a);}
      .fvc-browser[hidden]{display:none!important}.fvc-intro{max-width:760px;padding:5px 0 18px}.fvc-intro>span{color:var(--fvc-accent);font-size:.62rem;font-weight:850;letter-spacing:.14em}.fvc-intro h3{margin:6px 0 7px;font-family:Georgia,"Times New Roman",serif;font-size:1.55rem;font-weight:500;letter-spacing:-.025em}.fvc-intro p{margin:0;color:var(--fvc-muted);font-size:.82rem;line-height:1.6}
      .fvc-collections{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.fvc-collection{min-width:0}.fvc-collection[open]{grid-column:1/-1}.fvc-door{display:grid;grid-template-columns:34px minmax(0,1fr) 24px;gap:14px;align-items:center;min-height:118px;padding:18px;border:1px solid color-mix(in srgb,var(--fvc-accent) 15%,var(--fvc-line));border-radius:16px;background:color-mix(in srgb,var(--fvc-accent) 2.5%,#fff);text-align:left;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background .16s ease;list-style:none}.fvc-door::-webkit-details-marker{display:none}.fvc-door:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--fvc-accent) 38%,var(--fvc-line));background:color-mix(in srgb,var(--fvc-accent) 5%,#fff)}.fvc-collection[open]>.fvc-door{border-color:color-mix(in srgb,var(--fvc-accent) 35%,var(--fvc-line));background:color-mix(in srgb,var(--fvc-accent) 5%,#fff)}.fvc-door-index{align-self:start;color:var(--fvc-accent);font-family:Georgia,serif;font-size:1.05rem}.fvc-door-copy{display:grid;gap:4px;min-width:0}.fvc-door-copy small{color:var(--fvc-accent);font-size:.6rem;font-weight:850;letter-spacing:.12em}.fvc-door-copy strong{color:#303036;font-family:Georgia,"Times New Roman",serif;font-size:1.18rem;font-weight:500}.fvc-door-copy em{color:var(--fvc-muted);font-size:.72rem;font-style:normal;line-height:1.45}.fvc-door-arrow{color:var(--fvc-accent);font-size:1.1rem;transition:transform .16s ease}.fvc-collection[open]>.fvc-door .fvc-door-arrow{transform:rotate(45deg)}.fvc-collection-body{padding:18px 2px 8px}.fvc-hint{display:flex;gap:8px;align-items:center;margin:13px 2px 0;color:var(--fvc-muted);font-size:.7rem}.fvc-hint span{color:var(--fvc-accent);font-size:1rem}
      .fvc-formations{display:grid;gap:28px}.fvc-formation{border-top:3px solid var(--fvc-accent)}.fvc-formation-head{display:flex;justify-content:space-between;gap:20px;align-items:end;padding:14px 2px 12px;border-bottom:1px solid var(--fvc-line)}.fvc-formation-head span,.fvc-level-label{color:var(--fvc-accent);font-size:.6rem;font-weight:850;letter-spacing:.12em}.fvc-formation-head h4{margin:5px 0 0;font-family:Georgia,"Times New Roman",serif;font-size:1.28rem;font-weight:500}.fvc-formation-head>strong{color:var(--fvc-accent);font-size:1.2rem;font-weight:550;white-space:nowrap}.fvc-formation-head>strong small{color:var(--fvc-muted);font-size:.62rem}.fvc-level{padding:15px 0 0}.fvc-level-label{margin:0 2px 8px}.fvc-semester-grid{display:grid;gap:9px}.fvc-semester,.fvc-research-dossier{border:1px solid var(--fvc-line);border-radius:12px;background:#fff;overflow:hidden}.fvc-semester>summary,.fvc-research-dossier>summary{display:grid;grid-template-columns:minmax(0,1fr) auto 18px;gap:14px;align-items:center;padding:13px 15px;list-style:none;cursor:pointer}.fvc-semester>summary::-webkit-details-marker,.fvc-research-dossier>summary::-webkit-details-marker,.fvc-ue>summary::-webkit-details-marker{display:none}.fvc-semester>summary>div,.fvc-research-dossier>summary>div{display:flex;align-items:baseline;gap:10px;min-width:0}.fvc-semester>summary>div>span,.fvc-research-dossier>summary>div>span{color:var(--fvc-accent);font-size:.58rem;font-weight:850;letter-spacing:.11em}.fvc-semester>summary>div>strong,.fvc-research-dossier>summary>div>strong{color:#34343a;font-size:.86rem}.fvc-semester>summary>div>small,.fvc-research-dossier>summary>div>small{color:var(--fvc-muted);font-size:.66rem}.fvc-semester>summary>b,.fvc-research-dossier>summary>b{color:var(--fvc-accent);font-size:.88rem;font-weight:650;white-space:nowrap}.fvc-semester>summary>b small,.fvc-research-dossier>summary>b small{color:var(--fvc-muted);font-size:.6rem;font-weight:600}.fvc-semester>summary>i,.fvc-research-dossier>summary>i,.fvc-ue>summary>i{color:var(--fvc-accent);font-style:normal;transition:transform .15s}.fvc-semester[open]>summary>i,.fvc-research-dossier[open]>summary>i,.fvc-ue[open]>summary>i{transform:rotate(45deg)}.fvc-semester[open]>summary,.fvc-research-dossier[open]>summary{background:color-mix(in srgb,var(--fvc-accent) 3.5%,#fff)}.fvc-semester-body,.fvc-research-body{padding:0 15px 15px}
      .fvc-ue{border-top:1px solid var(--fvc-line)}.fvc-ue>summary{display:grid;grid-template-columns:minmax(0,1fr) auto 16px;gap:12px;align-items:center;padding:11px 2px;list-style:none;cursor:pointer}.fvc-ue>summary>span{font-size:.78rem;font-weight:720}.fvc-ue>summary>small{color:var(--fvc-muted);font-size:.66rem}.fvc-ue-body{display:grid;gap:14px;padding:2px 0 15px 22px}.fvc-module>header{display:flex;justify-content:space-between;gap:12px;align-items:baseline;margin:0 0 5px;padding:0 2px}.fvc-module>header strong{font-size:.72rem;color:#55515b}.fvc-module>header small{color:var(--fvc-muted);font-size:.6rem;white-space:nowrap}.fvc-doc-list{border-top:1px solid color-mix(in srgb,var(--fvc-line) 75%,transparent)}.fvc-doc{display:grid;grid-template-columns:24px minmax(0,1fr) 18px;gap:9px;align-items:center;padding:8px 3px;border-bottom:1px solid color-mix(in srgb,var(--fvc-line) 68%,transparent);color:inherit;text-decoration:none}.fvc-doc:hover .fvc-doc-main strong{color:var(--fvc-accent)}.fvc-doc-mark{color:var(--fvc-accent);font-size:.62rem;text-align:center}.fvc-doc-main{display:grid;gap:2px;min-width:0}.fvc-doc-main strong{color:#3f3e44;font-size:.74rem;font-weight:650;line-height:1.35;white-space:normal;overflow-wrap:anywhere}.fvc-doc-main small{overflow:hidden;color:var(--fvc-muted);font-size:.61rem;line-height:1.35;text-overflow:ellipsis;white-space:normal}.fvc-doc-arrow{color:var(--fvc-accent);font-size:.76rem}
      .fvc-research-grid{display:grid;gap:8px}.fvc-research-dossier>summary>div>strong{font-family:Georgia,"Times New Roman",serif;font-size:.94rem;font-weight:500}.fvc-research-body{display:grid;gap:17px;border-top:1px solid var(--fvc-line);padding-top:14px}.fvc-module.is-research>header strong{color:var(--fvc-accent)}
      @media(max-width:720px){.fvc-collections{grid-template-columns:1fr}.fvc-collection[open]{grid-column:auto}.fvc-door{grid-template-columns:28px minmax(0,1fr) 20px;gap:10px;min-height:100px;padding:15px}.fvc-door-copy strong{font-size:1.05rem;line-height:1.2;overflow-wrap:anywhere}.fvc-semester>summary,.fvc-research-dossier>summary{grid-template-columns:minmax(0,1fr) auto 16px;padding:12px}.fvc-semester>summary>div,.fvc-research-dossier>summary>div{display:grid;gap:2px}.fvc-semester>summary>div>small,.fvc-research-dossier>summary>div>small{display:none}.fvc-ue-body{padding-left:10px}.fvc-doc{grid-template-columns:20px minmax(0,1fr) 15px}.fvc-doc-main small{white-space:normal}.fvc-formation-head{align-items:center}.fvc-formation-head>strong small{display:none}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    installStyles();

    const courseSearchShell = document.querySelector("[data-course-search-shell]");
    if (courseSearchShell) {
      const observer = new MutationObserver(schedule);
      observer.observe(courseSearchShell, { attributes: true, attributeFilter: ["hidden"], subtree: true, childList: true });
    }

    document.addEventListener("input", schedule, true);
    document.addEventListener("change", schedule, true);
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-course-search-clear],[data-media-clear],[data-kind],[data-media-reset],[data-active-filter]")) {
        setTimeout(schedule, 0);
      }
    });

    schedule();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

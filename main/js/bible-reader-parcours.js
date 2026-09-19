(() => {
  "use strict";

  const readerControls = document.querySelector(".bible-reader-controls");
  const existingCollectionsPanel = document.querySelector("[data-bible-collections-panel]");
  const existingCollectionsToggle = document.querySelector("[data-bible-collections-toggle]");
  const existingCollectionTabs = [...document.querySelectorAll("[data-bible-collection]")];
  const existingCollectionsClose = document.querySelector("[data-bible-collections-close]");
  const translationSelect = document.querySelector("[data-bible-translation]");
  const keyboardHint = document.querySelector(".bible-reader-keyboard-hint");

  if (!readerControls) return;

  if (keyboardHint) keyboardHint.remove();
  if (existingCollectionsToggle) existingCollectionsToggle.hidden = true;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reducedMotion ? "auto" : "smooth";

  const GROUPS = {
    joyful: {
      label: "Mystères joyeux",
      short: "Joyeux",
      intro: "De l’Annonciation au recouvrement de Jésus au Temple.",
      items: [
        { title:"L’Annonciation", ref:"Luc 1,26–38", book:"Luke", chapter:"1", verse:"26", range:"26–38" },
        { title:"La Visitation", ref:"Luc 1,39–56", book:"Luke", chapter:"1", verse:"39", range:"39–56" },
        { title:"La Nativité", ref:"Luc 2,1–20", book:"Luke", chapter:"2", verse:"1", range:"1–20" },
        { title:"La Présentation de Jésus au Temple", ref:"Luc 2,22–38", book:"Luke", chapter:"2", verse:"22", range:"22–38" },
        { title:"Le recouvrement de Jésus au Temple", ref:"Luc 2,41–52", book:"Luke", chapter:"2", verse:"41", range:"41–52" }
      ]
    },
    luminous: {
      label: "Mystères lumineux",
      short: "Lumineux",
      intro: "Du baptême au Jourdain à l’institution de l’Eucharistie.",
      items: [
        { title:"Le baptême de Jésus dans le Jourdain", ref:"Matthieu 3,13–17", book:"Matt", chapter:"3", verse:"13", range:"13–17" },
        { title:"Les noces de Cana", ref:"Jean 2,1–11", book:"John", chapter:"2", verse:"1", range:"1–11" },
        { title:"L’annonce du Royaume de Dieu", ref:"Marc 1,14–15", book:"Mark", chapter:"1", verse:"14", range:"14–15", note:"Repère biblique principal : l’annonce du Royaume traverse ensuite tout le ministère de Jésus." },
        { title:"La Transfiguration", ref:"Matthieu 17,1–8", book:"Matt", chapter:"17", verse:"1", range:"1–8" },
        { title:"L’institution de l’Eucharistie", ref:"Luc 22,14–20", book:"Luke", chapter:"22", verse:"14", range:"14–20" }
      ]
    },
    sorrowful: {
      label: "Mystères douloureux",
      short: "Douloureux",
      intro: "De l’agonie à Gethsémani à la mort de Jésus en croix.",
      items: [
        { title:"L’agonie de Jésus au Jardin des Oliviers", ref:"Matthieu 26,36–46", book:"Matt", chapter:"26", verse:"36", range:"36–46" },
        { title:"La flagellation", ref:"Matthieu 27,26", book:"Matt", chapter:"27", verse:"26", range:"26" },
        { title:"Le couronnement d’épines", ref:"Matthieu 27,27–31", book:"Matt", chapter:"27", verse:"27", range:"27–31" },
        { title:"Jésus porte sa croix", ref:"Luc 23,26–32", book:"Luke", chapter:"23", verse:"26", range:"26–32" },
        { title:"La mort de Jésus en croix", ref:"Jean 19,17–30", book:"John", chapter:"19", verse:"17", range:"17–30" }
      ]
    },
    glorious: {
      label: "Mystères glorieux",
      short: "Glorieux",
      intro: "De la Résurrection au couronnement de Marie dans la tradition chrétienne.",
      items: [
        { title:"La Résurrection", ref:"Matthieu 28,1–10", book:"Matt", chapter:"28", verse:"1", range:"1–10" },
        { title:"L’Ascension", ref:"Actes 1,6–11", book:"Acts", chapter:"1", verse:"6", range:"6–11" },
        { title:"La Pentecôte", ref:"Actes 2,1–13", book:"Acts", chapter:"2", verse:"1", range:"1–13" },
        {
          title:"L’Assomption de Marie",
          tradition:true,
          note:"Mystère reçu par la tradition chrétienne : la Bible ne raconte pas directement l’Assomption.",
          refs:[
            { label:"Apocalypse 12,1", book:"Rev", chapter:"12", verse:"1" },
            { label:"Luc 1,46–55", book:"Luke", chapter:"1", verse:"46" }
          ]
        },
        {
          title:"Le couronnement de Marie",
          tradition:true,
          note:"Mystère reçu par la tradition chrétienne : ces passages sont des repères associés, non le récit direct d’un couronnement.",
          refs:[
            { label:"Apocalypse 12,1", book:"Rev", chapter:"12", verse:"1" }
          ]
        }
      ]
    }
  };

  const DAYS = [
    { js:1, key:"monday", label:"Lundi", short:"Lun", group:"joyful" },
    { js:2, key:"tuesday", label:"Mardi", short:"Mar", group:"sorrowful" },
    { js:3, key:"wednesday", label:"Mercredi", short:"Mer", group:"glorious" },
    { js:4, key:"thursday", label:"Jeudi", short:"Jeu", group:"luminous" },
    { js:5, key:"friday", label:"Vendredi", short:"Ven", group:"sorrowful" },
    { js:6, key:"saturday", label:"Samedi", short:"Sam", group:"joyful" },
    { js:0, key:"sunday", label:"Dimanche", short:"Dim", group:"glorious" }
  ];

  const today = DAYS.find((day) => day.js === new Date().getDay()) || DAYS[0];
  let activeDay = today;
  let activeGroup = GROUPS[today.group];
  let activeGroupKey = today.group;
  let selectionMode = "day";

  const pathwaySection = document.createElement("section");
  pathwaySection.className = "bible-reader-pathways";
  pathwaySection.setAttribute("aria-labelledby", "bible-reader-pathways-title");
  pathwaySection.innerHTML = `
    <div class="bible-reader-pathways-heading">
      <div><span>Parcours bibliques</span><h2 id="bible-reader-pathways-title">Parcourir autrement</h2></div>
      <p>Trois portes d’entrée pour retrouver rapidement des familles de textes sans mélanger ces parcours aux outils de lecture.</p>
    </div>
    <div class="bible-reader-pathway-grid">
      <button type="button" class="bible-reader-pathway-card" data-bible-pathway="prayers" aria-expanded="false">
        <span class="bible-reader-pathway-num">01</span>
        <span class="bible-reader-pathway-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M6 10h12"/><path d="M7.5 20h9"/></svg></span>
        <span class="bible-reader-pathway-copy"><strong>Prières</strong><small>Les grandes prières contenues dans la Bible.</small></span>
        <span class="bible-reader-pathway-arrow" aria-hidden="true">→</span>
      </button>
      <button type="button" class="bible-reader-pathway-card" data-bible-pathway="parables" aria-expanded="false">
        <span class="bible-reader-pathway-num">02</span>
        <span class="bible-reader-pathway-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5.5h14v11H9l-4 3v-14Z"/><path d="M8.5 9h7M8.5 12.5h5"/></svg></span>
        <span class="bible-reader-pathway-copy"><strong>Paraboles</strong><small>Parcourir l’enseignement de Jésus par récits et thèmes.</small></span>
        <span class="bible-reader-pathway-arrow" aria-hidden="true">→</span>
      </button>
      <button type="button" class="bible-reader-pathway-card bible-reader-pathway-card--rosary" data-bible-pathway="rosary" aria-expanded="false">
        <span class="bible-reader-pathway-num">03</span>
        <span class="bible-reader-pathway-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.8" r="2.2"/><circle cx="7.2" cy="9.1" r="1.45"/><circle cx="16.8" cy="9.1" r="1.45"/><circle cx="6.4" cy="14.1" r="1.45"/><circle cx="17.6" cy="14.1" r="1.45"/><path d="M7.6 15.3c1 2.7 2.5 4 4.4 4s3.4-1.3 4.4-4M12 19.3V22M10.5 20.8h3"/></svg></span>
        <span class="bible-reader-pathway-copy"><strong>Mystères du Rosaire</strong><small data-bible-rosary-today></small></span>
        <span class="bible-reader-pathway-arrow" aria-hidden="true">→</span>
      </button>
    </div>
  `;

  const rosaryToday = pathwaySection.querySelector("[data-bible-rosary-today]");
  rosaryToday.textContent = `Aujourd’hui · ${GROUPS[today.group].label}`;

  const rosaryPanel = document.createElement("div");
  rosaryPanel.className = "bible-reader-rosary-panel";
  rosaryPanel.hidden = true;
  rosaryPanel.innerHTML = `
    <div class="bible-reader-rosary-head">
      <div><span>Rosaire</span><strong>Les mystères, du lundi au dimanche</strong></div>
      <button type="button" data-bible-rosary-close aria-label="Fermer les mystères">×</button>
    </div>
    <div class="bible-reader-rosary-today" data-bible-rosary-summary></div>
    <div class="bible-reader-rosary-days" role="tablist" aria-label="Choisir un jour de la semaine" data-bible-rosary-days></div>
    <div class="bible-reader-rosary-series-wrap">
      <span>Ou choisir une série</span>
      <div class="bible-reader-rosary-series" role="group" aria-label="Choisir une série de mystères" data-bible-rosary-series></div>
    </div>
    <div class="bible-reader-rosary-content">
      <header><span data-bible-rosary-mode-label></span><h3 data-bible-rosary-title></h3><p data-bible-rosary-intro></p></header>
      <div class="bible-reader-rosary-list" data-bible-rosary-list></div>
    </div>
    <p class="bible-reader-rosary-note">La répartition hebdomadaire suit l’usage catholique courant. Les mystères de l’Assomption et du couronnement de Marie relèvent de la tradition chrétienne : les références proposées sont des repères bibliques associés, non des récits directs de ces événements.</p>
  `;
  readerControls.insertAdjacentElement("afterend", pathwaySection);

  const pathwayModal = document.createElement("div");
  pathwayModal.className = "bible-reader-pathway-modal";
  pathwayModal.hidden = true;
  pathwayModal.innerHTML = `
    <div class="bible-reader-pathway-modal-backdrop" data-bible-pathway-modal-close></div>
    <section class="bible-reader-pathway-dialog" role="dialog" aria-modal="true" aria-labelledby="bible-reader-pathway-dialog-title">
      <header class="bible-reader-pathway-dialog-head">
        <div class="bible-reader-pathway-dialog-title">
          <span>Parcours bibliques</span>
          <strong id="bible-reader-pathway-dialog-title">Explorer les textes autrement</strong>
        </div>
        <button class="bible-reader-pathway-dialog-close" type="button" data-bible-pathway-modal-close aria-label="Fermer les parcours bibliques">×</button>
      </header>
      <nav class="bible-reader-pathway-dialog-tabs" aria-label="Choisir un parcours">
        <button type="button" data-bible-pathway-tab="prayers">Prières</button>
        <button type="button" data-bible-pathway-tab="parables">Paraboles</button>
        <button type="button" data-bible-pathway-tab="rosary">Mystères du Rosaire</button>
      </nav>
      <div class="bible-reader-pathway-dialog-body" data-bible-pathway-modal-host></div>
    </section>
  `;
  document.body.append(pathwayModal);

  const modalHost = pathwayModal.querySelector("[data-bible-pathway-modal-host]");
  modalHost.append(rosaryPanel);
  if (existingCollectionsPanel) modalHost.prepend(existingCollectionsPanel);

  const pathwayButtons = [...pathwaySection.querySelectorAll("[data-bible-pathway]")];
  const pathwayTabs = [...pathwayModal.querySelectorAll("[data-bible-pathway-tab]")];
  const modalCloseButtons = [...pathwayModal.querySelectorAll("[data-bible-pathway-modal-close]")];
  const pathwayDialog = pathwayModal.querySelector(".bible-reader-pathway-dialog");
  const rosaryClose = rosaryPanel.querySelector("[data-bible-rosary-close]");
  const rosarySummary = rosaryPanel.querySelector("[data-bible-rosary-summary]");
  const daysHost = rosaryPanel.querySelector("[data-bible-rosary-days]");
  const seriesHost = rosaryPanel.querySelector("[data-bible-rosary-series]");
  const modeLabel = rosaryPanel.querySelector("[data-bible-rosary-mode-label]");
  const rosaryTitle = rosaryPanel.querySelector("[data-bible-rosary-title]");
  const rosaryIntro = rosaryPanel.querySelector("[data-bible-rosary-intro]");
  const rosaryList = rosaryPanel.querySelector("[data-bible-rosary-list]");

  const currentTranslation = () => translationSelect?.value || new URLSearchParams(location.search).get("traduction") || "tob2010";

  const readerUrl = ({book,chapter,verse}) => {
    const params = new URLSearchParams();
    params.set("livre", book);
    params.set("traduction", currentTranslation());
    params.set("chapitre", chapter);
    if (verse) params.set("verset", verse);
    return `/textes/theologie/bible/?${params.toString()}`;
  };

  let lastModalOpener = null;
  let switchingPanel = false;
  let modalCloseTimer = 0;

  const setExpanded = (kind) => {
    pathwayButtons.forEach((button) => {
      const active = button.dataset.biblePathway === kind;
      button.setAttribute("aria-expanded", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });
    pathwayTabs.forEach((button) => {
      const active = button.dataset.biblePathwayTab === kind;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
  };

  const showModal = (kind, opener = null) => {
    window.clearTimeout(modalCloseTimer);
    if (opener) lastModalOpener = opener;
    pathwayModal.hidden = false;
    document.body.classList.add("bible-reader-pathway-modal-open");
    setExpanded(kind);
    requestAnimationFrame(() => {
      pathwayModal.classList.add("is-open");
      pathwayDialog?.querySelector(".bible-reader-pathway-dialog-close")?.focus({preventScroll:true});
    });
  };

  const closeCollections = ({syncState=true} = {}) => {
    if (existingCollectionsPanel && !existingCollectionsPanel.hidden && existingCollectionsClose && syncState) {
      switchingPanel = true;
      existingCollectionsClose.click();
      switchingPanel = false;
    } else if (existingCollectionsPanel) {
      existingCollectionsPanel.hidden = true;
    }
    existingCollectionsPanel?.classList.remove("is-dedicated-collection", "is-prayers", "is-parables");
  };

  const closeRosary = () => {
    rosaryPanel.hidden = true;
  };

  const closeModal = ({collectionAlreadyClosed=false} = {}) => {
    closeRosary();
    closeCollections({syncState:!collectionAlreadyClosed});
    setExpanded("");
    pathwayModal.classList.remove("is-open");
    document.body.classList.remove("bible-reader-pathway-modal-open");
    modalCloseTimer = window.setTimeout(() => {
      pathwayModal.hidden = true;
      if (lastModalOpener?.isConnected) lastModalOpener.focus({preventScroll:true});
      lastModalOpener = null;
    }, reducedMotion ? 0 : 190);
  };

  const openCollection = (kind, opener = null) => {
    if (!existingCollectionsPanel || !existingCollectionsToggle) return;
    closeRosary();
    if (existingCollectionsPanel.hidden) existingCollectionsToggle.click();

    const targetTab = existingCollectionTabs.find((button) => button.dataset.bibleCollection === kind);
    if (targetTab && !targetTab.classList.contains("is-active")) targetTab.click();

    const headKicker = existingCollectionsPanel.querySelector(".bible-reader-collections-head span");
    const headTitle = existingCollectionsPanel.querySelector(".bible-reader-collections-head strong");
    if (headKicker) headKicker.textContent = "Parcours biblique";
    if (headTitle) headTitle.textContent = kind === "prayers" ? "Prières bibliques" : "Paraboles bibliques";

    existingCollectionsPanel.classList.remove("is-prayers", "is-parables");
    existingCollectionsPanel.classList.add("is-dedicated-collection", kind === "prayers" ? "is-prayers" : "is-parables");
    showModal(kind, opener);
    requestAnimationFrame(() => {
      const body = pathwayModal.querySelector(".bible-reader-pathway-dialog-body");
      if (body) body.scrollTop = 0;
    });
  };

  const renderDays = () => {
    daysHost.innerHTML = DAYS.map((day) => {
      const isToday = day.key === today.key;
      const selected = selectionMode === "day" && activeDay.key === day.key;
      return `<button type="button" role="tab" data-rosary-day="${day.key}" aria-selected="${selected ? "true" : "false"}" class="${selected ? "is-active " : ""}${isToday ? "is-today" : ""}"><span>${day.short}</span><small>${GROUPS[day.group].short}</small>${isToday ? '<i>Aujourd’hui</i>' : ""}</button>`;
    }).join("");
  };

  const renderSeries = () => {
    const order = ["joyful","luminous","sorrowful","glorious"];
    seriesHost.innerHTML = order.map((key) => `<button type="button" data-rosary-group="${key}" class="${activeGroupKey === key ? "is-active" : ""}">${GROUPS[key].short}</button>`).join("");
  };

  const renderMysteries = () => {
    activeGroup = GROUPS[activeGroupKey];
    const dayContext = selectionMode === "day" ? `${activeDay.label} · ${activeGroup.label}` : `Par série · ${activeGroup.label}`;
    rosarySummary.innerHTML = `<span>${selectionMode === "day" && activeDay.key === today.key ? "Aujourd’hui" : "Sélection"}</span><strong>${dayContext}</strong>`;
    modeLabel.textContent = selectionMode === "day" ? activeDay.label : "Série de mystères";
    rosaryTitle.textContent = activeGroup.label;
    rosaryIntro.textContent = activeGroup.intro;
    renderDays();
    renderSeries();

    rosaryList.innerHTML = activeGroup.items.map((item, index) => {
      const number = String(index + 1).padStart(2,"0");
      if (item.tradition) {
        return `<article class="bible-reader-rosary-item bible-reader-rosary-item--tradition">
          <span class="bible-reader-rosary-item-num">${number}</span>
          <div class="bible-reader-rosary-item-copy"><small>Tradition chrétienne</small><h4>${item.title}</h4><p>${item.note}</p><div class="bible-reader-rosary-related">${item.refs.map((ref) => `<a href="${readerUrl(ref)}">${ref.label}<span aria-hidden="true">→</span></a>`).join("")}</div></div>
        </article>`;
      }
      return `<article class="bible-reader-rosary-item">
        <span class="bible-reader-rosary-item-num">${number}</span>
        <div class="bible-reader-rosary-item-copy"><small>${item.ref}</small><h4>${item.title}</h4>${item.note ? `<p>${item.note}</p>` : ""}<a class="bible-reader-rosary-read" href="${readerUrl(item)}">Lire le passage <span>${item.ref}</span><i aria-hidden="true">→</i></a></div>
      </article>`;
    }).join("");
  };

  const openRosary = (opener = null) => {
    closeCollections();
    rosaryPanel.hidden = false;
    renderMysteries();
    showModal("rosary", opener);
    requestAnimationFrame(() => {
      const body = pathwayModal.querySelector(".bible-reader-pathway-dialog-body");
      if (body) body.scrollTop = 0;
    });
  };

  const openPathway = (kind, opener = null) => {
    if (kind === "prayers" || kind === "parables") openCollection(kind, opener);
    if (kind === "rosary") openRosary(opener);
  };

  pathwayButtons.forEach((button) => {
    button.addEventListener("click", () => openPathway(button.dataset.biblePathway, button));
  });

  pathwayTabs.forEach((button) => {
    button.addEventListener("click", () => openPathway(button.dataset.biblePathwayTab));
  });

  daysHost.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rosary-day]");
    if (!button) return;
    const day = DAYS.find((candidate) => candidate.key === button.dataset.rosaryDay);
    if (!day) return;
    activeDay = day;
    activeGroupKey = day.group;
    selectionMode = "day";
    renderMysteries();
  });

  seriesHost.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rosary-group]");
    if (!button || !GROUPS[button.dataset.rosaryGroup]) return;
    activeGroupKey = button.dataset.rosaryGroup;
    selectionMode = "series";
    renderMysteries();
  });

  rosaryClose.addEventListener("click", () => closeModal());
  modalCloseButtons.forEach((button) => button.addEventListener("click", () => closeModal()));

  existingCollectionsClose?.addEventListener("click", () => {
    existingCollectionsPanel?.classList.remove("is-dedicated-collection", "is-prayers", "is-parables");
    if (!switchingPanel && !pathwayModal.hidden) closeModal({collectionAlreadyClosed:true});
  });

  document.addEventListener("keydown", (event) => {
    if (pathwayModal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab" || !pathwayDialog) return;
    const focusable = [...pathwayDialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((el) => !el.hidden && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  renderMysteries();
})();

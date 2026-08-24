(() => {
  "use strict";

  const textUrl = window.FV_TEXT_URL || ((item) => `/textes/${encodeURIComponent(typeof item === "string" ? item : item.id)}/`);
  const catalog = window.FV_TEXT_CATALOG || [];
  const legacyPaths = window.FV_TEXT_PATHS || [];
  const programThemes = window.FV_CURRENT_PROGRAM_THEMES || [
    "Art", "Bonheur", "Conscience", "Devoir", "État", "Inconscient", "Justice", "Langage", "Liberté",
    "Nature", "Raison", "Religion", "Science", "Technique", "Temps", "Travail", "Vérité"
  ];

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const foreignTerms = [
    "a posteriori","a priori","amor fati","tabula rasa","Dasein","Aufhebung",
    "eudaimonia","episteme","epoché","epoche","ataraxia","conatus","cogito",
    "physis","nomos","praxis","poiesis","technè","techne","telos","archè","arche",
    "ousia","logos","doxa","pathos","ethos"
  ];
  const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const formatForeignTerms = (value) => {
    let out = escapeHtml(value);
    [...foreignTerms].sort((a,b)=>b.length-a.length).forEach((term) => {
      out = out.replace(new RegExp(`(^|[^\\p{L}])(${escapeRegExp(term)})(?=$|[^\\p{L}])`, "giu"), (m,pre,word) => `${pre}<em class="philo-foreign">${word}</em>`);
    });
    return out;
  };
  const normalize = (value) => String(value || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "'");
  const slugify = (value) => normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const textSections = (item) => item.sections || [item.section];
  const textThemes = (item) => item.themes || (item.theme ? [item.theme] : []);
  const philosophyCatalog = catalog.filter((item) => textSections(item).includes("philosophie"));
  const collator = new Intl.Collator("fr", { sensitivity:"base" });

  // ------------------------------------------------------------
  // Animation utilitaire pour les accordéons construits en JS.
  // ------------------------------------------------------------
  const animatePanel = (panel, open, { immediate = false } = {}) => {
    if (!panel) return;
    const inner = panel.firstElementChild || panel;
    panel.getAnimations?.().forEach((animation) => animation.cancel());
    if (immediate) {
      panel.hidden = !open;
      panel.style.height = open ? "auto" : "0px";
      panel.classList.toggle("is-open", open);
      return;
    }
    if (open) {
      panel.hidden = false;
      panel.classList.add("is-open");
      panel.style.height = "0px";
      const endHeight = Math.max(inner.scrollHeight, inner.getBoundingClientRect().height);
      requestAnimationFrame(() => {
        const animation = panel.animate([{ height:"0px", opacity:.35 }, { height:`${endHeight}px`, opacity:1 }], { duration:330, easing:"cubic-bezier(.22,.75,.2,1)" });
        animation.onfinish = () => { panel.style.height = "auto"; };
      });
    } else {
      const startHeight = panel.getBoundingClientRect().height;
      panel.style.height = `${startHeight}px`;
      const animation = panel.animate([{ height:`${startHeight}px`, opacity:1 }, { height:"0px", opacity:.25 }], { duration:260, easing:"cubic-bezier(.4,0,.2,1)" });
      animation.onfinish = () => {
        panel.classList.remove("is-open");
        panel.style.height = "0px";
        panel.hidden = true;
      };
    }
  };

  // ------------------------------------------------------------
  // 1. Grand fil : trois vues harmonisées, chacune avec recherche.
  // ------------------------------------------------------------
  const orientation = document.querySelector("[data-philo-orientation]");
  if (orientation) {
    const viewTabs = [...orientation.querySelectorAll("[data-philo-view]")];
    const viewPanels = [...orientation.querySelectorAll("[data-philo-view-panel]")];
    const searchInputs = Object.fromEntries([...orientation.querySelectorAll("[data-philo-orientation-search]")].map((input) => [input.dataset.philoOrientationSearch,input]));
    const searchClears = Object.fromEntries([...orientation.querySelectorAll("[data-philo-orientation-search-clear]")].map((button) => [button.dataset.philoOrientationSearchClear,button]));
    const searchFeedback = Object.fromEntries([...orientation.querySelectorAll("[data-philo-orientation-search-feedback]")].map((node) => [node.dataset.philoOrientationSearchFeedback,node]));
    let philoMap = null;
    let philoMapLayer = null;
    let leafletPromise = null;
    let mapMarkerRecords = [];
    let currentMapPeriod = "antiquite";

    const activateView = (mode) => {
      viewTabs.forEach((tab) => {
        const active = tab.dataset.philoView === mode;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      viewPanels.forEach((panel) => {
        const active = panel.dataset.philoViewPanel === mode;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      if (mode === "space") initPhiloMap().then(() => setTimeout(() => philoMap?.invalidateSize(), 90));
    };
    viewTabs.forEach((tab) => tab.addEventListener("click", () => activateView(tab.dataset.philoView)));

    const setSearchFeedback = (mode,message="") => {
      const node = searchFeedback[mode];
      if (!node) return;
      node.textContent = message;
      node.hidden = !message;
    };
    const wireSearchClear = (mode,callback) => {
      const input = searchInputs[mode];
      const clear = searchClears[mode];
      if (!input) return;
      const refresh = () => { if (clear) clear.hidden = !input.value.trim(); callback(input.value); };
      input.addEventListener("input",refresh);
      clear?.addEventListener("click",() => { input.value=""; input.focus(); refresh(); });
    };

    // PÉRIODES — huit accordéons, aucun ouvert par défaut.
    // Les puces d’auteurs donnent aussi un repère biographique/intellectuel au survol.
    const guidedAuthorDescriptions = {
      "thales":"Présocratique de Milet, il cherche dans la nature un principe commun permettant d’expliquer le cosmos.",
      "heraclite":"Présocratique d’Éphèse, il pense le devenir, le logos et la tension des contraires.",
      "parmenide":"Présocratique d’Élée, il oppose la stabilité de l’être aux apparences du changement.",
      "bouddha":"Maître indien à l’origine du bouddhisme, il analyse la souffrance, l’attachement et la voie de la délivrance.",
      "socrate":"Philosophe athénien du dialogue et de l’examen de soi, connu surtout à travers les écrits de ses disciples.",
      "platon":"Disciple de Socrate, il interroge le savoir, le bien, l’âme, la cité et le rapport entre sensible et intelligible.",
      "aristote":"Élève de Platon, il développe une philosophie des causes, de la nature, de la logique, de l’éthique et de la politique.",
      "epicure":"Fondateur du Jardin, il fait de la connaissance des désirs et de la dissipation des peurs une voie vers la tranquillité.",
      "zenon de kition":"Fondateur du stoïcisme, il fait de la vie conforme à la raison et à la nature un idéal de sagesse.",
      "pyrrhon":"Figure fondatrice du scepticisme antique, il associe la suspension du jugement à la tranquillité de l’esprit.",
      "seneque":"Stoïcien romain, il transforme la philosophie en exercice quotidien sur les passions, le temps et la conduite.",
      "epictete":"Stoïcien grec, il distingue ce qui dépend de nous de ce qui n’en dépend pas afin de penser la liberté intérieure.",
      "marc aurele":"Empereur et philosophe stoïcien, il réfléchit à l’exercice du jugement, au devoir et à l’acceptation du monde.",
      "plotin":"Grand penseur néoplatonicien, il décrit une hiérarchie du réel et le retour de l’âme vers son principe, l’Un.",
      "augustin":"Penseur chrétien de l’Antiquité tardive, il articule intériorité, volonté, temps, vérité et rapport à Dieu.",
      "avicenne":"Philosophe persan, il développe une métaphysique de l’être et une théorie de l’âme héritées d’Aristote et transformées.",
      "averroes":"Philosophe andalou et grand commentateur d’Aristote, il pense les rapports entre démonstration philosophique et révélation.",
      "maimonide":"Philosophe juif médiéval, il cherche à articuler raison philosophique, loi religieuse et interprétation des Écritures.",
      "thomas d’aquin":"Théologien et philosophe scolastique, il intègre profondément Aristote à une pensée chrétienne de l’être, de la loi et de Dieu.",
      "guillaume d’ockham":"Philosophe scolastique connu pour son nominalisme et pour une exigence de parcimonie dans l’explication.",
      "sextus empiricus":"Médecin et philosophe sceptique de l’Antiquité tardive, principale source sur le pyrrhonisme ; il expose les arguments qui conduisent à suspendre le jugement plutôt qu’à affirmer dogmatiquement.",
      "critias":"Homme politique athénien et figure associée aux sophistes, Critias est connu notamment pour un fragment présentant la croyance aux dieux comme une invention des législateurs destinée à contrôler les conduites cachées.",
      "saint anselme":"Moine bénédictin puis archevêque de Cantorbéry, Anselme cherche à penser rationnellement la foi chrétienne ; son Proslogion est célèbre pour l’argument dit ontologique de l’existence de Dieu.",
      "robespierre":"Figure centrale de la Révolution française, Robespierre défend une morale civique républicaine et le culte de l’Être suprême, en liant croyance religieuse, vertu publique et ordre social.",
      "marcel gauchet":"Philosophe et historien français contemporain, Gauchet analyse la modernité comme une sortie de la religion : le religieux peut subsister comme croyance alors qu’il cesse d’organiser structurellement la société.",
      "marcel mauss":"Sociologue et anthropologue français, Mauss montre que les manières d’utiliser le corps sont apprises, transmises et socialement réglées ; son idée de « techniques du corps » élargit fortement le sens de la technique.",
      "gilbert simondon":"Philosophe français de la technique, Simondon étudie les objets techniques comme des réalités dotées d’un mode d’existence propre et critique l’opposition simpliste entre l’homme, la culture et la machine.",
      "lucrece":"Poète et philosophe romain héritier d’Épicure, Lucrèce expose une physique atomiste et matérialiste dans De la nature, où il pense aussi l’âme comme corporelle.",
      "diderot":"Philosophe des Lumières et figure majeure de l’Encyclopédie, Diderot développe un matérialisme attentif à la sensibilité, à l’organisation du vivant et aux transformations de la matière.",
      "bentham":"Philosophe anglais fondateur de l’utilitarisme moderne, Bentham évalue les actions d’après leurs effets sur le plaisir et la souffrance et étend explicitement la considération morale aux animaux sensibles.",
      "darwin":"Naturaliste anglais, Darwin transforme la compréhension du vivant avec la théorie de l’évolution par sélection naturelle, qui explique l’adaptation sans projet préalable ni artisan de la nature.",
      "claude bernard":"Médecin et physiologiste français, Claude Bernard est une figure fondatrice de la médecine expérimentale ; il défend l’expérimentation comme méthode de connaissance du vivant.",
      "einstein":"Physicien majeur du XXe siècle, Einstein révolutionne la physique avec la relativité et réfléchit aussi au statut des concepts et des modèles scientifiques.",
      "bachelard":"Philosophe et historien des sciences, Bachelard analyse les ruptures avec le sens commun et la manière dont l’expérimentation construit ses phénomènes à partir de théories et d’instruments.",
      "popper":"Philosophe des sciences, Popper fait de la falsifiabilité et de la mise à l’épreuve critique des théories un critère central de la rationalité scientifique.",
      "jakob von uexkull":"Biologiste germano-balte, Uexküll développe la notion d’Umwelt : chaque vivant habite un monde propre structuré par ses capacités perceptives et actives.",
      "sophocle":"Poète tragique athénien, auteur d’Antigone. Ses tragédies mettent en scène les conflits entre loi politique, devoir familial, ordre divin et responsabilité humaine.",
      "thomas more":"Humaniste anglais de la Renaissance, auteur de L’Utopie, il imagine une société sans propriété privée afin d’interroger l’égalité, le travail et la justice politique.",
      "thoreau":"Écrivain et penseur américain lié au transcendantalisme, il défend dans La Désobéissance civile le refus de coopérer personnellement à une loi injuste.",
      "machiavel":"Penseur politique florentin, il étudie le pouvoir et l’action politique à partir de leurs conditions effectives.",
      "montaigne":"Humaniste sceptique, il fait de l’expérience de soi, de la coutume et de l’incertitude une matière philosophique.",
      "bacon":"Penseur anglais de la méthode expérimentale, il critique les obstacles intellectuels qui faussent la connaissance de la nature.",
      "galilee":"Savant majeur de la révolution scientifique, il contribue à imposer une lecture mathématique et expérimentale de la nature.",
      "descartes":"Rationaliste moderne, il refonde la connaissance à partir du doute méthodique, du cogito et de l’ordre des raisons.",
      "spinoza":"Rationaliste, il pense la nécessité de la nature, les affects, le désir et une liberté fondée sur la compréhension.",
      "hobbes":"Philosophe matérialiste et politique, il analyse les passions, l’état de nature et la nécessité d’un pouvoir commun.",
      "locke":"Empiriste anglais, il fait de l’expérience la source de nos idées et réfléchit aussi à l’identité et au gouvernement.",
      "leibniz":"Rationaliste, il développe les principes de raison suffisante, de continuité et une métaphysique des substances individuelles.",
      "hume":"Empiriste et sceptique écossais, il interroge la causalité, la croyance, les passions et les limites de la raison.",
      "rousseau":"Penseur des Lumières et critique de la société, il travaille sur la liberté, l’éducation, l’inégalité et la volonté générale.",
      "kant":"Philosophe critique, il cherche les conditions et les limites de la connaissance tout en fondant l’autonomie morale.",
      "hegel":"Idéaliste allemand, il pense la dialectique, l’histoire, la reconnaissance et le développement de l’esprit.",
      "schopenhauer":"Philosophe de la volonté et de la représentation, il analyse le désir comme source durable de manque et de souffrance.",
      "j. s. mill":"Utilitariste et libéral, il réfléchit au bonheur, à la liberté individuelle et aux conséquences de l’action.",
      "kierkegaard":"Penseur de l’existence singulière, il explore le choix, l’angoisse, le désespoir et la foi.",
      "marx":"Critique du capitalisme, il pense le travail, les rapports sociaux, l’aliénation et les transformations historiques.",
      "nietzsche":"Critique des valeurs et de la morale, il développe une pensée de la généalogie, des forces, du devenir et de l’affirmation.",
      "freud":"Fondateur de la psychanalyse, il met l’inconscient, le conflit psychique, le désir et l’interprétation au centre de son œuvre.",
      "husserl":"Fondateur de la phénoménologie, il propose de décrire rigoureusement les structures de l’expérience et de la conscience.",
      "bergson":"Philosophe de la durée et de la vie, il oppose souvent l’expérience vécue du temps à sa représentation spatialisée.",
      "heidegger":"Phénoménologue et ontologue, il renouvelle la question de l’être à partir de l’existence, du monde et de la finitude.",
      "wittgenstein":"Philosophe du langage, il passe d’une analyse logique de la proposition à l’étude des usages et jeux de langage.",
      "sartre":"Existentialiste, il pense la liberté comme situation, projet et responsabilité dans un monde sans essence humaine prédéfinie.",
      "beauvoir":"Philosophe existentialiste et féministe, elle analyse la liberté située, l’oppression et la construction sociale de la condition féminine.",
      "arendt":"Philosophe politique, elle réfléchit à l’action, au totalitarisme, à la pluralité, à la culture et aux conditions d’un monde commun.",
      "alain":"Philosophe français, il pense l’art à partir du travail, de la perception et d’une création dont la règle se découvre dans l’œuvre elle-même.",
      "wilde":"Écrivain et penseur de l’esthétisme, il renverse le naturalisme en soutenant que l’art apprend à voir et façonne notre perception de la nature.",
      "levinas":"Phénoménologue et penseur de l’éthique, il fait de la rencontre d’autrui et de la responsabilité un point de départ philosophique.",
      "merleau-ponty":"Phénoménologue, il place le corps vécu, la perception et notre insertion dans le monde au centre de la philosophie.",
      "rawls":"Philosophe politique américain, il renouvelle le contractualisme avec la justice comme équité, le voile d’ignorance, l’égalité des libertés fondamentales et le principe de différence.",
      "saussure":"Linguiste genevois, il fonde une approche structurale de la langue en distinguant signifiant et signifié et en affirmant l’arbitraire du signe.",
      "cassirer":"Philosophe néokantien, il pense le langage comme une forme symbolique qui organise l’expérience plutôt que comme une copie du réel.",
      "zamenhof":"Médecin et linguiste, créateur de l’Espéranto, il conçoit une langue auxiliaire internationale destinée à faciliter une communication égalitaire entre peuples.",
      "benveniste":"Linguiste français, héritier et critique du structuralisme, il travaille sur l’énonciation, la subjectivité et la spécificité du langage humain.",
      "austin":"Philosophe d’Oxford, il analyse le langage ordinaire et montre que certains énoncés accomplissent des actes plutôt qu’ils ne décrivent seulement des faits.",
      "foucault":"Historien des systèmes de pensée, il étudie les discours, les normes, les savoirs, le pouvoir et les formes de subjectivation.",
      "deleuze":"Philosophe de la différence et du devenir, il travaille sur le désir, la création conceptuelle et les multiplicités.",
      "derrida":"Philosophe de la déconstruction, il interroge les oppositions conceptuelles, l’écriture et les conditions instables du sens.",
      "krishnamurti":"Penseur spirituel moderne, il insiste sur l’observation de soi et une liberté intérieure sans autorité doctrinale."
    };
    const eraItems = [...orientation.querySelectorAll("[data-philo-era]")];
    const guidedAuthorTooltip = document.createElement("div");
    guidedAuthorTooltip.className = "philo-author-tooltip";
    guidedAuthorTooltip.setAttribute("role", "tooltip");
    guidedAuthorTooltip.hidden = true;
    document.body.appendChild(guidedAuthorTooltip);
    const hideGuidedAuthorTooltip = () => { guidedAuthorTooltip.hidden = true; };
    const showGuidedAuthorTooltip = (chip, description) => {
      guidedAuthorTooltip.textContent = description;
      guidedAuthorTooltip.hidden = false;
      const rect = chip.getBoundingClientRect();
      const tooltipRect = guidedAuthorTooltip.getBoundingClientRect();
      const maxLeft = Math.max(10, window.innerWidth - tooltipRect.width - 10);
      const left = Math.min(maxLeft, Math.max(10, rect.left + rect.width / 2 - tooltipRect.width / 2));
      let top = rect.top - tooltipRect.height - 9;
      if (top < 10) top = rect.bottom + 9;
      guidedAuthorTooltip.style.left = `${left}px`;
      guidedAuthorTooltip.style.top = `${top}px`;
    };
    eraItems.forEach((era) => {
      era.querySelectorAll(".philo-author-chip").forEach((chip) => {
        const key = normalize(chip.textContent.trim());
        const description = guidedAuthorDescriptions[key];
        if (!description) return;
        chip.dataset.philoAuthorDescription = description;
        chip.setAttribute("aria-label", `${chip.textContent.trim()} — ${description}`);
        chip.addEventListener("mouseenter", () => showGuidedAuthorTooltip(chip, description));
        chip.addEventListener("mouseleave", hideGuidedAuthorTooltip);
        chip.addEventListener("focus", () => showGuidedAuthorTooltip(chip, description));
        chip.addEventListener("blur", hideGuidedAuthorTooltip);
      });
    });
    window.addEventListener("scroll", hideGuidedAuthorTooltip, {passive:true});
    window.addEventListener("resize", hideGuidedAuthorTooltip);
    const closeEra = (era,immediate=false) => {
      era.classList.remove("is-open");
      era.querySelector("[data-philo-era-trigger]")?.setAttribute("aria-expanded","false");
      animatePanel(era.querySelector("[data-philo-era-panel]"),false,{immediate});
    };
    const openEra = (era,{immediate=false,exclusive=true}={}) => {
      if (exclusive) eraItems.forEach((other) => { if (other !== era) closeEra(other,immediate); });
      era.classList.add("is-open");
      era.querySelector("[data-philo-era-trigger]")?.setAttribute("aria-expanded","true");
      animatePanel(era.querySelector("[data-philo-era-panel]"),true,{immediate});
    };
    eraItems.forEach((era) => {
      closeEra(era,true);
      era.querySelector("[data-philo-era-trigger]")?.addEventListener("click",() => era.classList.contains("is-open") ? closeEra(era) : openEra(era));
    });
    wireSearchClear("guided",(raw) => {
      const query=normalize(raw.trim());
      let matches=0; let first=null;
      eraItems.forEach((era) => {
        era.querySelectorAll(".philo-author-chip").forEach((chip) => chip.classList.remove("is-search-match"));
        const ok=!query || normalize(era.dataset.philoEraSearch || era.textContent).includes(query);
        era.hidden=!ok;
        if (!query) { closeEra(era,true); return; }
        if (ok) {
          matches+=1; first ||= era;
          era.querySelectorAll(".philo-author-chip").forEach((chip) => { if (normalize(chip.textContent).includes(query)) chip.classList.add("is-search-match"); });
        } else closeEra(era,true);
      });
      if (query && first) openEra(first,{immediate:true,exclusive:false});
      setSearchFeedback("guided",query ? (matches ? `${matches} période${matches>1?"s":""} correspondante${matches>1?"s":""}.` : "Aucune période ne correspond à cette recherche.") : "");
    });


    const revealOrientationHash = ({ smooth = true } = {}) => {
      const id = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target || !orientation.contains(target)) return;
      activateView("guided");
      const era = target.closest("[data-philo-era]");
      if (era) openEra(era,{immediate:true,exclusive:true});
      target.classList.add("is-linked-target");
      window.setTimeout(() => target.scrollIntoView({behavior:smooth ? "smooth" : "auto",block:"center"}), 40);
      window.setTimeout(() => target.classList.remove("is-linked-target"), 1800);
    };
    window.addEventListener("hashchange",() => revealOrientationHash({smooth:true}));
    window.setTimeout(() => revealOrientationHash({smooth:false}), 80);

    // FRISE — tous les auteurs restent dans la largeur du composant ; les noms
    // apparaissent dans une fiche de lecture plutôt que dans des bulles débordantes.
    const timelineAuthors = [
      {name:"Thalès",year:-624,dates:"v. 624–546 av. J.-C.",school:"Présocratiques",note:"Chercher un principe naturel du cosmos."},
      {name:"Héraclite",year:-540,dates:"v. 540–480 av. J.-C.",school:"Présocratiques",note:"Devenir, logos et tension des contraires.",major:true},
      {name:"Parménide",year:-515,dates:"v. 515–450 av. J.-C.",school:"Présocratiques",note:"Penser l’être et la difficulté du changement.",major:true},
      {name:"Bouddha",year:-500,dates:"v. 500–v. 420 av. J.-C.",school:"Bouddhisme",note:"Désir, attachement, éveil et délivrance du cycle des renaissances.",major:true,url:"/textes/philosophie/?auteur=Siddhartha%20Gautama%2C%20dit%20Bouddha",local:true},
      {name:"Sophocle",year:-495,dates:"v. 495–406 av. J.-C.",school:"Tragédie grecque",note:"Conflits entre loi, justice et ordre divin.",url:"/textes/philosophie/?auteur=Sophocle",local:true},
      {name:"Socrate",year:-470,dates:"v. 470–399 av. J.-C.",school:"Athènes classique",note:"Examen de soi, dialogue et recherche de définitions.",major:true},
      {name:"Platon",year:-428,dates:"v. 428–348 av. J.-C.",school:"Platonisme",note:"Opinion et savoir, intelligible, âme, cité.",major:true,url:"/textes/philosophie/?auteur=Platon",local:true},
      {name:"Aristote",year:-384,dates:"384–322 av. J.-C.",school:"Aristotélisme",note:"Causes, logique, nature, éthique et politique.",major:true,url:"/textes/philosophie/?auteur=Aristote",local:true},
      {name:"Épicure",year:-341,dates:"341–270 av. J.-C.",school:"Épicurisme",note:"Plaisir stable, désirs et tranquillité.",major:true,url:"/textes/philosophie/?auteur=%C3%89picure",local:true},
      {name:"Lucrèce",year:-99,dates:"v. 99–55 av. J.-C.",school:"Épicurisme / atomisme",note:"Matière, âme corporelle et critique des peurs religieuses.",url:"/textes/philosophie/?auteur=Lucr%C3%A8ce",local:true},
      {name:"Zénon",year:-334,dates:"v. 334–262 av. J.-C.",school:"Stoïcisme",note:"Fondation de l’école stoïcienne."},
      {name:"Sénèque",year:-4,dates:"v. 4 av. J.-C.–65",school:"Stoïcisme romain",note:"Vertu, jugement et exercice philosophique.",url:"/textes/philosophie/?auteur=S%C3%A9n%C3%A8que",local:true},
      {name:"Épictète",year:50,dates:"v. 50–135",school:"Stoïcisme romain",note:"Distinguer ce qui dépend de nous.",major:true,url:"/textes/philosophie/?auteur=%C3%89pict%C3%A8te",local:true},
      {name:"Plotin",year:204,dates:"204/205–270",school:"Néoplatonisme",note:"Hiérarchie du réel et retour vers l’Un.",major:true},
      {name:"Augustin",year:354,dates:"354–430",school:"Augustinisme",note:"Intériorité, vérité, volonté et Dieu.",major:true,url:"/textes/philosophie/?auteur=Saint%20Augustin",local:true},
      {name:"Avicenne",year:980,dates:"980–1037",school:"Philosophie islamique",note:"Métaphysique, intellect et nécessité.",major:true},
      {name:"Averroès",year:1126,dates:"1126–1198",school:"Aristotélisme médiéval",note:"Commentaire d’Aristote et rapports entre démonstration et révélation.",major:true,url:"/textes/averroes-interpreter-revelation/",local:true},
      {name:"Thomas d’Aquin",year:1225,dates:"v. 1225–1274",school:"Scolastique",note:"Synthèse aristotélicienne, théologie et philosophie.",major:true},
      {name:"Thomas More",year:1478,dates:"1478–1535",school:"Humanisme",note:"Utopie, égalité, propriété et organisation du travail.",url:"/textes/philosophie/?auteur=Thomas%20More",local:true},
      {name:"Machiavel",year:1469,dates:"1469–1527",school:"Pensée politique moderne",note:"Pouvoir, conflit et autonomie de l’analyse politique.",major:true},
      {name:"Montaigne",year:1533,dates:"1533–1592",school:"Humanisme",note:"Essai, scepticisme et connaissance de soi."},
      {name:"Bacon",year:1561,dates:"1561–1626",school:"Méthode expérimentale",note:"Réforme du savoir et enquête empirique."},
      {name:"Galilée",year:1564,dates:"1564–1642",school:"Nouvelle science",note:"Mathématisation et expérience."},
      {name:"Hobbes",year:1588,dates:"1588–1679",school:"Contractualisme",note:"État, conflit et souveraineté.",major:true},
      {name:"Descartes",year:1596,dates:"1596–1650",school:"Rationalisme",note:"Méthode, doute, sujet et maîtrise des désirs.",major:true,url:"/textes/philosophie/?auteur=Ren%C3%A9%20Descartes",local:true},
      {name:"Spinoza",year:1632,dates:"1632–1677",school:"Rationalisme",note:"Nécessité, affects, désir et liberté.",major:true,url:"/textes/philosophie/?auteur=Baruch%20Spinoza",local:true},
      {name:"Locke",year:1632,dates:"1632–1704",school:"Empirisme",note:"Expérience, conscience, mémoire et identité personnelle.",major:true,url:"/textes/philosophie/?auteur=John%20Locke",local:true},
      {name:"Leibniz",year:1646,dates:"1646–1716",school:"Rationalisme",note:"Raison suffisante, petites perceptions, mondes possibles et théodicée.",url:"/textes/philosophie/?auteur=Gottfried%20Wilhelm%20Leibniz",local:true},
      {name:"Hume",year:1711,dates:"1711–1776",school:"Empirisme",note:"Expérience, causalité, croyance et scepticisme.",major:true,url:"/textes/philosophie/?auteur=David%20Hume",local:true},
      {name:"Rousseau",year:1712,dates:"1712–1778",school:"Lumières / critique sociale",note:"Liberté, société, désir et politique.",major:true,url:"/textes/philosophie/?auteur=Jean-Jacques%20Rousseau",local:true},
      {name:"Diderot",year:1713,dates:"1713–1784",school:"Lumières / matérialisme",note:"Matière, sensibilité, vivant et Encyclopédie.",url:"/textes/philosophie/?auteur=Denis%20Diderot",local:true},
      {name:"Bentham",year:1748,dates:"1748–1832",school:"Utilitarisme",note:"Utilité, plaisir, souffrance et considération morale des animaux.",url:"/textes/philosophie/?auteur=J%C3%A9r%C3%A9my%20Bentham",local:true},
      {name:"Kant",year:1724,dates:"1724–1804",school:"Philosophie critique",note:"Conditions et limites du savoir, autonomie morale.",major:true,url:"/textes/philosophie/?auteur=Emmanuel%20Kant",local:true},
      {name:"Hegel",year:1770,dates:"1770–1831",school:"Idéalisme allemand",note:"Dialectique, histoire et esprit.",major:true,url:"/textes/philosophie/?auteur=Georg%20Wilhelm%20Friedrich%20Hegel",local:true},
      {name:"Schopenhauer",year:1788,dates:"1788–1860",school:"Pessimisme philosophique",note:"Volonté, désir, souffrance et représentation.",major:true,url:"/textes/philosophie/?auteur=Arthur%20Schopenhauer",local:true},
      {name:"J. S. Mill",year:1806,dates:"1806–1873",school:"Utilitarisme",note:"Liberté, conséquences et bien-être.",major:true,url:"/textes/philosophie/?auteur=John%20Stuart%20Mill",local:true},
      {name:"Darwin",year:1809,dates:"1809–1882",school:"Évolutionnisme",note:"Variation, sélection naturelle et histoire du vivant.",url:"/textes/philosophie/?auteur=Charles%20Darwin",local:true},
      {name:"Claude Bernard",year:1813,dates:"1813–1878",school:"Médecine expérimentale",note:"Expérience, physiologie et méthode scientifique du vivant.",url:"/textes/philosophie/?auteur=Claude%20Bernard",local:true},
      {name:"Kierkegaard",year:1813,dates:"1813–1855",school:"Philosophie de l’existence",note:"Choix, angoisse, foi, oisiveté et singularité.",major:true,url:"/textes/philosophie/?auteur=S%C3%B8ren%20Kierkegaard",local:true},
      {name:"Thoreau",year:1817,dates:"1817–1862",school:"Transcendantalisme",note:"Désobéissance civile, conscience et critique de l’État.",url:"/textes/philosophie/?auteur=Henry%20David%20Thoreau",local:true},
      {name:"Marx",year:1818,dates:"1818–1883",school:"Matérialisme / critique sociale",note:"Travail, rapports sociaux, idéologie et critique de la religion.",major:true,url:"/textes/philosophie/?auteur=Karl%20Marx",local:true},
      {name:"Marcel Mauss",year:1872,dates:"1872–1950",school:"Sociologie / anthropologie",note:"Don, techniques du corps et faits sociaux.",url:"/textes/philosophie/?auteur=Marcel%20Mauss",local:true},
      {name:"Nietzsche",year:1844,dates:"1844–1900",school:"Généalogie / critique des valeurs",note:"Valeurs, forces, perspective et devenir.",major:true,url:"/textes/philosophie/?auteur=Friedrich%20Nietzsche",local:true},
      {name:"Wilde",year:1854,dates:"1854–1900",school:"Esthétisme",note:"Art, perception et invention de la nature.",url:"/textes/philosophie/?auteur=Oscar%20Wilde",local:true},
      {name:"Alain",year:1868,dates:"1868–1951",school:"Philosophie française",note:"Art, travail, perception et jugement.",url:"/textes/philosophie/?auteur=Alain",local:true},
      {name:"Freud",year:1856,dates:"1856–1939",school:"Psychanalyse",note:"Inconscient, rêve, refoulement et interprétation.",major:true,url:"/textes/philosophie/?auteur=Sigmund%20Freud",local:true},
      {name:"Husserl",year:1859,dates:"1859–1938",school:"Phénoménologie",note:"Description de l’expérience et intentionnalité.",major:true},
      {name:"Bergson",year:1859,dates:"1859–1941",school:"Spiritualisme / durée",note:"Durée, mémoire, intuition et vie.",url:"/textes/philosophie/?auteur=Henri%20Bergson",local:true},
      {name:"Jakob von Uexküll",year:1864,dates:"1864–1944",school:"Biologie / théorie du milieu",note:"Umwelt, perception et monde propre de l’animal.",url:"/textes/philosophie/?auteur=Jakob%20von%20Uexk%C3%BCll",local:true},
      {name:"Saussure",year:1857,dates:"1857–1913",school:"Linguistique structurale",note:"Signe, signifiant, signifié et arbitraire de la langue.",url:"/textes/philosophie/?auteur=Ferdinand%20de%20Saussure",local:true},
      {name:"Zamenhof",year:1859,dates:"1859–1917",school:"Espérantisme",note:"Langue artificielle, neutralité et communication internationale.",url:"/textes/philosophie/?auteur=Ludwik%20Zamenhof",local:true},
      {name:"Cassirer",year:1874,dates:"1874–1945",school:"Formes symboliques",note:"Langage, culture et construction symbolique du monde.",url:"/textes/philosophie/?auteur=Ernst%20Cassirer",local:true},
      {name:"Einstein",year:1879,dates:"1879–1955",school:"Physique contemporaine",note:"Relativité, concepts physiques et construction de modèles du réel.",major:true,url:"/textes/philosophie/?auteur=Albert%20Einstein",local:true},
      {name:"Bachelard",year:1884,dates:"1884–1962",school:"Épistémologie",note:"Rupture épistémologique, phénoménotechnique et construction scientifique des phénomènes.",url:"/textes/philosophie/?auteur=Gaston%20Bachelard",local:true},
      {name:"Popper",year:1902,dates:"1902–1994",school:"Épistémologie critique",note:"Falsifiabilité, tests et critique des théories non réfutables.",url:"/textes/philosophie/?auteur=Karl%20R.%20Popper",local:true},
      {name:"Heidegger",year:1889,dates:"1889–1976",school:"Phénoménologie / ontologie",note:"Être, monde, œuvre et dévoilement.",major:true,url:"/textes/philosophie/?auteur=Martin%20Heidegger",local:true},
      {name:"Arendt",year:1906,dates:"1906–1975",school:"Philosophie politique",note:"Action, culture, œuvre et monde commun.",major:true,url:"/textes/philosophie/?auteur=Hannah%20Arendt",local:true},
      {name:"Wittgenstein",year:1889,dates:"1889–1951",school:"Philosophie analytique",note:"Logique, langage, interprétation et critique de Freud.",major:true,url:"/textes/philosophie/?auteur=Ludwig%20Wittgenstein",local:true},
      {name:"Krishnamurti",year:1895,dates:"1895–1986",school:"Pensée spirituelle moderne",note:"Observation, liberté intérieure et fin de la recherche du bonheur.",url:"/textes/philosophie/?auteur=Jiddu%20Krishnamurti",local:true},
      {name:"Sartre",year:1905,dates:"1905–1980",school:"Existentialisme",note:"Liberté, mauvaise foi, situation et responsabilité.",major:true,url:"/textes/philosophie/?auteur=Jean-Paul%20Sartre",local:true},
      {name:"Benveniste",year:1902,dates:"1902–1976",school:"Linguistique / énonciation",note:"Langage humain, dialogue, énonciation et subjectivité.",url:"/textes/philosophie/?auteur=%C3%89mile%20Benveniste",local:true},
      {name:"Austin",year:1911,dates:"1911–1960",school:"Philosophie du langage ordinaire",note:"Actes de langage, performatifs et conditions de réussite.",url:"/textes/philosophie/?auteur=John%20Langshaw%20Austin",local:true},
      {name:"Lévinas",year:1906,dates:"1906–1995",school:"Phénoménologie / éthique",note:"Altérité, visage, désir et responsabilité.",major:true,url:"/textes/philosophie/?auteur=Emmanuel%20L%C3%A9vinas",local:true},
      {name:"Beauvoir",year:1908,dates:"1908–1986",school:"Existentialisme",note:"Liberté située, oppression et condition."},
      {name:"Rawls",year:1921,dates:"1921–2002",school:"Philosophie politique",note:"Justice comme équité, voile d’ignorance et principes d’institutions justes.",major:true,url:"/textes/philosophie/?auteur=John%20Rawls",local:true},
      {name:"Hannah Arendt",year:1906,dates:"1906–1975",school:"Philosophie politique",note:"Travail, œuvre, action, monde commun et culture.",url:"/textes/philosophie/?auteur=Hannah%20Arendt",local:true},
      {name:"Gilbert Simondon",year:1924,dates:"1924–1989",school:"Philosophie de la technique",note:"Individuation, objets techniques et relation homme-machine.",url:"/textes/philosophie/?auteur=Gilbert%20Simondon",local:true},
      {name:"Foucault",year:1926,dates:"1926–1984",school:"Généalogie / histoire des savoirs",note:"Discours, normes, pouvoir et subjectivation.",major:true,url:"/textes/philosophie/?auteur=Michel%20Foucault",local:true},
      {name:"Marcel Gauchet",year:1946,dates:"né en 1946",school:"Philosophie politique",note:"Désenchantement, démocratie et sortie de la religion.",url:"/textes/philosophie/?auteur=Marcel%20Gauchet",local:true}
    ];
    // La fiche sous la frise doit présenter l’auteur, pas seulement aligner des mots-clés.
    const timelineDescriptionAliases = {
      "zénon":"zenon de kition",
      "j. s. mill":"j. s. mill"
    };
    timelineAuthors.forEach((author) => {
      const rawKey = normalize(author.name);
      const key = timelineDescriptionAliases[rawKey] || rawKey;
      if (guidedAuthorDescriptions[key]) author.note = guidedAuthorDescriptions[key];
    });

    const timelineEras = [
      {id:"antiquite",label:"Antiquité",dates:"VIe s. av. J.-C. → Ve s.",start:-650,end:500},
      {id:"medieval",label:"Moyen Âge",dates:"Ve → XVe s.",start:500,end:1450},
      {id:"modernes",label:"Modernes",dates:"XVe → XVIIIe s.",start:1450,end:1789},
      {id:"xixe",label:"XIXe siècle",dates:"1789 → 1900",start:1789,end:1900},
      {id:"contemporain",label:"XXe–XXIe",dates:"1900 → aujourd’hui",start:1900,end:2050}
    ];
    const timelineRoot = orientation.querySelector("[data-philo-master-timeline]");
    const setTimelineFocus = (author) => {
      const focus=orientation.querySelector("[data-philo-master-focus]");
      if (!focus || !author) return;
      focus.innerHTML=`<span>${escapeHtml(author.dates)} · ${escapeHtml(author.school)}</span><strong>${escapeHtml(author.name)}${author.major ? ' <i>★</i>' : ''}</strong><p>${escapeHtml(author.note)}</p>${author.local && author.url ? `<a href="${author.url}">Voir les textes →</a>` : ""}`;
      focus.classList.add("has-author");
    };
    if (timelineRoot) {
      const eraHtml=timelineEras.map((era,eraIndex) => {
        const authors=timelineAuthors.filter((author) => author.year>=era.start && author.year<era.end).sort((a,b)=>a.year-b.year);
        const span=Math.max(1,era.end-era.start);
        const markers=authors.map((author,index) => {
          const left=Math.min(96,Math.max(4,((author.year-era.start)/span)*100));
          const lane=index%6;
          const tag=author.url?"a":"button";
          const attrs=author.url?`href="${author.url}"`:'type="button"';
          return `<${tag} ${attrs} class="philo-master-author${author.local?" is-local":""}${author.major?" is-major":""}" style="left:${left.toFixed(2)}%;--lane:${lane}" data-philo-master-author="${escapeHtml(author.name)}" data-philo-master-search="${escapeHtml(`${author.name} ${author.dates} ${author.school} ${author.note}`)}" aria-label="${escapeHtml(author.name)}, ${escapeHtml(author.dates)}"><span class="philo-master-author-dot"></span>${author.major?'<span class="philo-master-author-star">★</span>':''}<span class="philo-master-author-label">${escapeHtml(author.name)}</span></${tag}>`;
        }).join("");
        return `<section class="philo-master-era philo-master-era--${era.id}" style="--era-index:${eraIndex}"><div class="philo-master-era-plot">${markers}</div><footer><strong>${escapeHtml(era.label)}</strong><small>${escapeHtml(era.dates)}</small></footer></section>`;
      }).join("");
      timelineRoot.innerHTML=`<div class="philo-master-track"><div class="philo-master-axis"></div>${eraHtml}</div><aside class="philo-master-focus" data-philo-master-focus><span>Repère interactif</span><strong>Survolez un auteur</strong><p>Ses dates, son courant et son rôle apparaîtront ici.</p></aside>`;
      const markerNodes=[...timelineRoot.querySelectorAll("[data-philo-master-author]")];
      markerNodes.forEach((node) => {
        const author=timelineAuthors.find((item) => item.name===node.dataset.philoMasterAuthor);
        node.addEventListener("mouseenter",() => setTimelineFocus(author));
        node.addEventListener("focus",() => setTimelineFocus(author));
        node.addEventListener("click",() => setTimelineFocus(author));
      });
      wireSearchClear("line",(raw) => {
        const query=normalize(raw.trim()); let matches=[];
        markerNodes.forEach((node) => {
          const ok=!query || normalize(node.dataset.philoMasterSearch).includes(query);
          node.classList.toggle("is-search-muted",!!query && !ok);
          node.classList.toggle("is-search-match",!!query && ok);
          if (query && ok) matches.push(node);
        });
        if (matches.length) {
          const author=timelineAuthors.find((item) => item.name===matches[0].dataset.philoMasterAuthor);
          setTimelineFocus(author);
        }
        setSearchFeedback("line",query ? (matches.length ? `${matches.length} auteur${matches.length>1?"s":""} trouvé${matches.length>1?"s":""}.` : "Aucun auteur ou courant trouvé sur la frise.") : "");
      });
    }

    // CARTE — recherche par auteur ou lieu, avec changement automatique d’époque.
    const mapEl = orientation.querySelector("[data-philo-map]");
    const mapLoading = orientation.querySelector("[data-philo-map-loading]");
    const mapPeriodButtons = [...orientation.querySelectorAll("[data-philo-map-period]")];
    const PHILO_MAPS = {
      antiquite:{center:[34,45],zoom:3,points:[
        ["Bodh-Gayā",24.6961,84.9912,"Bouddha"],["Éphèse",37.94,27.34,"Héraclite"],["Élée",40.16,15.16,"Parménide"],["Athènes",37.9838,23.7275,"Socrate · Platon · Aristote · Épicure"],["Rome",41.9028,12.4964,"Sénèque"],["Nicopolis",39.01,20.74,"Épictète"],["Alexandrie",31.2001,29.9187,"Plotin · Sextus Empiricus"],["Hippone",36.88,7.75,"Augustin"]
      ]},
      medieval:{center:[42,18],zoom:3,points:[
        ["Boukhara",39.768,64.455,"Avicenne"],["Cordoue",37.888,-4.779,"Averroès"],["Le Caire",30.044,31.236,"Maïmonide"],["Paris",48.8566,2.3522,"Thomas d’Aquin"],["Oxford",51.752,-1.257,"Guillaume d’Ockham"]
      ]},
      moderne:{center:[50,8],zoom:4,points:[
        ["Florence",43.7696,11.2558,"Machiavel"],["Bordeaux",44.8378,-0.5792,"Montaigne"],["Londres",51.5074,-0.1278,"Bacon · Hobbes · Locke"],["Paris",48.8566,2.3522,"Descartes"],["Amsterdam / La Haye",52.15,4.55,"Spinoza"],["Édimbourg",55.9533,-3.1883,"Hume"],["Genève",46.2044,6.1432,"Rousseau"],["Königsberg",54.7104,20.4522,"Kant"]
      ]},
      xixe:{center:[51,9],zoom:4,points:[
        ["Berlin",52.52,13.405,"Hegel · Marx"],["Francfort",50.1109,8.6821,"Schopenhauer"],["Copenhague",55.6761,12.5683,"Kierkegaard"],["Londres",51.5074,-0.1278,"John Stuart Mill"],["Bâle",47.5596,7.5886,"Nietzsche"],["Genève",46.2044,6.1432,"Saussure"],["Varsovie",52.2297,21.0122,"Zamenhof"]
      ]},
      xxe:{center:[49,5],zoom:4,points:[
        ["Vienne",48.2082,16.3738,"Freud · Wittgenstein"],["Hambourg",53.5511,9.9937,"Cassirer"],["Fribourg-en-Brisgau",47.999,7.8421,"Husserl · Heidegger"],["Paris",48.8566,2.3522,"Bergson · Sartre · Beauvoir · Lévinas · Benveniste · Foucault"],["Cambridge",52.2053,0.1218,"Wittgenstein"],["Oxford",51.752,-1.2577,"Austin"],["Cambridge (Mass.)",42.3736,-71.1097,"Rawls"],["Concord (Mass.)",42.4604,-71.3489,"Thoreau"]
      ]}
    };

    const authorLink = (name) => {
      const needle = normalize(name).replace(/^john stuart /, "j. s. ");
      const item = philosophyCatalog.find((candidate) => {
        const full = normalize(candidate.author || "");
        const tag = normalize(candidate.authorTag || "");
        return full === needle || full.endsWith(` ${needle}`) || (tag && (tag === needle || tag.includes(needle) || needle.includes(tag)));
      });
      return item?.author ? `/textes/philosophie/?auteur=${encodeURIComponent(item.author)}` : "";
    };
    const popupAuthors = (value) => value.split(" · ").map((name) => {
      const url = authorLink(name);
      return url ? `<a href="${url}">${escapeHtml(name)} <i>→</i></a>` : `<span>${escapeHtml(name)}</span>`;
    }).join("");
    const loadLeaflet = () => {
      if (window.L) return Promise.resolve(window.L);
      if (leafletPromise) return leafletPromise;
      leafletPromise = new Promise((resolve,reject) => {
        if (!document.querySelector('link[data-philo-leaflet-css]')) {
          const link=document.createElement("link"); link.rel="stylesheet"; link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; link.dataset.philoLeafletCss=""; document.head.append(link);
        }
        const script=document.createElement("script"); script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.defer=true; script.onload=()=>resolve(window.L); script.onerror=reject; document.head.append(script);
      });
      return leafletPromise;
    };
    const mapMarker = () => L.divIcon({className:"",html:'<span class="philo-map-marker">φ</span>',iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-12]});
    const mapLabel = (name) => L.divIcon({className:"philo-map-label-wrap",html:`<span class="philo-map-label">${escapeHtml(name)}</span>`,iconSize:[1,1],iconAnchor:[-10,8]});
    const renderPhiloMap = (period="antiquite") => {
      const preset=PHILO_MAPS[period] || PHILO_MAPS.antiquite;
      currentMapPeriod=period;
      if (!philoMap) return;
      if (philoMapLayer) philoMapLayer.remove();
      philoMapLayer=L.layerGroup().addTo(philoMap); mapMarkerRecords=[];
      preset.points.forEach(([place,lat,lng,authors]) => {
        const popup=`<div class="philo-map-popup"><strong>${escapeHtml(place)}</strong><div>${popupAuthors(authors)}</div></div>`;
        const marker=L.marker([lat,lng],{icon:mapMarker()}).bindPopup(popup,{maxWidth:270}).addTo(philoMapLayer);
        L.marker([lat,lng],{icon:mapLabel(place),interactive:false,keyboard:false}).addTo(philoMapLayer);
        mapMarkerRecords.push({place,authors,lat,lng,marker});
      });
      philoMap.setView(preset.center,preset.zoom,{animate:true});
    };
    const initPhiloMap = async () => {
      if (philoMap) return philoMap;
      if (!mapEl) return null;
      try {
        await loadLeaflet();
        philoMap=L.map(mapEl,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView(PHILO_MAPS.antiquite.center,PHILO_MAPS.antiquite.zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(philoMap);
        renderPhiloMap("antiquite"); mapLoading?.classList.add("is-hidden"); return philoMap;
      } catch(error) { if (mapLoading) mapLoading.innerHTML="<p>La carte n’a pas pu être chargée. Vérifiez votre connexion internet.</p>"; return null; }
    };
    const setMapPeriodButton = (period) => mapPeriodButtons.forEach((button) => button.classList.toggle("is-active",button.dataset.philoMapPeriod===period));
    mapPeriodButtons.forEach((button) => button.addEventListener("click",async() => { setMapPeriodButton(button.dataset.philoMapPeriod); await initPhiloMap(); renderPhiloMap(button.dataset.philoMapPeriod); }));
    wireSearchClear("space",async(raw) => {
      const query=normalize(raw.trim());
      if (!query) { setSearchFeedback("space",""); return; }
      let found=null;
      Object.entries(PHILO_MAPS).some(([period,preset]) => preset.points.some((point) => {
        const [place,lat,lng,authors]=point;
        if (normalize(`${place} ${authors}`).includes(query)) { found={period,place,lat,lng,authors}; return true; }
        return false;
      }));
      if (!found) { setSearchFeedback("space","Aucun auteur ou lieu ne correspond à cette recherche."); return; }
      setSearchFeedback("space",`${found.place} · ${found.authors}`);
      setMapPeriodButton(found.period);
      await initPhiloMap();
      if (currentMapPeriod!==found.period) renderPhiloMap(found.period);
      const record=mapMarkerRecords.find((item) => item.place===found.place);
      if (record) { philoMap.flyTo([record.lat,record.lng],Math.max(philoMap.getZoom(),5),{duration:.45}); setTimeout(() => record.marker.openPopup(),380); }
    });
  }

  // ------------------------------------------------------------
  // 2. Parcours par thèmes : 17 notions + thèmes complémentaires.
  // ------------------------------------------------------------
  const pathRoot = document.querySelector("[data-philo-paths]");
  const pathSearch = document.querySelector("[data-philo-path-search]");
  const pathSearchClear = document.querySelector("[data-philo-path-search-clear]");
  const pathSearchFeedback = document.querySelector("[data-philo-path-search-feedback]");
  const pathTabs = [...document.querySelectorAll("[data-philo-path-tab]")];
  const otherCount = document.querySelector("[data-philo-other-count]");
  const allCount = document.querySelector("[data-philo-all-count]");

  const pathGuides = {
    art:{
      intro:"Œuvre, création, génie, imitation, vérité et jugement de goût.",
      groups:[
        {kind:"Grande controverse",question:"L’œuvre d’art est-elle un objet technique ?",note:"Durée de l’œuvre et création sans règle préalable.",texts:["arendt-oeuvre-art-duree-monde","alain-artiste-artisan-idee-oeuvre"]},
        {kind:"Grande controverse",question:"Le génie obéit-il à des règles ?",note:"Nature inspiratrice contre travail et genèse.",texts:["kant-genie-regles-art","nietzsche-culte-genie"]},
        {kind:"Grande controverse",question:"L’art doit-il imiter la nature ?",note:"Hegel refuse la copie ; Wilde renverse l’imitation.",texts:["hegel-art-imitation-nature","wilde-nature-imite-art"]},
        {kind:"Grande controverse",question:"L’art nous éloigne-t-il du vrai ou le dévoile-t-il ?",note:"Simulacre chez Platon ; dévoilement chez Heidegger.",texts:["platon-art-imitation-eloigne-vrai","heidegger-art-devoile-verite-souliers"]},
        {kind:"Grande controverse",question:"Peut-on discuter des goûts ?",note:"Universalité visée et délicatesse du jugement.",texts:["kant-antinomie-gout","hume-norme-gout-delicatesse"]},
        {kind:"Grande question",question:"La création peut-elle échapper à l’utilité ?",note:"Poésie comme fin ; création au-delà du besoin.",texts:["sartre-langage-poesie-fin","nietzsche-travail-jeu-creation"]}
      ]
    },
    bonheur:{
      intro:"Désir, plaisir, maîtrise de soi, action et limites du bonheur.",
      groups:[
        {kind:"Grande controverse",question:"Faut-il satisfaire ses désirs pour être heureux ?",note:"Accomplir les passions, les hiérarchiser ou apprendre la mesure.",texts:["platon-callicles-desirs","platon-socrate-temperance","epicure-plaisir-vie-heureuse","rousseau-desir-imagination-bonheur"]},
        {kind:"Question directrice",question:"Le bonheur dépend-il de nous ?",note:"Ce que nous pouvons gouverner : jugements, désirs, vertu et puissance d’agir.",texts:["epictete-depend-nous","descartes-changer-desirs","descartes-trois-regles-bonheur","seneque-vie-vertueuse","spinoza-desir-puissance-exister"]},
        {kind:"Grande controverse",question:"Le bonheur est-il activité, plaisir ou absence de souffrance ?",note:"Conceptions positives du bonheur et analyses de sa fragilité ou de sa négativité.",texts:["alain-bonheur-agir","freud-bonheur-episodique","schopenhauer-desir-souffrance-ennui","schopenhauer-bien-etre-negation","schopenhauer-bonheur-absence-souffrance"]},
        {kind:"Question directrice",question:"Peut-on viser directement le bonheur ?",note:"Le bonheur est-il un but ou l’effet d’une autre orientation de l’existence ?",texts:["kant-quietude-inaccessible","krishnamurti-bonheur-sans-recherche","pascal-divertissement-condition","pascal-bonheur-avenir","augustin-dieu-bonheur"]},
        {kind:"Grande controverse",question:"La morale doit-elle nous rendre heureux ?",note:"Mill rattache l’évaluation morale au bonheur tout en hiérarchisant les plaisirs ; Kant distingue devoir, dignité et bonheur.",texts:["mill-qualite-plaisirs-morale","kant-morale-dignite-bonheur"]}
      ]
    },
    liberte:{
      intro:"Faire ce que l’on veut, se gouverner soi-même ou transformer ses désirs.",
      groups:[
        {kind:"Grande controverse",question:"Être libre, est-ce satisfaire tout ce que l’on désire ?",note:"Le modèle de la puissance sans frein rencontre celui de la maîtrise de soi.",texts:["platon-callicles-desirs","epictete-depend-nous"]},
        {kind:"Question directrice",question:"Peut-on devenir plus libre en travaillant sur ses désirs ?",note:"Descartes déplace la liberté vers le gouvernement de soi.",texts:["descartes-changer-desirs","descartes-trois-regles-bonheur"]},
        {kind:"Grande question",question:"La liberté suppose-t-elle une nature humaine déjà définie ?",note:"Sartre fait de l’existence et du projet le point de départ de ce que nous devenons.",texts:["sartre-existence-precede-essence"]}
      ]
    },
    raison:{
      intro:"La raison comme guide de vie, méthode et puissance d’interprétation.",
      groups:[
        {kind:"Question directrice",question:"La raison peut-elle nous apprendre à mieux vivre ?",note:"Raisonner sur les désirs et régler sa conduite.",texts:["epicure-plaisir-vie-heureuse","descartes-trois-regles-bonheur"]},
        {kind:"Grande question",question:"Jusqu’où la raison peut-elle interpréter ?",note:"Révélation religieuse et phénomènes psychiques imposent deux terrains très différents.",texts:["averroes-interpreter-revelation","freud-interpretations-delirantes"]},
        {kind:"Question directrice",question:"Le temps vient-il de l’expérience ?",note:"Kant examine le temps comme condition a priori de toute expérience possible.",texts:["kant-temps-forme-a-priori"]},
        {kind:"Question directrice",question:"La raison peut-elle remonter de l’existence du monde à Dieu ?",note:"Leibniz cherche une raison suffisante à l’ensemble des choses contingentes et l’identifie à une substance nécessaire.",texts:["leibniz-raison-existence-monde"]},
        {kind:"Question directrice",question:"La raison peut-elle fonder la morale ?",note:"Kant distingue la destination morale de la raison de son aptitude incertaine à nous rendre heureux.",texts:["kant-raison-volonte-bonne","kant-humanite-fin-en-soi"]}
      ]
    },
    nature:{
      intro:"Vivant, matière, âme, organisme, milieu, évolution et nature humaine.",
      groups:[
        {kind:"Grande controverse",question:"Qu’est-ce qui fait qu’un corps est vivant ?",note:"Aristote pense le vivant par l’union de la matière et d’un principe formel ; Diderot cherche au contraire à expliquer la vie à partir de l’organisation de la matière elle-même.",texts:["aristote-vie-matiere-ame","diderot-vie-phenomene-materiel"]},
        {kind:"Grande controverse",question:"Peut-on comprendre un organisme comme une machine ?",note:"Descartes étend le modèle mécanique au corps animal ; Kant insiste sur la puissance formatrice du vivant ; Darwin refuse d’assimiler l’évolution naturelle à l’histoire d’un objet fabriqué.",texts:["descartes-organisme-machine","kant-machine-modele-insuffisant-vivant","darwin-evolution-vivant-techniques"]},
        {kind:"Grande question",question:"La connaissance de la nature autorise-t-elle sa maîtrise ?",note:"Le projet cartésien relie connaissance des forces naturelles, puissance technique et amélioration des conditions de vie.",texts:["descartes-maitres-possesseurs-nature"]},
        {kind:"Grande controverse",question:"L’animal est-il seulement un objet de connaissance et d’usage ?",note:"Expérimenter, respecter la sensibilité ou reconstruire le monde propre de l’animal : trois manières très différentes de définir notre rapport au vivant.",texts:["claude-bernard-experimentation-animale","bentham-sensibilite-respect-animaux","uexkull-animal-monde-propre"]},
        {kind:"Grande controverse",question:"L’âme et la pensée sont-elles matérielles ?",note:"Lucrèce défend la corporéité de l’âme et de l’esprit ; Bergson refuse que la connaissance du cerveau suffise à épuiser la pensée.",texts:["lucrece-ame-esprit-corporels","bergson-pensee-cerveau"]},
        {kind:"Question directrice",question:"Le désir exprime-t-il notre nature ?",note:"De la nature comme puissance à la fiction d’une nature humaine originaire.",texts:["spinoza-desir-puissance-exister","platon-mythe-androgyne-desir","kant-desir-raison-imagination"]},
        {kind:"Question directrice",question:"Que peut nous apprendre une histoire philosophique de la nature humaine ?",note:"Kant reconstruit les traits de l’humain dans une perspective pragmatique et historique.",texts:["kant-quietude-inaccessible"]},
        {kind:"Question directrice",question:"Comment penser le temps à partir du mouvement naturel ?",note:"Aristote définit le temps comme ce qui permet de nombrer l’avant et l’après du mouvement.",texts:["aristote-temps-nombre-mouvement"]}
      ]
    },
    religion:{
      intro:"Origine de la croyance, preuves de Dieu, mal, foi, critique moderne et place sociale du religieux.",
      groups:[
        {kind:"Grande controverse",question:"D’où vient l’idée de Dieu ?",note:"Critias, Freud et Pascal partent tous de besoins ou de situations humaines, mais leur donnent des significations radicalement différentes.",texts:["critias-dieu-invention-controle","freud-dieu-protection-paternelle","pascal-solitude-misere-recherche-dieu"]},
        {kind:"Grande controverse",question:"La croyance religieuse peut-elle être prouvée par la raison ?",note:"Anselme cherche une preuve à partir du concept de Dieu ; Kant en conteste le principe ; Pascal distingue la démonstration rationnelle et la connaissance du cœur.",texts:["anselme-preuve-ontologique-dieu","kant-existence-pas-predicat","pascal-coeur-raison-foi"]},
        {kind:"Question directrice",question:"L’existence du monde exige-t-elle une première raison ?",note:"Leibniz part de la contingence des choses pour chercher hors de leur assemblage une raison nécessaire de l’existence du monde.",texts:["leibniz-raison-existence-monde"]},
        {kind:"Grande controverse",question:"L’existence du mal est-elle compatible avec un Dieu parfait ?",note:"Leibniz défend le meilleur des mondes possibles ; Hume soutient que notre expérience du mal interdit au moins de conclure à un créateur parfaitement bon à partir du monde.",texts:["leibniz-meilleur-mondes-possibles","hume-mal-monde-imparfait"]},
        {kind:"Question directrice",question:"La raison doit-elle interpréter la révélation ?",note:"Averroès donne à l’interprétation philosophique une place spécifique face au texte révélé.",texts:["averroes-interpreter-revelation"]},
        {kind:"Grande controverse",question:"La religion soutient-elle ou maintient-elle l’ordre social ?",note:"Robespierre, Critias et Marx attribuent tous une fonction sociale au religieux, mais divergent profondément sur sa valeur et sur ce qu’il faut en faire.",texts:["robespierre-sentiment-religieux-morale-sociale","critias-dieu-invention-controle","marx-religion-opium-peuple"]},
        {kind:"Grande question",question:"Que devient la religion quand la croyance recule ?",note:"Nietzsche analyse la survivance des valeurs chrétiennes, Gauchet la sortie structurelle de la religion, Sartre la responsabilité de l’homme privé de fondement divin.",texts:["nietzsche-dieu-mort-valeurs","gauchet-religion-lien-social","sartre-homme-prendre-place-dieu"]},
        {kind:"Question directrice",question:"La religion est-elle d’abord salut et délivrance ?",note:"Deux traditions très différentes : bonheur en Dieu chez Augustin, extinction de l’attachement et sortie du saṃsāra dans le Dhammapada.",texts:["augustin-dieu-bonheur","bouddha-sortir-cycle-renaissances"]}
      ]
    },
    science:{
      intro:"Expérience, hypothèse, théorie, modèle, vivant et critères de scientificité.",
      groups:[
        {kind:"Grande controverse",question:"La connaissance dérive-t-elle entièrement de l’expérience ?",note:"Hume fait de l’expérience et de l’habitude le fondement de nos inférences causales ; Kant soutient qu’elle suppose aussi des conditions a priori.",texts:["hume-causalite-experience-induction","kant-connaissance-experience-a-priori"]},
        {kind:"Question directrice",question:"Comment construit-on une expérience scientifique ?",note:"Claude Bernard articule hypothèse, raisonnement et contrôle expérimental ; Bachelard montre que l’instrument et le phénomène portent déjà la marque de la théorie.",texts:["claude-bernard-methode-experimentale","bachelard-experience-theorie-materialisee"]},
        {kind:"Grande controverse",question:"Qu’est-ce qu’une bonne théorie scientifique ?",note:"Einstein insiste sur le caractère construit des modèles ; Popper exige qu’une théorie puisse être exposée à des tests susceptibles de la réfuter.",texts:["einstein-theorie-modele-realite","popper-theorie-falsifiable"]},
        {kind:"Grande controverse",question:"Quels modèles permettent d’expliquer le vivant ?",note:"Le mécanisme cartésien, l’organisation kantienne et la sélection naturelle darwinienne proposent des cadres explicatifs distincts.",texts:["descartes-organisme-machine","kant-machine-modele-insuffisant-vivant","darwin-evolution-vivant-techniques"]},
        {kind:"Grande controverse",question:"Peut-on expérimenter sur le vivant comme sur n’importe quel objet ?",note:"Claude Bernard défend l’expérimentation animale ; Bentham impose le critère moral de la souffrance ; Uexküll oblige à considérer le point de vue propre de l’animal.",texts:["claude-bernard-experimentation-animale","bentham-sensibilite-respect-animaux","uexkull-animal-monde-propre"]},
        {kind:"Question directrice",question:"La connaissance scientifique du cerveau épuise-t-elle la pensée ?",note:"Bergson distingue la connaissance des mécanismes cérébraux et celle de la vie consciente.",texts:["bergson-pensee-cerveau"]}
      ]
    },
    "theorie-et-experience":{
      intro:"Origine de la connaissance, méthode expérimentale, construction des théories et expérience vécue.",
      groups:[
        {kind:"Grande controverse",question:"La connaissance vient-elle toute de l’expérience ?",note:"Hume radicalise l’empirisme en faisant de l’expérience répétée la source de la causalité ; Kant distingue le commencement empirique de la connaissance et ses conditions a priori.",texts:["hume-causalite-experience-induction","kant-connaissance-experience-a-priori"]},
        {kind:"Question directrice",question:"Qu’est-ce qu’expérimenter scientifiquement ?",note:"L’expérience n’est ni une simple observation ni une collecte de faits : elle est guidée par une hypothèse et construite par des instruments.",texts:["claude-bernard-methode-experimentale","bachelard-experience-theorie-materialisee"]},
        {kind:"Grande controverse",question:"Une théorie scientifique copie-t-elle le réel ou doit-elle surtout pouvoir être testée ?",note:"Einstein décrit la théorie comme modèle construit ; Popper déplace le critère vers l’exposition à la réfutation.",texts:["einstein-theorie-modele-realite","popper-theorie-falsifiable","bachelard-experience-theorie-materialisee"]},
        {kind:"Grande controverse",question:"L’expérience vécue peut-elle être exprimée fidèlement ?",note:"Bergson souligne ce que le langage généralise et déforme ; Hegel soutient au contraire qu’une pensée déterminée n’acquiert sa clarté qu’en se formulant dans les mots.",texts:["bergson-experience-vecue-indicible","hegel-experience-vecue-mots"]}
      ]
    },
    technique:{
      intro:"Instrument, corps, machine, progrès technique et rapports entre technique et humanité.",
      groups:[
        {kind:"Question directrice",question:"La technique commence-t-elle avec l’outil ?",note:"Aristote et Mauss déplacent l’attention de l’objet fabriqué vers la main, le corps et les capacités humaines.",texts:["aristote-main-outil-intelligence","mauss-corps-instrument-naturel"]},
        {kind:"Question directrice",question:"Connaître la nature, est-ce apprendre à la maîtriser ?",note:"Descartes fait de la science une philosophie pratique : connaître les forces naturelles doit permettre de les employer pour améliorer la vie humaine.",texts:["descartes-maitres-possesseurs-nature"]},
        {kind:"Grande controverse",question:"La machine aliène-t-elle l’homme ou peut-elle être intégrée à la culture ?",note:"Marx décrit l’extériorité du travail aliéné ; Simondon refuse d’identifier la machine elle-même à la cause de l’aliénation.",texts:["marx-alienation-travail-ouvrier","simondon-harmonie-homme-machine"]},
        {kind:"Grande controverse",question:"La machine fournit-elle un bon modèle du vivant ?",note:"Descartes utilise le mécanisme pour expliquer les corps ; Kant et Darwin en marquent deux limites différentes.",texts:["descartes-organisme-machine","kant-machine-modele-insuffisant-vivant","darwin-evolution-vivant-techniques"]},
        {kind:"Grande question",question:"Le progrès technique transforme-t-il la liberté au travail ?",note:"Du travail servile antique au royaume moderne de la nécessité, le rapport entre technique, travail et liberté se recompose.",texts:["aristote-travail-manuel-esclave","marx-royaume-liberte-travail"]}
      ]
    },
    travail:{
      intro:"Nécessité, aliénation, liberté, ennui, loisir et oisiveté.",
      groups:[
        {kind:"Grande controverse",question:"Le travail est-il servitude ou condition de la liberté ?",note:"Aristote sépare travail servile et vie libre ; Marx pense la liberté à partir de la réduction du travail nécessaire.",texts:["aristote-travail-manuel-esclave","marx-royaume-liberte-travail"]},
        {kind:"Question directrice",question:"Quand le travail devient-il aliénant ?",note:"Le travail peut devenir extérieur au travailleur lorsque son activité ne lui appartient plus.",texts:["marx-alienation-travail-ouvrier"]},
        {kind:"Grande controverse",question:"Travail, jeu ou oisiveté : que faire du temps libéré ?",note:"Kierkegaard, Nietzsche et Arendt distinguent différentes manières de sortir — ou de ne pas sortir — du monde du travail.",texts:["kierkegaard-oisivete-ennui-travail","nietzsche-travail-jeu-creation","arendt-loisirs-monde-travail"]}
      ]
    },
    temps:{
      intro:"Mesure, condition de l’expérience, durée vécue, présent, projet, retour et délivrance.",
      groups:[
        {kind:"Question directrice",question:"Le temps peut-il exister avant le monde ?",note:"Augustin part de la création pour soutenir que le temps lui-même commence avec le monde et ne précède pas ce qui est créé.",texts:["augustin-temps-creation-monde"]},
        {kind:"Grande controverse",question:"Le temps est-il mesuré dans le monde, formé par le sujet ou vécu par la conscience ?",note:"Aristote, Kant et Bergson déplacent successivement la question de la mesure vers les conditions de l’expérience puis vers la durée vécue.",texts:["aristote-temps-nombre-mouvement","kant-temps-forme-a-priori","bergson-duree-espace"]},
        {kind:"Question directrice",question:"Pourquoi avons-nous tant de mal à habiter le présent ?",note:"Chez Pascal, l’agitation et l’attente de l’avenir sont deux manières de se détourner de la condition présente.",texts:["pascal-divertissement-condition","pascal-bonheur-avenir"]},
        {kind:"Grande question",question:"Comment le temps engage-t-il le sens de notre existence ?",note:"Le projet sartrien et l’épreuve nietzschéenne du retour donnent au rapport à l’avenir et à la répétition un rôle décisif.",texts:["sartre-existence-precede-essence","nietzsche-eternel-retour"]},
        {kind:"Grande controverse",question:"Faut-il vouloir le retour de l’existence ou sortir du cycle des renaissances ?",note:"Deux orientations presque inverses : affirmer le retour de la vie chez Nietzsche, mettre fin aux renaissances dans le Dhammapada.",texts:["nietzsche-eternel-retour","bouddha-sortir-cycle-renaissances"]}
      ]
    },
    devoir:{
      intro:"Contrainte, obligation, universalité, compassion et rapport entre morale et bonheur.",
      groups:[
        {kind:"Grande controverse",question:"Le devoir n’est-il qu’une contrainte extérieure ?",note:"Glaucon soupçonne que nous serions injustes sans sanction ; Kant distingue au contraire conformité extérieure et obligation morale.",texts:["platon-glaucon-devoir-contrainte","kant-agir-par-devoir"]},
        {kind:"Grande controverse",question:"Sur quoi peut-on fonder la morale ?",note:"La raison et la bonne volonté chez Kant rencontrent la pitié comme fondement concret chez Schopenhauer.",texts:["kant-raison-volonte-bonne","schopenhauer-pitie-fondement-morale"]},
        {kind:"Question directrice",question:"La loi morale peut-elle valoir universellement malgré la diversité des coutumes ?",note:"Pascal insiste sur la relativité des normes historiques ; Kant cherche une exigence inconditionnelle fondée sur la personne comme fin en soi.",texts:["pascal-coutumes-conventions-justice","kant-humanite-fin-en-soi"]},
        {kind:"Grande controverse",question:"La morale a-t-elle le bonheur pour but ?",note:"Mill fait du bonheur humain un critère moral en hiérarchisant les plaisirs ; Kant refuse de subordonner le devoir au bonheur.",texts:["mill-qualite-plaisirs-morale","kant-morale-dignite-bonheur","seneque-vie-vertueuse"]}
      ]
    },
    justice:{
      intro:"Nature et convention, force et droit, égalité, institutions et désobéissance.",
      groups:[
        {kind:"Grande controverse",question:"La justice vient-elle de la nature ou de la loi ?",note:"Calliclès invoque le droit du plus fort ; Antigone oppose aux lois humaines des lois non écrites ; Pascal montre la fragilité des conventions et de la force instituée.",texts:["platon-callicles-loi-nature-justice","sophocle-antigone-lois-non-ecrites","pascal-coutumes-conventions-justice","pascal-force-justice"]},
        {kind:"Grande controverse",question:"Une société parfaitement juste doit-elle être égalitaire ?",note:"More imagine une égalité organisée ; Rawls admet certaines inégalités si elles sont choisies équitablement et profitent aux plus défavorisés.",texts:["thomas-more-utopie-egalite","rawls-justice-equite-inegalites"]},
        {kind:"Question directrice",question:"Peut-on instituer une justice parfaite ?",note:"Kant met en évidence l’imperfection du gouvernement humain et étend le problème jusqu’à la nécessité d’un ordre juridique entre États.",texts:["kant-justice-instituee-imparfaite","kant-societe-nations-justice","rawls-justice-equite-inegalites"]},
        {kind:"Grande controverse",question:"Peut-il être juste de désobéir à la loi ?",note:"Kant refuse de faire de la rébellion un droit ; Thoreau défend la non-coopération avec l’injustice ; Antigone incarne une désobéissance au nom d’une norme supérieure.",texts:["kant-desobeissance-loi-inconditionnelle","thoreau-desobeir-lois-injustes","sophocle-antigone-lois-non-ecrites"]},
        {kind:"Prolongement",question:"Respectons-nous la justice par devoir ou par contrainte ?",note:"Le mythe de Gygès complète la réflexion sur le rapport entre loi, sanction et véritable obligation morale.",texts:["platon-glaucon-devoir-contrainte","kant-agir-par-devoir"]}
      ]
    },
    etat:{
      intro:"Pouvoir, loi, justice, institutions, obéissance et limites de l’autorité politique.",
      groups:[
        {kind:"Grande controverse",question:"Qu’est-ce qui peut rendre l’autorité politique légitime ?",note:"Une première difficulté consiste à distinguer la simple force de l’autorité juste : Calliclès naturalise la domination du plus fort, tandis que Pascal montre pourquoi la force cherche à se faire reconnaître comme justice.",texts:["platon-callicles-loi-nature-justice","pascal-force-justice"]},
        {kind:"Question directrice",question:"L’État peut-il instituer une justice parfaite ?",note:"Kant part de l’imperfection des gouvernants et des institutions humaines ; Rawls déplace le problème vers les principes qu’une société juste pourrait choisir équitablement.",texts:["kant-justice-instituee-imparfaite","rawls-justice-equite-inegalites"]},
        {kind:"Grande controverse",question:"Doit-on toujours obéir à l’État et à ses lois ?",note:"Kant refuse d’ériger la rébellion en droit, Thoreau défend la désobéissance face à l’injustice, et Antigone invoque une norme supérieure à la loi de la cité.",texts:["kant-desobeissance-loi-inconditionnelle","thoreau-desobeir-lois-injustes","sophocle-antigone-lois-non-ecrites"]},
        {kind:"Question directrice",question:"La justice politique doit-elle s’arrêter aux frontières de l’État ?",note:"Kant étend le problème de la constitution juste aux relations entre États et cherche les conditions d’un ordre juridique international.",texts:["kant-societe-nations-justice","kant-justice-instituee-imparfaite"]},
        {kind:"Grande controverse",question:"Une société juste doit-elle supprimer les inégalités ?",note:"Thomas More imagine une organisation égalitaire de la propriété et du travail ; Rawls admet des inégalités à condition qu’elles soient justifiables du point de vue des plus défavorisés.",texts:["thomas-more-utopie-egalite","rawls-justice-equite-inegalites"]}
      ]
    },
    inconscient:{
      intro:"Processus inconscients, rêve, mauvaise foi et statut scientifique de la psychanalyse.",
      groups:[
        {kind:"Question directrice",question:"Pourquoi supposer un inconscient ?",note:"Freud part des lacunes de la conscience et des effets psychiques qui deviennent intelligibles dès qu’on admet des processus inconscients.",texts:["freud-inconscient-hypothese","leibniz-petites-perceptions"]},
        {kind:"Grande controverse",question:"Sommes-nous réellement maîtres de nous-mêmes ?",note:"Freud décrit la psychanalyse comme une troisième blessure infligée au narcissisme humain ; Sartre refuse que l’inconscient puisse servir à déplacer la responsabilité du sujet.",texts:["freud-trois-blessures-narcissiques","sartre-inconscient-mauvaise-foi"]},
        {kind:"Question directrice",question:"Le rêve donne-t-il accès à une pensée inconsciente ?",note:"Freud traite le rêve comme un rébus à traduire ; Wittgenstein met en doute l’idée qu’un symbolisme du rêve fonctionne comme un langage caché.",texts:["freud-reve-rebus","wittgenstein-inconscient-mythe"]},
        {kind:"Grande controverse",question:"La psychanalyse peut-elle être une science ?",note:"Freud revendique des preuves et une pratique de confirmation ; Popper reproche aux théories psychanalytiques de pouvoir interpréter n’importe quel cas.",texts:["freud-inconscient-hypothese","popper-psychanalyse-non-scientifique"]}
      ]
    },
    conscience:{
      intro:"Connaissance de soi, identité, limites de la conscience et déterminations sociales ou psychiques.",
      groups:[
        {kind:"Grande controverse",question:"Peut-on se connaître soi-même ?",note:"Platon fait de la connaissance de soi un détour par une autre âme et par le divin ; Schopenhauer soutient que le sujet connaissant ne peut jamais devenir lui-même objet de connaissance.",texts:["platon-connais-toi-toi-meme","schopenhauer-sujet-inconnaissable"]},
        {kind:"Grande controverse",question:"La conscience est-elle vraiment individuelle ?",note:"Nietzsche fait naître la conscience du besoin social de communication ; Marx rapporte les représentations à la vie matérielle et aux rapports entre les hommes.",texts:["nietzsche-conscience-communication-gregaire","marx-conscience-vie-materielle"]},
        {kind:"Question directrice",question:"Qu’est-ce qui fait l’identité d’une personne ?",note:"Descartes part de la certitude du sujet pensant ; Locke fait dépendre l’identité personnelle de la continuité de la conscience.",texts:["descartes-cogito-chose-pense","locke-identite-conscience-memoire"]},
        {kind:"Grande controverse",question:"Le moi est-il transparent à lui-même ?",note:"Leibniz montre qu’une infinité de perceptions échappent à l’aperception ; Freud radicalise ce décentrement en affirmant que le moi n’est pas maître dans sa propre maison.",texts:["leibniz-petites-perceptions","freud-trois-blessures-narcissiques"]},
        {kind:"Question directrice",question:"La pensée peut-elle être réduite au corps ou au cerveau ?",note:"Lucrèce matérialise l’âme et l’esprit ; Bergson admet leur inscription corporelle sans réduire la pensée au mécanisme cérébral.",texts:["lucrece-ame-esprit-corporels","bergson-pensee-cerveau"]},
        {kind:"Prolongement",question:"Peut-on trouver un moi stable derrière ses qualités ?",note:"Pascal met en doute qu’une propriété corporelle, psychologique ou sociale puisse à elle seule définir le moi.",texts:["pascal-moi-introuvable"]}
      ]
    },
    langage:{
      intro:"Pensée, signe, monde, communication, action, pouvoir et relation à autrui.",
      groups:[
        {kind:"Grande controverse",question:"Qu’est-ce qui distingue le langage humain de la communication animale ?",note:"Descartes et Benveniste partent tous deux de l’animal, mais ne situent pas la spécificité humaine au même endroit.",texts:["descartes-langage-pensee","benveniste-communication-animale-langage-humain"]},
        {kind:"Question directrice",question:"Les mots reflètent-ils le réel ou construisent-ils une manière de le penser ?",note:"Du signe arbitraire à la construction symbolique, puis à la critique des illusions grammaticales.",texts:["saussure-signe-linguistique-arbitraire","cassirer-langage-reel-construction","nietzsche-langue-conception-monde"]},
        {kind:"Grande controverse",question:"Parler, est-ce seulement dire quelque chose ou aussi agir sur autrui et avec lui ?",note:"Austin, Platon et Lévinas donnent trois sens très différents à la puissance de la parole : acte, persuasion et relation éthique.",texts:["austin-mots-accomplir-actions","platon-rhetorique-puissance-dialogue","levinas-parler-esclave-egal"]},
        {kind:"Question directrice",question:"Peut-on transformer notre rapport au langage en inventant ou en détournant ses usages ?",note:"Une langue artificielle commune chez Zamenhof ; une langue poétique qui cesse d’être un simple instrument chez Sartre.",texts:["zamenhof-esperanto-langue-artificielle","sartre-langage-poesie-fin"]},
        {kind:"Prolongement",question:"Comment un discours produit-il et organise-t-il du sens ?",note:"Une entrée complémentaire par Foucault.",texts:["foucault-commentaire-exces-sens"]}
      ]
    },
    verite:{
      intro:"Démontrer, correspondre au réel, douter, agir : plusieurs manières de définir et d’éprouver le vrai.",
      groups:[
        {kind:"Grande question",question:"Peut-on tout démontrer ?",note:"Aristote exige des prémisses premières ; Pascal montre pourquoi les principes eux-mêmes ne peuvent être démontrés ; Kant refuse de tirer l’existence d’un simple concept.",texts:["aristote-demonstration-syllogisme-scientifique","pascal-principes-demonstration-indemontrables","kant-existence-pas-predicat"]},
        {kind:"Grande controverse",question:"Un raisonnement correct suffit-il à garantir la vérité ?",note:"Les paradoxes de Zénon et la généalogie nietzschéenne de la logique mettent en tension validité formelle et vérité du réel.",texts:["zenon-mouvement-demonstration-absurde","nietzsche-logique-survie-verite","aristote-demonstration-syllogisme-scientifique"]},
        {kind:"Grande controverse",question:"La vérité est-elle l’accord de la pensée avec le réel ?",note:"Aristote formule la conception classique de la correspondance ; Kant en montre la difficulté comme critère ; Bergson déplace le vrai vers la prise pratique sur un réel mouvant.",texts:["aristote-verite-correspondance-reel","kant-verite-correspondance-diallele","bergson-verite-action-pragmatisme"]},
        {kind:"Grande question",question:"La recherche du vrai rencontre-t-elle une limite sceptique ?",note:"Sextus expose les modes de suspension du jugement ; Platon met en garde contre le passage du doute à la haine de la raison.",texts:["sextus-empiricus-verite-hors-portee","platon-doute-haine-raison"]},
        {kind:"Question directrice",question:"La vérité est-elle une fin en soi ou doit-elle servir la vie ?",note:"Nietzsche, Bergson et Épictète donnent trois manières très différentes de rapporter pensée vraie, action et vie pratique.",texts:["nietzsche-logique-survie-verite","bergson-verite-action-pragmatisme","epictete-pratique-avant-demonstration"]},
        {kind:"Prolongement",question:"Peut-on chercher la vérité comme un objet à atteindre ?",note:"Krishnamurti remet en cause la recherche volontaire de la vérité elle-même.",texts:["krishnamurti-bonheur-sans-recherche"]}
      ]
    },
    demonstration:{
      intro:"Principes, syllogisme, preuve, paradoxe et limites de la démonstration.",
      groups:[
        {kind:"Grande question",question:"À quelles conditions une démonstration produit-elle une connaissance ?",note:"Aristote définit le syllogisme scientifique et exige des prémisses vraies, premières et causales.",texts:["aristote-demonstration-syllogisme-scientifique"]},
        {kind:"Grande controverse",question:"Les principes eux-mêmes peuvent-ils être démontrés ?",note:"Pascal refuse la régression à l’infini ; Sextus en fait au contraire un motif sceptique de suspension.",texts:["pascal-principes-demonstration-indemontrables","sextus-empiricus-verite-hors-portee"]},
        {kind:"Question directrice",question:"Peut-on démontrer l’existence d’une chose à partir de son concept ?",note:"Kant distingue le contenu d’un concept et la position réelle de son objet.",texts:["kant-existence-pas-predicat"]},
        {kind:"Grande controverse",question:"Une démonstration peut-elle être cohérente et pourtant manquer le réel ?",note:"Les arguments de Zénon conduisent à interroger l’écart entre validité logique, hypothèses de départ et expérience.",texts:["zenon-mouvement-demonstration-absurde","aristote-demonstration-syllogisme-scientifique"]},
        {kind:"Prolongement",question:"Pourquoi démontrer si nous ne mettons pas en pratique ce que nous savons ?",note:"Épictète replace la démonstration dans une hiérarchie des tâches philosophiques.",texts:["epictete-pratique-avant-demonstration"]}
      ]
    },
    amour:{
      intro:"Manque, amitié, imagination et altérité.",
      groups:[
        {kind:"Question directrice",question:"Aimer, est-ce chercher ce qui nous manque ou vouloir le bien d’un autre ?",note:"Deux entrées classiques : désir de complétude et amitié.",texts:["platon-mythe-androgyne-desir","aristote-amour-amitie-veritable"]},
        {kind:"Grande controverse",question:"L’amour transforme-t-il l’autre par l’imagination ou nous ouvre-t-il à ce qui nous échappe ?",note:"Cristallisation chez Stendhal, altérité chez Lévinas.",texts:["stendhal-cristallisation-amour","levinas-caresse-desir-invisible"]}
      ]
    },
    autrui:{
      intro:"Amitié, désir et rencontre de l’autre.",
      groups:[{kind:"Grande question",question:"Autrui est-il celui avec qui je partage le bien ou celui qui résiste à ma possession ?",note:"Aristote et Lévinas proposent deux cadres très différents de la relation.",texts:["aristote-amour-amitie-veritable","levinas-caresse-desir-invisible"]}]
    },
    desir:{
      intro:"Satisfaction, mesure, puissance, manque et imagination.",
      groups:[
        {kind:"Grande controverse",question:"Faut-il satisfaire le désir ou lui donner une mesure ?",note:"La confrontation la plus directe entre Calliclès, Socrate et Épicure.",texts:["platon-callicles-desirs","platon-socrate-temperance","epicure-plaisir-vie-heureuse"]},
        {kind:"Question directrice",question:"Peut-on transformer nos désirs pour devenir plus libres ?",note:"Stoïcisme et morale cartésienne déplacent le problème vers le gouvernement de soi.",texts:["epictete-depend-nous","descartes-changer-desirs","descartes-trois-regles-bonheur"]},
        {kind:"Grande controverse",question:"Le désir est-il manque ou puissance ?",note:"Spinoza et Schopenhauer donnent deux diagnostics presque inverses.",texts:["spinoza-desir-puissance-exister","schopenhauer-desir-souffrance-ennui"]},
        {kind:"Question directrice",question:"Que font l’imagination et l’inconscient à nos désirs ?",note:"Le désir se déplace vers l’image, l’illusion et ce qui échappe à la conscience.",texts:["rousseau-desir-imagination-bonheur","freud-bonheur-episodique","kant-desir-raison-imagination","krishnamurti-bonheur-sans-recherche"]}
      ]
    },
    interpretation:{
      intro:"Interpréter un texte, une révélation ou un phénomène psychique.",
      groups:[{kind:"Grande question",question:"Qu’est-ce qui autorise une interprétation ?",note:"Trois domaines : discours, texte religieux et symptôme psychique.",texts:["foucault-commentaire-exces-sens","averroes-interpreter-revelation","freud-interpretations-delirantes"]}]
    },
    histoire:{
      intro:"Discours, savoir et historicité.",
      groups:[{kind:"Point de départ",question:"Comment l’histoire transforme-t-elle les manières de voir et de dire ?",note:"Une entrée par Foucault.",texts:["foucault-commentaire-exces-sens"]}]
    },
    imagination:{
      intro:"Désir et puissance de l’imagination.",
      groups:[{kind:"Point de départ",question:"L’imagination augmente-t-elle le désir au point de rendre le bonheur impossible ?",note:"Une entrée par Rousseau.",texts:["rousseau-desir-imagination-bonheur"]}]
    }
  };

  const legacyBySlug = new Map(legacyPaths.map((path) => [slugify(path.id || path.label), path]));
  const themeItems = (theme) => {
    const direct = philosophyCatalog.filter((item) => textThemes(item).includes(theme));
    const legacy = legacyBySlug.get(slugify(theme));
    const extra = legacy ? legacy.texts.map((id) => catalog.find((item) => item.id === id)).filter(Boolean) : [];
    return [...new Map([...direct, ...extra].map((item) => [item.id, item])).values()];
  };
  const allPhiloThemes = [...new Set(philosophyCatalog.flatMap(textThemes))].sort((a,b) => collator.compare(a,b));
  const otherThemes = allPhiloThemes.filter((theme) => !programThemes.includes(theme));
  if (otherCount) otherCount.textContent = String(otherThemes.length);

  const buildThemeModel = (theme, category) => {
    const slug = slugify(theme);
    const items = themeItems(theme);
    const itemById = new Map(items.map((item) => [item.id,item]));
    const guide = pathGuides[slug];
    let groups = [];
    const used = new Set();
    if (guide?.groups?.length) {
      groups = guide.groups.map((group) => {
        const groupItems = group.texts.map((id) => itemById.get(id)).filter(Boolean);
        groupItems.forEach((item) => used.add(item.id));
        return {...group, items:groupItems};
      }).filter((group) => group.items.length);
    }
    const leftovers = items.filter((item) => !used.has(item.id));
    if (leftovers.length) groups.push({kind:groups.length ? "Pour compléter" : items.length === 1 ? "Point de départ" : "Parcours",question:groups.length ? `Autres textes pour prolonger le thème « ${theme} »` : `Mettre en regard les textes autour de « ${theme} »`,note:"",items:leftovers});
    if (!groups.length && items.length) groups = [{kind:"Point de départ",question:`Une première entrée sur « ${theme} »`,note:"",items}];
    return {theme,slug,category,items,groups,intro:guide?.intro || (items.length ? `${items.length} texte${items.length>1?"s":""} actuellement relié${items.length>1?"s":""} à ce thème.` : "Ce thème est prévu dans la boussole, mais aucun texte de la bibliothèque n’y est encore rattaché.")};
  };
  const themeModels = [
    ...programThemes.map((theme) => buildThemeModel(theme,"main")),
    ...otherThemes.map((theme) => buildThemeModel(theme,"other"))
  ];
  if (allCount) allCount.textContent = String(themeModels.length);

  const renderFlow = (items) => `<div class="philo-path-flow">${items.map((item,index) => `${index ? '<span class="philo-path-connector" aria-hidden="true">→</span>' : ''}<a href="${textUrl(item)}" data-philo-path-text="${escapeHtml(item.id)}"><small>${escapeHtml(item.authorTag || item.author || item.source || "Texte")}</small><strong>${escapeHtml(item.title)}</strong></a>`).join("")}</div>`;

  if (pathRoot) {
    pathRoot.innerHTML = themeModels.map((model,index) => {
      const groupsHtml = model.groups.length ? model.groups.map((group,groupIndex) => `<article class="philo-path-question" data-philo-path-group data-philo-group-authors="${escapeHtml(group.items.map((item) => `${item.author || ""} ${item.authorTag || ""}`).join(" "))}"><button type="button" class="philo-path-question-trigger" aria-expanded="false" data-philo-path-group-trigger><span>${escapeHtml(group.kind)} · ${String(groupIndex+1).padStart(2,"0")}</span><strong>${formatForeignTerms(group.question)}</strong><i aria-hidden="true"></i></button><div class="philo-path-question-panel" data-philo-path-group-panel hidden><div class="philo-path-question-panel-inner">${group.note ? `<p>${formatForeignTerms(group.note)}</p>` : ""}${renderFlow(group.items)}</div></div></article>`).join("") : `<div class="philo-path-no-text"><strong>Parcours à venir</strong><span>Aucun texte n’est encore rattaché à ce thème.</span><a href="/textes/philosophie/?theme=${encodeURIComponent(model.theme)}">Voir le thème dans la bibliothèque →</a></div>`;
      const authors = model.items.map((item) => `${item.author || ""} ${item.authorTag || ""}`).join(" ");
      return `<article class="philo-path-card" id="parcours-${escapeHtml(model.slug)}" data-philo-path-id="${escapeHtml(model.slug)}" data-philo-path-theme="${escapeHtml(model.theme)}" data-philo-path-category="${model.category}" data-philo-path-authors="${escapeHtml(authors)}"><button class="philo-path-card-trigger" type="button" aria-expanded="false" data-philo-path-trigger><span class="philo-path-number">${String(index+1).padStart(2,"0")}</span><span class="philo-path-title"><small>${model.items.length} texte${model.items.length>1?"s":""}${model.groups.length ? ` · ${model.groups.length} question${model.groups.length>1?"s":""}` : ""}</small><strong>${escapeHtml(model.theme)}</strong><em>${formatForeignTerms(model.intro)}</em></span><span class="philo-path-toggle" aria-hidden="true"></span></button><div class="philo-path-card-panel" data-philo-path-panel hidden><div class="philo-path-body">${groupsHtml}</div></div></article>`;
    }).join("");

    let activePathTab = "main";
    const cards = [...pathRoot.querySelectorAll("[data-philo-path-id]")];

    const closeGroup = (group, immediate=false) => {
      const trigger = group.querySelector("[data-philo-path-group-trigger]");
      const panel = group.querySelector("[data-philo-path-group-panel]");
      trigger?.setAttribute("aria-expanded","false");
      group.classList.remove("is-open");
      animatePanel(panel,false,{immediate});
    };
    const openGroup = (group, immediate=false, exclusive=true) => {
      const trigger = group.querySelector("[data-philo-path-group-trigger]");
      const panel = group.querySelector("[data-philo-path-group-panel]");
      const parent = group.closest("[data-philo-path-id]");
      if (exclusive) parent?.querySelectorAll("[data-philo-path-group]").forEach((other) => { if (other !== group) closeGroup(other,immediate); });
      trigger?.setAttribute("aria-expanded","true");
      group.classList.add("is-open");
      animatePanel(panel,true,{immediate});
    };
    const closeCard = (card, immediate=false) => {
      const trigger = card.querySelector("[data-philo-path-trigger]");
      const panel = card.querySelector("[data-philo-path-panel]");
      trigger?.setAttribute("aria-expanded","false");
      card.classList.remove("is-open");
      card.querySelectorAll("[data-philo-path-group]").forEach((group) => closeGroup(group,immediate));
      animatePanel(panel,false,{immediate});
    };
    const openCard = (card, { immediate=false, exclusive=true } = {}) => {
      if (exclusive) cards.forEach((other) => { if (other !== card && other.classList.contains("is-open")) closeCard(other,immediate); });
      const trigger = card.querySelector("[data-philo-path-trigger]");
      const panel = card.querySelector("[data-philo-path-panel]");
      trigger?.setAttribute("aria-expanded","true");
      card.classList.add("is-open");
      animatePanel(panel,true,{immediate});
    };

    cards.forEach((card) => {
      closeCard(card,true);
      card.querySelector("[data-philo-path-trigger]")?.addEventListener("click", () => card.classList.contains("is-open") ? closeCard(card) : openCard(card));
      card.querySelectorAll("[data-philo-path-group]").forEach((group) => {
        closeGroup(group,true);
        group.querySelector("[data-philo-path-group-trigger]")?.addEventListener("click", () => group.classList.contains("is-open") ? closeGroup(group) : openGroup(group));
      });
    });

    const setPathTab = (tab, { close=true } = {}) => {
      activePathTab = tab;
      pathTabs.forEach((button) => {
        const active = button.dataset.philoPathTab === tab;
        button.classList.toggle("is-active",active);
        button.setAttribute("aria-selected",active ? "true" : "false");
      });
      cards.forEach((card) => {
        const visible = tab === "all" || card.dataset.philoPathCategory === tab;
        card.hidden = !visible;
        if (!visible && close) closeCard(card,true);
      });
    };
    pathTabs.forEach((button) => button.addEventListener("click", () => {
      if (pathSearch) pathSearch.value = "";
      if (pathSearchClear) pathSearchClear.hidden = true;
      if (pathSearchFeedback) pathSearchFeedback.hidden = true;
      cards.forEach((card) => { card.querySelectorAll("[data-philo-path-group]").forEach((group) => { group.hidden=false; }); });
      setPathTab(button.dataset.philoPathTab);
    }));
    setPathTab("main",{close:false});

    const showSearchResults = () => {
      const raw = pathSearch?.value.trim() || "";
      const query = normalize(raw);
      if (pathSearchClear) pathSearchClear.hidden = !query;
      if (query && activePathTab !== "all") setPathTab("all",{close:false});
      if (!query) {
        cards.forEach((card) => {
          card.hidden = activePathTab !== "all" && card.dataset.philoPathCategory !== activePathTab;
          card.querySelectorAll("[data-philo-path-group]").forEach((group) => { group.hidden=false; });
          closeCard(card,true);
        });
        if (pathSearchFeedback) pathSearchFeedback.hidden = true;
        return;
      }

      const themeMatches = themeModels.filter((model) => normalize(model.theme).includes(query));
      const exactTheme = themeModels.find((model) => normalize(model.theme) === query);
      const effectiveThemeMatches = exactTheme ? [exactTheme] : themeMatches;
      let matchCount = 0;

      if (effectiveThemeMatches.length) {
        cards.forEach((card) => {
          const match = effectiveThemeMatches.some((model) => model.slug === card.dataset.philoPathId);
          card.hidden = !match;
          card.querySelectorAll("[data-philo-path-group]").forEach((group) => { group.hidden=false; closeGroup(group,true); });
          if (match) { openCard(card,{immediate:true,exclusive:false}); matchCount += 1; }
          else closeCard(card,true);
        });
        setPathTab("all",{close:false});
        if (pathSearchFeedback) {
          pathSearchFeedback.hidden = false;
          pathSearchFeedback.textContent = matchCount ? `${matchCount} thème${matchCount>1?"s":""} correspondant${matchCount>1?"s":""}.` : "Aucun thème correspondant.";
        }
        return;
      }

      cards.forEach((card) => {
        const authorMatch = normalize(card.dataset.philoPathAuthors).includes(query);
        card.hidden = !authorMatch;
        if (!authorMatch) { closeCard(card,true); return; }
        matchCount += 1;
        openCard(card,{immediate:true,exclusive:false});
        const groups = [...card.querySelectorAll("[data-philo-path-group]")];
        const matchingGroups = groups.filter((group) => normalize(group.dataset.philoGroupAuthors).includes(query));
        groups.forEach((group) => {
          const match = matchingGroups.includes(group);
          group.hidden = !match;
          if (match) openGroup(group,true,false); else closeGroup(group,true);
        });
      });
      if (pathSearchFeedback) {
        pathSearchFeedback.hidden = false;
        pathSearchFeedback.textContent = matchCount ? `${matchCount} parcours contenant cet auteur.` : "Aucun thème ni auteur ne correspond à cette recherche.";
      }
    };
    pathSearch?.addEventListener("input", showSearchResults);
    pathSearchClear?.addEventListener("click", () => {
      if (!pathSearch) return;
      pathSearch.value = "";
      pathSearch.focus();
      showSearchResults();
    });

    // Arrivée depuis une fiche : ouvre le thème, la question et cible le texte.
    const params = new URLSearchParams(window.location.search);
    const requestedPath = slugify(params.get("parcours") || "");
    const requestedText = params.get("texte") || "";
    if (requestedPath) {
      const targetCard = cards.find((card) => card.dataset.philoPathId === requestedPath);
      if (targetCard) {
        activePathTab = targetCard.dataset.philoPathCategory;
        pathTabs.forEach((button) => {
          const active = button.dataset.philoPathTab === activePathTab;
          button.classList.toggle("is-active",active);
          button.setAttribute("aria-selected",active ? "true" : "false");
        });
        cards.forEach((card) => { card.hidden = card !== targetCard; });
        openCard(targetCard,{immediate:true,exclusive:false});
        let scrollTarget = targetCard;
        if (requestedText) {
          const targetText = targetCard.querySelector(`[data-philo-path-text="${CSS.escape(requestedText)}"]`);
          if (targetText) {
            const group = targetText.closest("[data-philo-path-group]");
            if (group) { group.hidden=false; openGroup(group,true); }
            targetText.classList.add("is-targeted");
            scrollTarget = targetText;
          }
        }
        requestAnimationFrame(() => setTimeout(() => scrollTarget.scrollIntoView({behavior:"smooth",block:"center"}),140));
      }
    }
  }

  // ------------------------------------------------------------
  // 3. Dialogues : un grand bloc, une seule ligne ouverte à la fois.
  // ------------------------------------------------------------
  const dialogueBoard = document.querySelector("[data-philo-dialogues]");
  if (dialogueBoard) {
    const items = [...dialogueBoard.querySelectorAll("[data-philo-dialogue-item]")];
    const closeDialogue = (item, immediate=false) => {
      item.classList.remove("is-open");
      item.querySelector("[data-philo-dialogue-trigger]")?.setAttribute("aria-expanded","false");
      animatePanel(item.querySelector("[data-philo-dialogue-panel]"),false,{immediate});
    };
    const openDialogue = (item) => {
      items.forEach((other) => { if (other !== item) closeDialogue(other); });
      item.classList.add("is-open");
      item.querySelector("[data-philo-dialogue-trigger]")?.setAttribute("aria-expanded","true");
      animatePanel(item.querySelector("[data-philo-dialogue-panel]"),true);
    };
    items.forEach((item) => {
      closeDialogue(item,true);
      item.querySelector("[data-philo-dialogue-trigger]")?.addEventListener("click", () => item.classList.contains("is-open") ? closeDialogue(item) : openDialogue(item));
    });
  }

  // ------------------------------------------------------------
  // 4. Dictionnaire philosophique — 270 entrées, auteurs et navigation croisée.
  // ------------------------------------------------------------
  const dictionary = document.querySelector("[data-philo-dictionary]");
  if (dictionary) {
    const search = dictionary.querySelector("[data-philo-dictionary-search]");
    const results = dictionary.querySelector("[data-philo-dictionary-results]");
    const starters = dictionary.querySelector("[data-philo-dictionary-starters]");
    const detail = dictionary.querySelector("[data-philo-dictionary-detail]");
    const count = dictionary.querySelector("[data-philo-dictionary-count]");
    const title = dictionary.querySelector("[data-philo-dictionary-title]");
    const category = dictionary.querySelector("[data-philo-dictionary-category]");
    const body = dictionary.querySelector("[data-philo-dictionary-body]");
    const related = dictionary.querySelector("[data-philo-dictionary-related]");
    const filters = [...dictionary.querySelectorAll("[data-philo-dictionary-filter]")];
    const letters = [...dictionary.querySelectorAll("[data-philo-dictionary-letter]")];

    const entries = Array.isArray(window.FV_PHILOSOPHY_DICTIONARY_ENTRIES)
      ? window.FV_PHILOSOPHY_DICTIONARY_ENTRIES
      : [];

    const normalizeKey = (value) => normalize(value).replace(/[^a-z0-9]+/g," ").trim();
    const entryMap = new Map(entries.map((entry) => [normalizeKey(entry.term), entry]));
    const aliasMap = new Map();

    const addAlias = (value, entry) => {
      const key = normalizeKey(value);
      if (key && !aliasMap.has(key)) aliasMap.set(key, entry);
    };

    entries.forEach((entry) => {
      addAlias(entry.term, entry);
      const aliases = String(entry.aliases || "").trim();
      if (aliases) {
        addAlias(aliases, entry);
        aliases.split(/[|,;]+/).forEach((alias) => addAlias(alias, entry));
        aliases.split(/\s+/).forEach((alias) => alias.length > 2 && addAlias(alias, entry));
      }
      if (entry.kind === "author") {
        const parts = String(entry.term || "").trim().split(/\s+/).filter(Boolean);
        if (parts.length) addAlias(parts.at(-1), entry);
        if (parts.length >= 2) {
          const initials = parts.slice(0,-1).map((part) => part[0]).join(" ");
          addAlias(`${initials} ${parts.at(-1)}`, entry);
          addAlias(`${initials.replace(/\s+/g,". ")}. ${parts.at(-1)}`, entry);
        }
      }
    });

    const specialAliases = {
      "j s mill":"John Stuart Mill",
      "js mill":"John Stuart Mill",
      "saint augustin":"Augustin",
      "st augustin":"Augustin",
      "saint thomas":"Thomas d’Aquin",
      "thomas aquin":"Thomas d’Aquin",
      "marc aurele":"Marc Aurèle",
      "zenon":"Zénon de Kition",
      "zenon de kition":"Zénon de Kition",
      "simone de beauvoir":"Simone de Beauvoir",
      "hannah arendt":"Hannah Arendt",
      "auguste comte":"Auguste Comte",
      "francis bacon":"Francis Bacon"
    };
    Object.entries(specialAliases).forEach(([alias,target]) => {
      const entry = entryMap.get(normalizeKey(target));
      if (entry) aliasMap.set(normalizeKey(alias), entry);
    });

    const findEntry = (value) => entryMap.get(normalizeKey(value)) || aliasMap.get(normalizeKey(value)) || null;

    if (count) count.textContent = `${entries.length} entrées`;

    const closeResults = () => {
      if (!results) return;
      results.hidden = true;
      results.innerHTML = "";
      search?.setAttribute("aria-expanded","false");
    };

    const activateFilter = (value="all") => {
      filters.forEach((button) => {
        const active = button.dataset.philoDictionaryFilter === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };

    const clearLetters = () => letters.forEach((button) => button.classList.remove("is-active"));

    const getEntryType = (entry) => {
      if (entry.kind === "author") return "author";
      const cat = normalizeKey(entry.category);
      if (/(courant|ecole|tradition)/.test(cat)) return "current";
      if (/(grec|latin)/.test(cat) || [
        "arche","arete","nomos","physis","poiesis","psyche","telos","eros","philia","agape","logos","eudaimonia"
      ].includes(normalizeKey(entry.term))) return "classical";
      if (/(repere|methodologique|logique)/.test(cat)) return "method";
      return "concept";
    };

    const currentFilter = () => filters.find((button) => button.classList.contains("is-active"))?.dataset.philoDictionaryFilter || "all";

    const entryMatchesFilter = (entry, filter=currentFilter()) => filter === "all" || getEntryType(entry) === filter;

    const linkedFragment = (text) => {
      const fragment = document.createDocumentFragment();
      const pieces = String(text || "").split(/(\[\[[^\]]+\]\])/g).filter(Boolean);
      pieces.forEach((piece) => {
        const match = piece.match(/^\[\[([^\]]+)\]\]$/);
        if (!match) {
          const holder = document.createElement("span");
          holder.innerHTML = formatForeignTerms(piece);
          while (holder.firstChild) fragment.append(holder.firstChild);
          return;
        }
        const label = match[1];
        const target = findEntry(label);
        if (!target) {
          const span = document.createElement("span");
          span.className = "philo-dict-concept-static";
          span.textContent = label;
          fragment.append(span);
          return;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = "philo-dict-inline-link";
        button.textContent = label;
        button.addEventListener("click", () => renderEntry(target,{focus:true}));
        fragment.append(button);
      });
      return fragment;
    };

    const paragraphWithLinks = (text,className="") => {
      const p = document.createElement("p");
      if (className) p.className = className;
      p.append(linkedFragment(text));
      return p;
    };

    const makeEntryChip = (label, extraClass="") => {
      const target = findEntry(label);
      if (!target) {
        const span = document.createElement("span");
        span.className = `philo-dict-related-static ${extraClass}`.trim();
        span.textContent = label;
        return span;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = extraClass;
      button.textContent = label;
      button.addEventListener("click",() => renderEntry(target,{focus:true}));
      return button;
    };

    const renderAuthor = (entry) => {
      body.append(paragraphWithLinks(entry.lead,"philo-dict-lead"));

      const meta = document.createElement("div");
      meta.className = "philo-dict-author-meta";

      if (entry.dates) {
        const dates = document.createElement("div");
        dates.className = "philo-dict-author-dates";
        dates.innerHTML = `<span>Repères</span><strong>${escapeHtml(entry.dates)}</strong>`;
        meta.append(dates);
      }

      if (entry.knownFor) {
        const known = document.createElement("section");
        known.className = "philo-dict-card philo-dict-author-known";
        const h = document.createElement("h5");
        h.textContent = "Pourquoi le retenir ?";
        known.append(h, paragraphWithLinks(entry.knownFor));
        meta.append(known);
      }
      if (meta.children.length) body.append(meta);

      const grid = document.createElement("div");
      grid.className = "philo-dict-author-sections";

      if (entry.currents?.length) {
        const section = document.createElement("section");
        section.className = "philo-dict-card philo-dict-author-section";
        const h = document.createElement("h5");
        h.textContent = "Courant(s) & contexte";
        const chips = document.createElement("div");
        chips.className = "philo-dict-chip-list";
        entry.currents.forEach((item) => chips.append(makeEntryChip(item,"philo-dict-chip")));
        section.append(h,chips);
        grid.append(section);
      }

      if (entry.concepts?.length) {
        const section = document.createElement("section");
        section.className = "philo-dict-card philo-dict-author-section";
        const h = document.createElement("h5");
        h.textContent = "Concepts fondamentaux";
        const chips = document.createElement("div");
        chips.className = "philo-dict-chip-list";
        entry.concepts.forEach((item) => chips.append(makeEntryChip(item,"philo-dict-chip")));
        section.append(h,chips);
        grid.append(section);
      }
      if (grid.children.length) body.append(grid);

      if (entry.works?.length) {
        const works = document.createElement("section");
        works.className = "philo-dict-author-works";
        const head = document.createElement("div");
        head.className = "philo-dict-subhead";
        head.innerHTML = "<span>Pour le situer</span><h5>Œuvres principales</h5>";
        works.append(head);
        const ul = document.createElement("ul");
        entry.works.forEach((work) => {
          const li = document.createElement("li");
          li.append(linkedFragment(work));
          ul.append(li);
        });
        works.append(ul);
        body.append(works);
      }

      if (entry.siteAuthor) {
        const siteLink = document.createElement("a");
        siteLink.className = "philo-dict-site-author";
        siteLink.href = `/textes/philosophie/?auteur=${encodeURIComponent(entry.siteAuthor)}`;
        siteLink.innerHTML = `<span>Dans la bibliothèque</span><strong>Voir les textes de ${escapeHtml(entry.term)} →</strong>`;
        body.append(siteLink);
      }
    };

    const renderConcept = (entry) => {
      body.append(paragraphWithLinks(entry.lead,"philo-dict-lead"));

      const overview = document.createElement("div");
      overview.className = "philo-dict-overview";

      if (entry.etymology) {
        const ety = document.createElement("section");
        ety.className = "philo-dict-card philo-dict-etymology";
        const h = document.createElement("h5");
        h.textContent = "Étymologie & repère";
        ety.append(h, paragraphWithLinks(entry.etymology));
        overview.append(ety);
      }

      if (entry.senses?.length) {
        const senses = document.createElement("section");
        senses.className = "philo-dict-card philo-dict-senses";
        const h = document.createElement("h5");
        h.textContent = "Sens à distinguer";
        senses.append(h);
        const ul = document.createElement("ul");
        entry.senses.forEach((item) => {
          const li=document.createElement("li");
          li.append(linkedFragment(item));
          ul.append(li);
        });
        senses.append(ul);
        overview.append(senses);
      }

      if (overview.children.length) body.append(overview);

      if (entry.authors?.length) {
        const authorsSection = document.createElement("section");
        authorsSection.className = "philo-dict-authors";
        const head = document.createElement("div");
        head.className="philo-dict-subhead";
        head.innerHTML="<span>Repères historiques</span><h5>Chez les auteurs</h5>";
        authorsSection.append(head);

        const list = document.createElement("div");
        list.className="philo-dict-author-grid";
        entry.authors.forEach((item) => {
          const card=document.createElement("article");
          const target=findEntry(item.name);
          if (target?.kind === "author") {
            const button=document.createElement("button");
            button.type="button";
            button.className="philo-dict-author-link";
            button.textContent=item.name;
            button.addEventListener("click",()=>renderEntry(target,{focus:true}));
            card.append(button);
          } else {
            const strong=document.createElement("strong");
            strong.textContent=item.name;
            card.append(strong);
          }
          card.append(paragraphWithLinks(item.text));
          list.append(card);
        });
        authorsSection.append(list);
        body.append(authorsSection);
      }
    };

    const renderEntry = (entry,{focus=false,closeList=true}={}) => {
      if (!entry || !detail || !body) return;

      if (title) title.textContent = entry.term;
      if (category) {
        category.textContent = entry.kind === "author" && entry.dates
          ? `${entry.category} · ${entry.dates}`
          : entry.category;
      }

      body.innerHTML = "";
      if (entry.kind === "author") renderAuthor(entry);
      else renderConcept(entry);

      if (related) {
        related.innerHTML = "";
        (entry.related || []).forEach((term) => related.append(makeEntryChip(term)));
      }

      detail.hidden=false;
      detail.animate?.(
        [{opacity:.35,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],
        {duration:240,easing:"cubic-bezier(.22,.75,.2,1)"}
      );

      if (closeList) closeResults();
      if (focus) detail.scrollIntoView({behavior:"smooth",block:"nearest"});
    };

    const searchText = (entry) => normalizeKey([
      entry.term,entry.aliases,entry.category,entry.lead,entry.etymology,
      entry.dates,entry.knownFor,
      ...(entry.senses || []),
      ...(entry.related || []),
      ...(entry.authors || []).flatMap((a)=>[a.name,a.text]),
      ...(entry.currents || []),
      ...(entry.works || []),
      ...(entry.concepts || [])
    ].filter(Boolean).join(" "));

    const rankEntries = (query) => entries.map((entry) => {
      const term = normalizeKey(entry.term);
      const haystack = searchText(entry);
      let score = haystack.includes(query) ? 1 : 0;
      if (term.startsWith(query)) score += 6;
      if (term === query) score += 12;
      if (entry.kind === "author" && term.split(" ").at(-1)?.startsWith(query)) score += 4;
      if (normalizeKey(entry.aliases || "").includes(query)) score += 3;
      return {entry,score};
    }).filter((item)=>item.score>0)
      .sort((a,b)=>b.score-a.score || collator.compare(a.entry.term,b.entry.term));

    const resultPreview = (entry) => {
      if (entry.kind === "author") {
        const prefix = entry.dates ? `${entry.dates} · ` : "";
        return `${prefix}${entry.knownFor || entry.lead}`;
      }
      return entry.lead || entry.category || "";
    };

    const renderResultList = (list,{limit=80}={}) => {
      if (!results) return;
      results.innerHTML = "";
      const visible = list.slice(0,limit);

      if (!visible.length) {
        results.innerHTML='<div class="philo-dictionary-no-result">Aucune entrée trouvée.</div>';
      } else {
        visible.forEach((entry) => {
          const button=document.createElement("button");
          button.type="button";
          button.setAttribute("role","option");
          const previewRaw = resultPreview(entry);
          const preview = previewRaw.length>145 ? `${previewRaw.slice(0,142).trim()}…` : previewRaw;
          const badge = entry.kind === "author" ? "Auteur" : entry.category;
          button.innerHTML = `<span><em>${escapeHtml(badge)}</em><strong>${escapeHtml(entry.term)}</strong><small>${escapeHtml(preview)}</small></span><i>→</i>`;
          button.addEventListener("click",()=>renderEntry(entry));
          results.append(button);
        });

        if (list.length > limit) {
          const more = document.createElement("div");
          more.className = "philo-dictionary-more";
          more.textContent = `${list.length-limit} autres entrées : précisez votre recherche ou choisissez une lettre.`;
          results.append(more);
        }
      }

      results.hidden=false;
      search?.setAttribute("aria-expanded","true");
    };

    const updateResults = () => {
      if (!search || !results) return;
      const query=normalizeKey(search.value.trim());

      if (!query) {
        closeResults();
        if (detail) detail.hidden=true;
        return;
      }

      activateFilter("all");
      clearLetters();
      const matches=rankEntries(query).slice(0,14);
      renderResultList(matches.map(({entry})=>entry),{limit:14});

      if (matches.length) renderEntry(matches[0].entry,{closeList:false});
      else if (detail) detail.hidden=true;
    };

    const browseByFilter = (filter) => {
      if (search) search.value="";
      if (detail) detail.hidden=true;
      clearLetters();
      activateFilter(filter);

      if (filter === "all") {
        closeResults();
        return;
      }

      const list=entries
        .filter((entry)=>entryMatchesFilter(entry,filter))
        .sort((a,b)=>collator.compare(a.term,b.term));
      renderResultList(list,{limit:90});
    };

    const browseByLetter = (letter) => {
      if (search) search.value="";
      if (detail) detail.hidden=true;
      letters.forEach((button)=>button.classList.toggle("is-active",button.dataset.philoDictionaryLetter===letter));

      const filter=currentFilter();
      const normalizedLetter=normalizeKey(letter);
      const list=entries
        .filter((entry)=>entryMatchesFilter(entry,filter))
        .filter((entry)=>normalizeKey(entry.term).startsWith(normalizedLetter))
        .sort((a,b)=>collator.compare(a.term,b.term));
      renderResultList(list,{limit:90});
    };

    search?.addEventListener("input",updateResults);
    search?.addEventListener("keydown",(event) => {
      if (event.key !== "Enter") return;
      const query=normalizeKey(search.value.trim());
      if (!query) return;
      const first=rankEntries(query)[0]?.entry;
      if (first) {
        event.preventDefault();
        renderEntry(first);
      }
    });

    filters.forEach((button) => {
      button.addEventListener("click",()=>browseByFilter(button.dataset.philoDictionaryFilter || "all"));
    });

    letters.forEach((button) => {
      button.addEventListener("click",()=>browseByLetter(button.dataset.philoDictionaryLetter || ""));
    });

    starters?.querySelectorAll("[data-philo-dictionary-term]").forEach((button) => button.addEventListener("click",() => {
      const entry=findEntry(button.dataset.philoDictionaryTerm);
      if (entry) {
        activateFilter("all");
        clearLetters();
        renderEntry(entry,{focus:true});
      }
    }));

    const params = new URLSearchParams(window.location.search);
    const requested = params.get("dict") || params.get("dictionnaire");
    if (requested) {
      const entry=findEntry(requested);
      if (entry) requestAnimationFrame(()=>renderEntry(entry,{focus:true}));
    }

    document.addEventListener("click",(event) => {
      if (!dictionary.contains(event.target)) closeResults();
    });
  }



  // ------------------------------------------------------------
  // Ressources : animation douce des <details> natifs.
  // On garde la sémantique/accessibilité de details/summary, mais on retarde
  // la fermeture jusqu'à la fin du mouvement afin d'éviter l'effet brutal.
  // ------------------------------------------------------------
  const philoResourceGroups = [...document.querySelectorAll(".philo-resources-v1 details.bible-resource-group")];
  if (philoResourceGroups.length) {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    philoResourceGroups.forEach((detail) => {
      const summary = detail.querySelector(":scope > summary");
      const body = detail.querySelector(":scope > .bible-resource-group-body");
      if (!summary || !body) return;

      let intendedOpen = detail.open;
      let running = null;

      const cleanup = (open) => {
        detail.open = open;
        detail.classList.remove("is-resource-animating");
        body.style.removeProperty("height");
        body.style.removeProperty("overflow");
        body.style.removeProperty("opacity");
        body.style.removeProperty("transform");
        running = null;
      };

      const animateTo = (open) => {
        intendedOpen = open;
        running?.cancel?.();
        if (reducedMotion || !body.animate) {
          cleanup(open);
          return;
        }

        detail.classList.add("is-resource-animating");
        const wasOpen = detail.open;
        const currentHeight = wasOpen ? body.getBoundingClientRect().height : 0;
        if (open) detail.open = true;

        if (open) {
          body.style.height = "auto";
          const targetHeight = body.scrollHeight;
          body.style.height = "0px";
          body.style.overflow = "hidden";
          running = body.animate(
            [
              { height:`${Math.max(0,currentHeight)}px`, opacity:.18, transform:"translateY(-7px)" },
              { height:`${targetHeight}px`, opacity:1, transform:"translateY(0)" }
            ],
            { duration:420, easing:"cubic-bezier(.16,1,.3,1)", fill:"forwards" }
          );
          running.onfinish = () => cleanup(true);
        } else {
          const startHeight = body.getBoundingClientRect().height || body.scrollHeight;
          body.style.overflow = "hidden";
          running = body.animate(
            [
              { height:`${startHeight}px`, opacity:1, transform:"translateY(0)" },
              { height:"0px", opacity:.12, transform:"translateY(-6px)" }
            ],
            { duration:330, easing:"cubic-bezier(.4,0,.2,1)", fill:"forwards" }
          );
          running.onfinish = () => cleanup(false);
        }
      };

      summary.addEventListener("click", (event) => {
        event.preventDefault();
        animateTo(!intendedOpen);
      });
    });
  }

  // ------------------------------------------------------------
  // Navigation de la boussole : complète dans sa position initiale, puis
  // réduite aux quatre pictogrammes lorsqu'elle rejoint le header.
  // La position de départ est mémorisée hors état sticky : cela évite les
  // bascules/flickers lorsque la barre change de largeur et de hauteur.
  // ------------------------------------------------------------
  const philoJumpNav = document.querySelector(".philo-compass-jump");
  if (philoJumpNav) {
    let jumpDocumentTop = 0;

    const measurePhiloJump = () => {
      const wasCondensed = philoJumpNav.classList.contains("is-condensed");
      if (wasCondensed) philoJumpNav.classList.remove("is-condensed");
      jumpDocumentTop = philoJumpNav.getBoundingClientRect().top + window.scrollY;
      if (wasCondensed) philoJumpNav.classList.add("is-condensed");
    };

    const updatePhiloJump = () => {
      const siteHeader = document.getElementById("site-header");
      const headerHeight = siteHeader?.getBoundingClientRect().height || (window.innerWidth <= 700 ? 60 : 68);
      const stuck = window.scrollY > 8 && (window.scrollY + headerHeight + 10 >= jumpDocumentTop);
      philoJumpNav.classList.toggle("is-condensed", stuck);
    };

    philoJumpNav.querySelectorAll("a").forEach((link) => {
      const title = link.querySelector("strong")?.textContent?.trim();
      const subtitle = link.querySelector("small")?.textContent?.trim();
      if (!link.getAttribute("aria-label") && title) {
        link.setAttribute("aria-label", subtitle ? `${title} — ${subtitle}` : title);
      }
    });

    measurePhiloJump();
    updatePhiloJump();
    window.addEventListener("scroll", updatePhiloJump, { passive:true });
    window.addEventListener("resize", () => {
      measurePhiloJump();
      updatePhiloJump();
    });
    window.addEventListener("load", () => {
      measurePhiloJump();
      updatePhiloJump();
    }, { once:true });
  }

})();

(() => {
  "use strict";

  const META_URL = "/assets/data/bible/meta.json";
  const COLLECTIONS_URL = "/assets/data/bible/collections.json";
  const LSG_BASE = "https://raw.githubusercontent.com/dfoerder/free-bible-translations/7a7c6aa0cc484d49cdca76cec099895657025023/fra/lsg1910";

  const bookSelect = document.querySelector("[data-bible-book]");
  const translationSelect = document.querySelector("[data-bible-translation]");
  const chapterSelect = document.querySelector("[data-bible-chapter]");
  const content = document.querySelector("[data-bible-reader-content]");
  const status = document.querySelector("[data-bible-reader-status]");
  const progress = document.querySelector("[data-bible-reader-progress]");
  const navWrap = document.querySelector("[data-bible-nav-wrap]");
  const prevButton = document.querySelector("[data-bible-prev]");
  const nextButton = document.querySelector("[data-bible-next]");
  const currentButton = document.querySelector("[data-bible-current]");
  const currentLabel = document.querySelector("[data-bible-current-label]");
  const currentTitle = document.querySelector("[data-bible-current-title]");
  const chapterIndex = document.querySelector("[data-bible-chapter-index]");
  const translationNote = document.querySelector("[data-bible-translation-note]");
  const searchToggle = document.querySelector("[data-bible-search-toggle]");
  const searchPanel = document.querySelector("[data-bible-search-panel]");
  const searchForm = document.querySelector("[data-bible-search-form]");
  const searchInput = document.querySelector("[data-bible-search-input]");
  const searchScope = document.querySelector("[data-bible-search-scope]");
  const searchStatus = document.querySelector("[data-bible-search-status]");
  const searchResults = document.querySelector("[data-bible-search-results]");
  const searchClose = document.querySelector("[data-bible-search-close]");
  const landmarksToggle = document.querySelector("[data-bible-landmarks-toggle]");
  const compareToggle = document.querySelector("[data-bible-compare-toggle]");
  const comparePanel = document.querySelector("[data-bible-compare-panel]");
  const compareContent = document.querySelector("[data-bible-compare-content]");
  const compareTitle = document.querySelector("[data-bible-compare-title]");
  const compareClose = document.querySelector("[data-bible-compare-close]");
  const compareModeButtons = [...document.querySelectorAll("[data-bible-compare-mode]")];
  const compareTranslations = document.querySelector("[data-bible-compare-translations]");
  const compareNote = document.querySelector("[data-bible-compare-note]");
  const compareFocusNav = document.querySelector("[data-bible-compare-focus-nav]");
  const comparePrevVerse = document.querySelector("[data-bible-compare-prev-verse]");
  const compareNextVerse = document.querySelector("[data-bible-compare-next-verse]");
  const compareFocusRef = document.querySelector("[data-bible-compare-focus-ref]");
  const compareFocusLabel = document.querySelector("[data-bible-compare-focus-label]");
  const collectionsToggle = document.querySelector("[data-bible-collections-toggle]");
  const collectionsPanel = document.querySelector("[data-bible-collections-panel]");
  const collectionsClose = document.querySelector("[data-bible-collections-close]");
  const collectionTabs = [...document.querySelectorAll("[data-bible-collection]")];
  const collectionsDescription = document.querySelector("[data-bible-collections-description]");
  const collectionsSearch = document.querySelector("[data-bible-collections-search]");
  const collectionsSection = document.querySelector("[data-bible-collections-section]");
  const collectionsType = document.querySelector("[data-bible-collections-type]");
  const collectionsStatus = document.querySelector("[data-bible-collections-status]");
  const collectionsList = document.querySelector("[data-bible-collections-list]");
  const floatingNav = document.querySelector("[data-bible-floating-nav]");
  const floatingPrev = document.querySelector("[data-bible-floating-prev]");
  const floatingNext = document.querySelector("[data-bible-floating-next]");
  const floatingCurrent = document.querySelector("[data-bible-floating-current]");
  const floatingRef = document.querySelector("[data-bible-floating-ref]");
  const floatingTitle = document.querySelector("[data-bible-floating-title]");

  if (!bookSelect || !translationSelect || !chapterSelect || !content) return;

  let meta = null;
  let bookMap = new Map();
  let translationMap = new Map();
  let bookRank = new Map();
  let currentBook = null;
  let currentTranslation = null;
  let currentData = null;
  let currentOrder = [];
  let currentChapter = null;
  let currentVerse = null;
  let searchRun = 0;
  let compareRun = 0;
  let compareIsOpen = false;
  let compareMode = "verse";
  let compareVerse = null;
  let compareSelected = new Set();
  let collectionsData = null;
  let collectionsIsOpen = false;
  let collectionKind = "prayers";
  let collectionRun = 0;
  let landmarksVisible = true;
  const dataCache = new Map();

  // ------------------------------------------------------------
  // Références croisées — sélection volontairement resserrée.
  // Trois niveaux : citation explicite, parallèle narratif, écho majeur.
  // Les relations sont indexées dans les deux sens pour permettre de
  // circuler de l'Ancien au Nouveau Testament et inversement.
  // ------------------------------------------------------------
  const CROSS_REFERENCE_SEEDS = [
    ["Gen","1","1","John","1","1-3","echo","Création et Logos : deux ouvertures qui commencent « au commencement »."],
    ["Gen","1","3","2Cor","4","6","echo","Paul reprend l'image de la lumière surgissant des ténèbres."],
    ["Gen","1","27","Matt","19","4-6","citation","Création de l'homme et de la femme reprise dans l'enseignement de Jésus."],
    ["Gen","2","2-3","Heb","4","4","citation","Le repos du septième jour est cité dans la réflexion sur le repos de Dieu."],
    ["Gen","2","24","Matt","19","5-6","citation","L'union de l'homme et de la femme est explicitement citée par Jésus."],
    ["Gen","2","24","Eph","5","31-32","citation","Paul cite le verset et l'applique au rapport entre le Christ et l'Église."],
    ["Gen","3","15","Rev","12","9-17","echo","Le serpent ancien et l'affrontement avec la descendance de la femme réapparaissent dans l'Apocalypse."],
    ["Gen","12","3","Gal","3","8","citation","La promesse faite à Abraham est relue par Paul comme annonce de la bénédiction des nations."],
    ["Gen","15","6","Rom","4","3","citation","La foi d'Abraham lui est comptée comme justice."],
    ["Gen","15","6","Gal","3","6","citation","Paul cite la foi d'Abraham pour penser la justification."],
    ["Gen","15","6","Jas","2","23","citation","Jacques cite le même verset dans sa réflexion sur foi et œuvres."],
    ["Gen","18","10","Rom","9","9","citation","La promesse de la naissance d'Isaac est reprise par Paul."],
    ["Gen","21","10","Gal","4","30","citation","Paul cite l'expulsion de la servante et de son fils dans son allégorie des deux alliances."],
    ["Gen","22","18","Acts","3","25","citation","La bénédiction promise à la descendance d'Abraham est reprise dans le discours de Pierre."],
    ["Gen","22","18","Gal","3","16","echo","Paul interprète la promesse faite à la descendance d'Abraham dans une lecture christologique."],
    ["Gen","28","12","John","1","51","echo","L'échelle de Jacob éclaire l'image des anges montant et descendant au-dessus du Fils de l'homme."],

    ["Exod","3","6","Matt","22","32","citation","Jésus cite la parole du buisson ardent dans la discussion sur la résurrection."],
    ["Exod","3","14","John","8","58","echo","Le « Je suis » johannique fait écho au nom divin révélé à Moïse."],
    ["Exod","12","46","John","19","36","echo","L'interdiction de briser les os de l'agneau pascal éclaire le récit de la crucifixion."],
    ["Exod","16","4","John","6","31-35","echo","La manne du désert est relue dans le discours sur le pain de vie."],
    ["Exod","20","12","Matt","15","4","citation","Le commandement d'honorer père et mère est cité par Jésus."],
    ["Exod","20","13-17","Matt","19","18-19","citation","Plusieurs commandements du Décalogue sont repris dans l'entretien avec le jeune homme riche."],
    ["Exod","24","8","Matt","26","28","echo","Le sang de l'alliance au Sinaï éclaire les paroles sur la coupe lors du dernier repas."],
    ["Exod","32","6","1Cor","10","7","citation","Paul cite l'épisode du veau d'or comme avertissement."],
    ["Lev","19","18","Matt","22","39","citation","« Tu aimeras ton prochain » devient le second grand commandement."],
    ["Lev","19","18","Rom","13","9","citation","Paul résume plusieurs commandements dans l'amour du prochain."],
    ["Num","21","8-9","John","3","14-15","echo","Le serpent élevé par Moïse devient une figure de l'élévation du Fils de l'homme."],
    ["Deut","6","4-5","Mark","12","29-30","citation","Le Shema est cité par Jésus comme premier commandement."],
    ["Deut","8","3","Matt","4","4","citation","Jésus répond à la tentation en citant le Deutéronome : l'homme ne vit pas seulement de pain."],
    ["Deut","6","16","Matt","4","7","citation","Deuxième réponse de Jésus au tentateur, tirée du Deutéronome."],
    ["Deut","6","13","Matt","4","10","citation","Troisième réponse de Jésus au tentateur : adorer Dieu seul."],
    ["Deut","18","15","Acts","3","22","citation","Pierre cite la promesse d'un prophète semblable à Moïse."],
    ["Deut","24","1","Matt","19","7-8","citation","La loi sur l'acte de répudiation est discutée par Jésus."],

    ["Ps","2","7","Acts","13","33","citation","Le psaume royal est cité dans la prédication apostolique sur Jésus."],
    ["Ps","8","4-6","Heb","2","6-8","citation","Le psaume sur l'homme et sa place dans la création est longuement cité."],
    ["Ps","22","1","Matt","27","46","citation","Jésus prononce sur la croix l'ouverture du psaume 22."],
    ["Ps","22","18","John","19","24","citation","Le partage des vêtements est rapproché explicitement du psaume."],
    ["Ps","34","20","John","19","36","echo","Le juste dont aucun os n'est brisé éclaire le récit de la Passion."],
    ["Ps","69","9","John","2","17","citation","Le zèle pour la maison de Dieu est cité après l'épisode du Temple."],
    ["Ps","69","21","John","19","28-29","echo","La soif et le vinaigre du psaume font écho à la Passion johannique."],
    ["Ps","110","1","Matt","22","44","citation","Jésus cite « Le Seigneur a dit à mon Seigneur » à propos du Messie."],
    ["Ps","110","1","Acts","2","34-35","citation","Pierre cite le psaume pour interpréter l'exaltation du Christ."],
    ["Ps","110","1","Heb","1","13","citation","Le même verset structure l'argument sur la supériorité du Fils."],
    ["Ps","118","22","Matt","21","42","citation","La pierre rejetée devenue pierre d'angle est citée par Jésus."],
    ["Ps","118","26","Matt","21","9","citation","L'acclamation de l'entrée à Jérusalem reprend le psaume : « Béni soit celui qui vient »."],

    ["Isa","6","9-10","Matt","13","14-15","citation","Isaïe est cité pour expliquer l'endurcissement de ceux qui entendent les paraboles."],
    ["Isa","7","14","Matt","1","23","citation","Matthieu cite le signe de l'Emmanuel dans le récit de la naissance de Jésus."],
    ["Isa","9","1-2","Matt","4","15-16","citation","La lumière annoncée en Galilée est citée au début du ministère de Jésus."],
    ["Isa","40","3","Matt","3","3","citation","La voix qui crie dans le désert est appliquée à Jean le Baptiste."],
    ["Isa","40","3","John","1","23","citation","Jean le Baptiste se présente lui-même par les mots d'Isaïe."],
    ["Isa","42","1-4","Matt","12","18-21","citation","Matthieu cite le chant du serviteur pour caractériser la mission de Jésus."],
    ["Isa","53","4","Matt","8","17","citation","Le serviteur portant les souffrances est cité après les guérisons de Jésus."],
    ["Isa","53","7-8","Acts","8","32-35","citation","Le passage du serviteur souffrant est lu par l'eunuque puis interprété par Philippe."],
    ["Isa","53","12","Luke","22","37","citation","Jésus cite le serviteur « compté parmi les criminels »."],
    ["Isa","61","1-2","Luke","4","18-19","citation","Jésus lit ce passage à la synagogue de Nazareth et l'applique à sa mission."],
    ["Jer","31","15","Matt","2","18","citation","Les pleurs de Rachel sont cités dans le récit du massacre des enfants de Bethléem."],
    ["Jer","31","31-34","Heb","8","8-12","citation","La promesse d'une alliance nouvelle est citée presque intégralement."],
    ["Hos","11","1","Matt","2","15","citation","« D'Égypte j'ai appelé mon fils » est cité à propos du retour de Jésus."],
    ["Joel","2","28-32","Acts","2","17-21","citation","Pierre cite Joël pour interpréter l'effusion de l'Esprit à la Pentecôte."],
    ["Mic","5","2","Matt","2","6","citation","La prophétie concernant Bethléem est citée dans le récit des mages."],
    ["Zech","9","9","Matt","21","5","citation","L'entrée du roi humble monté sur un âne est citée lors de l'entrée à Jérusalem."],
    ["Zech","12","10","John","19","37","citation","Jean cite « Ils regarderont celui qu'ils ont transpercé »."],
    ["Zech","13","7","Mark","14","27","citation","Jésus cite le berger frappé et les brebis dispersées."],
    ["Mal","3","1","Mark","1","2","citation","Le messager envoyé devant Dieu est repris à l'ouverture de Marc."],

    // Grands parallèles narratifs entre les Évangiles.
    ["Matt","3","13-17","Mark","1","9-11","parallel","Baptême de Jésus."],
    ["Matt","3","13-17","Luke","3","21-22","parallel","Baptême de Jésus."],
    ["Matt","4","1-11","Luke","4","1-13","parallel","Tentations au désert."],
    ["Matt","5","3-12","Luke","6","20-23","parallel","Béatitudes."],
    ["Matt","6","9-13","Luke","11","2-4","parallel","Prière du Notre Père."],
    ["Matt","8","23-27","Mark","4","35-41","parallel","Tempête apaisée."],
    ["Matt","8","23-27","Luke","8","22-25","parallel","Tempête apaisée."],
    ["Matt","13","1-23","Mark","4","1-20","parallel","Parabole du semeur et son interprétation."],
    ["Matt","13","1-23","Luke","8","4-15","parallel","Parabole du semeur et son interprétation."],
    ["Matt","14","13-21","Mark","6","30-44","parallel","Multiplication des pains."],
    ["Matt","14","13-21","Luke","9","10-17","parallel","Multiplication des pains."],
    ["Matt","14","13-21","John","6","1-14","parallel","Multiplication des pains."],
    ["Matt","16","13-20","Mark","8","27-30","parallel","Confession de Pierre."],
    ["Matt","16","13-20","Luke","9","18-21","parallel","Confession de Pierre."],
    ["Matt","17","1-8","Mark","9","2-8","parallel","Transfiguration."],
    ["Matt","17","1-8","Luke","9","28-36","parallel","Transfiguration."],
    ["Matt","21","1-11","Mark","11","1-11","parallel","Entrée à Jérusalem."],
    ["Matt","21","1-11","Luke","19","28-40","parallel","Entrée à Jérusalem."],
    ["Matt","21","1-11","John","12","12-19","parallel","Entrée à Jérusalem."],
    ["Matt","26","26-29","Mark","14","22-25","parallel","Dernier repas : pain et coupe."],
    ["Matt","26","26-29","Luke","22","14-20","parallel","Dernier repas : pain et coupe."],
    ["Matt","26","36-46","Mark","14","32-42","parallel","Prière à Gethsémani."],
    ["Matt","26","36-46","Luke","22","39-46","parallel","Prière au mont des Oliviers."],
    ["Matt","27","32-56","Mark","15","21-41","parallel","Crucifixion et mort de Jésus."],
    ["Matt","27","32-56","Luke","23","26-49","parallel","Crucifixion et mort de Jésus."],
    ["Matt","27","32-56","John","19","16-37","parallel","Crucifixion et mort de Jésus."],
    ["Matt","28","1-10","Mark","16","1-8","parallel","Découverte du tombeau vide."],
    ["Matt","28","1-10","Luke","24","1-12","parallel","Découverte du tombeau vide."],
    ["Matt","28","1-10","John","20","1-18","parallel","Tombeau vide et premières apparitions."],

    ["Rev","21","1","Isa","65","17","echo","Le ciel nouveau et la terre nouvelle prolongent la promesse d'Isaïe."],
    ["Rev","21","3-4","Isa","25","8","echo","La disparition de la mort et des larmes fait écho à la promesse d'Isaïe."],
    ["Rev","22","1-2","Gen","2","9-10","echo","Le fleuve et l'arbre de vie de la Jérusalem nouvelle répondent au jardin d'Éden."],
    ["Rev","22","13","Isa","44","6","echo","L'affirmation du Premier et du Dernier reprend un titre divin d'Isaïe."]
  ].map(([fromBook,fromChapter,fromVerses,toBook,toChapter,toVerses,type,note])=>({
    from:{book:fromBook,chapter:String(fromChapter),verses:String(fromVerses)},
    to:{book:toBook,chapter:String(toChapter),verses:String(toVerses)},
    type,note
  }));

  const xrefTypeLabel = (type) => ({citation:"Citation",parallel:"Parallèle",echo:"Écho"}[type] || "Lien");
  const firstVerseOf = (range) => String(range || "1").split(/[-–]/)[0].trim();
  const xrefKey = (book,chapter,verse) => `${book}:${chapter}:${verse}`;
  const crossReferenceIndex = new Map();
  const addCrossReference = (anchor, target, type, note, reverse=false) => {
    const verse = firstVerseOf(anchor.verses);
    const key = xrefKey(anchor.book,anchor.chapter,verse);
    if (!crossReferenceIndex.has(key)) crossReferenceIndex.set(key,[]);
    crossReferenceIndex.get(key).push({target,type,note,reverse});
  };
  CROSS_REFERENCE_SEEDS.forEach((seed)=>{
    addCrossReference(seed.from,seed.to,seed.type,seed.note,false);
    addCrossReference(seed.to,seed.from,seed.type,seed.note,true);
  });
  const crossReferencesFor = (bookCode,chapterId,verse) => crossReferenceIndex.get(xrefKey(bookCode,String(chapterId),String(verse))) || [];
  const refDisplay = (ref) => {
    const book=bookMap.get(ref.book);
    const range=String(ref.verses || "").replace(/-/g,"–");
    return `${book?.short || book?.label || ref.book} ${ref.chapter}${range ? `,${range}` : ""}`;
  };
  const xrefHref = (ref) => {
    const available=new Set(bookMap.get(ref.book)?.translations || []);
    const translation=available.has(currentTranslation) ? currentTranslation : (available.has("tob2010") ? "tob2010" : [...available][0] || currentTranslation);
    return urlFor({book:ref.book,translation,chapter:ref.chapter,verse:firstVerseOf(ref.verses)});
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"]/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
  }[c]));
  const normalize = (value) => String(value || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g,"'").replace(/\s+/g," ").trim();

  const titleFor = (bookCode, chapterId) => bookMap.get(bookCode)?.titles?.[chapterId] || "";
  const chapterLabelFor = (bookCode, chapterId) => {
    const book = bookMap.get(bookCode);
    const raw = book?.chapterLabels?.[chapterId];
    if (raw && raw !== chapterId) return raw;
    if (/^\d+$/.test(String(chapterId))) return `Chapitre ${chapterId}`;
    return `Section ${chapterId}`;
  };
  const momentsFor = (bookCode, chapterId) => new Map(Object.entries(bookMap.get(bookCode)?.moments?.[chapterId] || {}));
  const relatedFor = (bookCode, chapterId) => bookMap.get(bookCode)?.related?.[chapterId] || [];

  const setLandmarksVisible = (visible,{persist=true}={}) => {
    landmarksVisible = Boolean(visible);
    document.body.classList.toggle("bible-reader-no-landmarks", !landmarksVisible);
    if (landmarksToggle) {
      landmarksToggle.setAttribute("aria-pressed", landmarksVisible ? "true" : "false");
      landmarksToggle.title = landmarksVisible ? "Masquer les repères pour une lecture plus pure" : "Afficher les repères de lecture";
    }
    if (persist) {
      try { localStorage.setItem("fvBibleLandmarks", landmarksVisible ? "1" : "0"); } catch {}
    }
  };

  const updateFloatingNav = () => {
    if (!floatingNav) return;
    const ready = Boolean(currentData && currentChapter && currentChapter !== "all");
    if (!ready) { floatingNav.hidden = true; return; }
    const pos = chapterPosition();
    const book = bookMap.get(currentBook);
    if (floatingPrev) floatingPrev.disabled = pos <= 0;
    if (floatingNext) floatingNext.disabled = pos >= currentOrder.length - 1;
    if (floatingRef) floatingRef.textContent = `${book?.short || ""} ${currentChapter}`;
    if (floatingTitle) floatingTitle.textContent = titleFor(currentBook,currentChapter) || chapterLabelFor(currentBook,currentChapter);
  };

  const updateFloatingVisibility = () => {
    if (!floatingNav || !currentData || currentChapter === "all") return;
    const controls = document.querySelector(".bible-reader-controls");
    const reader = document.querySelector(".bible-reader-content");
    if (!controls || !reader) return;
    const controlsGone = controls.getBoundingClientRect().bottom < 72;
    const readerStillVisible = reader.getBoundingClientRect().bottom > Math.min(window.innerHeight * .42, 360);
    floatingNav.hidden = !(controlsGone && readerStillVisible);
  };

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };

  const updateControlsCondensed = () => {
    const controls = document.querySelector(".bible-reader-controls");
    if (!controls) return;
    if (window.matchMedia("(max-width: 720px)").matches) {
      controls.classList.remove("is-condensed");
      return;
    }
    const expandedPanel = controls.querySelector(".bible-reader-search-panel:not([hidden]), .bible-reader-compare-panel:not([hidden])");
    if (expandedPanel) {
      controls.classList.remove("is-condensed");
      return;
    }
    const hero = document.querySelector(".bible-reader-hero");
    const threshold = hero ? hero.getBoundingClientRect().bottom + window.scrollY + 18 : 260;
    controls.classList.toggle("is-condensed", window.scrollY > threshold);
  };

  const queryState = () => {
    const params = new URLSearchParams(window.location.search);
    const legacyBook = {genesis:"Gen",matthew:"Matt",mark:"Mark",luke:"Luke",john:"John",revelation:"Rev"};
    let book = params.get("livre") || "Gen";
    book = legacyBook[book] || book;
    if (!bookMap.has(book)) book = "Gen";
    let translation = params.get("traduction") || "tob2010";
    if (!translationMap.has(translation)) translation = "tob2010";
    const chapter = params.get("chapitre") || "1";
    const verse = params.get("verset") || null;
    return {book,translation,chapter,verse};
  };

  const urlFor = ({book=currentBook,translation=currentTranslation,chapter=currentChapter,verse=null}={}) => {
    const url = new URL(window.location.href);
    url.searchParams.set("livre", book);
    url.searchParams.set("traduction", translation);
    if (chapter && chapter !== "all") url.searchParams.set("chapitre", chapter); else url.searchParams.delete("chapitre");
    if (verse && chapter !== "all") url.searchParams.set("verset", verse); else url.searchParams.delete("verset");
    url.hash = "";
    return `${url.pathname}${url.search}`;
  };

  const setUrl = (state={},push=false) => history[push ? "pushState" : "replaceState"](null,"",urlFor(state));

  const buildBookSelect = () => {
    bookSelect.innerHTML = "";
    meta.groups.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      group.books.forEach((code) => {
        const book = bookMap.get(code);
        if (!book) return;
        const option = document.createElement("option");
        option.value = code;
        option.textContent = book.label;
        optgroup.append(option);
      });
      bookSelect.append(optgroup);
    });
  };

  const buildTranslationSelect = () => {
    translationSelect.innerHTML = "";
    meta.translations.forEach((tr) => {
      const option = document.createElement("option");
      option.value = tr.id;
      option.textContent = tr.label;
      translationSelect.append(option);
    });
  };

  const refreshTranslationAvailability = (preferred) => {
    const book = bookMap.get(bookSelect.value);
    const available = new Set(book?.translations || []);
    [...translationSelect.options].forEach((option) => {
      option.disabled = !available.has(option.value);
      const tr = translationMap.get(option.value);
      option.title = option.disabled ? `${tr?.label || option.textContent} n’est pas disponible séparément pour ce livre.` : "";
    });
    let target = preferred || translationSelect.value;
    if (!available.has(target)) target = available.has("tob2010") ? "tob2010" : [...available][0];
    translationSelect.value = target;
    const tr = translationMap.get(target);
    if (translationNote) translationNote.textContent = tr?.note || "";
    return target;
  };

  const sourceFor = (translation, bookCode) => {
    const book = bookMap.get(bookCode);
    if (!book?.translations?.includes(translation)) return null;
    if (translation === "lsg1910") {
      if (!book.lsgNumber) return null;
      return {url:`${LSG_BASE}/${book.lsgNumber}_lsg1910.json`,local:false};
    }
    if (translation === "tob2010") return {url:`/assets/data/bible/tob2010/${bookCode}.json`,local:true};
    if (translation === "jerusalem2019") return {url:`/assets/data/bible/jerusalem2019/${bookCode}.json`,local:true};
    return null;
  };

  const fetchBookData = async (translation,bookCode) => {
    const key = `${translation}:${bookCode}`;
    if (dataCache.has(key)) return dataCache.get(key);
    const source = sourceFor(translation,bookCode);
    if (!source) return null;
    const promise = fetch(source.url,{cache:"force-cache"}).then((response)=>{
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).catch((error)=>{ dataCache.delete(key); throw error; });
    dataCache.set(key,promise);
    return promise;
  };

  const preferredCompareOrder = ["tob2010","jerusalem2019","lsg1910"];

  const availableCompareTranslations = (bookCode=currentBook) => {
    const available = new Set(bookMap.get(bookCode)?.translations || []);
    const ordered = preferredCompareOrder.filter((id)=>available.has(id));
    meta?.translations?.forEach((tr)=>{ if (available.has(tr.id) && !ordered.includes(tr.id)) ordered.push(tr.id); });
    return ordered;
  };

  const persistComparePrefs = () => {
    try {
      localStorage.setItem("fvBibleCompareMode",compareMode);
      localStorage.setItem("fvBibleCompareTranslations",JSON.stringify([...compareSelected]));
    } catch {}
  };

  const restoreComparePrefs = () => {
    try {
      const mode=localStorage.getItem("fvBibleCompareMode");
      if (mode === "verse" || mode === "chapter") compareMode=mode;
      const raw=JSON.parse(localStorage.getItem("fvBibleCompareTranslations") || "[]");
      if (Array.isArray(raw)) compareSelected=new Set(raw.filter((id)=>translationMap.has(id)));
    } catch {}
  };

  const ensureCompareSelection = (bookCode=currentBook) => {
    const available=availableCompareTranslations(bookCode);
    const valid=[...compareSelected].filter((id)=>available.includes(id));
    compareSelected=new Set(valid);
    if (compareSelected.size < Math.min(2,available.length)) {
      available.forEach((id)=>{ if (compareSelected.size < Math.min(3,available.length)) compareSelected.add(id); });
    }
    return available;
  };

  const setCompareMode = (mode,{persist=true,render=true}={}) => {
    if (mode !== "verse" && mode !== "chapter") return;
    compareMode=mode;
    compareModeButtons.forEach((button)=>{
      const active=button.dataset.bibleCompareMode===mode;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-selected",active ? "true":"false");
    });
    if (persist) persistComparePrefs();
    if (compareIsOpen && render) renderCompare();
  };

  const buildCompareTranslationControls = () => {
    if (!compareTranslations) return;
    const available=ensureCompareSelection();
    compareTranslations.innerHTML=available.map((id)=>{
      const selected=compareSelected.has(id);
      const label=translationMap.get(id)?.label || id;
      const lock=selected && compareSelected.size <= Math.min(2,available.length);
      return `<label class="bible-reader-compare-translation${selected ? " is-selected" : ""}"><input type="checkbox" value="${escapeHtml(id)}" ${selected ? "checked" : ""} ${lock ? "data-min-locked=\"true\"" : ""}/><span>${escapeHtml(label)}</span></label>`;
    }).join("");
    compareTranslations.querySelectorAll("input").forEach((input)=>input.addEventListener("change",()=>{
      const availableNow=availableCompareTranslations();
      if (input.checked) compareSelected.add(input.value); else compareSelected.delete(input.value);
      if (compareSelected.size < Math.min(2,availableNow.length)) {
        compareSelected.add(input.value); input.checked=true;
      }
      persistComparePrefs();
      buildCompareTranslationControls();
      renderCompare();
    }));
  };

  const compareVerseOrderFor = (loaded,chapter) => {
    const set=new Set();
    loaded.forEach(({data})=>Object.keys(data?.chapters?.[chapter] || {}).forEach((verse)=>set.add(String(verse))));
    return [...set].sort((a,b)=>{
      const na=Number(a),nb=Number(b);
      if(Number.isFinite(na)&&Number.isFinite(nb)) return na-nb;
      return a.localeCompare(b,"fr",{numeric:true,sensitivity:"base"});
    });
  };

  const retryCompareTranslation = (id) => {
    dataCache.delete(`${id}:${currentBook}`);
    renderCompare();
  };

  const toggleCompare = (force) => {
    if (!comparePanel || !compareToggle) return;
    const open = typeof force === "boolean" ? force : comparePanel.hidden;
    compareIsOpen = open;
    comparePanel.hidden = !open;
    compareToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      toggleSearch(false);
      toggleCollections(false);
      compareVerse=currentVerse || compareVerse;
      setCompareMode(compareMode,{persist:false,render:false});
      buildCompareTranslationControls();
      renderCompare();
    } else {
      compareRun++;
    }
  };

  const renderCompare = async () => {
    if (!compareIsOpen || !compareContent || !currentBook) return;
    const run=++compareRun;
    const book=bookMap.get(currentBook);
    buildCompareTranslationControls();
    if (!currentData || currentChapter === "all") {
      if (compareTitle) compareTitle.textContent=`${book?.label || "Livre"} · choisis un chapitre`;
      if (compareFocusNav) compareFocusNav.hidden=true;
      compareContent.innerHTML=`<div class="bible-reader-compare-empty">Le comparateur travaille sur un chapitre précis. Choisis un chapitre ci-dessus.</div>`;
      return;
    }
    const chapter=String(currentChapter);
    const availableNow=availableCompareTranslations();
    const selected=availableNow.filter((id)=>compareSelected.has(id));
    if (compareTitle) compareTitle.textContent=`${book.label} · ${chapterLabelFor(currentBook,chapter)}`;
    if (availableNow.length < 2) {
      if (compareFocusNav) compareFocusNav.hidden=true;
      const only=translationMap.get(availableNow[0])?.label || "cette traduction";
      compareContent.innerHTML=`<div class="bible-reader-compare-empty">Une seule traduction est disponible pour ce livre (${escapeHtml(only)}). Il n’y a donc rien à comparer ici.</div>`;
      return;
    }
    if (compareNote) compareNote.textContent=compareMode === "verse" ? "Comparaison précise, verset par verset. Les flèches restent dans le comparateur." : "Vue continue du chapitre. Sur téléphone, chaque traduction est empilée pour éviter les colonnes écrasées.";
    compareContent.innerHTML=`<div class="bible-reader-compare-loading"><span></span>Chargement des traductions…</div>`;
    const loaded=await Promise.all(selected.map(async(id)=>{
      try {return {id,data:await fetchBookData(id,currentBook),error:null};}
      catch(error){return {id,data:null,error};}
    }));
    if (run!==compareRun || !compareIsOpen) return;
    const usable=loaded.filter(({data})=>data?.chapters?.[chapter]);
    const verseOrder=compareVerseOrderFor(usable,chapter);
    if (!verseOrder.length) {
      if (compareFocusNav) compareFocusNav.hidden=true;
      compareContent.innerHTML=`<div class="bible-reader-compare-empty">Aucun texte n’a pu être aligné pour ce chapitre.${loaded.some(x=>x.error) ? " Une source n’a pas répondu : tu peux la relancer ci-dessous." : ""}</div>${loaded.filter(x=>x.error).map(({id})=>`<button type="button" class="bible-reader-compare-retry" data-bible-compare-retry="${escapeHtml(id)}">Réessayer · ${escapeHtml(translationMap.get(id)?.label || id)}</button>`).join("")}`;
      compareContent.querySelectorAll("[data-bible-compare-retry]").forEach((b)=>b.addEventListener("click",()=>retryCompareTranslation(b.dataset.bibleCompareRetry)));
      return;
    }

    if (!compareVerse || !verseOrder.includes(String(compareVerse))) compareVerse=currentVerse && verseOrder.includes(String(currentVerse)) ? String(currentVerse) : verseOrder[0];

    if (compareMode === "verse") {
      if (compareFocusNav) compareFocusNav.hidden=false;
      const pos=verseOrder.indexOf(String(compareVerse));
      if (comparePrevVerse) comparePrevVerse.disabled=pos<=0;
      if (compareNextVerse) compareNextVerse.disabled=pos>=verseOrder.length-1;
      if (compareFocusLabel) compareFocusLabel.textContent=`${book.short} ${chapter},${compareVerse}`;
      const cards=loaded.map(({id,data,error})=>{
        const label=translationMap.get(id)?.label || id;
        const text=data?.chapters?.[chapter]?.[compareVerse];
        if (error) return `<article class="bible-reader-compare-card is-error"><header><strong>${escapeHtml(label)}</strong><span>source indisponible</span></header><p>Cette traduction n’a pas pu être chargée.</p><button type="button" data-bible-compare-retry="${escapeHtml(id)}">Réessayer</button></article>`;
        return `<article class="bible-reader-compare-card${id===currentTranslation ? " is-current" : ""}"><header><strong>${escapeHtml(label)}</strong>${id===currentTranslation ? `<span>lecture actuelle</span>` : ""}</header><p>${text ? escapeHtml(text) : `<span class="bible-reader-compare-missing">Verset absent de cette numérotation.</span>`}</p></article>`;
      }).join("");
      compareContent.innerHTML=`<div class="bible-reader-compare-verse-cards">${cards}</div>`;
    } else {
      if (compareFocusNav) compareFocusNav.hidden=true;
      const cols=loaded.length;
      const headers=loaded.map(({id,error})=>`<div class="bible-reader-compare-column-head${id===currentTranslation ? " is-current" : ""}${error ? " is-error" : ""}"><strong>${escapeHtml(translationMap.get(id)?.label || id)}</strong>${error ? `<button type="button" data-bible-compare-retry="${escapeHtml(id)}">Réessayer</button>` : id===currentTranslation ? `<small>lecture actuelle</small>` : ""}</div>`).join("");
      const rows=verseOrder.map((verse)=>{
        const cells=loaded.map(({id,data,error})=>{
          const label=translationMap.get(id)?.label || id;
          const text=data?.chapters?.[chapter]?.[verse];
          return `<div class="bible-reader-compare-cell${id===currentTranslation ? " is-current" : ""}${error ? " is-error" : ""}" data-label="${escapeHtml(label)}">${error ? `<span class="bible-reader-compare-missing">Indisponible</span>` : text ? escapeHtml(text) : `<span class="bible-reader-compare-missing">—</span>`}</div>`;
        }).join("");
        return `<div class="bible-reader-compare-row${currentVerse===verse ? " is-linked" : ""}" style="--compare-count:${cols}"><button type="button" class="bible-reader-compare-ref" data-bible-compare-verse="${escapeHtml(verse)}" title="Comparer ${escapeHtml(book.short)} ${escapeHtml(chapter)},${escapeHtml(verse)}">${escapeHtml(verse)}</button>${cells}</div>`;
      }).join("");
      compareContent.innerHTML=`<div class="bible-reader-compare-scroll"><div class="bible-reader-compare-grid" style="--compare-count:${cols}"><div class="bible-reader-compare-headrow"><span></span>${headers}</div>${rows}</div></div>`;
      compareContent.querySelectorAll("[data-bible-compare-verse]").forEach((button)=>button.addEventListener("click",()=>{
        compareVerse=button.dataset.bibleCompareVerse;
        setCompareMode("verse");
      }));
    }
    compareContent.querySelectorAll("[data-bible-compare-retry]").forEach((button)=>button.addEventListener("click",()=>retryCompareTranslation(button.dataset.bibleCompareRetry)));
  };

  const chapterOrderFor = (data,bookCode) => {
    if (Array.isArray(data?.order) && data.order.length) return data.order.map(String);
    const metaOrder = bookMap.get(bookCode)?.order || [];
    const keys = Object.keys(data?.chapters || {});
    const ordered = metaOrder.filter((id)=>keys.includes(String(id)));
    keys.forEach((id)=>{ if (!ordered.includes(String(id))) ordered.push(String(id)); });
    return ordered;
  };

  const buildRelated = (bookCode,chapterId) => {
    const items = relatedFor(bookCode,chapterId);
    if (!items.length) return "";
    return `<aside class="bible-reader-related" aria-label="Fiches liées sur le site"><span>À lire sur le site</span><div>${items.map((item)=>`<a href="${escapeHtml(item.href)}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.note || "")}</small><i aria-hidden="true">↗</i></a>`).join("")}</div></aside>`;
  };

  const verseHref = (bookCode,chapterId,verse) => urlFor({book:bookCode,translation:currentTranslation,chapter:chapterId,verse});

  // ------------------------------------------------------------
  // Contexte du passage — aperçu de trois versets avant/après.
  // L'aperçu est volontairement local : il ne modifie ni l'URL,
  // ni le livre/chapitre en cours, ni la position de lecture.
  // ------------------------------------------------------------
  const orderedVerseKeys = (verses={}) => Object.keys(verses).sort((a,b)=>{
    const na=Number(a),nb=Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na-nb;
    return String(a).localeCompare(String(b),"fr",{numeric:true,sensitivity:"base"});
  });

  const contextTranslationFor = (bookCode,preferred=currentTranslation) => {
    const available=new Set(bookMap.get(bookCode)?.translations || []);
    if (available.has(preferred)) return preferred;
    if (available.has("tob2010")) return "tob2010";
    if (available.has("jerusalem2019")) return "jerusalem2019";
    if (available.has("lsg1910")) return "lsg1910";
    return [...available][0] || preferred;
  };

  const contextWindowFor = (data,bookCode,chapterId,verse,radius=3) => {
    if (!data?.chapters) return [];
    const order=chapterOrderFor(data,bookCode);
    const flat=[];
    order.forEach((chapter)=>orderedVerseKeys(data.chapters?.[chapter] || {}).forEach((v)=>flat.push({
      chapter:String(chapter),verse:String(v),text:String(data.chapters[chapter][v] ?? "")
    })));
    const index=flat.findIndex((item)=>item.chapter===String(chapterId) && item.verse===String(verse));
    if (index<0) return [];
    return flat.slice(Math.max(0,index-radius),Math.min(flat.length,index+radius+1));
  };

  const contextPreviewMarkup = (bookCode,chapterId,verse,data,translation) => {
    const book=bookMap.get(bookCode);
    const rows=contextWindowFor(data,bookCode,chapterId,verse,3);
    if (!rows.length) return `<div class="bible-reader-context-empty">Contexte indisponible pour ce verset.</div>`;
    const targetRef=`${book?.short || bookCode} ${chapterId},${verse}`;
    const trLabel=translationMap.get(translation)?.label || translation;
    return `<div class="bible-reader-context-head"><div><span>Contexte du passage</span><strong>${escapeHtml(targetRef)}</strong></div><small>${escapeHtml(trLabel)}</small><button type="button" data-bible-context-close aria-label="Fermer le contexte">×</button></div><div class="bible-reader-context-verses">${rows.map((item)=>{
      const active=item.chapter===String(chapterId) && item.verse===String(verse);
      const href=urlFor({book:bookCode,translation,chapter:item.chapter,verse:item.verse});
      return `<a class="bible-reader-context-verse${active ? " is-target" : ""}" href="${escapeHtml(href)}"><small>${escapeHtml(book?.short || bookCode)} ${escapeHtml(item.chapter)},${escapeHtml(item.verse)}</small><span>${escapeHtml(item.text)}</span></a>`;
    }).join("")}</div><div class="bible-reader-context-foot"><span>3 versets avant · 3 après</span><a href="${escapeHtml(urlFor({book:bookCode,translation,chapter:chapterId,verse}))}">Ouvrir le passage <i aria-hidden="true">→</i></a></div>`;
  };

  const loadContextPreview = async (trigger) => {
    const slotId=trigger?.dataset?.bibleContextTarget;
    const slot=slotId ? document.getElementById(slotId) : null;
    if (!slot) return;
    const bookCode=trigger.dataset.contextBook;
    const chapter=String(trigger.dataset.contextChapter || "");
    const verse=String(trigger.dataset.contextVerse || "");
    if (!bookCode || !chapter || !verse) return;
    const open=slot.hidden;
    document.querySelectorAll("[data-bible-context-slot]").forEach((other)=>{
      if (other===slot) return;
      other.hidden=true;
      const otherTrigger=[...document.querySelectorAll("[data-bible-context-target]")].find((candidate)=>candidate.dataset.bibleContextTarget===other.id);
      otherTrigger?.setAttribute("aria-expanded","false");
    });
    if (!open) {slot.hidden=true;trigger.setAttribute("aria-expanded","false");return;}
    slot.hidden=false;
    trigger.setAttribute("aria-expanded","true");
    slot.innerHTML=`<div class="bible-reader-context-loading"><span></span>Chargement du contexte…</div>`;
    const translation=contextTranslationFor(bookCode,currentTranslation);
    try {
      const data=(bookCode===currentBook && translation===currentTranslation && currentData) ? currentData : await fetchBookData(translation,bookCode);
      slot.innerHTML=contextPreviewMarkup(bookCode,chapter,verse,data,translation);
      slot.querySelector("[data-bible-context-close]")?.addEventListener("click",()=>{slot.hidden=true;trigger.setAttribute("aria-expanded","false");});
    } catch (error) {
      console.error("Bible context:",error);
      slot.innerHTML=`<div class="bible-reader-context-empty">Le contexte n’a pas pu être chargé.</div>`;
    }
  };

  const buildCrossReferences = (bookCode,chapterId,verse) => {
    const refs=crossReferencesFor(bookCode,chapterId,verse);
    if (!refs.length) return "";
    const id=`xref-${bookCode}-${chapterId}-${verse}`;
    return `<button class="bible-reader-xref-toggle" type="button" data-bible-xref-toggle aria-expanded="false" aria-controls="${escapeHtml(id)}" aria-label="Afficher ${refs.length} référence${refs.length>1?"s":""} croisée${refs.length>1?"s":""}" title="${refs.length} référence${refs.length>1?"s":""} croisée${refs.length>1?"s":""}"><span aria-hidden="true">↔</span><small aria-hidden="true">${refs.length}</small></button>`;
  };

  const buildCrossReferencePanel = (bookCode,chapterId,verse) => {
    const refs=crossReferencesFor(bookCode,chapterId,verse);
    if (!refs.length) return "";
    const id=`xref-${bookCode}-${chapterId}-${verse}`;
    const unique=[];
    const seen=new Set();
    refs.forEach((ref)=>{
      const key=`${ref.target.book}:${ref.target.chapter}:${ref.target.verses}:${ref.type}`;
      if (seen.has(key)) return;
      seen.add(key);unique.push(ref);
    });
    return `<aside class="bible-reader-xrefs" id="${escapeHtml(id)}" data-bible-xref-panel hidden aria-label="Références croisées pour ${escapeHtml(bookMap.get(bookCode)?.short || bookCode)} ${escapeHtml(chapterId)},${escapeHtml(verse)}"><div class="bible-reader-xrefs-head"><span>Références croisées</span><small>${unique.length} lien${unique.length>1?"s":""}</small></div><div class="bible-reader-xrefs-list">${unique.slice(0,8).map((ref,index)=>{const targetVerse=firstVerseOf(ref.target.verses);const contextId=`xref-context-${bookCode}-${chapterId}-${verse}-${index}`;return `<div class="bible-reader-xref-entry"><div class="bible-reader-xref-row"><a class="bible-reader-xref bible-reader-xref--${escapeHtml(ref.type)}" href="${escapeHtml(xrefHref(ref.target))}"><span class="bible-reader-xref-type">${escapeHtml(xrefTypeLabel(ref.type))}</span><strong>${escapeHtml(refDisplay(ref.target))}</strong><small>${escapeHtml(ref.note)}</small><i aria-hidden="true">→</i></a><button class="bible-reader-context-trigger" type="button" data-bible-context-target="${escapeHtml(contextId)}" data-context-book="${escapeHtml(ref.target.book)}" data-context-chapter="${escapeHtml(ref.target.chapter)}" data-context-verse="${escapeHtml(targetVerse)}" aria-expanded="false" aria-controls="${escapeHtml(contextId)}" title="Voir 3 versets avant et après">Contexte</button></div><div class="bible-reader-context-preview" id="${escapeHtml(contextId)}" data-bible-context-slot hidden></div></div>`;}).join("")}</div></aside>`;
  };

  const buildChapter = (bookCode, chapterId, verses, {single=false}={}) => {
    const book = bookMap.get(bookCode);
    const moments = momentsFor(bookCode,chapterId);
    const verseHtml = Object.entries(verses || {}).map(([verse,text]) => {
      const heading = moments.has(verse)
        ? `<h3 class="bible-reader-moment" id="${escapeHtml(bookCode)}-${escapeHtml(chapterId)}-moment-${escapeHtml(verse)}"><span>${escapeHtml(moments.get(verse))}</span><small>${escapeHtml(book.short)} ${escapeHtml(chapterId)},${escapeHtml(verse)}</small></h3>`
        : "";
      const xrefToggle=buildCrossReferences(bookCode,chapterId,verse);
      const xrefPanel=buildCrossReferencePanel(bookCode,chapterId,verse);
      const contextId=`verse-context-${bookCode}-${chapterId}-${verse}`;
      const contextToggle=`<button class="bible-reader-self-context" type="button" data-bible-context-target="${escapeHtml(contextId)}" data-context-book="${escapeHtml(bookCode)}" data-context-chapter="${escapeHtml(chapterId)}" data-context-verse="${escapeHtml(verse)}" aria-expanded="false" aria-controls="${escapeHtml(contextId)}" title="Voir le contexte de ce verset">±3</button>`;
      return `${heading}<p class="bible-reader-verse" id="${escapeHtml(bookCode)}-${escapeHtml(chapterId)}-${escapeHtml(verse)}" data-bible-verse="${escapeHtml(verse)}"><sup><span class="bible-reader-verse-tools"><a class="bible-reader-verse-link" href="${escapeHtml(verseHref(bookCode,chapterId,verse))}" data-bible-verse-link="${escapeHtml(verse)}" aria-label="Lien permanent vers ${escapeHtml(book.short)} ${escapeHtml(chapterId)},${escapeHtml(verse)}">${escapeHtml(verse)}</a>${xrefToggle}${contextToggle}</span></sup><span>${escapeHtml(text)}</span></p>${xrefPanel}<div class="bible-reader-context-preview bible-reader-context-preview--verse" id="${escapeHtml(contextId)}" data-bible-context-slot hidden></div>`;
    }).join("");
    const footerNav = single ? `<nav class="bible-reader-inline-nav" aria-label="Continuer la lecture"><button type="button" data-inline-prev>← <span>Chapitre précédent</span></button><button type="button" data-inline-next><span>Chapitre suivant</span> →</button></nav>` : "";
    const title = titleFor(bookCode,chapterId);
    return `<article class="bible-reader-chapter${single ? " is-single" : ""}" id="${escapeHtml(bookCode)}-${escapeHtml(chapterId)}" data-bible-reader-chapter="${escapeHtml(chapterId)}"><header><span>${escapeHtml(book.label)} · ${escapeHtml(book.short)} ${escapeHtml(chapterId)}</span><h2>${escapeHtml(chapterLabelFor(bookCode,chapterId))}</h2>${title ? `<p>${escapeHtml(title)}</p>` : ""}</header>${buildRelated(bookCode,chapterId)}<div class="bible-reader-verses">${verseHtml || `<p class="bible-reader-empty">Aucun verset n’a pu être extrait pour cette section.</p>`}</div>${footerNav}</article>`;
  };

  const fillChapterSelect = () => {
    chapterSelect.innerHTML = currentOrder.map((id)=>{
      const title = titleFor(currentBook,id);
      const label = chapterLabelFor(currentBook,id);
      return `<option value="${escapeHtml(id)}">${escapeHtml(label)}${title ? ` — ${escapeHtml(title)}` : ""}</option>`;
    }).join("") + `<option value="all">Livre entier</option>`;
    chapterSelect.value = currentChapter === "all" ? "all" : String(currentChapter);
  };

  const buildChapterIndex = () => {
    if (!chapterIndex) return;
    chapterIndex.innerHTML = `<div class="bible-reader-chapter-index-head"><span>Aller directement à un chapitre</span><button type="button" data-bible-index-close aria-label="Fermer">×</button></div><div class="bible-reader-chapter-grid">${currentOrder.map((id)=>{const title=titleFor(currentBook,id);return `<button type="button" data-bible-goto="${escapeHtml(id)}" title="${escapeHtml(title)}"><strong>${escapeHtml(id)}</strong><span>${escapeHtml(title || chapterLabelFor(currentBook,id))}</span></button>`;}).join("")}</div>`;
    chapterIndex.querySelector("[data-bible-index-close]")?.addEventListener("click",()=>toggleIndex(false));
    chapterIndex.querySelectorAll("[data-bible-goto]").forEach((button)=>button.addEventListener("click",()=>goToChapter(button.dataset.bibleGoto,{push:true})));
  };

  const autoOutline = (book) => {
    const order = currentOrder.length ? currentOrder : (book.order || []);
    if (!order.length) return [];
    if (order.length <= 8) return [{from:order[0],to:order.at(-1),label:"Le livre en entier",note:`${order.length} chapitres/sections`}];
    const count = Math.min(5,Math.ceil(order.length/10));
    const size = Math.ceil(order.length/count);
    const result=[];
    for (let i=0;i<order.length;i+=size) {
      const slice=order.slice(i,i+size), first=slice[0], last=slice.at(-1);
      result.push({from:first,to:last,label:`${chapterLabelFor(book.code,first)} à ${chapterLabelFor(book.code,last)}`,note:titleFor(book.code,first) || "Repères du livre"});
    }
    return result;
  };

  const buildOutline = () => {
    const book=bookMap.get(currentBook);
    const items=(book.outline?.length ? book.outline : autoOutline(book)).filter((item)=>currentOrder.includes(String(item.from)));
    if (!items.length) return "";
    const currentPos=currentChapter === "all" ? -1 : currentOrder.indexOf(String(currentChapter));
    return `<nav class="bible-reader-outline" aria-label="Sommaire narratif de ${escapeHtml(book.label)}"><div class="bible-reader-outline-head"><span>Repères du livre</span><small>${escapeHtml(book.label)}</small></div><div class="bible-reader-outline-track">${items.map((item)=>{const fromPos=currentOrder.indexOf(String(item.from));const toPos=Math.max(fromPos,currentOrder.indexOf(String(item.to)));const active=currentPos>=fromPos&&currentPos<=toPos;const range=String(item.from)===String(item.to)?String(item.from):`${item.from}–${item.to}`;return `<button type="button" class="${active ? "is-active" : ""}" data-bible-outline="${escapeHtml(item.from)}"><small>${escapeHtml(range)}</small><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.note || "")}</span></button>`;}).join("")}</div></nav>`;
  };

  const wireOutline = () => content.querySelectorAll("[data-bible-outline]").forEach((button)=>button.addEventListener("click",()=>goToChapter(button.dataset.bibleOutline,{push:true})));

  const toggleIndex = (force) => {
    if (!chapterIndex || !currentButton) return;
    const open = typeof force === "boolean" ? force : chapterIndex.hidden;
    chapterIndex.hidden = !open;
    currentButton.setAttribute("aria-expanded",open ? "true":"false");
  };
  const chapterPosition = (id=currentChapter) => currentOrder.indexOf(String(id));

  const updateNav = () => {
    if (!currentData || !navWrap) return;
    const all=currentChapter === "all";
    const pos=all ? -1 : chapterPosition();
    navWrap.hidden=false;
    if (currentLabel) currentLabel.textContent=all ? "Livre entier" : `${pos+1} / ${currentOrder.length}`;
    if (currentTitle) currentTitle.textContent=all ? `${bookMap.get(currentBook).label} · ${currentOrder.length} chapitres/sections` : (titleFor(currentBook,currentChapter) || chapterLabelFor(currentBook,currentChapter));
    if (prevButton) prevButton.disabled=all || pos<=0;
    if (nextButton) nextButton.disabled=all || pos<0 || pos>=currentOrder.length-1;
    chapterIndex?.querySelectorAll("[data-bible-goto]").forEach((button)=>button.classList.toggle("is-active",!all && button.dataset.bibleGoto===String(currentChapter)));
    updateFloatingNav();
    updateFloatingVisibility();
  };

  const clearVerseHighlight = () => {
    content.querySelectorAll(".bible-reader-verse.is-linked").forEach((node)=>node.classList.remove("is-linked"));
  };

  const focusVerse = (verse,{smooth=true,updateUrl=true,push=false}={}) => {
    if (!verse || currentChapter === "all") return false;
    const target=document.getElementById(`${currentBook}-${currentChapter}-${verse}`);
    if (!target) return false;
    currentVerse=String(verse);
    clearVerseHighlight();
    target.classList.add("is-linked");
    if (updateUrl) setUrl({verse:currentVerse},push);
    if (compareIsOpen) { compareVerse=currentVerse; renderCompare(); }
    setTimeout(()=>target.scrollIntoView({behavior:smooth ? "smooth":"auto",block:"center"}),25);
    return true;
  };

  const goByOffset = (delta,{push=true}={}) => {
    if (!currentData || currentChapter === "all") return;
    const target=currentOrder[chapterPosition()+delta];
    if (target != null) goToChapter(target,{push});
  };

  const wireInlineNav = () => {
    const prev=content.querySelector("[data-inline-prev]");
    const next=content.querySelector("[data-inline-next]");
    const pos=chapterPosition();
    if (prev) {prev.disabled=pos<=0;prev.addEventListener("click",()=>goByOffset(-1,{push:true}));}
    if (next) {next.disabled=pos>=currentOrder.length-1;next.addEventListener("click",()=>goByOffset(1,{push:true}));}
  };

  const wireVerseLinks = () => content.querySelectorAll("[data-bible-verse-link]").forEach((link)=>link.addEventListener("click",(event)=>{
    event.preventDefault();
    focusVerse(link.dataset.bibleVerseLink,{smooth:true,updateUrl:true,push:true});
  }));

  const closeCrossReferences = (except=null) => {
    content.querySelectorAll("[data-bible-xref-panel]").forEach((panel)=>{
      if (panel===except) return;
      panel.hidden=true;
      const button=panel.previousElementSibling?.querySelector?.("[data-bible-xref-toggle]");
      button?.setAttribute("aria-expanded","false");
    });
  };

  const wireCrossReferences = () => {
    content.querySelectorAll("[data-bible-xref-toggle]").forEach((button)=>button.addEventListener("click",(event)=>{
      event.preventDefault();event.stopPropagation();
      const id=button.getAttribute("aria-controls");
      const panel=id ? document.getElementById(id) : null;
      if (!panel) return;
      const open=panel.hidden;
      closeCrossReferences(open ? panel : null);
      panel.hidden=!open;
      button.setAttribute("aria-expanded",open ? "true":"false");
      if (open) panel.scrollIntoView({behavior:"smooth",block:"nearest"});
    }));
    content.querySelectorAll(".bible-reader-xref").forEach((link)=>link.addEventListener("click",()=>closeCrossReferences()));
  };

  const translationLabel = () => translationMap.get(currentTranslation)?.label || currentTranslation;

  const render = (data,chapterId,{verse=null}={}) => {
    currentData=data;
    currentOrder=chapterOrderFor(data,currentBook);
    if (!currentOrder.length) throw new Error("Aucun chapitre");
    if (chapterId !== "all" && !currentOrder.includes(String(chapterId))) chapterId=currentOrder[0];
    currentChapter=chapterId === "all" ? "all" : String(chapterId);
    currentVerse=verse ? String(verse) : null;
    fillChapterSelect();
    buildChapterIndex();
    const book=bookMap.get(currentBook);
    const bookHead=`<div class="bible-reader-book-head${currentChapter === "all" ? "" : " bible-reader-book-head--compact"}"><span>${escapeHtml(book.groupLabel)}</span><h2>${escapeHtml(book.label)}</h2><p>${currentOrder.length} chapitres/sections · ${escapeHtml(translationLabel())}</p></div>${buildOutline()}`;
    if (currentChapter === "all") {
      content.innerHTML=bookHead+currentOrder.map((id)=>buildChapter(currentBook,id,data.chapters[id])).join("");
      if (status) status.textContent=`${book.label} · ${currentOrder.length} chapitres`;
    } else {
      content.innerHTML=bookHead+buildChapter(currentBook,currentChapter,data.chapters[currentChapter],{single:true});
      if (status) status.textContent=`${book.label} · ${chapterLabelFor(currentBook,currentChapter)}`;
      wireInlineNav();
    }
    wireOutline();
    wireVerseLinks();
    wireCrossReferences();
    content.setAttribute("aria-busy","false");
    updateNav();
    updateProgress();
    if (compareIsOpen) renderCompare();
    if (currentVerse) setTimeout(()=>focusVerse(currentVerse,{smooth:false,updateUrl:false}),45);
  };

  const goToChapter = (chapterId,{push=false,scroll=true,verse=null}={}) => {
    if (!currentData) return;
    const target=String(chapterId);
    if (!currentOrder.includes(target)) return;
    currentVerse=verse ? String(verse) : null;
    render(currentData,target,{verse:currentVerse});
    setUrl({chapter:target,verse:currentVerse},push);
    toggleIndex(false);
    if (scroll && !currentVerse) setTimeout(()=>document.querySelector(".bible-reader-chapter")?.scrollIntoView({behavior:"smooth",block:"start"}),30);
  };

  const showError = (message="Le texte n’a pas pu être chargé.") => {
    content.setAttribute("aria-busy","false");
    if (status) status.textContent="Indisponible";
    content.innerHTML=`<div class="bible-reader-error"><strong>${escapeHtml(message)}</strong><p>Essaie une autre traduction ou recharge la page.</p></div>`;
    if (navWrap) navWrap.hidden=true;
  };

  const load = async ({book=currentBook,translation=currentTranslation,chapter="1",verse=null,push=false,scroll=false}={}) => {
    currentBook=book;
    bookSelect.value=book;
    currentTranslation=refreshTranslationAvailability(translation);
    const source=sourceFor(currentTranslation,currentBook);
    if (!source) return showError("Cette traduction n’est pas disponible pour ce livre.");
    if (status) status.textContent="Chargement…";
    content.setAttribute("aria-busy","true");
    content.innerHTML=`<div class="bible-reader-loading"><span></span><p>Chargement de ${escapeHtml(bookMap.get(currentBook).label)}…</p></div>`;
    if (navWrap) navWrap.hidden=true;
    try {
      const data=await fetchBookData(currentTranslation,currentBook);
      render(data,chapter,{verse});
      setUrl({book:currentBook,translation:currentTranslation,chapter:currentChapter,verse:currentVerse},push);
      if (scroll && !verse) setTimeout(()=>document.querySelector(".bible-reader-content")?.scrollIntoView({behavior:"smooth",block:"start"}),20);
    } catch (error) {
      console.error("Bible reader:",error);
      showError(currentTranslation === "lsg1910" ? "La source Louis Segond 1910 n’a pas pu être chargée." : "Le fichier de cette traduction n’a pas pu être chargé.");
    }
  };

  const toggleSearch = (force) => {
    if (!searchPanel || !searchToggle) return;
    const open=typeof force === "boolean" ? force : searchPanel.hidden;
    searchPanel.hidden=!open;
    searchToggle.setAttribute("aria-expanded",open ? "true":"false");
    if (open) {
      if (compareIsOpen) toggleCompare(false);
      toggleCollections(false);
      setTimeout(()=>searchInput?.focus(),20);
    }
  };

  const searchMatches = (text,tokens) => {
    const hay=normalize(text);
    return tokens.every((token)=>hay.includes(token));
  };

  const runSearch = async (query,scope="all") => {
    if (!searchResults || !searchStatus) return;
    const q=query.trim();
    if (q.length < 2) {searchStatus.textContent="Saisis au moins deux caractères.";searchResults.innerHTML="";return;}
    const run=++searchRun;
    const tokens=normalize(q).split(" ").filter(Boolean);
    const books=(scope === "book" ? [currentBook] : meta.books.filter((book)=>book.translations?.includes(currentTranslation)).map((book)=>book.code));
    searchResults.innerHTML="";
    searchStatus.textContent=`Recherche dans ${scope === "book" ? bookMap.get(currentBook).label : "toute la Bible"}…`;
    const matches=[];
    let cursor=0,done=0;
    const worker=async()=>{
      while (cursor<books.length && run===searchRun) {
        const code=books[cursor++];
        let data=null;
        try {data=await fetchBookData(currentTranslation,code);} catch {done++;continue;}
        if (run!==searchRun) return;
        const order=chapterOrderFor(data,code);
        order.forEach((chapterId)=>{
          const title=titleFor(code,chapterId);
          if (title && searchMatches(title,tokens)) matches.push({kind:"repere",book:code,chapter:String(chapterId),verse:null,text:title});
          const moments=momentsFor(code,chapterId);
          moments.forEach((label,verse)=>{if (searchMatches(label,tokens)) matches.push({kind:"repere",book:code,chapter:String(chapterId),verse:String(verse),text:label});});
          Object.entries(data?.chapters?.[chapterId] || {}).forEach(([verse,text])=>{if (searchMatches(text,tokens)) matches.push({kind:"verset",book:code,chapter:String(chapterId),verse:String(verse),text:String(text)});});
        });
        done++;
        if (run===searchRun) searchStatus.textContent=`Recherche… ${done} / ${books.length} livres`;
      }
    };
    await Promise.all(Array.from({length:Math.min(6,books.length)},worker));
    if (run!==searchRun) return;
    const seen=new Set();
    const clean=matches.filter((item)=>{const key=`${item.book}:${item.chapter}:${item.verse || ""}:${item.kind}`;if(seen.has(key))return false;seen.add(key);return true;});
    clean.sort((a,b)=>{
      const br=(bookRank.get(a.book)||0)-(bookRank.get(b.book)||0);if(br)return br;
      const order=bookMap.get(a.book)?.order || [];const ca=order.indexOf(a.chapter),cb=order.indexOf(b.chapter);if(ca!==cb)return ca-cb;
      return (parseInt(a.verse,10)||0)-(parseInt(b.verse,10)||0);
    });
    const limited=clean.slice(0,120);
    searchStatus.textContent=clean.length ? `${clean.length} résultat${clean.length>1?"s":""}${clean.length>120?" · 120 affichés":""}` : "Aucun résultat.";
    searchResults.innerHTML=limited.map((item,index)=>{const book=bookMap.get(item.book);const ref=`${book.short} ${item.chapter}${item.verse ? `,${item.verse}`:""}`;const excerpt=item.text.length>210 ? `${item.text.slice(0,207)}…` : item.text;const contextId=`search-context-${index}`;return `<div class="bible-reader-search-result-wrap"><div class="bible-reader-search-result-row"><button type="button" class="bible-reader-search-result" data-search-book="${escapeHtml(item.book)}" data-search-chapter="${escapeHtml(item.chapter)}" ${item.verse ? `data-search-verse="${escapeHtml(item.verse)}"` : ""}><span><strong>${escapeHtml(ref)}</strong><small>${item.kind === "repere" ? "Repère" : escapeHtml(book.label)}</small></span><p>${escapeHtml(excerpt)}</p><i aria-hidden="true">→</i></button>${item.verse ? `<button class="bible-reader-context-trigger bible-reader-context-trigger--search" type="button" data-bible-context-target="${escapeHtml(contextId)}" data-context-book="${escapeHtml(item.book)}" data-context-chapter="${escapeHtml(item.chapter)}" data-context-verse="${escapeHtml(item.verse)}" aria-expanded="false" aria-controls="${escapeHtml(contextId)}" title="Voir le contexte sans quitter les résultats">Contexte</button>` : ""}</div>${item.verse ? `<div class="bible-reader-context-preview bible-reader-context-preview--search" id="${escapeHtml(contextId)}" data-bible-context-slot hidden></div>` : ""}</div>`;}).join("");
    searchResults.querySelectorAll("[data-search-book]").forEach((button)=>button.addEventListener("click",async()=>{
      const book=button.dataset.searchBook,chapter=button.dataset.searchChapter,verse=button.dataset.searchVerse || null;
      toggleSearch(false);
      if (book===currentBook) goToChapter(chapter,{push:true,scroll:!verse,verse});
      else await load({book,translation:currentTranslation,chapter,verse,push:true,scroll:!verse});
    }));
  };


  // ------------------------------------------------------------
  // Collections transversales — prières et paraboles.
  // Elles servent de porte d'entrée thématique : le texte reste chargé
  // à la demande, dans la traduction courante lorsqu'elle existe.
  // ------------------------------------------------------------
  const traditionLabel = (value) => ({
    "canon-commun":"Canon commun",
    "deuterocanonique":"Deutérocanonique",
    "supplementaire":"Traditions orthodoxes"
  }[value] || value || "");

  const collectionSectionFor = (item) => {
    if (item.tradition === "deuterocanonique") return "deuterocanonique";
    if (item.tradition === "supplementaire") return "supplementaire";
    if (item.section === "ancien" || item.section === "nouveau") return item.section;
    const first=item.refs?.[0]?.book;
    const group=bookMap.get(first)?.groupLabel || "";
    return group.startsWith("Nouveau Testament") ? "nouveau" : "ancien";
  };

  const collectionRefDisplay = (ref) => {
    const book=bookMap.get(ref.book);
    return `${book?.short || ref.book} ${ref.chapter}${ref.verses ? `,${String(ref.verses).replace(/-/g,"–")}` : ""}`;
  };

  const collectionPreferredTranslation = (bookCode) => {
    const available=new Set(bookMap.get(bookCode)?.translations || []);
    if (available.has(currentTranslation)) return currentTranslation;
    if (available.has("tob2010")) return "tob2010";
    if (available.has("jerusalem2019")) return "jerusalem2019";
    if (available.has("lsg1910")) return "lsg1910";
    return [...available][0] || currentTranslation;
  };

  const rangeVerseKeys = (versesObj,range) => {
    const keys=orderedVerseKeys(versesObj || {});
    const raw=String(range || "");
    if (!raw) return keys;
    const [a,b]=raw.split("-");
    const start=keys.indexOf(String(a));
    if (start<0) return keys.filter((v)=>String(v)===String(a));
    if (!b) return [keys[start]];
    if (b === "end") return keys.slice(start);
    const end=keys.indexOf(String(b));
    if (end>=start) return keys.slice(start,end+1);
    const limit=Number(b);
    if (Number.isFinite(limit)) return keys.slice(start).filter((v)=>{const n=Number(v);return Number.isFinite(n) && n<=limit;});
    return [keys[start]];
  };

  const collectionPassageMarkup = async (item,refIndex=0) => {
    const refs=item.joined ? (item.refs || []) : [item.refs?.[refIndex] || item.refs?.[0]].filter(Boolean);
    const chunks=[];
    for (const ref of refs) {
      const translation=collectionPreferredTranslation(ref.book);
      try {
        const data=await fetchBookData(translation,ref.book);
        const chapter=data?.chapters?.[String(ref.chapter)] || {};
        const keys=rangeVerseKeys(chapter,ref.verses);
        const book=bookMap.get(ref.book);
        const first=keys[0] || firstVerseOf(ref.verses);
        chunks.push(`<section class="bible-reader-collection-passage"><header><strong>${escapeHtml(collectionRefDisplay(ref))}</strong><span>${escapeHtml(translationMap.get(translation)?.label || translation)}</span></header><div>${keys.map((verse)=>`<p><sup>${escapeHtml(verse)}</sup>${escapeHtml(chapter[verse] || "")}</p>`).join("") || `<p class="bible-reader-collection-empty">Passage indisponible.</p>`}</div><a href="${escapeHtml(urlFor({book:ref.book,translation,chapter:String(ref.chapter),verse:first}))}">Ouvrir dans le lecteur <span aria-hidden="true">→</span></a></section>`);
      } catch {
        chunks.push(`<section class="bible-reader-collection-passage is-error"><header><strong>${escapeHtml(collectionRefDisplay(ref))}</strong></header><p>Le texte n’a pas pu être chargé.</p></section>`);
      }
    }
    return chunks.join("");
  };

  const rebuildCollectionTypeFilter = () => {
    if (!collectionsType || !collectionsData?.[collectionKind]) return;
    const previous=collectionsType.value || "all";
    const types=[...new Set(collectionsData[collectionKind].items.map((item)=>item.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"fr",{sensitivity:"base"}));
    collectionsType.innerHTML=`<option value="all">Tous les types</option>${types.map((type)=>`<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}`;
    collectionsType.value=types.includes(previous) ? previous : "all";
  };

  const renderCollections = () => {
    if (!collectionsList || !collectionsStatus || !collectionsData?.[collectionKind]) return;
    const collection=collectionsData[collectionKind];
    const q=normalize(collectionsSearch?.value || "");
    const tokens=q.split(" ").filter(Boolean);
    const section=collectionsSection?.value || "all";
    const type=collectionsType?.value || "all";
    if (collectionsDescription) collectionsDescription.textContent=collection.description || "";
    const items=collection.items.filter((item)=>{
      if (section!=="all" && collectionSectionFor(item)!==section) return false;
      if (type!=="all" && item.type!==type) return false;
      if (!tokens.length) return true;
      const hay=normalize([item.title,item.speaker,item.type,item.note,traditionLabel(item.tradition),...(item.refs||[]).map(collectionRefDisplay)].filter(Boolean).join(" "));
      return tokens.every((token)=>hay.includes(token));
    });
    collectionsStatus.textContent=`${items.length} ${collectionKind === "prayers" ? `prière${items.length>1?"s":""}` : `entrée${items.length>1?"s":""}`} affichée${items.length>1?"s":""} · ${collection.items.length} au total`;
    collectionsList.innerHTML=items.map((item)=>{
      const refs=item.refs || [];
      const metaBits=[item.speaker,item.type,traditionLabel(item.tradition)].filter(Boolean);
      return `<article class="bible-reader-collection-item" data-collection-item="${escapeHtml(item.id)}"><div class="bible-reader-collection-item-main"><div class="bible-reader-collection-copy"><span>${escapeHtml(metaBits.join(" · "))}</span><h3>${escapeHtml(item.title)}</h3>${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}</div><button type="button" class="bible-reader-collection-read" data-collection-read aria-expanded="false">Lire</button></div><div class="bible-reader-collection-refs">${refs.map((ref,index)=>`<button type="button" data-collection-ref="${index}" title="Prévisualiser ${escapeHtml(collectionRefDisplay(ref))}">${escapeHtml(collectionRefDisplay(ref))}</button>`).join("")}</div><div class="bible-reader-collection-preview" data-collection-preview hidden></div></article>`;
    }).join("") || `<div class="bible-reader-collections-empty">Aucun résultat avec ces filtres.</div>`;

    collectionsList.querySelectorAll("[data-collection-item]").forEach((card)=>{
      const id=card.dataset.collectionItem;
      const item=collection.items.find((entry)=>entry.id===id);
      const preview=card.querySelector("[data-collection-preview]");
      const read=card.querySelector("[data-collection-read]");
      let activeRef=0;
      const openPreview=async(refIndex=activeRef)=>{
        if (!item || !preview || !read) return;
        activeRef=Number(refIndex)||0;
        const run=++collectionRun;
        preview.dataset.loadRun=String(run);
        preview.hidden=false;
        read.setAttribute("aria-expanded","true");
        read.textContent="Fermer";
        preview.innerHTML=`<div class="bible-reader-compare-loading"><span></span>Chargement du passage…</div>`;
        const markup=await collectionPassageMarkup(item,activeRef);
        if (preview.dataset.loadRun===String(run) && !preview.hidden) preview.innerHTML=markup;
        card.querySelectorAll("[data-collection-ref]").forEach((b)=>b.classList.toggle("is-active",Number(b.dataset.collectionRef)===activeRef));
      };
      read?.addEventListener("click",()=>{
        if (!preview.hidden) {preview.hidden=true;read.setAttribute("aria-expanded","false");read.textContent="Lire";card.querySelectorAll("[data-collection-ref]").forEach((b)=>b.classList.remove("is-active"));}
        else openPreview(activeRef);
      });
      card.querySelectorAll("[data-collection-ref]").forEach((button)=>button.addEventListener("click",()=>openPreview(button.dataset.collectionRef)));
    });
  };

  const setCollectionKind = (kind) => {
    if (!collectionsData?.[kind]) return;
    collectionKind=kind;
    collectionTabs.forEach((button)=>{
      const active=button.dataset.bibleCollection===kind;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-selected",active ? "true":"false");
    });
    if (collectionsSearch) collectionsSearch.value="";
    if (collectionsSection) collectionsSection.value="all";
    rebuildCollectionTypeFilter();
    renderCollections();
  };

  const toggleCollections = (force) => {
    if (!collectionsPanel || !collectionsToggle) return;
    const open=typeof force === "boolean" ? force : collectionsPanel.hidden;
    collectionsIsOpen=open;
    collectionsPanel.hidden=!open;
    collectionsToggle.setAttribute("aria-expanded",open ? "true":"false");
    if (open) {
      toggleSearch(false);
      if (compareIsOpen) toggleCompare(false);
      if (!collectionsData) {
        if (collectionsStatus) collectionsStatus.textContent="Chargement des collections…";
        return;
      }
      rebuildCollectionTypeFilter();
      renderCollections();
      setTimeout(()=>collectionsSearch?.focus(),20);
    } else {
      collectionRun++;
    }
  };

  const init = async () => {
    try {
      const [response,collectionsResponse]=await Promise.all([
        fetch(META_URL,{cache:"force-cache"}),
        fetch(COLLECTIONS_URL,{cache:"force-cache"}).catch(()=>null)
      ]);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      meta=await response.json();
      if (collectionsResponse?.ok) collectionsData=await collectionsResponse.json();
      bookMap=new Map(meta.books.map((book)=>[book.code,book]));
      translationMap=new Map(meta.translations.map((tr)=>[tr.id,tr]));
      bookRank=new Map(meta.books.map((book,index)=>[book.code,index]));
      restoreComparePrefs();
      setCompareMode(compareMode,{persist:false,render:false});
      if (collectionsData) { rebuildCollectionTypeFilter(); renderCollections(); }
      try { landmarksVisible = localStorage.getItem("fvBibleLandmarks") !== "0"; } catch { landmarksVisible = true; }
      setLandmarksVisible(landmarksVisible,{persist:false});
      buildBookSelect();buildTranslationSelect();
      const state=queryState();
      bookSelect.value=state.book;translationSelect.value=state.translation;refreshTranslationAvailability(state.translation);
      await load({book:state.book,translation:translationSelect.value,chapter:state.chapter,verse:state.verse,push:false});
    } catch (error) {console.error("Bible reader init:",error);showError("Le lecteur biblique n’a pas pu être initialisé.");}
  };

  chapterSelect.addEventListener("change",()=>{
    if (!currentData) return;
    currentVerse=null;
    if (chapterSelect.value === "all") {render(currentData,"all");setUrl({chapter:"all",verse:null},true);toggleIndex(false);setTimeout(()=>document.querySelector(".bible-reader-content")?.scrollIntoView({behavior:"smooth",block:"start"}),20);} else goToChapter(chapterSelect.value,{push:true});
  });
  bookSelect.addEventListener("change",()=>{const translation=refreshTranslationAvailability(translationSelect.value);load({book:bookSelect.value,translation,chapter:"1",verse:null,push:true,scroll:true});});
  translationSelect.addEventListener("change",()=>{if(translationNote)translationNote.textContent=translationMap.get(translationSelect.value)?.note||"";load({book:bookSelect.value,translation:translationSelect.value,chapter:currentChapter === "all" ? "1" : currentChapter,verse:currentVerse,push:true,scroll:false});});
  prevButton?.addEventListener("click",()=>goByOffset(-1,{push:true}));
  nextButton?.addEventListener("click",()=>goByOffset(1,{push:true}));
  currentButton?.addEventListener("click",()=>toggleIndex());
  searchToggle?.addEventListener("click",()=>toggleSearch());
  searchClose?.addEventListener("click",()=>toggleSearch(false));
  searchForm?.addEventListener("submit",(event)=>{event.preventDefault();runSearch(searchInput?.value||"",searchScope?.value||"all");});
  landmarksToggle?.addEventListener("click",()=>setLandmarksVisible(!landmarksVisible));
  compareToggle?.addEventListener("click",()=>toggleCompare());
  compareClose?.addEventListener("click",()=>toggleCompare(false));
  compareModeButtons.forEach((button)=>button.addEventListener("click",()=>setCompareMode(button.dataset.bibleCompareMode)));
  comparePrevVerse?.addEventListener("click",()=>{
    if (!currentChapter || currentChapter === "all") return;
    const usable=[currentData ? {data:currentData} : null].filter(Boolean);
    const order=compareVerseOrderFor(usable,String(currentChapter));
    const pos=order.indexOf(String(compareVerse));
    if (pos>0) {compareVerse=order[pos-1];renderCompare();}
  });
  compareNextVerse?.addEventListener("click",()=>{
    if (!currentChapter || currentChapter === "all") return;
    const usable=[currentData ? {data:currentData} : null].filter(Boolean);
    const order=compareVerseOrderFor(usable,String(currentChapter));
    const pos=order.indexOf(String(compareVerse));
    if (pos>=0 && pos<order.length-1) {compareVerse=order[pos+1];renderCompare();}
  });
  compareFocusRef?.addEventListener("click",()=>{
    if (!compareVerse) return;
    toggleCompare(false);
    focusVerse(compareVerse,{smooth:true,updateUrl:true,push:true});
  });
  collectionsToggle?.addEventListener("click",()=>toggleCollections());
  collectionsClose?.addEventListener("click",()=>toggleCollections(false));
  collectionTabs.forEach((button)=>button.addEventListener("click",()=>setCollectionKind(button.dataset.bibleCollection)));
  collectionsSearch?.addEventListener("input",renderCollections);
  collectionsSection?.addEventListener("change",renderCollections);
  collectionsType?.addEventListener("change",renderCollections);
  floatingPrev?.addEventListener("click",()=>goByOffset(-1,{push:true}));
  floatingNext?.addEventListener("click",()=>goByOffset(1,{push:true}));
  floatingCurrent?.addEventListener("click",()=>document.querySelector(".bible-reader-chapter")?.scrollIntoView({behavior:"smooth",block:"start"}));

  document.addEventListener("keydown",(event)=>{
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const target=event.target;
    if (target instanceof HTMLElement && (target.matches("input,select,textarea,[contenteditable='true']") || target.closest("input,select,textarea,[contenteditable='true']"))) return;
    if (!currentData || currentChapter === "all") return;
    const delta=event.key === "ArrowLeft" ? -1 : 1,pos=chapterPosition();
    if ((delta<0&&pos<=0)||(delta>0&&pos>=currentOrder.length-1)) return;
    event.preventDefault();goByOffset(delta,{push:true});
  });

  document.addEventListener("click",(event)=>{
    const element=event.target instanceof Element ? event.target : null;
    const contextTrigger=element?.closest("[data-bible-context-target]");
    if (contextTrigger) {
      event.preventDefault();
      event.stopPropagation();
      loadContextPreview(contextTrigger);
      return;
    }
    if(chapterIndex&&!chapterIndex.hidden&&navWrap&&!navWrap.contains(event.target))toggleIndex(false);
    if (!element || !element.closest(".bible-reader-xrefs,[data-bible-xref-toggle],[data-bible-context-slot]")) closeCrossReferences();
  });
  window.addEventListener("scroll",()=>{updateProgress();updateFloatingVisibility();updateControlsCondensed();},{passive:true});
  window.addEventListener("resize",()=>{updateProgress();updateFloatingVisibility();updateControlsCondensed();});
  window.addEventListener("popstate",()=>{
    if (!meta) return;
    const state=queryState();
    if (state.book!==currentBook || state.translation!==currentTranslation) {bookSelect.value=state.book;translationSelect.value=state.translation;load({book:state.book,translation:state.translation,chapter:state.chapter,verse:state.verse,push:false});}
    else if (currentData && state.chapter!==currentChapter) goToChapter(state.chapter,{push:false,scroll:!state.verse,verse:state.verse});
    else if (currentData && state.verse!==currentVerse) {if(state.verse)focusVerse(state.verse,{smooth:false,updateUrl:false});else{currentVerse=null;clearVerseHighlight();if(compareIsOpen)renderCompare();}}
  });
  init();
  requestAnimationFrame(updateControlsCondensed);
})();

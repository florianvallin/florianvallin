(() => {
  "use strict";

  // Animations communes : on évite les ouvertures/fermetures instantanées.
  const DISCLOSURE_DURATION = 360;
  const DISCLOSURE_EASING = "cubic-bezier(.22,.75,.2,1)";

  const animatePanel = (panel, opening, onFinish = null) => {
    if (!panel) return;
    if (panel._fvAnimation) panel._fvAnimation.cancel();

    if (opening) {
      panel.hidden = false;
      panel.style.overflow = "hidden";
      const endHeight = panel.scrollHeight;
      panel._fvAnimation = panel.animate(
        [
          { height:"0px", opacity:0, transform:"translateY(-5px)" },
          { height:`${endHeight}px`, opacity:1, transform:"translateY(0)" }
        ],
        { duration:DISCLOSURE_DURATION, easing:DISCLOSURE_EASING }
      );
      panel._fvAnimation.onfinish = () => {
        panel.style.removeProperty("overflow");
        panel._fvAnimation = null;
        if (onFinish) onFinish();
      };
    } else {
      panel.style.overflow = "hidden";
      const startHeight = panel.getBoundingClientRect().height;
      panel._fvAnimation = panel.animate(
        [
          { height:`${startHeight}px`, opacity:1, transform:"translateY(0)" },
          { height:"0px", opacity:0, transform:"translateY(-5px)" }
        ],
        { duration:DISCLOSURE_DURATION - 40, easing:DISCLOSURE_EASING }
      );
      panel._fvAnimation.onfinish = () => {
        panel.hidden = true;
        panel.style.removeProperty("overflow");
        panel._fvAnimation = null;
        if (onFinish) onFinish();
      };
    }
  };

  const enhanceDetails = (details) => {
    const summary = details.querySelector(":scope > summary");
    const panel = summary?.nextElementSibling;
    if (!summary || !panel) return;

    let animation = null;
    let closing = false;
    let expanding = false;

    const cleanup = (open) => {
      details.open = open;
      details.style.removeProperty("height");
      details.style.removeProperty("overflow");
      animation = null;
      closing = false;
      expanding = false;
    };

    const close = () => {
      if (animation) animation.cancel();
      closing = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight}px`;
      details.style.overflow = "hidden";
      panel.animate(
        [{ opacity:1, transform:"translateY(0)" }, { opacity:0, transform:"translateY(-4px)" }],
        { duration:260, easing:DISCLOSURE_EASING }
      );
      animation = details.animate(
        { height:[startHeight,endHeight] },
        { duration:DISCLOSURE_DURATION, easing:DISCLOSURE_EASING }
      );
      animation.onfinish = () => cleanup(false);
      animation.oncancel = () => { closing = false; };
    };

    const open = () => {
      if (animation) animation.cancel();
      expanding = true;
      const startHeight = `${details.offsetHeight}px`;
      details.open = true;
      requestAnimationFrame(() => {
        const endHeight = `${summary.offsetHeight + panel.offsetHeight}px`;
        details.style.height = startHeight;
        details.style.overflow = "hidden";
        panel.animate(
          [{ opacity:0, transform:"translateY(-4px)" }, { opacity:1, transform:"translateY(0)" }],
          { duration:DISCLOSURE_DURATION, easing:DISCLOSURE_EASING }
        );
        animation = details.animate(
          { height:[startHeight,endHeight] },
          { duration:DISCLOSURE_DURATION, easing:DISCLOSURE_EASING }
        );
        animation.onfinish = () => cleanup(true);
        animation.oncancel = () => { expanding = false; };
      });
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      details.style.overflow = "hidden";
      if (closing || !details.open) open();
      else if (expanding || details.open) close();
    });
  };

  document.querySelectorAll(".bible-chrono-period").forEach(enhanceDetails);
  document.querySelectorAll(".bible-resource-group").forEach(enhanceDetails);

  // ------------------------------------------------------------
  // Recherche rapide dans la chronologie : année / siècle / mot-clé
  // ------------------------------------------------------------
  const chronoSearchRoot = document.querySelector("[data-chrono-search]");
  if (chronoSearchRoot) {
    const input = chronoSearchRoot.querySelector("[data-chrono-search-input]");
    const button = chronoSearchRoot.querySelector("[data-chrono-search-button]");
    const feedback = chronoSearchRoot.querySelector("[data-chrono-search-feedback]");
    const periods = [...document.querySelectorAll(".bible-chrono-period")];

    const romanToInt = roman => {
      const map = {I:1,V:5,X:10,L:50,C:100};
      let total = 0, prev = 0;
      roman = (roman || "").toUpperCase();
      for (let i = roman.length - 1; i >= 0; i -= 1) {
        const val = map[roman[i]] || 0;
        if (val < prev) total -= val; else { total += val; prev = val; }
      }
      return total;
    };
    const parseCentury = value => {
      const norm = value.toLowerCase().replace(/è/g,"e").replace(/é/g,"e");
      const m = norm.match(/\b((?:[ivxlc]+)|(?:\d+))(?:er|e)?\s*s(?:iecle)?\b/);
      if (!m) return null;
      const raw = m[1];
      const century = /^\d+$/.test(raw) ? parseInt(raw,10) : romanToInt(raw);
      if (!century) return null;
      const isBC = /av|avant|bc|bce/.test(norm);
      return isBC ? -(century * 100 - 50) : ((century - 1) * 100 + 50);
    };
    const parseYear = value => {
      const norm = value.toLowerCase().replace(/−/g,"-").trim();
      const centuryYear = parseCentury(norm);
      if (centuryYear !== null) return centuryYear;
      const number = norm.match(/-?\d{1,4}/);
      if (!number) return null;
      let year = parseInt(number[0],10);
      if (year > 0 && /av|avant|bc|bce/.test(norm)) year *= -1;
      return year;
    };
    const resolveIndex = value => {
      const norm = value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();
      if (!norm) return null;
      const year = parseYear(norm);
      if (year !== null) {
        if (year <= -1700) return 0;
        if (year <= -933) return 1;
        if (year <= -538) return 2;
        if (year < 0) return 3;
        return 4;
      }
      if (/(genese|origines|patriarch|abraham|isaac|jacob|joseph|babel|deluge)/.test(norm)) return 0;
      if (/(exode|moise|sinai|juges|samuel|saul|david|salomon|royaute unifiee|monarchie unifiee)/.test(norm)) return 1;
      if (/(israel|juda|assyr|babyl|exil|isaie|jeremie|ezech|osee|amos|michee|cyrus)/.test(norm)) return 2;
      if (/(esdras|nehemie|maccab|hellen|herode|temple|perse|grec|second temple)/.test(norm)) return 3;
      if (/(jesus|evang|actes|paul|rome|apot|nouveau testament|eglise)/.test(norm)) return 4;
      return null;
    };
    const openPeriod = index => {
      periods.forEach((item,i) => { item.open = i === index; });
      const target = periods[index];
      if (target) {
        target.scrollIntoView({behavior:"smooth", block:"start"});
        target.animate([{opacity:.96, transform:"translateY(3px)"},{opacity:1, transform:"translateY(0)"}],{duration:240,easing:DISCLOSURE_EASING});
      }
    };
    const runSearch = () => {
      const value = input.value.trim();
      if (!value) {
        feedback.hidden = true;
        feedback.textContent = "";
        return;
      }
      const index = resolveIndex(value);
      if (index === null) {
        feedback.textContent = "Aucun repère direct : essayez une année, un siècle ou un mot-clé biblique.";
        feedback.hidden = false;
        return;
      }
      openPeriod(index);
      const title = periods[index]?.querySelector("summary strong")?.textContent || "la bonne période";
      feedback.textContent = `Ouverture : ${title}.`;
      feedback.hidden = false;
    };
    button?.addEventListener("click", runSearch);
    input?.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); runSearch(); } });
  }
  const BOOKS = {"Genèse":{"meta":"Pentateuque · origines et patriarches","summary":"Des récits des origines à Joseph : création, humanité, alliances et histoires d’Abraham, Isaac et Jacob.","link":"/textes/theologie/?source=Livre%20de%20la%20Genèse"},"Exode":{"meta":"Pentateuque · libération et alliance","summary":"Israël sort d’Égypte sous la conduite de Moïse, reçoit l’alliance et la Loi au Sinaï, puis construit le sanctuaire."},"Lévitique":{"meta":"Pentateuque · culte et sainteté","summary":"Lois sur les sacrifices, la pureté, le sacerdoce, les fêtes et la manière de vivre la sainteté au sein du peuple."},"Nombres":{"meta":"Pentateuque · désert","summary":"La marche au désert mêle recensements, révoltes, épreuves, lois et préparation de la génération qui entrera en Canaan."},"Deutéronome":{"meta":"Pentateuque · mémoire et Loi","summary":"Moïse relit l’Exode et la Loi dans de grands discours avant l’entrée en Canaan, en appelant Israël à la fidélité."},"Josué":{"meta":"Récit historique · entrée en Canaan","summary":"Le livre raconte l’entrée des Israélites en Canaan, les conquêtes attribuées à Josué et le partage du territoire."},"Juges":{"meta":"Récit historique · avant la monarchie","summary":"Une succession de crises montre Israël passant de l’infidélité à l’oppression puis à la délivrance par des juges comme Débora, Gédéon ou Samson."},"Ruth":{"meta":"Récit bref · fidélité","summary":"Une veuve moabite choisit de rester auprès de Noémi, s’intègre à Israël et devient une ancêtre de David."},"1 Samuel":{"meta":"Récit historique · naissance de la monarchie","summary":"Samuel, Saül et le jeune David occupent le centre du récit : Israël passe du temps des juges à la royauté."},"2 Samuel":{"meta":"Récit historique · règne de David","summary":"Le règne de David, ses victoires mais aussi ses fautes et les crises de sa famille, jusqu’aux révoltes qui menacent son pouvoir."},"1 Rois":{"meta":"Récit historique · Salomon et division","summary":"Salomon construit le Temple ; après sa mort, le royaume se divise entre Israël au nord et Juda au sud."},"2 Rois":{"meta":"Récit historique · chute des royaumes","summary":"Le récit mène de la monarchie divisée à la chute de Samarie puis de Jérusalem, jusqu’à l’Exil à Babylone."},"1 Chroniques":{"meta":"Récit historique · relecture","summary":"Une relecture de l’histoire d’Israël centrée sur les généalogies, David, Jérusalem, le culte et la préparation du Temple."},"2 Chroniques":{"meta":"Récit historique · Temple et Juda","summary":"De Salomon à l’Exil, le livre relit surtout l’histoire du royaume de Juda à partir du Temple et de la fidélité à Dieu."},"Esdras":{"meta":"Récit historique · retour d’Exil","summary":"Le retour de groupes judéens, la reconstruction du Temple et la restauration d’une communauté organisée autour de la Torah."},"Néhémie":{"meta":"Récit historique · Jérusalem restaurée","summary":"Néhémie reconstruit les murailles de Jérusalem et participe à la réorganisation politique et religieuse de la communauté."},"Tobie":{"meta":"Récit sapientiel · providence","summary":"Un récit familial sur l’exil, la fidélité, le mariage, la prière et la providence, accompagné par l’ange Raphaël."},"Judith":{"meta":"Récit théologique · délivrance","summary":"Judith, veuve pieuse et courageuse, sauve son peuple en renversant le général ennemi Holopherne."},"Esther":{"meta":"Récit de cour · survie du peuple","summary":"À la cour perse, Esther et Mardochée déjouent un projet d’extermination des Juifs ; le récit est lié à la fête de Pourim."},"1 Maccabées":{"meta":"Récit historique · révolte maccabéenne","summary":"Une chronique de la résistance judéenne à la domination séleucide et de l’essor de la dynastie hasmonéenne au IIe siècle av. J.-C."},"2 Maccabées":{"meta":"Récit théologique · persécution et espérance","summary":"Une autre perspective sur la crise maccabéenne, insistant sur le Temple, le martyre, la résurrection et la justice divine."},"Job":{"meta":"Sagesse · souffrance du juste","summary":"Un homme juste frappé par le malheur discute avec ses amis et avec Dieu de la souffrance, de la justice et des limites du savoir humain."},"Psaumes":{"meta":"Poésie et prière","summary":"Une collection de prières et de chants : louange, plainte, confiance, repentance, action de grâce et méditation."},"Proverbes":{"meta":"Sagesse · art de vivre","summary":"Maximes et enseignements sur la conduite juste, la parole, le travail, les relations et la recherche d’une vie sage."},"Qohélet / Ecclésiaste":{"meta":"Sagesse · sens de l’existence","summary":"Une méditation lucide sur la fragilité des œuvres humaines, le temps, la mort, le plaisir et la recherche de sens."},"Cantique des Cantiques":{"meta":"Poésie amoureuse","summary":"Un dialogue poétique de désir et d’amour entre deux amants, reçu aussi dans les traditions juive et chrétienne comme texte spirituel."},"Sagesse":{"meta":"Sagesse hellénistique","summary":"Un livre qui réfléchit à la justice, à l’immortalité, à la sagesse divine et relit l’histoire d’Israël dans un monde de culture grecque."},"Siracide":{"meta":"Sagesse · enseignement","summary":"Un vaste recueil de conseils sur la vie morale, les relations, la parole, la Loi et la sagesse héritée d’Israël."},"Isaïe":{"meta":"Prophétie · jugement et espérance","summary":"Oracles sur Juda, Jérusalem et les nations, mêlant critique de l’injustice, jugement, consolation et espérance de restauration."},"Jérémie":{"meta":"Prophétie · crise de Juda","summary":"À l’approche de la chute de Jérusalem, Jérémie dénonce les illusions politiques et religieuses tout en annonçant une alliance renouvelée."},"Lamentations":{"meta":"Poésie · deuil de Jérusalem","summary":"Cinq poèmes de lamentation face à la destruction de Jérusalem, entre douleur, culpabilité, prière et attente."},"Baruch":{"meta":"Texte deutérocanonique · exil et sagesse","summary":"Prière, confession et méditation sur l’exil, la sagesse et la fidélité à la Loi, placées sous le nom de Baruch."},"Ézékiel":{"meta":"Prophétie · Exil","summary":"Visions et oracles d’un prophète de l’Exil : jugement de Jérusalem, responsabilité, présence divine et espérance de restauration."},"Daniel":{"meta":"Récits et visions apocalyptiques","summary":"Des récits de fidélité en contexte impérial puis des visions symboliques sur les empires, la persécution et le règne de Dieu."},"Osée":{"meta":"Prophétie · alliance","summary":"La relation du prophète à son épouse devient image de l’infidélité d’Israël et de l’attachement persistant de Dieu."},"Joël":{"meta":"Prophétie · jour du Seigneur","summary":"À partir d’une catastrophe, le livre appelle à revenir à Dieu et annonce le jour du Seigneur ainsi que l’effusion de l’Esprit."},"Amos":{"meta":"Prophétie · justice sociale","summary":"Amos condamne le culte sans justice, les inégalités et la violence du royaume d’Israël, en annonçant un jugement."},"Abdias":{"meta":"Prophétie · Édom","summary":"Un très court oracle contre Édom, accusé d’avoir profité de la catastrophe de Juda, et une annonce de restauration."},"Jonas":{"meta":"Récit prophétique · miséricorde","summary":"Un prophète fuit sa mission auprès de Ninive puis découvre que la miséricorde divine déborde les frontières de son propre peuple."},"Michée":{"meta":"Prophétie · justice et espérance","summary":"Critique des dirigeants et des injustices, annonce du jugement de Jérusalem et espérance d’une restauration future."},"Nahum":{"meta":"Prophétie · chute de Ninive","summary":"Un oracle de jugement contre Ninive et l’empire assyrien, présenté comme la fin d’une puissance violente."},"Habaquq":{"meta":"Prophétie · problème du mal","summary":"Le prophète interroge Dieu sur la violence et l’injustice, notamment face à l’essor babylonien, et apprend à attendre dans la foi."},"Sophonie":{"meta":"Prophétie · jour du Seigneur","summary":"Annonce d’un jugement universel et de purification, avec une espérance finale pour un peuple humble et restauré."},"Aggée":{"meta":"Prophétie · retour d’Exil","summary":"Après l’Exil, Aggée presse la communauté de reprendre la reconstruction du Temple de Jérusalem."},"Zacharie":{"meta":"Prophétie · visions et restauration","summary":"Visions symboliques et oracles encouragent la reconstruction du Temple et développent une espérance pour Jérusalem."},"Malachie":{"meta":"Prophétie · fidélité après l’Exil","summary":"Le livre critique prêtres et fidèles après le retour d’Exil et appelle à une fidélité renouvelée avant le jour du Seigneur."},"Matthieu":{"meta":"Évangile","summary":"Un récit de Jésus particulièrement attentif à son rapport aux Écritures d’Israël, à son enseignement et à la formation des disciples."},"Marc":{"meta":"Évangile","summary":"Le plus bref des évangiles met fortement en scène l’action de Jésus, l’incompréhension des disciples et le chemin vers la Passion."},"Luc":{"meta":"Évangile","summary":"Un récit ordonné de Jésus insistant sur la miséricorde, les pauvres, la prière, l’Esprit et l’ouverture du salut."},"Jean":{"meta":"Évangile","summary":"Un évangile très théologique organisé autour de signes, de longs discours et de l’identité de Jésus comme Verbe et Fils."},"Actes des Apôtres":{"meta":"Récit des premières communautés","summary":"Suite de Luc : de Jérusalem à Rome, l’annonce chrétienne se diffuse par l’Esprit, Pierre, Paul et les premières communautés."},"Romains":{"meta":"Lettre de Paul","summary":"Paul expose largement sa compréhension de l’Évangile, de la foi, de la grâce, du péché et des rapports entre Juifs et non-Juifs."},"1 Corinthiens":{"meta":"Lettre de Paul","summary":"Paul répond aux divisions et problèmes d’une communauté : sexualité, culte, dons spirituels, amour et résurrection."},"2 Corinthiens":{"meta":"Lettre de Paul","summary":"Une lettre très personnelle sur le ministère apostolique, la faiblesse, les conflits, la réconciliation et la générosité."},"Galates":{"meta":"Lettre de Paul","summary":"Paul défend la liberté des croyants non juifs vis-à-vis de la circoncision et insiste sur la foi, la promesse et la vie selon l’Esprit."},"Éphésiens":{"meta":"Lettre paulinienne","summary":"Une méditation sur l’unité de l’Église en Christ, la réconciliation et la manière de vivre une existence nouvelle."},"Philippiens":{"meta":"Lettre de Paul","summary":"Une lettre chaleureuse sur la joie, l’humilité, la fidélité et l’imitation du Christ au milieu des épreuves."},"Colossiens":{"meta":"Lettre paulinienne","summary":"Le texte insiste sur la primauté du Christ et en tire des conséquences pour la vie nouvelle de la communauté."},"1 Thessaloniciens":{"meta":"Lettre de Paul","summary":"Encouragement à une jeune communauté, avec une forte attention à l’espérance du retour du Christ et à la résurrection."},"2 Thessaloniciens":{"meta":"Lettre paulinienne","summary":"Le texte corrige des inquiétudes sur le jour du Seigneur et appelle à la persévérance et à une vie ordonnée."},"1 Timothée":{"meta":"Lettre pastorale","summary":"Conseils sur l’enseignement, la prière, les responsables et l’organisation d’une communauté chrétienne."},"2 Timothée":{"meta":"Lettre pastorale","summary":"Un appel à transmettre fidèlement l’enseignement et à tenir bon dans l’épreuve, sous la forme d’un testament apostolique."},"Tite":{"meta":"Lettre pastorale","summary":"Instructions sur l’organisation des communautés, les responsables et une conduite cohérente avec l’enseignement reçu."},"Philémon":{"meta":"Lettre de Paul","summary":"Une très courte lettre dans laquelle Paul demande à Philémon d’accueillir Onésime autrement qu’auparavant, comme un frère."},"Hébreux":{"meta":"Homélie / traité chrétien","summary":"Une méditation élaborée sur le Christ comme grand prêtre et sur le rapport entre l’ancienne alliance, le Temple et la nouvelle alliance."},"Jacques":{"meta":"Lettre sapientielle","summary":"Une exhortation très concrète sur les actes, la parole, les riches et les pauvres, la sagesse, la patience et une foi vécue."},"1 Pierre":{"meta":"Lettre catholique","summary":"Encourage des croyants confrontés à l’hostilité en les appelant à l’espérance, à la sainteté et à la fidélité."},"2 Pierre":{"meta":"Lettre catholique","summary":"Met en garde contre de faux enseignants et réfléchit à l’attente du jour du Seigneur malgré son retard apparent."},"1 Jean":{"meta":"Lettre johannique","summary":"Une méditation sur l’amour, la vérité, la communion et le discernement de la foi en Jésus Christ."},"2 Jean":{"meta":"Lettre johannique","summary":"Très courte lettre liant vérité, amour et vigilance envers les enseignements qui remettent en cause le Christ."},"3 Jean":{"meta":"Lettre johannique","summary":"Un bref message sur l’hospitalité, l’autorité et les tensions concrètes au sein d’une communauté."},"Jude":{"meta":"Lettre catholique","summary":"Une mise en garde énergique contre des enseignants jugés dangereux, avec de nombreuses références aux traditions juives."},"Apocalypse":{"meta":"Apocalypse chrétienne","summary":"Une série de visions symboliques adressées à des communautés éprouvées, proclamant la victoire finale de Dieu sur les puissances du mal."},"1 Hénoch":{"meta":"Apocalypse juive ancienne · hors canon catholique courant","summary":"Un vaste ensemble de visions attribuées à Hénoch : anges rebelles, origine du mal, voyages célestes, jugement, destin des justes et espérance eschatologique. Le livre a fortement marqué certains courants juifs et chrétiens anciens ; il est canonique notamment dans l’Église orthodoxe éthiopienne."},"Jubilés":{"meta":"Réécriture de Genèse–Exode · hors canon catholique courant","summary":"Le livre reprend de nombreux épisodes de la Genèse et du début de l’Exode en les organisant selon des périodes de quarante-neuf ans. Il insiste sur le calendrier, les anges, les alliances et l’ancienneté des prescriptions de la Loi."},"Testaments des Douze Patriarches":{"meta":"Testaments pseudépigraphes · judaïsme ancien / transmission chrétienne","summary":"Douze discours d’adieu placés dans la bouche des fils de Jacob. Chacun relit une vie, met en garde contre un vice, recommande une vertu et ouvre sur des attentes concernant l’avenir d’Israël."},"4 Esdras":{"meta":"Apocalypse juive · après la destruction de Jérusalem","summary":"Un dialogue visionnaire sur la catastrophe de Jérusalem, le mal, la justice de Dieu et le destin d’Israël. Le voyant reçoit plusieurs visions symboliques et réfléchit à la difficulté de comprendre l’histoire."},"Psaumes de Salomon":{"meta":"Poésie religieuse juive · Ier s. av. J.-C.","summary":"Dix-huit psaumes non canoniques qui mêlent prière, critique des dirigeants, confession, espérance de restauration et attente d’un roi juste issu de David."},"3 Maccabées":{"meta":"Récit juif hellénistique · canon variable selon les Églises","summary":"Malgré son titre, le livre ne raconte pas la révolte des Maccabées. Il met en scène des Juifs d’Égypte menacés par un souverain ptolémaïque puis délivrés, avec un fort accent sur la fidélité et la protection divine."},"4 Maccabées":{"meta":"Discours philosophico-religieux · canon variable","summary":"Une méditation sur la maîtrise des passions par la raison pieuse, développée à partir des martyrs de la persécution racontée en 2 Maccabées. Le texte croise vocabulaire grec et fidélité à la Loi."},"Évangile selon Thomas":{"meta":"Recueil de paroles de Jésus · non canonique","summary":"Un ensemble d’environ cent quatorze paroles attribuées à Jésus, sans récit suivi de sa vie, de sa Passion ou de sa résurrection. Certaines ressemblent aux évangiles canoniques, d’autres appartiennent à des traditions différentes."},"Protévangile de Jacques":{"meta":"Évangile de l’enfance · non canonique","summary":"Un récit centré sur la naissance et l’enfance de Marie, son mariage avec Joseph puis la naissance de Jésus. Plusieurs traditions chrétiennes ultérieures sur Marie ont été influencées par ce texte."},"Évangile de l’enfance selon Thomas":{"meta":"Récits de l’enfance de Jésus · non canonique","summary":"Une série d’histoires merveilleuses sur Jésus enfant, entre miracles étonnants, épisodes parfois déroutants et manifestation précoce d’une puissance exceptionnelle."},"Évangile de Pierre":{"meta":"Récit de Passion · non canonique","summary":"Un fragment d’évangile consacré surtout à la Passion, à la mise au tombeau et à la résurrection de Jésus. Il propose certains détails absents des quatre évangiles canoniques."},"Évangile de Judas":{"meta":"Dialogue chrétien ancien · courant gnostique","summary":"Un dialogue dans lequel Judas reçoit de Jésus un enseignement secret sur le monde céleste, les puissances cosmiques et le sens de sa propre action. Le portrait de Judas y diffère fortement de celui des évangiles canoniques."},"Actes de Paul et Thècle":{"meta":"Actes apocryphes · récit chrétien ancien","summary":"Thècle entend la prédication de Paul, refuse le mariage, affronte plusieurs condamnations et devient une figure d’ascèse, de courage et de mission. Le récit a connu une réception très importante dans l’Antiquité chrétienne."},"Actes de Pierre":{"meta":"Actes apocryphes · traditions sur Pierre","summary":"Un ensemble de récits sur l’activité de Pierre, notamment son affrontement avec Simon le Mage à Rome et des traditions liées à son martyre."},"Actes de Thomas":{"meta":"Actes apocryphes · mission vers l’Orient","summary":"Le texte raconte une mission légendaire de l’apôtre Thomas jusqu’en Inde, mêlant voyages, miracles, conversions, ascèse et hymnes théologiques."},"Apocalypse de Pierre":{"meta":"Apocalypse chrétienne ancienne · non canonique","summary":"Une vision du jugement final qui décrit le sort des justes et différentes peines réservées aux pécheurs. Elle compte parmi les premières apocalypses chrétiennes connues."},"Pasteur d’Hermas":{"meta":"Écrit chrétien ancien · visions et exhortations","summary":"Visions, commandements et paraboles appellent les croyants à la conversion, à la discipline morale et à la reconstruction de la communauté, symbolisée par une tour en cours d’édification."},"Didachè":{"meta":"Manuel chrétien ancien · non canonique","summary":"Un court manuel sur les deux voies, le baptême, le jeûne, la prière, l’eucharistie, l’accueil des prédicateurs et l’organisation des communautés chrétiennes."}};
  const VIEWS = {"catholic":{"note":"Ordre courant d’une Bible catholique en français. Les livres sont regroupés ici par grandes familles pour rendre immédiatement visible l’architecture d’ensemble ; cet ordre n’est pas une chronologie.","groups":[{"title":"Pentateuque","subtitle":"Origines · libération · alliance · Loi","books":["Genèse","Exode","Lévitique","Nombres","Deutéronome"]},{"title":"Livres historiques","subtitle":"Canaan · juges · royaumes · Exil · retours","books":["Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Tobie","Judith","Esther","1 Maccabées","2 Maccabées"]},{"title":"Poésie & sagesse","subtitle":"Prière · souffrance · amour · art de vivre","books":["Job","Psaumes","Proverbes","Qohélet / Ecclésiaste","Cantique des Cantiques","Sagesse","Siracide"]},{"title":"Prophètes","subtitle":"Crise · justice · jugement · consolation · espérance","books":["Isaïe","Jérémie","Lamentations","Baruch","Ézékiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habaquq","Sophonie","Aggée","Zacharie","Malachie"]},{"title":"Évangiles","subtitle":"Quatre récits de Jésus, quatre perspectives","books":["Matthieu","Marc","Luc","Jean"]},{"title":"Actes","subtitle":"De Jérusalem à Rome · premières communautés","books":["Actes des Apôtres"]},{"title":"Lettres pauliniennes","subtitle":"Communautés · foi · vie chrétienne · conflits","books":["Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon"]},{"title":"Autres lettres","subtitle":"Exhortation · sagesse · persévérance · identité","books":["Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude"]},{"title":"Apocalypse","subtitle":"Vision symbolique · résistance · espérance","books":["Apocalypse"]}]},"tanakh":{"note":"Organisation de la Bible hébraïque : Torah, Nevi’im (Prophètes) et Ketuvim (Écrits). Cette vue ne comprend ni le Nouveau Testament ni les livres deutérocanoniques chrétiens.","groups":[{"title":"Torah","subtitle":"Enseignement · les cinq livres de Moïse","books":["Genèse","Exode","Lévitique","Nombres","Deutéronome"]},{"title":"Nevi’im · Prophètes","subtitle":"Prophètes antérieurs et postérieurs","books":["Josué","Juges","1 Samuel","2 Samuel","1 Rois","2 Rois","Isaïe","Jérémie","Ézékiel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habaquq","Sophonie","Aggée","Zacharie","Malachie"]},{"title":"Ketuvim · Écrits","subtitle":"Poésie, sagesse et autres écrits","books":["Psaumes","Proverbes","Job","Cantique des Cantiques","Ruth","Lamentations","Qohélet / Ecclésiaste","Esther","Daniel","Esdras","Néhémie","1 Chroniques","2 Chroniques"]}]},"genre":{"note":"Une classification pédagogique par forme dominante. Beaucoup de livres mêlent plusieurs genres : cette vue sert surtout à savoir quel type de lecture adopter en premier.","groups":[{"title":"Récits & histoire","subtitle":"Origines, peuple, royaumes, Exil et retours","books":["Genèse","Exode","Nombres","Deutéronome","Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Tobie","Judith","Esther","1 Maccabées","2 Maccabées","Actes des Apôtres"]},{"title":"Loi & culte","subtitle":"Alliance, prescriptions et sainteté","books":["Exode","Lévitique","Nombres","Deutéronome"]},{"title":"Poésie & sagesse","subtitle":"Prière, amour, souffrance et art de vivre","books":["Job","Psaumes","Proverbes","Qohélet / Ecclésiaste","Cantique des Cantiques","Sagesse","Siracide","Lamentations"]},{"title":"Prophétie & apocalypse","subtitle":"Justice, crise, espérance et visions","books":["Isaïe","Jérémie","Baruch","Ézékiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habaquq","Sophonie","Aggée","Zacharie","Malachie","Apocalypse"]},{"title":"Évangiles","subtitle":"Paroles, gestes, Passion et résurrection de Jésus","books":["Matthieu","Marc","Luc","Jean"]},{"title":"Lettres","subtitle":"Communautés, enseignement et exhortation","books":["Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude"]}]},"apocrypha":{"note":"Ici, « apocryphes » désigne des écrits juifs ou chrétiens anciens qui ne font pas partie du canon catholique courant. Leur statut varie selon les traditions : certains sont canoniques dans d’autres Églises, d’autres ont simplement été lus et transmis à côté des Écritures.","groups":[{"title":"Autour de l’Ancien Testament","subtitle":"Visions · réécritures · sagesse · histoire","books":["1 Hénoch","Jubilés","Testaments des Douze Patriarches","4 Esdras","Psaumes de Salomon","3 Maccabées","4 Maccabées"]},{"title":"Évangiles et enfances apocryphes","subtitle":"Paroles de Jésus · enfance · Passion · traditions alternatives","books":["Évangile selon Thomas","Protévangile de Jacques","Évangile de l’enfance selon Thomas","Évangile de Pierre","Évangile de Judas"]},{"title":"Actes et récits apostoliques","subtitle":"Missions, figures apostoliques et récits légendaires","books":["Actes de Paul et Thècle","Actes de Pierre","Actes de Thomas"]},{"title":"Apocalypses et écrits des premières communautés","subtitle":"Jugement · conversion · vie communautaire","books":["Apocalypse de Pierre","Pasteur d’Hermas","Didachè"]}]},"period":{"note":"Cette vue classe les livres selon la période à laquelle leur récit, leur situation ou leur message renvoie principalement. Elle ne donne pas un ordre de rédaction : un livre peut raconter un monde ancien et avoir été composé ou remanié bien plus tard.","groups":[{"title":"Origines & patriarches","subtitle":"Avant Israël comme royaume · origines · Abraham · Jacob · Joseph","books":["Genèse"]},{"title":"Exode & désert","subtitle":"Moïse · Égypte · Sinaï · alliance · marche vers Canaan","books":["Exode","Lévitique","Nombres","Deutéronome"]},{"title":"Canaan & temps des Juges","subtitle":"Installation · crises locales · avant la monarchie","books":["Josué","Juges","Ruth"]},{"title":"Naissance de la monarchie","subtitle":"Samuel · Saül · David · Salomon","books":["1 Samuel","2 Samuel","1 Rois"]},{"title":"Royaumes d’Israël et de Juda","subtitle":"Division · prophètes · menace assyrienne","books":["2 Rois","1 Chroniques","2 Chroniques","Osée","Amos","Isaïe","Michée","Jonas","Nahum"]},{"title":"Crise babylonienne & Exil","subtitle":"Chute de Jérusalem · Babylone · perte du Temple","books":["Jérémie","Lamentations","Baruch","Ézékiel","Daniel","Habaquq","Sophonie","Abdias"]},{"title":"Retour & époque perse","subtitle":"Jérusalem reconstruite · Temple · communauté · Torah","books":["Esdras","Néhémie","Esther","Aggée","Zacharie","Malachie"]},{"title":"Époque hellénistique & Maccabées","subtitle":"Culture grecque · persécutions · révolte · espérance","books":["1 Maccabées","2 Maccabées"]},{"title":"Sagesse & poésie à travers plusieurs périodes","subtitle":"Des livres difficiles à enfermer dans un seul moment historique","books":["Job","Psaumes","Proverbes","Qohélet / Ecclésiaste","Cantique des Cantiques","Sagesse","Siracide","Tobie","Judith","Joël"]},{"title":"Jésus","subtitle":"Galilée · Judée · Jérusalem · Passion et résurrection","books":["Matthieu","Marc","Luc","Jean"]},{"title":"Premières communautés chrétiennes","subtitle":"Jérusalem · Méditerranée · missions · lettres · Ier siècle","books":["Actes des Apôtres","Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude","Apocalypse"]}]},"questions":{"note":"Une même œuvre peut apparaître dans plusieurs ensembles : ici, on ne classe plus les livres par ordre ou par genre, mais par grandes questions traversant toute la Bible.","groups":[{"title":"Création, monde & condition humaine","subtitle":"D’où vient le monde ? Qu’est-ce que l’être humain ? Quelle place occupe-t-il ?","books":["Genèse","Job","Psaumes","Proverbes","Sagesse","Jean","Colossiens"]},{"title":"Alliance, Loi & fidélité","subtitle":"Promesse · commandements · engagement · infidélité · renouvellement","books":["Genèse","Exode","Lévitique","Deutéronome","Josué","Osée","Jérémie","Hébreux"]},{"title":"Justice, pauvreté & pouvoir","subtitle":"Richesse · oppression · responsabilité · gouvernement · jugement","books":["Proverbes","Isaïe","Amos","Michée","Siracide","Luc","Jacques"]},{"title":"Souffrance, mal & espérance","subtitle":"Pourquoi souffrir ? Comment tenir devant l’injustice, la perte ou la persécution ?","books":["Job","Psaumes","Lamentations","Habaquq","2 Maccabées","Romains","1 Pierre","Apocalypse"]},{"title":"Amour, désir & relations","subtitle":"Couple · fidélité · fraternité · amour de Dieu · vie commune","books":["Ruth","Cantique des Cantiques","Osée","1 Corinthiens","1 Jean"]},{"title":"Sagesse, temps & mort","subtitle":"Bien vivre · limites du savoir · vieillesse · finitude · sens de l’existence","books":["Job","Proverbes","Qohélet / Ecclésiaste","Sagesse","Siracide"]},{"title":"Prière, culte & présence de Dieu","subtitle":"Temple · sacrifices · louange · plainte · sainteté · médiation","books":["Exode","Lévitique","1 Chroniques","2 Chroniques","Psaumes","Esdras","Hébreux"]},{"title":"Prophétie, jugement & conversion","subtitle":"Critiquer le présent · appeler au changement · annoncer jugement et restauration","books":["Isaïe","Jérémie","Ézékiel","Osée","Joël","Amos","Jonas","Michée","Zacharie"]},{"title":"Empire, violence & résistance","subtitle":"Assyrie · Babylone · monde grec · Rome · fidélité sous domination","books":["2 Rois","Daniel","1 Maccabées","2 Maccabées","Apocalypse"]},{"title":"Jésus, Royaume & disciples","subtitle":"Identité de Jésus · enseignement · miracles · Passion · résurrection","books":["Matthieu","Marc","Luc","Jean","Actes des Apôtres"]},{"title":"Communautés & vie chrétienne","subtitle":"Foi · conflits · organisation · liberté · unité · persévérance","books":["Actes des Apôtres","Romains","1 Corinthiens","Galates","Éphésiens","Philippiens","Jacques","1 Pierre","1 Jean"]}]}}
  const BOOK_GUIDES = {
    "Genèse":"Pour s’y repérer : les chapitres 1–11 forment les grands récits des origines ; à partir du chapitre 12, le livre se concentre sur Abraham, Isaac, Jacob et Joseph. C’est la grande porte d’entrée narrative du Pentateuque.",
    "Exode":"Le livre se partage grossièrement entre la libération d’Égypte puis l’alliance au Sinaï. Il fournit une grande partie du vocabulaire biblique de la libération, de l’alliance, de la Loi et de la présence de Dieu.",
    "Lévitique":"Il se lit moins comme un récit continu que comme un ensemble de prescriptions autour du culte, du sacré et de la vie communautaire. Il est essentiel pour comprendre les sacrifices, la pureté et la notion biblique de sainteté.",
    "Nombres":"Le livre relie le séjour au Sinaï à l’approche de Canaan. Les épisodes de crise et de révolte montrent surtout ce que devient une génération appelée à vivre l’alliance dans le désert.",
    "Deutéronome":"Présenté comme les derniers grands discours de Moïse, il reprend et réinterprète la Loi avant l’entrée en Canaan. Il insiste fortement sur la mémoire, l’écoute et le choix de la fidélité.",
    "Psaumes":"Les 150 psaumes ne forment pas un récit continu : chacun possède sa voix, sa situation et sa fonction. La collection traverse presque tout le spectre de la prière, de la détresse la plus vive à la louange.",
    "Job":"Le cœur du livre est un long débat poétique : les explications simples de la souffrance y sont progressivement mises en échec. Il vaut mieux le lire comme une confrontation de discours sur la justice que comme une réponse unique au problème du mal.",
    "Qohélet / Ecclésiaste":"Le livre observe la répétition, la fragilité et la finitude de l’existence humaine avec une lucidité souvent déconcertante. Son refrain sur la « vanité » invite moins au désespoir qu’à mesurer ce qui échappe à notre maîtrise.",
    "Cantique des Cantiques":"Le texte avance par scènes et voix amoureuses plutôt que par intrigue continue. Son langage du désir a donné lieu à une double histoire de lecture : poésie d’amour et interprétations spirituelles dans le judaïsme et le christianisme.",
    "Isaïe":"Le livre rassemble des ensembles prophétiques liés à plusieurs périodes, de la crise assyrienne jusqu’aux horizons de l’Exil et du retour. Il est l’un des grands lieux bibliques où jugement, consolation et espérance se répondent.",
    "Jérémie":"Le prophète parle dans les décennies qui précèdent et accompagnent la catastrophe de Jérusalem. Le livre mêle oracles, récits biographiques et lamentations personnelles, ce qui donne une forte présence à la crise vécue par le prophète lui-même.",
    "Ézékiel":"Le cadre de l’Exil est décisif : Ézékiel parle depuis la déportation, dans un monde où le Temple et Jérusalem semblent perdus. Ses visions cherchent à repenser la présence de Dieu, la responsabilité et la possibilité d’un recommencement.",
    "Daniel":"La première partie raconte des figures fidèles vivant sous des empires étrangers ; la seconde déploie des visions symboliques beaucoup plus difficiles. Le livre devient un grand texte de résistance et d’espérance face à la persécution.",
    "Jonas":"Le centre du livre n’est pas seulement le grand poisson : c’est la résistance du prophète à la miséricorde accordée à Ninive. Le récit fonctionne presque comme une parabole sur les frontières que l’être humain voudrait imposer à la compassion divine.",
    "Matthieu":"L’évangile organise une grande partie de l’enseignement de Jésus en discours et multiplie les échos aux Écritures d’Israël. Il est particulièrement utile pour observer comment les premières communautés chrétiennes relisent la Torah et les prophètes.",
    "Marc":"Le récit est rapide, tendu et souvent construit autour de l’incompréhension de ceux qui accompagnent Jésus. La question de son identité se précise progressivement jusqu’à la Passion, qui occupe une place déterminante dans l’ensemble.",
    "Luc":"Luc met fortement en avant la miséricorde, la prière, les pauvres, les exclus et l’action de l’Esprit. Son évangile forme le premier volet d’une œuvre en deux parties qui se poursuit dans les Actes des Apôtres.",
    "Jean":"Jean ne suit pas exactement la même organisation que les trois évangiles synoptiques : il construit son récit autour de signes et de longs discours. Le vocabulaire de la vie, de la lumière, de la vérité et de l’amour y prend une importance majeure.",
    "Actes des Apôtres":"Le récit commence à Jérusalem et s’achève à Rome : sa géographie est déjà un résumé de son projet. Il raconte comment le mouvement chrétien franchit progressivement des frontières religieuses, culturelles et politiques.",
    "Romains":"C’est la lettre la plus développée de Paul sur sa compréhension de l’Évangile. Elle ne doit pourtant pas être lue comme un traité abstrait : elle s’adresse à des communautés concrètes traversées notamment par la question des rapports entre Juifs et non-Juifs.",
    "1 Corinthiens":"La lettre permet de voir une communauté réelle avec ses conflits, ses pratiques et ses questions. Paul répond successivement à des problèmes très différents, ce qui explique son caractère parfois fragmenté.",
    "Hébreux":"Le texte ressemble davantage à une grande exhortation théologique qu’à une lettre ordinaire. Il mobilise abondamment le Temple, le sacerdoce et les Écritures d’Israël pour penser l’identité et l’œuvre du Christ.",
    "Jacques":"Le texte est proche, par son ton, de la sagesse biblique et d’une prédication très concrète. Il insiste sur ce que deviennent réellement la foi, la parole et la justice dans les comportements quotidiens.",
    "Apocalypse":"Les images ne doivent pas être prises comme un calendrier crypté de la fin du monde : elles appartiennent au langage symbolique de l’apocalyptique. Le livre cherche à donner de l’espérance à des communautés confrontées aux puissances politiques et au mal.",
    "1 Maccabées":"Le livre donne un récit assez suivi de la révolte maccabéenne et de ses enjeux politiques. Il constitue un repère majeur pour comprendre la Judée du IIe siècle av. J.-C. et le contexte précédant le Nouveau Testament.",
    "2 Maccabées":"Il ne continue pas 1 Maccabées : il raconte en partie la même crise sous un autre angle. La résurrection, le martyre et la fidélité dans la persécution y occupent une place particulièrement importante."
  };

  const BOOK_TOPICS = {
    "Genèse":["Origines","Alliance","Patriarches","Fraternité"], "Exode":["Égypte","Moïse","Libération","Sinaï"], "Lévitique":["Sainteté","Sacrifices","Pureté","Culte"], "Nombres":["Désert","Révoltes","Marche","Fidélité"], "Deutéronome":["Mémoire","Loi","Alliance","Choix"],
    "Josué":["Canaan","Conquête","Terre","Alliance"], "Juges":["Crises","Délivrance","Violence","Cycle"], "Ruth":["Fidélité","Étranger","Famille","David"], "1 Samuel":["Samuel","Saül","David","Royauté"], "2 Samuel":["David","Jérusalem","Royauté","Crises"], "1 Rois":["Salomon","Temple","Division","Élie"], "2 Rois":["Royaumes","Prophètes","Samarie","Exil"], "1 Chroniques":["Généalogies","David","Culte","Temple"], "2 Chroniques":["Temple","Juda","Réformes","Exil"], "Esdras":["Retour","Temple","Torah","Communauté"], "Néhémie":["Jérusalem","Murailles","Réforme","Communauté"], "Tobie":["Exil","Famille","Prière","Raphaël"], "Judith":["Délivrance","Courage","Foi","Holopherne"], "Esther":["Perse","Survie","Pourim","Identité"], "1 Maccabées":["Révolte","Séleucides","Temple","Hasmonéens"], "2 Maccabées":["Martyre","Résurrection","Temple","Persécution"],
    "Job":["Souffrance","Justice","Sagesse","Dieu"], "Psaumes":["Prière","Louange","Plainte","Confiance"], "Proverbes":["Sagesse","Parole","Conduite","Justice"], "Qohélet / Ecclésiaste":["Vanité","Temps","Mort","Joie"], "Cantique des Cantiques":["Amour","Désir","Corps","Poésie"], "Sagesse":["Justice","Immortalité","Sagesse","Histoire"], "Siracide":["Sagesse","Loi","Relations","Parole"],
    "Isaïe":["Justice","Jugement","Consolation","Espérance"], "Jérémie":["Jérusalem","Crise","Alliance","Lamentation"], "Lamentations":["Jérusalem","Deuil","Ruine","Prière"], "Baruch":["Exil","Confession","Sagesse","Loi"], "Ézékiel":["Exil","Visions","Responsabilité","Restauration"], "Daniel":["Empires","Fidélité","Visions","Espérance"], "Osée":["Alliance","Infidélité","Amour","Israël"], "Joël":["Catastrophe","Conversion","Esprit","Jour du Seigneur"], "Amos":["Justice","Pauvres","Culte","Jugement"], "Abdias":["Édom","Jugement","Fraternité","Restauration"], "Jonas":["Ninive","Fuite","Miséricorde","Conversion"], "Michée":["Justice","Jérusalem","Jugement","Espérance"], "Nahum":["Ninive","Assyrie","Violence","Chute"], "Habaquq":["Violence","Justice","Babylone","Foi"], "Sophonie":["Jugement","Jour du Seigneur","Humilité","Restauration"], "Aggée":["Retour","Temple","Reconstruction","Espérance"], "Zacharie":["Visions","Temple","Jérusalem","Espérance"], "Malachie":["Culte","Fidélité","Justice","Jour du Seigneur"],
    "Matthieu":["Royaume","Enseignement","Écritures","Disciples"], "Marc":["Identité","Action","Incompréhension","Passion"], "Luc":["Miséricorde","Pauvres","Esprit","Prière"], "Jean":["Signes","Vie","Lumière","Amour"], "Actes des Apôtres":["Esprit","Mission","Communautés","Rome"],
    "Romains":["Foi","Justice","Grâce","Juifs et nations"], "1 Corinthiens":["Communauté","Conflits","Corps","Résurrection"], "2 Corinthiens":["Ministère","Faiblesse","Réconciliation","Générosité"], "Galates":["Liberté","Foi","Loi","Esprit"], "Éphésiens":["Église","Unité","Grâce","Vie nouvelle"], "Philippiens":["Joie","Christ","Humilité","Persévérance"], "Colossiens":["Christ","Création","Église","Vie nouvelle"], "1 Thessaloniciens":["Espérance","Retour du Christ","Communauté","Sainteté"], "2 Thessaloniciens":["Persévérance","Jour du Seigneur","Travail","Espérance"], "1 Timothée":["Communauté","Responsables","Enseignement","Conduite"], "2 Timothée":["Transmission","Persévérance","Écriture","Mission"], "Tite":["Organisation","Enseignement","Bonnes œuvres","Communauté"], "Philémon":["Onésime","Fraternité","Réconciliation","Liberté"], "Hébreux":["Christ","Sacerdoce","Alliance","Persévérance"], "Jacques":["Œuvres","Parole","Richesse","Sagesse"], "1 Pierre":["Épreuve","Espérance","Sainteté","Communauté"], "2 Pierre":["Fidélité","Faux maîtres","Promesse","Patience"], "1 Jean":["Amour","Vérité","Communion","Vie"], "2 Jean":["Vérité","Amour","Discernement"], "3 Jean":["Hospitalité","Vérité","Autorité"], "Jude":["Fidélité","Faux maîtres","Jugement"], "Apocalypse":["Empire","Combat","Espérance","Nouvelle création"]
  };

  const BOOK_STRUCTURES = {
    "Genèse":"1–11 : récits des origines · 12–25 : Abraham · 26–36 : Isaac et Jacob · 37–50 : Joseph et la descente en Égypte.",
    "Exode":"1–15 : servitude et sortie d’Égypte · 16–18 : marche au désert · 19–24 : alliance au Sinaï · 25–40 : sanctuaire et présence divine.",
    "Lévitique":"Sacrifices et prêtres · pureté et impureté · Jour des Expiations · code de sainteté · fêtes et règles communautaires.",
    "Nombres":"Du Sinaï au départ · crises et révoltes dans le désert · marche vers Moab · préparation de l’entrée en Canaan.",
    "Deutéronome":"Discours de Moïse · reprise de la Loi · bénédictions et malédictions · alliance renouvelée · mort de Moïse.",
    "Josué":"Passage du Jourdain · récits de conquête · partage du territoire · dernières exhortations de Josué.",
    "Juges":"Une série de cycles : infidélité · oppression · appel · délivrance ; la fin montre une violence croissante et l’absence d’unité politique.",
    "1 Samuel":"Samuel et la fin du temps des juges · règne de Saül · montée de David et conflit avec Saül.",
    "2 Samuel":"Installation du règne de David · Jérusalem et promesse dynastique · faute de David · crises familiales et politiques.",
    "1 Rois":"Salomon et construction du Temple · division du royaume · premiers rois d’Israël et de Juda · cycle d’Élie.",
    "2 Rois":"Élisée et les deux royaumes · chute de Samarie · histoire de Juda · réformes · chute de Jérusalem et Exil.",
    "Job":"Prologue narratif · grands dialogues de Job avec ses amis · discours d’Élihu · réponses de Dieu · épilogue.",
    "Psaumes":"150 poèmes répartis en cinq livres internes. On y rencontre des psaumes de plainte, de louange, d’action de grâce, royaux, sapientiaux et liturgiques.",
    "Qohélet / Ecclésiaste":"Observation du monde et de ses répétitions · examen du travail, du plaisir et de la sagesse · méditation sur le temps, la vieillesse et la mort.",
    "Cantique des Cantiques":"Suite de scènes et de voix amoureuses : désir, recherche de l’aimé, rencontre, séparation et célébration de l’amour plutôt qu’un récit linéaire.",
    "Isaïe":"1–39 : crises de Juda et menace assyrienne · 40–55 : consolation dans l’horizon de l’Exil · 56–66 : retour, Jérusalem et espérance.",
    "Jérémie":"Oracles avant la chute · récits autour du prophète · conflit avec les autorités · catastrophe de Jérusalem · promesses de restauration.",
    "Ézékiel":"Visions initiales et jugement de Jérusalem · oracles contre les nations · après la chute : restauration, nouveau cœur et Temple visionnaire.",
    "Daniel":"1–6 : récits de fidélité sous des souverains étrangers · 7–12 : visions apocalyptiques sur les empires, la persécution et l’espérance.",
    "Matthieu":"Enfance · ministère en Galilée · grands discours d’enseignement · montée à Jérusalem · Passion et résurrection.",
    "Marc":"Début du ministère en Galilée · incompréhension croissante des disciples · chemin vers Jérusalem · Passion et tombeau vide.",
    "Luc":"Enfances de Jean et Jésus · ministère en Galilée · long voyage vers Jérusalem · Passion et résurrection ; l’histoire se poursuit dans les Actes.",
    "Jean":"Prologue · signes et controverses · longs discours d’adieu · Passion et résurrection ; le livre est structuré par quelques grands signes et déclarations de Jésus.",
    "Actes des Apôtres":"Jérusalem · Judée et Samarie · ouverture aux non-Juifs · missions de Paul en Méditerranée · arrivée à Rome.",
    "Romains":"Ouverture et problème universel du péché · justification et vie nouvelle · Israël et les nations · conséquences concrètes pour la vie communautaire.",
    "1 Corinthiens":"Réponse à des divisions et scandales · mariage et liberté · culte et dons spirituels · amour · résurrection.",
    "Hébreux":"Supériorité du Fils · Christ grand prêtre · nouvelle alliance · appel à la foi et à la persévérance.",
    "Apocalypse":"Lettres aux sept Églises · visions du trône et des sceaux · conflits symboliques et chute de Babylone · jugement · nouvelle Jérusalem et nouvelle création."
  };

  const BOOK_CONTEXT = {"Genèse":{"time":"Origines du monde puis temps des patriarches, avant l’Exode.","formation":"Traditions de périodes diverses ; la forme finale du Pentateuque est généralement située beaucoup plus tard, surtout autour de l’Exil et de l’époque perse."},"Exode":{"time":"Moïse, sortie d’Égypte, Sinaï et marche au désert.","formation":"Traditions anciennes retravaillées sur une longue durée ; la mise en forme finale s’inscrit dans l’histoire de composition du Pentateuque."},"Lévitique":{"time":"Israël au Sinaï, dans le cadre narratif du séjour au désert.","formation":"Collections sacerdotales développées et organisées sur une longue période, avec une mise en forme particulièrement liée aux périodes exilique et postexilique."},"Nombres":{"time":"Du Sinaï aux plaines de Moab, avant l’entrée en Canaan.","formation":"Traditions narratives, juridiques et sacerdotales assemblées progressivement dans la formation du Pentateuque."},"Deutéronome":{"time":"Derniers discours de Moïse, juste avant l’entrée en Canaan.","formation":"Noyau souvent rapproché de la fin de la monarchie de Juda, puis révisions et intégration au Pentateuque pendant et après l’Exil."},"Josué":{"time":"Installation d’Israël en Canaan après Moïse.","formation":"Traditions plus anciennes reprises dans une grande relecture historique souvent associée aux périodes monarchique tardive et exilique."},"Juges":{"time":"Période située entre l’installation en Canaan et la monarchie.","formation":"Récits locaux et traditions diverses rassemblés et relus bien après les événements racontés."},"Ruth":{"time":"Le récit se situe « au temps des Juges ».","formation":"La composition est postérieure au cadre raconté ; sa datation exacte reste discutée."},"1 Samuel":{"time":"Fin des Juges et débuts de la monarchie : Samuel, Saül et David.","formation":"Traditions royales anciennes réorganisées et éditées au fil de plusieurs périodes, jusqu’à une forme tardive."},"2 Samuel":{"time":"Règne de David, autour du Xe siècle av. J.-C. dans le cadre du récit.","formation":"Matériaux anciens sur David repris dans une histoire plus vaste de la monarchie, mise en forme ultérieurement."},"1 Rois":{"time":"Salomon puis début des royaumes séparés d’Israël et de Juda.","formation":"Chroniques et traditions royales relues dans une œuvre historique dont la forme finale est liée à la crise de l’Exil."},"2 Rois":{"time":"Royaumes divisés jusqu’à la chute de Samarie puis de Jérusalem.","formation":"La forme finale intègre la catastrophe de 587/586 av. J.-C. et porte la marque d’une relecture exilique."},"1 Chroniques":{"time":"Généalogies depuis les origines puis surtout règne de David.","formation":"Relecture tardive de traditions plus anciennes, généralement située à l’époque perse ou au début de l’époque hellénistique."},"2 Chroniques":{"time":"Salomon puis histoire du royaume de Juda jusqu’à l’Exil.","formation":"Même vaste relecture tardive que 1 Chroniques, composée plusieurs siècles après une grande partie des événements racontés."},"Esdras":{"time":"Retour d’Exil et réorganisation de Jérusalem sous domination perse.","formation":"Le livre rassemble plusieurs dossiers et mémoires ; sa forme actuelle est postérieure aux événements du Ve siècle av. J.-C."},"Néhémie":{"time":"Jérusalem au Ve siècle av. J.-C., sous l’Empire perse.","formation":"Des mémoires attribuées à Néhémie ont été intégrées à une œuvre plus tardive liée à Esdras."},"Tobie":{"time":"Le récit se place dans la diaspora après les conquêtes assyriennes.","formation":"Composition bien postérieure au cadre raconté, probablement durant l’époque hellénistique."},"Judith":{"time":"Cadre volontairement composite : le récit mêle des éléments de périodes différentes.","formation":"Œuvre tardive, généralement située dans le judaïsme hellénistique ; son cadre historique est surtout littéraire et théologique."},"Esther":{"time":"Cour perse, sous un roi identifié au cadre de Xerxès/Ahasuérus.","formation":"Le récit a été composé et développé après la période qu’il met en scène ; les versions hébraïque et grecques présentent des différences."},"1 Maccabées":{"time":"Révolte maccabéenne et premiers Hasmonéens au IIe siècle av. J.-C.","formation":"Rédaction proche des événements, à la fin du IIe ou au début du Ier siècle av. J.-C."},"2 Maccabées":{"time":"Crise sous Antiochus IV et révolte de Judas Maccabée.","formation":"Abrégé d’une œuvre historique plus vaste, composé dans le judaïsme hellénistique après les événements racontés."},"Job":{"time":"Cadre narratif volontairement ancien et non rattaché à une chronologie précise d’Israël.","formation":"Livre issu de plusieurs couches littéraires ; sa mise en forme est généralement située bien après le cadre archaïsant du récit."},"Psaumes":{"time":"Les psaumes renvoient à des situations très diverses, de la monarchie au temps postexilique.","formation":"Collection construite durant plusieurs siècles ; l’organisation finale des 150 psaumes est tardive."},"Proverbes":{"time":"Pas de temps raconté unique : sagesse familiale, royale et scolaire.","formation":"Recueil de collections d’âges différents, rassemblées progressivement et achevées tardivement."},"Qohélet / Ecclésiaste":{"time":"Réflexion sans récit historique continu, placée sous une figure royale de Jérusalem.","formation":"Langue et contexte orientent généralement vers une composition de l’époque perse tardive ou hellénistique."},"Cantique des Cantiques":{"time":"Poèmes amoureux sans intrigue historique datable.","formation":"Collection poétique formée progressivement ; la datation exacte reste discutée, probablement à une période relativement tardive."},"Sagesse":{"time":"Réflexion juive dans un environnement fortement marqué par la culture grecque.","formation":"Composition tardive, souvent située à Alexandrie autour de la fin du Ier siècle av. J.-C. ou du début de notre ère."},"Siracide":{"time":"Jérusalem et judaïsme du début du IIe siècle av. J.-C.","formation":"Œuvre de Ben Sira vers 200–180 av. J.-C., ensuite traduite en grec par son petit-fils."},"Isaïe":{"time":"Des crises du VIIIe siècle à l’Exil puis au retour à Jérusalem.","formation":"Livre composite : traditions liées à Isaïe du VIIIe siècle, puis développements exiliques et postexiliques."},"Jérémie":{"time":"Dernières décennies du royaume de Juda et chute de Jérusalem.","formation":"Paroles, récits et traditions édités pendant et après la catastrophe ; les formes hébraïque et grecque diffèrent."},"Lamentations":{"time":"Après la destruction de Jérusalem en 587/586 av. J.-C.","formation":"Poèmes issus de la période du traumatisme exilique, rassemblés en collection."},"Baruch":{"time":"Le texte se place symboliquement dans le monde de Jérémie et de l’Exil.","formation":"Composition plus tardive que le cadre attribué à Baruch, probablement issue de plusieurs éléments de l’époque hellénistique."},"Ézékiel":{"time":"Exil babylonien, avant et après la chute de Jérusalem.","formation":"Noyau lié au prophète du VIe siècle, puis organisation et développements au sein de son école ou de traditions ultérieures."},"Daniel":{"time":"Récits situés sous Babylone et la Perse ; visions portant sur les empires jusqu’à la crise grecque.","formation":"La forme finale est généralement rattachée à la persécution d’Antiochus IV au IIe siècle av. J.-C., avec des récits plus anciens."},"Osée":{"time":"Royaume d’Israël au VIIIe siècle av. J.-C.","formation":"Oracles du prophète transmis puis édités après la disparition du royaume du Nord."},"Joël":{"time":"Catastrophe collective et liturgie à Jérusalem, sans roi précisément identifiable.","formation":"Datation très discutée ; beaucoup de chercheurs situent le livre à l’époque postexilique."},"Amos":{"time":"Royaume d’Israël au VIIIe siècle av. J.-C., avant la chute de Samarie.","formation":"Oracles anciens associés à Amos puis transmis et édités dans des contextes ultérieurs."},"Abdias":{"time":"Catastrophe de Jérusalem et hostilité d’Édom.","formation":"Souvent rapproché des décennies suivant 587/586 av. J.-C., avec possibilité de traditions plus anciennes."},"Jonas":{"time":"Le récit place le prophète face à Ninive, capitale assyrienne.","formation":"Récit composé bien après l’époque assyrienne, généralement à la période perse ou hellénistique."},"Michée":{"time":"Juda et Israël au VIIIe siècle av. J.-C., dans le contexte assyrien.","formation":"Oracles anciens enrichis et organisés au cours d’une transmission plus longue."},"Nahum":{"time":"Avant la chute de Ninive en 612 av. J.-C.","formation":"Oracles issus de la fin du VIIe siècle, ensuite transmis comme petit livre prophétique."},"Habaquq":{"time":"Montée de la puissance babylonienne, fin du VIIe ou début du VIe siècle av. J.-C.","formation":"Petit ensemble prophétique constitué autour de cette crise, avec une histoire rédactionnelle discutée."},"Sophonie":{"time":"Juda sous le règne de Josias, au VIIe siècle av. J.-C.","formation":"Oracles du contexte monarchique, probablement complétés lors de leur transmission."},"Aggée":{"time":"Jérusalem en 520 av. J.-C., après le retour d’Exil.","formation":"Oracles précisément datés dans le texte et mis en forme autour de la reconstruction du Temple."},"Zacharie":{"time":"Les premiers chapitres renvoient au retour d’Exil ; les derniers ont un horizon plus tardif.","formation":"Livre composite : Zacharie 1–8 appartient au VIe siècle, tandis que 9–14 est généralement considéré comme plus tardif."},"Malachie":{"time":"Juda à l’époque perse, après la reconstruction du Temple.","formation":"Composition postexilique, souvent placée au Ve siècle av. J.-C."},"Matthieu":{"time":"Vie et enseignement de Jésus, surtout autour des années 20–30 de notre ère.","formation":"Évangile généralement situé dans les dernières décennies du Ier siècle, à partir de traditions antérieures."},"Marc":{"time":"Ministère de Jésus, de la Galilée à Jérusalem.","formation":"Souvent considéré comme le plus ancien évangile canonique, composé autour de la guerre judéo-romaine ou peu avant/après 70."},"Luc":{"time":"Vie de Jésus jusqu’à la Passion et la résurrection.","formation":"Évangile généralement situé dans les dernières décennies du Ier siècle ; il forme un diptyque avec les Actes."},"Jean":{"time":"Vie et signes de Jésus jusqu’à sa Passion et sa résurrection.","formation":"Évangile issu d’une histoire de composition complexe, souvent situé vers la fin du Ier siècle."},"Actes des Apôtres":{"time":"Premières communautés, de Jérusalem à Rome, après la mort de Jésus.","formation":"Deuxième volet de l’œuvre de Luc, généralement daté des dernières décennies du Ier siècle."},"Romains":{"time":"Communautés chrétiennes du milieu du Ier siècle.","formation":"Lettre de Paul généralement située vers 56–58 apr. J.-C."},"1 Corinthiens":{"time":"Église de Corinthe au milieu du Ier siècle.","formation":"Lettre de Paul généralement située vers 53–55 apr. J.-C."},"2 Corinthiens":{"time":"Relations de Paul avec Corinthe au milieu du Ier siècle.","formation":"Lettre paulinienne des années 50 ; le texte actuel pourrait réunir plusieurs échanges ou fragments."},"Galates":{"time":"Communautés de Galatie au milieu du Ier siècle.","formation":"Lettre authentique de Paul ; sa datation précise dans les années 40–50 reste discutée."},"Éphésiens":{"time":"Vie de communautés chrétiennes de la seconde moitié du Ier siècle.","formation":"La date et l’attribution sont discutées : lettre paulinienne tardive ou écrite dans la tradition de Paul."},"Philippiens":{"time":"Communauté de Philippes et captivité de Paul.","formation":"Lettre authentique de Paul, généralement placée dans les années 50 ou au début des années 60."},"Colossiens":{"time":"Communauté chrétienne de Colosses au Ier siècle.","formation":"Datation et attribution discutées : Paul ou un auteur très proche de sa tradition, autour des années 60 ou plus tard."},"1 Thessaloniciens":{"time":"Communauté de Thessalonique vers le milieu du Ier siècle.","formation":"Probablement l’une des plus anciennes lettres chrétiennes conservées, vers 50 apr. J.-C."},"2 Thessaloniciens":{"time":"Communauté confrontée à l’attente du Jour du Seigneur.","formation":"Datation et attribution discutées : soit proche de 1 Thessaloniciens, soit plus tardive dans la tradition paulinienne."},"1 Timothée":{"time":"Organisation et enseignement de communautés chrétiennes.","formation":"Souvent située à la fin du Ier ou au début du IIe siècle si l’on retient une rédaction postérieure à Paul ; attribution discutée."},"2 Timothée":{"time":"Transmission du ministère et persévérance dans l’épreuve.","formation":"Comme les autres Pastorales, sa datation et son attribution à Paul font l’objet de débats."},"Tite":{"time":"Organisation des communautés et responsables ecclésiaux.","formation":"Lettre pastorale dont la date et l’attribution sont discutées, souvent placée relativement tard dans le corpus paulinien."},"Philémon":{"time":"Relation entre Paul, Philémon et Onésime au Ier siècle.","formation":"Courte lettre authentique de Paul, généralement située dans les années 50 ou au début des années 60."},"Hébreux":{"time":"Communauté chrétienne du Ier siècle relisant Temple, alliance et sacerdoce.","formation":"Auteur inconnu ; composition généralement située dans la seconde moitié du Ier siècle."},"Jacques":{"time":"Communautés chrétiennes confrontées aux tensions sociales et à la mise en pratique de la foi.","formation":"Datation et auteur discutés ; la forme actuelle est généralement située au Ier siècle."},"1 Pierre":{"time":"Communautés chrétiennes d’Asie Mineure vivant l’épreuve et la marginalisation.","formation":"Généralement située dans la seconde moitié du Ier siècle ; attribution directe à Pierre discutée."},"2 Pierre":{"time":"Communautés chrétiennes confrontées aux faux maîtres et à l’attente du retour du Christ.","formation":"Souvent considérée comme l’un des écrits les plus tardifs du Nouveau Testament, autour de la fin du Ier ou du début du IIe siècle."},"1 Jean":{"time":"Communautés johanniques confrontées à des divisions sur l’identité de Jésus et la vie fraternelle.","formation":"Écrit généralement situé autour de la fin du Ier ou du début du IIe siècle."},"2 Jean":{"time":"Une communauté johannique et ses relations avec des enseignants itinérants.","formation":"Même milieu que 1 et 3 Jean, autour de la fin du Ier ou du début du IIe siècle."},"3 Jean":{"time":"Conflit d’autorité et hospitalité dans une communauté johannique.","formation":"Même horizon rédactionnel que les autres lettres johanniques."},"Jude":{"time":"Communauté chrétienne confrontée à des enseignants jugés dangereux.","formation":"Souvent située dans la seconde moitié du Ier siècle, avec une datation précise incertaine."},"Apocalypse":{"time":"Églises d’Asie Mineure sous la domination de l’Empire romain.","formation":"Généralement située vers la fin du Ier siècle, souvent sous Domitien, même si des propositions plus anciennes existent."},"1 Hénoch":{"time":"Mondes antédiluviens, figures d’Hénoch et visions projetées dans des temps primordiaux.","formation":"Collection de plusieurs écrits juifs formés entre environ le IIIe siècle av. J.-C. et le Ier siècle de notre ère."},"Jubilés":{"time":"Réécriture de Genèse et du début de l’Exode.","formation":"Œuvre juive du IIe siècle av. J.-C., relisant les récits anciens à partir de préoccupations calendaires et légales."},"Testaments des Douze Patriarches":{"time":"Dernières paroles fictives des fils de Jacob.","formation":"Collection pseudépigraphique à histoire complexe, développée dans l’Antiquité juive puis transmise avec des éléments chrétiens."},"4 Esdras":{"time":"Le voyant est placé après la chute de Jérusalem, sous le nom d’Esdras.","formation":"Apocalypse juive généralement liée au traumatisme de la destruction du Temple en 70 apr. J.-C."},"Psaumes de Salomon":{"time":"Jérusalem et crise politique à la fin de l’époque hasmonéenne.","formation":"Recueil juif du Ier siècle av. J.-C., probablement marqué par l’arrivée de Rome."},"3 Maccabées":{"time":"Juifs d’Égypte sous un souverain ptolémaïque.","formation":"Récit hellénistique composé après la période qu’il met en scène ; datation exacte discutée."},"4 Maccabées":{"time":"Martyres liés à la persécution d’Antiochus IV.","formation":"Discours philosophico-religieux probablement composé entre la fin du Ier siècle av. J.-C. et le Ier siècle apr. J.-C."},"Évangile selon Thomas":{"time":"Paroles attribuées à Jésus, sans récit chronologique de sa vie.","formation":"Recueil transmis dans le christianisme ancien ; la forme conservée est généralement placée au IIe siècle, avec possibles traditions plus anciennes."},"Protévangile de Jacques":{"time":"Enfance de Marie puis naissance de Jésus.","formation":"Évangile apocryphe généralement daté du IIe siècle."},"Évangile de l’enfance selon Thomas":{"time":"Enfance de Jésus.","formation":"Collection de récits apocryphes développée dans le christianisme des premiers siècles, probablement dès le IIe siècle."},"Évangile de Pierre":{"time":"Passion et résurrection de Jésus.","formation":"Évangile apocryphe généralement situé au IIe siècle."},"Évangile de Judas":{"time":"Dialogue placé avant la Passion de Jésus.","formation":"Écrit chrétien du IIe siècle appartenant à un milieu théologique très différent des évangiles canoniques."},"Actes de Paul et Thècle":{"time":"Missions attribuées à Paul au Ier siècle.","formation":"Récit chrétien composé au IIe siècle."},"Actes de Pierre":{"time":"Activité et traditions de Pierre à Rome.","formation":"Actes apocryphes généralement rattachés à la fin du IIe siècle."},"Actes de Thomas":{"time":"Mission légendaire de Thomas vers l’Orient.","formation":"Actes apocryphes probablement composés au IIIe siècle, avec des traditions plus anciennes."},"Apocalypse de Pierre":{"time":"Vision attribuée à Pierre après le temps de Jésus.","formation":"Apocalypse chrétienne du IIe siècle."},"Pasteur d’Hermas":{"time":"Vie et crises d’une communauté chrétienne à Rome.","formation":"Œuvre chrétienne du IIe siècle, formée de visions, commandements et paraboles."},"Didachè":{"time":"Vie pratique des premières communautés chrétiennes.","formation":"Manuel composite généralement situé entre la fin du Ier et le début du IIe siècle."}};

  const MAJOR_BOOKS = new Set(["Genèse", "Exode", "Deutéronome", "1 Samuel", "2 Samuel", "1 Rois", "2 Rois", "Job", "Psaumes", "Isaïe", "Jérémie", "Ézékiel", "Daniel", "Matthieu", "Marc", "Luc", "Jean", "Actes des Apôtres", "Romains", "1 Corinthiens", "Apocalypse"]);

  const contextForBook = (name) => BOOK_CONTEXT[name] || {
    time:"Période ou horizon variable selon les unités du livre.",
    formation:"La composition et la mise en forme se sont faites dans un contexte postérieur qu’il faut étudier livre par livre."
  };

  const importanceForBook = (name) => MAJOR_BOOKS.has(name) ? "major" : "standard";

  const canonicalFamilyForBook = (name) => {
    for (const viewName of ["catholic","tanakh","apocrypha"]) {
      const family = VIEWS[viewName]?.groups?.find((group) => group.books.includes(name));
      if (family) return viewName === "apocrypha" ? `${family.title} · apocryphe` : family.title;
    }
    return "Autre écrit";
  };
  const defaultTopicsFor = (name, meta) => {
    const parts = meta.split("·").map((part) => part.trim()).filter(Boolean);
    return [parts[1] || parts[0] || "Repère", canonicalFamilyForBook(name)].slice(0, 3);
  };
  const structureForBook = (name, meta) => {
    if (BOOK_STRUCTURES[name]) return BOOK_STRUCTURES[name];
    if (/Prophétie/.test(meta)) return "Le livre rassemble des oracles ou des scènes prophétiques autour d’une crise : accusation et jugement, appel à revenir à Dieu, puis souvent promesse de restauration. L’ordre n’est pas toujours strictement chronologique.";
    if (/Lettre|paulinienne|pastorale|johannique|catholique/.test(meta)) return "Adresse et salutation · réponse à des questions ou développement théologique · exhortations concrètes · conclusion. La progression dépend des problèmes de la communauté destinataire.";
    if (/Sagesse|sapientiel|Poésie/.test(meta)) return "Plutôt qu’une intrigue continue, le livre avance par poèmes, maximes, dialogues ou méditations. Il se comprend mieux par unités et thèmes que comme une histoire linéaire.";
    if (/Récit historique|Récit de cour|Récit théologique|Récit bref/.test(meta)) return "Mise en place d’une situation ou d’une figure · crise et décisions · dénouement et conséquences. Le récit sélectionne les événements selon un point de vue théologique propre.";
    if (/Évangile/.test(meta)) return "Ministère et enseignement de Jésus · déplacements et controverses · montée vers Jérusalem · Passion et résurrection, avec une organisation propre à chaque évangéliste.";
    return "Le livre est composé de plusieurs ensembles qu’il vaut mieux lire dans leur contexte immédiat. Repérez d’abord où commence et où finit l’unité que vous étudiez, puis sa place dans le mouvement général du livre.";
  };

  const guideForBook = (name, meta) => {
    if (BOOK_GUIDES[name]) return BOOK_GUIDES[name];
    if (/Prophétie/.test(meta)) return "Pour le situer, il faut toujours regarder à quelle crise politique ou religieuse les oracles répondent. Un livre prophétique rassemble souvent des paroles de périodes différentes : il ne se lit donc pas comme une chronique continue.";
    if (/Lettre|paulinienne|pastorale|johannique|catholique/.test(meta)) return "Il s’agit d’un texte adressé à une communauté ou à des responsables précis. Les thèmes théologiques prennent leur sens à partir de questions très concrètes : conflits, organisation, persévérance, enseignement ou manière de vivre.";
    if (/Sagesse|sapientiel|Poésie/.test(meta)) return "Ce livre se lit moins comme une histoire à suivre que comme une exploration de l’expérience humaine : conduite, souffrance, prière, désir, mort ou justice. La forme littéraire compte autant que le contenu des idées.";
    if (/Récit historique|Récit de cour|Récit théologique|Récit bref/.test(meta)) return "Le livre met en récit une période, une crise ou une figure particulière. Pour bien le lire, il est utile de distinguer l’époque racontée, le point de vue théologique du récit et la période de sa mise par écrit.";
    if (/Évangile/.test(meta)) return "Comme tout évangile, ce livre sélectionne et organise paroles et actions de Jésus selon une perspective propre. Le comparer aux autres évangiles permet de voir ce que chaque auteur met particulièrement en valeur.";
    return "Pour bien le situer, gardez en tête son genre, la période à laquelle il renvoie et la place qu’il occupe dans l’ensemble de la Bible. Ces trois repères évitent de lire un passage isolément de sa fonction dans le livre.";
  };
  const root = document.querySelector("[data-bible-books]");
  if (!root) return;
  const tabs = [...root.querySelectorAll("[data-bible-view]")];
  const board = root.querySelector("[data-bible-books-board]");
  const note = root.querySelector("[data-bible-view-note]");
  const search = root.querySelector("[data-bible-book-search]");
  const preview = root.querySelector("[data-bible-book-preview]");
  const title = preview.querySelector("[data-bible-book-title]");
  const meta = preview.querySelector("[data-bible-book-meta]");
  const summary = preview.querySelector("[data-bible-book-summary]");
  const guide = preview.querySelector("[data-bible-book-guide]");
  const structure = preview.querySelector("[data-bible-book-structure]");
  const topics = preview.querySelector("[data-bible-book-topics]");
  const family = preview.querySelector("[data-bible-book-family]");
  const form = preview.querySelector("[data-bible-book-form]");
  const focus = preview.querySelector("[data-bible-book-focus]");
  const time = preview.querySelector("[data-bible-book-time]");
  const formation = preview.querySelector("[data-bible-book-formation]");
  const importance = preview.querySelector("[data-bible-book-importance]");
  const localLink = preview.querySelector("[data-bible-book-link]");
  const prevButton = preview.querySelector("[data-bible-book-prev]");
  const nextButton = preview.querySelector("[data-bible-book-next]");
  let selectedBook = null;
  let currentBooks = [];
  let activeView = "catholic";

  const renderViewNote = (rawNote) => {
    note.innerHTML = `${rawNote}<span class="bible-books-view-note-legend"><span><i aria-hidden="true">★</i><b>Repère majeur</b> particulièrement utile pour comprendre l’architecture biblique</span><small>Ce repère est pédagogique : il ne classe pas la valeur religieuse ou canonique des livres.</small></span>`;
  };

  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
  const searchTextFor = (name) => {
    const info = BOOKS[name] || {};
    const alias = name === "Qohélet / Ecclésiaste" ? "qohelet ecclesiaste ecclésiaste" : name === "1 Hénoch" ? "henoch enoch hénoch" : name;
    return normalize([alias, info.meta || "", info.summary || "", ...(BOOK_TOPICS[name] || [])].join(" "));
  };

  const closePreview = () => {
    selectedBook = null;
    preview.hidden = true;
    root.append(preview);
    board.querySelectorAll(".bible-book-chip").forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
    board.querySelectorAll(".bible-book-cluster").forEach((cluster) => cluster.classList.remove("has-open-book"));
  };

  const updateNeighbors = () => {
    const index = currentBooks.indexOf(selectedBook);
    const previous = index > 0 ? currentBooks[index - 1] : null;
    const next = index >= 0 && index < currentBooks.length - 1 ? currentBooks[index + 1] : null;
    [[prevButton, previous], [nextButton, next]].forEach(([button, name]) => {
      button.hidden = !name;
      if (!name) return;
      button.dataset.targetBook = name;
      button.querySelector("strong").textContent = name;
    });
  };

  const showBook = (name, preferredButton = null) => {
    const info = BOOKS[name];
    if (!info) return;
    if (selectedBook === name && !preview.hidden) { closePreview(); return; }
    selectedBook = name;
    preview.hidden = false;
    preview.animate(
      [{ opacity:0, transform:"translateY(-5px)" }, { opacity:1, transform:"translateY(0)" }],
      { duration:280, easing:DISCLOSURE_EASING }
    );
    const metaParts = info.meta.split("·").map((part) => part.trim()).filter(Boolean);
    title.textContent = name;
    meta.textContent = info.meta;
    summary.textContent = info.summary;
    guide.textContent = guideForBook(name, info.meta);
    structure.textContent = structureForBook(name, info.meta);
    family.textContent = canonicalFamilyForBook(name);
    form.textContent = metaParts[0] || "Livre / écrit ancien";
    focus.textContent = metaParts.slice(1).join(" · ") || "À situer dans son ensemble";
    const bookContext = contextForBook(name);
    time.textContent = bookContext.time;
    formation.textContent = bookContext.formation;
    const isMajor = importanceForBook(name) === "major";
    importance.hidden = !isMajor;
    topics.innerHTML = "";
    (BOOK_TOPICS[name] || defaultTopicsFor(name, info.meta)).forEach((topic) => {
      const chip = document.createElement("span"); chip.textContent = topic; topics.append(chip);
    });
    if (info.link) { localLink.href = info.link; localLink.textContent = `Voir les textes de ${name} sur le site →`; localLink.hidden = false; }
    else localLink.hidden = true;
    board.querySelectorAll(".bible-book-chip").forEach((button) => {
      const active = button.dataset.book === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const activeButton = preferredButton || board.querySelector(`.bible-book-chip[data-book="${CSS.escape(name)}"]`);
    const cluster = activeButton?.closest(".bible-book-cluster");
    if (cluster) {
      cluster.classList.add("is-open", "has-open-book");
      const panel = cluster.querySelector(".bible-book-cluster-panel");
      if (panel) panel.hidden = false;
      cluster.append(preview);
    } else board.append(preview);
    updateNeighbors();
  };

  const makeChip = (name) => {
    const button = document.createElement("button");
    const isMajor = importanceForBook(name) === "major";
    button.type = "button";
    button.className = `bible-book-chip${isMajor ? " bible-book-chip--major" : ""}`;
    button.dataset.book = name;
    button.dataset.importance = isMajor ? "major" : "standard";
    button.innerHTML = `${isMajor ? '<i class="bible-book-chip-star" aria-hidden="true">★</i>' : ""}<span>${name}</span>`;
    if (isMajor) button.title = "Repère majeur pour se situer dans l’ensemble de la Bible";
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => showBook(name, button));
    return button;
  };

  const renderSearch = (query) => {
    const q = normalize(query);
    closePreview(); board.innerHTML = "";
    if (!q) { render(activeView); return; }
    note.textContent = "Recherche dans les livres bibliques et les principaux apocryphes présentés dans cette boussole.";
    const matches = Object.keys(BOOKS).filter((name) => searchTextFor(name).includes(q));
    currentBooks = matches;
    const section = document.createElement("section");
    section.className = "bible-book-cluster bible-book-search-results is-open";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bible-book-cluster-head"; head.setAttribute("aria-expanded","true");
    head.innerHTML = `<span><strong>${matches.length} résultat${matches.length > 1 ? "s" : ""}</strong><small>${matches.length ? "Cliquez sur un titre pour savoir immédiatement ce que c’est." : "Aucun livre ne correspond à cette recherche."}</small></span>`;
    const panel = document.createElement("div"); panel.className = "bible-book-cluster-panel";
    const chips = document.createElement("div"); chips.className = "bible-book-chips";
    matches.forEach((name) => chips.append(makeChip(name)));
    panel.append(chips); section.append(head,panel); board.append(section);
  };

  const render = (viewName) => {
    activeView = viewName;
    const view = VIEWS[viewName] || VIEWS.catholic;
    closePreview();
    renderViewNote(view.note);
    board.innerHTML = "";
    currentBooks = [];
    view.groups.forEach((group, index) => {
      const section = document.createElement("section"); section.className = "bible-book-cluster";
      const head = document.createElement("button"); head.type = "button"; head.className = "bible-book-cluster-head"; head.setAttribute("aria-expanded","false");
      head.innerHTML = `<span><strong>${group.title}</strong><small>${group.subtitle}</small></span><em>${group.books.length}</em><i aria-hidden="true">⌄</i>`;
      const panel = document.createElement("div"); panel.className = "bible-book-cluster-panel"; panel.hidden = true;
      const chips = document.createElement("div"); chips.className = "bible-book-chips";
      group.books.forEach((name) => { if (!currentBooks.includes(name)) currentBooks.push(name); chips.append(makeChip(name)); });
      panel.append(chips); section.append(head,panel); board.append(section);
      head.addEventListener("click", () => {
        const opening = !section.classList.contains("is-open");
        head.setAttribute("aria-expanded", opening ? "true" : "false");
        if (opening) {
          section.classList.add("is-open");
          animatePanel(panel, true);
        } else {
          if (section.contains(preview)) closePreview();
          animatePanel(panel, false, () => section.classList.remove("is-open"));
        }
      });
    });
  };

  [prevButton,nextButton].forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.targetBook; if (!target) return;
    const targetButton = board.querySelector(`.bible-book-chip[data-book="${CSS.escape(target)}"]`);
    if (targetButton) showBook(target,targetButton);
  }));

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    search.value = "";
    tabs.forEach((item) => item.setAttribute("aria-selected", item === tab ? "true" : "false"));
    render(tab.dataset.bibleView);
  }));
  search.addEventListener("input", () => renderSearch(search.value));
  render("catholic");



  // ------------------------------------------------------------
  // Glossaire approfondi : recherche locale, variantes et synonymes.
  // ------------------------------------------------------------
  const glossaryRoot = document.querySelector("[data-bible-glossary]");
  const GLOSSARY = Array.isArray(window.BIBLE_GLOSSARY) ? window.BIBLE_GLOSSARY : [];
  if (glossaryRoot && GLOSSARY.length) {
    const search = glossaryRoot.querySelector("[data-glossary-search]");
    const results = glossaryRoot.querySelector("[data-glossary-results]");
    const starters = glossaryRoot.querySelector("[data-glossary-starters]");
    const count = glossaryRoot.querySelector("[data-glossary-count]");
    const detail = glossaryRoot.querySelector("[data-glossary-detail]");
    const empty = glossaryRoot.querySelector("[data-glossary-empty]");
    const content = glossaryRoot.querySelector("[data-glossary-content]");
    const title = glossaryRoot.querySelector("[data-glossary-title]");
    const category = glossaryRoot.querySelector("[data-glossary-category]");
    const origin = glossaryRoot.querySelector("[data-glossary-origin]");
    const definition = glossaryRoot.querySelector("[data-glossary-definition]");
    const context = glossaryRoot.querySelector("[data-glossary-context]");
    const nuance = glossaryRoot.querySelector("[data-glossary-nuance]");
    const references = glossaryRoot.querySelector("[data-glossary-references]");
    const related = glossaryRoot.querySelector("[data-glossary-related]");
    let activeResult = -1;
    let currentMatches = [];

    const normalize = (value="") => value
      .toLocaleLowerCase("fr")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[’']/g," ")
      .replace(/[^a-z0-9\s-]/g," ")
      .replace(/\s+/g," ").trim();

    GLOSSARY.forEach(entry => {
      entry._search = normalize([entry.term, ...(entry.aliases || []), entry.category].join(" "));
    });
    if (count) count.textContent = `${GLOSSARY.length} entrées`;

    const scoreEntry = (entry, query) => {
      const term = normalize(entry.term);
      const aliases = (entry.aliases || []).map(normalize);
      if (term === query || aliases.includes(query)) return 1000;
      if (term.startsWith(query)) return 800;
      if (aliases.some(alias => alias.startsWith(query))) return 700;
      if (term.includes(query)) return 550;
      if (aliases.some(alias => alias.includes(query))) return 450;
      const words = query.split(" ").filter(Boolean);
      return words.length && words.every(word => entry._search.includes(word)) ? 250 + words.length * 10 : 0;
    };

    const findMatches = value => {
      const query = normalize(value);
      if (!query) return [];
      return GLOSSARY.map(entry => [entry, scoreEntry(entry,query)])
        .filter(([,score]) => score > 0)
        .sort((a,b) => b[1]-a[1] || a[0].term.localeCompare(b[0].term,"fr"))
        .slice(0,8).map(([entry]) => entry);
    };

    const closeResults = () => {
      results.hidden = true;
      search.setAttribute("aria-expanded","false");
      activeResult = -1;
    };

    const paintActive = () => {
      results.querySelectorAll("button").forEach((button,index) => {
        const active = index === activeResult;
        button.classList.toggle("is-active",active);
        button.setAttribute("aria-selected",active ? "true" : "false");
      });
    };

    const renderRelated = terms => {
      related.innerHTML = "";
      (terms || []).slice(0,7).forEach(term => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = term;
        button.addEventListener("click",() => {
          const target = GLOSSARY.find(entry => entry.term === term) || GLOSSARY.find(entry => normalize(entry.term) === normalize(term));
          if (target) selectEntry(target);
          else {
            search.value = term;
            renderResults(findMatches(term));
            search.focus();
          }
        });
        related.append(button);
      });
    };

    const renderEntry = (entry,{close=true,updateSearch=true}={}) => {
      if (!entry) {
        if (detail) detail.hidden = true;
        content.hidden = true;
        return;
      }
      if (updateSearch) search.value = entry.term;
      title.textContent = entry.term;
      category.textContent = entry.category;
      origin.textContent = entry.origin || "";
      origin.hidden = !entry.origin;
      definition.textContent = entry.definition;
      context.textContent = entry.context;
      nuance.textContent = entry.nuance;
      references.textContent = entry.refs;
      renderRelated(entry.related);
      if (empty) empty.hidden = true;
      if (detail) detail.hidden = false;
      content.hidden = false;
      content.animate(
        [{opacity:0,transform:"translateY(4px)"},{opacity:1,transform:"translateY(0)"}],
        {duration:220,easing:DISCLOSURE_EASING}
      );
      if (close) closeResults();
    };

    const selectEntry = entry => renderEntry(entry,{close:true,updateSearch:true});

    const renderResults = matches => {
      currentMatches = matches;
      activeResult = -1;
      results.innerHTML = "";
      if (!matches.length) {
        results.innerHTML = '<div class="bible-glossary-no-result">Aucune entrée trouvée. Essayez un mot plus court ou un synonyme.</div>';
      } else {
        matches.forEach((entry,index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.role = "option";
          button.dataset.glossaryIndex = String(index);
          button.innerHTML = `<span><strong>${entry.term}</strong><small>${entry.category}</small></span><i aria-hidden="true">→</i>`;
          button.addEventListener("mousedown",event => event.preventDefault());
          button.addEventListener("click",() => selectEntry(entry));
          results.append(button);
        });
      }
      results.hidden = false;
      search.setAttribute("aria-expanded","true");
    };

    search.addEventListener("input",() => {
      const value = search.value.trim();
      if (!value) {
        closeResults();
        if (detail) detail.hidden = true;
        content.hidden = true;
        return;
      }
      const matches = findMatches(value);
      renderResults(matches);
      if (matches[0]) renderEntry(matches[0],{close:false,updateSearch:false});
      else {
        if (detail) detail.hidden = true;
        content.hidden = true;
      }
    });
    search.addEventListener("focus",() => {
      if (search.value.trim()) renderResults(findMatches(search.value));
    });
    search.addEventListener("keydown",event => {
      const buttons = [...results.querySelectorAll("button")];
      if (event.key === "ArrowDown" && buttons.length) {
        event.preventDefault();
        activeResult = Math.min(activeResult + 1,buttons.length - 1);
        paintActive();
        buttons[activeResult]?.scrollIntoView({block:"nearest"});
      } else if (event.key === "ArrowUp" && buttons.length) {
        event.preventDefault();
        activeResult = Math.max(activeResult - 1,0);
        paintActive();
        buttons[activeResult]?.scrollIntoView({block:"nearest"});
      } else if (event.key === "Enter") {
        const entry = activeResult >= 0 ? currentMatches[activeResult] : currentMatches[0];
        if (entry) { event.preventDefault(); selectEntry(entry); }
      } else if (event.key === "Escape") closeResults();
    });

    starters?.querySelectorAll("[data-glossary-term]").forEach(button => {
      button.addEventListener("click",() => {
        const entry = GLOSSARY.find(item => item.term === button.dataset.glossaryTerm);
        if (entry) selectEntry(entry);
      });
    });
    document.addEventListener("click",event => { if (!glossaryRoot.contains(event.target)) closeResults(); });
    document.addEventListener("keydown",event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); search.focus(); search.select();
      }
    });
  }

  // ------------------------------------------------------------
  // Trois modes cartographiques : repères / atlas / chronologie.
  // Leaflet est chargé uniquement lorsqu'une vraie carte est demandée.
  // ------------------------------------------------------------
  const mapSwitcher = document.querySelector("[data-bible-map-switcher]");
  if (mapSwitcher) {
    const mapTabs = [...mapSwitcher.querySelectorAll("[data-map-mode]")];
    const mapPanels = [...mapSwitcher.querySelectorAll("[data-map-panel]")];
    const atlasMapEl = mapSwitcher.querySelector("[data-atlas-map]");
    const timeMapEl = mapSwitcher.querySelector("[data-time-map]");
    const atlasLoading = mapSwitcher.querySelector("[data-atlas-loading]");
    const timeLoading = mapSwitcher.querySelector("[data-time-loading]");
    let leafletPromise = null;
    let atlasMap = null;
    let timeMap = null;
    let atlasLayer = null;
    let timeLayer = null;

    const loadLeaflet = () => {
      if (window.L) return Promise.resolve(window.L);
      if (leafletPromise) return leafletPromise;
      leafletPromise = new Promise((resolve,reject) => {
        if (!document.querySelector('link[data-leaflet-css]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.dataset.leafletCss = "";
          document.head.append(link);
        }
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.defer = true;
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.head.append(script);
      });
      return leafletPromise;
    };

    const baseMap = (el, center, zoom) => {
      const map = L.map(el, { scrollWheelZoom:false, zoomControl:true, attributionControl:true }).setView(center,zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom:18,
        attribution:'&copy; OpenStreetMap'
      }).addTo(map);
      return map;
    };

    const markerIcon = (world=false) => L.divIcon({
      className:"",
      html:`<span class="bible-map-marker${world ? " bible-map-marker--world" : ""}">•</span>`,
      iconSize:[24,24], iconAnchor:[12,12], popupAnchor:[0,-11]
    });
    const labelIcon = (name, world=false) => L.divIcon({
      className:"bible-map-label-wrap",
      html:`<span class="bible-map-label${world ? " bible-map-label--world" : ""}">${name}</span>`,
      iconSize:[1,1], iconAnchor:[-9,8]
    });
    const popup = (name,note) => `<div class="bible-map-popup"><strong>${name}</strong><span>${note || ""}</span></div>`;

    const PLACES = {
      ur:[30.9625,46.103], harran:[36.864,39.031], canaan:[31.8,35.2], jerusalem:[31.778,35.235],
      egypt:[30.79,31.84], sinai:[28.539,33.975], samaria:[32.276,35.189], nineveh:[36.36,43.15],
      babylon:[32.542,44.421], perse:[32.65,51.68], nazareth:[32.6996,35.3035], capernaum:[32.8803,35.5757],
      bethlehem:[31.7054,35.2024], jericho:[31.8706,35.4439], damascus:[33.5138,36.2765], antioch:[36.2021,36.16],
      tarsus:[36.9165,34.8951], cyprus:[34.775,32.424], ephesus:[37.939,27.341], philippi:[41.013,24.286],
      thessalonica:[40.6401,22.9444], athens:[37.9838,23.7275], corinth:[37.9386,22.9322], rome:[41.9028,12.4964]
    };

    const ATLAS_PRESETS = {
      "old-testament": {
        center:[32.5,38.2], zoom:5,
        points:[
          ["Égypte",PLACES.egypt,"Grand voisin du sud-ouest"],["Canaan / Jérusalem",PLACES.jerusalem,"Centre du récit biblique"],
          ["Assyrie / Ninive",PLACES.nineveh,"Grand empire de l’est",true],["Babylone",PLACES.babylon,"Exil de Juda",true],
          ["Ur",PLACES.ur,"Point de départ traditionnel d’Abraham"]
        ]
      },
      exodus:{
        center:[30.7,33.7], zoom:6,
        points:[["Égypte",PLACES.egypt,"Point de départ du récit de l’Exode"],["Sinaï",PLACES.sinai,"Alliance au Sinaï"],["Canaan",PLACES.canaan,"Terre vers laquelle conduit le récit"]],
        route:[PLACES.egypt,PLACES.sinai,PLACES.canaan]
      },
      jesus:{
        center:[32.15,35.28], zoom:8,
        points:[["Nazareth",PLACES.nazareth,"Galilée"],["Capharnaüm",PLACES.capernaum,"Autour du lac de Galilée"],["Samarie",PLACES.samaria,"Entre Galilée et Judée"],["Jérusalem",PLACES.jerusalem,"Temple et Passion"],["Bethléem",PLACES.bethlehem,"Récit de la naissance chez Matthieu et Luc"],["Jéricho",PLACES.jericho,"Vallée du Jourdain"]]
      },
      paul:{
        center:[38.1,27.0], zoom:5,
        points:[["Antioche",PLACES.antioch,"Point majeur des missions"],["Chypre",PLACES.cyprus,"Première mission"],["Éphèse",PLACES.ephesus,"Asie Mineure"],["Philippes",PLACES.philippi,"Macédoine"],["Thessalonique",PLACES.thessalonica,"Macédoine"],["Athènes",PLACES.athens,"Grèce"],["Corinthe",PLACES.corinth,"Grèce"],["Rome",PLACES.rome,"Horizon final des Actes"]],
        route:[PLACES.antioch,PLACES.cyprus,PLACES.ephesus,PLACES.philippi,PLACES.thessalonica,PLACES.athens,PLACES.corinth,PLACES.rome]
      }
    };

    const renderAtlas = (presetName="old-testament") => {
      const preset = ATLAS_PRESETS[presetName] || ATLAS_PRESETS["old-testament"];
      if (!atlasMap) return;
      if (atlasLayer) atlasLayer.remove();
      atlasLayer = L.layerGroup().addTo(atlasMap);
      preset.points.forEach(([name,coords,note,world]) => {
        L.marker(coords,{icon:markerIcon(!!world)}).bindPopup(popup(name,note)).addTo(atlasLayer);
        L.marker(coords,{icon:labelIcon(name,!!world),interactive:false,keyboard:false}).addTo(atlasLayer);
      });
      if (preset.route) L.polyline(preset.route,{color:"#a65765",weight:2.2,opacity:.72,dashArray:"5 6"}).addTo(atlasLayer);
      atlasMap.setView(preset.center,preset.zoom,{animate:true});
    };

    const initAtlas = async () => {
      if (atlasMap) { setTimeout(() => atlasMap.invalidateSize(),50); return; }
      try {
        await loadLeaflet();
        atlasMap = baseMap(atlasMapEl,[32.5,38.2],5);
        renderAtlas("old-testament");
        atlasLoading?.classList.add("is-hidden");
      } catch (error) {
        if (atlasLoading) atlasLoading.innerHTML = "<p>La carte n’a pas pu être chargée. Vous trouverez des atlas externes dans la section Ressources.</p>";
      }
    };

    mapSwitcher.querySelectorAll("[data-atlas-preset]").forEach(button => button.addEventListener("click", () => {
      mapSwitcher.querySelectorAll("[data-atlas-preset]").forEach(item => item.classList.toggle("is-active",item===button));
      initAtlas().then(() => renderAtlas(button.dataset.atlasPreset));
    }));

    const TIME_EVENTS = [
      {year:-1850,date:"vers 1850 av. J.-C.",title:"Abraham : de la Mésopotamie à Canaan",bible:"Le cycle d’Abraham fait passer le récit de l’est mésopotamien vers Canaan.",world:"Le Proche-Orient du IIe millénaire est structuré par plusieurs royaumes ; l’Égypte connaît le Moyen Empire.",center:[33.2,39.6],zoom:5,points:[["Ur",PLACES.ur],["Harran",PLACES.harran],["Canaan",PLACES.canaan]],route:[PLACES.ur,PLACES.harran,PLACES.canaan]},
      {year:-1700,date:"vers 1700 av. J.-C.",title:"Joseph et la descente en Égypte",bible:"Le cycle de Joseph conduit la famille de Jacob de Canaan vers l’Égypte.",world:"Babylone est associée à la période d’Hammourabi ; l’Égypte demeure une grande puissance régionale.",center:[31.4,33.2],zoom:6,points:[["Canaan",PLACES.canaan],["Égypte",PLACES.egypt]],route:[PLACES.canaan,PLACES.egypt]},
      {year:-1250,date:"vers 1250 av. J.-C.",title:"Moïse, l’Exode et le Sinaï",bible:"Le récit fondateur mène de l’Égypte au Sinaï puis vers Canaan.",world:"L’Égypte du Nouvel Empire constitue le grand contexte méridional ; Ramsès II appartient à cette période.",center:[30.2,33.6],zoom:6,points:[["Égypte",PLACES.egypt],["Sinaï",PLACES.sinai],["Canaan",PLACES.canaan]],route:[PLACES.egypt,PLACES.sinai,PLACES.canaan]},
      {year:-1200,date:"vers 1200 av. J.-C.",title:"Josué et le temps des Juges",bible:"Les traditions situent l’installation en Canaan et une période sans monarchie stable.",world:"Le Proche-Orient connaît de profondes recompositions à la fin de l’âge du Bronze.",center:[31.8,35.2],zoom:7,points:[["Canaan",PLACES.canaan],["Jérusalem",PLACES.jerusalem]]},
      {year:-1010,date:"1010–970 av. J.-C.",title:"David et Jérusalem",bible:"David établit Jérusalem comme centre politique du récit biblique.",world:"Les royaumes du Levant se structurent entre Égypte, Phénicie, Aram et puissances mésopotamiennes.",center:PLACES.jerusalem,zoom:8,points:[["Jérusalem",PLACES.jerusalem]]},
      {year:-933,date:"vers 933 av. J.-C.",title:"Division entre Israël et Juda",bible:"Après Salomon, le récit distingue le royaume d’Israël au nord et celui de Juda au sud.",world:"La région se trouve progressivement sous la pression des grandes puissances orientales.",center:[31.9,35.2],zoom:7,points:[["Samarie / Israël",PLACES.samaria],["Jérusalem / Juda",PLACES.jerusalem]]},
      {year:-750,date:"vers 750 av. J.-C.",title:"Amos, Osée et la menace assyrienne",bible:"Les prophètes critiquent l’injustice et l’infidélité du royaume du Nord.",world:"L’Assyrie devient la puissance dominante du Proche-Orient.",center:[33.8,39.0],zoom:5,points:[["Samarie",PLACES.samaria],["Ninive / Assyrie",PLACES.nineveh]],route:[PLACES.nineveh,PLACES.samaria]},
      {year:-721,date:"721/722 av. J.-C.",title:"Chute de Samarie",bible:"Le royaume d’Israël au nord disparaît après la conquête assyrienne.",world:"L’Empire assyrien domine une large partie du Levant.",center:[34.0,39.1],zoom:5,points:[["Samarie",PLACES.samaria],["Ninive",PLACES.nineveh]],route:[PLACES.nineveh,PLACES.samaria]},
      {year:-587,date:"587/586 av. J.-C.",title:"Jérusalem détruite ; Exil à Babylone",bible:"La prise de Jérusalem, la destruction du Temple et la déportation deviennent un tournant majeur.",world:"Babylone, sous Nabuchodonosor II, domine la région.",center:[32.2,40.0],zoom:5,points:[["Jérusalem",PLACES.jerusalem],["Babylone",PLACES.babylon]],route:[PLACES.jerusalem,PLACES.babylon]},
      {year:-538,date:"538 av. J.-C.",title:"Cyrus et le retour",bible:"Après la conquête perse de Babylone, des Judéens peuvent revenir vers Jérusalem.",world:"L’Empire perse remplace Babylone comme puissance dominante.",center:[32.5,39.6],zoom:5,points:[["Babylone",PLACES.babylon],["Jérusalem",PLACES.jerusalem]],route:[PLACES.babylon,PLACES.jerusalem]},
      {year:-450,date:"vers 450 av. J.-C.",title:"Esdras et Néhémie",bible:"Jérusalem se reconstruit et la communauté se réorganise autour de la Torah.",world:"La région appartient à l’Empire perse achéménide.",center:PLACES.jerusalem,zoom:8,points:[["Jérusalem",PLACES.jerusalem]]},
      {year:-332,date:"332 av. J.-C.",title:"Alexandre et le monde hellénistique",bible:"Le judaïsme entre dans un environnement profondément marqué par la langue et la culture grecques.",world:"Les conquêtes d’Alexandre mettent fin à la domination perse sur la région.",center:[33,34],zoom:5,points:[["Jérusalem",PLACES.jerusalem],["Athènes",PLACES.athens]],route:[PLACES.athens,PLACES.jerusalem]},
      {year:-167,date:"167–160 av. J.-C.",title:"Crise maccabéenne",bible:"La persécution d’Antiochus IV et la révolte maccabéenne bouleversent la Judée.",world:"La région se trouve dans l’espace des royaumes hellénistiques issus d’Alexandre.",center:PLACES.jerusalem,zoom:7,points:[["Jérusalem",PLACES.jerusalem]]},
      {year:-63,date:"63 av. J.-C.",title:"Pompée prend Jérusalem",bible:"La Judée passe durablement dans l’orbite politique de Rome.",world:"Rome devient la puissance décisive en Méditerranée orientale.",center:[36,25],zoom:5,points:[["Jérusalem",PLACES.jerusalem],["Rome",PLACES.rome]],route:[PLACES.rome,PLACES.jerusalem]},
      {year:-6,date:"vers 6 av. J.-C.",title:"Naissance de Jésus",bible:"Les récits de naissance situent Jésus dans le cadre du règne d’Hérode le Grand.",world:"Auguste est empereur de Rome.",center:[32.0,35.25],zoom:8,points:[["Bethléem",PLACES.bethlehem],["Nazareth",PLACES.nazareth],["Jérusalem",PLACES.jerusalem]]},
      {year:27,date:"vers 27 apr. J.-C.",title:"Jean-Baptiste et ministère de Jésus",bible:"Le ministère public de Jésus se déploie entre Galilée, Judée et Jérusalem.",world:"Tibère règne sur l’Empire romain.",center:[32.3,35.32],zoom:8,points:[["Nazareth",PLACES.nazareth],["Capharnaüm",PLACES.capernaum],["Samarie",PLACES.samaria],["Jérusalem",PLACES.jerusalem]]},
      {year:30,date:"vers 30 apr. J.-C.",title:"Passion, Résurrection, Pentecôte",bible:"Jérusalem devient le centre du récit de la Passion puis du commencement des Actes.",world:"La Judée est sous domination romaine.",center:PLACES.jerusalem,zoom:10,points:[["Jérusalem",PLACES.jerusalem]]},
      {year:45,date:"45–49 apr. J.-C.",title:"Première mission de Paul",bible:"À partir d’Antioche, la mission chrétienne s’étend vers Chypre et l’Asie Mineure.",world:"Les communautés circulent à l’intérieur de l’espace impérial romain.",center:[35.5,34.0],zoom:5,points:[["Antioche",PLACES.antioch],["Chypre",PLACES.cyprus],["Tarse",PLACES.tarsus]],route:[PLACES.antioch,PLACES.cyprus,PLACES.tarsus]},
      {year:50,date:"50–52 apr. J.-C.",title:"Deuxième mission de Paul",bible:"Paul traverse l’Asie Mineure et la Macédoine puis atteint Athènes et Corinthe.",world:"Claude est empereur ; les routes et villes romaines structurent les déplacements.",center:[39,26],zoom:5,points:[["Antioche",PLACES.antioch],["Philippes",PLACES.philippi],["Thessalonique",PLACES.thessalonica],["Athènes",PLACES.athens],["Corinthe",PLACES.corinth]],route:[PLACES.antioch,PLACES.philippi,PLACES.thessalonica,PLACES.athens,PLACES.corinth]},
      {year:60,date:"60–63 apr. J.-C.",title:"Paul à Rome",bible:"Le livre des Actes conduit finalement Paul jusqu’à Rome.",world:"Néron règne sur l’Empire romain.",center:[39,23],zoom:4,points:[["Jérusalem",PLACES.jerusalem],["Rome",PLACES.rome]],route:[PLACES.jerusalem,PLACES.rome]},
      {year:70,date:"70 apr. J.-C.",title:"Destruction de Jérusalem",bible:"Le Temple est détruit, événement majeur pour le judaïsme et l’arrière-plan des premières communautés chrétiennes.",world:"Titus prend Jérusalem dans le contexte de la guerre judéo-romaine.",center:PLACES.jerusalem,zoom:9,points:[["Jérusalem",PLACES.jerusalem],["Rome",PLACES.rome,true]]}
    ];

    const timeRange = mapSwitcher.querySelector("[data-time-map-range]");
    const timeDate = mapSwitcher.querySelector("[data-time-map-date]");
    const timeTitle = mapSwitcher.querySelector("[data-time-map-title]");
    const timeEvent = mapSwitcher.querySelector("[data-time-map-event]");
    const timePrev = mapSwitcher.querySelector("[data-time-prev]");
    const timeNext = mapSwitcher.querySelector("[data-time-next]");
    if (timeRange) timeRange.max = String(TIME_EVENTS.length - 1);

    const renderTime = (index) => {
      index = Math.max(0,Math.min(TIME_EVENTS.length-1,Number(index)||0));
      const item = TIME_EVENTS[index];
      if (timeRange) timeRange.value = String(index);
      if (timeDate) timeDate.textContent = item.date;
      if (timeTitle) timeTitle.textContent = item.title;
      if (timeEvent) {
        const paragraphs = timeEvent.querySelectorAll("p");
        if (paragraphs[0]) paragraphs[0].textContent = item.bible;
        if (paragraphs[1]) paragraphs[1].textContent = item.world;
      }
      if (timePrev) timePrev.disabled = index <= 0;
      if (timeNext) timeNext.disabled = index >= TIME_EVENTS.length - 1;
      if (!timeMap) return;
      if (timeLayer) timeLayer.remove();
      timeLayer = L.layerGroup().addTo(timeMap);
      (item.points || []).forEach(([name,coords,world]) => L.marker(coords,{icon:markerIcon(!!world)}).bindPopup(popup(name,item.title)).addTo(timeLayer));
      if (item.route) L.polyline(item.route,{color:"#a65765",weight:2.4,opacity:.8,dashArray:"6 6"}).addTo(timeLayer);
      timeMap.setView(item.center,item.zoom,{animate:true});
    };

    const initTime = async () => {
      if (timeMap) { setTimeout(() => timeMap.invalidateSize(),50); return; }
      try {
        await loadLeaflet();
        timeMap = baseMap(timeMapEl,[33.2,39.6],5);
        renderTime(Number(timeRange?.value || 0));
        timeLoading?.classList.add("is-hidden");
      } catch (error) {
        if (timeLoading) timeLoading.innerHTML = "<p>La carte n’a pas pu être chargée. Le lien vers Via Bible reste disponible dans cette vue.</p>";
      }
    };

    timeRange?.addEventListener("input", () => renderTime(timeRange.value));
    timePrev?.addEventListener("click", () => renderTime(Number(timeRange?.value || 0)-1));
    timeNext?.addEventListener("click", () => renderTime(Number(timeRange?.value || 0)+1));

    const activateMapPanel = (mode) => {
      mapTabs.forEach(tab => tab.setAttribute("aria-selected",tab.dataset.mapMode===mode ? "true" : "false"));
      mapPanels.forEach(panel => {
        const active = panel.dataset.mapPanel===mode;
        panel.hidden = !active;
        panel.classList.toggle("is-active",active);
      });
      if (mode === "atlas") initAtlas();
      if (mode === "time") initTime();
    };
    mapTabs.forEach(tab => tab.addEventListener("click",() => activateMapPanel(tab.dataset.mapMode)));

    const schematicMap = mapSwitcher.querySelector("[data-bible-schematic-map]");
    const routeButtons = [...mapSwitcher.querySelectorAll("[data-bible-route-button]")];
    const routeCards = [...mapSwitcher.querySelectorAll("[data-route-card]")];
    const routeFocusButtons = [...mapSwitcher.querySelectorAll("[data-bible-route-focus]")];

    const setRoute = (route) => {
      if (!schematicMap) return;
      const current = route || "all";
      schematicMap.dataset.activeRoute = current;
      routeButtons.forEach((button) => {
        const active = button.dataset.bibleRouteButton === current;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      routeCards.forEach((card) => card.classList.toggle("is-active", card.dataset.routeCard === current));
    };

    routeButtons.forEach((button) => {
      button.addEventListener("click", () => setRoute(button.dataset.bibleRouteButton));
    });

    routeFocusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.bibleRouteFocus || "all";
        setRoute(target);
      });
    });

    setRoute("all");
  }

})();

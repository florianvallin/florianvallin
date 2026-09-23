/*
 * MÉDIATHÈQUE PERSONNELLE PHILOSOPHAL
 * ----------------------------------
 * Index léger : les textes complets restent dans /textes/ et les livres dans /lecture/.
 * Pour ajouter une ressource personnelle, ajouter un objet à resources avec :
 * id, kind (texte|livre|podcast|audio|video|cours|article), title, creator, description, url, themes, people, keywords.
 * Pour les vidéos : videoType = "film" (film/documentaire/extrait) ou "cours" (cours/conférence).
 * Pour les cours écrits : formation, year, subject, format sont recommandés.
 * Les liens YouTube et SoundCloud sont détectés automatiquement et lus dans la médiathèque.
 * Pour une autre source qui fournit un lecteur embarqué, ajouter optionnellement :
 * embedUrl: "https://…", embedType: "generic" (ou "youtube" / "soundcloud").
 */
window.FV_MEDIATHEQUE_DATA = {
  "resources": [
    {
      "id": "texte:hume-causalite-experience-induction",
      "kind": "texte",
      "title": "Les lois du réel sont seulement induites à partir de notre expérience",
      "creator": "David Hume",
      "subtitle": "Enquête sur l’entendement humain",
      "description": "La relation de cause à effet peut-elle être connue par la raison seule, ou ne vient-elle que de l’expérience et de l’habitude ?",
      "url": "/textes/hume-causalite-experience-induction/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Science",
        "Théorie et expérience"
      ],
      "people": [
        "David Hume"
      ],
      "keywords": [
        "Hume",
        "Théorie et expérience · causalité et induction",
        "le problème de l’induction",
        "Enquête sur l’entendement humain",
        "1748, section IV, trad. A. Leroy, GF, 2006, p. 85–89"
      ]
    },
    {
      "id": "texte:kant-connaissance-experience-a-priori",
      "kind": "texte",
      "title": "La connaissance commence avec l’expérience, mais n’en dérive pas tout entière",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la raison pure",
      "description": "L’expérience est-elle seulement l’origine chronologique de notre connaissance, ou suffit-elle aussi à en expliquer le contenu et l’universalité ?",
      "url": "/textes/kant-connaissance-experience-a-priori/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Raison",
        "Théorie et expérience"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Théorie et expérience · empirique et a priori",
        "l’a priori kantien",
        "Critique de la raison pure",
        "1781–1787, Introduction, trad. A. Tremesaygues et B. Pacaud, PUF, 1986, p. 31–33"
      ]
    },
    {
      "id": "texte:claude-bernard-methode-experimentale",
      "kind": "texte",
      "title": "Une expérience scientifique obéit à la méthode expérimentale",
      "creator": "Claude Bernard",
      "subtitle": "Introduction à l’étude de la médecine expérimentale",
      "description": "Comment observation, hypothèse, raisonnement et expérimentation s’articulent-ils dans une véritable enquête scientifique ?",
      "url": "/textes/claude-bernard-methode-experimentale/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Science",
        "Théorie et expérience"
      ],
      "people": [
        "Claude Bernard"
      ],
      "keywords": [
        "Claude Bernard",
        "Théorie et expérience · méthode expérimentale",
        "la méthode expérimentale",
        "Introduction à l’étude de la médecine expérimentale",
        "1865, Flammarion, 2008, p. 65–66"
      ]
    },
    {
      "id": "texte:einstein-theorie-modele-realite",
      "kind": "texte",
      "title": "Une théorie scientifique est un modèle de la réalité",
      "creator": "Albert Einstein",
      "subtitle": "L’Évolution des idées en physique",
      "description": "Une théorie scientifique copie-t-elle le réel, ou construit-elle une représentation qui permet de l’expliquer ?",
      "url": "/textes/einstein-theorie-modele-realite/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Science",
        "Théorie et expérience"
      ],
      "people": [
        "Albert Einstein"
      ],
      "keywords": [
        "Einstein",
        "Théorie et expérience · modèle scientifique",
        "L’Évolution des idées en physique",
        "avec Leopold Infeld, 1938, Payot, 1974, p. 34–35"
      ]
    },
    {
      "id": "texte:bachelard-experience-theorie-materialisee",
      "kind": "texte",
      "title": "Une expérience scientifique est une théorie matérialisée",
      "creator": "Gaston Bachelard",
      "subtitle": "Le Nouvel Esprit scientifique",
      "description": "L’observation scientifique révèle-t-elle simplement un donné, ou construit-elle les phénomènes à partir de concepts et d’instruments ?",
      "url": "/textes/bachelard-experience-theorie-materialisee/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Science",
        "Théorie et expérience"
      ],
      "people": [
        "Gaston Bachelard"
      ],
      "keywords": [
        "Bachelard",
        "Théorie et expérience · phénoménotechnique",
        "la théorie matérialisée",
        "Le Nouvel Esprit scientifique",
        "1934, introduction, PUF, 1995, p. 16"
      ]
    },
    {
      "id": "texte:popper-theorie-falsifiable",
      "kind": "texte",
      "title": "Une théorie scientifique est avant tout une théorie falsifiable",
      "creator": "Karl R. Popper",
      "subtitle": "Conjectures et Réfutations",
      "description": "Qu’est-ce qui distingue une théorie scientifique d’une proposition qui échappe à toute mise à l’épreuve ?",
      "url": "/textes/popper-theorie-falsifiable/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Science",
        "Théorie et expérience"
      ],
      "people": [
        "Karl R. Popper"
      ],
      "keywords": [
        "Popper",
        "Théorie et expérience · falsifiabilité",
        "le critère de falsifiabilité",
        "Conjectures et Réfutations",
        "1953, trad. M. Irène et M. B. de Launay, Payot, 2006, p. 377–378"
      ]
    },
    {
      "id": "texte:bergson-experience-vecue-indicible",
      "kind": "texte",
      "title": "L’expérience vécue est indicible",
      "creator": "Henri Bergson",
      "subtitle": "Essai sur les données immédiates de la conscience",
      "description": "Le langage peut-il exprimer fidèlement la singularité mouvante de nos sensations et de nos sentiments ?",
      "url": "/textes/bergson-experience-vecue-indicible/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Théorie et expérience"
      ],
      "people": [
        "Henri Bergson"
      ],
      "keywords": [
        "Bergson",
        "Théorie et expérience · expérience vécue et langage",
        "Essai sur les données immédiates de la conscience",
        "1889, PUF, 2010, p. 98–99"
      ]
    },
    {
      "id": "texte:hegel-experience-vecue-mots",
      "kind": "texte",
      "title": "L’expérience vécue doit pouvoir être énoncée par des mots",
      "creator": "Georg Wilhelm Friedrich Hegel",
      "subtitle": "Philosophie de l’esprit",
      "description": "Une pensée inexprimable est-elle plus profonde que les mots, ou n’acquiert-elle sa détermination qu’en se formulant ?",
      "url": "/textes/hegel-experience-vecue-mots/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Théorie et expérience"
      ],
      "people": [
        "Georg Wilhelm Friedrich Hegel"
      ],
      "keywords": [
        "Hegel",
        "Théorie et expérience · pensée et langage",
        "Philosophie de l’esprit",
        "1827, Addition au § 462, trad. B. Bourgeois, Vrin, 1988, p. 560–561"
      ]
    },
    {
      "id": "texte:aristote-vie-matiere-ame",
      "kind": "texte",
      "title": "La vie se définit par la matière, mais aussi par la possession d’une âme",
      "creator": "Aristote",
      "subtitle": "De l’âme",
      "description": "Qu’est-ce qui distingue un corps vivant d’un corps inanimé, et quel rôle l’âme joue-t-elle dans cette définition ?",
      "url": "/textes/aristote-vie-matiere-ame/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Conscience"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Nature · vivant, matière et âme",
        "De l’âme",
        "IVe s. av. J.-C., II, 2, trad. R. Bodéüs, GF, 1993, p. 135–136 et 141–143"
      ]
    },
    {
      "id": "texte:diderot-vie-phenomene-materiel",
      "kind": "texte",
      "title": "La vie est un phénomène matériel",
      "creator": "Denis Diderot",
      "subtitle": "Entretien entre D’Alembert et Diderot",
      "description": "Faut-il supposer un principe immatériel pour expliquer le passage de la matière inerte à la sensibilité et à la vie ?",
      "url": "/textes/diderot-vie-phenomene-materiel/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Science"
      ],
      "people": [
        "Denis Diderot"
      ],
      "keywords": [
        "Diderot",
        "Nature · matérialisme et vivant",
        "Entretien entre D’Alembert et Diderot",
        "1769, in Œuvres philosophiques, Garnier, 1998, p. 274–277"
      ]
    },
    {
      "id": "texte:descartes-maitres-possesseurs-nature",
      "kind": "texte",
      "title": "La science doit devenir une philosophie pratique",
      "creator": "René Descartes",
      "subtitle": "Discours de la méthode",
      "description": "À quoi doit servir la connaissance scientifique de la nature : comprendre seulement, ou aussi améliorer concrètement la vie humaine ?",
      "url": "/textes/descartes-maitres-possesseurs-nature/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Nature"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Technique · maîtrise de la nature",
        "« maîtres et possesseurs de la nature »",
        "Discours de la méthode",
        "1637, VIe partie"
      ]
    },
    {
      "id": "texte:descartes-organisme-machine",
      "kind": "texte",
      "title": "La machine est un modèle pour comprendre les organismes vivants",
      "creator": "René Descartes",
      "subtitle": "Discours de la méthode",
      "description": "Jusqu’où peut-on comprendre le vivant sur le modèle d’un automate, et qu’est-ce qui distingue encore l’être humain de la machine ?",
      "url": "/textes/descartes-organisme-machine/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Technique",
        "Conscience"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Nature · organisme et machine",
        "l’animal-machine",
        "Discours de la méthode",
        "1637, Ve partie, in Œuvres et lettres, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 164–165"
      ]
    },
    {
      "id": "texte:kant-machine-modele-insuffisant-vivant",
      "kind": "texte",
      "title": "La machine est un modèle insuffisant pour penser le vivant",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la faculté de juger",
      "description": "Qu’est-ce qu’un organisme possède qu’une machine, même très complexe, ne peut pas expliquer ?",
      "url": "/textes/kant-machine-modele-insuffisant-vivant/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Technique",
        "Science"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Nature · organisme et finalité",
        "Critique de la faculté de juger",
        "1790, § 65, éd. et trad. M. Buhot de Launay, Gallimard, 1985, p. 337–338"
      ]
    },
    {
      "id": "texte:darwin-evolution-vivant-techniques",
      "kind": "texte",
      "title": "On ne peut pas assimiler l’évolution du vivant et l’histoire des techniques",
      "creator": "Charles Darwin",
      "subtitle": "L’Origine des espèces",
      "description": "Pourquoi l’analogie entre l’œil et un instrument fabriqué peut-elle induire en erreur sur l’origine des formes vivantes ?",
      "url": "/textes/darwin-evolution-vivant-techniques/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Science",
        "Technique"
      ],
      "people": [
        "Charles Darwin"
      ],
      "keywords": [
        "Darwin",
        "Nature · évolution et technique",
        "la sélection naturelle",
        "L’Origine des espèces",
        "1859, chap. IV, éd. et trad. D. Becquemont et E. Barbier, GF, 2008, p. 241"
      ]
    },
    {
      "id": "texte:claude-bernard-experimentation-animale",
      "kind": "texte",
      "title": "Il est légitime d’expérimenter sur les animaux",
      "creator": "Claude Bernard",
      "subtitle": "Introduction à l’étude de la médecine expérimentale",
      "description": "L’utilité scientifique et médicale suffit-elle à justifier l’expérimentation animale ?",
      "url": "/textes/claude-bernard-experimentation-animale/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Science",
        "Devoir"
      ],
      "people": [
        "Claude Bernard"
      ],
      "keywords": [
        "Bernard",
        "Nature · expérimentation animale",
        "Introduction à l’étude de la médecine expérimentale",
        "1865, GF, 1966, p. 153"
      ]
    },
    {
      "id": "texte:bentham-sensibilite-respect-animaux",
      "kind": "texte",
      "title": "Tout être sensible doit être respecté",
      "creator": "Jérémy Bentham",
      "subtitle": "Introduction aux principes de morale et de législation",
      "description": "La capacité de souffrir, plutôt que la raison ou le langage, doit-elle déterminer l’étendue de notre considération morale ?",
      "url": "/textes/bentham-sensibilite-respect-animaux/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Devoir",
        "Justice"
      ],
      "people": [
        "Jérémy Bentham"
      ],
      "keywords": [
        "Bentham",
        "Nature · sensibilité animale",
        "« Peuvent-ils souffrir ? »",
        "Introduction aux principes de morale et de législation",
        "1789, ch. XVII, trad. Vrin, 2011, p. 325"
      ]
    },
    {
      "id": "texte:uexkull-animal-monde-propre",
      "kind": "texte",
      "title": "L’animal n’est pas qu’un objet : il possède un monde propre",
      "creator": "Jakob von Uexküll",
      "subtitle": "Mondes animaux et monde humain",
      "description": "Chaque animal habite-t-il le même monde objectif, ou sélectionne-t-il un milieu propre à partir de ses capacités perceptives et actives ?",
      "url": "/textes/uexkull-animal-monde-propre/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Science"
      ],
      "people": [
        "Jakob von Uexküll"
      ],
      "keywords": [
        "Uexküll",
        "Nature · monde animal",
        "l’Umwelt",
        "Mondes animaux et monde humain",
        "1923, Pocket, 1965, p. 25–26 et 29–30"
      ]
    },
    {
      "id": "texte:lucrece-ame-esprit-corporels",
      "kind": "texte",
      "title": "L’âme et l’esprit sont corporels",
      "creator": "Lucrèce",
      "subtitle": "De la nature (De Rerum Natura)",
      "description": "Les interactions entre l’esprit et le corps permettent-elles de montrer que l’âme elle-même est matérielle ?",
      "url": "/textes/lucrece-ame-esprit-corporels/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Nature",
        "Conscience"
      ],
      "people": [
        "Lucrèce"
      ],
      "keywords": [
        "Lucrèce",
        "Nature · matière et esprit",
        "De la nature (De Rerum Natura)",
        "Ier s. av. J.-C., chant III, v. 137–176, trad. J. Kany-Turpin, GF, 1997, p. 189–191"
      ]
    },
    {
      "id": "texte:bergson-pensee-cerveau",
      "kind": "texte",
      "title": "On ne peut pas réduire la pensée au cerveau",
      "creator": "Henri Bergson",
      "subtitle": "L’Âme et le Corps",
      "description": "Même avec une connaissance parfaite du cerveau, pourrait-on déduire l’intégralité de la vie consciente ?",
      "url": "/textes/bergson-pensee-cerveau/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Nature",
        "Science"
      ],
      "people": [
        "Henri Bergson"
      ],
      "keywords": [
        "Bergson",
        "Conscience · esprit et cerveau",
        "L’Âme et le Corps",
        "1912, in L’Énergie spirituelle, PUF, 1999, p. 42–43"
      ]
    },
    {
      "id": "texte:aristote-main-outil-intelligence",
      "kind": "texte",
      "title": "La technique n’est pas l’usage d’organes, mais la manipulation d’instruments",
      "creator": "Aristote",
      "subtitle": "Les Parties des animaux",
      "description": "L’homme est-il intelligent parce qu’il possède des mains, ou possède-t-il des mains parce qu’il est intelligent ?",
      "url": "/textes/aristote-main-outil-intelligence/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Nature",
        "Travail"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Technique · main et instrument",
        "la main, instrument des instruments",
        "Les Parties des animaux",
        "IVe s. av. J.-C., § 10, 687b, trad. P. Louis modifiée, Belles Lettres, 2003, p. 136–138"
      ]
    },
    {
      "id": "texte:mauss-corps-instrument-naturel",
      "kind": "texte",
      "title": "Le corps est l’instrument le plus naturel de l’homme",
      "creator": "Marcel Mauss",
      "subtitle": "Les techniques du corps",
      "description": "Une technique suppose-t-elle toujours un outil extérieur au corps ?",
      "url": "/textes/mauss-corps-instrument-naturel/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Culture",
        "Travail"
      ],
      "people": [
        "Marcel Mauss"
      ],
      "keywords": [
        "Mauss",
        "Technique · techniques du corps",
        "les techniques du corps",
        "Les techniques du corps",
        "1936, dans Sociologie et Anthropologie, PUF, 1968, p. 371–372"
      ]
    },
    {
      "id": "texte:marx-alienation-travail-ouvrier",
      "kind": "texte",
      "title": "Le progrès technique peut devenir une cause d’aliénation du travail ouvrier",
      "creator": "Karl Marx",
      "subtitle": "Manuscrits de 1844",
      "description": "Comment le travail peut-il devenir extérieur au travailleur et l’éloigner de lui-même ?",
      "url": "/textes/marx-alienation-travail-ouvrier/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Travail",
        "Liberté"
      ],
      "people": [
        "Karl Marx"
      ],
      "keywords": [
        "Marx",
        "Technique · travail aliéné",
        "l’aliénation du travail",
        "Manuscrits de 1844",
        "1932 posth. pour la première publication, premier manuscrit, XIII, trad. J.-P. Gougeon, GF, 1996, p. 112–113"
      ]
    },
    {
      "id": "texte:simondon-harmonie-homme-machine",
      "kind": "texte",
      "title": "L’homme peut vivre en harmonie avec la machine",
      "creator": "Gilbert Simondon",
      "subtitle": "Du mode d’existence des objets techniques",
      "description": "La machine est-elle réellement l’ennemie de l’homme, ou cette opposition vient-elle d’une mauvaise compréhension de la technique ?",
      "url": "/textes/simondon-harmonie-homme-machine/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Culture",
        "Travail"
      ],
      "people": [
        "Gilbert Simondon"
      ],
      "keywords": [
        "Simondon",
        "Technique · homme et machine",
        "Du mode d’existence des objets techniques",
        "1958, Aubier, 2012, p. 9–11"
      ]
    },
    {
      "id": "texte:aristote-travail-manuel-esclave",
      "kind": "texte",
      "title": "Le travail manuel est réservé à l’esclave, le travail de l’esprit à l’homme libre",
      "creator": "Aristote",
      "subtitle": "Les Politiques",
      "description": "Aristote peut-il fonder dans la nature la séparation entre ceux qui commandent et ceux qui travaillent corporellement ?",
      "url": "/textes/aristote-travail-manuel-esclave/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Travail",
        "Liberté",
        "Technique"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Travail · esclavage et liberté",
        "l’esclavage naturel",
        "Les Politiques",
        "IVe s. av. J.-C., livre I, chap. 4, 1254ab, trad. P. Pellegrin, GF, 1990, p. 99–102"
      ]
    },
    {
      "id": "texte:marx-royaume-liberte-travail",
      "kind": "texte",
      "title": "Le travail rend libre s’il n’est pas contraint",
      "creator": "Karl Marx",
      "subtitle": "Le Capital",
      "description": "La liberté commence-t-elle par la suppression du travail ou par la réduction de sa part nécessaire ?",
      "url": "/textes/marx-royaume-liberte-travail/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Travail",
        "Liberté",
        "Technique"
      ],
      "people": [
        "Karl Marx"
      ],
      "keywords": [
        "Marx",
        "Travail · nécessité et liberté",
        "le royaume de la liberté",
        "Le Capital",
        "1867, livre III, chap. 48, trad. A. Cohen-Solal et G. Badia, Éditions Sociales, 1976, p. 740–742"
      ]
    },
    {
      "id": "texte:nietzsche-travail-jeu-creation",
      "kind": "texte",
      "title": "Ce n’est pas le jeu qui nous sauve du travail, mais la création",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Humain, trop humain",
      "description": "Que devient l’activité humaine lorsque le besoin matériel est satisfait mais que demeure l’ennui ?",
      "url": "/textes/nietzsche-travail-jeu-creation/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Travail",
        "Technique",
        "Art"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Travail · ennui, jeu et création",
        "Humain, trop humain",
        "1878, § 611, trad. R. Rovini, Gallimard, 1988, p. 320"
      ]
    },
    {
      "id": "texte:arendt-loisirs-monde-travail",
      "kind": "texte",
      "title": "Même nos loisirs sont sous l’emprise du monde du travail",
      "creator": "Hannah Arendt",
      "subtitle": "La Crise de la culture",
      "description": "Le temps de loisir nous libère-t-il réellement du cycle du travail et de la consommation ?",
      "url": "/textes/arendt-loisirs-monde-travail/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Travail",
        "Technique",
        "Culture"
      ],
      "people": [
        "Hannah Arendt"
      ],
      "keywords": [
        "Arendt",
        "Travail · loisirs et consommation",
        "La Crise de la culture",
        "1961–1968, trad. P. Lévy, Gallimard, 1989, p. 263–264"
      ]
    },
    {
      "id": "texte:kierkegaard-oisivete-ennui-travail",
      "kind": "texte",
      "title": "Le travail nous sauve de l’ennui, mais l’oisiveté est le seul bien véritable",
      "creator": "Søren Kierkegaard",
      "subtitle": "Ou bien… ou bien",
      "description": "Le travail est-il un bien en lui-même ou seulement un remède à l’ennui ?",
      "url": "/textes/kierkegaard-oisivete-ennui-travail/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Travail",
        "Liberté",
        "Bonheur"
      ],
      "people": [
        "Søren Kierkegaard"
      ],
      "keywords": [
        "Kierkegaard",
        "Travail · oisiveté et ennui",
        "Ou bien… ou bien",
        "trad. P.-H. Tisseau, dans Œuvres, Robert Laffont, 1993, p. 250–251"
      ]
    },
    {
      "id": "texte:critias-dieu-invention-controle",
      "kind": "texte",
      "title": "L’idée de Dieu est une invention destinée à contrôler les hommes",
      "creator": "Critias",
      "subtitle": "Fragment rapporté par Sextus Empiricus, Contre les mathématiciens",
      "description": "L’idée de Dieu pourrait-elle avoir été inventée pour prolonger la loi jusque dans les pensées et les actes cachés ?",
      "url": "/textes/critias-dieu-invention-controle/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "État",
        "Justice"
      ],
      "people": [
        "Critias"
      ],
      "keywords": [
        "Critias",
        "Religion · origine sociale de Dieu",
        "Fragment rapporté par Sextus Empiricus, Contre les mathématiciens",
        "IIe–IIIe s., IX, 54, recueilli dans Les Sophistes, dans Les Présocratiques, trad. J.-L. Poirier, Gallimard, « Bibliothèque de la Pléiade », 1988, p. 1145–1146"
      ]
    },
    {
      "id": "texte:freud-dieu-protection-paternelle",
      "kind": "texte",
      "title": "À travers Dieu, l’homme recherche une protection paternelle",
      "creator": "Sigmund Freud",
      "subtitle": "L’Avenir d’une illusion",
      "description": "La croyance religieuse provient-elle de preuves, ou de désirs humains anciens liés au besoin de protection ?",
      "url": "/textes/freud-dieu-protection-paternelle/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Inconscient",
        "Désir"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Religion · illusion et père",
        "l’illusion religieuse",
        "L’Avenir d’une illusion",
        "1927, trad. M. Bonaparte, PUF, 1973, p. 43"
      ]
    },
    {
      "id": "texte:pascal-solitude-misere-recherche-dieu",
      "kind": "texte",
      "title": "La solitude et la misère de l’homme le poussent à chercher Dieu",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "Face au silence de l’univers et à sa propre misère, l’être humain peut-il se satisfaire du divertissement ou doit-il chercher un sens au-delà du monde ?",
      "url": "/textes/pascal-solitude-misere-recherche-dieu/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Bonheur",
        "Raison"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Religion · misère et quête de sens",
        "Pensées",
        "1670 posth., éd. L. Brunschvicg, 693 (Lafuma 198), dans Pensées et opuscules, Hachette, 1967, p. 646"
      ]
    },
    {
      "id": "texte:anselme-preuve-ontologique-dieu",
      "kind": "texte",
      "title": "Dieu existe en vertu même de sa définition",
      "creator": "Saint Anselme de Cantorbéry",
      "subtitle": "Proslogion",
      "description": "Peut-on montrer que Dieu existe à partir de l’idée même d’un être dont on ne peut rien concevoir de plus grand ?",
      "url": "/textes/anselme-preuve-ontologique-dieu/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Démonstration",
        "Raison"
      ],
      "people": [
        "Saint Anselme de Cantorbéry"
      ],
      "keywords": [
        "Saint-Anselme",
        "Religion · preuve ontologique",
        "la preuve ontologique",
        "Proslogion",
        "chap. II–III, trad. A. Koyré, Vrin, 1967, p. 13–15"
      ]
    },
    {
      "id": "texte:hume-mal-monde-imparfait",
      "kind": "texte",
      "title": "L’existence du mal naturel montre que le monde n’est pas parfait",
      "creator": "David Hume",
      "subtitle": "Dialogues sur la religion naturelle",
      "description": "L’ordre du monde permet-il vraiment d’inférer l’existence d’un créateur parfaitement puissant et bienveillant quand la nature contient tant de souffrance ?",
      "url": "/textes/hume-mal-monde-imparfait/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Raison",
        "Nature"
      ],
      "people": [
        "David Hume"
      ],
      "keywords": [
        "Hume",
        "Religion · mal et preuve de Dieu",
        "le problème du mal",
        "Dialogues sur la religion naturelle",
        "1779, onzième partie, trad. M. Malherbe, Vrin, 1987, p. 134–140"
      ]
    },
    {
      "id": "texte:leibniz-raison-existence-monde",
      "kind": "texte",
      "title": "Le monde doit avoir une raison de son existence",
      "creator": "Gottfried Wilhelm Leibniz",
      "subtitle": "Essais de Théodicée",
      "description": "Pourquoi l’ensemble des choses contingentes ne peut-il pas contenir en lui-même la raison suffisante de sa propre existence ?",
      "url": "/textes/leibniz-raison-existence-monde/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Raison"
      ],
      "people": [
        "Gottfried Wilhelm Leibniz"
      ],
      "keywords": [
        "Leibniz",
        "Religion · raison suffisante",
        "le principe de raison suffisante",
        "Essais de Théodicée",
        "1710, première partie, § 7"
      ]
    },
    {
      "id": "texte:leibniz-meilleur-mondes-possibles",
      "kind": "texte",
      "title": "Dieu a créé le meilleur des mondes possibles",
      "creator": "Gottfried Wilhelm Leibniz",
      "subtitle": "De la production originelle des choses prise à sa racine",
      "description": "Comment défendre la bonté et la sagesse de Dieu alors que le monde contient souffrances, injustices et désordre ?",
      "url": "/textes/leibniz-meilleur-mondes-possibles/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Raison",
        "Justice"
      ],
      "people": [
        "Gottfried Wilhelm Leibniz"
      ],
      "keywords": [
        "Leibniz",
        "Religion · théodicée",
        "le meilleur des mondes possibles",
        "De la production originelle des choses prise à sa racine",
        "1697, dans Opuscules philosophiques choisis, trad. P. Schrecker, Vrin, 1969, p. 89–91"
      ]
    },
    {
      "id": "texte:pascal-coeur-raison-foi",
      "kind": "texte",
      "title": "La raison ne peut comprendre la foi",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "La raison peut-elle démontrer les premiers principes dont elle dépend elle-même, et peut-elle produire la foi religieuse ?",
      "url": "/textes/pascal-coeur-raison-foi/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Raison",
        "Vérité"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Religion · foi et raison",
        "« le cœur a ses raisons »",
        "Pensées",
        "1670 posth., éd. L. Brunschvicg, 282 (Lafuma 110), dans Pensées et opuscules, Hachette, 1967, p. 459–460"
      ]
    },
    {
      "id": "texte:robespierre-sentiment-religieux-morale-sociale",
      "kind": "texte",
      "title": "Le sentiment religieux maintient la morale sociale",
      "creator": "Maximilien Robespierre",
      "subtitle": "Sur les rapports des idées religieuses et morales avec les principes républicains et les fêtes nationales",
      "description": "Une société politique peut-elle supprimer brutalement les croyances religieuses sans fragiliser les motifs moraux qui soutiennent les conduites ?",
      "url": "/textes/robespierre-sentiment-religieux-morale-sociale/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Devoir",
        "État"
      ],
      "people": [
        "Maximilien Robespierre"
      ],
      "keywords": [
        "Robespierre",
        "Religion · morale sociale",
        "Sur les rapports des idées religieuses et morales avec les principes républicains et les fêtes nationales",
        "18 floréal de l’an II (7 mai 1794), Prévot, 1831, p. 18–20"
      ]
    },
    {
      "id": "texte:marx-religion-opium-peuple",
      "kind": "texte",
      "title": "La religion est « l’opium » qui tient le peuple asservi",
      "creator": "Karl Marx",
      "subtitle": "Critique de la philosophie du droit de Hegel",
      "description": "La religion est-elle seulement une illusion imposée d’en haut, ou aussi l’expression réelle d’une détresse sociale qu’elle rend supportable ?",
      "url": "/textes/marx-religion-opium-peuple/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "État",
        "Travail"
      ],
      "people": [
        "Karl Marx"
      ],
      "keywords": [
        "Marx",
        "Religion · critique sociale",
        "« la religion, opium du peuple »",
        "Critique de la philosophie du droit de Hegel",
        "1843, dans Marx et Engels, Sur la religion, Éd. Sociales, trad. Badia et alii, 1972, p. 40–41"
      ]
    },
    {
      "id": "texte:nietzsche-dieu-mort-valeurs",
      "kind": "texte",
      "title": "« Dieu est mort » mais les valeurs survivent à la destruction de la croyance",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Le Gai Savoir",
      "description": "La disparition de la croyance chrétienne suffit-elle à faire disparaître les valeurs, habitudes et institutions qui se sont construites autour d’elle ?",
      "url": "/textes/nietzsche-dieu-mort-valeurs/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Vérité",
        "Devoir"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Religion · mort de Dieu et valeurs",
        "la mort de Dieu",
        "Le Gai Savoir",
        "1882, § 343, trad. P. Klossowski, Gallimard, 1982, p. 237"
      ]
    },
    {
      "id": "texte:gauchet-religion-lien-social",
      "kind": "texte",
      "title": "Même sans religion, le lien social a besoin de religiosité pour subsister",
      "creator": "Marcel Gauchet",
      "subtitle": "Le Désenchantement du monde",
      "description": "La sortie institutionnelle de la religion signifie-t-elle la disparition complète de toute expérience religieuse ou symbolique ?",
      "url": "/textes/gauchet-religion-lien-social/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "État",
        "Devoir"
      ],
      "people": [
        "Marcel Gauchet"
      ],
      "keywords": [
        "Gauchet",
        "Religion · sécularisation et lien social",
        "la sortie de la religion",
        "Le Désenchantement du monde",
        "Gallimard, 1985, p. 133–134"
      ]
    },
    {
      "id": "texte:sartre-homme-prendre-place-dieu",
      "kind": "texte",
      "title": "C’est l’homme qui, comme créateur, va prendre la place de Dieu",
      "creator": "Jean-Paul Sartre",
      "subtitle": "L’existentialisme est un humanisme",
      "description": "Si Dieu n’existe pas et qu’aucune valeur n’est donnée d’avance, l’être humain doit-il inventer lui-même le sens et les valeurs de son existence ?",
      "url": "/textes/sartre-homme-prendre-place-dieu/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Religion",
        "Liberté",
        "Devoir"
      ],
      "people": [
        "Jean-Paul Sartre"
      ],
      "keywords": [
        "Sartre",
        "Religion · athéisme et création des valeurs",
        "l’existence précède l’essence",
        "L’existentialisme est un humanisme",
        "1946, Gallimard, 1996, p. 39–40 et 73–74"
      ]
    },
    {
      "id": "texte:aristote-demonstration-syllogisme-scientifique",
      "kind": "texte",
      "title": "Seul ce qui obéit aux règles formelles du raisonnement constitue une démonstration",
      "creator": "Aristote",
      "subtitle": "Seconds Analytiques",
      "description": "Quelles conditions les prémisses doivent-elles remplir pour qu’un raisonnement constitue une véritable démonstration scientifique ?",
      "url": "/textes/aristote-demonstration-syllogisme-scientifique/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Démonstration",
        "Raison"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Démonstration · syllogisme scientifique",
        "Seconds Analytiques",
        "IVe s. av. J.-C., I, 2, 71b 16, trad. J. Tricot, Vrin, 2000, p. 8–9"
      ]
    },
    {
      "id": "texte:pascal-principes-demonstration-indemontrables",
      "kind": "texte",
      "title": "Les principes de la démonstration ne sont pas démontrables",
      "creator": "Blaise Pascal",
      "subtitle": "De l’esprit géométrique",
      "description": "Une méthode parfaite pourrait-elle tout définir et tout démontrer sans jamais rencontrer un premier terme ou une première vérité ?",
      "url": "/textes/pascal-principes-demonstration-indemontrables/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Démonstration",
        "Raison"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Démonstration · principes",
        "De l’esprit géométrique",
        "1776 posth., section I, dans Pensées et opuscules, Hachette, 1967, p. 164–167"
      ]
    },
    {
      "id": "texte:kant-existence-pas-predicat",
      "kind": "texte",
      "title": "Les attributs des choses sont démontrables, mais pas leur existence",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la raison pure",
      "description": "Peut-on démontrer qu’une chose existe en ajoutant simplement l’existence à son concept ?",
      "url": "/textes/kant-existence-pas-predicat/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Démonstration",
        "Religion"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Démonstration · existence",
        "« l’existence n’est pas un prédicat »",
        "Critique de la raison pure",
        "1781–1787, Dialectique transcendantale, chap. III, section IV, trad. A. Tremesaygues et B. Pacaud, PUF, 2001, p. 429–430"
      ]
    },
    {
      "id": "texte:zenon-mouvement-demonstration-absurde",
      "kind": "texte",
      "title": "Il est possible de démontrer des choses absurdes",
      "creator": "Zénon d’Élée",
      "subtitle": "Arguments contre le mouvement",
      "description": "Un raisonnement rigoureux peut-il conduire à nier ce que l’expérience semble pourtant rendre évident, comme l’existence du mouvement ?",
      "url": "/textes/zenon-mouvement-demonstration-absurde/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Démonstration",
        "Raison"
      ],
      "people": [
        "Zénon d’Élée"
      ],
      "keywords": [
        "Zénon",
        "Démonstration · paradoxe",
        "les paradoxes de Zénon",
        "Arguments contre le mouvement",
        "présentés par Victor Brochard, Études de philosophie ancienne et de philosophie moderne, Vrin, 1954, p. 5–6"
      ]
    },
    {
      "id": "texte:nietzsche-logique-survie-verite",
      "kind": "texte",
      "title": "La logique n’a pas la vérité pour but, mais la survie",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Le Gai Savoir",
      "description": "Et si les catégories de la logique n’avaient pas été sélectionnées parce qu’elles sont vraies, mais parce qu’elles sont utiles à la vie ?",
      "url": "/textes/nietzsche-logique-survie-verite/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Raison",
        "Langage"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Vérité · critique de la logique",
        "Le Gai Savoir",
        "1882, § 111, trad. P. Klossowski, Gallimard, p. 141–142"
      ]
    },
    {
      "id": "texte:bergson-verite-action-pragmatisme",
      "kind": "texte",
      "title": "La vérité nous donne prise sur le réel et guide l’action",
      "creator": "Henri Bergson",
      "subtitle": "Sur le pragmatisme de William James, dans La Pensée et le Mouvant",
      "description": "Une affirmation vraie copie-t-elle le réel, ou vaut-elle surtout par la prise qu’elle nous donne sur une réalité mouvante ?",
      "url": "/textes/bergson-verite-action-pragmatisme/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Science",
        "Raison"
      ],
      "people": [
        "Henri Bergson"
      ],
      "keywords": [
        "Bergson",
        "Vérité · pragmatisme",
        "Sur le pragmatisme de William James, dans La Pensée et le Mouvant",
        "1938, PUF, 2009, p. 244–246"
      ]
    },
    {
      "id": "texte:sextus-empiricus-verite-hors-portee",
      "kind": "texte",
      "title": "La vérité est hors de notre portée",
      "creator": "Sextus Empiricus",
      "subtitle": "Esquisses pyrrhoniennes",
      "description": "Existe-t-il un moyen de justifier définitivement une affirmation sans tomber dans le désaccord, la régression à l’infini ou le cercle vicieux ?",
      "url": "/textes/sextus-empiricus-verite-hors-portee/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Démonstration",
        "Raison"
      ],
      "people": [
        "Sextus Empiricus"
      ],
      "keywords": [
        "Sextus Empiricus",
        "Scepticisme",
        "les cinq modes d’Agrippa",
        "Esquisses pyrrhoniennes",
        "I, 15, trad. P. Pellegrin, Le Seuil, 1997, p. 142–143"
      ]
    },
    {
      "id": "texte:aristote-verite-correspondance-reel",
      "kind": "texte",
      "title": "La vérité est la correspondance entre ce qui est pensé et ce qui est",
      "creator": "Aristote",
      "subtitle": "Métaphysique",
      "description": "Une pensée est-elle vraie parce qu’elle produit le réel, ou parce qu’elle affirme les choses telles qu’elles sont ?",
      "url": "/textes/aristote-verite-correspondance-reel/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Raison"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Vérité · correspondance",
        "la vérité comme correspondance",
        "Métaphysique",
        "IVe s. av. J.-C., livre thêta (9), chap. 10, trad. J. Tricot, Vrin, 1991, p. 54–55"
      ]
    },
    {
      "id": "texte:kant-verite-correspondance-diallele",
      "kind": "texte",
      "title": "La correspondance ne suffit pas à définir la vérité",
      "creator": "Emmanuel Kant",
      "subtitle": "Logique",
      "description": "Si la vérité est l’accord de la connaissance avec l’objet, comment vérifier cet accord sans comparer l’objet à travers cette même connaissance ?",
      "url": "/textes/kant-verite-correspondance-diallele/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Raison",
        "Démonstration"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Vérité · critère",
        "Logique",
        "1800, introduction VIII, trad. L. Guillermit, Vrin, 1989, p. 54–55"
      ]
    },
    {
      "id": "texte:platon-doute-haine-raison",
      "kind": "texte",
      "title": "Le doute illimité peut conduire à la haine de la raison",
      "creator": "Platon",
      "subtitle": "La République",
      "description": "Découvrir que certaines opinions sont réfutables doit-il conduire à examiner mieux, ou à ne plus croire en rien ?",
      "url": "/textes/platon-doute-haine-raison/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Raison"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Vérité · doute et raison",
        "la misologie",
        "La République",
        "livre VII, 538a–539a, trad. G. Leroux, GF, 2002, p. 396"
      ]
    },
    {
      "id": "texte:epictete-pratique-avant-demonstration",
      "kind": "texte",
      "title": "Il y a des choses plus urgentes que la recherche de la vérité",
      "creator": "Épictète",
      "subtitle": "Manuel",
      "description": "À quoi sert de savoir démontrer qu’il ne faut pas mentir si nous continuons pourtant à mentir ?",
      "url": "/textes/epictete-pratique-avant-demonstration/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Devoir",
        "Raison"
      ],
      "people": [
        "Épictète"
      ],
      "keywords": [
        "Épictète",
        "Vérité · théorie et pratique",
        "Manuel",
        "L. III, trad. M. Meunier, GF, 1964, p. 208"
      ]
    },
    {
      "id": "texte:platon-callicles-loi-nature-justice",
      "kind": "texte",
      "title": "Nous n’obéissons à la loi que par convention",
      "creator": "Platon",
      "subtitle": "Gorgias",
      "description": "La loi protège-t-elle réellement la justice, ou n’est-elle qu’une convention inventée par les plus faibles contre les plus forts ?",
      "url": "/textes/platon-callicles-loi-nature-justice/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "Nature",
        "État"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Justice · nature et convention",
        "Gorgias",
        "IVe s. av. J.-C., 482e–484a, trad. M. Canto, GF, 1987, p. 214–215"
      ]
    },
    {
      "id": "texte:sophocle-antigone-lois-non-ecrites",
      "kind": "texte",
      "title": "Il existe des lois non écrites supérieures aux lois humaines",
      "creator": "Sophocle",
      "subtitle": "Antigone",
      "description": "Faut-il obéir à une loi que l’on juge injuste ?",
      "url": "/textes/sophocle-antigone-lois-non-ecrites/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État"
      ],
      "people": [
        "Sophocle"
      ],
      "keywords": [
        "Sophocle",
        "Loi · justice · désobéissance",
        "les lois non écrites d’Antigone",
        "Antigone",
        "v. 442 av. J.-C., trad. P. Mazon, Belles Lettres, 1962, p. 102–104"
      ]
    },
    {
      "id": "texte:pascal-force-justice",
      "kind": "texte",
      "title": "La justice et la force doivent être mises ensemble",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "La justice peut-elle s’imposer sans force, et que devient la force lorsqu’elle se présente elle-même comme juste ?",
      "url": "/textes/pascal-force-justice/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Justice · force et institution",
        "justice et force",
        "Pensées",
        "posth., Lafuma 103 et 81 (Br. 298–299), Le Seuil, 1962, p. 63–64 et 57"
      ]
    },
    {
      "id": "texte:kant-justice-instituee-imparfaite",
      "kind": "texte",
      "title": "La justice instituée ne peut pas être parfaite",
      "creator": "Emmanuel Kant",
      "subtitle": "Idée d’une histoire universelle d’un point de vue cosmopolitique",
      "description": "Comment instituer un pouvoir juste si celui qui doit faire respecter la loi est lui-même un être humain capable d’abuser de sa liberté ?",
      "url": "/textes/kant-justice-instituee-imparfaite/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État",
        "Nature"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Justice · gouvernement et nature humaine",
        "le bois noueux de l’humanité",
        "Idée d’une histoire universelle d’un point de vue cosmopolitique",
        "1784, proposition VI, dans Opuscules sur l’histoire, trad. S. Piobetta, GF, p. 77–78"
      ]
    },
    {
      "id": "texte:thomas-more-utopie-egalite",
      "kind": "texte",
      "title": "La justice parfaite ne pourrait exister que si l’égalité était assurée",
      "creator": "Thomas More",
      "subtitle": "L’Utopie",
      "description": "Une société plus juste suppose-t-elle de supprimer la propriété privée et d’organiser collectivement le travail et les conditions de vie ?",
      "url": "/textes/thomas-more-utopie-egalite/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État",
        "Travail"
      ],
      "people": [
        "Thomas More"
      ],
      "keywords": [
        "Thomas More",
        "Justice · égalité et utopie",
        "L’Utopie",
        "1516, livre second, trad. M. Delcourt, GF, 1987, p. 139–147"
      ]
    },
    {
      "id": "texte:kant-societe-nations-justice",
      "kind": "texte",
      "title": "Une instance juridique internationale doit garantir la justice",
      "creator": "Emmanuel Kant",
      "subtitle": "Idée d’une histoire universelle d’un point de vue cosmopolitique",
      "description": "La justice entre les États peut-elle être garantie tant que chacun demeure souverain et libre d’entrer en conflit avec les autres ?",
      "url": "/textes/kant-societe-nations-justice/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État",
        "Histoire"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Justice · cosmopolitisme et droit international",
        "Idée d’une histoire universelle d’un point de vue cosmopolitique",
        "1784, proposition VII, dans Opuscules sur l’histoire, trad. S. Piobetta, GF, 1990, p. 79–80"
      ]
    },
    {
      "id": "texte:rawls-justice-equite-inegalites",
      "kind": "texte",
      "title": "La justice parfaite n’exclut pas l’existence de l’inégalité",
      "creator": "John Rawls",
      "subtitle": "Théorie de la justice",
      "description": "Des inégalités peuvent-elles être justes si les principes qui les autorisent ont été choisis impartialement et bénéficient aux plus défavorisés ?",
      "url": "/textes/rawls-justice-equite-inegalites/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État"
      ],
      "people": [
        "John Rawls"
      ],
      "keywords": [
        "Rawls",
        "Justice · équité et inégalités",
        "le voile d’ignorance",
        "Théorie de la justice",
        "1971, trad. C. Audard, Le Seuil, 1987, p. 38 et 41"
      ]
    },
    {
      "id": "texte:kant-desobeissance-loi-inconditionnelle",
      "kind": "texte",
      "title": "L’obéissance à la loi doit être inconditionnelle",
      "creator": "Emmanuel Kant",
      "subtitle": "Sur l’expression courante : il se peut que cela soit juste en théorie, mais en pratique cela ne vaut rien",
      "description": "Peut-on reconnaître juridiquement un droit de rébellion contre un pouvoir injuste sans détruire le principe même d’un ordre juridique commun ?",
      "url": "/textes/kant-desobeissance-loi-inconditionnelle/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État",
        "Devoir"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Justice · droit et obéissance",
        "Sur l’expression courante : il se peut que cela soit juste en théorie, mais en pratique cela ne vaut rien",
        "1793, trad. L. Guillermit, Vrin, 1967, p. 42–43"
      ]
    },
    {
      "id": "texte:thoreau-desobeir-lois-injustes",
      "kind": "texte",
      "title": "Il est parfois légitime de désobéir aux lois",
      "creator": "Henry David Thoreau",
      "subtitle": "La Désobéissance civile",
      "description": "Que doit faire un individu lorsqu’obéir à la loi revient à devenir personnellement l’agent d’une injustice ?",
      "url": "/textes/thoreau-desobeir-lois-injustes/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Justice",
        "État",
        "Liberté"
      ],
      "people": [
        "Henry David Thoreau"
      ],
      "keywords": [
        "Thoreau",
        "Justice · désobéissance civile",
        "la désobéissance civile",
        "La Désobéissance civile",
        "1849, trad. G. Villeneuve, Mille et une nuits, 1997, p. 23–24 et 28–29"
      ]
    },
    {
      "id": "texte:platon-glaucon-devoir-contrainte",
      "kind": "texte",
      "title": "Si nous le pouvions, nous désobéirions sans cesse au devoir",
      "creator": "Platon",
      "subtitle": "La République",
      "description": "Sommes-nous justes par choix moral ou seulement parce que la loi nous empêche de commettre l’injustice impunément ?",
      "url": "/textes/platon-glaucon-devoir-contrainte/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Justice"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Justice et nature humaine",
        "l’anneau de Gygès",
        "La République",
        "livre II, 359b–360d, trad. G. Leroux, GF, p. 123–125"
      ]
    },
    {
      "id": "texte:kant-agir-par-devoir",
      "kind": "texte",
      "title": "Agir conformément au devoir est une contrainte ; agir par devoir est une obligation",
      "creator": "Emmanuel Kant",
      "subtitle": "Fondements de la métaphysique des mœurs",
      "description": "Une action bonne en apparence possède-t-elle une véritable valeur morale si elle est accomplie par inclination plutôt que par devoir ?",
      "url": "/textes/kant-agir-par-devoir/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Raison"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Morale déontologique",
        "agir par devoir",
        "Fondements de la métaphysique des mœurs",
        "1785, 1re section, trad. V. Delbos, Delagrave, 1999, p. 36"
      ]
    },
    {
      "id": "texte:pascal-coutumes-conventions-justice",
      "kind": "texte",
      "title": "Les mœurs et les coutumes sont des conventions",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "Les règles morales et juridiques expriment-elles une justice universelle ou seulement les coutumes variables d’un lieu et d’une époque ?",
      "url": "/textes/pascal-coutumes-conventions-justice/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Justice"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Relativité des coutumes",
        "Pensées",
        "1669 posth., fragment 294 (Brunschvicg), Hachette, 1967, p. 465–467"
      ]
    },
    {
      "id": "texte:kant-humanite-fin-en-soi",
      "kind": "texte",
      "title": "Tout être rationnel doit reconnaître la validité de la loi morale",
      "creator": "Emmanuel Kant",
      "subtitle": "Fondements de la métaphysique des mœurs",
      "description": "Pourquoi une personne ne peut-elle jamais être traitée seulement comme un moyen au service d’une autre fin ?",
      "url": "/textes/kant-humanite-fin-en-soi/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Autrui",
        "Raison"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Morale déontologique",
        "l’humanité comme fin en soi",
        "Fondements de la métaphysique des mœurs",
        "1785, 2e section, trad. V. Delbos, Nathan, 1989, p. 56–60"
      ]
    },
    {
      "id": "texte:schopenhauer-pitie-fondement-morale",
      "kind": "texte",
      "title": "La pitié est la racine de la moralité",
      "creator": "Arthur Schopenhauer",
      "subtitle": "Le Fondement de la morale",
      "description": "Qu’est-ce qui peut nous conduire à vouloir directement le bien d’autrui plutôt que notre propre intérêt ?",
      "url": "/textes/schopenhauer-pitie-fondement-morale/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Autrui"
      ],
      "people": [
        "Arthur Schopenhauer"
      ],
      "keywords": [
        "Schopenhauer",
        "Éthique de la compassion",
        "Le Fondement de la morale",
        "1841, § 16, trad. A. Burdeau modifiée, Le Livre de poche, p. 155–156"
      ]
    },
    {
      "id": "texte:kant-raison-volonte-bonne",
      "kind": "texte",
      "title": "La morale doit être fondée sur la raison",
      "creator": "Emmanuel Kant",
      "subtitle": "Fondements de la métaphysique des mœurs",
      "description": "Si la raison nous rend parfois moins heureux, quelle peut être sa véritable fonction pratique ?",
      "url": "/textes/kant-raison-volonte-bonne/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Raison",
        "Bonheur"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Morale déontologique",
        "la bonne volonté",
        "Fondements de la métaphysique des mœurs",
        "1785, 1re section, trad. V. Delbos, Nathan, 1989, p. 31–32"
      ]
    },
    {
      "id": "texte:mill-qualite-plaisirs-morale",
      "kind": "texte",
      "title": "La morale interroge la qualité de notre bonheur, non sa quantité",
      "creator": "John Stuart Mill",
      "subtitle": "L’Utilitarisme",
      "description": "Tous les plaisirs se valent-ils, ou faut-il distinguer leur qualité pour penser le bonheur moral ?",
      "url": "/textes/mill-qualite-plaisirs-morale/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Bonheur"
      ],
      "people": [
        "John Stuart Mill"
      ],
      "keywords": [
        "Mill",
        "Utilitarisme",
        "« Socrate insatisfait plutôt qu’un imbécile satisfait »",
        "L’Utilitarisme",
        "1863, trad. P. L. Le Monnier, Alcan, 1889, p. 16–18"
      ]
    },
    {
      "id": "texte:kant-morale-dignite-bonheur",
      "kind": "texte",
      "title": "La morale n’a pas le bonheur pour but",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la raison pratique",
      "description": "La morale doit-elle nous apprendre à être heureux, ou seulement à nous rendre dignes du bonheur ?",
      "url": "/textes/kant-morale-dignite-bonheur/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Devoir",
        "Bonheur",
        "Religion"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Morale déontologique",
        "Critique de la raison pratique",
        "1788, trad. F. Picavet, PUF, 1997, p. 139–140"
      ]
    },
    {
      "id": "texte:schopenhauer-bonheur-absence-souffrance",
      "kind": "texte",
      "title": "Le bonheur comme absence de souffrance",
      "creator": "Arthur Schopenhauer",
      "subtitle": "Aphorismes sur la sagesse dans la vie",
      "description": "Le bonheur se mesure-t-il à l’intensité des plaisirs ou à l’absence de douleurs ?",
      "url": "/textes/schopenhauer-bonheur-absence-souffrance/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir"
      ],
      "people": [
        "Arthur Schopenhauer"
      ],
      "keywords": [
        "Schopenhauer",
        "Pessimisme moderne",
        "Aphorismes sur la sagesse dans la vie",
        "1851, trad. J.-A. Cantacuzène"
      ]
    },
    {
      "id": "texte:schopenhauer-bien-etre-negation",
      "kind": "texte",
      "title": "Le bien-être ne se ressent qu’après sa perte",
      "creator": "Arthur Schopenhauer",
      "subtitle": "Le Monde comme volonté et comme représentation",
      "description": "Pourquoi ressentons-nous vivement la douleur, tandis que le bien-être demeure presque invisible ?",
      "url": "/textes/schopenhauer-bien-etre-negation/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Temps"
      ],
      "people": [
        "Arthur Schopenhauer"
      ],
      "keywords": [
        "Schopenhauer",
        "Pessimisme moderne",
        "Le Monde comme volonté et comme représentation",
        "1819, trad. A. Burdeau"
      ]
    },
    {
      "id": "texte:epictete-depend-nous",
      "kind": "texte",
      "title": "La liberté commence par ce qui dépend de nous",
      "creator": "Épictète",
      "subtitle": "Manuel",
      "description": "Comment préserver sa liberté intérieure face à ce qui échappe à notre pouvoir ?",
      "url": "/textes/epictete-depend-nous/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Liberté",
        "Désir"
      ],
      "people": [
        "Épictète"
      ],
      "keywords": [
        "Épictète",
        "Stoïcisme",
        "ce qui dépend de nous",
        "Manuel",
        "IIe s. apr. J.-C."
      ]
    },
    {
      "id": "texte:epicure-plaisir-vie-heureuse",
      "kind": "texte",
      "title": "Hiérarchiser ses désirs pour vivre heureux",
      "creator": "Épicure",
      "subtitle": "Lettre à Ménécée",
      "description": "Comment distinguer les désirs et calculer les plaisirs qui conduisent réellement à la vie heureuse ?",
      "url": "/textes/epicure-plaisir-vie-heureuse/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir",
        "Raison"
      ],
      "people": [
        "Épicure"
      ],
      "keywords": [
        "Épicure",
        "Épicurisme",
        "la classification des désirs",
        "Lettre à Ménécée",
        "IIIe s. av. J.-C., trad. M. Solovine, Hermann, 1987, p. 100–102"
      ]
    },
    {
      "id": "texte:rousseau-desir-imagination-bonheur",
      "kind": "texte",
      "title": "Le bonheur se nourrit de ce que nous espérons",
      "creator": "Jean-Jacques Rousseau",
      "subtitle": "La Nouvelle Héloïse",
      "description": "Pourquoi l’attente et l’imagination procurent-elles davantage de bonheur que la possession de l’objet désiré ?",
      "url": "/textes/rousseau-desir-imagination-bonheur/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Bonheur",
        "Imagination"
      ],
      "people": [
        "Jean-Jacques Rousseau"
      ],
      "keywords": [
        "Rousseau",
        "Philosophie des Lumières",
        "La Nouvelle Héloïse",
        "1761, lettre VIII, Gallimard, 1993, p. 333"
      ]
    },
    {
      "id": "texte:schopenhauer-desir-souffrance-ennui",
      "kind": "texte",
      "title": "Le désir condamne la vie à osciller entre souffrance et ennui",
      "creator": "Arthur Schopenhauer",
      "subtitle": "Le Monde comme volonté et comme représentation",
      "description": "Pourquoi la satisfaction de nos désirs ne met-elle pas fin à la souffrance ?",
      "url": "/textes/schopenhauer-desir-souffrance-ennui/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Bonheur"
      ],
      "people": [
        "Arthur Schopenhauer"
      ],
      "keywords": [
        "Schopenhauer",
        "Pessimisme moderne",
        "Le Monde comme volonté et comme représentation",
        "1819, § 57, trad. A. Burdeau, PUF, 2003, p. 394–395"
      ]
    },
    {
      "id": "texte:spinoza-desir-puissance-exister",
      "kind": "texte",
      "title": "Le désir exprime notre puissance d’exister",
      "creator": "Baruch Spinoza",
      "subtitle": "Éthique",
      "description": "Désirons-nous une chose parce qu’elle est bonne, ou la jugeons-nous bonne parce que nous la désirons ?",
      "url": "/textes/spinoza-desir-puissance-exister/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Nature",
        "Conscience"
      ],
      "people": [
        "Baruch Spinoza"
      ],
      "keywords": [
        "Spinoza",
        "Rationalisme moderne",
        "Éthique",
        "livre III, propositions VI–VII et scolie de la proposition IX, trad. Ch. Appuhn, GF, 1965, p. 142–143 et 144–145"
      ]
    },
    {
      "id": "texte:levinas-caresse-desir-invisible",
      "kind": "texte",
      "title": "La caresse désire au-delà de ce qu’elle touche",
      "creator": "Emmanuel Lévinas",
      "subtitle": "Totalité et Infini",
      "description": "Pourquoi la caresse ne cherche-t-elle pas à saisir un objet, mais ce qui échappe encore au sensible ?",
      "url": "/textes/levinas-caresse-desir-invisible/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Amour",
        "Autrui"
      ],
      "people": [
        "Emmanuel Lévinas"
      ],
      "keywords": [
        "Lévinas",
        "Phénoménologie contemporaine",
        "Totalité et Infini",
        "1974, Nijhoff, p. 235"
      ]
    },
    {
      "id": "texte:stendhal-cristallisation-amour",
      "kind": "texte",
      "title": "La cristallisation pare l’être aimé de nouvelles perfections",
      "creator": "Stendhal",
      "subtitle": "De l’amour",
      "description": "Comment l’imagination amoureuse transforme-t-elle une personne réelle en un être couvert de perfections ?",
      "url": "/textes/stendhal-cristallisation-amour/",
      "source": "Textes",
      "section": "Autres",
      "themes": [
        "Amour",
        "Désir",
        "Imagination"
      ],
      "people": [
        "Stendhal"
      ],
      "keywords": [
        "Stendhal",
        "Littérature",
        "De l’amour",
        "1819, Gallimard, 2007, p. 31"
      ]
    },
    {
      "id": "texte:platon-mythe-androgyne-desir",
      "kind": "texte",
      "title": "Le désir amoureux poursuit l’unité perdue",
      "creator": "Platon",
      "subtitle": "Le Banquet",
      "description": "Pourquoi le désir amoureux prend-il la forme d’un manque et d’une recherche de l’unité perdue ?",
      "url": "/textes/platon-mythe-androgyne-desir/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Amour",
        "Nature"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Antiquité grecque",
        "le mythe de l’androgyne",
        "Le Banquet",
        "IVe s. av. J.-C., 189d–193d, trad. E. Chambry, GF, 1993, p. 49–52"
      ]
    },
    {
      "id": "texte:platon-socrate-temperance",
      "kind": "texte",
      "title": "Le bonheur de la tempérance",
      "creator": "Platon",
      "subtitle": "Gorgias",
      "description": "Le bonheur consiste-t-il à satisfaire sans cesse ses désirs ou à n’en être plus esclave ?",
      "url": "/textes/platon-socrate-temperance/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Antiquité grecque",
        "les tonneaux des Danaïdes",
        "Gorgias",
        "IVe s. av. J.-C., 493d–494b, trad. M. Canto"
      ]
    },
    {
      "id": "texte:platon-callicles-desirs",
      "kind": "texte",
      "title": "Le bonheur comme libre satisfaction des désirs",
      "creator": "Platon",
      "subtitle": "Gorgias",
      "description": "Le bonheur appartient-il à celui qui satisfait toutes ses passions sans rencontrer d’obstacle ?",
      "url": "/textes/platon-callicles-desirs/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Liberté"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Antiquité grecque",
        "Gorgias",
        "IVe s. av. J.-C., 491e–492c, trad. M. Canto"
      ]
    },
    {
      "id": "texte:seneque-vie-vertueuse",
      "kind": "texte",
      "title": "La vie heureuse est la vie vertueuse",
      "creator": "Sénèque",
      "subtitle": "La Vie heureuse",
      "description": "Le plaisir peut-il constituer le souverain bien s’il accompagne aussi les vies les plus honteuses ?",
      "url": "/textes/seneque-vie-vertueuse/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Devoir"
      ],
      "people": [
        "Sénèque"
      ],
      "keywords": [
        "Sénèque",
        "Stoïcisme",
        "La Vie heureuse",
        "vers 58, ch. VII, trad. J. Kany-Turpin, GF, 2005, p. 56–58"
      ]
    },
    {
      "id": "texte:augustin-temps-creation-monde",
      "kind": "texte",
      "title": "Il n’y a pas de temps avant la création du monde",
      "creator": "Saint Augustin",
      "subtitle": "Les Confessions",
      "description": "Peut-il y avoir un « avant » du monde si le temps lui-même appartient à ce qui a été créé ?",
      "url": "/textes/augustin-temps-creation-monde/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Religion"
      ],
      "people": [
        "Saint Augustin"
      ],
      "keywords": [
        "Augustin",
        "Temps · création",
        "Les Confessions",
        "v. 397–400, livre XI, chap. XIII, §§ 15–16, éd. Poujoulat et Raulx, 1864"
      ]
    },
    {
      "id": "texte:augustin-dieu-bonheur",
      "kind": "texte",
      "title": "Dieu seul peut garantir notre bonheur",
      "creator": "Saint Augustin",
      "subtitle": "La Vie heureuse",
      "description": "Pourquoi la sagesse ne conduit-elle pleinement au bonheur qu’en rattachant l’esprit à Dieu ?",
      "url": "/textes/augustin-dieu-bonheur/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Religion"
      ],
      "people": [
        "Saint Augustin"
      ],
      "keywords": [
        "Augustin",
        "Antiquité tardive",
        "La Vie heureuse",
        "IVe s., conclusion, §§ 33–36, trad. S. Dupuy-Trudelle, Gallimard, 1998, p. 112–114"
      ]
    },
    {
      "id": "texte:pascal-bonheur-avenir",
      "kind": "texte",
      "title": "Espérer le bonheur, c’est se condamner à ne jamais l’obtenir",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "Pourquoi notre attente d’un bonheur futur nous empêche-t-elle de vivre le seul temps qui nous appartient ?",
      "url": "/textes/pascal-bonheur-avenir/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Temps"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "XVIIe siècle",
        "Pensées",
        "1670, publication posthume, Laf. 47 (Br. 172), Le Seuil, 1962, p. 47–48"
      ]
    },
    {
      "id": "texte:freud-bonheur-episodique",
      "kind": "texte",
      "title": "Il n’y a aucun des biens de ce monde qui puisse rendre heureux durablement",
      "creator": "Sigmund Freud",
      "subtitle": "Le Malaise dans la culture",
      "description": "Pourquoi le bonheur intense ne peut-il être qu’épisodique, alors que la souffrance nous menace continuellement ?",
      "url": "/textes/freud-bonheur-episodique/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir",
        "Inconscient"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Psychanalyse",
        "Le Malaise dans la culture",
        "1929, trad. P. Cotet et al., chap. II, PUF, 2004, p. 18–19"
      ]
    },
    {
      "id": "texte:descartes-changer-desirs",
      "kind": "texte",
      "title": "Pour être heureux, il faut changer ses désirs",
      "creator": "René Descartes",
      "subtitle": "Discours de la méthode",
      "description": "Comment devenir heureux en réglant nos désirs sur ce qui dépend réellement de nous ?",
      "url": "/textes/descartes-changer-desirs/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir",
        "Liberté"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Rationalisme",
        "la morale par provision",
        "Discours de la méthode",
        "1637, troisième partie, GF, 1966, p. 53–54"
      ]
    },
    {
      "id": "texte:descartes-trois-regles-bonheur",
      "kind": "texte",
      "title": "Chacun peut se rendre heureux en observant trois règles de morale",
      "creator": "René Descartes",
      "subtitle": "Lettre à Élisabeth du 4 août 1645",
      "description": "Quelles règles permettent d’atteindre un contentement intérieur indépendant de la fortune ?",
      "url": "/textes/descartes-trois-regles-bonheur/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Liberté",
        "Raison"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Rationalisme",
        "Lettre à Élisabeth du 4 août 1645",
        "1645"
      ]
    },
    {
      "id": "texte:alain-bonheur-agir",
      "kind": "texte",
      "title": "Le vrai bonheur est le bonheur d’agir",
      "creator": "Alain",
      "subtitle": "Esquisses, La recherche du bonheur",
      "description": "Pourquoi le bonheur reçu finit-il par ennuyer, tandis que l’action difficile nous rend véritablement heureux ?",
      "url": "/textes/alain-bonheur-agir/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir"
      ],
      "people": [
        "Alain"
      ],
      "keywords": [
        "Alain",
        "Philosophie de l’action",
        "Esquisses, La recherche du bonheur",
        "PUF, 1968, p. 35"
      ]
    },
    {
      "id": "texte:foucault-commentaire-exces-sens",
      "kind": "texte",
      "title": "Tout discours dit plus que ce qu’il dit en apparence",
      "creator": "Michel Foucault",
      "subtitle": "Naissance de la clinique",
      "description": "Pourquoi tout commentaire suppose-t-il que le langage contient toujours plus de sens qu’il n’en exprime ?",
      "url": "/textes/foucault-commentaire-exces-sens/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Interprétation",
        "Langage",
        "Histoire"
      ],
      "people": [
        "Michel Foucault"
      ],
      "keywords": [
        "Foucault",
        "XXe siècle · philosophie du langage",
        "Naissance de la clinique",
        "1963, préface, PUF, 2003, p. XII"
      ]
    },
    {
      "id": "texte:averroes-interpreter-revelation",
      "kind": "texte",
      "title": "Pour le philosophe, il y a lieu d’interpréter les textes religieux",
      "creator": "Averroès",
      "subtitle": "Livre du discours décisif",
      "description": "Pourquoi la démonstration philosophique conduit-elle parfois à interpréter le sens manifeste du Texte révélé ?",
      "url": "/textes/averroes-interpreter-revelation/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Interprétation",
        "Religion",
        "Raison"
      ],
      "people": [
        "Averroès"
      ],
      "keywords": [
        "Averroès",
        "Moyen Âge · philosophie arabe",
        "Livre du discours décisif",
        "1179, §§ 18–19, 38, trad. M. Geoffroy, GF, 1996, p. 119 et 141"
      ]
    },
    {
      "id": "texte:krishnamurti-bonheur-sans-recherche",
      "kind": "texte",
      "title": "Le bonheur vient lorsqu’on cesse de le rechercher",
      "creator": "Jiddu Krishnamurti",
      "subtitle": "Le Sens du bonheur",
      "description": "Le bonheur peut-il apparaître tant que nous en faisons l’objet d’un effort et d’une recherche ?",
      "url": "/textes/krishnamurti-bonheur-sans-recherche/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Désir",
        "Vérité"
      ],
      "people": [
        "Jiddu Krishnamurti"
      ],
      "keywords": [
        "Krishnamurti",
        "Philosophie de l’Inde",
        "Le Sens du bonheur",
        "trad. C. Joyeux, Stock, 2006, p. 43–44"
      ]
    },
    {
      "id": "texte:freud-interpretations-delirantes",
      "kind": "texte",
      "title": "Il y a des interprétations délirantes",
      "creator": "Sigmund Freud",
      "subtitle": "Psychopathologie de la vie quotidienne",
      "description": "L’interprétation devient-elle délirante lorsqu’elle refuse toute place à l’accidentel ?",
      "url": "/textes/freud-interpretations-delirantes/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Interprétation",
        "Inconscient",
        "Raison"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Psychanalyse",
        "Psychopathologie de la vie quotidienne",
        "1901, trad. S. Jankélévitch, Payot, 1967, p. 292–294"
      ]
    },
    {
      "id": "texte:aristote-amour-amitie-veritable",
      "kind": "texte",
      "title": "De l’amour à l’amitié véritable",
      "creator": "Aristote",
      "subtitle": "Éthique à Nicomaque",
      "description": "Comment l’intensité de l’amour et la bienveillance peuvent-elles conduire à une amitié véritable ?",
      "url": "/textes/aristote-amour-amitie-veritable/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Amour",
        "Autrui",
        "Bonheur",
        "Devoir"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Antiquité grecque",
        "Éthique à Nicomaque",
        "livres VIII et IX, trad. Jules Tricot, Vrin"
      ]
    },
    {
      "id": "texte:genese-naissance-du-monde",
      "kind": "texte",
      "title": "La naissance du monde",
      "creator": "",
      "subtitle": "Genèse 1–2",
      "description": "Que signifient les deux récits de la création du monde et de l’être humain placés au commencement de la Genèse ?",
      "url": "/textes/genese-naissance-du-monde/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Nature",
        "Religion",
        "Autrui"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "« Au commencement »",
        "Genèse 1–2",
        "1,1–2,4 et 2,7–25"
      ]
    },
    {
      "id": "texte:genese-la-chute",
      "kind": "texte",
      "title": "La Chute",
      "creator": "",
      "subtitle": "Genèse 3",
      "description": "Comment le récit de la Chute met-il en scène la tentation, la faute, la honte et les ruptures qui en découlent ?",
      "url": "/textes/genese-la-chute/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Liberté",
        "Conscience",
        "Religion",
        "Travail",
        "Désir"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "le fruit défendu",
        "Genèse 3",
        "3,1–24"
      ]
    },
    {
      "id": "texte:genese-cain-abel",
      "kind": "texte",
      "title": "Caïn et Abel",
      "creator": "",
      "subtitle": "Genèse 4",
      "description": "Comment la jalousie transforme-t-elle le frère en rival, et que signifie être responsable de l’autre ?",
      "url": "/textes/genese-cain-abel/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Justice",
        "Liberté",
        "Autrui",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "« Suis-je le gardien de mon frère ? »",
        "Genèse 4",
        "4,1–15"
      ]
    },
    {
      "id": "texte:kant-desir-raison-imagination",
      "kind": "texte",
      "title": "Le désir naît de la raison et de l’imagination",
      "creator": "Emmanuel Kant",
      "subtitle": "Conjectures sur les débuts de l’histoire humaine",
      "description": "Comment la raison transforme-t-elle les besoins naturels en désirs toujours plus nombreux ?",
      "url": "/textes/kant-desir-raison-imagination/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Nature"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Philosophie critique",
        "Conjectures sur les débuts de l’histoire humaine",
        "1786, dans Opuscules sur l’histoire, trad. S. Piobetta, G.F., 1990, p. 151"
      ]
    },
    {
      "id": "texte:kant-quietude-inaccessible",
      "kind": "texte",
      "title": "La quiétude est inaccessible à l’homme",
      "creator": "Emmanuel Kant",
      "subtitle": "Anthropologie d’un point de vue pragmatique",
      "description": "Pourquoi une satisfaction absolue serait-elle incompatible avec l’activité et la vie humaines ?",
      "url": "/textes/kant-quietude-inaccessible/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Bonheur",
        "Nature"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Philosophie critique",
        "Anthropologie d’un point de vue pragmatique",
        "1798, § 61"
      ]
    },
    {
      "id": "texte:aristote-temps-nombre-mouvement",
      "kind": "texte",
      "title": "Le temps est le nombre du mouvement",
      "creator": "Aristote",
      "subtitle": "Physique",
      "description": "Le temps est-il une réalité indépendante, ou ce par quoi nous nombrons l’avant et l’après dans le mouvement ?",
      "url": "/textes/aristote-temps-nombre-mouvement/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Nature"
      ],
      "people": [
        "Aristote"
      ],
      "keywords": [
        "Aristote",
        "Antiquité grecque",
        "le temps, « nombre du mouvement »",
        "Physique",
        "IVe s. av. J.-C., livre IV, 219b sqq., trad. P. Pellegrin, GF, 2000, p. 252–253"
      ]
    },
    {
      "id": "texte:kant-temps-forme-a-priori",
      "kind": "texte",
      "title": "Le temps est une forme a priori de la sensibilité",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la raison pure",
      "description": "Le temps vient-il de l’expérience, ou faut-il déjà le présupposer pour pouvoir percevoir une succession ?",
      "url": "/textes/kant-temps-forme-a-priori/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Raison"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Philosophie critique",
        "le temps, forme a priori de la sensibilité",
        "Critique de la raison pure",
        "1781–1787, section 2, trad. A. Tremesaygues et B. Pacaud, PUF, 1975"
      ]
    },
    {
      "id": "texte:bergson-duree-espace",
      "kind": "texte",
      "title": "La durée vécue ne se laisse pas réduire à une ligne",
      "creator": "Henri Bergson",
      "subtitle": "Essai sur les données immédiates de la conscience",
      "description": "Que perdons-nous lorsque nous représentons le temps comme une suite de points juxtaposés dans l’espace ?",
      "url": "/textes/bergson-duree-espace/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Conscience"
      ],
      "people": [
        "Henri Bergson"
      ],
      "keywords": [
        "Bergson",
        "Philosophie de la durée",
        "la durée pure",
        "Essai sur les données immédiates de la conscience",
        "1889, PUF, 2010, p. 74–75"
      ]
    },
    {
      "id": "texte:pascal-divertissement-condition",
      "kind": "texte",
      "title": "Le divertissement nous détourne de notre condition",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "Pourquoi cherchons-nous sans cesse l’agitation alors même que nous prétendons désirer le repos ?",
      "url": "/textes/pascal-divertissement-condition/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Bonheur"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "XVIIe siècle",
        "le divertissement pascalien",
        "Pensées",
        "1670, publication posthume, Br. 139, Laf. 136, Hachette, 1967, p. 390–391 et 394"
      ]
    },
    {
      "id": "texte:sartre-existence-precede-essence",
      "kind": "texte",
      "title": "L’existence précède l’essence",
      "creator": "Jean-Paul Sartre",
      "subtitle": "L’Existentialisme est un humanisme",
      "description": "Si aucune nature humaine n’est donnée d’avance, qu’est-ce qui détermine ce que nous sommes ?",
      "url": "/textes/sartre-existence-precede-essence/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Liberté"
      ],
      "people": [
        "Jean-Paul Sartre"
      ],
      "keywords": [
        "Sartre",
        "Existentialisme",
        "« l’existence précède l’essence »",
        "L’Existentialisme est un humanisme",
        "1946, Gallimard, 1996, p. 26–30"
      ]
    },
    {
      "id": "texte:nietzsche-eternel-retour",
      "kind": "texte",
      "title": "Voudrais-tu revivre cette vie d’innombrables fois ?",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Le Gai Savoir",
      "description": "Que deviendrait notre manière de vivre si chaque instant devait revenir exactement de la même façon ?",
      "url": "/textes/nietzsche-eternel-retour/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Existence"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Critique des valeurs",
        "l’éternel retour",
        "Le Gai Savoir",
        "1882, § 341, trad. P. Klossowski, Gallimard, 1982, p. 232"
      ]
    },
    {
      "id": "texte:bouddha-sortir-cycle-renaissances",
      "kind": "texte",
      "title": "Se libérer du cycle des renaissances",
      "creator": "Siddhartha Gautama, dit Bouddha",
      "subtitle": "Dhammapada, les stances de la loi",
      "description": "En quel sens la délivrance consiste-t-elle à se détacher des désirs, des liens et du cycle des renaissances ?",
      "url": "/textes/bouddha-sortir-cycle-renaissances/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Temps",
        "Religion"
      ],
      "people": [
        "Siddhartha Gautama, dit Bouddha"
      ],
      "keywords": [
        "Bouddha",
        "Philosophie indienne",
        "le saṃsāra",
        "Dhammapada, les stances de la loi",
        "VIe s. av. J.-C., trad. J.-P. Osier, Flammarion, 1999, p. 126–128"
      ]
    },
    {
      "id": "texte:descartes-langage-pensee",
      "kind": "texte",
      "title": "Seul le langage humain exprime des pensées",
      "creator": "René Descartes",
      "subtitle": "Lettre du 23 novembre 1646 au marquis de Newcastle",
      "description": "La parole permet-elle de distinguer une pensée véritable d’un simple comportement appris ou passionnel ?",
      "url": "/textes/descartes-langage-pensee/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Conscience"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Rationalisme moderne",
        "Lettre du 23 novembre 1646 au marquis de Newcastle",
        "1646, in Œuvres et lettres, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 1255–1266"
      ]
    },
    {
      "id": "texte:benveniste-communication-animale-langage-humain",
      "kind": "texte",
      "title": "Les animaux communiquent par signaux, mais ne peuvent pas dialoguer",
      "creator": "Émile Benveniste",
      "subtitle": "« Communication animale et langage humain », Problèmes de linguistique générale",
      "description": "La communication des abeilles possède-t-elle les propriétés qui font du langage humain un véritable langage ?",
      "url": "/textes/benveniste-communication-animale-langage-humain/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Nature"
      ],
      "people": [
        "Émile Benveniste"
      ],
      "keywords": [
        "Benveniste",
        "Linguistique structurale",
        "« Communication animale et langage humain », Problèmes de linguistique générale",
        "1966, t. I, Gallimard, p. 59–61"
      ]
    },
    {
      "id": "texte:saussure-signe-linguistique-arbitraire",
      "kind": "texte",
      "title": "Le signe linguistique est arbitraire",
      "creator": "Ferdinand de Saussure",
      "subtitle": "Cours de linguistique générale",
      "description": "Pourquoi n’existe-t-il pas de lien naturel entre le son d’un mot et le concept qu’il désigne ?",
      "url": "/textes/saussure-signe-linguistique-arbitraire/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Culture"
      ],
      "people": [
        "Ferdinand de Saussure"
      ],
      "keywords": [
        "Saussure",
        "Linguistique structurale",
        "l’arbitraire du signe",
        "Cours de linguistique générale",
        "1916, Payot, 1996, p. 99–101"
      ]
    },
    {
      "id": "texte:cassirer-langage-reel-construction",
      "kind": "texte",
      "title": "Le langage ne reproduit pas le réel",
      "creator": "Ernst Cassirer",
      "subtitle": "Essai sur l’homme",
      "description": "Les mots copient-ils les choses, ou construisent-ils une manière déterminée de les voir ?",
      "url": "/textes/cassirer-langage-reel-construction/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Raison"
      ],
      "people": [
        "Ernst Cassirer"
      ],
      "keywords": [
        "Cassirer",
        "Philosophie des formes symboliques",
        "Essai sur l’homme",
        "1944, chap. 8 « Le langage », Minuit, 1975, p. 193"
      ]
    },
    {
      "id": "texte:nietzsche-langue-conception-monde",
      "kind": "texte",
      "title": "La langue nous enferme dans une conception du monde",
      "creator": "Friedrich Nietzsche",
      "subtitle": "La Généalogie de la morale",
      "description": "La grammaire nous conduit-elle à croire à des sujets, des causes et une liberté qui n’existent peut-être pas comme nous l’imaginons ?",
      "url": "/textes/nietzsche-langue-conception-monde/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Liberté"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Critique des valeurs",
        "La Généalogie de la morale",
        "1887, I, § 13, trad. P. Wotling, Le Livre de poche, p. 96–100"
      ]
    },
    {
      "id": "texte:zamenhof-esperanto-langue-artificielle",
      "kind": "texte",
      "title": "Une langue artificielle peut-elle devenir une langue commune ?",
      "creator": "Ludwik Zamenhof",
      "subtitle": "Déclaration sur l’essence de l’espérantisme",
      "description": "Une langue construite peut-elle être neutre, collective et suffisamment vivante pour relier des locuteurs de langues différentes ?",
      "url": "/textes/zamenhof-esperanto-langue-artificielle/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Politique"
      ],
      "people": [
        "Ludwik Zamenhof"
      ],
      "keywords": [
        "Zamenhof",
        "Espérantisme",
        "Déclaration sur l’essence de l’espérantisme",
        "1905, Congrès universel d’Espéranto de Boulogne-sur-Mer, août 1905"
      ]
    },
    {
      "id": "texte:sartre-langage-poesie-fin",
      "kind": "texte",
      "title": "Le langage, en poésie, est une fin et non un moyen",
      "creator": "Jean-Paul Sartre",
      "subtitle": "Qu’est-ce que la littérature ?",
      "description": "Le poète utilise-t-il les mots comme des instruments, ou les traite-t-il comme des choses dotées d’une présence propre ?",
      "url": "/textes/sartre-langage-poesie-fin/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Art"
      ],
      "people": [
        "Jean-Paul Sartre"
      ],
      "keywords": [
        "Sartre",
        "Existentialisme et littérature",
        "Qu’est-ce que la littérature ?",
        "1948, Gallimard, p. 17–19"
      ]
    },
    {
      "id": "texte:austin-mots-accomplir-actions",
      "kind": "texte",
      "title": "Avec des mots, on peut accomplir des actions",
      "creator": "John Langshaw Austin",
      "subtitle": "« Performatif-constatif », La Philosophie analytique",
      "description": "Tous les énoncés servent-ils à décrire le monde, ou certains accomplissent-ils une action au moment même où ils sont prononcés ?",
      "url": "/textes/austin-mots-accomplir-actions/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Vérité"
      ],
      "people": [
        "John Langshaw Austin"
      ],
      "keywords": [
        "Austin",
        "Philosophie du langage ordinaire",
        "les énoncés performatifs",
        "« Performatif-constatif », La Philosophie analytique",
        "1962 [posth.], trad. L. Aubert et A. L. Hacker, Minuit, p. 271–273"
      ]
    },
    {
      "id": "texte:platon-rhetorique-puissance-dialogue",
      "kind": "texte",
      "title": "La rhétorique est un dangereux instrument de puissance",
      "creator": "Platon",
      "subtitle": "Gorgias",
      "description": "La puissance de persuader suffit-elle à faire de la rhétorique un art légitime, ou faut-il subordonner la parole à la recherche du vrai ?",
      "url": "/textes/platon-rhetorique-puissance-dialogue/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Politique"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Antiquité grecque",
        "Gorgias",
        "IVe s. av. J.-C., 456b–458a, trad. M. Canto modifiée, GF, 1993, p. 145–148"
      ]
    },
    {
      "id": "texte:levinas-parler-esclave-egal",
      "kind": "texte",
      "title": "Même quand on parle à un esclave, on parle à un égal",
      "creator": "Emmanuel Lévinas",
      "subtitle": "Difficile Liberté",
      "description": "La conversation peut-elle instaurer une égalité morale avant même que nous connaissions vraiment notre interlocuteur ?",
      "url": "/textes/levinas-parler-esclave-egal/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Langage",
        "Autrui"
      ],
      "people": [
        "Emmanuel Lévinas"
      ],
      "keywords": [
        "Lévinas",
        "Phénoménologie et éthique",
        "Difficile Liberté",
        "1952, Albin Michel, 1976, p. 21"
      ]
    },
    {
      "id": "texte:popper-psychanalyse-non-scientifique",
      "kind": "texte",
      "title": "La psychanalyse semble tout expliquer parce que rien ne peut la réfuter",
      "creator": "Karl R. Popper",
      "subtitle": "Conjectures et Réfutations",
      "description": "Une théorie est-elle vraiment scientifique si tout comportement imaginable peut toujours être interprété comme une confirmation ?",
      "url": "/textes/popper-psychanalyse-non-scientifique/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Inconscient",
        "Science"
      ],
      "people": [
        "Karl R. Popper"
      ],
      "keywords": [
        "Popper",
        "Inconscient · science et réfutabilité",
        "le critère de démarcation",
        "Conjectures et Réfutations",
        "1953, trad. M.I.B. et M. de Launay, Payot, 2006, p. 61–63"
      ]
    },
    {
      "id": "texte:sartre-inconscient-mauvaise-foi",
      "kind": "texte",
      "title": "L’inconscient reconduit le problème de la mauvaise foi",
      "creator": "Jean-Paul Sartre",
      "subtitle": "L’Être et le Néant",
      "description": "L’hypothèse d’une censure inconsciente explique-t-elle vraiment le refoulement, ou déplace-t-elle simplement le problème de la conscience qui se dissimule à elle-même ?",
      "url": "/textes/sartre-inconscient-mauvaise-foi/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Inconscient",
        "Liberté"
      ],
      "people": [
        "Jean-Paul Sartre"
      ],
      "keywords": [
        "Sartre",
        "Inconscient · liberté et mauvaise foi",
        "la mauvaise foi",
        "L’Être et le Néant",
        "1943, chap. III, « La mauvaise foi », Gallimard, 1976, p. 88 et 91–92"
      ]
    },
    {
      "id": "texte:wittgenstein-inconscient-mythe",
      "kind": "texte",
      "title": "L’inconscient freudien fonctionne comme une explication mythologique",
      "creator": "Ludwig Wittgenstein",
      "subtitle": "« Conversations sur Freud », in Leçons et conversations",
      "description": "Une interprétation séduisante du rêve ou de l’inconscient est-elle pour autant une explication comparable à une loi scientifique ?",
      "url": "/textes/wittgenstein-inconscient-mythe/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Inconscient",
        "Interprétation"
      ],
      "people": [
        "Ludwig Wittgenstein"
      ],
      "keywords": [
        "Wittgenstein",
        "Inconscient · critique de l’interprétation",
        "« Conversations sur Freud », in Leçons et conversations",
        "1966 posth., trad. J. Fauve, Gallimard, 1992, p. 89–91, 99"
      ]
    },
    {
      "id": "texte:freud-inconscient-hypothese",
      "kind": "texte",
      "title": "L’hypothèse de l’inconscient est nécessaire et légitime",
      "creator": "Sigmund Freud",
      "subtitle": "L’Inconscient, in Métapsychologie",
      "description": "Pourquoi admettre des processus psychiques inconscients si la conscience ne les perçoit pas directement ?",
      "url": "/textes/freud-inconscient-hypothese/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Inconscient",
        "Conscience"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Inconscient · hypothèse psychanalytique",
        "l’hypothèse de l’inconscient",
        "L’Inconscient, in Métapsychologie",
        "1915, trad. J. Laplanche et J.-B. Pontalis, Gallimard, 1943, p. 66–67"
      ]
    },
    {
      "id": "texte:freud-reve-rebus",
      "kind": "texte",
      "title": "Le rêve est un rébus à traduire",
      "creator": "Sigmund Freud",
      "subtitle": "L’Interprétation des rêves",
      "description": "Le rêve doit-il être lu comme une image absurde, ou traduit comme l’expression déformée de pensées latentes ?",
      "url": "/textes/freud-reve-rebus/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Inconscient",
        "Interprétation"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Inconscient · rêve et interprétation",
        "contenu manifeste et contenu latent",
        "L’Interprétation des rêves",
        "1900, trad. I. Meyerson, PUF, 1967, p. 241"
      ]
    },
    {
      "id": "texte:leibniz-petites-perceptions",
      "kind": "texte",
      "title": "La plupart de nos perceptions échappent à la conscience",
      "creator": "Gottfried Wilhelm Leibniz",
      "subtitle": "Nouveaux essais sur l’entendement humain",
      "description": "Tout ce qui affecte notre âme devient-il conscient, ou une multitude de perceptions demeure-t-elle en dessous du seuil de l’aperception ?",
      "url": "/textes/leibniz-petites-perceptions/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Inconscient"
      ],
      "people": [
        "Gottfried Wilhelm Leibniz"
      ],
      "keywords": [
        "Leibniz",
        "Conscience · petites perceptions",
        "les petites perceptions",
        "Nouveaux essais sur l’entendement humain",
        "1765 posth., préface, trad. J. Brunschwig, GF, 1990, p. 41–42"
      ]
    },
    {
      "id": "texte:pascal-moi-introuvable",
      "kind": "texte",
      "title": "Le « moi » est une réalité introuvable",
      "creator": "Blaise Pascal",
      "subtitle": "Pensées",
      "description": "Qu’aimons-nous réellement chez une personne si son corps, sa mémoire, son jugement et toutes ses qualités peuvent changer ?",
      "url": "/textes/pascal-moi-introuvable/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Autrui"
      ],
      "people": [
        "Blaise Pascal"
      ],
      "keywords": [
        "Pascal",
        "Conscience · identité du moi",
        "« Qu’est-ce que le moi ? »",
        "Pensées",
        "1670 posth., Br. 323 (Laf. 688), Hachette, 1967, p. 478–479"
      ]
    },
    {
      "id": "texte:marx-conscience-vie-materielle",
      "kind": "texte",
      "title": "Ce n’est pas la conscience qui détermine la vie",
      "creator": "Karl Marx",
      "subtitle": "L’Idéologie allemande",
      "description": "Les idées et la conscience ont-elles une existence autonome, ou sont-elles produites à partir de la vie matérielle et sociale des hommes ?",
      "url": "/textes/marx-conscience-vie-materielle/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Société"
      ],
      "people": [
        "Karl Marx"
      ],
      "keywords": [
        "Marx",
        "Conscience · matérialisme et idéologie",
        "la vie détermine la conscience",
        "L’Idéologie allemande",
        "1846, trad. G. Badia, Éditions Sociales, 1966, p. 35–37"
      ]
    },
    {
      "id": "texte:locke-identite-conscience-memoire",
      "kind": "texte",
      "title": "La conscience et la mémoire font l’identité personnelle",
      "creator": "John Locke",
      "subtitle": "Identité et différence (Essai philosophique concernant l’entendement humain)",
      "description": "Qu’est-ce qui fait qu’une personne demeure la même à travers le temps si son corps et sa substance peuvent changer ?",
      "url": "/textes/locke-identite-conscience-memoire/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Temps"
      ],
      "people": [
        "John Locke"
      ],
      "keywords": [
        "Locke",
        "Conscience · identité personnelle",
        "Identité et différence (Essai philosophique concernant l’entendement humain)",
        "1690–1694, II, XXVII, trad. É. Balibar, revue par G. Brykman, Le Seuil, 1998, p. 165–167"
      ]
    },
    {
      "id": "texte:descartes-cogito-chose-pense",
      "kind": "texte",
      "title": "Je suis, j’existe : le sujet se découvre comme chose qui pense",
      "creator": "René Descartes",
      "subtitle": "Méditations métaphysiques",
      "description": "Que reste-t-il absolument certain lorsque le doute porte sur le monde, le corps et jusqu’à l’existence des choses extérieures ?",
      "url": "/textes/descartes-cogito-chose-pense/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Raison"
      ],
      "people": [
        "René Descartes"
      ],
      "keywords": [
        "Descartes",
        "Conscience · certitude du sujet",
        "le cogito cartésien",
        "Méditations métaphysiques",
        "1641, 2e méditation, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 274–277"
      ]
    },
    {
      "id": "texte:platon-connais-toi-toi-meme",
      "kind": "texte",
      "title": "« Connais-toi toi-même » : l’âme se connaît dans le miroir d’une autre âme",
      "creator": "Platon",
      "subtitle": "Alcibiade majeur",
      "description": "Peut-on se connaître directement, ou la connaissance de soi exige-t-elle le détour par une autre âme et par ce qu’il y a de plus divin en elle ?",
      "url": "/textes/platon-connais-toi-toi-meme/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Autrui"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Conscience · connaissance de soi",
        "« Connais-toi toi-même »",
        "Alcibiade majeur",
        "[IVe s. av. J.-C.], 132c–133e, trad. C. Marboeuf et J.-F. Pradeau, GF, 2000, p. 179–184"
      ]
    },
    {
      "id": "texte:schopenhauer-sujet-inconnaissable",
      "kind": "texte",
      "title": "Le sujet connaît tout mais n’est jamais connu",
      "creator": "Arthur Schopenhauer",
      "subtitle": "Le Monde comme volonté et représentation",
      "description": "Le sujet peut-il devenir pour lui-même un objet de connaissance, ou toute connaissance suppose-t-elle déjà ce sujet sans jamais pouvoir le saisir ?",
      "url": "/textes/schopenhauer-sujet-inconnaissable/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience"
      ],
      "people": [
        "Arthur Schopenhauer"
      ],
      "keywords": [
        "Schopenhauer",
        "Conscience · sujet et connaissance",
        "Le Monde comme volonté et représentation",
        "[1819], § 2, t. I, trad. C. Sommer, V. Stanek et M. Dautrey, Gallimard, 2009, p. 80–81"
      ]
    },
    {
      "id": "texte:nietzsche-conscience-communication-gregaire",
      "kind": "texte",
      "title": "La conscience grégaire : elle naît du besoin de communiquer",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Le Gai Savoir",
      "description": "La conscience exprime-t-elle notre individualité la plus profonde, ou n’est-elle qu’une couche superficielle formée par les besoins de communication de la vie sociale ?",
      "url": "/textes/nietzsche-conscience-communication-gregaire/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Langage"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Conscience · communication et société",
        "la conscience grégaire",
        "Le Gai Savoir",
        "[1882], § 354, trad. P. Klossowski, Gallimard, 1967, p. 253–254"
      ]
    },
    {
      "id": "texte:freud-trois-blessures-narcissiques",
      "kind": "texte",
      "title": "Les trois blessures narcissiques : le moi n’est pas maître dans sa propre maison",
      "creator": "Sigmund Freud",
      "subtitle": "Introduction à la psychanalyse",
      "description": "Après Copernic et Darwin, la psychanalyse inflige-t-elle à l’être humain une troisième blessure en montrant que le moi ne gouverne pas entièrement sa propre vie psychique ?",
      "url": "/textes/freud-trois-blessures-narcissiques/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Conscience",
        "Inconscient"
      ],
      "people": [
        "Sigmund Freud"
      ],
      "keywords": [
        "Freud",
        "Conscience · inconscient et décentrement du sujet",
        "les trois blessures narcissiques",
        "Introduction à la psychanalyse",
        "[1916], IIe partie, chap. 18, trad. S. Jankélévitch, Payot, 2001, p. 343–344"
      ]
    },
    {
      "id": "texte:arendt-oeuvre-art-duree-monde",
      "kind": "texte",
      "title": "L’œuvre d’art n’est pas une simple chose : elle est faite pour durer",
      "creator": "Hannah Arendt",
      "subtitle": "La Crise de la culture",
      "description": "Qu’est-ce qui distingue l’œuvre d’art des objets d’usage, des biens de consommation et des produits de l’action ?",
      "url": "/textes/arendt-oeuvre-art-duree-monde/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Technique"
      ],
      "people": [
        "Hannah Arendt"
      ],
      "keywords": [
        "Arendt",
        "Art · œuvre, objet et durée",
        "La Crise de la culture",
        "[1961–1968], trad. P. Lévy, Gallimard, 1989, p. 267–268"
      ]
    },
    {
      "id": "texte:alain-artiste-artisan-idee-oeuvre",
      "kind": "texte",
      "title": "L’idée vient à l’artiste à mesure qu’il fait",
      "creator": "Alain",
      "subtitle": "Système des Beaux-Arts",
      "description": "L’artiste applique-t-il une idée déjà formée, ou découvre-t-il l’œuvre et sa règle dans le geste même de créer ?",
      "url": "/textes/alain-artiste-artisan-idee-oeuvre/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Technique"
      ],
      "people": [
        "Alain"
      ],
      "keywords": [
        "Alain",
        "Art · artiste et artisan",
        "Système des Beaux-Arts",
        "[1920], livre I, chap. VII, Gallimard, « Bibliothèque de la Pléiade », 1958, p. 239–240"
      ]
    },
    {
      "id": "texte:kant-genie-regles-art",
      "kind": "texte",
      "title": "Le génie donne ses règles à l’art",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la faculté de juger",
      "description": "Comment une œuvre peut-elle obéir à des règles si aucune règle déterminée ne peut être donnée avant sa création ?",
      "url": "/textes/kant-genie-regles-art/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Nature"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Art · génie et règles",
        "Critique de la faculté de juger",
        "[1790], § 46, trad. J.-M. Vaysse, Gallimard, 1985, p. 261–262"
      ]
    },
    {
      "id": "texte:nietzsche-culte-genie",
      "kind": "texte",
      "title": "Le culte du génie : aucune création n’est un miracle",
      "creator": "Friedrich Nietzsche",
      "subtitle": "Humain, trop humain",
      "description": "Le génie est-il une grâce exceptionnelle, ou le résultat d’un long travail dont l’œuvre achevée efface la genèse ?",
      "url": "/textes/nietzsche-culte-genie/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Technique"
      ],
      "people": [
        "Friedrich Nietzsche"
      ],
      "keywords": [
        "Nietzsche",
        "Art · génie et création",
        "le culte du génie",
        "Humain, trop humain",
        "[1878], § 162, trad. R. Rovini, Gallimard, 1988, p. 142–143"
      ]
    },
    {
      "id": "texte:hegel-art-imitation-nature",
      "kind": "texte",
      "title": "Imiter la nature est une entreprise impossible et futile",
      "creator": "Georg Wilhelm Friedrich Hegel",
      "subtitle": "Esthétique",
      "description": "Si l’art se contente de copier la nature, ne devient-il pas une répétition inférieure, oiseuse et sans véritable fin artistique ?",
      "url": "/textes/hegel-art-imitation-nature/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Nature"
      ],
      "people": [
        "Georg Wilhelm Friedrich Hegel"
      ],
      "keywords": [
        "Hegel",
        "Art · imitation et nature",
        "Esthétique",
        "[1835–1837 posth.], t. I, introduction, trad. S. Jankélévitch, Flammarion, 1979, p. 34–37"
      ]
    },
    {
      "id": "texte:wilde-nature-imite-art",
      "kind": "texte",
      "title": "La nature imite l’art",
      "creator": "Oscar Wilde",
      "subtitle": "Le Déclin du mensonge",
      "description": "Voyons-nous d’abord la nature pour ensuite la représenter, ou l’art transforme-t-il ce que nous sommes capables d’y voir ?",
      "url": "/textes/wilde-nature-imite-art/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Nature"
      ],
      "people": [
        "Oscar Wilde"
      ],
      "keywords": [
        "Wilde",
        "Art · nature et perception",
        "la nature imite l’art",
        "Le Déclin du mensonge",
        "in Intentions [1891], trad. H. Rebell, Allia, 1998, p. 55–56"
      ]
    },
    {
      "id": "texte:platon-art-imitation-eloigne-vrai",
      "kind": "texte",
      "title": "L’art d’imitation est éloigné du vrai",
      "creator": "Platon",
      "subtitle": "La République",
      "description": "L’artiste connaît-il réellement ce qu’il représente, ou produit-il seulement une apparence capable de tromper ?",
      "url": "/textes/platon-art-imitation-eloigne-vrai/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Vérité"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Art · imitation et vérité",
        "La République",
        "[IVe s. av. J.-C.], livre X, 598bd, trad. G. Leroux, GF, 2002, p. 486–487"
      ]
    },
    {
      "id": "texte:heidegger-art-devoile-verite-souliers",
      "kind": "texte",
      "title": "Les souliers de Van Gogh : l’art dévoile la vérité",
      "creator": "Martin Heidegger",
      "subtitle": "L’Origine de l’œuvre d’art",
      "description": "Une œuvre se contente-t-elle de représenter une chose, ou peut-elle faire apparaître ce qu’est cette chose en vérité ?",
      "url": "/textes/heidegger-art-devoile-verite-souliers/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art",
        "Vérité"
      ],
      "people": [
        "Martin Heidegger"
      ],
      "keywords": [
        "Heidegger",
        "Art · œuvre et vérité",
        "les souliers de Van Gogh",
        "L’Origine de l’œuvre d’art",
        "[1935], in Chemins qui ne mènent nulle part [1949], trad. W. Brokmeier, Gallimard, 1962, p. 33–34 et 36"
      ]
    },
    {
      "id": "texte:kant-antinomie-gout",
      "kind": "texte",
      "title": "L’antinomie du goût : on peut discuter sans disputer",
      "creator": "Emmanuel Kant",
      "subtitle": "Critique de la faculté de juger",
      "description": "Si le goût est subjectif, comment peut-on néanmoins discuter et attendre des autres qu’ils puissent s’accorder avec nous ?",
      "url": "/textes/kant-antinomie-gout/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art"
      ],
      "people": [
        "Emmanuel Kant"
      ],
      "keywords": [
        "Kant",
        "Art · jugement de goût",
        "l’antinomie du goût",
        "Critique de la faculté de juger",
        "[1790], § 56, trad. J.-M. Vaysse, Gallimard, 1985, p. 298–299"
      ]
    },
    {
      "id": "texte:hume-norme-gout-delicatesse",
      "kind": "texte",
      "title": "La norme du goût : la délicatesse de l’imagination",
      "creator": "David Hume",
      "subtitle": "De la norme du goût",
      "description": "Si la beauté dépend du sentiment, pourquoi certains jugements de goût peuvent-ils être plus fins et plus fiables que d’autres ?",
      "url": "/textes/hume-norme-gout-delicatesse/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Art"
      ],
      "people": [
        "David Hume"
      ],
      "keywords": [
        "Hume",
        "Art · goût et norme",
        "la norme du goût",
        "De la norme du goût",
        "in Essais moraux, littéraires et politique [1777], trad. J.-P. Jackson, Alive, 1999, p. 288–289"
      ]
    },
    {
      "id": "texte:genese-deluge",
      "kind": "texte",
      "title": "Le Déluge",
      "creator": "",
      "subtitle": "Genèse 6–8",
      "description": "Comment le récit du Déluge articule-t-il le jugement de la violence humaine, le salut de Noé et la promesse d’un recommencement ?",
      "url": "/textes/genese-deluge/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Justice",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "l’arche de Noé",
        "Genèse 6–8",
        "6,5–10.13–19.21–22 ; 7,11–24 ; 8,1–13.20–22"
      ]
    },
    {
      "id": "texte:genese-babel",
      "kind": "texte",
      "title": "La tour de Babel",
      "creator": "",
      "subtitle": "Genèse 11",
      "description": "Pourquoi le désir d’unité et de renommée conduit-il à la confusion des langues et à la dispersion ?",
      "url": "/textes/genese-babel/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Langage",
        "Religion",
        "Autrui"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "la confusion des langues",
        "Genèse 11",
        "11,1–9"
      ]
    },
    {
      "id": "texte:genese-appel-abraham",
      "kind": "texte",
      "title": "L’appel d’Abraham",
      "creator": "",
      "subtitle": "Genèse 12 et 15",
      "description": "Comment répondre à un appel qui oblige à quitter le connu, et comment croire à une promesse dont rien ne garantit encore l’accomplissement ?",
      "url": "/textes/genese-appel-abraham/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Foi",
        "Alliance"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "Genèse 12 et 15",
        "12,1–9 ; 15,1–6"
      ]
    },
    {
      "id": "texte:genese-alliance-abraham",
      "kind": "texte",
      "title": "L’Alliance avec Abraham",
      "creator": "",
      "subtitle": "Genèse 17",
      "description": "Comment la promesse faite à Abraham devient-elle une alliance durable, inscrite dans un nom, une descendance et un signe ?",
      "url": "/textes/genese-alliance-abraham/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Alliance",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "Genèse 17",
        "17,1–10"
      ]
    },
    {
      "id": "texte:genese-sodome",
      "kind": "texte",
      "title": "Abraham intercède pour Sodome",
      "creator": "",
      "subtitle": "Genèse 18",
      "description": "Comment Abraham ose-t-il demander à Dieu de ne pas faire périr le juste avec le pécheur ?",
      "url": "/textes/genese-sodome/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Justice",
        "Religion",
        "Autrui"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "Genèse 18",
        "18,17–33"
      ]
    },
    {
      "id": "texte:genese-joseph-vendu-freres",
      "kind": "texte",
      "title": "Joseph vendu par ses frères",
      "creator": "",
      "subtitle": "Genèse 37",
      "description": "Comment la préférence de Jacob et les songes de Joseph font-ils naître une jalousie qui conduit ses frères jusqu’à le vendre ?",
      "url": "/textes/genese-joseph-vendu-freres/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Autrui",
        "Justice"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "les songes de Joseph",
        "Genèse 37",
        "37,3–11.12–28.31–36"
      ]
    },
    {
      "id": "texte:genese-ascension-joseph",
      "kind": "texte",
      "title": "Ascension de Joseph",
      "creator": "",
      "subtitle": "Genèse 41",
      "description": "Comment Joseph comprend-il les songes de Pharaon et leur donne-t-il le sens d’un avenir à préparer ?",
      "url": "/textes/genese-ascension-joseph/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Interprétation",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "les songes de Pharaon",
        "Genèse 41",
        "41,1–8.25–32"
      ]
    },
    {
      "id": "texte:genese-pardon-joseph",
      "kind": "texte",
      "title": "Le pardon de Joseph",
      "creator": "",
      "subtitle": "Genèse 45",
      "description": "Comment Joseph répond-il à ceux qui l’ont vendu lorsqu’il se fait enfin reconnaître de ses frères ?",
      "url": "/textes/genese-pardon-joseph/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Autrui",
        "Justice"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "Joseph retrouve ses frères",
        "Genèse 45",
        "45,1–15 ; 50,20"
      ]
    },
    {
      "id": "texte:genese-heritier-promesse",
      "kind": "texte",
      "title": "L’héritier de la Promesse",
      "creator": "",
      "subtitle": "Genèse 49",
      "description": "Comment la bénédiction de Juda est-elle reliée à la promesse d’une royauté et à sa relecture dans le Nouveau Testament ?",
      "url": "/textes/genese-heritier-promesse/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Alliance",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Récit biblique",
        "la bénédiction de Juda",
        "Genèse 49",
        "49,8–10 ; Matthieu 2 ; Colossiens 3"
      ]
    },
    {
      "id": "texte:exode-esclavage-hebreux",
      "kind": "texte",
      "title": "L’esclavage des Hébreux",
      "creator": "",
      "subtitle": "Exode 1",
      "description": "Comment la peur de Pharaon transforme-t-elle les Hébreux en une population soumise aux corvées, à l’esclavage et à un ordre de mort ?",
      "url": "/textes/exode-esclavage-hebreux/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Liberté",
        "Justice"
      ],
      "people": [],
      "keywords": [
        "Exode · esclavage et oppression",
        "les corvées de Pharaon",
        "Exode 1",
        "1,8–14.22"
      ]
    },
    {
      "id": "texte:exode-naissance-moise",
      "kind": "texte",
      "title": "La naissance de Moïse",
      "creator": "",
      "subtitle": "Exode 2",
      "description": "Comment un enfant condamné par l’ordre de Pharaon échappe-t-il à la mort grâce à une chaîne de gestes de protection et de pitié ?",
      "url": "/textes/exode-naissance-moise/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Liberté",
        "Autrui"
      ],
      "people": [],
      "keywords": [
        "Exode · naissance et sauvetage",
        "Moïse sauvé des eaux",
        "Exode 2",
        "2,1–10"
      ]
    },
    {
      "id": "texte:exode-appel-moise",
      "kind": "texte",
      "title": "L’appel de Moïse",
      "creator": "",
      "subtitle": "Exode 3",
      "description": "Comment la rencontre du buisson ardent devient-elle à la fois révélation de Dieu, connaissance de la souffrance et mission de libération ?",
      "url": "/textes/exode-appel-moise/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Religion",
        "Liberté"
      ],
      "people": [],
      "keywords": [
        "Exode · vocation et nom divin",
        "le buisson ardent",
        "Exode 3",
        "3,1–10.13–20"
      ]
    },
    {
      "id": "texte:exode-paque-israel",
      "kind": "texte",
      "title": "La Pâque d’Israël",
      "creator": "",
      "subtitle": "Exode 12",
      "description": "Comment la nuit du départ devient-elle un rite, un signe de protection et un mémorial transmis d’âge en âge ?",
      "url": "/textes/exode-paque-israel/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Religion",
        "Histoire"
      ],
      "people": [],
      "keywords": [
        "Exode · Pâque et mémorial",
        "le sang sur les portes",
        "Exode 12",
        "12,1–14"
      ]
    },
    {
      "id": "texte:exode-delivrance-israel",
      "kind": "texte",
      "title": "La sortie d’Égypte",
      "creator": "",
      "subtitle": "Exode 12–13",
      "description": "Comment la délivrance devient-elle un départ réel, puis une marche guidée jour et nuit vers le désert ?",
      "url": "/textes/exode-delivrance-israel/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Liberté",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Exode · départ et marche au désert",
        "la sortie d’Égypte",
        "Exode 12–13",
        "12,31–39 ; 13,20–22"
      ]
    },
    {
      "id": "texte:exode-passage-mer-rouge",
      "kind": "texte",
      "title": "Le passage de la Mer Rouge",
      "creator": "",
      "subtitle": "Exode 14",
      "description": "Comment le passage de la mer accomplit-il la délivrance d’Israël et transforme-t-il la fuite devant Pharaon en expérience fondatrice de salut ?",
      "url": "/textes/exode-passage-mer-rouge/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Liberté",
        "Religion"
      ],
      "people": [],
      "keywords": [
        "Exode · passage de la mer",
        "la traversée à pied sec",
        "Exode 14",
        "14,21–23.26–31"
      ]
    },
    {
      "id": "texte:exode-cantique-moise",
      "kind": "texte",
      "title": "Le cantique de Moïse",
      "creator": "",
      "subtitle": "Exode 15",
      "description": "Comment la délivrance racontée au chapitre précédent devient-elle un chant de victoire, de salut et de confiance en Dieu ?",
      "url": "/textes/exode-cantique-moise/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Religion",
        "Liberté"
      ],
      "people": [],
      "keywords": [
        "Exode · cantique de victoire",
        "le chant de la délivrance",
        "Exode 15",
        "15,1–5.7–8.10–11.13.17–18"
      ]
    },
    {
      "id": "texte:exode-alliance-sinai",
      "kind": "texte",
      "title": "L’Alliance du Sinaï",
      "creator": "",
      "subtitle": "Exode 19 et 24",
      "description": "Comment le peuple libéré d’Égypte devient-il un peuple d’Alliance, appelé à écouter, répondre et vivre devant Dieu ?",
      "url": "/textes/exode-alliance-sinai/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Religion",
        "Liberté"
      ],
      "people": [],
      "keywords": [
        "Exode · alliance, peuple et théophanie",
        "l’Alliance conclue au Sinaï",
        "Exode 19 et 24",
        "19,1–11.16–20 ; 24,3.5.7–8"
      ]
    },
    {
      "id": "texte:exode-dix-commandements",
      "kind": "texte",
      "title": "Les Dix Commandements",
      "creator": "",
      "subtitle": "Exode 20",
      "description": "Comment les Dix Commandements articulent-ils fidélité à Dieu, respect d’autrui et limitation de la violence, de l’appropriation et du désir ?",
      "url": "/textes/exode-dix-commandements/",
      "source": "Textes",
      "section": "Théologie",
      "themes": [
        "Devoir",
        "Justice"
      ],
      "people": [],
      "keywords": [
        "Exode · le Décalogue au Sinaï",
        "le Décalogue",
        "Exode 20",
        "20,1–17"
      ]
    },
    {
      "id": "texte:hesiode-cosmogonie-chaos-gaia-eros",
      "kind": "texte",
      "title": "Au commencement : Chaos, Gaïa et Éros",
      "creator": "Hésiode",
      "subtitle": "Théogonie",
      "description": "Comment l’ordre du monde peut-il apparaître progressivement ?",
      "url": "/textes/hesiode-cosmogonie-chaos-gaia-eros/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Nature",
        "Religion"
      ],
      "people": [
        "Hésiode"
      ],
      "keywords": [
        "Hésiode",
        "Origine · ordre · monde",
        "Théogonie",
        "v. 116–127 (extraits), trad. Leconte de Lisle, Alphonse Lemerre, s. d. (1869 ?)"
      ]
    },
    {
      "id": "texte:hesiode-promethee-vol-feu",
      "kind": "texte",
      "title": "Prométhée vole le feu aux dieux",
      "creator": "Hésiode",
      "subtitle": "Les Travaux et les Jours",
      "description": "La technique nous libère-t-elle, ou nous donne-t-elle un pouvoir difficile à maîtriser ?",
      "url": "/textes/hesiode-promethee-vol-feu/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Technique",
        "Liberté"
      ],
      "people": [
        "Hésiode"
      ],
      "keywords": [
        "Hésiode",
        "Technique · liberté · limites",
        "Les Travaux et les Jours",
        "v. 42–58 (extrait), trad. Anne Bignan, éd. Ernest Falconnet, Desrez, 1838"
      ]
    },
    {
      "id": "texte:hesiode-pandore-maux-esperance",
      "kind": "texte",
      "title": "Pandore ouvre la jarre des maux",
      "creator": "Hésiode",
      "subtitle": "Les Travaux et les Jours",
      "description": "Pourquoi l’existence humaine est-elle marquée par la souffrance, et quel rôle reste-t-il à l’espérance ?",
      "url": "/textes/hesiode-pandore-maux-esperance/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Travail",
        "Religion"
      ],
      "people": [
        "Hésiode"
      ],
      "keywords": [
        "Hésiode",
        "Mal · espérance · condition humaine",
        "Les Travaux et les Jours",
        "v. 90–105 (extrait), trad. Henri Patin, Garnier Frères, 1892"
      ]
    },
    {
      "id": "texte:ovide-deucalion-pyrrha-deluge",
      "kind": "texte",
      "title": "Deucalion et Pyrrha après le Déluge",
      "creator": "Ovide",
      "subtitle": "Métamorphoses, livre I",
      "description": "Une catastrophe peut-elle être à la fois une punition et un nouveau commencement ?",
      "url": "/textes/ovide-deucalion-pyrrha-deluge/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Justice",
        "Religion"
      ],
      "people": [
        "Ovide"
      ],
      "keywords": [
        "Ovide",
        "Justice · catastrophe · recommencement",
        "Métamorphoses, livre I",
        "trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extraits)"
      ]
    },
    {
      "id": "texte:sophocle-oedipe-verite-destin",
      "kind": "texte",
      "title": "Œdipe découvre qui il est",
      "creator": "Sophocle",
      "subtitle": "Œdipe roi",
      "description": "Sommes-nous responsables de nos actes quand nous ignorons des éléments essentiels de la situation ?",
      "url": "/textes/sophocle-oedipe-verite-destin/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Vérité",
        "Liberté"
      ],
      "people": [
        "Sophocle"
      ],
      "keywords": [
        "Sophocle",
        "Vérité · liberté · responsabilité",
        "Œdipe roi",
        "trad. Leconte de Lisle, Alphonse Lemerre, 1877, scène de la reconnaissance (extrait)"
      ]
    },
    {
      "id": "texte:homere-ulysse-sirenes-maitrise-desir",
      "kind": "texte",
      "title": "Ulysse résiste au chant des Sirènes",
      "creator": "Homère",
      "subtitle": "Odyssée, chant XII",
      "description": "Être libre, est-ce suivre son désir ou savoir se protéger de soi-même ?",
      "url": "/textes/homere-ulysse-sirenes-maitrise-desir/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Liberté",
        "Désir"
      ],
      "people": [
        "Homère"
      ],
      "keywords": [
        "Homère",
        "Désir · maîtrise de soi · liberté",
        "Odyssée, chant XII",
        "trad. Eugène Bareste, Lavigne, 1842 (extrait)"
      ]
    },
    {
      "id": "texte:ovide-icare-voler-trop-haut",
      "kind": "texte",
      "title": "Icare vole trop près du Soleil",
      "creator": "Ovide",
      "subtitle": "Métamorphoses, livre VIII",
      "description": "Une puissance nouvelle vaut-elle sans la capacité d’en maîtriser les limites ?",
      "url": "/textes/ovide-icare-voler-trop-haut/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Technique",
        "Liberté"
      ],
      "people": [
        "Ovide"
      ],
      "keywords": [
        "Ovide",
        "Technique · mesure · responsabilité",
        "Métamorphoses, livre VIII",
        "trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)"
      ]
    },
    {
      "id": "texte:ovide-narcisse-reflet-desir-identite",
      "kind": "texte",
      "title": "Narcisse tombe amoureux de son reflet",
      "creator": "Ovide",
      "subtitle": "Métamorphoses, livre III",
      "description": "Peut-on se connaître lorsque l’on confond son image avec un autre ?",
      "url": "/textes/ovide-narcisse-reflet-desir-identite/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Conscience",
        "Désir"
      ],
      "people": [
        "Ovide"
      ],
      "keywords": [
        "Ovide",
        "Image · désir · identité",
        "Métamorphoses, livre III",
        "trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)"
      ]
    },
    {
      "id": "texte:ovide-orphee-eurydice-regard-interdit",
      "kind": "texte",
      "title": "Orphée se retourne vers Eurydice",
      "creator": "Ovide",
      "subtitle": "Métamorphoses, livre X",
      "description": "L’art peut-il vaincre la mort, et pourquoi l’amour échoue-t-il au moment de retrouver ce qu’il a perdu ?",
      "url": "/textes/ovide-orphee-eurydice-regard-interdit/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Art",
        "Amour"
      ],
      "people": [
        "Ovide"
      ],
      "keywords": [
        "Ovide",
        "Art · amour · mort",
        "Métamorphoses, livre X",
        "trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)"
      ]
    },
    {
      "id": "texte:eschyle-oreste-tribunal-justice",
      "kind": "texte",
      "title": "Oreste : de la vengeance au tribunal",
      "creator": "Eschyle",
      "subtitle": "Les Euménides",
      "description": "Comment sortir du cycle de la vengeance sans renoncer à juger les crimes ?",
      "url": "/textes/eschyle-oreste-tribunal-justice/",
      "source": "Textes",
      "section": "Mythologie",
      "themes": [
        "Justice",
        "État"
      ],
      "people": [
        "Eschyle"
      ],
      "keywords": [
        "Eschyle",
        "Justice · vengeance · institution",
        "Les Euménides",
        "458 av. J.-C., trad. Leconte de Lisle, A. Lemerre, 1872 (extrait)"
      ]
    },
    {
      "id": "texte:platon-caverne-apparence-verite",
      "kind": "texte",
      "title": "La caverne : sortir des apparences",
      "creator": "Platon",
      "subtitle": "La République, livre VII",
      "description": "Comment savoir si ce que nous tenons pour réel n’est qu’une apparence ?",
      "url": "/textes/platon-caverne-apparence-verite/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Vérité",
        "Raison"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Vérité · apparence · éducation",
        "l’allégorie de la caverne",
        "La République, livre VII",
        "514a–517a, trad. Victor Cousin, 1834 (extrait)"
      ]
    },
    {
      "id": "texte:platon-mythe-er-choix-vie",
      "kind": "texte",
      "title": "Le mythe d’Er : choisir sa vie",
      "creator": "Platon",
      "subtitle": "La République, livre X",
      "description": "Sommes-nous responsables de la vie que nous choisissons, même lorsque le hasard fixe les conditions du choix ?",
      "url": "/textes/platon-mythe-er-choix-vie/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Liberté",
        "Justice"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Liberté · choix · responsabilité",
        "le mythe d’Er",
        "La République, livre X",
        "617d–620d, trad. Victor Cousin, 1834 (extrait)"
      ]
    },
    {
      "id": "texte:platon-attelage-aile-ame-desirs",
      "kind": "texte",
      "title": "L’attelage ailé : gouverner ses désirs",
      "creator": "Platon",
      "subtitle": "Phèdre",
      "description": "Être maître de soi, est-ce supprimer ses désirs ou apprendre à les gouverner ?",
      "url": "/textes/platon-attelage-aile-ame-desirs/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Désir",
        "Raison"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Âme · désir · maîtrise de soi",
        "l’attelage ailé",
        "Phèdre",
        "246a–246b ; 253d–256b, trad. Victor Cousin, 1831 (extrait)"
      ]
    },
    {
      "id": "texte:platon-theuth-ecriture-memoire",
      "kind": "texte",
      "title": "Theuth : l’écriture aide-t-elle vraiment à penser ?",
      "creator": "Platon",
      "subtitle": "Phèdre",
      "description": "Une technique qui conserve nos connaissances peut-elle aussi affaiblir notre capacité à penser par nous-mêmes ?",
      "url": "/textes/platon-theuth-ecriture-memoire/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "Langage"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Technique · mémoire · savoir",
        "le mythe de Theuth",
        "Phèdre",
        "274c–275d, trad. Victor Cousin, 1831 (extrait)"
      ]
    },
    {
      "id": "texte:platon-promethee-epimethee-naissance-politique",
      "kind": "texte",
      "title": "Prométhée et Épiméthée : pourquoi les hommes ont besoin de la politique",
      "creator": "Platon",
      "subtitle": "Protagoras",
      "description": "La technique suffit-elle pour permettre aux êtres humains de vivre ensemble ?",
      "url": "/textes/platon-promethee-epimethee-naissance-politique/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "Technique",
        "État"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Nature · technique · politique",
        "le mythe de Prométhée et Épiméthée",
        "Protagoras",
        "320c–322d, trad. Victor Cousin, 1826 (extrait)"
      ]
    },
    {
      "id": "texte:platon-atlantide-puissance-demesure",
      "kind": "texte",
      "title": "L’Atlantide : quand la puissance corrompt",
      "creator": "Platon",
      "subtitle": "Critias",
      "description": "Une cité peut-elle rester juste lorsqu’elle devient riche, puissante et incapable de se limiter ?",
      "url": "/textes/platon-atlantide-puissance-demesure/",
      "source": "Textes",
      "section": "Philosophie",
      "themes": [
        "État",
        "Justice"
      ],
      "people": [
        "Platon"
      ],
      "keywords": [
        "Platon",
        "Puissance · richesse · mesure",
        "l’Atlantide",
        "Critias",
        "120d–121c, trad. Victor Cousin, 1840 (extrait)"
      ]
    },
    {
      "id": "livre:therese-avila-chemins-perfection",
      "kind": "livre",
      "title": "Les chemins de la perfection",
      "creator": "Thérèse d’Avila",
      "subtitle": "Spiritualité · Mystique",
      "description": "Livre disponible dans la bibliothèque de lecture personnelle.",
      "url": "/lecture/?book=therese-avila-chemins-perfection",
      "source": "Bibliothèque",
      "section": "Livres",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Spiritualité"
      ],
      "people": [
        "Thérèse d’Avila"
      ],
      "keywords": [
        "lecture",
        "livre",
        "Spiritualité · Mystique"
      ]
    },
    {
      "id": "livre:therese-avila-chemin-perfection",
      "kind": "livre",
      "title": "Le Chemin de la perfection",
      "creator": "Thérèse d’Avila",
      "subtitle": "Spiritualité · Mystique",
      "description": "Livre disponible dans la bibliothèque de lecture personnelle.",
      "url": "/lecture/?book=therese-avila-chemin-perfection",
      "source": "Bibliothèque",
      "section": "Livres",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Spiritualité",
        "Oraison"
      ],
      "people": [
        "Thérèse d’Avila"
      ],
      "keywords": [
        "lecture",
        "livre",
        "Spiritualité · Mystique"
      ]
    },
    {
      "id": "livre:therese-avila-chateau-ame",
      "kind": "livre",
      "title": "Le Château de l’âme",
      "creator": "Thérèse d’Avila",
      "subtitle": "Spiritualité · Mystique",
      "description": "Livre disponible dans la bibliothèque de lecture personnelle.",
      "url": "/lecture/?book=therese-avila-chateau-ame",
      "source": "Bibliothèque",
      "section": "Livres",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Spiritualité"
      ],
      "people": [
        "Thérèse d’Avila"
      ],
      "keywords": [
        "lecture",
        "livre",
        "Spiritualité · Mystique"
      ]
    },
    {
      "id": "livre:therese-avila-livre-vie",
      "kind": "livre",
      "title": "Livre de la vie",
      "creator": "Thérèse d’Avila",
      "subtitle": "Spiritualité · Mystique",
      "description": "Livre disponible dans la bibliothèque de lecture personnelle.",
      "url": "/lecture/?book=therese-avila-livre-vie",
      "source": "Bibliothèque",
      "section": "Livres",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Spiritualité"
      ],
      "people": [
        "Thérèse d’Avila"
      ],
      "keywords": [
        "lecture",
        "livre",
        "Spiritualité · Mystique"
      ]
    },
    {
      "id": "livre:jean-croix-oeuvres-completes",
      "kind": "livre",
      "title": "Œuvres complètes",
      "creator": "Jean de la Croix",
      "subtitle": "Spiritualité · Mystique",
      "description": "Livre disponible dans la bibliothèque de lecture personnelle.",
      "url": "/lecture/?book=jean-croix-oeuvres-completes",
      "source": "Bibliothèque",
      "section": "Livres",
      "themes": [
        "Jean de la Croix",
        "Mystique",
        "Spiritualité",
        "Carmel"
      ],
      "people": [
        "Jean de la Croix"
      ],
      "keywords": [
        "lecture",
        "livre",
        "Spiritualité · Mystique"
      ]
    },
    {
      "id": "video:the-chosen-parabole-du-pecheur",
      "kind": "video",
      "videoType": "film",
      "title": "The Chosen — Parabole du pêcheur",
      "creator": "The Chosen",
      "subtitle": "Spiritualité",
      "description": "Un fragment de The Chosen autour de la parole de Jésus et de l’image du pêcheur.",
      "url": "/art/?v=the-chosen-parabole-du-pecheur",
      "source": "Film / extrait",
      "section": "Spiritualité",
      "themes": [
        "The Chosen",
        "Jésus",
        "Parabole",
        "Évangile",
        "Pêche",
        "Spiritualité"
      ],
      "people": [],
      "keywords": [
        "christianisme",
        "bible",
        "disciples",
        "foi",
        "enseignement",
        "série"
      ]
    },
    {
      "id": "podcast:france-culture-vie-spirituelle-therese-avila",
      "kind": "podcast",
      "title": "La vie spirituelle selon Thérèse d’Avila",
      "creator": "France Culture · Les Racines du ciel",
      "subtitle": "Avec Didier-Marie Golay · 14 juin 2015",
      "description": "Un entretien consacré à l’itinéraire spirituel de Thérèse d’Avila, à sa mystique et à la manière dont son expérience peut être comprise et vécue.",
      "url": "https://www.radiofrance.fr/franceculture/podcasts/les-racines-du-ciel/la-vie-spirituelle-selon-therese-d-avila-5905469",
      "source": "France Culture",
      "section": "Spiritualité",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Oraison",
        "Contemplation",
        "Carmel",
        "Vie spirituelle"
      ],
      "people": [
        "Thérèse d’Avila",
        "Didier-Marie Golay"
      ],
      "keywords": [
        "sainte therese",
        "teresa de jesus",
        "avila",
        "racines du ciel",
        "carmelite"
      ]
    },
    {
      "id": "podcast:france-inter-marche-histoire-therese-avila",
      "kind": "podcast",
      "title": "Thérèse d’Avila (1515–1582)",
      "creator": "France Inter · La Marche de l’histoire",
      "subtitle": "Portrait historique",
      "description": "Un épisode pour replacer Thérèse d’Avila dans l’Espagne du XVIe siècle, son itinéraire religieux et la réforme du Carmel.",
      "url": "https://www.radiofrance.fr/franceinter/podcasts/la-marche-de-l-histoire/therese-d-avila-1515-1582-6226368",
      "source": "France Inter",
      "section": "Histoire · Spiritualité",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Carmel",
        "Histoire",
        "Réforme carmélitaine"
      ],
      "people": [
        "Thérèse d’Avila"
      ],
      "keywords": [
        "sainte therese",
        "teresa de jesus",
        "avila",
        "marche de histoire",
        "xvie siecle"
      ]
    },
    {
      "id": "podcast:rcf-chretiens-histoire-therese-avila",
      "kind": "podcast",
      "title": "Ces chrétiens qui ont changé l’histoire — Thérèse d’Avila",
      "creator": "RCF · Véronique Alzieu",
      "subtitle": "30 mars 2022 · 54 min",
      "description": "Un portrait de Thérèse d’Avila comme grande figure du Siècle d’or espagnol, réformatrice du Carmel et mystique chrétienne.",
      "url": "https://www.rcf.fr/vie-spirituelle/ces-chretiens-qui-ont-change-lhistoire?episode=224821",
      "source": "RCF",
      "section": "Spiritualité · Histoire",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Carmel",
        "Histoire",
        "Christianisme"
      ],
      "people": [
        "Thérèse d’Avila",
        "Véronique Alzieu"
      ],
      "keywords": [
        "sainte therese",
        "teresa de jesus",
        "avila",
        "siecle dor espagnol"
      ]
    },
    {
      "id": "podcast:radio-maria-therese-avila-union-dieu",
      "kind": "podcast",
      "title": "Sainte Thérèse d’Avila — Qu’est-ce que l’union à Dieu ?",
      "creator": "Radio Maria France · frère Denis-Marie Ghesquières",
      "subtitle": "7e Demeures · émission du 8 juin 2026 · 39 min",
      "description": "Un épisode centré sur les septièmes demeures du Château intérieur et la question de l’union à Dieu chez Thérèse d’Avila.",
      "url": "https://soundcloud.com/radiomariafrance/sainte-therese-davila-2026-06",
      "source": "Radio Maria France",
      "section": "Spiritualité",
      "themes": [
        "Thérèse d’Avila",
        "Mystique",
        "Château intérieur",
        "Septièmes demeures",
        "Union à Dieu",
        "Contemplation"
      ],
      "people": [
        "Thérèse d’Avila",
        "Denis-Marie Ghesquières"
      ],
      "keywords": [
        "sainte therese",
        "teresa de jesus",
        "avila",
        "7eme demeures",
        "septieme demeure",
        "union divine"
      ]
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm01-clinique-pathologie",
      "slug": "cm01-histoire-psychologie-clinique-pathologies.md",
      "title": "CM01 — Histoire de la psychologie clinique et des pathologies",
      "module": "CM — Thèmes de psychologie",
      "courseTheme": "clinique",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 1,
      "description": "Normal et pathologique, maladie mentale, sémiologie, structure, processus et genèse des troubles.",
      "themes": [
        "Psychologie clinique",
        "Psychopathologie",
        "Normal et pathologique",
        "Sémiologie"
      ],
      "keywords": [
        "maladie mentale",
        "structure",
        "processus",
        "diagnostic",
        "pathologie",
        "CM01 - Histoire de la psychologie clinique et des pathologies .docx",
        "CM — Thèmes de psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Thèmes de psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm01-histoire-psychologie-clinique-pathologies.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm01-clinique-pathologie"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm02-methode-clinique",
      "slug": "cm02-methode-clinique.md",
      "title": "CM02 — La méthode clinique en psychopathologie",
      "module": "CM — Thèmes de psychologie",
      "courseTheme": "clinique",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 2,
      "description": "Recueil de données, classification, diagnostic différentiel, pronostic, thérapeutique et grandes problématiques cliniques.",
      "themes": [
        "Psychologie clinique",
        "Psychopathologie",
        "Méthode clinique",
        "Diagnostic"
      ],
      "keywords": [
        "diagnostic différentiel",
        "pronostic",
        "thérapeutique",
        "résilience",
        "anamnèse",
        "CM02 - La méthode clinique.docx",
        "CM — Thèmes de psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Thèmes de psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm02-methode-clinique.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm02-methode-clinique"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm03-courants-cliniques",
      "slug": "cm03-histoire-contemporaine-psychologie-clinique.md",
      "title": "CM03 — Histoire contemporaine de la psychologie clinique",
      "module": "CM — Thèmes de psychologie",
      "courseTheme": "clinique",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 3,
      "description": "Principaux courants contemporains de la clinique : cognitivisme, comportementalisme, systémique et autres approches.",
      "themes": [
        "Psychologie clinique",
        "Cognitivisme",
        "Comportementalisme",
        "Systémique"
      ],
      "keywords": [
        "SORC",
        "Watzlawick",
        "double bind",
        "Piaget",
        "courants cliniques",
        "CM03 - Histoire contemporaine de la Psychologie clinique.docx",
        "CM — Thèmes de psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Thèmes de psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm03-histoire-contemporaine-psychologie-clinique.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm03-courants-cliniques"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm04-origines-psychologie",
      "slug": "cm04-origines-psychologie.md",
      "title": "CM04 — Les origines de la psychologie",
      "module": "CM — Histoire de la psychologie",
      "courseTheme": "histoire",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 4,
      "description": "De l’Antiquité à la Renaissance : émergence de la psychologie, individualisation et transformations des modes d’explication.",
      "themes": [
        "Histoire de la psychologie",
        "Antiquité",
        "Renaissance",
        "Philosophie"
      ],
      "keywords": [
        "Wolff",
        "Aristote",
        "Platon",
        "stoïciens",
        "Saint Augustin",
        "individualisation",
        "CM04 - Les origines de la psychologie.docx",
        "CM — Histoire de la psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Histoire de la psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm04-origines-psychologie.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm04-origines-psychologie"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm05-empirisme",
      "slug": "cm05-empirisme-acteurs-principaux.md",
      "title": "CM05 — L’empirisme et les acteurs principaux",
      "module": "CM — Histoire de la psychologie",
      "courseTheme": "histoire",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 5,
      "description": "Empirisme, sensualisme, associationnisme, Leibniz, Mesmer, Fechner, Wolff et transformations du XIXe siècle.",
      "themes": [
        "Histoire de la psychologie",
        "Empirisme",
        "Associationnisme",
        "Psychophysique"
      ],
      "keywords": [
        "Locke",
        "Hume",
        "Condillac",
        "Leibniz",
        "Mesmer",
        "Fechner",
        "Wolff",
        "CM05 - L’empirisme & les acteurs principaux.docx",
        "CM — Histoire de la psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Histoire de la psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm05-empirisme-acteurs-principaux.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm05-empirisme"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm06-pathologie-nouvelles-psychologies",
      "slug": "cm06-pathologie-nouvelles-psychologies.md",
      "title": "CM06 — La pathologie et les nouvelles psychologies",
      "module": "CM — Histoire de la psychologie",
      "courseTheme": "histoire",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 6,
      "description": "La pathologie comme source de la psychologie : Pinel, Ribot, hypnose, Charcot, Janet et naissance de la méthode clinique.",
      "themes": [
        "Histoire de la psychologie",
        "Psychopathologie",
        "Hypnose",
        "Méthode clinique"
      ],
      "keywords": [
        "Pinel",
        "Ribot",
        "Charcot",
        "Janet",
        "aliénisme",
        "hypnose",
        "CM06 - La pathologie & les nouvelles psychologies.docx",
        "CM — Histoire de la psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Histoire de la psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm06-pathologie-nouvelles-psychologies.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm06-pathologie-nouvelles-psychologies"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm07-psychologie-sociale",
      "slug": "cm07-origines-psychologie-sociale.md",
      "title": "CM07 — Origines de la psychologie sociale et courants américains",
      "module": "CM — Histoire de la psychologie",
      "courseTheme": "sociale",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de cours",
      "sequence": 7,
      "description": "Wundt, Le Bon, psychologie des foules, William James, fonctionnalisme, structuralisme et contexte américain.",
      "themes": [
        "Psychologie sociale",
        "Histoire de la psychologie",
        "Fonctionnalisme",
        "Structuralisme"
      ],
      "keywords": [
        "Wundt",
        "Le Bon",
        "William James",
        "Titchener",
        "foule",
        "mind",
        "CM07 - Les origines de la psychologie.docx",
        "CM — Histoire de la psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Histoire de la psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm07-origines-psychologie-sociale.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm07-psychologie-sociale"
    },
    {
      "id": "cours:psy-l1-s1-ue1-cm-developpement-support",
      "slug": "cm-psychologie-developpement-support.md",
      "title": "CM — Introduction à la psychologie du développement",
      "module": "CM — Thèmes de psychologie",
      "courseTheme": "developpement",
      "sourceType": "Support de cours",
      "format": "Support enseignant — PDF converti en texte",
      "sequence": 8,
      "description": "Définitions, histoire, facteurs du développement et grandes théories : behaviorisme, Vygotski, Wallon et Piaget.",
      "themes": [
        "Psychologie du développement",
        "Vygotski",
        "Wallon",
        "Piaget"
      ],
      "keywords": [
        "développement",
        "enfance",
        "maturation",
        "behaviorisme",
        "zone proximale",
        "constructivisme",
        "CM1 - 2 La psychologie du développement.pdf",
        "CM — Thèmes de psychologie",
        "UE1 — Thèmes et histoire de la psychologie",
        "Support de cours"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "CM — Thèmes de psychologie",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/cm-psychologie-developpement-support.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-cm-developpement-support"
    },
    {
      "id": "cours:psy-l1-s1-ue1-td01-fiche-lecture",
      "slug": "td01-fiche-lecture-syllogisme.md",
      "title": "TD01 — Fiche de lecture et syllogisme conditionnel",
      "module": "TD — Histoire & Thème",
      "courseTheme": "methodologie",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de TD",
      "sequence": 9,
      "description": "Méthode de fiche de lecture, bibliographie et premiers repères sur le raisonnement conditionnel.",
      "themes": [
        "Méthodologie",
        "Fiche de lecture",
        "Raisonnement"
      ],
      "keywords": [
        "bibliographie",
        "syllogisme conditionnel",
        "confirmation",
        "infirmation",
        "TD1 - Fiche de lecture.docx",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/td01-fiche-lecture-syllogisme.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-td01-fiche-lecture"
    },
    {
      "id": "cours:psy-l1-s1-ue1-td02-intelligence",
      "slug": "td02-intelligence.md",
      "title": "TD02 — L’intelligence",
      "module": "TD — Histoire & Thème",
      "courseTheme": "cognition",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de TD",
      "sequence": 10,
      "description": "Définitions de l’intelligence, âge mental, facteur g, aptitudes primaires, modèle CHC et WAIS.",
      "themes": [
        "Intelligence",
        "Psychologie cognitive",
        "Psychométrie"
      ],
      "keywords": [
        "Binet",
        "Simon",
        "Spearman",
        "Thurstone",
        "CHC",
        "WAIS",
        "facteur g",
        "TD2 - L_intelligence.docx",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/td02-intelligence.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-td02-intelligence"
    },
    {
      "id": "cours:psy-l1-s1-ue1-td03-jane-elliott",
      "slug": "td03-jane-elliott-discrimination.md",
      "title": "TD03 — Expérience de Jane Elliott : discrimination et contexte social",
      "module": "TD — Histoire & Thème",
      "courseTheme": "sociale",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de TD",
      "sequence": 11,
      "description": "Discrimination, influence de la situation, erreur fondamentale d’attribution, effet Pygmalion et estime de soi.",
      "themes": [
        "Psychologie sociale",
        "Discrimination",
        "Effet Pygmalion"
      ],
      "keywords": [
        "Jane Elliott",
        "Milgram",
        "Sherif",
        "Rosenthal",
        "Jacobson",
        "attribution",
        "TD3 - Expérience de Jane Elliot sur les yeux.docx",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/td03-jane-elliott-discrimination.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-td03-jane-elliott"
    },
    {
      "id": "cours:psy-l1-s1-ue1-td04-depression",
      "slug": "td04-symptomes-trouble-depressif-f32.md",
      "title": "TD04 — Symptômes et trouble dépressif majeur (F32)",
      "module": "TD — Histoire & Thème",
      "courseTheme": "clinique",
      "sourceType": "Prise de notes personnelle",
      "format": "Notes de TD",
      "sequence": 12,
      "description": "Analyse sémiologique, DSM/CIM-10 et repères diagnostiques du trouble dépressif majeur.",
      "themes": [
        "Psychopathologie",
        "Dépression",
        "Sémiologie",
        "CIM-10"
      ],
      "keywords": [
        "F32",
        "DSM",
        "CIM",
        "symptômes",
        "diagnostic",
        "dépression",
        "TD4 - Les symptômes & le trouble dépressif majeur F32.docx",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Prise de notes personnelle"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/td04-symptomes-trouble-depressif-f32.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-td04-depression"
    },
    {
      "id": "cours:psy-l1-s1-ue1-doc-petit-traite-resume",
      "slug": "document-resume-petit-traite-manipulation.md",
      "title": "Document — Résumé du Petit traité de manipulation à l’usage des honnêtes gens",
      "module": "TD — Histoire & Thème",
      "courseTheme": "sociale",
      "sourceType": "Document associé",
      "format": "Résumé — PDF converti en texte",
      "sequence": 13,
      "description": "Résumé détaillé des mécanismes d’engagement, de soumission librement consentie et des techniques d’influence.",
      "themes": [
        "Psychologie sociale",
        "Influence",
        "Engagement",
        "Manipulation"
      ],
      "keywords": [
        "Joule",
        "Beauvois",
        "engagement",
        "pied-dans-la-porte",
        "porte-au-nez",
        "soumission librement consentie",
        "RésuméPetit-traité-de-manipulation-à-lusage-des-honnêtes-gens.pdf",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Document associé"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/document-resume-petit-traite-manipulation.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-doc-petit-traite-resume"
    },
    {
      "id": "cours:psy-l1-s1-ue1-doc-petit-traite-schema",
      "slug": "document-schema-petit-traite-manipulation.md",
      "title": "Document — Schéma du Petit traité de manipulation",
      "module": "TD — Histoire & Thème",
      "courseTheme": "sociale",
      "sourceType": "Document associé",
      "format": "Schéma de synthèse — PDF converti en texte",
      "sequence": 14,
      "description": "Synthèse des principales techniques de manipulation et des conditions qui renforcent l’engagement.",
      "themes": [
        "Psychologie sociale",
        "Influence",
        "Manipulation"
      ],
      "keywords": [
        "pied-dans-la-porte",
        "porte-au-nez",
        "amorçage",
        "étiquetage",
        "toucher",
        "engagement",
        "Schéma-Petit-Traité.pdf",
        "TD — Histoire & Thème",
        "UE1 — Thèmes et histoire de la psychologie",
        "Document associé"
      ],
      "kind": "cours",
      "formation": "Psychologie",
      "degree": "Licence",
      "year": "L1",
      "semester": "Semestre 1",
      "ue": "UE1 — Thèmes et histoire de la psychologie",
      "domain": "psycho",
      "people": [],
      "source": "Cours universitaires",
      "subject": "TD — Histoire & Thème",
      "contentUrl": "/mediatheque/cours/contenus/psycho/l1/s1/ue1/document-schema-petit-traite-manipulation.md",
      "url": "/mediatheque/cours/?id=psy-l1-s1-ue1-doc-petit-traite-schema"
    }
    ,
    {
      "id": "video:milgram-jeu-de-la-mort",
      "kind": "video",
      "videoType": "film",
      "title": "Le Jeu de la mort — jusqu’où obéit-on à une autorité ?",
      "creator": "France Télévisions",
      "description": "Documentaire qui transpose le protocole de Milgram dans un faux jeu télévisé afin d’interroger la soumission à l’autorité, la pression de la situation et la responsabilité individuelle.",
      "url": "https://www.youtube.com/watch?v=JFbFQEk2aLY&t=875s",
      "source": "YouTube",
      "section": "Psychologie sociale",
      "themes": [
        "Liberté",
        "Déterminisme",
        "Conditionnement",
        "Psychologie sociale",
        "Autorité",
        "Obéissance"
      ],
      "people": [
        "Stanley Milgram"
      ],
      "keywords": [
        "Milgram",
        "expérience de Milgram",
        "Le Jeu de la mort",
        "soumission à l’autorité",
        "obéissance",
        "pression sociale",
        "responsabilité",
        "liberté",
        "déterminisme",
        "conditionnement",
        "autonomie",
        "hétéronomie"
      ]
    },
    {
      "id": "video:milgram-i-comme-icare",
      "kind": "video",
      "videoType": "film",
      "title": "I comme Icare — reconstitution de l’expérience de Milgram",
      "creator": "Henri Verneuil",
      "description": "Scène de fiction mettant en images le protocole de Milgram. Une ressource particulièrement claire pour observer la montée progressive de l’obéissance, l’autorité du scientifique et le conflit entre conscience morale et consigne.",
      "url": "https://www.youtube.com/watch?v=I7to2P8osl0",
      "source": "YouTube",
      "section": "Cinéma & psychologie sociale",
      "themes": [
        "Liberté",
        "Déterminisme",
        "Conditionnement",
        "Psychologie sociale",
        "Autorité",
        "Responsabilité"
      ],
      "people": [
        "Stanley Milgram",
        "Henri Verneuil"
      ],
      "keywords": [
        "Milgram",
        "expérience de Milgram",
        "I comme Icare",
        "soumission à l’autorité",
        "obéissance",
        "responsabilité morale",
        "liberté",
        "déterminisme",
        "conditionnement",
        "autonomie",
        "hétéronomie"
      ]
    },
    {
      "id": "video:milgram-science-etonnante",
      "kind": "video",
      "videoType": "cours",
      "title": "L’expérience de Milgram — analyse critique",
      "creator": "ScienceEtonnante — David Louapre",
      "description": "Analyse détaillée de l’expérience de Milgram, de son protocole, de ses résultats et surtout des limites de leur interprétation. Utile pour ne pas réduire Milgram à l’idée simpliste d’une obéissance aveugle.",
      "url": "https://www.youtube.com/watch?v=7Vy1Cg5O5Pc&t=551s",
      "source": "YouTube",
      "section": "Analyse & psychologie sociale",
      "themes": [
        "Liberté",
        "Déterminisme",
        "Conditionnement",
        "Psychologie sociale",
        "Science",
        "Autorité"
      ],
      "people": [
        "Stanley Milgram",
        "David Louapre"
      ],
      "keywords": [
        "Milgram",
        "expérience de Milgram",
        "Science Étonnante",
        "ScienceEtonnante",
        "David Louapre",
        "soumission à l’autorité",
        "méthodologie expérimentale",
        "critique de Milgram",
        "obéissance",
        "liberté",
        "déterminisme",
        "conditionnement"
      ]
    },
    {
      "id": "video:milgram-documentaire-archives",
      "kind": "video",
      "videoType": "film",
      "title": "L’expérience de Milgram — documentaire d’archives",
      "creator": "Documentaire",
      "description": "Ancien documentaire consacré à l’expérience de Milgram et à la soumission à l’autorité. Il permet de compléter les reconstitutions contemporaines par une présentation plus proche du contexte historique de l’expérience.",
      "url": "https://www.youtube.com/watch?v=pAuDIGkL70U",
      "source": "YouTube",
      "section": "Psychologie sociale",
      "themes": [
        "Liberté",
        "Déterminisme",
        "Conditionnement",
        "Psychologie sociale",
        "Autorité",
        "Obéissance"
      ],
      "people": [
        "Stanley Milgram"
      ],
      "keywords": [
        "Milgram",
        "expérience de Milgram",
        "documentaire Milgram",
        "archives",
        "soumission à l’autorité",
        "obéissance",
        "liberté",
        "déterminisme",
        "conditionnement",
        "responsabilité"
      ]
    }
  ],
  "dossiers": [
    {
      "id": "milgram-liberte-determinisme-conditionnement",
      "title": "Milgram — liberté, déterminisme et conditionnement",
      "eyebrow": "Dossier thématique",
      "description": "Quatre ressources complémentaires pour étudier l’expérience de Milgram : transposition télévisuelle, scène de fiction, analyse critique et documentaire d’archives. À utiliser pour penser l’obéissance, la liberté, le poids de la situation et la responsabilité.",
      "themes": [
        "Liberté",
        "Déterminisme",
        "Conditionnement",
        "Psychologie sociale",
        "Autorité",
        "Obéissance"
      ],
      "resourceIds": [
        "video:milgram-jeu-de-la-mort",
        "video:milgram-i-comme-icare",
        "video:milgram-science-etonnante",
        "video:milgram-documentaire-archives"
      ]
    },
    {
      "id": "therese-avila",
      "title": "Thérèse d’Avila",
      "eyebrow": "Dossier personnel",
      "description": "Réunir au même endroit ses œuvres présentes dans la bibliothèque, les podcasts déjà repérés et les futurs textes, vidéos ou documentaires.",
      "themes": [
        "Mystique",
        "Carmel",
        "Oraison",
        "Contemplation"
      ],
      "resourceIds": [
        "livre:therese-avila-chemins-perfection",
        "livre:therese-avila-chemin-perfection",
        "livre:therese-avila-chateau-ame",
        "livre:therese-avila-livre-vie",
        "podcast:france-culture-vie-spirituelle-therese-avila",
        "podcast:france-inter-marche-histoire-therese-avila",
        "podcast:rcf-chretiens-histoire-therese-avila",
        "podcast:radio-maria-therese-avila-union-dieu"
      ]
    },
    {
      "id": "mystique-carmelitaine",
      "title": "Mystique carmélitaine",
      "eyebrow": "Parcours transversal",
      "description": "Passer de Thérèse d’Avila à Jean de la Croix en mêlant lecture, écoute et ressources de travail autour de l’oraison et de la contemplation.",
      "themes": [
        "Mystique",
        "Carmel",
        "Oraison",
        "Jean de la Croix",
        "Thérèse d’Avila"
      ],
      "resourceIds": [
        "livre:therese-avila-chemins-perfection",
        "livre:therese-avila-chemin-perfection",
        "livre:therese-avila-chateau-ame",
        "livre:therese-avila-livre-vie",
        "livre:jean-croix-oeuvres-completes",
        "podcast:france-culture-vie-spirituelle-therese-avila",
        "podcast:france-inter-marche-histoire-therese-avila",
        "podcast:rcf-chretiens-histoire-therese-avila",
        "podcast:radio-maria-therese-avila-union-dieu"
      ]
    }
  ]
};

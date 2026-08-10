(function () {
  "use strict";

  const browser = document.querySelector("[data-repere-browser]");
  if (!browser) return;

  const panel = browser.querySelector("[data-repere-panel]");
  const initialList = browser.querySelector("[data-repere-list]");
  const description = browser.querySelector("[data-repere-view-description]");
  const buttons = Array.from(browser.querySelectorAll("[data-repere-view]"));

  if (!panel || !initialList || !description || !buttons.length) return;

  const sourceCards = Array.from(initialList.querySelectorAll(".blog-repere")).map((card) => card.cloneNode(true));
  sourceCards.sort((left, right) => {
    const leftLabel = left.querySelector("dt")?.textContent.trim() || "";
    const rightLabel = right.querySelector("dt")?.textContent.trim() || "";
    return leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" });
  });

  const categories = [
    {
      id: "concepts",
      label: "Définir et classer",
      description: "Préciser l’extension, la forme ou l’identité d’une notion."
    },
    {
      id: "raisonnement",
      label: "Raisonner et argumenter",
      description: "Organiser une démonstration, une explication ou une discussion."
    },
    {
      id: "connaissance",
      label: "Connaître et établir le vrai",
      description: "Accéder à un objet, justifier une affirmation et en évaluer la vérité."
    },
    {
      id: "realite",
      label: "Penser le réel et ses modalités",
      description: "Distinguer des façons d’être, des conditions d’existence et des possibilités."
    },
    {
      id: "action",
      label: "Juger, agir et vivre ensemble",
      description: "Penser l’action, les normes, le droit et la vie collective."
    }
  ];

  const themes = [
    "Art",
    "Bonheur",
    "Conscience",
    "Devoir",
    "État",
    "Inconscient",
    "Justice",
    "Langage",
    "Liberté",
    "Nature",
    "Raison",
    "Religion",
    "Science",
    "Technique",
    "Temps",
    "Travail",
    "Vérité"
  ];

  const viewDescriptions = {
    alphabetical: "La liste officielle, présentée dans son ordre alphabétique.",
    categories: "Une proposition de regroupement en cinq familles, selon l’usage principal de chaque distinction.",
    themes: "Une proposition personnelle des repères associés aux notions du programme de Terminale. Ce classement n’est pas fixé et peut varier selon l’interprétation."
  };

  // Dans « Par notions », un même repère reçoit des exemples différents selon
  // la notion étudiée afin d'éviter les illustrations hors contexte.
  const thematicExamples = {
  "Absolu / relatif": {
    "Bonheur": [
      "Un plaisir dépend souvent de la situation : il est <em>relatif</em> à des circonstances ; un bonheur qui ne dépendrait d’aucune circonstance serait pensé comme <em>absolu</em>.",
      "Les stoïciens cherchent un bien suffisamment stable pour ne pas être <em>relatif</em> aux succès et aux échecs extérieurs : la vertu tend alors à valoir de manière <em>absolue</em>."
    ],
    "Temps": [
      "« Demain » est une indication <em>relative</em> au jour où l’on parle ; « le 12 août 2026 » fixe une date indépendamment de ce point de vue et fonctionne comme un repère plus <em>absolu</em>.",
      "La physique classique a pu penser un temps <em>absolu</em> ; les théories de la relativité montrent au contraire que certaines mesures temporelles dépendent du référentiel et sont donc <em>relatives</em>."
    ],
    "Vérité": [
      "Dire « cette pièce est chaude » est <em>relatif</em> à un seuil ou à une comparaison ; une proposition tenue pour vraie sans dépendre d’aucun point de vue prétend à une vérité <em>absolue</em>.",
      "Le relativisme soutient que certaines vérités dépendent d’un cadre ; à l’inverse, une démonstration mathématique prétend valoir de façon <em>absolue</em>, et non seulement <em>relative</em> à une opinion."
    ],
    "Religion": [
      "Une croyance ou une pratique religieuse peut être <em>relative</em> à une tradition historique ; Dieu est souvent pensé, dans le théisme classique, comme l’<em>Absolu</em> qui ne dépend de rien d’autre.",
      "Chez de nombreux théologiens, les créatures ont une existence <em>relative</em> et dépendante, tandis que Dieu est conçu comme l’être <em>absolu</em>."
    ]
  },
  "Abstrait / concret": {
    "Art": [
      "La « beauté » est une idée <em>abstraite</em> ; un tableau précis que l’on peut voir au musée est une œuvre <em>concrète</em>.",
      "Une théorie <em>abstraite</em> du beau ne remplace pas l’expérience <em>concrète</em> d’une œuvre singulière, avec sa matière, ses couleurs et sa composition."
    ],
    "Langage": [
      "Le mot « arbre » renvoie à une notion <em>abstraite</em> ; le chêne que je montre du doigt est un être <em>concret</em>.",
      "Un terme général permet au langage d’<em>abstraire</em> des caractères communs à plusieurs réalités <em>concrètes</em>."
    ],
    "Science": [
      "L’équation qui décrit la chute d’un corps est <em>abstraite</em> ; la bille qui tombe dans une expérience est <em>concrète</em>.",
      "Une loi scientifique construit un modèle <em>abstrait</em> à partir de phénomènes <em>concrets</em> observables et mesurables."
    ]
  },
  "En acte / en puissance": {
    "Nature": [
      "Un gland est un chêne <em>en puissance</em> ; le chêne développé est cette possibilité devenue <em>en acte</em>.",
      "Chez Aristote, la graine possède <em>en puissance</em> certaines formes de développement que la croissance réalise progressivement <em>en acte</em>."
    ],
    "Technique": [
      "Un téléphone éteint possède <em>en puissance</em> plusieurs fonctions ; lorsqu’une application fonctionne, l’une de ces capacités passe <em>en acte</em>.",
      "Une matière peut recevoir <em>en puissance</em> plusieurs formes techniques ; le travail de l’artisan actualise l’une d’elles <em>en acte</em>."
    ],
    "Travail": [
      "Le plan d’une maison contient le bâtiment <em>en puissance</em> ; le chantier achevé le fait exister <em>en acte</em>.",
      "Une compétence acquise par formation existe d’abord comme capacité <em>en puissance</em>, puis se manifeste <em>en acte</em> lorsque le travailleur l’exerce."
    ],
    "Inconscient": [
      "Une tendance peut rester <em>en puissance</em> sans être consciente ; elle passe <em>en acte</em> lorsqu’elle se manifeste dans un geste, un rêve ou un lapsus.",
      "Dans une lecture freudienne, un désir latent peut demeurer <em>en puissance</em> puis s’actualiser <em>en acte</em> sous une forme détournée dans le symptôme."
    ]
  },
  "Analyse / synthèse": {
    "Science": [
      "Étudier séparément la température, la pression et le volume d’un gaz relève de l’<em>analyse</em> ; les relier dans un même modèle relève de la <em>synthèse</em>.",
      "Une recherche scientifique <em>analyse</em> des variables isolées puis cherche une <em>synthèse</em> capable d’expliquer leur fonctionnement commun."
    ],
    "Raison": [
      "Repérer séparément les prémisses d’un argument est une <em>analyse</em> ; reconstruire le raisonnement d’ensemble est une <em>synthèse</em>.",
      "Dans une dissertation, l’<em>analyse</em> distingue les aspects du problème ; la <em>synthèse</em> les articule dans une réponse cohérente."
    ],
    "Inconscient": [
      "Isoler les différents éléments d’un rêve est une <em>analyse</em> ; les relier à un conflit ou à un désir latent constitue une <em>synthèse</em> interprétative.",
      "Freud procède souvent par <em>analyse</em> des associations du patient avant de proposer une <em>synthèse</em> donnant sens à leur ensemble."
    ]
  },
  "Concept / image / métaphore": {
    "Art": [
      "La mélancolie est un <em>concept</em> ; une figure assise peut en être une <em>image</em> ; parler d’un « soleil noir » est une <em>métaphore</em>.",
      "Une œuvre peut faire sentir un <em>concept</em> à travers une <em>image</em>, tandis qu’une <em>métaphore</em> rapproche deux domaines sans les identifier littéralement."
    ],
    "Langage": [
      "La liberté est un <em>concept</em> ; des chaînes brisées en donnent une <em>image</em> ; dire « sortir de sa cage » emploie une <em>métaphore</em>.",
      "Le langage conceptuel vise la précision ; la <em>métaphore</em> produit du sens par transfert, et l’<em>image</em> donne une représentation sensible."
    ],
    "Raison": [
      "La justice est un <em>concept</em> ; la balance en est une <em>image</em> conventionnelle ; parler d’« équilibrer les intérêts » est une <em>métaphore</em>.",
      "Une argumentation doit distinguer le <em>concept</em> qu’elle définit des <em>images</em> ou <em>métaphores</em> qui ne font que l’éclairer."
    ]
  },
  "Contingent / nécessaire": {
    "Liberté": [
      "Choisir de prendre le bus plutôt que le vélo est <em>contingent</em> : j’aurais pu agir autrement ; ce qui est <em>nécessaire</em> ne laisse précisément aucune alternative.",
      "La liberté est souvent pensée à partir de la possibilité d’actes <em>contingents</em>, contre l’idée que toutes nos actions seraient produites de manière <em>nécessaire</em>."
    ],
    "Nature": [
      "La présence de cet arbre précis à cet endroit est <em>contingente</em> ; certaines conditions, comme l’eau pour sa survie, sont <em>nécessaires</em> sous des conditions données.",
      "Hume souligne que les lois de la nature ne sont pas <em>nécessaires</em> au sens logique : leur contraire reste concevable, même si l’expérience les rend très régulières."
    ],
    "Bonheur": [
      "Gagner à la loterie est un événement <em>contingent</em> : on ne peut pas en faire une condition <em>nécessaire</em> du bonheur.",
      "Les philosophies antiques cherchent souvent ce qui serait <em>nécessaire</em> à une vie heureuse — par exemple la vertu — plutôt que de la faire dépendre de biens <em>contingents</em>."
    ]
  },
  "Croire / savoir": {
    "Religion": [
      "Avoir la foi consiste à <em>croire</em> ; prétendre <em>savoir</em> que Dieu existe demanderait une justification d’un autre type, par exemple une démonstration.",
      "Pascal distingue la foi et les preuves de la raison : <em>croire</em> religieusement ne se confond pas avec <em>savoir</em> au sens démonstratif."
    ],
    "Science": [
      "Penser qu’un médicament fonctionne parce qu’un proche le dit, c’est <em>croire</em> ; disposer d’essais contrôlés permet de prétendre davantage <em>savoir</em>.",
      "La science transforme une croyance ou une hypothèse en <em>savoir</em> seulement si elle peut produire des raisons, des mesures et des tests contrôlables."
    ],
    "Vérité": [
      "Prendre une rumeur pour vraie, c’est <em>croire</em> ; vérifier les faits auprès de sources concordantes permet de prétendre <em>savoir</em>.",
      "Une conviction très forte peut rester une <em>croyance</em> : le degré de certitude psychologique ne suffit pas à constituer un <em>savoir</em>."
    ],
    "Raison": [
      "Je peux <em>croire</em> qu’un calcul est juste parce qu’il « a l’air bon » ; je peux dire que je le <em>sais</em> après l’avoir démontré ou vérifié.",
      "La raison cherche à faire passer de l’opinion que l’on <em>croit</em> à une proposition que l’on peut prétendre <em>savoir</em> parce qu’on en donne les raisons."
    ]
  },
  "Essentiel / accidentel": {
    "Nature": [
      "Pour un chêne, appartenir au vivant végétal est <em>essentiel</em> ; mesurer exactement 12 mètres est <em>accidentel</em>.",
      "Dans la tradition aristotélicienne, une propriété <em>essentielle</em> entre dans ce qu’est la chose, tandis qu’un caractère <em>accidentel</em> peut changer sans détruire son identité."
    ],
    "Art": [
      "Pour un sonnet classique, sa structure poétique est plus <em>essentielle</em> que la couleur <em>accidentelle</em> du papier sur lequel il est imprimé.",
      "Demander ce qui est <em>essentiel</em> à une œuvre permet de distinguer son identité artistique des propriétés <em>accidentelles</em> de son support ou de son exposition."
    ],
    "Conscience": [
      "Être triste aujourd’hui est <em>accidentel</em> à mon identité ; la question est de savoir ce qui, dans la conscience, serait <em>essentiel</em> pour que je reste la même personne.",
      "Chez Locke, la continuité de la conscience et de la mémoire joue un rôle <em>essentiel</em> dans l’identité personnelle, contrairement à de nombreux changements <em>accidentels</em> du corps ou de la situation."
    ]
  },
  "Exemple / preuve": {
    "Science": [
      "Observer un cygne blanc donne un <em>exemple</em> de cygne ; cela ne constitue pas une <em>preuve</em> que tous les cygnes sont blancs.",
      "Un seul contre-<em>exemple</em> — un cygne noir — peut en revanche servir de <em>preuve</em> contre l’énoncé universel « tous les cygnes sont blancs »."
    ],
    "Vérité": [
      "Raconter un cas où quelqu’un a menti fournit un <em>exemple</em> ; établir qu’il a menti exige une <em>preuve</em> portant sur ce cas.",
      "Une thèse ne devient pas vraie parce qu’on accumule des <em>exemples</em> parlants : une <em>preuve</em> doit établir ce qu’elle affirme."
    ],
    "Raison": [
      "Dessiner un triangle est un <em>exemple</em> de triangle ; démontrer que la somme de ses angles possède telle propriété relève de la <em>preuve</em>.",
      "Dans un raisonnement, l’<em>exemple</em> illustre une proposition, alors que la <em>preuve</em> doit en établir la validité."
    ]
  },
  "Expliquer / comprendre": {
    "Science": [
      "On peut <em>expliquer</em> un arc-en-ciel par la réfraction de la lumière ; <em>comprendre</em> ce qu’il signifie dans un récit relève d’une autre démarche.",
      "Les sciences de la nature cherchent principalement à <em>expliquer</em> par des causes et des lois, tandis que la <em>compréhension</em> devient centrale lorsqu’il faut saisir un sens ou une intention."
    ],
    "Inconscient": [
      "On peut <em>expliquer</em> un symptôme par un mécanisme psychique et chercher en même temps à <em>comprendre</em> le sens qu’il prend dans l’histoire du sujet.",
      "L’interprétation freudienne ne se contente pas d’<em>expliquer</em> causalement : elle cherche aussi à <em>comprendre</em> ce qu’un rêve ou un lapsus exprime indirectement."
    ],
    "Art": [
      "La chimie peut <em>expliquer</em> pourquoi un pigment vieillit ; elle ne suffit pas à <em>comprendre</em> ce que l’œuvre cherche à montrer.",
      "On peut <em>expliquer</em> la technique de Picasso et chercher à <em>comprendre</em> le sens politique et humain de <cite>Guernica</cite>."
    ]
  },
  "En fait / en droit": {
    "Justice": [
      "Deux citoyens peuvent être égaux <em>en droit</em> tout en disposant de ressources très inégales <em>en fait</em>.",
      "Une théorie de la justice demande souvent si l’égalité proclamée <em>en droit</em> est réellement assurée <em>en fait</em>."
    ],
    "Devoir": [
      "Je peux avoir <em>en droit</em> l’obligation de tenir une promesse et, <em>en fait</em>, ne pas la tenir.",
      "Le devoir indique ce qui doit valoir <em>en droit</em>, même lorsque les comportements observés <em>en fait</em> s’en écartent."
    ],
    "État": [
      "Une Constitution garantit <em>en droit</em> une liberté ; des pratiques administratives peuvent pourtant la restreindre <em>en fait</em>.",
      "L’État de droit se juge non seulement aux règles valables <em>en droit</em>, mais aussi à leur application effective <em>en fait</em>."
    ]
  },
  "Formel / matériel": {
    "Justice": [
      "Donner exactement la même règle à tous assure une égalité <em>formelle</em> ; corriger des écarts réels de ressources relève d’une égalité plus <em>matérielle</em>.",
      "Une justice seulement <em>formelle</em> peut laisser subsister des inégalités <em>matérielles</em> qui empêchent certains d’exercer réellement leurs droits."
    ],
    "Travail": [
      "Le contrat fixe les conditions <em>formelles</em> d’un emploi ; la fatigue, le salaire réel ou l’organisation quotidienne constituent ses conditions <em>matérielles</em>.",
      "Deux emplois peuvent être identiques <em>formellement</em> sur le papier tout en étant très différents <em>matériellement</em> dans leur exercice."
    ],
    "Temps": [
      "Le calendrier fournit une structure <em>formelle</em> pour ordonner les dates ; les événements vécus constituent le contenu <em>matériel</em> de ce temps.",
      "Chez Kant, le temps est une forme de l’expérience : il organise <em>formellement</em> des contenus sensibles qui lui donnent une matière <em>matérielle</em>."
    ]
  },
  "Genre / espèce / individu": {
    "Nature": [
      "« Animal » peut fonctionner comme <em>genre</em>, « être humain » comme <em>espèce</em>, et Socrate comme <em>individu</em>.",
      "La classification du vivant distingue des niveaux : le <em>genre</em> rassemble plusieurs espèces, l’<em>espèce</em> plusieurs individus, et l’<em>individu</em> est un vivant singulier."
    ],
    "Langage": [
      "Le terme « animal » désigne un <em>genre</em>, « homme » une <em>espèce</em> et le nom propre « Socrate » un <em>individu</em>.",
      "Les mots généraux permettent au langage de classer : un <em>genre</em> est plus étendu qu’une <em>espèce</em>, tandis qu’un nom propre peut viser un <em>individu</em>."
    ]
  },
  "Hypothèse / conséquence / conclusion": {
    "Science": [
      "<em>Hypothèse</em> : ce traitement réduit la fièvre ; <em>conséquence</em> attendue : le groupe traité doit aller mieux ; <em>conclusion</em> : on compare les résultats pour accepter ou rejeter l’hypothèse.",
      "La méthode expérimentale formule une <em>hypothèse</em>, en déduit des <em>conséquences</em> testables, puis tire une <em>conclusion</em> à partir de l’expérience."
    ],
    "Inconscient": [
      "<em>Hypothèse</em> : une pensée inconsciente agit ; <em>conséquence</em> : elle peut apparaître indirectement dans un lapsus ; <em>conclusion</em> : l’interprétation évalue si plusieurs indices convergent.",
      "Freud traite l’inconscient comme une <em>hypothèse</em> dont il cherche les <em>conséquences</em> dans les rêves et symptômes avant d’en tirer des <em>conclusions</em> cliniques."
    ],
    "Raison": [
      "<em>Hypothèse</em> : √2 est rationnel ; si cette hypothèse entraîne une <em>conséquence</em> contradictoire, la <em>conclusion</em> est qu’elle est fausse.",
      "Le raisonnement par l’absurde part d’une <em>hypothèse</em>, en déroule les <em>conséquences</em>, puis conclut à son rejet lorsqu’une contradiction apparaît."
    ]
  },
  "Idéal / réel": {
    "Bonheur": [
      "La vie parfaite que l’on imagine est un bonheur <em>idéal</em> ; la vie effectivement vécue, avec ses limites, appartient au <em>réel</em>.",
      "Une philosophie du bonheur doit distinguer l’<em>idéal</em> d’une satisfaction totale des conditions <em>réelles</em> dans lesquelles une vie humaine peut être heureuse."
    ],
    "Art": [
      "Un peintre peut travailler à partir d’une beauté <em>idéale</em> plutôt que copier exactement un modèle <em>réel</em>.",
      "L’art classique a souvent opposé l’imitation du <em>réel</em> à la recherche d’une forme <em>idéale</em> plus parfaite que les modèles particuliers."
    ],
    "Justice": [
      "Une société parfaitement équitable est un <em>idéal</em> ; les institutions existantes constituent le <em>réel</em> auquel cet idéal sert de critère.",
      "Rawls construit une situation <em>idéale</em> de choix pour évaluer plus lucidement les règles de justice du monde <em>réel</em>."
    ]
  },
  "Identité / égalité / différence": {
    "Justice": [
      "Deux personnes peuvent avoir des droits <em>égaux</em> sans être <em>identiques</em> : leurs <em>différences</em> de situation peuvent même justifier des aides différentes.",
      "L’égalité juridique n’exige pas l’<em>identité</em> des individus ; la justice doit déterminer quelles <em>différences</em> sont pertinentes sans nier leur égale dignité."
    ],
    "Liberté": [
      "Deux personnes peuvent être <em>également</em> libres tout en faisant des choix <em>différents</em> : l’égalité de liberté n’impose pas l’<em>identité</em> des conduites.",
      "Une société libre doit concilier l’<em>égalité</em> des droits avec la <em>différence</em> des projets individuels, sans exiger l’<em>identité</em> des modes de vie."
    ],
    "Conscience": [
      "Je me reconnais comme la même personne — mon <em>identité</em> — malgré les nombreuses <em>différences</em> entre l’enfant que j’étais et l’adulte que je suis.",
      "Le problème de l’identité personnelle demande ce qui maintient une <em>identité</em> à travers les <em>différences</em> de souvenirs, d’états de conscience et de corps."
    ]
  },
  "Impossible / possible": {
    "Technique": [
      "Voler était longtemps <em>impossible</em> techniquement pour l’être humain ; l’invention de l’avion l’a rendu <em>possible</em> sans changer les lois physiques.",
      "La technique déplace la frontière du <em>possible</em> pratique, mais ne rend pas <em>possible</em> ce qui est contradictoire ou physiquement impossible."
    ],
    "Liberté": [
      "Si une porte est murée, sortir est <em>impossible</em> ; si elle est ouverte, sortir devient <em>possible</em>, même si je décide de rester.",
      "Parler de liberté suppose de distinguer ce qui est réellement <em>possible</em> pour l’agent de ce qui lui est rendu <em>impossible</em> par la contrainte."
    ],
    "Raison": [
      "Un cercle carré est <em>impossible</em> parce que sa définition est contradictoire ; l’existence d’une vie ailleurs dans l’univers reste logiquement <em>possible</em>.",
      "La raison distingue l’<em>impossible</em> contradictoire du simple non-réalisé : ce qui n’existe pas encore peut rester <em>possible</em>."
    ]
  },
  "Intuitif / discursif": {
    "Conscience": [
      "La douleur est saisie de manière assez <em>intuitive</em> et immédiate ; comprendre pourquoi elle est apparue demande un raisonnement plus <em>discursif</em>.",
      "La conscience de soi peut sembler <em>intuitive</em>, alors que l’analyse de ses causes, de ses motifs ou de son identité procède <em>discursivement</em>."
    ],
    "Temps": [
      "Sentir qu’une attente « dure longtemps » relève d’une expérience <em>intuitive</em> ; calculer sa durée en minutes est une opération plus <em>discursive</em>.",
      "Bergson oppose l’intuition de la durée vécue aux découpages <em>discursifs</em> et spatialisés par lesquels nous mesurons le temps."
    ],
    "Raison": [
      "Voir immédiatement que deux quantités sont égales peut être <em>intuitif</em> ; démontrer pourquoi elles le sont étape par étape est <em>discursif</em>.",
      "Chez Descartes, l’intuition saisit une vérité simple, tandis que la déduction <em>discursive</em> enchaîne plusieurs étapes du raisonnement."
    ]
  },
  "Légal / légitime": {
    "Justice": [
      "Une discrimination peut avoir été <em>légale</em> dans un régime donné sans être pour autant <em>légitime</em> du point de vue de la justice.",
      "Antigone oppose la loi <em>légale</em> de Créon à ce qu’elle tient pour une exigence supérieure et <em>légitime</em>."
    ],
    "État": [
      "Un gouvernement peut accéder au pouvoir selon une procédure <em>légale</em> ; sa capacité à être reconnu comme juste et acceptable concerne sa <em>légitimité</em>.",
      "La philosophie politique distingue la conformité <em>légale</em> aux règles de l’autorité et la question plus profonde de sa <em>légitimité</em>."
    ],
    "Devoir": [
      "Un ordre peut être <em>légal</em> tout en paraissant moralement <em>illégitime</em>, de sorte que le devoir d’obéir devient problématique.",
      "La désobéissance civile soutient parfois qu’un devoir moral <em>légitime</em> peut entrer en conflit avec une obligation strictement <em>légale</em>."
    ]
  },
  "Médiat / immédiat": {
    "Conscience": [
      "J’éprouve une douleur de façon <em>immédiate</em> ; l’image que j’ai de moi à travers le regard des autres est plus <em>médiate</em>.",
      "La conscience paraît parfois se donner à elle-même <em>immédiatement</em>, mais la mémoire, le langage et autrui rendent une grande part de la connaissance de soi <em>médiate</em>."
    ],
    "Inconscient": [
      "Je n’accède pas <em>immédiatement</em> à une pensée inconsciente ; je l’infère de manière <em>médiate</em> à partir d’un rêve, d’un symptôme ou d’un lapsus.",
      "Chez Freud, l’inconscient n’est connu que <em>médiatement</em> par ses effets, contrairement à un état conscient qui peut sembler donné plus <em>immédiatement</em>."
    ],
    "Langage": [
      "Voir un objet est un rapport relativement <em>immédiat</em> ; en parler à quelqu’un qui ne le voit pas passe par la <em>médiation</em> des mots.",
      "Le langage rend notre rapport au monde <em>médiat</em> en introduisant des signes entre la chose, la pensée et l’interlocuteur."
    ]
  },
  "Objectif / subjectif / intersubjectif": {
    "Vérité": [
      "La température mesurée par un thermomètre vise une donnée <em>objective</em> ; « j’ai très chaud » exprime un ressenti <em>subjectif</em> ; plusieurs observateurs suivant le même protocole construisent un accord <em>intersubjectif</em>.",
      "La vérité ne se réduit pas à une conviction <em>subjective</em> : elle cherche des raisons <em>objectives</em> ou au moins contrôlables <em>intersubjectivement</em>."
    ],
    "Science": [
      "Une mesure instrumentale vise l’<em>objectivité</em> ; l’impression du chercheur est <em>subjective</em> ; la répétition par d’autres laboratoires rend le résultat <em>intersubjectivement</em> contrôlable.",
      "La méthode scientifique cherche à limiter le <em>subjectif</em> grâce à des procédures <em>objectives</em> que plusieurs chercheurs peuvent vérifier <em>intersubjectivement</em>."
    ],
    "Conscience": [
      "Ma douleur m’est donnée <em>subjectivement</em> ; une imagerie cérébrale fournit des données <em>objectives</em> ; mon récit permet à autrui d’en partager une compréhension <em>intersubjective</em>.",
      "L’expérience consciente est vécue à la première personne, donc <em>subjectivement</em>, mais elle peut être décrite et discutée dans un espace <em>intersubjectif</em> sans devenir totalement <em>objective</em>."
    ],
    "Art": [
      "La taille d’un tableau est <em>objective</em> ; « je le trouve bouleversant » est <em>subjectif</em> ; un jugement critique partagé et argumenté cherche une validité <em>intersubjective</em>.",
      "Kant ne réduit pas le goût à une préférence purement <em>subjective</em> : le jugement esthétique réclame l’assentiment d’autrui et vise ainsi une forme d’<em>intersubjectivité</em>."
    ]
  },
  "Obligation / contrainte": {
    "Devoir": [
      "Tenir une promesse est une <em>obligation</em> morale ; être physiquement empêché de partir par une porte verrouillée est une <em>contrainte</em>.",
      "Chez Kant, agir par devoir suppose une <em>obligation</em> reconnue par la raison, ce qui n’est pas la même chose que subir une <em>contrainte</em> extérieure."
    ],
    "Liberté": [
      "Respecter volontairement une règle que l’on juge juste relève de l’<em>obligation</em> ; obéir parce qu’on me menace relève de la <em>contrainte</em>.",
      "La liberté n’exclut pas toute <em>obligation</em> : elle s’oppose surtout à la <em>contrainte</em> qui supprime la possibilité de décider par soi-même."
    ],
    "État": [
      "Payer l’impôt est une <em>obligation</em> juridique ; l’usage de la force publique pour empêcher une action est une <em>contrainte</em>.",
      "L’État transforme certaines règles en <em>obligations</em> et dispose aussi d’un pouvoir de <em>contrainte</em> pour en assurer l’application."
    ]
  },
  "Origine / fondement": {
    "État": [
      "La conquête ou l’unification explique parfois l’<em>origine</em> historique d’un État ; le consentement ou le droit peuvent être invoqués comme son <em>fondement</em> légitime.",
      "Hobbes ou Rousseau ne racontent pas seulement l’<em>origine</em> historique de l’État : le contrat sert surtout à penser le <em>fondement</em> de l’autorité politique."
    ],
    "Devoir": [
      "L’éducation peut être à l’<em>origine</em> d’une habitude morale ; elle ne suffit pas forcément à en être le <em>fondement</em> rationnel.",
      "Kant cherche le <em>fondement</em> du devoir dans la raison, même si nos règles morales ont aussi une <em>origine</em> sociale et éducative."
    ],
    "Religion": [
      "Une tradition familiale peut expliquer l’<em>origine</em> d’une croyance ; le croyant peut chercher son <em>fondement</em> dans la Révélation ou dans des raisons théologiques.",
      "Freud s’interroge sur l’<em>origine</em> psychique de la religion ; Anselme ou Leibniz cherchent plutôt un <em>fondement</em> rationnel à l’affirmation de Dieu."
    ],
    "Nature": [
      "Le Big Bang concerne l’<em>origine</em> cosmologique de l’univers ; demander pourquoi il existe quelque chose plutôt que rien cherche un <em>fondement</em> d’un autre ordre.",
      "L’évolution explique l’<em>origine</em> historique de certaines formes vivantes ; une théorie du vivant cherche aussi les principes qui <em>fondent</em> leur organisation."
    ]
  },
  "Persuader / convaincre": {
    "Langage": [
      "Une publicité qui joue sur la peur cherche à <em>persuader</em> ; un raisonnement qui donne des preuves cherche à <em>convaincre</em>.",
      "La rhétorique peut <em>persuader</em> par les émotions et le style, tandis que l’argumentation rationnelle prétend <em>convaincre</em> par des raisons."
    ],
    "Vérité": [
      "Un mensonge bien raconté peut <em>persuader</em> quelqu’un ; cela ne suffit pas à le <em>convaincre</em> rationnellement d’une proposition vraie.",
      "Pour établir la vérité, il ne suffit pas de <em>persuader</em> un auditoire : il faut des raisons capables de <em>convaincre</em> indépendamment de l’effet rhétorique."
    ],
    "État": [
      "Un slogan électoral cherche souvent à <em>persuader</em> rapidement ; un débat argumenté sur une loi cherche davantage à <em>convaincre</em> les citoyens.",
      "Dans l’espace politique, la parole peut servir à <em>persuader</em> les foules ou à <em>convaincre</em> par une délibération publique fondée sur des raisons."
    ]
  },
  "Principe / cause / fin": {
    "Raison": [
      "Le principe de non-contradiction est un <em>principe</em> du raisonnement ; une étincelle peut être la <em>cause</em> d’un feu ; se chauffer peut être la <em>fin</em> recherchée en l’allumant.",
      "La raison distingue ce à partir de quoi l’on pense — le <em>principe</em> —, ce qui produit un effet — la <em>cause</em> — et ce en vue de quoi l’on agit — la <em>fin</em>."
    ],
    "Science": [
      "Un <em>principe</em> physique guide une explication ; un virus peut être la <em>cause</em> d’une maladie ; dire que la maladie existe « pour » une <em>fin</em> demanderait une justification finaliste supplémentaire.",
      "La science moderne privilégie souvent les <em>causes</em> et les lois ou <em>principes</em>, là où une explication par la <em>fin</em> relève d’une approche téléologique."
    ],
    "Technique": [
      "Le principe du levier est un <em>principe</em> mécanique ; la force exercée est une <em>cause</em> du mouvement ; soulever une charge est la <em>fin</em> de l’outil.",
      "Un objet technique met des <em>principes</em> en œuvre, organise des <em>causes</em> efficaces et est fabriqué en vue d’une <em>fin</em> déterminée."
    ],
    "Bonheur": [
      "Un <em>principe</em> moral peut guider mes choix ; une rencontre peut être la <em>cause</em> d’une joie ; le bonheur peut être recherché comme <em>fin</em> de la vie.",
      "Aristote définit le bonheur comme la <em>fin</em> ultime de l’action humaine, distincte des <em>causes</em> particulières de plaisir et des <em>principes</em> qui orientent l’action."
    ]
  },
  "Public / privé": {
    "État": [
      "Le budget d’une mairie relève du domaine <em>public</em> ; le compte bancaire d’un particulier relève du domaine <em>privé</em>.",
      "L’État organise la sphère <em>publique</em> tout en devant définir jusqu’où il peut intervenir dans la vie <em>privée</em> des citoyens."
    ],
    "Religion": [
      "Prier seul chez soi relève de la sphère <em>privée</em> ; une procession ou un culte collectif occupe l’espace <em>public</em>.",
      "La laïcité oblige à penser la distinction entre convictions religieuses <em>privées</em> et expression ou régulation de la religion dans l’espace <em>public</em>."
    ],
    "Justice": [
      "Un conflit familial paraît <em>privé</em>, mais une violence commise au domicile relève aussi de la justice <em>publique</em> lorsqu’elle viole des droits.",
      "La justice transforme certains torts <em>privés</em> en affaires <em>publiques</em> dès lors que la loi et la protection des personnes sont en jeu."
    ]
  },
  "Ressemblance / analogie": {
    "Art": [
      "Un portrait cherche parfois la <em>ressemblance</em> avec un visage réel ; comparer une composition musicale à une architecture relève plutôt de l’<em>analogie</em>.",
      "L’imitation artistique peut viser la <em>ressemblance</em>, tandis qu’une <em>analogie</em> rapproche des structures sans supposer qu’elles se ressemblent visuellement."
    ],
    "Langage": [
      "Dire qu’un enfant « ressemble » à son père exprime une <em>ressemblance</em> ; dire que « la mémoire est une bibliothèque » construit une <em>analogie</em>.",
      "La métaphore fonctionne souvent par <em>analogie</em> entre deux domaines, et non par simple <em>ressemblance</em> littérale entre les choses."
    ],
    "Science": [
      "Un modèle réduit peut présenter une <em>ressemblance</em> avec l’objet étudié ; le modèle de l’atome comme système solaire repose surtout sur une <em>analogie</em> de structure.",
      "Une <em>analogie</em> scientifique peut aider à penser un phénomène sans prétendre à une <em>ressemblance</em> exacte entre le modèle et le réel."
    ]
  },
  "Théorie / pratique": {
    "Science": [
      "La <em>théorie</em> de l’évolution organise des explications générales ; l’observation de terrain et l’expérimentation relèvent de la <em>pratique</em> scientifique.",
      "Une <em>théorie</em> scientifique doit pouvoir rencontrer la <em>pratique</em> de l’observation et du test, sans se réduire à une simple recette expérimentale."
    ],
    "Technique": [
      "Connaître en <em>théorie</em> le fonctionnement d’un vélo ne signifie pas savoir le réparer en <em>pratique</em>.",
      "La technique mobilise des connaissances <em>théoriques</em>, mais aussi des savoir-faire qui ne s’acquièrent qu’en <em>pratique</em>."
    ],
    "Travail": [
      "Lire les consignes de sécurité donne un savoir <em>théorique</em> ; accomplir correctement le geste professionnel relève de la <em>pratique</em>.",
      "Le travail montre l’écart possible entre ce qui est prévu en <em>théorie</em> et ce qui doit être ajusté dans la <em>pratique</em> réelle d’une activité."
    ],
    "Bonheur": [
      "Savoir en <em>théorie</em> qu’il faut mieux dormir ne rend pas heureux si l’on ne transforme rien dans sa <em>pratique</em> quotidienne.",
      "Les philosophies antiques présentent souvent la sagesse non comme une simple <em>théorie</em>, mais comme une <em>pratique</em> et un exercice de vie."
    ]
  },
  "Transcendant / immanent": {
    "Religion": [
      "Un Dieu situé au-delà du monde est pensé comme <em>transcendant</em> ; une présence divine agissant au cœur du monde est dite <em>immanente</em>.",
      "Le théisme classique insiste souvent sur la <em>transcendance</em> de Dieu, tandis que d’autres conceptions mettent davantage l’accent sur son <em>immanence</em>."
    ],
    "Nature": [
      "Expliquer la nature par un principe extérieur au monde fait appel à quelque chose de <em>transcendant</em> ; chercher son principe dans la nature elle-même privilégie l’<em>immanence</em>.",
      "Chez Spinoza, Dieu n’est pas un créateur <em>transcendant</em> séparé de la nature : la causalité divine est pensée comme <em>immanente</em>."
    ],
    "État": [
      "Un pouvoir conçu comme placé au-dessus de la société paraît <em>transcendant</em> aux citoyens ; un pouvoir qui procède de leur propre association peut être dit plus <em>immanent</em> au corps politique.",
      "Chez Rousseau, la volonté générale cherche à faire de la loi l’expression <em>immanente</em> du peuple plutôt qu’un commandement purement <em>transcendant</em> imposé de l’extérieur."
    ]
  },
  "Universel / général / particulier / singulier": {
    "Nature": [
      "« Tous les êtres humains sont mortels » prétend à l’<em>universel</em> ; « les mammifères » désigne une classe <em>générale</em> ; « les primates » un groupe plus <em>particulier</em> ; Socrate est <em>singulier</em>.",
      "Penser la nature oblige à passer de lois <em>universelles</em> ou classes <em>générales</em> à des cas <em>particuliers</em> et à des individus <em>singuliers</em>."
    ],
    "Science": [
      "Une loi prétend valoir <em>universellement</em> ; une tendance statistique est plus <em>générale</em> ; une expérience étudie un cas <em>particulier</em> ; une mesure précise est <em>singulière</em>.",
      "La science cherche à partir de faits <em>singuliers</em> et de cas <em>particuliers</em> pour construire des régularités <em>générales</em>, voire des lois <em>universelles</em>."
    ],
    "Langage": [
      "La faculté humaine de langage peut être pensée comme <em>universelle</em> ; une règle du français est <em>générale</em> ; un emploi exceptionnel est <em>particulier</em> ; cette phrase prononcée maintenant est <em>singulière</em>.",
      "Le langage permet de formuler des énoncés <em>universels</em> ou <em>généraux</em> tout en désignant des cas <em>particuliers</em> et des êtres <em>singuliers</em>."
    ],
    "Justice": [
      "Les droits humains se veulent <em>universels</em> ; une loi vaut de façon <em>générale</em> ; un régime spécial concerne un cas <em>particulier</em> ; un jugement tranche une situation <em>singulière</em>.",
      "La justice doit articuler des principes <em>universels</em> et des règles <em>générales</em> avec l’examen de situations <em>particulières</em> et de personnes <em>singulières</em>."
    ]
  },
  "Vrai / probable / certain": {
    "Vérité": [
      "Une proposition est <em>vraie</em> si elle correspond au réel ; elle peut seulement être <em>probable</em> avec les informations disponibles ; je peux me sentir <em>certain</em> sans qu’elle soit vraie.",
      "Descartes cherche une proposition à la fois <em>vraie</em> et <em>certaine</em>, alors que de nombreux jugements ordinaires restent seulement <em>probables</em>."
    ],
    "Science": [
      "Une prévision météo à 70 % est <em>probable</em>, non <em>certaine</em> ; la science cherche néanmoins à déterminer quelles propositions sont <em>vraies</em> au regard des données.",
      "Les sciences empiriques travaillent souvent avec des degrés de probabilité : un résultat peut être très <em>probable</em> sans atteindre la <em>certitude</em> démonstrative d’un théorème."
    ],
    "Raison": [
      "Une conjecture peut être <em>probable</em> ; une démonstration valide peut rendre une conclusion <em>certaine</em> ; encore faut-il que ses prémisses soient <em>vraies</em>.",
      "La raison distingue la <em>vérité</em> d’une proposition, la <em>probabilité</em> qui mesure le soutien disponible et la <em>certitude</em> avec laquelle on l’affirme."
    ]
  }
};

  const thematicExampleHtml = (theme, term, fallback) => {
    const examples = thematicExamples[term]?.[theme];
    if (!examples?.length) return fallback;
    return `<span>Exemple</span><ul>${examples.map((example) => `<li>${example}</li>`).join("")}</ul>`;
  };

  const countLabel = (count) => `${count} repère${count > 1 ? "s" : ""}`;

  function renderAlphabetical() {
    const list = document.createElement("div");
    list.className = "blog-repere-list";
    sourceCards.forEach((card) => list.append(card.cloneNode(true)));
    panel.replaceChildren(list);
  }

  function renderCategories() {
    const groups = document.createElement("div");
    groups.className = "blog-repere-groups";

    categories.forEach((category, index) => {
      const cards = sourceCards.filter((card) => card.dataset.category === category.id);
      if (!cards.length) return;

      const section = document.createElement("section");
      section.className = "blog-repere-group";

      const heading = document.createElement("header");
      heading.className = "blog-repere-group-heading";

      const copy = document.createElement("div");
      const eyebrow = document.createElement("span");
      eyebrow.textContent = `Famille ${String(index + 1).padStart(2, "0")}`;
      const title = document.createElement("h3");
      title.textContent = category.label;
      const summary = document.createElement("p");
      summary.textContent = category.description;
      copy.append(eyebrow, title, summary);

      const count = document.createElement("strong");
      count.textContent = countLabel(cards.length);
      heading.append(copy, count);

      const list = document.createElement("div");
      list.className = "blog-repere-list blog-repere-group-list";
      cards.forEach((card) => list.append(card.cloneNode(true)));
      section.append(heading, list);
      groups.append(section);
    });

    panel.replaceChildren(groups);
  }

  function renderThemes() {
    const grid = document.createElement("div");
    grid.className = "blog-repere-theme-grid";

    themes.forEach((theme) => {
      const cards = sourceCards.filter((card) => (card.dataset.themes || "").split("|").includes(theme));
      if (!cards.length) return;

      const section = document.createElement("section");
      section.className = "blog-repere-theme";

      const heading = document.createElement("header");
      const title = document.createElement("h3");
      title.textContent = theme;
      const count = document.createElement("span");
      count.textContent = countLabel(cards.length);
      heading.append(title, count);

      const items = document.createElement("div");
      items.className = "blog-repere-theme-items";

      cards.forEach((card) => {
        const term = card.querySelector("dt");
        const definition = card.querySelector(".blog-repere-definition");
        const example = card.querySelector(".blog-repere-example");
        if (!term || !definition || !example) return;

        const details = document.createElement("details");
        details.className = "blog-repere-theme-item";
        const summary = document.createElement("summary");
        const summaryText = document.createElement("span");
        summaryText.textContent = term.textContent;
        const marker = document.createElement("i");
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = "+";
        summary.append(summaryText, marker);

        const body = document.createElement("div");
        body.className = "blog-repere-theme-body";
        const definitionCopy = document.createElement("p");
        definitionCopy.className = "blog-repere-theme-definition";
        definitionCopy.innerHTML = definition.innerHTML;
        const exampleCopy = document.createElement("div");
        exampleCopy.className = "blog-repere-theme-example";
        exampleCopy.innerHTML = thematicExampleHtml(theme, term.textContent.trim(), example.innerHTML);
        body.append(definitionCopy, exampleCopy);

        details.append(summary, body);
        items.append(details);
      });

      section.append(heading, items);
      grid.append(section);
    });

    panel.replaceChildren(grid);
  }

  const renderers = {
    alphabetical: renderAlphabetical,
    categories: renderCategories,
    themes: renderThemes
  };

  function selectView(view) {
    if (!renderers[view]) return;
    buttons.forEach((button) => {
      const active = button.dataset.repereView === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    description.textContent = viewDescriptions[view];
    renderers[view]();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectView(button.dataset.repereView));
  });

  selectView("alphabetical");
})();

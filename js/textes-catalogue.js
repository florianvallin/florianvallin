(() => {
  "use strict";

  const CURRENT_PROGRAM_THEMES = [
    "Art", "Bonheur", "Conscience", "Devoir", "État", "Inconscient",
    "Justice", "Langage", "Liberté", "Nature", "Raison", "Religion",
    "Science", "Technique", "Temps", "Travail", "Vérité"
  ];

  const COMPLEMENTARY_THEMES = [
    "Amour", "Autrui", "Culture", "Démonstration", "Désir", "Existence et temps", "Histoire",
    "Interprétation", "Justice et droit", "Matière et esprit", "Politique",
    "Raison et réel", "Société", "Travail et technique", "Vivant"
  ];

  const TEXTS = [
    {
      id:"schopenhauer-bonheur-absence-souffrance", section:"philosophie",
      cardMeta:"Pessimisme moderne",
      title:"Le bonheur comme absence de souffrance", author:"Arthur Schopenhauer", authorTag:"Schopenhauer",
      cardHighlight:"absence de souffrance",
      authorMeta:"(1788–1860) · pessimisme moderne",
      themes:["Bonheur", "Désir"], work:"Aphorismes sur la sagesse dans la vie", publication:"1851, trad. J.-A. Cantacuzène",
      description:"Le bonheur se mesure-t-il à l’intensité des plaisirs ou à l’absence de douleurs ?",
      context:"Schopenhauer oppose la recherche des <strong>jouissances</strong> à une sagesse plus sobre : réduire autant que possible la <strong>souffrance</strong>.",
      readingQuestions:[
        "Pourquoi le <strong>plaisir</strong> ne suffit-il pas, selon Schopenhauer, à définir le <strong>bonheur</strong> ?",
        "En quel sens éviter une <strong>douleur</strong> serait-il plus rationnel que rechercher une jouissance ?"
      ],
      relatedTexts:[
        { id:"schopenhauer-bien-etre-negation", kind:"proche", label:"Schopenhauer — Le bien-être ne se ressent qu’après sa perte", relation:"Le même auteur approfondit l’idée que la douleur est positive, tandis que le bien-être demeure presque imperceptible." },
        { id:"epicure-plaisir-vie-heureuse", kind:"proche", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Le plaisir bien compris vise l’absence de trouble, non l’intensité des jouissances." },
        { id:"freud-bonheur-episodique", kind:"proche", label:"Freud — Aucun bien ne rend durablement heureux", relation:"Freud rejoint Schopenhauer en donnant plus de poids à la souffrance qu’aux satisfactions durables." }
      ],
      paragraphs:[
        "L'homme le plus heureux est donc celui qui parcourt sa vie sans douleurs trop grandes, soit au moral, soit au physique, et non pas celui qui a eu pour sa part les joies les plus vives ou les jouissances les plus fortes. Vouloir mesurer sur celles-ci le bonheur d'une existence, c'est recourir à une fausse échelle. Car les plaisirs sont et restent négatifs ; croire qu'ils rendent heureux est une illusion que l'envie entretient et par laquelle elle se punit elle-même. Les douleurs au contraire sont senties positivement, c'est leur absence qui est l'échelle du bonheur de la vie. Si, à un état libre de douleur vient s'ajouter encore l'absence de l'ennui, alors on atteint le bonheur sur terre dans ce qu'il a d'essentiel, car le reste n'est plus que chimère.",
        "Il suit de là qu'il ne faut jamais acheter de plaisirs au prix de douleurs, ni même de leur menace seule, vu que ce serait payer du négatif et du chimérique avec du positif et du réel. En revanche, il y a bénéfice à sacrifier des plaisirs pour éviter des douleurs. Dans l'un et l'autre cas, il est indifférent que les douleurs suivent ou précèdent les plaisirs.",
        "Il n'y a vraiment pas de folie plus grande que de vouloir transformer ce théâtre de misères en un lieu de plaisance, et de poursuivre des jouissances et des joies au lieu de chercher à éviter la plus grande somme possible de douleurs. Que de gens cependant tombent dans cette folie !"
      ]
    },
    {
      id:"schopenhauer-bien-etre-negation", section:"philosophie",
      cardMeta:"Pessimisme moderne",
      title:"Le bien-être ne se ressent qu’après sa perte", author:"Arthur Schopenhauer", authorTag:"Schopenhauer",
      cardHighlight:"après sa perte",
      authorMeta:"(1788–1860) · pessimisme moderne",
      themes:["Bonheur", "Temps"], work:"Le Monde comme volonté et comme représentation", publication:"1819, trad. A. Burdeau",
      description:"Pourquoi ressentons-nous vivement la douleur, tandis que le bien-être demeure presque invisible ?",
      context:"Schopenhauer examine l’asymétrie entre <strong>douleur</strong> et <strong>plaisir</strong>, puis montre comment elle transforme notre expérience du <em>temps</em>.",
      readingQuestions:[
        "Pourquoi le <strong>bien-être</strong> n’est-il perçu qu’au moment où il disparaît ?",
        "Que révèle l’expérience du <em>temps</em> sur la différence entre plaisir et souffrance ?"
      ],
      relatedTexts:[
        { id:"schopenhauer-bonheur-absence-souffrance", kind:"proche", label:"Schopenhauer — Le bonheur comme absence de souffrance", relation:"Le même auteur en tire directement une règle de vie : préférer l’évitement des douleurs à la recherche des jouissances." },
        { id:"epicure-plaisir-vie-heureuse", kind:"proche", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Le plaisir y est aussi défini par l’absence de douleur et de trouble." },
        { id:"pascal-bonheur-avenir", kind:"proche", label:"Pascal — Espérer le bonheur, c’est se condamner à ne jamais l’obtenir", relation:"Les deux textes montrent que notre rapport au temps nous empêche de reconnaître le bonheur présent." }
      ],
      paragraphs:[
        "Nous sentons la douleur, mais non l'absence de douleur ; le souci, mais non l'absence de souci ; la crainte, mais non la sécurité. Nous ressentons le désir, comme nous ressentons la faim et la soif ; mais le désir est-il rempli, aussitôt il en advient de lui comme de ces morceaux goûtés par nous et qui cessent d'exister pour notre sensibilité, dès le moment où nous les avalons.",
        "Nous remarquons douloureusement l'absence des jouissances et des joies, et nous les regrettons aussitôt ; au contraire, la disparition de la douleur, quand même elle ne nous quitte qu'après longtemps, n'est pas immédiatement sentie, mais tout au plus y pense-t-on parce qu'on veut y penser, par le moyen de la réflexion. Seules, en effet, la douleur et la privation peuvent produire une impression positive et par là se dénoncer d'elles-mêmes : le bien-être, au contraire, n'est que pure négation.",
        "Aussi n'apprécions-nous pas les trois plus grands biens de la vie, la santé, la jeunesse et la liberté, tant que nous les possédons ; pour en comprendre la valeur, il faut que nous les ayons perdus, car ils sont aussi négatifs. Que notre vie était heureuse, c'est ce dont nous ne nous apercevons qu'au moment où ces jours heureux ont fait place à des jours malheureux.",
        "Autant les jouissances augmentent, autant diminue l'aptitude à les goûter : le plaisir devenu habitude n'est plus éprouvé comme tel. Mais par là même grandit la faculté de ressentir la souffrance ; car la disparition d'un plaisir habituel cause une impression douloureuse. Ainsi la possession accroît la mesure de nos besoins, et du même coup la capacité de ressentir la douleur.",
        "Le cours des heures est d'autant plus rapide qu'elles sont plus agréables, d'autant plus lent qu'elles sont plus pénibles ; car le chagrin, et non le plaisir, est l'élément positif, dont la présence se fait remarquer. De même, nous avons conscience du temps dans les moments d'ennui, non dans les instants agréables. Ces deux faits prouvent que la partie la plus heureuse de notre existence est celle où nous la sentons le moins ; d'où il suit qu'il vaudrait mieux pour nous ne pas la posséder.",
        "Une grande, une vive joie ne se peut absolument concevoir qu'à la suite d'un grand besoin passé ; car peut-il s'ajouter rien d'autre à un état de contentement durable qu'un peu d'agrément ou quelque satisfaction de vanité ? Aussi tous les poètes sont-ils contraints de placer leurs héros dans des situations douloureuses et pénibles, pour les en pouvoir ensuite tirer ; le drame et l'épopée ne peignent généralement, en conséquence, que des hommes en proie aux luttes, aux souffrances, aux tourments, et chaque roman est un vrai panorama, où l'on contemple les spasmes et les convulsions du cœur humain angoissé."
      ]
    },
    {
      id:"epictete-depend-nous", section:"philosophie",
      cardMeta:"Stoïcisme",
      title:"La liberté commence par ce qui dépend de nous", author:"Épictète", authorTag:"Épictète",
      cardHighlight:"ce qui dépend de nous",
      authorMeta:"(v. 50–v. 135) · stoïcien", themes:["Liberté", "Désir"], work:"Manuel", publication:"IIe s. apr. J.-C.",
      description:"Comment préserver sa liberté intérieure face à ce qui échappe à notre pouvoir ?",
      context:"Épictète sépare ce qui relève de notre <strong>jugement</strong> et de notre <strong>désir</strong> de ce qui dépend des circonstances. La liberté se joue d’abord dans cette distinction.",
      readingQuestions:[
        "Pourquoi le <strong>corps</strong>, la richesse ou la considération d’autrui ne dépendent-ils pas de nous ?",
        "Comment la maîtrise de nos jugements permet-elle d’être plus <strong>libre</strong> ?"
      ],
      relatedTexts:[
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès fait de l’expansion des désirs et de l’absence de frein la vraie liberté." },
        { id:"epicure-plaisir-vie-heureuse", kind:"proche", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Comme le stoïcien, Épicure invite à examiner et hiérarchiser ses désirs." },
        { id:"descartes-changer-desirs", kind:"proche", label:"Descartes — Pour être heureux, il faut changer ses désirs", relation:"Descartes reprend la distinction stoïcienne entre ce qui dépend de nous et ce qui échappe à notre pouvoir." }
      ],
      paragraphs:[
        "Des choses les unes dépendent de nous, les autres ne dépendent pas de nous. Ce qui dépend de nous, ce sont nos jugements, nos tendances, nos désirs, nos aversions, en un mot tout ce qui est opération de notre âme ; ce qui ne dépend pas de nous, c'est le corps, la fortune, les témoignages de considération, les charges publiques, en un mot tout ce qui n'est pas opération de notre âme.",
        "Ce qui dépend de nous est, de sa nature, libre, sans empêchement, sans contrariété ; ce qui ne dépend pas de nous est inconsistant, esclave, sujet à empêchement, étranger.",
        "Souviens-toi donc que si tu regardes comme libre ce qui de sa nature est esclave, et comme étant à toi ce qui est à autrui, tu seras contrarié, tu seras dans le deuil, tu seras troublé, tu t'en prendras et aux dieux et aux hommes ; mais si tu ne regardes comme étant à toi que ce qui est à toi, et si tu regardes comme étant à autrui ce qui, en effet, est à autrui, personne ne te contraindra jamais, personne ne t'empêchera, tu ne t'en prendras à personne, tu n'accuseras personne, tu ne feras absolument rien contre ton gré, personne ne te nuira ; tu n'auras pas d'ennemi, car tu ne souffriras rien de nuisible.",
        "Aspirant à de si grands biens, songe qu'il ne faut pas te porter mollement à les rechercher, qu'il faut renoncer entièrement à certaines choses et en ajourner d'autres quant au présent. Mais si outre ces biens tu veux encore le pouvoir et la richesse, peut-être n'obtiendras-tu même pas ces avantages parce que tu aspires en même temps aux autres biens, et, en tout cas, ce qu'il y a de certain, c'est que tu manqueras les biens qui peuvent seuls nous procurer la liberté et le bonheur.",
        "Ainsi, à toute idée rude, exerce-toi à dire aussitôt : « Tu es une idée, et tu n'es pas tout à fait ce que tu représentes. » Puis examine-la, applique les règles que tu sais, et d'abord et avant toutes les autres celle qui fait reconnaître si quelque chose dépend ou ne dépend pas de nous ; et si l'idée est relative à quelque chose qui ne dépend pas de nous, sois prêt à dire : « Cela ne me regarde pas. »"
      ]
    },
    {
      id:"epicure-plaisir-vie-heureuse", section:"philosophie",
      cardMeta:"Épicurisme",
      title:"Hiérarchiser ses désirs pour vivre heureux", author:"Épicure", authorTag:"Épicure",
      cardHighlight:"Hiérarchiser ses désirs",
      cardIdea:"L’ataraxie épicurienne",
      authorMeta:"(341–270 av. J.-C.) · fondateur de l’épicurisme", themes:["Bonheur", "Désir", "Raison"], work:"Lettre à Ménécée", publication:"IIIe s. av. J.-C., trad. M. Solovine, Hermann, 1987, p. 100–102",
      description:"Comment distinguer les désirs et calculer les plaisirs qui conduisent réellement à la vie heureuse ?",
      context:"Épicure ne recommande pas de satisfaire tous les désirs. Il faut les <strong>classer</strong>, puis comparer les conséquences des plaisirs et des douleurs afin d’atteindre l’<em>ataraxie</em>, la tranquillité de l’âme.",
      readingQuestions:[
        "Quels sont les différents types de <strong>désirs</strong>, et lesquels sont véritablement nécessaires ?",
        "Pourquoi la tranquillité de l’âme et la santé du corps constituent-elles la perfection de la vie heureuse ?",
        "Pourquoi Épicure peut-il dire que le <strong>plaisir</strong> est le commencement et la fin de la vie heureuse ?",
        "À quelles conditions faut-il renoncer à un plaisir ou accepter une <strong>douleur</strong> ?",
        "Pourquoi le choix pratique dépend-il finalement de la distinction entre l’utile et le nuisible ?"
      ],
      glossary:[
        { term:"désirs vains", definition:"Désirs qui ne répondent à aucun besoin naturel et n’ont pas de limite intrinsèque, comme la recherche indéfinie de richesse ou de gloire." },
        { term:"ataraxie", definition:"Absence de trouble et d’agitation de l’âme ; elle constitue, avec l’absence de douleur corporelle, l’état stable recherché par Épicure." },
        { term:"bien principal", definition:"Bien premier à partir duquel les autres choix sont évalués. Pour Épicure, il s’agit du plaisir correctement compris." }
      ],
      readingNotes:[
        { type:"concept", term:"Épicurisme", badge:"école matérialiste", definition:"Le plaisir sobre et stable est le principe de la vie heureuse. Il ne s’agit pas d’accumuler les jouissances, mais de choisir rationnellement ses désirs." },
        { type:"opposition", left:{ term:"<em>ataraxia</em>", definition:"Absence de trouble de l’âme." }, right:{ term:"<em>aponia</em>", definition:"Absence de douleur du corps." }, conclusion:"Ensemble, elles définissent le plaisir stable recherché par Épicure." },
        { type:"analysis", term:"La hiérarchie des désirs", definition:"Épicure distingue trois catégories.", items:["Les désirs <strong>naturels et nécessaires</strong> — <em>physikaì kaì anankaîai</em> (φυσικαὶ καὶ ἀναγκαῖαι) — répondent aux exigences de la vie, de la tranquillité du corps ou du bonheur.", "Les désirs <strong>seulement naturels</strong> — <em>physikaì mónon</em> (φυσικαὶ μόνον) — procurent un agrément dont on peut se passer.", "Les désirs <strong>vains</strong> — <em>kenaí</em> (κεναί) — sont produits par l’opinion, sans limite naturelle, et entretiennent l’inquiétude."] },
        { type:"opposition", left:{ term:"En théorie", definition:"Tout plaisir est un bien et toute douleur est un mal par leur nature propre." }, right:{ term:"En pratique", definition:"Un plaisir peut produire davantage de souffrance et une douleur peut conduire à un plaisir supérieur." }, conclusion:"Le plaisir n’est pas une consigne aveugle : chaque choix exige un calcul de ses conséquences." },
        { type:"concept", term:"Calcul des plaisirs — <em>nḗphōn logismós</em> (νήφων λογισμός)", definition:"Ce « raisonnement sobre » compare les avantages et les dommages à venir. Il peut conduire à refuser un plaisir nuisible ou à accepter une peine momentanée en vue d’un bien plus grand." },
        { type:"analysis", term:"Le mouvement du texte", definition:"L’argumentation progresse de la classification des désirs vers une règle de décision concrète.", items:["Distinguer les désirs naturels, nécessaires et vains.", "Définir le bonheur par la tranquillité de l’âme et du corps.", "Faire du plaisir le principe de l’évaluation.", "Comparer enfin l’utile et le nuisible dans chaque situation."] }
      ],
      relatedTexts:[
        { id:"schopenhauer-bonheur-absence-souffrance", kind:"proche", label:"Schopenhauer — Le bonheur comme absence de souffrance", relation:"Tous deux refusent d’identifier le bonheur à l’accumulation des jouissances." },
        { id:"platon-socrate-temperance", kind:"proche", label:"Platon, Socrate — Le bonheur de la tempérance", relation:"Une vie heureuse suppose de ne pas être esclave de désirs sans fin." },
        { id:"rousseau-desir-imagination-bonheur", kind:"adverse", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Épicure cherche à apaiser le manque en limitant les désirs ; Rousseau soutient au contraire que le plaisir de désirer est indispensable à une existence heureuse." },
        { id:"seneque-vie-vertueuse", kind:"adverse", label:"Sénèque — La vie heureuse est la vie vertueuse", relation:"Sénèque refuse de faire du plaisir le souverain bien et lui oppose la vertu, stable et autosuffisante." }
      ],
      paragraphs:[
        "Il faut se rendre compte que parmi nos désirs les uns sont naturels, les autres vains, et que parmi les premiers il y en a qui sont nécessaires et d’autres qui sont seulement naturels. Parmi les nécessaires, il y en a qui le sont pour le bonheur, d’autres pour la tranquillité continue du corps, d’autres enfin pour la vie même.",
        "Une théorie non erronée de ces désirs sait en effet rapporter toute préférence et toute aversion à la santé du corps et à la tranquillité de l’âme puisque c’est là la perfection même de la vie heureuse. Car tous nos actes visent à écarter de nous la souffrance et la peur. Lorsqu’une fois nous y sommes parvenus, la tempête de l’âme s’apaise, l’être vivant n’ayant plus besoin de s’acheminer vers quelque chose qui lui manque, ni de chercher autre chose pour parfaire le bien-être de l’âme et celui du corps.",
        "C’est alors en effet que nous éprouvons le besoin du plaisir quand, par suite de son absence, nous éprouvons de la douleur ; mais quand nous ne souffrons pas, nous n’éprouvons plus le besoin du plaisir.",
        "Et c’est pourquoi nous disons que le plaisir est le commencement et la fin de la vie heureuse. C’est lui en effet que nous avons reconnu comme bien principal et conforme à notre nature, c’est de lui que nous partons pour déterminer ce qu’il faut choisir et ce qu’il faut éviter, et c’est à lui que nous avons finalement recours lorsque nous nous servons de la sensation comme d’une règle pour apprécier tout bien qui s’offre.",
        "Or, précisément parce que le plaisir est notre bien principal et inné, nous ne cherchons pas tout plaisir ; il y a des cas où nous passons par-dessus beaucoup de plaisirs s’il en résulte pour nous de l’ennui. Et nous jugeons beaucoup de douleurs préférables aux plaisirs lorsque, des souffrances que nous avons endurées pendant longtemps, il résulte pour nous un plaisir plus élevé. Tout plaisir est ainsi, de par sa nature propre, un bien, mais tout plaisir ne doit pas être recherché ; pareillement, toute douleur est un mal, mais toute douleur ne doit pas être évitée à tout prix.",
        "En tout cas, il convient de décider de tout cela en comparant et en examinant attentivement ce qui est utile et ce qui est nuisible, car nous en usons parfois avec le bien comme s’il était le mal, et avec le mal comme s’il était le bien."
      ]
    },
    {
      id:"rousseau-desir-imagination-bonheur", section:"philosophie",
      cardMeta:"Philosophie des Lumières",
      title:"Le bonheur se nourrit de ce que nous espérons", author:"Jean-Jacques Rousseau", authorTag:"Rousseau",
      cardHighlight:"se nourrit de ce que nous espérons",
      authorMeta:"(1712–1778) · philosophe des Lumières", themes:["Désir", "Bonheur", "Imagination"], work:"La Nouvelle Héloïse", publication:"1761, lettre VIII, Gallimard, 1993, p. 333",
      description:"Pourquoi l’attente et l’imagination procurent-elles davantage de bonheur que la possession de l’objet désiré ?",
      context:"Rousseau renverse l’idée selon laquelle le bonheur commencerait avec la satisfaction du <strong>désir</strong>. L’<strong>imagination</strong> embellit l’objet absent ; sa possession dissipe ce prestige, si bien que l’espérance peut être plus heureuse que la jouissance.",
      readingQuestions:[
        "Pourquoi l’espérance de l’objet procure-t-elle davantage de plaisir que sa possession ?",
        "Comment l’imagination transforme-t-elle l’objet réel en un objet idéal ?",
        "Pourquoi « le pays des chimères » est-il le seul digne d’être habité ?",
        "En quel sens une vie sans peine ni désir cesserait-elle d’être véritablement humaine ?"
      ],
      glossary:[
        { term:"avide", definition:"Animé par un désir intense et toujours renaissant." },
        { term:"borné", definition:"Limité dans ses facultés et dans ce qu’il peut réellement obtenir." },
        { term:"pays des chimères", definition:"Monde des objets idéalisés par l’imagination, plus séduisants que les choses telles qu’elles existent réellement." },
        { term:"Être existant par lui-même", definition:"Périphrase désignant Dieu, seul être supposé se suffire pleinement à lui-même et ne manquer de rien." }
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"Objet espéré", definition:"Absent, il peut être rapproché, transformé et embelli librement par l’imagination." }, right:{ term:"Objet possédé", definition:"Sa présence réelle met fin au prestige, à l’illusion et au travail idéalisant de l’imagination." }, conclusion:"Le plaisir dépend moins de la chose elle-même que de la représentation que le désir en construit." },
        { type:"concept", term:"Jouissance", definition:"Plaisir lié à la possession effective d’un bien. Sa durée est limitée, car la présence de l’objet fait disparaître l’attente qui l’embellissait." },
        { type:"concept", term:"Ré-jouissance", definition:"Plaisir pris à espérer et à imaginer une satisfaction future. Elle peut surpasser la jouissance parce qu’elle demeure ouverte aux transformations de l’imagination." },
        { type:"analysis", term:"Le paradoxe du bonheur", definition:"On croit désirer pour posséder, mais la possession détruit une part du plaisir que le désir produisait. L’être humain est donc heureux « avant d’être heureux », lorsque le possible reste encore ouvert." },
        { type:"analysis", term:"Le désir comme condition de la vie humaine", definition:"L’homme est limité et ne peut tout posséder. Cette imperfection n’est pourtant pas seulement un mal : elle entretient l’élan du désir. Une existence sans manque, sans peine et sans attente serait immobile, donc semblable à la mort." },
        { type:"plain", definition:"Rousseau ne soutient pas que toute frustration rend heureuse. Il affirme que le mouvement du désir, lorsqu’il est soutenu par l’imagination, appartient positivement au bonheur humain." }
      ],
      relatedTexts:[
        { id:"platon-mythe-androgyne-desir", kind:"proche", label:"Platon, Aristophane — Le désir amoureux poursuit l’unité perdue", relation:"Dans les deux textes, le désir naît d’une absence et porte l’être humain vers ce qui pourrait lui rendre une forme de plénitude." },
        { id:"kant-desir-raison-imagination", kind:"proche", label:"Kant — Le désir naît de la raison et de l’imagination", relation:"Kant et Rousseau montrent que l’imagination intensifie l’inclination lorsque l’objet est soustrait aux sens." },
        { id:"schopenhauer-bien-etre-negation", kind:"proche", label:"Schopenhauer — Le bien-être ne se ressent qu’après sa perte", relation:"Tous deux constatent que la possession et la satisfaction perdent rapidement leur intensité sensible, mais Rousseau valorise davantage le plaisir de l’attente." },
        { id:"epicure-plaisir-vie-heureuse", kind:"adverse", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Épicure recherche l’apaisement du manque ; Rousseau fait du désir lui-même une composante indispensable du bonheur humain." }
      ],
      paragraphs:[
        "Malheur à qui n’a plus rien à désirer ! Il perd pour ainsi dire tout ce qu’il possède. On jouit moins de ce qu’on obtient que de ce qu’on espère, et l’on n’est heureux qu’avant d’être heureux. En effet, l’homme avide et borné, fait pour tout vouloir et peu obtenir, a reçu du ciel une force consolante qui rapproche de lui tout ce qu’il désire, qui le soumet à son imagination, qui le lui rend présent et sensible, qui le lui livre en quelque sorte, et pour lui rendre cette imaginaire propriété plus douce, le modifie au gré de sa passion. Mais tout ce prestige disparaît devant l’objet même ; rien n’embellit plus cet objet aux yeux du possesseur ; on ne se figure point ce qu’on voit ; l’imagination ne pare plus rien de ce qu’on possède, l’illusion cesse où commence la jouissance. Le pays des chimères est en ce monde le seul digne d’être habité et tel est le néant des choses humaines, qu’hors l’Être existant par lui-même, il n’y a rien de beau que ce qui n’est pas.",
        "Si cet effet n’a pas toujours lieu sur les objets particuliers de nos passions, il est infaillible dans le sentiment commun qui les comprend toutes. Vivre sans peine n’est pas un état d’homme ; vivre ainsi c’est être mort. Celui qui pourrait tout sans être Dieu, serait une misérable créature ; il serait privé du plaisir de désirer ; toute autre privation serait plus supportable."
      ]
    },
    {
      id:"schopenhauer-desir-souffrance-ennui", section:"philosophie",
      cardMeta:"Pessimisme moderne",
      title:"Le désir condamne la vie à osciller entre souffrance et ennui", author:"Arthur Schopenhauer", authorTag:"Schopenhauer",
      cardHighlight:"osciller entre souffrance et ennui",
      cardIdea:"le pendule du désir",
      authorMeta:"(1788–1860) · pessimisme moderne", themes:["Désir", "Bonheur"], work:"Le Monde comme volonté et comme représentation", publication:"1819, § 57, trad. A. Burdeau, PUF, 2003, p. 394–395",
      description:"Pourquoi la satisfaction de nos désirs ne met-elle pas fin à la souffrance ?",
      context:"Schopenhauer décrit une existence prise dans un mouvement sans repos : le <strong>manque</strong> fait souffrir, mais la satisfaction ne délivre que provisoirement du désir avant de conduire à la satiété ou à l’<strong>ennui</strong>.",
      readingQuestions:[
        "Pourquoi le désir est-il inséparable du <strong>manque</strong> et de la souffrance ?",
        "Comment la satisfaction transforme-t-elle la souffrance du désir en <strong>ennui</strong> ?",
        "Que montre l’image du <strong>pendule</strong> sur la possibilité d’un bonheur durable ?"
      ],
      glossary:[
        { term:"prompte", definition:"Rapide, presque immédiate." },
        { term:"vouloir", definition:"Manifestation particulière de la Volonté : élan par lequel un être tend vers ce qui lui manque." },
        { term:"satiété", definition:"État de celui qui, ayant obtenu ce qu’il désirait, n’éprouve plus d’attrait pour cet objet." }
      ],
      readingNotes:[
        { type:"plain", definition:"Pour Schopenhauer, la souffrance n’est pas un accident que l’on pourrait éliminer définitivement : elle découle de la structure même du vouloir, toujours tendu vers ce qui lui manque." },
        { type:"analysis", term:"Le cycle du désir", definition:"Le désir ne progresse pas vers une satisfaction définitive.", items:["Le <strong>besoin</strong> manifeste un manque et produit la douleur.", "La <strong>satisfaction</strong> supprime provisoirement ce manque, mais fait perdre à l’objet son attrait.", "Le sujet tombe dans l’<strong>ennui</strong> ou voit naître un nouveau désir, et le cycle recommence."] },
        { type:"opposition", left:{ term:"Souffrance", definition:"Présence douloureuse d’un besoin qui n’est pas satisfait." }, right:{ term:"Ennui", definition:"Vide éprouvé lorsque plus aucun objet ne mobilise momentanément le vouloir." }, conclusion:"Ces états paraissent opposés, mais ils sont les deux issues d’un même vouloir incapable de trouver un repos durable." },
        { type:"analysis", term:"La métaphore du pendule", definition:"Comme un pendule revient continuellement d’un côté à l’autre, l’existence passe du manque à l’ennui sans atteindre un bonheur stable. L’image insiste à la fois sur la répétition et sur l’absence de véritable progrès." },
        { type:"plain", definition:"Schopenhauer ne dit pas seulement que certains désirs nous font souffrir. Sa thèse est plus radicale : tout désir, parce qu’il naît d’un manque, contient déjà une douleur, tandis que sa satisfaction demeure fragile et provisoire." }
      ],
      relatedTexts:[
        { id:"schopenhauer-bien-etre-negation", kind:"proche", label:"Schopenhauer — Le bien-être ne se ressent qu’après sa perte", relation:"Le même auteur explique pourquoi la douleur se signale positivement à la conscience, tandis que sa disparition devient presque imperceptible." },
        { id:"rousseau-desir-imagination-bonheur", kind:"adverse", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Rousseau reconnaît que la possession déçoit, mais il attribue au mouvement même du désir une valeur heureuse que Schopenhauer lui refuse." },
        { id:"spinoza-desir-puissance-exister", kind:"adverse", label:"Spinoza — Le désir exprime notre puissance d’exister", relation:"Chez Spinoza, le désir est l’affirmation positive par laquelle un être persévère ; chez Schopenhauer, il révèle d’abord un manque douloureux." },
        { id:"epicure-plaisir-vie-heureuse", kind:"proche", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Épicure partage le diagnostic des désirs sans limite, mais pense qu’un choix rationnel permet d’atteindre un plaisir stable." }
      ],
      paragraphs:[
        "Tout vouloir a pour principe un besoin, un manque, donc une douleur ; c’est par nature, nécessairement, qu’ils doivent devenir la proie de la douleur. Mais que la volonté vienne à manquer d’objet, qu’une prompte satisfaction vienne à lui enlever tout motif de désirer, et les voilà tombés dans un vide épouvantable, dans l’ennui ; leur nature, leur existence leur pèse d’un poids intolérable. La vie donc oscille, comme un pendule, de droite à gauche, de la souffrance à l’ennui ; ce sont là les deux éléments dont elle est faite, en somme. De là ce fait bien significatif par son étrangeté même : les hommes ayant placé toutes les douleurs, toutes les souffrances dans l’enfer, pour remplir le ciel n’ont plus trouvé que l’ennui. […]",
        "Entre les désirs et leurs réalisations s’écoule toute la vie humaine. Le désir, de sa nature, est souffrance ; la satisfaction engendre bien vite la satiété ; le but était illusoire ; la possession lui enlève son attrait ; le désir renaît sous une forme nouvelle, et avec lui le besoin ; sinon, c’est le dégoût, le vide, l’ennui, ennemis plus rudes encore que le besoin."
      ]
    },
    {
      id:"spinoza-desir-puissance-exister", section:"philosophie",
      cardMeta:"Rationalisme moderne",
      title:"Le désir exprime notre puissance d’exister", author:"Baruch Spinoza", authorTag:"Spinoza",
      cardHighlight:"notre puissance d’exister",
      cardIdea:"le conatus",
      authorMeta:"(1632–1677) · rationalisme moderne", themes:["Désir", "Nature", "Conscience"], work:"Éthique", publication:"livre III, propositions VI–VII et scolie de la proposition IX, trad. Ch. Appuhn, GF, 1965, p. 142–143 et 144–145",
      description:"Désirons-nous une chose parce qu’elle est bonne, ou la jugeons-nous bonne parce que nous la désirons ?",
      context:"Spinoza rapporte le désir au <strong>conatus</strong>, l’effort par lequel chaque être persévère dans son existence. Le désir n’est donc pas d’abord un manque : il est l’expression consciente de notre <strong>puissance d’agir</strong>.",
      readingQuestions:[
        "Comment le <strong>conatus</strong> permet-il de définir l’essence de chaque être ?",
        "Quelle différence Spinoza établit-il entre la volonté, l’<strong>appétit</strong> et le désir ?",
        "Pourquoi jugeons-nous une chose bonne parce que nous la désirons, et non l’inverse ?"
      ],
      glossary:[
        { term:"conatus", definition:"Mot latin signifiant « effort » : tendance par laquelle chaque chose s’efforce de persévérer dans son être." },
        { term:"appétit", definition:"Effort de conservation rapporté à la fois à l’âme et au corps ; il constitue l’essence même de l’être humain." },
        { term:"appéter", definition:"Tendre vers une chose sous l’effet de l’appétit ; la rechercher comme favorable à sa conservation." }
      ],
      readingNotes:[
        { type:"concept", term:"Conatus", badge:"effort de persévérance", definition:"Toute chose tend, autant qu’elle le peut, à maintenir et à déployer son existence. Cet effort n’est pas une propriété secondaire : il constitue son essence actuelle." },
        { type:"analysis", term:"Trois noms d’un même effort", definition:"La dénomination change selon la manière dont l’effort est considéré.", items:["Rapporté à l’<strong>âme seule</strong>, il est appelé <strong>volonté</strong>.", "Rapporté ensemble à l’<strong>âme et au corps</strong>, il est appelé <strong>appétit</strong>.", "Lorsque l’être humain a <strong>conscience</strong> de cet appétit, celui-ci est appelé <strong>désir</strong>."] },
        { type:"opposition", left:{ term:"Désir comme manque", definition:"Le sujet désirerait parce qu’un bien reconnu comme tel lui fait défaut." }, right:{ term:"Désir comme puissance", definition:"Le sujet tend activement à persévérer et détermine ainsi ce qui lui apparaît comme bon." }, conclusion:"Spinoza inverse l’explication ordinaire : la valeur de l’objet procède de notre tendance vers lui." },
        { type:"concept", term:"Le bon", definition:"Ce n’est pas une qualité absolue de l’objet qui commanderait mécaniquement le désir. Nous appelons « bonne » la chose vers laquelle notre puissance nous porte et qui semble favoriser notre conservation." },
        { type:"plain", definition:"La conscience ne crée pas le désir : elle nous rend seulement conscients d’un appétit déjà à l’œuvre dans l’unité de l’âme et du corps." }
      ],
      relatedTexts:[
        { id:"schopenhauer-desir-souffrance-ennui", kind:"adverse", label:"Schopenhauer — Le désir condamne la vie à osciller entre souffrance et ennui", relation:"Schopenhauer interprète le désir à partir du manque et de la douleur ; Spinoza y voit l’affirmation de la puissance propre à chaque être." },
        { id:"platon-mythe-androgyne-desir", kind:"adverse", label:"Platon, Aristophane — Le désir amoureux poursuit l’unité perdue", relation:"Le mythe platonicien rapporte le désir à une totalité perdue, tandis que Spinoza le fonde sur l’effort positif de persévérer." },
        { id:"rousseau-desir-imagination-bonheur", kind:"proche", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Les deux textes accordent au désir une valeur positive, mais Rousseau insiste sur l’imagination quand Spinoza l’enracine dans la puissance d’exister." },
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès confond puissance et satisfaction illimitée ; Spinoza définit la puissance par la persévérance de l’être, non par l’accumulation des plaisirs." }
      ],
      paragraphs:[
        "Chaque chose, autant qu’il est en elle, s’efforce de persévérer dans son être. […]",
        "Cet effort, quand il se rapporte à l’Âme seule, est appelé Volonté ; mais, quand il se rapporte à la fois à l’Âme et au Corps, est appelé Appétit ; l’appétit n’est par là rien d’autre que l’essence même de l’homme, de la nature de laquelle suit nécessairement ce qui sert à sa conservation ; et l’homme est ainsi déterminé à le faire. De plus, il n’y a nulle différence entre l’Appétit et le Désir, sinon que le Désir se rapporte généralement aux hommes, en tant qu’ils ont conscience de leurs appétits, et peut, pour cette raison, se définir ainsi : le Désir est l’Appétit avec conscience de lui-même. Il est donc établi par tout cela que nous ne nous efforçons à rien, ne voulons, n’appétons ni ne désirons aucune chose, parce que nous la jugeons bonne ; mais, au contraire, nous jugeons qu’une chose est bonne parce que nous nous efforçons vers elle, la voulons, appétons et désirons."
      ]
    },
    {
      id:"levinas-caresse-desir-invisible", section:"philosophie",
      cardMeta:"Phénoménologie contemporaine",
      title:"La caresse désire au-delà de ce qu’elle touche", author:"Emmanuel Lévinas", authorTag:"Lévinas",
      cardHighlight:"au-delà de ce qu’elle touche",
      cardIdea:"la marche à l’invisible",
      authorMeta:"(1906–1995) · phénoménologie contemporaine", themes:["Désir", "Amour", "Autrui"], work:"Totalité et Infini", publication:"1974, Nijhoff, p. 235",
      description:"Pourquoi la caresse ne cherche-t-elle pas à saisir un objet, mais ce qui échappe encore au sensible ?",
      context:"Lévinas distingue la <strong>caresse</strong> d’un simple contact. Elle touche un être sensible, mais ne cherche ni à le connaître complètement ni à le posséder : elle se porte vers l’<strong>invisible</strong>, vers une altérité qui demeure toujours à venir.",
      readingQuestions:[
        "Pourquoi la caresse peut-elle être sensible tout en <strong>transcendant</strong> le sensible ?",
        "En quoi l’<strong>intentionnalité de recherche</strong> se distingue-t-elle d’une volonté de dévoiler et de saisir ?",
        "Comment la caresse exprime-t-elle un <strong>désir</strong> que la satisfaction ne peut épuiser ?"
      ],
      glossary:[
        { term:"transcende", definition:"Dépasse : la caresse part du sensible, mais se dirige vers ce qui ne peut être réduit à une sensation ou à un objet saisi." },
        { term:"intentionnalité", definition:"Fait, pour la conscience, de se rapporter à quelque chose et de le viser." },
        { term:"étant", definition:"Une réalité déterminée qui existe et peut être identifiée comme telle." }
      ],
      readingNotes:[
        { type:"concept", term:"Phénoménologie", badge:"courant philosophique", definition:"Elle décrit la manière dont les choses et autrui apparaissent à la conscience. Lévinas transforme cette démarche en montrant que la rencontre d’autrui excède ce que la conscience peut constituer ou connaître entièrement." },
        { type:"opposition", left:{ term:"Le contact", definition:"Il rencontre une surface sensible présente et peut fournir une sensation déterminée." }, right:{ term:"La caresse", definition:"Elle touche, mais sollicite ce qui se dérobe à toute prise et demeure encore à venir." }, conclusion:"La caresse ne quitte pas le sensible ; elle découvre en lui une altérité qui ne se laisse pas enfermer dans la sensation." },
        { type:"opposition", left:{ term:"Dévoilement", definition:"Visée qui rend un phénomène présent, identifiable et disponible à la connaissance." }, right:{ term:"Recherche", definition:"Mouvement qui reste ouvert à ce qui échappe et ne prétend pas posséder son terme." }, conclusion:"La « marche à l’invisible » n’est pas une connaissance inachevée : elle constitue une autre manière d’entrer en relation avec autrui." },
        { type:"analysis", term:"Une faim qui se nourrit d’elle-même", definition:"Le paradoxe de la faim indique un désir qui s’accroît au lieu de disparaître. La caresse ne consomme pas son objet : la proximité d’autrui approfondit encore la recherche de ce qui ne peut être saisi." },
        { type:"concept", term:"L’invisible", definition:"Ce n’est pas un objet caché que l’on pourrait finir par découvrir. Il désigne la dimension d’autrui qui excède ses contours visibles et résiste à toute réduction à une chose connue." },
        { type:"plain", definition:"Pour Lévinas, la caresse exprime ainsi l’amour sans pouvoir l’enfermer dans un geste ou dans des mots définitifs : elle vise l’autre comme avenir, non comme possession présente." }
      ],
      relatedTexts:[
        { id:"stendhal-cristallisation-amour", kind:"proche", label:"Stendhal — La cristallisation pare l’être aimé de nouvelles perfections", relation:"Les deux textes décrivent un désir qui dépasse ce qui est immédiatement donné : Lévinas l’oriente vers l’altérité insaisissable, Stendhal vers les perfections produites par l’imagination." },
        { id:"platon-mythe-androgyne-desir", kind:"proche", label:"Platon, Aristophane — Le désir amoureux poursuit l’unité perdue", relation:"Platon et Lévinas pensent tous deux un amour qui dépasse la possession, mais le premier vise une unité retrouvée quand le second maintient l’irréductible altérité d’autrui." },
        { id:"aristote-amour-amitie-veritable", kind:"proche", label:"Aristote — L’amitié véritable consiste à aimer l’autre pour lui-même", relation:"Comme Aristote, Lévinas refuse de réduire l’autre à son utilité ou au plaisir qu’il procure ; il insiste toutefois davantage sur ce qui, en lui, échappe à notre compréhension." },
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès conçoit le désir comme un appétit à combler ; chez Lévinas, le désir véritable s’approfondit dans la relation et ne s’achève pas par une satisfaction." }
      ],
      paragraphs:[
        "La caresse comme le contact est sensibilité. Mais la caresse transcende le sensible. Non pas qu’elle sente au-delà du senti, plus loin que les sens, qu’elle se saisisse d’une nourriture sublime, tout en conservant, dans sa relation avec ce senti ultime, une intention de faim qui va sur la nourriture qui se promet et se donne à cette faim, la creuse, comme si la caresse se nourrissait de sa propre faim.",
        "La caresse consiste à ne se saisir de rien, à solliciter ce qui s’échappe sans cesse de sa forme vers un avenir — jamais assez avenir — à solliciter ce qui se dérobe comme s’il <em>n’était pas encore</em>. Elle <em>cherche</em>, elle fouille. Ce n’est pas une intentionnalité de dévoilement, mais de recherche : marche à l’invisible.",
        "Dans un certain sens elle <em>exprime</em> l’amour, mais souffre d’une incapacité de le dire. Elle a faim de cette expression même, dans un incessant accroissement de faim. Elle va donc plus loin qu’à son terme, elle vise au-delà d’un étant, même futur qui, comme <em>étant</em> précisément, frappe déjà à la porte de l’être."
      ]
    },
    {
      id:"stendhal-cristallisation-amour", section:"autres",
      cardMeta:"Littérature",
      title:"La cristallisation pare l’être aimé de nouvelles perfections", author:"Stendhal", authorTag:"Stendhal",
      cardHighlight:"pare l’être aimé",
      cardIdea:"la cristallisation amoureuse",
      authorMeta:"(1783–1842) · littérature", themes:["Amour", "Désir", "Imagination"], work:"De l’amour", publication:"1819, Gallimard, 2007, p. 31",
      description:"Comment l’imagination amoureuse transforme-t-elle une personne réelle en un être couvert de perfections ?",
      context:"Stendhal nomme <strong>cristallisation</strong> le travail par lequel l’esprit amoureux embellit continuellement l’être désiré. L’image du rameau couvert de sel montre comment l’<strong>imagination</strong> métamorphose son objet jusqu’à le rendre presque méconnaissable.",
      readingQuestions:[
        "Comment l’image du rameau couvert de cristaux explique-t-elle la transformation de l’<strong>être aimé</strong> ?",
        "Pourquoi la cristallisation est-elle une opération active de l’<strong>esprit</strong> plutôt qu’une simple perception ?",
        "L’idéalisation révèle-t-elle les qualités de l’être aimé ou risque-t-elle de masquer sa réalité ?"
      ],
      glossary:[
        { term:"cristallisation", definition:"Opération par laquelle l’imagination amoureuse attribue sans cesse de nouvelles perfections à l’être aimé." },
        { term:"rameau", definition:"Petite branche d’arbre ; elle représente, dans la comparaison, la personne réelle avant son idéalisation." },
        { term:"mines de sel de Salzbourg", definition:"Anciennes mines autrichiennes dont Stendhal tire l’image d’un rameau recouvert de cristaux après avoir été plongé dans un milieu salin." }
      ],
      readingNotes:[
        { type:"concept", term:"Littérature", badge:"essai sur l’amour", definition:"Stendhal associe ici l’observation psychologique à une image concrète et mémorable. La métaphore ne décore pas seulement l’idée : elle donne à voir le mécanisme même de l’idéalisation amoureuse." },
        { type:"analysis", term:"La métaphore du rameau", definition:"Les éléments de la mine correspondent aux étapes de l’expérience amoureuse.", items:["Le <strong>rameau primitif</strong> représente l’être aimé tel qu’il est d’abord rencontré.", "Le séjour dans la mine figure le <strong>travail intérieur</strong> et prolongé de l’imagination.", "Les <strong>cristaux</strong> représentent les qualités nouvelles dont l’esprit pare progressivement l’être aimé."] },
        { type:"opposition", left:{ term:"L’être réel", definition:"Personne singulière, avec des qualités et des limites qui lui appartiennent effectivement." }, right:{ term:"L’être cristallisé", definition:"Figure embellie par les attentes, les espoirs et les interprétations de l’amant." }, conclusion:"Le désir ne se contente pas d’enregistrer la réalité : il produit une représentation idéale qui se superpose à elle." },
        { type:"concept", term:"Idéalisation", definition:"Transformation mentale par laquelle certaines qualités sont amplifiées et chaque détail devient la preuve d’une perfection nouvelle." },
        { type:"analysis", term:"Une métamorphose ambivalente", definition:"La cristallisation intensifie l’amour en rendant l’être aimé éblouissant. Mais le rameau devenu méconnaissable suggère aussi un risque : aimer l’image créée par son esprit davantage que la personne elle-même." }
      ],
      relatedTexts:[
        { id:"levinas-caresse-desir-invisible", kind:"proche", label:"Lévinas — La caresse désire au-delà de ce qu’elle touche", relation:"Les deux textes montrent que l’amour dépasse l’apparence immédiatement sensible, mais Lévinas préserve l’altérité d’autrui là où Stendhal analyse sa transformation par l’imagination." },
        { id:"rousseau-desir-imagination-bonheur", kind:"proche", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Chez Rousseau comme chez Stendhal, l’imagination embellit l’objet absent et peut rendre l’attente plus heureuse que la possession." },
        { id:"kant-desir-raison-imagination", kind:"proche", label:"Kant — Le désir naît de la raison et de l’imagination", relation:"Kant explique philosophiquement comment l’imagination amplifie une inclination ; la cristallisation stendhalienne en offre une image littéraire." },
        { id:"aristote-amour-amitie-veritable", kind:"adverse", label:"Aristote — L’amitié véritable consiste à aimer l’autre pour lui-même", relation:"L’idéalisation risque de substituer une image à la personne réelle, tandis qu’Aristote fait de la reconnaissance lucide du caractère de l’autre le fondement de l’amitié véritable." }
      ],
      paragraphs:[
        "Laissez travailler la tête d’un amant pendant vingt-quatre heures, et voici ce que vous trouverez :",
        "Aux mines de sel de Salzbourg, on jette, dans les profondeurs abandonnées de la mine, un rameau d’arbre effeuillé par l’hiver ; deux ou trois mois après on le retire couvert de cristallisations brillantes : les plus petites branches, celles qui ne sont pas plus grosses que la patte d’une mésange, sont garnies d’une infinité de diamants, mobiles et éblouissants ; on ne peut plus reconnaître le rameau primitif.",
        "Ce que j’appelle cristallisation, c’est l’opération de l’esprit, qui tire de tout ce qui se présente la découverte que l’objet aimé a de nouvelles perfections."
      ]
    },
    {
      id:"platon-mythe-androgyne-desir", section:"philosophie",
      cardMeta:"Antiquité grecque",
      title:"Le désir amoureux poursuit l’unité perdue", author:"Platon", authorTag:"Platon",
      cardHighlight:"poursuit l’unité perdue",
      familiarIdea:"le mythe des êtres sphériques",
      authorMeta:"(v. 428–v. 348 av. J.-C.)", themes:["Désir", "Amour", "Nature"], work:"Le Banquet", publication:"IVe s. av. J.-C., 189d–193d, trad. E. Chambry, GF, 1993, p. 49–52",
      description:"Pourquoi le désir amoureux prend-il la forme d’un manque et d’une recherche de l’unité perdue ?",
      context:"Dans <cite>Le Banquet</cite>, plusieurs convives font l’éloge d’Éros. Aristophane, poète comique mis en scène par Platon, raconte ici le <strong>mythe des êtres sphériques</strong> : séparé par Zeus, chaque être humain chercherait depuis lors sa moitié perdue.",
      readingQuestions:[
        "Pourquoi Aristophane fait-il du <strong>désir</strong> la conséquence d’une séparation originelle ?",
        "En quel sens l’être aimé apparaît-il moins comme un objet à posséder que comme une partie de soi à retrouver ?",
        "Pourquoi l’union des corps ne suffit-elle pas à reconstituer définitivement la totalité perdue ?",
        "Que permet au mythe d’expliquer la diversité des orientations amoureuses ?"
      ],
      glossary:[
        { term:"androgyne", definition:"Être originel qui réunit, dans le récit d’Aristophane, les caractères du mâle et de la femelle." },
        { term:"tessère d’hospitalité", definition:"Morceau de poterie brisé en deux et partagé entre deux hôtes ; le rapprochement des fragments permettait de reconnaître leur alliance." },
        { term:"soles", definition:"Poissons plats dont les deux yeux se trouvent du même côté de la tête ; l’image souligne la division et l’aplatissement des êtres primitifs." }
      ],
      readingNotes:[
        { type:"concept", term:"Désir comme manque", definition:"Le désir naît d’une privation : parce que l’être humain a été séparé de son unité première, il éprouve l’absence d’une part de lui-même et cherche à la retrouver." },
        { type:"opposition", left:{ term:"Posséder un objet", definition:"S’approprier une chose extérieure susceptible de procurer une satisfaction." }, right:{ term:"Retrouver sa moitié", definition:"Reconquérir, à travers l’autre, une unité qui semble appartenir à notre propre être." }, conclusion:"Le mythe décrit le désir amoureux comme une quête de soi et de totalité, non comme la simple consommation d’un objet." },
        { type:"concept", term:"Amour", definition:"Il est « le désir et la poursuite du tout » : un mouvement par lequel deux êtres voudraient abolir leur séparation et recomposer l’ancienne nature humaine." },
        { type:"analysis", term:"Une réparation impossible", definition:"Les deux moitiés peuvent s’enlacer, mais la coupure demeure. Comme une tessère recollée conserve la marque de sa cassure, l’union amoureuse tend vers une totalité qu’elle ne peut restaurer parfaitement." },
        { type:"analysis", term:"La portée du mythe", definition:"Le récit donne une origine commune à plusieurs orientations du désir : chaque être recherche le sexe correspondant à la composition de l’être dont il provient. Aristophane explique ainsi la diversité de la sexualité humaine sans la réduire à un modèle unique." },
        { type:"plain", definition:"Cette conception est formulée par Aristophane, personnage du dialogue. Elle contribue à la réflexion de Platon sur l’amour, mais ne doit pas être confondue sans nuance avec la doctrine que Socrate exposera ensuite au nom de Diotime." }
      ],
      relatedTexts:[
        { id:"kant-desir-raison-imagination", kind:"proche", label:"Kant — Le désir naît de la raison et de l’imagination", relation:"Les deux textes montrent que le désir dépasse le besoin immédiat : chez Platon, il vise une unité absente ; chez Kant, l’imagination intensifie l’inclination en soustrayant son objet aux sens." },
        { id:"rousseau-desir-imagination-bonheur", kind:"proche", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Platon et Rousseau font naître le désir de l’absence : le premier l’explique par la perte d’une unité originelle, le second par le pouvoir d’idéalisation de l’imagination." },
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès pense le désir comme une passion à assouvir ; Aristophane l’interprète comme le signe d’une séparation que la possession ne suffit pas à réparer." },
        { id:"aristote-amour-amitie-veritable", kind:"proche", label:"Aristote — L’amitié véritable consiste à aimer l’autre pour lui-même", relation:"Aristote prolonge l’idée d’un lien qui ne réduit pas l’autre à un objet de jouissance, tout en fondant l’amitié sur la vertu plutôt que sur une unité originelle." }
      ],
      artworks:[
        {
          src:"/images/textes/platon-mythe-androgyne/maier-soleil-lune.jpg",
          alt:"Le Soleil et la Lune personnifiés, debout près d’un coq et d’une poule dans un paysage gravé.",
          title:"Le soleil a besoin de la lune, comme le coq de la poule",
          details:"Michael Maier, <cite>Atalanta Fugiens</cite>, emblème XXX, gravure de Matthäus Merian, 1617."
        },
        {
          src:"/images/textes/platon-mythe-androgyne/livre-sainte-trinite-androgyne.jpg",
          alt:"Figure androgyne ailée à deux visages, couronnée, tenant des attributs symboliques et dominant un dragon.",
          title:"L’androgyne",
          details:"<cite>Livre de la Sainte Trinité</cite>, manuscrit alchimique, XVe siècle."
        },
        {
          src:"/images/textes/platon-mythe-androgyne/stolcius-hermes-complexio.jpg",
          alt:"Hermès Trismégiste contemple un soleil et une lune réunis dans un feu rayonnant.",
          title:"Hermès Trismégiste et le feu divin du <em>complexio oppositorum</em> qui unit les polarités",
          details:"Gravure de Daniel Stolcius von Stolcenberg, <cite>Viridarium chymicum</cite>, Francfort, 1624."
        },
        {
          src:"/images/textes/platon-mythe-androgyne/rebis-alchimique.png",
          alt:"Rebis alchimique à deux têtes, masculine et féminine, debout sur un dragon et une sphère ailée.",
          title:"Rebis — Androgyne alchimique",
          details:"Figure hermaphrodite symbolisant l’union des principes opposés dans l’alchimie."
        }
      ],
      paragraphs:[
        "ARISTOPHANE. — Jadis notre nature n’était pas ce qu’elle est à présent, elle était bien différente. D’abord il y avait trois espèces d’hommes, et non deux, comme aujourd’hui : le mâle, la femelle et […] l’espèce androgyne qui avait la forme et le nom des deux autres, […] et comme ils avaient de grands courages, ils attaquèrent les dieux […].",
        "Alors Zeus délibéra avec les autres dieux sur le parti à prendre : « […] Je vais immédiatement les couper en deux l’un après l’autre ; nous obtiendrons ainsi le double résultat de les affaiblir et de tirer d’eux davantage, puisqu’ils seront plus nombreux. […] » Ayant ainsi parlé, il coupa les hommes en deux […].",
        "Or, quand le corps eut été ainsi divisé, chacun, regrettant sa moitié, allait à elle ; et, s’embrassant et s’enlaçant les uns les autres avec le désir de se fondre ensemble, les hommes mouraient de faim et d’inaction […]. Alors Zeus, touché de pitié, […] plaça donc les organes sur le devant et par là fit que les hommes engendrèrent les uns dans les autres, c’est-à-dire le mâle dans la femelle. Cette disposition était à deux fins : si l’étreinte avait lieu entre un homme et une femme, ils enfanteraient pour perpétuer la race, et, si elle avait lieu entre un mâle et un mâle, la satiété les séparerait pour un temps, ils se mettraient au travail et pourvoiraient à tous les besoins de l’existence.",
        "C’est de ce moment que date l’amour inné des hommes les uns pour les autres : l’amour recompose l’antique nature, s’efforce de fondre deux êtres en un seul, et de guérir la nature humaine.",
        "Chacun de nous est donc comme une tessère d’hospitalité, puisque nous avons été coupés comme des soles et que d’un nous sommes devenus deux ; aussi chacun cherche sa moitié. […]",
        "Quand donc un homme, qu’il soit porté pour les garçons ou pour les femmes, rencontre celui-là même qui est sa moitié, c’est un prodige que les transports de tendresse, de confiance et d’amour dont ils sont saisis ; ils ne voudraient plus se séparer, ne fût-ce qu’un instant. […] Et la raison en est que notre ancienne nature était telle et que nous étions un tout complet : c’est le désir et la poursuite de ce tout qui s’appelle amour."
      ]
    },
    {
      id:"platon-socrate-temperance", section:"philosophie",
      cardMeta:"Antiquité grecque",
      title:"Le bonheur de la tempérance", author:"Platon", authorTag:"Platon",
      familiarIdea:"les tonneaux des Danaïdes",
      authorMeta:"(v. 428–v. 348 av. J.-C.)", themes:["Bonheur", "Désir"], work:"Gorgias", publication:"IVe s. av. J.-C., 493d–494b, trad. M. Canto",
      description:"Le bonheur consiste-t-il à satisfaire sans cesse ses désirs ou à n’en être plus esclave ?",
      context:"Dans la continuité immédiate de l’intervention de Calliclès, Socrate oppose au désir sans limite une vie <strong>tempérante</strong>, capable de trouver une forme de stabilité intérieure.",
      readingQuestions:[
        "Que représentent les tonneaux pleins et les tonneaux percés dans l’image de Socrate ?",
        "Pourquoi l’absence de maîtrise des <strong>désirs</strong> rend-elle, selon Socrate, malheureux ?"
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"<em>physis</em>", definition:"La nature." }, right:{ term:"<em>nomos</em>", definition:"La loi ou la convention humaine." }, conclusion:"Calliclès oppose la première aux règles morales de la cité ; Socrate conteste cette opposition." },
        { type:"opposition", left:{ term:"Calliclès : la nature comme lutte", definition:"Un jeu de forces où le plus puissant doit l’emporter." }, right:{ term:"Socrate : la nature comme <em>kosmos</em>", definition:"Un ordre harmonieux et mesuré, qui sert de norme." } },
        { type:"opposition", left:{ term:"<em>hēdonē</em>", definition:"Le plaisir : Calliclès en fait le critère du bonheur." }, right:{ term:"<em>aretē</em>", definition:"L’excellence ou la vertu : Socrate y subordonne le plaisir." } },
        { type:"concept", term:"Hédonisme de Calliclès", definition:"Il identifie le bonheur au plaisir et défend une recherche illimitée de l’intensité : désirer fortement et satisfaire ses passions autant que possible." },
        { type:"concept", term:"Intellectualisme moral de Platon", definition:"Connaître véritablement le bien est nécessaire et suffisant pour bien agir : la vertu ordonne l’âme et conduit au bonheur." }
      ],
      relatedTexts:[
        { id:"platon-callicles-desirs", kind:"suite", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Le passage précédent : Socrate répond ici point par point à la thèse de Calliclès." },
        { id:"epicure-plaisir-vie-heureuse", kind:"proche", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Épicure aussi refuse que le bonheur soit la poursuite indéfinie des plaisirs." },
        { id:"seneque-vie-vertueuse", kind:"proche", label:"Sénèque — La vie heureuse est la vie vertueuse", relation:"Sénèque défend lui aussi qu’une vie heureuse dépend de la vertu plutôt que de la poursuite des plaisirs." },
        { id:"augustin-dieu-bonheur", kind:"proche", label:"Saint Augustin — Dieu seul peut garantir notre bonheur", relation:"Augustin reprend l’idée d’un ordre intérieur et d’une juste mesure, mais en place le fondement ultime en Dieu." }
      ],
      paragraphs:[
        "SOCRATE. Regarde bien si ce que tu veux dire, quand tu parles de ces deux genres de vie, une vie d'ordre et une vie de dérèglement, ne ressemble pas à la situation suivante. Suppose qu'il y ait deux hommes qui possèdent, chacun, un grand nombre de tonneaux. Les tonneaux de l'un sont sains, remplis de vin, de miel, de lait, et cet homme a encore bien d'autres tonneaux, remplis de toutes sortes de choses. Chaque tonneau est donc plein de ces denrées liquides qui sont rares, difficiles à recueillir et qu'on n'obtient qu'au terme de maints travaux pénibles. Mais, au moins, une fois que cet homme a rempli ses tonneaux, il n'a plus à y reverser quoi que ce soit ni à s'occuper d’eux ; au contraire, quand il pense à ses tonneaux, il est tranquille.",
        "L'autre homme, quant à lui, serait aussi capable de se procurer ce genre de denrées, même si elles sont difficiles à recueillir, mais comme ses récipients sont percés et fêlés, il serait forcé de les remplir sans cesse, jour et nuit, en s'infligeant les plus pénibles peines. Alors, regarde bien, si ces deux hommes représentent chacun une manière de vivre, de laquelle des deux dis-tu qu'elle est la plus heureuse ? Est-ce la vie de l'homme déréglé ou celle de l'homme tempérant ? En te racontant cela, est-ce que je te convaincs d'admettre que la vie tempérante vaut mieux que la vie déréglée ? Est-ce que je ne te convaincs pas ?",
        "CALLICLES. Tu ne me convaincs pas, Socrate. Car l'homme dont tu parles, celui qui a fait le plein en lui-même et en ses tonneaux, n'a plus aucun plaisir, il a exactement le type d'existence dont je parlais tout à l’heure : il vit comme une pierre. S'il a fait le plein, il n'éprouve plus ni joie ni peine. Au contraire, la vie de plaisirs est celle où l'on verse et l'on reverse autant qu'on peut dans son tonneau !",
        "SOCRATE. Mais alors, si l'on en verse beaucoup, il faut aussi qu'il y en ait beaucoup qui s'en aille, on doit donc avoir de bons gros trous, pour que tout puisse bien s’échapper ! CALLICLES. Oui, parfaitement. SOCRATE. Tu parles de la vie d'un pluvier, qui mange et fiente en même temps ! non, ce n'est pas la vie d'un cadavre, même pas celle d'une pierre !"
      ]
    },
    {
      id:"platon-callicles-desirs", section:"philosophie",
      cardMeta:"Antiquité grecque",
      title:"Le bonheur comme libre satisfaction des désirs", author:"Platon", authorTag:"Platon",
      cardHighlight:"libre satisfaction des désirs",
      authorMeta:"(v. 428–v. 348 av. J.-C.)", themes:["Bonheur", "Liberté"], work:"Gorgias", publication:"IVe s. av. J.-C., 491e–492c, trad. M. Canto",
      description:"Le bonheur appartient-il à celui qui satisfait toutes ses passions sans rencontrer d’obstacle ?",
      context:"Calliclès défend une conception radicale de la <strong>liberté</strong> : l’homme fort devrait pouvoir suivre et assouvir ses désirs, sans se soumettre aux normes de la majorité.",
      readingQuestions:[
        "Pourquoi Calliclès présente-t-il la <strong>tempérance</strong> comme une morale inventée par les faibles ?",
        "En quel sens la liberté de satisfaire tous ses <strong>désirs</strong> entre-t-elle en tension avec la justice ?"
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"<em>physis</em>", definition:"La nature, dont Calliclès se réclame." }, right:{ term:"<em>nomos</em>", definition:"La loi ou la convention humaine, imposée selon lui par la majorité." } },
        { type:"opposition", left:{ term:"Nature comme lutte", definition:"Pour Calliclès, un chaos de forces où le plus fort doit dominer." }, right:{ term:"Nature comme <em>kosmos</em>", definition:"Pour d’autres Grecs, un tout ordonné dont l’équilibre sert de norme." } },
        { type:"opposition", left:{ term:"<em>hēdonē</em>", definition:"Le plaisir : Calliclès en fait le critère du bonheur." }, right:{ term:"<em>aretē</em>", definition:"L’excellence ou la vertu : Platon soutient qu’elle rend heureux." } },
        { type:"concept", term:"Hédonisme", definition:"Doctrine qui identifie le bonheur au plaisir. Calliclès défend ici un hédonisme de l’intensité et de l’expansion illimitée des désirs." },
        { type:"concept", term:"Intellectualisme moral", definition:"À l’opposé, Socrate et Platon soutiennent que la connaissance du bien permet d’agir vertueusement et que la vertu conduit au bonheur." }
      ],
      relatedTexts:[
        { id:"platon-socrate-temperance", kind:"suite", label:"Platon, Socrate — Le bonheur de la tempérance", relation:"Le passage qui suit immédiatement : Socrate répond à Calliclès par l’image des tonneaux." },
        { id:"epictete-depend-nous", kind:"adverse", label:"Épictète — La liberté commence par ce qui dépend de nous", relation:"Pour le stoïcien, être libre ne consiste pas à satisfaire ses désirs, mais à ne pas dépendre de ce qui nous échappe." },
        { id:"seneque-vie-vertueuse", kind:"adverse", label:"Sénèque — La vie heureuse est la vie vertueuse", relation:"Sénèque sépare radicalement la vertu du plaisir et fait de la première le seul fondement du bonheur." }
      ],
      paragraphs:[
        "CALLICLES. Car comment un homme pourrait-il être heureux s'il est esclave de quelqu'un d’autre ? Veux-tu savoir ce que sont le beau et le juste selon la nature ? Eh bien, je vais te le dire franchement ! Voici, si l'on veut vivre comme il faut, on doit laisser aller ses propres passions, si grandes soient-elles, et ne pas les réprimer. Au contraire, il faut être capable de mettre son courage et son intelligence au service de si grandes passions et de les assouvir avec tout ce qu'elles peuvent désirer.",
        "Seulement, tout le monde n'est pas capable, j'imagine, de vivre comme cela. C'est pourquoi la masse des gens blâme les hommes qui vivent ainsi, gênée qu'elle est de devoir dissimuler sa propre incapacité à le faire. La masse déclare donc bien haut que le dérèglement est une vilaine chose. C'est ainsi qu'elle réduit à l'état d'esclaves les hommes dotés d'une plus forte nature que celle des hommes de la masse ; et ces derniers, qui sont eux-mêmes incapables de se procurer les plaisirs qui les combleraient, font la louange de la tempérance et de la justice à cause du manque de courage de leur âme.",
        "Car, bien sûr, les hommes qui, dès le départ, se trouvent dans la situation d'exercer le pouvoir, sont des hommes qui peuvent jouir de leurs biens, sans que personne y fasse obstacle, et ils se mettraient eux-mêmes un maître sur le dos, en supportant les lois, les formules et les blâmes de la masse des hommes ! Comment pourraient-ils éviter, grâce à ce beau dont tu dis qu'il est fait de justice et de tempérance, d'en être réduits au malheur, s'ils ne peuvent pas, lors d'un partage, donner à leurs amis une plus grosse part qu'à leurs ennemis, et cela, dans leurs propres cités, où eux-mêmes exercent le pouvoir !",
        "Écoute, Socrate, tu prétends que tu poursuis la vérité, eh bien, voici la vérité : si la facilité de la vie, le dérèglement, la liberté de faire ce qu'on veut, demeurent dans l'impunité, ils font la vertu et le bonheur ! Tout le reste, ce ne sont que des manières, des conventions, faites par les hommes, à l'encontre de la nature. Rien que des paroles en l'air, qui ne valent rien !"
      ]
    },
    {
      id:"seneque-vie-vertueuse", section:"philosophie",
      cardMeta:"Stoïcisme",
      title:"La vie heureuse est la vie vertueuse", author:"Sénèque", authorTag:"Sénèque",
      cardHighlight:"vie vertueuse", cardHeight:"compact",
      authorMeta:"(v. 4 av. J.-C.–65 apr. J.-C.) · stoïcien", themes:["Bonheur", "Devoir"], work:"La Vie heureuse", publication:"vers 58, ch. VII, trad. J. Kany-Turpin, GF, 2005, p. 56–58",
      description:"Le plaisir peut-il constituer le souverain bien s’il accompagne aussi les vies les plus honteuses ?",
      context:"Sénèque distingue radicalement le <strong>plaisir</strong> de la <strong>vertu</strong>. Le premier est fragile et passager ; la seconde donne à la vie heureuse sa stabilité et sa valeur morale.",
      readingQuestions:[
        "Pourquoi l’existence de plaisirs immoraux suffit-elle à séparer le <strong>plaisir</strong> de la <strong>vertu</strong> ?",
        "En quoi la stabilité de la vertu permet-elle d’en faire le <strong>souverain bien</strong> ?"
      ],
      readingNotes:[
        { type:"school", term:"Stoïcisme", definition:"École hellénistique pour laquelle le bonheur dépend de la vertu et de l’usage droit de la raison, non des biens extérieurs ni des plaisirs." },
        { type:"definition", term:"Souverain bien", definition:"Le <em>summum bonum</em> est le bien recherché pour lui-même et auquel tous les autres biens sont subordonnés. Pour les stoïciens, il réside dans la vertu." },
        { type:"definition", term:"Vertu", definition:"La <em>virtus</em> latine traduit notamment l’<em>aretē</em> grecque : l’excellence morale d’une âme gouvernée par la raison et conforme à la nature." },
        { type:"prose", term:"Plaisir", definition:"Sénèque ne nie pas qu’il puisse accompagner une vie vertueuse ; il refuse qu’il en soit le principe ou le critère, puisqu’il est instable et peut accompagner le vice." }
      ],
      relatedTexts:[
        { id:"platon-socrate-temperance", kind:"proche", label:"Platon, Socrate — Le bonheur de la tempérance", relation:"Socrate et Sénèque subordonnent tous deux le plaisir à l’ordre moral de l’âme et à la vertu." },
        { id:"augustin-dieu-bonheur", kind:"proche", label:"Saint Augustin — Dieu seul peut garantir notre bonheur", relation:"Augustin recherche lui aussi un bien stable et une juste mesure de l’esprit, tout en les rapportant à Dieu." },
        { id:"descartes-trois-regles-bonheur", kind:"proche", label:"Descartes — Chacun peut se rendre heureux en observant trois règles", relation:"Descartes commente précisément le traité de Sénèque et redéfinit la vertu comme résolution à suivre la raison." },
        { id:"epicure-plaisir-vie-heureuse", kind:"adverse", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Épicure fait du plaisir bien compris le principe et la fin de la vie heureuse ; Sénèque refuse cette identification." },
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès identifie la vie réussie à l’assouvissement des passions, à l’inverse de l’idéal stoïcien de vertu." }
      ],
      paragraphs:[
        "Pourquoi, je vous prie, ne pourrait-on pas séparer le plaisir de la vertu ? Est-ce à dire que du fait que tout principe des biens réside dans la vertu, c'est aussi de ses racines que sort ce que vous aimez et que vous recherchez ? Mais si la vertu et le plaisir n'étaient pas séparés, on ne verrait pas certaines choses agréables mais immorales, d'autres morales, assurément, mais pénibles et que l'on accomplit en souffrant.",
        "Ajoute maintenant que le plaisir aboutit aussi à la vie la plus honteuse, alors que la vertu n'admet pas de mauvaise vie, et que certains sont malheureux non pas parce qu'ils sont privés de plaisir mais bien plutôt du fait du plaisir lui-même, ce qui n'arriverait pas si le plaisir était intimement mêlé à la vertu, plaisir dont elle est privée, mais qui ne lui manque jamais. Pourquoi mettre ensemble ces choses différentes et même opposées ? La vertu est quelque chose d'élevé, de noble et même de royal, d'invincible, d'infatigable, le plaisir quelque chose de bas, de servile, de faible, de fragile qui séjourne comme chez lui dans les bordels et les tavernes. […]",
        "Le souverain bien est immortel, il est incapable de nous quitter, il n'a ni satiété ni regret. Jamais, en effet, l'esprit droit ne change ni ne se prend en aversion, et d'ailleurs rien de ce qui est parfait n'a jamais changé. Le plaisir, en revanche, au moment où on en jouit le plus, s’éteint ; il n'a pas beaucoup de place, c'est pourquoi il la remplit vite, il inspire de la répugnance et il se fane au premier élan. Et nulle chose n'est jamais assurée, quand sa nature réside dans le mouvement. Il ne peut non plus exister, à coup sûr, une essence propre de ce qui arrive et passe très vite, devant périr dans son exercice même. Il arrive, en effet, à son but là où il cesse et à peine commence-t-il qu'il voit sa fin."
      ]
    },
    {
      id:"augustin-dieu-bonheur", section:"philosophie", sections:["philosophie", "theologie"],
      cardMeta:"Antiquité tardive",
      title:"Dieu seul peut garantir notre bonheur", author:"Saint Augustin", authorTag:"Augustin",
      cardHighlight:"Dieu seul", cardHeight:"compact",
      authorMeta:"(354–430) · Père de l’Église", themes:["Bonheur", "Religion"], work:"La Vie heureuse", publication:"IVe s., conclusion, §§ 33–36, trad. S. Dupuy-Trudelle, Gallimard, 1998, p. 112–114",
      description:"Pourquoi la sagesse ne conduit-elle pleinement au bonheur qu’en rattachant l’esprit à Dieu ?",
      context:"Augustin définit la <strong>sagesse</strong> comme la juste mesure de l’esprit : elle le protège à la fois de l’excès et du manque. Cette mesure n’est pleinement assurée que par le rapport à <strong>Dieu</strong>.",
      readingQuestions:[
        "Comment la sagesse maintient-elle l’esprit entre l’<strong>excès</strong> et l’<strong>indigence</strong> ?",
        "Pourquoi la connaissance de Dieu constitue-t-elle, selon Augustin, la pleine satiété de l’âme ?"
      ],
      readingNotes:[
        { type:"analysis", term:"Sagesse et mesure", definition:"La sagesse est la <em>mesure de l’esprit</em> : elle empêche aussi bien la démesure des désirs que l’appauvrissement intérieur produit par la crainte et le chagrin." },
        { type:"analysis", term:"Vie heureuse", definition:"La <em>beata vita</em> n’est pas une simple satisfaction sensible : elle est la plénitude spirituelle de l’âme qui connaît la vérité et demeure attachée à Dieu." },
        { type:"analysis", term:"Héritage néoplatonicien", definition:"Augustin reprend la distinction entre le <em>monde intelligible</em>, stable, éternel et accessible à l’esprit, et le <em>monde sensible</em>, changeant et soumis aux apparences. Les biens sensibles ne peuvent donc combler durablement l’âme ; elle trouve son accomplissement dans la vérité intelligible, qui est Dieu." },
        { type:"concept", term:"Dieu trinitaire", definition:"Augustin se distingue de Platon en identifiant le principe intelligible à un Dieu personnel, unique et existant en trois personnes :", items:["le Père : créateur du monde, source qui conduit l’être humain vers la vérité ;", "le Fils : Jésus-Christ, vérité de Dieu manifestée aux hommes ;", "le Saint-Esprit : l’Amour qui unit et l’intermédiaire par lequel nous sommes rattachés à Dieu."] }
      ],
      glossary:[
        { term:"inanité", definition:"Ce qui est vain, vide ou sans véritable valeur." },
        { term:"simulacres", definition:"Des apparences trompeuses qui se donnent pour la réalité." },
        { term:"indigence", definition:"Le manque de ce qui est nécessaire." },
        { term:"satiété", definition:"La satisfaction complète d’un besoin ou d’un désir." }
      ],
      relatedTexts:[
        { id:"platon-socrate-temperance", kind:"proche", label:"Platon, Socrate — Le bonheur de la tempérance", relation:"Les deux textes lient le bonheur à un ordre intérieur qui délivre l’âme de la démesure des désirs." },
        { id:"seneque-vie-vertueuse", kind:"proche", label:"Sénèque — La vie heureuse est la vie vertueuse", relation:"Augustin comme Sénèque cherche un bien stable, supérieur aux plaisirs fragiles et aux biens extérieurs." },
        { id:"pascal-bonheur-avenir", kind:"proche", label:"Pascal — Espérer le bonheur, c’est se condamner à ne jamais l’obtenir", relation:"Pascal prolonge le diagnostic chrétien d’une âme qui cherche sa satisfaction dans des réalités temporelles incapables de la combler." }
      ],
      paragraphs:[
        "[S]i vous demandez ce qu'est la sagesse […], elle n'est rien d'autre que la mesure de l'esprit, c'est-à-dire ce par quoi l'esprit s'équilibre de sorte qu'il ne coure pas à l'excès sans pour autant se rabougrir en deçà de la plénitude. Or, il court à tout ce qui est luxure, pouvoir, orgueil, et toutes choses de ce genre, par quoi intempérants et malheureux pensent se procurer joie et jouissance. Or, il se rabougrit par les vilénies, par les craintes, par le chagrin, par la convoitise et par toutes choses de ce genre […].",
        "Mais, lorsque après avoir trouvé la sagesse, il la contemple ; lorsque […] il s'y tient et, n'étant plus ébranlé par cette inanité, ne se tourne plus vers ces simulacres trompeurs dont la masse une fois étreinte le fait tomber de son Dieu et disparaître englouti, alors il ne craint ni l'absence de mesure non plus que l'indigence, ni donc le malheur. Ainsi a sa propre mesure, c'est-à-dire la sagesse, tout être qui est heureux. […]",
        "Telle est donc cette pleine satiété spirituelle qui est la vie heureuse même : connaître pieusement et parfaitement par qui nous sommes conduits à la vérité, de quelle vérité nous jouissons, par quel intermédiaire nous sommes rattachés à la mesure suprême. Les trois, pour ceux qui comprennent, une fois écartées les vanités diverses de la superstition, expriment un seul Dieu et une seule substance."
      ]
    },
    {
      id:"pascal-bonheur-avenir", section:"philosophie",
      cardMeta:"XVIIe siècle",
      title:"Espérer le bonheur, c’est se condamner à ne jamais l’obtenir", author:"Blaise Pascal", authorTag:"Pascal",
      cardTitle:"Ainsi nous ne vivons jamais, mais nous espérons vivre",
      cardHighlight:"mais nous espérons vivre", cardStyle:"quote",
      authorMeta:"(1623–1662) · moraliste chrétien", themes:["Bonheur", "Temps"], work:"Pensées", publication:"1670, publication posthume, Laf. 47 (Br. 172), Le Seuil, 1962, p. 47–48",
      description:"Pourquoi notre attente d’un bonheur futur nous empêche-t-elle de vivre le seul temps qui nous appartient ?",
      context:"Pascal montre que la conscience humaine se détourne presque constamment du <strong>présent</strong>. En faisant de l’avenir la fin de notre existence, nous repoussons indéfiniment le moment d’être heureux.",
      readingQuestions:[
        "De quelle manière la conscience du <strong>temps</strong> détourne-t-elle du présent ?",
        "Pourquoi ne parvenons-nous pas à nous en tenir au présent, même lorsqu’il est agréable ?",
        "En quel sens la recherche du <strong>bonheur</strong> rend-elle son acquisition impossible ?"
      ],
      readingNotes:[
        { type:"analysis", term:"Le présent comme moyen", definition:"Nous ne faisons presque jamais du présent une fin : nous l’utilisons pour préparer un avenir auquel nous confions notre bonheur." },
        { type:"analysis", term:"Espérer de vivre", definition:"En français classique, « espérer de » signifie attendre un bien désiré. La formule souligne que la vie réelle est sans cesse ajournée au profit d’une vie imaginée." },
        { type:"analysis", term:"Condition humaine", definition:"Pour Pascal, l’être humain fuit ce qui le blesse et cherche hors du présent une satisfaction toujours différée : son imagination le rend incapable d’habiter pleinement sa vie." },
        { type:"analysis", term:"À rapprocher du divertissement", definition:"Dans les <em>Pensées</em>, le divertissement désigne tout ce qui nous détourne de nous-mêmes et de notre condition. La fuite temporelle décrite ici en est une forme essentielle." }
      ],
      relatedTexts:[
        { id:"schopenhauer-bien-etre-negation", kind:"proche", label:"Schopenhauer — Le bien-être ne se ressent qu’après sa perte", relation:"Tous deux analysent une conscience du temps qui rend le bonheur présent presque imperceptible." },
        { id:"augustin-dieu-bonheur", kind:"proche", label:"Saint Augustin — Dieu seul peut garantir notre bonheur", relation:"Augustin explique pourquoi les réalités temporelles ne suffisent pas à combler durablement l’âme." }
      ],
      paragraphs:[
        "Nous ne nous tenons jamais au temps présent. Nous rappelons le passé ; nous anticipons l'avenir comme trop lent à venir, comme pour hâter son cours, ou nous rappelons le passé pour l'arrêter comme trop prompt, si imprudents que nous errons dans les temps qui ne sont point nôtres, et ne pensons point au seul qui nous appartient, et si vains que nous songeons à ceux qui ne sont rien, et échappons sans réflexion le seul qui subsiste.",
        "C'est que le présent d'ordinaire nous blesse. Nous le cachons à notre vue parce qu'il nous afflige, et s'il nous est agréable nous regrettons de le voir échapper. Nous tâchons de le soutenir par l'avenir, et pensons à disposer les choses qui ne sont pas en notre puissance pour un temps où nous n'avons aucune assurance d'arriver.",
        "Que chacun examine ses pensées. Il les trouvera toutes occupées au passé ou à l'avenir. Nous ne pensons presque point au présent, et si nous y pensons ce n'est que pour en prendre la lumière pour disposer de l'avenir. Le présent n'est jamais notre fin. Le passé et le présent sont nos moyens ; le seul avenir est notre fin.",
        "Ainsi nous ne vivons jamais, mais nous espérons de vivre, et nous disposant toujours à être heureux il est inévitable que nous ne le soyons jamais."
      ]
    },
    {
      id:"freud-bonheur-episodique", section:"philosophie",
      cardMeta:"Psychanalyse",
      title:"Il n’y a aucun des biens de ce monde qui puisse rendre heureux durablement", author:"Sigmund Freud", authorTag:"Freud",
      cardHighlight:"durablement",
      authorMeta:"(1856–1939) · fondateur de la psychanalyse", themes:["Bonheur", "Désir", "Inconscient"], work:"Le Malaise dans la culture", publication:"1929, trad. P. Cotet et al., chap. II, PUF, 2004, p. 18–19",
      description:"Pourquoi le bonheur intense ne peut-il être qu’épisodique, alors que la souffrance nous menace continuellement ?",
      context:"Freud oppose le <strong>principe de plaisir</strong>, qui pousse à chercher une satisfaction immédiate, au <strong>principe de réalité</strong>, qui oblige à composer avec le monde extérieur, le corps et les autres. Même satisfaite, une situation durable perd son intensité.",
      readingQuestions:[
        "Pourquoi une satisfaction qui se prolonge ne produit-elle plus qu’un sentiment d’aise assez <strong>tiède</strong> ?",
        "En quoi les trois sources de souffrance rendent-elles le <strong>bonheur durable</strong> particulièrement difficile ?",
        "Pourquoi la souffrance causée par <strong>autrui</strong> paraît-elle plus douloureuse que les autres ?"
      ],
      readingNotes:[
        { type:"concept", term:"Principe de plaisir", definition:"Tendance de l’appareil psychique à rechercher la satisfaction et à réduire les tensions déplaisantes. Le bonheur strict correspond ici à la décharge soudaine d’un besoin fortement retenu." },
        { type:"opposition", left:{ term:"Principe de plaisir", definition:"Il tend vers la satisfaction immédiate des besoins et l’évitement du déplaisir." }, right:{ term:"Principe de réalité", definition:"Il contraint le désir à différer, modifier ou renoncer à certaines satisfactions afin de tenir compte des conditions du monde extérieur et de la vie avec autrui." }, conclusion:"Le principe de réalité ne supprime pas le désir : il en règle la satisfaction selon ce qui est possible." },
        { type:"concept", term:"Bonheur épisodique", definition:"Le plaisir intense naît d’un contraste : lorsqu’une satisfaction devient un état stable, elle s’affaiblit et se transforme en simple bien-être." },
        { type:"concept", term:"Trois sources de souffrance", definition:"La souffrance menace l’être humain de trois côtés :", items:["son propre corps, voué à la déchéance ;", "le monde extérieur et ses forces destructrices ;", "ses relations avec les autres êtres humains."] },
        { type:"concept", term:"Malaise dans la culture", definition:"La vie collective protège partiellement l’être humain, mais elle exige aussi des renoncements pulsionnels et rend les relations avec autrui inséparables de conflits et de frustrations." }
      ],
      relatedTexts:[
        { id:"kant-quietude-inaccessible", kind:"proche", label:"Kant — La quiétude est inaccessible à l’homme", relation:"Kant et Freud refusent tous deux l’idée d’une satisfaction humaine complète et durable." },
        { id:"schopenhauer-bonheur-absence-souffrance", kind:"proche", label:"Schopenhauer — Le bonheur comme absence de souffrance", relation:"Schopenhauer accorde lui aussi davantage de réalité à la souffrance qu’au plaisir." },
        { id:"alain-bonheur-agir", kind:"adverse", label:"Alain — Le vrai bonheur est le bonheur d’agir", relation:"Alain déplace la question : le bonheur véritable ne réside pas dans un état satisfait, mais dans l’action elle-même." }
      ],
      paragraphs:[
        "Ce qu'on appelle bonheur au sens le plus strict découle de la satisfaction plutôt subite de besoins fortement mis en stase et, d'après sa nature, n'est possible que comme phénomène épisodique. Toute persistance d'une situation désirée par le principe de plaisir ne donne qu'un sentiment d'aise assez tiède ; nos dispositifs sont tels que nous ne pouvons jouir intensément que de ce qui est contraste, et ne pouvons jouir que très peu de ce qui est état. Ainsi donc nos possibilités de bonheur sont limitées déjà par notre constitution.",
        "Il y a beaucoup moins de difficultés à faire l'expérience du malheur. La souffrance menace de trois côtés, en provenance du corps propre qui, voué à la déchéance et à la dissolution, ne peut même pas se passer de la douleur et de l'angoisse comme signaux d'alarme, en provenance du monde extérieur qui peut faire rage contre nous avec des forces surpuissantes, inexorables et destructrices, et finalement à partir des relations avec d'autres hommes.",
        "La souffrance issue de cette source, nous la ressentons peut-être plus douloureusement que toute autre ; nous sommes enclins à voir en elle un ingrédient en quelque sorte superflu, même si, en termes de destin, elle n'est peut-être pas moins inéluctable que la souffrance d'une autre provenance."
      ]
    },
    {
      id:"descartes-changer-desirs", section:"philosophie",
      cardMeta:"Rationalisme",
      title:"Pour être heureux, il faut changer ses désirs", author:"René Descartes", authorTag:"Descartes",
      cardHighlight:"changer ses désirs",
      authorMeta:"(1596–1650) · rationalisme classique", themes:["Bonheur", "Désir", "Liberté"], work:"Discours de la méthode", publication:"1637, troisième partie, GF, 1966, p. 53–54",
      description:"Comment devenir heureux en réglant nos désirs sur ce qui dépend réellement de nous ?",
      context:"Dans la troisième maxime de sa <strong>morale par provision</strong>, Descartes reprend un geste stoïcien : agir autant que possible sur le monde, puis cesser de désirer ce qui échappe à notre pouvoir.",
      readingQuestions:[
        "Pourquoi est-il plus raisonnable de se <strong>vaincre soi-même</strong> que de vouloir vaincre la fortune ?",
        "Comment la distinction entre le possible et l’impossible peut-elle supprimer le <strong>regret</strong> ?",
        "Pourquoi cette manière de penser exige-t-elle un long <strong>exercice</strong> ?"
      ],
      readingNotes:[
        { type:"concept", term:"Morale par provision", definition:"Ensemble de règles pratiques adoptées par Descartes pour pouvoir agir pendant qu’il poursuit la recherche méthodique de la vérité." },
        { type:"opposition", left:{ term:"Ce qui dépend de nous", definition:"Nos pensées, nos jugements et la manière dont nous réglons nos désirs." }, right:{ term:"Ce qui n’en dépend pas", definition:"Les biens extérieurs, les événements et les effets de la fortune." }, conclusion:"Le contentement exige de concentrer sa volonté sur le premier domaine." },
        { type:"concept", term:"Faire de nécessité vertu", definition:"Transformer l’acceptation de ce qui ne peut être changé en une disposition volontaire et raisonnable, plutôt que le subir dans le regret." },
        { type:"concept", term:"Exercice spirituel", definition:"La maîtrise des désirs n’est pas une décision instantanée : elle s’acquiert par une méditation souvent répétée jusqu’à devenir une manière stable de juger." }
      ],
      relatedTexts:[
        { id:"descartes-trois-regles-bonheur", kind:"identique", label:"Descartes — Chacun peut se rendre heureux en observant trois règles", relation:"Dans la lettre à Élisabeth, Descartes reprend et développe les trois règles morales annoncées dans le Discours de la méthode." },
        { id:"epictete-depend-nous", kind:"proche", label:"Épictète — La liberté commence par ce qui dépend de nous", relation:"Descartes reconnaît explicitement l’héritage stoïcien de la distinction entre ce qui dépend de nous et ce qui n’en dépend pas." },
        { id:"platon-callicles-desirs", kind:"adverse", label:"Platon, Calliclès — Le bonheur comme libre satisfaction des désirs", relation:"Calliclès mesure au contraire la liberté à l’expansion et à la satisfaction des désirs." }
      ],
      paragraphs:[
        "Ma troisième maxime était de tâcher toujours plutôt à me vaincre que la fortune et à changer mes désirs que l'ordre du monde ; et généralement, de m'accoutumer à croire qu'il n'y a rien qui soit entièrement en notre pouvoir, que nos pensées, en sorte qu'après que nous avons fait notre mieux, touchant les choses qui nous sont extérieures, tout ce qui manque de nous réussir est au regard de nous absolument impossible.",
        "Et ceci seul me semblait être suffisant pour m'empêcher de rien désirer à l'avenir que je n'acquisse, et ainsi pour me rendre content. Car notre volonté ne se portant naturellement à désirer que les choses que notre entendement lui représente en quelque façon comme possibles, il est certain que si nous considérons tous les biens qui sont hors de nous comme également éloignés de notre pouvoir, nous n'aurons pas plus de regrets de manquer de ceux qui semblent être dus à notre naissance, lorsque nous en serons privés sans notre faute, que nous avons de ne posséder pas les royaumes de la Chine ou du Mexique ; et que, faisant, comme on dit, de nécessité vertu, nous ne désirerons pas davantage d'être sains, étant malades, ou d'être libres, étant en prison, que nous faisons maintenant d'avoir des corps d'une matière aussi peu corruptible que les diamants, ou des ailes pour voler comme les oiseaux.",
        "Mais j'avoue qu'il est besoin d'un long exercice, et d'une méditation souvent réitérée, pour s'accoutumer à regarder de ce biais toutes les choses ; et je crois que c'est principalement en ceci que consistait le secret de ces philosophes, qui ont pu autrefois se soustraire de l'empire de la fortune et, malgré les douleurs et la pauvreté, disputer de la félicité avec leurs dieux. Car, s'occupant sans cesse à considérer les bornes qui leur étaient prescrites par la nature, ils se persuadaient si parfaitement que rien n'était en leur pouvoir que leurs pensées, que cela seul était suffisant pour les empêcher d'avoir aucune affection pour d'autres choses ; et ils disposaient d'elles si absolument qu'ils avaient en cela quelque raison de s'estimer plus riches, et plus puissants, et plus libres, et plus heureux qu'aucun des autres hommes, qui, n'ayant point cette philosophie, tant favorisés de la nature et de la fortune qu'ils puissent être, ne disposent jamais ainsi de tout ce qu'ils veulent."
      ]
    },
    {
      id:"descartes-trois-regles-bonheur", section:"philosophie",
      cardMeta:"Rationalisme",
      title:"Chacun peut se rendre heureux en observant trois règles de morale", author:"René Descartes", authorTag:"Descartes",
      cardHighlight:"trois règles de morale",
      authorMeta:"(1596–1650) · rationalisme classique", themes:["Bonheur", "Liberté", "Raison"], work:"Lettre à Élisabeth du 4 août 1645", publication:"1645",
      description:"Quelles règles permettent d’atteindre un contentement intérieur indépendant de la fortune ?",
      context:"Descartes distingue l’<strong>heur</strong>, qui dépend de la fortune, de la <strong>béatitude</strong>, contentement intérieur accessible par l’usage de la raison, la résolution et la maîtrise des désirs.",
      readingQuestions:[
        "Pourquoi le <strong>contentement</strong> d’un être humain pauvre ou malade peut-il être aussi complet que celui d’un homme favorisé par la fortune ?",
        "Comment les trois règles articulent-elles la <strong>raison</strong>, la volonté et le désir ?",
        "Pourquoi une décision raisonnable peut-elle ne donner aucun sujet de <strong>repentir</strong>, même si son résultat est mauvais ?"
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"Heur", definition:"Bonheur reçu des circonstances extérieures et de la fortune." }, right:{ term:"Béatitude", definition:"Parfait contentement de l’esprit et satisfaction intérieure acquis par le sage." }, conclusion:"La philosophie ne garantit pas tous les biens extérieurs, mais elle peut rendre notre contentement indépendant d’eux." },
        { type:"concept", term:"Trois règles de morale", definition:"Chacun peut se rendre content de soi-même à trois conditions :", items:["employer au mieux son esprit pour connaître ce qu’il faut faire ;", "prendre la résolution ferme d’exécuter ce que conseille la raison ;", "ne pas désirer les biens qui demeurent hors de son pouvoir."] },
        { type:"concept", term:"Vertu", definition:"Descartes la définit ici comme la fermeté et la constance de la résolution à suivre ce que la raison juge être le meilleur." },
        { type:"concept", term:"Comparaison des vaisseaux", definition:"Un petit vaisseau peut être aussi plein qu’un grand : le contentement est complet lorsque les désirs réglés par la raison sont accomplis, même si les biens possédés sont moins nombreux." }
      ],
      relatedTexts:[
        { id:"descartes-changer-desirs", kind:"identique", label:"Descartes — Pour être heureux, il faut changer ses désirs", relation:"Cette lettre reprend et développe la morale exposée dans la troisième partie du Discours de la méthode." },
        { id:"epictete-depend-nous", kind:"proche", label:"Épictète — La liberté commence par ce qui dépend de nous", relation:"La troisième règle reformule la distinction stoïcienne entre ce qui dépend de nous et ce qui n’en dépend pas." },
        { id:"seneque-vie-vertueuse", kind:"proche", label:"Sénèque — La vie heureuse est la vie vertueuse", relation:"Descartes discute ici le traité de Sénèque et conserve l’idée qu’une vie heureuse repose d’abord sur la vertu." }
      ],
      paragraphs:[
        "Lorsque j’ai choisi le livre de Sénèque <cite>De vita beata</cite>, pour le proposer à Votre Altesse comme un entretien qui lui pourrait être agréable, j’ai eu seulement égard à la réputation de l’auteur et à la dignité de la matière, sans penser à la façon dont il la traite, laquelle ayant depuis considérée, je ne la trouve pas assez exacte pour mériter d’être suivie. Mais, afin que Votre Altesse en puisse juger plus aisément, je tâcherai ici d’expliquer en quelle sorte il me semble que cette matière eût dû être traitée par un philosophe tel que lui, qui, n’étant point éclairé de la foi, n’avait que la raison naturelle pour guide.",
        "Il dit fort bien, au commencement, que <em>vivere omnes beate volunt, sed ad pervidendum quid sit quod beatam vitam efficiat, caligant</em>. Mais il est besoin de savoir ce que c’est que <em>vivere beate</em> ; je dirais en français vivre heureusement, sinon qu’il y a de la différence entre l’heur et la béatitude, en ce que l’heur ne dépend que des choses qui sont hors de nous, d’où vient que ceux-là sont estimés plus heureux que sages, auxquels il est arrivé quelque bien qu’ils ne se sont point procuré, au lieu que la béatitude consiste, ce me semble, en un parfait contentement d’esprit et une satisfaction intérieure, que n’ont pas ordinairement ceux qui sont le plus favorisés de la fortune, et que les sages acquièrent sans elle. Ainsi <em>vivere beate</em>, vivre en béatitude, ce n’est autre chose qu’avoir l’esprit parfaitement content et satisfait.",
        "Considérant, après cela, ce que c’est <em>quod beatam vitam efficiat</em>, c’est-à-dire quelles sont les choses qui nous peuvent donner ce souverain contentement, je remarque qu’il y en a de deux sortes : à savoir, de celles qui dépendent de nous, comme la vertu et la sagesse, et de celles qui n’en dépendent point, comme les honneurs, les richesses et la santé. Car il est certain qu’un homme bien né, qui n’est point malade, qui ne manque de rien, et qui avec cela est aussi sage et aussi vertueux qu’un autre qui est pauvre, malsain et contrefait, peut jouir d’un plus parfait contentement que lui.",
        "Toutefois, comme un petit vaisseau peut être aussi plein qu’un plus grand, encore qu’il contienne moins de liqueur, ainsi, prenant le contentement d’un chacun pour la plénitude et l’accomplissement de ses désirs réglés selon la raison, je ne doute point que les plus pauvres et les plus disgraciés de la fortune ou de la nature ne puissent être entièrement contents et satisfaits, aussi bien que les autres, encore qu’ils ne jouissent pas de tant de biens. Et ce n’est que de cette sorte de contentement, de laquelle il est ici question ; car puisque l’autre n’est aucunement en notre pouvoir, la recherche en serait superflue. Or il me semble qu’un chacun se peut rendre content de soi-même et sans rien attendre d’ailleurs, pourvu seulement qu’il observe trois choses, auxquelles se rapportent les trois règles de morale, que j’ai mises dans le <cite>Discours de la méthode</cite>.",
        "La première est, qu’il tâche toujours de se servir, le mieux qu’il lui est possible, de son esprit, pour connaître ce qu’il doit faire ou ne pas faire en toutes les occurrences de la vie. La seconde, qu’il ait une ferme et constante résolution d’exécuter tout ce que la raison lui conseillera, sans que ses passions ou ses appétits l’en détournent ; et c’est la fermeté de cette résolution, que je crois devoir être prise pour la vertu, bien que je ne sache point que personne l’ait jamais ainsi expliquée ; mais on l’a divisée en plusieurs espèces, auxquelles on a donné divers noms, à cause des divers objets auxquels elle s’étend.",
        "La troisième, qu’il considère que, pendant qu’il se conduit ainsi, autant qu’il peut, selon la raison, tous les biens qu’il ne possède point sont aussi entièrement hors de son pouvoir les uns que les autres, et que, par ce moyen, il s’accoutume à ne les point désirer ; car il n’y a rien que le désir, et le regret ou le repentir, qui nous puissent empêcher d’être contents : mais si nous faisons toujours tout ce que nous dicte notre raison, nous n’aurons jamais aucun sujet de nous repentir, encore que les événements nous fissent voir, par après, que nous nous sommes trompés, pour ce que ce n’est point par notre faute.",
        "Et ce qui fait que nous ne désirons point d’avoir, par exemple, plus de bras ou plus de langues que nous n’en avons, mais que nous désirons bien d’avoir plus de santé ou plus de richesses, c’est seulement que nous imaginons que ces choses-ci pourraient être acquises par notre conduite, ou bien qu’elles sont dues à notre nature, et que ce n’est pas le même des autres : de laquelle opinion nous pourrons nous dépouiller, en considérant que, puisque nous avons toujours suivi le conseil de notre raison, nous n’avons rien omis de ce qui était en notre pouvoir, et que les maladies et les infortunes ne sont pas moins naturelles à l’homme, que les prospérités et la santé."
      ]
    },
    {
      id:"alain-bonheur-agir", section:"philosophie",
      cardMeta:"Philosophie de l’action",
      title:"Le vrai bonheur est le bonheur d’agir", author:"Alain", authorTag:"Alain",
      cardHighlight:"bonheur d’agir",
      authorMeta:"(1868–1951) · philosophe et moraliste", themes:["Bonheur", "Désir"], work:"Esquisses, La recherche du bonheur", publication:"PUF, 1968, p. 35",
      description:"Pourquoi le bonheur reçu finit-il par ennuyer, tandis que l’action difficile nous rend véritablement heureux ?",
      context:"Alain oppose le <strong>bonheur de rencontre</strong>, reçu de la fortune mais vite oublié, au <strong>bonheur d’agir</strong>, qui naît indirectement d’un effort dirigé vers un obstacle.",
      readingQuestions:[
        "Pourquoi cessons-nous de goûter les biens que nous possédons dès qu’ils deviennent habituels ?",
        "Comment l’<strong>ennui</strong> révèle-t-il notre besoin d’action et de risque ?",
        "Pourquoi le bonheur d’agir peut-il être trouvé, mais non directement <strong>recherché</strong> ?"
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"Bonheur de rencontre", definition:"Bonheur reçu de la fortune : richesse, pouvoir, santé, longévité ou présence des êtres aimés." }, right:{ term:"Bonheur d’agir", definition:"Joie qui naît de l’activité, de l’apprentissage, de la conquête et des obstacles surmontés." }, conclusion:"Le premier devient vite invisible ; le second est la « fleur de l’action » et n’apparaît qu’en chemin." },
        { type:"concept", term:"Ennui", definition:"Lorsque rien ne mobilise notre puissance d’agir, les biens possédés perdent leur saveur et l’être humain recherche spontanément une nouvelle difficulté." },
        { type:"concept", term:"Bonheur indirect", definition:"Dès que le bonheur devient l’objet explicite de la recherche, il se dérobe. Dans l’action, c’est l’objet à accomplir qui attire ; le bonheur survient comme effet non recherché." },
        { type:"concept", term:"La peine comme forme du bonheur", definition:"L’obstacle ne s’oppose pas nécessairement au bonheur : il lui donne une matière en permettant à l’être humain d’exercer et d’éprouver sa puissance." }
      ],
      relatedTexts:[
        { id:"kant-quietude-inaccessible", kind:"proche", label:"Kant — La quiétude est inaccessible à l’homme", relation:"Kant et Alain font tous deux de l’activité une dimension essentielle de la vie humaine." },
        { id:"freud-bonheur-episodique", kind:"proche", label:"Freud — Aucun bien ne rend durablement heureux", relation:"Tous deux constatent que la satisfaction durable s’émousse ; Alain en conclut que le bonheur véritable accompagne l’action." },
        { id:"pascal-bonheur-avenir", kind:"adverse", label:"Pascal — Espérer le bonheur, c’est se condamner à ne jamais l’obtenir", relation:"Pascal dénonce une fuite hors du présent ; Alain montre comment l’action présente peut produire un bonheur qui n’est pas recherché pour lui-même." }
      ],
      paragraphs:[
        "L’idée qui résulte clairement de ce qui a été dit, c’est qu’il y a des degrés dans le bonheur, ou, si l’on veut, des bonheurs de diverses qualités. Au plus bas degré se trouve un bonheur de rencontre, comme d’être riche, puissant, recherché, de se bien porter, de vivre longtemps, de conserver longtemps ceux que l’on aime. Ce genre de bonheur, tous l’admirent et le désirent ; mais ceux qui l’ont ne semblent pas le goûter. L’ennui est le fait humain le plus étonnant peut-être. Tous ces biens ressemblent à la santé ; dès qu’on ne l’a point, on la désire ; mais dès qu’on l’a, on n’y pense plus et l’on se porte aussitôt à quelque action aventureuse, et de conquête, où la santé, la richesse, les plaisirs de sentiment sont mis en jeu. Le jeu de hasard, objet d’une passion fort commune, est en quelque façon le symbole de cet amour de l’action et du risque et en même temps de la puissance de l’ennui.",
        "Les enfants dans leurs jeux font bien saisir la source du bonheur véritable (« fleur de l’action »). Et les hommes sont comme des enfants ; toujours indifférents à l’égard du bonheur reçu, toujours avides de conquérir, d’apprendre, de faire... et quant au bonheur d’agir, ainsi qu’il a été expliqué, on le trouve, mais on ne le cherche pas ; c’est l’action qui attire. Et le bonheur se présente alors sous l’aspect de la peine, c’est-à-dire d’obstacles à vaincre."
      ]
    },
    {
      id:"foucault-commentaire-exces-sens", section:"philosophie",
      cardMeta:"XXe siècle · philosophie du langage",
      title:"Tout discours dit plus que ce qu’il dit en apparence", author:"Michel Foucault", authorTag:"Foucault",
      cardHighlight:"plus que ce qu’il dit",
      authorMeta:"(1926–1984) · philosophie contemporaine", themes:["Interprétation", "Langage", "Histoire"], work:"Naissance de la clinique", publication:"1963, préface, PUF, 2003, p. XII",
      description:"Pourquoi tout commentaire suppose-t-il que le langage contient toujours plus de sens qu’il n’en exprime ?",
      context:"Foucault analyse l’acte de <strong>commenter</strong> : il consiste à reprendre un discours pour faire entendre le sens qui paraît y demeurer implicite. Mais cette recherche ne peut jamais s’achever, car le <strong>signifié</strong> comme le <strong>signifiant</strong> semblent toujours excéder ce qui a déjà été dit.",
      readingQuestions:[
        "Pourquoi le commentaire cherche-t-il à redire ce qui n’a jamais été explicitement prononcé ?",
        "Comment comprendre l’idée d’un <strong>excès du signifié sur le signifiant</strong> ?",
        "Pourquoi cette conception du langage voue-t-elle l’interprétation à une tâche <strong>infinie</strong> ?"
      ],
      readingNotes:[
        { type:"definition", term:"Signifié / signifiant", definition:"Le signifié est le sens auquel renvoie un signe ; le signifiant est sa forme matérielle, par exemple les sons d’un mot ou les lettres qui le composent." },
        { type:"concept", term:"Commentaire", definition:"Reprise d’un discours qui cherche à en faire surgir le sens latent. Il ne se contente pas de répéter : il prétend dire ce que le premier discours contenait sans le formuler entièrement." },
        { type:"analysis", term:"Double pléthore", definition:"Le sens semble toujours déborder ce qui a été dit, tandis que les mots eux-mêmes restent assez riches pour appeler de nouvelles interprétations. C’est ce double excès qui rend le commentaire indéfiniment recommençable." }
      ],
      glossary:[
        { term:"archaïque", definition:"Qui appartient à un temps très ancien ou aux commencements." },
        { term:"pléthore", definition:"Une quantité surabondante, un excès." }
      ],
      relatedTexts:[
        { id:"averroes-interpreter-revelation", kind:"proche", label:"Averroès — Pour le philosophe, il y a lieu d’interpréter les textes religieux", relation:"Les deux textes pensent l’interprétation à partir d’un sens qui ne s’épuise pas dans l’énoncé immédiat ; Averroès la règle toutefois par l’accord entre Révélation et démonstration." }
      ],
      paragraphs:[
        "Dans les paroles sans nombre prononcées par les hommes — qu’elles soient raisonnables, insensées, démonstratives ou poétiques — un sens a pris corps qui nous surplombe, conduit notre aveuglement, mais attend dans l’obscurité notre prise de conscience pour venir à jour et se mettre à parler. Nous sommes voués historiquement à l’histoire, à la patiente construction de discours sur les discours, à la tâche d’entendre ce qui a été déjà dit.",
        "Est-il fatal pour autant que nous ne connaissions d’autre usage de la parole que celui du commentaire ? Ce dernier, à vrai dire, interroge le discours sur ce qu’il dit et a voulu dire ; il cherche à faire surgir ce double fond de la parole, où elle se retrouve en une identité à elle-même qu’on suppose plus proche de sa vérité ; il s’agit, en énonçant ce qui a été dit, de redire ce qui n’a jamais été prononcé.",
        "Dans cette activité de commentaire qui cherche à faire passer un discours resserré, ancien et comme silencieux à lui-même dans un autre plus bavard, à la fois plus archaïque et plus contemporain, se cache une étrange attitude à l’égard du langage : commenter, c’est admettre par définition un excès du signifié sur le signifiant, un reste nécessairement non formulé de la pensée que le langage a laissé dans l’ombre, résidu qui en est l’essence elle-même, poussée hors de son secret ; mais commenter suppose aussi que ce non-parlé dort dans la parole, et que, par une surabondance propre au signifiant, on peut, en l’interrogeant, faire parler un contenu qui n’était pas explicitement signifié.",
        "Cette double pléthore, en ouvrant la possibilité du commentaire, nous voue à une tâche infinie que rien ne peut limiter : il y a toujours du signifié qui demeure et auquel il faut encore donner la parole ; quant au signifiant, il est toujours offert en une richesse qui nous interroge malgré tout sur ce qu’il « veut dire ».",
      ]
    },
    {
      id:"averroes-interpreter-revelation", section:"theologie", sections:["philosophie", "theologie"],
      cardMeta:"Moyen Âge · philosophie arabe",
      title:"Pour le philosophe, il y a lieu d’interpréter les textes religieux", author:"Averroès", authorTag:"Averroès",
      cardHighlight:"interpréter les textes religieux",
      authorMeta:"(1126–1198) · philosophe andalou", themes:["Interprétation", "Religion", "Raison"], work:"Livre du discours décisif", publication:"1179, §§ 18–19, 38, trad. M. Geoffroy, GF, 1996, p. 119 et 141",
      description:"Pourquoi la démonstration philosophique conduit-elle parfois à interpréter le sens manifeste du Texte révélé ?",
      context:"Averroès refuse d’opposer la <strong>Révélation</strong> et la <strong>raison</strong> : puisque toutes deux conduisent à la vérité, elles ne peuvent se contredire. Lorsque la démonstration semble contredire le sens obvie du texte religieux, il faut en rechercher le sens lointain.",
      readingQuestions:[
        "Pourquoi la vérité démontrée ne peut-elle pas, selon Averroès, contredire la vérité révélée ?",
        "Dans quelles conditions faut-il interpréter le <strong>sens obvie</strong> d’un énoncé religieux ?",
        "Pourquoi le Texte révélé recourt-il aux symboles et aux <strong>allégories</strong> ?"
      ],
      readingNotes:[
        { type:"analysis", term:"Accord de la raison et de la Révélation", definition:"La « double vérité » distingue la vérité de foi, révélée par le texte sacré, et la vérité de raison, atteinte par l’examen rationnel du monde. Elles ne peuvent pas se contredire : quand le Texte ne se prononce pas, la raison prolonge la parole révélée ; lorsqu’un énoncé paraît obscur ou contraire à une démonstration, le philosophe doit en éclairer le sens lointain. Cette interprétation est réservée à ceux qui maîtrisent la démonstration et ne doit pas être livrée indistinctement à tous." },
        { type:"opposition", left:{ term:"Sens obvie", definition:"Le sens immédiatement manifeste de l’énoncé, accessible à tous." }, right:{ term:"Sens lointain", definition:"Le sens visé par les symboles et les allégories ; il exige une démonstration pour être découvert." }, conclusion:"Le dédoublement du texte ne le rend pas contradictoire : il adapte l’accès à la vérité aux différentes dispositions de ses lecteurs." },
        { type:"definition", term:"Persuasion", definition:"Adhésion obtenue par l’art de convaincre propre à la rhétorique." },
        { type:"definition", term:"Accord", definition:"Adhésion commune qui se forme dans la confrontation dialectique des positions." },
        { type:"definition", term:"Conviction", definition:"Adhésion personnelle et réfléchie, produite par une démonstration que l’esprit comprend activement." },
        { type:"prose", term:"Destinataires du Texte", definition:"Les symboles permettent à ceux qui ne pratiquent pas la démonstration de donner leur assentiment aux vérités révélées par des arguments dialectiques ou rhétoriques, plus accessibles." }
      ],
      glossary:[
        { term:"Texte révélé", definition:"Le Coran, tenu par les musulmans pour la parole transmise à Mahomet par révélation divine." },
        { term:"étant", definition:"Toute chose ou réalité qui existe dans le monde." },
        { term:"sens obvie", definition:"La signification première et immédiatement lisible d’un énoncé." },
        { term:"abscondité", definition:"Caractère de ce qui demeure caché ou difficile à saisir." },
        { term:"démonstration", definition:"Raisonnement rigoureux qui tire une conclusion de principes antérieurs, mieux connus et capables de la fonder." },
        { term:"allégories", definition:"Images ou récits dont le sens concret renvoie à une idée plus abstraite." },
        { term:"assentiment", definition:"Acte par lequel on accepte une proposition comme vraie." },
        { term:"dialectiques", definition:"Arguments qui mettent en discussion des thèses opposées afin d’obtenir un accord." },
        { term:"rhétoriques", definition:"Arguments qui cherchent à entraîner l’adhésion d’un auditoire par l’usage persuasif de la parole." }
      ],
      relatedTexts:[
        { id:"foucault-commentaire-exces-sens", kind:"proche", label:"Michel Foucault — Tout discours dit plus que ce qu’il dit en apparence", relation:"Foucault analyse l’inépuisable travail du commentaire ; Averroès précise, pour le texte religieux, quand et pourquoi l’interprétation devient nécessaire." }
      ],
      paragraphs:[
        "Puisque donc cette Révélation est la vérité, et qu’elle appelle à pratiquer l’examen rationnel qui assure la connaissance de la vérité, alors nous, Musulmans, savons de science certaine que l’examen de ce qui est par la démonstration n’entraînera nulle contradiction avec les enseignements apportés par le Texte révélé : car la vérité ne peut être contraire à la vérité, mais s’accorde avec elle et témoigne en sa faveur.",
        "S’il en est ainsi, et que l’examen démonstratif aboutit à une connaissance quelconque à propos d’un étant quel qu’il soit, alors de deux choses l’une : soit sur cet étant le Texte révélé se tait, soit il énonce une connaissance à son sujet. Dans le premier cas, il n’y a même pas lieu à contradiction. Dans le second, de deux choses l’une : soit le sens obvie de l’énoncé est en accord avec le résultat de la démonstration, soit il le contredit. S’il y a accord, il n’y a rien à en dire ; s’il y a contradiction, alors il faut interpréter le sens obvie.",
        "Les choses qui, en raison de leur abscondité, ne peuvent être connues que par la démonstration, Dieu a fait à Ses serviteurs qui n’ont pas accès à la démonstration, à cause de leurs dispositions innées, ou de leurs habitudes, ou à défaut des conditions qui leur eussent permis cet apprentissage, la grâce de leur en présenter des symboles et des allégories, et de les convier à accorder leur assentiment à ces symboles, car à ceux-ci il est possible d’assentir au moyen des arguments qui sont communs à tous, c’est-à-dire les dialectiques et les rhétoriques.",
        "C’est pour cette raison que le sens du Texte révélé se dédouble en sens obvie et sens lointain : l’obvie, ce sont ces symboles employés pour représenter ces idées ; et le lointain, ce sont ces idées elles-mêmes, qui ne se découvrent qu’aux gens de démonstration."
      ]
    },
    {
      id:"krishnamurti-bonheur-sans-recherche", section:"philosophie",
      cardMeta:"Philosophie de l’Inde",
      title:"Le bonheur vient lorsqu’on cesse de le rechercher", author:"Jiddu Krishnamurti", authorTag:"Krishnamurti",
      cardHighlight:"cesse de le rechercher",
      authorMeta:"(1895–1986) · penseur indien", themes:["Bonheur", "Désir", "Vérité"], work:"Le Sens du bonheur", publication:"trad. C. Joyeux, Stock, 2006, p. 43–44",
      description:"Le bonheur peut-il apparaître tant que nous en faisons l’objet d’un effort et d’une recherche ?",
      context:"Krishnamurti soutient que le <strong>bonheur</strong> ne se conquiert pas comme un but. Il surgit lorsque l’esprit cesse de vouloir devenir autre chose et se libère de la peur.",
      readingQuestions:[
        "Pourquoi la recherche volontaire du <strong>bonheur</strong> risque-t-elle de l’empêcher ?",
        "Quel lien Krishnamurti établit-il entre le <strong>silence de l’esprit</strong>, l’absence de peur et la vérité ?"
      ],
      readingNotes:[
        { type:"concept", badge:false, term:"Un bonheur sans effort", definition:"L’effort suppose un manque et tend l’esprit vers un résultat futur. Le bonheur apparaît au contraire lorsque cette tension cesse et que l’attention devient disponible à ce qui est." },
        { type:"concept", badge:false, term:"Se libérer du devenir", definition:"Ne plus chercher à « devenir quelqu’un » ne signifie pas renoncer à agir, mais cesser de faire dépendre sa valeur et son bonheur d’une identité idéale à atteindre." },
        { type:"plain", definition:"La <u>peur</u> du jugement, de l’échec ou du manque maintient l’esprit dans l’anticipation. Tant qu’elle le domine, il ne peut accueillir pleinement ce qui se présente." }
      ],
      relatedTexts:[
        { id:"alain-bonheur-agir", kind:"proche", label:"Alain — Le vrai bonheur est le bonheur d’agir", relation:"Chez Alain comme chez Krishnamurti, le bonheur se trouve sans être directement recherché ; Alain insiste cependant sur l’action, Krishnamurti sur la fin de l’effort intérieur." },
        { id:"pascal-bonheur-avenir", kind:"proche", label:"Pascal — Espérer le bonheur, c’est ne jamais l’obtenir", relation:"Tous deux montrent que projeter le bonheur dans un état futur nous détourne de sa possibilité présente." },
        { id:"descartes-changer-desirs", kind:"adverse", label:"Descartes — Pour être heureux, il faut changer ses désirs", relation:"Descartes propose un long exercice de maîtrise des désirs ; Krishnamurti se méfie de l’effort même par lequel l’esprit cherche à atteindre le bonheur." }
      ],
      paragraphs:[
        "Le bonheur ne vient pas lorsqu'on le recherche — là est le plus grand secret — mais c'est facile à dire… Je peux expliquer les choses en quelques mots très simples, mais vous contenter de m'écouter et de répéter ce que vous avez entendu ne va pas vous rendre heureux. Le bonheur est étrange, il vient sans qu'on le recherche. Lorsque vous ne faites pas d'efforts pour être heureux, alors, mystérieusement, sans qu'on s'y attende, le bonheur est là […]. La vérité naît lorsque votre esprit et votre cœur sont exempts de toute sensation d'effort et que vous n'essayez pas de devenir quelqu'un ; la vérité est là lorsque l'esprit est très silencieux, qu'il écoute à l'infini tout ce qui se passe. Vous pouvez écouter les mots prononcés ici, mais pour que le bonheur soit, vous devez découvrir comment libérer l'esprit de toute peur. Tant que vous avez peur de quelqu'un ou de quelque chose, le bonheur est exclu. Tant que vous avez peur de vos parents, de l'échec aux examens, peur de ne pas progresser, de ne pas être plus proche du maître, plus près de la vérité, peur du désaveu, du manque de sollicitude — le bonheur est exclu. Mais si vous n'avez vraiment peur de rien, alors vous découvrirez un beau matin au réveil, ou au cours d'une promenade solitaire, que soudain quelque chose d'étrange se produit : sans qu'on l'ait cherché, ni sollicité, ni appelé de ses vœux, ce qu'on peut appeler l'amour, la vérité, le bonheur est là soudain."
      ]
    },
    {
      id:"freud-interpretations-delirantes", section:"philosophie",
      cardMeta:"Psychanalyse",
      title:"Il y a des interprétations délirantes", author:"Sigmund Freud", authorTag:"Freud",
      cardHighlight:"interprétations délirantes",
      authorMeta:"(1856–1939) · fondateur de la psychanalyse", themes:["Interprétation", "Inconscient", "Raison"], work:"Psychopathologie de la vie quotidienne", publication:"1901, trad. S. Jankélévitch, Payot, 1967, p. 292–294",
      description:"L’interprétation devient-elle délirante lorsqu’elle refuse toute place à l’accidentel ?",
      context:"Freud compare l’interprétation <strong>paranoïaque</strong> et l’interprétation psychanalytique. Le paranoïaque perçoit parfois une détermination réelle, mais la projette abusivement sur les autres.",
      readingQuestions:[
        "Pourquoi le paranoïaque accorde-t-il une portée immense à des détails apparemment insignifiants ?",
        "En quel sens Freud peut-il dire que sa vision est plus pénétrante, tout en refusant toute valeur à sa conclusion ?"
      ],
      readingNotes:[
        { type:"definition", term:"Acte manqué", definition:"Geste, oubli ou erreur qui paraît fortuit au sujet conscient, mais dans lequel la psychanalyse reconnaît l’expression détournée d’un désir inconscient." },
        { type:"analysis", term:"Exemples d’actes manqués", definition:"Ils prennent notamment les formes suivantes :", items:["un <strong>lapsus</strong> qui laisse échapper un mot révélateur ;", "un <strong>oubli</strong> significatif, par exemple celui d’un rendez-vous que l’on redoute ;", "la <strong>perte</strong> ou le rangement « introuvable » d’un objet chargé affectivement ;", "une <strong>erreur de lecture, d’écriture ou d’adresse</strong> qui dévie vers une pensée refoulée."] },
        { type:"definition", term:"Névrosé", definition:"Sujet dont le trouble psychique résulte d’un conflit inconscient, sans rupture complète avec la réalité." },
        { type:"analysis", term:"La part juste et l’erreur", definition:"Le paranoïaque pressent que certains actes apparemment accidentels ont un sens inconscient. Son erreur consiste à généraliser cette découverte et à lire chez tous les autres ce qui n’est réel qu’en lui." }
      ],
      glossary:[
        { term:"psychiques", definition:"Relatifs à la vie de l’esprit." },
        { term:"actes manqués", definition:"Actes apparemment involontaires dans lesquels peut s’exprimer un désir inconscient." },
        { term:"névrosé", definition:"Personne affectée par un conflit psychique inconscient sans rupture avec la réalité." }
      ],
      relatedTexts:[
        { id:"foucault-commentaire-exces-sens", kind:"adverse", label:"Foucault — Tout discours dit plus qu’il ne dit en apparence", relation:"Foucault met en lumière l’excès de sens qui rend le commentaire possible ; Freud montre ici le risque d’une interprétation qui transforme tout détail en signe." },
        { id:"freud-bonheur-episodique", kind:"same-author", label:"Freud — Aucun bien ne rend durablement heureux", relation:"Un autre texte de Freud, consacré cette fois aux limites constitutionnelles du bonheur et au conflit entre plaisir et réalité." }
      ],
      paragraphs:[
        "Les paranoïaques présentent dans leur attitude ce trait frappant et généralement connu, qu'ils attachent la plus grande importance aux détails les plus insignifiants, échappant généralement aux hommes normaux, qu'ils observent dans la conduite des autres ; ils interprètent ces détails et en tirent des conclusions d'une vaste portée. Le dernier paranoïaque que j'ai vu, par exemple, a conclu à l'existence d'un complot dans son entourage, car lors de son départ de la gare des gens ont fait un certain mouvement de la main. Un autre a noté la manière dont les gens marchent dans la rue, font des moulinets avec leur canne, etc.",
        "Alors que l'homme normal admet une catégorie d'actes accidentels n'ayant pas besoin de motivation, catégorie dans laquelle il range une partie de ses propres manifestations psychiques et actes manqués, le paranoïaque refuse aux manifestations psychiques d'autrui tout élément accidentel. Tout ce qu'il observe sur les autres est significatif, donc susceptible d'interprétation.",
        "D'où lui vient cette manière de voir ? Ici, comme dans beaucoup d'autres cas analogues, il projette probablement dans la vie psychique d'autrui ce qui existe dans sa propre vie à l'état inconscient. Tant de choses se pressent dans la conscience du paranoïaque qui, chez l'homme normal et chez le névrosé, n'existent que dans l'inconscient, où leur présence est révélée par la psychanalyse.",
        "Sur ce point, le paranoïaque a donc, dans une certaine mesure, raison : il voit quelque chose qui échappe à l'homme normal, sa vision est plus pénétrante que celle de la pensée normale ; mais ce qui enlève à sa connaissance toute valeur, c'est l'extension à d'autres de l'état de choses qui n'est réel qu'en ce qui le concerne lui-même."
      ]
    },
    {
      id:"aristote-amour-amitie-veritable", section:"philosophie",
      cardMeta:"Antiquité grecque",
      title:"De l’amour à l’amitié véritable", author:"Aristote", authorTag:"Aristote",
      cardHighlight:"l’amitié véritable",
      authorMeta:"(384–322 av. J.-C.)", themes:["Amour", "Autrui", "Bonheur", "Devoir"], work:"Éthique à Nicomaque", publication:"livres VIII et IX, trad. Jules Tricot, Vrin",
      description:"Comment l’intensité de l’amour et la bienveillance peuvent-elles conduire à une amitié véritable ?",
      readingNotes:[
        { type:"analysis", term:"1. Une relation rare et singulière", definition:"L’amour est un excès dirigé vers une seule personne, tandis que l’amitié parfaite ne peut s’étendre à une multitude. Elle demande du temps, une expérience partagée et une véritable intimité." },
        { type:"analysis", term:"2. Aimer l’autre pour lui-même", definition:"L’ami véritable souhaite le bien de l’autre sans rechercher d’abord un plaisir, un service ou un avantage personnel. L’amitié d’utilité reste intéressée ; l’amitié de plaisir est plus proche de l’amitié véritable, mais demeure liée à une satisfaction qui peut disparaître." },
        { type:"analysis", term:"3. Transformer la bienveillance en engagement", definition:"La bienveillance n’est encore qu’une « amitié paresseuse » lorsqu’elle se contente de souhaiter du bien. Elle devient amitié véritable lorsque l’on accepte d’agir, de seconder l’autre, de prendre soin de lui et de se donner du tracas à son sujet." },
        { type:"analysis", term:"4. Les qualités de l’ami véritable", definition:"Il se caractérise par :", items:["la <strong>réciprocité</strong> et la joie mutuelle ;", "la <strong>générosité</strong> et le désintéressement ;", "la <strong>fidélité dans le temps</strong> ;", "la <strong>présence concrète</strong> et la volonté d’agir pour le bien de l’autre."] }
      ],
      parts:[
        {
          context:"Aristote distingue l’<strong>amitié parfaite</strong>, fondée sur la qualité morale des amis, des liens recherchés pour le plaisir ou l’utilité. L’amour se caractérise ici par son intensité et son exclusivité.",
          readingQuestions:[
            "Pourquoi l’amitié parfaite exige-t-elle du temps, de l’expérience et une véritable intimité ?",
            "En quoi les amitiés de plaisir et d’utilité se distinguent-elles de l’amour porté à une personne singulière ?"
          ],
          paragraphs:[
            "On ne peut pas être un ami pour plusieurs personnes, dans l’amitié parfaite, pas plus qu’on ne peut être amoureux de plusieurs personnes en même temps (car l’amour est une sorte d’excès, et un état de ce genre n’est naturellement ressenti qu’envers un seul) ; et peut-être même n’est-il pas aisé de trouver un grand nombre de gens de bien. On doit aussi acquérir quelque expérience de son ami et entrer dans son intimité, ce qui est d’une extrême difficulté. Par contre, si on recherche l’utilité ou le plaisir, il est possible de plaire à beaucoup de personnes, car nombreux sont les gens de cette sorte, et les services qu’on en reçoit ne se font pas attendre longtemps. De ces deux dernières formes d’amitié celle qui repose sur le plaisir ressemble davantage à la véritable amitié, quand les deux parties retirent à la fois les mêmes satisfactions l’une de l’autre et qu’elles ressentent une joie mutuelle ou se plaisent aux mêmes choses : telles sont les amitiés entre jeunes gens, car il y a en elles plus de générosité ; au contraire, l’amitié basée sur l’utilité est celle d’âmes mercantiles."
          ],
          work:"Éthique à Nicomaque",
          publication:"livre VIII, 7, 1158a10–1158a, trad. Jules Tricot, Vrin, 1994, p. 398–399"
        },
        {
          context:"La <strong>bienveillance</strong> est une disposition favorable, mais encore inactive. Elle ne devient amitié véritable qu’avec le temps, l’intimité et l’engagement concret envers l’autre.",
          readingQuestions:[
            "Pourquoi la bienveillance n’est-elle encore qu’une « amitié paresseuse » ?",
            "Comment distinguer le souhait véritable du bien d’autrui d’une sollicitude intéressée ?"
          ],
          paragraphs:[
            "La bienveillance semble […] un commencement d'amitié, tout comme le plaisir causé par la vue de l'être aimé est le commencement de l'amour : nul en effet n'est amoureux sans avoir été auparavant charmé par l'extérieur de la personne aimée, mais celui qui éprouve du plaisir à l'aspect d'un autre n'est pas pour autant amoureux, mais c'est seulement quand on regrette son absence et qu'on désire passionnément sa présence. Ainsi également, il n'est pas possible d'être amis sans avoir d'abord éprouvé de la bienveillance l'un pour l'autre, tandis que les gens bienveillants ne sont pas pour autant liés d'amitié : car ils se contentent de souhaiter du bien à ceux qui sont l'objet de leur bienveillance, et ne voudraient les seconder en rien ni se donner du tracas à leur sujet. Aussi pourrait-on dire, en étendant le sens du terme amitié, que la bienveillance est une amitié paresseuse, mais avec le temps et une fois parvenue à une certaine intimité, elle devient amitié, « amitié véritable », et non pas cette sorte d'amitié basée sur l'utilité ou le plaisir, car la bienveillance non plus ne prend pas naissance sur ces bases. L'homme qui, en effet, a reçu un bienfait, et qui, en échange des faveurs dont il a été gratifié, répond par de la bienveillance, ne fait là que ce qui est juste, et d'autre part, celui qui souhaite la prospérité d'autrui dans l'espoir d'en tirer amplement profit, paraît bien avoir de la bienveillance, non pas pour cet autre, mais plutôt pour lui-même, pas plus qu'on n'est ami de quelqu'un si les soins dont on l'entoure s'expliquent par quelque motif intéressé."
          ],
          work:"Éthique à Nicomaque",
          publication:"livre IX, 5, 1167a3–1167a18, trad. Jules Tricot, Vrin, p. 448–449"
        }
      ]
    },
    {
      id:"genese-naissance-du-monde", section:"theologie",
      cardMeta:"Récit biblique",
      title:"La naissance du monde", author:"Livre de la Genèse", authorTag:"Genèse",
      cardHighlight:"la naissance du monde",
      authorMeta:"Bible hébraïque · Pentateuque",
      themes:["Nature", "Religion", "Autrui"], work:"Genèse", publication:"1.1–2.4 et 2.7–25",
      description:"Que signifient les deux récits de la création du monde et de l’être humain placés au commencement de la Genèse ?",
      context:"Le début de la Genèse ne cherche pas à remplacer l’explication scientifique de la naissance des astres, des plantes, des animaux et des hommes. À travers des images conformes aux représentations de son époque et une <strong>poésie liturgique</strong>, il interroge le sens de l’univers et de l’existence humaine : d’où viennent-ils, vers quoi vont-ils et pourquoi existent-ils ? La Parole de Dieu suscite et ordonne le monde ; Dieu en est le cœur et en rend l’existence intelligible.",
      readingQuestions:[
        "Comment la <strong>Parole de Dieu</strong> fait-elle passer le monde de l’informe à un ordre différencié ?",
        "Pourquoi le premier récit répartit-il la Création dans le cadre symbolique d’une semaine ?",
        "Que dit le second récit de la double condition humaine, à la fois issue de la terre et animée par le souffle de Dieu ?",
        "Pourquoi la création de la femme répond-elle à l’impossibilité, pour l’être humain, de vivre seul ?"
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"La science", definition:"Elle cherche à expliquer à partir de quoi et comment sont apparus les astres, les plantes, les animaux et les êtres humains." }, right:{ term:"Le récit de la Genèse", definition:"Il demande pourquoi l’univers et l’humanité existent, vers quoi ils vont et quel sens possède leur histoire." }, conclusion:"L’introduction de l’édition distingue ainsi l’explication des phénomènes et l’interrogation sur leur sens." },
        { type:"concept", term:"Une poésie liturgique", definition:"Le premier récit ne prétend pas rapporter scientifiquement le déroulement matériel de la Création. Sa forme rythmée — parole, accomplissement, jugement de bonté, soir et matin — exprime symboliquement que le monde vient de Dieu et reçoit de lui son ordre." },
        { type:"concept", term:"Le cadre symbolique de la semaine", definition:"Les six jours déploient progressivement le tableau du monde ; le septième, béni et rendu sacré, consacre l’achèvement de l’œuvre créatrice et le repos de Dieu." },
      ],
      readingBlocks:[
        { type:"heading", text:"Premier récit — la Création en sept jours" },
        { type:"verse", marker:"GENÈSE 1.1", aria:"Genèse 1, verset 1", text:"Au commencement, Dieu créa le ciel et la terre." },
        { type:"verse", marker:"2", aria:"Genèse 1, verset 2", text:"La terre était informe et vide, les ténèbres étaient au-dessus de l’abîme et le souffle de Dieu planait au-dessus des eaux." },
        { type:"verse", marker:"3", aria:"Genèse 1, verset 3", text:"Dieu dit : « Que la lumière soit. » Et la lumière fut." },
        { type:"verse", marker:"4", aria:"Genèse 1, verset 4", text:"Dieu vit que la lumière était bonne, et Dieu sépara la lumière des ténèbres." },
        { type:"verse", marker:"5", aria:"Genèse 1, verset 5", text:"Dieu appela la lumière : « jour », il appela les ténèbres : « nuit ». Il y eut un soir, il y eut un matin : ce fut le premier jour." },
        { type:"verse", marker:"6", aria:"Genèse 1, verset 6", text:"Et Dieu dit : « Qu’il y ait un firmament au milieu des eaux, et qu’il sépare les eaux. »" },
        { type:"verse", marker:"7", aria:"Genèse 1, verset 7", text:"Dieu fit le firmament, il sépara les eaux qui sont au-dessous du firmament et les eaux qui sont au-dessus. Et ce fut ainsi." },
        { type:"verse", marker:"8", aria:"Genèse 1, verset 8", text:"Dieu appela le firmament : « ciel ». Il y eut un soir, il y eut un matin : ce fut le deuxième jour." },
        { type:"verse", marker:"9", aria:"Genèse 1, verset 9", text:"Et Dieu dit : « Les eaux qui sont au-dessous du ciel, qu’elles se rassemblent en un seul lieu, et que paraisse la terre ferme. » Et ce fut ainsi." },
        { type:"verse", marker:"10", aria:"Genèse 1, verset 10", text:"Dieu appela la terre ferme : « terre », et il appela la masse des eaux : « mer ». Et Dieu vit que cela était bon." },
        { type:"verse", marker:"11", aria:"Genèse 1, verset 11", text:"Dieu dit : « Que la terre produise l’herbe, la plante qui porte sa semence, et l’arbre à fruit qui donne, selon son espèce, le fruit qui porte sa semence. » Et ce fut ainsi." },
        { type:"verse", marker:"12", aria:"Genèse 1, verset 12", text:"La terre produisit l’herbe, la plante qui porte sa semence, selon son espèce, et l’arbre qui donne, selon son espèce, le fruit qui porte sa semence. Et Dieu vit que cela était bon." },
        { type:"verse", marker:"13", aria:"Genèse 1, verset 13", text:"Il y eut un soir, il y eut un matin : ce fut le troisième jour." },
        { type:"verse", marker:"14", aria:"Genèse 1, verset 14", text:"Et Dieu dit : « Qu’il y ait des luminaires au firmament du ciel, pour séparer le jour de la nuit ; qu’ils servent de signes pour marquer les fêtes, les jours et les années ;" },
        { type:"verse", marker:"15", aria:"Genèse 1, verset 15", text:"et qu’ils soient, au firmament du ciel, des luminaires pour éclairer la terre. » Et ce fut ainsi." },
        { type:"verse", marker:"16", aria:"Genèse 1, verset 16", text:"Dieu fit les deux grands luminaires : le plus grand pour régner sur le jour, le plus petit pour régner sur la nuit ; il fit aussi les étoiles." },
        { type:"verse", marker:"17", aria:"Genèse 1, verset 17", text:"Dieu les plaça au firmament du ciel pour éclairer la terre," },
        { type:"verse", marker:"18", aria:"Genèse 1, verset 18", text:"pour régner sur le jour et sur la nuit, pour séparer la lumière des ténèbres. Et Dieu vit que cela était bon." },
        { type:"verse", marker:"19", aria:"Genèse 1, verset 19", text:"Il y eut un soir, il y eut un matin : ce fut le quatrième jour." },
        { type:"verse", marker:"20", aria:"Genèse 1, verset 20", text:"Et Dieu dit : « Que les eaux foisonnent d’une profusion d’êtres vivants, et que les oiseaux volent au-dessus de la terre, sous le firmament du ciel. »" },
        { type:"verse", marker:"21", aria:"Genèse 1, verset 21", text:"Dieu créa, selon leur espèce, les grands monstres marins, tous les êtres vivants qui vont et viennent et qui foisonnent dans les eaux, et aussi, selon leur espèce, tous les oiseaux qui volent. Et Dieu vit que cela était bon." },
        { type:"verse", marker:"22", aria:"Genèse 1, verset 22", text:"Dieu les bénit par ces paroles : « Soyez féconds et multipliez-vous, remplissez les mers, que les oiseaux se multiplient sur la terre. »" },
        { type:"verse", marker:"23", aria:"Genèse 1, verset 23", text:"Il y eut un soir, il y eut un matin : ce fut le cinquième jour." },
        { type:"verse", marker:"24", aria:"Genèse 1, verset 24", text:"Et Dieu dit : « Que la terre produise des êtres vivants selon leur espèce, bestiaux, bestioles et bêtes sauvages selon leur espèce. » Et ce fut ainsi." },
        { type:"verse", marker:"25", aria:"Genèse 1, verset 25", text:"Dieu fit les bêtes sauvages selon leur espèce, les bestiaux selon leur espèce, et toutes les bestioles de la terre selon leur espèce. Et Dieu vit que cela était bon." },
        { type:"verse", marker:"26", aria:"Genèse 1, verset 26", text:"Dieu dit : « Faisons l’homme à notre image, selon notre ressemblance. Qu’il soit le maître des poissons de la mer, des oiseaux du ciel, des bestiaux, de toutes les bêtes sauvages, et de toutes les bestioles qui vont et viennent sur la terre. »" },
        { type:"verse", marker:"27", aria:"Genèse 1, verset 27", text:"Dieu créa l’homme à son image, à l’image de Dieu il le créa, il les créa homme et femme." },
        { type:"pause", reference:"PSAUME 8", title:"La dignité du mortel", text:"Qu’est-donc un mortel pour que tu t’en souviennes, et un fils d’homme pour que tu le visites ?" },
        { type:"verse", marker:"28", aria:"Genèse 1, verset 28", text:"Dieu les bénit et leur dit : « Soyez féconds et multipliez-vous, remplissez la terre et soumettez-la. Soyez les maîtres des poissons de la mer, des oiseaux du ciel, et de tous les animaux qui vont et viennent sur la terre. »" },
        { type:"verse", marker:"29", aria:"Genèse 1, verset 29", text:"Dieu dit encore : « Je vous donne toute plante qui porte sa semence sur toute la surface de la terre, et tout arbre dont le fruit porte sa semence : telle sera votre nourriture." },
        { type:"verse", marker:"30", aria:"Genèse 1, verset 30", text:"Aux bêtes sauvages, aux oiseaux du ciel, à tout ce qui va et vient sur la terre et qui a souffle de vie, je donne comme nourriture toute herbe verte. » Et ce fut ainsi." },
        { type:"verse", marker:"31", aria:"Genèse 1, verset 31", text:"Et Dieu vit tout ce qu’il avait fait : c’était très bon. Il y eut un soir, il y eut un matin : ce fut le sixième jour." },
        { type:"divider" },
        { type:"verse", marker:"GENÈSE 2.1", aria:"Genèse 2, verset 1", text:"Ainsi furent achevés le ciel et la terre, et tout leur déploiement." },
        { type:"verse", marker:"2", aria:"Genèse 2, verset 2", text:"Le septième jour, Dieu avait achevé l’œuvre qu’il avait faite. Il se reposa, le septième jour, de toute l’œuvre qu’il avait faite." },
        { type:"verse", marker:"3", aria:"Genèse 2, verset 3", text:"Et Dieu bénit le septième jour : il en fit un jour sacré parce que, ce jour-là, il s’était reposé de toute l’œuvre de création qu’il avait faite." },
        { type:"verse", marker:"4", aria:"Genèse 2, verset 4", text:"Telle fut l’origine du ciel et de la terre lorsqu’ils furent créés." },
        { type:"heading", text:"Second récit — la création de l’être humain" },
        { type:"verse", marker:"GENÈSE 2.7", aria:"Genèse 2, verset 7", text:"Alors le Seigneur Dieu modela l’homme avec la poussière tirée du sol ; il insuffla dans ses narines le souffle de vie, et l’homme devint un être vivant." },
        { type:"pause", reference:"PSAUME 138", title:"L’être humain, œuvre merveilleuse", text:"Je te célébrerai pour tes terribles merveilles ; merveilles, que tes œuvres ! Mon âme, tu la connaissais bien." },
        { type:"pause", reference:"PSAUME 103", title:"Poussière et grâce", text:"Yahvé sait, lui, de quoi nous sommes formés, il se souvient que nous sommes poussière. Mais la grâce de Yahvé dure d’éternité en éternité pour ceux qui le craignent…" },
        { type:"verse", marker:"8", aria:"Genèse 2, verset 8", text:"Le Seigneur Dieu planta un jardin en Éden, à l’orient, et y plaça l’homme qu’il avait modelé." },
        { type:"verse", marker:"9", aria:"Genèse 2, verset 9", text:"Le Seigneur Dieu fit pousser du sol toute sorte d’arbres à l’aspect attirant et aux fruits savoureux ; il y avait aussi l’arbre de vie au milieu du jardin, et l’arbre de la connaissance du bien et du mal." },
        { type:"omission", text:"[…]" },
        { type:"verse", marker:"15", aria:"Genèse 2, verset 15", text:"Le Seigneur Dieu prit l’homme et le conduisit dans le jardin de l’Éden pour qu’il le travaille et le garde." },
        { type:"verse", marker:"16", aria:"Genèse 2, verset 16", text:"Le Seigneur Dieu fit à l’homme cette interdiction : « Tu peux manger les fruits de tous les arbres du jardin ;" },
        { type:"verse", marker:"17", aria:"Genèse 2, verset 17", text:"mais quant à l’arbre de la connaissance du bien et du mal, tu n’en mangeras pas ; car, le jour où tu en mangeras, tu seras condamné à mourir. »" },
        { type:"verse", marker:"18", aria:"Genèse 2, verset 18", text:"Le Seigneur Dieu dit : « Il n’est pas bon que l’homme soit seul. Je vais lui faire une aide qui lui correspondra. »" },
        { type:"verse", marker:"19", aria:"Genèse 2, verset 19", text:"Avec de la terre, le Seigneur Dieu façonna toutes les bêtes des champs et tous les oiseaux du ciel, et il les amena vers l’homme pour voir quels noms il leur donnerait. C’étaient des êtres vivants, et l’homme donna un nom à chacun." },
        { type:"verse", marker:"20", aria:"Genèse 2, verset 20", text:"L’homme donna donc leurs noms à tous les animaux, aux oiseaux du ciel et à toutes les bêtes des champs. Mais il ne trouva aucune aide qui lui corresponde." },
        { type:"verse", marker:"21", aria:"Genèse 2, verset 21", text:"Alors le Seigneur Dieu fit tomber sur lui un sommeil mystérieux, et l’homme s’endormit. Le Seigneur Dieu prit de la chair dans son côté, puis il referma." },
        { type:"verse", marker:"22", aria:"Genèse 2, verset 22", text:"Avec ce qu’il avait pris à l’homme, il forma une femme et il l’amena vers l’homme." },
        { type:"verse", marker:"23", aria:"Genèse 2, verset 23", text:"L’homme dit alors : « Cette fois-ci, voilà l’os de mes os et la chair de ma chair ! on l’appellera : ‘femme’. »" },
        { type:"verse", marker:"24", aria:"Genèse 2, verset 24", text:"À cause de cela, l’homme quittera son père et sa mère, il s’attachera à sa femme, et tous deux ne feront plus qu’un." },
        { type:"pause", reference:"MATTHIEU 19", title:"La reprise par le Christ", intro:"Le Christ, un jour, reprendra le texte de la Genèse :", text:"N’avez-vous pas lu que le Créateur, au commencement, homme et femme il les fit et qu’il dit : À cause de cela, l’homme quittera père et mère, et il s’attachera à sa femme, et les deux ne seront qu’une seule chair. Ainsi donc, ils ne sont plus deux mais une seule chair. Et bien ! ce que Dieu a uni, que l’homme ne le sépare pas." },
        { type:"verse", marker:"25", aria:"Genèse 2, verset 25", text:"Tous les deux, l’homme et sa femme, étaient nus, et ils n’en éprouvaient aucune honte l’un devant l’autre." },
      ],
      paragraphs:[
        "<strong>Premier récit — la Création en sept jours</strong>",
        "Au commencement, Dieu créa le ciel et la terre. La terre était informe et vide, les ténèbres étaient au-dessus de l’abîme et le souffle de Dieu planait au-dessus des eaux. Dieu dit : « Que la lumière soit. » Et la lumière fut. Dieu vit que la lumière était bonne, et Dieu sépara la lumière des ténèbres. Dieu appela la lumière : « jour », il appela les ténèbres : « nuit ». Il y eut un soir, il y eut un matin : ce fut le premier jour.",
        "Et Dieu dit : « Qu’il y ait un firmament au milieu des eaux, et qu’il sépare les eaux. » Dieu fit le firmament, il sépara les eaux qui sont au-dessous du firmament et les eaux qui sont au-dessus. Et ce fut ainsi. Dieu appela le firmament : « ciel ». Il y eut un soir, il y eut un matin : ce fut le deuxième jour.",
        "Et Dieu dit : « Les eaux qui sont au-dessous du ciel, qu’elles se rassemblent en un seul lieu, et que paraisse la terre ferme. » Et ce fut ainsi. Dieu appela la terre ferme : « terre », et il appela la masse des eaux : « mer ». Et Dieu vit que cela était bon.",
        "Dieu dit : « Que la terre produise l’herbe, la plante qui porte sa semence, et l’arbre à fruit qui donne, selon son espèce, le fruit qui porte sa semence. » Et ce fut ainsi. La terre produisit l’herbe, la plante qui porte sa semence, selon son espèce, et l’arbre qui donne, selon son espèce, le fruit qui porte sa semence. Et Dieu vit que cela était bon. Il y eut un soir, il y eut un matin : ce fut le troisième jour.",
        "Et Dieu dit : « Qu’il y ait des luminaires au firmament du ciel, pour séparer le jour de la nuit ; qu’ils servent de signes pour marquer les fêtes, les jours et les années ; et qu’ils soient, au firmament du ciel, des luminaires pour éclairer la terre. » Et ce fut ainsi. Dieu fit les deux grands luminaires : le plus grand pour régner sur le jour, le plus petit pour régner sur la nuit ; il fit aussi les étoiles. Dieu les plaça au firmament du ciel pour éclairer la terre, pour régner sur le jour et sur la nuit, pour séparer la lumière des ténèbres. Et Dieu vit que cela était bon. Il y eut un soir, il y eut un matin : ce fut le quatrième jour.",
        "Et Dieu dit : « Que les eaux foisonnent d’une profusion d’êtres vivants, et que les oiseaux volent au-dessus de la terre, sous le firmament du ciel. » Dieu créa, selon leur espèce, les grands monstres marins, tous les êtres vivants qui vont et viennent et qui foisonnent dans les eaux, et aussi, selon leur espèce, tous les oiseaux qui volent. Et Dieu vit que cela était bon. Dieu les bénit par ces paroles : « Soyez féconds et multipliez-vous, remplissez les mers, que les oiseaux se multiplient sur la terre. » Il y eut un soir, il y eut un matin : ce fut le cinquième jour.",
        "Et Dieu dit : « Que la terre produise des êtres vivants selon leur espèce, bestiaux, bestioles et bêtes sauvages selon leur espèce. » Et ce fut ainsi. Dieu fit les bêtes sauvages selon leur espèce, les bestiaux selon leur espèce, et toutes les bestioles de la terre selon leur espèce. Et Dieu vit que cela était bon.",
        "Dieu dit : « Faisons l’homme à notre image, selon notre ressemblance. Qu’il soit le maître des poissons de la mer, des oiseaux du ciel, des bestiaux, de toutes les bêtes sauvages, et de toutes les bestioles qui vont et viennent sur la terre. » Dieu créa l’homme à son image, à l’image de Dieu il le créa, il les créa homme et femme.",
        "Dieu les bénit et leur dit : « Soyez féconds et multipliez-vous, remplissez la terre et soumettez-la. Soyez les maîtres des poissons de la mer, des oiseaux du ciel, et de tous les animaux qui vont et viennent sur la terre. » Dieu dit encore : « Je vous donne toute plante qui porte sa semence sur toute la surface de la terre, et tout arbre dont le fruit porte sa semence : telle sera votre nourriture. Aux bêtes sauvages, aux oiseaux du ciel, à tout ce qui va et vient sur la terre et qui a souffle de vie, je donne comme nourriture toute herbe verte. » Et ce fut ainsi. Et Dieu vit tout ce qu’il avait fait : c’était très bon. Il y eut un soir, il y eut un matin : ce fut le sixième jour.",
        "Ainsi furent achevés le ciel et la terre, et tout leur déploiement. Le septième jour, Dieu avait achevé l’œuvre qu’il avait faite. Il se reposa, le septième jour, de toute l’œuvre qu’il avait faite. Et Dieu bénit le septième jour : il en fit un jour sacré parce que, ce jour-là, il s’était reposé de toute l’œuvre de création qu’il avait faite. Telle fut l’origine du ciel et de la terre lorsqu’ils furent créés.",
        "<strong>Second récit — la création de l’être humain</strong>",
        "Alors le Seigneur Dieu modela l’homme avec la poussière tirée du sol ; il insuffla dans ses narines le souffle de vie, et l’homme devint un être vivant. Le Seigneur Dieu planta un jardin en Éden, à l’orient, et y plaça l’homme qu’il avait modelé. Le Seigneur Dieu fit pousser du sol toute sorte d’arbres à l’aspect attirant et aux fruits savoureux ; il y avait aussi l’arbre de vie au milieu du jardin, et l’arbre de la connaissance du bien et du mal.",
        "Le Seigneur Dieu prit l’homme et le conduisit dans le jardin de l’Éden pour qu’il le travaille et le garde. Le Seigneur Dieu fit à l’homme cette interdiction : « Tu peux manger les fruits de tous les arbres du jardin ; mais quant à l’arbre de la connaissance du bien et du mal, tu n’en mangeras pas ; car, le jour où tu en mangeras, tu seras condamné à mourir. »",
        "Le Seigneur Dieu dit : « Il n’est pas bon que l’homme soit seul. Je vais lui faire une aide qui lui correspondra. » Avec de la terre, le Seigneur Dieu façonna toutes les bêtes des champs et tous les oiseaux du ciel, et il les amena vers l’homme pour voir quels noms il leur donnerait. C’étaient des êtres vivants, et l’homme donna un nom à chacun. L’homme donna donc leurs noms à tous les animaux, aux oiseaux du ciel et à toutes les bêtes des champs. Mais il ne trouva aucune aide qui lui corresponde.",
        "Alors le Seigneur Dieu fit tomber sur lui un sommeil mystérieux, et l’homme s’endormit. Le Seigneur Dieu prit de la chair dans son côté, puis il referma. Avec ce qu’il avait pris à l’homme, il forma une femme et il l’amena vers l’homme. L’homme dit alors : « Cette fois-ci, voilà l’os de mes os et la chair de ma chair ! on l’appellera : ‘femme’. »",
        "À cause de cela, l’homme quittera son père et sa mère, il s’attachera à sa femme, et tous deux ne feront plus qu’un.",
        "Tous les deux, l’homme et sa femme, étaient nus, et ils n’en éprouvaient aucune honte l’un devant l’autre."
      ]
    },
    {
      id:"kant-desir-raison-imagination", section:"philosophie",
      cardMeta:"Philosophie critique",
      title:"Le désir naît de la raison et de l’imagination", author:"Emmanuel Kant", authorTag:"Kant",
      cardHighlight:"raison et de l’imagination", cardHeight:"compact",
      authorMeta:"(1724–1804) · philosophie critique", themes:["Désir", "Nature"], work:"Conjectures sur les débuts de l’histoire humaine", publication:"1786, dans <em>Opuscules sur l’histoire</em>, trad. S. Piobetta, G.F., 1990, p. 151",
      description:"Comment la raison transforme-t-elle les besoins naturels en désirs toujours plus nombreux ?",
      context:"Kant montre comment la <strong>raison</strong>, soutenue par l’<strong>imagination</strong>, libère l’être humain de la conduite toute tracée par l’instinct. Cette émancipation multiplie les désirs, transforme l’attirance en amour, fait naître le goût du beau et ouvre la conscience à l’avenir.",
      readingQuestions:[
        "En quoi un désir fabriqué par l’imagination se distingue-t-il d’un besoin naturel ?",
        "Pourquoi la multiplication des désirs est-elle à la fois une libération et un risque ?",
        "Comment l’absence de l’objet peut-elle intensifier le désir au lieu de l’éteindre ?",
        "Quel rôle le refus et la pudeur jouent-ils dans le passage de l’attirance à l’amour ?",
        "Pourquoi la capacité d’anticiper l’avenir constitue-t-elle, selon Kant, un progrès de la raison ?"
      ],
      glossary:[
        { term:"fondements", definition:"Ici, le mot désigne les raisons qui justifieraient l’existence d’un désir. Il ne faut pas le confondre avec son origine, c’est-à-dire la manière dont ce désir apparaît." },
        { term:"instinct", definition:"Mode de conduite largement inné qui adapte l’animal à son milieu et l’oriente directement vers la satisfaction de ses besoins." },
        { term:"désirs artificiels", definition:"Désirs produits par la raison et l’imagination plutôt que dictés par une nécessité biologique immédiate." },
        { term:"feuille de figuier", definition:"Allusion à Adam et Ève dans la Genèse (3,7) : prenant conscience de leur nudité, ils se couvrent. Kant donne à cet épisode une interprétation philosophique." },
        { term:"excitations idéales", definition:"Désirs dont l’objet est représenté par l’esprit : sa signification et la valeur qu’on lui prête comptent davantage que sa présence sensible." },
        { term:"attente réfléchie", definition:"Capacité de rendre présent par la pensée un avenir parfois lointain et d’orienter sa conduite en fonction de lui." }
      ],
      readingNotes:[
        { type:"opposition", left:{ term:"Besoin", definition:"Nécessité vitale qui appelle une satisfaction déterminée et immédiate." }, right:{ term:"Désir", definition:"Élan façonné par des représentations : l’être humain peut inventer son objet, le différer et lui attribuer une valeur." }, conclusion:"Le besoin renvoie d’abord à la conservation ; le désir ouvre un champ potentiellement sans limite." },
        { type:"opposition", left:{ term:"Rapport immédiat", definition:"L’objet présent déclenche directement l’impulsion et sa consommation conduit à la satiété." }, right:{ term:"Rapport médiatisé", definition:"L’imagination place une représentation entre l’impulsion et son objet ; l’absence peut alors entretenir le désir." }, conclusion:"Chez Kant, la distance n’affaiblit pas nécessairement l’inclination : elle peut la rendre plus durable." },
        { type:"opposition", left:{ term:"Objet réel", definition:"Il existe indépendamment du sujet et peut être perçu ou consommé." }, right:{ term:"Objet idéalisé", definition:"Il est investi de significations, de promesses et de valeurs produites par le sujet." }, conclusion:"On ne désire donc jamais seulement une chose : on désire aussi ce que l’on imagine à travers elle." },
        { type:"analysis", term:"Le mouvement du texte", definition:"Kant décrit trois progrès successifs de la raison.", items:["Elle déborde l’instinct et rend possibles des choix nombreux.", "Elle soustrait l’objet aux sens : le refus, la pudeur et l’imagination transforment l’impulsion en amour puis en goût du beau.", "Elle permet d’anticiper un avenir lointain et de régler le présent sur ce qui n’existe pas encore."] },
        { type:"analysis", term:"Le paradoxe central", definition:"La raison rend l’être humain plus libre en l’affranchissant de l’instinct, mais cette liberté fait également proliférer des penchants superflus. Le progrès n’est donc pas présenté comme un bonheur simple : il agrandit à la fois notre autonomie et notre insatisfaction." },
        { type:"concept", term:"Du désir à l’amour", definition:"Le refus introduit une distance. L’autre n’est plus seulement l’objet présent d’une impulsion : il peut être imaginé, attendu et admiré. C’est ce déplacement qui prépare, dans le raisonnement de Kant, l’amour et le sentiment du beau." }
      ],
      relatedTexts:[
        { id:"platon-mythe-androgyne-desir", kind:"proche", label:"Platon, Aristophane — Le désir amoureux poursuit l’unité perdue", relation:"Chez Aristophane comme chez Kant, l’absence nourrit le désir ; le premier l’explique par une séparation originelle, le second par le travail de la raison et de l’imagination." },
        { id:"rousseau-desir-imagination-bonheur", kind:"proche", label:"Rousseau — Le bonheur se nourrit de ce que nous espérons", relation:"Rousseau rejoint Kant sur le pouvoir de l’imagination : l’objet absent et représenté peut susciter davantage de plaisir que l’objet réellement possédé." },
        { id:"platon-callicles-desirs", kind:"proche", label:"Platon — Les désirs ne doivent pas être sans mesure", relation:"Kant comme Platon interroge la multiplication des désirs ; Kant en explique la source dans la raison et l’imagination." },
        { id:"epicure-plaisir-vie-heureuse", kind:"adverse", label:"Épicure — Hiérarchiser ses désirs pour vivre heureux", relation:"Épicure cherche à limiter les désirs vains ; Kant décrit le pouvoir humain de les créer et de les étendre indéfiniment." },
        { id:"kant-quietude-inaccessible", kind:"proche", label:"Kant — La quiétude est inaccessible à l’homme", relation:"Les deux textes montrent que l’être humain ne demeure pas dans un état de repos : ses facultés et ses désirs le portent au-delà de la simple satisfaction." }
      ],
      paragraphs:[
        "Une propriété de la raison consiste à pouvoir, avec l’appui de l’imagination, créer artificiellement des désirs, non seulement sans fondements établis sur un instinct naturel, mais même en opposition avec lui ; ces désirs, au début, favorisent peu à peu l’éclosion de tout un essaim de penchants superflus et, qui plus est, contraires à la nature, sous l’appellation de « sensualité ». […] Le fait de s’être rendu compte que sa raison avait le pouvoir de franchir les bornes dans lesquelles sont maintenus tous les animaux fut, chez l’homme, capital et décisif pour la conduite de sa vie. […] Il découvrit en lui un pouvoir de se choisir à lui-même sa propre conduite, et de ne pas être lié comme les autres animaux à une conduite unique. […] En dehors des objets de son désir que l’instinct jusque-là lui avait indiqués, une infinité d’autres lui étaient offerts, au milieu desquels il ne savait encore comment choisir […].",
        "L’excitation sexuelle, qui, chez les animaux, repose seulement sur une impulsion passagère et la plupart du temps périodique, était susceptible pour lui de se prolonger et même de s’accroître sous l’effet de l’imagination, […] de façon d’autant plus durable et plus uniforme que l’objet est soustrait aux sens, ce qui évite la satiété qu’entraîne avec soi la satisfaction d’un désir purement animal. La feuille de figuier fut donc le résultat d’une manifestation de la raison bien plus importante que toutes celles qui étaient survenues antérieurement au tout premier stade de son développement. Car le fait de rendre une inclination plus forte et plus durable, en retirant son objet aux sens, dénote déjà une certaine suprématie consciente de la raison sur les inclinations et non plus seulement, comme au degré inférieur, un pouvoir de les servir sur une plus ou moins grande échelle. Le refus fut l’habile artifice qui conduisit l’homme des excitations purement sensuelles vers les excitations idéales, et peu à peu du désir purement animal à l’amour. Et, avec l’amour, le sentiment de ce qui est purement agréable devint le goût du beau, découvert d’abord seulement dans l’homme, puis aussi dans la nature. […]",
        "Le troisième progrès accompli par la raison, après qu’elle se fut mêlée des premiers besoins immédiats et sensibles, ce fut l’attente réfléchie de l’avenir. Ce pouvoir de ne pas jouir seulement de l’instant présent, mais de se représenter d’une façon actuelle l’avenir souvent très lointain, est le signe distinctif le plus caractéristique de la supériorité de l’homme […]."
      ]
    },
    {
      id:"kant-quietude-inaccessible", section:"philosophie",
      cardMeta:"Philosophie critique",
      title:"La quiétude est inaccessible à l’homme", author:"Emmanuel Kant", authorTag:"Kant",
      cardHighlight:"inaccessible à l’homme", cardHeight:"compact",
      authorMeta:"(1724–1804) · philosophie critique", themes:["Bonheur", "Nature"], work:"Anthropologie d’un point de vue pragmatique", publication:"1798, § 61",
      description:"Pourquoi une satisfaction absolue serait-elle incompatible avec l’activité et la vie humaines ?",
      context:"Kant ne présente pas la <strong>douleur</strong> comme un simple mal : la nature en fait un stimulant qui relance constamment l’activité humaine et le progrès vers le mieux.",
      readingQuestions:[
        "Pourquoi la satisfaction absolue n’est-elle accessible ni moralement ni pragmatiquement ?",
        "En quel sens la <strong>douleur</strong> stimule-t-elle l’activité et le progrès ?",
        "Pourquoi le repos absolu serait-il incompatible avec la <strong>vie intellectuelle</strong> ?"
      ],
      readingNotes:[
        { type:"concept", term:"<em>Acquiescentia</em>", definition:"Satisfaction ou approbation complète. Kant soutient qu’elle ne peut jamais être absolue pendant la vie humaine." },
        { type:"opposition", left:{ term:"Satisfaction relative", definition:"Jugement partiel obtenu en comparant notre vie à celle des autres ou à nos propres états antérieurs." }, right:{ term:"Satisfaction absolue", definition:"État sans manque, sans douleur et sans nouveau mobile d’action ; il demeure inaccessible à l’être humain vivant." } },
        { type:"concept", term:"Douleur comme aiguillon", definition:"La douleur signale un manque et met les facultés en mouvement. Elle empêche l’engourdissement et pousse l’être humain à progresser vers le mieux." },
        { type:"concept", term:"Analogie organique", definition:"Une vie intellectuelle entièrement immobile serait comparable à un cœur qui cesse de battre : sans nouvelle excitation, l’arrêt de l’activité conduit à la mort." }
      ],
      relatedTexts:[
        { id:"alain-bonheur-agir", kind:"proche", label:"Alain — Le vrai bonheur est le bonheur d’agir", relation:"Les deux textes refusent d’identifier le bonheur à un repos sans activité." },
        { id:"freud-bonheur-episodique", kind:"proche", label:"Freud — Aucun bien ne rend durablement heureux", relation:"Freud explique lui aussi pourquoi une satisfaction devenue stable perd son intensité." },
        { id:"schopenhauer-bonheur-absence-souffrance", kind:"adverse", label:"Schopenhauer — Le bonheur comme absence de souffrance", relation:"Schopenhauer mesure le bonheur à l’absence de douleur ; Kant voit dans la douleur un stimulant nécessaire de l’activité." }
      ],
      paragraphs:[
        "Qu’en est-il de la satisfaction (<em>acquiescentia</em>) pendant la vie ? — Elle n’est pas accessible à l’homme : ni dans un sens moral (être satisfait de soi-même pour sa bonne volonté), ni dans un sens pragmatique (être satisfait du bien-être qu’on pense pouvoir se procurer par l’habileté et l’intelligence).",
        "La nature a placé en l’homme, comme stimulant de l’activité, la douleur à laquelle il ne peut se soustraire afin que le progrès s’accomplisse toujours vers le mieux ; et même à l’instant suprême, on ne peut se dire satisfait de la dernière partie de sa vie que d’une manière relative — en partie par comparaison avec le lot des autres, en partie par comparaison avec nous-mêmes ; mais on ne l’est jamais purement ni absolument.",
        "Dans la vie, être satisfait absolument, ce serait, hors de toute activité, le repos et l’inertie des mobiles, ou l’engourdissement des sensations et de l’activité qui leur est liée. Un tel état est tout aussi incompatible avec la vie intellectuelle de l’homme que l’immobilité du cœur dans un organisme animal, immobilité à laquelle, si ne survient aucune nouvelle excitation par la douleur, la mort fait suite inévitablement."
      ]
    }
  ];

  const SECTION_LABELS = { philosophie:"Philosophie", theologie:"Théologie", autres:"Autres" };
  const SECTION_SYMBOLS = { philosophie:"φ", theologie:"✦", autres:"—" };
  const READING_PATHS = [
    {
      id:"bonheur",
      label:"Le bonheur : désirs, plaisir, action et limites",
      texts:[
        "platon-callicles-desirs",
        "platon-socrate-temperance",
        "epicure-plaisir-vie-heureuse",
        "rousseau-desir-imagination-bonheur",
        "spinoza-desir-puissance-exister",
        "seneque-vie-vertueuse",
        "epictete-depend-nous",
        "descartes-changer-desirs",
        "descartes-trois-regles-bonheur",
        "alain-bonheur-agir",
        "kant-quietude-inaccessible",
        "freud-bonheur-episodique",
        "krishnamurti-bonheur-sans-recherche",
        "pascal-bonheur-avenir",
        "schopenhauer-desir-souffrance-ennui",
        "schopenhauer-bien-etre-negation",
        "schopenhauer-bonheur-absence-souffrance",
        "augustin-dieu-bonheur"
      ]
    },
    {
      id:"amour",
      label:"L’amour : désir, imagination, caresse et amitié",
      texts:[
        "platon-mythe-androgyne-desir",
        "levinas-caresse-desir-invisible",
        "stendhal-cristallisation-amour",
        "aristote-amour-amitie-veritable"
      ]
    }
  ];

  const LINKED_TEXT_SETS = [
    {
      id:"levinas-stendhal-echo",
      kind:"echo",
      label:"Texte écho",
      title:"Lévinas et Stendhal : au-delà de l’être sensible",
      description:"Une analyse philosophique de la caresse, prolongée par la cristallisation littéraire.",
      texts:["levinas-caresse-desir-invisible", "stendhal-cristallisation-amour"]
    },
    {
      id:"gorgias-dialogue",
      kind:"sequence",
      label:"Dialogue continu",
      title:"Calliclès puis Socrate",
      description:"Deux passages consécutifs du Gorgias : une thèse, puis sa réponse.",
      texts:["platon-callicles-desirs", "platon-socrate-temperance"]
    },
    {
      id:"epicure-seneque",
      kind:"debate",
      label:"Controverse",
      title:"Épicure face à Sénèque",
      description:"Le plaisir ou la vertu comme principe de la vie heureuse.",
      texts:["epicure-plaisir-vie-heureuse", "seneque-vie-vertueuse"]
    },
    {
      id:"schopenhauer-diptyque",
      kind:"same-author",
      label:"Même auteur",
      title:"Le diptyque de Schopenhauer",
      description:"Deux formulations complémentaires d’une même conception du bonheur.",
      texts:["schopenhauer-bien-etre-negation", "schopenhauer-bonheur-absence-souffrance"]
    },
    {
      id:"descartes-morale",
      kind:"same-author",
      label:"Même auteur",
      title:"La morale de Descartes en deux textes",
      description:"La troisième maxime du Discours, puis son développement dans la lettre à Élisabeth.",
      texts:["descartes-changer-desirs", "descartes-trois-regles-bonheur"]
    }
  ];
  const textUrl = (textOrId) => `/textes/${encodeURIComponent(typeof textOrId === "string" ? textOrId : textOrId.id)}/`;
  window.FV_TEXT_CATALOG = TEXTS;
  window.FV_TEXT_SECTION_LABELS = SECTION_LABELS;
  window.FV_TEXT_PATHS = READING_PATHS;
  window.FV_LINKED_TEXT_SETS = LINKED_TEXT_SETS;
  window.FV_TEXT_URL = textUrl;
  window.FV_CURRENT_PROGRAM_THEMES = CURRENT_PROGRAM_THEMES;
  window.FV_ALL_TEXT_THEMES = [...new Set(TEXTS.flatMap((text) => text.themes || []))];
  const normalize = (value) => value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const collator = new Intl.Collator("fr", { sensitivity:"base" });
  const alphabeticalThemes = (items) => [...items].sort((a,b) => collator.compare(a,b));
  const authorTag = (text) => text.authorTag || text.author.split(/\s+/).slice(-1)[0];
  const textThemes = (text) => text.themes || (text.theme ? [text.theme] : []);
  const textSections = (text) => text.sections || [text.section];

  const root = document.querySelector("[data-text-catalog]");
  if (!root) return;

  const fixedSection = document.body.dataset.catalogSection || "all";
  const grid = root.querySelector("[data-text-grid]");
  const count = root.querySelector("[data-text-count]");
  const search = root.querySelector("[data-text-search]");
  const section = root.querySelector("[data-text-section]");
  const theme = root.querySelector("[data-text-theme]");
  const author = root.querySelector("[data-text-author]");
  const reset = root.querySelector("[data-text-reset]");
  const tools = root.querySelector(".texts-tools");
  const summary = root.querySelector(".texts-summary");
  const pagination = document.createElement("nav");
  pagination.className = "texts-pagination";
  pagination.setAttribute("aria-label", "Pagination des textes");
  grid.insertAdjacentElement("afterend", pagination);

  const availableSections = new Set(TEXTS.flatMap(textSections));
  const sectionTabs = document.querySelector(".texts-section-tabs");
  sectionTabs?.querySelectorAll("a[href]").forEach((link) => {
    const match = link.getAttribute("href")?.match(/^\/textes\/([^/]+)\/?$/);
    if (match && !availableSections.has(match[1])) link.hidden = true;
  });
  if (sectionTabs) sectionTabs.hidden = availableSections.size < 2;

  if (tools && summary && !root.querySelector(".texts-course-cta")) {
    summary.insertAdjacentHTML("beforebegin", `
      <aside class="texts-course-cta" aria-label="Accompagnement en cours particulier">
        <div class="texts-course-cta-copy">
          <strong>Un texte vous résiste&nbsp;?</strong>
          <span>Je vous aide à le comprendre et à construire une explication solide.</span>
        </div>
        <a class="texts-course-cta-link" href="/#contact">Prendre un cours <span aria-hidden="true">→</span></a>
      </aside>`);
  }

  const sectionTexts = fixedSection === "all" ? TEXTS : TEXTS.filter((text) => textSections(text).includes(fixedSection));
  const authors = [...new Map(sectionTexts.map((text) => [text.author, { value:text.author, label:authorTag(text) }])).values()]
    .sort((a,b) => collator.compare(a.label,b.label));
  const catalogThemes = alphabeticalThemes(new Set(sectionTexts.flatMap(textThemes)));
  const programThemes = catalogThemes.filter((item) => CURRENT_PROGRAM_THEMES.includes(item));
  const complementaryThemes = catalogThemes.filter((item) => !CURRENT_PROGRAM_THEMES.includes(item));

  if (section) {
    const sections = Object.entries(SECTION_LABELS)
      .filter(([value]) => availableSections.has(value))
      .sort(([,labelA],[,labelB]) => collator.compare(labelA,labelB));
    section.innerHTML = `<option value="all">Toutes les sections</option>${sections.map(([value,label]) => `<option value="${value}">${label}</option>`).join("")}`;
  }
  if (theme) {
    const themeOptions = (items) => items.map((item) => `<option value="${item}">${item}</option>`).join("");
    theme.innerHTML = `
      <option value="all">Tous les thèmes</option>
      ${programThemes.length ? `<optgroup label="Notions au programme de Terminale">${themeOptions(programThemes)}</optgroup>` : ""}
      ${complementaryThemes.length ? `<optgroup label="Thèmes complémentaires">${themeOptions(complementaryThemes)}</optgroup>` : ""}`;
  }
  if (author) author.innerHTML = `<option value="all">Tous les auteurs</option>${authors.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}`;

  const params = new URLSearchParams(window.location.search);
  const PAGE_SIZE = 20;
  let currentPage = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const setFromQuery = (control, value) => {
    if (!control || !value) return;
    const match = [...control.options].find((option) => normalize(option.value) === normalize(value));
    if (match) control.value = match.value;
  };
  if (fixedSection === "all") setFromQuery(section, params.get("section"));
  setFromQuery(theme, params.get("theme"));
  setFromQuery(author, params.get("auteur"));
  if (search && params.get("recherche")) search.value = params.get("recherche");

  const catalogUrl = (key, value) => `/textes/?${key}=${encodeURIComponent(value)}`;
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[character]);

  const formatCardTitle = (text) => {
    const title = text.cardTitle || text.title;
    if (!text.cardHighlight) return escapeHtml(title);

    const start = title.toLocaleLowerCase("fr").indexOf(text.cardHighlight.toLocaleLowerCase("fr"));
    if (start < 0) return escapeHtml(title);

    const end = start + text.cardHighlight.length;
    return `${escapeHtml(title.slice(0,start))}<strong>${escapeHtml(title.slice(start,end))}</strong>${escapeHtml(title.slice(end))}`;
  };

  const tagLink = (href, label, program = false) => `<a class="text-tag${program ? " text-tag--program" : ""}" href="${href}"${program ? ' title="Notion du programme de Terminale" aria-label="#' + label + ', notion du programme de Terminale"' : ""}>#${label}</a>`;

  const card = (text) => {
    const idea = text.cardIdea || text.familiarIdea;
    const title = `${formatCardTitle(text)}${idea ? ` <span class="text-card-familiar-idea">${escapeHtml(idea)}</span>` : ""}`;
    const cardModifiers = [
      text.cardStyle ? `text-card--${text.cardStyle}` : "",
      idea ? "text-card--with-idea" : "",
      text.cardHeight ? `text-card--${text.cardHeight}` : ""
    ].filter(Boolean).join(" ");
    const destination = textUrl(text);
    const sections = textSections(text);
    const isDualSection = sections.includes("philosophie") && sections.includes("theologie");
    const sectionSymbols = sections.map((sectionName) => `<span class="text-card-section-symbol text-card-section-symbol--${sectionName}">${SECTION_SYMBOLS[sectionName] || ""}</span>`).join("");
    const sectionMeta = isDualSection ? "Philosophie & théologie" : (text.cardMeta || SECTION_LABELS[text.section]);
    return `
    <article class="text-card text-card--${text.section}${isDualSection ? " text-card--dual" : ""}${cardModifiers ? ` ${cardModifiers}` : ""}">
      <a class="text-card-cover-link" href="${destination}" data-text-link aria-label="Lire : ${text.title}, ${text.author}"></a>
      <p class="text-card-section">${sectionSymbols}<span aria-hidden="true">•</span><span>${escapeHtml(sectionMeta)}</span></p>
      <h2>${title}</h2>
      <p class="text-card-author"><a href="${catalogUrl("auteur", text.author)}" data-filter-author="${escapeHtml(text.author)}" aria-label="Afficher les textes de ${escapeHtml(text.author)}">${text.author}</a> · <cite>${text.work}</cite></p>
      <p class="text-card-description">${text.description}</p>
      <span class="text-card-arrow" aria-hidden="true">→</span>
      <div class="text-card-tags">
        ${textThemes(text).slice(0, 3).map((themeName) => tagLink(catalogUrl("theme", themeName), themeName.toLocaleLowerCase("fr"), CURRENT_PROGRAM_THEMES.includes(themeName))).join("")}
      </div>
    </article>`;
  };

  const linkedSetIcon = (kind) => {
    if (kind === "sequence") return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path class="text-linked-set-icon-surface text-linked-set-icon-secondary" d="M4.25 5.25h8.25a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5H8.25L5.2 14l.65-2.25h-1.6a1.5 1.5 0 0 1-1.5-1.5v-3.5a1.5 1.5 0 0 1 1.5-1.5Z"/>
        <path class="text-linked-set-icon-surface" d="M11.5 10.25h8.25a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5h-1.6L18.8 19l-3.05-2.25H11.5a1.5 1.5 0 0 1-1.5-1.5v-3.5a1.5 1.5 0 0 1 1.5-1.5Z"/>
      </svg>`;
    if (kind === "debate") return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 12h6.75M7.5 9.25 10.25 12 7.5 14.75"/>
        <path d="M20.5 12h-6.75m2.75-2.75L13.75 12l2.75 2.75"/>
      </svg>`;
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path class="text-linked-set-icon-surface text-linked-set-icon-secondary" d="M4.25 6.25h8v11h-8z"/>
        <path class="text-linked-set-icon-surface" d="M7.25 3.25h8v10.5h-3"/>
        <path class="text-linked-set-icon-feather" d="M11.25 19.75c2.05-4.65 5-8.05 8.5-9.6-.8 3.9-3.25 7.15-7.25 9.05m.6-2.15 3.7-3.05"/>
      </svg>`;
  };

  const linkedSet = (set, texts) => `
    <section class="text-linked-set text-linked-set--${set.kind}" aria-labelledby="linked-set-${set.id}">
      <header class="text-linked-set-heading">
        <span class="text-linked-set-copy">
          <span class="text-linked-set-label">${escapeHtml(set.label)}</span>
          <strong id="linked-set-${set.id}">${escapeHtml(set.title)}</strong>
        </span>
        <span class="text-linked-set-description">${escapeHtml(set.description)}</span>
      </header>
      <div class="text-linked-set-cards">
        <span class="text-linked-set-center-mark" aria-hidden="true">${linkedSetIcon(set.kind)}</span>
        ${texts.map(card).join("")}
      </div>
    </section>`;

  const syncFiltersInUrl = (selectedSection, selectedTheme, selectedAuthor) => {
    const nextParams = new URLSearchParams();
    if (fixedSection === "all" && selectedSection !== "all") nextParams.set("section", selectedSection);
    if (selectedTheme !== "all") nextParams.set("theme", selectedTheme);
    if (selectedAuthor !== "all") nextParams.set("auteur", selectedAuthor);
    const searchValue = search?.value.trim();
    if (searchValue) nextParams.set("recherche", searchValue);
    if (currentPage > 1) nextParams.set("page", String(currentPage));
    const queryString = nextParams.toString();
    window.history.replaceState({ textCatalog:true }, "", `${window.location.pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const render = () => {
    const query = normalize(search?.value.trim() || "");
    const selectedSection = fixedSection === "all" ? (section?.value || "all") : fixedSection;
    const selectedTheme = theme?.value || "all";
    const selectedAuthor = author?.value || "all";
    const matchesFilters = (text) => {
      const themes = textThemes(text);
      const searchable = normalize(`${text.title} ${text.familiarIdea || ""} ${text.author} ${themes.join(" ")} ${text.work} ${text.publication} ${text.description} ${(text.readingNotes || []).map((note) => `${note.term} ${note.definition}`).join(" ")}`);
      return (selectedSection === "all" || textSections(text).includes(selectedSection))
        && (selectedTheme === "all" || themes.includes(selectedTheme))
        && (selectedAuthor === "all" || text.author === selectedAuthor)
        && (!query || searchable.includes(query));
    };

    const directMatches = TEXTS.filter(matchesFilters);
    const directIds = new Set(directMatches.map((text) => text.id));
    const expandedIds = new Set(directIds);
    LINKED_TEXT_SETS.forEach((set) => {
      if (set.texts.some((id) => directIds.has(id))) {
        set.texts.forEach((id) => {
          const companion = TEXTS.find((text) => text.id === id);
          if (companion && (selectedSection === "all" || textSections(companion).includes(selectedSection))) expandedIds.add(id);
        });
      }
    });

    const results = TEXTS.filter((text) => expandedIds.has(text.id));
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    syncFiltersInUrl(selectedSection, selectedTheme, selectedAuthor);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageResults = results.slice(pageStart, pageStart + PAGE_SIZE);
    const pageIds = new Set(pageResults.map((text) => text.id));
    const groupedIds = new Set();
    const renderedSets = LINKED_TEXT_SETS.flatMap((set) => {
      const texts = set.texts.map((id) => TEXTS.find((text) => text.id === id)).filter((text) => text && pageIds.has(text.id));
      if (texts.length < 2) return [];
      texts.forEach((text) => groupedIds.add(text.id));
      return [linkedSet(set, texts)];
    });
    const standalone = pageResults
      .filter((text) => !groupedIds.has(text.id))
      .sort((a,b) => collator.compare(SECTION_LABELS[a.section],SECTION_LABELS[b.section]) || collator.compare(a.author,b.author) || collator.compare(a.title,b.title));
    const linkedCompanions = results.length - directMatches.length;
    const linkedNote = linkedCompanions > 0 ? ` <span class="texts-count-linked">dont ${linkedCompanions} texte${linkedCompanions > 1 ? "s" : ""} lié${linkedCompanions > 1 ? "s" : ""}</span>` : "";

    const pageNote = totalPages > 1 ? ` <span class="texts-count-page">· ${pageResults.length} affiché${pageResults.length > 1 ? "s" : ""} sur la page ${currentPage}</span>` : "";
    count.innerHTML = `<strong>${results.length}</strong> texte${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}${linkedNote}${pageNote}`;
    grid.innerHTML = results.length ? `${renderedSets.join("")}${standalone.map(card).join("")}` : `<div class="texts-empty"><h2>Aucun texte ne correspond</h2><p>Modifiez un filtre ou réinitialisez votre sélection.</p></div>`;
    pagination.hidden = totalPages <= 1;
    pagination.innerHTML = totalPages > 1
      ? Array.from({ length:totalPages }, (_, index) => index + 1).map((page) => `<button type="button" class="texts-page-number${page === currentPage ? " is-current" : ""}" data-text-page="${page}"${page === currentPage ? ' aria-current="page"' : ""} aria-label="Afficher la page ${page}">${page}</button>`).join("")
      : "";
  };

  root.addEventListener("click", (event) => {
    const authorLink = event.target.closest("[data-filter-author]");
    if (authorLink && author) {
      event.preventDefault();
      setFromQuery(author, authorLink.dataset.filterAuthor);
      currentPage = 1;
      render();
      author.focus({ preventScroll:true });
      return;
    }
    const textLink = event.target.closest("[data-text-link]");
    if (textLink) {
      try {
        window.sessionStorage.setItem("fvTextCatalogReturn", `${window.location.pathname}${window.location.search}`);
      } catch (_) {}
    }
  });

  pagination.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-text-page]");
    if (!pageButton) return;
    currentPage = Number.parseInt(pageButton.dataset.textPage, 10) || 1;
    render();
    summary?.scrollIntoView({ behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" });
  });

  [search,section,theme,author].filter(Boolean).forEach((control) => control.addEventListener(control === search ? "input" : "change", () => {
    currentPage = 1;
    render();
  }));
  reset?.addEventListener("click", () => {
    if (search) search.value = "";
    [section,theme,author].filter(Boolean).forEach((control) => { control.value = "all"; });
    currentPage = 1;
    render();
    search?.focus();
  });
  render();
})();

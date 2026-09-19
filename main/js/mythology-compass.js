(() => {
  'use strict';

  const normalize = (value = '') => String(value)
    .replace(/[Œœ]/g, 'oe')
    .replace(/[Ææ]/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const esc = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const MYTHS = [
    {id:'cosmogonie',title:'Au commencement : Chaos, Gaïa et Éros',cycle:'Origines',level:'Essentiel',summary:'Le monde n’est pas créé d’un seul geste : il émerge progressivement à partir de puissances premières.',source:'Hésiode · Théogonie',people:['Chaos','Gaïa','Éros','Ouranos'],themes:['origine','nature','ordre','religion'],url:'/textes/hesiode-cosmogonie-chaos-gaia-eros/'},
    {id:'promethee',title:'Prométhée et le feu',cycle:'Origines',level:'Essentiel',summary:'En donnant le feu aux humains, Prométhée rend possible une puissance technique qui bouleverse leur condition.',source:'Hésiode · Les Travaux et les Jours',people:['Prométhée','Zeus','Épiméthée'],themes:['technique','liberté','limite','travail'],url:'/textes/hesiode-promethee-vol-feu/'},
    {id:'pandore',title:'Pandore et la jarre des maux',cycle:'Origines',level:'Essentiel',summary:'La première femme ouvre la jarre qui libère les maux parmi les humains ; seule l’espérance demeure.',source:'Hésiode · Les Travaux et les Jours',people:['Pandore','Épiméthée','Zeus'],themes:['mal','espérance','condition humaine','travail'],url:'/textes/hesiode-pandore-maux-esperance/'},
    {id:'deucalion',title:'Deucalion et Pyrrha après le Déluge',cycle:'Origines',level:'À connaître',summary:'Après la destruction d’une humanité jugée corrompue, un couple de survivants rend possible un recommencement.',source:'Ovide · Métamorphoses I',people:['Deucalion','Pyrrha','Zeus'],themes:['justice','catastrophe','recommencement','religion'],url:'/textes/ovide-deucalion-pyrrha-deluge/'},
    {id:'persephone',title:'Déméter et Perséphone',cycle:'Olympiens',level:'Essentiel',summary:'L’enlèvement de Perséphone par Hadès et le deuil de Déméter donnent une forme narrative au retour cyclique de la végétation.',source:'Hymne homérique à Déméter',people:['Déméter','Perséphone','Hadès','Zeus'],themes:['nature','mort','cycle','maternité']},
    {id:'heracles',title:'Héraclès et les douze travaux',cycle:'Héros',level:'Essentiel',summary:'Le héros doit accomplir une série d’épreuves impossibles : sa force ne suffit jamais sans endurance, ruse et maîtrise.',source:'Traditions multiples · notamment Pseudo-Apollodore',people:['Héraclès','Héra','Hydre','Cerbère'],themes:['épreuve','force','vertu','maîtrise de soi']},
    {id:'thesee',title:'Thésée et le Minotaure',cycle:'Héros',level:'Essentiel',summary:'Thésée entre dans le Labyrinthe pour tuer le Minotaure et ne peut en ressortir qu’avec l’aide du fil d’Ariane.',source:'Traditions attiques · Pseudo-Apollodore, Plutarque',people:['Thésée','Ariane','Minotaure','Minos','Dédale'],themes:['ruse','monstre','politique','identité']},
    {id:'argonautes',title:'Jason et les Argonautes',cycle:'Héros',level:'À connaître',summary:'Une expédition de héros traverse le monde pour conquérir la Toison d’or ; le succès de Jason dépend largement de Médée.',source:'Apollonios de Rhodes · Argonautiques',people:['Jason','Médée','Héra'],themes:['voyage','désir','trahison','héroïsme']},
    {id:'oedipe',title:'Œdipe : fuir le destin, rencontrer la vérité',cycle:'Thèbes',level:'Essentiel',summary:'En voulant échapper à l’oracle, Œdipe accomplit ce qu’il redoutait puis découvre progressivement qui il est.',source:'Sophocle · Œdipe roi',people:['Œdipe','Laïos','Jocaste','Sphinx','Antigone'],themes:['destin','vérité','liberté','responsabilité'],url:'/textes/sophocle-oedipe-verite-destin/'},
    {id:'oreste',title:'Oreste : de la vengeance au tribunal',cycle:'Atrides',level:'Essentiel',summary:'Le cycle des meurtres familiaux ne prend fin qu’avec le passage de la vengeance privée au jugement institutionnel.',source:'Eschyle · Orestie',people:['Oreste','Clytemnestre','Agamemnon','Athéna'],themes:['justice','vengeance','état','famille'],url:'/textes/eschyle-oreste-tribunal-justice/'},
    {id:'troie',title:'La guerre de Troie',cycle:'Troie',level:'Essentiel',summary:'Autour d’Hélène, d’Achille, d’Hector et d’Agamemnon se nouent gloire, colère, devoir, perte et destin.',source:'Homère · Iliade et traditions du Cycle troyen',people:['Achille','Hector','Hélène','Paris','Agamemnon'],themes:['guerre','gloire','colère','destin']},
    {id:'sirenes',title:'Ulysse résiste au chant des Sirènes',cycle:'Retours',level:'Essentiel',summary:'Ulysse veut entendre le chant sans y succomber : il organise à l’avance la contrainte qui le protégera de son propre désir.',source:'Homère · Odyssée XII',people:['Ulysse','Sirènes'],themes:['désir','liberté','maîtrise de soi','ruse'],url:'/textes/homere-ulysse-sirenes-maitrise-desir/'},
    {id:'icare',title:'Dédale et Icare',cycle:'Métamorphoses',level:'Essentiel',summary:'Une invention permet de s’arracher à l’enfermement, mais la puissance technique devient dangereuse lorsque la mesure disparaît.',source:'Ovide · Métamorphoses VIII',people:['Dédale','Icare','Minos'],themes:['technique','mesure','liberté','responsabilité'],url:'/textes/ovide-icare-voler-trop-haut/'},
    {id:'narcisse',title:'Narcisse et son reflet',cycle:'Métamorphoses',level:'Essentiel',summary:'Narcisse désire une image qu’il prend pour un autre avant de découvrir qu’elle est la sienne.',source:'Ovide · Métamorphoses III',people:['Narcisse','Écho'],themes:['désir','image','identité','conscience'],url:'/textes/ovide-narcisse-reflet-desir-identite/'},
    {id:'orphee',title:'Orphée et Eurydice',cycle:'Métamorphoses',level:'Essentiel',summary:'Le chant d’Orphée émeut jusqu’au monde des morts, mais le regard interdit fait échouer le retour d’Eurydice.',source:'Virgile · Géorgiques IV · Ovide · Métamorphoses X',people:['Orphée','Eurydice','Hadès','Perséphone'],themes:['art','amour','mort','mémoire'],url:'/textes/ovide-orphee-eurydice-regard-interdit/'}
  ];

  const PEOPLE = [
    ['Chaos','primordial','Ouverture indéterminée qui marque le commencement de la cosmogonie hésiodique.','Gaïa · Tartare · Éros','Cosmogonie','origine · ordre'],
    ['Gaïa','primordial','La Terre personnifiée, puissance première et ancêtre d’une grande partie des lignées divines.','Ouranos · Titans','Cosmogonie','nature · fécondité'],
    ['Ouranos','primordial','Le Ciel, uni à Gaïa et renversé par leur fils Cronos.','Gaïa · Cronos','Cosmogonie','pouvoir · succession'],
    ['Éros','primordial','Puissance du désir et de l’union ; sa généalogie varie fortement selon les traditions.','Aphrodite (dans des traditions tardives)','Cosmogonie','désir · amour'],
    ['Cronos','titan','Titan qui renverse Ouranos puis dévore ses enfants pour empêcher sa propre destitution.','Rhéa · Zeus','Succession divine','temps · pouvoir'],
    ['Rhéa','titan','Titanide, épouse de Cronos, qui sauve Zeus de la dévoration paternelle.','Cronos · Zeus','Succession divine','maternité · ruse'],
    ['Prométhée','titan','Titan bienfaiteur des humains, associé au feu, à l’anticipation et aux techniques.','Épiméthée · Zeus','Prométhée','technique · liberté','/textes/hesiode-promethee-vol-feu/'],
    ['Épiméthée','titan','Frère de Prométhée dont le nom évoque la pensée après coup ; il accueille Pandore.','Prométhée · Pandore','Pandore','imprudence · condition humaine'],
    ['Atlas','titan','Titan condamné à soutenir le ciel après la guerre des Titans contre les Olympiens.','Prométhée (tradition fraternelle)','Titanomachie','force · châtiment'],
    ['Zeus','dieu','Souverain olympien, garant de l’ordre, des serments et d’une forme de justice divine.','Cronos · Rhéa · Héra','Nombreux cycles','pouvoir · justice'],
    ['Héra','dieu','Déesse du mariage et souveraine olympienne, fréquemment engagée dans les conflits familiaux de Zeus.','Zeus · Héraclès','Héraclès · Argonautes','mariage · jalousie'],
    ['Poséidon','dieu','Dieu de la mer, des séismes et des chevaux ; adversaire majeur d’Ulysse dans l’Odyssée.','Zeus · Hadès','Odyssée','nature · colère'],
    ['Hadès','dieu','Souverain du monde souterrain des morts ; il enlève Perséphone dans l’Hymne à Déméter.','Perséphone · Zeus','Perséphone · Orphée','mort · limite'],
    ['Déméter','dieu','Déesse des moissons dont le deuil pour Perséphone affecte la fertilité du monde.','Perséphone · Zeus','Déméter et Perséphone','nature · cycle'],
    ['Hestia','dieu','Déesse du foyer et du feu domestique, figure de stabilité plus discrète dans les récits héroïques.','Cronos · Rhéa','Olympiens','foyer · ordre'],
    ['Athéna','dieu','Déesse de la sagesse pratique, de la stratégie et des arts techniques ; protectrice d’Ulysse et d’Athènes.','Zeus','Odyssée · Oreste','raison · technique · justice'],
    ['Apollon','dieu','Dieu de Delphes, de la musique et de la divination ; les oracles apolliniens structurent plusieurs tragédies.','Zeus · Léto · Artémis','Œdipe · Oreste','vérité · oracle · art'],
    ['Artémis','dieu','Déesse de la chasse et des espaces sauvages, sœur jumelle d’Apollon.','Zeus · Léto · Apollon','Iphigénie','nature · limite'],
    ['Hermès','dieu','Messager divin, protecteur des voyageurs et figure de ruse, de passage et de médiation.','Zeus','Nombreux cycles','langage · ruse · passage'],
    ['Aphrodite','dieu','Déesse de l’amour et du désir ; sa naissance et sa généalogie varient selon les sources.','Arès · Héphaïstos (selon traditions)','Troie · récits amoureux','désir · beauté'],
    ['Héphaïstos','dieu','Dieu forgeron, maître du feu artisanal et de la fabrication technique.','Héra · Aphrodite (selon Homère)','Olympiens','technique · art'],
    ['Arès','dieu','Dieu de la guerre dans sa dimension violente et tumultueuse.','Zeus · Héra','Troie','guerre · violence'],
    ['Dionysos','dieu','Dieu du vin, de l’ivresse, du théâtre et du bouleversement des identités ordinaires.','Zeus · Sémélé','Cycle dionysiaque','art · excès · identité'],
    ['Pandore','mortel','Première femme façonnée par les dieux dans le récit hésiodique ; elle apporte la jarre qui contient les maux.','Épiméthée','Pandore','mal · espérance','/textes/hesiode-pandore-maux-esperance/'],
    ['Deucalion','heros','Survivant du Déluge grec avec Pyrrha ; ils permettent le recommencement de l’humanité.','Pyrrha · Prométhée (père, selon tradition)','Déluge','justice · recommencement','/textes/ovide-deucalion-pyrrha-deluge/'],
    ['Pyrrha','heros','Compagne de Deucalion et survivante du Déluge, associée à la renaissance de l’humanité.','Deucalion · Épiméthée/Pandore (lignée)','Déluge','recommencement · humanité','/textes/ovide-deucalion-pyrrha-deluge/'],
    ['Héraclès','heros','Héros de la force et de l’épreuve, condamné à accomplir des travaux qui le confrontent sans cesse à la limite.','Zeus · Alcmène · Héra','Douze travaux','force · épreuve'],
    ['Thésée','heros','Héros athénien qui tue le Minotaure et sort du Labyrinthe grâce au fil d’Ariane.','Égée · Ariane','Minotaure','ruse · politique'],
    ['Ariane','mortel','Fille de Minos qui aide Thésée à sortir du Labyrinthe en lui donnant un fil.','Minos · Thésée · Dionysos','Minotaure','aide · amour · trahison'],
    ['Jason','heros','Chef des Argonautes en quête de la Toison d’or ; son succès dépend des pouvoirs et de l’aide de Médée.','Médée','Argonautes','héroïsme · dette'],
    ['Médée','mortel','Princesse de Colchide et magicienne qui aide Jason avant de devenir l’une des grandes figures tragiques de la vengeance.','Jason · Hécate (affinités cultuelles)','Argonautes · Médée','amour · vengeance'],
    ['Persée','heros','Héros qui décapite Méduse grâce à des objets et conseils divins.','Danaé · Zeus · Méduse','Méduse','courage · technique'],
    ['Œdipe','heros','Roi de Thèbes qui résout l’énigme du Sphinx puis découvre qu’il a accompli l’oracle qu’il voulait fuir.','Laïos · Jocaste · Antigone','Cycle thébain','vérité · destin · responsabilité','/textes/sophocle-oedipe-verite-destin/'],
    ['Antigone','mortel','Fille d’Œdipe, connue surtout pour son conflit avec Créon autour de l’ensevelissement de Polynice.','Œdipe · Jocaste · Créon','Cycle thébain','justice · devoir · état'],
    ['Ulysse','heros','Roi d’Ithaque caractérisé par la ruse, l’endurance et l’art de se tirer de situations impossibles.','Pénélope · Télémaque · Athéna','Odyssée','ruse · identité · liberté','/textes/homere-ulysse-sirenes-maitrise-desir/'],
    ['Achille','heros','Plus grand guerrier achéen de l’Iliade, dont la colère structure une grande partie du poème.','Pélée · Thétis · Patrocle','Guerre de Troie','colère · gloire · mort'],
    ['Hector','heros','Prince troyen et défenseur de sa cité, adversaire d’Achille dans l’Iliade.','Priam · Hécube · Andromaque','Guerre de Troie','devoir · famille · guerre'],
    ['Paris','mortel','Prince troyen dont le jugement entre trois déesses et l’enlèvement ou la fuite avec Hélène déclenchent la guerre de Troie.','Priam · Hécube · Hélène','Guerre de Troie','désir · choix · guerre'],
    ['Hélène','mortel','Figure centrale du conflit troyen, célébrée pour sa beauté et traitée diversement comme victime, agent ou enjeu du désir.','Ménélas · Paris','Guerre de Troie','beauté · désir · responsabilité'],
    ['Agamemnon','heros','Roi de Mycènes et chef de l’expédition achéenne contre Troie, au cœur de la lignée maudite des Atrides.','Clytemnestre · Oreste · Ménélas','Troie · Atrides','pouvoir · violence'],
    ['Clytemnestre','mortel','Épouse d’Agamemnon qui tue son mari à son retour de Troie, notamment en vengeance du sacrifice d’Iphigénie.','Agamemnon · Oreste · Électre','Atrides','vengeance · justice'],
    ['Oreste','heros','Fils d’Agamemnon qui tue Clytemnestre pour venger son père puis doit répondre de ce matricide.','Agamemnon · Clytemnestre · Électre','Orestie','justice · vengeance','/textes/eschyle-oreste-tribunal-justice/'],
    ['Orphée','heros','Poète et musicien dont le chant persuade les puissances infernales de laisser Eurydice revenir parmi les vivants.','Eurydice','Orphée et Eurydice','art · amour · mort','/textes/ovide-orphee-eurydice-regard-interdit/'],
    ['Eurydice','mortel','Épouse d’Orphée, morte puis presque ramenée du monde souterrain avant le regard interdit.','Orphée','Orphée et Eurydice','amour · mort','/textes/ovide-orphee-eurydice-regard-interdit/'],
    ['Dédale','heros','Inventeur et artisan associé au Labyrinthe puis aux ailes permettant de fuir la Crète.','Icare · Minos','Minotaure · Icare','technique · invention','/textes/ovide-icare-voler-trop-haut/'],
    ['Icare','heros','Fils de Dédale qui s’élève trop près du Soleil malgré l’avertissement paternel.','Dédale','Icare','technique · mesure','/textes/ovide-icare-voler-trop-haut/'],
    ['Narcisse','mortel','Jeune homme qui tombe amoureux de son propre reflet sans comprendre d’abord qu’il s’agit de lui-même.','Écho','Narcisse','désir · identité · image','/textes/ovide-narcisse-reflet-desir-identite/'],
    ['Écho','mortel','Nymphe privée d’une parole autonome, condamnée à répéter les derniers mots d’autrui ; elle aime Narcisse sans retour.','Narcisse','Narcisse','langage · désir'],
    ['Minos','mortel','Roi de Crète, associé au Labyrinthe, au Minotaure et au conflit avec Dédale.','Ariane · Minotaure','Minotaure · Icare','pouvoir · loi'],
    ['Minotaure','creature','Être hybride, mi-homme mi-taureau, enfermé dans le Labyrinthe de Crète et tué par Thésée.','Minos · Pasiphaé · Thésée','Minotaure','monstre · altérité'],
    ['Méduse','creature','Gorgone dont le regard pétrifie ; Persée la décapite en évitant de la regarder directement.','Persée','Méduse','regard · peur · ruse'],
    ['Sphinx','creature','Créature qui soumet Thèbes à une énigme résolue par Œdipe.','Œdipe','Cycle thébain','langage · énigme · vérité'],
    ['Sirènes','creature','Créatures dont le chant irrésistible attire les navigateurs vers leur perte.','Ulysse','Odyssée','désir · langage','/textes/homere-ulysse-sirenes-maitrise-desir/'],
    ['Cerbère','creature','Chien monstrueux gardant l’entrée du monde des morts, capturé par Héraclès lors d’un de ses travaux.','Hadès · Héraclès','Douze travaux','mort · frontière'],
    ['Hydre','creature','Monstre à plusieurs têtes de Lerne ; lorsqu’une tête est coupée, d’autres peuvent repousser.','Héraclès','Douze travaux','épreuve · force'],
    ['Polyphème','creature','Cyclope aveuglé par Ulysse, fils de Poséidon dans l’Odyssée.','Poséidon · Ulysse','Odyssée','ruse · violence']
  ].map(([name,type,description,relations,myths,themes,url]) => ({name,type,description,relations,myths,themes,url:url||''}));

  const MYTH_GUIDE = {
    cosmogonie:{detail:'Chez Hésiode, le commencement n’est pas un monde déjà organisé : Chaos, Gaïa, Tartare et Éros apparaissent comme des puissances premières. Les générations divines naissent ensuite les unes des autres, jusqu’aux conflits de souveraineté qui conduisent à l’ordre de Zeus.',key:'À retenir : la cosmogonie raconte moins une création instantanée qu’une mise en ordre progressive du monde.'},
    promethee:{detail:'Prométhée trompe Zeus puis dérobe le feu pour le rendre aux humains. Avec le feu viennent les arts, les techniques et une nouvelle autonomie, mais aussi la punition divine : le gain de puissance transforme durablement la condition humaine.',key:'À retenir : la technique libère et augmente la puissance humaine, mais elle ouvre aussi la question de la limite et de la responsabilité.'},
    pandore:{detail:'Zeus fait façonner Pandore et l’envoie aux humains après le vol du feu. Lorsqu’elle ouvre la jarre, les maux se répandent dans le monde tandis que l’espérance demeure : le récit donne une forme mythique à la fragilité de la condition humaine.',key:'À retenir : le mythe ne décrit pas seulement un malheur individuel ; il cherche à expliquer pourquoi travail, souffrance et espérance appartiennent à la vie humaine.'},
    deucalion:{detail:'Face à une humanité jugée corrompue, Zeus provoque un déluge. Deucalion et Pyrrha survivent, puis repeuplent le monde en jetant derrière eux les “os de leur mère”, compris comme les pierres de la Terre : la catastrophe devient recommencement.',key:'À retenir : le déluge articule châtiment, destruction et possibilité d’un nouvel ordre.'},
    persephone:{detail:'Hadès enlève Perséphone et Déméter, sa mère, cesse de faire fructifier la terre. Un compromis permet à Perséphone de revenir une partie de l’année auprès de Déméter et de séjourner l’autre partie dans le monde souterrain.',key:'À retenir : le récit relie séparation, retour, fertilité et cycle des saisons sans se réduire à une simple “explication scientifique” de la nature.'},
    heracles:{detail:'Héraclès doit accomplir des travaux imposés en réparation et en purification. Les épreuves l’opposent à des monstres, des frontières du monde et parfois à ses propres excès : la force brute doit se combiner avec endurance, ruse et discipline.',key:'À retenir : l’héroïsme d’Héraclès se construit dans l’épreuve et la maîtrise, pas dans la seule puissance physique.'},
    thesee:{detail:'Athènes doit livrer de jeunes victimes au Minotaure de Crète. Thésée choisit d’entrer dans le Labyrinthe, tue le monstre et retrouve la sortie grâce au fil donné par Ariane : victoire héroïque, intelligence pratique et dette envers une aide décisive se mêlent.',key:'À retenir : le Labyrinthe montre qu’un problème créé par la technique et le pouvoir peut exiger une autre forme d’intelligence pour être résolu.'},
    argonautes:{detail:'Jason rassemble les Argonautes pour gagner la Colchide et conquérir la Toison d’or. Les épreuves sont nombreuses, mais l’aide magique de Médée est décisive : le récit héroïque devient aussi une histoire de dépendance, d’amour, de dette et de trahison.',key:'À retenir : la gloire de Jason ne se comprend pas sans ceux — et surtout celle — qui rendent sa réussite possible.'},
    oedipe:{detail:'Un oracle annonce qu’Œdipe tuera son père et épousera sa mère. En cherchant à fuir cette prédiction, il accomplit sans le savoir les actes annoncés ; devenu roi de Thèbes, il mène ensuite l’enquête qui révèle sa propre identité.',key:'À retenir : la tragédie noue destin, ignorance, recherche de la vérité et responsabilité sans les réduire à une opposition simple entre liberté et fatalité.'},
    oreste:{detail:'Après le meurtre d’Agamemnon par Clytemnestre, Oreste tue sa mère pour venger son père et se trouve poursuivi par les Érinyes. Dans les Euménides, Athéna organise un tribunal : le conflit passe de la vengeance familiale à une décision publique.',key:'À retenir : le récit met en scène le difficile passage d’une justice de représailles à une justice institutionnelle.'},
    troie:{detail:'La guerre de Troie rassemble plusieurs récits, dont l’Iliade ne raconte qu’un épisode tardif. Autour de la colère d’Achille se croisent gloire, honneur, devoir, deuil et conscience de la mort, tandis que Grecs et Troyens sont présentés dans toute leur humanité.',key:'À retenir : le cycle troyen n’est pas seulement une aventure guerrière ; il interroge ce que vaut la gloire quand toute victoire reste traversée par la perte.'},
    sirenes:{detail:'Circé avertit Ulysse du danger des Sirènes. Il bouche les oreilles de ses compagnons avec de la cire et se fait attacher au mât : il peut entendre le chant, mais ne peut pas ordonner qu’on le libère lorsque son désir devient irrésistible.',key:'À retenir : Ulysse reste libre en organisant à l’avance une contrainte contre sa propre faiblesse future.'},
    icare:{detail:'Dédale fabrique des ailes pour fuir la Crète avec son fils et lui recommande d’éviter aussi bien la mer que le soleil. Icare s’élève trop haut, la cire fond et il chute : la réussite technique ne suffit pas sans mesure dans son usage.',key:'À retenir : le récit distingue la possibilité technique de la capacité à gouverner correctement cette possibilité.'},
    narcisse:{detail:'Narcisse repousse ceux qui l’aiment avant de tomber amoureux d’un reflet qu’il ne reconnaît pas immédiatement comme le sien. Incapable de posséder l’objet de son désir parce qu’il n’est qu’une image, il se consume dans cette relation impossible.',key:'À retenir : le mythe permet de penser le désir, l’image de soi et l’écart entre se regarder et se connaître.'},
    orphee:{detail:'Après la mort d’Eurydice, Orphée descend dans le monde souterrain et obtient grâce à son chant qu’elle lui soit rendue. La condition est de ne pas se retourner avant la sortie ; au dernier moment, le regard d’Orphée provoque une seconde perte.',key:'À retenir : l’art franchit symboliquement la frontière de la mort, mais le récit maintient une limite que même la puissance du chant ne peut abolir.'}
  };

  const VOCAB = [
    {term:'Mythe',category:'Récit',definition:'Récit traditionnel qui met en scène des dieux, des héros, des origines, des fondations ou des événements exemplaires. Dans les sociétés antiques, le mythe n’est pas seulement une fiction divertissante : il transmet des représentations du monde, des valeurs, des conflits et des manières de penser la place des humains.',nuance:'Évitez de traduire automatiquement “mythe” par “histoire fausse”. Un récit mythique peut être reçu comme traditionnel, poétique, religieux, politique ou philosophique selon le contexte.',example:'Prométhée, Œdipe, Déméter et Perséphone, la guerre de Troie.'},
    {term:'Mýthos',category:'Grec',definition:'Mot grec signifiant selon les contextes parole, récit, histoire ou énoncé transmis. Il peut désigner ce qui est raconté avec autorité ou ce qui constitue la matière d’un récit.',nuance:'L’opposition rigide mýthos / lógos est surtout une simplification pédagogique. Les auteurs grecs emploient ces termes de façon beaucoup plus souple.',example:'Utile pour comprendre l’origine du mot “mythe” sans projeter immédiatement notre opposition moderne entre fiction et raison.'},
    {term:'Cosmogonie',category:'Origines',definition:'Récit ou système de représentation qui explique comment le cosmos apparaît, s’organise et acquiert un ordre. Une cosmogonie ne raconte donc pas seulement “le premier moment” : elle décrit souvent le passage d’un état indifférencié à un monde structuré.',nuance:'Il faut distinguer cosmogonie et théogonie : l’une concerne l’ordre du monde, l’autre la naissance et la succession des dieux, même si les deux sont souvent étroitement mêlées.',example:'Chez Hésiode, Chaos, Gaïa et Éros ouvrent le récit de la mise en ordre du monde.'},
    {term:'Théogonie',category:'Origines',definition:'Récit de la naissance des dieux, de leurs filiations, de leurs alliances et des conflits entre générations divines. La théogonie permet de comprendre comment un ordre divin se constitue progressivement.',nuance:'Une théogonie est aussi une généalogie du pouvoir : chez Hésiode, l’ordre de Zeus résulte d’une longue série de successions et de renversements.',example:'Ouranos est renversé par Cronos, puis Cronos par Zeus.'},
    {term:'Anthropogonie',category:'Origines',definition:'Récit qui explique l’origine, la formation ou le renouvellement de l’humanité. Il peut répondre à la question “d’où viennent les humains ?” mais aussi expliquer pourquoi leur condition est marquée par le travail, la mortalité ou la dépendance aux dieux.',nuance:'Les Grecs ne possèdent pas une anthropogonie unique et canonique : plusieurs traditions coexistent et se complètent parfois.',example:'Prométhée, Pandore, Deucalion et Pyrrha peuvent être mobilisés pour penser l’origine ou la condition humaine.'},
    {term:'Moira',category:'Destin',definition:'Le mot moira signifie d’abord une “part” ou un “lot” attribué à quelqu’un ; il en vient à désigner le destin qui échoit à chaque être. Les Moires personnifient aussi les puissances qui distribuent ou fixent cette part.',nuance:'La moira ne doit pas être comprise comme un scénario mécanique qui supprimerait toute décision. Les récits tragiques montrent justement la tension entre ce qui est imparti et la manière dont chacun agit.',example:'Œdipe tente d’échapper à ce qui lui est annoncé ; Achille sait que plusieurs devenirs sont possibles pour lui.'},
    {term:'Anankè',category:'Destin',definition:'Anankè désigne la nécessité, la contrainte ou ce qui s’impose de manière difficilement évitable. Le terme permet de penser un ordre de nécessité plus large qu’une simple décision individuelle.',nuance:'Destin, nécessité et volonté divine ne sont pas toujours synonymes dans les textes antiques. Il faut regarder le récit précis avant de les confondre.',example:'À rapprocher des oracles tragiques et des situations où un personnage rencontre une nécessité qu’il ne maîtrise pas entièrement.'},
    {term:'Hubris',category:'Mesure',definition:'L’hubris désigne une forme d’excès, de violence ou de transgression qui franchit les limites reconnues et porte atteinte à l’ordre des relations humaines ou divines. Elle peut concerner le pouvoir, la parole, la richesse, la victoire ou le rapport aux dieux.',nuance:'Traduire hubris uniquement par “orgueil” est trop pauvre. Le terme implique souvent une conduite concrète de démesure ou d’abus.',example:'Icare peut servir à réfléchir à la mesure, mais il ne faut pas prétendre qu’Ovide présente explicitement sa chute comme un traité de l’hubris.'},
    {term:'Némésis',category:'Mesure',definition:'Némésis peut désigner l’indignation légitime provoquée par un excès, puis la réaction qui rétablit une forme d’équilibre. Dans les réceptions modernes, le mot prend souvent le sens de sanction ou de puissance de rétribution.',nuance:'La “Némésis” n’est pas dans tous les récits une déesse qui intervient personnellement. Le terme peut désigner plus largement la réaction suscitée par une démesure.',example:'Utile dans les récits de faute, de retournement et de châtiment.'},
    {term:'Mètis',category:'Intelligence',definition:'La mètis est une intelligence pratique, souple et rusée : elle consiste à anticiper, tromper, détourner un obstacle, saisir le bon moment et adapter sa stratégie à une situation mouvante. Elle valorise moins la force brute que l’habileté.',nuance:'La mètis n’est pas simplement la “ruse” au sens moralement négatif. Chez les Grecs, elle peut être une compétence admirée et indispensable à l’action.',example:'Ulysse, Athéna, le cheval de Troie ou le fil d’Ariane illustrent différentes formes d’intelligence stratégique.'},
    {term:'Kleos',category:'Héroïsme',definition:'Kleos signifie renommée, réputation ou gloire transmise par la parole et le chant. Dans l’épopée, le héros peut rechercher une gloire qui survivra à sa propre mort dans la mémoire collective.',nuance:'Le kleos aide à comprendre un monde héroïque où l’existence individuelle est étroitement liée au regard des autres et à la transmission du nom.',example:'Achille accepte la perspective d’une vie brève en échange d’une gloire impérissable.'},
    {term:'Nostos',category:'Voyage',definition:'Nostos signifie le retour au foyer, particulièrement le retour des héros après la guerre de Troie. Le mot désigne à la fois le mouvement du retour et un type de récit consacré aux épreuves qui empêchent ou retardent ce retour.',nuance:'Dans l’Odyssée, revenir signifie plus que rentrer géographiquement : Ulysse doit retrouver son identité, sa maison, son épouse et sa place politique.',example:'L’Odyssée est le grand récit du nostos d’Ulysse vers Ithaque.'},
    {term:'Xenia',category:'Société',definition:'La xenia est la relation d’hospitalité qui lie celui qui reçoit et l’étranger accueilli. Elle implique des devoirs réciproques, des gestes codifiés, des cadeaux et une protection symbolique placée sous l’autorité de Zeus Xenios.',nuance:'L’hospitalité n’est donc pas seulement une vertu privée : elle organise les relations entre maisons, voyageurs et étrangers.',example:'L’Odyssée oppose constamment des formes justes et injustes d’accueil de l’étranger.'},
    {term:'Oracle',category:'Divination',definition:'Un oracle est une parole divine reçue par l’intermédiaire d’un sanctuaire, d’un prophète ou d’une procédure divinatoire. Il peut annoncer un événement, répondre à une question ou orienter une décision sans en livrer toutes les conséquences.',nuance:'L’oracle n’est pas nécessairement une prédiction simple et transparente : son sens peut être ambigu, incomplet ou compris trop tard.',example:'Les consultations de Delphes structurent l’histoire d’Œdipe et de nombreuses tragédies.'},
    {term:'Katabasis',category:'Au-delà',definition:'La katabasis est la descente d’un vivant vers le monde souterrain ou le royaume des morts. Ce déplacement place le héros à la frontière entre les vivants et les morts et produit souvent un savoir, une épreuve ou une transformation.',nuance:'Toutes les descentes ne fonctionnent pas de la même manière : certaines visent à ramener quelqu’un, d’autres à obtenir une information ou à accomplir un exploit.',example:'Orphée descend chercher Eurydice ; Héraclès ramène Cerbère ; Ulysse consulte les morts.'},
    {term:'Chthonien',category:'Au-delà',definition:'Est chthonien ce qui relève de la terre profonde, du sous-sol, des morts ou des puissances associées à ce domaine. Le terme vient de khthôn, “la terre” envisagée comme profondeur.',nuance:'Une divinité peut posséder plusieurs dimensions : Perséphone, par exemple, appartient au monde souterrain mais se trouve aussi liée au retour de la végétation.',example:'Hadès, Perséphone, les Érinyes ou certains cultes héroïques peuvent être qualifiés de chthoniens.'},
    {term:'Olympien',category:'Dieux',definition:'Le terme désigne les dieux associés à l’Olympe et, plus largement, l’ordre divin qui s’établit autour de Zeus après la victoire sur les Titans. Il marque donc autant une génération et un ordre politique du cosmos qu’un lieu.',nuance:'Les listes des “douze Olympiens” varient selon les traditions ; il ne faut pas chercher une liste unique absolument canonique.',example:'Zeus, Héra, Athéna, Apollon, Artémis, Hermès ou Poséidon appartiennent à l’ordre olympien.'},
    {term:'Titan',category:'Dieux',definition:'Les Titans appartiennent à la génération divine antérieure à Zeus dans la Théogonie hésiodique. Ils sont généralement issus de Gaïa et Ouranos et occupent une place centrale dans les récits de succession divine.',nuance:'Tous les Titans ne sont pas de simples ennemis des Olympiens : Prométhée, Thémis ou Océan ont des fonctions et des trajectoires différentes.',example:'Cronos, Rhéa, Japet, Océan, Prométhée et Atlas.'},
    {term:'Héros',category:'Figures',definition:'Dans la mythologie grecque, le héros est une figure exceptionnelle, généralement mortelle ou semi-divine, dont les exploits, les souffrances ou le destin sont conservés par la tradition. Il peut devenir fondateur, ancêtre, protecteur ou objet d’un culte.',nuance:'Le héros antique n’est pas forcément un modèle moral. Achille, Héraclès, Thésée ou Ulysse peuvent être admirés tout en demeurant violents, ambigus ou faillibles.',example:'Héraclès, Persée, Thésée, Achille, Ulysse, Jason.'},
    {term:'Métamorphose',category:'Transformation',definition:'La métamorphose est le passage d’un être à une autre forme : animal, végétal, minéral, constellation ou autre état d’existence. Dans le récit, elle peut fonctionner comme châtiment, fuite, protection, mémoire ou résolution d’une crise.',nuance:'La transformation ne signifie pas toujours disparition complète : elle peut conserver une trace de l’identité antérieure du personnage.',example:'Les Métamorphoses d’Ovide rassemblent de nombreux récits organisés autour de ce principe.'},
    {term:'Érinyes',category:'Justice',definition:'Les Érinyes sont des puissances anciennes liées à la poursuite des crimes graves, en particulier ceux commis au sein de la famille et contre les liens de sang. Elles incarnent une logique de vengeance et de dette qui dépasse la volonté individuelle.',nuance:'Dans les Euménides d’Eschyle, leur transformation est essentielle : la cité ne les supprime pas simplement, elle intègre leur exigence de justice dans un nouvel ordre institutionnel.',example:'Elles poursuivent Oreste après le meurtre de sa mère Clytemnestre.'}
  ];

  const PERSON_GUIDE = {
    'Zeus':{extra:'Il ne faut pas le réduire à un “roi tout-puissant” : son autorité se construit après une succession de conflits entre générations divines.',remember:'Souverain de l’ordre olympien, associé au ciel, aux serments et à la justice.'},
    'Athéna':{extra:'Elle représente une intelligence stratégique et technique : sa force est généralement liée à la mesure, au conseil et à l’organisation de la cité.',remember:'Intelligence pratique, stratégie et protection civique.'},
    'Ulysse':{extra:'Son héroïsme repose moins sur la puissance physique que sur la mètis : il survit en anticipant, en parlant et en organisant des détours.',remember:'Le héros de la ruse, du retour et de la maîtrise de soi.'},
    'Œdipe':{extra:'Sa grandeur tragique vient aussi de sa volonté de savoir : l’enquête qui sauve la cité devient l’enquête qui détruit son identité sociale.',remember:'Celui qui résout l’énigme du Sphinx mais doit encore résoudre l’énigme de sa propre vie.'},
    'Prométhée':{extra:'Selon les traditions, il est trompeur, protecteur, artisan ou civilisateur ; la réception moderne en a fait un symbole majeur de l’émancipation humaine.',remember:'Le feu, la technique et l’ambivalence du progrès humain.'},
    'Achille':{extra:'L’Iliade le montre partagé entre honneur, colère, amitié, deuil et conscience de sa propre mortalité.',remember:'Le héros de la gloire guerrière qui sait que sa vie sera brève.'},
    'Hector':{extra:'À la différence d’Achille, il est fortement défini par ses liens à la cité, à Andromaque, à son fils et à son devoir de défenseur de Troie.',remember:'Le héros troyen du devoir familial et civique.'},
    'Antigone':{extra:'Elle devient, chez Sophocle, le point de tension entre devoir envers les morts, autorité politique et conflit de normes.',remember:'Une figure majeure pour penser loi, conscience et devoir.'},
    'Orphée':{extra:'Son pouvoir n’est pas militaire : il agit par le chant et donne au mythe une réflexion sur l’art, la mémoire, la perte et les limites du pouvoir poétique.',remember:'Le poète capable d’émouvoir les morts, mais pas d’abolir définitivement la mort.'},
    'Dédale':{extra:'Il incarne le versant inventif de la technique : il construit le Labyrinthe puis doit inventer un moyen d’échapper à l’espace qu’il a contribué à rendre impraticable.',remember:'L’inventeur dont la technique peut à la fois enfermer et libérer.'},
    'Icare':{extra:'Sa chute est souvent interprétée comme une figure de la démesure, mais le récit porte aussi sur l’apprentissage difficile d’une puissance nouvelle.',remember:'La puissance technique sans maîtrise de la mesure.'},
    'Narcisse':{extra:'Chez Ovide, le problème n’est pas seulement “s’aimer trop” : Narcisse désire une image qu’il prend d’abord pour un autre être.',remember:'Une figure du désir capturé par l’image de soi.'},
    'Médée':{extra:'Magicienne, princesse de Colchide et étrangère, elle est indispensable à la réussite de Jason avant de devenir, dans la tragédie, une figure de rupture et de vengeance.',remember:'Aide décisive du héros devenue l’une des grandes figures tragiques de l’exil et de la vengeance.'},
    'Héraclès':{extra:'Ses travaux mettent constamment sa force au contact de monstres, d’espaces limites et de tâches qui exigent autre chose que la violence.',remember:'Le héros de l’épreuve, de l’endurance et de la purification.'},
    'Thésée':{extra:'La tradition athénienne en fait un héros civique : sa victoire sur le Minotaure est aussi intégrée à une mémoire politique d’Athènes.',remember:'Le héros athénien du Labyrinthe et du Minotaure.'},
    'Ariane':{extra:'Elle ne se réduit pas au “fil” : elle est la condition de possibilité de la victoire et du retour de Thésée, puis possède ses propres traditions liées à Dionysos.',remember:'Celle qui rend possible la sortie du Labyrinthe.'},
    'Hadès':{extra:'Il n’est pas l’équivalent grec du diable : il est le souverain d’un domaine nécessaire de l’ordre cosmique, celui des morts.',remember:'Le dieu du monde souterrain, distinct d’une figure du mal absolu.'},
    'Déméter':{extra:'Son deuil transforme une douleur familiale en crise cosmique : la fertilité de la terre dépend du rapport entre la mère et la fille.',remember:'La déesse des moissons dont le deuil suspend la fécondité du monde.'},
    'Perséphone':{extra:'Elle appartient aux deux mondes : fille de Déméter et souveraine auprès d’Hadès, elle matérialise un passage entre vie, mort et retour.',remember:'Une figure de frontière entre monde des vivants et monde des morts.'},
    'Apollon':{extra:'À Delphes, sa parole oraculaire révèle sans toujours rendre immédiatement intelligible : savoir ce qui est annoncé ne signifie pas savoir comment l’éviter.',remember:'Dieu de l’oracle, de la musique et d’une vérité souvent énigmatique.'},
    'Hermès':{extra:'Il traverse les frontières : entre dieux et humains, vivants et morts, parole et ruse. Cette mobilité explique la diversité de ses fonctions.',remember:'Messager, passeur et figure de la ruse.'},
    'Aphrodite':{extra:'Elle représente une puissance du désir qui agit sur dieux et humains ; les traditions divergent fortement sur sa naissance.',remember:'La puissance divine du désir et de l’attraction.'},
    'Oreste':{extra:'Son geste de vengeance crée un conflit insoluble entre deux obligations : venger le père et ne pas verser le sang maternel.',remember:'Le personnage par lequel la vengeance familiale devient une question de justice publique.'},
    'Agamemnon':{extra:'Chef de l’expédition achéenne contre Troie, il est aussi pris dans la violence des Atrides et dans le sacrifice d’Iphigénie.',remember:'Pouvoir militaire, faute familiale et retour meurtrier.'},
    'Clytemnestre':{extra:'Son meurtre d’Agamemnon est lié à la fois à la vengeance d’Iphigénie, au pouvoir et au cycle antérieur de violences familiales.',remember:'Une figure tragique où vengeance, pouvoir et maternité se croisent.'},
    'Sphinx':{extra:'L’énigme qu’il impose à Thèbes transforme la parole en épreuve : Œdipe sait répondre à une question sur l’être humain sans encore savoir qui il est lui-même.',remember:'L’énigme vaincue qui prépare une énigme plus profonde : l’identité d’Œdipe.'},
    'Sirènes':{extra:'Leur pouvoir repose sur la voix et le désir de savoir ou d’entendre : elles ne sont pas simplement des monstres physiques à combattre.',remember:'Le danger d’un chant auquel on consent précisément parce qu’il attire.'},
    'Minotaure':{extra:'Enfermé au centre du Labyrinthe, il concentre plusieurs thèmes : monstruosité, pouvoir de Minos, sacrifice imposé et frontière entre humain et animal.',remember:'Le monstre du Labyrinthe, au cœur du cycle de Thésée.'},
    'Méduse':{extra:'Son regard pétrifie ; Persée doit donc vaincre indirectement, en utilisant un reflet plutôt qu’en affrontant le danger face à face.',remember:'Une figure du regard mortel vaincue par une stratégie de détour.'}
  };

  const PLACE_GUIDE = {
    'Mont Olympe':{modern:'Massif de l’Olympe · nord de la Grèce',use:'Repère symbolique pour situer l’ordre olympien ; les poètes en font la demeure privilégiée des dieux, sans qu’il faille imaginer une “capitale divine” cartographiable au sens moderne.',geo:[40.085,22.358]},
    'Delphes':{modern:'Phocide · Grèce centrale',use:'Sanctuaire majeur d’Apollon. Dans les récits tragiques, Delphes compte parce qu’une parole oraculaire y met souvent l’action en mouvement sans en livrer immédiatement le sens.',geo:[38.482,22.501]},
    'Thèbes':{modern:'Béotie · Grèce centrale',use:'Cœur du cycle thébain : Cadmos, le Sphinx, Œdipe, Antigone, Étéocle et Polynice. C’est l’un des lieux les plus importants pour comprendre la tragédie grecque.',geo:[38.325,23.318]},
    'Mycènes':{modern:'Argolide · Péloponnèse',use:'La tradition associe Mycènes à Agamemnon et à la maison des Atrides. Le lieu permet de relier la guerre de Troie aux drames du retour et de la vengeance familiale.',geo:[37.731,22.756]},
    'Athènes':{modern:'Attique · Grèce',use:'Athéna, Thésée et plusieurs récits de fondation s’y rattachent. Chez Eschyle, Athènes devient surtout l’espace où le conflit d’Oreste est transformé en jugement institutionnel.',geo:[37.984,23.728]},
    'Crète · Cnossos':{modern:'Crète · Grèce',use:'Le cycle de Minos y rassemble Labyrinthe, Minotaure, Ariane, Dédale et Thésée. C’est le meilleur lieu pour suivre le thème d’une technique qui organise l’espace, l’enfermement et la sortie.',geo:[35.298,25.163]},
    'Troie':{modern:'Hisarlık · nord-ouest de la Turquie',use:'La cité du grand cycle troyen. L’Iliade se concentre sur une courte période du siège, mais Troie devient le centre d’un réseau de récits sur la guerre, la gloire, la perte et les retours.',geo:[39.957,26.239]},
    'Ithaque':{modern:'Îles Ioniennes · Grèce',use:'Royaume d’Ulysse et horizon de l’Odyssée. Plus qu’un simple point d’arrivée, Ithaque donne au voyage son sens : revenir à son foyer, à son identité et à ses liens.',geo:[38.367,20.718]},
    'Colchide':{modern:'Région antique de la côte orientale de la mer Noire · Géorgie actuelle',use:'Destination des Argonautes et patrie de Médée. Pour un lecteur grec, elle marque aussi une extrémité lointaine du monde parcouru par les héros.',geo:[42.25,42.7]},
    'Hadès':{modern:'Espace mythique · non cartographiable',use:'Le mot peut désigner le dieu et le domaine des morts. Les récits y organisent une frontière fondamentale : un vivant peut parfois y descendre, mais le retour reste exceptionnel.',geo:null},
    'Champs Élysées':{modern:'Espace de l’au-delà · traditions variables',use:'Ils représentent une forme d’au-delà heureux, mais leur place et leur fonction changent selon les auteurs et les époques.',geo:null},
    'Ogygie':{modern:'Île mythique de localisation incertaine',use:'Lieu où Calypso retient Ulysse. Son intérêt est narratif : une île hors du monde ordinaire où le retour du héros est suspendu.',geo:null},
    'Île des Sirènes':{modern:'Lieu mythique de localisation indéterminée',use:'Le récit homérique ne demande pas de la situer précisément : l’essentiel est la fonction de l’espace, seuil dangereux où le désir d’entendre peut interrompre définitivement le retour.',geo:null},
    'Styx':{modern:'Fleuve mythique de l’au-delà',use:'Le Styx marque une frontière du monde infernal et fonctionne comme un puissant symbole de passage et d’engagement. Les dieux eux-mêmes jurent par le Styx dans la tradition hésiodique.',geo:null},
    'Tartare':{modern:'Profondeur mythique du cosmos',use:'Plus profond que le simple séjour des morts, le Tartare est présenté comme un espace d’enfermement et de châtiment où sont notamment reléguées certaines puissances vaincues.',geo:null}
  };

  const GENEALOGIES = {
    origines:{label:'Origines du cosmos',title:'Des puissances premières aux Olympiens',version:'Schéma simplifié · Hésiode',intro:'Le fil essentiel de la Théogonie : les générations divines se succèdent par conflits jusqu’à l’ordre olympien.',generations:[
      ['Puissances premières',['Chaos','Gaïa','Tartare','Éros']],
      ['Premiers descendants',['Gaïa + Ouranos','Titans · Cyclopes · Hécatonchires']],
      ['Titans',['Cronos + Rhéa','Océan','Japet','Thémis']],
      ['Olympiens',['Zeus','Héra','Poséidon','Hadès','Déméter','Hestia']]
    ],note:'La Théogonie contient beaucoup plus de filiations ; cette vue ne conserve que celles qui permettent de comprendre le passage des puissances premières aux Olympiens.'},
    olympiens:{label:'Famille olympienne',title:'Autour de Zeus',version:'Traditions principales',intro:'Une vue volontairement réduite des grands dieux olympiens et de quelques filiations fréquemment mobilisées dans les récits.',generations:[
      ['Parents',['Cronos + Rhéa']],
      ['Fratrie',['Zeus','Héra','Poséidon','Hadès','Déméter','Hestia']],
      ['Enfants de Zeus',['Athéna','Apollon','Artémis','Hermès','Arès','Dionysos']],
      ['À part',['Aphrodite · née de l’écume chez Hésiode','Héphaïstos · filiation variable selon les sources']]
    ],note:'Les traditions divergent sur certaines naissances. Aphrodite, Héphaïstos, Éros et plusieurs autres figures ont des généalogies différentes selon les auteurs.'},
    labdacides:{label:'Labdacides',title:'La lignée d’Œdipe',version:'Cycle thébain · simplifié',intro:'La catastrophe d’Œdipe s’inscrit dans une histoire familiale plus longue : la malédiction et la violence traversent plusieurs générations de Thèbes.',generations:[
      ['Fondation',['Cadmos']],
      ['Lignée royale',['Polydore','Labdacos']],
      ['Parents d’Œdipe',['Laïos + Jocaste']],
      ['Œdipe',['Œdipe + Jocaste']],
      ['Enfants',['Antigone','Ismène','Étéocle','Polynice']]
    ],note:'La forme de l’arbre et certains détails varient selon les traditions. Ici, la priorité est donnée aux relations nécessaires pour lire Œdipe roi et Antigone.'},
    atrides:{label:'Atrides',title:'Une famille prise dans la vengeance',version:'Cycle des Atrides',intro:'Des crimes de la génération précédente au procès d’Oreste, la lignée montre comment la vengeance familiale se reproduit.',generations:[
      ['Ancêtres',['Tantale','Pélops']],
      ['Frères rivaux',['Atrée','Thyeste']],
      ['Maison d’Atrée',['Agamemnon + Clytemnestre','Ménélas + Hélène']],
      ['Enfants d’Agamemnon',['Iphigénie','Électre','Oreste']]
    ],note:'L’Orestie d’Eschyle ne raconte qu’une partie de cette lignée mais suppose l’arrière-plan des violences antérieures.'},
    troyens:{label:'Maison de Troie',title:'De Tros à Hector et Paris',version:'Tradition troyenne · simplifiée',intro:'Une lignée minimale pour situer Priam, Hector, Paris et Cassandre dans la maison royale de Troie.',generations:[
      ['Ancêtres',['Dardanos','Tros']],
      ['Rois',['Ilos','Laomédon']],
      ['Priam',['Priam + Hécube']],
      ['Enfants repères',['Hector','Paris','Cassandre','Hélénos']]
    ],note:'Le cycle troyen comprend de nombreux personnages et branches collatérales ; cette vue vise seulement les repères indispensables.'}
  };

  const PLACES = [
    {name:'Mont Olympe',zone:'monde réel',kind:'Montagne · Grèce',summary:'Montagne réelle devenue dans l’imaginaire poétique la demeure privilégiée des dieux olympiens.',links:['Zeus','Olympiens','ordre divin']},
    {name:'Delphes',zone:'monde réel',kind:'Sanctuaire · Phocide',summary:'Grand sanctuaire d’Apollon et lieu de consultation oraculaire, essentiel pour comprendre Œdipe et de nombreux récits tragiques.',links:['Apollon','oracle','Œdipe']},
    {name:'Thèbes',zone:'monde réel',kind:'Cité · Béotie',summary:'Cité du cycle de Cadmos, Œdipe, Antigone, Étéocle et Polynice.',links:['Œdipe','Antigone','Sphinx']},
    {name:'Mycènes',zone:'monde réel',kind:'Cité · Péloponnèse',summary:'Associée à Agamemnon et à la maison des Atrides dans une grande partie de la tradition.',links:['Agamemnon','Oreste','Atrides']},
    {name:'Athènes',zone:'monde réel',kind:'Cité · Attique',summary:'Cité d’Athéna et de Thésée ; dans les Euménides, elle devient aussi le lieu du tribunal d’Oreste.',links:['Athéna','Thésée','Oreste']},
    {name:'Crète · Cnossos',zone:'monde réel',kind:'Île · mer Égée',summary:'Espace associé à Minos, au Labyrinthe, au Minotaure, à Ariane et à Dédale.',links:['Minos','Minotaure','Dédale']},
    {name:'Troie',zone:'monde réel',kind:'Asie Mineure · tradition épique',summary:'Cité assiégée par les Achéens dans le cycle troyen ; lieu central de l’Iliade.',links:['Hector','Paris','Achille']},
    {name:'Ithaque',zone:'monde réel',kind:'Île · mer Ionienne',summary:'Royaume d’Ulysse et but de son long retour dans l’Odyssée.',links:['Ulysse','Pénélope','retour']},
    {name:'Colchide',zone:'monde réel',kind:'Rive orientale de la mer Noire',summary:'Destination des Argonautes et terre de Médée dans la quête de la Toison d’or.',links:['Jason','Médée','Toison d’or']},
    {name:'Hadès',zone:'espace mythique',kind:'Monde souterrain',summary:'Royaume des morts gouverné par Hadès et Perséphone ; Orphée y descend pour chercher Eurydice.',links:['Hadès','Perséphone','Orphée']},
    {name:'Champs Élysées',zone:'espace mythique',kind:'Au-delà',summary:'Espace heureux de l’au-delà dont la représentation change selon les époques et les auteurs.',links:['mort','héros','au-delà']},
    {name:'Ogygie',zone:'espace mythique',kind:'Île de Calypso',summary:'Île où Calypso retient Ulysse pendant une partie de son retour.',links:['Ulysse','Calypso','retour']},
    {name:'Île des Sirènes',zone:'espace mythique',kind:'Espace du voyage d’Ulysse',summary:'Lieu indéterminé du récit homérique où le chant met à l’épreuve le désir et la maîtrise de soi.',links:['Ulysse','Sirènes','désir']},
    {name:'Styx',zone:'espace mythique',kind:'Fleuve-frontière de l’au-delà',summary:'Fleuve associé au monde des morts et aux serments divins ; il matérialise une frontière qu’on ne franchit pas comme un simple cours d’eau.',links:['frontière','Hadès','serment']},
    {name:'Tartare',zone:'espace mythique',kind:'Profondeur cosmique',summary:'Région très profonde du cosmos, distincte du séjour ordinaire des morts et associée à l’enfermement de puissances vaincues.',links:['Titans','châtiment','cosmos']}
  ];

  const ROUTES = [
    {title:'Découvrir la mythologie grecque',subtitle:'5 étapes · les grands repères',intro:'Un parcours général qui passe de la naissance du monde à l’âge des héros puis aux grands cycles tragiques et épiques.',steps:[
      ['Cosmogonie','Comprendre d’abord comment dieux et monde prennent place.','/textes/hesiode-cosmogonie-chaos-gaia-eros/'],
      ['Prométhée','Voir comment la condition humaine se distingue de celle des dieux.','/textes/hesiode-promethee-vol-feu/'],
      ['Œdipe','Entrer dans le rapport entre oracle, vérité et responsabilité.','/textes/sophocle-oedipe-verite-destin/'],
      ['Guerre de Troie','Situer le grand cycle héroïque de l’Iliade.',''],
      ['Ulysse et les Sirènes','Passer de la gloire guerrière à la ruse et à la maîtrise de soi.','/textes/homere-ulysse-sirenes-maitrise-desir/']
    ]},
    {title:'Destin, liberté, responsabilité',subtitle:'4 étapes · philosophie',intro:'Pour voir comment les récits mythiques mettent en scène la tension entre ce qui est annoncé et ce que les personnages choisissent.',steps:[
      ['Œdipe','Le cas le plus net : fuir l’oracle contribue à son accomplissement.','/textes/sophocle-oedipe-verite-destin/'],
      ['Achille','Le héros connaît deux destins possibles et choisit une gloire brève.',''],
      ['Ulysse','La liberté prend la forme d’une organisation volontaire de la contrainte.','/textes/homere-ulysse-sirenes-maitrise-desir/'],
      ['Icare','La puissance n’abolit pas la responsabilité devant la limite.','/textes/ovide-icare-voler-trop-haut/']
    ]},
    {title:'Technique : puissance et limite',subtitle:'4 étapes · philosophie',intro:'Un parcours particulièrement utile pour penser la technique au programme de philosophie.',steps:[
      ['Prométhée','Le feu représente l’accroissement de la puissance humaine.','/textes/hesiode-promethee-vol-feu/'],
      ['Dédale','La technique apparaît comme intelligence inventive et moyen d’évasion.','/textes/ovide-icare-voler-trop-haut/'],
      ['Icare','Une puissance nouvelle exige une capacité de mesure.','/textes/ovide-icare-voler-trop-haut/'],
      ['Le Labyrinthe','Une invention peut aussi produire l’enfermement auquel une autre invention doit répondre.','']
    ]},
    {title:'Hubris, faute et châtiment',subtitle:'4 étapes · mesure',intro:'Pour comprendre pourquoi la transgression de la limite est un motif si fréquent dans les récits antiques.',steps:[
      ['Prométhée','La transgression touche au partage des pouvoirs entre dieux et humains.','/textes/hesiode-promethee-vol-feu/'],
      ['Icare','Le dépassement de la mesure transforme la liberté en chute.','/textes/ovide-icare-voler-trop-haut/'],
      ['Narcisse','L’enfermement dans son propre désir conduit à l’impossibilité de vivre.','/textes/ovide-narcisse-reflet-desir-identite/'],
      ['Niobé / autres récits','Approfondir ensuite la logique de l’orgueil face aux dieux.','']
    ]},
    {title:'Ruse, intelligence et parole',subtitle:'4 étapes · HLP / philosophie',intro:'Des récits où l’intelligence passe moins par la force que par la parole, le détour et l’anticipation.',steps:[
      ['Œdipe et le Sphinx','La réponse à une énigme libère une cité mais ne garantit pas la connaissance de soi.','/textes/sophocle-oedipe-verite-destin/'],
      ['Ulysse','La mètis permet de survivre à ce que la force ne pourrait vaincre.','/textes/homere-ulysse-sirenes-maitrise-desir/'],
      ['Ariane et le fil','Un dispositif simple rend praticable un espace conçu pour perdre celui qui y entre.',''],
      ['Hermès','La ruse, le langage et la médiation deviennent des attributs divins.','']
    ]},
    {title:'Famille, pouvoir et violence',subtitle:'4 étapes · tragédie',intro:'Les grandes lignées tragiques permettent de suivre la manière dont une violence privée se transmet d’une génération à l’autre.',steps:[
      ['Labdacides','Commencer par Laïos, Œdipe et la catastrophe de la vérité.','/textes/sophocle-oedipe-verite-destin/'],
      ['Antigone','Passer du drame familial au conflit entre loi de la cité et devoir envers les morts.',''],
      ['Atrides','Observer une seconde lignée structurée par le meurtre et la vengeance.',''],
      ['Oreste','Voir comment le tribunal cherche à interrompre la répétition de la vengeance.','/textes/eschyle-oreste-tribunal-justice/']
    ]},
    {title:'Mort, perte et monde des morts',subtitle:'4 étapes · existence / art',intro:'Des récits qui donnent différentes formes au passage entre vivants et morts.',steps:[
      ['Déméter et Perséphone','La disparition devient un cycle de séparation et de retour.',''],
      ['Héraclès et Cerbère','Le héros franchit la frontière du monde infernal comme épreuve.',''],
      ['Orphée et Eurydice','L’art semble abolir la frontière, mais seulement pour un instant.','/textes/ovide-orphee-eurydice-regard-interdit/'],
      ['Achille','La gloire héroïque prend sens sur fond de mortalité assumée.','']
    ]},
    {title:'Mythes utiles en philosophie',subtitle:'5 étapes · références',intro:'Un itinéraire directement orienté vers des usages possibles dans une dissertation ou une explication de texte.',steps:[
      ['Prométhée → Technique','Puissance, autonomie et responsabilité.','/textes/hesiode-promethee-vol-feu/'],
      ['Œdipe → Vérité / Liberté','Connaissance de soi, ignorance et responsabilité.','/textes/sophocle-oedipe-verite-destin/'],
      ['Ulysse → Liberté / Désir','Se contraindre pour ne pas devenir l’esclave d’un désir.','/textes/homere-ulysse-sirenes-maitrise-desir/'],
      ['Oreste → Justice / État','Passage de la vengeance au jugement institutionnel.','/textes/eschyle-oreste-tribunal-justice/'],
      ['Narcisse → Conscience / Désir','Confusion entre soi, image de soi et objet du désir.','/textes/ovide-narcisse-reflet-desir-identite/']
    ]}
  ];

  const TYPE_LABELS = {all:'Tous',primordial:'Primordiaux',titan:'Titans',dieu:'Dieux',heros:'Héros',mortel:'Mortels',creature:'Créatures'};
  const CYCLES = [...new Set(MYTHS.map(m => m.cycle))];
  const GENEALOGY_GUIDE = {
    origines:{points:['Trois générations structurent l’essentiel : puissances premières, Titans, Olympiens.','La succession divine passe par des conflits de souveraineté.','Zeus stabilise finalement un nouvel ordre olympien.'],myth:'cosmogonie'},
    olympiens:{points:['Zeus occupe le centre d’un réseau de fratries et de descendances.','Toutes les divinités ne possèdent pas une généalogie unique selon les auteurs.','L’arbre sert surtout à situer rapidement les grands Olympiens.'],myth:'promethee'},
    labdacides:{points:['La catastrophe d’Œdipe appartient à une histoire familiale antérieure.','Œdipe est à la fois fils et époux de Jocaste : le nœud tragique est aussi généalogique.','La génération suivante prolonge la crise avec Antigone, Étéocle et Polynice.'],myth:'oedipe'},
    atrides:{points:['Les violences se transmettent d’une génération à l’autre.','Agamemnon et Clytemnestre se trouvent au centre du cycle de vengeance.','Avec Oreste, la question devient : comment sortir juridiquement de la vengeance privée ?'],myth:'oreste'},
    troyens:{points:['Priam et Hécube forment le centre de la maison royale de Troie.','Hector et Paris incarnent deux rapports très différents à la guerre et au devoir.','Cette branche suffit pour situer les figures troyennes majeures de l’Iliade.'],myth:'troie'}
  };

  const cycleFilters = document.querySelector('[data-myth-cycle-filters]');
  const mythList = document.querySelector('[data-myth-list]');
  const mythDetail = document.querySelector('[data-myth-detail]');
  const mythCount = document.querySelector('[data-myth-count]');
  const mythCycleTitle = document.querySelector('[data-myth-cycle-title]');

  const personFilters = document.querySelector('[data-myth-person-filters]');
  const personAlphabet = document.querySelector('[data-myth-person-alphabet]');
  const personSearch = document.querySelector('[data-myth-person-search]');
  const personList = document.querySelector('[data-myth-person-list]');
  const personDetail = document.querySelector('[data-myth-person-detail]');
  const personCount = document.querySelector('[data-myth-person-count]');

  const genealogyTabs = document.querySelector('[data-myth-genealogy-tabs]');
  const genealogyPanel = document.querySelector('[data-myth-genealogy-panel]');
  const genealogySearch = document.querySelector('[data-myth-genealogy-search-input]');
  const genealogySearchResults = document.querySelector('[data-myth-genealogy-search-results]');
  const worldTabs = document.querySelector('[data-myth-world-tabs]');
  const worldPanel = document.querySelector('[data-myth-world-panel]');
  const routeSelector = document.querySelector('[data-myth-route-selector]');
  const routeDetail = document.querySelector('[data-myth-route-detail]');

  const vocabDetail = document.querySelector('[data-myth-vocab-detail]');
  const vocabStarters = document.querySelector('[data-myth-vocab-starters]');
  const jumpWrap = document.querySelector('.myth-compass-jump-wrap');
  const jumpNav = jumpWrap?.querySelector('.myth-compass-jump');
  let activeVocab = '';

  const globalSearch = document.querySelector('[data-myth-search-input]');
  const globalClear = document.querySelector('[data-myth-search-clear]');
  const globalResults = document.querySelector('[data-myth-search-results]');

  let activeCycle = 'Origines';
  let activeMyth = MYTHS.find(m => m.cycle === activeCycle)?.id || MYTHS[0].id;
  let activePersonType = 'all';
  let activePersonLetter = 'all';
  let activePerson = 'Zeus';
  let activeGenealogy = 'origines';
  let genealogySearchHit = '';
  let activeWorldView = 'cosmos';
  let activePlace = 'Hadès';
  let activeRoute = 0;

  const textOrDash = value => value && String(value).trim() ? value : '—';
  const letterOf = name => normalize(name).charAt(0).toUpperCase();

  function renderCycleNav(){
    cycleFilters.innerHTML = CYCLES.map(cycle => {
      const count = MYTHS.filter(m => m.cycle === cycle).length;
      return `<button type="button" class="myth-cycle-button${cycle===activeCycle?' is-active':''}" data-cycle="${esc(cycle)}"><span>${esc(cycle)}</span><small>${count} récit${count>1?'s':''}</small></button>`;
    }).join('');
  }

  function renderMythDetail(){
    const m = MYTHS.find(x => x.id === activeMyth) || MYTHS.find(x => x.cycle === activeCycle) || MYTHS[0];
    const guide = MYTH_GUIDE[m.id] || {detail:m.summary,key:''};
    activeMyth = m.id;
    mythDetail.innerHTML = `
      <div class="myth-story-detail-top"><span class="myth-story-cycle">${esc(m.cycle)}</span><span class="myth-story-level">${esc(m.level)}</span></div>
      <h3>${esc(m.title)}</h3>
      <p class="myth-story-summary">${esc(m.summary)}</p>
      <div class="myth-story-narrative"><span>Le fil du récit</span><p>${esc(guide.detail)}</p></div>
      <div class="myth-story-key"><i aria-hidden="true">→</i><p>${esc(guide.key)}</p></div>
      <div class="myth-story-facts">
        <div><span>Source principale</span><strong>${esc(m.source)}</strong></div>
        <div><span>Figures</span><div class="myth-inline-links">${m.people.map(name => `<button type="button" data-person-from-myth="${esc(name)}">${esc(name)}</button>`).join('')}</div></div>
        <div><span>À penser</span><div class="myth-theme-tags">${m.themes.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
      </div>
      ${m.url ? `<a class="myth-story-read" href="${esc(m.url)}">Lire la fiche du texte <span aria-hidden="true">→</span></a>` : `<p class="myth-story-quiet">Repère de la boussole · pas encore de fiche dédiée.</p>`}`;
  }

  function renderMythBrowser(){
    const items = MYTHS.filter(m => m.cycle === activeCycle);
    if (!items.some(m => m.id === activeMyth)) activeMyth = items[0]?.id || MYTHS[0].id;
    mythCycleTitle.textContent = activeCycle;
    mythCount.textContent = `${items.length} récit${items.length>1?'s':''}`;
    mythList.innerHTML = items.map((m,i) => `<button type="button" class="myth-story-row${m.id===activeMyth?' is-active':''}" data-myth-id="${esc(m.id)}"><span class="myth-story-row-num">${String(i+1).padStart(2,'0')}</span><span class="myth-story-row-copy"><strong>${esc(m.title)}</strong><small>${esc(m.source)}</small></span><span class="myth-story-row-arrow" aria-hidden="true">→</span></button>`).join('');
    renderCycleNav();
    renderMythDetail();
  }

  function renderPersonFilters(){
    personFilters.innerHTML = Object.entries(TYPE_LABELS).map(([key,label]) => `<button class="myth-filter-chip${key===activePersonType?' is-active':''}" type="button" data-person-type="${key}">${label}</button>`).join('');
  }

  function renderPersonAlphabet(){
    const letters = [...new Set(PEOPLE.map(p => letterOf(p.name)))].sort((a,b)=>a.localeCompare(b,'fr'));
    personAlphabet.innerHTML = `<button type="button" class="${activePersonLetter==='all'?'is-active':''}" data-person-letter="all">Tout</button>` + letters.map(letter => `<button type="button" class="${letter===activePersonLetter?'is-active':''}" data-person-letter="${esc(letter)}">${esc(letter)}</button>`).join('');
  }

  function filteredPeople(){
    const q = normalize(personSearch?.value || '');
    return PEOPLE.filter(p => {
      const typeOK = activePersonType === 'all' || p.type === activePersonType;
      const letterOK = activePersonLetter === 'all' || letterOf(p.name) === activePersonLetter;
      const queryOK = !q || normalize([p.name,p.description,p.relations,p.myths,p.themes,p.type].join(' ')).includes(q);
      return typeOK && letterOK && queryOK;
    }).sort((a,b)=>a.name.localeCompare(b.name,'fr'));
  }

  function personRelationLinks(raw){
    return String(raw).split('·').map(x=>x.trim()).filter(Boolean).map(name => {
      const exact = PEOPLE.find(p => p.name === name);
      return exact ? `<button type="button" data-person-jump="${esc(name)}">${esc(name)}</button>` : `<span>${esc(name)}</span>`;
    }).join('');
  }

  function renderPersonDetail(){
    const p = PEOPLE.find(item => item.name === activePerson);
    if (!p){ personDetail.innerHTML = `<div class="myth-person-empty"><strong>Aucune fiche à afficher</strong><p>Modifiez les filtres ou la recherche.</p></div>`; return; }
    const relatedMyths = MYTHS.filter(m => m.people.includes(p.name));
    const guide = PERSON_GUIDE[p.name] || {};
    const genericExtra = p.type === 'primordial' ? 'Cette figure appartient aux puissances qui précèdent l’ordre olympien et aide à comprendre la construction progressive du cosmos.' : p.type === 'titan' ? 'Elle appartient à la génération divine antérieure à l’ordre de Zeus et permet de suivre les conflits de succession entre puissances divines.' : p.type === 'dieu' ? 'Cette figure appartient au réseau divin qui structure de nombreux récits : ses fonctions se comprennent toujours mieux en relation avec les autres dieux et les héros.' : p.type === 'heros' ? 'Comme beaucoup de héros grecs, cette figure n’est pas un modèle moral parfait : son récit met plutôt à l’épreuve une capacité, une limite ou un choix.' : p.type === 'creature' ? 'Dans le récit, la créature fonctionne comme une épreuve, une frontière ou une menace qui oblige le héros à modifier sa manière d’agir.' : 'Cette figure humaine donne au récit un point d’ancrage concret dans les conflits de famille, de pouvoir, de désir ou de responsabilité.';
    const remember = guide.remember || `${TYPE_LABELS[p.type] || p.type} · ${String(p.themes).split('·').map(x=>x.trim()).filter(Boolean).join(' · ')}`;
    personDetail.innerHTML = `
      <div class="myth-person-detail-kicker"><span>${esc(TYPE_LABELS[p.type] || p.type)}</span><small>${relatedMyths.length ? `${relatedMyths.length} récit${relatedMyths.length>1?'s':''} repéré${relatedMyths.length>1?'s':''}` : 'figure de repère'}</small></div>
      <h3>${esc(p.name)}</h3>
      <p class="myth-person-definition">${esc(p.description)} ${esc(guide.extra || genericExtra)}</p>
      <div class="myth-person-memory"><span>En une phrase</span><strong>${esc(remember)}</strong></div>
      <div class="myth-person-detail-sections">
        <section><span>Relations</span><div class="myth-related-links">${personRelationLinks(p.relations)}</div></section>
        <section><span>Récits</span><p>${esc(textOrDash(p.myths))}</p>${relatedMyths.length ? `<div class="myth-related-myths">${relatedMyths.map(m => `<button type="button" data-myth-from-person="${esc(m.id)}">${esc(m.title)}</button>`).join('')}</div>` : ''}</section>
        <section><span>À penser</span><div class="myth-theme-tags">${String(p.themes).split('·').map(t=>t.trim()).filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join('')}</div></section>
      </div>
      ${p.url ? `<a class="myth-person-read" href="${esc(p.url)}">Lire le texte associé <span aria-hidden="true">→</span></a>` : ''}`;
  }

  function renderPeople(){
    const items = filteredPeople();
    if (!items.some(p => p.name === activePerson)) activePerson = items[0]?.name || '';
    personCount.textContent = `${items.length} figure${items.length>1?'s':''}`;
    personList.innerHTML = items.length ? items.map(p => `<button type="button" class="myth-person-row${p.name===activePerson?' is-active':''}" data-person="${esc(p.name)}"><span class="myth-person-monogram">${esc(p.name.charAt(0))}</span><span><strong>${esc(p.name)}</strong><small>${esc(TYPE_LABELS[p.type] || p.type)} · ${esc(p.myths)}</small></span><span aria-hidden="true">→</span></button>`).join('') : `<div class="myth-person-empty"><strong>Aucun résultat</strong><p>Essayez un autre nom ou élargissez les filtres.</p></div>`;
    renderPersonFilters();
    renderPersonAlphabet();
    renderPersonDetail();
  }

  function familyNode(text){
    if (text.includes(' · ')) return `<div class="myth-family-node myth-family-node--group">${text.split(' · ').map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
    if (text.includes(' + ')) return `<div class="myth-family-node myth-family-node--couple">${text.split(' + ').map((x,i)=>`${i?'<i aria-hidden="true">+</i>':''}<span>${esc(x)}</span>`).join('')}</div>`;
    return `<div class="myth-family-node"><span>${esc(text)}</span></div>`;
  }

  function renderGenealogyTabs(){
    genealogyTabs.innerHTML = Object.entries(GENEALOGIES).map(([key,g],i) => `<button type="button" role="tab" aria-selected="${key===activeGenealogy}" class="${key===activeGenealogy?'is-active':''}" data-genealogy="${key}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(g.label)}</strong></button>`).join('');
  }

  function renderGenealogy(){
    const g = GENEALOGIES[activeGenealogy] || GENEALOGIES.origines;
    const guide = GENEALOGY_GUIDE[activeGenealogy] || {points:[],myth:''};
    const related = MYTHS.find(m => m.id === guide.myth);
    genealogyPanel.innerHTML = `
      <div class="myth-genealogy-layout">
        <div class="myth-family-tree-card">
          <div class="myth-family-tree-head"><div><span>${esc(g.version)}</span><h3>${esc(g.title)}</h3></div><p>${esc(g.intro)}</p></div><div class="myth-family-tree-legend"><span><i></i> génération</span><span><i></i> couple / groupe</span><small>${g.generations.length} niveaux de lecture</small></div>
          <div class="myth-family-tree">${g.generations.map(([label,members],index) => `<div class="myth-family-level" style="--family-level:${index}"><span class="myth-family-level-label"><i>${String(index+1).padStart(2,'0')}</i>${esc(label)}</span><div class="myth-family-level-nodes">${members.map(familyNode).join('')}</div></div>${index<g.generations.length-1?'<div class="myth-family-connector" aria-hidden="true"><span></span><i>↓</i></div>':''}`).join('')}</div>
        </div>
        <aside class="myth-family-reading">
          <span class="myth-family-reading-kicker">À retenir</span>
          <ol>${guide.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ol>
          <div class="myth-family-variation"><strong>Variantes</strong><p>${esc(g.note)}</p></div>
          ${related ? `<button type="button" data-genealogy-myth="${esc(related.id)}">Voir le récit associé <span aria-hidden="true">→</span></button>` : ''}
        </aside>
      </div>`;
    if (genealogySearchHit) {
      const target = normalize(genealogySearchHit);
      let hitElement = null;
      genealogyPanel.querySelectorAll('.myth-family-node span').forEach(span => {
        const isHit = normalize(span.textContent) === target;
        span.classList.toggle('is-search-hit', isHit);
        if (isHit && !hitElement) hitElement = span;
      });
      if (hitElement) requestAnimationFrame(() => hitElement.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}));
    }
    renderGenealogyTabs();
  }

  const GENEALOGY_NAME_INDEX = (() => {
    const rows = [];
    Object.entries(GENEALOGIES).forEach(([key,g]) => {
      g.generations.forEach(([generation,members]) => {
        members.forEach(member => {
          member.split(/\s+(?:\+|·)\s+/).map(x=>x.trim()).filter(Boolean).forEach(name => {
            if (!/^[A-ZÀ-ÖØ-ÞŒÉÈÊËÎÏÔÖÙÛÜÇ]/.test(name)) return;
            if (/^(Traditions?|Filiation|Née|Né|Selon|Maison|Cycle)/i.test(name)) return;
            rows.push({name,key,family:g.label,generation});
          });
        });
      });
    });
    const seen = new Set();
    return rows.filter(row => {
      const id = `${row.key}|${normalize(row.name)}`;
      if (seen.has(id)) return false;
      seen.add(id); return true;
    });
  })();

  function renderGenealogySearch(){
    if (!genealogySearch || !genealogySearchResults) return;
    const q = normalize(genealogySearch.value);
    if (!q) { genealogySearchResults.hidden = true; genealogySearchResults.innerHTML = ''; return; }
    const matches = GENEALOGY_NAME_INDEX
      .map(row => ({row,score:normalize(row.name)===q?100:normalize(row.name).startsWith(q)?70:normalize(row.name).includes(q)?45:0}))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score||a.row.name.localeCompare(b.row.name,'fr'))
      .slice(0,8);
    genealogySearchResults.hidden = false;
    genealogySearchResults.innerHTML = matches.length
      ? matches.map(({row}) => `<button type="button" class="myth-genealogy-result" data-genealogy-result="${esc(row.key)}" data-genealogy-name="${esc(row.name)}"><span><strong>${esc(row.name)}</strong><small>${esc(row.family)} · ${esc(row.generation)}</small></span><span aria-hidden="true">→</span></button>`).join('')
      : `<div class="myth-search-empty">Aucun nom trouvé dans les cinq généalogies.</div>`;
  }

  function placeDetailHtml(p){
    if (!p) return '';
    const guide = PLACE_GUIDE[p.name] || {modern:p.zone,use:'',geo:null};
    return `<div class="myth-place-detail-top"><span>${esc(p.kind)}</span><small>${esc(p.zone)}</small></div><h3>${esc(p.name)}</h3><p class="myth-place-summary">${esc(p.summary)}</p><div class="myth-place-guide"><section><span>Repère actuel</span><p>${esc(guide.modern)}</p></section><section><span>Pourquoi ce lieu compte</span><p>${esc(guide.use)}</p></section></div><div class="myth-place-tags">${p.links.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
  }

  let leafletPromise = null;
  let mythMap = null;
  let mythMapMarkers = new Map();

  function loadLeaflet(){
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise((resolve,reject) => {
      if (!document.querySelector('link[data-myth-leaflet-css]')) {
        const link=document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.dataset.mythLeafletCss=''; document.head.append(link);
      }
      const script=document.createElement('script'); script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.defer=true; script.onload=()=>resolve(window.L); script.onerror=reject; document.head.append(script);
    });
    return leafletPromise;
  }

  function destroyMythMap(){
    if (mythMap){ try{ mythMap.remove(); }catch(_){} mythMap=null; }
    mythMapMarkers = new Map();
  }

  function updateMapSelection(name, pan=true){
    const real=PLACES.filter(p=>p.zone==='monde réel');
    const selected=real.find(p=>p.name===name) || real[0];
    activePlace=selected.name;
    const detail=worldPanel.querySelector('[data-myth-place-detail]'); if(detail) detail.innerHTML=placeDetailHtml(selected);
    worldPanel.querySelectorAll('[data-map-place]').forEach(b=>b.classList.toggle('is-active',b.dataset.mapPlace===activePlace));
    mythMapMarkers.forEach((marker,key)=>{
      const on=key===activePlace;
      marker.setIcon(L.divIcon({className:'',html:`<span class="myth-leaflet-marker${on?' is-active':''}"><i></i></span>`,iconSize:[26,26],iconAnchor:[13,13],popupAnchor:[0,-11]}));
    });
    const guide=PLACE_GUIDE[activePlace]; if(pan && mythMap && guide?.geo) mythMap.flyTo(guide.geo, Math.max(mythMap.getZoom(),6), {duration:.5});
  }

  function initLeafletMap(real){
    const el=worldPanel.querySelector('[data-myth-leaflet-map]');
    const loading=worldPanel.querySelector('[data-myth-map-loading]');
    if(!el) return;
    loadLeaflet().then(Lib=>{
      if(!document.body.contains(el)) return;
      destroyMythMap();
      const geo=PLACE_GUIDE[activePlace]?.geo || [38.6,24.3];
      mythMap=Lib.map(el,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView(geo,5);
      Lib.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(mythMap);
      const bounds=[];
      real.forEach(p=>{
        const coords=PLACE_GUIDE[p.name]?.geo; if(!coords) return; bounds.push(coords);
        const marker=Lib.marker(coords,{icon:Lib.divIcon({className:'',html:`<span class="myth-leaflet-marker${p.name===activePlace?' is-active':''}"><i></i></span>`,iconSize:[26,26],iconAnchor:[13,13],popupAnchor:[0,-11]})}).addTo(mythMap);
        marker.bindTooltip(p.name,{direction:'top',offset:[0,-10],className:'myth-leaflet-tooltip'});
        marker.on('click',()=>updateMapSelection(p.name,false));
        mythMapMarkers.set(p.name,marker);
      });
      if(bounds.length) mythMap.fitBounds(bounds,{padding:[26,26],maxZoom:6});
      loading?.remove();
      requestAnimationFrame(()=>mythMap?.invalidateSize());
    }).catch(()=>{
      if(loading) loading.innerHTML='<strong>Carte indisponible</strong><span>Les lieux restent accessibles dans la liste ci-dessous.</span>';
    });
  }

  function renderMapView(){
    const real = PLACES.filter(p => p.zone === 'monde réel');
    if (!real.some(p=>p.name===activePlace)) activePlace='Athènes';
    const selected = real.find(p=>p.name===activePlace) || real[0];
    destroyMythMap();
    worldPanel.innerHTML = `
      <div class="myth-map-layout">
        <div class="myth-map-card">
          <div class="myth-map-card-head"><div><strong>Méditerranée &amp; mer Noire</strong><small>Carte interactive · principaux lieux des récits</small></div><span>${real.length} repères</span></div>
          <div class="myth-leaflet-wrap"><div class="myth-leaflet-map" data-myth-leaflet-map></div><div class="myth-map-loading" data-myth-map-loading><span></span><strong>Chargement de la carte…</strong></div></div>
          <div class="myth-map-place-list" aria-label="Choisir un lieu">${real.map(p=>`<button type="button" class="${p.name===activePlace?'is-active':''}" data-map-place="${esc(p.name)}"><span>${esc(p.name)}</span><small>${esc((PLACE_GUIDE[p.name]||{}).modern||p.kind)}</small></button>`).join('')}</div>
          <p class="myth-map-note">Les points correspondent à des lieux réels ou à des régions antiques identifiables. La carte sert à comprendre la géographie des récits, pas à fixer les épisodes mythiques avec une précision historique qu’ils n’ont pas toujours.</p>
        </div>
        <article class="myth-place-detail" data-myth-place-detail>${placeDetailHtml(selected)}</article>
      </div>`;
    initLeafletMap(real);
  }

  function renderCosmosView(){
    destroyMythMap();
    const mythical = PLACES.filter(p => p.zone === 'espace mythique');
    if (!mythical.some(p=>p.name===activePlace)) activePlace='Hadès';
    const selected=mythical.find(p=>p.name===activePlace)||mythical[0];
    const item = (name,tag='') => {
      const p=mythical.find(x=>x.name===name);
      return p ? `<button type="button" class="myth-cosmos-place${p.name===activePlace?' is-active':''}" data-place="${esc(p.name)}"><span class="myth-cosmos-place-dot" aria-hidden="true"></span><span><strong>${esc(p.name)}</strong><small>${esc(tag || p.kind)}</small></span><i aria-hidden="true">→</i></button>`:'';
    };
    worldPanel.innerHTML = `
      <div class="myth-map-layout myth-cosmos-layout">
        <div class="myth-cosmos-card">
          <div class="myth-cosmos-head"><div><span>Lire l’espace comme une structure</span><strong>Du monde des dieux aux profondeurs</strong></div><small>Schéma de repérage · pas une carte géographique</small></div>
          <div class="myth-cosmos-axis" aria-hidden="true"><span></span></div>
          <section class="myth-cosmos-zone myth-cosmos-zone--divine"><div class="myth-cosmos-zone-label"><span>01</span><div><strong>Ordre divin</strong><small>Au-dessus du monde humain</small></div></div><div class="myth-cosmos-zone-body"><div class="myth-cosmos-concept"><span>Olympe poétique</span><p>Le massif existe réellement, mais dans le récit l’Olympe fonctionne surtout comme le lieu symbolique de l’assemblée et de l’ordre des dieux.</p></div></div></section>
          <section class="myth-cosmos-zone myth-cosmos-zone--margin"><div class="myth-cosmos-zone-label"><span>02</span><div><strong>Marges du monde habité</strong><small>Voyage · épreuve · suspension du retour</small></div></div><div class="myth-cosmos-zone-body myth-cosmos-zone-body--places">${item('Ogygie','île hors du temps ordinaire')}${item('Île des Sirènes','seuil dangereux du voyage')}</div></section>
          <section class="myth-cosmos-zone myth-cosmos-zone--threshold"><div class="myth-cosmos-zone-label"><span>03</span><div><strong>Seuil des morts</strong><small>La frontière qu’un vivant franchit exceptionnellement</small></div></div><div class="myth-cosmos-zone-body myth-cosmos-zone-body--places">${item('Styx','fleuve-frontière')}</div></section>
          <section class="myth-cosmos-zone myth-cosmos-zone--under"><div class="myth-cosmos-zone-label"><span>04</span><div><strong>Monde d’en bas</strong><small>Morts · jugement · châtiment · séjour heureux</small></div></div><div class="myth-cosmos-zone-body myth-cosmos-zone-body--places">${item('Hadès','séjour des morts')}${item('Champs Élysées','au-delà heureux')}${item('Tartare','profondeur et enfermement')}</div></section>
          <p class="myth-cosmos-note"><strong>À retenir :</strong> ces espaces ne forment pas une géographie parfaitement stable. Homère, Hésiode, les tragiques et les auteurs plus tardifs n’en donnent pas toujours la même organisation.</p>
        </div>
        <article class="myth-place-detail myth-place-detail--cosmos">${placeDetailHtml(selected)}</article>
      </div>`;
  }

  function renderWorld(){
    worldTabs.querySelectorAll('[data-world-view]').forEach(b => { const on=b.dataset.worldView===activeWorldView; b.classList.toggle('is-active',on); b.setAttribute('aria-selected',String(on)); });
    if (activeWorldView === 'cosmos') renderCosmosView(); else renderMapView();
  }

  function renderRouteSelector(){
    routeSelector.innerHTML = ROUTES.map((r,i)=>`<button type="button" class="myth-route-choice${i===activeRoute?' is-active':''}" data-route="${i}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(r.title)}</strong><small>${esc(r.subtitle)}</small></div></button>`).join('');
  }

  function renderRouteDetail(){
    const r=ROUTES[activeRoute]||ROUTES[0];
    routeDetail.innerHTML=`<div class="myth-route-overview"><div class="myth-route-overview-copy"><span>Parcours ${String(activeRoute+1).padStart(2,'0')}</span><h3>${esc(r.title)}</h3><p>${esc(r.intro)}</p><small>${esc(r.subtitle)}</small></div><div class="myth-route-sequence" aria-label="Étapes du parcours">${r.steps.map((s,i)=>`<article class="myth-route-sequence-step"><span class="myth-route-sequence-num">${String(i+1).padStart(2,'0')}</span><div><strong>${esc(s[0])}</strong><p>${esc(s[1])}</p>${s[2]?`<a href="${esc(s[2])}">Lire la fiche <span aria-hidden="true">→</span></a>`:'<small>Repère à retrouver dans la boussole</small>'}</div></article>`).join('')}</div></div>`;
    renderRouteSelector();
  }

  function renderVocab(term=activeVocab){
    if(!vocabDetail) return;
    const v=VOCAB.find(x=>normalize(x.term)===normalize(term));
    if(!v){ vocabDetail.hidden=true; vocabDetail.innerHTML=''; return; }
    activeVocab=v.term;
    const related = VOCAB.filter(item => item.category === v.category && item.term !== v.term).slice(0,3);
    vocabDetail.hidden=false;
    vocabDetail.innerHTML=`<div class="myth-dictionary-answer-top"><span>${esc(v.category)}</span><small>Dictionnaire mythologique</small></div><div class="myth-dictionary-answer-main"><h3>${esc(v.term)}</h3><p class="myth-dictionary-definition">${esc(v.definition)}</p><div class="myth-dictionary-answer-grid"><section class="myth-dictionary-example-card"><span>Exemple dans les récits</span><p>${esc(v.example)}</p></section><section><span>Nuance importante</span><p>${esc(v.nuance)}</p></section></div>${related.length?`<div class="myth-dictionary-related"><span>À rapprocher de</span>${related.map(item=>`<button type="button" data-vocab-related="${esc(item.term)}">${esc(item.term)}</button>`).join('')}</div>`:''}</div>`;
  }

  const SEARCH_INDEX = [
    ...VOCAB.map(v => ({type:'Vocabulaire',title:v.term,meta:`${v.category} · dictionnaire mythologique`,search:[v.term,v.category,v.definition,v.nuance,v.example].join(' '),action:'vocab',id:v.term})),
    ...MYTHS.map(m => ({type:'Mythe',title:m.title,meta:`${m.cycle} · ${m.themes.join(' · ')}`,search:[m.title,m.cycle,m.summary,m.source,m.people.join(' '),m.themes.join(' ')].join(' '),action:'myth',id:m.id})),
    ...PEOPLE.map(p => ({type:'Figure',title:p.name,meta:`${TYPE_LABELS[p.type] || p.type} · ${p.myths}`,search:[p.name,p.type,p.description,p.relations,p.myths,p.themes].join(' '),action:'person',id:p.name})),
    ...PLACES.map(p => ({type:'Lieu',title:p.name,meta:`${p.kind} · ${p.zone}`,search:[p.name,p.zone,p.kind,p.summary,p.links.join(' ')].join(' '),action:'place',id:p.name})),
    ...Object.entries(GENEALOGIES).map(([key,g])=>({type:'Lignée',title:g.label,meta:g.title,search:[g.label,g.title,g.intro,g.note,...g.generations.flat(2)].join(' '),action:'genealogy',id:key})),
    ...ROUTES.map((r,i) => ({type:'Parcours',title:r.title,meta:r.subtitle,search:[r.title,r.subtitle,r.intro,...r.steps.flat()].join(' '),action:'route',id:String(i)}))
  ].map(item => ({...item,norm:normalize(item.search)}));

  function renderGlobalSearch(){
    if (!globalSearch || !globalResults) return;
    const q=normalize(globalSearch.value); globalClear.hidden=!q;
    if(!q){globalResults.hidden=true;globalResults.innerHTML='';activeVocab='';renderVocab('');return;}
    const exactVocab=VOCAB.find(v=>normalize(v.term)===q);
    if(exactVocab){ renderVocab(exactVocab.term); globalResults.hidden=true; globalResults.innerHTML=''; return; }
    renderVocab('');
    const words=q.split(' ').filter(Boolean);
    const ranked=SEARCH_INDEX.map(item=>{const title=normalize(item.title);let score=title===q?100:title.startsWith(q)?65:title.includes(q)?45:0;if(words.every(w=>item.norm.includes(w)))score+=20;score+=words.filter(w=>item.norm.includes(w)).length*4;return{item,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title,'fr')).slice(0,9);
    globalResults.hidden=false;
    globalResults.innerHTML=ranked.length?ranked.map(({item})=>`<button type="button" class="myth-search-result" data-search-action="${esc(item.action)}" data-search-id="${esc(item.id)}"><span class="myth-search-result-type">${esc(item.type)}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.meta)}</small></span><span aria-hidden="true">→</span></button>`).join(''):`<div class="myth-search-empty">Aucun repère trouvé. Essayez un autre nom, thème ou lieu.</div>`;
  }

  function showSection(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }

  function openMyth(id,scroll=false){
    const m=MYTHS.find(x=>x.id===id); if(!m)return;
    activeCycle=m.cycle; activeMyth=m.id; renderMythBrowser();
    if(scroll) showSection('mythes');
  }
  function openPerson(name,scroll=false){
    const p=PEOPLE.find(x=>x.name===name); if(!p)return;
    activePersonType='all'; activePersonLetter='all'; if(personSearch)personSearch.value=''; activePerson=p.name; renderPeople();
    if(scroll) showSection('personnages');
  }
  function openPlace(name,scroll=false){
    const p=PLACES.find(x=>x.name===name); if(!p)return;
    activePlace=p.name; activeWorldView=p.zone==='espace mythique'?'cosmos':'map'; renderWorld();
    if(scroll)showSection('monde');
  }
  function openRoute(index,scroll=false){ activeRoute=Math.max(0,Math.min(ROUTES.length-1,Number(index)||0)); renderRouteDetail(); if(scroll)showSection('parcours'); }
  function openGenealogy(key,scroll=false,hit=''){ if(!GENEALOGIES[key])return;activeGenealogy=key;genealogySearchHit=hit;renderGenealogy();if(scroll)showSection('genealogies'); }

  function followSearchResult(action,id){
    globalResults.hidden=true;
    if(action==='myth')openMyth(id,true);
    else if(action==='person')openPerson(id,true);
    else if(action==='place')openPlace(id,true);
    else if(action==='route')openRoute(id,true);
    else if(action==='genealogy')openGenealogy(id,true);
    else if(action==='vocab'){ activeVocab=id; if(globalSearch) globalSearch.value=id; if(globalClear) globalClear.hidden=false; renderVocab(id); globalResults.hidden=true; showSection('myth-search-title'); }
  }

  // Navigation : même comportement que la boussole philosophique.
  // Le bandeau reste visible pendant la lecture et devient un rail d’icônes compact.
  if (jumpWrap && jumpNav) {
    let jumpDocumentTop = 0;
    const measureJump = () => {
      const wasCondensed = jumpNav.classList.contains('is-condensed');
      if (wasCondensed) jumpNav.classList.remove('is-condensed');
      jumpDocumentTop = jumpWrap.getBoundingClientRect().top + window.scrollY;
      if (wasCondensed) jumpNav.classList.add('is-condensed');
    };
    const updateJump = () => {
      const siteHeader = document.getElementById('site-header');
      const headerHeight = siteHeader?.getBoundingClientRect().height || (window.innerWidth <= 700 ? 60 : 68);
      const stuck = window.scrollY > 8 && (window.scrollY + headerHeight + 10 >= jumpDocumentTop);
      jumpNav.classList.toggle('is-condensed', stuck);
    };
    jumpNav.querySelectorAll('a').forEach(link => {
      const title = link.querySelector('strong')?.textContent?.trim();
      const subtitle = link.querySelector('small')?.textContent?.trim();
      if (title && !link.getAttribute('aria-label')) link.setAttribute('aria-label', subtitle ? `${title} — ${subtitle}` : title);
    });
    measureJump(); updateJump();
    window.addEventListener('scroll', updateJump, {passive:true});
    window.addEventListener('resize', () => { measureJump(); updateJump(); });
    window.addEventListener('load', () => { measureJump(); updateJump(); }, {once:true});
  }

  cycleFilters?.addEventListener('click',e=>{const b=e.target.closest('[data-cycle]');if(!b)return;activeCycle=b.dataset.cycle;activeMyth=MYTHS.find(m=>m.cycle===activeCycle)?.id||activeMyth;renderMythBrowser();});
  mythList?.addEventListener('click',e=>{const b=e.target.closest('[data-myth-id]');if(!b)return;activeMyth=b.dataset.mythId;renderMythBrowser();});
  mythDetail?.addEventListener('click',e=>{const p=e.target.closest('[data-person-from-myth]');if(p)openPerson(p.dataset.personFromMyth,true);});

  personFilters?.addEventListener('click',e=>{const b=e.target.closest('[data-person-type]');if(!b)return;activePersonType=b.dataset.personType;activePersonLetter='all';renderPeople();});
  personAlphabet?.addEventListener('click',e=>{const b=e.target.closest('[data-person-letter]');if(!b)return;activePersonLetter=b.dataset.personLetter;renderPeople();});
  personSearch?.addEventListener('input',()=>{activePersonLetter='all';renderPeople();});
  personList?.addEventListener('click',e=>{const b=e.target.closest('[data-person]');if(!b)return;activePerson=b.dataset.person;renderPeople();});
  personDetail?.addEventListener('click',e=>{const p=e.target.closest('[data-person-jump]');if(p){openPerson(p.dataset.personJump);return;}const m=e.target.closest('[data-myth-from-person]');if(m)openMyth(m.dataset.mythFromPerson,true);});

  genealogyTabs?.addEventListener('click',e=>{const b=e.target.closest('[data-genealogy]');if(!b)return;activeGenealogy=b.dataset.genealogy;genealogySearchHit='';renderGenealogy();});
  genealogyPanel?.addEventListener('click',e=>{const b=e.target.closest('[data-genealogy-myth]');if(b)openMyth(b.dataset.genealogyMyth,true);});
  genealogySearch?.addEventListener('input',renderGenealogySearch);
  genealogySearch?.addEventListener('keydown',e=>{if(e.key==='Escape'){genealogySearch.value='';genealogySearchHit='';renderGenealogySearch();renderGenealogy();genealogySearch.blur();}});
  genealogySearchResults?.addEventListener('click',e=>{const b=e.target.closest('[data-genealogy-result]');if(!b)return;genealogySearch.value=b.dataset.genealogyName;genealogySearchResults.hidden=true;openGenealogy(b.dataset.genealogyResult,true,b.dataset.genealogyName);});

  worldTabs?.addEventListener('click',e=>{const b=e.target.closest('[data-world-view]');if(!b)return;activeWorldView=b.dataset.worldView;activePlace=activeWorldView==='map'?'Athènes':'Hadès';renderWorld();});
  worldPanel?.addEventListener('click',e=>{ const mapButton=e.target.closest('[data-map-place]'); if(mapButton){ updateMapSelection(mapButton.dataset.mapPlace,true); return; } const b=e.target.closest('[data-place]'); if(!b)return; activePlace=b.dataset.place; renderWorld(); });

  routeSelector?.addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(!b)return;activeRoute=Number(b.dataset.route);renderRouteDetail();});
  vocabStarters?.addEventListener('click',e=>{const b=e.target.closest('[data-myth-vocab-starter]');if(!b)return;activeVocab=b.dataset.mythVocabStarter;if(globalSearch){globalSearch.value=activeVocab;globalClear.hidden=false;}renderVocab(activeVocab);globalResults.hidden=true;});
  vocabDetail?.addEventListener('click',e=>{const b=e.target.closest('[data-vocab-related]');if(!b)return;activeVocab=b.dataset.vocabRelated;if(globalSearch){globalSearch.value=activeVocab;globalClear.hidden=false;}renderVocab(activeVocab);});
  globalSearch?.addEventListener('input',renderGlobalSearch);
  globalSearch?.addEventListener('keydown',e=>{if(e.key==='Escape'){globalSearch.value='';renderGlobalSearch();globalSearch.blur();}});
  globalClear?.addEventListener('click',()=>{globalSearch.value='';renderGlobalSearch();globalSearch.focus();});
  globalResults?.addEventListener('click',e=>{const b=e.target.closest('[data-search-action]');if(b)followSearchResult(b.dataset.searchAction,b.dataset.searchId);});
  document.addEventListener('click',e=>{if(globalResults&&!e.target.closest('[data-myth-global-search]'))globalResults.hidden=true;if(genealogySearchResults&&!e.target.closest('[data-myth-genealogy-search]'))genealogySearchResults.hidden=true;});

  renderMythBrowser();
  renderPeople();
  renderGenealogy();
  renderWorld();
  renderRouteDetail();
})();

/* Ressources — accordéons avec ouverture / fermeture douce */
(() => {
  const groups = [...document.querySelectorAll('.myth-resource-group')];
  if (!groups.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  groups.forEach((details) => {
    const summary = details.querySelector(':scope > summary');
    const content = details.querySelector(':scope > .myth-resource-content');
    if (!summary || !content) return;

    let animation = null;
    let closing = false;
    let opening = false;

    const finish = (open) => {
      animation = null;
      closing = false;
      opening = false;
      details.classList.remove('is-animating');
      content.style.height = '';
      content.style.opacity = '';
      if (!open) details.open = false;
    };

    const animate = (open) => {
      if (reduced.matches || !content.animate) {
        details.open = open;
        finish(open);
        return;
      }
      if (animation) animation.cancel();
      details.classList.add('is-animating');

      if (open) {
        details.open = true;
        opening = true;
        const end = content.scrollHeight;
        animation = content.animate(
          [{height:'0px', opacity:0}, {height:`${end}px`, opacity:1}],
          {duration:340, easing:'cubic-bezier(.22,.8,.25,1)'}
        );
      } else {
        closing = true;
        const start = content.getBoundingClientRect().height;
        animation = content.animate(
          [{height:`${start}px`, opacity:1}, {height:'0px', opacity:0}],
          {duration:280, easing:'cubic-bezier(.4,0,.2,1)'}
        );
      }
      animation.onfinish = () => finish(open);
      animation.oncancel = () => {
        animation = null;
        closing = false;
        opening = false;
        details.classList.remove('is-animating');
      };
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (closing || (!details.open && !opening)) animate(true);
      else if (opening || details.open) animate(false);
    });
  });
})();

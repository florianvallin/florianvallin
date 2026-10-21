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
    "Raison et réel", "Société", "Théorie et expérience", "Travail et technique", "Vivant"
  ];

  const TEXTS = [{"id":"hume-causalite-experience-induction","section":"philosophie","cardMeta":"Théorie et expérience · causalité et induction","title":"Les lois du réel sont seulement induites à partir de notre expérience","author":"David Hume","authorTag":"Hume","cardHighlight":"induites à partir de notre expérience","familiarIdea":"le problème de l’induction","authorMeta":"(1711–1776) · empirisme","themes":["Science","Théorie et expérience"],"work":"Enquête sur l’entendement humain","publication":"1748, section IV, trad. A. Leroy, GF, 2006, p. 85–89","description":"La relation de cause à effet peut-elle être connue par la raison seule, ou ne vient-elle que de l’expérience et de l’habitude ?","context":"Hume montre que l’expérience ne nous donne jamais une nécessité logique entre une cause et son effet. Nous apprenons à attendre certains événements parce qu’ils se sont souvent produits ensemble : notre connaissance du réel repose donc sur l’<strong>expérience</strong> et la coutume, non sur une démonstration <em>a priori</em>."},{"id":"kant-connaissance-experience-a-priori","section":"philosophie","cardMeta":"Théorie et expérience · empirique et a priori","title":"La connaissance commence avec l’expérience, mais n’en dérive pas tout entière","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"commence avec l’expérience","familiarIdea":"l’<em>a priori</em> kantien","authorMeta":"(1724–1804) · philosophie critique","themes":["Raison","Théorie et expérience"],"work":"Critique de la raison pure","publication":"1781–1787, Introduction, trad. A. Tremesaygues et B. Pacaud, PUF, 1986, p. 31–33","description":"L’expérience est-elle seulement l’origine chronologique de notre connaissance, ou suffit-elle aussi à en expliquer le contenu et l’universalité ?","context":"Kant distingue deux idées : toute connaissance commence avec l’<strong>expérience</strong>, mais toute connaissance n’en provient pas. Certaines formes universelles et nécessaires doivent donc avoir une origine <em>a priori</em> et rendre l’expérience elle-même possible."},{"id":"claude-bernard-methode-experimentale","section":"philosophie","cardMeta":"Théorie et expérience · méthode expérimentale","title":"Une expérience scientifique obéit à la méthode expérimentale","author":"Claude Bernard","authorTag":"Claude Bernard","cardHighlight":"méthode expérimentale","familiarIdea":"la méthode expérimentale","authorMeta":"(1813–1878) · médecine expérimentale","themes":["Science","Théorie et expérience"],"work":"Introduction à l’étude de la médecine expérimentale","publication":"1865, Flammarion, 2008, p. 65–66","description":"Comment observation, hypothèse, raisonnement et expérimentation s’articulent-ils dans une véritable enquête scientifique ?","context":"Claude Bernard montre que l’<strong>expérience</strong> scientifique n’est ni une observation passive ni une vérification improvisée. Le savant observe, formule une hypothèse, en déduit des conséquences puis organise une expérience capable de mettre cette idée à l’épreuve."},{"id":"einstein-theorie-modele-realite","section":"philosophie","cardMeta":"Théorie et expérience · modèle scientifique","title":"Une théorie scientifique est un modèle de la réalité","author":"Albert Einstein","authorTag":"Einstein","cardHighlight":"modèle de la réalité","authorMeta":"(1879–1955) · physique contemporaine","themes":["Science","Théorie et expérience"],"work":"L’Évolution des idées en physique","publication":"avec Leopold Infeld, 1938, Payot, 1974, p. 34–35","description":"Une théorie scientifique copie-t-elle le réel, ou construit-elle une représentation qui permet de l’expliquer ?","context":"Einstein et Infeld comparent le savant à quelqu’un qui cherche à comprendre le mécanisme d’une montre fermée. Une <strong>théorie</strong> scientifique est donc une construction de l’esprit qui ordonne les observations ; elle peut être très efficace sans reproduire directement la réalité telle qu’elle est en elle-même."},{"id":"bachelard-experience-theorie-materialisee","section":"philosophie","cardMeta":"Théorie et expérience · phénoménotechnique","title":"Une expérience scientifique est une théorie matérialisée","author":"Gaston Bachelard","authorTag":"Bachelard","cardHighlight":"théorie matérialisée","authorMeta":"(1884–1962) · épistémologie","themes":["Science","Théorie et expérience"],"work":"Le Nouvel Esprit scientifique","publication":"1934, introduction, PUF, 1995, p. 16","description":"L’observation scientifique révèle-t-elle simplement un donné, ou construit-elle les phénomènes à partir de concepts et d’instruments ?","context":"Bachelard refuse l’idée d’une science qui commencerait par regarder simplement les faits. L’<strong>expérience</strong> scientifique est préparée par des concepts, une hypothèse et des instruments : le phénomène observé est en partie construit par la théorie qui permet de le faire apparaître.","familiarIdea":"la théorie matérialisée"},{"id":"popper-theorie-falsifiable","section":"philosophie","cardMeta":"Théorie et expérience · falsifiabilité","title":"Une théorie scientifique est avant tout une théorie falsifiable","author":"Karl R. Popper","authorTag":"Popper","cardHighlight":"théorie falsifiable","familiarIdea":"le critère de falsifiabilité","authorMeta":"(1902–1994) · épistémologie critique","themes":["Science","Théorie et expérience"],"work":"Conjectures et Réfutations","publication":"1953, trad. M. Irène et M. B. de Launay, Payot, 2006, p. 377–378","description":"Qu’est-ce qui distingue une théorie scientifique d’une proposition qui échappe à toute mise à l’épreuve ?","context":"Popper propose la <strong>falsifiabilité</strong> comme critère du caractère scientifique d’une théorie. Une théorie est scientifique lorsqu’elle prend le risque d’être contredite par l’expérience ; résister à des tests sévères la renforce, mais ne la transforme jamais en vérité définitivement prouvée."},{"id":"bergson-experience-vecue-indicible","section":"philosophie","cardMeta":"Théorie et expérience · expérience vécue et langage","title":"L’expérience vécue est indicible","author":"Henri Bergson","authorTag":"Bergson","cardHighlight":"expérience vécue est indicible","authorMeta":"(1859–1941) · durée et intuition","themes":["Conscience","Théorie et expérience"],"work":"Essai sur les données immédiates de la conscience","publication":"1889, PUF, 2010, p. 98–99","description":"Le langage peut-il exprimer fidèlement la singularité mouvante de nos sensations et de nos sentiments ?","context":"Bergson souligne l’écart entre la singularité mouvante de notre <strong>expérience</strong> vécue et les mots, qui utilisent des catégories communes et stables. Nommer un sentiment permet de le communiquer, mais risque aussi de simplifier ce que nous vivons intérieurement."},{"id":"hegel-experience-vecue-mots","section":"philosophie","cardMeta":"Théorie et expérience · pensée et langage","title":"L’expérience vécue doit pouvoir être énoncée par des mots","author":"Georg Wilhelm Friedrich Hegel","authorTag":"Hegel","cardHighlight":"énoncée par des mots","authorMeta":"(1770–1831) · idéalisme allemand","themes":["Langage","Théorie et expérience"],"work":"Philosophie de l’esprit","publication":"1827, Addition au § 462, trad. B. Bourgeois, Vrin, 1988, p. 560–561","description":"Une pensée inexprimable est-elle plus profonde que les mots, ou n’acquiert-elle sa détermination qu’en se formulant ?","context":"Hegel refuse de faire de l’indicible le signe d’une pensée plus profonde. Une expérience intérieure ne devient pensée déterminée qu’en prenant une forme partageable dans le <strong>langage</strong> : les mots ne viennent donc pas seulement après la pensée, ils contribuent à la former."},{"id":"aristote-vie-matiere-ame","section":"philosophie","cardMeta":"Nature · vivant, matière et âme","title":"La vie se définit par la matière, mais aussi par la possession d’une âme","author":"Aristote","authorTag":"Aristote","cardHighlight":"matière et âme","authorMeta":"(384–322 av. J.-C.) · philosophie de l’Antiquité","themes":["Nature","Conscience"],"work":"De l’âme","publication":"IVe s. av. J.-C., II, 2, trad. R. Bodéüs, GF, 1993, p. 135–136 et 141–143","description":"Qu’est-ce qui distingue un corps vivant d’un corps inanimé, et quel rôle l’âme joue-t-elle dans cette définition ?","context":"Aristote refuse de penser l’âme comme une chose simplement ajoutée au corps. Elle est la forme et le principe des fonctions par lesquelles un vivant se nourrit, sent, se meut ou pense."},{"id":"diderot-vie-phenomene-materiel","section":"philosophie","cardMeta":"Nature · matérialisme et vivant","title":"La vie est un phénomène matériel","author":"Denis Diderot","authorTag":"Diderot","cardHighlight":"phénomène matériel","authorMeta":"(1713–1784) · matérialisme","themes":["Nature","Science"],"work":"Entretien entre D’Alembert et Diderot","publication":"1769, in Œuvres philosophiques, Garnier, 1998, p. 274–277","description":"Faut-il supposer un principe immatériel pour expliquer le passage de la matière inerte à la sensibilité et à la vie ?","context":"Diderot prend le développement de l’œuf comme modèle d’une explication matérialiste du vivant. Il refuse d’introduire un principe spirituel extérieur lorsque l’organisation de la matière peut rendre compte de l’apparition de la sensibilité."},{"id":"descartes-maitres-possesseurs-nature","section":"philosophie","cardMeta":"Technique · maîtrise de la nature","title":"La science doit devenir une philosophie pratique","author":"René Descartes","authorTag":"Descartes","cardHighlight":"philosophie pratique","familiarIdea":"« maîtres et possesseurs de la nature »","authorMeta":"(1596–1650) · rationalisme","themes":["Technique","Nature"],"work":"Discours de la méthode","publication":"1637, VIe partie","description":"À quoi doit servir la connaissance scientifique de la nature : comprendre seulement, ou aussi améliorer concrètement la vie humaine ?","context":"Descartes oppose ici une <strong>philosophie spéculative</strong>, principalement tournée vers la connaissance, à une <strong>philosophie pratique</strong> capable d’employer les forces de la nature au bénéfice des êtres humains. Ce passage, fréquemment proposé en Terminale dans la notion de technique, permet aussi de relire la Genèse : l’être humain y reçoit la mission de « soumettre » la terre, mais aussi de « travailler et garder » le jardin.","readingNotes":[{"type":"opposition","left":{"term":"Philosophie spéculative","definition":"Elle cherche principalement à connaître et à expliquer."},"right":{"term":"Philosophie pratique","definition":"Elle transforme la connaissance en moyens d’agir sur la nature et d’améliorer la vie."},"conclusion":"Pour Descartes, la science moderne prend toute sa portée lorsqu’elle devient utilisable."},{"type":"analysis","term":"Le mot « comme »","definition":"Descartes n’écrit pas que l’être humain est absolument maître de la nature : il peut devenir <em>comme</em> maître et possesseur en apprenant à employer ses forces. Cette nuance est particulièrement intéressante face à la Genèse, où la maîtrise humaine reste celle d’une créature dans un monde qu’elle n’a pas créé."},{"type":"analysis","term":"Une maîtrise orientée vers des fins","definition":"Le texte ne célèbre pas la puissance technique pour elle-même : Descartes évoque les commodités de la vie et surtout la conservation de la santé. La question philosophique devient donc aussi celle des fins auxquelles nous employons notre pouvoir technique."}]},{"id":"descartes-organisme-machine","section":"philosophie","cardMeta":"Nature · organisme et machine","title":"La machine est un modèle pour comprendre les organismes vivants","author":"René Descartes","authorTag":"Descartes","cardHighlight":"organisme comme machine","familiarIdea":"l’animal-machine","authorMeta":"(1596–1650) · rationalisme","themes":["Nature","Technique","Conscience"],"work":"Discours de la méthode","publication":"1637, Ve partie, in Œuvres et lettres, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 164–165","description":"Jusqu’où peut-on comprendre le vivant sur le modèle d’un automate, et qu’est-ce qui distingue encore l’être humain de la machine ?","context":"Descartes assimile le corps animal à une machine extrêmement complexe. Il réserve toutefois à l’être humain deux signes distinctifs : l’usage indéfiniment adaptable du langage et la raison comme instrument universel."},{"id":"kant-machine-modele-insuffisant-vivant","section":"philosophie","cardMeta":"Nature · organisme et finalité","title":"La machine est un modèle insuffisant pour penser le vivant","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"force formatrice","authorMeta":"(1724–1804) · philosophie critique","themes":["Nature","Technique","Science"],"work":"Critique de la faculté de juger","publication":"1790, § 65, éd. et trad. M. Buhot de Launay, Gallimard, 1985, p. 337–338","description":"Qu’est-ce qu’un organisme possède qu’une machine, même très complexe, ne peut pas expliquer ?","context":"Kant distingue l’organisation vivante du simple mécanisme. Dans un organisme, les parties ne font pas que transmettre un mouvement : elles participent à la production, à l’entretien et à la réparation du tout."},{"id":"darwin-evolution-vivant-techniques","section":"philosophie","cardMeta":"Nature · évolution et technique","title":"On ne peut pas assimiler l’évolution du vivant et l’histoire des techniques","author":"Charles Darwin","authorTag":"Darwin","cardHighlight":"sélection naturelle","familiarIdea":"la sélection naturelle","authorMeta":"(1809–1882) · évolutionnisme","themes":["Nature","Science","Technique"],"work":"L’Origine des espèces","publication":"1859, chap. IV, éd. et trad. D. Becquemont et E. Barbier, GF, 2008, p. 241","description":"Pourquoi l’analogie entre l’œil et un instrument fabriqué peut-elle induire en erreur sur l’origine des formes vivantes ?","context":"Darwin récuse l’idée que la complexité d’un organe implique un artisan ou un projet préalable. Les variations héréditaires et la sélection naturelle permettent d’expliquer une formation progressive sans modèle conçu d’avance."},{"id":"claude-bernard-experimentation-animale","section":"philosophie","cardMeta":"Nature · expérimentation animale","title":"Il est légitime d’expérimenter sur les animaux","author":"Claude Bernard","authorTag":"Bernard","cardHighlight":"expérimenter sur les animaux","authorMeta":"(1813–1878) · médecine expérimentale","themes":["Nature","Science","Devoir"],"work":"Introduction à l’étude de la médecine expérimentale","publication":"1865, GF, 1966, p. 153","description":"L’utilité scientifique et médicale suffit-elle à justifier l’expérimentation animale ?","context":"Claude Bernard défend l’expérimentation animale au nom de la connaissance du vivant et du soin des malades. Son raisonnement oblige à distinguer l’<strong>utilité</strong> scientifique d’une pratique et sa <strong>légitimité morale</strong>."},{"id":"bentham-sensibilite-respect-animaux","section":"philosophie","cardMeta":"Nature · sensibilité animale","title":"Tout être sensible doit être respecté","author":"Jérémy Bentham","authorTag":"Bentham","cardHighlight":"peuvent-ils souffrir ?","familiarIdea":"« Peuvent-ils souffrir ? »","authorMeta":"(1748–1832) · utilitarisme","themes":["Nature","Devoir","Justice"],"work":"Introduction aux principes de morale et de législation","publication":"1789, ch. XVII, trad. Vrin, 2011, p. 325","description":"La capacité de souffrir, plutôt que la raison ou le langage, doit-elle déterminer l’étendue de notre considération morale ?","context":"Bentham déplace le critère de la considération morale : ce qui compte n’est pas d’abord de savoir si un être parle ou raisonne, mais s’il peut <strong>souffrir</strong>. La sensibilité devient ainsi le point de départ d’un devoir de justice envers les animaux."},{"id":"uexkull-animal-monde-propre","section":"philosophie","cardMeta":"Nature · monde animal","title":"L’animal n’est pas qu’un objet : il possède un monde propre","author":"Jakob von Uexküll","authorTag":"Uexküll","cardHighlight":"un monde propre","familiarIdea":"l’<em>Umwelt</em>","authorMeta":"(1864–1944) · biologie et philosophie du vivant","themes":["Nature","Science"],"work":"Mondes animaux et monde humain","publication":"1923, Pocket, 1965, p. 25–26 et 29–30","description":"Chaque animal habite-t-il le même monde objectif, ou sélectionne-t-il un milieu propre à partir de ses capacités perceptives et actives ?","context":"À partir de la tique, Uexküll montre qu’un animal ne reçoit pas passivement le même monde que nous. Chaque espèce sélectionne les signes auxquels elle peut répondre et constitue ainsi son propre <em>Umwelt</em>, son « monde propre »."},{"id":"lucrece-ame-esprit-corporels","section":"philosophie","cardMeta":"Nature · matière et esprit","title":"L’âme et l’esprit sont corporels","author":"Lucrèce","authorTag":"Lucrèce","cardHighlight":"nature corporelle","authorMeta":"(v. 99–55 av. J.-C.) · épicurisme / atomisme","themes":["Nature","Conscience"],"work":"De la nature (De Rerum Natura)","publication":"Ier s. av. J.-C., chant III, v. 137–176, trad. J. Kany-Turpin, GF, 1997, p. 189–191","description":"Les interactions entre l’esprit et le corps permettent-elles de montrer que l’âme elle-même est matérielle ?","context":"Lucrèce reprend l’atomisme épicurien : âme et esprit sont matériels, même s’ils ont des fonctions différentes. Leur capacité à agir sur le corps et à subir ses blessures constitue pour lui une preuve de leur corporéité."},{"id":"bergson-pensee-cerveau","section":"philosophie","cardMeta":"Conscience · esprit et cerveau","title":"On ne peut pas réduire la pensée au cerveau","author":"Henri Bergson","authorTag":"Bergson","cardHighlight":"pensée indépendante du cerveau","authorMeta":"(1859–1941) · spiritualisme","themes":["Conscience","Nature","Science"],"work":"L’Âme et le Corps","publication":"1912, in L’Énergie spirituelle, PUF, 1999, p. 42–43","description":"Même avec une connaissance parfaite du cerveau, pourrait-on déduire l’intégralité de la vie consciente ?","context":"Bergson admet que le cerveau conditionne l’expression corporelle de la pensée, mais refuse d’en conclure que la pensée y est intégralement contenue. Ses analogies du théâtre et du tableau distinguent corrélation cérébrale et réduction de l’esprit au cerveau."},{"id":"aristote-main-outil-intelligence","section":"philosophie","cardMeta":"Technique · main et instrument","title":"La technique n’est pas l’usage d’organes, mais la manipulation d’instruments","author":"Aristote","authorTag":"Aristote","cardHighlight":"la main est un outil","familiarIdea":"la main, instrument des instruments","authorMeta":"(384–322 av. J.-C.) · philosophie de l’Antiquité","themes":["Technique","Nature","Travail"],"work":"Les Parties des animaux","publication":"IVe s. av. J.-C., § 10, 687b, trad. P. Louis modifiée, Belles Lettres, 2003, p. 136–138","description":"L’homme est-il intelligent parce qu’il possède des mains, ou possède-t-il des mains parce qu’il est intelligent ?","context":"Aristote inverse l’explication d’Anaxagore : la main n’explique pas l’intelligence humaine ; elle est l’organe polyvalent donné à l’être capable d’acquérir et d’utiliser de nombreuses techniques."},{"id":"mauss-corps-instrument-naturel","section":"philosophie","cardMeta":"Technique · techniques du corps","title":"Le corps est l’instrument le plus naturel de l’homme","author":"Marcel Mauss","authorTag":"Mauss","cardHighlight":"premier et plus naturel instrument","familiarIdea":"les techniques du corps","authorMeta":"(1872–1950) · sociologie / anthropologie","themes":["Technique","Culture","Travail"],"work":"Les techniques du corps","publication":"1936, dans Sociologie et Anthropologie, PUF, 1968, p. 371–372","description":"Une technique suppose-t-elle toujours un outil extérieur au corps ?","context":"Mauss montre que des gestes qui paraissent naturels sont en réalité <strong>appris</strong> et transmis par une société. Le corps est notre premier moyen technique : marcher, nager ou se tenir sont déjà des manières culturellement réglées d’agir."},{"id":"marx-alienation-travail-ouvrier","section":"philosophie","cardMeta":"Technique · travail aliéné","title":"Le progrès technique peut devenir une cause d’aliénation du travail ouvrier","author":"Karl Marx","authorTag":"Marx","cardHighlight":"aliénation du travail","familiarIdea":"l’aliénation du travail","authorMeta":"(1818–1883) · matérialisme dialectique","themes":["Technique","Travail","Liberté"],"work":"Manuscrits de 1844","publication":"1932 posth. pour la première publication, premier manuscrit, XIII, trad. J.-P. Gougeon, GF, 1996, p. 112–113","description":"Comment le travail peut-il devenir extérieur au travailleur et l’éloigner de lui-même ?","context":"Marx décrit l’aliénation comme une séparation du travailleur d’avec son activité, son produit et lui-même. La division technique du travail industriel peut rendre cette extériorité particulièrement manifeste."},{"id":"simondon-harmonie-homme-machine","section":"philosophie","cardMeta":"Technique · homme et machine","title":"L’homme peut vivre en harmonie avec la machine","author":"Gilbert Simondon","authorTag":"Simondon","cardHighlight":"harmonie avec la machine","authorMeta":"(1924–1989) · philosophie contemporaine","themes":["Technique","Culture","Travail"],"work":"Du mode d’existence des objets techniques","publication":"1958, Aubier, 2012, p. 9–11","description":"La machine est-elle réellement l’ennemie de l’homme, ou cette opposition vient-elle d’une mauvaise compréhension de la technique ?","context":"Simondon refuse l’opposition simple entre <strong>culture</strong> et technique. La machine contient du savoir et du travail humains : le véritable enjeu est donc d’apprendre à la comprendre pour construire avec elle une relation moins étrangère et moins passive."},{"id":"aristote-travail-manuel-esclave","section":"philosophie","cardMeta":"Travail · esclavage et liberté","title":"Le travail manuel est réservé à l’esclave, le travail de l’esprit à l’homme libre","author":"Aristote","authorTag":"Aristote","cardHighlight":"être commandés / commander","familiarIdea":"l’esclavage naturel","authorMeta":"(384–322 av. J.-C.) · philosophie de l’Antiquité","themes":["Travail","Liberté","Technique"],"work":"Les Politiques","publication":"IVe s. av. J.-C., livre I, chap. 4, 1254ab, trad. P. Pellegrin, GF, 1990, p. 99–102","description":"Aristote peut-il fonder dans la nature la séparation entre ceux qui commandent et ceux qui travaillent corporellement ?","context":"Aristote relie ici la <strong>liberté politique</strong> à la possibilité d’être délivré du travail corporel. Il présente cette hiérarchie comme naturelle : le texte permet donc d’interroger directement le rapport entre <strong>nature, travail et domination</strong>."},{"id":"marx-royaume-liberte-travail","section":"philosophie","cardMeta":"Travail · nécessité et liberté","title":"Le travail rend libre s’il n’est pas contraint","author":"Karl Marx","authorTag":"Marx","cardHighlight":"royaume de la liberté","familiarIdea":"le royaume de la liberté","authorMeta":"(1818–1883) · matérialisme dialectique","themes":["Travail","Liberté","Technique"],"work":"Le Capital","publication":"1867, livre III, chap. 48, trad. A. Cohen-Solal et G. Badia, Éditions Sociales, 1976, p. 740–742","description":"La liberté commence-t-elle par la suppression du travail ou par la réduction de sa part nécessaire ?","context":"Marx distingue le <strong>royaume de la nécessité</strong>, où nous devons produire pour satisfaire nos besoins, du <strong>royaume de la liberté</strong>. La liberté ne supprime pas toute nécessité : elle commence lorsque nous organisons collectivement le travail et réduisons le temps qu’il exige."},{"id":"nietzsche-travail-jeu-creation","section":"philosophie","cardMeta":"Travail · ennui, jeu et création","title":"Ce n’est pas le jeu qui nous sauve du travail, mais la création","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"travaille au-delà / invente le jeu","authorMeta":"(1844–1900) · philosophie contemporaine","themes":["Travail","Technique","Art"],"work":"Humain, trop humain","publication":"1878, § 611, trad. R. Rovini, Gallimard, 1988, p. 320","description":"Que devient l’activité humaine lorsque le besoin matériel est satisfait mais que demeure l’ennui ?","context":"Nietzsche part d’un paradoxe : le travail, d’abord imposé par le besoin, devient lui-même une habitude dont l’absence produit l’ennui. Le jeu reste encore une réponse à ce besoin d’activité ; artistes et philosophes cherchent un « troisième état », une activité heureuse qui ne soit plus commandée par la nécessité.","readingNotes":[{"type":"analysis","term":"Du besoin à la création","definition":"Nietzsche distingue trois régimes d’activité.","items":["Le Travail répond d’abord à la nécessité.","Le jeu satisfait encore un besoin né de l’habitude de travailler.","La création vise un état où l’activité vaut par elle-même."]},{"type":"plain","definition":"Le texte ne célèbre donc pas simplement le loisir : il cherche une activité qui échappe à la logique du besoin."}]},{"id":"arendt-loisirs-monde-travail","section":"philosophie","cardMeta":"Travail · loisirs et consommation","title":"Même nos loisirs sont sous l’emprise du monde du travail","author":"Hannah Arendt","authorTag":"Arendt","cardHighlight":"loisirs sous l’emprise du travail","authorMeta":"(1906–1975) · philosophie contemporaine","themes":["Travail","Technique","Culture"],"work":"La Crise de la culture","publication":"1961–1968, trad. P. Lévy, Gallimard, 1989, p. 263–264","description":"Le temps de loisir nous libère-t-il réellement du cycle du travail et de la consommation ?","context":"Arendt montre que le <strong>loisir</strong> ne nous fait pas nécessairement sortir du monde du travail. S’il ne sert qu’à récupérer ou à consommer, il reste soumis au même cycle du besoin ; la culture exige une autre manière d’habiter le temps libre."},{"id":"kierkegaard-oisivete-ennui-travail","section":"philosophie","cardMeta":"Travail · oisiveté et ennui","title":"Le travail nous sauve de l’ennui, mais l’oisiveté est le seul bien véritable","author":"Søren Kierkegaard","authorTag":"Kierkegaard","cardHighlight":"oisiveté / ennui","authorMeta":"(1813–1855) · philosophie moderne / existentialisme","themes":["Travail","Liberté","Bonheur"],"work":"Ou bien… ou bien","publication":"trad. P.-H. Tisseau, dans Œuvres, Robert Laffont, 1993, p. 250–251","description":"Le travail est-il un bien en lui-même ou seulement un remède à l’ennui ?","context":"Kierkegaard distingue l’<strong>oisiveté</strong> de l’ennui. Le travail peut nous protéger de l’ennui, mais il ne constitue pas pour autant le bien suprême : une vie libre suppose de pouvoir habiter le temps sans avoir besoin de le remplir sans cesse."},{"id":"critias-dieu-invention-controle","section":"philosophie","cardMeta":"Religion · origine sociale de Dieu","title":"L’idée de Dieu est une invention destinée à contrôler les hommes","author":"Critias","authorTag":"Critias","cardHighlight":"invention destinée à contrôler les hommes","authorMeta":"(v. 460–403 av. J.-C.) · sophistique / athéisme antique","themes":["Religion","État","Justice"],"work":"Fragment rapporté par Sextus Empiricus, Contre les mathématiciens","publication":"IIe–IIIe s., IX, 54, recueilli dans Les Sophistes, dans Les Présocratiques, trad. J.-L. Poirier, Gallimard, « Bibliothèque de la Pléiade », 1988, p. 1145–1146","description":"L’idée de Dieu pourrait-elle avoir été inventée pour prolonger la loi jusque dans les pensées et les actes cachés ?","context":"Critias propose une explication politique de la religion : les <strong>lois</strong> peuvent punir les fautes visibles, mais elles ne contrôlent pas ce qui reste caché. La croyance en un dieu qui voit tout permettrait alors d’étendre la surveillance jusque dans le secret des conduites.","readingNotes":[{"type":"analysis","term":"Une généalogie de la religion","definition":"Critias ne cherche pas d’abord à savoir si Dieu existe : il demande à quoi sert socialement l’idée de Dieu et dans quelles circonstances elle aurait pu apparaître."}]},{"id":"freud-dieu-protection-paternelle","section":"philosophie","cardMeta":"Religion · illusion et père","title":"À travers Dieu, l’homme recherche une protection paternelle","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"protection paternelle","familiarIdea":"l’illusion religieuse","authorMeta":"(1856–1939) · psychanalyse","themes":["Religion","Inconscient","Désir"],"work":"L’Avenir d’une illusion","publication":"1927, trad. M. Bonaparte, PUF, 1973, p. 43","description":"La croyance religieuse provient-elle de preuves, ou de désirs humains anciens liés au besoin de protection ?","context":"Freud interprète la croyance religieuse comme une <strong>illusion</strong> : sa force ne vient pas d’abord d’une preuve, mais de désirs très anciens. Dieu prolonge la figure du père protecteur face à la détresse, tout en répondant au besoin de justice et d’ordre.","readingNotes":[{"type":"concept","term":"Le désir à l’origine de la croyance","definition":"La question de Freud porte moins sur la vérité théologique de la religion que sur la source psychique de son pouvoir de conviction."}]},{"id":"pascal-solitude-misere-recherche-dieu","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Religion · misère et quête de sens","title":"La solitude et la misère de l’homme le poussent à chercher Dieu","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"chercher Dieu","authorMeta":"(1623–1662) · philosophie moderne / jansénisme","themes":["Religion","Bonheur","Raison"],"work":"Pensées","publication":"1670 posth., éd. L. Brunschvicg, 693 (Lafuma 198), dans Pensées et opuscules, Hachette, 1967, p. 646","description":"Face au silence de l’univers et à sa propre misère, l’être humain peut-il se satisfaire du divertissement ou doit-il chercher un sens au-delà du monde ?","context":"Pascal décrit l’être humain comme perdu dans un univers silencieux, ignorant son origine et sa destination. Le <strong>divertissement</strong> permet de détourner le regard de cette condition ; la recherche de Dieu naît au contraire du refus de s’en satisfaire.","readingNotes":[{"type":"analysis","term":"De l’effroi à la recherche","definition":"Le texte ne part pas d’une preuve de Dieu mais d’une expérience existentielle : ne pas savoir d’où l’on vient, où l’on va et pourquoi l’on est là."}]},{"id":"anselme-preuve-ontologique-dieu","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Religion · preuve ontologique","title":"Dieu existe en vertu même de sa définition","author":"Saint Anselme de Cantorbéry","authorTag":"Saint-Anselme","cardHighlight":"existe en vertu même de sa définition","familiarIdea":"la preuve ontologique","authorMeta":"(1033–1109) · scolastique","themes":["Religion","Démonstration","Raison"],"work":"Proslogion","publication":"chap. II–III, trad. A. Koyré, Vrin, 1967, p. 13–15","description":"Peut-on montrer que Dieu existe à partir de l’idée même d’un être dont on ne peut rien concevoir de plus grand ?","context":"Anselme part de la définition de Dieu comme « ce dont on ne peut rien concevoir de plus grand ». Son raisonnement cherche ensuite à montrer qu’un tel être ne peut pas exister seulement dans l’esprit : l’<strong>existence</strong> réelle doit appartenir à ce que nous concevons comme absolument suprême.","readingNotes":[{"type":"analysis","term":"Fides quaerens intellectum","definition":"La démarche d’Anselme est celle d’une foi qui cherche l’intelligence : il ne prétend pas produire une foi sans présupposé, mais penser rationnellement ce qu’elle affirme."}]},{"id":"hume-mal-monde-imparfait","section":"philosophie","cardMeta":"Religion · mal et preuve de Dieu","title":"L’existence du mal naturel montre que le monde n’est pas parfait","author":"David Hume","authorTag":"Hume","cardHighlight":"le monde n’est pas parfait","familiarIdea":"le problème du mal","authorMeta":"(1711–1776) · empirisme / scepticisme","themes":["Religion","Raison","Nature"],"work":"Dialogues sur la religion naturelle","publication":"1779, onzième partie, trad. M. Malherbe, Vrin, 1987, p. 134–140","description":"L’ordre du monde permet-il vraiment d’inférer l’existence d’un créateur parfaitement puissant et bienveillant quand la nature contient tant de souffrance ?","context":"Hume confronte l’idée d’un Dieu parfaitement bon et puissant à l’existence du <strong>mal</strong> dans le monde. Les souffrances et les désordres naturels ne prouvent pas que Dieu n’existe pas, mais ils fragilisent l’argument qui prétend déduire ses attributs à partir de l’ordre du monde.","readingNotes":[{"type":"opposition","left":{"term":"Ordre du monde","definition":"Peut sembler suggérer une intelligence organisatrice."},"right":{"term":"Mal et imperfections","definition":"Interdisent de conclure facilement à un créateur infiniment bon et puissant."},"conclusion":"Hume ne déduit pas la non-existence de Dieu : il montre l’insuffisance de l’inférence à partir du monde observé."}]},{"id":"leibniz-raison-existence-monde","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Religion · raison suffisante","title":"Le monde doit avoir une raison de son existence","author":"Gottfried Wilhelm Leibniz","authorTag":"Leibniz","cardHighlight":"raison de son existence","familiarIdea":"le principe de raison suffisante","authorMeta":"(1646–1716) · rationalisme","themes":["Religion","Raison"],"work":"Essais de Théodicée","publication":"1710, première partie, § 7","description":"Pourquoi l’ensemble des choses contingentes ne peut-il pas contenir en lui-même la raison suffisante de sa propre existence ?","context":"Dans ce passage proposé en philosophie de Terminale parmi les textes sur la religion et la preuve de Dieu, Leibniz part du caractère <strong>contingent</strong> des choses du monde : elles existent, mais auraient pu être autrement. Il demande alors où trouver la raison de l’existence de l’ensemble du monde et remonte à une substance qui porte en elle la raison de son existence. Le texte donne une formulation philosophique très directe à la question que la Genèse ouvre autrement : <strong>pourquoi y a-t-il un monde ?</strong>","readingNotes":[{"type":"opposition","left":{"term":"Contingent","definition":"Le monde et les choses qu’il contient auraient pu être autrement."},"right":{"term":"Nécessaire","definition":"La raison ultime recherchée doit porter en elle-même la raison de son existence."},"conclusion":"Leibniz refuse donc de faire de l’existence du monde un simple fait sans raison."},{"type":"analysis","term":"Changer de niveau d’explication","definition":"Expliquer une chose du monde par une autre chose du monde ne répond pas encore à la question de savoir pourquoi l’ensemble des choses contingentes existe. Leibniz déplace donc la recherche vers une raison qui ne soit pas elle-même contingente."},{"type":"analysis","term":"De la création au problème métaphysique","definition":"La Genèse affirme que le monde vient de Dieu ; Leibniz cherche, lui, à construire un raisonnement permettant de passer de la contingence du monde à une première raison nécessaire. Les deux textes ne procèdent donc pas de la même manière, mais se rencontrent sur la question de l’origine."}]},{"id":"leibniz-meilleur-mondes-possibles","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Religion · théodicée","title":"Dieu a créé le meilleur des mondes possibles","author":"Gottfried Wilhelm Leibniz","authorTag":"Leibniz","cardHighlight":"meilleur des mondes possibles","familiarIdea":"le meilleur des mondes possibles","authorMeta":"(1646–1716) · rationalisme","themes":["Religion","Raison","Justice"],"work":"De la production originelle des choses prise à sa racine","publication":"1697, dans Opuscules philosophiques choisis, trad. P. Schrecker, Vrin, 1969, p. 89–91","description":"Comment défendre la bonté et la sagesse de Dieu alors que le monde contient souffrances, injustices et désordre ?","context":"Leibniz cherche à concilier l’existence du mal avec la perfection divine. Si Dieu choisit nécessairement le meilleur, ce qui nous paraît mauvais depuis notre point de vue limité peut participer à l’ordre d’un ensemble que nous ne saisissons pas entièrement.","readingNotes":[{"type":"analysis","term":"Le point de vue de la totalité","definition":"Leibniz refuse de juger le plan divin à partir d’un fragment de l’histoire ou du monde : un défaut local peut contribuer à une perfection globale inaccessible à notre perspective."}]},{"id":"pascal-coeur-raison-foi","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Religion · foi et raison","title":"La raison ne peut comprendre la foi","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"la raison ne peut comprendre la foi","familiarIdea":"« le cœur a ses raisons »","authorMeta":"(1623–1662) · jansénisme","themes":["Religion","Raison","Vérité"],"work":"Pensées","publication":"1670 posth., éd. L. Brunschvicg, 282 (Lafuma 110), dans Pensées et opuscules, Hachette, 1967, p. 459–460","description":"La raison peut-elle démontrer les premiers principes dont elle dépend elle-même, et peut-elle produire la foi religieuse ?","context":"Pascal distingue la connaissance <strong>discursive</strong> de la raison et une connaissance immédiate par le <strong>cœur</strong>. Les premiers principes ne sont pas démontrés mais sentis ; de même, la foi véritable n’est pas le simple résultat d’une chaîne de raisonnements.","readingNotes":[{"type":"opposition","left":{"term":"Le cœur","definition":"Saisit ou sent les premiers principes sans démonstration."},"right":{"term":"La raison","definition":"Démontre des conséquences à partir de principes qu’elle reçoit déjà."},"conclusion":"Pascal ne supprime pas la raison ; il en fixe les limites et lui interdit de se prendre pour la source de toutes nos certitudes."}]},{"id":"robespierre-sentiment-religieux-morale-sociale","section":"philosophie","cardMeta":"Religion · morale sociale","title":"Le sentiment religieux maintient la morale sociale","author":"Maximilien Robespierre","authorTag":"Robespierre","cardHighlight":"maintient la morale sociale","authorMeta":"(1758–1794) · philosophie politique révolutionnaire","themes":["Religion","Devoir","État"],"work":"Sur les rapports des idées religieuses et morales avec les principes républicains et les fêtes nationales","publication":"18 floréal de l’an II (7 mai 1794), Prévot, 1831, p. 18–20","description":"Une société politique peut-elle supprimer brutalement les croyances religieuses sans fragiliser les motifs moraux qui soutiennent les conduites ?","context":"Robespierre ne défend pas ici une religion particulière : il attribue au <strong>sentiment religieux</strong> une fonction morale et politique. La croyance en un ordre supérieur peut, selon lui, soutenir les devoirs lorsque la seule autorité humaine ne suffit plus.","readingNotes":[{"type":"analysis","term":"Religion, morale et République","definition":"Robespierre défend moins la vérité théorique d’un dogme qu’une fonction pratique du religieux dans l’ordre civique."}]},{"id":"marx-religion-opium-peuple","section":"philosophie","cardMeta":"Religion · critique sociale","title":"La religion est « l’opium » qui tient le peuple asservi","author":"Karl Marx","authorTag":"Marx","cardHighlight":"l’opium du peuple","familiarIdea":"« la religion, opium du peuple »","authorMeta":"(1818–1883) · matérialisme historique","themes":["Religion","État","Travail"],"work":"Critique de la philosophie du droit de Hegel","publication":"1843, dans Marx et Engels, Sur la religion, Éd. Sociales, trad. Badia et alii, 1972, p. 40–41","description":"La religion est-elle seulement une illusion imposée d’en haut, ou aussi l’expression réelle d’une détresse sociale qu’elle rend supportable ?","context":"Marx présente la religion à la fois comme une <strong>consolation</strong> face à la détresse et comme le symptôme d’un monde social qui produit cette détresse. Critiquer la religion ne suffit donc pas : il faut transformer les conditions réelles qui rendent cette consolation nécessaire.","readingNotes":[{"type":"analysis","term":"Critiquer les conditions, pas seulement l’illusion","definition":"La thèse ne se réduit pas à dire que la religion trompe : elle explique aussi pourquoi cette illusion répond à une souffrance réelle."}]},{"id":"nietzsche-dieu-mort-valeurs","section":"philosophie","cardMeta":"Religion · mort de Dieu et valeurs","title":"« Dieu est mort » mais les valeurs survivent à la destruction de la croyance","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"Dieu est mort","familiarIdea":"la mort de Dieu","authorMeta":"(1844–1900) · généalogie / critique des valeurs","themes":["Religion","Vérité","Devoir"],"work":"Le Gai Savoir","publication":"1882, § 343, trad. P. Klossowski, Gallimard, 1982, p. 237","description":"La disparition de la croyance chrétienne suffit-elle à faire disparaître les valeurs, habitudes et institutions qui se sont construites autour d’elle ?","context":"Nietzsche présente la <strong>mort de Dieu</strong> comme un événement culturel dont les conséquences sont encore à venir. Une croyance peut s’effondrer tandis que les valeurs, pratiques et institutions qu’elle a façonnées continuent longtemps à organiser nos manières de vivre.","readingNotes":[{"type":"analysis","term":"Un événement encore inachevé","definition":"Pour Nietzsche, la fin explicite d’une croyance ne supprime pas immédiatement les manières de penser qui ont été construites sur elle."}]},{"id":"gauchet-religion-lien-social","section":"philosophie","cardMeta":"Religion · sécularisation et lien social","title":"Même sans religion, le lien social a besoin de religiosité pour subsister","author":"Marcel Gauchet","authorTag":"Gauchet","cardHighlight":"le lien social a besoin de religiosité","familiarIdea":"la sortie de la religion","authorMeta":"(né en 1946) · philosophie politique contemporaine","themes":["Religion","État","Devoir"],"work":"Le Désenchantement du monde","publication":"Gallimard, 1985, p. 133–134","description":"La sortie institutionnelle de la religion signifie-t-elle la disparition complète de toute expérience religieuse ou symbolique ?","context":"Gauchet distingue la disparition des croyances de la <strong>sortie de la religion</strong> comme principe d’organisation de la société. Une société peut donc devenir politiquement autonome à l’égard du religieux tout en conservant des croyances, des rites et des formes de religiosité.","readingNotes":[{"type":"analysis","term":"Croyance individuelle et structure sociale","definition":"Le critère décisif n’est pas seulement ce que les individus croient intérieurement, mais la manière dont la société organise ses institutions et ses pratiques."}]},{"id":"sartre-homme-prendre-place-dieu","section":"philosophie","cardMeta":"Religion · athéisme et création des valeurs","title":"C’est l’homme qui, comme créateur, va prendre la place de Dieu","author":"Jean-Paul Sartre","authorTag":"Sartre","cardHighlight":"prendre la place de Dieu","authorMeta":"(1905–1980) · existentialisme","themes":["Religion","Liberté","Devoir"],"work":"L’existentialisme est un humanisme","publication":"1946, Gallimard, 1996, p. 39–40 et 73–74","description":"Si Dieu n’existe pas et qu’aucune valeur n’est donnée d’avance, l’être humain doit-il inventer lui-même le sens et les valeurs de son existence ?","context":"Sartre tire les conséquences de l’<strong>existentialisme athée</strong> : si aucune nature humaine ni aucune valeur ne sont données d’avance, l’être humain doit se définir par ses choix. Sa liberté l’expose ainsi à une responsabilité sans recours à un ordre transcendant.","readingNotes":[{"type":"analysis","term":"Après Dieu, la responsabilité","definition":"La suppression d’un fondement divin n’abolit pas la morale chez Sartre : elle rend au contraire l’être humain responsable de la création et du choix des valeurs."}],"familiarIdea":"l’existence précède l’essence"},{"id":"aristote-demonstration-syllogisme-scientifique","section":"philosophie","cardMeta":"Démonstration · syllogisme scientifique","title":"Seul ce qui obéit aux règles formelles du raisonnement constitue une démonstration","author":"Aristote","authorTag":"Aristote","cardHighlight":"règles formelles du raisonnement","authorMeta":"(384–322 av. J.-C.) · aristotélisme","themes":["Vérité","Démonstration","Raison"],"work":"Seconds Analytiques","publication":"IVe s. av. J.-C., I, 2, 71b 16, trad. J. Tricot, Vrin, 2000, p. 8–9","description":"Quelles conditions les prémisses doivent-elles remplir pour qu’un raisonnement constitue une véritable démonstration scientifique ?","context":"Aristote distingue un raisonnement simplement valide d’une véritable <strong>démonstration scientifique</strong>. Démontrer, ce n’est pas seulement tirer correctement une conclusion : il faut partir de principes vrais et connaître par eux la <strong>cause</strong> de ce que l’on affirme.","readingNotes":[{"type":"analysis","term":"Validité et science","definition":"Un raisonnement peut être formellement correct sans produire de science si ses prémisses ne sont pas vraies ou ne donnent pas la cause de ce qui est conclu."},{"type":"concept","term":"La connaissance par les causes","definition":"Pour Aristote, savoir véritablement ne consiste pas seulement à constater qu’une chose est, mais à connaître pourquoi elle est ainsi."}]},{"id":"pascal-principes-demonstration-indemontrables","section":"philosophie","cardMeta":"Démonstration · principes","title":"Les principes de la démonstration ne sont pas démontrables","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"principes de la démonstration","authorMeta":"(1623–1662) · philosophie moderne","themes":["Vérité","Démonstration","Raison"],"work":"De l’esprit géométrique","publication":"1776 posth., section I, dans Pensées et opuscules, Hachette, 1967, p. 164–167","description":"Une méthode parfaite pourrait-elle tout définir et tout démontrer sans jamais rencontrer un premier terme ou une première vérité ?","context":"Pascal rappelle qu’on ne peut ni tout définir ni tout démontrer. Toute démonstration doit déjà s’appuyer sur des termes compris et sur des <strong>principes</strong> admis sans preuve : la raison démonstrative possède donc des conditions qu’elle ne peut elle-même démontrer.","readingNotes":[{"type":"opposition","left":{"term":"Idéal démonstratif","definition":"Définir tous les termes et démontrer toutes les propositions."},"right":{"term":"Limite réelle","definition":"Les premiers termes et premières propositions ne peuvent être définis ou prouvés sans supposer quelque chose d’antérieur."},"conclusion":"La rigueur ne consiste donc pas à tout démontrer, mais à reconnaître clairement les principes à partir desquels la démonstration devient possible."}]},{"id":"kant-existence-pas-predicat","section":"philosophie","cardMeta":"Démonstration · existence","title":"Les attributs des choses sont démontrables, mais pas leur existence","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"pas leur existence","authorMeta":"(1724–1804) · philosophie critique","themes":["Vérité","Démonstration","Religion"],"work":"Critique de la raison pure","publication":"1781–1787, Dialectique transcendantale, chap. III, section IV, trad. A. Tremesaygues et B. Pacaud, PUF, 2001, p. 429–430","description":"Peut-on démontrer qu’une chose existe en ajoutant simplement l’existence à son concept ?","context":"Kant critique l’idée qu’on puisse déduire l’existence d’une chose à partir de son seul concept. Dire qu’une chose <strong>existe</strong> n’ajoute aucune propriété à sa définition : cela pose l’objet lui-même. L’argument vise directement la preuve ontologique de Dieu.","readingNotes":[{"type":"concept","term":"« Être » n’ajoute rien au concept","definition":"Le concept d’une chose reste le même qu’on la pense comme possible ou qu’on affirme qu’elle existe. Ce qui change n’est pas son contenu conceptuel, mais son rapport à la réalité."}],"familiarIdea":"« l’existence n’est pas un prédicat »"},{"id":"zenon-mouvement-demonstration-absurde","section":"philosophie","cardMeta":"Démonstration · paradoxe","title":"Il est possible de démontrer des choses absurdes","author":"Zénon d’Élée","authorTag":"Zénon","cardHighlight":"démontrer des choses absurdes","familiarIdea":"les paradoxes de Zénon","authorMeta":"(v. 480–v. 420 av. J.-C.) · éléatisme","themes":["Vérité","Démonstration","Raison"],"work":"Arguments contre le mouvement","publication":"présentés par Victor Brochard, Études de philosophie ancienne et de philosophie moderne, Vrin, 1954, p. 5–6","description":"Un raisonnement rigoureux peut-il conduire à nier ce que l’expérience semble pourtant rendre évident, comme l’existence du mouvement ?","context":"Les paradoxes de Zénon montrent comment un raisonnement apparemment rigoureux peut conduire à nier ce que l’expérience semble rendre évident : le <strong>mouvement</strong>. Ils obligent ainsi à interroger nos concepts d’espace, de temps, d’infini et la portée d’une démonstration.","readingNotes":[{"type":"opposition","left":{"term":"Théorie","definition":"Les arguments semblent rendre le mouvement contradictoire à partir de certaines hypothèses sur le continu."},"right":{"term":"Pratique / expérience","definition":"Nous constatons pourtant quotidiennement que les corps se déplacent."},"conclusion":"Le paradoxe met à l’épreuve la relation entre cohérence logique et vérité du réel."}]},{"id":"nietzsche-logique-survie-verite","section":"philosophie","cardMeta":"Vérité · critique de la logique","title":"La logique n’a pas la vérité pour but, mais la survie","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"pas la vérité pour but","authorMeta":"(1844–1900) · philosophie contemporaine","themes":["Vérité","Raison","Langage"],"work":"Le Gai Savoir","publication":"1882, § 111, trad. P. Klossowski, Gallimard, p. 141–142","description":"Et si les catégories de la logique n’avaient pas été sélectionnées parce qu’elles sont vraies, mais parce qu’elles sont utiles à la vie ?","context":"Nietzsche demande d’où vient notre confiance dans la logique. Identifier, classer et simplifier le réel aurait d’abord servi à <strong>agir et survivre</strong> : la logique pourrait ainsi être une construction utile avant d’être un miroir fidèle de la réalité.","readingNotes":[{"type":"concept","term":"Une logique sélectionnée par la vie","definition":"Les formes de pensée les plus prudentes et sceptiques auraient pu être plus proches d’un réel mouvant, mais moins efficaces pour décider et agir rapidement."}]},{"id":"bergson-verite-action-pragmatisme","section":"philosophie","cardMeta":"Vérité · pragmatisme","title":"La vérité nous donne prise sur le réel et guide l’action","author":"Henri Bergson","authorTag":"Bergson","cardHighlight":"donne prise sur le réel","authorMeta":"(1859–1941) · philosophie contemporaine","themes":["Vérité","Science","Raison"],"work":"Sur le pragmatisme de William James, dans La Pensée et le Mouvant","publication":"1938, PUF, 2009, p. 244–246","description":"Une affirmation vraie copie-t-elle le réel, ou vaut-elle surtout par la prise qu’elle nous donne sur une réalité mouvante ?","context":"Bergson refuse de réduire la vérité à une simple <strong>copie du réel</strong>. Une vérité scientifique généralise et simplifie ; sa valeur se manifeste aussi dans sa capacité à nous orienter, à prévoir et à agir efficacement.","readingNotes":[{"type":"opposition","left":{"term":"Vérité-copie","definition":"L’énoncé vrai reproduirait le réel comme un portrait reproduit son modèle."},"right":{"term":"Vérité-action","definition":"L’énoncé vrai organise l’expérience, permet de prévoir et donne une prise pratique sur ce qui arrive."},"conclusion":"Bergson ne supprime pas la réalité ; il refuse simplement d’en faire un objet statique que le discours pourrait dupliquer."}]},{"id":"sextus-empiricus-verite-hors-portee","section":"philosophie","cardMeta":"Scepticisme","title":"La vérité est hors de notre portée","author":"Sextus Empiricus","authorTag":"Sextus Empiricus","cardHighlight":"hors de notre portée","familiarIdea":"les cinq modes d’Agrippa","authorMeta":"(IIe–IIIe s.) · scepticisme","themes":["Vérité","Démonstration","Raison"],"work":"Esquisses pyrrhoniennes","publication":"I, 15, trad. P. Pellegrin, Le Seuil, 1997, p. 142–143","description":"Existe-t-il un moyen de justifier définitivement une affirmation sans tomber dans le désaccord, la régression à l’infini ou le cercle vicieux ?","context":"Sextus Empiricus rassemble plusieurs façons de mettre en difficulté toute prétention à une justification définitive. Désaccord, régression à l’infini, hypothèse ou cercle conduisent le sceptique à suspendre son jugement plutôt qu’à affirmer posséder la <strong>vérité</strong>.","readingNotes":[{"type":"analysis","term":"Cinq obstacles à la fondation","definition":"Le sceptique ne cherche pas nécessairement à prouver que toute vérité est impossible ; il montre que les prétentions dogmatiques à une justification ultime rencontrent des difficultés récurrentes."}]},{"id":"aristote-verite-correspondance-reel","section":"philosophie","cardMeta":"Vérité · correspondance","title":"La vérité est la correspondance entre ce qui est pensé et ce qui est","author":"Aristote","authorTag":"Aristote","cardHighlight":"correspondance entre ce qui est pensé et ce qui est","familiarIdea":"la vérité comme correspondance","authorMeta":"(384–322 av. J.-C.) · aristotélisme","themes":["Vérité","Raison"],"work":"Métaphysique","publication":"IVe s. av. J.-C., livre thêta (9), chap. 10, trad. J. Tricot, Vrin, 1991, p. 54–55","description":"Une pensée est-elle vraie parce qu’elle produit le réel, ou parce qu’elle affirme les choses telles qu’elles sont ?","context":"Aristote formule ici une conception classique de la <strong>vérité-correspondance</strong> : être dans le vrai consiste à unir dans la pensée ce qui est uni dans le réel et à séparer ce qui est séparé. La vérité dépend donc de l’état de l’objet, non de notre simple manière de penser.","readingNotes":[{"type":"opposition","left":{"term":"Vrai","definition":"Penser uni ce qui est uni et séparé ce qui est séparé."},"right":{"term":"Faux","definition":"Attribuer au réel une union ou une séparation contraire à ce qui est."},"conclusion":"La vérité dépend du côté de l’objet : ce n’est pas notre pensée qui crée le fait qu’une chose est telle."}]},{"id":"kant-verite-correspondance-diallele","section":"philosophie","cardMeta":"Vérité · critère","title":"La correspondance ne suffit pas à définir la vérité","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"ne suffit pas à définir la vérité","authorMeta":"(1724–1804) · philosophie critique","themes":["Vérité","Raison","Démonstration"],"work":"Logique","publication":"1800, introduction VIII, trad. L. Guillermit, Vrin, 1989, p. 54–55","description":"Si la vérité est l’accord de la connaissance avec l’objet, comment vérifier cet accord sans comparer l’objet à travers cette même connaissance ?","context":"Kant accepte la définition classique de la <strong>vérité</strong> comme accord d’une connaissance avec son objet, mais il distingue cette définition d’un critère permettant de reconnaître le vrai. Vérifier l’accord semble en effet exiger que nous connaissions déjà l’objet auquel nous comparons notre jugement.","readingNotes":[{"type":"analysis","term":"Une définition sans test immédiat","definition":"Dire que le vrai est l’accord avec l’objet peut être correct comme définition générale, mais cela ne donne pas encore une procédure permettant de vérifier cet accord."}]},{"id":"platon-doute-haine-raison","section":"philosophie","cardMeta":"Vérité · doute et raison","title":"Le doute illimité peut conduire à la haine de la raison","author":"Platon","authorTag":"Platon","cardHighlight":"haine de la raison","familiarIdea":"la misologie","authorMeta":"(v. 427–347 av. J.-C.) · platonisme","themes":["Vérité","Raison"],"work":"La République","publication":"livre VII, 538a–539a, trad. G. Leroux, GF, 2002, p. 396","description":"Découvrir que certaines opinions sont réfutables doit-il conduire à examiner mieux, ou à ne plus croire en rien ?","context":"Platon met en garde contre la <strong>misologie</strong>, la haine du raisonnement. Être réfuté à répétition peut conduire non pas à mieux penser, mais à conclure que tout raisonnement se vaut et qu’aucune vérité n’est accessible.","readingNotes":[{"type":"concept","term":"Le danger d’un scepticisme adolescent","definition":"Le texte ne condamne pas l’examen critique ; il condamne le passage trop rapide de la découverte de quelques erreurs à l’idée que toute raison et toute valeur sont trompeuses."}]},{"id":"epictete-pratique-avant-demonstration","section":"philosophie","cardMeta":"Vérité · théorie et pratique","title":"Il y a des choses plus urgentes que la recherche de la vérité","author":"Épictète","authorTag":"Épictète","cardHighlight":"plus urgentes que la recherche de la vérité","authorMeta":"(v. 50–v. 125) · stoïcisme","themes":["Vérité","Devoir","Raison"],"work":"Manuel","publication":"L. III, trad. M. Meunier, GF, 1964, p. 208","description":"À quoi sert de savoir démontrer qu’il ne faut pas mentir si nous continuons pourtant à mentir ?","context":"Épictète rappelle que la philosophie n’a pas d’abord pour but de produire de belles démonstrations, mais de transformer notre manière de vivre. <strong>Savoir</strong> une maxime ne suffit pas : l’essentiel est de la <strong>mettre en pratique</strong>.","readingNotes":[{"type":"opposition","left":{"term":"Savoir démontrer","definition":"Être capable d’établir rationnellement pourquoi une maxime est vraie."},"right":{"term":"Vivre selon la maxime","definition":"Transformer effectivement sa conduite conformément à ce que l’on reconnaît comme vrai."},"conclusion":"Pour Épictète, la preuve n’a de sens philosophique que si elle reste au service d’une transformation de la vie."}]},{"id":"platon-callicles-loi-nature-justice","section":"philosophie","cardMeta":"Justice · nature et convention","title":"Nous n’obéissons à la loi que par convention","author":"Platon","authorTag":"Platon","cardHighlight":"loi que par convention","authorMeta":"(v. 427–347 av. J.-C.) · Calliclès dans le Gorgias","themes":["Justice","Nature","État"],"work":"Gorgias","publication":"IVe s. av. J.-C., 482e–484a, trad. M. Canto, GF, 1987, p. 214–215","description":"La loi protège-t-elle réellement la justice, ou n’est-elle qu’une convention inventée par les plus faibles contre les plus forts ?","context":"Dans le <em>Gorgias</em>, Calliclès oppose la <strong>loi</strong>, fabriquée selon lui par les faibles, à la <strong>nature</strong>, qui consacrerait la supériorité des plus puissants. Le texte met ainsi en question le fondement même de ce que nous appelons juste.","readingNotes":[{"type":"opposition","left":{"term":"Selon la loi","definition":"La justice consiste à empêcher les plus forts de prendre davantage et à maintenir l’égalité."},"right":{"term":"Selon la nature","definition":"Calliclès affirme que le meilleur et le plus fort devraient dominer et posséder davantage."},"conclusion":"Tout l’enjeu est de savoir si un fait naturel ou un rapport de force peut réellement produire une norme de justice."},{"type":"analysis","term":"Un sophisme naturaliste","definition":"Le texte passe de ce qui serait observé dans la nature à ce qui devrait être tenu pour juste. Ce passage du fait à la norme constitue précisément le point problématique de l’argument."}]},{"id":"sophocle-antigone-lois-non-ecrites","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Loi · justice · désobéissance","title":"Il existe des lois non écrites supérieures aux lois humaines","author":"Sophocle","authorTag":"Sophocle","cardHighlight":"lois non écrites","familiarIdea":"les lois non écrites d’Antigone","authorMeta":"(v. 495–406 av. J.-C.) · tragédie grecque","themes":["Justice","État"],"work":"Antigone","publication":"v. 442 av. J.-C., trad. P. Mazon, Belles Lettres, 1962, p. 102–104","description":"Faut-il obéir à une loi que l’on juge injuste ?","context":"Dans <em>Antigone</em>, l’ordre de Créon entre en conflit avec des <strong>lois non écrites</strong> qu’Antigone juge plus anciennes et plus légitimes que tout décret humain. Le texte pose directement la question des limites de l’obéissance à l’État.","readingNotes":[{"type":"opposition","left":{"term":"Loi de Créon","definition":"Décision politique datée, formulée par un souverain et applicable dans la cité."},"right":{"term":"Lois non écrites","definition":"Normes divines, immémoriales et présentées comme inébranlables."},"conclusion":"Le texte pose directement la question de la différence entre légalité et légitimité."}]},{"id":"pascal-force-justice","section":"philosophie","cardMeta":"Justice · force et institution","title":"La justice et la force doivent être mises ensemble","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"justice et la force","familiarIdea":"justice et force","authorMeta":"(1623–1662) · philosophie moderne","themes":["Justice","État"],"work":"Pensées","publication":"posth., Lafuma 103 et 81 (Br. 298–299), Le Seuil, 1962, p. 63–64 et 57","description":"La justice peut-elle s’imposer sans force, et que devient la force lorsqu’elle se présente elle-même comme juste ?","context":"Pascal met en tension deux réalités politiques : la <strong>justice</strong>, qui peut être contestée, et la <strong>force</strong>, qui s’impose immédiatement. Un ordre stable doit les réunir, mais il risque alors de présenter comme juste ce qui n’est d’abord que puissant.","readingNotes":[{"type":"opposition","left":{"term":"Justice sans force","definition":"Elle peut être juste en principe mais reste incapable de s’imposer."},"right":{"term":"Force sans justice","definition":"Elle s’impose effectivement mais devient tyrannique."},"conclusion":"L’ordre politique doit articuler norme et puissance ; Pascal montre cependant que cette articulation peut se renverser en légitimation de la force."}]},{"id":"kant-justice-instituee-imparfaite","section":"philosophie","cardMeta":"Justice · gouvernement et nature humaine","title":"La justice instituée ne peut pas être parfaite","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"justice instituée","authorMeta":"(1724–1804) · philosophie critique","themes":["Justice","État","Nature"],"work":"Idée d’une histoire universelle d’un point de vue cosmopolitique","publication":"1784, proposition VI, dans Opuscules sur l’histoire, trad. S. Piobetta, GF, p. 77–78","description":"Comment instituer un pouvoir juste si celui qui doit faire respecter la loi est lui-même un être humain capable d’abuser de sa liberté ?","context":"Kant montre la difficulté propre à toute institution politique : l’être humain a besoin d’une autorité qui limite son arbitraire, mais cette autorité est elle-même exercée par des êtres humains imparfaits. L’ordre juste est donc nécessaire sans pouvoir devenir parfaitement juste.","readingNotes":[{"type":"analysis","term":"Le problème du maître","definition":"Celui qui impose la loi doit lui-même être soumis à une loi. La justice politique rencontre donc une difficulté de régression : qui contraindra le contraignant ?"},{"type":"concept","term":"Le bois noueux","definition":"Métaphore de l’imperfection humaine : une institution raisonnable est possible, mais aucune construction politique ne peut supprimer totalement les penchants humains à l’égoïsme et à l’abus de pouvoir."}],"familiarIdea":"le bois noueux de l’humanité"},{"id":"thomas-more-utopie-egalite","section":"philosophie","cardMeta":"Justice · égalité et utopie","title":"La justice parfaite ne pourrait exister que si l’égalité était assurée","author":"Thomas More","authorTag":"Thomas More","cardHighlight":"égalité était assurée","authorMeta":"(1478–1535) · humanisme de la Renaissance","themes":["Justice","État","Travail"],"work":"L’Utopie","publication":"1516, livre second, trad. M. Delcourt, GF, 1987, p. 139–147","description":"Une société plus juste suppose-t-elle de supprimer la propriété privée et d’organiser collectivement le travail et les conditions de vie ?","context":"Dans <em>L’Utopie</em>, Thomas More imagine une société sans propriété privée, organisée autour du partage des tâches et d’une forte égalité. Cette fiction permet de demander ce que la <strong>justice sociale</strong> exige, mais aussi ce qu’une égalité très organisée peut coûter à la liberté.","readingNotes":[{"type":"opposition","left":{"term":"Égalité","definition":"Les conditions, tâches et ressources sont organisées de manière à limiter fortement les différences entre citoyens."},"right":{"term":"Liberté individuelle","definition":"Le cadre collectif peut aussi restreindre les choix privés, ce qui ouvre une difficulté propre aux modèles utopiques."},"conclusion":"More fait de l’organisation sociale elle-même un moyen de produire la justice, au prix d’une forte réglementation de la vie commune."}]},{"id":"kant-societe-nations-justice","section":"philosophie","cardMeta":"Justice · cosmopolitisme et droit international","title":"Une instance juridique internationale doit garantir la justice","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"instance juridique internationale","authorMeta":"(1724–1804) · philosophie critique","themes":["Justice","État","Histoire"],"work":"Idée d’une histoire universelle d’un point de vue cosmopolitique","publication":"1784, proposition VII, dans Opuscules sur l’histoire, trad. S. Piobetta, GF, 1990, p. 79–80","description":"La justice entre les États peut-elle être garantie tant que chacun demeure souverain et libre d’entrer en conflit avec les autres ?","context":"Kant transpose aux <strong>États</strong> le problème qui conduisait les individus à entrer dans un ordre civil. Tant qu’aucune loi commune ne règle leurs rapports, ils restent exposés à la guerre ; l’<strong>histoire</strong> peut alors être comprise comme un processus conflictuel qui pousse progressivement vers un ordre juridique commun.","readingNotes":[{"type":"analysis","term":"De l’état de nature au droit international","definition":"De même que les individus ont besoin d’un ordre civil, les États doivent sortir de rapports gouvernés par la seule puissance pour entrer dans des relations juridiques."},{"type":"concept","term":"Ruse de la nature","definition":"Kant interprète les conflits comme un mécanisme historique qui contraint progressivement les sociétés à produire des institutions que la raison aurait pu recommander directement."}]},{"id":"rawls-justice-equite-inegalites","section":"philosophie","cardMeta":"Justice · équité et inégalités","title":"La justice parfaite n’exclut pas l’existence de l’inégalité","author":"John Rawls","authorTag":"Rawls","cardHighlight":"n’exclut pas l’existence de l’inégalité","familiarIdea":"le voile d’ignorance","authorMeta":"(1921–2002) · philosophie politique contemporaine","themes":["Justice","État"],"work":"Théorie de la justice","publication":"1971, trad. C. Audard, Le Seuil, 1987, p. 38 et 41","description":"Des inégalités peuvent-elles être justes si les principes qui les autorisent ont été choisis impartialement et bénéficient aux plus défavorisés ?","context":"Rawls imagine une <strong>position originelle</strong> dans laquelle chacun choisit les principes de justice sans connaître sa future place dans la société. Le <strong>voile d’ignorance</strong> doit ainsi empêcher chacun de construire les règles à son avantage.","readingNotes":[{"type":"opposition","left":{"term":"Égalité stricte","definition":"Toutes les positions et ressources seraient réparties uniformément."},"right":{"term":"Équité rawlsienne","definition":"Des inégalités peuvent être admises si les libertés fondamentales sont garanties et si elles profitent aux plus défavorisés."},"conclusion":"Rawls distingue donc justice et égalité matérielle absolue."}]},{"id":"kant-desobeissance-loi-inconditionnelle","section":"philosophie","cardMeta":"Justice · droit et obéissance","title":"L’obéissance à la loi doit être inconditionnelle","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"obéissance à la loi","authorMeta":"(1724–1804) · philosophie critique","themes":["Justice","État","Devoir"],"work":"Sur l’expression courante : il se peut que cela soit juste en théorie, mais en pratique cela ne vaut rien","publication":"1793, trad. L. Guillermit, Vrin, 1967, p. 42–43","description":"Peut-on reconnaître juridiquement un droit de rébellion contre un pouvoir injuste sans détruire le principe même d’un ordre juridique commun ?","context":"Kant refuse de reconnaître un <strong>droit de résistance</strong> à l’intérieur d’un ordre juridique déjà constitué. Même lorsqu’un pouvoir est injuste, autoriser chacun à lui opposer la force détruirait, selon lui, l’autorité commune dont dépend la possibilité même du droit.","readingNotes":[{"type":"opposition","left":{"term":"Critiquer le pouvoir","definition":"On peut juger une politique ou une institution injuste en théorie."},"right":{"term":"Résister juridiquement par la force","definition":"Kant refuse d’en faire un droit, car l’autorité du droit serait alors dissoute au moment même où chacun s’autoriserait à juger souverainement."},"conclusion":"Le texte ne dit pas que tout gouvernement est juste ; il refuse qu’un droit de désobéissance violente puisse être inscrit dans l’ordre juridique lui-même."}]},{"id":"thoreau-desobeir-lois-injustes","section":"philosophie","cardMeta":"Justice · désobéissance civile","title":"Il est parfois légitime de désobéir aux lois","author":"Henry David Thoreau","authorTag":"Thoreau","cardHighlight":"légitime de désobéir","familiarIdea":"la désobéissance civile","authorMeta":"(1817–1862) · transcendantalisme américain","themes":["Justice","État","Liberté"],"work":"La Désobéissance civile","publication":"1849, trad. G. Villeneuve, Mille et une nuits, 1997, p. 23–24 et 28–29","description":"Que doit faire un individu lorsqu’obéir à la loi revient à devenir personnellement l’agent d’une injustice ?","context":"Thoreau soutient qu’un citoyen ne doit pas devenir l’instrument d’une injustice qu’il condamne. Lorsque la loi nous oblige à participer directement au mal, la <strong>désobéissance civile</strong> consiste à retirer concrètement sa coopération à l’État.","readingNotes":[{"type":"analysis","term":"Le contre-frottement","definition":"Thoreau décrit l’État comme une machine : tant que l’injustice n’est qu’un défaut marginal, elle peut être tolérée ; mais lorsque l’individu devient lui-même l’engrenage qui produit le mal, il doit bloquer la machine par son refus."},{"type":"concept","term":"Une minorité irrésistible","definition":"Une minorité qui cesse réellement de coopérer peut acquérir une puissance politique supérieure à son nombre, précisément parce qu’elle retire à l’État les actes et ressources dont il dépend."}]},{"id":"platon-glaucon-devoir-contrainte","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Justice et nature humaine","title":"Si nous le pouvions, nous désobéirions sans cesse au devoir","author":"Platon","authorTag":"Platon","cardHighlight":"désobéirions sans cesse au devoir","authorMeta":"(v. 427–347 av. J.-C.) · Glaucon dans La République","themes":["Devoir","Justice"],"work":"La République","publication":"livre II, 359b–360d, trad. G. Leroux, GF, p. 123–125","description":"Sommes-nous justes par choix moral ou seulement parce que la loi nous empêche de commettre l’injustice impunément ?","context":"Glaucon imagine l’<strong>anneau de Gygès</strong>, qui rend son possesseur invisible, pour tester la solidité de notre attachement à la justice. Si toute sanction disparaissait, continuerions-nous à être justes ou découvririons-nous que nous n’obéissons que par contrainte ?","readingNotes":[{"type":"opposition","left":{"term":"Justice par contrainte","definition":"On respecte la loi parce qu’on craint la sanction ou parce qu’on ne peut pas agir autrement."},"right":{"term":"Justice par devoir","definition":"On agit justement parce qu’on reconnaît que l’action est moralement requise."},"conclusion":"Le texte met en crise l’idée que le simple respect extérieur de la loi prouve une véritable moralité."},{"type":"analysis","term":"Une expérience de pensée","definition":"L’invisibilité supprime les conséquences sociales ordinaires de l’injustice. Elle isole ainsi la question suivante : que ferions-nous si rien ne pouvait nous punir ni nous démasquer ?"}],"familiarIdea":"l’anneau de Gygès"},{"id":"kant-agir-par-devoir","section":"philosophie","cardMeta":"Morale déontologique","title":"Agir conformément au devoir est une contrainte ; agir par devoir est une obligation","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"agir par devoir","authorMeta":"(1724–1804) · philosophie critique","themes":["Devoir","Raison"],"work":"Fondements de la métaphysique des mœurs","publication":"1785, 1re section, trad. V. Delbos, Delagrave, 1999, p. 36","description":"Une action bonne en apparence possède-t-elle une véritable valeur morale si elle est accomplie par inclination plutôt que par devoir ?","context":"Kant distingue l’action simplement <strong>conforme au devoir</strong> de l’action accomplie <strong>par devoir</strong>. Deux conduites extérieurement identiques peuvent donc avoir une valeur morale différente selon le motif qui les fait agir.","readingNotes":[{"type":"opposition","left":{"term":"Conforme au devoir","definition":"L’action correspond à ce qui est moralement demandé, mais son motif peut rester intéressé ou affectif."},"right":{"term":"Par devoir","definition":"L’action est accomplie par respect pour la loi morale, indépendamment de l’intérêt ou de l’inclination."},"conclusion":"La valeur morale ne dépend donc pas seulement de ce qui est fait, mais du principe qui détermine la volonté."},{"type":"concept","term":"Valeur morale","definition":"Pour Kant, elle apparaît lorsque la volonté agit à partir du devoir lui-même et non parce que l’action procure du plaisir, de l’estime ou un avantage."}],"familiarIdea":"agir par devoir"},{"id":"pascal-coutumes-conventions-justice","section":"philosophie","cardMeta":"Relativité des coutumes","title":"Les mœurs et les coutumes sont des conventions","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"coutumes sont des conventions","authorMeta":"(1623–1662) · philosophie moderne","themes":["Devoir","Justice"],"work":"Pensées","publication":"1669 posth., fragment 294 (Brunschvicg), Hachette, 1967, p. 465–467","description":"Les règles morales et juridiques expriment-elles une justice universelle ou seulement les coutumes variables d’un lieu et d’une époque ?","context":"Pascal souligne la diversité historique et géographique des lois : ce qui paraît juste ici peut être tenu pour injuste ailleurs. Il met ainsi en question notre capacité à reconnaître immédiatement une <strong>justice universelle</strong> derrière les coutumes particulières.","readingNotes":[{"type":"opposition","left":{"term":"Justice relative","definition":"Normes variables selon les pays, les époques et les habitudes sociales."},"right":{"term":"Justice absolue","definition":"Principe qui vaudrait en tout lieu et en tout temps, indépendamment des coutumes."},"conclusion":"Pascal met en évidence le décalage entre l’exigence d’une justice universelle et la diversité effective des règles humaines."},{"type":"analysis","term":"La force de la coutume","definition":"Une règle reçue depuis longtemps peut apparaître comme naturellement juste alors qu’elle doit son évidence à l’habitude et à l’autorité qui la maintiennent."}]},{"id":"kant-humanite-fin-en-soi","section":"philosophie","cardMeta":"Morale déontologique","title":"Tout être rationnel doit reconnaître la validité de la loi morale","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"comme fin en soi","familiarIdea":"l’humanité comme fin en soi","authorMeta":"(1724–1804) · philosophie critique","themes":["Devoir","Autrui","Raison"],"work":"Fondements de la métaphysique des mœurs","publication":"1785, 2e section, trad. V. Delbos, Nathan, 1989, p. 56–60","description":"Pourquoi une personne ne peut-elle jamais être traitée seulement comme un moyen au service d’une autre fin ?","context":"Kant distingue les choses, qui ont une valeur relative à nos usages, des <strong>personnes</strong>, qui doivent être respectées pour elles-mêmes. Traiter l’humanité comme une fin signifie donc ne jamais réduire autrui à un simple instrument de nos propres projets.","readingNotes":[{"type":"opposition","left":{"term":"Chose / moyen","definition":"Possède une valeur relative : elle vaut en fonction de l’usage que l’on peut en faire."},"right":{"term":"Personne / fin en soi","definition":"Possède une valeur inconditionnelle et impose une limite morale à l’action d’autrui."},"conclusion":"La morale kantienne fait du respect de la personne une exigence universelle."},{"type":"concept","term":"Formule de l’humanité","definition":"« Agis de telle sorte que tu traites l’humanité […] toujours en même temps comme une fin, et jamais simplement comme un moyen. »"}]},{"id":"schopenhauer-pitie-fondement-morale","section":"philosophie","cardMeta":"Éthique de la compassion","title":"La pitié est la racine de la moralité","author":"Arthur Schopenhauer","authorTag":"Schopenhauer","cardHighlight":"pitié est la racine","authorMeta":"(1788–1860) · pessimisme philosophique","themes":["Devoir","Autrui"],"work":"Le Fondement de la morale","publication":"1841, § 16, trad. A. Burdeau modifiée, Le Livre de poche, p. 155–156","description":"Qu’est-ce qui peut nous conduire à vouloir directement le bien d’autrui plutôt que notre propre intérêt ?","context":"Schopenhauer cherche comment le bien d’<strong>autrui</strong> peut devenir un motif direct de mon action. La pitié rend cela possible : sans calcul d’intérêt, je prends part à sa souffrance au point de vouloir réellement son bien comme je veux habituellement le mien.","readingNotes":[{"type":"opposition","left":{"term":"Morale rationnelle","definition":"La conduite est fondée sur une règle ou un devoir reconnu par la raison."},"right":{"term":"Morale de la compassion","definition":"La conduite naît d’une participation immédiate à la souffrance d’autrui."},"conclusion":"Schopenhauer déplace le fondement de la moralité de la loi vers une expérience affective de l’autre."},{"type":"concept","term":"Identification à autrui","definition":"La pitié suspend momentanément la séparation égoïste : la souffrance de l’autre est éprouvée comme suffisamment proche pour devenir un motif de ma propre action."}]},{"id":"kant-raison-volonte-bonne","section":"philosophie","cardMeta":"Morale déontologique","title":"La morale doit être fondée sur la raison","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"fondée sur la raison","familiarIdea":"la bonne volonté","authorMeta":"(1724–1804) · philosophie critique","themes":["Devoir","Raison","Bonheur"],"work":"Fondements de la métaphysique des mœurs","publication":"1785, 1re section, trad. V. Delbos, Nathan, 1989, p. 31–32","description":"Si la raison nous rend parfois moins heureux, quelle peut être sa véritable fonction pratique ?","context":"Kant part d’un paradoxe : la <strong>raison</strong> n’est pas le meilleur moyen d’atteindre le bonheur. Si elle nous a pourtant été donnée comme faculté pratique, sa destination doit être ailleurs : produire une <strong>bonne volonté</strong>, bonne en elle-même.","readingNotes":[{"type":"opposition","left":{"term":"Bonheur","definition":"Fin conditionnée par des besoins, des inclinations et des circonstances variables."},"right":{"term":"Bonne volonté","definition":"Valeur morale qui ne dépend pas de la réussite extérieure ni de la satisfaction sensible."},"conclusion":"La raison pratique reçoit chez Kant une destination morale plutôt qu’un rôle d’instrument du bonheur."},{"type":"analysis","term":"Pourquoi partir du devoir ?","definition":"Kant estime que le concept de bonne volonté est déjà présent dans le jugement moral ordinaire. Le devoir permet d’en faire ressortir le principe en le distinguant des inclinations concurrentes."}]},{"id":"mill-qualite-plaisirs-morale","section":"philosophie","cardMeta":"Utilitarisme","title":"La morale interroge la qualité de notre bonheur, non sa quantité","author":"John Stuart Mill","authorTag":"Mill","cardHighlight":"qualité de notre bonheur","familiarIdea":"« Socrate insatisfait plutôt qu’un imbécile satisfait »","authorMeta":"(1806–1873) · utilitarisme","themes":["Devoir","Bonheur"],"work":"L’Utilitarisme","publication":"1863, trad. P. L. Le Monnier, Alcan, 1889, p. 16–18","description":"Tous les plaisirs se valent-ils, ou faut-il distinguer leur qualité pour penser le bonheur moral ?","context":"Mill défend l’<strong>utilitarisme</strong>, mais refuse de réduire le bonheur à une simple quantité de plaisirs. Certains plaisirs valent davantage parce qu’ils engagent des facultés humaines plus élevées, même s’ils rendent parfois moins facilement satisfait.","readingNotes":[{"type":"opposition","left":{"term":"Quantité de plaisir","definition":"Mesure des plaisirs par leur intensité, leur durée ou leur nombre."},"right":{"term":"Qualité des plaisirs","definition":"Hiérarchie fondée sur le type de facultés et de vie auxquels les plaisirs sont liés."},"conclusion":"Mill complexifie l’hédonisme : le bonheur humain ne se réduit pas au maximum de sensations agréables."},{"type":"concept","term":"Dignité des facultés supérieures","definition":"Un être capable d’activités intellectuelles, morales et affectives plus riches peut préférer une satisfaction moins complète à l’abandon de ces capacités."}]},{"id":"kant-morale-dignite-bonheur","section":"philosophie","cardMeta":"Morale déontologique","title":"La morale n’a pas le bonheur pour but","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"pas le bonheur pour but","authorMeta":"(1724–1804) · philosophie critique","themes":["Devoir","Bonheur","Religion"],"work":"Critique de la raison pratique","publication":"1788, trad. F. Picavet, PUF, 1997, p. 139–140","description":"La morale doit-elle nous apprendre à être heureux, ou seulement à nous rendre dignes du bonheur ?","context":"Kant refuse de faire du bonheur le but de la morale. La loi morale nous demande d’abord d’accomplir notre <strong>devoir</strong> ; le bonheur n’intervient qu’ensuite, dans l’idée d’un accord possible entre vertu et bonheur.","readingNotes":[{"type":"opposition","left":{"term":"Doctrine du bonheur","definition":"Ensemble de conseils visant à obtenir la satisfaction ou le bien-être."},"right":{"term":"Doctrine morale","definition":"Détermine ce que nous devons faire indépendamment de la recherche du bonheur."},"conclusion":"La moralité ne tire pas sa valeur de ses effets heureux ; elle constitue la condition rationnelle de la dignité au bonheur."},{"type":"concept","term":"Souverain bien","definition":"Le souverain bien associe la vertu et le bonheur, mais sans subordonner la première au second : la moralité reste la condition fondamentale."}]},{"id":"schopenhauer-bonheur-absence-souffrance","section":"philosophie","cardMeta":"Pessimisme moderne","title":"Le bonheur comme absence de souffrance","author":"Arthur Schopenhauer","authorTag":"Schopenhauer","cardHighlight":"absence de souffrance","authorMeta":"(1788–1860) · pessimisme moderne","themes":["Bonheur","Désir"],"work":"Aphorismes sur la sagesse dans la vie","publication":"1851, trad. J.-A. Cantacuzène","description":"Le bonheur se mesure-t-il à l’intensité des plaisirs ou à l’absence de douleurs ?","context":"Schopenhauer oppose la recherche des <strong>jouissances</strong> à une sagesse plus sobre : réduire autant que possible la <strong>souffrance</strong>."},{"id":"schopenhauer-bien-etre-negation","section":"philosophie","cardMeta":"Pessimisme moderne","title":"Le bien-être ne se ressent qu’après sa perte","author":"Arthur Schopenhauer","authorTag":"Schopenhauer","cardHighlight":"après sa perte","authorMeta":"(1788–1860) · pessimisme moderne","themes":["Bonheur","Temps"],"work":"Le Monde comme volonté et comme représentation","publication":"1819, trad. A. Burdeau","description":"Pourquoi ressentons-nous vivement la douleur, tandis que le bien-être demeure presque invisible ?","context":"Schopenhauer souligne une asymétrie : la <strong>douleur</strong> se fait immédiatement sentir, tandis que le bien-être passe souvent inaperçu. Notre rapport au <strong>temps</strong> révèle cette différence, car l’ennui et la souffrance modifient profondément la manière dont nous éprouvons sa durée."},{"id":"epictete-depend-nous","section":"philosophie","cardMeta":"Stoïcisme","title":"La liberté commence par ce qui dépend de nous","author":"Épictète","authorTag":"Épictète","cardHighlight":"ce qui dépend de nous","familiarIdea":"ce qui dépend de nous","authorMeta":"(v. 50–v. 135) · stoïcien","themes":["Liberté","Désir"],"work":"Manuel","publication":"IIe s. apr. J.-C.","description":"Comment préserver sa liberté intérieure face à ce qui échappe à notre pouvoir ?","context":"Épictète sépare ce qui relève de notre <strong>jugement</strong> et de notre <strong>désir</strong> de ce qui dépend des circonstances. La liberté se joue d’abord dans cette distinction."},{"id":"epicure-plaisir-vie-heureuse","section":"philosophie","cardMeta":"Épicurisme","title":"Hiérarchiser ses désirs pour vivre heureux","author":"Épicure","authorTag":"Épicure","cardHighlight":"Hiérarchiser ses désirs","familiarIdea":"la classification des désirs","cardIdea":"L’ataraxie épicurienne","authorMeta":"(341–270 av. J.-C.) · fondateur de l’épicurisme","themes":["Bonheur","Désir","Raison"],"work":"Lettre à Ménécée","publication":"IIIe s. av. J.-C., trad. M. Solovine, Hermann, 1987, p. 100–102","description":"Comment distinguer les désirs et calculer les plaisirs qui conduisent réellement à la vie heureuse ?","context":"Épicure ne recommande pas de satisfaire tous les désirs. Il faut les <strong>classer</strong>, puis comparer les conséquences des plaisirs et des douleurs afin d’atteindre l’<em>ataraxie</em>, la tranquillité de l’âme.","readingNotes":[{"type":"concept","term":"Épicurisme","badge":"école matérialiste","definition":"Le plaisir sobre et stable est le principe de la vie heureuse. Il ne s’agit pas d’accumuler les jouissances, mais de choisir rationnellement ses désirs."},{"type":"opposition","left":{"term":"<em>ataraxia</em>","definition":"Absence de trouble de l’âme."},"right":{"term":"<em>aponia</em>","definition":"Absence de douleur du corps."},"conclusion":"Ensemble, elles définissent le plaisir stable recherché par Épicure."},{"type":"analysis","term":"La hiérarchie des désirs","definition":"Épicure distingue trois catégories.","items":["Les désirs <strong>naturels et nécessaires</strong> — <em>physikaì kaì anankaîai</em> (φυσικαὶ καὶ ἀναγκαῖαι) — répondent aux exigences de la vie, de la tranquillité du corps ou du bonheur.","Les désirs <strong>seulement naturels</strong> — <em>physikaì mónon</em> (φυσικαὶ μόνον) — procurent un agrément dont on peut se passer.","Les désirs <strong>vains</strong> — <em>kenaí</em> (κεναί) — sont produits par l’opinion, sans limite naturelle, et entretiennent l’inquiétude."]},{"type":"opposition","left":{"term":"En théorie","definition":"Tout plaisir est un bien et toute douleur est un mal par leur nature propre."},"right":{"term":"En pratique","definition":"Un plaisir peut produire davantage de souffrance et une douleur peut conduire à un plaisir supérieur."},"conclusion":"Le plaisir n’est pas une consigne aveugle : chaque choix exige un calcul de ses conséquences."},{"type":"concept","term":"Calcul des plaisirs — <em>nḗphōn logismós</em> (νήφων λογισμός)","definition":"Ce « raisonnement sobre » compare les avantages et les dommages à venir. Il peut conduire à refuser un plaisir nuisible ou à accepter une peine momentanée en vue d’un bien plus grand."},{"type":"analysis","term":"Le mouvement du texte","definition":"L’argumentation progresse de la classification des désirs vers une règle de décision concrète.","items":["Distinguer les désirs naturels, nécessaires et vains.","Définir le bonheur par la tranquillité de l’âme et du corps.","Faire du plaisir le principe de l’évaluation.","Comparer enfin l’utile et le nuisible dans chaque situation."]}]},{"id":"rousseau-desir-imagination-bonheur","section":"philosophie","cardMeta":"Philosophie des Lumières","title":"Le bonheur se nourrit de ce que nous espérons","author":"Jean-Jacques Rousseau","authorTag":"Rousseau","cardHighlight":"se nourrit de ce que nous espérons","authorMeta":"(1712–1778) · philosophe des Lumières","themes":["Désir","Bonheur","Imagination"],"work":"La Nouvelle Héloïse","publication":"1761, lettre VIII, Gallimard, 1993, p. 333","description":"Pourquoi l’attente et l’imagination procurent-elles davantage de bonheur que la possession de l’objet désiré ?","context":"Rousseau montre que le <strong>désir</strong> tient une grande part de son pouvoir à l’<strong>imagination</strong> : avant la possession, elle embellit l’objet absent et le rend presque présent. Une fois l’objet obtenu, ce prestige disparaît ; le bonheur peut ainsi se trouver davantage dans l’espérance que dans la jouissance.","readingNotes":[{"type":"opposition","left":{"term":"Objet espéré","definition":"Absent, il peut être rapproché, transformé et embelli librement par l’imagination."},"right":{"term":"Objet possédé","definition":"Sa présence réelle met fin au prestige, à l’illusion et au travail idéalisant de l’imagination."},"conclusion":"Le plaisir dépend moins de la chose elle-même que de la représentation que le désir en construit."},{"type":"concept","term":"Jouissance","definition":"Plaisir lié à la possession effective d’un bien. Sa durée est limitée, car la présence de l’objet fait disparaître l’attente qui l’embellissait."},{"type":"concept","term":"Ré-jouissance","definition":"Plaisir pris à espérer et à imaginer une satisfaction future. Elle peut surpasser la jouissance parce qu’elle demeure ouverte aux transformations de l’imagination."},{"type":"analysis","term":"Le paradoxe du bonheur","definition":"On croit désirer pour posséder, mais la possession détruit une part du plaisir que le désir produisait. L’être humain est donc heureux « avant d’être heureux », lorsque le possible reste encore ouvert."},{"type":"analysis","term":"Le désir comme condition de la vie humaine","definition":"L’homme est limité et ne peut tout posséder. Cette imperfection n’est pourtant pas seulement un mal : elle entretient l’élan du désir. Une existence sans manque, sans peine et sans attente serait immobile, donc semblable à la mort."},{"type":"plain","definition":"Rousseau ne soutient pas que toute frustration rend heureuse. Il affirme que le mouvement du désir, lorsqu’il est soutenu par l’imagination, appartient positivement au bonheur humain."}]},{"id":"schopenhauer-desir-souffrance-ennui","section":"philosophie","cardMeta":"Pessimisme moderne","title":"Le désir condamne la vie à osciller entre souffrance et ennui","author":"Arthur Schopenhauer","authorTag":"Schopenhauer","cardHighlight":"osciller entre souffrance et ennui","cardIdea":"le pendule du désir","authorMeta":"(1788–1860) · pessimisme moderne","themes":["Désir","Bonheur"],"work":"Le Monde comme volonté et comme représentation","publication":"1819, § 57, trad. A. Burdeau, PUF, 2003, p. 394–395","description":"Pourquoi la satisfaction de nos désirs ne met-elle pas fin à la souffrance ?","context":"Schopenhauer décrit une existence prise dans un mouvement sans repos : le <strong>manque</strong> fait souffrir, mais la satisfaction ne délivre que provisoirement du désir avant de conduire à la satiété ou à l’<strong>ennui</strong>.","readingNotes":[{"type":"plain","definition":"Pour Schopenhauer, la souffrance n’est pas un accident que l’on pourrait éliminer définitivement : elle découle de la structure même du vouloir, toujours tendu vers ce qui lui manque."},{"type":"analysis","term":"Le cycle du désir","definition":"Le désir ne progresse pas vers une satisfaction définitive.","items":["Le <strong>besoin</strong> manifeste un manque et produit la douleur.","La <strong>satisfaction</strong> supprime provisoirement ce manque, mais fait perdre à l’objet son attrait.","Le sujet tombe dans l’<strong>ennui</strong> ou voit naître un nouveau désir, et le cycle recommence."]},{"type":"opposition","left":{"term":"Souffrance","definition":"Présence douloureuse d’un besoin qui n’est pas satisfait."},"right":{"term":"Ennui","definition":"Vide éprouvé lorsque plus aucun objet ne mobilise momentanément le vouloir."},"conclusion":"Ces états paraissent opposés, mais ils sont les deux issues d’un même vouloir incapable de trouver un repos durable."},{"type":"analysis","term":"La métaphore du pendule","definition":"Comme un pendule revient continuellement d’un côté à l’autre, l’existence passe du manque à l’ennui sans atteindre un bonheur stable. L’image insiste à la fois sur la répétition et sur l’absence de véritable progrès."},{"type":"plain","definition":"Schopenhauer ne dit pas seulement que certains désirs nous font souffrir. Sa thèse est plus radicale : tout désir, parce qu’il naît d’un manque, contient déjà une douleur, tandis que sa satisfaction demeure fragile et provisoire."}]},{"id":"spinoza-desir-puissance-exister","section":"philosophie","cardMeta":"Rationalisme moderne","title":"Le désir exprime notre puissance d’exister","author":"Baruch Spinoza","authorTag":"Spinoza","cardHighlight":"notre puissance d’exister","cardIdea":"le conatus","authorMeta":"(1632–1677) · rationalisme moderne","themes":["Désir","Nature","Conscience"],"work":"Éthique","publication":"livre III, propositions VI–VII et scolie de la proposition IX, trad. Ch. Appuhn, GF, 1965, p. 142–143 et 144–145","description":"Désirons-nous une chose parce qu’elle est bonne, ou la jugeons-nous bonne parce que nous la désirons ?","context":"Spinoza rapporte le désir au <strong><em>conatus</em></strong>, l’effort par lequel chaque être persévère dans son existence. Le désir n’est donc pas d’abord un manque : il est l’expression consciente de notre <strong>puissance d’agir</strong>.","readingNotes":[{"type":"concept","term":"Conatus","badge":"effort de persévérance","definition":"Toute chose tend, autant qu’elle le peut, à maintenir et à déployer son existence. Cet effort n’est pas une propriété secondaire : il constitue son essence actuelle."},{"type":"analysis","term":"Trois noms d’un même effort","definition":"La dénomination change selon la manière dont l’effort est considéré.","items":["Rapporté à l’<strong>âme seule</strong>, il est appelé <strong>volonté</strong>.","Rapporté ensemble à l’<strong>âme et au corps</strong>, il est appelé <strong>appétit</strong>.","Lorsque l’être humain a <strong>conscience</strong> de cet appétit, celui-ci est appelé <strong>désir</strong>."]},{"type":"opposition","left":{"term":"Désir comme manque","definition":"Le sujet désirerait parce qu’un bien reconnu comme tel lui fait défaut."},"right":{"term":"Désir comme puissance","definition":"Le sujet tend activement à persévérer et détermine ainsi ce qui lui apparaît comme bon."},"conclusion":"Spinoza inverse l’explication ordinaire : la valeur de l’objet procède de notre tendance vers lui."},{"type":"concept","term":"Le bon","definition":"Ce n’est pas une qualité absolue de l’objet qui commanderait mécaniquement le désir. Nous appelons « bonne » la chose vers laquelle notre puissance nous porte et qui semble favoriser notre conservation."},{"type":"plain","definition":"La conscience ne crée pas le désir : elle nous rend seulement conscients d’un appétit déjà à l’œuvre dans l’unité de l’âme et du corps."}]},{"id":"levinas-caresse-desir-invisible","section":"philosophie","cardMeta":"Phénoménologie contemporaine","title":"La caresse désire au-delà de ce qu’elle touche","author":"Emmanuel Lévinas","authorTag":"Lévinas","cardHighlight":"au-delà de ce qu’elle touche","cardIdea":"la marche à l’invisible","authorMeta":"(1906–1995) · phénoménologie contemporaine","themes":["Désir","Amour","Autrui"],"work":"Totalité et Infini","publication":"1974, Nijhoff, p. 235","description":"Pourquoi la caresse ne cherche-t-elle pas à saisir un objet, mais ce qui échappe encore au sensible ?","context":"Lévinas distingue la <strong>caresse</strong> d’un geste qui saisirait ou posséderait son objet. Elle touche autrui tout en se portant vers ce qui en lui échappe encore : le désir amoureux reste ainsi ouvert à une altérité qu’aucune possession ne peut épuiser.","readingNotes":[{"type":"concept","term":"Phénoménologie","badge":"courant philosophique","definition":"Elle décrit la manière dont les choses et autrui apparaissent à la conscience. Lévinas transforme cette démarche en montrant que la rencontre d’autrui excède ce que la conscience peut constituer ou connaître entièrement."},{"type":"opposition","left":{"term":"Le contact","definition":"Il rencontre une surface sensible présente et peut fournir une sensation déterminée."},"right":{"term":"La caresse","definition":"Elle touche, mais sollicite ce qui se dérobe à toute prise et demeure encore à venir."},"conclusion":"La caresse ne quitte pas le sensible ; elle découvre en lui une altérité qui ne se laisse pas enfermer dans la sensation."},{"type":"opposition","left":{"term":"Dévoilement","definition":"Visée qui rend un phénomène présent, identifiable et disponible à la connaissance."},"right":{"term":"Recherche","definition":"Mouvement qui reste ouvert à ce qui échappe et ne prétend pas posséder son terme."},"conclusion":"La « marche à l’invisible » n’est pas une connaissance inachevée : elle constitue une autre manière d’entrer en relation avec autrui."},{"type":"analysis","term":"Une faim qui se nourrit d’elle-même","definition":"Le paradoxe de la faim indique un désir qui s’accroît au lieu de disparaître. La caresse ne consomme pas son objet : la proximité d’autrui approfondit encore la recherche de ce qui ne peut être saisi."},{"type":"concept","term":"L’invisible","definition":"Ce n’est pas un objet caché que l’on pourrait finir par découvrir. Il désigne la dimension d’autrui qui excède ses contours visibles et résiste à toute réduction à une chose connue."},{"type":"plain","definition":"Pour Lévinas, la caresse exprime ainsi l’amour sans pouvoir l’enfermer dans un geste ou dans des mots définitifs : elle vise l’autre comme avenir, non comme possession présente."}]},{"id":"stendhal-cristallisation-amour","section":"autres","cardMeta":"Littérature","title":"La cristallisation pare l’être aimé de nouvelles perfections","author":"Stendhal","authorTag":"Stendhal","cardHighlight":"pare l’être aimé","cardIdea":"la cristallisation amoureuse","authorMeta":"(1783–1842) · littérature","themes":["Amour","Désir","Imagination"],"work":"De l’amour","publication":"1819, Gallimard, 2007, p. 31","description":"Comment l’imagination amoureuse transforme-t-elle une personne réelle en un être couvert de perfections ?","context":"Stendhal nomme <strong>cristallisation</strong> le travail par lequel l’esprit amoureux embellit continuellement l’être désiré. L’image du rameau couvert de sel montre comment l’<strong>imagination</strong> métamorphose son objet jusqu’à le rendre presque méconnaissable.","readingNotes":[{"type":"concept","term":"Littérature","badge":"essai sur l’amour","definition":"Stendhal associe ici l’observation psychologique à une image concrète et mémorable. La métaphore ne décore pas seulement l’idée : elle donne à voir le mécanisme même de l’idéalisation amoureuse."},{"type":"analysis","term":"La métaphore du rameau","definition":"Les éléments de la mine correspondent aux étapes de l’expérience amoureuse.","items":["Le <strong>rameau primitif</strong> représente l’être aimé tel qu’il est d’abord rencontré.","Le séjour dans la mine figure le <strong>travail intérieur</strong> et prolongé de l’imagination.","Les <strong>cristaux</strong> représentent les qualités nouvelles dont l’esprit pare progressivement l’être aimé."]},{"type":"opposition","left":{"term":"L’être réel","definition":"Personne singulière, avec des qualités et des limites qui lui appartiennent effectivement."},"right":{"term":"L’être cristallisé","definition":"Figure embellie par les attentes, les espoirs et les interprétations de l’amant."},"conclusion":"Le désir ne se contente pas d’enregistrer la réalité : il produit une représentation idéale qui se superpose à elle."},{"type":"concept","term":"Idéalisation","definition":"Transformation mentale par laquelle certaines qualités sont amplifiées et chaque détail devient la preuve d’une perfection nouvelle."},{"type":"analysis","term":"Une métamorphose ambivalente","definition":"La cristallisation intensifie l’amour en rendant l’être aimé éblouissant. Mais le rameau devenu méconnaissable suggère aussi un risque : aimer l’image créée par son esprit davantage que la personne elle-même."}]},{"id":"platon-mythe-androgyne-desir","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Antiquité grecque","title":"Le désir amoureux poursuit l’unité perdue","author":"Platon","authorTag":"Platon","cardHighlight":"poursuit l’unité perdue","familiarIdea":"le mythe de l’androgyne","authorMeta":"(v. 428–v. 348 av. J.-C.)","themes":["Désir","Amour","Nature"],"work":"Le Banquet","publication":"IVe s. av. J.-C., 189d–193d, trad. E. Chambry, GF, 1993, p. 49–52","description":"Pourquoi le désir amoureux prend-il la forme d’un manque et d’une recherche de l’unité perdue ?","context":"Dans <em>Le Banquet</em>, Aristophane raconte que les êtres humains auraient été coupés en deux et chercheraient depuis leur moitié perdue. Le mythe fait ainsi de l’<strong>amour</strong> le désir de retrouver une unité dont nous éprouvons le manque.","readingNotes":[{"type":"concept","term":"Désir comme manque","definition":"Le désir naît d’une privation : parce que l’être humain a été séparé de son unité première, il éprouve l’absence d’une part de lui-même et cherche à la retrouver."},{"type":"opposition","left":{"term":"Posséder un objet","definition":"S’approprier une chose extérieure susceptible de procurer une satisfaction."},"right":{"term":"Retrouver sa moitié","definition":"Reconquérir, à travers l’autre, une unité qui semble appartenir à notre propre être."},"conclusion":"Le mythe décrit le désir amoureux comme une quête de soi et de totalité, non comme la simple consommation d’un objet."},{"type":"concept","term":"Amour","definition":"Il est « le désir et la poursuite du tout » : un mouvement par lequel deux êtres voudraient abolir leur séparation et recomposer l’ancienne nature humaine."},{"type":"analysis","term":"Une réparation impossible","definition":"Les deux moitiés peuvent s’enlacer, mais la coupure demeure. Comme une tessère recollée conserve la marque de sa cassure, l’union amoureuse tend vers une totalité qu’elle ne peut restaurer parfaitement."},{"type":"analysis","term":"La portée du mythe","definition":"Le récit donne une origine commune à plusieurs orientations du désir : chaque être recherche le sexe correspondant à la composition de l’être dont il provient. Aristophane explique ainsi la diversité de la sexualité humaine sans la réduire à un modèle unique."},{"type":"plain","definition":"Cette conception est formulée par Aristophane, personnage du dialogue. Elle contribue à la réflexion de Platon sur l’amour, mais ne doit pas être confondue sans nuance avec la doctrine que Socrate exposera ensuite au nom de Diotime."}]},{"id":"platon-socrate-temperance","section":"philosophie","cardMeta":"Antiquité grecque","title":"Le bonheur de la tempérance","author":"Platon","authorTag":"Platon","familiarIdea":"les tonneaux des Danaïdes","authorMeta":"(v. 428–v. 348 av. J.-C.)","themes":["Bonheur","Désir"],"work":"Gorgias","publication":"IVe s. av. J.-C., 493d–494b, trad. M. Canto","description":"Le bonheur consiste-t-il à satisfaire sans cesse ses désirs ou à n’en être plus esclave ?","context":"Dans la continuité immédiate de l’intervention de Calliclès, Socrate oppose au désir sans limite une vie <strong>tempérante</strong>, capable de trouver une forme de stabilité intérieure.","readingNotes":[{"type":"opposition","left":{"term":"<em>physis</em>","definition":"La nature."},"right":{"term":"<em>nomos</em>","definition":"La loi ou la convention humaine."},"conclusion":"Calliclès oppose la première aux règles morales de la cité ; Socrate conteste cette opposition."},{"type":"opposition","left":{"term":"Calliclès : la nature comme lutte","definition":"Un jeu de forces où le plus puissant doit l’emporter."},"right":{"term":"Socrate : la nature comme <em>kosmos</em>","definition":"Un ordre harmonieux et mesuré, qui sert de norme."}},{"type":"opposition","left":{"term":"<em>hēdonē</em>","definition":"Le plaisir : Calliclès en fait le critère du bonheur."},"right":{"term":"<em>aretē</em>","definition":"L’excellence ou la vertu : Socrate y subordonne le plaisir."}},{"type":"concept","term":"Hédonisme de Calliclès","definition":"Il identifie le bonheur au plaisir et défend une recherche illimitée de l’intensité : désirer fortement et satisfaire ses passions autant que possible."},{"type":"concept","term":"Intellectualisme moral de Platon","definition":"Connaître véritablement le bien est nécessaire et suffisant pour bien agir : la vertu ordonne l’âme et conduit au bonheur."}],"artworksTitle":"Les Danaïdes : l’image d’un désir sans fin"},{"id":"platon-callicles-desirs","section":"philosophie","cardMeta":"Antiquité grecque","title":"Le bonheur comme libre satisfaction des désirs","author":"Platon","authorTag":"Platon","cardHighlight":"libre satisfaction des désirs","authorMeta":"(v. 428–v. 348 av. J.-C.)","themes":["Bonheur","Liberté"],"work":"Gorgias","publication":"IVe s. av. J.-C., 491e–492c, trad. M. Canto","description":"Le bonheur appartient-il à celui qui satisfait toutes ses passions sans rencontrer d’obstacle ?","context":"Calliclès défend une conception radicale de la <strong>liberté</strong> : l’homme fort devrait pouvoir suivre et assouvir ses désirs, sans se soumettre aux normes de la majorité.","readingNotes":[{"type":"opposition","left":{"term":"<em>physis</em>","definition":"La nature, dont Calliclès se réclame."},"right":{"term":"<em>nomos</em>","definition":"La loi ou la convention humaine, imposée selon lui par la majorité."}},{"type":"opposition","left":{"term":"Nature comme lutte","definition":"Pour Calliclès, un chaos de forces où le plus fort doit dominer."},"right":{"term":"Nature comme <em>kosmos</em>","definition":"Pour d’autres Grecs, un tout ordonné dont l’équilibre sert de norme."}},{"type":"opposition","left":{"term":"<em>hēdonē</em>","definition":"Le plaisir : Calliclès en fait le critère du bonheur."},"right":{"term":"<em>aretē</em>","definition":"L’excellence ou la vertu : Platon soutient qu’elle rend heureux."}},{"type":"concept","term":"Hédonisme","definition":"Doctrine qui identifie le bonheur au plaisir. Calliclès défend ici un hédonisme de l’intensité et de l’expansion illimitée des désirs."},{"type":"concept","term":"Intellectualisme moral","definition":"À l’opposé, Socrate et Platon soutiennent que la connaissance du bien permet d’agir vertueusement et que la vertu conduit au bonheur."}]},{"id":"seneque-vie-vertueuse","section":"philosophie","cardMeta":"Stoïcisme","title":"La vie heureuse est la vie vertueuse","author":"Sénèque","authorTag":"Sénèque","cardHighlight":"vie vertueuse","cardHeight":"compact","authorMeta":"(v. 4 av. J.-C.–65 apr. J.-C.) · stoïcien","themes":["Bonheur","Devoir"],"work":"La Vie heureuse","publication":"vers 58, ch. VII, trad. J. Kany-Turpin, GF, 2005, p. 56–58","description":"Le plaisir peut-il constituer le souverain bien s’il accompagne aussi les vies les plus honteuses ?","context":"Sénèque sépare nettement le <strong>plaisir</strong> de la <strong>vertu</strong>. Le plaisir est fragile, passager et parfois immoral ; la vertu, stable et indépendante des circonstances, peut seule constituer le souverain bien.","readingNotes":[{"type":"school","term":"Stoïcisme","definition":"École hellénistique pour laquelle le bonheur dépend de la vertu et de l’usage droit de la raison, non des biens extérieurs ni des plaisirs."},{"type":"definition","term":"Souverain bien","definition":"Le <em>summum bonum</em> est le bien recherché pour lui-même et auquel tous les autres biens sont subordonnés. Pour les stoïciens, il réside dans la vertu."},{"type":"definition","term":"Vertu","definition":"La <em>virtus</em> latine traduit notamment l’<em>aretē</em> grecque : l’excellence morale d’une âme gouvernée par la raison et conforme à la nature."},{"type":"prose","term":"Plaisir","definition":"Sénèque ne nie pas qu’il puisse accompagner une vie vertueuse ; il refuse qu’il en soit le principe ou le critère, puisqu’il est instable et peut accompagner le vice."}]},{"id":"augustin-temps-creation-monde","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Temps · création","title":"Il n’y a pas de temps avant la création du monde","author":"Saint Augustin","authorTag":"Augustin","cardHighlight":"pas de temps avant la création","authorMeta":"(354–430) · augustinisme","themes":["Temps","Religion"],"work":"Les Confessions","publication":"v. 397–400, livre XI, chap. XIII, §§ 15–16, éd. Poujoulat et Raulx, 1864","description":"Peut-il y avoir un « avant » du monde si le temps lui-même appartient à ce qui a été créé ?","context":"Le livre XI des <em>Confessions</em> prend pour point de départ les premières paroles de la <strong>Genèse</strong>. Augustin répond à une objection classique : que faisait Dieu avant de créer le ciel et la terre ? Sa réponse consiste à montrer que la question suppose déjà ce qu’elle cherche à penser : un temps antérieur au monde. Or, si le temps appartient lui-même à la création, il ne peut y avoir d’« avant » temporel de la création. Ce passage constitue une entrée classique de Terminale dans le problème du <strong>temps</strong> et de l’<strong>éternité</strong>.","readingNotes":[{"type":"analysis","term":"Un faux « avant »","definition":"La difficulté vient du langage : demander ce qu’il y avait <em>avant</em> la création semble placer Dieu et le monde sur une même ligne temporelle. Augustin refuse précisément cette représentation."},{"type":"opposition","left":{"term":"Temps","definition":"Il implique passage et succession : les moments viennent et disparaissent."},"right":{"term":"Éternité","definition":"Elle ne passe pas et ne se compose pas d’une succession d’instants."},"conclusion":"Dieu ne précède donc pas le monde comme un instant en précède un autre."},{"type":"analysis","term":"« Au commencement »","definition":"Le début de la Genèse ne signifie plus seulement qu’un événement aurait eu lieu au premier instant d’un temps déjà là : chez Augustin, le commencement du monde est aussi le commencement du temps créé."}]},{"id":"augustin-dieu-bonheur","section":"philosophie","sections":["philosophie","theologie"],"cardMeta":"Antiquité tardive","title":"Dieu seul peut garantir notre bonheur","author":"Saint Augustin","authorTag":"Augustin","cardHighlight":"Dieu seul","cardHeight":"compact","authorMeta":"(354–430) · Père de l’Église","themes":["Bonheur","Religion"],"work":"La Vie heureuse","publication":"IVe s., conclusion, §§ 33–36, trad. S. Dupuy-Trudelle, Gallimard, 1998, p. 112–114","description":"Pourquoi la sagesse ne conduit-elle pleinement au bonheur qu’en rattachant l’esprit à Dieu ?","context":"Augustin définit la <strong>sagesse</strong> comme la juste mesure de l’esprit : elle le protège à la fois de l’excès et du manque. Cette mesure n’est pleinement assurée que par le rapport à <strong>Dieu</strong>.","readingNotes":[{"type":"analysis","term":"Sagesse et mesure","definition":"La sagesse est la <em>mesure de l’esprit</em> : elle empêche aussi bien la démesure des désirs que l’appauvrissement intérieur produit par la crainte et le chagrin."},{"type":"analysis","term":"Vie heureuse","definition":"La <em>beata vita</em> n’est pas une simple satisfaction sensible : elle est la plénitude spirituelle de l’âme qui connaît la vérité et demeure attachée à Dieu."},{"type":"analysis","term":"Héritage néoplatonicien","definition":"Augustin reprend la distinction entre le <em>monde intelligible</em>, stable, éternel et accessible à l’esprit, et le <em>monde sensible</em>, changeant et soumis aux apparences. Les biens sensibles ne peuvent donc combler durablement l’âme ; elle trouve son accomplissement dans la vérité intelligible, qui est Dieu."},{"type":"concept","term":"Dieu trinitaire","definition":"Augustin se distingue de Platon en identifiant le principe intelligible à un Dieu personnel, unique et existant en trois personnes :","items":["le Père : créateur du monde, source qui conduit l’être humain vers la vérité ;","le Fils : Jésus-Christ, vérité de Dieu manifestée aux hommes ;","le Saint-Esprit : l’Amour qui unit et l’intermédiaire par lequel nous sommes rattachés à Dieu."]}]},{"id":"pascal-bonheur-avenir","section":"philosophie","cardMeta":"XVIIe siècle","title":"Espérer le bonheur, c’est se condamner à ne jamais l’obtenir","author":"Blaise Pascal","authorTag":"Pascal","cardTitle":"Ainsi nous ne vivons jamais, mais nous espérons vivre","cardHighlight":"mais nous espérons vivre","cardStyle":"quote","authorMeta":"(1623–1662) · moraliste chrétien","themes":["Bonheur","Temps"],"work":"Pensées","publication":"1670, publication posthume, Laf. 47 (Br. 172), Le Seuil, 1962, p. 47–48","description":"Pourquoi notre attente d’un bonheur futur nous empêche-t-elle de vivre le seul temps qui nous appartient ?","context":"Pascal montre que la conscience humaine se détourne presque constamment du <strong>présent</strong>. En faisant de l’avenir la fin de notre existence, nous repoussons indéfiniment le moment d’être heureux.","readingNotes":[{"type":"analysis","term":"Le présent comme moyen","definition":"Nous ne faisons presque jamais du présent une fin : nous l’utilisons pour préparer un avenir auquel nous confions notre bonheur."},{"type":"analysis","term":"Espérer de vivre","definition":"En français classique, « espérer de » signifie attendre un bien désiré. La formule souligne que la vie réelle est sans cesse ajournée au profit d’une vie imaginée."},{"type":"analysis","term":"Condition humaine","definition":"Pour Pascal, l’être humain fuit ce qui le blesse et cherche hors du présent une satisfaction toujours différée : son imagination le rend incapable d’habiter pleinement sa vie."},{"type":"analysis","term":"À rapprocher du divertissement","definition":"Dans les <em>Pensées</em>, le divertissement désigne tout ce qui nous détourne de nous-mêmes et de notre condition. La fuite temporelle décrite ici en est une forme essentielle."}]},{"id":"freud-bonheur-episodique","section":"philosophie","cardMeta":"Psychanalyse","title":"Il n’y a aucun des biens de ce monde qui puisse rendre heureux durablement","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"durablement","authorMeta":"(1856–1939) · fondateur de la psychanalyse","themes":["Bonheur","Désir","Inconscient"],"work":"Le Malaise dans la culture","publication":"1929, trad. P. Cotet et al., chap. II, PUF, 2004, p. 18–19","description":"Pourquoi le bonheur intense ne peut-il être qu’épisodique, alors que la souffrance nous menace continuellement ?","context":"Freud montre que le <strong>bonheur</strong> ne peut être qu’épisodique : une satisfaction durable perd vite son intensité, tandis que le corps, le monde extérieur et surtout les relations avec autrui nous exposent sans cesse à la souffrance.","readingNotes":[{"type":"concept","term":"Principe de plaisir","definition":"Tendance de l’appareil psychique à rechercher la satisfaction et à réduire les tensions déplaisantes. Le bonheur strict correspond ici à la décharge soudaine d’un besoin fortement retenu."},{"type":"opposition","left":{"term":"Principe de plaisir","definition":"Il tend vers la satisfaction immédiate des besoins et l’évitement du déplaisir."},"right":{"term":"Principe de réalité","definition":"Il contraint le désir à différer, modifier ou renoncer à certaines satisfactions afin de tenir compte des conditions du monde extérieur et de la vie avec autrui."},"conclusion":"Le principe de réalité ne supprime pas le désir : il en règle la satisfaction selon ce qui est possible."},{"type":"concept","term":"Bonheur épisodique","definition":"Le plaisir intense naît d’un contraste : lorsqu’une satisfaction devient un état stable, elle s’affaiblit et se transforme en simple bien-être."},{"type":"concept","term":"Trois sources de souffrance","definition":"La souffrance menace l’être humain de trois côtés :","items":["son propre corps, voué à la déchéance ;","le monde extérieur et ses forces destructrices ;","ses relations avec les autres êtres humains."]},{"type":"concept","term":"Malaise dans la culture","definition":"La vie collective protège partiellement l’être humain, mais elle exige aussi des renoncements pulsionnels et rend les relations avec autrui inséparables de conflits et de frustrations."}]},{"id":"descartes-changer-desirs","section":"philosophie","cardMeta":"Rationalisme","title":"Pour être heureux, il faut changer ses désirs","author":"René Descartes","authorTag":"Descartes","cardHighlight":"changer ses désirs","authorMeta":"(1596–1650) · rationalisme classique","themes":["Bonheur","Désir","Liberté"],"work":"Discours de la méthode","publication":"1637, troisième partie, GF, 1966, p. 53–54","description":"Comment devenir heureux en réglant nos désirs sur ce qui dépend réellement de nous ?","context":"Dans la troisième maxime de sa <strong>morale par provision</strong>, Descartes reprend un geste stoïcien : agir autant que possible sur le monde, puis cesser de désirer ce qui échappe à notre pouvoir.","readingNotes":[{"type":"concept","term":"Morale par provision","definition":"Ensemble de règles pratiques adoptées par Descartes pour pouvoir agir pendant qu’il poursuit la recherche méthodique de la vérité."},{"type":"opposition","left":{"term":"Ce qui dépend de nous","definition":"Nos pensées, nos jugements et la manière dont nous réglons nos désirs."},"right":{"term":"Ce qui n’en dépend pas","definition":"Les biens extérieurs, les événements et les effets de la fortune."},"conclusion":"Le contentement exige de concentrer sa volonté sur le premier domaine."},{"type":"concept","term":"Faire de nécessité vertu","definition":"Transformer l’acceptation de ce qui ne peut être changé en une disposition volontaire et raisonnable, plutôt que le subir dans le regret."},{"type":"concept","term":"Exercice spirituel","definition":"La maîtrise des désirs n’est pas une décision instantanée : elle s’acquiert par une méditation souvent répétée jusqu’à devenir une manière stable de juger."}],"familiarIdea":"la morale par provision"},{"id":"descartes-trois-regles-bonheur","section":"philosophie","cardMeta":"Rationalisme","title":"Chacun peut se rendre heureux en observant trois règles de morale","author":"René Descartes","authorTag":"Descartes","cardHighlight":"trois règles de morale","authorMeta":"(1596–1650) · rationalisme classique","themes":["Bonheur","Liberté","Raison"],"work":"Lettre à Élisabeth du 4 août 1645","publication":"1645","description":"Quelles règles permettent d’atteindre un contentement intérieur indépendant de la fortune ?","context":"Descartes distingue l’<strong>heur</strong>, qui dépend de la fortune, de la <strong>béatitude</strong>, contentement intérieur accessible par l’usage de la raison, la résolution et la maîtrise des désirs.","readingNotes":[{"type":"opposition","left":{"term":"Heur","definition":"Bonheur reçu des circonstances extérieures et de la fortune."},"right":{"term":"Béatitude","definition":"Parfait contentement de l’esprit et satisfaction intérieure acquis par le sage."},"conclusion":"La philosophie ne garantit pas tous les biens extérieurs, mais elle peut rendre notre contentement indépendant d’eux."},{"type":"concept","term":"Trois règles de morale","definition":"Chacun peut se rendre content de soi-même à trois conditions :","items":["employer au mieux son esprit pour connaître ce qu’il faut faire ;","prendre la résolution ferme d’exécuter ce que conseille la raison ;","ne pas désirer les biens qui demeurent hors de son pouvoir."]},{"type":"concept","term":"Vertu","definition":"Descartes la définit ici comme la fermeté et la constance de la résolution à suivre ce que la raison juge être le meilleur."},{"type":"concept","term":"Comparaison des vaisseaux","definition":"Un petit vaisseau peut être aussi plein qu’un grand : le contentement est complet lorsque les désirs réglés par la raison sont accomplis, même si les biens possédés sont moins nombreux."}]},{"id":"alain-bonheur-agir","section":"philosophie","cardMeta":"Philosophie de l’action","title":"Le vrai bonheur est le bonheur d’agir","author":"Alain","authorTag":"Alain","cardHighlight":"bonheur d’agir","authorMeta":"(1868–1951) · philosophe et moraliste","themes":["Bonheur","Désir"],"work":"Esquisses, La recherche du bonheur","publication":"PUF, 1968, p. 35","description":"Pourquoi le bonheur reçu finit-il par ennuyer, tandis que l’action difficile nous rend véritablement heureux ?","context":"Alain oppose le <strong>bonheur de rencontre</strong>, reçu de la fortune mais vite oublié, au <strong>bonheur d’agir</strong>, qui naît indirectement d’un effort dirigé vers un obstacle.","readingNotes":[{"type":"opposition","left":{"term":"Bonheur de rencontre","definition":"Bonheur reçu de la fortune : richesse, pouvoir, santé, longévité ou présence des êtres aimés."},"right":{"term":"Bonheur d’agir","definition":"Joie qui naît de l’activité, de l’apprentissage, de la conquête et des obstacles surmontés."},"conclusion":"Le premier devient vite invisible ; le second est la « fleur de l’action » et n’apparaît qu’en chemin."},{"type":"concept","term":"Ennui","definition":"Lorsque rien ne mobilise notre puissance d’agir, les biens possédés perdent leur saveur et l’être humain recherche spontanément une nouvelle difficulté."},{"type":"concept","term":"Bonheur indirect","definition":"Dès que le bonheur devient l’objet explicite de la recherche, il se dérobe. Dans l’action, c’est l’objet à accomplir qui attire ; le bonheur survient comme effet non recherché."},{"type":"concept","term":"La peine comme forme du bonheur","definition":"L’obstacle ne s’oppose pas nécessairement au bonheur : il lui donne une matière en permettant à l’être humain d’exercer et d’éprouver sa puissance."}]},{"id":"foucault-commentaire-exces-sens","section":"philosophie","cardMeta":"XXe siècle · philosophie du langage","title":"Tout discours dit plus que ce qu’il dit en apparence","author":"Michel Foucault","authorTag":"Foucault","cardHighlight":"plus que ce qu’il dit","authorMeta":"(1926–1984) · philosophie contemporaine","themes":["Interprétation","Langage","Histoire"],"work":"Naissance de la clinique","publication":"1963, préface, PUF, 2003, p. XII","description":"Pourquoi tout commentaire suppose-t-il que le langage contient toujours plus de sens qu’il n’en exprime ?","context":"Foucault analyse le <strong>commentaire</strong> comme une parole qui revient sur un discours déjà donné pour y faire apparaître davantage de sens. Parce qu’un texte semble toujours pouvoir dire autre chose que ce qu’il énonce immédiatement, l’<strong>interprétation</strong> peut se prolonger sans terme définitif.","readingNotes":[{"type":"definition","term":"Signifié / signifiant","definition":"Le signifié est le sens auquel renvoie un signe ; le signifiant est sa forme matérielle, par exemple les sons d’un mot ou les lettres qui le composent."},{"type":"concept","term":"Commentaire","definition":"Reprise d’un discours qui cherche à en faire surgir le sens latent. Il ne se contente pas de répéter : il prétend dire ce que le premier discours contenait sans le formuler entièrement."},{"type":"analysis","term":"Double pléthore","definition":"Le sens semble toujours déborder ce qui a été dit, tandis que les mots eux-mêmes restent assez riches pour appeler de nouvelles interprétations. C’est ce double excès qui rend le commentaire indéfiniment recommençable."}]},{"id":"averroes-interpreter-revelation","section":"theologie","sections":["philosophie","theologie"],"cardMeta":"Moyen Âge · philosophie arabe","title":"Pour le philosophe, il y a lieu d’interpréter les textes religieux","author":"Averroès","authorTag":"Averroès","cardHighlight":"interpréter les textes religieux","authorMeta":"(1126–1198) · philosophe andalou","themes":["Interprétation","Religion","Raison"],"work":"Livre du discours décisif","publication":"1179, §§ 18–19, 38, trad. M. Geoffroy, GF, 1996, p. 119 et 141","description":"Pourquoi la démonstration philosophique conduit-elle parfois à interpréter le sens manifeste du Texte révélé ?","context":"Averroès refuse d’opposer la <strong>Révélation</strong> et la <strong>raison</strong> : puisque toutes deux conduisent à la vérité, elles ne peuvent se contredire. Lorsque la démonstration semble contredire le sens obvie du texte religieux, il faut en rechercher le sens lointain.","readingNotes":[{"type":"analysis","term":"Accord de la raison et de la Révélation","definition":"La « double vérité » distingue la vérité de foi, révélée par le texte sacré, et la vérité de raison, atteinte par l’examen rationnel du monde. Elles ne peuvent pas se contredire : quand le Texte ne se prononce pas, la raison prolonge la parole révélée ; lorsqu’un énoncé paraît obscur ou contraire à une démonstration, le philosophe doit en éclairer le sens lointain. Cette interprétation est réservée à ceux qui maîtrisent la démonstration et ne doit pas être livrée indistinctement à tous."},{"type":"opposition","left":{"term":"Sens obvie","definition":"Le sens immédiatement manifeste de l’énoncé, accessible à tous."},"right":{"term":"Sens lointain","definition":"Le sens visé par les symboles et les allégories ; il exige une démonstration pour être découvert."},"conclusion":"Le dédoublement du texte ne le rend pas contradictoire : il adapte l’accès à la vérité aux différentes dispositions de ses lecteurs."},{"type":"definition","term":"Persuasion","definition":"Adhésion obtenue par l’art de convaincre propre à la rhétorique."},{"type":"definition","term":"Accord","definition":"Adhésion commune qui se forme dans la confrontation dialectique des positions."},{"type":"definition","term":"Conviction","definition":"Adhésion personnelle et réfléchie, produite par une démonstration que l’esprit comprend activement."},{"type":"prose","term":"Destinataires du Texte","definition":"Les symboles permettent à ceux qui ne pratiquent pas la démonstration de donner leur assentiment aux vérités révélées par des arguments dialectiques ou rhétoriques, plus accessibles."}]},{"id":"krishnamurti-bonheur-sans-recherche","section":"philosophie","cardMeta":"Philosophie de l’Inde","title":"Le bonheur vient lorsqu’on cesse de le rechercher","author":"Jiddu Krishnamurti","authorTag":"Krishnamurti","cardHighlight":"cesse de le rechercher","authorMeta":"(1895–1986) · penseur indien","themes":["Bonheur","Désir","Vérité"],"work":"Le Sens du bonheur","publication":"trad. C. Joyeux, Stock, 2006, p. 43–44","description":"Le bonheur peut-il apparaître tant que nous en faisons l’objet d’un effort et d’une recherche ?","context":"Krishnamurti soutient que le <strong>bonheur</strong> ne se conquiert pas comme un but. Il surgit lorsque l’esprit cesse de vouloir devenir autre chose et se libère de la peur.","readingNotes":[{"type":"concept","badge":false,"term":"Un bonheur sans effort","definition":"L’effort suppose un manque et tend l’esprit vers un résultat futur. Le bonheur apparaît au contraire lorsque cette tension cesse et que l’attention devient disponible à ce qui est."},{"type":"concept","badge":false,"term":"Se libérer du devenir","definition":"Ne plus chercher à « devenir quelqu’un » ne signifie pas renoncer à agir, mais cesser de faire dépendre sa valeur et son bonheur d’une identité idéale à atteindre."},{"type":"plain","definition":"La <u>peur</u> du jugement, de l’échec ou du manque maintient l’esprit dans l’anticipation. Tant qu’elle le domine, il ne peut accueillir pleinement ce qui se présente."}]},{"id":"freud-interpretations-delirantes","section":"philosophie","cardMeta":"Psychanalyse","title":"Il y a des interprétations délirantes","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"interprétations délirantes","authorMeta":"(1856–1939) · fondateur de la psychanalyse","themes":["Interprétation","Inconscient","Raison"],"work":"Psychopathologie de la vie quotidienne","publication":"1901, trad. S. Jankélévitch, Payot, 1967, p. 292–294","description":"L’interprétation devient-elle délirante lorsqu’elle refuse toute place à l’accidentel ?","context":"Freud montre que le délire paranoïaque repose lui aussi sur une activité d’<strong>interprétation</strong> : le sujet refuse de voir de simples coïncidences dans certains détails. L’erreur commence lorsqu’il projette sur le monde extérieur une signification qui appartient en réalité à sa propre vie psychique.","readingNotes":[{"type":"definition","term":"Acte manqué","definition":"Geste, oubli ou erreur qui paraît fortuit au sujet conscient, mais dans lequel la psychanalyse reconnaît l’expression détournée d’un désir inconscient."},{"type":"analysis","term":"Exemples d’actes manqués","definition":"Ils prennent notamment les formes suivantes :","items":["un <strong>lapsus</strong> qui laisse échapper un mot révélateur ;","un <strong>oubli</strong> significatif, par exemple celui d’un rendez-vous que l’on redoute ;","la <strong>perte</strong> ou le rangement « introuvable » d’un objet chargé affectivement ;","une <strong>erreur de lecture, d’écriture ou d’adresse</strong> qui dévie vers une pensée refoulée."]},{"type":"definition","term":"Névrosé","definition":"Sujet dont le trouble psychique résulte d’un conflit inconscient, sans rupture complète avec la réalité."},{"type":"analysis","term":"La part juste et l’erreur","definition":"Le paranoïaque pressent que certains actes apparemment accidentels ont un sens inconscient. Son erreur consiste à généraliser cette découverte et à lire chez tous les autres ce qui n’est réel qu’en lui."}]},{"id":"aristote-amour-amitie-veritable","section":"philosophie","cardMeta":"Antiquité grecque","title":"De l’amour à l’amitié véritable","author":"Aristote","authorTag":"Aristote","cardHighlight":"l’amitié véritable","authorMeta":"(384–322 av. J.-C.)","themes":["Amour","Autrui","Bonheur","Devoir"],"work":"Éthique à Nicomaque","publication":"livres VIII et IX, trad. Jules Tricot, Vrin","description":"Comment l’intensité de l’amour et la bienveillance peuvent-elles conduire à une amitié véritable ?","readingNotes":[{"type":"analysis","term":"1. Une relation rare et singulière","definition":"L’amour est un excès dirigé vers une seule personne, tandis que l’amitié parfaite ne peut s’étendre à une multitude. Elle demande du temps, une expérience partagée et une véritable intimité."},{"type":"analysis","term":"2. Aimer l’autre pour lui-même","definition":"L’ami véritable souhaite le bien de l’autre sans rechercher d’abord un plaisir, un service ou un avantage personnel. L’amitié d’utilité reste intéressée ; l’amitié de plaisir est plus proche de l’amitié véritable, mais demeure liée à une satisfaction qui peut disparaître."},{"type":"analysis","term":"3. Transformer la bienveillance en engagement","definition":"La bienveillance n’est encore qu’une « amitié paresseuse » lorsqu’elle se contente de souhaiter du bien. Elle devient amitié véritable lorsque l’on accepte d’agir, de seconder l’autre, de prendre soin de lui et de se donner du tracas à son sujet."},{"type":"analysis","term":"4. Les qualités de l’ami véritable","definition":"Il se caractérise par :","items":["la <strong>réciprocité</strong> et la joie mutuelle ;","la <strong>générosité</strong> et le désintéressement ;","la <strong>fidélité dans le temps</strong> ;","la <strong>présence concrète</strong> et la volonté d’agir pour le bien de l’autre."]}],"parts":[{"context":"Aristote distingue l’<strong>amitié parfaite</strong> des relations fondées seulement sur le plaisir ou l’utilité. Une véritable amitié suppose de connaître l’autre, de partager du temps avec lui et de l’aimer pour ce qu’il est, non seulement pour ce qu’il nous apporte.","readingQuestions":["Pourquoi l’amitié parfaite ne peut-elle pas s’étendre à un très grand nombre de personnes ?","Pourquoi l’amitié de plaisir ressemble-t-elle davantage à l’amitié véritable que l’amitié d’utilité ?","Qu’est-ce qui distingue finalement aimer <strong>autrui pour lui-même</strong> et aimer ce qu’il nous apporte ?"],"paragraphs":["On ne peut pas être un ami pour plusieurs personnes, dans l’amitié parfaite, pas plus qu’on ne peut être amoureux de plusieurs personnes en même temps (car l’amour est une sorte d’excès, et un état de ce genre n’est naturellement ressenti qu’envers un seul) ; et peut-être même n’est-il pas aisé de trouver un grand nombre de gens de bien. On doit aussi acquérir quelque expérience de son ami et entrer dans son intimité, ce qui est d’une extrême difficulté. Par contre, si on recherche l’utilité ou le plaisir, il est possible de plaire à beaucoup de personnes, car nombreux sont les gens de cette sorte, et les services qu’on en reçoit ne se font pas attendre longtemps. De ces deux dernières formes d’amitié celle qui repose sur le plaisir ressemble davantage à la véritable amitié, quand les deux parties retirent à la fois les mêmes satisfactions l’une de l’autre et qu’elles ressentent une joie mutuelle ou se plaisent aux mêmes choses : telles sont les amitiés entre jeunes gens, car il y a en elles plus de générosité ; au contraire, l’amitié basée sur l’utilité est celle d’âmes mercantiles."],"work":"Éthique à Nicomaque","publication":"livre VIII, 7, 1158a10–1158a, trad. Jules Tricot, Vrin, 1994, p. 398–399"},{"context":"La <strong>bienveillance</strong> est pour Aristote un commencement d’amitié, mais elle ne suffit pas. Souhaiter le bien d’autrui doit devenir une relation vécue : l’amitié véritable demande du temps, de l’intimité et la volonté d’agir concrètement pour l’autre.","readingQuestions":["Pourquoi souhaiter le bien de quelqu’un ne suffit-il pas encore à être son ami ?","Pourquoi Aristote qualifie-t-il la simple bienveillance d’« amitié paresseuse » ?","À quelles conditions la bienveillance devient-elle une véritable relation d’<strong>amitié</strong> ?"],"paragraphs":["La bienveillance semble […] un commencement d'amitié, tout comme le plaisir causé par la vue de l'être aimé est le commencement de l'amour : nul en effet n'est amoureux sans avoir été auparavant charmé par l'extérieur de la personne aimée, mais celui qui éprouve du plaisir à l'aspect d'un autre n'est pas pour autant amoureux, mais c'est seulement quand on regrette son absence et qu'on désire passionnément sa présence. Ainsi également, il n'est pas possible d'être amis sans avoir d'abord éprouvé de la bienveillance l'un pour l'autre, tandis que les gens bienveillants ne sont pas pour autant liés d'amitié : car ils se contentent de souhaiter du bien à ceux qui sont l'objet de leur bienveillance, et ne voudraient les seconder en rien ni se donner du tracas à leur sujet. Aussi pourrait-on dire, en étendant le sens du terme amitié, que la bienveillance est une amitié paresseuse, mais avec le temps et une fois parvenue à une certaine intimité, elle devient amitié, « amitié véritable », et non pas cette sorte d'amitié basée sur l'utilité ou le plaisir, car la bienveillance non plus ne prend pas naissance sur ces bases. L'homme qui, en effet, a reçu un bienfait, et qui, en échange des faveurs dont il a été gratifié, répond par de la bienveillance, ne fait là que ce qui est juste, et d'autre part, celui qui souhaite la prospérité d'autrui dans l'espoir d'en tirer amplement profit, paraît bien avoir de la bienveillance, non pas pour cet autre, mais plutôt pour lui-même, pas plus qu'on n'est ami de quelqu'un si les soins dont on l'entoure s'expliquent par quelque motif intéressé."],"work":"Éthique à Nicomaque","publication":"livre IX, 5, 1167a3–1167a18, trad. Jules Tricot, Vrin, p. 448–449"}]},{"id":"genese-naissance-du-monde","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"La naissance du monde","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 1–2","cardHighlight":"la naissance du monde","familiarIdea":"« Au commencement »","authorMeta":"Bible hébraïque · Pentateuque","themes":["Nature","Religion","Autrui"],"work":"Genèse 1–2","publication":"1,1–2,4 et 2,7–25","description":"Que signifient les deux récits de la création du monde et de l’être humain placés au commencement de la Genèse ?","context":"Le début de la Genèse ne cherche pas à remplacer l’explication scientifique de la naissance des astres, des plantes, des animaux et des hommes. À travers des images conformes aux représentations de son époque et une <strong>poésie liturgique</strong>, il interroge le sens de l’univers et de l’existence humaine : d’où viennent-ils, vers quoi vont-ils et pourquoi existent-ils ? La Parole de Dieu suscite et ordonne le monde ; Dieu en est le cœur et en rend l’existence intelligible.","readingNotes":[{"type":"opposition","left":{"term":"La science","definition":"Elle cherche à expliquer à partir de quoi et comment sont apparus les astres, les plantes, les animaux et les êtres humains."},"right":{"term":"Le récit de la Genèse","definition":"Il demande pourquoi l’univers et l’humanité existent, vers quoi ils vont et quel sens possède leur histoire."},"conclusion":"L’introduction de l’édition distingue ainsi l’explication des phénomènes et l’interrogation sur leur sens."},{"type":"concept","term":"Une poésie liturgique","definition":"Le premier récit ne prétend pas rapporter scientifiquement le déroulement matériel de la Création. Sa forme rythmée — parole, accomplissement, jugement de bonté, soir et matin — exprime symboliquement que le monde vient de Dieu et reçoit de lui son ordre."},{"type":"concept","term":"Le cadre symbolique de la semaine","definition":"Les six jours déploient progressivement le tableau du monde ; le septième, béni et rendu sacré, consacre l’achèvement de l’œuvre créatrice et le repos de Dieu."},{"type":"plain","definition":"<strong>Ouvertures philosophiques.</strong> Le récit peut être prolongé par trois problèmes classiques : le commencement du temps, la raison de l’existence du monde et la place de l’être humain face à la nature."},{"type":"analysis","term":"Saint Augustin — Le temps commence-t-il avec le monde ?","badge":"philosophie","href":"/textes/augustin-temps-creation-monde/","definition":"Augustin part directement du « Au commencement » de la Genèse : demander ce que Dieu faisait « avant » la création suppose déjà un temps qui, selon lui, appartient lui-même au monde créé."},{"type":"analysis","term":"Leibniz — Pourquoi le monde existe-t-il ?","badge":"philosophie","href":"/textes/leibniz-raison-existence-monde/","definition":"Leibniz transforme l’origine du monde en problème de raison suffisante : si le monde est contingent, peut-il contenir en lui-même la raison de sa propre existence ?"},{"type":"analysis","term":"Descartes — Devenir « comme maîtres et possesseurs de la nature »","badge":"philosophie","href":"/textes/descartes-maitres-possesseurs-nature/","definition":"Le commandement de « soumettre » la terre peut être mis en regard du projet cartésien de maîtriser les forces naturelles — tandis que Genèse 2 demande aussi à l’être humain de « travailler et garder » le jardin."}]},{"id":"genese-la-chute","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"La Chute","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 3","cardHighlight":"la Chute","familiarIdea":"le fruit défendu","authorMeta":"Bible hébraïque · Pentateuque","themes":["Liberté","Conscience","Religion","Travail","Désir"],"work":"Genèse 3","publication":"3,1–24","description":"Comment le récit de la Chute met-il en scène la tentation, la faute, la honte et les ruptures qui en découlent ?","context":"Le récit de Genèse 3 met en scène l’entrée du mal dans l’expérience humaine : l’interdit, la tentation, la transgression, puis la honte et les ruptures qui en découlent. Il ouvre des problèmes philosophiques majeurs autour de la liberté, de la responsabilité, du désir de savoir et des conséquences de nos actes.","readingNotes":[{"type":"concept","term":"Une rupture en cascade","definition":"La transgression ne produit pas une seule conséquence. Le récit fait apparaître successivement la honte devant soi-même, la peur devant Dieu, l’accusation de l’autre, l’hostilité du monde et, enfin, la mortalité."},{"type":"opposition","left":{"term":"La promesse du serpent","definition":"Les yeux vont s’ouvrir et l’être humain accédera à la connaissance du bien et du mal."},"right":{"term":"Ce qui est effectivement découvert","definition":"Les yeux s’ouvrent, mais la première expérience est celle de la nudité, de la honte et de la peur."},"conclusion":"Le récit distingue ainsi l’acquisition d’une connaissance et l’idée d’un progrès moral ou d’un bonheur qui en découlerait automatiquement."},{"type":"concept","term":"Le déplacement de la responsabilité","definition":"Après la faute, l’homme accuse la femme et la femme accuse le serpent. Chacun reconnaît avoir mangé tout en cherchant ailleurs la cause de son acte : le récit met ainsi en scène la difficulté à assumer pleinement sa propre responsabilité."},{"type":"concept","term":"Travail, souffrance et mortalité","definition":"Le sol, l’enfantement, les rapports entre les êtres humains et le retour à la poussière sont désormais décrits sous le signe de la peine. Le texte relie la faute à une transformation globale de la condition humaine, sans réduire celle-ci à une simple punition ponctuelle."}]},{"id":"genese-cain-abel","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Caïn et Abel","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 4","cardHighlight":"Caïn et Abel","familiarIdea":"« Suis-je le gardien de mon frère ? »","authorMeta":"Bible hébraïque · Pentateuque","themes":["Justice","Liberté","Autrui","Religion"],"work":"Genèse 4","publication":"4,1–15","description":"Comment la jalousie transforme-t-elle le frère en rival, et que signifie être responsable de l’autre ?","context":"Juste après la Chute, la Genèse raconte la première violence entre deux frères. Caïn et Abel présentent chacun une offrande ; la différence du regard porté sur elles fait naître chez Caïn l’irritation, puis le meurtre. Le récit enchaîne alors trois questions : peut-on dominer la violence qui monte en soi ? Sommes-nous responsables de notre frère ? Et comment rendre justice sans laisser la vengeance se multiplier ?","readingNotes":[{"type":"concept","term":"Le péché « accroupi à la porte »","definition":"Avant le meurtre, Caïn est averti : la violence n’est pas présentée comme inévitable. Le récit met en scène un moment où l’être humain peut encore agir autrement et « dominer » ce qui le pousse au mal."},{"type":"concept","term":"« Suis-je le gardien de mon frère ? »","definition":"La réponse de Caïn cherche à nier toute responsabilité envers Abel. La question devient pourtant le centre du récit : jusqu’où sommes-nous responsables de la vie et du sort des autres ?"},{"type":"concept","term":"Le signe de Caïn","definition":"Caïn est condamné à l’errance, mais Dieu le protège aussi contre celui qui voudrait le tuer. La sanction ne se transforme donc pas en permission de se venger : le récit pose déjà une limite à l’escalade de la violence."}]},{"id":"kant-desir-raison-imagination","section":"philosophie","cardMeta":"Philosophie critique","title":"Le désir naît de la raison et de l’imagination","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"raison et de l’imagination","cardHeight":"compact","authorMeta":"(1724–1804) · philosophie critique","themes":["Désir","Nature"],"work":"Conjectures sur les débuts de l’histoire humaine","publication":"1786, dans <em>Opuscules sur l’histoire</em>, trad. S. Piobetta, G.F., 1990, p. 151","description":"Comment la raison transforme-t-elle les besoins naturels en désirs toujours plus nombreux ?","context":"Kant montre comment la <strong>raison</strong>, soutenue par l’<strong>imagination</strong>, libère l’être humain de la conduite toute tracée par l’instinct. Cette émancipation multiplie les désirs, transforme l’attirance en amour, fait naître le goût du beau et ouvre la conscience à l’avenir.","readingNotes":[{"type":"opposition","left":{"term":"Besoin","definition":"Nécessité vitale qui appelle une satisfaction déterminée et immédiate."},"right":{"term":"Désir","definition":"Élan façonné par des représentations : l’être humain peut inventer son objet, le différer et lui attribuer une valeur."},"conclusion":"Le besoin renvoie d’abord à la conservation ; le désir ouvre un champ potentiellement sans limite."},{"type":"opposition","left":{"term":"Rapport immédiat","definition":"L’objet présent déclenche directement l’impulsion et sa consommation conduit à la satiété."},"right":{"term":"Rapport médiatisé","definition":"L’imagination place une représentation entre l’impulsion et son objet ; l’absence peut alors entretenir le désir."},"conclusion":"Chez Kant, la distance n’affaiblit pas nécessairement l’inclination : elle peut la rendre plus durable."},{"type":"opposition","left":{"term":"Objet réel","definition":"Il existe indépendamment du sujet et peut être perçu ou consommé."},"right":{"term":"Objet idéalisé","definition":"Il est investi de significations, de promesses et de valeurs produites par le sujet."},"conclusion":"On ne désire donc jamais seulement une chose : on désire aussi ce que l’on imagine à travers elle."},{"type":"analysis","term":"Le mouvement du texte","definition":"Kant décrit trois progrès successifs de la raison.","items":["Elle déborde l’instinct et rend possibles des choix nombreux.","Elle soustrait l’objet aux sens : le refus, la pudeur et l’imagination transforment l’impulsion en amour puis en goût du beau.","Elle permet d’anticiper un avenir lointain et de régler le présent sur ce qui n’existe pas encore."]},{"type":"analysis","term":"Le paradoxe central","definition":"La raison rend l’être humain plus libre en l’affranchissant de l’instinct, mais cette liberté fait également proliférer des penchants superflus. Le progrès n’est donc pas présenté comme un bonheur simple : il agrandit à la fois notre autonomie et notre insatisfaction."},{"type":"concept","term":"Du désir à l’amour","definition":"Le refus introduit une distance. L’autre n’est plus seulement l’objet présent d’une impulsion : il peut être imaginé, attendu et admiré. C’est ce déplacement qui prépare, dans le raisonnement de Kant, l’amour et le sentiment du beau."}]},{"id":"kant-quietude-inaccessible","section":"philosophie","cardMeta":"Philosophie critique","title":"La quiétude est inaccessible à l’homme","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"inaccessible à l’homme","cardHeight":"compact","authorMeta":"(1724–1804) · philosophie critique","themes":["Bonheur","Nature"],"work":"Anthropologie d’un point de vue pragmatique","publication":"1798, § 61","description":"Pourquoi une satisfaction absolue serait-elle incompatible avec l’activité et la vie humaines ?","context":"Kant ne présente pas la <strong>douleur</strong> comme un simple mal : la nature en fait un stimulant qui relance constamment l’activité humaine et le progrès vers le mieux.","readingNotes":[{"type":"concept","term":"<em>Acquiescentia</em>","definition":"Satisfaction ou approbation complète. Kant soutient qu’elle ne peut jamais être absolue pendant la vie humaine."},{"type":"opposition","left":{"term":"Satisfaction relative","definition":"Jugement partiel obtenu en comparant notre vie à celle des autres ou à nos propres états antérieurs."},"right":{"term":"Satisfaction absolue","definition":"État sans manque, sans douleur et sans nouveau mobile d’action ; il demeure inaccessible à l’être humain vivant."}},{"type":"concept","term":"Douleur comme aiguillon","definition":"La douleur signale un manque et met les facultés en mouvement. Elle empêche l’engourdissement et pousse l’être humain à progresser vers le mieux."},{"type":"concept","term":"Analogie organique","definition":"Une vie intellectuelle entièrement immobile serait comparable à un cœur qui cesse de battre : sans nouvelle excitation, l’arrêt de l’activité conduit à la mort."}]},{"id":"aristote-temps-nombre-mouvement","section":"philosophie","cardMeta":"Antiquité grecque","title":"Le temps est le nombre du mouvement","author":"Aristote","authorTag":"Aristote","cardHighlight":"nombre du mouvement","authorMeta":"(384–322 av. J.-C.) · aristotélisme","themes":["Temps","Nature"],"work":"Physique","publication":"IVe s. av. J.-C., livre IV, 219b sqq., trad. P. Pellegrin, GF, 2000, p. 252–253","description":"Le temps est-il une réalité indépendante, ou ce par quoi nous nombrons l’avant et l’après dans le mouvement ?","context":"Aristote distingue le <strong>temps</strong> du mouvement lui-même. Le temps est ce par quoi nous pouvons compter un <strong>avant</strong> et un <strong>après</strong> dans le changement : il dépend du mouvement sans se confondre avec lui.","readingNotes":[{"type":"concept","term":"Nombre du mouvement","badge":false,"definition":"Le temps n’est pas le mouvement lui-même : il est le nombre du mouvement selon l’antérieur et le postérieur, c’est-à-dire ce qui permet d’en ordonner et d’en mesurer la succession."},{"type":"opposition","left":{"term":"Mouvement","definition":"Le changement qui se produit dans les choses."},"right":{"term":"Temps","definition":"Ce par quoi le mouvement est nombré selon un avant et un après."}},{"type":"concept","term":"Le maintenant","badge":false,"definition":"Le présent joue le rôle d’une limite : il distingue un antérieur d’un postérieur tout en appartenant à la continuité du temps."}],"familiarIdea":"le temps, « nombre du mouvement »"},{"id":"kant-temps-forme-a-priori","section":"philosophie","cardMeta":"Philosophie critique","title":"Le temps est une forme a priori de la sensibilité","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"forme a priori","authorMeta":"(1724–1804) · philosophie critique","themes":["Temps","Raison"],"work":"Critique de la raison pure","publication":"1781–1787, section 2, trad. A. Tremesaygues et B. Pacaud, PUF, 1975","description":"Le temps vient-il de l’expérience, ou faut-il déjà le présupposer pour pouvoir percevoir une succession ?","context":"Pour Kant, le <strong>temps</strong> ne vient pas de l’expérience : toute expérience d’une succession ou d’une simultanéité le suppose déjà. Il est donc une <strong>forme <em>a priori</em> de la sensibilité</strong>, c’est-à-dire une condition de notre manière de recevoir les phénomènes.","readingNotes":[{"type":"concept","term":"A priori","definition":"Ce qui ne dérive pas de l’expérience mais constitue une condition qui la rend possible."},{"type":"concept","term":"Forme de la sensibilité","definition":"Cadre dans lequel les phénomènes peuvent nous apparaître. Pour Kant, le temps structure nécessairement notre expérience intérieure et toute succession."},{"type":"opposition","left":{"term":"Concept empirique","definition":"Une représentation obtenue à partir de l’expérience."},"right":{"term":"Représentation a priori","definition":"Une représentation présupposée par l’expérience elle-même et qui ne peut donc en être dérivée."}}],"familiarIdea":"le temps, forme <em>a priori</em> de la sensibilité"},{"id":"bergson-duree-espace","section":"philosophie","cardMeta":"Philosophie de la durée","title":"La durée vécue ne se laisse pas réduire à une ligne","author":"Henri Bergson","authorTag":"Bergson","cardHighlight":"durée vécue","familiarIdea":"la durée pure","authorMeta":"(1859–1941) · durée et intuition","themes":["Temps","Conscience"],"work":"Essai sur les données immédiates de la conscience","publication":"1889, PUF, 2010, p. 74–75","description":"Que perdons-nous lorsque nous représentons le temps comme une suite de points juxtaposés dans l’espace ?","context":"Bergson oppose la <strong>durée pure</strong>, continuité qualitative de nos états de conscience, au temps homogène que nous représentons comme une ligne. Mesurer le temps revient alors à le <strong>spatialiser</strong>.","readingNotes":[{"type":"opposition","left":{"term":"Durée pure","definition":"Continuité vécue dans laquelle les états de conscience s’organisent et se pénètrent mutuellement."},"right":{"term":"Temps spatialisé","definition":"Représentation abstraite de la succession comme une série de positions juxtaposées, comparables aux points d’une ligne."}},{"type":"concept","term":"La mélodie","definition":"Une mélodie ne se réduit pas à des notes isolées : chaque note retient les précédentes et modifie l’ensemble. Elle fournit à Bergson une image de la continuité vécue."},{"type":"concept","term":"Spatialisation","definition":"Opération par laquelle nous transformons une succession qualitative en éléments distincts et mesurables, placés les uns à côté des autres."}]},{"id":"pascal-divertissement-condition","section":"philosophie","cardMeta":"XVIIe siècle","title":"Le divertissement nous détourne de notre condition","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"nous détourne","familiarIdea":"le divertissement pascalien","authorMeta":"(1623–1662) · moraliste chrétien","themes":["Temps","Bonheur"],"work":"Pensées","publication":"1670, publication posthume, Br. 139, Laf. 136, Hachette, 1967, p. 390–391 et 394","description":"Pourquoi cherchons-nous sans cesse l’agitation alors même que nous prétendons désirer le repos ?","context":"Chez Pascal, le <strong>divertissement</strong> ne désigne pas seulement les loisirs. Il désigne tout ce qui nous détourne de la pensée de notre <strong>condition fragile et mortelle</strong>. Nous recherchons le repos, mais le repos nous expose précisément à ce que nous cherchons à oublier.","readingNotes":[{"type":"concept","term":"Divertissement","definition":"Du latin <em>divertere</em>, détourner. Chez Pascal, ensemble des occupations qui nous détournent de nous-mêmes, de notre mortalité et de la misère de notre condition."},{"type":"opposition","left":{"term":"Repos recherché","definition":"Nous prétendons vouloir atteindre une situation stable où les obstacles ont disparu."},"right":{"term":"Repos insupportable","definition":"Une fois l’agitation cessée, la pensée revient vers notre fragilité, l’ennui, la maladie et la mort."}},{"type":"concept","term":"Le tracas","badge":false,"definition":"Ce n’est pas tant l’objet poursuivi qui nous attire que l’agitation de la poursuite elle-même, parce qu’elle nous empêche de penser à notre condition."}]},{"id":"sartre-existence-precede-essence","section":"philosophie","cardMeta":"Existentialisme","title":"L’existence précède l’essence","author":"Jean-Paul Sartre","authorTag":"Sartre","cardHighlight":"précède l’essence","authorMeta":"(1905–1980) · existentialisme","themes":["Temps","Liberté"],"work":"L’Existentialisme est un humanisme","publication":"1946, Gallimard, 1996, p. 26–30","description":"Si aucune nature humaine n’est donnée d’avance, qu’est-ce qui détermine ce que nous sommes ?","context":"Sartre oppose l’objet fabriqué, défini avant d’exister, à l’être humain. Si aucune nature humaine n’est fixée d’avance, alors nous <strong>existons d’abord</strong> et nous nous définissons ensuite par nos choix, nos actes et nos projets.","readingNotes":[{"type":"opposition","left":{"term":"Objet fabriqué","definition":"Sa définition, son usage et son mode de fabrication sont conçus avant qu’il existe effectivement."},"right":{"term":"Être humain","definition":"Il n’a pas d’essence prédéfinie : il existe d’abord et se définit progressivement par sa manière de vivre et d’agir."}},{"type":"current","term":"Existence précède l’essence","badge":"courant philosophique","href":"/textes/philosophie/boussole/#courant-existentialisme","definition":"Il n’existe pas de nature humaine donnée une fois pour toutes avant les individus : chacun devient ce qu’il est à travers son existence."},{"type":"concept","term":"Projet","badge":false,"definition":"L’être humain est orienté vers l’avenir : il se dépasse constamment vers des possibilités et se définit à travers ce qu’il fait de sa situation."},{"type":"comparison","title":"Existentialisme / essentialisme","note":"Comparaison pédagogique : « essentialisme » désigne ici le schéma auquel Sartre oppose l’existentialisme, et non une école philosophique unique.","columns":["Existentialisme","Essentialisme"],"rows":[["L’existence précède l’essence","L’essence précède l’existence"],["L’être humain n’a pas de nature fixée d’avance : il se définit par ses choix et ses actes.","Ce qu’est un être est déterminé par une nature, une définition ou une essence antérieure à son existence concrète."],["La liberté et la responsabilité sont centrales : chacun fait quelque chose de sa situation.","L’existence particulière se comprend à partir de propriétés ou d’une finalité déjà définies."]]}],"familiarIdea":"« l’existence précède l’essence »"},{"id":"nietzsche-eternel-retour","section":"philosophie","cardMeta":"Critique des valeurs","title":"Voudrais-tu revivre cette vie d’innombrables fois ?","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardTitle":"Le poids le plus lourd","cardHighlight":"poids le plus lourd","familiarIdea":"l’éternel retour","cardStyle":"quote","authorMeta":"(1844–1900) · critique des valeurs","themes":["Temps","Existence"],"work":"Le Gai Savoir","publication":"1882, § 341, trad. P. Klossowski, Gallimard, 1982, p. 232","description":"Que deviendrait notre manière de vivre si chaque instant devait revenir exactement de la même façon ?","context":"Nietzsche ne présente pas ici l’<strong>éternel retour</strong> comme une théorie à démontrer, mais comme une épreuve adressée à notre <strong>existence</strong>. Imaginer que chaque instant revienne à l’identique permet de mesurer notre rapport à notre vie : la subirions-nous comme un poids, ou pourrions-nous vouloir qu’elle recommence éternellement ?","readingNotes":[{"type":"concept","term":"Éternel retour","definition":"Ici, Nietzsche met en scène l’hypothèse d’un retour identique de chaque instant afin d’éprouver la valeur que nous accordons à notre propre existence."},{"type":"analysis","term":"Une épreuve existentielle","definition":"La question n’est pas seulement de savoir si le retour est vrai : l’aphorisme demande ce que cette pensée ferait à celui qui la reçoit et à sa manière d’agir."},{"type":"concept","term":"Affirmation de la vie","definition":"Pouvoir vouloir le retour de son existence entière signifie ne plus réserver son assentiment aux seuls moments agréables, mais assumer le devenir dans son ensemble."}]},{"id":"bouddha-sortir-cycle-renaissances","section":"philosophie","cardMeta":"Philosophie indienne","title":"Se libérer du cycle des renaissances","author":"Siddhartha Gautama, dit Bouddha","authorTag":"Bouddha","cardHighlight":"cycle des renaissances","authorMeta":"(v. 500–v. 420 av. J.-C.) · bouddhisme","themes":["Temps","Religion"],"work":"Dhammapada, les stances de la loi","publication":"VIe s. av. J.-C., trad. J.-P. Osier, Flammarion, 1999, p. 126–128","description":"En quel sens la délivrance consiste-t-elle à se détacher des désirs, des liens et du cycle des renaissances ?","context":"Le <em>Dhammapada</em> décrit ici le sage libéré du <strong><em>saṃsāra</em></strong>, le cycle des renaissances. Le mot « brahmane » ne désigne pas simplement une appartenance sociale : le texte en fait le nom de celui qui a rompu l’<strong>attachement</strong> et atteint la délivrance.","readingNotes":[{"type":"concept","term":"Saṃsāra","definition":"Cycle des existences, des morts et des renaissances auquel les êtres restent attachés tant que les causes de l’attachement ne sont pas éteintes."},{"type":"concept","term":"Brahmane","definition":"Dans ce passage, le terme est réinterprété : le véritable brahmane est le sage délivré, purifié de l’attachement et du cycle des renaissances."},{"type":"opposition","left":{"term":"Attachement","definition":"Désirs, possessions et liens auxquels l’existence s’accroche et qui entretiennent le cycle des renaissances."},"right":{"term":"Délivrance","definition":"Extinction de l’attachement et fin des renaissances ; le texte la présente comme un état de détachement et d’éveil."}}],"familiarIdea":"le <em>saṃsāra</em>"},{"id":"descartes-langage-pensee","section":"philosophie","cardMeta":"Rationalisme moderne","title":"Seul le langage humain exprime des pensées","author":"René Descartes","authorTag":"Descartes","cardHighlight":"exprime des pensées","authorMeta":"(1596–1650) · rationalisme moderne","themes":["Langage","Conscience"],"work":"Lettre du 23 novembre 1646 au marquis de Newcastle","publication":"1646, in Œuvres et lettres, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 1255–1266","description":"La parole permet-elle de distinguer une pensée véritable d’un simple comportement appris ou passionnel ?","context":"Descartes cherche ce qui distingue véritablement l’être humain de l’animal. Le <strong>langage</strong> ne se réduit pas à produire des sons : il suppose de pouvoir combiner des signes pour exprimer librement une pensée adaptée à des situations toujours nouvelles.","readingNotes":[{"type":"concept","term":"Langage et pensée","definition":"Le langage humain ne se définit pas par la simple émission de sons, mais par la capacité de composer des signes adaptés à des situations nouvelles pour manifester une pensée."},{"type":"opposition","left":{"term":"Réaction animale","definition":"Comportement provoqué par la crainte, l’espérance, la joie ou un apprentissage."},"right":{"term":"Parole humaine","definition":"Usage ouvert de signes permettant d’exprimer des pensées à propos de ce qui se présente."},"conclusion":"Le critère décisif n’est pas la complexité extérieure du comportement, mais le rapport du signe à une pensée."},{"type":"analysis","term":"Un argument anthropologique","definition":"Descartes mobilise le langage pour soutenir une différence de nature entre l’être humain et l’animal.","items":["Les animaux peuvent apprendre des comportements et produire des sons.","Mais ils ne composent pas librement des signes pour exprimer des pensées nouvelles.","À l’inverse, tout être humain, même privé de parole vocale, peut inventer un système de signes."]}]},{"id":"benveniste-communication-animale-langage-humain","section":"philosophie","cardMeta":"Linguistique structurale","title":"Les animaux communiquent par signaux, mais ne peuvent pas dialoguer","author":"Émile Benveniste","authorTag":"Benveniste","cardHighlight":"ne peuvent pas dialoguer","authorMeta":"(1902–1976) · linguistique structurale","themes":["Langage","Nature"],"work":"« Communication animale et langage humain », Problèmes de linguistique générale","publication":"1966, t. I, Gallimard, p. 59–61","description":"La communication des abeilles possède-t-elle les propriétés qui font du langage humain un véritable langage ?","context":"Benveniste reconnaît à la communication des abeilles une organisation remarquable, mais refuse d’y voir un langage humain. La différence décisive tient notamment au <strong>dialogue</strong> : un locuteur humain peut répondre à un message par un nouveau message et transmettre ce qu’il n’a pas lui-même vécu.","readingNotes":[{"type":"concept","term":"Symbolisation","definition":"Les abeilles ne réagissent pas seulement à un stimulus immédiat : elles codent des informations de position et de distance dans une conduite qui vaut comme signe."},{"type":"opposition","left":{"term":"Communication animale","definition":"Transmission d’une donnée objective conduisant à une action déterminée."},"right":{"term":"Langage humain","definition":"Échange ouvert où un message peut devenir l’objet d’un autre message, être repris, discuté et transmis."},"conclusion":"Benveniste situe la spécificité humaine moins dans le fait de communiquer que dans la récursivité du dialogue et la transmissibilité indéfinie des signes."},{"type":"analysis","term":"La tradition linguistique","definition":"Parce qu’une expérience peut être remplacée par un signe puis transmise à ceux qui ne l’ont pas vécue, le langage permet l’accumulation d’un monde commun de récits, de savoirs et de règles."}]},{"id":"saussure-signe-linguistique-arbitraire","section":"philosophie","cardMeta":"Linguistique structurale","title":"Le signe linguistique est arbitraire","author":"Ferdinand de Saussure","authorTag":"Saussure","cardHighlight":"signe linguistique est arbitraire","familiarIdea":"l’arbitraire du signe","authorMeta":"(1857–1913) · linguistique structurale","themes":["Langage","Culture"],"work":"Cours de linguistique générale","publication":"1916, Payot, 1996, p. 99–101","description":"Pourquoi n’existe-t-il pas de lien naturel entre le son d’un mot et le concept qu’il désigne ?","context":"Saussure définit le <strong>signe linguistique</strong> comme l’union d’un signifiant et d’un signifié. Leur lien est arbitraire : rien, dans une idée, n’impose naturellement le mot qui la désigne ; chaque langue repose donc sur des conventions collectives.","readingNotes":[{"type":"concept","term":"Signe linguistique","definition":"Le signe n’est ni le son seul ni le concept seul : il est l’association des deux faces, signifiant et signifié."},{"type":"opposition","left":{"term":"Signe arbitraire","definition":"Le lien entre ses deux faces n’est fondé par aucune ressemblance naturelle."},"right":{"term":"Symbole motivé","definition":"Il conserve un rapport perceptible ou culturel avec ce qu’il représente."},"conclusion":"La langue fonctionne parce qu’une communauté stabilise des différences conventionnelles, non parce que les mots ressemblent naturellement aux choses."},{"type":"plain","definition":"L’arbitraire est social plutôt qu’individuel : une fois le signe installé dans la langue, le locuteur ne peut pas le modifier à volonté sans cesser d’être compris."}]},{"id":"cassirer-langage-reel-construction","section":"philosophie","cardMeta":"Philosophie des formes symboliques","title":"Le langage ne reproduit pas le réel","author":"Ernst Cassirer","authorTag":"Cassirer","cardHighlight":"ne reproduit pas le réel","authorMeta":"(1874–1945) · néokantisme et formes symboliques","themes":["Langage","Raison"],"work":"Essai sur l’homme","publication":"1944, chap. 8 « Le langage », Minuit, 1975, p. 193","description":"Les mots copient-ils les choses, ou construisent-ils une manière déterminée de les voir ?","context":"Cassirer refuse de voir dans les mots une simple copie des choses. Le langage <strong>sélectionne</strong> certains traits de l’expérience, organise notre attention et construit déjà une manière de saisir le réel avant même l’élaboration des concepts scientifiques.","readingNotes":[{"type":"concept","term":"Nommer, c’est sélectionner","definition":"Un mot ne reproduit pas l’objet dans toute sa richesse : il retient un aspect pertinent et stabilise une manière de l’identifier."},{"type":"opposition","left":{"term":"Copie du réel","definition":"Conception selon laquelle les mots refléteraient naturellement des choses déjà entièrement déterminées."},"right":{"term":"Construction symbolique","definition":"Le langage organise l’expérience en choisissant des traits, des différences et des centres de perception."},"conclusion":"Le langage ne nous sépare pas simplement du réel : il rend possible une première objectivation du monde."},{"type":"plain","definition":"Pour Cassirer, la science ne naît pas contre tout langage : elle radicalise et rectifie un travail de conceptualisation que la dénomination ordinaire a déjà commencé."}]},{"id":"nietzsche-langue-conception-monde","section":"philosophie","cardMeta":"Critique des valeurs","title":"La langue nous enferme dans une conception du monde","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"conception du monde","authorMeta":"(1844–1900) · généalogie et critique des valeurs","themes":["Langage","Liberté"],"work":"La Généalogie de la morale","publication":"1887, I, § 13, trad. P. Wotling, Le Livre de poche, p. 96–100","description":"La grammaire nous conduit-elle à croire à des sujets, des causes et une liberté qui n’existent peut-être pas comme nous l’imaginons ?","context":"Nietzsche soupçonne la <strong>grammaire</strong> de nous faire prendre une structure de phrase pour une structure du réel. Parce que nous séparons un sujet et son action, nous imaginons facilement derrière tout agir un agent stable et responsable qui aurait pu agir autrement.","readingNotes":[{"type":"concept","term":"Une métaphysique dans la grammaire","definition":"Le schéma sujet–verbe–attribut pousse à imaginer une chose stable qui existerait d’abord puis produirait ensuite ses actes."},{"type":"opposition","left":{"term":"« L’agent agit »","definition":"Lecture grammaticale qui dédouble l’événement en une cause supposée et son effet."},"right":{"term":"« L’agir est tout »","definition":"Nietzsche refuse d’ajouter derrière l’action un sujet indépendant qui existerait avant elle."},"conclusion":"La critique du langage devient une critique de la responsabilité conçue comme pouvoir absolu d’agir ou de ne pas agir."},{"type":"plain","definition":"La thèse ne consiste pas simplement à dire que les mots sont trompeurs : certains schèmes linguistiques peuvent rendre intuitives des distinctions métaphysiques qui devraient pourtant être interrogées."}]},{"id":"zamenhof-esperanto-langue-artificielle","section":"philosophie","cardMeta":"Espérantisme","title":"Une langue artificielle peut-elle devenir une langue commune ?","author":"Ludwik Zamenhof","authorTag":"Zamenhof","cardHighlight":"langue artificielle","authorMeta":"(1859–1917) · espérantisme","themes":["Langage","Politique"],"work":"Déclaration sur l’essence de l’espérantisme","publication":"1905, Congrès universel d’Espéranto de Boulogne-sur-Mer, août 1905","description":"Une langue construite peut-elle être neutre, collective et suffisamment vivante pour relier des locuteurs de langues différentes ?","context":"Zamenhof imagine l’espéranto comme une langue internationale commune qui ne remplace aucune langue nationale. Son projet fait du <strong>langage</strong> un problème politique : comment permettre à tous de communiquer sans donner à un peuple l’avantage d’imposer sa propre langue aux autres ?","readingNotes":[{"type":"concept","term":"Neutralité linguistique","definition":"Le projet vise à offrir un moyen commun de communication qui n’accorde pas, en principe, de privilège politique ou culturel à la langue d’une nation particulière."},{"type":"opposition","left":{"term":"Langue nationale","definition":"Langue héritée d’une histoire et liée à une communauté déterminée."},"right":{"term":"Langue auxiliaire internationale","definition":"Langue commune ajoutée aux langues existantes pour faciliter la communication entre groupes linguistiques."},"conclusion":"Zamenhof ne présente pas l’Espéranto comme un remplacement, mais comme une médiation supplémentaire."},{"type":"analysis","term":"Une langue sans propriétaire","definition":"En renonçant à ses droits personnels, Zamenhof cherche à transformer un projet individuel en institution collective : la langue ne doit pas dépendre de la volonté continue de son inventeur."}]},{"id":"sartre-langage-poesie-fin","section":"philosophie","cardMeta":"Existentialisme et littérature","title":"Le langage, en poésie, est une fin et non un moyen","author":"Jean-Paul Sartre","authorTag":"Sartre","cardHighlight":"une fin et non un moyen","authorMeta":"(1905–1980) · existentialisme","themes":["Langage","Art"],"work":"Qu’est-ce que la littérature ?","publication":"1948, Gallimard, p. 17–19","description":"Le poète utilise-t-il les mots comme des instruments, ou les traite-t-il comme des choses dotées d’une présence propre ?","context":"Sartre oppose l’usage ordinaire du langage, où les mots servent de <strong>signes</strong>, au rapport poétique aux mots. Le poète ne traverse plus le mot pour atteindre directement la chose : il en fait une matière sonore et signifiante qui vaut aussi pour elle-même.","readingNotes":[{"type":"opposition","left":{"term":"Langage-instrument","definition":"Les mots servent à viser un objet, informer ou agir."},"right":{"term":"Langage poétique","definition":"Les mots deviennent eux-mêmes une matière sonore et signifiante."},"conclusion":"La poésie ne détruit pas le sens : elle le rend inséparable de la matérialité du mot."},{"type":"analysis","term":"Le mot comme chose","definition":"Le poète cesse de traiter le mot comme une vitre transparente et s’attarde sur sa présence propre."}]},{"id":"austin-mots-accomplir-actions","section":"philosophie","cardMeta":"Philosophie du langage ordinaire","title":"Avec des mots, on peut accomplir des actions","author":"John Langshaw Austin","authorTag":"Austin","cardHighlight":"accomplir des actions","familiarIdea":"les énoncés performatifs","authorMeta":"(1911–1960) · philosophie du langage ordinaire","themes":["Langage","Vérité"],"work":"« Performatif-constatif », La Philosophie analytique","publication":"1962 [posth.], trad. L. Aubert et A. L. Hacker, Minuit, p. 271–273","description":"Tous les énoncés servent-ils à décrire le monde, ou certains accomplissent-ils une action au moment même où ils sont prononcés ?","context":"Austin montre que parler ne consiste pas toujours à décrire le monde. Certains énoncés accomplissent une <strong>action</strong> au moment même où ils sont prononcés : promettre, baptiser, s’excuser ou déclarer quelque chose suppose alors des conditions précises de réussite.","readingNotes":[{"type":"opposition","left":{"term":"Constatif","definition":"Décrit ou affirme quelque chose ; la question de la vérité y est centrale."},"right":{"term":"Performatif","definition":"Accomplit une action en étant énoncé ; sa réussite dépend de conditions de félicité."},"conclusion":"Austin montre que la fonction du langage ne se réduit pas à représenter le monde : parler peut modifier une situation sociale."},{"type":"analysis","term":"Trois manières d’échouer","definition":"Un performatif peut être critiqué autrement qu’en termes de vrai et de faux.","items":["Il peut être <strong>nul ou sans effet</strong> si la situation ou l’autorité requise manque.","Il peut être <strong>insincère</strong> si le locuteur accomplit la formule sans l’intention correspondante.","Il peut conduire à une <strong>rupture d’engagement</strong> si la conduite ultérieure contredit l’acte accompli."]},{"type":"plain","definition":"La théorie des actes de langage déplace l’analyse philosophique : il faut examiner non seulement ce que les phrases signifient, mais ce que les locuteurs font en les prononçant dans des institutions et des situations déterminées."}]},{"id":"platon-rhetorique-puissance-dialogue","section":"philosophie","cardMeta":"Antiquité grecque","title":"La rhétorique est un dangereux instrument de puissance","author":"Platon","authorTag":"Platon","cardHighlight":"instrument de puissance","authorMeta":"(v. 428–348 av. J.-C.) · platonisme","themes":["Langage","Politique"],"work":"Gorgias","publication":"IVe s. av. J.-C., 456b–458a, trad. M. Canto modifiée, GF, 1993, p. 145–148","description":"La puissance de persuader suffit-elle à faire de la rhétorique un art légitime, ou faut-il subordonner la parole à la recherche du vrai ?","context":"Dans le <em>Gorgias</em>, la rhétorique apparaît comme une puissance de <strong>persuasion</strong> capable d’agir dans la cité même sans véritable savoir. Socrate oppose à cette puissance le dialogue et la réfutation : parler ne doit pas seulement permettre de l’emporter, mais aider à rechercher le vrai et le juste.","readingNotes":[{"type":"opposition","left":{"term":"Rhétorique","definition":"Puissance de persuasion qui permet à l’orateur de l’emporter devant un public, même face au spécialiste."},"right":{"term":"Dialogue philosophique","definition":"Échange où les interlocuteurs acceptent les objections et la réfutation afin de clarifier le problème et de rechercher le vrai."},"conclusion":"Le désaccord porte moins sur l’efficacité de la parole que sur la fin à laquelle cette efficacité doit être subordonnée."},{"type":"concept","term":"Le pouvoir du non-savoir","definition":"Gorgias souligne un paradoxe : celui qui ne possède pas le savoir technique peut néanmoins l’emporter publiquement s’il maîtrise mieux les ressorts de la persuasion."},{"type":"plain","definition":"Socrate introduit une norme morale de la discussion : un échange philosophique suppose que chacun préfère corriger son erreur à préserver son prestige."}]},{"id":"levinas-parler-esclave-egal","section":"philosophie","cardMeta":"Phénoménologie et éthique","title":"Même quand on parle à un esclave, on parle à un égal","author":"Emmanuel Lévinas","authorTag":"Lévinas","cardHighlight":"on parle à un égal","authorMeta":"(1906–1995) · phénoménologie et éthique","themes":["Langage","Autrui"],"work":"Difficile Liberté","publication":"1952, Albin Michel, 1976, p. 21","description":"La conversation peut-elle instaurer une égalité morale avant même que nous connaissions vraiment notre interlocuteur ?","context":"Pour Lévinas, adresser la parole à quelqu’un, c’est déjà le reconnaître comme un <strong>interlocuteur</strong> capable de répondre. Même au cœur d’un rapport de domination, le dialogue introduit donc une égalité fondamentale qui empêche de réduire totalement autrui à une chose.","readingNotes":[{"type":"opposition","left":{"term":"Nommer autrui","definition":"Le rapporter à un concept, le décrire comme quelque chose que je connais."},"right":{"term":"Invoquer autrui","definition":"S’adresser à lui directement et reconnaître qu’il peut me répondre, me contredire et m’obliger."},"conclusion":"La parole ne se réduit pas à une connaissance sur autrui : elle est d’abord une relation avec lui."},{"type":"concept","term":"Conversation et non-violence","definition":"Le locuteur ne peut plus exercer une souveraineté absolue dès lors qu’il s’expose à la réponse de l’autre. Parler implique donc une forme de renoncement à la domination."},{"type":"concept","term":"Égalité de l’interlocution","definition":"Même une relation sociale inégale ne peut supprimer complètement l’égalité instaurée par le fait de s’adresser à quelqu’un et d’attendre sa réponse."}]},{"id":"popper-psychanalyse-non-scientifique","section":"philosophie","cardMeta":"Inconscient · science et réfutabilité","title":"La psychanalyse semble tout expliquer parce que rien ne peut la réfuter","author":"Karl R. Popper","authorTag":"Popper","cardHighlight":"rien ne peut la réfuter","authorMeta":"(1902–1994) · philosophie des sciences","themes":["Inconscient","Science"],"work":"Conjectures et Réfutations","publication":"1953, trad. M.I.B. et M. de Launay, Payot, 2006, p. 61–63","description":"Une théorie est-elle vraiment scientifique si tout comportement imaginable peut toujours être interprété comme une confirmation ?","context":"Popper remarque qu’une théorie capable d’interpréter après coup presque n’importe quel comportement semble toujours confirmée. Or une théorie scientifique doit prendre le risque d’être contredite : c’est le problème du <strong>critère de démarcation</strong> entre science et non-science.","readingNotes":[{"type":"concept","term":"Réfutabilité","definition":"La force scientifique d’une théorie ne vient pas de ce qu’elle peut tout confirmer, mais de ce qu’elle accepte le risque d’être mise en défaut par certains faits."}],"familiarIdea":"le critère de démarcation"},{"id":"sartre-inconscient-mauvaise-foi","section":"philosophie","cardMeta":"Inconscient · liberté et mauvaise foi","title":"L’inconscient reconduit le problème de la mauvaise foi","author":"Jean-Paul Sartre","authorTag":"Sartre","cardHighlight":"mauvaise foi","familiarIdea":"la mauvaise foi","authorMeta":"(1905–1980) · existentialisme","themes":["Inconscient","Liberté"],"work":"L’Être et le Néant","publication":"1943, chap. III, « La mauvaise foi », Gallimard, 1976, p. 88 et 91–92","description":"L’hypothèse d’une censure inconsciente explique-t-elle vraiment le refoulement, ou déplace-t-elle simplement le problème de la conscience qui se dissimule à elle-même ?","context":"Sartre critique l’idée d’une censure inconsciente : pour trier ce qu’elle laisse passer et ce qu’elle refoule, elle doit déjà reconnaître ce qu’elle écarte. La psychanalyse déplacerait donc la contradiction au lieu de la résoudre ; Sartre la ramène au problème de la <strong>mauvaise foi</strong>.","readingNotes":[{"type":"opposition","left":{"term":"Censure inconsciente","definition":"Elle est supposée sélectionner les contenus à refouler sans devenir consciente."},"right":{"term":"Conscience de mauvaise foi","definition":"Elle sait d’une certaine manière ce qu’elle cherche précisément à ne pas reconnaître."},"conclusion":"Pour Sartre, la première notion finit par reproduire le paradoxe de la seconde."}]},{"id":"wittgenstein-inconscient-mythe","section":"philosophie","cardMeta":"Inconscient · critique de l’interprétation","title":"L’inconscient freudien fonctionne comme une explication mythologique","author":"Ludwig Wittgenstein","authorTag":"Wittgenstein","cardHighlight":"explication mythologique","authorMeta":"(1889–1951) · philosophie analytique","themes":["Inconscient","Interprétation"],"work":"« Conversations sur Freud », in Leçons et conversations","publication":"1966 posth., trad. J. Fauve, Gallimard, 1992, p. 89–91, 99","description":"Une interprétation séduisante du rêve ou de l’inconscient est-elle pour autant une explication comparable à une loi scientifique ?","context":"Wittgenstein critique la prétention de certaines explications freudiennes à fonctionner comme des lois scientifiques. L’<strong>interprétation</strong> des rêves peut être éclairante et séduisante sans constituer un décodage objectif : il n’existe pas de règle permettant de traduire mécaniquement une image de rêve en pensée.","readingNotes":[{"type":"concept","term":"Explication et séduction","definition":"Wittgenstein ne nie pas que Freud fasse voir quelque chose ; il conteste que l’attrait explicatif d’un schéma suffise à lui donner le statut d’une loi scientifique."}]},{"id":"freud-inconscient-hypothese","section":"philosophie","cardMeta":"Inconscient · hypothèse psychanalytique","title":"L’hypothèse de l’inconscient est nécessaire et légitime","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"nécessaire et légitime","familiarIdea":"l’hypothèse de l’inconscient","authorMeta":"(1856–1939) · psychanalyse","themes":["Inconscient","Conscience"],"work":"L’Inconscient, in Métapsychologie","publication":"1915, trad. J. Laplanche et J.-B. Pontalis, Gallimard, 1943, p. 66–67","description":"Pourquoi admettre des processus psychiques inconscients si la conscience ne les perçoit pas directement ?","context":"Freud part des lacunes de la conscience : rêves, actes manqués, symptômes et pensées dont l’origine nous échappe restent obscurs si l’on suppose que tout le psychisme est conscient. L’hypothèse de l’<strong>inconscient</strong> devient alors nécessaire parce qu’elle redonne sens et cohérence à ces phénomènes.","readingNotes":[{"type":"concept","term":"Nécessité de l’inconscient","definition":"L’inconscient est posé parce que la seule conscience laisse des phénomènes psychiques incohérents ou inexpliqués."}]},{"id":"freud-reve-rebus","section":"philosophie","cardMeta":"Inconscient · rêve et interprétation","title":"Le rêve est un rébus à traduire","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"rébus à traduire","familiarIdea":"contenu manifeste et contenu latent","authorMeta":"(1856–1939) · psychanalyse","themes":["Inconscient","Interprétation"],"work":"L’Interprétation des rêves","publication":"1900, trad. I. Meyerson, PUF, 1967, p. 241","description":"Le rêve doit-il être lu comme une image absurde, ou traduit comme l’expression déformée de pensées latentes ?","context":"Freud distingue le <strong>contenu manifeste</strong> du rêve, dont nous nous souvenons, et les pensées latentes que l’analyse cherche à retrouver. Le rêve ressemble à un rébus : ses images sont des signes qu’il faut <strong>interpréter</strong>, et non des scènes à comprendre littéralement.","readingNotes":[{"type":"opposition","left":{"term":"Contenu manifeste","definition":"Le rêve tel qu’il apparaît et se raconte."},"right":{"term":"Contenu latent","definition":"Les pensées inconscientes reconstruites par l’interprétation."},"conclusion":"L’analyse consiste à traduire le premier dans le langage du second."}]},{"id":"leibniz-petites-perceptions","section":"philosophie","cardMeta":"Conscience · petites perceptions","title":"La plupart de nos perceptions échappent à la conscience","author":"Gottfried Wilhelm Leibniz","authorTag":"Leibniz","cardHighlight":"échappent à la conscience","familiarIdea":"les petites perceptions","authorMeta":"(1646–1716) · rationalisme","themes":["Conscience","Inconscient"],"work":"Nouveaux essais sur l’entendement humain","publication":"1765 posth., préface, trad. J. Brunschwig, GF, 1990, p. 41–42","description":"Tout ce qui affecte notre âme devient-il conscient, ou une multitude de perceptions demeure-t-elle en dessous du seuil de l’aperception ?","context":"Leibniz distingue la <strong>perception</strong> de l’<strong>aperception</strong>, c’est-à-dire de la perception devenue consciente. L’exemple du bruit de la mer montre qu’une perception claire peut être composée d’une multitude de petites perceptions trop faibles pour être remarquées séparément.","readingNotes":[{"type":"opposition","left":{"term":"Perception","definition":"Modification effective de l’âme, même lorsqu’elle n’est pas remarquée."},"right":{"term":"Aperception","definition":"Prise de conscience d’une perception."},"conclusion":"La conscience ne coïncide donc pas avec l’ensemble de la vie perceptive."}]},{"id":"pascal-moi-introuvable","section":"philosophie","cardMeta":"Conscience · identité du moi","title":"Le « moi » est une réalité introuvable","author":"Blaise Pascal","authorTag":"Pascal","cardHighlight":"réalité introuvable","familiarIdea":"« Qu’est-ce que le moi ? »","authorMeta":"(1623–1662) · philosophie moderne","themes":["Conscience","Autrui"],"work":"Pensées","publication":"1670 posth., Br. 323 (Laf. 688), Hachette, 1967, p. 478–479","description":"Qu’aimons-nous réellement chez une personne si son corps, sa mémoire, son jugement et toutes ses qualités peuvent changer ?","context":"Pascal cherche ce que nous aimons réellement lorsque nous disons aimer une <strong>personne</strong>. Les qualités physiques ou morales peuvent changer ou disparaître : si l’amour porte seulement sur elles, alors le « moi » lui-même semble devenir impossible à saisir.","readingNotes":[{"type":"concept","term":"Le moi introuvable","definition":"À mesure que Pascal retire au moi ses propriétés corporelles, psychologiques et sociales, aucun noyau stable ne se laisse isoler."}]},{"id":"marx-conscience-vie-materielle","section":"philosophie","cardMeta":"Conscience · matérialisme et idéologie","title":"Ce n’est pas la conscience qui détermine la vie","author":"Karl Marx","credit":"Karl Marx et Friedrich Engels","authorTag":"Marx","cardHighlight":"la conscience","familiarIdea":"la vie détermine la conscience","authorMeta":"(1818–1883) · matérialisme historique","themes":["Conscience","Société"],"work":"L’Idéologie allemande","publication":"1846, trad. G. Badia, Éditions Sociales, 1966, p. 35–37","description":"Les idées et la conscience ont-elles une existence autonome, ou sont-elles produites à partir de la vie matérielle et sociale des hommes ?","context":"Marx et Engels renversent la perspective idéaliste : les idées ne constituent pas un monde autonome qui commanderait la vie réelle. La <strong>conscience</strong> se forme à partir de l’activité matérielle, des rapports sociaux et des conditions historiques dans lesquelles les individus vivent concrètement.","readingNotes":[{"type":"opposition","left":{"term":"Idéalisme","definition":"Partir des idées, de la conscience ou des représentations pour expliquer la réalité."},"right":{"term":"Matérialisme","definition":"Partir de l’activité réelle et des conditions matérielles pour expliquer la production des idées."},"conclusion":"Le texte formule ce renversement dans la phrase : « Ce n’est pas la conscience qui détermine la vie, mais la vie qui détermine la conscience. »"}]},{"id":"locke-identite-conscience-memoire","section":"philosophie","cardMeta":"Conscience · identité personnelle","title":"La conscience et la mémoire font l’identité personnelle","author":"John Locke","authorTag":"Locke","cardHighlight":"l’identité personnelle","authorMeta":"(1632–1704) · empirisme","themes":["Conscience","Temps"],"work":"Identité et différence (Essai philosophique concernant l’entendement humain)","publication":"1690–1694, II, XXVII, trad. É. Balibar, revue par G. Brykman, Le Seuil, 1998, p. 165–167","description":"Qu’est-ce qui fait qu’une personne demeure la même à travers le temps si son corps et sa substance peuvent changer ?","context":"Locke distingue l’identité de la <strong>personne</strong> de celle du corps ou d’une substance. Ce qui fait le même soi à travers le temps, c’est la continuité d’une conscience capable de reconnaître comme siennes des pensées et des actions passées ; la mémoire devient ainsi décisive pour l’identité personnelle.","readingNotes":[{"type":"concept","term":"Identité de conscience","definition":"La même personne s’étend aussi loin que peut s’étendre la conscience qui reconnaît et s’attribue des actions passées."}]},{"id":"descartes-cogito-chose-pense","section":"philosophie","cardMeta":"Conscience · certitude du sujet","title":"Je suis, j’existe : le sujet se découvre comme chose qui pense","author":"René Descartes","authorTag":"Descartes","cardHighlight":"Je suis, j’existe","familiarIdea":"le cogito cartésien","authorMeta":"(1596–1650) · rationalisme","themes":["Conscience","Raison"],"work":"Méditations métaphysiques","publication":"1641, 2e méditation, Gallimard, « Bibliothèque de la Pléiade », 1953, p. 274–277","description":"Que reste-t-il absolument certain lorsque le doute porte sur le monde, le corps et jusqu’à l’existence des choses extérieures ?","context":"Descartes pousse le doute jusqu’à chercher une certitude qui résiste même à l’hypothèse d’un trompeur tout-puissant. Or, pour douter ou être trompé, il faut encore penser : au moment même où il doute de tout, le sujet découvre donc qu’il ne peut pas douter de sa propre existence.","readingNotes":[{"type":"concept","term":"Cogito","definition":"La certitude « Je suis, j’existe » vaut chaque fois que le sujet la pense : l’acte même de pensée atteste l’existence de celui qui pense."}]},{"id":"platon-connais-toi-toi-meme","section":"philosophie","cardMeta":"Conscience · connaissance de soi","title":"« Connais-toi toi-même » : l’âme se connaît dans le miroir d’une autre âme","author":"Platon","authorTag":"Platon","cardHighlight":"Connais-toi toi-même","familiarIdea":"« Connais-toi toi-même »","authorMeta":"(v. 427–347 av. J.-C.) · philosophie antique","themes":["Conscience","Autrui"],"work":"Alcibiade majeur","publication":"[IVe s. av. J.-C.], 132c–133e, trad. C. Marboeuf et J.-F. Pradeau, GF, 2000, p. 179–184","description":"Peut-on se connaître directement, ou la connaissance de soi exige-t-elle le détour par une autre âme et par ce qu’il y a de plus divin en elle ?","context":"Socrate compare l’âme à un œil qui ne peut se voir qu’en rencontrant un autre œil. De même, la <strong>connaissance de soi</strong> passe par le rapport à autrui et par ce qui, dans une autre âme, pense et réfléchit.","readingNotes":[{"type":"analogy","term":"Le miroir de l’âme","definition":"L’œil ne se voit qu’en regardant un autre œil, dans la partie où réside la vision. De même, l’âme doit se regarder dans une autre âme, au lieu où se trouvent pensée et savoir."}]},{"id":"schopenhauer-sujet-inconnaissable","section":"philosophie","cardMeta":"Conscience · sujet et connaissance","title":"Le sujet connaît tout mais n’est jamais connu","author":"Arthur Schopenhauer","authorTag":"Schopenhauer","cardHighlight":"n’est jamais connu","authorMeta":"(1788–1860) · philosophie moderne","themes":["Conscience"],"work":"Le Monde comme volonté et représentation","publication":"[1819], § 2, t. I, trad. C. Sommer, V. Stanek et M. Dautrey, Gallimard, 2009, p. 80–81","description":"Le sujet peut-il devenir pour lui-même un objet de connaissance, ou toute connaissance suppose-t-elle déjà ce sujet sans jamais pouvoir le saisir ?","context":"Schopenhauer distingue le <strong>sujet</strong>, qui connaît, de tous les objets qu’il peut connaître. Même le corps appartient déjà au monde de la représentation ; le sujet, lui, est toujours présupposé par la connaissance et ne peut donc jamais apparaître comme un objet parmi les autres.","readingNotes":[{"type":"opposition","left":{"term":"Sujet","definition":"Ce qui connaît et présuppose toute connaissance."},"right":{"term":"Objet","definition":"Ce qui est connu et apparaît dans les formes de la représentation."},"conclusion":"Le sujet ne peut pas être transformé en objet sans cesser d’être précisément ce qui rend l’objet connaissable."}]},{"id":"nietzsche-conscience-communication-gregaire","section":"philosophie","cardMeta":"Conscience · communication et société","title":"La conscience grégaire : elle naît du besoin de communiquer","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"besoin de communiquer","familiarIdea":"la conscience grégaire","authorMeta":"(1844–1900) · philosophie contemporaine","themes":["Conscience","Langage"],"work":"Le Gai Savoir","publication":"[1882], § 354, trad. P. Klossowski, Gallimard, 1967, p. 253–254","description":"La conscience exprime-t-elle notre individualité la plus profonde, ou n’est-elle qu’une couche superficielle formée par les besoins de communication de la vie sociale ?","context":"Nietzsche refuse de faire de la conscience le centre de toute pensée. Elle se serait surtout développée parce que l’être humain, animal social et vulnérable, devait <strong>communiquer</strong> ses besoins : devient conscient ce qui peut être traduit dans les signes communs du groupe.","readingNotes":[{"type":"opposition","left":{"term":"Pensée individuelle","definition":"Activité singulière, personnelle et largement inconsciente dans sa profondeur."},"right":{"term":"Pensée consciente","definition":"Partie traduite en paroles et en signes communs, donc adaptée aux exigences de la communication sociale."},"conclusion":"La conscience ne révèle pas l’individu dans sa singularité : elle le retraduit dans le langage du groupe."}]},{"id":"freud-trois-blessures-narcissiques","section":"philosophie","cardMeta":"Conscience · inconscient et décentrement du sujet","title":"Les trois blessures narcissiques : le moi n’est pas maître dans sa propre maison","author":"Sigmund Freud","authorTag":"Freud","cardHighlight":"pas maître dans sa propre maison","familiarIdea":"les trois blessures narcissiques","authorMeta":"(1856–1939) · psychanalyse","themes":["Conscience","Inconscient"],"work":"Introduction à la psychanalyse","publication":"[1916], IIe partie, chap. 18, trad. S. Jankélévitch, Payot, 2001, p. 343–344","description":"Après Copernic et Darwin, la psychanalyse inflige-t-elle à l’être humain une troisième blessure en montrant que le moi ne gouverne pas entièrement sa propre vie psychique ?","context":"Freud présente la psychanalyse comme le troisième grand décentrement de l’être humain : Copernic retire à la Terre sa place centrale, Darwin replace l’homme dans le règne animal, puis l’<strong>inconscient</strong> retire au moi conscient sa souveraineté sur sa propre vie psychique.","readingNotes":[{"type":"concept","term":"Les trois blessures narcissiques","definition":"Freud rassemble trois décentrements : Copernic retire à la Terre sa centralité cosmique, Darwin retire à l’homme sa séparation privilégiée d’avec l’animal, et la psychanalyse retire au moi conscient la souveraineté sur sa propre vie psychique."}]},{"id":"arendt-oeuvre-art-duree-monde","section":"philosophie","cardMeta":"Art · œuvre, objet et durée","title":"L’œuvre d’art n’est pas une simple chose : elle est faite pour durer","author":"Hannah Arendt","authorTag":"Arendt","cardHighlight":"les seules choses à n’avoir aucune fonction","authorMeta":"(1906–1975) · philosophie contemporaine","themes":["Art","Technique"],"work":"La Crise de la culture","publication":"[1961–1968], trad. P. Lévy, Gallimard, 1989, p. 267–268","description":"Qu’est-ce qui distingue l’œuvre d’art des objets d’usage, des biens de consommation et des produits de l’action ?","context":"Arendt distingue trois destins des productions humaines : les biens de consommation disparaissent, les objets d’usage s’usent, tandis que l’œuvre d’art est faite pour durer. Soustraite au besoin et à l’utilité, elle contribue ainsi à la permanence du monde commun et rend possible la culture.","readingNotes":[{"type":"analysis","term":"Trois régimes de durée","definition":"Arendt classe les productions humaines selon leur rapport au temps.","items":["Consommation : la chose disparaît en satisfaisant un besoin.","Usage : l’objet dure, mais s’use en servant.","Œuvre : elle est conservée pour elle-même et peut survivre aux générations."]},{"type":"analysis","term":"Pourquoi l’œuvre est « mondaine »","definition":"Elle est destinée au monde commun plutôt qu’au seul entretien de la vie individuelle."}]},{"id":"alain-artiste-artisan-idee-oeuvre","section":"philosophie","cardMeta":"Art · artiste et artisan","title":"L’idée vient à l’artiste à mesure qu’il fait","author":"Alain","authorTag":"Alain","cardHighlight":"l’idée lui vient à mesure qu’il fait","authorMeta":"(1868–1951) · philosophie contemporaine","themes":["Art","Technique"],"work":"Système des Beaux-Arts","publication":"[1920], livre I, chap. VII, Gallimard, « Bibliothèque de la Pléiade », 1958, p. 239–240","description":"L’artiste applique-t-il une idée déjà formée, ou découvre-t-il l’œuvre et sa règle dans le geste même de créer ?","context":"Alain oppose l’artisan, qui exécute une idée déjà déterminée, à l’artiste, dont l’idée se précise au cours même du travail. Créer, c’est donc découvrir l’œuvre en la faisant : l’artiste devient aussi le spectateur de ce qui naît sous ses mains.","readingNotes":[{"type":"opposition","left":{"term":"Artisan","definition":"Il peut exécuter un projet dont l’idée et les règles sont déjà déterminées."},"right":{"term":"Artiste","definition":"Il découvre ce qu’il fait en le faisant et devient aussi spectateur de l’œuvre qui naît."},"conclusion":"La différence porte sur le rapport entre l’idée et l’exécution, non sur l’habileté manuelle."},{"type":"analysis","term":"Une règle immanente","definition":"La règle de l’œuvre apparaît dans sa réalisation même ; elle ne peut pas être séparée de l’œuvre comme une recette réutilisable."}]},{"id":"kant-genie-regles-art","section":"philosophie","cardMeta":"Art · génie et règles","title":"Le génie donne ses règles à l’art","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"la nature donne à l’art ses règles","authorMeta":"(1724–1804) · philosophie moderne","themes":["Art","Nature"],"work":"Critique de la faculté de juger","publication":"[1790], § 46, trad. J.-M. Vaysse, Gallimard, 1985, p. 261–262","description":"Comment une œuvre peut-elle obéir à des règles si aucune règle déterminée ne peut être donnée avant sa création ?","context":"Kant définit le <strong>génie</strong> comme le talent naturel par lequel la nature donne ses règles à l’art. Une œuvre de génie doit être originale, mais aussi exemplaire : elle ouvre une voie que d’autres peuvent suivre sans qu’on puisse réduire sa création à une méthode enseignable.","readingNotes":[{"type":"analysis","term":"Originalité et exemplarité","definition":"Kant impose deux exigences à l’œuvre de génie.","items":["Originalité : elle ne procède pas de l’imitation d’une règle déjà disponible.","Exemplarité : elle peut pourtant servir de modèle ou de critère à d’autres."]},{"type":"analysis","term":"<em>ingenium</em>","definition":"Le terme latin insiste sur le don naturel : la règle de l’Art se manifeste dans la production au lieu d’être apprise avant elle."}]},{"id":"nietzsche-culte-genie","section":"philosophie","cardMeta":"Art · génie et création","title":"Le culte du génie : aucune création n’est un miracle","author":"Friedrich Nietzsche","authorTag":"Nietzsche","cardHighlight":"aucune n’est un « miracle »","familiarIdea":"le culte du génie","authorMeta":"(1844–1900) · philosophie contemporaine","themes":["Art","Technique"],"work":"Humain, trop humain","publication":"[1878], § 162, trad. R. Rovini, Gallimard, 1988, p. 142–143","description":"Le génie est-il une grâce exceptionnelle, ou le résultat d’un long travail dont l’œuvre achevée efface la genèse ?","context":"Nietzsche attaque le <strong>culte du génie</strong>, qui transforme la création en miracle et cache le travail qui l’a rendue possible. Le génie ne crée pas à partir de rien : il observe, combine, trie et retravaille des matériaux comme toute autre activité inventive.","readingNotes":[{"type":"opposition","left":{"term":"Culte du génie","definition":"L’œuvre paraît jaillir d’un don exceptionnel, sans travail ni médiations."},"right":{"term":"Genèse de l’œuvre","definition":"L’artiste observe, sélectionne, combine des matériaux et apprend à orienter sa pensée."},"conclusion":"Nietzsche remplace le miracle de l’inspiration par l’analyse d’un processus."},{"type":"analysis","term":"<em>miraculum</em>","definition":"Le mot latin pour « miracle » nomme précisément l’illusion que Nietzsche veut dissiper : aucune activité humaine n’échappe totalement à une genèse."}]},{"id":"hegel-art-imitation-nature","section":"philosophie","cardMeta":"Art · imitation et nature","title":"Imiter la nature est une entreprise impossible et futile","author":"Georg Wilhelm Friedrich Hegel","authorTag":"Hegel","cardHighlight":"l’art restera toujours au-dessous de la nature","authorMeta":"(1770–1831) · philosophie moderne","themes":["Art","Nature"],"work":"Esthétique","publication":"[1835–1837 posth.], t. I, introduction, trad. S. Jankélévitch, Flammarion, 1979, p. 34–37","description":"Si l’art se contente de copier la nature, ne devient-il pas une répétition inférieure, oiseuse et sans véritable fin artistique ?","context":"Hegel refuse de faire de l’imitation fidèle de la nature la fin de l’art. Copier ce qui existe déjà n’ajoute qu’une apparence inférieure au vivant ; même le trompe-l’œil le plus habile ne suffit donc pas à définir la valeur d’une œuvre.","readingNotes":[{"type":"analysis","term":"<em>mimèsis</em>","definition":"Le terme grec signifie « imitation ». Hegel ne rejette pas toute ressemblance, mais refuse d’en faire la fin essentielle de l’Art."},{"type":"analysis","term":"Le trompe-l’œil","definition":"Sa réussite montre la limite de l’imitation : même quand la copie trompe, elle ne fait que reproduire une apparence déjà donnée."}]},{"id":"wilde-nature-imite-art","section":"philosophie","cardMeta":"Art · nature et perception","title":"La nature imite l’art","author":"Oscar Wilde","authorTag":"Wilde","cardHighlight":"La Nature devient absolument moderne","familiarIdea":"la nature imite l’art","authorMeta":"(1854–1900) · littérature contemporaine","themes":["Art","Nature"],"work":"Le Déclin du mensonge","publication":"in Intentions [1891], trad. H. Rebell, Allia, 1998, p. 55–56","description":"Voyons-nous d’abord la nature pour ensuite la représenter, ou l’art transforme-t-il ce que nous sommes capables d’y voir ?","context":"Wilde renverse l’idée selon laquelle l’art imite la nature : les arts forment notre regard et nous apprennent à voir certains effets du monde. La « nature » que nous percevons est donc déjà en partie façonnée par des œuvres, des styles et des habitudes de vision.","readingNotes":[{"type":"opposition","left":{"term":"Regarder","definition":"Recevoir simplement ce qui se présente à la vue."},"right":{"term":"Voir","definition":"Percevoir un effet déjà formé par des habitudes, des œuvres et une culture du regard."},"conclusion":"Pour Wilde, l’Art transforme la perception avant même toute imitation."},{"type":"current","term":"Esthétisme","definition":"Courant auquel Wilde est associé : l’Art y affirme son autonomie et sa puissance propre plutôt qu’une simple fonction de reproduction du réel."}]},{"id":"platon-art-imitation-eloigne-vrai","section":"philosophie","cardMeta":"Art · imitation et vérité","title":"L’art d’imitation est éloigné du vrai","author":"Platon","authorTag":"Platon","cardHighlight":"L’art de l’imitation est donc bien éloigné du vrai","authorMeta":"(v. 427–347 av. J.-C.) · philosophie antique","themes":["Art","Vérité"],"work":"La République","publication":"[IVe s. av. J.-C.], livre X, 598bd, trad. G. Leroux, GF, 2002, p. 486–487","description":"L’artiste connaît-il réellement ce qu’il représente, ou produit-il seulement une apparence capable de tromper ?","context":"Dans la <em>République</em>, Platon juge l’art d’imitation à partir de son rapport à la vérité. Le peintre ne connaît pas nécessairement ce qu’il représente : il reproduit l’apparence d’une chose et peut ainsi donner l’illusion d’un savoir qu’il ne possède pas.","readingNotes":[{"type":"analysis","term":"<em>mimèsis</em>","definition":"Chez Platon, l’imitation artistique porte ici sur l’apparence sensible et non sur la connaissance de ce qu’est réellement la chose."},{"type":"opposition","left":{"term":"Savoir","definition":"Connaître ce qu’est une chose et maîtriser l’activité qui la produit."},"right":{"term":"Imitation","definition":"Produire une apparence convaincante sans posséder cette connaissance."},"conclusion":"Le danger de l’Art vient de la confusion possible entre ressemblance et compétence."}]},{"id":"heidegger-art-devoile-verite-souliers","section":"philosophie","cardMeta":"Art · œuvre et vérité","title":"Les souliers de Van Gogh : l’art dévoile la vérité","author":"Martin Heidegger","authorTag":"Heidegger","cardHighlight":"L’œuvre d’art nous a fait savoir ce qu’est en vérité la paire de souliers","familiarIdea":"les souliers de Van Gogh","authorMeta":"(1889–1976) · phénoménologie","themes":["Art","Vérité"],"work":"L’Origine de l’œuvre d’art","publication":"[1935], in Chemins qui ne mènent nulle part [1949], trad. W. Brokmeier, Gallimard, 1962, p. 33–34 et 36","description":"Une œuvre se contente-t-elle de représenter une chose, ou peut-elle faire apparaître ce qu’est cette chose en vérité ?","context":"Heidegger refuse de réduire l’œuvre à la représentation d’un objet utile. Dans le tableau de Van Gogh, les souliers font apparaître tout un monde de travail, de fatigue et de rapport à la terre : l’œuvre dévoile ainsi une vérité que l’usage quotidien laisse cachée.","readingNotes":[{"type":"analysis","term":"Être-produit","definition":"Il ne s’agit pas seulement de la forme ou de l’usage des souliers, mais de ce qu’ils sont au sein d’un monde de pratiques et d’existence."},{"type":"analysis","term":"<em>alètheia</em>","definition":"Le mot grec pour « vérité » signifie ici dévoilement : l’œuvre fait paraître quelque chose que l’usage quotidien laisse en retrait."}]},{"id":"kant-antinomie-gout","section":"philosophie","cardMeta":"Art · jugement de goût","title":"L’antinomie du goût : on peut discuter sans disputer","author":"Emmanuel Kant","authorTag":"Kant","cardHighlight":"on peut discuter du goût","familiarIdea":"l’antinomie du goût","authorMeta":"(1724–1804) · philosophie moderne","themes":["Art"],"work":"Critique de la faculté de juger","publication":"[1790], § 56, trad. J.-M. Vaysse, Gallimard, 1985, p. 298–299","description":"Si le goût est subjectif, comment peut-on néanmoins discuter et attendre des autres qu’ils puissent s’accorder avec nous ?","context":"Kant part de deux idées courantes : « chacun a son goût » et « on ne dispute pas des goûts ». Pourtant, si nous discutons réellement du beau, c’est que nous attendons plus qu’une préférence privée : le jugement de goût vise un accord universel sans pouvoir être démontré par des concepts.","readingNotes":[{"type":"opposition","left":{"term":"Disputer","definition":"Chercher à décider par des preuves et des concepts objectifs."},"right":{"term":"Discuter","definition":"Chercher un accord sans disposer d’une démonstration conceptuelle décisive."},"conclusion":"Le jugement de goût peut être débattu, mais non prouvé comme un énoncé scientifique."},{"type":"analysis","term":"L’antinomie du goût","definition":"Kant fait apparaître deux exigences opposées.","items":["Le goût ne se fonde pas sur des concepts déterminés, sinon on pourrait le démontrer.","Il doit pourtant avoir un fondement partageable, sinon aucune discussion ne viserait l’accord."]}]},{"id":"hume-norme-gout-delicatesse","section":"philosophie","cardMeta":"Art · goût et norme","title":"La norme du goût : la délicatesse de l’imagination","author":"David Hume","authorTag":"Hume","cardHighlight":"délicatesse de l’imagination","familiarIdea":"la norme du goût","authorMeta":"(1711–1776) · empirisme","themes":["Art"],"work":"De la norme du goût","publication":"in Essais moraux, littéraires et politique [1777], trad. J.-P. Jackson, Alive, 1999, p. 288–289","description":"Si la beauté dépend du sentiment, pourquoi certains jugements de goût peuvent-ils être plus fins et plus fiables que d’autres ?","context":"Hume admet que la beauté dépend du sentiment, mais refuse d’en conclure que tous les goûts se valent. Comme un palais exercé distingue mieux les saveurs, une imagination délicate et expérimentée perçoit plus finement les qualités d’une œuvre.","readingNotes":[{"type":"analysis","term":"Subjectif ≠ arbitraire","definition":"Le jugement naît d’un sentiment, mais l’expérience et la finesse de la perception permettent de hiérarchiser les jugements de goût."},{"type":"analysis","term":"La délicatesse de l’imagination","definition":"Elle désigne la capacité à percevoir des différences très fines dans une œuvre ou une composition, comme un palais exercé distingue les saveurs."}]},{"id":"genese-deluge","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Le Déluge","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 6–8","cardHighlight":"Le Déluge","familiarIdea":"l’arche de Noé","authorMeta":"Bible hébraïque · Pentateuque","themes":["Justice","Religion"],"work":"Genèse 6–8","publication":"6,5–10.13–19.21–22 ; 7,11–24 ; 8,1–13.20–22","description":"Comment le récit du Déluge articule-t-il le jugement de la violence humaine, le salut de Noé et la promesse d’un recommencement ?","context":"Après Caïn et Abel, la Genèse décrit une humanité gagnée par la violence. Le Déluge prend alors la forme d’un jugement, mais le récit ne s’arrête pas à la destruction : Noé trouve grâce, l’arche préserve les vivants, les eaux se retirent et Dieu promet de ne plus frapper tous les êtres comme il l’a fait. Le récit met ainsi en tension la gravité du mal, la justice et la possibilité d’un recommencement.","readingNotes":[{"type":"concept","term":"« La terre est remplie de violence »","definition":"Le Déluge n’est pas présenté comme un événement arbitraire : le texte relie explicitement le jugement à une violence devenue générale. Le désordre humain atteint ainsi la terre elle-même."},{"type":"concept","term":"« Noé trouva grâce »","definition":"Au milieu d’un monde corrompu, Noé est décrit comme juste et marchant avec Dieu. Le salut apparaît donc à l’intérieur même du jugement : l’arche conserve une possibilité de vie et de recommencement."},{"type":"concept","term":"« Dieu se souvint de Noé »","definition":"Dans le langage biblique, cette formule ne signifie pas que Dieu aurait oublié Noé. Elle marque le moment où sa fidélité devient action : le vent se lève, les eaux commencent à se retirer et le monde redevient habitable."},{"type":"concept","term":"« Plus jamais »","definition":"À la fin du récit, Dieu constate que le cœur humain demeure incliné au mal, mais il promet pourtant de ne plus frapper tous les vivants. Le jugement débouche ainsi sur une limite posée à la destruction, que l’alliance de Genèse 9 développera explicitement."}]},{"id":"genese-babel","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"La tour de Babel","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 11,1–9","cardHighlight":"tour de Babel","familiarIdea":"la confusion des langues","authorMeta":"Bible hébraïque · Pentateuque","themes":["Langage","Religion","Autrui"],"work":"Genèse 11","publication":"11,1–9","description":"Pourquoi le désir d’unité et de renommée conduit-il à la confusion des langues et à la dispersion ?","context":"Après le Déluge et la descendance de Noé, Genèse 11 présente une humanité encore rassemblée par un même langage. Les hommes s’installent en Mésopotamie, maîtrisent la fabrication de la brique et entreprennent de bâtir une ville et une tour « dont le sommet soit dans les cieux ». Leur projet vise explicitement la renommée et le refus de la dispersion ; il aboutit pourtant à l’incompréhension et à l’éparpillement. Le récit place ainsi le langage, la technique et l’ambition collective au cœur d’une réflexion sur l’unité humaine.","readingNotes":[{"type":"concept","term":"« Le même langage et les mêmes mots »","definition":"Le récit commence par une humanité entièrement unifiée par la langue. Cette unité rend possible une action commune d’une puissance remarquable, mais le texte conduit à demander si l’unité doit signifier l’uniformité, ou si une communauté peut aussi se construire dans la pluralité."},{"type":"concept","term":"« Nous travaillerons à notre renommée »","definition":"La tour n’est pas seulement un exploit architectural : le projet vise à « se faire un nom » et à éviter la dispersion. Le récit associe ainsi puissance technique, volonté de maîtrise et recherche de grandeur collective. L’orgueil est une interprétation traditionnelle de cette ambition, explicitement reprise dans l’édition photographiée."},{"type":"concept","term":"Babel et la confusion des langues","definition":"Le récit rapproche le nom de Babel de l’« embrouillement » du langage. Il met en scène la langue comme lien politique et humain : l’incompréhension produit la dispersion. Historiquement, le nom de Babylone vient de l’akkadien <em>Bāb-ilim</em>, « porte du dieu », tandis que la Genèse joue en hébreu sur le verbe <em>balal</em>, « mêler, confondre »."}]},{"id":"genese-appel-abraham","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"L’appel d’Abraham","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 12,1–9 ; 15,1–6","cardHighlight":"appel d’Abraham","authorMeta":"Bible hébraïque · Pentateuque","themes":["Foi","Alliance"],"work":"Genèse 12 et 15","publication":"12,1–9 ; 15,1–6","description":"Comment répondre à un appel qui oblige à quitter le connu, et comment croire à une promesse dont rien ne garantit encore l’accomplissement ?","context":"Après Babel, la Genèse quitte les grands récits des origines pour suivre une histoire particulière : celle d’Abram. Appelé à quitter son pays et la maison de son père, il reçoit une promesse qui ouvre à la fois sur une terre, une descendance et une bénédiction destinée à « toutes les familles de la terre ». Mais cette promesse se heurte bientôt à l’absence d’enfant. Genèse 15 place alors la confiance d’Abram au centre du récit : il croit avant de voir l’accomplissement.","readingNotes":[{"type":"concept","term":"« Pars de ton pays »","definition":"L’appel commence par une rupture : Abram doit quitter pays, famille et maison du père sans connaître d’avance tout ce qui l’attend. La vocation biblique est ici un déplacement réel, mais aussi une manière de consentir à l’inconnu en répondant à une parole."},{"type":"concept","term":"« En toi seront bénies toutes les familles de la terre »","definition":"L’élection d’Abraham n’est pas présentée comme un privilège fermé sur lui-même. Le choix d’un homme et d’une lignée est orienté vers une bénédiction universelle : la particularité d’Abraham doit devenir, dans le récit, une médiation pour les peuples."},{"type":"concept","term":"« Abram eut foi dans le Seigneur »","definition":"La promesse d’une descendance paraît contredite par la situation d’Abram, qui est sans enfant. Sa foi consiste alors à faire confiance malgré l’absence d’accomplissement visible. Paul reprendra ce verset en Romains 4 pour penser Abraham comme figure de la foi et de la justice reçue de Dieu."}]},{"id":"genese-alliance-abraham","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"L’Alliance avec Abraham","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 17,1–10","cardHighlight":"Alliance avec Abraham","authorMeta":"Bible hébraïque · Pentateuque","themes":["Alliance","Religion"],"work":"Genèse 17","publication":"17,1–10","description":"Comment la promesse faite à Abraham devient-elle une alliance durable, inscrite dans un nom, une descendance et un signe ?","context":"La promesse faite à Abram en Genèse 12 et 15 devient en Genèse 17 une alliance explicitement formulée. Abram a quatre-vingt-dix-neuf ans : Dieu lui promet une descendance innombrable, transforme son nom en Abraham, lie l’alliance aux générations futures et donne la circoncision comme signe. Les textes placés à la suite dans l’édition photographiée prolongent ce thème à travers l’élection d’Israël, l’alliance avec David, la promesse d’une alliance nouvelle chez Jérémie et sa relecture chrétienne.","readingNotes":[{"type":"concept","term":"Alliance","definition":"Le mot biblique traduit l’hébreu <em>berit</em>. Il désigne un lien solennel qui établit une relation durable. Dans Genèse 17, l’initiative vient de Dieu : promesse de descendance, de terre et de fidélité ; Abraham et sa descendance sont appelés à « observer » cette Alliance."},{"type":"concept","term":"Abram devient Abraham","definition":"Le changement de nom accompagne une nouvelle définition de la personne : « père d’un grand nombre de peuples ». Dans le récit biblique, le nom n’est pas un détail administratif ; il exprime une vocation et inscrit Abraham dans une histoire qui le dépasse."},{"type":"concept","term":"La circoncision comme signe","definition":"La circoncision existait dans plusieurs sociétés du Proche-Orient ancien. Genèse 17 lui donne ici une signification propre à l’Alliance : elle devient le signe corporel de l’Alliance avec Abraham et sa descendance, un rappel concret de l’appartenance au peuple de l’Alliance."}]},{"id":"genese-sodome","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Abraham intercède pour Sodome","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 18,17–33","cardHighlight":"intercède pour Sodome","authorMeta":"Bible hébraïque · Pentateuque","themes":["Justice","Religion","Autrui"],"work":"Genèse 18","publication":"18,17–33","description":"Comment Abraham ose-t-il demander à Dieu de ne pas faire périr le juste avec le pécheur ?","context":"Après l’Alliance de Genèse 17 et l’annonce de la naissance d’Isaac au début de Genèse 18, le récit se tourne vers Sodome et Gomorrhe. Dieu fait connaître à Abraham la gravité de la « clameur » qui monte de ces villes. Mais avant le récit de leur destruction, Abraham demeure devant le Seigneur et intercède. Il pose une question décisive : peut-on traiter le juste comme le pécheur ? Le passage met ainsi en tension jugement, responsabilité, justice et miséricorde.","readingNotes":[{"type":"opposition","left":{"term":"Responsabilité collective","definition":"La « clameur » de Sodome et Gomorrhe concerne des villes entières : le mal prend une dimension sociale et collective."},"right":{"term":"Destinée individuelle","definition":"Abraham refuse pourtant que la collectivité efface la distinction entre le juste et le pécheur. La présence de quelques justes doit compter dans le jugement."},"conclusion":"Le dialogue fait apparaître la difficulté d’un jugement collectif qui resterait véritablement juste pour chaque personne."},{"type":"concept","term":"Intercession","definition":"Intercéder, c’est parler en faveur d’un autre. Abraham ne demande rien pour lui-même : il se tient devant Dieu au nom d’une ville menacée et plaide pour ceux qui pourraient y être justes. Dans la Bible, l’intercession devient ainsi une forme de solidarité par la prière."},{"type":"concept","term":"« Le juste avec le pécheur »","definition":"La formule concentre l’enjeu du passage. Abraham affirme implicitement qu’une justice véritable doit distinguer les conduites et ne peut traiter indistinctement l’innocent et le coupable. Sa question culmine dans cette objection : « Celui qui juge toute la terre va-t-il rendre une sentence contraire à la justice ? »"},{"type":"concept","term":"De cinquante à dix","definition":"Abraham reprend sa demande six fois : cinquante, quarante-cinq, quarante, trente, vingt, puis dix justes. Cette diminution progressive donne au dialogue sa tension. À chaque étape, le Seigneur accepte de renoncer à détruire la ville si ce petit nombre de justes y est trouvé."}]},{"id":"genese-joseph-vendu-freres","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Joseph vendu par ses frères","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 37,3–36","cardHighlight":"vendu par ses frères","familiarIdea":"les songes de Joseph","authorMeta":"Bible hébraïque · Pentateuque","themes":["Autrui","Justice"],"work":"Genèse 37","publication":"37,3–11.12–28.31–36","description":"Comment la préférence de Jacob et les songes de Joseph font-ils naître une jalousie qui conduit ses frères jusqu’à le vendre ?","context":"Après la mort d’Isaac, Jacob, héritier de la Promesse, prend la relève. De ses douze fils naîtront les douze tribus qui, traditionnellement, constituent le peuple d’Israël. C’est sous son patriarcat que la Bible situe l’émigration en Égypte d’où, plus tard, il faudra s’échapper lors d’un Exode qui restera mémorable. Le récit de cette émigration est englobé dans une histoire aux multiples broderies, l’histoire de Joseph, le fils préféré de Jacob. Les épisodes, gravés dans les mémoires, ont tout le pittoresque et l’imprévu d’un film à suspense. Mieux encore, ils sont porteurs d’un message attachant. Vendu par ses frères, Joseph se venge en leur pardonnant.","readingNotes":[{"type":"concept","term":"« Jacob aimait Joseph plus que tous ses autres enfants »","definition":"Le récit place d’emblée la préférence paternelle au cœur de la relation entre les frères : l’amour de Jacob devient pour eux le signe d’une inégalité difficile à supporter."},{"type":"concept","term":"Les deux songes","definition":"Gerbes, soleil, lune et onze étoiles mettent en scène une même idée : Joseph occupera une position devant laquelle les autres s’inclineront. Les frères y entendent immédiatement une prétention à régner sur eux."},{"type":"opposition","left":{"term":"Roubène","definition":"Il veut sauver Joseph et le ramener à son père ; il propose de le jeter dans la citerne sans verser son sang."},"right":{"term":"Juda","definition":"Il refuse également le meurtre, mais propose de vendre Joseph aux Ismaélites."},"conclusion":"Le meurtre est évité, mais Joseph reste traité comme un objet dont ses frères peuvent disposer."},{"type":"concept","term":"La tunique","definition":"Donnée par Jacob puis tachée de sang par les frères, elle passe du signe de la préférence au faux indice destiné à faire croire à la mort de Joseph."}]},{"id":"genese-ascension-joseph","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Ascension de Joseph","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 41,1–32","cardHighlight":"Ascension de Joseph","familiarIdea":"les songes de Pharaon","authorMeta":"Bible hébraïque · Pentateuque","themes":["Interprétation","Religion"],"work":"Genèse 41","publication":"41,1–8.25–32","description":"Comment Joseph comprend-il les songes de Pharaon et leur donne-t-il le sens d’un avenir à préparer ?","context":"Joseph devient le majordome de Putiphar. Il se fait remarquer par ses dons d’administrateur, mais aussi par son aptitude à expliquer le sens des rêves. Dieu n’est-il pas avec lui ? Quelqu’un se souvient des dons de Joseph. On l’envoie chercher. Pharaon lui raconte ses rêves. Joseph conseille alors à Pharaon d’amasser de solides réserves pendant les années d’abondance pour ensuite faire face à la disette. Séduit, Pharaon fait de Joseph son grand Vizir.","readingNotes":[{"type":"concept","term":"Deux songes, un seul sens","definition":"Les sept vaches et les sept épis donnent deux images d’une même succession : abondance puis famine. La répétition confirme, selon Joseph, que l’événement est décidé."},{"type":"concept","term":"« Dieu a annoncé à Pharaon ce qu’il va faire »","definition":"Joseph rapporte explicitement son interprétation à Dieu : il ne se présente pas comme l’origine souveraine du sens qu’il expose à Pharaon."},{"type":"opposition","left":{"term":"Abondance","definition":"Sept années pendant lesquelles le pays d’Égypte produit largement."},"right":{"term":"Famine","definition":"Sept années si graves qu’elles feront oublier l’abondance précédente."},"conclusion":"L’interprétation du songe ouvre sur la nécessité de prévoir et de conserver des réserves."}]},{"id":"genese-pardon-joseph","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"Le pardon de Joseph","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 45,1–15","cardHighlight":"Le pardon de Joseph","familiarIdea":"Joseph retrouve ses frères","authorMeta":"Bible hébraïque · Pentateuque","themes":["Autrui","Justice"],"work":"Genèse 45","publication":"45,1–15 ; 50,20","description":"Comment Joseph répond-il à ceux qui l’ont vendu lorsqu’il se fait enfin reconnaître de ses frères ?","context":"Les années de disette venues, on accourt des pays voisins acheter du blé en Égypte. Jacob envoie ses fils. Joseph ne se fait pas reconnaître mais demande à ses frères de revenir avec, cette fois, le dernier-né, Benjamin. À leur retour, Joseph leur ouvre son cœur.","readingNotes":[{"type":"concept","term":"« Je suis Joseph ! »","definition":"La scène repose sur une reconnaissance longtemps différée : celui que les frères avaient vendu se tient désormais devant eux avec le pouvoir de les sauver ou de les condamner."},{"type":"concept","term":"« Ne regrettez plus de m’avoir vendu »","definition":"Joseph ne nie pas la responsabilité de ses frères. Il relit pourtant l’événement à partir de la vie sauvée pendant la famine et renonce à faire de leur faute le dernier mot de l’histoire."},{"type":"concept","term":"« Dieu m’a envoyé en avant de vous »","definition":"Le récit superpose l’action humaine et une lecture providentielle de l’histoire : le mal voulu par les frères n’est pas déclaré bon, mais Joseph affirme qu’il a été tourné vers la sauvegarde d’un peuple."},{"type":"concept","term":"Les larmes","definition":"Joseph pleure avec Benjamin puis avec tous ses frères. La réconciliation n’est pas seulement formulée : elle passe par une proximité retrouvée avant que les frères puissent enfin parler avec lui."}]},{"id":"genese-heritier-promesse","section":"theologie","bible":true,"cardMeta":"Récit biblique","title":"L’héritier de la Promesse","source":"Livre de la Genèse","sourceTag":"Genèse","headerReference":"Genèse 49,8–10","cardHighlight":"L’héritier de la Promesse","familiarIdea":"la bénédiction de Juda","authorMeta":"Bible hébraïque · Pentateuque","themes":["Alliance","Religion"],"work":"Genèse 49","publication":"49,8–10 ; Matthieu 2 ; Colossiens 3","description":"Comment la bénédiction de Juda est-elle reliée à la promesse d’une royauté et à sa relecture dans le Nouveau Testament ?","context":"Jacob vieillissant transmet le flambeau. Des douze frères, c’est Juda qui est l’élu de Dieu. Jacob en le bénissant dévoile son avenir “jusqu’à ce que vienne celui...” Effectivement, c’est de la descendance de Juda que, par le relais de David, naîtra le Messie.","readingNotes":[{"type":"concept","term":"Juda","definition":"Parmi les fils de Jacob, Juda reçoit ici une bénédiction associée à l’hommage de ses frères, à la force du lion et à la royauté."},{"type":"concept","term":"« La royauté n’échappera point à Juda »","definition":"La bénédiction projette la lignée de Juda vers une fonction de commandement et vers la venue de « celui à qui le pouvoir appartient »."},{"type":"concept","term":"Une relecture messianique","definition":"Le document rapproche Genèse 49 de Matthieu 2 : Bethléem, en Juda, devient le lieu d’où doit sortir le chef qui fera paître Israël."},{"type":"concept","term":"« vous pardonnant mutuellement »","definition":"Le passage de Colossiens prolonge le thème du pardon qui traverse l’histoire de Joseph et le transpose dans une exigence adressée à la communauté."}]},{"id":"exode-esclavage-hebreux","section":"theologie","bible":true,"cardMeta":"Exode · esclavage et oppression","title":"L’esclavage des Hébreux","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 1,8–14.22","cardHighlight":"L’esclavage des Hébreux","familiarIdea":"les corvées de Pharaon","authorMeta":"Bible hébraïque · Pentateuque","themes":["Liberté","Justice"],"work":"Exode 1","publication":"1,8–14.22","description":"Comment la peur de Pharaon transforme-t-elle les Hébreux en une population soumise aux corvées, à l’esclavage et à un ordre de mort ?","context":"Le livre de l’Exode reprend le fil après le cycle de Joseph. Les descendants de Jacob se sont multipliés en Égypte, mais un nouveau roi ne connaît plus Joseph et voit désormais leur nombre comme une menace. Le récit présente alors l’installation progressive d’une politique d’oppression.","readingNotes":[{"type":"concept","badge":false,"term":"« un peuple plus nombreux et plus puissant que nous »","definition":"Pharaon ne part pas d’une révolte réelle, mais d’une éventualité : en cas de guerre, les fils d’Israël pourraient rejoindre l’ennemi. Le texte met ainsi en scène une politique fondée sur l’anticipation d’une menace."},{"type":"concept","badge":false,"term":"« des chefs de corvée »","definition":"La domination prend d’abord la forme du travail imposé. Les fils d’Israël bâtissent pour Pharaon et leur activité devient un instrument de contrôle politique."},{"type":"opposition","left":{"term":"Multiplier les contraintes","definition":"Plus le pouvoir cherche à réduire les Hébreux par les corvées et l’esclavage, plus le texte souligne qu’ils se multiplient."},"right":{"term":"Supprimer les naissances","definition":"L’échec de l’oppression conduit finalement Pharaon à viser directement les garçons nouveau-nés."},"conclusion":"Le récit présente une escalade : lorsque la domination par le travail ne suffit pas, le pouvoir passe à l’ordre de mort."},{"type":"concept","badge":false,"term":"« Tous les garçons qui naîtront chez les Hébreux, jetez-les dans le Nil »","definition":"L’ordre ne vise plus seulement des travailleurs ou des opposants : il atteint les enfants à leur naissance. C’est précisément dans ce contexte que s’ouvre ensuite le récit de la naissance de Moïse."}]},{"id":"exode-naissance-moise","section":"theologie","bible":true,"cardMeta":"Exode · naissance et sauvetage","title":"La naissance de Moïse","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 2,1–10","cardHighlight":"La naissance de Moïse","familiarIdea":"Moïse sauvé des eaux","authorMeta":"Bible hébraïque · Pentateuque","themes":["Liberté","Autrui"],"work":"Exode 2","publication":"2,1–10","description":"Comment un enfant condamné par l’ordre de Pharaon échappe-t-il à la mort grâce à une chaîne de gestes de protection et de pitié ?","context":"Après l’ordre de jeter dans le Nil tous les garçons hébreux, le récit se resserre sur une seule naissance. La mère de Moïse cache son fils, puis le place dans une corbeille au bord du fleuve. La fille de Pharaon le découvre, en a pitié et le recueille : le lieu prévu pour la mort devient ainsi le lieu d’un sauvetage.","readingNotes":[{"type":"concept","badge":false,"term":"La corbeille au bord du Nil","definition":"Le Nil était devenu, par l’ordre de Pharaon, le lieu où devaient être jetés les garçons hébreux. La mère de Moïse y dépose pourtant son enfant dans une corbeille protégée par le bitume et la résine : elle transforme l’exposition au danger en tentative de sauvetage."},{"type":"concept","badge":false,"term":"« Elle en eut pitié »","definition":"La fille de Pharaon reconnaît immédiatement qu’il s’agit d’« un petit Hébreu », mais cette identification ne l’amène pas à appliquer l’ordre du pouvoir. La pitié interrompt ici la logique du décret."},{"type":"opposition","left":{"term":"L’ordre de Pharaon","definition":"Les garçons hébreux doivent être jetés dans le Nil."},"right":{"term":"La fille de Pharaon","definition":"Elle retire précisément un enfant hébreu du Nil et le fait nourrir."},"conclusion":"Le récit construit une forte ironie : le salut de Moïse passe par la propre maison de celui qui voulait empêcher sa survie."},{"type":"concept","badge":false,"term":"« Je l’ai tiré des eaux »","definition":"Le récit rattache le nom de Moïse au geste par lequel la fille de Pharaon l’a retiré du fleuve. Celui qui est « tiré des eaux » deviendra plus tard la figure centrale de la sortie d’Égypte."}]},{"id":"exode-appel-moise","section":"theologie","bible":true,"cardMeta":"Exode · vocation et nom divin","title":"L’appel de Moïse","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 3,1–10.13–20","cardHighlight":"L’appel de Moïse","familiarIdea":"le buisson ardent","authorMeta":"Bible hébraïque · Pentateuque","themes":["Religion","Liberté"],"work":"Exode 3","publication":"3,1–10.13–20","description":"Comment la rencontre du buisson ardent devient-elle à la fois révélation de Dieu, connaissance de la souffrance et mission de libération ?","context":"Moïse a quitté l’Égypte et vit au pays de Madiane. Au désert, près de l’Horeb, une rencontre bouleverse sa trajectoire : Dieu l’appelle par son nom, lui révèle qu’il a vu la misère des fils d’Israël et l’envoie auprès de Pharaon. Le même chapitre articule ainsi présence divine, nom de Dieu et mission de libération.","readingNotes":[{"type":"concept","badge":false,"term":"Le buisson qui brûle sans se consumer","definition":"La scène rend visible une présence qui se manifeste sans détruire ce qu’elle habite. Le feu attire Moïse, mais c’est son détour — le fait de s’approcher pour regarder — qui ouvre le dialogue."},{"type":"concept","badge":false,"term":"« Retire tes sandales »","definition":"Le lieu devient « terre sainte » parce qu’il est le lieu d’une rencontre. Le geste demandé à Moïse marque une limite : la proximité avec Dieu n’abolit pas la distance ni le respect."},{"type":"concept","badge":false,"term":"« J’ai vu, oui, j’ai vu… j’ai entendu… je connais… »","definition":"La connaissance divine de la souffrance n’est pas présentée comme une simple information. Voir, entendre et connaître débouchent sur une décision : « Je suis descendu pour le délivrer » puis « Je t’envoie chez Pharaon »."},{"type":"concept","badge":false,"term":"« Je suis celui qui suis »","definition":"La réponse donnée à Moïse refuse de réduire Dieu à une définition ordinaire. Le texte associe ensuite cette formule au nom YAHVÉ et au « Dieu de vos pères », reliant le mystère du nom à une histoire et à une promesse de présence."},{"type":"prose","term":"Le nom divin et la traduction","definition":"Le document juxtapose « JE-SUIS », « YAHVÉ » et « LE SEIGNEUR ». Ces formes ne sont pas interchangeables à tous les niveaux : elles rendent de différentes manières le nom divin et sa réception. La fiche conserve ici exactement les formulations du passage fourni."},{"type":"prose","term":"Des reprises liturgiques","definition":"La page fournie prolonge ensuite l’appel de Moïse par plusieurs textes de chant et de prière. Ils ne font pas partie du texte biblique d’Exode 3, mais montrent comment le thème de la délivrance est relu dans une langue spirituelle et liturgique postérieure."}]},{"id":"exode-paque-israel","section":"theologie","bible":true,"cardMeta":"Exode · Pâque et mémorial","title":"La Pâque d’Israël","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 12,1–14","cardHighlight":"La Pâque d’Israël","familiarIdea":"le sang sur les portes","authorMeta":"Bible hébraïque · Pentateuque","themes":["Religion","Histoire"],"work":"Exode 12","publication":"12,1–14","description":"Comment la nuit du départ devient-elle un rite, un signe de protection et un mémorial transmis d’âge en âge ?","context":"Après l’appel de Moïse et l’affrontement avec Pharaon, le récit arrive à la nuit qui précède la sortie d’Égypte. Le repas de la Pâque est donné comme un rite à accomplir dans l’urgence : agneau, sang sur les maisons, pains sans levain, sandales aux pieds et bâton à la main. L’événement doit ensuite devenir un mémorial.","readingNotes":[{"type":"concept","badge":false,"term":"« le premier des mois »","definition":"Le départ d’Égypte devient un commencement qui réorganise le temps lui-même. Le calendrier inscrit la délivrance au principe d’une nouvelle manière de compter et de se souvenir."},{"type":"concept","badge":false,"term":"Le sang sur les maisons","definition":"Le sang est explicitement présenté comme « un signe ». Dans le récit, il distingue les maisons qui seront épargnées lors du passage du fléau."},{"type":"concept","badge":false,"term":"« la ceinture aux reins, les sandales aux pieds, le bâton à la main »","definition":"Le repas est celui de gens prêts à partir. Le rite conserve ainsi dans les gestes du corps l’urgence du départ : il ne s’agit pas seulement de manger, mais de manger comme un peuple sur le point de quitter l’Égypte."},{"type":"concept","badge":false,"term":"« Ce jour-là sera pour vous un mémorial »","definition":"Le mémorial ne consiste pas seulement à se souvenir mentalement d’un fait passé. Le rite inscrit la délivrance dans une pratique répétée « d’âge en âge » et fait de l’événement un repère durable pour l’identité du peuple."},{"type":"prose","term":"De la Pâque d’Israël à la Pâque chrétienne","definition":"Le document propose ensuite une relecture chrétienne dans le chant de l’Exultet : la sortie d’Égypte, le passage de la Mer Rouge et la colonne lumineuse y sont rapprochés de la résurrection du Christ. Cette lecture typologique appartient à la liturgie chrétienne et vient après le sens propre du récit de l’Exode."}]},{"id":"exode-delivrance-israel","section":"theologie","bible":true,"cardMeta":"Exode · départ et marche au désert","title":"La sortie d’Égypte","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 12,31–39 ; 13,20–22","cardHighlight":"La sortie d’Égypte","familiarIdea":"la sortie d’Égypte","authorMeta":"Bible hébraïque · Pentateuque","themes":["Liberté","Religion"],"work":"Exode 12–13","publication":"12,31–39 ; 13,20–22","description":"Comment la délivrance devient-elle un départ réel, puis une marche guidée jour et nuit vers le désert ?","context":"La nuit pascale débouche sur le départ. Pharaon finit par laisser partir Moïse, Aaron et les fils d’Israël ; l’urgence du départ se lit jusque dans la pâte qui n’a pas eu le temps de lever. Le récit passe ensuite du geste de quitter l’Égypte à celui d’avancer : la colonne de nuée et la colonne de feu figurent une présence qui guide la marche.","readingNotes":[{"type":"concept","badge":false,"term":"« sortez du milieu de mon peuple »","definition":"Le renversement est net : le pouvoir qui refusait le départ finit par l’ordonner lui-même. La délivrance prend ici la forme très concrète d’une séparation d’avec le territoire et l’autorité de Pharaon."},{"type":"concept","badge":false,"term":"La pâte qui n’avait pas levé","definition":"Le détail matériel de la pâte emportée dans l’urgence rejoint le rite des pains sans levain de la Pâque. Le récit fait ainsi se répondre la mémoire liturgique et la précipitation du départ."},{"type":"concept","badge":false,"term":"La colonne de nuée et la colonne de feu","definition":"Le peuple n’est plus sous la direction de Pharaon, mais il n’est pas pour autant présenté comme livré à lui-même. La nuée le guide le jour et le feu l’éclaire la nuit : la liberté nouvellement acquise s’accompagne d’une orientation."},{"type":"concept","badge":false,"term":"De la délivrance au chemin","definition":"La sortie d’Égypte ne clôt pas le récit de l’Exode ; elle l’ouvre. Après le départ viennent le danger de la poursuite, la Mer Rouge, le désert, le Sinaï et l’apprentissage d’une vie collective hors de l’esclavage."}]},{"id":"exode-passage-mer-rouge","section":"theologie","bible":true,"cardMeta":"Exode · passage de la mer","title":"Le passage de la Mer Rouge","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 14,21–31 (extraits)","cardHighlight":"passage de la Mer Rouge","familiarIdea":"la traversée à pied sec","authorMeta":"Bible hébraïque · Pentateuque","themes":["Liberté","Religion"],"work":"Exode 14","publication":"14,21–23.26–31","description":"Comment le passage de la mer accomplit-il la délivrance d’Israël et transforme-t-il la fuite devant Pharaon en expérience fondatrice de salut ?","context":"Après la sortie d’Égypte, Pharaon poursuit les fils d’Israël jusqu’à la mer. Le document retient deux moments du récit : l’ouverture d’un passage à pied sec, puis le retour des eaux sur l’armée égyptienne. Le passage s’achève sur une formule décisive : Israël reconnaît la puissance du Seigneur et met sa foi en lui.","readingNotes":[{"type":"concept","badge":false,"term":"« les eaux formant une muraille à leur droite et à leur gauche »","definition":"L’image transforme la mer, obstacle apparemment infranchissable, en chemin. Le récit fait du passage à pied sec le signe visible d’une délivrance qui ouvre là où aucune route ne semblait possible."},{"type":"opposition","left":{"term":"Pour Israël","definition":"La mer devient un passage : les fils d’Israël avancent à pied sec et échappent à la poursuite."},"right":{"term":"Pour l’armée de Pharaon","definition":"Le même espace devient lieu de catastrophe lorsque les eaux reviennent et recouvrent les chars et les guerriers."},"conclusion":"Le récit ne sépare pas salut et jugement : la délivrance d’Israël est racontée dans le même mouvement que la défaite de la puissance qui le poursuivait."},{"type":"concept","badge":false,"term":"« Ce jour-là, le Seigneur sauva Israël »","definition":"Le salut désigne ici d’abord une délivrance concrète et collective : échapper à l’armée égyptienne et sortir définitivement de sa portée. Ce sens historique devient ensuite une matrice majeure du vocabulaire biblique du salut."},{"type":"concept","badge":false,"term":"« il mit sa foi dans le Seigneur et dans son serviteur Moïse »","definition":"La foi apparaît comme une réponse à un événement reconnu comme délivrance. Elle n’est pas présentée ici comme une opinion abstraite, mais comme une confiance née de ce que le peuple vient de traverser."},{"type":"analysis","term":"Épopée, histoire et mémoire","definition":"Le document attire lui-même l’attention sur la forme du récit : « l’épopée transfigure l’histoire ».","items":["Le passage de la mer n’est pas présenté comme un compte rendu historique moderne : l’événement reçoit une forme narrative destinée à être mémorisée et transmise.","La mémoire d’Israël fait de la traversée un haut-fait fondateur : la délivrance devient une manière de dire que Dieu sauve son peuple.","La <a href=\"/textes/theologie/boussole/#chronologie\">Boussole biblique</a> distingue volontairement le temps du récit, la mémoire religieuse et les repères historiques."]}]},{"id":"exode-cantique-moise","section":"theologie","bible":true,"cardMeta":"Exode · cantique de victoire","title":"Le cantique de Moïse","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 15,1–18 (extraits)","cardHighlight":"cantique de Moïse","familiarIdea":"le chant de la délivrance","authorMeta":"Bible hébraïque · Pentateuque","themes":["Religion","Liberté"],"work":"Exode 15","publication":"15,1–5.7–8.10–11.13.17–18","description":"Comment la délivrance racontée au chapitre précédent devient-elle un chant de victoire, de salut et de confiance en Dieu ?","context":"Le passage de la mer vient de s’achever. Le récit change alors de registre : Moïse et les fils d’Israël répondent à la délivrance par un cantique. Le document n’en reproduit pas tout le texte, mais plusieurs strophes qui vont de la victoire sur Pharaon à la conduite du peuple vers l’héritage promis.","readingNotes":[{"type":"analysis","term":"Du récit au chant","definition":"Exode 14 et Exode 15 racontent le même événement sous deux formes différentes.","items":["Le récit expose une suite d’actions : la mer s’ouvre, Israël passe, les eaux reviennent.","Le cantique transforme cette succession en louange : il nomme la victoire, le salut, la sainteté et l’amour de Dieu.","La mémoire biblique ne conserve donc pas seulement des faits racontés ; elle les transmet aussi sous une forme poétique et liturgique."]},{"type":"concept","badge":false,"term":"« Je lui dois le salut ! »","definition":"Le chant reprend l’expérience de la délivrance en première personne. Ce qui concernait tout Israël devient aussi une parole que chacun peut prononcer : le salut reçu devient motif de louange."},{"type":"concept","badge":false,"term":"« Qui est comme toi, Seigneur, parmi les dieux »","definition":"La formule affirme l’incomparabilité du Seigneur par la question rhétorique. Elle appartient au langage religieux ancien du cantique : il faut la lire dans ce contexte avant d’en tirer une théorie abstraite sur les autres dieux."},{"type":"concept","badge":false,"term":"« Tu conduis, par ton amour, ce peuple que tu rachetas »","definition":"La délivrance n’est pas seulement une sortie hors du danger. Le chant la prolonge par une conduite : le peuple sauvé doit encore être mené vers un lieu, un héritage et une demeure."},{"type":"prose","term":"Du cantique aux chants liturgiques","definition":"Le document fait ensuite résonner le cantique de Moïse avec plusieurs chants chrétiens contemporains. Cette juxtaposition montre comment un texte ancien continue d’être repris comme langage de délivrance, de confiance et d’espérance, sans confondre pour autant le texte biblique avec ses réemplois liturgiques ultérieurs."}]},{"id":"exode-alliance-sinai","section":"theologie","bible":true,"cardMeta":"Exode · alliance, peuple et théophanie","title":"L’Alliance du Sinaï","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 19,1–11.16–20 ; 24,3.5.7–8","cardHighlight":"L’Alliance du Sinaï","familiarIdea":"l’Alliance conclue au Sinaï","authorMeta":"Bible hébraïque · Pentateuque","themes":["Religion","Liberté"],"work":"Exode 19 et 24","publication":"19,1–11.16–20 ; 24,3.5.7–8","description":"Comment le peuple libéré d’Égypte devient-il un peuple d’Alliance, appelé à écouter, répondre et vivre devant Dieu ?","context":"Après la sortie d’Égypte, le passage de la mer et la marche au désert, Israël arrive au Sinaï. Le récit met en scène une rencontre solennelle : Dieu rappelle la délivrance, appelle le peuple à garder l’Alliance, puis se manifeste dans la nuée, le feu et le tonnerre. Exode 24 montre ensuite l’Alliance ratifiée par la parole, l’obéissance promise et le sang.","readingNotes":[{"type":"analysis","term":"De la délivrance à l’Alliance","definition":"Le texte relie explicitement ce qui vient d’arriver en Égypte à ce qui se joue au Sinaï.","items":["Dieu rappelle d’abord : « Vous avez vu ce que j’ai fait à l’Égypte ». L’Alliance vient après la délivrance, non avant elle.","L’image des « ailes d’un aigle » transforme la sortie d’Égypte en geste de conduite : le peuple a été amené « jusqu’à moi ».","La réponse attendue est ensuite formulée en termes d’écoute et de fidélité : « si vous entendez ma voix et gardez mon Alliance »."]},{"type":"concept","badge":false,"term":"« un royaume de prêtres, une nation sainte »","definition":"L’élection n’est pas seulement un privilège. Le texte donne au peuple une identité et une vocation : appartenir particulièrement à Dieu au sein d’une terre qui, pourtant, lui appartient tout entière."},{"type":"concept","badge":false,"term":"« Tout ce qu’a dit le Seigneur, nous le ferons »","definition":"L’Alliance comporte une réponse humaine. Le peuple ne produit pas l’initiative divine, mais il y répond collectivement par une promesse d’obéissance, reprise encore en Exode 24."},{"type":"concept","badge":false,"term":"Nuée, feu, tonnerre et trompette","definition":"La scène du Sinaï est une <strong>théophanie</strong> : la présence divine est mise en récit par des signes qui manifestent à la fois proximité et distance. Le peuple s’approche, mais des préparatifs et des limites marquent la sainteté de la rencontre."},{"type":"concept","badge":false,"term":"« le sang de l’Alliance »","definition":"En Exode 24, l’Alliance est ratifiée par un rite. Parole entendue, engagement du peuple et sang versé sont rassemblés dans une même scène qui donne à l’Alliance une forme publique et mémorable."},{"type":"prose","term":"Alliance et relectures bibliques","definition":"Les textes placés à la suite dans le document montrent que le Sinaï devient un repère durable : le Deutéronome insiste sur l’Alliance vécue au présent, le psaume sur la fidélité, et l’épître aux Hébreux propose une relecture chrétienne autour de Jésus « médiateur d’une alliance neuve »."}]},{"id":"exode-dix-commandements","section":"theologie","bible":true,"cardMeta":"Exode · le Décalogue au Sinaï","title":"Les Dix Commandements","source":"Livre de l’Exode","sourceTag":"Exode","headerReference":"Exode 20,1–17","cardHighlight":"Les Dix Commandements","familiarIdea":"le Décalogue","authorMeta":"Bible hébraïque · Pentateuque","themes":["Devoir","Justice"],"work":"Exode 20","publication":"20,1–17","description":"Comment les Dix Commandements articulent-ils fidélité à Dieu, respect d’autrui et limitation de la violence, de l’appropriation et du désir ?","context":"Au Sinaï, après la délivrance d’Égypte et l’entrée dans l’Alliance, le texte place une série de paroles fondamentales. Elles commencent par le rappel de la libération — « Je suis le Seigneur ton Dieu, qui t’ai fait sortir du pays d’Égypte » — puis ordonnent la relation à Dieu, au temps, à la famille et au prochain.","readingNotes":[{"type":"concept","badge":false,"term":"« qui t’ai fait sortir du pays d’Égypte »","definition":"La première parole rappelle une délivrance avant d’énoncer les commandements. Dans l’ordre du récit, l’obéissance ne produit donc pas la libération d’Égypte : elle vient après elle et répond à une relation déjà établie."},{"type":"analysis","term":"Deux directions de la Loi","definition":"Le texte articule la relation à Dieu et la relation au prochain sans les séparer.","items":["Les premières paroles concernent les autres dieux, les images, le nom divin et le sabbat.","Les suivantes portent sur les parents, la vie, la fidélité conjugale, les biens, la parole judiciaire et la convoitise.","La fidélité religieuse et la justice entre humains sont ainsi placées dans un même ensemble de paroles."]},{"type":"concept","badge":false,"term":"Le sabbat : une limite posée au travail","definition":"Le septième jour interrompt l’ouvrage non seulement pour le destinataire du commandement, mais aussi pour ses enfants, ses serviteurs, ses bêtes et l’immigré. Le repos reçoit ainsi une portée collective : aucun membre de la maison n’est réduit à une disponibilité productive continue."},{"type":"opposition","left":{"term":"Interdire l’acte","definition":"Meurtre, adultère, vol et faux témoignage désignent des actes qui portent atteinte directement à autrui."},"right":{"term":"Limiter la convoitise","definition":"La dernière parole remonte en amont de l’acte : elle vise le désir d’appropriation de la maison, de la femme et des biens du prochain."},"conclusion":"La Loi ne s’intéresse donc pas seulement aux gestes visibles ; elle atteint aussi la manière dont autrui et ce qui lui appartient peuvent devenir objets de possession."},{"type":"concept","badge":false,"term":"« Tu ne porteras pas de faux témoignage contre ton prochain »","definition":"Le commandement protège la parole comme condition de justice. Dans un monde où le témoignage joue un rôle décisif, mentir contre quelqu’un n’est pas une simple faute privée : cela peut détruire sa position devant la communauté."},{"type":"prose","term":"Décalogue et numérotation","definition":"Les traditions juives et chrétiennes ne découpent pas toujours les « dix paroles » de la même manière. La fiche conserve l’ordre et le texte du document fourni sans imposer une numérotation confessionnelle particulière."}]},{"id":"hesiode-cosmogonie-chaos-gaia-eros","section":"mythologie","cardMeta":"Origine · ordre · monde","title":"Au commencement : Chaos, Gaïa et Éros","author":"Hésiode","authorTag":"Hésiode","cardHighlight":"Chaos, Gaïa et Éros","familiarIdea":"","authorMeta":"VIIIe–VIIe s. av. J.-C. · poésie grecque archaïque","themes":["Nature","Religion"],"work":"Théogonie","publication":"v. 116–127 (extraits), trad. Leconte de Lisle, Alphonse Lemerre, s. d. (1869 ?)","description":"Comment l’ordre du monde peut-il apparaître progressivement ?","context":"Au commencement, le monde n’est pas présenté comme un ensemble déjà ordonné. Khaos, Gaia, le Tartaros et Érôs apparaissent d’abord, puis d’autres puissances naissent les unes des autres. Le récit invite ainsi à penser <strong>l’apparition de l’ordre</strong> : le cosmos se constitue peu à peu par des générations, des séparations et des rapports entre puissances. Zeus n’est pas à l’origine de tout ; il appartient à une histoire divine déjà commencée.","readingNotes":[{"type":"concept","term":"Le monde et les dieux","definition":"Le monde et les dieux ne constituent pas deux histoires séparées : les éléments du cosmos sont eux-mêmes des puissances divines et leur généalogie organise progressivement le réel."},{"type":"opposition","left":{"term":"Créer","definition":"Faire exister le monde à partir d’une volonté qui lui est extérieure."},"right":{"term":"Engendrer","definition":"Faire apparaître de nouvelles puissances par génération à partir de réalités déjà présentes."},"conclusion":"Ici, le monde se déploie surtout par naissance et filiation : l’ordre apparaît progressivement plutôt qu’en un seul geste."},{"type":"analysis","term":"De Khaos à l’ordre","definition":"L’ordre n’est pas le point de départ du récit. Le poème fait émerger peu à peu des régions, des puissances et des générations qui donnent au monde sa structure. Cette progression est une clé de lecture majeure de la mythologie grecque."},{"type":"prose","term":"Avant Zeus","definition":"Zeus n’est pas le créateur initial de tout ce qui existe. Il appartient à une génération beaucoup plus tardive et son règne résultera d’une histoire de successions et de conflits divins."}]},{"id":"hesiode-promethee-vol-feu","section":"mythologie","cardMeta":"Technique · liberté · limites","title":"Prométhée vole le feu aux dieux","author":"Hésiode","authorTag":"Hésiode","cardHighlight":"vole le feu aux dieux","familiarIdea":"","authorMeta":"VIIIe–VIIe s. av. J.-C. · poésie grecque archaïque","themes":["Technique","Liberté"],"work":"Les Travaux et les Jours","publication":"v. 42–58 (extrait), trad. Anne Bignan, éd. Ernest Falconnet, Desrez, 1838","description":"La technique nous libère-t-elle, ou nous donne-t-elle un pouvoir difficile à maîtriser ?","context":"Prométhée dérobe le feu que Zeus avait caché aux humains. Ce feu représente plus qu’un moyen de se chauffer : il permet de cuire, fabriquer, transformer et maîtriser davantage le milieu. Le mythe relie ainsi <strong>puissance technique et transgression</strong> : acquérir de nouvelles capacités libère de certaines contraintes, mais pose aussitôt la question des limites et de l’usage de cette puissance.","readingNotes":[{"type":"concept","term":"Transformer le monde","definition":"Le feu permet de cuire, transformer, forger et fabriquer. Le mythe condense ainsi dans un objet ce qui distingue une humanité capable de modifier son milieu plutôt que de seulement s’y adapter."},{"type":"opposition","left":{"term":"Bienfait","definition":"Prométhée rend aux mortels une puissance dont ils étaient privés."},"right":{"term":"Transgression","definition":"Cette puissance est obtenue contre la volonté de Zeus et par tromperie."},"conclusion":"La même action peut donc être lue comme bienfait du point de vue humain et comme transgression du point de vue de l’ordre divin."},{"type":"analysis","term":"Une puissance ambivalente","definition":"La technique peut libérer de certaines contraintes tout en créant de nouveaux risques. Le problème n’est donc pas seulement de pouvoir agir, mais de savoir jusqu’où et comment utiliser cette puissance."}]},{"id":"hesiode-pandore-maux-esperance","section":"mythologie","cardMeta":"Mal · espérance · condition humaine","title":"Pandore ouvre la jarre des maux","author":"Hésiode","authorTag":"Hésiode","cardHighlight":"la jarre des maux","familiarIdea":"","authorMeta":"VIIIe–VIIe s. av. J.-C. · poésie grecque archaïque","themes":["Travail","Religion"],"work":"Les Travaux et les Jours","publication":"v. 90–105 (extrait), trad. Henri Patin, Garnier Frères, 1892","description":"Pourquoi l’existence humaine est-elle marquée par la souffrance, et quel rôle reste-t-il à l’espérance ?","context":"Pandore est envoyée après le vol du feu par Prométhée. Quand la jarre est ouverte, le travail pénible, les maladies et les souffrances se répandent parmi les humains. Le mythe cherche ainsi à donner une origine à la <strong>fragilité de la condition humaine</strong>. Mais l’Espérance reste dans la jarre : est-elle préservée comme un dernier secours, ou retenue à distance des humains ? Le récit laisse cette question ouverte.","readingNotes":[{"type":"concept","term":"Un cadeau empoisonné","definition":"Zeus ne frappe pas directement les humains : il leur envoie quelque chose de séduisant qu’ils accueillent eux-mêmes. Le mythe donne ainsi à la catastrophe la forme paradoxale d’un présent désiré."},{"type":"opposition","left":{"term":"Avant le vase","definition":"Les hommes sont décrits comme exempts de souffrances, de pénible travail et de maladies."},"right":{"term":"Après le vase","definition":"Les maux se répandent sur terre et sur mer et deviennent constitutifs de l’existence mortelle."},"conclusion":"Le récit explique mythiquement pourquoi la condition humaine est marquée par l’effort, la vulnérabilité et la souffrance."},{"type":"analysis","term":"Que signifie l’Espérance ?","definition":"Le texte dit qu’elle reste dans le vase mais ne tranche pas explicitement sa valeur. Est-elle conservée pour les humains comme ultime ressource, ou enfermée et donc partiellement refusée ? Cette indétermination rend le passage philosophiquement riche."},{"type":"prose","term":"Une représentation ancienne des femmes","definition":"Le récit associe la première femme à l’arrivée du malheur et reprend des représentations misogynes propres à son contexte archaïque. Une lecture contemporaine doit les identifier comme un trait historique du texte, et non les reconduire comme une vérité sur les femmes."}]},{"id":"ovide-deucalion-pyrrha-deluge","section":"mythologie","cardMeta":"Justice · catastrophe · recommencement","title":"Deucalion et Pyrrha après le Déluge","author":"Ovide","authorTag":"Ovide","cardHighlight":"après le Déluge","familiarIdea":"","authorMeta":"43 av. J.-C.–17 apr. J.-C. · poésie latine","themes":["Justice","Religion"],"work":"Métamorphoses, livre I","publication":"trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extraits)","description":"Une catastrophe peut-elle être à la fois une punition et un nouveau commencement ?","context":"Une humanité jugée corrompue est détruite par un déluge. Deucalion et Pyrrha survivent parce qu’ils sont présentés comme justes et respectueux des dieux. Pour faire renaître l’humanité, ils doivent ensuite <strong>interpréter un oracle</strong> : la Terre est leur « aïeule » et ses pierres sont ses « os ». Le récit associe ainsi justice, compréhension et recommencement : survivre ne suffit pas, il faut encore comprendre comment reconstruire un monde humain.","readingNotes":[{"type":"concept","term":"Survivre pour recommencer","definition":"Le récit oppose la destruction collective à la survie de deux figures caractérisées par la justice et la piété. Le recommencement de l’humanité se fait donc à partir d’un modèle moral."},{"type":"analysis","term":"Comprendre l’oracle","definition":"Pris à la lettre, l’ordre de jeter les os d’une aïeule paraît impie. Deucalion doit déplacer le sens des mots : l’aïeule est la Terre et ses os sont les pierres. Le salut passe ainsi par une véritable opération d’interprétation."},{"type":"concept","term":"Une humanité née de la terre","definition":"La nouvelle humanité n’est pas créée à partir de rien : elle sort de la matière même du sol. Ovide explique ainsi symboliquement sa dureté et sa capacité au labeur par son origine minérale."},{"type":"prose","term":"Deux récits du Déluge","definition":"On retrouve un jugement, une catastrophe aquatique, des survivants et un nouveau départ. Mais la scène biblique repose sur Noé, l’arche, l’alliance et la promesse divine ; Ovide met au centre l’oracle, la métamorphose des pierres et une tout autre représentation du divin."}]},{"id":"sophocle-oedipe-verite-destin","section":"mythologie","cardMeta":"Vérité · liberté · responsabilité","title":"Œdipe découvre qui il est","author":"Sophocle","authorTag":"Sophocle","cardHighlight":"découvre qui il est","familiarIdea":"","authorMeta":"v. 496–406 av. J.-C. · tragédie grecque","themes":["Vérité","Liberté"],"work":"Œdipe roi","publication":"trad. Leconte de Lisle, Alphonse Lemerre, 1877, scène de la reconnaissance (extrait)","description":"Sommes-nous responsables de nos actes quand nous ignorons des éléments essentiels de la situation ?","context":"Œdipe cherche la cause du mal qui frappe Thèbes. Son enquête le conduit peu à peu vers sa propre histoire : l’homme qu’il a tué était son père, et la femme qu’il a épousée est sa mère. Il a donc accompli l’oracle sans savoir qui étaient réellement les personnes concernées. Le passage met face à face <strong>vérité, ignorance, liberté et responsabilité</strong> : peut-on répondre de ses actes lorsqu’on en ignore une part décisive ?","readingNotes":[{"type":"concept","term":"La vérité contre soi-même","definition":"Œdipe est celui qui mène l’enquête et qui refuse finalement l’ignorance. Sa grandeur tragique tient aussi à ceci : la vérité qu’il exige est celle qui détruit son identité sociale, familiale et politique."},{"type":"opposition","left":{"term":"Ignorance","definition":"Œdipe agit sans savoir que l’homme tué est son père ni que la femme épousée est sa mère."},"right":{"term":"Responsabilité","definition":"Les actes ont pourtant bien été accomplis par lui et produisent des conséquences réelles."},"conclusion":"La tragédie empêche une réponse trop simple : elle dissocie connaissance, intention, action et responsabilité."},{"type":"analysis","term":"Choisir sans tout savoir","definition":"Œdipe n’est ni un automate sans volonté ni un individu souverain maîtrisant tout. Il décide, enquête, se met en colère et agit dans un monde où il ignore des données décisives de sa propre histoire. C’est cette combinaison de choix et de nécessité qui fait la force philosophique du mythe."},{"type":"prose","term":"Œdipe avant Freud","definition":"Le « complexe d’Œdipe » est une réutilisation moderne du mythe. La tragédie de Sophocle est bien antérieure à la psychanalyse et porte d’abord sur la vérité, l’identité, l’oracle, la faute, la cité et les limites de la connaissance humaine."}]},{"id":"homere-ulysse-sirenes-maitrise-desir","section":"mythologie","cardMeta":"Désir · maîtrise de soi · liberté","title":"Ulysse résiste au chant des Sirènes","author":"Homère","authorTag":"Homère","cardHighlight":"chant des Sirènes","familiarIdea":"","authorMeta":"VIIIe s. av. J.-C. · épopée grecque","themes":["Liberté","Désir"],"work":"Odyssée, chant XII","publication":"trad. Eugène Bareste, Lavigne, 1842 (extrait)","description":"Être libre, est-ce suivre son désir ou savoir se protéger de soi-même ?","context":"Ulysse veut entendre le chant des Sirènes, tout en sachant que celui qui s’y abandonne ne revient pas. Il organise donc à l’avance sa propre résistance : ses compagnons ont les oreilles bouchées, tandis que lui est attaché au mât et leur ordonne de ne pas le libérer, même s’il le demande ensuite. Le mythe fait ainsi apparaître une forme paradoxale de <strong>liberté par la contrainte</strong> : Ulysse se lie volontairement pour empêcher un désir futur de détruire le projet qu’il a choisi.","readingNotes":[{"type":"concept","term":"Se contraindre pour rester libre","definition":"Ulysse ne compte pas sur sa seule volonté au moment de la tentation. Il modifie à l’avance la situation afin que son désir ne puisse pas décider à sa place."},{"type":"opposition","left":{"term":"Volonté présente","definition":"Ulysse veut poursuivre son retour et choisit lucidement les moyens de résister."},"right":{"term":"Désir futur","definition":"Sous l’effet du chant, il voudra être détaché et abandonner la décision prise auparavant."},"conclusion":"Le passage pose une question centrale de la liberté : quelle volonté doit compter lorsque nous savons que nos désirs peuvent changer ?"},{"type":"analysis","term":"Une tentation de connaissance","definition":"Les Sirènes ne promettent pas seulement du plaisir : elles affirment tout savoir. Le danger vient donc aussi du désir de connaître sans limite, lorsqu’il détourne l’individu de sa vie et de son but."}]},{"id":"ovide-icare-voler-trop-haut","section":"mythologie","cardMeta":"Technique · mesure · responsabilité","title":"Icare vole trop près du Soleil","author":"Ovide","authorTag":"Ovide","cardHighlight":"trop près du Soleil","familiarIdea":"","authorMeta":"43 av. J.-C.–17 apr. J.-C. · poésie latine","themes":["Technique","Liberté"],"work":"Métamorphoses, livre VIII","publication":"trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)","description":"Une puissance nouvelle vaut-elle sans la capacité d’en maîtriser les limites ?","context":"Dédale réussit à accomplir ce qui semblait impossible : fabriquer des ailes et ouvrir une route dans les airs. Mais l’invention ne suffit pas. Il faut encore apprendre à l’utiliser et respecter les conditions qui la rendent possible. Icare, emporté par le plaisir du vol, quitte la trajectoire indiquée par son père. Le mythe permet ainsi de distinguer <strong>pouvoir faire</strong> et <strong>savoir faire</strong> : une technique accroît notre liberté, mais elle exige aussi mesure, apprentissage et responsabilité.","readingNotes":[{"type":"concept","term":"Inventer ne suffit pas","definition":"Dédale ne transmet pas seulement un objet technique : il enseigne une manière de s’en servir. La maîtrise d’une technique suppose donc des règles, un apprentissage et une attention aux conséquences."},{"type":"opposition","left":{"term":"Pouvoir voler","definition":"Les ailes rendent possible une action auparavant inaccessible aux humains."},"right":{"term":"Savoir voler","definition":"Le succès dépend d’un usage mesuré qui tient compte de la mer, du Soleil et de la fragilité des ailes."},"conclusion":"L’augmentation de la puissance ne supprime pas les limites : elle rend leur compréhension plus décisive."},{"type":"analysis","term":"Le plaisir de dépasser la limite","definition":"Icare ne tombe pas par ignorance totale : il a reçu l’avertissement de son père. Le récit montre comment l’ivresse d’une capacité nouvelle peut faire oublier la règle même qui la rend possible."}]},{"id":"ovide-narcisse-reflet-desir-identite","section":"mythologie","cardMeta":"Image · désir · identité","title":"Narcisse tombe amoureux de son reflet","author":"Ovide","authorTag":"Ovide","cardHighlight":"amoureux de son reflet","familiarIdea":"","authorMeta":"43 av. J.-C.–17 apr. J.-C. · poésie latine","themes":["Conscience","Désir"],"work":"Métamorphoses, livre III","publication":"trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)","description":"Peut-on se connaître lorsque l’on confond son image avec un autre ?","context":"Narcisse aperçoit son reflet dans une eau parfaitement calme sans comprendre d’abord qu’il se regarde lui-même. Il transforme une image sans consistance en objet de désir et cherche à saisir ce qui disparaît dès qu’il tente de l’atteindre. Le mythe permet de distinguer <strong>se voir</strong> et <strong>se connaître</strong> : une image de soi peut fasciner tout en empêchant de comprendre ce qu’elle représente réellement.","readingNotes":[{"type":"concept","term":"Prendre une image pour une présence","definition":"Narcisse donne mentalement un corps à ce qui n’est qu’un reflet. Son désir naît donc d’une erreur sur le statut de ce qu’il voit."},{"type":"opposition","left":{"term":"Se voir","definition":"Percevoir son apparence comme un objet visible."},"right":{"term":"Se connaître","definition":"Reconnaître que cette apparence est la sienne et comprendre la relation entre soi et son image."},"conclusion":"Le mythe montre que la visibilité de soi ne garantit pas la connaissance de soi."},{"type":"analysis","term":"Un désir sans véritable autre","definition":"Le reflet imite chaque geste de Narcisse mais ne peut lui répondre comme une personne indépendante. Le désir tourne alors en circuit fermé : il cherche une altérité qui n’existe pas."}]},{"id":"ovide-orphee-eurydice-regard-interdit","section":"mythologie","cardMeta":"Art · amour · mort","title":"Orphée se retourne vers Eurydice","author":"Ovide","authorTag":"Ovide","cardHighlight":"se retourne vers Eurydice","familiarIdea":"","authorMeta":"43 av. J.-C.–17 apr. J.-C. · poésie latine","themes":["Art","Amour"],"work":"Métamorphoses, livre X","publication":"trad. collective, texte établi par Désiré Nisard, Firmin-Didot, 1850 (extrait)","description":"L’art peut-il vaincre la mort, et pourquoi l’amour échoue-t-il au moment de retrouver ce qu’il a perdu ?","context":"Par son chant, Orphée réussit à émouvoir le monde des morts et obtient le retour d’Eurydice. Une seule condition lui est imposée : ne pas la regarder avant d’avoir quitté les Enfers. Presque arrivé au terme, il se retourne par inquiétude et par désir de la voir. Le mythe donne ainsi à l’art un pouvoir immense, mais non absolu : il peut <strong>suspendre l’ordre ordinaire</strong>, sans supprimer la mort ni la fragilité du désir humain.","readingNotes":[{"type":"concept","term":"Le pouvoir de l’art","definition":"Le chant d’Orphée accomplit ce que la force ne pourrait obtenir : il émeut les puissances des Enfers. L’art apparaît comme une puissance capable de transformer les dispositions de ceux qui l’entendent."},{"type":"opposition","left":{"term":"Faire confiance","definition":"Continuer d’avancer sans disposer de la preuve visible qu’Eurydice suit réellement."},"right":{"term":"Vérifier","definition":"Se retourner pour rendre sa présence certaine, au risque de rompre la condition qui permet son retour."},"conclusion":"Le regard qui veut s’assurer de la présence de l’autre provoque précisément sa perte."},{"type":"analysis","term":"Une victoire incomplète sur la mort","definition":"Orphée obtient une exception, non l’abolition de la mortalité. Le mythe affirme à la fois la puissance de l’art et une limite qu’il ne peut définitivement franchir."}]},{"id":"eschyle-oreste-tribunal-justice","section":"mythologie","cardMeta":"Justice · vengeance · institution","title":"Oreste : de la vengeance au tribunal","author":"Eschyle","authorTag":"Eschyle","cardHighlight":"de la vengeance au tribunal","familiarIdea":"","authorMeta":"v. 525–456 av. J.-C. · tragédie grecque","themes":["Justice","État"],"work":"Les Euménides","publication":"458 av. J.-C., trad. Leconte de Lisle, A. Lemerre, 1872 (extrait)","description":"Comment sortir du cycle de la vengeance sans renoncer à juger les crimes ?","context":"Oreste a tué sa mère Clytemnestre pour venger le meurtre de son père Agamemnon. Les Érinyes le poursuivent au nom du sang versé et réclament à leur tour vengeance. À Athènes, Athéna transforme ce conflit en <strong>affaire à juger</strong> : elle institue des juges liés par serment et une procédure appelée à durer au-delà du cas d’Oreste. Le mythe permet ainsi de penser le passage de la vengeance privée à une justice commune et institutionnelle.","readingNotes":[{"type":"concept","term":"De la vengeance au jugement","definition":"La vengeance est exercée directement au nom d’un tort subi ; le jugement introduit un tiers, des preuves, une procédure et une décision qui ne dépend plus seulement des parties en conflit."},{"type":"opposition","left":{"term":"Vengeance","definition":"Répondre au sang versé par un nouveau sang versé, au risque de relancer indéfiniment le conflit."},"right":{"term":"Justice instituée","definition":"Confier le différend à des juges qui doivent entendre les parties et décider selon une procédure commune."},"conclusion":"Le passage ne supprime pas la nécessité de répondre au crime ; il transforme la manière dont cette réponse est produite."},{"type":"analysis","term":"Une règle qui dépasse Oreste","definition":"Athéna ne règle pas seulement un cas particulier : elle fonde un tribunal pour « tous les temps à venir ». L’institution rend la justice moins dépendante des personnes et des passions du moment."}]},{"id":"platon-caverne-apparence-verite","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Vérité · apparence · éducation","title":"La caverne : sortir des apparences","author":"Platon","authorTag":"Platon","cardHighlight":"sortir des apparences","familiarIdea":"l’allégorie de la caverne","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["Vérité","Raison"],"work":"La République, livre VII","publication":"514a–517a, trad. Victor Cousin, 1834 (extrait)","description":"Comment savoir si ce que nous tenons pour réel n’est qu’une apparence ?","context":"Des prisonniers n’ont jamais vu que des ombres et les prennent pour la réalité. L’un d’eux est libéré : ce qui est plus vrai lui paraît d’abord moins évident, parce que ses yeux et son esprit sont habitués à l’ancien monde. La connaissance apparaît alors comme une <strong>conversion difficile du regard</strong>, et l’éducation non comme l’accumulation d’informations mais comme un déplacement hors de ce qui semblait aller de soi.","readingNotes":[{"type":"opposition","left":{"term":"Apparence","definition":"Ce qui se présente immédiatement aux prisonniers et leur paraît évident."},"right":{"term":"Réalité","definition":"Ce qui demande une transformation du regard pour être reconnu comme plus vrai."},"conclusion":"Le texte montre que l’évidence subjective ne suffit pas à garantir la vérité."},{"type":"analysis","term":"Apprendre peut faire perdre ses certitudes","definition":"Le prisonnier libéré commence par préférer les ombres qu’il connaît. La connaissance n’est donc pas toujours vécue comme une délivrance immédiate : elle peut d’abord désorienter."},{"type":"analysis","term":"Pourquoi redescendre ?","definition":"Celui qui a accédé à une connaissance plus haute ne doit pas seulement contempler le vrai pour lui-même. Le retour dans la caverne pose la question de la responsabilité du philosophe envers la cité."}]},{"id":"platon-mythe-er-choix-vie","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Liberté · choix · responsabilité","title":"Le mythe d’Er : choisir sa vie","author":"Platon","authorTag":"Platon","cardHighlight":"choisir sa vie","familiarIdea":"le mythe d’Er","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["Liberté","Justice"],"work":"La République, livre X","publication":"617d–620d, trad. Victor Cousin, 1834 (extrait)","description":"Sommes-nous responsables de la vie que nous choisissons, même lorsque le hasard fixe les conditions du choix ?","context":"À la fin de <em>La République</em>, Er rapporte ce qu’il aurait vu après sa mort. Les âmes doivent choisir une nouvelle existence parmi de nombreux genres de vie. Le hasard décide de l’ordre dans lequel elles choisissent, mais non de leur décision : chacune demeure <strong>responsable de son choix</strong>. Le mythe relie ainsi liberté, expérience, caractère et apprentissage de la justice.","readingNotes":[{"type":"opposition","left":{"term":"Hasard","definition":"Le sort détermine l’ordre dans lequel les âmes choisissent."},"right":{"term":"Responsabilité","definition":"Le rang reçu n’impose aucune existence particulière : l’âme doit discerner et choisir."},"conclusion":"Le mythe ne supprime pas la contingence, mais refuse d’en faire une excuse qui annulerait toute responsabilité."},{"type":"analysis","term":"Savoir choisir","definition":"Toutes les vies disponibles ne se valent pas. La véritable épreuve consiste à reconnaître celle qui rendra l’âme plus juste plutôt qu’à se laisser éblouir par le pouvoir ou la richesse."},{"type":"analysis","term":"L’habitude ne suffit pas","definition":"L’âme qui choisit la tyrannie avait auparavant vécu correctement par habitude. Platon oppose ainsi une vertu simplement acquise par conformisme à une capacité réfléchie de discerner le bien."}]},{"id":"platon-attelage-aile-ame-desirs","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Âme · désir · maîtrise de soi","title":"L’attelage ailé : gouverner ses désirs","author":"Platon","authorTag":"Platon","cardHighlight":"gouverner ses désirs","familiarIdea":"l’attelage ailé","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["Désir","Raison"],"work":"Phèdre","publication":"246a–246b ; 253d–256b, trad. Victor Cousin, 1831 (extrait)","description":"Être maître de soi, est-ce supprimer ses désirs ou apprendre à les gouverner ?","context":"Platon compare l’âme humaine à un attelage conduit par un cocher. L’un des chevaux se laisse guider par l’honneur et la mesure ; l’autre tire vers la satisfaction immédiate. L’image ne présente donc pas l’être humain comme une volonté simple : nous sommes traversés par des forces différentes qu’il faut <strong>ordonner plutôt que nier</strong>.","readingNotes":[{"type":"opposition","left":{"term":"Cheval docile","definition":"Il répond à la retenue, à l’honneur et à la voix du cocher."},"right":{"term":"Cheval indocile","definition":"Il pousse avec violence vers l’objet désiré et résiste à la direction commune."},"conclusion":"Le conflit moral est représenté comme une tension interne à une même âme."},{"type":"analysis","term":"Gouverner plutôt que supprimer","definition":"Le cocher ne peut avancer sans chevaux. L’image suggère donc que la raison n’agit pas dans le vide : elle doit orienter des forces désirantes indispensables au mouvement de l’âme."},{"type":"analysis","term":"Une liberté intérieure","definition":"La maîtrise de soi n’est pas l’absence de conflit mais la capacité à empêcher une tendance particulière de prendre seule le contrôle de l’ensemble."}]},{"id":"platon-theuth-ecriture-memoire","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Technique · mémoire · savoir","title":"Theuth : l’écriture aide-t-elle vraiment à penser ?","author":"Platon","authorTag":"Platon","cardHighlight":"l’écriture aide-t-elle à penser ?","familiarIdea":"le mythe de Theuth","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["Technique","Langage"],"work":"Phèdre","publication":"274c–275d, trad. Victor Cousin, 1831 (extrait)","description":"Une technique qui conserve nos connaissances peut-elle aussi affaiblir notre capacité à penser par nous-mêmes ?","context":"Theuth présente l’écriture comme une invention qui rendra les hommes plus savants et soulagera leur mémoire. Le roi Thamus renverse ce diagnostic : confier le souvenir à des signes extérieurs peut produire de l’oubli et donner <strong>l’apparence du savoir sans le savoir lui-même</strong>. Le mythe pose ainsi une question générale sur les technologies intellectuelles : leurs effets réels peuvent différer des intentions de leurs inventeurs.","readingNotes":[{"type":"opposition","left":{"term":"Promesse technique","definition":"L’écriture doit augmenter le savoir et soutenir la mémoire."},"right":{"term":"Effet possible","definition":"Elle peut inciter à externaliser la mémoire et donner une confiance excessive dans des connaissances seulement consultées."},"conclusion":"L’inventeur ne maîtrise pas nécessairement les conséquences de son invention."},{"type":"analysis","term":"Information ou connaissance ?","definition":"Lire beaucoup de choses ne garantit pas qu’on sache les expliquer, les défendre ou les relier. Platon distingue ainsi l’accès à des contenus et l’appropriation véritable d’un savoir."},{"type":"analysis","term":"Une critique de l’écriture écrite par Platon","definition":"Le paradoxe est volontairement fécond : le texte n’exige pas l’abandon de l’écriture, mais oblige à réfléchir à ce qu’elle peut et ne peut pas faire à la place d’un dialogue vivant et d’un travail de pensée."}]},{"id":"platon-promethee-epimethee-naissance-politique","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Nature · technique · politique","title":"Prométhée et Épiméthée : pourquoi les hommes ont besoin de la politique","author":"Platon","authorTag":"Platon","cardHighlight":"besoin de la politique","familiarIdea":"le mythe de Prométhée et Épiméthée","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["Technique","État"],"work":"Protagoras","publication":"320c–322d, trad. Victor Cousin, 1826 (extrait)","description":"La technique suffit-elle pour permettre aux êtres humains de vivre ensemble ?","context":"Épiméthée distribue aux animaux leurs capacités naturelles mais oublie l’être humain, qui reste nu et sans défense. Prométhée compense ce manque en lui donnant le feu et les techniques. Pourtant cela ne suffit toujours pas : les hommes savent survivre, mais pas <strong>vivre ensemble</strong>. Le récit fait ainsi de la politique et de la justice une nécessité distincte de la simple puissance technique.","readingNotes":[{"type":"opposition","left":{"term":"Technique","definition":"Elle permet aux hommes de fabriquer, se vêtir, se nourrir et mieux résister à leur environnement."},"right":{"term":"Politique","definition":"Elle rend possible une coexistence durable en empêchant les hommes réunis de se détruire mutuellement."},"conclusion":"Savoir transformer le monde ne suffit pas à savoir habiter un monde commun."},{"type":"analysis","term":"L’être humain comme être inachevé","definition":"Contrairement aux animaux pourvus de protections naturelles spécialisées, l’homme apparaît démuni. Sa survie dépend de capacités acquises et transmises plutôt que d’un équipement biologique suffisant."},{"type":"analysis","term":"Pourquoi tous doivent participer à la justice","definition":"Un art spécialisé peut être exercé par quelques-uns pour le bénéfice des autres. La cité, elle, ne peut exister si seuls quelques individus sont capables de respecter les conditions élémentaires de la vie commune."}]},{"id":"platon-atlantide-puissance-demesure","section":"philosophie","sections":["philosophie","mythologie"],"cardMeta":"Puissance · richesse · mesure","title":"L’Atlantide : quand la puissance corrompt","author":"Platon","authorTag":"Platon","cardHighlight":"quand la puissance corrompt","familiarIdea":"l’Atlantide","authorMeta":"v. 427–347 av. J.-C. · philosophie antique","themes":["État","Justice"],"work":"Critias","publication":"120d–121c, trad. Victor Cousin, 1840 (extrait)","description":"Une cité peut-elle rester juste lorsqu’elle devient riche, puissante et incapable de se limiter ?","context":"Le récit de l’Atlantide ne se réduit pas à la disparition spectaculaire d’une île. Platon décrit une civilisation d’abord gouvernée avec mesure, puis progressivement dominée par le désir d’accroître sa richesse et sa puissance. Sa chute prend ainsi une signification politique : la prospérité devient dangereuse lorsqu’elle fait perdre <strong>la maîtrise de soi et le sens de la justice</strong>.","readingNotes":[{"type":"opposition","left":{"term":"Posséder des richesses","definition":"Les biens matériels peuvent être présents sans déterminer la valeur de la cité."},"right":{"term":"Être possédé par elles","definition":"La richesse devient corruptrice lorsqu’elle commande les désirs, les décisions et l’expansion politique."},"conclusion":"Le problème n’est pas l’existence de la puissance mais l’incapacité à lui imposer une mesure."},{"type":"analysis","term":"La prospérité comme épreuve","definition":"Le texte inverse une intuition courante : le succès peut être plus difficile à supporter moralement que le manque, parce qu’il donne les moyens d’étendre sans limite ce que l’on désire."},{"type":"analysis","term":"Grandeur apparente, misère réelle","definition":"Ceux qui jugent seulement par la richesse croient l’Atlantide au sommet au moment même où elle dégénère. Platon oppose ainsi puissance visible et qualité véritable d’un ordre politique."}]}].filter(Boolean);


  // BEGIN HLP 2026 SELECTED TEXTS — merged into main(2)
  const SELECTED_HLP_TEXTS_2026 = [
  {
    "id": "ciceron-verrines-sthenius",
    "section": "autres",
    "cardMeta": "HLP · L’art de la parole",
    "title": "Transformer une injustice en accusation publique",
    "author": "Cicéron",
    "authorTag": "Cicéron",
    "authorMeta": "(106–43 av. J.-C.) · éloquence romaine",
    "themes": [
      "Langage",
      "Justice"
    ],
    "work": "Verrines — Seconde action, livre II",
    "publication": "70 av. J.-C., trad. Charles du Rozoir, Panckoucke, 1830, livre II, XXXIV",
    "description": "À partir du cas de Sthénius, Cicéron rend sensible l’arbitraire de Verrès et transforme un fait particulier en pièce d’accusation.",
    "context": "Dans la seconde action contre Verrès, Cicéron rassemble des faits destinés à établir les abus de l’ancien gouverneur de Sicile. L’épisode de Sthénius montre comment l’orateur choisit un cas concret, caractérise la victime et l’accusé, puis fait de ce récit une preuve adressée aux juges.",
    "readingQuestions": [
      "Pourquoi Cicéron commence-t-il par présenter la personne de Sthénius avant de raconter les actes de Verrès ?",
      "Comment le récit transforme-t-il un conflit particulier en accusation contre l’exercice arbitraire du pouvoir ?",
      "En quoi cet extrait montre-t-il que l’éloquence judiciaire agit à la fois par les faits et par la manière de les mettre en scène ?"
    ],
    "glossary": [
      {
        "term": "réquisitoire",
        "definition": "Discours d’accusation qui rassemble des faits et des arguments afin d’obtenir la condamnation d’un accusé."
      },
      {
        "term": "préteur",
        "definition": "Magistrat romain exerçant notamment des fonctions judiciaires et, dans les provinces, des pouvoirs administratifs."
      }
    ],
    "paragraphs": [
      "Sthenius, qui est assis près de nous, est un habitant de Thermes, très connu jadis par sa rare vertu et par sa haute naissance, plus encore aujourd’hui par son désastre et par l’injustice éclatante de son persécuteur. Verrès, malgré l’hospitalité qu’il avait reçue de lui, non-seulement dans plusieurs voyages, mais durant un assez long séjour, avait enlevé de la maison de Sthenius, à Thermes, tout ce qui pouvait fixer l’attention et charmer les regards.",
      "Sthenius, on le sait, dès sa première jeunesse, avait, trop curieusement peut-être, rassemblé des meubles artistement travaillés en airain, à Délos et à Corinthe, des tableaux et même de la vaisselle d’argent assez belle, sans doute, pour un homme qui ne pouvait avoir que la fortune d’un Thermitain.",
      "Voyageant donc fort jeune en Asie, il s’était fait un plaisir, comme je l’ai dit, de faire ces acquisitions, moins pour son agrément particulier, que pour recevoir d’une manière plus honorable ceux de nos Romains qui pouvaient être invités, ou se présenter chez lui à titre d’hôtes ou d’amis. Verrès enleva tout, en empruntant, en demandant, ou en dérobant ; et Sthenius contint du mieux qu’il put son déplaisir.",
      "Notre homme emporté par la manie que vous lui connaissez, et que personne n’ignore, avait vu dans la place de Thermes quelques belles statues antiques ; il pria Sthenius de lui aider à les enlever. Sthenius non-seulement lui refusa un tel service, mais lui déclara qu’il était impossible que ces antiques statues, monumens de Scipion l’Africain, fussent enlevées de Thermes tant que cette ville subsisterait, et que l’autorité du peuple romain serait respectée."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Contre_Verr%C3%A8s_%28Rozoir%29/Seconde_Action_%E2%80%94_Second_Discours",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Mettre les faits en scène",
        "definition": "Cicéron n’énumère pas seulement des actes : il construit le contraste entre l’hospitalité de Sthénius et la rapacité de Verrès afin de rendre l’injustice immédiatement perceptible."
      },
      {
        "type": "plain",
        "definition": "Le passage est utile pour distinguer démontrer et persuader : les faits sont essentiels, mais leur ordre, les portraits et les oppositions leur donnent une force oratoire."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "rhétorique",
        "éloquence judiciaire",
        "réquisitoire",
        "mise en scène des faits"
      ]
    },
    "relatedTexts": [
      {
        "id": "voltaire-calas-sirven-plaidoyer",
        "kind": "proche",
        "label": "Voltaire — Transformer une affaire judiciaire en cause publique",
        "relation": "Voltaire, comme Cicéron, part d’un cas particulier pour dénoncer une injustice qui dépasse les seuls individus concernés."
      },
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — Faire passer une assemblée de l’écoute à l’action",
        "relation": "Cicéron agit sur des juges par l’accusation ; Démosthène agit sur des citoyens par l’exhortation."
      }
    ]
  },
  {
    "id": "tacite-dialogue-orateurs-formation",
    "section": "autres",
    "cardMeta": "HLP · L’art de la parole",
    "title": "On apprend à parler en assistant aux combats de la parole",
    "author": "Tacite",
    "authorTag": "Tacite",
    "authorMeta": "(v. 58–120) · historien latin",
    "themes": [
      "Langage",
      "Raison"
    ],
    "work": "Dialogue des orateurs",
    "publication": "Ier–IIe siècle, chap. XXXIV, trad. Jean-Louis Burnouf, Hachette, 1863",
    "description": "Tacite présente la formation de l’orateur comme un apprentissage vivant : observer, écouter, imiter, puis affronter de véritables situations publiques.",
    "context": "Dans le <em>Dialogue sur les orateurs</em>, plusieurs interlocuteurs s’interrogent sur le déclin de l’éloquence. Messala oppose ici l’ancienne formation, reçue au Forum auprès d’orateurs expérimentés, à un enseignement scolaire plus artificiel.",
    "readingQuestions": [
      "Pourquoi Tacite compare-t-il l’apprentissage de l’éloquence à un apprentissage de la guerre sur le champ de bataille ?",
      "Quels rôles jouent l’observation, l’imitation et le jugement du public dans la formation de l’orateur ?",
      "Quelle conception du savoir ce texte oppose-t-il à un enseignement purement théorique ?"
    ],
    "glossary": [
      {
        "term": "Forum",
        "definition": "Centre de la vie civique romaine, où se déroulent notamment procès, discours et assemblées."
      },
      {
        "term": "harangue",
        "definition": "Discours public destiné à convaincre ou à exhorter une assemblée."
      }
    ],
    "paragraphs": [
      "Anciennement donc, le jeune homme qui se destinait aux travaux du Forum et à l’art oratoire, formé déjà par l’éducation domestique et nourri des plus belles études, était conduit par son père ou ses proches à l’orateur qui tenait alors le rang le plus distingué.",
      "Il fréquentait sa maison, accompagnait sa personne, assistait à tous ses discours, soit devant les juges, soit à la tribune aux harangues, également témoin de l’attaque et de la réplique, présent aux luttes animées de la parole, et apprenant, pour ainsi dire, la guerre sur le champ de bataille.",
      "De là résultait pour les jeunes gens une expérience précoce, beaucoup d’assurance, une grande finesse de tact, étudiant, comme ils faisaient, à la face du jour et sur un théâtre orageux, où il ne pouvait échapper une sottise ou une contradiction qui ne fût repoussée par les juges, relevée par l’adversaire, condamnée même par les amis de l’orateur.",
      "Aussi prenaient-ils de bonne heure le goût d’une éloquence naturelle et vraie ; et, quoiqu’ils ne suivissent qu’un seul patron, ils faisaient connaissance, dans une foule de causes et devant des tribunaux divers, avec tous les talents contemporains ; et ils entendaient encore les jugements si variés de l’opinion publique, qui les avertissait clairement de ce qu’on trouvait dans chacun à louer ou à reprendre."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Dialogue_sur_les_orateurs",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "opposition",
        "left": {
          "term": "Théorie seule",
          "definition": "Apprendre des règles sans être confronté aux effets réels d’un discours."
        },
        "right": {
          "term": "Pratique publique",
          "definition": "Observer les débats, les réactions et les erreurs dans des situations où la parole a des conséquences."
        },
        "conclusion": "Pour Tacite, la maîtrise de la parole naît d’un va-et-vient entre culture, observation et exercice."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "formation de l’orateur",
        "éloquence",
        "pratique",
        "imitation"
      ]
    },
    "relatedTexts": [
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — L’éloquence judiciaire en acte",
        "relation": "Tacite décrit la formation nécessaire pour atteindre le type de maîtrise que montre un réquisitoire comme celui de Cicéron."
      },
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — L’éloquence politique en acte",
        "relation": "Démosthène donne un exemple concret de parole publique qui doit convertir un jugement en décision."
      }
    ]
  },
  {
    "id": "demosthene-premiere-philippique-agir",
    "section": "autres",
    "cardMeta": "HLP · L’art de la parole",
    "title": "Quand est-ce que vous ferez ce que demande le salut de l’État ?",
    "author": "Démosthène",
    "authorTag": "Démosthène",
    "authorMeta": "(384–322 av. J.-C.) · orateur athénien",
    "themes": [
      "Langage",
      "État"
    ],
    "work": "Première Philippique",
    "publication": "351 av. J.-C., trad. Joseph Planche, Verdière, 1819",
    "description": "Démosthène ne cherche pas seulement l’accord des Athéniens : il veut faire de leur prise de conscience le commencement d’une action commune.",
    "context": "Philippe II de Macédoine étend son influence tandis qu’Athènes tarde à réagir. Dans cette harangue, Démosthène retourne le regard de l’assemblée vers sa propre inaction : l’adversaire n’est puissant que parce que les citoyens renoncent à agir.",
    "readingQuestions": [
      "Comment Démosthène transforme-t-il l’exemple de Philippe en reproche adressé aux Athéniens eux-mêmes ?",
      "Quel effet produisent les questions successives du passage sur l’auditeur ?",
      "Pourquoi une parole délibérative doit-elle aller au-delà de la conviction pour conduire à une décision ?"
    ],
    "glossary": [
      {
        "term": "délibératif",
        "definition": "Genre de discours qui porte sur ce qu’une assemblée doit décider et faire à l’avenir."
      },
      {
        "term": "Philippe",
        "definition": "Philippe II de Macédoine, dont l’expansion menace l’autonomie des cités grecques."
      }
    ],
    "paragraphs": [
      "Si vous voulez donc, Athéniens, raisonner comme Philippe, et cela dès aujourd’hui, puisque vous ne l’avez pas fait plus tôt ; si chacun de vous, écartant tous les vains prétextes, se montre prêt à rendre à la patrie tous les services qui sont en son pouvoir et que demandent les circonstances ; si tous les citoyens veulent concourir au bien public, les riches en contribuant de leurs fortunes, les jeunes en prenant les armes ; en un mot, si chacun de vous est résolu de ne s’attendre qu’à lui-même et de sortir de son inaction, en cessant de se flatter que, tandis qu’il ne fera rien, son voisin fera tout pour lui ; soyez assurés qu’avec l’aide des Dieux vous recouvrerez tout ce qui vous appartient, que vous réparerez toutes les pertes causées par votre négligence, et que vous tirerez une vengeance éclatante de votre ennemi.",
      "Car ne vous figurez pas que cet homme soit un Dieu qui jouisse d’une félicité immuable ; il est haï, craint, envié, par ceux-là même qui paraissent les plus dévoués à ses intérêts ; car ils ne sauraient être exempts des passions qui animent les autres hommes : mais tous ces sentimens restent ensevelis dans le fond des cœurs, faute de l’appui nécessaire pour éclater impunément ; appui qui leur manque par cette inaction où vous languissez maintenant, et dont il faut que vous sortiez enfin.",
      "Voyez en effet, à quel point est montée l’insolence de cet homme : il ne vous laisse plus le choix de l’action ou du repos, mais il vous menace ; il parle, à ce qu’on dit, d’un ton plein d’arrogance ; il ne peut se contenter de ce qu’il a déjà envahi, mais il s’agrandit tous les jours par de nouvelles conquêtes ; et, tandis que vous temporisez, que vous ne faites pas le moindre mouvement, il vous enveloppe et vous investit de toutes parts.",
      "Quand est-ce donc, Athéniens, quand est-ce que vous ferez ce que demande le salut de l’État ? Attendez-vous quelque nouvel événement ? Attendez-vous, grands Dieux, que la nécessité vous y force ? Mais, de quel œil regardez-vous donc tout ce qui se passe ? Pour moi, je ne connais pas de nécessité plus pressante pour les hommes libres que la honteuse situation de leurs affaires."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Philippiques/Premi%C3%A8re_philippique",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Exhorter",
        "definition": "L’orateur ne se contente pas d’exposer une thèse : il cherche à rendre l’inaction honteuse et l’action nécessaire."
      },
      {
        "type": "plain",
        "definition": "L’efficacité vient notamment des apostrophes, des questions et de l’opposition entre l’activité de Philippe et l’attentisme des Athéniens."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "délibération",
        "exhortation",
        "parole politique",
        "action"
      ]
    },
    "relatedTexts": [
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Réveiller le peuple contre une faction",
        "relation": "Les deux harangues transforment un diagnostic politique en appel à reprendre sa liberté."
      },
      {
        "id": "tacite-dialogue-orateurs-formation",
        "kind": "proche",
        "label": "Tacite — Comment se forme un orateur",
        "relation": "Le texte de Tacite aide à comprendre les compétences pratiques mobilisées dans une harangue comme celle de Démosthène."
      }
    ]
  },
  {
    "id": "tacite-annales-claude-integration",
    "section": "autres",
    "cardMeta": "HLP · L’art de la parole",
    "title": "Une cité se renforce en intégrant ceux qui peuvent la servir",
    "author": "Tacite",
    "authorTag": "Tacite",
    "authorMeta": "(v. 58–120) · historien latin",
    "themes": [
      "État",
      "Langage"
    ],
    "work": "Annales, livre XI",
    "publication": "v. 116, Annales, XI, 24, trad. Jean-Louis Burnouf, Hachette, 1863",
    "description": "Pour justifier l’entrée de notables gaulois au Sénat, Claude présente l’ouverture aux nouveaux citoyens comme une tradition constitutive de Rome.",
    "context": "Des sénateurs s’opposent à l’admission de notables de Gaule chevelue. Tacite rapporte la réponse de Claude : le discours redéfinit la nouveauté en montrant que Rome s’est toujours agrandie par l’intégration.",
    "readingQuestions": [
      "Pourquoi Claude commence-t-il par l’histoire de sa propre famille et celle des grandes familles romaines ?",
      "Comment le passé de Rome devient-il un argument en faveur d’une réforme présente ?",
      "Quel pouvoir possède ici le récit historique dans une délibération politique ?"
    ],
    "glossary": [
      {
        "term": "patricien",
        "definition": "Membre de l’ancienne aristocratie civique romaine."
      },
      {
        "term": "Pères conscrits",
        "definition": "Formule traditionnelle par laquelle un orateur s’adresse aux sénateurs romains."
      }
    ],
    "paragraphs": [
      "Mes ancêtres, dont le plus ancien, Clausus, né parmi les Sabins, reçut tout à la fois et le droit de cité romaine et le titre de patricien, semblent m’exhorter à suivre la même politique en transportant ici tout ce qu’il y a d’illustre dans les autres pays.",
      "Je ne puis ignorer qu’Albe nous a donné les Jules, Camérie les Coruncanius, Tusculum les Porcius, et, sans remonter si haut, que l’Étrurie, la Lucanie, l’Italie entière, ont fourni des sénateurs. Enfin, en reculant jusqu’aux Alpes les bornes de cette contrée, ce ne sont plus seulement des hommes, mais des nations et de vastes territoires que Rome a voulu associer à son nom.",
      "Pourquoi Lacédémone et Athènes, si puissantes par les armes, ont-elles péri, si ce n’est pour avoir repoussé les vaincus comme des étrangers ? Rappelant ensuite la guerre des Gaules, Claude ajoute : Honneur à la sagesse de Romulus notre fondateur, qui tant de fois vit ses voisins en un seul jour ennemis et citoyens ! Des étrangers ont régné sur nous.",
      "Et cependant rappelons-nous toutes les guerres ; aucune ne fut plus promptement terminée que celle des Gaulois, et rien n’a depuis altéré la paix. Déjà les mœurs, les arts, les alliances, les confondent avec nous ; qu’ils nous apportent aussi leurs richesses, et leur or, plutôt que d’en jouir seuls. Pères conscrits, les plus anciennes institutions furent nouvelles autrefois."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Annales_%28Tacite%29/Livre_XI",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Transformer le sens de la nouveauté",
        "definition": "Claude ne nie pas que la mesure soit nouvelle ; il affirme que toutes les institutions anciennes ont commencé par l’être. L’histoire sert ainsi à désamorcer l’objection."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "parole politique",
        "argument historique",
        "citoyenneté",
        "délibération"
      ]
    },
    "relatedTexts": [
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Une autre parole politique romaine",
        "relation": "Les deux textes montrent comment un orateur reconstruit l’histoire de la cité afin d’orienter une décision présente."
      },
      {
        "id": "chanson-roland-droit-parole",
        "kind": "proche",
        "label": "La Chanson de Roland — Qui peut parler dans le conseil ?",
        "relation": "Les deux textes permettent de comparer des formes historiques de délibération et d’autorité dans une assemblée."
      }
    ]
  },
  {
    "id": "salluste-memmius-liberte",
    "section": "autres",
    "cardMeta": "HLP · L’art de la parole",
    "title": "Parler au peuple au nom de la liberté",
    "author": "Salluste",
    "authorTag": "Salluste",
    "authorMeta": "(86–35 av. J.-C.) · historien latin",
    "themes": [
      "État",
      "Liberté"
    ],
    "work": "La Guerre de Jugurtha",
    "publication": "Ier siècle av. J.-C., chap. XXXI, trad. Charles du Rozoir, Garnier Frères, 1865",
    "description": "Memmius refuse le silence et transforme la dénonciation des abus de la noblesse en appel adressé aux citoyens romains.",
    "context": "Après un accord jugé scandaleux avec Jugurtha, le tribun C. Memmius cherche à réveiller le peuple romain. Salluste souligne lui-même le renom et l’influence de son éloquence avant de rapporter cette harangue.",
    "readingQuestions": [
      "Comment Memmius justifie-t-il le fait de prendre la parole alors que tout pourrait l’inciter au silence ?",
      "Pourquoi associe-t-il directement liberté politique et capacité des citoyens à réagir ?",
      "Comment l’orateur cherche-t-il à mobiliser le peuple sans l’appeler à la violence ?"
    ],
    "glossary": [
      {
        "term": "faction",
        "definition": "Groupe organisé qui cherche à confisquer le pouvoir politique au profit de ses intérêts."
      },
      {
        "term": "harangue",
        "definition": "Discours public et énergique adressé à une assemblée afin de l’exhorter."
      }
    ],
    "paragraphs": [
      "Que de motifs m’éloigneraient de vous, Romains, si l’amour du bien public ne l’emportait : la puissance d’une faction, votre patience, l’absence de toute justice, surtout la certitude que la vertu a plus de périls que d’honneurs à attendre.",
      "J’ai honte, en effet, de dire combien, depuis ces quinze dernières années, vous avez servi de jouet à l’insolence de quelques oppresseurs, avec quelle ignominie vous avez laissé périr sans vengeance les défenseurs de vos droits, à quel excès de bassesse et de lâcheté vos âmes se sont abandonnées. Aujourd’hui même, que vous avez prise sur vos ennemis, vous ne vous réveillez pas.",
      "Vous tremblez encore devant ceux qui devraient être saisis d’effroi devant vous ; mais, malgré de si justes motifs pour garder le silence, mon courage me fait une loi d’attaquer encore la puissance de cette faction : non, je n’hésiterai point à user de cette liberté que j’ai reçue de mes ancêtres : le ferai-je inutilement ou avec fruit ? cela dépend de vous seuls, ô mes concitoyens ! Je ne vous exhorte point à imiter l’exemple si souvent donné par vos pères, de repousser l’injustice les armes à la main ; il n’est ici besoin ni de violence ni de scission : il suffit de leur infâme conduite pour précipiter la ruine de vos adversaires."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/La_Guerre_de_Jugurtha",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Une parole qui refuse le silence",
        "definition": "L’orateur fait de sa propre prise de parole un acte civique : parler devient déjà une manière de résister à la domination d’une faction."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "harangue",
        "liberté politique",
        "dénonciation",
        "mobilisation"
      ]
    },
    "relatedTexts": [
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — Sortir de l’inaction",
        "relation": "Démosthène et Memmius reprochent tous deux à leurs concitoyens de subir ce qu’ils pourraient combattre par une décision collective."
      },
      {
        "id": "tacite-annales-claude-integration",
        "kind": "proche",
        "label": "Tacite — Argumenter devant le Sénat",
        "relation": "Deux usages de l’éloquence politique romaine : dénoncer une faction ou justifier une réforme."
      }
    ]
  },
  {
    "id": "voltaire-calas-sirven-plaidoyer",
    "section": "philosophie",
    "cardMeta": "HLP · L’art de la parole",
    "title": "Dénoncer le fanatisme en exposant l’injustice",
    "author": "Voltaire",
    "authorTag": "Voltaire",
    "authorMeta": "(1694–1778) · Lumières",
    "themes": [
      "Justice",
      "Religion"
    ],
    "work": "Avis au public sur les parricides imputés aux Calas et aux Sirven",
    "publication": "1766, Avis au public sur les parricides imputés aux Calas et aux Sirven, éd. Garnier, 1879",
    "description": "Voltaire rapproche les affaires Calas et Sirven pour dénoncer la mécanique du préjugé religieux et l’absurdité d’une justice sans preuves.",
    "context": "Après s’être engagé dans l’affaire Calas, Voltaire intervient également en faveur de la famille Sirven, protestante elle aussi. Il transforme le récit d’une procédure en critique publique du fanatisme et des raisonnements judiciaires fondés sur le préjugé.",
    "readingQuestions": [
      "Pourquoi Voltaire rapproche-t-il immédiatement les affaires Calas et Sirven ?",
      "Comment l’ironie fait-elle apparaître l’absurdité du raisonnement du juge ?",
      "En quoi publier ce récit revient-il à déplacer une affaire locale devant le tribunal de l’opinion publique ?"
    ],
    "glossary": [
      {
        "term": "fanatisme",
        "definition": "Attachement passionnel et intolérant à une croyance, au point de refuser l’examen critique et de justifier la persécution."
      },
      {
        "term": "factum",
        "definition": "Mémoire imprimé exposant les faits et arguments d’une affaire judiciaire."
      }
    ],
    "paragraphs": [
      "Voilà donc en France deux accusations de parricides pour cause de religion dans la même année, et deux familles juridiquement immolées par le fanatisme ! Le même préjugé qui étendait Calas sur la roue, à Toulouse, traînait à la potence la famille entière de Sirven, dans une juridiction de la même province ; et le même défenseur de l’innocence, M. Élie de Beaumont, avocat au parlement de Paris, qui a justifié les Calas, vient de justifier les Sirven par un mémoire signé de plusieurs avocats, mémoire qui démontre que le jugement contre les Sirven est encore plus absurde que l’arrêt contre les Calas.",
      "Voici en peu de mots le fait, dont le récit servira d’instruction pour les étrangers qui n’auront pu lire encore le factum de l’éloquent M. de Beaumont.",
      "En 1761, dans le temps même que la famille protestante des Calas était dans les fers, accusée d’avoir assassiné Marc-Antoine Calas, qu’on supposait vouloir embrasser la religion catholique, il arriva qu’une fille du sieur Paul Sirven, commissaire à terrier du pays de Castres, fut présentée à l’évêque de Castres par une femme qui gouverne sa maison. L’évêque, apprenant que cette fille était d’une famille calviniste, la fait enfermer à Castres, dans une espèce de couvent qu’on appelle la maison des régentes.",
      "Aussitôt le juge du village raisonne ainsi : On va rouer, à Toulouse, Calas, et brûler sa femme, qui sans doute ont pendu leur fils de peur qu’il n’allât à la messe ; je dois donc, à l’exemple de mes supérieurs, en faire autant des Sirven, qui sans doute ont noyé leur fille pour la même cause. Il est vrai que je n’ai aucune preuve que le père, la mère et les deux sœurs de cette fille, l’aient assassinée ; mais j’entends dire qu’il n’y a pas plus de preuves contre les Calas : ainsi je ne risque rien."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Avis_au_public/%C3%89dition_Garnier",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "L’ironie comme arme critique",
        "definition": "Voltaire fait parler le juge de façon à rendre visible l’enchaînement absurde du préjugé : l’absence de preuve devient presque un motif de condamnation."
      },
      {
        "type": "plain",
        "definition": "Le texte est un bon exemple de passage du judiciaire au public : l’auteur veut non seulement défendre une famille, mais instruire des lecteurs et modifier leur jugement."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "plaidoyer public",
        "opinion",
        "ironie",
        "tolérance"
      ]
    },
    "relatedTexts": [
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — Le cas Sthénius",
        "relation": "Deux textes où le récit d’une injustice particulière devient le support d’une accusation plus générale."
      },
      {
        "id": "sophocle-antigone-lois-non-ecrites",
        "kind": "proche",
        "label": "Sophocle — Antigone contre le décret de Créon",
        "relation": "Les deux textes interrogent la légitimité d’une décision lorsqu’elle entre en conflit avec une exigence supérieure de justice."
      }
    ]
  },
  {
    "id": "hippocrate-serment",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Prononcer une parole qui oblige celui qui la donne",
    "author": "Hippocrate",
    "authorTag": "Hippocrate",
    "authorMeta": "(v. 460–370 av. J.-C.) · médecine grecque",
    "themes": [
      "Devoir",
      "Science"
    ],
    "work": "Le Serment",
    "publication": "Antiquité, trad. Émile Littré, 1839",
    "description": "Le serment médical offre un cas particulièrement clair d’une parole qui n’informe pas seulement : elle engage celui qui la prononce.",
    "context": "Le texte prend la forme d’un engagement solennel placé sous le regard des dieux. Dire « je jure » revient ici à assumer publiquement une règle de conduite future : le pouvoir de la parole tient à l’obligation que le locuteur reconnaît lui-même.",
    "readingQuestions": [
      "Pourquoi le serment commence-t-il par l’invocation de témoins divins ?",
      "Qu’est-ce qui distingue une promesse ou un serment d’une simple affirmation ?",
      "Comment ce texte relie-t-il savoir médical, devoir moral et responsabilité du praticien ?"
    ],
    "glossary": [
      {
        "term": "serment",
        "definition": "Engagement solennel par lequel un locuteur se lie à une conduite et prend une autorité à témoin."
      },
      {
        "term": "performative",
        "definition": "Énoncé qui accomplit une action par le fait même d’être prononcé dans des conditions appropriées."
      }
    ],
    "paragraphs": [
      "Je jure par Apollon, médecin, par Esculape, par Hygie et Panacée, par tous les dieux et toutes les déesses, les prenant à témoin que je remplirai, suivant mes forces et ma capacité, le serment et l’engagement suivants : Je mettrai mon maître de médecine au même rang que les auteurs de mes jours, je partagerai avec lui mon avoir, et, le cas échéant, je pourvoirai à ses besoins ; je tiendrai ses enfants pour des frères, et, s’ils désirent apprendre la médecine, je la leur enseignerai sans salaire ni engagement.",
      "Je ferai part des préceptes, des leçons orales et du reste de l’enseignement à mes fils, à ceux de mon maître, et aux disciples liés par un engagement et un serment suivant la loi médicale, mais à nul autre. Je dirigerai le régime des malades à leur avantage, suivant mes forces et mon jugement, et je m’abstiendrai de tout mal et de toute injustice.",
      "Je ne remettrai à personne du poison, si on m’en demande, ni ne prendrai l’initiative d’une pareille suggestion ; semblablement, je ne remettrai à aucune femme un pessaire abortif. Je passerai ma vie et j’exercerai mon art dans l’innocence et la pureté. Je ne pratiquerai pas l’opération de la taille, je la laisserai aux gens qui s’en occupent.",
      "Dans quelque maisons que j’entre, j’y entrerai pour l’utilité des malades, me préservant de tout méfait volontaire et corrupteur, et surtout de la séduction des femmes et des garçons, libres ou esclaves. Quoi que je voie ou entende dans la société pendant l’exercice ou même hors de l’exercice de ma profession, je tairai ce qui n’a jamais besoin d’être divulgué, regardant la discrétion comme un devoir en pareil cas.",
      "Si je remplis ce serment sans l’enfreindre, qu’il me soit donné de jouir heureusement de la vie et de ma profession, honoré à jamais parmi les hommes ; si je le viole et que je me parjure, puissé-je avoir un sort contraire !"
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Serment_d%E2%80%99Hippocrate_%28Littr%C3%A9%29",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Quand dire, c’est s’engager",
        "definition": "Le contenu du serment porte sur l’avenir, mais la prise d’engagement se produit au présent par la parole elle-même."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "serment",
        "engagement",
        "parole performative",
        "devoir"
      ]
    },
    "relatedTexts": [
      {
        "id": "eschyle-eumenides-instituer-tribunal",
        "kind": "proche",
        "label": "Eschyle — Athéna institue un tribunal",
        "relation": "Dans les deux cas, une parole publique ne se contente pas de décrire : elle crée une obligation ou une institution."
      },
      {
        "id": "chanson-roland-droit-parole",
        "kind": "proche",
        "label": "La Chanson de Roland — Le droit de prendre la parole",
        "relation": "Les deux textes montrent que l’efficacité d’une parole dépend aussi d’un cadre rituel et social reconnu."
      }
    ]
  },
  {
    "id": "eschyle-eumenides-instituer-tribunal",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Athéna institue un tribunal par sa parole",
    "author": "Eschyle",
    "authorTag": "Eschyle",
    "authorMeta": "(v. 525–456 av. J.-C.) · tragédie grecque",
    "themes": [
      "Justice",
      "État"
    ],
    "work": "Les Euménides",
    "publication": "458 av. J.-C., trad. Leconte de Lisle, A. Lemerre, 1872",
    "description": "En énonçant une loi et en instituant l’Aréopage, Athéna fait de la parole un acte fondateur de l’ordre judiciaire.",
    "context": "Dans <em>Les Euménides</em>, le cycle de la vengeance familiale doit trouver une autre issue. Athéna confie l’affaire d’Oreste à des juges et formule les principes d’un tribunal destiné à durer : le langage devient ici institution.",
    "readingQuestions": [
      "Quels éléments montrent qu’Athéna ne donne pas seulement un conseil, mais fonde une institution ?",
      "Pourquoi le tribunal doit-il éviter à la fois l’anarchie et la tyrannie ?",
      "En quoi cet extrait permet-il de comprendre l’idée selon laquelle certaines paroles produisent une réalité nouvelle ?"
    ],
    "glossary": [
      {
        "term": "Aréopage",
        "definition": "Conseil et tribunal athénien siégeant sur la colline d’Arès, notamment compétent pour les affaires de meurtre."
      },
      {
        "term": "instituer",
        "definition": "Établir durablement une règle, une fonction ou une organisation en lui donnant une forme reconnue."
      }
    ],
    "paragraphs": [
      "Écoutez encore la loi que je fonde, peuple de l’Attique, vous qui êtes les premiers juges du sang versé. Ce tribunal, désormais et pour toujours, jugera le peuple Aigéen. Sur cette colline d’Arès, les Amazones plantèrent autrefois leurs tentes, quand, irritées contre Thèseus, elles assiégèrent la Ville récemment fondée et opposèrent des tours à ses hautes tours. Ici, elles firent des sacrifices à Arès, d’où ce nom d’Arèopagos, le rocher, la colline d’Arès.",
      "Donc, ici, le respect et la crainte seront toujours présents, le jour et la nuit, à tous les citoyens, tant qu’ils se garderont eux-mêmes d’instituer de nouvelles lois. Si vous souillez une eau limpide par des courants boueux, comment pourrez-vous la boire ? Je voudrais persuader aux citoyens chargés du soin de la République d’éviter l’anarchie et la tyrannie, mais non de renoncer à toute répression.",
      "Quel homme restera juste, s’il ne craint rien ? Respectez donc la majesté de ce tribunal, rempart sauveur de ce pays et de cette ville, tel qu’on n’en possède point parmi les hommes, ni les Skythes, ni ceux de la terre de Pélops. J’institue ce tribunal incorruptible, vénérable et sévère, gardien vigilant de cette terre, même pendant le sommeil de tous, et je le dis aux citoyens pour que cela soit désormais dans l’avenir. Maintenant, levez-vous, et, fidèles à votre serment, prononcez l’arrêt. J’ai dit."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Eum%C3%A9nides_%28Eschyle%2C_Leconte_de_Lisle%29",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Une parole institutionnelle",
        "definition": "Les formules « la loi que je fonde » et « j’institue » produisent un nouvel ordre de jugement : l’autorité de la parole réside ici dans son pouvoir de fixer une règle commune."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "institution",
        "justice",
        "loi",
        "dire c’est faire"
      ]
    },
    "relatedTexts": [
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Le serment",
        "relation": "Deux exemples où la parole a une efficacité pratique : elle engage un individu ou institue une procédure commune."
      },
      {
        "id": "sophocle-antigone-lois-non-ecrites",
        "kind": "proche",
        "label": "Sophocle — Antigone et les lois non écrites",
        "relation": "Eschyle montre la fondation d’une loi civique ; Sophocle met en scène le conflit entre un décret politique et une norme jugée supérieure."
      }
    ]
  },
  {
    "id": "chanson-roland-droit-parole",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Dans le conseil, tout le monde n’a pas également droit à la parole",
    "author": "Anonyme",
    "authorTag": "Anonyme",
    "authorMeta": "XIe siècle · chanson de geste",
    "themes": [
      "Langage",
      "État"
    ],
    "work": "La Chanson de Roland",
    "publication": "XIe siècle, éd. et trad. Léon Gautier, Alfred Mame et Fils, 1872, laisses XVII–XIX",
    "description": "Le conseil de Charlemagne montre que la prise de parole publique dépend d’un ordre social : chacun ne parle pas de la même place ni avec la même autorité.",
    "context": "Charlemagne doit choisir un messager à envoyer auprès du roi Marsile. Les barons proposent successivement leur service, mais le roi accepte, refuse ou interrompt les prises de parole : la délibération révèle ainsi la hiérarchie du conseil.",
    "readingQuestions": [
      "Quels gestes et objets accompagnent la prise de parole dans ce conseil ?",
      "Comment Charlemagne manifeste-t-il son autorité en distribuant ou en retirant le droit de parler ?",
      "Que nous apprend cette scène sur la différence entre prendre la parole et avoir autorité pour parler ?"
    ],
    "glossary": [
      {
        "term": "gant et bâton",
        "definition": "Objets symboliques remis au messager chargé officiellement d’une mission au nom du souverain."
      },
      {
        "term": "Pairs",
        "definition": "Dans la tradition épique, principaux compagnons et grands vassaux de Charlemagne."
      }
    ],
    "paragraphs": [
      "« Seigneurs barons, quel messager enverrons-nous / Vers le roi Marsile à Saragosse ? / — J’irai, si vous le voulez bien, répond le duc Naimes. / Donnez-moi sur-le-champ le gant et le bâton. / — Non, répond le Roi, vous êtes un homme sage. / Par la barbe et les moustaches que voici, / Vous n’irez pas à cette heure si loin de moi. / Personne ne vous appelle : rasseyez-vous. »",
      "« Seigneurs barons, quel messager pourrions-nous envoyer / Vers le Sarrasin qui règne à Saragosse ? / — J’y puis fort bien aller, s’écrie Roland. / — Non, certes, répond le comte Olivier. / Vous avez un cœur trop ardent et farouche ; / Vous vous attireriez quelque bataille. / J’irai plutôt, s’il plaît au Roi. / — Taisez-vous tous les deux, répond l’Empereur ; / Certes, vous n’y mettrez les pieds ni l’un ni l’autre. / Par cette barbe blanche que vous voyez, / J’entends qu’on ne choisisse point les douze Pairs. » / Les Français se taisent, les voilà cois.",
      "Turpin de Reims se lève, sort de son rang : / « Laissez en paix vos Francs, dit-il à l’Empereur. / Vous êtes depuis sept ans dans ce pays, / Et vos barons n’y ont eu que travaux et douleurs. / C’est à moi, Sire, qu’il faut donner le gant et le bâton. / J’irai trouver le Sarrasin d’Espagne, / Et verrai un peu comment est fait son visage. »",
      "L’Empereur, plein de colère, lui répond : / « Allez vous rasseoir sur ce tapis blanc, / Et ne vous avisez plus de parler, à moins que je ne vous l’ordonne. »"
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/La_Chanson_de_Roland/L%C3%A9on_Gautier/%C3%89dition_critique/Premi%C3%A8re_partie/Traduction",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Le droit de parole comme signe de rang",
        "definition": "La scène montre une parole publique réglée : le roi convoque le conseil, reçoit les propositions et peut ordonner le silence. L’autorité dépend donc aussi de la position occupée."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "droit de parole",
        "hiérarchie",
        "conseil",
        "légitimité"
      ]
    },
    "relatedTexts": [
      {
        "id": "tacite-dialogue-orateurs-formation",
        "kind": "proche",
        "label": "Tacite — Apprendre à parler au Forum",
        "relation": "Les deux textes montrent que la parole publique est inséparable d’institutions, de rôles et de règles sociales."
      },
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Une parole ritualisée qui engage",
        "relation": "Dans les deux cas, gestes, statut et contexte contribuent à donner une force particulière à ce qui est dit."
      }
    ]
  },
  {
    "id": "thucydide-pericles-oraison-funebre",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "La parole publique donne aux morts une mémoire commune",
    "author": "Thucydide",
    "authorTag": "Thucydide",
    "authorMeta": "(v. 460–v. 400 av. J.-C.) · historien grec",
    "themes": [
      "Langage",
      "État",
      "Devoir"
    ],
    "work": "Guerre du Péloponnèse — livre II, 43, discours de Périclès",
    "publication": "Ve siècle av. J.-C., trad. Jean-Baptiste Gail, éd. Liskenne et Sauvan, 1835",
    "description": "Dans l’oraison funèbre, Périclès transforme la mort des citoyens en mémoire civique : l’éloge public donne un sens politique au sacrifice individuel.",
    "context": "Au début de la guerre du Péloponnèse, Athènes organise les funérailles publiques des premiers soldats morts. Thucydide rapporte le discours attribué à Périclès : l’orateur ne se contente pas de consoler les proches, il rattache les morts à la grandeur de la cité et propose leur conduite comme modèle aux survivants.",
    "readingQuestions": [
      "Comment Périclès passe-t-il de l’éloge des morts à une exhortation adressée aux vivants ?",
      "Pourquoi la gloire des citoyens morts dépasse-t-elle, selon lui, le tombeau matériel ?",
      "En quoi une parole publique peut-elle construire une mémoire et une identité communes ?"
    ],
    "glossary": [
      {
        "term": "oraison funèbre",
        "definition": "Discours public prononcé en l’honneur de personnes mortes, qui associe hommage, consolation et transmission de valeurs."
      },
      {
        "term": "civique",
        "definition": "Qui concerne la cité, la vie politique et les devoirs du citoyen."
      }
    ],
    "paragraphs": [
      "C’est ainsi qu’il convenait à de tels hommes de s’offrir en victimes à la patrie. Ô vous qui leur avez survécu, demandez, vous le pouvez sans doute, demandez aux dieux une victoire que ne suive point le trépas ; mais jamais n’opposez à l’ennemi une valeur moins audacieuse.",
      "Faudrait-il donc vous retracer tous les biens qui sont les fruits du courage ? Vous les connaissez comme moi. La grandeur de la patrie qui arme vos bras n’est pas un tableau qu’il suffise de contempler sous le pinceau de l’orateur : c’est une beauté réelle ; il faut que le cœur en soit épris, que l’amour en devienne plus actif à mesure que la connaissance en devient plus parfaite.",
      "Que la reconnaissance vous dise tous les jours : ceux qui nous l’ont acquise, sensibles au cri de l’honneur, à la voix de l’opinion, savaient braver les dangers. Quelquefois la fortune trompa leur attente : mais jamais ils ne crurent qu’un revers dût priver la patrie de leur vertu.",
      "Aussi lui ont-ils payé le plus noble des tributs ; car, en lui donnant tout leur sang, ils ont obtenu pour eux-mêmes un honneur immortel et le plus glorieux des tombeaux, non pas ce froid sépulcre où nous venons déposer leurs cendres, mais ce monument plus durable auquel leur gloire est confiée, pour être à jamais célébrée toutes les fois que l’occasion s’offrira ou de louer la bravoure ou d’en donner l’exemple."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Biblioth%C3%A8que_historique_et_militaire/Guerre_du_P%C3%A9loponn%C3%A8se/Livre_II",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Faire exister une communauté par la parole",
        "definition": "L’orateur relie les morts, les survivants et la cité dans un même récit : la parole publique produit une mémoire collective et fixe ce qui mérite d’être admiré."
      },
      {
        "type": "plain",
        "definition": "L’autorité de Périclès ne tient pas seulement à sa fonction : elle vient de sa capacité à interpréter publiquement l’événement et à proposer une conduite aux citoyens."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "oraison funèbre",
        "mémoire collective",
        "cité",
        "éloge"
      ]
    },
    "relatedTexts": [
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "proche",
        "label": "Corneille — Une parole souveraine qui transforme le rapport politique",
        "relation": "Périclès donne une signification civique à la mort ; Auguste transforme directement le statut de ses ennemis en prononçant le pardon."
      },
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Parler au peuple au nom de la liberté",
        "relation": "Deux usages de l’autorité politique de la parole : célébrer la cité ou rappeler au peuple ce qu’il doit défendre."
      }
    ]
  },
  {
    "id": "corneille-cinna-clemence-auguste",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "« Soyons amis, Cinna » : le souverain fait du pardon un acte",
    "author": "Pierre Corneille",
    "authorTag": "Corneille",
    "authorMeta": "(1606–1684) · dramaturge français",
    "themes": [
      "Langage",
      "État",
      "Justice"
    ],
    "work": "Cinna ou la Clémence d’Auguste — acte V, scène 3",
    "publication": "1641, texte français original",
    "description": "Auguste décide de vaincre la conjuration par la clémence : sa parole souveraine ne décrit pas seulement une décision, elle accorde effectivement la vie et reconfigure les relations politiques.",
    "context": "Cinna a participé à un complot contre Auguste. Au dernier acte, après les aveux successifs, l’empereur renonce à la vengeance. Le célèbre « Soyons amis, Cinna » manifeste une autorité capable de produire un nouvel ordre par la parole même qui le prononce.",
    "readingQuestions": [
      "Pourquoi Auguste présente-t-il la maîtrise de lui-même comme une victoire ?",
      "Que produit concrètement la formule « Soyons amis, Cinna » ?",
      "La clémence diminue-t-elle le pouvoir d’Auguste ou le renforce-t-elle ?"
    ],
    "glossary": [
      {
        "term": "clémence",
        "definition": "Disposition d’un détenteur du pouvoir à modérer ou remettre une peine qu’il pourrait légitimement infliger."
      },
      {
        "term": "parole performative",
        "definition": "Parole qui accomplit une action par le fait même d’être prononcée dans des conditions reconnues : promettre, pardonner, condamner, nommer, etc."
      }
    ],
    "paragraphs": [
      "AUGUSTE. — En est-ce assez, ô ciel ! et le sort, pour me nuire, / A-t-il quelqu’un des miens qu’il veuille encor séduire ? / Qu’il joigne à ses efforts le secours des enfers : / Je suis maître de moi comme de l’univers ; / Je le suis, je veux l’être. Ô siècles, ô mémoire, / Conservez à jamais ma dernière victoire !",
      "Je triomphe aujourd’hui du plus juste courroux / De qui le souvenir puisse aller jusqu’à vous.",
      "Soyons amis, Cinna, c’est moi qui t’en convie : / Comme à mon ennemi je t’ai donné la vie, / Et, malgré la fureur de ton lâche destin, / Je te la donne encor comme à mon assassin.",
      "Commençons un combat qui montre par l’issue / Qui l’aura mieux de nous ou donnée ou reçue. / Tu trahis mes bienfaits, je les veux redoubler ; / Je t’en avois comblé, je t’en veux accabler."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Cinna_ou_la_Cl%C3%A9mence_d%E2%80%99Auguste/CINNA/Acte_V",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Dire, c’est ici agir",
        "definition": "Parce qu’Auguste est souverain, déclarer qu’il donne la vie ou qu’il fait de Cinna un ami modifie réellement la situation politique et juridique des personnages."
      },
      {
        "type": "plain",
        "definition": "La scène permet de distinguer une parole qui conseille ou persuade d’une parole institutionnellement autorisée qui produit immédiatement un effet."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "souveraineté",
        "clémence",
        "performativité",
        "pardon"
      ]
    },
    "relatedTexts": [
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Une parole qui engage celui qui la prononce",
        "relation": "Le serment oblige le locuteur ; chez Corneille, la parole souveraine transforme également la situation d’autrui."
      },
      {
        "id": "eschyle-eumenides-instituer-tribunal",
        "kind": "proche",
        "label": "Eschyle — Instituer un tribunal par la parole",
        "relation": "Deux scènes où l’autorité ne se contente pas de parler du droit : elle établit un nouvel ordre."
      }
    ]
  },
  {
    "id": "la-boetie-servitude-volontaire-ne-plus-servir",
    "section": "philosophie",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "« Soyez résolus de ne servir plus » : l’autorité dépend aussi de l’obéissance",
    "author": "Étienne de La Boétie",
    "authorTag": "La Boétie",
    "authorMeta": "(1530–1563) · écrivain et penseur politique",
    "themes": [
      "Liberté",
      "État",
      "Langage"
    ],
    "work": "Discours de la servitude volontaire",
    "publication": "rédigé au XVIe siècle, édition publique ancienne",
    "description": "La Boétie renverse la représentation ordinaire du pouvoir : le tyran paraît tout-puissant, mais sa force lui vient en grande partie de ceux qui acceptent de le soutenir.",
    "context": "Le Discours cherche à comprendre une énigme politique : comment un seul homme peut-il dominer une multitude ? La Boétie répond que la domination n’est pas seulement imposée de l’extérieur ; elle se nourrit d’une coopération, d’habitudes et de relais. L’appel à « ne servir plus » vise donc le point d’appui du pouvoir.",
    "readingQuestions": [
      "Pourquoi La Boétie multiplie-t-il les questions adressées directement aux dominés ?",
      "Comment le texte montre-t-il que la puissance du maître est fabriquée par ceux qu’il domine ?",
      "Que signifie exactement « ne le soutenez plus » : désobéir, résister, se retirer ?"
    ],
    "glossary": [
      {
        "term": "servitude volontaire",
        "definition": "Formule paradoxale qui désigne la participation des dominés au maintien d’une domination qu’ils pourraient pourtant refuser de soutenir."
      },
      {
        "term": "tyran",
        "definition": "Dirigeant qui exerce un pouvoir arbitraire en subordonnant le bien commun à sa propre domination."
      }
    ],
    "paragraphs": [
      "Celui qui vous maîtrise tant n’a que deux yeux, n’a que deux mains, n’a qu’un corps, et n’a autre chose que ce qu’a le moindre homme du grand et infini nombre de nos villes, sinon que l’avantage que vous lui faites pour vous détruire.",
      "D’où a-t-il pris tant d’yeux, dont il vous épie, si vous ne les lui baillez ? Comment a-t-il tant de mains pour vous frapper, s’il ne les prend de vous ? Les pieds dont il foule vos cités, d’où les a-t-il, s’ils ne sont des vôtres ? Comment a-t-il aucun pouvoir sur vous, que par vous ?",
      "Vous vous affaiblissez, afin de le rendre plus fort et roide à vous tenir plus courte la bride ; et de tant d’indignités [...] vous pouvez vous en délivrer, si vous l’essayez, non pas de vous en délivrer, mais seulement de le vouloir faire.",
      "Soyez résolus de ne servir plus, et vous voilà libres. Je ne veux pas que vous le poussiez ou l’ébranliez, mais seulement ne le soutenez plus, et vous le verrez, comme un grand colosse à qui on a dérobé sa base, de son poids même fondre en bas et se rompre."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Discours_de_la_servitude_volontaire/%C3%89dition_1922/Texte_entier",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Le pouvoir comme relation",
        "definition": "La domination n’est pas une propriété magique du tyran : elle existe grâce à un réseau de soutiens, d’obéissances et d’intermédiaires."
      },
      {
        "type": "plain",
        "definition": "L’adresse directe au lecteur donne à l’analyse une force d’exhortation : comprendre la servitude doit rendre possible un changement de conduite."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "obéissance",
        "domination",
        "liberté",
        "tyrannie"
      ]
    },
    "relatedTexts": [
      {
        "id": "pascal-justice-force",
        "kind": "proche",
        "label": "Pascal — La justice et la force",
        "relation": "La Boétie analyse ce qui soutient concrètement le pouvoir ; Pascal interroge le rapport entre puissance effective et légitimité."
      },
      {
        "id": "la-fontaine-loup-agneau-force-raison",
        "kind": "proche",
        "label": "La Fontaine — Quand le rapport de force rend le raisonnement impuissant",
        "relation": "La fable montre la force imposée à un individu ; La Boétie demande comment une force politique peut être soutenue par une multitude."
      }
    ]
  },
  {
    "id": "pascal-justice-force",
    "section": "philosophie",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Justice et force : quand le pouvoir cherche à paraître légitime",
    "author": "Blaise Pascal",
    "authorTag": "Pascal",
    "authorMeta": "(1623–1662) · philosophe et écrivain français",
    "themes": [
      "Justice",
      "État",
      "Raison"
    ],
    "work": "Pensées — fragment « Justice, force »",
    "publication": "texte posthume, éd. Hachette 1871, fragment « Justice, force »",
    "description": "Pascal distingue la justice, contestable et difficile à imposer, de la force, immédiatement reconnue ; la politique tend alors à faire passer le fort pour juste.",
    "context": "Dans les Pensées, Pascal examine les fondements instables des institutions humaines. Le fragment « Justice, force » condense un problème central : la justice a besoin de puissance pour être suivie, mais la puissance peut se donner l’apparence de la justice.",
    "readingQuestions": [
      "Pourquoi la justice sans force est-elle impuissante, tandis que la force sans justice est tyrannique ?",
      "Que signifie l’idée que la force est « très reconnaissable et sans dispute » ?",
      "Comment comprendre la conclusion : « on a fait que ce qui est fort fût juste » ?"
    ],
    "glossary": [
      {
        "term": "légitimité",
        "definition": "Qualité d’un pouvoir reconnu comme fondé en droit ou en justice, et non seulement capable de contraindre."
      },
      {
        "term": "tyrannique",
        "definition": "Se dit d’un pouvoir qui impose sa force sans justification suffisante par le droit ou la justice."
      }
    ],
    "paragraphs": [
      "Justice, force. — Il est juste que ce qui est juste soit suivi : il est nécessaire que ce qui est le plus fort soit suivi.",
      "La justice sans la force est impuissante : la force sans la justice est tyrannique. La justice sans force est contredite, parce qu’il y a toujours des méchants : la force sans la justice est accusée.",
      "Il faut donc mettre ensemble la justice et la force ; et pour cela faire que ce qui est juste soit fort, et que ce qui est fort soit juste.",
      "La justice est sujette à disputes : la force est très-reconnaissable et sans dispute. Ainsi on n’a pu donner la force à la justice, parce que la force a contredit la justice et a dit qu’elle était injuste, et a dit que c’était elle qui était juste : et ainsi ne pouvant faire que ce qui est juste fût fort, on a fait que ce qui est fort fût juste."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/%C5%92uvres_compl%C3%A8tes_de_Blaise_Pascal_Hachette_1871,_vol1/Pens%C3%A9es/Article_06",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Force et légitimité",
        "definition": "Une autorité durable ne peut se réduire à la contrainte : elle cherche à être reconnue comme juste. Pascal montre toutefois que cette reconnaissance peut être produite par la puissance elle-même."
      },
      {
        "type": "plain",
        "definition": "Le fragment est utile pour distinguer deux questions : qui peut se faire obéir ? et qui mérite d’être obéi ?"
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "justice",
        "force",
        "légitimité",
        "pouvoir"
      ]
    },
    "relatedTexts": [
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — D’où vient la force du maître ?",
        "relation": "Pascal analyse l’alliance du juste et du fort ; La Boétie démonte les soutiens concrets qui rendent un pouvoir fort."
      },
      {
        "id": "la-fontaine-loup-agneau-force-raison",
        "kind": "proche",
        "label": "La Fontaine — La force contre la raison",
        "relation": "La fable dramatise en quelques vers le problème que Pascal formule conceptuellement."
      }
    ]
  },
  {
    "id": "la-fontaine-loup-agneau-force-raison",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Quand la raison ne suffit plus face au rapport de force",
    "author": "Jean de La Fontaine",
    "authorTag": "La Fontaine",
    "authorMeta": "(1621–1695) · poète et fabuliste français",
    "themes": [
      "Justice",
      "Langage",
      "Raison"
    ],
    "work": "Fables — I, 10, « Le Loup et l’Agneau »",
    "publication": "1668, texte français original",
    "description": "L’agneau répond rationnellement à toutes les accusations du loup, mais la discussion est truquée : celui qui possède la force n’a pas besoin d’avoir raison.",
    "context": "La fable met en scène un procès sans justice. Le loup formule successivement des accusations que l’agneau réfute, mais aucun argument ne peut modifier l’issue décidée d’avance. La parole révèle alors sa limite lorsqu’elle ne s’appuie sur aucune institution capable de contenir la violence.",
    "readingQuestions": [
      "Pourquoi l’argumentation de l’agneau est-elle logiquement supérieure à celle du loup ?",
      "Comment le loup déplace-t-il sans cesse l’accusation pour éviter d’être réfuté ?",
      "La morale « La raison du plus fort est toujours la meilleure » affirme-t-elle réellement que le plus fort a raison ?"
    ],
    "glossary": [
      {
        "term": "sophisme",
        "definition": "Raisonnement qui donne l’apparence de la validité mais repose sur une erreur ou une manipulation."
      },
      {
        "term": "rapport de force",
        "definition": "Situation où l’issue dépend principalement de la puissance respective des acteurs plutôt que de la vérité ou du droit."
      }
    ],
    "paragraphs": [
      "La raison du plus fort est toujours la meilleure : / Nous l’allons montrer tout à l’heure. / Un agneau se désaltérait / Dans le courant d’une onde pure. / Un loup survint à jeun, qui cherchait aventure, / Et que la faim en ces lieux attirait.",
      "« Qui te rend si hardi de troubler mon breuvage ? » / Dit cet animal plein de rage : / « Tu seras châtié de ta témérité. » / « Sire, répond l’agneau, que Votre Majesté / Ne se mette pas en colère ; / Mais plutôt qu’elle considère / Que je me vas désaltérant / Dans le courant, / Plus de vingt pas au-dessous d’elle ; / Et que, par conséquent, en aucune façon / Je ne puis troubler sa boisson. »",
      "« Tu la troubles ! reprit cette bête cruelle ; / Et je sais que de moi tu médis l’an passé. » / « Comment l’aurais-je fait, si je n’étais pas né ? / Reprit l’agneau : je tette encore ma mère. » / « Si ce n’est toi, c’est donc ton frère. » / « Je n’en ai point. » / « C’est donc quelqu’un des tiens. »",
      "« Car vous ne m’épargnez guère, / Vous, vos bergers et vos chiens : / On me l’a dit. Il faut que je me venge. » / Là-dessus, au fond des forêts / Le loup l’emporte, et puis le mange, / Sans autre forme de procès."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._Mame_1897)/Le_Loup_et_l%E2%80%99Agneau",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Une argumentation sans juge",
        "definition": "L’agneau respecte les règles de la discussion rationnelle, mais le loup cumule les rôles d’accusateur, de juge et d’exécuteur. La force rend la réfutation sans effet."
      },
      {
        "type": "plain",
        "definition": "La formule initiale est ironique : la « meilleure » raison n’est pas la plus vraie, mais celle qui l’emporte parce qu’elle est soutenue par la puissance."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "raison",
        "force",
        "justice",
        "sophisme"
      ]
    },
    "relatedTexts": [
      {
        "id": "pascal-justice-force",
        "kind": "proche",
        "label": "Pascal — Justice et force",
        "relation": "La Fontaine met en récit ce que Pascal analyse : la force peut s’imposer même lorsqu’elle ne parvient pas à établir la justice de sa cause."
      },
      {
        "id": "racine-plaideurs-aristote-autorite",
        "kind": "contraste",
        "label": "Racine — L’autorité savante ne remplace pas la preuve",
        "relation": "Chez La Fontaine la force écrase l’argument ; chez Racine, c’est l’accumulation d’autorités qui détourne l’argumentation de son objet."
      }
    ]
  },
  {
    "id": "racine-plaideurs-aristote-autorite",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "Citer Aristote n’est pas encore démontrer",
    "author": "Jean Racine",
    "authorTag": "Racine",
    "authorMeta": "(1639–1699) · dramaturge français",
    "themes": [
      "Langage",
      "Raison",
      "Justice"
    ],
    "work": "Les Plaideurs — acte III, scène 3",
    "publication": "1668, texte français original",
    "description": "La scène ridiculise une plaidoirie qui remplace l’examen des faits par l’accumulation de références savantes : l’autorité d’un nom ne vaut pas argument.",
    "context": "Dans cette comédie judiciaire, l’Intimé plaide une affaire dérisoire de chapon devant le juge Dandin. Il cherche à impressionner en invoquant Aristote et d’autres autorités. Dandin le rappelle obstinément « au fait », révélant l’écart entre prestige savant et pertinence argumentative.",
    "readingQuestions": [
      "Pourquoi l’appel à Aristote paraît-il comique dans cette affaire ?",
      "Quelle différence la scène permet-elle de faire entre une référence et une preuve ?",
      "Pourquoi le prestige d’une autorité peut-il séduire un auditoire sans faire avancer le raisonnement ?"
    ],
    "glossary": [
      {
        "term": "argument d’autorité",
        "definition": "Procédé qui tient une affirmation pour vraie principalement parce qu’elle est attribuée à une personne ou une institution prestigieuse."
      },
      {
        "term": "Péripatétique",
        "definition": "Nom donné à Aristote et à ses disciples, en référence à l’école aristotélicienne."
      }
    ],
    "paragraphs": [
      "L’INTIMÉ. — Sans craindre aucune chose / Je prends donc la parole, et je viens à ma cause. / Aristote, primo, peri Politicon, / Dit fort bien…",
      "DANDIN. — Avocat, il s’agit d’un chapon, / Et non point d’Aristote et de sa Politique.",
      "L’INTIMÉ. — Oui ; mais l’autorité du Péripatétique / Prouverait que le bien et le mal…",
      "DANDIN. — Je prétends / Qu’Aristote n’a point d’autorité céans. / Au fait.",
      "L’INTIMÉ. — Pausanias, en ses Corinthiaques… / DANDIN. — Au fait. / L’INTIMÉ. — Rebuffe… / DANDIN. — Au fait, vous dis-je."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Plaideurs_(%C3%A9ditions_Didot,_1854)",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Autorité ≠ vérité",
        "definition": "Une source prestigieuse peut être pertinente, mais son prestige ne dispense jamais de montrer le lien entre ce qu’elle affirme et la question examinée."
      },
      {
        "type": "plain",
        "definition": "Le comique vient de la disproportion entre la solennité des références et la trivialité de l’affaire : Racine fait sentir immédiatement le défaut de pertinence."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "argument d’autorité",
        "preuve",
        "justice",
        "comique"
      ]
    },
    "relatedTexts": [
      {
        "id": "la-fontaine-loup-agneau-force-raison",
        "kind": "contraste",
        "label": "La Fontaine — Quand la force remplace la raison",
        "relation": "Racine critique la référence prestigieuse sans preuve ; La Fontaine montre une violence qui se dispense complètement de preuve."
      },
      {
        "id": "platon-gorgias-plaire-rendre-meilleur",
        "kind": "proche",
        "label": "Platon — Plaire ou rendre meilleur ?",
        "relation": "Les deux textes interrogent des paroles qui cherchent l’effet sur l’auditeur au lieu de viser d’abord la vérité ou le bien."
      }
    ]
  },
  {
    "id": "hugo-ruy-blas-valet-commandement",
    "section": "autres",
    "cardMeta": "HLP · L’autorité de la parole",
    "title": "« Vous êtes mon valet » : quelques mots rétablissent la hiérarchie",
    "author": "Victor Hugo",
    "authorTag": "Victor Hugo",
    "authorMeta": "(1802–1885) · écrivain français",
    "themes": [
      "Langage",
      "État",
      "Liberté"
    ],
    "work": "Ruy Blas — acte III, scène 5",
    "publication": "1838, texte français original",
    "description": "Après avoir parlé et agi comme un homme d’État, Ruy Blas est ramené par Don Salluste à son statut de domestique : la parole hiérarchique démasque et commande.",
    "context": "Don Salluste a fait passer son valet Ruy Blas pour un noble afin de préparer sa vengeance contre la reine. Devenu ministre et admiré pour son éloquence politique, Ruy Blas paraît avoir conquis une nouvelle identité. Le retour de son maître révèle brutalement que cette position dépend encore du dispositif qui l’a produite.",
    "readingQuestions": [
      "Comment Don Salluste détruit-il progressivement l’identité publique acquise par Ruy Blas ?",
      "Pourquoi la formule « vous êtes mon valet » a-t-elle ici une force supérieure aux qualités réelles de Ruy Blas ?",
      "Qu’est-ce que cette scène montre du rapport entre statut social, pouvoir et reconnaissance ?"
    ],
    "glossary": [
      {
        "term": "statut",
        "definition": "Position reconnue d’un individu dans un ordre social ou institutionnel, assortie de droits, de devoirs et d’attentes."
      },
      {
        "term": "hiérarchie",
        "definition": "Organisation dans laquelle les positions sont ordonnées selon des degrés d’autorité ou de dépendance."
      }
    ],
    "paragraphs": [
      "DON SALLUSTE. — Soyez de votre état. Je suis très-bon, très-doux, / Mais, que diable ! un laquais, d’argile humble ou choisie, / N’est qu’un vase où je veux verser ma fantaisie. / De vous autres, mon cher, on fait tout ce qu’on veut.",
      "Votre maître, selon le dessein qui l’émeut, / À son gré vous déguise, à son gré vous démasque. / Je vous ai fait seigneur. C’est un rôle fantasque, / — Pour l’instant. — Vous avez l’habillement complet. / Mais, ne l’oubliez pas, vous êtes mon valet.",
      "Vous courtisez la reine ici par aventure, / Comme vous monteriez derrière ma voiture. / Soyez donc raisonnable.",
      "DON SALLUSTE. — Vous n’êtes que le gant, et moi je suis la main. [...] Si tu n’obéis pas, si tu n’es pas demain / Chez toi pour préparer ce qu’il faut que je fasse [...] celle pour qui tu crains [...] sera publiquement diffamée et perdue.",
      "RUY BLAS, brisé et d’une voix éteinte. — Il suffit. — Je ferai, monsieur, ce qu’il vous plaît."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Ruy_Blas/Acte_3",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Le pouvoir de nommer une position",
        "definition": "Don Salluste rappelle le statut de Ruy Blas et dispose des preuves capables de l’imposer publiquement. Sa parole est efficace parce qu’elle s’appuie sur une structure de dépendance."
      },
      {
        "type": "plain",
        "definition": "Le contraste est central : Ruy Blas vient de montrer une compétence politique réelle, mais l’ordre social peut néanmoins le réduire au nom de sa naissance et de son contrat de domesticité."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "hiérarchie",
        "statut",
        "commandement",
        "domination"
      ]
    },
    "relatedTexts": [
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "contraste",
        "label": "Corneille — La parole souveraine qui élève et pardonne",
        "relation": "Auguste use de son autorité pour transformer ses ennemis en amis ; Don Salluste l’utilise pour rappeler brutalement une dépendance."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — Les appuis de la domination",
        "relation": "Hugo dramatise une relation personnelle de dépendance que La Boétie invite à penser à l’échelle politique."
      }
    ]
  },
  {
    "id": "platon-gorgias-plaire-rendre-meilleur",
    "section": "philosophie",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Parler pour plaire ou parler pour rendre meilleur ?",
    "author": "Platon",
    "authorTag": "Platon",
    "authorMeta": "(v. 428–348 av. J.-C.) · philosophe grec",
    "themes": [
      "Langage",
      "Vérité",
      "Raison"
    ],
    "work": "Gorgias — 502c–503b",
    "publication": "IVe siècle av. J.-C., trad. Victor Cousin, 1826",
    "description": "Socrate oppose deux usages de la parole publique : flatter l’auditoire en cherchant son plaisir ou lui dire ce qui peut réellement le rendre meilleur.",
    "context": "Dans le Gorgias, Socrate examine la rhétorique et son rapport à la politique. Avec Calliclès, il étend la critique à la poésie et à l’éloquence publique : le succès devant la foule n’est pas encore la preuve que le discours vise son bien.",
    "readingQuestions": [
      "Pourquoi Socrate rapproche-t-il poésie et rhétorique ?",
      "Quelle différence établit-il entre plaire au public et chercher son bien ?",
      "Pourquoi une parole désagréable peut-elle, selon cette distinction, être meilleure qu’une parole séduisante ?"
    ],
    "glossary": [
      {
        "term": "flatterie",
        "definition": "Pratique qui recherche l’agrément et l’approbation de l’auditeur sans se soucier prioritairement de ce qui lui est réellement utile ou bon."
      },
      {
        "term": "rhétorique",
        "definition": "Art ou pratique du discours persuasif ; dans le Gorgias, Socrate en critique les formes qui privilégient l’effet produit au détriment du bien et de la vérité."
      }
    ],
    "paragraphs": [
      "SOCRATE. — N’avons-nous pas vu tout-à-l’heure, Calliclès, que tout cela n’est que flatterie ? — CALLICLÈS. — Assurément.",
      "SOCRATE. — Mais si on ôtait de quelque poésie que ce soit le chant, le rhythme et la mesure, resterait-il autre chose que les paroles ? — CALLICLÈS. — Non.",
      "SOCRATE. — Ces paroles ne s’adressent-elles pas à la multitude et au peuple assemblé ? [...] La poésie est donc une manière de parler au peuple ? [...] Mais si c’est une manière de parler au peuple, c’est donc une rhétorique.",
      "Nous avons donc trouvé une rhétorique pour ce peuple, composé d’enfans, de femmes et d’hommes, de citoyens libres et d’esclaves, confondus ensemble, rhétorique dont nous ne faisons pas grand cas, puisque nous l’avons appelée flatterie.",
      "Et que nous semble de cette rhétorique faite pour le peuple d’Athènes et les peuples des autres cités [...] ? Te paraît-il que les orateurs fassent toujours leurs harangues en vue du plus grand bien, et se proposent pour but de rendre par leurs discours leurs concitoyens aussi vertueux qu’il est possible ? Ou bien [...] s’appliquent-ils uniquement à leur faire plaisir, sans s’inquiéter s’ils deviendront par là meilleurs ou pires ?",
      "S’il y a deux manières de parler au peuple, l’une des deux est une flatterie et une menée honteuse, et l’autre est honnête ; j’entends celle qui travaille à rendre meilleures les âmes des citoyens, et qui s’applique en toute rencontre à dire ce qui est le plus avantageux, que cela doive être agréable ou fâcheux aux auditeurs."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Gorgias_(trad._Cousin)/Dialogue",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Persuader n’est pas encore bien parler",
        "definition": "Un discours peut être très efficace et pourtant mauvais si son efficacité consiste seulement à procurer du plaisir ou à obtenir l’adhésion."
      },
      {
        "type": "plain",
        "definition": "Ce passage peut servir de texte directeur pour « Les séductions de la parole » : il fournit un critère pour distinguer parole flatteuse et parole soucieuse du bien de l’auditeur."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "rhétorique",
        "flatterie",
        "persuasion",
        "bien"
      ]
    },
    "relatedTexts": [
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Trouver le faible de chacun",
        "relation": "Platon critique la parole qui vise seulement l’agrément ; Gracián décrit froidement comment repérer ce qui permet d’agir sur la volonté d’autrui."
      },
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "exemple",
        "label": "Roman de Renart — La flatterie mise en scène",
        "relation": "Renart fournit une démonstration narrative de la flatterie : il identifie le désir de reconnaissance de Chantecler et l’exploite."
      }
    ]
  },
  {
    "id": "gracian-homme-cour-faible-chacun",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Trouver le faible de chacun pour agir sur sa volonté",
    "author": "Baltasar Gracián",
    "authorTag": "Gracián",
    "authorMeta": "(1601–1658) · moraliste espagnol",
    "themes": [
      "Langage",
      "Liberté",
      "Conscience"
    ],
    "work": "L’Homme de cour — XXVI, « Trouver le faible de chacun »",
    "publication": "XVIIe siècle, trad. Amelot de La Houssaie, domaine public",
    "description": "Gracián expose sans détour une technique d’influence : identifier la passion dominante d’une personne, puis s’en servir comme d’une clef pour orienter sa volonté.",
    "context": "L’Homme de cour rassemble des maximes de prudence destinées à celui qui doit évoluer dans le monde social et politique. La maxime XXVI décrit la connaissance des passions non comme une fin théorique, mais comme un moyen d’action sur autrui.",
    "readingQuestions": [
      "Pourquoi Gracián compare-t-il la passion dominante à une « clef » de la volonté ?",
      "Quelle conception de l’être humain suppose cette technique d’influence ?",
      "À partir de quel moment connaître autrui devient-il le manipuler ?"
    ],
    "glossary": [
      {
        "term": "passion dominante",
        "definition": "Désir, intérêt ou affect qui exerce une influence particulièrement forte sur les choix d’une personne."
      },
      {
        "term": "manipulation",
        "definition": "Action d’orienter le comportement d’autrui en exploitant ses dispositions, souvent sans qu’il perçoive clairement le procédé ou le but poursuivi."
      }
    ],
    "paragraphs": [
      "Trouver le faible de chacun. — C’est l’art de manier les volontés et de faire venir les hommes à son but. Il y va plus d’adresse que de résolution à savoir par où il faut entrer dans l’esprit de chacun.",
      "Il n’y a point de volonté qui n’ait sa passion dominante ; et ces passions sont différentes selon la diversité des esprits. Tous les hommes sont idolâtres, les uns de l’honneur, les autres de l’intérêt, et la plupart de leur plaisir.",
      "L’habileté est donc de bien connaître ces idoles, pour entrer dans le faible de ceux qui les adorent : c’est comme tenir la clef de la volonté d’autrui.",
      "Il faut aller au premier mobile : or ce n’est pas toujours la partie supérieure, le plus souvent c’est l’inférieure ; car, en ce monde, le nombre de ceux qui sont déréglés est bien plus grand que celui des autres.",
      "Il faut premièrement connaître le vrai caractère de la personne, et puis lui tâter le pouls, et l’attaquer par sa plus forte passion ; et l’on est assuré par là de gagner la partie."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Page:Baltasar_Graci%C3%A1n_-_L%E2%80%99Homme_de_cour.djvu/15",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Connaître pour influencer",
        "definition": "Le savoir psychologique devient ici stratégique : comprendre les désirs d’autrui sert à sélectionner la parole ou l’action qui aura le plus de prise sur lui."
      },
      {
        "type": "plain",
        "definition": "Le texte est particulièrement utile pour analyser la publicité, la propagande ou la séduction : l’efficacité vient moins d’un argument universel que de l’ajustement au désir du destinataire."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "manipulation",
        "passions",
        "influence",
        "volonté"
      ]
    },
    "relatedTexts": [
      {
        "id": "platon-gorgias-plaire-rendre-meilleur",
        "kind": "proche",
        "label": "Platon — La flatterie et le bien de l’auditeur",
        "relation": "Gracián décrit la technique de l’influence ; Platon fournit un critère normatif pour la juger."
      },
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "exemple",
        "label": "Roman de Renart — Exploiter le désir d’être admiré",
        "relation": "Renart applique exactement la stratégie de Gracián : repérer l’amour-propre de Chantecler, puis le stimuler jusqu’à désarmer sa vigilance."
      }
    ]
  },
  {
    "id": "roman-renart-chantecler-flatterie",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Flatter, rassurer, désarmer, tromper : Renart et Chantecler",
    "author": "Anonyme",
    "authorTag": "Roman de Renart",
    "authorMeta": "Moyen Âge · récit animalier satirique",
    "themes": [
      "Langage",
      "Conscience",
      "Vérité"
    ],
    "work": "Roman de Renart — Renart et Chantecler",
    "publication": "texte médiéval, version française de Paulin Paris, 1861",
    "description": "Renart ne convainc pas Chantecler par une démonstration : il flatte son amour-propre, le pousse à vouloir prouver son talent, puis profite du moment où cette vanité lui fait fermer les yeux.",
    "context": "Après avoir manqué une première attaque contre Chantecler, Renart change de stratégie. Il se présente comme un parent admiratif, compare le coq à son père réputé pour son chant, puis transforme l’éloge en défi. Chantecler finit par faire exactement ce qui le rend vulnérable.",
    "readingQuestions": [
      "Pourquoi Renart commence-t-il par se présenter comme un ami et un parent ?",
      "Comment passe-t-il de l’éloge à la comparaison blessante avec Chanteclin ?",
      "À quel moment Chantecler cesse-t-il d’agir selon sa prudence pour agir selon son amour-propre ?"
    ],
    "glossary": [
      {
        "term": "flatterie",
        "definition": "Éloge intéressé qui vise moins à dire vrai qu’à obtenir la faveur ou à influencer la conduite de celui qui l’entend."
      },
      {
        "term": "amour-propre",
        "definition": "Attachement à l’image valorisante que l’on a de soi et au désir d’être reconnu ou admiré par les autres."
      }
    ],
    "paragraphs": [
      "« Ah ! mon Dieu, Chantecler, dit-il de sa voix la plus douce, vous vous éloignez comme si vous aviez peur de votre meilleur ami. De grace, laissez-moi vous dire combien je suis heureux de vous voir si dispos et si agile. Nous sommes cousins germains, vous savez. »",
      "Chantecler ne répondit pas, soit qu’il restât défiant, soit que le plaisir de s’entendre louer par un parent qu’il avoit méconnu lui ôtât la parole. Mais pour montrer qu’il n’avoit pas peur, il entonna un brillant sonnet.",
      "« Oui, c’est assez bien chanté, dit Renart, mais vous souvient-il du bon Chanteclin qui vous mit au monde ? Ah ! c’est lui qu’il falloit entendre. Jamais personne de sa race n’en approchera. Il avoit, je m’en souviens, la voix si haute, si claire, qu’on l’écoutoit une lieue à la ronde, et pour prolonger les sons tout d’une haleine, il lui suffisoit d’ouvrir la bouche et de fermer les yeux. »",
      "« La vérité c’est que je n’aime rien tant que la bonne musique, et je m’y connois. Vous chanteriez bien si vous vouliez ; clignez seulement un peu de l’œil, et commencez un de vos meilleurs airs. »",
      "Le coq, un œil ouvert l’autre fermé, et toujours un peu sur ses gardes, commence alors un grand air. « Franchement, dit Renart, cela n’a rien de vraiment remarquable ; mais Chanteclin, ah ! c’étoit lui : quelle différence ! »",
      "Ces mots piquèrent assez Chantecler pour lui faire oublier tout, afin de se relever dans l’estime de son cousin : il cligna des yeux, il lança une note qu’il prolongeoit à perte d’haleine, quand l’autre croyant le bon moment venu, s’élance comme une flèche, le saisit au col et se met à la fuite avec sa proie."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Le_Roman_de_Renart/Aventure_2",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "La séduction exploite un désir déjà présent",
        "definition": "Renart ne crée pas de toutes pièces la vanité de Chantecler : il repère son désir d’être admiré et construit son discours autour de ce point faible."
      },
      {
        "type": "plain",
        "definition": "La progression est très lisible : rassurer (« ami »), flatter, comparer, provoquer, obtenir un comportement dangereux. Le texte permet de décomposer une manipulation étape par étape."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "flatterie",
        "amour-propre",
        "ruse",
        "manipulation"
      ]
    },
    "relatedTexts": [
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Trouver le faible de chacun",
        "relation": "Le récit donne une illustration concrète de la maxime de Gracián : la passion dominante devient la clef de la volonté."
      },
      {
        "id": "platon-gorgias-plaire-rendre-meilleur",
        "kind": "proche",
        "label": "Platon — Quand plaire devient flatter",
        "relation": "Renart cherche exclusivement l’effet produit sur Chantecler ; le Gorgias fournit le vocabulaire conceptuel pour qualifier cette stratégie."
      }
    ]
  },
  {
    "id": "shakespeare-othello-iago-jalousie",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Iago installe le soupçon sans jamais l’affirmer",
    "author": "William Shakespeare",
    "authorTag": "Shakespeare",
    "authorMeta": "(1564–1616) · dramaturge anglais",
    "themes": [
      "Langage",
      "Conscience",
      "Vérité"
    ],
    "work": "Othello — acte III, scène 3",
    "publication": "1604, trad. Émile Montégut, 1872",
    "description": "Iago manipule Othello par insinuations : il paraît retenir ses pensées, suggère un danger, puis laisse Othello produire lui-même le soupçon qui le détruira.",
    "context": "Iago veut persuader Othello que Desdémona le trompe avec Cassio. Il ne formule d’abord aucune accusation nette : il met en scène sa réticence, avertit contre la jalousie et fournit des indices ambigus. Cette stratégie donne au soupçon l’apparence d’une conclusion découverte par Othello lui-même.",
    "readingQuestions": [
      "Pourquoi Iago refuse-t-il d’abord de dire clairement ce qu’il pense ?",
      "Comment l’avertissement contre la jalousie contribue-t-il paradoxalement à rendre Othello jaloux ?",
      "Pourquoi une suggestion peut-elle être plus efficace qu’une accusation directe ?"
    ],
    "glossary": [
      {
        "term": "insinuation",
        "definition": "Manière de faire naître une idée sans l’énoncer explicitement, afin que l’interlocuteur semble l’avoir formée lui-même."
      },
      {
        "term": "soupçon",
        "definition": "Jugement incertain par lequel on tient une faute pour possible sans disposer encore d’une preuve."
      }
    ],
    "paragraphs": [
      "IAGO. — Vous laisser connaître mes pensées ne vaudrait rien pour votre tranquillité et votre bien, ni pour mon honneur d’homme, mon honnêteté et ma sagesse.",
      "OTHELLO. — Par le ciel je connaîtrai tes pensées !",
      "IAGO. — Ô Monseigneur, prenez garde à la jalousie, c’est le monstre aux yeux verts qui se moque de la viande dont il se nourrit.",
      "IAGO. — Je ne parle pas encore de preuves. Veillez sur votre femme, observez-la bien avec Cassio ; faites usage de vos yeux, sans jalousie et sans confiance.",
      "IAGO. — Elle trompa son père en vous épousant ; au moment où elle semblait frissonner et avoir peur devant vos regards, c’est alors qu’elle les aimait le plus."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Othello/Traduction_Mont%C3%A9gut,_1872",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Faire naître une conclusion chez l’autre",
        "definition": "Iago ne cherche pas seulement à transmettre une information : il construit les conditions pour qu’Othello interprète lui-même les faits dans le sens voulu."
      },
      {
        "type": "plain",
        "definition": "Le discours paraît prudent et bienveillant. Cette apparence protège le manipulateur tout en rendant ses suggestions plus crédibles."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "manipulation",
        "insinuation",
        "jalousie",
        "soupçon"
      ]
    },
    "relatedTexts": [
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Trouver le faible de chacun",
        "relation": "Iago exploite méthodiquement le point vulnérable d’Othello."
      },
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "proche",
        "label": "Roman de Renart — Flatter pour désarmer",
        "relation": "Deux stratégies où le locuteur obtient que sa victime agisse elle-même contre son intérêt."
      }
    ]
  },
  {
    "id": "moliere-dom-juan-detourner-langage",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Trois manières de détourner le langage à son profit",
    "author": "Molière",
    "authorTag": "Molière",
    "authorMeta": "(1622–1673) · dramaturge français",
    "themes": [
      "Langage",
      "Vérité",
      "Morale"
    ],
    "work": "Dom Juan — actes II, IV et V",
    "publication": "1665, texte français original",
    "description": "Séduire, esquiver une dette, se couvrir d’une respectabilité religieuse : Dom Juan transforme successivement le langage en instrument de conquête, d’évitement et de dissimulation.",
    "context": "Cette fiche rassemble trois moments de la pièce. Avec Charlotte et Mathurine, Dom Juan distribue des promesses incompatibles. Face à M. Dimanche, il noie la demande d’argent sous les civilités. Enfin, il annonce qu’il adoptera publiquement le langage de la dévotion comme masque social.",
    "readingQuestions": [
      "Qu’est-ce qui change entre la séduction amoureuse, la politesse envers M. Dimanche et l’hypocrisie religieuse ?",
      "Pourquoi les civilités de Dom Juan empêchent-elles M. Dimanche de formuler sa demande ?",
      "En quoi l’hypocrisie donne-t-elle au langage un pouvoir de protection sociale ?"
    ],
    "glossary": [
      {
        "term": "hypocrisie",
        "definition": "Dissimulation de ses intentions ou de ses vices sous l’apparence de sentiments, de principes ou de vertus que l’on n’a pas."
      },
      {
        "term": "détournement",
        "definition": "Usage d’une forme de langage à une fin différente de sa fonction apparente : complimenter pour éviter, promettre pour séduire, moraliser pour se protéger."
      }
    ],
    "paragraphs": [
      "ACTE II — Dom Juan à Charlotte et Mathurine : « Est-ce que chacune de vous ne sait pas ce qui en est, sans qu’il soit nécessaire que je m’explique davantage ? Pourquoi m’obliger là-dessus à des redites ? »",
      "ACTE IV — DON JUAN. — Parbleu ! monsieur Dimanche, vous vous portez bien. — MONSIEUR DIMANCHE. — Oui, monsieur, pour vous rendre service. Je suis venu… — DON JUAN. — Vous avez un fonds de santé admirable, des lèvres fraîches, un teint vermeil, et des yeux vifs.",
      "MONSIEUR DIMANCHE. — Il est vrai ; il me fait tant de civilités et tant de compliments, que je ne saurais jamais lui demander de l’argent.",
      "ACTE V — DON JUAN. — L’hypocrisie est un vice à la mode, et tous les vices à la mode passent pour vertus. Le personnage d’homme de bien est le meilleur de tous les personnages qu’on puisse jouer aujourd’hui."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Dom_Juan_ou_le_Festin_de_pierre/%C3%89dition_Louandre,_1910",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Le langage comme masque",
        "definition": "Dom Juan adapte son discours à la faiblesse ou à la norme qui peut lui être utile : désir amoureux, politesse sociale, religion."
      },
      {
        "type": "plain",
        "definition": "Les trois scènes permettent de comparer trois procédés : promettre sans s’engager, empêcher l’autre de parler, afficher une vertu que l’on ne possède pas."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "séduction",
        "politesse",
        "hypocrisie",
        "stratégie"
      ]
    },
    "relatedTexts": [
      {
        "id": "shakespeare-othello-iago-jalousie",
        "kind": "proche",
        "label": "Shakespeare — Manipuler par insinuation",
        "relation": "Iago et Dom Juan cachent leur intention réelle derrière un langage apparemment favorable à l’interlocuteur."
      },
      {
        "id": "la-rochefoucauld-maximes-conversation-vanite",
        "kind": "proche",
        "label": "La Rochefoucauld — Vanité et conversation",
        "relation": "La scène de M. Dimanche montre concrètement comment la conversation peut servir l’amour-propre et la domination."
      }
    ]
  },
  {
    "id": "la-rochefoucauld-maximes-conversation-vanite",
    "section": "philosophie",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Pourquoi parlons-nous parfois davantage pour nous-mêmes que pour l’autre ?",
    "author": "François de La Rochefoucauld",
    "authorTag": "La Rochefoucauld",
    "authorMeta": "(1613–1680) · moraliste français",
    "themes": [
      "Langage",
      "Conscience",
      "Vérité"
    ],
    "work": "Maximes — CXXXVII à CXXXIX",
    "publication": "1665–1678, texte français original",
    "description": "Trois maximes dévoilent les ressorts cachés de la conversation : vanité, désir d’occuper la scène et difficulté réelle à écouter.",
    "context": "La Rochefoucauld observe les conduites sociales à partir de l’amour-propre. Dans ces maximes, il montre que même une conversation apparemment tournée vers autrui peut être structurée par le désir de parler de soi et de préparer sa propre réponse.",
    "readingQuestions": [
      "Pourquoi la vanité nous pousse-t-elle à parler ?",
      "Quelle différence y a-t-il entre avoir l’air attentif et écouter réellement ?",
      "Pourquoi bien écouter est-il, selon La Rochefoucauld, une condition pour plaire et persuader ?"
    ],
    "glossary": [
      {
        "term": "vanité",
        "definition": "Désir d’être remarqué, estimé ou admiré, souvent en donnant une importance excessive à l’image de soi."
      },
      {
        "term": "amour-propre",
        "definition": "Attachement à soi et à l’opinion que les autres ont de nous, qui peut orienter secrètement nos conduites."
      }
    ],
    "paragraphs": [
      "CXXXVII — On parle peu, quand la vanité ne fait pas parler.",
      "CXXXVIII — On aime mieux dire du mal de soi-même que de n’en point parler.",
      "CXXXIX — Il n’y a presque personne qui ne pense plutôt à ce qu’il veut dire qu’à répondre précisément à ce qu’on lui dit.",
      "Les plus habiles et les plus complaisants se contentent de montrer seulement une mine attentive […] au lieu de considérer que c’est un mauvais moyen de plaire aux autres, ou de les persuader, que de chercher si fort à se plaire à soi-même, et que bien écouter et bien répondre est une des plus grandes perfections qu’on puisse avoir dans la conversation."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/%C5%92uvres_de_La_Rochefoucauld_-_T.1/R%C3%A9flexions_ou_sentences_et_maximes_morales",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Une parole tournée vers l’image de soi",
        "definition": "La conversation peut sembler échange tout en étant gouvernée par le souci de paraître, de briller ou simplement de ne pas disparaître du discours."
      },
      {
        "type": "plain",
        "definition": "Le texte permet d’introduire une critique très simple de la persuasion : celui qui veut trop parler de lui devient moins capable de comprendre celui qu’il cherche à convaincre."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "conversation",
        "vanité",
        "écoute",
        "persuasion"
      ]
    },
    "relatedTexts": [
      {
        "id": "moliere-dom-juan-detourner-langage",
        "kind": "proche",
        "label": "Molière — Détourner la conversation",
        "relation": "Dom Juan exploite précisément l’impossibilité de M. Dimanche à reprendre la maîtrise de l’échange."
      }
    ]
  },
  {
    "id": "ronsard-mignonne-rose-carpe-diem",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Séduire en transformant une image en argument",
    "author": "Pierre de Ronsard",
    "authorTag": "Ronsard",
    "authorMeta": "(1524–1585) · poète français",
    "themes": [
      "Langage",
      "Temps",
      "Bonheur"
    ],
    "work": "Odes — « Mignonne, allons voir si la rose »",
    "publication": "1553, texte français original",
    "description": "Le poème est aussi une argumentation : la rose fanée devient preuve de la fuite du temps, puis justification de l’impératif « Cueillez votre jeunesse ».",
    "context": "Ronsard adresse à Cassandre une ode construite autour d’une comparaison entre la beauté de la rose et celle de la jeune femme. L’émotion poétique soutient ainsi une stratégie persuasive : montrer, faire sentir la fragilité, puis conclure par un conseil.",
    "readingQuestions": [
      "Comment le poème passe-t-il d’une observation de la rose à un conseil adressé à la jeune femme ?",
      "Pourquoi l’image de la fleur rend-elle l’argument plus sensible ?",
      "Le poème cherche-t-il davantage à démontrer ou à séduire ?"
    ],
    "glossary": [
      {
        "term": "carpe diem",
        "definition": "Invitation à profiter du présent parce que le temps passe et que les biens de la jeunesse sont fragiles."
      },
      {
        "term": "analogie",
        "definition": "Rapprochement de deux réalités à partir d’une ressemblance afin d’éclairer ou de soutenir un raisonnement."
      }
    ],
    "paragraphs": [
      "Mignonne, allons voir si la rose / Qui ce matin avait déclose / Sa robe de pourpre au Soleil, / A point perdu cette vêprée / Les plis de sa robe pourprée, / Et son teint au vôtre pareil.",
      "Las ! voyez comme en peu d’espace, / Mignonne, elle a dessus la place, / Las ! las ! ses beautés laissé choir ! / Ô vraiment marâtre Nature, / Puisqu’une telle fleur ne dure / Que du matin jusques au soir !",
      "Donc, si vous me croyez, mignonne, / Tandis que votre âge fleuronne / En sa plus verte nouveauté, / Cueillez, cueillez votre jeunesse : / Comme à cette fleur, la vieillesse / Fera ternir votre beauté."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Odes_(Ronsard)/%C2%AB_Mignonne,_allons_voir_si_la_rose_%C2%BB",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Une argumentation affective",
        "definition": "Le locuteur ne se contente pas d’une thèse abstraite sur le temps : il fait voir la rose, suscite le regret, puis transforme cette émotion en motif d’action."
      },
      {
        "type": "plain",
        "definition": "La structure est très nette : constat → analogie → conséquence → impératif."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "séduction",
        "carpe diem",
        "argumentation",
        "temps"
      ]
    },
    "relatedTexts": [
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "contraste",
        "label": "Rousseau — La sincérité contre le brillant du style",
        "relation": "Ronsard assume l’artifice poétique ; Rousseau demande si un langage très travaillé prouve ou affaiblit la vérité du sentiment."
      }
    ]
  },
  {
    "id": "rousseau-julie-lettre-amour-sincerite",
    "section": "philosophie",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Une lettre trop brillante peut-elle encore être sincère ?",
    "author": "Jean-Jacques Rousseau",
    "authorTag": "Rousseau",
    "authorMeta": "(1712–1778) · philosophe et écrivain genevois",
    "themes": [
      "Langage",
      "Vérité",
      "Conscience"
    ],
    "work": "Julie ou La Nouvelle Héloïse — Seconde préface",
    "publication": "1761, texte français original",
    "description": "Rousseau oppose le brillant d’une lettre d’amour fabriquée pour produire un effet au désordre d’une parole réellement dictée par la passion.",
    "context": "Dans la seconde préface dialoguée de Julie, Rousseau défend le style de ses lettres contre l’accusation d’emphase. Il propose un critère paradoxal : la passion authentique ne cherche pas d’abord à briller ni même à persuader ; son désordre peut être le signe de sa vérité.",
    "readingQuestions": [
      "Pourquoi Rousseau oppose-t-il le « bel esprit » à l’amant réellement passionné ?",
      "Comment le désordre du langage peut-il devenir un signe de sincérité ?",
      "Peut-on fabriquer les signes mêmes de la spontanéité ?"
    ],
    "glossary": [
      {
        "term": "sincérité",
        "definition": "Accord entre ce qu’une personne exprime et ce qu’elle éprouve ou pense réellement."
      },
      {
        "term": "emphase",
        "definition": "Expression volontairement grandiose ou appuyée, qui peut donner au discours une apparence artificielle."
      }
    ],
    "paragraphs": [
      "Croyez-vous que les gens vraiment passionnés aient ces manières de parler vives, fortes, coloriées, que vous admirez dans vos drames et dans vos romans ? Non ; la passion, pleine d’elle-même, s’exprime avec plus d’abondance que de force : elle ne songe pas même à persuader.",
      "Lisez une lettre d’amour faite par un auteur dans son cabinet, par un bel esprit qui veut briller ; […] vous serez enchanté, même agité peut-être, mais d’une agitation passagère et sèche, qui ne vous laissera que des mots pour tout souvenir.",
      "Au contraire, une lettre que l’amour a réellement dictée […] sera lâche, diffuse, toute en longueurs, en désordre, en répétitions. Son cœur, plein d’un sentiment qui déborde, redit toujours la même chose.",
      "Si la force du sentiment ne nous frappe pas, sa vérité nous touche ; et c’est ainsi que le cœur sait parler au cœur."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Julie_ou_la_Nouvelle_H%C3%A9lo%C3%AFse/Appendice",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "L’éloquence du désordre",
        "definition": "Rousseau renverse le critère esthétique : une parole moins parfaite peut toucher davantage si son imperfection paraît issue d’un sentiment véritable."
      },
      {
        "type": "plain",
        "definition": "Le texte permet d’interroger un problème décisif de la séduction : comment distinguer ce qui exprime un sentiment de ce qui imite efficacement ses signes ?"
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "sincérité",
        "lettre",
        "passion",
        "rhétorique"
      ]
    },
    "relatedTexts": [
      {
        "id": "laclos-liaisons-lettre-56-tourvel",
        "kind": "proche",
        "label": "Laclos — Écrire pour résister et se convaincre",
        "relation": "Les Liaisons dangereuses montrent combien le langage du sentiment peut aussi devenir stratégie et autojustification."
      }
    ]
  },
  {
    "id": "laclos-liaisons-lettre-56-tourvel",
    "section": "autres",
    "cardMeta": "HLP · Les séductions de la parole",
    "title": "Résister à la séduction tout en entrant dans son langage",
    "author": "Pierre Choderlos de Laclos",
    "authorTag": "Laclos",
    "authorMeta": "(1741–1803) · écrivain français",
    "themes": [
      "Langage",
      "Conscience",
      "Liberté"
    ],
    "work": "Les Liaisons dangereuses — lettre LVI",
    "publication": "1782, texte français original",
    "description": "Tourvel répond à Valmont pour repousser son amour, mais la lettre révèle déjà la difficulté de rester extérieure au langage affectif qu’elle prétend refuser.",
    "context": "La présidente de Tourvel veut mettre fin aux déclarations de Valmont. Elle organise rationnellement son refus, évoque la sincérité possible des sentiments de son correspondant et tente de lui ôter toute espérance. Cette volonté de maîtrise laisse pourtant apparaître combien la relation l’affecte déjà.",
    "readingQuestions": [
      "Pourquoi Tourvel accepte-t-elle provisoirement l’hypothèse que Valmont l’aime véritablement ?",
      "En quoi la lettre cherche-t-elle à convaincre Valmont mais aussi Tourvel elle-même ?",
      "Pourquoi répondre à une déclaration peut-il déjà signifier entrer dans le jeu de la séduction ?"
    ],
    "glossary": [
      {
        "term": "autojustification",
        "definition": "Discours par lequel une personne donne à elle-même et aux autres des raisons qui rendent sa conduite cohérente ou acceptable."
      },
      {
        "term": "ambiguïté",
        "definition": "Caractère d’un discours ou d’une situation qui autorise plusieurs interprétations ou laisse coexister des intentions contradictoires."
      }
    ],
    "paragraphs": [
      "À quoi vous servirait, Monsieur, la réponse que vous me demandez ? Croire à vos sentiments, ne serait-ce pas une raison de plus pour les craindre ?",
      "Supposé que vous m’aimiez véritablement […] les obstacles qui nous séparent en seraient-ils moins insurmontables ?",
      "Vous savez assez qu’il m’est impossible de le partager ; et quand même ce malheur m’arriverait, j’en serais plus à plaindre, sans que vous en fussiez plus heureux.",
      "Je consens donc à croire que vous avez pu avoir pour moi quelques sentiments ; mais je ne veux pas, je ne dois pas les connaître davantage."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Liaisons_dangereuses/Lettre_56",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Écrire pour fixer une frontière",
        "definition": "Tourvel tente de faire de sa lettre un acte de clôture : elle formule les raisons qui doivent rendre la relation impossible."
      },
      {
        "type": "plain",
        "definition": "Le paradoxe est que l’effort même pour discuter l’amour de Valmont donne à cet amour une place centrale dans la pensée et dans le langage de Tourvel."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "lettre",
        "séduction",
        "résistance",
        "autojustification"
      ]
    },
    "relatedTexts": [
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une lettre d’amour peut-elle être vraie ?",
        "relation": "Rousseau théorise la vérité du sentiment ; Laclos met en scène les ambiguïtés concrètes du langage amoureux."
      }
    ]
  },
  {
    "id": "epictete-manuel-46-vivre-principes",
    "section": "philosophie",
    "cardMeta": "HLP · Éducation, transmission et émancipation",
    "title": "Ne récite pas tes principes : montre-les par ta conduite",
    "author": "Épictète",
    "authorTag": "Épictète",
    "authorMeta": "(v. 50–v. 125) · philosophe stoïcien",
    "themes": [
      "Morale",
      "Liberté",
      "Éducation"
    ],
    "work": "Manuel — XLVI",
    "publication": "IIe siècle, trad. Jean-Marie Guyau, 1875",
    "description": "Épictète oppose l’affichage verbal de la philosophie à son incorporation dans une manière de vivre : l’enseignement le plus convaincant passe par l’exemple.",
    "context": "Le Manuel condense des règles pratiques stoïciennes. Au paragraphe XLVI, Épictète met en garde celui qui veut se présenter comme philosophe en récitant ses doctrines : le véritable progrès se reconnaît dans les actes.",
    "readingQuestions": [
      "Pourquoi Épictète se méfie-t-il de celui qui expose constamment ses principes ?",
      "Quelle différence fait-il entre connaître une doctrine et l’avoir assimilée ?",
      "En quoi l’exemple peut-il être une forme de transmission plus forte que le discours ?"
    ],
    "glossary": [
      {
        "term": "exemplarité",
        "definition": "Capacité d’une conduite à servir de modèle parce qu’elle rend visibles des principes dans des actes."
      },
      {
        "term": "stoïcisme",
        "definition": "École philosophique antique qui cherche notamment la liberté intérieure par la maîtrise des jugements et la distinction de ce qui dépend de nous."
      }
    ],
    "paragraphs": [
      "Ne te dis jamais philosophe, et ne parle pas beaucoup, devant les profanes, des principes de la philosophie ; mais agis selon ces principes.",
      "Ainsi, dans un repas, ne dis pas comment il faut manger, mais mange comme il faut.",
      "Si, dans une compagnie de profanes, il tombe quelque discours sur un principe de philosophie, garde le silence autant que tu le peux ; car il y a grand danger à vomir aussitôt ce qu’on n’a pas digéré.",
      "Les moutons ne montrent pas aux bergers combien ils ont mangé ; mais, après avoir digéré leur nourriture au dedans, ils produisent au dehors de la laine et du lait."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Manuel_d%E2%80%99%C3%89pict%C3%A8te_(trad._Guyau)",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "La transmission par l’exemple",
        "definition": "L’autorité du maître ne vient pas ici d’un titre ni d’une éloquence, mais de la cohérence visible entre ce qu’il enseigne et ce qu’il fait."
      },
      {
        "type": "plain",
        "definition": "L’image de la digestion est centrale : une idée vraiment apprise doit être transformée en conduite avant d’être exhibée en paroles."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Éducation, transmission et émancipation",
      "tags": [
        "éducation",
        "exemple",
        "stoïcisme",
        "maîtrise de soi"
      ]
    },
    "relatedTexts": []
  },
  {
    "id": "sappho-fragment-31-parole-corps",
    "section": "autres",
    "cardMeta": "HLP · Expressions de la sensibilité",
    "title": "Quand la passion défait la parole et bouleverse le corps",
    "author": "Sappho",
    "authorTag": "Sappho",
    "authorMeta": "(VIIe–VIe siècle av. J.-C.) · poétesse grecque",
    "themes": [
      "Conscience",
      "Langage",
      "Corps"
    ],
    "work": "Fragment 31 — « Ode à une femme aimée »",
    "publication": "Antiquité, trad. Renée Vivien, 1903",
    "description": "Le poème décrit la passion comme événement corporel total : langue brisée, vue troublée, oreilles bourdonnantes, sueur et tremblement.",
    "context": "Dans le fragment 31, la présence de l’être aimé rend impossible la maîtrise ordinaire de soi. L’émotion n’est pas seulement racontée : le poème en inventorie les effets physiques jusqu’à la défaillance de la parole.",
    "readingQuestions": [
      "Pourquoi la parole est-elle le premier pouvoir qui se défait ?",
      "Comment le corps devient-il le lieu où le sentiment se rend visible ?",
      "Le poème décrit-il une émotion ou la fait-il éprouver au lecteur ?"
    ],
    "glossary": [
      {
        "term": "sensibilité",
        "definition": "Capacité à éprouver des impressions, émotions et affects, notamment dans leur dimension corporelle."
      },
      {
        "term": "phénoménologie",
        "definition": "Description attentive de la manière dont une expérience apparaît à la conscience et se donne à vivre."
      }
    ],
    "paragraphs": [
      "Il me paraît l’égal des Dieux, l’homme qui est assis dans ta présence et qui entend de près ton doux langage et ton rire désirable, qui font battre mon cœur au fond de ma poitrine.",
      "Car lorsque je t’aperçois, ne fût-ce qu’un instant, je n’ai plus de paroles, ma langue est brisée, et soudain un feu subtil court sous ma peau.",
      "Mes yeux ne voient plus, mes oreilles bourdonnent, la sueur m’inonde et un tremblement m’agite toute ; je suis plus pâle que l’herbe, et dans ma folie je semble presque une morte…"
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Sapho_(Vivien)/Texte_entier",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "L’émotion comme événement du corps",
        "definition": "La passion n’est pas présentée comme une simple idée intérieure : elle reconfigure la perception, la voix, la température et le mouvement du corps."
      },
      {
        "type": "plain",
        "definition": "Le texte est particulièrement utile pour montrer que l’expression de la sensibilité peut passer par le constat d’une impossibilité à parler."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "passion",
        "corps",
        "parole",
        "perception"
      ]
    },
    "relatedTexts": [
      {
        "id": "louise-labe-sonnet-8-je-vis-je-meurs",
        "kind": "proche",
        "label": "Louise Labé — La passion comme contradiction",
        "relation": "Les deux poèmes traduisent l’amour par une série d’états corporels et psychiques contradictoires."
      }
    ]
  },
  {
    "id": "louise-labe-sonnet-8-je-vis-je-meurs",
    "section": "autres",
    "cardMeta": "HLP · Expressions de la sensibilité",
    "title": "« Je vis, je meurs » : éprouver simultanément des contraires",
    "author": "Louise Labé",
    "authorTag": "Louise Labé",
    "authorMeta": "(v. 1524–1566) · poétesse française",
    "themes": [
      "Conscience",
      "Bonheur",
      "Corps"
    ],
    "work": "Sonnets — VIII, « Je vis, je meurs »",
    "publication": "1555, texte français original",
    "description": "La passion est exprimée comme instabilité radicale : rire et larmes, chaleur et froid, plaisir et douleur se succèdent ou coexistent.",
    "context": "Le sonnet accumule les antithèses pour rendre sensible une expérience qui échappe à l’identité stable. Le sujet amoureux découvre qu’il ne maîtrise ni la succession ni la contradiction de ses propres états.",
    "readingQuestions": [
      "Pourquoi le poème accumule-t-il les couples de contraires ?",
      "Qui est présenté comme l’agent des transformations du sujet ?",
      "En quoi la forme poétique rend-elle sensible l’instabilité du moi ?"
    ],
    "glossary": [
      {
        "term": "antithèse",
        "definition": "Figure qui rapproche deux termes ou idées opposés afin de faire ressortir leur contraste."
      },
      {
        "term": "affect",
        "definition": "État de plaisir, de douleur, de désir ou d’émotion qui modifie la manière dont un sujet se sent et perçoit le monde."
      }
    ],
    "paragraphs": [
      "Je vis, je meurs ; je me brûle et me noie. / J’ai chaud extrême en endurant froidure ; / La vie m’est et trop molle et trop dure. / J’ai grands ennuis entremêlés de joie.",
      "Tout à un coup je ris et je larmoie. / Et en plaisir maint grief tourment j’endure ; / Mon bien s’en va, et à jamais il dure. / Tout en un coup je sèche et je verdoie.",
      "Ainsi Amour inconstamment me mène : / Et quand je pense avoir plus de douleur, / Sans y penser je me trouve hors de peine.",
      "Puis quand je crois ma joie être certaine, / Et être au haut de mon désiré heur, / Il me remet en mon premier malheur."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Muses_fran%C3%A7aises/Louise_Labb%C3%A9",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Un moi traversé par ses affects",
        "definition": "Le « je » demeure grammaticalement le même, mais son expérience est faite de métamorphoses rapides et contradictoires."
      },
      {
        "type": "plain",
        "definition": "Le sujet ne dit pas « je décide » : « Amour […] me mène ». La sensibilité apparaît comme une puissance qui agit sur lui."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "passion",
        "contradiction",
        "moi",
        "amour"
      ]
    },
    "relatedTexts": [
      {
        "id": "sappho-fragment-31-parole-corps",
        "kind": "proche",
        "label": "Sappho — La passion bouleverse le corps",
        "relation": "Sappho décrit la défaillance corporelle ; Labé organise la même instabilité sous forme d’antithèses."
      }
    ]
  },
  {
    "id": "racine-phedre-aveu-hippolyte",
    "section": "autres",
    "cardMeta": "HLP · Expressions de la sensibilité",
    "title": "L’aveu de Phèdre : dire ce qui ne pourra plus être retiré",
    "author": "Jean Racine",
    "authorTag": "Racine",
    "authorMeta": "(1639–1699) · dramaturge français",
    "themes": [
      "Conscience",
      "Langage",
      "Morale"
    ],
    "work": "Phèdre — acte II, scène 5",
    "publication": "1677, texte français original",
    "description": "Phèdre tente d’abord de parler de son fils et de Thésée ; sa parole dérive jusqu’à l’aveu de sa passion interdite pour Hippolyte.",
    "context": "Croyant Thésée mort, Phèdre rencontre Hippolyte. Elle veut lui demander protection pour son fils mais, dans le mouvement même de son discours, elle assimile Hippolyte à son père et finit par reconnaître explicitement son amour. L’aveu transforme immédiatement la relation.",
    "readingQuestions": [
      "Comment le discours de Phèdre glisse-t-il de Thésée à Hippolyte ?",
      "Pourquoi l’aveu semble-t-il à la fois voulu et arraché à Phèdre ?",
      "Qu’est-ce qui devient irréversible une fois la passion dite ?"
    ],
    "glossary": [
      {
        "term": "aveu",
        "definition": "Déclaration par laquelle une personne reconnaît explicitement une vérité personnelle qu’elle cachait ou résistait à dire."
      },
      {
        "term": "interdit",
        "definition": "Limite morale, sociale ou juridique qui rend une conduite impossible ou condamnable."
      }
    ],
    "paragraphs": [
      "Le voici : vers mon cœur tout mon sang se retire. / J’oublie, en le voyant, ce que je viens lui dire.",
      "Oui, Prince, je languis, je brûle pour Thésée. / Je l’aime, non point tel que l’ont vu les enfers, / Volage adorateur de mille objets divers […] / Mais fidèle, mais fier, et même un peu farouche, / Charmant, jeune, traînant tous les cœurs après soi, / Tel qu’on dépeint nos dieux, ou tel que je vous voi.",
      "Ah cruel ! tu m’as trop entendue. / Je t’en ai dit assez pour te tirer d’erreur. / Hé bien ! connais donc Phèdre et toute sa fureur.",
      "J’aime. Ne pense pas qu’au moment que je t’aime, / Innocente à mes yeux, je m’approuve moi-même."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Ph%C3%A8dre_(Racine),_Didot,_1854/Acte_II",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "L’aveu comme transformation",
        "definition": "Dire l’amour ne se contente pas de décrire un état intérieur : l’aveu crée une nouvelle situation entre Phèdre et Hippolyte."
      },
      {
        "type": "plain",
        "definition": "Le langage montre ici une sensibilité qui déborde le contrôle du sujet : Phèdre cherche à parler d’autre chose, mais son discours revient vers l’objet de sa passion."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "aveu",
        "passion",
        "honte",
        "interdit"
      ]
    },
    "relatedTexts": [
      {
        "id": "sappho-fragment-31-parole-corps",
        "kind": "proche",
        "label": "Sappho — Quand le sentiment défait la parole",
        "relation": "Dans les deux textes, la passion se manifeste par une perte de maîtrise de soi et du langage."
      }
    ]
  },
  {
    "id": "ovide-narcisse-reflet",
    "section": "mythologie",
    "cardMeta": "HLP · Les métamorphoses du moi",
    "title": "Narcisse découvre qu’il désire sa propre image",
    "author": "Ovide",
    "authorTag": "Ovide",
    "authorMeta": "(43 av. J.-C.–17/18 ap. J.-C.) · poète latin",
    "themes": [
      "Conscience",
      "Désir",
      "Vérité"
    ],
    "work": "Métamorphoses — livre III, Narcisse",
    "publication": "Ier siècle, trad. Étienne Gros, 1866",
    "description": "Narcisse prend son reflet pour un autre être, puis découvre progressivement que l’objet de son désir est sa propre image.",
    "context": "Après avoir repoussé celles et ceux qui l’aiment, Narcisse s’arrête près d’une source parfaitement claire. Il tombe amoureux de l’apparition qu’il y voit. Le récit interroge l’identité, la représentation de soi et l’illusion produite par une image qui ressemble parfaitement au sujet.",
    "readingQuestions": [
      "Pourquoi Narcisse prend-il d’abord son image pour un autre être ?",
      "Que change la découverte que l’objet aimé est lui-même ?",
      "Le reflet lui donne-t-il une connaissance de soi ou l’enferme-t-il dans une illusion ?"
    ],
    "glossary": [
      {
        "term": "narcissisme",
        "definition": "Par extension du mythe, investissement excessif de sa propre image ou de soi-même comme objet privilégié d’admiration et de désir."
      },
      {
        "term": "reflet",
        "definition": "Image produite par la réflexion de la lumière ; dans le mythe, il devient aussi une représentation problématique de soi."
      }
    ],
    "paragraphs": [
      "Il y avait une limpide fontaine aux ondes argentées. […] Narcisse s’étend sur la rive, fatigué de la chasse et épuisé par la chaleur.",
      "Ravi de la beauté du site et de la limpidité de la source, il veut étancher sa soif ; mais une autre soif se déclare. Tandis qu’il boit, épris de son image qui frappe ses regards, il aime une ombre vaine et lui prête un corps.",
      "Il reste en extase et immobile devant son portrait : on dirait une statue en marbre de Paros.",
      "Ignorant ce qu’il voit, il brûle pour ce qu’il voit ; et la même erreur qui trompe ses yeux les excite."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_M%C3%A9tamorphoses,_traduction_Gros",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Se reconnaître dans une image",
        "definition": "Le mythe sépare momentanément le sujet et sa représentation : Narcisse voit parfaitement son apparence sans comprendre immédiatement que cette apparence est la sienne."
      },
      {
        "type": "plain",
        "definition": "Le texte permet de distinguer identité réelle, image de soi et désir de soi : trois dimensions qui ne coïncident pas nécessairement."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les métamorphoses du moi",
      "tags": [
        "identité",
        "image",
        "désir",
        "illusion"
      ]
    },
    "relatedTexts": []
  },
  {
    "id": "sun-tzu-dissensions-rumeur",
    "section": "philosophie",
    "cardMeta": "HLP · Histoire et violence",
    "title": "Désorganiser l’adversaire sans combattre directement",
    "author": "Sun Tzu",
    "authorTag": "Sun Tzu",
    "authorMeta": "(traditionnellement VIe–Ve siècle av. J.-C.) · stratège chinois",
    "themes": [
      "Guerre",
      "Langage",
      "Pouvoir"
    ],
    "work": "Art militaire des Chinois — XIII, « De la manière d’employer les dissensions »",
    "publication": "trad. Joseph-Marie Amiot, 1772",
    "description": "La guerre peut agir sur les esprits avant d’agir sur les corps : information, méfiance, agents doubles et division deviennent des moyens de désorganiser l’ennemi.",
    "context": "Dans le treizième article de la traduction d’Amiot, Sun Tzu insiste sur la connaissance de l’adversaire et l’emploi de différents types d’agents. La violence militaire est précédée et parfois remplacée par une action indirecte sur la confiance, la décision et la cohésion.",
    "readingQuestions": [
      "Pourquoi la connaissance de l’ennemi est-elle une arme ?",
      "En quoi la dissension permet-elle d’obtenir des effets violents sans affrontement direct ?",
      "Quelle place l’information et la désinformation occupent-elles dans la stratégie ?"
    ],
    "glossary": [
      {
        "term": "dissension",
        "definition": "Désaccord ou conflit interne qui fragilise la cohésion d’un groupe."
      },
      {
        "term": "agent double",
        "definition": "Personne qui paraît servir un camp mais transmet des informations ou agit en réalité au profit d’un autre."
      }
    ],
    "paragraphs": [
      "Ce qui met le comble à l’habileté d’un général, c’est de connaître à fond les desseins de l’ennemi et de savoir prévenir ses projets.",
      "Il faut être instruit de tout ce qui se passe chez l’ennemi ; connaître ses délibérations, ses mouvements, ses desseins, ses inquiétudes et ses forces.",
      "On emploie les dissensions afin de jeter le trouble parmi les hommes, d’inspirer la défiance, de rompre les liaisons et de faire naître des soupçons.",
      "Ainsi la victoire peut se préparer longtemps avant le combat, par la connaissance, l’information et la désunion de l’adversaire."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Livre:Art_militaire_des_Chinois,_trad._Amiot,_1772.djvu",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "La violence indirecte",
        "definition": "Le conflit ne se réduit pas au choc physique : agir sur les croyances, la confiance et l’organisation de l’adversaire peut produire des effets décisifs."
      },
      {
        "type": "plain",
        "definition": "Cette fiche permet de relier histoire de la guerre, information et pouvoir psychologique."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "L’humanité en question",
      "subtheme": "Histoire et violence",
      "tags": [
        "guerre",
        "dissension",
        "information",
        "stratégie"
      ]
    },
    "relatedTexts": []
  },
  {
    "id": "seneque-colere-juge-medecin",
    "section": "philosophie",
    "cardMeta": "Philosophie · Justice, peine et raison",
    "title": "Punir sans colère : le juge doit-il agir comme un médecin ?",
    "author": "Sénèque",
    "authorTag": "Sénèque",
    "authorMeta": "(v. 4 av. J.-C.–65) · philosophe stoïcien romain",
    "themes": [
      "Justice",
      "Raison",
      "Morale"
    ],
    "work": "De la colère — livre I, VI",
    "publication": "Ier siècle, trad. Joseph Baillard, 1860/édition ancienne",
    "description": "Sénèque distingue la peine rationnelle de la vengeance passionnelle : le sage peut punir, mais il ne doit jamais prendre plaisir au supplice.",
    "context": "Sénèque combat l’idée selon laquelle la colère serait utile pour rendre la justice. Le magistrat doit corriger, prévenir et protéger comme le médecin cherche à soigner ; même la peine extrême ne doit pas être motivée par le désir de faire souffrir.",
    "readingQuestions": [
      "Pourquoi Sénèque compare-t-il le magistrat au médecin ?",
      "Quelle différence fait-il entre punir et se venger ?",
      "Une peine peut-elle être rationnelle si elle implique de faire souffrir ?"
    ],
    "glossary": [
      {
        "term": "vengeance",
        "definition": "Réaction par laquelle on cherche à faire souffrir en retour de l’offense subie, souvent sous l’impulsion d’une passion."
      },
      {
        "term": "peine",
        "definition": "Sanction imposée selon une règle ou une décision de justice, idéalement justifiée par une finalité autre que la seule revanche."
      }
    ],
    "paragraphs": [
      "Du médecin au magistrat, toute la différence est que le premier, s’il ne peut sauver nos jours, nous adoucit le passage redouté, et que le second chasse de la vie le coupable chargé d’infamie, aux yeux de tous.",
      "Non qu’il se plaise au supplice de personne ; le sage est loin de cette inhumaine barbarie ; mais pour donner un exemple à tous.",
      "Les derniers supplices ne s’infligeront qu’aux scélérats du dernier degré ; et nul ne périra que sa mort ne soit un bien même pour lui.",
      "Non, l’homme, de sa nature, n’est point avide de punir ; et la colère n’est point selon sa nature, car la colère ne veut que châtiment."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/De_la_Col%C3%A8re_(trad._Baillard)",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Punir sans se venger",
        "definition": "La peine est légitime, pour Sénèque, seulement si elle vise une fonction rationnelle : corriger, protéger, prévenir ou donner un exemple."
      },
      {
        "type": "plain",
        "definition": "Le juge-médecin ne cherche pas le plaisir de faire souffrir ; il traite un mal en gardant la maîtrise de ses propres passions."
      }
    ],
    "hlp": null,
    "relatedTexts": [
      {
        "id": "pascal-justice-force",
        "kind": "proche",
        "label": "Pascal — Justice et force",
        "relation": "Pascal interroge la puissance du juste ; Sénèque demande dans quel état d’esprit cette puissance doit punir."
      }
    ]
  },
  {
    "id": "flaubert-madame-bovary-lectures-imaginaire",
    "section": "autres",
    "cardMeta": "HLP · Décrire, figurer, imaginer",
    "title": "Les livres fabriquent-ils le monde que nous désirons ?",
    "author": "Gustave Flaubert",
    "authorTag": "Flaubert",
    "authorMeta": "(1821–1880) · romancier français",
    "themes": [
      "Art",
      "Imagination",
      "Désir"
    ],
    "work": "Madame Bovary — première partie, chapitre VI",
    "publication": "1857, texte français original",
    "description": "Les lectures, images et récits sentimentaux d’Emma composent peu à peu un monde imaginaire qui transforme ses attentes et sa perception de la vie réelle.",
    "context": "Flaubert revient sur l’éducation d’Emma au couvent. Romans, chansons, gravures religieuses et romantiques lui fournissent des formes toutes faites pour éprouver l’amour, la mélancolie et l’aventure. Ses désirs se construisent ainsi à travers des représentations déjà rencontrées dans les livres.",
    "readingQuestions": [
      "Comment les lectures d’Emma transforment-elles ce qu’elle attend de l’existence ?",
      "Pourquoi Flaubert insiste-t-il autant sur les images, objets et clichés des livres ?",
      "L’imagination enrichit-elle ici le réel ou rend-elle Emma incapable de l’accepter ?"
    ],
    "glossary": [
      {
        "term": "imaginaire",
        "definition": "Ensemble d’images, de récits et de représentations par lesquels un sujet se figure le monde et ses possibles."
      },
      {
        "term": "cliché",
        "definition": "Image ou formule devenue conventionnelle à force d’être répétée, qui peut orienter la perception sans qu’on en ait conscience."
      }
    ],
    "paragraphs": [
      "Elle avait lu Paul et Virginie et elle avait rêvé la maisonnette de bambous, le nègre Domingo, le chien Fidèle, mais surtout l’amitié douce de quelque bon petit frère.",
      "Souvent les pensionnaires […] lisaient quelque roman […] Ce n’était qu’amours, amants, amantes, dames persécutées s’évanouissant dans des pavillons solitaires, postillons qu’on tue à tous les relais, chevaux qu’on crève à toutes les pages, forêts sombres, troubles du cœur, serments, sanglots, larmes et baisers.",
      "Pendant six mois, à quinze ans, Emma se graissa donc les mains à cette poussière des vieux cabinets de lecture. Avec Walter Scott, plus tard, elle s’éprit de choses historiques, rêva bahuts, salle des gardes et ménestrels.",
      "Et l’abat-jour du quinquet […] éclairait tous ces tableaux du monde, qui passaient devant elle les uns après les autres, dans le silence du dortoir."
    ],
    "sourceUrl": "https://fr.wikisource.org/wiki/Madame_Bovary/Premi%C3%A8re_partie/6",
    "publicDomain": true,
    "readingNotes": [
      {
        "type": "concept",
        "term": "Désirer à travers des représentations",
        "definition": "Emma ne désire pas dans un vide : ses attentes sont peuplées de scènes, d’images et de modèles appris dans les romans et les gravures."
      },
      {
        "type": "plain",
        "definition": "Le texte permet de montrer que décrire et imaginer ne sont pas des activités neutres : les représentations peuvent finir par fournir des normes auxquelles la réalité est comparée."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les représentations du monde",
      "subtheme": "Décrire, figurer, imaginer",
      "tags": [
        "imagination",
        "lecture",
        "représentation",
        "désir"
      ]
    },
    "relatedTexts": []
  },
{
  "id": "lery-etonnement-mutuel-tupinambas",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Un étonnement mutuel",
  "author": "Jean de Léry",
  "authorTag": "Léry",
  "cardHighlight": "étonnement mutuel",
  "authorMeta": "(1536–1613) · voyageur et écrivain humaniste",
  "themes": [
    "Autrui",
    "Culture",
    "Langage"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "altérité",
      "décentrement",
      "langage",
      "ethnocentrisme"
    ]
  },
  "work": "Histoire d’un voyage fait en la terre du Brésil",
  "publication": "1578, chap. XVIII, adaptation de C. Trotot, Flammarion, 1998",
  "description": "Chez les Tupinambas, Léry découvre que l’étonnement n’est pas à sens unique : l’Européen est lui aussi un étranger observé et interprété.",
  "context": "Léry raconte sa première réception chez les Tupinambas. D’abord persuadé d’être dépouillé, il comprend ensuite que ses hôtes se jouent de ses affaires avant de les lui rendre. Le récit décentre le regard européen en faisant de l’observateur un objet d’étonnement.",
  "readingQuestions": [
    "Pourquoi Léry croit-il d’abord avoir tout perdu ?",
    "Comment l’expérience corrige-t-elle son premier jugement ?",
    "Que révèle l’épisode de son nom sur la rencontre entre deux langues et deux cultures ?"
  ],
  "glossary": [
    {
      "term": "Tupinambas",
      "definition": "Peuple autochtone du littoral brésilien rencontré par les voyageurs européens au XVIe siècle."
    },
    {
      "term": "décentrement",
      "definition": "Déplacement du point de vue qui conduit à ne plus prendre sa propre culture comme mesure évidente de toutes les autres."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Étonnement réciproque",
      "definition": "Le texte montre que l’étrangeté n’appartient pas à un peuple en soi : chacun peut devenir l’étranger de l’autre."
    }
  ],
  "relatedTexts": [
    {
      "id": "bougainville-rencontre-tahiti",
      "kind": "proche",
      "label": "Bougainville — Une première rencontre à Tahiti",
      "relation": "Deux récits de contact où gestes, objets et interprétations précèdent la compréhension complète de l’autre."
    },
    {
      "id": "montaigne-cannibales-barbarie-europeenne",
      "kind": "proche",
      "label": "Montaigne — Retourner le jugement de barbarie",
      "relation": "Montaigne transforme le décentrement du voyage en critique explicite de l’ethnocentrisme."
    }
  ],
  "paragraphs": [
    "Bien que nos Toüoupinambaoults reçoivent fort humainement les étrangers amis qui viennent leur rendre visite, néanmoins les Français et autres Européens qui ne comprennent pas leur langage se trouvent au commencement merveilleusement frappés d’étonnement au milieu d’eux. […] Quand nous fûmes arrivés au premier nommé Yabouraci dans la langue du pays, et Pépin par les Français (à cause d’un navire qui y chargea une fois, dont le maître s’appelait ainsi), qui n’était qu’à deux lieues de notre fort, je me vis immédiatement entouré de sauvages qui me demandèrent « Marapé-dereré, marapé-dereré », c’est-à-dire : « Quel est ton nom, quel est ton nom ? » (ce qui pour moi alors était du haut allemand). Et du reste l’un ayant pris mon chapeau qu’il mit sur sa tête, l’autre mon épée et ma ceinture qu’il ceignit sur son corps tout nu, l’autre ma casaque qu’il revêtit, eux dis-je m’étourdissant de leurs cris et courant ainsi au milieu de leur village avec mes hardes, non seulement je pensais avoir tout perdu, mais aussi je ne savais où j’en étais.",
    "Mais comme l’expérience me l’a montré plusieurs fois depuis, ce n’était que faute de connaître leur manière de faire. Car faisant de même à tous ceux qui les visitent, et principalement à ceux qu’ils n’ont point encore vus, après qu’ils se sont ainsi un peu joués des affaires d’autrui, ils rapportent et rendent le tout à ceux à qui elles appartiennent. Là-dessus l’interprète m’ayant averti qu’ils désiraient surtout savoir mon nom, mais que leur dire Pierre, Guillaume ou Jean, comme ils ne pouvaient les prononcer ni les retenir était inutile (comme de fait, au lieu de dire Jean ils disaient Nian), il fallait que je m’arrange pour leur nommer une chose qui leur fût connue. Comme il me dit fort à propos que mon nom Léry signifie une huître dans leur langue, je leur dis que je m’appelais Lery-oussou : c’est-à-dire, une grosse huître. De quoi ils furent bien satisfaits, et avec leur expression d’admiration Teh ! se mettant à rire, ils dirent : « Vraiment voilà un beau nom, et nous n’avions pas encore vu de Meir, c’est-à-dire de Français, qui s’appelât ainsi. »"
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "C’est un excellent texte pour comprendre le décentrement : l’Européen n’est plus seulement celui qui découvre, il est aussi celui que l’on regarde, que l’on nomme et que l’on trouve étrange. La différence devient réciproque.",
  "hlpQuestion": "Que change la rencontre de l’autre lorsque nous découvrons que nous sommes nous-mêmes l’étranger ?",
  "problematisations": [
    "Rencontrer l’autre suppose-t-il d’abandonner sa propre manière de voir ?",
    "Peut-on comprendre une culture étrangère sans commencer par mal l’interpréter ?"
  ],
  "keywords": [
    "altérité",
    "décentrement",
    "langage",
    "ethnocentrisme"
  ],
  "hlpOppositions": [
    {
      "left": "observer l’autre",
      "right": "être observé"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "montaigne-cannibales-barbarie-europeenne",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Une forme de vengeance ?",
  "author": "Michel de Montaigne",
  "authorTag": "Montaigne",
  "cardHighlight": "forme de vengeance",
  "authorMeta": "(1533–1592) · humanisme et scepticisme",
  "themes": [
    "Culture",
    "Justice",
    "Nature"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "barbarie",
      "ethnocentrisme",
      "coutume",
      "relativisme"
    ]
  },
  "work": "Essais, « Des Cannibales »",
  "publication": "1580, livre I, chap. 31",
  "description": "Montaigne compare l’anthropophagie des peuples du Nouveau Monde aux supplices européens et retourne l’accusation de barbarie.",
  "context": "Montaigne ne nie pas la violence de l’anthropophagie rituelle, mais il refuse de l’isoler de nos propres pratiques. La comparaison fait apparaître une barbarie européenne que l’habitude et la religion peuvent rendre invisible à ceux qui la commettent.",
  "readingQuestions": [
    "Pourquoi les peuples décrits par Montaigne pratiquent-ils l’anthropophagie ?",
    "Que leur apprend le contact avec les Portugais ?",
    "Comment la comparaison des supplices européens et indiens modifie-t-elle le jugement de barbarie ?"
  ],
  "glossary": [
    {
      "term": "anthropophagie",
      "definition": "Pratique consistant à manger de la chair humaine ; dans le texte, elle est située dans un rituel de guerre et de vengeance."
    },
    {
      "term": "ethnocentrisme",
      "definition": "Tendance à juger les autres cultures à partir des normes de la sienne, prises comme allant de soi."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Barbarie de l’autre",
        "definition": "Le lecteur européen est d’abord tenté de condamner une pratique étrangère."
      },
      "right": {
        "term": "Barbarie de chez soi",
        "definition": "Montaigne rappelle les tortures commises en Europe et oblige son lecteur à appliquer le même jugement à sa propre société."
      },
      "conclusion": "La comparaison détruit le privilège implicite du point de vue européen."
    }
  ],
  "relatedTexts": [
    {
      "id": "montaigne-coches-civilisation-conquete",
      "kind": "suite",
      "label": "Montaigne — Qui sont les vrais civilisés ?",
      "relation": "Des Cannibales relativise le jugement de barbarie ; Des Coches étend la critique à la conquête du Nouveau Monde."
    }
  ],
  "paragraphs": [
    "Ce n’est pas, comme on pense, pour s’en nourrir, ainsi que faisaient anciennement les Scythes : c’est pour manifester une très grande vengeance. Et pour preuve qu’il en est bien ainsi, [voici un fait] : s’étant aperçu que les Portugais, […] usaient contre eux, quand ils les prenaient, d’une autre sorte de mort qui consistait à les enterrer jusqu’à la ceinture et à leur tirer sur le reste du corps force coups de traits, puis à les pendre, ils pensèrent que ces gens-ci de l’ancien monde, en hommes qui avaient semé la connaissance de beaucoup de vices dans leur voisinage et qui étaient beaucoup plus grands maîtres qu’eux en toute sorte de méchanceté, n’adoptaient pas sans cause cette sorte de vengeance et qu’elle devait être plus pénible que la leur ; [alors] ils commencèrent à abandonner leur manière ancienne pour suivre celle-ci. Je ne suis pas fâché que nous soulignions l’horreur barbare qu’il y a dans une telle action, mais plutôt du fait que, jugeant bien de leurs fautes, nous soyons si aveugles à l’égard des nôtres.",
    "Je pense qu’il y a plus de barbarie à manger un homme vivant qu’à le manger mort, à déchirer par des tortures et des supplices un corps ayant encore toute sa sensibilité, à le faire rôtir petit à petit, à le faire mordre et tuer par les chiens et les pourceaux (comme nous l’avons non seulement lu, mais vu de fraîche date, non entre des ennemis anciens, mais entre des voisins et concitoyens et, qui pis est, sous prétexte de piété et de religion) que de le rôtir et manger après qu’il est trépassé."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce passage est l’un des textes les plus efficaces contre l’ethnocentrisme : il ne demande pas d’idéaliser une autre culture, mais de comparer avant de juger. La notion de « barbarie » se retourne alors contre celui qui l’emploie.",
  "hlpQuestion": "Qui mérite réellement le nom de « barbare » ?",
  "problematisations": [
    "La barbarie est-elle une propriété des peuples ou un jugement produit par une culture ?",
    "Comparer les coutumes suffit-il à dépasser l’ethnocentrisme ?"
  ],
  "keywords": [
    "barbarie",
    "ethnocentrisme",
    "coutume",
    "relativisme"
  ],
  "hlpOppositions": [
    {
      "left": "civilisé",
      "right": "barbare"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "lascasas-violence-conquete-indes",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Une violence inouïe",
  "author": "Bartolomé de Las Casas",
  "authorTag": "Las Casas",
  "cardHighlight": "violence inouïe",
  "authorMeta": "(1484–1566) · dominicain et défenseur des Indiens",
  "themes": [
    "Justice",
    "Devoir",
    "Histoire"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "conquête",
      "violence",
      "témoignage",
      "colonisation"
    ]
  },
  "work": "Très Brève Relation de la destruction des Indes",
  "publication": "1552, Prologue, trad. F. Gonzalez-Batlle, La Découverte, 1996",
  "description": "Las Casas dresse un inventaire accusateur des violences commises par les conquérants espagnols contre les populations des Amériques.",
  "context": "Après la conquête, Las Casas adresse aux puissants un témoignage destiné à rendre visibles des violences que l’expansion impériale tend à masquer. L’accumulation des supplices transforme le récit en accusation politique et morale.",
  "readingQuestions": [
    "Comment l’accumulation des violences agit-elle sur le lecteur ?",
    "Pourquoi Las Casas insiste-t-il sur les enfants, les mères et les vieillards ?",
    "Comment le texte transforme-t-il un récit de conquête en accusation morale ?"
  ],
  "glossary": [
    {
      "term": "réquisitoire",
      "definition": "Discours d’accusation qui rassemble des faits et des arguments afin de faire condamner une conduite."
    },
    {
      "term": "conquête",
      "definition": "Prise de contrôle d’un territoire par la force ; elle peut s’accompagner d’exploitation, de dépossession et de destruction des populations."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Témoigner pour accuser",
      "definition": "La précision et l’accumulation des scènes ne servent pas seulement à raconter : elles visent à rendre impossible l’indifférence du lecteur et du pouvoir politique."
    }
  ],
  "relatedTexts": [
    {
      "id": "diderot-tahitien-colonisation",
      "kind": "proche",
      "label": "Diderot — Le vieux Tahitien accuse l’Européen",
      "relation": "Las Casas témoigne des violences de la conquête ; Diderot formule, par la fiction, le principe même de la critique coloniale."
    }
  ],
  "paragraphs": [
    "Ils entraient dans les villages et ne laissaient ni enfants, ni vieillards, ni femmes enceintes ou accouchées qu’ils n’aient éventrés et mis en pièces, comme s’ils s’attaquaient à des agneaux réfugiés dans leurs bergeries. Ils faisaient des paris à qui ouvrirait un homme d’un coup de couteau, ou lui couperait la tête d’un coup de pique ou mettrait ses entrailles à nu. Ils arrachaient les bébés qui tétaient leurs mères, les prenaient par les pieds et leur cognaient la tête contre les rochers. D’autres les lançaient par-dessus l’épaule dans les fleuves en riant et en plaisantant et quand les enfants tombaient dans l’eau ils disaient : « Tu frétilles, espèce de drôle ! » ; ils embrochaient sur une épée des enfants avec leurs mères et tous ceux qui se trouvaient devant eux.",
    "Ils faisaient de longues potences où les pieds touchaient presque terre et par groupes de treize, pour honorer et révérer notre Rédempteur et les douze apôtres, ils y mettaient le feu et les brûlaient vifs. D’autres leur attachaient tout le corps dans de la paille sèche et y mettaient le feu ; c’est ainsi qu’ils les brûlaient. À d’autres et à tous ceux qu’ils voulaient prendre en vie ils coupaient les deux mains, et les mains leur pendaient, et ils leur disaient : « Allez porter les lettres », ce qui signifiait d’aller porter la nouvelle à ceux qui s’étaient enfuis dans les forêts. C’est ainsi qu’ils tuaient généralement les seigneurs et les nobles : ils faisaient un gril de baguettes sur des fourches, ils les y attachaient et mettaient dessous un feu doux, pour que peu à peu, dans les hurlements que provoquaient ces tortures horribles, ils rendent l’âme."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte donne à la découverte du Nouveau Monde son envers : la rencontre peut devenir conquête, dépossession et extermination. Il permet aussi d’étudier la force du témoignage lorsqu’il cherche à rendre une violence impossible à minimiser.",
  "hlpQuestion": "Comment le témoignage peut-il rendre visible la violence de la conquête ?",
  "problematisations": [
    "Décrire la violence suffit-il à la condamner ?",
    "Le témoignage peut-il devenir une forme de résistance politique ?"
  ],
  "keywords": [
    "conquête",
    "violence",
    "témoignage",
    "colonisation"
  ],
  "hlpOppositions": [
    {
      "left": "conquête",
      "right": "humanité"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "bougainville-rencontre-tahiti",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Une rencontre prometteuse",
  "author": "Louis-Antoine de Bougainville",
  "authorTag": "Bougainville",
  "cardHighlight": "rencontre prometteuse",
  "authorMeta": "(1729–1811) · navigateur et écrivain des Lumières",
  "themes": [
    "Autrui",
    "Culture",
    "Langage"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "rencontre",
      "échange",
      "don",
      "altérité"
    ]
  },
  "work": "Voyage autour du monde",
  "publication": "1771, II, 1",
  "description": "À Tahiti, le premier contact entre les voyageurs français et les insulaires prend la forme de signes d’amitié, de dons et d’échanges.",
  "context": "En avril 1768, Bougainville mouille à Tahiti. Son récit décrit une première rencontre encore pacifique : les gestes, les présents et le commerce servent de langage commun avant même que les deux groupes puissent réellement se comprendre.",
  "readingQuestions": [
    "Comment les Tahitiens et les Français manifestent-ils leur volonté de paix ?",
    "Pourquoi l’échange de présents peut-il tenir lieu de langage commun ?",
    "Quels indices montrent que Bougainville interprète déjà les Tahitiens à partir de catégories européennes ?"
  ],
  "glossary": [
    {
      "term": "rameau d’olivier",
      "definition": "Symbole traditionnel de paix ; Bougainville interprète ainsi les branches présentées par les Tahitiens."
    },
    {
      "term": "bonne foi",
      "definition": "Disposition à agir loyalement, sans tromper l’autre ; elle rend ici l’échange possible."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Rencontre",
        "definition": "Les deux groupes s’approchent par des gestes d’amitié et des dons."
      },
      "right": {
        "term": "Interprétation",
        "definition": "Bougainville traduit immédiatement ces gestes dans des symboles et des catégories qui lui sont familiers."
      },
      "conclusion": "La découverte de l’autre n’est jamais une perception neutre : elle suppose déjà une interprétation."
    }
  ],
  "relatedTexts": [
    {
      "id": "diderot-tahitien-colonisation",
      "kind": "suite",
      "label": "Diderot — Le Tahitien retourne le regard sur les Européens",
      "relation": "Diderot transforme le récit de voyage en critique de l’appropriation et de la domination coloniales."
    }
  ],
  "paragraphs": [
    "Nous courions à pleines voiles vers la terre, présentant au vent de cette baie, lorsque nous aperçûmes une pirogue qui venait du large et voguait vers la côte, se servant de sa voile et de ses pagaies. Elle nous passa de l’avant, et se joignit à une infinité d’autres qui, de toutes les parties de l’île, accouraient au-devant de nous. L’une d’elles précédait les autres ; elle était conduite par douze hommes nus qui nous présentèrent des branches de bananiers, et leurs démonstrations attestaient que c’était là le rameau d’olivier. Nous leur répondîmes par tous les signes d’amitié dont nous pûmes nous aviser ; alors ils accostèrent le navire, et l’un d’eux, remarquable par son énorme chevelure hérissée en rayons, nous offrit avec son rameau de paix un petit cochon et un régime de bananes. Nous acceptâmes son présent, qu’il attacha à une corde qu’on lui jeta ; nous lui donnâmes des bonnets et des mouchoirs, et ces premiers présents furent le gage de notre alliance avec ce peuple.",
    "Bientôt plus de cent pirogues de grandeurs différentes, et toutes à balancier, environnèrent les deux vaisseaux. Elles étaient chargées de cocos, de bananes et d’autres fruits du pays. L’échange de ces fruits délicieux pour nous contre toutes sortes de bagatelles se fit avec bonne foi, mais sans qu’aucun des insulaires voulût monter à bord. Il fallait entrer dans leurs pirogues ou montrer de loin les objets d’échange ; lorsqu’on était d’accord, on leur envoyait au bout d’une corde un panier ou un filet ; ils y mettaient leurs effets, et nous les nôtres, donnant ou recevant indifféremment avant que d’avoir donné ou reçu, avec une bonne foi qui nous fit bien augurer de leur caractère. D’ailleurs nous ne vîmes aucune espèce d’armes dans leurs pirogues, où il n’y avait point de femmes à cette première entrevue. Les pirogues restèrent le long des navires jusqu’à ce que les approches de la nuit nous firent revirer au large ; toutes alors se retirèrent."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce passage donne un point de départ concret à la découverte de l’autre : la rencontre repose d’abord sur des signes, des dons et une confiance fragile. Il permet ensuite de mesurer tout ce que Diderot renversera dans sa critique de la colonisation.",
  "hlpQuestion": "Comment un premier contact entre cultures peut-il se construire par les signes, les dons et les échanges ?",
  "problematisations": [
    "L’échange crée-t-il spontanément une relation pacifique entre cultures ?",
    "Le premier regard porté sur l’autre est-il déjà chargé d’attentes et de représentations ?"
  ],
  "keywords": [
    "rencontre",
    "échange",
    "don",
    "altérité"
  ],
  "hlpOppositions": [
    {
      "left": "étrangeté",
      "right": "alliance"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "diderot-tahitien-colonisation",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Renversement de perspective",
  "author": "Denis Diderot",
  "authorTag": "Diderot",
  "cardHighlight": "Renversement de perspective",
  "authorMeta": "(1713–1784) · Lumières et matérialisme",
  "themes": [
    "Liberté",
    "Justice",
    "Nature"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "colonisation",
      "liberté",
      "propriété",
      "civilisation"
    ]
  },
  "work": "Supplément au Voyage de Bougainville",
  "publication": "1772",
  "description": "Diderot fait parler un vieux Tahitien qui retourne contre Bougainville les catégories de propriété, de civilisation et de liberté.",
  "context": "Diderot imagine le discours qu’un vieux Tahitien aurait pu adresser à Bougainville. En donnant la parole au peuple visité, il inverse le rapport d’observation : l’Européen devient à son tour l’objet d’un jugement moral.",
  "readingQuestions": [
    "Pourquoi le Tahitien conteste-t-il le droit de Bougainville à s’approprier l’île ?",
    "Comment les pronoms « tu », « nous » et « toi » organisent-ils l’affrontement des points de vue ?",
    "Quelle conception de la liberté et des besoins oppose-t-il aux Européens ?"
  ],
  "glossary": [
    {
      "term": "appropriation",
      "definition": "Action de faire d’une chose sa propriété ; Diderot interroge ici la légitimité d’une appropriation territoriale imposée par la force."
    },
    {
      "term": "besoins superflus",
      "definition": "Besoins produits au-delà du nécessaire ; le Tahitien les associe aux dépendances et aux efforts inutiles de la civilisation européenne."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Civiliser",
        "definition": "Le colonisateur peut présenter son intervention comme un apport de lumières, de biens ou d’institutions."
      },
      "right": {
        "term": "Asservir",
        "definition": "Le Tahitien décrit la même intervention comme un vol de territoire et une menace contre la liberté."
      },
      "conclusion": "Le renversement de perspective oblige à distinguer le récit que la puissance fait d’elle-même et l’expérience de ceux qu’elle domine."
    }
  ],
  "relatedTexts": [
    {
      "id": "bougainville-rencontre-tahiti",
      "kind": "suite",
      "label": "Bougainville — Le récit du premier contact",
      "relation": "Diderot réécrit philosophiquement le voyage de Bougainville et en révèle les présupposés."
    }
  ],
  "paragraphs": [
    "Nous sommes libres ; et voilà que tu as enfoui dans notre terre le titre de notre futur esclavage. Tu n’es ni un dieu, ni un démon : qui es-tu donc, pour faire des esclaves ? Orou ! toi qui entends la langue de ces hommes-là, dis-nous à tous, comme tu me l’as dit à moi-même, ce qu’ils ont écrit sur cette lame de métal : Ce pays est à nous. Ce pays est à toi ! et pourquoi ? Parce que tu y as mis le pied ? Si un Tahitien débarquait un jour sur vos côtes, et qu’il gravât sur une de vos pierres ou sur l’écorce d’un de vos arbres : Ce pays est aux habitants de Tahiti, qu’en penserais-tu ? Tu es le plus fort ! Et qu’est-ce que cela fait ? Lorsqu’on t’a enlevé une des méprisables bagatelles dont ton bâtiment est rempli, tu t’es récrié, tu t’es vengé ; et dans le même instant tu as projeté au fond de ton cœur le vol de toute une contrée ! Tu n’es pas esclave : tu souffrirais plutôt la mort que de l’être, et tu veux nous asservir ! Tu crois donc que le Tahitien ne sait pas défendre sa liberté et mourir ? Celui dont tu veux t’emparer comme de la brute, le Tahitien est ton frère.",
    "Vous êtes deux enfants de la nature : quel droit as-tu sur lui qu’il n’ait pas sur toi ? Tu es venu ; nous sommes-nous jetés sur ta personne ? Avons-nous pillé ton vaisseau ? T’avons-nous saisi et exposé aux flèches de nos ennemis ? T’avons-nous associé dans nos champs au travail de nos animaux ? Nous avons respecté notre image en toi. Laisse-nous nos mœurs, elles sont plus sages et plus honnêtes que les tiennes. Nous ne voulons point troquer ce que tu appelles notre ignorance contre tes inutiles lumières. Tout ce qui nous est nécessaire et bon, nous le possédons. Sommes-nous dignes de mépris parce que nous n’avons pas su nous faire des besoins superflus ? Lorsque nous avons faim, nous avons de quoi manger ; lorsque nous avons froid, nous avons de quoi nous vêtir. Tu es entré dans nos cabanes, qu’y manque-t-il à ton avis ? Poursuis jusqu’où tu voudras ce que tu appelles commodités de la vie, mais permets à des êtres sensés de s’arrêter, lorsqu’ils n’auraient à obtenir de la continuité de leurs pénibles efforts que des biens imaginaires."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le passage condense un geste essentiel des Lumières : changer de point de vue pour révéler ce qui semblait normal. Propriété, besoins, liberté et progrès sont réexaminés depuis le regard de celui que l’Europe prétend civiliser.",
  "hlpQuestion": "De quel droit un peuple peut-il s’approprier le territoire et la liberté d’un autre ?",
  "problematisations": [
    "La découverte donne-t-elle un droit sur ce qui est découvert ?",
    "Peut-on prétendre civiliser un peuple en lui retirant sa liberté ?"
  ],
  "keywords": [
    "colonisation",
    "liberté",
    "propriété",
    "civilisation"
  ],
  "hlpOppositions": [
    {
      "left": "appropriation",
      "right": "liberté"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "montaigne-coches-civilisation-conquete",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Qui sont les vrais civilisés ?",
  "author": "Michel de Montaigne",
  "authorTag": "Montaigne",
  "cardHighlight": "vrais civilisés",
  "authorMeta": "(1533–1592) · humanisme et scepticisme",
  "themes": [
    "Culture",
    "Justice",
    "Histoire"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "civilisation",
      "conquête",
      "violence",
      "décentrement"
    ]
  },
  "work": "Essais, « Des Coches »",
  "publication": "1580, livre III, chap. 6",
  "description": "Montaigne oppose les qualités des peuples du Nouveau Monde à la violence et à la prétention civilisatrice des conquérants européens.",
  "context": "Dans « Des Coches », Montaigne revient sur la conquête des Amériques. L’admiration pour les réalisations et les qualités morales des peuples conquis lui permet de contester l’idée d’une supériorité naturelle ou morale de l’Europe.",
  "readingQuestions": [
    "Quels signes de civilisation Montaigne reconnaît-il aux peuples américains ?",
    "Pourquoi pense-t-il que les Européens ont hâté la ruine de ce « monde enfant » ?",
    "Quelles qualités morales renversent la hiérarchie entre conquérants et conquis ?"
  ],
  "glossary": [
    {
      "term": "magnanimité",
      "definition": "Grandeur d’âme, générosité et noblesse dans la conduite."
    },
    {
      "term": "dévotion",
      "definition": "Ici, attachement fidèle à des devoirs et à des valeurs ; le terme ne se réduit pas à la seule religion."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Civilisation en miroir",
      "definition": "Montaigne ne juge pas la civilisation au nombre des conquêtes, mais à la justice, à la loyauté, au courage et aux œuvres qu’une société produit."
    }
  ],
  "relatedTexts": [
    {
      "id": "montaigne-cannibales-barbarie-europeenne",
      "kind": "suite",
      "label": "Montaigne — Une forme de vengeance ?",
      "relation": "Les deux essais retournent contre l’Europe les catégories de barbarie et de civilisation."
    },
    {
      "id": "lascasas-violence-conquete-indes",
      "kind": "proche",
      "label": "Las Casas — Une violence inouïe",
      "relation": "Le jugement de Montaigne trouve un pendant testimonial dans la dénonciation de Las Casas."
    }
  ],
  "paragraphs": [
    "Bien crains-je que nous aurons bien fort hâté sa déclinaison et sa ruine par notre contagion, et que nous lui aurons bien cher vendu nos opinions et nos arts. C’était un monde enfant ; pourtant nous ne l’avons pas fouetté et soumis à notre discipline par l’avantage de notre valeur et forces naturelles, nous ne l’avons pas non plus séduit par notre justice et notre bonté, ni subjugué par notre magnanimité. La plupart de leurs réponses et des négociations faites avec eux témoignent qu’ils ne nous devaient rien en clarté d’esprit naturelle et pertinence. La merveilleuse magnificence des villes de Cuzco et de Mexico, et, entre plusieurs choses pareilles, le jardin de ce roi, où tous les arbres, les fruits et toutes les herbes, selon l’ordre et grandeur qu’ils ont en un jardin, étaient excellemment façonnés en or, comme, dans son cabinet, tous les animaux qui naissaient dans son État et dans ses mers ; et la beauté de leurs ouvrages en pierreries, en plume, en coton, dans la peinture, montrent qu’ils ne nous étaient pas non plus inférieurs en habileté.",
    "Mais, quant à la dévotion, observance des lois, bonté, libéralité, loyauté, franchise, il nous a bien servi de n’en avoir pas tant qu’eux : ils se sont perdus par cet avantage, et vendus, et trahis eux-mêmes. Quant à la hardiesse et courage, quant à la fermeté, constance, résolution contre les douleurs et la faim, et la mort, je ne craindrais pas d’opposer les exemples que je trouverais parmi eux aux plus fameux exemples anciens que nous avons aux mémoires de notre monde par-deçà."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce texte complète « Des Cannibales » : la critique ne porte plus seulement sur nos jugements, mais sur les effets historiques de la conquête. La prétendue civilisation européenne est évaluée à partir de ses actes.",
  "hlpQuestion": "Une civilisation peut-elle se prétendre supérieure lorsqu’elle conquiert par la violence ?",
  "problematisations": [
    "La puissance technique ou militaire prouve-t-elle la supériorité d’une civilisation ?",
    "Le regard sur l’autre peut-il devenir un miroir critique de notre propre société ?"
  ],
  "keywords": [
    "civilisation",
    "conquête",
    "violence",
    "décentrement"
  ],
  "hlpOppositions": [
    {
      "left": "civilisation",
      "right": "violence"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "montesquieu-education-femmes-nature-culture",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "L’éducation des femmes",
  "author": "Montesquieu",
  "authorTag": "Montesquieu",
  "cardHighlight": "éducation des femmes",
  "authorMeta": "(1689–1755) · philosophie politique des Lumières",
  "themes": [
    "Nature",
    "Culture",
    "Justice"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "nature",
      "culture",
      "éducation",
      "égalité"
    ]
  },
  "work": "Lettres persanes",
  "publication": "1721, lettre 38 (« Rica à Ibben, à Smyrne »)",
  "description": "Montesquieu demande si la hiérarchie entre les sexes vient de la nature ou d’une éducation et de coutumes historiquement construites.",
  "context": "Le regard persan permet à Montesquieu de rendre étrange une hiérarchie que la société française présente volontiers comme naturelle. Le texte oppose force, éducation et coutumes afin de montrer que l’ordre social peut se faire passer pour la nature.",
  "readingQuestions": [
    "Pourquoi le philosophe cité refuse-t-il de fonder la domination masculine sur une loi naturelle ?",
    "Quel rôle l’éducation joue-t-elle dans l’inégalité observée ?",
    "À quoi sert l’évocation de peuples aux coutumes différentes ?"
  ],
  "glossary": [
    {
      "term": "loi naturelle",
      "definition": "Règle supposée découler de la nature elle-même et non d’une convention sociale ou politique."
    },
    {
      "term": "coutume",
      "definition": "Pratique collective installée par l’usage et la répétition, qui peut finir par paraître naturelle."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Nature",
        "definition": "Ce qui serait indépendant des institutions et de l’éducation."
      },
      "right": {
        "term": "Culture",
        "definition": "Ce qui est appris, transmis et organisé différemment selon les sociétés."
      },
      "conclusion": "Montesquieu fragilise une hiérarchie en montrant qu’elle peut être produite par l’éducation plutôt que prescrite par la nature."
    }
  ],
  "relatedTexts": [
    {
      "id": "diderot-tahitien-colonisation",
      "kind": "proche",
      "label": "Diderot — Renverser un ordre présenté comme évident",
      "relation": "Les deux textes utilisent un regard décentré pour contester ce qu’une société présente comme naturel ou légitime."
    }
  ],
  "paragraphs": [
    "C’est une autre question de savoir si la loi naturelle soumet les femmes aux hommes. « Non, me disait l’autre jour un philosophe très galant : la nature n’a jamais dicté une telle loi. L’empire que nous avons sur elles est une véritable tyrannie ; elles ne nous l’ont laissé prendre que parce qu’elles ont plus de douceur que nous, et, par conséquent, plus d’humanité et de raison. Ces avantages, qui devaient sans doute leur donner la supériorité si nous avions été raisonnables, la leur ont fait perdre, parce que nous ne le sommes point. Or, s’il est vrai que nous n’avons sur les femmes qu’un pouvoir tyrannique, il ne l’est pas moins qu’elles ont sur nous un empire naturel ; celui de la beauté, à qui rien ne résiste. Le nôtre n’est pas de tous les pays ; mais celui de la beauté est universel. Pourquoi aurions-nous donc un privilège ? Est-ce parce que nous sommes les plus forts ? Mais c’est une véritable injustice. Nous employons toutes sortes de moyens pour leur abattre le courage. Les forces seraient égales si l’éducation l’était aussi. Éprouvons-les dans les talents que l’éducation n’a point affaiblis ; et nous verrons si nous sommes si forts.",
    "Il faut l’avouer, quelque cela choque nos mœurs : chez les peuples les plus polis, les femmes ont toujours eu de l’autorité sur leurs maris ; elle fut établie par une loi chez les Égyptiens, en l’honneur d’Isis, et chez les Babyloniens, en l’honneur de Sémiramis. On disait des Romains qu’ils commandaient à toutes les nations, mais qu’ils obéissaient à leurs femmes. Je ne parle point des Sauromates, qui étaient véritablement dans la servitude de ce sexe ; ils étaient trop barbares pour que leur exemple puisse être cité. »"
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le passage élargit la pluralité des cultures au cœur même de nos sociétés : ce que nous croyons naturel peut dépendre d’une éducation et d’institutions. Il fournit un outil majeur pour distinguer nature et culture.",
  "hlpQuestion": "Ce que nous croyons naturel est-il parfois produit par l’éducation et les coutumes ?",
  "problematisations": [
    "Comment distinguer ce qui vient de la nature de ce qui vient de l’éducation ?",
    "Une coutume ancienne peut-elle se faire passer pour une nécessité naturelle ?"
  ],
  "keywords": [
    "nature",
    "culture",
    "éducation",
    "égalité"
  ],
  "hlpOppositions": [
    {
      "left": "nature",
      "right": "culture"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "locke-propriete-travail-nature",
  "section": "autres",
  "cardMeta": "Découverte du monde et pluralité des cultures",
  "title": "Le fondement de la propriété",
  "author": "John Locke",
  "authorTag": "Locke",
  "cardHighlight": "fondement de la propriété",
  "authorMeta": "(1632–1704) · empirisme et libéralisme politique",
  "themes": [
    "Travail",
    "Nature",
    "Justice"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "tags": [
      "propriété",
      "travail",
      "nature",
      "commun"
    ]
  },
  "work": "Deuxième Traité du gouvernement civil",
  "publication": "1690, § 27, trad. B. Gilson, Vrin, 1997",
  "description": "Locke explique comment un monde donné en commun peut devenir l’objet d’appropriations privées par le travail.",
  "context": "Locke part d’une nature commune à tous puis introduit la propriété de soi et du travail. En mêlant son travail à une ressource naturelle, l’individu peut selon lui la faire sienne, sous réserve qu’il en reste suffisamment pour les autres.",
  "readingQuestions": [
    "Pourquoi Locke commence-t-il par affirmer que la terre appartient en commun à l’humanité ?",
    "Comment le travail transforme-t-il un bien commun en propriété privée ?",
    "Pourquoi la référence à « l’Indien sauvage » est-elle philosophiquement et historiquement problématique ?"
  ],
  "glossary": [
    {
      "term": "approprier",
      "definition": "Faire entrer un bien dans la sphère de ce qui appartient en propre à un individu."
    },
    {
      "term": "propriété de sa propre personne",
      "definition": "Idée selon laquelle chacun dispose d’abord de lui-même et, par conséquent, du travail de son corps."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Travail et propriété",
      "definition": "Le travail sert de médiation entre une nature commune et une possession individuelle : il est censé marquer ce qui a été soustrait à l’état commun."
    }
  ],
  "relatedTexts": [
    {
      "id": "diderot-tahitien-colonisation",
      "kind": "adverse",
      "label": "Diderot — Qui peut dire « ce pays est à nous » ?",
      "relation": "Locke cherche le fondement légitime de l’appropriation ; Diderot met en scène le scandale d’une appropriation territoriale imposée par la force."
    }
  ],
  "paragraphs": [
    "La terre et tout ce qu’elle contient sont un don fait aux hommes pour l’entretien et le réconfort de leur être. Tous les fruits qu’elle produit naturellement et toutes les bêtes qu’elle nourrit appartiennent en commun à l’humanité, en tant que production spontanée de la nature ; nul n’en possède privativement une partie quelconque, à l’exclusion du reste de l’humanité, quand ces biens se présentent dans leur état naturel ; cependant, comme ils sont dispensés pour l’usage des hommes, il doit nécessairement exister quelque moyen de se les approprier, pour que des individus déterminés, quels qu’ils soient, puissent s’en servir ou en tirer profit. Les fruits ou la venaison, dont se nourrit l’Indien sauvage, qui ne connaît pas le bornage et demeure indivisaire, doivent lui appartenir et tellement lui appartenir, c’est-à-dire faire partie de lui, que nul autre désormais n’y ait plus droit, s’il veut en tirer un avantage quelconque pour l’entretien de sa vie.",
    "Bien que la terre et toutes les créatures inférieures appartiennent en commun à tous les hommes, chacun garde la propriété de sa propre personne. Sur celle-ci, nul n’a droit que lui-même. Le travail de son corps et l’ouvrage de ses mains, pouvons-nous dire, sont vraiment à lui. Toutes les fois qu’il fait sortir un objet de l’état où la Nature l’a mis et l’a laissé, il y mêle son travail, il y joint quelque chose qui lui appartient, et par là, il fait de lui sa propriété. Cet objet, soustrait par lui à l’état commun dans lequel la Nature l’avait placé, se voit adjoindre par ce travail quelque chose qui exclut le droit commun des autres hommes. Sans aucun doute, ce travail appartient à l’ouvrier ; nul autre que l’ouvrier ne saurait avoir de droit sur ce à quoi le travail s’attache, dès lors que ce qui reste commun suffit aux autres, en quantité et en qualité."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce texte donne une théorie fondamentale de l’appropriation du monde. Dans un chapitre HLP sur les découvertes et les conquêtes, il permet de demander comment une terre, d’abord pensée comme commune, devient une propriété légitime — ou contestable.",
  "hlpQuestion": "Comment penser l’appropriation privée d’un monde d’abord commun ?",
  "problematisations": [
    "Le travail suffit-il à légitimer la propriété ?",
    "Comment concilier appropriation individuelle et monde commun ?"
  ],
  "keywords": [
    "propriété",
    "travail",
    "nature",
    "commun"
  ],
  "hlpOppositions": [
    {
      "left": "commun",
      "right": "propre"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "bruno-univers-infini",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "Le principe d’un univers infini",
  "author": "Giordano Bruno",
  "authorTag": "Bruno",
  "cardHighlight": "univers infini",
  "authorMeta": "(1548–1600) · philosophie de la Renaissance",
  "themes": [
    "Nature",
    "Science",
    "Raison"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "infini",
      "cosmos",
      "pluralité des mondes",
      "décentrement"
    ]
  },
  "work": "Le Banquet des cendres",
  "publication": "1584, 1er dialogue, trad. Y. Hersant, Éditions de l’Éclat, 2006",
  "description": "Bruno célèbre la rupture avec le cosmos clos et affirme la pluralité possible des mondes dans un univers sans limites.",
  "context": "À la Renaissance, le bouleversement astronomique modifie non seulement les connaissances, mais la représentation de la place humaine dans le monde. Bruno présente l’infinité cosmique comme une libération des anciennes sphères et comme un décentrement radical.",
  "readingQuestions": [
    "Quelles limites de l’ancien cosmos Bruno affirme-t-il avoir franchies ?",
    "Comment la pluralité des mondes change-t-elle la place de la Terre ?",
    "Pourquoi l’ouverture de l’univers est-elle décrite sur un ton presque héroïque ?"
  ],
  "glossary": [
    {
      "term": "cosmos clos",
      "definition": "Représentation ancienne d’un univers fini, ordonné en sphères autour d’un centre."
    },
    {
      "term": "pluralité des mondes",
      "definition": "Hypothèse selon laquelle d’autres astres peuvent constituer des mondes comparables au nôtre et éventuellement abriter des êtres vivants."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Décentrement cosmologique",
      "definition": "La Terre cesse d’être un lieu absolument privilégié : l’univers peut contenir une multitude de mondes comparables au nôtre."
    }
  ],
  "relatedTexts": [
    {
      "id": "voltaire-micromegas-infiniment-petit",
      "kind": "suite",
      "label": "Voltaire — Changer d’échelle pour regarder l’homme",
      "relation": "Bruno ouvre l’univers ; Voltaire transforme cette immensité en dispositif littéraire de décentrement."
    }
  ],
  "paragraphs": [
    "Voici alors apparaître l’homme qui a franchi les airs, traversé le ciel, parcouru les étoiles, outrepassé les limites du monde, dissipé les murailles imaginaires des sphères du premier, du huitième, du neuvième, du dixième rang ou davantage […]. Le Soleil, la Lune, les autres astres recensés, il les rend aussi familiers aux hommes que s’ils y avaient élu domicile ; entre les corps que nous voyons au loin et celui dont nous sommes proches et solidaires, il expose les ressemblances, il établit les différences, il montre en quoi ils sont plus grands ou plus redoutables ; nous forçant enfin à ouvrir les yeux sur la divine mère nourricière qui nous porte sur son dos, après nous avoir tirés de son sein où nous finissons toujours par retourner, il nous interdit de voir en elle un corps inanimé et mort qui ne serait que la lie des substances corporelles.",
    "Ainsi avons-nous appris que sur la Lune, ou sur d’autres étoiles, nous n’aurions pas un habitat fort différent de celui-ci, ni même peut-être plus mauvais ; il est également possible qu’existent d’autres corps célestes offrant les mêmes qualités que le nôtre, voire des qualités supérieures, et plus heureusement adaptés aux animaux qu’ils abriteraient. Nous connaissons donc une multitude d’étoiles, d’astres, de divinités, qui par centaines de milliers participent au mystère et à la contemplation de la cause première, universelle, infinie et éternelle."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte montre qu’une représentation du monde engage plus qu’un dessin du ciel : elle transforme la place que l’être humain s’accorde dans l’univers. L’infini devient à la fois une idée scientifique, philosophique et imaginaire.",
  "hlpQuestion": "Que devient la place de l’homme lorsque l’univers cesse d’être clos et centré ?",
  "problematisations": [
    "L’infinité du monde transforme-t-elle notre conception de l’homme ?",
    "Une nouvelle représentation scientifique modifie-t-elle aussi notre imaginaire ?"
  ],
  "keywords": [
    "infini",
    "cosmos",
    "pluralité des mondes",
    "décentrement"
  ],
  "hlpOppositions": [
    {
      "left": "cosmos clos",
      "right": "univers infini"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "voltaire-micromegas-infiniment-petit",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "Rencontre avec l’infiniment petit",
  "author": "Voltaire",
  "authorTag": "Voltaire",
  "cardHighlight": "infiniment petit",
  "authorMeta": "(1694–1778) · écrivain et philosophe des Lumières",
  "themes": [
    "Raison",
    "Science",
    "Langage"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "échelle",
      "anthropocentrisme",
      "fiction",
      "relativité"
    ]
  },
  "work": "Micromégas",
  "publication": "1752, chapitre 6",
  "description": "Des géants extraterrestres découvrent les humains comme des êtres presque imperceptibles et doivent inventer un dispositif pour les entendre.",
  "context": "Le conte philosophique fait varier les échelles : vus par Micromégas et le Saturnien, les humains ne sont plus la mesure du monde. L’imagination littéraire devient un instrument pour réfléchir aux limites de nos sens et de nos jugements.",
  "readingQuestions": [
    "Pourquoi le Saturnien refuse-t-il d’abord de croire que les humains parlent et pensent ?",
    "Quels préjugés viennent des limites de ses sens ?",
    "Comment l’invention de la « trompette parlante » transforme-t-elle la fiction en expérience de connaissance ?"
  ],
  "glossary": [
    {
      "term": "conte philosophique",
      "definition": "Récit fictif qui utilise l’aventure, l’ironie et l’imagination pour examiner des questions philosophiques."
    },
    {
      "term": "changement d’échelle",
      "definition": "Procédé qui modifie les proportions habituelles afin de faire apparaître autrement un objet ou une situation."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Apparence",
        "definition": "À l’échelle des géants, les humains paraissent insignifiants et presque impossibles à entendre."
      },
      "right": {
        "term": "Pensée",
        "definition": "L’examen montre pourtant qu’ils communiquent et raisonnent."
      },
      "conclusion": "La valeur d’un être ne se déduit pas de sa taille ni de ce que nos sens perçoivent immédiatement."
    }
  ],
  "relatedTexts": [
    {
      "id": "bruno-univers-infini",
      "kind": "proche",
      "label": "Bruno — Un univers sans centre privilégié",
      "relation": "Les deux textes déplacent l’homme hors de sa position spontanément centrale."
    }
  ],
  "paragraphs": [
    "Micromégas, bien meilleur observateur que son nain, vit clairement que les atomes se parlaient ; et il le fit remarquer à son compagnon, qui, honteux de s’être mépris sur l’article de la génération, ne voulut point croire que de pareilles espèces pussent se communiquer des idées. Il avait le don des langues aussi bien que le Sirien : il n’entendait point parler nos atomes, et il supposait qu’ils ne parlaient pas : d’ailleurs, comment ces êtres imperceptibles auraient-ils les organes de la voix, et qu’auraient-ils à dire ? Pour parler, il faut penser, ou à peu près ; mais s’ils pensaient, ils auraient donc l’équivalent d’une âme : or, attribuer l’équivalent d’une âme à cette espèce, cela lui paraissait absurde. « Mais, dit le Sirien, vous avez cru tout à l’heure qu’ils faisaient l’amour ; est-ce que vous croyez qu’on puisse faire l’amour sans penser et sans proférer quelque parole, ou du moins sans se faire entendre ? Supposez-vous d’ailleurs qu’il soit plus difficile de produire un argument qu’un enfant ? Pour moi, l’un et l’autre me paraissent de grands mystères. — Je n’ose plus ni croire ni nier, dit le nain ; je n’ai plus d’opinion ; il faut tâcher d’examiner ces insectes, nous raisonnerons après. »",
    "« C’est fort bien dit », reprit Micromégas ; et aussitôt il tira une paire de ciseaux dont il se coupa les ongles, et d’une rognure de l’ongle de son pouce il fit sur-le-champ une espèce de grande trompette parlante, comme un vaste entonnoir, dont il mit le tuyau dans son oreille. La circonférence de l’entonnoir enveloppait le vaisseau et tout l’équipage. La voix la plus faible entrait dans les fibres circulaires de l’ongle ; de sorte que, grâce à son industrie, le philosophe de là-haut entendit parfaitement le bourdonnement de nos insectes de là-bas."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte rend sensible le décentrement par une idée très simple : changer d’échelle. L’imagination produit ici une expérience de pensée qui relativise notre importance et interroge le lien entre perception, langage et intelligence.",
  "hlpQuestion": "Le changement d’échelle peut-il nous délivrer de l’anthropocentrisme ?",
  "problematisations": [
    "Sommes-nous capables de juger le monde autrement qu’à notre propre échelle ?",
    "La fiction permet-elle de mieux voir les limites de notre point de vue ?"
  ],
  "keywords": [
    "échelle",
    "anthropocentrisme",
    "fiction",
    "relativité"
  ],
  "hlpOppositions": [
    {
      "left": "grandeur",
      "right": "petitesse"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "more-utopia-monde-egalitaire",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "Un monde égalitaire",
  "author": "Thomas More",
  "authorTag": "Thomas More",
  "cardHighlight": "monde égalitaire",
  "authorMeta": "(1478–1535) · humanisme de la Renaissance",
  "themes": [
    "Justice",
    "État",
    "Bonheur"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "utopie",
      "égalité",
      "société",
      "bien commun"
    ]
  },
  "work": "Utopia",
  "publication": "1516, livre II, trad. V. Stouvenel, Flammarion, « Librio », 2016",
  "description": "More décrit minutieusement les repas des Utopiens afin de faire voir une société organisée par l’égalité, la discipline et le bien commun.",
  "context": "L’utopie ne se contente pas d’énoncer des principes : elle invente un monde et en décrit les gestes ordinaires. Le repas collectif devient une miniature de la société idéale, où égalité, hiérarchie des âges, éducation morale et plaisir sont réglés ensemble.",
  "readingQuestions": [
    "Comment l’organisation spatiale des repas produit-elle de l’égalité ?",
    "Pourquoi le texte décrit-il des détails aussi quotidiens ?",
    "Le contrôle social exercé par les anciens est-il compatible avec l’idéal d’une société heureuse ?"
  ],
  "glossary": [
    {
      "term": "utopie",
      "definition": "Description d’une société imaginaire qui permet d’examiner ou de critiquer les institutions du monde réel."
    },
    {
      "term": "sygrophante",
      "definition": "Magistrat utopien chargé de l’organisation d’un groupe de familles dans l’œuvre de More."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Égalité",
        "definition": "Les convives sont servis selon un principe de partage et de proximité entre les âges."
      },
      "right": {
        "term": "Discipline",
        "definition": "La présence des anciens et le regard des autres règlent fortement les comportements."
      },
      "conclusion": "L’utopie fait apparaître une tension classique : organiser l’égalité peut aussi multiplier les règles collectives."
    }
  ],
  "relatedTexts": [
    {
      "id": "marivaux-ile-esclaves-monde-envers",
      "kind": "proche",
      "label": "Marivaux — Le monde à l’envers",
      "relation": "More invente une société stable ; Marivaux crée une île expérimentale où l’inversion des rôles corrige les rapports de domination."
    }
  ],
  "paragraphs": [
    "Des deux côtés de la salle sont rangés alternativement deux jeunes gens et deux individus plus âgés. Cette disposition rapproche les égaux et confond à la fois tous les âges ; en outre elle remplit un but moral. Comme rien ne peut se dire ou se faire qui ne soit aperçu des voisins, alors la gravité de la vieillesse, le respect qu’elle inspire retiennent la pétulance des jeunes gens et les empêchent de s’émanciper outre mesure en paroles et en gestes.",
    "La table du sygrophante est servie la première ; ensuite les autres, suivant leur position. Les meilleurs morceaux sont portés aux anciens des familles, qui occupent des places fixes et remarquables ; tous les autres sont servis avec une égalité parfaite. Ces bons vieillards n’ont pas assez de leurs portions pour en donner à tout le monde ; mais ils les partagent, à leur gré, avec leurs plus proches voisins. Ainsi l’on rend à la vieillesse l’honneur qui lui est dû, et cet hommage tourne au bien de tous.",
    "Les dîners et les soupers commencent par la lecture d’un livre de morale ; cette lecture est courte, pour qu’elle n’ennuie pas. Quand elle est finie, les plus âgés entament des conversations honnêtes, mais pleines d’enjouement et de gaieté. Loin de parler seuls et toujours, ils écoutent volontiers les jeunes gens ; ils provoquent même leurs saillies, afin d’apprécier la nature de leur caractère et de leur esprit, nature qui se trahit aisément dans la chaleur et la liberté du repas.",
    "Le dîner est court, le souper long : parce que le dîner est suivi du travail, tandis que, après le souper, viennent le sommeil et le repos de la nuit. Or les Utopiens croient que le sommeil vaut mieux que le travail pour une bonne digestion. Le souper ne se passe jamais sans musique et sans un dessert copieux et friand. Les parfums, les essences les plus odorantes, rien n’est épargné pour le bien-être et pour la jouissance des convives. Peut-être en ceci accusera-t-on les Utopiens d’un penchant excessif au plaisir. Ils ont pour principe que la volupté qui n’engendre aucun mal est parfaitement légitime."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce passage montre ce que permet l’utopie : donner une forme sensible à des principes politiques. Au lieu de définir abstraitement l’égalité, More nous fait entrer dans une organisation concrète et nous laisse en examiner les bénéfices comme les contraintes.",
  "hlpQuestion": "Pourquoi inventer une société imaginaire pour juger la société réelle ?",
  "problematisations": [
    "Une société idéale éclaire-t-elle le réel ou le simplifie-t-elle ?",
    "L’égalité peut-elle être compatible avec une organisation très réglée de la vie commune ?"
  ],
  "keywords": [
    "utopie",
    "égalité",
    "société",
    "bien commun"
  ],
  "hlpOppositions": [
    {
      "left": "monde réel",
      "right": "monde possible"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "bacon-maison-salomon-science-utopie",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "La maison de Salomon",
  "author": "Francis Bacon",
  "authorTag": "Bacon",
  "cardHighlight": "maison de Salomon",
  "authorMeta": "(1561–1626) · empirisme et philosophie des sciences",
  "themes": [
    "Science",
    "Technique",
    "Nature"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "science",
      "utopie",
      "technique",
      "progrès"
    ]
  },
  "work": "La Nouvelle Atlantide",
  "publication": "1627, trad. M. Le Dœuff et M. Llasera, Garnier-Flammarion, 1995",
  "description": "Bacon imagine une institution scientifique capable d’explorer les causes naturelles et de produire des transformations inédites du monde.",
  "context": "Dans la Nouvelle Atlantide, la Maison de Salomon concentre des dispositifs d’observation, d’expérimentation et d’invention. L’utopie donne une forme imaginaire au projet baconien : connaître la nature afin d’accroître la puissance humaine.",
  "readingQuestions": [
    "Quelle finalité Bacon assigne-t-il à la connaissance des causes naturelles ?",
    "Pourquoi la description accumule-t-elle les dispositifs et les expériences ?",
    "Que révèle cette utopie du rapport moderne entre science, technique et puissance ?"
  ],
  "glossary": [
    {
      "term": "empire humain",
      "definition": "Dans le texte, extension de la puissance d’action humaine obtenue par la connaissance des causes et des lois de la nature."
    },
    {
      "term": "utopie scientifique",
      "definition": "Monde imaginaire qui organise la société autour de la production et de l’usage de connaissances scientifiques."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Savoir et pouvoir",
      "definition": "La connaissance n’est pas seulement contemplative : elle vise la production d’effets, de matériaux et de techniques nouvelles."
    }
  ],
  "relatedTexts": [
    {
      "id": "diderot-alembert-projet-encyclopedique",
      "kind": "proche",
      "label": "Diderot et d’Alembert — Rassembler et transmettre les connaissances",
      "relation": "Bacon imagine l’institution qui produit le savoir ; l’Encyclopédie organise sa transmission et sa mise en système."
    }
  ],
  "paragraphs": [
    "Notre Fondation a pour fin de connaître les causes et le mouvement secret des choses ; et de reculer les bornes de l’Empire humain en vue de réaliser toutes les choses possibles. Voici quels sont les dispositifs de préparation et les instruments. Nous avons de vastes grottes souterraines, de profondeurs différentes. Certaines sont creusées sous de grandes collines ou des montagnes, de sorte que si vous ajoutez la profondeur proprement dite de la grotte à la hauteur de la colline, elles comptent, du moins certaines d’entre elles, plus de trois miles de profondeur effective. Car nous trouvons que la profondeur d’une grotte et la hauteur d’une colline, l’une et l’autre calculées par rapport à la plaine, c’est la même chose. Dans les deux cas, la grotte est à l’abri du soleil, des rayons célestes et du grand air. Nous appelons ces grottes la Région Inférieure.",
    "Nous les utilisons pour coaguler, solidifier, réfrigérer et conserver des corps. Nous les utilisons de même pour imiter les mines naturelles ; et pour produire de nouveaux métaux artificiels, au moyen de mélanges et substances que nous laissons reposer pendant de nombreuses années. Nous les utilisons aussi quelquefois (ce qui paraît étrange) pour soigner certaines maladies et pour prolonger la vie de quelques ermites qui ont choisi de vivre là, convenablement pourvus de tout ce qui est nécessaire. Ils vivent de fait très longtemps ; par eux, nous apprenons beaucoup de choses."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte relie directement représentation et transformation du monde. Imaginer une institution scientifique, c’est déjà concevoir ce que la connaissance pourrait rendre possible — et poser la question de ses limites.",
  "hlpQuestion": "Imaginer un monde nouveau permet-il de penser les pouvoirs de la science ?",
  "problematisations": [
    "Le progrès scientifique conduit-il nécessairement au progrès humain ?",
    "Une utopie scientifique révèle-t-elle autant nos espoirs que nos risques ?"
  ],
  "keywords": [
    "science",
    "utopie",
    "technique",
    "progrès"
  ],
  "hlpOppositions": [
    {
      "left": "connaître",
      "right": "transformer"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "marivaux-ile-esclaves-monde-envers",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "Le monde à l’envers",
  "author": "Marivaux",
  "authorTag": "Marivaux",
  "cardHighlight": "monde à l’envers",
  "authorMeta": "(1688–1763) · théâtre des Lumières",
  "themes": [
    "Justice",
    "Liberté",
    "État"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "inversion",
      "domination",
      "égalité",
      "fiction"
    ]
  },
  "work": "L’Île des esclaves",
  "publication": "1725, scène 2",
  "description": "Sur l’île des esclaves, les rapports entre maîtres et serviteurs sont inversés afin que les dominants éprouvent ce qu’ils imposaient aux autres.",
  "context": "La fiction construit un laboratoire moral : les statuts sociaux sont renversés, non pour installer une vengeance permanente, mais pour corriger l’orgueil des maîtres en leur faisant éprouver la condition de ceux qu’ils dominaient.",
  "readingQuestions": [
    "Pourquoi Trivelin impose-t-il l’échange des noms et des statuts ?",
    "Quelle différence établit-il entre vengeance et correction ?",
    "En quoi l’île fonctionne-t-elle comme une expérience destinée à transformer les personnages ?"
  ],
  "glossary": [
    {
      "term": "inversion des rôles",
      "definition": "Procédé fictif qui échange les positions sociales afin de faire éprouver à chacun la situation de l’autre."
    },
    {
      "term": "cours d’humanité",
      "definition": "Expression de Trivelin : l’esclavage temporaire devient une épreuve pédagogique destinée à corriger l’orgueil et la cruauté."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Vengeance",
        "definition": "Répondre à la domination passée par une violence symétrique."
      },
      "right": {
        "term": "Correction",
        "definition": "Faire subir une expérience limitée afin de produire une prise de conscience et un changement moral."
      },
      "conclusion": "L’île est une fiction politique parce qu’elle transforme un rapport social en expérience pédagogique."
    }
  ],
  "relatedTexts": [
    {
      "id": "more-utopia-monde-egalitaire",
      "kind": "proche",
      "label": "Thomas More — Un monde égalitaire",
      "relation": "Deux mondes imaginaires permettent d’évaluer autrement l’ordre social réel."
    }
  ],
  "paragraphs": [
    "Trivelin — Eh bien ! changez de nom à présent ; soyez le seigneur Iphicrate à votre tour ; et vous, Iphicrate, appelez-vous Arlequin, ou bien Hé. Arlequin, sautant de joie, à son maître. — Oh, oh, que nous allons rire ! seigneur Hé ! Trivelin, à Arlequin. — Souvenez-vous en prenant son nom, mon cher ami, qu’on vous le donne bien moins pour réjouir votre vanité, que pour le corriger de son orgueil. Arlequin — Oui, oui, corrigeons, corrigeons ! Iphicrate, regardant Arlequin. — Maraud ! Arlequin — Parlez donc, mon bon ami ; voilà encore une licence qui lui prend ; cela est-il du jeu ?",
    "Trivelin, à Arlequin. — Dans ce moment-ci, il peut vous dire tout ce qu’il voudra. À Iphicrate. Arlequin, votre aventure vous afflige, et vous êtes outré contre Iphicrate et contre nous. Ne vous gênez point, soulagez-vous par l’emportement le plus vif ; traitez-le de misérable, et nous aussi ; tout vous est permis à présent ; mais ce moment-ci passé, n’oubliez pas que vous êtes Arlequin, que voici Iphicrate, et que vous êtes auprès de lui ce qu’il était auprès de vous ; ce sont là nos lois, et ma charge dans la république est de les faire observer en ce canton-ci. […]",
    "Trivelin — […] Je pense donc que vous savez qui nous sommes. Quand nos pères, irrités de la cruauté de leurs maîtres, quittèrent la Grèce et vinrent s’établir ici dans le ressentiment des outrages qu’ils avaient reçus de leurs patrons, la première loi qu’ils y firent fut d’ôter la vie à tous les maîtres que le hasard ou le naufrage conduirait dans leur île, et conséquemment de rendre la liberté à tous les esclaves ; la vengeance avait dicté cette loi ; vingt ans après la raison l’abolit, et en dicta une plus douce. Nous ne nous vengeons plus de vous, nous vous corrigeons ; ce n’est plus votre vie que nous poursuivons, c’est la barbarie de vos cœurs que nous voulons détruire ; nous vous jetons dans l’esclavage pour vous rendre sensible aux maux qu’on y éprouve : nous vous humilions, afin que, nous trouvant superbes, vous vous reprochiez de l’avoir été. Votre esclavage, ou plutôt votre cours d’humanité dure trois ans […]."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Marivaux montre comment un monde imaginaire peut servir d’expérience morale. L’inversion ne décrit pas une société réelle : elle rend visibles des rapports de domination que l’habitude avait normalisés.",
  "hlpQuestion": "Que révèle l’inversion fictive des rôles sociaux ?",
  "problematisations": [
    "Faut-il inverser les positions pour comprendre l’injustice ?",
    "La fiction peut-elle corriger les rapports de domination réels ?"
  ],
  "keywords": [
    "inversion",
    "domination",
    "égalité",
    "fiction"
  ],
  "hlpOppositions": [
    {
      "left": "maître",
      "right": "serviteur"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "diderot-alembert-projet-encyclopedique",
  "section": "autres",
  "cardMeta": "Décrire, figurer, imaginer",
  "title": "Le projet encyclopédique",
  "author": "Denis Diderot et Jean le Rond d’Alembert",
  "authorTag": "Diderot & d’Alembert",
  "cardHighlight": "projet encyclopédique",
  "authorMeta": "XVIIIe siècle · Lumières et Encyclopédie",
  "themes": [
    "Science",
    "Raison",
    "Culture"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "tags": [
      "savoir",
      "encyclopédie",
      "transmission",
      "classification"
    ]
  },
  "work": "Encyclopédie",
  "publication": "1751, tome V, article « Encyclopédie »",
  "description": "L’Encyclopédie veut rassembler les connaissances, en exposer le système général et les transmettre aux générations futures.",
  "context": "Une encyclopédie représente le monde des savoirs en les ordonnant. Diderot et d’Alembert associent cette mise en système à un projet historique : transmettre les acquis du passé pour rendre les générations suivantes plus instruites, plus heureuses et plus vertueuses.",
  "readingQuestions": [
    "Quels sont les trois grands objectifs de l’Encyclopédie ?",
    "Pourquoi une œuvre encyclopédique ne peut-elle être le travail d’un seul homme ?",
    "Quel idéal de progrès humain justifie l’entreprise ?"
  ],
  "glossary": [
    {
      "term": "encyclopédie",
      "definition": "Étymologiquement, cercle ou enchaînement des connaissances ; ouvrage qui cherche à organiser un ensemble de savoirs."
    },
    {
      "term": "système général",
      "definition": "Organisation qui relie les connaissances entre elles plutôt que de les juxtaposer sans ordre."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Représenter le savoir",
      "definition": "L’Encyclopédie construit une vision organisée du monde intellectuel : sélectionner, classer et relier sont déjà des opérations de représentation."
    }
  ],
  "relatedTexts": [
    {
      "id": "bacon-maison-salomon-science-utopie",
      "kind": "proche",
      "label": "Bacon — La Maison de Salomon",
      "relation": "Bacon imagine la production institutionnelle des savoirs ; l’Encyclopédie pense leur organisation et leur transmission."
    }
  ],
  "paragraphs": [
    "ENCYCLOPÉDIE, s. f. (Philosoph.) Ce mot signifie enchaînement de connaissances ; il est composé de la préposition grecque ἐν, en, & des substantifs κύκλος, cercle, & παιδεία, connaissance.",
    "En effet, le but d’une Encyclopédie est de rassembler les connaissances éparses sur la surface de la terre ; d’en exposer le système général aux hommes avec qui nous vivons, et de le transmettre aux hommes qui viendront après nous ; afin que les travaux des siècles passés n’aient pas été des travaux inutiles pour les siècles qui succéderont ; que nos neveux, devenant plus instruits, deviennent en même temps plus vertueux et plus heureux, et que nous ne mourions pas sans avoir bien mérité du genre humain.",
    "Il eût été difficile de se proposer un objet plus étendu que celui de traiter de tout ce qui a rapport à la curiosité de l’homme, à ses devoirs, à ses besoins, et à ses plaisirs. Aussi quelques personnes accoutumées à juger de la possibilité d’une entreprise, sur le peu de ressources qu’elles aperçoivent en elles-mêmes, ont prononcé que jamais nous n’achèverions la nôtre. […] Quand on vient à considérer la matière immense d’une Encyclopédie, la seule chose qu’on aperçoive distinctement, c’est que ce ne peut être l’ouvrage d’un seul homme. Et comment un seul homme, dans le court espace de sa vie, réussirait-il à connaître et à développer le système universel de la nature et de l’art ?"
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce texte donne un sens fort au verbe « représenter » : il ne s’agit plus seulement d’imaginer un monde, mais de construire une carte du savoir. Classer et transmettre les connaissances devient un projet collectif de civilisation.",
  "hlpQuestion": "Comment représenter et transmettre l’ensemble des connaissances humaines ?",
  "problematisations": [
    "Peut-on ordonner toutes les connaissances sans imposer une certaine représentation du savoir ?",
    "Transmettre le savoir est-il déjà une manière de transformer la société ?"
  ],
  "keywords": [
    "savoir",
    "encyclopédie",
    "transmission",
    "classification"
  ],
  "hlpOppositions": [
    {
      "left": "dispersion",
      "right": "système"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "descartes-animal-machine-instinct",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "L’animal-machine",
  "author": "René Descartes",
  "authorTag": "Descartes",
  "cardHighlight": "animal-machine",
  "authorMeta": "(1596–1650) · rationalisme moderne",
  "themes": [
    "Nature",
    "Raison",
    "Conscience"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "animal-machine",
      "instinct",
      "pensée",
      "raison"
    ]
  },
  "work": "Lettre au marquis de Newcastle",
  "publication": "23 novembre 1646, Œuvres philosophiques",
  "description": "Descartes explique les comportements animaux par l’organisation mécanique du corps et l’instinct plutôt que par une pensée comparable à la nôtre.",
  "context": "Descartes reconnaît que les animaux accomplissent parfois des actions remarquables. Mais loin d’y voir la preuve d’une intelligence, il les compare à des horloges : la perfection de certains comportements révèle selon lui un mécanisme naturel spécialisé.",
  "readingQuestions": [
    "Pourquoi le fait que les animaux nous surpassent parfois ne prouve-t-il pas qu’ils pensent ?",
    "Quel rôle joue la comparaison avec l’horloge ?",
    "Pourquoi Descartes refuse-t-il de reconnaître une pensée à certains animaux seulement ?"
  ],
  "glossary": [
    {
      "term": "animal-machine",
      "definition": "Thèse cartésienne selon laquelle le comportement animal peut être expliqué par les mécanismes corporels sans supposer une âme pensante comparable à celle de l’homme."
    },
    {
      "term": "instinct",
      "definition": "Disposition naturelle orientant certains comportements sans délibération consciente."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Performance",
        "definition": "Un animal peut accomplir une action mieux qu’un humain."
      },
      "right": {
        "term": "Pensée",
        "definition": "Pour Descartes, cette réussite spécialisée ne prouve pas une capacité générale à juger ou raisonner."
      },
      "conclusion": "La difficulté consiste à savoir ce qu’un comportement extérieur permet réellement d’inférer sur la vie mentale d’un autre être."
    }
  ],
  "relatedTexts": [
    {
      "id": "lafontaine-ingeniosite-animale",
      "kind": "adverse",
      "label": "La Fontaine — De l’ingéniosité animale",
      "relation": "La Fontaine reprend explicitement la théorie de l’animal-machine pour la mettre en cause à partir des conduites des castors."
    }
  ],
  "paragraphs": [
    "Je sais bien que les bêtes font beaucoup de choses mieux que nous, mais je ne m’en étonne pas ; car cela même sert à prouver qu’elles agissent naturellement et par ressorts, ainsi qu’une horloge, laquelle montre bien mieux l’heure qu’il est, que notre jugement ne nous l’enseigne. Et sans doute que, lorsque les hirondelles viennent au printemps, elles agissent en cela comme des horloges. Tout ce que font les mouches à miel est de même nature, et l’ordre que tiennent les grues en volant et celui qu’observent les singes en se battant, s’il est vrai qu’ils en observent quelqu’un, et enfin l’instinct d’ensevelir leurs morts, n’est pas plus étrange que celui des chiens et des chats, qui grattent la terre pour ensevelir leurs excréments, bien qu’ils ne les ensevelissent presque jamais : ce qui montre qu’ils ne le font que par instinct, et sans y penser.",
    "On peut seulement dire que, bien que les bêtes ne fassent aucune action qui nous assure qu’elles pensent, toutefois, à cause que les organes de leurs corps ne sont pas fort différents des nôtres, on peut conjecturer qu’il y a quelque pensée jointe à ces organes, ainsi que nous expérimentons en nous, bien que la leur soit beaucoup moins parfaite. À quoi je n’ai rien à répondre, sinon que, si elles pensaient ainsi que nous, elles auraient une âme immortelle aussi bien que nous ; ce qui n’est pas vraisemblable, à cause qu’il n’y a point de raison pour le croire de quelques animaux, sans le croire de tous, et qu’il y en a plusieurs trop imparfaits pour pouvoir croire cela d’eux, comme sont les huîtres, les éponges, etc."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "C’est la position classique à connaître pour comprendre le débat moderne sur la frontière homme-animal. Le texte oblige à distinguer performance extérieure, instinct et pensée — distinction que La Fontaine, Montaigne et La Mettrie vont contester.",
  "hlpQuestion": "Un comportement complexe suffit-il à prouver qu’un animal pense ?",
  "problematisations": [
    "Peut-on déduire une pensée à partir d’un comportement ?",
    "La différence entre l’homme et l’animal est-elle de nature ou de degré ?"
  ],
  "keywords": [
    "animal-machine",
    "instinct",
    "pensée",
    "raison"
  ],
  "hlpOppositions": [
    {
      "left": "instinct",
      "right": "pensée"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "lafontaine-ingeniosite-animale",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "De l’ingéniosité animale",
  "author": "Jean de La Fontaine",
  "authorTag": "La Fontaine",
  "cardHighlight": "ingéniosité animale",
  "authorMeta": "(1621–1695) · moraliste et fabuliste",
  "themes": [
    "Nature",
    "Raison"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "intelligence animale",
      "instinct",
      "invention",
      "observation"
    ]
  },
  "work": "Fables, « Discours à Madame de La Sablière »",
  "publication": "1678, livre IX, fable 20",
  "description": "La Fontaine répond à la théorie cartésienne de l’animal-machine en présentant l’organisation collective des castors comme une forme d’art et de savoir.",
  "context": "Le poème cite d’abord la thèse mécaniste qu’il veut contester, puis met en scène les ouvrages des castors. Leur coopération, leur architecture et la transmission des tâches servent d’arguments en faveur d’une véritable ingéniosité animale.",
  "readingQuestions": [
    "Quelle théorie La Fontaine résume-t-il au début du passage ?",
    "Quels comportements des castors sont présentés comme des signes d’intelligence ?",
    "Pourquoi la comparaison avec les humains est-elle ironique ?"
  ],
  "glossary": [
    {
      "term": "ressorts",
      "definition": "Pièces mécaniques d’un automate ; le mot résume ici l’explication mécaniste du comportement animal."
    },
    {
      "term": "ingéniosité",
      "definition": "Capacité d’inventer des moyens adaptés à une difficulté ou à une fin."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Machine",
        "definition": "La théorie cartésienne interprète les conduites animales comme des effets mécaniques sans pensée."
      },
      "right": {
        "term": "Ingéniosité",
        "definition": "La Fontaine met en avant organisation, coopération et construction pour suggérer une forme de savoir."
      },
      "conclusion": "Le même comportement peut recevoir deux interprétations philosophiques radicalement différentes."
    }
  ],
  "relatedTexts": [
    {
      "id": "descartes-animal-machine-instinct",
      "kind": "adverse",
      "label": "Descartes — L’animal-machine",
      "relation": "La Fontaine vise explicitement la thèse cartésienne selon laquelle l’animal agit par mécanisme et non par pensée."
    }
  ],
  "paragraphs": [
    "[…] Ils disent donc<br>Que la bête est une machine ;<br>Qu’en elle tout se fait sans choix et par ressorts :<br>Nul sentiment, point d’âme, en elle tout est corps.<br>[…]",
    "Non loin du Nord il est un monde<br>Où l’on sait que les habitants<br>Vivent ainsi qu’aux premiers temps<br>Dans une ignorance profonde :<br>Je parle des humains ; car quant aux animaux,<br>Ils y construisent des travaux<br>Qui des torrents grossis arrêtent le ravage,<br>Et font communiquer l’un et l’autre rivage.<br>L’édifice résiste, et dure en son entier ;<br>Après un lit de bois, est un lit de mortier.<br>Chaque Castor agit ; commune en est la tâche ;<br>Le vieux y fait marcher le jeune sans relâche.<br>Maint maître d’œuvre y court, et tient haut le bâton.<br>La république de Platon<br>Ne serait rien que l’apprentie<br>De cette famille amphibie.<br>Ils savent en hiver élever leurs maisons,<br>Passent les étangs sur des ponts,<br>Fruit de leur art, savant ouvrage ;<br>Et nos pareils ont beau le voir,<br>Jusqu’à présent tout leur savoir<br>Est de passer l’onde à la nage.",
    "Que ces Castors ne soient qu’un corps vide d’esprit,<br>Jamais on ne pourra m’obliger à le croire ;"
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte est le contradicteur idéal de Descartes : même époque, même problème, conclusion opposée. Il montre aussi comment la littérature peut entrer dans une controverse philosophique en transformant l’observation animale en argument.",
  "hlpQuestion": "Les conduites animales obligent-elles à leur reconnaître intelligence et invention ?",
  "problematisations": [
    "L’ingéniosité animale peut-elle être expliquée par le seul instinct ?",
    "Observer des conduites complexes suffit-il à attribuer une intelligence ?"
  ],
  "keywords": [
    "intelligence animale",
    "instinct",
    "invention",
    "observation"
  ],
  "hlpOppositions": [
    {
      "left": "mécanisme",
      "right": "ingéniosité"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "montaigne-animaux-communication",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "Les animaux aussi communiquent",
  "author": "Michel de Montaigne",
  "authorTag": "Montaigne",
  "cardHighlight": "animaux aussi communiquent",
  "authorMeta": "(1533–1592) · humanisme et scepticisme",
  "themes": [
    "Langage",
    "Nature",
    "Autrui"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "langage animal",
      "communication",
      "anthropocentrisme",
      "altérité"
    ]
  },
  "work": "Essais, « Apologie de Raimond Sebond »",
  "publication": "1580, II, 12, texte établi par E. Naya, D. Reguig-Naya et A. Tarrête, Gallimard, 2009",
  "description": "Montaigne retourne notre incapacité à comprendre les animaux : si nous ne saisissons pas leur langage, rien ne prouve qu’ils n’en aient pas.",
  "context": "L’absence de langue commune devient un argument contre la présomption humaine. Montaigne rappelle que l’incompréhension peut être symétrique et que nous interprétons déjà des signes animaux sans disposer d’un accès direct à leurs pensées.",
  "readingQuestions": [
    "Comment Montaigne retourne-t-il contre l’homme l’argument de l’incompréhension ?",
    "Quels exemples montrent que nous interprétons déjà des signes animaux ?",
    "Pourquoi l’auteur parle-t-il d’une « moyenne intelligence » entre les espèces ?"
  ],
  "glossary": [
    {
      "term": "communication",
      "definition": "Échange de signes permettant une certaine compréhension entre des êtres, sans supposer nécessairement une langue identique à la nôtre."
    },
    {
      "term": "présomption",
      "definition": "Opinion trop avantageuse que l’on a de soi ; Montaigne vise la tendance humaine à se croire naturellement supérieur aux autres animaux."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Argument de symétrie",
      "definition": "Si l’homme ne comprend pas les animaux, ceux-ci peuvent tout aussi bien le juger incompréhensible. L’ignorance ne suffit donc pas à établir une infériorité."
    }
  ],
  "relatedTexts": [
    {
      "id": "descartes-langage-pensee",
      "kind": "adverse",
      "label": "Descartes — Seul le langage humain exprime des pensées",
      "relation": "Descartes fait du langage un critère de la pensée humaine ; Montaigne met en doute notre capacité à exclure les animaux de toute communication signifiante."
    }
  ],
  "paragraphs": [
    "Ce défaut qui empêche la communication d’entre elles et nous, pourquoi n’est-il aussi bien à nous qu’à elles ? C’est à deviner à qui est la faute de ne nous entendre point : car nous ne les entendons non plus qu’elles nous. Par cette même raison, elles nous peuvent estimer bêtes, comme nous les en estimons. Ce n’est pas grande merveille, si nous ne les entendons pas, aussi ne faisons-nous les Basques et les Troglodytes. Toutefois aucuns se sont vantés de les entendre, comme Apollonius Thyaneus, Melampus, Tiresias, Thalès et autres.",
    "Et puisqu’il est ainsi, comme disent les Cosmographes, qu’il y a des nations qui reçoivent un chien pour leur Roi, il faut bien qu’ils donnent certaine interprétation à sa voix et mouvements. Il nous faut remarquer la parité qui est entre nous. Nous avons quelque moyenne intelligence de leurs sens, aussi ont les bêtes du nôtre, environ à même mesure. Elles nous flattent, nous menacent, et nous requièrent, et nous elles."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte fournit un raisonnement sceptique très simple et très puissant : ne pas comprendre n’est pas prouver l’absence de sens. Il permet de travailler à la fois le langage, l’altérité et les limites de nos critères de l’intelligence.",
  "hlpQuestion": "L’absence de langage compris par l’homme prouve-t-elle l’absence de langage animal ?",
  "problematisations": [
    "Ne pas comprendre un langage autorise-t-il à nier qu’il existe ?",
    "La communication animale remet-elle en cause le privilège humain du langage ?"
  ],
  "keywords": [
    "langage animal",
    "communication",
    "anthropocentrisme",
    "altérité"
  ],
  "hlpOppositions": [
    {
      "left": "incompréhension",
      "right": "absence de langage"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "lamettrie-animaux-morale-remords",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "Les animaux et la morale",
  "author": "Julien Offray de La Mettrie",
  "authorTag": "La Mettrie",
  "cardHighlight": "animaux et la morale",
  "authorMeta": "(1709–1751) · matérialisme des Lumières",
  "themes": [
    "Devoir",
    "Nature",
    "Conscience"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "conscience",
      "morale animale",
      "remords",
      "analogie"
    ]
  },
  "work": "L’Homme Machine",
  "publication": "1748",
  "description": "La Mettrie conteste l’idée selon laquelle la connaissance du bien et du mal appartiendrait exclusivement aux êtres humains.",
  "context": "Nous n’avons jamais un accès direct aux états intérieurs d’autrui : nous les inférons à partir de paroles et de signes. La Mettrie propose d’appliquer la même méthode aux animaux et interprète certains comportements comme des indices de remords ou de reconnaissance.",
  "readingQuestions": [
    "Pourquoi notre propre conscience ne suffit-elle pas à connaître celle d’autrui ?",
    "Comment La Mettrie passe-t-il des signes humains aux signes animaux ?",
    "Les exemples de remords ou de reconnaissance prouvent-ils réellement l’existence d’une morale animale ?"
  ],
  "glossary": [
    {
      "term": "loi naturelle",
      "definition": "Principe moral supposé inscrit dans la nature et permettant de distinguer le bien du mal."
    },
    {
      "term": "remords",
      "definition": "Sentiment de culpabilité éprouvé après avoir accompli une action tenue pour mauvaise."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Inférence à partir des signes",
      "definition": "La vie intérieure d’un autre être n’est jamais directement visible : nous la reconstruisons à partir de comportements observables. La Mettrie demande d’appliquer ce principe sans exception arbitraire."
    }
  ],
  "relatedTexts": [
    {
      "id": "montaigne-animaux-communication",
      "kind": "proche",
      "label": "Montaigne — Les animaux aussi communiquent",
      "relation": "Les deux textes contestent l’idée que notre difficulté à comprendre les animaux suffise à nier leur vie mentale."
    }
  ],
  "paragraphs": [
    "Il y a, dit-on, dans l’homme une Loi naturelle, une connaissance du bien et du mal, qui n’a pas été gravée dans le cœur des animaux. Mais cette objection, ou plutôt cette assertion est-elle fondée sur l’expérience, sans laquelle un Philosophe peut tout rejeter ? En avons-nous quelqu’une qui nous convainque que l’homme seul a été éclairé d’un rayon refusé à tous les autres Animaux ? S’il n’y en a point, nous ne pouvons pas plus connaître par elle ce qui se passe dans eux, et même dans les hommes, que ne pas sentir ce qui affecte l’intérieur de notre Être ?",
    "Nous savons que nous pensons, et que nous avons des remords ; un sentiment intime ne nous force que trop d’en convenir ; mais pour juger des remords d’autrui, ce sentiment qui est dans nous est insuffisant ; c’est pourquoi il en faut croire les autres hommes sur leur parole, ou sur les signes sensibles et extérieurs que nous avons remarqués en nous-mêmes, lorsque nous éprouvions la même conscience et les mêmes tourments. Mais pour décider si les animaux, qui ne parlent point, ont reçu la Loi naturelle, il faut s’en rapporter conséquemment à ces signes dont je viens de parler, supposé qu’ils existent.",
    "Les faits semblent le prouver. Le chien qui a mordu son maître qui l’agaçait, a paru s’en repentir le moment suivant : on l’a vu triste, fâché, n’osant se montrer, et s’avouer coupable par un air rampant et humilié. L’Histoire nous offre un exemple célèbre d’un Lion qui ne voulut pas déchirer un Homme abandonné à sa fureur, parce qu’il le reconnut pour son bienfaiteur. Qu’il serait à souhaiter que l’homme même montrât toujours la même reconnaissance pour les bienfaits, et le même respect pour l’humanité ! On n’aurait plus à craindre les Ingrats, ni ces Guerres qui sont le fléau du genre Humain et les vrais bourreaux de la Loi naturelle."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le passage déplace la frontière morale : si nous attribuons une conscience aux autres humains à partir de signes, pourquoi refuser par principe toute vie morale aux animaux ? Il oblige à réfléchir aux critères que nous employons pour reconnaître un esprit.",
  "hlpQuestion": "Sur quels signes pouvons-nous attribuer une vie morale aux animaux ?",
  "problematisations": [
    "Comment reconnaître une conscience chez un être qui ne peut pas nous la déclarer ?",
    "Les animaux peuvent-ils être des sujets moraux plutôt que de simples objets de nos actions ?"
  ],
  "keywords": [
    "conscience",
    "morale animale",
    "remords",
    "analogie"
  ],
  "hlpOppositions": [
    {
      "left": "signe extérieur",
      "right": "conscience intérieure"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "buffon-cheval-domestication-servitude",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "Le cheval et son cavalier",
  "author": "Georges-Louis Leclerc de Buffon",
  "authorTag": "Buffon",
  "cardHighlight": "cheval et son cavalier",
  "authorMeta": "(1707–1788) · naturaliste des Lumières",
  "themes": [
    "Travail",
    "Nature",
    "Liberté"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "domestication",
      "liberté",
      "servitude",
      "animal"
    ]
  },
  "work": "Histoire naturelle, tome IV, Discours sur la nature des Animaux, « Le Cheval »",
  "publication": "1753",
  "description": "Buffon célèbre les qualités du cheval domestique tout en décrivant sa domestication comme une perte progressive de liberté.",
  "context": "Le texte commence par exalter la coopération du cheval avec l’homme, puis change de perspective : docilité, dressage et service apparaissent comme les effets d’une contrainte si ancienne qu’elle masque presque l’état naturel de l’animal.",
  "readingQuestions": [
    "Quelles qualités du cheval Buffon admire-t-il d’abord ?",
    "À quel moment le vocabulaire de l’éloge devient-il celui de la contrainte ?",
    "Pourquoi la domestication finit-elle par nous cacher l’état naturel de l’animal ?"
  ],
  "glossary": [
    {
      "term": "domestication",
      "definition": "Transformation durable d’animaux par l’élevage, la sélection, l’habituation et le dressage en vue de relations régulières avec les humains."
    },
    {
      "term": "servitude",
      "definition": "État de dépendance dans lequel la liberté d’un être est soumise à la volonté d’un autre."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Coopération",
        "definition": "Le cheval partage activités, dangers et plaisirs avec l’homme."
      },
      "right": {
        "term": "Servitude",
        "definition": "Son éducation commence par la perte de liberté et s’achève par la contrainte."
      },
      "conclusion": "Buffon oblige à voir que l’utilité et l’attachement peuvent coexister avec une domination très profonde."
    }
  ],
  "relatedTexts": [
    {
      "id": "voltaire-chapon-poularde-cruaute",
      "kind": "proche",
      "label": "Voltaire — Des monstres sans scrupules",
      "relation": "Buffon analyse la domestication ; Voltaire adopte directement le point de vue d’animaux élevés pour être consommés."
    }
  ],
  "paragraphs": [
    "La plus noble conquête que l’homme ait jamais faite est celle de ce fier et fougueux animal, qui partage avec lui les fatigues de la guerre et la gloire des combats : aussi intrépide que son maître, le cheval voit le péril et l’affronte ; il se fait au bruit des armes, il l’aime, il le cherche et s’anime de la même ardeur : il partage aussi ses plaisirs ; à la chasse, aux tournois, à la course, il brille, il étincelle. Mais, docile autant que courageux, il ne se laisse point emporter à son feu ; il sait réprimer ses mouvements : non seulement il fléchit sous la main de celui qui le guide, mais il semble consulter ses désirs, et, obéissant toujours aux impressions qu’il en reçoit, il se précipite, se modère ou s’arrête ; c’est une créature qui renonce à son être pour n’exister que par la volonté d’un autre, qui sait même la prévenir ; qui, par la promptitude et la précision de ses mouvements, l’exprime et l’exécute ; qui sent autant qu’on le désire, et ne rend qu’autant qu’on veut ; qui, se livrant sans réserve, ne se refuse à rien, sert de toutes ses forces, s’excède, et même meurt, pour mieux obéir.",
    "Voilà le cheval dont les talents sont développés, dont l’art a perfectionné les qualités naturelles, qui, dès le premier âge, a été soigné et ensuite exercé, dressé au service de l’homme : c’est par la perte des libertés que commence son éducation, et c’est par la contrainte qu’elle s’achève. L’esclavage ou la domesticité de ces animaux est même si universelle, si ancienne, que nous ne les voyons que rarement dans leur état naturel : ils sont toujours couverts de harnais dans leurs travaux ; on ne les délivre jamais de tous leurs liens, même dans les temps du repos ; et si on les laisse quelquefois errer en liberté dans les pâturages, ils y portent toujours les marques de la servitude, et souvent les empreintes cruelles du travail et de la douleur […]."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le passage est précieux parce qu’il contient sa propre contradiction : la « noble conquête » de l’homme est aussi une servitude. Il permet de penser ensemble domestication, travail, admiration et violence.",
  "hlpQuestion": "La domestication est-elle une coopération ou une domination ?",
  "problematisations": [
    "Domestiquer un animal, est-ce développer ses capacités ou réduire sa liberté ?",
    "Peut-on parler de coopération lorsqu’un rapport est profondément asymétrique ?"
  ],
  "keywords": [
    "domestication",
    "liberté",
    "servitude",
    "animal"
  ],
  "hlpOppositions": [
    {
      "left": "domestication",
      "right": "liberté"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "voltaire-chapon-poularde-cruaute",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "Des monstres sans scrupules",
  "author": "Voltaire",
  "authorTag": "Voltaire",
  "cardHighlight": "monstres sans scrupules",
  "authorMeta": "(1694–1778) · écrivain et philosophe des Lumières",
  "themes": [
    "Devoir",
    "Justice",
    "Nature"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "cruauté",
      "point de vue",
      "exploitation",
      "animal"
    ]
  },
  "work": "Mélanges, « Dialogue du Chapon et de la Poularde »",
  "publication": "1763",
  "description": "Voltaire fait raconter l’élevage et l’abattage depuis le point de vue des animaux et transforme des pratiques ordinaires en scène de violence étrange.",
  "context": "Le dialogue inverse le regard : ce que les humains appellent coutume apparaît, pour le chapon et la poularde, comme enfermement, mutilation et mise à mort. L’ironie rend visibles des pratiques que l’habitude avait rendues moralement transparentes.",
  "readingQuestions": [
    "Quel effet produit le fait de raconter les pratiques humaines du point de vue des animaux ?",
    "Pourquoi le chapon invoque-t-il la « coutume » ?",
    "Que signifie l’absence de remords attribuée aux humains ?"
  ],
  "glossary": [
    {
      "term": "chapon",
      "definition": "Coq castré et engraissé pour la consommation."
    },
    {
      "term": "coutume",
      "definition": "Pratique habituelle qui peut être tenue pour normale sans que sa justification morale soit réellement examinée."
    }
  ],
  "readingNotes": [
    {
      "type": "opposition",
      "left": {
        "term": "Normalité humaine",
        "definition": "L’élevage et l’abattage sont présentés comme des pratiques familières et codifiées."
      },
      "right": {
        "term": "Expérience animale",
        "definition": "Les mêmes actes deviennent enfermement, mutilation et mort lorsqu’ils sont racontés par ceux qui les subissent."
      },
      "conclusion": "Changer de point de vue permet de séparer l’habitude d’une véritable justification morale."
    }
  ],
  "relatedTexts": [
    {
      "id": "montaigne-devoir-humanite-animaux",
      "kind": "proche",
      "label": "Montaigne — Un devoir d’humanité",
      "relation": "Voltaire rend sensible la cruauté ; Montaigne formule positivement une obligation de bienveillance envers les autres créatures."
    }
  ],
  "paragraphs": [
    "Le Chapon — […] Ils vous ont fait poularde, et moi chapon. […] C’est pour nous engraisser, et pour nous rendre la chair plus délicate.<br>La Poularde — Eh bien ! Quand nous serons plus gras, le seront-ils davantage ?<br>Le Chapon — Oui, car ils prétendent nous manger.<br>La Poularde — Nous manger ! ah, les monstres !",
    "Le Chapon — C’est leur coutume ; ils nous mettent en prison pendant quelques jours, nous font avaler une pâtée dont ils ont le secret, nous crèvent les yeux pour que nous n’ayons point de distraction ; enfin, le jour de la fête étant venu, ils nous arrachent les plumes, nous coupent la gorge, et nous font rôtir. On nous apporte devant eux dans une large pièce d’argent ; chacun dit de nous ce qu’il pense ; on fait notre oraison funèbre : l’un dit que nous sentons la noisette ; l’autre vante notre chair succulente ; on loue nos cuisses, nos bras, notre croupion ; et voilà notre histoire dans ce bas monde finie pour jamais.",
    "La Poularde — Quels abominables coquins ! Je suis prête à m’évanouir. Quoi ! on m’arrachera les yeux ! on me coupera le cou ! je serai rôtie et mangée ! Ces scélérats n’ont donc point de remords ?<br>Le Chapon — Non, m’amie ; les deux abbés dont je vous ai parlé disaient que les hommes n’ont jamais de remords des choses qu’ils sont dans l’usage de faire."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Le texte est immédiatement accessible et philosophiquement efficace : il suffit de déplacer le point de vue pour que la normalité change de sens. Il permet de travailler la coutume, la souffrance et la responsabilité morale envers les animaux.",
  "hlpQuestion": "Que révèle le point de vue animal sur la violence humaine ?",
  "problematisations": [
    "Changer de point de vue peut-il rendre visible une violence devenue ordinaire ?",
    "Nos habitudes suffisent-elles à justifier l’usage que nous faisons des animaux ?"
  ],
  "keywords": [
    "cruauté",
    "point de vue",
    "exploitation",
    "animal"
  ],
  "hlpOppositions": [
    {
      "left": "habitude",
      "right": "cruauté"
    }
  ],
  "hlpTier": "essential"
},
{
  "id": "montaigne-devoir-humanite-animaux",
  "section": "autres",
  "cardMeta": "L’homme et l’animal",
  "title": "Un devoir d’humanité",
  "author": "Michel de Montaigne",
  "authorTag": "Montaigne",
  "cardHighlight": "devoir d’humanité",
  "authorMeta": "(1533–1592) · humanisme et scepticisme",
  "themes": [
    "Devoir",
    "Nature",
    "Justice"
  ],
  "hlp": {
    "level": "Première",
    "object": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "tags": [
      "devoir",
      "bienveillance",
      "sensibilité",
      "humanité"
    ]
  },
  "work": "Essais, « De la cruauté »",
  "publication": "1580, livre II, chap. 11, texte adapté, Gallimard, 2009",
  "description": "Montaigne refuse la royauté imaginaire de l’homme sur les autres créatures et étend la bienveillance au-delà de l’espèce humaine.",
  "context": "Même si l’on contestait toute ressemblance intellectuelle entre humains et animaux, Montaigne affirme qu’un devoir de bienveillance subsisterait. Il s’appuie sur la sensibilité, la familiarité et des exemples historiques de soin accordé aux bêtes.",
  "readingQuestions": [
    "Pourquoi Montaigne renonce-t-il à la « royauté imaginaire » de l’homme ?",
    "Quelle différence établit-il entre justice envers les hommes et bienveillance envers les autres créatures ?",
    "À quoi servent les exemples historiques de soins rendus aux animaux ?"
  ],
  "glossary": [
    {
      "term": "présomption",
      "definition": "Tendance à s’accorder une importance ou une supériorité excessive."
    },
    {
      "term": "bienveillance",
      "definition": "Disposition à vouloir et à rechercher le bien d’un autre être."
    }
  ],
  "readingNotes": [
    {
      "type": "concept",
      "term": "Du semblable au vulnérable",
      "definition": "Montaigne ne fonde pas l’obligation morale uniquement sur l’égalité des facultés : la vie, le sentiment et la possibilité de recevoir nos soins suffisent déjà à motiver une bienveillance."
    }
  ],
  "relatedTexts": [
    {
      "id": "voltaire-chapon-poularde-cruaute",
      "kind": "proche",
      "label": "Voltaire — Des monstres sans scrupules",
      "relation": "Voltaire met en scène la souffrance causée par la coutume ; Montaigne formule une exigence générale de bienveillance."
    },
    {
      "id": "lamettrie-animaux-morale-remords",
      "kind": "proche",
      "label": "La Mettrie — Les animaux et la morale",
      "relation": "La Mettrie interroge les capacités morales animales ; Montaigne demande surtout quelles obligations humaines en découlent."
    }
  ],
  "paragraphs": [
    "Mais quand je rencontre, parmi les opinions les plus modérées, les discours qui essaient à montrer l’étroite ressemblance de nous aux animaux, et combien ils partagent nos plus grands privilèges : et avec combien de vraisemblance on nous les associe : certes j’en rabats beaucoup de notre présomption : et me démets volontiers de cette royauté imaginaire, qu’on nous donne sur les autres créatures. Quand tous ces points communs feraient défaut, toutefois, y a-t-il un certain respect, qui nous attache, et un général devoir d’humanité, non aux bêtes seulement, qui ont vie et sentiment, mais aux arbres mêmes et aux plantes. Nous devons la justice aux hommes et la grâce et la bienveillance aux autres créatures, qui peuvent la recevoir. Il y a quelque commerce entre elles et nous, et quelque obligation mutuelle. Je ne crains point à dire la tendresse de ma nature, si puérile, que je ne puis pas bien refuser à mon chien la fête qu’il m’offre hors de saison : ou qu’il me demande.",
    "Les Turcs ont des aumônes et des hôpitaux pour les bêtes : les Romains avaient un service public de la nourriture des oies, par la vigilance desquelles leur Capitole avait été sauvé : les Athéniens ordonnèrent que les mules et mulets qui avaient servi au bâtiment du temple appelé Hecatompedon fussent libres : et qu’on les laissât paître partout sans empêchement. Les Agrigentins avaient en usage commun d’enterrer sérieusement les bêtes qui leur avaient été chères, comme les chevaux de quelque rare mérite, les chiens et les oiseaux utiles : ou même qui avaient servi de passe-temps à leurs enfants. Et la magnificence qui leur était ordinaire en toutes choses, paraissait aussi singulièrement à la somptuosité et nombre des monuments élevés à cette fin : qui ont duré en parade plusieurs siècles depuis."
  ],
  "sections": [
    "autres",
    "philosophie"
  ],
  "pedagogicalHook": "Ce texte fait passer le débat de la question « que peuvent les animaux ? » à la question « que leur devons-nous ? ». C’est une distinction essentielle : la valeur morale d’un être ne dépend peut-être pas de sa ressemblance complète avec nous.",
  "hlpQuestion": "La proximité entre humains et animaux fonde-t-elle des devoirs envers eux ?",
  "problematisations": [
    "Nos devoirs dépendent-ils de l’intelligence des êtres auxquels ils s’adressent ?",
    "La sensibilité suffit-elle à fonder une obligation morale envers les animaux ?"
  ],
  "keywords": [
    "devoir",
    "bienveillance",
    "sensibilité",
    "humanité"
  ],
  "hlpOppositions": [
    {
      "left": "domination",
      "right": "bienveillance"
    }
  ],
  "hlpTier": "essential"
}
];
  SELECTED_HLP_TEXTS_2026.forEach((entry) => {
    const index = TEXTS.findIndex((item) => item.id === entry.id);
    if (index >= 0) TEXTS.splice(index, 1, entry); else TEXTS.push(entry);
  });
  const sophocleHlpEntry = TEXTS.find((item) => item.id === "sophocle-antigone-lois-non-ecrites");
  if (sophocleHlpEntry) {
    sophocleHlpEntry.hlp = {
  "level": "Première",
  "object": "Les pouvoirs de la parole",
  "subtheme": "L’autorité de la parole",
  "tags": [
    "autorité",
    "désobéissance",
    "lois non écrites",
    "conscience"
  ]
};
    sophocleHlpEntry.sections = [...new Set([...(sophocleHlpEntry.sections || [sophocleHlpEntry.section]), "autres"])];
  }

  // BEGIN HLP 2026 — global editorial audit
  const HLP_CANONICAL_REMAP_2026 = {
  "eschyle-eumenides-instituer-tribunal": "eschyle-oreste-tribunal-justice",
  "pascal-justice-force": "pascal-force-justice",
  "ovide-narcisse-reflet": "ovide-narcisse-reflet-desir-identite"
};

  const mergeHlpDuplicate2026 = (duplicateId, canonicalId) => {
    const duplicate = TEXTS.find((item) => item.id === duplicateId);
    const canonical = TEXTS.find((item) => item.id === canonicalId);
    if (!duplicate || !canonical) return;
    if (duplicate.hlp) canonical.hlp = duplicate.hlp;
    const duplicateIndex = TEXTS.findIndex((item) => item.id === duplicateId);
    if (duplicateIndex >= 0) TEXTS.splice(duplicateIndex, 1);
  };
  Object.entries(HLP_CANONICAL_REMAP_2026).forEach(([duplicateId, canonicalId]) => mergeHlpDuplicate2026(duplicateId, canonicalId));

  const HLP_ENRICHMENTS_2026 = {
  "ciceron-verrines-sthenius": {
    "title": "Faire d’un cas particulier une accusation publique",
    "description": "Comment l’orateur transforme-t-il un fait particulier en cause publique ?",
    "pedagogicalHook": "Un excellent cas pour voir comment l’orateur transforme des faits dispersés en affaire publique et fait naître l’indignation de l’auditoire.",
    "context": "<strong>Situation.</strong> Dans la seconde action contre Verrès, Cicéron rassemble des faits destinés à établir les abus de l’ancien gouverneur de Sicile. L’épisode de Sthénius montre comment l’orateur choisit un cas concret, caractérise la victime et l’accusé, puis fait de ce récit une preuve adressée aux juges. <strong>Enjeu.</strong> Comment l’orateur transforme-t-il un fait particulier en cause publique ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez qui accuse, devant quel public, et à partir de quel cas concret l’accusation s’élargit."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : partir du cas de Sthénius, accumuler les faits, puis élargir l’affaire à la conduite générale de Verrès."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>faits</strong> et <strong>mise en récit</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Cicéron commence-t-il par présenter la personne de Sthénius avant de raconter les actes de Verrès ?",
      "Comment le récit transforme-t-il un conflit particulier en accusation contre l’exercice arbitraire du pouvoir ?",
      "En quoi cet extrait montre-t-il que l’éloquence judiciaire agit à la fois par les faits et par la manière de les mettre en scène ?"
    ],
    "hlpQuestion": "Comment l’orateur transforme-t-il un fait particulier en cause publique ?",
    "problematisations": [
      "L’éloquence révèle-t-elle une injustice ou la construit-elle comme telle pour un public ?",
      "Pour convaincre, faut-il seulement prouver ou aussi mettre les faits en scène ?"
    ],
    "keywords": [
      "éloquence judiciaire",
      "preuve",
      "indignation",
      "mise en récit"
    ],
    "hlpOppositions": [
      {
        "left": "faits",
        "right": "mise en récit"
      },
      {
        "left": "preuve",
        "right": "émotion"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’autorité de la parole",
        "reason": "L’accusation judiciaire tire aussi sa force de l’institution qui autorise certains locuteurs à juger et accuser."
      }
    ],
    "citationApa": "Cicéron. (1830). <cite>Verrines : Seconde action, livre II</cite> (C. du Rozoir, trad., XXXIV). Panckoucke.",
    "translator": "Charles du Rozoir",
    "relatedTexts": [
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — Une parole politique doit conduire à l’action",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "voltaire-calas-sirven-plaidoyer",
        "kind": "proche",
        "label": "Voltaire — Transformer une injustice en cause publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "tacite-annales-claude-integration",
        "kind": "proche",
        "label": "Tacite — L’histoire au service d’une décision politique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "éloquence judiciaire",
        "preuve",
        "indignation",
        "mise en récit"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "tacite-dialogue-orateurs-formation": {
    "title": "L’éloquence s’apprend au contact des orateurs",
    "description": "Comment apprend-on réellement à bien parler ?",
    "pedagogicalHook": "Le texte montre que l’éloquence ne s’acquiert pas seulement par des règles : elle se forme par l’écoute, l’imitation et l’expérience des débats réels.",
    "context": "<strong>Situation.</strong> Dans le <em>Dialogue sur les orateurs</em>, plusieurs interlocuteurs s’interrogent sur le déclin de l’éloquence. Messala oppose ici l’ancienne formation, reçue au Forum auprès d’orateurs expérimentés, à un enseignement scolaire plus artificiel. <strong>Enjeu.</strong> Comment apprend-on réellement à bien parler ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez ce que le maître ou l’école ne peuvent fournir seuls au futur orateur."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : opposer l’apprentissage abstrait à la fréquentation concrète des orateurs et des procès."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>règles</strong> et <strong>pratique</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Tacite compare-t-il l’apprentissage de l’éloquence à un apprentissage de la guerre sur le champ de bataille ?",
      "Quels rôles jouent l’observation, l’imitation et le jugement du public dans la formation de l’orateur ?",
      "Quelle conception du savoir ce texte oppose-t-il à un enseignement purement théorique ?"
    ],
    "hlpQuestion": "Comment apprend-on réellement à bien parler ?",
    "problematisations": [
      "Peut-on apprendre l’art de la parole sans participer à des situations réelles de parole ?",
      "L’imitation des grands orateurs forme-t-elle l’autonomie ou la dépendance ?"
    ],
    "keywords": [
      "formation",
      "imitation",
      "pratique",
      "éloquence"
    ],
    "hlpOppositions": [
      {
        "left": "règles",
        "right": "pratique"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Tacite. (1863). <cite>Dialogue des orateurs</cite> (J.-L. Burnouf, trad., chap. XXXIV). Hachette.",
    "translator": "Jean-Louis Burnouf",
    "relatedTexts": [
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — Faire d’un cas particulier une accusation publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — Une parole politique doit conduire à l’action",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "epictete-manuel-46-vivre-principes",
        "kind": "proche",
        "label": "Épictète — Transmettre par l’exemple plutôt que par le discours",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "formation",
        "imitation",
        "pratique",
        "éloquence"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "demosthene-premiere-philippique-agir": {
    "title": "Une parole politique doit conduire à l’action",
    "description": "À quelles conditions une parole politique peut-elle faire agir ?",
    "pedagogicalHook": "On voit ici ce qui distingue une parole politique efficace d’un simple commentaire : elle doit modifier la disposition de l’auditoire et conduire à agir.",
    "context": "<strong>Situation.</strong> Philippe II de Macédoine étend son influence tandis qu’Athènes tarde à réagir. Dans cette harangue, Démosthène retourne le regard de l’assemblée vers sa propre inaction : l’adversaire n’est puissant que parce que les citoyens renoncent à agir. <strong>Enjeu.</strong> À quelles conditions une parole politique peut-elle faire agir ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les marques d’interpellation et le comportement que Démosthène reproche aux Athéniens."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : diagnostiquer l’inaction, interpeller les citoyens, puis convertir le reproche en programme d’action."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>discours</strong> et <strong>action</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment Démosthène transforme-t-il l’exemple de Philippe en reproche adressé aux Athéniens eux-mêmes ?",
      "Quel effet produisent les questions successives du passage sur l’auditeur ?",
      "Pourquoi une parole délibérative doit-elle aller au-delà de la conviction pour conduire à une décision ?"
    ],
    "hlpQuestion": "À quelles conditions une parole politique peut-elle faire agir ?",
    "problematisations": [
      "Une parole politique vaut-elle par la vérité de son diagnostic ou par l’action qu’elle provoque ?",
      "L’orateur doit-il convaincre ou secouer son auditoire ?"
    ],
    "keywords": [
      "délibération",
      "exhortation",
      "action",
      "citoyenneté"
    ],
    "hlpOppositions": [
      {
        "left": "discours",
        "right": "action"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’autorité de la parole",
        "reason": "L’orateur politique parle dans un cadre civique où sa parole vise une décision collective."
      }
    ],
    "citationApa": "Démosthène. (1819). <cite>Première Philippique</cite> (J. Planche, trad.). Verdière.",
    "translator": "Joseph Planche",
    "relatedTexts": [
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — Faire d’un cas particulier une accusation publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Réveiller la liberté par la parole publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "thucydide-pericles-oraison-funebre",
        "kind": "proche",
        "label": "Thucydide — Périclès : donner un sens civique aux morts",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "délibération",
        "exhortation",
        "action",
        "citoyenneté"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "tacite-annales-claude-integration": {
    "title": "L’histoire au service d’une décision politique",
    "description": "Comment un récit du passé peut-il légitimer une décision présente ?",
    "pedagogicalHook": "L’empereur mobilise l’histoire comme argument : raconter le passé devient une manière de rendre une décision présente acceptable.",
    "context": "<strong>Situation.</strong> Des sénateurs s’opposent à l’admission de notables de Gaule chevelue. Tacite rapporte la réponse de Claude : le discours redéfinit la nouveauté en montrant que Rome s’est toujours agrandie par l’intégration. <strong>Enjeu.</strong> Comment un récit du passé peut-il légitimer une décision présente ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les exemples historiques choisis par Claude et la décision qu’ils doivent rendre acceptable."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : enchaîner des précédents historiques pour rendre l’innovation présente conforme à l’identité romaine."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>tradition</strong> et <strong>innovation</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Claude commence-t-il par l’histoire de sa propre famille et celle des grandes familles romaines ?",
      "Comment le passé de Rome devient-il un argument en faveur d’une réforme présente ?",
      "Quel pouvoir possède ici le récit historique dans une délibération politique ?"
    ],
    "hlpQuestion": "Comment un récit du passé peut-il légitimer une décision présente ?",
    "problematisations": [
      "Le passé éclaire-t-il une décision ou sert-il surtout à la légitimer ?",
      "Une communauté peut-elle changer tout en se présentant comme fidèle à son histoire ?"
    ],
    "keywords": [
      "histoire",
      "légitimation",
      "délibération",
      "citoyenneté"
    ],
    "hlpOppositions": [
      {
        "left": "tradition",
        "right": "innovation"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Tacite. (1863). <cite>Annales</cite> (J.-L. Burnouf, trad., livre XI, 24). Hachette.",
    "translator": "Jean-Louis Burnouf",
    "relatedTexts": [
      {
        "id": "thucydide-pericles-oraison-funebre",
        "kind": "proche",
        "label": "Thucydide — Périclès : donner un sens civique aux morts",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — Faire d’un cas particulier une accusation publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "voltaire-calas-sirven-plaidoyer",
        "kind": "proche",
        "label": "Voltaire — Transformer une injustice en cause publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "histoire",
        "légitimation",
        "délibération",
        "citoyenneté"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "salluste-memmius-liberte": {
    "title": "Réveiller la liberté par la parole publique",
    "description": "Comment une parole publique peut-elle réveiller le désir de liberté ?",
    "pedagogicalHook": "Une harangue permet d’observer comment un orateur nomme une domination, réveille une mémoire commune et cherche à transformer des auditeurs en citoyens actifs.",
    "context": "<strong>Situation.</strong> Après un accord jugé scandaleux avec Jugurtha, le tribun C. Memmius cherche à réveiller le peuple romain. Salluste souligne lui-même le renom et l’influence de son éloquence avant de rapporter cette harangue. <strong>Enjeu.</strong> Comment une parole publique peut-elle réveiller le désir de liberté ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez à qui Memmius s’adresse, ce qu’il dénonce et le sentiment qu’il cherche à réveiller."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : nommer la domination, rappeler ce que les citoyens ont perdu, puis les sommer de ne plus consentir."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>obéissance</strong> et <strong>liberté</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment Memmius justifie-t-il le fait de prendre la parole alors que tout pourrait l’inciter au silence ?",
      "Pourquoi associe-t-il directement liberté politique et capacité des citoyens à réagir ?",
      "Comment l’orateur cherche-t-il à mobiliser le peuple sans l’appeler à la violence ?"
    ],
    "hlpQuestion": "Comment une parole publique peut-elle réveiller le désir de liberté ?",
    "problematisations": [
      "Peut-on rendre un peuple libre par la parole ?",
      "La dénonciation d’une domination suffit-elle à rompre l’habitude d’obéir ?"
    ],
    "keywords": [
      "harangue",
      "liberté",
      "domination",
      "mobilisation"
    ],
    "hlpOppositions": [
      {
        "left": "obéissance",
        "right": "liberté"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Salluste. (1865). <cite>La Guerre de Jugurtha</cite> (C. du Rozoir, trad., chap. XXXI). Garnier Frères.",
    "translator": "Charles du Rozoir",
    "relatedTexts": [
      {
        "id": "demosthene-premiere-philippique-agir",
        "kind": "proche",
        "label": "Démosthène — Une parole politique doit conduire à l’action",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — « Ne servir plus » : retirer son obéissance au pouvoir",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "thucydide-pericles-oraison-funebre",
        "kind": "proche",
        "label": "Thucydide — Périclès : donner un sens civique aux morts",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "harangue",
        "liberté",
        "domination",
        "mobilisation"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "voltaire-calas-sirven-plaidoyer": {
    "title": "Transformer une injustice en cause publique",
    "description": "Comment l’écriture peut-elle transformer une injustice en cause collective ?",
    "pedagogicalHook": "Voltaire montre comment une affaire particulière peut devenir une cause générale lorsque l’écriture rend visible l’injustice et mobilise l’opinion.",
    "context": "<strong>Situation.</strong> Après s’être engagé dans l’affaire Calas, Voltaire intervient également en faveur de la famille Sirven, protestante elle aussi. Il transforme le récit d’une procédure en critique publique du fanatisme et des raisonnements judiciaires fondés sur le préjugé. <strong>Enjeu.</strong> Comment l’écriture peut-elle transformer une injustice en cause collective ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez comment Voltaire passe des faits d’une affaire à un jugement plus général sur le fanatisme."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : exposer les contradictions d’une affaire particulière, élargir à un mécanisme de fanatisme, puis solliciter le jugement public."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>injustice privée</strong> et <strong>cause publique</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Voltaire rapproche-t-il immédiatement les affaires Calas et Sirven ?",
      "Comment l’ironie fait-elle apparaître l’absurdité du raisonnement du juge ?",
      "En quoi publier ce récit revient-il à déplacer une affaire locale devant le tribunal de l’opinion publique ?"
    ],
    "hlpQuestion": "Comment l’écriture peut-elle transformer une injustice en cause collective ?",
    "problematisations": [
      "L’opinion publique peut-elle devenir une puissance de justice ?",
      "Un écrivain doit-il émouvoir pour rendre une injustice visible ?"
    ],
    "keywords": [
      "opinion publique",
      "plaidoyer",
      "fanatisme",
      "justice"
    ],
    "hlpOppositions": [
      {
        "left": "injustice privée",
        "right": "cause publique"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’autorité de la parole",
        "reason": "L’écrivain conteste l’autorité judiciaire en cherchant à produire une autre autorité : celle du jugement public."
      }
    ],
    "citationApa": "Voltaire. (1879). <cite>Avis au public sur les parricides imputés aux Calas et aux Sirven</cite> (œuvre orig. publiée en 1766). Garnier.",
    "translator": "",
    "relatedTexts": [
      {
        "id": "ciceron-verrines-sthenius",
        "kind": "proche",
        "label": "Cicéron — Faire d’un cas particulier une accusation publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — « Ne servir plus » : retirer son obéissance au pouvoir",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "sophocle-antigone-lois-non-ecrites",
        "kind": "proche",
        "label": "Sophocle — Antigone : au nom de quelle loi désobéir ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’art de la parole",
      "tags": [
        "opinion publique",
        "plaidoyer",
        "fanatisme",
        "justice"
      ]
    },
    "cardMeta": "L’art de la parole",
    "sections": [
      "philosophie",
      "autres"
    ]
  },
  "hippocrate-serment": {
    "title": "Le serment : quand dire, c’est s’obliger",
    "description": "Comment une parole peut-elle obliger celui qui la prononce ?",
    "pedagogicalHook": "Le serment est un modèle simple de parole performative : prononcer certaines paroles ne décrit pas un devoir, mais engage celui qui parle.",
    "context": "<strong>Situation.</strong> Le texte prend la forme d’un engagement solennel placé sous le regard des dieux. Dire « je jure » revient ici à assumer publiquement une règle de conduite future : le pouvoir de la parole tient à l’obligation que le locuteur reconnaît lui-même. <strong>Enjeu.</strong> Comment une parole peut-elle obliger celui qui la prononce ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les formules par lesquelles le locuteur promet, interdit et accepte les conséquences de son engagement."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : invoquer des témoins, énoncer les obligations, puis attacher l’honneur ou le déshonneur au respect de la parole donnée."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>dire</strong> et <strong>s’engager</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi le serment commence-t-il par l’invocation de témoins divins ?",
      "Qu’est-ce qui distingue une promesse ou un serment d’une simple affirmation ?",
      "Comment ce texte relie-t-il savoir médical, devoir moral et responsabilité du praticien ?"
    ],
    "hlpQuestion": "Comment une parole peut-elle obliger celui qui la prononce ?",
    "problematisations": [
      "Une promesse tire-t-elle sa force de celui qui la prononce ou de l’institution qui la reçoit ?",
      "Sommes-nous liés par nos paroles lorsque personne ne peut matériellement nous contraindre ?"
    ],
    "keywords": [
      "serment",
      "engagement",
      "performativité",
      "devoir"
    ],
    "hlpOppositions": [
      {
        "left": "dire",
        "right": "s’engager"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Hippocrate. (1839). <cite>Le Serment</cite> (É. Littré, trad.). J.-B. Baillière.",
    "translator": "Émile Littré",
    "relatedTexts": [
      {
        "id": "eschyle-oreste-tribunal-justice",
        "kind": "proche",
        "label": "Eschyle — Fonder la justice par la parole",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "proche",
        "label": "Corneille — « Soyons amis, Cinna » : le pardon du souverain agit",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "epictete-manuel-46-vivre-principes",
        "kind": "proche",
        "label": "Épictète — Transmettre par l’exemple plutôt que par le discours",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "serment",
        "engagement",
        "performativité",
        "devoir"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "eschyle-oreste-tribunal-justice": {
    "title": "Fonder la justice par la parole",
    "description": "Comment une parole peut-elle fonder une institution ?",
    "pedagogicalHook": "La scène permet de comprendre très concrètement comment une parole peut instituer une règle, créer un tribunal et substituer le jugement à la vengeance.",
    "context": "<strong>Situation.</strong> Dans <em>Les Euménides</em>, le cycle de la vengeance familiale doit trouver une autre issue. Athéna confie l’affaire d’Oreste à des juges et formule les principes d’un tribunal destiné à durer : le langage devient ici institution. <strong>Enjeu.</strong> Comment une parole peut-elle fonder une institution ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les verbes par lesquels Athéna établit une règle destinée à durer au-delà du procès d’Oreste."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : annoncer une règle, lui donner une durée, définir ses principes, puis ordonner aux juges de rendre leur décision."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>vengeance</strong> et <strong>justice instituée</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Quels éléments montrent qu’Athéna ne donne pas seulement un conseil, mais fonde une institution ?",
      "Pourquoi le tribunal doit-il éviter à la fois l’anarchie et la tyrannie ?",
      "En quoi cet extrait permet-il de comprendre l’idée selon laquelle certaines paroles produisent une réalité nouvelle ?"
    ],
    "hlpQuestion": "Comment une parole peut-elle fonder une institution ?",
    "problematisations": [
      "Une institution existe-t-elle d’abord parce qu’une autorité l’énonce ou parce qu’une communauté l’accepte ?",
      "La justice publique met-elle fin à la vengeance ou la transforme-t-elle ?"
    ],
    "keywords": [
      "institution",
      "justice",
      "performativité",
      "loi"
    ],
    "hlpOppositions": [
      {
        "left": "vengeance",
        "right": "justice instituée"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Eschyle. (1872). <cite>Les Euménides</cite> (Leconte de Lisle, trad.). Alphonse Lemerre.",
    "translator": "Leconte de Lisle",
    "relatedTexts": [
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Le serment : quand dire, c’est s’obliger",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "sophocle-antigone-lois-non-ecrites",
        "kind": "proche",
        "label": "Sophocle — Antigone : au nom de quelle loi désobéir ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "pascal-force-justice",
        "kind": "proche",
        "label": "Pascal — Justice et force : légitimer ou imposer ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "institution",
        "justice",
        "performativité",
        "loi"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "mythologie",
      "philosophie",
      "autres"
    ],
    "work": "Les Euménides",
    "publication": "458 av. J.-C., trad. Leconte de Lisle, A. Lemerre, 1872",
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_Eum%C3%A9nides_%28Eschyle%2C_Leconte_de_Lisle%29",
    "paragraphs": [
      "Écoutez encore la loi que je fonde, peuple de l’Attique, vous qui êtes les premiers juges du sang versé. Ce tribunal, désormais et pour toujours, jugera le peuple Aigéen. Sur cette colline d’Arès, les Amazones plantèrent autrefois leurs tentes, quand, irritées contre Thèseus, elles assiégèrent la Ville récemment fondée et opposèrent des tours à ses hautes tours. Ici, elles firent des sacrifices à Arès, d’où ce nom d’Arèopagos, le rocher, la colline d’Arès.",
      "Donc, ici, le respect et la crainte seront toujours présents, le jour et la nuit, à tous les citoyens, tant qu’ils se garderont eux-mêmes d’instituer de nouvelles lois. Si vous souillez une eau limpide par des courants boueux, comment pourrez-vous la boire ? Je voudrais persuader aux citoyens chargés du soin de la République d’éviter l’anarchie et la tyrannie, mais non de renoncer à toute répression.",
      "Quel homme restera juste, s’il ne craint rien ? Respectez donc la majesté de ce tribunal, rempart sauveur de ce pays et de cette ville, tel qu’on n’en possède point parmi les hommes, ni les Skythes, ni ceux de la terre de Pélops. J’institue ce tribunal incorruptible, vénérable et sévère, gardien vigilant de cette terre, même pendant le sommeil de tous, et je le dis aux citoyens pour que cela soit désormais dans l’avenir. Maintenant, levez-vous, et, fidèles à votre serment, prononcez l’arrêt. J’ai dit."
    ],
    "authorMeta": "(v. 525–456 av. J.-C.) · tragédie grecque",
    "author": "Eschyle",
    "authorTag": "Eschyle",
    "themes": [
      "Justice",
      "État"
    ],
    "section": "autres"
  },
  "sophocle-antigone-lois-non-ecrites": {
    "title": "Antigone : au nom de quelle loi désobéir ?",
    "description": "Toute parole de l’autorité politique mérite-t-elle obéissance ?",
    "pedagogicalHook": "Antigone donne un cas-limite de l’autorité : une parole politique peut-elle obliger lorsqu’elle entre en conflit avec une norme tenue pour supérieure ?",
    "context": "<strong>Situation.</strong> Dans <em>Antigone</em>, l’ordre de Créon entre en conflit avec des <strong>lois non écrites</strong> qu’Antigone juge plus anciennes et plus légitimes que tout décret humain. Le texte pose directement la question des limites de l’obéissance à l’État. <strong>Enjeu.</strong> Toute parole de l’autorité politique mérite-t-elle obéissance ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les deux types de lois qu’Antigone oppose et l’autorité qu’elle reconnaît à chacune."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : reconnaître la désobéissance, opposer deux sources de normativité, puis justifier le choix d’Antigone."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>loi positive</strong> et <strong>loi supérieure</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Antigone refuse-t-elle d’obéir au décret de Créon ?",
      "Qu’est-ce qui donne, selon elle, une autorité supérieure aux lois non écrites ?",
      "Une exigence de <strong>justice</strong> peut-elle rendre légitime la désobéissance à la loi politique ?"
    ],
    "hlpQuestion": "Toute parole de l’autorité politique mérite-t-elle obéissance ?",
    "problematisations": [
      "Existe-t-il des normes supérieures aux lois politiques ?",
      "La conscience individuelle peut-elle légitimement limiter l’autorité de l’État ?"
    ],
    "keywords": [
      "désobéissance",
      "loi",
      "conscience",
      "légitimité"
    ],
    "hlpOppositions": [
      {
        "left": "loi positive",
        "right": "loi supérieure"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Sophocle. (1877). <cite>Antigonè</cite> (Leconte de Lisle, trad., scène d’Antigone et Kréôn). Alphonse Lemerre.",
    "translator": "Leconte de Lisle",
    "relatedTexts": [
      {
        "id": "eschyle-oreste-tribunal-justice",
        "kind": "proche",
        "label": "Eschyle — Fonder la justice par la parole",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "pascal-force-justice",
        "kind": "proche",
        "label": "Pascal — Justice et force : légitimer ou imposer ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — « Ne servir plus » : retirer son obéissance au pouvoir",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "désobéissance",
        "loi",
        "conscience",
        "légitimité"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "philosophie",
      "mythologie",
      "autres"
    ],
    "publication": "v. 442 av. J.-C., trad. Leconte de Lisle, Alphonse Lemerre, 1877",
    "sourceUrl": "https://fr.wikisource.org/wiki/Antigon%C3%A8",
    "paragraphs": [
      "KRÉÔN. — Connaissais-tu l’édit qui défendait ceci ?",
      "ANTIGONÈ. — Je le connaissais. Comment l’aurais-je ignoré ? Il est connu de tous.",
      "KRÉÔN. — Et ainsi, tu as osé violer ces lois ?",
      "ANTIGONÈ. — C’est que Zeus ne les a point faites, ni la Justice qui siège auprès des Dieux souterrains. Et je n’ai pas cru que tes édits pussent l’emporter sur les lois non écrites et immuables des Dieux, puisque tu n’es qu’un mortel. Ce n’est point d’aujourd’hui, ni d’hier, qu’elles sont immuables ; mais elles sont éternellement puissantes, et nul ne sait depuis combien de temps elles sont nées."
    ]
  },
  "chanson-roland-droit-parole": {
    "title": "Qui a le droit de parler au conseil ?",
    "description": "Qu’est-ce qui donne à quelqu’un le droit de prendre la parole ?",
    "pedagogicalHook": "Le conseil de Charlemagne montre que parler n’est jamais seulement produire des mots : la place sociale détermine qui peut parler, quand et avec quel poids.",
    "context": "<strong>Situation.</strong> Charlemagne doit choisir un messager à envoyer auprès du roi Marsile. Les barons proposent successivement leur service, mais le roi accepte, refuse ou interrompt les prises de parole : la délibération révèle ainsi la hiérarchie du conseil. <strong>Enjeu.</strong> Qu’est-ce qui donne à quelqu’un le droit de prendre la parole ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez qui propose de parler ou d’agir, et comment Charlemagne accepte, refuse ou interrompt."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : observer qui propose, qui interrompt, qui autorise et comment la hiérarchie règle la délibération."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>prendre la parole</strong> et <strong>avoir autorité</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Quels gestes et objets accompagnent la prise de parole dans ce conseil ?",
      "Comment Charlemagne manifeste-t-il son autorité en distribuant ou en retirant le droit de parler ?",
      "Que nous apprend cette scène sur la différence entre prendre la parole et avoir autorité pour parler ?"
    ],
    "hlpQuestion": "Qu’est-ce qui donne à quelqu’un le droit de prendre la parole ?",
    "problematisations": [
      "Le droit de parler doit-il dépendre du rang ?",
      "Une délibération est-elle libre lorsque l’autorité distribue elle-même les prises de parole ?"
    ],
    "keywords": [
      "droit de parole",
      "hiérarchie",
      "conseil",
      "légitimité"
    ],
    "hlpOppositions": [
      {
        "left": "prendre la parole",
        "right": "avoir autorité"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Anonyme. (1872). <cite>La Chanson de Roland</cite> (L. Gautier, éd. et trad., laisses XVII–XIX). Alfred Mame et Fils.",
    "translator": "Léon Gautier",
    "relatedTexts": [
      {
        "id": "tacite-dialogue-orateurs-formation",
        "kind": "proche",
        "label": "Tacite — L’éloquence s’apprend au contact des orateurs",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-plaideurs-aristote-autorite",
        "kind": "proche",
        "label": "Racine — Citer une autorité ne suffit pas à prouver",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "hugo-ruy-blas-valet-commandement",
        "kind": "proche",
        "label": "Victor Hugo — « Vous êtes mon valet » : la parole rétablit la hiérarchie",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "droit de parole",
        "hiérarchie",
        "conseil",
        "légitimité"
      ]
    },
    "cardMeta": "L’autorité de la parole"
  },
  "thucydide-pericles-oraison-funebre": {
    "title": "Périclès : donner un sens civique aux morts",
    "description": "Comment la parole publique construit-elle une mémoire commune ?",
    "pedagogicalHook": "L’oraison funèbre révèle que la parole publique ne se contente pas de commémorer : elle construit une mémoire commune et propose un modèle civique.",
    "context": "<strong>Situation.</strong> Au début de la guerre du Péloponnèse, Athènes organise les funérailles publiques des premiers soldats morts. Thucydide rapporte le discours attribué à Périclès : l’orateur ne se contente pas de consoler les proches, il rattache les morts à la grandeur de la cité et propose leur conduite comme modèle aux survivants. <strong>Enjeu.</strong> Comment la parole publique construit-elle une mémoire commune ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez comment Périclès relie les morts, la cité et la conduite attendue des survivants."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : passer de l’éloge des morts à la définition de la cité, puis transformer la mémoire en exhortation pour les vivants."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>mort individuelle</strong> et <strong>mémoire civique</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment Périclès passe-t-il de l’éloge des morts à une exhortation adressée aux vivants ?",
      "Pourquoi la gloire des citoyens morts dépasse-t-elle, selon lui, le tombeau matériel ?",
      "En quoi une parole publique peut-elle construire une mémoire et une identité communes ?"
    ],
    "hlpQuestion": "Comment la parole publique construit-elle une mémoire commune ?",
    "problematisations": [
      "La mémoire collective est-elle découverte ou fabriquée par les discours publics ?",
      "L’éloge des morts peut-il devenir un instrument politique pour gouverner les vivants ?"
    ],
    "keywords": [
      "éloge",
      "mémoire collective",
      "cité",
      "exemplarité"
    ],
    "hlpOppositions": [
      {
        "left": "mort individuelle",
        "right": "mémoire civique"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’art de la parole",
        "reason": "L’oraison funèbre est aussi un modèle d’éloquence civique construite pour émouvoir, louer et exhorter."
      }
    ],
    "citationApa": "Thucydide. (1835). <cite>Guerre du Péloponnèse</cite> (J.-B. Gail, trad., livre II, 43). Liskenne et Sauvan.",
    "translator": "Jean-Baptiste Gail",
    "relatedTexts": [
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Réveiller la liberté par la parole publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "proche",
        "label": "Corneille — « Soyons amis, Cinna » : le pardon du souverain agit",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "hugo-ruy-blas-valet-commandement",
        "kind": "proche",
        "label": "Victor Hugo — « Vous êtes mon valet » : la parole rétablit la hiérarchie",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "éloge",
        "mémoire collective",
        "cité",
        "exemplarité"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "corneille-cinna-clemence-auguste": {
    "title": "« Soyons amis, Cinna » : le pardon du souverain agit",
    "description": "Que peut réellement accomplir la parole d’un souverain ?",
    "pedagogicalHook": "La formule d’Auguste permet d’étudier une parole souveraine qui change immédiatement le statut de l’autre en pardonnant.",
    "context": "<strong>Situation.</strong> Cinna a participé à un complot contre Auguste. Au dernier acte, après les aveux successifs, l’empereur renonce à la vengeance. Le célèbre « Soyons amis, Cinna » manifeste une autorité capable de produire un nouvel ordre par la parole même qui le prononce. <strong>Enjeu.</strong> Que peut réellement accomplir la parole d’un souverain ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez le moment précis où Auguste cesse de décrire la situation et change la relation par sa parole."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : mettre en scène la maîtrise de soi d’Auguste, prononcer le pardon, puis redistribuer les relations politiques."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>vengeance</strong> et <strong>clémence</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Auguste présente-t-il la maîtrise de lui-même comme une victoire ?",
      "Que produit concrètement la formule « Soyons amis, Cinna » ?",
      "La clémence diminue-t-elle le pouvoir d’Auguste ou le renforce-t-elle ?"
    ],
    "hlpQuestion": "Que peut réellement accomplir la parole d’un souverain ?",
    "problematisations": [
      "Le pardon est-il un renoncement au pouvoir ou une manifestation supérieure de celui-ci ?",
      "La parole souveraine peut-elle réellement effacer une faute politique ?"
    ],
    "keywords": [
      "clémence",
      "souveraineté",
      "pardon",
      "performativité"
    ],
    "hlpOppositions": [
      {
        "left": "vengeance",
        "right": "clémence"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Corneille, P. (1641). <cite>Cinna ou la Clémence d’Auguste</cite> (acte V, scène 3).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Le serment : quand dire, c’est s’obliger",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "hugo-ruy-blas-valet-commandement",
        "kind": "proche",
        "label": "Victor Hugo — « Vous êtes mon valet » : la parole rétablit la hiérarchie",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "seneque-colere-juge-medecin",
        "kind": "proche",
        "label": "Sénèque — Punir sans colère : la raison contre la vengeance",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "clémence",
        "souveraineté",
        "pardon",
        "performativité"
      ]
    },
    "cardMeta": "L’autorité de la parole"
  },
  "la-boetie-servitude-volontaire-ne-plus-servir": {
    "title": "« Ne servir plus » : retirer son obéissance au pouvoir",
    "description": "L’autorité peut-elle subsister si l’on cesse de lui obéir ?",
    "pedagogicalHook": "La Boétie déplace la question du pouvoir : l’autorité du maître dépend aussi de ce que les dominés continuent de lui donner.",
    "context": "<strong>Situation.</strong> Le Discours cherche à comprendre une énigme politique : comment un seul homme peut-il dominer une multitude ? La Boétie répond que la domination n’est pas seulement imposée de l’extérieur ; elle se nourrit d’une coopération, d’habitudes et de relais. L’appel à « ne servir plus » vise donc le point d’appui du pouvoir. <strong>Enjeu.</strong> L’autorité peut-elle subsister si l’on cesse de lui obéir ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez à qui La Boétie attribue finalement les moyens concrets dont dispose le tyran."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : renverser la perspective du tyran vers les dominés, montrer les soutiens du pouvoir, puis formuler le retrait d’obéissance."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>contrainte</strong> et <strong>consentement</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi La Boétie multiplie-t-il les questions adressées directement aux dominés ?",
      "Comment le texte montre-t-il que la puissance du maître est fabriquée par ceux qu’il domine ?",
      "Que signifie exactement « ne le soutenez plus » : désobéir, résister, se retirer ?"
    ],
    "hlpQuestion": "L’autorité peut-elle subsister si l’on cesse de lui obéir ?",
    "problematisations": [
      "Tout pouvoir repose-t-il finalement sur une forme de consentement ?",
      "Se retirer de l’obéissance suffit-il pour devenir libre ?"
    ],
    "keywords": [
      "obéissance",
      "domination",
      "consentement",
      "liberté"
    ],
    "hlpOppositions": [
      {
        "left": "contrainte",
        "right": "consentement"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "La Boétie, É. de. (1922). <cite>Discours de la servitude volontaire</cite> (texte rédigé au XVIe siècle).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "pascal-force-justice",
        "kind": "proche",
        "label": "Pascal — Justice et force : légitimer ou imposer ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "salluste-memmius-liberte",
        "kind": "proche",
        "label": "Salluste — Réveiller la liberté par la parole publique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "sophocle-antigone-lois-non-ecrites",
        "kind": "proche",
        "label": "Sophocle — Antigone : au nom de quelle loi désobéir ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "obéissance",
        "domination",
        "consentement",
        "liberté"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "philosophie",
      "autres"
    ]
  },
  "pascal-force-justice": {
    "title": "Justice et force : légitimer ou imposer ?",
    "description": "La force suffit-elle à rendre un pouvoir légitime ?",
    "pedagogicalHook": "Quelques lignes suffisent à poser une difficulté majeure : le pouvoir a besoin de force, mais la force ne devient pas juste simplement parce qu’elle s’impose.",
    "context": "<strong>Situation.</strong> Dans les Pensées, Pascal examine les fondements instables des institutions humaines. Le fragment « Justice, force » condense un problème central : la justice a besoin de puissance pour être suivie, mais la puissance peut se donner l’apparence de la justice. <strong>Enjeu.</strong> La force suffit-elle à rendre un pouvoir légitime ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les propriétés différentes que Pascal attribue à la justice et à la force."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : distinguer justice et force, montrer leur insuffisance séparée, puis expliquer leur dangereuse combinaison."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>justice</strong> et <strong>force</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi la justice sans force est-elle impuissante, tandis que la force sans justice est tyrannique ?",
      "Que signifie l’idée que la force est « très reconnaissable et sans dispute » ?",
      "Comment comprendre la conclusion : « on a fait que ce qui est fort fût juste » ?"
    ],
    "hlpQuestion": "La force suffit-elle à rendre un pouvoir légitime ?",
    "problematisations": [
      "Un ordre politique peut-il être stable sans confondre parfois force et justice ?",
      "Comment distinguer l’autorité légitime de la puissance qui réussit à se faire reconnaître comme juste ?"
    ],
    "keywords": [
      "justice",
      "force",
      "légitimité",
      "pouvoir"
    ],
    "hlpOppositions": [
      {
        "left": "justice",
        "right": "force"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Pascal, B. (1871). <cite>Pensées : « Justice, force »</cite>. Hachette.",
    "translator": "",
    "relatedTexts": [
      {
        "id": "la-fontaine-loup-agneau-force-raison",
        "kind": "proche",
        "label": "La Fontaine — Quand la raison cède devant la force",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — « Ne servir plus » : retirer son obéissance au pouvoir",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "seneque-colere-juge-medecin",
        "kind": "proche",
        "label": "Sénèque — Punir sans colère : la raison contre la vengeance",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "justice",
        "force",
        "légitimité",
        "pouvoir"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "philosophie"
    ],
    "work": "Pensées — fragment « Justice, force »",
    "publication": "texte posthume, éd. Hachette 1871, fragment « Justice, force »",
    "sourceUrl": "https://fr.wikisource.org/wiki/%C5%92uvres_compl%C3%A8tes_de_Blaise_Pascal_Hachette_1871,_vol1/Pens%C3%A9es/Article_06",
    "paragraphs": [
      "Justice, force. — Il est juste que ce qui est juste soit suivi : il est nécessaire que ce qui est le plus fort soit suivi.",
      "La justice sans la force est impuissante : la force sans la justice est tyrannique. La justice sans force est contredite, parce qu’il y a toujours des méchants : la force sans la justice est accusée.",
      "Il faut donc mettre ensemble la justice et la force ; et pour cela faire que ce qui est juste soit fort, et que ce qui est fort soit juste.",
      "La justice est sujette à disputes : la force est très-reconnaissable et sans dispute. Ainsi on n’a pu donner la force à la justice, parce que la force a contredit la justice et a dit qu’elle était injuste, et a dit que c’était elle qui était juste : et ainsi ne pouvant faire que ce qui est juste fût fort, on a fait que ce qui est fort fût juste."
    ],
    "authorMeta": "(1623–1662) · philosophe et écrivain français",
    "author": "Blaise Pascal",
    "authorTag": "Pascal",
    "themes": [
      "Justice",
      "État",
      "Raison"
    ],
    "section": "philosophie"
  },
  "la-fontaine-loup-agneau-force-raison": {
    "title": "Quand la raison cède devant la force",
    "description": "La raison peut-elle quelque chose contre la force ?",
    "pedagogicalHook": "La fable montre avec une clarté redoutable la limite d’une bonne argumentation lorsque l’issue est déjà décidée par le rapport de force.",
    "context": "<strong>Situation.</strong> La fable met en scène un procès sans justice. Le loup formule successivement des accusations que l’agneau réfute, mais aucun argument ne peut modifier l’issue décidée d’avance. La parole révèle alors sa limite lorsqu’elle ne s’appuie sur aucune institution capable de contenir la violence. <strong>Enjeu.</strong> La raison peut-elle quelque chose contre la force ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez chaque accusation du loup et la réponse rationnelle que lui oppose l’agneau."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : faire répondre l’agneau à chaque accusation, déplacer sans cesse le grief du loup, puis laisser la violence trancher."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>raison</strong> et <strong>force</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi l’argumentation de l’agneau est-elle logiquement supérieure à celle du loup ?",
      "Comment le loup déplace-t-il sans cesse l’accusation pour éviter d’être réfuté ?",
      "La morale « La raison du plus fort est toujours la meilleure » affirme-t-elle réellement que le plus fort a raison ?"
    ],
    "hlpQuestion": "La raison peut-elle quelque chose contre la force ?",
    "problematisations": [
      "Une argumentation rationnelle suppose-t-elle déjà un cadre commun de justice ?",
      "Que vaut la vérité lorsque l’interlocuteur dispose seul de la force ?"
    ],
    "keywords": [
      "raison",
      "force",
      "sophisme",
      "justice"
    ],
    "hlpOppositions": [
      {
        "left": "raison",
        "right": "force"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "Les séductions de la parole",
        "reason": "Le loup ne se contente pas d’être fort : il fabrique successivement des prétextes qui donnent une apparence argumentative à la violence."
      }
    ],
    "citationApa": "La Fontaine, J. de. (1668). « Le Loup et l’Agneau ». Dans <cite>Fables</cite> (I, 10).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "pascal-force-justice",
        "kind": "proche",
        "label": "Pascal — Justice et force : légitimer ou imposer ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-plaideurs-aristote-autorite",
        "kind": "proche",
        "label": "Racine — Citer une autorité ne suffit pas à prouver",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "platon-gorgias-plaire-rendre-meilleur",
        "kind": "proche",
        "label": "Platon — Rhétorique : plaire ou rendre meilleur ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "raison",
        "force",
        "sophisme",
        "justice"
      ]
    },
    "cardMeta": "L’autorité de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "racine-plaideurs-aristote-autorite": {
    "title": "Citer une autorité ne suffit pas à prouver",
    "description": "Citer une autorité suffit-il à prouver ?",
    "pedagogicalHook": "La scène est idéale pour distinguer référence prestigieuse et véritable preuve : le nom d’Aristote impressionne, mais ne répond pas au problème.",
    "context": "<strong>Situation.</strong> Dans cette comédie judiciaire, l’Intimé plaide une affaire dérisoire de chapon devant le juge Dandin. Il cherche à impressionner en invoquant Aristote et d’autres autorités. Dandin le rappelle obstinément « au fait », révélant l’écart entre prestige savant et pertinence argumentative. <strong>Enjeu.</strong> Citer une autorité suffit-il à prouver ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez ce que l’Intimé cite et ce que Dandin lui demande réellement d’établir."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : accumuler les références savantes tandis que le juge exige sans cesse un retour aux faits."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>autorité</strong> et <strong>preuve</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi l’appel à Aristote paraît-il comique dans cette affaire ?",
      "Quelle différence la scène permet-elle de faire entre une référence et une preuve ?",
      "Pourquoi le prestige d’une autorité peut-il séduire un auditoire sans faire avancer le raisonnement ?"
    ],
    "hlpQuestion": "Citer une autorité suffit-il à prouver ?",
    "problematisations": [
      "Pourquoi l’argument d’autorité persuade-t-il même lorsqu’il ne prouve rien ?",
      "Une référence savante est-elle inutile ou devient-elle légitime sous certaines conditions ?"
    ],
    "keywords": [
      "argument d’autorité",
      "preuve",
      "pertinence",
      "rhétorique"
    ],
    "hlpOppositions": [
      {
        "left": "autorité",
        "right": "preuve"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Racine, J. (1668). <cite>Les Plaideurs</cite> (acte III, scène 3).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "la-fontaine-loup-agneau-force-raison",
        "kind": "proche",
        "label": "La Fontaine — Quand la raison cède devant la force",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "platon-gorgias-plaire-rendre-meilleur",
        "kind": "proche",
        "label": "Platon — Rhétorique : plaire ou rendre meilleur ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-rochefoucauld-maximes-conversation-vanite",
        "kind": "proche",
        "label": "La Rochefoucauld — La conversation dominée par l’amour-propre",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "argument d’autorité",
        "preuve",
        "pertinence",
        "rhétorique"
      ]
    },
    "cardMeta": "L’autorité de la parole"
  },
  "hugo-ruy-blas-valet-commandement": {
    "title": "« Vous êtes mon valet » : la parole rétablit la hiérarchie",
    "description": "Pourquoi certains mots ont-ils le pouvoir de fixer un statut social ?",
    "pedagogicalHook": "Après l’éloquence du ministre, quelques mots de Don Salluste suffisent à restaurer la hiérarchie : l’autorité dépend aussi d’un statut reconnu.",
    "context": "<strong>Situation.</strong> Don Salluste a fait passer son valet Ruy Blas pour un noble afin de préparer sa vengeance contre la reine. Devenu ministre et admiré pour son éloquence politique, Ruy Blas paraît avoir conquis une nouvelle identité. Le retour de son maître révèle brutalement que cette position dépend encore du dispositif qui l’a produite. <strong>Enjeu.</strong> Pourquoi certains mots ont-ils le pouvoir de fixer un statut social ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les paroles et les ordres par lesquels Don Salluste remet Ruy Blas à sa place de valet."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : faire tomber l’identité publique de Ruy Blas par une série d’ordres et de rappels de statut."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>mérite</strong> et <strong>statut</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment Don Salluste détruit-il progressivement l’identité publique acquise par Ruy Blas ?",
      "Pourquoi la formule « vous êtes mon valet » a-t-elle ici une force supérieure aux qualités réelles de Ruy Blas ?",
      "Qu’est-ce que cette scène montre du rapport entre statut social, pouvoir et reconnaissance ?"
    ],
    "hlpQuestion": "Pourquoi certains mots ont-ils le pouvoir de fixer un statut social ?",
    "problematisations": [
      "L’identité sociale dépend-elle davantage des qualités d’un individu ou de la reconnaissance d’un statut ?",
      "Pourquoi certains locuteurs peuvent-ils faire exister une hiérarchie par de simples paroles ?"
    ],
    "keywords": [
      "statut",
      "hiérarchie",
      "commandement",
      "reconnaissance"
    ],
    "hlpOppositions": [
      {
        "left": "mérite",
        "right": "statut"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Hugo, V. (1838). <cite>Ruy Blas</cite> (acte III, scène 5).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "proche",
        "label": "Corneille — « Soyons amis, Cinna » : le pardon du souverain agit",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "chanson-roland-droit-parole",
        "kind": "proche",
        "label": "Anonyme — Qui a le droit de parler au conseil ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-boetie-servitude-volontaire-ne-plus-servir",
        "kind": "proche",
        "label": "La Boétie — « Ne servir plus » : retirer son obéissance au pouvoir",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "L’autorité de la parole",
      "tags": [
        "statut",
        "hiérarchie",
        "commandement",
        "reconnaissance"
      ]
    },
    "cardMeta": "L’autorité de la parole"
  },
  "platon-gorgias-plaire-rendre-meilleur": {
    "title": "Rhétorique : plaire ou rendre meilleur ?",
    "description": "Une parole qui persuade est-elle nécessairement une bonne parole ?",
    "pedagogicalHook": "Ce passage fournit la distinction directrice de tout le thème : une parole réussie parce qu’elle plaît n’est pas nécessairement une parole bonne.",
    "context": "<strong>Situation.</strong> Dans le Gorgias, Socrate examine la rhétorique et son rapport à la politique. Avec Calliclès, il étend la critique à la poésie et à l’éloquence publique : le succès devant la foule n’est pas encore la preuve que le discours vise son bien. <strong>Enjeu.</strong> Une parole qui persuade est-elle nécessairement une bonne parole ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez le critère par lequel Socrate distingue une parole qui plaît d’une parole qui vise le bien."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : distinguer le plaisir produit sur l’auditoire du bien réellement recherché pour lui."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>plaire</strong> et <strong>rendre meilleur</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Socrate rapproche-t-il poésie et rhétorique ?",
      "Quelle différence établit-il entre plaire au public et chercher son bien ?",
      "Pourquoi une parole désagréable peut-elle, selon cette distinction, être meilleure qu’une parole séduisante ?"
    ],
    "hlpQuestion": "Une parole qui persuade est-elle nécessairement une bonne parole ?",
    "problematisations": [
      "Peut-on persuader sans flatter ?",
      "Une parole bonne doit-elle parfois déplaire à celui auquel elle s’adresse ?"
    ],
    "keywords": [
      "rhétorique",
      "flatterie",
      "persuasion",
      "bien"
    ],
    "hlpOppositions": [
      {
        "left": "plaire",
        "right": "rendre meilleur"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’art de la parole",
        "reason": "La critique de la flatterie fournit en creux un critère pour penser ce que serait un véritable art de parler."
      }
    ],
    "citationApa": "Platon. (1826). <cite>Gorgias</cite> (V. Cousin, trad., 502c–503b).",
    "translator": "Victor Cousin",
    "relatedTexts": [
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "proche",
        "label": "Roman de Renart — Flatter pour désarmer : la stratégie de Renart",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Connaître le faible d’autrui pour orienter sa volonté",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "moliere-dom-juan-detourner-langage",
        "kind": "proche",
        "label": "Molière — Dom Juan : trois stratégies de langage",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "rhétorique",
        "flatterie",
        "persuasion",
        "bien"
      ]
    },
    "cardMeta": "Les séductions de la parole",
    "sections": [
      "philosophie"
    ]
  },
  "gracian-homme-cour-faible-chacun": {
    "title": "Connaître le faible d’autrui pour orienter sa volonté",
    "description": "Connaître les passions d’autrui, est-ce déjà pouvoir le manipuler ?",
    "pedagogicalHook": "Gracián formule presque une technique de manipulation : connaître la passion dominante d’autrui pour obtenir de lui ce que l’on veut.",
    "context": "<strong>Situation.</strong> L’Homme de cour rassemble des maximes de prudence destinées à celui qui doit évoluer dans le monde social et politique. La maxime XXVI décrit la connaissance des passions non comme une fin théorique, mais comme un moyen d’action sur autrui. <strong>Enjeu.</strong> Connaître les passions d’autrui, est-ce déjà pouvoir le manipuler ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les métaphores qui transforment la connaissance d’une passion en moyen d’action."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : identifier une passion dominante, en faire une « clef », puis s’en servir pour orienter la volonté."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>connaître</strong> et <strong>manipuler</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Gracián compare-t-il la passion dominante à une « clef » de la volonté ?",
      "Quelle conception de l’être humain suppose cette technique d’influence ?",
      "À partir de quel moment connaître autrui devient-il le manipuler ?"
    ],
    "hlpQuestion": "Connaître les passions d’autrui, est-ce déjà pouvoir le manipuler ?",
    "problematisations": [
      "Toute connaissance psychologique d’autrui comporte-t-elle un pouvoir sur lui ?",
      "Peut-on influencer quelqu’un sans réduire sa liberté ?"
    ],
    "keywords": [
      "manipulation",
      "passion",
      "influence",
      "volonté"
    ],
    "hlpOppositions": [
      {
        "left": "connaître",
        "right": "manipuler"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Gracián, B. (1684). <cite>L’Homme de cour</cite> (Amelot de La Houssaie, trad., maxime XXVI).",
    "translator": "Amelot de La Houssaie",
    "relatedTexts": [
      {
        "id": "shakespeare-othello-iago-jalousie",
        "kind": "proche",
        "label": "Shakespeare — Iago : faire naître le soupçon sans l’affirmer",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "proche",
        "label": "Roman de Renart — Flatter pour désarmer : la stratégie de Renart",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-rochefoucauld-maximes-conversation-vanite",
        "kind": "proche",
        "label": "La Rochefoucauld — La conversation dominée par l’amour-propre",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "manipulation",
        "passion",
        "influence",
        "volonté"
      ]
    },
    "cardMeta": "Les séductions de la parole",
    "sections": [
      "philosophie",
      "autres"
    ]
  },
  "roman-renart-chantecler-flatterie": {
    "title": "Flatter pour désarmer : la stratégie de Renart",
    "description": "Pourquoi la flatterie rend-elle celui qui l’écoute vulnérable ?",
    "pedagogicalHook": "Renart offre un mécanisme de séduction facile à mémoriser : flatter, rassurer, toucher l’amour-propre, puis obtenir le comportement recherché.",
    "context": "<strong>Situation.</strong> Après avoir manqué une première attaque contre Chantecler, Renart change de stratégie. Il se présente comme un parent admiratif, compare le coq à son père réputé pour son chant, puis transforme l’éloge en défi. Chantecler finit par faire exactement ce qui le rend vulnérable. <strong>Enjeu.</strong> Pourquoi la flatterie rend-elle celui qui l’écoute vulnérable ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les étapes par lesquelles Renart fait passer Chantecler de la méfiance à l’imprudence."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : se présenter comme allié, flatter, introduire une comparaison blessante, puis obtenir le geste imprudent."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>éloge</strong> et <strong>piège</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Renart commence-t-il par se présenter comme un ami et un parent ?",
      "Comment passe-t-il de l’éloge à la comparaison blessante avec Chanteclin ?",
      "À quel moment Chantecler cesse-t-il d’agir selon sa prudence pour agir selon son amour-propre ?"
    ],
    "hlpQuestion": "Pourquoi la flatterie rend-elle celui qui l’écoute vulnérable ?",
    "problematisations": [
      "La flatterie fonctionne-t-elle parce qu’elle ment ou parce qu’elle dit ce que nous voulons croire ?",
      "L’amour-propre est-il la première faiblesse de l’auditeur ?"
    ],
    "keywords": [
      "flatterie",
      "amour-propre",
      "ruse",
      "manipulation"
    ],
    "hlpOppositions": [
      {
        "left": "éloge",
        "right": "piège"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Anonyme. (1861). <cite>Le Roman de Renart</cite> (P. Paris, version française, aventure de Renart et Chantecler).",
    "translator": "Paulin Paris",
    "relatedTexts": [
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Connaître le faible d’autrui pour orienter sa volonté",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "shakespeare-othello-iago-jalousie",
        "kind": "proche",
        "label": "Shakespeare — Iago : faire naître le soupçon sans l’affirmer",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "ronsard-mignonne-rose-carpe-diem",
        "kind": "proche",
        "label": "Ronsard — Séduire en transformant la rose en argument",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "flatterie",
        "amour-propre",
        "ruse",
        "manipulation"
      ]
    },
    "cardMeta": "Les séductions de la parole"
  },
  "shakespeare-othello-iago-jalousie": {
    "title": "Iago : faire naître le soupçon sans l’affirmer",
    "description": "Pourquoi l’insinuation peut-elle être plus persuasive qu’une affirmation ?",
    "pedagogicalHook": "Iago montre la puissance de l’insinuation : au lieu d’imposer une croyance, il conduit Othello à fabriquer lui-même sa certitude.",
    "context": "<strong>Situation.</strong> Iago veut persuader Othello que Desdémona le trompe avec Cassio. Il ne formule d’abord aucune accusation nette : il met en scène sa réticence, avertit contre la jalousie et fournit des indices ambigus. Cette stratégie donne au soupçon l’apparence d’une conclusion découverte par Othello lui-même. <strong>Enjeu.</strong> Pourquoi l’insinuation peut-elle être plus persuasive qu’une affirmation ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez ce qu’Iago refuse d’affirmer directement et les indices qu’il laisse Othello interpréter."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : feindre la réticence, lâcher des indices, prévenir contre la jalousie et laisser Othello compléter lui-même le soupçon."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>affirmer</strong> et <strong>insinuer</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Iago refuse-t-il d’abord de dire clairement ce qu’il pense ?",
      "Comment l’avertissement contre la jalousie contribue-t-il paradoxalement à rendre Othello jaloux ?",
      "Pourquoi une suggestion peut-elle être plus efficace qu’une accusation directe ?"
    ],
    "hlpQuestion": "Pourquoi l’insinuation peut-elle être plus persuasive qu’une affirmation ?",
    "problematisations": [
      "Pourquoi croyons-nous davantage une idée que nous pensons avoir découverte nous-mêmes ?",
      "La manipulation la plus efficace est-elle celle qui dissimule son propre auteur ?"
    ],
    "keywords": [
      "insinuation",
      "soupçon",
      "jalousie",
      "manipulation"
    ],
    "hlpOppositions": [
      {
        "left": "affirmer",
        "right": "insinuer"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Shakespeare, W. (1872). <cite>Othello</cite> (É. Montégut, trad., acte III, scène 3).",
    "translator": "Émile Montégut",
    "relatedTexts": [
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Connaître le faible d’autrui pour orienter sa volonté",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "moliere-dom-juan-detourner-langage",
        "kind": "proche",
        "label": "Molière — Dom Juan : trois stratégies de langage",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "sun-tzu-dissensions-rumeur",
        "kind": "proche",
        "label": "Sun Tzu — Agir sur les esprits avant de combattre",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "insinuation",
        "soupçon",
        "jalousie",
        "manipulation"
      ]
    },
    "cardMeta": "Les séductions de la parole"
  },
  "moliere-dom-juan-detourner-langage": {
    "title": "Dom Juan : trois stratégies de langage",
    "description": "Comment le même langage peut-il servir à séduire, esquiver et dissimuler ?",
    "pedagogicalHook": "Trois scènes permettent de comparer trois détournements du langage : séduire, esquiver une demande et se protéger derrière un masque moral.",
    "context": "<strong>Situation.</strong> Cette fiche rassemble trois moments de la pièce. Avec Charlotte et Mathurine, Dom Juan distribue des promesses incompatibles. Face à M. Dimanche, il noie la demande d’argent sous les civilités. Enfin, il annonce qu’il adoptera publiquement le langage de la dévotion comme masque social. <strong>Enjeu.</strong> Comment le même langage peut-il servir à séduire, esquiver et dissimuler ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Dans chaque scène, repérez l’objectif de Dom Juan et l’obstacle qu’il contourne grâce au langage."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : comparer trois procédés : promesse amoureuse, avalanche de civilités, puis adoption stratégique du vocabulaire religieux."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>langage social</strong> et <strong>stratégie personnelle</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Qu’est-ce qui change entre la séduction amoureuse, la politesse envers M. Dimanche et l’hypocrisie religieuse ?",
      "Pourquoi les civilités de Dom Juan empêchent-elles M. Dimanche de formuler sa demande ?",
      "En quoi l’hypocrisie donne-t-elle au langage un pouvoir de protection sociale ?"
    ],
    "hlpQuestion": "Comment le même langage peut-il servir à séduire, esquiver et dissimuler ?",
    "problematisations": [
      "Le langage est-il un instrument neutre dont la morale dépend uniquement de l’intention ?",
      "La politesse et la religion deviennent-elles mensongères dès qu’elles sont utilisées stratégiquement ?"
    ],
    "keywords": [
      "séduction",
      "politesse",
      "hypocrisie",
      "stratégie"
    ],
    "hlpOppositions": [
      {
        "left": "langage social",
        "right": "stratégie personnelle"
      }
    ],
    "hlpTier": "essential",
    "hlpConnections": [],
    "citationApa": "Molière. (1665). <cite>Dom Juan ou le Festin de pierre</cite> (actes II, IV et V).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "shakespeare-othello-iago-jalousie",
        "kind": "proche",
        "label": "Shakespeare — Iago : faire naître le soupçon sans l’affirmer",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "la-rochefoucauld-maximes-conversation-vanite",
        "kind": "proche",
        "label": "La Rochefoucauld — La conversation dominée par l’amour-propre",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "laclos-liaisons-lettre-56-tourvel",
        "kind": "proche",
        "label": "Laclos — Résister à la séduction dans la langue du séducteur",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "séduction",
        "politesse",
        "hypocrisie",
        "stratégie"
      ]
    },
    "cardMeta": "Les séductions de la parole",
    "parts": [
      {
        "title": "Acte II, scène 4 — Séduire par des promesses incompatibles",
        "context": "<strong>Situation.</strong> Charlotte et Mathurine réclament chacune une confirmation publique des promesses de Dom Juan. <strong>Enjeu.</strong> Observer comment il évite une affirmation vérifiable tout en laissant chacune entendre ce qu’elle désire.",
        "readingGuide": [
          {
            "label": "1 · Repérer",
            "text": "Repérez les moments où Dom Juan refuse de répondre directement à une question pourtant simple."
          },
          {
            "label": "2 · Analyser",
            "text": "Observez comment l’ambiguïté et la distribution de la parole lui permettent de maintenir deux croyances incompatibles."
          },
          {
            "label": "3 · Interpréter",
            "text": "Distinguez <strong>promettre</strong> et <strong>laisser croire</strong> : la séduction dépend précisément de cet écart."
          }
        ],
        "readingQuestions": [
          "Pourquoi Dom Juan évite-t-il une déclaration identique et publique devant les deux femmes ?",
          "Comment transforme-t-il leur demande de vérité en problème de « redites » ?",
          "En quoi l’ambiguïté lui permet-elle de conserver simultanément deux promesses contradictoires ?"
        ],
        "paragraphs": [
          "ACTE II — Dom Juan à Charlotte et Mathurine : « Est-ce que chacune de vous ne sait pas ce qui en est, sans qu’il soit nécessaire que je m’explique davantage ? Pourquoi m’obliger là-dessus à des redites ? »"
        ],
        "work": "Dom Juan — acte II, scène 4",
        "publication": "1665, texte français original",
        "citationApa": "Molière. (1665). <cite>Dom Juan ou le Festin de pierre</cite> (acte II, scène 4)."
      },
      {
        "title": "Acte IV, scène 3 — Étouffer une demande sous la politesse",
        "context": "<strong>Situation.</strong> M. Dimanche vient réclamer l’argent que Dom Juan lui doit. Celui-ci multiplie compliments, questions et marques de considération. <strong>Enjeu.</strong> Comprendre comment une parole apparemment courtoise peut empêcher l’autre d’accomplir l’acte de parole pour lequel il est venu.",
        "readingGuide": [
          {
            "label": "1 · Repérer",
            "text": "Repérez chaque tentative de M. Dimanche pour introduire sa demande et chaque interruption de Dom Juan."
          },
          {
            "label": "2 · Analyser",
            "text": "Suivez l’accumulation des civilités : plus Dom Juan paraît accueillant, moins son créancier peut parler de la dette."
          },
          {
            "label": "3 · Interpréter",
            "text": "Mettez en tension <strong>politesse</strong> et <strong>domination conversationnelle</strong>."
          }
        ],
        "readingQuestions": [
          "Pourquoi les compliments de Dom Juan sont-ils efficaces alors qu’ils ne répondent jamais à la raison de la visite ?",
          "Comment Dom Juan contrôle-t-il le rythme et le sujet de la conversation ?",
          "La politesse protège-t-elle ici la relation sociale ou sert-elle à neutraliser la parole de M. Dimanche ?"
        ],
        "paragraphs": [
          "ACTE IV — DON JUAN. — Parbleu ! monsieur Dimanche, vous vous portez bien. — MONSIEUR DIMANCHE. — Oui, monsieur, pour vous rendre service. Je suis venu… — DON JUAN. — Vous avez un fonds de santé admirable, des lèvres fraîches, un teint vermeil, et des yeux vifs.",
          "MONSIEUR DIMANCHE. — Il est vrai ; il me fait tant de civilités et tant de compliments, que je ne saurais jamais lui demander de l’argent."
        ],
        "work": "Dom Juan — acte IV, scène 3",
        "publication": "1665, texte français original",
        "citationApa": "Molière. (1665). <cite>Dom Juan ou le Festin de pierre</cite> (acte IV, scène 3)."
      },
      {
        "title": "Acte V, scène 2 — Faire de l’hypocrisie un bouclier social",
        "context": "<strong>Situation.</strong> Dom Juan annonce à Sganarelle qu’il adoptera désormais publiquement le rôle de l’homme dévot. <strong>Enjeu.</strong> Voir comment un langage moral peut devenir un masque stratégique lorsque les signes de la vertu sont séparés de la vertu elle-même.",
        "readingGuide": [
          {
            "label": "1 · Repérer",
            "text": "Repérez les avantages sociaux que Dom Juan attribue au « personnage d’homme de bien »."
          },
          {
            "label": "2 · Analyser",
            "text": "Observez comment il décrit l’hypocrisie comme une ressource collective, protégée par ceux qui utilisent les mêmes signes."
          },
          {
            "label": "3 · Interpréter",
            "text": "Distinguez <strong>paraître vertueux</strong> et <strong>être vertueux</strong>."
          }
        ],
        "readingQuestions": [
          "Pourquoi Dom Juan considère-t-il l’hypocrisie comme un vice particulièrement avantageux ?",
          "Qu’est-ce qui rend le langage religieux protecteur dans son raisonnement ?",
          "Que devient l’autorité morale d’un vocabulaire lorsqu’il peut être imité sans conviction ?"
        ],
        "paragraphs": [
          "ACTE V — DON JUAN. — L’hypocrisie est un vice à la mode, et tous les vices à la mode passent pour vertus. Le personnage d’homme de bien est le meilleur de tous les personnages qu’on puisse jouer aujourd’hui."
        ],
        "work": "Dom Juan — acte V, scène 2",
        "publication": "1665, texte français original",
        "citationApa": "Molière. (1665). <cite>Dom Juan ou le Festin de pierre</cite> (acte V, scène 2)."
      }
    ]
  },
  "la-rochefoucauld-maximes-conversation-vanite": {
    "title": "La conversation dominée par l’amour-propre",
    "description": "Peut-on vraiment écouter lorsque l’amour-propre gouverne la conversation ?",
    "pedagogicalHook": "Ces maximes donnent une grille très fine pour lire les conversations ordinaires : écouter, persuader et parler de soi sont traversés par l’amour-propre.",
    "context": "<strong>Situation.</strong> La Rochefoucauld observe les conduites sociales à partir de l’amour-propre. Dans ces maximes, il montre que même une conversation apparemment tournée vers autrui peut être structurée par le désir de parler de soi et de préparer sa propre réponse. <strong>Enjeu.</strong> Peut-on vraiment écouter lorsque l’amour-propre gouverne la conversation ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les motivations cachées que les maximes placent derrière des comportements apparemment courtois."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : décomposer la conversation en motivations cachées : vanité, préparation de sa réponse et défaut d’écoute."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>écouter</strong> et <strong>se mettre en scène</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi la vanité nous pousse-t-elle à parler ?",
      "Quelle différence y a-t-il entre avoir l’air attentif et écouter réellement ?",
      "Pourquoi bien écouter est-il, selon La Rochefoucauld, une condition pour plaire et persuader ?"
    ],
    "hlpQuestion": "Peut-on vraiment écouter lorsque l’amour-propre gouverne la conversation ?",
    "problematisations": [
      "Une conversation authentique exige-t-elle de suspendre l’amour-propre ?",
      "Bien écouter est-il une vertu morale ou une technique de persuasion ?"
    ],
    "keywords": [
      "amour-propre",
      "écoute",
      "conversation",
      "persuasion"
    ],
    "hlpOppositions": [
      {
        "left": "écouter",
        "right": "se mettre en scène"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "La Rochefoucauld, F. de. (1678). <cite>Réflexions ou sentences et maximes morales</cite> (maximes CXXXVII–CXXXIX).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "moliere-dom-juan-detourner-langage",
        "kind": "proche",
        "label": "Molière — Dom Juan : trois stratégies de langage",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Connaître le faible d’autrui pour orienter sa volonté",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "amour-propre",
        "écoute",
        "conversation",
        "persuasion"
      ]
    },
    "cardMeta": "Les séductions de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "ronsard-mignonne-rose-carpe-diem": {
    "title": "Séduire en transformant la rose en argument",
    "description": "Comment une image poétique devient-elle un argument de séduction ?",
    "pedagogicalHook": "Le poème fait voir qu’une séduction peut être une argumentation complète : montrer une rose, faire sentir le temps, puis tirer une conclusion pratique.",
    "context": "<strong>Situation.</strong> Ronsard adresse à Cassandre une ode construite autour d’une comparaison entre la beauté de la rose et celle de la jeune femme. L’émotion poétique soutient ainsi une stratégie persuasive : montrer, faire sentir la fragilité, puis conclure par un conseil. <strong>Enjeu.</strong> Comment une image poétique devient-elle un argument de séduction ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les trois temps de l’argument : observation, leçon sur le temps, conseil adressé à la destinataire."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : montrer la rose, constater sa disparition rapide, transposer cette fragilité à la destinataire, puis conclure par l’impératif."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>image</strong> et <strong>argument</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment le poème passe-t-il d’une observation de la rose à un conseil adressé à la jeune femme ?",
      "Pourquoi l’image de la fleur rend-elle l’argument plus sensible ?",
      "Le poème cherche-t-il davantage à démontrer ou à séduire ?"
    ],
    "hlpQuestion": "Comment une image poétique devient-elle un argument de séduction ?",
    "problematisations": [
      "La beauté d’un argument vient-elle renforcer sa vérité ou détourner le jugement ?",
      "Une invitation à profiter du présent peut-elle être à la fois philosophique et intéressée ?"
    ],
    "keywords": [
      "séduction",
      "image",
      "argumentation",
      "temps"
    ],
    "hlpOppositions": [
      {
        "left": "image",
        "right": "argument"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [],
    "citationApa": "Ronsard, P. de. (1553). « Mignonne, allons voir si la rose ». Dans <cite>Les Odes</cite>.",
    "translator": "",
    "relatedTexts": [
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "louise-labe-sonnet-8-je-vis-je-meurs",
        "kind": "proche",
        "label": "Louise Labé — « Je vis, je meurs » : dire un moi contradictoire",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "roman-renart-chantecler-flatterie",
        "kind": "proche",
        "label": "Roman de Renart — Flatter pour désarmer : la stratégie de Renart",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "séduction",
        "image",
        "argumentation",
        "temps"
      ]
    },
    "cardMeta": "Les séductions de la parole"
  },
  "rousseau-julie-lettre-amour-sincerite": {
    "title": "Une parole trop travaillée peut-elle être sincère ?",
    "description": "Une parole travaillée peut-elle rester sincère ?",
    "pedagogicalHook": "Rousseau pose une question décisive pour toute parole affective : les signes de la sincérité peuvent-ils être produits artificiellement ?",
    "context": "<strong>Situation.</strong> Dans la seconde préface dialoguée de Julie, Rousseau défend le style de ses lettres contre l’accusation d’emphase. Il propose un critère paradoxal : la passion authentique ne cherche pas d’abord à briller ni même à persuader ; son désordre peut être le signe de sa vérité. <strong>Enjeu.</strong> Une parole travaillée peut-elle rester sincère ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les signes que Rousseau associe au calcul stylistique et ceux qu’il associe à la passion."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : opposer le langage calculé du bel esprit au désordre supposé spontané de la passion."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>spontanéité</strong> et <strong>artifice</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Rousseau oppose-t-il le « bel esprit » à l’amant réellement passionné ?",
      "Comment le désordre du langage peut-il devenir un signe de sincérité ?",
      "Peut-on fabriquer les signes mêmes de la spontanéité ?"
    ],
    "hlpQuestion": "Une parole travaillée peut-elle rester sincère ?",
    "problematisations": [
      "La spontanéité est-elle un signe fiable de vérité ?",
      "Peut-on reconnaître une parole sincère à son style ?"
    ],
    "keywords": [
      "sincérité",
      "spontanéité",
      "style",
      "passion"
    ],
    "hlpOppositions": [
      {
        "left": "spontanéité",
        "right": "artifice"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [
      {
        "level": "Terminale",
        "object": "La recherche de soi",
        "subtheme": "Les expressions de la sensibilité",
        "reason": "Le passage interroge la relation entre style, émotion et vérité de l’expérience intérieure."
      }
    ],
    "citationApa": "Rousseau, J.-J. (1761). <cite>Julie ou La Nouvelle Héloïse</cite> (seconde préface).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "laclos-liaisons-lettre-56-tourvel",
        "kind": "proche",
        "label": "Laclos — Résister à la séduction dans la langue du séducteur",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-phedre-aveu-hippolyte",
        "kind": "proche",
        "label": "Racine — L’aveu : quand dire transforme la relation",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "sappho-fragment-31-parole-corps",
        "kind": "proche",
        "label": "Sappho — Quand la passion défait la parole",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "sincérité",
        "spontanéité",
        "style",
        "passion"
      ]
    },
    "cardMeta": "Les séductions de la parole",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "laclos-liaisons-lettre-56-tourvel": {
    "title": "Résister à la séduction dans la langue du séducteur",
    "description": "Peut-on résister à une parole séduisante sans entrer dans son jeu ?",
    "pedagogicalHook": "Tourvel veut résister, mais elle doit répondre dans le langage même de Valmont : le texte montre comment une interaction peut déjà déplacer celui qui se défend.",
    "context": "<strong>Situation.</strong> La présidente de Tourvel veut mettre fin aux déclarations de Valmont. Elle organise rationnellement son refus, évoque la sincérité possible des sentiments de son correspondant et tente de lui ôter toute espérance. Cette volonté de maîtrise laisse pourtant apparaître combien la relation l’affecte déjà. <strong>Enjeu.</strong> Peut-on résister à une parole séduisante sans entrer dans son jeu ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les concessions de Tourvel, les raisons de son refus et les traces de l’émotion qu’elle veut maîtriser."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : concéder la sincérité possible de Valmont, organiser un refus raisonné, puis révéler indirectement l’effet déjà produit."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>résister</strong> et <strong>entrer dans le jeu</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Tourvel accepte-t-elle provisoirement l’hypothèse que Valmont l’aime véritablement ?",
      "En quoi la lettre cherche-t-elle à convaincre Valmont mais aussi Tourvel elle-même ?",
      "Pourquoi répondre à une déclaration peut-il déjà signifier entrer dans le jeu de la séduction ?"
    ],
    "hlpQuestion": "Peut-on résister à une parole séduisante sans entrer dans son jeu ?",
    "problematisations": [
      "Répondre à une séduction, est-ce déjà lui accorder un pouvoir ?",
      "Peut-on être parfaitement sincère lorsqu’on cherche aussi à se convaincre soi-même ?"
    ],
    "keywords": [
      "séduction",
      "résistance",
      "lettre",
      "autojustification"
    ],
    "hlpOppositions": [
      {
        "left": "résister",
        "right": "entrer dans le jeu"
      }
    ],
    "hlpTier": "deepening",
    "hlpConnections": [
      {
        "level": "Terminale",
        "object": "La recherche de soi",
        "subtheme": "Les expressions de la sensibilité",
        "reason": "La lettre fait apparaître l’écart entre ce que Tourvel veut maîtriser et ce que son écriture révèle de son trouble."
      }
    ],
    "citationApa": "Laclos, P. Choderlos de. (1782). <cite>Les Liaisons dangereuses</cite> (lettre LVI).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "moliere-dom-juan-detourner-langage",
        "kind": "proche",
        "label": "Molière — Dom Juan : trois stratégies de langage",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-phedre-aveu-hippolyte",
        "kind": "proche",
        "label": "Racine — L’aveu : quand dire transforme la relation",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les pouvoirs de la parole",
      "subtheme": "Les séductions de la parole",
      "tags": [
        "séduction",
        "résistance",
        "lettre",
        "autojustification"
      ]
    },
    "cardMeta": "Les séductions de la parole"
  },
  "epictete-manuel-46-vivre-principes": {
    "title": "Transmettre par l’exemple plutôt que par le discours",
    "description": "L’exemple peut-il transmettre davantage que le discours ?",
    "pedagogicalHook": "Épictète inverse le modèle du maître qui parle : l’autorité d’un enseignement se mesure à une manière de vivre, non à la quantité de principes récités.",
    "context": "<strong>Situation.</strong> Le Manuel condense des règles pratiques stoïciennes. Au paragraphe XLVI, Épictète met en garde celui qui veut se présenter comme philosophe en récitant ses doctrines : le véritable progrès se reconnaît dans les actes. <strong>Enjeu.</strong> L’exemple peut-il transmettre davantage que le discours ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez ce qu’Épictète refuse au disciple et le comportement qu’il lui demande à la place."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : opposer l’exposition des doctrines à leur assimilation visible dans les conduites ordinaires."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>discours</strong> et <strong>exemple</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Épictète se méfie-t-il de celui qui expose constamment ses principes ?",
      "Quelle différence fait-il entre connaître une doctrine et l’avoir assimilée ?",
      "En quoi l’exemple peut-il être une forme de transmission plus forte que le discours ?"
    ],
    "hlpQuestion": "L’exemple peut-il transmettre davantage que le discours ?",
    "problematisations": [
      "Une vie exemplaire enseigne-t-elle mieux qu’une doctrine expliquée ?",
      "Peut-on transmettre une sagesse que l’on ne pratique pas soi-même ?"
    ],
    "keywords": [
      "exemple",
      "éducation",
      "pratique",
      "émancipation"
    ],
    "hlpOppositions": [
      {
        "left": "discours",
        "right": "exemple"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "L’autorité de la parole",
        "reason": "Épictète permet de comparer l’autorité d’un discours à celle d’un exemple vécu."
      }
    ],
    "citationApa": "Épictète. (1875). <cite>Manuel</cite> (J.-M. Guyau, trad., § XLVI).",
    "translator": "Jean-Marie Guyau",
    "relatedTexts": [
      {
        "id": "tacite-dialogue-orateurs-formation",
        "kind": "proche",
        "label": "Tacite — L’éloquence s’apprend au contact des orateurs",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "hippocrate-serment",
        "kind": "proche",
        "label": "Hippocrate — Le serment : quand dire, c’est s’obliger",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "seneque-colere-juge-medecin",
        "kind": "proche",
        "label": "Sénèque — Punir sans colère : la raison contre la vengeance",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Éducation, transmission et émancipation",
      "tags": [
        "exemple",
        "éducation",
        "pratique",
        "émancipation"
      ]
    },
    "cardMeta": "Éducation, transmission et émancipation",
    "sections": [
      "philosophie"
    ]
  },
  "sappho-fragment-31-parole-corps": {
    "title": "Quand la passion défait la parole",
    "description": "Comment exprimer une sensibilité qui défait la parole ?",
    "pedagogicalHook": "Le fragment permet de saisir une sensibilité au moment où elle déborde la maîtrise du sujet : le corps parle précisément lorsque la voix se défait.",
    "context": "<strong>Situation.</strong> Dans le fragment 31, la présence de l’être aimé rend impossible la maîtrise ordinaire de soi. L’émotion n’est pas seulement racontée : le poème en inventorie les effets physiques jusqu’à la défaillance de la parole. <strong>Enjeu.</strong> Comment exprimer une sensibilité qui défait la parole ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez l’ordre dans lequel la voix, les sens et le corps sont atteints."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : partir de la scène regardée, puis énumérer les défaillances de la voix, des sens et du corps."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>maîtrise</strong> et <strong>débordement</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi la parole est-elle le premier pouvoir qui se défait ?",
      "Comment le corps devient-il le lieu où le sentiment se rend visible ?",
      "Le poème décrit-il une émotion ou la fait-il éprouver au lecteur ?"
    ],
    "hlpQuestion": "Comment exprimer une sensibilité qui défait la parole ?",
    "problematisations": [
      "Le corps exprime-t-il plus fidèlement la sensibilité que le langage volontaire ?",
      "La poésie permet-elle de dire précisément ce qui rend la parole impossible ?"
    ],
    "keywords": [
      "sensibilité",
      "corps",
      "passion",
      "défaillance"
    ],
    "hlpOppositions": [
      {
        "left": "maîtrise",
        "right": "débordement"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [],
    "citationApa": "Sappho. (1903). « Ode à une femme aimée » (R. Vivien, trad., fragment 31). Dans <cite>Sapho</cite>.",
    "translator": "Renée Vivien",
    "relatedTexts": [
      {
        "id": "louise-labe-sonnet-8-je-vis-je-meurs",
        "kind": "proche",
        "label": "Louise Labé — « Je vis, je meurs » : dire un moi contradictoire",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-phedre-aveu-hippolyte",
        "kind": "proche",
        "label": "Racine — L’aveu : quand dire transforme la relation",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "sensibilité",
        "corps",
        "passion",
        "défaillance"
      ]
    },
    "cardMeta": "Les expressions de la sensibilité"
  },
  "louise-labe-sonnet-8-je-vis-je-meurs": {
    "title": "« Je vis, je meurs » : dire un moi contradictoire",
    "description": "Comment la parole poétique exprime-t-elle un moi contradictoire ?",
    "pedagogicalHook": "Les antithèses donnent une forme à une expérience instable : le sujet amoureux se découvre traversé par des états incompatibles.",
    "context": "<strong>Situation.</strong> Le sonnet accumule les antithèses pour rendre sensible une expérience qui échappe à l’identité stable. Le sujet amoureux découvre qu’il ne maîtrise ni la succession ni la contradiction de ses propres états. <strong>Enjeu.</strong> Comment la parole poétique exprime-t-elle un moi contradictoire ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les oppositions qui structurent chaque vers et ce qui provoque ces changements."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : enchaîner des antithèses jusqu’à faire de l’instabilité elle-même la vérité momentanée du sujet amoureux."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>identité</strong> et <strong>contradiction</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi le poème accumule-t-il les couples de contraires ?",
      "Qui est présenté comme l’agent des transformations du sujet ?",
      "En quoi la forme poétique rend-elle sensible l’instabilité du moi ?"
    ],
    "hlpQuestion": "Comment la parole poétique exprime-t-elle un moi contradictoire ?",
    "problematisations": [
      "Le moi reste-t-il identique lorsqu’il éprouve des états contradictoires ?",
      "La contradiction peut-elle être une forme de vérité de l’expérience affective ?"
    ],
    "keywords": [
      "sensibilité",
      "contradiction",
      "moi",
      "passion"
    ],
    "hlpOppositions": [
      {
        "left": "identité",
        "right": "contradiction"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [],
    "citationApa": "Labé, L. (1555). « Je vis, je meurs » (sonnet VIII). Dans <cite>Œuvres</cite>.",
    "translator": "",
    "relatedTexts": [
      {
        "id": "sappho-fragment-31-parole-corps",
        "kind": "proche",
        "label": "Sappho — Quand la passion défait la parole",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "racine-phedre-aveu-hippolyte",
        "kind": "proche",
        "label": "Racine — L’aveu : quand dire transforme la relation",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "ronsard-mignonne-rose-carpe-diem",
        "kind": "proche",
        "label": "Ronsard — Séduire en transformant la rose en argument",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "sensibilité",
        "contradiction",
        "moi",
        "passion"
      ]
    },
    "cardMeta": "Les expressions de la sensibilité"
  },
  "racine-phedre-aveu-hippolyte": {
    "title": "L’aveu : quand dire transforme la relation",
    "description": "Que change le fait de dire ce que l’on éprouve ?",
    "pedagogicalHook": "Phèdre montre qu’un aveu n’est pas une simple information : dire son désir transforme celui qui parle, celui qui écoute et la relation entre eux.",
    "context": "<strong>Situation.</strong> Croyant Thésée mort, Phèdre rencontre Hippolyte. Elle veut lui demander protection pour son fils mais, dans le mouvement même de son discours, elle assimile Hippolyte à son père et finit par reconnaître explicitement son amour. L’aveu transforme immédiatement la relation. <strong>Enjeu.</strong> Que change le fait de dire ce que l’on éprouve ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez le moment où le discours cesse de porter sur Thésée et se tourne explicitement vers Hippolyte."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : partir d’un autre objet de discours, glisser vers Hippolyte, puis laisser l’amour interdit se nommer explicitement."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>silence</strong> et <strong>aveu</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment le discours de Phèdre glisse-t-il de Thésée à Hippolyte ?",
      "Pourquoi l’aveu semble-t-il à la fois voulu et arraché à Phèdre ?",
      "Qu’est-ce qui devient irréversible une fois la passion dite ?"
    ],
    "hlpQuestion": "Que change le fait de dire ce que l’on éprouve ?",
    "problematisations": [
      "Dire un sentiment nous libère-t-il ou nous engage-t-il davantage ?",
      "Un aveu est-il encore volontaire lorsqu’il semble arraché par la passion ?"
    ],
    "keywords": [
      "aveu",
      "passion",
      "honte",
      "irréversibilité"
    ],
    "hlpOppositions": [
      {
        "left": "silence",
        "right": "aveu"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [],
    "citationApa": "Racine, J. (1677). <cite>Phèdre</cite> (acte II, scène 5).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "sappho-fragment-31-parole-corps",
        "kind": "proche",
        "label": "Sappho — Quand la passion défait la parole",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "louise-labe-sonnet-8-je-vis-je-meurs",
        "kind": "proche",
        "label": "Louise Labé — « Je vis, je meurs » : dire un moi contradictoire",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "laclos-liaisons-lettre-56-tourvel",
        "kind": "proche",
        "label": "Laclos — Résister à la séduction dans la langue du séducteur",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les expressions de la sensibilité",
      "tags": [
        "aveu",
        "passion",
        "honte",
        "irréversibilité"
      ]
    },
    "cardMeta": "Les expressions de la sensibilité"
  },
  "ovide-narcisse-reflet-desir-identite": {
    "title": "Narcisse : se voir sans se connaître",
    "description": "Se voir suffit-il à se connaître ?",
    "pedagogicalHook": "Narcisse est un outil très clair pour distinguer image de soi et connaissance de soi : on peut parfaitement se voir et pourtant se méprendre sur ce que l’on voit.",
    "context": "<strong>Situation.</strong> Après avoir repoussé celles et ceux qui l’aiment, Narcisse s’arrête près d’une source parfaitement claire. Il tombe amoureux de l’apparition qu’il y voit. Le récit interroge l’identité, la représentation de soi et l’illusion produite par une image qui ressemble parfaitement au sujet. <strong>Enjeu.</strong> Se voir suffit-il à se connaître ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez ce que Narcisse voit, ce qu’il croit voir et le moment où ces deux choses commencent à se séparer."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : faire naître le désir devant l’image, prolonger la méprise, puis conduire progressivement à la découverte de l’identité."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>se voir</strong> et <strong>se connaître</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Narcisse prend-il d’abord son image pour un autre être ?",
      "Que change la découverte que l’objet aimé est lui-même ?",
      "Le reflet lui donne-t-il une connaissance de soi ou l’enferme-t-il dans une illusion ?"
    ],
    "hlpQuestion": "Se voir suffit-il à se connaître ?",
    "problematisations": [
      "Toute image de soi nous éloigne-t-elle de la connaissance de soi ?",
      "Peut-on désirer ce que l’on est sans se transformer en objet pour soi-même ?"
    ],
    "keywords": [
      "image de soi",
      "identité",
      "désir",
      "illusion"
    ],
    "hlpOppositions": [
      {
        "left": "se voir",
        "right": "se connaître"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les représentations du monde",
        "subtheme": "Décrire, figurer, imaginer",
        "reason": "Le reflet montre comment une représentation peut produire une illusion et organiser le désir."
      }
    ],
    "citationApa": "Ovide. (1866). <cite>Les Métamorphoses</cite> (É. Gros, trad., livre III, épisode de Narcisse).",
    "translator": "Étienne Gros",
    "relatedTexts": [
      {
        "id": "flaubert-madame-bovary-lectures-imaginaire",
        "kind": "proche",
        "label": "Flaubert — Quand les livres fabriquent le désir d’Emma",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "platon-mythe-androgyne-desir",
        "kind": "proche",
        "label": "Platon — Le désir amoureux poursuit l’unité perdue",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "La recherche de soi",
      "subtheme": "Les métamorphoses du moi",
      "tags": [
        "image de soi",
        "identité",
        "désir",
        "illusion"
      ]
    },
    "cardMeta": "Les métamorphoses du moi",
    "sections": [
      "mythologie",
      "philosophie"
    ],
    "work": "Métamorphoses — livre III, Narcisse",
    "publication": "Ier siècle, trad. Étienne Gros, 1866",
    "sourceUrl": "https://fr.wikisource.org/wiki/Les_M%C3%A9tamorphoses,_traduction_Gros",
    "paragraphs": [
      "Il y avait une limpide fontaine aux ondes argentées. […] Narcisse s’étend sur la rive, fatigué de la chasse et épuisé par la chaleur.",
      "Ravi de la beauté du site et de la limpidité de la source, il veut étancher sa soif ; mais une autre soif se déclare. Tandis qu’il boit, épris de son image qui frappe ses regards, il aime une ombre vaine et lui prête un corps.",
      "Il reste en extase et immobile devant son portrait : on dirait une statue en marbre de Paros.",
      "Ignorant ce qu’il voit, il brûle pour ce qu’il voit ; et la même erreur qui trompe ses yeux les excite."
    ],
    "authorMeta": "(43 av. J.-C.–17/18 ap. J.-C.) · poète latin",
    "author": "Ovide",
    "authorTag": "Ovide",
    "themes": [
      "Conscience",
      "Désir",
      "Vérité"
    ],
    "section": "mythologie"
  },
  "sun-tzu-dissensions-rumeur": {
    "title": "Agir sur les esprits avant de combattre",
    "description": "Peut-on exercer une violence efficace sans combattre directement ?",
    "pedagogicalHook": "Sun Tzu élargit la notion de violence : agir sur l’information, la confiance et la cohésion peut produire des effets stratégiques sans combat frontal.",
    "context": "<strong>Situation.</strong> Dans le treizième article de la traduction d’Amiot, Sun Tzu insiste sur la connaissance de l’adversaire et l’emploi de différents types d’agents. La violence militaire est précédée et parfois remplacée par une action indirecte sur la confiance, la décision et la cohésion. <strong>Enjeu.</strong> Peut-on exercer une violence efficace sans combattre directement ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les moyens d’agir sur l’adversaire qui ne relèvent pas du choc militaire direct."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : faire de la connaissance, des agents et de la désorganisation de la confiance des moyens d’action avant la bataille."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>combat direct</strong> et <strong>action indirecte</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi la connaissance de l’ennemi est-elle une arme ?",
      "En quoi la dissension permet-elle d’obtenir des effets violents sans affrontement direct ?",
      "Quelle place l’information et la désinformation occupent-elles dans la stratégie ?"
    ],
    "hlpQuestion": "Peut-on exercer une violence efficace sans combattre directement ?",
    "problematisations": [
      "La guerre commence-t-elle avant le premier acte de violence physique ?",
      "L’information peut-elle être une arme aussi décisive que la force matérielle ?"
    ],
    "keywords": [
      "information",
      "dissension",
      "stratégie",
      "violence"
    ],
    "hlpOppositions": [
      {
        "left": "combat direct",
        "right": "action indirecte"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [
      {
        "level": "Première",
        "object": "Les pouvoirs de la parole",
        "subtheme": "Les séductions de la parole",
        "reason": "Rumeurs, informations et dissensions agissent indirectement sur les croyances et les décisions de l’adversaire."
      }
    ],
    "citationApa": "Sun Tzu. (1772). <cite>Art militaire des Chinois</cite> (J.-M. Amiot, trad., XIII : « De la manière d’employer les dissensions »).",
    "translator": "Joseph-Marie Amiot",
    "relatedTexts": [
      {
        "id": "shakespeare-othello-iago-jalousie",
        "kind": "proche",
        "label": "Shakespeare — Iago : faire naître le soupçon sans l’affirmer",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "gracian-homme-cour-faible-chacun",
        "kind": "proche",
        "label": "Gracián — Connaître le faible d’autrui pour orienter sa volonté",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "tacite-annales-claude-integration",
        "kind": "proche",
        "label": "Tacite — L’histoire au service d’une décision politique",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Terminale",
      "object": "L’humanité en question",
      "subtheme": "Histoire et violence",
      "tags": [
        "information",
        "dissension",
        "stratégie",
        "violence"
      ]
    },
    "cardMeta": "Histoire et violence",
    "sections": [
      "autres",
      "philosophie"
    ]
  },
  "seneque-colere-juge-medecin": {
    "title": "Punir sans colère : la raison contre la vengeance",
    "description": "Peut-on punir justement sans colère ?",
    "pedagogicalHook": "Sénèque distingue nettement punir et se venger : une peine juste doit viser un effet rationnel plutôt que satisfaire la colère.",
    "context": "<strong>Situation.</strong> Sénèque combat l’idée selon laquelle la colère serait utile pour rendre la justice. Le magistrat doit corriger, prévenir et protéger comme le médecin cherche à soigner ; même la peine extrême ne doit pas être motivée par le désir de faire souffrir. <strong>Enjeu.</strong> Peut-on punir justement sans colère ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez le but que Sénèque assigne à la peine et ce qu’il refuse à la colère."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : remplacer le modèle du vengeur par celui du médecin, puis mesurer la peine à son utilité rationnelle."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>punition</strong> et <strong>vengeance</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Pourquoi Sénèque compare-t-il le magistrat au médecin ?",
      "Quelle différence fait-il entre punir et se venger ?",
      "Une peine peut-elle être rationnelle si elle implique de faire souffrir ?"
    ],
    "hlpQuestion": "Peut-on punir justement sans colère ?",
    "problematisations": [
      "La peine peut-elle être juste si elle procure satisfaction à celui qui punit ?",
      "Punir doit-il viser le coupable, la société ou la restauration d’une norme ?"
    ],
    "keywords": [
      "peine",
      "colère",
      "raison",
      "vengeance"
    ],
    "hlpOppositions": [
      {
        "left": "punition",
        "right": "vengeance"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [
      {
        "level": "Terminale",
        "object": "L’humanité en question",
        "subtheme": "Histoire et violence",
        "reason": "Le texte permet de distinguer la violence punitive rationnellement encadrée de la vengeance passionnelle."
      }
    ],
    "citationApa": "Sénèque. (1860). <cite>De la colère</cite> (J. Baillard, trad., livre I, § VI).",
    "translator": "Joseph Baillard",
    "relatedTexts": [
      {
        "id": "pascal-force-justice",
        "kind": "proche",
        "label": "Pascal — Justice et force : légitimer ou imposer ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "corneille-cinna-clemence-auguste",
        "kind": "proche",
        "label": "Corneille — « Soyons amis, Cinna » : le pardon du souverain agit",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "epictete-manuel-46-vivre-principes",
        "kind": "proche",
        "label": "Épictète — Transmettre par l’exemple plutôt que par le discours",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "cardMeta": "Justice · peine · raison",
    "sections": [
      "philosophie"
    ]
  },
  "flaubert-madame-bovary-lectures-imaginaire": {
    "title": "Quand les livres fabriquent le désir d’Emma",
    "description": "Comment les représentations façonnent-elles nos désirs ?",
    "pedagogicalHook": "Emma permet d’étudier le pouvoir concret des représentations : les livres ne remplissent pas seulement l’imagination, ils organisent ce qu’elle attend de sa vie.",
    "context": "<strong>Situation.</strong> Flaubert revient sur l’éducation d’Emma au couvent. Romans, chansons, gravures religieuses et romantiques lui fournissent des formes toutes faites pour éprouver l’amour, la mélancolie et l’aventure. Ses désirs se construisent ainsi à travers des représentations déjà rencontrées dans les livres. <strong>Enjeu.</strong> Comment les représentations façonnent-elles nos désirs ?",
    "readingGuide": [
      {
        "label": "1 · Repérer",
        "text": "Repérez les livres, images et clichés qui fournissent à Emma les modèles de ce qu’elle désire."
      },
      {
        "label": "2 · Analyser",
        "text": "Suivez le mouvement du passage : accumuler livres, images et clichés, puis montrer comment ils deviennent les formes mêmes dans lesquelles Emma désire."
      },
      {
        "label": "3 · Interpréter",
        "text": "Mettez en tension <strong>réel</strong> et <strong>représentation</strong> avant de répondre à la question centrale."
      }
    ],
    "readingQuestions": [
      "Comment les lectures d’Emma transforment-elles ce qu’elle attend de l’existence ?",
      "Pourquoi Flaubert insiste-t-il autant sur les images, objets et clichés des livres ?",
      "L’imagination enrichit-elle ici le réel ou rend-elle Emma incapable de l’accepter ?"
    ],
    "hlpQuestion": "Comment les représentations façonnent-elles nos désirs ?",
    "problematisations": [
      "Nos désirs sont-ils personnels lorsque leurs formes nous viennent des récits et des images ?",
      "L’imagination nous ouvre-t-elle le monde ou nous rend-elle insatisfaits du réel ?"
    ],
    "keywords": [
      "représentation",
      "imagination",
      "lecture",
      "désir"
    ],
    "hlpOppositions": [
      {
        "left": "réel",
        "right": "représentation"
      }
    ],
    "hlpTier": "transversal",
    "hlpConnections": [
      {
        "level": "Terminale",
        "object": "La recherche de soi",
        "subtheme": "Les métamorphoses du moi",
        "reason": "Les représentations intériorisées transforment progressivement la manière dont Emma se comprend et désire sa propre vie."
      }
    ],
    "citationApa": "Flaubert, G. (1857). <cite>Madame Bovary</cite> (première partie, chap. VI).",
    "translator": "",
    "relatedTexts": [
      {
        "id": "ovide-narcisse-reflet-desir-identite",
        "kind": "proche",
        "label": "Ovide — Narcisse : se voir sans se connaître",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "rousseau-julie-lettre-amour-sincerite",
        "kind": "proche",
        "label": "Rousseau — Une parole trop travaillée peut-elle être sincère ?",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      },
      {
        "id": "ronsard-mignonne-rose-carpe-diem",
        "kind": "proche",
        "label": "Ronsard — Séduire en transformant la rose en argument",
        "relation": "À mettre en regard pour préciser une différence de pouvoir, de stratégie ou de rapport à la parole."
      }
    ],
    "hlp": {
      "level": "Première",
      "object": "Les représentations du monde",
      "subtheme": "Décrire, figurer, imaginer",
      "tags": [
        "représentation",
        "imagination",
        "lecture",
        "désir"
      ]
    },
    "cardMeta": "Décrire, figurer, imaginer"
  }
};
  Object.entries(HLP_ENRICHMENTS_2026).forEach(([id, patch]) => {
    const item = TEXTS.find((text) => text.id === id);
    if (!item) return;
    Object.assign(item, patch);
    if (patch.sections) item.sections = [...new Set(patch.sections)];
    if (item.hlp) item.hlp.tags = [...(patch.keywords || item.hlp.tags || [])].slice(0, 4);
  });

  TEXTS.forEach((item) => {
    if (!item.relatedTexts?.length) return;
    const seen = new Set();
    item.relatedTexts = item.relatedTexts.map((related) => ({
      ...related,
      id:HLP_CANONICAL_REMAP_2026[related.id] || related.id
    })).filter((related) => related.id !== item.id && !seen.has(related.id) && seen.add(related.id));
  });

  const HLP_ESSENTIAL_IDS_2026 = [
  "ciceron-verrines-sthenius",
  "demosthene-premiere-philippique-agir",
  "eschyle-oreste-tribunal-justice",
  "hippocrate-serment",
  "la-boetie-servitude-volontaire-ne-plus-servir",
  "la-fontaine-loup-agneau-force-raison",
  "moliere-dom-juan-detourner-langage",
  "pascal-force-justice",
  "platon-gorgias-plaire-rendre-meilleur",
  "roman-renart-chantecler-flatterie",
  "shakespeare-othello-iago-jalousie",
  "sophocle-antigone-lois-non-ecrites",
  "thucydide-pericles-oraison-funebre",
  "voltaire-calas-sirven-plaidoyer"
];
  // END HLP 2026 — global editorial audit

  const HLP_PROGRAM = {
  "Première": {
    "Les pouvoirs de la parole": [
      "L’art de la parole",
      "L’autorité de la parole",
      "Les séductions de la parole"
    ],
    "Les représentations du monde": [
      "Découverte du monde et pluralité des cultures",
      "Décrire, figurer, imaginer",
      "L’homme et l’animal"
    ]
  },
  "Terminale": {
    "La recherche de soi": [
      "Éducation, transmission et émancipation",
      "Les expressions de la sensibilité",
      "Les métamorphoses du moi"
    ],
    "L’Humanité en question": [
      "Création, continuités et ruptures",
      "Histoire et violence",
      "L’humain et ses limites"
    ]
  }
};
  const HLP_PATHS = [
  {
    "id": "hlp-pouvoirs-art",
    "level": "Première",
    "theme": "Les pouvoirs de la parole",
    "subtheme": "L’art de la parole",
    "intro": "De l’apprentissage de l’orateur à la parole judiciaire et politique : construire un discours qui fait comprendre, juger et agir.",
    "texts": [
      "tacite-dialogue-orateurs-formation",
      "demosthene-premiere-philippique-agir",
      "ciceron-verrines-sthenius",
      "salluste-memmius-liberte",
      "tacite-annales-claude-integration",
      "voltaire-calas-sirven-plaidoyer"
    ]
  },
  {
    "id": "hlp-pouvoirs-autorite",
    "level": "Première",
    "theme": "Les pouvoirs de la parole",
    "subtheme": "L’autorité de la parole",
    "intro": "Du droit de prendre la parole à la parole qui engage, institue, commande, légitime ou résiste à une autre autorité.",
    "texts": [
      "chanson-roland-droit-parole",
      "hippocrate-serment",
      "eschyle-eumenides-instituer-tribunal",
      "sophocle-antigone-lois-non-ecrites",
      "thucydide-pericles-oraison-funebre",
      "corneille-cinna-clemence-auguste",
      "la-boetie-servitude-volontaire-ne-plus-servir",
      "pascal-justice-force",
      "la-fontaine-loup-agneau-force-raison",
      "racine-plaideurs-aristote-autorite",
      "hugo-ruy-blas-valet-commandement"
    ]
  },
  {
    "id": "hlp-pouvoirs-seductions",
    "level": "Première",
    "theme": "Les pouvoirs de la parole",
    "subtheme": "Les séductions de la parole",
    "intro": "Comprendre comment la parole agit sur les désirs, l’amour-propre et le plaisir : de la flatterie rhétorique à la manipulation explicite.",
    "texts": [
      "platon-gorgias-plaire-rendre-meilleur",
      "gracian-homme-cour-faible-chacun",
      "roman-renart-chantecler-flatterie",
      "shakespeare-othello-iago-jalousie",
      "moliere-dom-juan-detourner-langage",
      "la-rochefoucauld-maximes-conversation-vanite",
      "ronsard-mignonne-rose-carpe-diem",
      "rousseau-julie-lettre-amour-sincerite",
      "laclos-liaisons-lettre-56-tourvel"
    ]
  },
  {
    "id": "hlp-representations-pluralite",
    "level": "Première",
    "theme": "Les représentations du monde",
    "subtheme": "Découverte du monde et pluralité des cultures",
    "intro": "Rencontrer d’autres peuples et d’autres manières de vivre pour interroger l’ethnocentrisme, la conquête et les catégories par lesquelles une culture juge les autres.",
    "texts": [
      "lery-etonnement-mutuel-tupinambas",
      "montaigne-cannibales-barbarie-europeenne",
      "lascasas-violence-conquete-indes",
      "bougainville-rencontre-tahiti",
      "diderot-tahitien-colonisation",
      "montaigne-coches-civilisation-conquete",
      "montesquieu-education-femmes-nature-culture",
      "locke-propriete-travail-nature"
    ]
  },
  {
    "id": "hlp-representations-decrire",
    "level": "Première",
    "theme": "Les représentations du monde",
    "subtheme": "Décrire, figurer, imaginer",
    "intro": "Comprendre comment sciences, récits, utopies et classifications construisent des mondes possibles et transforment notre manière de voir le réel.",
    "texts": [
      "bruno-univers-infini",
      "voltaire-micromegas-infiniment-petit",
      "more-utopia-monde-egalitaire",
      "bacon-maison-salomon-science-utopie",
      "marivaux-ile-esclaves-monde-envers",
      "diderot-alembert-projet-encyclopedique",
      "flaubert-madame-bovary-lectures-imaginaire"
    ]
  },
  {
    "id": "hlp-representations-animal",
    "level": "Première",
    "theme": "Les représentations du monde",
    "subtheme": "L’homme et l’animal",
    "intro": "Mettre à l’épreuve la frontière entre l’homme et l’animal : pensée, langage, morale, domestication et devoirs envers les êtres sensibles.",
    "texts": [
      "descartes-animal-machine-instinct",
      "lafontaine-ingeniosite-animale",
      "montaigne-animaux-communication",
      "lamettrie-animaux-morale-remords",
      "buffon-cheval-domestication-servitude",
      "voltaire-chapon-poularde-cruaute",
      "montaigne-devoir-humanite-animaux"
    ]
  },
  {
    "id": "hlp-recherche-education",
    "level": "Terminale",
    "theme": "La recherche de soi",
    "subtheme": "Éducation, transmission et émancipation",
    "intro": "Comprendre comment une formation, un maître ou un exemple peuvent transformer le sujet et le rendre plus autonome.",
    "texts": [
      "epictete-manuel-46-vivre-principes"
    ]
  },
  {
    "id": "hlp-recherche-sensibilite",
    "level": "Terminale",
    "theme": "La recherche de soi",
    "subtheme": "Les expressions de la sensibilité",
    "intro": "Explorer les formes par lesquelles le sujet éprouve, exprime et découvre ses émotions et ses passions.",
    "texts": [
      "sappho-fragment-31-parole-corps",
      "louise-labe-sonnet-8-je-vis-je-meurs",
      "racine-phedre-aveu-hippolyte"
    ]
  },
  {
    "id": "hlp-recherche-metamorphoses",
    "level": "Terminale",
    "theme": "La recherche de soi",
    "subtheme": "Les métamorphoses du moi",
    "intro": "Interroger les transformations de l’identité, de l’image de soi et du rapport que le sujet entretient avec lui-même.",
    "texts": [
      "ovide-narcisse-reflet"
    ]
  },
  {
    "id": "hlp-humanite-histoire-violence",
    "level": "Terminale",
    "theme": "L’humanité en question",
    "subtheme": "Histoire et violence",
    "intro": "Examiner les formes directes et indirectes de la violence historique, de la guerre à l’action sur les esprits.",
    "texts": [
      "sun-tzu-dissensions-rumeur"
    ]
  }
];

  HLP_PATHS.forEach((path) => {
    path.texts = [...new Set(path.texts.map((id) => HLP_CANONICAL_REMAP_2026[id] || id))];
  });
  HLP_PATHS.unshift({
    id:"hlp-pouvoirs-parole",
    label:"HLP Première · Les pouvoirs de la parole — parcours complet",
    level:"Première",
    theme:"Les pouvoirs de la parole",
    subtheme:"Parcours complet",
    intro:"Un parcours progressif en 26 textes : apprendre à construire une parole, comprendre d’où vient son autorité, puis analyser ses pouvoirs de séduction et de manipulation.",
    texts:["ciceron-verrines-sthenius", "tacite-dialogue-orateurs-formation", "demosthene-premiere-philippique-agir", "tacite-annales-claude-integration", "salluste-memmius-liberte", "voltaire-calas-sirven-plaidoyer", "hippocrate-serment", "eschyle-oreste-tribunal-justice", "sophocle-antigone-lois-non-ecrites", "chanson-roland-droit-parole", "thucydide-pericles-oraison-funebre", "corneille-cinna-clemence-auguste", "la-boetie-servitude-volontaire-ne-plus-servir", "pascal-force-justice", "la-fontaine-loup-agneau-force-raison", "racine-plaideurs-aristote-autorite", "hugo-ruy-blas-valet-commandement", "platon-gorgias-plaire-rendre-meilleur", "gracian-homme-cour-faible-chacun", "roman-renart-chantecler-flatterie", "shakespeare-othello-iago-jalousie", "moliere-dom-juan-detourner-langage", "la-rochefoucauld-maximes-conversation-vanite", "ronsard-mignonne-rose-carpe-diem", "rousseau-julie-lettre-amour-sincerite", "laclos-liaisons-lettre-56-tourvel"],
    groups:[
  {
    "kind": "1 · L’art de la parole",
    "question": "Comment construire une parole capable de convaincre et de faire agir ?",
    "note": "Former l’orateur, organiser les preuves, mobiliser l’histoire et rendre une cause visible.",
    "texts": [
      "ciceron-verrines-sthenius",
      "tacite-dialogue-orateurs-formation",
      "demosthene-premiere-philippique-agir",
      "tacite-annales-claude-integration",
      "salluste-memmius-liberte",
      "voltaire-calas-sirven-plaidoyer"
    ]
  },
  {
    "kind": "2 · L’autorité de la parole",
    "question": "Pourquoi certaines paroles engagent-elles, instituent-elles ou commandent-elles ?",
    "note": "Du serment à la loi, du pardon souverain à la désobéissance : étudier la force attachée au statut, à l’institution et à la légitimité.",
    "texts": [
      "hippocrate-serment",
      "eschyle-oreste-tribunal-justice",
      "sophocle-antigone-lois-non-ecrites",
      "chanson-roland-droit-parole",
      "thucydide-pericles-oraison-funebre",
      "corneille-cinna-clemence-auguste",
      "la-boetie-servitude-volontaire-ne-plus-servir",
      "pascal-force-justice",
      "la-fontaine-loup-agneau-force-raison",
      "racine-plaideurs-aristote-autorite",
      "hugo-ruy-blas-valet-commandement"
    ]
  },
  {
    "kind": "3 · Les séductions de la parole",
    "question": "Comment une parole agit-elle sur le désir, l’amour-propre et les croyances ?",
    "note": "De la flatterie à l’insinuation, comparer persuasion, sincérité, stratégie et manipulation.",
    "texts": [
      "platon-gorgias-plaire-rendre-meilleur",
      "gracian-homme-cour-faible-chacun",
      "roman-renart-chantecler-flatterie",
      "shakespeare-othello-iago-jalousie",
      "moliere-dom-juan-detourner-langage",
      "la-rochefoucauld-maximes-conversation-vanite",
      "ronsard-mignonne-rose-carpe-diem",
      "rousseau-julie-lettre-amour-sincerite",
      "laclos-liaisons-lettre-56-tourvel"
    ]
  }
]
  });

  HLP_PATHS.unshift({
    id:"hlp-representations-monde",
    label:"HLP Première · Les représentations du monde — parcours complet",
    level:"Première",
    theme:"Les représentations du monde",
    subtheme:"Parcours complet",
    intro:"Un parcours en trois mouvements : découvrir la pluralité des cultures, comprendre comment nous décrivons et imaginons le monde, puis interroger la frontière entre l’homme et l’animal.",
    texts:["lery-etonnement-mutuel-tupinambas", "montaigne-cannibales-barbarie-europeenne", "lascasas-violence-conquete-indes", "bougainville-rencontre-tahiti", "diderot-tahitien-colonisation", "montaigne-coches-civilisation-conquete", "montesquieu-education-femmes-nature-culture", "locke-propriete-travail-nature", "bruno-univers-infini", "voltaire-micromegas-infiniment-petit", "more-utopia-monde-egalitaire", "bacon-maison-salomon-science-utopie", "marivaux-ile-esclaves-monde-envers", "diderot-alembert-projet-encyclopedique", "flaubert-madame-bovary-lectures-imaginaire", "descartes-animal-machine-instinct", "lafontaine-ingeniosite-animale", "montaigne-animaux-communication", "lamettrie-animaux-morale-remords", "buffon-cheval-domestication-servitude", "voltaire-chapon-poularde-cruaute", "montaigne-devoir-humanite-animaux"],
    groups:[
      {
        kind:"1 · Découverte du monde et pluralité des cultures",
        question:"Comment la rencontre d’autres mondes transforme-t-elle le regard que nous portons sur le nôtre ?",
        note:"Du premier contact à la critique de la conquête : décentrement, ethnocentrisme, propriété et pluralité des coutumes.",
        texts:["lery-etonnement-mutuel-tupinambas", "bougainville-rencontre-tahiti", "montaigne-cannibales-barbarie-europeenne", "lascasas-violence-conquete-indes", "diderot-tahitien-colonisation", "montaigne-coches-civilisation-conquete", "montesquieu-education-femmes-nature-culture", "locke-propriete-travail-nature"]
      },
      {
        kind:"2 · Décrire, figurer, imaginer",
        question:"Comment les représentations construisent-elles des mondes possibles et modifient-elles notre perception du réel ?",
        note:"Univers infini, changement d’échelle, utopies, encyclopédie et imaginaire littéraire : représenter le monde, c’est déjà l’organiser.",
        texts:["bruno-univers-infini", "voltaire-micromegas-infiniment-petit", "more-utopia-monde-egalitaire", "bacon-maison-salomon-science-utopie", "marivaux-ile-esclaves-monde-envers", "diderot-alembert-projet-encyclopedique", "flaubert-madame-bovary-lectures-imaginaire"]
      },
      {
        kind:"3 · L’homme et l’animal",
        question:"Quelles frontières pouvons-nous encore tracer entre l’être humain et les autres animaux ?",
        note:"De l’animal-machine aux devoirs d’humanité : pensée, communication, morale, domestication et cruauté.",
        texts:["descartes-animal-machine-instinct", "lafontaine-ingeniosite-animale", "montaigne-animaux-communication", "lamettrie-animaux-morale-remords", "buffon-cheval-domestication-servitude", "voltaire-chapon-poularde-cruaute", "montaigne-devoir-humanite-animaux"]
      }
    ]
  });

  // END HLP 2026 SELECTED TEXTS

  const SECTION_LABELS = { philosophie:"Philosophie", mythologie:"Mythologie", theologie:"Théologie", autres:"Autres" };
  const SECTION_SYMBOLS = { philosophie:"φ", mythologie:"Μ", theologie:"✦", autres:"—" };
  const READING_PATHS = [
    {
      id:"art",
      label:"L’art : œuvre, création, imitation, vérité et goût",
      texts:[
        "arendt-oeuvre-art-duree-monde",
        "alain-artiste-artisan-idee-oeuvre",
        "kant-genie-regles-art",
        "nietzsche-culte-genie",
        "hegel-art-imitation-nature",
        "wilde-nature-imite-art",
        "platon-art-imitation-eloigne-vrai",
        "heidegger-art-devoile-verite-souliers",
        "kant-antinomie-gout",
        "hume-norme-gout-delicatesse"
      ]
    },
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
    },
    {
      id:"temps",
      label:"Le temps : mesure, durée, existence et délivrance",
      texts:[
        "augustin-temps-creation-monde",
        "aristote-temps-nombre-mouvement",
        "kant-temps-forme-a-priori",
        "bergson-duree-espace",
        "pascal-divertissement-condition",
        "pascal-bonheur-avenir",
        "sartre-existence-precede-essence",
        "nietzsche-eternel-retour",
        "bouddha-sortir-cycle-renaissances"
      ]
    },
    {
      id:"langage",
      label:"Le langage : pensée, signes, monde, action et dialogue",
      texts:[
        "descartes-langage-pensee",
        "benveniste-communication-animale-langage-humain",
        "saussure-signe-linguistique-arbitraire",
        "cassirer-langage-reel-construction",
        "nietzsche-langue-conception-monde",
        "zamenhof-esperanto-langue-artificielle",
        "sartre-langage-poesie-fin",
        "austin-mots-accomplir-actions",
        "platon-rhetorique-puissance-dialogue",
        "levinas-parler-esclave-egal"
      ]
    }
    ,
    {
      id:"devoir",
      label:"Le devoir : contrainte, obligation, fondement et bonheur",
      texts:[
        "platon-glaucon-devoir-contrainte",
        "pascal-coutumes-conventions-justice",
        "kant-raison-volonte-bonne",
        "kant-agir-par-devoir",
        "kant-humanite-fin-en-soi",
        "schopenhauer-pitie-fondement-morale",
        "mill-qualite-plaisirs-morale",
        "kant-morale-dignite-bonheur",
        "seneque-vie-vertueuse"
      ]
    }
    ,
    {
      id:"justice",
      label:"La justice : nature, loi, égalité et désobéissance",
      texts:[
        "platon-callicles-loi-nature-justice",
        "sophocle-antigone-lois-non-ecrites",
        "pascal-force-justice",
        "kant-justice-instituee-imparfaite",
        "thomas-more-utopie-egalite",
        "kant-societe-nations-justice",
        "rawls-justice-equite-inegalites",
        "kant-desobeissance-loi-inconditionnelle",
        "thoreau-desobeir-lois-injustes",
        "pascal-coutumes-conventions-justice",
        "platon-glaucon-devoir-contrainte"
      ]
    }
    ,
    {
      id:"verite",
      label:"La vérité : démonstration, réel, scepticisme et pratique",
      texts:[
        "aristote-demonstration-syllogisme-scientifique",
        "pascal-principes-demonstration-indemontrables",
        "zenon-mouvement-demonstration-absurde",
        "kant-existence-pas-predicat",
        "aristote-verite-correspondance-reel",
        "kant-verite-correspondance-diallele",
        "sextus-empiricus-verite-hors-portee",
        "nietzsche-logique-survie-verite",
        "bergson-verite-action-pragmatisme",
        "platon-doute-haine-raison",
        "epictete-pratique-avant-demonstration",
        "krishnamurti-bonheur-sans-recherche"
      ]
    }
    ,
    {
      id:"conscience",
      label:"La conscience : connaissance de soi, identité et déterminations",
      texts:[
        "platon-connais-toi-toi-meme",
        "schopenhauer-sujet-inconnaissable",
        "descartes-cogito-chose-pense",
        "locke-identite-conscience-memoire",
        "pascal-moi-introuvable",
        "leibniz-petites-perceptions",
        "nietzsche-conscience-communication-gregaire",
        "marx-conscience-vie-materielle",
        "freud-trois-blessures-narcissiques",
        "freud-inconscient-hypothese"
      ]
    },
    {
      id:"inconscient",
      label:"L’inconscient : hypothèse, décentrement, interprétation et critiques",
      texts:[
        "leibniz-petites-perceptions",
        "freud-trois-blessures-narcissiques",
        "freud-reve-rebus",
        "freud-inconscient-hypothese",
        "sartre-inconscient-mauvaise-foi",
        "wittgenstein-inconscient-mythe",
        "popper-psychanalyse-non-scientifique"
      ]
    }
  ];

  const LINKED_TEXT_SETS = [
    {id:"art-objet-creation",kind:"dialogue",label:"Grande controverse",title:"L’œuvre d’art est-elle un objet technique ?",description:"Usage ou création.",texts:["arendt-oeuvre-art-duree-monde","alain-artiste-artisan-idee-oeuvre"]},
    {id:"art-genie-regles",kind:"dialogue",label:"Grande controverse",title:"Le génie obéit-il à des règles ?",description:"Nature ou travail.",texts:["kant-genie-regles-art","nietzsche-culte-genie"]},
    {id:"art-nature-imitation",kind:"dialogue",label:"Grande controverse",title:"L’art doit-il imiter la nature ?",description:"Copie ou regard créateur.",texts:["hegel-art-imitation-nature","wilde-nature-imite-art"]},
    {id:"art-verite",kind:"dialogue",label:"Grande controverse",title:"L’art éloigne-t-il du vrai ou le dévoile-t-il ?",description:"Simulacre ou dévoilement.",texts:["platon-art-imitation-eloigne-vrai","heidegger-art-devoile-verite-souliers"]},
    {id:"art-gout",kind:"dialogue",label:"Grande controverse",title:"Peut-on discuter des goûts ?",description:"Accord ou finesse du jugement.",texts:["kant-antinomie-gout","hume-norme-gout-delicatesse"]},
    {id:"identite-sujet",kind:"dialogue",label:"Grande controverse",title:"Qu’est-ce qui fait l’identité du sujet ?",description:"Connaissance de soi, cogito, mémoire et moi.",texts:["platon-connais-toi-toi-meme","schopenhauer-sujet-inconnaissable","descartes-cogito-chose-pense","locke-identite-conscience-memoire","pascal-moi-introuvable","marx-conscience-vie-materielle"]},
    {id:"existence-inconscient",kind:"dialogue",label:"Grande controverse",title:"Peut-on prouver l’existence de l’inconscient ?",description:"Hypothèse, critique et réfutabilité.",texts:["freud-inconscient-hypothese","sartre-inconscient-mauvaise-foi","wittgenstein-inconscient-mythe","popper-psychanalyse-non-scientifique"]},
    {id:"freud-reve-inconscient",kind:"same-author",label:"Même auteur",title:"Freud : rêve, moi et inconscient",description:"Rêve, décentrement du moi et inconscient.",texts:["freud-reve-rebus","freud-trois-blessures-narcissiques","freud-inconscient-hypothese"]},
    {id:"conscience-sociale",kind:"dialogue",label:"Grande controverse",title:"La conscience est-elle vraiment individuelle ?",description:"Communication, société et conscience.",texts:["nietzsche-conscience-communication-gregaire","marx-conscience-vie-materielle"]},
    {id:"connaissance-soi",kind:"dialogue",label:"Grande controverse",title:"Peut-on vraiment se connaître soi-même ?",description:"Miroir de l’âme et sujet connaissant.",texts:["platon-connais-toi-toi-meme","schopenhauer-sujet-inconnaissable"]},
    {id:"vivant-machine",kind:"dialogue",label:"Grande controverse",title:"Le vivant peut-il être compris comme une machine ?",description:"Mécanisme, organisation et évolution.",texts:["descartes-organisme-machine","kant-machine-modele-insuffisant-vivant","darwin-evolution-vivant-techniques"]},
    {id:"animal-science-morale",kind:"dialogue",label:"Grande controverse",title:"L’animal est-il seulement un objet de connaissance et d’usage ?",description:"Science, souffrance et monde animal.",texts:["claude-bernard-experimentation-animale","bentham-sensibilite-respect-animaux","uexkull-animal-monde-propre"]},
    {id:"matiere-ame-esprit",kind:"dialogue",label:"Grande controverse",title:"La vie et l’esprit sont-ils réductibles à la matière ?",description:"Matière, vie et pensée.",texts:["aristote-vie-matiere-ame","diderot-vie-phenomene-materiel","lucrece-ame-esprit-corporels","bergson-pensee-cerveau"]},
    {id:"technique-homme-machine",kind:"dialogue",label:"Grande controverse",title:"La technique prolonge-t-elle l’homme ou l’aliène-t-elle ?",description:"Outil, machine et aliénation.",texts:["aristote-main-outil-intelligence","mauss-corps-instrument-naturel","marx-alienation-travail-ouvrier","simondon-harmonie-homme-machine"]},
    {id:"travail-liberte",kind:"dialogue",label:"Grande controverse",title:"Faut-il travailler pour être libre ?",description:"Servitude, liberté et temps libéré.",texts:["aristote-travail-manuel-esclave","marx-royaume-liberte-travail","kierkegaard-oisivete-ennui-travail","nietzsche-travail-jeu-creation","arendt-loisirs-monde-travail"]},
    {
      id:"pascal-religion-foi",
      kind:"same-author",
      label:"Même auteur",
      title:"Pascal : misère humaine, cœur et foi",
      description:"Misère humaine, cœur et foi.",
      texts:["pascal-solitude-misere-recherche-dieu","pascal-coeur-raison-foi"]
    },
    {
      id:"religion-mal-theodicee",
      kind:"dialogue",
      label:"Grande controverse",
      title:"Le mal réfute-t-il la bonté de Dieu ?",
      description:"Théodicée et problème du mal.",
      texts:["leibniz-meilleur-mondes-possibles","hume-mal-monde-imparfait"]
    },
    {
      id:"religion-critique-moderne",
      kind:"dialogue",
      label:"Grande controverse",
      title:"Que devient la religion dans la modernité ?",
      description:"Critique et sortie du religieux.",
      texts:["marx-religion-opium-peuple","nietzsche-dieu-mort-valeurs","gauchet-religion-lien-social","sartre-homme-prendre-place-dieu"]
    },
    {
      id:"aristote-verite-demonstration",
      kind:"same-author",
      label:"Même auteur",
      title:"Aristote : démonstration et vérité",
      description:"Démontrer et dire le vrai.",
      texts:["aristote-demonstration-syllogisme-scientifique","aristote-verite-correspondance-reel"]
    },
    {
      id:"kant-verite-demonstration",
      kind:"same-author",
      label:"Même auteur",
      title:"Kant : limites de la démonstration et critère de vérité",
      description:"Existence et critère de vérité.",
      texts:["kant-existence-pas-predicat","kant-verite-correspondance-diallele"]
    },
    {
      id:"kant-justice-trois-textes",
      kind:"same-author",
      label:"Même auteur",
      title:"Kant : droit et justice politique",
      description:"Justice, États et résistance.",
      texts:["kant-justice-instituee-imparfaite","kant-societe-nations-justice","kant-desobeissance-loi-inconditionnelle"]
    },
    {
      id:"kant-devoir-quatre-textes",
      kind:"same-author",
      label:"Même auteur",
      title:"Kant : comprendre le devoir",
      description:"Volonté, devoir et dignité.",
      texts:["kant-raison-volonte-bonne","kant-agir-par-devoir","kant-humanite-fin-en-soi","kant-morale-dignite-bonheur"]
    },
    {
      id:"levinas-stendhal-echo",
      kind:"echo",
      label:"Texte écho",
      title:"Lévinas et Stendhal : au-delà de l’être sensible",
      description:"Altérité et idéalisation.",
      texts:["levinas-caresse-desir-invisible", "stendhal-cristallisation-amour"]
    },
    {
      id:"gorgias-dialogue",
      kind:"sequence",
      label:"Dialogue continu",
      title:"Calliclès puis Socrate",
      description:"Une thèse, puis sa réponse.",
      texts:["platon-callicles-desirs", "platon-socrate-temperance"]
    },
    {
      id:"epicure-seneque",
      kind:"debate",
      label:"Controverse",
      title:"Épicure face à Sénèque",
      description:"Plaisir ou vertu ?",
      texts:["epicure-plaisir-vie-heureuse", "seneque-vie-vertueuse"]
    },
    {
      id:"schopenhauer-diptyque",
      kind:"same-author",
      label:"Même auteur",
      title:"Le diptyque de Schopenhauer",
      description:"Deux faces d’un même pessimisme.",
      texts:["schopenhauer-bien-etre-negation", "schopenhauer-bonheur-absence-souffrance"]
    },
    {
      id:"descartes-morale",
      kind:"same-author",
      label:"Même auteur",
      title:"La morale de Descartes en deux textes",
      description:"Maîtriser ses désirs.",
      texts:["descartes-changer-desirs", "descartes-trois-regles-bonheur"]
    },
    {
      id:"temps-existence",
      kind:"debate",
      label:"Deux rapports au retour",
      title:"Nietzsche face à Bouddha",
      description:"Revenir ou sortir du cycle.",
      texts:["nietzsche-eternel-retour", "bouddha-sortir-cycle-renaissances"]
    }
  ];
  const textUrl = (textOrId) => `/textes/${encodeURIComponent(typeof textOrId === "string" ? textOrId : textOrId.id)}/`;
  window.FV_TEXT_CATALOG = TEXTS;
  window.FV_TEXT_SECTION_LABELS = SECTION_LABELS;
  window.FV_TEXT_PATHS = READING_PATHS;
  window.FV_LINKED_TEXT_SETS = LINKED_TEXT_SETS;
  window.FV_TEXT_URL = textUrl;
  window.FV_CURRENT_PROGRAM_THEMES = CURRENT_PROGRAM_THEMES;
  window.FV_HLP_PROGRAM = HLP_PROGRAM;
  window.FV_HLP_PATHS = HLP_PATHS;
  window.FV_ALL_TEXT_THEMES = [...new Set(TEXTS.flatMap((text) => text.themes || []))];
  const normalize = (value) => value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const collator = new Intl.Collator("fr", { sensitivity:"base" });
  const alphabeticalThemes = (items) => [...items].sort((a,b) => collator.compare(a,b));
  const authorTag = (text) => text.authorTag || (text.author || "").split(/\s+/).slice(-1)[0];
  const sourceTag = (text) => text.sourceTag || text.source || "";
  const textCredit = (text) => text.credit || text.author || text.source || "";
  const textThemes = (text) => text.themes || (text.theme ? [text.theme] : []);
  const textSections = (text) => text.sections || [text.section];
  const textHlpEntries = (text) => [text.hlp, ...(text.hlpConnections || [])].filter(Boolean);
  const hasHlp = (text) => textHlpEntries(text).length > 0;
  const hlpLevel = (text) => text.hlp?.level || text.hlpConnections?.[0]?.level || "";
  const hlpLevelKey = (text) => hlpLevel(text) === "Première" ? "premiere" : hlpLevel(text) === "Terminale" ? "terminale" : "transversal";
  const hlpBadgeLabel = (text) => hlpLevel(text) === "Première" ? "HLP 1re" : hlpLevel(text) === "Terminale" ? "HLP Tle" : "HLP";
  const hlpPathForText = (text) => {
    const entry = text.hlp || text.hlpConnections?.[0] || null;
    if (entry) {
      const groupedSubtheme = HLP_PATHS.find((path) => path.groups?.length && path.level === entry.level && normalize(path.subtheme) === normalize(entry.subtheme));
      if (groupedSubtheme) return groupedSubtheme;
      const groupedObject = HLP_PATHS.find((path) => path.groups?.length && path.level === entry.level && normalize(path.theme) === normalize(entry.object));
      if (groupedObject) return groupedObject;
    }
    return HLP_PATHS.find((path) => (path.texts || []).includes(text.id))
      || HLP_PATHS.find((path) => path.level === hlpLevel(text));
  };
  const hlpCompassUrl = (text) => {
    const path = hlpPathForText(text);
    if (!path) return "/textes/philosophie/boussole/#parcours";
    const params = new URLSearchParams({ parcours:path.id, texte:text.id });
    return `/textes/philosophie/boussole/?${params.toString()}#parcours`;
  };
  const hlpBadge = (text, detail = false) => hasHlp(text) ? `<a class="text-hlp-badge text-hlp-badge--${hlpLevelKey(text)}${detail ? " text-hlp-badge--detail" : ""}" href="${hlpCompassUrl(text)}" title="Voir ce texte dans les parcours HLP de la Boussole philosophique" aria-label="${hlpBadgeLabel(text)} — voir ce texte dans les parcours de lecture HLP de la Boussole philosophique">${hlpBadgeLabel(text)}</a>` : "";
  const HLP_FILTER_PREFIX = "HLP::";
  const HLP_ALL_FILTER = "HLP::ALL";
  const HLP_ESSENTIAL_FILTER = "HLP::ESSENTIAL";
  const hlpFilterValue = (level, object, subtheme = "") => [HLP_FILTER_PREFIX.slice(0,-2), level, object, subtheme].filter(Boolean).join("::");
  const isHlpFilter = (value) => String(value || "").startsWith(HLP_FILTER_PREFIX);
  const hlpFilterLabel = (value) => {
    if (value === HLP_ALL_FILTER) return "Tous les textes HLP";
    if (value === HLP_ESSENTIAL_FILTER) return "Essentiels HLP";
    if (!isHlpFilter(value)) return value;
    const [, level, object, subtheme] = String(value).split("::");
    return subtheme || object || level || "HLP";
  };
  const matchesFilterToken = (text, value) => {
    if (!isHlpFilter(value)) return textThemes(text).includes(value);
    if (value === HLP_ALL_FILTER) return hasHlp(text);
    if (value === HLP_ESSENTIAL_FILTER) return text.hlpTier === "essential";
    const [, level, object, subtheme] = String(value).split("::");
    return textHlpEntries(text).some((entry) => (!level || entry.level === level) && (!object || normalize(entry.object) === normalize(object)) && (!subtheme || normalize(entry.subtheme) === normalize(subtheme)));
  };

  const BIBLE_BOOK_ORDER = [
    "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome",
    "Josué", "Juges", "Ruth", "1 Samuel", "2 Samuel", "1 Rois", "2 Rois",
    "1 Chroniques", "2 Chroniques", "Esdras", "Néhémie", "Tobie", "Judith", "Esther",
    "1 Maccabées", "2 Maccabées", "Job", "Psaumes", "Proverbes", "Qohélet", "Cantique des cantiques",
    "Sagesse", "Ben Sira", "Isaïe", "Jérémie", "Lamentations", "Baruch", "Ézéchiel", "Daniel",
    "Osée", "Joël", "Amos", "Abdias", "Jonas", "Michée", "Nahum", "Habaquq", "Sophonie",
    "Aggée", "Zacharie", "Malachie", "Matthieu", "Marc", "Luc", "Jean", "Actes",
    "Romains", "1 Corinthiens", "2 Corinthiens", "Galates", "Éphésiens", "Philippiens", "Colossiens",
    "1 Thessaloniciens", "2 Thessaloniciens", "1 Timothée", "2 Timothée", "Tite", "Philémon",
    "Hébreux", "Jacques", "1 Pierre", "2 Pierre", "1 Jean", "2 Jean", "3 Jean", "Jude", "Apocalypse"
  ];
  const bibleReferenceKey = (text) => {
    if (!text.bible) return null;
    const label = `${text.sourceTag || ""} ${text.headerReference || ""} ${text.work || ""}`.trim();
    const bookIndex = BIBLE_BOOK_ORDER.findIndex((book) => normalize(label).includes(normalize(book)));
    const reference = text.headerReference || text.work || text.publication || "";
    const numberMatch = reference.match(/(\d+)\s*(?:[,.:]\s*(\d+))?/);
    const chapter = numberMatch ? Number.parseInt(numberMatch[1], 10) : Number.MAX_SAFE_INTEGER;
    const verse = numberMatch?.[2] ? Number.parseInt(numberMatch[2], 10) : 0;
    return [bookIndex < 0 ? BIBLE_BOOK_ORDER.length : bookIndex, chapter, verse];
  };
  const theologySort = (left, right) => {
    const leftBible = bibleReferenceKey(left);
    const rightBible = bibleReferenceKey(right);
    if (leftBible && !rightBible) return -1;
    if (!leftBible && rightBible) return 1;
    if (leftBible && rightBible) {
      for (let index = 0; index < leftBible.length; index += 1) {
        if (leftBible[index] !== rightBible[index]) return leftBible[index] - rightBible[index];
      }
      return collator.compare(left.title, right.title);
    }
    return collator.compare(authorTag(left), authorTag(right)) || collator.compare(left.title, right.title);
  };

  const root = document.querySelector("[data-text-catalog]");
  if (!root) return;

  const rootCatalogPath = /^\/textes\/(?:index\.html)?$/.test(window.location.pathname);
  const fixedSection = rootCatalogPath ? "all" : (document.body.dataset.catalogSection || "all");
  const grid = root.querySelector("[data-text-grid]");
  const count = root.querySelector("[data-text-count]");
  const search = root.querySelector("[data-text-search]");
  const section = root.querySelector("[data-text-section]");
  const theme = root.querySelector("[data-text-theme]");
  const multiThemeEnabled = (fixedSection === "philosophie" || fixedSection === "mythologie" || fixedSection === "theologie" || fixedSection === "autres" || fixedSection === "all") && !!theme && (fixedSection !== "mythologie" || TEXTS.some((text) => textSections(text).includes("mythologie")));
  const MAX_SELECTED_THEMES = fixedSection === "philosophie" || fixedSection === "mythologie" || fixedSection === "theologie" ? 3 : 2;
  const author = root.querySelector("[data-text-author]");
  const source = root.querySelector("[data-text-source]");
  const reset = root.querySelector("[data-text-reset]");
  const tools = root.querySelector(".texts-tools");
  const summary = root.querySelector(".texts-summary");
  const pagination = document.createElement("nav");
  pagination.className = "texts-pagination";
  pagination.setAttribute("aria-label", "Pagination des textes");
  grid.insertAdjacentElement("afterend", pagination);

  const availableSections = new Set(TEXTS.flatMap(textSections));
  availableSections.add("mythologie");
  if (rootCatalogPath) {
    document.body.dataset.catalogSection = "all";
    const heroTitle = document.querySelector(".texts-title");
    const heroIntro = document.querySelector(".texts-intro");
    if (heroTitle) heroTitle.textContent = "Tous les textes";
    if (heroIntro) heroIntro.textContent = "Explorez les textes librement ou affinez la sélection parmi les thèmes et les auteurs déjà disponibles.";
  }

  const sectionTabs = document.querySelector(".texts-section-tabs");
  sectionTabs?.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const match = href.match(/^\/textes\/([^/]+)\/?$/);
    if (match && !availableSections.has(match[1])) link.hidden = true;
    if (rootCatalogPath) {
      if (href === "/textes/" || href === "/textes/index.html") link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  });
  if (sectionTabs) sectionTabs.hidden = availableSections.size < 2;

  if (tools && summary && !root.querySelector(".texts-course-cta")) {
    summary.insertAdjacentHTML("beforebegin", `
      <aside class="texts-course-cta" aria-label="Accompagnement sur un texte">
        <div class="texts-course-cta-copy">
          <strong>Un texte vous résiste ?</strong>
          <span>Je vous aide à le comprendre et à construire une explication solide.</span>
        </div>
        <a class="texts-course-cta-link" href="/#contact">Prendre un cours <span aria-hidden="true">→</span></a>
      </aside>`);
  }

  const sectionTexts = fixedSection === "all" ? TEXTS : TEXTS.filter((text) => textSections(text).includes(fixedSection));
  const authors = [...new Map(sectionTexts.filter((text) => text.author).map((text) => [text.author, { value:text.author, label:authorTag(text) }])).values()]
    .sort((a,b) => collator.compare(a.label,b.label));
  const sources = [...new Map(sectionTexts.filter((text) => text.source).map((text) => [text.source, { value:text.source, label:sourceTag(text) }])).values()]
    .sort((a,b) => collator.compare(a.label,b.label));
  const catalogThemes = alphabeticalThemes(new Set(sectionTexts.flatMap(textThemes)));
  const programThemes = catalogThemes.filter((item) => CURRENT_PROGRAM_THEMES.includes(item));
  const complementaryThemes = catalogThemes.filter((item) => !CURRENT_PROGRAM_THEMES.includes(item));
  const hlpTextsInSection = sectionTexts.filter(hasHlp);
  const hlpFilterGroups = Object.entries(HLP_PROGRAM).map(([level, objects]) => ({
    level,
    objects:Object.entries(objects).map(([object, subthemes]) => ({
      object,
      value:hlpFilterValue(level, object),
      subthemes:subthemes.filter((subtheme) => hlpTextsInSection.some((text) => textHlpEntries(text).some((entry) => entry.level === level && normalize(entry.object) === normalize(object) && normalize(entry.subtheme) === normalize(subtheme))))
        .map((subtheme) => ({ label:subtheme, value:hlpFilterValue(level, object, subtheme) }))
    })).filter((item) => hlpTextsInSection.some((text) => textHlpEntries(text).some((entry) => entry.level === level && normalize(entry.object) === normalize(item.object))))
  })).filter((group) => group.objects.length);

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
      ${complementaryThemes.length ? `<optgroup label="Thèmes complémentaires">${themeOptions(complementaryThemes)}</optgroup>` : ""}
      ${hlpTextsInSection.length ? `<optgroup label="HLP"><option value="${HLP_ALL_FILTER}">Tous les textes HLP</option>${hlpTextsInSection.some((text) => text.hlpTier === "essential") ? `<option value="${HLP_ESSENTIAL_FILTER}">Essentiels HLP</option>` : ""}</optgroup>` : ""}
      ${hlpFilterGroups.map((group) => group.objects.map((object) => `<optgroup label="HLP · ${group.level} · ${object.object}"><option value="${object.value}">Tous — ${object.object}</option>${object.subthemes.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}</optgroup>`).join("")).join("")}`;
  }
  if (author) author.innerHTML = `<option value="all">Tous les auteurs</option>${authors.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}`;
  if (source) source.innerHTML = `<option value="all">Tous les corpus</option>${sources.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}`;

  let selectedThemes = [];
  let themeMulti = null;
  let themeMultiTrigger = null;
  let themeMultiMenu = null;
  let themeMultiSummary = null;
  let themeMultiCount = null;
  let themeMultiSelected = null;
  let themeMultiHint = null;

  const closeThemeMulti = () => {
    if (!themeMulti || !themeMultiTrigger || !themeMultiMenu) return;
    themeMulti.classList.remove("is-open");
    themeMultiTrigger.setAttribute("aria-expanded", "false");
    themeMultiMenu.hidden = true;
  };

  const openThemeMulti = () => {
    if (!themeMulti || !themeMultiTrigger || !themeMultiMenu) return;
    themeMulti.classList.add("is-open");
    themeMultiTrigger.setAttribute("aria-expanded", "true");
    themeMultiMenu.hidden = false;
  };

  const themeCandidateHasResults = (candidateTheme) => {
    const candidateThemes = selectedThemes.includes(candidateTheme)
      ? [...selectedThemes]
      : [...selectedThemes, candidateTheme];
    if (candidateThemes.length > MAX_SELECTED_THEMES) return false;

    const query = normalize(search?.value.trim() || "");
    const selectedSection = fixedSection === "all" ? (section?.value || "all") : fixedSection;
    const selectedAuthor = author?.value || "all";
    const selectedSource = source?.value || "all";

    return TEXTS.some((text) => {
      const themes = textThemes(text);
      const searchableHlp = hasHlp(text) ? `HLP ${textHlpEntries(text).map((entry) => `${entry.level || ""} ${entry.object || ""} ${entry.subtheme || ""} ${(entry.tags || []).join(" ")}`).join(" ")} ${(text.keywords || []).join(" ")} ${text.hlpTier || ""}` : "";
      const searchable = normalize(`${text.title} ${text.familiarIdea || ""} ${text.author || ""} ${text.source || ""} ${themes.join(" ")} ${text.work} ${text.publication} ${text.description} ${searchableHlp} ${(text.readingNotes || []).map((note) => `${note.term || ""} ${note.definition || ""}`).join(" ")}`);
      return (selectedSection === "all" || textSections(text).includes(selectedSection))
        && candidateThemes.every((themeName) => matchesFilterToken(text, themeName))
        && (selectedAuthor === "all" || text.author === selectedAuthor)
        && (selectedSource === "all" || text.source === selectedSource)
        && (!query || searchable.includes(query));
    });
  };

  const updateThemeMultiUi = () => {
    if (!multiThemeEnabled || !themeMulti) return;
    const countThemes = selectedThemes.length;
    if (themeMultiSummary) {
      themeMultiSummary.textContent = countThemes === 0
        ? "Tous les thèmes"
        : selectedThemes.map(hlpFilterLabel).join(" + ");
    }
    if (themeMultiCount) {
      themeMultiCount.hidden = countThemes === 0;
      themeMultiCount.textContent = `${countThemes}/${MAX_SELECTED_THEMES} thèmes`;
    }
    if (themeMultiSelected) {
      themeMultiSelected.hidden = countThemes === 0;
      themeMultiSelected.innerHTML = selectedThemes.map((themeName) => `
        <button class="texts-theme-multi-chip" type="button" data-theme-remove="${themeName}" aria-label="Retirer le thème ${themeName}">
          <span>${hlpFilterLabel(themeName)}</span><i aria-hidden="true">×</i>
        </button>`).join("");
    }

    themeMulti.querySelectorAll("[data-theme-value]").forEach((input) => {
      const value = input.dataset.themeValue;
      const isSelected = selectedThemes.includes(value);
      const isAvailable = isSelected || (countThemes < MAX_SELECTED_THEMES && themeCandidateHasResults(value));
      input.checked = isSelected;
      input.disabled = !isAvailable;
      const option = input.closest(".texts-theme-multi-option");
      if (option) {
        option.hidden = !isAvailable;
        option.classList.toggle("is-selected", isSelected);
      }
    });

    themeMulti.querySelectorAll(".texts-theme-multi-group").forEach((group) => {
      const hasVisibleOption = [...group.querySelectorAll(".texts-theme-multi-option")].some((option) => !option.hidden);
      group.hidden = !hasVisibleOption;
    });

    if (themeMultiHint) {
      themeMultiHint.textContent = countThemes >= MAX_SELECTED_THEMES
        ? `${MAX_SELECTED_THEMES} thèmes sélectionnés · retirez-en un pour en choisir un autre.`
        : `Sélectionnez jusqu’à ${MAX_SELECTED_THEMES} thèmes · seuls les thèmes compatibles restent proposés.`;
    }
    if (theme) theme.value = countThemes === 1 ? selectedThemes[0] : "all";
  };

  if (multiThemeEnabled) {
    theme.hidden = true;
    theme.tabIndex = -1;
    theme.setAttribute("aria-hidden", "true");
    const themeLabel = root.querySelector(`label[for="${theme.id}"]`);
    if (themeLabel && !themeLabel.id) themeLabel.id = `${theme.id}-label`;
    const optionGroup = (label, items) => items.length ? `
      <section class="texts-theme-multi-group" aria-label="${label}">
        <p class="texts-theme-multi-group-title">${label}</p>
        ${items.map((item) => `
          <label class="texts-theme-multi-option">
            <input type="checkbox" value="${item}" data-theme-value="${item}">
            <span>${item}</span>
          </label>`).join("")}
      </section>` : "";

    themeMulti = document.createElement("div");
    themeMulti.className = "texts-theme-multi";
    themeMulti.innerHTML = `
      <button class="texts-theme-multi-trigger" type="button" aria-expanded="false" aria-controls="${theme.id}-menu"${themeLabel ? ` aria-labelledby="${themeLabel.id} ${theme.id}-summary"` : ""}>
        <span class="texts-theme-multi-summary" id="${theme.id}-summary" data-theme-multi-summary>Tous les thèmes</span>
        <span class="texts-theme-multi-count" data-theme-multi-count hidden>0/${MAX_SELECTED_THEMES}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="texts-theme-multi-menu" id="${theme.id}-menu" data-theme-multi-menu hidden>
        <div class="texts-theme-multi-selected" data-theme-multi-selected hidden></div>
        ${optionGroup("Notions au programme de Terminale", programThemes)}
        ${optionGroup("Thèmes complémentaires", complementaryThemes)}
        ${hlpTextsInSection.length ? `<section class="texts-theme-multi-group texts-theme-multi-group--hlp texts-theme-multi-group--hlp-overview" aria-label="Sélection HLP"><p class="texts-theme-multi-group-title">HLP · Sélection</p><label class="texts-theme-multi-option texts-theme-multi-option--hlp"><input type="checkbox" value="${HLP_ALL_FILTER}" data-theme-value="${HLP_ALL_FILTER}"><span>Tous les textes HLP</span></label>${hlpTextsInSection.some((text) => text.hlpTier === "essential") ? `<label class="texts-theme-multi-option texts-theme-multi-option--hlp"><input type="checkbox" value="${HLP_ESSENTIAL_FILTER}" data-theme-value="${HLP_ESSENTIAL_FILTER}"><span>Essentiels HLP</span></label>` : ""}</section>` : ""}
        ${hlpFilterGroups.map((group) => `<section class="texts-theme-multi-group texts-theme-multi-group--hlp texts-theme-multi-group--hlp-${group.level === "Première" ? "premiere" : "terminale"}" aria-label="HLP ${group.level}"><p class="texts-theme-multi-group-title">HLP · ${group.level}</p>${group.objects.map((object) => `<div class="texts-theme-multi-hlp-object"><strong>${object.object}</strong><label class="texts-theme-multi-option texts-theme-multi-option--hlp"><input type="checkbox" value="${object.value}" data-theme-value="${object.value}"><span>Tous les textes</span></label>${object.subthemes.map((item) => `<label class="texts-theme-multi-option texts-theme-multi-option--hlp"><input type="checkbox" value="${item.value}" data-theme-value="${item.value}"><span>${item.label}</span></label>`).join("")}</div>`).join("")}</section>`).join("")}
        <p class="texts-theme-multi-hint" data-theme-multi-hint>Sélectionnez jusqu’à ${MAX_SELECTED_THEMES} thèmes · seuls les thèmes compatibles restent proposés.</p>
      </div>`;
    theme.insertAdjacentElement("afterend", themeMulti);
    themeMultiTrigger = themeMulti.querySelector(".texts-theme-multi-trigger");
    themeMultiMenu = themeMulti.querySelector("[data-theme-multi-menu]");
    themeMultiSummary = themeMulti.querySelector("[data-theme-multi-summary]");
    themeMultiCount = themeMulti.querySelector("[data-theme-multi-count]");
    themeMultiSelected = themeMulti.querySelector("[data-theme-multi-selected]");
    themeMultiHint = themeMulti.querySelector("[data-theme-multi-hint]");

    themeMultiTrigger?.addEventListener("click", () => {
      if (themeMultiMenu?.hidden) openThemeMulti();
      else closeThemeMulti();
    });
    themeLabel?.addEventListener("click", (event) => {
      event.preventDefault();
      themeMultiTrigger?.focus();
      openThemeMulti();
    });
    themeMulti.addEventListener("change", (event) => {
      const input = event.target.closest("[data-theme-value]");
      if (!input) return;
      const value = input.dataset.themeValue;
      if (input.checked) {
        if (!selectedThemes.includes(value) && selectedThemes.length < MAX_SELECTED_THEMES && themeCandidateHasResults(value)) selectedThemes.push(value);
      } else {
        selectedThemes = selectedThemes.filter((item) => item !== value);
      }
      currentPage = 1;
      updateThemeMultiUi();
      render();
    });
    themeMulti.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-theme-remove]");
      if (!remove) return;
      event.preventDefault();
      event.stopPropagation();
      selectedThemes = selectedThemes.filter((item) => item !== remove.dataset.themeRemove);
      currentPage = 1;
      updateThemeMultiUi();
      render();
    });
    document.addEventListener("click", (event) => {
      if (themeMulti && !themeMulti.contains(event.target)) closeThemeMulti();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && themeMulti?.classList.contains("is-open")) {
        closeThemeMulti();
        themeMultiTrigger?.focus();
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const PAGE_SIZE = 20;
  let currentPage = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const setFromQuery = (control, value) => {
    if (!control || !value) return;
    const match = [...control.options].find((option) => normalize(option.value) === normalize(value));
    if (match) control.value = match.value;
  };
  if (fixedSection === "all" && !rootCatalogPath) setFromQuery(section, params.get("section"));
  if (rootCatalogPath && section) section.value = "all";
  if (multiThemeEnabled) {
    selectedThemes = params.getAll("theme")
      .map((value) => isHlpFilter(value) ? value : catalogThemes.find((item) => normalize(item) === normalize(value)))
      .filter((value, index, values) => value && values.indexOf(value) === index)
      .slice(0, MAX_SELECTED_THEMES);
    updateThemeMultiUi();
  } else {
    setFromQuery(theme, params.get("theme"));
  }
  setFromQuery(author, params.get("auteur"));
  setFromQuery(source, params.get("source"));
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

  const formatCardIdea = (value = "") => escapeHtml(value)
    .replace(/&lt;em&gt;/gi, "<em>")
    .replace(/&lt;\/em&gt;/gi, "</em>");

  const card = (text) => {
    const idea = text.cardIdea || text.familiarIdea;
    const title = `${formatCardTitle(text)}${idea ? ` <span class="text-card-familiar-idea">${formatCardIdea(idea)}</span>` : ""}`;
    const cardModifiers = [
      text.cardStyle ? `text-card--${text.cardStyle}` : "",
      idea ? "text-card--with-idea" : "",
      text.cardHeight ? `text-card--${text.cardHeight}` : ""
    ].filter(Boolean).join(" ");
    const destination = textUrl(text);
    const sections = textSections(text);
    const displaySection = fixedSection !== "all" && sections.includes(fixedSection) ? fixedSection : text.section;
    const isDualSection = sections.includes("philosophie") && sections.includes("theologie");
    const sectionSymbols = sections.map((sectionName) => `<span class="text-card-section-symbol text-card-section-symbol--${sectionName}">${SECTION_SYMBOLS[sectionName] || ""}</span>`).join("");
    const rawSectionMeta = isDualSection ? "Philosophie & théologie" : (text.cardMeta || SECTION_LABELS[text.section]);
    const sectionMeta = hasHlp(text) ? String(rawSectionMeta).replace(/^HLP\s*·\s*/i, "") : rawSectionMeta;
    return `
    <article class="text-card text-card--${displaySection}${isDualSection ? " text-card--dual" : ""}${cardModifiers ? ` ${cardModifiers}` : ""}">
      <a class="text-card-cover-link" href="${destination}" data-text-link aria-label="Lire : ${escapeHtml(text.title)}${textCredit(text) ? `, ${escapeHtml(textCredit(text))}` : ""}"></a>
      <p class="text-card-section">${sectionSymbols}<span class="text-card-section-dot" aria-hidden="true">•</span><span class="text-card-section-meta" title="${escapeHtml(sectionMeta)}">${escapeHtml(sectionMeta)}</span>${hlpBadge(text)}</p>
      <h2>${title}</h2>
      <p class="text-card-author">${text.author
        ? `<a href="${catalogUrl("auteur", text.author)}" data-filter-author="${escapeHtml(text.author)}" aria-label="Afficher les textes de ${escapeHtml(text.author)}">${escapeHtml(text.credit || text.author)}</a>`
        : `<a href="/textes/theologie/?source=${encodeURIComponent(text.source)}" data-filter-source="${escapeHtml(text.source || "")}" aria-label="Afficher les textes du corpus ${escapeHtml(text.source || "")}">${escapeHtml(text.source || "")}</a>`} · <cite>${text.work}</cite></p>
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

  const syncFiltersInUrl = (selectedSection, selectedThemeValues, selectedAuthor, selectedSource) => {
    const nextParams = new URLSearchParams();
    if (fixedSection === "all" && selectedSection !== "all") nextParams.set("section", selectedSection);
    selectedThemeValues.forEach((themeName) => nextParams.append("theme", themeName));
    if (selectedAuthor !== "all") nextParams.set("auteur", selectedAuthor);
    if (selectedSource !== "all") nextParams.set("source", selectedSource);
    const searchValue = search?.value.trim();
    if (searchValue) nextParams.set("recherche", searchValue);
    if (currentPage > 1) nextParams.set("page", String(currentPage));
    const queryString = nextParams.toString();
    window.history.replaceState({ textCatalog:true }, "", `${window.location.pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const render = () => {
    if (multiThemeEnabled) updateThemeMultiUi();
    const query = normalize(search?.value.trim() || "");
    const selectedSection = fixedSection === "all" ? (section?.value || "all") : fixedSection;
    const selectedThemeValues = multiThemeEnabled
      ? [...selectedThemes]
      : (theme?.value && theme.value !== "all" ? [theme.value] : []);
    const selectedAuthor = author?.value || "all";
    const selectedSource = source?.value || "all";
    const matchesFilters = (text) => {
      const themes = textThemes(text);
      const searchableHlp = hasHlp(text) ? `HLP ${textHlpEntries(text).map((entry) => `${entry.level || ""} ${entry.object || ""} ${entry.subtheme || ""} ${(entry.tags || []).join(" ")}`).join(" ")} ${(text.keywords || []).join(" ")} ${text.hlpTier || ""}` : "";
      const searchable = normalize(`${text.title} ${text.familiarIdea || ""} ${text.author || ""} ${text.source || ""} ${themes.join(" ")} ${text.work} ${text.publication} ${text.description} ${searchableHlp} ${(text.readingNotes || []).map((note) => `${note.term || ""} ${note.definition || ""}`).join(" ")}`);
      return (selectedSection === "all" || textSections(text).includes(selectedSection))
        && selectedThemeValues.every((themeName) => matchesFilterToken(text, themeName))
        && (selectedAuthor === "all" || text.author === selectedAuthor)
        && (selectedSource === "all" || text.source === selectedSource)
        && (!query || searchable.includes(query));
    };

    const directMatches = TEXTS.filter(matchesFilters);
    const directIds = new Set(directMatches.map((text) => text.id));
    const expandedIds = new Set(directIds);
    const MAX_LINKED_COMPANIONS = 1;
    const linkedCompanionIds = [];
    LINKED_TEXT_SETS.forEach((set) => {
      if (!set.texts.some((id) => directIds.has(id))) return;
      set.texts.forEach((id) => {
        if (linkedCompanionIds.length >= MAX_LINKED_COMPANIONS || directIds.has(id) || linkedCompanionIds.includes(id)) return;
        const companion = TEXTS.find((text) => text.id === id);
        const companionMatchesThemes = companion && selectedThemeValues.every((themeName) => matchesFilterToken(companion, themeName));
        if (companion && companionMatchesThemes && (selectedSection === "all" || textSections(companion).includes(selectedSection))) {
          linkedCompanionIds.push(id);
        }
      });
    });
    linkedCompanionIds.forEach((id) => expandedIds.add(id));

    const results = TEXTS.filter((text) => expandedIds.has(text.id));
    if (fixedSection === "theologie") results.sort(theologySort);
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    syncFiltersInUrl(selectedSection, selectedThemeValues, selectedAuthor, selectedSource);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageResults = results.slice(pageStart, pageStart + PAGE_SIZE);
    const pageIds = new Set(pageResults.map((text) => text.id));
    const groupedIds = new Set();
    const renderedSets = LINKED_TEXT_SETS.flatMap((set) => {
      const availableTexts = set.texts
        .map((id) => TEXTS.find((text) => text.id === id))
        .filter((text) => text && pageIds.has(text.id));
      if (availableTexts.length < 2) return [];

      const texts = [
        ...availableTexts.filter((text) => directIds.has(text.id)),
        ...availableTexts.filter((text) => !directIds.has(text.id))
      ].filter((text, index, items) => items.findIndex((item) => item.id === text.id) === index).slice(0, 2);

      if (texts.length < 2) return [];
      texts.forEach((text) => groupedIds.add(text.id));
      return [linkedSet(set, texts)];
    });
    const standalone = pageResults
      .filter((text) => !groupedIds.has(text.id))
      .sort((a,b) => fixedSection === "theologie"
        ? theologySort(a,b)
        : collator.compare(SECTION_LABELS[a.section],SECTION_LABELS[b.section]) || collator.compare(textCredit(a),textCredit(b)) || collator.compare(a.title,b.title));
    const linkedCompanions = results.length - directMatches.length;
    const linkedNote = linkedCompanions > 0 ? ` <span class="texts-count-linked">dont ${linkedCompanions} texte${linkedCompanions > 1 ? "s" : ""} lié${linkedCompanions > 1 ? "s" : ""}</span>` : "";

    const pageNote = totalPages > 1 ? ` <span class="texts-count-page">· ${pageResults.length} affiché${pageResults.length > 1 ? "s" : ""} sur la page ${currentPage}</span>` : "";
    count.innerHTML = `<strong>${results.length}</strong> texte${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}${linkedNote}${pageNote}`;
    const emptyState = fixedSection === "mythologie" && sectionTexts.length === 0
      ? `<div class="texts-empty"><h2>La section Mythologie est ouverte</h2><p>Les premiers extraits de textes antiques seront ajoutés prochainement.</p></div>`
      : `<div class="texts-empty"><h2>Aucun texte ne correspond</h2><p>Modifiez un filtre ou réinitialisez votre sélection.</p></div>`;
    grid.innerHTML = results.length ? `${renderedSets.join("")}${standalone.map(card).join("")}` : emptyState;
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
    const sourceLink = event.target.closest("[data-filter-source]");
    if (sourceLink && source) {
      event.preventDefault();
      setFromQuery(source, sourceLink.dataset.filterSource);
      currentPage = 1;
      render();
      source.focus({ preventScroll:true });
      return;
    }
    const textLink = event.target.closest("[data-text-link]");
    if (textLink) {
      try {
        window.sessionStorage.setItem("fvTextCatalogReturn", `${window.location.pathname}${window.location.search}`);
      } catch (_) {}
    }
  });

  let pageTransition = null;
  pagination.addEventListener("click", async (event) => {
    const pageButton = event.target.closest("[data-text-page]");
    if (!pageButton) return;
    const nextPage = Number.parseInt(pageButton.dataset.textPage, 10) || 1;
    if (nextPage === currentPage || pageTransition) return;

    grid.classList.add("is-page-switching");
    pagination.classList.add("is-page-switching");
    summary?.scrollIntoView({ behavior:"smooth", block:"start" });

    const outAnimation = grid.animate(
      [
        { opacity:1, transform:"translateY(0)" },
        { opacity:0, transform:"translateY(12px)" }
      ],
      { duration:380, easing:"cubic-bezier(.4,0,.2,1)", fill:"forwards" }
    );
    pageTransition = outAnimation;
    try { await outAnimation.finished; } catch (_) {}

    currentPage = nextPage;
    render();

    const inAnimation = grid.animate(
      [
        { opacity:0, transform:"translateY(12px)" },
        { opacity:1, transform:"translateY(0)" }
      ],
      { duration:480, easing:"cubic-bezier(.16,1,.3,1)", fill:"forwards" }
    );
    pageTransition = inAnimation;
    try { await inAnimation.finished; } catch (_) {}

    grid.getAnimations().forEach((animation) => animation.cancel());
    grid.classList.remove("is-page-switching");
    pagination.classList.remove("is-page-switching");
    pageTransition = null;
  });

  [search,section,...(multiThemeEnabled ? [] : [theme]),author,source].filter(Boolean).forEach((control) => control.addEventListener(control === search ? "input" : "change", () => {
    currentPage = 1;
    render();
  }));
  reset?.addEventListener("click", () => {
    if (search) search.value = "";
    [section,theme,author,source].filter(Boolean).forEach((control) => { control.value = "all"; });
    if (multiThemeEnabled) {
      selectedThemes = [];
      updateThemeMultiUi();
      closeThemeMulti();
    }
    currentPage = 1;
    render();
    search?.focus();
  });
  render();
})();

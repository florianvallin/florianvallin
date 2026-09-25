# [[fmt:red-text]]Perception de la parole[[/fmt]]

Un des aspects fondamental de la perception de la parole est de pouvoir accéder à des perceptions de mots. Lorsque l’on parle, il faut que les autres personnes puissent reconnaitre les mots que l’on dit et qu’on puisse reconnaitre le signal de parole.

XXXXX

Comment le système de reconnaissance gère cette variabilité ? Comment sont représentés les mots en mémoire ?

On va avoir certaines théories qui pensent que l’on n’a pas de problème (car on stocke en mémoire toute sorte de problème). Il existe des [[fmt:green]]multitudes d’exemplaires différents[[/fmt]] pour parler de la même chose.

On appelle cela des théories qui sont [[fmt:green]]exemplariste[[/fmt]] ou alors [[fmt:green]]épisodiques[[/fmt]] (on stocke tout le détail acoustique que l’on entend) (on n’a pas besoin de gérer la variabilité). A l’inverse, il y a les théories [[fmt:green]]abstractionnistes[[/fmt]]. Ces dernières supposent qu’on a [[fmt:yellow]]une seule représentation des mots en mémoire[[/fmt]] (ce n’est pas une représentation variable).

Comment le système de reconnaissance gère la variabilité ? Quel est le format de représentation des mots en mémoire ? Il y a tout un champ de domaine qui étudie les phonème manquant.

Il est possible que le signal soit dégradé.

La perception de la parole demeure possible du bruit (+5cB par rapport au bruit ambiant). Un énoncé demeure intelligible même quand le début est augmenté. On supporte un certain niveau de bruit pour reconnaitre la parole (un débit de à 30 phonèmes par seconde demeure intelligible).

On continue à [[fmt:yellow]]reconnaitre correctement la parole[[/fmt]] même si on [[fmt:green]]augmente le débit[[/fmt]]. Le domaine audio de la parole va de 50Hz à 10000Hz. On peut avoir cette [[fmt:green]]étendue[[/fmt]] dans la parole. Cette étendue n’est pas du tout respecté dans la bande passante du téléphone (qui n’est que de 300Hz jusqu’à 3400Hz). Avec une réduction de la bande passante, on [[fmt:yellow]]conserve 90% d’intelligibilité.[[/fmt]]

La production de la parole

Les [[fmt:green]]sons de parole[[/fmt]] sont [[fmt:yellow]]l’expression d’un geste articulatoire[[/fmt]], continue, complexe et coarticulé. On va avoir des [[fmt:yellow]]petits chevauchements[[/fmt]] à chaque fois. Les propriétés acoustiques des signaux de paroles dépendantes donc de la structure et du mode du fonctionnement de l’ensemble des dispositifs requis dans sa production.

Il [[fmt:yellow]]n’existe pas d’organe de la parole[[/fmt]]. On va utiliser chaque composante que l’on dispose d’une spécialisation biologique autre que la fonction de la parole pour faire de la parole (poumon, parynx, larynx, langue, dents, lèvres, palais et fosses nasales).

Tous ces organes sont présents dans d’autres espèces (qui ne parlent pas).

On va créer différents sons avec [[fmt:yellow]]différents organes[[/fmt]] (faire passer de l’air par le nez, rétrécir sa gorge, utiliser les dents, la bouche, position de la langue…).

Les [[fmt:yellow]]sons voisés [[/fmt]](qui font vibrer les cordes vocales) sont produits par la vibration des cordes vocales. Les [[fmt:yellow]]sons non voisés [[/fmt]](chuchotement) sont produits par les perturbations de l’air dans le larynx (qui ne font pas vibrer les cordes vocales).

On va avoir tout une [[fmt:green]]articulation autour du son[[/fmt]]. Pour les consonnes, il y a le [[fmt:yellow]]mode d’articulation[[/fmt]] (occlusives = a un moment donné pour les produires, il faut qu’il y est une fermeture, nasales, fricatives, glissantes et liquides) et le [[fmt:yellow]]lieu d’articulation [[/fmt]](labial = en avant, dental = milieu= vélo-palatal = derrière). Est-ce que les voyelles sont produite à l’avant de la bouche ou à l’arrière de la bouche, voyelle haute ou voyelle basse ?

Les [[fmt:green]]occlusives[[/fmt]] sont articulées par :

- le blocage du conduit (la pression s’accumule). [[fmt:yellow]]Occlusion[[/fmt]].

- La brutale libération de l’air. Bouffée d’énergie ([[fmt:yellow]]explosion[[/fmt]]).

- [[fmt:yellow]]Modulation[[/fmt]] du flux (donne la forme de la consonne).

Il existe toujours un délai entre la phase 2 et la phase 3 : [[fmt:yellow]]temps d’attaque vocal [[/fmt]](VOT). Celui-ci est bref pour les [[fmt:yellow]]voisées [[/fmt]](bdg) et long pour les [[fmt:yellow]]non voisées [[/fmt]](ptk).

Une [[fmt:yellow]]seule fréquence n’existe pas[[/fmt]]. Un son pur n’existe pas dans la nature. Tous les sons naturels sont des sons [[fmt:green]]complexes [[/fmt]]composés de [[fmt:green]]pleins de fréquences [[/fmt]]en même temps. On peut ainsi le décomposer en ces différentes fréquences.

Etant donné que « i » et « ou » ne sont [[fmt:yellow]]pas produit pareille dans la bouche[[/fmt]], on va avoir une composition différente. On va avoir des transitions formandique différente entre les deux. Le « di » n’est pas acoustiquement le même que le « d » dans d’autre mots.

On va ainsi avoir des [[fmt:green]]formants des voyelles[[/fmt]]. Les deux premiers servent à distinguer les voyelles les uns des autres. On va avoir un caractère [[fmt:yellow]]avant/arrière [[/fmt]]et [[fmt:yellow]]en haut/en bas[[/fmt]].

On va avoir un [[fmt:green]]triangle vocalique[[/fmt]]. Les mamans vont par exemple changer ce triangle pour parler à leur bébé. On va ainsi avoir plusieurs pics d’amplitudes (formants) qui sont repérés : F1, F2, F3… Mais seuls les deux premiers (F1 et F2) ont une valeur discriminative (F3 et F4 sont proches quelles que soient les voyelles articulées).

A la différence des signaux musicaux, les formants ne sont pas des multiples entiers de la F0. La F0 dépend de la longueur et de la rigidité des cordes vocales. Les formants dépendant de la cavité pharyngée et buccale.

Les voyelles ressemblent à des [[fmt:yellow]]signaux musicaux[[/fmt]]. Il est possible de décomposer le signal complexe et de séparer une fréquence fondamentale (F0) et des résonances (Formants).

Au cours du trajet du son dans le tractus, certains partiels sont [[fmt:yellow]]amplifiés [[/fmt]](pics d’amplitude) et d’autres [[fmt:yellow]]atténués[[/fmt]].

Unités de base de la reconnaissance de la parole

On à avoir deux problèmes :

- [[fmt:yellow]]Problème continuité [[/fmt]]: le système auditif parvient à découper le flux de parole en unités perceptives

- [[fmt:yellow]]Problème variabilité [[/fmt]]: il stabilise et normalise le signal, ce qui lui permet d’extraire des régularités (invariants) qui sont dégagées des variations accidentelles.

Sur quelles primitives le système auditif fait-il cette reconnaissance ?

Le [[fmt:green]]phonème[[/fmt]] est la plus [[fmt:yellow]]petite unité qui est porteuse de sens[[/fmt]]. Deux phonèmes sotn différents quand les mots sont différents. Il n’y a qu’un phonème /r/ en français et 2 en espagnol. En japon le /r/ et le /l/ ne sont pas distinctifs. (Loi et roi sont le même mot, les japonais n’entendent pas la différence).

Nous avons une perception catégorielle de certains phonèmes. On a notamment la perception catégorielle du VOT.

La [[fmt:green]]perception catégorielle[[/fmt]] est le fait percevoir seulement deux catégories et rien entre ces catégories.

La [[fmt:yellow]]tâche d’identification[[/fmt]] utilise le [[fmt:yellow]]paradigme ABX[[/fmt]]. On veut savoir si les sujets vont entendre la différence entre deux choses. Par exemple « ta » a 90ms, on présente un deuxième stimulus autre que A et on va mettre X identique à A ou B. Le sujet va devoir reconnaitre si X était le même que A ou que B.

Les [[fmt:yellow]]VOT des voisées[[/fmt]] sont plus brefs que pour les non voisées. Que se passe-t-il si l’on fait varier de manière continue le silence séparant la barre d’explosion de la modulation (de 0 à 80ms). Le /da/ se transforme insensiblement en /ta/.

Observation d’une [[fmt:yellow]]frontière phonétique[[/fmt]] (aux alentours de 40 ms) : en deçà perception du /da/ au-delà perception du /ta/.

Comment on montre qu’il y a de la [[fmt:green]]perception catégorielle[[/fmt]] ? Pour certaines valoir, on va voir 100% de [[fmt:yellow]]discrimination[[/fmt]] et voir la différence alors que dans d’autres cas, on ne va pas voir la différence entre les stimulis alors qu’il y a théoriquement une différence. On perçoit don les choses de façon complètement catégorielle.

Il existe aussi une [[fmt:green]]frontière catégorielle[[/fmt]] qui montre 50% de discrimination.

Notre système perceptif est fait pour [[fmt:yellow]]identifier les phonèmes[[/fmt]]. On ne va pas voir les différences pour les phonèmes qui ne nous intéressent pas.

On a une perception catégorielle du voisement et aussi de la place (la place d’articulation est le fait d’articuler sur le devant ou l’arrière de la bouche). Au niveau physique, elle se traduit par les [[fmt:yellow]]transitions formantiques[[/fmt]]. Il est possible de dessiner toutes les transitions permettant de passer insensiblement d’un /ba/ à un /da/.

L’auditeur perçoit d’abord /ba/ puis /da/, ce qui signifie qu’il [[fmt:yellow]]catégorise[[/fmt]] soit en /b/ soit en /d/ des stimuli qui ne sont ni l’un ni l’autre. On ne va pas entendre la différence à l’intérieur d’une catégorie.

Un [[fmt:green]]modèle de reconnaissance phonémique[[/fmt]] a été inventé (c’est le premier modèle qui est encore cité aujourd’hui). Même si l’on sait qu’il faux, celui-ci est tellement puissant qu’il permet de faire des hypothèses à tester pour faire des nouvelles choses. Il se base sur l’identification des phonèmes.

Dans ce modèle, l’auditeur va [[fmt:yellow]]extraire continuellement[[/fmt]] de l’information phonémique dans le signal et active les candidats (lexique mental, ce sont les mots) compatibles avec l’information qu’on a extraite du signal.  Un postulat de ce modèle est que le nombre des candidats se restreint au fur et à mesure de l’accumulation d’information. Un mot va être identifié lorsqu’il demeure le seul candidat possible. Ce moment correspond au [[fmt:yellow]]point d’unicité[[/fmt]].

Ainsi, nous n’aurons donc [[fmt:yellow]]pas besoin de traiter la totalité[[/fmt]] de l’information sonore pour percevoir un mot.

Dès qu’on a activé le « é », on va activer en mémoire tous ces mots. On va ainsi [[fmt:yellow]]éliminer les autres[[/fmt]] qu’on va avoir « élé ». A un moment donné, il ne va avoir plus qu’un mot dans le dictionnaire mental. Le [[fmt:yellow]]point d’unicité[[/fmt]] est quand le mot devient unique dans le dictionnaire mental.

Il existe des [[fmt:green]]arguments contre[[/fmt]] pour ce modèle. Certaines personnes pensent que ce n’est pas possible que le phonème soit l’unité de base de la reconnaissance de la parole. Quels sont les arguments contres ?

Pour qu’on puisse apprécier un son, il faut que le son [[fmt:yellow]]dure suffisamment longt[[/fmt]][[fmt:yellow]]emps[[/fmt]][[fmt:yellow]]. [[/fmt]]Quand on parle rapidement, on peut parler jusqu’à 30 phonèmes par secondes. Chaque phonème est traité en 30ms. Or le son doit durer au moins 100 à 150ms pour être perçut autrement que comme un « clic ».

Même si les phonèmes sont absents, on peut reconnaitre les mots avec la [[fmt:green]]restauration phonémique[[/fmt]]. Si l’on remplace le /k/ de « ski » par un silence ou du bruit blanc, le mot demeure néanmoins identifiés sans problème. Si on remplace une sorte de taux pour le « s » de « législature », on ne va pas parvenir à détecter la toux. On va parfaitement [[fmt:yellow]]reconnaitre le mot[[/fmt]].

Toujours dans l’argument contre, on va avoir une expérience de la [[fmt:green]]détection de « clic ».[[/fmt]] On peut insérer des « clics » dans un énoncé. Ces clics sont placés à différents endroits (entre les mots, dans les mots, entre les syllabes dans une syllabe). Les détections sont toujours plus courtes lorsque les clics sont placés aux frontières. Si le découpage est naturel, alors la détection devrait être facile à cet endroit. On va donc regarder quel est l’endroit où il va ya voir une meilleure performance à la détection des clics. On se rend compte qu’a chaque fois qu’on est  la [[fmt:yellow]]frontière des mots[[/fmt]], on va être [[fmt:green]]plus performants[[/fmt]]. C’est la frontière de syllabe là où il y a la meilleure performance (et non pas entre des phonèmes).

La syllabe a été proposé come unité alternative de la reconnaissance des mots. La syllabe est plus longue qu’un phonème et donc, on va vraiment avoir le temps.

La [[fmt:green]]syllabe[[/fmt]] est ce qui rythme la langue, c’est [[fmt:yellow]]plusieurs phonèmes[[/fmt]]. On dit que le rythme de la langue française est la syllabe. Elle semble constituer le meilleur candidat au poste d’unité primitive. Les mots courts sont détectés [[fmt:yellow]]plus rapidement[[/fmt]] que les phonèmes qu’il contient. /pa/ est détecté plus rapidement s’il forme une syllabe « palace » que s’il forme une partie de la syllabe « palmier ».

On va être [[fmt:yellow]]plus rapide a traité la syllabe que le phonème[[/fmt]].

Une autre expérience (1981) a été fait où ils ont pris des mots avec un [[fmt:yellow]]découpage différents[[/fmt]] :

BAL CON / BA LANCE

On a demandé aux auditeurs de détecter soit la syllabe BAL soit la syllabe BA dans balcon ou dans balance :

CV : CONSONNE VOYELLE (balance)

CVC : CONSONNE VOYELLE CONSONNE (balcon)

On observe qu’il y a une [[fmt:yellow]]interaction croisé[[/fmt]] entre la structure de la syllabe a détecté et la structure syllabique des mots. Quand on demande de repérer BA, ils vont plus vite de détecter BA dans BALANCE que dans BALCON. Lorsque l’on demande pour BAL, ils vont plus vite dans BALCON que dans BALANCE.

Cela va [[fmt:yellow]]plus vite[[/fmt]] quand c’est la [[fmt:yellow]]première séquence du mot[[/fmt]]. Dès qu’on entend BALANCE, on découpe en BA-LANCE.

On ne sait pas vraiment si [[fmt:green]]l’unité de base de la reconnaissance[[/fmt]] est les [[fmt:yellow]]voyelles[[/fmt]] ou les [[fmt:yellow]]phonèmes[[/fmt]]. On va avoir des arguments pour l’unité syllabe, pour l’unité phonème. On va baser la reconnaissance des mots sur l’unité mais on ne sait pas encore lesquels.

/ LA PERCEPTION DE LA PAROLE UNIMODALE ? /

### [[fmt:underline,green-text]]Influence de la vision [[/fmt]]

La [[fmt:green]]gestualité neuro-faciale[[/fmt]] va beaucoup servir en situation de bruit. On a une importance de la [[fmt:green]]lecture labiale[[/fmt]] en situation bruitée.

La [[fmt:yellow]]qualité de la perception[[/fmt]] dépend de la [[fmt:yellow]]combinaison[[/fmt]] d’une activité auditive et visuelle. Lorsqu’il y a un conflit perceptif, l’identification est une sorte de « moyenne » articulatoire entre l’information visuelle et auditive.

On ne va pas avoir la vision dans [[fmt:yellow]]certaines situations[[/fmt]] (télévision, téléphone…). La [[fmt:green]]vision[[/fmt]] n’est [[fmt:yellow]]pas essentielle[[/fmt]] pour comprendre la parole. Est-ce qu’il y a vraiment un apport dans la reconnaissance de la parole ? En réalité, la vision permet d’augmenter l’intelligibilité du son.

Quand on n’entend pas bien, il suffit de regarder les lèvres de la personne pour reconnaitre mieux les mots.

Une expérience le montre où la personne doit détecter /b/ dans « c’est pas ibibiz ». On va mettre ce son dans [[fmt:yellow]]différentes situations[[/fmt]] (0db, -6 un peu de bruit, -12 plus de bruit, -18, -24). Une autre VI va être la modalité de présentation (Audio ou AudioVisuel). Voici les résultats :

On est [[fmt:yellow]]meilleur en AV[[/fmt]] qu’en A. Cependant, ce [[fmt:yellow]]gain est modeste[[/fmt]] lorsqu’il n’y a pas de bruit. Le gain est plus important quand il y a plus de bruit.

Les informations sont en fait un [[fmt:yellow]]peu complémentaires[[/fmt]]. Par exemple, BA et GA sont très différent cependant au niveau des lèvres, on ne peut pas les confondre, ce sont des gestes articulatoires complètement différent. On va avoir un [[fmt:green]]continuum de place d’organisation[[/fmt]].

Ce que l’on entend par nos oreilles devient différent de ce que l’on voit. Certains sont influencés que par la vision. Cela s’appelle [[fmt:green]]l’effet McGurk[[/fmt]]. Le signal visuel est même utilisé quand il n’y a pas de bruit.

### [[fmt:underline,green-text]]Influence de l’orthographe[[/fmt]]

Le fait de connaitre [[fmt:yellow]]l’orthographe des mots[[/fmt]] va influencer notre perception auditive de ces mots. Il y a beaucoup d’étude dans ce domaine. Tous vont avoir la même conclusion, on est très influencé par notre connaissance orthographique.

En 1979, une étude au Brésil (Morais, Cary, Alegia & Bertelson) ont étudié des adultes illettrés. Ils ont montré qu’ils n’ont [[fmt:yellow]]pas de conscience phonologique[[/fmt]] (=capacité que l’on a à manipuler les sons de notre langue, capable de découper les sons en phonèmes. On acquiert cette capacité avec la lecture et l’écriture). Nos [[fmt:yellow]]habiletés [[/fmt]][[fmt:yellow]]méta-phonologiques[[/fmt]] [[fmt:green]]dépendent[[/fmt]] de la maîtrise de l’orthographe. Le fait de pouvoir manipuler le langage parlé est contraint par le langage de l’écriture.

En 1980 (Ehri & Wilce), une expérience a été faite sur des [[fmt:yellow]]enfants qui n’arrivent pas à lire & écrire[[/fmt]]. L’enfant qui n’ont pas appris à lire & écrire [[fmt:green]]voit la même chose[[/fmt]] dans RICH et dans PITCH.

Une autre expérience en 1979 (Seidenberg & Tanenhaus), a été faite sur le [[fmt:yellow]]jugement de rime[[/fmt]] et a été montré que celui-ci est [[fmt:yellow]]plus difficile[[/fmt]] pour RYE-TIE que pour DIE-TIE. On va avoir un délai si les mots ne s’écrivent pas les mots de la même façon.

Une autre expérience plus récente (2004, Ziegler, Ferrant & Montant) a été fait en comparant des mots différents en prenant la [[fmt:green]]consistance phono-graphémique[[/fmt]].

Les mots « consistants » sont des mots qui n’ont [[fmt:yellow]]qu’une seule façon de s’écrire[[/fmt]]. Par exemple, tous les mots comme « plage » s’écrivent de la même façon. On appelle cela des mots qui sont consistants. Il existe aussi des mots qui sont inconsistant (comme le on « en » → « temps », « tant », « paon »…). Ils ont donc comparé le temps de ces différents mots. Ils se sont rendu compte dans différente tâche qu’ils vont [[fmt:green]]tous dans le même sens[[/fmt]].

- Décision lexicale : celle-ci consiste à présenter un mot ou un autre mot et de demander à la personne à la personne si ce qu’elle a vu est un mot où un autre mot le plus vite ensemble.

- Jugement de rime : juger si deux mots riment ou non

- Dénomination : il faut répéter le mot, le dénommer

On va [[fmt:green]]plus vite pour traiter un mot consistant[[/fmt]] qu’un mot inconsistant. Cela veut dire qu’on va activer automatique l’orthographe. On va activer plein d’orthographe possible et choisir le bon (très rapidement).

Il existe également la [[fmt:green]]technique d’amorçage[[/fmt]]. On va demander à une personne d’écouter une amorce. Ensuite, on va présenter une cible.

Fleur → Tulipe (reliée)

Chien → Tulipe (contrôle)

Il va devoir ici répondre « oui ».

Ce qui nous intéresse est ce qu’on va mettre dans l’amorce. On devrait aller [[fmt:yellow]]plus vite pour dire oui [[/fmt]][[fmt:yellow]]a[[/fmt]][[fmt:yellow]] Tulipe[[/fmt]] car on va faire un lien.

Une autre expérience a été fait avec en plus de cela, un partage de lettres. Est-ce que cela va avoir un impact sur l’amorçage ?

Lorsque l’amorce est lancée, cela [[fmt:yellow]]facilite la chose[[/fmt]]. Elle est modulée par le partage orthographique. Cela veut dire que lorsque l’on lance l’amorce, on active le son, le lexique et les lettres. On va donc aller plus vite.

D’autre expérience ont été faite en [[fmt:yellow]]variant la fréquence[[/fmt]] de tel ou tel sons. En français, la façon la plus fréquence d’écrire « cracou » avec un son est plus fréquence avec un C que avec un K. C’est la graphie la plus fréquente. En néerlandais, c’est l’inverse (plus de K que de C). L’expérience a été faite là-bas.

Il y a des variantes qui dépendent des pays et les régions. On veut savoir si l’apprentissage de l’orthographe va modifier la représentation phonologique des mots.

On a utilisé deux types de stimuli. On va avoir une [[fmt:yellow]]élision du schwa obligatoire[[/fmt]] « cass’role », l’on n’entend jamais « casserole ». La forme la plus fréquente est « cass’role ». On va aussi avoir un schwa facultatif (cheval, ch’val).

On va comparer les performances enfants, on va remarquer qu’il sont sensible à la fréquence de ce qu’il entendent. On voit une différence quand il vont apprendre à lire et à écrire.

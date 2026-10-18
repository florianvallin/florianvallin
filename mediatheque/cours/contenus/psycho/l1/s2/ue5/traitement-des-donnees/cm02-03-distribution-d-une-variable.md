# [[fmt:red-text]]Distribution d’une variable[[/fmt]]

## [[fmt:underline,red-text]]La représentation d’une donnée[[/fmt]]

On va avoir plusieurs options pour parler des données : des [[fmt:green]]données brutes[[/fmt]] (matrices, très complexe, on ne peut pas voir toutes les choses directement avec cela). Il va donc falloir [[fmt:green]]distribuer les informations[[/fmt]] et [[fmt:green]]simplifié[[/fmt]] les choses en résumant les chiffres / pourcentages …

- Données brutes

- Distribution

- Résumé

Le problème est que si l’on va aux données brutes vers le résumé, on va [[fmt:yellow]]simplifier [[/fmt]]et [[fmt:yellow]]compacité[[/fmt]]. Mais si on part du résumé et qu’on va aux données brutes, on va avoir une [[fmt:yellow]]complexité[[/fmt]] et une [[fmt:yellow]]richesse d’information[[/fmt]].

On va ainsi avoir [[fmt:green]]plusieurs manières[[/fmt]] de [[fmt:yellow]]représenter les variables[[/fmt]] :

- Elles peuvent dépendre du niveau d’échelle

- On va avoir des variables qualitatives (N / O) sous forme de diagramme en barre

- On va avoir des variables quantitatives (I / R) sous forme d’histogramme

- Les noms sont différents parce que les calculs peuvent l’être mais le principe sera souvent le même

On va donc avoir :

- Diagramme en secteur

- Diagramme en barre

- Diagramme en tige

- Histogramme

- Courbe cumulative

## [[fmt:underline,red-text]]Effectifs & Fréquences[[/fmt]]

Pour chaque variable, on va pouvoir définir des « [[fmt:green]]classes[[/fmt]] » :

Si on a une variable nominale (valeurs non ordonnées), une classe va valoir une valeur (ou modalité). Sinon, on peut regrouper les valeurs (si nécessaire). Une classe sera alors un [[fmt:yellow]]ensemble de valeurs[[/fmt]].

On va avoir deux manières de compter pour chaque classe :

- [[fmt:yellow]]Effectif [[/fmt]]= on compte les occurrences

- [[fmt:yellow]]Fréquence [[/fmt]]= effectif divisé par l’effectif global (proportion du total)

Quel est la différence entre la fréquence et l’effectif ?

Au niveau des graphiques, on aura la même chose. Au niveau information apportée, les deux sont complémentaires. [[fmt:green]]L’effectif [[/fmt]]permet de [[fmt:yellow]]s’appuyer sur le nombre de participants[[/fmt]] (mais on risque de mal interpréter des nombres identiques). La [[fmt:green]]fréquence [[/fmt]]permet de [[fmt:yellow]]s’abstraire du nombre de participants[[/fmt]] (mais on ne sait pas si le protocole est appliqué sur 10 ou 1000 personne).

## [[fmt:underline,red-text]]Les différentes distributions[[/fmt]]

### [[fmt:underline,green-text]]Le diagramme en secteurs[[/fmt]]

Le [[fmt:green]]diagramme en sec[[/fmt]][[fmt:green]]teur[[/fmt]], aussi appelé « [[fmt:yellow]]camembert[[/fmt]] »  est complet (360°) ce qui représente 100% de l’effectif. Pour chaque modalité, on a donc un secteur de fk x 360n. (fréquence entre 0 et 1). [[fmt:yellow]]L’ordre [[/fmt]]des secteurs est [[fmt:yellow]]sans importances[[/fmt]], d’où l’usage pour des [[fmt:green]]variables nominales[[/fmt]].

On peut retrouver son utilisation en psychologie avec par exemple des études sur la psychologie positive, les classifications de classes sociale, l’usages d’internet…

### [[fmt:underline,green-text]]Le diagramme en barres[[/fmt]]

Il existe également les [[fmt:green]]diagrammes en barres[[/fmt]] (ou en bâtons). La hauteur des barres représente l’effectif (ou la fréquence). Pour chaque modalité, on a donc une barre de hauteur nk ou fk.

Ce type de diagramme est utilisé en économie, sociologie, au niveau des salaires ect..

Si les modalités / valeurs sont ordonnées, autant en profiter. C’est donc le cas pour une variable [[fmt:yellow]]ordinale[[/fmt]], [[fmt:yellow]]d’intervalle [[/fmt]]ou de [[fmt:yellow]]rapport[[/fmt]].

### [[fmt:underline,green-text]]Les variables discrètes ou continues[[/fmt]]

On peut avoir des cas de variables qui peuvent prendre de nombreuses valeurs, on va avoir des variables non bornées, avec une précision (trop) importante. La variable peut-être [[fmt:green]]discrète [[/fmt]]ou [[fmt:green]]continue[[/fmt]].

Comment interpréter le diagramme « en barre » suivant représentant la taille des hommes en 1885, données de (Sir Galton). On peut voir qu’on peut [[fmt:yellow]]perdre de la précision[[/fmt]] selon les distributions :

## [[fmt:underline,red-text]]D’autres diagrammes[[/fmt]]

Pour interpréter les données, il faut [[fmt:yellow]]ajuster les classes[[/fmt]]. Pour cela, il y a [[fmt:yellow]]deux versions[[/fmt]] : la version basique (sur papier) qu’on appelle le [[fmt:green]]diagramme en tige & feuille [[/fmt]]ET [[fmt:green]]l’histogramme[[/fmt]].

### [[fmt:underline,green-text]]Diagramme en tiges & en feuilles[[/fmt]]

C’est une méthode qui date de 1977 créée par [[fmt:pink]]Tukey[[/fmt]]. Le principe est de [[fmt:yellow]]regrouper les données[[/fmt]] en se basant sur leurs [[fmt:yellow]]premiers chiffres identiques[[/fmt]]. Par exemple, on va a [[fmt:green]]le test de stroop[[/fmt]] (couleur du mot BLEU) :

- Temps de réponse en ms (9 valeurs = 9 classes ?)

- Tri des valeurs (étape optionnelle)

- On va regrouper les chiffres en commun (ex : par centaine)

- On copie les chiffres restants pour chaque valeur

Avec le diagramme en tige & feuilles, on peut donc voir [[fmt:yellow]]combien de classes [[/fmt]](tiges) sont considérées, [[fmt:yellow]]l’effectif [[/fmt]](feuilles) de la classe « 6 », la [[fmt:yellow]]moyenne [[/fmt]]des valeurs de la classe «5 » …

On peut lire plus que sur un diagramme en barre. Bien sans ordinateur et si on n’a pas trop de données.

La réponse est la C.

Pour appelle-t-on cela un diagramme en tige & en feuille ? Les [[fmt:green]]feuilles [[/fmt]](valeurs) sont toutes rattachées à une [[fmt:green]]tige [[/fmt]](classe). On ne peut jamais avoir une feuille sur plusieurs tiges (d’où le « si ces parties sont 2 à 2 disjointes » (slide 22)). Ceux qui seront par exemple sur la tige 4 ne seront pas sur la tige 5.

On peut faire l’analogie avec les [[fmt:green]]fichiers informatiques[[/fmt]]. Un disque dur a une racine. On va parler d’arborescence de fichier, de branche/chemin dans l’arbre. Chaque fichier se trouve dans un seul dossier.

### [[fmt:underline,green-text]]Diagramme histogramme[[/fmt]]

Si toutes les valeurs sont différentes et qu’on prend 1 classe pour 1 valeur alors ni = 1 (effectif) pour chaque classe. On va choisir des intervalles pour définir les classes basé sur une [[fmt:green]]amplitude[[/fmt]] (=on veut tous les intervalles de même largeur)…

… et un [[fmt:green]]effectif[[/fmt]] (ou fréquence) (=tous les intervalles de même fréquence).

Les intervalles ne vont pas tous être de la même largeur. Ce n’est pas très pratique d’utiliser des choses comme cela.

La dernière version va fixer des [[fmt:green]]bornes des intervalles[[/fmt]] (=choix qui a une signification pratique) :

C’est le [[fmt:yellow]]plus couramment[[/fmt]] utilisé.

On a donc un choix d’intervalles pour définir les classes basé sur : Amplitude, effectif, borne.

Contrairement au diagramme en barre des fréquences, les fréquences ne sont [[fmt:yellow]]pas [[/fmt]]ici la [[fmt:yellow]]hauteur des barres [[/fmt]]mais leur [[fmt:green]]surface[[/fmt]].

## [[fmt:underline,red-text]]Quelques spécificit[[/fmt]][[fmt:underline,red-text]]és[[/fmt]]

### [[fmt:underline,green-text]]Classes exclusives et fréquences cumulées[[/fmt]]

Si on fait la somme de toutes les classes, la [[fmt:yellow]]somme des effectifs[[/fmt]] va valoir [[fmt:yellow]]n[[/fmt]]. La [[fmt:yellow]]somme des fréquences[[/fmt]] va donc faire [[fmt:yellow]]1[[/fmt]]. Cela permet de faire la somme des effectifs / fréquences entre plusieurs classes. On peut donc exploiter l’ordre des variables (cf. si variable non nominale).

Cela va nous permettre de calculer [[fmt:green]]l’effectif [[/fmt]]et la [[fmt:green]]fréquence cumulée[[/fmt]].

### [[fmt:underline,green-text]]Fonction de répartition[[/fmt]]

On va avoir une fonction qu’on appelle la [[fmt:green]]fonction de répartition[[/fmt]] (ou histogramme des fréquences cumulées). Si X est notre variable d’intérêt (qui prend les valeurs triées x1, x2, … xn).

La valeur va donc toujours être [[fmt:yellow]]comprise entre[[/fmt]] 0 et 1, c’est une fonction obligatoirement [[fmt:yellow]]croissante[[/fmt]]. Mais à quoi ça sert ?

### [[fmt:underline,green-text]]Courbe cumulative[[/fmt]]

On va avoir la [[fmt:green]]courbe cumulative[[/fmt]]. Cette courbe (ligne brisée) va relier des points définis par en [[fmt:yellow]]abscisses [[/fmt]](x) la borne droite de chaque classe et en [[fmt:yellow]]ordonnée [[/fmt]](y) la fréquence cumulée associée. On va donc avoir :

On peut donc répondre à la question : « quelle proportion « théorique » de la population/échantillon ». Mais pourquoi se poser des questions comme « quel pourcentage de la population/échantillon à moins de 19a et demi ? » ou « quel pourcentage des données représente les valeurs supérieures à 4.2 ? » (cf. année supérieur → généralisation ? erreur de type I, conclusion de trouvé ou non quelque chose…).

## Encadrés et annotations du document

Ω2

10/12h 29/01

QUINTON Jean-Charles

Ω3

10/12h 05/02

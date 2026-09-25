# [[fmt:red-text]]Distribution de deux variables[[/fmt]]

Pourquoi a-t-on besoin [[fmt:green]]d’étudier deux variables[[/fmt]] ?

Nuage de points

Boite à moustache

Tableau de contingence

Histogramme 2D/3D

Distributions conditionnelles

Distribution marginales

Fréquences conditionnelles / marginales

Marges & profils

En réalité, c’est ce que l’on [[fmt:green]]fait au quotidien[[/fmt]]. Par exemple, c’est [[fmt:yellow]]l’apparition simultanée[[/fmt]] ou [[fmt:yellow]]prédictible d’événement[[/fmt]] (ex : feu orange, rouge… Un temps passe et on observe quelque chose, c’est un lien entre deux chose qui sont ensemble). Il y a aussi les [[fmt:yellow]]contingences sensorimotrices [[/fmt]](quand on fait tomber un objet, si je le lâche, je sais qu’il va aller vers le bas et qu’on va entendre une chose (variable : son / image, quel corrélation ?). En termes de l’acquisition, il y a [[fmt:yellow]]l’apprentissage de règles[[/fmt]] (si on entend des mots, on va entendre des mots qui suivent).

Parfois, on le fait [[fmt:green]]plutôt mal.[[/fmt]] Le problème est qu’on retient les [[fmt:yellow]]événements saillants[[/fmt]] / exceptionnels (mais non représentatifs) (ex : on va enregistrer au mieux le trauma alors que c’est ponctuel). Si l’on veut étudier des phénomènes, ils ne faut pas se baser sur ces [[fmt:yellow]]phénomènes rares.[[/fmt]] On va aussi avoir des [[fmt:yellow]]biais[[/fmt]] avec les croyances, optimisme, émotions… On a tendance à [[fmt:yellow]]généraliser[[/fmt]] (ex : ce qui est vrai dans un pays, on va le généraliser à un continent / monde entier).

On cherche donc des relations entre des variables. Pour pouvoir [[fmt:yellow]]reproduire[[/fmt]] et [[fmt:yellow]]contrôler[[/fmt]] un effet, on a besoin de relation causale (ex : la chute entraine le bruit). Dans beaucoup de cas, on va avoir une [[fmt:yellow]]relation[[/fmt]] entre les évènements mais pas de relation de [[fmt:yellow]]causalité[[/fmt]] (ex : se faire agresser dans la nuit ne veut pas dire que dans la nuit on va se faire systématiquement agresser). On va donc pourvoir tester ce qui est relation et ce qui est causalité.

La [[fmt:green]]statistique[[/fmt]] va permettre :

- Contrôler les [[fmt:yellow]]fréquences d’apparition[[/fmt]] (conjointe (qui sont relié) ou indépendante (qui n’ont rien à voir))

- De tester la [[fmt:yellow]]présence[[/fmt]] et [[fmt:yellow]]l’intensité[[/fmt]] d’une relation (est-ce qu’on peut expliquer beaucoup de chose de la relation ou si on l’oublie, cela marche aussi ?)

Plusieurs représentations pour parler des données :

- [[fmt:yellow]]Données brutes[[/fmt]] (avec les matrices)

- [[fmt:yellow]]Distribution[[/fmt]] (ex : diagramme, graphique, nuage de points…)

- [[fmt:yellow]]Indices[[/fmt]] (plutôt pour décrire s’il y a un lien entre les deux variables).

Quand il y a deux variable, on va appeler cela la [[fmt:green]]distribution conjointe[[/fmt]] (ou [[fmt:yellow]]bivarié[[/fmt]]).

## [[fmt:underline,red-text]]Nuage de points[[/fmt]]

Le plus simple à faire est un [[fmt:green]]nuage de points[[/fmt]].

Elle marche avec [[fmt:yellow]]deux [[/fmt]][[fmt:yellow]]variables[[/fmt]][[fmt:yellow]] quantitatives[[/fmt]] (intervalle, rapport).

On peut faire par exemple un nuage avec l’âge et la taille des personnes de la salle.

On peut avoir plusieurs exemples de 2 variables x & y quantitatives :

- Moyenne au BAC et en L1

- Taille du père et de l’enfant (1er lien qui était fait)

- Age des époux

- Pratique du sport pour 2 amis

Chaque couple représente x1 et y1 ce qui fait 1 points.

[[fmt:green]]Echantillon[[/fmt]] (n) = nuage de [[fmt:italic]]n[[/fmt]] points

Si on a plusieurs identiques, on va parler de [[fmt:green]]densité[[/fmt]].

Ce sont toujours des [[fmt:green]]tendances moyennes[[/fmt]]. Est-ce qu’elle augmente beaucoup ? Est-ce qu’il y a un lien ou non ?

Graphiquement, on peut avoir [[fmt:yellow]]plusieurs informations[[/fmt]]. La relation peut-être plus ou moins [[fmt:yellow]]marqué[[/fmt]]. Elle peut aussi sembler [[fmt:yellow]]présente[[/fmt]] ou non.

La relation est plus intense quand les points sont rapprochés, on peut donc faire passer une droite pour voir ce que cela représente. Quand les points sont dispersé, on ne peut pas voir réellement de corrélation (plus les points sont [[fmt:yellow]]éloigner[[/fmt]], [[fmt:yellow]]moins[[/fmt]] c’est [[fmt:yellow]]fiable[[/fmt]]).

En général, on va souvent s’arrêter sur les [[fmt:green]]modèles linéaires[[/fmt]]. Il existe aussi des tests non linéaires. Le fait de faire passer une droite dans plusieurs points est plus simple que de faire une courbe (pour savoir si elle a un effet + ou –. ex : est-ce que sa santé dégrade ou inversement ?)

## [[fmt:underline,red-text]]Boite à moustache[[/fmt]]

Quand on a une [[fmt:yellow]]variable quantitative [[/fmt]]et une [[fmt:yellow]]variable qualitative[[/fmt]], on va faire des [[fmt:green]]boites à moustache[[/fmt]].

On peut toujours convertir une quantitative et qualitative. Par exemple avec un [[fmt:italic]]y [[/fmt]]quantitative et un [[fmt:italic]]x[[/fmt]] qualitative :

- Poids en fonction du sexe

- Salaire selon CSP

- Bien être selon traitement ou pas

- Note selon présence en CM

Pour chaque modalité de [[fmt:italic]]x[[/fmt]], on réalise une boîte avec les [[fmt:italic]]y[[/fmt]]. Cela permet de [[fmt:yellow]]comparer[[/fmt]] les distributions. On peut voir des [[fmt:yellow]]différences[[/fmt]], des [[fmt:yellow]]écarts de variables[[/fmt]]…

Par exemple, sur le diagramme ci-contre, on peut savoir quelle promo (A/B) a :

- La médiane la plus élevé ?

- La dispersion la plus forte ?

- Le plus de valeurs très extrême ?

- Le minimum le plus faible ?

- La distribution la plus asymétrique ?

## [[fmt:underline,red-text]]Tableau de contingence[[/fmt]]

Quand on va voir [[fmt:yellow]]2 variables qualitatives[[/fmt]] (nominale, ordinale), on va avoir un [[fmt:green]]tableau de contingence[[/fmt]].

Si la variable est [[fmt:yellow]]quantitative[[/fmt]], on peut [[fmt:green]]toujours regrouper en classe[[/fmt]]. On a donc une variable [[fmt:italic]]x[[/fmt]] (ex : sexe) avoir plusieurs modalités (ou classe) ai (homme / femme) et [[fmt:italic]]y[[/fmt]] formé de modalités (classes) bk.

On peut donc former des [[fmt:yellow]]couples[[/fmt]] (ai, bk), on a un effectif nik.

On peut créer un tableau avec les [[fmt:yellow]]distributions[[/fmt]][[fmt:yellow]] conjointe des effectifs[[/fmt]].

On va donc juste dire combien de personnes sont dans chaque cas.

## [[fmt:underline,red-text]]Histogramme 2D/3D[[/fmt]]

On peut le [[fmt:green]]représenter avec plusieurs [[/fmt]][[fmt:green]]choses[[/fmt]] :

- Histogramme 3D : Variable 1 * Variable 2 * Effectif (fréquence)

- Rendu de la troisième dimension avec la couleur

Il existe plein d’autres possibilités en considérant des densités (continues) :

- Ligne de niveau

- Heatmap

- Surface 3D

- …

On veut globalement accéder aux [[fmt:yellow]]mêmes informations[[/fmt]]. Cela permet de voir plus facilement et rapidement l’information.

## [[fmt:underline,red-text]]Distributions conditionnelles[[/fmt]]

On va avoir en [[fmt:yellow]]effectifs[[/fmt]] :

- Série [[fmt:green]]bivariés[[/fmt]][[fmt:green]] [[/fmt]]: nik (pour tous 1 < j < J et 1 < k < K). C’est voir dans chaque case quelle valeur il y a.

- Série [[fmt:green]]conditionnelles [[/fmt]](sachant que x vaut ai, quelles est la distribution des y ?). On va ici s’intéresser qu’une un échantillon. SI on avait eu qu’un seul échantillon, quels est la distribution pour celui-là ?

- Par exemple, quelles est la distribution des réponses pour les hommes ? Quelles est la répartition homme-femme parmi ceux qui répondent « Besoin ». On suppose qu’on connait la valeur d’une des deux, alors on peut en déduire l’autre (on ne peut pas le faire dans tous les cas).

## [[fmt:underline,red-text]]Distribution marginales[[/fmt]]

- Séries [[fmt:green]]marginales[[/fmt]] : c’est pour par exemple savoir le nombre d’homme total (c’est comme si on avait une question a part : êtes-vous un homme ou une femme ?). C’est une question qui est le total de la colonne ou de la ligne. Si on a le tableau au centre, on peut avoir les deux séries marginales.

## [[fmt:underline,red-text]]Fréquences conditionnelles / marginales[[/fmt]]

On va avoir pour les [[fmt:yellow]]fréquences[[/fmt]] :

- Série [[fmt:green]]bivariés[[/fmt]][[fmt:green]] [[/fmt]]: [[fmt:yellow]]fréquence conjointe[[/fmt]]. Les fréquences conjointes vont être l’ensemble les valeurs voulues qu’on divise pas la valeur total.

- Série [[fmt:green]]conditionnelle [[/fmt]]:

- On va prendre qu’une ligne / colonne. On ne va donc considérer qu’on jamais rien hors de cette colonne-là. Les fréquences conditionnelles vont être comme si on ne considère que la colonne en question (le résultat total ne nous sert à rien). On l’appelle aussi le profil lignes ou profils colonne.

- Les conditionnelles en lignes et en colonnes vont être totalement différent. Si on prend les chiffres en lignes, on va avoir des chiffres totalement autre que celle des colonnes.

- Série [[fmt:green]]marginales[[/fmt]] : on va re-diviser par 142 en coupant en 2 ou 3.

## [[fmt:underline,red-text]]Marges & profils[[/fmt]]

Ici, [[fmt:yellow]]l’attitude la moins adoptée [[/fmt]](indépendamment du sexe) est inutile (ce n’est pas l’envie ou le besoin).

Le [[fmt:yellow]]sexe [[/fmt]]le plus représenté dans l’échantillon est le féminin (car 109).

La [[fmt:yellow]]proportion de l’échantillon [[/fmt]]correspondant aux femmes ayant répondu « Besoin » est 54% (en calculant la fréquence correspondant à femme-besoin → 76 & 142).

Le [[fmt:yellow]]pourcentage « Envie »[[/fmt]] sur l’échantillon complet est 19% (car il suffit de calculer les fréquences marginales pour l’attitude 27 & 142)

La [[fmt:yellow]]réponse la moins courante[[/fmt]] chez les hommes est inutile (5)

La [[fmt:yellow]]proportion d’hommes [[/fmt]]parmi ceux qui ont répondu « [[fmt:yellow]]Besoin [[/fmt]]» est 21% (car il suffit de calculer les fréquences conditionnelles sachant l’attitude → 20 & 96).

## Encadrés et annotations du document

Ω5

10/12h 04/03

QUINTON Jean-Charles

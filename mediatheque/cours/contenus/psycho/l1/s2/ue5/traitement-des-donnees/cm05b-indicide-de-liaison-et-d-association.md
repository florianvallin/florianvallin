# [[fmt:red-text]]Indices de liaison[[/fmt]]

- Taxonomie des indices

- Liaison entre modalités

- Suite taxonomie des indices

- Conclusion

## [[fmt:underline,red-text]]Taxonomie des indices[[/fmt]]

Quand il y a deux variables, il y a eu [[fmt:yellow]]deux tendances[[/fmt]] :

- Données initialement uniquement [[fmt:green]]d’observation[[/fmt]] (XIX°).

- Il regardait la co-variance entre des variables observées. Souvent, c’était de la biologie, de l’économie, des données de l’état…

- Galton regardait par exemple la relation entre la taille des parents / enfants.

- Au XX°, on a eu des [[fmt:green]]données expérimentales[[/fmt]] qu’on a [[fmt:green]]manipulées[[/fmt]]. On essaie d’agir sur un phénomène. On va parler de VD et VI (car il y a une relation de causalité). Fisher à travailler dessus (agronomie). On va faire de l’analyse de variance (ANOVA).

Il y a donc 2 démarches avec des indices de liaisons différentes :

- [[fmt:green]]Ecart à l’indépendance [[/fmt]](variables liées si non indépendantes) = basé effectifs (est-ce qu’il y a une dépendance ou non ?)

- Proximité à une [[fmt:green]]liaison fonctionnelle [[/fmt]](indice d’association) = basée valeurs (est qu’il y a indépendance ou non ?). Elles sont plus avantageuses quand on veut faire des prédictions.

- Modèle [[fmt:yellow]]symétriques [[/fmt]]: e.g. cause commune à 2 variables observées

- Modèle [[fmt:yellow]]asymétrique [[/fmt]]: e.g. relation causale entre 2 variables

## [[fmt:underline,red-text]]Liaison entre modalités[[/fmt]]

On ne va pas faire les mêmes tests selon les deux modèles.

Par exemple : on peut voir l’indépendance dans un tableau de contingence. Par exemple, la proportion « envie » chez les hommes sont des proportions chez tout le monde. C’est ç dire qu’il n’y a pas de différence en pourcentage au sein des réponses hommes vs femme. On s’attend à ce que la fréquence conditionnelle vaut la fréquence marginale.

On peut aussi voir les [[fmt:yellow]]indépendances[[/fmt]] avec calcul de [[fmt:green]]fréquence-produit[[/fmt]]. On s’attend donc à ce que la fréquence conjointe vaut le produit des fréquences marginales. C’est équivalent à la fréquence marginale qui vaut à la fréquence conditionnelle. Cela permet de comparer toutes les cases du tableau d’un coup.

On va faire la différence des deux tableaux et voir qu’elles ont été les évolutions. On veut voir s’il y a indépendance avec les taux de liaison entre deux modalités de 2 variables. On calcule un écart relatif entre les fréquences. C’est donc un pourcentage sur les pourcentages.

On peut avoir une indépendance avec les [[fmt:green]]taux de liaison[[/fmt]] entre deux modalités de 2 variables.

Pour enlever les valeurs négatives, on va faire le [[fmt:green]]carré moyen de contingence[[/fmt]], alias ϕ². On veut au final une seule valeur nous indiquant l’indépendance (ou dépendance).

Que veut donc dire la valeur de ϕ² = 0,0158 ? On dirait qu’on est proche de 0, mais tout dépend de la valeur maximale que ϕ² peut prendre. Au maximum, ϕ²= ϕ²max= min (K, J) – 1.

On peut normaliser les valeurs avec le [[fmt:green]]coefficient de Cramer[[/fmt]], alias V². V² = ϕ²= ϕ²max.

- Si V² = 0, les variables sont [[fmt:yellow]]parfaitement indépendantes[[/fmt]]

- Si V² = 1, les variables sont [[fmt:yellow]]totalement dépendantes[[/fmt]]

La valeur dépend uniquement des fréquences, pas de la taille de l’échantillon. Ici V² = 0,0158 / (min (3,2)-1) = 0,0158 (les données sont quasi-indépendantes).

C’est donc le cas où on a deux variables.

Il existe aussi une [[fmt:yellow]]démarche complémentaire[[/fmt]].

## [[fmt:underline,red-text]]Suite taxonomie des indices[[/fmt]]

Le but est de voir si les [[fmt:yellow]]prédictions[[/fmt]] sont bonnes ou non.

On a donc deux démarches différentes :

- Ecart à l’indépendance (variables liées si non indépendantes) = basé effectifs

- Proximité à une liaison fonctionnelle ([[fmt:yellow]]indices d’associations[[/fmt]]) = basée valeurs

- Modèle [[fmt:yellow]]symétrique[[/fmt]]

- RRY ou coefficient de corrélation linéaire de Pearson

- PRY ou coefficient de corrélation linéaire de Spearman

- Modèle [[fmt:yellow]]asymétrique [[/fmt]]: e.g. relation causale entre 2 variables

- On considère la relation entre :

- - Variable indépendante (VI), facteur, variable explicative, prédicteur

- - Variable dépendante (VD), réponse, variable à expliquer, variable prédite

Il y existe aussi la [[fmt:green]]covariance / variance[[/fmt]]

## [[fmt:underline,red-text]]Conclusion[[/fmt]]

Les [[fmt:green]]statistiques[[/fmt]] permettent de [[fmt:yellow]]conclure[[/fmt]] sans commettre d’erreur (e.g. faux positif).

En général, l’échantillon doit représenter la population mais ne la représente pas (problème de généralisation, statistique inférentielles). Les graphiques sont plutôt des données brutes, c’est-à-dire savoir à quoi ressemble les données (e.g. distribution normale) et la communication sont plus intuitive.

Le [[fmt:yellow]]graphique peut ne pas suffire[[/fmt]] ou être trompeur, on a besoin de statistique répondant à des questions précises : indépendances.

Tout cela repose en général sur des [[fmt:yellow]]statistiques descriptives[[/fmt]]. Tout dépend du type d’échelle et de variable. On a besoin d’avoir une compréhension intuitive et solide (moyenne, écart type…).

## Encadrés et annotations du document

Ω5

10/12h 04/03

QUINTON Jean-Charles

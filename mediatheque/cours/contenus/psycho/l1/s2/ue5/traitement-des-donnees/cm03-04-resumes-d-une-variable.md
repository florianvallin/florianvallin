# [[fmt:red-text]]Résumés d’une variable[[/fmt]]

L’indice de position

Le mode

Le quantile

Tendances centrales

Propriétés de la moyenne

Indices de dispersion

Entropie et écarts entre observations

Pour résumé un ensemble (une situation), on va utiliser des indices statistiques. Ainsi on va avoir plusieurs options qui dépendent du [[fmt:yellow]]niveau d’échelle[[/fmt]] (qualitative, quantitative) et on se demander de faire un résumé de quoi ?

On va avoir [[fmt:green]]plusieurs indices[[/fmt]] : de position (moyenne), de dispersion (écart type), de forme (symétrie).

## [[fmt:underline,red-text]]L’indice de position[[/fmt]]

L’indice de position va permettre d’avoir [[fmt:yellow]]pleins de calculs possibles[[/fmt]]. Tout dépend de la question qu’on se pose et du type de données dont on dispose.

On a plusieurs [[fmt:yellow]]sous-programme[[/fmt]] (de qualitative à quantitatif): mode, extrêmes, médiane (=partager autant de personnes moitié/moitié), quartiles, déciles, centiles, milieu, moyenne (=permet de pondérer les écarts).

## [[fmt:underline,red-text]]Le mode[[/fmt]]

C’est la valeur qui représente la [[fmt:yellow]]fréquence maximal[[/fmt]] (ou intervalle de la classe de plus grande fréquence, si classes de même amplitude).

Le mode peut avoir deux réponses exactes. On peut aussi avoir le 0.

Il y a le [[fmt:yellow]]mode absolu[[/fmt]], sur tout l’histogramme, c’est celui qui a la valeur de fréquence maximal (pour toutes les classes). On peut aussi avoir le [[fmt:yellow]]mode relatif[[/fmt]], qui est la valeur maximal local (valeur ou classe i telles que ni > nn+1).

### [[fmt:underline,red-text]]Le quantile[[/fmt]]

Le [[fmt:green]]quantile[[/fmt]] est un moyen de couper l’histogramme en différentes position. On parle de quantile d’ordre [[fmt:italic]]p [[/fmt]](avec p dans [0 ; 1]). Par exemple, si on veut le quantile 0,6, on va prendre la valeur de 60%. On va compter les fréquences, faire la somme des fréquences. Si on a des intervalles, on va se déplacer dans les intervalles, se placer dans le bon et chercher dans plus fin.

On va réaliser une interpolation linéaire.

Q6 → 60% ont un âge inférieur

1 sera la dernière valeur. Le quantile d’ordre 1 sera le maximum de la distribution. Le quantile d’ordre 0 sera le minimum.

- [[fmt:yellow]]Maximum [[/fmt]]: p=1, Q(1) = max ([[fmt:italic]]x[[/fmt]][[fmt:italic]]i[[/fmt]][[fmt:italic]]) = [[/fmt]][[fmt:italic]]x[[/fmt]][[fmt:italic]]n[[/fmt]]

- [[fmt:yellow]]Minimum [[/fmt]]: p=0, Q(0) = min ([[fmt:italic]]x[[/fmt]][[fmt:italic]]i[[/fmt]]) = [[fmt:italic]]x[[/fmt]][[fmt:italic]]1[[/fmt]]

- [[fmt:yellow]]Médiane [[/fmt]]: p=0,5, Q(0,5) = Me (c’est une des « tendances centrales »).

- Si n impair : on prend la valeur centrale

- Si n pair : on a 2 valeurs centrales

- Soit on prend les 2 valeurs (intervalle médian)

- Soit on prend la moyenne des deux valeurs

- [[fmt:yellow]]Quartile [[/fmt]]: p appartient (0.25, 0.5, 0.75), par exemple Q1 = Q(0.25) = premier quartile

- [[fmt:yellow]]Décile [[/fmt]]: p appartient (0.1, 0.2 … 0,99), par exemple C7 = Q(0.07) = septième centile

- [[fmt:yellow]]Centile[[/fmt]] : p appartient (0,01, 0,02 … 0,99), par exemple C7 = Q(0.07) = septième centile

Il y a d’autre façon de trouver le centre que la médiane.

## [[fmt:underline,red-text]]Tendances centrales[[/fmt]]

Sur une [[fmt:green]]échelle nominale[[/fmt]], on ne va [[fmt:yellow]]rien avoir[[/fmt]] (on n’a pas une moyenne entre oui et non)

Sur une [[fmt:green]]échelle ordinale[[/fmt]] (ou mieux), on va avoir la [[fmt:yellow]]médiane[[/fmt]] (au sens des fréquences)

Sur une [[fmt:green]]échelle intervalle[[/fmt]] (ou rapport), on va prendre le [[fmt:yellow]]milieu[[/fmt]] (centre au sens des distances). Par exemple, pour un tableau de 4 mètre, on va prendre 2 mètre qui est le milieu. On va aussi avoir la [[fmt:yellow]]moyenne[[/fmt]] (centre qui combine la distance et la fréquence).

Formule de la moyenne :

Pour calculer une moyenne, l’une des méthodes est de prendre toutes les valeurs, de les additionner et de les diviser par le total. On peut aussi multiplier les nombres entre eux.

## [[fmt:underline,red-text]]Propriétés de la moyenne[[/fmt]]

Il existe la [[fmt:green]]notion d’associativité[[/fmt]]. On peut prendre l’exemple des notes pondérées par des coefficients. La moyenne du semestre est la moyenne des notes sur chaque UE pondérées par leur coefficient. La moyenne de chaque UE est la moyenne pondérée des notes aux examens.

La [[fmt:green]]notion d’intermédiarité[[/fmt]] est de la logique, puisque le centre n’est pas un extrême (min < moyenne < max)

La [[fmt:green]]p[[/fmt]][[fmt:green]]ropriété barycentrique[[/fmt]] est la [[fmt:yellow]]somme des écarts à la moyenne est nul[[/fmt]]. On peut penser à l’équilibre des poids sur une balance (notion de couple en physique).

La [[fmt:green]]notion de linéarité[[/fmt]] est :

## [[fmt:underline,red-text]]Indices de dispersion[[/fmt]]

On va avoir des [[fmt:green]]indices de dispersion[[/fmt]]. Elle se crée toujours selon une question & une échelle disponible. Elles sont fortement liées aux [[fmt:yellow]]indices de positions[[/fmt]].

Si les valeurs s’étalent sur plus de classe ou sont équilibrées entre classe, plus elles seront grande. Elles sont toujours au-dessus de 0. Si c’est égal à 0, elles n’auront qu’une seule valeur.

## [[fmt:underline,red-text]]Entropie et écarts entre observations[[/fmt]]

Il n’y a [[fmt:yellow]]pas besoin d’ordre[[/fmt]], cela s’applique même sur du nominal. On retrouve l’entropie en physique, chimie, médecine, biologie, traitement du signal…

On a plusieurs écarts entre les observations :

- Etendue = max – min

- Intervalle inter-quartile = IQ = Q3 – Q1

- Ecart quadratique :

## Encadrés et annotations du document

Ω3

10/12h 05/02

QUINTON Jean-Charles

Ω4

10/12h 12/02

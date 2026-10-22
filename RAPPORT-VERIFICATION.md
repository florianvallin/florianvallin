# Vérification de Philosophal V39

Date : 22 octobre 2026. Base : V38, après validation des quatre extraits par Florian.

## Changements

- Recherche globale : deux groupes « Accès directs » et « Textes et ressources ». Les outils, la médiathèque publique, les boussoles, les parcours et les rubriques de navigation utilisent une carte teintée, une icône et une catégorie explicite. Les articles, textes et définitions gardent un style sobre.
- Trois entrées de boussole ajoutées : philosophie, Bible et mythologie. Une recherche « boussole » propose les trois entrées avant les parcours de lecture.
- Une définition ouverte dans une boussole reste classée comme ressource. Le minuteur Pomodoro et son article explicatif sont visuellement distincts.
- Sélecteur « Détaillé / Compact » sur la liste des séries et les pages d’épisodes. Le mode compact réduit les visuels et les espacements ; les descriptions et les liens restent disponibles, les extraits se déplient sans réduction de leur taille de lecture.
- Préférence commune mémorisée dans le navigateur. Mode détaillé par défaut, fonctionnement maintenu si le stockage est bloqué, présentation détaillée accessible sans JavaScript.
- Les quatre extraits approuvés et leurs références restent identiques à la V38 validée. Les dates du 23, 25 et 27 octobre 2026, heure de Paris, restent appliquées dans les deux vues.

## Vérifications automatiques

- 365 pages contrôlées ; zéro erreur, zéro note.
- 238 contrôles de navigation réussis : recherches d’outils, médiathèque, boussoles et sauvegarde, distinction article/outil et définition/navigation, restauration et changement du mode d’affichage, stockage bloqué, raccourcis, thème et cache.
- Six tests de calendrier réussis, y compris les limites de minuit et le changement d’heure. Les extraits validés s’ouvrent à leur date ; le mode d’affichage ne lit ni ne modifie les données de publication.
- Suites publiques et qualité réussies ; 41 contrôles de qualité.
- Audit de 365 pages, 324 titres publics et 466 paires de couleurs sombres : zéro erreur.
- 291 textes intégraux et leurs annotations préservés.
- Fichiers privés identiques à ceux de la V38.

## Vérifications dans Chromium

- Recherche Pomodoro : carte d’accès direct au minuteur et article explicatif séparés, en thème sombre sur ordinateur et en thème clair dans une fenêtre de 320 px.
- Recherche des boussoles : les trois destinations sont proposées en premier.
- Absence de débordement horizontal de la recherche à 320 px.
- Bascule Détaillé / Compact sur ordinateur ; les cartes deviennent moins hautes et tous les liens restent accessibles.
- Choix compact restauré sur la liste des séries et lors du chargement d’une page d’épisodes.
- Extrait du Banquet ouvert et lisible en mode compact à 390 px ; taille de texte 16 px, interligne 29,6 px. Le rendu utilise le même texte et la même référence dans les deux modes.
- Commandes d’affichage et cartes compactes à 320 px, en thème sombre, sans débordement horizontal.

Les contenus futurs ont été vérifiés dans une simulation isolée au 27 octobre, exclue de l’archive et de la version publique. Les petits écrans sont simulés ; aucun téléphone physique n’a été utilisé.

## Livraison

Archive complète Philosophal-V39.zip, générée pour le 22 octobre 2026. La sortie publique exclut les scripts, les sources éditoriales et les simulations. Les corrections précédentes et les quatre validations d’extraits sont conservées. Aucun déploiement distant effectué. Le guide de la série décrit l’activation du workflow quotidien GitHub et les limites de ses horaires d’exécution.

# Philosophal — V32

Cette version corrige le menu public, supprime le comparateur philosophique et améliore le lecteur EPUB. Les autres fonctions de la V31 sont conservées : formulaire prérempli, sauvegarde globale, contenus privés chiffrés et vérifications avant publication.

## Installation

1. Conservez votre précédente archive ZIP.
2. Décompressez **philosophal-v32.zip** dans un dossier temporaire.
3. Ouvrez le dossier actuel du site, celui qui contient `index.html` et votre dépôt Git — votre dossier `main` habituel.
4. Copiez tout le contenu de cette archive dans ce dossier, en acceptant le remplacement. Le dossier `.github` fait partie de la mise à jour.
5. Double-cliquez sur **NETTOYER-ANCIENNE-VERSION.cmd**. Il retire l’ancien comparateur, les anciens fichiers privés en clair et l’éventuel second dossier `main/`. Ils sont archivés à côté du site ; votre dossier Git est conservé. Cette étape est nécessaire après une copie par-dessus une ancienne version.
6. Lancez **VERIFIER-AVANT-ENVOI.cmd** si Python est installé. Le résultat attendu est « Publication autorisée par le contrôle ». Les mêmes contrôles sont exécutés sur GitHub.
7. Ouvrez `index.html` avec Live Server dans VS Code. Testez le menu, la page Outils et le lecteur à `/epub/` avec un de vos livres.
8. Envoyez les changements à GitHub comme pour la V31. Conservez **GitHub Actions** comme source de GitHub Pages. Si cela n’a pas encore été configuré : dépôt → **Settings** → **Pages** → **Source** → **GitHub Actions**. Gardez le domaine `philosophal.fr`.

Le fichier personnel **ACCES-PRIVES-PHILOSOPHAL-V31.txt** reste valable. Conservez-le hors du dossier publié. Aucun mot de passe n’est inclus dans ce ZIP.

## Menu

- **Outils** se trouve juste avant la recherche sur les 326 pages qui utilisent le menu principal, sur ordinateur et dans le menu mobile. Il utilise les couleurs habituelles des liens.
- **Contactez-moi** conserve son violet, indépendamment de sa place dans le menu.
- Le comparateur philosophique et ses liens sont supprimés. Outils propose l’éditeur de texte, l’éditeur d’image, les outils PDF, le Pomodoro et le lecteur.
- La sauvegarde complète reste accessible depuis Outils. Elle inclut les livres importés, les documents et les données de lecture, y compris les associations de doubles pages.

## Lecteur EPUB

- **Auto / 1 page / 2 pages** : le choix est disponible directement dans la barre de zoom et dans les réglages **Aa**. Il est mémorisé pour chaque livre.
- **Pages** ouvre les miniatures. Cliquez sur une miniature pour rejoindre sa position. Les deux pages affichées sont encadrées ensemble. Le curseur **Taille** ajuste la grille ; **Aller à** permet de saisir un numéro.
- Pour les **EPUB de texte**, les aperçus et la numérotation correspondent à l’écran, à la police, aux marges et au zoom. Le calcul est renouvelé après un changement de mise en page. Ces numéros peuvent différer d’une édition imprimée. Le mode défilement conserve des aperçus du mode paginé.
- Pour les **livres illustrés**, choisissez le début des doubles pages : couverture seule, puis 2 + 3 ; ou dès la première page, 1 + 2. Les images panoramiques restent entières. Les indications gauche/droite du livre sont prises en compte en mode automatique.
- Pour **associer deux pages**, cochez deux miniatures voisines, puis cliquez sur **Associer les 2 pages**. La paire est conservée après rechargement. **Dissocier**, la croix d’une paire et **Tout réinitialiser** permettent de retirer ces associations. Créer une paire en mode 1 page active l’affichage à deux pages.
- Le **zoom** recalcule les colonnes d’un EPUB de texte. Dans un livre illustré, il agrandit les pages et permet de parcourir l’image. À 100 %, les doubles pages sont entièrement visibles.
- **Clavier** : gauche/droite pour tourner les pages ; haut pour avancer de dix pages et bas pour reculer de dix pages. Ces touches fonctionnent aussi après un clic dans le texte du livre. Les champs de saisie gardent leurs touches habituelles.
- Les **pages mixtes** conservent leur mise en page complète, leurs images et leurs textes superposés. Les mangas gardent leur sens de lecture ; les CBZ restent pris en charge.
- Les moteurs de lecture sont inclus dans le site et chargés localement avec des versions fixes. Le dossier complet du lecteur pèse environ **0,85 Mo**. Vos livres restent dans le navigateur ; aucun livre importé n’est envoyé au site.

Avant de changer d’appareil ou de navigateur, emportez vos livres et vos notes avec **Outils → Sauvegarde complète**.

## Vérifications effectuées

- 350 pages contrôlées : liens locaux, références CSS, syntaxe JavaScript, archives chiffrées et fichiers obsolètes.
- 326 menus principaux contrôlés ; ordre et couleurs testés dans le navigateur sur plusieurs pages et sur mobile.
- Lecteur testé dans Chromium avec cinq livres de contrôle : EPUB de texte, EPUB illustré, EPUB mixte, manga EPUB et CBZ. Les essais couvrent les miniatures, la pagination, les paires personnalisées et leur conservation, les panoramas, le zoom, le clavier, le défilement, les polices et marges, les clics rapides, le mobile et le paysage.
- Accès propriétaire et élève vérifiés avec les archives de cette version ; sauvegarde globale et restauration vérifiées.
- Nettoyage testé sur une copie contenant un ancien comparateur et un dossier `main/` imbriqué.

L’archive est prête à installer. La publication sur votre dépôt et votre domaine est à effectuer depuis votre PC.

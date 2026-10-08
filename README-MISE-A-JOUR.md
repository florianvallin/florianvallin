# Philosophal — corrections du 8 octobre 2026

## Corrections

- Header : retour à Inter, avec une graisse plus légère et un espacement plus naturel. La police est incluse dans le site et préchargée sur les 326 pages du menu principal.
- Bouton « Contactez-moi » : forme arrondie, dégradé lavande légèrement rosé, texte violet lisible et petite bulle de discussion. Le survol conserve ces teintes lumineuses.
- Médiathèque : icônes présentes dès l’ouverture, styles des commandes flottantes chargés avant leur affichage et emplacements sobres pendant la préparation du catalogue. Le dernier accès autorisé reste restauré.
- Contact : « Je vous réponds dans un délai de 48 heures. »
- Qui suis-je : les cours actuels à titre privé, via Acadomia et MyMaxicours sont distingués du tutorat universitaire passé.
- Accroche : « Bénéficiez d’un accompagnement personnalisé pour structurer votre réflexion, maîtriser les exercices et gagner en autonomie. »
- Deux chemins de fichiers du téléprompteur ont été rétablis ; le contrôle des outils publics a été adapté à leur page actuelle.

## Installation dans le dossier existant du site

1. Décompressez **florianvallin.zip** dans un dossier temporaire.
2. Ouvrez votre dossier habituel du site dans VS Code : il contient `index.html`.
3. Copiez le contenu du dossier **florianvallin** de l’archive dans ce dossier, en acceptant le remplacement des fichiers.
4. Vérifiez l’accueil et la médiathèque avec Live Server, puis envoyez les modifications à GitHub selon votre procédure habituelle.

Les références des fichiers modifiés ont été mises à jour pour renouveler le cache après publication.

## Menu

- **Explorer** regroupe Textes et Blog.
- **Outils** reste accessible dans la navigation principale.
- **À propos** regroupe Qui suis-je ? et FAQ.
- Le bouton **Contactez-moi** conserve sa couleur violette.
- Le menu mobile conserve les mêmes liens et la recherche.

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

## Vérifications de cette mise à jour

- Contrôle des 354 pages, des liens locaux, de la syntaxe JavaScript et des empreintes des archives privées : aucune erreur ni note.
- Tests publics : offres du formulaire, liens des cinq outils et séparation des ressources publiques et personnelles.
- Essais dans Chromium sur des écrans de 320 à 1 440 pixels : header, menus, recherche, filtres et ouverture de l’accès élève.
- Chargement ralenti simulé : les emplacements de la médiathèque restent affichés jusqu’à la fin de l’initialisation. Un échec du script propose de réessayer.


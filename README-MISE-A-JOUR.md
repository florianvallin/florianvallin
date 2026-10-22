# Philosophal V39 — 22 octobre 2026

Version complète issue de la V38 validée, avec recherche distinguant les accès directs et les contenus, et choix d’affichage des vidéos. Les corrections précédentes sont conservées. Les pages HTML sont déjà générées pour le 22 octobre 2026 et peuvent être consultées avec Live Server.

## Tester dans VS Code

1. Décompresser Philosophal-V39.zip dans un nouveau dossier.
2. Ouvrir le dossier florianvallin qui contient index.html dans VS Code.
3. Lancer index.html avec Live Server depuis ce dossier, à la racine du serveur.
4. Actualiser avec Ctrl + F5 si une ancienne version apparaît.

## Mettre à jour le dossier Git existant

Faire d’abord une copie de sauvegarde du dossier actuel, hors du site.
Copier ensuite le contenu du dossier florianvallin de cette archive dans le dossier existant, en remplaçant les fichiers. Conserver le dossier .git existant.

Dans le terminal de VS Code, à la racine du site, exécuter :

```text
python scripts/nettoyer_ancienne_version.py
```

Cette étape est nécessaire si les nouveaux fichiers ont été copiés par-dessus l’ancien dossier : copier une archive ne retire pas les anciens fichiers. Le script déplace hors du site les anciens dossiers main/ et correctif/, le billet blog/desir-bonheur-quatre-textes/, et les anciens fichiers déjà listés comme obsolètes. Leur sauvegarde est placée à côté du dossier du site. Le dossier .git reste conservé.

Pour publier, inclure les suppressions de fichiers dans le commit, ainsi que les ajouts et modifications. Le workflow GitHub fourni prépare la version publique et effectue les vérifications.

## Nouveautés V39

- Recherche : les outils, la médiathèque publique, les boussoles, les parcours et les rubriques de navigation sont réunis sous « Accès directs ». Fond lavande, icônes et catégories les distinguent des textes, articles et définitions. La distinction reste lisible dans les deux thèmes et sur téléphone.
- Les trois boussoles sont proposées directement : philosophie, Bible et mythologie. Le lecteur et la sauvegarde des données des outils bénéficient du même traitement. Les définitions restent des contenus, même lorsqu’elles s’ouvrent dans une boussole.
- Vidéos : sélecteur « Détaillé / Compact » sur l’index des séries et les pages d’épisodes. Le mode compact réduit les visuels et les espacements ; les descriptions, liens et extraits restent disponibles. Les extraits ouverts conservent leur taille de lecture. Le choix est mémorisé dans le navigateur et reste utilisable si le stockage est bloqué. Sans JavaScript, le mode détaillé reste disponible.
- Les quatre extraits validés restent soumis au calendrier du 23, 25 et 27 octobre 2026. Aucun mode d’affichage ne donne accès aux contenus avant leur date.

## Corrections précédentes conservées

- Menu mobile centré ; bouton S’identifier présent ; boutons du header de 44 × 44 px sur petit écran. Champs de saisie plus lisibles et formulaire empilé sur les petits téléphones.
- S’identifier accepte media, medias, mediatheque et mediatheques, avec accents ou majuscules. La saisie seule ne provoque pas de redirection : valider avec Accéder ou Entrée.
- Recherche : tous les outils existants, téléprompteur, lecteur multiformat, et médiathèque publique. Suggestions PDF, Téléprompteur et Médiathèque ajoutées.
- Suppression du billet Le désir nous rend-il heureux ? Quatre textes, de ses cartes et des deux index de recherche.
- Descartes déplacé dans le fond à gauche de Me joindre, avec le nez visible, hors de la carte. Disposition adaptée au téléphone et à la tablette. Le raccord continu entre Méthodologie et Qui suis-je est conservé dans les deux thèmes.
- Liens CGU et Confidentialité alignés, sans soulignement, dans le style des autres liens légaux.
- Page 404.html à la racine, avec retour à l’accueil et recherche.
- Épisode 1 : liens TikTok et YouTube. Épisodes 2, 3 et 4 disponibles les 23, 25 et 27 octobre 2026, selon le jour de Paris. Avant leur date, seuls le titre et la date sont publics. Le workflow fourni reconstruit quotidiennement les pages ; voir LIRE-MISE-A-JOUR-SERIES.md pour l’activation dans GitHub Pages et les limites des tâches planifiées.
- Quatre extraits de Platon dans la traduction Chambry, contrôlés sur les fac-similés et validés par Florian le 22 octobre 2026. Dépliants accessibles, guillemets et références activés pour leur date respective : 23, 25 et 27 octobre. Aucun extrait avant le jour de son épisode.
- Six outils en deux lignes de trois sur ordinateur, téléprompteur en sixième position ; deux colonnes sur tablette et une sur téléphone.
- Correction de deux entrées héritées : liens relatifs de /apprendre/ et accès à l’espace Création. Métadonnées des anciennes redirections et des pages de secours remises en cohérence.

## Page 404

GitHub Pages utilise le fichier 404.html pour une adresse introuvable après publication. Dans Live Server, ouvrir /404.html pour prévisualiser la page ; son serveur local peut afficher sa propre erreur pour une adresse inconnue. Une page 404 concerne les adresses absentes : elle ne remplace pas les erreurs internes d’un outil ni les erreurs de connexion du navigateur.

## Vidéos

Modifier scripts/series-content/episodes.json puis exécuter :

```text
python scripts/generer_series.py
```

Les champs plannedDate renseignent le jour d’ouverture ; les tableaux videos renseignent les liens disponibles. Les quatre extraits sont dans scripts/series-content/excerpts.json et sont tous validés. Le guide LIRE-MISE-A-JOUR-SERIES.md explique la publication quotidienne et le maintien du verrou de date. Le JSON sous series/ est une sortie filtrée, jamais la source éditoriale.

Les archives privées chiffrées et leurs accès sont conservés. Les livres et documents importés dans le navigateur ne sont pas contenus dans l’archive du site.

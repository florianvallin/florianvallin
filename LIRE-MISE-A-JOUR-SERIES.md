# Philosophal — correctifs Vidéos, raccourcis et Textes — V2

## Installer

Ce correctif est cumulatif : il comprend la création des pages de vidéos et
les corrections suivantes. Il peut être appliqué à la version
« florianvallin(6).zip » ou après le premier correctif Séries.

1. Décompresser le ZIP dans un dossier temporaire.
2. Copier tout son contenu dans la racine du site : le dossier qui contient
   déjà index.html, css, js, textes, etc.
3. Fusionner les dossiers et remplacer les fichiers du même nom.
4. Tester avec Live Server, puis envoyer les changements sur GitHub.
5. Si l’ancien affichage persiste, faire Ctrl + F5.

Ne pas supprimer les autres fichiers : le ZIP contient uniquement les fichiers
nouveaux ou modifiés. Aucune suppression n’est nécessaire.

## Navigation et raccourcis

Le header contient maintenant un lien direct « Vidéos », entre Blog et Outils,
sans dépliant. Ce lien ouvre /series/ ; la carte Philosophie de l’amour est
entièrement cliquable et ouvre la page des épisodes.

Les combinaisons Alt sont désormais gérées au même endroit pour les pages et
les outils. Les anciennes interceptions contradictoires ont été retirées des
éditeurs et du Pomodoro. Les lettres du clavier AZERTY sont prises en compte.

| Raccourci | Destination |
| --- | --- |
| Alt + C | Médiathèque |
| Alt + A | Art |
| Alt + L | Livres |
| Alt + B | Boussole biblique |
| Alt + M | Boussole mythologique |
| Alt + P | Boussole philosophique |
| Alt + H | Accueil |

Sur les pages de navigation, T ouvre Textes, B le Blog, H l’accueil, C le contact
et P le Pomodoro. Les commandes de pagination P des lecteurs sont conservées.
Les raccourcis de navigation ne se déclenchent pas pendant une saisie de texte.
L’aide clavier a été mise à jour.

La page Médiathèque ne redirige plus vers le Pomodoro : elle ouvre son propre
accès protégé et utilise les contenus privés existants. Les accès et les
archives chiffrées sont conservés.

## Page Vidéos

- Description remplacée et mention « Vidéos et Textes sources ».
- Carte de série limitée au titre et au nombre d’épisodes.
- « amour » en violet et italique ; toute la carte est cliquable.
- CTA discret « Prendre un cours » en bas de page.

## Philosophie de l’amour

- En-tête réduit au titre et à la phrase « Un épisode, une question,
  des textes pour aller plus loin. »
- Introduction et deux boutons du haut retirés.
- Mots-clés, extraits dépliants et pistes de lecture retirés des épisodes.
- Liens vers les textes conservés.
- Mention « Du premier au plus récent » retirée.
- Bloc réseaux simplifié : « Les vidéos sur les réseaux ».
- CTA pour les cours particuliers placé en bas de page.

Les liens directs des vidéos restent à renseigner ; leurs emplacements sont prêts.

## Textes

L’entrée du catalogue est fournie dans ce correctif. L’ancienne copie sous
/main/textes/ renvoie vers le catalogue actuel, au lieu d’afficher un lecteur
sans texte sélectionné. Les versions des scripts ont été actualisées pour
éviter les anciennes copies mises en cache. Les fiches de lecture restent accessibles.

## Ajouter des liens vidéo ou un épisode

Le contenu est conservé dans :
series/philosophie-de-l-amour/episodes.json

Pour une vidéo, remplacer son tableau videos vide par un ou plusieurs liens :

```json
"videos": [
  {"label": "Voir sur TikTok", "url": "COLLER_LE_LIEN_HTTPS_DE_LA_VIDEO"}
]
```

Remplacer l’exemple par la vraie adresse. Après avoir modifié les données,
régénérer les pages depuis la racine avec Python 3.12 ou plus récent :

```text
python scripts/generer_series.py
```

Envoyer ensuite sur GitHub les données et les deux pages HTML générées.
Les pages livrées sont déjà générées : aucune installation n’est nécessaire
pour les consulter.

## Vérifications

- 41 vérifications de navigation, dont AZERTY, Ctrl/AltGr, champs de saisie,
  destinations Alt et absence de conflit avec les lecteurs.
- Test du lien Vidéos et de la carte entièrement cliquable dans le navigateur.
- Test d’Alt + C jusqu’à l’accès Médiathèque sans authentification de test.
- Ouverture du catalogue Textes, recherche « androgyne » et lecture de sa fiche.
- Contrôle des liens locaux et des ressources nécessaires aux nouvelles pages.
- Vérification syntaxique des scripts JavaScript modifiés.

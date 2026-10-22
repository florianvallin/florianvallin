# Téléprompteur V2 — Philosophal

## Installation

Décompressez ce ZIP, puis copiez son contenu à la racine de votre site en acceptant le remplacement des fichiers correspondants. Conservez les autres fichiers de votre site. Vous pouvez ensuite publier ces changements sur GitHub comme d’habitude.

Ouvrez `/apprendre/creation/teleprompteur/`. Rechargez la page avec Ctrl + F5 si l’ancienne interface est encore affichée.

## Ce qui change

- Deux onglets, Script et Réglages, pour dégager la préparation et garder la lecture au premier plan.
- Mode lecture pour replier le panneau. Le bouton Commandes permet aussi de masquer les commandes du lecteur ; le bouton Afficher les commandes ou Échap les fait revenir.
- Colonne réglable en largeur et en position horizontale, avec accès direct Gauche, Centre et Droite.
- Repère déplaçable entre 15 % et 75 % de la hauteur du lecteur. Faites glisser sa poignée ou utilisez le réglage de hauteur. Deux apparences : ligne discrète et bande de lecture.
- Conservation du passage lu quand vous corrigez le script, changez la taille, la largeur, la police, l’interligne ou la disposition de l’interface. Une correction met la lecture en pause.
- Reprise du passage et du temps de lecture après rechargement, toujours en pause. La reprise attend aussi les polices locales pour éviter un décalage.
- Disposition adaptée aux téléphones et tablettes ; le mode lecture remplit la place disponible. Un premier usage sur petit écran utilise une colonne plus large et une taille plus modérée.
- Accès Création de contenu réparé : le lien ouvre le téléprompteur, et l’espace de création conserve son accès privé.

Les fonctions existantes restent disponibles : import de texte .txt/.md, export .txt, copie, estimation du temps, vitesse réglable, départ différé, miroir, boucle, repères par paragraphe, dix ambiances et couleurs personnalisées. La palette du lecteur reste indépendante du thème clair/sombre du site.

## Votre script existant

La V2 reprend automatiquement le texte et les réglages enregistrés par la V1 dans le même navigateur et à la même adresse de site. Elle garde également une copie locale de l’ancien enregistrement lors de cette migration. Le script ne quitte pas votre appareil ; le bouton Exporter .txt permet d’en garder une copie.

## Raccourcis de lecture

- Espace : lecture / pause.
- Flèches haut / bas : vitesse.
- Flèches gauche / droite : avancer / reculer dans le texte.
- Début : revenir au début.
- L : mode lecture.
- F : plein écran lorsque le navigateur le permet, avec mode lecture de remplacement.
- Échap : pause et retour des commandes.

Ces raccourcis ne se déclenchent pas pendant la saisie. Sur un bouton ou un réglage, le clavier garde son fonctionnement habituel. Les raccourcis Alt de navigation du site sont conservés.

## Vérification

Les scénarios de conservation du passage, de migration V1, de reprise après rechargement, de clavier, de départ différé, de couleurs et de disposition mobile ont été vérifiés dans le navigateur d’aperçu. Le plein écran natif n’y était pas disponible ; son remplacement par le mode lecture a été vérifié. Les huit tests de correspondance du texte se lancent avec :

```sh
node scripts/test-teleprompteur-v2.cjs
```

Cette mise à jour correspond à la V2 du plan : lecture et fiabilité. La bibliothèque de scripts, les reprises de prise et les commandes à distance restent pour les versions suivantes.

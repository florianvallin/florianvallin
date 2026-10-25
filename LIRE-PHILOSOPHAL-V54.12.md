# Philosophal V54.12 — Bibliothèque professionnelle 2.0

## Améliorations
- Détection exacte des doublons par comparaison d’octets, quelle que soit la différence de nom ou de date ; importation automatiquement ignorée uniquement si le contenu est strictement identique.
- Audit manuel des doublons préexistants. Sélection des copies excédentaires sans suppression automatique ; la suppression requiert une confirmation distincte.
- Affichage par lots de 75 médias, recherche légèrement temporisée, miniatures images/vidéos générées à la demande lorsqu’elles entrent dans la fenêtre visible.
- Miniatures légères mises en cache dans IndexedDB ; suppression des miniatures lorsqu’un média est supprimé.
- Conservation des données V54.9–V54.11 par migration IndexedDB de schéma de 1 à 2 : index de taille et nouvel espace pour les vignettes, sans altérer les médias.
- Limitations intentionnelles : pas de miniatures pour les pistes audio, génération vidéo limitée à 300 Mo et aux codecs reconnus ; les miniatures occupent un peu d’espace navigateur.

## Validation
- Les doublons sont comparés en blocs mémoire bornés (256 Kio), sans charger intégralement un fichier volumineux pour effectuer la comparaison.
- Les médias locaux ne sont jamais transmis à un service externe.
- Le navigateur reste la seule source de stockage : procéder à une sauvegarde sur disque pour les originaux importants.
- Aucun changement de la timeline, des projets Cut ou des identifiants de bibliothèque.
- Les tests en navigateur pour supports/codec particuliers restent nécessaires.

## Suites
- V54.13 : sauvegardes automatiques renforcées et points de restauration.
- V54.14 : transcription et sous-titrage avancés.

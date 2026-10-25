# Philosophal V54.13 — Points de restauration et sauvegardes intelligentes

- Historique local séparé (IndexedDB) pour les projets Studio : copies automatiques espacées d’au moins 15 minutes **après sauvegarde réelle** ; une copie complète inclut les médias stockés avec le projet dans la limite de 30 Mo.
- **Avant toute suppression d’un projet Studio**, création obligatoire d’un point restaurable ; si la création échoue, la suppression est bloquée. Restauration en nouveau projet sans écrasement.
- **Avant suppression de médias partagés**, copie complète dans les limites de 25 Mo/média et 25 médias par opération. Suppression bloquée si la protection échoue ; depuis Sauvegardes pro, restauration manuelle des médias.
- **Cut** : points automatiques sur enregistrement local, conservant les clés de réglages et de montage présentes dans localStorage. Les rushs d’origine restent nécessaires. En cas de restauration Cut, création d’un point de sécurité des préférences actuelles puis confirmation explicite ; les clés identiques peuvent être remplacées.
- Tableau des points de restauration sur `/outils/sauvegarde-pro/`, création manuelle, volume des copies, restauration guidée et suppression volontaire.
- Conservation maximale : 3 anciens points automatiques par source (rotation), enveloppe estimée 220 Mo. Points manuels ou « avant suppression » non purgés automatiquement ; contrôle explicite de l’utilisateur.

## Limites critiques
- **Il ne s’agit pas d’une sauvegarde sur un autre support** : effacer les données du navigateur efface aussi ces points. Toujours télécharger régulièrement un ZIP V54.10 sur disque.
- Projets Studio >30 Mo et médias >25 Mo : export requis avant suppression, autrement celle-ci est bloquée. Ce mécanisme est volontairement conservateur.
- La sauvegarde des points n'est déclenchée que lorsque la page Studio ou Cut est ouverte et qu'une sauvegarde réelle est réalisée ; aucun processus en arrière-plan serveur.
- La restauration Cut ne recrée pas les fichiers de rushs externes ; réimporte les médias originaux.
- Protection professionnelle toujours côté navigateur, sans contrôle serveur.
- Les tests automatiques de structure et des interactions simulées ne remplacent pas des essais avec de vrais médias sur Brave.

## Prochaines versions
- V54.14 : transcription et sous-titres avancés.
- V54.15 : workflow audiovisuel unifié.

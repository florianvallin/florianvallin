# Philosophal V54.15 — Workflow audiovisuel unifié

## Envoi Studio → Cut
- Transfert individuel enrichi : le média, ses sous-titres horodatés, ses marqueurs annotés et sa transcription continue (si même source) peuvent être conservés ensemble. Projet/épisode libre.
- Transfert groupé : prises ouvertes de la session Studio (option), fichiers locaux, association d’un .srt/.vtt ou d’une fiche `.markers.json` par nom de fichier ; limite de 12 médias et 2 Go de lot déjà existante.
- La cohérence des sources est vérifiée par identité du Blob dans la session : aucun texte d’une autre prise n’est associé sur simple ressemblance du nom.

## Réception et fiches Cut
- Les transferts continuent d’arriver dans la médiathèque ou comme rush principal **uniquement avec un choix explicite**.
- Les fiches audio/vidéo importées (sous-titres, marqueurs, transcription, projet) sont conservées dans une petite base IndexedDB dédiée, sans nouvelle copie des octets audio/vidéo.
- Nouveau bouton « Dossiers de production » dans Cut : fiche, exports SRT/CSV/JSON/TXT, navigation vers les marqueurs du rush compatible.
- Import des sous-titres sur la timeline autorisé uniquement si le rush actuellement ouvert a **le même nom et la même taille** que la source. Une confirmation explicite prévient le remplacement des sous-titres courants.
- En cas d’échec de sauvegarde de fiche, le transfert temporaire reste disponible pour récupération ; les médias ne sont pas supprimés silencieusement.

## Limitations
- Le transfert nécessite le même navigateur et la même origine du site, espace IndexedDB suffisant. La protection pro reste côté navigateur (pas une protection serveur).
- L’identification du rush par nom + taille **n’est pas une preuve cryptographique** ; il faut vérifier le contenu et l’alignement temporel avant de remplacer des sous-titres.
- Les marqueurs restent des fiches de référence consultables dans Cut, ils ne sont pas encore des marqueurs natifs de timeline. Les sous-titres des lots ne sont jamais automatiquement placés sur le montage.
- La limite de stockage ne dépend pas seulement de la taille du ZIP ; exporter régulièrement sur disque. Whisper réel et compatibilité codec restent à valider sur la machine de travail.

## Deux prochaines versions
- V54.16 — Contrôle qualité des exports, validation des durées et robustesse des transferts.
- V54.17 — Optimisation des sessions volumineuses, cohérence des projets et importations associées.

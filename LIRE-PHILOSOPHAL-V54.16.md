# Philosophal V54.16 — Contrôle qualité des exports et transferts

## Améliorations
- Nouveau module commun « Contrôle qualité » dans Studio audiovisuel (onglet Exports) et Philosophal Cut (barre du haut), avec choix de fichiers audio/vidéo et de sous-titres SRT/VTT.
- Inspection **locale** : taille, signature du conteneur (WAV, WebM, MP4/M4A, Ogg, MP3, FLAC), métadonnées de durée si le navigateur peut les décoder, comparaison facultative avec le rush ouvert et contrôles des sous-titres (temps invalides, hors durée, chevauchements).
- Rapports de contrôle téléchargeables en JSON et dernier rapport d’export consultable dans le Studio.
- Les exports Studio passent par un contrôle de signature avant téléchargement. Un conteneur manifestement incorrect bloque l’export ; les écarts de durée sont signalés comme réserves et ne sont pas présentés comme une validation de synchronisation labiale.
- La passerelle Studio → Cut enregistre une empreinte **échantillonnée** SHA-256 (taille + premiers/derniers 64 Kio) ; le récepteur la revérifie, et les médias ne sont importés que si les fichiers sont accessibles et cohérents.
- Validation des sous-titres avant de les appliquer au rush : rejet des segments qui dépassent la durée, vérification de l’empreinte du média lorsqu'elle est disponible et protection du montage existant.
- Le transfert des lots conserve ses limites et sa transaction atomique. Les anciennes fiches et les transferts déjà existants restent lisibles.

## Contrôles réalisés
- Analyse syntaxique Node.js des scripts JavaScript modifiés et des scripts inline des deux éditeurs : réussie.
- Tests du contrôleur de fichiers dans Chromium isolé : durée WAV, mauvais conteneur sous extension MP4/WebM, sous-titres hors durée.
- Tests de l’interface de vérification et téléchargement du rapport JSON avec fichier WAV synthétique : réussis.
- Validation des liens internes et de l’intégrité de l’archive ZIP complète.

## Limitations
- La synchronisation fine **image/son** n’est pas mesurée : les tests automatiques vérifient uniquement la cohérence des métadonnées, durées et sous-titres. Vérifier les exports en lecture.
- Une empreinte échantillonnée n’est **pas** le hachage complet du fichier : elle sert à détecter des incohérences lors d’un transfert sans relire de gros rushs entièrement.
- Les formats non pris en charge par le navigateur peuvent présenter une durée indéterminée. Dans ce cas, le résultat est marqué « à vérifier », et non « conforme ».
- L’environnement de test bloque la navigation Chromium vers le site local : les flux complets d’export en temps réel, d'IndexedDB et de réception doivent être testés dans Brave sur ton installation avant publication.
- Les protections du mode professionnel restent celles de la version précédente (contrôle côté navigateur).

## Deux prochaines versions
- V54.17 — sessions volumineuses : traitement progressif, contrôle des quotas, optimisation de la bibliothèque et des imports.
- V54.18 — maintenance et ergonomie : tableau de diagnostic professionnel, validations des périphériques/exports et simplification de la navigation entre studios.

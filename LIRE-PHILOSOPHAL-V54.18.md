# Philosophal V54.18 — Intégration de cinq applications

**Base :** archive complète V54.17 fournie par l’utilisateur. Les ressources existantes ont été conservées.

## Versions intégrées
- Cut V62 : /outils/philosophal-cut/ — accès professionnel (éditeur remplacé, passerelles V54.17 préservées).
- Kanban V15 : /outils/kanban/ — public.
- Pilotage V12.3 : /outils/pilotage/ — professionnel, ouverture depuis la session propriétaire.
- Mind Maps V12 : /outils/mindmap/ — public.
- OCR V12 : /outils/ocr/ — public.

## Intégration
- Remplacement des trois emplacements de la grille des outils par les cartes Kanban, Mind Maps et OCR (sans section supplémentaire ni doublons).
- Pilotage ajouté aux cartes professionnelles et au menu de navigation commun.
- Les passerelles existantes entre Studio audiovisuel et Cut (dont transferts et bibliothèque de médias), la récupération pro et le contrôle qualité ont été conservés lors du remplacement de Cut.
- Recherche interne du site enrichie ; Pilotage ne s’affiche dans les résultats qu’après identification.
- Pages professionnelles repérées « noindex » ; conservation de la connexion propriétaire existante, des accès et des autres fonctionnalités V54.17.

## Limites et précautions
- Philosophal est un hébergement statique : la page de connexion **n’est pas une protection serveur** des fichiers HTML en accès direct. Aucun secret ni donnée confidentielle ne doit être intégré au code public.
- Les outils autonomes enregistrent leurs données dans ce navigateur ou proposent leurs propres exports : le système global de sauvegarde du site n’englobe pas automatiquement tous leurs projets. Exporter régulièrement depuis chaque application.
- Fonctions avancées de Cut et OCR : certaines nécessitent des bibliothèques externes, de la mémoire, des médias d’essai et l’accord du navigateur ; elles ne sont pas garanties sans tests manuels.
- Aucune modification automatique du site en ligne n’est effectuée par ce ZIP.

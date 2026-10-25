# Philosophal V54.14 — Transcription et sous-titrage avancés

- Éditeur de transcription : début et fin de chaque passage modifiables précisément en secondes, avec raccourcis « début/fin = tête de lecture ». Annulation disponible.
- Lexique de correction personnalisable (une règle `forme => correction` par ligne), avec correspondances de mots entiers, sans modifier les repères temporels. Les règles restent dans le stockage local du navigateur. Les substitutions sont volontairement déclenchées par l’utilisateur ; elles peuvent comporter des faux positifs.
- Moteur Whisper : traitement par fenêtres de 24 secondes / pas de 22 secondes (recouvrement 2 s) et gestion plus robuste des timestamps absents, tout en conservant les messages de progression et l’arrêt.
- Sous-titres : profils Vidéo verticale, YouTube et Dialogue (ratio, police, seuil caractères par ligne, durée). Analyse interactive des dépassements de longueur, durées extrêmes, chevauchements et vitesse de lecture.
- Corrections réversibles des chevauchements et retours à la ligne. L’incrustation n’est pas intégrée au fichier vidéo ; exports SRT/VTT continuent de ne contenir que le texte et les repères.
- Le projet local Studio conserve les passages et sous-titres modifiés comme auparavant. Sauvegardes et bibliothèques précédentes conservées.

## Limites importantes
- Les temps produits par Whisper et les subdivisions automatiques sont approximatifs : contrôler à l’écoute.
- Le moteur doit télécharger ses dépendances/modèles au premier lancement. La transcription complète sur navigateur et matériel réel n’a pas pu être validée ici, et peut souffrir de limites de mémoire ou de compatibilité des codecs.
- Le mode « texte continu » appliqué supprime les repères de segments ; utiliser les passages horodatés pour conserver la synchronisation.
- Lexique : corrections volontaires seulement, préférences locales non incluses dans le ZIP de projet.
- La passerelle Studio → Cut reste basée sur les fichiers média, SRT et marqueurs existants ; évolution prévue V54.15.

## Prochaines versions
- V54.15 : workflow audiovisuel unifié Studio → Cut (médias, marqueurs, texte et sous-titres).
- V54.16 : contrôle qualité final des exports, vérification des durées et robustesse des transferts.

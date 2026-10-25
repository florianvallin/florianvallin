# Philosophal V54.4 — Studio audiovisuel : longues prises et fluidité

- Mode optionnel d’enregistrement **direct sur disque**, pour la voix (WAV PCM mono 16 bits) et les captures vidéo (WebM ou MP4 si le navigateur sait l’encoder).
- Les fragments sont écrits progressivement via File System Access API, avec tampon borné à 32 Mo, au lieu d'être conservés en mémoire pendant toute la prise.
- Choix du fichier avant la prise, statut de taille en direct et surveillance du volume en mémoire.
- Protection du mode standard : arrêt automatique avant que la mémoire n’augmente indéfiniment (180 Mo audio en PCM interne, 350 Mo vidéo).
- Maintien du lecteur et des médias récemment enregistrés dans la session après la finalisation ; transfert vers Philosophal Cut conservé.
- Les gros médias restent également visibles dans les modules, ce qui peut consommer du stockage si le projet est sauvegardé ; sauvegardez les gros rushs directement sur disque et prévoyez de la place.

## Limites
- Brave ou Chrome récents, HTTPS ou localhost pour l’enregistrement direct ; ce mode n'est pas disponible sur tous les navigateurs.
- Le fichier n’est finalisé que lorsque « Terminer » est actionné. Fermer brusquement l’onglet ou interrompre le système peut laisser un fichier incomplet.
- WAV classique plafonné à ~4 Go ; tous les enregistrements restent soumis à la capacité du disque et à la disponibilité des périphériques.
- Les essais de capture réelle exigent l’autorisation du navigateur : tests automatisés limités aux situations simulées.

## Changements contrôlés
- `outils/studio-audiovisuel/editeur.html`
- `outils/studio-audiovisuel/index.html`
- `js/pro-av-streaming-v54.4.js`

Aucune page publique ni le montage Philosophal Cut n’ont été modifiés.

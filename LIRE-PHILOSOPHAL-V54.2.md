# Philosophal V54.2 — Fiabilisation audiovisuelle

## Nouveautés
- Studio audiovisuel → **Diagnostic** → **Tester réellement mes appareils** : boutons distincts pour microphone, caméra et partage d’écran ; aucun fichier créé. Les pistes demandées sont arrêtées dès le test terminé.
- Détection du nombre de périphériques et des états d'autorisation lorsqu'ils sont exposés par Brave/Chrome.
- Le rapport JSON inclut désormais la liste des tests matériels effectués dans cette session, y compris les messages d’échec.
- Webcam : nettoyage du flux après erreur d’ouverture ou échec de lecture, afin de ne pas laisser de capture active en arrière-plan.
- Webcam/écran/microphone : libération du périphérique lorsqu’une autorisation est accordée **après** un changement de module.
- Messages d’erreur plus utiles pour les refus de permission, les périphériques absents ou utilisés par une autre application.
- Clarifications sur l'initialisation de Whisper (téléchargement initial du modèle, accès au CDN et repli Processeur).

## Vérifications & limites
- Les contrôles JavaScript et les parcours simulés en navigateur automatisé ne prouvent pas le bon fonctionnement d’un périphérique réel. Après publication en HTTPS, utiliser les **tests réels** du diagnostic de V54.2 sur Brave/Chrome et vos périphériques Windows.
- La transcription réelle Whisper dépend toujours du réseau pour le premier téléchargement, puis du matériel et des ressources disponibles.
- GitHub Pages reste statique et ne protège pas le code de l'application par une authentification serveur. L’accès pro demeure un contrôle navigateur.
- Les tests réels sont facultatifs et demandent explicitement une permission ; un test du partage d’écran affiche le sélecteur natif du navigateur.

## Publication
Remplacer les fichiers du dépôt avec le contenu du ZIP, à la racine du site, puis publier les modifications sur la branche déployée. Le studio est accessible depuis **Outils → Mes outils professionnels → Studio audiovisuel**.

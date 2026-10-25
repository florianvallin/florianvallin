# Philosophal V54.11 — Stabilité et ergonomie du mode Pro

## Améliorations réalisées
- Dans Philosophal Cut, disposition du moniteur, de l’inspecteur et de la timeline entièrement contenue dans la fenêtre (grille sans minima cumulatifs provoquant un débordement).
- Déduplication des barres de préréglages de montage : un sélecteur compact « Espace » permet de choisir entre cinq configurations, toutes conservées dans le menu complet « Affichage ».
- Poignées de répartition mieux visibles : moniteur/timeline (verticalement) et largeur d’inspecteur (horizontalement). Le séparateur de l’inspecteur est maintenant réglable au clavier (flèches, Maj pour des pas de 30 px), avec valeurs accessibles aux technologies d’assistance.
- Retour immédiat à la disposition équilibrée et double-clic sur une poignée pour revenir à une répartition raisonnable.
- Raccourci Ctrl+Alt+0 pour réinitialiser l’espace en mode Pro.
- Optimisation du comportement sur les petites fenêtres, en préservant les trois zones lorsque l’espace le permet.
- Fermeture des menus contextuels du montage au clic extérieur ou avec Échap.
- Conservation des préférences précédentes de Cut (localStorage V25/V27), sans migration destructive.

## Périmètre technique
- Ajout de `css/cut-workspace-v5411.css` et `js/cut-workspace-v5411.js` ; le moteur de montage, les pistes, les exports, les projets et les autres outils restent inchangés.
- Les contrôles statiques ne remplacent pas les vérifications réelles dans Brave, avec des rushs et des projets personnels.
- Le contrôle d’accès privé est inchangé et reste assuré côté navigateur, ce qui n'est pas une authentification serveur.

## Suite
- V54.12 : bibliothèque média optimisée : doublons, vignettes différées et importation volumineuse.
- V54.13 : sauvegardes plus robustes, points de restauration et récupération guidée.

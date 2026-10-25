# Philosophal V54.8 — Ajustements demandés

- Épisode 2 : date de disponibilité **25/10/2026** ; suppression du bouton redondant menant à l’ouvrage complet, seul l’extrait sur la page est conservé ; lien source renommé « Consulter la source publique de l’ouvrage ». Générateur de séries et pages HTML synchronisés.
- Header : icône outils remplacée par une clé à molette explicite dans les en-têtes existants, à droite du thème.
- Médiathèque : libellé « Élève » et « Accès élève » ; identifiants, logique des rôles et mots de passe inchangés.
- Raccourci **O** : ouvrir `/outils/` sur les pages du site (hors contexte de saisie et des éditeurs pro).
- Recherche : médiathèque sans étiquette public/privé ; outils professionnels ajoutés uniquement lors d’une session professionnelle active, sans indexation dans le catalogue public.

## Tests après mise en ligne
- Vérifier la recherche avant et après identification sur Brave. Les résultats pro ne doivent être visibles qu’en session pro.
- Vérifier le raccourci O hors champ de saisie sur les pages ordinaires.
- La protection des outils pro repose encore sur le contrôle navigateur de l’espace existant : elle n’équivaut pas à une authentification serveur.

# Philosophal — version complète corrigée du 14 octobre 2026

## Ouvrir la bonne version dans VS Code

1. Décompressez `philosophal-site-corrige-2026-10-14.zip` dans un nouveau dossier.
2. Le dossier obtenu s’appelle `philosophal`. Il contient directement `index.html`, `blog`, `outils`, `mediatheque`, `textes`, etc.
3. Dans VS Code : **Fichier → Ouvrir le dossier…**, puis choisissez ce dossier `philosophal`.
4. Ouvrez son `index.html` avec **Live Server**.
5. Le site doit être servi à la racine de Live Server : par exemple `http://127.0.0.1:5500/`. Testez `/blog/`, `/outils/`, `/mediatheque/` et `/textes/`.

Il s’agit d’une version complète, et non d’un petit correctif à imbriquer dans l’ancien projet. Gardez votre ancienne copie à part. Ne placez pas ce nouveau dossier dans l’ancien `main`, et n’ouvrez pas le dossier parent contenant plusieurs versions avec Live Server.

Pour la publication, la source est le contenu de ce nouveau dossier. Si vous l’intégrez dans votre copie Git existante, conservez son dossier `.git` et utilisez le nettoyage des anciens fichiers fourni dans `scripts/nettoyer_ancienne_version.py` après sauvegarde de votre ancienne copie. Ce nettoyage retire notamment l’ancien `main` imbriqué et les fichiers privés remplacés par des archives chiffrées.

Si votre navigateur affiche encore une ancienne page pendant le test, rechargez avec **Ctrl + F5**. Pour contrôler le premier affichage clair, utilisez une fenêtre de navigation privée : votre choix sombre volontaire reste mémorisé dans votre fenêtre habituelle.

## Ce qui est corrigé

- Première visite : **mode clair**, même si Windows ou le téléphone préfère le mode sombre. La lune active le sombre ; le soleil rétablit le clair. Votre choix est mémorisé et partagé entre les pages.
- `/blog/` : liste des **huit billets**, dont le cinéma et « Le désir nous rend-il heureux ? ». Les filtres et la recherche utilisent cette liste complète. L’ancienne adresse `/blog/tous-les-billets.html` présente la même liste.
- `/outils/` : annuaire des cinq outils et lien vers la sauvegarde/restauration. La sauvegarde conserve son adresse propre : `/outils/sauvegarde/`.
- `/mediatheque/` : accueil de la médiathèque, séparé de Pomodoro et des cours.
- `/textes/` : accueil des textes, séparé des fiches individuelles.
- Menus, ancres, liens internes et raccourcis vérifiés. Les raccourcis respectent aussi la racine de leur script dans un sous-dossier. Ils ne se déclenchent pas pendant la saisie, la composition de caractères ou la répétition d’une touche maintenue.
- Les outils sont également accessibles depuis la recherche globale.
- Les versions de fichiers et du cache sont renouvelées. Les anciens workers ne remplacent plus une page demandée par un autre index.

Les derniers correctifs sont conservés : logo de l’artiste et icônes mobiles, modes Public/Élève/Prof, accès Notion Didier, manuels et cartes mentales élèves, recherche Milgram et recadrage PDF amélioré. Les archives privées chiffrées et les mots de passe restent identiques à ceux de la version corrigée précédente.

## Raccourcis principaux

| Touche | Destination ou action |
| --- | --- |
| H | Accueil |
| T | Textes |
| B | Tous les billets du blog |
| P | Pomodoro |
| C | Contact |
| R | Recherche du site |
| D | Dictionnaires |
| S | S’identifier / espace élève |
| Alt + C | Médiathèque |
| Alt + L | Bibliothèque de lecture |
| Alt + A | Art |
| Alt + P | Boussole philosophique |
| Alt + M | Boussole mythologique |
| Alt + B | Boussole biblique |
| Maj + ? | Aide des raccourcis |
| Alt + Maj + ? | Aide complète |

## Contrôles avant publication

Dans le terminal de VS Code, à la racine du nouveau dossier :

```text
python scripts/verifier_site.py --require-node
node scripts/tests_public.mjs
node scripts/tests_navigation.mjs
```

Ces commandes vérifient les fichiers, les liens, les index de rubriques, la liste complète des billets, les ancres, la syntaxe JavaScript, les archives chiffrées et les comportements du thème et des raccourcis. Le contrôle GitHub fourni les exécutera aussi avant la publication.

Une vérification visuelle finale avec Live Server reste nécessaire : ces contrôles automatiques ne remplacent pas l’observation du site dans un navigateur.

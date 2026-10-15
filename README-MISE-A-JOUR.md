# Philosophal — mise à jour technique du 14 octobre 2026

Cette archive contient la **version complète** du site, avec les corrections précédentes et le nouvel audit. Elle ne publie rien automatiquement tant que vous ne l’envoyez pas à votre dépôt.

## Ouvrir la version

1. Décompressez `philosophal-audit-confidentialite-2026-10-14.zip` dans un nouveau dossier.
2. Dans VS Code : **Fichier → Ouvrir le dossier…** et choisissez directement le dossier `philosophal` qui contient `index.html`.
3. Lancez `index.html` avec Live Server. Le site doit être à la racine, par exemple `http://127.0.0.1:5500/`.
4. Conservez l’ancienne copie à part pour éviter les mélanges avec un ancien `main` imbriqué. Rechargez avec **Ctrl + F5** si une ancienne version est encore affichée.

## Ce qui est ajouté ou corrigé

Nettoyage des caractères parasites, CGU et confidentialité près des CGV, SIRET professionnel, métadonnées et sitemap, redirection HTTPS de secours, index de textes plus légers, polices locales, images adaptatives, cache revu, meilleurs contrastes sombres et garde-fous mobiles. Aucun service analytics n’est ajouté. L’adresse personnelle n’est pas publiée.

Le détail des changements, des chiffres et des limites de vérification figure dans **RAPPORT-VERIFICATION.md**.

## Avant publication

- Effectuez les essais visuels indiqués dans le rapport, surtout sur petit écran et dans les outils.
- Dans GitHub : **Settings → Pages → Enforce HTTPS** doit être coché pour imposer HTTPS au niveau de l’hébergement.
- Les mentions restent à finaliser pour l’adresse professionnelle de domiciliation et le médiateur désigné ; le rapport explique ces points sans publier votre domicile.

## Contrôles automatiques

À la racine du dossier, avec Python et Node installés :

```text
python scripts/verifier_site.py --require-node
python scripts/auditer_qualite.py
node scripts/tests_public.mjs
node scripts/tests_navigation.mjs
node scripts/tests_quality.mjs
node scripts/test_integrite_textes.mjs
```

La vérification GitHub fournie effectue également ces contrôles avant la publication. Les fichiers privés restent chiffrés ; les mots de passe existants sont conservés.

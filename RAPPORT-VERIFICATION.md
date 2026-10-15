# Philosophal — bilan technique du 14 octobre 2026

Version : `20261014-audit1`. Travail effectué sur la version complète corrigée précédemment, en conservant le logo de l’artiste, le mode clair initial, les bons index, les accès et les outils.

## Textes et caractères

- Inventaire des caractères invisibles réalisé sur les sources publiques.
- Le marqueur d’encodage placé au début du billet sur le désir est supprimé. Les espaces insécables et espaces fines sont normalisés en espaces ordinaires ; les autres caractères parasites ciblés sont supprimés des textes du site.
- Les accents, lettres grecques, ponctuations et symboles visibles sont conservés. Les caractères techniques nécessaires aux bibliothèques tierces ne sont pas retirés à l’aveugle.
- Une protection commune nettoie aussi les textes de l’interface et les contenus de site ajoutés dynamiquement. Les zones de saisie, de code et les documents personnels en cours d’édition sont exclus de ce nettoyage.
- Les 291 textes intégraux du catalogue, leurs annotations et leurs références sont vérifiés par empreinte après cette normalisation. Les contenus des dix pages HTML du blog sont identiques après normalisation des espaces.

Ce nettoyage ne permet pas de garantir le résultat d’un détecteur d’IA, ni un classement Google. Il n’établit pas non plus l’absence de toute signature statistique dans un texte. Aucun faux certificat d’écriture humaine n’a été ajouté.

## Pages légales et données

- Création de `/cgu/` et de `/confidentialite/`, avec liens près des CGV dans les pieds de page concernés et ajout lors du rendu des pages privées disposant d’un pied de page.
- Mise à jour des CGV : identité professionnelle, SIRET, date et information sur les données. Les tarifs et modalités commerciales de la version fournie sont conservés.
- SIRET repris du document URSSAF que l’utilisateur avait communiqué : `99266098500019`. Aucune adresse personnelle ni numéro de compte URSSAF n’est ajouté.
- La politique décrit le formulaire qui prépare un e-mail, les stockages locaux, les accès, les fichiers traités sur l’appareil, les durées de conservation des dossiers, les tiers et les droits RGPD.
- Aucun outil de mesure des visiteurs n’a été ajouté, conformément à la décision finale de l’utilisateur.
- Les appels Google Fonts des pages publiques sont supprimés ; les pages privées utilisent les polices locales lors de leur ouverture.
- Les lecteurs externes des pages et des outils concernés sont différés et demandent une activation volontaire. Les PDF et lecteurs locaux ne sont pas bloqués.

### Mentions administratives restant à finaliser

Le document ne constitue pas une certification de conformité juridique. L’adresse personnelle n’est pas publiée à la demande de l’utilisateur. Cette décision laisse à résoudre l’obligation d’une adresse professionnelle dans les mentions : une adresse de domiciliation permettrait de traiter ce point sans afficher le domicile. Le médiateur de la consommation effectivement désigné n’a pas été communiqué ; son identité et ses coordonnées restent nécessaires. Les coordonnées administratives complètes de l’hébergeur sont à confirmer à partir de ses informations officielles.

Les durées retenues pour les dossiers et e-mails doivent être appliquées dans la gestion de l’activité : la modification du site ne supprime pas automatiquement d’anciens messages de la messagerie.

## Sécurité et HTTPS

- Aucun jeton secret d’API, clé privée de serveur ou jeton GitHub n’a été détecté par les motifs contrôlés dans les fichiers publiés.
- Les paramètres publics du chiffrement ne sont pas des clés d’API ; les archives privées et leurs empreintes sont inchangées.
- Redirection de secours de HTTP vers HTTPS sur les domaines de production, avec conservation du chemin, des paramètres et de l’ancre. Live Server et localhost restent en HTTP.
- Mise à niveau des ressources non sécurisées sur la production HTTPS et protection des ouvertures de liens dans un nouvel onglet.

La redirection du code ne remplace pas une redirection imposée par l’hébergeur avant l’envoi de la page. Dans le dépôt GitHub, vérifier **Settings → Pages → Enforce HTTPS**. Si la case est déjà cochée, aucune action supplémentaire n’est nécessaire. Aucun réglage du compte GitHub ni publication en ligne n’a été modifié pendant ce travail.

## Référencement

- 357 pages possèdent un titre et une description dans le HTML.
- 322 titres publics indexables distincts ; URL canoniques normalisées et sitemap de 322 URL.
- Les fiches de lecture disposent d’une introduction avant JavaScript, fondée sur les titres, auteurs et descriptions existants.
- Les alias et pages privées conservent une logique d’indexation adaptée. L’ancienne référence de domaine du billet sur le désir est corrigée.
- Liens locaux, ancres, menus, cibles des deux index de recherche et adresses des 291 textes contrôlés.

## Performances

Les chiffres ci-dessous sont le poids brut des fichiers locaux déclarés dans le HTML initial : styles, scripts et préchargements. Ce ne sont ni des durées mesurées, ni un score Lighthouse. Ils excluent notamment les illustrations et les ressources chargées ensuite.

| Page | Avant | Après | Évolution |
| --- | ---: | ---: | ---: |
| `index.html` | 338 Kio | 353 Kio | +4.4 % |
| `blog/index.html` | 864 Kio | 879 Kio | +1.7 % |
| `textes/index.html` | 2823 Kio | 1903 Kio | -32.6 % |
| `mediatheque/index.html` | 890 Kio | 796 Kio | -10.5 % |
| `textes/philosophie/boussole/index.html` | 3733 Kio | 2812 Kio | -24.7 % |
| `outils/index.html` | 337 Kio | 352 Kio | +4.4 % |
| `pdf/index.html` | 257 Kio | 269 Kio | +4.8 % |
| `epub/index.html` | 606 Kio | 619 Kio | +2.0 % |

Le code de sécurité, de confidentialité et de mise en page ajoute quelques kilo-octets aux pages simples. La réduction des grandes pages repose sur les index de navigation allégés ; les fiches de lecture gardent les sources complètes. Les métadonnées de recherche et de navigation des 291 textes sont identiques.

Autres gains :

- Illustration principale : PNG de 752 917 octets remplacé pour l’affichage par un WebP sans perte de 446 742 octets ; variantes de 512 et 768 pixels pour les petits affichages.
- Illustration de contact : 940 706 → 573 282 octets en grand format sans perte, avec variantes adaptées.
- Police Manrope : 164 700 → environ 53 700 octets en WOFF2, sans retrait de caractères.
- Suppression de 971 balises Google Fonts/preconnexion des pages publiques.
- Réutilisation des fichiers publics versionnés par le cache ; chaque navigation reste vérifiée sur sa propre URL, sans remplacement par une sous-page.
- Une session Prof conservée ne retélécharge plus les archives privées pendant la consultation des pages publiques. Les accès protégés continuent de vérifier les archives avant ouverture.

## Contraste et responsive

- Quatre règles sombres avec une paire explicite texte/fond insuffisante sont corrigées dans l’éditeur d’image et le blog.
- La palette commune contrôlée dépasse 4,5:1 pour le texte courant. Les 594 paires explicites texte/fond relevées dans les règles sombres passent ce seuil. Cela ne représente pas un audit exhaustif de tous les styles calculés, dégradés ou opacités.
- Focus clavier éclairci et bordures des contrôles renforcées.
- Garde-fous pour les fenêtres, les tableaux légaux, les liens longs, les cartes, les filtres et le recadrage PDF sur petit écran ; dimensions déclarées et images adaptatives ajoutées aux illustrations principales.

Aucun navigateur de test utilisable n’était disponible. Le responsive n’a donc pas fait l’objet d’une validation visuelle aux différentes largeurs ; aucun score réel de vitesse n’est fourni. La consigne de la compétence [Sites](sandbox:/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-b.1/skills/sites/SKILL.md) est : « If `$control-browser` is unavailable, skip browser QA ». Les vérifications sont des contrôles de source et des tests JavaScript. Les ressources externes n’ont pas toutes été vérifiées individuellement.

## Vérifications réussies

- Contrôle des 357 pages, fichiers, liens, ancres et scripts : aucune erreur.
- Audit des métadonnées, du sitemap, des caractères, des secrets recherchés et des contrastes explicites : aucune erreur.
- 138 contrôles de navigation et de thème, 39 contrôles de sécurité, médias, cache et restauration de session, tests publics et contrôle d’intégrité des 291 textes.
- Contrôles prévus aussi dans la vérification GitHub avant publication.

## Essais visuels à effectuer avec Live Server

1. Ouvrir directement le dossier `philosophal` dans VS Code, puis lancer `index.html` avec Live Server à la racine.
2. En fenêtre privée : vérifier le mode clair initial et le bouton lune/soleil.
3. Regarder l’accueil, le blog, les textes, les trois boussoles, les outils et les fenêtres PDF à environ 320, 375, 768 et 1280 pixels de large.
4. Tester les modes Public/Élève/Prof avec les mots de passe existants, les passages entre rôles et le verrouillage Public.
5. Vérifier l’activation d’une vidéo et l’ouverture d’un PDF ou EPUB local, puis l’export d’un document courant.
6. Vérifier dans GitHub la case Enforce HTTPS et compléter les mentions administratives signalées avant de considérer les pages légales comme finalisées.

## Sources officielles consultées

- [CNIL : information au moment de la collecte](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel).
- [CNIL : durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees).
- [Service Public : mentions obligatoires d’un site professionnel](https://entreprendre.service-public.gouv.fr/vosdroits/F31228).
- [Service Public : conservation des documents d’une micro-entreprise](https://entreprendre.service-public.gouv.fr/vosdroits/F36008).
- [GitHub : HTTPS sur GitHub Pages](https://docs.github.com/fr/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).
- [GitHub : déclaration de confidentialité](https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement).
- [Google Search Central : contenu généré par IA](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content?hl=fr).

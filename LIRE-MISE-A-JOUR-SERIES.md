# Vidéos — V39

Les pages /series/ et /series/philosophie-de-l-amour/ sont générées pour le 22 octobre 2026, heure de Paris. L’épisode 1 conserve ses liens TikTok et YouTube.

| Épisode | Jour de disponibilité, Europe/Paris |
| --- | --- |
| 2 | 23 octobre 2026 |
| 3 | 25 octobre 2026 |
| 4 | 27 octobre 2026 |

Avant le jour prévu, seuls le numéro, le titre et la date sont rendus. L’auteur, la description, les liens sources et les extraits sont absents du HTML, des données structurées et du JSON public. Les champs futurs restent dans les sources de travail, exclues de la sortie publique. Un dépôt Git public rendrait naturellement ces sources de travail consultables sur GitHub.

## Deux modes d’affichage

Le sélecteur « Détaillé / Compact » se trouve au-dessus des séries ou des épisodes. Détaillé conserve la présentation avec ses grands visuels. Compact réduit les visuels, les marges et les espacements pour parcourir les épisodes plus rapidement, en conservant les descriptions, les liens vidéo, les sources et les extraits dépliables. La taille des extraits ouverts reste identique.

Le choix est mémorisé sur le navigateur avec la clé philosophal-series-view-v1. Le mode détaillé reste disponible sans JavaScript ; un stockage indisponible n’empêche pas de basculer entre les deux modes pendant la visite. Les deux vues utilisent les mêmes contenus filtrés par date.

## Publication quotidienne

Dans GitHub, utiliser **Settings → Pages → Build and deployment → Source : GitHub Actions**, avec le workflow .github/workflows/publication.yml fourni sur la branche main. Il reconstruit et publie le site chaque jour à 00 h 07 puis à 00 h 37, fuseau Europe/Paris. Le changement d’heure est pris en compte. Le second passage sert de nouvelle tentative.

GitHub peut retarder ou supprimer une exécution planifiée ; la disponibilité commence après un déploiement réussi, pas nécessairement à minuit exactement. Vérifier les exécutions dans Actions. La tâche peut aussi être lancée avec Run workflow. Aucune génération ne débloque un épisode avant son jour prévu.

Une page déjà ouverte vérifie périodiquement si une version plus récente est publiée, puis se recharge si nécessaire. Le cache de service ne conserve pas les pages de série ni leur JSON.

Live Server sert des fichiers statiques : il ne lance pas de génération quotidienne. Pour voir les épisodes du jour en local, exécuter à la racine du projet, puis actualiser :

```text
python scripts/generer_series.py
```

Si Python sous Windows signale ZoneInfoNotFoundError, installer les données de fuseaux horaires avec python -m pip install tzdata, puis relancer la génération.

Sur un autre hébergeur, programmer la même génération quotidienne et publier sa sortie. Copier une archive une seule fois ne suffit pas à faire apparaître automatiquement les contenus des jours suivants.

## Modifier les contenus

Éditer **scripts/series-content/episodes.json** pour les titres, auteurs, descriptions, dates ISO et liens vidéo. Le fichier series/philosophie-de-l-amour/episodes.json est une sortie publique filtrée : ne pas l’utiliser comme source éditoriale.

Les quatre extraits sont dans **scripts/series-content/excerpts.json**, tous avec approved à true après la validation explicite de Florian le 22 octobre 2026. Le texte, le découpage et les références approuvés sont conservés à l’identique.

Les extraits apparaîtront dans un dépliant accessible « Lire l’extrait », avec guillemets, référence complète et lien source, seulement lorsque la date de l’épisode est atteinte : un extrait le 23 octobre, un deuxième le 25 octobre et deux autres le 27 octobre. La validation n’avance aucune date de publication. Pour un futur extrait, ne passer approved à true qu’après sa validation explicite. Les liens vidéo, distincts des textes, apparaissent lorsqu’ils ont été renseignés.

## Vérifier le calendrier

```text
python scripts/test_series_calendar.py
```

Les tests couvrent les trois dates, les limites de minuit à Paris, le passage à l’heure d’hiver, les données publiques et le double verrou date + validation.

Pour une simulation séparée, utiliser --as-of avec --output-root pointant vers un dossier temporaire extérieur au site. Une simulation datée ne peut pas écraser les pages du projet. Ne jamais publier ce dossier de simulation.

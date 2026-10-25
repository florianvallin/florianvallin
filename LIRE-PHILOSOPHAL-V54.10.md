# Philosophal V54.10 — Sauvegardes professionnelles et récupération

## Intégration
- Nouveau module **Sauvegardes pro** dans le tableau de bord réservé au propriétaire. Page `/outils/sauvegarde-pro/` avec le même verrouillage navigateur existant.
- Depuis les bibliothèques médias de **Studio audiovisuel** et **Philosophal Cut**, bouton « Sauvegarder » ouvrant ce module.
- Création de sauvegardes ZIP portables contenant au choix : **projets Studio enregistrés dans IndexedDB**, médias de la bibliothèque commune avec métadonnées, et préférences/brouillons locaux Cut (sans médias externes). Choix individuel des projets/médias.
- Import ZIP avec résumé préalable, restauration additive des projets (nouveaux IDs, jamais d’écrasement), import des médias sans suppression des données existantes, récupération optionnelle des réglages Cut absents.
- Gestion d’erreurs et messages de récupération partielle. Aucun téléchargement vers des serveurs.

## Limites et précautions importantes
- Limite volontaire de 300 Mo de données sélectionnées par archive et 350 Mo de ZIP importé : pour les gros rushs, effectuer des sauvegardes séparées et conserver les vidéos d’origine.
- Les enregistrements en cours et modifications Studio non encore enregistrées dans IndexedDB ne peuvent pas être récupérés. Sauvegarder le projet avant l’export.
- Les rushs externes Cut ne sont pas intégrés ; il faut les conserver séparément. Les réglages Cut ne sont restaurés que si la clé locale est absente, afin d’éviter un écrasement.
- Les archives ne sont pas chiffrées ; elles doivent être conservées dans un emplacement privé et fiable.
- Le contrôle d’accès reste côté navigateur, sans sécurité serveur. Les tests fonctionnels finaux sous Brave restent à effectuer.
- La sauvegarde générale publique `/outils/sauvegarde/` n’a pas été modifiée.

## Prochaines versions
- V54.11 : détection de doublons avancée, prévisualisation de l’espace requis et allègement des importations volumineuses.
- V54.12 : sauvegardes de secours avant suppressions, récupération facilitée des médias et restauration guidée.

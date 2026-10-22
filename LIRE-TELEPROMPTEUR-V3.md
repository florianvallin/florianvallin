# Téléprompteur V3 — Philosophal

## Installer la mise à jour

Décompressez le ZIP, puis copiez son contenu à la racine du site en acceptant le remplacement des fichiers correspondants. Conservez les autres fichiers. La V3 contient aussi les fichiers du lecteur V2 : il n’est pas nécessaire d’installer les deux ZIP à la suite.

Ouvrez `/apprendre/creation/teleprompteur/`. Si l’ancienne interface apparaît encore, rechargez la page avec Ctrl + F5. Vous pouvez ensuite publier les fichiers sur GitHub comme d’habitude.

## Bibliothèque de scripts

L’onglet **Bibliothèque** rassemble vos scripts. **+ Nouveau** crée un script vide et ouvre l’éditeur. Donnez-lui un titre, puis indiquez une série ou un projet si vous souhaitez le regrouper avec d’autres épisodes.

- La recherche porte sur le titre, la série et le texte. Elle fonctionne aussi sans les accents.
- Le filtre de série et le tri par date ou par titre aident à retrouver les épisodes.
- Chaque script garde son texte et sa position de lecture. Le changement de script sauvegarde le précédent et met la lecture en pause.
- **Options du script → Dupliquer** crée une copie indépendante.
- **Options du script → Archiver** retire le script de la liste En cours. Dans Archives, cliquez sur sa carte pour le restaurer.

Les réglages de caméra et de lecture sont communs à l’outil. La V3 conserve la colonne positionnable, le repère déplaçable, le mode lecture, le miroir, les ambiances et les raccourcis de la V2.

## Historique des versions

Dans l’onglet Script, **Historique** ouvre une prévisualisation des versions. Des versions sont conservées automatiquement après une pause dans les modifications et lors d’un changement de script. **Garder une version** permet aussi de conserver volontairement l’état courant.

Sélectionnez une version, relisez-la, puis cliquez sur **Restaurer cette version**. Votre texte précédent reste dans l’historique. La restauration remet la lecture au début.

L’historique conserve les **30 dernières versions par script**. La bibliothèque exportée les inclut.

## Importer et exporter

- **Importer des scripts** accepte un ou plusieurs fichiers `.txt` ou `.md`, ainsi que les bibliothèques `.json` exportées par la V3. Chaque texte importé devient un nouveau script ; il ne remplace pas celui que vous écriviez.
- **Exporter .txt**, dans l’éditeur, exporte uniquement le texte du script ouvert, avec un nom de fichier tiré de son titre.
- **Exporter la bibliothèque** produit une sauvegarde JSON des scripts, des archives, des positions de lecture et des historiques. Importez-la dans le navigateur d’un autre appareil pour retrouver vos textes.
- La réimportation d’un script identique évite les doublons et complète son historique avec les versions manquantes. Un script différent est ajouté séparément.
- Un lot invalide est rejeté avant tout ajout. Un script peut contenir jusqu’à 250 000 caractères ; l’import accepte jusqu’à 100 Mo de fichiers par lot.

La bibliothèque reste dans ce navigateur, à cette adresse de site. Elle ne se synchronise pas automatiquement entre le téléphone et le PC : utilisez l’export/import pour la transférer. Les réglages visuels restent ceux du navigateur destinataire.

## Reprendre la V1 ou la V2

Au premier démarrage, le texte, le passage et les réglages de la V1/V2 sont repris automatiquement dans la même adresse de site et le même navigateur. L’ancien enregistrement est conservé. La migration n’est pas répétée à chaque ouverture.

Le brouillon courant est également gardé en secours pendant l’enregistrement. Si une fermeture interrompt celui-ci, la V3 tente de le récupérer à la prochaine ouverture. Si deux onglets modifient le même script, la seconde modification est conservée dans une copie de sécurité.

La sauvegarde générale du site inclut désormais aussi la bibliothèque du téléprompteur.

## Vérifications

Vérifiés dans le navigateur d’aperçu : migration V2, création et renommage, séries, recherche sans accents, position par script, duplication, archivage/restauration, historique, restauration sans perte du texte remplacé, limite de 30 versions, import TXT/MD, sauvegarde JSON, réimport sans doublons, fusion d’historiques, rejet d’un lot invalide, modifications dans deux onglets, clavier, thèmes, formats téléphone/tablette, stockage indisponible et récupération du brouillon après fermeture.

Les tests du texte et du format de bibliothèque se lancent avec :

```sh
node scripts/test-teleprompteur-v2.cjs
node scripts/test-teleprompteur-v3.cjs
```

Le plein écran natif dépend du navigateur. Le mode lecture reste disponible lorsqu’il ne peut pas être activé.

Cette V3 porte sur les scripts et leurs versions. Les reprises de prise, la télécommande et les fonctions de tournage restent pour les versions suivantes.

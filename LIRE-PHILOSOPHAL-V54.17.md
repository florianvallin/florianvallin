# Philosophal V54.17 — Sessions volumineuses et importations progressives

## Nouveautés
- File d’importation **séquentielle** dans la bibliothèque professionnelle commune, avec progression par fichier, doublons, échecs et **annulation entre deux fichiers** (un ajout en cours ne peut pas être interrompu au milieu de son écriture).
- Importation d’un dossier de rushs via le sélecteur de dossier de Brave/Chrome : les médias sont regroupés dans une collection portant le nom du dossier lorsqu’aucun autre projet n’est sélectionné.
- Estimation du quota local, de la place restante et de la taille de la bibliothèque. Avertissement sur les gros lots, contrôles de quota avant chaque fichier, refus explicite lorsqu’il manque de l’espace estimé.
- Option de demande de stockage persistant à l’initiative de l’utilisateur (API StorageManager), avec message expliquant qu’il ne remplace **pas une sauvegarde ZIP**.
- Plafond d’envoi vers l’importeur Cut depuis la bibliothèque : 12 fichiers et 850 Mo par lot. Les opérations plus grandes doivent être fractionnées ; cela ne modifie pas les limites des autres passerelles.
- Aucune suppression automatique des données existantes ni modification des médias des versions précédentes.

## Précautions
- Le stockage IndexedDB reste dépendant de Brave et de l’espace disque : les estimations de quota sont indicatives, pas une réservation garantie.
- La progression est par **fichier** et non par octet écrit : IndexedDB ne fournit pas de pourcentage d’écriture du Blob.
- Le navigateur peut bloquer certaines vidéos/codecs, même lorsqu’elles sont enregistrées dans la bibliothèque.
- Les prises en cours et les médias non exportés doivent être sauvegardés séparément sur disque.
- Test fonctionnel complet avec les vrais médias et permissions de l’utilisateur restant nécessaire.

## Prochaines versions
- **V54.18** : diagnostic professionnel (micro, caméra, stockage, conversions), maintenance guidée et fiabilité des exports.
- **V54.19** : performance et ergonomie de Cut pour longs rushs, synchronisation des dossiers et reporting de stabilité.

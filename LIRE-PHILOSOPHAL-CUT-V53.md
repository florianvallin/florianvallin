# Philosophal Cut — intégration V53

- Ouvrir `/outils/` et s’identifier avec le compte professionnel : le studio s’affiche dans « Mes outils professionnels » à côté des factures.
- Accès direct après identification : `/outils/philosophal-cut/`.
- L’application est la V35, sans modifications apportées à son moteur de montage.
- L’éditeur occupe l’espace disponible ; retour aux outils depuis le bandeau supérieur.
- Les rushes, scripts et projets sauvegardés dans le navigateur restent locaux à celui-ci. Exporter son projet JSON et transférer les médias pour changer d’ordinateur.
- En cas de lien ouvert sans session, un formulaire propose une connexion propriétaire.
- **Sécurité :** comme Factures, l’accès est contrôlé côté navigateur. Sur un hébergement statique, le code HTML/JavaScript distribué publiquement n’est pas réellement protégé par un contrôle serveur : ne pas y placer de secrets. Pour une véritable restriction du téléchargement du code, utiliser une authentification côté serveur ou chiffrer les ressources avec la procédure existante du coffre privé.
- Les options d’export FFmpeg/transcription dépendent de la connexion, de la mémoire et des codecs disponibles. Les limites déjà signalées de la V35 demeurent.

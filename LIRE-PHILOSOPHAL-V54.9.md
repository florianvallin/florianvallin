# Philosophal V54.9 — Bibliothèque de médias professionnelle

## Nouvelles fonctions
- Une **bibliothèque locale partagée** est accessible avec le bouton « ▦ Médias partagés » dans **Studio audiovisuel** et **Philosophal Cut**. Elle est indépendante de la médiathèque destinée aux élèves et de la médiathèque temporaire de Cut.
- Import de fichiers **audio, vidéo et images** (selon les formats pris en charge par les navigateurs). Données et métadonnées stockées localement dans IndexedDB, avec lecture et téléchargement.
- **Collections/projets**, recherche textuelle (nom, projet, notes), filtres audio/vidéo/image, favoris, tri et édition du nom affiché/notes.
- Sélection multiple : déplacement vers un projet, suppression après confirmation. La sélection dans Studio peut être transmise vers Cut (12 médias max. par transfert), par la passerelle locale existante. Dans Cut, la sélection est importée directement dans sa médiathèque **sans toucher au rush principal ni aux clips**.
- Les prises/captures encore présentes dans la session Studio peuvent être conservées dans la bibliothèque. Les médias déjà importés dans Cut peuvent y être ajoutés si leurs fichiers d’origine sont disponibles. Les sous-titres synchronisés des entrées de bibliothèque sont conservés lorsqu’ils existent dans les métadonnées.
- Depuis la bibliothèque dans Studio, un média peut être ouvert dans **Transcription**, **Analyse** (audio), **Sous-titres** ou **Exports**.

## Précautions
- Les fichiers restent dans **le même navigateur sur la même origine** (https://philosophal.fr). Ce stockage **n’est pas une sauvegarde**, et n’est pas synchronisé entre ordinateurs. Les fichiers volumineux peuvent dépasser le quota disponible ; 1 Gio maximum par fichier et confirmation pour les fichiers dépassant 160 Mo.
- Les médias sont copiés dans la bibliothèque puis, pour certains envois vers Cut, provisoirement dans la passerelle. L’usage de l’espace local augmente en conséquence.
- Le stockage peut être effacé par le navigateur. Télécharger les fichiers importants et sauvegarder sur disque ou dans un espace fiable.
- La bibliothèque partage le contrôle d’accès pro **côté navigateur**, déjà en place dans le site. L’authentification serveur reste à envisager pour assurer un accès véritablement privé aux pages hébergées statiquement.
- Les importations Cut depuis la bibliothèque n’insèrent aucun clip automatiquement dans la timeline. Elles ne remplacent pas la vidéo en cours.
- Vérifications du site, de la navigation, des textes, du calendrier et de l’audit qualité validées. Contrôles UI isolés réussis ; **test complet dans Brave / sur de vrais médias nécessaire** avant publication, car l’environnement d’automatisation bloque les navigations de navigateur.
- Correction connexe du contrôle qualité : les six applications HTML autonomes (dont Cut, Studio, Factures et Convertisseur) ne sont plus obligées de charger les scripts et styles de contenu public, ce qui évite une erreur de publication héritée des versions précédentes. Des descriptions manquantes sur certaines pages professionnelles ont également été ajoutées.

## Suite de la feuille de route
- V54.10 : sauvegardes améliorées, récupération des projets et des médias, raccourcis de travail.
- V54.11 : diagnostic et fiabilisation des très gros médias, nettoyage des doublons et ergonomie de la bibliothèque.

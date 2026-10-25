# Philosophal V54.3 — Studio audiovisuel ↔ Cut

## Transfert local volontaire
- Depuis **Studio audiovisuel**, bouton « Vers Philosophal Cut » : choisir une prise vocale, une capture, une source du flux de travail ou un fichier local. Si des sous-titres/transcriptions synchronisés correspondent exactement au média, ils peuvent être joints.
- Les médias et les passages sont conservés **localement dans IndexedDB**, sur le même navigateur et la même origine (HTTPS). Aucun serveur tiers et aucun envoi réseau du contenu.
- **Cut** affiche le transfert à l’arrivée : ouvrir une vidéo comme rush principal, ajouter un média audio/vidéo à la médiathèque sans le placer, ou importer uniquement les sous-titres sur le rush existant. Les remplacements demandent confirmation.
- En cas de sortie accidentelle, le bouton « Depuis Studio audiovisuel » permet de retrouver les transferts. Les transferts sont retirés après import réussi, supprimables manuellement et visibles sept jours.
- Les sous-titres restent calés sur les secondes du média original (pas sur les coupes de la timeline), vérifiez leurs repères. Les audios ne deviennent jamais automatiquement le rush vidéo principal.

## Limites et vérification
- Ouvrir les deux outils sur **la même origine et le même profil navigateur**. `file://`, navigation privée et stockage bloqué ne garantissent pas la passerelle.
- Pour les vidéos lourdes, IndexedDB peut refuser l’écriture (quota). Exportez les fichiers et importez-les manuellement dans Cut.
- En réception, les vidéos peuvent remplacer le rush principal seulement après confirmation ; un audio se place via la médiathèque sur une piste audio, avec un rush vidéo déjà ouvert.
- Le relais ne réencode pas les fichiers et ne crée pas de projet Cut ; formats et décodage dépendent des capacités de l’éditeur et de Brave/Chrome.
- Les contrôles automatisés vérifieront le stockage et les UI, mais les tests sur matériel réel/vidéos réelles restent nécessaires.
- Contrôle d’accès professionnel inchangé, en navigateur uniquement (GitHub Pages statique).

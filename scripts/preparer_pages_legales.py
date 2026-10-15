"""Construit les deux pages légales avec la navigation du site."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / 'cgv.html').read_text()
head = re.search(r'<head>(.*?)</head>', source, re.S).group(1)
header = re.search(r'<header class="navbar.*?</header>', source, re.S).group()
footer = re.search(r'<footer class="site-footer.*?</footer>', source, re.S).group()

def absolute(match):
    attr, quote, value = match.groups()
    if not value.startswith(('/', '#', 'http:', 'https:', 'mailto:', 'data:')):
        value = '/' + value
    return attr + '=' + quote + value + quote

def build(slug, title, description, content):
    page_head = re.sub(r'<title>.*?</title>', '<title>' + escape(title) + ' | Philosophal</title>', head, flags=re.S)
    page_head = re.sub(r'<meta\b(?=[^>]*(?:name="(?:description|robots)"|property="og:[^"]+"))[^>]*>', '', page_head)
    page_head = re.sub(r'<link\b(?=[^>]*rel="canonical")[^>]*>', '', page_head)
    page_head += '\n<meta name="description" content="' + escape(description, quote=True) + '">'
    content = '<p class="legal-update">Dernière mise à jour : 14 octobre 2026.</p>' + content
    page = ('<!doctype html><html lang="fr"><head>' + page_head + '</head><body id="top">' + header +
            '<main class="legal-page"><div class="container"><nav class="breadcrumb" aria-label="Fil d’Ariane">'
            '<a href="/">Accueil</a><span aria-hidden="true">/</span><span>' + escape(title) + '</span></nav>' +
            '<h1 class="legal-title">' + escape(title) + '</h1><div class="legal-content">' + content +
            '</div></div></main>' + footer + '<script src="/js/script.js?v=20261014-audit1" defer></script>' +
            '<script src="/js/global-backup.js?v=20261014-audit1" defer></script></body></html>')
    page = re.sub(r'\b(src|href)=([\"\'])(.*?)\2', absolute, page)
    target = ROOT / slug / 'index.html'; target.parent.mkdir(exist_ok=True); target.write_text(page)

build('cgu', 'Conditions générales d’utilisation',
      'Conditions d’utilisation de Philosophal : ressources pédagogiques, outils gratuits, accès réservés, documents personnels et liens vers des services externes.', '''
<nav class="legal-toc" aria-label="Pages légales"><a href="/cgv.html">Conditions de vente</a><a href="/confidentialite/">Confidentialité et données personnelles</a></nav>
<h2 id="mentions">1. Éditeur du site</h2>
<p>Philosophal est un site édité par <strong>Florian Vallin, entrepreneur individuel (EI)</strong>, exerçant une activité de cours particuliers de philosophie et de méthodologie générale à Montpellier et à distance.</p>
<p><strong>SIRET :</strong> 99266098500019. <strong>SIREN :</strong> 992660985. <strong>Contact :</strong> <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a>. Directeur de la publication : Florian Vallin.</p>
<p>Le site est hébergé par GitHub Pages, un service de GitHub, Inc. Les coordonnées de l’hébergeur et sa politique figurent dans ses <a href="https://docs.github.com/fr/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer">conditions officielles</a> et sa <a href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">déclaration de confidentialité</a>.</p>
<h2>2. Objet et accès</h2>
<p>Le site propose des informations sur les accompagnements pédagogiques, des textes et ressources de lecture, des billets de blog et des outils pour lire, écrire et travailler. La consultation des rubriques publiques est gratuite, hors coût de connexion. Les prestations payantes sont régies par les <a href="/cgv.html">conditions générales de vente</a>.</p>
<p>Les contenus réservés aux élèves et au professeur sont soumis à un mot de passe et à des droits d’accès différents. Les identifiants communiqués pour un accompagnement ne doivent pas être transmis à des tiers. Le passage au mode Public verrouille l’accès réservé.</p>
<h2>3. Utilisation des ressources</h2>
<p>Les commentaires, exercices et supports originaux protégés par le droit d’auteur sont destinés à la consultation et à l’usage personnel ou aux usages permis par la loi. Leur republication ou leur commercialisation nécessite une autorisation lorsque celle-ci est requise.</p>
<p>Les œuvres du domaine public, les extraits d’auteurs, les documents de tiers et les ressources accessibles par lien conservent leur statut et leurs droits propres. La présence d’un document sur le site n’autorise pas sa réutilisation au-delà de ces droits. Les crédits et licences des bibliothèques logicielles sont conservés.</p>
<h2>4. Outils et documents personnels</h2>
<p>Les éditeurs, le lecteur de livres, le minuteur et l’outil PDF fonctionnent dans le navigateur. Les fichiers que vous y ouvrez sont traités sur votre appareil ; ces outils ne prévoient pas leur téléversement vers un serveur Philosophal. Certains traitements nécessitent le téléchargement de bibliothèques logicielles.</p>
<p>Des fonctions utilisent le stockage local du navigateur pour conserver des documents, la progression ou des préférences. Ce stockage dépend du navigateur, de son mode de navigation et de l’espace disponible. L’effacement des données du navigateur peut supprimer ces éléments. Utilisez les fonctions d’export ou de <a href="/outils/sauvegarde/">sauvegarde</a> pour garder une copie de votre travail.</p>
<p>Vous restez responsable des documents que vous importez, de leur licéité et des droits nécessaires à leur utilisation. Les fonctions d’un outil et les formats pris en charge sont ceux indiqués dans son interface.</p>
<h2>5. Services externes</h2>
<p>Des liens et lecteurs permettent de consulter des ressources proposées par d’autres organismes. Les lecteurs vidéo et audio concernés demandent une activation volontaire avant leur chargement. Une fois un service tiers ouvert ou activé, ses conditions et sa politique de confidentialité s’appliquent.</p>
<h2>6. Exactitude, disponibilité et responsabilité</h2>
<p>Les ressources ont une vocation pédagogique et ne remplacent pas une consultation des œuvres, des textes officiels ou un conseil professionnel adapté à votre situation. Une référence inaccessible, une erreur ou un problème technique peut être signalé à l’adresse de contact.</p>
<p>Le site peut être modifié, corrigé ou momentanément indisponible. Ces dispositions ne limitent ni les garanties ni les responsabilités qui ne peuvent être exclues par la loi. Aucun résultat scolaire ou classement dans un moteur de recherche n’est garanti.</p>
<h2>7. Données personnelles et contact</h2>
<p>Les traitements de données, les stockages techniques et les droits des personnes sont décrits dans la <a href="/confidentialite/">politique de confidentialité</a>. Pour toute question relative au site : <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a>.</p>
''')

build('confidentialite', 'Politique de confidentialité',
      'Comment Philosophal traite vos données : contact, outils locaux, accès élèves et professeur, services externes, durées de conservation et droits RGPD.', '''
<nav class="legal-toc" aria-label="Pages légales"><a href="/cgu/">Conditions d’utilisation</a><a href="/cgv.html">Conditions de vente</a></nav>
<p>Cette page décrit les traitements liés à Philosophal et aux demandes d’accompagnement. Aucun service de mesure d’audience ou de suivi publicitaire n’est ajouté au site.</p>
<h2>1. Responsable des traitements</h2>
<p><strong>Florian Vallin, entrepreneur individuel (EI), nom commercial Philosophal</strong>, Montpellier, France. SIRET : 99266098500019. Pour une question ou l’exercice de vos droits : <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a>.</p>
<h2>2. Ce qui est traité et pourquoi</h2>
<div class="legal-table-scroll" tabindex="0" role="region" aria-label="Traitements de données"><table><thead><tr><th>Usage</th><th>Données concernées</th><th>Finalité et base juridique</th></tr></thead><tbody>
<tr><td>Demande de contact</td><td>Adresse e-mail, prestation ou offre, message et informations que vous choisissez de communiquer.</td><td>Répondre à votre demande et préparer un accompagnement : mesures précontractuelles à votre initiative ou intérêt légitime à répondre aux autres demandes.</td></tr>
<tr><td>Cours et facturation</td><td>Coordonnées utiles au contrat, informations pédagogiques nécessaires, séances et paiements.</td><td>Exécuter le contrat et assurer le suivi pédagogique ; respecter les obligations légales administratives et comptables.</td></tr>
<tr><td>Préférences et outils</td><td>Thème clair/sombre, réglages, progression de lecture, documents et sauvegardes, selon les outils utilisés.</td><td>Fournir les fonctions demandées et retrouver votre travail sur le même appareil. Ces éléments restent dans votre navigateur lorsqu’ils sont enregistrés localement.</td></tr>
<tr><td>Accès réservé</td><td>État d’accès, rôle Élève ou Prof, éléments techniques nécessaires au déchiffrement ; mémorisation facultative de l’accès.</td><td>Ouvrir les ressources autorisées à la demande de l’utilisateur. Le mot de passe est utilisé par le navigateur pour déchiffrer les archives.</td></tr>
<tr><td>Connexion au site</td><td>Données techniques transmises lors d’une connexion, notamment adresse IP et informations du navigateur.</td><td>Fourniture et sécurité de l’hébergement, assurées par GitHub Pages selon les règles de l’hébergeur.</td></tr>
</tbody></table></div>
<h2>3. Fonctionnement du contact</h2>
<p>Le formulaire prépare un e-mail dans votre application de messagerie. Il ne transmet pas automatiquement le message à un serveur de formulaire : vous choisissez de l’envoyer depuis votre messagerie. L’adresse e-mail et le message sont nécessaires pour vous répondre ; les autres renseignements sont limités à ceux utiles à votre demande. Évitez de transmettre des informations sensibles qui ne seraient pas nécessaires.</p>
<h2>4. Documents ouverts dans les outils</h2>
<p>Les fichiers PDF, images, textes et livres importés sont traités dans le navigateur. Les outils ne prévoient pas de transmettre leur contenu à Philosophal ou à un service d’analyse. Une sauvegarde ou un export produit un fichier sur votre appareil. Les bibliothèques techniques peuvent être chargées depuis un réseau de distribution logiciel ; cela ne constitue pas un envoi de vos documents à ce réseau.</p>
<h2>5. Stockage local et conservation des accès</h2>
<p>Le site utilise, selon les fonctions, localStorage, sessionStorage, IndexedDB et un cache technique. Ils servent aux préférences, aux documents, à la progression, aux fonctions de reprise et aux accès demandés. Ils ne sont pas utilisés comme identifiant publicitaire ou comme compteur de visites.</p>
<p>Les préférences et documents locaux restent conservés jusqu’à leur suppression dans l’outil ou dans les paramètres du navigateur. Les données de session sont liées à l’onglet ou à la session du navigateur. Si vous choisissez de mémoriser un accès réservé, il reste enregistré sur cet appareil jusqu’au verrouillage ou à l’effacement de ces données. Cliquer sur Public dans la médiathèque verrouille la session et retire la mémorisation de l’accès.</p>
<p>Vous pouvez gérer ces données dans les paramètres de votre navigateur. Un effacement peut supprimer vos documents et votre progression : utilisez d’abord la <a href="/outils/sauvegarde/">sauvegarde</a> si vous souhaitez les conserver.</p>
<h2>6. Services externes et destinataires</h2>
<p>Les demandes reçues sont destinées au responsable des traitements et aux prestataires nécessaires à l’organisation des cours, aux échanges et à la facturation. Elles ne sont pas vendues et ne sont pas utilisées pour une prospection sans base juridique appropriée.</p>
<p>L’hébergement est assuré par GitHub Pages. Les e-mails reçus sont traités par la messagerie utilisée pour les échanges, notamment Free pour l’adresse de contact. Des services tels que Notion peuvent être utilisés lorsqu’un espace de cours vous est communiqué.</p>
<p>Les images distantes, liens et lecteurs peuvent relever de services tiers, notamment YouTube, Radio France, Spotify, Vimeo ou des sites de ressources. Les images distantes demandées par une page transmettent les données techniques nécessaires à leur affichage. Les lecteurs intégrés concernés restent bloqués jusqu’à votre activation ; leur ouverture contacte le fournisseur et peut entraîner d’autres traitements selon sa politique.</p>
<p>Certains prestataires peuvent traiter des données hors de l’Espace économique européen. Leurs politiques décrivent leurs lieux de traitement et les garanties applicables. Consultez notamment la <a href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">déclaration de confidentialité de GitHub</a>.</p>
<h2>7. Durées de conservation des échanges et contrats</h2>
<ul><li>Demandes de renseignements non suivies d’un accompagnement : durée nécessaire à la réponse, puis au plus douze mois après le dernier échange utile, sauf obligation ou litige justifiant une conservation distincte.</li><li>Données de suivi pédagogique : pendant l’accompagnement et jusqu’à un an après sa fin, sauf demande ou nécessité particulière justifiée.</li><li>Contrats et correspondances devant être conservés comme preuve : archivage limité à la durée de prescription ou à la durée légale applicable, notamment cinq ans pour les documents concernés.</li><li>Factures et pièces comptables : dix ans à compter de la clôture de l’exercice concerné.</li><li>Données techniques de l’hébergement : durées et règles définies par l’hébergeur dans sa politique.</li></ul>
<p>Les durées portant sur les échanges s’appliquent aux dossiers gérés pour l’activité. Elles ne constituent pas une suppression automatique des fichiers que vous conservez vous-même dans votre navigateur.</p>
<h2>8. Vos droits</h2>
<p>Selon les conditions prévues par le RGPD, vous pouvez demander l’accès, la rectification, l’effacement ou la limitation du traitement de vos données ; vous disposez aussi d’un droit d’opposition et, lorsque ses conditions sont remplies, d’un droit à la portabilité. Un consentement peut être retiré à tout moment pour le traitement qui repose sur celui-ci, sans effet rétroactif.</p>
<p>Écrivez à <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a> en précisant votre demande. Une réponse est apportée en principe dans un délai d’un mois. Ce délai peut être prolongé dans les conditions légales, avec information de la personne. Une vérification d’identité proportionnée peut être demandée en cas de doute raisonnable.</p>
<p>Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>. Pour les seules données locales, l’utilisation des commandes de l’outil ou des réglages du navigateur est nécessaire, car Philosophal ne dispose pas d’un accès à distance à votre appareil.</p>
<h2>9. Mise à jour</h2>
<p>La date figurant en haut de cette page indique sa dernière mise à jour. Une évolution des fonctions ou des prestataires peut nécessiter une adaptation de cette information.</p>
''')

source = source.replace('16 septembre 2026.', '14 octobre 2026.')
if 'SIRET : 99266098500019' not in source:
    source = source.replace('<h2>1. Objet</h2>', '<p><strong>Prestataire :</strong> Florian Vallin, entrepreneur individuel (EI), nom commercial Philosophal. SIRET : 99266098500019. SIREN : 992660985. Contact : <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a>.</p><h2>1. Objet</h2>')
start = source.index('  <h2>9. Données personnelles</h2>')
end = source.index('  <h2>10. Droit de rétractation</h2>', start)
source = source[:start] + '''  <h2>9. Données personnelles</h2>
  <p>Les informations utiles à une demande ou à un accompagnement sont traitées pour répondre au client, préparer et exécuter les cours, assurer le suivi pédagogique et respecter les obligations légales. Le formulaire du site prépare un e-mail que le client choisit d’envoyer depuis sa messagerie.</p>
  <p>Les finalités, bases juridiques, destinataires, durées de conservation et droits des personnes sont détaillés dans la <a href="/confidentialite/">politique de confidentialité</a>. Les règles d’utilisation des ressources et des outils figurent dans les <a href="/cgu/">CGU</a>. Pour exercer vos droits : <a href="mailto:florianvallin@free.fr">florianvallin@free.fr</a>.</p>

''' + source[end:]
(ROOT / 'cgv.html').write_text(source)
print('CGU, politique de confidentialité et CGV préparées sans adresse personnelle.')

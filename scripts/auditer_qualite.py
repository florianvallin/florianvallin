"""Audit sans navigateur : métadonnées, liens de données, textes, sécurité, couleurs et poids."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse
import collections
import gzip
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
IGNORED = {'_site', '.git', 'node_modules', '__pycache__'}

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__();self.metas={};self.duplicates=[];self.title='';self.in_title=False;self.styles=[];self.scripts=[];self.canonical='';self.images=[];self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='title':self.in_title=True
        if tag=='meta':
            name=a.get('name') or a.get('property')
            if name:
                if name in self.metas:self.duplicates.append(name)
                self.metas[name]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
        if tag=='link' and a.get('rel') in {'stylesheet','preload'}:self.styles.append(a.get('href',''))
        if tag=='script' and a.get('src'):self.scripts.append(a['src'])
        if tag=='img':self.images.append(a)
    def handle_endtag(self, tag):
        if tag=='title':self.in_title=False
    def handle_data(self, value):
        if self.in_title:self.title+=value

def luminance(color):
    color=color.lstrip('#');color=''.join(c*2 for c in color) if len(color)==3 else color
    rgb=[int(color[i:i+2],16)/255 for i in (0,2,4)]
    return sum(weight*(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4) for weight,c in zip([.2126,.7152,.0722],rgb))

def contrast(a,b):
    low,high=sorted([luminance(a),luminance(b)]);return (high+.05)/(low+.05)

def payload(root, rel):
    path=root/rel;page=Page(path.read_text());seen=set();raw=0;compressed=0
    for href in page.styles+page.scripts:
        url=urlsplit(href)
        if url.netloc or url.scheme:continue
        asset=root/unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent/unquote(url.path)
        asset=asset.resolve()
        if asset in seen or not asset.is_file():continue
        seen.add(asset);data=asset.read_bytes();raw+=len(data)
        compressed+=len(gzip.compress(data)) if asset.suffix in {'.css','.js','.html','.json'} else len(data)
    return {'localInitialAssetsBytes':raw,'gzipEstimateBytes':compressed,'assetCount':len(seen)}

def run(root=ROOT, baseline=None):
    root=Path(root).resolve();errors=[];titles=collections.defaultdict(list);descs=collections.defaultdict(list);pages={}
    for path in root.rglob('*.html'):
        if any(p in IGNORED for p in path.relative_to(root).parts):continue
        rel=path.relative_to(root).as_posix();source=path.read_text();page=Page(source);pages[rel]=page
        if not page.title:errors.append(rel+': titre absent')
        if not page.metas.get('description'):errors.append(rel+': description absente')
        if page.duplicates:errors.append(rel+': métadonnées dupliquées '+','.join(page.duplicates))
        if page.canonical and not page.canonical.startswith('https://philosophal.fr/'):errors.append(rel+': URL canonique inattendue')
        if not page.metas.get('viewport'):errors.append(rel+': viewport absent')
        # Les applications autonomes disposent de leur propre système CSS/JS et ne
        # partagent pas les composants de contenu public (navigation, médias externes,
        # dictionnaire). Leur imposer les scripts communs dégrade leurs performances.
        standalone_apps = {
            'outils/convertisseur/index.html',
            'outils/sauvegarde-pro/index.html',
            'outils/philosophal-cut/index.html',
            'outils/philosophal-cut/editeur.html',
            'outils/studio-audiovisuel/index.html',
            'outils/studio-audiovisuel/editeur.html',
            'outils/factures/index.html',
        }
        if rel not in standalone_apps and ('site-quality.js' not in source or 'site-quality.css' not in source):errors.append(rel+': corrections communes non chargées')
        if 'noindex' not in page.metas.get('robots',''):
            titles[page.title].append(rel);descs[page.metas['description']].append(rel)
        if 'fonts.googleapis.com' in source or 'fonts.gstatic.com' in source:errors.append(rel+': police distante restante')
        if re.search(r'<iframe\b[^>]*(?<![\w-])src="https?://(?:www\.)?youtube',source):errors.append(rel+': vidéo chargée avant activation')
    for title,files in titles.items():
        if len(files)>1:errors.append('Titre indexable dupliqué : '+title+' ('+', '.join(files)+')')
    suspicious=re.compile(r'(?<![A-Za-z0-9])(?:sk-[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16})|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')
    invisible=re.compile('[\u00ad\u034f\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufeff]')
    for path in root.rglob('*'):
        if not path.is_file() or any(p in IGNORED for p in path.relative_to(root).parts):continue
        if path.suffix not in {'.js','.mjs','.html','.json','.md','.css'}:continue
        source=path.read_text(errors='replace')
        if suspicious.search(source) and path.name!='auditer_qualite.py':errors.append('Clé secrète potentielle : '+str(path.relative_to(root)))
        if 'vendor' not in path.parts and path.suffix in {'.html','.js','.json'} and invisible.search(source):errors.append('Caractère invisible parasite : '+str(path.relative_to(root)))
    for name in ['js/site-search-index.json','js/site-search-data.js']:
        source=(root/name).read_text()
        data=json.loads(source) if name.endswith('.json') else json.loads(source.removeprefix('window.FV_SITE_SEARCH_DATA = ').strip().removesuffix(';'))
        for record in data:
            url=urlsplit(record.get('url',''))
            if not url.path.startswith('/') or url.netloc:continue
            target=root/unquote(url.path).lstrip('/')
            if target.is_dir():target/='index.html'
            if not target.exists():errors.append(name+': cible de recherche absente '+url.path)
    pairs=[('#eee9f3','#24212c'),('#c3bace','#24212c'),('#cfb3ff','#24212c'),('#ffffff','#62508d')]
    colors=[{'foreground':a,'background':b,'ratio':round(contrast(a,b),2)} for a,b in pairs]
    if any(item['ratio']<4.5 for item in colors):errors.append('Palette commune sous le contraste 4,5:1')
    explicit_pairs=0
    for path in root.rglob('*.css'):
        if any(p in IGNORED for p in path.relative_to(root).parts):continue
        for match in re.finditer(r'([^{}]+)\{([^{}]*)\}',path.read_text()):
            selector,body=match.groups()
            if 'data-site-theme="dark"' not in selector or '::before' in selector or '::after' in selector:continue
            fg=re.search(r'(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,8})(?![0-9a-fA-F])',body)
            bg=re.search(r'(?:^|;)\s*background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8})(?![0-9a-fA-F])\s*(?:;|$)',body)
            if fg and bg and len(fg[1]) in {4,7} and len(bg[1]) in {4,7}:
                explicit_pairs+=1
                if contrast(fg[1],bg[1])<4.5:errors.append(str(path.relative_to(root))+': paire sombre sous 4,5:1 '+selector.strip()[:85])
    ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    sitemap=[node.text for node in ET.parse(root/'sitemap.xml').findall('.//s:loc',ns)]
    if len(sitemap)!=len(set(sitemap)):errors.append('URL dupliquée dans le sitemap')
    routes=['index.html','blog/index.html','textes/index.html','mediatheque/index.html','textes/philosophie/boussole/index.html','outils/index.html','pdf/index.html','epub/index.html']
    sizes={rel:{'after':payload(root,rel),**({'before':payload(Path(baseline).resolve(),rel)} if baseline else {})} for rel in routes}
    return {'pagesChecked':len(pages),'uniqueIndexableTitles':len(titles),'descriptionsPresent':len(pages),
            'explicitDarkPairsChecked':explicit_pairs,'sharedDarkPalette':colors,'sitemapURLs':len(sitemap),
            'performance':sizes,'errors':errors,'passed':not errors,
            'limits':['Contrôles statiques et tests JavaScript, sans rendu navigateur.','Les poids sont calculés sur les fichiers locaux, avec estimation gzip ; ils ne sont pas des durées de chargement ni un score Lighthouse.','Les liens locaux et les cibles de recherche sont contrôlés ; la disponibilité de toutes les ressources externes n’est pas garantie.']}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--baseline',type=Path);parser.add_argument('--json',type=Path);args=parser.parse_args()
    report=run(baseline=args.baseline)
    if args.json:args.json.write_text(json.dumps(report,ensure_ascii=False,indent=2))
    for error in report['errors']:print('ERREUR : '+error)
    print(f"{report['pagesChecked']} pages, {report['uniqueIndexableTitles']} titres publics distincts, {report['explicitDarkPairsChecked']} paires sombres contrôlées ; {len(report['errors'])} erreur(s).")
    raise SystemExit(0 if report['passed'] else 1)

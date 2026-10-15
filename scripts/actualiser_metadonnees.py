"""Titres et descriptions servis dans le HTML, même avant JavaScript."""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit
import json
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://philosophal.fr'
node = '''const fs=require('node:fs'),vm=require('node:vm');const c=vm.createContext({window:{},document:{querySelector:()=>null},Intl,URLSearchParams});for(const f of ['js/textes-hlp-tle.js','js/textes-catalogue.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);process.stdout.write(JSON.stringify(c.window.FV_TEXT_CATALOG));'''
records = json.loads(subprocess.run(['node', '-e', node], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
catalog = {item['id']: item for item in records}

def plain(value):
    return re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]*>', ' ', value or ''))).strip()

def short(value, maximum=165):
    value = plain(value)
    return value if len(value) <= maximum else value[:maximum-1].rsplit(' ', 1)[0].rstrip(' ,;:.') + '…'

class Head(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.metas = {}; self.canonical = ''; self.refresh = ''; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            key = a.get('name') or a.get('property')
            if key: self.metas[key] = a.get('content', '')
            if a.get('http-equiv', '').lower() == 'refresh': self.refresh = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href', '')

public_urls = set()
updated = 0
for path in sorted(ROOT.rglob('*.html')):
    if any(part in {'_site', '.git', 'node_modules'} for part in path.relative_to(ROOT).parts): continue
    source = path.read_text(); head = Head(source.split('</head>', 1)[0])
    rel = path.relative_to(ROOT).as_posix()
    url = ORIGIN + ('/' if rel == 'index.html' else '/' + rel.removesuffix('index.html'))
    title_match = re.search(r'<title>(.*?)</title>', source, re.S)
    title = plain(title_match.group(1)) if title_match else 'Philosophal'
    description = head.metas.get('description', '')
    parts = path.relative_to(ROOT).parts
    record = catalog.get(parts[1]) if len(parts) == 3 and parts[0] == 'textes' else None
    canonical = head.canonical or url
    if urlsplit(canonical).hostname not in {'philosophal.fr', 'www.philosophal.fr'}:
        canonical = url
    elif canonical.startswith('http://'):
        canonical = 'https://' + canonical.removeprefix('http://')
    if record:
        credit = record.get('authorTag') or record.get('author') or record.get('sourceTag') or ''
        title = plain(record['title']) + (f' — {credit}' if credit else '') + ' | Philosophal'
        summary = plain(record.get('description', ''))
        work = plain(record.get('work', ''))
        intro = f"Texte de {record.get('author', credit)}" if record.get('author') else 'Un texte pour réfléchir'
        if work: intro += f', {work}'
        description = short(intro + '. ' + summary)
        canonical = url
        # En attendant le rendu du lecteur, une introduction indexable remplace le bloc vide.
        fallback = '<div class="text-detail-inner" data-text-intro><header><h1>' + escape(plain(record['title'])) + '</h1><p>' + escape(plain(record.get('author', credit))) + ' · ' + escape(work) + '</p></header><p>' + escape(summary) + '</p></div>'
        pattern = re.compile(r'(<(?P<tag>main|section|div)\b[^>]*\bdata-text-detail(?:="[^"]*")?[^>]*>)\s*(</(?P=tag)>)', re.S)
        source = pattern.sub(lambda m: m.group(1) + fallback + m.group(3), source, count=1)
        placeholder = re.compile(r'(<main\b[^>]*\bdata-text-detail\b[^>]*>)\s*<div class="text-detail-inner"><p>Chargement du texte[^<]*</p></div>\s*(</main>)', re.S)
        source = placeholder.sub(lambda m: m.group(1) + fallback + m.group(2), source, count=1)
    else:
        title = title.replace(' — Florian Vallin', ' — Philosophal').replace(' | Florian Vallin', ' | Philosophal')
        if not description:
            description = 'Accès réservé aux utilisateurs autorisés de Philosophal.' if 'noindex' in head.metas.get('robots', '') else 'Consultez ' + title.split(' | ')[0].split(' — ')[0] + ' sur Philosophal : ressources de philosophie, lecture et méthodes de travail.'
    if rel == 'textes/lire/index.html':
        title = 'Lire et étudier un texte | Philosophal'
    if rel == 'index.html':
        title = 'Cours de philosophie et méthodologie à Montpellier | Philosophal'
        description = 'Cours particuliers de philosophie et de méthodologie à Montpellier ou à distance. Terminale, licence, prépa : comprendre, argumenter et progresser.'
    if rel == 'blog/tous-les-billets.html': canonical = ORIGIN + '/blog/'
    if rel == 'textes/bible/index.html': canonical = ORIGIN + '/textes/theologie/boussole/'
    match = re.search(r'url\s*=\s*([^;]+)', head.refresh, re.I)
    if match: canonical = urljoin(ORIGIN + '/' + rel, match.group(1).strip())
    if canonical.rstrip('/') == url.rstrip('/'):
        canonical = url
    description = short(description)
    title = plain(title)
    robots = head.metas.get('robots', '')
    if canonical.rstrip('/') != url.rstrip('/') or rel == 'textes/lire/index.html':
        robots = 'noindex,follow' if 'noindex' not in robots else robots
    # Une occurrence de chaque champ ; les fichiers chiffrés restent intacts.
    source = re.sub(r'<title>.*?</title>\s*', '', source, flags=re.S)
    def remove_meta(match):
        h = Head(match.group()); keys = set(h.metas)
        return '' if keys & {'description','robots','og:title','og:description','og:url','og:type','twitter:title','twitter:description'} else match.group()
    source = re.sub(r'<meta\b[^>]*>\s*', remove_meta, source, flags=re.I)
    source = re.sub(r'<link\b(?=[^>]*\brel=[\"\']canonical[\"\'])[^>]*>\s*', '', source, flags=re.I)
    tags = [f'<title>{escape(title)}</title>', f'<meta name="description" content="{escape(description, quote=True)}">', f'<link rel="canonical" href="{escape(canonical, quote=True)}">']
    if robots: tags.append(f'<meta name="robots" content="{escape(robots, quote=True)}">')
    is_article = bool(record) or (parts[0] == 'blog' and len(parts) == 3)
    for prop, value in [('og:title',title),('og:description',description),('og:url',canonical),('og:type','article' if is_article else 'website')]:
        tags.append(f'<meta property="{prop}" content="{escape(value, quote=True)}">')
    source = source.replace('</head>', '\n' + '\n'.join(tags) + '\n</head>', 1)
    path.write_text(source); updated += 1
    if 'noindex' not in robots and canonical == url: public_urls.add(canonical)

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
site = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
for url in sorted(public_urls):
    node = ET.SubElement(site, '{http://www.sitemaps.org/schemas/sitemap/0.9}url')
    ET.SubElement(node, '{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text = url
ET.ElementTree(site).write(ROOT/'sitemap.xml', encoding='utf-8', xml_declaration=True)
print(f'{updated} pages avec titre, description et URL canonique ; {len(public_urls)} URL publiques dans le sitemap.')

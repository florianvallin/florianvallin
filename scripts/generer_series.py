#!/usr/bin/env python3
"""Génère les deux pages statiques de séries à partir des épisodes JSON.

Depuis le dossier du site : python scripts/generer_series.py
Les vidéos se renseignent dans scripts/series-content/episodes.json :
"videos": [{"label": "Voir sur TikTok", "url": "https://www.tiktok.com/..."}]
Les pages générées ne dépendent pas de Python pour être consultées.
"""
from pathlib import Path
from html import escape
from urllib.parse import urlsplit
import json
import re
import argparse
from series_calendar import paris_day, public_episode

ROOT = Path(__file__).resolve().parents[1]
RELEASE = '20261022-v39'
SERIES_URL = '/series/philosophie-de-l-amour/'
parser = argparse.ArgumentParser(description='Générer les pages selon le jour de publication à Paris.')
parser.add_argument('--as-of', help='Date/instant simulé, uniquement vers un répertoire de test.')
parser.add_argument('--output-root', type=Path)
args = parser.parse_args()
if args.as_of and (not args.output_root or args.output_root.resolve() == ROOT):
    parser.error('--as-of exige --output-root vers un répertoire de test distinct du site.')
OUTPUT = args.output_root.resolve() if args.output_root else ROOT
TODAY = paris_day(args.as_of)
DATA = json.loads((ROOT / 'scripts/series-content/episodes.json').read_text())
EXCERPTS = json.loads((ROOT / 'scripts/series-content/excerpts.json').read_text())
EPISODES = [public_episode(e, TODAY, EXCERPTS) for e in sorted(DATA['episodes'], key=lambda e: e['number'])]
HOME = (ROOT / 'index.html').read_text()
HEADER = re.search(r'<header class="navbar\b.*?</header>', HOME, re.S).group()
HEADER = re.sub(r' aria-current="(?:page|location)"', '', HEADER)
HEADER = HEADER.replace('class="nav-videos-link"', 'class="nav-videos-link" aria-current="page"')
FOOTER = re.search(r'<footer class="site-footer".*?</footer>', HOME, re.S).group()
E = escape
ARROW = '<span aria-hidden="true">↗</span>'
BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1m0-14c3-2 6-2 9-1v14c-3-1-6-1-9 1V6Z"/></svg>'

EMBLEM = '''<svg class="series-emblem" viewBox="0 0 310 310" fill="none" aria-hidden="true">
  <circle class="emblem-line" cx="155" cy="155" r="147" stroke-width="1"/>
  <path class="emblem-line" d="M8 155h294M155 8v294" stroke-width="1"/>
  <circle class="emblem-fill" cx="119" cy="155" r="77"/>
  <circle cx="119" cy="155" r="77" stroke="currentColor" stroke-width="1.4"/>
  <circle cx="191" cy="155" r="77" stroke="currentColor" stroke-width="1.4"/>
  <circle cx="155" cy="87" r="3.5" fill="currentColor"/>
  <circle cx="155" cy="223" r="3.5" fill="currentColor"/>
</svg>'''

MOTIFS = [
    '<circle cx="66" cy="80" r="45"/><circle cx="114" cy="80" r="45"/><circle cx="39" cy="80" r="3" fill="currentColor"/><circle cx="141" cy="80" r="3" fill="currentColor"/><path d="M24 141h132" opacity=".25"/>',
    '<path d="M80 28a52 52 0 0 0 0 104Zm20 0a52 52 0 0 1 0 104Z"/><path d="M90 19v122" stroke-dasharray="2 5" opacity=".35"/>',
    '<circle cx="132" cy="80" r="22"/><circle cx="132" cy="80" r="45" opacity=".3"/><circle cx="25" cy="80" r="9"/><path d="M45 80h57m-9-9 9 9-9 9"/><circle cx="132" cy="80" r="3" fill="currentColor"/>'
]

def link(label, url, cls='series-secondary', icon=ARROW):
    external = urlsplit(url).scheme == 'https'
    if not (external or url.startswith('/') or url.startswith('#')):
        raise ValueError('Lien non pris en charge : ' + url)
    attrs = ' target="_blank" rel="noopener noreferrer"' if external else ''
    return f'<a class="{E(cls)}" href="{E(url, quote=True)}"{attrs}>{E(label)}{icon}</a>'

def page(title, description, url, content, schema):
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <script src="/js/navigation-shortcuts.js?v={RELEASE}"></script>
  <script src="/js/theme-prepaint.js?v=20261022-v39"></script>
  <script src="/js/series-display.js?v={RELEASE}"></script>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{E(title)} | Philosophal</title>
  <meta name="description" content="{E(description, quote=True)}">
  <link rel="canonical" href="https://philosophal.fr{url}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#faf9f6">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="Philosophal">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{E(title, quote=True)} | Philosophal">
  <meta property="og:description" content="{E(description, quote=True)}">
  <meta property="og:url" content="https://philosophal.fr{url}">
  <meta property="og:image" content="https://philosophal.fr/images/logo-philosophal.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20261017-official-transparent5">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20261022-v39">
  <link rel="preload" href="/assets/fonts/InterVariable-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/site-theme.css?v=20261022-v39">
  <link rel="stylesheet" href="/css/style.css?v={RELEASE}">
  <link rel="stylesheet" href="/css/series.css?v={RELEASE}">
  <link rel="stylesheet" href="/css/site-quality.css?v=20261022-v39">
  <link rel="stylesheet" href="/css/site-theme-v4.css?v=20261022-v39" data-ph-dark-v4>
  <script src="/js/site-quality.js?v=20261022-v39"></script>
  <script src="/js/site-theme.js?v=20261022-v39"></script>
  <script src="/js/private-access.js?v={RELEASE}"></script>
  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False).replace('<', r'\u003c')}</script>
</head>
<body id="top" class="series-page" data-series-calendar data-series-as-of="{TODAY.isoformat()}">
  <a class="series-skip" href="#contenu">Aller au contenu</a>
  {HEADER}
  <main id="contenu" class="series-main">
    <div class="series-container">
      {content}
    </div>
  </main>
  {FOOTER}
  <script src="/js/script.js?v={RELEASE}" defer></script>
  <script src="/js/series-schedule.js?v={RELEASE}" defer></script>
</body>
</html>
'''

def excerpt_panels(ep):
    panels = []
    for source in ep.get('excerpts', []):
        paragraphs = source.get('paragraphs', [])
        if not paragraphs:
            continue
        quoted = ''.join('<p>' + ('« ' if i == 0 else '') + E(text) + (' »' if i == len(paragraphs)-1 else '') + '</p>' for i, text in enumerate(paragraphs))
        panels.append(f'<details class="episode-excerpt"><summary>Lire l’extrait · {E(source["work"])} {E(source["range"])}</summary><div class="episode-excerpt-body"><blockquote cite="{E(source["sourceUrl"], quote=True)}">{quoted}</blockquote><p class="episode-excerpt-reference"><cite>{E(source["reference"])}</cite></p>{link("Consulter la source publique", source["sourceUrl"])}</div></details>')
    return ''.join(panels)


def episode(ep):
    n = ep['number']
    planned = ep.get('plannedDate', '')
    if not ep['available']:
        human_date = f'{planned[8:10]}/{planned[5:7]}/{planned[:4]}'
        return f'''<li><article id="{E(ep['id'])}" class="series-episode series-episode--scheduled" aria-labelledby="titre-{E(ep['id'])}" data-release-date="{E(planned)}"><div class="episode-visual"><span class="episode-number" aria-hidden="true">{n:02}</span><svg class="episode-motif" viewBox="0 0 180 160" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="90" cy="78" r="42"/><path d="M90 48v30l20 12"/><path d="M35 142h110" opacity=".25"/></svg></div><div class="episode-content"><p class="episode-meta">Épisode {n:02} · À venir</p><h3 id="titre-{E(ep['id'])}">{E(ep['title'])}</h3><p class="episode-planned">À découvrir le <time datetime="{E(planned)}">{human_date}</time></p></div></article></li>'''
    date_note = (f'<p class="episode-planned">Disponible depuis le <time datetime="{E(planned)}">{planned[8:10]}/{planned[5:7]}/{planned[:4]}</time></p>' if planned else '')
    if ep.get('announcedOnly'):
        return f'''<li><article id="{E(ep['id'])}" class="series-episode series-episode--announced" aria-labelledby="titre-{E(ep['id'])}"><div class="episode-visual"><span class="episode-number" aria-hidden="true">{n:02}</span></div><div class="episode-content"><p class="episode-meta">Épisode {n:02}</p><h3 id="titre-{E(ep['id'])}">{E(ep['title'])}</h3>{date_note}</div></article></li>'''
    motif = MOTIFS[(n - 1) % len(MOTIFS)]
    videos = ''
    for video in ep.get('videos', []):
        button = link(video['label'], video['url'], 'series-secondary')
        if video['label'].startswith('Voir sur '):
            label = '<span class="episode-video-label"><span class="episode-video-verb">Voir sur </span>' + E(video['label'][9:]) + '</span>'
            button = button.replace(E(video['label']), label, 1)
        videos += button
    video_note = '<div class="episode-video-links">' + videos + '</div>' if videos else '<p class="episode-video-note">Vidéo à venir</p>'
    reading = ''.join(link(source['title'], source['url'], 'series-secondary', BOOK) for source in ep.get('sources', []))
    return f'''<!-- ÉPISODE {n:02} : contenu dans episodes.json ; liens vidéo dans le tableau videos. -->
      <li>
        <article id="{E(ep['id'])}" class="series-episode" aria-labelledby="titre-{E(ep['id'])}">
          <div class="episode-visual">
            <div class="episode-visual-top"><span>Philosophie de l’amour</span></div>
            <svg class="episode-motif" viewBox="0 0 180 160" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">{motif}</svg>
            <div class="episode-visual-bottom"><span class="episode-number" aria-hidden="true">{n:02}</span>{video_note}</div>
          </div>
          <div class="episode-content">
            <p class="episode-meta">Épisode {n:02} · {E(ep['author'])}</p>
            {date_note}
            <h3 id="titre-{E(ep['id'])}">{E(ep['title'])}</h3>
            <p class="episode-question">{E(ep['question'])}</p>
            <p class="episode-description">{E(ep['description'])}</p>
            <div class="episode-reading">{reading}</div>
            {excerpt_panels(ep)}
          </div>
        </article>
      </li>'''

def course_cta(minimal=False):
    if minimal:
        return '''<aside class="series-course-minimal" aria-label="Cours particuliers"><p>Envie d’approfondir en cours ?</p><a href="/#contact">Prendre un cours <span aria-hidden="true">→</span></a></aside>'''
    return '''<section class="series-course-cta" aria-labelledby="cours-title"><div><span class="series-kicker">Cours particuliers</span><h2 id="cours-title">Aller plus loin, ensemble.</h2><p>Philosophie et méthodologie, à Montpellier ou à distance.</p></div><a class="series-primary" href="/#contact">Prendre un cours <span aria-hidden="true">→</span></a></section>'''

def view_control(label):
    return f'''<div class="series-view-control" data-series-view-control hidden><span>Affichage</span><div class="series-view-options" role="group" aria-label="{E(label)}"><button type="button" data-series-view-choice="detailed" aria-pressed="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="14" height="6" rx="1.5"/><rect x="3" y="12" width="14" height="5" rx="1.5"/></svg>Détaillé</button><button type="button" data-series-view-choice="compact" aria-pressed="false"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M7 4h10M7 10h10M7 16h10M3 4h1M3 10h1M3 16h1"/></svg>Compact</button></div></div>'''

follow = f'''<section class="series-follow" aria-labelledby="suivre-la-serie">
        <h2 id="suivre-la-serie">Les vidéos sur les réseaux</h2>
        <nav aria-label="Suivre Philosophal">{link('TikTok', 'https://www.tiktok.com/@lephilosophal')}{link('YouTube', 'https://www.youtube.com/channel/UClfhjKJbbtW0HJPcxDdTwyg')}</nav>
      </section>'''

index_content = f'''<nav class="series-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">Vidéos</span></nav>
      <section class="series-hero series-index-hero" aria-labelledby="series-title">
        <div class="series-hero-copy"><p class="series-kicker">Les vidéos Philosophal</p><h1 class="series-title" id="series-title">Une question.<br><em>Plusieurs chemins.</em></h1><p class="series-lead">Des vidéos sur des thèmes qui m’intéressent, avec des renvois vers les extraits de textes correspondants.</p><p class="series-caption">Vidéos et Textes sources</p></div>
        {EMBLEM}
      </section>
      <section class="series-listing" aria-labelledby="series-en-cours">
        <div class="series-section-head"><h2 class="series-section-title" id="series-en-cours">Les séries</h2>{view_control('Affichage des séries')}</div>
        <a class="series-collection-card" href="{SERIES_URL}" aria-label="Philosophie de l’amour — {len(EPISODES)} épisodes">
          <div class="series-collection-art" aria-hidden="true">{EMBLEM.replace('class="series-emblem"', 'class="series-collection-emblem"')}</div>
          <div class="series-collection-copy"><h2>Philosophie de l’<em>amour</em></h2><span class="series-episode-count">{len(EPISODES)} épisodes</span><span class="series-card-arrow" aria-hidden="true">→</span></div>
        </a>
      </section>
      {course_cta(minimal=True)}'''

jumps = ''.join(f'<a href="#{E(e["id"])}"><span>{e["number"]:02}</span>{E((e["author"].split(" · ")[0]+" · ") if e.get("author") else "")}{E(e["title"])}</a>' for e in EPISODES)
series_content = f'''<nav class="series-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><a href="/series/">Vidéos</a><span aria-hidden="true">/</span><span aria-current="page">Philosophie de l’amour</span></nav>
      <header class="series-hero series-hero--compact">
        <h1 class="series-title" id="series-title">Philosophie de <em>l’amour</em></h1>
        <p class="series-caption">Un épisode, une question, des textes pour aller plus loin.</p>
      </header>
      <nav class="series-jump" aria-label="Aller à un épisode">{jumps}</nav>
      <section aria-labelledby="episodes-title">
        <div class="series-section-head"><h2 class="series-section-title" id="episodes-title">Les épisodes</h2>{view_control('Affichage des épisodes')}</div>
        <ol class="series-episodes">{''.join(episode(e) for e in EPISODES)}</ol>
      </section>
      {follow}
      {course_cta()}'''

series_schema = {'@context':'https://schema.org','@type':'CreativeWorkSeries','name':DATA['title'],'url':'https://philosophal.fr'+SERIES_URL,'inLanguage':'fr','creator':{'@type':'Person','name':'Florian Vallin'},'hasPart':[{'@type':'CreativeWork','name':e['title'],'position':e['number'],'url':'https://philosophal.fr'+SERIES_URL+'#'+e['id']} for e in EPISODES]}
index_schema = {'@context':'https://schema.org','@type':'CollectionPage','name':'Vidéos — Philosophal','url':'https://philosophal.fr/series/','mainEntity':{'@type':'ItemList','itemListElement':[{'@type':'ListItem','position':1,'url':'https://philosophal.fr'+SERIES_URL,'name':DATA['title']}]}}
(OUTPUT / 'series').mkdir(parents=True, exist_ok=True)
(OUTPUT / 'series/philosophie-de-l-amour').mkdir(parents=True, exist_ok=True)
(OUTPUT / 'series/index.html').write_text(page('Vidéos et textes sources', 'Des vidéos sur des thèmes qui m’intéressent, avec des renvois vers les extraits de textes correspondants.', '/series/', index_content, index_schema))
(OUTPUT / 'series/philosophie-de-l-amour/index.html').write_text(page('Philosophie de l’amour', 'Un épisode, une question, des textes pour aller plus loin. Retrouvez les vidéos et les textes associés à Philosophie de l’amour.', SERIES_URL, series_content, series_schema))
(OUTPUT / 'series/philosophie-de-l-amour/episodes.json').write_text(json.dumps({'asOf':TODAY.isoformat(), 'timezone':'Europe/Paris', 'episodes':EPISODES}, ensure_ascii=False, indent=2)+'\n')
print(f'{TODAY.isoformat()} (Paris) : {sum(e["available"] for e in EPISODES)} épisode(s) disponible(s), {sum(not e["available"] for e in EPISODES)} à venir.')


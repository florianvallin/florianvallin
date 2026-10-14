#!/usr/bin/env python3
"""Vérifie les index de rubriques, les menus, les ancres et les billets."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.text = text
        self.links = []
        self.ids = set()
        self.cards = []
        self.refresh = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'a' and a.get('href'):
            self.links.append((a.get('class', '').split(), a['href']))
            if 'data-blog-card' in a:
                self.cards.append(a['href'])
        if tag == 'meta' and a.get('http-equiv', '').lower() == 'refresh':
            self.refresh.append(a.get('content', ''))


def run_checks(root):
    root = Path(root).resolve()
    errors = []
    pages = {p: Page(p.read_text()) for p in root.rglob('*.html')
             if not any(part in {'.git', 'node_modules', '_site'} for part in p.relative_to(root).parts)}
    origin = 'https://philosophal.fr'
    menu = {
        'nav-brand': '/', 'nav-texts-link': '/textes/',
        'nav-blog-link': '/blog/', 'nav-tools-link': '/outils/',
        'nav-services-link': '/#philosophie', 'nav-about-link': '/#quisuisje',
        'nav-faq-link': '/#faq', 'nav-contact-link': '/#contact',
    }
    anchors_checked = 0
    menu_checked = 0
    for path, page in pages.items():
        rel = path.relative_to(root).as_posix()
        base = origin + '/' + rel
        for classes, href in page.links:
            url = urlsplit(urljoin(base, href))
            if url.netloc != 'philosophal.fr':
                continue
            logical = re.sub(r'/index\.html$', '/', url.path)
            fragment = unquote(url.fragment)
            logical += '#' + fragment if fragment else ''
            for name, expected in menu.items():
                if name in classes:
                    menu_checked += 1
                    if logical != expected:
                        errors.append(f'{rel} : {name} ouvre {logical} au lieu de {expected}.')
            if fragment:
                dest = root / unquote(url.path).lstrip('/')
                if dest.is_dir():
                    dest /= 'index.html'
                if dest in pages:
                    anchors_checked += 1
                    if fragment not in pages[dest].ids:
                        errors.append(f'{rel} : ancre introuvable {href}.')

    hubs = {
        'blog/index.html': ('Blog — Tous les billets', 'data-blog-card'),
        'outils/index.html': ('Outils gratuits', 'tools-grid'),
        'mediatheque/index.html': ('Médiathèque — Philosophal', 'data-media-search'),
        'textes/index.html': ('Textes de philosophie, mythologie, théologie', 'textes/philosophie/'),
        'pomodoro/index.html': ('Pomodoro — Philosophal', 'pomo-'),
    }
    for name, (title, marker) in hubs.items():
        page = pages.get(root / name)
        if not page:
            errors.append(f'Accueil de rubrique absent : {name}.')
            continue
        actual_title = re.search(r'<title>(.*?)</title>', page.text, re.S)
        if not actual_title or title not in actual_title.group(1) or marker not in page.text:
            errors.append(f'{name} : l’index contient une autre page que son accueil de rubrique.')
        if page.refresh or re.search(r'(?:window\.)?location\.(?:replace|assign)\(', page.text):
            errors.append(f'{name} : l’accueil de rubrique ne doit pas rediriger vers un outil ou un article.')

    blog = pages.get(root / 'blog/index.html')
    if blog:
        expected = {f'/blog/{p.name}/' for p in (root / 'blog').iterdir()
                    if p.is_dir() and (p / 'index.html').is_file()}
        found = set(blog.cards)
        for url in sorted(expected - found):
            errors.append(f'Billet absent de la liste du blog : {url}.')
        for url in sorted(found - expected):
            errors.append(f'Billet inexistant dans la liste du blog : {url}.')
        if len(blog.cards) != len(found):
            errors.append('La liste du blog contient un billet en double.')
        legacy = pages.get(root / 'blog/tous-les-billets.html')
        if legacy and set(legacy.cards) != found:
            errors.append('L’ancienne adresse du blog ne présente pas tous les mêmes billets.')

    tools = pages.get(root / 'outils/index.html')
    if tools:
        found = {urlsplit(urljoin(origin + '/outils/', href)).path for _, href in tools.links}
        for url in ['/editeurtexte/', '/epub/', '/editeurimage/', '/pdf/', '/pomodoro/', '/outils/sauvegarde/']:
            if url not in found:
                errors.append(f'Outil absent de la page Outils : {url}.')

    return {'pagesChecked': len(pages), 'menuLinksChecked': menu_checked,
            'anchorsChecked': anchors_checked, 'blogPosts': len(blog.cards) if blog else 0,
            'errors': errors, 'passed': not errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    report = run_checks(args.root)
    if args.json:
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    for error in report['errors']:
        print('ERREUR : ' + error)
    print(f"{report['pagesChecked']} pages, {report['menuLinksChecked']} liens de menu, "
          f"{report['anchorsChecked']} ancres et {report['blogPosts']} billets contrôlés ; "
          f"{len(report['errors'])} erreur(s).")
    raise SystemExit(0 if report['passed'] else 1)

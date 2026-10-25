"""Vérifications de calendrier, de non-divulgation et d'accordéons validés."""
from datetime import date
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import re
import shutil
import subprocess
import sys
import unittest

from series_calendar import paris_day, public_episode

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT/'scripts/series-content/episodes.json').read_text())
EXCERPTS = json.loads((ROOT/'scripts/series-content/excerpts.json').read_text())


class Publication(unittest.TestCase):
    def test_paris_midnight_and_clock_change(self):
        for instant, day in [
            ('2026-10-22T21:59:59Z', '2026-10-22'),
            ('2026-10-22T22:00:00Z', '2026-10-23'),
            ('2026-10-26T22:59:59Z', '2026-10-26'),
            ('2026-10-26T23:00:00Z', '2026-10-27'),
            ('2026-10-28T22:59:59Z', '2026-10-28'),
            ('2026-10-28T23:00:00Z', '2026-10-29'),
        ]:
            with self.subTest(instant=instant):
                self.assertEqual(paris_day(instant).isoformat(), day)

    def test_forthcoming_public_json_has_only_teaser_fields(self):
        for ep in DATA['episodes'][1:]:
            record = public_episode(ep, date(2026,10,22), EXCERPTS)
            self.assertEqual(set(record), {'number','id','title','plannedDate','available'})
            self.assertFalse(record['available'])

    def test_approval_and_date_are_both_required(self):
        ep = {'number':9,'id':'fixture','title':'Titre','plannedDate':'2026-10-25',
              'author':'Auteur secret','description':'Description secrète','excerptIds':['fixture']}
        proposed = {'fixture':{'approved':False,'paragraphs':['Extrait secret']}}
        self.assertNotIn('excerpts', public_episode(ep,date(2026,10,24),proposed))
        self.assertEqual(public_episode(ep,date(2026,10,25),proposed)['excerpts'], [])
        proposed['fixture']['approved'] = True
        self.assertEqual(public_episode(ep,date(2026,10,25),proposed)['excerpts'][0]['paragraphs'], ['Extrait secret'])

    def test_html_and_manifest_at_the_actual_boundaries(self):
        for instant, available in [
            ('2026-10-24T21:59:59Z',1),('2026-10-24T22:00:00Z',2),
            ('2026-10-26T22:59:59Z',2),('2026-10-26T23:00:00Z',3),
            ('2026-10-28T22:59:59Z',3),('2026-10-28T23:00:00Z',4),
        ]:
            with self.subTest(instant=instant), TemporaryDirectory() as tmp:
                subprocess.run([sys.executable,str(ROOT/'scripts/generer_series.py'),
                                '--as-of',instant,'--output-root',tmp],check=True,capture_output=True)
                target = Path(tmp)/'series/philosophie-de-l-amour'
                page = (target/'index.html').read_text()
                manifest = json.loads((target/'episodes.json').read_text())
                self.assertEqual(sum(ep['available'] for ep in manifest['episodes']),available)
                for source in DATA['episodes']:
                    card = re.search(r'<article id="'+re.escape(source['id'])+r'".*?</article>',page,re.S).group()
                    if source['number'] > available:
                        self.assertNotIn('episode-description',card)
                        self.assertNotIn('episode-reading',card)
                        self.assertNotIn('<details',card)
                        self.assertNotIn(source.get('author','UNIQUE_SENTINEL'),card)
                        if source.get('description'):
                            self.assertNotIn(source['description'],page)
                    else:
                        self.assertNotIn('data-release-date=',card)
                        public = next(ep for ep in manifest['episodes'] if ep['id'] == source['id'])
                        expected = [EXCERPTS[key] for key in source.get('excerptIds', [])
                                    if EXCERPTS[key].get('approved') is True]
                        self.assertEqual(public['excerpts'], expected)
                        self.assertEqual(len(re.findall(r'<details class="episode-excerpt"(?: open)?>',card)), len(expected))
                self.assertNotIn('approved',page)

    def test_social_links_and_course_location_copy(self):
        with TemporaryDirectory() as tmp:
            subprocess.run([sys.executable,str(ROOT/'scripts/generer_series.py'),
                            '--as-of','2026-10-25','--output-root',tmp],check=True,capture_output=True)
            pages=[Path(tmp)/'series/index.html',
                   Path(tmp)/'series/philosophie-de-l-amour/index.html']
            for path in pages:
                with self.subTest(path=path):
                    text=path.read_text()
                    self.assertIn('https://www.instagram.com/lephilosophal/',text)
                    self.assertIn('https://www.facebook.com/people/Philosophal/61595862237018/?locale=fr_FR',text)
                    self.assertNotIn('à Montpellier ou à distance.',text)

    def test_future_simulation_cannot_overwrite_the_site(self):
        result = subprocess.run([sys.executable,str(ROOT/'scripts/generer_series.py'),
                                 '--as-of','2026-10-27'],capture_output=True)
        self.assertNotEqual(result.returncode,0)

    def test_real_accordion_renderer_after_approval(self):
        with TemporaryDirectory() as tmp:
            clone = Path(tmp)/'source'
            (clone/'scripts/series-content').mkdir(parents=True)
            for name in ['index.html','scripts/generer_series.py','scripts/series_calendar.py','scripts/series-content/episodes.json']:
                shutil.copy2(ROOT/name,clone/name)
            ep = DATA['episodes'][1]
            fixture = {ep['excerptIds'][0]:{'approved':True,'work':'Le Banquet','range':'189d–191d',
                'reference':'Platon, Le Banquet, 189d–191d, trad. Émile Chambry.',
                'sourceUrl':'https://fr.wikisource.org/wiki/Banquet','paragraphs':['Extrait témoin <vérifié>.']}}
            (clone/'scripts/series-content/excerpts.json').write_text(json.dumps(fixture))
            output = Path(tmp)/'output'
            result = subprocess.run([sys.executable,str(clone/'scripts/generer_series.py'),
                            '--as-of','2026-10-25','--output-root',str(output)],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            page = (output/'series/philosophie-de-l-amour/index.html').read_text()
            self.assertIn('<details class="episode-excerpt" open>',page)
            self.assertIn('« Extrait témoin &lt;vérifié&gt;. »',page)
            self.assertIn('trad. Émile Chambry.',page)


if __name__ == '__main__':
    unittest.main()

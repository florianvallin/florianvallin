#!/usr/bin/env python3
"""Contrôle local, sans dépendance Python externe, avant toute publication."""
import argparse,hashlib,json,re,shutil,subprocess,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.robots='';self.navs=0;self.navends=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='nav':self.navs+=1
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  for key in (['href'] if tag in ['a','link'] else ['src'] if tag in ['script','img','iframe','source','video','audio'] else []):
   if a.get(key):self.links.append((tag,a[key]))
 def handle_endtag(self,tag):
  if tag=='nav':self.navends+=1
errors=[];warnings=[];count=0
parser=argparse.ArgumentParser();parser.add_argument('--require-node',action='store_true');parser.add_argument('--json',type=Path);args=parser.parse_args()
manifest_path=ROOT/'private/manifest.json'
try:
 manifest=json.loads(manifest_path.read_text());virtual=set(manifest['virtualPaths'])
 for role,pack in manifest['packs'].items():
  path=ROOT/pack['path'].lstrip('/')
  if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest()!=pack['sha256']:errors.append('Archive privée absente ou modifiée : '+role)
 if manifest.get('iterations',0)<600000:errors.append('Dérivation des mots de passe insuffisante.')
 if {p['role'] for p in manifest['profiles']}!={'private','student'}:errors.append('Les deux profils d’accès sont nécessaires.')
except Exception as e:errors.append('Manifest privé invalide : '+str(e));virtual=set()
if (ROOT/'main').exists():errors.append('Le dossier main/ imbriqué doit être retiré de cette version.')
try:
 obsolete=json.loads((ROOT/'obsolete-files.json').read_text())
 for name in obsolete['removeDirectories']:
  if (ROOT/name).exists():errors.append('Ancien dossier à nettoyer : '+name)
 for name in obsolete['removeFiles']:
  if (ROOT/name).exists():errors.append('Ancien fichier privé encore publié en clair : '+name)
except Exception as e:errors.append('Liste de nettoyage absente : '+str(e))
for p in sorted(ROOT.rglob('*.html')):
 if any(part in ['.git','_site','node_modules'] for part in p.relative_to(ROOT).parts):continue
 count+=1;page=Page()
 try:page.feed(p.read_text())
 except Exception as e:errors.append(str(p.relative_to(ROOT))+': HTML illisible '+str(e));continue
 if page.navs!=page.navends:errors.append(str(p.relative_to(ROOT))+': balises de navigation déséquilibrées')
 if 'data-private-path=' in p.read_text() and 'noindex' not in page.robots:errors.append(str(p.relative_to(ROOT))+': page privée indexable')
 for tag,url in page.links:
  u=urlsplit(url)
  if u.scheme or u.netloc or url.startswith(('#','data:','blob:')):continue
  path=unquote(u.path)
  target=ROOT/path.lstrip('/') if path.startswith('/') else p.parent/path
  if not path:target=p
  try:relative='/'+target.resolve().relative_to(ROOT.resolve()).as_posix()
  except ValueError:errors.append(str(p.relative_to(ROOT))+': lien en dehors du site '+url);continue
  if target.is_dir():target=target/'index.html';relative=relative.rstrip('/')+'/index.html'
  if not target.exists() and relative not in virtual:errors.append(str(p.relative_to(ROOT))+': fichier introuvable '+url)
# Les références CSS locales doivent aussi exister.
for p in (ROOT/'css').glob('*.css'):
 for url in re.findall(r'url\(\s*[\'"]?([^\)\'"\s]+)',p.read_text()):
  if urlsplit(url).scheme or url.startswith(('#','//','data:')):continue
  target=ROOT/url.split('?')[0].lstrip('/') if url.startswith('/') else p.parent/url.split('?')[0]
  if not target.exists():warnings.append(str(p.relative_to(ROOT))+': ressource CSS à vérifier '+url)
node=shutil.which('node')
if node:
 for p in sorted([*ROOT.rglob('*.js'),*ROOT.rglob('*.mjs')]):
  if any(x in ['.git','_site','node_modules'] for x in p.relative_to(ROOT).parts):continue
  result=subprocess.run([node,'--check',str(p)],capture_output=True,text=True)
  if result.returncode:errors.append(str(p.relative_to(ROOT))+': JavaScript invalide\n'+result.stderr[:500])
else:
 (errors if args.require_node else warnings).append('Node.js absent : contrôle de syntaxe JavaScript non exécuté.')
# Les tests des sources privées ont été faits avant chiffrement ; leurs archives sont scellées par empreinte.
try:
 control=json.loads((ROOT/'private/controle-sources.json').read_text())
 if not control.get('javascriptChecked'):errors.append('Contrôle des sources privées absent.')
 for role,pack in manifest['packs'].items():
  if control['ciphertextSHA256'].get(role)!=pack['sha256']:errors.append('Archives privées non validées : '+role)
except Exception as e:errors.append('Attestation des sources privées invalide : '+str(e))
for directory in ['js','mediatheque','apprendre','lecture','private']:
 for p in (ROOT/directory).rglob('*'):
  if p.is_file() and p.suffix in ['.js','.json','.html','.txt','.md']:
   text=p.read_text(errors='replace')
   if re.search(r'Ph-[A-Za-z0-9_-]{24,}',text):errors.append('Un mot de passe semble figurer dans '+str(p.relative_to(ROOT)))
   if 'OWNER_SHA256' in text:errors.append('Ancien contrôle propriétaire contournable dans '+str(p.relative_to(ROOT)))
errors=list(dict.fromkeys(errors));warnings=list(dict.fromkeys(warnings))
report={'version':32,'pagesChecked':count,'errors':errors,'warnings':warnings,'passed':not errors}
if args.json:args.json.write_text(json.dumps(report,ensure_ascii=False,indent=2))
for message in errors:print('ERREUR : '+message)
for message in warnings:print('NOTE : '+message)
print(f'{count} pages contrôlées ; {len(errors)} erreur(s), {len(warnings)} note(s).')
print('Publication autorisée par le contrôle.' if not errors else 'Publication bloquée : corrigez les erreurs ci-dessus.')
sys.exit(1 if errors else 0)

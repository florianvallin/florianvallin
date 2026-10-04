from pathlib import Path
import json,shutil
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'obsolete-files.json').read_text())
removed=0
archive=root.parent/("Philosophal-archive-ancienne-version-"+__import__("datetime").datetime.now().strftime("%Y%m%d-%H%M%S"))
# Liste limitée aux fichiers retirés de V30 ; .git et les données du navigateur ne sont jamais touchés.
for name in manifest['removeFiles']:
 p=(root/name).resolve()
 if not p.is_relative_to(root.resolve()) or '.git' in p.parts:raise SystemExit('Chemin de nettoyage refusé.')
 if p.is_file():
  target=archive/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.move(str(p),str(target));removed+=1
for name in manifest['removeDirectories']:
 if name not in {'main','textes/comparer'}:raise SystemExit('Dossier non autorisé.')
 p=root/name
 if p.exists():
  (archive/name).parent.mkdir(parents=True,exist_ok=True);shutil.move(str(p),str(archive/name));removed+=1
print(str(removed)+' anciens fichiers ou dossiers archivés hors du site. Le dossier .git est conservé.')

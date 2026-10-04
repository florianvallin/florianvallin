from pathlib import Path
import shutil,sys
root=Path(__file__).resolve().parents[1]
dest=root/(sys.argv[1] if len(sys.argv)>1 else '_site')
if dest.resolve()!=root/'_site':raise SystemExit('La publication doit être préparée dans le dossier _site du projet.')
if dest.exists():shutil.rmtree(dest)
dest.mkdir()
for p in root.iterdir():
 if p.name in {'scripts','.github','.git','.vscode','_site','main','obsolete-files.json','README-MISE-A-JOUR.md','verification-resultat.json','__pycache__'} or p.suffix.lower() in {'.cmd','.ps1','.txt','.md','.zip'}:continue
 if p.is_dir():shutil.copytree(p,dest/p.name)
 else:shutil.copy2(p,dest/p.name)
print('Version à publier préparée dans '+str(dest.name))

import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const get=p=>readFileSync(resolve(root,p),'utf8');
const nav=get('js/pro-workspace-nav.js'),css=get('css/pro-workspace-nav.css');
const studio=get('outils/studio-audiovisuel/editeur.html');
const cut=get('outils/philosophal-cut/editeur.html');
const hub=get('js/invoice-access.js');
for(const p of ['outils/studio-audiovisuel/index.html','outils/philosophal-cut/index.html','outils/factures/index.html']){
 const txt=get(p);assert.match(txt,/\/js\/pro-workspace-nav\.js\?v=20261025-v54\.6/);assert.match(txt,/\/css\/pro-workspace-nav\.css\?v=20261025-v54\.6/);
}
assert.match(css,/z-index:10005/);
assert.match(css,/\.ph-pro-switcher\[open\]/);
assert.match(nav,/philosophal-studio-state/);
assert.match(studio,/id="v546-session-guard"/);
assert.match(cut,/id="v546-cut-surface"/);
assert.match(hub,/data-pro-storage/);
for(const p of ['/outils/factures/','/outils/philosophal-cut/','/outils/studio-audiovisuel/'])assert(existsSync(resolve(root,p.slice(1),'index.html')));
console.log('OK V54.6 : outils professionnels, navigation, sauvegarde et adaptativité');

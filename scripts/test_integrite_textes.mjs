import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function norm(v){
  if(typeof v==='string')return v.replace(/[\u00ad\u034f\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufeff]/g,'').replace(/[\u00a0\u202f]/g,' ').replace(/&(?:nbsp|#0*160|#x0*a0|#0*8239|#x0*202f);/gi,' ').replace(/&(?:shy|#0*173|#x0*ad);/gi,'');
  if(Array.isArray(v))return v.map(norm);
  if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])]));
  return v;
}
const ctx=vm.createContext({window:{},document:{querySelector:()=>null},Intl,URLSearchParams});
for(const name of ['js/textes-hlp-tle.js','js/textes-catalogue.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),ctx);
const expected=JSON.parse(fs.readFileSync(path.join(root,'scripts/integrite-textes.json'),'utf8'));
const records=ctx.window.FV_TEXT_CATALOG;
assert.equal(records.length,Object.keys(expected).length);
for(const record of records){const digest=crypto.createHash('sha256').update(JSON.stringify(norm(record))).digest('hex');assert.equal(digest,expected[record.id],'Texte ou annotations modifiés : '+record.id);}
console.log(`${records.length} textes intégraux et leurs annotations sont préservés après normalisation des caractères parasites.`);

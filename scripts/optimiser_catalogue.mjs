/* Index légers : les fiches de lecture gardent les sources complètes. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const drop = new Set(['paragraphs','readingBlocks','glossary','readingQuestions','artworks','relatedTexts','readingGuide','problematisations','pedagogicalHook']);
function arraySpan(source, name) {
  const start = source.indexOf('[', source.indexOf(`const ${name} =`));
  if (start < 0) throw Error('Tableau absent : ' + name);
  let depth = 0, quote = '', escaped = false;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quote) {if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === quote) quote = ''; continue;}
    if (char === '"' || char === "'") {quote = char; continue;}
    if (char === '[') depth++;
    if (char === ']' && --depth === 0) return [start, i + 1];
  }
  throw Error('Tableau incomplet : ' + name);
}
for (const [input, output, name] of [['textes-catalogue.js','textes-index.js','TEXTS'],['textes-hlp-tle.js','textes-hlp-index.js','NEW_TEXTS']]) {
  const source = fs.readFileSync(path.join(root, 'js', input), 'utf8');
  const [start, end] = arraySpan(source, name);
  const full = vm.runInNewContext('(' + source.slice(start, end) + ')', {}, {timeout: 5000});
  const light = full.map(record => Object.fromEntries(Object.entries(record).filter(([key]) => !drop.has(key))));
  fs.writeFileSync(path.join(root, 'js', output), source.slice(0, start) + JSON.stringify(light) + source.slice(end));
  console.log(`${input} : ${Buffer.byteLength(source)} → ${Buffer.byteLength(fs.readFileSync(path.join(root,'js',output)))} octets pour l’index.`);
}
function catalog(light) {
  const ctx = vm.createContext({window:{},document:{querySelector:()=>null},Intl,URLSearchParams});
  for (const name of light ? ['textes-hlp-index.js','textes-index.js'] : ['textes-hlp-tle.js','textes-catalogue.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',name),'utf8'),ctx);
  return JSON.parse(JSON.stringify(ctx.window.FV_TEXT_CATALOG));
}
const full = catalog(false), light = catalog(true);
if (full.length !== light.length) throw Error('Le nombre de textes a changé.');
for (const record of full) {
  const expected = Object.fromEntries(Object.entries(record).filter(([key]) => !drop.has(key)));
  const actual = Object.fromEntries(Object.entries(light.find(item=>item.id===record.id)).filter(([key])=>!drop.has(key)));
  assert.deepEqual(actual, expected, 'Métadonnées modifiées : '+record.id);
}
console.log(`${full.length} textes : métadonnées de navigation et de recherche identiques.`);

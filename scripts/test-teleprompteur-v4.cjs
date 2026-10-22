'use strict';
const assert = require('node:assert/strict');
const R = require('../apprendre/creation/teleprompteur/teleprompteur-takes.js');
const L = require('../apprendre/creation/teleprompteur/teleprompteur-library.js');
let count = 0;
function test(name,fn) { fn(); console.log('PASS ' + name); count++; }
const source = '  Aimer, est-ce s’unir ? Oui, peut-être…\n\n« Une autre question ! » Puis une réponse.\n\nConclusion sans point';
test('La segmentation française conserve les offsets exacts, guillemets et accents',() => {
  const phrases = R.sentences(source); assert.ok(phrases.length >= 5);
  for (const phrase of phrases) assert.equal(source.slice(phrase.start,phrase.end),phrase.text);
  assert.equal(phrases.at(-1).text,'Conclusion sans point');
});
test('Le début d’une phrase et la précédente sont retrouvés',() => {
  const text = 'Première phrase. Deuxième question ? Troisième phrase.';
  assert.equal(R.phraseAt(text,text.indexOf('question')).text,'Deuxième question ?');
  assert.equal(R.phraseAt(text,text.indexOf('question'),true).text,'Première phrase.');
  assert.equal(R.phraseAt(text,0,true).start,0);
});
test('La dernière phrase reste accessible à la fin du texte',() => assert.equal(R.phraseAt(source,source.length).text,'Conclusion sans point'));
test('Une sélection coupe les phrases à ses propres limites',() => {
  const text = 'Avant. Un passage à reprendre. Après.';
  const range = {start:text.indexOf('passage'),end:text.indexOf('Après.')};
  const phrases = R.sentences(text,range); assert.equal(phrases.length,1); assert.equal(phrases[0].text,'passage à reprendre.');
  assert.equal(R.phraseAt(text,0,true,range).start,range.start);
});
test('Le mode de secours fonctionne sans Intl.Segmenter',() => assert.deepEqual(R.sentences('Un ? Deux ! Trois…',null,null).map(x => x.text),['Un ?','Deux !','Trois…']));
test('Les décimales ne coupent pas une phrase dans le mode de secours',() => assert.equal(R.sentences('Il vaut 3.14 euros. Puis la suite.',null,null).length,2));
test('Les espaces et les sélections vides ne créent pas de boucle',() => {
  assert.equal(R.range({start:0,end:2},source),null);
  assert.equal(R.normalize({range:{start:12,end:3},loop:true},source).loop,false);
  assert.deepEqual(R.sentences(' \n\n '),[]);
});
test('Les repères suivent une insertion avant le passage et désactivent la boucle',() => {
  const before = 'Introduction.\n\nLe passage à filmer.', after = 'Une nouvelle introduction.\n\n' + before;
  const state = R.rebase({range:{start:before.indexOf('Le passage'),end:before.length},loop:true},before,after);
  assert.equal(after.slice(state.range.start,state.range.end),'Le passage à filmer.'); assert.equal(state.loop,false);
});
test('Une sélection supprimée est abandonnée sans perdre les prises',() => {
  const before = 'Avant.\n\nCible.\n\nAprès.', after = 'Avant.\n\nAprès.';
  const state = R.rebase({range:{start:8,end:14},takes:[{id:'take-a',number:1,excerpt:'Cible.',note:'À garder',status:'keep'}]},before,after);
  assert.equal(state.range,null); assert.equal(state.takes[0].excerpt,'Cible.'); assert.equal(state.takes[0].note,'À garder');
});
const take = {id:'take-1',number:7,createdAt:1000,updatedAt:2000,duration:12.4,status:'keep',excerpt:'Une phrase.',note:'Couper le silence.',start:0,end:11};
test('La numérotation continue après l’import du journal',() => assert.equal(R.normalize({nextNumber:2,takes:[take]},source).nextNumber,8));
test('Un journal excessif ou des identifiants dupliqués sont rejetés',() => {
  assert.throws(() => R.normalize({takes:Array.from({length:501},(_,i) => ({...take,id:'t'+i}))},source));
  assert.throws(() => R.normalize({takes:[take,take]},source));
});
test('La fusion conserve toutes les prises et les notes les plus récentes',() => {
  const a = R.normalize({takes:[take],range:{start:2,end:10},loop:true},source);
  const b = R.normalize({takes:[{...take,updatedAt:3000,note:'Nouvelle note.'},{...take,id:'take-2',number:8}]},source);
  const result = R.merge(a,b,source); assert.equal(result.takes.length,2); assert.equal(result.takes[0].note,'Nouvelle note.'); assert.equal(result.loop,true);
  assert.deepEqual(R.merge(result,b,source),result);
});
test('Une bibliothèque V3 reçoit un journal vide et garde sa position',() => {
  const [{document}] = L.decodeArchive({format:L.FORMAT,version:3,documents:[{text:source,reading:{offset:12,fraction:.5}}]});
  assert.equal(document.reading.offset,12); assert.deepEqual(document.production,{range:null,loop:false,nextNumber:1,takes:[]});
});
test('L’export V4 restitue sélection, boucle, état, note et durée',() => {
  const document = L.normalize({text:source,title:'Amour',production:{range:{start:2,end:37},loop:true,takes:[take]}});
  const exported = L.encodeArchive([document],[]); assert.equal(exported.version,4);
  const restored = L.decodeArchive(JSON.parse(JSON.stringify(exported)))[0].document;
  assert.deepEqual(restored.production,document.production);
});
test('La restauration d’un ancien texte conserve le journal comme souvenir de prise',() => {
  const state = R.rebase({takes:[take]},source,'Nouveau texte.'); assert.equal(state.takes[0].note,take.note); assert.equal(state.takes[0].excerpt,take.excerpt);
});
test('Le journal texte contient l’état, le passage et la note de montage',() => {
  const exported = R.journal('Philosophie de l’amour',R.normalize({takes:[take]},source));
  assert.match(exported,/PRISE 7 · À GARDER/); assert.match(exported,/12 s/); assert.match(exported,/Couper le silence/);
});
test('Les propriétés étrangères ne franchissent pas la normalisation V4',() => {
  const state = R.normalize({unknown:true,takes:[{...take,unknown:true}]},source);
  assert.equal(state.unknown,undefined); assert.equal(state.takes[0].unknown,undefined);
});
console.log(count + ' tests V4 réussis');

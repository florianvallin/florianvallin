const assert = require('node:assert/strict');
const {blocks,mapOffset,wordCount} = require('../apprendre/creation/teleprompteur/teleprompteur-core.js');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('Les repères conservent les offsets source, accents et lignes simples',()=>{
 const source='  Première ligne\nencore là.\n \n\n  Deuxième : aimer.  \n\nTroisième';
 const result=blocks(source);assert.equal(result.length,3);
 for(const p of result)assert.equal(source.slice(p.start,p.end),p.text);
 assert.equal(result[0].text,'Première ligne\nencore là.');
});
test('Un script vide ne crée aucun passage',()=>assert.deepEqual(blocks(' \n\n \n\t'),[]));
test('Insertion avant le passage : le même mot est retrouvé',()=>{
 const before='Pourquoi aimer ?\n\nAimer, c’est accueillir une différence.',after='INTRODUCTION\n\n'+before;
 const at=before.indexOf('accueillir');assert.equal(after.slice(mapOffset(before,after,at)),before.slice(at));
});
test('Suppression avant le passage : le mot garde son identité',()=>{
 const before='Une première question.\n\nUne réponse à explorer.',after='Une réponse à explorer.';
 const at=before.indexOf('réponse');assert.equal(after.slice(mapOffset(before,after,at)),before.slice(at));
});
test('Une correction après le passage ne le déplace pas',()=>{
 const before='Une idée, votre voix.\n\nUne fin.',after='Une idée, votre voix.\n\nUne nouvelle conclusion.';
 assert.equal(mapOffset(before,after,8),8);
});
test('Une suppression du passage choisit une position valide',()=>{
 const before='Introduction. Passage supprimé. Conclusion.',after='Introduction. Conclusion.';
 const result=mapOffset(before,after,24);assert.ok(result>=0&&result<=after.length);
});
test('Ajouter un paragraphe préserve la dernière lettre déjà lue',()=>{
 const before='Dernière phrase.',after=before+'\n\nLa suite.';assert.equal(mapOffset(before,after,before.length-1),before.length-1);
});
test('Le comptage traite les apostrophes et mots composés français',()=>assert.equal(wordCount('L’amour est-il une joie ? Oui, peut-être.'),6));
console.log(`${passed} tests réussis`);

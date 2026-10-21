'use strict';
const assert=require('node:assert/strict');
const L=require('../apprendre/creation/teleprompteur/teleprompteur-library.js');
let count=0;
function test(name,fn){fn();console.log('PASS '+name);count++;}
const a=L.normalize({text:'Amour et discorde.\n\nUne force qui rassemble.',title:'01 — Empédocle',collection:'Philosophie de l’amour'});
const b=L.normalize({text:'Un autre horizon.',title:'02 — Platon',collection:'Philosophie de l’amour'});
const archived=L.normalize({text:'Une ancienne piste.',title:'Archives',archived:true});
test('Recherche sans accent dans le titre',()=>assert.deepEqual(L.filterScripts([a,b],{query:'empedocle'}).map(x=>x.id),[a.id]));
test('Recherche dans le contenu et la série',()=>assert.deepEqual(L.filterScripts([a,b],{query:'amour rassemble'}).map(x=>x.id),[a.id]));
test('Un filtre de série et plusieurs mots se combinent',()=>assert.equal(L.filterScripts([a,b],{query:'autre',collection:'Philosophie de l’amour'}).length,1));
test('Les archives restent séparées et retrouvables',()=>{assert.equal(L.filterScripts([a,archived]).length,1);assert.equal(L.filterScripts([a,archived],{archived:true})[0].id,archived.id);});
test('Tri naturel des épisodes',()=>{const c=L.normalize({text:'',title:'10 — Suite'});assert.deepEqual(L.filterScripts([c,b,a],{sort:'title'}).map(x=>x.title),[a.title,b.title,c.title]);});
test('Sauvegarde export/import : texte, archives, repères et historique',()=>{
 const doc={...a,reading:{offset:10,fraction:.5},elapsed:12};
 const versions=[{id:'v1',scriptId:a.id,text:'Premier brouillon.',title:a.title,collection:a.collection,createdAt:Date.now(),label:'Version conservée'}];
 const result=L.decodeArchive(JSON.parse(JSON.stringify(L.encodeArchive([doc,archived],versions))));
 assert.equal(result[0].document.text,a.text);assert.equal(result[0].document.reading.offset,10);assert.equal(result[0].document.elapsed,12);
 assert.equal(result[0].versions[0].text,'Premier brouillon.');assert.equal(result[1].document.archived,true);
});
test('Aucun texte trop long n’est tronqué silencieusement',()=>assert.throws(()=>L.normalize({text:'a'.repeat(250001)})));
test('Un document invalide annule la validation de tout le lot',()=>assert.throws(()=>L.decodeArchive({format:L.FORMAT,version:3,documents:[a,{text:42}]})));
test('Un faux format JSON ne passe pas pour une bibliothèque',()=>assert.throws(()=>L.decodeArchive({format:'inconnu',version:3,documents:[a]})));
test('Un historique démesuré est rejeté',()=>assert.throws(()=>L.decodeArchive({format:L.FORMAT,version:3,documents:[{...a,versions:Array.from({length:31},()=>({text:'test'}))}]})));
test('Les métadonnées importées n’exécutent pas de code et restent du texte',()=>{const doc=L.normalize({text:'<script>alert(1)</script>',title:'<img src=x onerror=alert(1)>'});assert.equal(doc.text,'<script>alert(1)</script>');assert.equal(doc.title,'<img src=x onerror=alert(1)>');});
test('Les propriétés étrangères ne sont pas importées',()=>{const source=JSON.parse('{"text":"test","__proto__":{"polluted":true},"unknown":"ignore"}');const doc=L.normalize(source);assert.equal(doc.unknown,undefined);assert.equal({}.polluted,undefined);assert.ok(!Object.hasOwn(doc,'__proto__'));});
console.log(count+' tests V3 réussis');

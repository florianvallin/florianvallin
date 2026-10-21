const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),JSZip=require(path.join(root,'epub/vendor/jszip.min.js'));
const window={JSZip},document={currentScript:{src:'https://example.test/epub/local-formats.js'}};
vm.runInNewContext(fs.readFileSync(path.join(root,'epub/storage.js'),'utf8'),{window,Blob,File});
for(const ext of ['pdf','epub','fb2','mobi','azw3','djvu','cbz','cbr','rar','zip'])assert(window.PhilosophalBooks.isSupported({name:'Livre.'+ext.toUpperCase()}),ext);
assert.equal(window.PhilosophalBooks.formatOf({name:'Livre.DJV'}),'djvu');assert(!window.PhilosophalBooks.isSupported({name:'programme.exe'}));
vm.runInNewContext(fs.readFileSync(path.join(root,'epub/local-formats.js'),'utf8'),{window,document,URL,File,Blob,Uint8Array,console});
async function zipFile(name,files){const z=new JSZip();for(const [key,value]of Object.entries(files))z.file(key,value);return new File([await z.generateAsync({type:'uint8array'})],name);}
(async()=>{
 const prep=window.PhilosophalFormats.prepareImport;
 const plain=new File(['texte'],'essai.fb2');assert.equal(await prep(plain),plain);
 const single=await prep(await zipFile('un-livre.zip',{'dossier/livre.fb2':'un livre'}));assert.equal(single.name,'livre.fb2');assert.equal(await single.text(),'un livre');
 const images=await prep(await zipFile('images.zip',{'page-10.png':'image10','page-2.png':'image2'}));assert.equal(images.name,'images.cbz');const read=await JSZip.loadAsync(await images.arrayBuffer());assert.deepEqual(Object.keys(read.files),['page-2.png','page-10.png']);
 const renamed=await prep(new File([images],'deja-converti.cbr'));assert.equal(renamed.name,'deja-converti.cbz');
 const epub=await prep(await zipFile('export.zip',{'META-INF/container.xml':'container','mimetype':'application/epub+zip'}));assert.equal(epub.name,'export.epub');
 await assert.rejects(prep(new File(['pas une archive'],'invalide.zip')),/archive ZIP ou RAR/);
 await assert.rejects(prep(await zipFile('vide.zip',{'programme.exe':'non'})),/Aucun livre/);
 await assert.rejects(prep(await zipFile('traversee.zip',{'../livre.fb2':'non'})),/Aucun livre/);
 await assert.rejects(prep(await zipFile('profond.zip',{'livre.fb2':'oui'}),null,3),/niveaux/);
 const big={name:'volumineux.zip',size:513*1024*1024};await assert.rejects(prep(big),/512 Mo/);
 console.log('Formats demandés, archives, ordre des pages, fichiers invalides et limites : OK');
})().catch(error=>{console.error(error);process.exitCode=1});

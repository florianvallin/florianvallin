/* Formats supplémentaires : décompression et rendu locaux, sans transfert des livres. */
(() => {
  'use strict';
  const base=new URL('./',document.currentScript.src);
  const MAX_FILE=512*1024*1024, MAX_EXPANDED=800*1024*1024, MAX_ENTRIES=2000;
  const IMAGE=/\.(?:jpe?g|png|gif|webp|bmp|avif)$/i;
  const BOOK=/\.(?:epub|pdf|fb2|mobi|azw3?|djvu|djv|cbz|cbr|txt|md|html?|xhtml|docx|odt)$/i;
  const nameOf=name=>String(name||'').replace(/\\/g,'/');
  const safe=name=>{const p=nameOf(name);return p&&!p.startsWith('/')&&!/^[a-z]:/i.test(p)&&!p.split('/').some(x=>x==='..'||x==='__MACOSX'||x.startsWith('.'));};
  const ext=name=>String(name).split('.').pop().toLowerCase();
  let unrarPromise,wasmPromise,djvuPromise;
  async function rarEntries(file) {
    unrarPromise ||= import(new URL('vendor/unrar/index.esm.js',base).href);
    wasmPromise ||= fetch(new URL('vendor/unrar/js/unrar.wasm',base)).then(r=>{if(!r.ok)throw Error('Moteur RAR indisponible.');return r.arrayBuffer();});
    let extractor;
    try {
      const [{createExtractorFromData},wasmBinary]=await Promise.all([unrarPromise,wasmPromise]);
      extractor=await createExtractorFromData({data:await file.arrayBuffer(),wasmBinary});
      const headers=[...extractor.getFileList().fileHeaders];
      if(headers.length>MAX_ENTRIES)throw Error('L’archive contient trop de fichiers (2 000 maximum).');
      const candidates=headers.filter(h=>!h.flags?.directory&&safe(h.name)&&(IMAGE.test(h.name)||BOOK.test(h.name)));
      if(candidates.some(h=>h.flags?.encrypted))throw Error('Les archives protégées par un mot de passe ne sont pas prises en charge.');
      if(candidates.reduce((n,h)=>n+(h.unpSize||0),0)>MAX_EXPANDED)throw Error('Le contenu décompressé dépasse 800 Mo.');
      const headerByName=new Map(candidates.map(h=>[h.name,h]));
      // Le générateur doit être entièrement consommé pour libérer l’extracteur.
      const bytes=new Map();let total=0;
      for(const entry of extractor.extract({files:h=>headerByName.has(h.name)}).files){
        if(!entry.extraction)continue;total+=entry.extraction.byteLength;
        if(total>MAX_EXPANDED)throw Error('Le contenu décompressé dépasse 800 Mo.');
        bytes.set(entry.fileHeader.name,entry.extraction.slice());
      }
      return candidates.map(h=>({name:nameOf(h.name),size:h.unpSize||0,read:async()=>bytes.get(h.name)}));
    } catch(error) {
      if(/password|encrypted|ERAR_MISSING_PASSWORD|ERAR_BAD_PASSWORD/i.test(error.message||''))throw Error('Cette archive RAR est protégée par un mot de passe.');
      throw Error(error.message||'Archive RAR illisible. Les archives multi-volumes ne sont pas prises en charge.');
    }
  }
  async function zipEntries(file) {
    const zip=await window.JSZip.loadAsync(await file.arrayBuffer());
    const all=Object.values(zip.files);
    if(all.length>MAX_ENTRIES)throw Error('L’archive contient trop de fichiers (2 000 maximum).');
    if(all.reduce((n,e)=>n+(e._data?.uncompressedSize||0),0)>MAX_EXPANDED)throw Error('Le contenu décompressé dépasse 800 Mo.');
    return all.filter(e=>!e.dir&&safe(e.unsafeOriginalName||e.name)).map(e=>({name:e.name,size:e._data?.uncompressedSize||0,read:()=>e.async('uint8array')}));
  }
  function choose(entries,hasImages) {
    if(entries.length===1&&!hasImages)return Promise.resolve(entries[0]);
    if(!entries.length&&hasImages)return Promise.resolve('images');
    return new Promise(resolve=>{
      const dialog=document.createElement('dialog');dialog.className='reader-archive-dialog';
      const title=document.createElement('h2');title.textContent='Que souhaitez-vous lire ?';title.id='archive-choice-title';dialog.setAttribute('aria-labelledby',title.id);
      const note=document.createElement('p');note.textContent='Cette archive contient plusieurs éléments. Choisissez un livre ou les pages illustrées.';
      const list=document.createElement('div');list.className='reader-archive-choices';
      const finish=value=>{dialog.close();dialog.remove();resolve(value);};
      const button=(label,value)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>finish(value));list.append(b);};
      if(hasImages)button('Lire les images comme une BD','images');
      for(const entry of entries)button(entry.name,entry);
      const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Annuler';cancel.addEventListener('click',()=>finish(null));
      dialog.addEventListener('cancel',event=>{event.preventDefault();finish(null);});dialog.append(title,note,list,cancel);document.body.append(dialog);dialog.showModal();
    });
  }
  async function prepareImport(file,onProgress,depth=0) {
    if(depth>2)throw Error("Cette archive contient trop de niveaux imbriqués.");
    const extension=ext(file.name);
    if(!['zip','rar','cbr','cbz'].includes(extension))return file;
    if(file.size>MAX_FILE)throw Error('Choisissez une archive de moins de 512 Mo.');
    onProgress?.('Analyse de l’archive…');
    const signature=new Uint8Array(await file.slice(0,8).arrayBuffer());
    const rar=signature[0]===82&&signature[1]===97&&signature[2]===114&&signature[3]===33;
    const zip=signature[0]===80&&signature[1]===75;
    if(!zip&&!rar)throw Error('Ce fichier n’est pas une archive ZIP ou RAR valide.');
    const entries=await (rar?rarEntries(file):zipEntries(file));
    if(zip&&entries.some(e=>e.name==='META-INF/container.xml'))return new File([file],file.name.replace(/\.[^.]+$/i,'.epub'),{type:'application/epub+zip',lastModified:file.lastModified});
    if(zip&&['cbz','cbr'].includes(extension)&&entries.some(e=>IMAGE.test(e.name)))return new File([file],file.name.replace(/\.(?:cbr|cbz)$/i,'.cbz'),{type:'application/vnd.comicbook+zip',lastModified:file.lastModified});
    const books=entries.filter(e=>BOOK.test(e.name));
    const images=entries.filter(e=>IMAGE.test(e.name)).sort((a,b)=>a.name.localeCompare(b.name,'fr',{numeric:true}));
    if(!books.length&&!images.length)throw Error('Aucun livre ou aucune image compatible dans cette archive.');
    onProgress?.('');
    const selected=await choose(books,images.length>0);
    if(!selected)return null;
    if(selected!=='images') {
      const bytes=await selected.read();if(!bytes)throw Error('Le fichier choisi ne peut pas être extrait.');
      if(bytes.byteLength>MAX_FILE)throw Error('Le livre extrait dépasse 512 Mo.');
      const result=new File([bytes],selected.name.split('/').pop(),{lastModified:file.lastModified});
      return ['cbr','cbz'].includes(ext(result.name))?prepareImport(result,onProgress,depth+1):result;
    }
    onProgress?.(`Préparation de ${images.length} pages…`);
    const out=new window.JSZip();let total=0;
    for(const image of images){const bytes=await image.read();if(!bytes)continue;total+=bytes.byteLength;if(total>MAX_EXPANDED)throw Error('Le contenu décompressé dépasse 800 Mo.');out.file(image.name,bytes,{compression:'STORE'});}
    const blob=await out.generateAsync({type:'blob',compression:'STORE',mimeType:'application/vnd.comicbook+zip'});
    return new File([blob],file.name.replace(/\.[^.]+$/,'.cbz'),{type:'application/vnd.comicbook+zip',lastModified:file.lastModified});
  }
  async function ensureDjVu() {
    if(window.DjVu?.Worker)return window.DjVu;
    djvuPromise ||= new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('vendor/djvu/djvu.js',base).href;s.onload=()=>window.DjVu?.Worker?resolve(window.DjVu):reject(Error('Moteur DjVu indisponible.'));s.onerror=()=>{djvuPromise=null;reject(Error('Moteur DjVu non chargé.'));};document.head.append(s);});
    return djvuPromise;
  }
  async function makeDjvuBook(blob) {
    const DjVu=await ensureDjVu(),worker=new DjVu.Worker();
    let destroyed=false;const cache=new Map();
    const revoke=url=>URL.revokeObjectURL(url);
    const destroy=()=>{destroyed=true;for(const url of cache.values())revoke(url);cache.clear();worker.terminate();};
    try {
      await worker.createDocument(await blob.arrayBuffer());
      if(!await worker.doc.isBundled().run())throw Error('Ce DjVu est réparti sur plusieurs fichiers. Utilisez une version DjVu regroupée en un seul fichier.');
      const sizes=await worker.doc.getPagesSizes().run();
      if(!sizes.length)throw Error('Ce DjVu ne contient aucune page.');
      const sections=sizes.map((size,index)=>({id:index,href:`page-${index+1}`,philosophalSize:size,load:async()=>{
        if(destroyed)throw Error('Document fermé.');if(cache.has(index))return cache.get(index);
        const image=await worker.doc.getPage(index+1).createPngObjectUrl().run();
        if(destroyed){revoke(image.url);throw Error('Document fermé.');}
        cache.set(index,image.url);if(cache.size>5){const [key,url]=cache.entries().next().value;cache.delete(key);revoke(url);}return image.url;
      },unload(){}}));
      return {metadata:{},sections,rendition:{layout:'pre-paginated',spread:'auto'},toc:sizes.map((_,i)=>({label:`Page ${i+1}`,href:`page-${i+1}`})),resolveHref:href=>({index:Math.max(0,Math.min(sizes.length-1,Number(String(href).replace(/\D/g,''))-1||0))}),getTextPage:index=>worker.doc.getPage(index+1).getText().run(),destroy};
    }catch(error){destroy();throw error;}
  }
  window.PhilosophalFormats=Object.freeze({...window.PhilosophalFormats,prepareImport,makeDjvuBook});
})();

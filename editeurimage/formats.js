/* Formats communs à la création de toile et au cadrage. */
(() => {
  'use strict';
  const presets = [
    ['icon16','Favicon 16','icons',16,16,'image/png'],
    ['icon32','Icône 32','icons',32,32,'image/png'],
    ['icon48','Icône 48','icons',48,48,'image/png'],
    ['icon64','Icône 64','icons',64,64,'image/png'],
    ['icon96','Icône 96','icons',96,96,'image/png'],
    ['avatar128','Avatar 128','icons',128,128,'image/png'],
    ['avatar256','Avatar 256','icons',256,256,'image/png'],
    ['avatar512','Avatar 512','icons',512,512,'image/png'],
    ['avatar1024','Avatar 1024','icons',1024,1024,'image/png'],
    ['square','Carré · 1:1','social',1080,1080,'image/jpeg'],
    ['portrait','Portrait · 4:5','social',1080,1350,'image/jpeg'],
    ['vertical','Story / vidéo · 9:16','social',1080,1920,'image/jpeg'],
    ['link','Aperçu de lien','social',1200,630,'image/jpeg'],
    ['banner','Bannière · 3:1','social',1500,500,'image/jpeg'],
    ['thumb','Miniature · 16:9','screen',1280,720,'image/jpeg'],
    ['fullhd','Full HD · 16:9','screen',1920,1080,'image/jpeg'],
    ['uhd','4K UHD · 16:9','screen',3840,2160,'image/jpeg'],
    ['photo','Photo paysage · 3:2','screen',1800,1200,'image/jpeg'],
    ['photo43','Photo · 4:3','screen',1600,1200,'image/jpeg'],
    ['panorama','Panorama · 2:1','screen',2400,1200,'image/jpeg'],
    ['a4','A4 portrait · 300 ppp','paper',2480,3508,'image/png'],
    ['a4landscape','A4 paysage · 300 ppp','paper',3508,2480,'image/png'],
    ['a5','A5 portrait · 300 ppp','paper',1748,2480,'image/png'],
    ['a3','A3 portrait · 300 ppp','paper',3508,4961,'image/png']
  ].map(([id,label,group,width,height,mime])=>({id,label,group,width,height,mime}));
  const groups=[['all','Tous'],['icons','Icônes'],['social','Publication'],['screen','Écran / photo'],['paper','Papier']];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  document.querySelectorAll('[data-format-catalogue]').forEach((container,index)=>{
    const kind=container.dataset.formatCatalogue;
    let group='all',query='';
    const title=document.createElement('p');title.className='image-format-kicker';title.textContent=presets.length+' formats prêts à utiliser';
    const label=document.createElement('label');label.className='image-format-search';label.textContent='Rechercher un format';
    const input=document.createElement('input');input.type='search';input.id='image-format-search-'+index;input.placeholder='96, carré, A4, portrait…';input.autocomplete='off';label.append(input);
    const filters=document.createElement('div');filters.className='image-format-filters';filters.setAttribute('aria-label','Catégories de formats');
    const list=document.createElement('div');list.className='image-format-catalogue-grid';
    const status=document.createElement('p');status.className='image-format-status';status.setAttribute('role','status');
    const swap=document.createElement('button');swap.type='button';swap.className='image-format-swap';swap.textContent='Inverser largeur / hauteur';
    swap.addEventListener('click',()=>{
      const dialog=container.closest('dialog'),width=dialog.querySelector(kind==='new'?'[data-new-width]':'[data-format-width]'),height=dialog.querySelector(kind==='new'?'[data-new-height]':'[data-format-height]');
      [width.value,height.value]=[height.value,width.value];width.dispatchEvent(new Event('input',{bubbles:true}));sync();
    });
    function draw(){
      list.replaceChildren();
      const terms=normalize(query).trim().split(/\s+/).filter(Boolean),pair=normalize(query).match(/^(\d+)\s*[x×]\s*(\d+)$/);
      const visible=presets.filter(p=>(group==='all'||p.group===group)&&(pair?p.width===Number(pair[1])&&p.height===Number(pair[2]):terms.every(term=>/^\d+$/.test(term)?p.width===Number(term)||p.height===Number(term):normalize(p.label+' '+p.width+'x'+p.height).includes(term))));
      visible.forEach(p=>{
        const button=document.createElement('button');button.type='button';button.className='image-format-choice';button.dataset[kind==='new'?'newPreset':'formatPreset']=p.width+'x'+p.height;button.dataset.presetMime=p.mime;button.dataset.presetId=p.id;
        const name=document.createElement('strong');name.textContent=p.label;const dimensions=document.createElement('small');dimensions.textContent=p.width+' × '+p.height+' px · '+(p.mime==='image/png'?'PNG':'JPG');button.append(name,dimensions);list.append(button);
      });
      if(!visible.length){const empty=document.createElement('p');empty.textContent='Aucun format trouvé. Vous pouvez saisir une taille personnalisée.';list.append(empty);}
      status.textContent=visible.length+' format'+(visible.length>1?'s':'')+' disponible'+(visible.length>1?'s':'');
      filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.formatGroup===group)));
      sync();
    }
    function sync(){
      const dialog=container.closest('dialog'),width=dialog.querySelector(kind==='new'?'[data-new-width]':'[data-format-width]')?.value,height=dialog.querySelector(kind==='new'?'[data-new-height]':'[data-format-height]')?.value;
      list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[kind==='new'?'newPreset':'formatPreset']===width+'x'+height)));
    }
    groups.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.formatGroup=id;b.addEventListener('click',()=>{group=id;draw();});filters.append(b);});
    input.addEventListener('input',()=>{query=input.value;draw();});
    container.addEventListener('click',event=>{if(event.target.closest('[data-preset-id]'))requestAnimationFrame(sync);});
    container.closest('dialog').addEventListener('input',sync);
    container.append(title,label,filters,list,status,swap);draw();
  });
})();

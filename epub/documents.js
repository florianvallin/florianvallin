/* Lecture locale de documents DOCX / ODT. Le fichier d'origine reste intact. */
(() => {
  'use strict';
  const NS={word:'http://schemas.openxmlformats.org/wordprocessingml/2006/main',rel:'http://schemas.openxmlformats.org/officeDocument/2006/relationships',text:'urn:oasis:names:tc:opendocument:xmlns:text:1.0',style:'urn:oasis:names:tc:opendocument:xmlns:style:1.0',fo:'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0',xlink:'http://www.w3.org/1999/xlink'};
  const children=node=>[...(node?.children||[])];
  const direct=(node,name)=>children(node).find(n=>n.localName===name);
  const descendants=(node,name)=>[...(node?.getElementsByTagNameNS('*',name)||[])];
  const attr=(node,name,ns=NS.word)=>node?.getAttributeNS(ns,name)||node?.getAttribute(name)||[...(node?.attributes||[])].find(a=>a.localName===name)?.value||'';
  const xml=source=>{if(/<!DOCTYPE|<!ENTITY/i.test(source))throw new Error('Le document contient une structure XML non prise en charge.');const doc=new DOMParser().parseFromString(source,'application/xml');if(doc.querySelector('parsererror'))throw new Error('Le document contient un fichier XML invalide.');return doc;};
  const enabled=node=>!!node&&!['0','false','off'].includes(attr(node,'val').toLowerCase());
  const linkURL=value=>{if(/^#[a-z0-9_.:-]+$/i.test(value))return value;try{const url=new URL(value);return /^(https?:|mailto:)$/.test(url.protocol)?url.href:'';}catch{return '';}};
  function headingLevel(value){if(/^(title|titre)$/i.test(String(value||'')))return 1;const found=String(value||'').match(/(?:heading|titre|überschrift)\s*([1-6])/i);return found?Number(found[1]):0;}
  async function loadArchive(blob){
    if(!window.JSZip)throw new Error('Le module de lecture des documents est indisponible.');
    if(blob.size>40*1024*1024)throw new Error('Choisissez un document de moins de 40 Mo.');
    let zip;try{zip=await JSZip.loadAsync(await blob.arrayBuffer());}catch{throw new Error('Ce document est illisible ou ne contient pas un fichier DOCX / ODT valide.');}
    const total=Object.values(zip.files).reduce((sum,entry)=>sum+(entry._data?.uncompressedSize||0),0);
    if(total>100*1024*1024)throw new Error('Le contenu décompressé du document dépasse 100 Mo.');
    return zip;
  }
  async function xmlFile(zip,path,required=false){const entry=zip.file(path);if(!entry){if(required)throw new Error('Ce fichier ne contient pas un document exploitable.');return null;}if((entry._data?.uncompressedSize||0)>12*1024*1024)throw new Error('Le texte du document est trop volumineux.');return xml(await entry.async('string'));}
  function cleanPath(path){if(!path||/^[a-z]+:|^\/|\\/i.test(path))return '';const parts=[];for(const part of path.split('/')){if(part==='..'){if(!parts.length)return '';parts.pop();}else if(part&&part!=='.')parts.push(part);}return parts.join('/');}
  async function imageURL(zip,path,cache){const clean=cleanPath(path);if(!clean)return '';if(cache.has(clean))return cache.get(clean);const ext=clean.split('.').pop().toLowerCase(),mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',bmp:'image/bmp'}[ext],entry=zip.file(clean);if(!mime||!entry||(entry._data?.uncompressedSize||0)>10*1024*1024)return '';const data='data:'+mime+';base64,'+await entry.async('base64');cache.set(clean,data);return data;}
  function createOutput(){const doc=document.implementation.createHTMLDocument(''),article=doc.createElement('article');article.className='reader-document-content';doc.body.append(article);return {doc,article};}
  function decorate(doc,nodes,properties){let wrapper=doc.createElement('span');wrapper.append(...nodes);for(const [active,tag] of [[properties.bold,'strong'],[properties.italic,'em'],[properties.underline,'u'],[properties.strike,'s']])if(active){const outer=doc.createElement(tag);outer.append(wrapper);wrapper=outer;}return wrapper;}

  async function readDocx(blob){
    const zip=await loadArchive(blob),source=await xmlFile(zip,'word/document.xml',true),styles=await xmlFile(zip,'word/styles.xml'),rels=await xmlFile(zip,'word/_rels/document.xml.rels'),numbering=await xmlFile(zip,'word/numbering.xml'),metadata=await xmlFile(zip,'docProps/core.xml'),notes=await xmlFile(zip,'word/footnotes.xml');
    const {doc,article}=createOutput(),imageCache=new Map(),styleMap=new Map(),relationMap=new Map(),abstractLists=new Map(),numberMap=new Map();
    descendants(styles,'style').forEach(style=>{const id=attr(style,'styleId'),name=attr(direct(style,'name'),'val'),props=direct(style,'pPr'),outline=direct(props,'outlineLvl');styleMap.set(id,{level:headingLevel(name)||headingLevel(id)||(outline?Math.min(6,Number(attr(outline,'val'))+1):0),parent:attr(direct(style,'basedOn'),'val'),run:direct(style,'rPr'),numbering:direct(props,'numPr')});});
    descendants(rels,'Relationship').forEach(rel=>relationMap.set(rel.getAttribute('Id'),{target:rel.getAttribute('Target')||'',external:rel.getAttribute('TargetMode')==='External'}));
    descendants(numbering,'abstractNum').forEach(abstract=>{const levels=new Map();children(abstract).filter(n=>n.localName==='lvl').forEach(level=>levels.set(Number(attr(level,'ilvl')),attr(direct(level,'numFmt'),'val')!=='bullet'));abstractLists.set(attr(abstract,'abstractNumId'),levels);});
    descendants(numbering,'num').forEach(num=>numberMap.set(attr(num,'numId'),attr(direct(num,'abstractNumId'),'val')));
    function styleLevel(id,visited=new Set()){if(!id||visited.has(id))return 0;visited.add(id);const style=styleMap.get(id);return style?.level||headingLevel(id)||styleLevel(style?.parent,visited);}
    function styleNumbering(id,visited=new Set()){if(!id||visited.has(id))return null;visited.add(id);const style=styleMap.get(id);return style?.numbering||styleNumbering(style?.parent,visited);}
    function propertiesFromRun(props){const out={};for(const [name,key] of [['b','bold'],['i','italic'],['strike','strike']]){const value=direct(props,name);if(value)out[key]=enabled(value);}const underline=direct(props,'u');if(underline)out.underline=attr(underline,'val')!=='none';return out;}
    function styleRun(id,visited=new Set()){if(!id||visited.has(id))return {};visited.add(id);const style=styleMap.get(id);return {...styleRun(style?.parent,visited),...propertiesFromRun(style?.run)};}
    function runProperties(run){let paragraph=run.parentElement;while(paragraph&&paragraph.localName!=='p')paragraph=paragraph.parentElement;const paragraphStyle=attr(direct(direct(paragraph,'pPr'),'pStyle'),'val'),props=direct(run,'rPr'),characterStyle=attr(direct(props,'rStyle'),'val');return {...styleRun(paragraphStyle),...styleRun(characterStyle),...propertiesFromRun(props)};}
    async function inline(node){
      if(node.nodeType===Node.TEXT_NODE)return node.textContent.trim()?doc.createTextNode(node.textContent):null;
      if(node.nodeType!==Node.ELEMENT_NODE)return null;
      const tag=node.localName;
      if(['pPr','rPr','sectPr','proofErr','bookmarkEnd','commentRangeStart','commentRangeEnd','instrText','del'].includes(tag))return null;
      if(tag==='t')return doc.createTextNode(node.textContent);
      if(tag==='tab')return doc.createTextNode('    ');
      if(tag==='br'||tag==='cr')return doc.createElement('br');
      if(tag==='bookmarkStart'){const span=doc.createElement('span');span.id=attr(node,'name');return span;}
      if(tag==='footnoteReference'){const sup=doc.createElement('sup');sup.textContent='['+attr(node,'id')+']';return sup;}
      if(tag==='drawing'||tag==='pict'){
        const frag=doc.createDocumentFragment();for(const blip of descendants(node,'blip')){const relation=relationMap.get(attr(blip,'embed',NS.rel));if(!relation||relation.external)continue;const url=await imageURL(zip,'word/'+relation.target,imageCache);if(url){const img=doc.createElement('img');img.src=url;const info=descendants(node,'docPr')[0];img.alt=info?.getAttribute('descr')||info?.getAttribute('title')||'Illustration du document';img.loading='lazy';frag.append(img);}}return frag;
      }
      const nodes=[];for(const child of node.childNodes){const converted=await inline(child);if(converted)nodes.push(converted);}
      if(tag==='r')return decorate(doc,nodes,runProperties(node));
      if(tag==='hyperlink'){const relation=relationMap.get(attr(node,'id',NS.rel)),anchor=attr(node,'anchor'),url=linkURL(relation?.external?relation.target:anchor?'#'+anchor:'');if(url){const a=doc.createElement('a');a.href=url;if(!url.startsWith('#')){a.target='_blank';a.rel='noopener noreferrer';}a.append(...nodes);return a;}}
      const frag=doc.createDocumentFragment();frag.append(...nodes);return frag;
    }
    async function paragraph(node){const props=direct(node,'pPr'),outline=direct(props,'outlineLvl'),style=attr(direct(props,'pStyle'),'val'),level=outline?Math.min(6,Math.max(1,Number(attr(outline,'val'))+1)):styleLevel(style),element=doc.createElement(level?'h'+level:'p');for(const child of node.childNodes){const value=await inline(child);if(value)element.append(value);}if(!element.textContent.trim()&&!element.querySelector('img,br'))element.append(doc.createElement('br'));const num=direct(props,'numPr')||styleNumbering(style),id=attr(direct(num,'numId'),'val');return {element,list:id&&id!=='0'?{id,level:Math.min(8,Number(attr(direct(num,'ilvl'),'val'))||0),ordered:abstractLists.get(numberMap.get(id))?.get(Number(attr(direct(num,'ilvl'),'val'))||0)!==false}:null};}
    async function blocks(sourceNode,target){
      const stack=[];function reset(){stack.length=0;}
      for(const child of children(sourceNode)){
        if(child.localName==='p'){
          const item=await paragraph(child);
          if(!item.list){reset();target.append(item.element);continue;}
          const {id,ordered}=item.list,level=Math.min(item.list.level,stack.length);
          while(stack.length>level+1)stack.pop();
          if(stack[level]&&(stack[level].id!==id||stack[level].ordered!==ordered)){stack.length=level;}
          if(!stack[level]){const list=doc.createElement(ordered?'ol':'ul');if(level===0)target.append(list);else{const parent=stack[level-1];if(!parent.last){parent.last=doc.createElement('li');parent.node.append(parent.last);}parent.last.append(list);}stack[level]={node:list,id,ordered,last:null};}
          const li=doc.createElement('li');li.append(...item.element.childNodes);stack[level].node.append(li);stack[level].last=li;
        }else if(child.localName==='tbl'){
          reset();const table=doc.createElement('table'),body=doc.createElement('tbody');table.append(body);
          for(const row of children(child).filter(n=>n.localName==='tr')){const tr=doc.createElement('tr');for(const cell of children(row).filter(n=>n.localName==='tc')){const td=doc.createElement('td'),span=Number(attr(direct(direct(cell,'tcPr'),'gridSpan'),'val'));if(span>1&&span<100)td.colSpan=span;await blocks(cell,td);tr.append(td);}body.append(tr);}target.append(table);
        }else if(['sdt','sdtContent','customXml'].includes(child.localName)){reset();await blocks(direct(child,'sdtContent')||child,target);}
      }
    }
    const body=descendants(source,'body')[0];if(!body)throw new Error('Le document Word ne contient pas de texte lisible.');await blocks(body,article);
    const footnotes=descendants(notes,'footnote').filter(n=>Number(attr(n,'id'))>0);if(footnotes.length){const section=doc.createElement('section'),heading=doc.createElement('h2');heading.textContent='Notes';section.append(heading);for(const note of footnotes){const div=doc.createElement('div'),number=doc.createElement('strong');number.textContent=attr(note,'id')+'. ';div.append(number);await blocks(note,div);section.append(div);}article.append(section);}
    return {html:article.outerHTML,title:descendants(metadata,'title')[0]?.textContent.trim()||'',author:descendants(metadata,'creator')[0]?.textContent.trim()||''};
  }

  async function readOdt(blob){
    const zip=await loadArchive(blob),source=await xmlFile(zip,'content.xml',true),styles=await xmlFile(zip,'styles.xml'),metadata=await xmlFile(zip,'meta.xml'),{doc,article}=createOutput(),imageCache=new Map(),styleMap=new Map(),listStyles=new Map();
    for(const sheet of [styles,source]){
      descendants(sheet,'style').forEach(style=>{const props=direct(style,'text-properties');styleMap.set(attr(style,'name',NS.style),{bold:attr(props,'font-weight',NS.fo)?attr(props,'font-weight',NS.fo)==='bold'||Number(attr(props,'font-weight',NS.fo))>=600:undefined,italic:attr(props,'font-style',NS.fo)?attr(props,'font-style',NS.fo)!=='normal':undefined,underline:attr(props,'text-underline-style',NS.style)?attr(props,'text-underline-style',NS.style)!=='none':undefined,strike:attr(props,'text-line-through-style',NS.style)?attr(props,'text-line-through-style',NS.style)!=='none':undefined,parent:attr(style,'parent-style-name',NS.style)});});
      descendants(sheet,'list-style').forEach(style=>listStyles.set(attr(style,'name',NS.style),children(style).some(n=>n.localName==='list-level-style-number')));
    }
    function properties(name,visited=new Set()){if(!name||visited.has(name))return {};visited.add(name);const current=styleMap.get(name)||{};return {...properties(current.parent,visited),...Object.fromEntries(Object.entries(current).filter(([key,value])=>key!=='parent'&&value!==undefined))};}
    async function convert(node){
      if(node.nodeType===Node.TEXT_NODE)return doc.createTextNode(node.textContent);
      if(node.nodeType!==Node.ELEMENT_NODE)return null;
      const tag=node.localName;
      if(['annotation','tracked-changes','sequence-decls','variable-decls','user-field-decls','forms','scripts'].includes(tag))return null;
      if(tag==='s')return doc.createTextNode(' '.repeat(Math.min(100,Number(attr(node,'c',NS.text))||1)));
      if(tag==='tab')return doc.createTextNode('    ');
      if(tag==='line-break')return doc.createElement('br');
      if(tag==='image'){
        const url=await imageURL(zip,attr(node,'href',NS.xlink),imageCache);if(!url)return null;const img=doc.createElement('img');img.src=url;img.alt='Illustration du document';img.loading='lazy';return img;
      }
      if(tag==='note'){const aside=doc.createElement('aside');aside.className='reader-document-note';const citation=direct(node,'note-citation'),label=doc.createElement('strong');label.textContent='Note '+(citation?.textContent||'')+' : ';aside.append(label);const body=direct(node,'note-body');for(const child of body?.childNodes||[]){const value=await convert(child);if(value)aside.append(value);}return aside;}
      const nodes=[];for(const child of node.childNodes){const value=await convert(child);if(value)nodes.push(value);}
      const mapped={p:'p',h:'h'+Math.min(6,Math.max(1,Number(attr(node,'outline-level',NS.text))||1)),list:listStyles.get(attr(node,'style-name',NS.text))?'ol':'ul','list-item':'li',table:'table','table-row':'tr','table-cell':'td','table-header-rows':'thead',section:'section',frame:'figure'}[tag];
      if(mapped){const el=doc.createElement(mapped);if(tag==='table-cell'){const span=Number(node.getAttributeNS('urn:oasis:names:tc:opendocument:xmlns:table:1.0','number-columns-spanned'));if(span>1&&span<100)el.colSpan=span;}el.append(...nodes);return ['p','h'].includes(tag)?decorateBlock(el,attr(node,'style-name',NS.text)):el;}
      if(tag==='span')return decorate(doc,nodes,properties(attr(node,'style-name',NS.text)));
      if(tag==='a'){const url=linkURL(attr(node,'href',NS.xlink));if(url){const a=doc.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.append(...nodes);return a;}}
      const fragment=doc.createDocumentFragment();fragment.append(...nodes);return fragment;
    }
    function decorateBlock(element,name){const props=properties(name);if(Object.values(props).some(Boolean)){const wrapper=decorate(doc,[...element.childNodes],props);element.replaceChildren(wrapper);}return element;}
    const body=descendants(source,'text')[0];if(!body)throw new Error('Ce fichier ne contient pas un document OpenDocument texte.');for(const node of body.childNodes){const value=await convert(node);if(value)article.append(value);}
    return {html:article.outerHTML,title:descendants(metadata,'title')[0]?.textContent.trim()||'',author:descendants(metadata,'initial-creator')[0]?.textContent.trim()||descendants(metadata,'creator')[0]?.textContent.trim()||''};
  }
  window.PhilosophalDocuments={read:(blob,format)=>format==='docx'?readDocx(blob):format==='odt'?readOdt(blob):Promise.reject(new Error('Format de document non pris en charge.'))};
})();

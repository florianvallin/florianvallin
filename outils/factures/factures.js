(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const api = window.FV_PRIVATE_ACCESS;
  // V48 · Coffre local optionnel. La phrase secrète ne quitte pas l'ordinateur.
  // AES-256-GCM + PBKDF2-SHA256 : les clés ne sont conservées qu'en mémoire.
  const VAULT_KEY='philosophal-invoices-local-vault-v48';
  const VAULT_FORMAT='philosophal-invoices-local-vault-v48';
  const VAULT_KEYS=[
    'philosophal-invoice-preset-v1','philosophal-invoice-last-v42',
    'philosophal-invoice-clients-v43','philosophal-invoice-templates-v43',
    'philosophal-invoice-history-v43','philosophal-invoice-numbering-v43',
    'philosophal-invoice-working-draft-v44','philosophal-invoice-time-v46',
    'philosophal-invoice-credits-v47',
    'philosophal-invoice-rules-v50','philosophal-invoice-month-close-v50'
  ];
  const vaultEncoder=new TextEncoder(),vaultDecoder=new TextDecoder();
  const b64=bytes=>{let result='';for(let i=0;i<bytes.length;i+=8192)result+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(result)};
  const unb64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
  let vaultCache=null,vaultKey=null,vaultSalt=null,vaultWrites=Promise.resolve(),vaultGeneration=0,vaultDirty=false,vaultBusy=false,vaultWriteSequence=0;
  let vaultCommittedValue=null,officeConflict=false;
  const vaultIsEnabled=()=>localStorage.getItem(VAULT_KEY)!==null;
  function showOfficeConflict(){
    if(officeConflict)return;
    officeConflict=true;
    document.body.classList.add('office-has-conflict');
    const warning=$('multiTabWarning');if(warning){warning.hidden=false;warning.scrollIntoView({block:'start',behavior:'instant'});}
    const status=$('officeSaveIndicator');if(status){status.textContent='Autre onglet détecté · édition suspendue';status.classList.add('is-failed');}
  }
  function initOfficeConflictCheck(){
    window.addEventListener('storage',event=>{
      if(event.storageArea!==localStorage)return;
      if(event.key===VAULT_KEY||event.key===null||(!vaultIsEnabled()&&VAULT_KEYS.includes(event.key)))showOfficeConflict();
    });
    $('reloadAfterConflict').addEventListener('click',()=>location.reload());
  }
  function officeSaveStatus(message,bad=false){
    const node=$('officeSaveIndicator');if(!node||officeConflict)return;
    node.textContent=message;node.classList.toggle('is-failed',bad);
  }

  function vaultIndicator(text,error=false){
    const el=document.getElementById('vaultStatus'),ind=document.getElementById('vaultBadge');
    if(el){el.textContent=text;el.classList.toggle('is-warning',error)}
    if(ind){ind.textContent=vaultCache?'Coffre chiffré actif':vaultIsEnabled()?'Coffre verrouillé':'Stockage local non chiffré';ind.classList.toggle('is-locked',!vaultCache)}
  }
  function vaultRead(key){return vaultCache ? (Object.prototype.hasOwnProperty.call(vaultCache,key)?vaultCache[key]:null) : localStorage.getItem(key)}
  function vaultSet(key,value){
    if(officeConflict)throw Error('Données modifiées dans un autre onglet.');
    if(!vaultCache)return localStorage.setItem(key,value);
    vaultCache[key]=String(value);vaultEnqueue();
  }
  function vaultRemove(key){
    if(officeConflict)throw Error('Données modifiées dans un autre onglet.');
    if(!vaultCache)return localStorage.removeItem(key);
    delete vaultCache[key];vaultEnqueue();
  }
  const secureStore={getItem:vaultRead,setItem:vaultSet,removeItem:vaultRemove};
  async function vaultDerive(password,salt){
    const material=await crypto.subtle.importKey('raw',vaultEncoder.encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  async function vaultSeal(cache,key,salt){
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const data=vaultEncoder.encode(JSON.stringify(cache));
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:vaultEncoder.encode(VAULT_FORMAT)},key,data);
    return JSON.stringify({format:VAULT_FORMAT,algorithm:'AES-256-GCM',kdf:'PBKDF2-SHA256',iterations:310000,salt:b64(salt),iv:b64(iv),data:b64(new Uint8Array(encrypted))});
  }
  async function vaultOpen(password){
    if(!crypto?.subtle)throw Error('Le coffre nécessite une connexion HTTPS ou localhost.');
    let wrapper;try{wrapper=JSON.parse(localStorage.getItem(VAULT_KEY)||'null')}catch{throw Error('Coffre local illisible. Restaurer une sauvegarde indépendante sur un autre appareil peut être nécessaire.')}
    if(!wrapper||wrapper.format!==VAULT_FORMAT||wrapper.iterations!==310000||typeof wrapper.data!=='string')throw Error('Coffre absent ou de format inconnu.');
    let key,cache;
    try{
      const salt=unb64(wrapper.salt);if(salt.length!==16||unb64(wrapper.iv).length!==12)throw Error('Format non valide');
      key=await vaultDerive(password,salt);
      const decoded=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(wrapper.iv),additionalData:vaultEncoder.encode(VAULT_FORMAT)},key,unb64(wrapper.data));
      cache=JSON.parse(vaultDecoder.decode(decoded));
      if(!cache||typeof cache!=='object'||Array.isArray(cache)||Object.keys(cache).some(k=>!VAULT_KEYS.includes(k)||typeof cache[k]!=='string'))throw Error('Contenu non valide');
      vaultSalt=salt;
    }catch{throw Error('Phrase secrète incorrecte ou coffre endommagé.')} 
    vaultCommittedValue=localStorage.getItem(VAULT_KEY);
    vaultKey=key;vaultCache=cache;vaultGeneration++;vaultDirty=false;vaultWriteSequence=0;vaultIndicator('Coffre local déverrouillé · données chiffrées sur cet appareil.');
  }
  function vaultEnqueue(){
    if(!vaultCache||!vaultKey)return;
    if(officeConflict)throw Error('Un autre onglet a modifié les données : recharge avant de continuer.');
    vaultDirty=true;const generation=vaultGeneration,serial=++vaultWriteSequence;
    vaultIndicator('Chiffrement et enregistrement des modifications en cours…');
    vaultWrites=vaultWrites.catch(()=>{}).then(async()=>{
      if(generation!==vaultGeneration||!vaultCache)return;
      vaultBusy=true;
      try{
        const content=JSON.stringify(vaultCache), sealed=await vaultSeal(JSON.parse(content),vaultKey,vaultSalt);
        if(generation!==vaultGeneration||!vaultCache)return;
        if(officeConflict||localStorage.getItem(VAULT_KEY)!==vaultCommittedValue){showOfficeConflict();throw Error("Coffre modifié dans un autre onglet.");}
        localStorage.setItem(VAULT_KEY,sealed);vaultCommittedValue=sealed;
        vaultDirty=serial!==vaultWriteSequence;if(!vaultDirty){vaultIndicator('Coffre chiffré enregistré · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}));officeSaveStatus('Coffre enregistré · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}));}
      }catch(error){vaultDirty=true;vaultIndicator('ERREUR : coffre non sauvegardé. Exporte tes données avant de fermer cette page.',true);console.error('Coffre : sauvegarde impossible',error);throw error}
      finally{vaultBusy=false}
    });
  }
  async function vaultFlush(){await vaultWrites; if(vaultDirty)throw Error('Le coffre n’a pas pu être enregistré.');}
  async function vaultEnable(password){
    if(vaultIsEnabled())throw Error('Un coffre existe déjà.');
    if(!crypto?.subtle)throw Error('HTTPS requis pour activer le coffre.');
    if(password.length<12)throw Error('Utilise une phrase secrète d’au moins 12 caractères.');
    const cache={};for(const key of VAULT_KEYS){const value=localStorage.getItem(key);if(value!==null)cache[key]=value}
    const salt=crypto.getRandomValues(new Uint8Array(16));const key=await vaultDerive(password,salt);
    // On vérifie d'abord l'écriture chiffrée avant d'effacer les valeurs non chiffrées.
    vaultCommittedValue=await vaultSeal(cache,key,salt);localStorage.setItem(VAULT_KEY,vaultCommittedValue);
    vaultCache=cache;vaultKey=key;vaultSalt=salt;vaultGeneration++;vaultDirty=false;vaultWriteSequence=0;
    for(const name of VAULT_KEYS)localStorage.removeItem(name);
    vaultIndicator('Coffre activé. Conserve ta phrase secrète et une sauvegarde externe : sans elle, les données seront irrécupérables.');
  }
  async function vaultRotate(password){
    if(!vaultCache)throw Error('Déverrouille le coffre d’abord.');
    if(password.length<12)throw Error('La phrase secrète doit contenir au moins 12 caractères.');
    await vaultFlush();
    const salt=crypto.getRandomValues(new Uint8Array(16)),key=await vaultDerive(password,salt);
    if(officeConflict||localStorage.getItem(VAULT_KEY)!==vaultCommittedValue){showOfficeConflict();throw Error("Coffre modifié dans un autre onglet.");}
    vaultCommittedValue=await vaultSeal(vaultCache,key,salt);localStorage.setItem(VAULT_KEY,vaultCommittedValue);
    vaultSalt=salt;vaultKey=key;vaultIndicator('Nouvelle phrase secrète enregistrée avec succès.');
  }
  async function vaultLock(){
    try{await vaultFlush()}catch(error){alert(error.message+' Reste sur la page pour sauvegarder tes données.');return}
    vaultGeneration++;vaultCache=null;vaultKey=null;vaultSalt=null;location.reload();
  }
  function refreshVaultUI(){
    const active=vaultIsEnabled(),status=document.getElementById('vaultSetup');
    if(status){status.textContent=active?'Protection locale activée : les données enregistrées sur cet appareil sont chiffrées.':'Protection locale désactivée : les données sont enregistrées en clair dans ce navigateur.';}
    const enable=document.getElementById('vaultEnable'),rotate=document.getElementById('vaultRotate'),lock=document.getElementById('vaultLock');
    if(enable)enable.hidden=active;if(rotate)rotate.hidden=!active;if(lock)lock.hidden=!active;
    vaultIndicator(active?'Coffre activé · données chiffrées sur cet appareil.':'Coffre désactivé · stockage local non chiffré.');
  }
  function initVaultUI(){
    refreshVaultUI();
    const run=async action=>{
      const input=document.getElementById('vaultNewPassword'),confirmation=document.getElementById('vaultNewConfirm'),password=input.value;
      if(password!==confirmation.value){vaultIndicator('Les deux phrases secrètes ne correspondent pas.',true);return}
      if(password.length<12){vaultIndicator('Choisis au minimum 12 caractères.',true);return}
      const target=document.getElementById(action==='enable'?'vaultEnable':'vaultRotate');target.disabled=true;
      try{if(action==='enable'){if(!confirm('Activer le coffre chiffré sur cet appareil ? Fais d’abord une sauvegarde externe de tes factures. Sans cette nouvelle phrase secrète, le coffre sera irrécupérable.'))return;await vaultEnable(password)}else await vaultRotate(password);input.value='';confirmation.value='';refreshVaultUI()}
      catch(e){vaultIndicator(e.message,true)}finally{target.disabled=false}
    };
    document.getElementById('vaultEnable').addEventListener('click',()=>run('enable'));
    document.getElementById('vaultRotate').addEventListener('click',()=>run('rotate'));
    document.getElementById('vaultLock').addEventListener('click',vaultLock);
    window.addEventListener('beforeunload',event=>{if(vaultCache&&vaultDirty){event.preventDefault();event.returnValue='';}});
  }
  async function requestVaultAccess(){
    if(!vaultIsEnabled())return true;
    const gate=document.getElementById('vaultGate'),form=document.getElementById('vaultUnlockForm'),pass=document.getElementById('vaultUnlockPassword'),message=document.getElementById('vaultUnlockError');
    gate.hidden=false;pass.focus();
    await new Promise(resolve=>{
      form.addEventListener('submit',async event=>{
        event.preventDefault();const button=document.getElementById('vaultUnlockButton');button.disabled=true;message.textContent='Vérification du coffre…';
        try{await vaultOpen(pass.value);pass.value='';gate.hidden=true;resolve()}
        catch(e){message.textContent=e.message;pass.value='';pass.focus()}
        finally{button.disabled=false}
      });
    });
    return true;
  }
  const isPro = () => sessionStorage.getItem('philosophal-invoice-entry-v1') === 'alo-2026' || api?.role() === 'private';
  const today = new Date();
  const iso = d => [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
  const plusDays = (s,n) => {const d = new Date(s + 'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
  const docMoney = n => Number(n||0).toFixed(2);
  const qty = n => Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:4});
  const monthName = period => {if(!period) return '';const [y,m]=period.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('fr-FR',{month:'long'})};
  const dateFr = s => {if(!s)return '';const [y,m,d]=s.split('-');return `${d} / ${m} / ${y}`};
  const fields=['issuer','siret','address','contact','client','clientAddress','project','validator','projectCode','rcs','tax','terms','rib','closing','number','date','due','period'];
  const savedKey='philosophal-invoice-preset-v1', lastKey='philosophal-invoice-last-v42';
  // V44 · La charte du document reste entièrement locale, même dans les exports.
  const styleDefaults={docTitle:'FACTURE',docTitleSize:15,docTitleBold:true,docProjectBold:true,
    docAccent:'#8243a8',docSoft:'#f9eff0',docTitleColor:'#5d292b',docTable:'#ededed'};
  const styleFields=Object.keys(styleDefaults);
  function validHex(value,fallback){return /^#[0-9a-f]{6}$/i.test(String(value||''))?String(value).toLowerCase():fallback}
  function normalizeStyle(p){
    for(const key of ['docAccent','docSoft','docTitleColor','docTable'])p[key]=validHex(p[key],styleDefaults[key]);
    p.docTitle=String(p.docTitle??styleDefaults.docTitle).trim().slice(0,48)||styleDefaults.docTitle;
    p.docTitleSize=[13,15,18].includes(Number(p.docTitleSize))?Number(p.docTitleSize):15;
    p.docTitleBold=p.docTitleBold!==false;p.docProjectBold=p.docProjectBold!==false;
    return p;
  }
  const presets={
    sejer: {
      issuer:'Florian VALLIN',siret:'99266098500019',address:'1418 Avenue de la Justice de Castelnau,\n34090 Montpellier',contact:'0649922575\nflorianvallin@free.fr',client:'SEJER',clientAddress:'Comptabilité Fournisseurs\n92 Avenue de France CS 91464\n75 702 Paris Cedex 13',project:'Commanditaire : CC Edito - 51 537 000',validator:'Christelle Derda',projectCode:'NC 62 222 000',rcs:'Dispensé d’immatriculation au registre du commerce\net des sociétés (RCS) et au répertoire des métiers',tax:'TVA non applicable, art. 293 B du CGI',terms:'Conditions de paiement : à 30 jours.\nAucun escompte consenti pour règlement anticipé',rib:'',closing:'En votre aimable règlement,\nCordialement,',showDue:false,italicAmounts:true,
      lines:[{name:'Service Profs en ligne - Heures de permanence en appel',quantity:0,price:30,italicEnabled:true,italicFrom:'Heures de permanence'},{name:'Service Profs en ligne - Heures de permanence sans appel',quantity:0,price:10,italicEnabled:true,italicFrom:'Heures de permanence'}]
    },
    private:{issuer:'Florian VALLIN',siret:'99266098500019',address:'1418 Avenue de la Justice de Castelnau,\n34090 Montpellier',contact:'florianvallin@free.fr',client:'',clientAddress:'',project:'Cours particulier de philosophie',validator:'',projectCode:'',rcs:'',tax:'TVA non applicable, art. 293 B du CGI',terms:'Paiement à réception de la facture.',rib:'',closing:'Merci pour votre confiance.',showDue:false,italicAmounts:false,lines:[{name:'Cours particulier de philosophie',quantity:1,price:40,italicEnabled:false,italicFrom:''}]},
    blank:{issuer:'Florian VALLIN',siret:'99266098500019',address:'',contact:'',client:'',clientAddress:'',project:'',validator:'',projectCode:'',rcs:'',tax:'TVA non applicable, art. 293 B du CGI',terms:'',rib:'',closing:'',showDue:false,italicAmounts:false,lines:[{name:'Prestation',quantity:1,price:0,italicEnabled:false,italicFrom:''}]}
  };
  let lines=[], currentPreset='sejer', invalidFields=new Set();
  // Accepte des durées de cours : 1h30, 1:30, 2h05, 90min, 1,5 et 1.5.
  function duration(text){
    const s=String(text??'').trim().toLowerCase().replace(/\s+/g,'').replace(',', '.');
    if(!s)return 0;
    const h=s.match(/^(\d+(?:\.\d+)?)h(?:(\d{1,2})(?:m|min)?)?$/);
    if(h){const minutes=Number(h[2]||0);return minutes>=60?NaN:Number(h[1])+minutes/60}
    const colon=s.match(/^(\d+):(\d{1,2})$/);
    if(colon){const minutes=Number(colon[2]);return minutes>=60?NaN:Number(colon[1])+minutes/60}
    const min=s.match(/^(\d+(?:\.\d+)?)(?:min|m)$/);if(min)return Number(min[1])/60;
    if(/^\d+(?:\.\d+)?$/.test(s))return Number(s);
    return NaN;
  }
  const qtyString=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:4});
  function validateInput(input,number){const invalid=!Number.isFinite(number)||number<0;input.setAttribute('aria-invalid',String(invalid));
    if(invalid)invalidFields.add(input);else invalidFields.delete(input);
    $('validationMessage').hidden=invalidFields.size===0;
    $('validationMessage').textContent=invalidFields.size?'Vérifie les durées indiquées en rouge avant l’export.':'';
    return !invalid;
  }
  function lastInvoice(){try{return JSON.parse(secureStore.getItem(lastKey)||'null')}catch{return null}}
  function showLast(){const p=lastInvoice();$('cloneLast').disabled=!p;$('lastInfo').textContent=p?'Dernière facture sauvegardée ici : '+(p.number||'sans référence')+' · '+money((p.lines||[]).reduce((s,l)=>s+(Number(l.quantity)||0)*(Number(l.price)||0),0)):'Aucune facture récente sauvegardée sur cet appareil.'}
  function rememberLast(){try{secureStore.setItem(lastKey,JSON.stringify({...data(),preset:currentPreset, savedAt:new Date().toISOString()}));showLast()}catch(error){console.warn('Enregistrement local impossible',error)}}
  function duplicateLast(){const p=lastInvoice();if(!p)return;
    currentPreset=p.preset||'sejer';$('preset').value=currentPreset;
    const newPeriod=iso(new Date()).slice(0,7);const newDate=iso(new Date());
    const updatedNumber=nextNumber(newDate);
    activeInvoiceId=null;activeSignature='';autoNumber=true;timeSource=null;
    assignPreset({...p,period:newPeriod,date:newDate,number:updatedNumber,due:plusDays(newDate,30)});
    updateActiveNotice();
    showMessage('Facture précédente reprise. Vérifie les heures, la référence et la date avant l’envoi.');
  }
  function showMessage(s){$('lastInfo').textContent=s}
  function mode(name){const express=name==='express';$('expressPanel').hidden=!express;$('advancedPanel').hidden=express;
    $('modeExpress').classList.toggle('is-active',express);$('modeAdvanced').classList.toggle('is-active',!express);
    $('modeExpress').setAttribute('aria-pressed',String(express));$('modeAdvanced').setAttribute('aria-pressed',String(!express));
    if(express)syncQuick();queueAutoSave();
  }
  function renderQuick(){
    const root=$('quickLines');root.textContent='';
    lines.forEach((l,i)=>{const row=document.createElement('div');row.className='quick-line';
      const name=document.createElement('div');name.className='quick-service';name.textContent=l.name;
      const mini=document.createElement('small');mini.textContent=(l.quantity*l.price).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});name.append(mini);
      const hours=document.createElement('label');hours.textContent='Heures / Qté';const h=document.createElement('input');h.type='text';h.inputMode='decimal';h.autocomplete='off';h.dataset.quick='quantity';h.dataset.index=String(i);h.value=qtyString(l.quantity);h.setAttribute('aria-label','Durée ou quantité – '+l.name);hours.append(h);
      const rate=document.createElement('label');rate.textContent='Tarif (€)';const r=document.createElement('input');r.type='number';r.min='0';r.step='0.01';r.value=String(l.price);r.dataset.quick='price';r.dataset.index=String(i);rate.append(r);
      row.append(name,hours,rate);root.append(row);
      h.addEventListener('input',()=>{const n=duration(h.value);if(!validateInput(h,n))return;lines[i].quantity=n;syncAdvancedLine(i,'quantity',n);update()});
      h.addEventListener('blur',()=>{if(h.getAttribute('aria-invalid')!=='true')h.value=qtyString(lines[i].quantity)});
      r.addEventListener('input',()=>{const n=Number(r.value);if(!validateInput(r,n))return;lines[i].price=n;syncAdvancedLine(i,'price',n);update()});
    });
    syncQuick();
  }
  function syncAdvancedLine(i,key,value){const el=$('lines').children[i]?.querySelector('[data-f="'+key+'"]');if(el&&el!==document.activeElement)el.value=key==='quantity'?qtyString(value):String(value)}
  function syncQuick(){
    for(const [a,b] of [['quickPeriod','period'],['quickDate','date'],['quickNumber','number'],['quickValidator','validator']]){
      const input=$(a);if(input&&input!==document.activeElement)input.value=$(b).value;
    }
    lines.forEach((l,i)=>{const card=$('quickLines').children[i];if(!card)return;
      const title=card.querySelector('.quick-service');title.firstChild.textContent=l.name;
      title.querySelector('small').textContent=money(l.quantity*l.price);
      const h=card.querySelector('[data-quick="quantity"]');if(h!==document.activeElement)h.value=qtyString(l.quantity);
      const p=card.querySelector('[data-quick="price"]');if(p!==document.activeElement)p.value=String(l.price);
    });
    $('quickTotal').textContent=money(total());
  }

  function normalizeLine(line){return {name:String(line.name??''),quantity:Math.max(0,Number(line.quantity)||0),price:Math.max(0,Number(line.price)||0),italicEnabled:Boolean(line.italicEnabled),italicFrom:String(line.italicFrom??'')}};
  function migrate(loaded){
    const p={...loaded};
    if(p.italicAmounts===undefined && Array.isArray(p.lines))p.italicAmounts=p.lines.some(l=>/Heures de permanence/i.test(l.name||''));
    if(Array.isArray(p.lines))p.lines=p.lines.map(l=>({
      ...l,
      italicEnabled:typeof l.italicEnabled==='boolean'?l.italicEnabled:/Heures de permanence/i.test(l.name||''),
      italicFrom:l.italicFrom??(/Heures de permanence/i.test(l.name||'')?'Heures de permanence':'')
    }));
    // V40 kept the name inside the "Commanditaire" paragraph: split it without loss.
    if(typeof p.project==='string' && /\bValideur\s+/.test(p.project) && !p.validator){
      const match=p.project.match(/^(.*?)[–-]\s*Valideur\s+([^\n]+)(?:\n(.*))?$/);
      if(match){p.project=match[1].trim();p.validator=match[2].trim();p.projectCode=p.projectCode||match[3]||'';}
    }
    return normalizeStyle(p);
  }
  function assignPreset(src){
    const p=migrate(src);
    fields.forEach(id=>{$(id).value=typeof p[id]==='string'?p[id]:''});
    styleFields.forEach(id=>{if($(id).type==='checkbox')$(id).checked=Boolean(p[id]);else $(id).value=String(p[id])});
    // The date and invoice number belong to the user's current draft, not preset layouts.
    if(!p.date) $('date').value=iso(today);
    if(!p.period) $('period').value=iso(today).slice(0,7);
    if(!p.number) $('number').value=$('period').value+'-FV';
    if(!p.due) $('due').value=plusDays($('date').value,30);
    $('showDue').checked=Boolean(p.showDue);
    $('italicAmounts').checked=Boolean(p.italicAmounts);
    lines=(p.lines||[]).map(normalizeLine);
    invalidFields.clear();$('validationMessage').hidden=true;updateDue();renderLines();renderQuick();update();
  }
  function setPreset(name){currentPreset=name;const t=name.startsWith('custom:')?templates.find(t=>'custom:'+t.id===name):null;assignPreset(t?.content || presets[name] || presets.sejer)}
  function data(){return {...Object.fromEntries(fields.map(id=>[id,$(id).value])),
    ...Object.fromEntries(styleFields.map(id=>[id,$(id).type==='checkbox'?$(id).checked:$(id).value])),
    showDue:$('showDue').checked,italicAmounts:$('italicAmounts').checked,lines:lines.map(l=>({...l}))}}
  function updateDue(){$('dueWrap').hidden=!$('showDue').checked}
  function renderLines(){
    const el=$('lines');el.textContent='';
    lines.forEach((l,i)=>{
      const wrap=document.createElement('section');wrap.className='line-item';
      wrap.innerHTML=`<div class="line"><label>Désignation<input data-f="name" value="${escape(l.name)}"></label><label>Heures / Qté<input data-f="quantity" type="text" inputmode="decimal" autocomplete="off" value="${escape(qtyString(l.quantity))}"></label><label>€ / heure<input data-f="price" type="number" min="0" step="0.01" value="${escape(l.price)}"></label><button type="button" class="remove-line" aria-label="Supprimer la ligne">×</button></div><div class="line-format"><label class="checkbox-row"><input data-f="italicEnabled" type="checkbox" ${l.italicEnabled?'checked':''}> Italique dans la désignation</label><label class="italic-from">À partir des mots <input data-f="italicFrom" placeholder="Laisser vide pour tout mettre en italique" value="${escape(l.italicFrom)}" ${l.italicEnabled?'':'disabled'}></label></div>`;
      wrap.querySelectorAll('[data-f]').forEach(input=>input.addEventListener('input',()=>{
        if(input.dataset.f==='italicEnabled'){l.italicEnabled=input.checked;wrap.querySelector('[data-f="italicFrom"]').disabled=!input.checked}
        else if(input.dataset.f==='quantity'){const n=duration(input.value);if(!validateInput(input,n))return;l.quantity=n}
        else if(input.dataset.f==='price'){const n=Number(input.value);if(!validateInput(input,n))return;l.price=n}
        else l[input.dataset.f]=input.value;
        update();
      }));
      wrap.querySelector('.remove-line').addEventListener('click',()=>{lines.splice(i,1);invalidFields.clear();renderLines();renderQuick();update()});
      el.append(wrap);
    });
  }
  function detailParts(line,period){
    const name=line.name + (period?' - '+monthName(period).replace(/^./,c=>c.toUpperCase()):'');
    if(!line.italicEnabled)return [{text:name,italic:false}];
    const start=line.italicFrom ? name.toLocaleLowerCase('fr').indexOf(line.italicFrom.toLocaleLowerCase('fr')) : 0;
    if(start<0)return [{text:name,italic:false}]; // never invent italics if the chosen expression is absent
    return [{text:name.slice(0,start),italic:false},{text:name.slice(start),italic:true}];
  }
  function projectText(f){return [f.project.trim()+(f.validator.trim()?` – Valideur ${f.validator.trim()}`:''),f.projectCode.trim()].filter(Boolean).join('\n')}
  function richHtml(parts){return parts.map(p=>p.italic?`<em>${escape(p.text)}</em>`:escape(p.text)).join('')}
  const br=s=>escape(s).replace(/\n/g,'<br>');
  const total=()=>lines.reduce((sum,l)=>sum+l.quantity*l.price,0);
  function makeHTML(){
    const f=data(), amountStyle=f.italicAmounts?' class="amount-italic"':'';
    const rows=f.lines.map((l,i)=>`<tr><td class="center">${qty(l.quantity)}</td><td data-edit-line="${i}" tabindex="0" role="button" title="Modifier cette prestation">${richHtml(detailParts(l,f.period))}</td><td class="right${f.italicAmounts?' amount-italic':''}">${docMoney(l.price)}</td><td class="right${f.italicAmounts?' amount-italic':''}">${docMoney(l.quantity*l.price)}</td></tr>`).join('');
    const numberLines=`<span>Référence : ${escape(f.number)}</span><span>Date <i>:</i> ${dateFr(f.date)}</span>${f.showDue?`<span>Échéance : ${dateFr(f.due)}</span>`:''}`;
    return `<div class="paper-header"><div><h2 data-edit-field="issuer">${escape(f.issuer)}</h2><p data-edit-field="address">${br(f.address)}${f.contact?'<br>'+br(f.contact):''}${f.siret?'<br>'+escape(f.siret):''}</p></div><div class="paper-title" data-edit-style="docTitle">${escape(f.docTitle)}</div></div>
    <div class="paper-contact"><p data-edit-field="rcs">${br(f.rcs)}</p><div><strong data-edit-field="client">${escape(f.client)}</strong><div data-edit-field="clientAddress">${br(f.clientAddress)}</div></div></div>
    <div class="paper-number" data-edit-field="number">${numberLines}</div>
    <div class="paper-project" data-edit-field="project">${br(projectText(f))}</div>
    <table><thead><tr><th>Quantité</th><th>Désignation</th><th>Prix unitaire HT</th><th>Prix total HT</th></tr></thead><tbody>${rows||'<tr><td colspan="4">Aucune prestation</td></tr>'}</tbody></table>
    <div class="paper-summary"><div class="paper-total"><span>Total HT</span><span${amountStyle}>${docMoney(total())} €</span></div><div class="paper-tax" data-edit-field="tax">${br(f.tax)}</div></div>
    <div class="paper-footer"><div data-edit-field="closing">${br(f.closing)}</div><div class="paper-terms" data-edit-field="terms">${br(f.terms)}</div>${f.rib?`<div class="paper-rib">RIB – ${escape(f.rib)}</div>`:''}</div>
    <div class="paper-id">${escape(f.issuer)}${f.siret?', '+escape(f.siret):''}${f.address?', '+br(f.address).replace(/<br>/g,', '):''}</div>`;
  }
  function update(){
    $('total').textContent=money(total());
    const f=data(),doc=$('preview');
    doc.style.setProperty('--doc-accent',validHex(f.docAccent,styleDefaults.docAccent));
    doc.style.setProperty('--doc-soft',validHex(f.docSoft,styleDefaults.docSoft));
    doc.style.setProperty('--doc-title-color',validHex(f.docTitleColor,styleDefaults.docTitleColor));
    doc.style.setProperty('--doc-table',validHex(f.docTable,styleDefaults.docTable));
    doc.style.setProperty('--doc-title-size',String(Math.round(Number(f.docTitleSize)*1.6))+'px');
    doc.style.setProperty('--doc-title-weight',f.docTitleBold?'700':'400');
    doc.style.setProperty('--doc-title-spacing',f.docTitle.length>12?'0.045em':'0.26em');
    doc.style.setProperty('--doc-project-weight',f.docProjectBold?'700':'400');
    doc.innerHTML=makeHTML();syncQuick();updateActiveNotice();queueAutoSave();
  }
  function filename(ext){return 'Facture-'+($('number').value||'sans-reference').replace(/[^a-zA-Z0-9-]/g,'-')+'.'+ext}
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
  // Minimal self-contained Office Open XML exporter: valid DOCX, with real w:i italic runs.
  const encoder=new TextEncoder(),enc=s=>encoder.encode(s);
  const crcTable=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcTable[n]=c>>>0}
  const crc32=u=>{let c=0xffffffff;for(const b of u)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0};
  function zip(entries){
    const chunks=[],central=[];let offset=0;
    const u16=v=>[v&255,(v>>>8)&255],u32=v=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
    for(const [name,value] of entries){
      const n=enc(name),b=enc(value),crc=crc32(b),len=b.length;
      const local=new Uint8Array([...u32(0x04034b50),...u16(20),0,0,0,0,0,0,0,0,...u32(crc),...u32(len),...u32(len),...u16(n.length),0,0,...n]);
      chunks.push(local,b);
      const header=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),0,0,0,0,0,0,0,0,...u32(crc),...u32(len),...u32(len),...u16(n.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(offset),...n]);
      central.push(header);offset+=local.length+len;
    }
    const size=central.reduce((s,x)=>s+x.length,0),end=new Uint8Array([...u32(0x06054b50),0,0,0,0,...u16(entries.length),...u16(entries.length),...u32(size),...u32(offset),0,0]);
    return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }
  function exportWord(customPayload=null,customFilename=null){
    const f=customPayload||data(),x=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const run=(content,{italic=false,bold=false,color=null,size=20}={})=>`<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>${bold?'<w:b/>':''}${italic?'<w:i/>':''}${color?`<w:color w:val="${color}"/>`:''}<w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${x(content)}</w:t></w:r>`;
    const para=(runs,opts={})=>`<w:p><w:pPr><w:spacing w:before="${opts.before??0}" w:after="${opts.spacing??0}" w:line="260" w:lineRule="auto"/>${opts.align?`<w:jc w:val="${opts.align}"/>`:''}</w:pPr>${Array.isArray(runs)?runs.join(''):run(runs,opts)}</w:p>`;
    const multiline=(content,opts={})=>String(content||'').split('\n').map(z=>para(z,opts)).join('');
    const tblPr=(width,bordered=false)=>`<w:tblPr><w:tblW w:w="${width}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(k=>`<w:${k} w:val="${bordered?'single':'nil'}"${bordered?' w:sz="4"':''}/>`).join('')}</w:tblBorders><w:tblCellMar><w:top w:w="55" w:type="dxa"/><w:start w:w="75" w:type="dxa"/><w:bottom w:w="55" w:type="dxa"/><w:end w:w="75" w:type="dxa"/></w:tblCellMar></w:tblPr>`;
    const blockCell=(body,width,shade)=>`<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shade?`<w:shd w:fill="${shade}"/>`:''}</w:tcPr>${body||para('')}</w:tc>`;
    const simpleRow=(left,right,ws=[5300,4390],shadeRight=null,shadeLeft=null)=>`<w:tbl>${tblPr(ws[0]+ws[1])}<w:tblGrid>${ws.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid><w:tr>${blockCell(left,ws[0],shadeLeft)}${blockCell(right,ws[1],shadeRight)}</w:tr></w:tbl>`;
    const cell=(parts,width,opts={})=>blockCell(para(parts,{align:opts.align}),width,opts.shade);
    const ws=[1250,4570,2130,1740];
    const gridRow=(items,head=false)=>`<w:tr>${items.map((it,i)=>cell(it,ws[i],{shade:head?wordHex('docTable'):undefined,align:i===0?'center':i>1?'right':undefined})).join('')}</w:tr>`;
    const italicPrice=txt=>run(txt,{italic:f.italicAmounts});
    const wordHex=key=>validHex(f[key],styleDefaults[key]).slice(1).toUpperCase();
    const titleDisplay=f.docTitle.length>12?f.docTitle.toUpperCase():Array.from(f.docTitle.toUpperCase()).join(' ');
    const invoiceTitle=para(titleDisplay,{bold:f.docTitleBold,size:f.docTitleSize*2,align:'center',color:wordHex('docTitleColor'),before:150,spacing:170});
    const headerLeft=para(f.issuer,{bold:true,size:28,spacing:125})+multiline(f.address)+multiline(f.contact)+para(f.siret);
    const contactLeft=multiline(f.rcs,{size:17});
    const contactRight=para(f.client,{bold:true,size:26})+multiline(f.clientAddress,{size:20});
    const dates=para('Référence : '+f.number,{size:21,spacing:120})+para('Date          :  '+dateFr(f.date),{size:21,spacing:110})+(f.showDue?para('Échéance  :  '+dateFr(f.due),{size:21}):para(''));
    const sections=[
      simpleRow(headerLeft,invoiceTitle,[5300,4390],wordHex('docSoft')),
      para('',{spacing:480}),
      simpleRow(contactLeft,contactRight),
      para('',{spacing:190}),
      simpleRow(dates,para(''),[3250,6440],null,wordHex('docSoft')),
      para('',{spacing:220}),
      ...projectText(f).split('\n').map(line=>para(line,{bold:f.docProjectBold,color:wordHex('docAccent'),size:18})),
      para('',{spacing:125}),
      `<w:tbl>${tblPr(9690,true)}<w:tblGrid>${ws.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${gridRow(['Quantité','Désignation','Prix unitaire HT','Prix total HT'].map(t=>[run(t,{bold:true,size:18})]),true)}${f.lines.map(l=>gridRow([[run(qty(l.quantity))],detailParts(l,f.period).map(p=>run(p.text,{italic:p.italic})),[italicPrice(docMoney(l.price))],[italicPrice(docMoney(l.price*l.quantity))]])).join('')}</w:tbl>`,
      para('',{spacing:180}),
      para([run(f.documentKind==='credit'?'Total avoir HT  ':'Total HT  ',{bold:true}),italicPrice(money(textTotal(f)))],{align:'right',spacing:95}),
      para(f.tax,{align:'right',size:17}),
      para('',{spacing:420}),
      multiline(f.closing),
      para('',{spacing:155}),
      multiline(f.terms,{size:17,color:'888888'}),
      ...(f.rib?[para('',{spacing:120}),para('RIB – '+f.rib,{color:'888888',size:17})]:[]),
      para('',{spacing:450}),
      para([run([f.issuer,f.siret,f.address.replace(/,?\s*\n/g,', ')].filter(Boolean).join(', '),{size:15,color:'666666'})],{align:'center'})
    ];
    const xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+sections.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1150" w:right="1100" w:bottom="1150" w:left="1100"/></w:sectPr></w:body></w:document>';
    const entries=[['[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],['_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],['word/document.xml',xml]];
    const file=zip(entries);if(customFilename!==false)download(file,customFilename||filename('docx'));return file;
  }
  function canExport(){
    if(!invalidFields.size)return true;
    const input=[...invalidFields][0];
    mode(input.closest('#advancedPanel')?'advanced':'express');
    input.focus();input.scrollIntoView({block:'center',behavior:'smooth'});
    return false;
  }
  function exitPro(){sessionStorage.removeItem('philosophal-invoice-entry-v1');if(api?.role())api.lock();else location.href='/outils/'}
  // V43 · Stockage local des profils, modèles et factures (aucune synchronisation distante).
  const clientKey='philosophal-invoice-clients-v43';
  const templateKey='philosophal-invoice-templates-v43';
  const historyKey='philosophal-invoice-history-v43';
  const creditKey='philosophal-invoice-credits-v47';
  const counterKey='philosophal-invoice-numbering-v43';
  const statusLabels={draft:'Brouillon',issued:'Émise',sent:'Envoyée',paid:'Payée'};
  const clientFields={profile:'clientProfileName',client:'clientProfileClient',clientAddress:'clientProfileAddress',project:'clientProfileProject',validator:'clientProfileValidator',projectCode:'clientProfileCode',terms:'clientProfileTerms',tax:'clientProfileTax',rateWith:'clientProfileRateWith',rateWithout:'clientProfileRateWithout',rateCustom:'clientProfileRateCustom'};
  const isoNow=()=>new Date().toISOString();
  const uid=()=> typeof crypto?.randomUUID==='function'?crypto.randomUUID():('invoice-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  const readStore=(key,empty)=>{try{const v=JSON.parse(secureStore.getItem(key)||'null');return v===null?empty:v}catch{return empty}};
  let timeEntries=[],timeEditId=null,timeSource=null;
  const timeKey='philosophal-invoice-time-v46';
  let credits=[],clients=[],templates=[],invoices=[],numberCounters={},selectedClientId='',selectedClientLines=null,activeInvoiceId=null,activeSignature='',autoNumber=true;
  const automationKey='philosophal-invoice-rules-v50', closeKey='philosophal-invoice-month-close-v50';
  let automationRules=[],monthClosures=[],editingRuleId='',generationPreview=[];
  const clone=v=>JSON.parse(JSON.stringify(v));
  const signature=v=>JSON.stringify(v);
  const textTotal=d=>(d?.lines||[]).reduce((sum,l)=>sum+(Number(l.quantity)||0)*(Number(l.price)||0),0);
  const persist=(key,value)=>{try{secureStore.setItem(key,JSON.stringify(value));return true}catch(e){console.error('Sauvegarde locale impossible',e);alert('Stockage local saturé ou indisponible. Exporte et conserve tes factures séparément.');return false}};
  function loadDatabase(){
    credits=readStore(creditKey,[]);if(!Array.isArray(credits))credits=[];clients=readStore(clientKey,[]);templates=readStore(templateKey,[]);invoices=readStore(historyKey,[]);numberCounters=readStore(counterKey,{});timeEntries=readStore(timeKey,[]);if(!Array.isArray(timeEntries))timeEntries=[];automationRules=readStore(automationKey,[]);monthClosures=readStore(closeKey,[]);if(!Array.isArray(automationRules))automationRules=[];if(!Array.isArray(monthClosures))monthClosures=[];
    if(!Array.isArray(clients))clients=[];if(!Array.isArray(templates))templates=[];if(!Array.isArray(invoices))invoices=[];
    if(!numberCounters||typeof numberCounters!=='object'||Array.isArray(numberCounters))numberCounters={};
    // Migrer l'ancien modèle unique, sans toucher aux données du navigateur si la sauvegarde échoue.
    const oldTemplate=readStore(savedKey,null);
    if(oldTemplate && !templates.some(t=>t.source==='v42-saved-model')){
      const old=migrate(oldTemplate.fields?{...oldTemplate.fields,lines:oldTemplate.lines,showDue:oldTemplate.showDue,italicAmounts:oldTemplate.italicAmounts}:oldTemplate);
      const content={...old};for(const key of ['number','date','period','due','savedAt','preset'])delete content[key];
      const imported={id:uid(),name:'Mon ancien modèle (V42)',source:'v42-saved-model',updatedAt:isoNow(),content};
      const next=[...templates,imported];
      if(persist(templateKey,next)){templates=next;try{secureStore.removeItem(savedKey)}catch{}}
    }
    // Reprendre sans effacer la dernière facture réellement exportée depuis la V42.
    const legacy=lastInvoice();
    if(legacy?.number && !invoices.some(x=>x.payload?.number===legacy.number)){
      const m=migrate(clone(legacy));const payload={...Object.fromEntries(fields.map(id=>[id,String(m[id]||'')])),showDue:Boolean(m.showDue),italicAmounts:Boolean(m.italicAmounts),...Object.fromEntries(styleFields.map(k=>[k,m[k]])),lines:(m.lines||[]).map(normalizeLine)};
      const item={id:uid(),status:'issued',createdAt:legacy.savedAt||isoNow(),updatedAt:isoNow(),exportedAt:legacy.savedAt||isoNow(),source:'v42',preset:legacy.preset||'sejer',payload};
      const next=[item,...invoices];if(persist(historyKey,next))invoices=next;
    }
    renderCounters();refreshPresetOptions();renderClientSelector();renderTemplates();renderHistory();renderDashboard();renderTime();renderCollection();renderCredits();renderReports();
  }
  function nextNumber(date){
    const year=/^\d{4}/.exec(String(date||''))?.[0]||String(new Date().getFullYear());
    const fromHistory=invoices.filter(i=>(i.payload?.number||'').startsWith(year+'-')).map(i=>{
      const m=String(i.payload.number).match(new RegExp('^'+year+'-(\\d{4})-FV$','i'));return m?Number(m[1]):0;
    });
    let n=Math.max(0,Number(numberCounters[year])||0,...fromHistory)+1;
    while(invoices.some(i=>i.payload?.number===`${year}-${String(n).padStart(4,'0')}-FV`))n++;
    return `${year}-${String(n).padStart(4,'0')}-FV`;
  }
  function updateCounter(number){
    const match=String(number).match(/^(\d{4})-(\d{4})-FV$/i);
    if(match){numberCounters[match[1]]=Math.max(Number(numberCounters[match[1]])||0,Number(match[2]));persist(counterKey,numberCounters)}
  }
  function newDraft(presetName=null){
    timeSource=null;
    activeInvoiceId=null;activeSignature='';
    if(presetName){setPreset(presetName);if([...$('preset').options].some(option=>option.value===presetName))$('preset').value=presetName}
    const t=iso(new Date());$('date').value=t;$('period').value=t.slice(0,7);$('due').value=plusDays(t,30);
    autoNumber=true;$('number').value=nextNumber(t);update();setArea('editor');updateActiveNotice();
  }
  function updateActiveNotice(){
    const el=$('activeInvoiceNotice');if(!el)return;
    const record=invoices.find(i=>i.id===activeInvoiceId);
    if(!record){el.textContent='Nouvelle facture · Numéro proposé, pas encore attribué. Enregistre ou exporte pour archiver.';return;}
    const altered=signature(data())!==signature(record.payload);
    el.textContent=`${statusLabels[record.status]||'Archivée'} · ${record.payload.number} · ${altered?'Modifications non enregistrées':'Enregistrée dans cet appareil'}` + (record.status!=='draft'&&altered?' · Duplique-la pour émettre une correction.':'');
  }
  function setArea(area){
    const isEditor=area==='editor';
    $('editorWorkspace').hidden=!isEditor;
    for(const a of ['dashboard','reports','time','automation','collection','credits','clients','templates','history','backup'])$(a+'Panel').hidden=area!==a;
    document.body.classList.toggle('management-view',!isEditor);
    document.querySelectorAll('[data-office]').forEach(b=>{
      const active=b.dataset.office===area;b.classList.toggle('is-active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
    const quickNames={editor:'Création de facture',time:'Registre des heures',history:'Historique des factures',collection:'Suivi des échéances',dashboard:'Tableau de bord',reports:'Bilans',automation:'Facturation automatisée',credits:'Avoirs',clients:'Carnet de clients',templates:'Modèles',backup:'Sauvegardes et sécurité'};
    const mobile=$('officeMobileSelect');if(mobile)mobile.value=area;
    const label=$('officeCurrentLabel');if(label)label.textContent=quickNames[area]||'Facturation';
    document.querySelectorAll('[data-quick-office]').forEach(b=>{
      const active=b.dataset.quickOffice===area;b.classList.toggle('is-active',active);
      b.setAttribute('aria-pressed',String(active));
    });
    const head=document.querySelector('.head h1');
    head.textContent=isEditor?'Créer une facture':area==='dashboard'?'Suivre mon activité':area==='reports'?'Analyser mon activité':'Organiser ma facturation';
    const intro=document.querySelector('.head p');
    if(intro)intro.textContent=isEditor?'Quelques heures à saisir pour ta facture mensuelle. Tous les détails restent personnalisables.':area==='dashboard'?'Une vue claire de tes factures et de tes paiements, à partir des données enregistrées sur cet appareil.':'Retrouve tes clients, modèles, factures et sauvegardes en quelques clics.';
    if(area==='collection')renderCollection();if(area==='credits')renderCredits();if(area==='time')renderTime();if(area==='dashboard')renderDashboard();if(area==='reports')renderReports();if(area==='automation')renderAutomation();if(area==='clients')renderClientSelector();if(area==='templates')renderTemplates();if(area==='history')renderHistory();
  }
  function renderCounters(){
    $('clientCount').textContent=String(clients.length);
    $('templateCount').textContent=String(templates.length);
    $('historyCount').textContent=String(invoices.length);
    $('creditCount').textContent=String(credits.length);
    $('collectionCount').textContent=String(invoices.filter(i=>i.status!=='draft'&&getInvoiceBalance(i).balance>0).length);
    $('timeCount').textContent=String(timeEntries.filter(e=>!invoiceForTime(e.id)).length);
    $('automationCount').textContent=String(automationRules.filter(r=>r.enabled).length);
  }
  function refreshPresetOptions(){
    const box=$('preset');const selected=box.value;
    box.querySelectorAll('option[data-custom]').forEach(o=>o.remove());
    for(const t of templates){const option=document.createElement('option');option.value='custom:'+t.id;option.textContent=t.name;option.dataset.custom='';box.add(option)}
    if([...box.options].some(o=>o.value===selected))box.value=selected;
  }
  function clientFormValues(){
    const r={};for(const [key,id] of Object.entries(clientFields))r[key]=$(id).value.trim();
    if($('clientProfileKeepLines').checked)r.defaultLines=clone(selectedClientLines||lines);
    return r;
  }
  function fillClientForm(profile=null){
    for(const [key,id] of Object.entries(clientFields))$(id).value=profile?.[key]||'';
    selectedClientLines=profile?.defaultLines?.length?clone(profile.defaultLines):null;
    $('clientProfileKeepLines').checked=Boolean(profile?.defaultLines?.length);
    $('clientRemove').disabled=!profile;
    $('clientMessage').textContent='';
  }
  function renderClientSelector(){
    const sel=$('clientProfileList');sel.textContent='';
    const base=new Option('Nouveau profil','');sel.add(base);
    for(const c of clients)sel.add(new Option(c.profile||c.client||'Sans nom',c.id));
    if(clients.some(c=>c.id===selectedClientId))sel.value=selectedClientId;
    else{selectedClientId='';sel.value=''}
    fillClientForm(clients.find(c=>c.id===selectedClientId));
    renderCounters();
  }
  function managerMessage(id,message,warning=false){const el=$(id);el.textContent=message;el.className='manager-message '+(warning?'is-warning':'is-success')}
  function captureClient(){
    selectedClientId='';$('clientProfileList').value='';
    const d=data();for(const [key,id] of Object.entries(clientFields))$(id).value=key==='profile'?(d.client||'Mon client'):d[key]||'';
    selectedClientLines=clone(lines);$('clientProfileKeepLines').checked=true;$('clientRemove').disabled=true;
    managerMessage('clientMessage','Champs récupérés. Choisis un nom de profil puis enregistre.');
  }
  function saveClient(){
    const profile=clientFormValues();
    if(!profile.profile||!profile.client){managerMessage('clientMessage','Le nom du profil et le destinataire sont obligatoires.',true);return}
    for(const key of ['rateWith','rateWithout','rateCustom'])if(profile[key]!==''&&(!Number.isFinite(Number(profile[key]))||Number(profile[key])<0||Number(profile[key])>1000000)){managerMessage('clientMessage','Le tarif doit être un nombre positif ou un champ vide.',true);return}
    const existing=clients.find(x=>x.id===selectedClientId),entry={...profile,id:existing?.id||uid(),updatedAt:isoNow()};
    const next=existing?clients.map(x=>x.id===existing.id?entry:x):[...clients,entry];
    if(!persist(clientKey,next))return;
    clients=next;selectedClientId=entry.id;renderClientSelector();timeClientOptions($('timeClient'));timeClientOptions($('timeFilterClient'),true);renderAutomation();managerMessage('clientMessage','Profil client enregistré sur cet appareil.');
  }
  function useClient(){
    const p=clientFormValues();if(!p.client){managerMessage('clientMessage','Renseigne d’abord le nom du destinataire.',true);return}
    const current=data();for(const key of ['client','clientAddress','project','validator','projectCode','terms','tax'])current[key]=p[key];
    if(p.defaultLines?.length)current.lines=clone(p.defaultLines);
    assignPreset(current);setArea('editor');updateActiveNotice();
  }
  function renderTemplates(){
    renderCounters();const host=$('templateList');host.textContent='';
    const builtins=[['sejer','Profs en ligne · SEJER'],['private','Cours particuliers'],['blank','Personnalisé']];
    for(const [id,name] of builtins)appendRecord(host,{title:name,subtitle:'Modèle inclus · disponible en permanence',actions:[['Utiliser',()=>{newDraft(id)}]]});
    for(const t of templates)appendRecord(host,{title:t.name,subtitle:'Mon modèle · '+(t.updatedAt?new Date(t.updatedAt).toLocaleDateString('fr-FR'):'enregistré'),actions:[['Utiliser',()=>newDraft('custom:'+t.id)],['Supprimer',()=>{
      if(!confirm(`Supprimer le modèle « ${t.name} » ?`))return;
      const next=templates.filter(x=>x.id!==t.id);if(persist(templateKey,next)){templates=next;refreshPresetOptions();renderTemplates()}
    },'danger']]});
  }
  function saveTemplate(label=null){
    const name=String(label===null?$('templateName').value:label||'').trim();
    if(!name){managerMessage('templateMessage','Indique un nom pour le modèle.',true);return false}
    const existing=templates.find(x=>x.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr'));
    if(existing&&!confirm(`Remplacer le modèle « ${name} » par la facture actuelle ?`))return false;
    const content=data();for(const key of ['number','date','period','due'])delete content[key];
    const record={id:existing?.id||uid(),name,content,updatedAt:isoNow()};
    const next=existing?templates.map(x=>x.id===existing.id?record:x):[...templates,record];
    if(!persist(templateKey,next))return false;
    templates=next;$('templateName').value='';refreshPresetOptions();renderTemplates();managerMessage('templateMessage','Modèle enregistré : '+name);return true;
  }
  function appendRecord(host,{title,subtitle,actions=[],status=null}){
    const card=document.createElement('article');card.className='record-card';
    const summary=document.createElement('div');summary.className='record-summary';
    const name=document.createElement('strong');name.textContent=title;
    const desc=document.createElement('small');desc.textContent=subtitle;summary.append(name,desc);
    const tools=document.createElement('div');tools.className='record-actions';
    for(const [name,fn,style] of actions){const b=document.createElement('button');b.type='button';b.textContent=name;b.className=style==='danger'?'danger':'secondary';b.addEventListener('click',fn);tools.append(b)}
    if(status)tools.append(status);
    card.append(summary,tools);host.append(card);
  }
  // V52 · Filtres et classement : les enregistrements originaux restent immuables.
  function archiveInvoiceYear(i){return /^\d{4}-\d{2}-\d{2}$/.test(String(i.payload?.date||''))?i.payload.date.slice(0,4):'Sans date'}
  function archiveInvoiceClient(i){return String(i.payload?.client||'').trim()||'Client non renseigné'}
  function archiveYearOptions(){
    const years=[...new Set([...invoices.filter(i=>i.status!=='draft').map(archiveInvoiceYear),...credits.map(c=>String(c.date||'').slice(0,4))].filter(y=>/^\d{4}$/.test(y)))].sort((a,b)=>b.localeCompare(a));
    const field=$('archiveYear'),original=field.value;field.replaceChildren(new Option('Choisir une année',''));
    for(const year of years)field.add(new Option(year,year));
    field.value=years.includes(original)?original:(years.includes(String(today.getFullYear()))?String(today.getFullYear()):years[0]||'');
    const filter=$('historyYear'),selected=filter.value;
    filter.replaceChildren(new Option('Toutes les années',''));
    for(const year of years)filter.add(new Option(year,year));
    if(invoices.some(i=>archiveInvoiceYear(i)==='Sans date'))filter.add(new Option('Date manquante','Sans date'));
    filter.value=[...filter.options].some(o=>o.value===selected)?selected:'';
    const client=$('historyClient'),chosen=client.value;
    client.replaceChildren(new Option('Tous les clients',''));
    for(const name of [...new Set(invoices.map(archiveInvoiceClient))].sort((a,b)=>a.localeCompare(b,'fr')))client.add(new Option(name,name));
    client.value=[...client.options].some(o=>o.value===chosen)?chosen:'';
  }
  function archiveChecksFor(i){
    const f=i.payload||{},issues=[];
    if(!String(f.number||'').trim())issues.push('Référence de facture manquante');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(f.date||'')))issues.push('Date d’émission à contrôler');
    if(!String(f.issuer||'').trim())issues.push('Nom de l’émetteur manquant');
    if(!/^\d{14}$/.test(String(f.siret||'').replace(/\s/g,'')))issues.push('SIRET à vérifier (14 chiffres)');
    if(!String(f.address||'').trim())issues.push('Adresse de l’émetteur absente');
    if(!String(f.client||'').trim())issues.push('Nom du destinataire manquant');
    if(!String(f.clientAddress||'').trim())issues.push('Adresse du destinataire absente');
    if(!Array.isArray(f.lines)||!f.lines.length||f.lines.some(l=>!String(l.name||'').trim()||!(Number(l.quantity)>=0)||!(Number(l.price)>=0)))issues.push('Prestations, quantités et tarifs à vérifier');
    if(!String(f.terms||'').trim())issues.push('Conditions de règlement absentes');
    if(!String(f.tax||'').trim())issues.push('Mention fiscale à vérifier');
    if(invoices.some(x=>x.id!==i.id&&x.status!=='draft'&&String(x.payload?.number||'').trim().toUpperCase()===String(f.number||'').trim().toUpperCase()))issues.push('Référence en doublon dans les factures émises');
    return issues;
  }
  function archiveRelevant(){const year=$('archiveYear').value;return invoices.filter(i=>i.status!=='draft'&&archiveInvoiceYear(i)===year)}
  function archiveReport(){
    const year=$('archiveYear').value,list=archiveRelevant(),invIds=new Set(list.map(i=>i.id));
    const relatedCredits=credits.filter(c=>String(c.date||'').startsWith(year+'-')||invIds.has(c.invoiceId));
    const warnings=list.flatMap(i=>archiveChecksFor(i).map(w=>({ref:i.payload?.number||'Sans numéro',message:w})));
    for(const credit of relatedCredits){if(!credit.payload||!credit.number||!/^\d{4}-\d{2}-\d{2}$/.test(credit.date||''))warnings.push({ref:credit.number||'Avoir',message:'Avoir : référence, date ou document à vérifier'});if(!invoices.some(i=>i.id===credit.invoiceId))warnings.push({ref:credit.number||'Avoir',message:'Facture d’origine introuvable dans l’historique'});}
    return {year,list,relatedCredits,warnings};
  }
  function renderAnnualArchive(){
    const report=archiveReport(),{year,list,relatedCredits,warnings}=report;
    const totalGross=list.reduce((s,i)=>s+invoiceCents(i),0);
    const inYearCredits=relatedCredits.filter(c=>String(c.date||'').startsWith(year+'-')).length;
    $('archiveYearSummary').textContent=year?`${year} · ${list.length} facture(s) émise(s) · ${inYearCredits} avoir(s) émis cette année${relatedCredits.length>inYearCredits?' · '+(relatedCredits.length-inYearCredits)+' avoir(s) liés émis hors période':''} · ${euroCents(totalGross)} brut facturé · ${warnings.length} point(s) à vérifier.`:'Aucun document annuel disponible.';
    const alerts=$('archiveAlerts');alerts.replaceChildren();
    if(!warnings.length){const p=document.createElement('p');p.className='archive-alert-item is-ok';p.textContent=list.length?'Aucune anomalie détectée par les vérifications de base. Vérifie néanmoins les obligations applicables avant transmission.':'Aucun document à vérifier.';alerts.append(p)}
    else{
      for(const w of warnings.slice(0,12)){const p=document.createElement('p');p.className='archive-alert-item';p.textContent=`${w.ref} · ${w.message}`;alerts.append(p)}
      if(warnings.length>12){const p=document.createElement('p');p.className='archive-alert-item';p.textContent=`${warnings.length-12} autre(s) point(s) dans le dossier de contrôle CSV.`;alerts.append(p)}
    }
    $('archiveExport').disabled=!(list.length||relatedCredits.length)||officeConflict;
  }
  function renderHistory(){
    renderCounters();archiveYearOptions();const host=$('historyList');host.replaceChildren();
    const search=($('historySearch').value||'').toLocaleLowerCase('fr').trim(),status=$('historyStatus').value,year=$('historyYear').value,client=$('historyClient').value;
    const list=invoices.filter(x=>(!status||x.status===status)&&(!year||archiveInvoiceYear(x)===year)&&(!client||archiveInvoiceClient(x)===client)&&(!search||[x.payload?.number,x.payload?.client,x.payload?.period,x.payload?.date,x.payload?.validator,x.payload?.project,x.payload?.projectCode,...(x.payload?.lines||[]).map(l=>l.name)].join(' ').toLocaleLowerCase('fr').includes(search))).sort((a,b)=>String(b.payload?.date||'').localeCompare(String(a.payload?.date||''))||String(b.updatedAt||'').localeCompare(a.updatedAt||''));
    const gross=invoices.filter(i=>i.status!=='draft').reduce((s,i)=>s+textTotal(i.payload),0);
    const creditsSum=credits.reduce((s,c)=>s+c.cents/100,0);
    const paid=invoices.filter(i=>i.status!=='draft').reduce((s,i)=>s+getInvoiceBalance(i).paid,0);
    $('historyStats').innerHTML=`<div class="history-stat"><small>Factures</small><strong>${invoices.length}</strong></div><div class="history-stat"><small>Facturé brut</small><strong>${money(gross)}</strong></div><div class="history-stat"><small>Réglé (dates parfois inconnues)</small><strong>${money(paid)}</strong></div><div class="history-stat"><small>Avoirs émis</small><strong>${money(creditsSum)}</strong></div>`;
    $('historyFilteredCount').textContent=`${list.length} facture(s) affichée(s) sur ${invoices.length} · Groupées par année et par client`;
    const groups=new Map();for(const entry of list){const y=archiveInvoiceYear(entry),c=archiveInvoiceClient(entry),key=y+'\0'+c;if(!groups.has(key))groups.set(key,{y,c,list:[]});groups.get(key).list.push(entry)}
    for(const group of groups.values()){
      const fold=document.createElement('details');fold.className='archive-group';fold.open=true;
      const summary=document.createElement('summary');const text=document.createElement('div');const title=document.createElement('strong');title.textContent=group.y+' · '+group.c;
      const count=document.createElement('small');count.textContent=`${group.list.length} facture(s) · ${money(group.list.filter(i=>i.status!=='draft').reduce((s,i)=>s+textTotal(i.payload),0))} brut émis`;
      text.append(title,count);summary.append(text);fold.append(summary);
      const body=document.createElement('div');body.className='archive-group-body';fold.append(body);host.append(fold);
      for(const entry of group.list){
        const d=entry.payload||{};
        const select=document.createElement('select');select.setAttribute('aria-label','État de la facture '+d.number);
        for(const [key,label] of Object.entries(statusLabels))select.add(new Option(label,key));select.value=entry.status;
        select.addEventListener('change',()=>{
          const requested=select.value;select.value=entry.status;
          if(entry.status!=='draft'&&requested==='draft'){alert('Une facture déjà émise ne peut pas redevenir un brouillon.');return}
          if(requested==='paid'){openPaymentDialog(entry.id);return}
          if(entry.status==='paid'&&hasSettledBalance(entry)&&!isUndatedLegacyPaid(entry)){alert('Cette facture possède des règlements couvrant le total. Supprime les règlements erronés avant de modifier son état.');return}
          if(isUndatedLegacyPaid(entry)&&!confirm('Cette ancienne facture est marquée payée sans date de règlement. La passer dans un autre état signifie qu’elle sera de nouveau considérée comme non réglée. Continuer ?'))return;
          const next=invoices.map(x=>x.id===entry.id?{...x,status:requested,updatedAt:isoNow()}:x);
          if(persist(historyKey,next)){invoices=next;renderHistory();renderDashboard();renderCollection();renderCredits();updateActiveNotice()}
        });
        const actions=[['Ouvrir',()=>openHistory(entry.id)],['Dupliquer',()=>duplicateHistory(entry.id)]];
        if(entry.status!=='draft'){actions.push([isUndatedLegacyPaid(entry)?'Dater le paiement':paymentSum(entry)>0?'Règlements':'Encaisser',()=>openPaymentDialog(entry.id)]);actions.push(['Suivi / relance',()=>openCollectionDialog(entry.id)]);if(availableCreditCents(entry)>0)actions.push(['Créer un avoir',()=>openCreditDialog(entry.id)]);}
        const receipt=getInvoiceBalance(entry);
        if(entry.status==='draft')actions.push(['Supprimer',()=>{
          if(!confirm(`Supprimer le brouillon ${d.number} ? Cette action est définitive.`))return;
          const next=invoices.filter(x=>x.id!==entry.id);if(!persist(historyKey,next))return;
          invoices=next;if(activeInvoiceId===entry.id){activeInvoiceId=null;activeSignature='';autoNumber=false}renderHistory();updateActiveNotice();
        },'danger']);
        const warnings=entry.status==='draft'?[]:archiveChecksFor(entry);
        appendRecord(body,{title:d.number||'Sans référence',subtitle:`${d.client||'Destinataire non renseigné'} · ${d.date||''} · ${money(textTotal(d))}`+(entry.status!=='draft'?` · Reçu ${money(receipt.paid)}${receipt.legacy?' (date inconnue)':''}${creditCents(entry.id)?' · Avoirs '+euroCents(creditCents(entry.id)):''} · Reste ${money(receipt.balance)}`:'')+(warnings.length?` · ⚠ ${warnings.length} vérification(s)`:''),actions,status:select});
      }
    }
    if(!list.length){const empty=document.createElement('div');empty.className='record-empty';empty.textContent=invoices.length?'Aucune facture ne correspond à ces filtres.':'Aucune facture enregistrée sur cet appareil. Crée ta première facture depuis l’éditeur.';host.append(empty)}
    renderAnnualArchive();
  }
  // ZIP de documents : aucune dépendance extérieure. Stockage sans compression, CRC-32 contrôlable par tout lecteur ZIP.
  async function archiveZip(entries){
    const chunks=[],central=[];let offset=0,bytesTotal=0;
    const u16=v=>[v&255,(v>>>8)&255],u32=v=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
    const dt=new Date(),dosDate=((Math.max(1980,dt.getFullYear())-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate(),dosTime=(dt.getHours()<<11)|(dt.getMinutes()<<5)|(dt.getSeconds()>>1);
    if(entries.length>5000)throw Error('Dossier trop volumineux : plus de 5 000 fichiers.');
    for(const [name,value] of entries){
      if(!name||name.includes('..')||name.startsWith('/'))throw Error('Nom de fichier incorrect.');
      const n=enc(name),b=value instanceof Blob?new Uint8Array(await value.arrayBuffer()):typeof value==='string'?enc(value):value;
      if(!(b instanceof Uint8Array))throw Error('Contenu de fichier invalide.');
      bytesTotal+=b.length;if(bytesTotal>200*1024*1024)throw Error('Dossier supérieur à 200 Mo : exporter séparément les documents.');
      const len=b.length,crc=crc32(b);
      const local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(dosTime),...u16(dosDate),...u32(crc),...u32(len),...u32(len),...u16(n.length),...u16(0),...n]);
      chunks.push(local,b);
      const header=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(dosTime),...u16(dosDate),...u32(crc),...u32(len),...u32(len),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...n]);
      central.push(header);offset+=local.length+len;
      if(offset>=0xffffffff)throw Error('Dossier trop volumineux pour le format ZIP classique.');
    }
    const size=central.reduce((s,x)=>s+x.length,0),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(size),...u32(offset),...u16(0)]);
    return new Blob([...chunks,...central,end],{type:'application/zip'});
  }
  const archiveSlug=s=>String(s||'inconnu').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,55)||'inconnu';
  const archiveCsv=(headers,rows)=>'\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
  async function exportAnnualArchive(){
    const year=$('archiveYear').value,button=$('archiveExport');if(!/^\d{4}$/.test(year)||officeConflict)return;
    const {list,relatedCredits,warnings}=archiveReport();if(!list.length&&!relatedCredits.length)return;
    const docs=list.length+relatedCredits.length;
    if(docs>400){managerMessage('archiveMessage','Plus de 400 documents : exporte tes années séparément ou utilise les exports individuels.',true);return}
    if(!confirm(`Exporter ${list.length} factures et ${relatedCredits.length} avoirs de l’archive ${year} ?\n\nCe ZIP ne sera PAS chiffré et contiendra des coordonnées personnelles. Conserve-le dans un emplacement privé.`))return;
    button.disabled=true;managerMessage('archiveMessage','Préparation des documents en cours…');
    try{
      const stem='Philosophal-'+year+'/',entries=[],includeWord=$('archiveIncludeWord').checked;
      const names=[...new Set([...list.map(archiveInvoiceClient),...relatedCredits.map(c=>archiveInvoiceClient(invoices.find(i=>i.id===c.invoiceId)||{payload:c.payload}))])].sort((a,b)=>a.localeCompare(b,'fr'));
      const clientFolder=new Map(names.map((name,i)=>[name,String(i+1).padStart(2,'0')+'-'+archiveSlug(name)]));
      const pdf=window.PhilosophalInvoicePDF?.create;if(typeof pdf!=='function')throw Error('Moteur PDF introuvable.');
      const clientPath=name=>stem+'Clients/'+clientFolder.get(name)+'/';
      const rows=[],paymentRows=[],creditRows=[];
      for(let i=0;i<list.length;i++){
        const invoice=list[i],f=invoice.payload,folder=clientPath(archiveInvoiceClient(invoice))+'Factures/';
        const base='Facture-'+archiveSlug(f.number)+'-'+String(i+1).padStart(4,'0');
        entries.push([folder+base+'.pdf',pdf(f,detailParts)]);
        if(includeWord)entries.push([folder+base+'.docx',exportWord(f,false)]);
        const balance=getInvoiceBalance(invoice);
        rows.push([f.number,f.date,f.period,f.client,invoice.status,(invoiceCents(invoice)/100).toFixed(2).replace('.',','),(creditCents(invoice.id)/100).toFixed(2).replace('.',','),balance.paid.toFixed(2).replace('.',','),balance.balance.toFixed(2).replace('.',','),archiveChecksFor(invoice).length]);
        for(const p of invoice.payments||[])paymentRows.push([f.number,f.date,f.client,p.date||'',(Number(p.cents||0)/100).toFixed(2).replace('.',','),paymentMethods[p.method]||p.method||'',p.note||'']);
        if(i%5===0){managerMessage('archiveMessage',`Factures générées : ${i+1}/${list.length}…`);await new Promise(r=>setTimeout(r,0))}
      }
      for(const [creditIndex,c] of relatedCredits.entries()){
        const original=invoices.find(i=>i.id===c.invoiceId),name=archiveInvoiceClient(original||{payload:c.payload}),folder=clientPath(name)+(String(c.date||'').startsWith(year+'-')?'Avoirs/':'Avoirs-lies-hors-annee/');
        if(!c.payload||!Array.isArray(c.payload.lines))throw Error('Avoir sans document exportable : '+c.number);
        const base='Avoir-'+archiveSlug(c.number)+'-'+String(creditIndex+1).padStart(4,'0');
        entries.push([folder+base+'.pdf',pdf(c.payload,detailParts)]);
        if(includeWord)entries.push([folder+base+'.docx',exportWord(c.payload,false)]);
        creditRows.push([c.number,c.date,original?.payload?.number||'Introuvable',c.payload.client,c.reason,(Number(c.cents||0)/100).toFixed(2).replace('.',','),String(c.date||'').startsWith(year+'-')?'Émis dans l’année':'Lié, émis hors année']);
      }
      entries.push([stem+'Tableaux/Factures.csv',archiveCsv(['Référence','Date facture','Période','Client','État','Montant brut HT (EUR)','Avoirs liés (EUR)','Encaissements enregistrés (EUR)','Reste dû (EUR)','Points à contrôler'],rows)]);
      entries.push([stem+'Tableaux/Avoirs.csv',archiveCsv(['Référence avoir','Date émission','Facture d’origine','Client','Motif','Montant (EUR)','Périmètre'],creditRows)]);
      entries.push([stem+'Tableaux/Reglements.csv',archiveCsv(['Facture','Date facture','Client','Date paiement','Montant (EUR)','Mode','Note'],paymentRows)]);
      entries.push([stem+'Tableaux/Controles.csv',archiveCsv(['Facture','Point à vérifier'],warnings.map(w=>[w.ref,w.message]))]);
      entries.push([stem+'Archive.json',JSON.stringify({format:'philosophal-archives-v52',year,exportedAt:isoNow(),scope:'Factures émises durant l’année ; avoirs émis durant l’année quelle que soit la date de facture, ainsi que les avoirs liés aux factures de l’année même si émis ultérieurement ; règlements liés aux factures de l’année quelle que soit leur date.',invoices:list,credits:relatedCredits},null,2)]);
      entries.push([stem+'A_LIRE.txt',`Archive Philosophal ${year}\n\nFactures : ${list.length}\nAvoirs liés : ${relatedCredits.length}\n\nDocuments classés par client dans Clients/. Les avoirs émis en ${year} sont inclus même lorsqu’ils concernent une facture d’une autre année. Les avoirs liés aux factures ${year} émis ultérieurement figurent dans Avoirs-lies-hors-annee/. Les règlements sont associés aux factures et peuvent dater d’une autre année. Les tableaux CSV sont des récapitulatifs de suivi. Les données originales sont conservées dans Archive.json.\n\nCe ZIP n’est pas chiffré et ne remplace pas la sauvegarde chiffrée de l’outil. Les fichiers PDF sont reconstruits à partir des données de l’historique, et non des PDF originaux signés ou transmis. Les vérifications ne valent pas attestation de conformité fiscale.\n`]);
      managerMessage('archiveMessage','Assemblage et vérification du ZIP…');
      const blob=await archiveZip(entries);download(blob,'Philosophal-Dossier-'+year+'.zip');
      managerMessage('archiveMessage',`Dossier ${year} téléchargé · ${list.length} facture(s), ${relatedCredits.length} avoir(s), ${entries.length} fichiers. Archive non chiffrée.`);
    }catch(error){console.error('Export annuel impossible',error);managerMessage('archiveMessage','Export impossible : '+(error?.message||'erreur inconnue'),true)}
    finally{button.disabled=false}
  }
  function initAnnualArchive(){
    for(const id of ['historyYear','historyClient','archiveYear'])$(id).addEventListener('change',id==='archiveYear'?renderAnnualArchive:renderHistory);
    $('archiveExport').addEventListener('click',exportAnnualArchive);
  }
  function openHistory(id){
    const entry=invoices.find(x=>x.id===id);if(!entry)return;
    activeInvoiceId=id;autoNumber=false;currentPreset=entry.preset||'sejer';timeSource=validTimeSource(entry.timeSource)?clone(entry.timeSource):null;
    if([...$('preset').options].some(x=>x.value===currentPreset))$('preset').value=currentPreset;
    assignPreset(entry.payload);activeSignature=signature(data());setArea('editor');updateActiveNotice();
    managerMessage('historyMessage','Facture ouverte. Pour émettre une nouvelle facture avec ces mêmes informations, utilise « Dupliquer ».');
  }
  function duplicateHistory(id){
    const entry=invoices.find(x=>x.id===id);if(!entry)return;
    const cloned=clone(entry.payload);const t=iso(new Date());cloned.period=t.slice(0,7);cloned.date=t;cloned.due=plusDays(t,30);
    cloned.number=nextNumber(t);activeInvoiceId=null;activeSignature='';autoNumber=true;timeSource=null;
    currentPreset=entry.preset||'sejer';if([...$('preset').options].some(x=>x.value===currentPreset))$('preset').value=currentPreset;
    assignPreset(cloned);setArea('editor');showMessage('Facture dupliquée. La référence est nouvelle ; vérifie le mois et les heures.');updateActiveNotice();
  }
  function checkDuplicateNumber(){
    const number=$('number').value.trim().toUpperCase();return invoices.find(x=>String(x.payload?.number||'').trim().toUpperCase()===number&&x.id!==activeInvoiceId);
  }
  function checkInvoice({exported=false}={}){
    if(!canExport())return false;
    if(!$('number').value.trim()||!/^\d{4}-\d{2}-\d{2}$/.test($('date').value)){
      alert('Une référence et une date de facture valides sont nécessaires.');return false;
    }
    if(checkDuplicateNumber()){
      alert('Cette référence existe déjà dans l’historique. Utilise une référence unique ou duplique la facture depuis l’historique.');return false;
    }
    const current=invoices.find(x=>x.id===activeInvoiceId);
    if(current&&current.status!=='draft'&&signature(data())!==signature(current.payload)){
      alert('Cette facture est déjà émise : son contenu archivé ne doit pas être remplacé. Ouvre l’historique et clique sur « Dupliquer » pour créer un nouveau document.');return false;
    }
    if(exported&&(!$('client').value.trim()||!$('issuer').value.trim()||!lines.length)){
      alert('Avant l’export, renseigne le destinataire, l’émetteur et au moins une prestation.');return false;
    }
    return true;
  }
  function saveArchive({exported=false,checked=false}={}){
    if(!checked&&!checkInvoice({exported}))return false;
    const content=data();const existing=invoices.find(x=>x.id===activeInvoiceId);
    const stamp=isoNow();
    if(existing&&existing.status!=='draft'){
      if(signature(content)!==signature(existing.payload))return false;
      updateActiveNotice();return true; // Une facture émise n'est jamais modifiée silencieusement.
    }
    const linked=verifiedTimeSource();
    if(exported&&timeSource&&!linked){alert('Les prestations de la facture générée ont été modifiées depuis le registre. La facture sera exportée, mais les heures ne seront pas marquées comme facturées. Vérifie la correspondance dans le registre.');}
    const record={id:existing?.id||uid(),createdAt:existing?.createdAt||stamp,updatedAt:stamp,
      status:exported?'issued':'draft',exportedAt:exported?stamp:null,preset:currentPreset,payload:clone(content),payments:existing?.payments||[],timeEntryIds:linked?.ids||[],timeSource:linked?clone(timeSource):null};
    const next=existing?invoices.map(x=>x.id===existing.id?record:x):[record,...invoices];
    if(!persist(historyKey,next))return false;
    invoices=next;activeInvoiceId=record.id;activeSignature=signature(content);autoNumber=false;
    updateCounter(content.number);renderHistory();renderDashboard();renderTime();renderCollection();renderCredits();renderCounters();updateActiveNotice();showLast();return true;
  }
  function autoNumberOnDateChange(){if(autoNumber){$('number').value=nextNumber($('date').value)}updateActiveNotice()}

  // V44 · Reprise automatique du brouillon en cours (sans modifier les factures émises).
  const autoDraftKey='philosophal-invoice-working-draft-v44';
  const backupFormat='philosophal-invoices-backup-v44'; // conserve la compatibilité avec les anciennes sauvegardes
  let autoSaveEnabled=false,autoSaveTimer=null,autoSaveFailed=false,lastAutoSignature='';
  function autoState(message,error=false){const el=$('draftSaveState');if(!el)return;el.textContent=message;el.classList.toggle('is-error',error)}
  function autoPayload(){return {savedAt:isoNow(),payload:data(),preset:currentPreset,activeInvoiceId,autoNumber,view:!$('advancedPanel').hidden?'advanced':'express',timeSource:clone(timeSource)}}
  function commitAutoSave(){
    if(!autoSaveEnabled)return;
    clearTimeout(autoSaveTimer);autoSaveTimer=null;
    const snapshot=autoPayload(),sig=signature({...snapshot,savedAt:null});
    if(sig===lastAutoSignature && !autoSaveFailed)return;
    try{secureStore.setItem(autoDraftKey,JSON.stringify(snapshot));lastAutoSignature=sig;autoSaveFailed=false;autoState('Brouillon sauvegardé automatiquement · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}));officeSaveStatus(vaultCache?'Chiffrement en cours…':'Brouillon enregistré · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}))}
    catch(error){autoSaveFailed=true;autoState('Sauvegarde automatique impossible : espace du navigateur indisponible.',true);officeSaveStatus('Enregistrement impossible',true)}
  }
  function queueAutoSave(){if(!autoSaveEnabled)return;autoState('Enregistrement en cours…');clearTimeout(autoSaveTimer);autoSaveTimer=setTimeout(commitAutoSave,550)}
  function restoreAutoDraft(){
    const saved=readStore(autoDraftKey,null);
    if(!saved||saved.format||!saved.payload||!Array.isArray(saved.payload.lines))return false;
    try{
      if(saved.payload.lines.length>250)return false;
      const known=invoices.find(i=>i.id===saved.activeInvoiceId);
      activeInvoiceId=known?.id||null;
      timeSource=validTimeSource(saved.timeSource)?saved.timeSource:null;
      activeSignature=known?signature(known.payload):'';
      autoNumber=Boolean(saved.autoNumber);
      const proposed=saved.preset||'sejer';currentPreset=proposed;
      if([...$('preset').options].some(o=>o.value===proposed))$('preset').value=proposed;
      assignPreset(saved.payload);
      mode(saved.view==='advanced'?'advanced':'express');
      autoState('Brouillon retrouvé automatiquement · '+new Date(saved.savedAt).toLocaleString('fr-FR'));
      return true;
    }catch(error){console.warn('Brouillon non récupéré',error);return false}
  }
  function goEditFromPreview(event){
    const target=event.target.closest('[data-edit-field],[data-edit-style],[data-edit-line]');
    if(!target)return;
    setArea('editor');mode('advanced');
    let node=null;
    if(target.dataset.editLine!==undefined){node=$('lines').children[Number(target.dataset.editLine)]?.querySelector('[data-f="name"]')}
    else{const name=target.dataset.editStyle||target.dataset.editField;
      node=$(name);
      if(node?.closest('details'))node.closest('details').open=true;
    }
    if(node){node.scrollIntoView({block:'center',behavior:'smooth'});node.focus({preventScroll:true});node.classList.add('edit-highlight');setTimeout(()=>node.classList.remove('edit-highlight'),1600)}
  }
  function decodeBase64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
  function encodeBase64(bytes){let out='';for(let i=0;i<bytes.length;i+=8192)out+=String.fromCharCode(...bytes.slice(i,i+8192));return btoa(out)}
  function backupStatus(msg,bad=false){const el=$('backupMessage');el.textContent=msg;el.classList.toggle('is-warning',bad);el.classList.toggle('is-success',!bad)}
  function backupData(){commitAutoSave();return {format:backupFormat,appVersion:52,createdAt:isoNow(),credits:clone(credits),timeEntries:clone(timeEntries),clients:clone(clients),templates:clone(templates),invoices:clone(invoices),numberCounters:clone(numberCounters),automationRules:clone(automationRules),monthClosures:clone(monthClosures),workingDraft:autoPayload()}}
  async function encryptData(snapshot,password){
    if(!crypto?.subtle)throw new Error('La sauvegarde chiffrée nécessite HTTPS ou localhost.');
    const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},keyMaterial,{name:'AES-GCM',length:256},false,['encrypt']);
    const bytes=encoder.encode(JSON.stringify(snapshot));
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(backupFormat)},key,bytes);
    return {format:backupFormat,encrypted:true,kdf:'PBKDF2-SHA256',iterations:250000,salt:encodeBase64(salt),iv:encodeBase64(iv),data:encodeBase64(new Uint8Array(encrypted))};
  }
  async function decryptData(wrapper,password){
    if(!crypto?.subtle)throw new Error('Le déchiffrement nécessite HTTPS ou localhost.');
    if(wrapper.kdf!=='PBKDF2-SHA256'||wrapper.iterations!==250000)throw new Error('Format de chiffrement non reconnu.');
    try{
      const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decodeBase64(wrapper.salt),iterations:wrapper.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
      const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:decodeBase64(wrapper.iv),additionalData:encoder.encode(backupFormat)},key,decodeBase64(wrapper.data));
      return JSON.parse(new TextDecoder().decode(clear));
    }catch(error){throw new Error('Mot de passe incorrect ou fichier endommagé.')}
  }
  function validateBackup(snapshot){
    if(!snapshot||snapshot.format!==backupFormat||!Array.isArray(snapshot.clients)||!Array.isArray(snapshot.templates)||!Array.isArray(snapshot.invoices)||!snapshot.numberCounters||typeof snapshot.numberCounters!=='object'||Array.isArray(snapshot.numberCounters))throw new Error('Ce fichier ne contient pas une sauvegarde de facturation V44 valide.');
    if(snapshot.clients.length>10000||snapshot.templates.length>10000||snapshot.invoices.length>10000)throw new Error('Cette sauvegarde contient trop d’enregistrements.');
    const saneString=x=>typeof x==='string'&&x.length<=25000;
    if(!snapshot.clients.every(x=>x&&saneString(x.id)&&saneString(x.profile)) ||
      !snapshot.templates.every(x=>x&&saneString(x.id)&&saneString(x.name)&&x.content&&Array.isArray(x.content.lines)) ||
      !snapshot.invoices.every(x=>x&&saneString(x.id)&&['draft','issued','sent','paid'].includes(x.status)&&x.payload&&saneString(x.payload.number)&&Array.isArray(x.payload.lines)&&x.payload.lines.length<=250))
      throw new Error('Des données de la sauvegarde ne sont pas valides.');
    if(!snapshot.invoices.every(x=>!('payments' in x)||Array.isArray(x.payments)&&x.payments.length<=2000&&x.payments.every(p=>p&&typeof p.id==='string'&&p.id.length<200&&/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&Number.isSafeInteger(p.cents)&&p.cents>0&&p.cents<1e12&&typeof p.method==='string'&&p.method.length<60&&typeof(p.note||'')==='string'&&String(p.note||'').length<2000)))throw new Error('Les règlements contenus dans cette sauvegarde ne sont pas valides.');
    if(snapshot.workingDraft&&(!snapshot.workingDraft.payload||!Array.isArray(snapshot.workingDraft.payload.lines)))throw new Error('Le brouillon sauvegardé est invalide.');
    if(snapshot.credits!==undefined&&(!Array.isArray(snapshot.credits)||snapshot.credits.length>10000||!snapshot.credits.every(validCredit)))throw new Error('Les avoirs contenus dans cette sauvegarde sont invalides.');
    if(snapshot.invoices.some(x=>x.collection!==undefined&&!validCollection(x.collection)))throw new Error('Une information de suivi des règlements est invalide.');
    if(snapshot.timeEntries!==undefined && (!Array.isArray(snapshot.timeEntries)||snapshot.timeEntries.length>30000||!snapshot.timeEntries.every(validTimeEntry)))throw new Error('Les heures de cette sauvegarde ne sont pas valides.');
    if(snapshot.automationRules!==undefined&&(!Array.isArray(snapshot.automationRules)||snapshot.automationRules.length>1000||!snapshot.automationRules.every(validAutomationRule)))throw new Error('Les règles récurrentes de la sauvegarde sont invalides.');
    if(snapshot.monthClosures!==undefined&&(!Array.isArray(snapshot.monthClosures)||snapshot.monthClosures.length>1000||!snapshot.monthClosures.every(validMonthClosure)))throw new Error('Les clôtures mensuelles de la sauvegarde sont invalides.');
    return snapshot;
  }
  async function readCheckedBackup(){
    const file=$('backupFile').files?.[0],pass=$('backupPassword').value;
    if(!file)throw Error('Choisis un fichier .philosophal.');
    if(file.size>12*1024*1024)throw Error('Le fichier dépasse 12 Mo.');
    if(!pass)throw Error('Saisis la phrase secrète de cette sauvegarde.');
    let wrapper;try{wrapper=JSON.parse(await file.text())}catch{throw Error('Fichier illisible : ce n’est pas une sauvegarde JSON valide.');}
    if(wrapper.format!==backupFormat||wrapper.encrypted!==true)throw Error('Format inconnu ou sauvegarde non chiffrée.');
    const data=validateBackup(await decryptData(wrapper,pass));
    return data;
  }
  function backupPreview(snapshot){
    const node=$('backupCheckSummary');
    const date=snapshot.createdAt&&Number.isFinite(new Date(snapshot.createdAt).getTime())?new Date(snapshot.createdAt).toLocaleString('fr-FR'):'date non précisée';
    const types=[['factures',snapshot.invoices],['clients',snapshot.clients],['modèles',snapshot.templates],['heures',snapshot.timeEntries],['avoirs',snapshot.credits],['règles',snapshot.automationRules]];
    node.replaceChildren();
    const label=document.createElement('strong');label.textContent='Fichier vérifié et déchiffré avec succès';
    const info=document.createElement('span');info.textContent='Sauvegarde du '+date+' · '+types.map(([name,items])=>(items||[]).length+' '+name).join(' · ')+'. Aucun changement n’a été apporté aux données locales.';
    node.append(label,info);node.hidden=false;
  }
  async function checkBackup(){
    const button=$('backupCheck');button.disabled=true;$('backupCheckSummary').hidden=true;
    backupStatus('Vérification du chiffrement et du contenu…');
    try{const snapshot=await readCheckedBackup();backupPreview(snapshot);backupStatus('Fichier vérifié. Pour fusionner ou remplacer tes données, utilise ensuite « Importer ».');}
    catch(error){backupStatus('Vérification impossible : '+error.message,true)}
    finally{button.disabled=false}
  }
  async function exportBackup(){
    const btn=$('backupExport'),pass=$('backupPassword').value,confirmPass=$('backupConfirm').value;
    if(pass.length<10){backupStatus('Choisis un mot de passe de sauvegarde d’au moins 10 caractères.',true);$('backupPassword').focus();return}
    if(pass!==confirmPass){backupStatus('Les deux mots de passe ne correspondent pas.',true);$('backupConfirm').focus();return}
    btn.disabled=true;backupStatus('Préparation de la sauvegarde chiffrée…');
    try{
      const snapshot=backupData();
      const wrapper=await encryptData(snapshot,pass);
      const verified=validateBackup(await decryptData(wrapper,pass));
      if(signature(verified)!==signature(snapshot))throw Error('Vérification après chiffrement échouée.');
      download(new Blob([JSON.stringify(wrapper)],{type:'application/json'}),'Philosophal-factures-'+iso(new Date())+'.philosophal');
      backupStatus('Sauvegarde chiffrée téléchargée. Garde son mot de passe dans un endroit sûr : il est indispensable pour la restaurer.');
      $('backupPassword').value='';$('backupConfirm').value='';
    }catch(error){console.error(error);backupStatus('Sauvegarde impossible : '+error.message,true)}finally{btn.disabled=false}
  }
  function combineRecords(local,incoming,key){
    const combined=clone(local),ids=new Set(local.map(x=>x.id));let added=0;
    for(const value of incoming){if(ids.has(value.id))continue;if(key==='invoices' && combined.some(x=>String(x.payload?.number||'').toLowerCase()===String(value.payload?.number||'').toLowerCase()))continue;combined.push(value);ids.add(value.id);added++}
    return [combined,added];
  }
  async function importBackup(){
    const file=$('backupFile').files?.[0],pass=$('backupPassword').value,btn=$('backupImport');
    if(!file){backupStatus('Choisis un fichier de sauvegarde à restaurer.',true);return}
    if(file.size>12*1024*1024){backupStatus('Fichier trop volumineux (limite : 12 Mo).',true);return}
    btn.disabled=true;backupStatus('Lecture et vérification de la sauvegarde…');
    try{
      const imported=await readCheckedBackup();
      backupPreview(imported);
      const replace=$('backupReplace').checked;
      const totals=`${imported.invoices.length} facture(s), ${imported.clients.length} client(s), ${imported.templates.length} modèle(s), ${(imported.timeEntries||[]).length} séance(s)`;
      const message=replace?`Remplacer les données actuelles par cette sauvegarde (${totals}) ? Conserve une copie des données existantes avant de continuer.`:`Fusionner cette sauvegarde (${totals}) avec tes données locales ? Les enregistrements existants ne seront pas écrasés.`;
      if(!confirm(message)){backupStatus('Import annulé.');return}
      let newClients,newTemplates,newInvoices,newCounters,newTimeEntries,newCredits,newRules,newClosures;
      const a=replace?[clone(imported.clients),imported.clients.length]:combineRecords(clients,imported.clients,'clients');
      const b=replace?[clone(imported.templates),imported.templates.length]:combineRecords(templates,imported.templates,'templates');
      const c=replace?[clone(imported.invoices),imported.invoices.length]:combineRecords(invoices,imported.invoices,'invoices');
      [newClients]=a;[newTemplates]=b;[newInvoices]=c;
      const d=replace?[clone(imported.timeEntries||[]),(imported.timeEntries||[]).length]:combineRecords(timeEntries,imported.timeEntries||[],'time');
      [newTimeEntries]=d;
      const f=replace?[clone(imported.credits||[]),(imported.credits||[]).length]:combineRecords(credits,imported.credits||[],'credits');
      [newCredits]=f;
      const g=replace?[clone(imported.automationRules||[]),(imported.automationRules||[]).length]:combineRecords(automationRules,imported.automationRules||[],'rules');
      const h=replace?[clone(imported.monthClosures||[]),(imported.monthClosures||[]).length]:combineRecords(monthClosures,imported.monthClosures||[],'closures');
      [newRules]=g;[newClosures]=h;
      if(new Set(newCredits.map(c=>c.number)).size!==newCredits.length)throw new Error('Des avoirs possèdent la même référence. Résous ce conflit avant d’importer.');
      if(newCredits.some(c=>!newInvoices.some(i=>i.id===c.invoiceId)))throw new Error('Un avoir référence une facture absente.');
      if(newCredits.some(c=>newCredits.filter(t=>t.invoiceId===c.invoiceId).reduce((n,t)=>n+t.cents,0)>invoiceCents(newInvoices.find(i=>i.id===c.invoiceId))))throw new Error('Le total des avoirs dépasse une facture.');
      newCounters={...(replace?{}:numberCounters)};
      for(const [year,count] of Object.entries(imported.numberCounters))if(/^\d{4}$/.test(year)&&Number.isSafeInteger(Number(count))&&Number(count)>=0)newCounters[year]=Math.max(Number(newCounters[year])||0,Number(count));
      // Persist data atomically with rollback if the browser rejects any write.
      const keys=[clientKey,templateKey,historyKey,counterKey,timeKey,creditKey,automationKey,closeKey,...(replace?[autoDraftKey]:[])];
      const values=[newClients,newTemplates,newInvoices,newCounters,newTimeEntries,newCredits,newRules,newClosures,...(replace?[imported.workingDraft||null]:[])];
      if(vaultCache){
        // Import chiffré en une seule écriture : en cas d'échec, on ne modifie pas le coffre.
        await vaultFlush();
        const snapshot={...vaultCache};
        keys.forEach((k,i)=>{if(values[i]===null)delete snapshot[k];else snapshot[k]=JSON.stringify(values[i])});
        try{if(officeConflict||localStorage.getItem(VAULT_KEY)!==vaultCommittedValue){showOfficeConflict();throw Error("Conflit de stockage");}const encrypted=await vaultSeal(snapshot,vaultKey,vaultSalt);if(officeConflict||localStorage.getItem(VAULT_KEY)!==vaultCommittedValue){showOfficeConflict();throw Error("Conflit de stockage");}localStorage.setItem(VAULT_KEY,encrypted);vaultCommittedValue=encrypted;vaultCache=snapshot;vaultDirty=false}
        catch(error){throw new Error('Import interrompu : le coffre n’a pas pu être écrit. Tes données initiales sont conservées.')}
      }else{
        const previous=keys.map(k=>secureStore.getItem(k));
        try{keys.forEach((k,i)=>values[i]===null?secureStore.removeItem(k):secureStore.setItem(k,JSON.stringify(values[i])))}
        catch(error){keys.forEach((k,i)=>{try{previous[i]===null?secureStore.removeItem(k):secureStore.setItem(k,previous[i])}catch{}});throw new Error('Stockage indisponible, import interrompu. Les données précédentes ont été préservées autant que possible.')}
      }
      clients=newClients;templates=newTemplates;invoices=newInvoices;numberCounters=newCounters;timeEntries=newTimeEntries;credits=newCredits;automationRules=newRules;monthClosures=newClosures;
      if(replace){activeInvoiceId=null;activeSignature='';autoNumber=true;const draft=restoreAutoDraft();if(!draft)newDraft('sejer')}
      refreshPresetOptions();renderClientSelector();renderTemplates();renderHistory();renderDashboard();renderTime();renderCollection();renderCredits();renderCounters();renderAutomation();updateActiveNotice();
      if(vaultCache)await vaultFlush();
      backupStatus(`Import terminé : ${a[1]} client(s), ${b[1]} modèle(s), ${c[1]} facture(s), ${d[1]} séance(s), ${f[1]} avoir(s) ${replace?'restaurés':'ajoutés'}.`);
      $('backupFile').value='';$('backupPassword').value='';$('backupConfirm').value='';queueAutoSave();
    }catch(error){console.error(error);backupStatus('Import impossible : '+error.message,true)}finally{btn.disabled=false}
  }

  // V45 · Tableau de bord et encaissements : la date d'une facture et la date de règlement sont deux choses différentes.
  const paymentMethods={bank:'Virement',cash:'Espèces',card:'Carte',cheque:'Chèque',other:'Autre'};
  const toCents=value=>Math.round((Number(value)||0)*100);
  const euroCents=cents=>money(cents/100);
  const invoiceCents=entry=>Math.max(0,toCents(textTotal(entry.payload)));
  const validDate=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(v||'')))return false;const d=new Date(v+'T12:00:00');return Number.isFinite(d.getTime())&&iso(d)===v};
  const isUndatedLegacyPaid=entry=>entry.status==='paid'&&(!Array.isArray(entry.payments)||entry.payments.length===0);
  function paymentSum(entry){return Array.isArray(entry.payments)?entry.payments.reduce((n,p)=>n+(Number.isSafeInteger(p.cents)?p.cents:0),0):0}
  function getInvoiceBalance(entry){
    const total=Math.max(0,invoiceCents(entry)-creditCents(entry.id)),legacy=isUndatedLegacyPaid(entry);
    const paid=legacy?total:Math.min(total,paymentSum(entry));
    return {total:total/100,paid:paid/100,balance:Math.max(0,total-paid)/100,legacy};
  }
  const hasSettledBalance=entry=>(invoiceCents(entry)-creditCents(entry.id))>0&&paymentSum(entry)>=invoiceCents(entry)-creditCents(entry.id);
  let activeReceiptId='';
  function openPaymentDialog(invoiceId){
    const entry=invoices.find(i=>i.id===invoiceId);if(!entry)return;
    if(entry.status==='draft'){alert('Enregistre ou exporte d’abord cette facture pour enregistrer un règlement.');return}
    activeReceiptId=invoiceId;
    const summary=getInvoiceBalance(entry),legacy=summary.legacy;
    $('receiptTitle').textContent=legacy?'Dater un règlement ancien':'Enregistrer un règlement';
    $('receiptCaption').textContent=`${entry.payload.number||'Facture'} · ${entry.payload.client||'Client'} · Total ${money(summary.total)}`;
    $('receiptLegacyNote').hidden=!legacy;
    $('receiptDate').value=iso(new Date());$('receiptAmount').value=summary.balance>0?summary.balance.toFixed(2):summary.total.toFixed(2);
    $('receiptMethod').value='bank';$('receiptNote').value='';$('receiptError').textContent='';
    $('receiptSave').hidden=!legacy&&summary.balance<=0;
    $('receiptFormFields').hidden=!legacy&&summary.balance<=0;
    renderPaymentRows(entry);
    const dialog=$('receiptDialog');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    if(!$('receiptFormFields').hidden)$('receiptDate').focus();
  }
  function closePaymentDialog(){if($('receiptDialog').open)$('receiptDialog').close();else $('receiptDialog').removeAttribute('open');activeReceiptId=''}
  function renderPaymentRows(entry){
    const host=$('receiptList');host.replaceChildren();
    const payments=Array.isArray(entry.payments)?entry.payments:[];
    for(const item of payments){
      const row=document.createElement('div');row.className='payment-row';
      const summary=document.createElement('div');summary.className='payment-row-summary';
      const strong=document.createElement('strong');strong.textContent=euroCents(item.cents);
      const small=document.createElement('small');small.textContent=[dateFr(item.date),paymentMethods[item.method]||item.method,item.note].filter(Boolean).join(' · ');
      summary.append(strong,small);row.append(summary);
      const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Retirer';
      remove.setAttribute('aria-label',`Retirer le règlement de ${euroCents(item.cents)} du ${dateFr(item.date)}`);
      remove.addEventListener('click',()=>removePayment(entry.id,item.id));row.append(remove);host.append(row);
    }
    if(!payments.length){const empty=document.createElement('p');empty.className='receipt-empty';empty.textContent=isUndatedLegacyPaid(entry)?'Ancienne facture marquée payée : renseigne sa vraie date de règlement pour l’inclure dans les statistiques mensuelles.':'Aucun règlement daté enregistré.';host.append(empty)}
    const balance=getInvoiceBalance(entry);
    $('receiptBalance').textContent=`Reçu ${money(balance.paid)} · Solde ${money(balance.balance)}`;
  }
  function savePayment(){
    const entry=invoices.find(x=>x.id===activeReceiptId);if(!entry)return;
    const date=$('receiptDate').value,raw=$('receiptAmount').value,amount=toCents(raw);
    const total=Math.max(0,invoiceCents(entry)-creditCents(entry.id)),prior=paymentSum(entry),legacy=isUndatedLegacyPaid(entry);
    const left=Math.max(0,total-prior);
    if(!validDate(date)){$('receiptError').textContent='Indique une date de règlement valide.';return}
    if(!String(raw).trim()||!Number.isFinite(Number(raw))||amount<=0){$('receiptError').textContent='Le montant doit être strictement positif.';return}
    if(amount>left){$('receiptError').textContent='Le règlement dépasse le solde de '+euroCents(left)+'.';return}
    const method=$('receiptMethod').value;
    if(!Object.hasOwn(paymentMethods,method)){$('receiptError').textContent='Mode de règlement inconnu.';return}
    const note=$('receiptNote').value.trim().slice(0,500);
    const payment={id:uid(),date,cents:amount,method,note,createdAt:isoNow()};
    const newTotal=prior+amount;
    const next=invoices.map(x=>x.id===entry.id?{...x,payments:[...(x.payments||[]),payment],status:newTotal>=total?'paid':(legacy?'issued':x.status),statusBeforePaid:(newTotal>=total?(x.status==='paid'?x.statusBeforePaid||'issued':x.status):x.statusBeforePaid),updatedAt:isoNow()}:x);
    if(!persist(historyKey,next))return;
    invoices=next;renderHistory();renderDashboard();renderCollection();renderCredits();updateActiveNotice();
    const updated=invoices.find(x=>x.id===entry.id);
    renderPaymentRows(updated);
    const balance=getInvoiceBalance(updated);
    $('receiptAmount').value=balance.balance>0?balance.balance.toFixed(2):'0.00';
    $('receiptSave').hidden=balance.balance<=0;$('receiptFormFields').hidden=balance.balance<=0;
    $('receiptError').textContent=balance.balance<=0?'Facture intégralement réglée.':'Règlement ajouté. Tu peux saisir un autre paiement.';
    $('receiptLegacyNote').hidden=true;
  }
  function removePayment(invoiceId,paymentId){
    const entry=invoices.find(x=>x.id===invoiceId);if(!entry)return;
    const payment=(entry.payments||[]).find(p=>p.id===paymentId);if(!payment)return;
    if(!confirm(`Retirer le règlement de ${euroCents(payment.cents)} du ${dateFr(payment.date)} ?`))return;
    const remaining=entry.payments.filter(p=>p.id!==paymentId);
    const next=invoices.map(x=>x.id===invoiceId?{...x,payments:remaining,status:x.statusBeforePaid||'issued',updatedAt:isoNow()}:x);
    if(!persist(historyKey,next))return;
    invoices=next;renderHistory();renderDashboard();renderCollection();renderCredits();updateActiveNotice();
    const updated=invoices.find(x=>x.id===invoiceId),balance=getInvoiceBalance(updated);
    renderPaymentRows(updated);
    $('receiptAmount').value=balance.balance.toFixed(2);$('receiptFormFields').hidden=false;$('receiptSave').hidden=false;
    $('receiptError').textContent='Règlement retiré. La facture n’est plus considérée comme intégralement réglée.';
  }
  function dashboardFilter(){return {year:$('dashboardYear').value,client:$('dashboardClient').value}}
  function periodInvoiceMatches(entry,year,client){return entry.status!=='draft'&&String(entry.payload?.date||'').startsWith(year+'-')&&(!client||entry.payload?.client===client)}
  function dashboardSource(){
    const chosen=dashboardFilter(),all=invoices.filter(i=>i.status!=='draft');
    return {chosen,entries:all.filter(i=>periodInvoiceMatches(i,chosen.year,chosen.client)),payments:all.flatMap(i=>
      (i.payments||[]).filter(p=>p.date.startsWith(chosen.year+'-')&&(!chosen.client||i.payload?.client===chosen.client)).map(p=>({invoice:i,payment:p}))
    )};
  }
  function ensureDashboardFilters(){
    const year=$('dashboardYear'),client=$('dashboardClient'),oldYear=year.value||String(today.getFullYear()),oldClient=client.value;
    const yrs=new Set([String(today.getFullYear())]);
    const names=new Set();
    for(const inv of invoices){if(/^\d{4}/.test(String(inv.payload?.date||'')))yrs.add(inv.payload.date.slice(0,4));if(inv.payload?.client)names.add(inv.payload.client);
      for(const item of inv.payments||[]){if(/^\d{4}/.test(item.date))yrs.add(item.date.slice(0,4))}}
    year.replaceChildren();[...yrs].sort((a,b)=>b.localeCompare(a)).forEach(v=>year.add(new Option(v,v)));
    year.value=yrs.has(oldYear)?oldYear:String(today.getFullYear());
    client.replaceChildren(new Option('Tous les clients',''));
    [...names].sort((a,b)=>a.localeCompare(b,'fr')).forEach(v=>client.add(new Option(v,v)));
    client.value=names.has(oldClient)?oldClient:'';
  }
  function renderDashboard(){
    if(!$('dashboardYear'))return;
    ensureDashboardFilters();
    const {chosen,entries,payments}=dashboardSource();
    const billed=entries.reduce((s,i)=>s+invoiceCents(i),0);
    const received=payments.reduce((s,{payment})=>s+payment.cents,0);
    const remaining=entries.reduce((s,i)=>s+toCents(getInvoiceBalance(i).balance),0);
    const partial=entries.filter(i=>paymentSum(i)>0&&!hasSettledBalance(i)).length;
    const legacy=entries.filter(isUndatedLegacyPaid).length;
    $('dashboardBilled').textContent=euroCents(billed);
    $('dashboardReceived').textContent=euroCents(received);
    $('dashboardRemaining').textContent=euroCents(remaining);
    $('dashboardPartial').textContent=String(partial);
    $('dashboardInvoiceCount').textContent=`${entries.length} facture${entries.length>1?'s':''} émise${entries.length>1?'s':''} sur ${chosen.year}`;
    const issuedCredits=credits.filter(c=>c.date.startsWith(chosen.year+'-')&&(!chosen.client||c.payload.client===chosen.client));
    $('dashboardCreditsNote').textContent=`Avoirs émis dans l’année : ${money(issuedCredits.reduce((s,c)=>s+c.cents/100,0))} (${issuedCredits.length} document(s)). Le montant « Facturé » reste brut ; le solde « Reste à percevoir » déduit les avoirs, même émis ultérieurement. Les remboursements d'encaissements ne sont pas suivis ici.`;
    $('dashboardLegacy').hidden=legacy===0;
    $('dashboardLegacy').textContent=legacy?`${legacy} ancienne(s) facture(s) marquée(s) payée(s) sans date d’encaissement : elles sont considérées réglées pour le solde, mais exclues des recettes par mois et du CSV des encaissements. Ouvre leur règlement dans l’Historique pour renseigner la date réelle.`:'';
    const monthBilled=Array(12).fill(0),monthPaid=Array(12).fill(0);
    for(const entry of entries){const m=Number(entry.payload.date.slice(5,7));if(m>=1&&m<=12)monthBilled[m-1]+=invoiceCents(entry)}
    for(const {payment} of payments){const m=Number(payment.date.slice(5,7));if(m>=1&&m<=12)monthPaid[m-1]+=payment.cents}
    const max=Math.max(1,...monthBilled,...monthPaid);
    const months=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
    const chart=$('dashboardBars');chart.replaceChildren();
    months.forEach((name,i)=>{
      const group=document.createElement('div');group.className='dashboard-month';
      const bars=document.createElement('div');bars.className='dashboard-month-bars';
      for(const [kind,amount] of [['billed',monthBilled[i]],['received',monthPaid[i]]]){
        const bar=document.createElement('span');bar.className='dashboard-bar dashboard-bar--'+kind;
        bar.style.height=(amount>0?Math.max(3,100*amount/max):0)+'%';
        bar.title=`${name} · ${kind==='billed'?'Facturé':'Encaissé'} : ${euroCents(amount)}`;
        bar.setAttribute('aria-label',bar.title);bars.append(bar);
      }
      const caption=document.createElement('small');caption.textContent=name;group.append(bars,caption);chart.append(group);
    });
    $('dashboardChartDesc').textContent=`${chosen.year} · Factures selon leur date d’émission, encaissements selon la date réellement saisie. Une facture réglée l’année suivante n’est pas comptée parmi les recettes de son année d’émission.`;
    const breakdown=$('dashboardBreakdown');breakdown.replaceChildren();
    const byClient=new Map();
    for(const inv of entries){const name=inv.payload?.client||'Client non renseigné';let row=byClient.get(name);if(!row){row={name,billed:0,paid:0,count:0};byClient.set(name,row)}
      row.billed+=invoiceCents(inv);row.paid+=toCents(getInvoiceBalance(inv).paid);row.count++}
    for(const row of [...byClient.values()].sort((a,b)=>b.billed-a.billed)){
      const item=document.createElement('div');item.className='dashboard-breakdown-item';
      const left=document.createElement('div'),right=document.createElement('div');
      const title=document.createElement('strong');title.textContent=row.name;const desc=document.createElement('small');desc.textContent=row.count+' facture(s)';left.append(title,desc);
      const amount=document.createElement('strong');amount.textContent=euroCents(row.billed);const paid=document.createElement('small');paid.textContent='Réglé à ce jour : '+euroCents(row.paid);right.append(amount,paid);item.append(left,right);breakdown.append(item);
    }
    if(!byClient.size){const empty=document.createElement('p');empty.className='receipt-empty';empty.textContent='Aucune facture émise sur cette période.';breakdown.append(empty)}
    const recent=$('dashboardRecent');recent.replaceChildren();
    const sorted=payments.sort((a,b)=>b.payment.date.localeCompare(a.payment.date)||String(b.payment.createdAt||'').localeCompare(a.payment.createdAt||'')).slice(0,6);
    for(const {invoice,payment} of sorted){
      const row=document.createElement('div');row.className='dashboard-payment-item';
      const label=document.createElement('span');label.textContent=`${dateFr(payment.date)} · ${invoice.payload?.client||'Client'} · ${invoice.payload?.number||''}`;
      const amount=document.createElement('strong');amount.textContent=euroCents(payment.cents);
      row.append(label,amount);recent.append(row);
    }
    if(!sorted.length){const empty=document.createElement('p');empty.className='receipt-empty';empty.textContent='Aucun règlement daté enregistré pour cette année.';recent.append(empty)}
  }
  function csvCell(value){let s=String(value??'').replace(/\r?\n/g,' ');if(/^[\s]*[=+@\-]/.test(s)&&!/^-[0-9]+(?:[.,][0-9]+)?$/.test(s.trim()))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
  function downloadCSV(headers,rows,name){
    const content='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
    download(new Blob([content],{type:'text/csv;charset=utf-8'}),name);
  }
  function exportCSV(type){
    const {chosen,entries,payments}=dashboardSource(),stem=`Philosophal-${type==='invoices'?'factures':'encaissements'}-${chosen.year}`;
    if(type==='invoices'){
      const rows=entries.sort((a,b)=>String(a.payload.date).localeCompare(String(b.payload.date))).map(inv=>{
        const b=getInvoiceBalance(inv),p=inv.payload;
        return [p.number,p.date,p.period,p.client,inv.status,p.validator,(invoiceCents(inv)/100).toFixed(2).replace('.',','),(creditCents(inv.id)/100).toFixed(2).replace('.',','),b.paid.toFixed(2).replace('.',','),b.balance.toFixed(2).replace('.',','),b.legacy?'Payée sans date connue':''];
      });
      downloadCSV(['Référence','Date facture','Période de prestation','Client','Statut','Valideur','Facturé brut HT (EUR)','Avoirs imputés (EUR)','Réglé à ce jour (EUR)','Reste dû (EUR)','Observation'],rows,stem+'.csv');
    }else{
      const rows=payments.sort((a,b)=>a.payment.date.localeCompare(b.payment.date)).map(({invoice,payment})=>
        [payment.date,invoice.payload.number,invoice.payload.date,invoice.payload.client,payment.cents/100, paymentMethods[payment.method]||payment.method,payment.note].map((x,i)=>i===4?Number(x).toFixed(2).replace('.',','):x));
      downloadCSV(['Date encaissement','Référence facture','Date facture','Client','Montant encaissé (EUR)','Mode de règlement','Note'],rows,stem+'.csv');
    }
    $('dashboardCsvInfo').textContent='CSV téléchargé · séparateur « ; » compatible avec les tableurs français. Document de suivi, non déclaration officielle.';
  }


  // V49 · Rapports par date réelle. Aucun nouveau stockage, aucune migration du coffre.
  const reportMonths=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const reportNorm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase('fr-FR');
  const reportTimeClient=e=>String(e.clientName||clientRefName(e.clientRef)||'Client non renseigné').trim();
  const reportInvClient=i=>String(i.payload?.client||'Client non renseigné').trim();
  const reportMoney=cents=>euroCents(cents);
  const reportRoundHours=n=>Math.round(n*10000)/10000;
  const reportCents=value=>Math.round(value*100);
  const reportMonthKey=date=>String(date||'').slice(0,7);
  function reportsGetFilters(){return {year:$('reportsYear').value||String(today.getFullYear()),month:$('reportsMonth').value,client:$('reportsClient').value}}
  function reportsEnsureFilters(){
    const years=new Set([String(today.getFullYear())]);const names=new Set();
    const addYear=d=>{if(/^\d{4}-\d{2}/.test(String(d||'')))years.add(String(d).slice(0,4))};
    for(const i of invoices){addYear(i.payload?.date);if(i.payload?.client)names.add(reportInvClient(i));for(const p of i.payments||[])addYear(p.date)}
    for(const e of timeEntries){addYear(e.date);names.add(reportTimeClient(e))}
    for(const c of credits){addYear(c.date);if(c.payload?.client)names.add(String(c.payload.client).trim())}
    const year=$('reportsYear'),oldYear=year.value||String(today.getFullYear());year.replaceChildren();
    [...years].sort((a,b)=>b.localeCompare(a)).forEach(v=>year.add(new Option(v,v)));year.value=years.has(oldYear)?oldYear:String(today.getFullYear());
    const client=$('reportsClient'),oldClient=client.value;client.replaceChildren(new Option('Tous les clients',''));
    [...names].sort((a,b)=>a.localeCompare(b,'fr')).forEach(v=>client.add(new Option(v,v)));
    client.value=[...names].includes(oldClient)?oldClient:'';
  }
  function reportsData(year,client){
    const match=name=>!client||reportNorm(name)===reportNorm(client);
    const months=reportMonths.map((name,i)=>({key:year+'-'+String(i+1).padStart(2,'0'),name,hours:0,openHours:0,linkedHours:0,estimated:0,openEstimate:0,issued:0,credits:0,received:0,invoices:[],creditItems:[],receipts:[],sessions:[],legacy:0}));
    const issued=invoices.filter(i=>i.status!=='draft');
    const timeMap=new Map(timeEntries.filter(e=>typeof e.id==='string').map(e=>[e.id,e]));
    const linkMap=new Map();
    for(const i of issued)for(const id of (Array.isArray(i.timeEntryIds)?i.timeEntryIds:[])){
      if(!linkMap.has(id))linkMap.set(id,[]);linkMap.get(id).push(i);
    }
    const alerts={undated:[],missingHours:[],linkedTwice:[],amountDifferences:[],overpaid:[],unlinkedManual:0};
    for(const i of issued){
      if(!match(reportInvClient(i)))continue;
      const k=reportMonthKey(i.payload?.date),m=months.find(row=>row.key===k);
      if(m){m.issued+=invoiceCents(i);m.invoices.push(i);if(isUndatedLegacyPaid(i)){m.legacy++;alerts.undated.push(i)}}
      const refs=Array.isArray(i.timeEntryIds)?i.timeEntryIds:[];
      if(!refs.length){if(m)alerts.unlinkedManual++;}
      else {
        const missing=refs.filter(id=>!timeMap.has(id));
        if(missing.length && m)alerts.missingHours.push({invoice:i,count:missing.length});
        if(!missing.length&&m){
          const linkedCents=refs.reduce((n,id)=>n+reportCents(timeAmount(timeMap.get(id))),0);
          if(Math.abs(linkedCents-invoiceCents(i))>1)alerts.amountDifferences.push({invoice:i,registered:linkedCents,difference:invoiceCents(i)-linkedCents});
        }
      }
      const over=paymentSum(i)-(invoiceCents(i)-creditCents(i.id));
      if(over>1&&m)alerts.overpaid.push({invoice:i,excess:over});
      for(const p of i.payments||[]){
        const target=months.find(row=>row.key===reportMonthKey(p.date));
        if(target&&Number.isSafeInteger(p.cents)&&p.cents>0){target.received+=p.cents;target.receipts.push({invoice:i,payment:p})}
      }
    }
    for(const e of timeEntries){
      if(!validTimeEntry(e)||!match(reportTimeClient(e)))continue;
      const m=months.find(row=>row.key===reportMonthKey(e.date));if(!m)continue;
      m.hours+=e.duration;m.estimated+=reportCents(timeAmount(e));m.sessions.push(e);
      const links=linkMap.get(e.id)||[];
      if(!links.length){m.openHours+=e.duration;m.openEstimate+=reportCents(timeAmount(e))}
      else{m.linkedHours+=e.duration;if(links.length>1)alerts.linkedTwice.push({entry:e,count:links.length})}
    }
    for(const c of credits){
      if(!match(String(c.payload?.client||'Client non renseigné')))continue;
      const m=months.find(row=>row.key===reportMonthKey(c.date));
      if(m){m.credits+=c.cents;m.creditItems.push(c)}
    }
    return {months,alerts,linkMap};
  }
  function reportSum(months){
    return months.reduce((a,m)=>{for(const k of ['hours','openHours','linkedHours','estimated','openEstimate','issued','credits','received'])a[k]+=m[k];
      for(const k of ['invoices','creditItems','receipts','sessions'])a[k].push(...m[k]);a.legacy+=m.legacy;return a;},
      {hours:0,openHours:0,linkedHours:0,estimated:0,openEstimate:0,issued:0,credits:0,received:0,invoices:[],creditItems:[],receipts:[],sessions:[],legacy:0});
  }
  function reportPeriod(){
    reportsEnsureFilters();const f=reportsGetFilters(),data=reportsData(f.year,f.client),selected=f.month?[data.months[Number(f.month)-1]]:data.months;
    const total=reportSum(selected),previous=reportsData(String(Number(f.year)-1),f.client).months;
    const previousTotal=reportSum(f.month?[previous[Number(f.month)-1]]:previous);
    return {...f,...data,selected,total,previousTotal};
  }
  function reportMessage(value){$('reportsMessage').textContent=value}
  function appendReportAlert(host,heading,message,type='warning',target=''){
    const card=document.createElement('div');card.className='reports-alert is-'+type;
    const body=document.createElement('div');const strong=document.createElement('strong');strong.textContent=heading;
    const desc=document.createElement('p');desc.textContent=message;body.append(strong,desc);card.append(body);
    if(target){const button=document.createElement('button');button.type='button';button.textContent=target==='time'?'Voir les heures':target==='history'?'Voir les factures':'Voir les échéances';button.addEventListener('click',()=>setArea(target));card.append(button)}
    host.append(card);
  }
  function renderReports(){
    if(!$('reportsYear'))return;
    const ctx=reportPeriod(),t=ctx.total;
    $('reportsHours').textContent=fixedHours(reportRoundHours(t.hours));
    $('reportsSessions').textContent=`${t.sessions.length} séance(s), dont ${fixedHours(reportRoundHours(t.linkedHours))} liées à une facture`;
    $('reportsOpenHours').textContent=fixedHours(reportRoundHours(t.openHours));$('reportsOpenValue').textContent=reportMoney(t.openEstimate)+' estimés à facturer';
    $('reportsIssued').textContent=reportMoney(t.issued);$('reportsCredits').textContent=reportMoney(t.credits);
    $('reportsNet').textContent=reportMoney(t.issued-t.credits);$('reportsPaid').textContent=reportMoney(t.received);
    function variance(value,base){if(base===0)return value===0?'stable à 0 €':'pas de base comparable';const pct=(value-base)/Math.abs(base)*100;return (pct>0?'+':'')+pct.toLocaleString('fr-FR',{maximumFractionDigits:1})+' %'}
    const old=ctx.previousTotal;const comparison=$('reportsComparison');comparison.replaceChildren();
    const label=document.createElement('strong');label.textContent='Comparaison avec '+String(Number(ctx.year)-1)+(ctx.month?' · '+reportMonths[Number(ctx.month)-1].toLowerCase():' · année complète');
    const copy=document.createElement('div');copy.textContent=`Factures émises : ${reportMoney(old.issued)} → ${reportMoney(t.issued)} (${variance(t.issued,old.issued)}) · Encaissements datés : ${reportMoney(old.received)} → ${reportMoney(t.received)} (${variance(t.received,old.received)}).`;
    comparison.append(label,copy);
    const tbody=$('reportsMonthlyRows');tbody.replaceChildren();
    for(let i=0;i<12;i++){
      const m=ctx.months[i],tr=document.createElement('tr');if(ctx.month===String(i+1).padStart(2,'0'))tr.className='is-selected';
      const td=document.createElement('td'),btn=document.createElement('button');btn.type='button';btn.className='reports-month-btn';btn.textContent=m.name;
      btn.setAttribute('aria-label','Afficher le bilan de '+m.name+' '+ctx.year);btn.addEventListener('click',()=>{$('reportsMonth').value=String(i+1).padStart(2,'0');renderReports()});
      td.append(btn);tr.append(td);
      for(const value of [fixedHours(reportRoundHours(m.hours)),fixedHours(reportRoundHours(m.openHours)),reportMoney(m.issued),reportMoney(m.credits),reportMoney(m.received)]){
        const cell=document.createElement('td');cell.textContent=value;tr.append(cell);
      }
      tbody.append(tr);
    }
    const foot=$('reportsMonthlyFoot');foot.replaceChildren();const row=document.createElement('tr');
    const all=reportSum(ctx.months);for(const value of ['Année complète',fixedHours(reportRoundHours(all.hours)),fixedHours(reportRoundHours(all.openHours)),reportMoney(all.issued),reportMoney(all.credits),reportMoney(all.received)]){
      const cell=document.createElement('td');cell.textContent=value;row.append(cell);
    }foot.append(row);
    const host=$('reportsAlerts');host.replaceChildren();
    const applicableMonth=(d)=>ctx.selected.some(m=>m.key===reportMonthKey(d));
    const pending=t.sessions.filter(e=>!(ctx.linkMap.get(e.id)||[]).length);
    if(pending.length)appendReportAlert(host,`${pending.length} séance(s) à facturer`,`${fixedHours(reportRoundHours(t.openHours))} · estimation ${reportMoney(t.openEstimate)}. Les heures sont regroupées selon leur date de réalisation.`,'warning','time');
    const undated=ctx.alerts.undated.filter(i=>applicableMonth(i.payload.date));
    if(undated.length)appendReportAlert(host,`${undated.length} facture(s) payée(s) sans date de règlement`,'Elles figurent comme réglées dans le solde, mais pas dans les encaissements par mois. Saisis la date réelle dans l’historique.','warning','history');
    const missing=ctx.alerts.missingHours.filter(x=>applicableMonth(x.invoice.payload.date));
    if(missing.length)appendReportAlert(host,`${missing.length} facture(s) avec des heures liées introuvables`,'Vérifie la correspondance entre les séances archivées et les identifiants associés aux factures.','warning','history');
    const mismatch=ctx.alerts.amountDifferences.filter(x=>applicableMonth(x.invoice.payload.date));
    if(mismatch.length)appendReportAlert(host,`${mismatch.length} facture(s) dont le total diffère du registre associé`,'Une remise, une modification volontaire de la facture ou des tarifs peut expliquer cet écart. Vérifie les documents originaux.','warning','history');
    const duplicated=ctx.alerts.linkedTwice.filter(x=>applicableMonth(x.entry.date));
    if(duplicated.length)appendReportAlert(host,`${duplicated.length} séance(s) associée(s) à plusieurs factures`,'Les liens ont été détectés dans l’historique. Vérifie les documents pour écarter toute double facturation.','warning','history');
    const over=ctx.alerts.overpaid.filter(x=>applicableMonth(x.invoice.payload.date));
    if(over.length)appendReportAlert(host,`${over.length} facture(s) encaissée(s) au-delà du total après avoir`,'Un remboursement peut être nécessaire ; les remboursements bancaires ne sont pas suivis par ce registre.','warning','history');
    const manual=t.invoices.filter(i=>!Array.isArray(i.timeEntryIds)||i.timeEntryIds.length===0);
    if(manual.length)appendReportAlert(host,`${manual.length} facture(s) créée(s) sans rattachement au registre d’heures`,'Ces factures sont comptées financièrement, mais leurs prestations ne sont pas rapprochables automatiquement. Ce n’est pas forcément une erreur.','warning','history');
    if(!host.childElementCount)appendReportAlert(host,'Aucun point particulier relevé','Les contrôles automatiques ne détectent pas d’anomalie dans les données de cette période.','good');
    const detail=$('reportsDetail');detail.replaceChildren();
    const groups=[
      ['Heures effectuées',t.sessions.map(e=>({date:e.date,text:reportTimeClient(e)+' · '+(e.description||timeLabel(e.kind))+' · '+fixedHours(e.duration)+(ctx.linkMap.get(e.id)?.length?' · liée':' · à facturer'),amount:reportMoney(reportCents(timeAmount(e)))}))],
      ['Factures émises',t.invoices.map(i=>({date:i.payload.date,text:i.payload.number+' · '+reportInvClient(i),amount:reportMoney(invoiceCents(i))}))],
      ['Avoirs émis',t.creditItems.map(c=>({date:c.date,text:c.number+' · '+String(c.payload?.client||'') ,amount:'− '+reportMoney(c.cents)}))],
      ['Encaissements datés',t.receipts.map(({invoice,payment})=>({date:payment.date,text:invoice.payload.number+' · '+reportInvClient(invoice),amount:reportMoney(payment.cents)}))]
    ];
    for(const [name,items] of groups){
      const el=document.createElement('section');el.className='reports-detail-group';const head=document.createElement('h4');head.textContent=`${name} (${items.length})`;el.append(head);
      if(!items.length){const empty=document.createElement('div');empty.className='reports-detail-empty';empty.textContent='Aucune écriture sur cette période.';el.append(empty)}
      for(const item of items.sort((a,b)=>a.date.localeCompare(b.date)).reverse().slice(0,30)){
        const row=document.createElement('div');row.className='reports-detail-row';const span=document.createElement('span');span.textContent=`${dateFr(item.date)} · ${item.text}`;const b=document.createElement('b');b.textContent=item.amount;row.append(span,b);el.append(row);
      }
      if(items.length>30){const more=document.createElement('div');more.className='reports-detail-empty';more.textContent=`${items.length-30} autre(s) ligne(s) disponibles dans le CSV détaillé.`;el.append(more)}
      detail.append(el);
    }
    reportMessage(`Bilan actualisé · ${ctx.month?reportMonths[Number(ctx.month)-1]+' ':''}${ctx.year} · ${ctx.client||'tous les clients'}.`);
  }
  function reportsExportSummary(){
    const ctx=reportPeriod(),rows=ctx.months.map(m=>[m.key,reportRoundHours(m.hours),reportRoundHours(m.linkedHours),reportRoundHours(m.openHours),m.sessions.length,m.openEstimate,m.issued,m.credits,m.issued-m.credits,m.received]);
    const columns=['Mois','Heures réalisées','Heures liées à une facture','Heures non facturées','Séances','Valeur estimée non facturée (EUR)','Factures émises brut HT (EUR)','Avoirs émis (EUR)','Émissions nettes indicatives (EUR)','Encaissements datés (EUR)'];
    const values=rows.map(row=>row.map((value,i)=>i>4?(value/100).toFixed(2).replace('.',','):i>0&&i<4?String(value).replace('.',','):value));
    downloadCSV(columns,values,`Philosophal-bilan-${ctx.year}${ctx.client?'-client':''}.csv`);
    reportMessage('Bilan annuel exporté en CSV. Les montants suivent les dates réelles des opérations.');
  }
  function reportsExportDetails(){
    const ctx=reportPeriod(),t=ctx.total;const rows=[];
    for(const e of t.sessions){const refs=ctx.linkMap.get(e.id)||[];rows.push([e.date,'Heures · valeur indicative',reportTimeClient(e),refs.map(i=>i.payload.number).join(', '),reportRoundHours(e.duration),timeAmount(e),refs.length?'Liée à facture':'Non facturée'])}
    for(const i of t.invoices)rows.push([i.payload.date,'Facture émise',reportInvClient(i),i.payload.number,'',invoiceCents(i)/100,'Montant brut HT']);
    for(const c of t.creditItems)rows.push([c.date,'Avoir émis',String(c.payload?.client||''),c.number,'',-c.cents/100,'Réf. facture : '+(invoices.find(i=>i.id===c.invoiceId)?.payload?.number||'inconnue')]);
    for(const {invoice,payment} of t.receipts)rows.push([payment.date,'Encaissement',reportInvClient(invoice),invoice.payload.number,'',payment.cents/100,paymentMethods[payment.method]||payment.method]);
    rows.sort((a,b)=>String(a[0]).localeCompare(String(b[0]))||String(a[1]).localeCompare(String(b[1])));
    downloadCSV(['Date','Nature (ne pas additionner les heures aux mouvements financiers)','Client','Référence','Durée (heures)','Montant (EUR)','Observations'],rows.map(row=>row.map((v,i)=>i===5?Number(v).toFixed(2).replace('.',','):i===4&&v!==''?String(v).replace('.',','):v)),`Philosophal-journal-${ctx.year}${ctx.month?'-'+ctx.month:''}${ctx.client?'-client':''}.csv`);
    reportMessage('Journal exporté. Attention : les valeurs estimées des heures sont indicatives et ne doivent pas être additionnées aux factures ou aux encaissements.');
  }
  function reportsPrint(){
    const ctx=reportPeriod(),t=ctx.total;
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const title=`Bilan ${ctx.month?reportMonths[Number(ctx.month)-1]+' ':''}${ctx.year}${ctx.client?' · '+ctx.client:''}`;
    const rows=ctx.selected.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(fixedHours(reportRoundHours(m.hours)))}</td><td>${esc(fixedHours(reportRoundHours(m.openHours)))}</td><td>${esc(reportMoney(m.issued))}</td><td>${esc(reportMoney(m.credits))}</td><td>${esc(reportMoney(m.received))}</td></tr>`).join('');
    const detailRows=[...t.invoices.map(i=>[i.payload.date,'Facture',i.payload.number,reportInvClient(i),reportMoney(invoiceCents(i))]),...t.creditItems.map(c=>[c.date,'Avoir',c.number,c.payload?.client||'', '− '+reportMoney(c.cents)]),...t.receipts.map(({invoice,payment})=>[payment.date,'Encaissement',invoice.payload.number,reportInvClient(invoice),reportMoney(payment.cents)])]
      .sort((a,b)=>String(a[0]).localeCompare(String(b[0]))).map(x=>'<tr>'+x.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('');
    const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Philosophal</title><style>@page{size:A4;margin:15mm}body{font:12px/1.55 Arial,sans-serif;color:#292333;margin:25px auto;max-width:1000px;padding:0 20px}h1{font-size:27px;margin:5px 0}h2{font-size:16px;margin-top:29px;color:#584277}small,.muted{color:#766b82}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.metrics div{background:#f5f0f8;padding:12px;border-radius:8px}.metrics strong{display:block;font-size:18px;margin-top:4px}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:10px}th,td{padding:7px;border-bottom:1px solid #ddd;text-align:right}th:first-child,td:first-child{text-align:left}th{background:#ede7f2}tr{break-inside:avoid}.notice{color:#71687b;font-size:10px;border-top:1px solid #ddd;margin-top:25px;padding-top:12px}.actions{margin:12px 0 24px}.actions button{padding:10px 14px;background:#3b2a51;color:white;border:0;border-radius:6px;cursor:pointer}@media print{.actions{display:none}body{padding:0;margin:0}.metrics div{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="actions"><button onclick="window.print()">Imprimer ou enregistrer en PDF</button></div><small>PHILOSOPHAL · RAPPORT LOCAL</small><h1>${esc(title)}</h1><p class="muted">Édité le ${esc(new Date().toLocaleDateString('fr-FR'))} · Tous les montants financiers sont en euros.</p><div class="metrics"><div>Heures enregistrées<strong>${esc(fixedHours(reportRoundHours(t.hours)))}</strong></div><div>Heures non facturées<strong>${esc(fixedHours(reportRoundHours(t.openHours)))}</strong></div><div>Factures émises<strong>${esc(reportMoney(t.issued))}</strong></div><div>Avoirs émis<strong>${esc(reportMoney(t.credits))}</strong></div><div>Émissions nettes<strong>${esc(reportMoney(t.issued-t.credits))}</strong></div><div>Encaissements datés<strong>${esc(reportMoney(t.received))}</strong></div></div><h2>Synthèse par mois</h2><table><thead><tr><th>Mois</th><th>Heures</th><th>Non facturées</th><th>Factures</th><th>Avoirs</th><th>Encaissements</th></tr></thead><tbody>${rows}</tbody></table><h2>Mouvements financiers (${t.invoices.length+t.creditItems.length+t.receipts.length})</h2><table><thead><tr><th>Date</th><th>Nature</th><th>Référence</th><th>Client</th><th>Montant</th></tr></thead><tbody>${detailRows||'<tr><td colspan="5">Aucun mouvement</td></tr>'}</tbody></table><p class="notice">Document de gestion interne, non comptable et non réglementaire. Les séances sont comptées par date de réalisation, les factures et avoirs par date d’émission, les règlements par date d’encaissement. Ces flux ne sont pas à additionner. Aucun rapprochement bancaire n’est effectué. Les factures soldées sans date de règlement connue ne sont pas comptées comme encaissements datés. Les avoirs ne sont pas des remboursements.</p></body></html>`;
    const target=window.open('','_blank');
    if(!target){reportMessage('Nouvelle fenêtre bloquée. Autorise temporairement les pop-up pour imprimer le bilan.');return}
    target.document.open();target.document.write(html);target.document.close();
    reportMessage('Rapport ouvert dans une nouvelle fenêtre : utilise « Imprimer ou enregistrer en PDF ».');
  }
  function initReports(){
    for(const name of ['reportsYear','reportsMonth','reportsClient'])$(name).addEventListener('change',renderReports);
    $('reportsCsvSummary').addEventListener('click',reportsExportSummary);
    $('reportsCsvDetailed').addEventListener('click',reportsExportDetails);
    $('reportsPrint').addEventListener('click',reportsPrint);
    renderReports();
  }

  // V46 · Registre de séances : une facture émise référence les ID des heures utilisées.
  const clientRefName = ref => ref==='sejer' ? 'SEJER' : (clients.find(c=>'client:'+c.id===ref)?.client||timeEntries.find(e=>e.clientRef===ref)?.clientName||'Client supprimé');
  function timeClientOptions(select,includeAll=false){
    const wanted=select.value;select.replaceChildren();
    if(includeAll)select.add(new Option('Tous les clients',''));
    select.add(new Option('SEJER · Profs en ligne','sejer'));
    for(const c of clients)select.add(new Option(c.profile?c.profile+' · '+c.client:c.client,'client:'+c.id));
    if([...select.options].some(o=>o.value===wanted))select.value=wanted;
  }
  function invoiceForTime(id){return invoices.find(i=>i.status!=='draft'&&Array.isArray(i.timeEntryIds)&&i.timeEntryIds.includes(id))||null}
  const timeLabel=k=>({with:'Avec élève / en appel',without:'Sans élève / sans appel',custom:'Autre prestation'})[k]||'Autre prestation';
  function suggestedRate(ref,kind){
    const custom=clients.find(c=>'client:'+c.id===ref);
    if(kind==='custom'){const value=custom?.rateCustom;return value!==undefined&&String(value).trim()!==''&&Number.isFinite(Number(value))&&Number(value)>=0?Number(value):0;}
    if(ref==='sejer')return kind==='with'?30:10;
    const tariff=kind==='with'?custom?.rateWith:kind==='without'?custom?.rateWithout:custom?.rateCustom;
    if(tariff!==undefined&&tariff!==null&&String(tariff).trim()!==''&&Number.isFinite(Number(tariff))&&Number(tariff)>=0)return Number(tariff);
    const named=custom?.defaultLines||[];
    if(named.length===1)return Number(named[0].price)||0;
    if(kind==='with')return Number(named[0]?.price)||40;
    return Number(named[1]?.price??named[0]?.price??0);
  }
  function timeAmount(e){return Math.round(e.duration*e.rate*100)/100}
  function validTimeEntry(e){return e&&typeof e.id==='string'&&e.id.length<=150&&validDate(e.date)&&typeof e.clientRef==='string'&&e.clientRef.length<=150&&['with','without','custom'].includes(e.kind)&&Number.isFinite(e.duration)&&e.duration>=0&&e.duration<=100000&&Number.isFinite(e.rate)&&e.rate>=0&&e.rate<=1e7&&typeof e.description==='string'&&e.description.length<=240&&typeof e.note==='string'&&e.note.length<=400}
  const fixedHours=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:4})+' h';
  const timeEntrySignature=ids=>signature(ids.map(id=>{const t=timeEntries.find(e=>e.id===id);return t?{id:t.id,clientRef:t.clientRef,date:t.date,kind:t.kind,duration:t.duration,rate:t.rate,description:t.description}:null}));
  function validTimeSource(src){return src && Array.isArray(src.ids)&&src.ids.length>0&&src.ids.length<2000&&src.ids.every(id=>typeof id==='string')&&typeof src.signature==='string'}
  // Le lien est maintenu seulement si le registre ET les lignes générées restent inchangés.
  function verifiedTimeSource(){
    if(!validTimeSource(timeSource))return null;
    const ids=timeSource.ids;
    if(new Set(ids).size!==ids.length||ids.some(id=>invoiceForTime(id)))return null;
    if(timeEntrySignature(ids)!==timeSource.signature)return null;
    if(signature(lines)!==timeSource.linesSignature)return null;
    if($('period').value!==timeSource.period||$('client').value!==timeSource.client)return null;
    return {ids};
  }
  function timeFormReset(){
    timeEditId=null;$('timeForm').reset();$('timeFormTitle').textContent='Nouvelle séance';$('timeCancel').hidden=true;$('timeSave').textContent='Enregistrer la séance';
    $('timeDate').value=iso(new Date());
    const filter=$('timeFilterClient').value;if(filter&&[...$('timeClient').options].some(o=>o.value===filter))$('timeClient').value=filter;
    $('timeRate').value=String(suggestedRate($('timeClient').value,$('timeKind').value));
  }
  function timeMsg(msg,bad=false){const el=$('timeMessage');el.textContent=msg;el.classList.toggle('is-warning',bad);el.classList.toggle('is-success',!bad)}
  function renderTime(){
    if(!$('timeList'))return;
    const client=$('timeClient'),filter=$('timeFilterClient');timeClientOptions(client);timeClientOptions(filter,true);
    if(!$('timeMonth').value)$('timeMonth').value=iso(new Date()).slice(0,7);
    const month=$('timeMonth').value,ref=filter.value,status=$('timeStatus').value;
    const periodEntries=timeEntries.filter(e=>e.date.startsWith(month)&&(!ref||e.clientRef===ref));
    const open=periodEntries.filter(e=>!invoiceForTime(e.id));
    $('timeCount').textContent=String(timeEntries.filter(e=>!invoiceForTime(e.id)).length);
    $('automationCount').textContent=String(automationRules.filter(r=>r.enabled).length);
    $('timeHours').textContent=fixedHours(periodEntries.reduce((n,e)=>n+e.duration,0));
    $('timeOpenHours').textContent=fixedHours(open.reduce((n,e)=>n+e.duration,0));
    $('timeOpenTotal').textContent=money(open.reduce((n,e)=>n+timeAmount(e),0));
    const readyToGenerate=!!ref&&open.some(e=>e.duration>0);
    $('timeGenerate').disabled=!readyToGenerate;
    $('timeGenerateHint').textContent=!ref?'Choisis un seul client pour créer une facture mensuelle.':!open.length?'Aucune heure non facturée pour ce client et ce mois.':'Facture prête : '+open.length+' séance(s) non facturée(s) · '+money(open.reduce((n,e)=>n+timeAmount(e),0));
    const host=$('timeList');host.replaceChildren();
    let list=periodEntries.filter(e=>status==='all'||(status==='billed'?!!invoiceForTime(e.id):!invoiceForTime(e.id)));
    list=list.sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt||'').localeCompare(a.createdAt||''));
    for(const entry of list){
      const invoice=invoiceForTime(entry.id);const card=document.createElement('article');card.className='time-record';
      const meta=document.createElement('div');meta.className='time-record-main';
      const top=document.createElement('strong');top.textContent=`${dateFr(entry.date)} · ${entry.clientName||clientRefName(entry.clientRef)}`;
      const title=document.createElement('small');title.textContent=(entry.description||timeLabel(entry.kind))+' · '+fixedHours(entry.duration)+' × '+money(entry.rate)+' = '+money(timeAmount(entry));
      const foot=document.createElement('span');foot.className='time-record-status '+(invoice?'is-billed':'');foot.textContent=invoice?'Facturée · '+(invoice.payload?.number||'facture'):'À facturer';
      meta.append(top,title,foot);if(entry.note){const note=document.createElement('small');note.className='time-note';note.textContent='Note : '+entry.note;meta.append(note)}
      const actions=document.createElement('div');actions.className='time-record-actions';
      const edit=document.createElement('button');edit.type='button';edit.className='secondary';edit.textContent='Modifier';edit.disabled=!!invoice;
      edit.addEventListener('click',()=>{
        timeEditId=entry.id;timeClientOptions($('timeClient'));
        for(const [field,val] of [['timeDate',entry.date],['timeClient',entry.clientRef],['timeKind',entry.kind],['timeDuration',qtyString(entry.duration)],['timeRate',String(entry.rate)],['timeDescription',entry.description],['timeNote',entry.note]])$(field).value=val;
        $('timeFormTitle').textContent='Modifier la séance';$('timeCancel').hidden=false;$('timeSave').textContent='Enregistrer les modifications';$('timeForm').scrollIntoView({behavior:'smooth',block:'start'});$('timeDuration').focus({preventScroll:true});
      });
      const duplicate=document.createElement('button');duplicate.type='button';duplicate.className='secondary';duplicate.textContent='Dupliquer';
      duplicate.addEventListener('click',()=>{
        timeFormReset();for(const [field,val] of [['timeDate',entry.date],['timeClient',entry.clientRef],['timeKind',entry.kind],['timeDuration',qtyString(entry.duration)],['timeRate',String(entry.rate)],['timeDescription',entry.description],['timeNote',entry.note]])$(field).value=val;
        timeMsg('Séance copiée dans le formulaire : ajuste la date avant d’enregistrer.');$('timeForm').scrollIntoView({behavior:'smooth',block:'start'});
      });
      actions.append(edit,duplicate);
      if(!invoice){const del=document.createElement('button');del.type='button';del.textContent='Supprimer';del.className='danger';del.addEventListener('click',()=>{
        if(!confirm('Supprimer cette séance non facturée ?'))return;
        const next=timeEntries.filter(e=>e.id!==entry.id);if(!persist(timeKey,next))return;
        timeEntries=next;if(timeEditId===entry.id)timeFormReset();renderTime();timeMsg('Séance supprimée.');
      });actions.append(del)}
      card.append(meta,actions);host.append(card);
    }
    if(!list.length){const el=document.createElement('p');el.className='receipt-empty';el.textContent='Aucune séance pour ces filtres. Ajoute tes premières heures avec le formulaire ci-dessus.';host.append(el)}
  }
  function saveTime(event){
    event?.preventDefault();const date=$('timeDate').value,clientRef=$('timeClient').value,kind=$('timeKind').value;
    const hours=duration($('timeDuration').value),rateText=$('timeRate').value,rate=Number(rateText);
    if(!validDate(date)||!clientRef||!['with','without','custom'].includes(kind)||!String($('timeDuration').value).trim()||!Number.isFinite(hours)||hours<=0||hours>10000||!rateText.trim()||!Number.isFinite(rate)||rate<0||rate>1e7){timeMsg('Renseigne une date, un client, une durée positive valide et un tarif non négatif.',true);return}
    const old=timeEntries.find(e=>e.id===timeEditId);
    if(old&&invoiceForTime(old.id)){timeMsg('Cette séance est déjà associée à une facture émise et ne peut plus être modifiée.',true);return}
    const item={id:old?.id||uid(),date,clientRef,kind,duration:hours,rate:Math.round(rate*100)/100,
      clientName:clientRefName(clientRef),description:$('timeDescription').value.trim().slice(0,240),note:$('timeNote').value.trim().slice(0,400),createdAt:old?.createdAt||isoNow(),updatedAt:isoNow()};
    const next=old?timeEntries.map(e=>e.id===old.id?item:e):[...timeEntries,item];
    if(!persist(timeKey,next))return;
    timeEntries=next;const wasEdit=!!old;timeFormReset();$('timeMonth').value=date.slice(0,7);$('timeFilterClient').value=clientRef;
    renderTime();timeMsg(wasEdit?'Séance mise à jour.':'Séance enregistrée · '+fixedHours(hours)+' · '+money(timeAmount(item)));
  }
  function timeLineTitle(entry){
    if(entry.description)return entry.description;
    if(entry.clientRef==='sejer')return 'Service Profs en ligne - Heures de permanence '+(entry.kind==='with'?'en appel':entry.kind==='without'?'sans appel':'autre prestation');
    return entry.kind==='with'?'Cours particulier de philosophie':entry.kind==='without'?'Préparation / heures sans élève':'Prestation';
  }
  function generateTimeInvoice(){
    const period=$('timeMonth').value,ref=$('timeFilterClient').value;
    if(!ref){timeMsg('Sélectionne un client dans le filtre du registre.',true);return}
    const matching=timeEntries.filter(e=>e.date.startsWith(period)&&e.clientRef===ref&&!invoiceForTime(e.id)&&e.duration>0);
    if(!matching.length){timeMsg('Aucune séance non facturée à transformer.',true);renderTime();return}
    // Build one row per unique service and hourly rate. Each entry ID is still tracked.
    const groups=new Map();for(const e of matching){const name=timeLineTitle(e),key=JSON.stringify([name,e.rate,e.kind]);
      if(!groups.has(key))groups.set(key,{name,price:e.rate,quantity:0,italicEnabled:ref==='sejer',italicFrom:ref==='sejer'?'Heures de permanence':''});
      groups.get(key).quantity+=e.duration;
    }
    const newLines=[...groups.values()].map(l=>normalizeLine({...l,quantity:Math.round(l.quantity*10000)/10000}));
    // Avoid losing the user's current invoice work: autosave before switching.
    commitAutoSave();
    if(!confirm(`Créer une facture pour ${clientRefName(ref)} · ${period} avec ${matching.length} séance(s) et un total de ${money(matching.reduce((n,e)=>n+timeAmount(e),0))} ? Le brouillon actuel sera remplacé dans l'éditeur (l'historique déjà enregistré est conservé).`))return;
    const client=clients.find(c=>'client:'+c.id===ref);
    const document=clone(ref==='sejer'?presets.sejer:presets.private);
    if(ref!=='sejer'&&client){for(const key of ['client','clientAddress','project','validator','projectCode','terms','tax'])if(typeof client[key]==='string')document[key]=client[key]}
    document.lines=newLines;document.period=period;const date=iso(new Date());document.date=date;document.due=plusDays(date,30);document.number=nextNumber(date);
    currentPreset=ref==='sejer'?'sejer':'private';$('preset').value=currentPreset;
    activeInvoiceId=null;activeSignature='';autoNumber=true;timeSource=null;
    assignPreset(document);
    timeSource={ids:matching.map(e=>e.id),signature:timeEntrySignature(matching.map(e=>e.id)),linesSignature:signature(lines),period,client:document.client};
    setArea('editor');mode('express');queueAutoSave();
    showMessage('Facture préremplie depuis '+matching.length+' séance(s). Vérifie et télécharge le PDF ou le Word : les heures ne sont marquées « facturées » qu’après émission.');
  }
  function exportTimeCsv(){
    const period=$('timeMonth').value,ref=$('timeFilterClient').value,status=$('timeStatus').value;
    const subset=timeEntries.filter(e=>e.date.startsWith(period)&&(!ref||e.clientRef===ref)&&(status==='all'||(status==='billed'?!!invoiceForTime(e.id):!invoiceForTime(e.id)))).sort((a,b)=>a.date.localeCompare(b.date));
    downloadCSV(['Date','Client','Prestation','Durée (heures)','Tarif horaire (EUR)','Montant HT (EUR)','Statut','Référence facture','Description','Note interne'],subset.map(e=>{
      const inv=invoiceForTime(e.id);
      return [e.date,e.clientName||clientRefName(e.clientRef),timeLabel(e.kind),String(e.duration).replace('.',','),e.rate.toFixed(2).replace('.',','),timeAmount(e).toFixed(2).replace('.',','),inv?'Facturée':'Non facturée',inv?.payload?.number||'',e.description,e.note];
    }),`Philosophal-heures-${period}.csv`);
    timeMsg('CSV du registre téléchargé. Les heures et les notes internes restent sur ton appareil sauf export volontaire.');
  }
  function initTime(){
    $('timeMonth').value=iso(new Date()).slice(0,7);timeClientOptions($('timeClient'));timeClientOptions($('timeFilterClient'),true);
    timeFormReset();$('timeForm').addEventListener('submit',saveTime);
    $('timeCancel').addEventListener('click',timeFormReset);
    $('timeClient').addEventListener('change',()=>{$('timeRate').value=String(suggestedRate($('timeClient').value,$('timeKind').value))});
    $('timeKind').addEventListener('change',()=>{$('timeRate').value=String(suggestedRate($('timeClient').value,$('timeKind').value))});
    for(const id of ['timeMonth','timeFilterClient','timeStatus'])$(id).addEventListener('change',renderTime);
    $('timeGenerate').addEventListener('click',generateTimeInvoice);
    $('timeExportCsv').addEventListener('click',exportTimeCsv);
  }

  // V50 · Règles de préparation mensuelle. Toujours des BROUILLONS : aucun envoi ni émission automatique.
  const validAutomationRule=r=>r&&typeof r.id==='string'&&r.id.length<=150&&typeof r.name==='string'&&r.name.length<=100&&typeof r.clientRef==='string'&&r.clientRef.length<=160&&['hours','fixed'].includes(r.source)&&typeof r.template==='string'&&r.template.length<=180&&typeof r.enabled==='boolean';
  const validMonthClosure=c=>c&&typeof c.id==='string'&&/^month:\d{4}-\d{2}$/.test(c.id)&&typeof c.period==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(c.period)&&typeof c.note==='string'&&c.note.length<=500&&typeof c.updatedAt==='string'&&typeof c.prepared==='boolean';
  const validPeriod=p=>/^\d{4}-(0[1-9]|1[0-2])$/.test(String(p||''));
  function automationNotice(id,msg,warning=false){managerMessage(id,msg,warning)}
  function autoTemplateOptions(){
    const select=$('autoTemplate'),wanted=select.value;select.replaceChildren();
    for(const [value,label] of [['sejer','SEJER · Profs en ligne'],['private','Cours particuliers'],['blank','Personnalisé']])select.add(new Option(label,value));
    for(const t of templates)select.add(new Option('Mon modèle · '+t.name,'custom:'+t.id));
    if([...select.options].some(x=>x.value===wanted))select.value=wanted;
  }
  function autoClientOptions(){
    const select=$('autoClient'),wanted=select.value;timeClientOptions(select);
    if([...select.options].some(x=>x.value===wanted))select.value=wanted;
  }
  function clearAutomationRule(){
    editingRuleId='';$('autoName').value='';$('autoSource').value='hours';$('autoTemplate').value='sejer';$('autoClient').value='sejer';
    $('autoSaveRule').textContent='Enregistrer cette règle';$('autoCancelRule').hidden=true;
  }
  function editAutomationRule(id){
    const rule=automationRules.find(x=>x.id===id);if(!rule)return;
    autoClientOptions();autoTemplateOptions();editingRuleId=rule.id;
    $('autoName').value=rule.name;$('autoClient').value=rule.clientRef;$('autoSource').value=rule.source;$('autoTemplate').value=rule.template;
    $('autoSaveRule').textContent='Mettre à jour la règle';$('autoCancelRule').hidden=false;
    $('autoRuleForm').scrollIntoView({behavior:'smooth',block:'center'});$('autoName').focus({preventScroll:true});
  }
  function storeAutomationRule(){
    const name=$('autoName').value.trim(),clientRef=$('autoClient').value,source=$('autoSource').value,template=$('autoTemplate').value;
    if(!name||!clientRef||!['hours','fixed'].includes(source)||!template){automationNotice('autoMessage','Renseigne le nom, le client, le type et le modèle.',true);return}
    if(clientRef!=='sejer'&&!clients.some(x=>'client:'+x.id===clientRef)){automationNotice('autoMessage','Le client sélectionné est introuvable.',true);return}
    if(template.startsWith('custom:')&&!templates.some(x=>'custom:'+x.id===template)){automationNotice('autoMessage','Ce modèle a été supprimé.',true);return}
    const old=automationRules.find(x=>x.id===editingRuleId),record={id:old?.id||uid(),name,clientRef,source,template,enabled:old?.enabled??true,updatedAt:isoNow()};
    const next=old?automationRules.map(x=>x.id===old.id?record:x):[...automationRules,record];
    if(!persist(automationKey,next))return;
    automationRules=next;clearAutomationRule();renderAutomation();automationNotice('autoMessage','Règle enregistrée. Elle préparera des brouillons uniquement après ton accord.');
  }
  function templateForAutomation(rule){
    const custom=rule.template.startsWith('custom:')?templates.find(x=>'custom:'+x.id===rule.template):null;
    return custom?.content||(rule.template.startsWith('custom:')?null:presets[rule.template]);
  }
  function buildAutomationCandidates(period,date){
    const candidates=[],seen=new Set();
    for(const rule of automationRules.filter(x=>x.enabled)){
      const entry={rule,ready:false,reason:'',payload:null,ids:[],total:0,clientName:''};candidates.push(entry);
      if(!validPeriod(period)||!validDate(date)){entry.reason='Indique un mois et une date valides.';continue}
      const client=rule.clientRef==='sejer'?null:clients.find(x=>'client:'+x.id===rule.clientRef);
      if(rule.clientRef!=='sejer'&&!client){entry.reason='Profil client introuvable.';continue}
      const clientName=rule.clientRef==='sejer'?presets.sejer.client:client.client;entry.clientName=clientName;
      const identity=(clientName||'').trim().toLocaleLowerCase('fr');
      if(seen.has(identity)){entry.reason='Plusieurs règles pour ce client : une seule facture mensuelle est préparée.';continue}
      if(invoices.some(i=>i.payload?.period===period&&(i.automation?.clientRef===rule.clientRef||(i.payload?.client||'').trim().toLocaleLowerCase('fr')===identity))){entry.reason='Une facture ou un brouillon existe déjà pour ce client et ce mois.';continue}
      const base=templateForAutomation(rule);
      if(!base){entry.reason='Le modèle associé n’existe plus.';continue}
      let serviceLines=[];
      if(rule.source==='hours'){
        const matched=timeEntries.filter(x=>x.clientRef===rule.clientRef&&x.date.startsWith(period)&&x.duration>0&&!invoiceForTime(x.id));
        if(!matched.length){entry.reason='Aucune séance non facturée pour ce mois.';continue}
        if(matched.length>1999){entry.reason='Trop de séances ; sépare cette période.';continue}
        const groups=new Map();
        for(const x of matched){const title=timeLineTitle(x),key=JSON.stringify([title,x.rate,x.kind]);
          if(!groups.has(key))groups.set(key,{name:title,quantity:0,price:x.rate,italicEnabled:rule.clientRef==='sejer',italicFrom:rule.clientRef==='sejer'?'Heures de permanence':''});
          groups.get(key).quantity+=x.duration;
        }
        serviceLines=[...groups.values()].map(x=>normalizeLine({...x,quantity:Math.round(x.quantity*10000)/10000}));
        entry.ids=matched.map(x=>x.id);
      }else{
        serviceLines=(base.lines||[]).map(normalizeLine).filter(x=>x.quantity>0&&x.name.trim());
        if(!serviceLines.length){entry.reason='Quantités nulles : complète les lignes du modèle avant de préparer.';continue}
      }
      if(serviceLines.length>250){entry.reason='Plus de 250 lignes : répartis les prestations.';continue}
      let payload=migrate(clone(base));
      if(client){
        for(const key of ['client','clientAddress','project','validator','projectCode','terms','tax'])if(typeof client[key]==='string')payload[key]=client[key];
      }
      payload.client=clientName;payload.lines=serviceLines;payload.period=period;payload.date=date;payload.due=plusDays(date,30);payload.number='';
      const total=textTotal(payload);
      if(!Number.isFinite(total)||total<=0||total>1e10){entry.reason='Montant nul ou invalide : vérifie le modèle et les tarifs.';continue}
      entry.ready=true;entry.payload=payload;entry.total=total;seen.add(identity);
    }
    return candidates;
  }
  function monthCloseStats(period){
    const monthHours=timeEntries.filter(x=>x.date.startsWith(period)),open=monthHours.filter(x=>!invoiceForTime(x.id));
    const current=invoices.filter(x=>x.payload?.period===period),drafts=current.filter(x=>x.status==='draft'),issued=current.filter(x=>x.status!=='draft');
    const remaining=issued.filter(x=>getInvoiceBalance(x).balance>0);
    return {hours:monthHours.length,open,issued,drafts,remaining};
  }
  function renderAutomation(){
    autoClientOptions();autoTemplateOptions();renderCounters();
    const host=$('autoRuleList');host.replaceChildren();
    for(const rule of automationRules){
      const title=rule.name,sub=clientRefName(rule.clientRef)+' · '+(rule.source==='hours'?'Heures du registre':'Modèle fixe')+(rule.enabled?'':' · En pause');
      appendRecord(host,{title,subtitle:sub,actions:[[rule.enabled?'Mettre en pause':'Réactiver',()=>{
        const next=automationRules.map(x=>x.id===rule.id?{...x,enabled:!x.enabled,updatedAt:isoNow()}:x);
        if(persist(automationKey,next)){automationRules=next;renderAutomation()}
      }],['Modifier',()=>editAutomationRule(rule.id)],['Supprimer',()=>{
        if(!confirm('Supprimer la règle « '+rule.name+' » ? Les factures déjà préparées seront conservées.'))return;
        const next=automationRules.filter(x=>x.id!==rule.id);
        if(persist(automationKey,next)){automationRules=next;if(editingRuleId===rule.id)clearAutomationRule();renderAutomation()}
      },'danger']]});
    }
    if(!automationRules.length){const p=document.createElement('p');p.className='record-empty';p.textContent='Aucune règle : crée par exemple « SEJER · permanence mensuelle » pour retrouver tes heures chaque mois.';host.append(p)}
    const period=$('autoMonth').value,date=$('autoDate').value;
    generationPreview=buildAutomationCandidates(period,date);
    const ready=generationPreview.filter(x=>x.ready),blocked=generationPreview.filter(x=>!x.ready);
    $('autoReadyCount').textContent=String(ready.length);$('autoTotalAmount').textContent=money(ready.reduce((n,x)=>n+x.total,0));$('autoBlockedCount').textContent=String(blocked.length);
    $('autoGenerate').disabled=!ready.length;$('autoGenerate').textContent=`Créer ${ready.length} brouillon${ready.length>1?'s':''} du mois`;
    const list=$('autoCandidates');list.replaceChildren();
    for(const item of generationPreview){
      const el=document.createElement('article');el.className='automation-candidate'+(item.ready?' is-ready':' is-blocked');
      const info=document.createElement('div'),label=document.createElement('strong'),detail=document.createElement('small');
      label.textContent=item.rule.name;detail.textContent=item.ready?`${item.clientName} · ${money(item.total)} · ${item.rule.source==='hours'?item.ids.length+' séance(s)':'modèle fixe'}`:item.reason;
      info.append(label,detail);const pill=document.createElement('span');pill.textContent=item.ready?'Prête':'À vérifier';el.append(info,pill);list.append(el);
    }
    if(!generationPreview.length){const el=document.createElement('p');el.className='record-empty';el.textContent='Ajoute une règle récurrente pour afficher les factures à préparer.';list.append(el)}
    const stats=monthCloseStats(period),checks=$('autoCloseChecks');checks.replaceChildren();
    for(const [label,value,okay] of [
      ['Séances non facturées',stats.open.length,stats.open.length===0],
      ['Brouillons à relire',stats.drafts.length,stats.drafts.length===0],
      ['Factures émises pour ce mois',stats.issued.length,true],
      ['Factures restant à encaisser',stats.remaining.length,true]]){
      const item=document.createElement('div');item.className='automation-check'+(okay?' is-ok':' is-attention');
      const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=String(value);item.append(a,b);checks.append(item);
    }
    const existing=monthClosures.find(x=>x.id==='month:'+period);
    const label=document.createElement('p');label.className='helper';
    label.textContent=existing?`Contrôle enregistré le ${new Date(existing.updatedAt).toLocaleDateString('fr-FR')} · ${existing.prepared?'aucune séance en attente ni brouillon lors du contrôle':'des éléments restaient à vérifier lors du contrôle'}.`:'Aucun contrôle de fin de mois enregistré.';
    checks.append(label);
  }
  function generateAutomationBatch(){
    const period=$('autoMonth').value,date=$('autoDate').value;
    const ready=buildAutomationCandidates(period,date).filter(x=>x.ready);
    if(!ready.length){automationNotice('autoMessage','Aucun brouillon à préparer. Vérifie les règles et les séances.',true);renderAutomation();return}
    if(!confirm(`Préparer ${ready.length} brouillon(s) pour ${period}, total estimé ${money(ready.reduce((s,x)=>s+x.total,0))} ? Aucun document ne sera envoyé ni marqué comme émis. Les références seront réservées dans l’historique.`))return;
    const copy=[...invoices],year=date.slice(0,4),stamp=isoNow();
    let seq=Math.max(Number(numberCounters[year])||0,0);
    for(const inv of copy){const match=String(inv.payload?.number||'').match(new RegExp('^'+year+'-(\\d{4})-FV$','i'));if(match)seq=Math.max(seq,Number(match[1]));}
    const created=[];
    for(const c of ready){
      let number='';do{seq++;number=`${year}-${String(seq).padStart(4,'0')}-FV`;}while(copy.some(i=>(i.payload?.number||'').toLowerCase()===number.toLowerCase()));
      const payload={...c.payload,number};
      const source=c.ids.length?{ids:c.ids,signature:timeEntrySignature(c.ids),linesSignature:signature(payload.lines),period,client:payload.client}:null;
      const record={id:uid(),status:'draft',createdAt:stamp,updatedAt:stamp,exportedAt:null,preset:c.rule.template,payload:clone(payload),payments:[],timeEntryIds:[],timeSource:source,automation:{ruleId:c.rule.id,clientRef:c.rule.clientRef,period}};
      created.push(record);copy.unshift(record);
    }
    if(!persist(historyKey,copy))return;
    invoices=copy;numberCounters={...numberCounters,[year]:seq};persist(counterKey,numberCounters);
    renderHistory();renderTime();renderDashboard();renderReports();renderAutomation();
    automationNotice('autoMessage',`${created.length} brouillon(s) créé(s) dans l’historique. Ouvre chaque document, vérifie les informations, puis exporte-le pour l’émettre. Les heures restent non facturées jusque-là.`);
  }
  function saveMonthClosure(){
    const period=$('autoMonth').value;
    if(!validPeriod(period)){automationNotice('autoCloseMessage','Choisis un mois valide.',true);return}
    const stats=monthCloseStats(period),prepared=stats.open.length===0&&stats.drafts.length===0;
    const entry={id:'month:'+period,period,updatedAt:isoNow(),prepared,note:$('autoCloseNote').value.slice(0,500),counts:{hours:stats.hours,openHours:stats.open.length,drafts:stats.drafts.length,issued:stats.issued.length,pendingPayments:stats.remaining.length}};
    const next=[...monthClosures.filter(x=>x.id!==entry.id),entry];if(!persist(closeKey,next))return;
    monthClosures=next;renderAutomation();automationNotice('autoCloseMessage',prepared?'Contrôle mensuel enregistré. Aucune séance non facturée ni brouillon au moment du contrôle.':'Contrôle enregistré avec éléments à vérifier : ce mois n’est pas marqué prêt.',!prepared);
  }
  function downloadMonthClose(){
    const period=$('autoMonth').value;if(!validPeriod(period))return;
    const stats=monthCloseStats(period);
    const info=[['Mois',period],['Séances enregistrées',stats.hours],['Séances non facturées',stats.open.length],['Brouillons',stats.drafts.length],['Factures émises',stats.issued.length],['Montant des factures émises (EUR)',stats.issued.reduce((n,x)=>n+textTotal(x.payload),0).toFixed(2).replace('.',',')],['Factures non soldées',stats.remaining.length],['Note interne',$('autoCloseNote').value]];
    downloadCSV(['Indicateur','Valeur'],info,`Philosophal-cloture-${period}.csv`);
    automationNotice('autoCloseMessage','Récapitulatif CSV téléchargé. Il s’agit d’un contrôle interne, pas d’une déclaration fiscale.');
  }
  function initAutomation(){
    $('autoMonth').value=iso(new Date()).slice(0,7);$('autoDate').value=iso(new Date());
    autoClientOptions();autoTemplateOptions();clearAutomationRule();
    $('autoNewRule').addEventListener('click',()=>{clearAutomationRule();$('autoName').focus()});
    $('autoCancelRule').addEventListener('click',clearAutomationRule);
    $('autoSaveRule').addEventListener('click',storeAutomationRule);
    for(const id of ['autoMonth','autoDate'])$(id).addEventListener('change',()=>{
      if(id==='autoMonth')$('autoCloseNote').value=monthClosures.find(c=>c.period===$('autoMonth').value)?.note||'';
      renderAutomation();
    });
    $('autoRefresh').addEventListener('click',renderAutomation);
    $('autoGenerate').addEventListener('click',generateAutomationBatch);
    $('autoHistory').addEventListener('click',()=>setArea('history'));
    $('autoCloseSave').addEventListener('click',saveMonthClosure);
    $('autoCloseDownload').addEventListener('click',downloadMonthClose);
    $('autoCloseNote').value=monthClosures.find(c=>c.period===$('autoMonth').value)?.note||'';
    renderAutomation();
  }

  // V47 · Règlements, relances manuelles, avoirs. Le document initial reste immuable.
  const addDays=(date,days)=>{
    if(!validDate(date)||!Number.isInteger(days)||days<0||days>3650)return '';
    const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return iso(d);
  };
  const safeEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim())&&String(value).length<=250;
  const creditCents=id=>credits.filter(c=>c.invoiceId===id).reduce((n,c)=>n+c.cents,0);
  const availableCreditCents=entry=>Math.max(0,invoiceCents(entry)-creditCents(entry.id));
  function validCollection(c){
    return c&&typeof c==='object'&&!Array.isArray(c)&&typeof(c.dueDate||'')==='string'&&(!c.dueDate||validDate(c.dueDate))&&typeof(c.email||'')==='string'&&c.email.length<=250&&(!c.reminders||Array.isArray(c.reminders)&&c.reminders.length<=300&&c.reminders.every(r=>r&&validDate(r.date)&&typeof r.type==='string'&&r.type.length<=30&&typeof r.subject==='string'&&r.subject.length<=180&&typeof r.body==='string'&&r.body.length<=9000));
  }
  function validCredit(c){
    return c&&typeof c.id==='string'&&c.id.length<200&&typeof c.invoiceId==='string'&&c.invoiceId.length<200&&typeof c.number==='string'&&/^AV-\d{4}-\d{4}$/.test(c.number)&&validDate(c.date)&&Number.isSafeInteger(c.cents)&&c.cents>0&&c.cents<1e12&&typeof c.reason==='string'&&c.reason.length<=550&&c.payload&&c.payload.documentKind==='credit'&&Array.isArray(c.payload.lines)&&c.payload.lines.length<=250&&toCents(textTotal(c.payload))===-c.cents;
  }
  function dueForInvoice(entry){
    const c=entry.collection;
    if(c&&Object.prototype.hasOwnProperty.call(c,'dueDate'))return validDate(c.dueDate)?c.dueDate:'';
    const d=entry.payload;
    if(d.showDue&&validDate(d.due))return d.due;
    const terms=String(d.terms||'');if(/fin de mois|fin du mois|jours ouvr[eé]s|jours ouvrables|r[eé]ception/i.test(terms))return '';
    const match=terms.match(/(?:à|sous|dans|de|délai de)\s*(\d{1,3})\s*jours?\b/i);
    return match?addDays(d.date,Number(match[1])):'';
  }
  function dueInfo(entry){
    const due=dueForInvoice(entry),balance=Math.round(getInvoiceBalance(entry).balance*100),todayText=iso(new Date());
    if(balance<=0)return {key:'settled',label:creditCents(entry.id)?'Soldée ou neutralisée par avoir':'Réglée',due};
    if(!due)return {key:'unknown',label:'Échéance à renseigner',due:''};
    if(due<todayText)return {key:'late',label:'En retard depuis le '+dateFr(due),due};
    if(due<=addDays(todayText,7))return {key:'soon',label:'Échéance le '+dateFr(due),due};
    return {key:'future',label:'Échéance le '+dateFr(due),due};
  }
  function persistInvoiceCollection(id,newCollection){
    const next=invoices.map(i=>i.id===id?{...i,collection:newCollection,updatedAt:isoNow()}:i);
    if(!persist(historyKey,next))return false;
    invoices=next;renderCollection();renderHistory();renderDashboard();renderCounters();return true;
  }
  function renderCollection(){
    if(!$('collectionList'))return;
    const all=invoices.filter(i=>i.status!=='draft');
    const open=all.filter(i=>getInvoiceBalance(i).balance>0);
    const late=open.filter(i=>dueInfo(i).key==='late');
    $('collectionLateCount').textContent=String(late.length);
    $('collectionLateTotal').textContent=money(late.reduce((n,i)=>n+getInvoiceBalance(i).balance,0));
    $('collectionOpenTotal').textContent=money(open.reduce((n,i)=>n+getInvoiceBalance(i).balance,0));
    const q=$('collectionSearch').value.toLocaleLowerCase('fr').trim(),filter=$('collectionFilter').value;
    const filtered=all.filter(i=>{
      const info=dueInfo(i);
      return (filter==='all'||(filter==='open'&&getInvoiceBalance(i).balance>0)||info.key===filter)&&(!q||[i.payload.client,i.payload.number,i.payload.validator].join(' ').toLocaleLowerCase('fr').includes(q));
    }).sort((a,b)=>{
      const da=dueForInvoice(a)||'9999',db=dueForInvoice(b)||'9999';return da.localeCompare(db)||String(a.payload.number).localeCompare(String(b.payload.number));
    });
    const host=$('collectionList');host.replaceChildren();
    for(const invoice of filtered){
      const info=dueInfo(invoice),bal=getInvoiceBalance(invoice),count=invoice.collection?.reminders?.length||0;
      const actions=[['Date / contact',()=>openCollectionDialog(invoice.id)]];
      if(bal.balance>0)actions.push(['Préparer une relance',()=>openReminderDialog(invoice.id)]);
      if(availableCreditCents(invoice)>0)actions.push(['Créer un avoir',()=>openCreditDialog(invoice.id)]);
      actions.push(['Dupliquer pour corriger',()=>duplicateHistory(invoice.id)]);
      appendRecord(host,{title:invoice.payload.number+' · '+info.label,subtitle:`${invoice.payload.client||'Destinataire'} · Solde ${money(bal.balance)} · ${count} relance(s) notée(s)`+(creditCents(invoice.id)?' · Avoirs '+euroCents(creditCents(invoice.id)):'') ,actions});
    }
    if(!filtered.length){const el=document.createElement('div');el.className='record-empty';el.textContent='Aucune facture ne correspond à ce filtre.';host.append(el)}
    renderCounters();
  }
  let activeCollectionId='',activeReminderId='',activeCreditId='';
  function showDialog(id){const d=$(id);if(!d.open){if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','')}}
  function hideDialog(id){const d=$(id);if(d.open&&typeof d.close==='function')d.close();else d.removeAttribute('open')}
  function openCollectionDialog(id){
    const entry=invoices.find(i=>i.id===id);if(!entry||entry.status==='draft')return;
    activeCollectionId=id;$('collectionDialogCaption').textContent=`${entry.payload.number} · ${entry.payload.client}`;
    $('collectionDue').value=dueForInvoice(entry);$('collectionEmail').value=entry.collection?.email||'';
    $('collectionDialogError').textContent='';showDialog('collectionDialog');
  }
  function closeCollectionDialog(){hideDialog('collectionDialog');activeCollectionId=''}
  function saveCollection(){
    const entry=invoices.find(i=>i.id===activeCollectionId);if(!entry)return;
    const date=$('collectionDue').value,email=$('collectionEmail').value.trim();
    if(date&&!validDate(date)){$('collectionDialogError').textContent='Date invalide.';return}
    if(email&&!safeEmail(email)){$('collectionDialogError').textContent='Adresse e-mail invalide.';return}
    const collection={...entry.collection,dueDate:date,email,reminders:entry.collection?.reminders||[]};
    if(persistInvoiceCollection(entry.id,collection))closeCollectionDialog();
  }
  function reminderContents(entry,tone){
    const due=dueForInvoice(entry),amount=money(getInvoiceBalance(entry).balance),name=entry.payload.client||'Madame, Monsieur',number=entry.payload.number;
    const intro=tone==='formal'?'Madame, Monsieur,':`Bonjour,`;
    const subject=`${tone==='formal'?'Relance de règlement':'Suivi de facture'} · ${number}`;
    const line=tone==='followup'?`Je me permets de revenir vers vous au sujet de la facture ${number} d'un montant restant dû de ${amount}.`:
      tone==='formal'?`Sauf erreur de ma part, la facture ${number} présente un solde non réglé de ${amount}.`:
      `Je vous écris au sujet de la facture ${number} : un solde de ${amount} apparaît encore en attente dans mon suivi.`;
    const paragraph=due?`La date de règlement renseignée est le ${dateFr(due)}.`:'Je peux vous communiquer les détails du règlement si nécessaire.';
    const outro=tone==='formal'?'Je vous remercie de bien vouloir me préciser la date de règlement prévue.':"N'hésitez pas à me signaler si le règlement a déjà été effectué.";
    return {subject,body:`${intro}\n\n${line}\n${paragraph}\n\n${outro}\n\nBien cordialement,\n${entry.payload.issuer||'Philosophal'}`};
  }
  function refreshReminderText(){
    const entry=invoices.find(i=>i.id===activeReminderId);if(!entry)return;
    const proposal=reminderContents(entry,$('reminderTone').value);
    $('reminderSubject').value=proposal.subject;$('reminderBody').value=proposal.body;
  }
  function renderReminderLog(entry){
    const list=$('reminderLog');list.replaceChildren();
    const logs=entry.collection?.reminders||[];
    const label=document.createElement('strong');label.textContent=`Relances enregistrées : ${logs.length}`;list.append(label);
    for(const r of logs.slice(-4).reverse()){const p=document.createElement('p');p.textContent=`${dateFr(r.date)} · ${r.subject}`;list.append(p)}
  }
  function openReminderDialog(id){
    const entry=invoices.find(i=>i.id===id);if(!entry||entry.status==='draft'||getInvoiceBalance(entry).balance<=0)return;
    activeReminderId=id;$('reminderCaption').textContent=`${entry.payload.client||'Client'} · ${entry.payload.number} · Reste ${money(getInvoiceBalance(entry).balance)}`;
    $('reminderEmail').value=entry.collection?.email||'';$('reminderTone').value='friendly';refreshReminderText();renderReminderLog(entry);
    $('reminderMessage').textContent='';showDialog('reminderDialog');
  }
  function closeReminderDialog(){hideDialog('reminderDialog');activeReminderId=''}
  function reminderMail(){
    const email=$('reminderEmail').value.trim();if(!safeEmail(email)){$('reminderMessage').textContent='Renseigne une adresse e-mail valide.';return}
    const subject=$('reminderSubject').value,body=$('reminderBody').value;
    if(!subject.trim()||!body.trim()){$('reminderMessage').textContent='Renseigne l’objet et le message.';return}
    location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    $('reminderMessage').textContent='Message préparé dans ta messagerie. L’envoi n’est pas confirmé : utilise « Noter la relance comme envoyée » après l’envoi réel.';
  }
  async function reminderCopy(){
    const s=$('reminderSubject').value+'\n\n'+$('reminderBody').value;
    try{await navigator.clipboard.writeText(s);$('reminderMessage').textContent='Objet et message copiés.'}
    catch{$('reminderBody').focus();$('reminderBody').select();$('reminderMessage').textContent='Copie le texte sélectionné (Ctrl+C).'}
  }
  function recordReminder(){
    const entry=invoices.find(i=>i.id===activeReminderId);if(!entry)return;
    const subject=$('reminderSubject').value.trim(),body=$('reminderBody').value.trim(),email=$('reminderEmail').value.trim();
    if(!subject||!body){$('reminderMessage').textContent='Le message ne peut pas être vide.';return}
    if(email&&!safeEmail(email)){$('reminderMessage').textContent='Adresse e-mail invalide.';return}
    if(!confirm('Confirmer que cette relance a déjà été envoyée ? Cette action n’envoie aucun e-mail.'))return;
    const date=iso(new Date());const item={date,type:$('reminderTone').value,subject:subject.slice(0,180),body:body.slice(0,9000)};
    const collection={...entry.collection,email,reminders:[...(entry.collection?.reminders||[]),item]};
    if(!persistInvoiceCollection(entry.id,collection))return;
    const updated=invoices.find(i=>i.id===entry.id);renderReminderLog(updated);$('reminderMessage').textContent='Relance notée dans le suivi (aucun envoi automatique).';
  }
  function creditNumber(date){
    const y=date.slice(0,4);let n=Math.max(0,...credits.filter(c=>c.number.startsWith('AV-'+y+'-')).map(c=>Number(c.number.slice(-4))||0))+1;
    return `AV-${y}-${String(n).padStart(4,'0')}`;
  }
  function creditPayload(entry,credit){
    const base=clone(entry.payload);const full=credit.cents===invoiceCents(entry)&&creditCents(entry.id)===0;
    const descriptions=full?base.lines.map(l=>({...l,price:-Math.abs(Number(l.price)),italicEnabled:!!l.italicEnabled})):
      [{name:'Avoir partiel sur facture '+base.number+' — '+credit.reason,quantity:1,price:-credit.cents/100,italicEnabled:false,italicFrom:''}];
    return {...base,documentKind:'credit',docTitle:'AVOIR',number:credit.number,date:credit.date,showDue:false,due:'',rib:'',
      project:`Avoir relatif à la facture ${base.number} du ${dateFr(base.date)}`,
      projectCode:credit.reason,validator:'',closing:'Document d’avoir à conserver avec la facture d’origine.',
      terms:'Référence facture initiale : '+base.number+'\nCet avoir ne constitue pas un justificatif de remboursement.',lines:descriptions};
  }
  function buildCreditPayload(entry,amount,date,reason){
    const draft={invoiceId:entry.id,number:creditNumber(date),date,cents:amount,reason};
    const payload=creditPayload(entry,draft);
    if(toCents(textTotal(payload))!==-amount)throw new Error('Le montant du document est incohérent.');
    return {...draft,payload};
  }
  function openCreditDialog(id){
    const entry=invoices.find(i=>i.id===id);if(!entry||entry.status==='draft')return;
    const left=availableCreditCents(entry);if(left<=0){alert('La totalité de cette facture a déjà été créditée.');return}
    activeCreditId=id;$('creditDate').value=iso(new Date());$('creditAmount').value=(left/100).toFixed(2);
    $('creditReason').value='Correction de la facture '+entry.payload.number;
    $('creditCaption').textContent=`${entry.payload.number} · ${entry.payload.client} · Maximum ${euroCents(left)}`;
    $('creditError').textContent='';creditPreview();showDialog('creditDialog');
  }
  function closeCreditDialog(){hideDialog('creditDialog');activeCreditId=''}
  function creditPreview(){
    const entry=invoices.find(i=>i.id===activeCreditId);if(!entry)return;
    const amount=toCents($('creditAmount').value),date=$('creditDate').value;
    const text=`Référence proposée : ${validDate(date)?creditNumber(date):'date invalide'} · Montant de l'avoir : ${euroCents(amount)} · Solde maximum créditable : ${euroCents(availableCreditCents(entry))}`;
    $('creditPreview').textContent=text;
  }
  function issueCredit(){
    const entry=invoices.find(i=>i.id===activeCreditId);if(!entry||entry.status==='draft')return;
    const date=$('creditDate').value,raw=$('creditAmount').value,reason=$('creditReason').value.trim(),cents=toCents(raw),max=availableCreditCents(entry);
    if(!validDate(date)){$('creditError').textContent='Renseigne une date valide.';return}
    if(!raw.trim()||!Number.isFinite(Number(raw))||cents<=0||cents>max||cents>1e11){$('creditError').textContent='Le montant doit être positif et ne pas dépasser '+euroCents(max)+'.';return}
    if(!reason){$('creditError').textContent='Indique un motif pour cet avoir.';return}
    let draft;try{draft=buildCreditPayload(entry,cents,date,reason)}catch(error){$('creditError').textContent=error.message;return}
    const excess=Math.max(0,paymentSum(entry)-(invoiceCents(entry)-creditCents(entry.id)-cents));
    if(!confirm(`Créer et archiver l’avoir ${draft.number} de ${euroCents(cents)} pour la facture ${entry.payload.number} ? L’opération n’est pas réversible dans cet outil.${excess?'\n\nAttention : des paiements enregistrés dépasseront le montant net de la facture de '+euroCents(excess)+'. Le remboursement éventuel est à gérer séparément.':''}`))return;
    const item={...draft,id:uid(),createdAt:isoNow()};
    const blob=window.PhilosophalInvoicePDF?.create(item.payload,detailParts);
    if(!blob){$('creditError').textContent='Le moteur PDF ne répond pas : avoir non enregistré.';return}
    const next=[item,...credits];if(!persist(creditKey,next)){$('creditError').textContent='Stockage indisponible : avoir non enregistré.';return}
    credits=next;download(blob,'Avoir-'+item.number+'.pdf');renderCredits();renderCollection();renderHistory();renderDashboard();renderCounters();closeCreditDialog();setArea('credits');
    managerMessage('creditsMessage','Avoir '+item.number+' émis et archivé. Conserve le document PDF avec la facture initiale.');
  }
  function exportCredit(id,type){
    const item=credits.find(c=>c.id===id);if(!item)return;
    try{if(type==='pdf')download(window.PhilosophalInvoicePDF.create(item.payload,detailParts),'Avoir-'+item.number+'.pdf');
    else exportWord(item.payload,'Avoir-'+item.number+'.docx')}
    catch(error){console.error(error);managerMessage('creditsMessage','Export impossible : '+error.message,true)}
  }
  function renderCredits(){
    if(!$('creditsList'))return;
    $('creditsTotal').textContent=money(credits.reduce((n,c)=>n+c.cents/100,0));
    const host=$('creditsList');host.replaceChildren();
    for(const c of [...credits].sort((a,b)=>b.date.localeCompare(a.date)||b.number.localeCompare(a.number))){
      const ref=invoices.find(i=>i.id===c.invoiceId);
      appendRecord(host,{title:c.number+' · '+euroCents(c.cents),subtitle:`${dateFr(c.date)} · ${c.payload.client||'Client'} · Facture ${ref?.payload.number||'introuvable'} · ${c.reason}`,
      actions:[['PDF',()=>exportCredit(c.id,'pdf')],['Word',()=>exportCredit(c.id,'word')],['Voir la facture',()=>ref?openHistory(ref.id):null]]});
    }
    if(!credits.length){const empty=document.createElement('div');empty.className='record-empty';empty.textContent='Aucun avoir émis. Depuis une facture archivée, utilise « Créer un avoir ». ';host.append(empty)}
    renderCounters();
  }
  function exportCreditsCSV(){
    const {year,client}=dashboardFilter();const selected=credits.filter(c=>c.date.startsWith(year+'-')&&(!client||c.payload.client===client));
    downloadCSV(['Numéro avoir','Date avoir','Référence facture','Date facture','Client','Motif','Montant HT (EUR)'],selected.map(c=>{
      const invoice=invoices.find(i=>i.id===c.invoiceId);
      return [c.number,c.date,invoice?.payload.number||'',invoice?.payload.date||'',c.payload.client,c.reason,(c.cents/100).toFixed(2).replace('.',',')];
    }),`Philosophal-avoirs-${year}.csv`);
    $('dashboardCsvInfo').textContent='CSV des avoirs téléchargé (émission des avoirs pour l’année sélectionnée).';
  }
  function initV47(){
    $('collectionFilter').addEventListener('change',renderCollection);$('collectionSearch').addEventListener('input',renderCollection);
    $('collectionClose').addEventListener('click',closeCollectionDialog);$('collectionCancel').addEventListener('click',closeCollectionDialog);$('collectionSave').addEventListener('click',saveCollection);
    $('reminderClose').addEventListener('click',closeReminderDialog);$('reminderTone').addEventListener('change',refreshReminderText);
    $('reminderCopy').addEventListener('click',reminderCopy);$('reminderMail').addEventListener('click',reminderMail);$('reminderMark').addEventListener('click',recordReminder);
    $('creditClose').addEventListener('click',closeCreditDialog);$('creditCancel').addEventListener('click',closeCreditDialog);
    $('creditIssue').addEventListener('click',issueCredit);$('creditDate').addEventListener('input',creditPreview);$('creditAmount').addEventListener('input',creditPreview);
    for(const id of ['collectionDialog','reminderDialog','creditDialog']){
      $(id).addEventListener('click',event=>{if(event.target===$(id))hideDialog(id)});
    }
  }

  // V48 · Préparation à l'interopérabilité : export structuré NON réglementaire.
  function exchangeChecks(d){
    const checks=[
      ['Numéro de facture',Boolean(String(d.number||'').trim())],
      ["Date d’émission",/^\d{4}-\d{2}-\d{2}$/.test(String(d.date||''))],
      ['Nom du vendeur',Boolean(String(d.issuer||'').trim())],
      ['SIRET du vendeur (14 chiffres)',/^\d{14}$/.test(String(d.siret||'').replace(/\s/g,''))],
      ["Identité de l’acheteur",Boolean(String(d.client||'').trim())],
      ['Prestations avec description',Array.isArray(d.lines)&&d.lines.length>0&&d.lines.every(l=>String(l.name||'').trim())],
      ['Montants cohérents',Array.isArray(d.lines)&&d.lines.length>0&&d.lines.every(l=>Number.isFinite(Number(l.quantity))&&Number(l.quantity)>=0&&Number.isFinite(Number(l.price))&&Number(l.price)>=0)],
      ['Conditions de paiement',Boolean(String(d.terms||'').trim())],
      ['Régime de TVA / mention fiscale',Boolean(String(d.tax||'').trim())]
    ];
    return checks;
  }
  function updateExchangeUI(){
    const d=data(),checks=exchangeChecks(d),el=$('exchangeChecks');if(!el)return;
    el.textContent='';
    for(const [title,ok] of checks){const node=document.createElement('div');node.className='exchange-check '+(ok?'is-valid':'is-missing');node.textContent=(ok?'✓ ':'À compléter : ')+title;el.append(node)}
    $('exchangeScore').textContent=checks.filter(row=>row[1]).length+' / '+checks.length+' champs présents';
  }
  function exportExchange(){
    const d=data(),checks=exchangeChecks(d);
    if(!checks.every(c=>c[1])){
      if(!confirm('Certaines informations de la facture sont manquantes. Télécharger malgré tout les données de préparation (non conformes pour une transmission réglementaire) ?'))return;
    }
    const snapshot={
      format:'philosophal-preparation-facture-v1',version:1,exportedAt:isoNow(),
      notice:'Fichier de travail interne, ni Factur-X ni EN16931, sans transmission à une plateforme agréée.',
      currency:'EUR',invoice:{number:d.number,date:d.date,due:d.due||null,showDue:Boolean(d.showDue),period:d.period||null},
      issuer:{name:d.issuer,siret:d.siret,address:d.address,contact:d.contact},
      recipient:{name:d.client,address:d.clientAddress,project:d.project,validator:d.validator,projectCode:d.projectCode},
      lines:(d.lines||[]).map((l,index)=>({line:index+1,description:l.name,quantity:l.quantity,unit:'heure ou unité (à confirmer)',unitPriceHT:l.price,amountHT:Math.round(Number(l.quantity)*Number(l.price)*100)/100})),
      totals:{totalHT:Math.round(textTotal(d)*100)/100},
      taxMention:d.tax,terms:d.terms,checks:checks.map(([label,ok])=>({label,complete:ok}))
    };
    download(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json;charset=utf-8'}),'Philosophal-preparation-'+String(d.number||isoNow().slice(0,10)).replace(/[^\w-]/g,'_')+'.json');
    $('exchangeMessage').textContent='Fichier de préparation téléchargé. Il ne constitue pas une facture électronique réglementaire.';
  }
  function initExchangeUI(){
    $('exchangeCheck').addEventListener('click',updateExchangeUI);
    $('exchangeExport').addEventListener('click',exportExchange);
    updateExchangeUI();
  }

  async function boot(){
    try{await api?.ready}catch{}
    if(!isPro()){$('gate').hidden=false;return}
    await requestVaultAccess();
    $('app').hidden=false;
    setPreset('sejer');loadDatabase();initVaultUI();
    const recovered=restoreAutoDraft();if(!recovered)newDraft();
    autoSaveEnabled=true;if(!recovered)queueAutoSave();
    fields.forEach(id=>$(id).addEventListener('input',()=>{
      if(id==='number')autoNumber=false;
      if(id==='date'){if($('due').value)$('due').value=plusDays($('date').value,30);autoNumberOnDateChange()}
      update();
    }));
    $('showDue').addEventListener('change',()=>{updateDue();update()});
    $('italicAmounts').addEventListener('change',update);
    styleFields.forEach(key=>$(key).addEventListener('input',update));
    $('preview').addEventListener('click',goEditFromPreview);
    $('preview').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ') && event.target.matches('[data-edit-line],[data-edit-field],[data-edit-style]')){event.preventDefault();goEditFromPreview(event)}});
    initTime();initReports();initAutomation();
    $('dashboardYear').addEventListener('change',renderDashboard);
    $('dashboardClient').addEventListener('change',renderDashboard);
    $('dashboardCsvInvoices').addEventListener('click',()=>exportCSV('invoices'));
    $('dashboardCsvPayments').addEventListener('click',()=>exportCSV('payments'));
    $('dashboardCsvCredits').addEventListener('click',exportCreditsCSV);
    initV47();
    $('receiptClose').addEventListener('click',closePaymentDialog);
    $('receiptCancel').addEventListener('click',closePaymentDialog);
    $('receiptSave').addEventListener('click',savePayment);
    $('receiptDialog').addEventListener('click',event=>{if(event.target===$('receiptDialog'))closePaymentDialog()});
    $('receiptDialog').addEventListener('cancel',event=>{event.preventDefault();closePaymentDialog()});
    $('backupExport').addEventListener('click',exportBackup);
    $('backupImport').addEventListener('click',importBackup);
    $('backupCheck').addEventListener('click',checkBackup);
    $('backupFile').addEventListener('change',()=>{$('backupCheckSummary').hidden=true;backupStatus('Fichier sélectionné. Vérifie-le avant de l’importer.');});
    window.addEventListener('pagehide',commitAutoSave);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')commitAutoSave()});
    $('preset').addEventListener('change',()=>newDraft($('preset').value));
    $('add').addEventListener('click',()=>{lines.push(normalizeLine({name:'Nouvelle prestation',quantity:1,price:0}));renderLines();renderQuick();update()});
    $('pdf').addEventListener('click',()=>{
      if(!checkInvoice({exported:true}))return;
      try{const document=window.PhilosophalInvoicePDF?.create(data(),detailParts);if(!document)throw new Error('Moteur PDF non chargé.');download(document,filename('pdf'));rememberLast();saveArchive({exported:true,checked:true})}
      catch(error){console.error(error);alert('Impossible de générer le PDF. Vous pouvez toujours utiliser Ctrl+P pour imprimer le document.')}
    });
    $('word').addEventListener('click',()=>{if(!checkInvoice({exported:true}))return;try{exportWord();rememberLast();saveArchive({exported:true,checked:true})}catch(error){console.error(error);alert('Export Word impossible.')}});
    $('modeExpress').addEventListener('click',()=>mode('express'));
    $('modeAdvanced').addEventListener('click',()=>mode('advanced'));
    $('openAdvanced').addEventListener('click',()=>mode('advanced'));
    $('cloneLast').addEventListener('click',duplicateLast);
    for(const [quick,advanced] of [['quickPeriod','period'],['quickDate','date'],['quickNumber','number'],['quickValidator','validator']]){
      $(quick).addEventListener('input',()=>{
        $(advanced).value=$(quick).value;
        if(advanced==='number')autoNumber=false;
        if(advanced==='date' && $('date').value){$('due').value=plusDays($('date').value,30);autoNumberOnDateChange()}
        update();
      });
    }
    showLast();if(!recovered)mode('express');initExchangeUI();
    $('save').addEventListener('click',()=>{setArea('templates');$('templateName').focus()});
    $('load').addEventListener('click',()=>setArea('templates'));
    $('archiveInvoice').addEventListener('click',()=>{if(saveArchive())showMessage('Facture enregistrée dans l’historique local.')});
    document.querySelectorAll('[data-office]').forEach(btn=>btn.addEventListener('click',()=>setArea(btn.dataset.office)));
    $('officeMobileSelect').addEventListener('change',event=>setArea(event.target.value));
    document.querySelectorAll('[data-quick-office]').forEach(btn=>btn.addEventListener('click',()=>setArea(btn.dataset.quickOffice)));
    initOfficeConflictCheck();
    $('clientProfileList').addEventListener('change',()=>{selectedClientId=$('clientProfileList').value;fillClientForm(clients.find(x=>x.id===selectedClientId))});
    $('clientNew').addEventListener('click',()=>{selectedClientId='';renderClientSelector();$('clientProfileName').focus()});
    $('clientCapture').addEventListener('click',captureClient);
    $('clientSave').addEventListener('click',saveClient);
    $('clientUse').addEventListener('click',useClient);
    $('clientRemove').addEventListener('click',()=>{const c=clients.find(x=>x.id===selectedClientId);if(!c||!confirm(`Supprimer le client « ${c.profile} » ? L’historique des factures ne sera pas modifié.`))return;const next=clients.filter(x=>x.id!==c.id);if(!persist(clientKey,next))return;clients=next;selectedClientId='';renderClientSelector();timeClientOptions($('timeClient'));timeClientOptions($('timeFilterClient'),true);renderAutomation()});
    $('templateSave').addEventListener('click',()=>saveTemplate());
    initAnnualArchive();
    $('historySearch').addEventListener('input',renderHistory);$('historyStatus').addEventListener('change',renderHistory);
    $('historyNew').addEventListener('click',()=>newDraft(currentPreset));
    $('lock').addEventListener('click',exitPro);
    update();updateActiveNotice();
  }
  boot();
})();

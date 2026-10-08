(() => {
  'use strict';
  const $=s=>document.querySelector(s),store='philosophal-teleprompteur-v1';
  const reader=$('[data-reader]'),text=$('[data-prompt-text]'),player=$('[data-player]'),script=$('[data-script]');
  const inputs={speed:$('[data-speed]'),size:$('[data-size]'),line:$('[data-line]'),width:$('[data-width]'),font:$('[data-font]'),mirror:$('[data-mirror]'),guide:$('[data-guide]'),loop:$('[data-loop]'),theme:$('[data-theme]'),countdown:$('[data-countdown]'),rate:$('[data-rate]'),textColor:$('[data-text-color]'),backgroundColor:$('[data-background-color]')};
  const palettes={dark:{text:'#f2f5fa',background:'#111a28'},light:{text:'#19263a',background:'#ffffff'},sepia:{text:'#3d3329',background:'#f7f1e4'}};
  const moods=[
    {id:'dark',name:'Studio',text:'#f2f5fa',background:'#111a28'},
    {id:'light',name:'Clair',text:'#19263a',background:'#ffffff'},
    {id:'sepia',name:'Papier',text:'#3d3329',background:'#f7f1e4'},
    {id:'night',name:'Nuit',text:'#d7e4ff',background:'#090e1a'},
    {id:'lavender',name:'Lavande',text:'#ede4ff',background:'#281b3d'},
    {id:'ocean',name:'Océan',text:'#cff3ff',background:'#072b38'},
    {id:'forest',name:'Forêt',text:'#def6e3',background:'#103527'},
    {id:'amber',name:'Ambre',text:'#ffe6ae',background:'#37250d'},
    {id:'rose',name:'Rose',text:'#ffe1ee',background:'#3b172c'},
    {id:'slate',name:'Ardoise',text:'#edf0f5',background:'#29323e'}
  ];
  const moodGrid=$('[data-color-presets]');
  moods.forEach(mood=>{const button=document.createElement('button');button.type='button';button.dataset.colorPreset=mood.id;button.setAttribute('aria-pressed','false');button.style.setProperty('--mood-ink',mood.text);button.style.setProperty('--mood-bg',mood.background);const swatch=document.createElement('span');swatch.className='prompt-mood-swatch';swatch.textContent='Aa';swatch.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=mood.name;button.append(swatch,name);moodGrid.append(button);});
  const isColor=value=>/^#[0-9a-f]{6}$/i.test(String(value));
  function luminance(color){const rgb=color.slice(1).match(/.{2}/g).map(v=>{const c=parseInt(v,16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
  function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function setPalette(name){const p=palettes[name];if(!p)return;inputs.theme.value=name;inputs.textColor.value=p.text;inputs.backgroundColor.value=p.background;}
  function applyColors(){
    const foreground=inputs.textColor.value,background=inputs.backgroundColor.value;
    const interfaceInk=contrast('#19263a',background)>=contrast('#f2f5fa',background)?'#19263a':'#f2f5fa';
    player.style.setProperty('--reader-text',foreground);player.style.setProperty('--reader-bg',background);player.style.setProperty('--reader-muted',interfaceInk);player.style.setProperty('--reader-rule',interfaceInk+'24');player.style.setProperty('--reader-guide',interfaceInk);
    document.querySelectorAll('[data-color-preset]').forEach(button=>{const mood=moods.find(m=>m.id===button.dataset.colorPreset);button.setAttribute('aria-pressed',String(mood.text===foreground&&mood.background===background));});
    const ratio=contrast(foreground,background),status=$('[data-color-contrast]');status.textContent=`Contraste ${ratio.toLocaleString('fr-FR',{maximumFractionDigits:1})} : 1 · ${ratio>=4.5?'Bonne lisibilité':'Contraste faible'}`;status.classList.toggle('is-low-contrast',ratio<4.5);
    document.querySelectorAll('[data-color-hex]').forEach(el=>{if(document.activeElement!==el)el.value=inputs[el.dataset.colorHex].value.toUpperCase();});
  }
  let playing=false,counting=false,frame=0,last=0,position=0,elapsed=0,countdownEnd=0,wakeLock=null,saveTimer=0,toastTimer=0,previousMax=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const wordCount=value=>(String(value).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length;
  const clock=seconds=>{const s=Math.max(0,Math.round(seconds));return`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
  const maxScroll=()=>Math.max(0,reader.scrollHeight-reader.clientHeight);
  function toast(message){$('[data-toast]').textContent=message;$('[data-toast]').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('[data-toast]').hidden=true,3000);}
  function save(){clearTimeout(saveTimer);$('[data-save-state]').textContent='Sauvegarde…';saveTimer=setTimeout(()=>{try{const prefs={};for(const[k,i]of Object.entries(inputs))prefs[k]=i.type==='checkbox'?i.checked:i.value;localStorage.setItem(store,JSON.stringify({text:script.value,prefs}));$('[data-save-state]').textContent='Enregistré ici';}catch{$('[data-save-state]').textContent='Export conseillé';}},250);}
  function stats(){const words=wordCount(script.value);$('[data-word-count]').textContent=words.toLocaleString('fr-FR');$('[data-reading-duration]').textContent=clock(words/Number(inputs.rate.value)*60);$('[data-play]').disabled=!script.value.trim();updateProgress();}
  function updateProgress(){const max=maxScroll(),percent=max?clamp(reader.scrollTop/max*100,0,100):0;$('[data-position]').value=percent;$('[data-position-value]').textContent=`${Math.round(percent)} %`;$('[data-elapsed]').textContent=clock(elapsed);$('[data-remaining]').textContent=clock(script.value.trim()?(max-reader.scrollTop)/Number(inputs.speed.value):0);}
  function applyPrefs(){
    player.style.setProperty('--text-size',`${inputs.size.value}px`);player.style.setProperty('--text-line',inputs.line.value);player.style.setProperty('--text-width',`${inputs.width.value}%`);
    player.dataset.theme=inputs.theme.value;applyColors();player.classList.toggle('is-mirrored',inputs.mirror.checked);player.classList.toggle('is-serif',inputs.font.value==='serif');$('[data-reading-guide]').hidden=!inputs.guide.checked;
    $('[data-speed-value]').textContent=`${inputs.speed.value} px/s`;$('[data-mini-speed]').textContent=`${inputs.speed.value} px/s`;$('[data-size-value]').textContent=`${inputs.size.value} px`;$('[data-line-value]').textContent=Number(inputs.line.value).toLocaleString('fr-FR');$('[data-width-value]').textContent=`${inputs.width.value} %`;
    stats();
  }
  function renderScript(){pause(false);text.replaceChildren();const blocks=script.value.trim().split(/\n\s*\n/),select=$('[data-paragraph]');select.innerHTML='<option value="">Repères du script…</option>';
    if(!script.value.trim()){const p=document.createElement('p');p.className='prompt-placeholder';p.textContent='Votre prochaine idée mérite d’être bien racontée.';const info=document.createElement('p');info.className='prompt-placeholder-small';info.textContent='Ajoutez un script, puis lancez la lecture.';text.append(p,info);}
    else blocks.forEach((block,index)=>{const p=document.createElement('p');p.textContent=block;p.dataset.paragraphIndex=index;text.append(p);const o=document.createElement('option');o.value=index;o.textContent=`${index+1}. ${block.split('\n')[0].slice(0,55)}`;select.append(o);});
    reader.scrollTop=0;position=0;elapsed=0;resizeSpacers();stats();
  }
  function resizeSpacers(){const progress=previousMax?reader.scrollTop/previousMax:0;$('[data-top-spacer]').style.height=`${reader.clientHeight*.35}px`;$('[data-bottom-spacer]').style.height=`${reader.clientHeight*.65}px`;previousMax=maxScroll();reader.scrollTop=clamp(progress,0,1)*previousMax;position=reader.scrollTop;updateProgress();}
  async function acquireWakeLock(){try{if(navigator.wakeLock&&playing){const lock=await navigator.wakeLock.request('screen');if(playing)wakeLock=lock;else await lock.release();}}catch{}}
  function releaseWakeLock(){wakeLock?.release().catch(()=>{});wakeLock=null;}
  function controls(label){const button=$('[data-play]');button.querySelector('[data-icon]').innerHTML=window.PhilosophalIcons.svg(playing||counting?'pause':'play');$('[data-play-label]').textContent=label||((playing||counting)?'Mettre en pause':'Lancer la lecture');button.setAttribute('aria-pressed',String(playing||counting));player.classList.toggle('is-playing',playing);}
  function pause(announce=true){const wasRunning=playing||counting;playing=false;counting=false;cancelAnimationFrame(frame);frame=0;last=0;$('[data-countdown-overlay]').hidden=true;releaseWakeLock();controls();if(announce&&wasRunning)$('[data-play-status]').textContent='En pause';}
  function startScrolling(){counting=false;playing=true;position=reader.scrollTop;last=0;$('[data-countdown-overlay]').hidden=true;$('[data-play-status]').textContent='Lecture en cours';controls();acquireWakeLock();frame=requestAnimationFrame(step);}
  function start(){if(!script.value.trim())return;if(playing||counting){pause();return;}if(reader.scrollTop>=maxScroll()-1){reader.scrollTop=0;position=0;elapsed=0;}
    const delay=Number(inputs.countdown.value);if(!delay){startScrolling();return;}counting=true;countdownEnd=performance.now()+delay*1000;controls('Annuler le départ');$('[data-countdown-overlay]').hidden=false;$('[data-play-status]').textContent=`Départ dans ${delay} secondes`;frame=requestAnimationFrame(countdownStep);
  }
  function countdownStep(now){if(!counting)return;const left=Math.ceil((countdownEnd-now)/1000);if(left<=0){startScrolling();return;}$('[data-countdown-overlay]').textContent=left;frame=requestAnimationFrame(countdownStep);}
  function step(now){if(!playing)return;if(!last)last=now;const dt=Math.min(.15,(now-last)/1000);last=now;elapsed+=dt;position+=Number(inputs.speed.value)*dt;reader.scrollTop=position;updateProgress();if(position>=maxScroll()){
      if(inputs.loop.checked){reader.scrollTop=0;position=0;frame=requestAnimationFrame(step);return;}
      pause(false);$('[data-play-status]').textContent='Lecture terminée';controls('Relire le script');return;
    }frame=requestAnimationFrame(step);
  }
  function reset(){pause(false);reader.scrollTop=0;position=0;elapsed=0;$('[data-play-status]').textContent='Prêt pour une nouvelle prise';controls();updateProgress();}
  function speedChange(delta){inputs.speed.value=clamp(Number(inputs.speed.value)+delta,5,180);applyPrefs();save();}
  function seek(value){reader.scrollTop=clamp(value,0,maxScroll());position=reader.scrollTop;updateProgress();}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else{document.body.classList.add('prompt-focus');$('[data-focus-mode]').setAttribute('aria-pressed','true');$('[data-focus-mode]').textContent='Afficher le script';await document.documentElement.requestFullscreen();}}catch{toast('Le mode lecture reste disponible sur cet appareil.');}}
  function download(){const blob=new Blob([script.value],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='script-teleprompteur.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  try{const saved=JSON.parse(localStorage.getItem(store)||'null');if(saved){script.value=typeof saved.text==='string'?saved.text:'';for(const[k,v]of Object.entries(saved.prefs||{})){const i=inputs[k];if(!i)continue;if(i.type==='checkbox')i.checked=!!v;else if(i.type==='range')i.value=clamp(Number(v)||Number(i.defaultValue),Number(i.min),Number(i.max));else if(i.type==='color'){if(isColor(v))i.value=v;}else if(i.options&&[...i.options].some(o=>o.value===String(v)))i.value=v;}if(!isColor(saved.prefs?.textColor)||!isColor(saved.prefs?.backgroundColor))setPalette(inputs.theme.value==='custom'?'dark':inputs.theme.value);}}catch{}
  script.addEventListener('input',()=>{renderScript();save();});
  Object.values(inputs).forEach(i=>i.addEventListener('input',()=>{const p=maxScroll()?reader.scrollTop/maxScroll():0;if(i===inputs.theme)setPalette(i.value);else if(i.type==='color')inputs.theme.value='custom';applyPrefs();reader.scrollTop=p*maxScroll();position=reader.scrollTop;previousMax=maxScroll();save();}));
  document.querySelectorAll('[data-color-hex]').forEach(el=>{
    el.addEventListener('input',()=>{const value=el.value.startsWith('#')?el.value:'#'+el.value;if(!isColor(value))return;inputs[el.dataset.colorHex].value=value;inputs[el.dataset.colorHex].dispatchEvent(new Event('input',{bubbles:true}));el.removeAttribute('aria-invalid');});
    el.addEventListener('change',()=>{const value=el.value.startsWith('#')?el.value:'#'+el.value;if(!isColor(value))toast('Utilisez un code de six caractères, par exemple #62409B.');el.value=inputs[el.dataset.colorHex].value.toUpperCase();});
  });
  moodGrid.addEventListener('click',event=>{const button=event.target.closest('[data-color-preset]');if(!button)return;const mood=moods.find(m=>m.id===button.dataset.colorPreset);inputs.theme.value=palettes[mood.id]?mood.id:'custom';inputs.textColor.value=mood.text;inputs.backgroundColor.value=mood.background;const progress=maxScroll()?reader.scrollTop/maxScroll():0;applyPrefs();reader.scrollTop=progress*maxScroll();position=reader.scrollTop;previousMax=maxScroll();save();});
  $('[data-reset-colors]').addEventListener('click',()=>{setPalette('dark');applyPrefs();save();toast('Couleurs sombres rétablies.');});
  reader.addEventListener('scroll',()=>{if(!playing)position=reader.scrollTop;updateProgress();},{passive:true});
  ['touchstart','pointerdown'].forEach(type=>reader.addEventListener(type,()=>{if(playing)pause();position=reader.scrollTop;},{passive:true}));
  reader.addEventListener('wheel',()=>requestAnimationFrame(()=>{position=reader.scrollTop;}),{passive:true});
  $('[data-position]').addEventListener('input',e=>seek(Number(e.target.value)/100*maxScroll()));
  $('[data-play]').addEventListener('click',start);$('[data-reset]').addEventListener('click',reset);$('[data-slower]').addEventListener('click',()=>speedChange(-5));$('[data-faster]').addEventListener('click',()=>speedChange(5));$('[data-fullscreen]').addEventListener('click',fullscreen);
  $('[data-focus-mode]').addEventListener('click',()=>{const on=document.body.classList.toggle('prompt-focus');$('[data-focus-mode]').setAttribute('aria-pressed',String(on));$('[data-focus-mode]').textContent=on?'Afficher le script':'Mode lecture';});
  $('[data-calibrate]').addEventListener('click',()=>{const words=wordCount(script.value);if(!words){toast('Ajoutez un script pour calibrer la vitesse.');return;}inputs.speed.value=clamp(Math.round(text.scrollHeight/words*Number(inputs.rate.value)/60),5,180);applyPrefs();save();toast('Vitesse ajustée. Affinez-la pendant la lecture si besoin.');});
  $('[data-paragraph]').addEventListener('change',e=>{if(e.target.value==='')return;const p=text.querySelector(`[data-paragraph-index="${Number(e.target.value)}"]`);if(p)seek(p.offsetTop-reader.clientHeight*.35);});
  $('[data-import]').addEventListener('click',()=>$('[data-script-file]').click());
  $('[data-script-file]').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>1000000){toast('Choisissez un script de moins de 1 Mo.');e.target.value='';return;}try{const incoming=await f.text();if(incoming.length>250000){toast('Le script dépasse la limite de 250 000 caractères.');return;}script.value=incoming;renderScript();save();toast('Script importé.');}catch{toast('Ce fichier ne peut pas être lu.');}finally{e.target.value='';}});
  $('[data-download]').addEventListener('click',download);$('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(script.value);toast('Script copié.');}catch{script.select();toast('Le script est sélectionné : utilisez Ctrl+C.');}});
  $('[data-template]').addEventListener('click',()=>{const plan='ACCROCHE\nUne phrase qui donne envie de rester.\n\nIDÉE PRINCIPALE\nExpliquez une idée, puis donnez un exemple concret.\n\nCONCLUSION\nLa chose à retenir, et la prochaine étape.\n';script.setRangeText(plan,script.selectionStart,script.selectionEnd,'end');renderScript();save();script.focus();});
  window.addEventListener('keydown',e=>{const typing=e.target.matches('input,textarea,select,[contenteditable=true]');if(typing||e.ctrlKey||e.metaKey||e.altKey)return;const key=e.key.toLowerCase();if(e.code==='Space'){e.preventDefault();start();}else if(e.key==='ArrowUp'){e.preventDefault();speedChange(5);}else if(e.key==='ArrowDown'){e.preventDefault();speedChange(-5);}else if(e.key==='ArrowLeft'){e.preventDefault();seek(reader.scrollTop-reader.clientHeight*.3);}else if(e.key==='ArrowRight'){e.preventDefault();seek(reader.scrollTop+reader.clientHeight*.3);}else if(e.key==='Home'){e.preventDefault();reset();}else if(key==='f'){e.preventDefault();fullscreen();}else if(e.key==='Escape')pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  window.addEventListener('pagehide',()=>{pause(false);clearTimeout(saveTimer);try{const prefs={};for(const[k,i]of Object.entries(inputs))prefs[k]=i.type==='checkbox'?i.checked:i.value;localStorage.setItem(store,JSON.stringify({text:script.value,prefs}));}catch{}});
  new ResizeObserver(resizeSpacers).observe(reader);
  applyPrefs();renderScript();controls();
})();

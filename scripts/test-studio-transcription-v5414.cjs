const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('outils/studio-audiovisuel/editeur.html','utf8');
const js=fs.readFileSync('js/studio-transcription-v5414.js','utf8');
const css=fs.readFileSync('css/studio-transcription-v5414.css','utf8');
const required=['tr-v5414-time-row','v5414LexRules','v5414LexApply','v5414Profile','v5414Report','v5414FixOverlaps','v5414Reflow','PhilosophalV5414Transcribe','PhilosophalV5414Subtitles'];
for(const id of required)assert(html.includes(id),id+' absent');
assert(js.includes('applyLexicon')&&js.includes('inspect')&&js.includes('repair'));assert(css.length>1200);
let scripts=[...html.matchAll(/<script(?![^>]*type="text\/plain")[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const [i,code] of scripts.entries()){try{new vm.Script(code)}catch(e){throw Error('Script '+i+': '+e.message)}}
new vm.Script(js);
const tr=html.match(/<script id="tr-worker-code" type="text\/plain">([\s\S]*?)<\/script>/);assert(tr,'Missing Whisper worker');new vm.Script(tr[1],{filename:'worker.js'});
assert(tr[1].includes('step=22*sampleRate'));
console.log('V54.14: scripts valides, composants trouvés, règles et sous-titres intégrés.');

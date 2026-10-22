import {readFile,writeFile,rename,mkdtemp,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes,pbkdf2Sync,createCipheriv,createDecipheriv,createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import vm from 'node:vm';
const digest=data=>createHash('sha256').update(data).digest('hex');
function encrypt(key,clear,aad){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key,iv);c.setAAD(Buffer.from(aad));return {iv,cipher:Buffer.concat([c.update(clear),c.final(),c.getAuthTag()])};}
function decrypt(key,iv,cipher,aad){const d=createDecipheriv('aes-256-gcm',key,iv);d.setAAD(Buffer.from(aad));d.setAuthTag(cipher.subarray(-16));return Buffer.concat([d.update(cipher.subarray(0,-16)),d.final()]);}
export async function rotateAccess(root,oldPassword){
 const info=JSON.parse(await readFile(path.join(root,'private/manifest.json'),'utf8'));
 const profile=info.profiles.find(p=>p.role==='private');
 const wrapping=pbkdf2Sync(oldPassword,Buffer.from(profile.salt,'base64'),info.iterations,32,'sha256');
 let access;try{access=JSON.parse(decrypt(wrapping,Buffer.from(profile.iv,'base64'),Buffer.from(profile.wrapped,'base64'),'philosophal-v31:private'));}catch{throw Error('Mot de passe propriétaire incorrect. Aucun fichier modifié.');}
 const clearPacks={},control={version:31,javascriptChecked:{},ciphertextSHA256:{}};
 for(const id of ['student','owner']){
  const pack=info.packs[id],encrypted=await readFile(path.join(root,pack.path.slice(1)));
  const clear=gunzipSync(decrypt(Buffer.from(access.keys[id],'base64'),encrypted.subarray(0,12),encrypted.subarray(12),pack.path));
  const parsed=JSON.parse(clear);if(parsed.format!=='philosophal-private-pack-v31')throw Error('Archive invalide.');
  if(id==='owner')for(const [name,entry] of Object.entries(parsed.files))if(name.endsWith('.js')){const source=Buffer.from(entry.data,'base64');new vm.Script(source.toString('utf8'));control.javascriptChecked[name]=digest(source);}
  clearPacks[id]=clear;
 }
 const keys={student:randomBytes(32),owner:randomBytes(32)},passwords={private:'Ph-'+randomBytes(18).toString('base64url'),student:'Ph-'+randomBytes(18).toString('base64url')};
 const next={...info,profiles:[],packs:{}};
 const staged=await mkdtemp(path.join(path.dirname(root),'philosophal-acces-temp-'));
 try{
  for(const id of ['student','owner']){const old=info.packs[id],sealed=encrypt(keys[id],gzipSync(clearPacks[id]),old.path),bytes=Buffer.concat([sealed.iv,sealed.cipher]);await writeFile(path.join(staged,id+'.vault'),bytes);next.packs[id]={path:old.path,sha256:digest(bytes),size:bytes.length};control.ciphertextSHA256[id]=digest(bytes);}
  for(const role of ['private','student']){const salt=randomBytes(16),material=pbkdf2Sync(passwords[role],salt,info.iterations,32,'sha256');const roleKeys=Object.fromEntries((role==='private'?['student','owner']:['student']).map(id=>[id,keys[id].toString('base64')]));const sealed=encrypt(material,Buffer.from(JSON.stringify({role,keys:roleKeys})),'philosophal-v31:'+role);next.profiles.push({role,salt:salt.toString('base64'),iv:sealed.iv.toString('base64'),wrapped:sealed.cipher.toString('base64')});}
  await writeFile(path.join(staged,'manifest.json'),JSON.stringify(next,null,2));await writeFile(path.join(staged,'controle-sources.json'),JSON.stringify(control,null,2));
  const backup=path.join(path.dirname(root),'Philosophal-acces-avant-'+Date.now()+'.json');
  const archives=await Promise.all(['student','owner'].map(async id=>({id,base64:(await readFile(path.join(root,info.packs[id].path.slice(1)))).toString('base64')})));
  await writeFile(backup,JSON.stringify({manifest:info,archives}),{mode:0o600});
  for(const name of ['student.vault','owner.vault','controle-sources.json','manifest.json'])await rename(path.join(staged,name),path.join(root,'private',name));
  return passwords;
 }finally{await rm(staged,{recursive:true,force:true});}
}
async function askHidden(prompt){
 if(!process.stdin.isTTY)throw Error('Ouvrez ce programme dans un terminal interactif.');
 process.stdout.write(prompt);process.stdin.setRawMode(true);process.stdin.resume();
 return await new Promise((resolve,reject)=>{let text='';const receive=buffer=>{for(const ch of buffer.toString()){if(ch==='\u0003'){cleanup();reject(Error('Annulé.'));return}if(ch==='\r'||ch==='\n'){cleanup();resolve(text);return}if(ch==='\u007f'||ch==='\b')text=text.slice(0,-1);else text+=ch}};function cleanup(){process.stdin.off('data',receive);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n')}process.stdin.on('data',receive);});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),password=await askHidden('Mot de passe propriétaire actuel (saisie masquée) : ');const next=await rotateAccess(root,password);const file=path.join(path.dirname(root),'ACCES-PRIVES-PHILOSOPHAL-'+Date.now()+'.txt');await writeFile(file,'PROPRIÉTAIRE : '+next.private+'\nÉLÈVE : '+next.student+'\n\nÀ conserver hors du dossier publié.\n',{mode:0o600});console.log('Nouveaux accès créés. Fichier personnel : '+file);console.log('Vérifiez le site puis envoyez cette nouvelle version à GitHub.');}catch(error){console.error(error.message);process.exitCode=1;}
}

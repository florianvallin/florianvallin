(async()=>{
  await window.FV_PRIVATE_ACCESS.ready;
  if(window.FV_PRIVATE_ACCESS.role()==='private'){
    for(const path of ['/mediatheque/data.js','/mediatheque/s1-courses.js','/mediatheque/s2-courses.js','/mediatheque/s3-courses.js','/mediatheque/s4-courses.js','/mediatheque/research-courses.js'])await window.FV_PRIVATE_ACCESS.execute(path);
  }
  for(const file of ['editor.js','editor-v2.js','editor-v3.js','mobile-20260929.js'])await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./'+file+'?v=20261004-v31';script.onload=resolve;script.onerror=reject;document.body.append(script);});
})();

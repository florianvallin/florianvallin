(() => {
  const api=window.FV_PRIVATE_ACCESS;if(!api)return;
  api.ready.then(()=>{
    if(!api.role()||document.querySelector('[data-vault-logout]'))return;
    const style=document.createElement('style');style.textContent='.vault-logout{position:fixed;bottom:14px;left:14px;z-index:9000;border:1px solid #d8c7e2;border-radius:10px;background:#fffafeea;color:#78518d;padding:8px 12px;font:12px Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 16px #5030600b}@media print{.vault-logout{display:none}}';document.head.append(style);
    const button=document.createElement('button');button.type='button';button.className='vault-logout';button.dataset.vaultLogout='';button.textContent='Verrouiller l’espace';button.addEventListener('click',()=>api.lock());document.body.append(button);
  });
})();

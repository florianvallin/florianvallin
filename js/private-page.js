(async () => {
  'use strict';
  const api=window.FV_PRIVATE_ACCESS,form=document.querySelector('[data-vault-form]'),status=document.querySelector('[data-vault-status]'),password=document.querySelector('[data-vault-password]');
  const path=document.body.dataset.privatePath;
  function showError(message){status.textContent=message;password?.select();}
  async function render(){if(api.role()==='private'){status.textContent='Ouverture de votre espace…';await api.renderPrivate(path);return true;}return false;}
  try{await api.ready;if(await render())return;}catch(error){showError(error.message);}
  if(api.role()==='student')showError('Cet espace est réservé au propriétaire. Votre accès élève ouvre la sélection pédagogique de la médiathèque.');
  password?.focus();
  form?.addEventListener('submit',async event=>{
    event.preventDefault();if((password?.value||"").trim().toLocaleLowerCase("fr-FR")==="didier"){window.location.assign('https://app.notion.com/p/Cours-Philosophie-Didier-35781643740b80b28dc8cd07c1e59ea7?source=copy_link');return;}const button=form.querySelector('button');button.disabled=true;status.textContent='Vérification et ouverture…';
    try{const role=await api.unlockRole(password.value,document.querySelector('[data-vault-remember]').checked);if(role==='private')await render();else showError(role==='student'?'Cet accès élève ne permet pas d’ouvrir cet espace.':'Mot de passe incorrect.');}catch(error){showError(error.message);}finally{button.disabled=false;}
  });
})();

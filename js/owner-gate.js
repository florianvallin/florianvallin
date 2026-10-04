(() => {
  'use strict';
  window.PHILOSOPHAL_OWNER_GATE=Object.freeze({unlock:async password=>(await window.FV_PRIVATE_ACCESS?.unlockRole(password))==='private',isOpen:()=>window.FV_PRIVATE_ACCESS?.role()==='private'});
})();

(() => {
  "use strict";
  const gate=document.getElementById("reader-private-gate");
  const form=document.getElementById("reader-private-form");
  const password=document.getElementById("reader-private-password");
  const error=document.getElementById("reader-private-error");
  let loaded=false;
  function loadReader(){
    if(loaded)return; loaded=true; document.body.classList.remove("reader-private-locked"); if(gate)gate.hidden=true;
    const library=document.createElement("script"); library.src="library.js?v=20260923-private1";
    library.onload=()=>{const reader=document.createElement("script"); reader.src="reader.js?v=20260923-private1"; document.body.append(reader);};
    document.body.append(library);
  }
  if(window.FV_PRIVATE_ACCESS?.isUnlocked()){loadReader();return;}
  requestAnimationFrame(()=>password?.focus());
  form?.addEventListener("submit",async(event)=>{event.preventDefault();const valid=await window.FV_PRIVATE_ACCESS?.unlock(password?.value||"");if(!valid){if(error)error.hidden=false;password?.select();return;}loadReader();});
})();

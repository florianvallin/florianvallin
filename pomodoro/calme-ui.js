(() => {
  'use strict';
  const more=document.querySelector('.pomo-header-more');
  document.addEventListener('click',event=>{if(more?.open&&!more.contains(event.target))more.open=false;if(event.target.closest('.pomo-header-more button'))more.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&more?.open){more.open=false;more.querySelector('summary').focus();}
    const report=event.target.closest('[data-report-range]');if(report&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){const buttons=[...document.querySelectorAll('[data-report-range]')];let i=buttons.indexOf(report);i=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;event.preventDefault();buttons[i].focus();buttons[i].click();return;}
    const tab=event.target.closest('[data-mode]');if(!tab)return;
    const tabs=[...document.querySelectorAll('[data-mode]')];let index=tabs.indexOf(tab);
    if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;
    event.preventDefault();event.stopPropagation();tabs[index].focus();tabs[index].click();
  });
})();

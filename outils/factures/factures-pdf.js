/* Philosophal V42 — export PDF vectoriel local, sans service tiers ni CDN. */
(() => {
  'use strict';
  const PAGE_W=595.28, PAGE_H=841.89, M=43, RIGHT=PAGE_W-M;
  const encoder=new TextEncoder();
  const fmt=n=>Number(n).toFixed(2).replace(/\.?0+$/,'')||'0';
  const formatPrice=n=>Number(n||0).toFixed(2);
  const currency=n=>Number(n||0).toFixed(2)+' €';
  const baseColor={black:[0.13,0.12,0.13],purple:[0.49,0.27,0.64],pale:[0.975,0.94,0.944],gray:[0.47,0.47,0.49],border:[0.79,0.79,0.79],header:[0.932,0.932,0.932]};
  const cpSpecial={0x20ac:128,0x201a:130,0x0192:131,0x201e:132,0x2026:133,0x2020:134,0x2021:135,0x02c6:136,0x2030:137,0x0160:138,0x2039:139,0x0152:140,0x017d:142,0x2018:145,0x2019:146,0x201c:147,0x201d:148,0x2022:149,0x2013:150,0x2014:151,0x02dc:152,0x2122:153,0x0161:154,0x203a:155,0x0153:156,0x017e:158,0x0178:159};
  function encodeWinAnsi(text){
    const bytes=[];
    for(const c of String(text??'')){
      const k=c.codePointAt(0);
      if(k===10||k===13){bytes.push(32);continue}
      if(k===0x202f||k===0xa0){bytes.push(32);continue}
      if(k>=32&&k<=126||k>=160&&k<=255){bytes.push(k);continue}
      bytes.push(cpSpecial[k]??63);
    }
    return bytes;
  }
  const hex=text=>encodeWinAnsi(text).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
  const rgb=c=>c.map(fmt).join(' ');
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  function measure(text,size=10,font='regular'){
    const family=/Times/.test(font)?'Georgia':'Arial';
    ctx.font=`${font.includes('bold')?'700':'400'} ${font.includes('italic')?'italic ':''}${size}pt ${family}`;
    // Canvas measures CSS pixels, PDF coordinates use points.
    return ctx.measureText(text).width*.75;
  }
  function lineFragments(parts,maxWidth,size=10,normalFont='regular'){
    const tokens=[];
    for(const part of parts){const txt=String(part.text||'').replace(/\s+/g,' ');
      for(const token of txt.match(/\S+\s*/g)||[])tokens.push({text:token,italic:!!part.italic});
    }
    const rows=[[]];let used=0;
    for(const item of tokens){
      let t=item.text;const font=item.italic?'italic':normalFont;let w=measure(t,size,font);
      if(used>0&&used+w>maxWidth){rows.push([]);used=0;t=t.trimStart();w=measure(t,size,font);}
      if(w>maxWidth){
        for(const char of t){const cw=measure(char,size,font);if(used&&used+cw>maxWidth){rows.push([]);used=0}rows.at(-1).push({...item,text:char,width:cw});used+=cw}
      }else{rows.at(-1).push({...item,text:t,width:w});used+=w}
    }
    return rows;
  }
  const fromHex=(value,fallback)=>{const s=/^#[0-9a-f]{6}$/i.test(String(value))?value:fallback;return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255)};
  function create(f, detailParts){
    const color={...baseColor,purple:fromHex(f.docAccent,'#8243a8'),pale:fromHex(f.docSoft,'#f9eff0'),header:fromHex(f.docTable,'#ededed')};
    const pages=[];let commands=[];const meta={title:(f.documentKind==='credit'?'Avoir ':'Facture ')+(f.number||''),producer:'Philosophal V47'};
    const add=s=>commands.push(s);
    function rect(x,y,w,h,fill,stroke=null){
      add(`${rgb(fill)} rg ${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)} re f`);
      if(stroke)add(`${rgb(stroke)} RG 0.5 w ${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)} re S`);
    }
    function rule(x,y,w){add(`${rgb(color.border)} RG 0.5 w ${fmt(x)} ${fmt(y)} m ${fmt(x+w)} ${fmt(y)} l S`)}
    function text(str,x,y,{size=10,font='regular',fill=color.black,align='left'}={}){
      const s=String(str??'');if(!s)return;
      const fontRef=font==='bold'?'F2':font==='italic'?'F3':font==='bolditalic'?'F4':font==='serif'?'F5':'F1';
      if(align==='right')x-=measure(s,size,font);
      else if(align==='center')x-=measure(s,size,font)/2;
      add(`BT /${fontRef} ${fmt(size)} Tf ${rgb(fill)} rg 1 0 0 1 ${fmt(x)} ${fmt(y)} Tm <${hex(s)}> Tj ET`);
    }
    function multiline(str,x,y,{size=10,leading=13,maxWidth=235,fill=color.black,font='regular'}={}){
      let yy=y;
      for(const item of String(str||'').split('\n')){
        if(!item.trim()){yy-=leading;continue}
        for(const row of lineFragments([{text:item}],maxWidth,size,font)){
          let xx=x;for(const part of row){text(part.text,xx,yy,{size,font,fill});xx+=part.width}yy-=leading;
        }
      }
      return yy;
    }
    function newPage(continued=false){
      if(commands.length)pages.push(commands.join('\n')+'\n');
      commands=[];
      if(continued){text((f.documentKind==='credit'?'AVOIR':'FACTURE')+' · '+(f.number||''),M,800,{size:11,font:'bold'});text('Suite',RIGHT,800,{size:9,align:'right',fill:color.gray});rule(M,786,RIGHT-M)}
    }
    // En-tête fidèle au document de référence : émetteur à gauche, cartouche à droite.
    text(f.issuer,M,793,{size:14,font:'bold'});
    multiline([f.address,f.contact,f.siret].filter(Boolean).join('\n'),M,767,{size:10.4,leading:13.2,maxWidth:253});
    rect(329,768,RIGHT-329,47,color.pale);
    const heading=String(f.docTitle||'FACTURE').trim().toUpperCase();
    const headingText=heading.length>12?heading:Array.from(heading).join(' ');
    const headingFont=f.docTitleBold===false?'regular':'bold';
    const headingSize=[13,15,18].includes(Number(f.docTitleSize))?Number(f.docTitleSize):15;
    const headingColor=fromHex(f.docTitleColor,'#5d292b');
    const headingW=RIGHT-329-19;
    const oneLineSize=Math.min(headingSize,headingW/Math.max(measure(headingText,1,headingFont),.01));
    if(oneLineSize>=10){
      text(headingText,(329+RIGHT)/2,785,{size:oneLineSize,font:headingFont,align:'center',fill:headingColor});
    }else{
      const words=heading.split(/\s+/),rows=[''];
      for(const word of words){
        const row=rows[rows.length-1];const joined=row?row+' '+word:word;
        if(row && measure(joined,headingSize,headingFont)>headingW && rows.length<2)rows.push(word);
        else rows[rows.length-1]=joined;
      }
      for(let index=0;index<rows.length;index++){
        const size=Math.min(headingSize,headingW/Math.max(measure(rows[index],1,headingFont),.01));
        text(rows[index],(329+RIGHT)/2,rows.length===1?785:794-index*18,{size,font:headingFont,align:'center',fill:headingColor});
      }
    }
    multiline(f.rcs,M,688,{size:9.1,leading:11,maxWidth:245});
    text(f.client,331,693,{size:13.5,font:'bold'});
    multiline(f.clientAddress,331,676,{size:10.5,leading:12.8,maxWidth:212,font:'serif'});
    rect(M,560,200,91,color.pale);
    text('Référence : '+(f.number||''),M+8,629,{size:11.1});
    const fr=s=>{if(!s)return '';const [y,m,d]=s.split('-');return `${d} / ${m} / ${y}`};
    text('Date          :  '+fr(f.date),M+8,608,{size:11.1});
    if(f.showDue)text('Échéance  :  '+fr(f.due),M+8,587,{size:11});
    let yy=532;
    const proj=[f.project?.trim()+(f.validator?.trim()?' – Valideur '+f.validator.trim():''),f.projectCode?.trim()].filter(Boolean).join('\n');
    yy=multiline(proj,M,yy,{size:9.7,leading:12.1,maxWidth:RIGHT-M,fill:color.purple,font:f.docProjectBold===false?'regular':'bold'});
    let y=yy-12;
    const widths=[65,247,110,88];const xs=[M,M+65,M+312,M+422];
    const tableWidth=RIGHT-M;
    const border=color.border;
    function header(){
      rect(M,y-26,tableWidth,26,color.header,border);
      for(let i=1;i<4;i++)add(`${rgb(border)} RG 0.5 w ${fmt(xs[i])} ${fmt(y-26)} m ${fmt(xs[i])} ${fmt(y)} l S`);
      ['Quantité','Désignation','Prix unitaire HT','Prix total HT'].forEach((value,i)=>text(value,xs[i]+widths[i]/2,y-16.2,{size:i>1?8.5:9.2,font:'bold',align:'center'}));
      y-=26;
    }
    header();
    const month=f.period?new Date(Number(f.period.slice(0,4)),Number(f.period.slice(5,7))-1,1).toLocaleDateString('fr-FR',{month:'long'}):'';
    for(const item of f.lines){
      const parts=detailParts(item,f.period);
      const rows=lineFragments(parts,widths[1]-12,9.8);
      const h=Math.max(27,rows.length*13.4+13);
      if(y-h<190){newPage(true);y=759;header()}
      rect(M,y-h,tableWidth,h,[1,1,1],border);
      for(let i=1;i<4;i++)add(`${rgb(border)} RG 0.5 w ${fmt(xs[i])} ${fmt(y-h)} m ${fmt(xs[i])} ${fmt(y)} l S`);
      const quantity=Number(item.quantity||0).toLocaleString('fr-FR',{maximumFractionDigits:4});
      text(quantity,xs[0]+widths[0]/2,y-17,{size:10,align:'center'});
      rows.forEach((row,j)=>{let xx=xs[1]+6;for(const part of row){text(part.text,xx,y-16-j*13.4,{size:9.8,font:part.italic?'italic':'regular'});xx+=part.width}});
      text(formatPrice(item.price),xs[2]+widths[2]-7,y-17,{size:10,font:f.italicAmounts?'italic':'regular',align:'right'});
      text(formatPrice(item.quantity*item.price),RIGHT-7,y-17,{size:10,font:f.italicAmounts?'italic':'regular',align:'right'});
      y-=h;
    }
    if(y<179){newPage(true);y=758}
    const sum=f.lines.reduce((s,l)=>s+Number(l.quantity||0)*Number(l.price||0),0);
    const sx=337;
    rule(sx,y-24,RIGHT-sx);
    text(f.documentKind==='credit'?'Total avoir HT':'Total HT',sx+7,y-41,{size:10});
    text(currency(sum),RIGHT-7,y-41,{size:10,font:f.italicAmounts?'italic':'regular',align:'right'});
    rule(sx,y-52,RIGHT-sx);
    multiline(f.tax,sx+7,y-71,{size:8.5,leading:11,maxWidth:RIGHT-sx-14});
    const footerY=Math.min(295,y-113);
    if(footerY<48){newPage(true)}
    const finalY=footerY<48?690:footerY;
    multiline(f.closing,M,finalY,{size:10.1,leading:12});
    const termsY=finalY-42;
    multiline(f.terms,M,termsY,{size:8.5,leading:11,fill:color.gray,maxWidth:490});
    if(f.rib)multiline('RIB – '+f.rib,M,termsY-45,{size:8.7,leading:11,fill:color.gray,maxWidth:495});
    if(pages.length===0 || commands.length){
      const identity=[f.issuer,f.siret,f.address?.replace(/,?\s*\n/g,', ')].filter(Boolean).join(', ');
      text(identity,(M+RIGHT)/2,30,{size:7.4,fill:color.gray,align:'center'});
    }
    pages.push(commands.join('\n')+'\n');
    const objects=[null];
    const obj=content=>(objects.push(content),objects.length-1);
    const catalog=obj('');const pagesObj=obj('');
    const f1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const f2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const f3=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');
    const f4=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>');
    const f5=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>');
    const res=`<< /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R /F4 ${f4} 0 R /F5 ${f5} 0 R >> >>`;
    const kids=[];
    for(const content of pages){
      const stream=obj(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
      kids.push(obj(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${fmt(PAGE_W)} ${fmt(PAGE_H)}] /Resources ${res} /Contents ${stream} 0 R >>`));
    }
    objects[catalog]=`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
    objects[pagesObj]=`<< /Type /Pages /Kids [${kids.map(n=>n+' 0 R').join(' ')}] /Count ${kids.length} >>`;
    const info=obj(`<< /Title <${hex(meta.title)}> /Producer <${hex(meta.producer)}> >>`);
    const chunks=[];let offset=0;const write=s=>{const bytes=encoder.encode(s);chunks.push(bytes);offset+=bytes.length};
    write('%PDF-1.4\n%Philosophal\n');
    const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=offset;write(`${i} 0 obj\n${objects[i]}\nendobj\n`)}
    const xref=offset;write(`xref\n0 ${objects.length}\n0000000000 65535 f \n`);
    for(let i=1;i<objects.length;i++)write(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
    write(`trailer\n<< /Size ${objects.length} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(chunks,{type:'application/pdf'});
  }
  window.PhilosophalInvoicePDF=Object.freeze({create});
})();

(() => {
  "use strict";
  const DATA = window.FV_MEDIATHEQUE_DATA || { resources: [] };
  const $ = (s) => document.querySelector(s);
  const title = $("[data-course-title]");
  const description = $("[data-course-description]");
  const domain = $("[data-course-domain]");
  const path = $("[data-course-path]");
  const meta = $("[data-course-meta]");
  const loading = $("[data-course-loading]");
  const content = $("[data-course-content]");
  const error = $("[data-course-error]");
  const aside = $("[data-course-aside]");
  const toc = $("[data-course-toc]");

  function esc(value="") {
    return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }
  function slug(value="") {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  }
  function sitePrefix() {
    const p = location.pathname.replace(/\/index\.html$/i,"/");
    const marker="/mediatheque/";
    const i=p.indexOf(marker);
    return i>0?p.slice(0,i):"";
  }
  const PREFIX=sitePrefix();
  function resolveUrl(url="") {
    if (/^https?:/i.test(url)) return url;
    return url.startsWith("/") ? `${PREFIX}${url}` || url : new URL(url,location.href).href;
  }
  function stripInlineMarkup(text="") {
    return String(text)
      .replace(/\[\[fmt:[^\]]+\]\]/gi, "")
      .replace(/\[\[\/fmt\]\]/gi, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\((?:https?:\/\/)?[^)]+\)/g, "$1")
      .replace(/<https?:\/\/[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function inline(text="") {
    let out=esc(text);
    // Lightweight formatting preserved from source notes. The syntax is internal
    // to the private media library and deliberately whitelisted here.
    const allowed = new Set([
      "bold","italic","underline","yellow","green","blue","pink","red",
      "orange","red-text","green-text"
    ]);
    out=out.replace(/\[\[fmt:([a-z0-9,-]+)\]\]([\s\S]*?)\[\[\/fmt\]\]/gi,(_,raw,body)=>{
      const classes=raw.split(",").map(x=>x.trim().toLowerCase()).filter(x=>allowed.has(x));
      if(!classes.length) return body;
      return `<span class="course-fmt ${classes.map(x=>`course-fmt--${x}`).join(" ")}">${body}</span>`;
    });
    out=out.replace(/`([^`]+)`/g,"<code>$1</code>");
    out=out.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
    out=out.replace(/\*([^*]+)\*/g,"<em>$1</em>");
    out=out.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    out=out.replace(/&lt;(https?:\/\/[^&]+)&gt;/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    out=out.replace(/(?<!["'=])(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
  }
  function renderMarkdown(md="") {
    const lines=md.replace(/\r/g,"").split("\n");
    const html=[];
    let para=[], list=null, table=null;
    const headings=[];
    const flushPara=()=>{ if(para.length){ html.push(`<p>${inline(para.join(" "))}</p>`); para=[]; } };
    const flushList=()=>{ if(list){ html.push(`<${list.type}>${list.items.map(x=>`<li>${inline(x)}</li>`).join("")}</${list.type}>`); list=null; } };
    const flushTable=()=>{ if(table){ const [head,...rows]=table; html.push(`<div class="course-table-wrap"><table><thead><tr>${head.map(c=>`<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); table=null; } };
    const flush=()=>{flushPara();flushList();flushTable();};

    for(let i=0;i<lines.length;i++){
      const raw=lines[i].trimEnd(), line=raw.trim();
      if(!line){ flush(); continue; }

      const tableLike=/^\|.*\|$/.test(line);
      if(tableLike){
        flushPara();flushList();
        const cells=line.slice(1,-1).split("|").map(x=>x.trim());
        const next=(lines[i+1]||"").trim();
        if(!table && /^\|\s*:?-+/.test(next)){
          table=[cells]; i++; continue;
        }
        if(table){ table.push(cells); continue; }
      } else if(table){ flushTable(); }

      const h=line.match(/^(#{1,3})\s+(.+)$/);
      if(h){
        flush();
        const level=h[1].length, rawText=h[2].trim(), text=stripInlineMarkup(rawText), id=slug(text)+"-"+headings.length;
        if(level>=2) headings.push({level,text,id});
        html.push(`<h${level} id="${id}">${inline(rawText)}</h${level}>`);
        continue;
      }
      if(/^>\s?/.test(line)){ flush(); html.push(`<blockquote>${inline(line.replace(/^>\s?/,""))}</blockquote>`); continue; }
      if(/^---+$/.test(line)){ flush(); html.push("<hr>"); continue; }
      let m=line.match(/^[-*]\s+(.+)$/);
      if(m){ flushPara();flushTable(); if(!list||list.type!=="ul"){flushList();list={type:"ul",items:[]};} list.items.push(m[1]); continue; }
      m=line.match(/^\d+[.)]\s+(.+)$/);
      if(m){ flushPara();flushTable(); if(!list||list.type!=="ol"){flushList();list={type:"ol",items:[]};} list.items.push(m[1]); continue; }
      para.push(line);
    }
    flush();
    return { html:html.join("\n"), headings };
  }

  async function init(){
    const id=new URLSearchParams(location.search).get("id");
    const item=(DATA.resources||[]).find(x=>x.kind==="cours" && String(x.id).split(":").pop()===id);
    if(!item){ loading.hidden=true; error.hidden=false; return; }

    document.body.dataset.theme=item.courseTheme||"general";
    document.title=`${item.title} — Médiathèque`;
    title.textContent=item.title;
    description.textContent=item.description||"";
    domain.textContent=item.formation||"Cours";
    path.textContent=[item.degree,item.year,item.semester,item.ue].filter(Boolean).join(" · ");
    meta.innerHTML=[item.module,item.sourceType,item.format,...(item.themes||[]).slice(0,3)].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join("");

    try{
      const response=await fetch(resolveUrl(item.contentUrl),{cache:"no-store"});
      if(!response.ok) throw new Error("fetch");
      const md=await response.text();
      const rendered=renderMarkdown(md);
      content.innerHTML=rendered.html;
      content.hidden=false;
      loading.hidden=true;
      if(rendered.headings.length>=2){
        toc.innerHTML=rendered.headings.map(h=>`<a class="is-level-${h.level}" href="#${h.id}">${esc(h.text)}</a>`).join("");
        aside.hidden=false;
      }
    }catch(_){
      loading.hidden=true; error.hidden=false;
    }
  }
  init();
})();
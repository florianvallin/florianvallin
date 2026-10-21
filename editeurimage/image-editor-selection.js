/* Philosophal V16 — moteur de sélection et masques, entièrement local. */
(() => {
  "use strict";
  const make=(w,h)=>{const c=document.createElement("canvas");c.width=w;c.height=h;return c;};
  const rect=(points)=>{const xs=points.map(p=>p.x),ys=points.map(p=>p.y);const x=Math.min(...xs),y=Math.min(...ys);return {x,y,w:Math.max(0,Math.max(...xs)-x),h:Math.max(0,Math.max(...ys)-y)};};
  function shape(w,h,kind,points){
    const c=make(w,h),x=c.getContext("2d");
    if(points.length<1)return c;
    x.fillStyle="white";x.beginPath();
    if(kind==="rect"||kind==="ellipse"){
      const r=rect([points[0],points.at(-1)]);
      if(kind==="rect")x.rect(r.x,r.y,r.w,r.h);
      else x.ellipse(r.x+r.w/2,r.y+r.h/2,Math.max(.01,r.w/2),Math.max(.01,r.h/2),0,0,2*Math.PI);
    }else{
      x.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))x.lineTo(p.x,p.y);
      x.closePath();
    }
    x.fill();return c;
  }
  function compose(old,newSelection,mode){
    if(!old)return mode==="subtract"?make(newSelection.width,newSelection.height):newSelection;
    if(mode==="replace")return newSelection;
    const result=make(old.width,old.height),x=result.getContext("2d");x.drawImage(old,0,0);
    x.globalCompositeOperation=mode==="subtract"?"destination-out":"source-over";
    x.drawImage(newSelection,0,0);return result;
  }
  function invert(c){const r=make(c.width,c.height),x=r.getContext("2d");x.fillStyle="white";x.fillRect(0,0,r.width,r.height);x.globalCompositeOperation="destination-out";x.drawImage(c,0,0);return r;}
  function feather(c,pixels){if(!pixels)return c;const r=make(c.width,c.height),x=r.getContext("2d");x.filter=`blur(${Math.min(70,Math.max(0,pixels))}px)`;x.drawImage(c,0,0);return r;}
  function fromColor(source,x,y,tolerance=30,contiguous=true){
    const w=source.width,h=source.height;
    if(w*h>12_000_000)throw new Error("Sélection de couleur limitée à 12 Mpx. Réduisez d'abord l'image.");
    const src=source.getContext("2d",{willReadFrequently:true}).getImageData(0,0,w,h).data;
    const p=(Math.min(h-1,Math.max(0,Math.floor(y)))*w+Math.min(w-1,Math.max(0,Math.floor(x))))*4;
    const target=[src[p],src[p+1],src[p+2],src[p+3]];
    const matches=(i)=>{const j=i*4;const a=Math.abs(src[j]-target[0]),b=Math.abs(src[j+1]-target[1]),c=Math.abs(src[j+2]-target[2]),d=Math.abs(src[j+3]-target[3]);return Math.max(a,b,c,d)<=tolerance;};
    const buf=new Uint8Array(w*h);
    if(contiguous){
      const seen=new Uint8Array(w*h),stack=[p/4];seen[p/4]=1;
      while(stack.length){const i=stack.pop();if(!matches(i))continue;buf[i]=255;
        const xx=i%w,yy=Math.floor(i/w);
        if(xx>0&&!seen[i-1]){seen[i-1]=1;stack.push(i-1);}if(xx<w-1&&!seen[i+1]){seen[i+1]=1;stack.push(i+1);}
        if(yy>0&&!seen[i-w]){seen[i-w]=1;stack.push(i-w);}if(yy<h-1&&!seen[i+w]){seen[i+w]=1;stack.push(i+w);}
      }
    }else{for(let i=0;i<buf.length;i++)if(matches(i))buf[i]=255;}
    const c=make(w,h),out=c.getContext("2d"),data=out.createImageData(w,h);
    for(let i=0;i<buf.length;i++){const j=i*4;data.data[j]=255;data.data[j+1]=255;data.data[j+2]=255;data.data[j+3]=buf[i];}
    out.putImageData(data,0,0);return c;
  }
  function toLocalMask(selection,layer,nw,nh){
    const c=make(nw,nh),x=c.getContext("2d");
    x.translate(nw/2,nh/2);x.scale((nw/Math.max(.01,layer.w))*(layer.mirrorX?-1:1),(nh/Math.max(.01,layer.h))*(layer.mirrorY?-1:1));
    x.rotate(-(layer.rotation||0)*Math.PI/180);
    x.translate(-(layer.x+layer.w/2),-(layer.y+layer.h/2));
    x.drawImage(selection,0,0);return c;
  }
  function pointToLocal(point,layer,nw,nh){
    const a=-(layer.rotation||0)*Math.PI/180,xx=point.x-(layer.x+layer.w/2),yy=point.y-(layer.y+layer.h/2);
    const rx=xx*Math.cos(a)-yy*Math.sin(a),ry=xx*Math.sin(a)+yy*Math.cos(a);
    return {x:(rx*(layer.mirrorX?-1:1)/Math.max(.01,layer.w)+.5)*nw,y:(ry*(layer.mirrorY?-1:1)/Math.max(.01,layer.h)+.5)*nh};
  }
  function stroke(canvas,from,to,diameter,show){
    const x=canvas.getContext("2d");x.save();x.globalCompositeOperation=show?"source-over":"destination-out";x.lineWidth=Math.max(1,diameter);x.lineJoin="round";x.lineCap="round";x.strokeStyle="white";
    if(Math.hypot(to.x-from.x,to.y-from.y)<.01){x.fillStyle="white";x.beginPath();x.arc(from.x,from.y,Math.max(.5,diameter/2),0,2*Math.PI);x.fill();}
    else{x.beginPath();x.moveTo(from.x,from.y);x.lineTo(to.x,to.y);x.stroke();}x.restore();
  }
  window.PhilosophalSelection={make,shape,compose,invert,feather,fromColor,toLocalMask,pointToLocal,stroke};
})();

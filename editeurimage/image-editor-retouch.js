/* Philosophal V15 — traitement local des réglages photo sur des copies temporaires.
   Aucun pixel de l'original ni aucune ressource du projet n'est modifié. */
(() => {
  'use strict';
  const limits = {
    exposure: [-100,100], highlights:[-100,100], shadows:[-100,100],
    whites:[-100,100], blacks:[-100,100], temperature:[-100,100],
    tint:[-100,100], vibrance:[-100,100], sharpen:[0,100], vignette:[0,100]
  };
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const smooth=(a,b,x)=>{ const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t); };
  const advancedKeys=Object.keys(limits);
  const active = a => advancedKeys.some(k => Math.abs(Number(a?.[k])||0) > .001);
  const clean=a=>Object.fromEntries(advancedKeys.map(k=>[k,clamp(Number(a?.[k])||0,...limits[k])]));
  function apply(source, w, h, raw, options={}) {
    const a=clean(raw);
    if(!active(a)) return source;
    const maxPixels=options.fullQuality ? Infinity : 2_200_000;
    const maxSide=options.fullQuality ? Infinity : 2400;
    const scale=Math.min(1,Math.sqrt(maxPixels / (w*h)), maxSide/Math.max(w,h));
    const width=Math.max(1,Math.round(w*scale)), height=Math.max(1,Math.round(h*scale));
    const out=document.createElement('canvas'); out.width=width;out.height=height;
    const context=out.getContext('2d',{alpha:true});
    if(!context)return source;
    // Traitement par bandes : mémoire de travail stable même pour les grands exports.
    const scratch=document.createElement('canvas');
    const exposure=Math.pow(2,a.exposure/90);
    const hasVignette=a.vignette>0;
    const block=Math.max(24,Math.min(256,Math.floor(1_100_000/width)));
    for(let start=0;start<height;start+=block){
      const top=Math.max(0,start-(a.sharpen>0?1:0));
      const bottom=Math.min(height,start+block+(a.sharpen>0?1:0));
      const rows=bottom-top;
      scratch.width=width;scratch.height=rows;
      const sc=scratch.getContext('2d',{willReadFrequently:true});
      sc.clearRect(0,0,width,rows);
      sc.drawImage(source,0,top*h/height,w,rows*h/height,0,0,width,rows);
      let image;
      try{image=sc.getImageData(0,0,width,rows);}catch{return source;}
      const data=image.data;
      for(let localY=0,i=0;localY<rows;localY++){
        const y=top+localY;
        const dy=(y+0.5-height/2)/(height/2);
        for(let x=0;x<width;x++,i+=4){
          if(data[i+3]===0)continue;
          let r=data[i]*exposure,g=data[i+1]*exposure,b=data[i+2]*exposure;
          const luminosity=(.2126*r+.7152*g+.0722*b)/255;
          const low=1-smooth(.12,.73,luminosity),high=smooth(.35,.91,luminosity);
          const black=1-smooth(.03,.38,luminosity),white=smooth(.62,.99,luminosity);
          const delta=(a.shadows*low*.64+a.highlights*high*.62+a.blacks*black*.40+a.whites*white*.40)*2.55;
          r+=delta;g+=delta;b+=delta;
          const warmth=a.temperature*.28;r+=warmth;g+=warmth*.06;b-=warmth;
          const tint=a.tint*.23;r+=tint;g-=tint*.8;b+=tint;
          const lum=.2126*r+.7152*g+.0722*b;
          const saturation=clamp((Math.max(r,g,b)-Math.min(r,g,b))/255,0,1);
          const vFactor=a.vibrance>=0?a.vibrance*.011*(1-saturation*.72):a.vibrance*.009;
          r=lum+(r-lum)*(1+vFactor);g=lum+(g-lum)*(1+vFactor);b=lum+(b-lum)*(1+vFactor);
          if(hasVignette){
            const dx=(x+.5-width/2)/(width/2),rad=Math.sqrt(dx*dx+dy*dy);
            const dark=smooth(.38,1.35,rad)*a.vignette/100*.78;
            r*=1-dark;g*=1-dark;b*=1-dark;
          }
          data[i]=clamp(Math.round(r),0,255);
          data[i+1]=clamp(Math.round(g),0,255);
          data[i+2]=clamp(Math.round(b),0,255);
        }
      }
      if(a.sharpen>0&&width>2&&height>2){
        const pixels=new Uint8ClampedArray(data);
        const power=a.sharpen/100*1.35;
        for(let localY=1;localY<rows-1;localY++){
          for(let x=1;x<width-1;x++){
            const at=(localY*width+x)*4;
            if(!pixels[at+3])continue;
            for(let ch=0;ch<3;ch++){
              const neighbor=(pixels[at-4+ch]+pixels[at+4+ch]+pixels[at-width*4+ch]+pixels[at+width*4+ch])*.25;
              data[at+ch]=clamp(pixels[at+ch]+(pixels[at+ch]-neighbor)*power,0,255);
            }
          }
        }
      }
      // N'écrit que la bande centrale : les lignes de bord sont des halos pour la netteté.
      context.putImageData(image,0,top,0,start-top,width,Math.min(block,height-start));
    }
    return out;
  }
  window.PhilosophalRetouch={limits, advancedKeys,active,clean,apply};
})();

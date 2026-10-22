/* Philosophal V14 — production locale : PDF 1 page et archive ZIP, sans service externe. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const bytes = value => encoder.encode(String(value));
  const concat = chunks => {
    const size = chunks.reduce((n, item) => n + item.length, 0);
    const out = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
    return out;
  };
  const le16 = value => Uint8Array.of(value & 255, (value >>> 8) & 255);
  const le32 = value => Uint8Array.of(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
  const clamp = (number, a, b) => Math.min(b, Math.max(a, number));
  const pageFormats = { a4: [595.276, 841.89], a3: [841.89, 1190.55], letter: [612, 792] };

  function pdfLayout(pixelWidth, pixelHeight, options = {}) {
    if (!pixelWidth || !pixelHeight) throw new Error('Dimensions de document invalides.');
    const dpi = clamp(Number(options.dpi) || 300, 72, 600);
    const paper = options.paper || 'a4';
    const dimensions = paper === 'image' ? [pixelWidth * 72 / dpi, pixelHeight * 72 / dpi] : (pageFormats[paper] || pageFormats.a4).slice();
    const portrait = options.orientation === 'portrait' || (options.orientation !== 'landscape' && pixelWidth <= pixelHeight);
    if (paper !== 'image' && ((dimensions[0] < dimensions[1]) !== portrait)) dimensions.reverse();
    const [pageWidth, pageHeight] = dimensions;
    const margin = paper === 'image' ? 0 : clamp(Number(options.margin) || 0, 0, 35) * 72 / 25.4;
    const availableW = Math.max(1, pageWidth - 2 * margin), availableH = Math.max(1, pageHeight - 2 * margin);
    const ratio = (options.fit === 'cover' ? Math.max : Math.min)(availableW / pixelWidth, availableH / pixelHeight);
    const drawW = pixelWidth * ratio, drawH = pixelHeight * ratio;
    const effectiveDpi = 72 / ratio;
    return { pageWidth, pageHeight, margin, drawW, drawH, x: (pageWidth-drawW)/2, y:(pageHeight-drawH)/2, effectiveDpi };
  }

  function previewPdf(targetCanvas, source, options) {
    const ctx = targetCanvas.getContext('2d');
    const p = pdfLayout(source.width, source.height, options);
    const factor = Math.min(460/p.pageWidth, 260/p.pageHeight, 1.7);
    targetCanvas.width = Math.round(p.pageWidth * factor);
    targetCanvas.height = Math.round(p.pageHeight * factor);
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,targetCanvas.width,targetCanvas.height);
    ctx.save();ctx.beginPath();ctx.rect(0,0,targetCanvas.width,targetCanvas.height);ctx.clip();
    ctx.drawImage(source,p.x*factor,p.y*factor,p.drawW*factor,p.drawH*factor);ctx.restore();
    return p;
  }

  async function pdfImagePayload(sourceCanvas, quality) {
    // PDF ne gère pas ici la transparence : blanc explicite sur tous les exports.
    const c = document.createElement('canvas'); c.width=sourceCanvas.width; c.height=sourceCanvas.height;
    const ctx=c.getContext('2d',{willReadFrequently:quality === 'lossless'});
    if (!ctx) throw new Error('Canvas indisponible');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(sourceCanvas,0,0);
    if (quality === 'lossless') {
      if (c.width*c.height > 16_000_000) throw new Error('Le PDF sans perte est limité à 16 millions de pixels ; choisissez « Haute qualité » pour ce document.');
      if (typeof CompressionStream !== 'function') throw new Error('Le PDF sans perte n’est pas pris en charge par ce navigateur. Choisissez « Haute qualité ».');
      const rgba=ctx.getImageData(0,0,c.width,c.height).data;
      const rgb=new Uint8Array(c.width*c.height*3);
      for(let i=0,j=0;i<rgba.length;i+=4){rgb[j++]=rgba[i];rgb[j++]=rgba[i+1];rgb[j++]=rgba[i+2];}
      const stream = new Blob([rgb]).stream().pipeThrough(new CompressionStream('deflate'));
      const data = new Uint8Array(await new Response(stream).arrayBuffer());
      return { data, filter:'FlateDecode' };
    }
    const q = quality === 'standard' ? .82 : quality === 'maximum' ? 1 : .96;
    const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('Encodage JPEG impossible')),'image/jpeg',q));
    return {data:new Uint8Array(await blob.arrayBuffer()),filter:'DCTDecode'};
  }

  async function createPdf(sourceCanvas, options = {}) {
    if (!sourceCanvas?.width || !sourceCanvas.height) throw new Error('Aucun document à exporter.');
    const layout=pdfLayout(sourceCanvas.width,sourceCanvas.height,options);
    const image=await pdfImagePayload(sourceCanvas,options.quality || 'high');
    const {pageWidth:W,pageHeight:H,x,y,drawW,drawH}=layout;
    const num = n => Number(n).toFixed(4).replace(/\.?0+$/,'');
    const drawing=`q\n1 1 1 rg\n0 0 ${num(W)} ${num(H)} re f\nQ\nq\n0 0 ${num(W)} ${num(H)} re W n\n${num(drawW)} 0 0 ${num(drawH)} ${num(x)} ${num(y)} cm\n/Im1 Do\nQ\n`;
    const commands=bytes(drawing);
    const header=bytes('%PDF-1.4\n%Philosophal\n');
    const objects=[
      bytes('<< /Type /Catalog /Pages 2 0 R >>'),
      bytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
      bytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(W)} ${num(H)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`),
      concat([bytes(`<< /Type /XObject /Subtype /Image /Width ${sourceCanvas.width} /Height ${sourceCanvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /${image.filter} /Length ${image.data.length} >>\nstream\n`),image.data,bytes('\nendstream')]),
      concat([bytes(`<< /Length ${commands.length} >>\nstream\n`),commands,bytes('endstream')])
    ];
    const sections=[header], offsets=[0];let pos=header.length;
    objects.forEach((obj,i)=>{
      offsets.push(pos);
      const data=concat([bytes(`${i+1} 0 obj\n`),obj,bytes('\nendobj\n')]);
      sections.push(data);pos+=data.length;
    });
    const xref=pos;
    let table=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
    for(let i=1;i<offsets.length;i++)table+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
    sections.push(bytes(table+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
    const pdf=concat(sections);
    return {blob:new Blob([pdf],{type:'application/pdf'}),layout,pixelWidth:sourceCanvas.width,pixelHeight:sourceCanvas.height};
  }

  // ZIP store (sans compression) : les images sont déjà compressées. Encodage UTF-8.
  const crcTable=(()=>{const t=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[i]=c>>>0;}return t;})();
  const crc32=data=>{let c=0xffffffff;for(const x of data)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
  async function createZip(files) {
    if(!files.length)throw new Error('Aucun fichier sélectionné.');
    const chunks=[],central=[];let position=0;
    for(const entry of files){
      const raw=entry.blob instanceof Blob ? new Uint8Array(await entry.blob.arrayBuffer()) : entry.data;
      const filename=bytes(String(entry.name).replace(/[/\\\0-\x1f]/g,'_'));
      if(filename.length>65535||raw.length>0xffffffff)throw new Error('Fichier trop volumineux pour ZIP.');
      const crc=crc32(raw),general=0x0800;
      const local=concat([le32(0x04034b50),le16(20),le16(general),le16(0),le16(0),le16(0),le32(crc),le32(raw.length),le32(raw.length),le16(filename.length),le16(0),filename]);
      chunks.push(local,raw);
      central.push(concat([le32(0x02014b50),le16(20),le16(20),le16(general),le16(0),le16(0),le16(0),le32(crc),le32(raw.length),le32(raw.length),le16(filename.length),le16(0),le16(0),le16(0),le16(0),le32(0),le32(position),filename]));
      position+=local.length+raw.length;
    }
    const directory=concat(central);
    const trailer=concat([le32(0x06054b50),le16(0),le16(0),le16(files.length),le16(files.length),le32(directory.length),le32(position),le16(0)]);
    return new Blob([...chunks,directory,trailer],{type:'application/zip'});
  }
  window.PhilosophalProduction=Object.freeze({createPdf,pdfLayout,previewPdf,createZip});
})();

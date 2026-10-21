/* Passages et journal de prises : offsets du texte source, sans dépendance au lecteur. */
((root, factory) => {
  const api = factory(typeof module === 'object' && module.exports ? require('./teleprompteur-core.js') : root.PhilosophalPromptText);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhilosophalPromptTakes = api;
})(typeof globalThis === 'object' ? globalThis : this, T => {
  'use strict';
  const MAX_TAKES = 500, plain = value => value && typeof value === 'object' && !Array.isArray(value);
  const integer = (value,min,max) => Math.max(min,Math.min(max,Math.floor(Number(value) || 0)));
  const id = () => globalThis.crypto?.randomUUID?.() || `take-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  function range(value,source) {
    if (!plain(value)) return null;
    let start = integer(value.start,0,source.length), end = integer(value.end,0,source.length);
    while (start < end && /\s/.test(source[start])) start++;
    while (end > start && /\s/.test(source[end - 1])) end--;
    return end > start ? {start,end} : null;
  }
  function normalize(value,source = '') {
    value = plain(value) ? value : {};
    if (value.takes !== undefined && (!Array.isArray(value.takes) || value.takes.length > MAX_TAKES)) throw new Error('Un script peut contenir au plus 500 prises.');
    const ids = new Set(), now = Date.now();
    const takes = (value.takes || []).map(take => {
      if (!plain(take)) throw new Error('Une prise du fichier est invalide.');
      const key = typeof take.id === 'string' && /^[a-z0-9_-]{1,90}$/i.test(take.id) ? take.id : id();
      if (ids.has(key)) throw new Error('Le journal contient deux prises avec le même identifiant.');
      ids.add(key);
      return {id:key,number:integer(take.number,1,Number.MAX_SAFE_INTEGER),createdAt:integer(take.createdAt || now,1,now),updatedAt:integer(take.updatedAt || take.createdAt || now,1,now),
        duration:Math.max(0,Math.min(86400,Number(take.duration) || 0)),status:['keep','retry'].includes(take.status) ? take.status : 'review',
        excerpt:typeof take.excerpt === 'string' ? take.excerpt.slice(0,500) : '',note:typeof take.note === 'string' ? take.note.slice(0,600) : '',
        start:integer(take.start,0,250000),end:integer(take.end,0,250000)};
    }).sort((a,b) => a.createdAt - b.createdAt || a.number - b.number);
    const selected = range(value.range,source);
    return {range:selected,loop:!!selected && value.loop === true,nextNumber:Math.max(integer(value.nextNumber,1,Number.MAX_SAFE_INTEGER),...takes.map(take => take.number + 1)),takes};
  }
  function sentences(source,selected = null,segmenter = globalThis.Intl?.Segmenter ? new Intl.Segmenter('fr',{granularity:'sentence'}) : null) {
    const bounds = range(selected,source) || {start:0,end:source.length}, result = [];
    for (const part of T.blocks(source)) {
      const pieces = segmenter ? [...segmenter.segment(part.text)].map(item => ({index:item.index,text:item.segment})) : (() => {
        const chunks = []; let start = 0;
        for (const match of part.text.matchAll(/[.!?…]+[»”"’')\]]*(?=\s|$)/g)) { const end = match.index + match[0].length; chunks.push({index:start,text:part.text.slice(start,end)}); start = end; }
        if (start < part.text.length) chunks.push({index:start,text:part.text.slice(start)});
        return chunks;
      })();
      for (const item of pieces) {
        const start = Math.max(bounds.start,part.start + item.index), end = Math.min(bounds.end,part.start + item.index + item.text.length);
        const trimmed = range({start,end},source); if (trimmed) result.push({...trimmed,text:source.slice(trimmed.start,trimmed.end)});
      }
    }
    return result;
  }
  function phraseAt(source,offset,previous = false,selected = null) {
    const parts = sentences(source,selected); if (!parts.length) return null;
    let index = parts.findIndex(part => part.end > offset); if (index < 0) index = parts.length - 1;
    if (previous) index = Math.max(0,index - 1);
    return parts[index];
  }
  function rebase(value,before,after) {
    const state = normalize(value,before); if (before === after || !state.range) return normalize(state,after);
    const start = T.mapOffset(before,after,state.range.start), end = T.mapOffset(before,after,state.range.end);
    return normalize({...state,range:{start,end},loop:false},after);
  }
  const same = (a,b) => JSON.stringify(a || {}) === JSON.stringify(b || {});
  function merge(existing,incoming,source) {
    const a = normalize(existing,source), b = normalize(incoming,source), entries = new Map(a.takes.map(take => [take.id,take]));
    for (const take of b.takes) if (!entries.has(take.id) || entries.get(take.id).updatedAt < take.updatedAt) entries.set(take.id,take);
    return normalize({...a,nextNumber:Math.max(a.nextNumber,b.nextNumber),takes:[...entries.values()]},source);
  }
  function journal(title,value) {
    const names = {keep:'À GARDER',retry:'À REFAIRE',review:'À ÉVALUER'};
    const stamp = date => new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'medium'}).format(date);
    return [`JOURNAL DE PRISES — ${title}`,'',...value.takes.flatMap(take => [
      `PRISE ${take.number} · ${names[take.status]} · ${Math.round(take.duration)} s · ${stamp(take.createdAt)}`,
      take.excerpt,take.note ? `Note : ${take.note}` : '', ''
    ])].join('\n');
  }
  return {MAX_TAKES,range,normalize,sentences,phraseAt,rebase,merge,same,journal,id};
});

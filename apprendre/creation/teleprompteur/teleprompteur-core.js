/* Correspondance entre le texte source et le passage lu, sans dépendance au DOM. */
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhilosophalPromptText = api;
})(typeof globalThis === 'object' ? globalThis : this, () => {
  'use strict';
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function blocks(source) {
    const result = [], separators = /\n[ \t]*\n(?:[ \t]*\n)*/g;
    let start = 0;
    function add(end) {
      const raw = source.slice(start, end), value = raw.trim();
      if (value) result.push({text: value, start: start + raw.indexOf(value), end: start + raw.indexOf(value) + value.length});
    }
    for (const match of source.matchAll(separators)) { add(match.index); start = match.index + match[0].length; }
    add(source.length);
    return result;
  }
  function mapOffset(before, after, offset) {
    const at = clamp(Number(offset) || 0, 0, before.length);
    if (before === after) return at;
    let prefix = 0, suffix = 0;
    while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix++;
    while (suffix < before.length - prefix && suffix < after.length - prefix && before[before.length - 1 - suffix] === after[after.length - 1 - suffix]) suffix++;
    if (at < prefix) return at;
    if (at >= before.length - suffix) return clamp(at + after.length - before.length, 0, after.length);
    return prefix + Math.min(at - prefix, after.length - prefix - suffix);
  }
  function wordCount(value) { return (String(value).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length; }
  return {blocks, mapOffset, wordCount, clamp};
});

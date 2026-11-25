#!/usr/bin/env node
/**
 * The full-text search (lib/Search.js) against the real course data, in every language: queries a reader would type
 * must find the lessons that teach them, with the matched words marked in the snippet. Exit 1 on a failure.
 *   node tests/search.test.js
 */
'use strict';
const path = require('path');
const root = path.join(__dirname, '..');
const Data = require(path.join(root, 'lib/Data.js'));
const ix = Data.loadNode(root).index;
const S = require(path.join(root, 'lib/Search.js'));
let bad = 0;
function expect(lang, q, want, note) {
    const r = S.build(ix, lang).query(q, { max: 10 });
    const hit = r.find(x => (x.doc.lesson || '') === want.lesson && (want.block === undefined || x.doc.block === want.block));
    const marked = hit && hit.snippet.some(p => p.hit);
    const ok = !!hit && (want.noMark || marked);
    if (!ok) bad++;
    console.log((ok ? 'ok    ' : 'FAIL  ') + lang + '  ' + JSON.stringify(q) + ' → ' + (hit ? hit.doc.lesson + '/' + hit.doc.block : r.slice(0, 3).map(x => x.doc.lesson + '/' + x.doc.block).join(', ') || 'nothing') + (note ? '   (' + note + ')' : ''));
}
['en', 'de', 'fa'].forEach(l => {
    expect(l, 'printf', { lesson: 'C.L03', block: null }, 'title hit');
    expect(l, '%d', { lesson: 'C.L03' });
    expect(l, 'undefined reference', { lesson: 'C.L02' });
    expect(l, 'E-04', { lesson: 'C.L02', block: 'mistakes' });
    expect(l, 'C:\\notes', { lesson: 'C.L03' }, 'backslash kept');
});
expect('fa', 'میخواند', { lesson: 'C.L01' }, 'without the zero-width non-joiner');
expect('fa', 'مي‌خواند', { lesson: 'C.L01' }, 'Arabic ye');
expect('fa', 'كامپايلر', { lesson: 'C.L01' }, 'Arabic kaf and ye');
expect('de', 'ubung', { lesson: 'C.L01', block: 'practice', noMark: true }, 'umlaut folded; the hit is the section title Übung');
expect('de', 'WARNUNG', { lesson: 'C.L02' }, 'case folded');
expect('en', 'linked list', { lesson: 'C.L38', noMark: true }, 'a lesson still to come');
const none = S.build(ix, 'en').query('zzqxj');
if (none.length) { bad++; console.log('FAIL  en  nonsense query found ' + none.length); } else console.log('ok    en  "zzqxj" → nothing');
console.log(bad ? bad + ' failure(s)' : 'all search tests passed');
process.exit(bad ? 1 : 0);

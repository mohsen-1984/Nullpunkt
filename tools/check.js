#!/usr/bin/env node
/**
 * The checker — every rule of docs/rules/ that can be checked by a program, on the data in data/.
 * Zero errors and zero warnings is the condition for every change (S.DAT.05).
 *
 *   node tools/check.js          report and exit 1 on any error or warning
 *   node tools/check.js --list   list the rules this checker covers
 *
 * Each finding names the rule Id, the record and what is wrong.
 */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const Data = require(path.join(root, 'lib/Data.js'));
const Scan = require(path.join(root, 'lib/CodeScan.js'));
const N = Data.loadNode(root);
const ix = N.index;
const reg = ix.reg, conv = ix.conventions, G = ix.generated;
const LANGS = N.registry.languages;

const findings = [];
const err = (rule, id, msg) => findings.push({ level: 'error', rule, id, msg });
const warn = (rule, id, msg) => findings.push({ level: 'warning', rule, id, msg });
const COVERED = new Set(('S.DAT.06 S.ID.02 S.ID.03 S.DAT.02 S.DAT.04 S.MRK.01 S.MRK.02 S.MRK.04 S.TYP.01 S.TYP.02 S.TYP.04 S.TYP.05 ' +
    'S.TYP.06 S.TYP.15 S.CH.05 S.CH.06 S.STD.02 S.STY.01 S.STY.04 S.STY.08 S.PIT.01 S.PIT.03 S.PIT.04 S.PIT.06 S.BND.01 ' +
    'S.BND.02 S.BND.03 S.PRM.01 S.PRM.02 S.PRM.03 S.AST.01 C.LES.01 C.SLF.01 C.PRD.01 C.FRB.01').split(' '));
const rule = r => r;

ix.problems.forEach(p => err(rule(p.rule), p.id, p.msg));

// ---------- Ids (S.ID.02, patterns) ----------
const PATTERNS = [
    [ix.lesson, /^C\.L\d{2}$/], [ix.code, /^C\.L\d{2}\.K\d{2}$/], [ix.mistake, /^[MEWRULSPY]-\d{2,3}$/],
    [ix.band, /^C\.L\d{2}\.X\d{2}$/], [ix.item, /^C\.L\d{2}\.X\d{2}\.\d{2}$/], [ix.term, /^T\.[a-z0-9-]+$/],
    [ix.construct, /^K\.[a-z0-9-]+$/], [ix.chunk, /^CH\.[a-z0-9-]+$/], [ix.prompt, /^AI(-\d|\.MASTER)$/],
];
PATTERNS.forEach(([map, re]) => Object.keys(map).forEach(id => { if (!re.test(id)) err(rule('S.ID.02'), id, 'Id does not match ' + re); }));
ix.itemList.forEach(it => (it.tests || []).forEach(t => {
    if (!new RegExp('^' + it.id.replace(/\./g, '\\.') + '\\.T\\d{2}$').test(t.id)) err('S.ID.02', t.id, 'test Id must be <item>.Tnn');
}));

// ---------- text: trilingual strings, markup, typography ----------
const REF_KINDS = { term: ix.term, lesson: ix.lesson, code: ix.code, pit: ix.mistake, band: ix.band, k: ix.construct, block: reg.blocks, std: null };
const BIDI = /[‎‏‪-‮⁦-⁩﻿ ]/;

function checkText(s, lang, where) {
    if (/[۰-۹٠-٩]/.test(s)) err(rule('S.TYP.01'), where, 'Persian or Arabic digits — use ASCII digits');
    if (/[يك]/.test(s)) err(rule('S.TYP.02'), where, 'Arabic ي or ك — use Persian ی and ک');
    if (BIDI.test(s)) err(rule('S.TYP.04'), where, 'invisible direction mark, BOM or no-break space');
    const noCode = s.replace(/`[^`]*`/g, '`…`');
    if ((s.match(/`/g) || []).length % 2) err(rule('S.MRK.01'), where, 'unpaired `');
    if (/<\/?[a-zA-Z][^>]*>/.test(noCode)) err(rule('S.MRK.02'), where, 'HTML tag in text');
    const noRefs = noCode.replace(/\[\[[^\]]*\]\]/g, 'REF');
    if ((noRefs.match(/\*\*/g) || []).length % 2) err(rule('S.MRK.04'), where, 'unpaired **');
    if ((noRefs.replace(/\*\*/g, '').match(/\*/g) || []).length % 2) err('S.MRK.04', where, 'unpaired *');
    if (/\[\[|\]\]/.test(noRefs)) err(rule('S.MRK.01'), where, 'broken [[…]] reference');
    (s.match(/\[\[[^\]]*\]\]/g) || []).forEach(r => {
        const m = r.match(/^\[\[(\w+):([^\]]+)\]\]$/);
        if (!m || !(m[1] in REF_KINDS)) { err(rule('S.ID.03'), where, 'unknown reference ' + r); return; }
        if (REF_KINDS[m[1]] && !REF_KINDS[m[1]][m[2]]) err('S.ID.03', where, 'reference to missing ' + m[1] + ' ' + m[2]);
    });
    if (/ [.,;:!?،؛؟]/.test(noRefs.replace(/`…`/g, 'C'))) err(rule('S.TYP.06'), where, 'space before punctuation');
    if (lang === 'fa' && /[؀-ۿ] ?[,?;] ?[؀-ۿ]/.test(noRefs)) err(rule('S.TYP.05'), where, 'Latin , ; or ? between Persian words');
    if ((lang === 'de' || lang === 'en') && /[،؛؟]/.test(noRefs)) err('S.TYP.05', where, 'Persian punctuation in ' + lang + ' text');
    if (lang === 'de' && /"/.test(noRefs)) err(rule('S.TYP.15'), where, 'German text uses „…“, not "…"');
    if (lang === 'fa' && /"/.test(noRefs)) err('S.TYP.15', where, 'Persian text uses «…», not "…"');
}

const T3_SKIP = new Set(['use', 'gloss', 'alt', 'letters', 'name']);
function walk(o, where, key) {
    if (Array.isArray(o)) { o.forEach((x, i) => walk(x, where, key)); return; }
    if (!o || typeof o !== 'object') return;
    const keys = Object.keys(o);
    if (!('id' in o) && keys.some(k => LANGS.indexOf(k) >= 0) && !T3_SKIP.has(key)) {
        keys.filter(k => LANGS.indexOf(k) < 0).forEach(k => err('S.DAT.02', where, (key || 'text') + ': unexpected key ' + k));
        LANGS.forEach(l => {
            if (typeof o[l] !== 'string' || !o[l].trim()) err(rule('S.DAT.02'), where, (key || 'text') + ': ' + l + ' is missing or empty');
            else checkText(o[l], l, where + ' ' + (key || '') + '.' + l);
        });
        return;
    }
    keys.forEach(k => {
        if (k === 'source' || k === 'solution' || k === 'starter' || k === 'variant' || k === 'lines' || k === 'before' || k === 'after' || k === 'text' && typeof o[k] === 'string') return;
        walk(o[k], (o.id || where), k);
    });
}
Object.keys(N.files).forEach(fid => walk(N.files[fid], fid));
N.registry.catalog.forEach(s => walk(s, 'registry'));

// ---------- data files: size (S.DAT.04) ----------
fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.js')).forEach(f => {
    const size = fs.statSync(path.join(root, 'data', f)).size;
    if (size > 256000) err(rule('S.DAT.04'), f, 'over 250 KB (' + size + ' bytes)');
    else if (size > 0.95 * 256000) warn('S.DAT.04', f, 'over 95 % of the 250 KB cap');
});

// ---------- code: generated results, intent, style ----------
const tag = G ? { gcc: G.compilers.gcc, xcc: G.compilers.xcc } : null;
const hash = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const program = (source, rec) => ({ source, stdin: rec.stdin || '', args: rec.args || [], files: rec.files || {} });
const bundleFile = fs.readdirSync(path.join(root, 'vendor/wcc')).find(f => /^wcc_.*\.js$/.test(f));
const xccCommit = require(path.join(root, 'vendor/wcc', bundleFile)).commit;
if (!G) err(rule('S.CH.05'), 'data/generated', 'missing — run node tools/gen-expect.js');
else if (G.compilers.xcc !== xccCommit) err('S.CH.05', 'data/generated', 'made with another XCC — run node tools/gen-expect.js');

function checkStyle(source, where, isExample) {
    source.split('\n').forEach((l, i) => {
        if (/\t/.test(l)) err(rule('S.STY.01'), where, 'line ' + (i + 1) + ': tab — use 4 spaces');
        if (l.length > 80) err('S.STY.01', where, 'line ' + (i + 1) + ': longer than 80 columns');
        const ind = l.match(/^ */)[0].length;
        if (l.trim() && ind % 4 && !(ind % 4 === 1 && /^\s*\*/.test(l))) err('S.STY.01', where, 'line ' + (i + 1) + ': indentation is not a multiple of 4');
        if (/\/\/ Step\b/.test(l) && !isExample) err(rule('S.STY.08'), where, 'line ' + (i + 1) + ': subgoal comment outside a worked example');
        if (/\/\/ Step\b/.test(l) && !/^\s*\/\/ Step \d+: [a-z].*[^.]$/.test(l)) err('S.STY.08', where, 'line ' + (i + 1) + ': subgoal comment must be "// Step N: verb …" without a final period');
    });
    if (/\bmain\s*\(/.test(source) && !/int main\(void\)|int main\(int argc, char \*argv\[\]\)/.test(source)) err(rule('S.STY.04'), where, 'main must be int main(void) or int main(int argc, char *argv[])');
}

const exampleCodes = new Set();
const codeMode = {};
Object.values(ix.lesson).forEach(L => {
    if (!L.unit) return;
    L.unit.blocks.forEach(b => (b.content || []).forEach(nd => {
        if (nd.type === 'code') { codeMode[nd.ref] = nd.mode; if (b.block === 'example') exampleCodes.add(nd.ref); }
    }));
});

ix.codeList.forEach(c => {
    if (!c.intent) { err(rule('S.CH.05'), c.id, 'no intent'); return; }
    checkStyle(c.source, c.id, exampleCodes.has(c.id));
    if (!G) return;
    const e = G.code[c.id];
    if (!e) { err('S.CH.05', c.id, 'no generated result — run node tools/gen-expect.js'); return; }
    if (e.hash !== hash([program(c.source, c), tag])) { err('S.CH.05', c.id, 'generated result is stale — run node tools/gen-expect.js'); return; }
    const sameOut = e.xcc.compiled && e.gcc.compiled && e.xcc.stdout === e.gcc.stdout && e.xcc.exitCode === e.gcc.exitCode;
    if (c.intent === 'ok') {
        if (!e.gcc.compiled) err('S.CH.05', c.id, 'intent ok, but gcc does not compile it: ' + (e.gcc.diagnostics[0] || {}).message);
        else if (e.gcc.diagnostics.length) err('S.CH.05', c.id, 'intent ok, but gcc warns: ' + e.gcc.diagnostics[0].message);
        else if (e.gcc.exitCode !== 0 || e.gcc.trap) err('S.CH.05', c.id, 'intent ok, but it does not exit with 0');
        else if (!sameOut) err(rule('S.STD.02'), c.id, 'gcc and XCC give different results — fix it or set intent "platform"');
    } else if (c.intent === 'compile-error') {
        if (e.gcc.compiled || e.xcc.compiled) err('S.CH.05', c.id, 'intent compile-error, but ' + (e.gcc.compiled ? 'gcc' : 'XCC') + ' compiles it');
    } else if (c.intent === 'warning') {
        if (!e.gcc.compiled || !e.gcc.diagnostics.some(d => d.severity === 'warning')) err('S.CH.05', c.id, 'intent warning, but gcc gives no warning');
    } else if (c.intent === 'runtime-error') {
        if (!e.gcc.compiled || (!e.gcc.trap && e.gcc.exitCode === 0)) err('S.CH.05', c.id, 'intent runtime-error, but it runs without error');
    } else if (c.intent === 'platform') {
        if (sameOut) warn('S.STD.02', c.id, 'intent platform, but gcc and XCC give the same result');
    } else if (c.intent !== 'ub') err('S.CH.05', c.id, 'unknown intent ' + c.intent);
    if (codeMode[c.id] === 'predict' && c.source.split('\n').filter(Boolean).length > 12) err(rule('C.PRD.01'), c.id, 'predict code longer than 12 lines');
});

// ---------- mistakes (S.PIT.*) ----------
const activated = {};
ix.itemList.forEach(it => (it.activates || []).forEach(m => { (activated[m] = activated[m] || []).push(it.id); }));
Object.values(ix.mistake).forEach(m => {
    if (m.dim !== m.id[0]) err(rule('S.PIT.01'), m.id, 'dim must be the first letter of the Id');
    if (!reg.dimensions[m.dim]) err('S.PIT.01', m.id, 'unknown dimension ' + m.dim);
    const src = reg.sources[m.src];
    if (!src) err('S.PIT.01', m.id, 'unknown source ' + m.src);
    else if (src.transfer && !['CT.false', 'CT.form', 'CT.new'].includes(m.contrast)) err(rule('S.PIT.06'), m.id, 'a transfer mistake needs contrast CT.false, CT.form or CT.new');
    else if (!src.transfer && m.contrast) err('S.PIT.06', m.id, 'a developmental mistake has no contrast type');
    const w = ix.code[m.wrong], r = ix.code[m.right];
    if (!w) err(rule('S.ID.03'), m.id, 'wrong code ' + m.wrong + ' missing');
    else if (reg.dimensions[m.dim] && reg.dimensions[m.dim].intent.indexOf(w.intent) < 0) err(rule('S.PIT.03'), m.id, 'wrong code intent ' + w.intent + ' does not fit dimension ' + m.dim);
    if (!r) err('S.ID.03', m.id, 'right code ' + m.right + ' missing');
    else if (r.intent !== 'ok') err('S.PIT.03', m.id, 'right code must have intent ok');
    if (!activated[m.id]) err(rule('S.PIT.04'), m.id, 'no exercise item activates this mistake');
    if (G && w && r && G.code[w.id] && G.code[r.id] && m.dim === 'M' && G.code[w.id].gcc.stdout === G.code[r.id].gcc.stdout) err('S.PIT.03', m.id, 'wrong and right code print the same');
});

// ---------- exercises (S.BND.*) ----------
Object.values(ix.band).forEach(b => {
    const bt = reg.bandTypes[b.type];
    if (!bt) { err(rule('S.BND.01'), b.id, 'unknown band type ' + b.type); return; }
    b.items.forEach(it => {
        const tests = it.tests || [];
        const where = it.id;
        // the answer key shows a reason for every item (S.BND.02)
        if (!it.why) err('S.BND.02', where, 'needs a why (shown in the answer key)');
        if (b.type === 'B.predict') { if (!ix.code[it.code]) err('S.ID.03', where, 'code ' + it.code + ' missing'); return; }
        if (b.type === 'B.explain') { if (!it.model) err(rule('S.BND.02'), where, 'explain item needs a model answer'); return; }
        if (!tests.some(t => t.purpose === 'normal')) err('S.BND.02', where, 'needs a test with purpose normal');
        const readsInput = tests.some(t => t.stdin) || /\bscanf\b|\bgetchar\b|\bfgets\b/.test(it.solution || '');
        if (readsInput && !tests.some(t => t.purpose === 'edge')) err('S.BND.02', where, 'reads input, so it needs an edge test');
        (it.activates || []).forEach(m => {
            if (!ix.mistake[m]) err('S.ID.03', where, 'activates unknown mistake ' + m);
            else if (b.type !== 'B.parsons' && !tests.some(t => t.purpose === 'mistake' && t.mistake === m)) err('S.BND.02', where, 'activates ' + m + ' but has no mistake test for it');
        });
        tests.forEach(t => {
            if (!['normal', 'edge', 'mistake'].includes(t.purpose)) err('S.BND.02', t.id, 'unknown purpose ' + t.purpose);
            if (!G) return;
            const e = G.tests[t.id];
            if (!e) { err(rule('S.CH.05'), t.id, 'no generated result — run node tools/gen-expect.js'); return; }
            if (t.purpose === 'mistake') {
                if (!ix.mistake[t.mistake]) err('S.ID.03', t.id, 'mistake ' + t.mistake + ' missing');
                if (e.rejects !== true) err('S.BND.02', t.id, 'the mistake version is not rejected by this test');
            } else if (e.xccSame !== true) err(rule('S.STD.02'), t.id, 'solution gives a different result in the browser');
        });
        ['solution', 'starter'].forEach(k => { if (typeof it[k] === 'string') checkStyle(it[k], where + '.' + k, false); });
    });
});

// ---------- lessons: skeleton, can-do, bands, ladder (C.LES.01, C.SLF.01, S.BND.01/03, S.CH.06, C.FRB.01) ----------
const constructs = conv.constructs;
Object.values(ix.lesson).forEach(L => {
    const cat = L.catalog;
    if (cat.status === 'written' && !L.unit) err(rule('C.LES.01'), L.id, 'catalog says written, but no lesson unit found');
    if (!L.unit) return;
    const u = L.unit;
    if (!cat.cando || cat.cando.length !== 5) err(rule('C.SLF.01'), L.id, 'cando must have exactly 5 items');
    // skeleton order and presence
    const order = conv.skeleton.map(s => s.block);
    let last = -1;
    u.blocks.forEach(b => {
        const pos = order.indexOf(b.block);
        if (pos < 0) err(rule('C.LES.01'), L.id, 'block ' + b.block + ' is not in the lesson skeleton');
        else if (pos <= last) err('C.LES.01', L.id, 'block ' + b.block + ' is out of order');
        else last = pos;
    });
    conv.skeleton.forEach(s => {
        const has = u.blocks.some(b => b.block === s.block);
        if (s.fixed && (!s.from || L.n >= s.from) && !has) err('C.LES.01', L.id, 'missing block ' + s.block);
        if (s.generated && has && u.blocks.find(b => b.block === s.block).content.length) err('C.LES.01', L.id, 'block ' + s.block + ' is generated and must be empty');
    });
    // bands: order by rank in practice, required types
    const practice = u.blocks.find(b => b.block === 'practice');
    const ranks = (practice ? practice.content : []).filter(nd => nd.type === 'band').map(nd => (reg.bandTypes[(ix.band[nd.ref] || {}).type] || {}).rank || 0);
    ranks.forEach((r, i) => { if (i && r < ranks[i - 1]) err(rule('S.BND.01'), L.id, 'practice bands are not in rank order'); });
    const types = (u.bands || []).map(b => b.type);
    if (!types.some(t => reg.bandTypes[t] && reg.bandTypes[t].rank === 1)) err(rule('S.BND.03'), L.id, 'needs a rank-1 band');
    if (!types.includes('B.fix')) err('S.BND.03', L.id, 'needs a B.fix band');
    if (!types.includes('B.write')) err('S.BND.03', L.id, 'needs a B.write band');
    (u.bands || []).forEach(b => { if (!u.blocks.some(bl => (bl.content || []).some(nd => nd.type === 'band' && nd.ref === b.id))) err('S.ID.03', b.id, 'band is not placed in any block'); });
    // ladder: every code of this lesson
    const chunkLines = Object.values(ix.chunk).filter(c => c.from <= L.n).reduce((a, c) => a.concat(c.match), []);
    const sources = [];
    ix.codeList.filter(c => ix.lessonOfCode[c.id] === L.id).forEach(c => sources.push([c.id, c.source]));
    (u.bands || []).forEach(b => b.items.forEach(it => {
        ['solution', 'starter'].forEach(k => { if (typeof it[k] === 'string') sources.push([it.id + '.' + k, it[k]]); });
        if (b.type === 'B.parsons') sources.push([it.id, Data.parsonsSource(it, it.solution)]);
        (it.tests || []).forEach(t => { if (t.variant) sources.push([t.id + '.variant', t.variant]); });
    }));
    sources.forEach(([where, src]) => {
        const tokens = Scan.scan(src, { chunks: chunkLines });
        const used = Scan.constructsUsed(tokens, constructs);
        used.forEach((line, cid) => {
            const k = ix.construct[cid];
            if (k.lesson > L.n) err(rule('S.CH.06'), where, 'line ' + line + ': ' + cid + ' is taught in lesson ' + k.lesson + (k.lesson === 99 ? ' (not in 1.0)' : ''));
        });
        conv.forbidden.forEach(f => { if (tokens.some(t => t.kind === 'id' && t.value === f.match.id)) err(rule('C.FRB.01'), where, 'forbidden: ' + f.id); });
    });
});

// ---------- prompts (S.PRM.*) ----------
Object.values(ix.prompt).forEach(p => {
    if (p.id !== 'AI.MASTER' && p.text.split('\n').length > 6) err(rule('S.PRM.01'), p.id, 'more than six lines');
    if (/[*#`]/.test(p.text)) err('S.PRM.01', p.id, 'Markdown in a prompt');
    if (!p.guide || !p.guide.does || !p.guide.give || !p.guide.output) err(rule('S.PRM.02'), p.id, 'needs the three guide answers');
    if (typeof p.waits !== 'boolean') err(rule('S.PRM.03'), p.id, 'waits must be true or false');
});

// ---------- pages load every data file (S.DAT.06) ----------
['index.html', 'lesson.html'].forEach(pg => {
    const html = fs.readFileSync(path.join(root, pg), 'utf8');
    const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.js')).forEach(f => {
        if (srcs.indexOf('data/' + f) < 0) err('S.DAT.06', pg, 'does not load data/' + f);
    });
    if (srcs.indexOf('data/generated/expect.js') < 0) err('S.DAT.06', pg, 'does not load data/generated/expect.js');
    srcs.forEach(s => { if (!/^https?:/.test(s) && !fs.existsSync(path.join(root, s))) err('S.DAT.06', pg, 'loads a missing file: ' + s); });
});

// ---------- icons (S.AST.01) ----------
const iconsFile = fs.readdirSync(path.join(root, 'vendor/lucide')).find(f => /^icons_.*\.js$/.test(f));
const icons = require(path.join(root, 'vendor/lucide', iconsFile)).icons;
const usedIcons = new Set(reg.uiIcons);
[reg.blocks, reg.bandTypes, reg.noteKinds, reg.unitTypes].forEach(gr => Object.values(gr).forEach(x => usedIcons.add(x.icon)));
Object.values(ix.prompt).forEach(p => usedIcons.add(p.icon));
usedIcons.forEach(n => { if (!icons[n]) err(rule('S.AST.01'), n, 'icon not in vendor/lucide — run tools/build-icons.js'); });

// ---------- report ----------
if (process.argv.includes('--list')) { console.log([...COVERED].sort().join('\n')); process.exit(0); }
const errors = findings.filter(f => f.level === 'error'), warnings = findings.filter(f => f.level === 'warning');
findings.forEach(f => console.log((f.level === 'error' ? 'ERROR' : 'WARN ') + '  ' + f.rule.padEnd(9) + ' ' + f.id + ' — ' + f.msg));
const written = Object.values(ix.lesson).filter(L => L.unit).length;
console.log(errors.length + ' errors, ' + warnings.length + ' warnings · ' + written + ' lesson(s), ' + ix.codeList.length + ' code records, ' +
    ix.itemList.length + ' exercise items · ' + COVERED.size + ' rules checked');
process.exit(errors.length || warnings.length ? 1 : 0);

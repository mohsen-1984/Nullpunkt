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
const COVERED = new Set(('C.ORI.01 S.DAT.06 S.ID.02 S.ID.03 S.DAT.02 S.DAT.04 S.MRK.01 S.MRK.02 S.MRK.04 S.TYP.01 S.TYP.02 S.TYP.04 S.TYP.05 ' +
    'S.ID.01 S.LNG.06 S.TYP.06 S.TYP.15 S.CH.05 S.CH.06 S.STD.02 S.STY.01 S.STY.04 S.STY.08 S.PIT.01 S.PIT.03 S.PIT.04 S.PIT.06 S.BND.01 ' +
    'S.BND.02 S.BND.03 S.PRM.01 S.PRM.02 S.PRM.03 S.AST.01 S.AST.05 C.LES.01 C.SLF.01 C.PRD.01 C.FRB.01').split(' '));
const rule = r => r;
const waivers = [];      // S.ID.04: records that name the rule they deliberately break; counted in the report

ix.problems.forEach(p => err(rule(p.rule), p.id, p.msg));

// ---------- Ids (S.ID.02, patterns) ----------
const PATTERNS = [
    // a lesson C.L04 (orientation C.O01) or a chapter's review unit C02.REV, and the codes, bands and items under it
    [ix.lesson, /^(C\.[LO]\d{2}|C\d{2}\.REV)$/], [ix.code, /^(C\.[LO]\d{2}|C\d{2}\.REV)\.K\d{2}$/], [ix.mistake, /^[MEWRULSPY]-\d{2,3}$/],
    [ix.band, /^(C\.[LO]\d{2}|C\d{2}\.REV)\.X\d{2}$/], [ix.item, /^(C\.[LO]\d{2}|C\d{2}\.REV)\.X\d{2}\.\d{2}$/], [ix.term, /^T\.[a-z0-9-]+$/],
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
ix.catalog.forEach(s => walk(s, 'registry'));

// every authored data file: data/*.js and data/<chapter folder>/*.js (not data/generated/)
const DATA_FILES = [].concat(...fs.readdirSync(path.join(root, 'data'), { withFileTypes: true }).map(e =>
    e.isDirectory() ? (e.name === 'generated' ? [] : fs.readdirSync(path.join(root, 'data', e.name)).filter(f => f.endsWith('.js')).map(f => e.name + '/' + f))
        : (e.name.endsWith('.js') ? [e.name] : [])));

// ---------- data files: size (S.DAT.04) ----------
DATA_FILES.forEach(f => {
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
    if (c.asm && !(e.gcc && e.gcc.asm)) err('C.ORI.01', c.id, 'asm: true, but no generated assembly — run node tools/gen-expect.js');
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
        if (b.type === 'B.predict' || b.type === 'B.trace') { if (!ix.code[it.code]) err('S.ID.03', where, 'code ' + it.code + ' missing'); return; }
        if (b.type === 'B.explain') { if (!it.model) err(rule('S.BND.02'), where, 'explain item needs a model answer'); return; }
        if (b.type === 'B.choice') {
            const opts = it.options || [];
            if (!it.prompt) err('S.BND.02', where, 'choice item needs a prompt');
            if (opts.length < 2) err('S.BND.02', where, 'choice item needs at least two options');
            if (opts.filter(o => o.correct === true).length !== 1) err('S.BND.02', where, 'choice item needs exactly one correct option');
            opts.forEach((o, i) => { if (!o.text || !o.feedback) err('S.BND.02', where, 'option ' + (i + 1) + ' needs text and feedback'); });
            return;
        }
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

// ---------- orientation lessons (C.ORI.01): light skeleton, no construct ladder ----------
function checkOrientation(L, u) {
    const o = conv.orientation, blocks = u.blocks.map(b => b.block);
    o.required.forEach(k => { if (blocks.indexOf(k) < 0) err('C.ORI.01', L.id, 'missing block ' + k); });
    o.first.forEach((k, i) => { if (blocks[i] !== k) err('C.ORI.01', L.id, 'block ' + (i + 1) + ' must be ' + k); });
    const lastStart = blocks.findIndex(b => o.last.indexOf(b) >= 0);
    blocks.forEach((b, i) => {
        if (i < o.first.length) return;
        const inLast = o.last.indexOf(b) >= 0;
        if (!inLast && o.allowed.indexOf(b) < 0) err('C.ORI.01', L.id, 'block ' + b + ' is not allowed in an orientation lesson');
        if (!inLast && lastStart >= 0 && i > lastStart) err('C.ORI.01', L.id, 'block ' + b + ' comes after ' + blocks[lastStart]);
    });
    const tail = blocks.filter(b => o.last.indexOf(b) >= 0);
    tail.forEach((b, i) => { if (i && o.last.indexOf(b) <= o.last.indexOf(tail[i - 1])) err('C.ORI.01', L.id, 'block ' + b + ' is out of order'); });
    const ids = new Set();
    u.blocks.forEach(b => {
        const id = b.id || b.block;
        if (ids.has(id)) err('C.ORI.01', L.id, 'block id ' + id + ' used twice');
        ids.add(id);
        if (b.block === 'section' && (!b.id || !b.title || !b.short || !b.icon)) err('C.ORI.01', L.id, 'section ' + (b.id || '?') + ' needs id, title, short and icon');
        if (b.block === 'section' && reg.blocks[b.id]) err('C.ORI.01', L.id, 'section id ' + b.id + ' is the name of a block');
        if (['cando', 'terms', 'selfcheck', 'key'].indexOf(b.block) >= 0 && b.content.length) err('C.ORI.01', L.id, 'block ' + b.block + ' is generated and must be empty');
    });
    if (!(u.bands || []).length) err('C.ORI.01', L.id, 'needs at least one exercise band');
    (u.bands || []).forEach(b => { if (!u.blocks.some(bl => (bl.content || []).some(nd => nd.type === 'band' && nd.ref === b.id))) err('S.ID.03', b.id, 'band is not placed in any block'); });
}

// ---------- lessons: skeleton, can-do, bands, ladder (C.LES.01, C.SLF.01, S.BND.01/03, S.CH.06, C.FRB.01) ----------
const constructs = conv.constructs;
Object.values(ix.lesson).forEach(L => {
    const cat = L.catalog;
    if (cat.status === 'written' && !L.unit) err(rule('C.LES.01'), L.id, 'catalog says written, but no lesson unit found');
    if (!L.unit) return;
    const u = L.unit;
    if (!cat.cando || cat.cando.length !== 5) err(rule('C.SLF.01'), L.id, 'cando must have exactly 5 items');
    if (L.orientation) { checkOrientation(L, u); return; }
    if (L.review) checkReview(L, u);
    else checkLessonSkeleton(L, u);
    (u.bands || []).forEach(b => { if (!u.blocks.some(bl => (bl.content || []).some(nd => nd.type === 'band' && nd.ref === b.id))) err('S.ID.03', b.id, 'band is not placed in any block'); });
    // ladder: every code of this lesson
    checkLadder(L, u);
});

function checkReview(L, u) {
    const want = conv.reviewSkeleton.map(s => s.block), got = u.blocks.map(b => b.block);
    if (JSON.stringify(want) !== JSON.stringify(got)) err(rule('C.LES.01'), L.id, 'review unit blocks must be ' + want.join(', ') + ' (are ' + got.join(', ') + ')');
    conv.reviewSkeleton.forEach(s => { const b = u.blocks.find(x => x.block === s.block); if (b && s.generated && b.content.length) err('C.LES.01', L.id, 'block ' + s.block + ' is generated and must be empty'); });
    ['onpc', 'exam'].forEach(k => { const b = u.blocks.find(x => x.block === k); if (b && !b.content.length) err(k === 'onpc' ? rule('C.ONP.01') : rule('C.EXA.01'), L.id, 'block ' + k + ' is empty'); });
    const exam = u.blocks.find(x => x.block === 'exam');
    if (exam && exam.content.filter(nd => nd.type === 'band').reduce((n, nd) => n + ((ix.band[nd.ref] || { items: [] }).items.length), 0) < 2) err('C.EXA.01', L.id, 'exam needs at least two questions');
    if (exam && exam.content.some(nd => nd.type === 'code' && nd.mode !== 'static')) err('C.EXA.01', L.id, 'exam code must be static (no run button)');
    const practice = u.blocks.find(x => x.block === 'practice');
    const lessonsOfChapter = ix.lessonList.filter(x => x.chapter === L.chapter && !x.review).map(x => x.id);
    if (practice) {
        const items = practice.content.filter(nd => nd.type === 'band').reduce((a, nd) => a.concat((ix.band[nd.ref] || { items: [] }).items), []);
        if (items.length < lessonsOfChapter.length) err('S.CH.12', L.id, 'practice needs at least one item per lesson of the chapter');
    }
}

function checkLessonSkeleton(L, u) {
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
}

function checkLadder(L, u) {
    const chunkLines = Object.values(ix.chunk).filter(c => c.from <= L.n).reduce((a, c) => a.concat(c.match), []);
    const sources = [];
    ix.codeList.filter(c => ix.lessonOfCode[c.id] === L.id).forEach(c => sources.push([c.id, c.source, c.allow]));
    (u.bands || []).forEach(b => b.items.forEach(it => {
        ['solution', 'starter'].forEach(k => { if (typeof it[k] === 'string') sources.push([it.id + '.' + k, it[k]]); });
        if (b.type === 'B.parsons') sources.push([it.id, Data.parsonsSource(it, it.solution)]);
        (it.tests || []).forEach(t => { if (t.variant) sources.push([t.id + '.variant', t.variant]); });
    }));
    sources.forEach(([where, src, allow]) => {
        const tokens = Scan.scan(src, { chunks: chunkLines });
        if ((allow || []).indexOf('S.CH.06') >= 0) { waivers.push(where + ' S.CH.06'); return; }     // explicit waiver (S.ID.04)
        const used = Scan.constructsUsed(tokens, constructs);
        used.forEach((line, cid) => {
            const k = ix.construct[cid];
            if (k.lesson > L.n) err(rule('S.CH.06'), where, 'line ' + line + ': ' + cid + ' is taught in lesson ' + k.lesson + (k.lesson === 99 ? ' (not in 1.0)' : ''));
        });
        conv.forbidden.forEach(f => { if (tokens.some(t => t.kind === 'id' && t.value === f.match.id)) err(rule('C.FRB.01'), where, 'forbidden: ' + f.id); });
    });
}

// ---------- prompts (S.PRM.*) ----------
Object.values(ix.prompt).forEach(p => {
    if (p.id !== 'AI.MASTER' && p.text.split('\n').length > 6) err(rule('S.PRM.01'), p.id, 'more than six lines');
    if (/[*#`]/.test(p.text)) err('S.PRM.01', p.id, 'Markdown in a prompt');
    if (!p.guide || !p.guide.does || !p.guide.give || !p.guide.output) err(rule('S.PRM.02'), p.id, 'needs the three guide answers');
    if (typeof p.waits !== 'boolean') err(rule('S.PRM.03'), p.id, 'waits must be true or false');
});

// ---------- pages and data files (S.DAT.06): the shared files in the page, the chapters through lib/Data.js ----------
['index.html', 'lesson.html'].forEach(pg => {
    const html = fs.readFileSync(path.join(root, pg), 'utf8');
    const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    DATA_FILES.filter(f => f.indexOf('/') < 0).forEach(f => {
        if (srcs.indexOf('data/' + f) < 0) err('S.DAT.06', pg, 'does not load data/' + f);
    });
    if (srcs.indexOf('data/generated/outline.js') < 0) err('S.DAT.06', pg, 'does not load data/generated/outline.js');
    srcs.forEach(s => {
        if (/^data\/C\d{2}-[^/]+\//.test(s) || /^data\/generated\/C/.test(s)) err('S.DAT.06', pg, 'loads a chapter file itself (' + s + '); lib/Data.js loads them');
        if (!/^https?:/.test(s) && !fs.existsSync(path.join(root, s))) err('S.DAT.06', pg, 'loads a missing file: ' + s);
    });
});
// every chapter folder is in the registry, holds its register, and only files of lessons its register names
DATA_FILES.filter(f => f.indexOf('/') > 0).forEach(f => {
    const [folder, name] = f.split('/'), ch = ix.chapterList.find(c => c.folder === folder);
    if (!ch) { err('S.DAT.06', f, 'folder is not a chapter in data/registry.js'); return; }
    if (name === 'chapter.js') return;
    const L = ix.lessonList.find(x => x.file === f.replace(/\.js$/, ''));
    if (!L) err('S.DAT.06', f, 'no lesson of chapter ' + ch.id + ' has this file name (L04.js, O01.js, REV.js)');
    else if (!L.unit) err('S.DAT.06', f, 'does not hold the unit of ' + L.id);
});
ix.chapterList.forEach(ch => { if (DATA_FILES.indexOf(ch.folder + '/chapter.js') < 0) err('S.DAT.06', ch.folder, 'chapter folder without chapter.js'); });
Object.keys(N.files).forEach(fid => {
    const f = N.files[fid];
    if (f.kind !== 'lesson') return;
    const L = ix.lesson[fid];
    if (L && f.chapter !== L.chapter) err('S.DAT.06', fid, 'lesson file names chapter ' + f.chapter + ', the register ' + L.chapter);
    (f.code || []).forEach(c => { if (ix.lessonOfCode[c.id] !== fid) err('S.ID.02', c.id, 'code record in the file of ' + fid); });
});

// ---------- icons (S.AST.01) ----------
const iconsFile = fs.readdirSync(path.join(root, 'vendor/lucide')).find(f => /^icons_.*\.js$/.test(f));
const icons = require(path.join(root, 'vendor/lucide', iconsFile)).icons;
const usedIcons = new Set(reg.uiIcons);
[reg.blocks, reg.bandTypes, reg.noteKinds, reg.unitTypes].forEach(gr => Object.values(gr).forEach(x => usedIcons.add(x.icon)));
Object.values(ix.prompt).forEach(p => usedIcons.add(p.icon));
Object.values(ix.lesson).forEach(L => { if (L.unit) L.unit.blocks.forEach(b => { if (b.icon) usedIcons.add(b.icon); }); });
usedIcons.forEach(n => { if (!icons[n]) err(rule('S.AST.01'), n, 'icon not in vendor/lucide — run tools/build-icons.js'); });

// ---------- trace tables (node trace, band B.trace): generated from a real run, blanks inside the table ----------
(function () {
    if (!G) return;
    const Trace = require(path.join(root, 'lib/Trace.js'));
    const want = Data.traces(N);
    want.forEach(t => {
        const code = ix.code[t.ref], key = Trace.key(t.ref, t.vars), e = G.trace && G.trace[key];
        if (!code) { err('S.CH.05', key, 'trace of an unknown code'); return; }
        if (!e) { err('S.CH.05', key, 'no generated trace — run node tools/gen-expect.js'); return; }
        if (e.hash !== hash([code.source, t.vars, code.stdin || '', tag])) { err('S.CH.05', key, 'generated trace is stale — run node tools/gen-expect.js'); return; }
        if (e.error) { err('S.CH.05', key, 'trace: ' + e.error); return; }
        const declared = new Set(); code.source.split('\n').forEach(l => Trace.declsOf(l).forEach(d => declared.add(d.name)));
        t.vars.forEach(v => { if (!declared.has(v)) err('S.CH.05', key, 'traced variable ' + v + ' is not declared in main'); });
        if (!e.rows.length) err('S.CH.05', key, 'trace has no rows');
    });
    Object.keys(ix.band).forEach(id => {
        const b = ix.band[id];
        if (b.type !== 'B.trace') return;
        b.items.forEach(it => {
            const e = G.trace && G.trace[Trace.key(it.code, it.vars)];
            if (!e || !e.rows) return;
            if (!(it.blanks || []).length) err('S.CH.05', it.id, 'B.trace needs blanks');
            (it.blanks || []).forEach(bl => {
                if (!e.rows[bl.step - 1]) err('S.CH.05', it.id, 'blank step ' + bl.step + ' is past the last row (' + e.rows.length + ')');
                else if (it.vars.indexOf(bl.var) < 0) err('S.CH.05', it.id, 'blank names ' + bl.var + ', not a traced variable');
                else if (['—', '?'].indexOf(e.rows[bl.step - 1].values[it.vars.indexOf(bl.var)]) >= 0) err('S.CH.05', it.id, 'blank at step ' + bl.step + ' has no value to find');
            });
        });
    });
})();

// ---------- Persian running text uses the term's form, not its local gloss (S.LNG.02, S.LNG.06) ----------
(function () {
    // [Persian form, term]: each term's `alt.fa` list (S00-schema: alt — other equivalents, forbidden in running text) — Persian forms (often transliterations) that running text must
    // not use, because the term's running form is the English one. The gloss itself is shown once, by the page.
    const bad = [];
    Object.values(ix.term).forEach(t => ((t.alt && t.alt.fa) || []).forEach(w => bad.push([w, t.id])));
    function walk(v, where) {
        if (v == null || typeof v !== 'object') return;
        if (Array.isArray(v)) return v.forEach((x, i) => walk(x, where));
        if (typeof v.fa === 'string' && typeof v.en === 'string') {
            bad.forEach(([w, tid]) => { if (v.fa.indexOf(w) >= 0) err('S.LNG.06', where, 'Persian text uses «' + w + '»; write the running form of ' + tid); });
            return;
        }
        Object.keys(v).forEach(k => { if (k !== 'gloss' && k !== 'alt') walk(v[k], v.id || where); });
    }
    Object.keys(N.files).forEach(fid => walk(N.files[fid], fid));
    walk(N.registry, 'registry');
    walk(ix.catalog, 'registry');
})();

// ---------- retired Ids (S.ID.01): never live again, never referenced ----------
(function () {
    const live = new Set(Object.keys(ix.mistake).concat(Object.keys(ix.code), Object.keys(ix.term), Object.keys(ix.item)));
    const dataText = DATA_FILES
        .map(f => fs.readFileSync(path.join(root, 'data', f), 'utf8').replace(/retired: \[[\s\S]*?\n\s*\],/, '')).join('\n');
    Object.values(ix.retired).forEach(r => {
        if (live.has(r.id)) err('S.ID.01', r.id, 'a retired Id is in use again');
        if (!r.by || !r.why) err('S.ID.01', r.id, 'a retired Id needs its successor (by) and the reason (why)');
        else if (r.by !== '—' && !live.has(r.by)) err('S.ID.01', r.id, 'successor ' + r.by + ' does not exist');
        if (new RegExp("['`(\\[]" + r.id.replace(/\./g, '\\.') + "['`)\\]]").test(dataText)) err('S.ID.01', r.id, 'a retired Id is still referenced');
    });
})();

// ---------- the mark (S.AST.05): one drawing everywhere ----------
(function () {
    const paths = t => [...t.matchAll(/ d=(?:"|')([^"']+)/g)].map(m => m[1]).join('');
    const ref = paths(fs.readFileSync(path.join(root, 'assets/favicon.svg'), 'utf8'));
    const chromeJs = fs.readFileSync(path.join(root, 'site/chrome.js'), 'utf8');
    const part = n => { const m = chromeJs.match(new RegExp(n + " = ((?:'[^']*'(?:\\s*\\+\\s*)?)+)")); return m ? m[1].replace(/'\s*\+\s*'/g, '').replace(/'/g, '') : ''; };
    const inChrome = part('MARK_TILE') + part('MARK_INK') + part('MARK_CURSOR');
    const norm = d => d.replace(/M12 10h3v1h-3zM12 11h3v1h-3z$/, 'M12 10h3v2h-3z');     // the cursor: two rows or one rect
    const want = norm(ref);
    if (!/viewBox="0 0 16 16"/.test(fs.readFileSync(path.join(root, 'assets/favicon.svg'), 'utf8'))) err('S.AST.05', 'assets/favicon.svg', 'the mark is drawn on a 16 × 16 grid');
    if (norm(inChrome) !== want) err('S.AST.05', 'site/chrome.js', 'MARK differs from assets/favicon.svg');
    ['index.html', 'lesson.html'].forEach(pg => {
        const m = fs.readFileSync(path.join(root, pg), 'utf8').match(/<link rel="icon" href="data:image\/svg\+xml,([^"]+)"/);
        if (!m || norm(paths(decodeURIComponent(m[1]))) !== want) err('S.AST.05', pg, 'the inline favicon differs from assets/favicon.svg');
    });
    const og = fs.readFileSync(path.join(root, 'tools/og-image.html'), 'utf8');
    const ogMark = (og.match(/<svg class="mark"[\s\S]*?<\/svg>/) || [''])[0];
    if (norm(paths(ogMark)) !== want) err('S.AST.05', 'tools/og-image.html', 'the mark differs from assets/favicon.svg');
})();

// ---------- report ----------
if (process.argv.includes('--list')) { console.log([...COVERED].sort().join('\n')); process.exit(0); }
const errors = findings.filter(f => f.level === 'error'), warnings = findings.filter(f => f.level === 'warning');
findings.forEach(f => console.log((f.level === 'error' ? 'ERROR' : 'WARN ') + '  ' + f.rule.padEnd(9) + ' ' + f.id + ' — ' + f.msg));
const written = Object.values(ix.lesson).filter(L => L.unit).length;
console.log(errors.length + ' errors, ' + warnings.length + ' warnings · ' + written + ' lesson(s), ' + ix.codeList.length + ' code records, ' +
    ix.itemList.length + ' exercise items · ' + COVERED.size + ' rules checked' + (waivers.length ? ' · ' + waivers.length + ' waiver(s): ' + waivers.join(', ') : ''));
process.exit(errors.length || warnings.length ? 1 : 0);

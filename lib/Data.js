/**
 * Data — collects the data files (window.Nullpunkt.files, S00-schema) into one index that the page, the checker and
 * the tools share. Classic script; in Node, loadNode() requires the files listed in data/registry.js.
 *
 *   const ix = NullpunktData.index(window.Nullpunkt)
 *   ix.lesson['C.L01']  → { id, n, label, orientation, chapter, catalog, unit, file } · ix.lessonList · ix.chapter[id] · ix.chapterList
 *   ix.code[id] · ix.mistake[id] · ix.term[id] · ix.prompt[id] · ix.band[id] · ix.item[id] · ix.bandOfItem[itemId]
 *   ix.generated → data/generated/expect.js (or null)
 */
(function (g) {
    'use strict';

    function index(N) {
        const ix = {
            N: N, registry: N.registry, reg: N.files.S00R, conventions: N.files.C00,
            lesson: {}, lessonList: [], chapter: {}, chapterList: [], code: {}, codeList: [], mistake: {}, retired: {}, term: {}, prompt: {},
            band: {}, item: {}, itemList: [], bandOfItem: {}, lessonOfBand: {}, lessonOfCode: {},
            construct: {}, chunk: {}, ids: {}, generated: N.generated || null, problems: [],
        };
        function claim(id, kind, where) {
            if (ix.ids[id]) ix.problems.push({ rule: 'S.ID.02', id: id, msg: 'Id used twice (' + ix.ids[id] + ', ' + where + ')' });
            else ix.ids[id] = where || kind;
        }

        // numbering: an orientation chapter is chapter 0 and its lessons are 0.1, 0.2 …; they do not move the
        // numbers of the lessons after them (lesson 1 stays lesson 1). n is the lesson's place on the construct
        // ladder (0 for orientation lessons); label is what the pages show.
        let n = 0, cn = 0;
        N.registry.catalog.forEach(series => series.chapters.forEach(ch => {
            const orient = !!ch.orientation;
            ix.chapter[ch.id] = { id: ch.id, n: orient ? 0 : ++cn, catalog: ch, series: series.id, orientation: orient };
            ix.chapterList.push(ix.chapter[ch.id]);
            claim(ch.id, 'chapter', 'registry');
            ch.lessons.forEach((l, li) => {
                if (!orient) n++;
                ix.lesson[l.id] = { id: l.id, n: orient ? 0 : n, label: orient ? '0.' + (li + 1) : String(n), orientation: orient,
                    chapter: ch.id, catalog: l, unit: null, file: l.file || null };
                ix.lessonList.push(ix.lesson[l.id]);
                claim(l.id, 'lesson', 'registry');
            });
        }));

        const files = N.files;
        Object.keys(files).forEach(fid => {
            const f = files[fid];
            (f.terms || []).forEach(t => { claim(t.id, 'term', fid); ix.term[t.id] = t; });
            (f.prompts || []).forEach(p => { claim(p.id, 'prompt', fid); ix.prompt[p.id] = p; });
            (f.mistakes || []).forEach(m => { claim(m.id, 'mistake', fid); ix.mistake[m.id] = m; });
            (f.retired || []).forEach(r => { ix.retired[r.id] = r; });
            (f.constructs || []).forEach(c => { claim(c.id, 'construct', fid); ix.construct[c.id] = c; });
            (f.chunks || []).forEach(c => { claim(c.id, 'chunk', fid); ix.chunk[c.id] = c; });
            (f.code || []).forEach(c => {
                claim(c.id, 'code', fid); ix.code[c.id] = c; ix.codeList.push(c);
                const m = c.id.match(/^(C\.[LO]\d{2}|C\d{2}\.REV)\./);
                if (m) ix.lessonOfCode[c.id] = m[1];
            });
            (f.units || []).forEach(u => {
                if (u.type === 'lesson') {
                    if (!ix.lesson[u.id]) ix.problems.push({ rule: 'S.ID.03', id: u.id, msg: 'lesson not in the catalog' });
                    else { ix.lesson[u.id].unit = u; ix.lesson[u.id].fileId = fid; }
                } else claim(u.id, 'unit', fid);
                (u.bands || []).forEach(b => {
                    claim(b.id, 'band', fid); ix.band[b.id] = b; ix.lessonOfBand[b.id] = u.id;
                    (b.items || []).forEach(it => {
                        claim(it.id, 'item', fid); ix.item[it.id] = it; ix.itemList.push(it); ix.bandOfItem[it.id] = b;
                        (it.tests || []).forEach(t => claim(t.id, 'test', fid));
                    });
                });
            });
        });
        // review units (Cnn.REV, C00-conventions: Review Unit Skeleton): placed in the path right after their chapter's
        // last lesson, so the tree, the pager and search treat them like a lesson. Their catalog entry is made here:
        // the title from the unit type and the chapter, minutes and can-do from the unit itself.
        ix.unit = {};
        Object.keys(files).forEach(fid => (files[fid].units || []).forEach(u => { if (u.type !== 'lesson') ix.unit[u.id] = { unit: u, fileId: fid }; }));
        ix.chapterList.forEach(ch => {
            const rid = ch.catalog.review, found = rid && ix.unit[rid];
            if (!found) return;
            const lessons = ix.lessonList.filter(L => L.chapter === ch.id);
            if (!lessons.length) return;
            const lastL = lessons[lessons.length - 1], u = found.unit, label = N.files.S00R.unitTypes.review.label;
            const title = {};
            Object.keys(label).forEach(l => { title[l] = label[l] + ': ' + ch.catalog.title[l]; });
            const R = { id: rid, n: lastL.n, label: '', review: true, orientation: false, chapter: ch.id,
                catalog: { id: rid, status: 'written', title: title, minutes: u.minutes, prereq: lessons.map(L => L.id), cando: u.cando || [] },
                unit: u, file: found.fileId, fileId: found.fileId };
            ix.lesson[rid] = R;
            ix.lessonList.splice(ix.lessonList.indexOf(lastL) + 1, 0, R);
            (u.bands || []).forEach(b => { ix.lessonOfBand[b.id] = rid; });
        });
        return ix;
    }

    /** Node only: require the registry and every data file it lists, plus data/generated/ unless told not to. */
    function loadNode(root, opts) {
        opts = opts || {};
        const fs = require('fs'), path = require('path');
        delete g.Nullpunkt;
        const dir = path.join(root, 'data');
        const load = f => { const p = path.join(dir, f); delete require.cache[require.resolve(p)]; require(p); };
        load('registry.js');
        const names = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'registry.js');
        g.Nullpunkt.registry.files.forEach(id => {
            const f = names.find(x => x === id + '.js' || x.startsWith(id + '-')
                || (id === 'S00R' && x === 'S00-registry.js') || (id === 'S00G' && x === 'S00-glossary.js')
                || (id === 'S00P' && x === 'S00-prompts.js') || (id === 'C00' && x === 'C00-conventions.js')
                || (id === 'C00M' && x === 'C00-mistakes.js') || (id === 'C00O' && x === 'C00-orientation.js'));
            if (!f) throw new Error('data file for ' + id + ' not found');
            load(f);
        });
        if (opts.withGenerated !== false && fs.existsSync(path.join(dir, 'generated/expect.js'))) load('generated/expect.js');
        const ix = index(g.Nullpunkt);
        return Object.assign(g.Nullpunkt, { index: ix });
    }

    /** The source of a parsons item in the order given (indexes into item.lines). */
    function parsonsSource(item, order) {
        return item.before.concat(order.map(i => item.lines[i]), item.after).join('\n') + '\n';
    }

    /** every trace table the content asks for: nodes `trace` in lessons, and `B.trace` items — [{ ref, vars }] */
    function traces(N) {
        const out = [];
        (function walk(v) {
            if (!v || typeof v !== 'object') return;
            if (Array.isArray(v)) return v.forEach(walk);
            if (v.type === 'trace' && v.ref && v.vars) out.push({ ref: v.ref, vars: v.vars });
            Object.keys(v).forEach(k => walk(v[k]));
        })(Object.keys(N.files).map(k => N.files[k]));
        Object.keys(N.index.band).forEach(id => {
            const b = N.index.band[id];
            if (b.type === 'B.trace') (b.items || []).forEach(it => out.push({ ref: it.code, vars: it.vars }));
        });
        return out;
    }

    const api = { index: index, loadNode: loadNode, parsonsSource: parsonsSource, traces: traces };
    g.NullpunktData = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

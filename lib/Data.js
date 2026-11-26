/**
 * Data — collects the data files (window.Nullpunkt, S00-schema) into one index that the pages, the checker and the
 * tools share, and loads them: in Node every file, in a page only what the page needs. Classic script.
 *
 *   data/registry.js                      languages, the shared files, the series and their chapter folders
 *   data/<Cnn-name>/chapter.js            a chapter's register: titles, lessons in order, minutes, can-do, review
 *   data/<Cnn-name>/<L04|O01|REV>.js      one lesson (or the chapter's review unit): its code records and its unit
 *   data/generated/<Cnn-name>/<…>.js      ⚙ the real compiler results of that lesson (tools/gen-expect.js)
 *   data/generated/outline.js             ⚙ the exercise items of every lesson (progress without loading lessons)
 *
 * The registers are merged in memory into one catalog (ix.catalog), the same shape for every page and tool.
 *
 *   const ix = NullpunktData.index(window.Nullpunkt)
 *   ix.lesson['C.L01']  → { id, n, label, orientation, review, chapter, catalog, written, unit, folder, file }
 *   ix.lessonList · ix.chapter[id] · ix.chapterList · ix.catalog · ix.outline[lessonId] → [item ids]
 *   ix.code[id] · ix.mistake[id] · ix.term[id] · ix.prompt[id] · ix.band[id] · ix.item[id] · ix.bandOfItem[itemId]
 *   ix.generated → the merged results of the loaded lessons (or null)
 *
 *   NullpunktData.load({ lessons: ['C.L04'] })  → Promise: registers, then those lessons and what they refer to
 *   NullpunktData.loadAll()                     → Promise: every written lesson (search)
 */
(function (g) {
    'use strict';

    // ---------- helpers for the lesson files (authoring shorthand; the data stays plain objects) ----------
    function T(fa, de, en) { return { fa: fa, de: de, en: en }; }
    const T3 = a => T(a[0], a[1], a[2]);
    const helpers = {
        T: T,
        P: (fa, de, en) => ({ type: 'p', text: T(fa, de, en) }),
        LI: function () { return { type: 'list', items: Array.prototype.map.call(arguments, T3) }; },
        OL: function () { const l = helpers.LI.apply(null, arguments); l.ordered = true; return l; },
        MYTH: (claim, fact) => ({ type: 'myth', claim: T3(claim), fact: T3(fact) }),
        OPT: (ok, text, fb) => ({ correct: ok, text: T3(text), feedback: T3(fb) }),
        SEC: (id, icon, title, short, content) => ({ block: 'section', id: id, icon: icon, title: T3(title), short: T3(short), content: content }),
        NOTE: (kind, fa, de, en) => ({ type: 'note', kind: kind, text: T(fa, de, en) }),
        CODE: (ref, mode) => ({ type: 'code', ref: ref, mode: mode }),
        BAND: ref => ({ type: 'band', ref: ref }),
    };

    // ---------- where things live ----------
    const LESSON_OF = /^(C\.[LO]\d{2}|C\d{2}\.REV)(?=\.|\||$)/;
    /** the lesson (or review unit) an Id belongs to: C.L04.K01 → C.L04, C02.REV.X01.01 → C02.REV */
    function lessonOf(id) { const m = String(id).match(LESSON_OF); return m ? m[1] : null; }
    /** the file name of a lesson in its folder: C.L04 → L04, C.O01 → O01, C02.REV → REV */
    function fileName(lessonId) { return lessonId.replace(/^C\.([LO]\d{2})$/, '$1').replace(/^C\d{2}\.REV$/, 'REV'); }
    function chapterIdOf(folder) { return folder.split('-')[0]; }

    function index(N) {
        const ix = {
            N: N, registry: N.registry, reg: N.files.S00R, conventions: N.files.C00, catalog: [],
            lesson: {}, lessonList: [], chapter: {}, chapterList: [], code: {}, codeList: [], mistake: {}, retired: {}, term: {}, prompt: {},
            band: {}, item: {}, itemList: [], bandOfItem: {}, lessonOfBand: {}, lessonOfCode: {}, unit: {},
            construct: {}, chunk: {}, ids: {}, generated: N.generated || null, outline: N.outline || {}, problems: [],
        };
        function claim(id, kind, where) {
            if (ix.ids[id]) ix.problems.push({ rule: 'S.ID.02', id: id, msg: 'Id used twice (' + ix.ids[id] + ', ' + where + ')' });
            else ix.ids[id] = where || kind;
        }
        const chapters = N.chapters || {};

        // the merged register: every series with its chapters in the order of data/registry.js
        N.registry.series.forEach(s => {
            const out = Object.assign({}, s, { chapters: [] });
            s.chapters.forEach(folder => {
                const ch = chapters[chapterIdOf(folder)];
                if (!ch) { ix.problems.push({ rule: 'S.ID.03', id: folder, msg: 'chapter register not loaded (' + folder + '/chapter.js)' }); return; }
                ch.folder = folder;
                out.chapters.push(ch);
            });
            ix.catalog.push(out);
        });

        // numbering: an orientation chapter is chapter 0 and its lessons are 0.1, 0.2 …; they do not move the
        // numbers of the lessons after them (lesson 1 stays lesson 1). n is the lesson's place on the construct
        // ladder (0 for orientation lessons); label is what the pages show. A chapter's review unit (Cnn.REV,
        // C00-conventions: Review Unit Skeleton) follows its last lesson, so the tree, the pager and search treat
        // it like a lesson; its title is made from the unit type and the chapter.
        let n = 0, cn = 0;
        ix.catalog.forEach(series => series.chapters.forEach(ch => {
            const orient = !!ch.orientation;
            ix.chapter[ch.id] = { id: ch.id, n: orient ? 0 : ++cn, catalog: ch, series: series.id, orientation: orient, folder: ch.folder };
            ix.chapterList.push(ix.chapter[ch.id]);
            claim(ch.id, 'chapter', 'registry');
            let last = null;
            ch.lessons.forEach((l, li) => {
                if (!orient) n++;
                last = ix.lesson[l.id] = { id: l.id, n: orient ? 0 : n, label: orient ? '0.' + (li + 1) : String(n), orientation: orient, review: false,
                    chapter: ch.id, catalog: l, written: l.status === 'written', unit: null, folder: ch.folder, file: ch.folder + '/' + fileName(l.id) };
                ix.lessonList.push(last);
                claim(l.id, 'lesson', 'registry');
            });
            const r = ch.review;
            if (r && last) {
                const label = N.files.S00R.unitTypes.review.label, title = {};
                Object.keys(label).forEach(l => { title[l] = label[l] + ': ' + ch.title[l]; });
                ix.lesson[r.id] = { id: r.id, n: last.n, label: '', review: true, orientation: false, chapter: ch.id,
                    catalog: { id: r.id, status: r.status, title: title, minutes: r.minutes, prereq: ch.lessons.map(l => l.id), cando: r.cando || [] },
                    written: r.status === 'written', unit: null, folder: ch.folder, file: ch.folder + '/' + fileName(r.id) };
                ix.lessonList.push(ix.lesson[r.id]);
                claim(r.id, 'lesson', 'registry');
            }
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
                const L = lessonOf(c.id);
                if (L) ix.lessonOfCode[c.id] = L;
            });
            const u = f.unit;
            if (!u) return;
            const L = ix.lesson[u.id];
            if (!L) ix.problems.push({ rule: 'S.ID.03', id: u.id, msg: 'lesson file ' + fid + ' is not in a chapter register' });
            else if (fid !== u.id) ix.problems.push({ rule: 'S.ID.03', id: u.id, msg: 'the file of ' + u.id + ' holds the Id ' + fid });
            else { L.unit = u; L.fileId = fid; }
            if (u.type !== 'lesson') ix.unit[u.id] = { unit: u, fileId: fid };
            (u.bands || []).forEach(b => {
                claim(b.id, 'band', fid); ix.band[b.id] = b; ix.lessonOfBand[b.id] = u.id;
                (b.items || []).forEach(it => {
                    claim(it.id, 'item', fid); ix.item[it.id] = it; ix.itemList.push(it); ix.bandOfItem[it.id] = b;
                    (it.tests || []).forEach(t => claim(t.id, 'test', fid));
                });
            });
        });
        return ix;
    }

    // ---------- what a lesson needs besides itself ----------
    /** lessons whose files a loaded lesson refers to: code shown in its mistakes, and any Id of another lesson */
    function needs(N, lessonId) {
        const f = N.files[lessonId], out = new Set();
        if (!f) return [];
        const mistakes = {};
        Object.keys(N.files).forEach(k => (N.files[k].mistakes || []).forEach(m => { mistakes[m.id] = m; }));
        (function walk(v) {
            if (typeof v === 'string') {
                const L = lessonOf(v); if (L && L !== lessonId) out.add(L);
                const m = mistakes[v]; if (m) [m.wrong, m.right].forEach(c => { const L2 = c && lessonOf(c); if (L2 && L2 !== lessonId) out.add(L2); });
                return;
            }
            if (!v || typeof v !== 'object') return;
            if (Array.isArray(v)) return v.forEach(walk);
            Object.keys(v).forEach(k => { if (k !== 'source' && k !== 'solution' && k !== 'starter') walk(v[k]); });
        })(f);
        return Array.from(out);
    }

    // ---------- loading in a page ----------
    const loaded = {};
    function script(src) {
        if (loaded[src]) return loaded[src];
        return (loaded[src] = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src; s.async = false;
            s.onload = resolve;
            s.onerror = () => reject(new Error('cannot load ' + src));
            document.head.appendChild(s);
        }));
    }
    function registers(N) {
        const list = [];
        N.registry.series.forEach(s => s.chapters.forEach(f => list.push(script('data/' + f + '/chapter.js'))));
        return Promise.all(list);
    }
    /** the folder of a lesson, from the registers (before an index exists) */
    function folderOf(N, lessonId) {
        let folder = null;
        N.registry.series.forEach(s => s.chapters.forEach(f => {
            const ch = N.chapters && N.chapters[chapterIdOf(f)];
            if (ch && (ch.lessons.some(l => l.id === lessonId) || (ch.review && ch.review.id === lessonId))) folder = f;
        }));
        return folder;
    }
    function lessonFiles(N, ids) {
        const want = [];
        ids.forEach(id => {
            if (!id || N.files[id]) return;
            const folder = folderOf(N, id);
            if (!folder) return;
            want.push(script('data/' + folder + '/' + fileName(id) + '.js').catch(() => null));
            want.push(script('data/generated/' + folder + '/' + fileName(id) + '.js').catch(() => null));
        });
        return Promise.all(want);
    }
    /** registers, then the lessons asked for, then the lessons they refer to (two rounds cover mistakes' code) */
    function load(opts) {
        const N = g.Nullpunkt, ids = ((opts && opts.lessons) || []).filter(Boolean);
        return registers(N)
            .then(() => lessonFiles(N, ids))
            .then(() => lessonFiles(N, [].concat.apply([], ids.map(id => needs(N, id)))))
            .then(() => N);
    }
    function loadAll() {
        const N = g.Nullpunkt;
        return registers(N).then(() => {
            const ids = [];
            Object.keys(N.chapters).forEach(k => {
                const ch = N.chapters[k];
                ch.lessons.forEach(l => { if (l.status === 'written') ids.push(l.id); });
                if (ch.review && ch.review.status === 'written') ids.push(ch.review.id);
            });
            return lessonFiles(N, ids);
        }).then(() => N);
    }

    // ---------- loading in Node: every file ----------
    /** Node only: require the registry, the shared files, every chapter register and lesson, and data/generated/. */
    function loadNode(root, opts) {
        opts = opts || {};
        const fs = require('fs'), path = require('path');
        delete g.Nullpunkt;
        const dir = path.join(root, 'data');
        const load = p => { delete require.cache[require.resolve(p)]; require(p); };
        load(path.join(dir, 'registry.js'));
        const N = g.Nullpunkt, shared = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'registry.js');
        const SHARED = { S00R: 'S00-registry.js', S00G: 'S00-glossary.js', S00P: 'S00-prompts.js', C00: 'C00-conventions.js', C00M: 'C00-mistakes.js' };
        N.registry.files.forEach(id => {
            const f = shared.find(x => x === SHARED[id] || x === id + '.js');
            if (!f) throw new Error('data file for ' + id + ' not found');
            load(path.join(dir, f));
        });
        N.registry.series.forEach(s => s.chapters.forEach(folder => {
            const d = path.join(dir, folder);
            if (!fs.existsSync(path.join(d, 'chapter.js'))) throw new Error(folder + '/chapter.js not found');
            load(path.join(d, 'chapter.js'));
            fs.readdirSync(d).filter(f => f.endsWith('.js') && f !== 'chapter.js').sort().forEach(f => load(path.join(d, f)));
            const gd = path.join(dir, 'generated', folder);
            if (opts.withGenerated !== false && fs.existsSync(gd)) fs.readdirSync(gd).filter(f => f.endsWith('.js')).sort().forEach(f => load(path.join(gd, f)));
        }));
        if (opts.withGenerated !== false && fs.existsSync(path.join(dir, 'generated/outline.js'))) load(path.join(dir, 'generated/outline.js'));
        const ix = index(N);
        return Object.assign(N, { index: ix });
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

    const api = { index: index, load: load, loadAll: loadAll, loadNode: loadNode, needs: needs, helpers: helpers,
        lessonOf: lessonOf, fileName: fileName, parsonsSource: parsonsSource, traces: traces };
    g.NullpunktData = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

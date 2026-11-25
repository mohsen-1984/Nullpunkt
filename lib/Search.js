/**
 * Search — full-text search over the course in one language: every block of every written lesson (text, code,
 * mistakes, exercises, prompts), the glossary and the titles of the lessons still to come. Runs in the page and in
 * Node (tests/search.test.js); no index is shipped — it is built from the loaded data in a few milliseconds.
 *
 *   const s = NullpunktSearch.build(ix, 'fa', { lessonTitle, blockTitle })
 *   s.query('printf \\n', { max: 40, snippet: 70 })
 *     → [{ doc: { kind, lesson, block, title, section, text }, score, snippet: [{ text, hit }] }]
 *
 * Matching folds what a reader may type differently: case, German umlauts and ß (ä → a, ß → ss), Arabic and
 * Persian letter forms (ي → ی, ك → ک, ة → ه), diacritics, the zero-width non-joiner of Persian (می‌خواند =
 * میخواند) and Persian or Arabic digits. Every word of the query must occur; a word that starts a word in the
 * text, a hit in a title and the whole query as a phrase score higher.
 */
(function (g) {
    'use strict';

    const MAP = { 'ي': 'ی', 'ى': 'ی', 'ك': 'ک', 'ة': 'ه', 'ۀ': 'ه', 'ـ': '', '‌': '', '‍': '', '‎': '', '‏': '', 'ß': 'ss' };
    '۰۱۲۳۴۵۶۷۸۹'.split('').forEach((d, i) => { MAP[d] = String(i); });
    '٠١٢٣٤٥٦٧٨٩'.split('').forEach((d, i) => { MAP[d] = String(i); });

    function foldChar(ch) {
        if (MAP[ch] != null) return MAP[ch];
        const d = ch.normalize('NFKD').replace(/[̀-ًͯ-ٰٟٓ-ٕ]/g, '');
        const m = d.toLowerCase();
        return MAP[m] != null ? MAP[m] : m;
    }
    /** fold a text and keep, for every folded character, the index of the character it came from */
    function fold(text) {
        let out = '';
        const at = [];
        for (let i = 0; i < text.length; i++) {
            let ch = text[i];
            if (/[\ud800-\udbff]/.test(ch) && i + 1 < text.length) { ch += text[i + 1]; }
            const f = foldChar(ch);
            for (let k = 0; k < f.length; k++) at.push(i);
            out += f;
            if (ch.length === 2) i++;
        }
        at.push(text.length);
        return { text: out, at };
    }
    const isWord = c => !!c && /[\p{L}\p{N}_]/u.test(c);

    /** plain text of the inline markup (S00-schema: inline): **b**, *i*, `code`, [[term:…]], [[lesson:…]] */
    function plain(s, ix, lang, lessonTitle) {
        if (s == null) return '';
        return String(s)
            .replace(/\[\[term:([^\]]+)\]\]/g, (m, id) => { const t = ix.term[id]; return t ? (lang === 'en' ? t.en : t.use[lang]) : id; })
            .replace(/\[\[lesson:([^\]]+)\]\]/g, (m, id) => lessonTitle(id))
            .replace(/\[\[[a-z]+:([^\]]+)\]\]/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
            .replace(/`([^`]*)`/g, '$1');
    }

    function build(ix, lang, opts) {
        opts = opts || {};
        const reg = ix.reg;
        const lessonTitle = opts.lessonTitle || (id => { const L = ix.lesson[id]; return L ? L.catalog.title[lang] : id; });
        const blockTitle = opts.blockTitle || (b => reg.blocks[b].title[lang]);
        const tx = o => (o && typeof o === 'object' && !Array.isArray(o) ? o[lang] : o);
        const P = s => plain(s, ix, lang, lessonTitle);
        const docs = [];
        const firstUse = {};

        function nodeText(nd, out, blockId) {
            if (!nd) return;
            if (nd.type === 'p') out.push(P(tx(nd.text)));
            else if (nd.type === 'list') nd.items.forEach(it => out.push(P(tx(it))));
            else if (nd.type === 'note') out.push(reg.noteKinds[nd.kind].title[lang], P(tx(nd.text)));
            else if (nd.type === 'table') {
                out.push(nd.head.map(c => P(tx(c))).join(' · '));
                nd.rows.forEach(r => out.push(r.map(c => (c.code != null ? c.code : P(tx(c)))).join(' · ')));
            } else if (nd.type === 'code' && ix.code[nd.ref]) out.push(ix.code[nd.ref].source);
            else if (nd.type === 'diagnostic') {
                if (ix.code[nd.ref]) out.push(ix.code[nd.ref].source);
                ['where', 'what', 'why', 'fix'].forEach(k => out.push(P(tx(nd.explain[k]))));
                const e = ix.generated && ix.generated.code[nd.ref];
                if (e) out.push(e.gcc.log || '', e.xcc.log || '');
            } else if (nd.type === 'mistakes') nd.refs.forEach(id => {
                const m = ix.mistake[id]; if (!m) return;
                out.push(m.id + ' ' + P(tx(m.title)), P(tx(m.why)));
            }) ;
            else if (nd.type === 'band') {
                const b = ix.band[nd.ref]; if (!b) return;
                out.push(P(tx(b.title)));
                b.items.forEach(it => {
                    out.push(P(tx(it.prompt)), P(tx(it.why)));
                    if (it.model) out.push(P(tx(it.model)));
                    (it.options || []).forEach(o => out.push(P(tx(o.text))));
                });
            } else if (nd.type === 'myth') out.push(P(tx(nd.claim)), P(tx(nd.fact)));
            else if (nd.type === 'terminal') nd.lines.forEach(l => out.push(l.cmd != null ? l.cmd : l.out));
            else if (nd.type === 'tabs') nd.tabs.forEach(t => { out.push(typeof t.label === 'string' ? t.label : tx(t.label)); t.content.forEach(c => nodeText(c, out, blockId)); });
            else if (nd.type === 'asm' && ix.code[nd.ref]) {
                out.push(ix.code[nd.ref].source);
                const e = ix.generated && ix.generated.code[nd.ref];
                if (e && e.gcc.asm) out.push(e.gcc.asm);
            } else if (nd.type === 'prompt') {
                const pr = ix.prompt[nd.ref]; if (!pr) return;
                out.push(tx(pr.name), P(tx(pr.guide.does)));
            }
        }
        function noteTerms(s, lessonId) {
            String(s || '').replace(/\[\[term:([^\]]+)\]\]/g, (m, id) => { if (!firstUse[id]) firstUse[id] = lessonId; return m; });
        }

        ix.lessonList.forEach(L => {
            const cat = L.catalog;
            if (!L.unit) {
                docs.push({ kind: 'planned', lesson: L.id, block: null, title: cat.title[lang], section: '', text: cat.title[lang] + (lang !== 'en' ? ' · ' + cat.title.en : '') });
                return;
            }
            docs.push({ kind: 'lesson', lesson: L.id, block: null, title: cat.title[lang], section: '',
                text: [cat.title[lang]].concat(lang !== 'en' ? [cat.title.en] : []).concat((cat.cando || []).map(c => P(c[lang]))).join('\n') });
            L.unit.blocks.forEach(b => {
                const out = [];
                if (b.block === 'cando' || b.block === 'selfcheck') (cat.cando || []).forEach(c => out.push(P(c[lang])));
                (b.content || []).forEach(nd => { nodeText(nd, out, b.block); noteTerms(JSON.stringify(nd), L.id); });
                if (!out.join('').trim()) return;
                docs.push({ kind: 'block', lesson: L.id, block: b.id || b.block, title: cat.title[lang], section: b.title ? P(tx(b.title)) : blockTitle(b.block), text: out.filter(Boolean).join('\n') });
            });
            (L.unit.bands || []).forEach(b => noteTerms(JSON.stringify(b), L.id));
        });
        Object.keys(ix.term).forEach(id => {
            const t = ix.term[id], word = lang === 'en' ? t.en : t.use[lang];
            const where = firstUse[id] || null;
            docs.push({ kind: 'term', lesson: where, block: where ? 'terms' : null, title: word, section: '',
                text: [word, t.en, t.gloss && t.gloss[lang], tx(t.def)].filter(Boolean).join('\n') });
        });

        docs.forEach(d => { d.f = fold(d.text); d.ft = fold(d.title + ' ' + d.section).text; });

        function query(q, o) {
            o = o || {};
            const max = o.max || 40, ctx = o.snippet || 70;
            const fq = fold(String(q).trim()).text.replace(/\s+/g, ' ');
            const words = fq.split(' ').filter(Boolean);
            if (!words.length) return [];
            const res = [];
            docs.forEach(d => {
                let score = 0;
                for (const w of words) {
                    const inTitle = d.ft.indexOf(w) >= 0;
                    let pos = d.f.text.indexOf(w), n = 0, starts = 0;
                    while (pos >= 0 && n < 6) { n++; if (!isWord(d.f.text[pos - 1])) starts++; pos = d.f.text.indexOf(w, pos + w.length); }
                    if (!n && !inTitle) return;
                    score += n + starts * 2 + (inTitle ? (d.kind === 'lesson' || d.kind === 'term' ? 18 : 8) : 0);
                }
                if (words.length > 1 && d.f.text.indexOf(fq) >= 0) score += 6;
                if (d.kind === 'lesson') score += 3;
                if (d.kind === 'planned') score -= 4;
                res.push({ doc: d, score: score });
            });
            res.sort((a, b) => b.score - a.score || (a.doc.lesson || '').localeCompare(b.doc.lesson || ''));
            return res.slice(0, max).map(r => Object.assign(r, { snippet: snippet(r.doc, words, ctx) }));
        }

        /** the text around the first hit, cut at word bounds, as pieces marked hit or not */
        function snippet(d, words, ctx) {
            const ft = d.f.text, at = d.f.at, text = d.text.replace(/\n/g, ' ');
            let first = -1;
            words.forEach(w => { const p = ft.indexOf(w); if (p >= 0 && (first < 0 || p < first)) first = p; });
            if (first < 0) return [{ text: text.slice(0, ctx * 2), hit: false }];
            const o0 = at[first];
            let a = Math.max(0, o0 - ctx), b = Math.min(d.text.length, o0 + ctx);
            while (a > 0 && isWord(d.text[a - 1])) a--;
            while (b < d.text.length && isWord(d.text[b])) b++;
            const ranges = [];
            words.forEach(w => {
                let p = ft.indexOf(w);
                while (p >= 0) {
                    const s = at[p], e = at[p + w.length];
                    if (e > a && s < b) ranges.push([Math.max(s, a), Math.min(e, b)]);
                    p = ft.indexOf(w, p + w.length);
                }
            });
            ranges.sort((x, y) => x[0] - y[0]);
            const out = [];
            let i = a;
            ranges.forEach(([s, e]) => {
                if (s < i) s = i;
                if (e <= s) return;
                if (s > i) out.push({ text: text.slice(i, s), hit: false });
                out.push({ text: text.slice(s, e), hit: true });
                i = e;
            });
            if (i < b) out.push({ text: text.slice(i, b), hit: false });
            if (a > 0) out.unshift({ text: '… ', hit: false });
            if (b < d.text.length) out.push({ text: ' …', hit: false });
            return out;
        }

        return { docs: docs, query: query };
    }

    g.NullpunktSearchEngine = { build: build, fold: fold, plain: plain };
    if (typeof module !== 'undefined') module.exports = g.NullpunktSearchEngine;
})(typeof window !== 'undefined' ? window : globalThis);

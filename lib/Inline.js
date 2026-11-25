/**
 * Inline — renders the closed inline markup of the data (S.MRK.01) to HTML: **bold**, *italic*, `code`, newlines,
 * and references [[kind:id]] (S00-core: Inline Markup & References). Everything else is escaped.
 *
 *   const r = NullpunktInline.renderer(index, lang, { lessonHref, termSeen })
 *   r.html(text) → HTML string
 * termSeen is a Set shared by one page, so each term is introduced (bold, with its gloss) only once (S.VOI.03).
 */
(function (g) {
    'use strict';
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const LABEL = {
        lesson: { fa: 'درس', de: 'Lektion', en: 'Lesson' },
        band: { fa: 'تمرین', de: 'Übung', en: 'Exercise' },
    };

    function renderer(ix, lang, opts) {
        opts = opts || {};
        const seen = opts.termSeen || new Set();
        const used = opts.termsUsed || new Set();

        function term(id) {
            const t = ix.term[id];
            if (!t) return esc(id);
            used.add(id);
            const word = lang === 'en' ? t.en : t.use[lang];
            const title = esc(t.def[lang]);
            if (seen.has(id)) return '<span class="np-term" title="' + title + '">' + esc(word) + '</span>';
            seen.add(id);
            const gloss = lang === 'en' ? '' : t.gloss[lang];
            let html = '<strong class="np-term np-term-new" title="' + title + '">' + esc(word) + '</strong>';
            if (gloss && gloss !== word) {
                html += lang === 'fa' ? ' — <span class="np-gloss" dir="auto">' + esc(gloss) + '</span>'
                    : ' (<span class="np-gloss">' + esc(gloss) + '</span>)';
            }
            return html;
        }

        function ref(kind, id) {
            if (kind === 'term') return term(id);
            if (kind === 'lesson') {
                const L = ix.lesson[id];
                if (!L) return esc(id);
                const label = LABEL.lesson[lang] + ' ' + L.n;
                const title = esc(L.catalog.title[lang]);
                if (L.unit && opts.lessonHref) return '<a href="' + esc(opts.lessonHref(id)) + '" title="' + title + '">' + esc(label) + '</a>';
                return '<span class="np-ref" title="' + title + '">' + esc(label) + '</span>';
            }
            if (kind === 'pit') {
                const m = ix.mistake[id];
                return '<code class="np-pit" title="' + (m ? esc(stripMarks(m.title[lang])) : '') + '">' + esc(id) + '</code>';
            }
            if (kind === 'k') {
                const k = ix.construct[id];
                const v = k ? (k.match.id || k.match.kw || k.match.op || k.match.header || id) : id;
                return '<code title="' + esc(id) + '">' + esc(v) + '</code>';
            }
            if (kind === 'band') {
                const letter = opts.bandLetter ? opts.bandLetter(id) : id;
                return esc(LABEL.band[lang]) + ' ' + (lang === 'fa' ? '«' + esc(letter) + '»' : esc(letter));
            }
            if (kind === 'std') { const p = id.split(':'); return esc('ISO ' + p[0] + ' §' + p[1]); }
            if (kind === 'block') { const b = ix.reg.blocks[id]; return b ? esc(b.title[lang]) : esc(id); }
            return esc(kind + ':' + id);
        }

        function html(text) {
            let out = '', i = 0;
            const s = String(text);
            while (i < s.length) {
                if (s[i] === '`') {
                    const j = s.indexOf('`', i + 1);
                    if (j > i) { out += '<code dir="ltr">' + esc(s.slice(i + 1, j)) + '</code>'; i = j + 1; continue; }
                }
                if (s.startsWith('[[', i)) {
                    const j = s.indexOf(']]', i);
                    const m = j > 0 && s.slice(i + 2, j).match(/^(\w+):(.+)$/);
                    if (m) { out += ref(m[1], m[2]); i = j + 2; continue; }
                }
                if (s.startsWith('**', i)) {
                    const j = s.indexOf('**', i + 2);
                    if (j > i) { out += '<strong>' + html(s.slice(i + 2, j)) + '</strong>'; i = j + 2; continue; }
                }
                if (s[i] === '*') {
                    const j = s.indexOf('*', i + 1);
                    if (j > i) { out += '<em dir="ltr">' + html(s.slice(i + 1, j)) + '</em>'; i = j + 1; continue; }
                }
                if (s[i] === '\n') { out += '<br>'; i++; continue; }
                out += esc(s[i]);
                i++;
            }
            return out;
        }

        return { html: html, termsUsed: used };
    }

    /** Plain text of marked-up text (for title attributes). */
    function stripMarks(s) {
        return String(s).replace(/\[\[\w+:([^\]]+)\]\]/g, '$1').replace(/\*\*|\*|`/g, '');
    }

    const api = { renderer: renderer, stripMarks: stripMarks, esc: esc };
    g.NullpunktInline = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

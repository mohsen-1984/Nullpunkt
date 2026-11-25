/**
 * CodeScan — finds which constructs of the ladder (C00: constructs) a piece of C code uses, after removing the
 * allowed chunks (C.CHK.01). Used by the checker for the structure-leak rule (S.CH.06) and the forbidden list (C.FRB.01).
 *
 *   NullpunktCodeScan.scan(source, { chunks: [...lines to remove] })
 *     → [{ kind: 'kw'|'id'|'op'|'esc'|'fmt'|'comment'|'header'|'pp', value, line }]
 */
(function (g) {
    'use strict';
    const KEYWORDS = new Set(('auto break case char const continue default do double else enum extern float for goto if inline int ' +
        'long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while ' +
        '_Bool _Generic _Static_assert _Alignas _Alignof _Atomic _Noreturn _Thread_local').split(' '));
    const OPS = ['->', '++', '--', '<<=', '>>=', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '+=', '-=', '*=', '/=', '%=',
        '&=', '|=', '^=', '&', '|', '^', '~', '!', '?', '+', '-', '*', '/', '%', '<', '>', '=', '['];

    /** printf/scanf conversions in one string literal's text (without quotes). */
    function formats(text, line, out) {
        const re = /%([-+ #0]*)(\d+|\*)?(\.(\d+|\*))?(hh|h|ll|l|z|j|t|L)?([diouxXeEfFgGaAcspn%])/g;
        let m;
        while ((m = re.exec(text))) {
            const conv = m[6] === '%' ? '%' : (m[5] || '') + m[6];
            out.push({ kind: 'fmt', value: conv, line: line });
            if (m[2] || m[3]) out.push({ kind: 'fmt', value: 'width', line: line });
        }
    }

    function scan(source, opts) {
        opts = opts || {};
        const remove = (opts.chunks || []).map(s => s.trim());
        const lines = source.split('\n').map(l => (remove.indexOf(l.trim()) >= 0 ? '' : l));
        const src = lines.join('\n');
        const out = [];
        let i = 0, line = 1;
        const at = k => src[i + k] || '';
        while (i < src.length) {
            const c = src[i];
            if (c === '\n') { line++; i++; continue; }
            if (/\s/.test(c)) { i++; continue; }
            if (c === '/' && at(1) === '/') {
                out.push({ kind: 'comment', value: '//', line: line });
                while (i < src.length && src[i] !== '\n') i++;
                continue;
            }
            if (c === '/' && at(1) === '*') {
                out.push({ kind: 'comment', value: '/*', line: line });
                i += 2;
                while (i < src.length && !(src[i] === '*' && at(1) === '/')) { if (src[i] === '\n') line++; i++; }
                i += 2;
                continue;
            }
            if (c === '#') {
                const end = src.indexOf('\n', i);
                const text = src.slice(i, end < 0 ? src.length : end);
                const m = text.match(/^#\s*(\w+)\s*(.*)$/);
                if (m) {
                    if (m[1] === 'include') {
                        const h = m[2].match(/^<([^>]+)>/), q = m[2].match(/^"([^"]+)"/);
                        if (h) out.push({ kind: 'header', value: h[1], line: line });
                        if (q) out.push({ kind: 'pp', value: 'include-local', line: line });
                    } else out.push({ kind: 'pp', value: m[1], line: line });
                }
                i += text.length;
                continue;
            }
            if (c === '"' || c === '\'') {
                const q = c;
                let j = i + 1, text = '';
                while (j < src.length && src[j] !== q && src[j] !== '\n') {
                    if (src[j] === '\\') { out.push({ kind: 'esc', value: src[j + 1], line: line }); text += src[j] + src[j + 1]; j += 2; continue; }
                    text += src[j]; j++;
                }
                if (q === '"') formats(text, line, out);
                i = j + 1;
                continue;
            }
            if (/[A-Za-z_]/.test(c)) {
                let j = i;
                while (j < src.length && /\w/.test(src[j])) j++;
                const w = src.slice(i, j);
                out.push({ kind: KEYWORDS.has(w) ? 'kw' : 'id', value: w, line: line });
                i = j;
                continue;
            }
            if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(at(1)))) {
                let j = i + 1;
                while (j < src.length && /[\w.]/.test(src[j])) j++;
                i = j;
                continue;
            }
            const op = OPS.find(o => src.startsWith(o, i));
            if (op) { out.push({ kind: 'op', value: op, line: line }); i += op.length; continue; }
            i++;
        }
        return out;
    }

    /** The constructs a scan result uses: Map(constructId → first line). */
    function constructsUsed(tokens, constructs) {
        const used = new Map();
        tokens.forEach(t => {
            constructs.forEach(c => {
                const m = c.match;
                const hit = (m.kw && t.kind === 'kw' && t.value === m.kw) || (m.id && t.kind === 'id' && t.value === m.id) ||
                    (m.op && t.kind === 'op' && t.value === m.op) || (m.esc && t.kind === 'esc' && t.value === m.esc) ||
                    (m.fmt && t.kind === 'fmt' && t.value === m.fmt) || (m.comment && t.kind === 'comment' && t.value === m.comment) ||
                    (m.header && t.kind === 'header' && t.value === m.header) || (m.pp && t.kind === 'pp' && t.value === m.pp);
                if (hit && !used.has(c.id)) used.set(c.id, t.line);
            });
        });
        return used;
    }

    const api = { scan: scan, constructsUsed: constructsUsed };
    g.NullpunktCodeScan = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

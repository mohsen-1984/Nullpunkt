/**
 * Trace tables (S00-schema: node `trace`, band `B.trace`): the rows are made by running the code itself, never written
 * by hand (S.CH.05). `instrument` adds a snapshot after every statement line of `main`; gcc runs the result; `parse`
 * turns the output into rows: the line just executed, the value of each traced variable, and what the line printed.
 *
 * Scope (0.2): `main` only, one statement per line, variables of the basic types declared in `main`; loops and `if`
 * work as long as each statement keeps to its own line (a snapshot is taken each time a line runs). A variable not
 * yet declared shows `—`, one declared but not yet given a value shows `?` (reading it would be undefined behavior).
 */
(function (g) {
    'use strict';
    const MARK = '\u001eNPT';
    const TYPES = /^(?:const\s+)?(unsigned\s+long\s+long|unsigned\s+long|unsigned\s+int|unsigned\s+short|unsigned\s+char|unsigned|long\s+long|long\s+double|long|short|int|char|float|double|bool|_Bool)\b/;

    function kindOf(type) {
        if (/double|float/.test(type)) return 'f';
        if (/^char$/.test(type)) return 'c';
        if (/bool/i.test(type)) return 'b';
        if (/unsigned/.test(type)) return 'u';
        return 'i';
    }

    /** the declarations on one line: [{ name, type, init }] */
    function declsOf(line) {
        const t = line.trim(), m = t.match(TYPES);
        if (!m || !/;\s*(\/\/.*)?$/.test(t)) return [];
        const rest = t.slice(m[0].length).replace(/;\s*(\/\/.*)?$/, '');
        // split on top-level commas
        const parts = []; let depth = 0, cur = '', q = null;
        for (const ch of rest) {
            if (q) { cur += ch; if (ch === q) q = null; continue; }
            if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
            if (ch === '(') depth++; if (ch === ')') depth--;
            if (ch === ',' && !depth) { parts.push(cur); cur = ''; } else cur += ch;
        }
        parts.push(cur);
        return parts.map(p => {
            const d = p.trim().match(/^([A-Za-z_]\w*)\s*(=.*)?$/);
            return d ? { name: d[1], type: m[1].replace(/\s+/g, ' '), init: !!d[2] } : null;
        }).filter(Boolean);
    }

    /** does this line give `name` a value? (assignment, compound assignment, ++/--, scanf with &name) */
    function assigns(line, name) {
        const n = name.replace(/[$]/g, '');
        return new RegExp('(^|[^\\w.>])' + n + '\\s*([-+*/%&|^]|<<|>>)?=(?!=)').test(line) ||
            new RegExp('(\\+\\+|--)\\s*' + n + '\\b|\\b' + n + '\\s*(\\+\\+|--)').test(line) ||
            new RegExp('&\\s*' + n + '\\b').test(line);
    }

    /**
     * @param {string} source  the program
     * @param {string[]} vars  the variables to show, in column order
     * @returns {{ source: string, error?: string }}
     */
    function instrument(source, vars) {
        const lines = source.split('\n');
        const start = lines.findIndex(l => /^\s*int\s+main\s*\(/.test(l));
        if (start < 0) return { source, error: 'no main' };
        if (!/\{\s*$/.test(lines[start])) return { source, error: 'main\'s { must end its line' };
        const declared = {};       // name → type, once its line has run
        const valued = {};         // name → given a value on a line above (reading it before is undefined behavior)
        const out = lines.slice(0, start + 1);
        out.unshift('#include <stdio.h>');
        let depth = 1;
        for (let i = start + 1; i < lines.length; i++) {
            const line = lines[i], code = line.replace(/\/\/.*$/, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
            const opens = (code.match(/\{/g) || []).length, closes = (code.match(/\}/g) || []).length;
            depth += opens - closes;
            if (depth <= 0) { out.push(line); out.push(...lines.slice(i + 1)); break; }
            out.push(line);
            declsOf(line).forEach(d => { if (vars.indexOf(d.name) >= 0) { declared[d.name] = d; if (d.init) valued[d.name] = true; } });
            vars.forEach(v => { if (declared[v] && assigns(code, v)) valued[v] = true; });
            const stmt = /;\s*(\/\/.*)?$/.test(code.trim()) && !/^\s*return\b/.test(code) && !/^\s*for\s*\(/.test(code);
            if (!stmt) continue;
            // the snapshot: line, then each variable as k:value, or - (not declared) or ? (no value yet)
            const fields = vars.map(v => {
                const d = declared[v];
                if (!d) return { f: '-', a: null };
                if (!valued[v]) return { f: '?', a: null };
                const k = kindOf(d.type);
                const fmt = k === 'f' ? '%.15g' : k === 'u' ? '%llu' : '%lld';
                const cast = k === 'f' ? '(double)' : k === 'u' ? '(unsigned long long)' : '(long long)';
                return { f: k + fmt, a: cast + '(' + v + ')', name: v };
            });
            const set = [], fmt = [];
            fields.forEach(x => { fmt.push(x.f); if (x.a) set.push(x); });
            out.push('fflush(stdout); printf("' + MARK + '%d|' + fmt.join('|') + '\\n", ' + (i + 1) +
                set.map(x => ', ' + x.a).join('') + '); fflush(stdout);');
        }
        return { source: out.join('\n') };
    }

    /** rows from the instrumented program's output: [{ line, values: [string], out: string }] */
    function parse(stdout, vars) {
        const rows = [];
        let pending = '';
        stdout.split(MARK).forEach((chunk, k) => {
            if (k === 0) { pending += chunk; return; }
            const nl = chunk.indexOf('\n'), head = chunk.slice(0, nl), rest = chunk.slice(nl + 1);
            const parts = head.split('|'), line = +parts[0];
            const values = vars.map((v, j) => {
                const p = parts[j + 1];
                if (p === '-') return '—';
                if (p === '?') return '?';
                const kind = p[0], val = p.slice(1);
                if (kind === 'c') { const c = +val; return c >= 32 && c < 127 ? "'" + String.fromCharCode(c) + "'" : String(c); }
                if (kind === 'b') return val === '0' ? 'false' : 'true';
                if (kind === 'f') return /[.e]|inf|nan/i.test(val) ? val : val + '.0';
                return val;
            });
            rows.push({ line, values, out: pending });
            pending = rest;
        });
        if (rows.length) rows[rows.length - 1].after = pending;
        return rows;
    }

    /** the key of a trace in the generated results: the code and the variables shown */
    const key = (ref, vars) => ref + '|' + vars.join(',');

    const Trace = { instrument, parse, declsOf, key };
    if (typeof module !== 'undefined' && module.exports) module.exports = Trace;
    else g.NullpunktTrace = Trace;
})(typeof window !== 'undefined' ? window : globalThis);

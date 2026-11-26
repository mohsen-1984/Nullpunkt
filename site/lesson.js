/**
 * The lesson page: renders one lesson of the data in one language — lesson.html?lesson=C.L01&lang=fa — with
 * runnable code, exercises checked by tests, and the generated blocks (can-do, terms, self-check, answer key).
 * Classic script; loads from file://. The compiler (vendor/wcc, 600 KB) is loaded on the first run only.
 */
// the registers, this lesson's file and the lessons it refers to (lib/Data.js); then the page
NullpunktData.load({ lessons: [new URLSearchParams(location.search).get('lesson') || 'C.L01'] }).then(function () {
    'use strict';
    const N = window.Nullpunkt, ix = NullpunktData.index(N), reg = ix.reg, G = ix.generated;
    const params = new URLSearchParams(location.search);
    const lang = document.documentElement.lang;     // set by site/boot.js from ?lang=, the stored choice or the browser
    const lessonId = params.get('lesson') || 'C.L01';
    const L = ix.lesson[lessonId];
    const U = NullpunktUI[lang];
    const esc = NullpunktInline.esc;
    const TIMEOUT_MS = 5000;

    const href = (id, l) => 'lesson.html?lesson=' + encodeURIComponent(id) + '&lang=' + (l || lang);
    const letters = reg.letters[lang];
    const bandLetter = {};
    if (L && L.unit) (L.unit.bands || []).forEach((b, i) => { bandLetter[b.id] = letters[i]; });
    const inline = NullpunktInline.renderer(ix, lang, { lessonHref: id => href(id), bandLetter: id => bandLetter[id] || id });
    const h = t => inline.html(t);
    const tx = o => (o && typeof o === 'object' ? o[lang] : o);

    function icon(name, cls) {
        const body = (window.NullpunktIcons && NullpunktIcons.icons[name]) || '';
        return '<svg class="np-icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
    }
    function el(tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
    }
    const store = {
        get(k) { try { return JSON.parse(localStorage.getItem('np.' + k)); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem('np.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    };
    const sameOutput = (a, b) => String(a).replace(/[ \t]+$/gm, '').replace(/\s+$/, '') === String(b).replace(/[ \t]+$/gm, '').replace(/\s+$/, '');

    // ---------- runner: loaded on first use ----------
    let runnerPromise = null;
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('cannot load ' + src));
            document.head.appendChild(s);
        });
    }
    function getRunner() {
        if (!runnerPromise) {
            runnerPromise = (window.WccBundle ? Promise.resolve() : loadScript(document.body.dataset.wcc))
                .then(() => CRunner.create({ bundle: window.WccBundle }));
        }
        return runnerPromise;
    }
    function describeEnd(r) {
        if (r.stopped) return [U.stopped, 'warn'];
        if (r.timedOut) return [U.timedOut.replace('{s}', TIMEOUT_MS / 1000), 'error'];
        if (r.error) return [U.trap['runtime-error'], 'error'];
        if (r.trap) return [U.trap[r.trap] || U.trap['runtime-error'], 'error'];
        return [U.exit.replace('{code}', r.exitCode), r.exitCode === 0 ? 'ok' : 'warn'];
    }

    // ---------- editor: CodeMirror when vendor/codemirror is loaded, a plain textarea otherwise ----------
    // Both give the same small interface: value (get/set), readOnly, onInput(fn), setDiagnostics(list), el.
    function makeEditor(source, opts) {
        const listeners = [];
        if (window.NullpunktCM) {
            const host = el('div', 'np-editor');
            const cm = NullpunktCM.create(host, { doc: source, readOnly: !!opts.readOnly, label: 'C source code',
                onChange: v => listeners.forEach(f => f(v)), onRun: () => opts.onRunKey && opts.onRunKey() });
            const ed = {
                el: host, readOnly: !!opts.readOnly,
                get value() { return cm.getValue(); }, set value(v) { cm.setValue(v); },
                onInput: f => listeners.push(f), setDiagnostics: list => cm.setDiagnostics(list),
            };
            host.npEditor = ed;
            return ed;
        }
        const ta = el('textarea', 'np-editor');
        ta.value = source;
        ta.spellcheck = false;
        ta.setAttribute('dir', 'ltr');
        ta.setAttribute('aria-label', 'C source code');
        ta.readOnly = !!opts.readOnly;
        const fit = () => { ta.rows = Math.max(3, ta.value.split('\n').length + 1); };
        fit();
        ta.addEventListener('input', () => { fit(); listeners.forEach(f => f(ta.value)); });
        ta.addEventListener('keydown', e => {
            if (e.key === 'Tab' && !e.shiftKey && !ta.readOnly) { e.preventDefault(); ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end'); }
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && opts.onRunKey) { e.preventDefault(); opts.onRunKey(); }
        });
        const ed = {
            el: ta, readOnly: !!opts.readOnly,
            get value() { return ta.value; }, set value(v) { ta.value = v; fit(); listeners.forEach(f => f(v)); },
            onInput: f => listeners.push(f), setDiagnostics: () => {},
        };
        ta.npEditor = ed;
        return ed;
    }

    /** Read-only code shown in the text (mistake cards, exercises, answer key): same colors as the editor. */
    function staticCode(code, cls) {
        const pre = el('pre', cls || 'np-static');
        pre.setAttribute('dir', 'ltr');
        pre.innerHTML = window.NullpunktCM ? NullpunktCM.highlight(code) : esc(code);
        return pre;
    }
    const staticHtml = (code, cls) => staticCode(code, cls).outerHTML;
    /** the input a code record reads (`stdin`), shown under read-only code */
    const inputHtml = rec => rec && rec.stdin ? '<div class="np-pair-title">' + esc(U.inputLabel) + '</div><pre dir="ltr" class="np-input">' + esc(rec.stdin) + '</pre>' : '';

    // ---------- code box: editor + run + output ----------
    function codeBox(source, opts) {
        opts = opts || {};
        const box = el('div', 'np-code');
        const editor = makeEditor(source, opts);
        box.appendChild(editor.el);
        const bar = el('div', 'np-bar');
        box.appendChild(bar);
        const out = el('pre', 'np-out');
        out.setAttribute('dir', 'ltr');
        out.hidden = true;
        box.appendChild(out);
        const status = el('span', 'np-status');
        let stdinBox = null;
        if (/\b(scanf|getchar|fgets)\b/.test(source)) {
            stdinBox = el('textarea', 'np-stdin');
            stdinBox.placeholder = U.inputLabel;
            stdinBox.setAttribute('dir', 'ltr');
            // the record's own input (code `stdin`), so the learner sees what the program reads and can change it
            if (opts.stdin) stdinBox.value = opts.stdin;
            stdinBox.rows = Math.max(2, stdinBox.value.split('\n').length);
            box.insertBefore(stdinBox, out);
        }

        async function run(src) {
            out.hidden = false;
            out.textContent = '';
            status.textContent = U.loading;
            status.className = 'np-status';
            const runner = await getRunner();
            status.textContent = U.compiling;
            const r = await runner.run(src == null ? editor.value : src, {
                stdin: stdinBox ? stdinBox.value : '', timeoutMs: TIMEOUT_MS,
                onOutput: (t, isErr) => { const s = el('span', isErr ? 'np-stderr' : ''); s.textContent = t; out.appendChild(s); },
            });
            if (editor.setDiagnostics) editor.setDiagnostics(r.stage === 'compile' && !r.ok ? r.diagnostics : []);
            if (r.stage === 'compile' && !r.ok) {
                const s = el('span', 'np-stderr'); s.textContent = r.compileLog; out.appendChild(s);
                status.textContent = U.compileFailed; status.className = 'np-status error';
            } else {
                const [msg, cls] = describeEnd(r);
                const s = el('span', 'np-note ' + cls); s.textContent = (out.textContent && !out.textContent.endsWith('\n') ? '\n' : '') + msg; out.appendChild(s);
                status.textContent = ''; status.className = 'np-status';
            }
            return r;
        }
        return { box, editor, bar, out, status, run, stdinBox };
    }
    function button(label, iconName, cls) {
        const b = el('button', 'np-btn ' + (cls || ''), icon(iconName) + '<span>' + esc(label) + '</span>');
        b.type = 'button';
        return b;
    }
    function runControls(cb, original, opts) {
        opts = opts || {};
        const runB = button(U.run, 'play', 'primary');
        const stopB = button(U.stop, 'square');
        stopB.disabled = true;
        runB.onclick = async () => {
            runB.disabled = true; stopB.disabled = false;
            try { await cb.run(); } finally { runB.disabled = !!opts.locked && opts.locked(); stopB.disabled = true; }
        };
        stopB.onclick = async () => { const r = await getRunner(); await r.stop(); };
        cb.bar.append(runB, stopB);
        if (!cb.editor.readOnly) {
            const resetB = button(U.reset, 'undo-2');
            resetB.onclick = () => { cb.editor.value = original; cb.editor.setDiagnostics([]); };
            cb.bar.append(resetB);
        }
        cb.bar.append(cb.status);
        return runB;
    }

    // ---------- trace tables and memory maps (rows ⚙ from lib/Trace.js via tools/gen-expect.js) ----------
    function traceOf(ref, vars) {
        const t = G && G.trace && G.trace[ref + '|' + vars.join(',')];
        return t && t.rows ? t : null;
    }
    function traceTable(t, vars, opts) {
        const tbl = el('table', 'np-trace-table');
        tbl.setAttribute('dir', 'ltr');
        tbl.innerHTML = '<thead><tr><th>' + esc(U.traceLine) + '</th>' + vars.map(v => '<th><code>' + esc(v) + '</code></th>').join('') +
            '<th>' + esc(U.traceOut) + '</th></tr></thead>';
        const body = el('tbody');
        t.rows.forEach((r, i) => {
            const prev = i ? t.rows[i - 1].values : null;
            const tr = el('tr');
            tr.innerHTML = '<td class="np-trace-ln">' + r.line + '</td>' + r.values.map((v, j) => {
                const blank = opts && opts.blanks && opts.blanks.some(b => b.step === i + 1 && b.var === vars[j]);
                if (blank) return '<td><input class="np-trace-in" data-step="' + (i + 1) + '" data-var="' + esc(vars[j]) + '" aria-label="' +
                    esc(U.traceLine + ' ' + r.line + ', ' + vars[j]) + '" autocomplete="off" spellcheck="false"></td>';
                const changed = prev && prev[j] !== v;
                return '<td' + (changed ? ' class="np-trace-changed"' : '') + '>' + esc(v) + '</td>';
            }).join('') + '<td class="np-trace-out">' + (r.out ? '<code>' + esc(r.out.replace(/\n$/, '').replace(/\n/g, '⏎')) + '</code>' : '') + '</td>';
            body.appendChild(tr);
        });
        tbl.appendChild(body);
        return tbl;
    }
    function renderTrace(nd) {
        const t = traceOf(nd.ref, nd.vars), fig = el('figure', 'np-trace');
        if (!t) { fig.textContent = '(trace ' + nd.ref + ' not generated)'; return fig; }
        fig.innerHTML = '<figcaption>' + icon('table-2') + '<span>' + esc(U.traceTitle) + '</span></figcaption>';
        const wrap = el('div', 'np-trace-scroll');
        const tbl = traceTable(t, nd.vars);
        wrap.appendChild(tbl);
        // step through: the rows appear one by one; "all steps" shows the whole table
        const rows = Array.from(tbl.tBodies[0].rows);
        let shown = 1;
        const bar = el('div', 'np-trace-bar');
        const step = el('button', 'np-btn', icon('step-forward') + esc(U.traceStep)); step.type = 'button';
        const all = el('button', 'np-btn np-btn-ghost', esc(U.traceAll)); all.type = 'button';
        const again = el('button', 'np-btn np-btn-ghost', esc(U.traceAgain)); again.type = 'button';
        const live = el('span', 'sr-only'); live.setAttribute('aria-live', 'polite');
        function show() {
            rows.forEach((r, i) => { r.hidden = i >= shown; r.classList.toggle('np-trace-now', i === shown - 1 && shown < rows.length); });
            step.disabled = shown >= rows.length; all.disabled = shown >= rows.length;
            const r = t.rows[shown - 1];
            live.textContent = U.traceLine + ' ' + r.line + ': ' + nd.vars.map((v, j) => v + ' = ' + r.values[j]).join(', ');
        }
        step.addEventListener('click', () => { shown++; show(); });
        all.addEventListener('click', () => { shown = rows.length; show(); });
        again.addEventListener('click', () => { shown = 1; show(); });
        bar.append(step, all, again, live);
        show();
        fig.append(wrap, bar, el('p', 'np-trace-hint', esc(U.traceHint)));
        return fig;
    }
    function renderMemory(nd) {
        // boxes are written by the author (S00-schema): name, type, value, and from chapter 8 an address and arrows
        const fig = el('figure', 'np-memory');
        fig.innerHTML = '<figcaption>' + icon('memory-stick') + '<span>' + esc(U.memoryTitle.replace('{line}', nd.line)) + '</span></figcaption>';
        const row = el('div', 'np-mem-row'); row.setAttribute('dir', 'ltr');
        nd.boxes.forEach(b => {
            const box = el('div', 'np-mem-box' + (b.value === '?' ? ' np-mem-unset' : ''));
            box.innerHTML = '<span class="np-mem-type"><code>' + esc(b.type) + '</code></span><span class="np-mem-val">' + esc(b.value) + '</span>' +
                '<span class="np-mem-name"><code>' + esc(b.name) + '</code></span>' + (b.addr ? '<span class="np-mem-addr">' + esc(b.addr) + '</span>' : '');
            row.appendChild(box);
        });
        fig.appendChild(row);
        return fig;
    }

    // ---------- content nodes ----------
    function renderNode(nd, blockId) {
        if (nd.type === 'p') return el('p', '', h(nd.text[lang]));
        if (nd.type === 'list') {
            const list = el(nd.ordered ? 'ol' : 'ul', 'np-list');
            nd.items.forEach(it => list.appendChild(el('li', '', h(it[lang]))));
            return list;
        }
        if (nd.type === 'note') {
            const k = reg.noteKinds[nd.kind];
            const a = el('aside', 'np-note-box np-note-' + nd.kind);
            a.innerHTML = '<div class="np-note-title">' + icon(k.icon) + esc(k.title[lang]) + '</div><p>' + h(nd.text[lang]) + '</p>';
            return a;
        }
        if (nd.type === 'code') return renderCode(nd);
        if (nd.type === 'diagnostic') return renderDiagnostic(nd);
        if (nd.type === 'mistakes') return renderMistakes(nd);
        if (nd.type === 'band') return renderBand(ix.band[nd.ref]);
        if (nd.type === 'prompt') return renderPrompt(ix.prompt[nd.ref]);
        if (nd.type === 'table') {
            const t = el('table', 'np-table');
            t.innerHTML = '<thead><tr>' + nd.head.map(c => '<th>' + h(c[lang]) + '</th>').join('') + '</tr></thead><tbody>' +
                nd.rows.map(r => '<tr>' + r.map(c => '<td>' + (c.code ? '<code dir="ltr">' + esc(c.code) + '</code>' : h(c[lang])) + '</td>').join('') + '</tr>').join('') + '</tbody>';
            return t;
        }
        if (nd.type === 'myth') {
            const a = el('aside', 'np-myth');
            a.innerHTML = '<p class="np-myth-claim">' + icon('circle-question-mark') + '<span>' + h(nd.claim[lang]) + '</span></p>' +
                '<p class="np-myth-fact">' + icon('circle-check') + '<span>' + h(nd.fact[lang]) + '</span></p>';
            return a;
        }
        if (nd.type === 'terminal') {
            // shown, not run: commands and their output on a real machine (C.ORI.01)
            const f = el('figure', 'np-sh');
            f.setAttribute('dir', 'ltr');
            const prompt = nd.prompt || '$';
            f.innerHTML = (nd.title ? '<figcaption>' + icon('terminal') + '<span>' + esc(nd.title) + '</span></figcaption>' : '') +
                '<pre>' + nd.lines.map(l => l.cmd != null
                    ? '<span class="np-sh-p">' + esc(prompt) + '</span> <span class="np-sh-c">' + esc(l.cmd).replace(/(#.*)$/, '<span class="np-sh-r">$1</span>') + '</span>'
                    : '<span class="np-sh-o">' + esc(l.out) + '</span>').join('\n') + '</pre>';
            return f;
        }
        if (nd.type === 'tabs') {
            const wrap = el('div', 'np-tabs');
            const bar = el('div', 'np-tabbar'); bar.setAttribute('role', 'tablist');
            const uid = 'np-tab-' + Math.random().toString(36).slice(2, 8);
            const panels = nd.tabs.map((t, i) => {
                const label = typeof t.label === 'string' ? t.label : t.label[lang];
                const btn = el('button', 'np-tab', esc(label));
                btn.type = 'button'; btn.id = uid + '-t' + i; btn.setAttribute('role', 'tab'); btn.setAttribute('aria-controls', uid + '-p' + i);
                const pnl = el('div', 'np-tabpanel'); pnl.id = uid + '-p' + i; pnl.setAttribute('role', 'tabpanel'); pnl.setAttribute('aria-labelledby', btn.id);
                t.content.forEach(c => pnl.appendChild(renderNode(c, blockId)));
                bar.appendChild(btn);
                return { btn, pnl };
            });
            const pick = i => panels.forEach((p, j) => {
                p.btn.setAttribute('aria-selected', String(i === j)); p.btn.tabIndex = i === j ? 0 : -1; p.pnl.hidden = i !== j;
            });
            // start on the reader's own system when it is one of the tabs
            const ua = navigator.userAgent, guess = /Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : '';
            const first = Math.max(0, nd.tabs.findIndex(t => t.label === guess));
            panels.forEach((p, i) => {
                p.btn.addEventListener('click', () => pick(i));
                p.btn.addEventListener('keydown', e => {
                    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                    if (!d) return;
                    const n = (i + (document.documentElement.dir === 'rtl' ? -d : d) + panels.length) % panels.length;
                    pick(n); panels[n].btn.focus();
                });
            });
            pick(first);
            wrap.append(bar, ...panels.map(p => p.pnl));
            return wrap;
        }
        if (nd.type === 'trace') return renderTrace(nd);
        if (nd.type === 'memory') return renderMemory(nd);
        if (nd.type === 'asm') {
            const code = ix.code[nd.ref], e = G && G.code[code.id];
            const wrap = el('div', 'np-asm');
            wrap.innerHTML = '<div><div class="np-pair-title">' + icon('file-code') + '<span>C — main.c</span></div>' + staticHtml(code.source.replace(/\n$/, ''), 'np-code-pre') + '</div>' +
                '<div><div class="np-pair-title">' + icon('cpu') + '<span>' + esc(U.asmTitle) + '</span></div><pre dir="ltr" class="np-code-pre np-asm-pre">' + esc(e && e.gcc.asm ? e.gcc.asm : '') + '</pre></div>';
            return wrap;
        }
        return el('div', 'np-unknown', esc(nd.type));
    }

    function renderCode(nd) {
        const code = ix.code[nd.ref];
        const cb = codeBox(code.source, { readOnly: nd.mode !== 'run', stdin: code.stdin });
        if (nd.mode === 'predict') {
            const wrap = el('div', 'np-predict');
            const label = el('label', 'np-label', esc(U.yourPrediction));
            const guess = el('textarea', 'np-guess');
            guess.setAttribute('dir', 'ltr');
            guess.rows = 3;
            const key = 'predict.' + code.id;
            const saved = store.get(key);
            if (saved) guess.value = saved;
            label.appendChild(guess);
            const hint = el('p', 'np-hint', esc(U.predictFirst));
            const verdict = el('p', 'np-verdict');
            const runB = runControls(cb, code.source, { locked: () => !guess.value.trim() });
            runB.disabled = !guess.value.trim();
            guess.addEventListener('input', () => { runB.disabled = !guess.value.trim(); store.set(key, guess.value); });
            const origRun = cb.run;
            cb.run = async () => {
                const r = await origRun();
                const expected = G && G.code[code.id] ? G.code[code.id].gcc.stdout : null;
                if (expected != null) {
                    const ok = sameOutput(guess.value, expected);
                    verdict.textContent = ok ? U.predictionRight : U.predictionWrong;
                    verdict.className = 'np-verdict ' + (ok ? 'ok' : 'warn');
                }
                return r;
            };
            wrap.append(cb.box, label, hint, verdict);
            cb.box.insertBefore(label, cb.bar);
            cb.box.insertBefore(hint, cb.bar);
            wrap.appendChild(verdict);
            return wrap;
        }
        // static: read only, with line numbers (a trace table points at them), and nothing to run (S00-schema: code)
        if (nd.mode === 'static') { cb.box.classList.add('np-code-static'); return cb.box; }
        runControls(cb, code.source);
        return cb.box;
    }

    const fmtDiag = d => d.line == null ? 'ld: ' + d.severity + ': ' + d.message : 'main.c:' + d.line + ':' + d.col + ': ' + d.severity + ': ' + d.message;

    function genLog(e, which) {
        const r = e && e[which];
        if (!r) return '';
        return (r.log || '').split('\n').filter(l => !/^main\.c: In function/.test(l)).join('\n');
    }

    function renderDiagnostic(nd) {
        const code = ix.code[nd.ref], e = G && G.code[code.id];
        const wrap = el('div', 'np-diagnostic');
        const cb = codeBox(code.source, { readOnly: false, stdin: code.stdin });
        runControls(cb, code.source);
        wrap.appendChild(cb.box);
        const msgs = el('div', 'np-msgs');
        // gcc built the program: the message is a warning, not an error
        const gccIcon = e && e.gcc.compiled ? 'triangle-exclamation-point' : 'octagon-x';
        msgs.innerHTML = '<div class="np-msg"><div class="np-msg-title">' + icon(gccIcon) + esc(U.gccSays) + '</div><pre dir="ltr">' + esc(genLog(e, 'gcc')) + '</pre></div>' +
            '<div class="np-msg"><div class="np-msg-title">' + icon('octagon-x') + esc(U.xccSays) + '</div><pre dir="ltr">' + esc(genLog(e, 'xcc')) + '</pre></div>';
        wrap.appendChild(msgs);
        const dl = el('dl', 'np-explain');
        ['where', 'what', 'why', 'fix'].forEach(k => {
            dl.appendChild(el('dt', '', esc(U[k])));
            dl.appendChild(el('dd', '', h(nd.explain[k][lang])));
        });
        wrap.appendChild(dl);
        return wrap;
    }

    function renderMistakes(nd) {
        const wrap = el('div', 'np-mistakes');
        nd.refs.forEach(id => {
            const m = ix.mistake[id];
            const card = el('section', 'np-mistake');
            const src = reg.sources[m.src], dim = reg.dimensions[m.dim];
            let meta = esc(dim.title[lang]) + ' · ' + esc(U.source) + ': ' + esc(src.title[lang]);
            if (m.contrast) meta += ' · ' + esc(U.contrast) + ': ' + esc(reg.contrastTypes[m.contrast].title[lang]);
            card.innerHTML = '<h3><code class="np-pit">' + esc(m.id) + '</code> ' + h(m.title[lang]) + '</h3><p class="np-meta">' + meta + '</p>';
            const w = ix.code[m.wrong], r = ix.code[m.right];
            const ew = G && G.code[w.id], er = G && G.code[r.id];
            let symptom = '';
            if (ew && !ew.gcc.compiled) {
                // the first error only: later lines of gcc's message are often follow-up errors of the same mistake
                const d = ew.gcc.diagnostics.find(x => x.severity === 'error') || ew.gcc.diagnostics[0];
                symptom = d ? fmtDiag(d) : genLog(ew, 'gcc');
            } else if (ew && ew.gcc.diagnostics.some(x => x.severity === 'warning')) {
                symptom = fmtDiag(ew.gcc.diagnostics.find(x => x.severity === 'warning'));
            }
            else if (ew) symptom = U.output + ':\n' + (ew.gcc.stdout || U.noOutput);
            const pair = el('div', 'np-pair');
            pair.innerHTML = '<div class="np-wrong"><div class="np-pair-title">' + icon('circle-x') + esc(U.wrong) + '</div>' + staticHtml(w.source, 'np-code-pre') + inputHtml(w) +
                '<div class="np-pair-title">' + esc(U.symptom) + '</div><pre dir="ltr" class="np-symptom">' + esc(symptom) + '</pre></div>' +
                '<div class="np-right"><div class="np-pair-title">' + icon('circle-check') + esc(U.right) + '</div>' + staticHtml(r.source, 'np-code-pre') + inputHtml(r) +
                (er ? '<div class="np-pair-title">' + esc(U.output) + '</div><pre dir="ltr">' + esc(er.gcc.stdout || U.noOutput) + '</pre>' : '') + '</div>';
            card.appendChild(pair);
            card.appendChild(el('p', 'np-why', '<strong>' + esc(U.why) + ':</strong> ' + h(m.why[lang])));
            wrap.appendChild(card);
        });
        return wrap;
    }

    // ---------- exercises ----------
    async function runTests(source, item) {
        const runner = await getRunner();
        const results = [];
        for (const t of (item.tests || []).filter(t => t.purpose !== 'mistake')) {
            let stdout = '';
            const r = await runner.run(source, { stdin: t.stdin || '', timeoutMs: TIMEOUT_MS, onOutput: (s, isErr) => { if (!isErr) stdout += s; } });
            const expected = G && G.tests[t.id] ? G.tests[t.id].expect.stdout : '';
            if (r.stage === 'compile' && !r.ok) return { compileError: r.compileLog, results: [] };
            results.push({ test: t, ok: !r.trap && !r.timedOut && sameOutput(stdout, expected), stdout, expected, run: r });
        }
        return { results };
    }

    function showTestResults(panel, res) {
        panel.innerHTML = '';
        if (res.compileError != null) {
            panel.appendChild(el('p', 'np-verdict error', icon('circle-x') + esc(U.compileFailed)));
            const pre = el('pre', 'np-out'); pre.setAttribute('dir', 'ltr'); pre.textContent = res.compileError; panel.appendChild(pre);
            return false;
        }
        const all = res.results.every(r => r.ok);
        panel.appendChild(el('p', 'np-verdict ' + (all ? 'ok' : 'error'), icon(all ? 'circle-check' : 'circle-x') + esc(all ? U.allPassed : U.someFailed)));
        res.results.filter(r => !r.ok).slice(0, 1).forEach(r => {
            const grid = el('div', 'np-compare');
            grid.innerHTML = '<div><div class="np-pair-title">' + esc(U.expected) + '</div><pre dir="ltr">' + esc(r.expected || U.noOutput) + '</pre></div>' +
                '<div><div class="np-pair-title">' + esc(U.got) + '</div><pre dir="ltr">' + esc(r.stdout || U.noOutput) + '</pre></div>';
            panel.appendChild(grid);
        });
        return all;
    }

    function markItem(itemEl, id, ok) {
        itemEl.classList.toggle('np-done', !!ok);
        if (ok) store.set('item.' + id, true);
    }

    function renderBand(b) {
        const bt = reg.bandTypes[b.type];
        const sec = el('section', 'np-band');
        sec.id = b.id;
        sec.innerHTML = '<h3>' + icon(bt.icon) + '<span class="np-letter">' + esc(bandLetter[b.id]) + '</span> ' + h(b.title[lang]) + '</h3>';
        b.items.forEach((it, i) => {
            const itemEl = el('div', 'np-item');
            if (store.get('item.' + it.id)) itemEl.classList.add('np-done');
            itemEl.appendChild(el('div', 'np-item-n', String(i + 1)));
            const body = el('div', 'np-item-body');
            itemEl.appendChild(body);
            if (it.prompt) body.appendChild(el('p', 'np-prompt', h(it.prompt[lang])));
            const panel = el('div', 'np-result');

            if (b.type === 'B.predict') {
                const code = ix.code[it.code];
                body.appendChild(staticCode(code.source));
                if (code.stdin) body.insertAdjacentHTML('beforeend', inputHtml(code));
                const guess = el('textarea', 'np-guess'); guess.setAttribute('dir', 'ltr'); guess.rows = 3; guess.placeholder = U.yourPrediction;
                body.appendChild(guess);
                const chk = button(U.check, 'circle-check', 'primary');
                chk.onclick = () => {
                    const expected = G.code[code.id].gcc.stdout;
                    const ok = sameOutput(guess.value, expected);
                    panel.innerHTML = '';
                    panel.appendChild(el('p', 'np-verdict ' + (ok ? 'ok' : 'warn'), icon(ok ? 'circle-check' : 'circle-x') + esc(ok ? U.predictionRight : U.predictionWrong)));
                    const grid = el('div', 'np-compare');
                    grid.innerHTML = '<div><div class="np-pair-title">' + esc(U.expected) + '</div><pre dir="ltr">' + esc(expected) + '</pre></div>';
                    panel.appendChild(grid);
                    markItem(itemEl, it.id, ok);
                };
                body.append(el('div', 'np-bar').appendChild(chk).parentNode, panel);
            } else if (b.type === 'B.trace') {
                // fill the empty cells of a trace table whose other rows are given (rows ⚙ from the real run)
                const code = ix.code[it.code], t = traceOf(it.code, it.vars);
                body.appendChild(staticCode(code.source));
                if (t) {
                    body.appendChild(el('p', 'np-trace-hint', esc(U.traceFill)));
                    const wrap = el('div', 'np-trace-scroll');
                    const tbl = traceTable(t, it.vars, { blanks: it.blanks });
                    wrap.appendChild(tbl);
                    body.appendChild(wrap);
                    const chk = button(U.check, 'circle-check', 'primary');
                    const norm = v => String(v).trim().replace(/\s+/g, '').replace(/^"(.)"$/, "'$1'").replace(/\.0+$/, '');
                    chk.onclick = () => {
                        let all = true;
                        tbl.querySelectorAll('.np-trace-in').forEach(inp => {
                            const step = +inp.dataset.step, j = it.vars.indexOf(inp.dataset.var);
                            const want = t.rows[step - 1].values[j];
                            const ok = norm(inp.value) === norm(want) || norm(inp.value) === norm(want).replace(/^'(.)'$/, '$1');
                            inp.classList.toggle('ok', ok); inp.classList.toggle('bad', !ok);
                            if (!ok) all = false;
                        });
                        panel.innerHTML = '';
                        panel.appendChild(el('p', 'np-verdict ' + (all ? 'ok' : 'warn'), icon(all ? 'circle-check' : 'circle-x') + esc(all ? U.allPassed : U.someFailed)));
                        markItem(itemEl, it.id, all);
                    };
                    body.append(el('div', 'np-bar').appendChild(chk).parentNode, panel);
                }
            } else if (b.type === 'B.parsons') {
                body.appendChild(staticCode(it.before.join('\n')));
                const list = el('ol', 'np-parsons');
                list.setAttribute('dir', 'ltr');
                let order = it.lines.map((_, k) => k);
                const draw = () => {
                    list.innerHTML = '';
                    order.forEach((k, pos) => {
                        const li = el('li', '', '<code>' + (window.NullpunktCM ? NullpunktCM.highlight(it.lines[k]) : esc(it.lines[k])) + '</code>');
                        const up = button('', 'chevron-up', 'icon-only'); up.setAttribute('aria-label', U.up); up.title = U.up;
                        const down = button('', 'chevron-down', 'icon-only'); down.setAttribute('aria-label', U.down); down.title = U.down;
                        up.classList.add('np-up'); down.classList.add('np-down');
                        up.disabled = pos === 0; down.disabled = pos === order.length - 1;
                        up.onclick = () => { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; draw(); };
                        down.onclick = () => { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; draw(); };
                        li.append(up, down);
                        list.appendChild(li);
                    });
                };
                draw();
                body.appendChild(list);
                body.appendChild(staticCode(it.after.join('\n')));
                const chk = button(U.check, 'circle-check', 'primary');
                chk.onclick = async () => {
                    chk.disabled = true;
                    const res = await runTests(NullpunktData.parsonsSource(it, order), it);
                    markItem(itemEl, it.id, showTestResults(panel, res));
                    chk.disabled = false;
                };
                body.append(el('div', 'np-bar').appendChild(chk).parentNode, panel);
            } else if (b.type === 'B.fix' || b.type === 'B.write' || b.type === 'B.complete' || b.type === 'B.modify') {
                const start = b.type === 'B.fix' ? ix.code[it.broken].source : (it.starter || it.template || (it.start && ix.code[it.start].source) || '');
                const key = 'code.' + it.id;
                // the input box starts with the first test's input (a fix: the broken code's own input)
                const firstIn = ((it.tests || []).find(t => t.stdin) || (b.type === 'B.fix' ? ix.code[it.broken] : null) || {}).stdin;
                const cb = codeBox(store.get(key) || start, { stdin: firstIn });
                cb.editor.onInput(v => store.set(key, v));
                runControls(cb, start);
                const chk = button(U.check, 'circle-check', 'primary');
                chk.onclick = async () => {
                    chk.disabled = true;
                    const res = await runTests(cb.editor.value, it);
                    markItem(itemEl, it.id, showTestResults(panel, res));
                    chk.disabled = false;
                };
                cb.bar.insertBefore(chk, cb.bar.firstChild);
                body.append(cb.box, panel);
            } else if (b.type === 'B.choice') {
                // one question, options with their own feedback; the choice is kept, a right answer marks the item done
                const key = 'choice.' + it.id, name = 'np-' + it.id.replace(/\./g, '-');
                const list = el('div', 'np-choice');
                list.setAttribute('role', 'radiogroup');
                list.setAttribute('aria-label', it.prompt ? it.prompt[lang].replace(/[`*]/g, '') : '');
                const show = k => {
                    const o = it.options[k];
                    panel.innerHTML = '';
                    panel.appendChild(el('p', 'np-verdict ' + (o.correct ? 'ok' : 'warn'), icon(o.correct ? 'circle-check' : 'circle-x') + '<span>' + h(o.feedback[lang]) + '</span>'));
                    list.querySelectorAll('label').forEach((lb, j) => { lb.classList.toggle('is-right', o.correct && j === k); lb.classList.toggle('is-wrong', !o.correct && j === k); });
                    markItem(itemEl, it.id, o.correct);
                };
                it.options.forEach((o, k) => {
                    const lb = el('label', 'np-option');
                    const r = el('input'); r.type = 'radio'; r.name = name; r.value = String(k);
                    r.addEventListener('change', () => { store.set(key, k); show(k); });
                    lb.append(r, el('span', '', h(o.text[lang])));
                    list.appendChild(lb);
                });
                const saved = store.get(key);
                body.append(list, panel);
                if (typeof saved === 'number' && it.options[saved]) { list.querySelectorAll('input')[saved].checked = true; show(saved); }
            } else if (b.type === 'B.explain') {
                const ans = el('textarea', 'np-answer'); ans.rows = 3; ans.placeholder = U.yourAnswer;
                const key = 'explain.' + it.id;
                ans.value = store.get(key) || '';
                ans.addEventListener('input', () => store.set(key, ans.value));
                const show = button(U.showAnswer, 'key-round');
                show.onclick = () => { panel.innerHTML = '<p class="np-model">' + h(it.model[lang]) + '</p>'; markItem(itemEl, it.id, true); };
                body.append(ans, el('div', 'np-bar').appendChild(show).parentNode, panel);
            }
            sec.appendChild(itemEl);
        });
        return sec;
    }

    function renderPrompt(p) {
        const wrap = el('div', 'np-prompt-box');
        const text = p.text.replace('{lang}', { fa: 'Persian', de: 'German', en: 'English' }[lang])
            .replace('{lesson}', L.review ? 'the review of chapter ' + ix.chapter[L.chapter].n : L.label);
        wrap.innerHTML = '<div class="np-prompt-title">' + icon(p.icon) + '<strong>' + esc(p.name.en) + '</strong>' + (lang !== 'en' ? ' — ' + esc(p.name[lang]) : '') + ' <code>' + esc(p.id) + '</code></div>';
        const pre = el('pre', 'np-prompt-text'); pre.setAttribute('dir', 'ltr'); pre.textContent = text;
        const copy = button(U.copy, 'copy');
        copy.onclick = () => navigator.clipboard.writeText(text).then(() => { copy.querySelector('span').textContent = U.copied; });
        wrap.append(pre, el('div', 'np-bar').appendChild(copy).parentNode);
        const dl = el('dl', 'np-guide');
        [['guideDoes', 'does'], ['guideGive', 'give'], ['guideOutput', 'output']].forEach(([lbl, k]) => {
            dl.appendChild(el('dt', '', esc(U[lbl]))); dl.appendChild(el('dd', '', h(p.guide[k][lang])));
        });
        wrap.appendChild(dl);
        return wrap;
    }

    // ---------- generated blocks ----------
    function renderGenerated(block) {
        const cat = L.catalog;
        if (block === 'cando') {
            const ul = el('ul', 'np-cando');
            cat.cando.forEach(c => ul.appendChild(el('li', '', h(c[lang]))));
            return [ul];
        }
        if (block === 'selfcheck') {
            const ul = el('ul', 'np-selfcheck');
            cat.cando.forEach((c, i) => {
                const key = 'self.' + L.id + '.' + i;
                const li = el('li', '');
                const cbx = el('input'); cbx.type = 'checkbox'; cbx.checked = !!store.get(key); cbx.id = 'sc' + i;
                cbx.onchange = () => store.set(key, cbx.checked);
                const lab = el('label', '', h(c[lang])); lab.htmlFor = cbx.id;
                li.append(cbx, lab); ul.appendChild(li);
            });
            return [el('p', '', esc(U.selfcheckIntro)), ul];
        }
        if (block === 'terms') {
            const dl = el('dl', 'np-terms');
            [...inline.termsUsed].forEach(id => {
                const t = ix.term[id];
                const word = lang === 'en' ? t.en : t.use[lang];
                const extra = lang === 'en' ? '' : (t.gloss[lang] !== word ? ' — ' + t.gloss[lang] : '') + (word !== t.en ? ' · ' + t.en : '');
                dl.appendChild(el('dt', '', '<strong dir="auto">' + esc(word) + '</strong>' + esc(extra) + (lang === 'de' ? ' <span class="np-meta">(' + esc(t.deArticle) + ')</span>' : '')));
                dl.appendChild(el('dd', '', h(t.def[lang])));
            });
            return [el('p', '', esc(U.termsIntro)), dl];
        }
        if (block === 'key') {
            const t = el('table', 'np-table np-key');
            let rows = '';
            (L.unit.bands || []).forEach(b => b.items.forEach((it, i) => {
                let answer = '';
                if (b.type === 'B.predict') answer = '<pre dir="ltr">' + esc(G.code[it.code].gcc.stdout) + '</pre>';
                else if (b.type === 'B.parsons') answer = staticHtml(it.solution.map(k => it.lines[k]).join('\n'), 'np-code-pre');
                else if (b.type === 'B.explain') answer = h(it.model[lang]);
                else if (b.type === 'B.choice') answer = h(it.options.find(o => o.correct).text[lang]);
                else if (b.type === 'B.trace') { const t = traceOf(it.code, it.vars); answer = t ? '<div class="np-trace-scroll">' + traceTable(t, it.vars).outerHTML + '</div>' : ''; }
                else answer = '<details><summary>' + esc(U.solution) + '</summary>' + staticHtml(it.solution, 'np-code-pre') + '</details>';
                rows += '<tr><td>' + (i === 0 ? esc(bandLetter[b.id]) : '') + '</td><td>' + (i + 1) + '</td><td>' + answer + '</td><td>' + h(it.why[lang]) + '</td></tr>';
            }));
            t.innerHTML = '<thead><tr><th>' + esc(U.exercise) + '</th><th>' + esc(U.question) + '</th><th>' + esc(U.answer) + '</th><th>' + esc(U.why) + '</th></tr></thead><tbody>' + rows + '</tbody>';
            return [t];
        }
        return [];
    }

    // ---------- page ----------
    function render() {
        const root = document.getElementById('lesson');
        const C = NullpunktCourse, S = U.site;
        if (!L || !L.unit) {
            root.appendChild(el('h1', '', esc(L ? U.lesson + ' ' + L.label + ': ' + L.catalog.title[lang] : 'Nullpunkt')));
            root.appendChild(el('p', '', esc(U.planned) + ' — <a href="' + esc(C.homeHref(lang, 'path')) + '">' + esc(S.path) + '</a>'));
            NullpunktChrome.mount({ page: 'lesson', nav: [], tree: C.tree(ix, lang, lessonId) });
            return;
        }
        const cat = L.catalog, ch = ix.chapter[L.chapter];
        const title = cat.title[lang];
        // a review unit (Cnn.REV) has no number: its title says what it is
        const heading = L.review ? cat.title[lang] : U.lesson + ' ' + L.label + ': ' + title;
        document.title = heading + ' — Nullpunkt';
        const status = ch.catalog.langStatus[lang];
        // the leading path: home › chapter › lesson
        const crumbs = el('ol', 'np-crumbs');
        crumbs.setAttribute('aria-label', S.aria.crumbs);
        crumbs.innerHTML = '<li><a href="' + esc(C.homeHref(lang)) + '">' + esc(S.home) + '</a></li>' +
            '<li><a href="' + esc(C.homeHref(lang, 'chapter-' + ch.id)) + '">' + esc(U.chapter) + ' ' + ch.n + ': ' + esc(ch.catalog.title[lang]) + '</a></li>' +
            '<li aria-current="page">' + (L.review ? esc(reg.unitTypes.review.label[lang]) : esc(U.lesson) + ' ' + L.label) + '</li>';
        root.appendChild(crumbs);
        // the English title on its own line, in its own direction, so a Persian title never breaks around it
        root.appendChild(el('h1', '', esc(heading) +
            (lang !== 'en' ? '<span class="np-title-en" lang="en" dir="ltr">' + esc(cat.title.en) + '</span>' : '')));
        root.appendChild(el('p', 'np-lesson-meta', icon('clock') + '<span>' + cat.minutes + ' ' + esc(U.minutes) + '</span>' +
            (status !== 'reviewed' ? '<span class="np-badge">' + esc(U.inDevelopment) + '</span>' : '')));
        store.set('visited.' + L.id, true);
        store.set('last', L.id);

        L.unit.blocks.forEach(b => {
            const def = reg.blocks[b.block];
            const sec = el('section', 'np-block np-block-' + b.block);
            sec.id = b.id || b.block;
            // a section block brings its own title and icon (orientation lessons, C.ORI.01)
            const title = b.title ? h(b.title[lang]) : esc(def.title[lang]) + (b.subtitle ? ': ' + h(b.subtitle[lang]) : '');
            sec.appendChild(el('h2', '', icon(b.icon || def.icon) + '<span>' + title + '</span>'));
            const gen = ['cando', 'terms', 'selfcheck', 'key'].indexOf(b.block) >= 0;
            (gen ? [] : b.content.map(nd => renderNode(nd, b.block))).forEach(n => sec.appendChild(n));
            root.appendChild(sec);
            if (gen) sec.dataset.generated = b.block;
        });
        // generated blocks last, after every term has been seen
        root.querySelectorAll('[data-generated]').forEach(sec => renderGenerated(sec.dataset.generated).forEach(n => sec.appendChild(n)));

        const i = ix.lessonList.indexOf(L);
        const nav = el('nav', 'np-pager');
        const prev = ix.lessonList[i - 1], next = ix.lessonList[i + 1];
        if (prev) nav.appendChild(prev.written ? el('a', '', icon('chevron-left', 'np-flip') + esc(U.prev)) : el('span', 'np-meta', esc(U.prev)));
        if (next) {
            const n = next.written ? el('a', '', esc(U.next) + icon('chevron-right', 'np-flip')) : el('span', 'np-meta', esc(U.next) + ': ' + esc(U.planned));
            if (next.written) n.href = href(next.id);
            nav.appendChild(n);
        }
        if (prev && prev.written) nav.firstChild.href = href(prev.id);
        root.appendChild(nav);

        // the chrome: the lesson's blocks are the page's sections; the learning path is the rail
        const plainText = t => String(t).replace(/[`*]/g, '');
        const navItems = L.unit.blocks.map(b => ({ id: b.id || b.block,
            label: plainText(b.title ? b.title[lang] : reg.blocks[b.block].title[lang]), short: plainText(b.short ? b.short[lang] : reg.blocks[b.block].short[lang]) }));
        NullpunktChrome.mount({ page: 'lesson', nav: navItems, tree: C.tree(ix, lang, L.id) });
        const q = params.get('q');
        if (q && window.NullpunktSearch) NullpunktSearch.highlight(q);
    }

    render();
}).catch(function (e) { setTimeout(function () { throw e; }); });     // a failure shows in the console, as before

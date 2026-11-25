/**
 * The lesson page: renders one lesson of the data in one language — lesson.html?lesson=C.L01&lang=fa — with
 * runnable code, exercises checked by tests, and the generated blocks (can-do, terms, self-check, answer key).
 * Classic script; loads from file://. The compiler (vendor/wcc, 600 KB) is loaded on the first run only.
 */
(function () {
    'use strict';
    const N = window.Nullpunkt, ix = NullpunktData.index(N), reg = ix.reg, G = ix.generated;
    const params = new URLSearchParams(location.search);
    const LANGS = N.registry.languages;
    let lang = params.get('lang');
    try { if (!lang) lang = localStorage.getItem('np.lang'); } catch (e) { /* storage may be blocked */ }
    if (LANGS.indexOf(lang) < 0) lang = 'en';
    const lessonId = params.get('lesson') || 'C.L01';
    const L = ix.lesson[lessonId];
    const U = NullpunktUI[lang];
    const esc = NullpunktInline.esc;
    const TIMEOUT_MS = 5000;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

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

    // ---------- code box: editor + run + output ----------
    function codeBox(source, opts) {
        opts = opts || {};
        const box = el('div', 'np-code');
        const editor = el('textarea', 'np-editor');
        editor.value = source;
        editor.spellcheck = false;
        editor.setAttribute('dir', 'ltr');
        editor.setAttribute('aria-label', 'C source code');
        editor.readOnly = !!opts.readOnly;
        editor.rows = Math.max(3, source.split('\n').length + 1);
        editor.addEventListener('input', () => { editor.rows = Math.max(3, editor.value.split('\n').length); });
        editor.addEventListener('keydown', e => {
            if (e.key === 'Tab' && !e.shiftKey && !editor.readOnly) { e.preventDefault(); editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end'); }
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && opts.onRunKey) { e.preventDefault(); opts.onRunKey(); }
        });
        box.appendChild(editor);
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
            stdinBox.rows = 2;
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
            resetB.onclick = () => { cb.editor.value = original; cb.editor.rows = Math.max(3, original.split('\n').length - 1); };
            cb.bar.append(resetB);
        }
        cb.bar.append(cb.status);
        return runB;
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
        return el('div', 'np-unknown', esc(nd.type));
    }

    function renderCode(nd) {
        const code = ix.code[nd.ref];
        const cb = codeBox(code.source, { readOnly: nd.mode !== 'run' });
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
        runControls(cb, code.source);
        return cb.box;
    }

    function genLog(e, which) {
        const r = e && e[which];
        if (!r) return '';
        return (r.log || '').split('\n').filter(l => !/^main\.c: In function/.test(l)).join('\n');
    }

    function renderDiagnostic(nd) {
        const code = ix.code[nd.ref], e = G && G.code[code.id];
        const wrap = el('div', 'np-diagnostic');
        const cb = codeBox(code.source, { readOnly: false });
        runControls(cb, code.source);
        wrap.appendChild(cb.box);
        const msgs = el('div', 'np-msgs');
        msgs.innerHTML = '<div class="np-msg"><div class="np-msg-title">' + icon('octagon-x') + esc(U.gccSays) + '</div><pre dir="ltr">' + esc(genLog(e, 'gcc')) + '</pre></div>' +
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
            if (ew && !ew.gcc.compiled) symptom = genLog(ew, 'gcc');
            else if (ew) symptom = U.output + ':\n' + (ew.gcc.stdout || U.noOutput);
            const pair = el('div', 'np-pair');
            pair.innerHTML = '<div class="np-wrong"><div class="np-pair-title">' + icon('circle-x') + esc(U.wrong) + '</div><pre dir="ltr">' + esc(w.source) + '</pre>' +
                '<div class="np-pair-title">' + esc(U.symptom) + '</div><pre dir="ltr" class="np-symptom">' + esc(symptom) + '</pre></div>' +
                '<div class="np-right"><div class="np-pair-title">' + icon('circle-check') + esc(U.right) + '</div><pre dir="ltr">' + esc(r.source) + '</pre>' +
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
                const pre = el('pre', 'np-static'); pre.setAttribute('dir', 'ltr'); pre.textContent = code.source; body.appendChild(pre);
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
            } else if (b.type === 'B.parsons') {
                body.appendChild(Object.assign(el('pre', 'np-static'), { textContent: it.before.join('\n') })).setAttribute('dir', 'ltr');
                const list = el('ol', 'np-parsons');
                list.setAttribute('dir', 'ltr');
                let order = it.lines.map((_, k) => k);
                const draw = () => {
                    list.innerHTML = '';
                    order.forEach((k, pos) => {
                        const li = el('li', '', '<code>' + esc(it.lines[k]) + '</code>');
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
                body.appendChild(Object.assign(el('pre', 'np-static'), { textContent: it.after.join('\n') })).setAttribute('dir', 'ltr');
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
                const cb = codeBox(store.get(key) || start, {});
                cb.editor.addEventListener('input', () => store.set(key, cb.editor.value));
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
        const text = p.text.replace('{lang}', { fa: 'Persian', de: 'German', en: 'English' }[lang]).replace('{lesson}', String(L.n));
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
                else if (b.type === 'B.parsons') answer = '<pre dir="ltr">' + esc(it.solution.map(k => it.lines[k]).join('\n')) + '</pre>';
                else if (b.type === 'B.explain') answer = h(it.model[lang]);
                else answer = '<details><summary>' + esc(U.solution) + '</summary><pre dir="ltr">' + esc(it.solution) + '</pre></details>';
                rows += '<tr><td>' + (i === 0 ? esc(bandLetter[b.id]) : '') + '</td><td>' + (i + 1) + '</td><td>' + answer + '</td><td>' + h(it.why[lang]) + '</td></tr>';
            }));
            t.innerHTML = '<thead><tr><th>' + esc(U.exercise) + '</th><th>' + esc(U.question) + '</th><th>' + esc(U.answer) + '</th><th>' + esc(U.why) + '</th></tr></thead><tbody>' + rows + '</tbody>';
            return [t];
        }
        return [];
    }

    // ---------- page ----------
    function langSwitch() {
        const nav = el('nav', 'np-langs');
        nav.innerHTML = icon('languages') + LANGS.map(l => l === lang ? '<strong lang="' + l + '">' + esc(N.registry.languageNames[l]) + '</strong>'
            : '<a lang="' + l + '" href="' + esc(href(lessonId, l)) + '">' + esc(N.registry.languageNames[l]) + '</a>').join(' · ');
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => store.set('lang', a.lang)));
        return nav;
    }

    function render() {
        const root = document.getElementById('lesson');
        const head = document.getElementById('site-head');
        head.appendChild(langSwitch());
        if (!L || !L.unit) { root.appendChild(el('p', '', esc(U.planned))); return; }
        const cat = L.catalog, ch = ix.chapter[L.chapter];
        const title = cat.title[lang] + (lang !== 'en' ? ' — ' + cat.title.en : '');
        document.title = U.lesson + ' ' + L.n + ': ' + cat.title[lang] + ' — Nullpunkt';
        const status = ch.catalog.langStatus[lang];
        root.appendChild(el('p', 'np-crumb', esc(U.chapter) + ' ' + ch.n + ': ' + esc(ch.catalog.title[lang]) + ' · ' + cat.minutes + ' ' + esc(U.minutes) +
            (status !== 'reviewed' ? ' · <span class="np-badge">' + esc(U.inDevelopment) + '</span>' : '')));
        root.appendChild(el('h1', '', esc(U.lesson) + ' ' + L.n + ': ' + esc(title)));

        L.unit.blocks.forEach(b => {
            const def = reg.blocks[b.block];
            const sec = el('section', 'np-block np-block-' + b.block);
            sec.id = b.block;
            sec.appendChild(el('h2', '', icon(def.icon) + '<span>' + esc(def.title[lang]) + (b.subtitle ? ': ' + h(b.subtitle[lang]) : '') + '</span>'));
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
        if (prev) nav.appendChild(prev.unit ? el('a', '', icon('chevron-left', 'np-flip') + esc(U.prev)) : el('span', 'np-meta', esc(U.prev)));
        if (next) {
            const n = next.unit ? el('a', '', esc(U.next) + icon('chevron-right', 'np-flip')) : el('span', 'np-meta', esc(U.next) + ': ' + esc(U.planned));
            if (next.unit) n.href = href(next.id);
            nav.appendChild(n);
        }
        if (prev && prev.unit) nav.firstChild.href = href(prev.id);
        root.appendChild(nav);
    }

    render();
    store.set('lang', lang);
})();

/* Runner lab (tools/runner-lab/): editor, prepared/interactive stdin, run/stop, diagnostics and the lab table.
   A developer page for checking the in-browser runner in any browser; not part of the course. */
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const code = $('code'), gutter = $('gutter'), out = $('console'), status = $('status'), diags = $('diags');
    const TIMEOUT_MS = 5000;
    let runner = null, busy = false, lang = 'en', labRows = [];

    try { lang = localStorage.getItem('clab.lang') || 'en'; } catch (e) { /* storage may be blocked */ }
    $('lang').value = lang;
    const t = (key, vars) => {
        let s = (CMessages[lang] || CMessages.en)[key] || CMessages.en[key] || key;
        for (const k in (vars || {})) s = s.replace('{' + k + '}', vars[k]);
        return s;
    };
    $('lang').onchange = function () {
        lang = this.value;
        try { localStorage.setItem('clab.lang', lang); } catch (e) { /* ignore */ }
    };

    // ---------- editor ----------
    function updateGutter() {
        const n = code.value.split('\n').length;
        let s = '';
        for (let i = 1; i <= n; i++) s += i + '\n';
        gutter.textContent = s;
    }
    code.addEventListener('input', updateGutter);
    code.addEventListener('scroll', () => { gutter.scrollTop = code.scrollTop; });
    code.addEventListener('keydown', e => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            const s = code.selectionStart;
            code.setRangeText('    ', s, code.selectionEnd, 'end');
            updateGutter();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
    });
    function selectLine(line) {
        const lines = code.value.split('\n');
        let start = 0;
        for (let i = 0; i < line - 1 && i < lines.length; i++) start += lines[i].length + 1;
        code.focus();
        code.setSelectionRange(start, start + (lines[line - 1] || '').length);
        code.scrollTop = Math.max(0, (line - 4) * parseFloat(getComputedStyle(code).lineHeight));
    }

    // ---------- samples ----------
    const sel = $('sample');
    CLab.forEach((p, i) => {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = p.id;
        sel.appendChild(o);
    });
    sel.onchange = () => loadSample(+sel.value);
    function loadSample(i) {
        code.value = CLab[i].source;
        $('stdin').value = CLab[i].stdin || '';
        updateGutter();
        clearOutput();
    }

    // ---------- console ----------
    function clearOutput() { out.textContent = ''; diags.textContent = ''; status.textContent = ''; status.className = 'status'; }
    function write(text, cls) {
        const span = document.createElement('span');
        if (cls) span.className = cls;
        span.textContent = text;
        out.appendChild(span);
        out.scrollTop = out.scrollHeight;
    }
    function note(text, cls) { write((out.textContent && !out.textContent.endsWith('\n') ? '\n' : '') + text + '\n', 'note ' + (cls || '')); }
    function setStatus(text, cls) { status.textContent = text; status.className = 'status ' + (cls || ''); }

    /** Interactive input: an inline field at the end of the console; resolves with the line or null (Ctrl+D). */
    function askLine() {
        setStatus(t('waiting'), 'wait');
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.className = 'stdin-line';
            input.placeholder = t('inputPlaceholder');
            input.setAttribute('aria-label', 'stdin');
            out.appendChild(input);
            input.focus();
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const v = input.value;
                    input.replaceWith(Object.assign(document.createElement('span'), { className: 'echo', textContent: v + '\n' }));
                    setStatus(t('running'));
                    resolve(v + '\n');
                } else if (e.key === 'd' && e.ctrlKey) {
                    e.preventDefault();
                    input.replaceWith(Object.assign(document.createElement('span'), { className: 'echo', textContent: '^D\n' }));
                    setStatus(t('running'));
                    resolve(null);
                }
            });
        });
    }

    function describeEnd(r) {
        if (r.stopped) return [t('stopped'), 'warn'];
        if (r.timedOut) return [t('timedOut', { s: TIMEOUT_MS / 1000 }), 'error'];
        if (r.error) return [t('runtime-error', { message: r.error.split('\n')[0] }), 'error'];
        if (r.trap) return [t(r.trap, { message: r.trapMessage || '' }), 'error'];
        return [t('exit', { code: r.exitCode }), r.exitCode === 0 ? 'ok' : 'warn'];
    }

    // ---------- run ----------
    async function run() {
        if (!runner || busy) return;
        busy = true;
        $('run').disabled = true;
        $('stop').disabled = runner.mode !== 'worker';
        clearOutput();
        setStatus(t('compiling'));
        const interactive = document.querySelector('input[name=stdinMode]:checked').value === 'interactive' && runner.jspi;
        const r = await runner.run(code.value, {
            stdin: $('stdin').value,
            onInput: interactive ? askLine : null,
            onOutput: (text, isErr) => write(text, isErr ? 'stderr' : ''),
            timeoutMs: TIMEOUT_MS,
        });
        const left = out.querySelector('input.stdin-line');
        if (left) left.remove();
        if (r.stage === 'compile' && !r.ok) {
            setStatus(t('compileError'), 'error');
            write(r.compileLog, 'stderr');
            (r.diagnostics || []).forEach(d => {
                const li = document.createElement('li');
                li.textContent = 'line ' + d.line + (d.col ? ':' + d.col : '') + ' — ' + d.message;
                li.className = /^warning/.test(d.message) ? 'warn' : 'error';
                li.onclick = () => selectLine(d.line);
                diags.appendChild(li);
            });
        } else {
            if (r.compileLog) (r.diagnostics || []).forEach(d => {
                const li = document.createElement('li');
                li.textContent = 'line ' + d.line + ' — ' + d.message;
                li.className = 'warn';
                li.onclick = () => selectLine(d.line);
                diags.appendChild(li);
            });
            const [msg, cls] = describeEnd(r);
            note(msg, cls);
            setStatus(t('compiled') + ' ' + (r.compileMs || 0).toFixed(0) + ' ms · run ' +
                (r.runMs != null ? r.runMs.toFixed(0) + ' ms' : '—'), cls);
        }
        busy = false;
        $('run').disabled = false;
        $('stop').disabled = true;
    }
    $('run').onclick = run;
    $('stop').onclick = async () => { if (runner) await runner.stop(); };

    // ---------- lab ----------
    async function runLab() {
        if (!runner || busy) return;
        busy = true;
        $('runLab').disabled = $('run').disabled = true;
        const tbody = $('labTable').tBodies[0];
        tbody.textContent = '';
        labRows = [];
        for (let i = 0; i < CLab.length; i++) {
            const p = CLab[i];
            const tr = tbody.insertRow();
            tr.innerHTML = '<td>' + (i + 1) + '</td><td></td><td>…</td><td></td><td></td>';
            tr.cells[1].textContent = p.id;
            let stdout = '';
            const t0 = performance.now();
            const r = await runner.run(p.source, {
                stdin: p.stdin, timeoutMs: p.timeout ? 2000 : 10000,
                onOutput: (text, isErr) => { if (!isErr) stdout += text; },
            });
            const v = CLabCheck(p, r, stdout);
            const ms = performance.now() - t0;
            tr.cells[2].textContent = v.pass ? 'PASS' : 'FAIL';
            tr.className = v.pass ? 'pass' : 'fail';
            tr.cells[3].textContent = v.got + (p.note ? ' — ' + p.note : '');
            tr.cells[4].textContent = ms.toFixed(0);
            labRows.push({ id: p.id, pass: v.pass, got: v.got, ms: Math.round(ms) });
        }
        const passed = labRows.filter(r => r.pass).length;
        $('labJson').textContent = JSON.stringify({ env: envInfo(), passed, total: labRows.length, rows: labRows });
        document.body.dataset.lab = 'done';
        $('runLab').disabled = $('run').disabled = false;
        $('copyLab').disabled = false;
        busy = false;
    }
    $('runLab').onclick = runLab;
    $('copyLab').onclick = () => {
        const e = envInfo();
        const lines = ['**Lab** — ' + labRows.filter(r => r.pass).length + '/' + labRows.length + ' passed · ' +
            e.browser + ' · mode ' + e.mode + ' · JSPI ' + (e.jspi ? 'yes' : 'no') + ' · ' + e.protocol, '',
            '| # | Program | Result | What happened | ms |', '|---|---|---|---|---|'];
        labRows.forEach((r, i) => lines.push('| ' + (i + 1) + ' | ' + r.id + ' | ' + (r.pass ? 'PASS' : 'FAIL') + ' | ' +
            r.got.replace(/\|/g, '\\|') + ' | ' + r.ms + ' |'));
        navigator.clipboard.writeText(lines.join('\n')).then(() => { $('copyLab').textContent = 'Copied ✓'; },
            () => { $('labJson').hidden = false; });
    };

    function envInfo() {
        const ua = navigator.userAgent;
        const m = ua.match(/(Firefox|Edg|OPR|Chrome|Version)\/(\d+)/);
        let browser = m ? (m[1] === 'Edg' ? 'Edge' : m[1] === 'Version' ? 'Safari' : m[1]) + ' ' + m[2] : ua;
        if (/Safari/.test(ua) && !/Chrome|Firefox/.test(ua) && m && m[1] === 'Version') browser = 'Safari ' + m[2];
        return { browser, mode: runner && runner.mode, jspi: !!(runner && runner.jspi), protocol: location.protocol,
            workerError: runner && runner.workerError };
    }

    // ---------- start ----------
    (async function start() {
        loadSample(0);
        const t0 = performance.now();
        try {
            runner = await CRunner.create({ bundle: window.WccBundle, inline: /[?&]inline\b/.test(location.search) });
        } catch (e) {
            $('env').innerHTML = '';
            $('env').append(Object.assign(document.createElement('span'), { className: 'chip bad', textContent: 'compiler failed: ' + e.message }));
            return;
        }
        const e = envInfo(), env = $('env');
        env.textContent = '';
        const chip = (text, cls, title) => env.appendChild(Object.assign(document.createElement('span'), { className: 'chip ' + (cls || ''), textContent: text, title: title || '' }));
        chip('ready in ' + (performance.now() - t0).toFixed(0) + ' ms', 'ok');
        chip(e.browser);
        chip(e.protocol.replace(':', ''));
        chip(e.mode === 'worker' ? 'Worker ✓ (Stop works)' : 'no Worker — runs on the page', e.mode === 'worker' ? 'ok' : 'warn', e.workerError || '');
        chip(e.jspi ? 'JSPI ✓ (interactive input)' : 'no JSPI — prepared input only', e.jspi ? 'ok' : 'warn');
        if (!e.jspi) { $('modeInteractive').disabled = true; $('jspiNote').textContent = '(needs JSPI)'; }
        else document.querySelector('input[value=interactive]').checked = true;
        $('run').disabled = $('runLab').disabled = false;
        if (/[?&]lab\b/.test(location.search)) runLab();
    })();
})();

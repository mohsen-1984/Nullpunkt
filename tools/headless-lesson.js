#!/usr/bin/env node
/**
 * Open every written lesson in headless Chrome from file://, in every language, and use it as a learner would:
 * run the worked example, solve each auto-checked exercise with its model solution and check that the page accepts it,
 * and submit a wrong answer to see that it is rejected. Fails on any page error.
 *
 *   node tools/headless-lesson.js [--shots <dir>]     (--shots saves a full-page screenshot per lesson and language)
 * Needs google-chrome (or CHROME=path) and Node 22+.
 */
'use strict';
const cp = require('child_process'), path = require('path'), http = require('http'), fs = require('fs');
const root = path.join(__dirname, '..');
const Data = require(path.join(root, 'lib/Data.js'));
const N = Data.loadNode(root);
const lessons = Object.values(N.index.lesson).filter(L => L.unit).map(L => L.id);
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > 0 ? process.argv[shotsAt + 1] : null;

const port = 9800 + Math.floor(Math.random() * 500);
const chrome = cp.spawn(process.env.CHROME || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-first-run', '--window-size=1100,900', '--remote-debugging-port=' + port, '--user-data-dir=/tmp/np-lesson-' + port, 'about:blank'],
    { stdio: ['ignore', 'ignore', 'pipe'] });
chrome.on('error', e => { console.error('cannot start Chrome:', e.message); process.exit(1); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJson = u => new Promise((res, rej) => http.get(u, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej));

// runs inside the page: returns a report of what worked
const PROBE = `(async () => {
    const wait = async (f, ms) => { for (let i = 0; i < ms / 50; i++) { const v = f(); if (v) return v; await new Promise(r => setTimeout(r, 50)); } return null; };
    // the first page in a fresh browser can take longer than the fixed pause: wait until the page has mounted
    await wait(() => window.NullpunktChrome && NullpunktChrome.ready, 20000);
    const N = window.Nullpunkt, ix = NullpunktData.index(N);
    const L = ix.lesson[new URLSearchParams(location.search).get('lesson')];
    const rep = { h1: document.querySelector('h1').textContent, blocks: document.querySelectorAll('.np-block').length, ok: [], bad: [] };
    // worked example (orientation lessons have none)
    const ex = document.querySelector('#example .np-code');
    if (ex) {
    ex.querySelector('.np-btn.primary').click();
    // an example may show a compile error on purpose (lesson 2): then the compiler's message must appear instead
    const exCode = ix.code[(L.unit.blocks.find(b => b.block === 'example').content.find(n => n.type === 'code') || {}).ref];
    const exOk = !exCode || exCode.intent === 'ok';
    const out = await wait(() => (exOk ? /exit code 0/ : /main[.]c[(][0-9]+[)]/).test(ex.querySelector('.np-out').textContent) && ex.querySelector('.np-out').textContent, 20000);
    (out ? rep.ok : rep.bad).push(exOk ? 'example runs' : 'example shows its compile error');
    }
    // assembly beside the C code, where a lesson shows it
    document.querySelectorAll('.np-asm-pre').forEach(p => (p.textContent.indexOf('ret') >= 0 && p.textContent.indexOf('call') >= 0 ? rep.ok : rep.bad).push('assembly shown'));
    // exercises
    for (const b of L.unit.bands) {
        for (const it of b.items) {
            const itemEl = [...document.querySelectorAll('#' + CSS.escape(b.id) + ' .np-item')][b.items.indexOf(it)];
            const check = [...itemEl.querySelectorAll('.np-btn')].find(x => x.querySelector('.np-icon') && x.textContent.trim() && !x.disabled && x.classList.contains('primary') && !/^(Run|Ausführen|اجرا)$/.test(x.textContent.trim()));
            if (b.type === 'B.write' || b.type === 'B.fix') {
                const ed = itemEl.querySelector('.np-editor').npEditor;
                // a wrong answer first: the starter or the broken code must not pass
                ed.value = b.type === 'B.fix' ? ix.code[it.broken].source : it.starter;
                check.click();
                const v1 = await wait(() => itemEl.querySelector('.np-result .np-verdict'), 20000);
                (v1 && !v1.classList.contains('ok') ? rep.ok : rep.bad).push(it.id + ' rejects the start code');
                ed.value = it.solution;
                itemEl.querySelector('.np-result').innerHTML = '';
                check.click();
                const v2 = await wait(() => itemEl.querySelector('.np-result .np-verdict'), 20000);
                (v2 && v2.classList.contains('ok') ? rep.ok : rep.bad).push(it.id + ' accepts the model solution');
            } else if (b.type === 'B.choice') {
                // a wrong option shows its feedback and does not finish the item; the right one does
                const radios = [...itemEl.querySelectorAll('input[type=radio]')];
                const wrong = it.options.findIndex(o => !o.correct), right = it.options.findIndex(o => o.correct);
                radios[wrong].click();
                const v1 = itemEl.querySelector('.np-result .np-verdict');
                (v1 && v1.classList.contains('warn') && !itemEl.classList.contains('np-done') ? rep.ok : rep.bad).push(it.id + ' answers a wrong choice');
                radios[right].click();
                const v2 = itemEl.querySelector('.np-result .np-verdict');
                (v2 && v2.classList.contains('ok') && itemEl.classList.contains('np-done') ? rep.ok : rep.bad).push(it.id + ' accepts the right choice');
            } else if (b.type === 'B.predict') {
                const g = itemEl.querySelector('.np-guess');
                g.value = ix.generated.code[it.code].gcc.stdout;
                check.click();
                const v = await wait(() => itemEl.querySelector('.np-result .np-verdict'), 5000);
                (v && v.classList.contains('ok') ? rep.ok : rep.bad).push(it.id + ' accepts the right prediction');
            } else if (b.type === 'B.parsons') {
                check.click();
                const v1 = await wait(() => itemEl.querySelector('.np-result .np-verdict'), 20000);
                (v1 && !v1.classList.contains('ok') ? rep.ok : rep.bad).push(it.id + ' rejects the shuffled order');
                // move lines into the solution order with the buttons
                for (let pos = 0; pos < it.solution.length; pos++) {
                    for (let guard = 0; guard < 10; guard++) {
                        const lis = [...itemEl.querySelectorAll('.np-parsons li')];
                        const want = it.lines[it.solution[pos]];
                        const at = lis.findIndex(li => li.querySelector('code').textContent === want);
                        if (at === pos) break;
                        lis[at].querySelector('.np-up').click();
                    }
                }
                itemEl.querySelector('.np-result').innerHTML = '';
                check.click();
                const v2 = await wait(() => itemEl.querySelector('.np-result .np-verdict'), 20000);
                (v2 && v2.classList.contains('ok') ? rep.ok : rep.bad).push(it.id + ' accepts the right order');
            }
        }
    }
    rep.key = document.querySelectorAll('#key tbody tr').length;
    rep.cm = !!window.NullpunktCM && document.querySelectorAll('.cm-editor').length;
    if (window.NullpunktCM) { const toks = new Set([...document.querySelectorAll('[class*="np-tok-"]')].map(e => e.className)); rep.toks = [...toks].sort().join(' '); if (!toks.size && document.querySelector('.cm-editor, .np-code-pre')) rep.bad.push('no syntax highlighting'); }
    const de = document.documentElement;
    if (de.scrollWidth > de.clientWidth + 1) {
        const wide = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().width > de.clientWidth + 1).slice(-3).map(e => e.tagName + '.' + e.className);
        rep.bad.push('page is wider than the window (' + de.scrollWidth + ' > ' + de.clientWidth + '): ' + wide.join(', '));
    }
    rep.terms = document.querySelectorAll('#terms dt').length;
    return JSON.stringify(rep);
})()`;

(async function () {
    let targets;
    for (let i = 0; i < 150 && !(targets && targets.some(t => t.type === 'page')); i++) {
        try { targets = await getJson('http://127.0.0.1:' + port + '/json'); } catch (e) { /* not up yet */ }
        if (!(targets && targets.some(t => t.type === 'page'))) await sleep(200);
    }
    const page = targets && targets.find(t => t.type === 'page');
    if (!page) { console.error('Chrome did not open a page'); chrome.kill(); process.exit(1); }
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0;
    const waiting = new Map(), errors = [];
    ws.onmessage = ev => {
        const m = JSON.parse(ev.data);
        if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m.result || m.error); waiting.delete(m.id); }
        if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
        if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
    };
    await new Promise(r => { ws.onopen = r; });
    const send = (method, params) => new Promise(r => { const i = ++id; waiting.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    await send('Runtime.enable');
    await send('Page.enable');
    let failed = false;
    for (const lesson of lessons) {
        for (const lang of N.registry.languages) {
            errors.length = 0;
            const url = 'file://' + path.join(root, 'lesson.html') + '?lesson=' + lesson + '&lang=' + lang;
            await send('Page.navigate', { url });
            await sleep(1500);
            const res = await send('Runtime.evaluate', { expression: PROBE, awaitPromise: true, returnByValue: true });
            let rep;
            try { rep = JSON.parse(res.result.value); } catch (e) { rep = { bad: ['probe failed: ' + JSON.stringify(res.exceptionDetails || res).slice(0, 400)], ok: [] }; }
            const bad = rep.bad.concat(errors.map(e => 'page error: ' + e));
            console.log((bad.length ? 'FAIL ' : 'PASS ') + lesson + ' ' + lang + ' — ' + rep.ok.length + ' checks passed, ' + rep.blocks + ' blocks, ' +
                rep.key + ' answer-key rows, ' + rep.terms + ' terms, ' + (rep.cm || 0) + ' editors · ' + rep.h1);
            bad.forEach(b => console.log('     ' + b));
            if (rep.toks) console.log('     tokens: ' + rep.toks);
            if (bad.length) failed = true;
            if (shots) {
                fs.mkdirSync(shots, { recursive: true });
                const m = await send('Page.getLayoutMetrics');
                const h = Math.ceil(m.cssContentSize ? m.cssContentSize.height : m.contentSize.height);
                await send('Emulation.setDeviceMetricsOverride', { width: 1100, height: h, deviceScaleFactor: 1, mobile: false });
                const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
                fs.writeFileSync(path.join(shots, lesson + '-' + lang + '.png'), Buffer.from(shot.data, 'base64'));
                await send('Emulation.clearDeviceMetricsOverride');
            }
        }
    }
    ws.close();
    chrome.kill();
    process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });

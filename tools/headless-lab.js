#!/usr/bin/env node
/**
 * Runs the page's lab in headless Chrome (DevTools protocol, no extra packages) and prints the result.
 *   node tools/headless-lab.js [url]        default: file://<repo>/tools/runner-lab/index.html?lab
 * Exits 1 if the lab does not finish or any program fails.
 *   INTERACTIVE=1 node tools/headless-lab.js   types into the 10-input sample line by line (JSPI)
 * Needs google-chrome (or CHROME=path) and Node 22+ (global WebSocket).
 */
'use strict';
const cp = require('child_process'), path = require('path'), http = require('http');
const url = process.argv[2] || 'file://' + path.join(__dirname, 'runner-lab', 'index.html') + (process.env.INTERACTIVE ? '' : '?lab');
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = cp.spawn(process.env.CHROME || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + port, '--user-data-dir=/tmp/clab-chrome-' + port, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJson = u => new Promise((res, rej) => http.get(u, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej));

(async function () {
    let targets;
    for (let i = 0; i < 50; i++) { try { targets = await getJson('http://127.0.0.1:' + port + '/json'); break; } catch (e) { await sleep(200); } }
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0;
    const waiting = new Map(), logs = [];
    ws.onmessage = ev => {
        const m = JSON.parse(ev.data);
        if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m.result); waiting.delete(m.id); }
        if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.type + ': ' + m.params.args.map(a => a.value).join(' '));
        if (m.method === 'Runtime.exceptionThrown') logs.push('exception: ' + JSON.stringify(m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description || m.params.exceptionDetails.text));
    };
    await new Promise(r => { ws.onopen = r; });
    const send = (method, params) => new Promise(r => { const i = ++id; waiting.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    const evaluate = async expr => ((await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result || {}).value;
    await send('Runtime.enable');
    await send('Page.navigate', { url });
    if (process.env.INTERACTIVE) {
        // drive the 10-input sample by typing into the console's input line, as a learner would
        await sleep(1500);
        const res = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
            const sel = document.getElementById('sample');
            sel.value = [...sel.options].findIndex(o => o.textContent === '10-input'); sel.onchange();
            document.getElementById('run').click();
            const lines = ['2', '40', '2', 'Mohsen'];
            for (const v of lines) {
                let inp; for (let i = 0; i < 100 && !(inp = document.querySelector('input.stdin-line')); i++) await new Promise(r => setTimeout(r, 50));
                if (!inp) return 'no input line appeared before ' + v;
                inp.value = v; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            }
            await new Promise(r => setTimeout(r, 800));
            return document.getElementById('console').textContent + ' [status] ' + document.getElementById('status').textContent;
        })()` });
        const out = res.result && res.result.value;
        console.log(out, res.exceptionDetails ? JSON.stringify(res.exceptionDetails).slice(0, 500) : "");
        const ok = typeof out === 'string' && out.includes('Hi Mohsen!') && out.includes('Sum = 42');
        ws.close(); chrome.kill(); process.exit(ok ? 0 : 1);
    }
    const t0 = Date.now();
    let done = false, failed = true;
    while (Date.now() - t0 < 120000) {
        await sleep(500);
        if (await evaluate('document.body && document.body.dataset.lab') === 'done') { done = true; break; }
    }
    const chips = await evaluate('[...document.querySelectorAll("#env .chip")].map(c => c.textContent + (c.title ? " [" + c.title + "]" : "")).join(" | ")');
    console.log('env:', chips);
    if (done) {
        const j = JSON.parse(await evaluate('document.getElementById("labJson").textContent'));
        console.log(j.passed + '/' + j.total + ' passed', JSON.stringify(j.env));
        j.rows.forEach(r => console.log(r.pass ? 'PASS' : 'FAIL', r.id.padEnd(28), r.got, r.ms + ' ms'));
        failed = j.passed !== j.total;
    } else console.log('lab did not finish');
    if (logs.length) console.log('console:\n  ' + logs.join('\n  '));
    ws.close();
    chrome.kill();
    process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });

#!/usr/bin/env node
/**
 * Sweep the site shell in headless Chrome from file://: the home page and a lesson, in every language, at widths from
 * 1600 to 320 px, at the top and in the middle of the page. At each stop it runs NullpunktChrome.checks() (the
 * navigation chrome v2 self-checks plus the rail's) and fails on any ✗ or page error. Then it uses the drawer and the
 * search as a reader would: opens the menu at a narrow width, searches "printf" and follows the first result.
 *
 *   node tools/headless-shell.js [--shots <dir>]   (--shots: README screenshots, 1280 × 800, one per language)
 * Needs google-chrome (or CHROME=path) and Node 22+.
 */
'use strict';
const cp = require('child_process'), path = require('path'), http = require('http'), fs = require('fs');
const root = path.join(__dirname, '..');
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > 0 ? process.argv[shotsAt + 1] : null;
const LANGS = ['en', 'de', 'fa'];
const WIDTHS = [1600, 1366, 1180, 1100, 1024, 900, 820, 768, 640, 560, 480, 414, 390, 360, 320];
const PAGES = [['home', 'index.html?'], ['lesson', 'lesson.html?lesson=C.L02&']];

const port = 9300 + Math.floor(Math.random() * 500);
const chrome = cp.spawn(process.env.CHROME || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars',
    '--no-first-run', '--window-size=1280,800', '--remote-debugging-port=' + port, '--user-data-dir=/tmp/np-shell-' + port, 'about:blank'],
    { stdio: ['ignore', 'ignore', 'pipe'] });
chrome.on('error', e => { console.error('cannot start Chrome:', e.message); process.exit(1); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJson = u => new Promise((res, rej) => http.get(u, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej));

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
    const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result ? r.result.value : undefined; };
    const size = (w, h) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h || 800, deviceScaleFactor: 1, mobile: w < 600 });
    await send('Runtime.enable');
    await send('Page.enable');
    const go = async url => {
        await send('Page.navigate', { url: 'file://' + path.join(root, url) });
        await sleep(600);
        for (let i = 0; i < 60 && !(await ev('!!(window.NullpunktChrome && NullpunktChrome.ready)')); i++) await sleep(250);
    };
    let failed = 0, runs = 0;

    for (const [name, url] of PAGES) for (const lang of LANGS) {
        errors.length = 0;
        await size(1280);
        await go(url + 'lang=' + lang);
        for (const w of WIDTHS) {
            await size(w);
            await sleep(140);
            for (const at of ['top', 'middle']) {
                await ev(at === 'top' ? 'scrollTo(0, 0)' : 'scrollTo(0, document.documentElement.scrollHeight / 2)');
                await sleep(at === 'top' ? 80 : 260);
                const res = await ev('JSON.stringify(NullpunktChrome.checks())');
                runs++;
                const bad = res ? JSON.parse(res).filter(c => c.ok === false).map(c => c.name) : ['checks did not run'];
                if (bad.length) { failed++; console.log('FAIL ' + name + ' ' + lang + ' ' + w + 'px ' + at + ': ' + bad.join('; ')); }
            }
        }
        // the drawer at a phone width: opens, holds the course, closes with Esc
        await size(390);
        await sleep(150);
        const dr = await ev(`(async () => {
            const b = document.getElementById('ncMenu'); if (getComputedStyle(b).display === 'none') return 'no menu button';
            b.click(); await new Promise(r => setTimeout(r, 400));
            const d = document.getElementById('ncDrawer');
            if (!d.classList.contains('is-open')) return 'drawer did not open';
            if (!d.querySelector('.np-tree')) return 'no course in the drawer';
            if (!d.contains(document.activeElement)) return 'focus not in the drawer';
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await new Promise(r => setTimeout(r, 400));
            return d.classList.contains('is-open') ? 'Esc did not close it' : 'ok';
        })()`);
        if (dr !== 'ok') { failed++; console.log('FAIL ' + name + ' ' + lang + ' drawer: ' + dr); }
        // the logo's card at a phone width: a tap opens it inside the screen, Esc closes it (S00-assets: the mark)
        const mk = await ev(`(async () => {
            const b = document.getElementById('ncMark'), t = document.getElementById('ncMarkTip');
            b.click(); await new Promise(r => setTimeout(r, 250));
            const r = t.getBoundingClientRect();
            if (getComputedStyle(t).display === 'none' || !t.textContent) return 'the card did not open';
            if (r.left < 0 || r.right > innerWidth) return 'the card leaves the screen';
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
            return getComputedStyle(t).display === 'none' ? 'ok' : 'Esc did not close it';
        })()`);
        if (mk !== 'ok') { failed++; console.log('FAIL ' + name + ' ' + lang + ' logo card: ' + mk); }
        // search: "/" opens it, a query finds lessons, the first result opens its page at its section
        await size(1280);
        await sleep(150);
        const sr = await ev(`(async () => {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
            await new Promise(r => setTimeout(r, 200));
            const d = document.getElementById('ncSearch'); if (!d || !d.open) return 'search did not open';
            const i = document.getElementById('ncSearchInput'); i.value = 'printf'; i.dispatchEvent(new Event('input'));
            await new Promise(r => setTimeout(r, 250));
            const n = d.querySelectorAll('.np-sr').length; if (n < 3) return 'only ' + n + ' results';
            return 'ok:' + d.querySelector('.np-sr').getAttribute('href');
        })()`);
        if (!/^ok:/.test(sr || '')) { failed++; console.log('FAIL ' + name + ' ' + lang + ' search: ' + sr); }
        if (errors.length) { failed++; console.log('FAIL ' + name + ' ' + lang + ' page errors: ' + errors.join(' | ')); }
        else console.log('ok   ' + name + ' ' + lang + ' — ' + WIDTHS.length * 2 + ' stops, drawer, logo card, search → ' + String(sr).slice(3));
    }

    if (shots) {
        fs.mkdirSync(shots, { recursive: true });
        for (const lang of LANGS) {
            await size(1280, 800);
            await go('lesson.html?lesson=C.L03&lang=' + lang + '#example');
            await ev(`(async () => { const b = document.querySelector('#example .np-btn.primary'); if (b) b.click(); await new Promise(r => setTimeout(r, 2500)); NullpunktChrome.goTo('example'); await new Promise(r => setTimeout(r, 500)); })()`);
            const shot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(shots, 'lesson-' + lang + '.png'), Buffer.from(shot.data, 'base64'));
        }
        console.log('screenshots in ' + shots);
    }
    console.log(runs + ' layout stops, ' + failed + ' failure(s)');
    ws.close();
    chrome.kill();
    process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });

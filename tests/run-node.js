#!/usr/bin/env node
/**
 * Runs the lab in Node with the same engine the page uses (inline, synchronous stdin).
 *   node tests/run-node.js            (the endless-loop case is skipped: Node has no Worker time limit here)
 */
'use strict';
const path = require('path'), fs = require('fs');
const root = path.join(__dirname, '..');
const WasiShimFactory = require(path.join(root, 'lib/WasiShim.js'));
const CRunner = require(path.join(root, 'lib/CRunner.js'));
const bundleFile = fs.readdirSync(path.join(root, 'vendor/wcc')).find(f => /^wcc_.*\.js$/.test(f));
const bundle = require(path.join(root, 'vendor/wcc', bundleFile));
const lab = require(path.join(root, 'tests/lab.js'));
const check = require(path.join(root, 'tests/check.js'));

(async function () {
    const t0 = Date.now();
    const engine = CRunner.engineFactory(WasiShimFactory, bundle);
    console.log('engine ready in', Date.now() - t0, 'ms');
    let pass = 0, total = 0;
    for (const t of lab) {
        if (t.timeout) { console.log('SKIP', t.id, '(needs the Worker time limit — checked in the browser)'); continue; }
        total++;
        const c = engine.compile(t.source);
        let r = { stage: 'compile', ok: c.ok, diagnostics: c.diagnostics, compileLog: c.log }, out = '';
        if (c.ok) {
            const run = await engine.run(c.wasm, { stdin: t.stdin, onOutput: (s, e) => { if (!e) out += s; } });
            r = Object.assign(r, { stage: 'run', ok: run.trap == null && run.exitCode === 0, exitCode: run.exitCode,
                trap: run.trap, trapMessage: run.trapMessage });
        }
        const v = check(t, r, out);
        if (v.pass) pass++;
        console.log(v.pass ? 'PASS' : 'FAIL', t.id.padEnd(28), v.got, c.ok ? '(' + c.ms.toFixed(0) + ' ms compile)' : '');
        if (!v.pass && t.kind === 'run' && c.ok) {
            console.log('  expected:', JSON.stringify(t.expect));
            console.log('  got:     ', JSON.stringify(out));
        }
    }
    console.log(pass + '/' + total + ' passed');
    process.exit(pass === total ? 0 : 1);
})();

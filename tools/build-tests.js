#!/usr/bin/env node
/**
 * Build tests/lab.js — the lab programs (tests/programs/*.c) with their expected results, as a classic script
 * (window.CLab) so the page can run the same lab from file://.
 *
 *   node tools/build-tests.js            write tests/lab.js
 *   node tools/build-tests.js --check    exit 1 if tests/lab.js differs from what gcc gives now (CI)
 *
 * Expected output of a normal program comes from the PC's own gcc (native build, same stdin): the browser run must
 * print exactly what a real compiler's program prints. Error and runtime cases carry hand-written expectations.
 *
 * Name prefix → kind:  0x–1x run (stdout must equal gcc's), 20–29 compile error (line must match),
 *                      30–39 runtime (trap / timeout / exit code), 16 platform probe (wasm32 sizes).
 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');

const dir = path.join(__dirname, '..', 'tests', 'programs');
const STDIN = { '10-input.c': '3\n4\n5\n6\nMohsen\n', '18-scanf.c': '12 4.5\n B\nrow by the window\n1 2\n' };
// Known XCC gaps (C00-conventions, C.XCC.01): the program is correct C and gcc runs it, but XCC does not yet.
// The lab expects these to fail; once XCC is fixed upstream, the check reports it so the gap can be removed.
const KNOWN_GAP = {
    '02-types.c': 'INT_MIN in limits.h is a long long on wasm32',
    '07-pointers.c': '%td is not supported by printf',
    '14-c99-c11.c': '_Static_assert is not supported',
};
const HAND = {
    '16-sizes-wasm32.c': { kind: 'run', expect: 'long=4 pointer=4 long long=8 long double=8\n',
        note: 'wasm32: long and pointers are 4 bytes (8 on a 64-bit PC)' },
    '20-err-undeclared.c': { kind: 'compile-error', line: 6 },
    '21-err-missing-semicolon.c': { kind: 'compile-error', line: 5 },
    '22-err-types.c': { kind: 'compile-error', line: 4 },
    '30-rt-null.c': { kind: 'runtime', trap: 'null-write',
        note: 'gcc on Linux: Segmentation fault. In wasm address 0 is ordinary memory, so only the NULL guard (writes) catches it.' },
    '31-rt-div0.c': { kind: 'runtime', trap: 'divide-by-zero' },
    '32-rt-recursion.c': { kind: 'runtime', trap: 'stack-overflow' },
    '33-rt-endless.c': { kind: 'runtime', timeout: true },
    '34-rt-exit.c': { kind: 'runtime', exitCode: 3, expect: 'exiting with 3\n' },
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'clab-'));
const lab = [];
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.c')).sort()) {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const entry = Object.assign({ id: file.replace(/\.c$/, ''), source, stdin: STDIN[file] || '' }, HAND[file] || { kind: 'run' });
    if (KNOWN_GAP[file]) entry.knownGap = KNOWN_GAP[file];
    if (entry.kind === 'run' && entry.expect == null) {
        const exe = path.join(tmp, entry.id), work = path.join(tmp, entry.id + '.d');
        fs.mkdirSync(work);
        cp.execFileSync('gcc', ['-std=c11', '-O0', '-o', exe, path.join(dir, file), '-lm']);
        entry.expect = cp.execFileSync(exe, { input: entry.stdin, cwd: work }).toString();
    }
    lab.push(entry);
}
const out = path.join(__dirname, '..', 'tests', 'lab.js');
const text = '/* Lab programs with expected results. Made by tools/build-tests.js from tests/programs/ — do not edit. */\n' +
    '(function (g) { g.CLab = ' + JSON.stringify(lab, null, 1) + ';\n' +
    '    if (typeof module !== \'undefined\' && module.exports) module.exports = g.CLab; })' +
    '(typeof window !== \'undefined\' ? window : globalThis);\n';
if (process.argv.includes('--check')) {
    const same = fs.existsSync(out) && fs.readFileSync(out, 'utf8') === text;
    console.log(same ? 'tests/lab.js is up to date' : 'tests/lab.js is out of date — run: node tools/build-tests.js');
    process.exit(same ? 0 : 1);
}
fs.writeFileSync(out, text);
console.log(path.relative(process.cwd(), out), lab.length, 'programs');

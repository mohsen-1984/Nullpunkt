#!/usr/bin/env node
/**
 * Fill the generated fields (⚙, S00-schema) — data/generated/expect.js — by really compiling and running every code
 * record and every exercise test with gcc and with the browser's compiler (XCC). Authors never write outputs,
 * compiler messages or mistake symptoms by hand (S.CH.05, S.PIT.03).
 *
 *   node tools/gen-expect.js            write data/generated/expect.js
 *   node tools/gen-expect.js --check    exit 1 if it is out of date (CI)
 *
 * gcc: gcc -std=c17 -Wall -Wextra -pedantic (C.FLG.01), file name main.c, run with a 5 s limit.
 * Each entry keeps the SHA-256 of its inputs; the checker reports a stale entry (S00-schema: Authored and Generated).
 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const data = require(path.join(root, 'lib/Data.js'));
const N = data.loadNode(root, { withGenerated: false });
N.index = N.index || data.index(N);
const WasiShimFactory = require(path.join(root, 'lib/WasiShim.js'));
const CRunner = require(path.join(root, 'lib/CRunner.js'));
const bundleFile = fs.readdirSync(path.join(root, 'vendor/wcc')).find(f => /^wcc_.*\.js$/.test(f));
const bundle = require(path.join(root, 'vendor/wcc', bundleFile));
const engine = CRunner.engineFactory(WasiShimFactory, bundle);

const GCC_FLAGS = ['-std=c17', '-Wall', '-Wextra', '-pedantic', '-fdiagnostics-plain-output'];
const gccVersion = cp.execFileSync('gcc', ['-dumpfullversion']).toString().trim();
const hash = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'np-expect-'));
let n = 0;

function parseGcc(log) {
    const out = [];
    log.split('\n').forEach(line => {
        const m = line.match(/^main\.c:(\d+):(\d+): (error|warning|note): (.*)$/);
        if (m) out.push({ line: +m[1], col: +m[2], severity: m[3], message: m[4] });
    });
    return out;
}

function runGcc(input) {
    const dir = path.join(tmpRoot, String(n++));
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'main.c'), input.source);
    const c = cp.spawnSync('gcc', GCC_FLAGS.concat(['-o', 'main', 'main.c', '-lm']), { cwd: dir, encoding: 'utf8' });
    const log = (c.stderr || '').trim();
    const res = { compiled: c.status === 0, diagnostics: parseGcc(log), log };
    if (!res.compiled) return res;
    for (const f of Object.keys(input.files || {})) fs.writeFileSync(path.join(dir, f), input.files[f]);
    const r = cp.spawnSync(path.join(dir, 'main'), input.args || [], { cwd: dir, input: input.stdin || '', encoding: 'utf8', timeout: 5000 });
    res.stdout = r.stdout;
    res.stderr = r.stderr;
    res.exitCode = r.status;
    if (r.signal) res.trap = r.signal === 'SIGTERM' && r.error ? 'timeout' : r.signal;
    return res;
}

async function runXcc(input) {
    const c = engine.compile(input.source);
    const res = { compiled: c.ok, diagnostics: c.diagnostics, log: c.log.trim() };
    if (!c.ok) return res;
    let stdout = '', stderr = '';
    const r = await engine.run(c.wasm, { stdin: input.stdin || '', args: input.args, files: input.files,
        onOutput: (t, isErr) => { if (isErr) stderr += t; else stdout += t; } });
    Object.assign(res, { stdout, stderr, exitCode: r.exitCode });
    if (r.trap) res.trap = r.trap;
    return res;
}

const program = (source, rec) => ({ source, stdin: rec.stdin || '', args: rec.args || [], files: rec.files || {} });

(async function main() {
    const out = { compilers: { gcc: gccVersion, flags: GCC_FLAGS.join(' '), xcc: bundle.commit }, code: {}, tests: {} };
    const tag = { gcc: gccVersion, xcc: bundle.commit };

    for (const code of N.index.codeList) {
        const input = program(code.source, code);
        out.code[code.id] = { hash: hash([input, tag]), gcc: runGcc(input), xcc: await runXcc(input) };
    }

    for (const item of N.index.itemList) {
        const band = N.index.bandOfItem[item.id];
        for (const t of item.tests || []) {
            let solution;
            if (band.type === "B.parsons") solution = data.parsonsSource(item, item.solution);
            else solution = item.solution;
            const input = program(solution, t);
            const entry = { hash: hash([input, tag]) };
            if (t.purpose === 'mistake') {
                const wrongSource = t.variant || (item.broken && N.index.code[item.broken].source);
                const wrongInput = program(wrongSource, t);
                entry.hash = hash([input, wrongInput, tag]);
                const good = runGcc(input), bad = runGcc(wrongInput);
                entry.expect = { stdout: good.stdout, exitCode: good.exitCode };
                entry.rejects = !bad.compiled || bad.stdout !== good.stdout || bad.exitCode !== good.exitCode;
            } else {
                const good = runGcc(input), x = await runXcc(input);
                entry.expect = { stdout: good.stdout, exitCode: good.exitCode };
                entry.xccSame = x.compiled && x.stdout === good.stdout && x.exitCode === good.exitCode;
            }
            out.tests[t.id] = entry;
        }
    }

    const file = path.join(root, 'data/generated/expect.js');
    const text = '/* GENERATED by tools/gen-expect.js — do not edit. Real results of every code record and exercise test ' +
        '(gcc ' + gccVersion + ', XCC ' + bundle.commit.slice(0, 7) + '). */\n' +
        '(function (g) { var N = g.Nullpunkt = g.Nullpunkt || { files: {} }; N.generated = ' + JSON.stringify(out, null, 1) + ';\n' +
        '})(typeof window !== \'undefined\' ? window : globalThis);\n';
    fs.rmSync(tmpRoot, { recursive: true, force: true });
    if (process.argv.includes('--check')) {
        const same = fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text;
        console.log(same ? 'data/generated/expect.js is up to date' : 'data/generated/expect.js is out of date — run: node tools/gen-expect.js');
        process.exit(same ? 0 : 1);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    console.log('data/generated/expect.js:', Object.keys(out.code).length, 'code records,', Object.keys(out.tests).length, 'tests');
})();

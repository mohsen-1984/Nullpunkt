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
if (process.argv.includes('--check')) console.log('gcc ' + gccVersion);
const hash = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'np-expect-'));
let n = 0;

/** readable x86-64 assembly of main.c for orientation lessons (C.ORI.01): optimised a little (-O1), Intel syntax,
 *  without the hardening that hides the plain calls (CET, fortify), and without assembler bookkeeping directives */
function asmOf(dir, env) {
    const a = cp.spawnSync('gcc', ['-std=c17', '-O1', '-S', '-masm=intel', '-fno-asynchronous-unwind-tables', '-fcf-protection=none',
        '-U_FORTIFY_SOURCE', '-o', '-', 'main.c'], { cwd: dir, encoding: 'utf8', env });
    return (a.stdout || '').split('\n')
        .filter(l => !/^\s*\.(file|ident|section|size|type|text|globl|align|p2align|long|intel_syntax)\b|^[0-9]:|^\s*\.string\s+"GNU"/.test(l))
        .join('\n').trim() + '\n';
}

function parseGcc(log) {
    const out = [];
    log.split('\n').forEach(line => {
        const m = line.match(/^main\.c:(\d+):(\d+): (error|warning|note): (.*)$/);
        if (m) out.push({ line: +m[1], col: +m[2], severity: m[3], message: m[4] });
        const ld = line.match(/(undefined reference to .*)$/);
        if (ld) out.push({ line: null, col: null, severity: 'error', message: ld[1], stage: 'link' });
    });
    return out;
}

function runGcc(input) {
    const dir = path.join(tmpRoot, String(n++));
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'main.c'), input.source);
    // LC_ALL=C: plain ASCII quotes in messages, the same on every machine (a UTF-8 locale gives ‘;’).
    // Compile and link in two steps, so a link error names main.o instead of a random temporary file.
    const env = Object.assign({}, process.env, { LC_ALL: 'C', LANG: 'C' });
    const c = cp.spawnSync('gcc', GCC_FLAGS.concat(['-c', '-o', 'main.o', 'main.c']), { cwd: dir, encoding: 'utf8', env });
    let log = (c.stderr || '').trim(), ok = c.status === 0;
    if (ok) {
        const l = cp.spawnSync('gcc', ['-o', 'main', 'main.o', '-lm'], { cwd: dir, encoding: 'utf8', env });
        log = [log, (l.stderr || '').trim()].filter(Boolean).join('\n');
        ok = l.status === 0;
    }
    const res = { compiled: ok, diagnostics: parseGcc(log), log };
    if (ok && input.asm) res.asm = asmOf(dir, env);
    if (!res.compiled || input.noRun) return res;
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
    if (!c.ok || input.noRun) return res;
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
        // code with undefined behavior (or a warning about it) is compiled but not run: its output is not reproducible
        const run = Object.assign({ noRun: code.intent === 'ub' || code.intent === 'warning', asm: !!code.asm }, input);
        out.code[code.id] = { hash: hash([input, tag]), gcc: runGcc(run), xcc: await runXcc(run) };
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
                // `rejects`: the browser's check (XCC) turns the mistake down; `gccRejects`: gcc would too, or warns
                const good = runGcc(input), bad = runGcc(wrongInput), badX = await runXcc(wrongInput);
                entry.expect = { stdout: good.stdout, exitCode: good.exitCode };
                entry.rejects = !badX.compiled || badX.stdout !== good.stdout || badX.exitCode !== good.exitCode;
                entry.gccRejects = !bad.compiled || bad.diagnostics.some(d => d.severity === 'warning') || bad.stdout !== good.stdout;
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
        if (!same && fs.existsSync(file)) {
            const a = fs.readFileSync(file, 'utf8').split('\n'), b = text.split('\n');
            const i = b.findIndex((l, k) => l !== a[k]);
            console.log('first difference, line ' + (i + 1) + ':\n  file: ' + a[i] + '\n  now:  ' + b[i]);
        }
        process.exit(same ? 0 : 1);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    console.log('data/generated/expect.js:', Object.keys(out.code).length, 'code records,', Object.keys(out.tests).length, 'tests');
})();

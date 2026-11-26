#!/usr/bin/env node
/**
 * Fill the generated fields (⚙, S00-schema) — data/generated/<chapter folder>/<lesson>.js and data/generated/outline.js —
 * by really compiling and running every code record and every exercise test with gcc and with the browser's compiler
 * (XCC). Authors never write outputs, compiler messages or mistake symptoms by hand (S.CH.05, S.PIT.03).
 *
 *   node tools/gen-expect.js            write data/generated/ (one file per lesson, beside its folder, and the outline)
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
const Trace = require(path.join(root, 'lib/Trace.js'));
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
    const out = { compilers: { gcc: gccVersion, flags: GCC_FLAGS.join(' '), xcc: bundle.build || bundle.commit }, code: {}, tests: {}, trace: {} };
    const tag = { gcc: gccVersion, xcc: bundle.build || bundle.commit };

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

    // trace tables (node `trace`, band `B.trace`): run the code with a snapshot after each statement line (lib/Trace.js)
    for (const t of data.traces(N)) {
        const key = Trace.key(t.ref, t.vars), code = N.index.code[t.ref];
        if (out.trace[key] || !code) continue;
        const ins = Trace.instrument(code.source, t.vars);
        const entry = { hash: hash([code.source, t.vars, code.stdin || '', tag]) };
        if (ins.error) entry.error = ins.error;
        else {
            const dir = path.join(tmpRoot, String(n++));
            fs.mkdirSync(dir);
            fs.writeFileSync(path.join(dir, 'main.c'), ins.source);
            const env = Object.assign({}, process.env, { LC_ALL: 'C', LANG: 'C' });
            const c = cp.spawnSync('gcc', ['-std=c17', '-w', '-o', 'main', 'main.c', '-lm'], { cwd: dir, encoding: 'utf8', env });
            if (c.status !== 0) entry.error = 'does not compile with the snapshots: ' + (c.stderr || '').trim().split('\n')[0];
            else {
                const r = cp.spawnSync(path.join(dir, 'main'), [], { cwd: dir, input: code.stdin || '', encoding: 'utf8', timeout: 5000 });
                entry.vars = t.vars;
                entry.rows = Trace.parse(r.stdout || '', t.vars);
            }
        }
        out.trace[key] = entry;
    }

    // one file per lesson, beside the lesson's own folder (data/generated/<Cnn-name>/<L04>.js), and the outline
    const head = '/* GENERATED by tools/gen-expect.js — do not edit. ';
    const stamp = '(gcc ' + gccVersion + ', XCC ' + (bundle.build || bundle.commit.slice(0, 7)) + ')';
    const per = {};
    const put = (kind, key, v) => {
        const L = data.lessonOf(key), lesson = L && N.index.lesson[L];
        if (!lesson) throw new Error('no lesson for generated ' + kind + ' ' + key);
        const f = per[lesson.file] = per[lesson.file] || { id: L, code: {}, tests: {}, trace: {} };
        f[kind][key] = v;
    };
    ['code', 'tests', 'trace'].forEach(kind => Object.keys(out[kind]).forEach(k => put(kind, k, out[kind][k])));
    const files = {};
    Object.keys(per).sort().forEach(rel => {
        const f = per[rel], body = { compilers: out.compilers };
        ['code', 'tests', 'trace'].forEach(k => { if (Object.keys(f[k]).length) body[k] = f[k]; });
        files['data/generated/' + rel + '.js'] = head + 'Real results of the code records and exercise tests of ' + f.id + ' ' + stamp + '. */\n' +
            '(function (g) {\n    var N = g.Nullpunkt = g.Nullpunkt || { files: {} }, G = N.generated = N.generated || { code: {}, tests: {}, trace: {} };\n' +
            '    var R = ' + JSON.stringify(body, null, 1) + ';\n' +
            '    G.compilers = R.compilers;\n    [\'code\', \'tests\', \'trace\'].forEach(function (k) { if (R[k]) Object.keys(R[k]).forEach(function (id) { G[k][id] = R[k][id]; }); });\n' +
            '})(typeof window !== \'undefined\' ? window : globalThis);\n';
    });
    // the outline: the exercise items of every written lesson, so the path shows progress without loading lessons
    const outline = {};
    N.index.lessonList.forEach(L => { if (L.unit) outline[L.id] = [].concat.apply([], (L.unit.bands || []).map(b => (b.items || []).map(it => it.id))); });
    files['data/generated/outline.js'] = head + 'The exercise items of every written lesson, for the progress shown on the path. */\n' +
        '(function (g) { var N = g.Nullpunkt = g.Nullpunkt || { files: {} }; N.outline = ' + JSON.stringify(outline, null, 1) + ';\n' +
        '})(typeof window !== \'undefined\' ? window : globalThis);\n';
    fs.rmSync(tmpRoot, { recursive: true, force: true });

    // what is in data/generated/ now (besides README.md)
    const gdir = path.join(root, 'data/generated'), present = [];
    (function list(d) { fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
        const p = path.join(d, e.name);
        if (e.isDirectory()) list(p); else if (e.name.endsWith('.js')) present.push(path.relative(root, p));
    }); })(gdir);
    const stale = present.filter(p => !(p in files));
    if (process.argv.includes('--check')) {
        const bad = Object.keys(files).filter(p => !fs.existsSync(path.join(root, p)) || fs.readFileSync(path.join(root, p), 'utf8') !== files[p]);
        bad.forEach(p => {
            console.log(p + ' is out of date');
            if (fs.existsSync(path.join(root, p))) {
                const a = fs.readFileSync(path.join(root, p), 'utf8').split('\n'), b = files[p].split('\n');
                const i = b.findIndex((l, k) => l !== a[k]);
                console.log('  first difference, line ' + (i + 1) + ':\n  file: ' + a[i] + '\n  now:  ' + b[i]);
            }
        });
        stale.forEach(p => console.log(p + ' belongs to no lesson — run: node tools/gen-expect.js'));
        console.log(bad.length || stale.length ? 'data/generated/ is out of date — run: node tools/gen-expect.js' : 'data/generated/ is up to date');
        process.exit(bad.length || stale.length ? 1 : 0);
    }
    stale.forEach(p => fs.rmSync(path.join(root, p)));
    Object.keys(files).forEach(p => {
        fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
        fs.writeFileSync(path.join(root, p), files[p]);
    });
    console.log('data/generated/:', Object.keys(per).length, 'lesson files,', Object.keys(out.code).length, 'code records,', Object.keys(out.tests).length, 'tests,',
        Object.keys(out.trace).length, 'traces' + (stale.length ? '; removed ' + stale.join(', ') : ''));
})();

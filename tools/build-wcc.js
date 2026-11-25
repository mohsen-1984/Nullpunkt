#!/usr/bin/env node
/**
 * Build vendor/wcc/ — XCC's C compiler for WebAssembly (wcc) as ONE classic script, so it loads from file://
 * with a <script> tag (no fetch, no ES module), the same way Kelk vendors PDF.js and Tesseract.
 *
 *   node tools/build-wcc.js <xcc checkout>
 *
 * The checkout must be built first (Linux, gcc or clang, llvm-ar, Node):
 *   git clone https://github.com/tyfkda/xcc && cd xcc && make wcc && make wcc-gen2
 * which gives cc.wasm (the compiler, itself compiled to wasm), lib/wcrt0.a and lib/wlibc.a (its libc).
 *
 * The file list is XCC's own src/wcc/www/lib_list.json (what its online demo ships): /usr/bin/cc,
 * /usr/include/*.h, /usr/lib/*.a. Bytes are not changed; binaries are written in base64, headers as text
 * (with the demo's one rewrite: `#include "../x/y.h"` → `#include "y.h"`, since all headers sit in one folder).
 *
 * Output: vendor/wcc/wcc_<commit>.js   defines window.WccBundle = { version, commit, files: { path: string } }
 *         where a binary's string starts with "base64:".
 */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');

const xcc = process.argv[2];
if (!xcc) { console.error('usage: node tools/build-wcc.js <xcc checkout>'); process.exit(2); }
const listPath = path.join(xcc, 'src/wcc/www/lib_list.json');
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const files = {};
(function walk(node, prefix) {
    for (const key of Object.keys(node)) {
        const val = node[key], p = prefix + '/' + key;
        if (typeof val === 'string') {
            const src = path.join(xcc, val);
            if (!fs.existsSync(src)) throw new Error(src + ' missing — run `make wcc && make wcc-gen2` in the checkout first');
            if (/\.(wasm|a)$/.test(val)) files[p] = 'base64:' + fs.readFileSync(src).toString('base64');
            else files[p] = fs.readFileSync(src, 'utf8').replace(/^(#include\s+)"\..+\/([\w\d\-_.]+)"$/gm, '$1"$2"');
        } else if (Array.isArray(val)) {
            throw new Error(p + ': concatenated entries are not supported');
        } else walk(val, p);
    }
})(list, '');

let commit = 'unknown';
try { commit = cp.execSync('git rev-parse HEAD', { cwd: xcc }).toString().trim(); } catch (e) { /* not a git checkout */ }
const pkg = JSON.parse(fs.readFileSync(path.join(xcc, 'package.json'), 'utf8'));
const cc = fs.readFileSync(path.join(xcc, 'cc.wasm'));
const sha = crypto.createHash('sha256').update(cc).digest('hex');

const outDir = path.join(__dirname, '..', 'vendor', 'wcc');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'wcc_' + commit.slice(0, 7) + '.js');
fs.writeFileSync(out,
    '/* XCC / wcc — C compiler for WebAssembly by tyfkda (https://github.com/tyfkda/xcc, commit ' + commit +
    ', MIT, see LICENSE). Compiler (cc.wasm, SHA-256 ' + sha + '), libc and headers, bytes unchanged; ' +
    'made by tools/build-wcc.js. */\n' +
    '(function (g) { g.WccBundle = ' + JSON.stringify({ version: pkg.version, commit, files }) + ';\n' +
    '    if (typeof module !== \'undefined\' && module.exports) module.exports = g.WccBundle; })' +
    '(typeof window !== \'undefined\' ? window : globalThis);\n');
fs.copyFileSync(path.join(xcc, 'LICENSE'), path.join(outDir, 'LICENSE'));
console.log(path.relative(process.cwd(), out), (fs.statSync(out).size / 1e3).toFixed(0) + ' KB,',
    Object.keys(files).length, 'files, cc.wasm', (cc.length / 1e3).toFixed(0) + ' KB');

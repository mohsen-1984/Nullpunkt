#!/usr/bin/env node
/**
 * Build vendor/codemirror/codemirror_<view version>.js — CodeMirror 6 with the C/C++ language, as one minified
 * classic script (IIFE) that loads from file://, and vendor/codemirror/LICENSES.md with the license of every
 * bundled package. Run by .github/workflows/vendor-codemirror.yml (npm ci, then npm run build); exact versions
 * are pinned in package.json and package-lock.json.
 */
'use strict';
const fs = require('fs'), path = require('path');
const esbuild = require('esbuild');
const here = __dirname, out = path.join(here, '..', '..', 'vendor', 'codemirror');

const versions = {};
const licenses = [];
function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(name => {
        const p = path.join(dir, name);
        if (name.startsWith('@')) return walk(p);
        const pkgFile = path.join(p, 'package.json');
        if (!fs.existsSync(pkgFile)) return;
        const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
        if (pkg.name === 'esbuild' || pkg.name.startsWith('@esbuild/')) return;
        versions[pkg.name] = pkg.version;
        const lic = fs.readdirSync(p).find(f => /^licen[cs]e/i.test(f));
        licenses.push('## ' + pkg.name + ' ' + pkg.version + ' — ' + (pkg.license || '?') + '\n\n' +
            (lic ? fs.readFileSync(path.join(p, lic), 'utf8').trim() : '(no license file in the package)') + '\n');
    });
}
walk(path.join(here, 'node_modules'));

const view = versions['@codemirror/view'];
fs.mkdirSync(out, { recursive: true });
fs.readdirSync(out).filter(f => /^codemirror_.*\.js$/.test(f)).forEach(f => fs.unlinkSync(path.join(out, f)));
const file = path.join(out, 'codemirror_' + view + '.js');
esbuild.buildSync({
    entryPoints: [path.join(here, 'entry.js')], bundle: true, format: 'iife', minify: true, target: 'es2020',
    legalComments: 'none', outfile: file, define: { __CM_VERSIONS__: JSON.stringify(versions) },
});
const body = fs.readFileSync(file, 'utf8');
const names = Object.keys(versions).sort().map(n => n + ' ' + versions[n]).join(', ');
fs.writeFileSync(file, '/* CodeMirror 6 (MIT, https://codemirror.net) for Nullpunkt — ' + names +
    '. Bundled by tools/codemirror/build.js; licenses in LICENSES.md. */\n' + body);
fs.writeFileSync(path.join(out, 'LICENSES.md'), '# Licenses of vendor/codemirror\n\n' + licenses.sort().join('\n'));
console.log(path.relative(process.cwd(), file), (fs.statSync(file).size / 1e3).toFixed(0) + ' KB,', Object.keys(versions).length, 'packages');

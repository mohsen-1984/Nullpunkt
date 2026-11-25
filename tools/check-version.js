#!/usr/bin/env node
/**
 * Check that every place stating Nullpunkt's version agrees with the single source, NullpunktSite.version in
 * site/config.js (e.g. '0.1.0'). One line per check; exit 1 on a mismatch or when a listed place is not found.
 *   node tools/check-version.js
 * Deliberately not checked: older CHANGELOG headings, versions of third-party parts (vendor/, fonts, Lucide, XCC).
 */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const m = /^\s*version: '(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)'/m.exec(read('site/config.js'));
if (!m) { console.log('MISSING   site/config.js: no version: \'<major>.<minor>.<patch>\' line'); process.exit(1); }
const v = m[1];
const CHECKS = [
    { file: 'CHANGELOG.md', re: /^## \[(?!Unreleased\])([^\]]+)\]/m, why: 'newest release heading ([Unreleased] above it is fine)' },
    { file: 'README.md', re: /badge\/version-([0-9][^-]*(?:--[0-9A-Za-z.]+)?)-/, why: 'version badge', map: s => s.replace(/--/g, '-') },
    { file: 'README.md', re: /releases\/tag\/v([0-9][^)\s"]*)/g, why: 'links to the release notes' },
];
let bad = 0;
console.log('source    site/config.js  ' + v);
CHECKS.forEach(c => {
    const text = read(c.file), found = [];
    if (c.re.global) { let x; while ((x = c.re.exec(text))) found.push(x[1]); } else { const x = c.re.exec(text); if (x) found.push(x[1]); }
    if (!found.length) { bad++; console.log('MISSING   ' + c.file + ' — ' + c.why); return; }
    found.map(c.map || (s => s)).forEach(f => {
        const ok = f === v;
        if (!ok) bad++;
        console.log((ok ? 'ok        ' : 'MISMATCH  ') + c.file + ' — ' + c.why + ': ' + f);
    });
});
process.exit(bad ? 1 : 0);

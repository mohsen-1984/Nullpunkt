#!/usr/bin/env node
/**
 * Build vendor/lucide/icons_<version>.js — only the Lucide icons Nullpunkt uses (S.AST.01), as a classic script, so
 * pages load them from file:// without the whole library. The icons are the SVG sources of the Lucide release tag,
 * unchanged except that the outer <svg> is dropped (the page adds its own).
 *
 *   git clone --depth 1 --branch 1.80.0 --filter=blob:none --sparse https://github.com/lucide-icons/lucide /tmp/lucide
 *   git -C /tmp/lucide sparse-checkout set icons
 *   node tools/build-icons.js /tmp/lucide 1.80.0
 *
 * The icon list is every icon named in data/S00-registry.js (blocks, exercise types, note kinds, unit types, UI) and
 * data/S00-prompts.js. A name missing from the release stops the build.
 */
'use strict';
const fs = require('fs'), path = require('path');
const [src, version] = process.argv.slice(2);
if (!src || !version) { console.error('usage: node tools/build-icons.js <lucide checkout> <version>'); process.exit(2); }

const root = path.join(__dirname, '..');
require(path.join(root, 'data/S00-registry.js'));
require(path.join(root, 'data/S00-prompts.js'));
const N = globalThis.Nullpunkt;
const reg = N.files.S00R;
const names = new Set(reg.uiIcons);
for (const group of [reg.blocks, reg.bandTypes, reg.noteKinds, reg.unitTypes]) {
    for (const k of Object.keys(group)) names.add(group[k].icon);
}
N.files.S00P.prompts.forEach(p => names.add(p.icon));

const icons = {};
const missing = [];
[...names].sort().forEach(name => {
    const file = path.join(src, 'icons', name + '.svg');
    if (!fs.existsSync(file)) { missing.push(name); return; }
    const svg = fs.readFileSync(file, 'utf8');
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
        .split('\n').map(l => l.trim()).filter(Boolean).join('');
    icons[name] = inner;
});
if (missing.length) { console.error('not in Lucide ' + version + ': ' + missing.join(', ')); process.exit(1); }

const outDir = path.join(root, 'vendor', 'lucide');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'icons_' + version + '.js');
fs.writeFileSync(out, '/* Lucide ' + version + ' (https://lucide.dev, ISC, see LICENSE) — only the icons Nullpunkt uses, SVG bodies ' +
    'unchanged. Made by tools/build-icons.js. */\n' +
    '(function (g) { g.NullpunktIcons = { version: ' + JSON.stringify(version) + ', icons: ' + JSON.stringify(icons, null, 1) + ' };\n' +
    '    if (typeof module !== \'undefined\' && module.exports) module.exports = g.NullpunktIcons; })' +
    '(typeof window !== \'undefined\' ? window : globalThis);\n');
fs.copyFileSync(path.join(src, 'LICENSE'), path.join(outDir, 'LICENSE'));
console.log(path.relative(process.cwd(), out), Object.keys(icons).length, 'icons', (fs.statSync(out).size / 1e3).toFixed(1) + ' KB');

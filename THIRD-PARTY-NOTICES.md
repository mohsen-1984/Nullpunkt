# Third-Party Notices

Nullpunkt's own code is MIT (`LICENSE`) and its content CC BY-SA 4.0 (`LICENSE-CONTENT.md`). These components keep their own licenses.

## Shipped in this repository

| Component | Where | License | Source |
|---|---|---|---|
| XCC (wcc) — C compiler, libc and headers, compiled to WebAssembly; one patch to its `scanf` (`vendor/wcc/patches/`) | `vendor/wcc/` | MIT, © tyfkda — `vendor/wcc/LICENSE` | https://github.com/tyfkda/xcc |
| Lucide 1.80.0 — the icons the course uses, SVG bodies unchanged | `vendor/lucide/` | ISC, © Lucide Icons and Contributors — `vendor/lucide/LICENSE` | https://github.com/lucide-icons/lucide |
| CodeMirror 6 with the C/C++ language — the code editor and syntax colors | `vendor/codemirror/` | MIT — every bundled package in `vendor/codemirror/LICENSES.md` | https://codemirror.net |

## Loaded by the pages

| Component | License | Source |
|---|---|---|
| Inter | SIL Open Font License 1.1 | Google Fonts |
| Vazirmatn | SIL Open Font License 1.1 | Google Fonts |
| JetBrains Mono | SIL Open Font License 1.1 | Google Fonts |

## Used only to build or test

| Component | Use |
|---|---|
| gcc | Real results of every code record and test (`tools/gen-expect.js`, `tools/build-tests.js`) |
| npm and esbuild | Bundling CodeMirror, in GitHub Actions only (`tools/codemirror/`) |
| Google Chrome (headless) | Browser lab in CI (`tools/headless-lab.js`) |

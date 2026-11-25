# vendor — third-party parts

Each folder is made by a script in `tools/` from a pinned upstream version, and CI rebuilds it and compares
(`.github/workflows/ci.yml`, job `vendor`). The pages load them as classic scripts, so nothing comes from a CDN at
run time. Licenses: [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md).

| Folder | What | Made by |
|---|---|---|
| [`wcc/`](wcc/) | XCC, the C compiler, as WebAssembly | `tools/build-wcc.js` |
| [`codemirror/`](codemirror/) | CodeMirror 6.41 with the C language | `tools/codemirror/` (CI) |
| [`lucide/`](lucide/) | The Lucide 1.80.0 icons the site uses | `tools/build-icons.js` |

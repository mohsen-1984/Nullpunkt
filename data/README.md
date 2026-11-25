# data — the course, as data

Every file is a classic script that registers one object in `window.Nullpunkt.files`, so the pages load it from
`file://` with a `<script>` tag and the tools load it in Node (`lib/Data.js`). The format is
[`docs/rules/S00-schema.md`](../docs/rules/S00-schema.md).

| File | What it holds |
|---|---|
| `registry.js` | Languages, the files to load, the catalog: chapter 0, then 14 chapters and 54 lessons with titles, status and can-do lists |
| `S00-registry.js` | Blocks, exercise types, note kinds, mistake dimensions and sources, icons, short labels |
| `S00-glossary.js` | Terms in three languages, with the form running text uses |
| `S00-prompts.js` | AI-tutor prompts |
| `C00-conventions.js` | The lesson skeleton, the construct ladder, allowed chunks, forbidden constructs |
| `C00-mistakes.js` | The common mistakes of the C series (`M-01`, `E-03`, …) |
| `C01-getting-started.js` | Chapter 1: code records and lessons 1–3 |
| [`generated/`](generated/) | Real gcc and XCC results — generated, never edited |

After any change: `node tools/gen-expect.js`, then `node tools/check.js` (0 errors, 0 warnings). Both `index.html` and
`lesson.html` must load every file here (`S.DAT.06`).

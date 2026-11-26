# data — the course, as data

Every file is a classic script that registers one object in `window.Nullpunkt`, so the pages load it from `file://`
with a `<script>` tag and the tools load it in Node (`lib/Data.js`). The format is
[`docs/rules/S00-schema.md`](../docs/rules/S00-schema.md).

| File | What it holds |
|---|---|
| `registry.js` | Languages, the shared files, and the chapter folders of each series, in order |
| `S00-registry.js` | Blocks, exercise types, note kinds, mistake dimensions and sources, icons, short labels |
| `S00-glossary.js` | Terms in three languages, with the form running text uses |
| `S00-prompts.js` | AI-tutor prompts |
| `C00-conventions.js` | The lesson skeleton, the construct ladder, allowed chunks, forbidden constructs |
| `C00-mistakes.js` | The common mistakes of the C series (`M-01`, `E-03`, …) |
| `C02-values-and-variables/` | One folder per chapter (chapter 0 to 14) |
| `  chapter.js` | The chapter's register: title, its lessons in order with minutes, prerequisites and can-do lists, its review unit |
| `  L04.js` … `L08.js` | One file per lesson: its code records and its unit (`O01.js` for orientation lessons) |
| `  REV.js` | The chapter's review unit |
| [`generated/`](generated/) | Real gcc and XCC results, one file per lesson in the same folders, and the outline — generated, never edited |

There is one catalog: `lib/Data.js` merges the chapter registers, in the order of `registry.js`, into it in memory.

A page loads the shared files and the outline itself (`S.DAT.06`); `lib/Data.js` loads every chapter register, then
only the lessons the page shows and the lessons they refer to. Search loads the rest when it is first opened.

A new lesson: add it to its chapter's `chapter.js` (status `written`), write `Lnn.js` beside it (copy a finished lesson
such as `C01-getting-started/L01.js`), then run `node tools/gen-expect.js` and `node tools/check.js` (0 errors,
0 warnings).

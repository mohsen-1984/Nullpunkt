# lib — the engines

Classic scripts that run in the page and in Node.

| File | What it does |
|---|---|
| `CRunner.js` | Compiles and runs C in the browser with XCC: Worker with a time limit, stdin (JSPI), traps named, output limit |
| `WasiShim.js` | The WASI preview 1 host for XCC and the programs it builds: an in-memory file system, stdout, stdin |
| `Data.js` | Collects the data files into one index (lessons, chapters, code, mistakes, terms, bands, items) |
| `Inline.js` | Renders the inline markup of the data (`**b**`, `` `code` ``, `[[term:…]]`, `[[lesson:…]]`) |
| `CodeScan.js` | A small C tokenizer for the checker: which constructs a piece of code uses |
| `Search.js` | Full-text search over the course in one language, with folding for German and Persian |

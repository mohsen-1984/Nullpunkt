# docs/rules — the series bible

| Document | What it holds |
|---|---|
| [`S00-core.md`](S00-core.md) | Charter, name, voice, languages, mistake dimensions, ids, typography, blocks, exercise types, code style |
| [`S00-pedagogy.md`](S00-pedagogy.md) | Why: notional machine, conceptual contrast, PRIMM, worked examples, references |
| [`S00-schema.md`](S00-schema.md) | The data model every lesson is written in (`data/`) |
| [`S00-assets.md`](S00-assets.md) | Logo, colors, fonts, icons |
| [`C00-conventions.md`](C00-conventions.md) | The C series: learning path (13 chapters, 50 lessons), lesson skeleton, construct ladder, XCC gaps |

`S00-*` hold for every series (C now, C++ later); `C00-*` only for C. Every rule has an id (`S.BND.02`, `C.LES.01`, …);
`node tools/check.js --list` prints the rules the checker enforces.

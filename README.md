# Nullpunkt

**C from zero — C von Null an — C از صفر**

A free, self-study C course for first-year computer science students, in three languages: Deutsch, English and فارسی. Every example runs in your browser — a real C compiler compiled to WebAssembly, offline, straight from `file://`, with nothing sent to a server.

> **Status: in development.** There is no lesson to study yet. This repository currently holds the rule documents that every lesson will follow, and the next commits add the in-browser C runner and the first sample lesson. Version 1.0 will cover C (ISO C17); C++ comes after.

## What makes it different

- **Runs real C in the browser.** [XCC](https://github.com/tyfkda/xcc) compiles your program to WebAssembly on your own machine; a program that never ends can be stopped, and `scanf` waits for your input like a terminal does.
- **Two viewpoints on every concept.** What the machine actually does with your code (memory, addresses, the call stack) — and where C differs from what you already know from math, everyday language or Python.
- **Mistakes are part of the lesson.** Every common mistake has a code (`E-07`, `U-03`, …), is shown with the real compiler message, and is practiced until you recognize it.
- **One course, three languages.** Explanations in German, English or Persian; code, technical terms and compiler messages always in English — the language you will meet everywhere else.
- **A bridge to your own PC.** Every chapter ends with the same work done with gcc or clang, VS Code or CLion.

## Rule documents

The course is written against a small set of rule documents (drafts, in Persian with English terms):

| Document | What it holds |
|---|---|
| [`S00-core`](docs/rules/S00-core.md) | Charter, voice, languages, mistake dimensions, ids, typography, blocks, exercise types, code style |
| [`S00-pedagogy`](docs/rules/S00-pedagogy.md) | Why: notional machine, conceptual contrast, PRIMM, worked examples, references |
| [`S00-schema`](docs/rules/S00-schema.md) | The data model every lesson is written in |
| [`S00-assets`](docs/rules/S00-assets.md) | Logo, colors, fonts, icons |
| [`C00-conventions`](docs/rules/C00-conventions.md) | The C series: learning path (13 chapters, 50 lessons), lesson skeleton, construct ladder |

## Repository

| Folder | What it holds |
|---|---|
| `docs/rules/` | The rule documents above |
| `lib/` | `CRunner.js` (compile and run C in the browser) and `WasiShim.js` (its small WASI host) |
| `vendor/wcc/` | XCC, the C compiler, as one script — see its README |
| `tests/` | Lab programs and their expected results, taken from gcc |
| `tools/` | Build scripts, and `runner-lab/` — a page that runs the whole lab in any browser |

Open `tools/runner-lab/index.html` (straight from disk is fine) and press **Run lab** to check the runner in your browser.

## License

- **Content** (lessons, exercises, rule documents, logo): [CC BY-SA 4.0](LICENSE-CONTENT.md)
- **Code**: [MIT](LICENSE)
- **Third-party components** keep their own licenses.

## Contact

mhn.com@gmail.com

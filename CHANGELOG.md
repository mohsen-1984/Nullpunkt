# Changelog

All notable changes to Nullpunkt. Versions follow [Semantic Versioning](https://semver.org/); before 1.0, a minor
version may change the data format. Dates are those of the release tags. The single source of the version is
`site/config.js` (`tools/check-version.js` checks this file and `README.md` against it).

## [Unreleased]

## [0.1.1] — 2026-11-25

Chapter 0 (orientation) and the first review round: a new logo, gcc 15 as the reference compiler, and the
catalog settled for the road to 1.0.

### Course

- **Chapter 0 — Orientation**, five short lessons before lesson 1, in three languages, numbered 0.1–0.5 so lesson 1
  stays lesson 1:
  - **0.1 Where C Lives Today:** operating systems, embedded and robotics, AI, the web, databases, the languages
    themselves; three common beliefs answered; C at university and for a software engineer.
  - **0.2 From Program to Processor:** machine code, assembly and high-level languages; compiler, interpreter and
    bytecode (C, Java, Python, JavaScript); the four build steps; the real x86-64 assembly of a small program.
  - **0.3 Standards and Tools:** C89 to C23, why C17, `__STDC_VERSION__` in gcc and in the browser, gcc, clang, MSVC,
    POSIX, MISRA C, CERT C, C and C++.
  - **0.4 C on Your Own Computer:** five terminal commands, installing on Windows (WSL, MSYS2), macOS and Linux,
    building with `gcc -std=c17 -Wall -Wextra -pedantic`, VS Code.
  - **0.5 How to Learn C:** six habits, how the course helps, AI as a tutor, what Python knowledge helps or misleads,
    a weekly plan.
- 8 new glossary terms; a new exercise type, **Choose** (`B.choice`), with feedback for every option.
- **The reference compiler is now gcc 15**, the default of Ubuntu 26.04 LTS and so of most learners' WSL and Linux
  (rule `C.CMP.01`). Every message in the lessons was recorded again with it.
- **Lesson 2** follows gcc 15: a misspelled name (`prinf`) and a missing `#include <stdio.h>` are now compile errors,
  not warnings. The linker is shown with a new example, `main` misspelled as `mian` (`undefined reference to
  'main'`). A new *Standard & Platform* block says what gcc 13 and older do instead.
- Mistake **`E-07`** (missing `#include <stdio.h>`) replaces **`W-01`**, which is retired: from gcc 14 on, and in
  clang, it is an error. Retired ids are listed in the data and never used again.
- Review of chapters 0 and 1: lessons 1 and 2 take 25 minutes, not 20; Persian text uses *compiler*, *compile* and
  *interpreter* everywhere, as the glossary says (titles and can-do lists included); German *Sourcecode*; the support
  for C17 in MSVC is stated with its limits.
- **Catalog review** (rule `C.TOP.01`): `math.h` in lesson 21, `rand`/`time` in lesson 17, `static` and storage
  duration from lesson 22 (lesson title *Scope, Lifetime & static*), `union` and bit-fields now in 1.0 (lesson 54,
  *Talking to Hardware: volatile, union & Bit-Fields*), `stderr` and the exit status from lesson 40, security
  mistakes (`S-`) from chapter 3 on; chapter 14 stays last; one review unit for each of chapters 1–14.
- **Chapter 14 — Beyond the Console** planned (lessons 51–54): streams and devices (`stdin`, `stdout`, `stderr`,
  redirection, exit status), the terminal (ANSI colors, cursor, keys), graphics (why `graphics.h` and “text mode /
  graphics mode” are DOS-era Turbo C, not standard C; image files and modern libraries), and hardware registers with
  `volatile`. The path for 1.0 is now chapter 0, then 14 chapters and 54 lessons (rule `C.DEV.01`).

### Site

- **A new logo**: a code editor in 8-bit pixels — a C and the cursor after it, the point where every program starts.
  It is drawn on a 16 × 16 grid, so it is sharp even as a 16-pixel favicon. Click, tap or hover the logo to read what
  it means; its cursor blinks while you look. New favicon, link-preview picture and touch icon.
- **The version is at the top** now, beside the name in the header (and in the course menu), linked to these notes;
  the footer no longer shows it.
- On lesson pages in German and Persian, the English title stands on its own line under the title, so a Persian
  title no longer breaks around it; on the home page, each tagline keeps its own direction.
- Lessons can hold sections with their own title, myths answered, terminal transcripts, tabs per operating system
  (opening on the reader's own system) and assembly beside its C.

### Tooling

- CI runs on Ubuntu 26.04 with gcc 15 and moves `actions/checkout` and `actions/setup-node` to v7 (Node 24). A new
  job records the compiler results with the reference gcc and commits them to the pull request, so authors with
  another gcc can still contribute.
- Checker: the logo is the same drawing everywhere (`S.AST.05`); Persian text never uses the forms a term's `alt`
  lists, such as «کامپایلر» (`S.LNG.06`); retired ids are never used or referenced again (`S.ID.01`); a code record
  can name a rule it breaks on purpose (`allow`, counted in the report).
- `tools/headless-shell.js` also opens and closes the logo's card on a phone.

- `tools/gen-expect.js` records readable x86-64 assembly (`gcc -S -O1`) for code marked `asm`.
- Checker: orientation lessons (`C.ORI.01`) have their own light skeleton and no construct ladder; choice items need
  exactly one right option and feedback on every option.

## [0.1.0] — 2026-11-25

The first public preview: chapter 1 in three languages, on a complete site.

### Course

- **Chapter 1 — Getting Started**, in English, German and Persian:
  - **Lesson 1 — What a Program Is:** source code, compiler, `printf`, `\n`, `//`.
  - **Lesson 2 — Reading Error Messages:** the parts of a gcc message, the first message first, one mistake and many
    messages, error or warning, linker errors (`undefined reference`).
  - **Lesson 3 — Output with printf:** `%d` with `+ - *`, `\t`, `\"`, `\\`, `/* */`.
- **11 common mistakes**, each with its real gcc message and an exercise that rejects it:
  M-01 to M-03, E-01 to E-06, W-01, U-01.
- **Lesson format**: predict, worked example, inside the machine, rules, mistakes, error clinic, exercises checked by
  tests (predict, Parsons, fix, write, explain), a make project, AI-tutor prompts, terms, self-check, answer key.
- The learning path for 1.0: 13 chapters, 50 lessons (titles in three languages).

### Site

- **Home page**: what Nullpunkt is, the learning path with your progress, how a lesson works, C in the browser,
  the name.
- **Navigation chrome** after the navigation-chrome v2 pattern: a header that sheds what does not fit, step by step
  (measured, not by breakpoints); the lesson's sections in a scrolling second row with a scroll-spy and a dot-nav;
  a drawer that opens from the menu button's edge; every knob in `site/config.js`.
- **Course rail**: the learning path beside the lesson on wide screens, in the menu on narrow ones; the current
  lesson marked, chapters folding, lessons opened and finished marked.
- **Breadcrumbs** (home › chapter › lesson) on every lesson.
- **Full-text search** over every lesson, term and mistake (<kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd>): folds
  case, German umlauts, Arabic and Persian letter forms and the zero-width non-joiner; the words are marked on the
  page a result opens.
- **Light and dark themes**, set before the first paint; right-to-left for Persian.
- **Logo and favicon** (the dotted zero), link-preview picture (`tools/og-image.html`), Open Graph and X / Twitter
  meta tags; the version in the footer and the rail, linked to these notes.

### Runner

- C17 compiled and run in the browser by XCC (WebAssembly) from `file://`: a time limit that stops endless loops,
  `scanf` that waits for input (JSPI), runtime errors named (division by zero, out-of-bounds access, stack overflow,
  writing through `NULL`).
- XCC's error recovery can repeat the same two messages up to its limit; the runner cuts the log at the first
  repeat and says how many messages were cut.

### Tooling

- `tools/check.js`: 35 rules of the series bible checked on every change (structure leaks, mistake coverage, tests
  that reject each mistake, styles, pages that load every data file …).
- `tools/gen-expect.js`: every code record and test compiled and run with gcc 13.3 and XCC; compile and link
  separately, so link errors are recorded too.
- `tools/headless-lesson.js`, `tools/headless-shell.js`: every page in headless Chrome, every language, 15 widths.
- `tests/search.test.js`, `tools/check-version.js`; CI on every pull request; `vendor/` rebuilt and compared in CI.

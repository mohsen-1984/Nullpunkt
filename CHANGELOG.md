# Changelog

All notable changes to Nullpunkt. Versions follow [Semantic Versioning](https://semver.org/); before 1.0, a minor
version may change the data format. Dates are those of the release tags. The single source of the version is
`site/config.js` (`tools/check-version.js` checks this file and `README.md` against it).

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

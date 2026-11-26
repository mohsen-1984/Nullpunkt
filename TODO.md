# TODO

Open work and backlog only — what is done lives in the code, the rule documents (`docs/rules/`) and the release notes
(`CHANGELOG.md`). Rounds are listed in the order planned; the target of 1.0 is the whole C course.

## Next — 0.3: chapters 3 and 4

- [ ] Decide first (before chapter 4, as the pages grow): one data file per lesson page plus a prebuilt search index,
      and CodeMirror only when an editor first scrolls into view. Every page now loads three chapter files (about
      300 KB); by 1.0 it would be 1.5–2 MB.
- [ ] Chapter 3 — Input (lessons 9–10): `scanf` with `&`, `getchar`, `EOF`; the first security mistakes (`S-`,
      `C.TOP.01`): `scanf("%s")` without a width. Exercises with `stdin` need edge tests.
- [ ] Chapter 4 — Decisions (lessons 11–14): comparisons, `bool`, `if`/`else`, `&&` `||` `!`, `switch`.
- [ ] Review units `C03.REV` and `C04.REV`.
- [ ] Trace tables: highlight the line of the current step in the code beside the table; loops (chapter 5) already
      work, as long as each statement keeps to its own line (`lib/Trace.js`).

## Open from earlier rounds

- [ ] UX on real devices: phone (editor, drawer, tabs), a screen reader in each language (VoiceOver, NVDA, TalkBack);
      load time of the compiler (600 KB, about 210 KB compressed) on a slow connection. Headless checks pass at 15
      widths × 3 languages.
- [ ] Record clang's messages beside gcc's (macOS learners), at least for the error clinic.
- [ ] The runner: when XCC reports `Unresolved: env.__main_argc_argv`, say “no function called `main`”.
- [ ] XCC's `printf` prints an unknown conversion such as `% d` as text, where glibc reads an argument; tests that
      want to show a lone `%` (`U-04`) must use a conversion XCC knows (`%-o`, `%o`).
- [ ] Read chapters 0–2 with a learner from zero in each language; check the facts dated November 2026 again before
      each release (TIOBE, compiler defaults, the reference gcc of `C.CMP.01`).
- [ ] A native-speaker review of the German and Persian text (`S.LNG.05`); mark the chapters reviewed in
      `langStatus`.

## Site

- [ ] Content Security Policy as a meta tag (as Kelk does), once the Blob worker and `file://` are checked under it
      in Chrome, Firefox and Safari.
- [ ] A glossary page: every term in three languages, with the lesson that introduces it.
- [ ] Self-hosted fonts (`assets/fonts/`, OFL), so the offline copy looks the same as the site.
- [ ] Export a lesson as Markdown for Kelk (print, PDF, Word).
- [ ] Progress export and import (a small JSON file), since progress lives in one browser only.

## Runner and XCC

- [ ] Send the XCC contributions prepared in `docs/upstream/` (a tested patch for `limits.h` and `%td` / `%jd`;
      issues for `_Static_assert` and the repeating error recovery), then drop each workaround in `C.XCC.01`.
- [ ] Several files per program (chapter 12: `.c` and `.h`, `extern`, `#include "…"`).
- [ ] Chapter 14 in the browser: show ANSI colors and cursor moves in the output pane; show an image file (PPM)
      a program writes; `stderr` in its own color.
- [ ] An error explainer: the first compiler message mapped to its mistake code (`E-01` …) when one fits.

## Before 1.0

- [ ] All 14 chapters and 54 lessons; every chapter's review unit.
- [ ] Every lesson read by a learner from zero in each language, and corrected.
- [ ] Accessibility pass (keyboard only, screen reader in each language, contrast in both themes).
- [ ] Performance budget: first paint of a lesson under 1 s on a mid-range laptop; the compiler loads on first run only.

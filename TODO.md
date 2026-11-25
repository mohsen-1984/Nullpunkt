# TODO

Open work and backlog only — what is done lives in the code, the rule documents (`docs/rules/`) and the release notes
(`CHANGELOG.md`). Rounds are listed in the order planned; the target of 1.0 is the whole C course.

## Next — 0.2: chapter 2 and the review unit

- [ ] Review unit `C01.REV` with an *On your PC* block (`onpc`): gcc or clang, VS Code or CLion, the same three
      lessons on a real machine.
- [ ] Chapter 2 — Values & Variables (lessons 4–8): variables and identifiers, whole and decimal numbers, expressions,
      characters and ASCII, formatted output.
- [ ] A native-speaker review of the German text (`S.LNG.05`); mark the chapters reviewed in `langStatus`.
- [ ] Trace tables and memory maps (blocks `trace`, `memory`): their renderers, from lesson 4 on.

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
- [ ] An error explainer: the first compiler message mapped to its mistake code (`E-01` …) when one fits.

## Before 1.0

- [ ] All 13 chapters and 50 lessons; every chapter's review unit.
- [ ] Every lesson read by a learner from zero in each language, and corrected.
- [ ] Accessibility pass (keyboard only, screen reader in each language, contrast in both themes).
- [ ] Performance budget: first paint of a lesson under 1 s on a mid-range laptop; the compiler loads on first run only.

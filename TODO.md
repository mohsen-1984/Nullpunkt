# TODO

Open work and backlog only — what is done lives in the code, the rule documents (`docs/rules/`) and the release notes
(`CHANGELOG.md`). Rounds are listed in the order planned; the target of 1.0 is the whole C course.

## Open from the first review round (0.1.1)

- [ ] UX on real devices: phone (editor, drawer, tabs), a screen reader in each language (VoiceOver, NVDA, TalkBack);
      load time of the compiler (600 KB, about 210 KB compressed) on a slow connection. Headless checks pass at 15
      widths × 3 languages; the logo's card works with a tap, the keyboard and Esc.
- [ ] Lesson 2 now has no warning example (`W-01` became `E-07` under gcc 15): add `W-02` in lesson 3 —
      `printf("%d\n")` without its argument (`-Wformat`), which XCC runs and prints garbage.
- [ ] Record clang's messages beside gcc's (macOS learners), at least for the error clinic.
- [ ] The runner: when XCC reports `Unresolved: env.__main_argc_argv`, say “no function called `main`”.
- [ ] Performance: every page loads every chapter's data file (about 100 KB per chapter, so 1.5–2 MB by 1.0). Decide
      before chapter 4: one data file per lesson page plus a prebuilt search index, and CodeMirror only when an editor
      first scrolls into view.

## Next — 0.2: chapter 2 and the review unit

- [ ] Read chapter 0 with a learner from zero in each language; check the facts dated November 2026 again before
      each release (TIOBE, compiler defaults, the reference gcc of `C.CMP.01`).

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
- [ ] Chapter 14 in the browser: show ANSI colors and cursor moves in the output pane; show an image file (PPM)
      a program writes; `stderr` in its own color.
- [ ] An error explainer: the first compiler message mapped to its mistake code (`E-01` …) when one fits.

## Before 1.0

- [ ] All 14 chapters and 54 lessons; every chapter's review unit.
- [ ] Every lesson read by a learner from zero in each language, and corrected.
- [ ] Accessibility pass (keyboard only, screen reader in each language, contrast in both themes).
- [ ] Performance budget: first paint of a lesson under 1 s on a mid-range laptop; the compiler loads on first run only.

# Nullpunkt — how we work

For anyone (person or AI assistant) picking up work on this repository — the place for working instructions; the
release checklist is [`docs/RELEASING.md`](docs/RELEASING.md), the rules of the course are in
[`docs/rules/`](docs/rules/README.md). The owner is [@mohsen-1984](https://github.com/mohsen-1984).

## Start here (a new session)

Read only what the task needs, in this order:

1. **This file** (`CLAUDE.md`), all of it.
2. **[`TODO.md`](TODO.md), its top sections** — the round being worked on and what is open. Decisions recorded in
   the rule documents and the CHANGELOG are final: start without asking again.
3. **[`CHANGELOG.md`](CHANGELOG.md)**: `[Unreleased]` and the newest release — what changed last.
4. **[`docs/rules/README.md`](docs/rules/README.md)**, then for the task at hand only:
   - a lesson: [`C00-conventions.md`](docs/rules/C00-conventions.md) (learning path, lesson skeleton, construct
     ladder, topic homes `C.TOP.01`, XCC gaps) and the parts of [`S00-core.md`](docs/rules/S00-core.md) it points to
     (about 60 KB — search for the rule's id, never read it whole); the data model in
     [`S00-schema.md`](docs/rules/S00-schema.md); a finished lesson in `data/C01-getting-started.js` as the model;
   - the site, logo, colors: [`S00-assets.md`](docs/rules/S00-assets.md); the runner and XCC:
     [`tools/README.md`](tools/README.md), [`docs/upstream/`](docs/upstream/);
   - a release: [`docs/RELEASING.md`](docs/RELEASING.md).

## The agreements

1. **Branches and pull requests; Claude may merge its own.** Work on a branch, open a pull request, wait for CI. When
   every check is green, the assistant merges it (the owner's permission, November 2026) and says so in one line
   (number, what it does). Never push to `main` directly.
2. **Tags, releases and deleting branches are the owner's steps.** For a release, give the release notes ready to
   paste (format in [`docs/RELEASING.md`](docs/RELEASING.md#release-notes-format)) and the click-by-click steps.
   Ask for publishing in a message of its own, after the release PR is merged.
3. **Content lives only in `data/`.** Lessons, codes, exercises, mistakes, glossary and catalog are data; the site
   (`site/`, `lib/`) only renders them. Never write lesson text into a page or a script.
4. **After every change**, run and keep green:
   `node tools/gen-expect.js` · `node tools/check.js` (0 errors, 0 warnings) · `node tools/headless-lesson.js` ·
   `node tools/headless-shell.js`. Compiler results come from the reference gcc (`C.CMP.01`, gcc 15 on Ubuntu
   26.04); if your gcc is another version, push anyway: CI's *Record compiler results* job records them with gcc 15
   and commits them to the pull request.
5. **No regressions.** A runner change passes `node tests/lab.js` and the lab in Chrome (`tools/headless-lab.js`); a
   new rule comes with its check in `tools/check.js` where it can be checked.
6. **Talk to the owner in Persian**, numerals in ASCII digits, the English term beside each Persian technical term;
   explain git and CI in plain words (the owner works on GitHub's web pages): what to click, what a check means.
7. **Write like the repository.** English in code, comments, docs and commit messages; plain, short sentences. The
   course's own text follows the voice rules of `S00-core.md` (three languages, `fa` · `de` · `en`, kept in step; in
   German and Persian the common technical terms stay English, the glossary decides which).
8. **Private files stay private.** Files the owner shares to show a problem never go into the repository — not the
   file, its name, its text or a quote — nor into commit messages or PR texts.
9. **Keep each round trip small.** Open only the files and parts the step needs; search before reading; summarise
   results in a few lines.
10. **What this environment cannot do** (the assistant's proxy): no fork of other repositories, no releases or
    Pages API. Create pull requests with `gh api repos/mohsen-1984/nullpunkt/pulls --input pr.json`.

## Rounds to 1.0

One or two chapters per round; each round is a pull request (two when the runner work is large: runner first, then
lessons) and a 0.x release with notes. The order and what each round holds are in [`TODO.md`](TODO.md).

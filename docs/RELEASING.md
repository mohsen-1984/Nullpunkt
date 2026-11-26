# Releasing Nullpunkt — checklist

Go through it top to bottom for every release (0.x.y). A step that does not apply is ticked with a word why.
Sections 1–5 go into the release's pull request; section 6 is the owner's, click by click.

## 1. Version

- [ ] `site/config.js` → `version: 'x.y.z'` (the one source: the badge beside the name, the release link).
- [ ] `node tools/check-version.js` — it lists every other place that must say the same and fails until they do: the
      README's version badge and its three release links, the newest CHANGELOG heading.

## 2. Content and generated results

- [ ] `node tools/gen-expect.js` and `node tools/check.js` — 0 errors, 0 warnings; the waivers it reports are the ones
      intended. Compiler results are gcc 15's (`C.CMP.01`): CI records them if your gcc differs.
- [ ] `node tools/build-tests.js --check` and `node tests/lab.js` when the runner or the test programs changed.
- [ ] The catalog: each new lesson `status: "ready"` (or `"preview"`), minutes true to the lesson, the chapter's
      `langStatus` honest (`draft` until a native speaker has read it, `S.LNG.05`).
- [ ] The facts with a date (TIOBE, compiler defaults, versions) checked again in the new chapters.

## 3. Words

- [ ] `CHANGELOG.md`: `## [x.y.z] — YYYY-MM-DD` with the day the release is published; concise notes (what a learner
      notices first, then Site, Runner, Tooling), not a work log.
- [ ] `README.md`, all three languages in step: what the course holds (chapters, lessons), figures, screenshots' alt
      text.
- [ ] `TODO.md`: done items out, new findings in, the next round on top.
- [ ] `docs/rules/` when a convention changed (the draft number and date at the top of the document).

## 4. Pictures

- [ ] `assets/screenshots/*.png` when the lesson page changed visibly: `node tools/headless-shell.js --shots
      assets/screenshots`.
- [ ] `tools/og-image.html` → `assets/og-image.png` (1200 × 630) and `assets/apple-touch-icon.png` (180 × 180) when
      the logo or the line under it changed.

## 5. Checks

- [ ] `node tools/headless-lesson.js` (every code of every lesson runs in Chrome as recorded) and
      `node tools/headless-shell.js` (every header stop, the drawer, the logo's card, search) — 0 failures.
- [ ] `node tests/search.test.js`.
- [ ] A pull request to `main` with every CI check green: *Record compiler results*, *Lessons* (checker, generated
      results, pages), *vendor/wcc is reproducible*, *Runner lab*. Then the assistant merges it.

## 6. Publishing (the owner)

**Publish only after the release PR is merged.** The release PR is the one that changes the version in
`site/config.js`; until it is merged, `main` and the site still show the old version. So the assistant asks for
publishing in one message of its own, after that merge — «the release PR is merged, now publish» — and never
alongside another PR. Release notes may be given earlier, marked as for later.

On GitHub's web pages, click by click:

1. **Check the site**: <https://mohsen-1984.github.io/Nullpunkt/> shows the new version beside the name (Pages
   deploys `main` a minute or two after the merge; *Actions* → *pages build and deployment* shows it).
2. **Publish**: the repository's page → **Releases** (right side) → **Draft a new release** → **Choose a tag** →
   type `vx.y.z` → **Create new tag: vx.y.z on publish**; *Target*: `main` → *Release title*: `Nullpunkt x.y.z` →
   paste the notes → leave *Set as a pre-release* unticked → **Publish release**.
3. **Delete the merged branch**: on the merged PR's page → **Delete branch**.
4. **Check**: the badge beside the name links to the new release; the README's version badge says `x.y.z`.
5. The repository's *About* and topics, if what the course holds changed.

## Release notes format

One sentence on what the release is about; five or so bullets, each a change a learner notices («Fixed: …» for
fixes); a bullet *Known limitations* when there are some; then:

```text
Use it:

- Online: https://mohsen-1984.github.io/Nullpunkt/
- Offline: Source code (zip) below — unpack it and open index.html

Full notes: CHANGELOG.md
```

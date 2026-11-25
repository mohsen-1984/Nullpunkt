# tools

Node 22+ scripts (no npm packages needed, except the CodeMirror build) and two pages.

| Tool | What it does |
|---|---|
| `check.js` | The checker: every checkable rule of the series bible; must report 0 errors, 0 warnings |
| `gen-expect.js` | Compiles and runs every code record and test with gcc and XCC into `data/generated/` (`--check` in CI) |
| `check-version.js` | The version in `site/config.js` agrees with `CHANGELOG.md` and `README.md` |
| `headless-lesson.js` | Uses every lesson in headless Chrome, every language: runs, solves, rejects (`--shots`) |
| `headless-shell.js` | The site chrome at 15 widths × 3 languages × 2 pages, the drawer and the search (`--shots` for the README) |
| `headless-lab.js` | The runner lab in headless Chrome |
| `build-tests.js` | `tests/lab.js` from the programs and gcc |
| `build-wcc.js` | `vendor/wcc/` from an XCC checkout |
| `build-icons.js` | `vendor/lucide/` from the Lucide release's SVG sources (only the icons the site uses) |
| [`codemirror/`](codemirror/) | The CodeMirror bundle's source; built in CI |
| [`runner-lab/`](runner-lab/) | A page that runs the lab in your browser |
| `og-image.html` | The source of `assets/og-image.png` and `assets/apple-touch-icon.png` |

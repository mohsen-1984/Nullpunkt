# site — the pages

Scripts and styles of `index.html` (home) and `lesson.html` (a lesson). All are classic scripts, so the site works
from `file://` and on GitHub Pages alike.

| File | What it does |
|---|---|
| `config.js` | **The one config object**: the version, the addresses, and every knob of the chrome, the rail and the search |
| `boot.js` | In `<head>`, before the first paint: theme, language and direction |
| `chrome.js` | The header (shedding ladder), the second row, the drawer, the scroll-spy and dot-nav, the theme, the language, the course rail — after the navigation-chrome v2 pattern |
| `course.js` | The learning path as the site shows it: the course tree, progress, links |
| `search.js` | The search dialog (<kbd>/</kbd>, <kbd>Ctrl</kbd> <kbd>K</kbd>) and the marking of the words on the page |
| `home.js` | The home page |
| `lesson.js` | A lesson: code that runs, exercises checked by tests, the generated blocks |
| `ui.js`, `ui-site.js` | Interface strings in the three languages |
| `shell.css` | Tokens (light and dark), the chrome, the rail, the search, the home page |
| `lesson.css` | The lesson's own parts: code boxes, mistakes, exercises |

To change how the navigation behaves, change `site/config.js`, not `chrome.js`. The pattern and its rationale:
navigation-chrome guide v2 (§ numbers in the comments). `node tools/headless-shell.js` checks the chrome at 15 widths
in every language.

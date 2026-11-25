# assets — pictures

| File | What it is | Made by |
|---|---|---|
| `favicon.svg` | The mark: a dotted zero on the accent color (also inline in each page's `<link rel="icon">`) | by hand, from `docs/rules/S00-assets.md` |
| `apple-touch-icon.png` | 180 × 180 icon for phones | `tools/og-image.html?icon` |
| `og-image.png` | 1200 × 630 link preview (Open Graph, X / Twitter) | `tools/og-image.html` |
| [`screenshots/`](screenshots/) | The README's screenshots | `node tools/headless-shell.js --shots assets/screenshots` |

The commands that make the PNGs are at the top of `tools/og-image.html`.

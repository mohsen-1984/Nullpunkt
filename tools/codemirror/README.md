# tools/codemirror — the editor bundle

`entry.js` is the source of `vendor/codemirror/codemirror_6.41.0.js`: CodeMirror 6 with the C language, bundled by
esbuild into one classic script that defines `window.NullpunktCM` (`create`, `highlight`). Tokens get the classes
`np-tok-*`, colored by `site/shell.css` with VS Code's Light+ and Dark+ colors. Package versions are pinned in
`package.json` and `package-lock.json`.

```sh
cd tools/codemirror && npm ci && node build.js
```

The bundle is built by GitHub Actions (`.github/workflows/vendor-codemirror.yml`) and CI checks that it matches.

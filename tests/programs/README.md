# tests/programs — the runner lab

Each file tests one thing the browser runner must do like gcc: `0x` programs run normally, `2x` must fail to compile,
`3x` must stop with a runtime error. A comment at the top of each file says what it checks. After a change:
`node tools/build-tests.js` regenerates `tests/lab.js` from gcc; the lab runs in Node (`tests/run-node.js`), in headless
Chrome (`tools/headless-lab.js`) and by hand (`tools/runner-lab/index.html`). Programs that rely on a known XCC gap
(`C.XCC.01`) are reported as gaps, not failures.

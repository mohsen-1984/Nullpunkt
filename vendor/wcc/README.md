# vendor/wcc — XCC's C compiler for WebAssembly

`wcc_659a177-033df0a.js` is [XCC](https://github.com/tyfkda/xcc) by tyfkda (MIT, see `LICENSE`) as one classic script, so the course loads it from `file://` with a `<script>` tag. It defines `window.WccBundle = { version, commit, patches, build, files }`: the compiler itself compiled to WebAssembly (`/usr/bin/cc`, 352 KB), its libc (`/usr/lib/wcrt0.a`, `/usr/lib/wlibc.a`) and headers (`/usr/include/*.h`). Binaries are in base64; bytes are not changed.

| | |
|---|---|
| XCC commit | `659a1773f20499864a8c3fdc7cd25cb506092bc1` (2026-11-14) |
| Patches | [`patches/`](patches/) — applied before the build; `build` names commit and patches: `659a177-033df0a` |
| `cc.wasm` SHA-256 | `ac110b28ab626e6cbf8da96c3617d36440f1a43b50bab7a99a9d4ff84e3d2425` |
| Made by | `tools/build-wcc.js` |

## Patches

Fixes the course needs before XCC has them. Each one is offered upstream as well
([`docs/upstream/`](../../docs/upstream/README.md)); when XCC takes it, the patch goes and the commit moves forward.

| Patch | What it fixes |
|---|---|
| `0001-scanf-c-scanset-suppression-eof.patch` | `scanf` reads `%c` (no space skipping), `%[…]`, `%*d`, `%hd`/`%hhd`, `%e`/`%g`, and returns `EOF` when the input ends before the first conversion (C17 7.21.6.2); `%s` stops at the end of the input |

## Rebuild

Needs Linux, gcc or clang, `llvm-ar` and Node 20+.

```sh
git clone https://github.com/tyfkda/xcc && cd xcc
git checkout 659a1773f20499864a8c3fdc7cd25cb506092bc1
for p in <nullpunkt>/vendor/wcc/patches/*.patch; do git apply "$p"; done
make wcc && make wcc-gen2          # cc.wasm, lib/wcrt0.a, lib/wlibc.a
cd <nullpunkt> && node tools/build-wcc.js <xcc checkout>
```

The build is reproducible: the same commit and patches give the same bundle. CI checks this
(`.github/workflows/ci.yml`, job `vendor`).

## Known gaps

What XCC does not do yet, and how lessons work around it, is listed in `docs/rules/C00-conventions.md` (`C.XCC.01`). The runner lab (`tools/runner-lab/`) keeps one program per gap and reports when a gap is fixed upstream.

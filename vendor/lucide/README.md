# vendor/lucide

`icons_1.80.0.js`: only the [Lucide](https://lucide.dev) 1.80.0 icons the site uses, as SVG bodies in
`window.NullpunktIcons.icons`. The list is every icon named in `data/S00-registry.js` and `data/S00-prompts.js`.
License: ISC (`LICENSE`).

```sh
git clone --depth 1 --branch 1.80.0 --filter=blob:none --sparse https://github.com/lucide-icons/lucide /tmp/lucide
git -C /tmp/lucide sparse-checkout set icons
node tools/build-icons.js /tmp/lucide 1.80.0
```

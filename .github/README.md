# .github

| File | What it does |
|---|---|
| `workflows/ci.yml` | On every push and pull request: generated results, checker, version, search tests, every lesson and the site shell in headless Chrome, the runner lab, and `vendor/` rebuilt and compared |
| `workflows/vendor-codemirror.yml` | Builds `vendor/codemirror/` when `tools/codemirror/` changes on a branch |

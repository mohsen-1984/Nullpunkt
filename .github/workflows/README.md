# .github/workflows

| File | What it does |
|---|---|
| `ci.yml` | On every push and pull request: generated results, checker, version, search tests, every lesson and the site shell in headless Chrome, the runner lab, and `vendor/` rebuilt and compared |
| `vendor-codemirror.yml` | Builds `vendor/codemirror/` when `tools/codemirror/` changes on a branch |

There is deliberately no `.github/README.md`: GitHub would show it on the repository's front page instead of the root `README.md`.

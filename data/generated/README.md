# data/generated — real compiler results

`expect.js` is written by `tools/gen-expect.js` and never by hand. For every code record and every exercise test it
holds what gcc 13.3 (`-std=c17 -Wall -Wextra -pedantic`, `LC_ALL=C`) and XCC (the browser's compiler) really did: the
messages, the output, the exit code, and whether the browser rejects each mistake. A hash of the input marks a
result as stale when the code changes; `node tools/gen-expect.js --check` (CI) fails on any difference.

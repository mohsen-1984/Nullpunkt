# data/generated — real compiler results

Every file here is written by `tools/gen-expect.js` and never by hand: one file per lesson, in the same folders as
the lessons (`C02-values-and-variables/L04.js`), and `outline.js`, the exercise items of every lesson (the path shows
progress from it without loading the lessons).

For every code record and every exercise test a lesson's file holds what the reference gcc — gcc 15, the default of
Ubuntu 26.04 LTS (`C.CMP.01`) — (`-std=c17 -Wall -Wextra -pedantic`, `LC_ALL=C`) and XCC (the browser's compiler)
really did: the messages, the output, the exit code, and whether the browser rejects each mistake. A hash of the input
marks a result as stale when the code changes; `node tools/gen-expect.js --check` (CI) fails on any difference. If
your own gcc is another version, push anyway: CI records the results with the reference gcc and commits them to your
pull request.

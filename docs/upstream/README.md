# docs/upstream — contributions to the projects Nullpunkt builds on

Nullpunkt works around a few gaps of [XCC](https://github.com/tyfkda/xcc) (list: `C.XCC.01` in
[`../rules/C00-conventions.md`](../rules/C00-conventions.md)). Fixing them upstream lets the lessons drop each workaround.
This folder holds what is ready to send: two tested patches with the text of their pull requests, and the text of two
issues.

The session that prepared them could not fork or open anything on github.com/tyfkda/xcc (the proxy allows writes only
to this repository), so they wait here to be sent by hand — see *Sending* at the end.

## 1. Pull request — `limits.h` constants, and `%td` / `%jd` in printf

**Patch:** [`xcc-0001-limits-and-printf-t-j.patch`](xcc-0001-limits-and-printf-t-j.patch), against commit
`659a1773f20499864a8c3fdc7cd25cb506092bc1`. Built with `make wcc` and tested with the program below; output before
and after:

| | before | after | gcc (x86-64) |
|---|---|---|---|
| `printf("%d %d %u", INT_MIN, INT_MAX, UINT_MAX)` | `-2147483648 -1 2147483647` | `-2147483648 2147483647 4294967295` | same as after |
| `sizeof(INT_MIN)` | `8` | `4` | `4` |
| `printf("[%td][%jd]", &a[3] - &a[0], (intmax_t)7)` | `[%td][%jd]` | `[3][7]` | `[3][7]` |

**Title:** `limits.h: give INT_MIN, LONG_MIN, LLONG_MIN their own types; printf: support %t and %j`

**Body:**

> `INT_MIN` is defined as `(-2147483648)`. The literal `2147483648` does not fit in `int`, so the expression has type
> `long` (or `long long` on ILP32), and `printf("%d", INT_MIN)` reads the wrong argument: on wasm32,
> `printf("%d %d %u\n", INT_MIN, INT_MAX, UINT_MAX)` prints `-2147483648 -1 2147483647`, and `sizeof(INT_MIN)` is 8.
> This patch writes the minimums the usual way, `(-2147483647 - 1)`, with the matching suffix for `long` and
> `long long`, and adds `U` / `UL` / `L` suffixes to `UINT_MAX`, `ULONG_MAX` and the ILP32 `LONG_MAX` so each constant
> has the type the standard asks for (C17 5.2.4.2.1).
>
> It also lets `vfprintf` accept the `t` (`ptrdiff_t`) and `j` (`intmax_t`) length modifiers (C17 7.21.6.1):
> `printf("%td", p - q)` printed `%td` literally. `t` takes the same width as `z`, `j` the width of `long long`.
>
> Context: I use XCC to run C in the browser for a free C course for beginners (https://github.com/mohsen-1984/Nullpunkt),
> where `INT_MIN` and pointer differences come up early. Thank you for XCC!

## 2. Issue — `_Static_assert` is not recognized

**Title:** `_Static_assert (C11) is not supported`

> ```c
> int main(void) {
>     _Static_assert(sizeof(int) == 4, "int is 4 bytes");
>     return 0;
> }
> ```
> XCC (659a177) reports `` `_Static_assert' undeclared ``. C11 6.7.10 makes `_Static_assert` a declaration, allowed at
> file scope and in a block; C23 adds `static_assert` as a keyword and lets the message be omitted. Would you accept a
> parser change that evaluates the constant expression and reports the message when it is zero? (XCC's own sources use
> a `STATIC_ASSERT` macro, so this may only be missing from the parser.)

## 3. Issue — error recovery repeats the same two messages up to the error limit

**Title:** `After a missing ',' or an unescaped '"', the same two errors repeat until the limit`

> ```c
> #include <stdio.h>
> int main(void) {
>     printf("%d\n" 7);
>     return 0;
> }
> ```
> XCC reports `` `,' or `)' expected ``, then alternates `` `;' expected `` and `expression expected` at the same
> column about 25 times. The same happens with `printf("She said "hi"\n");`. gcc gives one message for each. It looks
> like the parser does not advance past the token after the error. For beginners, one message is much easier to read
> than a screen of repeats — would skipping to the next `;` or `}` after an expression error be acceptable?

Nullpunkt's runner already cuts the repeats (`lib/CRunner.js`, `condense`), so this one is a nicety upstream.

## 4. Pull request — `scanf`: `%c`, scan sets, `%*`, and `EOF`

**Patch:** [`../../vendor/wcc/patches/0001-scanf-c-scanset-suppression-eof.patch`](../../vendor/wcc/patches/0001-scanf-c-scanset-suppression-eof.patch),
against commit `659a1773f20499864a8c3fdc7cd25cb506092bc1`. Unlike patch 1, the course already ships it: the vendored
compiler is built with it (`vendor/wcc/README.md`). XCC's own `libsrc/tests/scanf_test.c` still passes, and the lab
program `tests/programs/18-scanf.c` prints the same as glibc. Before and after, against glibc:

| Input · format | before | after | glibc |
|---|---|---|---|
| `12\nB` · `"%d"`, then `" %c"` | `0`, row unchanged | `1`, `B` | `1`, `B` |
| `\nB` · `"%c"` | `0` | `1`, `'\n'` | `1`, `'\n'` |
| (empty) · `"%d"` | `0` | `-1` (`EOF`) | `-1` |
| `row by the window` · `" %31[^\n]"` | `0` | `1`, `row by the window` | same |
| `1 2` · `"%*d %d"` | `0` | `1`, `2` | `1`, `2` |
| `300 -5` · `"%hd %hhd"` | `0` | `2` | `2` |

**Title:** `scanf: support %c, %[...], %* and h/hh/j/z/t; return EOF when the input ends first`

**Body:**

> `vfscanf` returned at the first `%c`, `%[` or `%*`, did not know the `h`, `hh`, `j`, `z` and `t` length modifiers,
> and returned 0 instead of `EOF` when the input ended before the first conversion (C17 7.21.6.2p16). `%s` also
> compared `fgetc`'s result with `'\0'` instead of `EOF`, so a word at the very end of the input was never terminated.
>
> This patch:
> - adds `%c` (with a width, no skipping of white space), `%[...]` (with `^` and ranges) and assignment suppression
>   (`%*d`);
> - parses `h`/`hh` (`short *`, `signed char *`), `j`, `z` and `t`; accepts `%e %g %a` (and upper case) like `%f`;
> - skips white space only before conversions other than `%c`, `%[` and `%n`, and returns `EOF` when the input ends
>   before the first conversion has completed; a literal `%%` skips white space first, as glibc does;
> - stops `%s` at `EOF`.
>
> `libsrc/tests/scanf_test.c` passes unchanged. Context: the free C course https://github.com/mohsen-1984/Nullpunkt
> runs its programs with XCC in the browser; its chapter on input teaches `scanf(" %c", …)` and the return value of
> `scanf`. Thank you for XCC!

## Sending

1. On https://github.com/tyfkda/xcc press **Fork**.
2. In the fork, open `include/limits.h`, press the pencil, make the changes of the patch, and choose *Create a new
   branch … and start a pull request*; then the same for `libsrc/stdio/vfprintf.c` on that branch. Paste the title and
   body above.
3. Open the two issues from the *Issues* tab with the texts above.
4. For the `scanf` pull request: in the fork, edit `libsrc/stdio/vfscanf.c` the same way (or apply the patch with
   `git am`), and paste its title and body.

Or give a later session write access to the fork, and it sends them with git.

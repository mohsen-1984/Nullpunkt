/* C00 — the C series as data (docs/rules/C00-conventions.md): lesson skeleton, construct ladder, allowed chunks,
   forbidden constructs. The checker uses the ladder to find structure leaks (S.CH.06). A construct's lesson is the
   lesson that introduces it; `match` says how the checker finds it in code:
     kw keyword · id identifier (function, type, macro) · header <name> or "name" · esc escape in a string or char ·
     fmt printf/scanf conversion (letters after %) · op operator · comment // or /* · pp preprocessor directive */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    function k(id, lesson, match) { return { id: id, lesson: lesson, match: match }; }
    N.files.C00 = {
        id: 'C00', kind: 'conventions', series: 'C', version: '0.1.0',

        // C.LES.01 — order of the blocks; `fixed` blocks must be present (from lesson `from` on)
        skeleton: [
            { block: 'why', fixed: true }, { block: 'cando', fixed: true, generated: true },
            { block: 'prior', fixed: true, from: 2 }, { block: 'predict', fixed: true },
            { block: 'example', fixed: true }, { block: 'machine', fixed: true }, { block: 'rule', fixed: true },
            { block: 'trace' }, { block: 'memory' }, { block: 'mistakes', fixed: true }, { block: 'errors', fixed: true },
            { block: 'fuller' }, { block: 'standard' }, { block: 'notyet' }, { block: 'practice', fixed: true },
            { block: 'make', fixed: true }, { block: 'exam' }, { block: 'ai', fixed: true },
            { block: 'terms', fixed: true, generated: true }, { block: 'selfcheck', fixed: true, generated: true },
            { block: 'key', fixed: true, generated: true },
        ],

        // the review unit at the end of each chapter (Review Unit Skeleton, C.ONP.01, C.EXA.01): all fixed, in this order
        reviewSkeleton: [
            { block: 'why' }, { block: 'practice' }, { block: 'onpc' }, { block: 'exam' }, { block: 'ai' },
            { block: 'selfcheck', generated: true }, { block: 'key', generated: true },
        ],

        // C.ORI.01 — orientation lessons (chapter 0): no construct is taught, so the code skeleton does not apply.
        // Fixed: why first, cando, then any of the `allowed` blocks (section may repeat), practice, terms, selfcheck, key.
        orientation: {
            first: ['why', 'cando'], last: ['practice', 'ai', 'terms', 'selfcheck', 'key'], required: ['why', 'cando', 'practice', 'terms', 'selfcheck', 'key'],
            allowed: ['section', 'prior', 'predict', 'example', 'machine', 'notyet'],
        },

        constructs: [
            k('K.fn-printf', 1, { id: 'printf' }), k('K.esc-n', 1, { esc: 'n' }), k('K.comment-line', 1, { comment: '//' }),
            k('K.fmt-d', 3, { fmt: 'd' }), k('K.op-add', 3, { op: '+' }), k('K.op-sub', 3, { op: '-' }),
            k('K.op-mul', 3, { op: '*' }), k('K.esc-t', 3, { esc: 't' }), k('K.esc-backslash', 3, { esc: '\\' }),
            k('K.esc-quote', 3, { esc: '"' }), k('K.comment-block', 3, { comment: '/*' }),
            k('K.int', 4, { kw: 'int' }), k('K.op-assign', 4, { op: '=' }),
            k('K.double', 5, { kw: 'double' }), k('K.float', 5, { kw: 'float' }), k('K.long', 5, { kw: 'long' }),
            k('K.short', 5, { kw: 'short' }), k('K.fmt-f', 5, { fmt: 'f' }), k('K.fmt-lld', 5, { fmt: 'lld' }),
            k('K.op-div', 6, { op: '/' }), k('K.op-mod', 6, { op: '%' }), k('K.op-paren-cast', 6, { op: 'cast' }),
            k('K.op-compound', 6, { op: '+=' }), k('K.op-compound-sub', 6, { op: '-=' }), k('K.op-compound-mul', 6, { op: '*=' }),
            k('K.op-compound-div', 6, { op: '/=' }), k('K.op-compound-mod', 6, { op: '%=' }),
            k('K.op-inc', 6, { op: '++' }), k('K.op-dec', 6, { op: '--' }),
            k('K.char', 7, { kw: 'char' }), k('K.fmt-c', 7, { fmt: 'c' }), k('K.esc-0', 7, { esc: '0' }),
            k('K.esc-squote', 7, { esc: "'" }),
            k('K.fmt-percent', 8, { fmt: '%' }), k('K.fmt-width', 8, { fmt: 'width' }),
            k('K.fn-scanf', 9, { id: 'scanf' }), k('K.op-addr', 9, { op: '&' }), k('K.fmt-lf', 9, { fmt: 'lf' }),
            k('K.fn-getchar', 10, { id: 'getchar' }), k('K.eof', 10, { id: 'EOF' }),
            k('K.op-eq', 11, { op: '==' }), k('K.op-ne', 11, { op: '!=' }), k('K.op-lt', 11, { op: '<' }),
            k('K.op-le', 11, { op: '<=' }), k('K.op-gt', 11, { op: '>' }), k('K.op-ge', 11, { op: '>=' }),
            k('K.h-stdbool', 11, { header: 'stdbool.h' }), k('K.bool', 11, { id: 'bool' }),
            k('K.true', 11, { id: 'true' }), k('K.false', 11, { id: 'false' }),
            k('K.if', 12, { kw: 'if' }), k('K.else', 12, { kw: 'else' }),
            k('K.op-and', 13, { op: '&&' }), k('K.op-or', 13, { op: '||' }), k('K.op-not', 13, { op: '!' }),
            k('K.op-cond', 13, { op: '?' }),
            k('K.switch', 14, { kw: 'switch' }), k('K.case', 14, { kw: 'case' }), k('K.default', 14, { kw: 'default' }),
            k('K.break', 14, { kw: 'break' }),
            k('K.while', 15, { kw: 'while' }), k('K.for', 16, { kw: 'for' }),
            k('K.do', 17, { kw: 'do' }), k('K.continue', 17, { kw: 'continue' }),
            k('K.fn-rand', 17, { id: 'rand' }), k('K.fn-srand', 17, { id: 'srand' }), k('K.fn-time', 17, { id: 'time' }),
            k('K.void', 20, { kw: 'void' }), k('K.return', 20, { kw: 'return' }),
            k('K.h-math', 21, { header: 'math.h' }), k('K.fn-sqrt', 21, { id: 'sqrt' }), k('K.fn-pow', 21, { id: 'pow' }),
            k('K.static', 22, { kw: 'static' }),
            k('K.sizeof', 24, { kw: 'sizeof' }), k('K.size-t', 24, { id: 'size_t' }), k('K.fmt-zu', 24, { fmt: 'zu' }),
            k('K.op-index', 24, { op: '[' }),
            k('K.fmt-s', 27, { fmt: 's' }),
            k('K.h-string', 28, { header: 'string.h' }), k('K.h-ctype', 28, { header: 'ctype.h' }),
            k('K.fn-strlen', 28, { id: 'strlen' }), k('K.fn-strcpy', 28, { id: 'strcpy' }), k('K.fn-strncpy', 28, { id: 'strncpy' }),
            k('K.fn-strcmp', 28, { id: 'strcmp' }), k('K.fn-strcat', 28, { id: 'strcat' }),
            k('K.null', 29, { id: 'NULL' }), k('K.fmt-p', 29, { fmt: 'p' }),
            k('K.const', 32, { kw: 'const' }),
            k('K.struct', 33, { kw: 'struct' }), k('K.op-arrow', 33, { op: '->' }),
            k('K.typedef', 34, { kw: 'typedef' }), k('K.enum', 34, { kw: 'enum' }),
            k('K.h-stdlib', 36, { header: 'stdlib.h' }), k('K.fn-malloc', 36, { id: 'malloc' }), k('K.fn-free', 36, { id: 'free' }),
            k('K.fn-exit', 36, { id: 'exit' }), k('K.fn-calloc', 37, { id: 'calloc' }), k('K.fn-realloc', 37, { id: 'realloc' }),
            k('K.file', 40, { id: 'FILE' }), k('K.fn-fopen', 40, { id: 'fopen' }), k('K.fn-fclose', 40, { id: 'fclose' }),
            k('K.fn-fprintf', 40, { id: 'fprintf' }), k('K.fn-fscanf', 40, { id: 'fscanf' }), k('K.fn-perror', 40, { id: 'perror' }),
            k('K.fn-fgets', 41, { id: 'fgets' }), k('K.fn-sscanf', 41, { id: 'sscanf' }), k('K.fn-strtol', 41, { id: 'strtol' }),
            k('K.extern', 42, { kw: 'extern' }), k('K.pp-include-local', 42, { pp: 'include-local' }),
            k('K.pp-ifndef', 42, { pp: 'ifndef' }), k('K.pp-endif', 42, { pp: 'endif' }),
            k('K.pp-define', 43, { pp: 'define' }), k('K.pp-if', 43, { pp: 'if' }), k('K.pp-ifdef', 43, { pp: 'ifdef' }),
            k('K.h-assert', 46, { header: 'assert.h' }), k('K.assert', 46, { id: 'assert' }),
            k('K.op-bor', 48, { op: '|' }), k('K.op-xor', 48, { op: '^' }), k('K.op-bnot', 48, { op: '~' }),
            k('K.op-shl', 48, { op: '<<' }), k('K.op-shr', 48, { op: '>>' }), k('K.unsigned', 48, { kw: 'unsigned' }),
            k('K.signed', 48, { kw: 'signed' }), k('K.h-stdint', 48, { header: 'stdint.h' }),
            k('K.fn-qsort', 50, { id: 'qsort' }),
            k('K.volatile', 54, { kw: 'volatile' }), k('K.union', 54, { kw: 'union' }),
            // not taught in 1.0 (C.SCP.01): any use is a leak
            k('K.goto', 99, { kw: 'goto' }),
            k('K.register', 99, { kw: 'register' }), k('K.inline', 99, { kw: 'inline' }), k('K.restrict', 99, { kw: 'restrict' }),
            k('K.h-stdarg', 99, { header: 'stdarg.h' }), k('K.h-setjmp', 99, { header: 'setjmp.h' }),
        ],

        // C.CHK.01 — the only code allowed before the lesson that explains it; `match` is removed before the ladder check
        chunks: [
            { id: 'CH.main-frame', from: 1, explainedIn: ['C.L20', 'C.L42'],
              match: ['#include <stdio.h>', 'int main(void) {', 'return 0;'] },
            // a random number before its parts are taught (C.TOP.01): the headers, and seeding from the clock
            { id: 'CH.rand-seed', from: 17, explainedIn: ['C.L36', 'C.L42'],
              match: ['#include <stdlib.h>', '#include <time.h>', 'srand((unsigned) time(NULL));'] },
        ],

        // C.FRB.01 — never, in any lesson
        forbidden: [{ id: 'gets', match: { id: 'gets' } }],
    };
})(typeof window !== 'undefined' ? window : globalThis);

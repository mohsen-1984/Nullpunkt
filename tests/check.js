/**
 * Lab checker — shared by the page (window.CLabCheck) and Node (tests/run-node.js).
 * check(entry, result, stdout) → { pass, got, known? } where `got` says in a few words what happened.
 * Entries with `knownGap` are expected to fail (C.XCC.01); they pass while they fail.
 */
(function (g) {
    'use strict';
    function check(t, r, out) {
        const v = checkOne(t, r, out);
        if (!t.knownGap) return v;
        // a known XCC gap must still fail; if it passes, the gap is gone and the lab must be updated
        return v.pass ? { pass: false, got: 'known gap now passes — remove it from KNOWN_GAP and C.XCC.01' }
            : { pass: true, known: true, got: 'known XCC gap: ' + t.knownGap + ' (' + v.got + ')' };
    }
    function checkOne(t, r, out) {
        if (t.kind === 'compile-error') {
            if (r.ok || r.stage !== 'compile') return { pass: false, got: 'compiled (no error)' };
            const d = (r.diagnostics || [])[0];
            if (!d) return { pass: false, got: 'error without a line: ' + (r.compileLog || '').split('\n')[0] };
            return { pass: d.line === t.line, got: 'line ' + d.line + ': ' + d.message };
        }
        if (r.stage === 'compile' && !r.ok) {
            const d = (r.diagnostics || [])[0];
            return { pass: false, got: 'compile error' + (d ? ' line ' + d.line + ': ' + d.message : ': ' + (r.compileLog || '').split('\n')[0]) };
        }
        if (t.timeout) return { pass: !!r.timedOut, got: r.timedOut ? 'stopped after the time limit' : describe(r) };
        if (t.trap) return { pass: r.trap === t.trap, got: describe(r) };
        if (t.exitCode != null) return { pass: r.exitCode === t.exitCode && (t.expect == null || out === t.expect), got: describe(r) };
        if (r.trap || r.timedOut || r.error) return { pass: false, got: describe(r) };
        return { pass: out === t.expect, got: out === t.expect ? 'output matches gcc' : 'output differs' };
    }
    function describe(r) {
        if (r.timedOut) return 'timed out';
        if (r.error) return 'error: ' + r.error.split('\n')[0];
        if (r.trap) return 'trap: ' + r.trap + (r.trapMessage ? ' (' + r.trapMessage + ')' : '');
        return 'exit code ' + r.exitCode;
    }
    g.CLabCheck = check;
    if (typeof module !== 'undefined' && module.exports) module.exports = check;
})(typeof window !== 'undefined' ? window : globalThis);

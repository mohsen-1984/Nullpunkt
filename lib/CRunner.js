/**
 * CRunner — compile and run C in the browser with XCC's wcc (vendor/wcc/) and WasiShim (lib/WasiShim.js).
 *
 * Loads from file:// as classic scripts: <script src="lib/WasiShim.js">, <script src="vendor/wcc/wcc_….js">,
 * <script src="lib/CRunner.js">. Runs in a Worker built from a Blob (the source of the two factories below), so a
 * program that never ends can be stopped (worker.terminate()); if the browser refuses the Worker, it runs on the
 * page itself (no Stop for endless loops then — the output limit still applies).
 *
 *   const runner = await CRunner.create({ bundle: window.WccBundle });
 *   const r = await runner.run(source, {
 *       stdin: '3 4\n',                 // prepared input; or
 *       onInput: async () => line|null,  // interactive input (needs JSPI; falls back to `stdin`)
 *       onOutput: (text, isErr) => …,    // streamed program output
 *       timeoutMs: 5000 });
 *   r = { ok, stage: 'compile'|'run', diagnostics: [{line, col, message}], compileLog, exitCode,
 *         trap, timedOut, compileMs, runMs, mode: 'worker'|'inline', jspi }
 */
(function (g) {
    'use strict';

    /** The engine: same code on the page, in the Worker and in Node tests. No outer references. */
    function engineFactory(WasiShimFactory, bundle) {
        const { MemFs, Wasi } = WasiShimFactory();
        const base = new MemFs();
        let ccBytes = null;
        for (const p of Object.keys(bundle.files)) {
            const v = bundle.files[p];
            let data;
            if (v.startsWith('base64:')) {
                const bin = atob(v.slice(7)), u = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
                data = u;
            } else data = v;
            base.writeFile(p, data);
            if (p === '/usr/bin/cc') ccBytes = data;
        }
        base.mkdirp('/tmp');
        base.mkdirp('/home/user');
        const ccModule = new WebAssembly.Module(ccBytes);
        const now = function () { return typeof performance !== 'undefined' ? performance.now() : Date.now(); };

        // Prelude, linked into every program: flush stdout before reading stdin, as a terminal does (glibc does
        // this for line-buffered stdout), so a prompt printed with printf("n? ") shows before the program waits.
        // It replaces libc's read() (same code plus the flush); XCC's libc itself has no such flush.
        const PRELUDE = '#include <stdio.h>\n#include <unistd.h>\n#include <errno.h>\n#include <wasi.h>\n' +
            'ssize_t read(int fd, void *buf, size_t size) {\n' +
            '  if (fd == 0) { fflush(stdout); fflush(stderr); }\n' +
            '  Iov iov; iov.str = buf; iov.n = size; size_t got;\n' +
            '  if (fd_read(fd, &iov, 1, &got) == 0) return got;\n' +
            '  errno = EIO; return -1;\n}\n';
        (function buildPrelude() {
            base.writeFile('/usr/lib/clab_prelude.c', PRELUDE);
            let log = '';
            const code = new Wasi({ fs: base, args: ['/usr/bin/cc', '-c', '-o', '/usr/lib/clab_prelude.o', '/usr/lib/clab_prelude.c'],
                env: { PWD: '/' }, stderr: function (t) { log += t; }, stdout: function (t) { log += t; } }).run(ccModule);
            if (code !== 0) throw new Error('prelude: ' + log);
        })();

        /** "main.c(12): message" + source line + caret line → {line, col, message} */
        function parseDiagnostics(log) {
            const lines = log.split('\n'), out = [];
            for (let i = 0; i < lines.length; i++) {
                const m = lines[i].match(/^(?:\/home\/user\/)?([^()\s]+)\((\d+)\): (.*)$/);
                if (!m) continue;
                let col = null;
                if (i + 2 < lines.length && /^\s*\^\s*$/.test(lines[i + 2])) col = lines[i + 2].indexOf('^') + 1;
                out.push({ file: m[1], line: +m[2], col, message: m[3] });
            }
            return out;
        }

        /** XCC's error recovery can loop ("`;' expected" / "expression expected" until its error limit). Keep the
         *  messages up to the first one that repeats an earlier message word for word, and say what was cut. */
        function condense(log) {
            const blocks = [];
            log.split('\n').forEach(l => {
                if (/^(?:\/home\/user\/)?[^()\s]+\(\d+\): /.test(l) || !blocks.length) blocks.push([l]);
                else blocks[blocks.length - 1].push(l);
            });
            const seen = new Set();
            for (let i = 0; i < blocks.length; i++) {
                const key = blocks[i].join('\n');
                if (seen.has(key) && /\(\d+\): /.test(blocks[i][0])) {
                    return blocks.slice(0, i).map(b => b.join('\n')).join('\n').replace(/\n*$/, '\n') +
                        '(' + (blocks.length - i) + ' more messages cut: they repeat the ones above)\n';
                }
                seen.add(key);
            }
            return log;
        }

        const TRAPS = [
            [/divide by zero/i, 'divide-by-zero'],
            [/out of bounds|memory access/i, 'memory-out-of-bounds'],
            [/call stack|stack overflow|too much recursion/i, 'stack-overflow'],
            [/unreachable/i, 'unreachable'],
            [/integer overflow/i, 'integer-overflow'],
            [/indirect call|signature mismatch|null function|table index/i, 'bad-function-pointer'],
        ];

        return {
            compile(source, opts) {
                opts = opts || {};
                const fs = base.clone(), name = opts.fileName || 'main.c';
                fs.writeFile('/home/user/' + name, source);
                let log = '';
                // 1 MiB stack (XCC's default is 8 KiB — too small for a local int a[10000])
                const args = ['/usr/bin/cc', '-o', '/home/user/a.wasm', '--stack-size=' + (opts.stackSize || 1048576)].concat(opts.flags || [], ['/home/user/' + name, '/usr/lib/clab_prelude.o']);
                const t0 = now();
                const code = new Wasi({ fs, args, env: { PWD: '/home/user' },
                    stdout: function (s) { log += s; }, stderr: function (s) { log += s; } }).run(ccModule);
                const ms = now() - t0;
                log = condense(log);
                const wasm = code === 0 ? fs.readFile('/home/user/a.wasm') : null;
                return { ok: !!wasm, exitCode: code, log: log.replace(/\/home\/user\//g, ''), diagnostics: parseDiagnostics(log), wasm, ms };
            },

            /** Runs a compiled program. io: { stdin, onInput (async), onOutput(text, isErr), files } */
            async run(wasm, io) {
                const fs = new MemFs();
                fs.mkdirp('/home/user');
                fs.mkdirp('/tmp');
                if (io.files) for (const p of Object.keys(io.files)) fs.writeFile('/home/user/' + p, io.files[p]);
                const interactive = !!io.onInput && Wasi.hasJspi;
                const wasi = new Wasi({
                    fs, args: ['main'].concat(io.args || []), env: { PWD: '/home/user' },
                    stdin: interactive ? io.onInput : (io.stdin || ''),
                    stdout: function (s) { io.onOutput(s, false); },
                    stderr: function (s) { io.onOutput(s, true); },
                });
                const mod = new WebAssembly.Module(wasm);
                const t0 = now();
                let exitCode = null, trap = null, message = null;
                try {
                    exitCode = interactive ? await wasi.runAsync(mod) : wasi.run(mod);
                } catch (e) {
                    message = String(e && e.message || e);
                    trap = 'runtime-error';
                    for (const [re, kind] of TRAPS) if (re.test(message)) { trap = kind; break; }
                    if (e instanceof RangeError && /stack/i.test(message)) trap = 'stack-overflow';
                }
                if (exitCode === 'output-limit') { exitCode = null; trap = 'output-limit'; }
                // NULL guard: in wasm, address 0 is ordinary memory (the far end of XCC's stack), so *NULL = x does
                // not crash. The first bytes stay zero unless the program wrote through a NULL pointer: report it.
                if (trap == null && wasi.memory) {
                    const low = new Uint8Array(wasi.memory.buffer, 0, 64);
                    if (low.some(function (b) { return b !== 0; })) trap = 'null-write';
                }
                // files the program wrote, so the page can show them
                const written = {};
                for (const [p, d] of fs.files) if (p.startsWith('/home/user/')) written[p.slice(11)] = new TextDecoder().decode(d);
                return { exitCode, trap, trapMessage: message, ms: now() - t0, interactive, files: written };
            },
            jspi: Wasi.hasJspi,
        };
    }

    /** Worker main: receives the factories' source through the Blob, the bundle through postMessage. */
    function workerMain(WasiShimFactory, engineFactory) {
        let engine = null, pendingInput = null;
        self.onmessage = async function (ev) {
            const m = ev.data;
            if (m.type === 'init') {
                try {
                    engine = engineFactory(WasiShimFactory, m.bundle);
                    self.postMessage({ type: 'ready', jspi: engine.jspi });
                } catch (e) { self.postMessage({ type: 'fatal', error: String(e && e.stack || e) }); }
            } else if (m.type === 'stdin') {
                if (pendingInput) { const r = pendingInput; pendingInput = null; r(m.text); }
            } else if (m.type === 'run') {
                const id = m.id;
                try {
                    const c = engine.compile(m.source, m.options);
                    self.postMessage({ type: 'compiled', id, compile: { ok: c.ok, log: c.log, diagnostics: c.diagnostics, ms: c.ms } });
                    if (!c.ok || m.compileOnly) { self.postMessage({ type: 'done', id }); return; }
                    const r = await engine.run(c.wasm, {
                        stdin: m.stdin, args: m.args, files: m.files,
                        onInput: m.interactive ? function () {
                            return new Promise(function (resolve) {
                                pendingInput = resolve;
                                self.postMessage({ type: 'stdin-request', id });
                            });
                        } : null,
                        onOutput: function (text, isErr) { self.postMessage({ type: 'out', id, text, isErr }); },
                    });
                    self.postMessage({ type: 'done', id, run: r });
                } catch (e) { self.postMessage({ type: 'done', id, error: String(e && e.stack || e) }); }
            }
        };
    }

    class CRunner {
        static async create(opts) {
            const r = new CRunner(opts);
            await r._start();
            return r;
        }
        constructor(opts) {
            this.bundle = opts.bundle;
            this.preferInline = !!opts.inline;
            this.mode = null;
            this.worker = null;
            this.engine = null;
            this.seq = 0;
            this.jspi = false;
            this.workerError = null;
        }

        async _start() {
            if (!this.preferInline && typeof Worker !== 'undefined' && typeof Blob !== 'undefined') {
                try {
                    await this._startWorker();
                    this.mode = 'worker';
                    return;
                } catch (e) { this.workerError = String(e && e.message || e); }
            }
            this.engine = engineFactory(g.WasiShimFactory, this.bundle);
            this.jspi = this.engine.jspi;
            this.mode = 'inline';
        }

        _startWorker() {
            const self = this;
            const src = '"use strict";\n(' + workerMain.toString() + ')(' + g.WasiShimFactory.toString() + ', ' +
                engineFactory.toString() + ');\n';
            const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
            return new Promise(function (resolve, reject) {
                let w;
                try { w = new Worker(url); } catch (e) { URL.revokeObjectURL(url); reject(e); return; }
                const timer = setTimeout(function () { w.terminate(); reject(new Error('worker did not start')); }, 15000);
                w.onerror = function (e) { clearTimeout(timer); w.terminate(); reject(new Error(e.message || 'worker error')); };
                w.onmessage = function (ev) {
                    if (ev.data.type === 'ready') {
                        clearTimeout(timer);
                        URL.revokeObjectURL(url);
                        self.worker = w;
                        self.jspi = ev.data.jspi;
                        resolve();
                    } else if (ev.data.type === 'fatal') { clearTimeout(timer); w.terminate(); reject(new Error(ev.data.error)); }
                };
                w.postMessage({ type: 'init', bundle: self.bundle });
            });
        }

        /** Stops a running program (worker mode): the Worker is ended and a fresh one started. */
        async stop() {
            if (this.mode !== 'worker' || !this.worker) return false;
            this.worker.terminate();
            this.worker = null;
            if (this._finishCurrent) this._finishCurrent({ stopped: true });
            this._ready = this._startWorker();
            await this._ready;
            return true;
        }

        async run(source, opts) {
            opts = opts || {};
            const onOutput = opts.onOutput || function () {};
            const interactive = !!opts.onInput && this.jspi;
            const base = { mode: this.mode, jspi: this.jspi, interactive };

            if (this.mode === 'inline') {
                const c = this.engine.compile(source, opts.compileOptions);
                const res = Object.assign(base, { stage: 'compile', ok: c.ok, compileLog: c.log, diagnostics: c.diagnostics, compileMs: c.ms });
                if (!c.ok || opts.compileOnly) return res;
                const r = await this.engine.run(c.wasm, { stdin: opts.stdin, args: opts.args, files: opts.files,
                    onInput: interactive ? opts.onInput : null, onOutput });
                return Object.assign(res, this._runResult(r));
            }

            if (this._ready) await this._ready;   // a fresh Worker after Stop or a time-out
            const self = this, id = ++this.seq, w = this.worker;
            return new Promise(function (resolve) {
                const res = Object.assign(base, { stage: 'compile', ok: false });
                let timer = null;
                const finish = function (extra) {
                    if (timer) clearTimeout(timer);
                    self._finishCurrent = null;
                    if (extra && extra.stopped) Object.assign(res, { stage: 'run', ok: false, stopped: true });
                    if (extra && extra.timedOut) Object.assign(res, { stage: 'run', ok: false, timedOut: true });
                    resolve(res);
                };
                self._finishCurrent = finish;
                w.onmessage = async function (ev) {
                    const m = ev.data;
                    if (m.id !== id) return;
                    if (m.type === 'compiled') {
                        Object.assign(res, { ok: m.compile.ok, compileLog: m.compile.log, diagnostics: m.compile.diagnostics, compileMs: m.compile.ms });
                        // the time limit counts running only, and is paused while waiting for input
                        if (m.compile.ok && !opts.compileOnly && opts.timeoutMs) timer = setTimeout(onTimeout, opts.timeoutMs);
                    } else if (m.type === 'out') onOutput(m.text, m.isErr);
                    else if (m.type === 'stdin-request') {
                        if (timer) { clearTimeout(timer); timer = null; }
                        const line = await opts.onInput();
                        if (opts.timeoutMs) timer = setTimeout(onTimeout, opts.timeoutMs);
                        w.postMessage({ type: 'stdin', text: line });
                    } else if (m.type === 'done') {
                        if (m.error) Object.assign(res, { stage: 'run', ok: false, error: m.error });
                        else if (m.run) Object.assign(res, self._runResult(m.run));
                        finish();
                    }
                };
                const onTimeout = function () {
                    w.terminate();
                    self.worker = null;
                    self._ready = self._startWorker();   // ready again for the next run
                    finish({ timedOut: true });
                };
                w.postMessage({ type: 'run', id, source, stdin: opts.stdin || '', interactive, args: opts.args,
                    files: opts.files, options: opts.compileOptions, compileOnly: !!opts.compileOnly });
            });
        }

        _runResult(r) {
            return { stage: 'run', ok: r.trap == null && r.exitCode === 0, exitCode: r.exitCode, trap: r.trap,
                trapMessage: r.trapMessage, runMs: r.ms, files: r.files };
        }
    }

    CRunner.engineFactory = engineFactory;
    g.CRunner = CRunner;
    if (typeof module !== 'undefined' && module.exports) module.exports = CRunner;
})(typeof window !== 'undefined' ? window : globalThis);

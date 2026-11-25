/**
 * WasiShim — a small WASI (wasi_snapshot_preview1) host with an in-memory file system.
 *
 * Enough for XCC's compiler (cc.wasm) and for the programs it builds: args, environment, clock, random,
 * files (open/read/write/seek/stat/unlink/mkdir), stdin/stdout/stderr and exit. Any other WASI call
 * answers ENOSYS (52), so an unknown import never stops a module from loading.
 *
 * Classic script, no dependencies: works from file://, in a Worker (its source is passed into a Blob)
 * and in Node.js (tests). The whole file is one factory function so the Worker can take its source text.
 *
 *   const { MemFs, Wasi, ExitError } = WasiShimFactory();
 *   const fs = new MemFs();  fs.writeFile('/tmp/a.c', 'int main(void){return 0;}');
 *   const wasi = new Wasi({ fs, args: ['cc', '/tmp/a.c'], stdout: s => …, stderr: s => …, stdin: 'text' });
 *   const code = wasi.run(module)            // synchronous; stdin is a string (or '' for none)
 *   const code = await wasi.runAsync(module) // JSPI: stdin is an async () => string|null (null = end of input)
 */
function WasiShimFactory() {
    'use strict';

    const E = { SUCCESS: 0, BADF: 8, EXIST: 20, INVAL: 28, ISDIR: 31, NOENT: 44, NOSYS: 52, NOTDIR: 54, NOTEMPTY: 55, SPIPE: 70 };
    const FT = { CHAR: 2, DIR: 3, FILE: 4 };
    const O = { CREAT: 1, DIRECTORY: 2, EXCL: 4, TRUNC: 8 };
    const FD_APPEND = 1;

    class ExitError extends Error {
        constructor(code) { super('exit ' + code); this.code = code; }
    }

    // ---------- in-memory file system: path → Uint8Array (files) or true (directories) ----------
    class MemFs {
        constructor() { this.files = new Map(); this.dirs = new Set(['/']); }
        static norm(p) {
            const out = [];
            for (const part of p.split('/')) {
                if (!part || part === '.') continue;
                if (part === '..') out.pop(); else out.push(part);
            }
            return '/' + out.join('/');
        }
        static parent(p) { return p === '/' ? '/' : p.slice(0, p.lastIndexOf('/')) || '/'; }
        mkdirp(p) {
            p = MemFs.norm(p);
            while (!this.dirs.has(p)) { this.dirs.add(p); p = MemFs.parent(p); }
        }
        writeFile(p, data) {
            p = MemFs.norm(p);
            this.mkdirp(MemFs.parent(p));
            this.files.set(p, typeof data === 'string' ? new TextEncoder().encode(data) : data);
        }
        readFile(p) { return this.files.get(MemFs.norm(p)) || null; }
        readText(p) { const d = this.readFile(p); return d ? new TextDecoder().decode(d) : null; }
        exists(p) { p = MemFs.norm(p); return this.files.has(p) || this.dirs.has(p); }
        isDir(p) { return this.dirs.has(MemFs.norm(p)); }
        unlink(p) { return this.files.delete(MemFs.norm(p)); }
        rmdir(p) {
            p = MemFs.norm(p);
            const prefix = p + '/';
            for (const k of this.files.keys()) if (k.startsWith(prefix)) return E.NOTEMPTY;
            for (const k of this.dirs) if (k.startsWith(prefix)) return E.NOTEMPTY;
            return this.dirs.delete(p) ? E.SUCCESS : E.NOENT;
        }
        /** A copy sharing the file contents (files are replaced on write, never changed in place). */
        clone() { const c = new MemFs(); c.files = new Map(this.files); c.dirs = new Set(this.dirs); return c; }
    }

    // ---------- open file description ----------
    class OpenFile {
        constructor(fs, path, append) { this.fs = fs; this.path = path; this.pos = 0; this.append = append; }
        get data() { return this.fs.files.get(this.path) || new Uint8Array(0); }
        read(n) {
            const d = this.data, chunk = d.subarray(this.pos, Math.min(d.length, this.pos + n));
            this.pos += chunk.length;
            return chunk;
        }
        write(bytes) {
            let d = this.data;
            if (this.append) this.pos = d.length;
            const end = this.pos + bytes.length;
            if (end > d.length) { const g = new Uint8Array(end); g.set(d); d = g; } else d = d.slice();
            d.set(bytes, this.pos);
            this.fs.files.set(this.path, d);
            this.pos = end;
        }
    }

    class Wasi {
        /**
         * @param {object} o
         *   fs      MemFs (shared by reference)
         *   args    string[]   argv
         *   env     object     environment variables
         *   cwd     string     current directory (default env.PWD or '/'), preopened as '.'
         *   stdin   string | async () => (string|null)
         *   stdout, stderr  (text: string) => void   — called with decoded UTF-8 chunks
         */
        constructor(o) {
            this.fs = o.fs || new MemFs();
            this.args = o.args || ['main'];
            this.env = o.env || {};
            this.out = { 1: o.stdout || function () {}, 2: o.stderr || function () {} };
            this.stdinSource = o.stdin == null ? '' : o.stdin;
            this.stdinBuf = typeof this.stdinSource === 'string' ? new TextEncoder().encode(this.stdinSource) : new Uint8Array(0);
            this.stdinEof = typeof this.stdinSource === 'string';
            this.decoders = { 1: new TextDecoder(), 2: new TextDecoder() };
            this.memory = null;
            // preopened directories: fd 3 = '/', fd 4 = '.' (the current directory; XCC's libc opens relative
            // paths through the preopen named '.', since its own cwd is ".")
            this.cwd = MemFs.norm(o.cwd || (this.env.PWD || '/'));
            this.preopens = [{ name: '/', dir: '/' }, { name: '.', dir: this.cwd }];
            this.fds = new Map();
            this.preopens.forEach((p, i) => this.fds.set(3 + i, { dir: p.dir, preopen: p.name }));
            this.nextFd = 3 + this.preopens.length;
            this.bytesOut = 0;
            this.maxOut = o.maxOutput || 1e6;   // runaway printf guard
        }

        view() { return new DataView(this.memory.buffer); }
        bytes() { return new Uint8Array(this.memory.buffer); }
        str(ptr, len) { return new TextDecoder().decode(this.bytes().subarray(ptr, ptr + len)); }
        resolve(dirFd, ptr, len) {
            const d = this.fds.get(dirFd);
            if (!d || d.dir == null) return null;
            const p = this.str(ptr, len);
            return MemFs.norm(p.startsWith('/') ? p : d.dir + '/' + p);
        }
        iovecs(iovs, n) {
            const v = this.view(), list = [];
            for (let i = 0; i < n; i++) list.push([v.getUint32(iovs + i * 8, true), v.getUint32(iovs + i * 8 + 4, true)]);
            return list;
        }
        writeFilestat(ptr, type, size) {
            const v = this.view();
            for (let i = 0; i < 64; i += 8) v.setBigUint64(ptr + i, 0n, true);
            v.setUint8(ptr + 16, type);
            v.setBigUint64(ptr + 24, 1n, true);
            v.setBigUint64(ptr + 32, BigInt(size), true);
        }
        /** Copy from the stdin buffer into the iovecs; returns bytes read. */
        readStdinInto(list) {
            let total = 0;
            const b = this.bytes();
            for (const [buf, len] of list) {
                const n = Math.min(len, this.stdinBuf.length);
                b.set(this.stdinBuf.subarray(0, n), buf);
                this.stdinBuf = this.stdinBuf.subarray(n);
                total += n;
                if (n < len) break;
            }
            return total;
        }

        imports(asyncStdin) {
            const self = this;
            const w = {
                args_sizes_get(argcPtr, sizePtr) {
                    const v = self.view();
                    v.setUint32(argcPtr, self.args.length, true);
                    v.setUint32(sizePtr, self.args.reduce((s, a) => s + new TextEncoder().encode(a).length + 1, 0), true);
                    return E.SUCCESS;
                },
                args_get(argvPtr, bufPtr) {
                    const v = self.view(), b = self.bytes();
                    self.args.forEach(function (a, i) {
                        const enc = new TextEncoder().encode(a + '\0');
                        v.setUint32(argvPtr + i * 4, bufPtr, true);
                        b.set(enc, bufPtr);
                        bufPtr += enc.length;
                    });
                    return E.SUCCESS;
                },
                environ_sizes_get(countPtr, sizePtr) {
                    const list = Object.keys(self.env).map(k => k + '=' + self.env[k]);
                    const v = self.view();
                    v.setUint32(countPtr, list.length, true);
                    v.setUint32(sizePtr, list.reduce((s, a) => s + new TextEncoder().encode(a).length + 1, 0), true);
                    return E.SUCCESS;
                },
                environ_get(envPtr, bufPtr) {
                    const v = self.view(), b = self.bytes();
                    Object.keys(self.env).forEach(function (k, i) {
                        const enc = new TextEncoder().encode(k + '=' + self.env[k] + '\0');
                        v.setUint32(envPtr + i * 4, bufPtr, true);
                        b.set(enc, bufPtr);
                        bufPtr += enc.length;
                    });
                    return E.SUCCESS;
                },
                clock_res_get(id, ptr) { self.view().setBigUint64(ptr, 1000n, true); return E.SUCCESS; },
                clock_time_get(id, precision, ptr) {
                    const ns = id === 0 ? BigInt(Date.now()) * 1000000n
                        : BigInt(Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) * 1e6));
                    self.view().setBigUint64(ptr, ns, true);
                    return E.SUCCESS;
                },
                random_get(ptr, len) {
                    const b = self.bytes();
                    for (let i = 0; i < len; i++) b[ptr + i] = Math.floor(Math.random() * 256);
                    return E.SUCCESS;
                },
                proc_exit(code) { throw new ExitError(code); },
                sched_yield() { return E.SUCCESS; },

                fd_prestat_get(fd, ptr) {
                    const d = self.fds.get(fd);
                    if (!d || !d.preopen) return E.BADF;
                    const v = self.view();
                    v.setUint8(ptr, 0);
                    v.setUint32(ptr + 4, new TextEncoder().encode(d.preopen).length, true);
                    return E.SUCCESS;
                },
                fd_prestat_dir_name(fd, ptr, len) {
                    const d = self.fds.get(fd);
                    if (!d || !d.preopen) return E.BADF;
                    self.bytes().set(new TextEncoder().encode(d.preopen).subarray(0, len), ptr);
                    return E.SUCCESS;
                },
                fd_fdstat_get(fd, ptr) {
                    const v = self.view();
                    let type;
                    if (fd <= 2) type = FT.CHAR;
                    else { const d = self.fds.get(fd); if (!d) return E.BADF; type = d.dir != null ? FT.DIR : FT.FILE; }
                    v.setUint8(ptr, type);
                    v.setUint16(ptr + 2, 0, true);
                    v.setBigUint64(ptr + 8, 0xffffffffffffffffn, true);
                    v.setBigUint64(ptr + 16, 0xffffffffffffffffn, true);
                    return E.SUCCESS;
                },
                fd_fdstat_set_flags() { return E.SUCCESS; },
                fd_filestat_get(fd, ptr) {
                    if (fd <= 2) { self.writeFilestat(ptr, FT.CHAR, 0); return E.SUCCESS; }
                    const d = self.fds.get(fd);
                    if (!d) return E.BADF;
                    if (d.dir != null) self.writeFilestat(ptr, FT.DIR, 0);
                    else self.writeFilestat(ptr, FT.FILE, d.file.data.length);
                    return E.SUCCESS;
                },
                path_filestat_get(dirFd, flags, pathPtr, pathLen, ptr) {
                    const p = self.resolve(dirFd, pathPtr, pathLen);
                    if (p == null) return E.BADF;
                    if (self.fs.isDir(p)) { self.writeFilestat(ptr, FT.DIR, 0); return E.SUCCESS; }
                    const f = self.fs.readFile(p);
                    if (!f) return E.NOENT;
                    self.writeFilestat(ptr, FT.FILE, f.length);
                    return E.SUCCESS;
                },
                path_open(dirFd, dirflags, pathPtr, pathLen, oflags, rightsBase, rightsInh, fdflags, fdPtr) {
                    const p = self.resolve(dirFd, pathPtr, pathLen);
                    if (p == null) return E.BADF;
                    if (self.fs.isDir(p)) {
                        if (oflags & (O.CREAT | O.TRUNC)) return E.ISDIR;
                        const fd = self.nextFd++;
                        self.fds.set(fd, { dir: p });
                        self.view().setUint32(fdPtr, fd, true);
                        return E.SUCCESS;
                    }
                    if (oflags & O.DIRECTORY) return self.fs.exists(p) ? E.NOTDIR : E.NOENT;
                    const exists = self.fs.files.has(p);
                    if (exists && (oflags & O.EXCL) && (oflags & O.CREAT)) return E.EXIST;
                    if (!exists) {
                        if (!(oflags & O.CREAT)) return E.NOENT;
                        if (!self.fs.isDir(MemFs.parent(p))) return E.NOENT;
                        self.fs.files.set(p, new Uint8Array(0));
                    } else if (oflags & O.TRUNC) self.fs.files.set(p, new Uint8Array(0));
                    const fd = self.nextFd++;
                    self.fds.set(fd, { file: new OpenFile(self.fs, p, !!(fdflags & FD_APPEND)) });
                    self.view().setUint32(fdPtr, fd, true);
                    return E.SUCCESS;
                },
                fd_close(fd) {
                    if (fd <= 2 || (self.fds.get(fd) || {}).preopen) return E.SUCCESS;
                    return self.fds.delete(fd) ? E.SUCCESS : E.BADF;
                },
                fd_read(fd, iovs, n, nreadPtr) {
                    const list = self.iovecs(iovs, n);
                    if (fd === 0) {
                        if (self.stdinBuf.length === 0 && !self.stdinEof && asyncStdin) {
                            // JSPI: suspend the module until the page supplies a line (or end of input)
                            return (async function () {
                                const line = await self.stdinSource();
                                if (line == null) self.stdinEof = true;
                                else self.stdinBuf = new TextEncoder().encode(line);
                                self.view().setUint32(nreadPtr, self.readStdinInto(self.iovecs(iovs, n)), true);
                                return E.SUCCESS;
                            })();
                        }
                        self.view().setUint32(nreadPtr, self.readStdinInto(list), true);
                        return E.SUCCESS;
                    }
                    const d = self.fds.get(fd);
                    if (!d || !d.file) return E.BADF;
                    let total = 0;
                    const b = self.bytes();
                    for (const [buf, len] of list) {
                        const chunk = d.file.read(len);
                        b.set(chunk, buf);
                        total += chunk.length;
                        if (chunk.length < len) break;
                    }
                    self.view().setUint32(nreadPtr, total, true);
                    return E.SUCCESS;
                },
                fd_write(fd, iovs, n, nwrittenPtr) {
                    const list = self.iovecs(iovs, n), b = self.bytes();
                    let total = 0;
                    if (fd === 1 || fd === 2) {
                        for (const [buf, len] of list) {
                            self.out[fd](self.decoders[fd].decode(b.subarray(buf, buf + len), { stream: true }));
                            total += len;
                        }
                        self.bytesOut += total;
                        if (self.bytesOut > self.maxOut) throw new ExitError('output-limit');
                    } else {
                        const d = self.fds.get(fd);
                        if (!d || !d.file) return E.BADF;
                        for (const [buf, len] of list) { d.file.write(b.slice(buf, buf + len)); total += len; }
                    }
                    self.view().setUint32(nwrittenPtr, total, true);
                    return E.SUCCESS;
                },
                fd_seek(fd, offset, whence, ptr) {
                    if (fd <= 2) return E.SPIPE;
                    const d = self.fds.get(fd);
                    if (!d || !d.file) return E.BADF;
                    const base = whence === 0 ? 0 : whence === 1 ? d.file.pos : d.file.data.length;
                    const pos = base + Number(offset);
                    if (pos < 0) return E.INVAL;
                    d.file.pos = pos;
                    self.view().setBigUint64(ptr, BigInt(pos), true);
                    return E.SUCCESS;
                },
                fd_tell(fd, ptr) {
                    const d = self.fds.get(fd);
                    if (!d || !d.file) return E.BADF;
                    self.view().setBigUint64(ptr, BigInt(d.file.pos), true);
                    return E.SUCCESS;
                },
                fd_sync() { return E.SUCCESS; },
                fd_datasync() { return E.SUCCESS; },
                path_unlink_file(dirFd, pathPtr, pathLen) {
                    const p = self.resolve(dirFd, pathPtr, pathLen);
                    if (p == null) return E.BADF;
                    if (self.fs.isDir(p)) return E.ISDIR;
                    return self.fs.unlink(p) ? E.SUCCESS : E.NOENT;
                },
                path_create_directory(dirFd, pathPtr, pathLen) {
                    const p = self.resolve(dirFd, pathPtr, pathLen);
                    if (p == null) return E.BADF;
                    if (self.fs.exists(p)) return E.EXIST;
                    if (!self.fs.isDir(MemFs.parent(p))) return E.NOENT;
                    self.fs.dirs.add(p);
                    return E.SUCCESS;
                },
                path_remove_directory(dirFd, pathPtr, pathLen) {
                    const p = self.resolve(dirFd, pathPtr, pathLen);
                    if (p == null) return E.BADF;
                    if (!self.fs.isDir(p)) return E.NOENT;
                    return self.fs.rmdir(p);
                },
                path_rename(fd1, p1, l1, fd2, p2, l2) {
                    const a = self.resolve(fd1, p1, l1), b = self.resolve(fd2, p2, l2);
                    if (a == null || b == null) return E.BADF;
                    const f = self.fs.readFile(a);
                    if (!f) return E.NOENT;
                    self.fs.files.set(b, f);
                    self.fs.unlink(a);
                    return E.SUCCESS;
                },
            };
            return w;
        }

        /** Builds the import object for a module: known WASI calls, ENOSYS for the rest. */
        importObject(module, asyncStdin) {
            const w = this.imports(asyncStdin), obj = { wasi_snapshot_preview1: {} };
            for (const imp of WebAssembly.Module.imports(module)) {
                if (imp.kind !== 'function') continue;
                if (!obj[imp.module]) obj[imp.module] = {};
                let fn = imp.module === 'wasi_snapshot_preview1' && w[imp.name];
                if (!fn) fn = function () { return E.NOSYS; };
                if (asyncStdin && imp.name === 'fd_read') fn = new WebAssembly.Suspending(fn);
                obj[imp.module][imp.name] = fn;
            }
            return obj;
        }

        finish(e) {
            for (const fd of [1, 2]) { const tail = this.decoders[fd].decode(); if (tail) this.out[fd](tail); }
            if (e == null) return 0;
            if (e instanceof ExitError) return e.code;
            throw e;
        }

        /** Runs _start synchronously. Returns the exit code. */
        run(module) {
            const inst = new WebAssembly.Instance(module, this.importObject(module, false));
            this.memory = inst.exports.memory;
            try { inst.exports._start(); } catch (e) { return this.finish(e); }
            return this.finish(null);
        }

        /** Runs _start with JSPI, so stdin can wait for the user. Returns a Promise of the exit code. */
        async runAsync(module) {
            const inst = new WebAssembly.Instance(module, this.importObject(module, true));
            this.memory = inst.exports.memory;
            const start = WebAssembly.promising(inst.exports._start);
            try { await start(); } catch (e) { return this.finish(e); }
            return this.finish(null);
        }
    }

    Wasi.hasJspi = typeof WebAssembly !== 'undefined' && typeof WebAssembly.Suspending === 'function' &&
        typeof WebAssembly.promising === 'function';

    return { MemFs, Wasi, ExitError };
}

if (typeof module !== 'undefined' && module.exports) module.exports = WasiShimFactory;

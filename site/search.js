/**
 * NullpunktSearch — the search dialog of every page: / or Ctrl/⌘ K opens it, typing searches the whole course in the
 * page language (lib/Search.js), ↑ ↓ move through the results, Enter opens one. A result opens its lesson at its
 * section with ?q=…, and the words are then marked on that page (CSS Custom Highlight API; no DOM is changed).
 * Knobs: NullpunktSite.search (site/config.js).
 */
(function (g) {
    'use strict';
    var SITE = g.NullpunktSite, CFG = SITE.search;
    var engine = null, dlg = null, input = null, list = null, status = null, lang = document.documentElement.lang, items = [], sel = -1;

    function U() { return g.NullpunktUI[lang].site; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function svg(name) { return g.NullpunktChrome ? g.NullpunktChrome.svg(name) : ''; }
    function getEngine() {
        if (!engine) {
            var ix = g.NullpunktData.index(g.Nullpunkt);
            engine = { ix: ix, s: g.NullpunktSearchEngine.build(ix, lang) };
        }
        return engine;
    }

    function build() {
        var u = U();
        dlg = document.createElement('dialog');
        dlg.id = 'ncSearch';
        dlg.className = 'np-search';
        dlg.setAttribute('aria-label', u.aria.search);
        dlg.innerHTML = '<div class="np-search-box"><div class="np-search-field">' + svg('search') +
            '<input type="search" id="ncSearchInput" autocomplete="off" spellcheck="false" enterkeyhint="search" role="combobox" ' +
            'aria-autocomplete="list" aria-controls="ncSearchList" aria-expanded="false">' +
            '<button type="button" class="icon-btn np-search-close">' + svg('x') + '</button></div>' +
            '<p class="np-search-status" id="ncSearchStatus" role="status" aria-live="polite"></p>' +
            '<ul class="np-search-list" id="ncSearchList" role="listbox"></ul>' +
            '<p class="np-search-foot"><span><kbd>↑</kbd><kbd>↓</kbd></span> <span><kbd>↵</kbd></span> <span><kbd>Esc</kbd></span><span class="np-search-hint"></span></p></div>';
        document.body.appendChild(dlg);
        input = dlg.querySelector('input'); list = dlg.querySelector('ul'); status = dlg.querySelector('#ncSearchStatus');
        input.placeholder = u.searchPlaceholder;
        input.setAttribute('aria-label', u.aria.search);
        dlg.querySelector('.np-search-close').setAttribute('aria-label', u.close);
        dlg.querySelector('.np-search-hint').textContent = u.searchHint;
        dlg.querySelector('.np-search-close').addEventListener('click', close);
        dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
        dlg.addEventListener('close', function () { document.documentElement.classList.remove('np-search-open'); });
        var t = 0;
        input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 60); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); var a = items[sel < 0 ? 0 : sel]; if (a) a.click(); }
        });
    }

    function href(d, q) {
        var C = g.NullpunktCourse;
        if (d.kind === 'planned' || !d.lesson) return C.homeHref(lang, 'path');
        return 'lesson.html?lesson=' + encodeURIComponent(d.lesson) + '&lang=' + lang + '&q=' + encodeURIComponent(q) + (d.block ? '#' + d.block : '');
    }

    function run() {
        var u = U(), q = input.value.trim(), e = getEngine();
        list.innerHTML = ''; items = []; sel = -1;
        if (q.length < CFG.minChars) {
            status.innerHTML = esc(u.searchTry) + ': ' + CFG.suggestions.map(function (s) { return '<button type="button" class="np-chip" dir="ltr">' + esc(s) + '</button>'; }).join(' ');
            status.querySelectorAll('.np-chip').forEach(function (b) { b.addEventListener('click', function () { input.value = b.textContent; run(); input.focus(); }); });
            input.setAttribute('aria-expanded', 'false');
            return;
        }
        var res = e.s.query(q, { max: CFG.maxResults, snippet: CFG.snippet });
        status.textContent = res.length ? u.searchCount.replace('{n}', res.length) : u.searchEmpty.replace('{q}', q);
        res.forEach(function (r, i) {
            var d = r.doc, L = d.lesson && e.ix.lesson[d.lesson], li = document.createElement('li');
            li.setAttribute('role', 'presentation');
            var where = d.kind === 'term' ? u.searchGlossary + (L ? ' · ' + g.NullpunktUI[lang].lesson + ' ' + L.n : '')
                : d.kind === 'planned' ? g.NullpunktUI[lang].lesson + ' ' + L.n + ' · ' + u.searchPlanned
                : g.NullpunktUI[lang].lesson + ' ' + L.n + (d.section ? ' · ' + d.section : '');
            var icon = d.kind === 'term' ? 'book-a' : d.kind === 'planned' ? 'circle-dashed' : d.block ? ((e.ix.reg.blocks[d.block] || {}).icon || 'book-open') : 'book-open';
            var snip = r.snippet.map(function (p) { return p.hit ? '<mark>' + esc(p.text) + '</mark>' : esc(p.text); }).join('');
            li.innerHTML = '<a role="option" id="ncSr' + i + '" class="np-sr' + (d.kind === 'planned' ? ' is-planned' : '') + '" href="' + esc(href(d, q)) + '">' +
                '<span class="np-sr-ic">' + svg(icon) + '</span><span class="np-sr-body"><span class="np-sr-where">' + esc(where) + '</span>' +
                '<span class="np-sr-title">' + esc(d.title) + '</span><span class="np-sr-snip">' + snip + '</span></span></a>';
            var a = li.firstChild;
            a.addEventListener('click', function (ev) {
                if (ev.button || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
                // same page: no reload, jump to the section and mark the words
                var u2 = new URL(a.href, location.href);
                if (u2.pathname === location.pathname && u2.searchParams.get('lesson') === new URLSearchParams(location.search).get('lesson')) {
                    ev.preventDefault();
                    close();
                    try { history.replaceState(null, '', u2.pathname + u2.search + u2.hash); } catch (er) { /* file:// */ }
                    highlight(q);
                    if (u2.hash && g.NullpunktChrome) g.NullpunktChrome.goTo(u2.hash.slice(1), true);
                }
            });
            a.addEventListener('mousemove', function () { select(i, false); });
            list.appendChild(li);
            items.push(a);
        });
        input.setAttribute('aria-expanded', String(!!res.length));
        if (items.length) select(0, false);
    }

    function select(i, scroll) {
        if (sel >= 0 && items[sel]) items[sel].classList.remove('is-sel');
        sel = i;
        var a = items[i]; if (!a) return;
        a.classList.add('is-sel');
        input.setAttribute('aria-activedescendant', a.id);
        if (scroll) a.scrollIntoView({ block: 'nearest' });
    }
    function move(d) { if (!items.length) return; select((sel + d + items.length) % items.length, true); }

    function open(q) {
        if (!dlg) build();
        if (!dlg.open) dlg.showModal();
        document.documentElement.classList.add('np-search-open');
        if (q != null) input.value = q;
        input.focus();
        input.select();
        run();
    }
    function close() { if (dlg && dlg.open) dlg.close(); }

    /** mark every occurrence of the query's words inside the lesson content (folded matching, as the search) */
    function highlight(q) {
        if (!CFG.highlight || !g.CSS || !CSS.highlights || typeof Highlight === 'undefined') return;
        var root = document.querySelector('#main .np-content') || document.getElementById('main');
        var F = g.NullpunktSearchEngine.fold, words = F(String(q).trim()).text.split(/\s+/).filter(function (w) { return w.length >= CFG.minChars; });
        CSS.highlights.delete('np-search');
        if (!words.length) return;
        var ranges = [], walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), node;
        while ((node = walker.nextNode())) {
            if (!node.nodeValue.trim() || node.parentElement.closest('.cm-editor, script, style')) continue;
            var f = F(node.nodeValue);
            words.forEach(function (w) {
                var p = f.text.indexOf(w);
                while (p >= 0) {
                    var r = document.createRange();
                    r.setStart(node, f.at[p]); r.setEnd(node, f.at[p + w.length]);
                    ranges.push(r);
                    p = f.text.indexOf(w, p + w.length);
                }
            });
        }
        if (ranges.length) CSS.highlights.set('np-search', new Highlight(...ranges));
    }

    document.addEventListener('keydown', function (e) {
        if (dlg && dlg.open) return;
        var t = e.target, typing = t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName) || (t.closest && t.closest('.cm-editor')));
        if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && CFG.keys.indexOf('k') >= 0) { e.preventDefault(); open(); }
        else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && CFG.keys.indexOf('/') >= 0) { e.preventDefault(); open(); }
    });

    g.NullpunktSearch = { open: open, close: close, highlight: highlight };
})(window);

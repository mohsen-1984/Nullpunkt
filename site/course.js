/**
 * NullpunktCourse — the learning path as the site shows it: the course tree of the rail and the drawer, the
 * reader's progress (lessons opened, exercises solved; kept in this browser only) and the links between pages.
 * Classic script; needs the data (window.Nullpunkt), lib/Data.js, site/config.js and site/ui*.js.
 */
(function (g) {
    'use strict';
    var SITE = g.NullpunktSite;

    function store(k, v) {
        try {
            if (v === undefined) return JSON.parse(localStorage.getItem(SITE.storagePrefix + k));
            localStorage.setItem(SITE.storagePrefix + k, JSON.stringify(v));
        } catch (e) { return null; }
        return v;
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function svg(name, cls) {
        var body = (g.NullpunktIcons && g.NullpunktIcons.icons[name]) || '';
        return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + body + '</svg>';
    }
    function lessonHref(id, lang, hash) { return 'lesson.html?lesson=' + encodeURIComponent(id) + '&lang=' + lang + (hash ? '#' + hash : ''); }
    function homeHref(lang, hash) { return 'index.html?lang=' + lang + (hash ? '#' + hash : ''); }

    /** exercise items of a lesson that the page can mark as solved, and how many are solved */
    function progress(L) {
        var items = [];
        ((L.unit && L.unit.bands) || []).forEach(function (b) { b.items.forEach(function (it) { items.push(it.id); }); });
        var done = items.filter(function (id) { return store('item.' + id) === true; }).length;
        return { done: done, total: items.length, visited: store('visited.' + L.id) === true };
    }
    function state(L) {
        if (!L.unit) return 'planned';
        var p = progress(L);
        if (p.total && p.done === p.total) return 'done';
        return p.visited || p.done ? 'started' : 'open';
    }
    var STATE_ICON = { done: 'circle-check', started: 'circle-dot', open: 'circle', planned: 'circle-dashed' };

    /** the course tree: chapters (folding) and their lessons; the current lesson is marked aria-current="page" */
    function tree(ix, lang, current) {
        var U = g.NullpunktUI[lang], c = U.site, open = SITE.rail.openChapters;
        var nav = document.createElement('nav');
        nav.className = 'np-tree';
        nav.setAttribute('aria-label', c.aria.rail);
        var cur = current && ix.lesson[current];
        var html = '<a class="np-tree-home" href="' + esc(homeHref(lang)) + '">' + svg('house') + '<span>' + esc(c.home) + '</span></a>' +
            '<p class="np-tree-title">' + esc(c.path) + '</p><ol class="np-tree-chapters">';
        ix.chapterList.forEach(function (ch) {
            var lessons = ix.lessonList.filter(function (L) { return L.chapter === ch.id; });
            var written = lessons.filter(function (L) { return L.unit; }).length;
            var isOpen = open === 'all' || (cur ? cur.chapter === ch.id : ch.n <= 1);
            html += '<li class="np-tree-chapter' + (written ? '' : ' is-planned') + '"><details' + (isOpen ? ' open' : '') + '><summary>' +
                '<span class="np-tree-n">' + ch.n + '</span><span class="np-tree-ch">' + esc(ch.catalog.title[lang]) + '</span>' +
                svg('chevron-down', 'np-tree-caret') + '</summary><ol>';
            lessons.forEach(function (L) {
                var st = state(L), here = L.id === current;
                var inner = '<span class="np-tree-state is-' + st + '">' + svg(STATE_ICON[st]) + '</span><span class="np-tree-num">' + (L.review ? svg('rotate-ccw') : L.label) + '</span>' +
                    '<span class="np-tree-lt">' + esc(L.catalog.title[lang]) + '</span>';
                if (L.unit) html += '<li><a class="np-tree-lesson' + (here ? ' is-current' : '') + '" href="' + esc(lessonHref(L.id, lang)) + '"' + (here ? ' aria-current="page"' : '') + '>' + inner + '</a></li>';
                else html += '<li><span class="np-tree-lesson is-planned" title="' + esc(c.soon) + '">' + inner + '</span></li>';
            });
            html += '</ol></details></li>';
        });
        html += '</ol>';         // the version is a badge beside the name (header, drawer), not a line here
        nav.innerHTML = html;
        return nav;
    }

    /** where the reader left off: the last lesson opened, else the first written lesson */
    function resume(ix) {
        var last = store('last');
        if (last && ix.lesson[last] && ix.lesson[last].unit) return ix.lesson[last];
        return ix.lessonList.filter(function (L) { return L.unit; })[0] || null;
    }

    g.NullpunktCourse = { tree: tree, progress: progress, state: state, resume: resume, lessonHref: lessonHref, homeHref: homeHref, store: store, esc: esc, svg: svg, STATE_ICON: STATE_ICON };
})(window);

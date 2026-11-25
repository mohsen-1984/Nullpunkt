/**
 * The home page: what Nullpunkt is, the learning path (every chapter and lesson, with the reader's progress), how a
 * lesson works, the compiler in the browser, and the name. Renders into #main, then mounts the chrome with the
 * page's sections. Classic script; loads from file://.
 */
(function () {
    'use strict';
    const N = window.Nullpunkt, ix = NullpunktData.index(N), G = ix.generated, reg = ix.reg;
    const lang = document.documentElement.lang, U = NullpunktUI[lang], c = U.site;
    const C = NullpunktCourse, esc = C.esc, svg = C.svg;
    const SITE = NullpunktSite;

    document.title = 'Nullpunkt — ' + c.tagline;
    const DEMO = 'C.L03.K01';

    function hl(code) {
        try { if (window.NullpunktCM) return NullpunktCM.highlight(code); } catch (e) { /* plain text below */ }
        return esc(code);
    }

    function hero() {
        const first = C.resume(ix), visitedAny = ix.lessonList.some(L => C.store('visited.' + L.id));
        const cta = first ? '<a class="np-cta primary" href="' + esc(C.lessonHref(first.id, lang)) + '">' + svg('play', 'ic-flip') +
            esc(visitedAny && first.n > 1 ? c.continueAt.replace('{n}', first.n) : c.start) + '</a>' : '';
        const tags = SITE.languages.filter(l => l !== lang).map(l => '<span lang="' + l + '">' + esc(NullpunktUI[l].site.tagline) + '</span>').join(' · ');
        const demo = ix.code[DEMO], out = G && G.code[DEMO] ? G.code[DEMO].gcc.stdout : '';
        return '<section class="np-hero" id="top"><div>' +
            '<p class="np-eyebrow">' + esc(c.hero.eyebrow) + '</p>' +
            '<h1>' + NullpunktChrome.MARK + '<span lang="de">Nullpunkt</span></h1>' +
            '<p class="np-tagline">' + esc(c.tagline) + ' <span>· ' + tags + '</span></p>' +
            '<p class="np-lead">' + esc(c.hero.lead) + '</p>' +
            '<div class="np-ctas">' + cta + '<button type="button" class="np-cta" id="npHomeSearch">' + svg('search') + esc(c.searchCourse) + '<kbd>/</kbd></button></div></div>' +
            (demo ? '<figure class="np-demo" aria-label="main.c"><div class="np-demo-bar"><i></i><i></i><i></i><span>main.c</span></div><pre>' + hl(demo.source.replace(/\n$/, '')) + '</pre>' +
                '<div class="np-demo-out"><b>' + esc(U.output) + '</b><pre>' + esc(out.replace(/\n$/, '')) + '</pre></div></figure>' : '') +
            '</section>';
    }

    function path() {
        let h = '<section class="np-home-sec" id="path" aria-labelledby="h-path"><h2 id="h-path" tabindex="-1">' + esc(c.nav.path[0]) + '</h2>' +
            '<p class="np-lead">' + esc(c.pathLead) + '</p><ol class="np-chapters">';
        ix.chapterList.forEach(ch => {
            const lessons = ix.lessonList.filter(L => L.chapter === ch.id), written = lessons.some(L => L.unit);
            h += '<li class="np-chapter' + (written ? '' : ' is-planned') + '" id="chapter-' + ch.id + '"><h3><span class="np-chapter-n">' + ch.n + '</span>' + esc(ch.catalog.title[lang]) + '</h3><ol>';
            lessons.forEach(L => {
                const st = C.state(L), icon = '<span class="np-tree-state is-' + st + '">' + svg(C.STATE_ICON[st]) + '</span>';
                const title = '<span>' + L.n + '. ' + esc(L.catalog.title[lang]) + '</span>';
                if (L.unit) {
                    const p = C.progress(L);
                    const meta = p.done ? c.exercises.replace('{d}', p.done).replace('{n}', p.total) : c.minutesShort.replace('{m}', L.catalog.minutes);
                    h += '<li><a href="' + esc(C.lessonHref(L.id, lang)) + '">' + icon + title + '<span class="np-l-meta">' + esc(meta) + '</span></a></li>';
                } else h += '<li><span>' + icon + title + '<span class="np-l-meta">' + esc(c.soon) + '</span></span></li>';
            });
            h += '</ol></li>';
        });
        return h + '</ol></section>';
    }

    function method() {
        return '<section class="np-home-sec" id="method" aria-labelledby="h-method"><h2 id="h-method" tabindex="-1">' + esc(c.nav.method[0]) + '</h2>' +
            '<p class="np-lead">' + esc(c.method.lead) + '</p><ol class="np-steps">' +
            c.method.steps.map(s => '<li><span class="np-step-ic">' + svg(reg.blocks[s[0]].icon) + '</span><strong>' + esc(s[1]) + '</strong><p>' + esc(s[2]) + '</p></li>').join('') +
            '</ol></section>';
    }
    function browser() {
        return '<section class="np-home-sec" id="browser" aria-labelledby="h-browser"><h2 id="h-browser" tabindex="-1">' + esc(c.nav.browser[0]) + '</h2>' +
            '<p class="np-lead">' + esc(c.browser.lead) + '</p><ul class="np-points">' +
            c.browser.points.map(s => '<li><span class="np-step-ic">' + svg(s[0]) + '</span><strong>' + esc(s[1]) + '</strong><p>' + esc(s[2]) + '</p></li>').join('') +
            '</ul></section>';
    }
    function name() {
        return '<section class="np-home-sec" id="name" aria-labelledby="h-name"><h2 id="h-name" tabindex="-1">' + esc(c.nav.name[0]) + '</h2>' +
            '<div class="np-name"><div><p class="np-lead">' + esc(c.name.lead) + '</p><dl>' +
            c.name.points.map(p => '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd>').join('') + '</dl><p class="np-lead">' + esc(c.name.close) + '</p></div>' +
            '<div class="np-name-big" aria-hidden="true">' + NullpunktChrome.MARK + '</div></div></section>';
    }

    const main = document.getElementById('main');
    main.innerHTML = '<div class="np-content np-home">' + hero() + path() + method() + browser() + name() + '</div>';
    const nav = ['path', 'method', 'browser', 'name'].map(id => ({ id: id, label: c.nav[id][0], short: c.nav[id][1] }));
    NullpunktChrome.mount({ page: 'home', nav: nav, tree: C.tree(ix, lang, null) });
    document.getElementById('npHomeSearch').addEventListener('click', () => NullpunktSearch.open());
})();

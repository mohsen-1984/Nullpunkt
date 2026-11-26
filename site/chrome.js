/**
 * NullpunktChrome — the page chrome of every Nullpunkt page, after navigation chrome v2 (navigation-chrome-guide.md):
 * the fixed header (brand, the page's sections, actions), its ladder of shedding steps, the scrolling second row,
 * the drawer (<dialog>), the scroll-spy with its dot-nav, the theme and the language — plus, for this site, the
 * course rail: the learning path, docked beside the content on wide screens and in the drawer otherwise.
 *
 *   NullpunktChrome.mount({ page, nav: [{ id, label, short }], tree: Element | null })
 *
 * Every knob comes from NullpunktSite.chrome and NullpunktSite.rail (site/config.js); there are no constants here.
 * Strings come from NullpunktUI[lang].site (site/ui-site.js). Chrome ids start with "nc" so they never collide with
 * section ids (§3.6). Changing the language loads the page in the new language at the same section (§7.4).
 */
(function (g) {
    'use strict';
    var SITE = g.NullpunktSite;
    var STEPS = ['nav-tight', 'nav-short', 'nav-overflow', 'link-icon', 'brand-version', 'lang-short',
        'secondary-to-drawer', 'controls-tight', 'brand-dept', 'brand-short', 'brand-ellipsis', 'brand-mark'];

    /* ---------------- helpers ---------------- */
    function $(id) { return document.getElementById(id); }
    function el(tag, attrs, text) {
        var n = document.createElement(tag);
        if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
        if (text != null) n.textContent = text;
        return n;
    }
    function svg(name, cls) {
        var body = (g.NullpunktIcons && g.NullpunktIcons.icons[name]) || '';
        return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + body + '</svg>';
    }
    function store(k, v) {
        try {
            if (v === undefined) return JSON.parse(localStorage.getItem(SITE.storagePrefix + k));
            localStorage.setItem(SITE.storagePrefix + k, JSON.stringify(v));
        } catch (e) { return null; }
        return v;
    }
    function reducedMotion() { return !!(g.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
    function isRTL() { return document.documentElement.dir === 'rtl'; }
    // the mark: a code editor in 8-bit pixels — a C and the cursor after it (docs/rules/S00-assets.md). One 16 × 16 grid,
    // so it is sharp at 16 px; the tile takes currentColor, the ink the color on it; the cursor blinks on hover.
    var MARK_TILE = 'M2 0h12v1h1v1h1v12h-1v1h-1v1h-12v-1h-1v-1h-1v-12h1v-1h1z',
        MARK_INK = 'M2 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM3 4h6v1h-6zM2 5h8v1h-8zM2 6h2v1h-2zM8 6h2v1h-2zM2 7h2v1h-2zM2 8h2v1h-2z' +
            'M2 9h2v1h-2zM8 9h2v1h-2zM2 10h8v1h-8zM3 11h6v1h-6z',
        MARK_CURSOR = 'M12 10h3v2h-3z';
    var MARK = '<svg class="np-mark" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' +
        '<path fill="currentColor" d="' + MARK_TILE + '"/><path fill="var(--np-on-accent)" d="' + MARK_INK + '"/>' +
        '<path class="np-mark__cursor" fill="var(--np-on-accent)" d="' + MARK_CURSOR + '"/></svg>';

    var S = { cfg: SITE.chrome, rail: SITE.rail, lang: document.documentElement.lang, c: null, page: '', nav: [], tree: null, docked: false };

    /* ---------------------------- render (container-first, then fill) ------------------------------- */
    function shell() {
        var c = S.c, body = document.body, main = $('main');
        body.insertBefore(el('a', { class: 'skip', href: '#main' }, c.skip), body.firstChild);

        var header = el('header', { class: 'site-header', id: 'ncHeader', 'data-nav': 'row1', 'data-menu': 'off', 'data-steps': '' });
        header.innerHTML =
            '<div class="header-row" id="ncRow">' +
            '<button class="icon-btn menu-btn" id="ncMenu" type="button" aria-expanded="false" aria-controls="ncDrawer">' + svg('menu', 'ic-open') + svg('x', 'ic-close') + '</button>' +
            '<div class="brand-group" id="ncBrandGroup"><span class="mark-wrap"><button class="brand__mark" id="ncMark" type="button" aria-describedby="ncMarkTip">' + MARK + '</button>' +
            '<span class="mark-tip" id="ncMarkTip" role="tooltip"></span></span>' +
            '<a class="brand" id="ncBrand"><span class="brand__text">' +
            '<span class="brand__org"><span class="o-full">Nullpunkt</span><span class="o-short">Nullpunkt</span></span>' +
            '<span class="brand__dept"></span><span class="brand__org brand-measure" id="ncBrandMeasure" aria-hidden="true"></span></span></a>' +
            '<a class="np-version" id="ncVersion" dir="ltr" rel="noopener"></a></div>' +
            '<div class="nav-slot" id="ncNavSlot"><nav class="site-nav" id="ncNav"></nav></div>' +
            '<div class="header-actions" id="ncActions"></div></div>' +
            '<div class="nav-row" id="ncNavRow">' +
            '<button class="nav-arrow nav-arrow--start" type="button" tabindex="-1" aria-hidden="true" data-dir="start">' + svg('chevron-left', 'ic-flip') + '</button>' +
            '<div class="nav-scroller" id="ncNavScroller"></div>' +
            '<button class="nav-arrow nav-arrow--end" type="button" tabindex="-1" aria-hidden="true" data-dir="end">' + svg('chevron-right', 'ic-flip') + '</button></div>';
        body.insertBefore(header, body.children[1]);

        var scrim = el('div', { class: 'scrim', id: 'ncScrim' });
        var dlg = el('dialog', { class: 'drawer', id: 'ncDrawer' });
        dlg.innerHTML = '<div class="drawer__head"><div class="brand-group"><a class="drawer__brand" id="ncDrawerBrand"><span class="brand__mark">' + MARK + '</span><span class="brand__text">' +
            '<span class="brand__org">Nullpunkt</span><span class="brand__dept"></span></span></a>' +
            '<a class="np-version" id="ncDrawerVersion" dir="ltr" rel="noopener"></a></div>' +
            '<button class="icon-btn drawer__close" id="ncDrawerClose" type="button">' + svg('x') + '</button></div>' +
            '<nav class="drawer__nav" id="ncDrawerNav"></nav><div class="drawer__course" id="ncDrawerCourse"></div>' +
            '<div class="drawer__actions" id="ncDrawerActions"></div>';
        body.insertBefore(scrim, header.nextSibling);
        body.insertBefore(dlg, scrim.nextSibling);

        var footer = el('footer', { class: 'site-footer', id: 'ncFooter' });
        main.parentNode.parentNode === body ? body.insertBefore(footer, main.parentNode.nextSibling) : body.appendChild(footer);
    }

    var chrome = {
        render: function () {
            var cfg = S.cfg, c = S.c;
            $('ncBrand').setAttribute('href', 'index.html?lang=' + S.lang);
            $('ncDrawerBrand').setAttribute('href', 'index.html?lang=' + S.lang);
            $('ncDrawerBrand').setAttribute('aria-label', c.aria.home);
            $('ncBrand').setAttribute('aria-label', c.aria.home);
            $('ncMark').setAttribute('aria-label', c.aria.logo);
            $('ncMarkTip').textContent = c.logoTip;
            // the version: a badge beside the name, as in Kelk — in the header and in the drawer's head
            ['ncVersion', 'ncDrawerVersion'].forEach(function (id) {
                var v = $(id);
                v.href = SITE.repoUrl + '/releases/tag/v' + SITE.version; v.textContent = 'v' + SITE.version;
                v.title = c.releaseNotes; v.setAttribute('aria-label', c.version + ' ' + SITE.version + ' — ' + c.releaseNotes);
            });
            document.querySelectorAll('.brand__dept').forEach(function (n) { n.textContent = c.tagline; });
            $('ncNav').setAttribute('aria-label', c.aria.primaryNav);
            $('ncDrawerNav').setAttribute('aria-label', c.aria.drawerNav);
            $('ncDrawer').setAttribute('aria-label', c.aria.menuDialog);
            $('ncDrawerClose').setAttribute('aria-label', c.aria.closeMenu);
            $('ncMenu').setAttribute('aria-label', c.aria.openMenu);

            // menu button: real DOM position (§6.1); drawer side follows it unless overridden
            var row = $('ncRow'), mb = $('ncMenu');
            if (cfg.menu.position === 'end') row.appendChild(mb); else row.insertBefore(mb, row.firstChild);
            $('ncDrawer').setAttribute('data-side', cfg.drawer.side === 'auto' ? cfg.menu.position : cfg.drawer.side);

            // the page's sections: back in row 1 first, then filled
            var nav = $('ncNav'), dnav = $('ncDrawerNav');
            $('ncNavSlot').appendChild(nav);
            nav.innerHTML = ''; dnav.innerHTML = '';
            S.nav.forEach(function (item) {
                var a = el('a', { href: '#' + item.id, class: 'navlink', 'data-spy': item.id });
                a.appendChild(el('span', { class: 'l-full' }, item.label));
                a.appendChild(el('span', { class: 'l-short', 'aria-hidden': 'true' }, item.short || item.label));
                a.addEventListener('click', onNavClick(item.id, false));
                nav.appendChild(a);
                var d = el('a', { href: '#' + item.id, class: 'drawer__link', 'data-spy': item.id }, item.label);
                d.addEventListener('click', onNavClick(item.id, true));
                dnav.appendChild(d);
            });

            // actions: header and drawer from one list (§4.5)
            var ha = $('ncActions'), da = $('ncDrawerActions');
            ha.innerHTML = ''; da.innerHTML = '';
            ACTIONS.forEach(function (act) {
                if (act.kind === 'lang') { var lc = langControl(); if (lc) ha.appendChild(lc); return; }
                ha.appendChild(actionNode(act, false));
                if (act.tier === 'secondary') da.appendChild(actionNode(act, true));
            });
            footer();
        },
    };

    var ACTIONS = [
        { id: 'search', tier: 'primary', kind: 'icon', icon: 'search', aria: 'search' },
        { id: 'repo', tier: 'secondary', kind: 'link', icon: 'code-xml', label: 'github', aria: 'repo' },
        { id: 'theme', tier: 'primary', kind: 'theme' },
        { id: 'lang', tier: 'primary', kind: 'lang' },
    ];

    function actionNode(act, inDrawer) {
        var c = S.c, n;
        if (act.kind === 'link') {
            n = el('a', { class: 'link-action', href: SITE.repoUrl, 'data-tier': act.tier, 'aria-label': c.aria[act.aria], rel: 'noopener' });
            n.innerHTML = svg(act.icon) + '<span class="link-action__text"></span>';
            n.lastChild.textContent = c[act.label];
            return n;
        }
        if (act.kind === 'theme') {
            n = el('button', { type: 'button', class: 'icon-btn', 'data-tier': act.tier, 'aria-label': c.aria.toggleTheme });
            n.innerHTML = svg('moon', 'ic-moon') + svg('sun', 'ic-sun');
            n.addEventListener('click', theme.toggle);
            return n;
        }
        n = el('button', { type: 'button', class: 'icon-btn', 'data-tier': act.tier, 'aria-label': c.aria[act.aria], 'aria-keyshortcuts': '/ Control+K' });
        n.innerHTML = svg(act.icon);
        n.addEventListener('click', function () { if (inDrawer) drawer.close(true, true); if (g.NullpunktSearch) g.NullpunktSearch.open(); });
        return n;
    }

    function langControl() {
        var cfg = S.cfg, c = S.c, langs = SITE.languages, names = g.Nullpunkt.registry.languageNames;
        if (langs.length < 2) return null;
        function labels(btn, code) {
            btn.appendChild(el('span', { class: 'lc-full', lang: code }, names[code]));
            btn.appendChild(el('span', { class: 'lc-short', lang: 'en', 'aria-hidden': 'true' }, code.toUpperCase()));
        }
        if (cfg.langControl === 'toggle') {
            var next = langs[(langs.indexOf(S.lang) + 1) % langs.length];
            var b = el('button', { type: 'button', class: 'icon-btn lang-toggle', 'data-tier': 'primary', 'aria-label': c.aria.switchTo.replace('{x}', names[next]) });
            labels(b, next);
            b.addEventListener('click', function () { setLanguage(next); });
            return b;
        }
        var grp = el('div', { class: 'lang-seg', role: 'group', 'aria-label': c.aria.language, 'data-tier': 'primary' });
        langs.forEach(function (code) {
            var btn = el('button', { type: 'button', 'aria-pressed': String(code === S.lang) });
            labels(btn, code);
            btn.addEventListener('click', function () { if (code !== S.lang) setLanguage(code); });
            grp.appendChild(btn);
        });
        return grp;
    }

    function footer() {
        var c = S.c, f = $('ncFooter'), names = g.Nullpunkt.registry.languageNames;
        f.innerHTML = '<div class="footer-inner"><div class="footer-brand"><span class="brand__mark">' + MARK + '</span><div><div class="footer-name"><strong>Nullpunkt</strong>' +
            '<a class="np-version" id="ncFooterVersion" dir="ltr" rel="noopener"></a><span class="footer-tag"></span></div><p class="footer-note"></p></div></div>' +
            '<div class="footer-links"><span class="footer-langs"></span>' +
            '<a class="footer-repo" rel="noopener"></a><a class="footer-mail" dir="ltr"></a><span class="footer-license"></span></div></div>';
        f.querySelector('.footer-tag').textContent = c.tagline;
        f.querySelector('.footer-note').textContent = c.footer;
        var langs = f.querySelector('.footer-langs');
        SITE.languages.forEach(function (l) {
            var a = el(l === S.lang ? 'strong' : 'a', { lang: l }, names[l]);
            if (l !== S.lang) { a.href = langHref(l); a.addEventListener('click', function () { store('lang', l); }); }
            langs.appendChild(a);
        });
        var repo = f.querySelector('.footer-repo');
        repo.href = SITE.repoUrl; repo.innerHTML = svg('code-xml') + '<span>GitHub</span>';
        var mail = f.querySelector('.footer-mail');      // the course's address (site/config.js: contact)
        mail.href = 'mailto:' + SITE.contact; mail.innerHTML = svg('mail') + '<span></span>';
        mail.lastChild.textContent = SITE.contact; mail.setAttribute('aria-label', c.aria.mail + ' ' + SITE.contact);
        var v = $('ncFooterVersion');
        v.href = SITE.repoUrl + '/releases/tag/v' + SITE.version; v.textContent = 'v' + SITE.version;
        v.title = c.releaseNotes; v.setAttribute('aria-label', c.version + ' ' + SITE.version + ' — ' + c.releaseNotes);
        f.querySelector('.footer-license').textContent = c.license;
    }

    /* ---------------------------- the course rail --------------------------------------------------- */
    var rail = {
        place: function () {
            if (!S.tree) { document.body.setAttribute('data-rail', 'none'); return; }
            var can = S.rail.pages.indexOf(S.page) >= 0, docked = can && document.documentElement.clientWidth >= S.rail.dockMin;
            var host = docked ? $('ncRail') : $('ncDrawerCourse');
            if (S.tree.parentNode !== host) host.appendChild(S.tree);
            S.docked = docked;
            document.body.setAttribute('data-rail', docked ? 'docked' : 'drawer');
            var r = $('ncRail');
            if (r) { r.hidden = !docked; r.setAttribute('aria-label', S.c.aria.rail); }
        },
        reveal: function () {    // keep the current lesson in view inside the rail
            var cur = S.tree && S.tree.querySelector('[aria-current="page"]');
            if (!cur) return;
            var box = S.docked ? $('ncRail') : $('ncDrawer');
            var r = cur.getBoundingClientRect(), b = box.getBoundingClientRect();
            if (r.top < b.top + 40 || r.bottom > b.bottom - 40) box.scrollTop += (r.top - b.top) - b.height / 3;
        },
    };

    /* ---------------------------- header fit (§4) --------------------------------------------------- */
    var fit = {
        _onResize: null, _raf: 0, state: { steps: [], nav: 'row1', menu: false, dotnav: 'off' },
        attach: function () {
            this.detach();
            var self = this;
            this._onResize = function () {
                if (self._raf) return;
                self._raf = requestAnimationFrame(function () { self._raf = 0; self.evaluate(); });
            };
            g.addEventListener('resize', this._onResize, { passive: true });
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.evaluate(); });
            this.evaluate();
        },
        detach: function () {
            if (this._onResize) { g.removeEventListener('resize', this._onResize); this._onResize = null; }
            if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
        },
        fits: function () { var r = $('ncRow'); return r.scrollWidth <= r.clientWidth + 2; },
        apply: function (steps) {
            var h = $('ncHeader'), cfg = S.cfg, has = function (s) { return steps.indexOf(s) >= 0; };
            h.setAttribute('data-steps', steps.join(' '));
            var navMode = !S.nav.length ? 'none' : !has('nav-overflow') ? 'row1' : (cfg.navOverflow === 'scroll-row' ? 'row2' : 'folded');
            if (h.getAttribute('data-nav') !== navMode) {
                h.setAttribute('data-nav', navMode);
                (navMode === 'row2' ? $('ncNavScroller') : $('ncNavSlot')).appendChild($('ncNav'));
            }
            var menuOn = cfg.menu.always || navMode === 'folded' || has('secondary-to-drawer') || (!!S.tree && !S.docked);
            h.setAttribute('data-menu', menuOn ? 'on' : 'off');
            if (has('brand-ellipsis')) this.measureBrandMin();
            return { steps: steps.slice(), nav: navMode, menu: menuOn };
        },
        measureBrandMin: function () {
            var text = 'Nullpunkt', n = S.cfg.brand.minVisibleChars, m = $('ncBrandMeasure');
            m.textContent = Array.from(text).length > n ? Array.from(text).slice(0, n).join('') + '…' : text;
            var w = m.getBoundingClientRect().width, mark = $('ncMark').getBoundingClientRect().width,
                ver = $('ncHeader').getAttribute('data-steps').split(' ').indexOf('brand-version') >= 0 ? -10 : $('ncVersion').getBoundingClientRect().width;
            $('ncHeader').style.setProperty('--brand-min', Math.ceil(mark + 10 + w + 10 + ver + 1) + 'px');
        },
        evaluate: function () {
            rail.place();
            var cfg = S.cfg, ladder = cfg.ladder.filter(function (s) { return STEPS.indexOf(s) >= 0; });
            if (!S.nav.length) ladder = ladder.filter(function (s) { return s.indexOf('nav-') !== 0; });
            var chosen;
            if (cfg.mobileFloor && g.innerWidth <= cfg.mobileFloor) chosen = this.apply(ladder);
            else {
                for (var k = 0; k <= ladder.length; k++) {
                    chosen = this.apply(ladder.slice(0, k));      // synchronous: nothing paints in between
                    if (this.fits()) break;
                }
            }
            this.state = chosen;
            var h = $('ncHeader');
            h.setAttribute('data-row-labels', cfg.rowLabels);
            document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
            var dr = $('ncDrawer');
            dr.setAttribute('data-actions', chosen.steps.indexOf('secondary-to-drawer') >= 0 ? 'on' : 'off');
            dr.setAttribute('data-nav', chosen.nav === 'folded' ? 'on' : 'off');
            dr.setAttribute('data-head', (cfg.drawer.layer === 'over-header' || chosen.steps.indexOf('brand-version') >= 0) ? 'on' : 'off');   // the version moves to the drawer's head
            if (!chosen.menu && drawer.isOpen()) drawer.close(true);     // §6.4
            navrow.update();
            dotnav.place();
            spy.recompute();
        },
    };

    /* ---------------------------- nav row (§5.2) ---------------------------------------------------- */
    var navrow = {
        _raf: 0,
        init: function () {
            var sc = $('ncNavScroller'), self = this;
            sc.addEventListener('scroll', function () {
                if (self._raf) return;
                self._raf = requestAnimationFrame(function () { self._raf = 0; self.update(); });
            }, { passive: true });
            document.querySelectorAll('.nav-arrow').forEach(function (b) {
                b.addEventListener('click', function () { self.page(b.getAttribute('data-dir')); });
            });
        },
        active: function () { return $('ncHeader').getAttribute('data-nav') === 'row2'; },
        update: function () {
            var row = $('ncNavRow'), sc = $('ncNavScroller');
            if (!this.active()) { row.classList.remove('can-start', 'can-end'); return; }
            var max = sc.scrollWidth - sc.clientWidth, pos = Math.abs(sc.scrollLeft);
            row.classList.toggle('can-start', pos > 1);
            row.classList.toggle('can-end', pos < max - 1);
        },
        page: function (which) {
            var sc = $('ncNavScroller'), sign = (which === 'end' ? 1 : -1) * (isRTL() ? -1 : 1);
            sc.scrollBy({ left: sign * sc.clientWidth * 0.75, behavior: reducedMotion() ? 'auto' : 'smooth' });
        },
        reveal: function (link) {
            if (!this.active() || !link) return;
            var sc = $('ncNavScroller'), r = link.getBoundingClientRect(), s = sc.getBoundingClientRect();
            if (r.left >= s.left + 32 && r.right <= s.right - 32) return;
            sc.scrollBy({ left: (r.left + r.width / 2) - (s.left + s.width / 2), behavior: reducedMotion() ? 'auto' : 'smooth' });
        },
    };

    /* ---------------------------- dot-nav (§7.6) ---------------------------------------------------- */
    var dotnav = {
        el: null,
        build: function () {
            this.destroy();
            if (!S.nav.length || S.cfg.dotnav === 'never') return;
            var n = el('nav', { class: 'dotnav', 'aria-label': S.c.aria.sectionNav });
            S.nav.forEach(function (item) {
                var a = el('a', { class: 'dotnav__dot', href: '#' + item.id, 'data-spy': item.id, 'aria-label': item.label, title: item.label });
                a.addEventListener('click', onNavClick(item.id, false));
                n.appendChild(a);
            });
            $('ncFooter').after(n); this.el = n;
            this.place();
        },
        destroy: function () { if (this.el) { this.el.remove(); this.el = null; } },
        place: function () {
            var mode = S.cfg.dotnav, v = 'off';
            if (mode === 'always' && this.el) v = 'pad';
            else if (mode === 'auto' && this.el) {
                var content = document.querySelector('#main .np-content') || $('main');
                var r = content.getBoundingClientRect(), vw = document.documentElement.clientWidth;
                var free = isRTL() ? r.left : vw - r.right;
                v = free >= 30 + 18 + 12 ? 'on' : 'off';
            }
            document.body.setAttribute('data-dotnav', v);
            fit.state.dotnav = v;
        },
    };

    /* ---------------------------- drawer (<dialog>, §6) --------------------------------------------- */
    var drawer = (function () {
        var dlg, btn, scrim, lastFocus = null, closeTimer = 0;
        function layer() { return S.cfg.drawer.layer; }
        function isOpen() { return !!dlg && dlg.classList.contains('is-open'); }
        function inertTargets() {
            var t = [$('ncNavRow'), document.querySelector('.np-layout'), $('ncFooter'), document.querySelector('.skip')];
            Array.prototype.forEach.call($('ncRow').children, function (n) { if (n !== btn) t.push(n); });
            if (dotnav.el) t.push(dotnav.el);
            return t;
        }
        function setInert(on) { inertTargets().forEach(function (n) { if (n) n.inert = on; }); }
        function focusables() {
            var list = Array.prototype.filter.call(dlg.querySelectorAll('a[href], button:not([disabled]), summary'),
                function (n) { return n.offsetParent !== null || n.getClientRects().length; });
            return layer() === 'below-header' ? [btn].concat(list) : list;
        }
        function open() {
            if (isOpen()) return;
            clearTimeout(closeTimer);
            lastFocus = document.activeElement;
            if (!dlg.open) { if (layer() === 'over-header') dlg.showModal(); else dlg.show(); }
            if (layer() === 'below-header') { scrim.classList.add('show'); setInert(true); }
            void dlg.offsetWidth;
            dlg.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-label', S.c.aria.closeMenu);
            document.documentElement.style.overflow = 'hidden';
            rail.reveal();
            var active = dlg.querySelector('.drawer__link.is-active') || dlg.querySelector('[aria-current="page"]') || dlg.querySelector('a[href]');
            if (active) active.focus({ preventScroll: true });
        }
        function close(instant, keepFocus) {
            if (!isOpen()) return;
            dlg.classList.remove('is-open');
            scrim.classList.remove('show');
            setInert(false);
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', S.c.aria.openMenu);
            document.documentElement.style.overflow = '';
            var done = function () { if (!isOpen() && dlg.open) dlg.close(); };
            if (instant || reducedMotion()) done(); else closeTimer = setTimeout(done, 280);
            if (!keepFocus && lastFocus && lastFocus.isConnected && !lastFocus.inert) {
                var target = lastFocus.offsetParent !== null ? lastFocus : btn;
                if (target.offsetParent !== null) target.focus({ preventScroll: true });
            }
        }
        function init() {
            dlg = $('ncDrawer'); btn = $('ncMenu'); scrim = $('ncScrim');
            btn.addEventListener('click', function () { isOpen() ? close() : open(); });
            $('ncDrawerClose').addEventListener('click', function () { close(); });
            scrim.addEventListener('click', function () { close(); });
            dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
            dlg.addEventListener('click', function (e) {
                if (e.target !== dlg) return;
                var r = dlg.getBoundingClientRect();
                if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
            });
            document.addEventListener('keydown', function (e) {
                if (!isOpen()) return;
                if (e.key === 'Escape') { e.preventDefault(); close(); return; }
                if (e.key !== 'Tab') return;
                var f = focusables(); if (!f.length) return;
                var first = f[0], last = f[f.length - 1], i = f.indexOf(document.activeElement);
                if (e.shiftKey && i <= 0) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); first.focus(); }
            });
        }
        return { init: init, open: open, close: close, isOpen: isOpen };
    })();

    function onNavClick(id, fromDrawer) {
        return function (e) {
            if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;   // let the browser open it elsewhere
            e.preventDefault();
            if (fromDrawer) drawer.close(false, true);
            spy.goTo(id, true);
        };
    }

    /* ---------------------------- scroll-spy (§7) --------------------------------------------------- */
    var spy = (function () {
        var ids = [], current = null, lockUntil = 0, raf = 0, onScroll = null, onScrollEnd = null;
        function lineY() {
            var hh = $('ncHeader').offsetHeight;
            return Math.max(hh + S.cfg.spy.offset + 1, g.innerHeight * S.cfg.spy.line);
        }
        function compute() {
            if (!ids.length) return null;
            var de = document.documentElement;
            if (g.scrollY > 0 && g.scrollY + g.innerHeight >= de.scrollHeight - 4) return ids[ids.length - 1];
            var y = lineY(), active = ids[0];
            for (var i = 0; i < ids.length; i++) {
                var n = $(ids[i]); if (n && n.getBoundingClientRect().top <= y) active = ids[i];
            }
            return active;
        }
        function setActive(id) {
            if (id === current) return;
            current = id;
            document.querySelectorAll('.navlink, .drawer__link, .dotnav__dot').forEach(function (n) {
                var on = n.getAttribute('data-spy') === id;
                n.classList.toggle('is-active', on);
                if (on) n.setAttribute('aria-current', 'location'); else n.removeAttribute('aria-current');
            });
            navrow.reveal(document.querySelector('#ncNavScroller .navlink.is-active'));
        }
        function goTo(id, focus, instant) {
            var t = $(id); if (!t) return;
            if (ids.indexOf(id) >= 0) setActive(id);
            lockUntil = Date.now() + S.cfg.spy.lockMs;
            try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) { /* file:// in some browsers */ }
            t.scrollIntoView({ behavior: (instant || reducedMotion()) ? 'auto' : 'smooth', block: 'start' });
            if (focus) { var hd = t.matches('h2, h3') ? t : t.querySelector('h2, h3'); if (hd) { if (!hd.hasAttribute('tabindex')) hd.setAttribute('tabindex', '-1'); hd.focus({ preventScroll: true }); } }
        }
        function bind() {
            onScroll = function () {
                if (raf) return;
                raf = requestAnimationFrame(function () { raf = 0; if (Date.now() < lockUntil) return; setActive(compute()); });
            };
            g.addEventListener('scroll', onScroll, { passive: true });
            if ('onscrollend' in g) {
                onScrollEnd = function () { lockUntil = 0; setActive(compute()); };
                g.addEventListener('scrollend', onScrollEnd, { passive: true });
            }
        }
        return {
            refresh: function () {
                this.teardown();
                ids = S.nav.map(function (it) { return it.id; });
                current = null;
                dotnav.build();
                bind();
                setActive(compute());
            },
            teardown: function () {
                if (onScroll) { g.removeEventListener('scroll', onScroll); onScroll = null; }
                if (onScrollEnd) { g.removeEventListener('scrollend', onScrollEnd); onScrollEnd = null; }
                if (raf) { cancelAnimationFrame(raf); raf = 0; }
                lockUntil = 0;
                dotnav.destroy();
            },
            recompute: function () { if (onScroll && Date.now() >= lockUntil) setActive(compute()); },
            current: function () { return current; },
            compute: compute,
            goTo: goTo,
        };
    })();

    /* ---------------------------- theme and language ------------------------------------------------ */
    var theme = {
        toggle: function () {
            var d = document.documentElement, n = d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            d.setAttribute('data-theme', n); store('theme', n);
            document.dispatchEvent(new CustomEvent('np:theme', { detail: n }));
        },
    };
    function langHref(l) {
        var q = new URLSearchParams(location.search);
        q.set('lang', l); q.delete('q');
        var sec = g.scrollY > 0 ? spy.current() : null;
        return location.pathname + '?' + q.toString() + (sec ? '#' + sec : '');
    }
    function setLanguage(l) { store('lang', l); location.href = langHref(l); }

    /* ---------------------------- self-checks (§8) -------------------------------------------------- */
    function checks() {
        var st = fit.state, out = [], vw = document.documentElement.clientWidth, mb = $('ncMenu');
        out.push({ name: 'Header row fits (no overflow)', ok: fit.fits() });
        var mr = mb.getBoundingClientRect();
        out.push({ name: 'Menu button fully inside viewport', ok: st.menu ? (mr.left >= 0 && mr.right <= vw && mr.width > 0) : null });
        out.push({ name: 'Folded nav is reachable via menu', ok: st.nav === 'folded' ? st.menu : null });
        if (st.menu) {
            var drawerLeft = ($('ncDrawer').getAttribute('data-side') === 'start') !== isRTL();
            out.push({ name: 'Drawer opens from the menu button’s edge', ok: drawerLeft === ((mr.left + mr.width / 2) < vw / 2) });
        } else out.push({ name: 'Drawer opens from the menu button’s edge', ok: null });
        var org = document.querySelector('#ncBrand .brand__org');
        var truncated = org.offsetParent !== null && org.scrollWidth > org.clientWidth + 1;
        out.push({ name: 'Brand truncates only via brand-ellipsis', ok: truncated ? st.steps.indexOf('brand-ellipsis') >= 0 : true });
        if (st.dotnav !== 'off' && dotnav.el) {
            var d = dotnav.el.getBoundingClientRect(), p = (document.querySelector('#main .np-content') || $('main')).getBoundingClientRect();
            out.push({ name: 'Dot-nav does not cover content', ok: d.left >= p.right - 1 || d.right <= p.left + 1 });
        } else out.push({ name: 'Dot-nav does not cover content', ok: null });
        out.push({ name: 'Secondary actions have one home', ok: (st.steps.indexOf('secondary-to-drawer') >= 0) === ($('ncDrawer').getAttribute('data-actions') === 'on') });
        var dup = S.nav.filter(function (it) { return document.querySelectorAll('[id="' + it.id + '"]').length !== 1; });
        out.push({ name: 'Section ids are unique in the document', ok: dup.length === 0 });
        out.push({ name: 'Active section matches the activation line', ok: spy.current() === spy.compute() });
        if (S.tree) {
            var rl = $('ncRail'), rr = rl.getBoundingClientRect(), mn = (document.querySelector('#main .np-content') || $('main')).getBoundingClientRect();
            out.push({ name: 'Docked rail does not cover content', ok: S.docked ? (isRTL() ? rr.left >= mn.right - 1 : rr.right <= mn.left + 1) : null });
            out.push({ name: 'Course is reachable (rail or menu)', ok: S.docked || st.menu });
        }
        return out;
    }

    /* ---------------------------- mount ------------------------------------------------------------- */
    /* ---------------------------- the mark's card: what the logo means ------------------------------ */
    // hover or keyboard focus shows it (CSS); a click or tap pins it open, a second click, Escape or a click
    // elsewhere closes it — so it works on touch screens, where a button may never get focus
    var markTip = {
        init: function () {
            var b = $('ncMark'), wrap = b.parentNode;
            function set(open) { wrap.setAttribute('data-open', open ? 'on' : 'off'); b.setAttribute('aria-expanded', open ? 'true' : 'false'); }
            set(false);
            b.addEventListener('click', function (e) { e.stopPropagation(); set(wrap.getAttribute('data-open') !== 'on'); });
            document.addEventListener('click', function () { if (wrap.getAttribute('data-open') === 'on') set(false); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.getAttribute('data-open') === 'on') { set(false); b.focus(); } });
        },
    };

    function mount(opts) {
        S.page = opts.page;
        S.nav = opts.nav || [];
        S.tree = opts.tree || null;
        S.c = g.NullpunktUI[S.lang].site;
        document.body.setAttribute('data-page', S.page);
        shell();
        drawer.init();
        navrow.init();
        markTip.init();
        chrome.render();
        fit.attach();
        spy.refresh();
        // deep link: sections are rendered by JS, so jump to the hash ourselves (§7.4)
        var h = decodeURIComponent(location.hash.slice(1));
        if (h && $(h)) spy.goTo(h, false, true);
        g.addEventListener('hashchange', function () {
            var id = decodeURIComponent(location.hash.slice(1));
            if (id && $(id)) spy.goTo(id, true);
        });
        store('lang', S.lang);
        g.NullpunktChrome.ready = true;
        return g.NullpunktChrome;
    }

    g.NullpunktChrome = {
        mount: mount, checks: checks, drawer: drawer,
        goTo: function (id, focus) { spy.goTo(id, focus); },
        state: function () { return { fit: fit.state, docked: S.docked, active: spy.current() }; },
        store: store, svg: svg, MARK: MARK,
    };
})(window);

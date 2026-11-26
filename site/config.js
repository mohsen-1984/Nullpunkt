/**
 * NullpunktSite — the site's one config object: the version, the addresses, and every behaviour knob of the page
 * chrome (header, drawer, course rail, scroll-spy, dot-nav, search). Logic reads only from here (navigation chrome v2,
 * §2); change a value here, not in site/chrome.js. Classic script, loaded before every other site script.
 *
 * version      the one source of the release number: shown in the footer and the rail, linked to its release notes,
 *              and checked against CHANGELOG.md and README.md by tools/check-version.js
 */
(function (g) {
    'use strict';
    g.NullpunktSite = {
        version: '0.4.0',
        siteUrl: 'https://mohsen-1984.github.io/Nullpunkt/',
        repoUrl: 'https://github.com/mohsen-1984/Nullpunkt',
        contact: 'mhn.com@gmail.com',
        storagePrefix: 'np.',
        languages: ['en', 'de', 'fa'],             // order of the language control
        defaultLang: 'en',                        // when neither the address, the storage nor the browser names one
        dir: { en: 'ltr', de: 'ltr', fa: 'rtl' },

        // navigation chrome v2 (docs: navigation-chrome-guide.md, §2) — the playground's "Copy config" JSON fits here
        chrome: {
            langControl: 'segmented',             // 'segmented' | 'toggle'
            menu: { position: 'start', always: false },
            drawer: { side: 'auto', layer: 'below-header' },
            navOverflow: 'scroll-row',            // 'scroll-row' | 'fold'
            rowLabels: 'short',                   // labels in the scrolling second row: 'short' | 'full'
            ladder: ['nav-tight', 'nav-short', 'nav-overflow', 'link-icon', 'brand-version',
                'lang-short', 'secondary-to-drawer', 'controls-tight', 'brand-dept', 'brand-short', 'brand-ellipsis', 'brand-mark'],
            brand: { minVisibleChars: 8 },
            mobileFloor: null,                    // px | null (measure only)
            dotnav: 'auto',                       // 'auto' | 'always' | 'never'
            spy: { line: 0.30, offset: 16, lockMs: 1200 },
        },

        // the course rail: the learning path (chapters and lessons) beside the lesson
        rail: {
            pages: ['lesson'],                    // pages that may dock it; elsewhere it lives in the drawer only
            dockMin: 1180,                        // px of viewport width from which it is docked beside the content
            openChapters: 'current',              // 'current' | 'all' — chapters unfolded when the rail is built
        },

        // full-text search over every written lesson, the glossary and the catalog
        search: {
            minChars: 2,                          // shorter queries show the suggestions instead
            maxResults: 40,
            snippet: 70,                          // characters of context on each side of the first hit
            keys: ['/', 'k'],                     // '/' alone, and Ctrl/⌘ + 'k', open the search
            highlight: true,                      // mark the words on the page a result leads to (CSS Custom Highlight API)
            suggestions: ['printf', '\\n', '%d', 'compiler', 'warning', 'linker'],
        },
    };
})(typeof window !== 'undefined' ? window : globalThis);

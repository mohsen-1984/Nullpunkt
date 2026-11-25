/**
 * Boot — runs in <head>, before the first paint (navigation chrome v2, §3.4): sets the theme, the language and the
 * direction on <html>, so the page never flashes in the wrong theme or direction. Needs site/config.js first.
 * Language: ?lang= in the address, then the stored choice, then the browser's languages, then the default.
 */
(function () {
    'use strict';
    var S = window.NullpunktSite, d = document.documentElement, p = S.storagePrefix;
    function read(k) { try { return JSON.parse(localStorage.getItem(p + k)); } catch (e) { return null; } }
    var theme = read('theme');
    if (theme !== 'light' && theme !== 'dark') theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    d.setAttribute('data-theme', theme);

    var lang = new URLSearchParams(location.search).get('lang');
    if (S.languages.indexOf(lang) < 0) lang = read('lang');
    if (S.languages.indexOf(lang) < 0) {
        lang = null;
        (navigator.languages || [navigator.language || '']).some(function (l) {
            var c = String(l).slice(0, 2).toLowerCase();
            if (S.languages.indexOf(c) >= 0) { lang = c; return true; }
            return false;
        });
    }
    if (!lang) lang = S.defaultLang;
    d.lang = lang;
    d.dir = S.dir[lang];
    d.setAttribute('data-drawer-layer', S.chrome.drawer.layer);
})();

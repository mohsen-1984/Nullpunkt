/* C06 — the register of chapter 6: Functions (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C06 = {
        id: "C06", title: {"fa": "تابع", "de": "Funktionen", "en": "Functions"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L20", status: "planned", title: {"fa": "تعریف و فراخوانی تابع", "de": "Funktionen definieren und aufrufen", "en": "Defining & Calling Functions"} },
            { id: "C.L21", status: "planned", title: {"fa": "پارامتر و مقدار بازگشتی", "de": "Parameter und Rückgabewerte", "en": "Parameters & Return Values"} },
            { id: "C.L22", status: "planned", title: {"fa": "scope، طول عمر و static", "de": "Scope, Lebensdauer und static", "en": "Scope, Lifetime & static"} },
            { id: "C.L23", status: "planned", title: {"fa": "stack فراخوانی و recursion", "de": "Call Stack und Rekursion", "en": "The Call Stack & Recursion"} },
        ],
        review: { id: "C06.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

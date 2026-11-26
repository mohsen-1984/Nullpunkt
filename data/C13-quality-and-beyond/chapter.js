/* C13 — the register of chapter 13: Quality & Beyond (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C13 = {
        id: "C13", title: {"fa": "کیفیت و فراتر", "de": "Qualität und mehr", "en": "Quality & Beyond"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L46", status: "planned", title: {"fa": "اشکال‌زدایی", "de": "Debugging", "en": "Debugging"} },
            { id: "C.L47", status: "planned", title: {"fa": "رفتار تعریف‌نشده", "de": "Undefiniertes Verhalten", "en": "Undefined Behavior"} },
            { id: "C.L48", status: "planned", title: {"fa": "بیت و بایت", "de": "Bits und Bytes", "en": "Bits & Bytes"} },
            { id: "C.L49", status: "planned", title: {"fa": "تست برنامهٔ خودت", "de": "Den eigenen Code testen", "en": "Testing Your Code"} },
            { id: "C.L50", status: "planned", title: {"fa": "function pointer و qsort", "de": "Function Pointer und qsort", "en": "Function Pointers & qsort"} },
        ],
        review: { id: "C13.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

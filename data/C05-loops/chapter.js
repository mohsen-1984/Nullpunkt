/* C05 — the register of chapter 5: Loops (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C05 = {
        id: "C05", title: {"fa": "تکرار", "de": "Schleifen", "en": "Loops"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L15", status: "planned", title: {"fa": "حلقهٔ while", "de": "Die while-Loop", "en": "The while Loop"} },
            { id: "C.L16", status: "planned", title: {"fa": "حلقهٔ for", "de": "Die for-Loop", "en": "The for Loop"} },
            { id: "C.L17", status: "planned", title: {"fa": "do-while، break و continue", "de": "do-while, break und continue", "en": "do-while, break, continue"} },
            { id: "C.L18", status: "planned", title: {"fa": "حلقهٔ تودرتو", "de": "Verschachtelte Loops", "en": "Nested Loops"} },
            { id: "C.L19", status: "planned", title: {"fa": "ردیابی و خطای یکی‌کم‌یکی‌زیاد", "de": "Tracing und Off-by-One", "en": "Tracing & Off-by-One"} },
        ],
        review: { id: "C05.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

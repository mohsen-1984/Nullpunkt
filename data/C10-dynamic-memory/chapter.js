/* C10 — the register of chapter 10: Dynamic Memory (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C10 = {
        id: "C10", title: {"fa": "حافظهٔ پویا", "de": "Dynamischer Speicher", "en": "Dynamic Memory"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L36", status: "planned", title: {"fa": "malloc و free", "de": "malloc und free", "en": "malloc and free"} },
            { id: "C.L37", status: "planned", title: {"fa": "آرایهٔ رشدپذیر", "de": "Wachsende Arrays", "en": "Growing Arrays"} },
            { id: "C.L38", status: "planned", title: {"fa": "linked list", "de": "Linked Lists", "en": "Linked Lists"} },
            { id: "C.L39", status: "planned", title: {"fa": "اشکال‌های حافظه", "de": "Speicherfehler", "en": "Memory Bugs"} },
        ],
        review: { id: "C10.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

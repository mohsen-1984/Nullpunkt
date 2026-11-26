/* C04 — the register of chapter 4: Decisions (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C04 = {
        id: "C04", title: {"fa": "تصمیم", "de": "Entscheidungen", "en": "Decisions"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L11", status: "planned", title: {"fa": "مقایسه و مقدار درست و نادرست", "de": "Vergleiche und Wahrheitswerte", "en": "Comparisons & Truth"} },
            { id: "C.L12", status: "planned", title: {"fa": "if و else", "de": "if und else", "en": "if and else"} },
            { id: "C.L13", status: "planned", title: {"fa": "ترکیب شرط‌ها", "de": "Bedingungen verknüpfen", "en": "Combining Conditions"} },
            { id: "C.L14", status: "planned", title: {"fa": "switch", "de": "switch", "en": "switch"} },
        ],
        review: { id: "C04.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

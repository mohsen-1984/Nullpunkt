/* C03 — the register of chapter 3: Input (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C03 = {
        id: "C03", title: {"fa": "ورودی", "de": "Eingabe", "en": "Input"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L09", status: "planned", title: {"fa": "خواندن ورودی با scanf", "de": "Eingabe mit scanf", "en": "Reading Input with scanf"} },
            { id: "C.L10", status: "planned", title: {"fa": "وقتی ورودی خراب است", "de": "Wenn die Eingabe schiefgeht", "en": "When Input Goes Wrong"} },
        ],
        review: { id: "C03.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

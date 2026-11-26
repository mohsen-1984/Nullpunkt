/* C11 — the register of chapter 11: Files (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C11 = {
        id: "C11", title: {"fa": "فایل", "de": "Dateien", "en": "Files"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L40", status: "planned", title: {"fa": "خواندن و نوشتن فایل", "de": "Dateien lesen und schreiben", "en": "Reading & Writing Files"} },
            { id: "C.L41", status: "planned", title: {"fa": "خواندن خط به خط و ورودی امن", "de": "Zeilenweise lesen und sichere Eingabe", "en": "Line by Line & Safe Input"} },
        ],
        review: { id: "C11.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

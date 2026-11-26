/* C12 — the register of chapter 12: Real Programs (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C12 = {
        id: "C12", title: {"fa": "برنامهٔ واقعی", "de": "Echte Programme", "en": "Real Programs"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L42", status: "planned", title: {"fa": "چند فایل و header", "de": "Mehrere Dateien und Header", "en": "Multiple Files & Headers"} },
            { id: "C.L43", status: "planned", title: {"fa": "preprocessor و ماکرو", "de": "Präprozessor und Makros", "en": "The Preprocessor & Macros"} },
            { id: "C.L44", status: "planned", title: {"fa": "compile، link و make", "de": "Kompilieren, Linken und make", "en": "Compiling, Linking & make"} },
            { id: "C.L45", status: "planned", title: {"fa": "آرگومان خط فرمان", "de": "Kommandozeilenargumente", "en": "Command-Line Arguments"} },
        ],
        review: { id: "C12.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

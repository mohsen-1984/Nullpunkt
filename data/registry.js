/* The registry: languages, the shared data files, and the series with their chapters in order (S00-schema: registry).
   Each chapter is a folder in data/ with its register (chapter.js: titles, lessons, minutes, can-do, review) and one
   file per lesson; lib/Data.js merges the registers into one catalog in memory. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.registry = {
        languages: ["fa", "de", "en"],
        languageNames: { fa: "فارسی", de: "Deutsch", en: "English" },
        files: ["S00R", "S00G", "S00P", "C00", "C00M"],
        series: [{
            id: "C", standard: "C17",
            title: { fa: "زبان C", de: "Die Sprache C", en: "The C Language" },
            chapters: [
                "C00-orientation",
                "C01-getting-started",
                "C02-values-and-variables",
                "C03-input",
                "C04-decisions",
                "C05-loops",
                "C06-functions",
                "C07-arrays-and-strings",
                "C08-pointers",
                "C09-structured-data",
                "C10-dynamic-memory",
                "C11-files",
                "C12-real-programs",
                "C13-quality-and-beyond",
                "C14-beyond-the-console",
            ],
        }],
    };
})(typeof window !== "undefined" ? window : globalThis);

/* C14 — the register of chapter 14: Beyond the Console (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. C14: what standard C sees of devices (streams), the terminal beyond plain text, graphics, and hardware registers */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C14 = {
        id: "C14", title: {"fa": "فراتر از کنسول", "de": "Jenseits der Konsole", "en": "Beyond the Console"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L51", status: "planned", title: {"fa": "stream و دستگاه: stdin، stdout، stderr", "de": "Streams und Geräte: stdin, stdout, stderr", "en": "Streams & Devices: stdin, stdout, stderr"} },
            { id: "C.L52", status: "planned", title: {"fa": "terminal: رنگ، مکان‌نما، کلید", "de": "Das Terminal: Farben, Cursor, Tasten", "en": "The Terminal: Colors, Cursor, Keys"} },
            { id: "C.L53", status: "planned", title: {"fa": "گرافیک در C: از graphics.h تا کتابخانه‌های امروزی", "de": "Grafik in C: von graphics.h zu heutigen Bibliotheken", "en": "Graphics in C: from graphics.h to Modern Libraries"} },
            { id: "C.L54", status: "planned", title: {"fa": "گفت‌وگو با سخت‌افزار: volatile، union و bit-field", "de": "Mit Hardware sprechen: volatile, union und Bit-Fields", "en": "Talking to Hardware: volatile, union & Bit-Fields"} },
        ],
        review: { id: "C14.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

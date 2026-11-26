/* C01 — the register of chapter 1: Getting Started (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C01 = {
        id: "C01", title: {"fa": "شروع", "de": "Erste Schritte", "en": "Getting Started"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L01", status: "written",
                title: {"fa": "برنامه چیست و compiler چه می‌کند", "de": "Was ein Programm ist", "en": "What a Program Is"},
                minutes: 25, prereq: [], introduces: ["K.fn-printf", "K.esc-n", "K.comment-line"],
                topics: [{ id: "io", stage: 1 }, { id: "build", stage: 1 }],
                cando: [
                    { fa: "بتوانی در یک جمله بگویی compiler چه می‌کند.", de: "Du kannst in einem Satz sagen, was ein Compiler macht.", en: "You can say in one sentence what a compiler does." },
                    { fa: "بتوانی برنامه‌ای بنویسی و اجرا کنی که یک خط متن چاپ کند.", de: "Du kannst ein Programm schreiben und ausführen, das eine Textzeile ausgibt.", en: "You can write and run a program that prints a line of text." },
                    { fa: "بتوانی با `\\n` چند خط چاپ کنی و بدانی خط تازه از کجا می‌آید.", de: "Du kannst mit `\\n` mehrere Zeilen ausgeben und weißt, woher ein Zeilenumbruch kommt.", en: "You can print several lines with `\\n` and know where a new line comes from." },
                    { fa: "بتوانی پیام خطای یک `;` جاافتاده را بخوانی و درستش کنی.", de: "Du kannst die Fehlermeldung zu einem fehlenden `;` lesen und den Fehler beheben.", en: "You can read the error message for a missing `;` and fix it." },
                    { fa: "بتوانی با `//` در کدت یادداشتی بگذاری که compiler نادیده می‌گیرد.", de: "Du kannst mit `//` eine Notiz in deinen Code schreiben, die der Compiler ignoriert.", en: "You can leave a note in your code with `//` that the compiler ignores." },
                ] },
            { id: "C.L02", status: "written",
                title: {"fa": "خواندن پیام خطا", "de": "Fehlermeldungen lesen", "en": "Reading Error Messages"},
                minutes: 25, prereq: ["C.L01"], introduces: [],
                topics: [{ id: "build", stage: 2 }],
                cando: [
                    { fa: "بتوانی در پیام gcc فایل، خط، ستون، نوع و متن پیام را پیدا کنی.", de: "Du kannst in einer gcc-Meldung Datei, Zeile, Spalte, Art und Text finden.", en: "You can find the file, line, column, kind and text in a gcc message." },
                    { fa: "بدانی چرا باید از اولین پیام شروع کنی.", de: "Du weißt, warum du mit der ersten Meldung anfängst.", en: "You know why you start with the first message." },
                    { fa: "بتوانی error را از warning تشخیص دهی و بدانی هر کدام برای برنامه چه معنایی دارد.", de: "Du kannst einen Fehler von einer Warnung unterscheiden und weißt, was beides für das Programm bedeutet.", en: "You can tell an error from a warning and know what each means for the program." },
                    { fa: "بتوانی پیام linker برای نامی که وجود ندارد را بخوانی و درستش کنی.", de: "Du kannst die Linker-Meldung zu einem Namen lesen, den es nicht gibt, und den Fehler beheben.", en: "You can read the linker message for a name that does not exist and fix it." },
                    { fa: "بتوانی یک برنامهٔ کامل را با قابش از صفر بنویسی.", de: "Du kannst ein vollständiges Programm samt Rahmen von null schreiben.", en: "You can write a complete program, frame and all, from zero." },
                ] },
            { id: "C.L03", status: "written",
                title: {"fa": "خروجی با printf", "de": "Ausgabe mit printf", "en": "Output with printf"},
                minutes: 25, prereq: ["C.L02"], introduces: ["K.fmt-d", "K.op-add", "K.op-sub", "K.op-mul", "K.esc-t", "K.esc-backslash", "K.esc-quote", "K.comment-block"],
                topics: [{ id: "io", stage: 2 }],
                cando: [
                    { fa: "بتوانی با `%d` حاصل یک حساب را چاپ کنی.", de: "Du kannst mit `%d` das Ergebnis einer Rechnung ausgeben.", en: "You can print the result of a calculation with `%d`." },
                    { fa: "بتوانی برای هر `%d` دقیقاً یک argument بدهی، به ترتیب درست.", de: "Du kannst für jedes `%d` genau ein Argument angeben, in der richtigen Reihenfolge.", en: "You can give exactly one argument for every `%d`, in the right order." },
                    { fa: "بتوانی با `+`، `-` و `*` حساب کنی و بدانی `*` اول حساب می‌شود.", de: "Du kannst mit `+`, `-` und `*` rechnen und weißt, dass `*` zuerst kommt.", en: "You can calculate with `+`, `-` and `*` and know that `*` comes first." },
                    { fa: "بتوانی tab، `\\\"` و `\\\\` را درون متن چاپ کنی.", de: "Du kannst Tab, `\\\"` und `\\\\` im Text ausgeben.", en: "You can print a tab, `\\\"` and `\\\\` inside text." },
                    { fa: "بتوانی با `/* … */` یک comment چندخطی بنویسی.", de: "Du kannst mit `/* … */` einen Kommentar über mehrere Zeilen schreiben.", en: "You can write a comment over several lines with `/* … */`." },
                ] },
        ],
        review: { id: "C01.REV", status: "written", minutes: 30,
            cando: [
                { fa: "بتوانی برنامه‌ای کامل با قابش، از صفر و بی‌نگاه، بنویسی.", de: "Du kannst ein vollständiges Programm samt Rahmen von null und ohne Vorlage schreiben.", en: "You can write a complete program, frame and all, from zero without looking." },
                { fa: "بتوانی خروجی دقیق چند `printf` را، با `\\n` و `\\t`، بی‌اجرا بگویی.", de: "Du kannst die genaue Ausgabe mehrerer `printf` mit `\\n` und `\\t` ohne Ausführen sagen.", en: "You can say the exact output of several `printf` calls, with `\\n` and `\\t`, without running them." },
                { fa: "بتوانی اولین پیام gcc را بخوانی و اشتباه را در خط درست پیدا کنی.", de: "Du kannst die erste gcc-Meldung lesen und den Fehler in der richtigen Zeile finden.", en: "You can read the first gcc message and find the mistake on the right line." },
                { fa: "بتوانی همان برنامه را روی کامپیوتر خودت با gcc بسازی و اجرا کنی.", de: "Du kannst dasselbe Programm auf deinem eigenen Rechner mit gcc bauen und ausführen.", en: "You can build and run the same program on your own computer with gcc." },
                { fa: "بدانی compiler و linker هر کدام کدام اشتباه را می‌گیرند.", de: "Du weißt, welche Fehler der Compiler und welche der Linker findet.", en: "You know which mistakes the compiler catches and which the linker catches." },
            ] },
    };
})(typeof window !== "undefined" ? window : globalThis);

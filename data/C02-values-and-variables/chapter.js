/* C02 — the register of chapter 2: Values & Variables (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C02 = {
        id: "C02", title: {"fa": "مقدار و متغیر", "de": "Werte und Variablen", "en": "Values & Variables"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L04", status: "written",
                title: {"fa": "متغیر، شناسه و اعلان", "de": "Variablen, Identifier und Deklarationen", "en": "Variables, Identifiers, Declarations"},
                minutes: 25, prereq: ["C.L03"], introduces: ["K.int", "K.op-assign"],
                topics: [{ id: "values", stage: 1 }, { id: "types", stage: 1 }],
                cando: [
                    { fa: "بتوانی یک متغیر `int` اعلان کنی و همان‌جا مقدار اولیه بدهی.", de: "Du kannst eine `int`-Variable deklarieren und ihr gleich einen Anfangswert geben.", en: "You can declare an `int` variable and give it a first value right away." },
                    { fa: "بتوانی با `=` مقدار یک متغیر را عوض کنی و بدانی سمت راست اول حساب می‌شود.", de: "Du kannst mit `=` den Wert einer Variablen ändern und weißt, dass die rechte Seite zuerst ausgerechnet wird.", en: "You can change a variable's value with `=` and know that the right-hand side is worked out first." },
                    { fa: "بتوانی نام درست برای متغیر انتخاب کنی و نام نادرست را تشخیص دهی.", de: "Du kannst einen gültigen Namen für eine Variable wählen und einen ungültigen erkennen.", en: "You can choose a valid name for a variable and spot an invalid one." },
                    { fa: "بتوانی مقدار متغیرها را پس از هر خط در یک جدول ردیابی دنبال کنی.", de: "Du kannst die Werte der Variablen nach jeder Zeile in einer Trace Table verfolgen.", en: "You can follow the values of variables after each line in a trace table." },
                    { fa: "بدانی چرا متغیری که مقدار نگرفته را نباید خواند.", de: "Du weißt, warum man eine Variable ohne Wert nicht lesen darf.", en: "You know why you must not read a variable that has no value." },
                ] },
            { id: "C.L05", status: "written",
                title: {"fa": "عدد صحیح و اعشاری", "de": "Ganze Zahlen und Kommazahlen", "en": "Whole and Decimal Numbers"},
                minutes: 25, prereq: ["C.L04"], introduces: ["K.double", "K.float", "K.long", "K.short", "K.fmt-f", "K.fmt-lld"],
                topics: [{ id: "types", stage: 2 }],
                cando: [
                    { fa: "بتوانی برای هر مقدار بین `int`، `double` و `long long` انتخاب کنی.", de: "Du kannst für jeden Wert zwischen `int`, `double` und `long long` wählen.", en: "You can choose between `int`, `double` and `long long` for each value." },
                    { fa: "بتوانی عدد اعشاری را با نقطه بنویسی و با `%f` چاپ کنی.", de: "Du kannst eine Kommazahl mit Punkt schreiben und mit `%f` ausgeben.", en: "You can write a decimal number with a point and print it with `%f`." },
                    { fa: "بتوانی هر نوع را با format درستش چاپ کنی: `%d`، `%f`، `%lld`.", de: "Du kannst jeden Typ mit seinem Format ausgeben: `%d`, `%f`, `%lld`.", en: "You can print each type with its own format: `%d`, `%f`, `%lld`." },
                    { fa: "بتوانی سرریز `int` را تشخیص دهی و با `long long` و `LL` از آن پرهیز کنی.", de: "Du kannst einen Überlauf von `int` erkennen und ihn mit `long long` und `LL` vermeiden.", en: "You can recognise an `int` overflow and avoid it with `long long` and `LL`." },
                    { fa: "بدانی چرا `0.1` در `double` دقیق نیست.", de: "Du weißt, warum `0.1` in einem `double` nicht genau ist.", en: "You know why `0.1` is not exact in a `double`." },
                ] },
            { id: "C.L06", status: "written",
                title: {"fa": "عبارت و عملگر حسابی", "de": "Ausdrücke und Arithmetik", "en": "Expressions & Arithmetic"},
                minutes: 25, prereq: ["C.L05"], introduces: ["K.op-div", "K.op-mod", "K.op-paren-cast", "K.op-compound", "K.op-compound-sub", "K.op-compound-mul", "K.op-compound-div", "K.op-compound-mod", "K.op-inc", "K.op-dec"],
                topics: [{ id: "values", stage: 2 }, { id: "types", stage: 3 }],
                cando: [
                    { fa: "بتوانی حاصل `/` و `%` را برای عدد صحیح بی‌اجرا بگویی.", de: "Du kannst das Ergebnis von `/` und `%` bei ganzen Zahlen ohne Ausführen sagen.", en: "You can say the result of `/` and `%` for whole numbers without running it." },
                    { fa: "بتوانی با `2.0` یا `(double)` حاصل اعشاری بگیری.", de: "Du kannst mit `2.0` oder `(double)` ein Ergebnis mit Komma bekommen.", en: "You can get a decimal result with `2.0` or `(double)`." },
                    { fa: "بتوانی ترتیب حساب را بگویی و با پرانتز عوضش کنی.", de: "Du kannst die Reihenfolge der Rechnung sagen und sie mit Klammern ändern.", en: "You can say the order of calculation and change it with parentheses." },
                    { fa: "بتوانی `+=`، `++` و خانواده‌شان را بخوانی و بنویسی.", de: "Du kannst `+=`, `++` und ihre Verwandten lesen und schreiben.", en: "You can read and write `+=`, `++` and their relatives." },
                    { fa: "بدانی `^` توان نیست و تقسیم بر صفر برنامه را متوقف می‌کند.", de: "Du weißt, dass `^` keine Potenz ist und eine Division durch null das Programm anhält.", en: "You know that `^` is not a power and that division by zero stops the program." },
                ] },
            { id: "C.L07", status: "written",
                title: {"fa": "نویسه و کد ASCII", "de": "Zeichen und ASCII", "en": "Characters & ASCII"},
                minutes: 20, prereq: ["C.L06"], introduces: ["K.char", "K.fmt-c", "K.esc-0", "K.esc-squote"],
                topics: [{ id: "types", stage: 4 }],
                cando: [
                    { fa: "بتوانی یک نویسه را در `char` نگه داری و با `%c` و `%d` چاپ کنی.", de: "Du kannst ein Zeichen in einem `char` halten und mit `%c` und `%d` ausgeben.", en: "You can keep a character in a `char` and print it with `%c` and `%d`." },
                    { fa: "بدانی هر نویسه پشت پرده یک عدد از جدول ASCII است.", de: "Du weißt, dass hinter jedem Zeichen eine Zahl aus der ASCII-Tabelle steckt.", en: "You know that behind every character is a number from the ASCII table." },
                    { fa: "بتوانی رقم را با `- '0'` به عدد تبدیل کنی.", de: "Du kannst eine Ziffer mit `- '0'` in eine Zahl umwandeln.", en: "You can turn a digit into a number with `- '0'`." },
                    { fa: "بتوانی حرف کوچک و بزرگ را با 32 به هم تبدیل کنی.", de: "Du kannst Klein- und Großbuchstaben mit 32 ineinander umwandeln.", en: "You can turn small and capital letters into each other with 32." },
                    { fa: "بتوانی تک‌کوتیشن و دوکوتیشن را درست به کار ببری.", de: "Du kannst einfache und doppelte Anführungszeichen richtig verwenden.", en: "You can use single and double quotes correctly." },
                ] },
            { id: "C.L08", status: "written",
                title: {"fa": "قالب‌بندی خروجی", "de": "Formatierte Ausgabe", "en": "Formatted Output"},
                minutes: 20, prereq: ["C.L07"], introduces: ["K.fmt-percent", "K.fmt-width"],
                topics: [{ id: "io", stage: 3 }],
                cando: [
                    { fa: "بتوانی با `%5d` و `%-5d` عددها را در ستون مرتب کنی.", de: "Du kannst Zahlen mit `%5d` und `%-5d` in Spalten ordnen.", en: "You can line numbers up in columns with `%5d` and `%-5d`." },
                    { fa: "بتوانی با `%.2f` تعداد رقم‌های اعشار را تعیین کنی.", de: "Du kannst mit `%.2f` die Zahl der Nachkommastellen festlegen.", en: "You can set the number of decimal places with `%.2f`." },
                    { fa: "بتوانی علامت `%` را با `%%` چاپ کنی.", de: "Du kannst das Zeichen `%` mit `%%` ausgeben.", en: "You can print the `%` sign with `%%`." },
                    { fa: "بدانی عرض حداقل است و عدد بلندتر بریده نمی‌شود.", de: "Du weißt, dass die Breite ein Minimum ist und eine längere Zahl nicht abgeschnitten wird.", en: "You know the width is a minimum and a longer number is not cut." },
                    { fa: "بتوانی خروجی دقیق یک `printf` با عرض و دقت را، با فاصله‌هایش، بنویسی.", de: "Du kannst die genaue Ausgabe eines `printf` mit Breite und Genauigkeit samt Leerzeichen aufschreiben.", en: "You can write the exact output of a `printf` with width and precision, spaces included." },
                ] },
        ],
        review: { id: "C02.REV", status: "written", minutes: 35,
            cando: [
                { fa: "بتوانی برای هر مقدار نوع درست را انتخاب کنی: `int`، `double`، `long long` یا `char`.", de: "Du kannst für jeden Wert den richtigen Typ wählen: `int`, `double`, `long long` oder `char`.", en: "You can choose the right type for each value: `int`, `double`, `long long` or `char`." },
                { fa: "بتوانی حاصل عبارت‌هایی با `/`، `%` و cast را بی‌اجرا بگویی.", de: "Du kannst das Ergebnis von Ausdrücken mit `/`, `%` und Cast ohne Ausführen sagen.", en: "You can say the value of expressions with `/`, `%` and a cast without running them." },
                { fa: "بتوانی یک جدول ردیابی برای چند انتساب پشت سر هم پر کنی.", de: "Du kannst eine Trace Table für mehrere Zuweisungen hintereinander ausfüllen.", en: "You can fill in a trace table for several assignments in a row." },
                { fa: "بتوانی خروجی را با عرض، دقت و `%%` مرتب کنی.", de: "Du kannst die Ausgabe mit Breite, Genauigkeit und `%%` ordnen.", en: "You can tidy output with width, precision and `%%`." },
                { fa: "بدانی چرا متغیر بی‌مقدار روی کامپیوتر تو و در این صفحه عدد متفاوتی نشان می‌دهد.", de: "Du weißt, warum eine Variable ohne Wert auf deinem Rechner und auf dieser Seite verschiedene Zahlen zeigt.", en: "You know why a variable without a value shows a different number on your computer and on this page." },
            ] },
    };
})(typeof window !== "undefined" ? window : globalThis);

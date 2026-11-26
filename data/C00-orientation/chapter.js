/* C00 — the register of chapter 0 (orientation): Orientation (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C00 = {
        id: "C00", orientation: true, title: {"fa": "جهت‌یابی", "de": "Orientierung", "en": "Orientation"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.O01", status: "written",
                title: {"fa": "C امروز کجاست", "de": "Wo C heute steckt", "en": "Where C Lives Today"},
                minutes: 15, prereq: [], introduces: [],
                cando: [
                    { fa: "بتوانی پنج حوزه را نام ببری که امروز با C ساخته می‌شوند.", de: "Du kannst fünf Bereiche nennen, die heute mit C gebaut werden.", en: "You can name five fields that are built with C today." },
                    { fa: "بتوانی توضیح دهی چرا زبان‌های سطح بالا جای C را نگرفته‌اند، بلکه روی آن ساخته شده‌اند.", de: "Du kannst erklären, warum höhere Sprachen C nicht ersetzt haben, sondern auf C aufbauen.", en: "You can explain why high-level languages did not replace C but are built on it." },
                    { fa: "بدانی در کدام درس‌های دانشگاه با C کار می‌کنی.", de: "Du weißt, in welchen Fächern des Studiums du mit C arbeitest.", en: "You know which university courses you will use C in." },
                    { fa: "بتوانی سه باور رایج دربارهٔ C را با شاهد پاسخ دهی.", de: "Du kannst drei verbreitete Annahmen über C mit Belegen beantworten.", en: "You can answer three common beliefs about C with evidence." },
                    { fa: "بدانی یادگیری C چه چیزی به یک مهندس نرم‌افزار می‌دهد.", de: "Du weißt, was C einer Softwareingenieurin oder einem Softwareingenieur bringt.", en: "You know what learning C gives a software engineer." },
                ] },
            { id: "C.O02", status: "written",
                title: {"fa": "از برنامه تا پردازنده", "de": "Vom Programm zum Prozessor", "en": "From Program to Processor"},
                minutes: 20, prereq: [], introduces: [],
                cando: [
                    { fa: "بتوانی machine code، assembly و زبان سطح بالا را از هم جدا کنی.", de: "Du kannst Maschinencode, Assembly und eine höhere Sprache unterscheiden.", en: "You can tell machine code, assembly and a high-level language apart." },
                    { fa: "بتوانی فرق compiler و interpreter را با یک مثال بگویی.", de: "Du kannst den Unterschied zwischen Compiler und Interpreter an einem Beispiel erklären.", en: "You can explain the difference between a compiler and an interpreter with an example." },
                    { fa: "بدانی C، Python و Java هر کدام چطور اجرا می‌شوند.", de: "Du weißt, wie C, Python und Java jeweils ausgeführt werden.", en: "You know how C, Python and Java are each run." },
                    { fa: "بتوانی چهار مرحلهٔ ساختن یک برنامهٔ C را به ترتیب بگویی.", de: "Du kannst die vier Schritte beim Bauen eines C-Programms der Reihe nach nennen.", en: "You can name the four steps of building a C program in order." },
                    { fa: "بتوانی چند خط assembly یک برنامهٔ کوچک را بخوانی و بگویی چه می‌کند.", de: "Du kannst ein paar Zeilen Assembly eines kleinen Programms lesen und sagen, was sie tun.", en: "You can read a few lines of a small program's assembly and say what they do." },
                ] },
            { id: "C.O03", status: "written",
                title: {"fa": "استانداردها و ابزارها", "de": "Standards und Werkzeuge", "en": "Standards and Tools"},
                minutes: 15, prereq: [], introduces: [],
                cando: [
                    { fa: "بتوانی نسخه‌های استاندارد C را به ترتیب زمان نام ببری.", de: "Du kannst die Versionen des C-Standards in zeitlicher Reihenfolge nennen.", en: "You can name the versions of the C standard in order." },
                    { fa: "بدانی چرا این دوره C17 را برگزیده و چرا همیشه `-std=c17` می‌نویسیم.", de: "Du weißt, warum dieser Kurs C17 gewählt hat und warum wir immer `-std=c17` schreiben.", en: "You know why this course uses C17 and why we always write `-std=c17`." },
                    { fa: "بتوانی gcc، clang و MSVC را از هم جدا کنی.", de: "Du kannst gcc, clang und MSVC unterscheiden.", en: "You can tell gcc, clang and MSVC apart." },
                    { fa: "بدانی POSIX، MISRA C و CERT C هر کدام برای چیست.", de: "Du weißt, wofür POSIX, MISRA C und CERT C jeweils da sind.", en: "You know what POSIX, MISRA C and CERT C are each for." },
                    { fa: "بتوانی بگویی C و C++ چه نسبتی با هم دارند.", de: "Du kannst sagen, wie C und C++ zueinander stehen.", en: "You can say how C and C++ relate." },
                ] },
            { id: "C.O04", status: "written",
                title: {"fa": "C روی کامپیوتر خودت", "de": "C auf deinem eigenen Rechner", "en": "C on Your Own Computer"},
                minutes: 25, prereq: [], introduces: [],
                cando: [
                    { fa: "بتوانی در terminal جابه‌جا شوی و پوشه بسازی.", de: "Du kannst dich im Terminal bewegen und Ordner anlegen.", en: "You can move around in the terminal and make folders." },
                    { fa: "بتوانی روی سیستم‌عامل خودت compiler نصب کنی.", de: "Du kannst auf deinem Betriebssystem einen Compiler installieren.", en: "You can install a compiler on your own operating system." },
                    { fa: "بتوانی یک برنامه را با `gcc -std=c17 -Wall -Wextra -pedantic` بسازی و اجرا کنی.", de: "Du kannst ein Programm mit `gcc -std=c17 -Wall -Wextra -pedantic` bauen und ausführen.", en: "You can build and run a program with `gcc -std=c17 -Wall -Wextra -pedantic`." },
                    { fa: "بدانی هر پرچم این دستور چه می‌کند.", de: "Du weißt, was jede Option dieses Befehls macht.", en: "You know what each option of that command does." },
                    { fa: "بتوانی ویرایشگر، compiler و IDE را از هم جدا کنی.", de: "Du kannst Editor, Compiler und IDE unterscheiden.", en: "You can tell an editor, a compiler and an IDE apart." },
                ] },
            { id: "C.O05", status: "written",
                title: {"fa": "چطور C را یاد بگیریم", "de": "Wie man C lernt", "en": "How to Learn C"},
                minutes: 15, prereq: [], introduces: [],
                cando: [
                    { fa: "بتوانی شش عادت یادگیری برنامه‌نویسی را نام ببری و به کار ببری.", de: "Du kannst sechs Lerngewohnheiten fürs Programmieren nennen und anwenden.", en: "You can name and use six habits for learning programming." },
                    { fa: "بدانی هر بخش یک درس این دوره برای چیست.", de: "Du weißt, wofür jeder Teil einer Lektion dieses Kurses da ist.", en: "You know what each part of a lesson in this course is for." },
                    { fa: "بدانی از AI چطور مثل معلم استفاده کنی، نه مثل حل‌کننده.", de: "Du weißt, wie du KI als Lehrer nutzt, nicht als Löser.", en: "You know how to use AI as a tutor, not as a solver." },
                    { fa: "بتوانی بگویی دانسته‌های Python کجا کمکت می‌کند و کجا گمراهت می‌کند.", de: "Du kannst sagen, wo dir Python-Wissen hilft und wo es dich in die Irre führt.", en: "You can say where knowing Python helps you and where it misleads you." },
                    { fa: "یک برنامهٔ هفتگی واقع‌بینانه برای خودت داشته باشی.", de: "Du hast einen realistischen Wochenplan für dich.", en: "You have a realistic weekly plan for yourself." },
                ] },
        ],
    };
})(typeof window !== "undefined" ? window : globalThis);

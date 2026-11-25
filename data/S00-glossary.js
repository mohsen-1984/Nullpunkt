/* S00G — the glossary, shared by every series (S00-schema: term). The English term is the reference; `use` is the
   form running text uses (S.LNG.02); `gloss` is shown once, at the first introduction (S.GLS.01); `deArticle` keeps
   German text consistent (S.LNG.04). German entries await native review (S.LNG.05). */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.files.S00G = {
        id: 'S00G', kind: 'glossary', version: '0.1.0',
        terms: [
            {
                id: 'T.program', en: 'program', use: { fa: 'برنامه', de: 'Programm' },
                gloss: { fa: 'program', de: 'program' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'دنباله‌ای از دستورها که کامپیوتر اجرا می‌کند.',
                    de: 'Eine Folge von Anweisungen, die der Computer ausführt.',
                    en: 'A sequence of instructions that the computer runs.',
                },
            },
            {
                id: 'T.source-code', en: 'source code', use: { fa: 'source code', de: 'Source Code' },
                gloss: { fa: 'کد منبع', de: 'Quellcode' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'متن برنامه، همان‌طور که آدم آن را می‌نویسد و می‌خواند.',
                    de: 'Der Text eines Programms, so wie ein Mensch ihn schreibt und liest.',
                    en: 'The text of a program, as a person writes and reads it.',
                },
            },
            {
                id: 'T.compiler', en: 'compiler', use: { fa: 'compiler', de: 'Compiler' },
                gloss: { fa: 'کامپایلر', de: 'Übersetzer' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'برنامه‌ای که source code را می‌خواند، قاعده‌هایش را بررسی می‌کند و آن را به برنامه‌ای قابل اجرا ترجمه می‌کند.',
                    de: 'Ein Programm, das Source Code liest, seine Regeln prüft und ihn in ein ausführbares Programm übersetzt.',
                    en: 'A program that reads source code, checks its rules and translates it into a program that can run.',
                },
            },
            {
                id: 'T.statement', en: 'statement', use: { fa: 'statement', de: 'Statement' },
                gloss: { fa: 'دستور', de: 'Anweisung' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'یک فرمان کامل برای ماشین؛ در C معمولاً با `;` تمام می‌شود.',
                    de: 'Ein vollständiger Befehl an die Maschine; in C endet er meist mit `;`.',
                    en: 'One complete instruction for the machine; in C it usually ends with `;`.',
                },
            },
            {
                id: 'T.escape-sequence', en: 'escape sequence', use: { fa: 'escape sequence', de: 'Escape-Sequenz' },
                gloss: { fa: 'دنبالهٔ گریز', de: 'Escape-Sequenz' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'یک `\\` و نویسهٔ بعد از آن، که با هم یک نویسهٔ ویژه می‌سازند، مثل `\\n` برای سر خط.',
                    de: 'Ein `\\` mit dem folgenden Zeichen, die zusammen ein Sonderzeichen bilden, etwa `\\n` für einen Zeilenumbruch.',
                    en: 'A `\\` and the character after it, which together stand for one special character, such as `\\n` for a new line.',
                },
            },
            {
                id: 'T.comment', en: 'comment', use: { fa: 'comment', de: 'Kommentar' },
                gloss: { fa: 'توضیح', de: 'Kommentar' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'یادداشتی در کد برای آدم‌ها، که compiler نادیده‌اش می‌گیرد.',
                    de: 'Eine Notiz im Code für Menschen, die der Compiler ignoriert.',
                    en: 'A note in the code for people, which the compiler ignores.',
                },
            },
            {
                id: 'T.output', en: 'output', use: { fa: 'خروجی', de: 'Ausgabe' },
                gloss: { fa: 'output', de: 'output' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'آنچه برنامه روی صفحه چاپ می‌کند.',
                    de: 'Was ein Programm auf dem Bildschirm ausgibt.',
                    en: 'What a program prints on the screen.',
                },
            },
            {
                id: 'T.compile-error', en: 'compile error', use: { fa: 'compile error', de: 'Compile-Fehler' },
                gloss: { fa: 'خطای کامپایل', de: 'Übersetzungsfehler' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'قاعده‌ای از C که رعایت نشده؛ compiler برنامه‌ای نمی‌سازد.',
                    de: 'Eine verletzte Regel von C; der Compiler baut kein Programm.',
                    en: 'A broken rule of C; the compiler builds no program.',
                },
            },
            {
                id: 'T.warning', en: 'warning', use: { fa: 'warning', de: 'Warnung' },
                gloss: { fa: 'هشدار', de: 'warning' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'پیامی دربارهٔ چیزی مشکوک در کد؛ برنامه ساخته می‌شود، ولی احتمالاً درست کار نمی‌کند.',
                    de: 'Eine Meldung über etwas Verdächtiges im Code; das Programm wird gebaut, arbeitet aber wahrscheinlich nicht richtig.',
                    en: 'A message about something suspicious in the code; the program is built but probably does not work correctly.',
                },
            },
            {
                id: 'T.linker', en: 'linker', use: { fa: 'linker', de: 'Linker' },
                gloss: { fa: 'پیونددهنده', de: 'Binder' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'برنامه‌ای که پس از compiler، کد تو را به کد کتابخانه‌ها (مثل `printf`) وصل می‌کند.',
                    de: 'Ein Programm, das nach dem Compiler deinen Code mit dem Code der Bibliotheken (wie `printf`) verbindet.',
                    en: 'A program that, after the compiler, joins your code with the code of libraries (like `printf`).',
                },
            },
            {
                id: 'T.format-string', en: 'format string', use: { fa: 'format string', de: 'Format-String' },
                gloss: { fa: 'رشتهٔ قالب', de: 'Formatzeichenkette' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'متن اول `printf`، بین دو `"`؛ می‌گوید چه چاپ شود و مقدارها کجا بنشینند.',
                    de: 'Der erste Text von `printf`, zwischen den `"`; er sagt, was ausgegeben wird und wo die Werte stehen.',
                    en: 'The first text of `printf`, between the `"`; it says what is printed and where the values go.',
                },
            },
            {
                id: 'T.format-specifier', en: 'format specifier', use: { fa: 'format specifier', de: 'Format-Specifier' },
                gloss: { fa: 'جای‌نگه‌دار مقدار', de: 'Formatangabe' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'نشانه‌ای مثل `%d` در format string که جای یک مقدار را نگه می‌دارد.',
                    de: 'Ein Zeichen wie `%d` im Format-String, das den Platz für einen Wert freihält.',
                    en: 'A marker like `%d` in the format string that holds the place of a value.',
                },
            },
            {
                id: 'T.argument', en: 'argument', use: { fa: 'argument', de: 'Argument' },
                gloss: { fa: 'ورودی تابع', de: 'Übergabewert' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'هر مقداری که درون پرانتز به یک تابع مثل `printf` می‌دهی؛ argumentها با `,` جدا می‌شوند.',
                    de: 'Jeder Wert, den du in den Klammern an eine Funktion wie `printf` übergibst; Argumente werden durch `,` getrennt.',
                    en: 'Each value you give to a function like `printf` inside the parentheses; arguments are separated by `,`.',
                },
            },
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

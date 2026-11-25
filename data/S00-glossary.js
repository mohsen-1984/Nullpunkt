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
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

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
                id: 'T.source-code', en: 'source code', use: { fa: 'source code', de: 'Sourcecode' },
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
                alt: { fa: ['کامپایل'], de: ['Übersetzer'] },
                def: {
                    fa: 'برنامه‌ای که source code را می‌خواند، قاعده‌هایش را بررسی می‌کند و آن را به برنامه‌ای قابل اجرا ترجمه می‌کند.',
                    de: 'Ein Programm, das Sourcecode liest, seine Regeln prüft und ihn in ein ausführbares Programm übersetzt.',
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
            {
                id: 'T.embedded-system', en: 'embedded system', use: { fa: 'embedded system', de: 'eingebettetes System' },
                gloss: { fa: 'سامانهٔ نهفته', de: 'embedded system' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'کامپیوتر کوچکی درون یک دستگاه دیگر، مثل خودرو یا ماشین لباسشویی، که فقط یک کار را انجام می‌دهد.',
                    de: 'Ein kleiner Computer in einem anderen Gerät, etwa einem Auto oder einer Waschmaschine, der nur eine Aufgabe erledigt.',
                    en: 'A small computer inside another device, such as a car or a washing machine, that does one job.',
                },
            },
            {
                id: 'T.machine-code', en: 'machine code', use: { fa: 'machine code', de: 'Maschinencode' },
                gloss: { fa: 'کد ماشین', de: 'machine code' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'دستورهایی به شکل عدد که پردازنده مستقیم اجرا می‌کند.',
                    de: 'Befehle in Form von Zahlen, die der Prozessor direkt ausführt.',
                    en: 'Instructions in the form of numbers that the processor runs directly.',
                },
            },
            {
                id: 'T.assembly-language', en: 'assembly language', use: { fa: 'assembly', de: 'Assembly' },
                gloss: { fa: 'زبان اسمبلی', de: 'Assemblersprache' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'نوشتن machine code با نام‌های کوتاه مثل `mov` و `call`؛ هر خط تقریباً یک دستور پردازنده.',
                    de: 'Maschinencode mit kurzen Namen wie `mov` und `call` geschrieben; jede Zeile ist ungefähr ein Prozessorbefehl.',
                    en: 'Machine code written with short names like `mov` and `call`; each line is about one processor instruction.',
                },
            },
            {
                id: 'T.interpreter', en: 'interpreter', use: { fa: 'interpreter', de: 'Interpreter' },
                gloss: { fa: 'مفسر', de: 'Übersetzer zur Laufzeit' }, deArticle: 'der', series: ['C'],
                alt: { fa: ['مفسر'], de: ['Übersetzer zur Laufzeit'] },
                def: {
                    fa: 'برنامه‌ای که برنامهٔ دیگری را هنگام اجرا، گام به گام پیش می‌برد، بی‌آنکه پیش از آن یک executable بسازد.',
                    de: 'Ein Programm, das ein anderes Programm beim Ausführen Schritt für Schritt abarbeitet, ohne vorher ein ausführbares Programm zu bauen.',
                    en: 'A program that works through another program step by step while it runs, without building an executable first.',
                },
            },
            {
                id: 'T.bytecode', en: 'bytecode', use: { fa: 'bytecode', de: 'Bytecode' },
                gloss: { fa: 'کد میانی', de: 'Zwischencode' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'شکل میانی یک برنامه، نزدیک به machine code، که یک ماشین مجازی یا interpreter آن را اجرا می‌کند.',
                    de: 'Eine Zwischenform eines Programms, nah am Maschinencode, die eine virtuelle Maschine oder ein Interpreter ausführt.',
                    en: 'An in-between form of a program, close to machine code, that a virtual machine or an interpreter runs.',
                },
            },
            {
                id: 'T.executable', en: 'executable', use: { fa: 'executable', de: 'ausführbares Programm' },
                gloss: { fa: 'فایل اجرایی', de: 'executable' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'فایلی که compiler و linker می‌سازند و سیستم‌عامل می‌تواند مستقیم اجرا کند.',
                    de: 'Die Datei, die Compiler und Linker bauen und die das Betriebssystem direkt starten kann.',
                    en: 'The file that the compiler and linker build and that the operating system can start directly.',
                },
            },
            {
                id: 'T.terminal', en: 'terminal', use: { fa: 'terminal', de: 'Terminal' },
                gloss: { fa: 'پایانه، خط فرمان', de: 'Kommandozeile' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'پنجره‌ای که در آن به‌جای کلیک کردن دستور می‌نویسی.',
                    de: 'Ein Fenster, in dem du Befehle tippst, statt zu klicken.',
                    en: 'A window where you type commands instead of clicking.',
                },
            },
            {
                id: 'T.ide', en: 'IDE', use: { fa: 'IDE', de: 'IDE' },
                gloss: { fa: 'محیط یکپارچهٔ توسعه', de: 'Entwicklungsumgebung' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'برنامه‌ای که ویرایشگر، اجرای compiler و debugger را کنار هم می‌گذارد، مثل VS Code یا CLion.',
                    de: 'Ein Programm, das Editor, Compileraufruf und Debugger bündelt, etwa VS Code oder CLion.',
                    en: 'A program that puts an editor, the compiler and a debugger together, such as VS Code or CLion.',
                },
            },
            {
                id: 'T.variable', en: 'variable', use: { fa: 'متغیر', de: 'Variable' },
                gloss: { fa: 'variable', de: 'variable' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'جایی در حافظه با یک نام و یک نوع، که یک مقدار نگه می‌دارد؛ مقدارش می‌تواند عوض شود.',
                    de: 'Ein Platz im Speicher mit einem Namen und einem Typ, der einen Wert hält; der Wert kann sich ändern.',
                    en: 'A place in memory with a name and a type that holds one value; the value can change.',
                },
            },
            {
                id: 'T.identifier', en: 'identifier', use: { fa: 'identifier', de: 'Identifier' },
                gloss: { fa: 'شناسه', de: 'Bezeichner' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'نامی که برنامه‌نویس به یک متغیر یا تابع می‌دهد؛ از حرف، رقم و `_`، و با رقم شروع نمی‌شود.',
                    de: 'Ein Name, den du einer Variablen oder Funktion gibst; aus Buchstaben, Ziffern und `_`, nicht mit einer Ziffer am Anfang.',
                    en: 'A name the programmer gives to a variable or function; made of letters, digits and `_`, not starting with a digit.',
                },
            },
            {
                id: 'T.declaration', en: 'declaration', use: { fa: 'declaration', de: 'Deklaration' },
                gloss: { fa: 'اعلان', de: 'Vereinbarung' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'خطی که به compiler می‌گوید یک نام از چه نوعی است، مثل `int count;`.',
                    de: 'Eine Zeile, die dem Compiler sagt, welchen Typ ein Name hat, etwa `int count;`.',
                    en: 'A line that tells the compiler which type a name has, such as `int count;`.',
                },
            },
            {
                id: 'T.assignment', en: 'assignment', use: { fa: 'assignment', de: 'Zuweisung' },
                gloss: { fa: 'انتساب', de: 'assignment' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'گذاشتن مقدار تازه در یک متغیر با `=`: اول سمت راست حساب می‌شود، بعد در سمت چپ می‌نشیند.',
                    de: 'Einen neuen Wert mit `=` in eine Variable legen: Zuerst wird die rechte Seite ausgerechnet, dann links abgelegt.',
                    en: 'Putting a new value into a variable with `=`: the right-hand side is worked out first, then stored on the left.',
                },
            },
            {
                id: 'T.initialization', en: 'initialization', use: { fa: 'initialization', de: 'Initialisierung' },
                gloss: { fa: 'مقداردهی اولیه', de: 'initialization' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'دادن اولین مقدار به یک متغیر در همان اعلان، مثل `int count = 0;`.',
                    de: 'Einer Variablen gleich in der Deklaration ihren ersten Wert geben, etwa `int count = 0;`.',
                    en: 'Giving a variable its first value in the declaration itself, such as `int count = 0;`.',
                },
            },
            {
                id: 'T.type', en: 'type', use: { fa: 'نوع', de: 'Typ' },
                gloss: { fa: 'type', de: 'Datentyp' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'اینکه یک مقدار چه جور چیزی است و چقدر جا می‌گیرد: `int`، `double`، `char` و مانند آن.',
                    de: 'Welche Art von Wert etwas ist und wie viel Platz es braucht: `int`, `double`, `char` und so weiter.',
                    en: 'What kind of value something is and how much room it takes: `int`, `double`, `char` and so on.',
                },
            },
            {
                id: 'T.floating-point', en: 'floating-point number', use: { fa: 'floating-point', de: 'Gleitkommazahl' },
                gloss: { fa: 'ممیز شناور', de: 'floating-point number' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'عددی با کسر که مثل نماد علمی ذخیره می‌شود، با رقم‌های معنادار و یک توان؛ در C معمولاً `double`.',
                    de: 'Eine Zahl mit Bruchteil, gespeichert wie in wissenschaftlicher Schreibweise, mit gültigen Stellen und einem Exponenten; in C meist `double`.',
                    en: 'A number with a fraction, stored like scientific notation, with significant digits and an exponent; in C usually `double`.',
                },
            },
            {
                id: 'T.overflow', en: 'overflow', use: { fa: 'overflow', de: 'Überlauf' },
                gloss: { fa: 'سرریز', de: 'overflow' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'وقتی حاصل یک حساب در جعبهٔ نوعش جا نمی‌شود؛ برای `int` رفتار تعریف‌نشده است.',
                    de: 'Wenn das Ergebnis einer Rechnung nicht in den Kasten seines Typs passt; bei `int` undefiniertes Verhalten.',
                    en: 'When the result of a calculation does not fit in the box of its type; for `int` it is undefined behavior.',
                },
            },
            {
                id: 'T.expression', en: 'expression', use: { fa: 'expression', de: 'Ausdruck' },
                gloss: { fa: 'عبارت', de: 'expression' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'هر چیزی که یک مقدار دارد: یک عدد، یک متغیر، یا ترکیبی با عملگر مثل `price * count`.',
                    de: 'Alles, was einen Wert hat: eine Zahl, eine Variable oder eine Verbindung mit Operatoren wie `price * count`.',
                    en: 'Anything that has a value: a number, a variable, or a combination with operators such as `price * count`.',
                },
            },
            {
                id: 'T.operator', en: 'operator', use: { fa: 'operator', de: 'Operator' },
                gloss: { fa: 'عملگر', de: 'operator' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'نمادی که روی مقدارها کاری انجام می‌دهد، مثل `+`، `/`، `%` یا `=`.',
                    de: 'Ein Zeichen, das mit Werten etwas tut, etwa `+`, `/`, `%` oder `=`.',
                    en: 'A symbol that does something with values, such as `+`, `/`, `%` or `=`.',
                },
            },
            {
                id: 'T.precedence', en: 'precedence', use: { fa: 'precedence', de: 'Rangfolge' },
                gloss: { fa: 'اولویت عملگرها', de: 'precedence' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'ترتیبی که عملگرها حساب می‌شوند: پرانتز، بعد `*` `/` `%`، بعد `+` `-`.',
                    de: 'Die Reihenfolge, in der Operatoren ausgewertet werden: Klammern, dann `*` `/` `%`, dann `+` `-`.',
                    en: 'The order in which operators are worked out: parentheses, then `*` `/` `%`, then `+` `-`.',
                },
            },
            {
                id: 'T.integer-division', en: 'integer division', use: { fa: 'integer division', de: 'Ganzzahldivision' },
                gloss: { fa: 'تقسیم صحیح', de: 'integer division' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'تقسیم دو عدد صحیح که کسر را به سمت صفر دور می‌ریزد: `7 / 2` برابر 3.',
                    de: 'Die Division zweier ganzer Zahlen, die den Bruchteil in Richtung null wegwirft: `7 / 2` ist 3.',
                    en: 'Dividing two whole numbers, which throws the fraction away towards zero: `7 / 2` is 3.',
                },
            },
            {
                id: 'T.cast', en: 'cast', use: { fa: 'cast', de: 'Cast' },
                gloss: { fa: 'تبدیل صریح نوع', de: 'Typumwandlung' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'تبدیل صریح یک مقدار به نوع دیگر، مثل `(double) total`.',
                    de: 'Die ausdrückliche Umwandlung eines Werts in einen anderen Typ, etwa `(double) total`.',
                    en: 'Explicitly turning a value into another type, such as `(double) total`.',
                },
            },
            {
                id: 'T.character', en: 'character', use: { fa: 'نویسه', de: 'Zeichen' },
                gloss: { fa: 'character', de: 'character' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'یک حرف، رقم، فاصله یا علامت؛ در C یک `char` که پشت پرده یک عدد کوچک است.',
                    de: 'Ein Buchstabe, eine Ziffer, ein Leerzeichen oder Satzzeichen; in C ein `char`, hinter dem eine kleine Zahl steckt.',
                    en: 'A letter, digit, space or mark; in C a `char`, which is a small number underneath.',
                },
            },
            {
                id: 'T.ascii', en: 'ASCII', use: { fa: 'ASCII', de: 'ASCII' },
                gloss: { fa: 'جدول کد ASCII', de: 'ASCII-Code' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'جدولی که به هر نویسهٔ انگلیسی یک عدد از 0 تا 127 می‌دهد، مثل 65 برای `A`.',
                    de: 'Eine Tabelle, die jedem englischen Zeichen eine Zahl von 0 bis 127 gibt, etwa 65 für `A`.',
                    en: 'A table that gives each English character a number from 0 to 127, such as 65 for `A`.',
                },
            },
            {
                id: 'T.field-width', en: 'field width', use: { fa: 'field width', de: 'Feldbreite' },
                gloss: { fa: 'عرض میدان', de: 'field width' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'کمترین تعداد خانه‌ای که `printf` به یک مقدار می‌دهد، مثل 5 در `%5d`؛ عدد بلندتر بریده نمی‌شود.',
                    de: 'Die kleinste Zahl an Stellen, die `printf` einem Wert gibt, etwa 5 in `%5d`; eine längere Zahl wird nicht abgeschnitten.',
                    en: 'The smallest number of places `printf` gives a value, such as 5 in `%5d`; a longer number is not cut.',
                },
            },
            {
                id: 'T.precision', en: 'precision', use: { fa: 'precision', de: 'Genauigkeit' },
                gloss: { fa: 'دقت', de: 'precision' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'تعداد رقم‌های اعشاری که `printf` چاپ می‌کند، مثل 2 در `%.2f`؛ مقدار ذخیره‌شده عوض نمی‌شود.',
                    de: 'Die Zahl der Nachkommastellen, die `printf` ausgibt, etwa 2 in `%.2f`; der gespeicherte Wert ändert sich nicht.',
                    en: 'The number of decimal places `printf` prints, such as 2 in `%.2f`; the stored value does not change.',
                },
            },
            {
                id: 'T.input', en: 'input', use: { fa: 'ورودی', de: 'Eingabe' },
                gloss: { fa: 'input', de: 'input' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'آنچه برنامه هنگام اجرا می‌خواند، در این دوره از صفحه‌کلید (stdin).',
                    de: 'Was ein Programm während des Laufs liest, in diesem Kurs von der Tastatur (stdin).',
                    en: 'What a program reads while it runs, in this course from the keyboard (stdin).',
                },
            },
            {
                id: 'T.address', en: 'address', use: { fa: 'آدرس', de: 'Adresse' },
                gloss: { fa: 'address', de: 'address' }, deArticle: 'die', series: ['C'],
                def: {
                    fa: 'شمارهٔ جای یک متغیر در حافظه؛ `&age` آدرس `age` است.',
                    de: 'Die Nummer des Platzes einer Variablen im Speicher; `&age` ist die Adresse von `age`.',
                    en: 'The number of the place of a variable in memory; `&age` is the address of `age`.',
                },
            },
            {
                id: 'T.buffer', en: 'buffer', use: { fa: 'buffer', de: 'Puffer' },
                gloss: { fa: 'میانگیر', de: 'buffer' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'حافظه‌ای که ورودی در آن منتظر می‌ماند تا برنامه آن را بخواند؛ هرچه `scanf` نخوانَد، همان‌جا می‌ماند.',
                    de: 'Speicher, in dem die Eingabe wartet, bis das Programm sie liest; was `scanf` nicht liest, bleibt dort.',
                    en: 'Memory where input waits until the program reads it; whatever `scanf` does not read stays there.',
                },
            },
            {
                id: 'T.return-value', en: 'return value', use: { fa: 'مقدار بازگشتی', de: 'Rückgabewert' },
                gloss: { fa: 'return value', de: 'return value' }, deArticle: 'der', series: ['C'],
                def: {
                    fa: 'مقداری که یک تابع به کدِ صداکننده‌اش پس می‌دهد؛ `scanf` تعداد مقدارهایی را که خوانده پس می‌دهد.',
                    de: 'Der Wert, den eine Funktion an den aufrufenden Code zurückgibt; `scanf` gibt zurück, wie viele Werte es gelesen hat.',
                    en: 'The value a function gives back to the code that called it; `scanf` gives back how many values it read.',
                },
            },
            {
                id: 'T.eof', en: 'EOF', use: { fa: 'EOF', de: 'EOF' },
                gloss: { fa: 'پایان ورودی', de: 'Ende der Eingabe' }, deArticle: 'das', series: ['C'],
                def: {
                    fa: 'نشانهٔ تمام شدن ورودی: `getchar` و `scanf` در این حالت مقدار `EOF` را پس می‌دهند، که -1 است.',
                    de: 'Das Zeichen, dass die Eingabe zu Ende ist: `getchar` und `scanf` geben dann den Wert `EOF` zurück, der -1 ist.',
                    en: 'The sign that the input has ended: `getchar` and `scanf` then give back the value `EOF`, which is -1.',
                },
            },
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

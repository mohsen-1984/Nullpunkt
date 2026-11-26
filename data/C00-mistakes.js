/* C00M — the common mistakes of the C series (S00-schema: mistake). The symptom of each mistake is never written by
   hand: it is read from the generated result of its `wrong` code (S.PIT.03). */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.files.C00M = {
        id: 'C00M', kind: 'mistakes', series: 'C', version: '0.1.0',
        // Ids that were published and then retired: never used again (S.ID.01)
        retired: [
            { id: 'W-01', by: 'E-07', since: '0.1.1', why: 'Missing #include <stdio.h> is an error from gcc 14 on and in clang, not a warning (C.CMP.01).' },
        ],
        mistakes: [
            {
                id: 'M-01', dim: 'M', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'فکر می‌کنی `printf` خودش سر خط می‌رود',
                    de: 'Du denkst, `printf` beginnt von selbst eine neue Zeile',
                    en: 'Thinking `printf` starts a new line by itself',
                },
                wrong: 'C.L01.K03', right: 'C.L01.K04',
                why: {
                    fa: 'در Python، `print` در پایان هر چاپ خودش سر خط می‌رود. `printf` در C فقط همان نویسه‌هایی را چاپ می‌کند که به آن داده‌ای؛ سر خط را خودت با `\\n` می‌نویسی.',
                    de: 'In Python beginnt `print` nach jeder Ausgabe selbst eine neue Zeile. `printf` in C gibt nur genau die Zeichen aus, die du ihm gibst; den Zeilenumbruch schreibst du selbst mit `\\n`.',
                    en: 'In Python, `print` starts a new line after every output by itself. `printf` in C prints exactly the characters you give it; you write the new line yourself with `\\n`.',
                },
            },
            {
                id: 'E-01', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: '`;` در پایان statement جا افتاده',
                    de: 'Das `;` am Ende des Statements fehlt',
                    en: 'Missing `;` at the end of a statement',
                },
                wrong: 'C.L01.K05', right: 'C.L01.K04',
                why: {
                    fa: 'هر statement در C با `;` تمام می‌شود. compiler پایان statement را فقط از روی `;` می‌شناسد، نه از روی پایان خط.',
                    de: 'Jedes Statement in C endet mit `;`. Der Compiler erkennt das Ende eines Statements nur am `;`, nicht am Zeilenende.',
                    en: 'Every statement in C ends with `;`. The compiler knows where a statement ends only from the `;`, not from the end of the line.',
                },
            },
            {
                id: 'E-02', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: '`"` پایانی متن جا افتاده',
                    de: 'Das schließende `"` fehlt',
                    en: 'Missing closing `"`',
                },
                wrong: 'C.L01.K06', right: 'C.L01.K04',
                why: {
                    fa: 'متن درون `printf` با یک `"` شروع و با یک `"` تمام می‌شود. بدون `"` دوم، compiler نمی‌داند متن کجا تمام می‌شود.',
                    de: 'Der Text in `printf` beginnt mit einem `"` und endet mit einem `"`. Ohne das zweite `"` weiß der Compiler nicht, wo der Text aufhört.',
                    en: 'The text inside `printf` starts with one `"` and ends with another. Without the second `"`, the compiler cannot tell where the text ends.',
                },
            },
            {
                id: 'E-03', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: 'نام تابع اشتباه نوشته شده (`Printf`، `prinf`، `print`)',
                    de: 'Der Name der Funktion ist falsch geschrieben (`Printf`, `prinf`, `print`)',
                    en: 'Misspelled function name (`Printf`, `prinf`, `print`)',
                },
                wrong: 'C.L02.K01', right: 'C.L02.K03',
                why: {
                    fa: 'C به بزرگی و کوچکی حروف حساس است و نام‌ها را حدس نمی‌زند. `Printf` برای C یک نام کاملاً دیگر است که هیچ‌جا تعریف نشده؛ برای همین برنامه ساخته نمی‌شود.',
                    de: 'C unterscheidet Groß- und Kleinschreibung und rät keine Namen. `Printf` ist für C ein ganz anderer Name, der nirgends definiert ist; deshalb entsteht kein Programm.',
                    en: 'C is case-sensitive and does not guess names. To C, `Printf` is a completely different name that is defined nowhere, so no program is built.',
                },
            },
            {
                id: 'E-04', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: 'آکولاد پایانی `}` جا افتاده',
                    de: 'Die schließende Klammer `}` fehlt',
                    en: 'Missing closing brace `}`',
                },
                wrong: 'C.L02.K04', right: 'C.L02.K05',
                why: {
                    fa: 'هر `{` یک `}` همتا لازم دارد. compiler تا پایان فایل دنبال `}` می‌گردد؛ برای همین پیام به خط آخر اشاره می‌کند، نه به جایی که `}` باید می‌بود.',
                    de: 'Jede `{` braucht eine passende `}`. Der Compiler sucht bis zum Dateiende nach der `}`; deshalb zeigt die Meldung auf die letzte Zeile, nicht auf die Stelle, an der die `}` stehen müsste.',
                    en: 'Every `{` needs a matching `}`. The compiler looks for the `}` until the end of the file, so the message points to the last line, not to where the `}` should be.',
                },
            },
            {
                id: 'E-07', dim: 'E', src: 'SRC.prior', contrast: 'CT.new',
                title: {
                    fa: '`#include <stdio.h>` جا افتاده',
                    de: '`#include <stdio.h>` fehlt',
                    en: 'Missing `#include <stdio.h>`',
                },
                wrong: 'C.L02.K06', right: 'C.L02.K07',
                why: {
                    fa: 'در Python، `print` همیشه آماده است. در C، `printf` در کتابخانهٔ استاندارد است و `#include <stdio.h>` آن را به compiler معرفی می‌کند. بدون آن، compiler نام `printf` را نمی‌شناسد و برنامه ساخته نمی‌شود. gcc قدیمی (13 و پیش از آن) فقط warning می‌داد؛ آن warning را هم مثل خطا جدی بگیر.',
                    de: 'In Python ist `print` immer da. In C steht `printf` in der Standardbibliothek, und `#include <stdio.h>` macht es dem Compiler bekannt. Ohne diese Zeile kennt der Compiler den Namen `printf` nicht, und es entsteht kein Programm. Ein altes gcc (13 und früher) gab nur eine Warnung aus; nimm auch diese Warnung so ernst wie einen Fehler.',
                    en: 'In Python, `print` is always there. In C, `printf` lives in the standard library, and `#include <stdio.h>` introduces it to the compiler. Without that line the compiler does not know the name `printf`, and no program is built. An old gcc (13 and before) only gave a warning; take that warning as seriously as an error.',
                },
            },
            {
                id: 'M-02', dim: 'M', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'فکر می‌کنی حساب درون `"` انجام می‌شود',
                    de: 'Du denkst, eine Rechnung innerhalb der `"` wird ausgerechnet',
                    en: 'Thinking a calculation inside `"` is worked out',
                },
                wrong: 'C.L03.K04', right: 'C.L03.K05',
                why: {
                    fa: 'در ریاضی `7 * 6` یعنی 42. ولی هر چیزی بین دو `"` فقط متن است و عیناً چاپ می‌شود. برای چاپ حاصل، حساب را بیرون از `"` بنویس و جایش در متن `%d` بگذار.',
                    de: 'In der Mathematik heißt `7 * 6` 42. Aber alles zwischen den beiden `"` ist nur Text und wird genau so ausgegeben. Um das Ergebnis auszugeben, schreib die Rechnung außerhalb der `"` und setz an ihre Stelle im Text ein `%d`.',
                    en: 'In math, `7 * 6` means 42. But everything between the two `"` is just text and is printed as it is. To print the result, write the calculation outside the `"` and put a `%d` in the text where it belongs.',
                },
            },
            {
                id: 'M-03', dim: 'M', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'یک `\\` تنها در مسیر فایل',
                    de: 'Ein einzelnes `\\` in einem Dateipfad',
                    en: 'A single `\\` in a file path',
                },
                wrong: 'C.L03.K06', right: 'C.L03.K07',
                why: {
                    fa: 'در Windows مسیرها را با `\\` می‌نویسی: `C:\\notes`. ولی درون `"` در C، `\\` شروع یک escape sequence است: `\\n` سر خط می‌رود و `\\t` یک tab می‌گذارد. برای چاپ خود `\\` باید دوتا بنویسی: `\\\\`.',
                    de: 'In Windows schreibst du Pfade mit `\\`: `C:\\notes`. Aber innerhalb der `"` beginnt in C mit `\\` eine Escape-Sequenz: `\\n` beginnt eine neue Zeile und `\\t` setzt einen Tab. Um das `\\` selbst auszugeben, schreibst du es doppelt: `\\\\`.',
                    en: 'In Windows you write paths with `\\`: `C:\\notes`. But inside `"` in C, `\\` starts an escape sequence: `\\n` starts a new line and `\\t` puts a tab. To print the `\\` itself, write it twice: `\\\\`.',
                },
            },
            {
                id: 'E-05', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: 'ویرگول بین متن و مقدار جا افتاده',
                    de: 'Das Komma zwischen Text und Wert fehlt',
                    en: 'Missing comma between the text and the value',
                },
                wrong: 'C.L03.K08', right: 'C.L03.K05',
                why: {
                    fa: 'بخش‌هایی که به `printf` می‌دهی با `,` از هم جدا می‌شوند. بدون ویرگول، compiler نمی‌داند متن کجا تمام شده و مقدار کجا شروع می‌شود.',
                    de: 'Die Teile, die du `printf` gibst, werden durch `,` getrennt. Ohne Komma weiß der Compiler nicht, wo der Text aufhört und der Wert beginnt.',
                    en: 'The parts you give to `printf` are separated by `,`. Without the comma, the compiler cannot tell where the text ends and the value begins.',
                },
            },
            {
                id: 'E-06', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: '`"` درون متن بدون `\\`',
                    de: '`"` im Text ohne `\\`',
                    en: '`"` inside the text without `\\`',
                },
                wrong: 'C.L03.K09', right: 'C.L03.K10',
                why: {
                    fa: 'compiler اولین `"` بعدی را پایان متن می‌داند. برای اینکه `"` جزو متن چاپ شود، جلویش `\\` بگذار: `\\"`.',
                    de: 'Der Compiler hält das nächste `"` für das Ende des Textes. Damit ein `"` als Teil des Textes ausgegeben wird, setz ein `\\` davor: `\\"`.',
                    en: 'The compiler takes the next `"` as the end of the text. To print a `"` as part of the text, put a `\\` in front of it: `\\"`.',
                },
            },
            {
                id: 'U-01', dim: 'U', src: 'SRC.developmental',
                title: {
                    fa: '`%d` بیشتر از مقدارها',
                    de: 'Mehr `%d` als Werte',
                    en: 'More `%d` than values',
                },
                wrong: 'C.L03.K11', right: 'C.L03.K12',
                why: {
                    fa: 'هر `%d` یک مقدار لازم دارد، به همان ترتیب. اگر مقدار کم باشد، `printf` چیزی را از حافظه برمی‌دارد که مال تو نیست: رفتار تعریف‌نشده. ممکن است هر بار عدد دیگری ببینی، یا 0 در این صفحه. gcc برایش warning می‌دهد.',
                    de: 'Jedes `%d` braucht einen Wert, in derselben Reihenfolge. Fehlt ein Wert, nimmt `printf` irgendetwas aus dem Speicher, das dir nicht gehört: undefiniertes Verhalten. Du siehst vielleicht jedes Mal eine andere Zahl, oder auf dieser Seite 0. gcc warnt davor.',
                    en: 'Every `%d` needs one value, in the same order. If a value is missing, `printf` takes whatever is in memory, which is not yours: undefined behavior. You may see a different number every time, or 0 on this page. gcc warns about it.',
                },
            },
            {
                id: 'M-04', dim: 'M', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی `=` دو متغیر را برای همیشه به هم وصل می‌کند',
                    de: 'Glauben, dass `=` zwei Variablen für immer verbindet',
                    en: 'Thinking `=` links two variables for good',
                },
                wrong: 'C.L04.K03', right: 'C.L04.K04',
                why: {
                    fa: 'در ریاضی `total = price × count` یک رابطهٔ همیشگی است. در C، `=` فقط یک‌بار حساب می‌کند و حاصل را می‌گذارد؛ اگر بعداً `price` عوض شود، `total` تا وقتی دوباره حسابش نکنی همان می‌ماند.',
                    de: 'In der Mathematik ist `total = price × count` eine dauerhafte Beziehung. In C rechnet `=` einmal und legt das Ergebnis ab; ändert sich später `price`, bleibt `total`, wie es ist, bis du es neu berechnest.',
                    en: 'In math, `total = price × count` is a lasting relation. In C, `=` works it out once and stores the result; if `price` changes later, `total` stays the same until you work it out again.',
                },
            },
            {
                id: 'U-02', dim: 'U', src: 'SRC.developmental',
                title: {
                    fa: 'خواندن متغیری که هنوز مقدار نگرفته',
                    de: 'Eine Variable lesen, die noch keinen Wert hat',
                    en: 'Reading a variable that has no value yet',
                },
                wrong: 'C.L04.K05', right: 'C.L04.K06',
                why: {
                    fa: 'اعلان فقط جعبه را می‌سازد؛ درونش هر چه از پیش در حافظه بود، مانده. خواندنش رفتار تعریف‌نشده است و gcc با `-Wall` برایش warning می‌دهد. هر متغیر را در اعلانش مقدار بده.',
                    de: 'Eine Deklaration baut nur den Kasten; darin liegt, was vorher im Speicher war. Ihn zu lesen ist undefiniertes Verhalten, und gcc warnt mit `-Wall` davor. Gib jeder Variablen in ihrer Deklaration einen Wert.',
                    en: 'A declaration only builds the box; whatever was in that memory before is still in it. Reading it is undefined behavior, and gcc warns about it with `-Wall`. Give every variable a value in its declaration.',
                },
            },
            {
                id: 'E-08', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: 'نام متغیر غلط نوشته شده یا اعلان نشده',
                    de: 'Variablenname falsch geschrieben oder nicht deklariert',
                    en: 'Variable name misspelled or not declared',
                },
                wrong: 'C.L04.K07', right: 'C.L04.K08',
                why: {
                    fa: 'compiler هر نام را با اعلان‌های پیش از آن مقایسه می‌کند؛ `totl` با `total` یکی نیست. پیام `undeclared` همراه `did you mean` اغلب نام درست را می‌گوید.',
                    de: 'Der Compiler vergleicht jeden Namen mit den Deklarationen davor; `totl` ist nicht `total`. Die Meldung `undeclared` mit `did you mean` nennt oft den richtigen Namen.',
                    en: 'The compiler compares every name with the declarations before it; `totl` is not `total`. The message `undeclared` with `did you mean` often names the right one.',
                },
            },
            {
                id: 'E-09', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: 'اعلان دوباره به‌جای انتساب',
                    de: 'Erneute Deklaration statt Zuweisung',
                    en: 'Declaring again instead of assigning',
                },
                wrong: 'C.L04.K09', right: 'C.L04.K10',
                why: {
                    fa: '`int score = 20;` یک جعبهٔ تازه به همان نام می‌خواهد، و دو جعبه با یک نام در یک جا ممکن نیست. برای مقدار تازه فقط `score = 20;` بنویس.',
                    de: '`int score = 20;` verlangt einen neuen Kasten mit demselben Namen, und zwei Kästen mit einem Namen an einer Stelle gibt es nicht. Für einen neuen Wert schreib nur `score = 20;`.',
                    en: '`int score = 20;` asks for a new box with the same name, and there cannot be two boxes with one name in one place. For a new value, write only `score = 20;`.',
                },
            },
            {
                id: 'W-02', dim: 'W', src: 'SRC.developmental',
                title: {
                    fa: 'سرریز `int` در حساب با عددهای بزرگ',
                    de: 'Überlauf von `int` beim Rechnen mit großen Zahlen',
                    en: '`int` overflow when calculating with large numbers',
                },
                wrong: 'C.L05.K03', right: 'C.L05.K04',
                why: {
                    fa: '`int` تا حدود 2.1 میلیارد جا دارد. حسابی که بزرگ‌تر شود سرریز می‌کند، حتی اگر حاصل در یک `long long` نوشته شود، چون سمت راست اول با `int` حساب می‌شود. `long long`، پسوند `LL` روی اولین عدد و `%lld`.',
                    de: '`int` reicht bis etwa 2,1 Milliarden. Eine Rechnung, die größer wird, läuft über, auch wenn das Ergebnis in ein `long long` geschrieben wird, weil die rechte Seite zuerst in `int` gerechnet wird. `long long`, das Suffix `LL` an der ersten Zahl und `%lld`.',
                    en: 'An `int` holds up to about 2.1 billion. A calculation that grows larger overflows, even if the result is stored in a `long long`, because the right-hand side is worked out in `int` first. Use `long long`, the suffix `LL` on the first number, and `%lld`.',
                },
            },
            {
                id: 'E-10', dim: 'E', src: 'SRC.language', contrast: 'CT.form',
                title: {
                    fa: 'ویرگول به‌جای نقطهٔ اعشار',
                    de: 'Komma statt Dezimalpunkt',
                    en: 'Comma instead of a decimal point',
                },
                wrong: 'C.L05.K05', right: 'C.L05.K06',
                why: {
                    fa: 'در آلمانی و فارسی ممیز اعشار ویرگول است (2,5). در C، مثل انگلیسی، نقطه است: `2.5`. ویرگول در C چیزها را جدا می‌کند، پس پیام خطا دربارهٔ چیز دیگری است.',
                    de: 'Im Deutschen und Persischen ist das Dezimaltrennzeichen ein Komma (2,5). In C ist es wie im Englischen ein Punkt: `2.5`. Ein Komma trennt in C Dinge voneinander, deshalb spricht die Fehlermeldung von etwas anderem.',
                    en: 'In German and Persian the decimal separator is a comma (2,5). In C, as in English, it is a point: `2.5`. A comma in C separates things, so the error message talks about something else.',
                },
            },
            {
                id: 'U-03', dim: 'U', src: 'SRC.developmental',
                title: {
                    fa: 'format specifier با نوع مقدار نمی‌خواند (`%d` برای `double`)',
                    de: 'Format-Specifier passt nicht zum Typ (`%d` für `double`)',
                    en: 'Format specifier does not match the type (`%d` for a `double`)',
                },
                wrong: 'C.L05.K07', right: 'C.L05.K08',
                why: {
                    fa: '`printf` نوع argument را نمی‌بیند و به format اعتماد می‌کند. `%d` برای یک `double` بیت‌های اشتباهی را می‌خواند؛ رفتار تعریف‌نشده است و gcc warning `-Wformat` می‌دهد. `%f` برای `double`، `%d` برای `int`.',
                    de: '`printf` sieht den Typ des Arguments nicht und verlässt sich auf das Format. `%d` für ein `double` liest die falschen Bits; das ist undefiniertes Verhalten, und gcc warnt mit `-Wformat`. `%f` für `double`, `%d` für `int`.',
                    en: '`printf` cannot see the argument\'s type and trusts the format. `%d` for a `double` reads the wrong bits; it is undefined behavior, and gcc warns with `-Wformat`. `%f` for `double`, `%d` for `int`.',
                },
            },
            {
                id: 'M-05', dim: 'M', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی `7 / 2` برابر 3.5 است',
                    de: 'Glauben, dass `7 / 2` 3,5 ergibt',
                    en: 'Thinking `7 / 2` is 3.5',
                },
                wrong: 'C.L06.K04', right: 'C.L06.K05',
                why: {
                    fa: 'در ریاضی و ماشین حساب تقسیم همیشه کسر می‌دهد. در C، تقسیم دو `int` عدد صحیح است و کسر دور ریخته می‌شود، حتی اگر حاصل در یک `double` نوشته شود. یک طرف را `double` کن: `2.0` یا `(double) x`.',
                    de: 'In der Mathematik und auf dem Taschenrechner ergibt eine Division immer einen Bruch. In C ist die Division zweier `int` ganzzahlig, und der Bruchteil fällt weg, auch wenn das Ergebnis in ein `double` geschrieben wird. Mach eine Seite zum `double`: `2.0` oder `(double) x`.',
                    en: 'In math and on a calculator, division always gives a fraction. In C, dividing two `int` gives a whole number and the fraction is thrown away, even if the result is stored in a `double`. Make one side a `double`: `2.0` or `(double) x`.',
                },
            },
            {
                id: 'M-06', dim: 'M', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی `^` توان است',
                    de: 'Glauben, dass `^` eine Potenz ist',
                    en: 'Thinking `^` is a power',
                },
                wrong: 'C.L06.K06', right: 'C.L06.K07',
                why: {
                    fa: 'در ماشین حساب، Excel و نوشتن ریاضی با کیبورد، `5^2` یعنی 25. در C، `^` عملگری روی بیت‌هاست (XOR) و `5 ^ 2` برابر 7 است، بی‌هیچ پیامی. توان کوچک را با ضرب بنویس؛ `pow` را در درس 21 می‌بینی.',
                    de: 'Auf dem Taschenrechner, in Excel und beim Tippen von Mathematik heißt `5^2` 25. In C ist `^` ein Bit-Operator (XOR), und `5 ^ 2` ist 7, ohne jede Meldung. Schreib kleine Potenzen als Multiplikation; `pow` kommt in Lektion 21.',
                    en: 'On a calculator, in Excel and when typing math, `5^2` means 25. In C, `^` is a bit operator (XOR), and `5 ^ 2` is 7, without any message. Write small powers as multiplication; `pow` comes in lesson 21.',
                },
            },
            {
                id: 'L-01', dim: 'L', src: 'SRC.math', contrast: 'CT.form',
                title: {
                    fa: 'پرانتز جاافتاده در میانگین: `a + b / 2`',
                    de: 'Fehlende Klammern beim Durchschnitt: `a + b / 2`',
                    en: 'Missing parentheses in an average: `a + b / 2`',
                },
                wrong: 'C.L06.K08', right: 'C.L06.K09',
                why: {
                    fa: 'روی کاغذ خط کسر کل صورت را با هم تقسیم می‌کند. در یک خط کد، `/` فقط عدد کنارش را تقسیم می‌کند و پیش از `+` حساب می‌شود. جمع را در پرانتز بگذار: `(a + b) / 2`.',
                    de: 'Auf Papier teilt der Bruchstrich den ganzen Zähler. In einer Codezeile teilt `/` nur die Zahl daneben und kommt vor `+`. Setz die Summe in Klammern: `(a + b) / 2`.',
                    en: 'On paper, the fraction bar divides the whole top. In a line of code, `/` divides only the number next to it and comes before `+`. Put the sum in parentheses: `(a + b) / 2`.',
                },
            },
            {
                id: 'R-01', dim: 'R', src: 'SRC.developmental',
                title: {
                    fa: 'تقسیم عدد صحیح بر صفر',
                    de: 'Ganzzahldivision durch null',
                    en: 'Integer division by zero',
                },
                wrong: 'C.L06.K10', right: 'C.L06.K11',
                why: {
                    fa: 'تقسیم یک `int` بر صفر رفتار تعریف‌نشده است و برنامه معمولاً هنگام اجرا می‌ایستد. compiler اغلب چیزی نمی‌بیند، چون مقدار متغیر را فقط هنگام اجرا معلوم است. پیش از تقسیم مطمئن شو مقسوم‌علیه صفر نیست.',
                    de: 'Ein `int` durch null zu teilen ist undefiniertes Verhalten, und das Programm bricht meist beim Ausführen ab. Der Compiler merkt oft nichts, weil der Wert der Variablen erst beim Ausführen feststeht. Prüf vor der Division, dass der Teiler nicht null ist.',
                    en: 'Dividing an `int` by zero is undefined behavior, and the program usually stops while running. The compiler often notices nothing, because the variable\'s value is known only at run time. Make sure the divisor is not zero before dividing.',
                },
            },
            {
                id: 'E-11', dim: 'E', src: 'SRC.developmental',
                title: {
                    fa: '`%` با عدد اعشاری',
                    de: '`%` mit einer Kommazahl',
                    en: '`%` with a decimal number',
                },
                wrong: 'C.L06.K12', right: 'C.L06.K13',
                why: {
                    fa: 'باقی‌مانده با `%` فقط برای عدد صحیح تعریف شده است؛ با `double` پیام `invalid operands to binary %` می‌آید.',
                    de: 'Der Rest mit `%` ist nur für ganze Zahlen definiert; mit `double` kommt die Meldung `invalid operands to binary %`.',
                    en: 'The remainder with `%` is defined only for whole numbers; with `double` you get the message `invalid operands to binary %`.',
                },
            },
            {
                id: 'M-07', dim: 'M', src: 'SRC.language', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی نویسهٔ `\'7\'` همان عدد 7 است',
                    de: 'Glauben, dass das Zeichen `\'7\'` die Zahl 7 ist',
                    en: 'Thinking the character `\'7\'` is the number 7',
                },
                wrong: 'C.L07.K03', right: 'C.L07.K04',
                why: {
                    fa: 'روی کاغذ «7» هم رقم است هم عدد. در C، `\'7\'` یک نویسه با کد 55 است و `\'7\' + 1` برابر 56. رقم را با `c - \'0\'` به عدد تبدیل کن.',
                    de: 'Auf Papier ist „7“ Ziffer und Zahl zugleich. In C ist `\'7\'` ein Zeichen mit dem Code 55, und `\'7\' + 1` ist 56. Wandle eine Ziffer mit `c - \'0\'` in eine Zahl um.',
                    en: 'On paper, "7" is both a digit and a number. In C, `\'7\'` is a character with code 55, and `\'7\' + 1` is 56. Turn a digit into a number with `c - \'0\'`.',
                },
            },
            {
                id: 'E-12', dim: 'E', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'دوکوتیشن برای یک نویسه: `"A"` به‌جای `\'A\'`',
                    de: 'Doppelte Anführungszeichen für ein Zeichen: `"A"` statt `\'A\'`',
                    en: 'Double quotes for a character: `"A"` instead of `\'A\'`',
                },
                wrong: 'C.L07.K05', right: 'C.L07.K06',
                why: {
                    fa: 'در Python، `\'A\'` و `"A"` یکی‌اند. در C، `\'A\'` یک نویسه است و `"A"` یک متن؛ متن در جعبهٔ `char` جا نمی‌شود و gcc از نسخهٔ 14 آن را خطا می‌داند.',
                    de: 'In Python sind `\'A\'` und `"A"` dasselbe. In C ist `\'A\'` ein Zeichen und `"A"` ein Text; ein Text passt nicht in einen `char`-Kasten, und gcc behandelt das seit Version 14 als Fehler.',
                    en: 'In Python, `\'A\'` and `"A"` are the same. In C, `\'A\'` is a character and `"A"` is a text; a text does not fit in a `char` box, and gcc treats it as an error since version 14.',
                },
            },
            {
                id: 'W-03', dim: 'W', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'چند نویسه بین تک‌کوتیشن: `\'yes\'`',
                    de: 'Mehrere Zeichen in einfachen Anführungszeichen: `\'yes\'`',
                    en: 'Several characters in single quotes: `\'yes\'`',
                },
                wrong: 'C.L07.K07', right: 'C.L07.K08',
                why: {
                    fa: 'در Python متن را با تک‌کوتیشن هم می‌نویسند. در C بین دو `\'` دقیقاً یک نویسه می‌آید؛ `\'yes\'` چیز عجیبی می‌سازد و gcc با `multi-character character constant` هشدار می‌دهد.',
                    de: 'In Python schreibt man Text auch in einfachen Anführungszeichen. In C steht zwischen zwei `\'` genau ein Zeichen; `\'yes\'` ergibt etwas Seltsames, und gcc warnt mit `multi-character character constant`.',
                    en: 'In Python, text is also written in single quotes. In C exactly one character goes between two `\'`; `\'yes\'` makes something odd, and gcc warns with `multi-character character constant`.',
                },
            },
            {
                id: 'U-04', dim: 'U', src: 'SRC.developmental',
                title: {
                    fa: 'یک `%` تنها در format string',
                    de: 'Ein einzelnes `%` im Format-String',
                    en: 'A lone `%` in the format string',
                },
                wrong: 'C.L08.K03', right: 'C.L08.K04',
                why: {
                    fa: '`printf` هر `%` را آغاز یک format specifier می‌داند و argumentی برایش می‌خواند که وجود ندارد؛ رفتار تعریف‌نشده است. برای خود علامت درصد بنویس `%%`.',
                    de: '`printf` hält jedes `%` für den Anfang eines Format-Specifiers und liest dafür ein Argument, das es nicht gibt; das ist undefiniertes Verhalten. Für das Prozentzeichen selbst schreib `%%`.',
                    en: '`printf` takes every `%` as the start of a format specifier and reads an argument for it that does not exist; that is undefined behavior. For the percent sign itself, write `%%`.',
                },
            },
            {
                id: 'M-08', dim: 'M', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی عرض میدان عدد بلندتر را می‌بُرد',
                    de: 'Glauben, dass die Feldbreite eine längere Zahl abschneidet',
                    en: 'Thinking the field width cuts a longer number',
                },
                wrong: 'C.L08.K05', right: 'C.L08.K06',
                why: {
                    fa: 'در جدول‌ها و فرم‌ها، خانهٔ کوچک متن بلند را می‌بُرد. در `printf`، عرض فقط حداقل است: عدد بلندتر کامل چاپ می‌شود و ستون کج می‌شود. عرض را به اندازهٔ بلندترین عدد بگیر.',
                    de: 'In Tabellen und Formularen schneidet ein kleines Feld langen Text ab. In `printf` ist die Breite nur ein Minimum: Eine längere Zahl wird ganz ausgegeben, und die Spalte verrutscht. Wähle die Breite nach der längsten Zahl.',
                    en: 'In spreadsheets and forms, a small cell cuts long text. In `printf`, the width is only a minimum: a longer number is printed in full and the column shifts. Choose the width for the longest number.',
                },
            },
            {
                id: 'U-05', dim: 'U', src: 'SRC.developmental',
                title: {
                    fa: '`&` پیش از متغیر در `scanf` جا افتاده',
                    de: 'Das `&` vor der Variablen in `scanf` fehlt',
                    en: 'Missing `&` before the variable in `scanf`',
                },
                wrong: 'C.L09.K05', right: 'C.L09.K06',
                why: {
                    fa: '`scanf` باید عدد خوانده‌شده را در جعبهٔ متغیر بنویسد، پس آدرس جعبه را لازم دارد: `&age`. بدون `&`، مقدار فعلی `age` به‌جای آدرس فرستاده می‌شود و `scanf` در جای نامعلومی از حافظه می‌نویسد؛ رفتار تعریف‌نشده است و برنامه معمولاً crash می‌کند. gcc با `-Wall` warning می‌دهد.',
                    de: '`scanf` muss die gelesene Zahl in den Kasten der Variablen schreiben, braucht also die Adresse des Kastens: `&age`. Ohne `&` wird der aktuelle Wert von `age` statt der Adresse übergeben, und `scanf` schreibt an eine unbekannte Stelle im Speicher; das ist undefiniertes Verhalten, und das Programm stürzt meist ab. gcc warnt mit `-Wall`.',
                    en: '`scanf` has to write the number it reads into the variable\'s box, so it needs the address of the box: `&age`. Without `&`, the current value of `age` is passed instead of the address, and `scanf` writes to an unknown place in memory; that is undefined behavior, and the program usually crashes. gcc warns with `-Wall`.',
                },
            },
            {
                id: 'U-06', dim: 'U', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: '`%f` برای یک `double` در `scanf`',
                    de: '`%f` für ein `double` in `scanf`',
                    en: '`%f` for a `double` in `scanf`',
                },
                wrong: 'C.L09.K07', right: 'C.L09.K08',
                why: {
                    fa: 'در `printf`، هم `float` و هم `double` با `%f` چاپ می‌شوند. ولی `scanf` باید بداند در جعبه چند بایت بنویسد: `%f` چهار بایتِ یک `float` را می‌نویسد و `%lf` هشت بایتِ یک `double` را. با `%f` در یک `double`، عددی بی‌معنا در جعبه می‌ماند؛ رفتار تعریف‌نشده است و gcc warning می‌دهد. برای `double` در `scanf` همیشه `%lf`.',
                    de: 'In `printf` werden `float` und `double` beide mit `%f` ausgegeben. `scanf` muss aber wissen, wie viele Bytes es in den Kasten schreibt: `%f` schreibt die vier Bytes eines `float`, `%lf` die acht Bytes eines `double`. Mit `%f` in ein `double` bleibt eine sinnlose Zahl im Kasten; das ist undefiniertes Verhalten, und gcc warnt. Für `double` in `scanf` immer `%lf`.',
                    en: 'In `printf`, `float` and `double` are both printed with `%f`. But `scanf` has to know how many bytes to write into the box: `%f` writes the four bytes of a `float`, `%lf` the eight bytes of a `double`. With `%f` into a `double`, a meaningless number is left in the box; that is undefined behavior, and gcc warns. For `double` in `scanf`, always `%lf`.',
                },
            },
            {
                id: 'M-09', dim: 'M', src: 'SRC.prior', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی `scanf` مثل `input()` در Python متنش را چاپ می‌کند',
                    de: 'Glauben, dass `scanf` seinen Text ausgibt wie `input()` in Python',
                    en: 'Thinking `scanf` prints its text like `input()` in Python',
                },
                wrong: 'C.L09.K09', right: 'C.L09.K10',
                why: {
                    fa: 'در Python، `input("Age: ")` متن را چاپ می‌کند و بعد می‌خواند. `scanf` چیزی چاپ نمی‌کند: هر نویسهٔ format string برایش الگویی است که ورودی باید عیناً همان باشد. `Age:` در ورودی نیست، پس `scanf` همان اول می‌ایستد و متغیر مقدار قبلی‌اش را نگه می‌دارد. پرسش را با `printf` چاپ کن و در `scanf` فقط `%d` بنویس.',
                    de: 'In Python gibt `input("Age: ")` den Text aus und liest dann. `scanf` gibt nichts aus: Jedes Zeichen im Format-String ist für es ein Muster, das genau so in der Eingabe stehen muss. `Age:` steht nicht in der Eingabe, also hört `scanf` sofort auf, und die Variable behält ihren alten Wert. Gib die Frage mit `printf` aus und schreib in `scanf` nur `%d`.',
                    en: 'In Python, `input("Age: ")` prints the text and then reads. `scanf` prints nothing: every character of its format string is a pattern the input must match exactly. `Age:` is not in the input, so `scanf` stops at once and the variable keeps its old value. Print the question with `printf` and write only `%d` in `scanf`.',
                },
            },
            {
                id: 'M-10', dim: 'M', src: 'SRC.developmental',
                title: {
                    fa: 'فکر کنی `scanf("%d")` کلید Enter را هم برمی‌دارد',
                    de: 'Glauben, dass `scanf("%d")` die Enter-Taste mitnimmt',
                    en: 'Thinking `scanf("%d")` also takes the Enter key',
                },
                wrong: 'C.L10.K04', right: 'C.L10.K05',
                why: {
                    fa: 'Enter هم یک نویسه است: `\\n`. `%d` رقم‌ها را برمی‌دارد و همان‌جا می‌ایستد؛ `\\n` در buffer می‌ماند. `%c` فاصله‌ها را رد نمی‌کند، پس همان `\\n` را می‌خواند. با یک فاصله پیش از آن، `" %c"`، هر فاصله و Enter پیش از حرف رد می‌شود.',
                    de: 'Auch Enter ist ein Zeichen: `\\n`. `%d` nimmt die Ziffern und hört dort auf; das `\\n` bleibt im Puffer. `%c` überspringt keine Leerzeichen und liest deshalb genau dieses `\\n`. Mit einem Leerzeichen davor, `" %c"`, werden alle Leerzeichen und Enter vor dem Buchstaben übersprungen.',
                    en: 'Enter is a character too: `\\n`. `%d` takes the digits and stops there; the `\\n` stays in the buffer. `%c` does not skip spaces, so it reads exactly that `\\n`. With a space in front, `" %c"`, every space and Enter before the letter is skipped.',
                },
            },
            {
                id: 'S-01', dim: 'S', src: 'SRC.developmental',
                title: {
                    fa: 'به ورودی اعتماد کنی و به مقدار بازگشتی `scanf` نگاه نکنی',
                    de: 'Der Eingabe trauen, ohne auf den Rückgabewert von `scanf` zu schauen',
                    en: 'Trusting the input without looking at what `scanf` returns',
                },
                wrong: 'C.L10.K06', right: 'C.L10.K07',
                why: {
                    fa: 'ورودی از بیرون می‌آید و هر چیزی می‌تواند باشد: یک واژه به‌جای عدد، یا هیچ. اگر `scanf` نتواند بخواند، متغیر را دست نمی‌زند و برنامه با مقدار قبلی ادامه می‌دهد، بی‌آنکه کسی بفهمد. `scanf` تعداد مقدارهای خوانده‌شده را برمی‌گرداند؛ آن را نگه دار و نشان بده. از درس 12 با `if` ورودی بد را رد می‌کنی. بیشتر حمله‌ها به نرم‌افزار از همین ورودیِ بررسی‌نشده شروع می‌شوند.',
                    de: 'Eingaben kommen von außen und können alles sein: ein Wort statt einer Zahl, oder gar nichts. Kann `scanf` nicht lesen, lässt es die Variable unverändert, und das Programm rechnet mit dem alten Wert weiter, ohne dass es jemand merkt. `scanf` gibt zurück, wie viele Werte es gelesen hat; behalte diesen Wert und zeig ihn an. Ab Lektion 12 weist du schlechte Eingaben mit `if` zurück. Die meisten Angriffe auf Software beginnen mit genau solchen ungeprüften Eingaben.',
                    en: 'Input comes from outside and can be anything: a word instead of a number, or nothing at all. If `scanf` cannot read, it leaves the variable alone, and the program goes on with the old value without anyone noticing. `scanf` returns how many values it read; keep that number and show it. From lesson 12 on you reject bad input with `if`. Most attacks on software start with exactly this kind of unchecked input.',
                },
            },
            {
                id: 'E-13', dim: 'E', src: 'SRC.math', contrast: 'CT.form',
                title: {
                    fa: '`=<` یا `=>` به‌جای `<=` و `>=`',
                    de: '`=<` oder `=>` statt `<=` und `>=`',
                    en: '`=<` or `=>` instead of `<=` and `>=`',
                },
                wrong: 'C.L11.K04', right: 'C.L11.K05',
                why: {
                    fa: 'روی کاغذ `≤` یک نشانه است و ترتیب ندارد. در C دو نویسه است و ترتیبش ثابت است: اول `<` یا `>`، بعد `=`، همان‌طور که می‌خوانی: «کوچک‌تر یا مساوی». `=<` برای compiler یک انتساب و بعد یک `<` بی‌جاست.',
                    de: 'Auf Papier ist `≤` ein einziges Zeichen ohne Reihenfolge. In C sind es zwei Zeichen in fester Reihenfolge: zuerst `<` oder `>`, dann `=`, so wie man es liest: „kleiner oder gleich“. `=<` ist für den Compiler eine Zuweisung und dann ein `<` an falscher Stelle.',
                    en: 'On paper, `≤` is a single sign with no order. In C it is two characters in a fixed order: first `<` or `>`, then `=`, the way you read it: "less or equal". To the compiler, `=<` is an assignment followed by a `<` in the wrong place.',
                },
            },
            {
                id: 'M-11', dim: 'M', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'فکر کنی `0.1 + 0.2 == 0.3` درست است',
                    de: 'Glauben, dass `0.1 + 0.2 == 0.3` wahr ist',
                    en: 'Thinking `0.1 + 0.2 == 0.3` is true',
                },
                wrong: 'C.L11.K06', right: 'C.L11.K07',
                why: {
                    fa: 'در ریاضی این تساوی درست است. ولی `double` عدد را در دودویی نگه می‌دارد و 0.1 و 0.2 در دودویی دقیق جا نمی‌گیرند؛ جمعشان کمی با 0.3 فرق دارد و `==` فرق را می‌بیند. پول را به سنت در `int` نگه دار؛ برای اندازه‌ها با کمی رواداری مقایسه کن ([[lesson:C.L13]]).',
                    de: 'In der Mathematik stimmt diese Gleichung. Aber `double` speichert Zahlen binär, und 0,1 und 0,2 passen binär nicht genau hinein; ihre Summe weicht ein wenig von 0,3 ab, und `==` sieht den Unterschied. Halte Geld in Cent in einem `int`; Messwerte vergleichst du mit etwas Spielraum ([[lesson:C.L13]]).',
                    en: 'In maths this equation holds. But `double` stores numbers in binary, and 0.1 and 0.2 do not fit exactly in binary; their sum differs a little from 0.3, and `==` sees the difference. Keep money in cents in an `int`; compare measurements with a little tolerance ([[lesson:C.L13]]).',
                },
            },
            {
                id: 'W-04', dim: 'W', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: '`=` به‌جای `==` در شرط: `if (floor = 13)`',
                    de: '`=` statt `==` in einer Bedingung: `if (floor = 13)`',
                    en: '`=` instead of `==` in a condition: `if (floor = 13)`',
                },
                wrong: 'C.L12.K04', right: 'C.L12.K05',
                why: {
                    fa: 'در ریاضی `=` یعنی «برابر است». در C یک `=` تنها انتساب است: مقدار را در جعبه می‌نویسد، و مقدار کل expression همان مقدار نوشته‌شده است. پس `if (floor = 13)` طبقه را به 13 عوض می‌کند و همیشه درست است. gcc با `suggest parentheses around assignment used as truth value` هشدار می‌دهد. برای پرسیدن: `==`.',
                    de: 'In der Mathematik heißt `=` „ist gleich“. In C ist ein einzelnes `=` eine Zuweisung: Es schreibt den Wert in den Kasten, und der Wert des ganzen Ausdrucks ist der geschriebene Wert. `if (floor = 13)` setzt den Stock also auf 13 und ist immer wahr. gcc warnt mit `suggest parentheses around assignment used as truth value`. Zum Fragen: `==`.',
                    en: 'In maths, `=` means "is equal to". In C a single `=` is an assignment: it writes the value into the box, and the value of the whole expression is the value written. So `if (floor = 13)` changes the floor to 13 and is always true. gcc warns with `suggest parentheses around assignment used as truth value`. To ask: `==`.',
                },
            },
            {
                id: 'W-05', dim: 'W', src: 'SRC.developmental',
                title: {
                    fa: '`;` پس از `if (…)`',
                    de: '`;` nach `if (…)`',
                    en: '`;` after `if (…)`',
                },
                wrong: 'C.L12.K06', right: 'C.L12.K07',
                why: {
                    fa: 'پس از هر statement یک `;` می‌آید، پس دست به‌طور خودکار پس از شرط هم آن را می‌نویسد. ولی `;` تنها خودش یک statement خالی است و بدنهٔ `if` می‌شود: `if` «هیچ» را اجرا می‌کند یا نمی‌کند، و بلوک بعدی همیشه اجرا می‌شود. gcc با `-Wextra` می‌گوید `suggest braces around empty body`.',
                    de: 'Nach jedem Statement kommt ein `;`, also schreibt die Hand es automatisch auch nach der Bedingung. Aber ein einzelnes `;` ist selbst ein leeres Statement und wird zum Rumpf des `if`: `if` führt „nichts“ aus oder nicht, und der Block danach läuft immer. gcc sagt mit `-Wextra` `suggest braces around empty body`.',
                    en: 'Every statement ends with a `;`, so the hand writes one after the condition too, out of habit. But a lone `;` is itself an empty statement and becomes the body of the `if`: the `if` runs "nothing" or not, and the block after it always runs. With `-Wextra`, gcc says `suggest braces around empty body`.',
                },
            },
            {
                id: 'W-06', dim: 'W', src: 'SRC.prior', contrast: 'CT.form',
                title: {
                    fa: 'تورفتگی به‌جای آکولاد، مثل Python',
                    de: 'Einrückung statt geschweifter Klammern, wie in Python',
                    en: 'Indentation instead of braces, as in Python',
                },
                wrong: 'C.L12.K08', right: 'C.L12.K09',
                why: {
                    fa: 'در Python تورفتگی می‌گوید کدام خط‌ها مال `if` هستند. در C همین کار را `{ }` می‌کند و تورفتگی فقط برای خواندن انسان است. بی آکولاد، `if` فقط statement بعدی را در اختیار دارد و سطر دوم همیشه اجرا می‌شود. gcc با `this \'if\' clause does not guard...` هشدار می‌دهد. برای همین این دوره همیشه آکولاد می‌گذارد، حتی برای یک خط.',
                    de: 'In Python sagt die Einrückung, welche Zeilen zum `if` gehören. In C tun das `{ }`, und die Einrückung ist nur für menschliche Leser. Ohne geschweifte Klammern gehört zum `if` nur das nächste Statement, und die zweite Zeile läuft immer. gcc warnt mit `this \'if\' clause does not guard...`. Deshalb setzt dieser Kurs immer geschweifte Klammern, auch bei einer Zeile.',
                    en: 'In Python, indentation says which lines belong to the `if`. In C, `{ }` do that, and indentation is only for human readers. Without braces, the `if` owns only the next statement, and the second line always runs. gcc warns with `this \'if\' clause does not guard...`. That is why this course always uses braces, even for one line.',
                },
            },
            {
                id: 'L-02', dim: 'L', src: 'SRC.developmental',
                title: {
                    fa: 'شرط گسترده پیش از شرط تنگ در زنجیرهٔ `else if`',
                    de: 'Die weite Bedingung vor der engen in einer `else if`-Kette',
                    en: 'The broad condition before the narrow one in an `else if` chain',
                },
                wrong: 'C.L12.K10', right: 'C.L12.K11',
                why: {
                    fa: 'زنجیرهٔ `else if` پس از اولین شرط درست می‌ایستد. هر نمره‌ای که `>= 17` است، `>= 10` هم هست؛ اگر `>= 10` اول بیاید، `Excellent` هرگز چاپ نمی‌شود، و هیچ پیامی هم این را نمی‌گوید. شرط تنگ‌تر را اول بنویس، و مرزها را با ورودی امتحان کن.',
                    de: 'Eine `else if`-Kette hört nach der ersten wahren Bedingung auf. Jede Note `>= 17` ist auch `>= 10`; steht `>= 10` zuerst, wird `Excellent` nie ausgegeben, und keine Meldung sagt es dir. Schreib die engere Bedingung zuerst und probier die Grenzen mit Eingaben aus.',
                    en: 'An `else if` chain stops after the first true condition. Every mark `>= 17` is also `>= 10`; if `>= 10` comes first, `Excellent` is never printed, and no message tells you so. Write the narrower condition first, and try the boundaries with input.',
                },
            },
            {
                id: 'W-07', dim: 'W', src: 'SRC.math', contrast: 'CT.false',
                title: {
                    fa: 'بازه مثل ریاضی: `18 <= t <= 25`',
                    de: 'Ein Bereich wie in Mathe: `18 <= t <= 25`',
                    en: 'A range as in maths: `18 <= t <= 25`',
                },
                wrong: 'C.L13.K04', right: 'C.L13.K05',
                why: {
                    fa: 'روی کاغذ `18 ≤ t ≤ 25` یک پرسش است. در C دو مقایسه است که پشت سر هم حساب می‌شوند: `18 <= t` اول 1 یا 0 می‌دهد، و بعد آن 1 یا 0 با 25 مقایسه می‌شود، که همیشه درست است. gcc می‌گوید `comparisons like \'X<=Y<=Z\' do not have their mathematical meaning`. بنویس `t >= 18 && t <= 25`.',
                    de: 'Auf Papier ist `18 ≤ t ≤ 25` eine Frage. In C sind es zwei Vergleiche, die nacheinander ausgewertet werden: `18 <= t` liefert zuerst 1 oder 0, und diese 1 oder 0 wird dann mit 25 verglichen, was immer wahr ist. gcc sagt `comparisons like \'X<=Y<=Z\' do not have their mathematical meaning`. Schreib `t >= 18 && t <= 25`.',
                    en: 'On paper, `18 ≤ t ≤ 25` is one question. In C it is two comparisons worked out one after the other: `18 <= t` first gives 1 or 0, and that 1 or 0 is then compared with 25, which is always true. gcc says `comparisons like \'X<=Y<=Z\' do not have their mathematical meaning`. Write `t >= 18 && t <= 25`.',
                },
            },
            {
                id: 'L-03', dim: 'L', src: 'SRC.language', contrast: 'CT.false',
                title: {
                    fa: '«اگر روز 6 یا 7 است»: `day == 6 || 7`',
                    de: '„Wenn der Tag 6 oder 7 ist“: `day == 6 || 7`',
                    en: '"If the day is 6 or 7": `day == 6 || 7`',
                },
                wrong: 'C.L13.K06', right: 'C.L13.K07',
                why: {
                    fa: 'در زبان روزمره «روز 6 یا 7 است» را کوتاه می‌گوییم. C آن را `(day == 6) || 7` می‌خواند، و 7 به‌تنهایی غیرصفر و همیشه درست است. حتی warning هم نمی‌آید. هر طرف `||` باید یک مقایسهٔ کامل باشد: `day == 6 || day == 7`.',
                    de: 'In der Alltagssprache sagt man kurz „der Tag ist 6 oder 7“. C liest das als `(day == 6) || 7`, und 7 allein ist nicht null und damit immer wahr. Es kommt nicht einmal eine Warnung. Jede Seite von `||` muss ein vollständiger Vergleich sein: `day == 6 || day == 7`.',
                    en: 'In everyday language we say "the day is 6 or 7" for short. C reads it as `(day == 6) || 7`, and 7 on its own is not zero and so always true. Not even a warning comes. Each side of `||` must be a complete comparison: `day == 6 || day == 7`.',
                },
            },
            {
                id: 'L-04', dim: 'L', src: 'SRC.developmental',
                title: {
                    fa: '`&&` به‌جای `||` برای «بیرون از بازه»',
                    de: '`&&` statt `||` für „außerhalb des Bereichs“',
                    en: '`&&` instead of `||` for "outside the range"',
                },
                wrong: 'C.L13.K08', right: 'C.L13.K09',
                why: {
                    fa: 'هیچ عددی همزمان کمتر از 1 و بیشتر از 5 نیست، پس `stars < 1 && stars > 5` همیشه نادرست است و هر عددی پذیرفته می‌شود. «درون بازه» با `&&` نوشته می‌شود و «بیرون از بازه» با `||`. با دو عدد مرزی و یک عدد بیرونی امتحان کن.',
                    de: 'Keine Zahl ist zugleich kleiner als 1 und größer als 5, `stars < 1 && stars > 5` ist also immer falsch, und jede Zahl wird angenommen. „Im Bereich“ schreibt man mit `&&`, „außerhalb des Bereichs“ mit `||`. Probier es mit beiden Grenzen und einer Zahl außerhalb aus.',
                    en: 'No number is less than 1 and greater than 5 at the same time, so `stars < 1 && stars > 5` is always false and every number is accepted. "Inside the range" is written with `&&` and "outside the range" with `||`. Try both boundaries and one number outside.',
                },
            },
            {
                id: 'E-14', dim: 'E', src: 'SRC.prior', contrast: 'CT.form',
                title: {
                    fa: '`and`، `or` و `not` از Python',
                    de: '`and`, `or` und `not` aus Python',
                    en: '`and`, `or` and `not` from Python',
                },
                wrong: 'C.L13.K12', right: 'C.L13.K13',
                why: {
                    fa: 'در Python شرط‌ها با واژه به هم بسته می‌شوند. در C همان سه کار با نشانه انجام می‌شود: `&&` برای and، `||` برای or و `!` برای not. compiler `and` را نامی ناشناخته می‌بیند و پیش از آن انتظار `)` دارد.',
                    de: 'In Python verbindet man Bedingungen mit Wörtern. In C tun dieselben drei Dinge Zeichen: `&&` für and, `||` für or und `!` für not. Der Compiler sieht `and` als unbekannten Namen und erwartet davor eine `)`.',
                    en: 'In Python, conditions are joined with words. In C the same three jobs are done by symbols: `&&` for and, `||` for or and `!` for not. The compiler sees `and` as an unknown name and expects a `)` before it.',
                },
            },
            {
                id: 'S-02', dim: 'S', src: 'SRC.developmental',
                title: {
                    fa: 'بررسی کنی که عدد رسید، ولی نه اینکه در بازه است',
                    de: 'Prüfen, dass eine Zahl ankam, aber nicht, ob sie im Bereich liegt',
                    en: 'Checking that a number arrived, but not that it is in range',
                },
                wrong: 'C.L13.K10', right: 'C.L13.K11',
                why: {
                    fa: '`scanf` فقط می‌گوید عددی رسید، نه اینکه آن عدد معنا دارد. `-3` بلیت یک قیمت منفی می‌سازد؛ در برنامه‌های واقعی همین عددهای بی‌معنا پول را برمی‌گردانند یا حافظه را خراب می‌کنند. پس از هر خواندن، بازهٔ مجاز را هم بپرس.',
                    de: '`scanf` sagt nur, dass eine Zahl ankam, nicht, dass sie Sinn ergibt. `-3` Karten ergeben einen negativen Preis; in echten Programmen zahlen genau solche unsinnigen Zahlen Geld zurück oder beschädigen den Speicher. Frag nach jedem Lesen auch den erlaubten Bereich ab.',
                    en: '`scanf` only says that a number arrived, not that it makes sense. `-3` tickets make a negative price; in real programs, exactly such senseless numbers pay money back or damage memory. After every read, ask about the allowed range too.',
                },
            },
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

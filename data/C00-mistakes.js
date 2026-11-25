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
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

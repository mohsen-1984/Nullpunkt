/* C00M — the common mistakes of the C series (S00-schema: mistake). The symptom of each mistake is never written by
   hand: it is read from the generated result of its `wrong` code (S.PIT.03). */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.files.C00M = {
        id: 'C00M', kind: 'mistakes', series: 'C', version: '0.1.0',
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
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

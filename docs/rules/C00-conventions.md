**نول‌پونکت — Nullpunkt** · پیش‌نویس 0.1 — Draft 0.1 (2026-11-25)

*C از صفر — C von Null an — C from Zero*

*سند کاری برای نویسنده و ویراستار، نه برای فراگیر*

---

# قواعد سری C — C Series Conventions

این سند آنچه را که فقط به سری C مربوط است نگه می‌دارد: مسیر یادگیری، اسکلت درس، نردبان سازه‌ها، تکه‌های مجاز و قواعد سکو. قاعدهٔ مشترک همهٔ سری‌ها در `S00-core` است؛ این سند فقط با استثنای ثبت‌شده از آن جدا می‌شود.

---

## دامنه — Scope

**مبنا:** ISO C17 (`O-04`)، کامپایلر مرجع `gcc -std=c17 -Wall -Wextra -pedantic`، کامپایلر مرورگر XCC.

**در نسخهٔ 1.0 هست:** هر چیزی که درس «مقدمهٔ برنامه‌نویسی» با C در ترم اول و دوم دانشگاه معمولاً می‌خواهد: نوع‌های پایه، جریان کنترل، تابع، آرایه و رشته، pointer، struct، حافظهٔ پویا، فایل، برنامهٔ چندفایلی، preprocessor، کار با بیت، اشکال‌زدایی و تست، و function pointer؛ و در فصل 14، stream و دستگاه، terminal، تصویر، `volatile`، `union` و bit-field.

**در نسخهٔ 1.0 نیست — Not Yet Said:** تابع با آرگومان متغیر (`stdarg.h`)، `setjmp`، thread، شبکه، ویژگی‌های C23 (فقط یادداشت). این فهرست در صفحهٔ «دربارهٔ مجموعه» به فراگیر هم گفته می‌شود (`S.CH.03`). `C.SCP.01`

---

## مسیر یادگیری — Learning Path

14 فصل، 54 درس، یک فصل جهت‌یابی (`C.ORI.01`)، و یک واحد مرور در پایان هر فصل. عنوان‌ها پیش‌نویس‌اند؛ عنوان آلمانی پیش از انتشار بازبینی بومی می‌شود (`S.LNG.05`).

### فصل 1: شروع — Getting Started — Erste Schritte

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L01` | برنامه چیست و compiler چه می‌کند — What a Program Is | Was ein Programm ist |
| `C.L02` | خواندن پیام خطا — Reading Error Messages | Fehlermeldungen lesen |
| `C.L03` | خروجی با printf — Output with printf | Ausgabe mit printf |

### فصل 2: مقدار و متغیر — Values & Variables — Werte und Variablen

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L04` | متغیر، شناسه و اعلان — Variables, Identifiers, Declarations | Variablen, Identifier und Deklarationen |
| `C.L05` | عدد صحیح و اعشاری — Whole and Decimal Numbers | Ganze Zahlen und Kommazahlen |
| `C.L06` | عبارت و عملگر حسابی — Expressions & Arithmetic | Ausdrücke und Arithmetik |
| `C.L07` | نویسه و کد ASCII — Characters & ASCII | Zeichen und ASCII |
| `C.L08` | قالب‌بندی خروجی — Formatted Output | Formatierte Ausgabe |

### فصل 3: ورودی — Input — Eingabe

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L09` | خواندن ورودی با scanf — Reading Input with scanf | Eingabe mit scanf |
| `C.L10` | وقتی ورودی خراب است — When Input Goes Wrong | Wenn die Eingabe schiefgeht |

### فصل 4: تصمیم — Decisions — Entscheidungen

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L11` | مقایسه و مقدار درست و نادرست — Comparisons & Truth | Vergleiche und Wahrheitswerte |
| `C.L12` | if و else — if and else | if und else |
| `C.L13` | ترکیب شرط‌ها — Combining Conditions | Bedingungen verknüpfen |
| `C.L14` | switch — switch | switch |

### فصل 5: تکرار — Loops — Schleifen

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L15` | حلقهٔ while — The while Loop | Die while-Loop |
| `C.L16` | حلقهٔ for — The for Loop | Die for-Loop |
| `C.L17` | do-while، break و continue — do-while, break, continue | do-while, break und continue |
| `C.L18` | حلقهٔ تودرتو — Nested Loops | Verschachtelte Loops |
| `C.L19` | ردیابی و خطای یکی‌کم‌یکی‌زیاد — Tracing & Off-by-One | Tracing und Off-by-One |

### فصل 6: تابع — Functions — Funktionen

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L20` | تعریف و فراخوانی تابع — Defining & Calling Functions | Funktionen definieren und aufrufen |
| `C.L21` | پارامتر و مقدار بازگشتی — Parameters & Return Values | Parameter und Rückgabewerte |
| `C.L22` | scope، طول عمر و static — Scope, Lifetime & static | Scope, Lebensdauer und static |
| `C.L23` | stack فراخوانی و recursion — The Call Stack & Recursion | Call Stack und Rekursion |

### فصل 7: آرایه و رشته — Arrays & Strings — Arrays und Strings

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L24` | آرایه — Arrays | Arrays |
| `C.L25` | آرایه و تابع — Arrays & Functions | Arrays und Funktionen |
| `C.L26` | آرایهٔ دوبعدی — Two-Dimensional Arrays | Zweidimensionale Arrays |
| `C.L27` | رشته: آرایه‌ای از char — Strings: Arrays of char | Strings: Arrays aus char |
| `C.L28` | کتابخانهٔ رشته — The String Library | Die String-Bibliothek |

### فصل 8: pointer — Pointers — Pointer

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L29` | آدرس و pointer — Addresses & Pointers | Adressen und Pointer |
| `C.L30` | pointer و تابع — Pointers & Functions | Pointer und Funktionen |
| `C.L31` | pointer و آرایه — Pointers & Arrays | Pointer und Arrays |
| `C.L32` | const و pointer رشته — const & String Pointers | const und String-Pointer |

### فصل 9: دادهٔ ساختاریافته — Structured Data — Strukturierte Daten

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L33` | struct — struct | struct |
| `C.L34` | typedef و enum — typedef and enum | typedef und enum |
| `C.L35` | آرایه‌ای از struct — Arrays of Structs | Arrays von Structs |

### فصل 10: حافظهٔ پویا — Dynamic Memory — Dynamischer Speicher

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L36` | malloc و free — malloc and free | malloc und free |
| `C.L37` | آرایهٔ رشدپذیر — Growing Arrays | Wachsende Arrays |
| `C.L38` | linked list — Linked Lists | Linked Lists |
| `C.L39` | اشکال‌های حافظه — Memory Bugs | Speicherfehler |

### فصل 11: فایل — Files — Dateien

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L40` | خواندن و نوشتن فایل — Reading & Writing Files | Dateien lesen und schreiben |
| `C.L41` | خواندن خط به خط و ورودی امن — Line by Line & Safe Input | Zeilenweise lesen und sichere Eingabe |

### فصل 12: برنامهٔ واقعی — Real Programs — Echte Programme

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L42` | چند فایل و header — Multiple Files & Headers | Mehrere Dateien und Header |
| `C.L43` | preprocessor و ماکرو — The Preprocessor & Macros | Präprozessor und Makros |
| `C.L44` | compile، link و make — Compiling, Linking & make | Kompilieren, Linken und make |
| `C.L45` | آرگومان خط فرمان — Command-Line Arguments | Kommandozeilenargumente |

### فصل 13: کیفیت و فراتر — Quality & Beyond — Qualität und mehr

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L46` | اشکال‌زدایی — Debugging | Debugging |
| `C.L47` | رفتار تعریف‌نشده — Undefined Behavior | Undefiniertes Verhalten |
| `C.L48` | بیت و بایت — Bits & Bytes | Bits und Bytes |
| `C.L49` | تست برنامهٔ خودت — Testing Your Code | Den eigenen Code testen |
| `C.L50` | function pointer و qsort — Function Pointers & qsort | Function Pointer und qsort |

### فصل 14: فراتر از کنسول — Beyond the Console — Jenseits der Konsole

| Id | فارسی — English | Deutsch |
|---|---|---|
| `C.L51` | stream و دستگاه: stdin، stdout، stderr — Streams & Devices | Streams und Geräte |
| `C.L52` | terminal: رنگ، مکان‌نما، کلید — The Terminal: Colors, Cursor, Keys | Das Terminal: Farben, Cursor, Tasten |
| `C.L53` | گرافیک در C: از graphics.h تا کتابخانه‌های امروزی — Graphics in C | Grafik in C |
| `C.L54` | گفت‌وگو با سخت‌افزار: volatile، union و bit-field — Talking to Hardware | Mit Hardware sprechen |

**متن و گرافیک — Text and Graphics** `C.DEV.01` — استاندارد C هیچ «حالت متنی» یا «حالت گرافیکی» ندارد. C فقط stream می‌شناسد (`stdin`، `stdout`، `stderr` و فایل)، و سیستم‌عامل هر دستگاهی را پشت یک stream می‌گذارد. «text mode» و «graphics mode» اصطلاح‌های دوران DOS‌اند (Turbo C و `graphics.h`/BGI، `conio.h`)؛ این‌ها بخشی از C نیستند، روی compilerهای امروزی کار نمی‌کنند، و دوره آن‌ها را فقط به‌عنوان تاریخچه و باور رایج (`M-`) معرفی می‌کند. معادل امروزی: terminal با escape sequenceهای ANSI (`C.L52`)، فایل تصویری که با C استاندارد نوشته می‌شود (مثلاً PPM، `C.L53`) و کتابخانه‌هایی مانند raylib و SDL برای پنجره و پیکسل (بیرون از استاندارد، فقط معرفی). دسترسی مستقیم به سخت‌افزار در embedded با registerهای نگاشته‌به‌حافظه و `volatile` است (`C.L54`). در مرورگر، خروجی escape sequence و تصویر در round اجرایی آن درس‌ها به runner افزوده می‌شود.

**ترتیب در مسیر — Order Along the Path** `C.PTH.01` — هر درس فقط به درس‌های پیش از خودش ارجاع پیش‌نیاز (`prereq`) می‌دهد؛ ارجاع به درس بعدی فقط در بلوک `notyet` و یادداشت `simplification` مجاز است.

### جای مباحث — Topic Homes `C.TOP.01`

مبحث‌هایی که جای طبیعی‌شان در عنوان درس پیدا نیست، اینجا ثبت‌اند (بازبینی کاتالوگ، نوامبر 2026). هر مبحث یک خانهٔ اصلی دارد و در مارپیچ (`S.CH.12`) برمی‌گردد.

| مبحث | خانهٔ اصلی | پیش و پس از آن | چرا |
|---|---|---|---|
| `math.h` (`sqrt`، `pow`، `-lm`) | `C.L21` | `C.L06`: فقط یادداشت `notyet` که `^` توان نیست (`M-`، `SRC.math`) | فراخوانی تابعی که مقدار برمی‌گرداند همان موضوع `C.L21` است؛ `-lm` به linker درس `C.L02` وصل می‌شود |
| `rand`، `srand`، `time` | `C.L17` (بازی حدس عدد با `do-while`) | تکهٔ `CH.rand-seed`؛ seed و `% n` در `C.L22`؛ سوگیری `% n` در `C.L47` | پروژهٔ پیشنهادی درس 0.5 (بازی حدس عدد) زود ممکن می‌شود |
| `static` و طول عمر (storage duration) | `C.L22` (محلی و ایستا) | `C.L36` (allocated)، `C.L42` (`static` سراسری و linkage) | سه گذر مارپیچ: lifetime، heap، فایل |
| `union` و bit-field | `C.L54` (نگاشت register) | اشارهٔ کوتاه در `C.L48`؛ ترتیب بیت‌ها implementation-defined است (`P-`) | کاربرد واقعی‌شان در embedded است؛ بدون آن، مثال‌ها ساختگی می‌شوند |
| `stderr` و exit status | `C.L40` (اولین استفاده با `fprintf(stderr, …)` و `return 1`) | `C.L51`: redirection، pipe، کد خروج در shell | پیام خطای برنامه از همان اولین فایل لازم است |
| اشتباه‌های امنیتی `S-` | از فصل 3: `C.L10` (`S-01`: اعتماد به ورودی بی‌نگاه به مقدار بازگشتی `scanf`؛ رد ورودی بد با `if` در `C.L12`)، `C.L13` (`S-02`: بررسی رسیدن عدد بی بررسی بازه؛ `default` در `C.L14`) | `C.L27` (`scanf("%s")` بی‌طول، وقتی رشته آمده)، `C.L28` (`strcpy`، format string)، `C.L37` (سرریز در محاسبهٔ اندازه)، `C.L39` (use-after-free، double free)، `C.L41` (ورودی امن)، `C.L45` (`argv`) | ورودی از فصل 3 وارد می‌شود و سطح حمله از همان‌جا شروع می‌شود |

**فصل 14 در پایان — Chapter 14 Last:** فصل 14 در پایان می‌ماند، چون به فایل (`C.L40`)، کار با بیت (`C.L48`) و pointer نیاز دارد؛ فقط `stderr` و exit status زودتر می‌آیند (جدول بالا).

**واحد مرور — Review Units:** هر فصل 1 تا 14 یک واحد مرور (`Cnn.REV`) دارد؛ فصل 0 ندارد، چون تمرین‌های خودش کار «بیا جلو یا برگرد» را می‌کنند (`C.ORI.01`).

---

## اسکلت درس — Lesson Skeleton

ترتیب از PRIMM پیروی می‌کند (`S00-pedagogy` بخش 4.1): پیش‌بینی پیش از اجرا، بررسی، سپس تغییر و ساختن. `C.LES.01`

| ترتیب | بلوک | وضعیت | کِی |
|---|---|---|---|
| 1 | `why` | ثابت | — |
| 2 | `cando` | ثابت | — |
| 3 | `prior` | ثابت | از درس 2 به بعد |
| 4 | `predict` | ثابت | — |
| 5 | `example` | ثابت | — |
| 6 | `machine` | ثابت | — |
| 7 | `rule` | ثابت | — |
| 8 | `trace` | اختیاری | وقتی حالت در طول زمان تغییر می‌کند (حلقه، recursion) |
| 9 | `memory` | اختیاری | از درس 9 به بعد هر جا آدرس مطرح است؛ از فصل 8 ثابت |
| 10 | `mistakes` | ثابت | — |
| 11 | `errors` | ثابت | — |
| 12 | `fuller` | اختیاری | گذر 2 یا 3 یک مبحث مارپیچ |
| 13 | `standard` | اختیاری | رفتار وابسته به پیاده‌سازی یا سکو |
| 14 | `notyet` | اختیاری | هر ساده‌سازی اعلام‌شدهٔ این درس |
| 15 | `practice` | ثابت | — |
| 16 | `make` | ثابت | — |
| 17 | `exam` | اختیاری | دست‌کم دو درس در هر فصل |
| 18 | `ai` | ثابت | — |
| 19 | `terms` | ثابت · ساختنی | — |
| 20 | `selfcheck` | ثابت · ساختنی | — |
| 21 | `key` | ثابت · ساختنی | — |

### اسکلت واحد مرور — Review Unit Skeleton

| ترتیب | بلوک | وضعیت |
|---|---|---|
| 1 | `why` | ثابت — این فصل چه ساخت و فصل بعد روی کدام پایه می‌سازد |
| 2 | `practice` | ثابت — تمرین درهم از همهٔ درس‌های فصل، و دست‌کم یک قلم از هر فصل پیشین (`S.CH.12`) |
| 3 | `onpc` | ثابت (`C.ONP.01`) |
| 4 | `exam` | ثابت — دست‌کم دو پرسش |
| 5 | `ai` | ثابت — `AI-5` |
| 6 | `selfcheck` | ثابت · ساختنی |
| 7 | `key` | ثابت · ساختنی |

---

## فصل جهت‌یابی — Orientation

**فصل 0 — Chapter 0** `C.ORI.01` — پیش از درس 1، پنج درس کوتاه بی‌سازهٔ تازه: C امروز کجاست، از برنامه تا پردازنده، استانداردها و ابزارها، C روی کامپیوتر خودت، چطور C را یاد بگیریم. درس‌ها شمارهٔ 0.1 تا 0.5 می‌گیرند (Id: `C.O01`…`C.O05`) و شمارهٔ درس‌های بعدی را جابه‌جا نمی‌کنند. اسکلتشان سبک‌تر است: `why`، `cando`، چند بلوک `section` (عنوان، برچسب کوتاه و آیکون از خود داده)، سپس `practice` (دست‌کم یک تمرین؛ `B.choice` با بازخورد برای هر گزینه)، `ai` اختیاری، و بلوک‌های تولیدی. نردبان سازه‌ها بر این درس‌ها اعمال نمی‌شود، چون کدشان نمایش است، نه آموزش سازه. عددها و رتبه‌هایی که با زمان عوض می‌شوند، تاریخ خود را در متن دارند. فراگیری که پیش‌زمینه دارد، با تمرین‌های فصل خودش را می‌سنجد و می‌تواند از درس 1 شروع کند.

**گره‌های تازه — New Nodes** — `section` (بلوک با عنوان از داده)، `myth` (باور رایج و پاسخ مستند)، `terminal` (دستورها و خروجی ترمینال، نمایشی)، `tabs` (یک محتوا برای هر سیستم‌عامل)، `asm` (کد و assembly واقعی x86-64 از `gcc -S -O1`، ⚙).

## قواعد بلوک‌ها — Block Rules

**ماشین ذهنی — Machine** `C.MCH.01` — بلوک `machine` دست‌کم یکی از سه نمایش لایه‌های ماشین ذهنی را دارد: جعبه‌ها، آدرس‌ها، یا قاب‌ها و heap (`S00-pedagogy` بخش 2). از لایه‌ای که هنوز معرفی نشده استفاده نمی‌کند.

**پیش‌بینی — Predict** `C.PRD.01` — کد بلوک `predict` حداکثر 12 خط است، مفهوم تازهٔ درس را دارد، و `mode: "predict"` است: دکمهٔ اجرا پیش از ثبت پیش‌بینی غیرفعال است.

**مثال کامل — Example** `C.EXM.01` — کد بلوک `example` کامل و قابل اجرا است، کامنت زیرهدف دارد (`S.STY.08`) و نثر بلوک هر زیرهدف را به همان نام توضیح می‌دهد.

**درمانگاه خطا — Error Clinic** `C.ERR.01` — دست‌کم یک کد با `intent: "compile-error"` یا `"warning"`. پیام gcc و پیام XCC هر دو نشان داده می‌شوند، هر دو ⚙، و توضیح به ترتیب ثابت: کجا، چه، چرا، چه کنم (`S.VOI.06`).

**اشتباه‌ها — Mistakes** `C.MIS.01` — بلوک `mistakes` دست‌کم سه اشتباه دارد، از دست‌کم دو بُعد، و برای هر بُعد مرتبط با موضوع درس دست‌کم یکی (`S.PIT.05`). از فصل 8، بُعدهای `U-` و `S-` اجباری‌اند.

**روی PC خودت — On Your PC** `C.ONP.01` — بلوک `onpc` در هر واحد مرور: دستور دقیق کامپایل و اجرا در ترمینال (`gcc -std=c17 -Wall -Wextra -pedantic -o main main.c` و `./main`)، یک تفاوت مشخص میان مرورگر و PC در همان فصل (مثلاً اندازهٔ `long` یا پیام دقیق خطا)، و از فصل 13 پرچم‌های `-g -fsanitize=address,undefined`.

**امتحان — Exam** `C.EXA.01` — پرسش `exam` بدون اجرای کد حل می‌شود: ردیابی دستی، نوشتن کد روی کاغذ، یا توضیح. دکمهٔ اجرا در این بلوک نیست.

**ساختن — Make** `C.MAK.01` — بلوک `make` یک برنامهٔ کوچک کامل از یک موقعیت واقعی است (`S.VOI.05`)، که فقط سازه‌های تا همین درس را لازم دارد و با تست سنجیده می‌شود.

**خودسنجی — Self-check** `C.SLF.01` — دقیقاً پنج توانایی از `cando` کاتالوگ، هر کدام قابل آزمون با یکی از بندهای همین درس.

---

## نردبان سازه‌ها — Construct Ladder

هر سازه در درسی معرفی می‌شود که در این جدول آمده و پیش از آن در هیچ کدی نمی‌آید (`S.CH.06`). این جدول پیش‌نویس فهرست `K.*` در داده است.

| درس | سازه‌های تازه |
|---|---|
| `C.L01` | `printf` با رشتهٔ ساده، `\n`، کامنت `//` |
| `C.L03` | `%d` با عدد ثابت، `+`، `-`، `*`، `\t`، `\\`، `\"` |
| `C.L04` | `int`، اعلان، انتساب `=` |
| `C.L05` | `double`، `%f` در `printf`، ثابت اعشاری |
| `C.L06` | `/`، `%`، اولویت عملگر، پرانتز، تبدیل نوع `(double)`، `+=` و خانواده، `++`، `--` |
| `C.L07` | `char`، `%c`، ثابت نویسه، `'\0'` به‌عنوان مقدار |
| `C.L08` | عرض و دقت در قالب (`%5d`، `%.2f`)، `%%` |
| `C.L09` | `scanf`، `%d` و `%lf` در `scanf`، `&` به‌عنوان «آدرس» |
| `C.L10` | مقدار بازگشتی `scanf`، `EOF`، `getchar` |
| `C.L11` | `==`، `!=`، `<`، `<=`، `>`، `>=`، `stdbool.h`، `bool`، `true`، `false` |
| `C.L12` | `if`، `else`، `else if`، بلوک `{ }` |
| `C.L13` | `&&`، `\|\|`، `!`، عملگر شرطی `?:` |
| `C.L14` | `switch`، `case`، `default`، `break` در `switch` |
| `C.L15` | `while` |
| `C.L16` | `for`، اعلان شمارنده در `for` |
| `C.L17` | `do`، `break` و `continue` در حلقه؛ `rand`، `srand`، `time` (تکهٔ `CH.rand-seed`) |
| `C.L20` | تعریف تابع، `void`، `return`، prototype — قاب `main` توضیح داده می‌شود |
| `C.L21` | `math.h`: `sqrt`، `pow`؛ `-lm` |
| `C.L22` | متغیر سراسری، `static` محلی، طول عمر (storage duration) خودکار و ایستا |
| `C.L24` | آرایه، `[]`، مقداردهی اولیهٔ آرایه، `sizeof`، `size_t`، `%zu` |
| `C.L26` | آرایهٔ دوبعدی |
| `C.L27` | ثابت رشته در آرایهٔ `char`، `%s` |
| `C.L28` | `string.h`: `strlen`، `strcpy`، `strncpy`، `strcmp`، `strcat`؛ `ctype.h` |
| `C.L29` | pointer، `*` در اعلان و dereference، `NULL`، `%p` |
| `C.L31` | حساب pointer (pointer arithmetic) |
| `C.L32` | `const` |
| `C.L33` | `struct`، `.`، `->` |
| `C.L34` | `typedef`، `enum` |
| `C.L36` | `stdlib.h`: `malloc`، `free`، `exit` |
| `C.L37` | `calloc`، `realloc` |
| `C.L40` | `FILE`، `fopen`، `fclose`، `fprintf`، `fscanf`، `perror`؛ `fprintf(stderr, …)` و `return 1` (`C.TOP.01`) |
| `C.L41` | `fgets`، `sscanf`، `strtol` |
| `C.L42` | `#include "…"`، header guard، `extern` — قاب `#include <stdio.h>` توضیح داده می‌شود |
| `C.L43` | `#define`، ماکرو با پارامتر، `#if`، `#ifdef` |
| `C.L45` | `main(int argc, char *argv[])` |
| `C.L46` | `assert.h` |
| `C.L48` | `&`، `\|`، `^`، `~`، `<<`، `>>` بیتی؛ `unsigned`؛ `stdint.h` |
| `C.L50` | function pointer، `qsort` |
| `C.L51` | `fprintf(stderr, …)`، `exit`، `EXIT_SUCCESS`/`EXIT_FAILURE`، `fflush` |
| `C.L52` | escape با `\x1b`؛ رشته‌های ANSI |
| `C.L54` | `volatile`، `uintptr_t`، `union`، bit-field |

**سازهٔ ممنوع — Forbidden Constructs** `C.FRB.01` — هرگز، در هیچ درسی، حتی به‌عنوان اشتباه: `gets`. فقط در درس اشتباه‌های امنیتی و با برچسب `S-`: `scanf("%s", …)` بدون طول، `strcpy` به مقصد کوچک‌تر.

---

## تکه‌های مجاز — Allowed Chunks

تنها تکه‌هایی که پیش از درس توضیحشان مجازند. هر تکهٔ تازه باید اینجا ثبت شود. `C.CHK.01`

| Id | تکه | از | توضیح در |
|---|---|---|---|
| `CH.main-frame` | `#include <stdio.h>`، `int main(void) { … }`، `return 0;` | `C.L01` | `C.L20` (تابع) و `C.L42` (header) |
| `CH.rand-seed` | `#include <stdlib.h>`، `#include <time.h>`، `srand((unsigned) time(NULL));` | `C.L17` | `C.L36` (`stdlib.h`) و `C.L42` (header) |

متن درس هر جا تکه‌ای را برای اولین بار به کار می‌برد، یادداشت `simplification` دارد: «فعلاً قبول کن؛ در درس N توضیح می‌دهیم.»

---

## سکو و کامپایلر — Platform & Compiler

**دو سکو — Two Platforms** `C.PLT.01` — مرورگر wasm32 است (`int` چهار، `long` چهار، pointer چهار بایت)؛ PC امروزی 64 بیتی (`long` و pointer هشت بایت). هر کدی که خروجی‌اش به این اندازه‌ها بستگی دارد `intent: "platform"` می‌گیرد و هر دو خروجی را نشان می‌دهد. درس‌ها تا فصل 13 از `long` فقط وقتی استفاده می‌کنند که اندازه‌اش موضوع درس باشد؛ برای عدد بزرگ `long long`.

**کمبودهای XCC — XCC Gaps** `C.XCC.01` — فهرست زنده؛ checker کدی را که به این‌ها تکیه کند خطا می‌گیرد، مگر `intent: "platform"` داشته باشد. هر مورد با رفع upstream حذف می‌شود.

| مورد | اثر | راه درس |
|---|---|---|
| `_Static_assert` | خطای کامپایل در مرورگر | فقط در درس `standard`، به‌صورت `static`، با `platform` |
| `%td` در `printf` | چاپ نمی‌شود | تفاضل pointer با تبدیل به `long long` و `%lld` |
| `INT_MIN`، `LONG_MIN`، `UINT_MAX`، `ULONG_MAX` در `limits.h` | مقدار غلط در `printf` | تا رفع upstream از این ثابت‌ها در `printf` استفاده نمی‌شود |
| خواندن از `NULL` | بدون خطا | فقط نوشتن در `NULL` شناخته می‌شود؛ درس `C.L47` این را صریح می‌گوید |
| بازیابی پس از خطا — error recovery | پس از بعضی خطاهای نحوی (ویرگول یا `"` جاافتاده) `;' expected` و `expression expected` تا سقف خطاها تکرار می‌شوند | `CRunner` پیام‌ها را تا اولین تکرارِ عین‌به‌عین نگه می‌دارد و تعداد پیام‌های بریده را می‌گوید |
| `scanf` بی `%c`، بی `%[…]` و بی `%*`، و بی `EOF` در پایان ورودی | خواندن نادرست در مرورگر | رفع‌شده با patch `vendor/wcc/patches/0001`، که upstream هم پیشنهاد شده (`docs/upstream/`)؛ با پذیرش upstream، patch برداشته می‌شود |
| نام ناشناخته و نبودِ `#include` | XCC خطا می‌دهد (`undeclared`)؛ gcc 15 (مرجع، `C.CMP.01`) هم خطا می‌دهد، ولی gcc 13 و پیش از آن فقط warning و سپس خطای linker | dimension `E` (`E-07`، جانشین `W-01` بازنشسته)؛ رفتار gcc قدیمی در بلوک `standard` |

**پرچم‌های کامپایل — Compiler Flags** `C.FLG.01` — در هر متنی که دستور کامپایل می‌آید: `-std=c17 -Wall -Wextra -pedantic`. از درس `C.L46`: به‌علاوهٔ `-g -fsanitize=address,undefined`. هیچ پرچم دیگری بدون توضیح.

**کامپایلر مرجع — Reference Compiler** `C.CMP.01` — پیام‌ها و خروجی‌هایی که درس نشان می‌دهد از **gcc 15** ضبط می‌شوند، پیش‌فرض Ubuntu 26.04 LTS و در نتیجه WSL و Linux بیشتر فراگیرها؛ CI روی `ubuntu-26.04` اجرا می‌شود و `data/generated/` را با همان gcc می‌سازد. نسخهٔ دیگر فقط در یادداشت می‌آید: gcc 16 (Fedora، MSYS2) و clang (همان `gcc` روی macOS). هر جا رفتار نسخه‌ها فرق دارد — مثلاً اعلان ضمنی تابع (implicit declaration) که از gcc 14 و در clang خطاست و در gcc 13 فقط هشدار — درس رفتار مرجع را نشان می‌دهد و فرق را در بلوک `standard` می‌گوید. مرجع در هر round پیش از انتشار بازبینی می‌شود.

**چندفایلی در مرورگر — Multi-file in the Browser** `C.MUL.01` — درس‌های فصل 12 به اجرای چند فایل `.c` و `.h` نیاز دارند؛ اجراگر مرورگر پیش از نوشتن این فصل این قابلیت را می‌گیرد (XCC چند فایل را می‌پذیرد).

---

## سیاههٔ بازبینی — Checklist

### وارسی خودکار — Automated

- [ ] ترتیب در مسیر — `C.PTH.01`
- [ ] اسکلت درس — `C.LES.01`
- [ ] پیش‌بینی — `C.PRD.01`
- [ ] مثال کامل — `C.EXM.01` (کامنت زیرهدف)
- [ ] درمانگاه خطا — `C.ERR.01`
- [ ] اشتباه‌ها — `C.MIS.01` (شمارش و بعدها)
- [ ] روی PC خودت — `C.ONP.01`
- [ ] امتحان — `C.EXA.01`
- [ ] خودسنجی — `C.SLF.01`
- [ ] سازهٔ ممنوع — `C.FRB.01`
- [ ] تکه‌های مجاز — `C.CHK.01`
- [ ] دو سکو — `C.PLT.01`
- [ ] کمبودهای XCC — `C.XCC.01`
- [ ] پرچم‌های کامپایل — `C.FLG.01`

### وارسی انسانی — Human Review

- [ ] دامنه — `C.SCP.01`
- [ ] ماشین ذهنی — `C.MCH.01`
- [ ] ساختن — `C.MAK.01` (موقعیت واقعی)
- [ ] اشتباه‌ها — `C.MIS.01` (ربط به موضوع درس)

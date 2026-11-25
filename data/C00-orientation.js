/* C00O — Chapter 0: Orientation (data, S00-schema: chapter; orientation lessons, C00-conventions: C.ORI.01). Five short
   lessons before lesson 1: where C lives, how a program reaches the processor, standards and tools, C on your own
   computer, how to learn. Facts that change over time carry their date in the text (as of November 2026). */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    var R = String.raw;
    function T(fa, de, en) { return { fa: fa, de: de, en: en }; }
    function P(fa, de, en) { return { type: 'p', text: T(fa, de, en) }; }
    function LI() { return { type: 'list', items: Array.prototype.map.call(arguments, function (a) { return T(a[0], a[1], a[2]); }) }; }
    function OL() { var l = LI.apply(null, arguments); l.ordered = true; return l; }
    function MYTH(claim, fact) { return { type: 'myth', claim: T(claim[0], claim[1], claim[2]), fact: T(fact[0], fact[1], fact[2]) }; }
    function OPT(ok, text, fb) { return { correct: ok, text: T(text[0], text[1], text[2]), feedback: T(fb[0], fb[1], fb[2]) }; }
    function SEC(id, icon, title, short, content) { return { block: 'section', id: id, icon: icon, title: T(title[0], title[1], title[2]), short: T(short[0], short[1], short[2]), content: content }; }

    N.files.C00O = {
        id: 'C00O', kind: 'chapter', series: 'C', version: '0.1.0',

        code: [
            { id: 'C.O02.K01', intent: 'ok', asm: true, source: R`#include <stdio.h>

int main(void) {
    printf("Hello\n");
    printf("%d\n", 6 * 7);
    return 0;
}
` },
            { id: 'C.O02.K02', intent: 'compile-error', source: R`#include <stdio.h>

int main(void) {
    printf("one\n");
    printf("two\n");
    printf("three\n")
    return 0;
}
` },
            { id: 'C.O03.K01', intent: 'platform', source: R`#include <stdio.h>

int main(void) {
    printf("%ld\n", __STDC_VERSION__);
    return 0;
}
` },
            { id: 'C.O04.K01', intent: 'ok', source: R`#include <stdio.h>

int main(void) {
    printf("Hello from my own computer\n");
    return 0;
}
` },
        ],

        units: [
            // ---------------------------------------------------------------- 0.1
            {
                type: 'lesson', id: 'C.O01',
                blocks: [
                    { block: 'why', content: [
                        P('شاید شنیده باشی که C زبانی قدیمی است و امروز Python و JavaScript همه‌کاره‌اند. این درس نشان می‌دهد C امروز دقیقاً کجاست: در جاهایی که نمی‌بینی، ولی هر روز به آن تکیه داری. بعد خودت قضاوت کن که ارزش یادگرفتن دارد یا نه.',
                          'Vielleicht hast du gehört, C sei alt und heute erledigten Python und JavaScript alles. Diese Lektion zeigt, wo C heute genau steckt: an Stellen, die du nicht siehst, auf die du dich aber jeden Tag verlässt. Danach urteilst du selbst, ob es sich lohnt.',
                          'You may have heard that C is old and that Python and JavaScript do everything today. This lesson shows exactly where C is today: in places you do not see but rely on every day. Then you decide for yourself whether it is worth learning.'),
                        { type: 'note', kind: 'simplification', text: T(
                            'اگر برنامه‌نویسی و C را از پیش می‌شناسی، تمرین‌های آخر هر درس این فصل را حل کن. اگر همه را درست جواب دادی، از [[lesson:C.L01]] شروع کن.',
                            'Wenn du Programmieren und C schon kennst, löse die Übungen am Ende jeder Lektion dieses Kapitels. Hast du alle richtig, fang mit [[lesson:C.L01]] an.',
                            'If you already know programming and C, do the exercises at the end of each lesson in this chapter. If you get them all right, start with [[lesson:C.L01]].') },
                    ] },
                    { block: 'cando', content: [] },
                    SEC('today', 'globe', ['C در دنیای امروز', 'C in der heutigen Welt', 'C in Today’s World'], ['امروز', 'Heute', 'Today'], [
                        P('بیشتر نرم‌افزارهایی که هر روز به کار می‌بری، روی لایه‌ای از C می‌ایستند:',
                          'Die meiste Software, die du jeden Tag benutzt, steht auf einer Schicht aus C:',
                          'Most software you use every day stands on a layer of C:'),
                        { type: 'table', head: [T('حوزه', 'Bereich', 'Field'), T('نمونه‌ها', 'Beispiele', 'Examples'), T('چرا C', 'Warum C', 'Why C')], rows: [
                            [T('سیستم‌عامل', 'Betriebssysteme', 'Operating systems'), T('kernel لینوکس، Windows و macOS، بیشترش به C', 'die Kernel von Linux, Windows und macOS, großteils in C', 'the kernels of Linux, Windows and macOS, largely in C'), T('دسترسی مستقیم به سخت‌افزار و حافظه', 'direkter Zugriff auf Hardware und Speicher', 'direct access to hardware and memory')],
                            [T('[[term:T.embedded-system]] و رباتیک', '[[term:T.embedded-system]] und Robotik', '[[term:T.embedded-system]] and robotics'), T('firmware میکروکنترلرها، واحدهای کنترل خودرو، micro-ROS', 'Firmware von Mikrocontrollern, Steuergeräte im Auto, micro-ROS', 'microcontroller firmware, car control units, micro-ROS'), T('حافظهٔ کم، زمان دقیق، بدون سیستم‌عامل', 'wenig Speicher, genaues Timing, oft ohne Betriebssystem', 'little memory, exact timing, often no operating system')],
                            [T('هوش مصنوعی', 'Künstliche Intelligenz', 'Artificial intelligence'), T('هستهٔ NumPy به C، هستهٔ PyTorch به C و C++، CUDA C روی GPU، llama.cpp', 'der Kern von NumPy in C, der Kern von PyTorch in C und C++, CUDA C auf der GPU, llama.cpp', 'the core of NumPy in C, the core of PyTorch in C and C++, CUDA C on the GPU, llama.cpp'), T('محاسبهٔ سنگین باید نزدیک سخت‌افزار باشد', 'schwere Rechnungen müssen nah an der Hardware laufen', 'heavy computation must run close to the hardware')],
                            [T('وب', 'Web', 'Web'), T('nginx و Apache، curl، OpenSSL، interpreter زبان PHP، libuv زیر Node.js، و WebAssembly', 'nginx und Apache, curl, OpenSSL, der PHP-Interpreter, libuv unter Node.js, und WebAssembly', 'nginx and Apache, curl, OpenSSL, the PHP interpreter, libuv under Node.js, and WebAssembly'), T('هر درخواست وب از این لایه می‌گذرد', 'jede Webanfrage läuft durch diese Schicht', 'every web request passes through this layer')],
                            [T('پایگاه داده', 'Datenbanken', 'Databases'), T('SQLite، PostgreSQL، Redis', 'SQLite, PostgreSQL, Redis', 'SQLite, PostgreSQL, Redis'), T('سرعت و کنترل حافظه', 'Geschwindigkeit und Kontrolle über den Speicher', 'speed and control over memory')],
                            [T('خود زبان‌ها', 'Die Sprachen selbst', 'Languages themselves'), T('CPython (همان Python معمولی) به C نوشته شده', 'CPython (das übliche Python) ist in C geschrieben', 'CPython (the usual Python) is written in C'), T('هر زبانی سرانجام روی چیزی اجرا می‌شود', 'jede Sprache läuft am Ende auf etwas', 'every language runs on something in the end')],
                        ] },
                        P('همین صفحه هم یک نمونه است: compiler زبان C که کدت را می‌سازد، خودش به C نوشته شده و به WebAssembly ترجمه شده تا در مرورگرت اجرا شود.',
                          'Auch diese Seite ist ein Beispiel: Der C-Compiler, der deinen Code baut, ist selbst in C geschrieben und nach WebAssembly übersetzt, damit er in deinem Browser läuft.',
                          'This page is an example too: the C compiler that builds your code is itself written in C and translated to WebAssembly so it runs in your browser.'),
                        { type: 'note', kind: 'platform', text: T(
                            'در شاخص TIOBE نوامبر 2026، C در رتبهٔ دوم بود، پس از Python. TIOBE محبوبیت را از جست‌وجوها می‌سنجد، نه از مقدار کدی که اجرا می‌شود؛ پس عدد را نشانه بدان، نه اندازه‌گیری دقیق.',
                            'Im TIOBE-Index vom November 2026 lag C auf Platz zwei, nach Python. TIOBE misst Beliebtheit über Suchanfragen, nicht wie viel Code läuft; nimm die Zahl als Hinweis, nicht als genaue Messung.',
                            'In the TIOBE index of November 2026, C was in second place, after Python. TIOBE measures popularity from searches, not how much code runs, so take the number as a sign, not an exact measurement.') },
                    ]),
                    SEC('beliefs', 'lightbulb', ['سه باور رایج', 'Drei verbreitete Annahmen', 'Three Common Beliefs'], ['باورها', 'Annahmen', 'Beliefs'], [
                        MYTH(['«C قدیمی است، پس کنار گذاشته شده.»', '„C ist alt, also ist es überholt.“', '“C is old, so it is outdated.”'],
                             ['سن به معنای کنار گذاشته شدن نیست. C هنوز استاندارد زنده دارد: تازه‌ترین نسخه‌اش، C23، در 2024 منتشر شد. و بیشتر سامانه‌های جدول بالا هنوز هر روز به C نوشته و نگهداری می‌شوند.',
                              'Alter heißt nicht überholt. C hat einen lebendigen Standard: Die neueste Fassung, C23, erschien 2024. Und die meisten Systeme der Tabelle oben werden weiter jeden Tag in C geschrieben und gepflegt.',
                              'Old does not mean outdated. C has a living standard: its newest version, C23, was published in 2024. And most systems in the table above are still written and maintained in C every day.']),
                        MYTH(['«زبان‌های سطح بالا جای C را گرفته‌اند.»', '„Höhere Sprachen haben C ersetzt.“', '“High-level languages have replaced C.”'],
                             ['آن‌ها روی C ساخته شده‌اند. وقتی در Python یک array از NumPy را جمع می‌زنی، کار اصلی را کد C انجام می‌دهد. هر زبان کار خودش را بهتر انجام می‌دهد؛ این‌ها رقیب نیستند، لایه‌اند.',
                              'Sie sind auf C gebaut. Wenn du in Python ein NumPy-Array summierst, erledigt C-Code die eigentliche Arbeit. Jede Sprache kann ihr Gebiet am besten; sie sind keine Rivalen, sondern Schichten.',
                              'They are built on C. When you sum a NumPy array in Python, C code does the real work. Each language is best at its own job; they are not rivals but layers.']),
                        MYTH(['«C فقط به درد دانشگاه می‌خورد.»', '„C braucht man nur im Studium.“', '“C is only useful at university.”'],
                             ['شغل‌های embedded، خودرو، رباتیک، سیستم‌عامل، شبکه و امنیت هر روز C می‌خواهند. دانشگاه C درس می‌دهد چون همین دنیا به آن نیاز دارد.',
                              'Stellen in Embedded, Automobil, Robotik, Betriebssystemen, Netzwerken und Sicherheit verlangen jeden Tag C. Die Universität lehrt C, weil genau diese Welt es braucht.',
                              'Jobs in embedded systems, cars, robotics, operating systems, networking and security ask for C every day. University teaches C because that world needs it.']),
                    ]),
                    SEC('university', 'graduation-cap', ['C در دانشگاه', 'C im Studium', 'C at University'], ['دانشگاه', 'Studium', 'University'], [
                        P('در رشتهٔ علوم کامپیوتر، C فقط یک درس نیست؛ زبانی است که درس‌های بعدی با آن نوشته می‌شوند:',
                          'Im Informatikstudium ist C nicht nur ein Fach, sondern die Sprache, in der spätere Fächer arbeiten:',
                          'In computer science, C is not just one course; it is the language later courses work in:'),
                        LI(['سیستم‌عامل: process، حافظه، فایل، system call', 'Betriebssysteme: Prozesse, Speicher, Dateien, System Calls', 'Operating systems: processes, memory, files, system calls'],
                           ['معماری کامپیوتر: از C تا assembly و پردازنده', 'Rechnerarchitektur: von C zu Assembly und zum Prozessor', 'Computer architecture: from C to assembly and the processor'],
                           ['compiler، شبکه، سیستم‌های embedded، امنیت', 'Compilerbau, Netzwerke, eingebettete Systeme, Sicherheit', 'Compilers, networking, embedded systems, security']),
                        P('C مثل گرامر یک زبان است. می‌شود گرامر را رد کرد و باز هم چیزی گفت، ولی هر جمله را حدسی می‌سازی. کسی که C را از پایه یاد گرفته، می‌داند پشت هر خط Python یا Java چه می‌گذرد.',
                          'C ist wie die Grammatik einer Sprache. Man kann die Grammatik überspringen und trotzdem etwas sagen, aber dann baut man jeden Satz auf Verdacht. Wer C von Grund auf gelernt hat, weiß, was hinter jeder Zeile Python oder Java passiert.',
                          'C is like the grammar of a language. You can skip the grammar and still say things, but you build every sentence by guessing. Someone who learned C from the ground up knows what happens behind each line of Python or Java.'),
                    ]),
                    SEC('engineer', 'briefcase', ['C برای مهندس نرم‌افزار', 'C für Softwareingenieure', 'C for a Software Engineer'], ['مهندسی', 'Beruf', 'Engineering'], [
                        LI(['**هزینهٔ هر کار:** چرا یک حلقه کند است و دیگری سریع.', '**Was etwas kostet:** warum eine Schleife langsam ist und eine andere schnell.', '**What things cost:** why one loop is slow and another is fast.'],
                           ['**حافظه:** آدرس، pointer، stack و heap، و اینکه یک bug حافظه چطور شکل می‌گیرد.', '**Speicher:** Adressen, Pointer, Stack und Heap, und wie ein Speicherfehler entsteht.', '**Memory:** addresses, pointers, the stack and the heap, and how a memory bug happens.'],
                           ['**دقت:** C اشتباه را نمی‌بخشد؛ برای همین عادت می‌کنی دقیق بخوانی و دقیق بنویسی.', '**Genauigkeit:** C verzeiht keine Fehler; deshalb gewöhnst du dich daran, genau zu lesen und zu schreiben.', '**Precision:** C does not forgive mistakes, so you get used to reading and writing precisely.'],
                           ['**نزدیکی به ماشین:** از C تا assembly فاصله کم است. در [[lesson:C.O02]] می‌بینی چرا گاهی assembly را هم باید بخوانی.', '**Nähe zur Maschine:** Von C bis Assembly ist es nicht weit. In [[lesson:C.O02]] siehst du, warum man manchmal auch Assembly lesen muss.', '**Closeness to the machine:** from C to assembly is a short step. In [[lesson:C.O02]] you see why you sometimes need to read assembly too.']),
                    ]),
                    { block: 'practice', content: [{ type: 'band', ref: 'C.O01.X01' }, { type: 'band', ref: 'C.O01.X02' }] },
                    { block: 'ai', content: [
                        P('اگر هنوز پرامپت مادر را نفرستاده‌ای، حالا وقتش است: دستیار را برای کل دوره تنظیم می‌کند.',
                          'Falls du den Grund-Prompt noch nicht geschickt hast, ist jetzt der Moment: Er stellt den Assistenten für den ganzen Kurs ein.',
                          'If you have not sent the master prompt yet, now is the time: it sets up the assistant for the whole course.'),
                        { type: 'prompt', ref: 'AI.MASTER' },
                    ] },
                    { block: 'terms', content: [] }, { block: 'selfcheck', content: [] }, { block: 'key', content: [] },
                ],
                bands: [
                    { id: 'C.O01.X01', type: 'B.choice', title: T('انتخاب کن', 'Wähle aus', 'Choose'), items: [
                        { id: 'C.O01.X01.01', prompt: T('Python معمولی (CPython) به چه زبانی نوشته شده است؟', 'In welcher Sprache ist das übliche Python (CPython) geschrieben?', 'What language is the usual Python (CPython) written in?'),
                          options: [OPT(false, ['Python', 'Python', 'Python'], ['نه؛ چیزی باید Python را اجرا کند، و آن خودش Python نیست.', 'Nein; etwas muss Python ausführen, und das ist nicht selbst Python.', 'No; something has to run Python, and that is not Python itself.']),
                                    OPT(true, ['C', 'C', 'C'], ['درست. interpreter زبان Python یک برنامهٔ C است.', 'Richtig. Der Python-Interpreter ist ein C-Programm.', 'Right. The Python interpreter is a C program.']),
                                    OPT(false, ['Java', 'Java', 'Java'], ['نه؛ Java خودش روی یک ماشین مجازی اجرا می‌شود و ربطی به CPython ندارد.', 'Nein; Java läuft selbst auf einer virtuellen Maschine und hat mit CPython nichts zu tun.', 'No; Java runs on a virtual machine of its own and has nothing to do with CPython.'])],
                          why: T('CPython به C نوشته شده؛ زبان‌های سطح بالا روی C می‌ایستند.', 'CPython ist in C geschrieben; höhere Sprachen stehen auf C.', 'CPython is written in C; high-level languages stand on C.') },
                        { id: 'C.O01.X01.02', prompt: T('کدام حوزه کمتر از همه به C وابسته است؟', 'Welcher Bereich hängt am wenigsten von C ab?', 'Which field depends least on C?'),
                          options: [OPT(false, ['firmware یک میکروکنترلر', 'Firmware eines Mikrocontrollers', 'Firmware of a microcontroller'], ['این یکی از قلمروهای اصلی C است.', 'Das ist eines der Hauptgebiete von C.', 'That is one of C’s main fields.']),
                                    OPT(false, ['kernel سیستم‌عامل', 'Kernel eines Betriebssystems', 'An operating system kernel'], ['kernelهای اصلی بیشترشان به C نوشته شده‌اند.', 'Die großen Kernel sind größtenteils in C geschrieben.', 'The major kernels are mostly written in C.']),
                                    OPT(true, ['ظاهر یک صفحهٔ وب (HTML و CSS)', 'Das Aussehen einer Webseite (HTML und CSS)', 'The look of a web page (HTML and CSS)'], ['درست. ظاهر صفحه را HTML و CSS تعیین می‌کنند؛ هرچند مرورگر و سرور زیرش به C و C++ نوشته شده‌اند.', 'Richtig. Das Aussehen bestimmen HTML und CSS — auch wenn Browser und Server darunter in C und C++ geschrieben sind.', 'Right. HTML and CSS decide the look — even though the browser and the server underneath are written in C and C++.'])],
                          why: T('C در لایه‌های پایین است؛ لایهٔ ظاهر صفحه با زبان‌های دیگر ساخته می‌شود.', 'C steckt in den unteren Schichten; die Oberfläche einer Seite entsteht mit anderen Sprachen.', 'C lives in the lower layers; the surface of a page is made with other languages.') },
                        { id: 'C.O01.X01.03', prompt: T('تازه‌ترین نسخهٔ استاندارد C کدام است؟', 'Welche ist die neueste Fassung des C-Standards?', 'Which is the newest version of the C standard?'),
                          options: [OPT(false, ['C89', 'C89', 'C89'], ['این نخستین استاندارد است، از 1989.', 'Das ist der erste Standard, von 1989.', 'That is the first standard, from 1989.']),
                                    OPT(false, ['C17', 'C17', 'C17'], ['C17 را در این دوره به کار می‌بریم، ولی تازه‌ترین نیست.', 'C17 benutzen wir in diesem Kurs, aber es ist nicht die neueste Fassung.', 'We use C17 in this course, but it is not the newest.']),
                                    OPT(true, ['C23', 'C23', 'C23'], ['درست. C23 در 2024 منتشر شد.', 'Richtig. C23 erschien 2024.', 'Right. C23 was published in 2024.'])],
                          why: T('C23 (ISO/IEC 9899:2024) تازه‌ترین است؛ در [[lesson:C.O03]] می‌گوییم چرا دوره C17 را برگزیده.', 'C23 (ISO/IEC 9899:2024) ist die neueste; in [[lesson:C.O03]] erklären wir, warum der Kurs C17 nimmt.', 'C23 (ISO/IEC 9899:2024) is the newest; [[lesson:C.O03]] explains why the course uses C17.') },
                    ] },
                    { id: 'C.O01.X02', type: 'B.explain', title: T('توضیح بده', 'Erkläre', 'Explain'), items: [
                        { id: 'C.O01.X02.01', prompt: T('دوستت می‌گوید: «Python بلدم، دیگر C به چه دردم می‌خورد؟» در دو یا سه جمله جوابش را بده.', 'Ein Freund sagt: „Ich kann Python, wozu brauche ich noch C?“ Antworte ihm in zwei oder drei Sätzen.', 'A friend says: “I know Python, why would I need C?” Answer in two or three sentences.'),
                          model: T('Python روی C ساخته شده و C نشان می‌دهد پشت هر خط Python چه می‌گذرد: حافظه، هزینهٔ هر کار، و اینکه چرا چیزی کند است. در دانشگاه هم درس‌هایی مثل سیستم‌عامل و معماری با C هستند، و کارهای embedded و رباتیک هر روز C می‌خواهند.',
                                   'Python ist auf C gebaut, und C zeigt, was hinter jeder Python-Zeile passiert: Speicher, was etwas kostet, und warum etwas langsam ist. Im Studium laufen Fächer wie Betriebssysteme und Rechnerarchitektur in C, und Embedded- und Robotikjobs verlangen jeden Tag C.',
                                   'Python is built on C, and C shows what happens behind every line of Python: memory, what things cost, and why something is slow. At university, courses like operating systems and architecture use C, and embedded and robotics jobs ask for C every day.'),
                          why: T('C لایهٔ زیر Python است و دانشگاه و صنعت هر دو به آن نیاز دارند.', 'C ist die Schicht unter Python, und Studium wie Industrie brauchen es.', 'C is the layer under Python, and both university and industry need it.') },
                    ] },
                ],
            },

            // ---------------------------------------------------------------- 0.2
            {
                type: 'lesson', id: 'C.O02',
                blocks: [
                    { block: 'why', content: [
                        P('دانشجویی را تصور کن که سه هفته C نوشته، ولی هنوز نمی‌داند چرا برنامه‌اش با یک خطا در خط 6، حتی خط 4 را هم چاپ نمی‌کند. چیزی که کم دارد، تصویری از راه برنامه تا پردازنده است. این درس همان تصویر را می‌سازد.',
                          'Stell dir eine Studentin vor, die seit drei Wochen C schreibt, aber nicht weiß, warum ihr Programm mit einem Fehler in Zeile 6 nicht einmal Zeile 4 ausgibt. Ihr fehlt ein Bild vom Weg des Programms bis zum Prozessor. Diese Lektion baut genau dieses Bild.',
                          'Picture a student who has written C for three weeks but still does not know why her program, with an error on line 6, does not even print line 4. What she is missing is a picture of the path from program to processor. This lesson builds that picture.'),
                    ] },
                    { block: 'cando', content: [] },
                    SEC('levels', 'layers', ['سه لایهٔ زبان', 'Drei Ebenen von Sprache', 'Three Levels of Language'], ['لایه‌ها', 'Ebenen', 'Levels'], [
                        P('پردازنده فقط یک زبان می‌فهمد: [[term:T.machine-code]]، یعنی عددهایی که هر کدام یک دستور کوچک‌اند («این دو عدد را جمع کن»، «به این آدرس برو»). آدم‌ها این عددها را نمی‌خوانند، پس لایه‌های دیگری ساخته شد:',
                          'Der Prozessor versteht nur eine Sprache: [[term:T.machine-code]], also Zahlen, von denen jede ein kleiner Befehl ist („addiere diese zwei Zahlen“, „springe zu dieser Adresse“). Menschen lesen diese Zahlen nicht, also entstanden weitere Ebenen:',
                          'The processor understands only one language: [[term:T.machine-code]], numbers that are each a small instruction (“add these two numbers”, “jump to this address”). People do not read these numbers, so more levels were built:'),
                        OL(['**machine code:** عددها، برای پردازنده.', '**Maschinencode:** Zahlen, für den Prozessor.', '**Machine code:** numbers, for the processor.'],
                           ['**[[term:T.assembly-language]]:** همان دستورها، با نام‌های کوتاه مثل `mov` و `call`؛ هر خط تقریباً یک دستور پردازنده.', '**[[term:T.assembly-language]]:** dieselben Befehle mit kurzen Namen wie `mov` und `call`; jede Zeile ist ungefähr ein Prozessorbefehl.', '**[[term:T.assembly-language]]:** the same instructions with short names like `mov` and `call`; each line is about one processor instruction.'],
                           ['**زبان سطح بالا:** مثل C یا Python؛ یک خط می‌تواند ده‌ها دستور پردازنده شود.', '**Höhere Sprache:** wie C oder Python; eine Zeile kann zu Dutzenden Prozessorbefehlen werden.', '**High-level language:** like C or Python; one line can become dozens of processor instructions.']),
                        P('این یک برنامهٔ C است و کنارش assembly که gcc واقعاً از آن ساخته، برای پردازنده‌های x86-64 (بیشتر لپ‌تاپ‌های Windows و Linux):',
                          'Hier ein C-Programm und daneben das Assembly, das gcc wirklich daraus macht, für x86-64-Prozessoren (die meisten Windows- und Linux-Laptops):',
                          'Here is a C program and, next to it, the assembly gcc really makes from it, for x86-64 processors (most Windows and Linux laptops):'),
                        { type: 'asm', ref: 'C.O02.K01' },
                        LI(['دو خط C شده‌اند چند دستور: `lea` آدرس متن را آماده می‌کند و `call` تابع چاپ را صدا می‌زند.', 'Zwei C-Zeilen wurden zu mehreren Befehlen: `lea` bereitet die Adresse des Textes vor, `call` ruft die Ausgabefunktion auf.', 'Two lines of C became several instructions: `lea` prepares the address of the text, `call` calls the print function.'],
                           ['`6 * 7` در assembly نیست؛ compiler پیش از اجرا حساب کرده و فقط `42` را گذاشته.', '`6 * 7` steht nicht im Assembly; der Compiler hat schon vorher gerechnet und nur `42` eingesetzt.', '`6 * 7` is not in the assembly; the compiler worked it out in advance and put in `42`.'],
                           ['اولین `printf` شده `puts`، چون فقط یک متن با سر خط چاپ می‌کند. compiler اجازه دارد هر چیزی را عوض کند، به شرط اینکه خروجی همان بماند.', 'Das erste `printf` wurde zu `puts`, weil es nur einen Text mit Zeilenumbruch ausgibt. Der Compiler darf alles ändern, solange die Ausgabe gleich bleibt.', 'The first `printf` became `puts`, because it only prints text with a newline. The compiler may change anything as long as the output stays the same.']),
                        { type: 'note', kind: 'platform', text: T(
                            'روی Mac با پردازندهٔ Apple (ARM) دستورها فرق دارند؛ همان C برای هر پردازنده assembly دیگری می‌شود. برای همین C را «قابل حمل» (portable) می‌گویند.',
                            'Auf einem Mac mit Apple-Prozessor (ARM) sehen die Befehle anders aus; dasselbe C wird für jeden Prozessor zu anderem Assembly. Deshalb nennt man C „portabel“.',
                            'On a Mac with an Apple processor (ARM) the instructions look different; the same C becomes different assembly for each processor. That is why C is called portable.') },
                    ]),
                    SEC('translate', 'workflow', ['compiler، interpreter، bytecode', 'Compiler, Interpreter, Bytecode', 'Compiler, Interpreter, Bytecode'], ['ترجمه', 'Übersetzen', 'Translate'], [
                        P('برنامهٔ سطح بالا باید به machine code برسد. دو راه اصلی هست:',
                          'Ein Programm in einer höheren Sprache muss zu Maschinencode werden. Es gibt zwei Hauptwege:',
                          'A high-level program has to become machine code. There are two main ways:'),
                        LI(['**compiler** کل برنامه را **پیش از اجرا** می‌خواند و یک [[term:T.executable]] می‌سازد. خطاهای قاعده همه پیش از اجرا پیدا می‌شوند؛ اگر یکی باشد، هیچ برنامه‌ای ساخته نمی‌شود.', 'Ein **Compiler** liest das ganze Programm **vor dem Ausführen** und baut ein [[term:T.executable]]. Regelverstöße werden alle vor dem Ausführen gefunden; gibt es einen, entsteht gar kein Programm.', 'A **compiler** reads the whole program **before running** and builds an [[term:T.executable]]. Rule errors are all found before running; if there is one, no program is built.'],
                           ['یک [[term:T.interpreter]] برنامه را **هنگام اجرا** خط به خط پیش می‌برد. خطای خط 6 فقط وقتی پیدا می‌شود که به خط 6 برسد؛ خط‌های پیش از آن اجرا شده‌اند.', 'Ein [[term:T.interpreter]] arbeitet das Programm **beim Ausführen** Zeile für Zeile ab. Ein Fehler in Zeile 6 zeigt sich erst, wenn er dort ankommt; die Zeilen davor sind schon gelaufen.', 'An [[term:T.interpreter]] works through the program line by line **while running**. An error on line 6 only shows when it gets there; the lines before it have already run.']),
                        P('یک برنامه با خطا در خط 6. اجرایش کن: چون C compile می‌شود، حتی `one` هم چاپ نمی‌شود.',
                          'Ein Programm mit einem Fehler in Zeile 6. Führ es aus: Weil C kompiliert wird, erscheint nicht einmal `one`.',
                          'A program with an error on line 6. Run it: because C is compiled, not even `one` is printed.'),
                        { type: 'code', ref: 'C.O02.K02', mode: 'run' },
                        P('همین برنامه در Python، که interpreter دارد:', 'Dasselbe Programm in Python, das einen Interpreter hat:', 'The same program in Python, which has an interpreter:'),
                        { type: 'terminal', title: 'Python 3', lines: [
                            { cmd: 'cat demo.py' }, { out: 'print("one")\nprint("two")\nprint("three"' },
                            { cmd: 'python3 demo.py' }, { out: '  File "/home/ada/demo.py", line 3\n    print("three"\n         ^\nSyntaxError: \'(\' was never closed' } ] },
                        P('جالب است: Python هم پیش از اجرا کل فایل را می‌خواند و آن را به [[term:T.bytecode]] ترجمه می‌کند؛ برای همین یک خطای نحوی (syntax error) هم در Python جلوی اجرا را می‌گیرد. ولی خطاهای دیگر، مثل نام ناشناخته یا تقسیم بر صفر، تا خود آن خط پیدا نمی‌شوند. زبان‌ها روی یک طیف‌اند:',
                          'Interessant: Auch Python liest vorher die ganze Datei und übersetzt sie in [[term:T.bytecode]]; deshalb verhindert ein Syntaxfehler auch in Python das Ausführen. Andere Fehler wie ein unbekannter Name oder eine Division durch null zeigen sich aber erst in ihrer Zeile. Die Sprachen liegen auf einem Spektrum:',
                          'Interesting: Python also reads the whole file first and translates it to [[term:T.bytecode]], so a syntax error stops Python from running too. But other errors, like an unknown name or a division by zero, only show up on their own line. Languages sit on a spectrum:'),
                        { type: 'table', head: [T('زبان', 'Sprache', 'Language'), T('پیش از اجرا', 'Vor dem Ausführen', 'Before running'), T('هنگام اجرا', 'Beim Ausführen', 'While running')], rows: [
                            [{ code: 'C' }, T('compiler به machine code', 'Compiler zu Maschinencode', 'compiler to machine code'), T('پردازنده مستقیم اجرا می‌کند', 'der Prozessor führt direkt aus', 'the processor runs it directly')],
                            [{ code: 'Java' }, T('compiler به bytecode', 'Compiler zu Bytecode', 'compiler to bytecode'), T('ماشین مجازی (JVM)، با JIT به machine code', 'virtuelle Maschine (JVM), per JIT zu Maschinencode', 'virtual machine (JVM), with JIT to machine code')],
                            [{ code: 'Python' }, T('ترجمهٔ سریع به bytecode', 'schnelle Übersetzung zu Bytecode', 'quick translation to bytecode'), T('interpreter (به C نوشته شده) bytecode را اجرا می‌کند', 'ein Interpreter (in C geschrieben) führt den Bytecode aus', 'an interpreter (written in C) runs the bytecode')],
                            [{ code: 'JavaScript' }, T('هیچ، یا کمی', 'nichts oder wenig', 'nothing or little'), T('موتور مرورگر، با JIT', 'die Engine des Browsers, mit JIT', 'the browser’s engine, with JIT')],
                        ] },
                    ]),
                    SEC('build', 'package', ['چهار مرحلهٔ ساختن', 'Die vier Schritte beim Bauen', 'The Four Steps of a Build'], ['ساختن', 'Bauen', 'Build'], [
                        P('«compile» در واقع چهار کار پشت سر هم است. gcc همه را با یک دستور انجام می‌دهد، ولی می‌شود هر مرحله را جدا دید (`main.c` همان برنامهٔ بالاست):',
                          '„Kompilieren“ sind eigentlich vier Arbeiten nacheinander. gcc erledigt alle mit einem Befehl, aber man kann jeden Schritt einzeln sehen (`main.c` ist das Programm von oben):',
                          '“Compiling” is really four jobs in a row. gcc does them all with one command, but you can see each step on its own (`main.c` is the program above):'),
                        OL(['**preprocessor:** خط‌های `#include` و مانند آن را باز می‌کند (`gcc -E`).', '**Präprozessor:** löst Zeilen wie `#include` auf (`gcc -E`).', '**Preprocessor:** expands lines like `#include` (`gcc -E`).'],
                           ['**compiler:** C را به assembly ترجمه می‌کند (`gcc -S`).', '**Compiler:** übersetzt C in Assembly (`gcc -S`).', '**Compiler:** translates C to assembly (`gcc -S`).'],
                           ['**assembler:** assembly را به machine code در یک object file تبدیل می‌کند (`gcc -c`).', '**Assembler:** macht aus Assembly Maschinencode in einer Objektdatei (`gcc -c`).', '**Assembler:** turns assembly into machine code in an object file (`gcc -c`).'],
                           ['**[[term:T.linker]]:** کد تو را به کد کتابخانه (مثل `printf`) وصل می‌کند و برنامهٔ اجرایی را می‌سازد.', '**[[term:T.linker]]:** verbindet deinen Code mit dem Code der Bibliothek (wie `printf`) und baut das ausführbare Programm.', '**[[term:T.linker]]:** joins your code with library code (like `printf`) and builds the executable.']),
                        { type: 'terminal', title: 'Linux · macOS', lines: [
                            { cmd: 'gcc -std=c17 -E main.c -o main.i   # 1 preprocess' }, { cmd: 'gcc -std=c17 -S main.i -o main.s   # 2 compile' },
                            { cmd: 'gcc -c main.s -o main.o            # 3 assemble' }, { cmd: 'gcc main.o -o main                  # 4 link' },
                            { cmd: './main' }, { out: 'Hello\n42' } ] },
                        P('پیام‌های خطا هم از این مراحل می‌آیند. `expected \';\'` از compiler است؛ `undefined reference` از linker. در [[lesson:C.L02]] هر دو را می‌خوانی.',
                          'Auch die Fehlermeldungen kommen aus diesen Schritten. `expected \';\'` kommt vom Compiler, `undefined reference` vom Linker. In [[lesson:C.L02]] liest du beide.',
                          'Error messages come from these steps too. `expected \';\'` comes from the compiler; `undefined reference` from the linker. You read both in [[lesson:C.L02]].'),
                        MYTH(['«برنامهٔ compile‌شده برای اجرا به compiler نیاز دارد.»', '„Ein kompiliertes Programm braucht zum Laufen den Compiler.“', '“A compiled program needs the compiler to run.”'],
                             ['نه. executable را می‌شود بدون compiler روی کامپیوتر دیگری با همان سیستم‌عامل و پردازنده اجرا کرد. فقط هنگام ساختن به compiler نیاز است.',
                              'Nein. Das ausführbare Programm läuft ohne Compiler auf einem anderen Rechner mit gleichem Betriebssystem und Prozessor. Den Compiler braucht man nur beim Bauen.',
                              'No. The executable runs without the compiler on another computer with the same operating system and processor. You only need the compiler to build it.']),
                    ]),
                    { block: 'practice', content: [{ type: 'band', ref: 'C.O02.X01' }] },
                    { block: 'terms', content: [] }, { block: 'selfcheck', content: [] }, { block: 'key', content: [] },
                ],
                bands: [
                    { id: 'C.O02.X01', type: 'B.choice', title: T('انتخاب کن', 'Wähle aus', 'Choose'), items: [
                        { id: 'C.O02.X01.01', prompt: T('یک برنامهٔ C در خط 9 خطای compiler دارد. اجرایش می‌کنی. چه می‌بینی؟', 'Ein C-Programm hat in Zeile 9 einen Compilerfehler. Du führst es aus. Was siehst du?', 'A C program has a compiler error on line 9. You run it. What do you see?'),
                          options: [OPT(false, ['خروجی خط‌های 1 تا 8، بعد پیام خطا', 'die Ausgabe der Zeilen 1 bis 8, dann die Fehlermeldung', 'the output of lines 1 to 8, then the error message'], ['این رفتار interpreter است. compiler پیش از اجرا کل برنامه را بررسی می‌کند.', 'Das ist das Verhalten eines Interpreters. Ein Compiler prüft vor dem Ausführen das ganze Programm.', 'That is how an interpreter behaves. A compiler checks the whole program before anything runs.']),
                                    OPT(true, ['فقط پیام خطا، بدون هیچ خروجی', 'nur die Fehlermeldung, ohne jede Ausgabe', 'only the error message, no output at all'], ['درست. با یک خطا هیچ برنامه‌ای ساخته نمی‌شود.', 'Richtig. Mit einem Fehler entsteht gar kein Programm.', 'Right. With one error, no program is built.']),
                                    OPT(false, ['برنامه اجرا می‌شود و خط 9 نادیده گرفته می‌شود', 'das Programm läuft und Zeile 9 wird übersprungen', 'the program runs and line 9 is skipped'], ['compiler هیچ خطی را نادیده نمی‌گیرد.', 'Der Compiler überspringt keine Zeile.', 'The compiler skips no line.'])],
                          why: T('compiler پیش از اجرا کل برنامه را بررسی می‌کند؛ با یک خطا، برنامه‌ای نیست که اجرا شود.', 'Der Compiler prüft vor dem Ausführen das ganze Programm; mit einem Fehler gibt es nichts auszuführen.', 'The compiler checks the whole program before running; with one error there is nothing to run.') },
                        { id: 'C.O02.X01.02', prompt: T('پیام `undefined reference` از کدام مرحله می‌آید؟', 'Aus welchem Schritt kommt die Meldung `undefined reference`?', 'Which step does the message `undefined reference` come from?'),
                          options: [OPT(false, ['preprocessor', 'Präprozessor', 'preprocessor'], ['preprocessor فقط `#include` و مانند آن را باز می‌کند.', 'Der Präprozessor löst nur `#include` und Ähnliches auf.', 'The preprocessor only expands `#include` and the like.']),
                                    OPT(false, ['compiler', 'Compiler', 'compiler'], ['پیام‌های compiler شمارهٔ خط دارند؛ `undefined reference` ندارد.', 'Meldungen des Compilers haben eine Zeilennummer; `undefined reference` hat keine.', 'Compiler messages carry a line number; `undefined reference` has none.']),
                                    OPT(true, ['linker', 'Linker', 'linker'], ['درست. linker تابعی به آن نام نه در کد تو پیدا می‌کند، نه در هیچ کتابخانه‌ای.', 'Richtig. Der Linker findet eine Funktion mit diesem Namen weder in deinem Code noch in einer Bibliothek.', 'Right. The linker finds no function by that name, neither in your code nor in any library.'])],
                          why: T('اتصال نام‌ها به کد کتابخانه کار linker است.', 'Namen mit Bibliothekscode verbinden ist Aufgabe des Linkers.', 'Joining names to library code is the linker’s job.') },
                        { id: 'C.O02.X01.03', prompt: T('در assembly بالا، چرا `6 * 7` دیده نمی‌شود؟', 'Warum ist `6 * 7` im Assembly oben nicht zu sehen?', 'In the assembly above, why is `6 * 7` not there?'),
                          options: [OPT(true, ['compiler آن را پیش از اجرا حساب کرده و `42` گذاشته', 'der Compiler hat es vorher ausgerechnet und `42` eingesetzt', 'the compiler worked it out in advance and put in `42`'], ['درست. حساب ثابت در زمان compile انجام می‌شود.', 'Richtig. Konstante Rechnungen passieren beim Kompilieren.', 'Right. Constant arithmetic happens at compile time.']),
                                    OPT(false, ['پردازنده ضرب بلد نیست', 'der Prozessor kann nicht multiplizieren', 'the processor cannot multiply'], ['پردازنده دستور ضرب دارد؛ اینجا لازم نبود.', 'Der Prozessor hat einen Multiplikationsbefehl; er war hier nur nicht nötig.', 'The processor has a multiply instruction; it just was not needed here.']),
                                    OPT(false, ['`printf` ضرب را انجام می‌دهد', '`printf` rechnet die Multiplikation aus', '`printf` does the multiplication'], ['`printf` فقط عدد آماده را چاپ می‌کند ([[lesson:C.L03]]).', '`printf` gibt nur die fertige Zahl aus ([[lesson:C.L03]]).', '`printf` only prints the ready number ([[lesson:C.L03]]).'])],
                          why: T('compiler هر چیزی را که پیش از اجرا معلوم است، همان موقع حساب می‌کند.', 'Der Compiler rechnet alles, was vor dem Ausführen feststeht, gleich selbst aus.', 'The compiler works out anything that is known before running.') },
                        { id: 'C.O02.X01.04', prompt: T('ترتیب درست مرحله‌ها کدام است؟', 'Welche Reihenfolge der Schritte stimmt?', 'Which order of the steps is right?'),
                          options: [OPT(false, ['compiler، preprocessor، linker، assembler', 'Compiler, Präprozessor, Linker, Assembler', 'compiler, preprocessor, linker, assembler'], ['preprocessor باید اول باشد تا `#include` باز شود.', 'Der Präprozessor muss zuerst kommen, damit `#include` aufgelöst ist.', 'The preprocessor must come first so `#include` is expanded.']),
                                    OPT(true, ['preprocessor، compiler، assembler، linker', 'Präprozessor, Compiler, Assembler, Linker', 'preprocessor, compiler, assembler, linker'], ['درست.', 'Richtig.', 'Right.']),
                                    OPT(false, ['preprocessor، linker، compiler، assembler', 'Präprozessor, Linker, Compiler, Assembler', 'preprocessor, linker, compiler, assembler'], ['linker آخر است: چیزی را وصل می‌کند که قبلاً ساخته شده.', 'Der Linker kommt zuletzt: Er verbindet, was vorher gebaut wurde.', 'The linker comes last: it joins what was built before.'])],
                          why: T('preprocess، compile، assemble، link.', 'Präprozessor, Compiler, Assembler, Linker.', 'Preprocess, compile, assemble, link.') },
                    ] },
                ],
            },

            // ---------------------------------------------------------------- 0.3
            {
                type: 'lesson', id: 'C.O03',
                blocks: [
                    { block: 'why', content: [
                        P('«C» یک چیز ثابت نیست؛ چند نسخهٔ رسمی دارد و هر compiler نسخهٔ پیش‌فرض خودش را دارد. اگر ندانی کدام C را می‌نویسی، کدی که در خانه کار می‌کند ممکن است روی سیستم دانشگاه کار نکند.',
                          '„C“ ist nichts Festes; es gibt mehrere offizielle Fassungen, und jeder Compiler hat seine Standardfassung. Wenn du nicht weißt, welches C du schreibst, läuft Code von zu Hause vielleicht nicht an der Uni.',
                          '“C” is not one fixed thing; it has several official versions, and each compiler has its own default. If you do not know which C you write, code that works at home may not work on the university system.'),
                    ] },
                    { block: 'cando', content: [] },
                    SEC('history', 'landmark', ['تاریخچه و نسخه‌ها', 'Geschichte und Fassungen', 'History and Versions'], ['تاریخچه', 'Geschichte', 'History'], [
                        { type: 'table', head: [T('سال', 'Jahr', 'Year'), T('نسخه', 'Fassung', 'Version'), T('چه شد', 'Was geschah', 'What happened')], rows: [
                            [{ code: '1972' }, T('C', 'C', 'C'), T('Dennis Ritchie در Bell Labs زبان C را برای سیستم‌عامل Unix ساخت.', 'Dennis Ritchie entwickelt C in den Bell Labs für das Betriebssystem Unix.', 'Dennis Ritchie creates C at Bell Labs for the Unix operating system.')],
                            [{ code: '1978' }, T('K&R', 'K&R', 'K&R'), T('کتاب Kernighan و Ritchie، *The C Programming Language*، سال‌ها جای استاندارد را گرفت.', 'Das Buch von Kernighan und Ritchie, *The C Programming Language*, ist jahrelang der Standard.', 'Kernighan and Ritchie’s book, *The C Programming Language*, serves as the standard for years.')],
                            [{ code: '1989/1990' }, { code: 'C89 / C90' }, T('نخستین استاندارد: ANSI در 1989، ISO در 1990.', 'Der erste Standard: ANSI 1989, ISO 1990.', 'The first standard: ANSI in 1989, ISO in 1990.')],
                            [{ code: '1999' }, { code: 'C99' }, T('comment با `//`، `long long`، `bool` و بسیاری چیزهای دیگر.', 'Kommentare mit `//`, `long long`, `bool` und vieles mehr.', 'Comments with `//`, `long long`, `bool` and much more.')],
                            [{ code: '2011' }, { code: 'C11' }, T('thread، `_Static_assert`، Unicode.', 'Threads, `_Static_assert`, Unicode.', 'Threads, `_Static_assert`, Unicode.')],
                            [{ code: '2018' }, { code: 'C17' }, T('رفع اشکال‌های C11، بدون ویژگی تازه (ISO/IEC 9899:2018).', 'Fehlerkorrekturen an C11, ohne neue Features (ISO/IEC 9899:2018).', 'Fixes to C11, with no new features (ISO/IEC 9899:2018).')],
                            [{ code: '2024' }, { code: 'C23' }, T('`bool` و `true` به‌صورت واژهٔ کلیدی، `nullptr`، `constexpr` و بیشتر (ISO/IEC 9899:2024).', '`bool` und `true` als Schlüsselwörter, `nullptr`, `constexpr` und mehr (ISO/IEC 9899:2024).', '`bool` and `true` as keywords, `nullptr`, `constexpr` and more (ISO/IEC 9899:2024).')],
                        ] },
                        P('نام‌هایی مثل C17 از یک عدد درون خود زبان می‌آیند: `__STDC_VERSION__`. این برنامه آن را چاپ می‌کند. اجرایش کن:',
                          'Namen wie C17 kommen von einer Zahl in der Sprache selbst: `__STDC_VERSION__`. Dieses Programm gibt sie aus. Führ es aus:',
                          'Names like C17 come from a number inside the language: `__STDC_VERSION__`. This program prints it. Run it:'),
                        { type: 'code', ref: 'C.O03.K01', mode: 'run' },
                        P('gcc با `-std=c17` عدد `201710` را چاپ می‌کند، یعنی اکتبر 2017، وقتی متن C17 بسته شد. compiler این صفحه `199901` را چاپ می‌کند: خودش را C99 معرفی می‌کند، هرچند بیشتر C17 را می‌فهمد. پس هر compiler دقیقاً بگوید کدام C را اجرا می‌کند.',
                          'gcc mit `-std=c17` gibt `201710` aus, also Oktober 2017, als der Text von C17 fertig wurde. Der Compiler dieser Seite gibt `199901` aus: Er meldet sich als C99, obwohl er das meiste von C17 versteht. Jeder Compiler sagt also selbst, welches C er umsetzt.',
                          'gcc with `-std=c17` prints `201710`, that is October 2017, when the text of C17 was frozen. The compiler on this page prints `199901`: it reports itself as C99, although it understands most of C17. So each compiler tells you which C it implements.'),
                    ]),
                    SEC('whyc17', 'badge-check', ['چرا C17؟', 'Warum C17?', 'Why C17?'], ['C17', 'C17', 'C17'], [
                        LI(['**پایدار:** gcc و clang آن را کامل پشتیبانی می‌کنند، و MSVC از Visual Studio 2019 (16.8)، بی چند بخش اختیاری استاندارد.', '**Stabil:** gcc und clang unterstützen es vollständig, MSVC seit Visual Studio 2019 (16.8), ohne einige optionale Teile des Standards.', '**Stable:** gcc and clang support it fully, and MSVC since Visual Studio 2019 (16.8), without some optional parts of the standard.'],
                           ['**همان C11 است، بی‌اشکال:** بیشتر کتاب‌ها و درس‌های دانشگاه با C99 یا C11 کار می‌کنند و C17 با هر دو سازگار است.', '**Es ist C11 ohne Fehler:** Die meisten Bücher und Vorlesungen arbeiten mit C99 oder C11, und C17 passt zu beiden.', '**It is C11 without the bugs:** most books and courses use C99 or C11, and C17 fits both.'],
                           ['**C23 هنوز تازه است:** جاهایی که C23 فرق دارد، در یادداشت جدا می‌گوییم.', '**C23 ist noch neu:** Wo C23 sich unterscheidet, sagen wir es in einer eigenen Notiz.', '**C23 is still new:** where C23 differs, we say so in a separate note.']),
                        { type: 'note', kind: 'platform', text: T(
                            'از GCC 15 (سال 2025)، gcc اگر چیزی نگویی C23 را به کار می‌برد. پس روی کامپیوتر خودت همیشه `-std=c17` را بنویس تا همان C این دوره را بگیری.',
                            'Seit GCC 15 (2025) verwendet gcc C23, wenn du nichts angibst. Schreib auf deinem Rechner deshalb immer `-std=c17`, damit du das C dieses Kurses bekommst.',
                            'Since GCC 15 (2025), gcc uses C23 when you say nothing. So on your own computer always write `-std=c17` to get the C of this course.') },
                    ]),
                    SEC('compilers', 'wrench', ['compilerها', 'Die Compiler', 'The Compilers'], ['compilerها', 'Compiler', 'Compilers'], [
                        { type: 'table', head: [T('compiler', 'Compiler', 'Compiler'), T('کجا', 'Wo', 'Where'), T('انتخاب C17', 'C17 wählen', 'Choosing C17')], rows: [
                            [{ code: 'gcc' }, T('Linux، و روی Windows از راه WSL یا MSYS2', 'Linux, unter Windows über WSL oder MSYS2', 'Linux, and on Windows through WSL or MSYS2'), { code: '-std=c17' }],
                            [{ code: 'clang' }, T('macOS (دستور `gcc` روی Mac همان clang است)، Linux، Windows', 'macOS (der Befehl `gcc` auf dem Mac ist clang), Linux, Windows', 'macOS (the `gcc` command on a Mac is clang), Linux, Windows'), { code: '-std=c17' }],
                            [{ code: 'MSVC' }, T('Visual Studio روی Windows، از نسخهٔ 2019 (16.8)', 'Visual Studio unter Windows, ab Version 2019 (16.8)', 'Visual Studio on Windows, from version 2019 (16.8)'), { code: '/std:c17' }],
                        ] },
                        P('در این دوره پیام‌ها را از gcc نشان می‌دهیم، چون در بیشتر دانشگاه‌ها و سرورها همان است.',
                          'In diesem Kurs zeigen wir die Meldungen von gcc, weil er an den meisten Unis und auf den meisten Servern läuft.',
                          'In this course we show gcc’s messages, because that is what most universities and servers use.'),
                    ]),
                    SEC('related', 'scale', ['استانداردهای کنار C', 'Standards neben C', 'Standards Next to C'], ['مرتبط', 'Verwandt', 'Related'], [
                        LI(['**POSIX:** استاندارد رابط سیستم‌عامل (فایل، process، thread) که Linux و macOS دنبال می‌کنند. تابع‌هایی که در استاندارد C نیستند ولی روی این سیستم‌ها هستند، از اینجا می‌آیند.', '**POSIX:** der Standard für die Schnittstelle zum Betriebssystem (Dateien, Prozesse, Threads), dem Linux und macOS folgen. Funktionen, die nicht im C-Standard stehen, aber auf diesen Systemen da sind, kommen von hier.', '**POSIX:** the standard interface to the operating system (files, processes, threads) that Linux and macOS follow. Functions that are not in standard C but exist on those systems come from here.'],
                           ['**MISRA C:** قاعده‌هایی برای C در سامانه‌های ایمنی‌محور، به‌ویژه خودرو.', '**MISRA C:** Regeln für C in sicherheitskritischen Systemen, vor allem im Auto.', '**MISRA C:** rules for C in safety-critical systems, especially cars.'],
                           ['**SEI CERT C:** قاعده‌های کدنویسی امن برای جلوگیری از حفره‌های امنیتی.', '**SEI CERT C:** Regeln für sicheres Programmieren gegen Sicherheitslücken.', '**SEI CERT C:** secure-coding rules against security holes.']),
                        MYTH(['«C و C++ یک زبان‌اند.»', '„C und C++ sind dieselbe Sprache.“', '“C and C++ are the same language.”'],
                             ['C++ از C رشد کرد و بیشتر C را می‌فهمد، ولی دو زبان جدا با دو استاندارد جدا هستند. هر برنامهٔ C، برنامهٔ درست C++ نیست. این دوره C است؛ C++ پس از آن می‌آید.',
                              'C++ ist aus C gewachsen und versteht das meiste von C, aber es sind zwei Sprachen mit zwei Standards. Nicht jedes C-Programm ist gültiges C++. Dieser Kurs ist C; C++ folgt danach.',
                              'C++ grew out of C and understands most of it, but they are two languages with two standards. Not every C program is valid C++. This course is C; C++ comes after.']),
                    ]),
                    { block: 'practice', content: [{ type: 'band', ref: 'C.O03.X01' }] },
                    { block: 'terms', content: [] }, { block: 'selfcheck', content: [] }, { block: 'key', content: [] },
                ],
                bands: [
                    { id: 'C.O03.X01', type: 'B.choice', title: T('انتخاب کن', 'Wähle aus', 'Choose'), items: [
                        { id: 'C.O03.X01.01', prompt: T('روی لپ‌تاپت gcc 15 نصب است. اگر `gcc main.c` بنویسی، کدام C را می‌گیری؟', 'Auf deinem Laptop ist gcc 15 installiert. Wenn du `gcc main.c` schreibst, welches C bekommst du?', 'Your laptop has gcc 15. If you type `gcc main.c`, which C do you get?'),
                          options: [OPT(false, ['C17', 'C17', 'C17'], ['تا gcc 14 بله؛ از gcc 15 پیش‌فرض عوض شد.', 'Bis gcc 14 ja; seit gcc 15 hat sich die Voreinstellung geändert.', 'Up to gcc 14, yes; since gcc 15 the default changed.']),
                                    OPT(true, ['C23 (با افزوده‌های GNU)', 'C23 (mit GNU-Erweiterungen)', 'C23 (with GNU extensions)'], ['درست؛ برای همین `-std=c17` را می‌نویسیم.', 'Richtig; deshalb schreiben wir `-std=c17`.', 'Right; that is why we write `-std=c17`.']),
                                    OPT(false, ['C89', 'C89', 'C89'], ['C89 مدت‌هاست پیش‌فرض نیست.', 'C89 ist längst nicht mehr die Voreinstellung.', 'C89 has not been the default for a long time.'])],
                          why: T('از GCC 15 پیش‌فرض `gnu23` است.', 'Seit GCC 15 ist die Voreinstellung `gnu23`.', 'Since GCC 15 the default is `gnu23`.') },
                        { id: 'C.O03.X01.02', prompt: T('روی Mac در terminal می‌نویسی `gcc --version`. چه می‌بینی؟', 'Auf dem Mac tippst du im Terminal `gcc --version`. Was siehst du?', 'On a Mac you type `gcc --version` in the terminal. What do you see?'),
                          options: [OPT(false, ['نسخهٔ GNU gcc', 'die Version von GNU gcc', 'the GNU gcc version'], ['Apple به‌جای gcc، clang می‌دهد.', 'Apple liefert statt gcc clang.', 'Apple ships clang instead of gcc.']),
                                    OPT(true, ['Apple clang', 'Apple clang', 'Apple clang'], ['درست. `gcc` روی Mac نام دیگری برای clang است.', 'Richtig. `gcc` ist auf dem Mac ein anderer Name für clang.', 'Right. `gcc` on a Mac is another name for clang.']),
                                    OPT(false, ['MSVC', 'MSVC', 'MSVC'], ['MSVC فقط روی Windows است.', 'MSVC gibt es nur unter Windows.', 'MSVC only exists on Windows.'])],
                          why: T('روی macOS دستور `gcc` همان clang اپل است.', 'Unter macOS ist der Befehl `gcc` Apples clang.', 'On macOS the `gcc` command is Apple’s clang.') },
                        { id: 'C.O03.X01.03', prompt: T('کدام جمله دربارهٔ C و C++ درست است؟', 'Welcher Satz über C und C++ stimmt?', 'Which sentence about C and C++ is true?'),
                          options: [OPT(false, ['C++ نسخهٔ تازهٔ C است.', 'C++ ist die neue Fassung von C.', 'C++ is the new version of C.'], ['نسخهٔ تازهٔ C، C23 است. C++ زبان دیگری است.', 'Die neue Fassung von C ist C23. C++ ist eine andere Sprache.', 'The new version of C is C23. C++ is another language.']),
                                    OPT(true, ['دو زبان جدا هستند و C++ از C رشد کرده.', 'Es sind zwei Sprachen, und C++ ist aus C gewachsen.', 'They are two languages, and C++ grew out of C.'], ['درست.', 'Richtig.', 'Right.']),
                                    OPT(false, ['هر برنامهٔ C، یک برنامهٔ درست C++ است.', 'Jedes C-Programm ist gültiges C++.', 'Every C program is valid C++.'], ['بیشترشان، نه همه؛ چند قاعده در دو زبان فرق دارد.', 'Die meisten, nicht alle; einige Regeln unterscheiden sich.', 'Most, not all; some rules differ between the two.'])],
                          why: T('C و C++ دو زبان با دو استاندارد جدا هستند.', 'C und C++ sind zwei Sprachen mit zwei Standards.', 'C and C++ are two languages with two standards.') },
                    ] },
                ],
            },

            // ---------------------------------------------------------------- 0.4
            {
                type: 'lesson', id: 'C.O04',
                blocks: [
                    { block: 'why', content: [
                        P('در این دوره همه‌چیز در مرورگر اجرا می‌شود. ولی تمرین‌های دانشگاه، امتحان‌های عملی و پروژه‌ها روی کامپیوتر خودت انجام می‌شوند. این درس یک بار و برای همیشه C را روی سیستم‌عاملت راه می‌اندازد.',
                          'In diesem Kurs läuft alles im Browser. Übungen an der Uni, praktische Prüfungen und Projekte machst du aber auf deinem eigenen Rechner. Diese Lektion richtet C einmal und für immer auf deinem Betriebssystem ein.',
                          'In this course everything runs in the browser. But university exercises, lab exams and projects happen on your own computer. This lesson sets C up on your operating system once and for all.'),
                        { type: 'note', kind: 'simplification', text: T(
                            'برای ادامهٔ فصل 1 به این نصب نیاز نداری؛ می‌توانی آن را برای بعد نگه داری. در پایان هر فصل همان کارها را روی کامپیوتر خودت هم انجام می‌دهیم.',
                            'Für Kapitel 1 brauchst du diese Installation noch nicht; du kannst sie auf später verschieben. Am Ende jedes Kapitels machen wir dasselbe auch auf deinem Rechner.',
                            'You do not need this setup to continue with chapter 1; you can keep it for later. At the end of each chapter we do the same work on your own computer too.') },
                    ] },
                    { block: 'cando', content: [] },
                    SEC('terminal', 'terminal', ['terminal در پنج دستور', 'Das Terminal in fünf Befehlen', 'The Terminal in Five Commands'], ['terminal', 'Terminal', 'Terminal'], [
                        P('[[term:T.terminal]] پنجره‌ای است که در آن به‌جای کلیک کردن، دستور می‌نویسی. برای C پنج دستور کافی است:',
                          'Das [[term:T.terminal]] ist ein Fenster, in dem du Befehle tippst, statt zu klicken. Für C reichen fünf Befehle:',
                          'The [[term:T.terminal]] is a window where you type commands instead of clicking. For C, five commands are enough:'),
                        { type: 'table', head: [T('دستور', 'Befehl', 'Command'), T('کار', 'Was er tut', 'What it does')], rows: [
                            [{ code: 'pwd' }, T('کجا هستم؟ پوشهٔ جاری را نشان می‌دهد.', 'Wo bin ich? Zeigt den aktuellen Ordner.', 'Where am I? Shows the current folder.')],
                            [{ code: 'ls' }, T('چه چیزهایی اینجاست؟ (در cmd ویندوز: `dir`)', 'Was liegt hier? (in der Windows-cmd: `dir`)', 'What is here? (in the Windows cmd: `dir`)')],
                            [{ code: 'mkdir c-course' }, T('یک پوشه بساز.', 'Einen Ordner anlegen.', 'Make a folder.')],
                            [{ code: 'cd c-course' }, T('به پوشه برو؛ `cd ..` یک پوشه بالا می‌برد.', 'In den Ordner wechseln; `cd ..` geht eine Ebene hoch.', 'Go into the folder; `cd ..` goes one level up.')],
                            [{ code: './hello' }, T('برنامهٔ `hello` را از همین پوشه اجرا کن.', 'Das Programm `hello` aus diesem Ordner ausführen.', 'Run the program `hello` from this folder.')],
                        ] },
                        P('چرا `./`؟ Linux و macOS برنامه‌ها را فقط در چند پوشهٔ مشخص جست‌وجو می‌کنند، نه در پوشهٔ جاری. `./` یعنی «همین‌جا».',
                          'Warum `./`? Linux und macOS suchen Programme nur in bestimmten Ordnern, nicht im aktuellen. `./` heißt „genau hier“.',
                          'Why `./`? Linux and macOS look for programs only in certain folders, not in the current one. `./` means “right here”.'),
                    ]),
                    SEC('install', 'download', ['نصب compiler', 'Den Compiler installieren', 'Installing a Compiler'], ['نصب', 'Installieren', 'Install'], [
                        { type: 'tabs', tabs: [
                            { label: 'Windows', content: [
                                P('راه پیشنهادی **WSL** است: یک Linux واقعی درون Windows. PowerShell را با Run as administrator باز کن:',
                                  'Der empfohlene Weg ist **WSL**: ein echtes Linux in Windows. Öffne PowerShell mit „Als Administrator ausführen“:',
                                  'The recommended way is **WSL**: a real Linux inside Windows. Open PowerShell with Run as administrator:'),
                                { type: 'terminal', title: 'PowerShell', prompt: 'PS>', lines: [{ cmd: 'wsl --install' }] },
                                P('پس از راه‌اندازی دوباره، Ubuntu را از منوی Start باز کن و compiler را نصب کن:',
                                  'Nach dem Neustart öffne Ubuntu im Startmenü und installiere den Compiler:',
                                  'After restarting, open Ubuntu from the Start menu and install the compiler:'),
                                { type: 'terminal', title: 'Ubuntu (WSL)', lines: [{ cmd: 'sudo apt update' }, { cmd: 'sudo apt install build-essential' }, { cmd: 'gcc --version' }] },
                                P('راه دیگر **MSYS2** است (از msys2.org). در پنجرهٔ MSYS2 UCRT64 بنویس `pacman -S mingw-w64-ucrt-x86_64-gcc`. برنامه‌ها آنجا پسوند `.exe` دارند: `./hello.exe`.',
                                  'Ein anderer Weg ist **MSYS2** (von msys2.org). Tippe im Fenster MSYS2 UCRT64 `pacman -S mingw-w64-ucrt-x86_64-gcc`. Programme haben dort die Endung `.exe`: `./hello.exe`.',
                                  'Another way is **MSYS2** (from msys2.org). In the MSYS2 UCRT64 window type `pacman -S mingw-w64-ucrt-x86_64-gcc`. Programs there end in `.exe`: `./hello.exe`.'),
                            ] },
                            { label: 'macOS', content: [
                                P('ابزارهای خط فرمان اپل clang را نصب می‌کنند. در Terminal بنویس و پنجرهٔ نصب را تأیید کن:',
                                  'Apples Kommandozeilenwerkzeuge installieren clang. Tippe im Terminal und bestätige das Installationsfenster:',
                                  'Apple’s command line tools install clang. Type this in Terminal and confirm the install window:'),
                                { type: 'terminal', title: 'Terminal', prompt: '%', lines: [{ cmd: 'xcode-select --install' }, { cmd: 'gcc --version' }, { out: 'Apple clang version …' }] },
                                P('`gcc` اینجا همان clang است و همهٔ پرچم‌های این دوره را می‌فهمد. پیام‌های خطایش کمی با gcc فرق دارد.',
                                  '`gcc` ist hier clang und versteht alle Optionen dieses Kurses. Seine Fehlermeldungen sehen etwas anders aus als die von gcc.',
                                  '`gcc` here is clang and understands every option of this course. Its error messages look a little different from gcc’s.'),
                            ] },
                            { label: 'Linux', content: [
                                P('در Ubuntu یا Debian:', 'Unter Ubuntu oder Debian:', 'On Ubuntu or Debian:'),
                                { type: 'terminal', title: 'Terminal', lines: [{ cmd: 'sudo apt update' }, { cmd: 'sudo apt install build-essential' }, { cmd: 'gcc --version' }] },
                                P('در Fedora: `sudo dnf install gcc`', 'Unter Fedora: `sudo dnf install gcc`.', 'On Fedora: `sudo dnf install gcc`.'),
                            ] },
                        ] },
                    ]),
                    SEC('firstbuild', 'rocket', ['نخستین برنامه روی کامپیوتر خودت', 'Das erste Programm auf deinem Rechner', 'Your First Program on Your Computer'], ['اجرا', 'Ausführen', 'Run'], [
                        P('این برنامه را در یک فایل به نام `main.c` ذخیره کن (پایین‌تر می‌گوییم با چه ویرایشگری):',
                          'Speichere dieses Programm in einer Datei namens `main.c` (welcher Editor, sagen wir unten):',
                          'Save this program in a file called `main.c` (which editor, we say below):'),
                        { type: 'code', ref: 'C.O04.K01', mode: 'run' },
                        { type: 'terminal', title: 'Linux · macOS · WSL', lines: [
                            { cmd: 'gcc -std=c17 -Wall -Wextra -pedantic main.c -o hello' }, { cmd: './hello' }, { out: 'Hello from my own computer' } ] },
                        { type: 'table', head: [T('بخش', 'Teil', 'Part'), T('معنا', 'Bedeutung', 'Meaning')], rows: [
                            [{ code: '-std=c17' }, T('همان C این دوره ([[lesson:C.O03]])', 'das C dieses Kurses ([[lesson:C.O03]])', 'the C of this course ([[lesson:C.O03]])')],
                            [{ code: '-Wall -Wextra' }, T('warningهای بیشتر؛ بیشتر bugها را زودتر نشان می‌دهند', 'mehr Warnungen; sie zeigen die meisten Fehler früher', 'more warnings; they show most bugs earlier')],
                            [{ code: '-pedantic' }, T('هشدار برای چیزهایی که در استاندارد نیستند', 'Warnung bei allem, was nicht im Standard steht', 'warn about anything that is not in the standard')],
                            [{ code: '-o hello' }, T('نام برنامهٔ خروجی؛ بدون آن `a.out` (روی Windows `a.exe`)', 'Name des fertigen Programms; ohne die Option `a.out` (unter Windows `a.exe`)', 'name of the built program; without it `a.out` (on Windows `a.exe`)')],
                        ] },
                    ]),
                    SEC('editor', 'file-code', ['ویرایشگر و IDE', 'Editor und IDE', 'Editor and IDE'], ['ویرایشگر', 'Editor', 'Editor'], [
                        P('برای نوشتن کد، **VS Code** با افزونهٔ C/C++ از Microsoft انتخاب خوب و رایگانی است و روی هر سه سیستم‌عامل کار می‌کند. ویرایشگرش کد را رنگی می‌کند و terminal درونی دارد (منوی Terminal → New Terminal).',
                          'Zum Schreiben ist **VS Code** mit der Erweiterung C/C++ von Microsoft eine gute, kostenlose Wahl auf allen drei Systemen. Der Editor färbt den Code und hat ein eingebautes Terminal (Menü Terminal → New Terminal).',
                          'For writing code, **VS Code** with Microsoft’s C/C++ extension is a good free choice on all three systems. It colors the code and has a built-in terminal (menu Terminal → New Terminal).'),
                        MYTH(['«IDE همان compiler است.»', '„Die IDE ist der Compiler.“', '“The IDE is the compiler.”'],
                             ['یک [[term:T.ide]] ویرایشگر، دکمهٔ اجرا و debugger را کنار هم می‌گذارد، ولی برای ساختن برنامه همان compilerی را صدا می‌زند که نصب کرده‌ای. اگر compiler نصب نباشد، دکمهٔ اجرای VS Code هم کار نمی‌کند.',
                              'Eine [[term:T.ide]] bündelt Editor, Ausführen-Knopf und Debugger, ruft zum Bauen aber den Compiler auf, den du installiert hast. Ist kein Compiler installiert, funktioniert auch der Ausführen-Knopf von VS Code nicht.',
                              'An [[term:T.ide]] puts an editor, a run button and a debugger together, but to build it calls the compiler you installed. Without a compiler, VS Code’s run button does not work either.']),
                    ]),
                    { block: 'practice', content: [{ type: 'band', ref: 'C.O04.X01' }] },
                    { block: 'terms', content: [] }, { block: 'selfcheck', content: [] }, { block: 'key', content: [] },
                ],
                bands: [
                    { id: 'C.O04.X01', type: 'B.choice', title: T('انتخاب کن', 'Wähle aus', 'Choose'), items: [
                        { id: 'C.O04.X01.01', prompt: T('`gcc -std=c17 main.c` را بدون `-o` اجرا کردی (روی Linux). برنامه با چه نامی ساخته شد؟', 'Du hast `gcc -std=c17 main.c` ohne `-o` ausgeführt (unter Linux). Wie heißt das gebaute Programm?', 'You ran `gcc -std=c17 main.c` without `-o` (on Linux). What is the built program called?'),
                          options: [OPT(false, ['`main`', '`main`', '`main`'], ['نام را فقط `-o` تعیین می‌کند.', 'Den Namen bestimmt nur `-o`.', 'Only `-o` sets the name.']),
                                    OPT(true, ['`a.out`', '`a.out`', '`a.out`'], ['درست. اجرایش با `./a.out`.', 'Richtig. Du startest es mit `./a.out`.', 'Right. You run it with `./a.out`.']),
                                    OPT(false, ['`main.exe`', '`main.exe`', '`main.exe`'], ['`.exe` فقط روی Windows است، و آنجا هم نام پیش‌فرض `a.exe` است.', '`.exe` gibt es nur unter Windows, und dort heißt es standardmäßig `a.exe`.', '`.exe` is only on Windows, and the default there is `a.exe`.'])],
                          why: T('بدون `-o` نام پیش‌فرض `a.out` است.', 'Ohne `-o` heißt das Programm `a.out`.', 'Without `-o` the default name is `a.out`.') },
                        { id: 'C.O04.X01.02', prompt: T('در پوشهٔ برنامه‌ات `hello` را تایپ می‌کنی و می‌بینی `command not found`. چه کم است؟', 'Im Ordner deines Programms tippst du `hello` und siehst `command not found`. Was fehlt?', 'In your program’s folder you type `hello` and see `command not found`. What is missing?'),
                          options: [OPT(true, ['`./` پیش از نام', '`./` vor dem Namen', '`./` before the name'], ['درست. پوشهٔ جاری جزو جاهایی نیست که سیستم در آن برنامه پیدا می‌کند.', 'Richtig. Der aktuelle Ordner gehört nicht zu den Orten, an denen das System Programme sucht.', 'Right. The current folder is not one of the places the system looks for programs.']),
                                    OPT(false, ['دوباره compile کردن', 'erneut kompilieren', 'compiling again'], ['برنامه وجود دارد؛ فقط سیستم آن را پیدا نمی‌کند.', 'Das Programm ist da; das System findet es nur nicht.', 'The program is there; the system just does not find it.']),
                                    OPT(false, ['`-std=c17`', '`-std=c17`', '`-std=c17`'], ['این پرچم compiler است، نه بخشی از اجرا.', 'Das ist eine Compiler-Option, kein Teil des Ausführens.', 'That is a compiler option, not part of running.'])],
                          why: T('برنامه‌ای در پوشهٔ جاری با `./hello` اجرا می‌شود.', 'Ein Programm im aktuellen Ordner startest du mit `./hello`.', 'A program in the current folder runs with `./hello`.') },
                        { id: 'C.O04.X01.03', prompt: T('کدام پرچم warningهای بیشتری روشن می‌کند؟', 'Welche Option schaltet mehr Warnungen ein?', 'Which option turns on more warnings?'),
                          options: [OPT(false, ['`-o`', '`-o`', '`-o`'], ['`-o` فقط نام خروجی است.', '`-o` gibt nur den Namen der Ausgabe an.', '`-o` only names the output.']),
                                    OPT(true, ['`-Wall`', '`-Wall`', '`-Wall`'], ['درست؛ با `-Wextra` باز هم بیشتر.', 'Richtig; mit `-Wextra` noch mehr.', 'Right; with `-Wextra` even more.']),
                                    OPT(false, ['`-std=c17`', '`-std=c17`', '`-std=c17`'], ['این نسخهٔ C را انتخاب می‌کند.', 'Das wählt die C-Fassung.', 'That chooses the version of C.'])],
                          why: T('`-W` یعنی warning؛ `-Wall` و `-Wextra` بیشتر آن‌ها را روشن می‌کنند.', '`-W` steht für Warnung; `-Wall` und `-Wextra` schalten die meisten ein.', '`-W` stands for warning; `-Wall` and `-Wextra` turn most of them on.') },
                    ] },
                ],
            },

            // ---------------------------------------------------------------- 0.5
            {
                type: 'lesson', id: 'C.O05',
                blocks: [
                    { block: 'why', content: [
                        P('برنامه‌نویسی با خواندن یاد گرفته نمی‌شود، همان‌طور که شنا با تماشای شنا یاد گرفته نمی‌شود. این درس می‌گوید چطور یاد بگیری، تا هر ساعتی که می‌گذاری بیشترین اثر را داشته باشد؛ برای C و برای هر زبان دیگری که بعداً یاد می‌گیری.',
                          'Programmieren lernt man nicht durch Lesen, so wie man Schwimmen nicht durch Zuschauen lernt. Diese Lektion zeigt, wie du lernst, damit jede Stunde möglichst viel bringt — für C und jede Sprache, die du später lernst.',
                          'You do not learn programming by reading, just as you do not learn to swim by watching. This lesson shows how to learn, so every hour you put in counts as much as possible — for C and for every language you learn later.'),
                    ] },
                    { block: 'cando', content: [] },
                    SEC('habits', 'route', ['شش عادت', 'Sechs Gewohnheiten', 'Six Habits'], ['عادت‌ها', 'Gewohnheiten', 'Habits'], [
                        OL(['**پیش از اجرا پیش‌بینی کن.** برای همین دکمهٔ اجرا تا نوشتن پیش‌بینی قفل است: اشتباه پیش‌بینی، بهترین لحظهٔ یادگیری است.', '**Sag voraus, bevor du ausführst.** Deshalb ist der Ausführen-Knopf gesperrt, bis du eine Vorhersage geschrieben hast: Eine falsche Vorhersage ist der beste Moment zum Lernen.', '**Predict before you run.** That is why the run button stays locked until you write a prediction: a wrong prediction is the best moment to learn.'],
                           ['**تایپ کن، کپی نکن.** دست و چشم با هم `;` و `{` را یاد می‌گیرند.', '**Tippe, kopiere nicht.** Hand und Auge lernen `;` und `{` gemeinsam.', '**Type, do not copy.** Hand and eye learn `;` and `{` together.'],
                           ['**هر بار یک تغییر کوچک، و دوباره اجرا.** وقتی چیزی خراب شد، می‌دانی کدام تغییر بود.', '**Immer nur eine kleine Änderung, dann wieder ausführen.** Geht etwas kaputt, weißt du, welche Änderung es war.', '**One small change at a time, then run again.** When something breaks, you know which change it was.'],
                           ['**پیام خطا را بخوان.** اولین پیام، خط و خط پیش از آن ([[lesson:C.L02]]).', '**Lies die Fehlermeldung.** Die erste Meldung, ihre Zeile und die Zeile davor ([[lesson:C.L02]]).', '**Read the error message.** The first message, its line and the line before it ([[lesson:C.L02]]).'],
                           ['**با صدای بلند توضیح بده.** اگر نمی‌توانی چیزی را در دو جمله بگویی، هنوز آن را نفهمیده‌ای. تمرین‌های «توضیح بده» برای همین‌اند.', '**Erkläre laut.** Wenn du etwas nicht in zwei Sätzen sagen kannst, hast du es noch nicht verstanden. Dafür sind die „Erkläre“-Übungen da.', '**Explain out loud.** If you cannot say something in two sentences, you have not understood it yet. That is what the Explain exercises are for.'],
                           ['**با فاصله مرور کن.** خودسنجی هر درس را یک هفته بعد دوباره نگاه کن؛ چیزی که دوباره یادآوری شود، می‌ماند.', '**Wiederhole mit Abstand.** Schau dir den Selbstcheck jeder Lektion eine Woche später noch einmal an; was du wieder abrufst, bleibt.', '**Review with gaps.** Look at each lesson’s self-check again a week later; what you recall again, stays.']),
                    ]),
                    SEC('course', 'map', ['این دوره چطور کمکت می‌کند', 'Wie dir dieser Kurs hilft', 'How This Course Helps'], ['دوره', 'Kurs', 'Course'], [
                        P('هر درس همان مسیر را می‌رود، و هر بخش برای یکی از آن عادت‌هاست. توضیح طولانی کم است؛ به‌جایش کار می‌کنی:',
                          'Jede Lektion geht denselben Weg, und jeder Teil dient einer dieser Gewohnheiten. Lange Erklärungen gibt es wenig; stattdessen arbeitest du:',
                          'Every lesson follows the same path, and each part serves one of those habits. There is little long explanation; instead you work:'),
                        { type: 'table', head: [T('بخش', 'Teil', 'Part'), T('کارت در آن', 'Was du dort tust', 'What you do there')], rows: [
                            [T('پیش‌بینی کن', 'Sag voraus', 'Predict'), T('خروجی را پیش از اجرا بنویس', 'die Ausgabe vor dem Ausführen aufschreiben', 'write the output before running')],
                            [T('مثال کامل', 'Durchgerechnetes Beispiel', 'Worked example'), T('یک برنامهٔ کامل را گام به گام دنبال کن (walkthrough)', 'einem ganzen Programm Schritt für Schritt folgen (Walkthrough)', 'follow a whole program step by step (walkthrough)')],
                            [T('درون ماشین', 'In der Maschine', 'Inside the machine'), T('ببین ماشین با کد چه می‌کند', 'sehen, was die Maschine mit dem Code macht', 'see what the machine does with the code')],
                            [T('اشتباه‌های رایج', 'Typische Fehler', 'Common mistakes'), T('اشتباه را با پیام واقعی compiler بشناس', 'den Fehler an der echten Compiler-Meldung erkennen', 'recognize the mistake by its real compiler message')],
                            [T('تمرین و بساز', 'Übung und Bau es', 'Practice and Make'), T('بنویس، تست‌های صفحه بررسی می‌کنند', 'schreiben; die Tests der Seite prüfen', 'write; the page’s tests check it')],
                            [T('خودسنجی و پاسخ‌نامه', 'Selbstcheck und Lösungen', 'Self-check and Answer key'), T('پاسخ‌نامه را **پس از** تلاش خودت باز کن', 'die Lösungen erst **nach** deinem eigenen Versuch öffnen', 'open the key only **after** your own attempt')],
                        ] },
                        P('با کلید `/` هر جای دوره را جست‌وجو کن. پیشرفتت فقط در همین مرورگر ذخیره می‌شود.',
                          'Mit der Taste `/` durchsuchst du den ganzen Kurs. Dein Fortschritt wird nur in diesem Browser gespeichert.',
                          'Press `/` to search the whole course. Your progress is saved in this browser only.'),
                    ]),
                    SEC('tutor', 'bot', ['AI: معلم، نه حل‌کننده', 'KI: Lehrer, nicht Löser', 'AI: a Tutor, Not a Solver'], ['AI', 'KI', 'AI'], [
                        P('AI می‌تواند بهترین معلم خصوصی‌ات باشد، یا بهترین راه برای یاد نگرفتن. اگر پاسخ را از آن بگیری، تمرین حل شده ولی تو چیزی یاد نگرفته‌ای. پرامپت‌های این دوره همیشه می‌گویند: «پاسخ را ننویس؛ سرنخ بده و منتظر بمان.»',
                          'KI kann deine beste Privatlehrerin sein — oder der beste Weg, nichts zu lernen. Lässt du dir die Lösung geben, ist die Übung erledigt, aber du hast nichts gelernt. Die Prompts dieses Kurses sagen immer: „Schreib die Lösung nicht; gib Hinweise und warte.“',
                          'AI can be your best private tutor — or the best way not to learn. If you take the answer from it, the exercise is done but you learned nothing. This course’s prompts always say: “Do not write the solution; give hints and wait.”'),
                        { type: 'prompt', ref: 'AI.MASTER' },
                    ]),
                    SEC('transfer', 'arrow-left-right', ['اگر Python بلدی', 'Wenn du Python kannst', 'If You Know Python'], ['Python', 'Python', 'Python'], [
                        P('دانسته‌های قبلی کمک می‌کنند، ولی جاهایی گمراه می‌کنند. این جاها را از پیش بشناس:',
                          'Vorwissen hilft, führt aber an manchen Stellen in die Irre. Kenne diese Stellen vorher:',
                          'What you already know helps, but misleads in some places. Know those places in advance:'),
                        { type: 'table', head: [T('در Python', 'In Python', 'In Python'), T('در C', 'In C', 'In C'), T('کجای دوره', 'Wo im Kurs', 'Where in the course')], rows: [
                            [{ code: 'print()' }, T('`printf` خودش سر خط نمی‌رود', '`printf` beginnt keine neue Zeile von selbst', '`printf` does not start a new line by itself'), T('[[lesson:C.L01]]', '[[lesson:C.L01]]', '[[lesson:C.L01]]')],
                            [T('تورفتگی بلوک را می‌سازد', 'Einrückung bildet den Block', 'indentation makes the block'), T('`{ }` بلوک را می‌سازد؛ تورفتگی برای آدم‌هاست', '`{ }` bilden den Block; Einrückung ist für Menschen', '`{ }` make the block; indentation is for people'), T('[[lesson:C.L12]]', '[[lesson:C.L12]]', '[[lesson:C.L12]]')],
                            [T('متغیر نوع اعلام‌شده ندارد', 'Variablen ohne angegebenen Typ', 'variables have no declared type'), T('هر متغیر یک نوع ثابت دارد', 'jede Variable hat einen festen Typ', 'every variable has a fixed type'), T('[[lesson:C.L04]]', '[[lesson:C.L04]]', '[[lesson:C.L04]]')],
                            [T('list خودش بزرگ می‌شود', 'eine Liste wächst von selbst', 'a list grows by itself'), T('اندازهٔ array ثابت است', 'ein Array hat eine feste Größe', 'an array has a fixed size'), T('[[lesson:C.L24]]', '[[lesson:C.L24]]', '[[lesson:C.L24]]')],
                            [T('حافظه خودکار آزاد می‌شود', 'Speicher wird automatisch freigegeben', 'memory is freed automatically'), T('حافظه‌ای را که گرفته‌ای، خودت آزاد می‌کنی', 'Speicher, den du holst, gibst du selbst frei', 'memory you take, you free yourself'), T('[[lesson:C.L36]]', '[[lesson:C.L36]]', '[[lesson:C.L36]]')],
                        ] },
                    ]),
                    SEC('plan', 'calendar-days', ['برنامهٔ تو', 'Dein Plan', 'Your Plan'], ['برنامه', 'Plan', 'Plan'], [
                        LI(['**ریتم:** هفته‌ای سه یا چهار درس، هر بار بیست تا سی دقیقه، بهتر از یک روز چهار ساعته است.', '**Rhythmus:** drei oder vier Lektionen pro Woche zu je zwanzig bis dreißig Minuten sind besser als ein Tag mit vier Stunden.', '**Rhythm:** three or four lessons a week, twenty to thirty minutes each, beat one four-hour day.'],
                           ['**یک پروژهٔ کوچک برای خودت:** چیزی که دوستش داری، مثلاً یک ماشین‌حساب نمره یا یک بازی حدس عدد، و آن را با هر فصل بزرگ‌تر کن.', '**Ein kleines eigenes Projekt:** etwas, das du magst, etwa ein Notenrechner oder ein Zahlenratespiel, und lass es mit jedem Kapitel wachsen.', '**A small project of your own:** something you like, such as a grade calculator or a number-guessing game, and let it grow with each chapter.'],
                           ['**مرجع درست:** بخش C سایت cppreference.com، و روی Linux یا macOS دستور `man 3 printf`. کد کپی‌شده‌ای را که نمی‌فهمی، به کار نبر.', '**Die richtige Referenz:** der C-Teil von cppreference.com, und unter Linux oder macOS `man 3 printf`. Kopierten Code, den du nicht verstehst, benutzt du nicht.', '**The right reference:** the C section of cppreference.com, and on Linux or macOS `man 3 printf`. Do not use copied code you do not understand.'],
                           ['**کتاب، اگر خواستی:** *The C Programming Language* از Kernighan و Ritchie، و *C Programming: A Modern Approach* از K. N. King.', '**Bücher, wenn du willst:** *The C Programming Language* von Kernighan und Ritchie, und *C Programming: A Modern Approach* von K. N. King.', '**Books, if you want:** *The C Programming Language* by Kernighan and Ritchie, and *C Programming: A Modern Approach* by K. N. King.']),
                    ]),
                    { block: 'practice', content: [{ type: 'band', ref: 'C.O05.X01' }, { type: 'band', ref: 'C.O05.X02' }] },
                    { block: 'terms', content: [] }, { block: 'selfcheck', content: [] }, { block: 'key', content: [] },
                ],
                bands: [
                    { id: 'C.O05.X01', type: 'B.choice', title: T('انتخاب کن', 'Wähle aus', 'Choose'), items: [
                        { id: 'C.O05.X01.01', prompt: T('در یک تمرین گیر کرده‌ای. کدام کار بیشتر کمکت می‌کند یاد بگیری؟', 'Du steckst bei einer Übung fest. Was hilft dir am meisten beim Lernen?', 'You are stuck on an exercise. What helps you learn the most?'),
                          options: [OPT(false, ['پاسخ کامل را از AI بخواهم', 'die ganze Lösung von der KI holen', 'ask AI for the whole solution'], ['تمرین حل می‌شود، ولی بار بعد باز گیر می‌کنی.', 'Die Übung ist gelöst, aber beim nächsten Mal steckst du wieder fest.', 'The exercise gets solved, but next time you are stuck again.']),
                                    OPT(true, ['پیام خطا را بخوانم و از AI یک سرنخ بخواهم', 'die Fehlermeldung lesen und die KI um einen Hinweis bitten', 'read the error message and ask AI for one hint'], ['درست. خودت به پاسخ می‌رسی و راهش را هم یاد می‌گیری.', 'Richtig. Du kommst selbst zur Lösung und lernst den Weg dorthin.', 'Right. You reach the answer yourself and learn the way there.']),
                                    OPT(false, ['فوراً پاسخ‌نامه را باز کنم', 'sofort die Lösungen öffnen', 'open the answer key right away'], ['پاسخ‌نامه برای **پس از** تلاش است.', 'Die Lösungen sind für **nach** dem Versuch.', 'The key is for **after** your attempt.'])],
                          why: T('یاد گرفتن یعنی خودت به پاسخ برسی؛ سرنخ کمک می‌کند، پاسخ آماده نه.', 'Lernen heißt, selbst zur Lösung zu kommen; ein Hinweis hilft, eine fertige Lösung nicht.', 'Learning means reaching the answer yourself; a hint helps, a ready answer does not.') },
                        { id: 'C.O05.X01.02', prompt: T('ده خط تازه نوشته‌ای و برنامه دیگر compile نمی‌شود. بهترین کار بعدی؟', 'Du hast zehn neue Zeilen geschrieben, und das Programm kompiliert nicht mehr. Was ist der beste nächste Schritt?', 'You wrote ten new lines and the program no longer compiles. Best next step?'),
                          options: [OPT(false, ['همه را پاک کنم و از نو بنویسم', 'alles löschen und neu schreiben', 'delete everything and start over'], ['کار زیادی را دور می‌ریزی و نمی‌فهمی اشکال کجا بود.', 'Du wirfst viel Arbeit weg und erfährst nicht, wo der Fehler war.', 'You throw away a lot of work and never learn where the bug was.']),
                                    OPT(true, ['اولین پیام را بخوانم و همان را درست کنم', 'die erste Meldung lesen und genau das beheben', 'read the first message and fix just that'], ['درست. و دفعهٔ بعد، تکه‌های کوچک‌تر بنویس.', 'Richtig. Und schreib beim nächsten Mal kleinere Stücke.', 'Right. And next time, write smaller pieces.']),
                                    OPT(false, ['ده خط دیگر بنویسم شاید درست شود', 'noch zehn Zeilen schreiben, vielleicht wird es dann', 'write ten more lines, maybe it fixes itself'], ['خطاها روی هم جمع می‌شوند.', 'Die Fehler stapeln sich.', 'The errors pile up.'])],
                          why: T('یک تغییر کوچک در هر بار، و اولین پیام را اول.', 'Immer eine kleine Änderung, und die erste Meldung zuerst.', 'One small change at a time, and the first message first.') },
                        { id: 'C.O05.X01.03', prompt: T('Python بلدی. در C کدام انتظارت **غلط** از آب درمی‌آید؟', 'Du kannst Python. Welche Erwartung erweist sich in C als **falsch**?', 'You know Python. Which expectation turns out **wrong** in C?'),
                          options: [OPT(false, ['دستورها از بالا به پایین اجرا می‌شوند', 'Anweisungen laufen von oben nach unten', 'statements run from top to bottom'], ['این در هر دو زبان درست است.', 'Das stimmt in beiden Sprachen.', 'That is true in both languages.']),
                                    OPT(true, ['چاپ کردن خودش سر خط می‌رود', 'die Ausgabe beginnt von selbst eine neue Zeile', 'printing starts a new line by itself'], ['درست؛ `printf` فقط با `\\n` سر خط می‌رود (`M-01`).', 'Richtig; `printf` beginnt nur mit `\\n` eine neue Zeile (`M-01`).', 'Right; `printf` only starts a new line with `\\n` (`M-01`).']),
                                    OPT(false, ['عدد را می‌شود جمع زد', 'man kann Zahlen addieren', 'you can add numbers'], ['این در هر دو زبان درست است.', 'Das stimmt in beiden Sprachen.', 'That is true in both languages.'])],
                          why: T('`print` در Python سر خط می‌رود؛ `printf` در C نه.', '`print` in Python beginnt eine neue Zeile, `printf` in C nicht.', '`print` in Python starts a new line; `printf` in C does not.') },
                    ] },
                    { id: 'C.O05.X02', type: 'B.explain', title: T('برنامه‌ات را بنویس', 'Schreib deinen Plan', 'Write Your Plan'), items: [
                        { id: 'C.O05.X02.01', prompt: T('در سه جمله بنویس: هفته‌ای چند درس، چه روزهایی، و پروژهٔ کوچک خودت چیست.', 'Schreib in drei Sätzen: wie viele Lektionen pro Woche, an welchen Tagen, und was dein kleines eigenes Projekt ist.', 'Write in three sentences: how many lessons a week, on which days, and what your small project is.'),
                          model: T('هفته‌ای سه درس، شنبه و دوشنبه و چهارشنبه، هر بار نیم ساعت. هر یکشنبه خودسنجی هفتهٔ پیش را مرور می‌کنم. پروژه‌ام یک ماشین‌حساب نمره است که با هر فصل یک امکان تازه می‌گیرد.',
                                   'Drei Lektionen pro Woche, Montag, Mittwoch und Freitag, je eine halbe Stunde. Jeden Sonntag schaue ich den Selbstcheck der Vorwoche an. Mein Projekt ist ein Notenrechner, der mit jedem Kapitel eine neue Funktion bekommt.',
                                   'Three lessons a week, Monday, Wednesday and Friday, half an hour each. Every Sunday I review last week’s self-checks. My project is a grade calculator that gets one new feature with each chapter.'),
                          why: T('برنامهٔ کوچک و منظم، بهتر از برنامهٔ بزرگ و نامنظم.', 'Ein kleiner, regelmäßiger Plan ist besser als ein großer, unregelmäßiger.', 'A small, regular plan beats a big, irregular one.') },
                    ] },
                ],
            },
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

/* Interface strings of the site shell (header, drawer, rail, search, footer) and the home page, in the three
   languages. Extends NullpunktUI from site/ui.js. Technical terms stay in English (S.CH.08). */
(function (g) {
    'use strict';
    var add = {
        en: {
            tagline: 'C from zero', skip: 'Skip to content', home: 'Home', course: 'Course', path: 'Learning path',
            aria: { home: 'Nullpunkt — home', openMenu: 'Open the course menu', closeMenu: 'Close the course menu', menuDialog: 'Course menu',
                primaryNav: 'Sections of this page', drawerNav: 'Sections of this page', sectionNav: 'Section navigation', rail: 'Learning path',
                search: 'Search the course', toggleTheme: 'Switch between light and dark', language: 'Language', switchTo: 'Switch to {x}',
                repo: 'Source code on GitHub', crumbs: 'You are here' },
            github: 'GitHub', searchPlaceholder: 'Search lessons, terms, mistakes…', searchHint: 'Press / or Ctrl K anywhere',
            searchEmpty: 'Nothing found for “{q}”. Try fewer or shorter words.', searchTry: 'Try', searchCount: '{n} results',
            searchGlossary: 'Glossary', searchPlanned: 'Coming later', close: 'Close', version: 'Version', releaseNotes: 'Release notes',
            license: 'Content CC BY-SA 4.0 · Code MIT', soon: 'Coming soon', exercises: '{d} of {n} exercises', minutesShort: '{m} min',
            start: 'Start the course', continueAt: 'Continue: lesson {n}', searchCourse: 'Search the course',
            nav: { path: ['Learning path', 'Path'], method: ['How a lesson works', 'Method'], browser: ['C in your browser', 'Browser'], name: ['Why “Nullpunkt”', 'Name'] },
            hero: {
                eyebrow: 'Free · ISO C17 · three languages',
                lead: 'A self-study C course for first-year computer science students who start from zero. Every example runs in your browser — a real C compiler, on your own machine, with nothing sent anywhere.',
            },
            pathLead: 'A short orientation, then 13 chapters and 50 lessons, from your first printf to pointers, memory and files. Lessons appear here as they are written.',
            method: {
                lead: 'Every lesson follows the same path, so you always know where you are.',
                steps: [
                    ['predict', 'Predict', 'Read a short program and write down what it will print — before you run it.'],
                    ['example', 'Run', 'Run the worked example in the page, change it and run it again.'],
                    ['machine', 'Look inside', 'See what the machine does with your code: memory, addresses, the order of steps.'],
                    ['mistakes', 'Meet the mistakes', 'Every common mistake has a code, the real compiler message and an exercise.'],
                    ['make', 'Make', 'Build something small of your own, checked by tests in the page.'],
                ],
            },
            browser: {
                lead: 'The editor on every page is connected to XCC, a C compiler that runs as WebAssembly inside your browser.',
                points: [
                    ['wifi-off', 'Offline and private', 'Your code never leaves your computer. Open the course from disk and it still works.'],
                    ['monitor-smartphone', 'Two compilers, side by side', 'Each error is shown as gcc prints it on a PC and as the browser compiler prints it.'],
                    ['keyboard', 'Like a terminal', 'scanf waits for your input; a program that never ends can be stopped.'],
                ],
            },
            name: {
                lead: 'Nullpunkt [ˈnʊlˌpʊŋkt] is German for zero point — the origin of a coordinate system. The word holds three meanings that belong to this course:',
                points: [
                    ['From zero', 'The course assumes no background: not programming, not even the word identifier.'],
                    ['NULL', 'The null pointer — the address zero, where a C program must never write.'],
                    ['Counting from zero', 'In C, the first element of an array has index 0.'],
                ],
                close: 'It is a German word, because the course is made for students in Europe, but it reads well in English and Persian too, and it is not tied to C, so C++ will fit under the same name. The logo is the dotted zero that code fonts draw to tell 0 from O.',
            },
            footer: 'A free course by mohsen-1984. Made with XCC, CodeMirror and Lucide.',
        },
        de: {
            tagline: 'C von Null an', skip: 'Zum Inhalt springen', home: 'Startseite', course: 'Kurs', path: 'Lernpfad',
            aria: { home: 'Nullpunkt — Startseite', openMenu: 'Kursmenü öffnen', closeMenu: 'Kursmenü schließen', menuDialog: 'Kursmenü',
                primaryNav: 'Abschnitte dieser Seite', drawerNav: 'Abschnitte dieser Seite', sectionNav: 'Abschnittsnavigation', rail: 'Lernpfad',
                search: 'Den Kurs durchsuchen', toggleTheme: 'Zwischen hell und dunkel wechseln', language: 'Sprache', switchTo: 'Zu {x} wechseln',
                repo: 'Quellcode auf GitHub', crumbs: 'Du bist hier' },
            github: 'GitHub', searchPlaceholder: 'Lektionen, Begriffe, Fehler suchen…', searchHint: 'Drück / oder Strg K, wo du willst',
            searchEmpty: 'Nichts gefunden für „{q}“. Versuch es mit weniger oder kürzeren Wörtern.', searchTry: 'Probier', searchCount: '{n} Treffer',
            searchGlossary: 'Glossar', searchPlanned: 'Kommt später', close: 'Schließen', version: 'Version', releaseNotes: 'Versionshinweise',
            license: 'Inhalt CC BY-SA 4.0 · Code MIT', soon: 'Kommt bald', exercises: '{d} von {n} Übungen', minutesShort: '{m} Min.',
            start: 'Kurs beginnen', continueAt: 'Weiter: Lektion {n}', searchCourse: 'Den Kurs durchsuchen',
            nav: { path: ['Lernpfad', 'Pfad'], method: ['So funktioniert eine Lektion', 'Methode'], browser: ['C im Browser', 'Browser'], name: ['Warum „Nullpunkt“', 'Name'] },
            hero: {
                eyebrow: 'Kostenlos · ISO C17 · drei Sprachen',
                lead: 'Ein C-Kurs zum Selbstlernen für Informatik-Erstsemester, die bei null anfangen. Jedes Beispiel läuft in deinem Browser — ein echter C-Compiler auf deinem eigenen Rechner, ohne dass etwas verschickt wird.',
            },
            pathLead: 'Eine kurze Orientierung, dann 13 Kapitel und 50 Lektionen, vom ersten printf bis zu Pointern, Speicher und Dateien. Lektionen erscheinen hier, sobald sie geschrieben sind.',
            method: {
                lead: 'Jede Lektion folgt demselben Weg, damit du immer weißt, wo du bist.',
                steps: [
                    ['predict', 'Vorhersagen', 'Lies ein kurzes Programm und schreib auf, was es ausgibt — bevor du es ausführst.'],
                    ['example', 'Ausführen', 'Führ das Beispiel auf der Seite aus, ändere es und führ es erneut aus.'],
                    ['machine', 'Hineinschauen', 'Sieh, was die Maschine mit deinem Code macht: Speicher, Adressen, die Reihenfolge der Schritte.'],
                    ['mistakes', 'Fehler kennenlernen', 'Jeder typische Fehler hat einen Code, die echte Compiler-Meldung und eine Übung.'],
                    ['make', 'Bauen', 'Bau etwas Kleines selbst, geprüft von Tests auf der Seite.'],
                ],
            },
            browser: {
                lead: 'Der Editor auf jeder Seite ist mit XCC verbunden, einem C-Compiler, der als WebAssembly in deinem Browser läuft.',
                points: [
                    ['wifi-off', 'Offline und privat', 'Dein Code verlässt deinen Rechner nie. Öffne den Kurs von der Festplatte, und er funktioniert trotzdem.'],
                    ['monitor-smartphone', 'Zwei Compiler nebeneinander', 'Jeder Fehler wird so gezeigt, wie gcc ihn auf einem PC ausgibt, und so, wie der Browser-Compiler ihn ausgibt.'],
                    ['keyboard', 'Wie ein Terminal', 'scanf wartet auf deine Eingabe; ein Programm, das nicht endet, lässt sich stoppen.'],
                ],
            },
            name: {
                lead: 'Nullpunkt ist der Ursprung eines Koordinatensystems. Das Wort trägt drei Bedeutungen, die zu diesem Kurs gehören:',
                points: [
                    ['Von null an', 'Der Kurs setzt nichts voraus: kein Programmieren, nicht einmal das Wort Identifier.'],
                    ['NULL', 'Der Null-Pointer — die Adresse null, an die ein C-Programm nie schreiben darf.'],
                    ['Ab null zählen', 'In C hat das erste Element eines Arrays den Index 0.'],
                ],
                close: 'Ein deutsches Wort, weil der Kurs für Studierende in Europa gemacht ist; es liest sich aber auch auf Englisch und Persisch gut, und es ist nicht an C gebunden, sodass C++ später unter demselben Namen Platz hat. Das Logo ist die Null mit Punkt, mit der Code-Schriften 0 von O unterscheiden.',
            },
            footer: 'Ein freier Kurs von mohsen-1984. Gebaut mit XCC, CodeMirror und Lucide.',
        },
        fa: {
            tagline: 'C از صفر', skip: 'پرش به محتوا', home: 'خانه', course: 'دوره', path: 'مسیر یادگیری',
            aria: { home: 'Nullpunkt — خانه', openMenu: 'باز کردن منوی دوره', closeMenu: 'بستن منوی دوره', menuDialog: 'منوی دوره',
                primaryNav: 'بخش‌های این صفحه', drawerNav: 'بخش‌های این صفحه', sectionNav: 'ناوبری بخش‌ها', rail: 'مسیر یادگیری',
                search: 'جست‌وجو در دوره', toggleTheme: 'تعویض روشن و تیره', language: 'زبان', switchTo: 'تغییر به {x}',
                repo: 'کد منبع در GitHub', crumbs: 'اینجا هستی' },
            github: 'GitHub', searchPlaceholder: 'جست‌وجو در درس‌ها، اصطلاح‌ها، اشتباه‌ها…', searchHint: 'هر جای صفحه / یا Ctrl K را بزن',
            searchEmpty: 'برای «{q}» چیزی پیدا نشد. واژه‌های کمتر یا کوتاه‌تری امتحان کن.', searchTry: 'امتحان کن', searchCount: '{n} نتیجه',
            searchGlossary: 'واژه‌نامه', searchPlanned: 'بعداً می‌آید', close: 'بستن', version: 'نسخه', releaseNotes: 'یادداشت‌های نسخه',
            license: 'محتوا CC BY-SA 4.0 · کد MIT', soon: 'به‌زودی', exercises: '{d} از {n} تمرین', minutesShort: '{m} دقیقه',
            start: 'شروع دوره', continueAt: 'ادامه: درس {n}', searchCourse: 'جست‌وجو در دوره',
            nav: { path: ['مسیر یادگیری', 'مسیر'], method: ['هر درس چطور پیش می‌رود', 'روش'], browser: ['C در مرورگر', 'مرورگر'], name: ['چرا «Nullpunkt»', 'نام'] },
            hero: {
                eyebrow: 'رایگان · ISO C17 · سه زبان',
                lead: 'دورهٔ خودآموز C برای دانشجوی سال اول علوم کامپیوتر که از صفر شروع می‌کند. هر مثال در مرورگر خودت اجرا می‌شود — یک compiler واقعی C، روی کامپیوتر خودت، بی‌آنکه چیزی جایی فرستاده شود.',
            },
            pathLead: 'یک جهت‌یابی کوتاه، سپس 13 فصل و 50 درس، از اولین printf تا pointer، حافظه و فایل. هر درس که نوشته شود، اینجا می‌آید.',
            method: {
                lead: 'همهٔ درس‌ها یک مسیر را می‌روند تا همیشه بدانی کجای کاری.',
                steps: [
                    ['predict', 'پیش‌بینی', 'یک برنامهٔ کوتاه را بخوان و بنویس چه چاپ می‌کند — پیش از اجرا.'],
                    ['example', 'اجرا', 'مثال را همان‌جا در صفحه اجرا کن، تغییرش بده و دوباره اجرا کن.'],
                    ['machine', 'درون ماشین', 'ببین ماشین با کدت چه می‌کند: حافظه، آدرس‌ها، ترتیب گام‌ها.'],
                    ['mistakes', 'شناختن اشتباه‌ها', 'هر اشتباه رایج یک کد دارد، با پیام واقعی compiler و یک تمرین.'],
                    ['make', 'ساختن', 'چیز کوچکی از خودت بساز که تست‌های صفحه بررسی‌اش می‌کنند.'],
                ],
            },
            browser: {
                lead: 'ویرایشگر هر صفحه به XCC وصل است؛ یک compiler زبان C که به‌صورت WebAssembly درون مرورگرت اجرا می‌شود.',
                points: [
                    ['wifi-off', 'آفلاین و خصوصی', 'کدت هرگز از کامپیوترت بیرون نمی‌رود. دوره را از روی دیسک باز کن؛ باز هم کار می‌کند.'],
                    ['monitor-smartphone', 'دو compiler کنار هم', 'هر خطا همان‌طور نشان داده می‌شود که gcc روی PC چاپ می‌کند و همان‌طور که compiler مرورگر.'],
                    ['keyboard', 'مثل ترمینال', 'scanf منتظر ورودی تو می‌ماند و برنامه‌ای که تمام نمی‌شود را می‌توان متوقف کرد.'],
                ],
            },
            name: {
                lead: 'Nullpunkt (نول‌پونکت) در آلمانی یعنی «نقطهٔ صفر» — مبدأ یک دستگاه مختصات. این واژه سه معنا دارد که هر سه به این دوره مربوط‌اند:',
                points: [
                    ['از صفر', 'دوره هیچ پیش‌زمینه‌ای فرض نمی‌کند: نه برنامه‌نویسی، نه حتی واژهٔ identifier.'],
                    ['NULL', 'null pointer — آدرس صفر، جایی که برنامهٔ C هرگز نباید در آن بنویسد.'],
                    ['شمارش از صفر', 'در C، اولین عنصر یک array اندیس 0 دارد.'],
                ],
                close: 'واژه‌ای آلمانی است، چون دوره برای دانشجوی اروپا ساخته شده، ولی در انگلیسی و فارسی هم خوب خوانده می‌شود؛ و به C گره نخورده، پس C++ هم بعداً زیر همین نام جا می‌گیرد. نشان دوره همان صفرِ نقطه‌دار است که قلم‌های کد برای جدا کردن 0 از O می‌کشند.',
            },
            footer: 'دوره‌ای رایگان از mohsen-1984. ساخته‌شده با XCC، CodeMirror و Lucide.',
        },
    };
    Object.keys(add).forEach(function (l) { g.NullpunktUI[l].site = add[l]; });
})(typeof window !== 'undefined' ? window : globalThis);

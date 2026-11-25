/* S00P — AI tutor prompts (S00-core: Prompts; S.PRM.01–03). Prompt text is plain English, at most six lines except the
   master prompt. {lang} is replaced with the page language's name in English. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.files.S00P = {
        id: 'S00P', kind: 'prompts', version: '0.1.0',
        prompts: [
            {
                id: 'AI.MASTER', icon: 'bot', waits: true,
                name: { en: 'Master prompt', fa: 'پرامپت مادر', de: 'Grund-Prompt' },
                text: 'You are my C programming tutor. I am a first-year computer science student and a complete beginner.\n' +
                    'Rules:\n' +
                    '- Explain in {lang}, but keep all technical terms and all code in English.\n' +
                    '- Use only C17 features I have already learned. Ask me which lesson I am on if you are not sure.\n' +
                    '- Never write the solution to my exercise. Give hints, one step at a time, and wait for my answer.\n' +
                    '- When I show you an error message, help me read it: where, what, why. Do not just fix it.\n' +
                    '- Point out undefined behavior and unsafe input every time you see it.\n' +
                    '- Keep your replies short.',
                guide: {
                    does: { fa: 'دستیار را یک‌بار برای کل دوره تنظیم می‌کند: به زبان تو توضیح می‌دهد، از درس تو جلوتر نمی‌رود و پاسخ تمرین را نمی‌نویسد.', de: 'Stellt den Assistenten einmal für den ganzen Kurs ein: Er erklärt in deiner Sprache, geht nicht über deine Lektion hinaus und schreibt keine Lösungen.', en: 'Sets up the assistant once for the whole course: it explains in your language, stays within your lesson and never writes solutions.' },
                    give: { fa: 'همین متن را در اولین پیام یک گفت‌وگوی تازه بفرست.', de: 'Schick genau diesen Text als erste Nachricht in einem neuen Chat.', en: 'Send this exact text as the first message of a new chat.' },
                    output: { fa: 'یک پاسخ کوتاه که قاعده‌ها را تأیید می‌کند و می‌پرسد در کدام درس هستی.', de: 'Eine kurze Antwort, die die Regeln bestätigt und fragt, in welcher Lektion du bist.', en: 'A short reply that confirms the rules and asks which lesson you are on.' },
                },
            },
            {
                id: 'AI-1', icon: 'octagon-x', waits: true,
                name: { en: 'Read my error', fa: 'خواندن خطا', de: 'Fehler lesen' },
                text: 'I am on lesson {lesson} of my C course. My program does not compile.\n' +
                    'I will send my code and the full error message.\n' +
                    'Do not fix the code. Ask me where the compiler points, then what it says, then why.\n' +
                    'Wait for my answer after each question.',
                guide: {
                    does: { fa: 'کمکت می‌کند پیام خطا را خودت بخوانی، پله‌پله، به‌جای اینکه کد درست‌شده را بگیری.', de: 'Hilft dir, die Fehlermeldung selbst zu lesen, Schritt für Schritt, statt fertigen Code zu bekommen.', en: 'Helps you read the error message yourself, step by step, instead of getting fixed code.' },
                    give: { fa: 'بعد از این پرامپت، کد کاملت و پیام کامل compiler را بفرست.', de: 'Schick nach diesem Prompt deinen ganzen Code und die vollständige Compiler-Meldung.', en: 'After this prompt, send your whole code and the complete compiler message.' },
                    output: { fa: 'سه پرسش، یکی‌یکی: کجا، چه، چرا.', de: 'Drei Fragen, eine nach der anderen: wo, was, warum.', en: 'Three questions, one at a time: where, what, why.' },
                },
            },
            {
                id: 'AI-2', icon: 'bug', waits: true,
                name: { en: 'Error quiz', fa: 'مسابقهٔ خطا', de: 'Fehler-Quiz' },
                text: 'I am on lesson {lesson} of my C course. Quiz me on compiler messages.\n' +
                    'Show me one short C program, at most 8 lines, using only printf, with exactly one mistake.\n' +
                    'Ask me first: will it compile? Then: which line will gcc point to, and what will it say?\n' +
                    'Wait for my answer after each question. Then show me the real gcc message and explain it.',
                guide: {
                    does: { fa: 'برنامهٔ کوتاهی با یک اشتباه می‌سازد و از تو می‌خواهد پیام compiler را پیش از دیدنش حدس بزنی.', de: 'Erstellt ein kurzes Programm mit einem Fehler und lässt dich die Compiler-Meldung vorhersagen, bevor du sie siehst.', en: 'Makes a short program with one mistake and asks you to predict the compiler message before you see it.' },
                    give: { fa: 'فقط همین پرامپت؛ بعد به پرسش‌ها جواب بده.', de: 'Nur diesen Prompt; danach beantwortest du die Fragen.', en: 'Just this prompt; then answer the questions.' },
                    output: { fa: 'یک برنامه و دو پرسش، یکی‌یکی؛ بعد پیام واقعی gcc.', de: 'Ein Programm und zwei Fragen, eine nach der anderen; danach die echte gcc-Meldung.', en: 'One program and two questions, one at a time; then the real gcc message.' },
                },
            },
            {
                id: 'AI-3', icon: 'printer', waits: true,
                name: { en: 'printf drill', fa: 'تمرین printf', de: 'printf-Training' },
                text: 'I am on lesson {lesson} of my C course. Drill me on printf.\n' +
                    'Write five printf statements that use only text, %d, the escape sequences backslash-n, backslash-t,\n' +
                    'backslash-backslash and backslash-quote, and calculations with plus, minus and times.\n' +
                    'Show them one at a time and ask me for the exact output. Wait for my answer,\n' +
                    'then tell me if I am right and why, before you show the next one.',
                guide: {
                    does: { fa: 'پنج statement کوتاه `printf` نشانت می‌دهد و می‌خواهد خروجی دقیق هر کدام را بگویی.', de: 'Zeigt dir fünf kurze `printf`-Statements und lässt dich die genaue Ausgabe jedes einzelnen sagen.', en: 'Shows you five short `printf` statements and asks you for the exact output of each.' },
                    give: { fa: 'فقط همین پرامپت؛ جواب‌ها را خودت بنویس، بدون اجرا.', de: 'Nur diesen Prompt; schreib deine Antworten selbst, ohne auszuführen.', en: 'Just this prompt; write your answers yourself, without running anything.' },
                    output: { fa: 'یک statement در هر نوبت و بازخورد کوتاه پس از جوابت.', de: 'Ein Statement pro Runde und eine kurze Rückmeldung nach deiner Antwort.', en: 'One statement per turn and short feedback after your answer.' },
                },
            },
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

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
        ],
    };
})(typeof window !== 'undefined' ? window : globalThis);

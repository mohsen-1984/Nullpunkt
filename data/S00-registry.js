/* S00R — registries shared by every series: blocks, exercise types, note kinds, unit types, mistake dimensions,
   sources and contrast types, and the icon of each (docs/rules/S00-core.md, S00-assets.md). Titles are defined
   only here (S.HDG.05). Icon names are Lucide 1.80.0 (S.AST.01); one icon, one meaning (S.ICN.01). */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    N.files.S00R = {
        id: 'S00R', kind: 'registry', version: '0.1.0',

        // short: the label in the lesson's section navigation (header row, dot-nav)
        blocks: {
            why:       { icon: 'compass', title: { fa: 'چرا این درس', de: 'Warum diese Lektion', en: 'Why This Lesson' }, short: { fa: 'چرا', de: 'Warum', en: 'Why' } },
            cando:     { icon: 'target', title: { fa: 'توانایی تازه', de: 'Das kannst du danach', en: 'Can-do' }, short: { fa: 'هدف', de: 'Ziele', en: 'Can-do' } },
            prior:     { icon: 'milestone', title: { fa: 'پیش‌نیاز', de: 'Bevor du anfängst', en: 'Before You Start' }, short: { fa: 'پیش‌نیاز', de: 'Vorwissen', en: 'Before' } },
            predict:   { icon: 'eye', title: { fa: 'پیش‌بینی کن', de: 'Sag voraus', en: 'Predict' }, short: { fa: 'پیش‌بینی', de: 'Vorhersage', en: 'Predict' } },
            example:   { icon: 'play', title: { fa: 'مثال کامل', de: 'Durchgerechnetes Beispiel', en: 'Worked Example' }, short: { fa: 'مثال', de: 'Beispiel', en: 'Example' } },
            machine:   { icon: 'cpu', title: { fa: 'درون ماشین', de: 'In der Maschine', en: 'Inside the Machine' }, short: { fa: 'ماشین', de: 'Maschine', en: 'Machine' } },
            rule:      { icon: 'ruler', title: { fa: 'قاعده', de: 'Die Regel', en: 'The Rule' }, short: { fa: 'قاعده', de: 'Regel', en: 'Rule' } },
            trace:     { icon: 'table-2', title: { fa: 'ردیابی', de: 'Tracing', en: 'Trace Table' }, short: { fa: 'ردیابی', de: 'Tracing', en: 'Trace' } },
            memory:    { icon: 'memory-stick', title: { fa: 'نقشهٔ حافظه', de: 'Speicherbild', en: 'Memory Map' }, short: { fa: 'حافظه', de: 'Speicher', en: 'Memory' } },
            mistakes:  { icon: 'triangle-exclamation-point', title: { fa: 'اشتباه‌های رایج', de: 'Typische Fehler', en: 'Common Mistakes' }, short: { fa: 'اشتباه‌ها', de: 'Stolperfallen', en: 'Mistakes' } },
            errors:    { icon: 'octagon-x', title: { fa: 'درمانگاه خطا', de: 'Fehlersprechstunde', en: 'Error Clinic' }, short: { fa: 'خطاها', de: 'Meldungen', en: 'Errors' } },
            fuller:    { icon: 'trending-up', title: { fa: 'قاعدهٔ کامل‌تر', de: 'Die genauere Regel', en: 'The Fuller Rule' }, short: { fa: 'دقیق‌تر', de: 'Genauer', en: 'Fuller' } },
            standard:  { icon: 'scroll-text', title: { fa: 'استاندارد و سکو', de: 'Standard und Plattform', en: 'Standard & Platform' }, short: { fa: 'استاندارد', de: 'Standard', en: 'Standard' } },
            notyet:    { icon: 'footprints', title: { fa: 'هنوز نگفته‌ایم', de: 'Noch nicht gesagt', en: 'Not Yet Said' }, short: { fa: 'بعداً', de: 'Später', en: 'Later' } },
            practice:  { icon: 'pencil', title: { fa: 'تمرین', de: 'Übung', en: 'Practice' }, short: { fa: 'تمرین', de: 'Übung', en: 'Practice' } },
            make:      { icon: 'hammer', title: { fa: 'بساز', de: 'Bau es', en: 'Make' }, short: { fa: 'بساز', de: 'Bauen', en: 'Make' } },
            onpc:      { icon: 'laptop', title: { fa: 'روی کامپیوتر خودت', de: 'Auf deinem Rechner', en: 'On Your PC' }, short: { fa: 'روی PC', de: 'Am PC', en: 'On PC' } },
            exam:      { icon: 'graduation-cap', title: { fa: 'سبک امتحان', de: 'Prüfungsstil', en: 'Exam Style' }, short: { fa: 'امتحان', de: 'Prüfung', en: 'Exam' } },
            ai:        { icon: 'bot', title: { fa: 'تمرین با هوش مصنوعی', de: 'Üben mit KI', en: 'AI Practice' }, short: { fa: 'AI', de: 'KI', en: 'AI' } },
            terms:     { icon: 'book-a', title: { fa: 'اصطلاح‌های درس', de: 'Begriffe', en: 'Terms' }, short: { fa: 'اصطلاح‌ها', de: 'Begriffe', en: 'Terms' } },
            selfcheck: { icon: 'square-check', title: { fa: 'خودسنجی', de: 'Selbstcheck', en: 'Self-check' }, short: { fa: 'خودسنجی', de: 'Selbstcheck', en: 'Check' } },
            // section: a block whose heading, short label and icon come from the lesson's data (orientation lessons)
            section:   { icon: 'book-open', title: { fa: 'بخش', de: 'Abschnitt', en: 'Section' }, short: { fa: 'بخش', de: 'Abschnitt', en: 'Section' } },
            key:       { icon: 'key-round', title: { fa: 'پاسخ‌نامه', de: 'Lösungen', en: 'Answer Key' }, short: { fa: 'پاسخ‌ها', de: 'Lösungen', en: 'Key' } },
        },

        // rank orders the bands of a lesson (S.BND.01); auto = checked by running tests
        bandTypes: {
            'B.choice':   { rank: 1, auto: true, icon: 'list-checks', title: { fa: 'انتخاب کن', de: 'Wähle aus', en: 'Choose' } },
            'B.predict':  { rank: 1, auto: true, icon: 'eye', title: { fa: 'پیش‌بینی خروجی', de: 'Ausgabe vorhersagen', en: 'Predict the Output' } },
            'B.trace':    { rank: 1, auto: true, icon: 'list-ordered', title: { fa: 'ردیابی', de: 'Tracing', en: 'Trace' } },
            'B.parsons':  { rank: 1, auto: true, icon: 'arrow-down-wide-narrow', title: { fa: 'مرتب‌سازی خط‌ها', de: 'Zeilen ordnen', en: 'Put the Lines in Order' } },
            'B.complete': { rank: 2, auto: true, icon: 'puzzle', title: { fa: 'کامل کن', de: 'Vervollständige', en: 'Complete' } },
            'B.fix':      { rank: 2, auto: true, icon: 'wrench', title: { fa: 'درستش کن', de: 'Repariere', en: 'Fix It' } },
            'B.review':   { rank: 2, auto: true, icon: 'scan-search', title: { fa: 'بازبینی کد', de: 'Code-Review', en: 'Code Review' } },
            'B.modify':   { rank: 3, auto: true, icon: 'git-compare-arrows', title: { fa: 'تغییر بده', de: 'Ändere', en: 'Modify' } },
            'B.write':    { rank: 4, auto: true, icon: 'code-xml', title: { fa: 'بنویس', de: 'Schreibe', en: 'Write' } },
            'B.explain':  { rank: 5, auto: false, icon: 'message-circle-question-mark', title: { fa: 'توضیح بده', de: 'Erkläre', en: 'Explain' } },
        },

        noteKinds: {
            simplification: { icon: 'footprints', title: { fa: 'فعلاً ساده گفته‌ایم', de: 'Vorerst vereinfacht', en: 'Simplified for now' } },
            platform: { icon: 'monitor-smartphone', title: { fa: 'تفاوت سکو', de: 'Plattformunterschied', en: 'Platform difference' } },
            c23: { icon: 'sparkles', title: { fa: 'ویژگی C23', de: 'C23-Feature', en: 'C23 feature' } },
            ub: { icon: 'triangle-dashed', title: { fa: 'رفتار تعریف‌نشده', de: 'Undefiniertes Verhalten', en: 'Undefined behavior' } },
            exam: { icon: 'graduation-cap', title: { fa: 'در امتحان', de: 'In der Prüfung', en: 'In the exam' } },
        },

        unitTypes: {
            lesson: { icon: 'book-open', label: { fa: 'درس', de: 'Lektion', en: 'Lesson' } },
            review: { icon: 'rotate-ccw', label: { fa: 'مرور', de: 'Wiederholung', en: 'Review' } },
            appendix: { icon: 'paperclip', label: { fa: 'ضمیمه', de: 'Anhang', en: 'Appendix' } },
            prose: { icon: 'file-text', label: { fa: 'متن', de: 'Text', en: 'Text' } },
        },

        dimensions: {
            M: { title: { fa: 'تصور غلط', de: 'Fehlvorstellung', en: 'Misconception' }, intent: ['ok'] },
            E: { title: { fa: 'compile error', de: 'Compile-Fehler', en: 'Compile Error' }, intent: ['compile-error'] },
            W: { title: { fa: 'هشدار', de: 'Warnung', en: 'Warning' }, intent: ['warning'] },
            R: { title: { fa: 'خطای زمان اجرا', de: 'Laufzeitfehler', en: 'Runtime Error' }, intent: ['runtime-error'] },
            U: { title: { fa: 'رفتار تعریف‌نشده', de: 'Undefiniertes Verhalten', en: 'Undefined Behavior' }, intent: ['ub'] },
            L: { title: { fa: 'خطای منطقی', de: 'Logikfehler', en: 'Logic Bug' }, intent: ['ok'] },
            S: { title: { fa: 'امنیت', de: 'Sicherheit', en: 'Security' }, intent: ['ok', 'ub', 'runtime-error'] },
            P: { title: { fa: 'قابلیت حمل', de: 'Portabilität', en: 'Portability' }, intent: ['platform'] },
            Y: { title: { fa: 'سبک', de: 'Stil', en: 'Style' }, intent: ['ok'] },
        },

        sources: {
            'SRC.math': { transfer: true, title: { fa: 'ریاضی', de: 'Mathematik', en: 'Math' } },
            'SRC.language': { transfer: true, title: { fa: 'زبان روزمره', de: 'Alltagssprache', en: 'Everyday language' } },
            'SRC.prior': { transfer: true, title: { fa: 'زبان برنامه‌نویسی قبلی', de: 'Frühere Programmiersprache', en: 'Earlier programming language' } },
            'SRC.developmental': { transfer: false, title: { fa: 'رشدی', de: 'Entwicklungsbedingt', en: 'Developmental' } },
        },

        contrastTypes: {
            'CT.same': { title: { fa: 'هم‌معنا', de: 'Gleiche Bedeutung', en: 'True carryover' } },
            'CT.false': { title: { fa: 'هم‌شکل ناهم‌معنا', de: 'Falscher Freund', en: 'False friend' } },
            'CT.form': { title: { fa: 'ناهم‌شکل هم‌معنا', de: 'Andere Form', en: 'Different form' } },
            'CT.new': { title: { fa: 'تازه', de: 'Neu', en: 'New' } },
        },

        // icons used by the page itself (buttons, status); the rest come from the registries above
        uiIcons: ['play', 'square', 'undo-2', 'copy', 'keyboard', 'timer', 'circle-check', 'circle-x', 'languages',
            'sun-moon', 'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'lightbulb', 'key-round', 'x', 'menu',
            'octagon-x', 'triangle-exclamation-point',
            // the site shell (site/chrome.js, course.js, search.js, home.js)
            'search', 'sun', 'moon', 'code-xml', 'house', 'circle', 'circle-dot', 'circle-dashed', 'book-open', 'clock',
            'wifi-off', 'monitor-smartphone',
            // orientation lessons (site/lesson.js: myth, terminal, asm)
            'circle-question-mark', 'terminal', 'file-code'],

        // the alphabet for exercise letters, per language (S.TYP.11); taken from position, never stored
        letters: {
            fa: ['الف', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش'],
            de: 'abcdefghijklmnop'.split(''),
            en: 'abcdefghijklmnop'.split(''),
        },
    };
})(typeof window !== 'undefined' ? window : globalThis);

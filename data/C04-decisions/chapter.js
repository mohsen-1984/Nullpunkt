/* C04 — the register of chapter 4: Decisions (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C04 = {
        id: "C04", title: {"fa": "تصمیم", "de": "Entscheidungen", "en": "Decisions"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L11", status: "written",
                title: {"fa": "مقایسه و مقدار درست و نادرست", "de": "Vergleiche und Wahrheitswerte", "en": "Comparisons & Truth"},
                minutes: 25, prereq: ["C.L10"], introduces: ["K.op-eq", "K.op-ne", "K.op-lt", "K.op-le", "K.op-gt", "K.op-ge", "K.h-stdbool", "K.bool", "K.true", "K.false"],
                topics: [{ id: "control", stage: 1 }, { id: "types", stage: 5 }],
                cando: [
                    { fa: "بتوانی با `==`، `!=`، `<`، `<=`، `>` و `>=` دو مقدار را مقایسه کنی و پاسخ را چاپ کنی.", de: "Du kannst zwei Werte mit `==`, `!=`, `<`, `<=`, `>` und `>=` vergleichen und die Antwort ausgeben.", en: "You can compare two values with `==`, `!=`, `<`, `<=`, `>` and `>=` and print the answer." },
                    { fa: "بتوانی پیش‌بینی کنی یک مقایسه 1 می‌دهد یا 0، حتی وقتی در حساب به کار رفته باشد.", de: "Du kannst vorhersagen, ob ein Vergleich 1 oder 0 liefert, auch wenn er in einer Rechnung steht.", en: "You can predict whether a comparison gives 1 or 0, even when it is used in a calculation." },
                    { fa: "بتوانی پاسخ یک مقایسه را در یک `bool` نگه داری و بدانی `bool` فقط 0 یا 1 نگه می‌دارد.", de: "Du kannst die Antwort eines Vergleichs in einem `bool` festhalten und weißt, dass ein `bool` nur 0 oder 1 hält.", en: "You can keep the answer of a comparison in a `bool` and know that a `bool` holds only 0 or 1." },
                    { fa: "بتوانی دو نویسه را با کدشان مقایسه کنی و بگویی چرا `'Z' < 'a'` درست است.", de: "Du kannst zwei Zeichen nach ihrem Code vergleichen und sagen, warum `'Z' < 'a'` wahr ist.", en: "You can compare two characters by their code and say why `'Z' < 'a'` is true." },
                    { fa: "بتوانی توضیح دهی چرا دو `double` را با `==` مقایسه نمی‌کنی و پول را به سنت در `int` نگه می‌داری.", de: "Du kannst erklären, warum du zwei `double` nicht mit `==` vergleichst und Geld in Cent in einem `int` hältst.", en: "You can explain why you do not compare two `double` values with `==`, and keep money in cents in an `int`." },
                ] },
            { id: "C.L12", status: "written",
                title: {"fa": "if و else", "de": "if und else", "en": "if and else"},
                minutes: 25, prereq: ["C.L11"], introduces: ["K.if", "K.else"],
                topics: [{ id: "control", stage: 2 }, { id: "io", stage: 6 }],
                cando: [
                    { fa: "بتوانی با `if` و `else` میان دو راه یکی را برگزینی و پیش‌بینی کنی کدام بلوک اجرا می‌شود.", de: "Du kannst mit `if` und `else` einen von zwei Wegen wählen und vorhersagen, welcher Block läuft.", en: "You can choose one of two ways with `if` and `else` and predict which block runs." },
                    { fa: "بتوانی زنجیرهٔ `else if` بنویسی و شرط‌ها را به ترتیب درست، از تنگ به گسترده، بچینی.", de: "Du kannst eine `else if`-Kette schreiben und die Bedingungen in die richtige Reihenfolge bringen, von eng nach weit.", en: "You can write an `else if` chain and put the conditions in the right order, from narrow to broad." },
                    { fa: "بتوانی مقدار بازگشتی `scanf` را با `if` بررسی کنی و ورودی بد را رد کنی.", de: "Du kannst den Rückgabewert von `scanf` mit `if` prüfen und schlechte Eingaben zurückweisen.", en: "You can check the return value of `scanf` with `if` and reject bad input." },
                    { fa: "بتوانی توضیح دهی چرا بدنهٔ `if` همیشه در `{ }` می‌آید و پس از `if (…)` هیچ `;` نمی‌آید.", de: "Du kannst erklären, warum der Rumpf von `if` immer in `{ }` steht und nach `if (…)` kein `;` kommt.", en: "You can explain why the body of `if` always goes in `{ }` and no `;` comes after `if (…)`." },
                    { fa: "بتوانی `if (x = 5)` را در کد پیدا کنی و بگویی چرا همیشه درست است.", de: "Du kannst `if (x = 5)` im Code finden und sagen, warum es immer wahr ist.", en: "You can spot `if (x = 5)` in code and say why it is always true." },
                ] },
            { id: "C.L13", status: "written",
                title: {"fa": "ترکیب شرط‌ها", "de": "Bedingungen verknüpfen", "en": "Combining Conditions"},
                minutes: 25, prereq: ["C.L12"], introduces: ["K.op-and", "K.op-or", "K.op-not", "K.op-cond"],
                topics: [{ id: "control", stage: 3 }, { id: "io", stage: 7 }],
                cando: [
                    { fa: "بتوانی با `&&`، `||` و `!` چند پرسش را در یک شرط به هم ببندی و مقدارش را پیش‌بینی کنی.", de: "Du kannst mit `&&`, `||` und `!` mehrere Fragen in einer Bedingung verbinden und ihren Wert vorhersagen.", en: "You can tie several questions into one condition with `&&`, `||` and `!` and predict its value." },
                    { fa: "بتوانی «میان 1 و 5» و «بیرون از 1 تا 5» را درست بنویسی.", de: "Du kannst „zwischen 1 und 5“ und „außerhalb von 1 bis 5“ richtig schreiben.", en: "You can write \"between 1 and 5\" and \"outside 1 to 5\" correctly." },
                    { fa: "بتوانی short-circuit را توضیح دهی و با آن جلوی تقسیم بر صفر را بگیری.", de: "Du kannst die Kurzschlussauswertung erklären und mit ihr eine Division durch null verhindern.", en: "You can explain short-circuit evaluation and use it to prevent a division by zero." },
                    { fa: "بتوانی ورودی را در دو گام بسنجی: عدد رسید، و در بازهٔ مجاز است.", de: "Du kannst Eingaben in zwei Schritten prüfen: Eine Zahl kam an, und sie liegt im erlaubten Bereich.", en: "You can check input in two steps: a number arrived, and it is in the allowed range." },
                    { fa: "بتوانی با `?:` میان دو مقدار یکی را برگزینی.", de: "Du kannst mit `?:` einen von zwei Werten wählen.", en: "You can choose one of two values with `?:`." },
                ] },
            { id: "C.L14", status: "planned", title: {"fa": "switch", "de": "switch", "en": "switch"} },
        ],
        review: { id: "C04.REV", status: "planned" },
    };
})(typeof window !== "undefined" ? window : globalThis);

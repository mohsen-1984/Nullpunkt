/* C03 — the register of chapter 3: Input (data, S00-schema: chapter register).
   Titles, order, minutes and can-do statements of its lessons and its review unit; the lessons themselves are
   one file each in this folder. */
(function (g) {
    var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
    (N.chapters = N.chapters || {}).C03 = {
        id: "C03", title: {"fa": "ورودی", "de": "Eingabe", "en": "Input"}, langStatus: { fa: "draft", de: "draft", en: "draft" },
        lessons: [
            { id: "C.L09", status: "written",
                title: {"fa": "خواندن ورودی با scanf", "de": "Eingabe mit scanf", "en": "Reading Input with scanf"},
                minutes: 25, prereq: ["C.L08"], introduces: ["K.fn-scanf", "K.op-addr", "K.fmt-lf"],
                topics: [{ id: "io", stage: 4 }],
                cando: [
                    { fa: "بتوانی با `scanf(\"%d\", &count)` یک عدد صحیح بخوانی و در حساب به کار ببری.", de: "Du kannst mit `scanf(\"%d\", &count)` eine ganze Zahl lesen und mit ihr rechnen.", en: "You can read a whole number with `scanf(\"%d\", &count)` and use it in a calculation." },
                    { fa: "بتوانی عدد اعشاری را با `%lf` در یک `double` بخوانی و بدانی چرا `%f` اینجا غلط است.", de: "Du kannst eine Kommazahl mit `%lf` in ein `double` lesen und weißt, warum `%f` hier falsch ist.", en: "You can read a decimal number into a `double` with `%lf` and know why `%f` is wrong here." },
                    { fa: "بتوانی توضیح دهی چرا `scanf` به `&` نیاز دارد: آدرس جعبه را می‌گیرد، نه مقدارش را.", de: "Du kannst erklären, warum `scanf` das `&` braucht: Es bekommt die Adresse des Kastens, nicht seinen Wert.", en: "You can explain why `scanf` needs `&`: it gets the address of the box, not its value." },
                    { fa: "بتوانی پیش‌بینی کنی `scanf` با فاصله‌ها و سطرهای خالیِ میان عددها چه می‌کند و کجا می‌ایستد.", de: "Du kannst vorhersagen, was `scanf` mit Leerzeichen und Leerzeilen zwischen Zahlen macht und wo es aufhört.", en: "You can predict what `scanf` does with spaces and blank lines between numbers, and where it stops." },
                    { fa: "بتوانی پیش از خواندن، پرسش را با `printf` چاپ کنی و بدانی متن پرسش در `scanf` جایی ندارد.", de: "Du kannst vor dem Lesen die Frage mit `printf` ausgeben und weißt, dass der Fragetext nicht in `scanf` gehört.", en: "You can print the question with `printf` before reading, and know that the question text does not go into `scanf`." },
                ] },
            { id: "C.L10", status: "written",
                title: {"fa": "وقتی ورودی خراب است", "de": "Wenn die Eingabe schiefgeht", "en": "When Input Goes Wrong"},
                minutes: 25, prereq: ["C.L09"], introduces: ["K.fn-getchar", "K.eof"],
                topics: [{ id: "io", stage: 5 }],
                cando: [
                    { fa: "بتوانی بگویی `scanf` چه چیزی برمی‌گرداند و آن را چاپ کنی تا ببینی چند مقدار خوانده شد.", de: "Du kannst sagen, was `scanf` zurückgibt, und es ausgeben, um zu sehen, wie viele Werte gelesen wurden.", en: "You can say what `scanf` returns and print it to see how many values were read." },
                    { fa: "بتوانی پیش‌بینی کنی وقتی ورودی با format جور نیست، متغیر کدام مقدار را نگه می‌دارد.", de: "Du kannst vorhersagen, welchen Wert eine Variable behält, wenn die Eingabe nicht zum Format passt.", en: "You can predict which value a variable keeps when the input does not fit the format." },
                    { fa: "بتوانی با `getchar` یک نویسه بخوانی و بدانی چرا `int` برمی‌گرداند و در پایان ورودی `EOF` می‌دهد.", de: "Du kannst mit `getchar` ein Zeichen lesen und weißt, warum es `int` zurückgibt und am Ende der Eingabe `EOF` liefert.", en: "You can read one character with `getchar` and know why it returns `int` and gives `EOF` at the end of the input." },
                    { fa: "بتوانی پس از یک عدد، با `\" %c\"` یک حرف بخوانی و نقش آن فاصله را توضیح دهی.", de: "Du kannst nach einer Zahl mit `\" %c\"` einen Buchstaben lesen und die Rolle des Leerzeichens erklären.", en: "You can read a letter after a number with `\" %c\"` and explain what the space does." },
                    { fa: "بدانی چرا برنامه نباید به ورودی اعتماد کند، و به متغیرها مقدار شروع امن بدهی.", de: "Du weißt, warum ein Programm seiner Eingabe nicht trauen darf, und gibst Variablen einen sicheren Startwert.", en: "You know why a program must not trust its input, and give variables a safe starting value." },
                ] },
        ],
        review: { id: "C03.REV", status: "written", minutes: 30,
            cando: [
                { fa: "بتوانی برنامه‌ای بنویسی که چند مقدار بپرسد، بخواند و با آن‌ها کار کند.", de: "Du kannst ein Programm schreiben, das mehrere Werte erfragt, liest und mit ihnen arbeitet.", en: "You can write a program that asks for several values, reads them and works with them." },
                { fa: "بتوانی برای هر نوع در `scanf` تبدیل درست را برگزینی: `%d`، `%lf`، `\" %c\"`.", de: "Du kannst in `scanf` für jeden Typ die richtige Umwandlung wählen: `%d`, `%lf`, `\" %c\"`.", en: "You can pick the right conversion in `scanf` for each type: `%d`, `%lf`, `\" %c\"`." },
                { fa: "بتوانی برای ورودی درست و نادرست دنبال کنی `scanf` کجای ورودی می‌ایستد و چه برمی‌گرداند.", de: "Du kannst für richtige und falsche Eingaben verfolgen, wo `scanf` in der Eingabe aufhört und was es zurückgibt.", en: "You can follow, for good and bad input, where `scanf` stops in the input and what it returns." },
                { fa: "بتوانی برنامه را روی کامپیوتر خودت با ورودی اجرا کنی و ورودی را با Ctrl+D یا Ctrl+Z تمام کنی.", de: "Du kannst das Programm auf deinem eigenen Rechner mit Eingabe ausführen und die Eingabe mit Strg+D oder Strg+Z beenden.", en: "You can run the program with input on your own computer and end the input with Ctrl+D or Ctrl+Z." },
                { fa: "بتوانی سه راه خراب شدن ورودی را نام ببری و بگویی برنامه در هر کدام چه می‌بیند.", de: "Du kannst drei Arten nennen, wie Eingaben schiefgehen, und sagen, was das Programm jeweils sieht.", en: "You can name three ways input goes wrong and say what the program sees in each." },
            ] },
    };
})(typeof window !== "undefined" ? window : globalThis);

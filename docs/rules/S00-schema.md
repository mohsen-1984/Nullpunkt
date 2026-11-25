**نول‌پونکت — Nullpunkt** · پیش‌نویس 0.1 — Draft 0.1 (2026-11-25)

*C از صفر — C von Null an — C from Zero*

*سند کاری برای نویسنده و ویراستار، نه برای فراگیر*

---

# طرح‌وارهٔ داده — Data Schema

همهٔ محتوا داده است (`S.DAT.01`): هر فایل `data/*.js` یک classic script است که یک شیء را در `window.Nullpunkt.files` ثبت می‌کند، تا از `file://` هم بار شود. صفحهٔ وب، Markdown، پاسخ‌نامه و گزارش checker از همین داده ساخته می‌شوند. این سند شکل هر رکورد را تعریف می‌کند.

**نماد فیلد:** `name` اجباری · `name?` اختیاری · `[T]` آرایه‌ای از T · `t3` رشتهٔ سه‌زبانه · `Id(X)` ارجاع به رکوردی از نوع X · ⚙ فیلد ساختنی.

---

## اصل‌ها — Principles

**نوشتنی و ساختنی — Authored and Generated** — فیلدهای ⚙ را نویسنده نمی‌نویسد؛ ابزار `tools/gen-expect.js` آن‌ها را با اجرای واقعی gcc پر می‌کند (`S.CH.05`). هر فیلد ⚙ اثر انگشت (SHA-256) ورودی‌هایش را نگه می‌دارد؛ اگر کد یا ورودی عوض شود و ⚙ دوباره ساخته نشود، checker خطای «کهنه — stale» می‌دهد.

**شماره ذخیره نمی‌شود — No Stored Numbers** — شمارهٔ درس، فصل، حرف بند و شمارهٔ قلم از کاتالوگ و جایگاه ساخته می‌شوند (`S.HDG.04`).

**رشتهٔ سه‌زبانه — t3** — شیء `{fa, de, en}`؛ هر سه اجباری و ناتهی (`S.DAT.02`). متن آن از زیرمجموعهٔ بستهٔ Markdown درون‌خطی پیروی می‌کند (`S.MRK.01`).

```js
{ fa: "یک [[term:T.variable]] جعبه‌ای با نام است.",
  de: "Eine [[term:T.variable]] ist eine Box mit Namen.",
  en: "A [[term:T.variable]] is a named box." }
```

**کد هرگز t3 نیست — Code Is Never t3** — کد، ورودی، خروجی و پیام کامپایلر رشتهٔ سادهٔ انگلیسی‌اند (`S.TYP.16`).

---

## فایل‌ها — Files

| فایل | Id | محتوا |
|---|---|---|
| `data/registry.js` | — | نسخه، زبان‌ها، فهرست فایل‌ها، کاتالوگ |
| `data/S00-core.js` و خانواده | `S00` | خود سندهای قاعده، به صورت داده؛ همین سندها از آن ساخته می‌شوند |
| `data/S00-glossary.js` | `S00G` | اصطلاح‌نامه، مشترک همهٔ سری‌ها |
| `data/S00-prompts.js` | `S00P` | پرامپت مادر و الگوهای `AI-*` |
| `data/C00-conventions.js` | `C00` | قواعد سری C، سازه‌ها (`K.*`)، تکه‌های مجاز (`CH.*`)، کمبودهای XCC |
| `data/C00-mistakes.js` | `C00M` | همهٔ اشتباه‌های رایج سری C |
| `data/C01-….js` تا `data/C13-….js` | `C01`… | یک فایل برای هر فصل: درس‌ها، کدها، تمرین‌ها |
| `data/ids-baseline.js` | — | فهرست Idهای منتشرشده و بازنشسته (`S.ID.01`) |

**پوشش فایل — File Envelope**

```js
(function (g) {
  var N = g.Nullpunkt = g.Nullpunkt || { files: {} };
  N.files["C04"] = { id: "C04", kind: "chapter", series: "C", version: "0.1.0", /* … */ };
})(typeof window !== "undefined" ? window : globalThis);
```

---

## فهرست مرکزی — registry

| فیلد | شرح |
|---|---|
| `release` | `{ version, date }` — نسخهٔ مجموعه |
| `languages` | `["fa", "de", "en"]` — ترتیب نمایش در انتخاب‌گر زبان |
| `files` | [Id فایل] — ترتیب بارکردن |
| `catalog` | [series] |
| `baseline` | مسیر `ids-baseline.js` |

### سری — series

| فیلد | شرح |
|---|---|
| `id` | `C` یا `X` |
| `title` | t3 |
| `standard` | `"C17"` برای سری C (`O-04`) |
| `chapters` | [chapter] |

### فصل (در کاتالوگ) — chapter

| فیلد | شرح |
|---|---|
| `id` | Id فایل، مثل `C04` |
| `title` | t3 |
| `lessons` | [lesson] |
| `review` | Id واحد مرور پایان فصل |
| `langStatus` | `{ fa, de, en }` هر کدام `"draft"`، `"preview"` یا `"reviewed"` — `S.LNG.05` |

### درس (در کاتالوگ) — lesson

عنوان و جایگاه درس فقط اینجا تعریف می‌شود.

| فیلد | شرح |
|---|---|
| `id` | `C.L12` |
| `title` | t3 |
| `minutes` | زمان تخمینی، 15 تا 25 |
| `prereq` | [Id(lesson)] — پیش‌نیاز مستقیم |
| `introduces` | [Id(construct)] — سازه‌هایی که این درس آموزش می‌دهد؛ پایهٔ وارسی نشت ساختار (`S.CH.06`) |
| `topics` | [{ `id`, `stage` }] — مبحث مارپیچ و گذر آن (1، 2 یا 3) |
| `cando` | [t3] — دقیقاً پنج توانایی خودسنجی، هر کدام با «بتوانی / kannst du / you can» |

---

## فصل — chapter file

| فیلد | شرح |
|---|---|
| `id` | `C04` |
| `kind` | `"chapter"` |
| `series` | `"C"` |
| `version` | نسخهٔ معنایی فایل |
| `units` | [unit] — به ترتیب نمایش |
| `code` | [code] — همهٔ کدهای فصل |

## واحد — unit

| فیلد | شرح |
|---|---|
| `type` | `lesson` · `review` · `appendix` · `prose` |
| `id` | `C.L12` · `C04.REV` · `C04.APX1` |
| `title?` | t3 — برای درس از کاتالوگ خوانده می‌شود و اینجا نمی‌آید |
| `blocks?` | [block] — فقط درس، به ترتیب اسکلت `C00` |
| `content?` | [node] — واحدهای غیر درس |
| `allow?` | [Id(rule)] — معافیت صریح (`S.ID.04`) |

## بلوک — block

| فیلد | شرح |
|---|---|
| `block` | Id از رجیستری بلوک‌ها، مثل `machine` |
| `subtitle?` | t3 — فقط پس از دونقطه در عنوان |
| `content` | [node] — بلوک‌های `key`، `terms` و `selfcheck` محتوا ندارند و ساخته می‌شوند |

---

## گره محتوا — node

هر گره یک `type` دارد.

| type | فیلدها | شرح |
|---|---|---|
| `p` | `text` t3 | بند نثر |
| `list` | `items` [t3]، `ordered?` | فهرست؛ تودرتو نه |
| `table` | `head` [t3]، `rows` [[cell]] | cell یا t3 است یا `{ code: "…" }` |
| `note` | `kind`، `text` t3 | `kind`: `simplification` (`S.CH.03`) · `platform` · `c23` · `ub` · `exam` |
| `code` | `ref` Id(code)، `mode` | `mode`: `run` (قابل ویرایش و اجرا) · `static` (فقط خواندنی) · `predict` (اجرا پس از ثبت پیش‌بینی) |
| `trace` | `ref` Id(code)، `vars` [string]، `rows` ⚙ | جدول ردیابی؛ ردیف‌ها با اجرای ابزاری‌شدهٔ کد ساخته می‌شوند |
| `memory` | `ref` Id(code)، `line`، `boxes` | نقشهٔ حافظه در یک خط؛ `boxes` نوشتنی: [{ `name`, `type`, `value`, `addr?`, `points?` }] |
| `mistakes` | `refs` [Id(mistake)] | جدول اشتباه‌ها، ساخته از رکوردها |
| `diagnostic` | `ref` Id(code) | درمانگاه خطا: پیام ⚙ gcc و XCC همراه توضیح |
| `map` | `rows` [{ `from`, `to`, `contrast` }] | جدول نگاشت برای `CT.form` |
| `band` | `ref` Id(band) | جای بند تمرین |
| `prompt` | `ref` Id(prompt)، `lessonText?` | پرامپت؛ فقط در بلوک `ai` |

---

## کد — code

| فیلد | شرح |
|---|---|
| `id` | `C.L12.K03` |
| `title?` | t3 |
| `source` | رشته — کد کامل، با قاعده‌های `S.STY` |
| `intent` | `ok` · `compile-error` · `warning` · `runtime-error` · `ub` · `platform` |
| `stdin?` | رشته |
| `args?` | [string] |
| `files?` | `{ "name.txt": "…" }` — فایل‌های اولیهٔ دایرکتوری کار |
| `mistake?` | Id(mistake) — اگر این کد نمونهٔ «غلط» یک اشتباه است |
| `expect` ⚙ | `{ gcc: result, xcc: result, hash }` |
| `allow?` | [Id(rule)] |

**result ⚙:** `{ compiled, diagnostics: [{ line, col, severity, message }], stdout, stderr, exitCode, trap }`.

**هماهنگی دو کامپایلر:** اگر `intent` برابر `ok` باشد، `expect.gcc.stdout` و `expect.xcc.stdout` باید یکی باشند؛ وگرنه کد باید `intent: "platform"` بگیرد و هر دو خروجی نشان داده می‌شوند (`S.STD.02`). اگر `intent` برابر `compile-error` باشد، هر دو کامپایلر باید خطا بدهند و نخستین خطا در یک خط باشد.

---

## اشتباه — mistake

| فیلد | شرح |
|---|---|
| `id` | `E-07` |
| `dim` | حرف بُعد — همان حرف اول Id |
| `src` | `SRC.math` · `SRC.language` · `SRC.prior` · `SRC.developmental` |
| `contrast?` | `CT.false` · `CT.form` · `CT.new` — اجباری برای منبع انتقالی، ممنوع برای رشدی (`S.PIT.06`) |
| `title` | t3 — کوتاه |
| `wrong` | Id(code) — کد غلط؛ `intent` آن با `dim` می‌خواند (`E-` ← `compile-error`، `R-` ← `runtime-error`، …) |
| `right` | Id(code) — همان کد، درست‌شده؛ `intent: "ok"` |
| `why` | t3 — یک یا دو جمله |
| `lessons` | [Id(lesson)] ⚙ — درس‌هایی که آن را نشان می‌دهند |
| `practiced` | [Id(item)] ⚙ — قلم‌هایی که آن را فعال می‌کنند؛ تهی خطاست (`S.PIT.04`) |

**نشانه ⚙:** نشانهٔ اشتباه — پیام کامپایلر یا خروجی — از `expect` کد `wrong` خوانده می‌شود و هرگز دستی نوشته نمی‌شود (`S.PIT.03`). برای `U-`، نشانه همان است که gcc با `-Wall -Wextra` و، اگر لازم شد، با sanitizer گزارش می‌دهد.

---

## بند تمرین — band

| فیلد | شرح |
|---|---|
| `id` | `C.L12.X02` |
| `type` | `B.predict` · `B.trace` · `B.parsons` · `B.complete` · `B.fix` · `B.review` · `B.modify` · `B.write` · `B.explain` |
| `title` | t3 — دستور کوتاه («پیش‌بینی کن — Predict the output») |
| `items` | [item] |

## قلم تمرین — item

| فیلد | شرح |
|---|---|
| `id` | `C.L12.X02.05` |
| `prompt?` | t3 — صورت مسئله |
| `activates?` | [Id(mistake)] — اشتباه‌هایی که این قلم عمداً فعال می‌کند |
| `why` | t3 — ستون «چرا»ی پاسخ‌نامه |

فیلدهای بقیه به نوع بند بستگی دارند:

| نوع | فیلدها | سنجش |
|---|---|---|
| `B.predict` | `code` Id(code)، `accept?` [string] | خروجی تایپ‌شده با ⚙ `stdout` (یا یکی از `accept`)، با نادیده‌گرفتن فاصلهٔ پایان سطر |
| `B.trace` | `code` Id(code)، `vars` [string]، `blanks` [{ `step`, `var` }] | خانه‌های خالی با ردیف‌های ⚙ |
| `B.parsons` | `lines` [string]، `distractors?` [string]، `acceptOrders?` [[n]] | ترتیب ساخته‌شده کامپایل و با تست‌ها اجرا می‌شود؛ پس هر ترتیب درست دیگر هم پذیرفته است |
| `B.complete` | `template` (با `/*___*/` برای جای خالی)، `solution` | تست‌ها |
| `B.fix` | `broken` Id(code)، `solution` | تست‌ها؛ کد `broken` باید دست‌کم یک تست را رد کند |
| `B.review` | `code` Id(code)، `lines` [n]، `codes` [Id(mistake)] | خط‌ها و کدهای انتخاب‌شده |
| `B.modify` | `start` Id(code)، `solution` | تست‌ها |
| `B.write` | `starter?`، `solution` | تست‌ها، به‌علاوهٔ نمایش نمونه‌پاسخ پس از تلاش |
| `B.explain` | `model` t3، `ai?` Id(prompt) | نمونه‌پاسخ؛ بدون سنجش خودکار |

### تست — test

| فیلد | شرح |
|---|---|
| `id` | `C.L12.X02.05.T01` |
| `purpose` | `normal` · `edge` · `mistake` (`S.BND.02`) |
| `mistake?` | Id(mistake) — اجباری برای `purpose: "mistake"` |
| `stdin?` · `args?` · `files?` | مثل کد |
| `expect` ⚙ | خروجی `solution` با gcc |
| `rejects` ⚙ | آیا نسخهٔ «غلط» اشتباه مربوط این تست را رد می‌کند — برای `purpose: "mistake"` باید `true` باشد |

---

## اصطلاح — term

| فیلد | شرح |
|---|---|
| `id` | `T.pointer` |
| `en` | `"pointer"` — صورت مرجع |
| `use` | `{ fa, de }` — صورتی که در متن می‌آید؛ پیش‌فرض همان `en` (`S.LNG.02`) |
| `gloss` | `{ fa, de }` — معادل محلی برای اولین معرفی (`S.GLS.01`) |
| `alt?` | `{ fa: [], de: [] }` — معادل‌های دیگر؛ در متن ممنوع |
| `deArticle` | `der` · `die` · `das` (`S.LNG.04`) |
| `def` | t3 — تعریف یک‌جمله‌ای |
| `series` | [`C`، `X`] |

## سازه — construct

| فیلد | شرح |
|---|---|
| `id` | `K.for` · `K.fn-scanf` · `K.h-stdlib` · `K.fmt-zu` |
| `kind` | `keyword` · `operator` · `type` · `function` · `header` · `format` · `literal` |
| `match` | توکن یا الگویی که checker در کد جست‌وجو می‌کند |
| `lesson` | ⚙ از `introduces` کاتالوگ |
| `ref?` | t3 — کارت مرجع کوتاه، برای `[[k:…]]` |

## تکهٔ مجاز — chunk

| فیلد | شرح |
|---|---|
| `id` | `CH.main-frame` |
| `match` | الگوی تکه، مثل `#include <stdio.h>` و `int main(void)` |
| `from` | Id(lesson) — از کجا مجاز است |
| `explainedIn` | Id(lesson) — کجا توضیح داده می‌شود (`S.CH.03`) |

## پرامپت — prompt

| فیلد | شرح |
|---|---|
| `id` | `AI-2` · `AI.MASTER` |
| `name` | `{ en, fa, de }` |
| `icon` | نام Lucide |
| `text` | رشتهٔ انگلیسی — حداکثر شش سطر، مگر `AI.MASTER` (`S.PRM.01`) |
| `guide` | `{ does: t3, give: t3, output: t3 }` (`S.PRM.02`) |
| `waits` | `true` اگر فراگیر اول می‌فرستد (`S.PRM.03`) |

---

## آنچه checker با این طرح‌واره می‌سنجد — What the Checker Verifies

- **شکل:** هر فیلد اجباری هست، هر `type` و `kind` از فهرست مجاز است، هر Id با الگوی خودش می‌خواند (`S.ID.02`).
- **ارجاع:** هر `ref`، `[[…]]` و Id(X) به رکوردی موجود از همان نوع اشاره می‌کند (`S.ID.03`).
- **سه زبان:** هر t3 سه رشتهٔ ناتهی دارد (`S.DAT.02`).
- **کهنگی:** هر ⚙ با `hash` ورودی‌هایش می‌خواند.
- **کد:** هر کد با `intent` خودش می‌خواند؛ هر `ok` در gcc و XCC یک خروجی دارد یا `platform` است.
- **نشت ساختار:** هیچ کدی در درس N سازه‌ای را به کار نمی‌برد که `lesson` آن بعد از N است، مگر تکهٔ مجاز (`S.CH.06`).
- **اشتباه:** منبع و نوع تقابل می‌خوانند (`S.PIT.01`، `S.PIT.06`)؛ `practiced` تهی نیست (`S.PIT.04`).
- **تمرین:** هر بند خودکار دست‌کم سه تست با سه `purpose` دارد و تست `mistake` واقعاً رد می‌کند (`S.BND.02`).
- **حجم:** هر فایل زیر 250 KB (`S.DAT.04`).

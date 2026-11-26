/* Lab programs with expected results. Made by tools/build-tests.js from tests/programs/ — do not edit. */
(function (g) { g.CLab = [
 {
  "id": "01-hello",
  "source": "#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "Hello, World!\n"
 },
 {
  "id": "02-types",
  "source": "#include <stdio.h>\n#include <limits.h>\n\nint main(void) {\n    char c = 'A';\n    int i = 42;\n    double d = 3.14159;\n    printf(\"char %c = %d\\n\", c, c);\n    printf(\"int %d, hex %x, octal %o\\n\", i, i, i);\n    printf(\"double %.2f, %e\\n\", d, d);\n    printf(\"sizeof: char=%zu int=%zu double=%zu\\n\", sizeof(char), sizeof(int), sizeof(double));\n    printf(\"INT_MAX=%d INT_MIN=%d\\n\", INT_MAX, INT_MIN);\n    unsigned int u = 0;\n    u = u - 1;\n    printf(\"unsigned wrap: %u\\n\", u);\n    printf(\"integer division 7/2=%d, 7%%2=%d, 7.0/2=%.1f\\n\", 7 / 2, 7 % 2, 7.0 / 2);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "knownGap": "INT_MIN in limits.h is a long long on wasm32",
  "expect": "char A = 65\nint 42, hex 2a, octal 52\ndouble 3.14, 3.141590e+00\nsizeof: char=1 int=4 double=8\nINT_MAX=2147483647 INT_MIN=-2147483648\nunsigned wrap: 4294967295\ninteger division 7/2=3, 7%2=1, 7.0/2=3.5\n"
 },
 {
  "id": "03-control",
  "source": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 15; i++) {\n        if (i % 15 == 0) printf(\"FizzBuzz\\n\");\n        else if (i % 3 == 0) printf(\"Fizz\\n\");\n        else if (i % 5 == 0) printf(\"Buzz\\n\");\n        else printf(\"%d\\n\", i);\n    }\n    int n = 3;\n    switch (n) {\n        case 1: printf(\"one\\n\"); break;\n        case 3: printf(\"three\\n\");   /* fall through */\n        default: printf(\"default\\n\");\n    }\n    int k = 0;\n    do { k += 2; } while (k < 7);\n    printf(\"k=%d\\n\", k);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\nthree\ndefault\nk=8\n"
 },
 {
  "id": "04-functions",
  "source": "#include <stdio.h>\n\nlong factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }\nint fib(int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }\nstatic int counter(void) { static int c = 0; return ++c; }\n\nint main(void) {\n    printf(\"10! = %ld\\n\", factorial(10));\n    printf(\"fib(20) = %d\\n\", fib(20));\n    counter(); counter();\n    printf(\"counter = %d\\n\", counter());\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "10! = 3628800\nfib(20) = 6765\ncounter = 3\n"
 },
 {
  "id": "05-arrays",
  "source": "#include <stdio.h>\n\n#define N 5\n\nint main(void) {\n    int a[N] = {5, 3, 9, 1, 7};\n    int sum = 0, max = a[0];\n    for (int i = 0; i < N; i++) { sum += a[i]; if (a[i] > max) max = a[i]; }\n    printf(\"sum=%d max=%d avg=%.2f\\n\", sum, max, (double)sum / N);\n    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n    for (int r = 0; r < 3; r++) {\n        for (int c = 0; c < 3; c++) printf(\"%d \", m[c][r]);\n        printf(\"\\n\");\n    }\n    printf(\"elements: %zu\\n\", sizeof a / sizeof a[0]);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "sum=25 max=9 avg=5.00\n1 4 7 \n2 5 8 \n3 6 9 \nelements: 5\n"
 },
 {
  "id": "06-strings",
  "source": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint main(void) {\n    char s[32] = \"Hello\";\n    strcat(s, \", C!\");\n    printf(\"%s (len %zu)\\n\", s, strlen(s));\n    char up[32];\n    for (size_t i = 0; i <= strlen(s); i++) up[i] = (char)toupper((unsigned char)s[i]);\n    printf(\"%s\\n\", up);\n    printf(\"strcmp: %d %d\\n\", strcmp(\"abc\", \"abd\") < 0, strcmp(\"b\", \"a\") > 0);\n    char buf[64];\n    snprintf(buf, sizeof buf, \"%s-%03d\", \"id\", 7);\n    printf(\"%s\\n\", buf);\n    char *tok = strtok(buf, \"-\");\n    while (tok) { printf(\"[%s]\", tok); tok = strtok(NULL, \"-\"); }\n    printf(\"\\n\");\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "Hello, C! (len 9)\nHELLO, C!\nstrcmp: 1 1\nid-007\n[id][007]\n"
 },
 {
  "id": "07-pointers",
  "source": "#include <stdio.h>\n\nvoid swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\n\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf(\"x=%d y=%d\\n\", x, y);\n    int arr[] = {10, 20, 30, 40};\n    int *p = arr;\n    printf(\"%d %d %d\\n\", *p, *(p + 2), p[3]);\n    p++;\n    printf(\"after p++: %d, distance=%td\\n\", *p, p - arr);\n    int *q = NULL;\n    printf(\"q is %s\\n\", q == NULL ? \"NULL\" : \"set\");\n    const char *msg = \"pointer\";\n    while (*msg) putchar(*msg++);\n    putchar('\\n');\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "knownGap": "%td is not supported by printf",
  "expect": "x=2 y=1\n10 30 40\nafter p++: 20, distance=1\nq is NULL\npointer\n"
 },
 {
  "id": "08-structs",
  "source": "#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n    char name[20];\n    int age;\n    double gpa;\n} Student;\n\nenum Color { RED, GREEN = 5, BLUE };\n\nvoid birthday(Student *s) { s->age++; }\n\nint main(void) {\n    Student s = {\"Mina\", 20, 3.7};\n    birthday(&s);\n    printf(\"%s is %d, GPA %.1f\\n\", s.name, s.age, s.gpa);\n    Student list[2] = {{\"Ali\", 21, 3.2}, {\"Lena\", 22, 3.9}};\n    for (int i = 0; i < 2; i++) printf(\"%d: %s\\n\", i, list[i].name);\n    printf(\"BLUE=%d\\n\", BLUE);\n    union { int i; unsigned char b[4]; } u = {.i = 1};\n    printf(\"little endian: %d\\n\", u.b[0] == 1);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "Mina is 21, GPA 3.7\n0: Ali\n1: Lena\nBLUE=6\nlittle endian: 1\n"
 },
 {
  "id": "09-malloc",
  "source": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int value; struct Node *next; } Node;\n\nNode *push(Node *head, int v) {\n    Node *n = malloc(sizeof *n);\n    n->value = v;\n    n->next = head;\n    return n;\n}\n\nint main(void) {\n    Node *head = NULL;\n    for (int i = 1; i <= 5; i++) head = push(head, i * i);\n    for (Node *n = head; n; n = n->next) printf(\"%d \", n->value);\n    printf(\"\\n\");\n    while (head) { Node *next = head->next; free(head); head = next; }\n    int *a = calloc(4, sizeof(int));\n    a = realloc(a, 8 * sizeof(int));\n    for (int i = 0; i < 8; i++) a[i] = i;\n    printf(\"a[7]=%d\\n\", a[7]);\n    free(a);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "25 16 9 4 1 \na[7]=7\n"
 },
 {
  "id": "10-input",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int n, x, sum = 0;\n    printf(\"How many numbers? \");\n    if (scanf(\"%d\", &n) != 1) return 1;\n    for (int i = 0; i < n; i++) {\n        printf(\"Number %d: \", i + 1);\n        scanf(\"%d\", &x);\n        sum += x;\n    }\n    printf(\"\\nSum = %d\\n\", sum);\n    char name[32];\n    printf(\"Your name: \");\n    scanf(\"%31s\", name);\n    printf(\"Hi %s!\\n\", name);\n    return 0;\n}\n",
  "stdin": "3\n4\n5\n6\nMohsen\n",
  "kind": "run",
  "expect": "How many numbers? Number 1: Number 2: Number 3: \nSum = 15\nYour name: Hi Mohsen!\n"
 },
 {
  "id": "11-files",
  "source": "#include <stdio.h>\n\nint main(void) {\n    FILE *f = fopen(\"scores.txt\", \"w\");\n    if (!f) { perror(\"fopen\"); return 1; }\n    fprintf(f, \"Anna 90\\nBen 75\\nCleo 88\\n\");\n    fclose(f);\n\n    f = fopen(\"scores.txt\", \"r\");\n    char name[20];\n    int score, total = 0, count = 0;\n    while (fscanf(f, \"%19s %d\", name, &score) == 2) { total += score; count++; }\n    fclose(f);\n    printf(\"%d students, average %.2f\\n\", count, (double)total / count);\n\n    if (fopen(\"missing.txt\", \"r\") == NULL) printf(\"missing.txt: not found\\n\");\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "3 students, average 84.33\nmissing.txt: not found\n"
 },
 {
  "id": "12-stdlib",
  "source": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n\nint cmp(const void *a, const void *b) { return *(const int *)a - *(const int *)b; }\n\nint main(void) {\n    int v[] = {42, 7, 19, 3, 25};\n    qsort(v, 5, sizeof v[0], cmp);\n    for (int i = 0; i < 5; i++) printf(\"%d \", v[i]);\n    printf(\"\\n\");\n    printf(\"sqrt(2)=%.4f pow(2,10)=%.0f floor(-1.5)=%.0f\\n\", sqrt(2.0), pow(2, 10), floor(-1.5));\n    printf(\"atoi=%d strtol=%ld abs=%d\\n\", atoi(\"123\"), strtol(\"ff\", NULL, 16), abs(-9));\n    int (*op)(const void *, const void *) = cmp;\n    int a = 1, b = 2;\n    printf(\"fnptr: %d\\n\", op(&a, &b) < 0);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "3 7 19 25 42 \nsqrt(2)=1.4142 pow(2,10)=1024 floor(-1.5)=-2\natoi=123 strtol=255 abs=9\nfnptr: 1\n"
 },
 {
  "id": "13-bits-macros",
  "source": "#include <stdio.h>\n#include <stdint.h>\n#include <stdbool.h>\n\n#define SQUARE(x) ((x) * (x))\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n\nint main(void) {\n    uint8_t flags = 0;\n    flags |= 1u << 3;\n    flags |= 1u << 0;\n    printf(\"flags=0x%02X bit3=%d\\n\", flags, (flags >> 3) & 1);\n    printf(\"~0x0F & 0xFF = 0x%X, 6^3=%d\\n\", ~0x0Fu & 0xFF, 6 ^ 3);\n    printf(\"SQUARE(1+2)=%d MAX=%d\\n\", SQUARE(1 + 2), MAX(4, 9));\n    bool ok = true;\n    printf(\"bool=%d int32 max=%d\\n\", ok, INT32_MAX);\n#ifdef __STDC_VERSION__\n    printf(\"C standard defined\\n\");\n#endif\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "flags=0x09 bit3=1\n~0x0F & 0xFF = 0xF0, 6^3=5\nSQUARE(1+2)=9 MAX=9\nbool=1 int32 max=2147483647\nC standard defined\n"
 },
 {
  "id": "14-c99-c11",
  "source": "#include <stdio.h>\n\nstruct P { int x, y; };\n\nint sum_vla(int n) {\n    int a[n];\n    for (int i = 0; i < n; i++) a[i] = i;\n    int s = 0;\n    for (int i = 0; i < n; i++) s += a[i];\n    return s;\n}\n\nint main(void) {\n    struct P p = {.y = 2, .x = 1};\n    printf(\"designated: %d %d\\n\", p.x, p.y);\n    struct P *q = &(struct P){3, 4};\n    printf(\"compound literal: %d %d\\n\", q->x, q->y);\n    int arr[5] = {[2] = 7};\n    printf(\"array designator: %d %d\\n\", arr[2], arr[0]);\n    printf(\"vla sum: %d\\n\", sum_vla(5));\n    _Static_assert(sizeof(int) == 4, \"int is 4 bytes\");\n    long long big = 1LL << 40;\n    printf(\"long long: %lld\\n\", big);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "knownGap": "_Static_assert is not supported",
  "expect": "designated: 1 2\ncompound literal: 3 4\narray designator: 7 0\nvla sum: 10\nlong long: 1099511627776\n"
 },
 {
  "id": "15-generic",
  "source": "#include <stdio.h>\n\n#define TYPENAME(x) _Generic((x), int: \"int\", double: \"double\", char *: \"char*\", default: \"other\")\n\nint main(void) {\n    printf(\"%s %s %s\\n\", TYPENAME(1), TYPENAME(1.0), TYPENAME(\"s\"));\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "int double char*\n"
 },
 {
  "id": "16-sizes-wasm32",
  "source": "#include <stdio.h>\n\nint main(void) {\n    /* differs by platform: on a 64-bit Linux PC long and pointers are 8 bytes, in wasm32 they are 4 */\n    printf(\"long=%zu pointer=%zu long long=%zu long double=%zu\\n\",\n           sizeof(long), sizeof(void *), sizeof(long long), sizeof(long double));\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "long=4 pointer=4 long long=8 long double=8\n",
  "note": "wasm32: long and pointers are 4 bytes (8 on a 64-bit PC)"
 },
 {
  "id": "17-big-local-array",
  "source": "#include <stdio.h>\n\nlong long sum_local(void) {\n    int a[100000];\n    long long s = 0;\n    for (int i = 0; i < 100000; i++) a[i] = i;\n    for (int i = 0; i < 100000; i++) s += a[i];\n    return s;\n}\n\nint depth(int n) { char pad[64]; pad[0] = (char)n; return n == 0 ? pad[0] : depth(n - 1) + 1; }\n\nint main(void) {\n    printf(\"sum=%lld\\n\", sum_local());\n    printf(\"depth=%d\\n\", depth(5000));\n    return 0;\n}\n",
  "stdin": "",
  "kind": "run",
  "expect": "sum=4999950000\ndepth=5000\n"
 },
 {
  "id": "18-scanf",
  "source": "#include <stdio.h>\n\n// scanf as the lessons of chapter 3 use it: numbers, a character after a number, the count it returns,\n// a scan set, assignment suppression, and EOF when the input has ended\nint main(void) {\n    int seat = 0;\n    char row = '?';\n    double price = 0.0;\n    int n = scanf(\"%d %lf\", &seat, &price);\n    printf(\"n=%d seat=%d price=%.2f\\n\", n, seat, price);\n    int c = getchar();\n    printf(\"after the number: %d\\n\", c);\n    n = scanf(\" %c\", &row);\n    printf(\"n=%d row=%c\\n\", n, row);\n    char words[32] = \"\";\n    n = scanf(\" %31[^\\n]\", words);\n    printf(\"n=%d [%s]\\n\", n, words);\n    int skipped = 0;\n    n = scanf(\"%*d %d\", &skipped);\n    printf(\"n=%d skipped=%d\\n\", n, skipped);\n    n = scanf(\"%d\", &seat);\n    printf(\"at the end: n=%d EOF=%d\\n\", n, EOF);\n    return 0;\n}\n",
  "stdin": "12 4.5\n B\nrow by the window\n1 2\n",
  "kind": "run",
  "expect": "n=2 seat=12 price=4.50\nafter the number: 10\nn=1 row=B\nn=1 [row by the window]\nn=1 skipped=2\nat the end: n=-1 EOF=-1\n"
 },
 {
  "id": "20-err-undeclared",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 0; i < 3; i++)\n        totl += i;\n    printf(\"%d\\n\", total);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "compile-error",
  "line": 6
 },
 {
  "id": "21-err-missing-semicolon",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int x = 5\n    printf(\"%d\\n\", x);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "compile-error",
  "line": 5
 },
 {
  "id": "22-err-types",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int *p = 3.5;\n    printf(\"%d\\n\", *p);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "compile-error",
  "line": 4
 },
 {
  "id": "30-rt-null",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int *p = NULL;\n    printf(\"before\\n\");\n    *p = 42;\n    printf(\"after: %d\\n\", *p);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "runtime",
  "trap": "null-write",
  "note": "gcc on Linux: Segmentation fault. In wasm address 0 is ordinary memory, so only the NULL guard (writes) catches it."
 },
 {
  "id": "31-rt-div0",
  "source": "#include <stdio.h>\n\nint main(void) {\n    int a = 10, b = 0;\n    printf(\"%d\\n\", a / b);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "runtime",
  "trap": "divide-by-zero"
 },
 {
  "id": "32-rt-recursion",
  "source": "#include <stdio.h>\n\nint depth(int n) { return depth(n + 1) + 1; }\n\nint main(void) {\n    printf(\"%d\\n\", depth(0));\n    return 0;\n}\n",
  "stdin": "",
  "kind": "runtime",
  "trap": "stack-overflow"
 },
 {
  "id": "33-rt-endless",
  "source": "#include <stdio.h>\n\nint main(void) {\n    unsigned long n = 0;\n    while (1) n++;\n    printf(\"%lu\\n\", n);\n    return 0;\n}\n",
  "stdin": "",
  "kind": "runtime",
  "timeout": true
 },
 {
  "id": "34-rt-exit",
  "source": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    printf(\"exiting with 3\\n\");\n    exit(3);\n}\n",
  "stdin": "",
  "kind": "runtime",
  "exitCode": 3,
  "expect": "exiting with 3\n"
 }
];
    if (typeof module !== 'undefined' && module.exports) module.exports = g.CLab; })(typeof window !== 'undefined' ? window : globalThis);

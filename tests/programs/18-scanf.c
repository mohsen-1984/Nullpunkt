#include <stdio.h>

// scanf as the lessons of chapter 3 use it: numbers, a character after a number, the count it returns,
// a scan set, assignment suppression, and EOF when the input has ended
int main(void) {
    int seat = 0;
    char row = '?';
    double price = 0.0;
    int n = scanf("%d %lf", &seat, &price);
    printf("n=%d seat=%d price=%.2f\n", n, seat, price);
    int c = getchar();
    printf("after the number: %d\n", c);
    n = scanf(" %c", &row);
    printf("n=%d row=%c\n", n, row);
    char words[32] = "";
    n = scanf(" %31[^\n]", words);
    printf("n=%d [%s]\n", n, words);
    int skipped = 0;
    n = scanf("%*d %d", &skipped);
    printf("n=%d skipped=%d\n", n, skipped);
    n = scanf("%d", &seat);
    printf("at the end: n=%d EOF=%d\n", n, EOF);
    return 0;
}

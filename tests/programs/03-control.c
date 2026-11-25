#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 15; i++) {
        if (i % 15 == 0) printf("FizzBuzz\n");
        else if (i % 3 == 0) printf("Fizz\n");
        else if (i % 5 == 0) printf("Buzz\n");
        else printf("%d\n", i);
    }
    int n = 3;
    switch (n) {
        case 1: printf("one\n"); break;
        case 3: printf("three\n");   /* fall through */
        default: printf("default\n");
    }
    int k = 0;
    do { k += 2; } while (k < 7);
    printf("k=%d\n", k);
    return 0;
}

#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int main(void) {
    int x = 1, y = 2;
    swap(&x, &y);
    printf("x=%d y=%d\n", x, y);
    int arr[] = {10, 20, 30, 40};
    int *p = arr;
    printf("%d %d %d\n", *p, *(p + 2), p[3]);
    p++;
    printf("after p++: %d, distance=%td\n", *p, p - arr);
    int *q = NULL;
    printf("q is %s\n", q == NULL ? "NULL" : "set");
    const char *msg = "pointer";
    while (*msg) putchar(*msg++);
    putchar('\n');
    return 0;
}

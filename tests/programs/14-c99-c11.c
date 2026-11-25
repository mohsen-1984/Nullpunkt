#include <stdio.h>

struct P { int x, y; };

int sum_vla(int n) {
    int a[n];
    for (int i = 0; i < n; i++) a[i] = i;
    int s = 0;
    for (int i = 0; i < n; i++) s += a[i];
    return s;
}

int main(void) {
    struct P p = {.y = 2, .x = 1};
    printf("designated: %d %d\n", p.x, p.y);
    struct P *q = &(struct P){3, 4};
    printf("compound literal: %d %d\n", q->x, q->y);
    int arr[5] = {[2] = 7};
    printf("array designator: %d %d\n", arr[2], arr[0]);
    printf("vla sum: %d\n", sum_vla(5));
    _Static_assert(sizeof(int) == 4, "int is 4 bytes");
    long long big = 1LL << 40;
    printf("long long: %lld\n", big);
    return 0;
}

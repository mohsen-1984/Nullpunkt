#include <stdio.h>

long long sum_local(void) {
    int a[100000];
    long long s = 0;
    for (int i = 0; i < 100000; i++) a[i] = i;
    for (int i = 0; i < 100000; i++) s += a[i];
    return s;
}

int depth(int n) { char pad[64]; pad[0] = (char)n; return n == 0 ? pad[0] : depth(n - 1) + 1; }

int main(void) {
    printf("sum=%lld\n", sum_local());
    printf("depth=%d\n", depth(5000));
    return 0;
}

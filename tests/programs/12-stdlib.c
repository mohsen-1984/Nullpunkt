#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int cmp(const void *a, const void *b) { return *(const int *)a - *(const int *)b; }

int main(void) {
    int v[] = {42, 7, 19, 3, 25};
    qsort(v, 5, sizeof v[0], cmp);
    for (int i = 0; i < 5; i++) printf("%d ", v[i]);
    printf("\n");
    printf("sqrt(2)=%.4f pow(2,10)=%.0f floor(-1.5)=%.0f\n", sqrt(2.0), pow(2, 10), floor(-1.5));
    printf("atoi=%d strtol=%ld abs=%d\n", atoi("123"), strtol("ff", NULL, 16), abs(-9));
    int (*op)(const void *, const void *) = cmp;
    int a = 1, b = 2;
    printf("fnptr: %d\n", op(&a, &b) < 0);
    return 0;
}

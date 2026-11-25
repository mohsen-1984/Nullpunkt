#include <stdio.h>

#define N 5

int main(void) {
    int a[N] = {5, 3, 9, 1, 7};
    int sum = 0, max = a[0];
    for (int i = 0; i < N; i++) { sum += a[i]; if (a[i] > max) max = a[i]; }
    printf("sum=%d max=%d avg=%.2f\n", sum, max, (double)sum / N);
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 3; c++) printf("%d ", m[c][r]);
        printf("\n");
    }
    printf("elements: %zu\n", sizeof a / sizeof a[0]);
    return 0;
}

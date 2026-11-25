#include <stdio.h>

int main(void) {
    int n, x, sum = 0;
    printf("How many numbers? ");
    if (scanf("%d", &n) != 1) return 1;
    for (int i = 0; i < n; i++) {
        printf("Number %d: ", i + 1);
        scanf("%d", &x);
        sum += x;
    }
    printf("\nSum = %d\n", sum);
    char name[32];
    printf("Your name: ");
    scanf("%31s", name);
    printf("Hi %s!\n", name);
    return 0;
}

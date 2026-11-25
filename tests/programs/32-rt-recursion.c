#include <stdio.h>

int depth(int n) { return depth(n + 1) + 1; }

int main(void) {
    printf("%d\n", depth(0));
    return 0;
}

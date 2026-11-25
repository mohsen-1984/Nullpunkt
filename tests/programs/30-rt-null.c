#include <stdio.h>

int main(void) {
    int *p = NULL;
    printf("before\n");
    *p = 42;
    printf("after: %d\n", *p);
    return 0;
}

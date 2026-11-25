#include <stdio.h>
#include <limits.h>

int main(void) {
    char c = 'A';
    int i = 42;
    double d = 3.14159;
    printf("char %c = %d\n", c, c);
    printf("int %d, hex %x, octal %o\n", i, i, i);
    printf("double %.2f, %e\n", d, d);
    printf("sizeof: char=%zu int=%zu double=%zu\n", sizeof(char), sizeof(int), sizeof(double));
    printf("INT_MAX=%d INT_MIN=%d\n", INT_MAX, INT_MIN);
    unsigned int u = 0;
    u = u - 1;
    printf("unsigned wrap: %u\n", u);
    printf("integer division 7/2=%d, 7%%2=%d, 7.0/2=%.1f\n", 7 / 2, 7 % 2, 7.0 / 2);
    return 0;
}

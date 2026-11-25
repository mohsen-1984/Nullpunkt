#include <stdio.h>

long factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }
int fib(int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }
static int counter(void) { static int c = 0; return ++c; }

int main(void) {
    printf("10! = %ld\n", factorial(10));
    printf("fib(20) = %d\n", fib(20));
    counter(); counter();
    printf("counter = %d\n", counter());
    return 0;
}

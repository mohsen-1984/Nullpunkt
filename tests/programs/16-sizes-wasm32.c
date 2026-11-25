#include <stdio.h>

int main(void) {
    /* differs by platform: on a 64-bit Linux PC long and pointers are 8 bytes, in wasm32 they are 4 */
    printf("long=%zu pointer=%zu long long=%zu long double=%zu\n",
           sizeof(long), sizeof(void *), sizeof(long long), sizeof(long double));
    return 0;
}

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    uint8_t flags = 0;
    flags |= 1u << 3;
    flags |= 1u << 0;
    printf("flags=0x%02X bit3=%d\n", flags, (flags >> 3) & 1);
    printf("~0x0F & 0xFF = 0x%X, 6^3=%d\n", ~0x0Fu & 0xFF, 6 ^ 3);
    printf("SQUARE(1+2)=%d MAX=%d\n", SQUARE(1 + 2), MAX(4, 9));
    bool ok = true;
    printf("bool=%d int32 max=%d\n", ok, INT32_MAX);
#ifdef __STDC_VERSION__
    printf("C standard defined\n");
#endif
    return 0;
}

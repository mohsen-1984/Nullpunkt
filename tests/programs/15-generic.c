#include <stdio.h>

#define TYPENAME(x) _Generic((x), int: "int", double: "double", char *: "char*", default: "other")

int main(void) {
    printf("%s %s %s\n", TYPENAME(1), TYPENAME(1.0), TYPENAME("s"));
    return 0;
}

#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
    char s[32] = "Hello";
    strcat(s, ", C!");
    printf("%s (len %zu)\n", s, strlen(s));
    char up[32];
    for (size_t i = 0; i <= strlen(s); i++) up[i] = (char)toupper((unsigned char)s[i]);
    printf("%s\n", up);
    printf("strcmp: %d %d\n", strcmp("abc", "abd") < 0, strcmp("b", "a") > 0);
    char buf[64];
    snprintf(buf, sizeof buf, "%s-%03d", "id", 7);
    printf("%s\n", buf);
    char *tok = strtok(buf, "-");
    while (tok) { printf("[%s]", tok); tok = strtok(NULL, "-"); }
    printf("\n");
    return 0;
}

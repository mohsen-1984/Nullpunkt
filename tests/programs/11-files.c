#include <stdio.h>

int main(void) {
    FILE *f = fopen("scores.txt", "w");
    if (!f) { perror("fopen"); return 1; }
    fprintf(f, "Anna 90\nBen 75\nCleo 88\n");
    fclose(f);

    f = fopen("scores.txt", "r");
    char name[20];
    int score, total = 0, count = 0;
    while (fscanf(f, "%19s %d", name, &score) == 2) { total += score; count++; }
    fclose(f);
    printf("%d students, average %.2f\n", count, (double)total / count);

    if (fopen("missing.txt", "r") == NULL) printf("missing.txt: not found\n");
    return 0;
}

#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int value; struct Node *next; } Node;

Node *push(Node *head, int v) {
    Node *n = malloc(sizeof *n);
    n->value = v;
    n->next = head;
    return n;
}

int main(void) {
    Node *head = NULL;
    for (int i = 1; i <= 5; i++) head = push(head, i * i);
    for (Node *n = head; n; n = n->next) printf("%d ", n->value);
    printf("\n");
    while (head) { Node *next = head->next; free(head); head = next; }
    int *a = calloc(4, sizeof(int));
    a = realloc(a, 8 * sizeof(int));
    for (int i = 0; i < 8; i++) a[i] = i;
    printf("a[7]=%d\n", a[7]);
    free(a);
    return 0;
}

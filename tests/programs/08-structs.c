#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int age;
    double gpa;
} Student;

enum Color { RED, GREEN = 5, BLUE };

void birthday(Student *s) { s->age++; }

int main(void) {
    Student s = {"Mina", 20, 3.7};
    birthday(&s);
    printf("%s is %d, GPA %.1f\n", s.name, s.age, s.gpa);
    Student list[2] = {{"Ali", 21, 3.2}, {"Lena", 22, 3.9}};
    for (int i = 0; i < 2; i++) printf("%d: %s\n", i, list[i].name);
    printf("BLUE=%d\n", BLUE);
    union { int i; unsigned char b[4]; } u = {.i = 1};
    printf("little endian: %d\n", u.b[0] == 1);
    return 0;
}

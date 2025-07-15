.text
.org 0x0020

main:
    li     x1, 5
    li     x2, 5
    li     x3, 2
    li     x4, 3
    li     x6, 0
    li     x7, 1

    beq    x1, x2, eq_label
    li     x5, 1
    li     x5, 2
    li     x5, 3
    li     x5, 4
    li     x5, 5
    li     x5, 6

eq_label:
    blt    x3, x4, lt_label
    li     x5, 8
    li     x5, 9
    li     x5, 10
    li     x5, 11
    li     x5, 12
    li     x5, 13

lt_label:
    bz     x6, zero_label
    li     x5, 15
    li     x5, 16
    li     x5, 17
    li     x5, 18
    li     x5, 19
    li     x5, 20

zero_label:
    bnz    x7, final_label
    li     x5, 22
    li     x5, 23
    li     x5, 24
    li     x5, 25
    li     x5, 26
    li     x5, 27

final_label:
    li16   x5, 1234
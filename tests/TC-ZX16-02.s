# TC-ZX16-02: I-Type Immediate and Shift Test
.text
.org 0x0020

main:
    li    x1, 10         # x1 = 10
    li    x2, 3          # x2 = 3

    addi  x3, 5          # x3 = 0 + 5 = 5
    addi  x4, -2         # x4 = 0 - 2 = -2

    slti  x5, 4          # x5 = (0 < 4) = 1
    sltui x6, 63        # x6 = (0 < 63 unsigned) = 1

    ori   x1, 0x0F       # x1 = 10 | 0x0F = 10 | 15 = 15
    andi  x2, 0x06       # x2 = 3 & 6 = 2
    xori  x3, 0x05       # x3 = 5 ^ 5 = 0

    li    x4, 1          # reset x4 to 1
    slli  x4, 4          # x4 = 1 << 4 = 16

    li    x5, 32
    srli  x5, 2          # x5 = 32 >> 2 = 8 (logical)

    li    x6, -8
    srai  x6, 1          # x6 = -8 >> 1 = -4 (arithmetic)
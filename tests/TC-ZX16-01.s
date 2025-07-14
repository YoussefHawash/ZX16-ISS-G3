# TC-ZX16-01: R-Type and I-Type Functional Test
.text
.org 0x0020

main:
    li   x1, 10        # x1 = 10
    li   x2, 3         # x2 = 3

    add  x3, x2        # x3 = x3 + x2 = 0 + 3 = 3
    sub  x4, x1        # x4 = x4 - x1 = 0 - 10 = -10
    xor  x5, x2        # x5 = 0 ^ 3 = 3
    and  x6, x1        # x6 = 0 & 10 = 0
    or   x7, x1        # x7 = 0 | 10 = 10

    slt  x1, x2        # x1 = (10 < 3)? 1 : 0 = 0
    sltu x2, x1        # x2 = (3 < 0)? 1 : 0 = 0

    sll  x3, x2        # x3 = 3 << 0 = 3
    srl  x4, x1        # x4 = -10 >> 0 (logical) = -10 (unchanged)
    sra  x5, x2        # x5 = 3 >> 0 (arith) = 3

    mv   x6, x3        # x6 = x3 = 3
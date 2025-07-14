.text
.org 0x0000
    j main

.org 0x0020
main:
    # li16 x1, 0x1234 -> x1 = 0x1234 = 4660
    lui  x1, 0x24       # 0x1234 >> 7 = 0x24
    ori  x1, 0x34       # 0x1234 & 0x7F = 0x34

    # clear x2 = 0
    xor  x2, x2

    # not x3 = ~x3 = 0xFFFF
    xori x3, -1

    # negate x4 = -x4 (assume x4 = 5)
    li   x4, 5
    xori x4, -1
    addi x4, 1

    # increment x5 = x5 + 1
    li   x5, 10
    addi x5, 1

    # decrement x6 = x6 - 1
    li   x6, 10
    addi x6, -1

    ecall 0x00A
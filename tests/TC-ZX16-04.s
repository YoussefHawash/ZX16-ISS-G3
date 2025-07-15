.text
.org 0x0020

main:
    # Initialize SP
    li16 x2, 0xEFFE        # x2 = stack pointer

    # Store word
    li16 x3, 0x1234
    sw    x3, -2(x2)       # SP-2 = 0xEFFC
    lw    x4, -2(x2)       # x4 = 0x1234

    # Store signed byte
    li    x5, -12
    sb    x5, -3(x2)       # SP-3 = 0xEFFB
    lb    x6, -3(x2)       # x6 = -12

    # Store unsigned byte
    li16    x7, 0x3F
    sb    x7, -4(x2)
    lbu   x1, -4(x2)       # x1 = 63
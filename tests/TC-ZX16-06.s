.text
.org 0x0000
    j main

.org 0x0020
main:
    # Test LUI
    lui x1, 0x12         # x1 = 0x12 << 7 = 0x0900
    add x2, x1           # x2 = 0x0900 (just to verify)

    # Test AUIPC
    auipc x3, 0x01       # x3 = PC + (0x01 << 7)
                         # PC here is 0x0028 → x3 = 0x0028 + 0x0080 = 0x00A8
    add x4, x3           # x4 = x3 (copied)

    ecall 0x00A
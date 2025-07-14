.text
.org 0x0000
    j main

.org 0x0020
main:
    # Write tile index 5 to 0xF000
    li16 x1, 0xF000
    li   x2, 5
    sb   x2, 0(x1)

    # Write palette value 9 to 0xFA01
    li16 x3, 0xFA00
    li   x4, 9
    sb   x4, 1(x3)

    # Optional: trigger ECALL 9 to verify memory (dump at 0xF000)
    li16 x6, 0xF000   # base
    li   x7, 2        # length
    ecall 0x009       # dump 2 bytes from 0xF000

    ecall 0x00A       # exit
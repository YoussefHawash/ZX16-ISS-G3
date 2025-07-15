.text
.org 0x0000
    j main

.org 0x0020
main:
    li16 x6, 0x4000       # a0 = writable address
    li   x7, 20           # a1 = max input length

    ecall 0x001           # read string
    ecall 0x003           # print string
    ecall 0x00A           # exit
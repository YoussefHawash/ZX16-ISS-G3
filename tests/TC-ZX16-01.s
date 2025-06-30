.text
.org 0x0020

main:
    li x3, 5           # s0 = 5
    li x4, 5           # s1 = 5
    beq x3, x4, equal  #  branch
    li x5, 62          

equal:
    li x5, 42          # t1 = 42
    li x6, 0           # a0 = 0
    bz x6, done        #  branch

    li x5, 62          

done:
    ecall 0x008        # dump
    ecall 0x00A        # exit

.text
.org 0x0000
    j main

.org 0x0020
main:
    li x4, 0
    j skip_block

    li x4, 60
    li x4, 60
    li x4, 60

skip_block:
    li x2, 25           # simulate return address offset
    add x2, x2          # just preserve it
    j func

after_func:
    li x3, 55           # confirm return from func
    j done              # explicitly continue to done

func:
    li x4, 44           # confirm func ran
    jr x2               # return

done:
    li x7, 60
    ecall 10
.text
.org 0x0000

main:
        li16 a0, 254       # max volume
        ecall 5

        # — Opening Ascend: C5 → E5 → G5 → B5 → C6
        li16 a0, 523       # C5
        li16 a1, 100
        ecall 4

        li16 a0, 659       # E5
        li16 a1, 100
        ecall 4

        li16 a0, 784       # G5
        li16 a1, 100
        ecall 4

        li16 a0, 987       # B5
        li16 a1, 100
        ecall 4

        li16 a0, 1046      # C6
        li16 a1, 200       # hold the crown note
        ecall 4

        # — Royal Echo (soft repeat of C6)
        li16 a0, 1046
        li16 a1, 150
        ecall 4

        # — Flourish Descent: A5 → G5 → E5 → C5
        li16 a0, 880       # A5
        li16 a1, 120
        ecall 4

        li16 a0, 784       # G5
        li16 a1, 120
        ecall 4

        li16 a0, 659       # E5
        li16 a1, 150
        ecall 4

        li16 a0, 523       # C5
        li16 a1, 200       # resolution on home
        ecall 4

        # — Final Triumphant Trio: G5 → B5 → C6
        li16 a0, 784       # G5
        li16 a1, 80
        ecall 4

        li16 a0, 987       # B5
        li16 a1, 80
        ecall 4

        li16 a0, 1046      # C6
        li16 a1, 250       # grand finale hold
        ecall 4
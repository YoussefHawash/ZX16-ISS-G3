.org 0xF000
tile_map:

        .byte 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0
        .byte 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0
        .byte 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0
        .byte 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0
        .byte 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0
        .byte 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0
        .byte 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3

.org 0xF200
tile_def:

    tile0:  .fill 128, 1, 0x00  # Black Tile
    tile1:  .fill 128, 1, 0x11  # White Tile
    tile2:  .fill 128, 1, 0x44  # Red Tile
    tile3:  .fill 128, 1, 0x55  # Orange Tile
    tile4:  .fill 8, 1, 0x00                                        # Last third of title
            .fill 16, 1, 0x44
            .fill 16, 1, 0x55
            .fill 8, 1, 0x00
            .byte 0x10, 0x01, 0x00, 0x11, 0x10, 0x00, 0x00, 0x00
            .byte 0x11, 0x01, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00
            .byte 0x10, 0x11, 0x00, 0x11, 0x10, 0x00, 0x00, 0x00
            .byte 0x10, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00
            .byte 0x10, 0x01, 0x00, 0x11, 0x10, 0x00, 0x00, 0x00
            .fill 8, 1, 0x00
            .fill 16, 1, 0x55
            .fill 16, 1, 0x44
    tile5:  .fill 32, 1, 0x00                                       # First third of player selection
            .byte 0x01, 0x11, 0x00, 0x11, 0x10, 0x00, 0x11, 0x10
            .byte 0x01, 0x01, 0x00, 0x10, 0x01, 0x00, 0x10, 0x00
            .byte 0x01, 0x11, 0x00, 0x11, 0x10, 0x00, 0x11, 0x10
            .byte 0x01, 0x00, 0x00, 0x10, 0x10, 0x00, 0x10, 0x00
            .byte 0x01, 0x00, 0x00, 0x10, 0x01, 0x00, 0x11, 0x10
            .fill 16, 1, 0x00
            .byte 0x00, 0x10, 0x00, 0x00, 0x11, 0x00, 0x11, 0x10
            .byte 0x00, 0x10, 0x00, 0x01, 0x00, 0x10, 0x10, 0x10
            .byte 0x00, 0x10, 0x00, 0x01, 0x00, 0x10, 0x11, 0x10
            .byte 0x00, 0x10, 0x00, 0x01, 0x00, 0x10, 0x11, 0x00
            .byte 0x00, 0x10, 0x00, 0x00, 0x11, 0x00, 0x10, 0x10
    tile6:  .fill 32, 1, 0x00                                       # Second third of player selection
            .byte 0x01, 0x11, 0x00, 0x11, 0x10, 0x01, 0x00, 0x01
            .byte 0x01, 0x00, 0x00, 0x10, 0x00, 0x01, 0x00, 0x10
            .byte 0x01, 0x11, 0x00, 0x11, 0x10, 0x01, 0x00, 0x10
            .byte 0x00, 0x01, 0x00, 0x00, 0x10, 0x01, 0x00, 0x10
            .byte 0x01, 0x11, 0x00, 0x11, 0x10, 0x01, 0x00, 0x01
            .fill 16, 1, 0x00
            .byte 0x11, 0x10, 0x11, 0x10, 0x10, 0x00, 0x01, 0x10
            .byte 0x00, 0x10, 0x10, 0x10, 0x10, 0x00, 0x10, 0x01
            .byte 0x11, 0x10, 0x11, 0x10, 0x10, 0x00, 0x11, 0x11
            .byte 0x10, 0x00, 0x10, 0x00, 0x10, 0x00, 0x10, 0x01
            .byte 0x11, 0x10, 0x10, 0x00, 0x11, 0x10, 0x10, 0x01
    tile7:  .fill 32, 1, 0x00                                       # Last third of player selection
            .byte 0x10, 0x01, 0x11, 0x00, 0x01, 0x11, 0x00, 0x00 
            .byte 0x01, 0x01, 0x00, 0x10, 0x00, 0x01, 0x00, 0x00
            .byte 0x01, 0x01, 0x11, 0x00, 0x01, 0x11, 0x00, 0x00
            .byte 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00
            .byte 0x10, 0x01, 0x00, 0x10, 0x01, 0x11, 0x00, 0x00
            .fill 16, 1, 0x00
            .byte 0x10, 0x10, 0x11, 0x10, 0x11, 0x10, 0x01, 0x11
            .byte 0x01, 0x00, 0x10, 0x00, 0x10, 0x01, 0x01, 0x00
            .byte 0x01, 0x00, 0x11, 0x10, 0x11, 0x10, 0x01, 0x11
            .byte 0x01, 0x00, 0x10, 0x00, 0x10, 0x10, 0x00, 0x01
            .byte 0x01, 0x00, 0x11, 0x10, 0x10, 0x01, 0x01, 0x11
    tile8:  .fill 40, 1, 0x00                                       # First half of score
            .byte 0x00, 0x03, 0x30, 0x00, 0x33, 0x30, 0x00, 0x03
            .byte 0x00, 0x03, 0x00, 0x00, 0x30, 0x00, 0x00, 0x30
            .byte 0x00, 0x03, 0x30, 0x00, 0x30, 0x00, 0x00, 0x30
            .byte 0x00, 0x03, 0x30, 0x00, 0x30, 0x00, 0x00, 0x30
            .byte 0x00, 0x03, 0x30, 0x00, 0x33, 0x30, 0x00, 0x03
            .fill 48, 1, 0x00
    tile9:  .fill 40, 1, 0x00                                       # Second half of score
            .byte 0x30, 0x00, 0x03, 0x33, 0x00, 0x03, 0x33, 0x00
            .byte 0x03, 0x00, 0x03, 0x03, 0x00, 0x03, 0x00, 0x00
            .byte 0x03, 0x00, 0x03, 0x30, 0x00, 0x03, 0x33, 0x00
            .byte 0x03, 0x00, 0x03, 0x30, 0x00, 0x03, 0x00, 0x00
            .byte 0x30, 0x00, 0x03, 0x03, 0x00, 0x03, 0x33, 0x00
            .fill 48, 1, 0x00
    tile10: .space 128
    tile11: .space 128
    tile12: .space 128
    tile13: .space 128
    tile14: .space 128
    tile15: .space 128

.org 0xFA00
palette:

.byte 0x00, 0xFF # Black & White
.byte 0x0C, 0xFC # Green & Yellow (Points and Score)
.byte 0xE0, 0xE8 # Red & Orange

.data
blackScreen:
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
selectScreen:
        .byte 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0
        .byte 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0
        .byte 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0
        .byte 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0
        .byte 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0
        .byte 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0
        .byte 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0
        .byte 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0
        .byte 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
pongScreen:
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        .byte 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        .byte 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

stateUP1: 
        .byte 0         # State for player 1: if 1 then player 1 is moving up, else if -1 then player 1 is moving down
stateUP2: 
        .byte 0         # State for player 2: if 1 then player 2 is moving up, else if -1 then player 2 is moving down
p1Position:
        .word 120       # Initial position for player 1
p2Position:
        .word 139       # Initial position for player 2
ballState:
        .byte 0        # State for the ball: if 0 then the ball is moving bottom-left, if 1 ball is moving bottom-right, if 2 ball is moving top-left, and if 3 ball is moving top-right
ballPosition:
        .word 48        # Initial position for the ball

.org 0x0000
j newGame

.text
newGame:
        la a0, blackScreen
        call drawScreen
        la a0, selectScreen
        call drawScreen

selectPlayers:
        li16 a0, '1' # ASCII code for '1'
        ecall 7
        li t0, 1
        beq a0, t0, one_player_mode
        li16 a0, '2' # ASCII code for '2'
        ecall 7
        beq a0, t0, two_player_mode
        j selectPlayers # If neither '1' nor '2' was pressed, loop again

one_player_mode:
        j gameLoop

two_player_mode:
        la a0, pongScreen
        call drawScreen

gameLoop:
        call handleInput 
        call movePadel1
        call movePadel2
        call moveBall
        j gameLoop
gameExit:
        ecall 10

# This function is used to draw the tile map to the screen.
# It takes the address (a0) of the tile map in a0 and draws it to the tile_map
drawScreen:
        la t0, tile_map
        li s0, 0
        li16 t1, 300
loop:   bge s0, t1, drawScreenExit
        lb s1, 0(a0)
        sb s1, 0(t0)
        addi t0, 1
        addi a0, 1
        addi s0, 1
        j loop
drawScreenExit:   ret

handleInput:
        li16 a0, 'w' # ASCII code for 'w'
        ecall 7
        li t0, 1
        beq a0, t0, jumpMUP1 # Branch to "jump move up for player 1" if 'w' was pressed
        li16 a0, 'W' # ASCII code for 'w'
        ecall 7
        beq a0, t0, jumpMUP1 # Branch to "jump move up for player 1" if 'W' was pressed

        j notJumpMUP1 # If 'w' or 'W' was not pressed
        jumpMUP1:
        li s0, 1 # Set stateUP1 to 1 (moving up)
        la t0, stateUP1
        sb s0, 0(t0) # Store the state in memory
        ret
        notJumpMUP1:

        li16 a0, 's' # ASCII code for 's'
        ecall 7
        beq a0, t0, jumpMDOWN1 # Branch to "jump move down for player 1" if 's' was pressed
        li16 a0, 'S' # ASCII code for 'S'
        ecall 7
        beq a0, t0, jumpMDOWN1 # Branch to "jump move down for player 1" if 'S' was pressed

        j notJumpMDOWN1 # If 's' or 'S' was not pressed
        jumpMDOWN1:
        li s0, -1 # Set stateUP1 to -1 (moving down)
        la t0, stateUP1
        sb s0, 0(t0) # Store the state in memory
        ret
        notJumpMDOWN1:

        li16 a0, 'o' # ASCII code for 'o'
        ecall 7
        beq a0, t0, jumpMUP2 # Branch to "jump move up for player 2" if 'o' was pressed
        li16 a0, 'O' # ASCII code for 'O'
        ecall 7
        beq a0, t0, jumpMUP2 # Branch to "jump move up for player 2" if 'O' was pressed

        j notJumpMUP2 # If 'o' or 'O' was not pressed
        jumpMUP2:
        li s0, 1 # Set stateUP2 to 1 (moving up)
        la t0, stateUP2
        sb s0, 0(t0) # Store the state in the memory
        ret
        notJumpMUP2:

        li16 a0, 'l' # ASCII code for 'l'
        ecall 7
        beq a0, t0, jumpMDOWN2 # Branch to "jump move down for player 2" if 'l' was pressed
        li16 a0, 'L' # ASCII code for 'L'
        ecall 7
        beq a0, t0, jumpMDOWN2 # Branch to "jump move down for player 2" if 'L' was pressed
        ret

        jumpMDOWN2:
        li s0, -1 # Set stateUP2 to -1 (moving down)
        la t0, stateUP2
        sb s0, 0(t0) # Store the state in the memory
        ret
        
# This function is used to check the current state desired by player 1.
# It checks if player 1 wants to move up or down and calls the appropriate function.   
movePadel1:
        la t0, stateUP1
        lb s0, 0(t0) # Load the current state of player 1
        li t1, 1 # Constant for moving up
        beq s0, t1, jumpMUP_P1 # If player 1 is moving up, branch to the intermediate "jump to move up for player 1"
        li t1, -1 # Constant for moving down

        j notJumpMUP_P1
        jumpMUP_P1:
        j moveUp1 # Jump to "move up for player 1"
        notJumpMUP_P1:

        beq s0, t1, jumpMDOWN_P1 # If player 1 is moving down, branch to the intermediate "jump to move down for player 1"
        ret

        jumpMDOWN_P1:
        j moveDown1 # Jump to "move down for player 1"

# This function is used to move player 1s padel up.
# It checks the current position of player 1 and updates it accordingly.
moveUp1:
        la t0, p1Position
        lw s0, 0(t0) # Load the current position of player 1
        li16 t1, 0
        bge t1, s0, jumpMoveUp_P1Exit # If the position is less than 0, exit
        j afterJumpMoveUp_P1Exit # Jump to exit

        jumpMoveUp_P1Exit:
        j moveUp1Exit # Jump to exit
        afterJumpMoveUp_P1Exit:

        addi s0, -20 # Move the top of player 1s padel up by 20 pixels
        sw s0, 0(t0) # Update the position of player 1
        la t1, tile_map
        add t1, s0
        li s1, 1 # Load a white tile at the start of the padel for player 1
        sb s1, 0(t1) # Load the tile map

        addi s0, 60 # Delete the bottom of player 1s padel that is positioned under the top of the padel by 60 pixels
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the end of the padel for player 1
        sb s1, 0(t1) # Load the tile map
moveUp1Exit:
        ret

# This function is used to move player 1s padel down.
# It checks the current position of player 1 and updates it accordingly.
moveDown1:
        la t0, p1Position
        lw s0, 0(t0) # Load the current position of player 1
        li16 t1, 240
        bge s0, t1, jumpMoveDown_P1Exit # If the position is greater than 240, exit
        j afterJumpMoveDown_P1Exit # Jump to exit

        jumpMoveDown_P1Exit:
        j moveDown1Exit # Jump to exit
        afterJumpMoveDown_P1Exit:

        addi s0, 20 # Move the top of player 1s padel down by 20 pixels
        sw s0, 0(t0) # Update the position of player 1
        addi s0, 40
        la t1, tile_map
        add t1, s0
        li s1, 1 # Load a white tile at the end of the padel for player 1
        sb s1, 0(t1) # Load the tile map

        addi s0, -60 # Delete the top of player 1s padel that is positioned above the end of the padel by 60 pixels
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the start of the padel for player 1
        sb s1, 0(t1) # Load the tile map
moveDown1Exit:
        ret

# This function is used to check the current state desired by player 2.
# It checks if player 2 wants to move up or down and calls the appropriate function.
movePadel2:
        la t0, stateUP2
        lb s0, 0(t0) # Load the current state of player 2
        li t1, 1 # Constant for moving up
        beq s0, t1, jumpMUP_P2 # If player 2 is moving up, branch to the intermediate "jump to move up for player 2"
        li t1, -1 # Constant for moving down

        j notJumpMUP_P2
        jumpMUP_P2:
        j moveUp2 # Jump to "move up for player 2"
        notJumpMUP_P2:

        beq s0, t1, jumpMDOWN_P2 # If player 2 is moving down, branch to the intermediate "jump to move down for player 2"
        ret

        jumpMDOWN_P2:
        j moveDown2 # Jump to "move down for player 2"

# This function is used to move player 2s padel up.
# It checks the current position of player 2 and updates it accordingly.
moveUp2:
        la t0, p2Position
        lw s0, 0(t0) # Load the current position of player 2
        li16 t1, 19
        bge t1, s0, jumpMoveUp_P2Exit # If the position is less than 19, exit
        j afterJumpMoveUp_P2Exit # Jump to exit

        jumpMoveUp_P2Exit:
        j moveUp2Exit # Jump to exit
        afterJumpMoveUp_P2Exit:

        addi s0, -20 # Move the top of player 2s padel up by 20 pixels
        sw s0, 0(t0) # Update the position of player 2
        la t1, tile_map
        add t1, s0
        li s1, 1 # Load a white tile at the start of the padel for player 2
        sb s1, 0(t1) # Load the tile map

        addi s0, 60 # Delete the bottom of player 2s padel that is positioned under the top of the padel by 60 pixels
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the end of the padel for player 2
        sb s1, 0(t1) # Load the tile map
moveUp2Exit:
        ret

# This function is used to move player 2s padel down.
# It checks the current position of player 2 and updates it accordingly.
moveDown2:
        la t0, p2Position
        lw s0, 0(t0) # Load the current position of player 2
        li16 t1, 259
        bge s0, t1, jumpMoveDown_P2Exit # If the position is greater than 259, exit
        j afterJumpMoveDown_P2Exit # Jump to exit

        jumpMoveDown_P2Exit:
        j moveDown2Exit # Jump to exit
        afterJumpMoveDown_P2Exit:

        addi s0, 20 # Move the top of player 2s padel down by 20 pixels
        sw s0, 0(t0) # Update the position of player 2
        addi s0, 40
        la t1, tile_map
        add t1, s0
        li s1, 1 # Load a white tile at the end of the padel for player 2
        sb s1, 0(t1) # Load the tile map

        addi s0, -60 # Delete the top of player 2s padel that is positioned above the end of the padel by 60 pixels
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the start of the padel for player 2
        sb s1, 0(t1) # Load the tile map
moveDown2Exit:
        ret

# This function is used to move the ball based on its current state.
# It checks the current state of the ball and calls the appropriate function to move it.
moveBall:
        la t0, ballState
        lb s0, 0(t0)    # Load current ball state
        li t1, 0        # Constant for moving bottom-left
        beq s0, t1, jumpMBBL   # If the ball is moving bottom-left, branch to moveBallBottom_Left
        li t1, 1        # Constant for moving bottom-right

        j notJumpMBBL # If the ball is not moving bottom-left, jump to notJumpMBBL
        jumpMBBL:
        j moveBallBottom_Left
        notJumpMBBL:

        beq s0, t1, jumpMBBR  # If ball is moving bottom-right, branch to moveBallBottom_Right
        li t1, 2        # Constant for moving top-left
        
        j notJumpMBBR # If ball is not moving bottom-right, jump to notJumpMBBR
        jumpMBBR:
        j moveBallBottom_Right
        notJumpMBBR:

        beq s0, t1, jumpMBTL     # If ball is moving top-left, branch to moveBallTop_Left
        li t1, 3        # Constant for moving top-right

        j notJumpMBTL # If ball is not moving top-left, jump to notJumpMBTL
        jumpMBTL:
        j moveBallTop_Left
        notJumpMBTL:

        beq s0, t1, jumpMBTR    # If ball is moving top-right, branch to moveBallTop_Right
        ret
        
        jumpMBTR:
        j moveBallTop_Right

# This function is used to move the ball down and to the left.
# It checks the current position of the ball and updates it accordingly.
moveBallBottom_Left:
        la t0, ballPosition
        lw s0, 0(t0) # Load the current position of the ball
        li16 t1, 280
        bge s0, t1, jumpMoveBallBottom_LeftExit # If the position is greater than 280, exit
        j afterJumpMoveBallBottom_LeftExit # Jump to exit

        jumpMoveBallBottom_LeftExit:
        j moveBallBottom_LeftExit # Jump to exit
        afterJumpMoveBallBottom_LeftExit:

        addi s0, 19 # Move the ball down by 19 pixels
        sw s0, 0(t0) # Update the position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 2 # Load a red tile for the ball
        sb s1, 0(t1) # Load the tile map

        addi s0, -19 # Delete the the ball that is positioned 19 pixels before the new position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the old position of the ball
        sb s1, 0(t1) # Load the tile map
moveBallBottom_LeftExit:
        ret

# This function is used to move the ball down and to the right.
# It checks the current position of the ball and updates it accordingly.
moveBallBottom_Right:
        la t0, ballPosition
        lw s0, 0(t0) # Load the current position of the ball
        li16 t1, 299
        bge s0, t1, jumpMoveBallBottom_RightExit # If the position is greater than 299, exit
        j afterJumpMoveBallBottom_RightExit # Jump to exit

        jumpMoveBallBottom_RightExit:
        j moveBallBottom_RightExit # Jump to exit
        afterJumpMoveBallBottom_RightExit:

        addi s0, 21 # Move the ball down by 21 pixels
        sw s0, 0(t0) # Update the position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 2 # Load a red tile for the ball
        sb s1, 0(t1) # Load the tile map

        addi s0, -21 # Delete the the ball that is positioned 21 pixels before the new position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the old position of the ball
        sb s1, 0(t1) # Load the tile map
moveBallBottom_RightExit:
        ret

# This function is used to move the ball up and to the left.
# It checks the current position of the ball and updates it accordingly.
moveBallTop_Left:
        la t0, ballPosition
        lw s0, 0(t0) # Load the current position of the ball
        li16 t1, 0
        bge t1, s0, jumpMoveBallTop_LeftExit # If the position is less than 0, exit
        j afterJumpMoveBallTop_LeftExit # Jump to exit

        jumpMoveBallTop_LeftExit:
        j moveBallTop_LeftExit # Jump to exit
        afterJumpMoveBallTop_LeftExit:

        addi s0, -21 # Move the ball up by 21 pixels
        sw s0, 0(t0) # Update the position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 2 # Load a red tile for the ball
        sb s1, 0(t1) # Load the tile map

        addi s0, 21 # Delete the the ball that is positioned 21 pixels after the new position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the old position of the ball
        sb s1, 0(t1) # Load the tile map
moveBallTop_LeftExit:
        ret

# This function is used to move the ball up and to the right.
# It checks the current position of the ball and updates it accordingly.
moveBallTop_Right:
        la t0, ballPosition
        lw s0, 0(t0) # Load the current position of the ball
        li16 t1, 0
        bge t1, s0, jumpMoveBallTop_RightExit # If the position is less than 0, exit
        j afterJumpMoveBallTop_RightExit # Jump to exit

        jumpMoveBallTop_RightExit:
        j moveBallTop_RightExit # Jump to exit
        afterJumpMoveBallTop_RightExit:

        addi s0, -19 # Move the ball up by 19 pixels
        sw s0, 0(t0) # Update the position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 2 # Load a red tile for the ball
        sb s1, 0(t1) # Load the tile map

        addi s0, 19 # Delete the the ball that is positioned 19 pixels after the new position of the ball
        la t1, tile_map
        add t1, s0
        li s1, 0 # Load a black tile at the old position of the ball
        sb s1, 0(t1) # Load the tile map
moveBallTop_RightExit:
        ret
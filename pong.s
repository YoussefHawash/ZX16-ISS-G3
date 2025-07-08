.org 0xF000
tile_map:

        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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
titleScreen:
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
        .byte 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0
        .byte 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0
        .byte 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
pongScreen:
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        .byte 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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

.org 0x0000
j newGame

.text
newGame:
        la a0, blackScreen
        call drawScreen
        la a0, titleScreen
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
        call movePadels
        j gameLoop
gameExit:
        ecall 10

handleInput:
        li16 a0, 'w' # ASCII code for 'w'
        ecall 7
        li t0, 1
        beq a0, t0, jumpMUP # Branch to "jump move up" if 'w' was pressed
        li16 a0, 'W' # ASCII code for 'w'
        ecall 7
        beq a0, t0, jumpMUP # Branch to "jump move up" if 'W' was pressed

        j notJumpMUP # If 'w' or 'W' was not pressed, continue to check for 's'
        jumpMUP:
        li s0, 1 # Set stateUP1 to 1 (moving up)
        la t0, stateUP1
        sb s0, 0(t0) # Store the state in memory
        ret
        notJumpMUP:

        li16 a0, 's' # ASCII code for 's'
        ecall 7
        beq a0, t0, jumpMDOWN # Branch to "jump move down" if 's' was pressed
        li16 a0, 'S' # ASCII code for 'S'
        ecall 7
        beq a0, t0, jumpMDOWN # Branch to "jump move down" if 'S' was pressed
        ret

        jumpMDOWN:
        li s0, -1 # Set stateUP1 to -1 (moving down)
        la t0, stateUP1
        sb s0, 0(t0) # Store the state in memory
        ret
        
movePadels:
        la t0, stateUP1
        lb s0, 0(t0) # Load the current state of player 1
        li t1, 1 # Constant for moving up
        beq s0, t1, jumpMUP1 # If player 1 is moving up, branch to "jump to move up for player 1"
        li t1, -1 # Constant for moving down

        j notJumpMUP1
        jumpMUP1:
        j moveUp1 # Jump to "move up for player 1"
        notJumpMUP1:

        beq s0, t1, jumpMDOWN1 # If player 1 is moving down, branch to "jump to move down for player 1"
        ret

        jumpMDOWN1:
        j moveDown1 # Jump to "move down for player 1"

moveUp1:
        la t0, p1Position
        lw s0, 0(t0) # Load the current position of player 1
        li16 t1, 0
        bge t1, s0, jumpMoveUp1Exit # If the position is less than 0, exit
        j afterJumpMoveUp1Exit # Jump to exit

        jumpMoveUp1Exit:
        j moveUp1Exit # Jump to exit
        afterJumpMoveUp1Exit:

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

moveDown1:
        la t0, p1Position
        lw s0, 0(t0) # Load the current position of player 1
        li16 t1, 240
        bge s0, t1, jumpMoveDown1Exit # If the position is greater than 240, exit
        j afterJumpMoveDown1Exit # Jump to exit

        jumpMoveDown1Exit:
        j moveDown1Exit # Jump to exit
        afterJumpMoveDown1Exit:

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
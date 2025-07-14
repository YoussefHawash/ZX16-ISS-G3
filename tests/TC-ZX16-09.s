
    # 0 = black; 1 = white; 2 = red; 3 = green; 4 = blue
    # 5 = yellow; 6 = magenta; 7 = cyan; 8 = dark gray; 9 = light gray
    # 10 = orange; 11 = purple; 12 = teal; 13 = brown; 14 = pink; 15 = olive
        .org 0xFA00
palette:
        .byte 0x00   # [ 0] Black      (0,0,0)
        .byte 0xFF   # [ 1] White      (7,7,3)
        .byte 0xE0   # [ 2] Red        (7,0,0)
        .byte 0x1C   # [ 3] Green      (0,7,0)
        .byte 0x03   # [ 4] Blue       (0,0,3)
        .byte 0xFC   # [ 5] Yellow     (7,7,0)
        .byte 0xE3   # [ 6] Magenta    (7,0,3)
        .byte 0x1F   # [ 7] Cyan       (0,7,3)
        .byte 0x92   # [ 8] DarkGray   (4,4,2)
        .byte 0xB6   # [ 9] LightGray  (5,5,2)
        .byte 0xEC   # [10] Orange     (7,3,0)
        .byte 0xA3   # [11] Purple     (5,0,3)
        .byte 0x17   # [12] Teal       (0,5,3)
        .byte 0xA9   # [13] Brown      (5,2,1)
        .byte 0xEB   # [14] Pink       (7,2,3)
        .byte 0x91   # [15] Olive      (4,4,1)
        .org 0xF200

        tile_def:
        tile0:   .fill 128,1,0x00   # palette 0 (black)
        tile1:   .fill 128,1,0x11   # palette 1 (white)
        tile2:   .fill 128,1,0x22   # palette 2 (red)
        tile3:   .fill 128,1,0x33   # palette 3 (green)
        tile4:   .fill 128,1,0x44   # palette 4 (blue)
        tile5:   .fill 128,1,0x55   # palette 5 (yellow)
        tile6:   .fill 128,1,0x66   # palette 6 (magenta)
        tile7:   .fill 128,1,0x77   # palette 7 (cyan)
        tile8:   .fill 128,1,0x88   # palette 8 (dark gray)
        tile9:   .fill 128,1,0x99   # palette 9 (light gray)
        tile10:  .fill 128,1,0xAA   # palette 10 (orange)
        tile11:  .fill 128,1,0xBB   # palette 11 (purple)
        tile12:  .fill 128,1,0xCC   # palette 12 (teal)
        tile13:  .fill 128,1,0xDD   # palette 13 (brown)
        tile14:  .fill 128,1,0xEE   # palette 14 (pink)
        tile15:  .fill 128,1,0xFF   # palette 15 (olive)
                .org 0xF000
        tile_map:
        
        # Each row: palette indices 0–15, then 0–3 to fill 20 columns
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3

        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3

        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
        .byte 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3
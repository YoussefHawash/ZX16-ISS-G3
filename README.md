# G3 - ZX16 Instruction Set Simulator (ISS)

## Project Objective

The goal of this project is to design and implement an **Instruction Set Simulator (ISS)** for the **ZX16 architecture** - an open-source, educational ISA inspired by RISC-V and developed at the American University in Cairo (AUC). Our simulator emulates the ZX16 CPU, handles memory and register operations, executes binary-encoded instructions, and supports both terminal and visual testing environments.

We extended the project with a complete **graphical frontend**, making it intuitive for users to load `.bin` files, step through instructions, and visually debug CPU behavior.

---

## Key Features

- **Full ZX16 ISA instruction support**
- **Real-time disassembly** via a custom-built disassembler
- **64 KB memory map** with hardware-mapped I/O
- **2D Tiled Graphics System** (320 * 240 QVGA resolution)
- **Interactive Keyboard Input**
- **Register tracking**, updated every clock cycle
- **Terminal with CLI-like logging**
- **Step, Pause, Resume** execution control
- **Web Interface** built with Next.js + Monaco Editor

---

## Repository Structure

```bash
.
├── components/              # Frontend React components
│   ├── codewindow.tsx       # Monaco editor with syntax highlighting
│   ├── computer.tsx         # Main CPU interface container
│   ├── keyboard.tsx         # Virtual keyboard visualization
│   ├── registerTable.tsx    # Register view
│   ├── screen.tsx           # Tile-based display
│   ├── terminal.tsx         # CLI logger
│   └── TextUpload.tsx       # Upload component for .bin files
├── lib/
│   ├── cpu.ts               # Core simulation logic
│   ├── disassembler.ts      # Machine code to human-readable translation
│   ├── utils.ts             # Binary <-> decimal/string utilities
│   ├── z16-INST.json        # Instruction format definitions
├── public/
│   └── monaco/              # Monaco Editor dependency
```

---

## Design Overview

### Backend (Simulator)
- Implemented in `cpu.ts`, the simulator that handles the **fetch-decode-execute** cycle.
- Utilizes a **disassembler** (`disassembler.ts`) to map binary instructions to readable ZX16 assembly.
- Implements `ecall`-based system calls for I/O, audio, memory dumps, and termination.
- Tracks a program counter, 8 general-purpose registers (`x0-x7`), and memory changes on every clock cycle.

### Frontend (UI)
- Built with **Next.js** and **Tailwind CSS**.
- Integrates **Monaco Editor** for instruction visualization with custom syntax highlighting.
- Custom components visualize:
  - CPU state (registers)
  - Tile-based screen display
  - Terminal command interaction
  - File upload and memory binding

---

### Graphics System Architecture

The ZX16 ISS features a memory-mapped 2D **tiled graphics engine** that emulates classic game console behavior. The virtual screen is composed of tiles, and each tile references packed pixel data and a shared color palette.

#### Display Overview

| Property              | Value                        |
|-----------------------|------------------------------|
| Resolution            | 320 * 240 pixels (QVGA)      |
| Tile Dimensions       | 16 * 16 pixels               |
| Screen Grid           | 20 * 15 tiles (300 total)    |
| Color Depth           | 4 bits per pixel (16 colors) |

---

#### Memory Map Layout

| Memory Region       | Address Range       | Size    | Purpose |
|---------------------|---------------------|---------|---------|
| **Tile Map Buffer** | `0xF000 - 0xF12B`    | 300 B   | Row-major grid of tile IDs (0-15) for screen layout |
| **Tile Definitions**| `0xF200 - 0xF9FF`    | 2048 B  | Pixel data for 16 tiles (128 bytes per tile) |
| **Color Palette**   | `0xFA00 - 0xFA0F`    | 16 B    | 16-entry palette defining RGB colors |

---

#### Tile Data Storage

Each tile is a 16 * 16 pixel square, so it has **256 pixels total**. Every pixel uses 4 bits to choose one of the 16 palette colors.

Since **1 byte = 8 bits**, each byte holds **two pixels**:

- **Low nibble** (4 bits): the **first pixel**
- **High nibble** (4 bits): the **second pixel**

##### How it works:

| Byte | Pixel Contents           |
|------|---------------------------|
| 0    | Pixel 0 (low), Pixel 1 (high) |
| 1    | Pixel 2 (low), Pixel 3 (high) |
| ...  | ...                         |
| 127  | Pixel 254 (low), Pixel 255 (high) |

Each tile is exactly **128 bytes** long:
```
256 pixels * 4 bits per pixel / 8 bits per byte = 128 bytes
```

So in the memory:
```
Byte 0:  [Pixel 0 | Pixel 1]
Byte 1:  [Pixel 2 | Pixel 3]
...
Byte 127: [Pixel 254 | Pixel 255]
```

This compact format lets the system store high-resolution color tiles in very little space, perfect for old-school games and low-memory environments.

---

#### Color Palette Format

Each color is defined in a single byte using compact RGB encoding:

| Component | Bits Used | Bit Positions |
|-----------|-----------|----------------|
| Red       | 3 bits    | [7, 6, 5]       |
| Green     | 3 bits    | [4, 3, 2]       |
| Blue      | 2 bits    | [1, 0]          |

Example:
```
0b10011001 -> R = 4, G = 6, B = 1 (a bright greenish color)
```

---

#### Rendering Process Summary

1. **Tile Map**: Emulator reads tile indices (0-15) from `0xF000`.
2. **Tile Data**: Each index maps to a tile definition starting at `0xF200`.
3. **Color Index**: Pixels in the tile point to 4-bit color entries.
4. **Palette**: Index is converted to RGB via lookup from `0xFA00`.
5. **Output**: The 320 * 240 screen is drawn based on decoded RGB values.

---

## Usage Guide

### Run Locally

```bash
yarn install
yarn run dev
```

Navigate to: [http://localhost:3000](http://localhost:3000)

### Interface Controls

- **Upload `.bin`**: Load compiled ZX16 binary file
- **Play/Pause**: Control clock-driven instruction execution
- **Step**: Manual single-instruction stepping
- **View**:
  - Assembly (Monaco)
  - Registers
  - Graphics display
  - Keyboard input
  - Console logs

---

## Testing Strategy

All test files are stored in `tests/`:

```
tests/
├── TC-ZX16-01.s
├── TC-ZX16-01.bin
├── TC-ZX16-01.expected
...
```

Each test case is documented with:
- Test ID & Objective
- Steps
- Expected register/memory/console state

We ensured **requirement coverage** for:
- Arithmetic, logic, memory ops, branching
- Ecall service behavior
- Graphics rendering and palette mapping

---

## Accomplishments

- Fully functional simulator with **interactive frontend**
- All **ZX16 ISA instructions** implemented
- Tile memory graphics rendered according to ZX16 specs
- **Live register/memory view** for debugging
- Accurate **disassembler output** with dynamic updates
- 10+ test cases with expected outputs
- Git-based workflow and modular architecture

---

## Team Members

- Youssef Hawash
- Ahmed Elzahaby
- Mahmoud Aly

---

## References

- [ZX16 ISA Repository](https://github.com/shalan/z16.git)
- CSCE 2303 Project Description (zx16-sim.pdf)

---

## License

This project is created for educational purposes for CSCE 2303 - Summer 2025 at the American University in Cairo.

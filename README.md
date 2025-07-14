
# G3 - ZX16 Instruction Set Simulator (ISS)

## Project Objective

The goal of this project is to design and implement an **Instruction Set Simulator (ISS)** for the **ZX16 architecture** - an open-source, educational ISA inspired by RISC-V and developed at the American University in Cairo (AUC). Our simulator emulates the ZX16 CPU, handles memory and register operations, executes binary-encoded instructions, and supports both terminal and visual testing environments, while enriching user experience with tools that will help them throught the simulation such as, **Memory Inspector** and **Binary to Hex Converter**.

We extended the project with a complete **graphical frontend**, making it intuitive for users to load `.bin` files, step through instructions, and visually debug CPU behavior.

## Key Features

- **Full ZX16 ISA instruction support**

- **Real-time disassembling** via a custom-built disassembler

- **64 KB memory map** with hardware-mapped I/O

- **2D Tiled Graphics System** (320 \* 240 QVGA resolution)

- **Interactive Keyboard Input**

- **Register tracking**, updated every clock cycle

- **Terminal with CLI-like logging**

- **Step, Pause, Resume** execution control

- **Web Interface** built with Next.js + Monaco Editor

- **Built-in Assembler** for easier Devlopment Enviroment

## Repository Structure

```bash

z16-sim/  
├── app/  
│ ├── _components/  
│ │ ├── CodeEditor.tsx   # CodeEditor to show the assembly Code
│ │ ├── convertor.tsx  	# Bases Convertor
│ │ ├── custom-dialog.tsx  # For hosting the code editor
│ │ ├── Editor.tsx  # Custom Editor for writing assembly
│ │ ├── Grid.tsx  # Grid Layout
│ │ ├── NavBar.tsx  # Navbar
│ │ ├── Panel.tsx  # To host the console
│ │ ├── screen.tsx  
│ │ ├── Side-Menu.tsx  
│ │ └── TextUpload.tsx  
│ ├── api/  
│ │ └── assemble/  
│ │ └── route.ts  # Assembler API
│ ├── favicon.ico  
│ ├── globals.css  
│ ├── layout.tsx  
│ └── page.tsx  
├── components/  
├── hooks/  
│	└── use-cpu.ts  
├── lib/  
│ ├── Types/  
│ │── BufferContext.tsx  
│ ├── constants.ts  
│ ├── cpu.ts  # simulator
│ ├── disassembler.ts  # disassembler
│ ├── utils.ts  
│ └── worker.ts  
├── node_modules/  
├── public/  
│ ├── monaco/  
│ └── logo.svg  
├── z16-INST.json  
├── scripts/  # Assembler Code
│ ├── constants.py  
│ ├── definitions.py  
│ ├── error_handler.py  
│ ├── first_pass.py  
│ ├── main.py  
│ ├── second_pass.py  
│ └── tokenizer.py

```

## Design Overview

### Backend (Simulator)

- Implemented in `cpu.ts`, the simulator that handles the **fetch-decode-execute** cycle.

- Utilizes a **disassembler** (`disassembler.ts`) to map binary instructions to readable ZX16 assembly.

- Implements `ecall`-based system calls for I/O, audio, memory dumps, and termination.

- Tracks a program counter, 8 general-purpose registers (`x0-x7`), and memory changes on every clock cycle.
- Integerated Assembler for easier devlopement 

### Frontend (UI)

- Built with **Next.js** and **Tailwind CSS**.

- Integrates **Monaco Editor** for instruction visualization with custom syntax highlighting.

- Custom components visualize:

- CPU state (registers)

- Tile-based screen display

- Terminal command interaction

- File upload and memory binding

## Build Instructions & Usage Guide

You should have **Node Js** install on your device through this [Link](https://nodejs.org/en/download)

### Install Dependencies

```bash
cd  ./z16-sim

npm  install 

```

### Run Locally

```bash

npm run dev

```

Navigate to the link provided in the cmd response after **" Local: "**

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

---

## TC-ZX16-01: R-Type and I-Type Functional Test

**Test Objective:**  
Validate correct execution of R-type and I-type instructions including arithmetic, logical operations, comparisons, and shifts.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-01.s -o tests/TC-ZX16-01.bin
```

**Expected Results:**
| Reg | Value | Explanation                  |
| --- | ----- | ---------------------------- |
| x0  | 0     | Always zero                  |
| x1  | 0     | Result of `slt x1, x2`       |
| x2  | 0     | Overwritten by `sltu x2, x1` |
| x3  | 3     | `add` then `sll` on x3       |
| x4  | -10   | `sub x4, x1`                 |
| x5  | 3     | `xor` then `sra`             |
| x6  | 3     | `mv x6, x3`                  |
| x7  | 10    | `or x7, x1` from `li x1, 10` |

## TC-ZX16-02: I-Type Immediate and Shift Test

**Test Objective:**  
Validate I-type instruction behavior with signed/unsigned comparisons, bitwise immediates, and shift operations.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-02.s -o tests/TC-ZX16-02.bin
```

**Expected Results:**
| Reg | Value | Explanation                             |
| --- | ----- | --------------------------------------- |
| x0  | 0     | Constant zero                           |
| x1  | 15    | `10 OR 0x0F = 15`                       |
| x2  | 2     | `3 AND 6 = 2`                           |
| x3  | 0     | `addi 5`, then `xori 5` → `5 ^ 5 = 0`   |
| x4  | 16    | `1 << 4 = 16` after reset               |
| x5  | 8     | `32 >> 2 = 8` (logical right shift)     |
| x6  | -4    | `-8 >> 1 = -4` (arithmetic right shift) |
| x7  | 0     | Unused (remains 0)                      |


## TC-ZX16-03: Branch Instructions Test

**Test Objective:**  
Verify all conditional branches (`BEQ`, `BLT`, `BZ`, `BNZ`) behave correctly and jump within valid offset range.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-03.s -o tests/TC-ZX16-03.bin
```

**Expected Results:**
| Reg | Value | Explanation                                |
| --- | ----- | ------------------------------------------ |
| x0  | 0     | Always zero                                |
| x1  | 5     | Set by `li`                                |
| x2  | 5     | Set by `li`                                |
| x3  | 2     | Set by `li`                                |
| x4  | 3     | Set by `li`                                |
| x5  | 1234  | Only the last `li16 x5, 1234` was executed |
| x6  | 0     | Set by `li`                                |
| x7  | 1     | Set by `li`                                |

## TC-ZX16-04: Load/Store Instruction Test

**Test Objective:**  
Validate correct operation of memory load/store instructions: `sw`, `lw`, `sb`, `lb`, and `lbu`.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-04.s -o tests/TC-ZX16-04.bin
```

**Expected Results:**
| Reg | Value | Explanation                           |
| --- | ----- | ------------------------------------- |
| x0  | 0     | Always zero                           |
| x1  | 63    | `lbu` from byte `0x3F`                |
| x2  | 61438 | Stack pointer `0xEFFE`                |
| x3  | 4660  | `0x1234` → stored to memory           |
| x4  | 4660  | Loaded back with `lw`                 |
| x5  | -12   | Stored byte via `sb`                  |
| x6  | -12   | Loaded back with `lb` (sign-extended) |
| x7  | 63    | `li16` value used in `sb`             |

## TC-ZX16-05: Jump, JR, and Control Flow Test

**Test Objective:**  
Validate behavior of unconditional jumps (`j`), register-indirect jumps (`jr`), and control flow integrity including block skipping and simulated subroutine return.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-05.s -o tests/TC-ZX16-05.bin
```

**Expected Results:**
| Register | Value | Explanation                                                                                  |
| -------- | ----- | -------------------------------------------------------------------------------------------- |
| **x2**   | 50    | Preserved value passed to function and not modified (likely `li x2, 50` then used in `func`) |
| **x3**   | 55    | Returned value from function — e.g., set after return (`x3 = x2 + 5`)                        |
| **x4**   | 44    | Set *inside* `func`, confirming that function body executed                                  |
| **x7**   | 60    | Set just before `ecall 0x00A` to signal exit success or final state                          |


## TC-ZX16-06: U-Type Instruction Test (LUI/AUIPC)

**Test Objective:**  
Confirm correct behavior of `LUI` and `AUIPC` (upper immediate and PC-relative offset).

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-06.s -o tests/TC-ZX16-06.bin
```

**Expected Results:**
| Reg   | Value | Explanation                           |
| ----- | ----- | ------------------------------------- |
| x0    | 0     | Always zero                           |
| x1    | 2304  | `lui x1, 0x12` → `0x12 << 7 = 0x0900` |
| x2    | 2304  | `add x2, x1`                          |
| x3    | 168   | `auipc x3, 0x01` from PC = 0x0028     |
| x4    | 168   | `add x4, x3`                          |
| x5–x7 | 0     | Unused, remain zero                   |


## TC-ZX16-07: ECALL System Services Test

**Test Objective:**  
Verify system calls:  
- `ecall 1`: read string  
- `ecall 3`: print string  
- `ecall 10`: exit

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-07.s -o tests/TC-ZX16-07.bin
# Type a short string when prompted
```

**Expected Results:**
| Reg   | Value | Explanation                     |
| ----- | ----- | ------------------------------- |
| x0    | 0     | Always zero                     |
| x6    | 16384 | `0x4000` — buffer address       |
| x7    | 20    | Max input length                |
| x1–x5 | 0     | Unused or cleared after syscall |

## TC-ZX16-08: Pseudoinstruction Expansion Test

**Test Objective:**  
Validate correct behavior of pseudoinstructions such as `li16`, `clr`, `not`, `neg`, `inc`, and `dec`.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-08.s -o tests/TC-ZX16-08.bin
```

**Expected Results:**
| Reg | Value | Explanation                           |
| --- | ----- | ------------------------------------- |
| x0  | 0     | Always zero                           |
| x1  | 4660  | Result of `li16`                      |
| x2  | 0     | Cleared with `xor x2, x2`             |
| x3  | 65535 | Bitwise NOT of 0 = `0xFFFF`           |
| x4  | 65531 | Two’s complement of 5 = `-5` (signed) |
| x5  | 11    | Incremented from 10                   |
| x6  | 9     | Decremented from 10                   |
| x7  | 0     | Unused                                |

## TC-ZX16-09: MMIO Graphics Test

**Test Objective:**  
Test memory-mapped I/O writes for tile map and palette.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-09.s -o tests/TC-ZX16-09.bin
```

**Expected Results:**
| Register | Value | Meaning                |
| -------- | ----- | ---------------------- |
| x1       | 61440 | `0xF000` tile map base |
| x2       | 5     | Tile index written     |
| x3       | 64000 | `0xFA00` palette base  |
| x4       | 9     | Palette value written  |
| x6       | 61440 | ECALL 9 base addr      |
| x7       | 2     | ECALL 9 length         |

## TC-ZX16-10: ECALL Sound Playback Test (Royal Theme)

**Test Objective:**  
Verify correct playback of musical tones using `ecall 4` (play tone) and `ecall 5` (set volume). Confirm frequency and duration values are correctly interpreted by the MMIO audio handler.

**Test Steps:**
```bash
cd scripts
python main.py tests/TC-ZX16-10.s -o tests/TC-ZX16-10.bin
```

**Expected Results:**
| Reg   | Value | Explanation               |
| ----- | ----- | ------------------------- |
| x0    | 0     | Constant zero             |
| x6    | 1046  | Final note frequency (C6) |
| x7    | 250   | Final note duration (ms)  |
| x1–x5 | 0     | Not used                  |
---

# Project Challenges
## 🚀 Enabling High Refresh Rates with Multithreading

One of the core challenges in this project was achieving a smooth, high-frequency screen refresh (~60 FPS) without sacrificing CPU execution speed. Initially, the rendering loop and instruction execution were coupled within the React component lifecycle, which led to laggy performance due to React’s render overhead and JavaScript’s single-threaded nature.

To overcome this, we adopted **Web Workers** and **`SharedArrayBuffer`** to offload CPU execution into a separate thread. This enabled true multithreading:

- **CPU Execution Thread**: A Web Worker runs the CPU's instruction loop in a tight `while` loop, using `Atomics` to manage execution state (e.g., `Paused`, `Running`, `Halted`) in a shared state buffer.
- **UI Thread**: The React main thread handles screen rendering independently, periodically reading the latest video memory and re-rendering the canvas at a consistent rate (e.g., using `requestAnimationFrame` or `setInterval`).

By decoupling CPU computation from UI rendering:

-  We achieved **independent frame updates**, eliminating stutter caused by blocking CPU logic.
- **Memory synchronization** was efficiently managed through shared buffers without repeated message passing.
-  The architecture simulated a **hardware-like environment**, where CPU and display operate asynchronously yet coherently.

This approach allowed us to emulate real-time behavior and maintain visual responsiveness — a crucial requirement for a responsive simulator.

(Written By the team, enchanced by AI)

## Team Members

- Youssef Hawash

- Ahmed Elzahaby

- Mahmoud Aly

## References

- [ZX16 ISA Repository](https://github.com/shalan/z16.git)

- CSCE 2303 Project Description (zx16-sim.pdf)
- [Youssef Hawash](https://github.com/YoussefHawash) and [Abdallah Mostafa](https://github.com/AbdallahMostafaIbrahim) Worked on an Enhanced Assembler to suite the needs for this project
---

## License

This project is created for educational purposes for CSCE 2303 - Summer 2025 at the American University in Cairo.

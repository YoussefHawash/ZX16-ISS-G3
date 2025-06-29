
# G3 - ZX16 Instruction Set Simulator (ISS)

## Project Objective

The goal of this project is to design and implement an **Instruction Set Simulator (ISS)** for the **ZX16 architecture** - an open-source, educational ISA inspired by RISC-V and developed at the American University in Cairo (AUC). Our simulator emulates the ZX16 CPU, handles memory and register operations, executes binary-encoded instructions, and supports both terminal and visual testing environments, while enriching user experience with tools that will help them throught the simulation such as, **Memory Inspector** and **Binary to Hex Converter**.

We extended the project with a complete **graphical frontend**, making it intuitive for users to load `.bin` files, step through instructions, and visually debug CPU behavior.

## Key Features

- **Full ZX16 ISA instruction support**
- **Real-time disassembling** via a custom-built disassembler
- **64 KB memory map** with hardware-mapped I/O
- **2D Tiled Graphics System** (320 * 240 QVGA resolution)
- **Interactive Keyboard Input**
- **Register tracking**, updated every clock cycle
- **Terminal with CLI-like logging**
- **Step, Pause, Resume** execution control
- **Web Interface** built with Next.js + Monaco Editor



## Repository Structure

```bash
├ z16-sim/                   # Next JS Website
├- app/  
├── _components/              # Frontend React components
│   ├── codewindow.tsx       # Monaco editor with syntax highlighting
│   ├── computer.tsx         # Main CPU interface container
│   ├── keyboard.tsx         # Virtual keyboard visualization
│   ├── registerTable.tsx    # Register view
│   ├── screen.tsx           # Tile-based display
│   ├── terminal.tsx         # CLI logger
│   └── TextUpload.tsx       # Upload component for .bin files
├─lib/
│   ├── cpu.ts               # Core simulation logic
│   ├── disassembler.ts      # Machine code to human-readable translation
│   ├── utils.ts             # Utilities
│   ├── z16-INST.json        # Instruction format definitions
├─ public/
│   └── monaco/              # Monaco Editor dependency
```

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


## Build Instructions & Usage Guide
You should have **Node Js** install on your device through this [Link](https://nodejs.org/en/download)

### Install Dependencies 
```bash
npm install --global yarn
cd ./z16-sim
yarn install
```

### Run Locally
```bash
yarn run dev
```
Navigate to the link provided in the cmd response after  **" Local: "**


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
### Test ID: TC-ZX16-01
#### Objective:
#### Steps:
#### Expected Results
--- 
### Test ID: TC-ZX16-02
#### Objective:
#### Steps:
#### Expected Results
--- 
### Test ID: TC-ZX16-03
#### Objective:
#### Steps:
#### Expected Results
 --- 
 

## Project Challenges
To Be Written After The Project ends.....

## Team Members

- Youssef Hawash 
- Ahmed Elzahaby
- Mahmoud Aly



## References

- [ZX16 ISA Repository](https://github.com/shalan/z16.git)
- CSCE 2303 Project Description (zx16-sim.pdf)

---

## License

This project is created for educational purposes for CSCE 2303 - Summer 2025 at the American University in Cairo.

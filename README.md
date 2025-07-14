
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

### Test ID: TC-ZX16-01

#### Objective: Testing J-Type and B-type Instructions

#### Expected Results: x3=x4=5,x5=42, the rest stay unmodified

---

### Test ID: TC-ZX16-02

#### Objective: Testing I-Type Instructions and Two Ecalls

#### Expected Results: x2= -1 , x3 = -1, and the rest stay unmodified

---

### Test ID: TC-ZX16-03

#### Objective: TestingR-Type Instructions and Two Ecalls

#### Expected Results: x1=x5= -4 , x2=x3=-1, the rest stay unmodified

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

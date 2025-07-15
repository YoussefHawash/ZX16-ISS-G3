import { SimulatorState, Token } from "./Types/Definitions";
import parseInstructionZ16 from "./disassembler";
import { handleSign } from "./utils";
export class CPU {
  private memory: Uint8Array;
  private initialMemory?: Uint8Array;
  private instructions: Token[][] = [];
  private registers: Uint16Array = new Uint16Array(8);
  public PC: Uint32Array = new Uint32Array(0); // Program Counter
  private pressedKeys: Set<number> = new Set();
  public _state: Uint8Array = new Uint8Array(0);
  prevState: SimulatorState = SimulatorState.Paused;

  constructor(buffers: {
    memory: SharedArrayBuffer;
    registers: SharedArrayBuffer;
    state: SharedArrayBuffer;
    pc: SharedArrayBuffer;
  }) {
    this.memory = new Uint8Array(buffers.memory);
    this.registers = new Uint16Array(buffers.registers);
    this._state = new Uint8Array(buffers.state);
    this.PC = new Uint32Array(buffers.pc); // PC is at index 0
  }
  //Getters
  load(): void {
    this.initialMemory = new Uint8Array(this.memory); // Store original memory for reset
    this.reset();
    this.instructions = parseInstructionZ16(this.memory)[1];
  }

  static assemble(memory: Uint8Array): string[] {
    return parseInstructionZ16(memory)[0];
  }

  pause(): void {
    if (this.state === SimulatorState.Running) {
      this.state = SimulatorState.Paused;
      this.prevState = SimulatorState.Running; // Store previous state
    }
  }
  get pc(): number {
    return this.PC[0];
  }

  get state(): SimulatorState {
    return this._state[0];
  }

  set state(value: SimulatorState) {
    this._state[0] = value;
  }
  set pc(value: number) {
    this.PC[0] = value;
  }
  keyDown(key: number): void {
    if (this.pressedKeys.has(key)) return; // Ignore repeated key presses
    if (key === 0) return; // Ignore key code 0
    this.pressedKeys.add(key);
  }

  keyUp(key: number): void {
    this.pressedKeys.delete(key);
  }
  reset(): void {
    this.pc = 0;
    this.registers.fill(0);
    this.state = SimulatorState.Paused;
    this.prevState = SimulatorState.Paused; // Reset previous state
    this.pressedKeys.clear();
    if (this.initialMemory) {
      this.memory.set(this.initialMemory); // Reset memory to initial state
    }
  }
  step(): boolean {
    this.executeInstruction();
    if (
      this.state === SimulatorState.Halted ||
      this.state === SimulatorState.Blocked
    ) {
      return false; // Step execution ended
    }
    return true;
  }

  executeInstruction(this: CPU): void {
    if (this.pc < 0 || this.pc >= this.instructions.length) {
      this.state = SimulatorState.Halted; // Invalid PC, halt execution
      return;
    }
    const instruction = this.instructions[this.pc];
    if (!instruction) {
      this.state = SimulatorState.Halted; // No valid instruction, halt execution
      return;
    }
    const operation = instruction[0].name;
    switch (operation) {
      // R-Type Instructions
      case "ADD": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] + this.registers[rs];
        break;
      }
      case "SUB": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] - this.registers[rs];
        break;
      }
      case "SLT": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] < this.registers[rs] ? 1 : 0;
        break;
      }
      case "SLTU": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] =
          handleSign(this.registers[rd], 16, false) <
          handleSign(this.registers[rs], 16, false)
            ? 1
            : 0;
        break;
        break;
      }
      case "SLL": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] << this.registers[rs];
        break;
      }
      case "SRL": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] >>> this.registers[rs];
        break;
      }
      case "SRA": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] >> this.registers[rs];
        break;
      }
      case "OR": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] | this.registers[rs];
        break;
      }
      case "AND": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] & this.registers[rs];
        break;
      }
      case "XOR": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rd] ^ this.registers[rs];
      }
      case "MV": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.registers[rs];
        break;
      }
      case "JR": {
        const rd = instruction[1].value;
        this.pc = Math.floor(this.registers[rd] / 2);
        return;
      }
      case "JALR": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.pc * 2 + 2;
        this.pc = Math.floor(this.registers[rs] / 2);
        return;
      }
      // I-Type Instructions
      case "ADDI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] + imm;
        break;
      }
      case "SLTI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] < imm ? 1 : 0;
        break;
      }
      case "SLTUI": {
        const rd = instruction[1].value;
        const imm = instruction[2].value;
        this.registers[rd] =
          handleSign(this.registers[rd], 16, false) < imm ? 1 : 0;
        break;
      }
      case "SLLI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] << imm;
        break;
      }
      case "SRLI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] >>> imm;
        break;
      }
      case "SRAI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] >> imm;
        break;
      }
      case "ORI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] | imm;
        break;
      }
      case "ANDI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] & imm;
        break;
      }
      case "XORI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = this.registers[rd] ^ imm;
        break;
      }
      case "LI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = imm;
        break;
      }
      // J-Type Instructions
      case "J": {
        const offset = instruction[1].SignedValue;
        this.pc = this.pc + offset;
        return;
      }
      case "JAL": {
        const offset = instruction[2].SignedValue;
        const rd = instruction[1].value;
        this.registers[rd] = this.pc * 2 + 2;
        this.pc = this.pc + offset;
        return;
      }
      // Sys-call
      case "ECALL": {
        // Handle system call
        const syscallCode = instruction[1].value;
        this.handleSyscall(syscallCode);
        break;
      }
      case "BEQ": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (this.registers[rs1] == this.registers[rs2]) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BNE": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (this.registers[rs1] != this.registers[rs2]) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BZ": {
        const rs1 = instruction[1].value;
        const offset = instruction[2].SignedValue;
        if (this.registers[rs1] == 0) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BNZ": {
        const rs1 = instruction[1].value;
        const offset = instruction[2].SignedValue;
        if (this.registers[rs1] != 0) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BLT": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (this.registers[rs1] < this.registers[rs2]) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BGE": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (this.registers[rs1] >= this.registers[rs2]) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BLTU": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (
          handleSign(this.registers[rs1], 16, false) <
          handleSign(this.registers[rs2], 16, false)
        ) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BGEU": {
        const rs1 = instruction[1].value;
        const rs2 = instruction[2].value;
        const offset = instruction[3].SignedValue;
        if (
          handleSign(this.registers[rs1], 16, false) >=
          handleSign(this.registers[rs2], 16, false)
        ) {
          this.pc = this.pc + offset; // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "SB": {
        const rs2 = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs1 = instruction[3].value;
        this.memory[this.registers[rs1] + offset] = this.registers[rs2] & 0xff;

        break;
      }
      case "SW": {
        const rs2 = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs1 = instruction[3].value;
        this.memory[this.registers[rs1] + offset] = this.registers[rs2] & 0xff; // low byte first (little-endian)
        this.memory[this.registers[rs1] + offset + 1] =
          (this.registers[rs2] >> 8) & 0xff; // high byte second (little-endian)

        break;
      }
      case "LB": {
        const rd = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].value;
        // Load a byte from memory, sign-extend to 16 bits, and store in register
        const addr = this.registers[rs2] + offset;
        const byte = this.memory[addr];
        this.registers[rd] = byte & 0x80 ? byte | 0xff00 : byte;
        break;
      }
      case "LW": {
        const rd = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].value;
        // Load two bytes from memory and combine into a 16-bit value (big-endian)
        const addr = this.registers[rs2] + offset;
        this.registers[rd] = this.memory[addr] | (this.memory[addr + 1] << 8);
        break;
      }
      case "LBU": {
        const rd = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].value;
        const addr = this.registers[rs2] + offset;
        this.registers[rd] = (this.memory[addr] << 8) | this.memory[addr + 1];
        break;
      }
      case "LUI": {
        const rd = instruction[1].value;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = imm << 7; // Load Upper Immediate
        break;
      }
      case "AUIPC": {
        const rd = instruction[1].value;
        const imm = instruction[2].value;
        const addr = this.pc * 2; // Add immediate to PC
        this.registers[rd] = (imm << 7) + addr;
        break;
      }
      default:
        break;
    }
    // Increment the Program Counter
    this.pc += 1; // Increment PC by 1 for next instruction
    return;
  }

  handleSyscall(this: CPU, syscallCode: number): void {
    switch (syscallCode) {
      case 1: // read str
        const addr = this.registers[6]; // a0
        const max_length = this.registers[7]; // a1
        this.prevState = this.state; // Store previous state
        this.state = SimulatorState.Blocked; // Blocked state
        postMessage({
          type: "readStr",
          addr,
          max_length,
        });
        break;
      case 2: // Read int
        this.prevState = this.state; // Store previous state
        this.state = SimulatorState.Blocked; // Blocked state
        postMessage({ type: "readInt" });
        break;
      case 3: // print str
        let strAddr = this.registers[6]; // a0
        let output = "";
        while (this.memory[strAddr] !== 0) {
          const charCode = this.memory[strAddr++];
          output += String.fromCharCode(charCode);
        }
        postMessage({ type: "print", content: output });
        break;
      case 4: //play tone
        const frequency = this.registers[6]; // a0
        const duration = this.registers[7]; // a1
        postMessage({ type: "playTone", freq: frequency, durr: duration });
        break;
      case 5: // play audio
        const volume = this.registers[6]; // a0
        postMessage({ type: "SetVolume", volume });
        break;
      case 6: // stop audio
        postMessage({ type: "stopAudio" });
        break;
      case 7:
        const keyCode = this.registers[6]; // a0
        if (this.pressedKeys.has(keyCode)) {
          this.registers[7] = 1; // Echo back the key code
        } else {
          this.registers[7] = 0; // No key pressed
        }
        break;
      case 8: // Print registers
        postMessage({ type: "RegPrint" });
        break;
      case 9: // Print memory
        postMessage({ type: "MemPrint" });
        break;
      case 10:
        this.state = SimulatorState.Halted; // Blocked state
        break;
      default:
        break;
    }
  }
}

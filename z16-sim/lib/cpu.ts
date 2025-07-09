import { Token } from "./Definitions";
import parseInstructionZ16 from "./disassembler";
import { handleSign } from "./utils";
export enum SimulatorState {
  Paused = 0,
  Running = 1,
  Halted = 2,
}
export class cpu {
  private memory: Uint8Array;
  private instructions: Token[][] = [];
  private registers: Uint16Array = new Uint16Array(8);
  private PC: number = 0; // Program Counter
  private pressedKeys: Set<string> = new Set();
  private _state: number = 0;

  constructor(
    sharedMemoryBuf: SharedArrayBuffer,
    sharedRegistersBuf: SharedArrayBuffer,
    sharedPCBuf: number,
    sharedStateBuf: number
  ) {
    this.memory = new Uint8Array(sharedMemoryBuf);
    this.registers = new Uint16Array(sharedRegistersBuf);
    this.PC = sharedPCBuf; // Initialize PC from shared buffer
    this._state = sharedStateBuf;
  }
  load(): void {
    this.instructions = parseInstructionZ16(this.memory)[1];
  }
  //Getters

  pause(): void {
    if (this.state === SimulatorState.Running) {
      this.state = SimulatorState.Paused;
    }
  }
  get pc(): number {
    return this.PC;
  }
  get state(): SimulatorState {
    return this._state;
  }

  set state(value: SimulatorState) {
    this._state = value;
  }
  set pc(value: number) {
    this.PC = value;
  }
  keyDown(key: string): void {
    if (this.pressedKeys.has(key)) return; // Ignore repeated key presses
    this.pressedKeys.add(key);
  }

  keyUp(key: string): void {
    this.pressedKeys.delete(key);
  }
  reset(): void {
    this.pc = 0;
    this.registers.fill(0);
  }
  step(): boolean {
    this.executeInstruction();
    if (this.state === SimulatorState.Halted) {
      return false; // Step execution ended
    }
    return true;
  }
  executeInstruction(this: cpu): void {
    if (this.pc < 0 || this.pc >= this.instructions.length) {
      this.state = SimulatorState.Halted; // Invalid PC, halt execution
      return;
    }
    const instruction = this.instructions[this.pc];
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
        this.pc = this.registers[rd];
        return;
      }
      case "JALR": {
        const rd = instruction[1].value;
        const rs = instruction[2].value;
        this.registers[rd] = this.pc + 1;
        this.pc = this.registers[rs];
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
        this.registers[rd] = this.pc + 1;
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
        this.memory[this.registers[rs1] + offset] =
          (this.registers[rs2] >> 8) & 0xff; //
        break;
      }
      case "SW": {
        const rs2 = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs1 = instruction[3].value;
        this.memory[this.registers[rs1] + offset] =
          (this.registers[rs2] >> 8) & 0xff; //
        this.memory[this.registers[rs1] + offset + 1] =
          this.registers[rs2] & 0xff;

        break;
      }
      case "LB": {
        const rd = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].value;
        this.registers[rd] = this.memory[this.registers[rs2] + offset];
        break;
      }
      case "LW": {
        const rd = instruction[1].value;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].value;
        // Load two bytes from memory and combine into a 16-bit value (big-endian)
        const addr = this.registers[rs2] + offset;
        this.registers[rd] = (this.memory[addr] << 8) | this.memory[addr + 1];
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
        const imm = instruction[2].SignedValue;
        this.registers[rd] = (imm << 7) + this.pc;
        break;
      }
      default:
        break;
    }
    // Increment the Program Counter
    this.pc += 1; // Increment PC by 1 for next instruction
    return;
  }

  handleSyscall(this: cpu, syscallCode: number): void {
    switch (syscallCode) {
      case 0: // Exit
        break;
      case 1: // Print
        break;
      case 2: // Read
        // Implement read functionality if needed
        break;
      case 3: // Write
        // Implement write functionality if needed
        break;
      case 7:
        break;
      case 8: // Print registers
        break;
      case 9: // Print memory
        break;
      case 10:
        break;
      default:
        // console.error(`Unknown syscall code: ${syscallCode}`);
        break;
    }
  }
}

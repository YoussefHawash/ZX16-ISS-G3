import parseInstructionZ16 from "./disassembler";
import { binaryToDecimal, decimalToBinary } from "./utils";

export class cpu {
  private memory: string[];
  private Assembly: string[] = [];
  private PC: number = 0x0000; // Program Counter
  private interruptVector: string[];
  private programCode: string[];
  private MMIO: string[];
  private registers: string[] = Array(8).fill("0000000000000000");
  private words: string[][] = [];
  private halted: boolean = false;
  private paused: boolean = true;
  private Terminal: string[] = ["Welcome to Z16 Simulator"];

  constructor(memory: string[]) {
    this.memory = memory;
    this.interruptVector = memory.slice(0x0000, 0x0020);
    this.programCode = memory.slice(0x0020, 0xeffe);
    this.MMIO = memory.slice(0xf000, 0xffff);
    const parsedInstruction = parseInstructionZ16(
      this.interruptVector.concat(this.programCode)
    );

    this.Assembly = parsedInstruction[0];
    this.words = parsedInstruction[1];
  }

  togglePause(this: cpu) {
    this.paused = !this.paused;
  }
  Reset(this: cpu) {
    this.PC = 0x0000;
    this.registers.fill("0000000000000000");
    this.halted = false;
    this.paused = true;
    this.Terminal = ["Welcome to Z16 Simulator"];
  }
  clock(frequencyHz: number, callback: (state: 0 | 1) => void): () => void {
    let state: 0 | 1 = 1;
    const halfPeriodMs = 1000 / (2 * frequencyHz);

    const intervalId = setInterval(() => {
      // Reverse the state
      state = state === 0 ? 1 : 0;
      // Execute instruction positive edge detector
      if (state === 0 && !this.paused) this.ExecuteInstruction(this.PC);
      // Refresh UI
      callback(state);
      if (this.PC >= this.words.length || this.halted) {
        clearInterval(intervalId);
        return;
      }
    }, halfPeriodMs);
    // Return a function to stop the clock
    return () => clearInterval(intervalId);
  }
  //Getters
  getAssembly(this: cpu): string[] {
    return this.Assembly;
  }
  getPC(this: cpu) {
    return this.PC;
  }
  getMemory(this: cpu) {
    return this.memory;
  }
  getRegisters(this: cpu) {
    return this.registers;
  }
  getInterruptVector(this: cpu) {
    return this.interruptVector;
  }
  getProgramCode(this: cpu) {
    return this.programCode;
  }
  getMMIO(this: cpu) {
    return this.MMIO;
  }
  //Setters

  setPC(this: cpu, value: number) {
    this.PC = value;
  }
  resetPC(this: cpu) {
    this.PC = 0;
  }
  incrementPC(this: cpu): void {
    this.PC++;
  }

  ExecuteInstruction(this: cpu, address: number): void {
    if (address < 0 || address >= this.words.length) {
      console.error("Index out of bounds");
      return;
    }

    const instruction = this.words[address];

    const operation = instruction[0];
    switch (operation) {
      // R-Type Instructions
      case "ADD": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) +
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "SUB": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) -
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "SLT": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) <
            binaryToDecimal(this.registers[rs], true)
            ? 1
            : 0,
          16
        );
        break;
      }
      case "SLTU": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], false) <
            binaryToDecimal(this.registers[rs], false)
            ? 1
            : 0,
          16
        );
        break;
      }
      case "SLL": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) <<
            (binaryToDecimal(this.registers[rs], true) & 15),
          16
        );
        break;
      }
      case "SRL": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >>>
            (binaryToDecimal(this.registers[rs], true) & 15),
          16
        );
        break;
      }
      case "SRA": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        const shiftamt = binaryToDecimal(this.registers[rs], true) & 0xf;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >> shiftamt,
          16
        );
        break;
      }
      case "OR": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) |
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "AND": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) &
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "XOR": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) ^
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "MV": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "JR": {
        const rd = binaryToDecimal(instruction[1], false);
        this.setPC(binaryToDecimal(this.registers[rd], false));
        return;
      }
      case "JALR": {
        const rd = binaryToDecimal(instruction[1], false);
        const rs = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(this.getPC() + 1, 16);
        this.setPC(binaryToDecimal(this.registers[rs], false));
        return;
      }
      // I-Type Instructions
      case "ADDI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) + imm,
          16
        );
        break;
      }
      case "SLTI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) < imm ? 1 : 0,
          16
        );
        break;
      }
      case "SLTUI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], false) < imm ? 1 : 0,
          16
        );
        break;
      }
      case "SLLI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) << imm,
          16
        );
        break;
      }
      case "SRLI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >>> imm,
          16
        );
        break;
      }
      case "SRAI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >> imm,
          16
        );
        break;
      }
      case "ORI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) | imm,
          16
        );
        break;
      }
      case "ANDI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) & imm,
          16
        );
        break;
      }
      case "XORI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) ^ imm,
          16
        );
        break;
      }
      case "LI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(imm, 16);
        break;
      }
      // J-Type Instructions
      case "J": {
        const offset = binaryToDecimal(instruction[1], true) / 2;
        this.setPC(this.getPC() + offset);
        return;
      }
      case "JAL": {
        const offset = binaryToDecimal(instruction[2], true) / 2;
        console.log("JAL offset:", offset);
        const rd = binaryToDecimal(instruction[1], false);
        this.registers[rd] = decimalToBinary(this.getPC() + 1, 16);
        this.setPC(this.getPC() + offset);
        return;
      }
      // Sys-call
      case "ECALL": {
        // Handle system call
        console.log("System call encountered.");
        const syscallCode = binaryToDecimal(instruction[1], false);
        this.handleSyscall(syscallCode);
        break;
      }
      case "BEQ": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) ==
          binaryToDecimal(this.registers[rs2], true)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BNE": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) !=
          binaryToDecimal(this.registers[rs2], true)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BZ": {
        console.log("BZ instruction executed");
        const rs1 = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true) / 2;
        if (binaryToDecimal(this.registers[rs1], true) == 0)
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BLT": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) <
          binaryToDecimal(this.registers[rs2], true)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BGE": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) >=
          binaryToDecimal(this.registers[rs2], true)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BLTU": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], false) <
          binaryToDecimal(this.registers[rs2], false)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      case "BGEU": {
        const rs1 = binaryToDecimal(instruction[1], false);
        const rs2 = binaryToDecimal(instruction[2], false);
        const offset = binaryToDecimal(instruction[3], true) / 2;
        if (
          binaryToDecimal(this.registers[rs1], false) >=
          binaryToDecimal(this.registers[rs2], false)
        )
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
        return;
      }
      // TODO : FIXXXXXX
      case "SB": {
        const rs2 = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true);
        const rs1 = binaryToDecimal(instruction[3], false);
        this.memory[binaryToDecimal(this.registers[rs1], false) + offset] =
          this.registers[rs2].slice(0, 8);
        break;
      }
      case "SW": {
        const rs2 = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true);
        const rs1 = binaryToDecimal(instruction[3], false);
        this.memory[binaryToDecimal(this.registers[rs1], false) + offset] =
          this.registers[rs2];
        break;
      }
      case "LB": {
        const rd = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true);
        const rs2 = binaryToDecimal(instruction[3], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(
            this.memory[binaryToDecimal(this.registers[rs2], false) + offset],
            true
          ),
          16
        );
        break;
      }
      case "LW": {
        const rd = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true);
        const rs2 = binaryToDecimal(instruction[3], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(
            this.memory[binaryToDecimal(this.registers[rs2], false) + offset] +
              this.memory[
                binaryToDecimal(this.registers[rs2], false) + offset + 1
              ],
            true
          ),
          16
        );
        break;
      }
      case "LBU": {
        const rd = binaryToDecimal(instruction[1], false);
        const offset = binaryToDecimal(instruction[2], true);
        const rs2 = binaryToDecimal(instruction[3], false);
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(
            this.memory[binaryToDecimal(this.registers[rs2], false) + offset],
            false
          ),
          16
        );
        break;
      }
      case "LUI": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary(imm << 7, 16);
        break;
      }
      case "AUIPC": {
        const rd = binaryToDecimal(instruction[1], false);
        const imm = binaryToDecimal(instruction[2], true);
        this.registers[rd] = decimalToBinary((imm << 7) + this.getPC(), 16);
        break;
      }
      default:
        console.error(`Unknown instruction: ${instruction}`);
    }
    this.incrementPC();
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
      case 8: // Print registers
        this.Terminal.push("Registers: " + this.registers.join(", "));
        break;
      case 10:
        // Exit the program
        this.Terminal.push("Program exited.");
        this.halted = true;
        break;
      default:
        console.error(`Unknown syscall code: ${syscallCode}`);
    }
  }
  getTerminal(this: cpu): string[] {
    return this.Terminal;
  }
  getHalted(this: cpu): boolean {
    return this.halted;
  }
  getPaused(this: cpu): boolean {
    return this.paused;
  }
}

import { Token } from "./Definitions";
import parseInstructionZ16 from "./disassembler";
import { binaryToDecimal, decimalToBinary } from "./utils";
export class cpu {
  private memory: string[];
  private Assembly: string[] = [];
  private MMIO: string[] = [];
  private PC: number = 0x0000; // Program Counter
  private registers: string[] = Array(8).fill("0000000000000000");
  private words: Token[][] = [];
  private halted: boolean = false;
  private Terminal: string[] = ["Welcome to Z16 Simulator"];
  private PressedKeys: Record<string, boolean> = {};

  constructor(memory: string[]) {
    this.memory = memory;
    const interruptVector = memory.slice(0x0000, 0x0020);
    const programCode = memory.slice(0x0020, 0xeffe);
    this.MMIO = memory.slice(0xf000, 0xffff);
    const parsedInstruction = parseInstructionZ16(
      interruptVector.concat(programCode)
    );
    this.Assembly = parsedInstruction[0];
    this.words = parsedInstruction[1];
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
  getMMIO(this: cpu) {
    return this.MMIO;
  }

  setPC(this: cpu, value: number) {
    this.PC = value;
  }
  resetPC(this: cpu) {
    this.PC = 0;
  }
  incrementPC(this: cpu) {
    this.PC++;
  }
  Execute(this: cpu): boolean {
    if (this.PC < 0 || this.PC >= this.words.length || this.halted) {
      return false;
    }
    this.ExecuteInstruction(this.PC);
    return true;
  }
  ExecuteInstruction(this: cpu, address: number): void {
    const instruction = this.words[address];
    const operation = instruction[0].name;
    switch (operation) {
      // R-Type Instructions
      case "ADD": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) +
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "SUB": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) -
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "SLT": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
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
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
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
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) <<
            (binaryToDecimal(this.registers[rs], true) & 15),
          16
        );
        break;
      }
      case "SRL": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >>>
            (binaryToDecimal(this.registers[rs], true) & 15),
          16
        );
        break;
      }
      case "SRA": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        const shiftamt = binaryToDecimal(this.registers[rs], true) & 0xf;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >> shiftamt,
          16
        );
        break;
      }
      case "OR": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) |
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "AND": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) &
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "XOR": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) ^
            binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "MV": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rs], true),
          16
        );
        break;
      }
      case "JR": {
        const rd = instruction[1].UnsignedValue;
        this.setPC(binaryToDecimal(this.registers[rd], false));
        return;
      }
      case "JALR": {
        const rd = instruction[1].UnsignedValue;
        const rs = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(this.getPC() + 1, 16);
        this.setPC(binaryToDecimal(this.registers[rs], false));
        return;
      }
      // I-Type Instructions
      case "ADDI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) + imm,
          16
        );
        break;
      }
      case "SLTI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) < imm ? 1 : 0,
          16
        );
        break;
      }
      case "SLTUI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].UnsignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], false) < imm ? 1 : 0,
          16
        );
        break;
      }
      case "SLLI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) << imm,
          16
        );
        break;
      }
      case "SRLI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >>> imm,
          16
        );
        break;
      }
      case "SRAI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) >> imm,
          16
        );
        break;
      }
      case "ORI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) | imm,
          16
        );
        break;
      }
      case "ANDI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) & imm,
          16
        );
        break;
      }
      case "XORI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(
          binaryToDecimal(this.registers[rd], true) ^ imm,
          16
        );
        break;
      }
      case "LI": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(imm, 16);
        break;
      }
      // J-Type Instructions
      case "J": {
        const offset = instruction[1].SignedValue / 2;
        this.setPC(this.getPC() + offset);
        return;
      }
      case "JAL": {
        const offset = instruction[2].SignedValue / 2;
        const rd = instruction[1].UnsignedValue;
        this.registers[rd] = decimalToBinary(this.getPC() + 1, 16);
        this.setPC(this.getPC() + offset);
        return;
      }
      // Sys-call
      case "ECALL": {
        // Handle system call
        const syscallCode = instruction[1].UnsignedValue;
        this.handleSyscall(syscallCode);
        break;
      }
      case "BEQ": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) ==
          binaryToDecimal(this.registers[rs2], true)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BNE": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) !=
          binaryToDecimal(this.registers[rs2], true)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BZ": {
        const rs1 = instruction[1].UnsignedValue;
        const offset = instruction[2].SignedValue / 2;
        if (binaryToDecimal(this.registers[rs1], true) == 0) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BLT": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) <
          binaryToDecimal(this.registers[rs2], true)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BGE": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], true) >=
          binaryToDecimal(this.registers[rs2], true)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BLTU": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], false) <
          binaryToDecimal(this.registers[rs2], false)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "BGEU": {
        const rs1 = instruction[1].UnsignedValue;
        const rs2 = instruction[2].UnsignedValue;
        const offset = instruction[3].SignedValue / 2;
        if (
          binaryToDecimal(this.registers[rs1], false) >=
          binaryToDecimal(this.registers[rs2], false)
        ) {
          this.setPC(this.getPC() + offset); // Jump to the address specified by imm}
          return;
        } else {
          break;
        }
      }
      case "SB": {
        const rs2 = instruction[1].UnsignedValue;
        const offset = instruction[2].SignedValue;
        const rs1 = instruction[3].UnsignedValue;
        this.memory[binaryToDecimal(this.registers[rs1], false) + offset] =
          this.registers[rs2].slice(-8);
        break;
      }
      case "SW": {
        const rs2 = instruction[1].UnsignedValue;
        const offset = instruction[2].SignedValue;
        const rs1 = instruction[3].UnsignedValue;
        this.memory[binaryToDecimal(this.registers[rs1], false) + offset] =
          this.registers[rs2];
        break;
      }
      case "LB": {
        const rd = instruction[1].UnsignedValue;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].UnsignedValue;
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
        const rd = instruction[1].UnsignedValue;
        const offset = instruction[2].SignedValue;
        const rs2 = instruction[3].UnsignedValue;
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
        const rd = instruction[1].UnsignedValue;
        const offset = instruction[2].UnsignedValue;
        const rs2 = instruction[3].UnsignedValue;
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
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary(imm << 7, 16);
        break;
      }
      case "AUIPC": {
        const rd = instruction[1].UnsignedValue;
        const imm = instruction[2].SignedValue;
        this.registers[rd] = decimalToBinary((imm << 7) + this.getPC(), 16);
        break;
      }
      default:
        break;
    }
    // Increment the Program Counter
    this.incrementPC();
    return;
  }
  getWords(this: cpu): Token[][] {
    return this.words;
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
        const keycode = this.registers[6];
        const char = String.fromCharCode(binaryToDecimal(keycode, false));
        this.registers[7] = this.PressedKeys[char]
          ? "0000000000000001" // Key is pressed
          : "0000000000000000"; // Key is not pressed
        break;
      case 8: // Print registers
        this.Terminal.push("Registers: " + this.registers.join(", "));
        break;
      case 9: // Print memory
        break;
      case 10:
        // Exit the program
        this.Terminal.push("Program exited.");
        this.halted = true;
        break;
      default:
        // console.error(`Unknown syscall code: ${syscallCode}`);
        break;
    }
  }
  Handlekey(this: cpu, PressedKeys: Record<string, boolean>) {
    this.PressedKeys = PressedKeys;
  }
}

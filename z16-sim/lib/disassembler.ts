import { instructionFormats } from "./constants";
import { ECALLService, Token } from "./Types/Definitions";
import { binaryToHex, getSignedValue, littleEndianParser } from "./utils";

let assembly: string[] = [];
let lines: Token[][] = [];

export function instructionFormat(Type: string, ...args: number[]): string {
  let entry: any;
  switch (Type) {
    case "R": {
      const [funct3, funct4] = args;
      entry = Object.entries(instructionFormats[Type]).find(
        ([, fmt]) => fmt.funct3 === funct3 && fmt.funct4 === funct4
      );
      break;
    }
    case "I": {
      const [imm7, funct3] = args;
      entry = Object.entries(instructionFormats.I).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      if (funct3 === 0b011) {
        entry = [];
        entry[0] =
          ((imm7 >> 4) & 0x07) === 0b001
            ? "SLLI"
            : ((imm7 >> 4) & 0x07) === 0b010
            ? "SRLI"
            : ((imm7 >> 4) & 0x07) === 0b100
            ? "SRAI"
            : undefined;
      }
      break;
    }
    case "B": {
      const [funct3] = args;
      entry = Object.entries(instructionFormats.B).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "S": {
      const [funct3] = args;
      entry = Object.entries(instructionFormats.S).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "L": {
      const [funct3] = args;
      entry = Object.entries(instructionFormats.L).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "J": {
      const [f] = args;
      entry = Object.entries(instructionFormats.J).find(
        ([, fmt]) => fmt.flag === f
      );
      break;
    }
    case "U": {
      const [f] = args;
      entry = Object.entries(instructionFormats.U).find(
        ([, fmt]) => fmt.flag === f
      );
      break;
    }
    case "SYS": {
      const [funct3] = args;
      entry = Object.entries(instructionFormats.SYS).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
  }
  return entry && entry[0] ? entry[0] : "";
}

// Main disassembly function
export default function parseInstructionZ16(
  raw: Uint8Array
): [string[], Token[][]] {
  //reset
  assembly = [];
  lines = [];
  const words = littleEndianParser(raw); // Parsing to construct list of instructions

  for (let i = 0; i < words.length; i++) {
    const current_instr = words[i];
    const opcode = current_instr & 0x07; // bits[15:13] is opcode
    switch (opcode) {
      // ───────────── R-Type  ─────────────
      case 0: {
        const funct4 = (current_instr >> 12) & 0x0f;
        const RS2 = (current_instr >> 9) & 0x07;
        const RD = (current_instr >> 6) & 0x07;
        const funct3 = (current_instr >> 3) & 0x07;
        // map to the actual instruction name
        const name = instructionFormat("R", funct3, funct4);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }

        // JR/JALR: only uses RD as target
        if (name === "JR") {
          assembly.push(`JR  ${binaryToHex(RD, 3).slice(1)}`);
          lines.push([new Token("Inst", name), new Token("Reg", "", RD)]);
        } else {
          assembly.push(
            `${name} ${binaryToHex(RD, 3).slice(1)}, ${binaryToHex(
              RS2,
              3
            ).slice(1)}`
          );
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RD),
            new Token("Reg", "", RS2),
          ]);
        }
        continue;
      }
      // ───────────── I-Type ─────────────
      case 1: {
        const imm7 = (current_instr >> 9) & 0x7f; // bits[15:9]
        const RD = (current_instr >> 6) & 0x07; // bits[8:6]
        const funct3 = (current_instr >> 3) & 0x07; // bits[5:3] is RS1
        const name = instructionFormat("I", imm7, funct3);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        // formatting
        if (funct3 === 0b011) {
          assembly.push(
            `${name} ${binaryToHex(RD, 3).slice(1)}, ${binaryToHex(
              imm7 & 0x0f,
              4
            )}`
          );
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RD),
            new Token("Imm", "", imm7 & 0x0f, 4),
          ]);
        } else {
          assembly.push(
            `${name} ${binaryToHex(RD, 3).slice(1)}, ${binaryToHex(imm7, 7)}`
          );
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RD),
            new Token("Imm", "", imm7, 7),
          ]);
        }
        continue;
      }
      // ───────────── B-Type ─────────────
      case 2: {
        const imm4_1 = (current_instr >> 12) & 0x0f; // bits[15:12]
        const offset = getSignedValue(imm4_1, 4) * 2; // bits[11:9] is imm4_1, add 0 for Z16
        const RS2 = (current_instr >> 9) & 0x07; // bits[11:9] is RS2
        const RS1 = (current_instr >> 6) & 0x07; // bits[8:6] is RD/RS1
        const funct3 = (current_instr >> 3) & 0x07; // bits[12:10]
        const name = instructionFormat("B", funct3);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        if (["BZ", "BNZ"].includes(name)) {
          assembly.push(`${name} ${binaryToHex(RS1, 3).slice(1)}, ${offset}`);
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RS1),
            new Token("Imm", "", imm4_1, 4),
          ]);
        } else {
          assembly.push(
            `${name} ${binaryToHex(RS1, 3).slice(1)}, ${binaryToHex(
              RS2,
              3
            ).slice(1)}, ${offset}`
          );
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RS1),
            new Token("Reg", "", RS2),
            new Token("Imm", "", imm4_1, 4),
          ]);
        }
        continue;
      }
      // ───────────── S-Type ─────────────
      case 3: {
        const imm3_0 = (current_instr >> 12) & 0x0f; // bits[15:12]
        const offset = getSignedValue(imm3_0, 4);
        const RS2 = (current_instr >> 9) & 0x07; // bits[11:9] is RS2
        const RS1 = (current_instr >> 6) & 0x07; // bits[8:6] is RD/RS1
        const funct3 = (current_instr >> 3) & 0x07; // bits[12:10]
        const name = instructionFormat("S", funct3);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        assembly.push(
          `${name} ${binaryToHex(RS1, 3).slice(1)}, ${offset}(${binaryToHex(
            RS2,
            3
          ).slice(1)})`
        );
        lines.push([
          new Token("Inst", name),
          new Token("Reg", "", RS1),
          new Token("Imm", "", imm3_0, 4),
          new Token("Reg", "", RS2),
        ]);
        continue;
      }
      // ───────────── L-Type  ─────────────
      case 4: {
        const imm3_0 = (current_instr >> 12) & 0x0f; // bits[15:12]
        const offset = getSignedValue(imm3_0, 4);
        const RS2 = (current_instr >> 9) & 0x07; // bits[11:9] is RS2
        const RD = (current_instr >> 6) & 0x07; // bits[8:6] is RD/RS1
        const funct3 = (current_instr >> 3) & 0x07; // bits[12:10]
        const name = instructionFormat("L", funct3);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        assembly.push(
          `${name} ${binaryToHex(RD, 3).slice(1)}, ${offset}(${binaryToHex(
            RS2,
            3
          ).slice(1)})`
        );
        lines.push([
          new Token("Inst", name),
          new Token("Reg", "", RD),
          new Token("Imm", "", imm3_0, 4),
          new Token("Reg", "", RS2),
        ]);
        continue;
      }
      // ───────────── J-Type  ─────────────
      case 5: {
        const f = (current_instr >> 15) & 0x1; // bit15
        const imm9_4 = (current_instr >> 9) & 0x03f; // bits[14:9]
        const RD = (current_instr >> 6) & 0x07; // bits[8:6] is RD/RS1
        const imm3_1 = (current_instr >> 3) & 0x07; // bits[5:3]
        const immBits = (imm9_4 << 3) | imm3_1; // Combine imm9_4 and imm3_1
        const offset = getSignedValue(immBits, 9) * 2; // Z16 uses 10 bits for J-Type

        const name = instructionFormat("J", f);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        if (name === "J") {
          assembly.push(`J ${offset}`);
          lines.push([
            new Token("Inst", name),
            new Token("Imm", "", immBits, 9),
          ]);
        } else {
          assembly.push(`${name} ${binaryToHex(RD, 3).slice(1)}, ${offset}`);
          lines.push([
            new Token("Inst", name),
            new Token("Reg", "", RD),
            new Token("Imm", "", immBits, 9),
          ]);
        }
        continue;
      }
      // ───────────── U-Type  ─────────────
      case 6: {
        const f = (current_instr >> 15) & 0x1; // bit15
        const hi6 = (current_instr >> 9) & 0x03f; // bits[14:9]
        const RD = (current_instr >> 6) & 0x07; // bits[8:6] is RD/RS1
        const lo3 = (current_instr >> 3) & 0x07; // bits[5:3]
        //TODO
        const upperimmediate = (hi6 << 3) | lo3; // Combine hi6 (upper 6 bits) and lo3 (lower 3 bits)
        const name = instructionFormat("U", f);
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }
        assembly.push(
          `${name} ${binaryToHex(RD, 3).slice(1)}, ${binaryToHex(
            upperimmediate,
            9
          )}`
        );
        lines.push([
          new Token("Inst", name),
          new Token("Reg", "", RD),
          new Token("Imm", "", upperimmediate, 9),
        ]);
        continue;
      }
      // ──────────── SYS-Type  ─────────────
      case 7: {
        const service = (current_instr >> 6) & 0x03ff; // bits[15:6]
        const funct3 = (current_instr >> 3) & 0x07; // bits[12:10]
        const name = instructionFormat("SYS", funct3);
        const serviceName = ECALLService[service];
        if (!name) {
          assembly.push(`UNKNOWN opcode=${opcode}`);
          continue;
        }

        assembly.push(`${name} ${service}    # ${serviceName}`);
        lines.push([
          new Token("Inst", name),
          new Token("Reg", "", service, 10),
        ]);
        continue;
      }
      default:
        assembly.push(`UNKNOWN opcode=${opcode}`);
    }
  }
  return [assembly, lines];
}

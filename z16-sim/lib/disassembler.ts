import {
  binaryToDecimal,
  binToHex,
  decimalToBinary,
  littleEndianParser,
} from "./utils";
import instructionFormatsByType from "./z16-INST.json";

const services: { [key: number]: string } = {
  1: "Read String",
  2: "Read Integer",
  3: "Print String",
  4: "Play tone",
  5: "Set audio volume",
  6: "Stop Audio playback",
  7: "Read the keyboard",
  8: "Registers Dump",
  9: "Memory Dump",
  10: "Program Exit",
};

let assembly: string[] = [];
let words: string[][] = [];

let lastLabelIndex = 0;

export function instructionFormat(Type: string, ...args: string[]): string {
  let entry: any;
  switch (Type) {
    case "R": {
      const [funct3, funct4] = args;
      entry = Object.entries(instructionFormatsByType[Type]).find(
        ([, fmt]) => fmt.funct3 === funct3 && fmt.funct4 === funct4
      );
      break;
    }
    case "I": {
      const [imm7, funct3] = args;
      entry = Object.entries(instructionFormatsByType.I).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      if (funct3 === "011") {
        entry = [];
        entry[0] =
          imm7.slice(0, 3) === "001"
            ? "SLLI"
            : imm7.slice(0, 3) === "010"
            ? "SRLI"
            : imm7.slice(0, 3) === "100"
            ? "SRAI"
            : undefined;
      }
      break;
    }
    case "B": {
      const [funct3] = args;
      entry = Object.entries(instructionFormatsByType.B).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "S": {
      const [funct3] = args;
      entry = Object.entries(instructionFormatsByType.S).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "L": {
      const [funct3] = args;
      entry = Object.entries(instructionFormatsByType.L).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
    case "J": {
      const [f] = args;
      entry = Object.entries(instructionFormatsByType.J).find(
        ([, fmt]) => fmt.flag === f
      );
      break;
    }
    case "U": {
      const [f] = args;
      entry = Object.entries(instructionFormatsByType.U).find(
        ([, fmt]) => fmt.flag === f
      );
      break;
    }
    case "SYS": {
      const [funct3] = args;
      entry = Object.entries(instructionFormatsByType.SYS).find(
        ([, fmt]) => fmt.funct3 === funct3
      );
      break;
    }
  }
  return entry && entry[0] ? entry[0] : "UNKNOWN";
}

// TODO: fix
export function resolve_label(labelIndex: number): string {
  if (labelIndex < 0 || labelIndex >= assembly.length) {
    console.error("Invalid label index:", labelIndex);
    return "";
  }
  console;
  if (assembly[labelIndex].includes("label_"))
    return assembly[labelIndex].slice(0, -1);
  // return existing label without colon
  else {
    const label = `label_${lastLabelIndex++}:`;
    // assembly.splice(labelIndex, 0, label); // insert the new label at the target index
    return `label_${lastLabelIndex}`;
  }
}

// Main disassembly function
export default function parseInstructionZ16(
  raw: string[]
): [string[], string[][]] {
  lastLabelIndex = -1; // reset label index for each disassembly

  raw = littleEndianParser(raw); // Parsing to construct list of instructions

  // init
  assembly = new Array(raw.length).fill("");

  //flag
  let terminate = false;

  for (let i = 0; i < raw.length && !terminate; i++) {
    const instr = raw[i];
    const opcode = instr.slice(13, 16); // bits[15:13] is opcode
    switch (opcode) {
      // ───────────── R-Type  ─────────────
      case "000": {
        const funct4 = instr.slice(0, 4); // bits[15:12]
        const RS2 = instr.slice(4, 7); // bits[11:9] is RS2
        const RD = instr.slice(7, 10); // bits[8:6] is RD/RS1
        const funct3 = instr.slice(10, 13); // bits[12:10]
        // map to the actual instruction name
        const name = instructionFormat("R", funct3, funct4);

        // JR/JALR: only uses RD as target
        if (name === "JR") {
          assembly[i] = `JR  ${binToHex(RD, true)}`;
          words[i] = [name, RD];
        } else {
          assembly[i] = `${name} ${binToHex(RD, true)}, ${binToHex(RS2, true)}`;
          words[i] = [name, RD, RS2];
        }
        continue;
      }
      // ───────────── I-Type ─────────────
      case "001": {
        const imm7 = instr.slice(0, 7); // bits[15:9]
        const RD = instr.slice(7, 10); // bits[8:6] is RS2
        const funct3 = instr.slice(10, 13); // bits[5:3] is RS1
        const name = instructionFormat("I", imm7, funct3) as string;

        // formatting
        if (["SLLI", "SRLI", "SRAI"].includes(name)) {
          assembly[i] = `${name} ${binToHex(RD, true)}, ${binToHex(
            imm7.slice(3, 7),
            false
          )}`;
          words[i] = [name, RD, imm7.slice(3, 7)];
        } else {
          assembly[i] = `${name} ${binToHex(RD, true)}, ${binToHex(
            imm7,
            false
          )}`;
          words[i] = [name, RD, imm7];
        }
        continue;
      }
      // ───────────── B-Type ─────────────
      case "010": {
        const imm4_1 = instr.slice(0, 4); // bits[15:12]
        const offset = binaryToDecimal(imm4_1 + "0", true); // bits[11:9] is imm4_1, add 0 for Z16
        const RS2 = instr.slice(4, 7); // bits[11:9] is RS2
        const RS1 = instr.slice(7, 10); // bits[8:6] is RS1
        const funct3 = instr.slice(10, 13); // bits[5:3] is funct3
        // TODO
        const label = resolve_label(i + offset);

        const name = instructionFormat("B", funct3);

        // Z16 uses two regs: RS1 is the “rd/rs1” field, RS2 is the 2nd source
        assembly[i] = `${name} ${binToHex(RS1, true)}, ${binToHex(
          RS2,
          true
        )}, ${label}`;
        words[i] = [name, RS1, RS2, imm4_1];
        continue;
      }

      // ───────────── S-Type ─────────────
      case "011": {
        const imm3_0 = instr.slice(0, 4); // bits[15:12]
        const offset = binaryToDecimal(imm3_0, true);
        const RS2 = instr.slice(4, 7); // bits[11:9] is RS2
        const RS1 = instr.slice(7, 10); // bits[8:6] is RS1
        const funct3 = instr.slice(10, 13); // bits[5:3] is funct3
        const name = instructionFormat("S", funct3);

        assembly[i] = `${name} ${binToHex(RS1, true)}, ${offset}(${binToHex(
          RS2,
          true
        )})`;
        words[i] = [name, RS1, decimalToBinary(offset, 4), RS2];
        continue;
      }

      // ───────────── L-Type  ─────────────
      case "100": {
        const imm3_0 = instr.slice(0, 4); // bits[15:12]
        const offset = binaryToDecimal(imm3_0, true);
        const RS2 = instr.slice(4, 7); // bits[11:9] is RS2
        const RD = instr.slice(7, 10); // bits[8:6] is RD
        const funct3 = instr.slice(10, 13); // bits[5:3] is funct3
        const name = instructionFormat("L", funct3);
        // load: RD ← [BASE+offset]
        assembly[i] = `${name} ${binToHex(RD, true)}, ${offset}(${binToHex(
          RS2,
          true
        )})`;
        words[i] = [name, RD, decimalToBinary(offset, 4), RS2];
        continue;
      }
      // ───────────── J-Type  ─────────────
      case "101": {
        const f = instr.charAt(0); // bit15
        const imm9_4 = instr.slice(1, 7); // bits[14:9]
        const RD = instr.slice(7, 10); // bits[8:6] is RD
        const imm3_1 = instr.slice(10, 13); // bits[5:3]
        const immBits = imm9_4 + imm3_1 + "0";
        const offset = binaryToDecimal(immBits, true); // Z16 uses 10 bits for J-Type

        const label = resolve_label(i + offset);
        const name = instructionFormat("J", f);

        // both use RD as the link/destination register
        if (name === "J") {
          assembly[i] = `J ${label}`;
          words[i] = [name, immBits];
        } else {
          assembly[i] = `${name} ${binToHex(RD, true)}, ${label}`;
          words[i] = [name, RD, immBits];
        }
        continue;
      }
      // ───────────── U-Type  ─────────────
      case "110": {
        const f = instr.charAt(0); // bit15
        const hi6 = instr.slice(1, 7); // bits[14:9]
        const RD = instr.slice(7, 10); // bits[8:6] is RD
        const lo3 = instr.slice(10, 13); // bits[5:3] is lo3
        const immBits = hi6 + lo3;
        const name = instructionFormat("U", f);
        // TODO: fix
        assembly[i] = `${name} ${binToHex(RD, true)}, ${binToHex(
          immBits,
          false
        )}`;
        words[i] = [name, RD, immBits];
        continue;
      }
      // ──────────── SYS-Type  ─────────────
      case "111": {
        const service = instr.slice(0, 10); // bits[15:6]
        const funct3 = instr.slice(10, 13); // bits[5:3] is funct3
        const name = instructionFormat("SYS", funct3);
        const serviceName = services[binaryToDecimal(service, false)];

        assembly[i] = `${name} ${binaryToDecimal(
          service,
          false
        )}    # ${serviceName}`;
        words[i] = [name, service];
        continue;
      }
      default:
        assembly[i] = `UNKNOWN opcode=${opcode}`;
    }
  }
  // Remove empty instructions
  assembly = assembly.filter((instr) => instr.trim() !== "");
  return [assembly, words];
}

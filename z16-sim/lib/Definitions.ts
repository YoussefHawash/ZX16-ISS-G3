import { getSignedValue } from "./utils";

export const services: { [key: number]: string } = {
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
export class Token {
  public type: "Imm" | "Reg" | "Inst"; // Type of the token, can be used for styling
  public name: string = ""; // The name of the token, if applicable
  public value: number; // The name of the token, if applicable
  public SignedValue: number = 0; // The decimal value of the token, if applicable
  constructor(
    type: "Imm" | "Reg" | "Inst",
    name: string = "",
    value: number = 0,
    width: number = 16
  ) {
    this.type = type;
    this.value = value;
    this.name = name;
    this.SignedValue = getSignedValue(value, width);
  }
}

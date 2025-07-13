import { getSignedValue } from "../utils";

export enum ECALLService {
  ReadString = 1,
  ReadInteger = 2,
  PrintString = 3,
  PlayTone = 4,
  SetAudioVolume = 5,
  StopAudioPlayback = 6,
  ReadKeyboard = 7,
  RegistersDump = 8,
  MemoryDump = 9,
  ProgramExit = 10,
}
export enum SimulatorState {
  Paused = 0,
  Running = 1,
  Halted = 2,
  Blocked = 3,
}
export type Buffers = {
  memory: SharedArrayBuffer;
  registers: SharedArrayBuffer;
  state: SharedArrayBuffer;
  pc: SharedArrayBuffer;
  manager: SharedArrayBuffer;
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

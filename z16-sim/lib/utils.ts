import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility functions for Class Merging (UI_ Related)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function binaryToHex(num: number, width?: number): string {
  if (!Number.isInteger(num) || num < 0) {
    throw new Error(`Input must be a non-negative integer: "${num}"`);
  }
  let hex = num.toString(16);
  if (width !== undefined) {
    const hexWidth = Math.ceil(width / 4);
    hex = hex.padStart(hexWidth, "0");
  }
  return `0x${hex}`;
}
// Parsing using Little Endian format and constructing list of instruictions
export function littleEndianParser(memory: Uint8Array): Uint16Array {
  if (memory.length % 2 !== 0) {
    throw new Error("Memory length must be even for little-endian parsing.");
  }
  const instructions = new Uint16Array(memory.length / 2);
  for (let i = 0; i < memory.length; i += 2) {
    instructions[i / 2] = memory[i] | (memory[i + 1] << 8);
  }
  return instructions;
}
export function getSignedValue(value: number, width: number): number {
  const mask = 1 << (width - 1);
  return (value & (mask - 1)) - (value & mask);
}
export function handleSign(
  value: number,
  width: number,
  signed: boolean
): number {
  if (value >> (width - 1) === 1 && signed) {
    // apply two's complement for negative numbers
    return value - (1 << width);
  }
  return value; // mask to width bits
}

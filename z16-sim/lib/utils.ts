import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility functions for Class Merging (UI_ Related)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert binary string to hexadecimal string
export function binToHex(byte: string, reg: boolean = false): string {
  if (!byte) return "";
  return reg
    ? "x" + parseInt(byte, 2).toString(16)
    : "0x" + parseInt(byte, 2).toString(16).padStart(2, "0").toUpperCase();
}

// Parsing using Little Endian format and constructing list of instruictions
export function littleEndianParser(memory: string[]): string[] {
  const Instructions = memory
    .map((_, index, array) => {
      if (index % 2 === 0 && array[index + 1])
        return array[index + 1] + array[index];
      return null;
    })
    .filter((item): item is string => Boolean(item));
  return Instructions;
}

// Convert binary string to decimal number, with optional signed interpretation
export function binaryToDecimal(binStr: string, signed = false): number {
  // Validate
  if (!/^[01]+$/.test(binStr)) {
    throw new Error(`Invalid binary string: "${binStr}"`);
  }

  const width = binStr.length;
  const unsignedVal = parseInt(binStr, 2);

  if (!signed) return unsignedVal;

  // signed two's-complement:
  // if highest bit is 0, it's positive; else subtract 2^width
  const isNegative = binStr[0] === "1";
  return isNegative ? unsignedVal - (1 << width) : unsignedVal;
}

// TODO
// Convert decimal number to binary string,
export function decimalToBinary(num: number, width: number): string {
  // signed two’s-complement
  if (!Number.isInteger(num))
    throw new Error("For signed mode, pass an integer.");
  if (typeof width !== "number" || width < 1)
    throw new Error(
      "You must specify a positive bit-width for signed conversion."
    );

  // mask to width bits
  const mask = (1 << width) - 1;
  // & mask handles negative wrap-around automatically
  const twos = num & mask;
  // pad to exactly width bits
  return twos.toString(2).padStart(width, "0");
}

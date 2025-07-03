"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of context
interface ComputerContextType {
  memory: string[];
  setMemory: (m: string[]) => void;
  registers: string[];
  setRegisters: (r: string[]) => void;
  pc: number;
  setPc: (pc: number) => void;
  running: boolean;
  setRunning: (running: boolean) => void;
  screenmemory: string[];
  setscreenmemory: (screenmemory: string[]) => void;
  frequency: number;
  setFrequency: (frequency: number) => void;
  assembly: string[];
  setAssembly: (assembly: string[]) => void;
}

// Create context with default empty values
const ComputerContext = createContext<ComputerContextType>({
  memory: [],
  setMemory: () => {},
  registers: [],
  setRegisters: () => {},
  pc: 0,
  setPc: () => {},
  running: false,
  setRunning: () => {},
  screenmemory: [],
  setscreenmemory: () => {},
  frequency: 1,
  setFrequency: () => {},
  assembly: [],
  setAssembly: () => {},
});

// Custom hook to use the context
export const useComputer = () => useContext(ComputerContext);

// Provider component
export const ComputerProvider = ({ children }: { children: ReactNode }) => {
  const [memory, setMemory] = useState<string[]>([]);
  const [registers, setRegisters] = useState<string[]>([
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
  ]);
  const [pc, setPc] = useState(0);
  const [running, setRunning] = useState(false);
  const [screenmemory, setscreenmemory] = useState<string[]>([]);
  const [frequency, setFrequency] = useState(1);
  const [assembly, setAssembly] = useState<string[]>([]);

  return (
    <ComputerContext.Provider
      value={{
        memory,
        setMemory,
        registers,
        setRegisters,
        pc,
        setPc,
        running,
        setRunning,
        screenmemory,
        setscreenmemory,
        frequency,
        setFrequency,
        assembly,
        setAssembly,
      }}
    >
      {children}
    </ComputerContext.Provider>
  );
};

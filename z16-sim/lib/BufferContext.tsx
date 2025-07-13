"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Buffers } from "./Types/Definitions";

// buffer sizes
const MEMORY_SIZE = 0x10000; // 64 KB
const REGISTER_COUNT = 8; // 8 registers
const MANAGER_SIZE = 4; // 4 bytes manager

// pre‐create your SABs once
const sharedBuffers: Buffers = {
  memory: new SharedArrayBuffer(MEMORY_SIZE),
  registers: new SharedArrayBuffer(
    REGISTER_COUNT * Uint16Array.BYTES_PER_ELEMENT
  ),
  state: new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT),
  pc: new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT),
  manager: new SharedArrayBuffer(MANAGER_SIZE * Int32Array.BYTES_PER_ELEMENT),
};

// contexts
const SharedBuffersContext = createContext<Buffers>(sharedBuffers);
const WorkerContext = createContext<Worker | null>(null!);

// Assembly string list context
type AssemblyContextType = [string[], Dispatch<SetStateAction<string[]>>];
const AssemblyContext = createContext<AssemblyContextType>([[], () => {}]);

// provider
export function SharedBuffersProvider({ children }: { children: ReactNode }) {
  const buffers = sharedBuffers;
  const workerRef = useRef<Worker>(null);
  const [assembly, setAssembly] = useState<string[]>([]);

  useEffect(() => {
    if (!workerRef.current) {
      const w = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      w.postMessage({
        type: "init",
        payload: {
          memory: buffers.memory,
          registers: buffers.registers,
          pc: buffers.pc,
          state: buffers.state,
          manager: buffers.manager,
        },
      });
      workerRef.current = w;
    }
  }, []);

  return (
    <SharedBuffersContext.Provider value={buffers}>
      <WorkerContext.Provider value={workerRef.current}>
        <AssemblyContext.Provider value={[assembly, setAssembly]}>
          {children}
        </AssemblyContext.Provider>
      </WorkerContext.Provider>
    </SharedBuffersContext.Provider>
  );
}

// hooks
export function useSharedBuffers(): Buffers {
  return useContext(SharedBuffersContext);
}

export function useWorker(): Worker | null {
  return useContext(WorkerContext);
}

// Assembly string list hook
export function useAssemblyList(): AssemblyContextType {
  return useContext(AssemblyContext);
}

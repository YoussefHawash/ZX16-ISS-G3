// lib/MemoryContext.tsx
"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of context
interface MemoryContextType {
  memory: string[];
  setMemory: (m: string[]) => void;
}

// Create context with default empty values
const MemoryContext = createContext<MemoryContextType>({
  memory: [],
  setMemory: () => {},
});

// Custom hook to use the context
export const useMemory = () => useContext(MemoryContext);

// Provider component
export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [memory, setMemory] = useState<string[]>([]);

  return (
    <MemoryContext.Provider value={{ memory, setMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};

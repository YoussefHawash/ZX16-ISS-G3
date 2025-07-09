// components/Simulator.tsx
import { useEffect, useRef, useState } from "react";

type CPUState = { pc: number; regs: number[] };

export default function Simulator() {
  const [assembly, setAssembly] = useState<string[]>([]);
  const [cpuState, setCpuState] = useState<CPUState>({ pc: 0, regs: [] });
  const workerRef = useRef<Worker>();

  useEffect(() => {
    // spawn the worker
    const worker = new Worker(
      new URL("../../lib/Workers/cpu.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, assembly, state } = e.data as {
        type: string;
        assembly?: string[];
        state?: CPUState;
      };
      switch (type) {
        case "disassembled":
          setAssembly(assembly!);
          break;
        case "tick":
        case "reset":
        case "stopped":
          setCpuState(state!);
          break;
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = undefined;
    };
  }, []);

  // call these in response to UI events:
  const loadProgram = (bytes: Uint8Array) => {
    workerRef.current?.postMessage({ cmd: "load", payload: bytes });
  };
  const reset = () => workerRef.current?.postMessage({ cmd: "reset" });
  const start = () => workerRef.current?.postMessage({ cmd: "start" });
  const stop = () => workerRef.current?.postMessage({ cmd: "stop" });

  return (
    <div>
      <button onClick={reset}>Reset PC</button>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>

      <h3>Assembly</h3>
      <pre>{assembly.join("\n")}</pre>

      <h3>CPU State</h3>
      <div>PC: {cpuState.pc}</div>
      <div>
        Registers:{" "}
        {cpuState.regs.map((r, i) => (
          <span key={i}>{`x${i}=${r}`}&nbsp;</span>
        ))}
      </div>
    </div>
  );
}

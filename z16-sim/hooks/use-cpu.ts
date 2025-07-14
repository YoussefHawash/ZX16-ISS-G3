"use client";
import {
  useAssemblyList,
  useSharedBuffers,
  useWorker,
} from "@/lib/BufferContext";
import { CPU } from "@/lib/cpu";
import { SimulatorState } from "@/lib/Types/Definitions";
import { useEffect } from "react";

export default function Simulator() {
  const buffers = useSharedBuffers();
  const workerRef = useWorker();
  const [assembly, setAssembly] = useAssemblyList();
  const managerView = new Int32Array(buffers.manager);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.charCodeAt(0) != 0) {
        Atomics.store(managerView, 1, event.key.charCodeAt(0)); // Store key code in shared buffer
        Atomics.store(managerView, 0, 7);
        Atomics.notify(managerView, 0, 1); // Notify the worker to process
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.charCodeAt(0) != 0) {
        Atomics.store(managerView, 1, event.key.charCodeAt(0)); // Store key code in shared buffer
        Atomics.store(managerView, 0, 8);
        Atomics.notify(managerView, 0, 1); // Notify the worker to process
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const load = (value: ArrayBuffer) => {
    const memView = new Uint8Array(buffers.memory);
    memView.set(new Uint8Array(value, 0, value.byteLength));
    const managerView = new Int32Array(buffers.manager);
    Atomics.store(managerView, 2, 1); // Set command to RUN
    setAssembly(CPU.assemble(memView)); // Update the assembly context after loading
    Atomics.store(managerView, 0, 1); // Set command to LOAD
    Atomics.notify(managerView, 0, 1); // Notify the worker to process the load
  };
  const start = () => {
    Atomics.store(managerView, 0, 2); // Set command to RUN
    Atomics.notify(managerView, 0, 1); // Notify the worker to start execution
  };
  const pause = () => {
    Atomics.store(managerView, 0, 3); // Set command to PAUSE
    Atomics.notify(managerView, 0, 1); // Notify the worker to pause execution
  };
  const step = () => {
    const stateView = new Uint16Array(buffers.state);
    if (Atomics.load(stateView, 0) !== SimulatorState.Paused) {
      return;
    }
    Atomics.store(managerView, 0, 4); // Set command to STEP
    Atomics.notify(managerView, 0, 1); // Notify the worker to step execution
  };
  const resume = () => {
    Atomics.store(managerView, 0, 6); // Set command to RESUME
    Atomics.notify(managerView, 0, 1); // Notify the worker to resume execution
  };

  const setSpeed = (value: number) => {
    Atomics.store(managerView, 2, value); // Set command to RUN with speed
    Atomics.notify(managerView, 0, 1); // Notify the worker to adjust speed
  };
  const reset = () => {
    Atomics.store(managerView, 0, 5); // Set command to RESET
    Atomics.notify(managerView, 0, 1); // Notify the worker to reset the CPU
  };
  return {
    buffers,
    load,
    start,
    pause,
    step,
    resume,
    setSpeed,
    reset,
    assembly,
    workerRef,
    setAssembly,
  };
}

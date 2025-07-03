"use client";
import { useComputer } from "@/lib/Context/ComputerContext";
import { useEffect, useRef, useState } from "react";
import Grid from "./_components/Grid";
import NavBar from "./_components/NavBar";
export default function Home() {
  const workerRef = useRef<Worker | null>(null);
  const {
    setFrequency,
    setPc,
    setRegisters,
    setscreenmemory,
    setRunning,
    memory,
    frequency,
    running,
    setAssembly,
  } = useComputer();
  // hold current slider value in Hz
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: "keyEvent",
          key: e.key,
          pressed: true,
        });
      }
    });
    window.addEventListener("keyup", (e) => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: "keyEvent",
          key: e.key,
          pressed: false,
        });
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("keyup", () => {});
    };
  }, []);
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../lib/Workers/sim.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.type === "state") {
        setPc(e.data.pc);
        setRegisters(e.data.registers);
        setscreenmemory(e.data.memory);
      } else if (e.data.type === "screen") {
        setscreenmemory(e.data.memory);
        setRegisters(e.data.registers);
      } else if (e.data.type === "loadMemory") {
        setAssembly(e.data.assembly);
      }
    };
    setscreenmemory(memory); // initial screen memory
    // load memory once
    workerRef.current.postMessage({
      type: "loadMemory",
      payload: memory,
    });

    return () => {
      workerRef.current?.postMessage({ type: "stop" });
      workerRef.current?.terminate();
    };
  }, [memory]);

  const handleStart = () => {
    workerRef.current?.postMessage({ type: "start", frequencyHz: frequency });
    setRunning(true);
  };

  const handleStop = () => {
    workerRef.current?.postMessage({ type: "stop" });
    setRunning(false);
  };

  const handleStep = () => {
    workerRef.current?.postMessage({ type: "step" });
  };

  const handleFreqChange = () => {
    workerRef.current?.postMessage({
      type: "setFrequency",
      frequencyHz: frequency,
    });
  };
  return (
    <main className="flex flex-col h-screen">
      <NavBar />
      <Grid
        handleStart={handleStart}
        handleFreqChange={handleFreqChange}
        handleStep={handleStep}
        handleStop={handleStop}
      />
    </main>
  );
}

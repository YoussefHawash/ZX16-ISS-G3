"use client";
import { Button } from "@/components/ui/button";
import { cpu } from "@/lib/cpu";
import { useMemory } from "@/lib/MemoryContext";
import { binToHex, decimalToBinary } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CodeWindow from "./codewindow";
import KeyboardLayout from "./keyboard";
import Registers from "./registerTable";
import Screen from "./screen";
import Terminal from "./terminal";
import TextUpload from "./TextUpload";

export default function Computer() {
  const cpuRef = useRef<cpu | null>(null);
  const { memory, setMemory } = useMemory();
  const [clockstate, setClockstate] = useState(0);
  const [PC, setPC] = useState(0);
  const [registers, setRegisters] = useState<string[]>([]);
  const [Assembly, setAssembly] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(true);
  const [isHalted, setIsHalted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const updateDisplay = (state: number) => {
    if (!cpuRef.current) return;
    setRegisters(cpuRef.current.getRegisters());
    setPC(cpuRef.current.getPC());
    setClockstate(state);
    setHistory(cpuRef.current?.getTerminal() || []);
    setIsPaused(cpuRef.current.getPaused());
    setIsHalted(cpuRef.current.getHalted());
  };
  function initializeCPU(): () => void {
    let cpuinstance: cpu | null = null;
    if (memory.length > 0) {
      if (!cpuRef.current) {
        cpuinstance = new cpu(memory);
        cpuRef.current = cpuinstance;
      } else {
        cpuinstance = cpuRef.current;
      }
      cpuinstance.Reset();
      setAssembly(cpuinstance.getAssembly());
      const clock = cpuinstance.clock(2, (state: number) => {
        updateDisplay(state);
      });
      return () => {
        clock();
      };
    }
    return () => {
      // No-op if memory is empty
    };
  }
  useEffect(() => {
    initializeCPU();
  }, [memory]);

  const handlePause = () => {
    if (cpuRef.current) {
      if (isHalted) {
        initializeCPU();
      } else {
        cpuRef.current.togglePause();
      }
    }
  };

  return (
    <>
      <div className="flex-2/3">
        <div className="flex flex-row items-center justify-between gap-10 px-3 ">
          <div className="w-20">
            <h1>
              Clock:{" "}
              <span className={clockstate ? "text-green-500" : "text-red-700"}>
                {clockstate}
              </span>
            </h1>
          </div>
          <h1>
            Program Counter:{" "}
            {`0x${(PC * 2).toString(16).toUpperCase().padStart(4, "0")}`}
          </h1>
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={() => {
                handlePause();
              }}
              type="submit"
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isPaused ? "Play" : isHalted ? "Reset" : "Pause"}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                if (!cpuRef.current) return;
                if (isHalted) {
                  initializeCPU();
                }
                cpuRef.current?.step();
                updateDisplay(0);
              }}
              type="submit"
              className="cursor-pointer bg-transparent hover:bg-transparent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="h-2"></div>
        <CodeWindow Instructions={Assembly} />
        <div className=" mx-auto flex justify-between items-center ">
          <Button variant="outline">
            <Link href="/memory">Inspect Memory</Link>
          </Button>
          <TextUpload onFileRead={setMemory} />
        </div>
        <Terminal history={history} />
      </div>
      <div className="flex-1/3 flex flex-col items-center justify-between gap-10">
        <Screen />
        <KeyboardLayout className="w-2/3 " />
        <Registers values={registers} />
      </div>
    </>
  );
}

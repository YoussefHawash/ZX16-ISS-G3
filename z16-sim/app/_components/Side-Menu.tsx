import { Tab, Tabs } from "@/components/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import Simulator from "@/hooks/use-cpu";
import React, { use, useEffect, useRef, useState } from "react";
import Screen from "./screen";
// RISC-V register naming conventions

const standardNames = ["x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7"];
const abiNames = ["t0", "ra", "sp", "s0", "s1", "t1", "a0", "a1"];

type LastChange = {
  register: string;
  index: number;
  prevValue: string;
  newValue: string;
} | null;

export function Registers() {
  const [useABI, setUseABI] = useState(false);
  const [system, setSystem] = useState("HexaDecimal");
  const [lastChange, setLastChange] = useState<LastChange>(null);
  const [registerValues, setRegisterValues] = useState<Uint16Array>(
    new Uint16Array(32)
  ); // Assuming 32 registers
  const { buffers } = Simulator();
  const currentNames = useABI ? abiNames : standardNames;

  // Track register changes and trigger re-renders
  useEffect(() => {
    let animationId: number;

    const update = () => {
      // Create a new Uint16Array to trigger state update
      const newRegisters = new Uint16Array(buffers.registers);
      setRegisterValues(newRegisters);
      animationId = requestAnimationFrame(update);
    };

    update();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [buffers.registers]);

  const formatValue = (value: number, sys: string) => {
    const byte = value.toString(2).padStart(16, "0"); // Convert to 16-bit binary string
    switch (sys) {
      case "HexaDecimal":
        return "0x" + value.toString(16).toUpperCase().padStart(4, "0");
      case "Binary":
        return byte;
      case "Decimal":
        return value.toString(10).padStart(5, " ");
      default:
        return byte;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <Select
            defaultValue="HexaDecimal"
            onValueChange={(value) => setSystem(value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="HexaDecimal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HexaDecimal">Hexadecimal</SelectItem>
              <SelectItem value="Binary">Binary</SelectItem>
              <SelectItem value="Decimal">Decimal</SelectItem>
            </SelectContent>
          </Select>

          <Toggle pressed={useABI} onPressedChange={setUseABI}>
            {useABI ? "ABI Names" : "Standard"}
          </Toggle>
        </div>
      </div>

      {/* Registers Table */}
      <div className=" overflow-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {/* Table Header */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-800 border-b border-zinc-700 px-4 py-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Register
              </h3>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">
                Value
              </h3>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-800">
              {currentNames.map((name, idx) => {
                const isChanged = lastChange && lastChange.index === idx;
                const value = registerValues[idx] || 0;

                return (
                  <div
                    key={`register-${idx}`}
                    className={`grid grid-cols-2 gap-4 px-4 py-3 transition-all duration-300
              ${isChanged ? "bg-amber-500/20" : ""}`}
                  >
                    <div
                      className="font-mono text-sm text-zinc-300"
                      style={{
                        fontFamily:
                          "Consolas, 'Fira Mono', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', monospace",
                      }}
                    >
                      {name}
                    </div>
                    <div
                      className={`font-mono text-sm text-right transition-all duration-300 text-zinc-400`}
                      style={{
                        fontFamily:
                          "Consolas, 'Fira Mono', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', monospace",
                      }}
                    >
                      {formatValue(value, system)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Screen />
    </div>
  );
}

function Memory() {
  const [system, setSystem] = useState<string>("HexaDecimal");

  return (
    <div className="flex flex-col p-4 h-full items-center">
      <Select
        defaultValue="HexaDecimal"
        onValueChange={(value) => setSystem(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="HexaDecimal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HexaDecimal">Hexadecimal</SelectItem>
          <SelectItem value="Binary">Binary</SelectItem>
          <SelectItem value="Decimal">Decimal</SelectItem>
        </SelectContent>
      </Select>

      <div className="mt-4">
        <div className="flex gap-1 flex-wrap">
          {/* {memory.slice(0xf000, 0xffff).map((byte, index) => (
            <div
              className="flex flex-col p-1 items-center border rounded"
              key={index}
            >
              <span className="text-gray-500">
                {`0x${(index + 0xf000).toString(16).toUpperCase()}`}
              </span>
              <span key={index}>
                {system === "HexaDecimal"
                  ? parseInt(byte, 2)
                      .toString(16)
                      .toUpperCase()
                      .padStart(2, "0")
                  : system === "Binary"
                  ? byte
                  : parseInt(byte, 2).toString(10)}
              </span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}

export function Convertor() {
  const [system, setSystem] = useState<string>("HexaDecimal");
  return (
    <div className="flex flex-col p-4 h-full">
      <Select
        defaultValue="HexaDecimal"
        onValueChange={(value) => setSystem(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="HexaDecimal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HexaDecimal">Hexadecimal</SelectItem>
          <SelectItem value="Binary">Binary</SelectItem>
          <SelectItem value="Decimal">Decimal</SelectItem>
        </SelectContent>
      </Select>

      <div className="mt-4">
        <div className="flex gap-1 flex-wrap"></div>
      </div>
    </div>
  );
}

export default function SideMenu() {
  const tabData: Tab[] = [
    { label: "Registers", content: <Registers /> },
    { label: "Convertor", content: <Convertor /> },
    { label: "Memory", content: <Memory /> },
  ];
  return <Tabs className="h-[100%] w-full" tabs={tabData} />;
}

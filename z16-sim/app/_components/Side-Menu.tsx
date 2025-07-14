import { Tab, Tabs } from "@/components/Tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import Simulator from "@/hooks/use-cpu";
import { ArrowRightLeft, Check, Copy, Search, Settings, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Screen from "./screen";
// RISC-V register naming conventions

const standardNames = ["x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7"];
const abiNames = ["t0", "ra", "sp", "s0", "s1", "t1", "a0", "a1"];

export function Registers() {
  const [useABI, setUseABI] = useState(false);
  const [system, setSystem] = useState("HexaDecimal");
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
                const value = registerValues[idx] || 0;

                return (
                  <div
                    key={`register-${idx}`}
                    className={`grid grid-cols-2 gap-4 px-4 py-3 transition-all duration-300`}
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

const MemoryViewer = () => {
  const { buffers } = Simulator();
  const memory = new Uint8Array(buffers.memory);
  const [bytesPerRow, setBytesPerRow] = useState(1);
  const [addressFormat, setAddressFormat] = useState("hex");
  const [valueFormat, setValueFormat] = useState("hex");
  const [addressInput, setAddressInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });

  const ROW_HEIGHT = 24;
  const BUFFER_SIZE = 10;

  const totalRows = Math.ceil(memory.length / bytesPerRow);

  const formatAddress = useCallback(
    (address: number) => {
      if (addressFormat === "hex") {
        return "0x" + address.toString(16).toUpperCase().padStart(4, "0");
      }
      return address.toString().padStart(6, "0");
    },
    [addressFormat]
  );

  const handleJumpToAddress = useCallback(() => {
    if (!addressInput) {
      return;
    }

    let address;

    // Parse address based on format
    if (addressInput.startsWith("0x")) {
      // Hex address
      address = parseInt(addressInput, 16);
    } else {
      // Decimal address
      address = parseInt(addressInput, 10);
    }

    if (!isNaN(address) && address >= 0 && address < memory.length) {
      // Scroll to the row containing this address
      const row = Math.floor(address / bytesPerRow);
      if (containerRef.current) {
        containerRef.current.scrollTop = row * ROW_HEIGHT;
      }
    }
  }, [addressInput, memory.length, bytesPerRow]);
  const formatValue = useCallback(
    (value: number) => {
      if (valueFormat === "hex") {
        return value.toString(16).toUpperCase().padStart(2, "0");
      }
      return value.toString().padStart(3, "0");
    },
    [valueFormat]
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;

    const startRow = Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE;
    const endRow =
      Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_SIZE;

    setVisibleRange({
      start: Math.max(0, startRow),
      end: Math.min(totalRows, endRow),
    });
  }, [totalRows]);

  useEffect(() => {
    handleScroll();
  }, [bytesPerRow, handleScroll]);

  const renderRow = useCallback(
    (rowIndex: number) => {
      const startAddress = rowIndex * bytesPerRow;
      const endAddress = Math.min(startAddress + bytesPerRow, memory.length);
      const rowData = [];

      for (let i = startAddress; i < endAddress; i++) {
        rowData.push(
          <span
            key={i}
            className={`
            inline-block w-10 text-center font-mono text-sm
            
          `}
          >
            {formatValue(memory[i])}
          </span>
        );
      }

      // Fill remaining cells if row is incomplete
      for (let i = endAddress; i < startAddress + bytesPerRow; i++) {
        rowData.push(
          <span
            key={i}
            className="inline-block w-10 text-center font-mono text-sm text-gray-300"
          >
            --
          </span>
        );
      }

      return (
        <div
          key={rowIndex}
          className="flex items-center hover:bg-neutral-800"
          style={{ height: ROW_HEIGHT }}
        >
          <div className="w-24 px-2 font-mono text-sm text-gray-600">
            {formatAddress(startAddress)}
          </div>
          <div className="flex-1 flex gap-1 px-2">{rowData}</div>
          <div className="px-2 font-mono text-xs text-gray-500">
            {Array.from({ length: endAddress - startAddress }, (_, i) => {
              const byte = memory[startAddress + i];
              return byte >= 32 && byte <= 126
                ? String.fromCharCode(byte)
                : ".";
            }).join("")}
          </div>
        </div>
      );
    },
    [bytesPerRow, memory, formatAddress, formatValue]
  );

  const visibleRows = [];
  for (let i = visibleRange.start; i < visibleRange.end; i++) {
    visibleRows.push(renderRow(i));
  }

  return (
    <div className="w-full h-[95%] flex flex-col bg-neutral-900 shadow-lg">
      {/* Header */}
      <div className="flex items-center p-2 border-b justify-between ">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJumpToAddress()}
            placeholder="Search Adrress"
            className="pl-8 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">
            Value Format: {valueFormat}
          </span>
          <span className="text-xs text-gray-500">
            Address Format: {addressFormat}
          </span>
        </div>
        {/* Status  */}

        {/* Settings Button */}
        <Dialog>
          <DialogTrigger className=" hover:cursor-pointer rounded">
            <Settings size={20} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> Memory Viewer Settings</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="flex items-center justify-center ">
              <div className="  w-full">
                <div className="space-y-4">
                  {/* Bytes per row */}
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Bytes per Row
                    </label>
                    <select
                      value={bytesPerRow}
                      onChange={(e) => setBytesPerRow(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 4, 8, 16, 32].map((n) => (
                        <option key={n} value={n} className="bg-neutral-800">
                          {n} bytes
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address format */}
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Address Format
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="hex"
                          checked={addressFormat === "hex"}
                          onChange={(e) => setAddressFormat(e.target.value)}
                          className="mr-2"
                        />
                        Hexadecimal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="decimal"
                          checked={addressFormat === "decimal"}
                          onChange={(e) => setAddressFormat(e.target.value)}
                          className="mr-2"
                        />
                        Decimal
                      </label>
                    </div>
                  </div>

                  {/* Value format */}
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Value Format
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="hex"
                          checked={valueFormat === "hex"}
                          onChange={(e) => setValueFormat(e.target.value)}
                          className="mr-2"
                        />
                        Hexadecimal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="decimal"
                          checked={valueFormat === "decimal"}
                          onChange={(e) => setValueFormat(e.target.value)}
                          className="mr-2"
                        />
                        Decimal
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Memory Grid */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ height: "calc(100% - 80px)" }}
      >
        {/* Virtual scroll spacer */}
        <div style={{ height: totalRows * ROW_HEIGHT }}>
          <div
            style={{
              transform: `translateY(${visibleRange.start * ROW_HEIGHT}px)`,
            }}
          >
            {/* Add header*/}
            <div className="flex items-center bg-neutral-900 py-2 border-b-1 text-gray-400 font-mono text-xs">
              <div className="w-24 px-2">Address</div>
              <div className="flex-1 flex gap-1 px-2">
                {Array.from({ length: bytesPerRow }, (_, i) => (
                  <span
                    key={i}
                    className="inline-block w-10 text-center font-semibold"
                  >
                    +{i.toString(16).toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="px-2">ASCII</div>
            </div>
            {visibleRows}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SideMenu() {
  const tabData: Tab[] = [
    { label: "Registers", content: <Registers /> },
    { label: "Memory", content: <MemoryViewer /> },
  ];
  return <Tabs className="h-[100%] w-full" tabs={tabData} />;
}

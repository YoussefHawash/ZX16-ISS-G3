"use client";
import { useComputer } from "@/lib/Context/ComputerContext";
import parseInstructionZ16 from "@/lib/disassembler";
import { cpu } from "../../lib/cpu";
import { memoryStore } from "../../lib/memoryStore";
const core = cpu.getInstance();
export default function TextUpload() {
  const { setAssembly } = useComputer();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      memoryStore.writeBlock(0, buffer);
      setAssembly(core.Disassemble());
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex justify-end items-center space-x-2">
      <label
        htmlFor="file-upload"
        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors border border-blue-700 text-sm"
      >
        Upload File
        <input
          type="file"
          accept=".bin"
          onChange={handleFileChange}
          id="file-upload"
          className="hidden"
        />
      </label>
    </div>
  );
}

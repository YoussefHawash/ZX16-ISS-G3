"use client";

import { Button } from "@/components/ui/button";
import { useComputer } from "@/lib/Context/ComputerContext";

export default function TextUpload() {
  const { setMemory } = useComputer();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(buffer);
      // Convert each byte to an 8-character binary string
      const binaryStr = Array.from(bytes).map((byte) =>
        byte.toString(2).padStart(8, "0")
      );
      setMemory(binaryStr);
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

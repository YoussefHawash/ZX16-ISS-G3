"use client";

import Simulator from "@/hooks/use-cpu";
import { useSharedBuffers } from "@/lib/BufferContext";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function TextUpload({ className }: { className?: string }) {
  const { load, reset } = Simulator();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return;
      load(buffer);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className={cn("flex justify-end items-center space-x-2", className)}>
      <label
        htmlFor="file-upload"
        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-xl cursor-pointer hover:bg-green-800 transition-colors  text-xs"
      >
        Upload Binary
        <input
          ref={fileInputRef}
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

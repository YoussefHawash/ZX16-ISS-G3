"use client";
import MemoryInspector from "./_components/memoryInspector";

export default function MemoryPage() {
  return (
    <main className="p-4 flex flex-col h-screen justify-start ">
      <div className="flex-1 flex items-center justify-center">
        <MemoryInspector />
      </div>
    </main>
  );
}

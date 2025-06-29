"use client";
import TextUpload from "@/app/_components/TextUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMemory } from "@/lib/MemoryContext";
import { binToHex, cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
const memorySections = [
  { name: "Interrupt Vector", start: 0x0000, end: 0x0010 },
  { name: "ProgramCode", start: 0x0020, end: 0x7fff },
  { name: "MMIO", start: 0x8000, end: 0xffff },
];
export default function MemoryInspector() {
  const { memory, setMemory } = useMemory();
  const [start, setStart] = useState(0x020);
  const [end, setEnd] = useState(100);
  const [Activesection, setActiveSection] = useState<string>("ProgramCode");

  return (
    <div className="w-[80%] ">
      <nav className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Memory Inspector</h1>
        </div>
        <div className="flex gap-4 mr-4 justify-center items-center">
          {memorySections.map((section) => (
            <Button
              variant={"link"}
              key={section.name}
              onClick={() => {
                setStart(section.start);
                setEnd(section.end);
                setActiveSection(section.name);
              }}
              className={cn(
                "text-sm text-gray-400 hover:cursor-pointer ",
                section.name === Activesection
                  ? "text-white font-bold"
                  : "text-gray-400"
              )}
            >
              {section.name}
            </Button>
          ))}
        </div>
      </nav>
      <div className="flex flex-col h-[600px]  bg-neutral-900 text-white p-2 rounded-lg overflow-auto text-sm">
        <div className="flex items-center gap-4 text-md border-b-2 border-gray-800">
          <span className="text-gray-400  text-center ">Address</span>
          <span className="text-gray-400  ">Value</span>
          <span className="text-gray-400 text-end ml-auto px-10">ASCII</span>
        </div>
        {memory.slice(start, end).map((byte, index) => (
          <div
            className="flex items-center gap-4 text-md border-b-2 border-gray-800"
            key={index}
          >
            <span className="text-gray-400 bg-neutral-800  w-15 text-center ">
              {(index + start).toString(16).padStart(4, "0").toUpperCase()}
            </span>
            <span className="text-gray-400  ">
              {binToHex(byte).slice(2, 4)}
            </span>
            <span className="text-gray-400 text-end ml-auto px-10">
              {String.fromCharCode(parseInt(byte, 2))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end ">
        <TextUpload onFileRead={setMemory} />
      </div>
    </div>
  );
}

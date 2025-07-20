import Simulator from "@/hooks/use-cpu";
import { useWorker } from "@/lib/BufferContext";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
function Console() {
  const [command, setCommand] = useState<number>(0);
  const { buffers, resume } = Simulator();
  const worker = useWorker();
  const [output, setOutput] = useState<{ text: string; type: string }[]>([
    {
      text: "Welcome to the ZX16 Simulator! Type 'help' for commands.",
      type: "system",
    },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Handle worker messages
  useEffect(() => {
    if (!worker) return;

    const handleWorkerMessage = (e: MessageEvent) => {
      const { type, content } = e.data as { type: string; content?: string };

      switch (type) {
        case "RegPrint":
          addOutput(
            `Registers: [${new Int16Array(buffers.registers).join(", ")}]`,
            "system"
          );
          break;

        case "MemPrint":
          addOutput(
            `Memory: [${new Uint8Array(buffers.memory).join(" ")}]`,
            "system"
          );
          break;

        case "readInt":
          setCommand(1);
          toast.info("waiting for input...");
          inputRef.current?.focus();
          break;

        case "readStr":
          setCommand(2);
          toast.info("waiting for input...");
          inputRef.current?.focus();
          break;

        case "print":
          if (content !== undefined) {
            addOutput(content, "output");
          }
          break;

        default:
          break;
      }
    };

    worker.addEventListener("message", handleWorkerMessage);

    return () => {
      worker.removeEventListener("message", handleWorkerMessage);
    };
  }, [worker]);

  const addOutput = (text: string, type = "output") => {
    setOutput((prev) => [...prev, { text, type }]);
  };

  const handleCommand = (cmd: any) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to output
    addOutput(`> ${trimmedCmd}`, "command");

    // Process command
    processCommand(trimmedCmd);
  };

  const processCommand = (cmd: any) => {
    const parts = cmd.toLowerCase().split(" ");
    const command = parts[0];

    switch (command) {
      case "help":
        addOutput("Available commands:", "output");
        addOutput("  help - Show this help message", "output");
        addOutput("  clear - Clear the terminal", "output");
        break;
      case "clear":
        setOutput([]);
        break;
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && input !== "") {
      handleCommand(input);
      setInput("");
      if (command === 1) {
        Atomics.store(
          new Int16Array(buffers.registers),
          6,
          parseInt(input, 10)
        );
        resume(); // Resume the worker after input
        setCommand(0);
      }
      if (command === 2) {
        const regview = new Int16Array(buffers.registers);
        const address = regview[6]; // a0
        const max_len = regview[7]; // a1
        // encode the input string into memory
        const memoryView = new Uint8Array(buffers.memory);
        for (let i = 0; i < input.length && i < max_len; i++) {
          memoryView[address + i] = input.charCodeAt(i);
        }
        resume();
        setCommand(0);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-green-400 font-mono">
      {/* Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        {output.map((line, index) => (
          <div key={index} className="flex items-center">
            <span className="text-gray-500 text-xs min-w-15 ">{line.type}</span>
            <span
              className={`
              ${line.type === "command" ? "text-cyan-400" : ""}
              ${line.type === "error" ? "text-red-400" : ""}
              ${line.type === "system" ? "text-yellow-400" : ""}
              ${line.type === "output" ? "text-green-400" : ""}
            `}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-800">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-600"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default function Panel() {
  return (
    <div className="h-full">
      <Console />
    </div>
  );
}

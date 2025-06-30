"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PrefixedInput } from "./prefixedInput";

export default function Terminal({
  className,
  history,
}: {
  className?: string;
  history?: string[];
}) {
  const [localhistory, setHistory] = useState<string[]>([]);
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  useEffect(() => {
    if (history) {
      setHistory(history);
    }
  }, [history]);
  return (
    <div className={cn(className, "flex flex-col gap-2 p-4")}>
      <PrefixedInput
        prefix=">"
        className="dark:bg-black inline"
        type="text"
        placeholder=">"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const command = e.currentTarget.value.slice(1); // Remove the prefix '>'
            e.currentTarget.value = " ";
            if (command.trim() === "") return; // Ignore empty commands
            setHistory((history) => ({
              ...history,
              [time]: command,
            }));
          }
        }}
      />
      <div className="bg-black min-h-10 p-2 max-h-40 overflow-y-auto">
        <h1 className="font-bold">Command Line Interface</h1>
        <div className="h-2"></div>
        {Object.keys(localhistory).length ? (
          Object.entries(localhistory).map(([timestamp, cmd], index) => (
            <div key={index} className="text-gray-300">
              <span className="text-gray-500 opacity-75">
                <span className="text-green-500">{"> "}</span>
              </span>
              {cmd}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No commands executed yet.</div>
        )}
      </div>
    </div>
  );
}

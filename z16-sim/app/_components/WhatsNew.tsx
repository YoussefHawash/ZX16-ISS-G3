"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

export default function WhatsNewModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const updates = [
    {
      date: "2025-07-20",
      title: "🐞 Bug Fixes & Improvements",
      description:
        "Resolved minor issues and Added Assembler Error Handling. Now you can see errors in the assembler output. Also, Now you can report bugs directly from the app.",
    },
    {
      date: "2025-07-18",
      title: "🎉 Z-16 Simulator Launched!",
      description:
        "Assemble and run Z-16 assembly code directly in your browser.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl mx-4">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
        >
          <X size={20} />
        </Button>

        <h2 className="text-xl font-bold text-center text-[var(--text)] mb-4">
          📢 What’s New
        </h2>

        <ul className="space-y-3">
          {updates.map((item, idx) => (
            <li key={idx} className="border-l-4 pl-3 border-blue-500">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.date}
              </p>
              <h3 className="text-sm font-semibold text-[var(--text)]">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

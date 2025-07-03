// components/Tabs.tsx
import React, { useState } from "react";

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  /** Optional className to style the container */
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`${className} h-full`}>
      {/* Tab bar */}
      <div className="flex border-b bg-neutral-900">
        <div className="flex ">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-1 px-4 py-2 text-center border-b-2 hover:cursor-pointer text-sm  ${
                activeIndex === idx
                  ? "border-blue-500 font-bold"
                  : "border-transparent"
              } hover:bg-neutral-800 focus:outline-none`}
            >
              <span className="w-fit whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active tab content */}
      <div className="w-full overflow-y-auto h-full">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}

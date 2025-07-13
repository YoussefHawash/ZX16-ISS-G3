import { Tab, Tabs } from "@/components/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
function Console() {
  return <div>Welcome to the home page!</div>;
}
function MachineCode() {
  const [system, setSystem] = useState<string>("HexaDeciaml");

  return (
    <div className="flex flex-col p-4  h-full">
      <Select
        defaultValue="HexaDeciaml"
        onValueChange={(value) => setSystem(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="HexaDeciaml" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HexaDeciaml">HexaDeciaml</SelectItem>
          <SelectItem value="Binary">Binary</SelectItem>
          <SelectItem value="Deciaml">Deciaml</SelectItem>
        </SelectContent>
      </Select>

      <div className="mt-4">
        <div className="flex gap-1 flex-wrap"></div>
      </div>
    </div>
  );
}

const tabData: Tab[] = [
  { label: "Console", content: <Console /> },
  { label: "Machine Code", content: <MachineCode /> },
];
export default function Panel() {
  return (
    <div className="h-[85%]">
      <Tabs className=" w-full" tabs={tabData} />
    </div>
  );
}

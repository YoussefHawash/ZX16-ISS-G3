"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "./CodeEditor";
import Panel from "./Panel";
import SideMenu from "./Side-Menu";

export default function Grid({
  handleStart,
  handleStop,
  handleStep,
  handleFreqChange,
}: {
  handleStart: () => void;
  handleStop: () => void;
  handleStep: () => void;
  handleFreqChange: () => void;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      <ResizablePanel defaultSize={75} minSize={15}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <CodeEditor
              handleStart={handleStart}
              handleStep={handleStep}
              handleStop={handleStop}
              handleFreqChange={handleFreqChange}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40}>
            <Panel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={25}
        minSize={25}
        className="flex flex-col justify-between"
      >
        <SideMenu />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

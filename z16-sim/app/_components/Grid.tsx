"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Simulator from "@/hooks/use-cpu";
import { useWorker } from "@/lib/BufferContext";
import { useEffect, useRef } from "react";
import CodeEditor from "./CodeEditor";
import Panel from "./Panel";
import SideMenu from "./Side-Menu";

export default function Grid() {
  Simulator();
  const worker = useWorker(); // assume this returns a Worker | null

  const audioCtxRef = useRef<AudioContext>(null!);
  useEffect(() => {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new Ctor();
  }, []);

  useEffect(() => {
    if (!worker) return;

    const handleMessage = (event: MessageEvent) => {
      const audioCtx = audioCtxRef.current!;
      if (event.data.type === "playTone") {
        const { freq, durr } = event.data as { freq: number; durr: number };
        if (audioCtx.state === "suspended") audioCtx.resume();
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        const startTime = audioCtx.currentTime;
        osc.start(startTime);
        osc.stop(startTime + durr / 1000);
      } else if (event.data.type === "SetVolume") {
        const { volume } = event.data as { volume: number };
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.connect(audioCtx.destination);
      } else if (event.data.type === "stopAudio") {
        if (audioCtx.state === "running") audioCtx.suspend();
      }
    };

    worker.addEventListener("message", handleMessage);
    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [worker]);

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      <ResizablePanel defaultSize={75} minSize={15}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40} minSize={40} maxSize={40}>
            <Panel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <SideMenu />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

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
  const worker = useWorker();

  // refs for AudioContext and shared GainNode
  const audioCtxRef = useRef<AudioContext>(null!);
  const gainNodeRef = useRef<GainNode>(null!);

  useEffect(() => {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new Ctor();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.0;
    gainNode.connect(audioCtx.destination);

    audioCtxRef.current = audioCtx;
    gainNodeRef.current = gainNode;
  }, []);

  useEffect(() => {
    if (!worker) return;

    let nextAvailableTime = 0;

    const handleMessage = (event: MessageEvent) => {
      const audioCtx = audioCtxRef.current!;
      const gainNode = gainNodeRef.current!;
      if (!audioCtx || !gainNode) return;

      switch (event.data.type) {
        case "playTone": {
          const { freq, durr } = event.data as {
            freq: number;
            durr: number;
          };

          if (audioCtx.state === "suspended") audioCtx.resume();

          const now = audioCtx.currentTime;
          const durationSec = durr / 1000;
          const startTime = Math.max(now, nextAvailableTime);
          nextAvailableTime = startTime + durationSec;

          const osc = audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, startTime);
          osc.connect(gainNode);
          osc.start(startTime);
          osc.stop(startTime + durationSec);
          break;
        }
        case "SetVolume": {
          const { volume } = event.data as { volume: number };
          // normalize 0–255 → 0.0–1.0
          const normalized = Math.min(Math.max(volume / 255, 0), 1);
          gainNode.gain.setTargetAtTime(normalized, audioCtx.currentTime, 0.01);
          break;
        }
        case "stopAudio": {
          audioCtx.suspend();
          nextAvailableTime = 0;
          break;
        }
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

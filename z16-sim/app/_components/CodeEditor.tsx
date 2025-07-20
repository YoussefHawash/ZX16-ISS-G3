import { Button } from "@/components/ui/button";
import Slider from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import Simulator from "@/hooks/use-cpu";
import instructionFormatsByType from "@/public/z16-INST.json";
import { SimulatorState } from "@/types/Definitions";
import { loader, Monaco } from "@monaco-editor/react";
import { ArrowRight, Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

loader.config({ paths: { vs: "/monaco/vs" } });

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeEditor({}: {}) {
  const editorRef = useRef<ReturnType<Monaco["editor"]["create"]> | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const decorationsRef = useRef<string[]>([]);
  const { buffers, assembly, start, pause, setSpeed, step, reset } =
    Simulator();
  const pcRef = useRef<HTMLSpanElement>(null);
  const [frequency, setFrequency] = useState(1);
  const [state, setState] = useState<SimulatorState>(SimulatorState.Paused);
  const prevStateRef = useRef<SimulatorState>(SimulatorState.Paused);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;

    const mnemonics = Object.values(instructionFormatsByType).flatMap((group) =>
      Object.keys(group)
    );

    const mnemonicRegex = `\\b(${mnemonics.join("|")})\\b`;

    monaco.languages.register({ id: "asm", aliases: ["Assembly", "asm"] });

    monaco.languages.setMonarchTokensProvider("asm", {
      defaultToken: "",
      tokenPostfix: ".asm",
      tokenizer: {
        root: [
          [/^[a-zA-Z_]\w*:/, "keyword.i"],
          [new RegExp(mnemonicRegex, "i"), "keyword.r"],
          [/\b(x[0-7])\b/i, "variable"],
          [/\b0x[0-9A-Fa-f]+\b/, "number.hex"],
          [/\b\d+\b/, "number"],
          [/;.*/, "comment"],
          [/[,\[\]]/, "delimiter"],
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
      },
    });

    monaco.editor.defineTheme("asmTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword.r", foreground: "ff5555" },
        { token: "keyword.i", foreground: "55ff55" },
        { token: "variable", foreground: "ccccff" },
        { token: "number.hex", foreground: "ffaa00" },
        { token: "number", foreground: "ffff55" },
        { token: "comment", foreground: "888888", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorCursor.foreground": "#ffffff",
        "editorLineNumber.foreground": "#858585",
        "editor.selectionBackground": "#264f78",
      },
    });

    monaco.editor.setTheme("asmTheme");
    monaco.editor.setModelLanguage(editor.getModel()!, "asm");
  }

  // Update highlighted line when highlightLine prop changes
  useEffect(() => {
    if (!editorRef.current) return;
    const updateHighlightedLine = (pc: number) => {
      if (editorRef.current && pc !== undefined) {
        // Clear previous decorations
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          []
        );

        // Add new decoration for the highlighted line
        if (pc > 0 && pc <= assembly.length) {
          decorationsRef.current = editorRef.current.deltaDecorations(
            decorationsRef.current,
            [
              {
                range: {
                  startLineNumber: pc,
                  startColumn: 1,
                  endLineNumber: pc,
                  endColumn: 1000, // Make sure it covers the whole line
                },
                options: {
                  isWholeLine: true,
                  className: "myLineHighlight",
                },
              },
            ]
          );
        }
      }
      if (editorRef.current) {
        if (autoScroll) {
          editorRef.current.revealLineInCenter(pc);
        }
      }
    };
    const view = new Uint16Array(buffers.pc);
    const currState = new Uint16Array(buffers.state);
    let rafId: number;

    const update = () => {
      let changed = prevStateRef.current !== currState[0];
      if (changed) {
        prevStateRef.current = currState[0];
        setState(currState[0] as SimulatorState);
      }
      updateHighlightedLine(view[0] + 1);
      if (pcRef.current) {
        pcRef.current.textContent = (view[0] + 1).toString();
      }
      rafId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(rafId);
  }, [assembly, autoScroll]);

  return (
    <div className="relative flex flex-col h-full w-full">
      <style jsx global>{`
        .myLineHighlight {
          background: rgba(255, 255, 0, 0.2) !important;
        }
      `}</style>
      <MonacoEditor
        className="w-full bg-[#1e1e1e]"
        theme="vs-dark"
        defaultLanguage="asm"
        onMount={handleEditorDidMount}
        value={assembly.join("\n")}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          contextmenu: false,
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          occurrencesHighlight: "off",
          selectionHighlight: false,
          fontSize: 18,
          lineNumbersMinChars: 0,
        }}
      />
      <div className="flex justify-between items-center px-2 bg-neutral-900 border-t-1 border-neutral-800 ">
        <div className="flex items-center gap-2">
          <Button
            variant={"link"}
            className="hover:cursor-pointer hover:text-orange-400"
            onClick={() => reset()}
          >
            <RotateCcw />
          </Button>
          <Button
            className="hover:cursor-pointer hover:text-green-500 "
            variant={"link"}
            onClick={() => {
              if (state === SimulatorState.Running) {
                pause();
              } else {
                start();
              }
            }}
          >
            {state === SimulatorState.Running ? <Pause /> : <Play />}
          </Button>
          <Button
            variant={"link"}
            className="hover:cursor-pointer hover:text-orange-400"
            onClick={() => step()}
          >
            <ArrowRight />
          </Button>
          <Slider
            value={[frequency]}
            onValueChange={([val]) => {
              if (val > 30) {
                val = 3000;
              }
              setFrequency(val);
              setSpeed(val);
            }}
            max={31}
            step={1}
            min={1}
            className="w-50"
          />
          <Button
            variant={"ghost"}
            className="text-xs px-2 py-1 hover:bg-transparent"
            onClick={() => setAutoScroll((prev) => !prev)}
          >
            <input
              type="checkbox"
              checked={autoScroll}
              readOnly
              className=" accent-orange-400"
              style={{ pointerEvents: "none" }}
            />
            Auto Scroll
          </Button>
        </div>
        <div className="flex items-center gap-4 opacity-60">
          <span className="text-sm text-gray-400">
            PC:<span ref={pcRef}>{0}</span>{" "}
          </span>
          <span className="text-sm text-gray-400">
            Frequency: {frequency > 30 ? "3K" : frequency}Hz
          </span>
        </div>
      </div>
    </div>
  );
}

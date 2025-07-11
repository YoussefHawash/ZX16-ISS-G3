"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useComputer } from "@/lib/Context/ComputerContext";
import instructionFormatsByType from "@/public/z16-INST.json";
import { loader, Monaco } from "@monaco-editor/react";
import { ArrowRight, Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { use, useEffect, useRef } from "react";

loader.config({ paths: { vs: "/monaco/vs" } });

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeEditor({}: {}) {
  const { assembly } = useComputer();
  // useEffect(() => {
  //   if (frequency > 30) setPc(0); // Reset PC to 1 if frequency is above 30
  // }, [frequency]);
  const editorRef = useRef<ReturnType<Monaco["editor"]["create"]> | null>(null);
  const decorationsRef = useRef<string[]>([]);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;

    // 1️⃣ Flatten all mnemonics from the JSON
    const mnemonics = Object.values(instructionFormatsByType).flatMap((group) =>
      Object.keys(group)
    );

    // 2️⃣ Build a single regex: \b(add|sub|...|ecall)\b
    const mnemonicRegex = `\\b(${mnemonics.join("|")})\\b`;

    // 3️⃣ Register your language
    monaco.languages.register({ id: "asm", aliases: ["Assembly", "asm"] });

    // 4️⃣ Set up the Monarch tokenizer using that regex
    monaco.languages.setMonarchTokensProvider("asm", {
      defaultToken: "",
      tokenPostfix: ".asm",
      tokenizer: {
        root: [
          // labels
          [/^[a-zA-Z_]\w*:/, "keyword.i"],

          // instructions (from JSON)
          [new RegExp(mnemonicRegex, "i"), "keyword.r"],

          // registers
          [/\b(x[0-7])\b/i, "variable"],

          // hex numbers
          [/\b0x[0-9A-Fa-f]+\b/, "number.hex"],

          // decimal numbers
          [/\b\d+\b/, "number"],

          // comments
          [/;.*/, "comment"],

          // punctuation
          [/[,\[\]]/, "delimiter"],

          // everything else
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
      },
    });

    // 6️⃣ Define theme with highlight line style
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
  // useEffect(() => {
  //   if (editorRef.current && pc !== undefined) {
  //     // Clear previous decorations
  //     decorationsRef.current = editorRef.current.deltaDecorations(
  //       decorationsRef.current,
  //       []
  //     );

  //     // Add new decoration for the highlighted line
  //     if (pc > 0 && pc <= assembly.length) {
  //       decorationsRef.current = editorRef.current.deltaDecorations(
  //         decorationsRef.current,
  //         [
  //           {
  //             range: {
  //               startLineNumber: pc,
  //               startColumn: 1,
  //               endLineNumber: pc,
  //               endColumn: 1000, // Make sure it covers the whole line
  //             },
  //             options: {
  //               isWholeLine: true,
  //               className: "myLineHighlight",
  //             },
  //           },
  //         ]
  //       );
  //     }
  //   }
  // }, [pc, assembly.length]);

  useEffect(() => {
    if (editorRef.current && assembly.length > 0) {
      editorRef.current.setValue(assembly.join("\n"));
    }
  }, [assembly]);

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
        value={assembly.join("\n")}
        onMount={handleEditorDidMount}
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
      {/* <div className="flex justify-between items-center px-2 bg-neutral-900 border-t-1 border-neutral-800 "> */}
      {/* <div className="flex items-center gap-2">
          <Button
            className="hover:cursor-pointer hover:text-green-500 "
            variant={"link"}
            onClick={() => {
              if (running) {
                handleStop();
              } else {
                handleStart();
              }
            }}
          >
            {running ? <Pause /> : <Play />}
          </Button>
          <Button
            variant={"link"}
            className="hover:cursor-pointer hover:text-orange-400"
            onClick={() => handleStep()}
          >
            <ArrowRight />
          </Button>
          <Slider
            value={[frequency]}
            onValueChange={([val]) => {
              setFrequency(val);
              handleFreqChange();
            }}
            max={47}
            step={1}
            min={1}
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-4 opacity-60">
          <span className="text-sm text-gray-400">PC: {pc}</span>
          <span className="text-sm text-gray-400">
            Frequency: {frequency > 45 ? "Unlimited" : frequency + " Hz"}
          </span>
        </div>
      </div> */}
    </div>
  );
}

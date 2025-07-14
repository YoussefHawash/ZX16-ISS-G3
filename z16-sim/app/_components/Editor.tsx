// components/Editor.tsx
"use client";
import instructionFormatsByType from "@/public/z16-INST.json";
import { loader, Monaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";

loader.config({ paths: { vs: "/monaco/vs" } });

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
export type EditorProps = {
  onEditorMount?: (
    editor: ReturnType<Monaco["editor"]["create"]>,
    monaco: Monaco
  ) => void;
};
export function Editor({ onEditorMount }: EditorProps) {
  function handleEditorDidMount(editor: any, monaco: Monaco) {
    const mnemonics = Object.values(instructionFormatsByType)
      .flatMap((group) => Object.keys(group))
      .flatMap((m) => [m.toLowerCase(), m.toUpperCase()]);
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
    onEditorMount?.(editor, monaco);
  }

  return (
    <div className="flex flex-col h-4/5 w-full">
      <MonacoEditor
        className="w-full "
        theme="asmTheme"
        defaultLanguage="asm"
        onMount={handleEditorDidMount}
        value={""}
        options={{
          readOnly: false,
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
    </div>
  );
}

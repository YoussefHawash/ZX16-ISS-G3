"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Simulator from "@/hooks/use-cpu";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NumberConverter } from "./convertor";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogTrigger,
} from "./custom-dialog";
import { Editor } from "./Editor";
import TextUpload from "./TextUpload";
export default function NavBar() {
  const { load } = Simulator(); // Assuming you have a hook to load the simulator
  const [isOpen, setIsOpen] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [downloadMode, setDownloadMode] = useState(false);
  const handleAssemble = async () => {
    if (!editorInstance) return;
    const code = editorInstance.getValue() + "\n"; // Get the code from the editor

    const res = await fetch("/api/assemble", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: code,
    });

    if (!res.ok) {
      // try to parse JSON error
      let errMsg = "Unknown error";
      try {
        const err = await res.json();
        errMsg = err.error || JSON.stringify(err);
      } catch {}
      toast.error(`Error assembling code: ${errMsg}`);
    }

    if (downloadMode) {
      // DOWNLOAD path
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.bin";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started!");
      setIsOpen(false);
    } else {
      // LOAD path
      const arrayBuffer = await res.arrayBuffer();
      load(arrayBuffer);
      toast.success("Assembled and loaded into memory!");
      setIsOpen(false);
    }
    return;
  };
  return (
    <nav className="bg-[var(--nav)] border-b-2 border-neutral-800 p-2">
      <div className=" w-full flex justify-between items-center  px-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-sans  text-[var(--color-accent)]  tracking-widest ">
            {" "}
            Z16 SIMULATOR
          </h1>
          <CustomDialog>
            <CustomDialogTrigger onClick={() => setIsOpen(true)}>
              <button
                className="
          text-green-400 border border-green-400
          px-3 py-2 rounded-2xl text-xs
          hover:bg-green-400 hover:text-black
          transition-colors duration-200
          hover:cursor-pointer
          hover:shadow-lg hover:shadow-green-500/30
        "
              >
                Try our Assembler
              </button>
            </CustomDialogTrigger>

            <CustomDialogContent
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="
          bg-[#1e1e1e] rounded-3xl p-6
          w-[95vw] h-[90vh]
          flex flex-col
          shadow-2xl shadow-green-400/20
        "
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-green-400 font-bold">
                  Assembly Code Editor
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Editor Section */}
              <section
                className="
          flex-1 border rounded-3xl p-4 
           backdrop-blur-sm
          flex flex-col
          overflow-hidden
        "
              >
                <div className="flex-1 overflow-auto">
                  <Editor
                    onEditorMount={(editor) => setEditorInstance(editor)}
                  />
                </div>

                <div className="flex justify-end p-4 gap-2 border-t border-gray-700 mt-4">
                  <button
                    onClick={() => setDownloadMode((d) => !d)}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-lg text-sm
                      transition
                      ${
                        downloadMode
                          ? "bg-green-500 text-black"
                          : "border border-gray-600 text-gray-300 hover:text-white"
                      }
                    `}
                    disabled={!editorInstance}
                  >
                    <Download size={16} />
                  </button>

                  {/* Assemble/Go */}
                  <button
                    onClick={handleAssemble}
                    className="
                      bg-green-500 hover:bg-green-600 text-black font-semibold
                      px-6 py-2 rounded-lg
                      transition-all duration-200
                      hover:shadow-lg hover:shadow-green-500/30
                    "
                    disabled={!editorInstance}
                  >
                    {downloadMode ? "Assemble & Download" : "Assemble & Load"}
                  </button>
                </div>
              </section>
            </CustomDialogContent>
          </CustomDialog>
        </div>
        <div className="flex items-center gap-4 justify-center">
          <TextUpload />
          <NumberConverter />
        </div>
      </div>
    </nav>
  );
}

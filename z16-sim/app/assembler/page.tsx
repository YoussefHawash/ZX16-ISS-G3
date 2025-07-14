"use client";
import { Button } from "@/components/ui/button";
import Simulator from "@/hooks/use-cpu";
import { ArrowLeft, Download } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Editor } from "../_components/Editor";

export default function Page() {
  const { load } = Simulator(); // Assuming you have a hook to load the simulator
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const handleAssemble = async () => {
    if (!editorInstance) return;
    const code = editorInstance.getValue();

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
      alert("Assemble failed: " + errMsg);
      return;
    }

    // THIS is the important bit:
    const arrayBuffer = await res.arrayBuffer();
    load(arrayBuffer);

    alert("Assembled and loaded into memory!");
  };
  return (
    <main className="flex flex-col h-screen w-screen justify-center">
      <section className="border w-4/5 mx-auto rounded-3xl h-2/3  p-4 bg-[#1e1e1e]">
        <Button
          variant={"outline"}
          className="mb-4 flex items-center hover:cursor-pointer"
          onClick={() => {
            redirect("/");
          }}
        >
          <ArrowLeft size={20} className="" />
          Back
        </Button>
        <Editor onEditorMount={(editor) => setEditorInstance(editor)} />
        <div className="flex justify-end p-4 gap-2">
          <Button
            className=" bg-green-500 hover:bg-green-600 text-white hover:cursor-pointer"
            onClick={handleAssemble}
          >
            Assemble
          </Button>
          <Button variant={"outline"} className=" hover:cursor-pointer">
            <Download />
          </Button>
        </div>
      </section>
    </main>
  );
}

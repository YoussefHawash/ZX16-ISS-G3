"use client";

import CodeEditor from "./_components/CodeEditor";
import NavBar from "./_components/NavBar";
import Simulator from "./_components/screen";
export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <NavBar />
      <Simulator />
      <CodeEditor />
    </main>
  );
}

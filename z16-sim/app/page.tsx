import { useWorker } from "@/lib/BufferContext";
import Grid from "./_components/Grid";
import NavBar from "./_components/NavBar";

export default function Main() {
  return (
    <>
      <NavBar />

      <main
        className="flex flex-col bg-[var(--bg)] text-[var(--text)]"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Grid />
      </main>
    </>
  );
}

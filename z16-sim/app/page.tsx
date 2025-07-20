import Grid from "./_components/Grid";
import NavBar from "./_components/NavBar";
import Report from "./_components/Report";
import WhatsNew from "./_components/WhatsNew";

export default function Main() {
  return (
    <>
      <NavBar />
      <Report />
      <WhatsNew />
      <main
        className="flex flex-col bg-[var(--bg)] text-[var(--text)]"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Grid />
      </main>
    </>
  );
}

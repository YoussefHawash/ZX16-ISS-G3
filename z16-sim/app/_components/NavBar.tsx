import TextUpload from "./TextUpload";

export default function NavBar() {
  return (
    <nav className="bg-[var(--nav)] border-b-2 border-neutral-800 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-[var(--color-accent)] flex items-center gap-2">
          <h1 className="text-lg font-sans  tracking-widest"> Z16 SIMULATOR</h1>
        </div>
        <div className="flex items-center gap-10">
          <TextUpload />
        </div>
      </div>
    </nav>
  );
}

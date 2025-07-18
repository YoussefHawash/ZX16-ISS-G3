// app/api/assemble/route.ts
import { exec } from "child_process";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const execP = promisify(exec);

export async function POST(req: NextRequest) {
  const code = await req.text();

  // prepare paths
  const tmpDir = path.join(process.cwd(), "tmp");
  const outputDir = path.join(tmpDir, "output");
  const inputPath = path.join(tmpDir, "Input.s");
  const outputPath = path.join(outputDir, "output.bin");
  const scriptPath = path.join(process.cwd(), "scripts", "src","main.py");

  // ensure directories
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(inputPath, code, "utf8");

  try {
    // run assembler
    await execP(`python3 -B "${scriptPath}" "${inputPath}" -o "${outputPath}"`);
    // load the raw file
    const buf = await fs.readFile(outputPath);

    // return it as octet-stream
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": buf.byteLength.toString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    // clean up
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);
  }
}

// app/api/assemble/route.ts
import { exec } from "child_process";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";
import { promisify } from "util";

const execP = promisify(exec);

export async function POST(req: NextRequest) {
  const code = await req.text();

  // use /tmp on Vercel (writable), scoped to a subfolder
  const baseTmp = path.join(os.tmpdir(), "z16-sim");
  const inputDir = baseTmp;
  const outputDir = path.join(baseTmp, "output");
  const inputPath = path.join(inputDir, "Input.s");
  const outputPath = path.join(outputDir, "output.bin");

  const scriptPath = path.join(process.cwd(), "scripts", "main.py");

  // ensure temp dirs exist
  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  // write the incoming assembly
  await fs.writeFile(inputPath, code, "utf8");

  try {
    // run assembler with no bytecode caching (-B)
    await execP(`python3 -B "${scriptPath}" "${inputPath}" -o "${outputPath}"`);

    // read the result
    const buf = await fs.readFile(outputPath);

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
    // clean up temp files (ignore errors)
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);
  }
}

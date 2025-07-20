import { config } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.text();
    console.log("Received body:", config.assemblerUrl);
    // Forward body to your Lambda
    const awsRes = await fetch(config.assemblerUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: body, // raw .s text
    });

    if (!awsRes.ok) {
      console.error(`Lambda responded with status: ${awsRes.status}`);
      return NextResponse.json(
        { error: `External service error: ${awsRes.status}` },
        { status: awsRes.status }
      );
    }

    const data = await awsRes.json(); // { output_bin_b64, stdout, stderr }
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("assemble proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

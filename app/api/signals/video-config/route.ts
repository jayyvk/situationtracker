import { NextResponse } from "next/server";
import { videoSources } from "@/lib/config/video-sources";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ items: videoSources });
}

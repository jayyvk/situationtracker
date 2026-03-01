import { NextResponse } from "next/server";
import { chatSource } from "@/lib/config/chat-config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ item: chatSource });
}

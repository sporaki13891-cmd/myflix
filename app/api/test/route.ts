import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.user.findMany(); // test DB query
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("TEST ERROR:", e);
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

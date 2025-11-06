import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const items = await prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

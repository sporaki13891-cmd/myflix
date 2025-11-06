import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, movieId } = await req.json();

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "Missing userId or movieId" },
        { status: 400 }
      );
    }

    const deleted = await prisma.watchlist.deleteMany({
      where: {
        userId,
        movieId,
      },
    });

    return NextResponse.json({ removed: deleted.count }, { status: 200 });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // ✅ Get all watchlist entries for this user
    const items = await prisma.watchlist.findMany({
      where: { userId },
      select: {
        movie: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            videoUrl: true,
          },
        },
      },
    });

    // ✅ Flatten movie structure
    const movies = items
      .map((x: { movie: any }) => x.movie)
      .filter(Boolean);

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

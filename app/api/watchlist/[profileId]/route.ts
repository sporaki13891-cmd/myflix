import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

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

    const movies = items.map((x) => x.movie).filter(Boolean);

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

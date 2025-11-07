import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await context.params;

    if (!profileId) {
      return NextResponse.json(
        { error: "Missing profileId" },
        { status: 400 }
      );
    }

    const entries = await prisma.watchlist.findMany({
      where: { userId: profileId },
      select: {
        movie: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            videoUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const movies = entries
      .map((x) => x.movie)
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

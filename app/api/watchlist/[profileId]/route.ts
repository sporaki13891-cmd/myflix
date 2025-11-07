import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { profileId: string } }
) {
  try {
    const { profileId } = await context.params;

    if (!profileId) {
      return NextResponse.json(
        { error: "Missing profileId" },
        { status: 400 }
      );
    }

    const userWatchlist = await prisma.watchlist.findMany({
      where: { userId: profileId },
      include: { movie: true },
    });

    const formatted = userWatchlist.map((entry) => entry.movie);

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

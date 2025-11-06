import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, movieId, title, description, image, videoUrl } = body;

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "Missing userId or movieId" },
        { status: 400 }
      );
    }

    // ✅ Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // ✅ Ensure movie exists (create if not)
    let movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      if (!title) {
        return NextResponse.json(
          { error: "Movie does not exist and no data provided to create it" },
          { status: 400 }
        );
      }

      movie = await prisma.movie.create({
        data: {
          id: movieId,
          title,
          description: description ?? "",
          image: image ?? "",
          videoUrl: videoUrl ?? "",
        },
      });

      if (!movie) {
        return NextResponse.json(
          { error: "Failed to create movie entry" },
          { status: 500 }
        );
      }
    }

    // ✅ Check if already in watchlist
    const existing = await prisma.watchlist.findFirst({
      where: { userId, movieId },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already in watchlist", entry: existing },
        { status: 200 }
      );
    }

    // ✅ Create watchlist entry
    const newEntry = await prisma.watchlist.create({
      data: {
        userId,
        movieId,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const movie = await req.json();

    if (!movie?.title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    // try find by unique title
    let dbMovie = await prisma.movie.findFirst({
      where: { title: movie.title },
    });

    // if not found → create
    if (!dbMovie) {
      dbMovie = await prisma.movie.create({
        data: {
          title: movie.title,
          description: movie.description ?? "",
          image: movie.image ?? "",
          videoUrl: movie.videoUrl ?? "",
        },
      });
    }

    return NextResponse.json({ movieId: dbMovie.id }, { status: 200 });
  } catch (err) {
    console.error("create-or-find error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

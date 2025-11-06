// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMyList } from "@/hooks/useMyList";

export default function MoviePage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);

  const { toggleMyList, isInList } = useMyList("guest"); // προσωρινά guest

  /** ✅ Load movie: DB → LocalStorage → dummy */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        // ✅ Try DB
        const res = await fetch(`/api/movie/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMovie(data);
          return;
        }
      } catch (err) {
        console.warn("⚠️ DB fetch failed:", err);
      }

      // ✅ LocalStorage fallback
      const stored = localStorage.getItem("allMovies");
      if (stored) {
        const all = JSON.parse(stored);
        const found = all.find((m: any) => m.id === id);
        setMovie(found || null);
        return;
      }

      // ✅ Final fallback
      setMovie({
        id,
        title: "Example Movie",
        description:
          "This is an example movie detail page with cinematic background.",
        videoUrl: "/videos/trailer.mp4",
        image: "/images/hero1.jpg",
      });
    };

    load();
  }, [id]);


  /** ✅ Normalize ID */
  const normalized =
    movie && {
      ...movie,
      id: movie.id || movie.title?.toLowerCase().replace(/\s+/g, "-"),
    };

  const inList = normalized && isInList(normalized);

  if (!movie) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Loading movie...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 🎥 Background video */}
      <video
        src={normalized.videoUrl}
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      {/* Content */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-32 flex flex-col gap-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">
          {normalized.title}
        </h1>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
          {normalized.description}
        </p>

        <div className="flex items-center gap-4 mt-4">
          {/* ▶ Play */}
          <button
            onClick={() => alert("Playing movie...")}
            className="bg-white text-black font-semibold px-6 py-2 rounded-md hover:bg-neutral-200 transition"
          >
            ▶ Play
          </button>

          {/* ❤️ Add / Remove */}
          <button
            onClick={() => toggleMyList(normalized)}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              inList
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-transparent border border-white/60 hover:bg-white hover:text-black"
            }`}
          >
            {inList ? "Remove from My List" : "Add to My List"}
          </button>

          {/* ⏎ Back */}
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm underline underline-offset-4"
          >
            ← Back
          </button>
        </div>
      </section>
    </main>
  );
}

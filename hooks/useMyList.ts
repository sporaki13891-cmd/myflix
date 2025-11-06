"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface MovieItem {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  videoUrl?: string;
}

export const useMyList = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [myList, setMyList] = useState<MovieItem[]>([]);
  const [ready, setReady] = useState(false);

  const storageKey = userId ? `myflix_list_${userId}` : "myflix_list_guest";

  /** ✅ Load from DB first → fallback localStorage */
  useEffect(() => {
    const loadFromDB = async () => {
      if (!userId) {
        console.warn("⚠ No user → fallback to localStorage");
        loadFromLocal();
        return;
      }

      try {
        const res = await fetch(`/api/watchlist/get?userId=${userId}`);
        if (!res.ok) throw new Error("DB load failed");

        const data = await res.json();
        setMyList(data);
        console.log("✅ Loaded MyList from DB:", data);
      } catch (err) {
        console.warn("⚠ DB load failed, fallback to localStorage");
        loadFromLocal();
      }
      setReady(true);
    };

    const loadFromLocal = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        setMyList(Array.isArray(parsed) ? parsed : []);
      } catch {
        setMyList([]);
      }
    };

    loadFromDB();
  }, [userId, storageKey]);

  /** ✅ Save to localStorage when list changes */
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(myList));
    } catch {}
  }, [myList, storageKey, ready]);

  /** ✅ Utility */
  const getMovieId = (movie: MovieItem) =>
    movie.id ?? movie.title.toLowerCase().replace(/\s+/g, "-");

  /** ✅ Check */
  const isInList = (movie: MovieItem) =>
    myList.some((m) => getMovieId(m) === getMovieId(movie));

  /** ✅ Toggle */
  const toggleMyList = async (movie: MovieItem) => {
    if (!userId) {
      console.warn("⚠ No user → local only");
      toggleLocal(movie);
      return;
    }

    const movieId = getMovieId(movie);
    const exists = isInList(movie);

    const endpoint = exists
      ? "/api/watchlist/remove"
      : "/api/watchlist/add";

    const payload = {
      userId,
      movieId,
      title: movie.title,
      description: movie.description ?? "",
      image: movie.image ?? "",
      videoUrl: movie.videoUrl ?? "",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("❌ API error");
        toggleLocal(movie);
        return;
      }

      updateLocal(movie, exists);
    } catch {
      console.error("❌ toggleMyList error → fallback localStorage");
      toggleLocal(movie);
    }
  };

  /** ✅ Update local list state */
  const updateLocal = (movie: MovieItem, remove: boolean) => {
    const id = getMovieId(movie);

    setMyList((prev) =>
      remove
        ? prev.filter((m) => getMovieId(m) !== id)
        : [...prev, { ...movie, id }]
    );
  };

  /** ✅ Local only */
  const toggleLocal = (movie: MovieItem) => {
    const exists = isInList(movie);
    updateLocal(movie, exists);
  };

  const clearMyList = () => {
    localStorage.removeItem(storageKey);
    setMyList([]);
  };

  return { myList, toggleMyList, isInList, clearMyList };
};

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useSession } from "next-auth/react";

export interface MovieItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  videoUrl?: string;
}

interface MyListContextValue {
  myList: MovieItem[];
  isInList(movie: MovieItem): boolean;
  toggleMyList(movie: MovieItem): Promise<void>;
  clearMyList(): void;
  loading: boolean;
}

const MyListContext = createContext<MyListContextValue | null>(null);
export const useMyListContext = () => useContext(MyListContext)!;

// ----------------------------
// Helpers
// ----------------------------

const getFallbackId = (movie: MovieItem) =>
  movie.id || movie.title.toLowerCase().replace(/\s+/g, "-");

// KEY for localStorage
const getLocalKey = (profileId: string | null) =>
  profileId ? `myflix_list_${profileId}` : "myflix_list_guest";

// ----------------------------
// Provider
// ----------------------------

export const MyListProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [profileId, setProfileId] = useState<string | null>(null);
  const [myList, setMyList] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Load activeProfile from localStorage
  // ----------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem("activeProfile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.name) setProfileId(p.name);
      }
    } catch {
      setProfileId(null);
    }
  }, []);

  // ----------------------------
  // Load from DB (if user & profile) else from localStorage
  // ----------------------------
  useEffect(() => {
    const load = async () => {
      if (!profileId) {
        setMyList([]);
        setLoading(false);
        return;
      }

      // ✅ Try DB
      if (userId) {
        try {
          const res = await fetch(`/api/watchlist/${profileId}`);
          if (res.ok) {
            const data = await res.json();
            setMyList(data);
            setLoading(false);
            return;
          }
        } catch {
          console.error("⚠️ DB load failed, fallback to localStorage");
        }
      }

      // ⬇ fallback localStorage
      try {
        const raw = localStorage.getItem(getLocalKey(profileId));
        setMyList(raw ? JSON.parse(raw) : []);
      } catch {
        setMyList([]);
      }

      setLoading(false);
    };

    load();
  }, [profileId, userId]);

  // ----------------------------
  // LocalStorage sync
  // ----------------------------
  useEffect(() => {
    if (!profileId) return;
    localStorage.setItem(getLocalKey(profileId), JSON.stringify(myList));
  }, [myList, profileId]);

  // ----------------------------
  // isInList
  // ----------------------------
  const isInList = (movie: MovieItem) => {
    const id = getFallbackId(movie);
    return myList.some((m) => m.id === id);
  };

  // ----------------------------
  // toggleMyList
  // ----------------------------
  const toggleMyList = async (movie: MovieItem) => {
    if (!movie || !profileId) return;

    const id = getFallbackId(movie);
    const exists = isInList(movie);

    // ✅ Always update UI immediately
    setMyList((prev) =>
      exists ? prev.filter((m) => m.id !== id) : [...prev, { ...movie, id }]
    );

    // ✅ If logged → sync with DB
    if (userId) {
      try {
        const endpoint = exists
          ? "/api/watchlist/remove"
          : "/api/watchlist/add";

        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ userId, movieId: id }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("❌ API error");
        }
      } catch (err) {
        console.error("❌ toggleMyList error:", err);
      }
    }
  };

  // ----------------------------
  // clear list
  // ----------------------------
  const clearMyList = () => {
    setMyList([]);
    if (profileId) localStorage.removeItem(getLocalKey(profileId));
  };

  return (
    <MyListContext.Provider
      value={{
        myList,
        isInList,
        toggleMyList,
        clearMyList,
        loading,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
};

// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyListContext } from "@/context/MyListContext";
import { useRouter } from "next/navigation";

export default function MyListPage(): JSX.Element {
  const router = useRouter();
  const [activeProfile, setActiveProfile] = useState<{ name: string; avatar?: string } | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Παίρνουμε από context
  const { myList, toggleMyList, loading } = useMyListContext();

  // 📦 Φόρτωση προφίλ
  useEffect(() => {
    const stored = localStorage.getItem("activeProfile");
    if (stored) {
      try {
        setActiveProfile(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing profile:", err);
      }
    }
    setProfileReady(true);
  }, []);

  // ✅ smooth mount animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  // 🕓 Still loading DB
  if (!profileReady || loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Loading your list...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white px-6 sm:px-10 py-12 transition-colors duration-500">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">
          My List
        </h1>

        {activeProfile && (
          <p className="text-gray-400 text-sm mt-1">
            Profile:{" "}
            <span className="text-white font-medium">{activeProfile.name}</span>
          </p>
        )}
      </div>

      {/* === Empty List === */}
      {!myList || myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
          <img
            src="/images/empty_list.svg"
            alt="Empty list"
            className="w-40 opacity-60 mb-6"
            draggable={false}
          />
          <p className="text-lg text-center">
            Your list is empty. Start adding movies with the{" "}
            <span className="text-red-500">♥</span> icon!
          </p>
        </div>
      ) : (
        <div
          className="grid gap-6 sm:gap-8 
                      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                      transition-all duration-500"
        >
          <AnimatePresence>
            {isMounted &&
              myList.map((movie, idx) => (
                <motion.div
                  key={movie.id || movie.title}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative group rounded-2xl overflow-hidden shadow-lg shadow-black/50 hover:shadow-red-500/30 transform hover:scale-[1.04] transition-all duration-300"
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-44 object-cover select-none"
                    draggable={false}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4">
                    <p className="text-lg font-semibold mb-3">{movie.title}</p>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      onClick={() =>
                        router.push(
                          `/movie/${movie.id || movie.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      ▶ Play
                    </button>
                  </div>

                  {/* ❌ Remove */}
                  <button
                    onClick={() => toggleMyList(movie)}
                    aria-label="Remove from My List"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-zinc-800/80 to-black/70 hover:from-red-700 hover:to-red-800 text-gray-300 hover:text-white shadow-md shadow-black/40 backdrop-blur-sm transition-all duration-200"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";   // ✅ ΝΕΟ
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FinalHeroFade from "../components/Hero";
import HorizontalMovieRow from "../components/HorizontalMovieRow";
import MovieModal from "../components/MovieModal";

// 🎬 Placeholder video URL
const placeholderVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

// 📚 Movie lists
const recommendedMovies = [
  { title: "Movie 1", image: "/images/movie1.jpg", videoUrl: placeholderVideo, description: "Movie 1 description" },
  { title: "Movie 2", image: "/images/movie2.jpg", videoUrl: placeholderVideo, description: "Movie 2 description" },
  { title: "Movie 3", image: "/images/movie3.jpg", videoUrl: placeholderVideo, description: "Movie 3 description" },
  { title: "Movie 4", image: "/images/movie4.jpg", videoUrl: placeholderVideo, description: "Movie 4 description" },
  { title: "Movie 5", image: "/images/movie5.jpg", videoUrl: placeholderVideo, description: "Movie 5 description" },
  { title: "Movie 6", image: "/images/movie6.jpg", videoUrl: placeholderVideo, description: "Movie 6 description" },
];

const trendingMovies = [
  { title: "Movie 7", image: "/images/movie7.jpg", videoUrl: placeholderVideo, description: "Movie 7 description" },
  { title: "Movie 8", image: "/images/movie8.jpg", videoUrl: placeholderVideo, description: "Movie 8 description" },
  { title: "Movie 9", image: "/images/movie9.jpg", videoUrl: placeholderVideo, description: "Movie 9 description" },
  { title: "Movie 10", image: "/images/movie10.jpg", videoUrl: placeholderVideo, description: "Movie 10 description" },
  { title: "Movie 11", image: "/images/movie11.jpg", videoUrl: placeholderVideo, description: "Movie 11 description" },
  { title: "Movie 12", image: "/images/movie12.jpg", videoUrl: placeholderVideo, description: "Movie 12 description" },
];

const newReleases = [
  { title: "Movie 13", image: "/images/movie13.jpg", videoUrl: placeholderVideo, description: "Movie 13 description" },
  { title: "Movie 14", image: "/images/movie14.jpg", videoUrl: placeholderVideo, description: "Movie 14 description" },
  { title: "Movie 15", image: "/images/movie15.jpg", videoUrl: placeholderVideo, description: "Movie 15 description" },
  { title: "Movie 16", image: "/images/movie16.jpg", videoUrl: placeholderVideo, description: "Movie 16 description" },
  { title: "Movie 17", image: "/images/movie17.jpg", videoUrl: placeholderVideo, description: "Movie 17 description" },
  { title: "Movie 18", image: "/images/movie18.jpg", videoUrl: placeholderVideo, description: "Movie 18 description" },
];

export default function Home() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  // ✅ NEW — Protect home: redirect if no active profile
  useEffect(() => {
    const profile = localStorage.getItem("activeProfile");
    if (!profile) {
      router.push("/profiles");   // redirect to select profile
      return;
    }
  }, []);

  // 🌅 Fade-in effect when the page loads (after intro)
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 200); // ✅ 0.2s delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.main
      className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden"
      role="main"
      aria-label="Main content"
      initial={{ opacity: 0, filter: "brightness(0.4) blur(8px)" }}
      animate={
        fadeIn
          ? { opacity: 1, filter: "brightness(1) blur(0px)" }
          : { opacity: 0 }
      }
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* === 🔥 Ambient Red Glow === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.6, 0.3, 0.7, 0.4, 0],
          scale: [0.8, 1.05, 1, 1.1, 1, 1],
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 z-0 bg-red-600/20 blur-[120px]"
      />

      <Navbar />
      <FinalHeroFade />

      {/* === Rows === */}
      <div className="flex-1 z-10">
        <HorizontalMovieRow title="Trending Now" movies={trendingMovies} />
        <HorizontalMovieRow title="New Releases" movies={newReleases} />
        <HorizontalMovieRow title="Recommended" movies={recommendedMovies} />
      </div>

      {/* === FOOTER === */}
      <footer
        className="z-10 bg-gradient-to-t from-black via-neutral-900 to-black text-neutral-400 py-10 mt-20 text-center text-sm"
        aria-label="Footer"
      >
        <p className="mb-6">Questions? Contact us.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {[
            "FAQ",
            "Help Center",
            "Account",
            "Media Center",
            "Investor Relations",
            "Jobs",
            "Ways to Watch",
            "Terms of Use",
            "Privacy",
            "Cookie Preferences",
            "Corporate Information",
            "Contact Us",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:underline hover:text-gray-300 transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} MyFlix — Built for learning and fun.
        </p>
      </footer>
    </motion.main>
  );
}

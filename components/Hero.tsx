"use client";
import React, { useState, useEffect } from "react";
import MovieModal from "./MovieModal";

// 🎬 Featured slides
const featuredMovies = [
  {
    title: "Featured 1",
    description: "A thrilling journey through a world of mystery and wonder.",
    image: "/images/hero1.jpg",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Featured 2",
    description: "An epic tale of courage, power, and destiny.",
    image: "/images/hero2.jpg",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Featured 3",
    description: "Dive deep into a world beyond imagination.",
    image: "/images/hero3.jpg",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export default function FinalHeroFade() {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 🌀 Automatic fade rotation
  useEffect(() => {
    if (showModal) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setFade(true);
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, [showModal]);

  const featuredMovie = featuredMovies[currentIndex];

  const handleIndicatorClick = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 500);
  };

  return (
    <section
      className="relative w-full h-[90vh] sm:h-[75vh] md:h-[80vh] lg:h-[90vh] flex flex-col justify-end md:justify-center px-6 md:px-12 overflow-hidden"
      aria-label="Featured movies carousel"
    >
      {/* === Background Image with cinematic zoom === */}
      <img
        key={featuredMovie.image}
        src={featuredMovie.image}
        alt={featuredMovie.title}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[2500ms] ease-in-out
          ${fade ? "opacity-100 scale-105" : "opacity-0 scale-110"}
        `}
      />

      {/* === Cinematic Overlay === */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-1000 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* === Content === */}
      <div
        className={`relative z-10 max-w-2xl mb-8 md:mb-14 text-white transition-all duration-1000 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {featuredMovie.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {featuredMovie.description}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2 rounded-md 
              hover:bg-gray-200 hover:scale-105 active:scale-95 
              shadow-[0_4px_14px_rgba(255,255,255,0.25)] 
              transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
          >
            ▶ <span>Play</span>
          </button>

          <button
            className="flex items-center gap-2 bg-gray-700/80 text-white font-semibold px-6 py-2 rounded-md 
              hover:bg-gray-600 hover:scale-105 active:scale-95 
              shadow-[0_4px_10px_rgba(0,0,0,0.4)] 
              transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            ℹ <span>More Info</span>
          </button>
        </div>
      </div>

      {/* === Indicators (manual + auto sync) === */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
              index === currentIndex
                ? "bg-red-600 scale-125 shadow-[0_0_8px_rgba(255,0,0,0.6)]"
                : "bg-gray-500/60 hover:bg-gray-400/80 scale-100"
            }`}
          />
        ))}
      </div>

      {/* === Modal === */}
      {showModal && (
        <MovieModal
          title={featuredMovie.title}
          videoUrl={featuredMovie.videoUrl}
          description={featuredMovie.description}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

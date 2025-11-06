"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import { useMyList } from "@/hooks/useMyList";

const HorizontalMovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [moved, setMoved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false); // ✅ ΝΕΟ
  const animationFrame = useRef(null);

  // ✅ MyList integration
  const activeProfile =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("activeProfile") || "null")
      : null;
  const profileId = activeProfile?.id || "guest";
  const { toggleMovie, isInList } = useMyList(profileId);

  // ✅ Infinite scroll illusion
  const extendedMovies = useMemo(() => [...movies, ...movies, ...movies], [movies]);

  // ✅ Auto scroll (με pause όταν έχει modal)
  useEffect(() => {
    const scrollSpeed = 0.6;
    const smoothScroll = () => {
      if (
        rowRef.current &&
        !isDragging &&
        !hovered &&
        !paused // ⛔ σταματά όταν υπάρχει modal
      ) {
        rowRef.current.scrollLeft += scrollSpeed;
        const scrollWidth = rowRef.current.scrollWidth / 3;
        if (rowRef.current.scrollLeft >= scrollWidth * 2) {
          rowRef.current.scrollLeft = scrollWidth;
        }
      }
      animationFrame.current = requestAnimationFrame(smoothScroll);
    };
    animationFrame.current = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isDragging, hovered, paused]);

  // ✅ Drag scroll
  const handleMouseDown = (e) => {
    if (selectedMovie || e.button !== 0 || !rowRef.current) return;
    setIsDragging(true);
    setMoved(false);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    rowRef.current.scrollLeft = scrollLeft - (x - startX) * 0.8;
    setMoved(true);
  };
  const handleMouseUp = () => setIsDragging(false);
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // ✅ Touch scroll
  const handleTouchStart = (e) => {
    if (selectedMovie || !rowRef.current) return;
    setIsDragging(true);
    setMoved(false);
    setStartX(e.touches[0].pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };
  const handleTouchMove = (e) => {
    if (!isDragging || !rowRef.current) return;
    const x = e.touches[0].pageX - rowRef.current.offsetLeft;
    rowRef.current.scrollLeft = scrollLeft - (x - startX) * 1.2;
    setMoved(true);
  };
  const handleTouchEnd = () => setIsDragging(false);

  // ✅ Arrows manual scroll
  const scrollByCard = (direction = "right") => {
    if (!rowRef.current) return;
    const container = rowRef.current;
    const card = container.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth + 16;
    const cardsPerScroll =
      window.innerWidth >= 1280 ? 5 : window.innerWidth >= 768 ? 3 : 2;

    let target =
      container.scrollLeft +
      (direction === "right"
        ? cardWidth * cardsPerScroll
        : -cardWidth * cardsPerScroll);

    const scrollWidth = container.scrollWidth / 3;
    if (target >= scrollWidth * 2) target = scrollWidth;
    if (target <= 0) target = scrollWidth;

    container.scrollTo({ left: target, behavior: "smooth" });
  };

  // ✅ Center on mount
  useEffect(() => {
    if (rowRef.current) {
      rowRef.current.scrollLeft = rowRef.current.scrollWidth / 3;
    }
  }, []);

  // ✅ Modal open/close pause control
  useEffect(() => {
    if (selectedMovie) setPaused(true);
    else setPaused(false);
  }, [selectedMovie]);

  const handleClick = (e) => {
    if (moved) e.preventDefault();
  };

  return (
    <section className="relative py-6 select-none" aria-label={`${title} movie row`}>
      <h2 className="text-2xl font-bold text-white mb-4 px-8 tracking-tight">{title}</h2>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative"
      >
        {/* === Scrollable container === */}
        <div
          ref={rowRef}
          className={`flex space-x-4 overflow-x-auto px-8 scrollbar-hide transition-all duration-300 will-change-transform ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          role="list"
          aria-label={`${title} movies list`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {extendedMovies.map((movie, idx) => (
            <div key={`${movie.title}-${idx}`} className="flex-shrink-0" role="listitem">
              <MovieCard
                title={movie.title}
                image={movie.image}
                videoUrl={movie.videoUrl}
                description={movie.description}
                square={false}
                onClick={() => !moved && setSelectedMovie(movie)}
                // MyList integration
                isInListExternal={isInList}
                toggleExternal={toggleMovie}
              />
            </div>
          ))}
        </div>

        {/* ✅ Netflix-style Scroll Arrows */}
        <button
          type="button"
          aria-label="Scroll left"
          className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white z-20
            transition-all duration-500 ease-out scale-90 opacity-0
            group-hover:scale-100 group-hover:opacity-100
            hover:bg-black/70 hover:scale-110
            hover:shadow-[0_0_25px_rgba(255,0,0,0.9)]
            shadow-lg shadow-black/60 animate-redPulse`}
          onClick={() => scrollByCard("left")}
        >
          ◀
        </button>

        <button
          type="button"
          aria-label="Scroll right"
          className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white z-20
            transition-all duration-500 ease-out scale-90 opacity-0
            group-hover:scale-100 group-hover:opacity-100
            hover:bg-black/70 hover:scale-110
            hover:shadow-[0_0_25px_rgba(255,0,0,0.9)]
            shadow-lg shadow-black/60 animate-redPulse`}
          onClick={() => scrollByCard("right")}
        >
          ▶
        </button>

        {/* ✨ Pulse animation keyframes */}
        <style jsx>{`
          @keyframes redPulse {
            0%, 100% {
              box-shadow: 0 0 18px rgba(255, 0, 0, 0.6);
            }
            50% {
              box-shadow: 0 0 30px rgba(255, 0, 0, 0.9);
            }
          }
          .animate-redPulse {
            animation: redPulse 2.2s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* === Movie Modal === */}
      {selectedMovie && (
        <MovieModal
          title={selectedMovie.title}
          videoUrl={selectedMovie.videoUrl}
          description={selectedMovie.description}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </section>
  );
};

export default HorizontalMovieRow;

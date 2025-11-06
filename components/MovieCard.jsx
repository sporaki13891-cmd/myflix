"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMyListContext } from "@/context/MyListContext";

const MovieCard = ({
  id,
  title,
  image,
  videoUrl,
  description,
  square,
  onClick,
  externalToggle,
  externalIsInList,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // ✅ My List context
  const { toggleMyList, isInList } = useMyListContext();
  const toggle = externalToggle || toggleMyList;
  const inList = externalIsInList || isInList;

  // ✅ Standardize ID
  const movieId =
    typeof id === "string"
      ? id
      : title.toLowerCase().replace(/\s+/g, "-");

  // ✅ Object used everywhere
  const movieData = {
    id: movieId,
    title,
    image,
    videoUrl,
    description,
  };

  const liked = inList(movieData);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggle(movieData);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className={`relative cursor-pointer overflow-hidden movie-card ${className} ${
        square ? "w-full aspect-[16/9]" : "w-[400px] aspect-[16/9] flex-shrink-0"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* === Media Wrapper === */}
      <div
        className={`relative w-full h-full overflow-hidden rounded-md transition-transform duration-300 ease-out ${
          isHovered ? "scale-[1.04]" : "scale-100"
        }`}
      >
        {isHovered ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            preload="metadata"
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            draggable={false}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* ❤️ Heart Button */}
        <motion.button
          onClick={handleHeartClick}
          aria-label={liked ? "Remove from My List" : "Add to My List"}
          initial={false}
          animate={{
            scale: liked ? [1, 1.25, 1] : [1, 0.95, 1],
            rotate: liked ? [0, -8, 8, 0] : 0,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-md
            ${
              liked
                ? "bg-gradient-to-b from-red-600/90 to-red-800/90 text-white"
                : "bg-black/40 hover:bg-black/70 text-gray-300"
            }`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            animate={{
              scale: liked ? [1, 1.15, 1] : 1,
              filter: liked
                ? [
                    "drop-shadow(0 0 4px rgba(255,0,0,0.6))",
                    "drop-shadow(0 0 10px rgba(255,0,0,0.8))",
                    "drop-shadow(0 0 4px rgba(255,0,0,0.6))",
                  ]
                : "drop-shadow(0 0 0 rgba(0,0,0,0))",
            }}
            transition={{
              duration: 1.5,
              repeat: liked ? Infinity : 0,
              ease: "easeInOut",
            }}
            className={`w-5 h-5 ${
              liked ? "text-white" : "text-gray-300"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.22 1.002-4 2.475C11.72 4.752 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z"
            />
          </motion.svg>
        </motion.button>

        {/* ▶ Play Overlay */}
        {isHovered && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition-opacity duration-300">
            <button
              onClick={handlePlayClick}
              className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-md shadow-black/40"
              aria-label={`Play ${title}`}
            >
              <span className="text-white text-xl">▶</span>
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-sm mt-2 text-white truncate text-center transition-opacity duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        title={title}
      >
        {title}
      </h3>
    </div>
  );
};

export default MovieCard;

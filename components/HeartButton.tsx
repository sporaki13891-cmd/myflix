"use client";
import { motion } from "framer-motion";
import { MovieItem, useMyList } from "@/hooks/useMyList";
import { useEffect, useState } from "react";

interface HeartButtonProps {
  movie: MovieItem;
  profileId?: string;
  size?: number;
}

export default function HeartButton({ movie, profileId, size = 22 }: HeartButtonProps) {
  const { isInList, toggleMyList } = useMyList();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isInList(movie));
  }, [movie, isInList]);

  const handleClick = () => {
    toggleMyList(movie);
    setLiked(!liked);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      className="flex items-center justify-center rounded-full transition-all duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      aria-label={liked ? "Remove from My List" : "Add to My List"}
    >
      <motion.i
        className={`fa-solid fa-heart ${liked ? "text-red-500" : "text-zinc-400 hover:text-red-500"}`}
        animate={{ scale: liked ? 1.15 : 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ fontSize: size }}
      />
    </motion.button>
  );
}

"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function NetflixIntro() {
  useEffect(() => {
    // Παίζει το Netflix intro sound
    const sound = new Audio("/sounds/netflix_intro.mp3");
    sound.volume = 0.8;
    sound.play().catch(() => console.warn("Autoplay blocked by browser"));
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] overflow-hidden">
      {/* === Main N === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-red-600 font-extrabold text-[7rem] sm:text-[10rem] tracking-widest drop-shadow-[0_0_25px_rgba(255,0,0,0.8)]"
      >
        N
      </motion.div>

      {/* === Light streak (κινούμενη γραμμή) === */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
        className="absolute bottom-1/2 h-[2px] bg-gradient-to-r from-red-700 via-red-500 to-transparent"
      />

      {/* === Subtle red glow === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0] }}
        transition={{ duration: 1.8, delay: 0.4 }}
        className="absolute inset-0 bg-red-800/30 blur-[90px]"
      />

      {/* === Fade overlay (cinematic) === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute inset-0 bg-black/60 pointer-events-none"
      />
    </div>
  );
}

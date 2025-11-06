"use client";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const MovieModal = ({ title, videoUrl, description, onClose }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // mount safety (SSR → client)
  useEffect(() => setMounted(true), []);

  // 🎥 Auto-play & mute sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  // ⌨️ ESC close
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🖱️ Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧼 Clean close + blur
  const handleClose = () => {
    if (isClosing) return;
    document.activeElement?.blur(); // ✅ αφαιρεί focus από την κάρτα που άνοιξε το modal
    setIsClosing(true);
    setTimeout(() => onClose(), 400);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;
    try {
      if (!isFullscreen) {
        await (videoRef.current.requestFullscreen?.() ||
          videoRef.current.webkitRequestFullscreen?.() ||
          videoRef.current.msRequestFullscreen?.());
        setIsFullscreen(true);
      } else {
        await (document.exitFullscreen?.() ||
          document.webkitExitFullscreen?.() ||
          document.msExitFullscreen?.());
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 flex justify-center items-center z-[9999] transition-all duration-500 ${
        isClosing ? "opacity-0" : "opacity-100"
      } bg-black/70 backdrop-blur-md`}
    >
      <div
        ref={modalRef}
        className={`relative bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white rounded-2xl overflow-hidden shadow-2xl w-11/12 max-w-3xl transform transition-all duration-500 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Controls */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button onClick={toggleMute} className="w-9 h-9 bg-black/45 rounded-full flex items-center justify-center hover:scale-105 transition">
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button onClick={toggleFullscreen} className="w-9 h-9 bg-black/45 rounded-full flex items-center justify-center hover:scale-105 transition">
            ⛶
          </button>
          <button onClick={handleClose} className="w-9 h-9 bg-black/55 rounded-full flex items-center justify-center hover:scale-105 transition">
            ✖
          </button>
        </div>

        {/* Video */}
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px]">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            muted={isMuted}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-6 z-10">
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-gray-300">{description}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default MovieModal;

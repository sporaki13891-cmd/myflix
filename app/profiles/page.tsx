"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NetflixIntro from "@/components/NetflixIntro";

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<{ name: string; avatar: string }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("profiles");
    if (stored) {
      try {
        setProfiles(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading profiles", e);
      }
    }
    setTimeout(() => setIsLoaded(true), 150);
  }, []);

  const handleSelectProfile = async (profile: { name: string; avatar: string }) => {
    try {
      localStorage.setItem("activeProfile", JSON.stringify(profile));
      setShowIntro(true);

      // 🎵 Netflix intro sound
      const audio = new Audio("/sounds/netflix_intro.mp3");
      await audio.play().catch(() => {});

      // 🕓 Trigger fade-out before redirect
      setTimeout(() => setFadeOut(true), 2700);

      // ⏩ Redirect after fade
      setTimeout(() => {
        router.push("/");
      }, 3500);
    } catch (error) {
      console.error("Error selecting profile:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-lg animate-pulse">
        Φόρτωση προφίλ...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!showIntro ? (
          <motion.div
            key="profiles-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-10">
              Ποιος βλέπει <span className="text-red-600">τώρα;</span>
            </h1>

            {/* === Avatars === */}
            <div className="flex flex-wrap justify-center gap-10 mb-10">
              {profiles.map((profile, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectProfile(profile)}
                  className="flex flex-col items-center group transition-transform"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-transparent group-hover:border-red-600 transition-all">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <p className="mt-3 text-sm sm:text-base font-medium text-gray-300 group-hover:text-white">
                    {profile.name}
                  </p>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/manage-profiles")}
              className="px-5 py-2 border border-gray-400 text-gray-300 hover:text-white hover:border-white transition-colors rounded"
            >
              Διαχείριση Προφίλ
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999]"
          >
            <NetflixIntro />

            {/* ✨ Fade-out overlay */}
            {fadeOut && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-black"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

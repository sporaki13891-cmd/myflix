"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar1.png");
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Editing modal state
  const [editProfile, setEditProfile] = useState<null | any>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const avatars = [
    "/images/avatar1.png",
    "/images/avatar2.png",
    "/images/avatar3.png",
    "/images/avatar4.png",
    "/images/avatar5.png",
    "/images/avatar6.png",
  ];

  // 📂 Load profiles
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles") || "[]");
    setProfiles(stored);

    // ✨ Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  // ✅ Persist
  const saveProfiles = (updated: any[]) => {
    setProfiles(updated);
    localStorage.setItem("profiles", JSON.stringify(updated));

    // Αν επεξεργαστούμε το active profile, ενημερώνεται
    const active = JSON.parse(localStorage.getItem("activeProfile") || "null");
    if (active) {
      const found = updated.find((p) => p.name === active.name);
      if (found) {
        localStorage.setItem("activeProfile", JSON.stringify(found));
      }
    }
  };

  // 💾 Add new profile
  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile = { name: newProfileName.trim(), avatar: selectedAvatar };
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setNewProfileName("");
  };

  // ❌ Delete profile
  const handleDeleteProfile = (name: string) => {
    const updated = profiles.filter((p) => p.name !== name);
    saveProfiles(updated);
  };

  // ✏️ Open edit modal
  const handleOpenEdit = (profile: any, index: number) => {
    setEditProfile(profile);
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setEditIndex(index);
  };

  // ✅ Save edited profile
  const handleSaveEdit = () => {
    if (editIndex === null) return;

    const updated = [...profiles];
    updated[editIndex] = { name: editName.trim(), avatar: editAvatar };

    saveProfiles(updated);
    setEditProfile(null);
    setEditIndex(null);
  };

  // 🧭 Back button
  const handleBack = () => router.push("/profiles");

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 transition-opacity duration-700 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-10">
        Διαχείριση <span className="text-red-600">Προφίλ</span>
      </h1>

      {/* === Create New Profile === */}
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md text-center border border-neutral-800 transform transition-all duration-700 hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-6">Δημιούργησε Νέο Προφίλ</h2>

        <div className="flex gap-3 justify-center mb-4">
          <input
            type="text"
            placeholder="Όνομα προφίλ..."
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            className="px-4 py-2 rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600 w-2/3"
          />
          <button
            onClick={handleAddProfile}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
          >
            ➕ Προσθήκη
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-3">Επίλεξε Avatar</p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {avatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              onClick={() => setSelectedAvatar(avatar)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover cursor-pointer 
                transition-all duration-300 ease-out shadow-md
                ${
                  selectedAvatar === avatar
                    ? "ring-4 ring-red-600 scale-105 shadow-red-500/30"
                    : "opacity-90 hover:opacity-100 hover:scale-105 hover:ring-2 hover:ring-neutral-500"
                }`}
            />
          ))}
        </div>
      </div>

      {/* === Existing Profiles === */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 p-6 rounded-xl text-center shadow-md border border-neutral-800 hover:scale-105 transition-all duration-300"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-lg"
              />
              <p className="font-semibold text-lg">{profile.name}</p>

              <div className="flex justify-center gap-4 mt-3 text-sm">
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => handleOpenEdit(profile, idx)}
                >
                  Επεξεργασία
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDeleteProfile(profile.name)}
                >
                  Διαγραφή
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4 text-center">Δεν υπάρχουν προφίλ ακόμα</p>
        )}
      </div>

      <button
        onClick={handleBack}
        className="mt-10 text-gray-300 hover:text-white transition text-sm flex items-center gap-2"
      >
        ← Επιστροφή στα Προφίλ
      </button>

      {/* === EDIT MODAL === */}
      <AnimatePresence>
        {editProfile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 w-[90%] max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                Επεξεργασία Προφίλ
              </h3>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-neutral-800 px-4 py-2 rounded-md text-white focus:ring-2 focus:ring-red-600 mb-4"
              />

              <p className="text-sm text-gray-400 mb-2">Επίλεξε Avatar</p>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {avatars.map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    alt=""
                    onClick={() => setEditAvatar(a)}
                    className={`w-16 h-16 rounded-full object-cover cursor-pointer transition
                      ${
                        editAvatar === a
                          ? "ring-4 ring-red-600 scale-105 shadow-red-500/30"
                          : "opacity-90 hover:opacity-100 hover:scale-105 hover:ring-2 hover:ring-neutral-500"
                      }`}
                  />
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditProfile(null)}
                  className="px-4 py-2 rounded-md bg-neutral-700 text-white"
                >
                  Άκυρο
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                >
                  Αποθήκευση
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

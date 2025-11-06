"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🧠 Εδώ βάζεις το login check σου (API ή dummy)
    if (email.trim() === "" || password.trim() === "") return alert("Συμπλήρωσε όλα τα πεδία!");

    // Αν περάσει ο έλεγχος:
    const storedProfiles = JSON.parse(localStorage.getItem("profiles") || "[]");

    if (storedProfiles.length === 0) {
      router.push("/manage-profiles"); // ➤ Αν δεν υπάρχουν profiles, πάει να τα φτιάξει
    } else {
      router.push("/profiles"); // ➤ Αλλιώς πάει στην επιλογή προφίλ
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold text-red-600 mb-8">MyFlix Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-80 bg-neutral-900/90 p-8 rounded-2xl border border-neutral-800 shadow-lg"
      >
        <input
          type="email"
          placeholder="Email"
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Κωδικός"
          className="bg-neutral-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 transition-all py-3 rounded-lg font-semibold"
        >
          Σύνδεση
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

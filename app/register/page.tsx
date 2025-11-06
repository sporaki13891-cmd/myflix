"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-neutral-900 text-white">
      <div className="bg-black/70 p-8 rounded-2xl w-96 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-neutral-800 rounded-md outline-none focus:ring-2 focus:ring-red-600"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-neutral-800 rounded-md outline-none focus:ring-2 focus:ring-red-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-neutral-800 rounded-md outline-none focus:ring-2 focus:ring-red-600"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Sign in now
          </a>
        </p>
      </div>
    </div>
  );
}

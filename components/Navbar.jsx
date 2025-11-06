"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  const router = useRouter();
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const profileButtonRef = useRef(null);

  // 🧭 Scroll blur
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧑‍💻 Load active profile
  useEffect(() => {
    const stored = localStorage.getItem("activeProfile");
    if (stored) {
      setActiveProfile(JSON.parse(stored));
    }
  }, []);

  // 🖱️ Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⌨️ ESC closes both
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      console.log("Searching for:", searchTerm);
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-20 flex items-center justify-between px-6 sm:px-10 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-md shadow-black/40"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* === Logo === */}
      <div
        onClick={() => router.push("/")}
        className="text-2xl font-extrabold text-red-600 tracking-tight cursor-pointer select-none drop-shadow-[0_1px_6px_rgba(255,0,0,0.5)]"
        aria-label="MyFlix home"
      >
        MyFlix
      </div>

      {/* === Menu Items === */}
      <ul
        className="hidden md:flex space-x-8 text-white font-medium tracking-tight"
        role="menubar"
      >
        {["Home", "Movies", "Series", "My List"].map((item) => (
          <li key={item} role="none" className="relative group cursor-pointer">
            <button
              role="menuitem"
              onClick={() =>
                router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)
              }
              className="transition-colors duration-300 group-hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm"
            >
              {item}
            </button>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* === Right Section === */}
      <div className="flex items-center space-x-3 sm:space-x-4 relative">
        {/* 🔍 Search */}
        <form
          onSubmit={handleSearch}
          ref={searchRef}
          role="search"
          aria-label="Site search"
          className={`flex items-center bg-gray-800/70 rounded-full px-3 py-1.5 transition-all duration-300 ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-red-600 ${
            isSearchOpen ? "w-44 sm:w-56" : "hidden sm:flex w-36"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-gray-400 outline-none border-none ring-0 focus:ring-0 focus:outline-none text-sm w-full transition-all duration-300 rounded-full"
            aria-label="Search movies or series"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="p-1 hover:text-red-500 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-5 h-5 ml-1 hover:stroke-red-500 transition-colors duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </button>
        </form>

        {/* 🔍 Mobile toggle */}
        <button
          onClick={() => setIsSearchOpen((prev) => !prev)}
          aria-expanded={isSearchOpen}
          aria-label={isSearchOpen ? "Close search" : "Open search"}
          className="sm:hidden p-2 rounded-full bg-gray-800/70 hover:bg-gray-700 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-600"
        >
          {isSearchOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          )}
        </button>

        {/* 👤 Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            ref={profileButtonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls="profile-menu"
            className="group cursor-pointer focus-visible:ring-2 focus-visible:ring-red-600 rounded-full"
          >
            <img
              src={activeProfile?.avatar || "/images/profile-default.png"}
              alt={activeProfile?.name || "Profile"}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border border-gray-600 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-red-600"
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              id="profile-menu"
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-3 w-48 bg-neutral-900/95 text-gray-200 rounded-lg shadow-lg border border-gray-700 py-2 animate-fadeIn origin-top-right"
            >
              {activeProfile && (
                <p className="px-4 py-2 text-sm text-gray-400">
                  Ενεργό: <span className="text-white">{activeProfile.name}</span>
                </p>
              )}
              <hr className="border-gray-700 my-1" />
              <button
                onClick={() => {
                  localStorage.removeItem("activeProfile");
                  router.push("/profiles");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-500 hover:text-red-400 transition"
              >
                Αλλαγή Προφίλ
              </button>
              <button
                onClick={() => router.push("/manage-profiles")}
                className="block w-full text-left px-4 py-2 hover:bg-red-600/20 hover:text-white transition"
              >
                Διαχείριση Προφίλ
              </button>
              <hr className="border-gray-700 my-1" />
              <button
                onClick={() => router.push("/login")}
                className="block w-full text-left px-4 py-2 text-red-500 hover:text-red-400 transition"
              >
                Αποσύνδεση
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

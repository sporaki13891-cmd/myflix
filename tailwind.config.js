/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // Next.js 13+ app directory
    "./pages/**/*.{js,ts,jsx,tsx}",     // pages directory
    "./components/**/*.{js,ts,jsx,tsx}",// components directory
    "./globals.css"                     // ✅ σωστό path για τη δική σου δομή
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

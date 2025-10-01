/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f",
        surface: "#171616",
        surface2: "#1f1f1f",
        border: "rgba(255,255,255,0.06)",
        text: "#fcf9f2",
        mute: "#8b8b8b",
        accent: "#f9d03f",
        accent2: "#f0c12a",
        danger: "#ff6b6b",
        success: "#39d98a",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.35)",
        lift: "0 16px 40px rgba(0,0,0,0.45)",
      },
      borderRadius: {
        xl: "18px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};

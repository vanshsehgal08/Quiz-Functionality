import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html", // Include index.html
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode based on the 'class' strategy
  theme: {
    extend: {
      colors: {
        primary: "#2D8C45", // Change primary color to green
        secondary: "#1D6B3B", // Change secondary color to a darker green
        error: "#FB3737",
        success: "#19DB7E",
        dark: "#222222",
        medium: "#555555",
        light: "#fdfcff",
        sunny: "#faf8f0",
        // Optional: Additional shades of green for more variety
        greenLight: "#A8E06A", // Light green shade
        greenDark: "#1A5A2F",  // Dark green shade
      },
      fontFamily: {
        geistmono: ["var(--geistmono)"],
        geistsans: ["var(--geist-sans)"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")], // Include the forms plugin
};

export default config;

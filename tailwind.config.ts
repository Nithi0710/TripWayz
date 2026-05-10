import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
      },
      borderRadius: {
        glass: "var(--radius)",
      },
      boxShadow: {
        glass: "var(--shadow)",
      },
    },
  },
  plugins: [],
};
export default config;

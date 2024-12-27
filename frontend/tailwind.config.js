import daisyui from "daisyui";
import scrollbarPlugin from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      exo: ["Exo", "sans-serrif"],
    },
  },
  plugins: [daisyui, scrollbarPlugin],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};

const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#1182c5",
        secondary: "#2aa6df",
        dark: "#1e1e1e",
        light: "#f5f5f5",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      animation: {
        "spin-slow": "spin 40s linear infinite",
      },
      // Estilos para barras de desplazamiento
      scrollbar: {
        width: "8px",
        height: "8px",
        track: {
          background: "#f5f5f5", // Color del track (claro)
          dark: "#1e1e1e", // Color del track en modo oscuro
        },
        thumb: {
          background: "#cccccc", // Color del thumb (claro)
          dark: "#555555", // Color del thumb en modo oscuro
        },
      },
    },
  },
  plugins: [
    heroui(),
    require("tailwind-scrollbar")({ nocompatible: true }), // Agregar el plugin de scrollbar
  ],
};

import React, { useState, useEffect } from "react";
import darkPng from "../../assets/website/dark-mode-button.svg";
import lightPng from "../../assets/website/light-mode-button.svg";

const DarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="relative">
      {theme === "light" ? (
        <img
          src={lightPng}
          alt="Switch to dark mode"
          onClick={() => setTheme("dark")}
          className="w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-opacity duration-300 opacity-100"
        />
      ) : (
        <img
          src={darkPng}
          alt="Switch to light mode"
          onClick={() => setTheme("light")}
          className="w-12 cursor-pointer drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] transition-opacity duration-300 opacity-100"
          style={{ filter: "invert(1)" }} // Hace que el ícono sea blanco
        />
      )}
    </div>
  );
};

export default DarkMode;

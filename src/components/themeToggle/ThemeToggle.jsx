"use client";

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn(
        "relative w-14 h-8 flex items-center rounded-full border transition-colors duration-300 focus:outline-none focus:ring-0",
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-200 border-gray-300"
      )}
      style={{ minWidth: 40, minHeight: 20 }}
    >
      <span
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full flex items-center justify-center text-lg bg-white shadow-md transition-all duration-300",
          theme === "dark"
            ? "left-1 bg-gray-900 text-yellow-300"
            : "right-1 bg-white text-yellow-500"
        )}
        style={{ willChange: 'left, right' }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default ThemeToggle;

"use client";

import styles from "./themeToggle.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={styles.toggleBtn + " " + (theme === 'dark' ? styles.dark : styles.light)}
      type="button"
    >
      <span
        className={styles.ball}
        style={{
          transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
          background: theme === 'dark' ? '#111827' : '#fff',
          color: theme === 'dark' ? '#facc15' : '#f59e42',
        }}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;

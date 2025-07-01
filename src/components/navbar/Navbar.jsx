import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <AuthLinks />
      <div className={styles.center}>
        <Link href="/" className={styles.logo}>UnScripted</Link>
      </div>
      <div className={styles.right}>
        <Link href="/write" className={styles.link}>Write</Link>
        <AuthLinks userMenuOnly />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;

'use client';
import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Pen writing icon
const PenWritingIcon = () => (
  <svg className={styles.writePenIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z"/><path d="M15 6l3 3"/></svg>
);

const PencilIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z"/></svg>
);

const Navbar = () => {
  const { status } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.container}>
      <AuthLinks />
      <div className={styles.center}>
        <Link href="/" className={styles.logo}>its-unscripted</Link>
      </div>
      <div className={styles.right}>
        {status === "authenticated" && (
          <Link href="/write" className={styles.writeLink} aria-label="Write">
            <PencilIcon />
          </Link>
        )}
        <AuthLinks userMenuOnly showThemeToggleInMenu={isMobile} />
        {!isMobile && <ThemeToggle />}
      </div>
    </div>
  );
};

export default Navbar;

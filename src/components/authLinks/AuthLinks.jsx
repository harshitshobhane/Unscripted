"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { status } = useSession();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Write
          </Link>
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
              className={styles.profileBtn}
              onClick={() => setOpen((v) => !v)}
              aria-label="User menu"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.profileIcon}
              >
                <circle cx="12" cy="8" r="4" stroke="#7c3aed" strokeWidth="1.5" />
                <ellipse cx="12" cy="17" rx="7" ry="4" stroke="#7c3aed" strokeWidth="1.5" />
              </svg>
            </button>
            {open && (
              <div className={styles.dropdownMenu}>
                <Link href="/my-posts" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                  My Posts
                </Link>
                <button className={styles.dropdownItem} onClick={signOut}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Homepage</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
          {status === "notauthenticated" ? (
            <Link href="/login">Login</Link>
          ) : (
            <>
              <Link href="/write">Write</Link>
              <span className={styles.link}>Logout</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;

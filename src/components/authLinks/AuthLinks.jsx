"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.profileIcon}><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
);

const AuthLinks = ({ userMenuOnly = false }) => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userBtnRef = useRef(null);
  const { status } = useSession();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    }
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);

  // Only show user menu (profile button) if userMenuOnly is true
  if (userMenuOnly) {
    if (status === "authenticated") {
      return (
        <div className={styles.profileWrapper}>
          <button
            className={styles.profileBtn}
            ref={userBtnRef}
            onClick={() => setDropdown((d) => !d)}
            aria-label="User menu"
          >
            <UserIcon />
          </button>
          {dropdown && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <Link href="/my-posts" className={styles.dropdownItem}>My Posts</Link>
              <button className={styles.dropdownItem} onClick={() => signOut()}>Logout</button>
            </div>
          )}
        </div>
      );
    } else if (status === "unauthenticated") {
      return (
        <Link href="/login" className={styles.link} style={{marginLeft: 8}}>Login</Link>
      );
    } else {
      return null;
    }
  }

  // Default: show burger, login, and responsive menu
  return (
    <div className={styles.authLinksContainer}>
      <div className={styles.burgerWrapper}>
        <div className={styles.burger} onClick={() => setOpen(!open)}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Homepage</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {status === "unauthenticated" ? (
            <Link href="/login">Login</Link>
          ) : (
            <Link href="/write">Write</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthLinks;

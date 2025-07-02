"use client";
import { motion } from "framer-motion";
import styles from "./aboutPage.module.css";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <Image src="/logo.png" alt="UnScripted Logo" width={72} height={72} className={styles.logo} />
      <h2 className={styles.aboutTitle}>About Us</h2>
      <p className={styles.aboutDesc}>
        Welcome to <b>its-unscripted</b>! We&apos;re a passionate team of creators, coders, and storytellers dedicated to sharing authentic voices and fresh perspectives. Our mission is to build a vibrant community where everyone can learn, share, and grow together.
      </p>
      <div className={styles.teamSection}>
        <h3 className={styles.teamTitle}>Our Mission</h3>
        <p className={styles.teamDesc}>
          We believe in the power of stories to inspire, connect, and transform. Whether you&apos;re here to read, write, or just explore, we&apos;re glad to have you as part of our journey. Stay curious, stay creative, and stay unscripted!
        </p>
      </div>
    </div>
  );
} 
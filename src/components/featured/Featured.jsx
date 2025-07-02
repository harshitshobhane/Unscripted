import React from "react";
import styles from "./featured.module.css";

const Featured = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Welcome to its-unscripted!</b><br />
        <span className={styles.subtitle}>Dive into authentic stories and fresh perspectives.</span>
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <div className={styles.svgWrapper}>
            {/* Abstract SVG illustration for creativity */}
            <svg viewBox="0 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.heroSvg}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <path d="M40,200 Q120,80 240,160 T440,80 Q400,240 240,220 Q80,200 40,200 Z" fill="url(#grad1)" opacity="0.9" />
              <circle cx="120" cy="100" r="36" fill="#fbbf24" opacity="0.7" />
              <ellipse cx="340" cy="120" rx="48" ry="28" fill="#38bdf8" opacity="0.5" />
              <rect x="200" y="60" width="60" height="60" rx="18" fill="#a3e635" opacity="0.5" />
            </svg>
          </div>
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>Unleashing Creativity, One Story at a Time</h1>
          <p className={styles.postDesc}>
            Welcome to <b>its-unscripted</b> – your digital home for authentic voices, untold stories, and fresh perspectives. Here, every post is crafted with passion, curiosity, and a dash of chaos. Whether you're a coder, a creator, or a culture enthusiast, you'll find inspiration, tips, and real talk from people who dare to think differently. <br /><br />
            Join our journey, share your own story, and discover a community where creativity knows no bounds. Ready to explore?
          </p>
          <button className={styles.button}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default Featured;

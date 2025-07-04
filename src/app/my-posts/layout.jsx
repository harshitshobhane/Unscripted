import styles from "./myPostsPage.module.css";

export default function MyPostsLayout({ children }) {
  return <div className={styles.container}>{children}</div>;
} 
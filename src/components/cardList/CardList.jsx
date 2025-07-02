"use client";
import { useEffect, useState } from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../card/Card";

const CardList = ({ page, cat }) => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch(`/api/posts?page=${page}&cat=${cat || ""}`);
    const data = await res.json();
    setPosts(data.posts);
    setCount(data.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, cat]);

  const handleDelete = async (slug) => {
    await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    fetchPosts();
  };

  const POST_PER_PAGE = 2;
  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item._id} onDelete={handleDelete} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;

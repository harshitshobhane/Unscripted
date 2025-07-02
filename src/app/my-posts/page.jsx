"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const MyPosts = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/posts?page=1&user=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load posts");
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("You must be logged in to view your posts.");
    }
  }, [status, session]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>My Posts</h1>
      {posts.length === 0 ? (
        <div>No posts found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fff" }}>
              <Link href={`/posts/${post.slug}`} style={{ fontSize: 20, fontWeight: 600, color: "#333", textDecoration: "none" }}>{post.title}</Link>
              <div style={{ margin: "8px 0", color: "#888" }}>{post.createdAt?.substring(0, 10)}</div>
              <button onClick={() => handleDelete(post.slug)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPosts; 
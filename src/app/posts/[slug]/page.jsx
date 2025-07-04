"use client";
import Menu from "../../../components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "../../../components/comments/Comments";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const getData = async (slug) => {
  // Use the Vercel-provided URL or fallback to localhost for dev
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);

  // --- Like/Dislike UI (Client Component) ---
  function LikeDislike() {
    const { data: session } = useSession();
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [userVote, setUserVote] = useState(0); // 1, -1, or 0
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (data?.blogVotes) {
        setLikeCount(data.blogVotes.filter(v => v.value === 1).length);
        setDislikeCount(data.blogVotes.filter(v => v.value === -1).length);
        if (session?.user?.email) {
          const found = data.blogVotes.find(v => v.email === session.user.email);
          setUserVote(found ? found.value : 0);
        }
      }
    }, [data, session]);

    const handleVote = async (value) => {
      if (!session) return alert("Login to vote");
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        const result = await res.json();
        setLikeCount(result.likeCount);
        setDislikeCount(result.dislikeCount);
        if (session?.user?.email) {
          const found = result.blogVotes.find(v => v.email === session.user.email);
          setUserVote(found ? found.value : 0);
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={styles.likeDislikeContainer}>
        <button
          className={styles.likeBtn + (userVote === 1 ? " " + styles.active : "")}
          onClick={() => handleVote(1)}
          disabled={loading}
          aria-label="Like"
        >
          <FaThumbsUp />
        </button>
        <span className={styles.likeCount}>{likeCount}</span>
        <button
          className={styles.dislikeBtn + (userVote === -1 ? " " + styles.active : "")}
          onClick={() => handleVote(-1)}
          disabled={loading}
          aria-label="Dislike"
        >
          <FaThumbsDown />
        </button>
        <span className={styles.dislikeCount}>{dislikeCount}</span>
      </div>
    );
  }

  // --- End Like/Dislike UI ---

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.user.image} alt="" fill className={styles.avatar} />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.user.name}</span>
              <span className={styles.date}>
                {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Date not available"}
              </span>
              <span className={styles.viewsBadge} title="Total views">
                <svg className={styles.viewsIcon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                {data?.views} views
              </span>
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data?.desc }}
          />
          <LikeDislike />
          <div className={styles.comment}>
            <Comments postSlug={slug}/>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;

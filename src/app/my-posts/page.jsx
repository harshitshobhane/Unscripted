"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./myPostsPage.module.css";

const EditIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.862 5.487l1.65-1.65a2.121 2.121 0 1 1 3 3l-1.65 1.65m-2.999-2.999l-9.193 9.193a2 2 0 0 0-.497.828l-1.06 3.18a.5.5 0 0 0 .632.632l3.18-1.06a2 2 0 0 0 .828-.497l9.193-9.193m-2.999-2.999 2.999 2.999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DeleteIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const MyPosts = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("Home");

  // About tab state
  const [bio, setBio] = useState("");
  const [bioLoading, setBioLoading] = useState(false);
  const [bioEdit, setBioEdit] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [bioSaving, setBioSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/posts?page=1&user=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load posts");
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("You must be logged in to view your posts.");
    }
  }, [status, session]);

  // Fetch bio for About tab
  useEffect(() => {
    if ((tab === "About" || tab === "Home") && status === "authenticated") {
      setBioLoading(true);
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setBio(data.bio || "");
          setBioLoading(false);
        })
        .catch(() => {
          setBio("");
          setBioLoading(false);
        });
    }
  }, [tab, status]);

  const handleBioEdit = () => {
    setBioInput(bio);
    setBioEdit(true);
  };

  const handleBioSave = async () => {
    setBioSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: bioInput }),
    });
    setBio(bioInput);
    setBioEdit(false);
    setBioSaving(false);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        alert("Failed to delete post");
      }
    } catch {
      alert("Failed to delete post");
    }
  };

  if (loading)
    return (
      <div className={styles.noStories} style={{textAlign:'center',marginTop:'20vh'}}>Loading...</div>
    );
  if (error)
    return (
      <div className={styles.noStories} style={{textAlign:'center',marginTop:'20vh',color:'#dc2626'}}>{error}</div>
    );

  return (
    <>
      {/* Sidebar/Profile - hidden on mobile */}
      <aside className={styles.sidebar}>
        <Image
          src={session?.user?.image || "/coding.png"}
          alt="Profile"
          width={96}
          height={96}
          className={styles.profileImage}
        />
        <div className={styles.profileName}>{session?.user?.name || "User"}</div>
        <div className={styles.profileEmail}>{session?.user?.email}</div>
        <Link href="#" className={styles.editProfile}>Edit profile</Link>
      </aside>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Navigation Tabs */}
        <div className={styles.tabs}>
          <button
            className={tab === "Home" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setTab("Home")}
          >
            Home
          </button>
          <button
            className={tab === "About" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setTab("About")}
          >
            About
          </button>
        </div>
        {/* Tab Content */}
        {tab === "Home" && (
          <section>
            <h2 className={styles.readingListTitle}>Reading list</h2>
            {posts.length === 0 ? (
              <div className={styles.noStories}>No stories <span style={{marginLeft:'4px'}}>🔒</span></div>
            ) : (
              <div className={styles.cardList}>
                {posts.map((post) => (
                  <div key={post.slug} className={styles.card}>
                    {/* Preview box instead of image */}
                    <Link href={`/posts/${post.slug}`} className={styles.cardPreviewBox}>
                      <div className={styles.cardPreviewTitle}>{post.title}</div>
                      <div className={styles.cardPreviewDate}>{post.createdAt?.substring(0, 10)}</div>
                      <div className={styles.cardPreviewDesc}>{post.desc?.replace(/<[^>]+>/g, "").slice(0, 100) || "No excerpt available."}</div>
                    </Link>
                    <div className={styles.cardActions}>
                      <Link href={`/posts/${post.slug}/edit`} className={styles.cardIconBtn} title="Edit" aria-label="Edit post"><EditIcon /></Link>
                      <button onClick={() => handleDelete(post.slug)} className={styles.cardIconBtn} title="Delete" aria-label="Delete post"><DeleteIcon /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {tab === "About" && (
          <section>
            <h2 className={styles.readingListTitle}>About</h2>
            {bioLoading ? (
              <div className={styles.noStories}>Loading...</div>
            ) : bioEdit ? (
              <div className={`${styles.bioEditContainer} ${styles.themeBox}`}>
                <textarea
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  rows={6}
                  className={styles.bioTextarea}
                  placeholder="Write something about yourself..."
                  autoFocus
                />
                <div className={styles.bioEditActions}>
                  <button onClick={()=>setBioEdit(false)} className={styles.bioCancelBtn}>Cancel</button>
                  <button onClick={handleBioSave} disabled={bioSaving} className={styles.bioSaveBtn}>{bioSaving ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            ) : !bio ? (
              <div className={`${styles.bioPrompt} ${styles.themeBox}`}>
                <div className={styles.bioPromptTitle}>Tell the world about yourself</div>
                <div className={styles.bioPromptDesc}>
                  Here's where you can share more about yourself: your history, work experience, accomplishments, interests, dreams, and more. You can even use rich text to personalize your bio.
                </div>
                <button onClick={()=>setBioEdit(true)} className={styles.bioGetStartedBtn}>Get started</button>
              </div>
            ) : (
              <div className={styles.bioDisplayRow}>
                <div className={styles.bioDisplayText}>{bio}</div>
                <button onClick={handleBioEdit} className={styles.bioEditBtn}>Edit</button>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default MyPosts; 
"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { FaBold, FaItalic, FaRegSmile, FaPaperPlane, FaEllipsisV, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Picker from '@emoji-mart/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import ReactDOM from 'react-dom';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }
  return data;
};

const emojiList = ["😊", "😂", "😍", "👍", "🔥", "😢", "🎉", "😎", "🙏", "🤔", "🥳", "😇", "😡", "💡", "🙌", "🤩", "😅", "😭", "😜", "🤗"];

// Place this outside the Comments component so it is only rendered once
const QuillToolbar = () => (
  <div id="quill-toolbar" className="quillToolbarGlobal">
    <span className="ql-formats">
      <button className="ql-bold" tabIndex={-1} />
      <button className="ql-italic" tabIndex={-1} />
    </span>
  </div>
);

// Reusable CommentInput component for both comment and reply
function CommentInput({
  value,
  setValue,
  onSubmit,
  loading = false,
  placeholder = "Write your comment here...",
  warning = "",
  setWarning,
  emojiBtnRef,
  emojiPickerRef,
  showEmojis,
  setShowEmojis,
  boldActive,
  italicActive,
  handleBold,
  handleItalic,
  handleEmoji,
  textareaRef,
  sendLabel = "Post",
  onCancel,
}) {
  return (
    <div className={styles.commentCard} style={{ marginBottom: 0, boxShadow: 'none', background: 'none', border: 'none', padding: 0 }}>
      <div className={styles.toolbarRow}>
        <button className={styles.toolbarBtn + (boldActive ? ' ' + styles.activeBtn : '')} title="Bold" onMouseDown={handleBold}><FaBold /></button>
        <button className={styles.toolbarBtn + (italicActive ? ' ' + styles.activeBtn : '')} title="Italic" onMouseDown={handleItalic}><FaItalic /></button>
        <div className={styles.emojiBtnWrap}>
          <button
            type="button"
            className={styles.emojiBtn}
            ref={emojiBtnRef}
            onClick={() => setShowEmojis((v) => !v)}
            tabIndex={-1}
            aria-label="Insert emoji"
          >
            <FaRegSmile />
          </button>
          {showEmojis && (
            <div className={styles.emojiPickerWrap} ref={emojiPickerRef}>
              <Picker
                theme={typeof window !== 'undefined' && document.body.classList.contains('dark') ? 'dark' : 'light'}
                onEmojiSelect={handleEmoji}
                previewPosition="none"
                skinTonePosition="none"
                style={{ borderRadius: 12, boxShadow: '0 2px 12px #0005' }}
              />
            </div>
          )}
        </div>
      </div>
      {warning && (
        <div style={{ color: '#ff5a5a', marginBottom: 8, fontWeight: 500, fontSize: '1rem' }}>{warning}</div>
      )}
      <div
        ref={textareaRef}
        className={styles.textarea + (warning ? ' ' + styles.warning : '')}
        contentEditable
        suppressContentEditableWarning={true}
        data-placeholder={warning ? warning : placeholder}
        style={{ resize: 'vertical', minHeight: 80, maxHeight: 240, outline: 'none', whiteSpace: 'pre-wrap', overflowY: 'auto' }}
        onInput={e => { setValue(e.currentTarget.innerHTML); if (warning && setWarning) setWarning(""); }}
        spellCheck={true}
        aria-label={placeholder}
      />
      <div className={styles.sendRow}>
        <button className={styles.sendBtn} onClick={onSubmit} disabled={!value.trim() || loading}>
          <FaPaperPlane style={{ marginRight: 6 }} /> {sendLabel}
        </button>
        {onCancel && (
          <button className={styles.sendBtn} style={{ marginLeft: 8, background: '#eee', color: '#333' }} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// Helper to count all nested replies
function countReplies(children) {
  if (!children || !Array.isArray(children)) return 0;
  return children.reduce((sum, child) => sum + 1 + countReplies(child.children), 0);
}

// Recursive comment item
function CommentItem({ item, session, mutate, handleVote, parentId = null, depth = 0 }) {
  const [showReply, setShowReply] = useState(false);
  const [replyDesc, setReplyDesc] = useState("");
  const replyRef = useRef();
  const [replyWarning, setReplyWarning] = useState("");
  const [showChildren, setShowChildren] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiBtnRef = useRef();
  const emojiPickerRef = useRef();
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef();
  const menuDropdownRef = useRef();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkFormat = () => {
      setBoldActive(document.queryCommandState('bold'));
      setItalicActive(document.queryCommandState('italic'));
    };
    document.addEventListener('selectionchange', checkFormat);
    return () => document.removeEventListener('selectionchange', checkFormat);
  }, []);

  useEffect(() => {
    if (!showEmojis) return;
    function handleClick(e) {
      if (
        emojiBtnRef.current && emojiBtnRef.current.contains(e.target)
      ) return;
      if (
        emojiPickerRef.current && emojiPickerRef.current.contains(e.target)
      ) return;
      setShowEmojis(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojis]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (
        menuBtnRef.current && menuBtnRef.current.contains(e.target)
      ) return;
      if (
        menuDropdownRef.current && menuDropdownRef.current.contains(e.target)
      ) return;
      setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleBold = (e) => { e.preventDefault(); document.execCommand('bold'); };
  const handleItalic = (e) => { e.preventDefault(); document.execCommand('italic'); };
  const handleEmoji = (emoji) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    sel.getRangeAt(0).deleteContents();
    sel.getRangeAt(0).insertNode(document.createTextNode(emoji.native));
    setShowEmojis(false);
  };

  const handleReplySubmit = async () => {
    const html = replyRef.current?.innerHTML || "";
    if (!html.replace(/<[^>]+>/g, '').trim()) {
      setReplyWarning("Please enter a reply before posting.");
      return;
    }
    setReplyWarning("");
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ desc: html, postSlug: item.postSlug, parentId: item.id }),
    });
    setReplyDesc("");
    if (replyRef.current) replyRef.current.innerHTML = "";
    setShowReply(false);
    mutate();
  };

  return (
    <div className={styles.comment} style={{ marginLeft: depth * 32 }}>
      <div className={styles.upvoteDownvoteCol}>
        {(() => {
          const userVote = Array.isArray(item.votes) ? item.votes.find(v => v.email === session?.user?.email) : null;
          const hasUpvoted = userVote?.value === 1;
          const hasDownvoted = userVote?.value === -1;
          return (
            <>
              <button
                className={styles.upvoteBtn + (hasUpvoted ? ' ' + styles.activeVote : '')}
                onClick={() => handleVote(item.id, 1)}
                aria-label="Upvote"
                title={hasUpvoted ? 'Undo upvote' : 'Upvote'}
              >
                <FaArrowUp />
              </button>
              <span className={styles.upvoteCount}>
                {Array.isArray(item.votes) ? item.votes.reduce((sum, v) => sum + v.value, 0) : 0}
              </span>
              <button
                className={styles.downvoteBtn + (hasDownvoted ? ' ' + styles.activeVote : '')}
                onClick={() => handleVote(item.id, -1)}
                aria-label="Downvote"
                title={hasDownvoted ? 'Undo downvote' : 'Downvote'}
              >
                <FaArrowDown />
              </button>
            </>
          );
        })()}
      </div>
      <div className={styles.commentContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {item?.user?.image && (
            <div className={styles.userImageWrap}>
              <Image
                src={item.user.image}
                alt=""
                width={50}
                height={50}
                className={styles.image}
                style={{
                  borderRadius: '50%',
                  border: '2px solid var(--softBg, #e5e7eb)',
                  background: 'var(--bg, #fff)',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.username}>{item.user?.name || "Unknown User"}</span>
            <span className={styles.date}>{new Date(item.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          </div>
          {session?.user?.email && item.user?.email && session.user.email === item.user.email && (
            <div className={styles.commentMenuWrap}>
              <button
                className={styles.menuBtn}
                aria-label="Comment menu"
                ref={menuBtnRef}
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(v => !v);
                }}
              >
                <FaEllipsisV />
              </button>
              {menuOpen && (
                <div className={styles.menuDropdown} ref={menuDropdownRef}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDeleteModal(true);
                    }}
                  >Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.desc}>
          <div dangerouslySetInnerHTML={{ __html: item.desc }} />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
          {session && (
            <button className={styles.sendBtn} style={{ padding: '4px 12px', fontSize: '0.95rem' }} onClick={() => setShowReply(v => !v)}>
              Reply
            </button>
          )}
          {item.children && item.children.length > 0 && (
            <button className={styles.sendBtn} style={{ padding: '4px 12px', fontSize: '0.95rem', marginLeft: 8 }} onClick={() => setShowChildren(v => !v)}>
              {showChildren
                ? `Hide replies (${countReplies(item.children)})`
                : `Show replies (${countReplies(item.children)})`}
            </button>
          )}
        </div>
        {/* Always render reply box INSIDE .commentContent, after actions and before children */}
        {showReply && (
          <div className={styles.replyInputBox}>
            <CommentInput
              value={replyDesc}
              setValue={setReplyDesc}
              onSubmit={handleReplySubmit}
              loading={false}
              placeholder=""
              warning={replyWarning}
              setWarning={setReplyWarning}
              emojiBtnRef={emojiBtnRef}
              emojiPickerRef={emojiPickerRef}
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
              boldActive={boldActive}
              italicActive={italicActive}
              handleBold={handleBold}
              handleItalic={handleItalic}
              handleEmoji={handleEmoji}
              textareaRef={replyRef}
              sendLabel="Reply"
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}
        {/* Render children recursively */}
        {item.children && item.children.length > 0 && showChildren && (
          <div style={{ marginTop: 12 }}>
            {item.children.map(child => (
              <CommentItem
                key={child.id}
                item={child}
                session={session}
                mutate={mutate}
                handleVote={handleVote}
                parentId={item.id}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
      {showDeleteModal && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem 2.5rem',
            boxShadow: '0 4px 32px #0002',
            minWidth: 320,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.15rem', marginBottom: 24 }}>Are you sure you want to delete this comment?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ececec',
                  color: '#333',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={() => setShowDeleteModal(false)}
              >Cancel</button>
              <button
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  setShowDeleteModal(false);
                  try {
                    const res = await fetch('/api/comments', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: item.id }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      alert(data.message || 'Failed to delete comment');
                    } else {
                      mutate();
                    }
                  } catch (err) {
                    alert('Failed to delete comment');
                  }
                }}
              >Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const Comments = ({ postSlug }) => {
  const { status, data: session } = useSession();
  const { theme } = useContext(ThemeContext);
  const { data, mutate, isLoading } = useSWR(`/api/comments?postSlug=${postSlug}`, fetcher);

  const [desc, setDesc] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const textareaRef = useRef();
  const emojiBtnRef = useRef();
  const emojiPickerRef = useRef();
  const [warning, setWarning] = useState("");
  const [menuOpenIdx, setMenuOpenIdx] = useState(null);

  // Close emoji picker only when clicking outside
  useEffect(() => {
    if (!showEmojis) return;
    function handleClick(e) {
      if (
        emojiBtnRef.current && emojiBtnRef.current.contains(e.target)
      ) return;
      if (
        emojiPickerRef.current && emojiPickerRef.current.contains(e.target)
      ) return;
      setShowEmojis(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojis]);

  // Track formatting state
  useEffect(() => {
    const checkFormat = () => {
      setBoldActive(document.queryCommandState('bold'));
      setItalicActive(document.queryCommandState('italic'));
    };
    document.addEventListener('selectionchange', checkFormat);
    return () => document.removeEventListener('selectionchange', checkFormat);
  }, []);

  // WYSIWYG formatting handlers
  const handleBold = (e) => {
    e.preventDefault();
    document.execCommand('bold');
  };
  const handleItalic = (e) => {
    e.preventDefault();
    document.execCommand('italic');
  };
  const handleEmoji = (emoji) => {
    // Insert emoji at caret
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    sel.getRangeAt(0).deleteContents();
    sel.getRangeAt(0).insertNode(document.createTextNode(emoji.native));
    setShowEmojis(false);
  };

  const handleInput = (e) => {
    setDesc(e.currentTarget.innerHTML);
    if (warning) setWarning("");
  };

  const handleSubmit = async () => {
    const html = textareaRef.current?.innerHTML || "";
    if (!html.replace(/<[^>]+>/g, '').trim()) {
      setWarning("Please enter a comment before posting.");
      return;
    }
    setWarning("");
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ desc: html, postSlug }),
    });
    setDesc("");
    if (textareaRef.current) textareaRef.current.innerHTML = "";
    mutate();
  };

  const handleVote = async (id, delta) => {
    await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, delta }),
    });
    mutate();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Post Discussion</h1>
      {status === "authenticated" ? (
        <CommentInput
          value={desc}
          setValue={setDesc}
          onSubmit={handleSubmit}
          loading={false}
          placeholder=""
          warning={warning}
          setWarning={setWarning}
          emojiBtnRef={emojiBtnRef}
          emojiPickerRef={emojiPickerRef}
          showEmojis={showEmojis}
          setShowEmojis={setShowEmojis}
          boldActive={boldActive}
          italicActive={italicActive}
          handleBold={handleBold}
          handleItalic={handleItalic}
          handleEmoji={handleEmoji}
          textareaRef={textareaRef}
          sendLabel="Post"
        />
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className={styles.comments}>
        {isLoading
          ? "loading"
          : Array.isArray(data)
            ? data.filter(item => !item.parentId).map((item) => (
                <CommentItem
                  key={item.id}
                  item={item}
                  session={session}
                  mutate={mutate}
                  handleVote={handleVote}
                />
              ))
            : data?.message
              ? <div style={{ color: "red" }}>{data.message}</div>
              : null
        }
      </div>
    </div>
  );
};

export default Comments;

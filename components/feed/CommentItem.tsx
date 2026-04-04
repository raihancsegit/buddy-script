"use client";

import React, { useState } from "react";
import { addComment, toggleCommentLike } from "@/lib/actions/comments";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

// ── Inline likers popup ───────────────────────────────────────────────────────
function LikersPopup({ likers, onClose }: { likers: any[]; onClose: () => void }) {
  return (
    <span
      style={{
        position: "absolute", zIndex: 200, background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)", borderRadius: "10px",
        padding: "12px", minWidth: "180px", top: "24px", left: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontWeight: 600, fontSize: "13px" }}>Liked by</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#999" }}>✕</button>
      </div>
      {likers.slice(0, 8).map((like: any, i: number) => {
        const name = like.user?.displayName || like.user?.name || like.user?.email?.split("@")[0] || "User";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 0" }}>
            <Avatar src={like.user?.image} name={name} size={22} />
            <span style={{ fontSize: "12px" }}>{name}</span>
          </div>
        );
      })}
    </span>
  );
}

// ── CommentItem ───────────────────────────────────────────────────────────────
export default function CommentItem({
  comment, allComments, postId, currentUserId,
}: { comment: any; allComments: any[]; postId: string; currentUserId?: string }) {
  const router = useRouter();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  const replies = allComments.filter((c) => c.parentId === comment.id);
  const commentLikeCount = comment.likes?.length || 0;
  const isLiked = comment.likes?.some((l: any) => l.userId === currentUserId);

  const authorName =
    comment.author?.displayName ||
    comment.author?.name ||
    comment.author?.email?.split("@")[0] || "User";

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `.${m}m`;
    return `.${Math.floor(m / 60)}h`;
  }

  async function handleLike() {
    if (!currentUserId) return;
    try {
      await toggleCommentLike(comment.id);
      router.refresh();
    } catch {
      alert("Failed to like comment.");
    }
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || !currentUserId) return;
    setLoading(true);
    try {
      await addComment(postId, replyContent, comment.id);
      setReplyContent("");
      setShowReplyInput(false);
      router.refresh();
    } catch {
      alert("Failed to add reply.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit(e as any);
    }
  }

  return (
    // ── Exact HTML structure from feed.html lines 1253-1320 ──
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <Avatar src={comment.author?.image} name={authorName} size={36} className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          {/* Author name */}
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0">
                <h4 className="_comment_name_title">{authorName}</h4>
              </a>
            </div>
          </div>

          {/* Comment text */}
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>

          {/* Like reaction icons on comment */}
          {commentLikeCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
                <span className="_reaction_heart">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
              </div>
              <span
                className="_total"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => setShowLikers(!showLikers)}
              >
                {commentLikeCount}
                {showLikers && <LikersPopup likers={comment.likes || []} onClose={() => setShowLikers(false)} />}
              </span>
            </div>
          )}

          {/* Like · Reply · Share · time */}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list" style={{ whiteSpace: "nowrap" }}>
                <li>
                  <span
                    onClick={handleLike}
                    style={{ cursor: "pointer", color: isLiked ? "#377DFF" : undefined, fontWeight: isLiked ? 600 : undefined }}
                  >
                    {isLiked ? "Liked." : "Like."}
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    style={{ cursor: "pointer", color: showReplyInput ? "#377DFF" : undefined }}
                  >
                    Reply.
                  </span>
                </li>
                <li><span>Share</span></li>
                <li><span className="_time_link">{timeAgo(comment.createdAt)}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Reply Input ── */}
        {showReplyInput && (
          <div className="_feed_inner_comment_box" style={{ marginTop: "8px" }}>
            <form onSubmit={handleReplySubmit} className="_feed_inner_comment_box_form">
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
                  <input
                    type="text"
                    className="form-control _comment_textarea"
                    placeholder="Write a reply... (Enter to send)"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    disabled={loading}
                    style={{ borderRadius: "20px" }}
                  />
                </div>
              </div>
              {replyContent.trim() && (
                <div className="_feed_inner_comment_box_icon">
                  <button type="submit" disabled={loading}
                    style={{ background: "#377DFF", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "13px" }}>
                    {loading ? "..." : "Reply"}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ── Nested Replies ── */}
        {replies.length > 0 && (
          <div style={{ marginLeft: "20px", marginTop: "8px", borderLeft: "2px solid #f0f0f0", paddingLeft: "12px" }}>
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                postId={postId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

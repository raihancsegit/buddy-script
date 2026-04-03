"use client";

import React, { useState } from "react";
import { toggleLike } from "@/lib/actions/posts";
import { useRouter } from "next/navigation";
import CommentSection from "./CommentSection";
import Avatar from "@/components/ui/Avatar";

// ── Likers Modal ──────────────────────────────────────────────────────────────
function LikersModal({ likers, onClose }: { likers: any[]; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "12px", padding: "24px",
          minWidth: "280px", maxWidth: "380px", width: "90%",
          maxHeight: "60vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h5 style={{ margin: 0, fontWeight: 600, fontSize: "16px" }}>❤️ Liked by ({likers.length})</h5>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#666" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {likers.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", fontSize: "14px" }}>No likes yet</p>
          ) : (
            likers.map((like: any, i: number) => {
              const name = like.user?.displayName || like.user?.name || like.user?.email?.split("@")[0] || "User";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <Avatar src={like.user?.image} name={name} size={36} />
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
export default function PostCard({ post, currentUserId }: { post: any; currentUserId?: string }) {
  const router = useRouter();
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  const isLiked = post.likes?.some((l: any) => l.userId === currentUserId);
  const likeCount = post.likes?.length || 0;
  const commentCount = post._count?.comments || 0;

  const authorName =
    post.author?.displayName ||
    (post.author?.firstName && post.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : post.author?.name || post.author?.email?.split("@")[0] || "User");

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  async function handleLike() {
    if (!currentUserId) return;
    setLikeLoading(true);
    try {
      await toggleLike(post.id);
      router.refresh();
    } catch {
      alert("Failed to like post.");
    } finally {
      setLikeLoading(false);
    }
  }

  return (
    <>
      {showLikers && <LikersModal likers={post.likes || []} onClose={() => setShowLikers(false)} />}

      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">

          {/* ── Top: Author Info + 3-dot menu ── */}
          <div className="_feed_inner_timeline_post_top">
            <div className="_feed_inner_timeline_post_box">
              <div className="_feed_inner_timeline_post_box_image">
                <Avatar src={post.author?.image} name={authorName} size={44} className="_post_img" />
              </div>
              <div className="_feed_inner_timeline_post_box_txt">
                <h4 className="_feed_inner_timeline_post_box_title">{authorName}</h4>
                <p className="_feed_inner_timeline_post_box_para">
                  {timeAgo(post.createdAt)} · <a href="#0">{post.isPublic ? "Public" : "Private"}</a>
                </p>
              </div>
            </div>
            {/* 3-dot menu (UI only) */}
            <div className="_feed_inner_timeline_post_box_dropdown">
              <div className="_feed_timeline_post_dropdown">
                <button className="_feed_timeline_post_dropdown_link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Post Content ── */}
          <p style={{ margin: "16px 0", lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--color2)" }}>
            {post.content}
          </p>
          {post.image && (
            <div className="_feed_inner_timeline_image">
              <img src={post.image} alt="Post" className="_time_img"
                onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </div>

        {/* ── Reaction Stats Row ── */}
        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
          <div className="_feed_inner_timeline_total_reacts_image">
            {likeCount > 0 && (
              <>
                <img src="/assets/images/react_img1.png" alt="" className="_react_img1" />
                <img src="/assets/images/react_img2.png" alt="" className="_react_img" />
                <p className="_feed_inner_timeline_total_reacts_para">{likeCount}</p>
              </>
            )}
          </div>
          <div className="_feed_inner_timeline_total_reacts_txt">
            {likeCount > 0 && (
              <p className="_feed_inner_timeline_total_reacts_para1">
                <button onClick={() => setShowLikers(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <a href="#0"><span>{likeCount}</span> Like{likeCount !== 1 ? "s" : ""}</a>
                </button>
              </p>
            )}
            <p className="_feed_inner_timeline_total_reacts_para2">
              <span>{commentCount}</span> Comment{commentCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Reaction Buttons (exact HTML structure) ── */}
        <div className="_feed_inner_timeline_reaction">
          {/* Like / Haha Button */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${isLiked ? "_feed_reaction_active" : ""}`}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span className="d-flex align-items-center">
                <span className="me-2">
                  {isLiked ? (
                    // Heart when liked
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24">
                      <path fill="#FF4D4F" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    // Haha emoji when not liked (matches original HTML)
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                      <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                      <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                      <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                      <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                    </svg>
                  )}
                </span>
                {isLiked ? " Liked" : " Haha"}
              </span>
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`_feed_inner_timeline_reaction_comment _feed_reaction ${showComments ? "_feed_reaction_active" : ""}`}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span className="d-flex align-items-center">
                <span className="me-2">
                  <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                    <path stroke={showComments ? "#377DFF" : "#000"} d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                    <path stroke={showComments ? "#377DFF" : "#000"} strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                  </svg>
                </span>
                Comment
              </span>
            </span>
          </button>

          {/* Share Button */}
          <button className="_feed_inner_timeline_reaction_share _feed_reaction">
            <span className="_feed_inner_timeline_reaction_link">
              <span className="d-flex align-items-center">
                <span className="me-2">
                  <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                    <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                  </svg>
                </span>
                Share
              </span>
            </span>
          </button>
        </div>

        {/* ── Comment Section ── */}
        {showComments && (
          <div className="_feed_inner_timeline_cooment_area">
            <CommentSection
              postId={post.id}
              comments={post.comments || []}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </>
  );
}

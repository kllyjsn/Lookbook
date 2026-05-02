import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Send, BadgeCheck } from "lucide-react";
import { useStore } from "../../stores/useStore";

interface CommentsDrawerProps {
  postId: string;
  postTitle: string;
  creatorName: string;
  staticCount?: number;
  onClose: () => void;
}

const QUICK_REACTIONS = ["❤️", "🔥", "✨", "👏", "💾", "😍"];

export function CommentsDrawer({ postId, postTitle, creatorName, staticCount, onClose }: CommentsDrawerProps) {
  const allComments = useStore((s) => s.comments);
  const likedCommentIds = useStore((s) => s.likedCommentIds);
  const addComment = useStore((s) => s.addComment);
  const toggleCommentLike = useStore((s) => s.toggleCommentLike);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const comments = useMemo(
    () => allComments.filter((c) => c.postId === postId),
    [allComments, postId],
  );
  const headerCount = useMemo(
    () => Math.max(comments.length, staticCount ?? 0),
    [comments.length, staticCount],
  );

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(postId, text);
    setDraft("");
    setTimeout(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleQuickReaction = (emoji: string) => {
    addComment(postId, emoji);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end justify-center"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-cream rounded-t-3xl flex flex-col"
        style={{ height: "min(80vh, 720px)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-ink/5">
          <div className="min-w-0">
            <h3 className="font-editorial text-lg text-ink leading-tight">
              {headerCount} {headerCount === 1 ? "comment" : "comments"}
            </h3>
            <p className="text-[11px] font-inter text-ink-muted truncate">
              on &ldquo;{postTitle}&rdquo; by {creatorName}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-ivory border border-ink/10"
          >
            <X size={14} className="text-ink" />
          </motion.button>
        </div>

        {/* Comments list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-subhead text-base text-ink-muted italic">
                Be the first to weigh in.
              </p>
              <p className="text-[11px] font-inter text-ink-muted mt-1">
                Tap a reaction below or write your thoughts.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => {
                const liked = likedCommentIds.includes(c.id);
                const isYou = c.authorId === "you";
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-ivory rounded-2xl px-3.5 py-2.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[13px] font-inter font-semibold text-ink">
                            {c.authorName}
                          </span>
                          {c.authorVerified && (
                            <BadgeCheck size={12} className="text-gold" fill="currentColor" />
                          )}
                          {isYou && (
                            <span className="text-[9px] font-inter font-semibold tracking-wider uppercase text-gold ml-1">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-inter text-ink-light leading-snug whitespace-pre-wrap break-words">
                          {c.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 px-1">
                        <span className="text-[11px] font-inter text-ink-muted">
                          {c.createdAt}
                        </span>
                        <button
                          onClick={() => toggleCommentLike(c.id)}
                          className="flex items-center gap-1"
                        >
                          <motion.span
                            animate={liked ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart
                              size={12}
                              className={liked ? "text-rose" : "text-ink-muted"}
                              fill={liked ? "currentColor" : "none"}
                              strokeWidth={1.5}
                            />
                          </motion.span>
                          <span
                            className={`text-[11px] font-inter ${liked ? "text-rose" : "text-ink-muted"}`}
                          >
                            {c.likes > 0 ? c.likes : ""}
                          </span>
                        </button>
                        <button className="text-[11px] font-inter text-ink-muted">
                          Reply
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick reactions row */}
        <div className="px-5 pt-2 pb-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_REACTIONS.map((emoji) => (
              <motion.button
                key={emoji}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleQuickReaction(emoji)}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-ivory border border-ink/5 flex items-center justify-center text-lg active:bg-ink/5"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="px-5 py-3 border-t border-ink/5 safe-bottom">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Add a comment…"
              className="flex-1 bg-ivory rounded-full px-4 py-2.5 text-sm font-inter text-ink outline-none border border-transparent focus:border-ink/15"
            />
            <AnimatePresence>
              {draft.trim() && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center"
                >
                  <Send size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

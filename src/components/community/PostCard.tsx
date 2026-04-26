import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, ShoppingBag, BadgeCheck } from "lucide-react";
import type { CommunityPost } from "../../data/communityData";
import { FollowButton } from "./FollowButton";

interface PostCardProps {
  post: CommunityPost;
  index: number;
  onCreatorTap: (creatorId: string) => void;
  onShopTap: (post: CommunityPost) => void;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function PostCard({ post, index, onCreatorTap, onShopTap }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const lastTapRef = useRef(0);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked) {
        setLiked(true);
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 900);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [liked]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="mb-6"
    >
      {/* Creator row */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onCreatorTap(post.creator.id)}
          className="flex items-center gap-3 flex-1 cursor-pointer"
        >
          <div className="relative">
            <img
              src={post.creator.avatar}
              alt={post.creator.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/20"
            />
            {post.creator.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cream flex items-center justify-center">
                <BadgeCheck size={12} className="text-gold" fill="currentColor" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-inter font-semibold text-ink truncate">
                {post.creator.displayName}
              </span>
            </div>
            <span className="text-[11px] font-inter text-ink-muted">
              @{post.creator.username} · {post.createdAt}
            </span>
          </div>
        </motion.div>
        <FollowButton creatorId={post.creator.id} />
      </div>

      {/* Image — double-tap to like */}
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal mb-3"
        onClick={handleDoubleTap}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 shimmer bg-charcoal" />
        )}
        <img
          src={post.image}
          alt={post.title}
          className={`img-editorial transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-5 pb-6">
          <h3 className="font-editorial text-2xl text-white leading-tight">
            {post.title}
          </h3>
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.label}
              className="text-[9px] font-inter tracking-[0.15em] uppercase text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1"
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Heart burst on double-tap */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart size={80} className="text-white drop-shadow-lg" fill="white" strokeWidth={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Engagement bar */}
      <div className="flex items-center gap-5 px-1 mb-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5"
        >
          <Heart
            size={20}
            className={liked ? "text-rose" : "text-ink-muted"}
            fill={liked ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
          <span className={`text-xs font-inter ${liked ? "text-rose" : "text-ink-muted"}`}>
            {formatCount(post.likes + (liked ? 1 : 0))}
          </span>
        </motion.button>

        <button className="flex items-center gap-1.5">
          <MessageCircle size={20} className="text-ink-muted" strokeWidth={1.5} />
          <span className="text-xs font-inter text-ink-muted">{formatCount(post.comments)}</span>
        </button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setSaved(!saved)}
          className="flex items-center gap-1.5"
        >
          <Bookmark
            size={20}
            className={saved ? "text-gold" : "text-ink-muted"}
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
          <span className={`text-xs font-inter ${saved ? "text-gold" : "text-ink-muted"}`}>
            {formatCount(post.saves + (saved ? 1 : 0))}
          </span>
        </motion.button>

        {post.items.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => onShopTap(post)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink/10 hover:border-ink/25 transition-colors"
          >
            <ShoppingBag size={14} className="text-ink-muted" />
            <span className="text-[11px] font-inter text-ink-light">
              Shop {post.items.length} {post.items.length === 1 ? "piece" : "pieces"}
            </span>
          </motion.button>
        )}
      </div>

      {/* Caption */}
      <p className="text-sm font-inter text-ink-light leading-relaxed px-1">
        <span className="font-semibold text-ink">{post.creator.displayName}</span>{" "}
        {post.caption}
      </p>
    </motion.article>
  );
}

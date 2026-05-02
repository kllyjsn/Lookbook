import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Bookmark,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  ChevronUp,
} from "lucide-react";
import type { Look } from "../../data/mockData";

interface ReelsFeedProps {
  looks: Look[];
  topStyle: string | null;
  budgetPreference: string | null;
  reasonFor: (look: Look) => string;
  onLike: (look: Look) => void;
  onSave: (look: Look) => void;
  onShop: (look: Look) => void;
  onComments: (look: Look) => void;
  onShare: (look: Look) => void;
  onView: (look: Look) => void;
  isLiked: (lookId: string) => boolean;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface ReelProps extends Omit<ReelsFeedProps, "looks"> {
  look: Look;
  isActive: boolean;
}

function Reel({
  look,
  isActive,
  reasonFor,
  onLike,
  onSave,
  onShop,
  onComments,
  onShare,
  onView,
  isLiked,
}: ReelProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const lastTapRef = useRef(0);
  const reason = useMemo(() => reasonFor(look), [reasonFor, look]);

  useEffect(() => {
    if (isActive) onView(look);
  }, [isActive, look, onView]);

  const liked = isLiked(look.id);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap → love
      if (!liked) onLike(look);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
    lastTapRef.current = now;
  }, [liked, look, onLike]);

  return (
    <div
      className="relative h-full w-full snap-start snap-always overflow-hidden bg-charcoal"
      onClick={handleClick}
    >
      {/* Skeleton */}
      {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <img
        src={look.image}
        alt={look.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImgLoaded(true)}
        draggable={false}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* Top — issue context + badges */}
      <div className="absolute top-0 inset-x-0 p-5 pt-6 flex items-start justify-between pointer-events-none">
        <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-white/70">
          {look.season}
        </span>
        <div className="flex items-center gap-1.5">
          {look.editorsChoice && (
            <span className="flex items-center gap-1 text-[9px] font-inter font-semibold tracking-[0.1em] uppercase text-white bg-gold/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Award size={10} />
              Editor's Pick
            </span>
          )}
          {look.trending && !look.editorsChoice && (
            <span className="flex items-center gap-1 text-[9px] font-inter font-semibold tracking-[0.1em] uppercase text-white bg-rose/80 backdrop-blur-sm rounded-full px-2.5 py-1">
              <TrendingUp size={10} />
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Bottom-left — title block */}
      <div className="absolute bottom-0 left-0 right-16 p-5 pb-8 pointer-events-none">
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {look.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.label}
              className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/80 border border-white/25 rounded-full px-2.5 py-0.5"
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h2 className="font-editorial text-3xl text-white leading-[1.05] mb-1">
          {look.title}
        </h2>
        <p className="font-subhead text-base text-white/80 italic mb-2">
          {look.subtitle}
        </p>

        {/* Why we picked this */}
        <div className="flex items-start gap-1.5 mt-2 mb-2">
          <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-gold mt-0.5">
            FOR YOU
          </span>
          <span className="text-[11px] font-inter text-white/85 leading-snug">
            {reason}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-inter text-white/60 mt-1">
          <span>{look.priceRange}</span>
          <span className="text-white/30">·</span>
          <span>{look.items.length} pieces</span>
        </div>
      </div>

      {/* Right action rail — TikTok-style */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 pointer-events-auto">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!liked) onLike(look);
          }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            animate={liked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md ${
              liked ? "bg-rose/90" : "bg-white/15"
            }`}
          >
            <Heart
              size={20}
              className="text-white"
              fill={liked ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          </motion.div>
          <span className="text-[10px] font-inter font-semibold text-white drop-shadow">
            {formatCount(look.likes + (liked ? 1 : 0))}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onShop(look);
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <ShoppingBag size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-inter font-semibold text-white drop-shadow">
            Shop
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onComments(look);
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <MessageCircle size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-inter font-semibold text-white drop-shadow">
            Talk
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onSave(look);
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Bookmark size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-inter font-semibold text-white drop-shadow">
            Save
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onShare(look);
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Share2 size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-inter font-semibold text-white drop-shadow">
            Share
          </span>
        </motion.button>
      </div>

      {/* Double-tap heart burst */}
      <AnimatePresence>
        {showHeartBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart size={96} className="text-white drop-shadow-2xl" fill="white" strokeWidth={0} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ReelsFeed({
  looks,
  reasonFor,
  topStyle,
  budgetPreference,
  onLike,
  onSave,
  onShop,
  onComments,
  onShare,
  onView,
  isLiked,
}: ReelsFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Hide swipe hint after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Track which reel is active by scroll position.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(container.scrollTop / container.clientHeight);
        if (idx !== activeIdx) setActiveIdx(idx);
      });
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("scroll", onScroll);
    };
  }, [activeIdx]);

  // topStyle / budgetPreference are read by Reel children via reasonFor (stable callback),
  // and Reel itself useMemo's the resolved reason per look.
  // We accept these as props so future enhancements (e.g. visual badges keyed off topStyle) are easy.
  void topStyle;
  void budgetPreference;

  return (
    <div className="relative h-full w-full bg-black">
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {looks.map((look, i) => (
          <div
            key={look.id + "-" + i}
            className="h-full w-full"
            style={{ scrollSnapAlign: "start" }}
          >
            <Reel
              look={look}
              isActive={i === activeIdx}
              reasonFor={reasonFor}
              topStyle={topStyle}
              budgetPreference={budgetPreference}
              onLike={onLike}
              onSave={onSave}
              onShop={onShop}
              onComments={onComments}
              onShare={onShare}
              onView={onView}
              isLiked={isLiked}
            />
          </div>
        ))}
      </div>

      {/* Reel position indicator */}
      <div className="absolute top-3 right-1/2 translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none">
        <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/80 font-semibold">
          {activeIdx + 1} / {looks.length}
        </span>
      </div>

      {/* Swipe-up hint (first-load only) */}
      <AnimatePresence>
        {showHint && looks.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-24 flex flex-col items-center gap-1 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center"
            >
              <ChevronUp size={18} className="text-white" />
            </motion.div>
            <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/80 drop-shadow">
              Swipe up
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

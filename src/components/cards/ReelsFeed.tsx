import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Bookmark, MessageCircle, Share2, Flame } from "lucide-react";
import type { Look } from "../../data/mockData";
import { trendingHeat } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface ReelsFeedProps {
  looks: Look[];
  onOpenDetail: (look: Look) => void;
}

export function ReelsFeed({ looks, onOpenDetail }: ReelsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const likeFromReels = useStore((s) => s.likeFromReels);
  const addToCollection = useStore((s) => s.addToCollection);
  const getStyleMatch = useStore((s) => s.getStyleMatch);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const currentLook = looks[currentIndex];
  const styleMatch = getStyleMatch(currentLook);
  const heat = trendingHeat[currentLook.id];

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((i) => (i < looks.length - 1 ? i + 1 : i));
  }, [looks.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  const lastWheelNav = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelNav.current < 400) return;
      if (Math.abs(e.deltaY) > 30) {
        lastWheelNav.current = now;
        if (e.deltaY > 0) goNext();
        else goPrev();
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: true });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [goNext, goPrev]);

  const handleLike = () => {
    if (!likedIds.has(currentLook.id)) {
      likeFromReels(currentLook);
      setLikedIds((prev) => new Set(prev).add(currentLook.id));
    }
  };

  const handleSave = () => {
    if (!savedIds.has(currentLook.id)) {
      addToCollection("favorites", currentLook);
      setSavedIds((prev) => new Set(prev).add(currentLook.id));
    }
  };

  const reelVariants = {
    enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0.5 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0.5 }),
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full relative overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentLook.id}
          custom={direction}
          variants={reelVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute inset-0"
        >
          <img
            src={currentLook.image}
            alt={currentLook.title}
            className="w-full h-full object-cover"
          />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content overlay — bottom left */}
          <div className="absolute bottom-24 left-4 right-16 z-10">
            <div className="flex items-center gap-2 mb-2">
              {heat && (
                <span className="flex items-center gap-0.5 text-[10px] font-inter font-bold text-orange-400">
                  <Flame size={10} fill="currentColor" />
                  {heat === "fire" ? "VIRAL" : heat === "hot" ? "HOT" : "RISING"}
                </span>
              )}
              {styleMatch > 0 && (
                <span className="text-[10px] font-inter font-semibold text-white/70 bg-white/15 backdrop-blur-sm rounded-full px-2 py-0.5">
                  {styleMatch}% match
                </span>
              )}
            </div>
            <h2 className="font-editorial text-2xl text-white leading-tight mb-1">
              {currentLook.title}
            </h2>
            <p className="font-subhead text-sm text-white/70 italic mb-2">
              {currentLook.subtitle}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {currentLook.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/60 border border-white/20 rounded-full px-2.5 py-0.5"
                >
                  {tag.label}
                </span>
              ))}
              <span className="text-[10px] font-inter text-white/40">
                {currentLook.priceRange}
              </span>
            </div>
          </div>

          {/* Right-side action buttons (TikTok-style) */}
          <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                likedIds.has(currentLook.id) ? "bg-rose/20" : "bg-white/10 backdrop-blur-sm"
              }`}>
                <Heart
                  size={22}
                  className={likedIds.has(currentLook.id) ? "text-rose" : "text-white"}
                  fill={likedIds.has(currentLook.id) ? "currentColor" : "none"}
                />
              </div>
              <span className="text-[10px] font-inter text-white/70">
                {formatCount(currentLook.likes)}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onOpenDetail(currentLook)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-inter text-white/70">Shop</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleSave}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                savedIds.has(currentLook.id) ? "bg-gold/20" : "bg-white/10 backdrop-blur-sm"
              }`}>
                <Bookmark
                  size={20}
                  className={savedIds.has(currentLook.id) ? "text-gold" : "text-white"}
                  fill={savedIds.has(currentLook.id) ? "currentColor" : "none"}
                />
              </div>
              <span className="text-[10px] font-inter text-white/70">Save</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `LKBK — ${currentLook.title}`,
                    text: currentLook.description,
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-inter text-white/70">Share</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-inter text-white/70">
                {formatCount(Math.round(currentLook.likes * 0.12))}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-1">
        {looks.slice(0, 20).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-white"
                : i < currentIndex
                ? "w-2 bg-white/50"
                : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

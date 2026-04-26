import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RefreshCw, Sparkles, Camera } from "lucide-react";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { feedLooks } from "../data/mockData";
import { useStore } from "../stores/useStore";

const trendingTags = [
  { label: "All", id: "all", keywords: [] as string[] },
  { label: "Quiet Luxury", id: "quiet-luxury", keywords: ["minimalist", "chic", "tailored"] },
  { label: "Tomato Girl", id: "tomato-girl", keywords: ["romantic", "feminine", "social"] },
  { label: "Office Siren", id: "office-siren", keywords: ["office", "power", "tailored"] },
  { label: "Coastal", id: "coastal", keywords: ["adventure", "casual", "utility"] },
  { label: "Old Money", id: "old-money", keywords: ["minimalist", "evening", "glamour"] },
  { label: "Coquette", id: "coquette", keywords: ["romantic", "feminine", "evening"] },
];

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const setCurrentFeedIndex = useStore((s) => s.setCurrentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const likedLooks = useStore((s) => s.likedLooks);
  const [activeTrend, setActiveTrend] = useState("all");
  const [showSearch, setShowSearch] = useState(false);

  const filteredLooks = useMemo(() => {
    if (activeTrend === "all") return feedLooks;
    const tag = trendingTags.find((t) => t.id === activeTrend);
    if (!tag || tag.keywords.length === 0) return feedLooks;
    return feedLooks.filter((look) =>
      look.tags.some((t) => tag.keywords.includes(t.label.toLowerCase()))
    );
  }, [activeTrend]);
  const [heartBurst, setHeartBurst] = useState<{ x: number; y: number } | null>(null);
  const heartBurstTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSeenAll = currentFeedIndex >= filteredLooks.length;

  useEffect(() => {
    return () => {
      if (heartBurstTimeout.current) clearTimeout(heartBurstTimeout.current);
    };
  }, []);

  const handleDoubleTap = useCallback((coords: { x: number; y: number }) => {
    setHeartBurst(coords);
    if (heartBurstTimeout.current) clearTimeout(heartBurstTimeout.current);
    heartBurstTimeout.current = setTimeout(() => {
      setHeartBurst(null);
      heartBurstTimeout.current = null;
    }, 900);
  }, []);

  const currentLook = useMemo(
    () => filteredLooks[currentFeedIndex % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );
  const nextLook = useMemo(
    () => filteredLooks[(currentFeedIndex + 1) % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );

  const handleSwipeRight = useCallback(() => {
    likeLook(currentLook);
  }, [currentLook, likeLook]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
  }, [currentLook, passLook]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
  }, [currentLook, likeLook]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
  }, [currentLook, passLook]);

  const handleButtonShop = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonSave = useCallback(() => {
    addToCollection("favorites", currentLook);
    setActiveTab("profile");
  }, [currentLook, addToCollection, setActiveTab]);

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted">
            {hasSeenAll ? filteredLooks.length : (currentFeedIndex % filteredLooks.length) + 1} / {filteredLooks.length}
          </span>
          <div className="w-16 h-1 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((currentFeedIndex + 1) / filteredLooks.length) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {!hasSeenAll && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 rounded-full bg-ivory border border-ink/10 flex items-center justify-center"
            >
              <Camera size={14} className="text-ink" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Trending tags strip */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-select" style={{ scrollbarWidth: "none" }}>
          {trendingTags.map((tag) => (
            <motion.button
              key={tag.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTrend(tag.id); setCurrentFeedIndex(0); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-inter font-medium tracking-wide transition-all ${
                activeTrend === tag.id
                  ? "bg-ink text-cream"
                  : "bg-ivory text-ink-muted border border-ink/5"
              }`}
            >
              {tag.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Card stack area */}
      <div className="flex-1 relative px-4 pb-2">
        {hasSeenAll ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-6"
            >
              <Sparkles size={32} className="text-gold" />
            </motion.div>
            <h2 className="font-editorial text-2xl text-ink text-center mb-2">
              You've seen today's edit.
            </h2>
            <p className="font-subhead text-base text-ink-muted italic text-center mb-2">
              {likedLooks.length > 0
                ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""}. Great taste.`
                : "Come back tomorrow for fresh picks."}
            </p>
            <div className="flex flex-col gap-3 w-full mt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentFeedIndex(0)}
                className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Replay Today's Edit
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("community")}
                className="w-full py-3.5 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium"
              >
                Explore Community
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-full max-w-md mx-auto">
            <AnimatePresence>
              {/* Background card (next) */}
              <SwipeCard
                key={`bg-${nextLook.id}-${currentFeedIndex}`}
                look={nextLook}
                onSwipeRight={() => {}}
                onSwipeLeft={() => {}}
                onSwipeUp={() => {}}
                onTap={() => {}}
                isTop={false}
              />
              {/* Top card (current) */}
              <SwipeCard
                key={`fg-${currentLook.id}-${currentFeedIndex}`}
                look={currentLook}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSwipeUp={handleSwipeUp}
                onTap={handleTap}
                onDoubleTap={handleDoubleTap}
                isTop={true}
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!hasSeenAll && (
        <div className="pb-20 px-4">
          <SwipeButtons
            onPass={handleButtonPass}
            onLike={handleButtonLike}
            onShop={handleButtonShop}
            onSave={handleButtonSave}
          />
          <p className="text-center text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mt-1">
            Double-tap to love · Swipe up to shop
          </p>
        </div>
      )}

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-cream"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowSearch(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full glass flex items-center justify-center border border-ink/10"
            >
              <span className="text-ink text-lg font-inter">&times;</span>
            </motion.button>
            <SearchPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-tap heart burst — lives in FeedPage so it survives SwipeCard unmount */}
      <AnimatePresence>
        {heartBurst && (
          <motion.div
            key="heart-burst"
            className="fixed pointer-events-none z-[100]"
            style={{ left: heartBurst.x - 40, top: heartBurst.y - 40 }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heart size={80} className="text-rose" fill="currentColor" strokeWidth={0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Look Detail overlay */}
      <AnimatePresence>
        {showLookDetail && (
          <LookDetail
            look={showLookDetail}
            onClose={() => setShowLookDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

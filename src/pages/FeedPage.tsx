import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { Logo } from "../components/ui/Logo";
import { feedLooks } from "../data/mockData";
import { useStore } from "../stores/useStore";

const trendingTags = [
  { label: "All", id: "all" },
  { label: "Quiet Luxury", id: "quiet-luxury" },
  { label: "Tomato Girl", id: "tomato-girl" },
  { label: "Office Siren", id: "office-siren" },
  { label: "Coastal", id: "coastal" },
  { label: "Old Money", id: "old-money" },
  { label: "Coquette", id: "coquette" },
];

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const [activeTrend, setActiveTrend] = useState("all");
  const [heartBurst, setHeartBurst] = useState<{ x: number; y: number } | null>(null);
  const heartBurstTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    () => feedLooks[currentFeedIndex % feedLooks.length],
    [currentFeedIndex]
  );
  const nextLook = useMemo(
    () => feedLooks[(currentFeedIndex + 1) % feedLooks.length],
    [currentFeedIndex]
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
        <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted">
          {(currentFeedIndex % feedLooks.length) + 1} / {feedLooks.length}
        </span>
      </div>

      {/* Trending tags strip */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-select" style={{ scrollbarWidth: "none" }}>
          {trendingTags.map((tag) => (
            <motion.button
              key={tag.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTrend(tag.id)}
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
      </div>

      {/* Action buttons */}
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

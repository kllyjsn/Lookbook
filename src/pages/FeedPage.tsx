import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, Star } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

function OutfitRatingCard({ onRate }: { onRate: (rating: number) => void }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-20 flex items-center justify-center"
    >
      <div className="bg-cream/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-ink/5 mx-4 w-full max-w-sm">
        <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold text-center mb-2">
          Quick Rate
        </p>
        <h3 className="font-editorial text-xl text-ink text-center mb-4">
          How's this look?
        </h3>
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.85 }}
              onMouseEnter={() => setHoveredRating(n)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => {
                onRate(n);
                setSubmitted(true);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: n <= hoveredRating ? "#C5A572" : "rgba(26,26,26,0.05)",
              }}
            >
              <Star
                size={18}
                className={n <= hoveredRating ? "text-white" : "text-ink-muted"}
                fill={n <= hoveredRating ? "currentColor" : "none"}
              />
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] font-inter text-ink-muted text-center">
          Helps us learn your taste
        </p>
      </div>
    </motion.div>
  );
}

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const setCurrentFeedIndex = useStore((s) => s.setCurrentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const activeMoodFilter = useStore((s) => s.activeMoodFilter);
  const setActiveMoodFilter = useStore((s) => s.setActiveMoodFilter);
  const undoLastSwipe = useStore((s) => s.undoLastSwipe);
  const lastSwipedLook = useStore((s) => s.lastSwipedLook);
  const likedLooks = useStore((s) => s.likedLooks);
  const styleStreak = useStore((s) => s.styleStreak);
  const checkAndUpdateStreak = useStore((s) => s.checkAndUpdateStreak);
  const rateOutfit = useStore((s) => s.rateOutfit);
  const outfitRatings = useStore((s) => s.outfitRatings);
  const [showSearch, setShowSearch] = useState(false);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  const filteredLooks = useMemo(
    () =>
      activeMoodFilter === "all"
        ? feedLooks
        : feedLooks.filter((l) => l.mood === activeMoodFilter),
    [activeMoodFilter]
  );

  const hasSeenAll = currentFeedIndex >= filteredLooks.length;

  const currentLook = useMemo(
    () => filteredLooks[currentFeedIndex % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );
  const nextLook = useMemo(
    () => filteredLooks[(currentFeedIndex + 1) % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );

  const shouldShowRating = currentFeedIndex > 0 && currentFeedIndex % 4 === 0 && !outfitRatings[currentLook?.id];

  const handleSwipeRight = useCallback(() => {
    likeLook(currentLook);
    if ((currentFeedIndex + 1) % 4 === 0) setShowRating(true);
  }, [currentLook, likeLook, currentFeedIndex]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
    if ((currentFeedIndex + 1) % 4 === 0) setShowRating(true);
  }, [currentLook, passLook, currentFeedIndex]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleDoubleTap = useCallback(() => {
    likeLook(currentLook);
    if ((currentFeedIndex + 1) % 4 === 0) setShowRating(true);
  }, [currentLook, likeLook, currentFeedIndex]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
    if ((currentFeedIndex + 1) % 4 === 0) setShowRating(true);
  }, [currentLook, likeLook, currentFeedIndex]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
    if ((currentFeedIndex + 1) % 4 === 0) setShowRating(true);
  }, [currentLook, passLook, currentFeedIndex]);

  const handleButtonShop = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonSave = useCallback(() => {
    addToCollection("favorites", currentLook);
    setActiveTab("profile");
  }, [currentLook, addToCollection, setActiveTab]);

  const handleMoodFilter = useCallback(
    (mood: MoodFilter) => {
      setActiveMoodFilter(mood);
    },
    [setActiveMoodFilter]
  );

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <div className="flex items-center gap-2">
          <Logo variant="mark" size="sm" />
          {styleStreak > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-400"
            >
              <Flame size={10} className="text-white" />
              <span className="text-[9px] font-inter font-bold text-white">
                {styleStreak}
              </span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
            {Math.min(currentFeedIndex + 1, filteredLooks.length)} / {filteredLooks.length}
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

      {/* Mood filter pills */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {moodFilters.map((filter) => (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-inter font-medium transition-all ${
                activeMoodFilter === filter.id
                  ? "bg-ink text-cream"
                  : "bg-ivory text-ink-muted border border-ink/5 hover:border-ink/15"
              }`}
            >
              {filter.label}
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
            {styleStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400/10 to-rose-400/10 border border-orange-400/20 mb-2"
              >
                <Flame size={14} className="text-orange-400" />
                <span className="text-xs font-inter text-ink">
                  {styleStreak} day streak! Keep it going tomorrow.
                </span>
              </motion.div>
            )}
            <div className="flex flex-col gap-3 w-full mt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveMoodFilter("trending");
                }}
                className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                Explore Trending Aesthetics
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentFeedIndex(0)}
                className="w-full py-3.5 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
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
            {/* Outfit rating interstitial */}
            <AnimatePresence>
              {showRating && shouldShowRating && (
                <OutfitRatingCard
                  onRate={(rating) => {
                    rateOutfit(currentLook.id, rating);
                    setShowRating(false);
                  }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {/* Background card (next) */}
              <SwipeCard
                key={`bg-${nextLook.id}-${currentFeedIndex}`}
                look={nextLook}
                onSwipeRight={() => {}}
                onSwipeLeft={() => {}}
                onSwipeUp={() => {}}
                onTap={() => {}}
                onDoubleTap={() => {}}
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
            onUndo={undoLastSwipe}
            canUndo={!!lastSwipedLook}
          />
          <p className="text-center text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mt-1">
            Swipe right to love · Left to pass · Up to shop · Double-tap to love
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

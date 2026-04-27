import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, Zap } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";
import { personalizedFeed, getDailyChallenge } from "../data/feedAlgorithm";

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
  const passedLooks = useStore((s) => s.passedLooks);
  const styleDNA = useStore((s) => s.styleDNA);
  const streak = useStore((s) => s.streak);
  const [showSearch, setShowSearch] = useState(false);
  const [showChallenge, setShowChallenge] = useState(true);

  const challenge = getDailyChallenge();

  const passedIds = useMemo(
    () => new Set(passedLooks.map((l) => l.id)),
    [passedLooks]
  );

  const filteredLooks = useMemo(() => {
    const base =
      activeMoodFilter === "all"
        ? feedLooks
        : feedLooks.filter((l) => l.mood === activeMoodFilter);
    return personalizedFeed(base, styleDNA, passedIds);
  }, [activeMoodFilter, styleDNA, passedIds]);

  const hasSeenAll = currentFeedIndex >= filteredLooks.length;

  const currentLook = useMemo(
    () => filteredLooks[currentFeedIndex % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );
  const nextLook = useMemo(
    () => filteredLooks[(currentFeedIndex + 1) % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );

  const hotRightNow = useMemo(
    () =>
      [...feedLooks]
        .filter((l) => l.trending || l.likes > 15000)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5),
    []
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

  const handleDoubleTap = useCallback(() => {
    likeLook(currentLook);
  }, [currentLook, likeLook]);

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
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20"
            >
              <Flame size={10} className="text-gold" />
              <span className="text-[9px] font-inter font-bold text-gold">{streak}</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
            {Math.min(currentFeedIndex + 1, feedLooks.length)} / {feedLooks.length}
          </span>
          <div className="w-16 h-1 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((currentFeedIndex + 1) / feedLooks.length) * 100, 100)}%` }}
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

      {/* Daily Style Challenge banner */}
      <AnimatePresence>
        {showChallenge && !hasSeenAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold/10 to-blush/10 border border-gold/15">
              <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-inter font-bold tracking-[0.15em] uppercase text-gold">
                  {challenge.title}
                </p>
                <p className="text-[11px] font-inter text-ink-light leading-snug truncate">
                  {challenge.prompt}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChallenge(false)}
                className="text-ink-muted text-xs flex-shrink-0"
              >
                ×
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Hot Right Now section */}
            {hotRightNow.length > 0 && (
              <div className="w-full mt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={14} className="text-rose" />
                  <span className="text-xs font-inter font-semibold tracking-[0.1em] uppercase text-ink">
                    Hot Right Now
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {hotRightNow.map((look) => (
                    <motion.div
                      key={look.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowLookDetail(look)}
                      className="flex-shrink-0 w-28 cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1.5">
                        <img src={look.image} alt={look.title} className="img-editorial" />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-2">
                          <span className="text-white text-[10px] font-inter font-medium leading-tight line-clamp-1">
                            {look.title}
                          </span>
                        </div>
                        <div className="absolute top-1.5 right-1.5">
                          <span className="flex items-center gap-0.5 text-[8px] font-inter font-bold text-white bg-rose/80 rounded-full px-1.5 py-0.5">
                            <Flame size={8} />
                            {(look.likes / 1000).toFixed(1)}K
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full mt-2">
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

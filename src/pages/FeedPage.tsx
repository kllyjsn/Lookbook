import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Heart, Flame, TrendingUp } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

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
  const styleDNA = useStore((s) => s.styleDNA);
  const styleStreak = useStore((s) => s.styleStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const checkAndUpdateStreak = useStore((s) => s.checkAndUpdateStreak);
  const [showSearch, setShowSearch] = useState(false);

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
        <Logo variant="mark" size="sm" />
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
            className="w-full h-full overflow-y-auto px-6 py-8"
          >
            {/* Streak + stats header */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {styleStreak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-blush/10 border border-gold/20"
                >
                  <Flame size={16} className="text-gold" />
                  <span className="text-sm font-inter font-bold text-gold">{styleStreak}</span>
                  <span className="text-[10px] font-inter tracking-wider uppercase text-ink-muted">day streak</span>
                </motion.div>
              )}
              <div className="text-center">
                <p className="text-xs font-inter text-ink-muted">{totalSwipes} swipes total</p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-4 mx-auto"
            >
              <Sparkles size={28} className="text-gold" />
            </motion.div>
            <h2 className="font-editorial text-2xl text-ink text-center mb-2">
              You've seen today's edit.
            </h2>
            <p className="font-subhead text-base text-ink-muted italic text-center mb-2">
              {likedLooks.length > 0
                ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""}. Great taste.`
                : "Come back tomorrow for fresh picks."}
            </p>

            {/* Style DNA snapshot */}
            {styleDNA.length > 0 && likedLooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 rounded-2xl bg-ivory"
              >
                <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted mb-3">
                  Your Style DNA
                </p>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                  {styleDNA.filter(d => d.percentage > 0).map((d) => (
                    <motion.div
                      key={d.style}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {styleDNA.filter(d => d.percentage > 0).map((d) => (
                    <span key={d.style} className="text-[10px] font-inter text-ink-muted">
                      {d.style} {d.percentage}%
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* "Because you loved..." recommendations */}
            {likedLooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={14} className="text-rose" fill="currentColor" />
                  <h3 className="font-editorial text-lg text-ink">Because You Loved</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {feedLooks
                    .filter((l) => !likedLooks.some((ll) => ll.id === l.id))
                    .filter((l) => {
                      const likedMoods = new Set(likedLooks.map((ll) => ll.mood));
                      return likedMoods.has(l.mood);
                    })
                    .slice(0, 4)
                    .map((look, i) => (
                      <motion.div
                        key={look.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        onClick={() => setShowLookDetail(look)}
                        className="flex-shrink-0 w-32 cursor-pointer group"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                          <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-2">
                            <p className="text-white text-[11px] font-inter font-medium leading-tight">{look.title}</p>
                          </div>
                          {(look.trendVelocity ?? 0) > 20 && (
                            <div className="absolute top-1.5 right-1.5">
                              <TrendingUp size={10} className="text-gold" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 w-full mt-8 pb-8">
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

import { useCallback, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, Users } from "lucide-react";
import { feedLooks, moodFilters, dailyChallenges } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
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
  const currentStreak = useStore((s) => s.currentStreak);
  const recordSession = useStore((s) => s.recordSession);
  const [showSearch, setShowSearch] = useState(false);
  const [showChallenge, setShowChallenge] = useState(true);

  useEffect(() => {
    recordSession();
  }, [recordSession]);

  const todaysChallenge = useMemo(
    () => dailyChallenges[new Date().getDay() % dailyChallenges.length],
    []
  );

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
        <div className="flex items-center gap-2">
          <Logo variant="mark" size="sm" />
          {currentStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-rose/10 rounded-full px-2.5 py-1 border border-orange-500/20"
            >
              <Flame size={12} className="text-orange-500" />
              <span className="text-[10px] font-inter font-bold text-orange-600">{currentStreak}</span>
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

      {/* Daily Challenge Banner */}
      <AnimatePresence>
        {showChallenge && !hasSeenAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div className="relative bg-gradient-to-r from-ink to-charcoal rounded-xl p-3.5 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 shimmer" />
              <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/50 mb-0.5">Today's Challenge</p>
                <p className="text-xs font-inter font-medium text-white truncate">{todaysChallenge.prompt}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-inter text-gold">{todaysChallenge.hashtag}</span>
                  <span className="flex items-center gap-0.5 text-[9px] font-inter text-white/40">
                    <Users size={8} />
                    {formatCount(todaysChallenge.participants)}
                  </span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChallenge(false)}
                className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white/60 text-[10px]">&times;</span>
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

import { useCallback, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, X, Flame, Trophy, Target } from "lucide-react";
import { feedLooks, moodFilters, getDailyChallenge, computeStyleMatch, getWhyThisLook } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

function MilestoneCelebration({ streak, onDismiss }: { streak: number; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss, streak]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-ink/90 backdrop-blur-xl rounded-3xl px-8 py-6 text-center pointer-events-auto"
        onClick={onDismiss}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-5xl mb-3"
        >
          {streak >= 50 ? "👑" : streak >= 25 ? "⚡" : streak >= 10 ? "🔥" : "✨"}
        </motion.div>
        <p className="font-editorial text-2xl text-cream mb-1">{streak} Streak!</p>
        <p className="font-subhead text-sm text-cream/60 italic">
          {streak >= 50
            ? "Fashion icon status unlocked"
            : streak >= 25
            ? "Your taste is *impeccable*"
            : streak >= 10
            ? "You're on fire today"
            : "Great eye — keep going!"}
        </p>
      </motion.div>
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
  const passedLooks = useStore((s) => s.passedLooks);
  const styleDNA = useStore((s) => s.styleDNA);
  const swipeStreak = useStore((s) => s.swipeStreak);
  const bestStreak = useStore((s) => s.bestStreak);

  const lastMilestone = useStore((s) => s.lastMilestone);
  const incrementStreak = useStore((s) => s.incrementStreak);
  const clearMilestone = useStore((s) => s.clearMilestone);
  const dismissedChallengeId = useStore((s) => s.dismissedChallengeId);
  const dismissChallenge = useStore((s) => s.dismissChallenge);
  const [showSearch, setShowSearch] = useState(false);

  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const showChallenge = dismissedChallengeId !== dailyChallenge.id;

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

  const styleMatch = useMemo(
    () => computeStyleMatch(currentLook.tags, styleDNA),
    [currentLook, styleDNA]
  );

  const whyThisLook = useMemo(
    () => getWhyThisLook(currentLook, styleDNA),
    [currentLook, styleDNA]
  );

  const handleSwipeRight = useCallback(() => {
    likeLook(currentLook);
    incrementStreak();
  }, [currentLook, likeLook, incrementStreak]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
    incrementStreak();
  }, [currentLook, passLook, incrementStreak]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleDoubleTap = useCallback(() => {
    likeLook(currentLook);
    incrementStreak();
  }, [currentLook, likeLook, incrementStreak]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
    incrementStreak();
  }, [currentLook, likeLook, incrementStreak]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
    incrementStreak();
  }, [currentLook, passLook, incrementStreak]);

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

  const topStyle = useMemo(
    () => [...styleDNA].sort((a, b) => b.percentage - a.percentage)[0],
    [styleDNA]
  );

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          {swipeStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose/15 to-gold/15 border border-rose/20"
            >
              <Flame size={12} className="text-rose" />
              <span className="text-[10px] font-inter font-bold text-ink">{swipeStreak}</span>
            </motion.div>
          )}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-2 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold/10 via-blush/10 to-lavender/10 border border-gold/15">
              <span className="text-lg">{dailyChallenge.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-gold font-semibold">
                  {dailyChallenge.tag}
                </p>
                <p className="text-xs font-inter text-ink truncate">
                  {dailyChallenge.prompt}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dismissChallenge(dailyChallenge.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-ink/5"
              >
                <X size={12} className="text-ink-muted" />
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

            {/* Session stats */}
            <div className="flex items-center gap-4 mb-4">
              {likedLooks.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose/10 border border-rose/15">
                  <span className="text-xs font-inter font-semibold text-rose">{likedLooks.length}</span>
                  <span className="text-[10px] font-inter text-rose/70">loved</span>
                </div>
              )}
              {passedLooks.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5 border border-ink/10">
                  <span className="text-xs font-inter font-semibold text-ink-muted">{passedLooks.length}</span>
                  <span className="text-[10px] font-inter text-ink-muted/70">passed</span>
                </div>
              )}
              {bestStreak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/15">
                  <Trophy size={10} className="text-gold" />
                  <span className="text-xs font-inter font-semibold text-gold">{bestStreak}</span>
                  <span className="text-[10px] font-inter text-gold/70">best streak</span>
                </div>
              )}
            </div>

            {topStyle && (
              <p className="font-subhead text-base text-ink-muted italic text-center mb-2">
                Your taste leans {topStyle.style.toLowerCase()} today. Great eye.
              </p>
            )}

            <div className="flex flex-col gap-3 w-full mt-4">
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
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("capsule")}
                className="w-full py-3.5 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                <Target size={14} />
                Build Your Capsule
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
                styleMatch={styleMatch}
                whyLabel={whyThisLook}
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

      {/* Milestone celebration overlay */}
      <AnimatePresence>
        {lastMilestone > 0 && (
          <MilestoneCelebration
            streak={lastMilestone}
            onDismiss={clearMilestone}
          />
        )}
      </AnimatePresence>

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

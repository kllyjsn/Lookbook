import { useCallback, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, TrendingUp, Eye } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore, computeAffinityScore } from "../stores/useStore";

function useSimulatedViewers(lookId: string): number {
  const [count, setCount] = useState(() => 40 + Math.floor(Math.random() * 160));
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(12, prev + delta);
      });
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [lookId]);
  return count;
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
  const styleDNA = useStore((s) => s.styleDNA);
  const checkInToday = useStore((s) => s.checkInToday);
  const streakCount = useStore((s) => s.streakCount);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    checkInToday();
  }, [checkInToday]);

  const filteredLooks = useMemo(() => {
    const base = activeMoodFilter === "all"
      ? feedLooks
      : feedLooks.filter((l) => l.mood === activeMoodFilter);

    if (likedLooks.length < 2) return base;

    return [...base].sort((a, b) => {
      const scoreA = computeAffinityScore(a, styleDNA);
      const scoreB = computeAffinityScore(b, styleDNA);
      return scoreB - scoreA;
    });
  }, [activeMoodFilter, styleDNA, likedLooks.length]);

  const hasSeenAll = currentFeedIndex >= filteredLooks.length;

  const currentLook = useMemo(
    () => filteredLooks[currentFeedIndex % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );
  const nextLook = useMemo(
    () => filteredLooks[(currentFeedIndex + 1) % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );

  const viewerCount = useSimulatedViewers(currentLook.id);

  const affinityMatch = useMemo(() => {
    if (likedLooks.length < 2) return null;
    const score = computeAffinityScore(currentLook, styleDNA);
    if (score >= 80) return "Perfect Match";
    if (score >= 50) return "Great Match";
    return null;
  }, [currentLook, styleDNA, likedLooks.length]);

  const recommendedLooks = useMemo(() => {
    if (likedLooks.length === 0) return [];
    const likedIds = new Set(likedLooks.map((l) => l.id));
    const passedIds = new Set(useStore.getState().passedLooks.map((l) => l.id));
    return feedLooks
      .filter((l) => !likedIds.has(l.id) && !passedIds.has(l.id))
      .sort((a, b) => computeAffinityScore(b, styleDNA) - computeAffinityScore(a, styleDNA))
      .slice(0, 4);
  }, [likedLooks, styleDNA]);

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
          {streakCount > 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-gold/20 to-rose/20"
            >
              <Flame size={10} className="text-gold" />
              <span className="text-[9px] font-inter font-bold text-gold">{streakCount}</span>
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
            className="w-full h-full flex flex-col items-center justify-center px-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-4"
            >
              <Sparkles size={32} className="text-gold" />
            </motion.div>
            <h2 className="font-editorial text-2xl text-ink text-center mb-1">
              You've seen today's edit.
            </h2>
            <p className="font-subhead text-base text-ink-muted italic text-center mb-1">
              {likedLooks.length > 0
                ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""}. Impeccable taste.`
                : "Tomorrow brings a fresh curation."}
            </p>
            {streakCount > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-rose/10 border border-gold/20 mb-4"
              >
                <Flame size={14} className="text-gold" />
                <span className="text-xs font-inter font-medium text-ink">
                  {streakCount}-day style streak
                </span>
              </motion.div>
            )}

            {/* Personalized recommendations */}
            {recommendedLooks.length > 0 && (
              <div className="w-full mt-4 mb-4">
                <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted mb-3 text-center">
                  Because you loved {likedLooks[likedLooks.length - 1]?.title ?? "it"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {recommendedLooks.slice(0, 2).map((look, i) => (
                    <motion.div
                      key={look.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      onClick={() => setShowLookDetail(look)}
                      className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                    >
                      <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                        <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                        <p className="text-white/50 text-[10px] font-inter">{look.priceRange}</p>
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
            {/* Social proof + affinity badge */}
            <div className="absolute -top-0.5 left-0 right-0 z-20 flex items-center justify-between px-1 pb-1">
              <motion.div
                key={`viewers-${currentLook.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream/80 backdrop-blur-sm border border-ink/5"
              >
                <Eye size={10} className="text-ink-muted" />
                <span className="text-[9px] font-inter text-ink-muted">
                  {viewerCount} exploring
                </span>
              </motion.div>
              {affinityMatch && (
                <motion.div
                  key={`match-${currentLook.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold/15 to-rose/15 border border-gold/20"
                >
                  <TrendingUp size={10} className="text-gold" />
                  <span className="text-[9px] font-inter font-semibold text-gold">{affinityMatch}</span>
                </motion.div>
              )}
            </div>
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

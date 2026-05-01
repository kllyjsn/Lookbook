import { useCallback, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, Dna, Eye, ChevronRight } from "lucide-react";
import { feedLooks, moodFilters, thisOrThatPairs } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore, tagToStyle } from "../stores/useStore";

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
  const swipeStreak = useStore((s) => s.swipeStreak);
  const updateStreak = useStore((s) => s.updateStreak);
  const thisOrThatPicks = useStore((s) => s.thisOrThatPicks);
  const pickThisOrThat = useStore((s) => s.pickThisOrThat);
  const [showSearch, setShowSearch] = useState(false);
  const [showOOTD, setShowOOTD] = useState(true);

  // Update streak on first swipe of the day
  useEffect(() => {
    if (currentFeedIndex > 0) updateStreak();
  }, [currentFeedIndex, updateStreak]);

  // Compute OOTD - best DNA-matched look the user hasn't seen
  const ootdLook = useMemo(() => {
    const scored = feedLooks.map((look) => {
      const lookStyles = new Set(look.tags.map((t) => tagToStyle[t.label]).filter(Boolean));
      const score = styleDNA.filter((d) => lookStyles.has(d.style)).reduce((s, d) => s + d.percentage, 0);
      return { look, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.look ?? feedLooks[0];
  }, [styleDNA]);

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
          {swipeStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose/10 to-gold/10 border border-rose/15"
            >
              <Flame size={12} className="text-rose" />
              <span className="text-[10px] font-inter font-bold text-rose">{swipeStreak}</span>
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

      {/* OOTD Banner */}
      {showOOTD && !hasSeenAll && currentFeedIndex === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-2 relative overflow-hidden rounded-xl"
        >
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-ink to-charcoal rounded-xl">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={ootdLook.image} alt="OOTD" className="img-editorial" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Dna size={10} className="text-gold" />
                <span className="text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-gold">
                  YOUR OOTD
                </span>
              </div>
              <p className="text-xs font-inter text-cream truncate">{ootdLook.title}</p>
              <p className="text-[10px] font-inter text-cream/50">{ootdLook.subtitle}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowLookDetail(ootdLook); setShowOOTD(false); }}
              className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0"
            >
              <ChevronRight size={14} className="text-gold" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowOOTD(false)}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"
            >
              <span className="text-white/60 text-[10px]">&times;</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Card stack area */}
      <div className="flex-1 relative px-4 pb-2">
        {hasSeenAll ? (
          <div className="w-full h-full overflow-y-auto pb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center pt-6 px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-4"
              >
                <Sparkles size={28} className="text-gold" />
              </motion.div>
              <h2 className="font-editorial text-xl text-ink text-center mb-1">
                You've seen today's edit.
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic text-center mb-4">
                {likedLooks.length > 0
                  ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""}. Great taste.`
                  : "Come back tomorrow for fresh picks."}
              </p>

              {/* This or That section */}
              <div className="w-full mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={14} className="text-ink" />
                  <h3 className="font-editorial text-lg text-ink">This or That</h3>
                </div>
                <div className="space-y-4">
                  {thisOrThatPairs.slice(0, 3).map((pair) => {
                    const picked = thisOrThatPicks[pair.id];
                    return (
                      <motion.div
                        key={pair.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted text-center">
                          {pair.theme}
                        </p>
                        <div className="flex gap-2">
                          {[pair.lookA, pair.lookB].map((look) => (
                            <motion.div
                              key={look.id}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => !picked && pickThisOrThat(pair.id, look.id)}
                              className={`relative flex-1 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer ${
                                picked
                                  ? picked === look.id
                                    ? "ring-2 ring-gold ring-offset-2 ring-offset-cream"
                                    : "opacity-40"
                                  : ""
                              }`}
                            >
                              <img src={look.image} alt={look.title} className="img-editorial" />
                              <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                                <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                                <p className="text-white/50 text-[10px] font-inter">{look.priceRange}</p>
                              </div>
                              {picked === look.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                                >
                                  <span className="text-white text-[10px] font-bold">MY PICK</span>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
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
          </div>
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

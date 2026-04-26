import { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { Logo } from "../components/ui/Logo";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
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

  const filteredLooks = useMemo(
    () =>
      activeMoodFilter === "all"
        ? feedLooks
        : feedLooks.filter((l) => l.mood === activeMoodFilter),
    [activeMoodFilter]
  );

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
      <div className="flex items-center justify-center py-3 px-6">
        <Logo variant="mark" size="sm" />
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
      </div>

      {/* Action buttons */}
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

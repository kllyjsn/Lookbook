import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { Camera, LayoutGrid, Rows3 } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { Look, MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";
import { IssueMasthead } from "../components/feed/IssueMasthead";
import { EndOfFeed } from "../components/feed/EndOfFeed";
import { ReelsFeed } from "../components/feed/ReelsFeed";
import { pickReasonFor } from "../data/editorialData";

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const setCurrentFeedIndex = useStore((s) => s.setCurrentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const loveLookNoAdvance = useStore((s) => s.loveLookNoAdvance);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const showLookDetailFocus = useStore((s) => s.showLookDetailFocus);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const activeMoodFilter = useStore((s) => s.activeMoodFilter);
  const setActiveMoodFilter = useStore((s) => s.setActiveMoodFilter);
  const undoLastSwipe = useStore((s) => s.undoLastSwipe);
  const lastSwipedLook = useStore((s) => s.lastSwipedLook);
  const likedLooks = useStore((s) => s.likedLooks);
  const styleDNA = useStore((s) => s.styleDNA);
  const budgetPreference = useStore((s) => s.budgetPreference);
  const feedMode = useStore((s) => s.feedMode);
  const setFeedMode = useStore((s) => s.setFeedMode);
  const streakDays = useStore((s) => s.streakDays);
  const streakHistory = useStore((s) => s.streakHistory);
  const reminderEnabled = useStore((s) => s.reminderEnabled);
  const setReminderEnabled = useStore((s) => s.setReminderEnabled);
  const trackView = useStore((s) => s.trackView);
  const [showSearch, setShowSearch] = useState(false);

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

  const topStyle = useMemo(() => {
    if (!styleDNA?.length) return null;
    const top = [...styleDNA].sort((a, b) => b.percentage - a.percentage)[0];
    return top && top.percentage > 0 ? top.style : null;
  }, [styleDNA]);

  const reasonFor = useCallback(
    (look: Look) => pickReasonFor(look, topStyle, budgetPreference),
    [topStyle, budgetPreference],
  );

  const isLiked = useCallback(
    (id: string) => likedLooks.some((l) => l.id === id),
    [likedLooks],
  );

  const reelsLikeLook = useCallback(
    (look: Look) => {
      // In Reels mode, "like" updates Style DNA but does not advance the
      // card-stack feed index — reels manages its own scroll position.
      loveLookNoAdvance(look);
    },
    [loveLookNoAdvance],
  );

  const handleSwipeRight = useCallback(() => {
    likeLook(currentLook);
  }, [currentLook, likeLook]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
  }, [currentLook, passLook]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
    trackView(currentLook);
  }, [currentLook, setShowLookDetail, trackView]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
    trackView(currentLook);
  }, [currentLook, setShowLookDetail, trackView]);

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
    trackView(currentLook);
  }, [currentLook, setShowLookDetail, trackView]);

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

  // Reels handlers
  const reelsOnSave = useCallback(
    (look: Look) => addToCollection("favorites", look),
    [addToCollection],
  );
  const reelsOnShop = useCallback(
    (look: Look) => {
      setShowLookDetail(look);
      trackView(look);
    },
    [setShowLookDetail, trackView],
  );
  const reelsOnComments = useCallback(
    (look: Look) => {
      setShowLookDetail(look, "comments");
      trackView(look);
    },
    [setShowLookDetail, trackView],
  );
  const reelsOnShare = useCallback(
    (look: Look) => {
      setShowLookDetail(look);
      trackView(look);
    },
    [setShowLookDetail, trackView],
  );
  const reelsOnView = useCallback(
    (look: Look) => trackView(look),
    [trackView],
  );

  const isReels = feedMode === "reels";

  return (
    <div className={`h-full flex flex-col ${isReels ? "bg-black" : "bg-cream"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between py-3 px-5 ${isReels ? "absolute top-0 inset-x-0 z-30" : ""}`}>
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-2">
          {!isReels && <IssueMasthead streakDays={streakDays} />}
          {isReels && streakDays > 0 && (
            <span className="text-[10px] font-inter font-semibold text-white drop-shadow tracking-[0.15em] uppercase">
              {streakDays}d streak
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setFeedMode(isReels ? "cards" : "reels")}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              isReels
                ? "border-white/20 bg-white/10 backdrop-blur-md"
                : "bg-ivory border-ink/10"
            }`}
            title={isReels ? "Switch to card stack" : "Switch to reels"}
          >
            {isReels ? (
              <LayoutGrid size={13} className="text-white" />
            ) : (
              <Rows3 size={13} className="text-ink" />
            )}
          </motion.button>
          {!isReels && !hasSeenAll && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 rounded-full bg-ivory border border-ink/10 flex items-center justify-center"
            >
              <Camera size={13} className="text-ink" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Reels mode — full-screen vertical snap-scroll */}
      {isReels ? (
        <div className="flex-1 relative pb-16">
          <ReelsFeed
            looks={filteredLooks}
            topStyle={topStyle}
            budgetPreference={budgetPreference}
            reasonFor={reasonFor}
            onLike={reelsLikeLook}
            onSave={reelsOnSave}
            onShop={reelsOnShop}
            onComments={reelsOnComments}
            onShare={reelsOnShare}
            onView={reelsOnView}
            isLiked={isLiked}
          />
        </div>
      ) : (
        <>
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
              <EndOfFeed
                likedCount={likedLooks.length}
                streakDays={streakDays}
                streakHistory={streakHistory}
                reminderEnabled={reminderEnabled}
                onToggleReminder={() => setReminderEnabled(!reminderEnabled)}
                onReplay={() => setCurrentFeedIndex(0)}
                onExplore={() => setActiveTab("community")}
                onOpenNotebook={() => setActiveTab("community")}
              />
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
                    pickReason={reasonFor(currentLook)}
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
        </>
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
            focus={showLookDetailFocus}
            onClose={() => setShowLookDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

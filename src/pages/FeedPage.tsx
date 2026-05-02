import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Shuffle, Flame } from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";
import {
  getIssueDateLabel,
  getIssueNumber,
  getTrendPulseForToday,
  rankLooksByDNA,
  seededShuffle,
} from "../data/editorial";

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
  const feedShuffleSeed = useStore((s) => s.feedShuffleSeed);
  const shuffleFeed = useStore((s) => s.shuffleFeed);
  const recordVisit = useStore((s) => s.recordVisit);
  const streakDays = useStore((s) => s.streakDays);
  const [showSearch, setShowSearch] = useState(false);

  // Mark today's visit when the feed mounts (TikTok-style daily streak).
  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  const issueNumber = useMemo(() => getIssueNumber(), []);
  const issueDateLabel = useMemo(() => getIssueDateLabel(), []);
  const trendPulse = useMemo(() => getTrendPulseForToday(), []);

  // Once the user has signal (>=3 liked looks), tune the feed order to
  // their Style DNA so the magazine feels like it knows them.
  const isTuned = likedLooks.length >= 3;

  const filteredLooks = useMemo(() => {
    const base =
      activeMoodFilter === "all"
        ? feedLooks
        : feedLooks.filter((l) => l.mood === activeMoodFilter);
    if (feedShuffleSeed > 0) {
      return seededShuffle(base, feedShuffleSeed);
    }
    if (isTuned) {
      return rankLooksByDNA(base, styleDNA);
    }
    return base;
  }, [activeMoodFilter, feedShuffleSeed, isTuned, styleDNA]);

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
      {/* Issue Cover masthead */}
      <div className="px-6 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <Logo variant="mark" size="sm" />
          <div className="flex items-center gap-3">
            {streakDays > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose/10 border border-rose/20"
                title={`${streakDays}-day streak`}
              >
                <Flame size={11} className="text-rose" fill="currentColor" />
                <span className="text-[10px] font-inter font-semibold text-rose">
                  {streakDays}
                </span>
              </motion.div>
            )}
            {!hasSeenAll && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(true)}
                className="w-8 h-8 rounded-full bg-ivory border border-ink/10 flex items-center justify-center"
                aria-label="Search the look"
              >
                <Camera size={14} className="text-ink" />
              </motion.button>
            )}
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <span className="text-masthead text-[10px] text-ink-muted">
              ISSUE {String(issueNumber).padStart(3, "0")}
            </span>
            <span className="text-masthead text-[10px] text-ink-muted/60 mx-2">·</span>
            <span className="text-masthead text-[10px] text-ink-muted">
              {issueDateLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
              {Math.min(currentFeedIndex + 1, filteredLooks.length || 1)} /{" "}
              {filteredLooks.length || feedLooks.length}
            </span>
            <div className="w-12 h-1 bg-ink/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    ((currentFeedIndex + 1) /
                      Math.max(filteredLooks.length, 1)) *
                      100,
                    100,
                  )}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
        <h1 className="font-editorial text-3xl text-ink leading-tight mt-1">
          Today's Edit
        </h1>
        {isTuned && feedShuffleSeed === 0 && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 mt-1 text-[10px] font-inter tracking-[0.15em] uppercase text-gold"
          >
            <Sparkles size={10} />
            Tuned to your taste
          </motion.span>
        )}
      </div>

      {/* Trend Pulse — rotating editorial line of the day */}
      <div className="px-6 pb-2">
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-ivory border border-ink/5">
          <span className="text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-gold flex-shrink-0">
            Trend Pulse
          </span>
          <span className="font-subhead text-xs text-ink-light italic truncate">
            {trendPulse}
          </span>
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
            {streakDays > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-rose/10 border border-rose/20"
              >
                <Flame size={14} className="text-rose" fill="currentColor" />
                <span className="text-xs font-inter font-medium text-rose">
                  {streakDays}-day streak — keep it lit
                </span>
              </motion.div>
            )}
            <div className="flex flex-col gap-3 w-full mt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => shuffleFeed()}
                className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                <Shuffle size={14} />
                Shuffle the Edit
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentFeedIndex(0)}
                className="w-full py-3 rounded-full border border-ink/15 text-ink-light font-inter text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} />
                Replay Today's Edit
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("community")}
                className="w-full py-3 rounded-full text-ink-muted font-inter text-sm"
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

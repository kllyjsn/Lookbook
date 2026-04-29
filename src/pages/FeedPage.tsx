import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Flame, Zap } from "lucide-react";
import { feedLooks, moodFilters, trendingStories, getDailyChallenge } from "../data/mockData";
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
  const swipeStreak = useStore((s) => s.swipeStreak);
  const recordSwipe = useStore((s) => s.recordSwipe);
  const showToast = useStore((s) => s.showToast);
  const [showSearch, setShowSearch] = useState(false);
  const [showChallenge, setShowChallenge] = useState(true);

  const challenge = useMemo(() => getDailyChallenge(), []);

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
    recordSwipe();
    showToast("Added to Loved", "like");
  }, [currentLook, likeLook, recordSwipe, showToast]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
    recordSwipe();
  }, [currentLook, passLook, recordSwipe]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleDoubleTap = useCallback(() => {
    likeLook(currentLook);
    recordSwipe();
    showToast("Added to Loved", "like");
  }, [currentLook, likeLook, recordSwipe, showToast]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
    recordSwipe();
    showToast("Added to Loved", "like");
  }, [currentLook, likeLook, recordSwipe, showToast]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
    recordSwipe();
  }, [currentLook, passLook, recordSwipe]);

  const handleButtonShop = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonSave = useCallback(() => {
    addToCollection("favorites", currentLook);
    showToast("Saved to Favorites", "save");
  }, [currentLook, addToCollection, showToast]);

  const handleMoodFilter = useCallback(
    (mood: MoodFilter) => {
      setActiveMoodFilter(mood);
    },
    [setActiveMoodFilter]
  );

  const handleStoryTap = useCallback(
    (lookId: string) => {
      const look = feedLooks.find((l) => l.id === lookId);
      if (look) setShowLookDetail(look);
    },
    [setShowLookDetail]
  );

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-3">
          {/* Swipe streak badge */}
          {swipeStreak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-gradient-to-r from-gold/20 to-rose/20 rounded-full px-2.5 py-1"
            >
              <Flame size={10} className="text-gold" fill="currentColor" />
              <span className="text-[10px] font-inter font-bold text-gold">{swipeStreak}</span>
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

      {/* Trending Stories carousel */}
      <div className="px-4 pb-2">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {trendingStories.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleStoryTap(story.lookId)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div className={`w-14 h-14 rounded-full p-0.5 ring-2 ${story.ring}`}>
                <img
                  src={story.image}
                  alt={story.label}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[9px] font-inter text-ink-muted truncate w-14 text-center">
                {story.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Style Challenge banner */}
      <AnimatePresence>
        {showChallenge && !hasSeenAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2 overflow-hidden"
          >
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-20 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${challenge.gradient} flex items-center justify-between px-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-inter font-bold">{challenge.title}</p>
                    <p className="text-white/70 text-[10px] font-inter">{challenge.subtitle} · {challenge.hashtag}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChallenge(false)}
                  className="text-white/50 text-lg leading-none"
                >
                  &times;
                </motion.button>
              </div>
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
            {swipeStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-gradient-to-r from-gold/10 to-rose/10 rounded-full px-4 py-2 mb-4"
              >
                <Flame size={14} className="text-gold" fill="currentColor" />
                <span className="text-xs font-inter font-semibold text-ink">
                  {swipeStreak}-day streak
                </span>
              </motion.div>
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
            key={showLookDetail.id}
            look={showLookDetail}
            onClose={() => setShowLookDetail(null)}
            onNavigate={(rec) => setShowLookDetail(rec)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

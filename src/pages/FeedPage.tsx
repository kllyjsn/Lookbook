import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import {
  RefreshCw, Sparkles, Camera, Flame, Swords, Crown,
  TrendingUp, ShoppingBag,
} from "lucide-react";
import { feedLooks, moodFilters } from "../data/mockData";
import type { MoodFilter, Look } from "../data/mockData";
import { useStore, sortByStyleMatch, computeStyleMatch } from "../stores/useStore";

/** "This or That" duel card pair */
function DuelMode({
  looks,
  onPick,
  onSkip,
}: {
  looks: [Look, Look];
  onPick: (winner: Look, loser: Look) => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-4 gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Swords size={14} className="text-gold" />
          <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold font-semibold">
            This or That
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSkip}
          className="text-[10px] font-inter text-ink-muted underline underline-offset-2"
        >
          Skip
        </motion.button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {looks.map((look, i) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(look, looks[1 - i])}
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
          >
            <img src={look.image} alt={look.title} className="img-editorial" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 gradient-bottom p-4">
              <h3 className="font-editorial text-lg text-white leading-tight">
                {look.title}
              </h3>
              <p className="text-[10px] font-inter text-white/60 mt-0.5">
                {look.priceRange}
              </p>
            </div>
            <div className="absolute top-3 left-3">
              <span className="text-[9px] font-inter font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-sm text-white rounded-full px-2.5 py-1">
                {i === 0 ? "THIS" : "THAT"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted pb-20">
        Tap the look you prefer
      </p>
    </div>
  );
}

/** Enhanced end-of-feed stats */
function EndOfFeedStats({
  likedLooks,
  passedLooks,
  onReplay,
  onCommunity,
  onCapsule,
  streak,
}: {
  likedLooks: Look[];
  passedLooks: Look[];
  onReplay: () => void;
  onCommunity: () => void;
  onCapsule: () => void;
  streak: number;
}) {
  const totalSwiped = likedLooks.length + passedLooks.length;
  const likeRate = totalSwiped > 0 ? Math.round((likedLooks.length / totalSwiped) * 100) : 0;

  const favBrand = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const look of likedLooks) {
      for (const item of look.items) {
        counts[item.brand] = (counts[item.brand] ?? 0) + 1;
      }
    }
    let top = "";
    let max = 0;
    for (const [brand, count] of Object.entries(counts)) {
      if (count > max) { max = count; top = brand; }
    }
    return top;
  }, [likedLooks]);

  const avgPrice = useMemo(() => {
    const prices = likedLooks.flatMap((l) => l.items.map((i) => i.price));
    if (prices.length === 0) return 0;
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }, [likedLooks]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-5"
      >
        <Crown size={32} className="text-gold" />
      </motion.div>

      <h2 className="font-editorial text-2xl text-ink text-center mb-1">
        Today's Edit: Complete
      </h2>
      <p className="font-subhead text-base text-ink-muted italic text-center mb-5">
        {likedLooks.length > 0
          ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""}. Impeccable taste.`
          : "Come back tomorrow for fresh curations."}
      </p>

      {/* Streak badge */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-blush/10 border border-gold/20 mb-5"
        >
          <Flame size={14} className="text-gold" />
          <span className="text-xs font-inter font-semibold text-ink">
            {streak} day streak
          </span>
        </motion.div>
      )}

      {/* Stats grid */}
      {totalSwiped > 0 && (
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="bg-ivory rounded-xl p-3 text-center">
            <p className="font-editorial text-xl text-ink">{likeRate}%</p>
            <p className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted mt-0.5">
              Like Rate
            </p>
          </div>
          <div className="bg-ivory rounded-xl p-3 text-center">
            <p className="font-editorial text-xl text-ink">${avgPrice}</p>
            <p className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted mt-0.5">
              Avg Price
            </p>
          </div>
          <div className="bg-ivory rounded-xl p-3 text-center">
            <p className="font-editorial text-xl text-ink truncate">{favBrand || "—"}</p>
            <p className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted mt-0.5">
              Top Brand
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReplay}
          className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Replay Today's Edit
        </motion.button>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onCommunity}
            className="py-3 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
          >
            <TrendingUp size={14} />
            Community
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onCapsule}
            className="py-3 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Build Capsule
          </motion.button>
        </div>
      </div>
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
  const duelMode = useStore((s) => s.duelMode);
  const toggleDuelMode = useStore((s) => s.toggleDuelMode);
  const [showSearch, setShowSearch] = useState(false);
  const [duelIndex, setDuelIndex] = useState(0);

  // Sort feed once when the component mounts or mood filter changes.
  // We use a version counter to avoid re-sorting on every styleDNA change (which happens on every like).
  const [feedVersion, setFeedVersion] = useState(0);
  const handleMoodFilterWithReset = useCallback(
    (mood: MoodFilter) => {
      setActiveMoodFilter(mood);
      setFeedVersion((v) => v + 1);
      setDuelIndex(0);
    },
    [setActiveMoodFilter]
  );

  const filteredLooks = useMemo(() => {
    const base =
      activeMoodFilter === "all"
        ? feedLooks
        : feedLooks.filter((l) => l.mood === activeMoodFilter);
    // Only sort by style DNA if user has liked something; checked via store snapshot
    // to avoid re-sorting mid-session (which would misalign currentFeedIndex).
    const snap = useStore.getState();
    return snap.likedLooks.length > 0 ? sortByStyleMatch(base, snap.styleDNA) : base;
    // feedVersion triggers re-sort only on filter change, not on every like
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMoodFilter, feedVersion]);

  const hasSeenAll = currentFeedIndex >= filteredLooks.length;

  const currentLook = useMemo(
    () => filteredLooks[currentFeedIndex % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );
  const nextLook = useMemo(
    () => filteredLooks[(currentFeedIndex + 1) % filteredLooks.length],
    [currentFeedIndex, filteredLooks]
  );

  const duelPairs = useMemo(() => {
    const pairs: [Look, Look][] = [];
    for (let i = 0; i < filteredLooks.length - 1; i += 2) {
      pairs.push([filteredLooks[i], filteredLooks[i + 1]]);
    }
    return pairs;
  }, [filteredLooks]);

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

  const handleMoodFilter = handleMoodFilterWithReset;

  const duelLikeLook = useStore((s) => s.duelLikeLook);
  const duelPassLook = useStore((s) => s.duelPassLook);

  const handleDuelPick = useCallback(
    (winner: Look, loser: Look) => {
      duelLikeLook(winner);
      duelPassLook(loser);
      setDuelIndex((i) => i + 1);
    },
    [duelLikeLook, duelPassLook]
  );

  const topMatch = useMemo(() => {
    if (likedLooks.length === 0 || filteredLooks.length === 0) return null;
    const score = computeStyleMatch(currentLook, styleDNA);
    return score >= 70 ? score : null;
  }, [currentLook, styleDNA, filteredLooks.length, likedLooks.length]);

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          {swipeStreak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20">
              <Flame size={10} className="text-gold" />
              <span className="text-[9px] font-inter font-semibold text-gold">
                {swipeStreak}
              </span>
            </div>
          )}
          <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
            {Math.min(currentFeedIndex + 1, filteredLooks.length)} / {filteredLooks.length}
          </span>
          <div className="w-16 h-1 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((currentFeedIndex + 1) / filteredLooks.length) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Duel mode toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { if (!duelMode) setDuelIndex(0); toggleDuelMode(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
              duelMode ? "bg-gold/10 border-gold/30" : "bg-ivory border-ink/10"
            }`}
          >
            <Swords size={14} className={duelMode ? "text-gold" : "text-ink"} />
          </motion.button>
          {!hasSeenAll && !duelMode && (
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

      {/* High match callout */}
      {topMatch && !hasSeenAll && !duelMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center gap-2"
        >
          <Sparkles size={12} className="text-gold" />
          <span className="text-[10px] font-inter font-semibold text-gold tracking-wide">
            {topMatch}% STYLE MATCH — CURATED FOR YOU
          </span>
        </motion.div>
      )}

      {/* Card stack area */}
      <div className="flex-1 relative px-4 pb-2">
        {duelMode ? (
          duelIndex < duelPairs.length ? (
            <DuelMode
              key={duelIndex}
              looks={duelPairs[duelIndex]}
              onPick={handleDuelPick}
              onSkip={() => setDuelIndex((i) => i + 1)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center px-8">
              <Swords size={32} className="text-gold mb-4" />
              <h2 className="font-editorial text-2xl text-ink text-center mb-2">
                All Duels Complete
              </h2>
              <p className="font-subhead text-base text-ink-muted italic text-center mb-4">
                Your preferences have been refined.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { toggleDuelMode(); setDuelIndex(0); }}
                className="py-3 px-8 rounded-full bg-ink text-cream font-inter text-sm font-medium"
              >
                Back to Feed
              </motion.button>
            </div>
          )
        ) : hasSeenAll ? (
          <EndOfFeedStats
            likedLooks={likedLooks}
            passedLooks={passedLooks}
            streak={swipeStreak}
            onReplay={() => setCurrentFeedIndex(0)}
            onCommunity={() => setActiveTab("community")}
            onCapsule={() => setActiveTab("capsule")}
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
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!hasSeenAll && !duelMode && (
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
            onNavigateToLook={setShowLookDetail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

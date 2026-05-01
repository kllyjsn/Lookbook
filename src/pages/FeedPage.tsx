import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { SearchPage } from "./SearchPage";
import { Logo } from "../components/ui/Logo";
import { RefreshCw, Sparkles, Camera, Clock, TrendingUp, Eye, Flame, Zap } from "lucide-react";
import { feedLooks, trendingAesthetics } from "../data/mockData";
import type { MoodFilter } from "../data/mockData";
import { useStore } from "../stores/useStore";

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function DailyDropCountdown() {
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minsLeft, setMinsLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(9, 0, 0, 0);
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      setHoursLeft(Math.floor(diff / 3600000));
      setMinsLeft(Math.floor((diff % 3600000) / 60000));
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-ink via-charcoal to-ink flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Zap size={12} className="text-gold" />
        <span className="text-[10px] font-inter font-bold tracking-[0.15em] uppercase text-gold">
          Next Drop
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock size={10} className="text-white/50" />
        <span className="text-[11px] font-inter font-semibold text-white/80 tabular-nums">
          {hoursLeft}h {minsLeft}m
        </span>
      </div>
      <span className="text-[9px] font-inter text-white/40 tracking-wider uppercase">
        Fresh looks incoming
      </span>
    </motion.div>
  );
}

function TrendingCarousel({
  selected,
  onSelect,
}: {
  selected: MoodFilter;
  onSelect: (mood: MoodFilter) => void;
}) {
  return (
    <div className="pb-2">
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 pb-1">
        {/* "All" pill */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect("all")}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-inter font-medium transition-all ${
            selected === "all"
              ? "bg-ink text-cream"
              : "bg-ivory text-ink-muted border border-ink/5"
          }`}
        >
          All Looks
        </motion.button>

        {/* Trending aesthetics with thumbnails */}
        {trendingAesthetics.map((aesthetic, i) => (
          <motion.button
            key={aesthetic.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(aesthetic.mood)}
            className={`flex-shrink-0 flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full transition-all ${
              selected === aesthetic.mood && selected !== "all"
                ? "bg-ink text-cream"
                : "bg-ivory border border-ink/5"
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={aesthetic.image}
                alt={aesthetic.label}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span
                className={`text-[10px] font-inter font-semibold leading-tight ${
                  selected === aesthetic.mood && selected !== "all"
                    ? "text-cream"
                    : "text-ink"
                }`}
              >
                {aesthetic.label}
              </span>
              <span
                className={`text-[8px] font-inter flex items-center gap-0.5 ${
                  selected === aesthetic.mood && selected !== "all"
                    ? "text-cream/60"
                    : "text-ink-muted"
                }`}
              >
                <Eye size={7} />
                {formatViews(aesthetic.views)}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StyleRecapScreen({
  onReplay,
  onExplore,
}: {
  onReplay: () => void;
  onExplore: () => void;
}) {
  const likedLooks = useStore((s) => s.likedLooks);
  const getStyleRecap = useStore((s) => s.getStyleRecap);
  const getStylePersonality = useStore((s) => s.getStylePersonality);
  const streakCount = useStore((s) => s.streakCount);
  const recap = getStyleRecap();
  const personality = getStylePersonality();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-start px-6 overflow-y-auto pb-24 pt-2"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-4"
      >
        <Sparkles size={28} className="text-gold" />
      </motion.div>

      <h2 className="font-editorial text-2xl text-ink text-center mb-1">
        Your Style Recap
      </h2>
      <p className="font-subhead text-base text-ink-muted italic text-center mb-6">
        {likedLooks.length > 0
          ? `You loved ${likedLooks.length} look${likedLooks.length > 1 ? "s" : ""} today.`
          : "Come back tomorrow for fresh picks."}
      </p>

      {/* Style Personality Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-5"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ink via-charcoal to-ink p-5">
          <div className="relative z-10">
            <span className="text-[9px] font-inter tracking-[0.25em] uppercase text-gold block mb-1">
              Your Style Personality
            </span>
            <p className="font-editorial text-2xl text-cream">{personality}</p>
          </div>
          {streakCount > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20">
              <Flame size={12} className="text-gold" />
              <span className="text-[10px] font-inter font-bold text-gold">
                {streakCount} day streak
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      {likedLooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 w-full mb-6"
        >
          {[
            { label: "Top Aesthetic", value: recap.topAesthetic, icon: TrendingUp },
            { label: "Avg. Price", value: recap.avgBudget, icon: Sparkles },
            { label: "Fav Brand", value: recap.topBrand, icon: Flame },
            { label: "Love Rate", value: `${recap.matchScore}%`, icon: Eye },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-ivory rounded-xl p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <stat.icon size={12} className="text-gold" />
                <span className="text-[9px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  {stat.label}
                </span>
              </div>
              <p className="font-editorial text-lg text-ink leading-tight truncate">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReplay}
          className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Replay Today's Edit
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onExplore}
          className="w-full py-3.5 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium"
        >
          Explore Community
        </motion.button>
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
  const recordSession = useStore((s) => s.recordSession);
  const streakCount = useStore((s) => s.streakCount);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    recordSession();
  }, [recordSession]);

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
          {streakCount > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10"
            >
              <Flame size={10} className="text-gold" />
              <span className="text-[9px] font-inter font-bold text-gold">
                {streakCount}
              </span>
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

      {/* Daily Drop Countdown */}
      {!hasSeenAll && <DailyDropCountdown />}

      {/* Trending Aesthetics Carousel */}
      <TrendingCarousel selected={activeMoodFilter} onSelect={handleMoodFilter} />

      {/* Card stack area */}
      <div className="flex-1 relative px-4 pb-2">
        {hasSeenAll ? (
          <StyleRecapScreen
            onReplay={() => setCurrentFeedIndex(0)}
            onExplore={() => setActiveTab("community")}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}

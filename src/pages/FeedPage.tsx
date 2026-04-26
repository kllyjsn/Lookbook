import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { Logo } from "../components/ui/Logo";
import { feedLooks } from "../data/mockData";
import { useStore } from "../stores/useStore";
import { RotateCcw, Sparkles, TrendingUp, RefreshCw } from "lucide-react";

function TodaysEditHeader() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 pb-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted">
            {day}
          </p>
          <h2 className="font-editorial text-lg text-ink leading-tight">
            Today's Edit
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5">
          <Sparkles size={12} className="text-gold" />
          <span className="text-[10px] font-inter font-medium text-ink-light">
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}

function SwipeTutorialHint({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 rounded-2xl"
      onClick={onDismiss}
    >
      <div className="text-center px-8">
        <motion.div
          animate={{ x: [0, 60, 0, -60, 0, 0, -40] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-white text-lg">👆</span>
        </motion.div>
        <p className="text-white font-inter text-sm font-medium mb-1">
          Swipe to discover
        </p>
        <div className="space-y-1">
          <p className="text-white/70 text-xs font-inter">
            → Right to <span className="text-green-400 font-medium">Love</span>
          </p>
          <p className="text-white/70 text-xs font-inter">
            ← Left to <span className="text-rose font-medium">Pass</span>
          </p>
          <p className="text-white/70 text-xs font-inter">
            ↑ Up to <span className="text-gold font-medium">Shop</span>
          </p>
          <p className="text-white/60 text-[10px] font-inter mt-2">
            Double-tap to quick-love
          </p>
        </div>
        <p className="text-white/40 text-[10px] font-inter mt-4">
          Tap anywhere to start
        </p>
      </div>
    </motion.div>
  );
}

function AllCaughtUp({ onRefresh }: { onRefresh: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-6"
      >
        <TrendingUp size={32} className="text-gold" />
      </motion.div>
      <h2 className="font-editorial text-2xl text-ink text-center mb-2">
        You're all caught up
      </h2>
      <p className="font-subhead text-base text-ink-muted italic text-center mb-1">
        You've seen every look in today's edit.
      </p>
      <p className="text-xs font-inter text-ink-muted text-center mb-8">
        New looks drop daily — check back tomorrow
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream text-sm font-inter font-medium"
      >
        <RefreshCw size={14} />
        See them again
      </motion.button>
    </motion.div>
  );
}

function DoubleTapHeart() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
    >
      <span className="text-6xl drop-shadow-lg">❤️</span>
    </motion.div>
  );
}

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const lastSwipedLook = useStore((s) => s.lastSwipedLook);
  const undoLastSwipe = useStore((s) => s.undoLastSwipe);
  const hasSeenSwipeTutorial = useStore((s) => s.hasSeenSwipeTutorial);
  const dismissSwipeTutorial = useStore((s) => s.dismissSwipeTutorial);
  const resetFeed = useStore((s) => s.resetFeed);

  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);

  const hasSeenAllLooks = currentFeedIndex >= feedLooks.length;

  const currentLook = useMemo(
    () => (hasSeenAllLooks ? null : feedLooks[currentFeedIndex]),
    [currentFeedIndex, hasSeenAllLooks]
  );
  const nextLook = useMemo(
    () =>
      hasSeenAllLooks
        ? null
        : feedLooks[(currentFeedIndex + 1) % feedLooks.length],
    [currentFeedIndex, hasSeenAllLooks]
  );

  const handleSwipeRight = useCallback(() => {
    if (currentLook) likeLook(currentLook);
  }, [currentLook, likeLook]);

  const handleSwipeLeft = useCallback(() => {
    if (currentLook) passLook(currentLook);
  }, [currentLook, passLook]);

  const handleSwipeUp = useCallback(() => {
    if (currentLook) setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleDoubleTap = useCallback(() => {
    if (currentLook) {
      setShowDoubleTapHeart(true);
      setTimeout(() => {
        likeLook(currentLook);
        setShowDoubleTapHeart(false);
      }, 400);
    }
  }, [currentLook, likeLook]);

  const handleTap = useCallback(() => {
    if (currentLook) setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonLike = useCallback(() => {
    if (currentLook) likeLook(currentLook);
  }, [currentLook, likeLook]);

  const handleButtonPass = useCallback(() => {
    if (currentLook) passLook(currentLook);
  }, [currentLook, passLook]);

  const handleButtonShop = useCallback(() => {
    if (currentLook) setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonSave = useCallback(() => {
    if (currentLook) {
      addToCollection("favorites", currentLook);
      setActiveTab("profile");
    }
  }, [currentLook, addToCollection, setActiveTab]);

  const handleRefresh = useCallback(() => {
    resetFeed();
  }, [resetFeed]);

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        {lastSwipedLook && !hasSeenAllLooks && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={undoLastSwipe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink/10 bg-cream hover:bg-ivory transition-colors"
          >
            <RotateCcw size={12} className="text-ink-muted" />
            <span className="text-[10px] font-inter font-medium text-ink-muted">
              Undo
            </span>
          </motion.button>
        )}
      </div>

      <TodaysEditHeader />

      {/* Card stack area */}
      <div className="flex-1 relative px-4 pb-2">
        <div className="relative w-full h-full max-w-md mx-auto">
          {hasSeenAllLooks ? (
            <AllCaughtUp onRefresh={handleRefresh} />
          ) : (
            <AnimatePresence>
              {/* Background card (next) */}
              {nextLook && currentFeedIndex + 1 < feedLooks.length && (
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
              )}
              {/* Top card (current) */}
              {currentLook && (
                <SwipeCard
                  key={`fg-${currentLook.id}-${currentFeedIndex}`}
                  look={currentLook}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeUp={handleSwipeUp}
                  onTap={handleTap}
                  onDoubleTap={handleDoubleTap}
                  isTop={true}
                  cardIndex={currentFeedIndex}
                  totalCards={feedLooks.length}
                />
              )}
            </AnimatePresence>
          )}

          {/* Swipe tutorial overlay */}
          <AnimatePresence>
            {!hasSeenSwipeTutorial && !hasSeenAllLooks && (
              <SwipeTutorialHint onDismiss={dismissSwipeTutorial} />
            )}
          </AnimatePresence>

          {/* Double-tap heart animation */}
          <AnimatePresence>
            {showDoubleTapHeart && <DoubleTapHeart />}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      {!hasSeenAllLooks && (
        <div className="pb-20 px-4">
          <SwipeButtons
            onPass={handleButtonPass}
            onLike={handleButtonLike}
            onShop={handleButtonShop}
            onSave={handleButtonSave}
          />
          <p className="text-center text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mt-1">
            {currentFeedIndex + 1} of {feedLooks.length} ·{" "}
            Swipe right to love · Left to pass · Up to shop
          </p>
        </div>
      )}

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

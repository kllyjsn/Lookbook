import { useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { HeartBurst } from "../components/ui/HeartBurst";
import { Logo } from "../components/ui/Logo";
import { feedLooks } from "../data/mockData";
import { useStore } from "../stores/useStore";

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const dailyStreak = useStore((s) => s.dailyStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const showHeartBurst = useStore((s) => s.showHeartBurst);
  const setShowHeartBurst = useStore((s) => s.setShowHeartBurst);
  const checkStreak = useStore((s) => s.checkStreak);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  const currentLook = useMemo(
    () => feedLooks[currentFeedIndex % feedLooks.length],
    [currentFeedIndex]
  );
  const nextLook = useMemo(
    () => feedLooks[(currentFeedIndex + 1) % feedLooks.length],
    [currentFeedIndex]
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

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header with streak + stats */}
      <div className="flex items-center justify-between py-3 px-5">
        <div className="flex items-center gap-2">
          <Logo variant="mark" size="sm" />
          {dailyStreak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-rose px-2.5 py-1 rounded-full"
            >
              <Flame size={12} className="text-white" />
              <span className="text-white text-[10px] font-inter font-bold">{dailyStreak}</span>
            </motion.div>
          )}
        </div>
        {totalSwipes > 0 && (
          <motion.span
            key={totalSwipes}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10px] font-inter text-ink-muted tracking-wider"
          >
            {totalSwipes} discovered
          </motion.span>
        )}
      </div>

      {/* New Drops banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mb-2 py-2 px-4 rounded-xl bg-gradient-to-r from-ink to-ink/80 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
          </span>
          <span className="text-cream text-[11px] font-inter font-medium tracking-wide">
            New drops just landed
          </span>
        </div>
        <span className="text-gold text-[10px] font-inter font-semibold tracking-wider uppercase">
          Fresh today
        </span>
      </motion.div>

      {/* Card stack area */}
      <div className="flex-1 relative px-3 mb-[100px]">
        <div className="relative w-full h-full">
          <AnimatePresence>
            {/* Background card (next) */}
            <SwipeCard
              key={`bg-${nextLook.id}-${currentFeedIndex}`}
              look={nextLook}
              onSwipeRight={() => {}}
              onSwipeLeft={() => {}}
              onSwipeUp={() => {}}
              onTap={() => {}}
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
              isTop={true}
            />
          </AnimatePresence>

          {/* Heart burst overlay */}
          <HeartBurst
            show={showHeartBurst}
            onComplete={() => setShowHeartBurst(false)}
          />
        </div>
      </div>

      {/* Action buttons — fixed above tab bar */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 max-w-lg mx-auto px-4">
        <SwipeButtons
          onPass={handleButtonPass}
          onLike={handleButtonLike}
          onShop={handleButtonShop}
          onSave={handleButtonSave}
        />
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

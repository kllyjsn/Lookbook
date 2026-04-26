import { useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { HeartBurst } from "../components/ui/HeartBurst";
import { feedLooks } from "../data/mockData";
import { useStore } from "../stores/useStore";

export function FeedPage() {
  const currentFeedIndex = useStore((s) => s.currentFeedIndex);
  const likeLook = useStore((s) => s.likeLook);
  const passLook = useStore((s) => s.passLook);
  const advanceFeed = useStore((s) => s.advanceFeed);
  const addToCollection = useStore((s) => s.addToCollection);
  const showLookDetail = useStore((s) => s.showLookDetail);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const dailyStreak = useStore((s) => s.dailyStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const heartBurstKey = useStore((s) => s.heartBurstKey);
  const triggerHeartBurst = useStore((s) => s.triggerHeartBurst);
  const clearHeartBurst = useStore((s) => s.clearHeartBurst);
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
    advanceFeed();
    triggerHeartBurst();
  }, [currentLook, likeLook, advanceFeed, triggerHeartBurst]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
    advanceFeed();
  }, [currentLook, passLook, advanceFeed]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
    advanceFeed();
  }, [currentLook, setShowLookDetail, advanceFeed]);

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
    advanceFeed();
    triggerHeartBurst();
  }, [currentLook, likeLook, advanceFeed, triggerHeartBurst]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
    advanceFeed();
  }, [currentLook, passLook, advanceFeed]);

  const handleButtonShop = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonSave = useCallback(() => {
    addToCollection("favorites", currentLook);
    setActiveTab("profile");
  }, [currentLook, addToCollection, setActiveTab]);

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header masthead */}
      <div className="flex items-center justify-between py-3 px-5">
        <h1 className="text-masthead text-[15px]">LOOKBOOK</h1>
        <div className="flex items-center gap-3">
          {dailyStreak > 1 && (
            <div className="flex items-center gap-1">
              <Flame size={12} className="text-gold" />
              <span className="text-[10px] font-inter font-semibold text-ink">{dailyStreak}</span>
            </div>
          )}
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
      </div>

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
            burstKey={heartBurstKey}
            onComplete={clearHeartBurst}
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

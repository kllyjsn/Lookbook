import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons } from "../components/cards/SwipeCard";
import { LookDetail } from "../components/cards/LookDetail";
import { Logo } from "../components/ui/Logo";
import { TrendingBar } from "../components/feed/TrendingBar";
import { DoubleTapHeart } from "../components/feed/DoubleTapHeart";
import { SwipeStreak } from "../components/feed/SwipeStreak";
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
  const likedLooks = useStore((s) => s.likedLooks);

  const [doubleTapPos, setDoubleTapPos] = useState<{ x: number; y: number } | null>(null);
  const [streak, setStreak] = useState(0);
  const doubleTapTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (doubleTapTimerRef.current) clearTimeout(doubleTapTimerRef.current);
    };
  }, []);

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
    setStreak((s) => s + 1);
  }, [currentLook, likeLook]);

  const handleSwipeLeft = useCallback(() => {
    passLook(currentLook);
    setStreak(0);
  }, [currentLook, passLook]);

  const handleSwipeUp = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleDoubleTap = useCallback(
    (x: number, y: number) => {
      if (doubleTapTimerRef.current) clearTimeout(doubleTapTimerRef.current);
      setDoubleTapPos({ x, y });
      likeLook(currentLook);
      setStreak((s) => s + 1);
      doubleTapTimerRef.current = setTimeout(() => setDoubleTapPos(null), 800);
    },
    [currentLook, likeLook]
  );

  const handleTap = useCallback(() => {
    setShowLookDetail(currentLook);
  }, [currentLook, setShowLookDetail]);

  const handleButtonLike = useCallback(() => {
    likeLook(currentLook);
    setStreak((s) => s + 1);
  }, [currentLook, likeLook]);

  const handleButtonPass = useCallback(() => {
    passLook(currentLook);
    setStreak(0);
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
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6">
        <Logo variant="mark" size="sm" />
        <div className="flex items-center gap-3">
          {streak >= 3 && <SwipeStreak count={streak} />}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory">
            <span className="text-[10px] font-inter font-medium text-ink-muted">
              {likedLooks.length} loved
            </span>
          </div>
        </div>
      </div>

      {/* Trending tags */}
      <TrendingBar />

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

          {/* Double-tap heart overlay */}
          <AnimatePresence>
            {doubleTapPos && (
              <DoubleTapHeart x={doubleTapPos.x} y={doubleTapPos.y} />
            )}
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
        />
        <p className="text-center text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mt-1">
          Swipe right to love · Left to pass · Tap to shop
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

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence, type PanInfo } from "framer-motion";
import { Heart, X, ShoppingBag, Bookmark, TrendingUp, Award, Zap, Undo2, Flame } from "lucide-react";
import type { Look } from "../../data/mockData";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const badgeConfig = {
  "trending": { label: "TRENDING", icon: TrendingUp, bg: "bg-rose/90", text: "text-white" },
  "editors-pick": { label: "EDITOR'S PICK", icon: Award, bg: "bg-gold/90", text: "text-white" },
  "new": { label: "NEW", icon: Zap, bg: "bg-ink/80", text: "text-cream" },
} as const;

interface SwipeCardProps {
  look: Look;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  onTap: () => void;
  onDoubleTap: () => void;
  isTop: boolean;
}

export function SwipeCard({
  look,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onTap,
  onDoubleTap,
  isTop,
}: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | "up" | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const doubleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doubleTapDetectedRef = useRef(false);
  const swipedRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const shopOpacity = useTransform(y, [-80, 0], [1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  useEffect(() => {
    return () => {
      if (doubleTapTimerRef.current) clearTimeout(doubleTapTimerRef.current);
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    };
  }, []);

  const cancelPendingTimers = useCallback(() => {
    if (doubleTapTimerRef.current) {
      clearTimeout(doubleTapTimerRef.current);
      doubleTapTimerRef.current = null;
    }
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    setShowHeartBurst(false);
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocity = 0.5;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      swipedRef.current = true;
      cancelPendingTimers();
      setExitDirection("up");
      animate(y, -1000, { duration: 0.3 });
      setTimeout(onSwipeUp, 300);
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      swipedRef.current = true;
      cancelPendingTimers();
      setExitDirection("right");
      animate(x, 1000, { duration: 0.3 });
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      swipedRef.current = true;
      cancelPendingTimers();
      setExitDirection("left");
      animate(x, -1000, { duration: 0.3 });
      setTimeout(onSwipeLeft, 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  const handleClick = useCallback(() => {
    if (Math.abs(x.get()) > 5 || Math.abs(y.get()) > 5) return;
    if (swipedRef.current) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      doubleTapDetectedRef.current = true;
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      setShowHeartBurst(true);
      doubleTapTimerRef.current = setTimeout(() => {
        doubleTapTimerRef.current = null;
        if (!swipedRef.current) {
          setShowHeartBurst(false);
          onDoubleTap();
        }
        doubleTapDetectedRef.current = false;
      }, 700);
    } else {
      doubleTapDetectedRef.current = false;
      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        if (!doubleTapDetectedRef.current && !swipedRef.current) {
          onTap();
        }
      }, 300);
    }
    lastTapRef.current = now;
  }, [onTap, onDoubleTap, x, y]);

  if (exitDirection) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 no-select ${isTop ? "z-10" : "z-0"}`}
      style={{ x, y, rotate, scale }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={isTop ? { scale: 0.97, opacity: 0.8 } : { scale: 0.93, opacity: 0.5 }}
      animate={isTop ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.7 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden card-shadow bg-charcoal">
        {/* Skeleton loading state */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        {/* Image */}
        <img
          src={look.image}
          alt={look.title}
          className={`img-editorial transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          draggable={false}
        />

        {/* Top gradient + magazine masthead */}
        <div className="absolute inset-x-0 top-0 gradient-top p-6 pt-8">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px] font-inter tracking-[0.3em] uppercase">
              {look.season}
            </span>
            <div className="flex items-center gap-2">
              {look.trending && (
                <span className="trending-badge flex items-center gap-1 text-[9px] font-inter font-semibold tracking-[0.1em] uppercase bg-white/20 backdrop-blur-sm text-white rounded-full px-2.5 py-1">
                  <TrendingUp size={10} />
                  Trending
                </span>
              )}
              {look.editorsChoice && (
                <span className="text-[9px] font-inter font-semibold tracking-[0.1em] uppercase bg-gold/90 text-white rounded-full px-2.5 py-1">
                  Editor's Pick
                </span>
              )}
              {look.badge && (() => {
                const badge = badgeConfig[look.badge];
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${badge.bg} backdrop-blur-sm`}
                  >
                    <BadgeIcon size={10} className={badge.text} />
                    <span className={`text-[9px] font-inter font-semibold tracking-wider ${badge.text}`}>
                      {badge.label}
                    </span>
                  </motion.div>
                );
              })()}
              <span className="text-white/60 text-[10px] font-inter tracking-[0.3em] uppercase">
                {look.occasion}
              </span>
            </div>
          </div>
          {/* Trend velocity indicator */}
          {look.trendVelocity && look.trendVelocity >= 400 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-16 right-4"
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                <Flame size={10} className="text-rose" />
                <span className="text-[9px] font-inter font-semibold text-white">
                  +{look.trendVelocity}%
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom gradient + content */}
        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6 pb-8">
          <div className="space-y-3">
            <div className="flex gap-2">
              {look.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/70 border border-white/20 rounded-full px-3 py-1"
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <h2 className="font-editorial text-3xl text-white leading-tight">
              {look.title}
            </h2>
            <p className="font-subhead text-base text-white/80 italic">
              {look.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1 text-xs font-inter text-white/60">
                <Heart size={12} fill="currentColor" />
                {formatCount(look.likes)}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-inter text-white/50">
                {look.priceRange}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-inter text-white/50">
                {look.items.length} pieces
              </span>
            </div>
          </div>
        </div>

        {/* LIKE stamp */}
        <motion.div
          className="absolute top-20 left-6 pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <div className="border-4 border-green-400 rounded-lg px-4 py-2 -rotate-12">
            <span className="text-green-400 text-3xl font-editorial font-bold tracking-wider">
              LOVE
            </span>
          </div>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          className="absolute top-20 right-6 pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <div className="border-4 border-rose rounded-lg px-4 py-2 rotate-12">
            <span className="text-rose text-3xl font-editorial font-bold tracking-wider">
              PASS
            </span>
          </div>
        </motion.div>

        {/* SHOP stamp */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: shopOpacity }}
        >
          <div className="border-4 border-gold rounded-lg px-6 py-3">
            <span className="text-gold text-2xl font-editorial font-bold tracking-wider">
              SHOP
            </span>
          </div>
        </motion.div>

        {/* Double-tap heart burst animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart size={80} className="text-white drop-shadow-lg" fill="white" strokeWidth={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onShop: () => void;
  onSave: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function SwipeButtons({ onPass, onLike, onShop, onSave, onUndo, canUndo }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <AnimatePresence>
        {canUndo && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onUndo}
            className="w-10 h-10 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream hover:border-lavender/40 hover:bg-lavender/5 transition-colors"
          >
            <Undo2 size={14} className="text-ink-muted" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPass}
        className="w-14 h-14 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream hover:border-rose/40 hover:bg-rose/5 transition-colors"
      >
        <X size={22} className="text-ink-muted" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onShop}
        className="w-12 h-12 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream hover:border-gold/40 hover:bg-gold/5 transition-colors"
      >
        <ShoppingBag size={18} className="text-ink-muted" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        className="w-14 h-14 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream hover:border-rose/40 hover:bg-rose/5 transition-colors"
      >
        <Heart size={22} className="text-ink-muted" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSave}
        className="w-12 h-12 rounded-full border-2 border-ink/10 flex items-center justify-center bg-cream hover:border-gold/40 hover:bg-gold/5 transition-colors"
      >
        <Bookmark size={18} className="text-ink-muted" />
      </motion.button>
    </div>
  );
}

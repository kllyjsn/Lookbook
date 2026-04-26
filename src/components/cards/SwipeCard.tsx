import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { Heart, X, ShoppingBag, Bookmark, TrendingUp, Award, Zap } from "lucide-react";
import type { Look } from "../../data/mockData";

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
  cardIndex?: number;
  totalCards?: number;
}


export function SwipeCard({
  look,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onTap,
  onDoubleTap,
  isTop,
  cardIndex,
  totalCards,
}: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | "up" | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const shopOpacity = useTransform(y, [-80, 0], [1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocity = 0.5;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      setExitDirection("up");
      animate(y, -1000, { duration: 0.3 });
      setTimeout(onSwipeUp, 300);
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      setExitDirection("right");
      animate(x, 1000, { duration: 0.3 });
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      setExitDirection("left");
      animate(x, -1000, { duration: 0.3 });
      setTimeout(onSwipeLeft, 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  const handleClick = () => {
    if (Math.abs(x.get()) < 5 && Math.abs(y.get()) < 5) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        onDoubleTap();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
        tapTimeoutRef.current = setTimeout(() => {
          if (lastTapRef.current !== 0) {
            onTap();
            lastTapRef.current = 0;
          }
        }, 300);
      }
    }
  };

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
        {/* Shimmer skeleton */}
        {!imgLoaded && <div className="absolute inset-0 shimmer-loading" />}

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
            {!look.badge && (
              <span className="text-white/60 text-[10px] font-inter tracking-[0.3em] uppercase">
                {look.occasion}
              </span>
            )}
          </div>
        </div>

        {/* Card progress indicator */}
        {isTop && cardIndex !== undefined && totalCards !== undefined && (
          <div className="absolute top-[52px] left-6 right-6 flex gap-1">
            {Array.from({ length: Math.min(totalCards, 12) }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors ${
                  i <= cardIndex ? "bg-white/60" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        )}

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
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onShop: () => void;
  onSave: () => void;
}

export function SwipeButtons({ onPass, onLike, onShop, onSave }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-5 py-4">
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

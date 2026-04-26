import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { Heart, X, ShoppingBag, Bookmark, TrendingUp, Flame, Zap } from "lucide-react";
import type { Look } from "../../data/mockData";


interface SwipeCardProps {
  look: Look;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  onTap: () => void;
  isTop: boolean;
}

export function SwipeCard({
  look,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onTap,
  isTop,
}: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | "up" | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const shopOpacity = useTransform(y, [-80, 0], [1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  const isDragging = useRef(false);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 60;
    const velocityThreshold = 300;

    if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
      setExitDirection("up");
      animate(y, -1000, { duration: 0.3 });
      setTimeout(onSwipeUp, 300);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitDirection("right");
      animate(x, 1000, { duration: 0.3 });
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitDirection("left");
      animate(x, -1000, { duration: 0.3 });
      setTimeout(onSwipeLeft, 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
    setTimeout(() => { isDragging.current = false; }, 50);
  }, [x, y, onSwipeUp, onSwipeRight, onSwipeLeft]);

  if (exitDirection) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 no-select ${isTop ? "z-10" : "z-0"}`}
      style={{ x, y, rotate, scale, touchAction: "none" }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={isTop ? { scale: 0.97, opacity: 0.8 } : { scale: 0.93, opacity: 0.5 }}
      animate={isTop ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.7 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (!isDragging.current && Math.abs(x.get()) < 5 && Math.abs(y.get()) < 5) {
          onTap();
        }
      }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden card-shadow bg-charcoal">
        {/* Image */}
        <img
          src={look.image}
          alt={look.title}
          className={`img-editorial transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          draggable={false}
        />

        {/* Top gradient + badges */}
        <div className="absolute inset-x-0 top-0 gradient-top p-5 pt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {look.isNew && (
                <span className="bg-gold/90 text-white text-[9px] font-inter font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} /> NEW
                </span>
              )}
              {look.isTrending && (
                <span className="bg-rose/80 text-white text-[9px] font-inter font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={10} /> HOT
                </span>
              )}
              {look.scarcityLabel && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-inter font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Flame size={10} /> {look.scarcityLabel}
                </span>
              )}
            </div>
            {/* Match percentage */}
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <div className="relative w-5 h-5">
                <svg viewBox="0 0 36 36" className="w-5 h-5 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#C5A572" strokeWidth="3"
                    strokeDasharray={`${look.matchPercent * 0.94} 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-white text-[11px] font-inter font-semibold">{look.matchPercent}%</span>
            </div>
          </div>
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
              <span className="text-xs font-inter text-white/50">
                {look.priceRange}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-inter text-white/50">
                {look.items.length} pieces
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-inter text-white/50 flex items-center gap-1">
                <Heart size={10} fill="currentColor" /> {look.saves >= 1000 ? `${(look.saves / 1000).toFixed(1)}k` : look.saves}
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

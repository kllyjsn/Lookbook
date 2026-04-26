import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { Heart, X, ShoppingBag, Bookmark, Award, TrendingUp, Flame } from "lucide-react";
import type { Look } from "../../data/mockData";


interface SwipeCardProps {
  look: Look;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  onTap: () => void;
  isTop: boolean;
}

function BadgeLabel({ badge }: { badge: NonNullable<Look["badge"]> }) {
  const config = {
    "editors-pick": { label: "Editor's Pick", Icon: Award, bg: "bg-gold/90", text: "text-white" },
    trending: { label: "Trending", Icon: TrendingUp, bg: "bg-rose/90", text: "text-white" },
    new: { label: "Just In", Icon: Flame, bg: "bg-white/90", text: "text-ink" },
  };
  const { label, Icon, bg, text } = config[badge];
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg} backdrop-blur-sm`}>
      <Icon size={12} className={text} />
      <span className={`text-[10px] font-inter font-semibold tracking-wide uppercase ${text}`}>
        {label}
      </span>
    </div>
  );
}

function HeartBurst({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x - 40, top: y - 40 }}
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Heart size={80} className="text-rose" fill="currentColor" strokeWidth={0} />
    </motion.div>
  );
}

interface ConfettiProps {
  delay: number;
  angle: number;
  color: string;
  distance: number;
  size: number;
  rotation: number;
  durationExtra: number;
}

function ConfettiParticle({ delay, angle, color, distance, size, rotation, durationExtra }: ConfettiProps) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: "50%",
        top: "40%",
      }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: 0,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30,
        scale: 0,
        rotate: rotation,
      }}
      transition={{ duration: 0.7 + durationExtra, delay, ease: "easeOut" }}
    />
  );
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
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const singleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      pendingTimeouts.current.delete(id);
      fn();
    }, ms);
    pendingTimeouts.current.add(id);
    return id;
  }, []);

  useEffect(() => {
    const timeouts = pendingTimeouts.current;
    return () => {
      if (singleTapTimeoutRef.current) clearTimeout(singleTapTimeoutRef.current);
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const shopOpacity = useTransform(y, [-80, 0], [1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    safeTimeout(() => setShowConfetti(false), 1200);
  }, [safeTimeout]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocity = 0.5;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      setExitDirection("up");
      animate(y, -1000, { duration: 0.3 });
      safeTimeout(onSwipeUp, 300);
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      triggerConfetti();
      animate(x, 1000, { duration: 0.4 });
      safeTimeout(() => setExitDirection("right"), 400);
      safeTimeout(onSwipeRight, 400);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      setExitDirection("left");
      animate(x, -1000, { duration: 0.3 });
      safeTimeout(onSwipeLeft, 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (Math.abs(x.get()) > 5 || Math.abs(y.get()) > 5) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double-tap → cancel pending single-tap and like
      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = null;
      }
      lastTapRef.current = 0;
      setDoubleTapHeart({ x: e.clientX, y: e.clientY });
      triggerConfetti();
      safeTimeout(() => setDoubleTapHeart(null), 800);
      safeTimeout(onSwipeRight, 400);
    } else {
      // Single tap → open detail (delayed to check for double)
      lastTapRef.current = now;
      singleTapTimeoutRef.current = setTimeout(() => {
        singleTapTimeoutRef.current = null;
        if (Date.now() - lastTapRef.current >= 280) {
          onTap();
        }
      }, 300);
    }
  };

  const confettiData = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: (i / 16) * Math.PI * 2,
        color: ["#C5A572", "#C4797A", "#B8A9C9", "#A8B5A0", "#E8D5D0"][i % 5],
        distance: 80 + ((i * 37) % 120),
        size: 4 + ((i * 13) % 6),
        rotation: (i * 73) % 360,
        durationExtra: ((i * 29) % 40) / 100,
      })),
    []
  );

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
            {look.badge ? (
              <BadgeLabel badge={look.badge} />
            ) : (
              <span className="text-white/60 text-[10px] font-inter tracking-[0.3em] uppercase">
                {look.occasion}
              </span>
            )}
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
              {look.trendScore != null && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-xs font-inter text-gold/80 flex items-center gap-1">
                    <TrendingUp size={10} />
                    {look.trendScore}% match
                  </span>
                </>
              )}
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

        {/* Confetti on like */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confettiData.map((particle, i) => (
              <ConfettiParticle
                key={i}
                delay={i * 0.02}
                angle={particle.angle}
                color={particle.color}
                distance={particle.distance}
                size={particle.size}
                rotation={particle.rotation}
                durationExtra={particle.durationExtra}
              />
            ))}
          </div>
        )}
      </div>

      {/* Double-tap heart burst — rendered via portal so it survives card unmount */}
      {doubleTapHeart && createPortal(
        <HeartBurst x={doubleTapHeart.x} y={doubleTapHeart.y} />,
        document.body
      )}
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

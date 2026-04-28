import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, DollarSign, TrendingUp, Flame, Shirt, Eye } from "lucide-react";
import { useStore } from "../../stores/useStore";

function formatPrice(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export function WeeklyStyleReport() {
  const likedLooks = useStore((s) => s.likedLooks);
  const passedLooks = useStore((s) => s.passedLooks);
  const styleDNA = useStore((s) => s.styleDNA);
  const collections = useStore((s) => s.collections);

  const totalSwiped = likedLooks.length + passedLooks.length;
  const likeRate = totalSwiped > 0 ? Math.round((likedLooks.length / totalSwiped) * 100) : 0;

  const wardrobeValue = useMemo(() => {
    return likedLooks.reduce((sum, look) => {
      const avgPrice = look.items.reduce((s, item) => s + item.price, 0);
      return sum + avgPrice;
    }, 0);
  }, [likedLooks]);

  const topStyle = useMemo(() => {
    const sorted = [...styleDNA].sort((a, b) => b.percentage - a.percentage);
    return sorted[0]?.style ?? "Exploring";
  }, [styleDNA]);

  const avgPricePoint = useMemo(() => {
    if (likedLooks.length === 0) return 0;
    const allPrices = likedLooks.flatMap((l) => l.items.map((i) => i.price));
    return Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
  }, [likedLooks]);

  const savedCount = collections.reduce((sum, c) => sum + c.looks.length, 0);

  const stats = [
    { icon: Eye, label: "Looks Seen", value: String(totalSwiped), color: "text-ink" },
    { icon: Heart, label: "Like Rate", value: `${likeRate}%`, color: "text-rose" },
    { icon: DollarSign, label: "Avg Price", value: formatPrice(avgPricePoint), color: "text-gold" },
    { icon: Shirt, label: "Saved", value: String(savedCount), color: "text-lavender" },
  ];

  if (totalSwiped === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} className="text-rose" />
        <h3 className="font-editorial text-lg text-ink">Your Week in Style</h3>
      </div>

      {/* Hero stat */}
      <div className="rounded-2xl bg-gradient-to-br from-ink to-charcoal p-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} className="text-gold" />
          <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/50">
            DOMINANT STYLE
          </span>
        </div>
        <h4 className="font-editorial text-3xl text-white mb-1">{topStyle}</h4>
        <p className="text-xs font-inter text-white/40">
          {wardrobeValue > 0 && `${formatPrice(wardrobeValue)} wardrobe value · `}
          {likedLooks.length} looks loved
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-ivory rounded-xl p-3.5 flex items-center gap-3"
          >
            <stat.icon size={18} className={stat.color} />
            <div>
              <p className="text-lg font-editorial text-ink leading-none">{stat.value}</p>
              <p className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted mt-0.5">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

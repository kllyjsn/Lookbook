import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Heart, ShoppingBag, Palette, TrendingUp } from "lucide-react";
import type { Look } from "../../data/mockData";

interface WeeklyRecapProps {
  likedLooks: Look[];
  passedLooks: Look[];
}

export function WeeklyRecap({ likedLooks, passedLooks }: WeeklyRecapProps) {
  const stats = useMemo(() => {
    const totalSwipes = likedLooks.length + passedLooks.length;
    const likeRate = totalSwipes > 0 ? Math.round((likedLooks.length / totalSwipes) * 100) : 0;

    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    let totalSpend = 0;

    for (const look of likedLooks) {
      for (const item of look.items) {
        brandCounts[item.brand] = (brandCounts[item.brand] ?? 0) + 1;
        categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
        totalSpend += item.price;
      }
    }

    const topBrand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0];
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    const avgLookPrice = likedLooks.length > 0
      ? Math.round(totalSpend / likedLooks.length)
      : 0;

    const moodCounts: Record<string, number> = {};
    for (const look of likedLooks) {
      moodCounts[look.mood] = (moodCounts[look.mood] ?? 0) + 1;
    }
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    return { totalSwipes, likeRate, topBrand, topCategory, avgLookPrice, topMood };
  }, [likedLooks, passedLooks]);

  if (stats.totalSwipes < 3) return null;

  const recapItems = [
    {
      icon: Heart,
      label: "Love Rate",
      value: `${stats.likeRate}%`,
      detail: `${likedLooks.length} of ${stats.totalSwipes} looks`,
      color: "text-rose",
      bg: "bg-rose/10",
    },
    {
      icon: ShoppingBag,
      label: "Avg. Look Price",
      value: `$${stats.avgLookPrice.toLocaleString()}`,
      detail: "across loved looks",
      color: "text-gold",
      bg: "bg-gold/10",
    },
    ...(stats.topBrand
      ? [{
          icon: TrendingUp,
          label: "Top Brand",
          value: stats.topBrand[0],
          detail: `appeared ${stats.topBrand[1]}x in your likes`,
          color: "text-ink" as const,
          bg: "bg-ink/5" as const,
        }]
      : []),
    ...(stats.topMood
      ? [{
          icon: Palette,
          label: "Dominant Mood",
          value: stats.topMood[0].charAt(0).toUpperCase() + stats.topMood[0].slice(1),
          detail: `${stats.topMood[1]} looks in this vibe`,
          color: "text-lavender" as const,
          bg: "bg-lavender/10" as const,
        }]
      : []),
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={16} className="text-ink" />
        <h3 className="font-editorial text-lg text-ink">Your Style Recap</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recapItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="p-4 rounded-xl bg-ivory"
          >
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon size={15} className={item.color} />
            </div>
            <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mb-1">
              {item.label}
            </p>
            <p className="font-editorial text-xl text-ink leading-tight">{item.value}</p>
            <p className="text-[10px] font-inter text-ink-muted mt-1">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

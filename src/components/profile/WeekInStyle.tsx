import { motion } from "framer-motion";
import { Flame, Heart, Eye, Zap } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function WeekInStyle() {
  const likedLooks = useStore((s) => s.likedLooks);
  const styleStreak = useStore((s) => s.styleStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const styleDNA = useStore((s) => s.styleDNA);

  const topStyle = styleDNA.reduce(
    (a, b) => (a.percentage > b.percentage ? a : b),
    styleDNA[0]
  );
  const likeRate = totalSwipes > 0
    ? Math.round((likedLooks.length / totalSwipes) * 100)
    : 0;

  const stats = [
    { icon: Eye, label: "Looks Seen", value: totalSwipes, color: "text-ink" },
    { icon: Heart, label: "Loved", value: likedLooks.length, color: "text-rose" },
    { icon: Flame, label: "Day Streak", value: styleStreak, color: "text-gold" },
    { icon: Zap, label: "Like Rate", value: `${likeRate}%`, color: "text-lavender" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="font-editorial text-lg text-ink mb-3">Your Week in Style</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="bg-ivory rounded-xl p-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center">
                <Icon size={16} className={stat.color} />
              </div>
              <div>
                <p className="text-lg font-editorial font-bold text-ink leading-none">
                  {stat.value}
                </p>
                <p className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {topStyle && (
        <div className="bg-gradient-to-r from-gold/10 to-blush/10 rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: topStyle.color + "20" }}
          >
            <span className="text-sm font-editorial font-bold" style={{ color: topStyle.color }}>
              {topStyle.percentage}%
            </span>
          </div>
          <div>
            <p className="text-xs font-inter font-medium text-ink">
              Your dominant style is <span className="font-semibold">{topStyle.style}</span>
            </p>
            <p className="text-[10px] font-inter text-ink-muted mt-0.5">
              Based on {likedLooks.length} loved looks
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function StyleStreak() {
  const styleStreak = useStore((s) => s.styleStreak);

  if (styleStreak < 2) return null;

  const streakLevel =
    styleStreak >= 30 ? "legendary" :
    styleStreak >= 14 ? "obsessed" :
    styleStreak >= 7 ? "devoted" :
    styleStreak >= 3 ? "committed" : "starting";

  const streakLabels: Record<string, string> = {
    legendary: "Legendary Style",
    obsessed: "Fashion Obsessed",
    devoted: "Style Devotee",
    committed: "On a Roll",
    starting: "Getting Started",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-2 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold/10 to-rose/10 border border-gold/15"
    >
      <div className="relative">
        <Flame size={18} className="text-gold" />
        {styleStreak >= 7 && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-0.5 -right-0.5"
          >
            <Zap size={8} className="text-rose" fill="currentColor" />
          </motion.div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-inter font-semibold tracking-[0.1em] uppercase text-ink">
          {styleStreak}-Day Streak
        </p>
        <p className="text-[9px] font-inter text-ink-muted">
          {streakLabels[streakLevel]}
        </p>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: Math.min(styleStreak, 7) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-1.5 h-1.5 rounded-full bg-gold"
          />
        ))}
        {styleStreak > 7 && (
          <span className="text-[8px] font-inter text-gold font-medium ml-0.5">
            +{styleStreak - 7}
          </span>
        )}
      </div>
    </motion.div>
  );
}

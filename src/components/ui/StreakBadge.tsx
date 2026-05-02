import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
  longest?: number;
  variant?: "compact" | "full";
}

export function StreakBadge({ count, longest, variant = "compact" }: StreakBadgeProps) {
  if (count <= 0) return null;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose/10 border border-rose/15"
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3 }}
        >
          <Flame size={11} className="text-rose" fill="currentColor" />
        </motion.span>
        <span className="text-[11px] font-inter font-semibold text-rose">
          {count}-day streak
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose/15 via-blush/20 to-gold/15 border border-rose/15 p-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-12 h-12 rounded-full bg-rose/15 flex items-center justify-center"
        >
          <Flame size={22} className="text-rose" fill="currentColor" />
        </motion.div>
        <div className="flex-1">
          <p className="text-[10px] font-inter font-bold tracking-[0.2em] uppercase text-rose mb-0.5">
            Daily Streak
          </p>
          <p className="font-editorial text-2xl text-ink leading-tight">
            {count} {count === 1 ? "day" : "days"} in a row
          </p>
          {longest !== undefined && longest > count && (
            <p className="text-[11px] font-inter text-ink-muted mt-0.5">
              Personal best: {longest} days
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

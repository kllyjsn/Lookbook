import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function StreakBadge() {
  const streak = useStore((s) => s.dailyStreak);

  if (streak < 1) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1 bg-gradient-to-r from-rose/10 to-gold/10 rounded-full px-2.5 py-1 border border-rose/20"
    >
      <motion.div
        animate={{ y: [0, -1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <Flame size={12} className="text-rose" fill="currentColor" />
      </motion.div>
      <span className="text-[10px] font-inter font-bold text-ink">
        {streak}
      </span>
    </motion.div>
  );
}

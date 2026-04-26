import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function StyleStreak() {
  const styleStreak = useStore((s) => s.styleStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);

  if (styleStreak < 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold/15 to-rose/10 border border-gold/20">
        <Flame size={12} className="text-gold" />
        <span className="text-[10px] font-inter font-semibold text-gold">
          {styleStreak}
        </span>
      </div>
      {totalSwipes > 0 && (
        <div className="flex items-center gap-1">
          <Zap size={10} className="text-ink-muted" />
          <span className="text-[9px] font-inter text-ink-muted">
            {totalSwipes}
          </span>
        </div>
      )}
    </motion.div>
  );
}

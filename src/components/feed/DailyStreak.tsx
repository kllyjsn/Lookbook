import { useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function DailyStreak() {
  const dailyStreak = useStore((s) => s.dailyStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const recordVisit = useStore((s) => s.recordVisit);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-gold/15 to-blush/15 border border-gold/20"
      >
        <Flame size={11} className="text-gold" />
        <span className="text-[10px] font-inter font-bold text-gold">
          {dailyStreak}
        </span>
      </motion.div>
      {totalSwipes > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, delay: 0.3 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-lavender/10 border border-lavender/20"
        >
          <Zap size={10} className="text-lavender" />
          <span className="text-[10px] font-inter font-medium text-lavender">
            {totalSwipes}
          </span>
        </motion.div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface SwipeStreakProps {
  count: number;
}

export function SwipeStreak({ count }: SwipeStreakProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose/10 to-gold/10 border border-rose/20"
    >
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Flame size={12} className="text-rose" fill="currentColor" />
      </motion.div>
      <span className="text-[10px] font-inter font-bold text-rose">{count}</span>
    </motion.div>
  );
}

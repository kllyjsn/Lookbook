import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface StyleMatchBadgeProps {
  matchPercent: number;
}

export function StyleMatchBadge({ matchPercent }: StyleMatchBadgeProps) {
  const isHigh = matchPercent >= 85;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md ${
        isHigh
          ? "bg-gold/30 border border-gold/40"
          : "bg-white/15 border border-white/20"
      }`}
    >
      {isHigh && <Sparkles size={9} className="text-gold" />}
      <span
        className={`text-[10px] font-inter font-bold tracking-wide ${
          isHigh ? "text-gold" : "text-white/80"
        }`}
      >
        {matchPercent}% match
      </span>
    </motion.div>
  );
}

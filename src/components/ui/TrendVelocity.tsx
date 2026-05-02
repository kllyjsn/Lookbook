import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";

interface TrendVelocityProps {
  velocity: number;
  compact?: boolean;
}

export function TrendVelocity({ velocity, compact }: TrendVelocityProps) {
  const isHot = velocity >= 500;
  const Icon = isHot ? Flame : TrendingUp;
  const label = isHot ? "On Fire" : "Rising";

  if (compact) {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center gap-1 text-[9px] font-inter font-semibold tracking-wider px-2 py-0.5 rounded-full ${
          isHot
            ? "bg-rose/90 text-white"
            : "bg-gold/90 text-white"
        }`}
      >
        <Icon size={9} />
        +{velocity}%
      </motion.span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
        isHot
          ? "bg-gradient-to-r from-rose/15 to-gold/15 border border-rose/20"
          : "bg-gold/10 border border-gold/20"
      }`}
    >
      <Icon size={12} className={isHot ? "text-rose" : "text-gold"} />
      <span className={`text-[10px] font-inter font-semibold ${isHot ? "text-rose" : "text-gold"}`}>
        {label}
      </span>
      <span className="text-[10px] font-inter text-ink-muted">
        +{velocity}% this week
      </span>
    </motion.div>
  );
}

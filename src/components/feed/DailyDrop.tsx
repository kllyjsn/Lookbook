import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export function DailyDrop() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeUntilMidnight()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mx-4 mb-2 px-3.5 py-2 rounded-xl bg-ink flex items-center gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <Sparkles size={13} className="text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-inter font-semibold tracking-[0.1em] uppercase text-cream">
          Today's Edit is Live
        </p>
        <p className="text-[9px] font-inter text-cream/50">
          16 hand-picked looks, refreshed daily
        </p>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-inter text-cream/60">
        <Clock size={10} />
        {timeLeft}
      </div>
    </motion.div>
  );
}

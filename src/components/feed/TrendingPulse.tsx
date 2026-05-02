import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame, ArrowUpRight, X } from "lucide-react";
import { trendingPulse } from "../../data/editorialContent";

const ROTATION_MS = 4500;

export function TrendingPulse() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % trendingPulse.length);
    }, ROTATION_MS);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = trendingPulse[index];
  const Icon = current.tone === "hot" ? Flame : TrendingUp;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-2"
    >
      <div className="relative flex items-center gap-2 rounded-full bg-ivory border border-ink/5 pl-3 pr-2 py-1.5 overflow-hidden">
        <span className="flex items-center gap-1 text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-ink-muted flex-shrink-0">
          <ArrowUpRight size={10} className="text-gold" />
          Pulse
        </span>
        <span className="text-ink/15 text-xs flex-shrink-0">·</span>
        <div className="flex-1 min-w-0 overflow-hidden h-4 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex items-center gap-1.5"
            >
              <Icon
                size={11}
                className={current.tone === "hot" ? "text-rose" : "text-gold"}
              />
              <span className="text-[11px] font-inter font-medium text-ink truncate">
                {current.label}
              </span>
              <span
                className={`text-[10px] font-inter font-semibold flex-shrink-0 ${
                  current.tone === "hot" ? "text-rose" : "text-gold"
                }`}
              >
                {current.delta}
              </span>
              <span className="text-[10px] font-inter text-ink-muted/70 flex-shrink-0 hidden xs:inline">
                this week
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-ink/5 flex items-center justify-center transition-colors"
          aria-label="Dismiss trending pulse"
        >
          <X size={11} className="text-ink-muted" />
        </button>
      </div>
    </motion.div>
  );
}

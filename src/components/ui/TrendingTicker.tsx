import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X } from "lucide-react";

const headlines = [
  "Quiet Luxury is having a moment — again",
  "Office Siren: the trend dominating LKBK this week",
  "Copenhagen Fashion Week: top 5 street style looks",
  "The $58 tee that keeps selling out",
  "Coastal Grandmother is the mood for summer '25",
  "Red is the color of the season — here's how to wear it",
  "Your community loved Monochrome Mood looks this week",
  "New drop: 4 fresh looks just added to the feed",
];

export function TrendingTicker() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative mx-4 mb-2 bg-ink rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden">
      <TrendingUp size={14} className="text-gold flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] font-inter text-cream/80 tracking-wide flex-1 truncate"
        >
          {headlines[index]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={() => setDismissed(true)}
        className="text-cream/40 hover:text-cream/70 transition-colors flex-shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  );
}

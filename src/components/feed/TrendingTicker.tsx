import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const trends = [
  "Quiet Luxury is up 34%",
  "Burgundy overtakes black",
  "Ballet flats +120% searches",
  "Oversized blazers trending",
  "Sheer everything for SS25",
  "Gold hardware era",
  "Coastal grandmother lives on",
  "Office siren +89% engagement",
];

export function TrendingTicker() {
  const doubled = [...trends, ...trends];

  return (
    <div className="relative overflow-hidden py-2 mx-4 mb-2">
      <div className="flex items-center gap-2 mb-1.5">
        <TrendingUp size={10} className="text-rose" />
        <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted font-medium">
          Trending Now
        </span>
      </div>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((trend, i) => (
            <span
              key={`${trend}-${i}`}
              className="text-[11px] font-inter text-ink-light flex-shrink-0"
            >
              {trend}
              <span className="text-ink-muted/30 ml-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

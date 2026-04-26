import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const trendingTags = [
  { label: "Quiet Luxury", hot: true },
  { label: "Mob Wife", hot: false },
  { label: "Old Money", hot: true },
  { label: "Coastal Cowgirl", hot: false },
  { label: "Coquette", hot: true },
  { label: "Tomato Girl", hot: false },
  { label: "Dark Academia", hot: false },
  { label: "Balletcore", hot: true },
  { label: "Cottagecore", hot: false },
  { label: "Gorpcore", hot: false },
];

export function TrendingBar() {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink text-cream shrink-0">
          <TrendingUp size={12} />
          <span className="text-[10px] font-inter font-medium tracking-wide">
            TRENDING
          </span>
        </div>
        {trendingTags.map((tag, i) => (
          <motion.button
            key={tag.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 px-3 py-1.5 rounded-full border border-ink/10 bg-ivory hover:bg-ink/5 transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] font-inter text-ink-light whitespace-nowrap">
              {tag.label}
            </span>
            {tag.hot && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

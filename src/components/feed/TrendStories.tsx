import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { trendStories } from "../../data/mockData";
import type { TrendStory } from "../../data/mockData";

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

interface TrendStoriesProps {
  onTrendTap: (story: TrendStory) => void;
}

export function TrendStories({ onTrendTap }: TrendStoriesProps) {
  return (
    <div className="mb-3">
      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-ink-muted">
          Trending Now
        </span>
        <span className="text-[9px] font-inter tracking-[0.15em] uppercase text-ink-muted/60">
          Updated hourly
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {trendStories.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTrendTap(story)}
            className="flex-shrink-0 w-[100px] group"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-1.5">
              <img
                src={story.image}
                alt={story.name}
                className="img-editorial group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${story.gradient}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                <p className="font-editorial text-sm text-white leading-tight">
                  {story.name}
                </p>
                <p className="text-[8px] font-inter text-white/60 mt-0.5">
                  {story.tagline}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                <Eye size={8} className="text-white/70" />
                <span className="text-[7px] font-inter text-white/70">
                  {formatViews(story.viewCount)}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { trendingStories, feedLooks } from "../../data/mockData";
import type { Look } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

interface TrendingStoriesProps {
  onStoryTap: (look: Look) => void;
}

export function TrendingStories({ onStoryTap }: TrendingStoriesProps) {
  const viewedStories = useStore((s) => s.viewedStories);
  const markStoryViewed = useStore((s) => s.markStoryViewed);

  const handleTap = (storyId: string, lookId: string) => {
    markStoryViewed(storyId);
    const look = feedLooks.find((l) => l.id === lookId);
    if (look) onStoryTap(look);
  };

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {trendingStories.map((story, i) => {
        const isViewed = viewedStories.includes(story.id);
        return (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleTap(story.id, story.lookId)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="relative">
              <div
                className="w-[62px] h-[62px] rounded-full p-[2.5px]"
                style={{
                  background: isViewed
                    ? "rgba(138,138,138,0.3)"
                    : `linear-gradient(135deg, ${story.ringColor}, ${story.ringColor}88)`,
                }}
              >
                <img
                  src={story.image}
                  alt={story.label}
                  className="w-full h-full rounded-full object-cover border-[2px] border-cream"
                />
              </div>
              {story.isNew && !isViewed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose border-2 border-cream flex items-center justify-center"
                >
                  <span className="text-[7px] font-inter font-bold text-white">N</span>
                </motion.div>
              )}
            </div>
            <span className={`text-[9px] font-inter truncate w-[62px] text-center ${
              isViewed ? "text-ink-muted/50" : "text-ink-muted"
            }`}>
              {story.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

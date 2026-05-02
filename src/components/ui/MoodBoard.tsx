import { useMemo } from "react";
import { motion } from "framer-motion";
import { Grid3X3, Sparkles } from "lucide-react";
import type { Look } from "../../data/mockData";

interface MoodBoardProps {
  looks: Look[];
}

export function MoodBoard({ looks }: MoodBoardProps) {
  const boardLooks = useMemo(() => looks.slice(0, 6), [looks]);

  const dominantTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    for (const look of boardLooks) {
      for (const tag of look.tags) {
        tagCounts[tag.label] = (tagCounts[tag.label] ?? 0) + 1;
      }
    }
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label]) => label);
  }, [boardLooks]);

  if (boardLooks.length < 2) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-2">
        <Grid3X3 size={16} className="text-ink" />
        <h3 className="font-editorial text-lg text-ink">Your Mood Board</h3>
      </div>
      <p className="text-xs font-inter text-ink-muted mb-4">
        Auto-curated from your loved looks
      </p>

      {/* Masonry-style grid */}
      <div className="rounded-2xl overflow-hidden">
        {boardLooks.length >= 4 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {/* Large hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 relative aspect-square"
            >
              <img
                src={boardLooks[0].image}
                alt={boardLooks[0].title}
                className="img-editorial"
              />
              <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                <p className="text-white text-[10px] font-inter font-medium">
                  {boardLooks[0].title}
                </p>
              </div>
            </motion.div>

            {/* Two stacked small images */}
            {boardLooks.slice(1, 3).map((look, i) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="relative aspect-square"
              >
                <img src={look.image} alt={look.title} className="img-editorial" />
              </motion.div>
            ))}

            {/* Bottom row */}
            {boardLooks.slice(3, 6).map((look, i) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="relative aspect-square"
              >
                <img src={look.image} alt={look.title} className="img-editorial" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0.5">
            {boardLooks.map((look, i) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="relative aspect-[3/4]"
              >
                <img src={look.image} alt={look.title} className="img-editorial" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Aesthetic tags */}
      {dominantTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 mt-4 flex-wrap"
        >
          <Sparkles size={12} className="text-gold" />
          <span className="text-[10px] font-inter text-ink-muted">Your aesthetic:</span>
          {dominantTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-light border border-ink/10 rounded-full px-2.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

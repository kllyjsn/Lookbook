import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { creatorStories } from "../../data/trendData";
import type { CreatorStory } from "../../data/trendData";

function StoryViewer({
  story,
  onClose,
}: {
  story: CreatorStory;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-ink"
    >
      <div className="h-full relative">
        {/* Progress bar */}
        <div className="absolute top-0 inset-x-0 z-10 px-4 pt-3">
          <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              onAnimationComplete={onClose}
            />
          </div>
        </div>

        {/* Creator info */}
        <div className="absolute top-6 inset-x-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={story.avatar}
              alt={story.creatorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
            />
            <div>
              <p className="text-sm font-inter font-semibold text-white">
                {story.creatorName}
              </p>
              <p className="text-[10px] font-inter text-white/50">
                {story.label}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </motion.button>
        </div>

        {/* Story image */}
        <img
          src={story.previewImage}
          alt={story.label}
          className="w-full h-full object-cover"
        />

        {/* Bottom actions */}
        <div className="absolute bottom-8 inset-x-0 px-6 flex items-center justify-between">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <ShoppingBag size={20} className="text-white" />
            </motion.button>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronLeft size={16} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronRight size={16} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CreatorStories() {
  const [activeStory, setActiveStory] = useState<CreatorStory | null>(null);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-3">
        {creatorStories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2px] ${
                story.isNew
                  ? "bg-gradient-to-br from-gold via-rose to-lavender"
                  : "bg-ink/10"
              }`}
            >
              <img
                src={story.avatar}
                alt={story.creatorName}
                className="w-full h-full rounded-full object-cover border-2 border-cream"
              />
            </div>
            <span className="text-[10px] font-inter text-ink-muted text-center w-16 truncate">
              {story.creatorName}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeStory && (
          <StoryViewer
            story={activeStory}
            onClose={() => setActiveStory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

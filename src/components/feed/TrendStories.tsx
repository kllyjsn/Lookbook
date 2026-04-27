import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Flame, Zap, BookOpen, Swords } from "lucide-react";
import { trendStories, feedLooks } from "../../data/mockData";
import type { TrendStory, Look } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

const categoryIcons = {
  trend: Flame,
  drop: Zap,
  editorial: BookOpen,
  challenge: Swords,
} as const;

interface StoryViewerProps {
  story: TrendStory;
  looks: Look[];
  onClose: () => void;
  onLookTap: (look: Look) => void;
}

function StoryViewer({ story, looks, onClose, onLookTap }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLook = looks[currentIndex];

  const goNext = () => {
    if (currentIndex < looks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!currentLook) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black"
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-1.5">
        {looks.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: i < currentIndex ? "100%" : "0%" }}
              animate={{ width: i <= currentIndex ? "100%" : "0%" }}
              transition={{ duration: i === currentIndex ? 5 : 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* Story header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: story.accentColor }}
          >
            <span className="text-white text-xs font-inter font-bold">
              {story.title[0]}
            </span>
          </div>
          <div>
            <p className="text-white text-xs font-inter font-medium">{story.title}</p>
            <p className="text-white/50 text-[10px] font-inter">{story.subtitle}</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X size={20} className="text-white" />
        </motion.button>
      </div>

      {/* Tap zones */}
      <div className="absolute inset-0 z-[5] flex">
        <div className="w-1/3 h-full" onClick={goPrev} />
        <div className="w-1/3 h-full" onClick={() => onLookTap(currentLook)} />
        <div className="w-1/3 h-full" onClick={goNext} />
      </div>

      {/* Look image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLook.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={currentLook.image}
            alt={currentLook.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-6 pb-12 z-10">
        <motion.div
          key={currentLook.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex gap-2 mb-3">
            {currentLook.tags.map((tag) => (
              <span
                key={tag.label}
                className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/70 border border-white/25 rounded-full px-2.5 py-0.5"
              >
                {tag.label}
              </span>
            ))}
          </div>
          <h2 className="font-editorial text-3xl text-white leading-tight mb-1">
            {currentLook.title}
          </h2>
          <p className="font-subhead text-base text-white/70 italic mb-4">
            {currentLook.subtitle}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onLookTap(currentLook)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-inter font-medium"
          >
            Shop This Look
            <ChevronRight size={14} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TrendStoriesProps {
  onLookTap: (look: Look) => void;
}

export function TrendStories({ onLookTap }: TrendStoriesProps) {
  const [activeStory, setActiveStory] = useState<TrendStory | null>(null);
  const viewedStories = useStore((s) => s.viewedStories);
  const markStoryViewed = useStore((s) => s.markStoryViewed);

  const openStory = (story: TrendStory) => {
    markStoryViewed(story.id);
    setActiveStory(story);
  };

  const getStoryLooks = (story: TrendStory): Look[] =>
    story.lookIds
      .map((id) => feedLooks.find((l) => l.id === id))
      .filter((l): l is Look => l !== undefined);

  return (
    <>
      <div className="px-4 pb-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {trendStories.map((story) => {
            const isViewed = viewedStories.includes(story.id);
            const Icon = categoryIcons[story.category];
            return (
              <motion.button
                key={story.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => openStory(story)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 w-16"
              >
                <div
                  className={`w-[62px] h-[62px] rounded-full p-[2px] ${
                    isViewed
                      ? "bg-ink/15"
                      : "bg-gradient-to-br from-gold via-rose to-lavender"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-cream relative">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Icon size={14} className="text-white" />
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] font-inter tracking-wide leading-tight text-center line-clamp-1 ${
                  isViewed ? "text-ink-muted" : "text-ink"
                }`}>
                  {story.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeStory && (
          <StoryViewer
            story={activeStory}
            looks={getStoryLooks(activeStory)}
            onClose={() => setActiveStory(null)}
            onLookTap={(look) => {
              setActiveStory(null);
              onLookTap(look);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

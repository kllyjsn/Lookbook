import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { trendStories } from "../../data/trendData";
import type { TrendStory } from "../../data/trendData";

function StoryViewer({
  story,
  onClose,
}: {
  story: TrendStory;
  onClose: () => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = story.slides[slideIndex];

  const goNext = () => {
    if (slideIndex < story.slides.length - 1) {
      setSlideIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (slideIndex > 0) setSlideIndex((i) => i - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-ink"
    >
      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex gap-1 px-3 pt-3">
        {story.slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: i < slideIndex ? "100%" : "0%" }}
              animate={{ width: i <= slideIndex ? "100%" : "0%" }}
              transition={{ duration: i === slideIndex ? 5 : 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* Image */}
      <img src={slide.image} alt={slide.headline} className="img-editorial" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-8 pb-16 z-10">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/50 block mb-3">
            {story.title} · {story.subtitle}
          </span>
          <h2 className="font-editorial text-3xl text-white leading-tight mb-3">
            {slide.headline}
          </h2>
          <p className="font-subhead text-lg text-white/70 italic leading-relaxed mb-4">
            {slide.body}
          </p>
          {slide.cta && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full bg-white text-ink text-sm font-inter font-medium"
            >
              {slide.cta}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Tap zones */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-0 w-1/3 h-full z-20"
        aria-label="Previous"
      />
      <button
        onClick={goNext}
        className="absolute right-0 top-0 w-2/3 h-full z-20"
        aria-label="Next"
      />

      {/* Close */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute top-8 right-4 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
      >
        <X size={18} className="text-white" />
      </motion.button>

      {/* Slide counter */}
      <div className="absolute top-8 left-4 z-30">
        <span className="text-masthead text-xs text-white/80">LKBK</span>
      </div>
    </motion.div>
  );
}

const categoryColors: Record<string, string> = {
  trend: "ring-gold",
  editorial: "ring-rose",
  street: "ring-ink",
  color: "ring-lavender",
  new: "ring-sage",
};

export function TrendStories() {
  const [viewingStory, setViewingStory] = useState<TrendStory | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const handleOpenStory = (story: TrendStory) => {
    setViewingStory(story);
    setViewedStories((prev) => new Set([...prev, story.id]));
  };

  return (
    <>
      <div className="px-4 pb-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {trendStories.map((story, i) => {
            const viewed = viewedStories.has(story.id);
            const ringColor = categoryColors[story.category] ?? "ring-gold";
            return (
              <motion.button
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenStory(story)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div
                  className={`w-16 h-16 rounded-full p-[2px] ring-2 ${
                    viewed ? "ring-ink/10" : ringColor
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="img-editorial"
                    />
                  </div>
                </div>
                <span
                  className={`text-[9px] font-inter tracking-wide max-w-[64px] truncate ${
                    viewed ? "text-ink-muted" : "text-ink"
                  }`}
                >
                  {story.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {viewingStory && (
          <StoryViewer
            story={viewingStory}
            onClose={() => setViewingStory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { ootdStories } from "../../data/mockData";
import type { OOTDStory } from "../../data/mockData";

function StoryViewer({
  story,
  onClose,
}: {
  story: OOTDStory;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const look = story.looks[currentIndex];

  const goNext = () => {
    if (currentIndex < story.looks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-ink flex flex-col"
    >
      {/* Progress bars */}
      <div className="absolute top-4 inset-x-4 z-10 flex gap-1">
        {story.looks.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: i < currentIndex ? "100%" : "0%" }}
              animate={{ width: i <= currentIndex ? "100%" : "0%" }}
              transition={{ duration: i === currentIndex ? 5 : 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute top-10 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
      >
        <X size={16} className="text-white" />
      </motion.button>

      {/* Story label */}
      <div className="absolute top-10 left-4 z-10">
        <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/60">
          {story.label}
        </span>
      </div>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex-1 relative"
        >
          <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6 pb-12">
            <div className="flex gap-2 mb-2">
              {look.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/70 border border-white/20 rounded-full px-2.5 py-0.5"
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <h2 className="font-editorial text-3xl text-white leading-tight mb-1">
              {look.title}
            </h2>
            <p className="font-subhead text-base text-white/70 italic">
              {look.subtitle}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs font-inter text-white/50">
                <Heart size={12} fill="currentColor" />
                {look.likes >= 1000 ? `${(look.likes / 1000).toFixed(1)}K` : look.likes}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-inter text-white/50">{look.priceRange}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tap zones */}
      <div className="absolute inset-0 flex z-[5]" style={{ top: 60 }}>
        <button className="w-1/3 h-full" onClick={goPrev} aria-label="Previous" />
        <button className="w-1/3 h-full" aria-label="Pause" />
        <button className="w-1/3 h-full" onClick={goNext} aria-label="Next" />
      </div>
    </motion.div>
  );
}

export function OOTDStories() {
  const [activeStory, setActiveStory] = useState<OOTDStory | null>(null);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {ootdStories.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className={`w-16 h-16 rounded-full p-[2px] ${story.isNew ? "bg-gradient-to-br from-gold via-rose to-lavender" : "bg-ink/10"}`}>
              <img
                src={story.coverImage}
                alt={story.label}
                className="w-full h-full rounded-full object-cover border-2 border-cream"
              />
            </div>
            <span className="text-[9px] font-inter text-ink-muted w-16 text-center truncate">
              {story.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeStory && (
          <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

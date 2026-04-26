import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Download } from "lucide-react";
import type { Look, StyleDNAEntry } from "../../data/mockData";

interface ShareStyleCardProps {
  look: Look;
  styleDNA: StyleDNAEntry[];
  onClose: () => void;
}

export function ShareStyleCard({ look, styleDNA, onClose }: ShareStyleCardProps) {
  const topStyle = styleDNA.reduce((a, b) => (a.percentage > b.percentage ? a : b), styleDNA[0]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My LKBK Style: ${look.title}`,
          text: `I'm ${topStyle.percentage}% ${topStyle.style} on LKBK. Check out this look: ${look.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-72 bg-cream rounded-3xl overflow-hidden shadow-2xl mx-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card header image */}
          <div className="relative h-72">
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 gradient-bottom p-5">
              <span className="text-masthead text-[10px] text-white/60 block mb-1">LKBK</span>
              <h3 className="font-editorial text-2xl text-white leading-tight">
                {look.title}
              </h3>
            </div>
          </div>

          {/* Style DNA bar */}
          <div className="p-5">
            <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted mb-2">
              My Style DNA
            </p>
            <div className="flex h-2 rounded-full overflow-hidden mb-3">
              {styleDNA.map((entry) => (
                <div
                  key={entry.style}
                  className="h-full"
                  style={{
                    width: `${entry.percentage}%`,
                    backgroundColor: entry.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {styleDNA.slice(0, 3).map((entry) => (
                <span
                  key={entry.style}
                  className="text-[9px] font-inter text-ink-muted"
                >
                  {entry.percentage}% {entry.style}
                </span>
              ))}
            </div>

            {/* Share buttons */}
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-full bg-ink text-cream text-xs font-inter font-medium flex items-center justify-center gap-2"
              >
                <Share2 size={14} />
                Share
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center"
              >
                <Download size={14} className="text-ink-muted" />
              </motion.button>
            </div>
          </div>

          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center"
          >
            <X size={14} className="text-ink" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

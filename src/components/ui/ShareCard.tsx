import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import type { Look } from "../../data/mockData";

interface ShareCardProps {
  look: Look;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCard({ look, isOpen, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = `${look.title} — ${look.subtitle}\n${look.description}\n\nStyling ${look.items.length} pieces | ${look.priceRange}\n\nDiscover on LKBK`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: not available in all contexts
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LKBK — ${look.title}`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed inset-x-4 top-[15%] z-50 max-w-sm mx-auto"
          >
            <div className="bg-cream rounded-3xl overflow-hidden shadow-xl">
              {/* Close button */}
              <div className="flex justify-end p-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
                >
                  <X size={14} />
                </motion.button>
              </div>

              {/* Share card preview */}
              <div ref={cardRef} className="mx-4 mb-4 rounded-2xl overflow-hidden bg-ink">
                <div className="relative aspect-[4/5]">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Branding */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-inter font-bold tracking-[0.3em] uppercase text-white/70">
                      LKBK
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="flex gap-1.5 mb-2">
                      {look.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className="text-[8px] font-inter tracking-[0.2em] uppercase text-white/60 border border-white/20 rounded-full px-2 py-0.5"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-editorial text-xl text-white leading-tight">
                      {look.title}
                    </h3>
                    <p className="font-subhead text-sm text-white/70 italic mt-1">
                      {look.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-white/50">
                      <span className="text-[10px] font-inter">
                        {look.items.length} pieces
                      </span>
                      <span>·</span>
                      <span className="text-[10px] font-inter">
                        {look.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share actions */}
              <div className="px-4 pb-6 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Share2 size={14} />
                  Share
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="w-full py-3 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Caption
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

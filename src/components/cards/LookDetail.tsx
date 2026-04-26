import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, Check } from "lucide-react";
import type { Look } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore } from "../../stores/useStore";

interface LookDetailProps {
  look: Look;
  onClose: () => void;
}

export function LookDetail({ look, onClose }: LookDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const likeLook = useStore((s) => s.likeLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `LKBK: ${look.title}`,
      text: `${look.subtitle} — ${look.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${look.title} — ${look.subtitle}\n${look.description}\n${window.location.href}`
        );
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // user cancelled share dialog
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-cream"
      >
        <div className="h-full overflow-y-auto">
          {/* Hero image — magazine spread */}
          <div className="relative w-full aspect-[3/4] max-h-[70vh]">
            {!imgLoaded && (
              <div className="absolute inset-0 skeleton-shimmer" />
            )}
            <img
              src={look.image}
              alt={look.title}
              className={`img-editorial transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="absolute inset-x-0 bottom-0 gradient-bottom p-8 pb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Badge */}
                {look.badge && (
                  <div className="mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-inter font-bold tracking-[0.2em] uppercase ${
                        look.badge === "TRENDING"
                          ? "bg-rose/90 text-white"
                          : look.badge === "EDITOR'S PICK"
                          ? "bg-gold/90 text-white"
                          : "bg-white/90 text-ink"
                      }`}
                    >
                      {look.badge}
                    </span>
                  </div>
                )}
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/60 block mb-2">
                  {look.season} &middot; {look.occasion}
                </span>
                <h1 className="font-editorial text-4xl text-white leading-tight mb-2">
                  {look.title}
                </h1>
                <p className="font-subhead text-lg text-white/80 italic">
                  {look.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              <X size={18} className="text-ink" />
            </motion.button>

            {/* Top left — magazine-style issue label */}
            <div className="absolute top-6 left-6">
              <span className="text-masthead text-sm text-white/80">LKBK</span>
            </div>
          </div>

          {/* Editorial content */}
          <div className="px-6 py-8 max-w-2xl mx-auto">
            {/* Tags */}
            <div className="flex gap-2 mb-6">
              {look.tags.map((tag) => (
                <Tag key={tag.label} label={tag.label} color={tag.color} />
              ))}
            </div>

            {/* Description */}
            <p className="font-subhead text-xl text-ink-light leading-relaxed mb-8 italic">
              {look.description}
            </p>

            {/* Action bar */}
            <div className="flex items-center gap-3 mb-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!liked) {
                    likeLook(look);
                    setLiked(true);
                  }
                }}
                className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-sm font-inter font-medium transition-colors ${
                  liked
                    ? "bg-rose/10 text-rose border border-rose/20"
                    : "bg-ink text-cream"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                {liked ? "Loved" : "Love This"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToCollection("favorites", look);
                  setSaved(true);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                  saved
                    ? "border-gold/40 bg-gold/10"
                    : "border-ink/10 hover:border-ink/30"
                }`}
              >
                <Bookmark
                  size={18}
                  className={saved ? "text-gold" : "text-ink-muted"}
                  fill={saved ? "currentColor" : "none"}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                  shared
                    ? "border-green-400/40 bg-green-400/10"
                    : "border-ink/10 hover:border-ink/30"
                }`}
              >
                {shared ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Share2 size={18} className="text-ink-muted" />
                )}
              </motion.button>
            </div>

            {/* Shop the Look section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag size={18} className="text-ink" />
                <h3 className="font-editorial text-xl text-ink">Shop the Look</h3>
                <span className="text-xs font-inter text-ink-muted ml-auto">
                  {look.priceRange}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {look.items.map((item, i) => (
                  <ProductCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>

            {/* Photographer credit */}
            {look.photographer && (
              <p className="text-center text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted pb-24">
                Photography by {look.photographer}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

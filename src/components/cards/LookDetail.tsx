import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp, Palette, Sparkles, Users, ArrowRight, ExternalLink } from "lucide-react";
import type { Look, LookItem } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface QuickShopProps {
  item: LookItem;
  onClose: () => void;
}

function QuickShopSheet({ item, onClose }: QuickShopProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-cream rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-ink/15 rounded-full mx-auto mt-3" />
        <div className="p-6">
          <div className="flex gap-5">
            <div className="relative w-32 aspect-[3/4] rounded-xl overflow-hidden bg-ivory flex-shrink-0">
              {!imgLoaded && <div className="absolute inset-0 shimmer bg-ivory" />}
              <img
                src={item.image}
                alt={item.name}
                className={`img-editorial transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted block mb-1">
                  {item.category}
                </span>
                <h3 className="font-editorial text-xl text-ink leading-snug mb-1">
                  {item.name}
                </h3>
                <p className="text-sm font-inter text-ink-muted mb-3">{item.brand}</p>
              </div>
              <p className="font-editorial text-2xl text-ink">${item.price}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <motion.a
              href={item.shopUrl}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              Shop Now
            </motion.a>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-ink/10"
            >
              <Bookmark size={18} className="text-ink-muted" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-ink/10"
            >
              <ExternalLink size={18} className="text-ink-muted" />
            </motion.button>
          </div>
        </div>
        <div className="h-safe-bottom" />
      </motion.div>
    </motion.div>
  );
}

interface LookDetailProps {
  look: Look;
  onClose: () => void;
}

export function LookDetail({ look, onClose }: LookDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const saveLook = useStore((s) => s.saveLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quickShopItem, setQuickShopItem] = useState<LookItem | null>(null);

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
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/60 block mb-2">
                  {look.season} · {look.occasion}
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
            {/* Tags + badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {look.trending && (
                <span className="flex items-center gap-1 text-[10px] font-inter font-semibold tracking-[0.1em] uppercase text-white bg-ink rounded-full px-3 py-1.5">
                  <TrendingUp size={10} />
                  Trending
                </span>
              )}
              {look.editorsChoice && (
                <span className="text-[10px] font-inter font-semibold tracking-[0.1em] uppercase text-white bg-gold rounded-full px-3 py-1.5">
                  Editor's Pick
                </span>
              )}
              {look.tags.map((tag) => (
                <Tag key={tag.label} label={tag.label} color={tag.color} />
              ))}
            </div>

            {/* Engagement stats */}
            <div className="flex items-center gap-4 mb-5">
              <span className="flex items-center gap-1.5 text-sm font-inter text-ink-muted">
                <Heart size={14} className="text-rose" fill="currentColor" />
                {formatCount(look.likes)} loves
              </span>
              <span className="text-ink-muted/40">·</span>
              <span className="text-sm font-inter text-ink-muted">
                {look.items.length} pieces
              </span>
              <span className="text-ink-muted/40">·</span>
              <span className="text-sm font-inter text-ink-muted">
                {look.priceRange}
              </span>
              {look.recentLovers && look.recentLovers > 0 && (
                <>
                  <span className="text-ink-muted/40">·</span>
                  <span className="flex items-center gap-1 text-sm font-inter text-ink-muted">
                    <Users size={12} />
                    {look.recentLovers} today
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="font-subhead text-xl text-ink-light leading-relaxed mb-8 italic">
              {look.description}
            </p>

            {/* Editor's Note — fashion editor commentary */}
            {look.editorNote && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 p-5 rounded-2xl bg-ivory border border-ink/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-gold" />
                  <span className="text-[10px] font-inter font-semibold tracking-[0.2em] uppercase text-gold">
                    Editor's Note
                  </span>
                </div>
                <p className="font-subhead text-base text-ink-light leading-relaxed italic">
                  "{look.editorNote}"
                </p>
              </motion.div>
            )}

            {/* Color Story palette */}
            {look.colorStory && look.colorStory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={16} className="text-ink" />
                  <h3 className="font-editorial text-lg text-ink">Color Story</h3>
                </div>
                <div className="flex gap-3">
                  {look.colorStory.map((swatch, i) => (
                    <motion.div
                      key={swatch.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full aspect-square rounded-xl border border-ink/5 shadow-sm"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[9px] font-inter tracking-[0.1em] uppercase text-ink-muted">
                        {swatch.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-3 mb-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!liked) {
                    saveLook(look);
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
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `LKBK — ${look.title}`,
                      text: look.description,
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center border border-ink/10 hover:border-ink/30"
              >
                <Share2 size={18} className="text-ink-muted" />
              </motion.button>
            </div>

            {/* Style It 3 Ways — occasion variations */}
            {look.styleVariations && look.styleVariations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-ink" />
                  <h3 className="font-editorial text-lg text-ink">Style It 3 Ways</h3>
                </div>
                <div className="space-y-3">
                  {look.styleVariations.map((variation, i) => (
                    <motion.div
                      key={variation.occasion}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-ivory border border-ink/5"
                    >
                      <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center flex-shrink-0">
                        <ArrowRight size={14} className="text-ink-muted" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-inter font-semibold tracking-[0.1em] uppercase text-ink mb-1">
                          {variation.occasion}
                        </p>
                        <p className="text-sm font-inter text-ink-light leading-relaxed">
                          {variation.tip}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

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
                  <div key={item.id} onClick={() => setQuickShopItem(item)}>
                    <ProductCard item={item} index={i} />
                  </div>
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

      {/* Quick-shop bottom sheet */}
      <AnimatePresence>
        {quickShopItem && (
          <QuickShopSheet
            item={quickShopItem}
            onClose={() => setQuickShopItem(null)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

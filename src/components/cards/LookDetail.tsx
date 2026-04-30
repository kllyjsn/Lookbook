import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp, Lightbulb, PenTool, Calculator, Sparkles } from "lucide-react";
import type { Look } from "../../data/mockData";
import { computeStyleMatch } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function CostPerWear({ look }: { look: Look }) {
  const totalPrice = look.items.reduce((sum, item) => sum + item.price, 0);
  const wearFreq = look.wearFrequency || 50;
  const costPerWear = totalPrice / wearFreq;
  const isGreatValue = costPerWear < 10;
  const isGoodValue = costPerWear < 25;

  return (
    <div className="rounded-2xl bg-ivory p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={16} className="text-ink" />
        <h4 className="font-editorial text-base text-ink">Cost-Per-Wear</h4>
        <span className={`ml-auto text-[9px] font-inter font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
          isGreatValue
            ? "bg-green-100 text-green-700"
            : isGoodValue
            ? "bg-gold/15 text-gold"
            : "bg-ink/5 text-ink-muted"
        }`}>
          {isGreatValue ? "INCREDIBLE VALUE" : isGoodValue ? "GOOD VALUE" : "INVESTMENT"}
        </span>
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-editorial text-3xl text-ink">${costPerWear.toFixed(2)}</span>
        <span className="text-xs font-inter text-ink-muted">per wear</span>
      </div>
      <div className="flex items-center gap-4 text-xs font-inter text-ink-muted">
        <span>Total: ${totalPrice.toLocaleString()}</span>
        <span className="text-ink-muted/40">·</span>
        <span>~{wearFreq} wears/year</span>
        <span className="text-ink-muted/40">·</span>
        <span>{look.items.length} pieces</span>
      </div>
      <div className="mt-3 h-1.5 bg-ink/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, (1 - costPerWear / 50) * 100))}%` }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`h-full rounded-full ${
            isGreatValue ? "bg-green-400" : isGoodValue ? "bg-gold" : "bg-ink/30"
          }`}
        />
      </div>
    </div>
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
  const styleDNA = useStore((s) => s.styleDNA);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const styleMatch = useMemo(
    () => computeStyleMatch(look.tags, styleDNA),
    [look, styleDNA]
  );

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

            {/* Style match badge */}
            {styleMatch >= 70 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className="absolute top-6 left-6"
              >
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md ${
                  styleMatch >= 85
                    ? "bg-green-400/30 border border-green-400/30"
                    : styleMatch >= 70
                    ? "bg-gold/30 border border-gold/30"
                    : "bg-white/20 border border-white/20"
                }`}>
                  <Sparkles size={10} className="text-white" />
                  <span className="text-[10px] font-inter font-bold text-white tracking-wider">
                    {styleMatch}% MATCH
                  </span>
                </div>
              </motion.div>
            )}

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
            {styleMatch < 70 && (
              <div className="absolute top-6 left-6">
                <span className="text-masthead text-sm text-white/80">LKBK</span>
              </div>
            )}
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
            </div>

            {/* Description */}
            <p className="font-subhead text-xl text-ink-light leading-relaxed mb-8 italic">
              {look.description}
            </p>

            {/* Editor's Note */}
            {look.editorNote && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-gradient-to-br from-gold/8 to-blush/8 border border-gold/10 p-5 mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <PenTool size={14} className="text-gold" />
                  <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold font-semibold">
                    Editor's Note
                  </span>
                </div>
                <p className="font-subhead text-base text-ink-light italic leading-relaxed">
                  {look.editorNote}
                </p>
              </motion.div>
            )}

            {/* Styling Tip */}
            {look.stylingTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-ivory border border-ink/5 p-5 mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={14} className="text-ink" />
                  <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink font-semibold">
                    How to Wear It
                  </span>
                </div>
                <p className="text-sm font-inter text-ink-light leading-relaxed">
                  {look.stylingTip}
                </p>
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

            {/* Cost-per-wear */}
            <CostPerWear look={look} />

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

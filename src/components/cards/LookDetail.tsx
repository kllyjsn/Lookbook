import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp, Dna, Calculator, ArrowDownRight } from "lucide-react";
import type { Look } from "../../data/mockData";
import { computeStyleMatch, getWhyYoullLoveThis, dupeMap } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
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
  const [cpwWears, setCpwWears] = useState(30);
  const [showDupes, setShowDupes] = useState<string | null>(null);

  const matchScore = computeStyleMatch(look, styleDNA);
  const whyLove = getWhyYoullLoveThis(look, styleDNA);

  const totalPrice = useMemo(
    () => look.items.reduce((sum, item) => sum + item.price, 0),
    [look.items]
  );

  const lookDupes = useMemo(
    () => look.items.flatMap((item) => dupeMap[item.id] ?? []),
    [look.items]
  );

  const totalDupeSavings = useMemo(() => {
    let original = 0;
    let dupeTotal = 0;
    for (const item of look.items) {
      const itemDupes = dupeMap[item.id];
      if (itemDupes && itemDupes.length > 0) {
        original += item.price;
        dupeTotal += [...itemDupes].sort((a, b) => a.price - b.price)[0].price;
      }
    }
    return original > 0 ? original - dupeTotal : 0;
  }, [look.items]);

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
            </div>

            {/* Style Match + Why You'll Love This */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-gold/5 to-blush/5 border border-gold/15 mb-5"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Dna size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-inter font-bold text-ink">{matchScore}% Your Style</span>
                  {matchScore >= 80 && (
                    <span className="text-[9px] font-inter font-bold tracking-wider uppercase text-gold bg-gold/10 rounded-full px-2 py-0.5">
                      Perfect Match
                    </span>
                  )}
                </div>
                <p className="text-xs font-inter text-ink-muted leading-relaxed">
                  {whyLove}
                </p>
              </div>
            </motion.div>

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

            {/* Cost-Per-Wear Calculator */}
            <div className="mb-10 p-5 rounded-2xl bg-ivory">
              <div className="flex items-center gap-2 mb-4">
                <Calculator size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">Cost Per Wear</h3>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                    Total Look
                  </p>
                  <p className="font-editorial text-2xl text-ink">
                    ${totalPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                    Per Wear
                  </p>
                  <p className="font-editorial text-2xl text-gold">
                    ${(totalPrice / cpwWears).toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-inter text-ink-muted">
                    If you wear it {cpwWears} times
                  </span>
                  <span className="text-xs font-inter font-medium text-gold">
                    {cpwWears >= 50 ? "Investment piece" : cpwWears >= 20 ? "Good value" : "Worth considering"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={cpwWears}
                  onChange={(e) => setCpwWears(Number(e.target.value))}
                  className="w-full h-1 bg-ink/10 rounded-full appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between">
                  <span className="text-[10px] font-inter text-ink-muted">1 wear</span>
                  <span className="text-[10px] font-inter text-ink-muted">100 wears</span>
                </div>
              </div>
            </div>

            {/* Dupe Finder */}
            {lookDupes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowDownRight size={18} className="text-sage" />
                  <h3 className="font-editorial text-xl text-ink">Find the Dupe</h3>
                  <span className="ml-auto text-xs font-inter font-semibold text-sage bg-sage/10 rounded-full px-3 py-1">
                    Save up to ${totalDupeSavings.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs font-inter text-ink-muted mb-4">
                  Get the same vibe for less. TikTok-approved alternatives.
                </p>
                <div className="space-y-3">
                  {look.items.map((item) => {
                    const itemDupes = dupeMap[item.id];
                    if (!itemDupes || itemDupes.length === 0) return null;
                    const isExpanded = showDupes === item.id;
                    return (
                      <div key={item.id} className="rounded-xl border border-ink/5 overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setShowDupes(isExpanded ? null : item.id)}
                          className="w-full flex items-center gap-3 p-3 bg-ivory/50"
                        >
                          <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="img-editorial" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-inter font-medium text-ink truncate">{item.name}</p>
                            <p className="text-[10px] font-inter text-ink-muted">{item.brand} · ${item.price}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-inter font-semibold text-sage">
                              {itemDupes.length} dupe{itemDupes.length > 1 ? "s" : ""}
                            </span>
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              className="text-ink-muted text-xs"
                            >
                              ▾
                            </motion.span>
                          </div>
                        </motion.button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 pt-0 space-y-2">
                                {itemDupes.map((dupe) => (
                                  <div key={dupe.id} className="flex items-center gap-3 p-2 rounded-lg bg-sage/5">
                                    <div className="w-8 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                      <img src={dupe.image} alt={dupe.name} className="img-editorial" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-inter font-medium text-ink truncate">{dupe.name}</p>
                                      <p className="text-[10px] font-inter text-ink-muted">{dupe.brand}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-xs font-inter font-bold text-sage">${dupe.price}</p>
                                      <p className="text-[9px] font-inter text-sage/70">-{dupe.savingsPercent}%</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

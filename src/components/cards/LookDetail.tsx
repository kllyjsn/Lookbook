import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp,
  Quote, Sparkles, Palette, ArrowRight, Crown, Scale, PiggyBank,
} from "lucide-react";
import type { Look } from "../../data/mockData";
import { feedLooks } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore } from "../../stores/useStore";
import { getEditorialContext } from "../../data/editorialContent";
import type { DupeTier } from "../../data/editorialContent";
import { relatedLooks } from "../../lib/styleMatch";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const dupeIcon: Record<DupeTier["level"], React.ElementType> = {
  splurge: Crown,
  mid: Scale,
  save: PiggyBank,
};
const dupeLabel: Record<DupeTier["level"], string> = {
  splurge: "Splurge",
  mid: "Middle Ground",
  save: "The Save",
};
const dupeColor: Record<DupeTier["level"], string> = {
  splurge: "text-gold",
  mid: "text-ink-light",
  save: "text-sage",
};

interface LookDetailProps {
  look: Look;
  onClose: () => void;
}

export function LookDetail({ look, onClose }: LookDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const saveLook = useStore((s) => s.saveLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const editorial = useMemo(() => getEditorialContext(look), [look]);
  const related = useMemo(() => relatedLooks(look, feedLooks, 3), [look]);

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
              aria-label="Close look detail"
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
                aria-label="Save to favorites"
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
                aria-label="Share look"
              >
                <Share2 size={18} className="text-ink-muted" />
              </motion.button>
            </div>

            {/* From the Editor — magazine pull-quote */}
            <section className="mb-10 relative bg-ivory rounded-2xl p-6 pt-7 border border-ink/5">
              <div className="absolute -top-3 left-6 bg-cream px-3 py-1 rounded-full border border-ink/5 flex items-center gap-1.5">
                <Quote size={11} className="text-gold" />
                <span className="text-[10px] font-inter font-semibold tracking-[0.18em] uppercase text-ink-muted">
                  From the Editor
                </span>
              </div>
              <p className="font-subhead text-[19px] text-ink leading-snug italic">
                "{editorial.editorsNote}"
              </p>
            </section>

            {/* How to Wear It — 3 styling rules */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-ink" />
                <h3 className="font-editorial text-xl text-ink">How to Wear It</h3>
              </div>
              <div className="space-y-2">
                {editorial.stylingTips.map((tip, i) => {
                  const accent =
                    tip.type === "pair"
                      ? "border-l-gold bg-gold/[0.04]"
                      : tip.type === "avoid"
                      ? "border-l-rose bg-rose/[0.04]"
                      : "border-l-sage bg-sage/[0.06]";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      className={`flex gap-3 p-3.5 rounded-xl border-l-[3px] ${accent}`}
                    >
                      <span className="text-[10px] font-inter font-bold tracking-[0.2em] uppercase text-ink-muted w-16 flex-shrink-0 mt-0.5">
                        {tip.label}
                      </span>
                      <p className="text-sm font-inter text-ink leading-snug flex-1">
                        {tip.tip}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Color Story — 5 swatches */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} className="text-ink" />
                <h3 className="font-editorial text-xl text-ink">Color Story</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {editorial.colorStory.map((swatch, i) => (
                  <motion.div
                    key={swatch.hex + i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className="text-center"
                  >
                    <div
                      className="aspect-square rounded-lg border border-ink/5 mb-1.5 shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={swatch.name}
                    />
                    <p className="text-[10px] font-inter tracking-[0.05em] text-ink-muted leading-tight truncate">
                      {swatch.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Steal the Look — Splurge / Mid / Save dupes */}
            {editorial.dupes.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-gold" />
                    <h3 className="font-editorial text-xl text-ink">Steal the Look</h3>
                  </div>
                  <span className="text-[10px] font-inter tracking-[0.18em] uppercase text-ink-muted">
                    Splurge · Save
                  </span>
                </div>
                <div className="space-y-3">
                  {editorial.dupes.map((d, i) => {
                    const Icon = dupeIcon[d.level];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.06 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-ivory border border-ink/5"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-cream border border-ink/10 flex items-center justify-center">
                            <Icon size={16} className={dupeColor[d.level]} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-[10px] font-inter font-bold tracking-[0.18em] uppercase ${dupeColor[d.level]}`}>
                              {dupeLabel[d.level]}
                            </span>
                            <span className="text-[10px] font-inter text-ink-muted/60">
                              · {d.category}
                            </span>
                          </div>
                          <p className="text-sm font-inter font-medium text-ink truncate">
                            {d.brand} <span className="font-normal text-ink-light">— {d.name}</span>
                          </p>
                          <p className="text-[11px] font-inter text-ink-muted leading-snug italic mt-0.5">
                            {d.note}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-editorial text-lg text-ink leading-none">
                            ${d.price.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
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
                  <ProductCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>

            {/* Related Looks rail — closes the loop */}
            {related.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-editorial text-xl text-ink">
                    Loved this? Try these
                  </h3>
                  <span className="text-[10px] font-inter tracking-[0.18em] uppercase text-ink-muted">
                    Editor's Picks
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {related.map((r, i) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowLookDetail(r)}
                      className="group text-left"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-ivory">
                        <img
                          src={r.image}
                          alt={r.title}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-2 pt-6">
                          <p className="text-[10px] font-inter text-white/70 truncate">
                            {r.occasion}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-inter font-medium text-ink truncate flex items-center gap-1">
                        {r.title}
                        <ArrowRight size={10} className="text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </motion.button>
                  ))}
                </div>
              </section>
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

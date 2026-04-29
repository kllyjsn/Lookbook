import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp, Tag, ArrowRight } from "lucide-react";
import type { Look } from "../../data/mockData";
import { dupeMap, feedLooks, priceDrops } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag as TagComponent } from "../ui/Tag";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface LookDetailProps {
  look: Look;
  onClose: () => void;
  onNavigate?: (look: Look) => void;
}

export function LookDetail({ look, onClose, onNavigate }: LookDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const saveLook = useStore((s) => s.saveLook);
  const addToCollection = useStore((s) => s.addToCollection);
  const showToast = useStore((s) => s.showToast);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const dupes = useMemo(() => {
    const allDupes = look.items.flatMap((item) => dupeMap[item.id] ?? []);
    return allDupes.slice(0, 4);
  }, [look.items]);

  const recommendations = useMemo(() => {
    return feedLooks
      .filter((l) => l.id !== look.id && l.mood === look.mood)
      .slice(0, 3);
  }, [look]);

  const itemsWithDrops = useMemo(() => {
    return look.items.map((item) => ({
      ...item,
      priceDrop: priceDrops[item.id] ?? null,
    }));
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
                <TagComponent key={tag.label} label={tag.label} color={tag.color} />
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
                    showToast("Added to Loved", "like");
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
                  showToast("Saved to Favorites", "save");
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
                {itemsWithDrops.map((item, i) => (
                  <div key={item.id} className="relative">
                    <ProductCard item={item} index={i} />
                    {item.priceDrop && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="absolute top-2 right-2 bg-rose text-white text-[9px] font-inter font-bold px-2 py-0.5 rounded-full"
                      >
                        -{item.priceDrop.dropPercent}%
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Get the Look for Less — dupe section */}
            {dupes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Tag size={18} className="text-sage" />
                  <h3 className="font-editorial text-xl text-ink">Get the Look for Less</h3>
                </div>
                <p className="text-xs font-inter text-ink-muted mb-4 italic">
                  Editor-approved alternatives at every price point
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {dupes.map((dupe, i) => (
                    <motion.div
                      key={dupe.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-ivory mb-3">
                        <img
                          src={dupe.image}
                          alt={dupe.name}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[9px] font-inter tracking-[0.15em] uppercase bg-sage/90 text-white px-2 py-0.5 rounded-full">
                            Save ${dupe.savings}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-inter tracking-[0.1em] uppercase text-ink-muted">
                          {dupe.brand}
                        </p>
                        <p className="text-sm font-inter text-ink leading-snug">{dupe.name}</p>
                        <p className="text-sm font-inter font-medium text-sage">${dupe.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* You Might Also Love */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Heart size={18} className="text-rose" />
                  <h3 className="font-editorial text-xl text-ink">You Might Also Love</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onNavigate?.(rec)}
                      className="flex-shrink-0 w-40 cursor-pointer group"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                          <p className="text-white text-xs font-inter font-medium leading-tight">
                            {rec.title}
                          </p>
                        </div>
                        {rec.badge && (
                          <div className="absolute top-2 right-2">
                            <span className="text-[8px] font-inter font-bold tracking-wider uppercase bg-gold/90 text-white px-2 py-0.5 rounded-full">
                              {rec.badge === "editors-pick" ? "Editor's Pick" : rec.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-inter text-ink-muted">{rec.priceRange}</span>
                        <ArrowRight size={10} className="text-ink-muted" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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

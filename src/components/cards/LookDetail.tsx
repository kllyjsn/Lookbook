import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Share2, Bookmark, TrendingUp, FolderPlus, Check } from "lucide-react";
import type { Look } from "../../data/mockData";
import { feedLooks } from "../../data/mockData";
import { ProductCard } from "./ProductCard";
import { Tag } from "../ui/Tag";
import { useStore, findSimilarLooks, computeStyleMatch } from "../../stores/useStore";

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
  const collections = useStore((s) => s.collections);
  const styleDNA = useStore((s) => s.styleDNA);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [savedToCollections, setSavedToCollections] = useState<Set<string>>(new Set());

  const matchScore = computeStyleMatch(look, styleDNA);
  const similarLooks = useMemo(() => findSimilarLooks(look, feedLooks, 3), [look]);

  const handleSaveToCollection = (collectionId: string) => {
    addToCollection(collectionId, look);
    setSavedToCollections((prev) => new Set(prev).add(collectionId));
  };

  const costPerWear = useMemo(() => {
    const totalCost = look.items.reduce((sum, item) => sum + item.price, 0);
    return Math.round(totalCost / 30);
  }, [look]);

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

            {/* Style match badge */}
            {matchScore > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute top-6 left-1/2 -translate-x-1/2"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/90 backdrop-blur-sm">
                  <span className="text-[9px] font-inter font-bold tracking-wider text-white">
                    {matchScore}% MATCH
                  </span>
                </div>
              </motion.div>
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

            {/* Engagement stats + cost-per-wear */}
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
              <span className="text-ink-muted/40">·</span>
              <span className="text-sm font-inter text-gold font-medium">
                ~${costPerWear}/wear
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

              {/* Collection picker button */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCollectionPicker(!showCollectionPicker)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                    saved
                      ? "border-gold/40 bg-gold/10"
                      : "border-ink/10 hover:border-ink/30"
                  }`}
                >
                  <FolderPlus
                    size={18}
                    className={saved ? "text-gold" : "text-ink-muted"}
                  />
                </motion.button>

                {/* Collection dropdown */}
                <AnimatePresence>
                  {showCollectionPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-ink/10 overflow-hidden z-10"
                    >
                      <div className="p-2">
                        <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted px-2 py-1.5">
                          Save to Collection
                        </p>
                        {collections.map((c) => (
                          <motion.button
                            key={c.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleSaveToCollection(c.id);
                              setSaved(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ivory transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Bookmark size={14} className="text-ink-muted" />
                              <span className="text-sm font-inter text-ink">
                                {c.name}
                              </span>
                              <span className="text-[10px] font-inter text-ink-muted">
                                ({c.looks.length})
                              </span>
                            </div>
                            {savedToCollections.has(c.id) && (
                              <Check size={14} className="text-gold" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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

            {/* Similar Looks section */}
            {similarLooks.length > 0 && (
              <div className="mb-10">
                <h3 className="font-editorial text-xl text-ink mb-1">You'll Also Love</h3>
                <p className="text-xs font-inter text-ink-muted mb-4">
                  Based on the style of this look
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {similarLooks.map((similar, i) => (
                    <motion.div
                      key={similar.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setShowLookDetail(similar)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                        <img
                          src={similar.image}
                          alt={similar.title}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-2">
                          <p className="text-white text-[10px] font-inter font-medium truncate">
                            {similar.title}
                          </p>
                          <p className="text-white/50 text-[8px] font-inter">
                            {similar.priceRange}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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

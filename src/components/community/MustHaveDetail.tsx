import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Bookmark, BadgeCheck, ShoppingBag } from "lucide-react";
import type { MustHaveList } from "../../data/communityData";
import { ProductCard } from "../cards/ProductCard";
import { FollowButton } from "./FollowButton";

interface MustHaveDetailProps {
  list: MustHaveList;
  onClose: () => void;
  onCreatorTap: (creatorId: string) => void;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function MustHaveDetail({ list, onClose, onCreatorTap }: MustHaveDetailProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalPrice = list.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-cream"
      >
        <div className="h-full overflow-y-auto">
          {/* Hero */}
          <div className="relative w-full aspect-[16/9]">
            <img
              src={list.coverImage}
              alt={list.name}
              className="img-editorial"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/60 block mb-2">
                  MUST HAVE LIST
                </span>
                <h1 className="font-editorial text-3xl text-white leading-tight mb-2">
                  {list.name}
                </h1>
              </motion.div>
            </div>

            {/* Close */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              <X size={18} className="text-ink" />
            </motion.button>

            <div className="absolute top-6 left-6">
              <span className="text-masthead text-sm text-white/80">LKBK</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Creator row */}
            <div className="flex items-center gap-3 mb-5">
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => onCreatorTap(list.creator.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <img
                  src={list.creator.avatar}
                  alt={list.creator.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/20"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-inter font-semibold text-ink">
                      {list.creator.displayName}
                    </span>
                    {list.creator.verified && (
                      <BadgeCheck size={14} className="text-gold" fill="currentColor" />
                    )}
                  </div>
                  <span className="text-[11px] font-inter text-ink-muted">
                    @{list.creator.username}
                  </span>
                </div>
              </motion.div>
              <FollowButton creatorId={list.creator.id} />
            </div>

            {/* Description */}
            <p className="font-subhead text-lg text-ink-light leading-relaxed italic mb-6">
              {list.description}
            </p>

            {/* Stats + actions */}
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors ${
                  liked ? "border-rose/30 bg-rose/5" : "border-ink/10"
                }`}
              >
                <Heart
                  size={16}
                  className={liked ? "text-rose" : "text-ink-muted"}
                  fill={liked ? "currentColor" : "none"}
                />
                <span className={`text-xs font-inter ${liked ? "text-rose" : "text-ink-muted"}`}>
                  {formatCount(list.likes + (liked ? 1 : 0))}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors ${
                  saved ? "border-gold/30 bg-gold/5" : "border-ink/10"
                }`}
              >
                <Bookmark
                  size={16}
                  className={saved ? "text-gold" : "text-ink-muted"}
                  fill={saved ? "currentColor" : "none"}
                />
                <span className={`text-xs font-inter ${saved ? "text-gold" : "text-ink-muted"}`}>
                  {formatCount(list.saves + (saved ? 1 : 0))}
                </span>
              </motion.button>

              <div className="ml-auto text-right">
                <p className="text-xs font-inter text-ink-muted">Total</p>
                <p className="text-sm font-inter font-semibold text-ink">${totalPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">
                  {list.items.length} Must-Have {list.items.length === 1 ? "Piece" : "Pieces"}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {list.items.map((item, i) => (
                  <ProductCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

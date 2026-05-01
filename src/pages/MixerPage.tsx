import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Wand2, Share2, Heart, RotateCcw } from "lucide-react";
import { useStore } from "../stores/useStore";
import type { LookItem } from "../data/mockData";
import { feedLooks } from "../data/mockData";

type SlotCategory = "Tops" | "Bottoms" | "Shoes" | "Bags" | "Accessories" | "Outerwear" | "Dresses";

const slotOrder: SlotCategory[] = ["Tops", "Outerwear", "Bottoms", "Shoes"];

function getItemsByCategory(category: SlotCategory): LookItem[] {
  const allItems = feedLooks.flatMap((look) => look.items);
  return allItems.filter((item) => item.category === category);
}

export function MixerPage() {
  const likedLooks = useStore((s) => s.likedLooks);
  const [slots, setSlots] = useState<Record<SlotCategory, LookItem | null>>({
    Tops: null,
    Bottoms: null,
    Shoes: null,
    Bags: null,
    Accessories: null,
    Outerwear: null,
    Dresses: null,
  });
  const [isShuffling, setIsShuffling] = useState(false);
  const [mixCount, setMixCount] = useState(0);
  const [savedMixes, setSavedMixes] = useState(0);

  const availableItems = useMemo(() => {
    const pool = likedLooks.length > 0 ? likedLooks : feedLooks.slice(0, 6);
    return pool.flatMap((look) => look.items);
  }, [likedLooks]);

  const handleShuffle = () => {
    setIsShuffling(true);
    setMixCount((c) => c + 1);

    setTimeout(() => {
      const newSlots = { ...slots };
      for (const category of slotOrder) {
        const categoryItems = availableItems.filter((item) => item.category === category);
        if (categoryItems.length > 0) {
          newSlots[category] = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        }
      }
      setSlots(newSlots);
      setIsShuffling(false);
    }, 600);
  };

  const handleSlotTap = (category: SlotCategory) => {
    const items = getItemsByCategory(category);
    if (items.length === 0) return;
    const current = slots[category];
    const currentIdx = current ? items.findIndex((i) => i.id === current.id) : -1;
    const next = items[(currentIdx + 1) % items.length];
    setSlots((prev) => ({ ...prev, [category]: next }));
  };

  const handleSaveMix = () => {
    setSavedMixes((c) => c + 1);
  };

  const filledSlots = slotOrder.filter((cat) => slots[cat] !== null);
  const totalPrice = filledSlots.reduce((sum, cat) => sum + (slots[cat]?.price ?? 0), 0);

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-editorial text-2xl text-ink">Outfit Mixer</h1>
          {mixCount > 0 && (
            <span className="text-[10px] font-inter text-ink-muted bg-ivory rounded-full px-3 py-1">
              {mixCount} mixes · {savedMixes} saved
            </span>
          )}
        </div>
        <p className="font-subhead text-sm text-ink-muted italic">
          Tap to swap pieces. Shuffle for surprise combos.
        </p>
      </div>

      {/* Mix Canvas */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {slotOrder.map((category, i) => {
            const item = slots[category];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSlotTap(category)}
                className="relative cursor-pointer group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden border border-ink/5 bg-ivory">
                  {item ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3 pt-8">
                          <p className="text-[10px] font-inter text-white/60 uppercase tracking-wider">
                            {item.brand}
                          </p>
                          <p className="text-xs font-inter text-white font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-inter text-gold">
                            ${item.price}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center mb-2">
                        <Shuffle size={16} className="text-ink-muted" />
                      </div>
                      <span className="text-[10px] font-inter text-ink-muted tracking-wider uppercase">
                        {category}
                      </span>
                      <span className="text-[9px] font-inter text-ink-muted/60 mt-0.5">
                        Tap or shuffle
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Price summary */}
      {filledSlots.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-6 mb-4 p-3 rounded-xl bg-ivory border border-ink/5 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-inter text-ink-muted uppercase tracking-wider">
              Total outfit
            </span>
            <p className="text-sm font-inter font-semibold text-ink">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-inter text-ink-muted uppercase tracking-wider">
              Cost per wear
            </span>
            <p className="text-sm font-inter font-semibold text-gold">
              ${Math.round(totalPrice / 30)}/wear
            </p>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="px-6 space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleShuffle}
          disabled={isShuffling}
          className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
        >
          <motion.div
            animate={isShuffling ? { rotate: 360 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Wand2 size={16} />
          </motion.div>
          {isShuffling ? "Mixing..." : "Shuffle Outfit"}
        </motion.button>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveMix}
            disabled={filledSlots.length === 0}
            className="flex-1 py-3 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Heart size={14} />
            Save Mix
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSlots({ Tops: null, Bottoms: null, Shoes: null, Bags: null, Accessories: null, Outerwear: null, Dresses: null })}
            className="flex-1 py-3 rounded-full border border-ink/15 text-ink font-inter text-sm font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Clear
          </motion.button>
        </div>

        {filledSlots.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-full bg-gold/10 text-gold font-inter text-sm font-medium flex items-center justify-center gap-2 border border-gold/20"
          >
            <Share2 size={14} />
            Share This Outfit
          </motion.button>
        )}
      </div>

      {/* Tips */}
      <div className="px-6 mt-8 mb-6">
        <div className="p-4 rounded-xl bg-ivory border border-ink/5">
          <p className="text-[10px] font-inter text-ink-muted uppercase tracking-wider mb-2">
            Styling Tip
          </p>
          <p className="text-xs font-inter text-ink-light leading-relaxed">
            The rule of three: mix one statement piece with two neutrals for effortless balance.
            Tap any slot to cycle through options, or hit shuffle for AI-curated combinations.
          </p>
        </div>
      </div>
    </div>
  );
}

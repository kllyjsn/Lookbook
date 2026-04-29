import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Heart, Bookmark, Clock, ChevronRight, Grid3X3, List, Plus, Trash2, Shuffle, Flame } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useStore } from "../stores/useStore";
import { StyleDNA } from "../components/ui/StyleDNA";
import { LookDetail } from "../components/cards/LookDetail";
import type { Look, LookItem } from "../data/mockData";

type ProfileSection = "dna" | "liked" | "collections" | "remix";

export function ProfilePage() {
  const styleDNA = useStore((s) => s.styleDNA);
  const likedLooks = useStore((s) => s.likedLooks);
  const collections = useStore((s) => s.collections);
  const streakCount = useStore((s) => s.streakCount);
  const remixSlots = useStore((s) => s.remixSlots);
  const setRemixSlot = useStore((s) => s.setRemixSlot);
  const clearRemix = useStore((s) => s.clearRemix);
  const createCollection = useStore((s) => s.createCollection);
  const removeFromCollection = useStore((s) => s.removeFromCollection);
  const [activeSection, setActiveSection] = useState<ProfileSection>("dna");
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const allLikedItems = useMemo(() => {
    const categories: Record<string, LookItem[]> = { Tops: [], Bottoms: [], Shoes: [], Accessories: [], Outerwear: [], Dresses: [], Bags: [] };
    for (const look of likedLooks) {
      for (const item of look.items) {
        const cat = item.category;
        if (cat in categories) categories[cat].push(item);
      }
    }
    return categories;
  }, [likedLooks]);

  const remixTotal = useMemo(() => {
    let total = 0;
    const allItems = likedLooks.flatMap((l) => l.items);
    for (const slotId of Object.values(remixSlots)) {
      if (slotId) {
        const item = allItems.find((i) => i.id === slotId);
        if (item) total += item.price;
      }
    }
    return total;
  }, [remixSlots, likedLooks]);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName("");
      setShowNewCollection(false);
    }
  };

  const currentCollection = collections.find((c) => c.id === selectedCollection);

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Logo variant="mark" size="sm" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/10"
          >
            <Settings size={16} className="text-ink-muted" />
          </motion.button>
        </div>

        {/* Profile avatar & name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center">
            <span className="font-editorial text-xl text-white">Y</span>
          </div>
          <div>
            <h2 className="font-editorial text-xl text-ink">Your Profile</h2>
            <p className="text-xs font-inter text-ink-muted">
              {likedLooks.length} looks loved · {collections.reduce((sum, c) => sum + c.looks.length, 0)} saved
            </p>
          </div>
        </div>

        {/* Streak badge */}
        {streakCount > 0 && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-full bg-gradient-to-r from-gold/10 to-rose/10 border border-gold/20 self-start">
            <Flame size={14} className="text-gold" />
            <span className="text-xs font-inter font-medium text-gold">{streakCount}-day streak</span>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-1 bg-ivory rounded-xl p-1">
          {([
            { id: "dna" as const, label: "Style DNA" },
            { id: "liked" as const, label: "Loved" },
            { id: "remix" as const, label: "Remix" },
            { id: "collections" as const, label: "Saved" },
          ]).map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-inter font-medium transition-all ${
                activeSection === tab.id
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6">
        <AnimatePresence mode="wait">
          {activeSection === "dna" && (
            <motion.div
              key="dna"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StyleDNA data={styleDNA} />

              {/* Style insights */}
              <div className="mt-8 space-y-4">
                <h3 className="font-editorial text-lg text-ink">
                  Style Insights
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: Heart,
                      title: "You lean toward clean lines",
                      desc: "Minimalist and classic pieces dominate your preferences",
                    },
                    {
                      icon: Clock,
                      title: "Seasonal shift detected",
                      desc: "Your style has been evolving toward warmer tones",
                    },
                    {
                      icon: Bookmark,
                      title: "Investment pieces",
                      desc: "You favor quality over quantity — great for capsule building",
                    },
                  ].map((insight, i) => (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="flex gap-3 p-4 rounded-xl bg-ivory"
                    >
                      <insight.icon
                        size={18}
                        className="text-gold flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-inter font-medium text-ink">
                          {insight.title}
                        </p>
                        <p className="text-xs font-inter text-ink-muted mt-0.5">
                          {insight.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "liked" && (
            <motion.div
              key="liked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {likedLooks.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <Heart size={32} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-base text-ink-muted italic">
                    No loved looks yet
                  </p>
                  <p className="text-xs font-inter text-ink-muted mt-1">
                    Swipe right on looks you love
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {likedLooks.map((look, i) => (
                    <motion.div
                      key={look.id + "-" + i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedLook(look)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                        <img
                          src={look.image}
                          alt={look.title}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                          <p className="text-white text-xs font-inter font-medium">
                            {look.title}
                          </p>
                          <p className="text-white/50 text-[10px] font-inter">
                            {look.occasion}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "remix" && (
            <motion.div
              key="remix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {likedLooks.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <Shuffle size={32} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-base text-ink-muted italic">
                    Like some looks first
                  </p>
                  <p className="text-xs font-inter text-ink-muted mt-1">
                    Your liked items will appear here to mix & match
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-editorial text-lg text-ink">Mix & Match</h3>
                      <p className="text-xs font-inter text-ink-muted">Build your own outfit from liked items</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={clearRemix}
                      className="text-xs font-inter text-ink-muted px-3 py-1.5 rounded-full border border-ink/10"
                    >
                      Clear
                    </motion.button>
                  </div>

                  {/* Remix slots */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {(["top", "bottom", "shoes", "accessory"] as const).map((slot) => {
                      const slotLabels = { top: "Top / Outerwear", bottom: "Bottoms / Dress", shoes: "Shoes", accessory: "Bag / Accessory" };
                      const itemId = remixSlots[slot];
                      const allItems = likedLooks.flatMap((l) => l.items);
                      const selectedItem = itemId ? allItems.find((i) => i.id === itemId) : null;

                      return (
                        <div key={slot} className="space-y-2">
                          <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                            {slotLabels[slot]}
                          </p>
                          {selectedItem ? (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative aspect-square rounded-xl overflow-hidden bg-ivory"
                            >
                              <img src={selectedItem.image} alt={selectedItem.name} className="img-editorial" />
                              <div className="absolute inset-x-0 bottom-0 gradient-bottom p-2">
                                <p className="text-[10px] font-inter text-white font-medium truncate">{selectedItem.name}</p>
                                <p className="text-[9px] font-inter text-white/60">${selectedItem.price}</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setRemixSlot(slot, null)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full glass flex items-center justify-center"
                              >
                                <span className="text-ink text-xs">×</span>
                              </motion.button>
                            </motion.div>
                          ) : (
                            <div className="aspect-square rounded-xl border-2 border-dashed border-ink/10 flex items-center justify-center bg-ivory/50">
                              <Plus size={20} className="text-ink/20" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Remix total */}
                  {remixTotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gold/10 border border-gold/20 mb-6"
                    >
                      <span className="text-xs font-inter font-medium text-ink">Remix Total</span>
                      <span className="text-sm font-inter font-bold text-gold">${remixTotal.toLocaleString()}</span>
                    </motion.div>
                  )}

                  {/* Available items by category */}
                  <h3 className="font-editorial text-base text-ink mb-3">Your Liked Pieces</h3>
                  {(["top", "bottom", "shoes", "accessory"] as const).map((slot) => {
                    const slotLabels = { top: "Tops & Outerwear", bottom: "Bottoms & Dresses", shoes: "Shoes", accessory: "Bags & Accessories" };
                    const slotCategories: Record<string, string[]> = {
                      top: ["Tops", "Outerwear"],
                      bottom: ["Bottoms", "Dresses"],
                      shoes: ["Shoes"],
                      accessory: ["Accessories", "Bags"],
                    };
                    const items = slotCategories[slot].flatMap((cat) => allLikedItems[cat] ?? []);
                    if (items.length === 0) return null;
                    return (
                      <div key={slot} className="mb-4">
                        <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mb-2">
                          {slotLabels[slot]}
                        </p>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                          {items.map((item) => (
                            <motion.button
                              key={item.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setRemixSlot(slot, item.id)}
                              className={`flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                                remixSlots[slot] === item.id
                                  ? "border-gold ring-1 ring-gold/30"
                                  : "border-transparent"
                              }`}
                            >
                              <div className="aspect-square">
                                <img src={item.image} alt={item.name} className="img-editorial" />
                              </div>
                              <div className="p-1.5 bg-ivory">
                                <p className="text-[8px] font-inter text-ink truncate">{item.brand}</p>
                                <p className="text-[9px] font-inter font-medium text-ink">${item.price}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "collections" && !selectedCollection && (
            <motion.div
              key="collections-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* New collection form */}
              <AnimatePresence>
                {showNewCollection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Collection name"
                        className="flex-1 bg-ivory rounded-xl px-4 py-3 text-sm font-inter text-ink outline-none border border-ink/5 focus:border-ink/20"
                        onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                        autoFocus
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateCollection}
                        className="px-4 py-3 rounded-xl bg-ink text-cream text-sm font-inter"
                      >
                        Create
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewCollection(!showNewCollection)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-ink/10 mb-4 hover:border-ink/20 transition-colors"
              >
                <Plus size={18} className="text-ink-muted" />
                <span className="text-sm font-inter text-ink-muted">
                  New Collection
                </span>
              </motion.button>

              <div className="space-y-2">
                {collections.map((collection, i) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCollection(collection.id)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-ivory cursor-pointer hover:bg-blush/20 transition-colors"
                  >
                    {/* Preview thumbnails */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-ink/5 flex-shrink-0">
                      {collection.looks[0] ? (
                        <img
                          src={collection.looks[0].image}
                          alt=""
                          className="img-editorial"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bookmark size={18} className="text-ink/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-inter text-sm font-medium text-ink">
                        {collection.name}
                      </p>
                      <p className="text-xs font-inter text-ink-muted">
                        {collection.looks.length} looks
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-ink-muted" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "collections" && selectedCollection && currentCollection && (
            <motion.div
              key="collection-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCollection(null)}
                  className="flex items-center gap-2 text-sm font-inter text-ink-muted"
                >
                  ← Back
                </motion.button>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsGridView(!isGridView)}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
                  >
                    {isGridView ? (
                      <List size={14} />
                    ) : (
                      <Grid3X3 size={14} />
                    )}
                  </motion.button>
                </div>
              </div>

              <h3 className="font-editorial text-xl text-ink mb-1">
                {currentCollection.name}
              </h3>
              <p className="text-xs font-inter text-ink-muted mb-4">
                {currentCollection.looks.length} looks saved
              </p>

              {currentCollection.looks.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <Bookmark size={32} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-base text-ink-muted italic">
                    This collection is empty
                  </p>
                  <p className="text-xs font-inter text-ink-muted mt-1">
                    Save looks from your feed to fill it up
                  </p>
                </div>
              ) : (
                <div
                  className={
                    isGridView
                      ? "grid grid-cols-2 gap-3"
                      : "space-y-3"
                  }
                >
                  {currentCollection.looks.map((look, i) => (
                    <motion.div
                      key={look.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative cursor-pointer"
                    >
                      {isGridView ? (
                        <div
                          onClick={() => setSelectedLook(look)}
                          className="relative aspect-[3/4] rounded-xl overflow-hidden"
                        >
                          <img
                            src={look.image}
                            alt={look.title}
                            className="img-editorial group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                            <p className="text-white text-xs font-inter font-medium">
                              {look.title}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCollection(
                                currentCollection.id,
                                look.id
                              );
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} className="text-ink" />
                          </motion.button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setSelectedLook(look)}
                          className="flex gap-4 p-3 rounded-xl bg-ivory hover:bg-blush/20 transition-colors"
                        >
                          <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={look.image}
                              alt={look.title}
                              className="img-editorial"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-inter text-sm font-medium text-ink">
                              {look.title}
                            </p>
                            <p className="font-subhead text-xs text-ink-muted italic mt-0.5">
                              {look.subtitle}
                            </p>
                            <p className="text-[10px] font-inter text-ink-muted mt-2">
                              {look.items.length} pieces · {look.priceRange}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Look Detail overlay */}
      <AnimatePresence>
        {selectedLook && (
          <LookDetail
            look={selectedLook}
            onClose={() => setSelectedLook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

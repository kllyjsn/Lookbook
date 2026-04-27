import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Heart, Bookmark, Clock, ChevronRight, Plus, Trash2, Flame, Zap, Shuffle, X } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useStore } from "../stores/useStore";
import { StyleDNA } from "../components/ui/StyleDNA";
import { LookDetail } from "../components/cards/LookDetail";
import type { Look, LookItem } from "../data/mockData";
import { getStyleLevel } from "../data/feedAlgorithm";

type ProfileSection = "dna" | "liked" | "collections" | "remix";

export function ProfilePage() {
  const styleDNA = useStore((s) => s.styleDNA);
  const likedLooks = useStore((s) => s.likedLooks);
  const collections = useStore((s) => s.collections);
  const createCollection = useStore((s) => s.createCollection);
  const removeFromCollection = useStore((s) => s.removeFromCollection);
  const streak = useStore((s) => s.streak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const remixOutfits = useStore((s) => s.remixOutfits);
  const createRemixOutfit = useStore((s) => s.createRemixOutfit);
  const deleteRemixOutfit = useStore((s) => s.deleteRemixOutfit);
  const [activeSection, setActiveSection] = useState<ProfileSection>("dna");
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [remixItems, setRemixItems] = useState<LookItem[]>([]);
  const [remixName, setRemixName] = useState("");
  const [showRemixBuilder, setShowRemixBuilder] = useState(false);

  const styleLevel = getStyleLevel(totalSwipes);

  const availableRemixItems = useMemo(() => {
    const seen = new Set<string>();
    const items: (LookItem & { lookTitle: string })[] = [];
    for (const look of likedLooks) {
      for (const item of look.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          items.push({ ...item, lookTitle: look.title });
        }
      }
    }
    return items;
  }, [likedLooks]);

  const toggleRemixItem = (item: LookItem) => {
    setRemixItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleSaveRemix = () => {
    if (remixItems.length > 0 && remixName.trim()) {
      createRemixOutfit(remixName.trim(), remixItems);
      setRemixItems([]);
      setRemixName("");
      setShowRemixBuilder(false);
    }
  };

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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center">
            <span className="font-editorial text-xl text-white">Y</span>
          </div>
          <div className="flex-1">
            <h2 className="font-editorial text-xl text-ink">Your Profile</h2>
            <p className="text-xs font-inter text-ink-muted">
              {likedLooks.length} looks loved · {collections.reduce((sum, c) => sum + c.looks.length, 0)} saved
            </p>
          </div>
        </div>

        {/* Streak + Style Level bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gold/8 to-gold/3 border border-gold/10">
            <Flame size={14} className="text-gold flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-inter font-bold tracking-[0.1em] uppercase text-gold">
                {streak > 0 ? `${streak}-day streak` : "Start your streak"}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-lavender/10 to-lavender/3 border border-lavender/15">
            <Zap size={14} className="text-lavender flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-inter font-bold tracking-[0.1em] uppercase text-lavender">
                {styleLevel.title}
              </p>
              <div className="w-full h-1 bg-lavender/10 rounded-full mt-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalSwipes / styleLevel.next) * 100, 100)}%` }}
                  className="h-full bg-lavender rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 bg-ivory rounded-xl p-1">
          {([
            { id: "dna" as const, label: "Style DNA" },
            { id: "liked" as const, label: "Loved" },
            { id: "collections" as const, label: "Collections" },
            { id: "remix" as const, label: "Remix" },
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-ink/10 text-ink-muted text-sm font-inter mb-4 hover:border-ink/20 transition-colors"
              >
                <Plus size={16} />
                New Collection
              </motion.button>

              <div className="space-y-3">
                {collections.map((collection, i) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCollection(collection.id)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-ivory cursor-pointer hover:bg-ivory/80 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/10 to-blush/10 flex items-center justify-center">
                      <Bookmark size={18} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-inter font-medium text-ink">
                        {collection.name}
                      </p>
                      <p className="text-xs font-inter text-ink-muted">
                        {collection.looks.length} {collection.looks.length === 1 ? "look" : "looks"}
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
              key={`collection-${selectedCollection}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCollection(null)}
                  className="text-sm font-inter text-ink-muted"
                >
                  ← Back
                </motion.button>
                <h3 className="font-editorial text-lg text-ink">
                  {currentCollection.name}
                </h3>
              </div>
              {currentCollection.looks.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <Bookmark size={32} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-base text-ink-muted italic">
                    No looks saved yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {currentCollection.looks.map((look, i) => (
                    <motion.div
                      key={look.id + "-" + i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group cursor-pointer relative"
                    >
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
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() =>
                          removeFromCollection(selectedCollection, look.id)
                        }
                        className="absolute top-2 right-2 w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} className="text-ink-muted" />
                      </motion.button>
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
              {/* Remix intro + builder toggle */}
              {!showRemixBuilder ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRemixBuilder(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-lavender/10 to-blush/10 border border-lavender/15 text-ink text-sm font-inter font-medium mb-6"
                  >
                    <Shuffle size={16} className="text-lavender" />
                    Create New Remix
                  </motion.button>

                  {remixOutfits.length === 0 ? (
                    <div className="flex flex-col items-center py-12">
                      <Shuffle size={32} className="text-ink/10 mb-3" />
                      <p className="font-subhead text-base text-ink-muted italic">
                        No remixes yet
                      </p>
                      <p className="text-xs font-inter text-ink-muted mt-1 text-center">
                        Mix & match items from your loved looks<br />to create custom outfits
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {remixOutfits.map((outfit) => (
                        <motion.div
                          key={outfit.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-ivory"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-inter font-medium text-ink">
                              {outfit.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-inter text-ink-muted">
                                {outfit.items.length} pieces · ${outfit.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => deleteRemixOutfit(outfit.id)}
                              >
                                <Trash2 size={12} className="text-ink-muted" />
                              </motion.button>
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {outfit.items.map((item) => (
                              <div key={item.id} className="flex-shrink-0 w-16">
                                <div className="aspect-square rounded-lg overflow-hidden bg-ivory mb-1">
                                  <img src={item.image} alt={item.name} className="img-editorial" />
                                </div>
                                <p className="text-[9px] font-inter text-ink-muted truncate">{item.brand}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Remix builder */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-editorial text-lg text-ink">Build Your Remix</h3>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setShowRemixBuilder(false); setRemixItems([]); setRemixName(""); }}
                    >
                      <X size={18} className="text-ink-muted" />
                    </motion.button>
                  </div>

                  <input
                    type="text"
                    value={remixName}
                    onChange={(e) => setRemixName(e.target.value)}
                    placeholder="Name your outfit (e.g., Sunday Brunch)"
                    className="w-full bg-ivory rounded-xl px-4 py-3 text-sm font-inter text-ink outline-none border border-ink/5 focus:border-ink/20 mb-4"
                  />

                  {/* Selected items preview */}
                  {remixItems.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-lavender/5 to-blush/5 border border-lavender/10">
                      <p className="text-[10px] font-inter font-bold tracking-[0.1em] uppercase text-lavender mb-2">
                        Your Remix ({remixItems.length} pieces · ${remixItems.reduce((s, i) => s + i.price, 0).toLocaleString()})
                      </p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {remixItems.map((item) => (
                          <motion.div
                            key={item.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRemixItem(item)}
                            className="flex-shrink-0 w-14 relative"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden ring-2 ring-lavender/30">
                              <img src={item.image} alt={item.name} className="img-editorial" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose flex items-center justify-center">
                              <X size={8} className="text-white" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableRemixItems.length === 0 ? (
                    <div className="flex flex-col items-center py-8">
                      <Heart size={24} className="text-ink/10 mb-2" />
                      <p className="text-xs font-inter text-ink-muted text-center">
                        Love some looks first to unlock items for remixing
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {availableRemixItems.map((item) => {
                        const isSelected = remixItems.some((i) => i.id === item.id);
                        return (
                          <motion.div
                            key={item.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRemixItem(item)}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-colors ${
                              isSelected ? "border-lavender" : "border-transparent"
                            }`}
                          >
                            <div className="aspect-square bg-ivory">
                              <img src={item.image} alt={item.name} className="img-editorial" />
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-[9px] font-inter text-ink-muted truncate">{item.brand}</p>
                              <p className="text-[10px] font-inter text-ink truncate">{item.name}</p>
                              <p className="text-[10px] font-inter font-medium text-ink">${item.price}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {remixItems.length > 0 && remixName.trim() && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveRemix}
                      className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium"
                    >
                      Save Remix
                    </motion.button>
                  )}
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
            key={selectedLook.id}
            look={selectedLook}
            onClose={() => setSelectedLook(null)}
            onNavigate={(rec) => setSelectedLook(rec)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

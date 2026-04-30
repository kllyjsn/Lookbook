import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Heart, Bookmark, Clock, ChevronRight, Grid3X3, List,
  Plus, Trash2, Flame, Share2, Scissors, TrendingUp, Zap,
} from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useStore } from "../stores/useStore";
import { StyleDNA } from "../components/ui/StyleDNA";
import { LookDetail } from "../components/cards/LookDetail";
import type { Look } from "../data/mockData";

type ProfileSection = "dna" | "liked" | "collections" | "remix";

function ShareStyleCard({ styleDNA, likedCount, streakCount }: { styleDNA: { style: string; percentage: number; color: string }[]; likedCount: number; streakCount: number }) {
  const topStyle = [...styleDNA].sort((a, b) => b.percentage - a.percentage)[0];
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    const text = `My Style DNA on LKBK:\n${styleDNA.map((d) => `${d.style}: ${d.percentage}%`).join("\n")}\n\nI'm ${topStyle?.percentage ?? 0}% ${topStyle?.style ?? "Unique"}. What's yours?`;
    if (navigator.share) {
      navigator.share({ title: "My LKBK Style DNA", text, url: window.location.href }).catch(() => {});
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-ink via-charcoal to-ink relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)" }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-masthead text-xs text-cream/60">LKBK</span>
          <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-cream/40">STYLE CARD</span>
        </div>
        <h3 className="font-editorial text-xl text-cream mb-1">
          {topStyle?.percentage ?? 0}% {topStyle?.style ?? "Unique"}
        </h3>
        <p className="font-subhead text-sm text-cream/60 italic mb-4">
          {likedCount} looks loved · {streakCount > 1 ? `${streakCount}-day streak` : "Just getting started"}
        </p>
        <div className="space-y-2 mb-5">
          {[...styleDNA].sort((a, b) => b.percentage - a.percentage).map((entry) => (
            <div key={entry.style} className="flex items-center gap-3">
              <span className="w-20 text-[10px] font-inter text-cream/70 tracking-wide">{entry.style}</span>
              <div className="flex-1 h-1.5 bg-cream/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${entry.percentage}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
              </div>
              <span className="w-8 text-right text-[10px] font-inter text-cream/50">{entry.percentage}%</span>
            </div>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="w-full py-3 rounded-full bg-cream/10 border border-cream/20 text-cream text-xs font-inter font-medium flex items-center justify-center gap-2 hover:bg-cream/15 transition-colors"
        >
          <Share2 size={12} />
          {shared ? "Link copied!" : "Share My Style DNA"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function ProfilePage() {
  const styleDNA = useStore((s) => s.styleDNA);
  const likedLooks = useStore((s) => s.likedLooks);
  const collections = useStore((s) => s.collections);
  const createCollection = useStore((s) => s.createCollection);
  const removeFromCollection = useStore((s) => s.removeFromCollection);
  const streakCount = useStore((s) => s.streakCount);
  const longestStreak = useStore((s) => s.longestStreak);
  const totalSwipes = useStore((s) => s.totalSwipes);
  const outfitBoards = useStore((s) => s.outfitBoards);
  const createOutfitBoard = useStore((s) => s.createOutfitBoard);
  const addItemToBoard = useStore((s) => s.addItemToBoard);
  const removeItemFromBoard = useStore((s) => s.removeItemFromBoard);
  const [activeSection, setActiveSection] = useState<ProfileSection>("dna");
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName("");
      setShowNewCollection(false);
    }
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createOutfitBoard(newBoardName.trim());
      setNewBoardName("");
      setShowNewBoard(false);
    }
  };

  const currentCollection = collections.find((c) => c.id === selectedCollection);
  const currentBoard = outfitBoards.find((b) => b.id === selectedBoard);

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

        {/* Profile avatar & name with streak */}
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center">
              <span className="font-editorial text-xl text-white">Y</span>
            </div>
            {streakCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-gold to-rose flex items-center justify-center border-2 border-cream"
              >
                <Flame size={10} className="text-white" />
              </motion.div>
            )}
          </div>
          <div>
            <h2 className="font-editorial text-xl text-ink">Your Profile</h2>
            <p className="text-xs font-inter text-ink-muted">
              {likedLooks.length} looks loved · {collections.reduce((sum, c) => sum + c.looks.length, 0)} saved
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-4">
          {[
            { icon: Flame, value: streakCount > 0 ? `${streakCount}d` : "—", label: "Streak" },
            { icon: Zap, value: String(totalSwipes), label: "Swipes" },
            { icon: TrendingUp, value: longestStreak > 0 ? `${longestStreak}d` : "—", label: "Best" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-ivory">
              <stat.icon size={14} className="text-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-inter font-semibold text-ink leading-none">{stat.value}</p>
                <p className="text-[9px] font-inter text-ink-muted tracking-wide uppercase">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 bg-ivory rounded-xl p-1">
          {([
            { id: "dna" as const, label: "Style DNA" },
            { id: "liked" as const, label: "Loved" },
            { id: "collections" as const, label: "Saved" },
            { id: "remix" as const, label: "Remix" },
          ]).map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveSection(tab.id); setSelectedCollection(null); setSelectedBoard(null); }}
              className={`flex-1 py-2.5 rounded-lg text-[11px] font-inter font-medium transition-all ${
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

              <ShareStyleCard styleDNA={styleDNA} likedCount={likedLooks.length} streakCount={streakCount} />

              {/* Style insights */}
              <div className="mt-8 space-y-4">
                <h3 className="font-editorial text-lg text-ink">Style Insights</h3>
                <div className="space-y-3">
                  {(likedLooks.length > 0 ? [
                    { icon: Heart, title: `${likedLooks.length > 5 ? "You have a sharp eye" : "Your taste is forming"}`, desc: likedLooks.length > 5 ? "Your preferences reveal a distinct point of view" : "Keep swiping to sharpen your Style DNA" },
                    { icon: Clock, title: "Seasonal shift detected", desc: "Your style has been evolving toward warmer tones" },
                    { icon: Bookmark, title: "Investment pieces", desc: "You favor quality over quantity — perfect for capsule building" },
                  ] : [
                    { icon: Heart, title: "Start discovering", desc: "Swipe through looks to build your Style DNA" },
                    { icon: Clock, title: "Your style will evolve", desc: "The more you swipe, the smarter your feed gets" },
                    { icon: Bookmark, title: "Every swipe matters", desc: "We learn what you love (and what you don't)" },
                  ]).map((insight, i) => (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="flex gap-3 p-4 rounded-xl bg-ivory"
                    >
                      <insight.icon size={18} className="text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-inter font-medium text-ink">{insight.title}</p>
                        <p className="text-xs font-inter text-ink-muted mt-0.5">{insight.desc}</p>
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
                  <p className="font-editorial text-lg text-ink mb-1">Your closet awaits</p>
                  <p className="font-subhead text-sm text-ink-muted italic text-center">
                    Swipe right on looks that speak to you.
                    <br />
                    Every love shapes your Style DNA.
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
                        <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                          <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                          <p className="text-white/50 text-[10px] font-inter">{look.occasion}</p>
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
                <span className="text-sm font-inter text-ink-muted">New Collection</span>
              </motion.button>

              {collections.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <Bookmark size={32} className="text-ink/10 mb-3" />
                  <p className="font-editorial text-lg text-ink mb-1">Curate your world</p>
                  <p className="font-subhead text-sm text-ink-muted italic text-center">
                    Save looks into collections — think of them as your personal mood boards.
                  </p>
                </div>
              ) : (
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
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-ink/5 flex-shrink-0">
                        {collection.looks[0] ? (
                          <img src={collection.looks[0].image} alt="" className="img-editorial" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Bookmark size={18} className="text-ink/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-inter text-sm font-medium text-ink">{collection.name}</p>
                        <p className="text-xs font-inter text-ink-muted">{collection.looks.length} looks</p>
                      </div>
                      <ChevronRight size={16} className="text-ink-muted" />
                    </motion.div>
                  ))}
                </div>
              )}
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
                    {isGridView ? <List size={14} /> : <Grid3X3 size={14} />}
                  </motion.button>
                </div>
              </div>

              <h3 className="font-editorial text-xl text-ink mb-1">{currentCollection.name}</h3>
              <p className="text-xs font-inter text-ink-muted mb-4">{currentCollection.looks.length} looks saved</p>

              {currentCollection.looks.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <Bookmark size={32} className="text-ink/10 mb-3" />
                  <p className="font-editorial text-lg text-ink mb-1">Empty — for now</p>
                  <p className="font-subhead text-sm text-ink-muted italic text-center">
                    Great style is just a swipe away.
                  </p>
                </div>
              ) : (
                <div className={isGridView ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                  {currentCollection.looks.map((look, i) => (
                    <motion.div
                      key={look.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative cursor-pointer"
                    >
                      {isGridView ? (
                        <div onClick={() => setSelectedLook(look)} className="relative aspect-[3/4] rounded-xl overflow-hidden">
                          <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                            <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); removeFromCollection(currentCollection.id, look.id); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} className="text-ink" />
                          </motion.button>
                        </div>
                      ) : (
                        <div onClick={() => setSelectedLook(look)} className="flex gap-4 p-3 rounded-xl bg-ivory hover:bg-blush/20 transition-colors">
                          <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={look.image} alt={look.title} className="img-editorial" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-inter text-sm font-medium text-ink">{look.title}</p>
                            <p className="font-subhead text-xs text-ink-muted italic mt-0.5">{look.subtitle}</p>
                            <p className="text-[10px] font-inter text-ink-muted mt-2">{look.items.length} pieces · {look.priceRange}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "remix" && !selectedBoard && (
            <motion.div
              key="remix-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Scissors size={16} className="text-ink" />
                  <h3 className="font-editorial text-lg text-ink">Outfit Remix</h3>
                </div>
                <p className="font-subhead text-sm text-ink-muted italic">
                  Mix pieces from your loved looks into custom outfits.
                </p>
              </div>

              <AnimatePresence>
                {showNewBoard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Board name (e.g., Date Night)"
                        className="flex-1 bg-ivory rounded-xl px-4 py-3 text-sm font-inter text-ink outline-none border border-ink/5 focus:border-ink/20"
                        onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                        autoFocus
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateBoard}
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
                onClick={() => setShowNewBoard(!showNewBoard)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-ink/10 mb-4 hover:border-ink/20 transition-colors"
              >
                <Plus size={18} className="text-ink-muted" />
                <span className="text-sm font-inter text-ink-muted">New Outfit Board</span>
              </motion.button>

              {outfitBoards.length === 0 && likedLooks.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <Scissors size={32} className="text-ink/10 mb-3" />
                  <p className="font-editorial text-lg text-ink mb-1">Be your own stylist</p>
                  <p className="font-subhead text-sm text-ink-muted italic text-center">
                    Love some looks first, then remix their pieces into custom outfits.
                  </p>
                </div>
              ) : (
                <>
                  {outfitBoards.map((board, i) => (
                    <motion.div
                      key={board.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedBoard(board.id)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-ivory cursor-pointer hover:bg-blush/20 transition-colors mb-2"
                    >
                      <div className="flex -space-x-2">
                        {board.items.slice(0, 3).map((item) => (
                          <div key={item.itemId} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-ivory">
                            <img src={item.image} alt={item.name} className="img-editorial" />
                          </div>
                        ))}
                        {board.items.length === 0 && (
                          <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center">
                            <Scissors size={14} className="text-ink/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-inter text-sm font-medium text-ink">{board.name}</p>
                        <p className="text-xs font-inter text-ink-muted">
                          {board.items.length} pieces · ${board.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-ink-muted" />
                    </motion.div>
                  ))}

                  {/* Quick-add from liked looks */}
                  {likedLooks.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mb-3">
                        Your loved pieces
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {likedLooks.slice(0, 6).flatMap((look) =>
                          look.items.slice(0, 1).map((item) => (
                            <motion.div
                              key={item.id}
                              whileTap={{ scale: 0.95 }}
                              className="relative aspect-square rounded-xl overflow-hidden"
                            >
                              <img src={item.image} alt={item.name} className="img-editorial" />
                              <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
                                <p className="text-[8px] font-inter text-white truncate">{item.brand}</p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeSection === "remix" && selectedBoard && currentBoard && (
            <motion.div
              key="board-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedBoard(null)}
                className="flex items-center gap-2 text-sm font-inter text-ink-muted mb-4"
              >
                ← Back
              </motion.button>

              <h3 className="font-editorial text-xl text-ink mb-1">{currentBoard.name}</h3>
              <p className="text-xs font-inter text-ink-muted mb-4">
                {currentBoard.items.length} pieces · Total: ${currentBoard.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
              </p>

              {currentBoard.items.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <Scissors size={28} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-sm text-ink-muted italic text-center">
                    Add pieces from your loved looks to build this outfit.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentBoard.items.map((item) => (
                    <div key={item.itemId} className="group relative">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-ivory">
                        <img src={item.image} alt={item.name} className="img-editorial" />
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-[10px] font-inter tracking-wide uppercase text-ink-muted">{item.brand}</p>
                        <p className="text-xs font-inter text-ink">{item.name}</p>
                        <p className="text-xs font-inter font-medium text-ink">${item.price}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItemFromBoard(currentBoard.id, item.itemId)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={10} className="text-ink" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add from liked looks */}
              {likedLooks.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mb-3">
                    Add pieces from loved looks
                  </h4>
                  {likedLooks.map((look) => (
                    <div key={look.id} className="mb-4">
                      <p className="text-xs font-inter font-medium text-ink mb-2">{look.title}</p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {look.items.map((item) => {
                          const isAdded = currentBoard.items.some((i) => i.itemId === item.id);
                          return (
                            <motion.button
                              key={item.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (isAdded) {
                                  removeItemFromBoard(currentBoard.id, item.id);
                                } else {
                                  addItemToBoard(currentBoard.id, look.id, {
                                    itemId: item.id, name: item.name, brand: item.brand,
                                    price: item.price, image: item.image, category: item.category,
                                  });
                                }
                              }}
                              className="flex-shrink-0 w-20"
                            >
                              <div className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${isAdded ? "border-gold" : "border-transparent"}`}>
                                <img src={item.image} alt={item.name} className="img-editorial" />
                              </div>
                              <p className="text-[8px] font-inter text-ink-muted mt-1 truncate text-center">{item.brand}</p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
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
          <LookDetail look={selectedLook} onClose={() => setSelectedLook(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

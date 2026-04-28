import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Plus, Check, X } from "lucide-react";
import { useStore } from "../../stores/useStore";

export function QuickSaveSheet() {
  const quickSaveLook = useStore((s) => s.quickSaveLook);
  const setQuickSaveLook = useStore((s) => s.setQuickSaveLook);
  const collections = useStore((s) => s.collections);
  const addToCollection = useStore((s) => s.addToCollection);
  const createCollection = useStore((s) => s.createCollection);
  const [savedTo, setSavedTo] = useState<string[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  const scheduleDismiss = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => {
      dismissTimer.current = null;
      setQuickSaveLook(null);
      setSavedTo([]);
      setShowNew(false);
      setNewName("");
    }, 600);
  };

  const handleSave = (collectionId: string) => {
    if (!quickSaveLook) return;
    addToCollection(collectionId, quickSaveLook);
    setSavedTo((prev) => [...prev, collectionId]);
    scheduleDismiss();
  };

  const handleCreate = () => {
    if (!newName.trim() || !quickSaveLook) return;
    const id = createCollection(newName.trim());
    addToCollection(id, quickSaveLook);
    setNewName("");
    setShowNew(false);
    setSavedTo([id]);
    scheduleDismiss();
  };

  const handleClose = () => {
    if (dismissTimer.current) { clearTimeout(dismissTimer.current); dismissTimer.current = null; }
    setQuickSaveLook(null);
    setSavedTo([]);
    setShowNew(false);
    setNewName("");
  };

  return (
    <AnimatePresence>
      {quickSaveLook && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-cream rounded-t-3xl safe-bottom"
          >
            <div className="w-12 h-1 bg-ink/10 rounded-full mx-auto mt-3 mb-2" />
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-gold" />
                  <h3 className="font-editorial text-lg text-ink">Save to Collection</h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
                >
                  <X size={14} className="text-ink-muted" />
                </motion.button>
              </div>

              {/* Look preview */}
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-ivory">
                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={quickSaveLook.image}
                    alt={quickSaveLook.title}
                    className="img-editorial"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-ink truncate">
                    {quickSaveLook.title}
                  </p>
                  <p className="text-xs font-inter text-ink-muted">
                    {quickSaveLook.items.length} pieces · {quickSaveLook.priceRange}
                  </p>
                </div>
              </div>

              {/* Collections list */}
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {collections.map((col) => {
                  const isSaved = savedTo.includes(col.id) ||
                    col.looks.some((l) => l.id === quickSaveLook.id);
                  return (
                    <motion.button
                      key={col.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !isSaved && handleSave(col.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isSaved
                          ? "bg-gold/10 border border-gold/20"
                          : "bg-ivory hover:bg-ivory/80 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center">
                          {isSaved ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Check size={14} className="text-gold" />
                            </motion.div>
                          ) : (
                            <Bookmark size={14} className="text-ink-muted" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-inter font-medium text-ink">
                            {col.name}
                          </p>
                          <p className="text-[10px] font-inter text-ink-muted">
                            {col.looks.length} look{col.looks.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      {isSaved && (
                        <span className="text-[10px] font-inter font-medium text-gold tracking-wider uppercase">
                          Saved
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* New collection inline form */}
              <AnimatePresence>
                {showNew ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New collection name"
                        className="flex-1 bg-ivory rounded-xl px-4 py-3 text-sm font-inter text-ink outline-none border border-ink/5 focus:border-ink/20"
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        autoFocus
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreate}
                        className="px-4 py-3 rounded-xl bg-ink text-cream text-sm font-inter"
                      >
                        Create
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNew(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-ink/15 hover:border-ink/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center">
                      <Plus size={14} className="text-ink-muted" />
                    </div>
                    <span className="text-sm font-inter text-ink-muted">
                      New Collection
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

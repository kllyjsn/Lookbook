import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "../../stores/useStore";

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BagDrawer({ isOpen, onClose }: BagDrawerProps) {
  const bagItems = useStore((s) => s.bagItems);
  const removeFromBag = useStore((s) => s.removeFromBag);
  const clearBag = useStore((s) => s.clearBag);

  const total = bagItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] bg-cream rounded-t-3xl overflow-hidden"
          >
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-ink/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-ink" />
                <h2 className="font-editorial text-xl text-ink">Your Bag</h2>
                <span className="text-xs font-inter text-ink-muted">
                  {bagItems.length} {bagItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {bagItems.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={clearBag}
                    className="text-xs font-inter text-ink-muted hover:text-rose transition-colors"
                  >
                    Clear all
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] px-6 py-4">
              {bagItems.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <ShoppingBag size={32} className="text-ink/10 mb-3" />
                  <p className="font-subhead text-base text-ink-muted italic">
                    Your bag is empty
                  </p>
                  <p className="text-xs font-inter text-ink-muted mt-1">
                    Tap + on any item to add it
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bagItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-ivory"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="img-editorial" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">
                          {item.brand}
                        </p>
                        <p className="text-sm font-inter text-ink truncate">
                          {item.name}
                        </p>
                        <p className="text-sm font-inter font-medium text-ink">
                          ${item.price}
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromBag(item.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10 hover:border-rose/40 hover:bg-rose/5 transition-colors"
                      >
                        <Trash2 size={12} className="text-ink-muted" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {bagItems.length > 0 && (
              <div className="px-6 py-4 border-t border-ink/5 safe-bottom">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-inter text-ink-muted">Total</span>
                  <span className="font-editorial text-xl text-ink">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium"
                >
                  Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

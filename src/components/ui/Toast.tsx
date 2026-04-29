import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Undo2, Flame } from "lucide-react";
import { useStore } from "../../stores/useStore";

const iconMap = {
  like: Heart,
  save: Bookmark,
  undo: Undo2,
  streak: Flame,
} as const;

export function ToastContainer() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} id={toast.id} text={toast.text} icon={toast.icon} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  text,
  icon,
  onDismiss,
}: {
  id: string;
  text: string;
  icon: keyof typeof iconMap;
  onDismiss: (id: string) => void;
}) {
  const Icon = iconMap[icon];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 2000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass border border-ink/10 rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg mx-auto w-fit"
    >
      <Icon
        size={14}
        className={icon === "like" ? "text-rose" : icon === "streak" ? "text-gold" : "text-ink"}
        fill={icon === "like" || icon === "streak" ? "currentColor" : "none"}
      />
      <span className="text-xs font-inter font-medium text-ink">{text}</span>
    </motion.div>
  );
}

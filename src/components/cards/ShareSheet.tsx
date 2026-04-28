import { motion } from "framer-motion";
import { X, Link2, MessageCircle } from "lucide-react";
import type { Look } from "../../data/mockData";
import { useState } from "react";

interface ShareSheetProps {
  look: Look;
  onClose: () => void;
}

const channels = [
  { id: "instagram", label: "Story", icon: "IG", bg: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { id: "tiktok", label: "TikTok", icon: "TT", bg: "bg-ink" },
  { id: "pinterest", label: "Pin It", icon: "Pi", bg: "bg-red-600" },
  { id: "messages", label: "Message", icon: null, bg: "bg-green-500" },
  { id: "copy", label: "Copy Link", icon: null, bg: "bg-ink/10" },
];

export function ShareSheet({ look, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (channelId: string) => {
    if (channelId === "copy") {
      navigator.clipboard
        .writeText(`${window.location.origin}/#look/${look.id}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
      return;
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="relative w-full max-w-lg bg-cream rounded-t-3xl px-6 pt-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-ink/10 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-editorial text-lg text-ink">Share this look</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
          >
            <X size={14} className="text-ink-muted" />
          </motion.button>
        </div>

        {/* Look preview */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-ivory">
          <img
            src={look.image}
            alt={look.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-inter font-medium text-ink truncate">
              {look.title}
            </p>
            <p className="text-xs font-inter text-ink-muted truncate">
              {look.items.length} pieces · {look.priceRange}
            </p>
          </div>
        </div>

        {/* Share channels */}
        <div className="flex justify-between">
          {channels.map((ch, i) => (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleShare(ch.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  ch.id === "copy" && copied ? "bg-green-500" : ch.bg
                }`}
              >
                {ch.id === "messages" ? (
                  <MessageCircle size={18} className="text-white" />
                ) : ch.id === "copy" ? (
                  <Link2
                    size={18}
                    className={copied ? "text-white" : "text-ink-muted"}
                  />
                ) : (
                  <span className="text-white text-xs font-inter font-bold">
                    {ch.icon}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-inter text-ink-muted">
                {ch.id === "copy" && copied ? "Copied!" : ch.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

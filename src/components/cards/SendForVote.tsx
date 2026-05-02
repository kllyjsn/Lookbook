import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Check, Send, Sparkles } from "lucide-react";
import type { Look } from "../../data/mockData";

interface SendForVoteProps {
  look: Look;
  onClose: () => void;
}

const FRIENDS = [
  { name: "Maya", avatar: "photo-1494790108377-be9c29b29330", verdict: "wear it", reaction: "Obsessed. The wide-leg makes the look." },
  { name: "Jordan", avatar: "photo-1500648767791-00dcc994a43e", verdict: "wear it", reaction: "Yes — but switch to flats if you're walking." },
  { name: "Riley", avatar: "photo-1531746020798-e6953c6e8e04", verdict: "skip it", reaction: "Save the dress for later in the season." },
  { name: "Sara", avatar: "photo-1438761681033-6461ffad8d80", verdict: "wear it", reaction: "Goes with everything you already own." },
];

const A = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=120&h=120&fit=crop&q=80`;

export function SendForVote({ look, onClose }: SendForVoteProps) {
  const [stage, setStage] = useState<"compose" | "sending" | "results">("compose");
  const [message, setMessage] = useState("Wear or skip? Need a vote 🗳️");
  const [selectedIdx, setSelectedIdx] = useState<number[]>([0, 1, 2, 3]);
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    if (stage !== "results") return;
    const ids = selectedIdx;
    let cancelled = false;
    ids.forEach((id, i) => {
      setTimeout(() => {
        if (!cancelled) setRevealed((prev) => [...prev, id]);
      }, 400 * (i + 1));
    });
    return () => {
      cancelled = true;
    };
  }, [stage, selectedIdx]);

  const handleSend = () => {
    setStage("sending");
    setTimeout(() => setStage("results"), 1100);
  };

  const wearVotes = revealed
    .map((id) => FRIENDS[id])
    .filter((f) => f.verdict === "wear it").length;
  const totalRevealed = revealed.length;
  const wearPct = totalRevealed > 0 ? Math.round((wearVotes / totalRevealed) * 100) : 0;
  const verdict =
    totalRevealed === selectedIdx.length
      ? wearPct >= 50
        ? "WEAR IT"
        : "SKIP IT"
      : null;

  const toggleFriend = (i: number) => {
    setSelectedIdx((prev) =>
      prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i],
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      >
        <motion.div
          key="sheet"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-cream rounded-3xl overflow-hidden border border-ink/10"
        >
          <div className="relative h-32 overflow-hidden">
            <img src={look.image} alt={look.title} className="img-editorial" />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[9px] font-inter tracking-[0.25em] uppercase text-ink-muted">
                Send for a Vote
              </span>
              <h3 className="font-editorial text-lg text-ink leading-tight">
                {look.title}
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3">
            {stage === "compose" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xs font-inter text-ink-muted mb-3">
                  Share with your style brain trust. Get instant verdicts.
                </p>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-ivory border border-ink/10 text-sm font-inter text-ink outline-none focus:border-ink/30 resize-none mb-3"
                />

                <div className="mb-4">
                  <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted">
                    Send to
                  </span>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {FRIENDS.map((f, i) => {
                      const on = selectedIdx.includes(i);
                      return (
                        <motion.button
                          key={f.name}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFriend(i)}
                          className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
                            on ? "bg-ink/5" : ""
                          }`}
                        >
                          <div className={`relative ${on ? "ring-2 ring-gold rounded-full p-[2px]" : ""}`}>
                            <img
                              src={A(f.avatar)}
                              alt={f.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {on && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                                <Check size={11} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-inter text-ink-light">{f.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedIdx.length === 0}
                  onClick={handleSend}
                  className="w-full py-3 rounded-full bg-ink text-cream text-sm font-inter font-medium flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Send size={14} />
                  Send to {selectedIdx.length} {selectedIdx.length === 1 ? "friend" : "friends"}
                </motion.button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: `LKBK — ${look.title}`,
                          text: message,
                          url: window.location.href,
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(`${look.title} — ${window.location.href}`);
                    }
                  }}
                  className="w-full py-2.5 mt-2 rounded-full border border-ink/15 text-ink-light text-xs font-inter flex items-center justify-center gap-2"
                >
                  <Share2 size={12} />
                  Or share to other apps
                </button>
              </motion.div>
            )}

            {stage === "sending" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full border-2 border-ink/10 border-t-gold mb-3"
                />
                <p className="text-sm font-inter text-ink-muted">Sending look…</p>
              </motion.div>
            )}

            {stage === "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-inter tracking-[0.25em] uppercase text-ink-muted">
                      Verdict
                    </span>
                    <h4 className="font-editorial text-2xl text-ink leading-tight">
                      {verdict ?? "Tallying…"}
                    </h4>
                  </div>
                  {verdict === "WEAR IT" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30"
                    >
                      <Sparkles size={12} className="text-gold" />
                      <span className="text-[10px] font-inter font-semibold tracking-[0.15em] uppercase text-gold">
                        {wearPct}% YES
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {selectedIdx.map((i) => {
                    const f = FRIENDS[i];
                    const isRevealed = revealed.includes(i);
                    return (
                      <motion.div
                        key={f.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-ivory border border-ink/5"
                      >
                        <img
                          src={A(f.avatar)}
                          alt={f.name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-inter font-semibold text-ink">{f.name}</span>
                            {isRevealed ? (
                              <span
                                className={`text-[10px] font-inter font-bold tracking-[0.1em] uppercase ${
                                  f.verdict === "wear it" ? "text-gold" : "text-rose"
                                }`}
                              >
                                {f.verdict}
                              </span>
                            ) : (
                              <span className="text-[10px] font-inter text-ink-muted/60">typing…</span>
                            )}
                          </div>
                          <p className="text-xs font-inter text-ink-light">
                            {isRevealed ? f.reaction : "…"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-full bg-ink text-cream text-sm font-inter font-medium"
                >
                  Done
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

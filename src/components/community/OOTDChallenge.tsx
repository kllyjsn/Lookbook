import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, Camera, Upload, Trophy, Clock, BadgeCheck, Check } from "lucide-react";
import { ootdEntries } from "../../data/communityData";
import { useStore } from "../../stores/useStore";

interface OOTDChallengeProps {
  onClose: () => void;
}

function formatVotes(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function OOTDChallenge({ onClose }: OOTDChallengeProps) {
  const ootdVotes = useStore((s) => s.ootdVotes);
  const votedOOTDIds = useStore((s) => s.votedOOTDIds);
  const voteOOTD = useStore((s) => s.voteOOTD);
  const ootdJoined = useStore((s) => s.ootdJoined);
  const ootdSubmittedImage = useStore((s) => s.ootdSubmittedImage);
  const submitOOTD = useStore((s) => s.submitOOTD);
  const joinOOTD = useStore((s) => s.joinOOTD);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(ootdSubmittedImage);
  const [showThanks, setShowThanks] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const sortedEntries = [...ootdEntries].sort((a, b) => {
    const va = ootdVotes[a.id] ?? a.votes;
    const vb = ootdVotes[b.id] ?? b.votes;
    return vb - va;
  });

  const handleStartSubmit = () => {
    joinOOTD();
    setShowComposer(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setIsReadingFile(false);
        return;
      }
      const img = new Image();
      img.onload = () => {
        // Downscale to fit within 512x512 and encode as JPEG so the
        // persisted data URL stays well under the localStorage quota.
        const MAX = 512;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setPreviewUrl(reader.result as string);
          setIsReadingFile(false);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
        } catch {
          setPreviewUrl(reader.result as string);
        }
        setIsReadingFile(false);
      };
      img.onerror = () => {
        setIsReadingFile(false);
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      setIsReadingFile(false);
    };
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    if (!previewUrl) return;
    submitOOTD(previewUrl);
    setShowComposer(false);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 2400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto pb-32">
        {/* Hero */}
        <div className="relative aspect-[16/10]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=560&fit=crop&q=80"
            alt="OOTD challenge"
            className="img-editorial"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <X size={16} className="text-ink" />
          </motion.button>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-gold" />
              <span className="text-[10px] font-inter font-bold tracking-[0.25em] uppercase text-gold">
                Daily Challenge
              </span>
            </div>
            <h2 className="font-editorial text-3xl text-white leading-tight mb-1">
              OOTD: Summer Whites
            </h2>
            <p className="font-subhead text-sm text-white/70 italic max-w-sm">
              Style an all-white look. Top votes get featured on the For You feed tomorrow.
            </p>
            <div className="flex items-center gap-3 mt-3 text-[11px] font-inter text-white/60">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                8h 23m left
              </span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1">
                <Trophy size={11} />
                {sortedEntries.length} entries
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pt-5 pb-3">
          {ootdSubmittedImage ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gold/10 border border-gold/20">
              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={ootdSubmittedImage} alt="Your entry" className="img-editorial" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-inter font-bold tracking-[0.18em] uppercase text-gold mb-0.5">
                  Your entry is in
                </p>
                <p className="text-xs font-inter text-ink-light">
                  Good luck — winners announced tomorrow.
                </p>
              </div>
              <Check size={20} className="text-gold flex-shrink-0" />
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleStartSubmit}
              className="w-full py-3.5 rounded-full bg-ink text-cream text-sm font-inter font-medium flex items-center justify-center gap-2"
            >
              <Camera size={14} />
              {ootdJoined ? "Continue submitting" : "Submit your look"}
            </motion.button>
          )}
        </div>

        {/* Leaderboard */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-editorial text-lg text-ink mb-1">Leaderboard</h3>
          <p className="font-subhead text-xs text-ink-muted italic mb-4">
            Tap the heart to cast your vote. One vote per look.
          </p>
        </div>

        <div className="px-6">
          <ul className="grid grid-cols-2 gap-3">
            {sortedEntries.map((entry, i) => {
              const votes = ootdVotes[entry.id] ?? entry.votes;
              const voted = votedOOTDIds.includes(entry.id);
              return (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-ivory mb-2">
                    <img src={entry.image} alt={entry.caption} className="img-editorial" />
                    <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3 pb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <img
                          src={entry.creator.avatar}
                          alt={entry.creator.displayName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[10px] font-inter font-medium text-white truncate">
                          {entry.creator.displayName}
                        </span>
                        {entry.creator.verified && (
                          <BadgeCheck size={10} className="text-gold flex-shrink-0" fill="currentColor" />
                        )}
                      </div>
                    </div>
                    {/* Rank badge */}
                    {i < 3 && (
                      <div
                        className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-inter font-bold ${
                          i === 0
                            ? "bg-gold text-white"
                            : i === 1
                              ? "bg-white/90 text-ink"
                              : "bg-rose/80 text-white"
                        }`}
                      >
                        {i + 1}
                      </div>
                    )}
                    {/* Vote button */}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => voteOOTD(entry.id)}
                      disabled={voted}
                      className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-inter font-semibold backdrop-blur-md ${
                        voted ? "bg-rose text-white" : "bg-white/85 text-ink hover:bg-white"
                      }`}
                    >
                      <motion.span
                        animate={voted ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart size={11} fill={voted ? "currentColor" : "none"} />
                      </motion.span>
                      {formatVotes(votes)}
                    </motion.button>
                  </div>
                  <p className="text-[11px] font-inter text-ink-light leading-snug px-0.5 line-clamp-2">
                    {entry.caption}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Composer */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComposer(false)}
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end justify-center"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-cream rounded-t-3xl p-6 pt-3 safe-bottom"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-1 rounded-full bg-ink/15" />
                </div>
                <h3 className="font-editorial text-xl text-ink mb-1">
                  Submit your white look
                </h3>
                <p className="font-subhead text-sm text-ink-muted italic mb-5">
                  One photo. Top 3 entries get featured.
                </p>
                {previewUrl ? (
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                    <img src={previewUrl} alt="Preview" className="img-editorial" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 text-ink text-xs font-inter font-medium"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-ink/15 flex flex-col items-center justify-center bg-ivory mb-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mb-3">
                      <Upload size={22} className="text-ink-muted" />
                    </div>
                    <p className="text-sm font-inter text-ink mb-1">
                      Tap to upload your fit
                    </p>
                    <p className="text-[11px] font-inter text-ink-muted">
                      Camera or gallery
                    </p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
                <button
                  disabled={!previewUrl || isReadingFile}
                  onClick={handleSubmit}
                  className={`w-full py-3.5 rounded-full text-sm font-inter font-medium flex items-center justify-center gap-2 ${
                    previewUrl && !isReadingFile
                      ? "bg-ink text-cream"
                      : "bg-ink/15 text-ink/40 pointer-events-none"
                  }`}
                >
                  <Sparkles size={14} />
                  {isReadingFile ? "Processing..." : "Submit my look"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thanks toast */}
        <AnimatePresence>
          {showThanks && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-full bg-ink text-cream text-sm font-inter shadow-xl flex items-center gap-2"
            >
              <Sparkles size={14} className="text-gold" />
              Entry submitted — good luck!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

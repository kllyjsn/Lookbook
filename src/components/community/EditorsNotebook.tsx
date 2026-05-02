import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowLeft, X, Newspaper, Quote } from "lucide-react";
import { notebookEssays, type NotebookEssay } from "../../data/editorialData";
import { feedLooks, type Look } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

// EditorsNotebook is intentionally self-contained: opening a related look
// routes through the store so the LookDetail overlay survives the tab switch
// from Community → Feed.

function EssayCard({
  essay,
  index,
  onTap,
}: {
  essay: NotebookEssay;
  index: number;
  onTap: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.985 }}
      onClick={onTap}
      className="w-full text-left rounded-2xl overflow-hidden bg-ivory border border-ink/5 hover:border-ink/15 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={essay.cover} alt={essay.hed} className="img-editorial" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[8px] font-inter font-bold tracking-[0.25em] uppercase text-white bg-ink/55 backdrop-blur-sm rounded-full px-2.5 py-1">
            {essay.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <Clock size={10} className="text-white/80" />
          <span className="text-[10px] font-inter text-white/80">{essay.readMins} min</span>
        </div>
      </div>
      <div className="px-4 py-4">
        <h3 className="font-editorial text-xl text-ink leading-tight mb-1.5">
          {essay.hed}
        </h3>
        <p className="font-subhead text-sm text-ink-light italic line-clamp-2 mb-2">
          {essay.dek}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
            {essay.byline}
          </span>
          <span className="text-[10px] font-inter text-ink-muted/70">
            {new Date(essay.publishedISO + "T00:00:00").toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function EssayDetail({
  essay,
  onClose,
}: {
  essay: NotebookEssay;
  onClose: () => void;
}) {
  const setActiveTab = useStore((s) => s.setActiveTab);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const related = essay.relatedLookIds
    .map((id) => feedLooks.find((l) => l.id === id))
    .filter((x): x is Look => Boolean(x));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[55] bg-cream overflow-y-auto"
    >
      {/* Hero */}
      <div className="relative w-full aspect-[3/4] max-h-[60vh]">
        <img src={essay.cover} alt={essay.hed} className="img-editorial" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-ink" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <X size={16} className="text-ink" />
        </button>
        <div className="absolute bottom-0 inset-x-0 p-6 pb-8">
          <span className="text-[9px] font-inter font-bold tracking-[0.3em] uppercase text-gold">
            {essay.category}
          </span>
          <h1 className="font-editorial text-3xl text-white leading-[1.05] mt-2">
            {essay.hed}
          </h1>
          <p className="font-subhead text-base text-white/85 italic mt-1.5 max-w-md">
            {essay.dek}
          </p>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-2xl mx-auto px-6 pt-6 pb-32">
        <div className="flex items-center gap-3 text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted mb-6">
          <span>{essay.byline}</span>
          <span className="text-ink-muted/40">·</span>
          <span>
            {new Date(essay.publishedISO + "T00:00:00").toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-ink-muted/40">·</span>
          <span>{essay.readMins} min read</span>
        </div>

        {essay.body.map((p, i) => (
          <p
            key={i}
            className="font-inter text-base text-ink-light leading-relaxed mb-5 first-letter:font-editorial first-letter:text-3xl first-letter:font-semibold first-letter:mr-1 first-letter:float-left first-letter:leading-[1.1] first-letter:text-ink"
          >
            {p}
          </p>
        ))}

        {/* Pull quote */}
        <div className="my-8 p-6 border-l-4 border-gold rounded-r-2xl bg-ivory">
          <Quote size={18} className="text-gold mb-2" />
          <p className="font-editorial text-2xl text-ink italic leading-snug">
            “{essay.pullQuote}”
          </p>
        </div>

        {/* Related looks */}
        {related.length > 0 && (
          <div className="mt-8">
            <h4 className="font-editorial text-lg text-ink mb-3">In This Story</h4>
            <div className="grid grid-cols-2 gap-3">
              {related.map((look) => (
                <motion.button
                  key={look.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    // Route through the global store so the look detail
                    // survives FeedPage mounting after the tab switch.
                    onClose();
                    setShowLookDetail(look);
                    setActiveTab("feed");
                  }}
                  className="text-left"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <img src={look.image} alt={look.title} className="img-editorial" />
                    <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                      <p className="text-white text-xs font-inter font-medium">
                        {look.title}
                      </p>
                      <p className="text-white/60 text-[10px] font-inter">
                        {look.occasion}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}

export function EditorsNotebook() {
  const [open, setOpen] = useState<NotebookEssay | null>(null);

  return (
    <div className="px-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Newspaper size={14} className="text-gold" />
        <p className="font-subhead text-sm text-ink-light italic">
          Trend reports, manifestos, and editor's letters. Filed daily.
        </p>
      </div>
      {notebookEssays.map((essay, i) => (
        <EssayCard
          key={essay.id}
          essay={essay}
          index={i}
          onTap={() => setOpen(essay)}
        />
      ))}

      <AnimatePresence>
        {open && (
          <EssayDetail
            essay={open}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

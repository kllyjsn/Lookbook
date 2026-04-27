import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Hash, Flame, ArrowLeft, Sparkles, Eye } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { trendReports, trendingHashtags } from "../data/trendData";
import type { TrendReport } from "../data/trendData";
import { feedLooks } from "../data/mockData";
import { LookDetail } from "../components/cards/LookDetail";
import type { Look } from "../data/mockData";

function TrendReportDetail({
  report,
  onClose,
}: {
  report: TrendReport;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto pb-24">
        <div className="relative w-full aspect-[3/4] max-h-[55vh]">
          <img src={report.coverImage} alt={report.title} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 pb-8">
            <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-white/50 block mb-2">
              TREND REPORT · {report.season}
            </span>
            <h1 className="font-editorial text-4xl text-white leading-tight mb-1">
              {report.title}
            </h1>
            <p className="font-subhead text-lg text-white/70 italic">
              {report.subtitle}
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-ink" />
          </motion.button>
          <div className="absolute top-6 right-6">
            <span className="text-masthead text-sm text-white/80">LKBK</span>
          </div>
        </div>

        <div className="px-6 pt-8">
          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {report.tags.map((tag) => (
              <span
                key={tag.label}
                className="text-[10px] font-inter tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Editorial description */}
          <p className="font-subhead text-xl text-ink-light leading-relaxed italic mb-8">
            {report.description}
          </p>

          {/* Color Palette */}
          <div className="mb-8">
            <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
              THE COLOR PALETTE
            </h3>
            <div className="flex gap-2">
              {report.colorPalette.map((color) => (
                <div
                  key={color}
                  className="flex-1 aspect-square rounded-xl"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Key Pieces */}
          <div className="mb-8">
            <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
              KEY PIECES TO INVEST IN
            </h3>
            <div className="space-y-2">
              {report.keyPieces.map((piece, i) => (
                <motion.div
                  key={piece}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-ivory"
                >
                  <span className="w-6 h-6 rounded-full bg-ink text-cream text-[10px] font-inter font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-inter text-ink">{piece}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mood Board */}
          <div className="mb-8">
            <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
              MOOD BOARD
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {report.moodImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img src={img} alt="" className="img-editorial" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrendingPage() {
  const [selectedReport, setSelectedReport] = useState<TrendReport | null>(null);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  const hotLooks = feedLooks.filter((l) => l.trending).slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Logo variant="mark" size="sm" />
          <span className="flex items-center gap-1.5 text-[10px] font-inter tracking-[0.15em] uppercase text-rose font-semibold">
            <Flame size={12} />
            Live
          </span>
        </div>
        <h1 className="font-editorial text-2xl text-ink mb-0.5">Trending</h1>
        <p className="font-subhead text-sm text-ink-muted italic">
          What the fashion world is wearing right now.
        </p>
      </div>

      {/* Trending Hashtags — horizontal scroll */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
            TRENDING TAGS
          </h2>
          <TrendingUp size={12} className="text-ink-muted" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {trendingHashtags.map((hashtag, i) => (
            <motion.div
              key={hashtag.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 px-4 py-2.5 rounded-2xl border border-ink/10 bg-ivory"
            >
              <div className="flex items-center gap-2 mb-1">
                <Hash size={10} style={{ color: hashtag.color }} />
                <span className="text-xs font-inter font-semibold text-ink whitespace-nowrap">
                  {hashtag.tag}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-inter text-ink-muted">
                  {hashtag.postCount}
                </span>
                <span className="text-[10px] font-inter font-semibold text-green-600">
                  {hashtag.growth}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trend Reports */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
            THIS WEEK'S TREND REPORTS
          </h2>
          <Sparkles size={12} className="text-gold" />
        </div>
        <div className="space-y-4">
          {trendReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(report)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={report.coverImage}
                  alt={report.title}
                  className="img-editorial group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-white/50 block mb-1">
                    {report.season}
                  </span>
                  <h3 className="font-editorial text-xl text-white leading-tight mb-0.5">
                    {report.title}
                  </h3>
                  <p className="font-subhead text-sm text-white/60 italic">
                    {report.subtitle}
                  </p>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  {report.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="text-[8px] font-inter tracking-[0.15em] uppercase text-white/80 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
                {/* Color palette preview */}
                <div className="absolute top-4 right-4 flex gap-1">
                  {report.colorPalette.slice(0, 3).map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hot Right Now */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
            HOT RIGHT NOW
          </h2>
          <Flame size={12} className="text-rose" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hotLooks.map((look, i) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLook(look)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="img-editorial group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3 pb-4">
                  <p className="text-white text-xs font-inter font-medium leading-tight">
                    {look.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Eye size={10} className="text-white/50" />
                    <span className="text-[10px] font-inter text-white/50">
                      {look.likes >= 1000 ? `${(look.likes / 1000).toFixed(1)}K` : look.likes}
                    </span>
                  </div>
                </div>
                {look.badge && (
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-inter font-bold tracking-[0.1em] uppercase text-white bg-rose/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                      {look.badge === "editors-pick" ? "Editor's Pick" : look.badge === "trending" ? "Hot" : "New"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Editor's Tip */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-ink"
        >
          <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-gold block mb-2">
            EDITOR'S TIP
          </span>
          <p className="font-subhead text-base text-cream/90 italic leading-relaxed">
            "The biggest mistake in fashion is trying too hard. The best-dressed
            people in the room always look like they didn't think about it.
            Invest in fit, not logos."
          </p>
          <p className="text-[10px] font-inter text-cream/40 mt-3">
            — LKBK Editorial Team
          </p>
        </motion.div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {selectedReport && (
          <TrendReportDetail
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>
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

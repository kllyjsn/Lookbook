import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, ChevronRight, X } from "lucide-react";
import { trendRadar } from "../../data/mockData";
import type { TrendItem, TrendStatus } from "../../data/mockData";

const statusConfig: Record<TrendStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  rising: { label: "Rising", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  peaking: { label: "Peaking", icon: Zap, color: "text-gold", bg: "bg-gold/10" },
  fading: { label: "Fading", icon: TrendingDown, color: "text-ink-muted", bg: "bg-ink/5" },
};

function TrendCard({ trend, index }: { trend: TrendItem; index: number }) {
  const config = statusConfig[trend.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex-shrink-0 w-[260px] rounded-2xl overflow-hidden bg-ivory border border-ink/5"
    >
      <div className="relative h-32">
        <img src={trend.image} alt={trend.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-editorial text-lg text-white leading-tight">{trend.name}</h3>
        </div>
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} backdrop-blur-sm`}>
          <Icon size={10} className={config.color} />
          <span className={`text-[9px] font-inter font-semibold ${config.color}`}>{config.label}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[11px] font-inter text-ink-muted leading-relaxed line-clamp-2">
          {trend.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-inter font-semibold ${trend.change > 0 ? "text-green-600" : "text-ink-muted"}`}>
            {trend.change > 0 ? "+" : ""}{trend.change}%
          </span>
          <span className="text-[9px] font-inter text-ink-muted tracking-wider uppercase">this week</span>
        </div>
      </div>
    </motion.div>
  );
}

export function TrendRadar() {
  const [expanded, setExpanded] = useState(false);
  const risingTrends = trendRadar.filter((t) => t.status === "rising");
  const peakingTrends = trendRadar.filter((t) => t.status === "peaking");
  const fadingTrends = trendRadar.filter((t) => t.status === "fading");

  return (
    <>
      {/* Compact horizontal scroller */}
      <div className="mb-2">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-gold" />
            <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink">
              Trend Radar
            </h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-[10px] font-inter text-ink-muted"
          >
            See all <ChevronRight size={12} />
          </motion.button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {trendRadar.slice(0, 4).map((trend, i) => (
            <TrendCard key={trend.id} trend={trend} index={i} />
          ))}
        </div>
      </div>

      {/* Expanded full view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-cream overflow-y-auto"
          >
            <div className="px-6 pt-6 pb-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-editorial text-2xl text-ink">Trend Radar</h1>
                  <p className="font-subhead text-sm text-ink-muted italic">What's moving in fashion this week</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpanded(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/10"
                >
                  <X size={16} className="text-ink" />
                </motion.button>
              </div>

              {/* Rising */}
              {risingTrends.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-green-600" />
                    <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-green-600">Rising</h3>
                  </div>
                  <div className="space-y-3">
                    {risingTrends.map((trend, i) => (
                      <TrendRow key={trend.id} trend={trend} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Peaking */}
              {peakingTrends.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-gold" />
                    <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-gold">At Their Peak</h3>
                  </div>
                  <div className="space-y-3">
                    {peakingTrends.map((trend, i) => (
                      <TrendRow key={trend.id} trend={trend} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Fading */}
              {fadingTrends.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown size={14} className="text-ink-muted" />
                    <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">Cooling Off</h3>
                  </div>
                  <div className="space-y-3">
                    {fadingTrends.map((trend, i) => (
                      <TrendRow key={trend.id} trend={trend} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TrendRow({ trend, index }: { trend: TrendItem; index: number }) {
  const config = statusConfig[trend.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-3 rounded-xl bg-ivory"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        <img src={trend.image} alt={trend.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-inter font-medium text-ink">{trend.name}</p>
        <p className="text-[11px] font-inter text-ink-muted truncate">{trend.description}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className={`text-sm font-inter font-semibold ${trend.change > 0 ? "text-green-600" : "text-ink-muted"}`}>
          {trend.change > 0 ? "+" : ""}{trend.change}%
        </span>
        <span className={`text-[8px] font-inter font-semibold tracking-wider uppercase ${config.color}`}>
          {config.label}
        </span>
      </div>
    </motion.div>
  );
}

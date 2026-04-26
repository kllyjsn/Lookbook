import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { trendForecasts } from "../../data/mockData";
import { Tag } from "../ui/Tag";

export function TrendForecast() {
  return (
    <div className="px-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-gold" />
        <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">
          Trend Forecast
        </h2>
      </div>
      <div className="space-y-4">
        {trendForecasts.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 mb-2">
                  {trend.tags.map((tag) => (
                    <Tag key={tag.label} label={tag.label} color={tag.color} />
                  ))}
                  <span className="ml-auto text-[9px] font-inter font-semibold tracking-[0.1em] uppercase text-white/50">
                    {trend.season}
                  </span>
                </div>
                <h3 className="font-editorial text-xl text-white leading-tight mb-0.5">
                  {trend.title}
                </h3>
                <p className="font-subhead text-sm text-white/70 italic mb-3">
                  {trend.subtitle}
                </p>
                <p className="text-xs font-inter text-white/60 leading-relaxed line-clamp-2 mb-3">
                  {trend.prediction}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trend.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-gold rounded-full"
                      />
                    </div>
                    <span className="text-[10px] font-inter font-medium text-gold">
                      {trend.confidence}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-inter text-white/40">
                    Read more <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

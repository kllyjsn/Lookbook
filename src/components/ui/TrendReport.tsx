import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import type { Look } from "../../data/mockData";

interface TrendReportProps {
  likedLooks: Look[];
}

interface TrendItem {
  label: string;
  direction: "up" | "down" | "stable";
  detail: string;
}

function analyzeTrends(likedLooks: Look[]): TrendItem[] {
  if (likedLooks.length < 2) {
    return [
      { label: "Keep swiping", direction: "stable", detail: "We need more data to spot your trends" },
    ];
  }

  const tagCounts: Record<string, number> = {};
  const occasionCounts: Record<string, number> = {};
  let totalPrice = 0;
  let itemCount = 0;

  for (const look of likedLooks) {
    for (const tag of look.tags) {
      tagCounts[tag.label] = (tagCounts[tag.label] ?? 0) + 1;
    }
    occasionCounts[look.occasion] = (occasionCounts[look.occasion] ?? 0) + 1;
    for (const item of look.items) {
      totalPrice += item.price;
      itemCount++;
    }
  }

  const topTag = Object.entries(tagCounts).sort(([, a], [, b]) => b - a)[0];
  const topOccasion = Object.entries(occasionCounts).sort(([, a], [, b]) => b - a)[0];
  const avgPrice = itemCount > 0 ? Math.round(totalPrice / itemCount) : 0;

  const trends: TrendItem[] = [];

  if (topTag) {
    trends.push({
      label: `${topTag[0]} is your top style`,
      direction: "up",
      detail: `Appears in ${topTag[1]} of your ${likedLooks.length} loved looks`,
    });
  }

  if (topOccasion) {
    trends.push({
      label: `Most saved for: ${topOccasion[0]}`,
      direction: "up",
      detail: `${topOccasion[1]} looks saved for this occasion`,
    });
  }

  trends.push({
    label: `Avg. item price: $${avgPrice}`,
    direction: avgPrice > 400 ? "up" : avgPrice > 200 ? "stable" : "down",
    detail: avgPrice > 400 ? "You gravitate toward investment pieces" : avgPrice > 200 ? "Balanced between splurge and save" : "Great eye for affordable finds",
  });

  const brandCounts: Record<string, number> = {};
  for (const look of likedLooks) {
    for (const item of look.items) {
      brandCounts[item.brand] = (brandCounts[item.brand] ?? 0) + 1;
    }
  }
  const topBrand = Object.entries(brandCounts).sort(([, a], [, b]) => b - a)[0];
  if (topBrand && topBrand[1] >= 2) {
    trends.push({
      label: `Brand affinity: ${topBrand[0]}`,
      direction: "up",
      detail: `${topBrand[1]} items from this brand in your saves`,
    });
  }

  return trends;
}

const directionIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const directionColor = {
  up: "text-sage",
  down: "text-rose",
  stable: "text-ink-muted",
};

export function TrendReport({ likedLooks }: TrendReportProps) {
  const trends = analyzeTrends(likedLooks);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-lavender" />
        <h3 className="font-editorial text-lg text-ink">Your Trend Report</h3>
      </div>
      <div className="space-y-3">
        {trends.map((trend, i) => {
          const Icon = directionIcon[trend.direction];
          return (
            <motion.div
              key={trend.label}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-3 p-4 rounded-xl bg-ivory"
            >
              <div className={`flex-shrink-0 mt-0.5 ${directionColor[trend.direction]}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-inter font-medium text-ink">
                  {trend.label}
                </p>
                <p className="text-xs font-inter text-ink-muted mt-0.5">
                  {trend.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

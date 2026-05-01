import type { Look, StyleDNAEntry } from "../data/mockData";

const tagToStyle: Record<string, string> = {
  "Minimalist": "Minimalist",
  "Office": "Classic",
  "Romantic": "Romantic",
  "Evening": "Romantic",
  "Streetwear": "Streetwear",
  "Casual": "Streetwear",
  "Glamour": "Avant-Garde",
  "Adventure": "Classic",
  "Utility": "Classic",
  "Chic": "Minimalist",
  "Feminine": "Romantic",
  "Social": "Romantic",
  "Tailored": "Classic",
  "Power": "Classic",
  "Clean": "Minimalist",
  "Scandi": "Minimalist",
  "Quiet Luxury": "Classic",
  "Investment": "Classic",
  "Tokyo": "Avant-Garde",
  "Creative": "Avant-Garde",
  "Statement": "Avant-Garde",
  "Corporate": "Classic",
  "Siren": "Avant-Garde",
  "Coastal": "Classic",
  "Festival": "Avant-Garde",
  "Boho": "Romantic",
  "Vintage": "Romantic",
  "Sustainable": "Minimalist",
};

export function computeStyleMatchScore(look: Look, styleDNA: StyleDNAEntry[]): number {
  if (styleDNA.length === 0) return 0;

  const dnaMap = new Map(styleDNA.map((d) => [d.style, d.percentage]));
  let totalWeight = 0;
  let matchCount = 0;

  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (style) {
      const pct = dnaMap.get(style) ?? 0;
      totalWeight += pct;
      matchCount++;
    }
  }

  if (matchCount === 0) return 50;

  const avgPct = totalWeight / matchCount;
  const normalized = Math.min(99, Math.max(40, Math.round(avgPct * 2.5 + 30)));
  return normalized;
}

export function getMatchLabel(score: number): string {
  if (score >= 90) return "Perfect Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Good Fit";
  return "Explore";
}

export function getMatchColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 75) return "text-gold";
  if (score >= 60) return "text-white/80";
  return "text-white/50";
}

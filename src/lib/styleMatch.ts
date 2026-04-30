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

export function computeStyleMatch(look: Look, styleDNA: StyleDNAEntry[]): number {
  if (styleDNA.length === 0) return 75;
  const dnaMap = new Map(styleDNA.map((d) => [d.style, d.percentage]));
  let score = 0;
  let tagCount = 0;
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (style) {
      score += dnaMap.get(style) ?? 0;
      tagCount++;
    }
  }
  if (tagCount === 0) return 72;
  const rawMatch = score / tagCount;
  return Math.min(99, Math.max(65, Math.round(rawMatch * 2.5 + 30)));
}

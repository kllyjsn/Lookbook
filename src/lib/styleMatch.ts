import type { Look, StyleDNAEntry } from "../data/mockData";

const tagToStyle: Record<string, string> = {
  Minimalist: "Minimalist",
  Office: "Classic",
  Romantic: "Romantic",
  Evening: "Romantic",
  Streetwear: "Streetwear",
  Casual: "Streetwear",
  Glamour: "Avant-Garde",
  Adventure: "Classic",
  Utility: "Classic",
  Chic: "Minimalist",
  Feminine: "Romantic",
  Social: "Romantic",
  Tailored: "Classic",
  Power: "Classic",
  Clean: "Minimalist",
  Scandi: "Minimalist",
  "Quiet Luxury": "Classic",
  Investment: "Classic",
  Tokyo: "Avant-Garde",
  Creative: "Avant-Garde",
  Statement: "Avant-Garde",
  Corporate: "Classic",
  Siren: "Avant-Garde",
  Coastal: "Classic",
  Festival: "Avant-Garde",
  Boho: "Romantic",
  Vintage: "Romantic",
  Sustainable: "Minimalist",
};

export function computeMatchScore(look: Look, dna: StyleDNAEntry[]): number {
  if (dna.length === 0) return 0;
  const lookStyles = look.tags
    .map((t) => tagToStyle[t.label])
    .filter(Boolean);
  if (lookStyles.length === 0) return 50;

  let score = 0;
  for (const style of lookStyles) {
    const entry = dna.find((d) => d.style === style);
    if (entry) score += entry.percentage;
  }
  return Math.min(99, Math.max(60, Math.round(score / lookStyles.length + 40)));
}

export function getRecommendationReason(
  look: Look,
  dna: StyleDNAEntry[],
  likedCount: number
): string {
  if (look.editorsChoice) return "Editor's Pick for you";
  if (look.trending && look.likes > 15000) return "Trending right now";

  const topStyle = [...dna].sort((a, b) => b.percentage - a.percentage)[0];
  const lookStyles = look.tags.map((t) => tagToStyle[t.label]).filter(Boolean);

  if (topStyle && lookStyles.includes(topStyle.style) && likedCount > 0) {
    return `Because you love ${topStyle.style}`;
  }

  if (look.badge === "new") return "Fresh drop";
  if (look.trending) return "Trending in your feed";
  return "Curated for you";
}

const categoryWearEstimates: Record<string, number> = {
  Tops: 120,
  Outerwear: 80,
  Bottoms: 100,
  Shoes: 150,
  Dresses: 60,
  Bags: 200,
  Accessories: 250,
};

export function costPerWear(price: number, category: string): string {
  const wears = categoryWearEstimates[category] ?? 100;
  const cpw = price / wears;
  return cpw < 1 ? `$${cpw.toFixed(2)}` : `$${cpw.toFixed(cpw < 10 ? 1 : 0)}`;
}

export function extractColorPalette(look: Look): string[] {
  const palette: string[] = [];
  for (const tag of look.tags) {
    if (tag.color && !palette.includes(tag.color)) palette.push(tag.color);
  }
  const moodColors: Record<string, string[]> = {
    minimal: ["#1A1A1A", "#FAF9F6", "#8A8A8A"],
    romantic: ["#E8D5D0", "#C4797A", "#B8A9C9"],
    street: ["#2D2D2D", "#4A4A4A", "#1A1A1A"],
    evening: ["#1A1A1A", "#C5A572", "#B8A9C9"],
    classic: ["#C5A572", "#1A1A1A", "#FAF9F6"],
    adventure: ["#A8B5A0", "#8A8A8A", "#C5A572"],
  };
  const extras = moodColors[look.mood] ?? [];
  for (const c of extras) {
    if (!palette.includes(c) && palette.length < 5) palette.push(c);
  }
  return palette.slice(0, 5);
}

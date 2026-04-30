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
  "Classic": "Classic",
  "Festival": "Avant-Garde",
  "Boho": "Romantic",
  "Vintage": "Romantic",
  "Sustainable": "Minimalist",
};

export function computeStyleMatch(look: Look, styleDNA: StyleDNAEntry[]): number {
  if (styleDNA.length === 0) return 50;

  const dnaMap: Record<string, number> = {};
  for (const entry of styleDNA) {
    dnaMap[entry.style] = entry.percentage;
  }

  let matchScore = 0;
  let tagCount = 0;
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (style && style in dnaMap) {
      matchScore += dnaMap[style];
      tagCount++;
    }
  }

  if (tagCount === 0) return 40;
  const raw = matchScore / tagCount;
  return Math.min(99, Math.max(25, Math.round(raw * 1.4)));
}

export function computeCostPerWear(price: number, category: string): { cpw: number; wears: number } {
  const wearsPerYear: Record<string, number> = {
    "Tops": 80,
    "Bottoms": 70,
    "Outerwear": 50,
    "Shoes": 100,
    "Dresses": 30,
    "Accessories": 120,
    "Bags": 150,
  };
  const wears = wearsPerYear[category] ?? 60;
  return { cpw: Math.round((price / wears) * 100) / 100, wears };
}

export function findSimilarLooks(look: Look, allLooks: Look[], limit = 4): Look[] {
  const lookStyles = new Set(look.tags.map((t) => tagToStyle[t.label]).filter(Boolean));

  const scored = allLooks
    .filter((l) => l.id !== look.id)
    .map((candidate) => {
      let score = 0;
      for (const tag of candidate.tags) {
        const style = tagToStyle[tag.label];
        if (style && lookStyles.has(style)) score += 3;
      }
      if (candidate.mood === look.mood) score += 2;
      if (candidate.season === look.season) score += 1;
      return { look: candidate, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.look);
}

export interface OutfitFormula {
  id: string;
  title: string;
  subtitle: string;
  occasion: string;
  pieces: string[];
  tip: string;
}

export const outfitFormulas: OutfitFormula[] = [
  {
    id: "formula-1",
    title: "The 3-Piece Date Night",
    subtitle: "Effortless romance",
    occasion: "Date Night",
    pieces: ["Silk camisole", "High-waist trouser", "Strappy heel"],
    tip: "Let one piece do the talking — keep the other two neutral.",
  },
  {
    id: "formula-2",
    title: "Power Meeting Formula",
    subtitle: "Boardroom authority",
    occasion: "Work",
    pieces: ["Structured blazer", "Straight-leg trouser", "Pointed pump"],
    tip: "Match your bag to your shoes for instant polish.",
  },
  {
    id: "formula-3",
    title: "Weekend Uniform",
    subtitle: "Saturday to Sunday",
    occasion: "Weekend",
    pieces: ["Oversized tee", "Straight-leg jeans", "White sneakers", "Crossbody bag"],
    tip: "Roll the sleeves and half-tuck for effortless cool.",
  },
  {
    id: "formula-4",
    title: "Vacation Capsule",
    subtitle: "Pack light, look incredible",
    occasion: "Travel",
    pieces: ["Linen shirt", "Wide-leg pants", "Flat sandals", "Woven tote"],
    tip: "Stick to one color family — everything mixes better.",
  },
];

export interface SeasonalColor {
  name: string;
  hex: string;
  pantone: string;
}

export interface SeasonalColorStory {
  season: string;
  year: string;
  title: string;
  description: string;
  colors: SeasonalColor[];
}

export const currentColorStory: SeasonalColorStory = {
  season: "Spring/Summer",
  year: "2025",
  title: "Soft Power",
  description: "This season's palette whispers authority. Muted earth tones meet unexpected pastels — the colors of quiet confidence.",
  colors: [
    { name: "Desert Sand", hex: "#C8B8A0", pantone: "14-1118" },
    { name: "Slate Lavender", hex: "#9B8FBF", pantone: "16-3817" },
    { name: "Warm Ivory", hex: "#F0E8D8", pantone: "11-0507" },
    { name: "Dried Rose", hex: "#B87878", pantone: "17-1520" },
    { name: "Moss", hex: "#7A8B6A", pantone: "17-0215" },
    { name: "Storm Grey", hex: "#6B6E70", pantone: "18-4005" },
  ],
};

export interface TrendReport {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  description: string;
}

const UNSPLASH = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const trendReports: TrendReport[] = [
  {
    id: "trend-1",
    title: "Quiet Luxury Is Evolving",
    subtitle: "Less logo, more texture",
    image: UNSPLASH("photo-1558618666-fcd25c85f82e"),
    category: "Movement",
    description: "The stealth-wealth aesthetic is shifting from plain neutrals to rich textures — think bouclé, cashmere blends, and tonal layering.",
  },
  {
    id: "trend-2",
    title: "The Return of the Midi",
    subtitle: "Below the knee, above the rest",
    image: UNSPLASH("photo-1572804013309-59a88b7e92f1"),
    category: "Silhouette",
    description: "Midi lengths are back with a vengeance. A-line, pleated, or bias-cut — the midi skirt is this season's hardest-working piece.",
  },
  {
    id: "trend-3",
    title: "Burgundy Is the New Black",
    subtitle: "The color taking over everything",
    image: UNSPLASH("photo-1469334031218-e382a71b716b"),
    category: "Color",
    description: "From runway to street, deep burgundy is replacing black as the go-to dark neutral. Rich, warm, and universally flattering.",
  },
  {
    id: "trend-4",
    title: "Deconstructed Tailoring",
    subtitle: "Suits, but make them soft",
    image: UNSPLASH("photo-1539109136881-3be0616acf4b"),
    category: "Details",
    description: "Unstructured shoulders, raw edges, and relaxed fits — tailoring is having an identity crisis, and we're here for it.",
  },
];

export function generateDynamicInsights(
  likedLooks: Look[],
  passedLooks: Look[],
  styleDNA: StyleDNAEntry[],
): { icon: string; title: string; desc: string }[] {
  const insights: { icon: string; title: string; desc: string }[] = [];

  if (likedLooks.length === 0) {
    return [
      { icon: "heart", title: "Start swiping to discover your style", desc: "Like looks to build your Style DNA" },
      { icon: "sparkles", title: "Your feed is personalized", desc: "The more you interact, the smarter it gets" },
      { icon: "bookmark", title: "Save looks to collections", desc: "Build mood boards for any occasion" },
    ];
  }

  const topStyle = [...styleDNA].sort((a, b) => b.percentage - a.percentage)[0];
  if (topStyle) {
    insights.push({
      icon: "heart",
      title: `You're drawn to ${topStyle.style.toLowerCase()} pieces`,
      desc: `${topStyle.percentage}% of your liked looks align with ${topStyle.style} aesthetics`,
    });
  }

  const seasons = likedLooks.map((l) => l.season);
  const seasonCounts: Record<string, number> = {};
  for (const s of seasons) seasonCounts[s] = (seasonCounts[s] ?? 0) + 1;
  const topSeason = Object.entries(seasonCounts).sort((a, b) => b[1] - a[1])[0];
  if (topSeason) {
    insights.push({
      icon: "sun",
      title: `${topSeason[0]} is your season`,
      desc: `${Math.round((topSeason[1] / likedLooks.length) * 100)}% of your favorites are ${topSeason[0].toLowerCase()} pieces`,
    });
  }

  const avgPrice = likedLooks.reduce((sum, l) => {
    const avg = l.items.length > 0 ? l.items.reduce((s, i) => s + i.price, 0) / l.items.length : 0;
    return sum + avg;
  }, 0) / likedLooks.length;

  if (avgPrice > 500) {
    insights.push({
      icon: "gem",
      title: "Investment dresser",
      desc: `Your average item price is $${Math.round(avgPrice)} — you favor quality over quantity`,
    });
  } else if (avgPrice > 200) {
    insights.push({
      icon: "target",
      title: "Smart spender",
      desc: `Your average item price is $${Math.round(avgPrice)} — great balance of quality and value`,
    });
  } else {
    insights.push({
      icon: "zap",
      title: "Trend hunter",
      desc: `You find great style at $${Math.round(avgPrice)} average — impressive taste-to-price ratio`,
    });
  }

  const totalSwipes = likedLooks.length + passedLooks.length;
  if (totalSwipes > 0) {
    const likeRate = Math.round((likedLooks.length / totalSwipes) * 100);
    if (likeRate > 60) {
      insights.push({
        icon: "heart",
        title: "Open-minded fashionista",
        desc: `You've loved ${likeRate}% of looks — you have eclectic, adventurous taste`,
      });
    } else if (likeRate < 30) {
      insights.push({
        icon: "filter",
        title: "Highly selective eye",
        desc: `You've curated ${likeRate}% of looks — you know exactly what you want`,
      });
    }
  }

  return insights.slice(0, 3);
}

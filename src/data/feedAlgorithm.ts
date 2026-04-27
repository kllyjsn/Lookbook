import type { Look, StyleDNAEntry } from "./mockData";

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

function lookAffinityScore(look: Look, dna: StyleDNAEntry[]): number {
  const dnaMap = new Map(dna.map((d) => [d.style, d.percentage]));
  let score = 0;
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (style) score += dnaMap.get(style) ?? 0;
  }
  if (look.trending) score += 8;
  if (look.editorsChoice) score += 5;
  if (look.badge === "new") score += 3;
  return score;
}

export function personalizedFeed(
  looks: Look[],
  dna: StyleDNAEntry[],
  passedIds: Set<string>
): Look[] {
  const hasPreferences = dna.some((d) => d.percentage > 25);
  if (!hasPreferences) return looks;

  return [...looks].sort((a, b) => {
    const aPassed = passedIds.has(a.id) ? -50 : 0;
    const bPassed = passedIds.has(b.id) ? -50 : 0;
    return (
      lookAffinityScore(b, dna) + bPassed - (lookAffinityScore(a, dna) + aPassed)
    );
  });
}

export function similarLooks(
  target: Look,
  allLooks: Look[],
  limit = 4
): Look[] {
  const targetTags = new Set(target.tags.map((t) => t.label));
  return allLooks
    .filter((l) => l.id !== target.id)
    .map((look) => {
      let overlap = 0;
      for (const tag of look.tags) {
        if (targetTags.has(tag.label)) overlap += 2;
      }
      if (look.mood === target.mood) overlap += 1;
      if (look.occasion === target.occasion) overlap += 1;
      return { look, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((r) => r.look);
}

const WEARS_PER_YEAR: Record<string, number> = {
  Tops: 80,
  Outerwear: 60,
  Bottoms: 70,
  Shoes: 100,
  Dresses: 30,
  Bags: 150,
  Accessories: 120,
};

export function costPerWear(price: number, category: string): string {
  const wears = WEARS_PER_YEAR[category] ?? 50;
  const cpw = price / wears;
  if (cpw < 1) return "<$1/wear";
  return `$${cpw.toFixed(2)}/wear`;
}

const DAILY_CHALLENGES = [
  { title: "Monochrome Monday", prompt: "Can you build a full outfit in one colour family?", tag: "Minimalist" },
  { title: "Texture Tuesday", prompt: "Mix at least 3 different textures in one look.", tag: "Creative" },
  { title: "Investment Wednesday", prompt: "Find one piece worth the cost-per-wear.", tag: "Classic" },
  { title: "Throwback Thursday", prompt: "Style a vintage-inspired look with modern pieces.", tag: "Romantic" },
  { title: "Statement Friday", prompt: "Let one bold piece do all the talking.", tag: "Avant-Garde" },
  { title: "Street Saturday", prompt: "Dress up your favourite sneakers.", tag: "Streetwear" },
  { title: "Self-Care Sunday", prompt: "Build a look that makes YOU feel amazing.", tag: "Romantic" },
];

export function getDailyChallenge() {
  const day = new Date().getDay();
  return DAILY_CHALLENGES[day];
}

export function getStyleLevel(totalSwipes: number): { level: number; title: string; next: number } {
  const tiers = [
    { min: 0, title: "Style Curious" },
    { min: 10, title: "Trend Watcher" },
    { min: 30, title: "Style Explorer" },
    { min: 60, title: "Tastemaker" },
    { min: 100, title: "Fashion Editor" },
    { min: 200, title: "Style Icon" },
  ];
  let current = tiers[0];
  let nextThreshold = tiers[1].min;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalSwipes >= tiers[i].min) {
      current = tiers[i];
      nextThreshold = tiers[i + 1]?.min ?? tiers[i].min;
      break;
    }
  }
  return { level: tiers.indexOf(current), title: current.title, next: nextThreshold };
}

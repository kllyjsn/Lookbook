import type { Look, MoodFilter, StyleDNAEntry } from "./mockData";

interface StylistPersona {
  name: string;
  title: string;
}

const stylistsByMood: Record<MoodFilter, StylistPersona> = {
  all: { name: "The LKBK Editors", title: "Editorial" },
  minimal: { name: "Sofia Reyes", title: "Senior Fashion Editor" },
  romantic: { name: "Lila Rosenberg", title: "Editor at Large" },
  street: { name: "Jax Monroe", title: "Contributing Stylist" },
  evening: { name: "Eleanor Chen", title: "Style Director" },
  classic: { name: "Eleanor Chen", title: "Style Director" },
  adventure: { name: "Tamsin Park", title: "Travel Editor" },
};

const moodTakePrefix: Record<MoodFilter, string> = {
  all: "The new mood —",
  minimal: "There's a quiet kind of confidence here.",
  romantic: "Fabric you can feel from across the room.",
  street: "Effortless that doesn't try.",
  evening: "Dress for the version of you that's about to walk in.",
  classic: "Pieces that age better than your favorite wine.",
  adventure: "Forget the rules. Pack what you'd wear twice.",
};

export interface StylistTake {
  prefix: string;
  body: string;
  signature: string;
  title: string;
}

export function getStylistTake(look: Look): StylistTake {
  const persona = stylistsByMood[look.mood] ?? stylistsByMood.all;
  return {
    prefix: moodTakePrefix[look.mood] ?? moodTakePrefix.all,
    body: look.description,
    signature: persona.name,
    title: persona.title,
  };
}

export const trendPulses: string[] = [
  "This week, the world is wearing quiet luxury.",
  "Spotted everywhere: oversized blazers, soft mules, no fuss.",
  "Color of the moment: butter yellow. Pair with anything cream.",
  "The new evening uniform — sheer, simple, slightly undone.",
  "Trend report: Copenhagen pragmatism beats logo mania.",
  "Tokyo street style is back to volume and texture.",
  "Boots are out. Mules are in. Sneakers are forever.",
  "Mood of the week: dressed-up, never dressed-down.",
  "The blazer is doing the heavy lifting this season.",
  "Investment piece of the moment: a perfect black turtleneck.",
];

export function getTrendPulseForToday(): string {
  // Deterministic per day so it stays consistent across the session.
  const day = Math.floor(Date.now() / 86400000);
  return trendPulses[day % trendPulses.length];
}

const LAUNCH_EPOCH_DAYS = Math.floor(
  new Date("2026-01-01T00:00:00Z").getTime() / 86400000,
);

export function getIssueNumber(): number {
  const today = Math.floor(Date.now() / 86400000);
  return Math.max(1, today - LAUNCH_EPOCH_DAYS + 1);
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getIssueDateLabel(): string {
  const d = new Date();
  return `${monthNames[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

// Deterministic shuffle of a list using a numeric seed.
// Same seed + same input -> same output; different seeds re-order.
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  if (seed === 0) return [...items];
  let s = (seed * 2654435761) % 2 ** 32;
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const tagToStyleForRanking: Record<string, string> = {
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
  Classic: "Classic",
  Siren: "Avant-Garde",
  Coastal: "Classic",
  Festival: "Avant-Garde",
  Boho: "Romantic",
  Vintage: "Romantic",
  Sustainable: "Minimalist",
};

// Score how well a look matches the user's Style DNA.
// Higher = better match. Returns 0 when DNA is unknown.
export function scoreLookForDNA(look: Look, dna: StyleDNAEntry[]): number {
  if (!dna.length) return 0;
  const dnaMap: Record<string, number> = {};
  for (const e of dna) dnaMap[e.style] = e.percentage;
  let score = 0;
  for (const tag of look.tags) {
    const style = tagToStyleForRanking[tag.label];
    if (style && dnaMap[style] != null) score += dnaMap[style];
  }
  return score;
}

export function rankLooksByDNA(
  looks: readonly Look[],
  dna: StyleDNAEntry[],
): Look[] {
  return [...looks]
    .map((l, i) => ({ l, i, s: scoreLookForDNA(l, dna) }))
    .sort((a, b) => (b.s - a.s) || (a.i - b.i))
    .map((x) => x.l);
}

export interface ItemBadge {
  label: string;
  bg: string;
  text: string;
}

// Deterministic, gentle merchandising tags so the Shop the Look grid
// feels like a real product feed without flooding every tile.
export function getItemBadge(itemId: string, price: number): ItemBadge | null {
  // Simple hash of item id.
  let h = 0;
  for (let i = 0; i < itemId.length; i++) h = (h * 31 + itemId.charCodeAt(i)) | 0;
  const bucket = ((h % 7) + 7) % 7;
  if (price >= 350 && bucket < 2) {
    return { label: "Best Seller", bg: "bg-ink", text: "text-cream" };
  }
  if (price < 150 && bucket < 3) {
    return { label: "Sale", bg: "bg-rose", text: "text-white" };
  }
  if (bucket === 3) {
    return { label: "New In", bg: "bg-gold", text: "text-white" };
  }
  return null;
}

export const reactionEmojis: { id: string; char: string; label: string }[] = [
  { id: "fire", char: "🔥", label: "Fire" },
  { id: "diamond", char: "💎", label: "Luxe" },
  { id: "ribbon", char: "🎀", label: "Pretty" },
  { id: "sparkle", char: "✨", label: "Sparkle" },
  { id: "muscle", char: "💪", label: "Strong" },
];

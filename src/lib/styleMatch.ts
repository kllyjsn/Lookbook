import type { Look, StyleDNAEntry } from "../data/mockData";

// Map raw tag labels to the 5 canonical Style DNA buckets.
// Mirrors the mapping in stores/useStore.ts so match-score and DNA stay coherent.
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
  Classic: "Classic",
};

/**
 * Compute a 0-100 match score between a look and the user's Style DNA.
 * Returns 0 if the user's Style DNA is empty or all entries are zero.
 *
 * Algorithm: weighted sum of DNA percentages for each style bucket the look
 * touches, divided by the maximum reachable score (the sum of the look's
 * touched buckets at 100% weight). Bumped to a minimum of 35 if the look
 * touches at least one of the user's preferred styles, so cards never feel
 * dead.
 */
export function styleMatchScore(look: Look, dna: StyleDNAEntry[]): number {
  if (!dna.length) return 0;

  const dnaByStyle = new Map<string, number>();
  for (const entry of dna) dnaByStyle.set(entry.style, entry.percentage);

  let score = 0;
  let touched = 0;
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (!style) continue;
    const pct = dnaByStyle.get(style) ?? 0;
    if (pct > 0) {
      score += pct;
      touched += 1;
    }
  }
  if (touched === 0) return 0;

  // Average the percentage hits, then nudge upward toward "high match" feel.
  const avg = score / touched;
  // Map [0, 60] avg → [35, 99] to make the surface feel positive without overpromising.
  const mapped = Math.round(35 + (Math.min(avg, 60) / 60) * 64);
  return Math.min(99, Math.max(0, mapped));
}

/**
 * Pick up to `limit` looks most similar to the source look by shared tag-style
 * bucket, excluding the source itself.
 */
export function relatedLooks(source: Look, pool: Look[], limit = 3): Look[] {
  const sourceStyles = new Set(
    source.tags.map((t) => tagToStyle[t.label]).filter(Boolean) as string[]
  );
  if (!sourceStyles.size) return pool.filter((l) => l.id !== source.id).slice(0, limit);

  const scored = pool
    .filter((l) => l.id !== source.id)
    .map((l) => {
      const ls = new Set(
        l.tags.map((t) => tagToStyle[t.label]).filter(Boolean) as string[]
      );
      let overlap = 0;
      for (const s of sourceStyles) if (ls.has(s)) overlap += 1;
      // Same mood = small bonus.
      if (l.mood === source.mood) overlap += 0.5;
      // Same occasion = bonus.
      if (l.occasion === source.occasion) overlap += 0.4;
      return { look: l, overlap };
    })
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);

  return scored.slice(0, limit).map((s) => s.look);
}

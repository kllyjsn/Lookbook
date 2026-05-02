// Editor's Notebook — trend essays and editorial helpers.
// Curated as if by a fashion editor publishing daily / hourly drops.

import type { Look } from "./mockData";

export interface NotebookEssay {
  id: string;
  category: "Trend Report" | "The Manifesto" | "Editor's Letter" | "Wishlist" | "The Edit";
  cover: string;
  hed: string;
  dek: string;
  byline: string;
  readMins: number;
  publishedISO: string; // YYYY-MM-DD
  body: string[];       // paragraphs
  pullQuote: string;
  relatedLookIds: string[];
  tag: string;
}

const UNSPLASH = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const notebookEssays: NotebookEssay[] = [
  {
    id: "essay-1",
    category: "Trend Report",
    cover: UNSPLASH("photo-1490481651871-ab68de25d43d"),
    hed: "Quiet Luxury is Loud Again — and That's the Point",
    dek: "After two years of whispered cashmere, the pendulum swings: visible craft, audible tailoring, intentional logos.",
    byline: "Editor at Large",
    readMins: 4,
    publishedISO: "2026-05-01",
    body: [
      "We called it stealth wealth. We called it old-money. We called it the loudest silence in fashion. But after two seasons of greige cashmere and unbranded suede, the wardrobe wants to talk again.",
      "What's emerging isn't logo-mania — it's *audible craft*. Visible double-stitching on a Khaite trench. The hardware on a Jil Sander shoulder bag. The crispness of a Tibi pleat that's been pressed properly. You hear the tailoring before you see it.",
      "Buy fewer, buy *spoken-for*: pieces with a vocabulary, not a price tag. The signal isn't the brand. It's the build.",
    ],
    pullQuote: "Quiet luxury wasn't the point. The point was clothing that has something to say.",
    relatedLookIds: ["look-1"],
    tag: "Quiet Luxury",
  },
  {
    id: "essay-2",
    category: "The Edit",
    cover: UNSPLASH("photo-1485968579580-b6d095142e6e"),
    hed: "Five Shoes That Will Out-Last the Algorithm",
    dek: "If you only buy one pair of shoes this season, make it the one your closet will still recognize in 2030.",
    byline: "Shoe Editor",
    readMins: 3,
    publishedISO: "2026-05-02",
    body: [
      "Trends in footwear are now measured in TikTok hours. The mary-jane lasted six months. The ballerina, eight. The kitten heel, two.",
      "These five shapes — pointed leather mules, square-toe slingbacks, Western boots, woven flats, and an unfussy black loafer — survive cycles because they solve problems, not announce them.",
      "Skip the trend; buy the *function*. Your future self files a thank-you.",
    ],
    pullQuote: "Buy the function, not the announcement.",
    relatedLookIds: ["look-1", "look-2"],
    tag: "Footwear",
  },
  {
    id: "essay-3",
    category: "The Manifesto",
    cover: UNSPLASH("photo-1469334031218-e382a71b716b"),
    hed: "Stop Calling It a Capsule. Call It a Repertoire.",
    dek: "The capsule wardrobe was a productivity hack. A repertoire is an editorial position.",
    byline: "Editor in Chief",
    readMins: 5,
    publishedISO: "2026-04-30",
    body: [
      "Twelve pieces. Five colors. Three silhouettes. The capsule made dressing legible to spreadsheet thinkers — and that's exactly the problem.",
      "Editors don't build capsules. We build *repertoires*: a roster of looks that anticipate the year ahead, the meeting we haven't been invited to yet, the wedding we've forgotten is on the calendar.",
      "Trade scarcity for fluency. Pack the repertoire.",
    ],
    pullQuote: "Capsules are about restriction. Repertoires are about readiness.",
    relatedLookIds: ["look-2"],
    tag: "Wardrobe Theory",
  },
  {
    id: "essay-4",
    category: "Trend Report",
    cover: UNSPLASH("photo-1483985988355-763728e1935b"),
    hed: "The Return of the Real Trouser",
    dek: "After a decade of leggings-in-trench-coat, the trouser is back — and it has opinions.",
    byline: "Tailoring Desk",
    readMins: 3,
    publishedISO: "2026-04-29",
    body: [
      "We've been wearing the *idea* of pants. A wide-leg jersey. A cropped knit. A faux-trouser legging dressed up with a heel.",
      "The new silhouette is unapologetically *trousered*: pleated, wool, sometimes cuffed, always pressed. Theory, The Row, and Tibi all show it. Even Reformation now sells a real trouser.",
      "The shape changes everything: the way you sit, the way the hem breaks on a loafer, the way a knit tucks. Buy one pair, in navy or chocolate. Wear them weekly.",
    ],
    pullQuote: "A trouser is not a pant. The trouser has architecture.",
    relatedLookIds: ["look-1"],
    tag: "Tailoring",
  },
  {
    id: "essay-5",
    category: "Editor's Letter",
    cover: UNSPLASH("photo-1496747611176-843222e1e57c"),
    hed: "Why We're Publishing Hourly Now",
    dek: "Fashion moves at the speed of a feed. The Notebook moves with it.",
    byline: "From the Editor",
    readMins: 2,
    publishedISO: "2026-05-02",
    body: [
      "When LKBK launched, we drew a hard line: one daily edit, one editor's letter, one cover story. Print logic. Slow logic. Editor logic.",
      "But the way readers actually live with style is different. You scroll on the L. You scroll between meetings. You scroll while the kettle boils.",
      "So the Notebook now publishes whenever an editor has something to say. Hourly drops, dated essays, reports filed from the runway, the sample sale, the airport. The cadence is yours, not ours.",
    ],
    pullQuote: "The cadence is yours, not ours.",
    relatedLookIds: [],
    tag: "Inside LKBK",
  },
];

// ---------- Editorial helpers ----------

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n: number): string {
  let result = "";
  let remaining = n;
  for (const [value, symbol] of ROMAN) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result || "I";
}

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export interface IssueMasthead {
  vol: string;        // Roman, e.g. "XII"
  issue: number;      // running issue number across all of LKBK
  date: string;       // "MAY 02, 2026"
  short: string;      // "MAY 02"
  issueLabel: string; // "VOL · XII   ISSUE · 137"
}

// Stable issue-number derivation: days since the LKBK "launch date" (2025-09-01).
const LAUNCH = new Date("2025-09-01T00:00:00").getTime();

export function computeIssue(date: Date = new Date()): IssueMasthead {
  const days = Math.max(1, Math.floor((date.getTime() - LAUNCH) / 86400000) + 1);
  const issue = days; // one issue per day since launch
  const month = date.getUTCMonth();
  const dayNum = date.getUTCDate();
  const year = date.getUTCFullYear();
  const vol = toRoman(Math.max(1, year - 2014)); // Vol XII = 2026
  const dd = String(dayNum).padStart(2, "0");
  return {
    vol,
    issue,
    date: `${MONTHS[month]} ${dd}, ${year}`,
    short: `${MONTHS[month]} ${dd}`,
    issueLabel: `VOL · ${vol}   ISSUE · ${issue}`,
  };
}

// Algorithmic-reasoning microcopy (TikTok-style "Why we picked this").
// Uses the user's top Style DNA dimension + the look's primary tag.
export function pickReasonFor(
  look: Pick<Look, "tags" | "occasion" | "mood" | "trending" | "editorsChoice">,
  topStyle: string | null,
  budgetPreference: string | null,
): string {
  if (look.editorsChoice) return "Hand-picked by our editors today.";
  if (topStyle && look.tags.some((t) => t.label.toLowerCase().includes(topStyle.toLowerCase()))) {
    return `Because you've been loving ${topStyle}.`;
  }
  if (budgetPreference && look.occasion) {
    return `Matches your ${look.occasion.toLowerCase()} mood at ${budgetPreference} budgets.`;
  }
  if (look.trending) return "Trending in your network this hour.";
  if (topStyle) return `${topStyle} energy — your taste lately.`;
  return `Curated for ${look.mood} mood today.`;
}

// Local-date ISO (YYYY-MM-DD) — uses the user's local timezone so that
// "today" is consistent across streak comparisons regardless of UTC offset.
// Avoid Date.toISOString() for this — that returns UTC and disagrees with
// local-midnight math for users in negative UTC offsets.
export function localDateISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Time until next "drop" — daily at 07:00 local.
export function nextDropIn(now: Date = new Date()): { hours: number; mins: number; label: string } {
  const next = new Date(now);
  next.setHours(7, 0, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  const diffMs = next.getTime() - now.getTime();
  const totalMins = Math.max(0, Math.floor(diffMs / 60000));
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  return { hours, mins, label };
}

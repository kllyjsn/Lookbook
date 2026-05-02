// Seed comments per Look — editor + community blend, magazine-grade.
// Pinned editor comment leads. Community comments add taste signals.

export interface LookComment {
  id: string;
  author: string;
  handle: string;
  avatarSeed: string; // unsplash photo id for an avatar
  body: string;
  likes: number;
  postedAgo: string;
  pinned?: boolean;
  isEditor?: boolean;
}

const A = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=120&h=120&fit=crop&q=80`;

// One editor's-pinned comment per look, plus a few community voices.
export const commentsByLook: Record<string, LookComment[]> = {
  "look-1": [
    {
      id: "c-1-1",
      author: "Editor at Large",
      handle: "lkbk.editor",
      avatarSeed: "photo-1494790108377-be9c29b29330",
      body: "The blazer here is doing all the work. Note the dropped shoulder — that's what makes the proportion read 2026, not 2018.",
      likes: 412,
      postedAgo: "2h",
      pinned: true,
      isEditor: true,
    },
    { id: "c-1-2", author: "Sara K.", handle: "sarak", avatarSeed: "photo-1438761681033-6461ffad8d80", body: "Saved the trousers. The wide-leg cut is everything.", likes: 78, postedAgo: "1h" },
    { id: "c-1-3", author: "Min L.", handle: "minl", avatarSeed: "photo-1531746020798-e6953c6e8e04", body: "Classic-Minimalist crossover. Investment-piece coded.", likes: 33, postedAgo: "45m" },
    { id: "c-1-4", author: "Alex P.", handle: "alexp.style", avatarSeed: "photo-1500648767791-00dcc994a43e", body: "Would this work without the heels? Going more casual.", likes: 12, postedAgo: "20m" },
  ],
  "look-2": [
    {
      id: "c-2-1",
      author: "Style Director",
      handle: "lkbk.editor",
      avatarSeed: "photo-1494790108377-be9c29b29330",
      body: "The diaphanous fabric is doing 80% of the work. Pair with anything sharp — it can take it.",
      likes: 287,
      postedAgo: "3h",
      pinned: true,
      isEditor: true,
    },
    { id: "c-2-2", author: "Yuki T.", handle: "yukit", avatarSeed: "photo-1438761681033-6461ffad8d80", body: "Wore something similar to a rooftop dinner. Compliments all night.", likes: 156, postedAgo: "2h" },
    { id: "c-2-3", author: "Camille R.", handle: "camille", avatarSeed: "photo-1531746020798-e6953c6e8e04", body: "Need this dress. Linking the closest dupe in my next post.", likes: 64, postedAgo: "1h" },
  ],
  "look-3": [
    {
      id: "c-3-1",
      author: "Streetwear Editor",
      handle: "lkbk.editor",
      avatarSeed: "photo-1500648767791-00dcc994a43e",
      body: "This is utility done right — function-first, then styled.",
      likes: 198,
      postedAgo: "4h",
      pinned: true,
      isEditor: true,
    },
    { id: "c-3-2", author: "Riley B.", handle: "rileyb", avatarSeed: "photo-1438761681033-6461ffad8d80", body: "Cargo pant comeback is real.", likes: 92, postedAgo: "3h" },
  ],
  "look-4": [
    {
      id: "c-4-1",
      author: "Editor at Large",
      handle: "lkbk.editor",
      avatarSeed: "photo-1494790108377-be9c29b29330",
      body: "An evening look that doesn't try too hard. The quietest thing in the room is usually the most considered.",
      likes: 322,
      postedAgo: "5h",
      pinned: true,
      isEditor: true,
    },
    { id: "c-4-2", author: "Iris M.", handle: "irism", avatarSeed: "photo-1531746020798-e6953c6e8e04", body: "Saving for the gala next month.", likes: 71, postedAgo: "2h" },
  ],
  "look-5": [
    {
      id: "c-5-1",
      author: "Color Editor",
      handle: "lkbk.editor",
      avatarSeed: "photo-1500648767791-00dcc994a43e",
      body: "Note the tonal layering — three shades of one color is more sophisticated than five colors stacked.",
      likes: 241,
      postedAgo: "6h",
      pinned: true,
      isEditor: true,
    },
    { id: "c-5-2", author: "Naomi W.", handle: "naomiw", avatarSeed: "photo-1438761681033-6461ffad8d80", body: "Tonal dressing is criminally underrated.", likes: 84, postedAgo: "4h" },
  ],
};

// Generic fallback comments for any look without dedicated seed.
export function fallbackComments(lookId: string): LookComment[] {
  return [
    {
      id: `fb-${lookId}-1`,
      author: "From the Editor",
      handle: "lkbk.editor",
      avatarSeed: "photo-1494790108377-be9c29b29330",
      body: "On our radar today — well-considered proportions, careful color, low effort, high impact.",
      likes: 134,
      postedAgo: "1h",
      pinned: true,
      isEditor: true,
    },
    {
      id: `fb-${lookId}-2`,
      author: "Reader",
      handle: "lkbk.reader",
      avatarSeed: "photo-1438761681033-6461ffad8d80",
      body: "Saved. Need outfit ideas for spring travel — would love to see this styled down.",
      likes: 41,
      postedAgo: "30m",
    },
    {
      id: `fb-${lookId}-3`,
      author: "Reader",
      handle: "lkbk.reader2",
      avatarSeed: "photo-1531746020798-e6953c6e8e04",
      body: "The accessories are doing so much heavy lifting here.",
      likes: 22,
      postedAgo: "10m",
    },
  ];
}

export function getCommentsFor(lookId: string): LookComment[] {
  return commentsByLook[lookId] ?? fallbackComments(lookId);
}

export function avatarUrl(seed: string): string {
  return A(seed);
}

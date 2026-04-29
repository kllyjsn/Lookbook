const UNSPLASH = (id: string, w = 800, h = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export interface TrendStory {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  category: "trend" | "editorial" | "street" | "color" | "new";
  gradient: string;
  slides: TrendSlide[];
}

export interface TrendSlide {
  image: string;
  headline: string;
  body: string;
  cta?: string;
}

export interface StyleChallenge {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  coverImage: string;
  deadline: string;
  participants: number;
  entries: ChallengeEntry[];
}

export interface ChallengeEntry {
  id: string;
  image: string;
  creator: string;
  avatar: string;
  votes: number;
}

export interface ThisOrThat {
  id: string;
  title: string;
  optionA: { image: string; label: string; votes: number };
  optionB: { image: string; label: string; votes: number };
}

export const trendStories: TrendStory[] = [
  {
    id: "story-1",
    title: "Summer 2025",
    subtitle: "The Definitive Edit",
    coverImage: UNSPLASH("photo-1496747611176-843222e1e57c", 400, 400),
    category: "editorial",
    gradient: "from-gold/80 to-blush/60",
    slides: [
      {
        image: UNSPLASH("photo-1496747611176-843222e1e57c"),
        headline: "Butter Yellow is the New Neutral",
        body: "Move over beige — this season's power neutral is a warm, sun-soaked butter yellow that flatters every skin tone.",
      },
      {
        image: UNSPLASH("photo-1529139574466-a303027c1d8b"),
        headline: "Sheer Everything",
        body: "Layering sheer fabrics is this summer's biggest story. Think organza over structured pieces.",
        cta: "Shop Sheer Edit →",
      },
      {
        image: UNSPLASH("photo-1509631179647-0177331693ae"),
        headline: "The Return of the Maxi",
        body: "Floor-grazing hemlines are back — paired with flat sandals for effortless summer ease.",
      },
    ],
  },
  {
    id: "story-2",
    title: "Street Style",
    subtitle: "Copenhagen FW",
    coverImage: UNSPLASH("photo-1519764622345-23439dd774f7", 400, 400),
    category: "street",
    gradient: "from-ink/70 to-charcoal/60",
    slides: [
      {
        image: UNSPLASH("photo-1519764622345-23439dd774f7"),
        headline: "The Oversized Coat Moment",
        body: "Copenhagen's best-dressed are proving that bigger really is better this season.",
      },
      {
        image: UNSPLASH("photo-1515886657613-9f3515b0c78f"),
        headline: "Sneakers with Suiting",
        body: "The high-low mix that defined CPHFW — premium tailoring meets chunky sneakers.",
        cta: "Get the Look →",
      },
    ],
  },
  {
    id: "story-3",
    title: "Color Report",
    subtitle: "Pantone 2025",
    coverImage: UNSPLASH("photo-1558618666-fcd25c85f82e", 400, 400),
    category: "color",
    gradient: "from-lavender/70 to-sage/50",
    slides: [
      {
        image: UNSPLASH("photo-1558618666-fcd25c85f82e"),
        headline: "Mocha Mousse: Color of the Year",
        body: "Pantone's 2025 pick is a warm, indulgent brown that anchors any wardrobe.",
      },
      {
        image: UNSPLASH("photo-1485968579580-b6d095142e6e"),
        headline: "Cherry Red Makes a Comeback",
        body: "From power blazers to statement bags — cherry red is the accent color you need.",
      },
      {
        image: UNSPLASH("photo-1483985988355-763728e1935b"),
        headline: "Sage Green for Quiet Days",
        body: "The perfect antidote to maximalism. Sage green whispers sophistication.",
        cta: "Shop by Color →",
      },
    ],
  },
  {
    id: "story-4",
    title: "Editor's Picks",
    subtitle: "This Week",
    coverImage: UNSPLASH("photo-1469334031218-e382a71b716b", 400, 400),
    category: "editorial",
    gradient: "from-gold/70 to-rose/50",
    slides: [
      {
        image: UNSPLASH("photo-1469334031218-e382a71b716b"),
        headline: "The $100 Dress That Looks Designer",
        body: "Our editors found the piece everyone will be asking about this summer.",
        cta: "Shop Now →",
      },
      {
        image: UNSPLASH("photo-1539109136881-3be0616acf4b"),
        headline: "The Perfect Blazer, Finally",
        body: "After testing 47 blazers, our fashion director has a winner.",
      },
    ],
  },
  {
    id: "story-5",
    title: "New In",
    subtitle: "Fresh Drops",
    coverImage: UNSPLASH("photo-1581044777550-4cfa60707998", 400, 400),
    category: "new",
    gradient: "from-ink/60 to-sage/40",
    slides: [
      {
        image: UNSPLASH("photo-1581044777550-4cfa60707998"),
        headline: "Just Landed: The Row Resort 2025",
        body: "Mary-Kate and Ashley deliver another masterclass in quiet luxury.",
      },
      {
        image: UNSPLASH("photo-1529139574466-a303027c1d8b"),
        headline: "Zara's Best Drop Yet",
        body: "The pieces from Zara's latest collection that genuinely rival designer.",
        cta: "See the Edit →",
      },
    ],
  },
];

export const styleChallenges: StyleChallenge[] = [
  {
    id: "challenge-1",
    title: "Monochrome Week",
    description: "Style a head-to-toe single-color outfit. Any shade, any price point — just commit to the mono.",
    hashtag: "#LKBKMonochrome",
    coverImage: UNSPLASH("photo-1485968579580-b6d095142e6e", 800, 600),
    deadline: "3 days left",
    participants: 2847,
    entries: [
      { id: "ce-1", image: UNSPLASH("photo-1485968579580-b6d095142e6e", 400, 600), creator: "Sofia Reyes", avatar: UNSPLASH("photo-1494790108377-be9c29b29330", 100, 100), votes: 1240 },
      { id: "ce-2", image: UNSPLASH("photo-1509631179647-0177331693ae", 400, 600), creator: "Eleanor Chen", avatar: UNSPLASH("photo-1534528741775-53994a69daeb", 100, 100), votes: 980 },
      { id: "ce-3", image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 400, 600), creator: "Jax Monroe", avatar: UNSPLASH("photo-1507003211169-0a1dd7228f2d", 100, 100), votes: 876 },
    ],
  },
  {
    id: "challenge-2",
    title: "Under $200 Challenge",
    description: "Prove that style doesn't need a designer budget. Full outfit, under $200, maximum impact.",
    hashtag: "#LKBKBudgetFlex",
    coverImage: UNSPLASH("photo-1483985988355-763728e1935b", 800, 600),
    deadline: "5 days left",
    participants: 4123,
    entries: [
      { id: "ce-4", image: UNSPLASH("photo-1529139574466-a303027c1d8b", 400, 600), creator: "Lila Rosenberg", avatar: UNSPLASH("photo-1438761681033-6461ffad8d80", 100, 100), votes: 2100 },
      { id: "ce-5", image: UNSPLASH("photo-1558618666-fcd25c85f82e", 400, 600), creator: "Marcelo Diaz", avatar: UNSPLASH("photo-1500648767791-00dcc994a43e", 100, 100), votes: 1890 },
      { id: "ce-6", image: UNSPLASH("photo-1519764622345-23439dd774f7", 400, 600), creator: "Zara Kim", avatar: UNSPLASH("photo-1531746020798-e6953c6e8e04", 100, 100), votes: 1456 },
    ],
  },
  {
    id: "challenge-3",
    title: "Office Siren",
    description: "The viral TikTok aesthetic meets real life. Corporate but make it fashion.",
    hashtag: "#LKBKOfficeSiren",
    coverImage: UNSPLASH("photo-1539109136881-3be0616acf4b", 800, 600),
    deadline: "1 week left",
    participants: 6891,
    entries: [
      { id: "ce-7", image: UNSPLASH("photo-1539109136881-3be0616acf4b", 400, 600), creator: "Anya Petrova", avatar: UNSPLASH("photo-1544005313-94ddf0286df2", 100, 100), votes: 3200 },
      { id: "ce-8", image: UNSPLASH("photo-1469334031218-e382a71b716b", 400, 600), creator: "Oliver Wright", avatar: UNSPLASH("photo-1472099645785-5658abf4ff4e", 100, 100), votes: 2750 },
    ],
  },
];

export const thisOrThatPairs: ThisOrThat[] = [
  {
    id: "tot-1",
    title: "Date Night Dilemma",
    optionA: { image: UNSPLASH("photo-1496747611176-843222e1e57c", 400, 600), label: "Flowing Midi", votes: 6240 },
    optionB: { image: UNSPLASH("photo-1469334031218-e382a71b716b", 400, 600), label: "Sequin Mini", votes: 5180 },
  },
  {
    id: "tot-2",
    title: "Monday Meeting",
    optionA: { image: UNSPLASH("photo-1509631179647-0177331693ae", 400, 600), label: "Power Blazer", votes: 8900 },
    optionB: { image: UNSPLASH("photo-1558618666-fcd25c85f82e", 400, 600), label: "Quiet Luxury", votes: 7650 },
  },
  {
    id: "tot-3",
    title: "Weekend Vibes",
    optionA: { image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 400, 600), label: "Street Luxe", votes: 4320 },
    optionB: { image: UNSPLASH("photo-1483985988355-763728e1935b", 400, 600), label: "Urban Safari", votes: 5100 },
  },
];

export const trendingTags = [
  { tag: "Quiet Luxury", count: "42.1K", hot: true },
  { tag: "Office Siren", count: "38.7K", hot: true },
  { tag: "Coastal Grandmother", count: "28.3K", hot: false },
  { tag: "Dark Feminine", count: "24.9K", hot: true },
  { tag: "Mob Wife", count: "21.2K", hot: false },
  { tag: "Scandi Minimal", count: "19.8K", hot: false },
  { tag: "Coquette", count: "17.5K", hot: true },
  { tag: "Athleisure Luxe", count: "15.1K", hot: false },
  { tag: "Vintage Revival", count: "12.8K", hot: false },
  { tag: "Y2K Return", count: "11.4K", hot: true },
];

export const discoverCategories = [
  { id: "work", label: "Work", image: UNSPLASH("photo-1509631179647-0177331693ae", 400, 400), count: 156 },
  { id: "date-night", label: "Date Night", image: UNSPLASH("photo-1496747611176-843222e1e57c", 400, 400), count: 89 },
  { id: "weekend", label: "Weekend", image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 400, 400), count: 234 },
  { id: "evening", label: "Evening", image: UNSPLASH("photo-1469334031218-e382a71b716b", 400, 400), count: 67 },
  { id: "travel", label: "Travel", image: UNSPLASH("photo-1483985988355-763728e1935b", 400, 400), count: 112 },
  { id: "brunch", label: "Brunch", image: UNSPLASH("photo-1529139574466-a303027c1d8b", 400, 400), count: 78 },
];

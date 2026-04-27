import type { StyleTag, LookItem } from "./mockData";

const UNSPLASH = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export interface TrendReport {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  description: string;
  season: string;
  tags: StyleTag[];
  keyPieces: string[];
  colorPalette: string[];
  moodImages: string[];
}

export interface TrendingHashtag {
  id: string;
  tag: string;
  postCount: string;
  growth: string;
  color: string;
}

export interface StyleChallenge {
  id: string;
  title: string;
  hashtag: string;
  description: string;
  coverImage: string;
  deadline: string;
  participants: number;
  prize?: string;
  difficulty: "Easy" | "Medium" | "Expert";
  rules: string[];
  exampleItems: LookItem[];
}

export interface CreatorStory {
  id: string;
  creatorName: string;
  avatar: string;
  previewImage: string;
  label: string;
  isNew: boolean;
}

export const trendReports: TrendReport[] = [
  {
    id: "trend-1",
    title: "Quiet Luxury 2.0",
    subtitle: "The Stealth Wealth Evolution",
    coverImage: UNSPLASH("photo-1558618666-fcd25c85f82e", 800, 1200),
    description:
      "Quiet luxury isn't going anywhere — it's evolving. This season, expect deconstructed tailoring, unfinished hems, and raw silk. The new quiet luxury whispers even softer but hits harder. Think Loro Piana meets The Row with a Jil Sander edge.",
    season: "Fall/Winter 2026",
    tags: [
      { label: "Quiet Luxury", color: "#C5A572" },
      { label: "Tailoring", color: "#1A1A1A" },
    ],
    keyPieces: [
      "Deconstructed Wool Blazer",
      "Raw Silk Wide Trousers",
      "Unlined Cashmere Coat",
      "Brushed Suede Loafers",
    ],
    colorPalette: ["#E8DDD4", "#C5A572", "#8B7355", "#3D3026", "#1A1A1A"],
    moodImages: [
      UNSPLASH("photo-1509631179647-0177331693ae", 400, 400),
      UNSPLASH("photo-1539109136881-3be0616acf4b", 400, 400),
      UNSPLASH("photo-1558618666-fcd25c85f82e", 400, 400),
    ],
  },
  {
    id: "trend-2",
    title: "Dopamine Dressing",
    subtitle: "Joy as a Fashion Statement",
    coverImage: UNSPLASH("photo-1529139574466-a303027c1d8b", 800, 1200),
    description:
      "Color is the ultimate confidence booster. This trend is about unabashed joy — saturated cobalt blues, electric tangerines, and hot pinks. Mix clashing hues with intention. The rule? There are no rules.",
    season: "Spring/Summer 2026",
    tags: [
      { label: "Color", color: "#E85D75" },
      { label: "Statement", color: "#4A6AE8" },
    ],
    keyPieces: [
      "Cobalt Oversized Blazer",
      "Tangerine Pleated Midi",
      "Hot Pink Kitten Heels",
      "Color-Block Clutch",
    ],
    colorPalette: ["#E85D75", "#4A6AE8", "#FF8C42", "#7B2D8E", "#00B4D8"],
    moodImages: [
      UNSPLASH("photo-1529139574466-a303027c1d8b", 400, 400),
      UNSPLASH("photo-1496747611176-843222e1e57c", 400, 400),
      UNSPLASH("photo-1515886657613-9f3515b0c78f", 400, 400),
    ],
  },
  {
    id: "trend-3",
    title: "Neo-Romanticism",
    subtitle: "Softness Meets Structure",
    coverImage: UNSPLASH("photo-1496747611176-843222e1e57c", 800, 1200),
    description:
      "Victorian collars on modern cuts. Lace peeking through tailored blazers. This season's romanticism isn't about being delicate — it's about juxtaposing softness with power. Think ruffled shirts under sharp shoulders.",
    season: "Fall/Winter 2026",
    tags: [
      { label: "Romantic", color: "#C4797A" },
      { label: "Modern", color: "#B8A9C9" },
    ],
    keyPieces: [
      "Ruffled Poet Blouse",
      "Lace-Trim Wool Blazer",
      "Velvet Mary Janes",
      "Pearl Drop Earrings",
    ],
    colorPalette: ["#F5E6E8", "#C4797A", "#B8A9C9", "#4A2040", "#1A1A1A"],
    moodImages: [
      UNSPLASH("photo-1496747611176-843222e1e57c", 400, 400),
      UNSPLASH("photo-1572804013309-59a88b7e92f1", 400, 400),
      UNSPLASH("photo-1469334031218-e382a71b716b", 400, 400),
    ],
  },
  {
    id: "trend-4",
    title: "Utility Reimagined",
    subtitle: "Workwear Goes Luxe",
    coverImage: UNSPLASH("photo-1483985988355-763728e1935b", 800, 1200),
    description:
      "Cargo pockets in cashmere. Boiler suits in silk. The utility trend has graduated from streetwear into high fashion territory. Functional details meet premium fabrication for the most wearable trend of the season.",
    season: "All Season",
    tags: [
      { label: "Utility", color: "#6B7B3A" },
      { label: "Luxe", color: "#C5A572" },
    ],
    keyPieces: [
      "Silk Cargo Trousers",
      "Cashmere Utility Vest",
      "Leather Tool Belt",
      "Chunky Lug Boots",
    ],
    colorPalette: ["#A8B5A0", "#6B7B3A", "#3D3026", "#C5A572", "#2D2D2D"],
    moodImages: [
      UNSPLASH("photo-1483985988355-763728e1935b", 400, 400),
      UNSPLASH("photo-1485968579580-b6d095142e6e", 400, 400),
      UNSPLASH("photo-1519764622345-23439dd774f7", 400, 400),
    ],
  },
];

export const trendingHashtags: TrendingHashtag[] = [
  { id: "h1", tag: "#QuietLuxury", postCount: "2.4M", growth: "+340%", color: "#C5A572" },
  { id: "h2", tag: "#OldMoney", postCount: "1.8M", growth: "+280%", color: "#8B7355" },
  { id: "h3", tag: "#CapsuleWardrobe", postCount: "4.1M", growth: "+120%", color: "#1A1A1A" },
  { id: "h4", tag: "#DopamineDressing", postCount: "890K", growth: "+520%", color: "#E85D75" },
  { id: "h5", tag: "#OfficeCore", postCount: "1.2M", growth: "+210%", color: "#4A4A4A" },
  { id: "h6", tag: "#CoastalGrandma", postCount: "3.6M", growth: "+90%", color: "#A8B5A0" },
  { id: "h7", tag: "#NeoRomantic", postCount: "670K", growth: "+480%", color: "#C4797A" },
  { id: "h8", tag: "#UtilityLuxe", postCount: "520K", growth: "+610%", color: "#6B7B3A" },
];

export const styleChallenges: StyleChallenge[] = [
  {
    id: "challenge-1",
    title: "Monochrome Monday",
    hashtag: "#MonoMonday",
    description:
      "Style an entire look using one color family. Bonus points for texture mixing — leather, knit, silk, and denim all in the same hue.",
    coverImage: UNSPLASH("photo-1485968579580-b6d095142e6e", 800, 600),
    deadline: "Every Monday",
    participants: 12400,
    difficulty: "Easy",
    rules: [
      "Entire outfit in one color family",
      "Minimum 3 pieces",
      "Texture variety encouraged",
      "Accessories count!",
    ],
    exampleItems: [
      { id: "ch1-i1", name: "Cashmere Turtleneck", brand: "Nili Lotan", price: 495, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ch1-i2", name: "Tailored Wool Coat", brand: "Max Mara", price: 895, image: UNSPLASH("photo-1539533018447-63fcce2678e3", 400, 500), category: "Outerwear", shopUrl: "#" },
    ],
  },
  {
    id: "challenge-2",
    title: "Under $200 Slay",
    hashtag: "#200Slay",
    description:
      "Prove that great style doesn't need a trust fund. Build a complete outfit for under $200 — head to toe. Thrift finds encouraged.",
    coverImage: UNSPLASH("photo-1515886657613-9f3515b0c78f", 800, 600),
    deadline: "Ends Sunday",
    participants: 28900,
    prize: "Featured on LKBK",
    difficulty: "Medium",
    rules: [
      "Total outfit under $200",
      "Include all pieces: top, bottom, shoes",
      "Second-hand and vintage welcome",
      "Share where you found each piece",
    ],
    exampleItems: [
      { id: "ch2-i1", name: "Oversized Cotton Tee", brand: "Aritzia", price: 58, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ch2-i2", name: "Straight-Leg Jeans", brand: "AGOLDE", price: 98, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
  },
  {
    id: "challenge-3",
    title: "Power Dressing 2026",
    hashtag: "#PowerPlay",
    description:
      "Redefine what power dressing means to you. Could be a full suit, could be a slip dress with combat boots. Your power, your rules.",
    coverImage: UNSPLASH("photo-1539109136881-3be0616acf4b", 800, 600),
    deadline: "2 days left",
    participants: 8700,
    prize: "Style consultation",
    difficulty: "Expert",
    rules: [
      "At least one 'power' element",
      "Show transformation: casual to commanding",
      "Include styling notes",
      "Tag your inspirations",
    ],
    exampleItems: [
      { id: "ch3-i1", name: "Double-Breasted Blazer", brand: "Toteme", price: 690, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "ch3-i2", name: "Pointed Pumps", brand: "Stuart Weitzman", price: 395, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "challenge-4",
    title: "Remix the Classics",
    hashtag: "#ClassicRemix",
    description:
      "Take a wardrobe classic — white shirt, blue jeans, LBD — and remix it in an unexpected way. Backwards? Layered? Deconstructed? Surprise us.",
    coverImage: UNSPLASH("photo-1509631179647-0177331693ae", 800, 600),
    deadline: "5 days left",
    participants: 15200,
    difficulty: "Medium",
    rules: [
      "Start with a classic wardrobe staple",
      "Style it in a non-traditional way",
      "Before & after encouraged",
      "Share your thought process",
    ],
    exampleItems: [
      { id: "ch4-i1", name: "Structured Wool Blazer", brand: "COS", price: 275, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "ch4-i2", name: "Wide-Leg Trousers", brand: "Theory", price: 325, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
  },
];

export const creatorStories: CreatorStory[] = [
  { id: "story-1", creatorName: "Sofia", avatar: UNSPLASH("photo-1494790108377-be9c29b29330", 200, 200), previewImage: UNSPLASH("photo-1509631179647-0177331693ae", 300, 400), label: "OOTD", isNew: true },
  { id: "story-2", creatorName: "Jax", avatar: UNSPLASH("photo-1507003211169-0a1dd7228f2d", 200, 200), previewImage: UNSPLASH("photo-1515886657613-9f3515b0c78f", 300, 400), label: "Haul", isNew: true },
  { id: "story-3", creatorName: "Eleanor", avatar: UNSPLASH("photo-1534528741775-53994a69daeb", 200, 200), previewImage: UNSPLASH("photo-1558618666-fcd25c85f82e", 300, 400), label: "Tips", isNew: false },
  { id: "story-4", creatorName: "Lila", avatar: UNSPLASH("photo-1438761681033-6461ffad8d80", 200, 200), previewImage: UNSPLASH("photo-1496747611176-843222e1e57c", 300, 400), label: "Styling", isNew: true },
  { id: "story-5", creatorName: "Marcelo", avatar: UNSPLASH("photo-1500648767791-00dcc994a43e", 200, 200), previewImage: UNSPLASH("photo-1539109136881-3be0616acf4b", 300, 400), label: "Fit Check", isNew: true },
  { id: "story-6", creatorName: "Anya", avatar: UNSPLASH("photo-1544005313-94ddf0286df2", 200, 200), previewImage: UNSPLASH("photo-1485968579580-b6d095142e6e", 300, 400), label: "Art", isNew: false },
  { id: "story-7", creatorName: "LKBK", avatar: UNSPLASH("photo-1472099645785-5658abf4ff4e", 200, 200), previewImage: UNSPLASH("photo-1483985988355-763728e1935b", 300, 400), label: "Trends", isNew: true },
];

export interface EditorNote {
  lookId: string;
  stylingTip: string;
  editorsVoice: string;
  colorStory: string[];
  pairsWith: string[];
  avoidWith: string[];
}

export const editorNotes: EditorNote[] = [
  {
    lookId: "look-1",
    stylingTip: "Tuck the camisole into high-waisted trousers and throw the blazer over one shoulder for a more editorial feel.",
    editorsVoice: "This look is giving boardroom-to-bar energy without trying. The trick is in the proportions — oversized up top, tailored below.",
    colorStory: ["#2D2D2D", "#E8D5D0", "#C5A572", "#F5F0EB", "#8A8A8A"],
    pairsWith: ["Structured leather tote", "Gold cuff bracelet", "Pointed loafers"],
    avoidWith: ["Chunky sneakers", "Graphic tees", "Distressed denim"],
  },
  {
    lookId: "look-2",
    stylingTip: "Layer a fine knit cardigan over the dress for cooler evenings. Swap the heels for strappy flats for daytime.",
    editorsVoice: "Reformation does what Reformation does best — making sustainable look devastatingly good. The necklace elevates everything.",
    colorStory: ["#F5E6E8", "#C4797A", "#C5A572", "#FDFAF7", "#B8A9C9"],
    pairsWith: ["Cashmere wrap", "Dainty gold rings", "Cat-eye sunglasses"],
    avoidWith: ["Heavy boots", "Oversized bags", "Dark denim"],
  },
  {
    lookId: "look-3",
    stylingTip: "Leave the moto jacket unzipped with the sleeves slightly pushed up. The jeans should hit just above the sneaker.",
    editorsVoice: "Street luxe is about the mix. The Common Projects sneakers with AllSaints leather is a masterclass in high-low dressing.",
    colorStory: ["#1A1A1A", "#F5F0EB", "#4A4A4A", "#8A8A8A", "#2D2D2D"],
    pairsWith: ["Baseball cap", "Crossbody bag", "Aviator sunglasses"],
    avoidWith: ["Formal shoes", "Silk blouses", "Statement jewelry"],
  },
  {
    lookId: "look-4",
    stylingTip: "Keep accessories minimal — the dress is the star. One statement earring is all you need.",
    editorsVoice: "For a gala, this sequin column is perfection. It photographs beautifully and moves like liquid gold under chandelier light.",
    colorStory: ["#C5A572", "#1A1A1A", "#E8D5D0", "#4A4A4A", "#FDFAF7"],
    pairsWith: ["Crystal drop earrings", "Metallic clutch", "Nude lip"],
    avoidWith: ["Oversized bags", "Layered necklaces", "Printed scarves"],
  },
  {
    lookId: "look-5",
    stylingTip: "Roll the shirt sleeves twice and leave two buttons undone. The culottes should graze the ankle.",
    editorsVoice: "This is the travel uniform I pack for every trip. Earth tones that work across time zones and dress codes.",
    colorStory: ["#A8B5A0", "#8B7355", "#E8DDD4", "#6B7B3A", "#3D3026"],
    pairsWith: ["Woven belt", "Canvas tote", "Espadrilles"],
    avoidWith: ["Neon accessories", "Formal blazers", "Platform heels"],
  },
  {
    lookId: "look-6",
    stylingTip: "Monochrome works best when you play with texture. Matte boots against a glossy coat against a knit turtleneck.",
    editorsVoice: "All black is the fashion editor's uniform for a reason. It's not boring — it's a canvas for silhouette play.",
    colorStory: ["#1A1A1A", "#2D2D2D", "#4A4A4A", "#1A1A1A", "#0D0D0D"],
    pairsWith: ["Silver hardware", "Red lipstick", "Leather gloves"],
    avoidWith: ["Bright patterns", "Brown leather", "Pastel accessories"],
  },
];

export interface OutfitRemix {
  originalItemId: string;
  alternatives: LookItem[];
}

export const outfitRemixes: OutfitRemix[] = [
  {
    originalItemId: "i1",
    alternatives: [
      { id: "remix-1a", name: "Linen Blazer", brand: "Arket", price: 189, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "remix-1b", name: "Cropped Cardigan", brand: "& Other Stories", price: 89, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Outerwear", shopUrl: "#" },
    ],
  },
  {
    originalItemId: "i5",
    alternatives: [
      { id: "remix-2a", name: "Wrap Midi Skirt", brand: "Sézane", price: 145, image: UNSPLASH("photo-1595777457583-95e059d581b8", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "remix-2b", name: "Silk Slip Dress", brand: "Vince", price: 285, image: UNSPLASH("photo-1572804013309-59a88b7e92f1", 400, 500), category: "Dresses", shopUrl: "#" },
    ],
  },
  {
    originalItemId: "i9",
    alternatives: [
      { id: "remix-3a", name: "Breton Stripe Tee", brand: "Saint James", price: 78, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "remix-3b", name: "Linen Tank", brand: "Everlane", price: 35, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
    ],
  },
];

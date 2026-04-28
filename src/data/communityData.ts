import type { StyleTag, LookItem } from "./mockData";

export interface StylePoll {
  id: string;
  question: string;
  optionA: { label: string; image: string; votes: number };
  optionB: { label: string; image: string; votes: number };
  totalVotes: number;
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
  styleTags: StyleTag[];
}

export interface CommunityPost {
  id: string;
  creator: Creator;
  image: string;
  title: string;
  caption: string;
  tags: StyleTag[];
  likes: number;
  comments: number;
  saves: number;
  items: LookItem[];
  createdAt: string;
  occasion: string;
}

export interface MustHaveList {
  id: string;
  creator: Creator;
  name: string;
  description: string;
  coverImage: string;
  items: LookItem[];
  likes: number;
  saves: number;
}

const UNSPLASH = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const creators: Creator[] = [
  {
    id: "creator-1",
    username: "sofiastyle",
    displayName: "Sofia Reyes",
    avatar: UNSPLASH("photo-1494790108377-be9c29b29330", 200, 200),
    bio: "Minimalist fashion editor. Less is always more. NYC based.",
    followers: 284000,
    following: 412,
    verified: true,
    styleTags: [
      { label: "Minimalist", color: "#1A1A1A" },
      { label: "Editorial", color: "#4A4A4A" },
    ],
  },
  {
    id: "creator-2",
    username: "eleanor_chic",
    displayName: "Eleanor Chen",
    avatar: UNSPLASH("photo-1534528741775-53994a69daeb", 200, 200),
    bio: "Investment dressing advocate. Quality over quantity, always.",
    followers: 156000,
    following: 289,
    verified: true,
    styleTags: [
      { label: "Classic", color: "#C5A572" },
      { label: "Luxury", color: "#2D2D2D" },
    ],
  },
  {
    id: "creator-3",
    username: "jaxwears",
    displayName: "Jax Monroe",
    avatar: UNSPLASH("photo-1507003211169-0a1dd7228f2d", 200, 200),
    bio: "Streetwear meets high fashion. Breaking rules, setting trends.",
    followers: 421000,
    following: 198,
    verified: true,
    styleTags: [
      { label: "Streetwear", color: "#2D2D2D" },
      { label: "Avant-Garde", color: "#B8A9C9" },
    ],
  },
  {
    id: "creator-4",
    username: "lila.rose",
    displayName: "Lila Rosenberg",
    avatar: UNSPLASH("photo-1438761681033-6461ffad8d80", 200, 200),
    bio: "Romantic style diarist. Florals, lace, and golden hour.",
    followers: 89000,
    following: 534,
    verified: false,
    styleTags: [
      { label: "Romantic", color: "#C4797A" },
      { label: "Feminine", color: "#E8D5D0" },
    ],
  },
  {
    id: "creator-5",
    username: "marcelo.fit",
    displayName: "Marcelo Diaz",
    avatar: UNSPLASH("photo-1500648767791-00dcc994a43e", 200, 200),
    bio: "Where tailoring meets the streets. São Paulo → Paris.",
    followers: 312000,
    following: 276,
    verified: true,
    styleTags: [
      { label: "Tailored", color: "#1A1A1A" },
      { label: "Modern", color: "#8A8A8A" },
    ],
  },
  {
    id: "creator-6",
    username: "anya.muse",
    displayName: "Anya Petrova",
    avatar: UNSPLASH("photo-1544005313-94ddf0286df2", 200, 200),
    bio: "Art director turned stylist. Every outfit tells a story.",
    followers: 67000,
    following: 891,
    verified: false,
    styleTags: [
      { label: "Creative", color: "#B8A9C9" },
      { label: "Eclectic", color: "#A8B5A0" },
    ],
  },
  {
    id: "creator-7",
    username: "theclassicman",
    displayName: "Oliver Wright",
    avatar: UNSPLASH("photo-1472099645785-5658abf4ff4e", 200, 200),
    bio: "Timeless menswear. Buy once, wear forever. London.",
    followers: 198000,
    following: 167,
    verified: true,
    styleTags: [
      { label: "Classic", color: "#C5A572" },
      { label: "Menswear", color: "#2D2D2D" },
    ],
  },
  {
    id: "creator-8",
    username: "zara.edit",
    displayName: "Zara Kim",
    avatar: UNSPLASH("photo-1531746020798-e6953c6e8e04", 200, 200),
    bio: "Fashion buyer. Curating the next wave from Seoul to the world.",
    followers: 143000,
    following: 445,
    verified: true,
    styleTags: [
      { label: "Contemporary", color: "#4A4A4A" },
      { label: "Curated", color: "#C5A572" },
    ],
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    creator: creators[0],
    image: UNSPLASH("photo-1509631179647-0177331693ae", 800, 1200),
    title: "The Perfect Monday Uniform",
    caption: "When your work wardrobe does the talking. This combination of structured wool and fluid silk is everything — powerful without trying too hard.",
    tags: [
      { label: "Minimalist", color: "#1A1A1A" },
      { label: "Work", color: "#4A4A4A" },
    ],
    likes: 4230,
    comments: 187,
    saves: 892,
    items: [
      { id: "p1-i1", name: "Structured Wool Blazer", brand: "COS", price: 275, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "p1-i2", name: "Silk Camisole", brand: "Vince", price: 195, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
    ],
    createdAt: "2h ago",
    occasion: "Office",
  },
  {
    id: "post-2",
    creator: creators[2],
    image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 800, 1200),
    title: "Rules Are Boring",
    caption: "Mixed a vintage moto jacket with tailored trousers and chunky sneakers. Fashion is about breaking rules, not following them.",
    tags: [
      { label: "Streetwear", color: "#2D2D2D" },
      { label: "Mix", color: "#8A8A8A" },
    ],
    likes: 8910,
    comments: 432,
    saves: 2100,
    items: [
      { id: "p2-i1", name: "Leather Moto Jacket", brand: "AllSaints", price: 499, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "p2-i2", name: "White Leather Sneakers", brand: "Common Projects", price: 425, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "p2-i3", name: "Wide-Leg Trousers", brand: "Lemaire", price: 480, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
    createdAt: "4h ago",
    occasion: "Weekend",
  },
  {
    id: "post-3",
    creator: creators[3],
    image: UNSPLASH("photo-1496747611176-843222e1e57c", 800, 1200),
    title: "Sunset Hour Dressing",
    caption: "There's something about golden hour light and a flowing dress that just works. This Reformation piece moves like poetry.",
    tags: [
      { label: "Romantic", color: "#C4797A" },
      { label: "Evening", color: "#B8A9C9" },
    ],
    likes: 3150,
    comments: 124,
    saves: 678,
    items: [
      { id: "p3-i1", name: "Flowing Midi Dress", brand: "Reformation", price: 248, image: UNSPLASH("photo-1595777457583-95e059d581b8", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "p3-i2", name: "Gold Chain Necklace", brand: "Mejuri", price: 128, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
    createdAt: "6h ago",
    occasion: "Date Night",
  },
  {
    id: "post-4",
    creator: creators[1],
    image: UNSPLASH("photo-1469334031218-e382a71b716b", 800, 1200),
    title: "The Investment Blazer Edit",
    caption: "One blazer, five ways. This Toteme piece has earned its cost-per-wear ten times over. The mark of a truly great investment.",
    tags: [
      { label: "Classic", color: "#C5A572" },
      { label: "Investment", color: "#1A1A1A" },
    ],
    likes: 5670,
    comments: 298,
    saves: 1540,
    items: [
      { id: "p4-i1", name: "Double-Breasted Blazer", brand: "Toteme", price: 690, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "p4-i2", name: "High-Waist Trousers", brand: "Toteme", price: 390, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
    createdAt: "8h ago",
    occasion: "Any",
  },
  {
    id: "post-5",
    creator: creators[4],
    image: UNSPLASH("photo-1539109136881-3be0616acf4b", 800, 1200),
    title: "São Paulo to Soho",
    caption: "The modern suit doesn't need a tie. Unstructured shoulders, cropped trousers, clean sneakers. This is how we do it now.",
    tags: [
      { label: "Tailored", color: "#1A1A1A" },
      { label: "Modern", color: "#8A8A8A" },
    ],
    likes: 7200,
    comments: 356,
    saves: 1890,
    items: [
      { id: "p5-i1", name: "Unstructured Blazer", brand: "Officine Générale", price: 620, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "p5-i2", name: "Relaxed Chinos", brand: "AMI Paris", price: 280, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
    createdAt: "12h ago",
    occasion: "Work",
  },
  {
    id: "post-6",
    creator: creators[5],
    image: UNSPLASH("photo-1485968579580-b6d095142e6e", 800, 1200),
    title: "Monochrome Is a Mood",
    caption: "All black doesn't have to be boring. Texture, silhouette, and proportion — that's where the magic lives. Cashmere on leather on matte.",
    tags: [
      { label: "Monochrome", color: "#1A1A1A" },
      { label: "Creative", color: "#B8A9C9" },
    ],
    likes: 2890,
    comments: 167,
    saves: 534,
    items: [
      { id: "p6-i1", name: "Cashmere Turtleneck", brand: "Nili Lotan", price: 495, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "p6-i2", name: "Leather Moto Jacket", brand: "Acne Studios", price: 1800, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 500), category: "Outerwear", shopUrl: "#" },
    ],
    createdAt: "1d ago",
    occasion: "Any",
  },
  {
    id: "post-7",
    creator: creators[6],
    image: UNSPLASH("photo-1529139574466-a303027c1d8b", 800, 1200),
    title: "Garden Party Done Right",
    caption: "The secret to florals that feel modern? Keep everything else ruthlessly simple. One statement print, neutral accessories, done.",
    tags: [
      { label: "Classic", color: "#C5A572" },
      { label: "Social", color: "#C4797A" },
    ],
    likes: 4100,
    comments: 211,
    saves: 945,
    items: [
      { id: "p7-i1", name: "Printed Wrap Dress", brand: "Diane von Furstenberg", price: 398, image: UNSPLASH("photo-1572804013309-59a88b7e92f1", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "p7-i2", name: "Raffia Basket Bag", brand: "Loewe", price: 450, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
    ],
    createdAt: "1d ago",
    occasion: "Brunch",
  },
  {
    id: "post-8",
    creator: creators[7],
    image: UNSPLASH("photo-1483985988355-763728e1935b", 800, 1200),
    title: "Pack Light, Look Incredible",
    caption: "My travel capsule: 6 pieces, 15 outfits, one carry-on. Linen, neutral palette, versatile shapes. That's the formula.",
    tags: [
      { label: "Travel", color: "#A8B5A0" },
      { label: "Capsule", color: "#8A8A8A" },
    ],
    likes: 6340,
    comments: 445,
    saves: 2340,
    items: [
      { id: "p8-i1", name: "Linen Utility Shirt", brand: "Apiece Apart", price: 265, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "p8-i2", name: "Woven Tote Bag", brand: "Dragon Diffusion", price: 340, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "p8-i3", name: "Suede Flat Sandals", brand: "K. Jacques", price: 280, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
    createdAt: "2d ago",
    occasion: "Travel",
  },
  {
    id: "post-9",
    creator: creators[0],
    image: UNSPLASH("photo-1558618666-fcd25c85f82e", 800, 1200),
    title: "Capsule Perfection",
    caption: "My 20-piece wardrobe update for the season. Every item earns its place. No noise, no clutter — just clarity.",
    tags: [
      { label: "Minimalist", color: "#1A1A1A" },
      { label: "Capsule", color: "#8A8A8A" },
    ],
    likes: 9100,
    comments: 567,
    saves: 3200,
    items: [
      { id: "p9-i1", name: "White T-Shirt", brand: "COS", price: 35, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "p9-i2", name: "Straight-Leg Jeans", brand: "AGOLDE", price: 198, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
    createdAt: "2d ago",
    occasion: "Any",
  },
  {
    id: "post-10",
    creator: creators[4],
    image: UNSPLASH("photo-1566174053879-31528523f8ae", 800, 1200),
    title: "After Dark Essentials",
    caption: "Black tie doesn't mean boring. This sequin column dress paired with minimal gold jewelry — that's the sweet spot between statement and restraint.",
    tags: [
      { label: "Evening", color: "#1A1A1A" },
      { label: "Glamour", color: "#C5A572" },
    ],
    likes: 5430,
    comments: 234,
    saves: 1670,
    items: [
      { id: "p10-i1", name: "Sequin Column Dress", brand: "Rotate", price: 595, image: UNSPLASH("photo-1566174053879-31528523f8ae", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "p10-i2", name: "Crystal Drop Earrings", brand: "Swarovski", price: 189, image: UNSPLASH("photo-1535632066927-ab7c9ab60908", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
    createdAt: "3d ago",
    occasion: "Gala",
  },
  {
    id: "post-11",
    creator: creators[3],
    image: UNSPLASH("photo-1572804013309-59a88b7e92f1", 800, 1200),
    title: "Vintage Finds, Modern Fits",
    caption: "This vintage Dior scarf styled as a top with high-waisted trousers — proof that the best fashion is the fashion that already exists.",
    tags: [
      { label: "Vintage", color: "#C4797A" },
      { label: "Sustainable", color: "#A8B5A0" },
    ],
    likes: 3780,
    comments: 198,
    saves: 890,
    items: [
      { id: "p11-i1", name: "Vintage Silk Scarf", brand: "Dior (Vintage)", price: 180, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
    createdAt: "3d ago",
    occasion: "Any",
  },
  {
    id: "post-12",
    creator: creators[7],
    image: UNSPLASH("photo-1539533018447-63fcce2678e3", 800, 1200),
    title: "The Coat That Does Everything",
    caption: "A great coat is the foundation of any wardrobe. This Max Mara piece has been on my must-have list for three years. Worth every penny.",
    tags: [
      { label: "Investment", color: "#C5A572" },
      { label: "Outerwear", color: "#2D2D2D" },
    ],
    likes: 7890,
    comments: 512,
    saves: 2890,
    items: [
      { id: "p12-i1", name: "Tailored Wool Coat", brand: "Max Mara", price: 895, image: UNSPLASH("photo-1539533018447-63fcce2678e3", 400, 500), category: "Outerwear", shopUrl: "#" },
    ],
    createdAt: "4d ago",
    occasion: "Any",
  },
];

export const mustHaveLists: MustHaveList[] = [
  {
    id: "list-1",
    creator: creators[0],
    name: "Summer Essentials 2025",
    description: "The only 10 pieces you need this summer. Neutral palette, maximum versatility, zero regrets.",
    coverImage: UNSPLASH("photo-1483985988355-763728e1935b", 600, 400),
    items: [
      { id: "ml1-i1", name: "Linen Utility Shirt", brand: "Apiece Apart", price: 265, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ml1-i2", name: "Flowing Midi Dress", brand: "Reformation", price: 248, image: UNSPLASH("photo-1595777457583-95e059d581b8", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "ml1-i3", name: "Suede Flat Sandals", brand: "K. Jacques", price: 280, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "ml1-i4", name: "Woven Tote Bag", brand: "Dragon Diffusion", price: 340, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "ml1-i5", name: "Gold Chain Necklace", brand: "Mejuri", price: 128, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
    likes: 12400,
    saves: 5600,
  },
  {
    id: "list-2",
    creator: creators[1],
    name: "Investment Pieces Under $500",
    description: "Build a wardrobe that lasts. These timeless pieces pay for themselves in cost-per-wear within a season.",
    coverImage: UNSPLASH("photo-1509631179647-0177331693ae", 600, 400),
    items: [
      { id: "ml2-i1", name: "Cashmere Sweater", brand: "Everlane", price: 148, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ml2-i2", name: "Straight-Leg Jeans", brand: "AGOLDE", price: 198, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "ml2-i3", name: "White Leather Sneakers", brand: "Common Projects", price: 425, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "ml2-i4", name: "Trench Coat", brand: "Arket", price: 299, image: UNSPLASH("photo-1539533018447-63fcce2678e3", 400, 500), category: "Outerwear", shopUrl: "#" },
    ],
    likes: 8900,
    saves: 4200,
  },
  {
    id: "list-3",
    creator: creators[2],
    name: "Streetwear Starter Pack",
    description: "Skip the hype. These are the foundation pieces every streetwear wardrobe needs — quality, not logos.",
    coverImage: UNSPLASH("photo-1515886657613-9f3515b0c78f", 600, 400),
    items: [
      { id: "ml3-i1", name: "Oversized Cotton Tee", brand: "Aritzia", price: 58, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ml3-i2", name: "Leather Moto Jacket", brand: "AllSaints", price: 499, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "ml3-i3", name: "White Leather Sneakers", brand: "Common Projects", price: 425, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
    likes: 15600,
    saves: 7800,
  },
  {
    id: "list-4",
    creator: creators[7],
    name: "The Perfect Travel Capsule",
    description: "6 pieces, 15 outfits, one carry-on. Curated for the style-conscious traveler who refuses to compromise.",
    coverImage: UNSPLASH("photo-1483985988355-763728e1935b", 600, 400),
    items: [
      { id: "ml4-i1", name: "Linen Utility Shirt", brand: "Apiece Apart", price: 265, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "ml4-i2", name: "Cargo Culottes", brand: "COS", price: 135, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "ml4-i3", name: "Suede Flat Sandals", brand: "K. Jacques", price: 280, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "ml4-i4", name: "Woven Tote Bag", brand: "Dragon Diffusion", price: 340, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "ml4-i5", name: "Silk Scarf", brand: "Toteme", price: 190, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
      { id: "ml4-i6", name: "Linen Shorts", brand: "Madewell", price: 72, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
    ],
    likes: 11200,
    saves: 6100,
  },
];

const POLL_IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=80`;

export const stylePolls: StylePoll[] = [
  {
    id: "poll-1",
    question: "Date night: which vibe?",
    optionA: { label: "Little Black Dress", image: POLL_IMG("photo-1469334031218-e382a71b716b"), votes: 12400 },
    optionB: { label: "Power Suit", image: POLL_IMG("photo-1539109136881-3be0616acf4b"), votes: 8900 },
    totalVotes: 21300,
  },
  {
    id: "poll-2",
    question: "Office fit: classic or siren?",
    optionA: { label: "Quiet Luxury", image: POLL_IMG("photo-1558618666-fcd25c85f82e"), votes: 15700 },
    optionB: { label: "Office Siren", image: POLL_IMG("photo-1550614000-4895a10e1bfd"), votes: 18200 },
    totalVotes: 33900,
  },
  {
    id: "poll-3",
    question: "Summer essential?",
    optionA: { label: "Linen Everything", image: POLL_IMG("photo-1544957992-20514f595d6f"), votes: 22100 },
    optionB: { label: "Crochet & Denim", image: POLL_IMG("photo-1506152983158-b4a74a01c721"), votes: 19800 },
    totalVotes: 41900,
  },
];

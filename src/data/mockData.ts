export interface StyleTag {
  label: string;
  color: string;
}

export interface LookItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  shopUrl: string;
}

export type MoodFilter = "all" | "minimal" | "romantic" | "street" | "evening" | "classic" | "adventure";

export interface Look {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  photographer?: string;
  tags: StyleTag[];
  occasion: string;
  priceRange: string;
  items: LookItem[];
  season: string;
  description: string;
  likes: number;
  trending?: boolean;
  editorsChoice?: boolean;
  mood: MoodFilter;
  badge?: "trending" | "editors-pick" | "new";
}

export interface EventType {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface CapsuleCategory {
  name: string;
  count: number;
  items: CapsuleItem[];
}

export interface CapsuleItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  color: string;
  essential: boolean;
}

export interface StyleDNAEntry {
  style: string;
  percentage: number;
  color: string;
}

const UNSPLASH = (id: string, w = 800, h = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const feedLooks: Look[] = [
  {
    id: "look-1",
    image: UNSPLASH("photo-1509631179647-0177331693ae", 800, 1200),
    title: "Effortless Elegance",
    subtitle: "The new power dressing",
    photographer: "Tamara Bellis",
    badge: "editors-pick",
    tags: [
      { label: "Minimalist", color: "#1A1A1A" },
      { label: "Office", color: "#4A4A4A" },
    ],
    occasion: "Work",
    priceRange: "$200 – $800",
    season: "Fall/Winter",
    description:
      "Clean lines meet architectural silhouettes in this season's definitive work wardrobe. A masterclass in restraint.",
    likes: 14200,
    trending: true,
    editorsChoice: true,
    mood: "minimal",
    items: [
      { id: "i1", name: "Structured Wool Blazer", brand: "COS", price: 275, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "i2", name: "Silk Camisole", brand: "Vince", price: 195, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i3", name: "Wide-Leg Trousers", brand: "Theory", price: 325, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i4", name: "Leather Pointed Mules", brand: "Aeyde", price: 345, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-2",
    image: UNSPLASH("photo-1496747611176-843222e1e57c", 800, 1200),
    title: "Summer Reverie",
    subtitle: "Soft hues, warm evenings",
    photographer: "Flaunter",
    tags: [
      { label: "Romantic", color: "#C4797A" },
      { label: "Evening", color: "#B8A9C9" },
    ],
    occasion: "Date Night",
    priceRange: "$150 – $600",
    season: "Spring/Summer",
    description:
      "Diaphanous fabrics and sun-kissed palettes that move with you. Dress for the evening you deserve.",
    likes: 9800,
    trending: true,
    mood: "romantic",
    items: [
      { id: "i5", name: "Flowing Midi Dress", brand: "Reformation", price: 248, image: UNSPLASH("photo-1595777457583-95e059d581b8", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "i6", name: "Strappy Heeled Sandals", brand: "By Far", price: 420, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i7", name: "Gold Chain Necklace", brand: "Mejuri", price: 128, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
      { id: "i8", name: "Embossed Clutch", brand: "Cult Gaia", price: 298, image: UNSPLASH("photo-1584917865442-de89df76afd3", 400, 500), category: "Bags", shopUrl: "#" },
    ],
  },
  {
    id: "look-3",
    image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 800, 1200),
    title: "Street Luxe",
    subtitle: "Where comfort meets couture",
    photographer: "Dom Hill",
    badge: "trending",
    tags: [
      { label: "Streetwear", color: "#2D2D2D" },
      { label: "Casual", color: "#8A8A8A" },
    ],
    occasion: "Weekend",
    priceRange: "$100 – $500",
    season: "All Season",
    description:
      "The art of looking effortlessly put-together. Elevated basics that work harder than your entire closet.",
    likes: 18400,
    trending: true,
    mood: "street",
    items: [
      { id: "i9", name: "Oversized Cotton Tee", brand: "Aritzia", price: 58, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i10", name: "Leather Moto Jacket", brand: "AllSaints", price: 499, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "i11", name: "Straight-Leg Jeans", brand: "AGOLDE", price: 198, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i12", name: "White Leather Sneakers", brand: "Common Projects", price: 425, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-4",
    image: UNSPLASH("photo-1469334031218-e382a71b716b", 800, 1200),
    title: "Après Noir",
    subtitle: "After-dark allure",
    photographer: "Tamara Bellis",
    tags: [
      { label: "Evening", color: "#1A1A1A" },
      { label: "Glamour", color: "#C5A572" },
    ],
    occasion: "Gala",
    priceRange: "$300 – $1,200",
    season: "Fall/Winter",
    description:
      "When the invitation says black tie, answer with conviction. Statement pieces that command every room.",
    likes: 7600,
    mood: "evening",
    items: [
      { id: "i13", name: "Sequin Column Dress", brand: "Rotate", price: 595, image: UNSPLASH("photo-1566174053879-31528523f8ae", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "i14", name: "Crystal Drop Earrings", brand: "Swarovski", price: 189, image: UNSPLASH("photo-1535632066927-ab7c9ab60908", 400, 500), category: "Accessories", shopUrl: "#" },
      { id: "i15", name: "Satin Stiletto Pumps", brand: "Jimmy Choo", price: 750, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i16", name: "Box Clutch", brand: "Bottega Veneta", price: 1150, image: UNSPLASH("photo-1548036328-c9fa89d128fa", 400, 500), category: "Bags", shopUrl: "#" },
    ],
  },
  {
    id: "look-5",
    image: UNSPLASH("photo-1483985988355-763728e1935b", 800, 1200),
    title: "Urban Safari",
    subtitle: "City exploring, redefined",
    photographer: "Heidi Fin",
    badge: "new",
    tags: [
      { label: "Adventure", color: "#A8B5A0" },
      { label: "Utility", color: "#8A8A8A" },
    ],
    occasion: "Travel",
    priceRange: "$150 – $600",
    season: "Spring/Summer",
    description:
      "Pack less, look more. Versatile silhouettes in earth tones that take you from gallery to rooftop bar.",
    likes: 6200,
    mood: "adventure",
    items: [
      { id: "i17", name: "Linen Utility Shirt", brand: "Apiece Apart", price: 265, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i18", name: "Cargo Culottes", brand: "COS", price: 135, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i19", name: "Woven Tote Bag", brand: "Dragon Diffusion", price: 340, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "i20", name: "Suede Flat Sandals", brand: "K. Jacques", price: 280, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-6",
    image: UNSPLASH("photo-1485968579580-b6d095142e6e", 800, 1200),
    title: "Monochrome Mood",
    subtitle: "All black, everything",
    photographer: "Matthew Sichkaruk",
    tags: [
      { label: "Minimalist", color: "#1A1A1A" },
      { label: "Chic", color: "#4A4A4A" },
    ],
    occasion: "Any",
    priceRange: "$200 – $900",
    season: "All Season",
    description:
      "The eternal palette. There's nothing more powerful than a woman who has mastered the art of black.",
    likes: 11300,
    trending: true,
    mood: "minimal",
    items: [
      { id: "i21", name: "Cashmere Turtleneck", brand: "Nili Lotan", price: 495, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i22", name: "Tailored Wool Coat", brand: "Max Mara", price: 895, image: UNSPLASH("photo-1539533018447-63fcce2678e3", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "i23", name: "Slim Ankle Trousers", brand: "The Row", price: 590, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i24", name: "Pointed Ankle Boots", brand: "Acne Studios", price: 620, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-7",
    image: UNSPLASH("photo-1529139574466-a303027c1d8b", 800, 1200),
    title: "Garden Party",
    subtitle: "Florals but make it modern",
    photographer: "Tamara Bellis",
    badge: "editors-pick",
    tags: [
      { label: "Feminine", color: "#E8D5D0" },
      { label: "Social", color: "#C4797A" },
    ],
    occasion: "Brunch",
    priceRange: "$100 – $400",
    season: "Spring/Summer",
    description:
      "Prints that feel fresh, not fussy. The kind of outfit that makes everyone ask where you got it.",
    likes: 5400,
    mood: "romantic",
    items: [
      { id: "i25", name: "Printed Wrap Dress", brand: "Diane von Furstenberg", price: 398, image: UNSPLASH("photo-1572804013309-59a88b7e92f1", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "i26", name: "Raffia Basket Bag", brand: "Loewe", price: 450, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "i27", name: "Block Heel Sandals", brand: "Loeffler Randall", price: 295, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i28", name: "Straw Sun Hat", brand: "Lack of Color", price: 89, image: UNSPLASH("photo-1521369909029-2afed882baee", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
  },
  {
    id: "look-8",
    image: UNSPLASH("photo-1539109136881-3be0616acf4b", 800, 1200),
    title: "Power Suit",
    subtitle: "Boardroom to bar",
    photographer: "Christina Wocintech",
    tags: [
      { label: "Tailored", color: "#1A1A1A" },
      { label: "Power", color: "#C5A572" },
    ],
    occasion: "Interview",
    priceRange: "$300 – $1,000",
    season: "All Season",
    description:
      "The modern suit is your armor. Structured enough to command respect, relaxed enough to feel like you.",
    likes: 8900,
    mood: "classic",
    items: [
      { id: "i29", name: "Double-Breasted Blazer", brand: "Toteme", price: 690, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Outerwear", shopUrl: "#" },
      { id: "i30", name: "High-Waist Trousers", brand: "Toteme", price: 390, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i31", name: "Leather Tote", brand: "Mansur Gavriel", price: 595, image: UNSPLASH("photo-1584917865442-de89df76afd3", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "i32", name: "Pointed Pumps", brand: "Stuart Weitzman", price: 395, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-9",
    image: UNSPLASH("photo-1558618666-fcd25c85f82e", 800, 1200),
    title: "Quiet Luxury",
    subtitle: "Whisper, don't shout",
    photographer: "Laura Chouette",
    tags: [
      { label: "Quiet Luxury", color: "#C5A572" },
      { label: "Investment", color: "#1A1A1A" },
    ],
    occasion: "Any",
    priceRange: "$400 – $2,000",
    season: "All Season",
    description:
      "The art of stealth wealth. Unbranded, impeccably cut, devastatingly expensive-looking. IYKYK.",
    likes: 22100,
    trending: true,
    mood: "classic",
    items: [
      { id: "i33", name: "Cashmere Crew", brand: "The Row", price: 890, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i34", name: "Wool Palazzo Pants", brand: "Toteme", price: 450, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i35", name: "Leather Belt Bag", brand: "Bottega Veneta", price: 1850, image: UNSPLASH("photo-1548036328-c9fa89d128fa", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "i36", name: "Suede Loafers", brand: "The Row", price: 990, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-10",
    image: UNSPLASH("photo-1519764622345-23439dd774f7", 800, 1200),
    title: "Copenhagen Cool",
    subtitle: "Scandi minimalism at its peak",
    photographer: "Vogue Scandinavia",
    tags: [
      { label: "Scandi", color: "#8A8A8A" },
      { label: "Clean", color: "#1A1A1A" },
    ],
    occasion: "Work",
    priceRange: "$150 – $500",
    season: "Fall/Winter",
    description:
      "Copenhagen Fashion Week street style decoded. Oversized shapes, tonal layering, zero effort required.",
    likes: 15700,
    trending: true,
    mood: "minimal",
    items: [
      { id: "i37", name: "Oversized Wool Shirt", brand: "COS", price: 175, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i38", name: "Wide-Leg Wool Pants", brand: "Arket", price: 149, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i39", name: "Padded Tote", brand: "Stand Studio", price: 380, image: UNSPLASH("photo-1584917865442-de89df76afd3", 400, 500), category: "Bags", shopUrl: "#" },
      { id: "i40", name: "Chelsea Boots", brand: "Ganni", price: 475, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-11",
    image: UNSPLASH("photo-1581044777550-4cfa60707998", 800, 1200),
    title: "New Romantic",
    subtitle: "Softness as a statement",
    photographer: "Harper's Bazaar",
    tags: [
      { label: "Romantic", color: "#E8D5D0" },
      { label: "Feminine", color: "#C4797A" },
    ],
    occasion: "Date Night",
    priceRange: "$200 – $700",
    season: "Spring/Summer",
    description:
      "Organza, tulle, and a touch of Victorian drama. For the woman who treats getting dressed like poetry.",
    likes: 8400,
    mood: "romantic",
    items: [
      { id: "i41", name: "Organza Blouse", brand: "Zimmermann", price: 595, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i42", name: "Tulle Midi Skirt", brand: "Simone Rocha", price: 680, image: UNSPLASH("photo-1583496661160-fb5886a0aabd", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i43", name: "Pearl Drop Earrings", brand: "Sophie Buhai", price: 345, image: UNSPLASH("photo-1535632066927-ab7c9ab60908", 400, 500), category: "Accessories", shopUrl: "#" },
      { id: "i44", name: "Satin Kitten Heels", brand: "Mach & Mach", price: 650, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-12",
    image: UNSPLASH("photo-1552374196-1ab2a1c593e8", 800, 1200),
    title: "Tokyo Streetwear",
    subtitle: "East meets west side",
    photographer: "Highsnobiety",
    tags: [
      { label: "Streetwear", color: "#2D2D2D" },
      { label: "Tokyo", color: "#B8A9C9" },
    ],
    occasion: "Weekend",
    priceRange: "$100 – $800",
    season: "All Season",
    description:
      "Harajuku precision meets downtown New York. Layering, proportion play, and zero-compromise attitude.",
    likes: 19200,
    trending: true,
    mood: "street",
    items: [
      { id: "i45", name: "Graphic Hoodie", brand: "Sacai", price: 580, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i46", name: "Cargo Pants", brand: "Needles", price: 340, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i47", name: "Chunky Sneakers", brand: "New Balance", price: 175, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i48", name: "Crossbody Pouch", brand: "Porter-Yoshida", price: 195, image: UNSPLASH("photo-1548036328-c9fa89d128fa", 400, 500), category: "Bags", shopUrl: "#" },
    ],
  },
  {
    id: "look-13",
    image: UNSPLASH("photo-1519235106695-a1bda50aeb4c", 800, 1200),
    title: "Red Carpet Ready",
    subtitle: "Main character energy",
    photographer: "Getty Images",
    tags: [
      { label: "Glamour", color: "#C5A572" },
      { label: "Statement", color: "#C4797A" },
    ],
    occasion: "Gala",
    priceRange: "$500 – $3,000",
    season: "Fall/Winter",
    description:
      "When you need to own the room from the moment you walk in. Structured drama meets liquid gold.",
    likes: 12600,
    editorsChoice: true,
    mood: "evening",
    items: [
      { id: "i49", name: "Draped Gown", brand: "Saint Laurent", price: 2890, image: UNSPLASH("photo-1566174053879-31528523f8ae", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "i50", name: "Statement Cuff", brand: "Alexander McQueen", price: 790, image: UNSPLASH("photo-1535632066927-ab7c9ab60908", 400, 500), category: "Accessories", shopUrl: "#" },
      { id: "i51", name: "Platform Heels", brand: "Versace", price: 1250, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i52", name: "Crystal Minaudière", brand: "Judith Leiber", price: 2490, image: UNSPLASH("photo-1548036328-c9fa89d128fa", 400, 500), category: "Bags", shopUrl: "#" },
    ],
  },
  {
    id: "look-14",
    image: UNSPLASH("photo-1544957992-20514f595d6f", 800, 1200),
    title: "Coastal Grandmother",
    subtitle: "Nancy Meyers core",
    photographer: "Coastal Living",
    tags: [
      { label: "Coastal", color: "#A8B5A0" },
      { label: "Classic", color: "#C5A572" },
    ],
    occasion: "Travel",
    priceRange: "$100 – $600",
    season: "Spring/Summer",
    description:
      "Linen everything, a cashmere thrown over the shoulders, and a glass of Sancerre in hand. That's the whole mood.",
    likes: 16500,
    trending: true,
    mood: "classic",
    items: [
      { id: "i53", name: "Oversized Linen Shirt", brand: "Frank & Eileen", price: 248, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i54", name: "Wide-Leg Linen Pants", brand: "Jenni Kayne", price: 295, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i55", name: "Canvas Espadrilles", brand: "Castañer", price: 120, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i56", name: "Straw Market Tote", brand: "Loewe", price: 550, image: UNSPLASH("photo-1590874103328-eac38a683ce7", 400, 500), category: "Bags", shopUrl: "#" },
    ],
  },
  {
    id: "look-15",
    image: UNSPLASH("photo-1550614000-4895a10e1bfd", 800, 1200),
    title: "Workwear 2.0",
    subtitle: "Office siren era",
    photographer: "Who What Wear",
    tags: [
      { label: "Corporate", color: "#1A1A1A" },
      { label: "Siren", color: "#C4797A" },
    ],
    occasion: "Work",
    priceRange: "$200 – $800",
    season: "All Season",
    description:
      "The girlboss blazer is dead. Long live the office siren — fitted, intentional, and unforgettable.",
    likes: 13800,
    mood: "classic",
    items: [
      { id: "i57", name: "Fitted Blazer Dress", brand: "Mugler", price: 790, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 500), category: "Dresses", shopUrl: "#" },
      { id: "i58", name: "Sheer Turtleneck", brand: "Wolford", price: 250, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i59", name: "Pencil Skirt", brand: "Max Mara", price: 495, image: UNSPLASH("photo-1583496661160-fb5886a0aabd", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i60", name: "Pointed Slingbacks", brand: "Manolo Blahnik", price: 745, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
    ],
  },
  {
    id: "look-16",
    image: UNSPLASH("photo-1506152983158-b4a74a01c721", 800, 1200),
    title: "Festival Season",
    subtitle: "Main stage meets backstage",
    photographer: "Refinery29",
    tags: [
      { label: "Festival", color: "#B8A9C9" },
      { label: "Boho", color: "#A8B5A0" },
    ],
    occasion: "Festival",
    priceRange: "$50 – $400",
    season: "Spring/Summer",
    description:
      "Forget flower crowns. Modern festival dressing is about unexpected textures, vintage finds, and zero rules.",
    likes: 21300,
    trending: true,
    mood: "adventure",
    items: [
      { id: "i61", name: "Crochet Top", brand: "Cult Gaia", price: 198, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 500), category: "Tops", shopUrl: "#" },
      { id: "i62", name: "Denim Cutoffs", brand: "RE/DONE", price: 225, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 500), category: "Bottoms", shopUrl: "#" },
      { id: "i63", name: "Western Boots", brand: "Isabel Marant", price: 390, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 500), category: "Shoes", shopUrl: "#" },
      { id: "i64", name: "Layered Necklaces", brand: "Missoma", price: 89, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 500), category: "Accessories", shopUrl: "#" },
    ],
  },
];

export const moodFilters: { id: MoodFilter; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "" },
  { id: "minimal", label: "Minimal", emoji: "" },
  { id: "romantic", label: "Romantic", emoji: "" },
  { id: "street", label: "Street", emoji: "" },
  { id: "evening", label: "Evening", emoji: "" },
  { id: "classic", label: "Classic", emoji: "" },
  { id: "adventure", label: "Adventure", emoji: "" },
];

export const eventTypes: EventType[] = [
  { id: "date-night", name: "Date Night", icon: "heart", image: UNSPLASH("photo-1469334031218-e382a71b716b", 600, 400), description: "Romantic and alluring" },
  { id: "wedding", name: "Wedding Guest", icon: "gem", image: UNSPLASH("photo-1519741497674-611481863552", 600, 400), description: "Celebratory elegance" },
  { id: "interview", name: "Job Interview", icon: "briefcase", image: UNSPLASH("photo-1539109136881-3be0616acf4b", 600, 400), description: "Confident & polished" },
  { id: "brunch", name: "Weekend Brunch", icon: "coffee", image: UNSPLASH("photo-1529139574466-a303027c1d8b", 600, 400), description: "Effortlessly chic" },
  { id: "vacation", name: "Vacation", icon: "sun", image: UNSPLASH("photo-1483985988355-763728e1935b", 600, 400), description: "Pack light, look great" },
  { id: "gala", name: "Black Tie Gala", icon: "sparkles", image: UNSPLASH("photo-1566174053879-31528523f8ae", 600, 400), description: "Show-stopping glamour" },
  { id: "casual", name: "Casual Friday", icon: "shirt", image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 600, 400), description: "Polished comfort" },
  { id: "festival", name: "Music Festival", icon: "music", image: UNSPLASH("photo-1485968579580-b6d095142e6e", 600, 400), description: "Bold & free-spirited" },
];

export const capsuleCategories: CapsuleCategory[] = [
  {
    name: "Tops",
    count: 8,
    items: [
      { id: "c1", name: "White T-Shirt", brand: "COS", price: 35, image: UNSPLASH("photo-1521572163474-6864f9cf17ab", 400, 400), color: "#FFFFFF", essential: true },
      { id: "c2", name: "Black Turtleneck", brand: "Uniqlo", price: 39, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 400), color: "#1A1A1A", essential: true },
      { id: "c3", name: "Striped Breton", brand: "Saint James", price: 85, image: UNSPLASH("photo-1554568218-0f1715e72254", 400, 400), color: "#1A1A7A", essential: true },
      { id: "c4", name: "Silk Blouse", brand: "Equipment", price: 230, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 400), color: "#FAF9F6", essential: true },
      { id: "c5", name: "Cashmere Sweater", brand: "Everlane", price: 148, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 400), color: "#E8D5D0", essential: false },
      { id: "c6", name: "Chambray Shirt", brand: "J.Crew", price: 89, image: UNSPLASH("photo-1596755094514-f87e34085b2c", 400, 400), color: "#6B8CAE", essential: false },
      { id: "c7", name: "Linen Tank", brand: "Aritzia", price: 48, image: UNSPLASH("photo-1564257631407-4deb1f99d992", 400, 400), color: "#A8B5A0", essential: false },
      { id: "c8", name: "Knit Polo", brand: "Sezane", price: 110, image: UNSPLASH("photo-1576566588028-4147f3842f27", 400, 400), color: "#C5A572", essential: false },
    ],
  },
  {
    name: "Bottoms",
    count: 6,
    items: [
      { id: "c9", name: "Straight-Leg Jeans", brand: "AGOLDE", price: 198, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 400), color: "#4A6A8A", essential: true },
      { id: "c10", name: "Black Trousers", brand: "Theory", price: 295, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 400), color: "#1A1A1A", essential: true },
      { id: "c11", name: "Midi Skirt", brand: "COS", price: 99, image: UNSPLASH("photo-1583496661160-fb5886a0aabd", 400, 400), color: "#E8D5D0", essential: true },
      { id: "c12", name: "Linen Shorts", brand: "Madewell", price: 72, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 400), color: "#FAF9F6", essential: false },
      { id: "c13", name: "Wool Culottes", brand: "COS", price: 135, image: UNSPLASH("photo-1594938298603-c8148c4dae35", 400, 400), color: "#8A8A8A", essential: false },
      { id: "c14", name: "White Jeans", brand: "Citizens of Humanity", price: 218, image: UNSPLASH("photo-1541099649105-f69ad21f3246", 400, 400), color: "#FFFFFF", essential: false },
    ],
  },
  {
    name: "Outerwear",
    count: 4,
    items: [
      { id: "c15", name: "Trench Coat", brand: "Arket", price: 299, image: UNSPLASH("photo-1539533018447-63fcce2678e3", 400, 400), color: "#C5A572", essential: true },
      { id: "c16", name: "Leather Jacket", brand: "AllSaints", price: 499, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 400), color: "#1A1A1A", essential: true },
      { id: "c17", name: "Wool Blazer", brand: "Toteme", price: 590, image: UNSPLASH("photo-1591047139829-d91aecb6caea", 400, 400), color: "#2D2D2D", essential: true },
      { id: "c18", name: "Denim Jacket", brand: "Levi's", price: 118, image: UNSPLASH("photo-1551028719-00167b16eac5", 400, 400), color: "#4A6A8A", essential: false },
    ],
  },
  {
    name: "Shoes",
    count: 5,
    items: [
      { id: "c19", name: "White Sneakers", brand: "Common Projects", price: 425, image: UNSPLASH("photo-1549298916-b41d501d3772", 400, 400), color: "#FFFFFF", essential: true },
      { id: "c20", name: "Black Ankle Boots", brand: "Acne Studios", price: 620, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 400), color: "#1A1A1A", essential: true },
      { id: "c21", name: "Neutral Heels", brand: "Stuart Weitzman", price: 395, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 400), color: "#E8D5D0", essential: true },
      { id: "c22", name: "Flat Sandals", brand: "K. Jacques", price: 280, image: UNSPLASH("photo-1603487742131-4160ec999306", 400, 400), color: "#C5A572", essential: false },
      { id: "c23", name: "Loafers", brand: "G.H. Bass", price: 175, image: UNSPLASH("photo-1543163521-1bf539c55dd2", 400, 400), color: "#4A2A1A", essential: false },
    ],
  },
  {
    name: "Accessories",
    count: 5,
    items: [
      { id: "c24", name: "Leather Tote", brand: "Mansur Gavriel", price: 595, image: UNSPLASH("photo-1584917865442-de89df76afd3", 400, 400), color: "#C5A572", essential: true },
      { id: "c25", name: "Crossbody Bag", brand: "A.P.C.", price: 395, image: UNSPLASH("photo-1548036328-c9fa89d128fa", 400, 400), color: "#1A1A1A", essential: true },
      { id: "c26", name: "Silk Scarf", brand: "Toteme", price: 190, image: UNSPLASH("photo-1599643478518-a784e5dc4c8f", 400, 400), color: "#E8D5D0", essential: false },
      { id: "c27", name: "Gold Hoops", brand: "Mejuri", price: 68, image: UNSPLASH("photo-1535632066927-ab7c9ab60908", 400, 400), color: "#C5A572", essential: true },
      { id: "c28", name: "Sunglasses", brand: "Celine", price: 420, image: UNSPLASH("photo-1511499767150-a48a237f0083", 400, 400), color: "#1A1A1A", essential: false },
    ],
  },
];

export const defaultStyleDNA: StyleDNAEntry[] = [
  { style: "Minimalist", percentage: 35, color: "#1A1A1A" },
  { style: "Classic", percentage: 25, color: "#C5A572" },
  { style: "Romantic", percentage: 20, color: "#E8D5D0" },
  { style: "Streetwear", percentage: 12, color: "#4A4A4A" },
  { style: "Avant-Garde", percentage: 8, color: "#B8A9C9" },
];

export const styleQuizImages = [
  { id: "q1", image: UNSPLASH("photo-1509631179647-0177331693ae", 600, 800), style: "Minimalist" },
  { id: "q2", image: UNSPLASH("photo-1496747611176-843222e1e57c", 600, 800), style: "Romantic" },
  { id: "q3", image: UNSPLASH("photo-1515886657613-9f3515b0c78f", 600, 800), style: "Streetwear" },
  { id: "q4", image: UNSPLASH("photo-1469334031218-e382a71b716b", 600, 800), style: "Glamour" },
  { id: "q5", image: UNSPLASH("photo-1483985988355-763728e1935b", 600, 800), style: "Classic" },
];

export interface TrendingAesthetic {
  id: string;
  label: string;
  subtitle: string;
  image: string;
  views: number;
  mood: MoodFilter;
  color: string;
}

export const trendingAesthetics: TrendingAesthetic[] = [
  {
    id: "ta-1",
    label: "Quiet Luxury",
    subtitle: "Stealth wealth",
    image: UNSPLASH("photo-1558618666-fcd25c85f82e", 300, 400),
    views: 2400000,
    mood: "classic",
    color: "#C5A572",
  },
  {
    id: "ta-2",
    label: "Clean Girl",
    subtitle: "Less is more",
    image: UNSPLASH("photo-1509631179647-0177331693ae", 300, 400),
    views: 5100000,
    mood: "minimal",
    color: "#1A1A1A",
  },
  {
    id: "ta-3",
    label: "Mob Wife",
    subtitle: "Fur & gold",
    image: UNSPLASH("photo-1469334031218-e382a71b716b", 300, 400),
    views: 1800000,
    mood: "evening",
    color: "#C4797A",
  },
  {
    id: "ta-4",
    label: "Coastal Grandma",
    subtitle: "Linen & ease",
    image: UNSPLASH("photo-1544957992-20514f595d6f", 300, 400),
    views: 3200000,
    mood: "classic",
    color: "#A8B5A0",
  },
  {
    id: "ta-5",
    label: "Dark Academia",
    subtitle: "Scholarly edge",
    image: UNSPLASH("photo-1485968579580-b6d095142e6e", 300, 400),
    views: 4700000,
    mood: "minimal",
    color: "#4A4A4A",
  },
  {
    id: "ta-6",
    label: "Tomato Girl",
    subtitle: "Mediterranean heat",
    image: UNSPLASH("photo-1529139574466-a303027c1d8b", 300, 400),
    views: 2900000,
    mood: "romantic",
    color: "#C4797A",
  },
  {
    id: "ta-7",
    label: "Old Money",
    subtitle: "Heritage prep",
    image: UNSPLASH("photo-1539109136881-3be0616acf4b", 300, 400),
    views: 6800000,
    mood: "classic",
    color: "#C5A572",
  },
  {
    id: "ta-8",
    label: "Gorpcore",
    subtitle: "Trail to street",
    image: UNSPLASH("photo-1483985988355-763728e1935b", 300, 400),
    views: 1500000,
    mood: "adventure",
    color: "#A8B5A0",
  },
  {
    id: "ta-9",
    label: "Coquette",
    subtitle: "Bows & blush",
    image: UNSPLASH("photo-1496747611176-843222e1e57c", 300, 400),
    views: 3800000,
    mood: "romantic",
    color: "#E8D5D0",
  },
  {
    id: "ta-10",
    label: "Indie Sleaze",
    subtitle: "Y2K revival",
    image: UNSPLASH("photo-1552374196-1ab2a1c593e8", 300, 400),
    views: 2100000,
    mood: "street",
    color: "#B8A9C9",
  },
];

export interface EditorNote {
  lookId: string;
  note: string;
  stylingTip: string;
  editorName: string;
}

export const editorNotes: Record<string, EditorNote> = {
  "look-1": {
    lookId: "look-1",
    note: "This is the look that launched a thousand corporate Pinterest boards. The COS blazer is architectural without trying too hard — pair with the Vince cami for that I-woke-up-like-this energy.",
    stylingTip: "Roll the sleeves once. It's the difference between 'attending the meeting' and 'running the meeting.'",
    editorName: "Sofia Reyes",
  },
  "look-2": {
    lookId: "look-2",
    note: "Reformation does what fast fashion wishes it could — dresses that move like they're alive. The Mejuri chain adds just enough glint without screaming for attention.",
    stylingTip: "Skip the clutch for daytime. Cross-body the bag and let the dress do the talking.",
    editorName: "Lila Rosenberg",
  },
  "look-3": {
    lookId: "look-3",
    note: "Common Projects and AllSaints are doing more work here than your entire wardrobe. This is stealth flex meets genuine comfort.",
    stylingTip: "The moto jacket goes over everything — dresses, tees, even a blazer. It's your personality in leather form.",
    editorName: "Jax Monroe",
  },
  "look-4": {
    lookId: "look-4",
    note: "Rotate has democratized the sequin dress — it's no longer reserved for the Met Gala. The Bottega clutch is the quiet flex that separates good taste from great.",
    stylingTip: "Keep makeup minimal when the dress is this loud. A bold red lip is the maximum.",
    editorName: "Eleanor Chen",
  },
  "look-5": {
    lookId: "look-5",
    note: "This is the outfit that makes strangers stop you at the airport. Apiece Apart nails transitional dressing — utility meets wanderlust.",
    stylingTip: "Pre-roll the linen shirt sleeves before you pack. Wrinkles are part of the charm.",
    editorName: "Zara Kim",
  },
  "look-6": {
    lookId: "look-6",
    note: "All black is a love language. Nili Lotan's cashmere against Max Mara wool is a texture masterclass. The Row trousers hang like they were cut for you specifically.",
    stylingTip: "Mix textures aggressively — matte, sheen, knit. Monochrome gets boring without contrast.",
    editorName: "Sofia Reyes",
  },
  "look-9": {
    lookId: "look-9",
    note: "This is the outfit where no one can tell what you're wearing, but everyone can tell it's expensive. The Row and Toteme understand that luxury whispers.",
    stylingTip: "Leave the logo bags at home. The point of quiet luxury is that IYKYK.",
    editorName: "Eleanor Chen",
  },
  "look-12": {
    lookId: "look-12",
    note: "Sacai and Needles are the Harajuku dream team. This look takes Shibuya street style and gives it a Western city edge. Bold without being costume-y.",
    stylingTip: "Let the hoodie do the graphic lifting. Keep shoes neutral so the proportions stay clean.",
    editorName: "Jax Monroe",
  },
};

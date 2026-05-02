import type { Look } from "./mockData";

export interface StylingTip {
  type: "pair" | "avoid" | "best";
  label: string;
  tip: string;
}

export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface DupeTier {
  level: "splurge" | "mid" | "save";
  category: string;
  brand: string;
  name: string;
  price: number;
  note: string;
}

export interface EditorialContext {
  editorsNote: string;
  stylingTips: StylingTip[];
  colorStory: ColorSwatch[];
  dupes: DupeTier[];
}

const NEUTRAL_PALETTE: ColorSwatch[] = [
  { hex: "#FAF9F6", name: "Cream" },
  { hex: "#1A1A1A", name: "Ink" },
  { hex: "#C5A572", name: "Gold" },
  { hex: "#8A8A8A", name: "Stone" },
  { hex: "#2D2D2D", name: "Charcoal" },
];

// Hand-curated editorial layer for the 16 hero looks.
// Editor's voice: Vogue-meets-The-Cut. Specific, opinionated, never generic.
const editorialByLookId: Record<string, EditorialContext> = {
  "look-1": {
    editorsNote:
      "The new power dressing isn't shoulder pads — it's a quietly perfect shoulder line. This is what an investment banker who reads The Gentlewoman wears.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A single gold piece — Mejuri-thin, never chunky." },
      { type: "avoid", label: "Skip", tip: "Tonal shoes match the suit too literally. Go contrast leather instead." },
      { type: "best", label: "Best for", tip: "Boardrooms, gallery openings, and the 7am commute that demands respect." },
    ],
    colorStory: [
      { hex: "#1A1A1A", name: "Ink Black" },
      { hex: "#FAF9F6", name: "Eggshell" },
      { hex: "#4A4A4A", name: "Slate" },
      { hex: "#C5A572", name: "Antique Gold" },
      { hex: "#8A8A8A", name: "Mushroom" },
    ],
    dupes: [
      { level: "splurge", category: "Blazer", brand: "The Row", name: "Mason Wool Blazer", price: 1990, note: "The platonic ideal." },
      { level: "mid", category: "Blazer", brand: "Toteme", name: "Tailored Wool Blazer", price: 690, note: "Same silhouette, half the price." },
      { level: "save", category: "Blazer", brand: "Mango", name: "Structured Wool-Blend Blazer", price: 130, note: "The TikTok favorite. Genuinely great." },
    ],
  },
  "look-2": {
    editorsNote:
      "Diaphanous. We're allowed to say diaphanous. This is the kind of dress that makes a maître d' walk you to a better table.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One bracelet stack on a single wrist. Negative space is the accessory." },
      { type: "avoid", label: "Skip", tip: "Closed-toe shoes — they'll fight the hem. Stay strappy." },
      { type: "best", label: "Best for", tip: "Rooftop dinners, golden hour weddings, and wherever the rosé is cold." },
    ],
    colorStory: [
      { hex: "#E8D5D0", name: "Petal" },
      { hex: "#C5A572", name: "Honey" },
      { hex: "#FAF9F6", name: "Linen White" },
      { hex: "#C4797A", name: "Dusty Rose" },
      { hex: "#B8A9C9", name: "Lilac" },
    ],
    dupes: [
      { level: "splurge", category: "Dress", brand: "Zimmermann", name: "Tiered Linen Maxi", price: 895, note: "If you're the friend who gets photographed." },
      { level: "mid", category: "Dress", brand: "Reformation", name: "Juliette Linen Dress", price: 248, note: "Reliable Reformation drape." },
      { level: "save", category: "Dress", brand: "& Other Stories", name: "Tie-Strap Maxi", price: 119, note: "Surprisingly photographs like the splurge." },
    ],
  },
  "look-3": {
    editorsNote:
      "Not 'street style' — street luxury. The difference is one $400 white sneaker and the certainty that nothing was tried too hard.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One unexpected accessory — a vintage scarf, an oversized watch." },
      { type: "avoid", label: "Skip", tip: "Logos on logos. Pick one brand to announce and silence the rest." },
      { type: "best", label: "Best for", tip: "Coffee runs that turn into all-day brunches into rooftop nights." },
    ],
    colorStory: [
      { hex: "#FAF9F6", name: "Off-White" },
      { hex: "#1A1A1A", name: "Black" },
      { hex: "#4A6A8A", name: "Indigo" },
      { hex: "#8A8A8A", name: "Concrete" },
      { hex: "#2D2D2D", name: "Carbon" },
    ],
    dupes: [
      { level: "splurge", category: "Sneaker", brand: "Common Projects", name: "Achilles Low", price: 425, note: "The canonical white sneaker." },
      { level: "mid", category: "Sneaker", brand: "Veja", name: "Esplar", price: 150, note: "Sustainable. Editor-favorite." },
      { level: "save", category: "Sneaker", brand: "Adidas", name: "Stan Smith", price: 90, note: "The original. Still right." },
    ],
  },
  "look-4": {
    editorsNote:
      "Black-tie Maximalism, restrained. The sequins do the work — your job is to stand still and let them.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Bare décolletage. Anything else is competing." },
      { type: "avoid", label: "Skip", tip: "Patterned tights — solid hosiery or none." },
      { type: "best", label: "Best for", tip: "Galas, Met-adjacent events, NYE if you're being serious about it." },
    ],
    colorStory: [
      { hex: "#1A1A1A", name: "Velvet Black" },
      { hex: "#C5A572", name: "Champagne" },
      { hex: "#2D2D2D", name: "Onyx" },
      { hex: "#FAF9F6", name: "Pearl" },
      { hex: "#4A4A4A", name: "Silver" },
    ],
    dupes: [
      { level: "splurge", category: "Gown", brand: "Galvan", name: "Sequin Column Dress", price: 1450, note: "Worn by every It-girl since 2016." },
      { level: "mid", category: "Gown", brand: "Rotate Birger", name: "Sequin Maxi", price: 595, note: "Copenhagen's answer to red carpet." },
      { level: "save", category: "Gown", brand: "Mango", name: "Sequin Strappy Dress", price: 180, note: "Nobody will know. Promise." },
    ],
  },
  "look-5": {
    editorsNote:
      "Earth tones cut on the bias. Travel dressing that suggests you've already been somewhere interesting and you're going somewhere better.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A canvas tote — Loewe basket if you can, Madewell if you can't." },
      { type: "avoid", label: "Skip", tip: "Anything that crinkles in a bag. Pack in tissue paper, always." },
      { type: "best", label: "Best for", tip: "Lisbon, Mexico City, and the kind of weekend trip that needs three outfits." },
    ],
    colorStory: [
      { hex: "#A8B5A0", name: "Sage" },
      { hex: "#C5A572", name: "Camel" },
      { hex: "#8A8A8A", name: "Stone" },
      { hex: "#FAF9F6", name: "Bone" },
      { hex: "#6B4C3B", name: "Saddle" },
    ],
    dupes: [
      { level: "splurge", category: "Tote", brand: "Loewe", name: "Anagram Basket Bag", price: 750, note: "It is the bag." },
      { level: "mid", category: "Tote", brand: "Dragon Diffusion", name: "Santa Croce", price: 340, note: "Italian-woven, half the price." },
      { level: "save", category: "Tote", brand: "Sensi Studio", name: "Classic Tote", price: 95, note: "Genuinely indistinguishable from far away." },
    ],
  },
  "look-6": {
    editorsNote:
      "Black is not a color, it's a posture. This look knows the difference between mourning black and main-character black.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One textural shift — leather, wool, satin. Three textures = one outfit." },
      { type: "avoid", label: "Skip", tip: "Any black that's gone gray. Re-dye or re-home it." },
      { type: "best", label: "Best for", tip: "Anything indoors after sundown, plus any creative-industry interview." },
    ],
    colorStory: [
      { hex: "#000000", name: "True Black" },
      { hex: "#1A1A1A", name: "Soft Black" },
      { hex: "#2D2D2D", name: "Charcoal" },
      { hex: "#4A4A4A", name: "Graphite" },
      { hex: "#FAF9F6", name: "Cream" },
    ],
    dupes: [
      { level: "splurge", category: "Coat", brand: "Max Mara", name: "Manuela Camel Coat", price: 3590, note: "An heirloom." },
      { level: "mid", category: "Coat", brand: "Toteme", name: "Signature Wool Coat", price: 1090, note: "The cool girl's Max Mara." },
      { level: "save", category: "Coat", brand: "Arket", name: "Wool Blend Coat", price: 399, note: "The Scandi sleeper hit." },
    ],
  },
  "look-7": {
    editorsNote:
      "Florals — for spring — but make them post-ironic. The print is doing the talking; you're just hosting.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Solid neutral shoes. Let the print breathe." },
      { type: "avoid", label: "Skip", tip: "Mixing prints with this one. It's already a maximalist statement." },
      { type: "best", label: "Best for", tip: "Garden weddings, brunches that turn into all-day affairs." },
    ],
    colorStory: [
      { hex: "#E8D5D0", name: "Blush" },
      { hex: "#C4797A", name: "Rose" },
      { hex: "#A8B5A0", name: "Sage" },
      { hex: "#FAF9F6", name: "Cream" },
      { hex: "#C5A572", name: "Honey" },
    ],
    dupes: [
      { level: "splurge", category: "Dress", brand: "Zimmermann", name: "Floral Wrap Dress", price: 895, note: "Photographs like a dream." },
      { level: "mid", category: "Dress", brand: "DVF", name: "Iconic Wrap Dress", price: 398, note: "The original wrap. Still right." },
      { level: "save", category: "Dress", brand: "H&M", name: "Floral Midi Dress", price: 60, note: "Trust me on this one." },
    ],
  },
  "look-8": {
    editorsNote:
      "The Power Suit, retired. Long live the modern suit — softer shoulders, looser pants, sharper attitude.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A silk camisole or fine-gauge tee. Skip the button-down." },
      { type: "avoid", label: "Skip", tip: "Matching shoes to the suit. Contrast = intentional." },
      { type: "best", label: "Best for", tip: "Job interviews, work events, court appearances (yes, really)." },
    ],
    colorStory: [
      { hex: "#1A1A1A", name: "Ink" },
      { hex: "#C5A572", name: "Gold" },
      { hex: "#4A4A4A", name: "Slate" },
      { hex: "#FAF9F6", name: "Cream" },
      { hex: "#8A8A8A", name: "Stone" },
    ],
    dupes: [
      { level: "splurge", category: "Suit", brand: "Toteme", name: "Tailored Two-Piece", price: 1080, note: "The Phoebe Philo of suits." },
      { level: "mid", category: "Suit", brand: "Theory", name: "Wool Suit Set", price: 620, note: "Solid corporate-meets-cool." },
      { level: "save", category: "Suit", brand: "Mango", name: "Tailored Suit Set", price: 260, note: "Genuinely shocking value." },
    ],
  },
  "look-9": {
    editorsNote:
      "Stealth wealth, decoded. Unbranded. Unapologetic. The kind of look that whispers a six-figure salary in a perfectly hushed tone.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Nothing. The fabric is the accessory." },
      { type: "avoid", label: "Skip", tip: "Logos, period. If it has a monogram, it's not quiet luxury." },
      { type: "best", label: "Best for", tip: "Business class, family offices, dinners with people who already know." },
    ],
    colorStory: [
      { hex: "#C5A572", name: "Camel" },
      { hex: "#FAF9F6", name: "Ivory" },
      { hex: "#4A4A4A", name: "Greige" },
      { hex: "#1A1A1A", name: "Black" },
      { hex: "#8A8A8A", name: "Stone" },
    ],
    dupes: [
      { level: "splurge", category: "Cashmere", brand: "The Row", name: "Cashmere Crewneck", price: 890, note: "The actual quiet-luxury uniform." },
      { level: "mid", category: "Cashmere", brand: "Khaite", name: "Diana Cashmere", price: 580, note: "Slightly louder, still right." },
      { level: "save", category: "Cashmere", brand: "Quince", name: "Mongolian Cashmere", price: 65, note: "Yes, $65. It's actually good." },
    ],
  },
  "look-10": {
    editorsNote:
      "The Copenhagen aesthetic, finally codified: oversized shapes, tonal layering, an air of nonchalance that costs $2,400 to achieve.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Chunky boot, never delicate. Ganni, Acne, or Marsell." },
      { type: "avoid", label: "Skip", tip: "Anything fitted. The whole point is volume." },
      { type: "best", label: "Best for", tip: "Fashion week street-style, casual offices, art-museum afternoons." },
    ],
    colorStory: [
      { hex: "#8A8A8A", name: "Cement" },
      { hex: "#1A1A1A", name: "Black" },
      { hex: "#C5A572", name: "Khaki" },
      { hex: "#FAF9F6", name: "Off-White" },
      { hex: "#4A4A4A", name: "Steel" },
    ],
    dupes: [
      { level: "splurge", category: "Trousers", brand: "Ganni", name: "Double-Faced Wool", price: 495, note: "Direct from Copenhagen." },
      { level: "mid", category: "Trousers", brand: "COS", name: "Wide-Leg Wool Pants", price: 225, note: "Same Scandi DNA." },
      { level: "save", category: "Trousers", brand: "Uniqlo", name: "Wide-Leg Pleated", price: 60, note: "Inexplicable how good these are." },
    ],
  },
  "look-11": {
    editorsNote:
      "Tulle. Organza. A Victorian collar in 2025. This is what happens when you let a Simone Rocha enthusiast win the styling argument.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Pearl jewelry — Sophie Buhai if you mean it, Mejuri if you don't." },
      { type: "avoid", label: "Skip", tip: "Modern lipstick. Try a satin berry or oxblood instead." },
      { type: "best", label: "Best for", tip: "Cocktail hours, theatre nights, birthday dinners that demand presence." },
    ],
    colorStory: [
      { hex: "#E8D5D0", name: "Petal Pink" },
      { hex: "#C4797A", name: "Tea Rose" },
      { hex: "#FAF9F6", name: "Pearl" },
      { hex: "#8A8A8A", name: "Antique" },
      { hex: "#C5A572", name: "Gilt" },
    ],
    dupes: [
      { level: "splurge", category: "Skirt", brand: "Simone Rocha", name: "Tulle Midi", price: 980, note: "The reference." },
      { level: "mid", category: "Skirt", brand: "Cecilie Bahnsen", name: "Volume Skirt", price: 595, note: "Romanticism, scaled." },
      { level: "save", category: "Skirt", brand: "Loretta Caponi", name: "Tulle Tier", price: 220, note: "Surprisingly close." },
    ],
  },
  "look-12": {
    editorsNote:
      "Tokyo street precision: layering as architecture, sneakers as punctuation. Every proportion has been argued about for hours.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One technical piece — Salomon, Arc'teryx, or vintage gore-tex." },
      { type: "avoid", label: "Skip", tip: "Logos shouting at each other. Pick one brand statement." },
      { type: "best", label: "Best for", tip: "Travel, gallery hops, festivals, photography days." },
    ],
    colorStory: [
      { hex: "#2D2D2D", name: "Tar" },
      { hex: "#B8A9C9", name: "Lavender" },
      { hex: "#C5A572", name: "Tan" },
      { hex: "#1A1A1A", name: "Pitch" },
      { hex: "#FAF9F6", name: "Bone" },
    ],
    dupes: [
      { level: "splurge", category: "Sneaker", brand: "Sacai x Nike", name: "LD Waffle", price: 650, note: "If you can find a pair." },
      { level: "mid", category: "Sneaker", brand: "New Balance", name: "990v6", price: 205, note: "The dad-shoe winner." },
      { level: "save", category: "Sneaker", brand: "Asics", name: "Gel-Kayano 14", price: 160, note: "Trust the runners." },
    ],
  },
  "look-13": {
    editorsNote:
      "Main character energy at full volume. The dress is the event; you're just hosting it.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Sleek hair. Anything textured will fight the gown." },
      { type: "avoid", label: "Skip", tip: "More than two metals. Choose your finish: gold or silver." },
      { type: "best", label: "Best for", tip: "Premieres, fundraisers, the kind of birthday that demands a photographer." },
    ],
    colorStory: [
      { hex: "#C5A572", name: "Liquid Gold" },
      { hex: "#C4797A", name: "Burgundy" },
      { hex: "#1A1A1A", name: "Onyx" },
      { hex: "#FAF9F6", name: "Pearl" },
      { hex: "#2D2D2D", name: "Smoke" },
    ],
    dupes: [
      { level: "splurge", category: "Gown", brand: "Saint Laurent", name: "Draped Jersey", price: 2890, note: "Worth every cent if you'll wear it five times." },
      { level: "mid", category: "Gown", brand: "Solace London", name: "Draped Maxi", price: 595, note: "Looks identical from afar." },
      { level: "save", category: "Gown", brand: "Lulus", name: "Liquid Satin Gown", price: 110, note: "The Lulus secret. Genuinely good." },
    ],
  },
  "look-14": {
    editorsNote:
      "Coastal Grandmother, decoded by someone who has actually been to Nantucket. Linen, cashmere, and an unbothered expression.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Worn-in espadrilles — Castañer if real, anything if not." },
      { type: "avoid", label: "Skip", tip: "Sharp jewelry. Soft, organic shapes only." },
      { type: "best", label: "Best for", tip: "Beach houses, market mornings, late-summer dinners." },
    ],
    colorStory: [
      { hex: "#FAF9F6", name: "Linen White" },
      { hex: "#A8B5A0", name: "Sea Glass" },
      { hex: "#C5A572", name: "Sand" },
      { hex: "#8A8A8A", name: "Driftwood" },
      { hex: "#E8D5D0", name: "Shell" },
    ],
    dupes: [
      { level: "splurge", category: "Linen Set", brand: "Khaite", name: "Linen Two-Piece", price: 1290, note: "The Diane Keaton remake." },
      { level: "mid", category: "Linen Set", brand: "Jenni Kayne", name: "Linen Set", price: 425, note: "The OG coastal grandmother brand." },
      { level: "save", category: "Linen Set", brand: "Quince", name: "European Linen", price: 130, note: "Genuinely impressive at the price." },
    ],
  },
  "look-15": {
    editorsNote:
      "Office Siren, official. Pencil skirt, sheer top, intentional eyeliner. The girlboss is dead — long live the femme fatale executive.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A red lip. Always a red lip with this." },
      { type: "avoid", label: "Skip", tip: "Cardigans. The whole look is about the line of the body." },
      { type: "best", label: "Best for", tip: "Power lunches, board meetings, drinks after work that turn into something." },
    ],
    colorStory: [
      { hex: "#1A1A1A", name: "Black" },
      { hex: "#C4797A", name: "Lipstick Red" },
      { hex: "#C5A572", name: "Brass" },
      { hex: "#FAF9F6", name: "Bone" },
      { hex: "#2D2D2D", name: "Smoke" },
    ],
    dupes: [
      { level: "splurge", category: "Pencil Skirt", brand: "Mugler", name: "Tailored Pencil Skirt", price: 990, note: "The reference." },
      { level: "mid", category: "Pencil Skirt", brand: "Max Mara", name: "Wool Pencil", price: 495, note: "Boardroom-perfect." },
      { level: "save", category: "Pencil Skirt", brand: "Banana Republic", name: "Sloan Pencil", price: 110, note: "The OG that still slaps." },
    ],
  },
  "look-16": {
    editorsNote:
      "Festival dressing, evolved. Forget flower crowns — modern festival wear is texture, vintage, and one weird statement piece.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A vintage belt. Etsy or your grandmother's closet, equally valid." },
      { type: "avoid", label: "Skip", tip: "Anything synthetic at noon. You will regret it." },
      { type: "best", label: "Best for", tip: "Coachella, Glastonbury, Primavera, and outdoor shows of any size." },
    ],
    colorStory: [
      { hex: "#B8A9C9", name: "Lavender Haze" },
      { hex: "#A8B5A0", name: "Sage" },
      { hex: "#C5A572", name: "Sun" },
      { hex: "#FAF9F6", name: "Cream" },
      { hex: "#C4797A", name: "Sunset" },
    ],
    dupes: [
      { level: "splurge", category: "Boots", brand: "Isabel Marant", name: "Western Boot", price: 990, note: "The ones every festival photo uses." },
      { level: "mid", category: "Boots", brand: "Ganni", name: "Western Boot", price: 525, note: "Copenhagen does cowboy." },
      { level: "save", category: "Boots", brand: "Steve Madden", name: "Western Boot", price: 150, note: "Genuinely no shame in this game." },
    ],
  },
};

// Mood-based fallback for any look not explicitly authored.
const moodFallback: Record<string, EditorialContext> = {
  minimal: {
    editorsNote: "Restraint as ideology. The opposite of trying — and twice as effective.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One element of contrast. Texture, not color." },
      { type: "avoid", label: "Skip", tip: "More than three pieces. Less is the entire point." },
      { type: "best", label: "Best for", tip: "Workdays, gallery openings, anywhere overdressing would feel rude." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  romantic: {
    editorsNote: "Soft is the new strong. There's a reason every It-girl is in tulle this season.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One piece of antique-gold jewelry." },
      { type: "avoid", label: "Skip", tip: "Anything sharp or graphic — let the silhouette breathe." },
      { type: "best", label: "Best for", tip: "Dinner dates, weddings, garden parties, cocktail hours." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  street: {
    editorsNote: "The grammar of street style: oversized vs fitted, technical vs luxurious, expensive vs found.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One unexpected detail — vintage scarf, weird sock, signature watch." },
      { type: "avoid", label: "Skip", tip: "Trying. The whole register is no-effort, real effort." },
      { type: "best", label: "Best for", tip: "Travel days, gallery hops, anywhere you'll be photographed." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  evening: {
    editorsNote: "After-dark dressing rewards conviction. Pick a register and stay in it.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Sleek hair. Always sleek hair after 7pm." },
      { type: "avoid", label: "Skip", tip: "Textured shoes. Smooth leather or satin only." },
      { type: "best", label: "Best for", tip: "Galas, premieres, fundraisers, NYE." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  classic: {
    editorsNote: "Timeless isn't an aesthetic — it's a discipline. This look will photograph well in 2045.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "One personal piece — a watch, a ring, a vintage bag." },
      { type: "avoid", label: "Skip", tip: "Trends. Buy quality once and wear it forever." },
      { type: "best", label: "Best for", tip: "Anything formal. This look earns respect." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  adventure: {
    editorsNote: "Travel-ready, photo-ready, weather-ready. The triple threat of modern dressing.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "A canvas tote that doesn't crumple in a suitcase." },
      { type: "avoid", label: "Skip", tip: "Anything precious you'd cry over losing." },
      { type: "best", label: "Best for", tip: "Long-haul flights, multi-city weekends, weekend market mornings." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
  all: {
    editorsNote: "Versatility is rare. This look earns its place in the rotation.",
    stylingTips: [
      { type: "pair", label: "Pair with", tip: "Whatever already lives in your closet." },
      { type: "avoid", label: "Skip", tip: "Overthinking it. Just wear it." },
      { type: "best", label: "Best for", tip: "Most things, honestly." },
    ],
    colorStory: NEUTRAL_PALETTE,
    dupes: [],
  },
};

export function getEditorialContext(look: Look): EditorialContext {
  return editorialByLookId[look.id] ?? moodFallback[look.mood] ?? moodFallback.all;
}

// Top trending aesthetics for the Pulse ticker.
export const trendingPulse: { label: string; delta: string; tone: "hot" | "rising" | "steady" }[] = [
  { label: "Quiet Luxury", delta: "+47%", tone: "hot" },
  { label: "Office Siren", delta: "+62%", tone: "hot" },
  { label: "Coastal Grandmother", delta: "+28%", tone: "rising" },
  { label: "Tomato Girl", delta: "+39%", tone: "rising" },
  { label: "Mob Wife", delta: "+19%", tone: "rising" },
  { label: "Eclectic Grandpa", delta: "+33%", tone: "hot" },
  { label: "Boho Revival", delta: "+24%", tone: "rising" },
  { label: "Mocha Mousse", delta: "+51%", tone: "hot" },
];

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Look, StyleDNAEntry, MoodFilter } from "../data/mockData";
import { defaultStyleDNA } from "../data/mockData";

interface SavedCollection {
  id: string;
  name: string;
  looks: Look[];
  createdAt: number;
}

interface AppState {
  // Feed state
  currentFeedIndex: number;
  setCurrentFeedIndex: (index: number) => void;
  activeMoodFilter: MoodFilter;
  setActiveMoodFilter: (mood: MoodFilter) => void;

  // Liked / passed looks
  likedLooks: Look[];
  passedLooks: Look[];
  likeLook: (look: Look) => void;
  passLook: (look: Look) => void;
  saveLook: (look: Look) => void;

  // Undo swipe
  lastSwipedLook: Look | null;
  lastSwipeAction: "like" | "pass" | null;
  undoLastSwipe: () => void;

  // Collections
  collections: SavedCollection[];
  addToCollection: (collectionId: string, look: Look) => void;
  createCollection: (name: string) => string;
  removeFromCollection: (collectionId: string, lookId: string) => void;

  // Style DNA (computed from swipe behavior)
  styleDNA: StyleDNAEntry[];
  updateStyleDNA: (dna: StyleDNAEntry[]) => void;
  computeStyleDNA: () => StyleDNAEntry[];

  // Event stylist
  selectedEvent: string | null;
  setSelectedEvent: (eventId: string | null) => void;

  // Budget preference (from onboarding)
  budgetPreference: string | null;
  setBudgetPreference: (pref: string | null) => void;

  // Capsule
  capsuleBudget: number;
  setCapsuleBudget: (budget: number) => void;
  capsuleSelectedItems: string[];
  toggleCapsuleItem: (itemId: string) => void;

  // Community
  followedCreators: string[];
  followCreator: (id: string) => void;
  unfollowCreator: (id: string) => void;

  // Swipe streak
  swipeStreak: number;
  lastSwipeDate: string | null;
  recordSwipeDay: () => void;

  // Duel mode (like/pass without advancing feed index)
  duelLikeLook: (look: Look) => void;
  duelPassLook: (look: Look) => void;
  duelMode: boolean;
  toggleDuelMode: () => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLookDetail: Look | null;
  setShowLookDetail: (look: Look | null) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const tagToStyle: Record<string, string> = {
  "Minimalist": "Minimalist",
  "Office": "Classic",
  "Romantic": "Romantic",
  "Evening": "Romantic",
  "Streetwear": "Streetwear",
  "Casual": "Streetwear",
  "Glamour": "Avant-Garde",
  "Adventure": "Classic",
  "Utility": "Classic",
  "Chic": "Minimalist",
  "Feminine": "Romantic",
  "Social": "Romantic",
  "Tailored": "Classic",
  "Power": "Classic",
  "Clean": "Minimalist",
  "Scandi": "Minimalist",
  "Quiet Luxury": "Classic",
  "Investment": "Classic",
  "Tokyo": "Avant-Garde",
  "Creative": "Avant-Garde",
  "Statement": "Avant-Garde",
  "Corporate": "Classic",
  "Siren": "Avant-Garde",
  "Coastal": "Classic",
  "Festival": "Avant-Garde",
  "Boho": "Romantic",
  "Vintage": "Romantic",
  "Sustainable": "Minimalist",
};

function computeDNA(likedLooks: Look[]): StyleDNAEntry[] {
  if (likedLooks.length === 0) return defaultStyleDNA;

  const counts: Record<string, number> = {
    "Minimalist": 0,
    "Classic": 0,
    "Romantic": 0,
    "Streetwear": 0,
    "Avant-Garde": 0,
  };

  for (const look of likedLooks) {
    for (const tag of look.tags) {
      const style = tagToStyle[tag.label];
      if (style && style in counts) {
        counts[style]++;
      }
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return defaultStyleDNA;

  const colors: Record<string, string> = {
    "Minimalist": "#1A1A1A",
    "Classic": "#C5A572",
    "Romantic": "#E8D5D0",
    "Streetwear": "#4A4A4A",
    "Avant-Garde": "#B8A9C9",
  };

  return Object.entries(counts).map(([style, count]) => ({
    style,
    percentage: Math.round((count / total) * 100),
    color: colors[style] ?? "#8A8A8A",
  }));
}

function streakUpdate(state: AppState) {
  const today = new Date().toLocaleDateString('en-CA');
  if (state.lastSwipeDate === today) return {};
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
  const streak = state.lastSwipeDate === yesterday ? state.swipeStreak + 1 : 1;
  return { swipeStreak: streak, lastSwipeDate: today };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentFeedIndex: 0,
      setCurrentFeedIndex: (index) => set({ currentFeedIndex: index }),
      activeMoodFilter: "all" as MoodFilter,
      setActiveMoodFilter: (mood) => set({ activeMoodFilter: mood, currentFeedIndex: 0, lastSwipedLook: null, lastSwipeAction: null }),

      likedLooks: [],
      passedLooks: [],
      lastSwipedLook: null,
      lastSwipeAction: null,

      likeLook: (look) =>
        set((state) => {
          const newLiked = state.likedLooks.some((l) => l.id === look.id)
            ? state.likedLooks
            : [...state.likedLooks, look];
          return {
            likedLooks: newLiked,
            currentFeedIndex: state.currentFeedIndex + 1,
            lastSwipedLook: look,
            lastSwipeAction: "like" as const,
            styleDNA: computeDNA(newLiked),
            ...streakUpdate(state),
          };
        }),
      passLook: (look) =>
        set((state) => ({
          passedLooks: state.passedLooks.some((l) => l.id === look.id)
            ? state.passedLooks
            : [...state.passedLooks, look],
          currentFeedIndex: state.currentFeedIndex + 1,
          lastSwipedLook: look,
          lastSwipeAction: "pass" as const,
          ...streakUpdate(state),
        })),
      saveLook: (look) =>
        set((state) => ({
          likedLooks: state.likedLooks.some((l) => l.id === look.id)
            ? state.likedLooks
            : [...state.likedLooks, look],
        })),

      duelLikeLook: (look) =>
        set((state) => {
          const newLiked = state.likedLooks.some((l) => l.id === look.id)
            ? state.likedLooks
            : [...state.likedLooks, look];
          return { likedLooks: newLiked, styleDNA: computeDNA(newLiked), ...streakUpdate(state) };
        }),
      duelPassLook: (look) =>
        set((state) => ({
          passedLooks: state.passedLooks.some((l) => l.id === look.id)
            ? state.passedLooks
            : [...state.passedLooks, look],
        })),

      undoLastSwipe: () =>
        set((state) => {
          if (!state.lastSwipedLook || !state.lastSwipeAction) return state;
          const newLiked = state.lastSwipeAction === "like"
            ? (() => { const idx = state.likedLooks.findLastIndex((l) => l.id === state.lastSwipedLook!.id); return idx >= 0 ? [...state.likedLooks.slice(0, idx), ...state.likedLooks.slice(idx + 1)] : state.likedLooks; })()
            : state.likedLooks;
          const newPassed = state.lastSwipeAction === "pass"
            ? (() => { const idx = state.passedLooks.findLastIndex((l) => l.id === state.lastSwipedLook!.id); return idx >= 0 ? [...state.passedLooks.slice(0, idx), ...state.passedLooks.slice(idx + 1)] : state.passedLooks; })()
            : state.passedLooks;
          return {
            likedLooks: newLiked,
            passedLooks: newPassed,
            currentFeedIndex: Math.max(0, state.currentFeedIndex - 1),
            lastSwipedLook: null,
            lastSwipeAction: null,
            styleDNA: computeDNA(newLiked),
          };
        }),

      collections: [
        { id: "favorites", name: "Favorites", looks: [], createdAt: Date.now() },
        { id: "wishlist", name: "Wishlist", looks: [], createdAt: Date.now() },
      ],
      addToCollection: (collectionId, look) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.looks.some((l) => l.id === look.id)
              ? { ...c, looks: [...c.looks, look] }
              : c
          ),
        })),
      createCollection: (name) => {
        const id = `col-${Date.now()}`;
        set((state) => ({
          collections: [
            ...state.collections,
            { id, name, looks: [], createdAt: Date.now() },
          ],
        }));
        return id;
      },
      removeFromCollection: (collectionId, lookId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, looks: c.looks.filter((l) => l.id !== lookId) }
              : c
          ),
        })),

      styleDNA: defaultStyleDNA,
      updateStyleDNA: (dna) => set({ styleDNA: dna }),
      computeStyleDNA: () => computeDNA(get().likedLooks),

      selectedEvent: null,
      setSelectedEvent: (eventId) => set({ selectedEvent: eventId }),

      budgetPreference: null,
      setBudgetPreference: (pref) => set({ budgetPreference: pref }),

      capsuleBudget: 3000,
      setCapsuleBudget: (budget) => set({ capsuleBudget: budget }),
      capsuleSelectedItems: [],
      toggleCapsuleItem: (itemId) =>
        set((state) => ({
          capsuleSelectedItems: state.capsuleSelectedItems.includes(itemId)
            ? state.capsuleSelectedItems.filter((id) => id !== itemId)
            : [...state.capsuleSelectedItems, itemId],
        })),

      followedCreators: [],
      followCreator: (id) =>
        set((state) => ({
          followedCreators: state.followedCreators.includes(id)
            ? state.followedCreators
            : [...state.followedCreators, id],
        })),
      unfollowCreator: (id) =>
        set((state) => ({
          followedCreators: state.followedCreators.filter((cid) => cid !== id),
        })),

      swipeStreak: 0,
      lastSwipeDate: null,
      recordSwipeDay: () =>
        set((state) => {
          const today = new Date().toLocaleDateString('en-CA');
          if (state.lastSwipeDate === today) return state;
          const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
          const streak = state.lastSwipeDate === yesterday ? state.swipeStreak + 1 : 1;
          return { swipeStreak: streak, lastSwipeDate: today };
        }),

      duelMode: false,
      toggleDuelMode: () => set((state) => ({ duelMode: !state.duelMode })),

      activeTab: "feed",
      setActiveTab: (tab) => set({ activeTab: tab }),
      showLookDetail: null,
      setShowLookDetail: (look) => set({ showLookDetail: look }),
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "lkbk-store",
      partialize: (state) => ({
        likedLooks: state.likedLooks,
        passedLooks: state.passedLooks,
        collections: state.collections,
        styleDNA: state.styleDNA,
        budgetPreference: state.budgetPreference,
        capsuleBudget: state.capsuleBudget,
        capsuleSelectedItems: state.capsuleSelectedItems,
        followedCreators: state.followedCreators,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        swipeStreak: state.swipeStreak,
        lastSwipeDate: state.lastSwipeDate,
      }),
    }
  )
);

/** Compute how well a Look matches a user's Style DNA (0–100). */
export function computeStyleMatch(look: Look, dna: StyleDNAEntry[]): number {
  if (dna.length === 0) return 0;
  const matchedStyles = new Set<string>();
  let score = 0;
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (!style || matchedStyles.has(style)) continue;
    matchedStyles.add(style);
    const entry = dna.find((d) => d.style === style);
    if (entry) score += entry.percentage;
  }
  return Math.min(100, score);
}

/** Return looks sorted by Style DNA relevance (highest match first). */
export function sortByStyleMatch(looks: Look[], dna: StyleDNAEntry[]): Look[] {
  if (dna.length === 0) return looks;
  return [...looks].sort((a, b) => computeStyleMatch(b, dna) - computeStyleMatch(a, dna));
}

/** Find looks similar to a given look (shared tags). */
export function findSimilarLooks(target: Look, pool: Look[], limit = 3): Look[] {
  const targetLabels = new Set(target.tags.map((t) => t.label));
  const scored = pool
    .filter((l) => l.id !== target.id)
    .map((l) => ({
      look: l,
      overlap: l.tags.filter((t) => targetLabels.has(t.label)).length,
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, limit).map((s) => s.look);
}

/** Aggregate trending pieces across all looks. */
export function getTrendingPieces(looks: Look[], likedLooks: Look[]) {
  const likedIds = new Set(likedLooks.flatMap((l) => l.items.map((i) => i.id)));
  const brandCounts: Record<string, number> = {};
  const allItems = looks.flatMap((l) => l.items);
  for (const item of allItems) {
    brandCounts[item.brand] = (brandCounts[item.brand] ?? 0) + 1;
  }
  const seen = new Set<string>();
  return allItems
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({
      ...item,
      popularityScore: (brandCounts[item.brand] ?? 0) + (likedIds.has(item.id) ? 3 : 0),
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore);
}

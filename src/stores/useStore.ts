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

export interface StyleBadge {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

const ALL_BADGES: StyleBadge[] = [
  { id: "first-love", label: "First Love", description: "Loved your first look", icon: "heart" },
  { id: "curator", label: "Curator", description: "Saved 5 looks to collections", icon: "bookmark" },
  { id: "streak-3", label: "On Fire", description: "3-day discovery streak", icon: "flame" },
  { id: "streak-7", label: "Style Devotee", description: "7-day discovery streak", icon: "sparkles" },
  { id: "ten-loves", label: "Tastemaker", description: "Loved 10 looks", icon: "award" },
  { id: "all-moods", label: "Eclectic Eye", description: "Explored every mood filter", icon: "palette" },
  { id: "capsule-builder", label: "Capsule Builder", description: "Built a capsule wardrobe", icon: "layout" },
  { id: "community-star", label: "Community Star", description: "Followed 3 creators", icon: "users" },
];

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

  // Streak & gamification
  streak: number;
  lastActiveDate: string | null;
  totalSwipes: number;
  badges: StyleBadge[];
  styleLevel: number;
  checkAndUpdateStreak: () => void;
  exploredMoods: string[];
  addExploredMood: (mood: string) => void;

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

function computeBadges(
  likedCount: number,
  collections: SavedCollection[],
  streak: number,
  followedCreators: string[],
  capsuleItems: string[],
  exploredMoods: string[],
  currentBadges: StyleBadge[] = [],
): StyleBadge[] {
  const unlocked: StyleBadge[] = [];
  const now = Date.now();
  for (const badge of ALL_BADGES) {
    let earned = false;
    switch (badge.id) {
      case "first-love": earned = likedCount >= 1; break;
      case "ten-loves": earned = likedCount >= 10; break;
      case "curator": earned = collections.reduce((sum, c) => sum + c.looks.length, 0) >= 5; break;
      case "streak-3": earned = streak >= 3; break;
      case "streak-7": earned = streak >= 7; break;
      case "all-moods": earned = exploredMoods.length >= 6; break;
      case "capsule-builder": earned = capsuleItems.length >= 5; break;
      case "community-star": earned = followedCreators.length >= 3; break;
    }
    if (earned) {
      const existing = currentBadges.find((b) => b.id === badge.id);
      unlocked.push({ ...badge, unlockedAt: existing?.unlockedAt ?? now });
    }
  }
  return unlocked;
}

export function computeStyleMatch(look: Look, styleDNA: StyleDNAEntry[]): { score: number; reasons: string[] } {
  if (styleDNA.length === 0) return { score: 75, reasons: [] };
  const dnaMap = new Map(styleDNA.map((d) => [d.style, d.percentage]));
  let matchScore = 0;
  const reasons: string[] = [];
  for (const tag of look.tags) {
    const style = tagToStyle[tag.label];
    if (style && dnaMap.has(style)) {
      matchScore += dnaMap.get(style)!;
      if (dnaMap.get(style)! >= 20) reasons.push(style);
    }
  }
  const score = Math.min(99, Math.max(60, Math.round(matchScore * 0.7 + 30)));
  return { score, reasons: [...new Set(reasons)].slice(0, 2) };
}

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
          const today = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newStreak = state.lastActiveDate === today ? state.streak : (state.lastActiveDate === yesterday ? state.streak + 1 : 1);
          const newSwipes = state.totalSwipes + 1;
          const newLevel = Math.min(10, 1 + Math.floor(newSwipes / 15));
          const badges = computeBadges(newLiked.length, state.collections, newStreak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return {
            likedLooks: newLiked,
            currentFeedIndex: state.currentFeedIndex + 1,
            lastSwipedLook: look,
            lastSwipeAction: "like" as const,
            styleDNA: computeDNA(newLiked),
            totalSwipes: newSwipes,
            styleLevel: newLevel,
            streak: newStreak,
            lastActiveDate: today,
            badges,
          };
        }),
      passLook: (look) =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newStreak = state.lastActiveDate === today ? state.streak : (state.lastActiveDate === yesterday ? state.streak + 1 : 1);
          const newSwipes = state.totalSwipes + 1;
          const newLevel = Math.min(10, 1 + Math.floor(newSwipes / 15));
          const badges = computeBadges(state.likedLooks.length, state.collections, newStreak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return {
            passedLooks: state.passedLooks.some((l) => l.id === look.id)
              ? state.passedLooks
              : [...state.passedLooks, look],
            currentFeedIndex: state.currentFeedIndex + 1,
            lastSwipedLook: look,
            lastSwipeAction: "pass" as const,
            totalSwipes: newSwipes,
            styleLevel: newLevel,
            streak: newStreak,
            lastActiveDate: today,
            badges,
          };
        }),
      saveLook: (look) =>
        set((state) => {
          const newLiked = state.likedLooks.some((l) => l.id === look.id)
            ? state.likedLooks
            : [...state.likedLooks, look];
          const badges = computeBadges(newLiked.length, state.collections, state.streak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { likedLooks: newLiked, badges };
        }),

      undoLastSwipe: () =>
        set((state) => {
          if (!state.lastSwipedLook || !state.lastSwipeAction) return state;
          const newLiked = state.lastSwipeAction === "like"
            ? (() => { const idx = state.likedLooks.findLastIndex((l) => l.id === state.lastSwipedLook!.id); return idx >= 0 ? [...state.likedLooks.slice(0, idx), ...state.likedLooks.slice(idx + 1)] : state.likedLooks; })()
            : state.likedLooks;
          const newPassed = state.lastSwipeAction === "pass"
            ? (() => { const idx = state.passedLooks.findLastIndex((l) => l.id === state.lastSwipedLook!.id); return idx >= 0 ? [...state.passedLooks.slice(0, idx), ...state.passedLooks.slice(idx + 1)] : state.passedLooks; })()
            : state.passedLooks;
          const badges = computeBadges(newLiked.length, state.collections, state.streak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return {
            likedLooks: newLiked,
            passedLooks: newPassed,
            currentFeedIndex: Math.max(0, state.currentFeedIndex - 1),
            lastSwipedLook: null,
            lastSwipeAction: null,
            styleDNA: computeDNA(newLiked),
            badges,
          };
        }),

      collections: [
        { id: "favorites", name: "Favorites", looks: [], createdAt: Date.now() },
        { id: "wishlist", name: "Wishlist", looks: [], createdAt: Date.now() },
      ],
      addToCollection: (collectionId, look) =>
        set((state) => {
          const newCollections = state.collections.map((c) =>
            c.id === collectionId && !c.looks.some((l) => l.id === look.id)
              ? { ...c, looks: [...c.looks, look] }
              : c
          );
          const badges = computeBadges(state.likedLooks.length, newCollections, state.streak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { collections: newCollections, badges };
        }),
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
        set((state) => {
          const newCollections = state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, looks: c.looks.filter((l) => l.id !== lookId) }
              : c
          );
          const badges = computeBadges(state.likedLooks.length, newCollections, state.streak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { collections: newCollections, badges };
        }),

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
        set((state) => {
          const newItems = state.capsuleSelectedItems.includes(itemId)
            ? state.capsuleSelectedItems.filter((id) => id !== itemId)
            : [...state.capsuleSelectedItems, itemId];
          const badges = computeBadges(state.likedLooks.length, state.collections, state.streak, state.followedCreators, newItems, state.exploredMoods, state.badges);
          return { capsuleSelectedItems: newItems, badges };
        }),

      followedCreators: [],
      followCreator: (id) =>
        set((state) => {
          const newFollowed = state.followedCreators.includes(id)
            ? state.followedCreators
            : [...state.followedCreators, id];
          const badges = computeBadges(state.likedLooks.length, state.collections, state.streak, newFollowed, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { followedCreators: newFollowed, badges };
        }),
      unfollowCreator: (id) =>
        set((state) => {
          const newFollowed = state.followedCreators.filter((cid) => cid !== id);
          const badges = computeBadges(state.likedLooks.length, state.collections, state.streak, newFollowed, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { followedCreators: newFollowed, badges };
        }),

      streak: 0,
      lastActiveDate: null,
      totalSwipes: 0,
      badges: [],
      styleLevel: 1,
      exploredMoods: [],
      addExploredMood: (mood) =>
        set((state) => {
          if (state.exploredMoods.includes(mood)) return state;
          const newMoods = [...state.exploredMoods, mood];
          const badges = computeBadges(state.likedLooks.length, state.collections, state.streak, state.followedCreators, state.capsuleSelectedItems, newMoods, state.badges);
          return { exploredMoods: newMoods, badges };
        }),
      checkAndUpdateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          if (state.lastActiveDate === today) return state;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
          const badges = computeBadges(state.likedLooks.length, state.collections, newStreak, state.followedCreators, state.capsuleSelectedItems, state.exploredMoods, state.badges);
          return { streak: newStreak, lastActiveDate: today, badges };
        }),

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
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        totalSwipes: state.totalSwipes,
        badges: state.badges,
        styleLevel: state.styleLevel,
        exploredMoods: state.exploredMoods,
      }),
    }
  )
);

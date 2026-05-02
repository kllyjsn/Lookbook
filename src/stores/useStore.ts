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
  feedShuffleSeed: number;
  shuffleFeed: () => void;

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

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLookDetail: Look | null;
  setShowLookDetail: (look: Look | null) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Daily streak (TikTok-style retention)
  lastVisitDate: string | null; // YYYY-MM-DD
  streakDays: number;
  longestStreak: number;
  recordVisit: () => void;

  // Community new-posts indicator
  lastViewedCommunityAt: number;
  markCommunityViewed: () => void;

  // Per-post reactions (post id -> reaction id chosen by this user)
  postReactions: Record<string, string>;
  togglePostReaction: (postId: string, reactionId: string) => void;
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
  "Classic": "Classic",
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

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentFeedIndex: 0,
      setCurrentFeedIndex: (index) => set({ currentFeedIndex: index }),
      activeMoodFilter: "all" as MoodFilter,
      setActiveMoodFilter: (mood) =>
        set({
          activeMoodFilter: mood,
          currentFeedIndex: 0,
          lastSwipedLook: null,
          lastSwipeAction: null,
          feedShuffleSeed: 0,
        }),
      feedShuffleSeed: 0,
      shuffleFeed: () =>
        set((state) => ({
          feedShuffleSeed: state.feedShuffleSeed + 1,
          currentFeedIndex: 0,
          lastSwipedLook: null,
          lastSwipeAction: null,
        })),

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
        })),
      saveLook: (look) =>
        set((state) => ({
          likedLooks: state.likedLooks.some((l) => l.id === look.id)
            ? state.likedLooks
            : [...state.likedLooks, look],
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

      activeTab: "feed",
      setActiveTab: (tab) => {
        if (tab === "community") {
          set({ activeTab: tab, lastViewedCommunityAt: Date.now() });
        } else {
          set({ activeTab: tab });
        }
      },
      showLookDetail: null,
      setShowLookDetail: (look) => set({ showLookDetail: look }),
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      lastVisitDate: null,
      streakDays: 0,
      longestStreak: 0,
      recordVisit: () =>
        set((state) => {
          // Use local-date strings so streak boundaries match the user's
          // wall-clock day, not UTC midnight.
          const toLocalDateString = (d: Date): string =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          const today = toLocalDateString(new Date());
          if (state.lastVisitDate === today) return state;
          const yesterday = toLocalDateString(new Date(Date.now() - 86400000));
          const newStreak =
            state.lastVisitDate === yesterday ? state.streakDays + 1 : 1;
          return {
            lastVisitDate: today,
            streakDays: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
          };
        }),

      lastViewedCommunityAt: 0,
      markCommunityViewed: () => set({ lastViewedCommunityAt: Date.now() }),

      postReactions: {},
      togglePostReaction: (postId, reactionId) =>
        set((state) => {
          const current = state.postReactions[postId];
          const next = { ...state.postReactions };
          if (current === reactionId) {
            delete next[postId];
          } else {
            next[postId] = reactionId;
          }
          return { postReactions: next };
        }),
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
        lastVisitDate: state.lastVisitDate,
        streakDays: state.streakDays,
        longestStreak: state.longestStreak,
        lastViewedCommunityAt: state.lastViewedCommunityAt,
        postReactions: state.postReactions,
        // feedShuffleSeed is intentionally NOT persisted: shuffle is a
        // session-scoped action, so each new session starts in the
        // curated/DNA-ranked order rather than the last shuffled order.
      }),
    }
  )
);

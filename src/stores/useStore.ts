import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Look, StyleDNAEntry, MoodFilter, LookItem } from "../data/mockData";
import { defaultStyleDNA } from "../data/mockData";
import type { Comment } from "../data/communityData";
import { initialComments, ootdEntries } from "../data/communityData";

interface SavedCollection {
  id: string;
  name: string;
  looks: Look[];
  createdAt: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayDelta(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
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

  // Comments
  comments: Comment[];
  addComment: (postId: string, text: string) => void;
  toggleCommentLike: (commentId: string) => void;
  likedCommentIds: string[];

  // OOTD challenge
  ootdVotes: Record<string, number>;
  votedOOTDIds: string[];
  voteOOTD: (entryId: string) => void;
  ootdJoined: boolean;
  joinOOTD: () => void;
  ootdSubmittedImage: string | null;
  submitOOTD: (image: string) => void;

  // Daily streak
  streakCount: number;
  longestStreak: number;
  lastOpenedDate: string | null;
  registerDailyOpen: () => void;

  // Item-level wishlist
  wishlistItemIds: string[];
  wishlistItems: LookItem[];
  toggleWishlistItem: (item: LookItem) => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLookDetail: Look | null;
  setShowLookDetail: (look: Look | null) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const tagToStyle: Record<string, string> = {
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

      comments: initialComments,
      likedCommentIds: [],
      addComment: (postId, text) =>
        set((state) => ({
          comments: [
            ...state.comments,
            {
              id: `${postId}-u-${Date.now()}`,
              postId,
              authorId: "you",
              authorName: "You",
              authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
              text,
              createdAt: "now",
              likes: 0,
            },
          ],
        })),
      toggleCommentLike: (commentId) =>
        set((state) => {
          const isLiked = state.likedCommentIds.includes(commentId);
          return {
            likedCommentIds: isLiked
              ? state.likedCommentIds.filter((id) => id !== commentId)
              : [...state.likedCommentIds, commentId],
            comments: state.comments.map((c) =>
              c.id === commentId
                ? { ...c, likes: c.likes + (isLiked ? -1 : 1) }
                : c,
            ),
          };
        }),

      ootdVotes: Object.fromEntries(ootdEntries.map((e) => [e.id, e.votes])),
      votedOOTDIds: [],
      voteOOTD: (entryId) =>
        set((state) => {
          if (state.votedOOTDIds.includes(entryId)) return state;
          return {
            votedOOTDIds: [...state.votedOOTDIds, entryId],
            ootdVotes: {
              ...state.ootdVotes,
              [entryId]: (state.ootdVotes[entryId] ?? 0) + 1,
            },
          };
        }),
      ootdJoined: false,
      joinOOTD: () => set({ ootdJoined: true }),
      ootdSubmittedImage: null,
      submitOOTD: (image) => set({ ootdSubmittedImage: image, ootdJoined: true }),

      streakCount: 0,
      longestStreak: 0,
      lastOpenedDate: null,
      registerDailyOpen: () =>
        set((state) => {
          const today = todayKey();
          if (state.lastOpenedDate === today) return state;
          let nextStreak = 1;
          if (state.lastOpenedDate) {
            const delta = dayDelta(state.lastOpenedDate, today);
            if (delta === 1) nextStreak = state.streakCount + 1;
            else if (delta === 0) nextStreak = state.streakCount;
            else nextStreak = 1;
          }
          return {
            lastOpenedDate: today,
            streakCount: nextStreak,
            longestStreak: Math.max(state.longestStreak, nextStreak),
          };
        }),

      wishlistItemIds: [],
      wishlistItems: [],
      toggleWishlistItem: (item) =>
        set((state) => {
          const has = state.wishlistItemIds.includes(item.id);
          return has
            ? {
                wishlistItemIds: state.wishlistItemIds.filter((id) => id !== item.id),
                wishlistItems: state.wishlistItems.filter((w) => w.id !== item.id),
              }
            : {
                wishlistItemIds: [...state.wishlistItemIds, item.id],
                wishlistItems: [...state.wishlistItems, item],
              };
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
        comments: state.comments,
        likedCommentIds: state.likedCommentIds,
        ootdVotes: state.ootdVotes,
        votedOOTDIds: state.votedOOTDIds,
        ootdJoined: state.ootdJoined,
        ootdSubmittedImage: state.ootdSubmittedImage,
        streakCount: state.streakCount,
        longestStreak: state.longestStreak,
        lastOpenedDate: state.lastOpenedDate,
        wishlistItemIds: state.wishlistItemIds,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
);

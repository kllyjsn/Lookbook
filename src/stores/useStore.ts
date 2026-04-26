import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Look, StyleDNAEntry } from "../data/mockData";
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
  totalSwipes: number;

  // Liked / passed looks
  likedLooks: Look[];
  passedLooks: Look[];
  likeLook: (look: Look) => void;
  passLook: (look: Look) => void;

  // Undo
  lastSwipedLook: Look | null;
  lastSwipeAction: "like" | "pass" | null;
  undoLastSwipe: () => void;

  // Tutorial
  hasSeenSwipeTutorial: boolean;
  dismissSwipeTutorial: () => void;

  // Collections
  collections: SavedCollection[];
  addToCollection: (collectionId: string, look: Look) => void;
  createCollection: (name: string) => string;
  removeFromCollection: (collectionId: string, lookId: string) => void;

  // Style DNA
  styleDNA: StyleDNAEntry[];
  updateStyleDNA: (dna: StyleDNAEntry[]) => void;

  // Event stylist
  selectedEvent: string | null;
  setSelectedEvent: (eventId: string | null) => void;

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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentFeedIndex: 0,
      setCurrentFeedIndex: (index) => set({ currentFeedIndex: index }),
      totalSwipes: 0,

      likedLooks: [],
      passedLooks: [],
      likeLook: (look) =>
        set((state) => ({
          likedLooks: [...state.likedLooks, look],
          currentFeedIndex: state.currentFeedIndex + 1,
          totalSwipes: state.totalSwipes + 1,
          lastSwipedLook: look,
          lastSwipeAction: "like" as const,
        })),
      passLook: (look) =>
        set((state) => ({
          passedLooks: [...state.passedLooks, look],
          currentFeedIndex: state.currentFeedIndex + 1,
          totalSwipes: state.totalSwipes + 1,
          lastSwipedLook: look,
          lastSwipeAction: "pass" as const,
        })),

      lastSwipedLook: null,
      lastSwipeAction: null,
      undoLastSwipe: () =>
        set((state) => {
          if (!state.lastSwipedLook || !state.lastSwipeAction) return state;
          const newState: Partial<AppState> = {
            currentFeedIndex: Math.max(0, state.currentFeedIndex - 1),
            totalSwipes: Math.max(0, state.totalSwipes - 1),
            lastSwipedLook: null,
            lastSwipeAction: null,
          };
          if (state.lastSwipeAction === "like") {
            newState.likedLooks = state.likedLooks.slice(0, -1);
          } else {
            newState.passedLooks = state.passedLooks.slice(0, -1);
          }
          return newState;
        }),

      hasSeenSwipeTutorial: false,
      dismissSwipeTutorial: () => set({ hasSeenSwipeTutorial: true }),

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

      selectedEvent: null,
      setSelectedEvent: (eventId) => set({ selectedEvent: eventId }),

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
        capsuleBudget: state.capsuleBudget,
        capsuleSelectedItems: state.capsuleSelectedItems,
        followedCreators: state.followedCreators,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasSeenSwipeTutorial: state.hasSeenSwipeTutorial,
        totalSwipes: state.totalSwipes,
      }),
    }
  )
);

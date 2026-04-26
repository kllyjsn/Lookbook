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

  // Liked / passed looks
  likedLooks: Look[];
  passedLooks: Look[];
  likeLook: (look: Look) => void;
  passLook: (look: Look) => void;

  // Engagement / dopamine
  dailyStreak: number;
  lastActiveDate: string;
  totalSwipes: number;
  totalLoves: number;
  heartBurstKey: number;
  triggerHeartBurst: () => void;
  clearHeartBurst: () => void;
  advanceFeed: () => void;
  checkStreak: () => void;

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

      likedLooks: [],
      passedLooks: [],
      likeLook: (look) =>
        set((state) => {
          if (state.likedLooks.some((l) => l.id === look.id)) return {};
          return {
            likedLooks: [...state.likedLooks, look],
            totalLoves: state.totalLoves + 1,
          };
        }),
      passLook: (look) =>
        set((state) => ({
          passedLooks: [...state.passedLooks, look],
        })),

      dailyStreak: 1,
      lastActiveDate: new Date().toDateString(),
      totalSwipes: 0,
      totalLoves: 0,
      heartBurstKey: 0,
      triggerHeartBurst: () => set((state) => ({ heartBurstKey: state.heartBurstKey + 1 })),
      clearHeartBurst: () => set({ heartBurstKey: 0 }),
      advanceFeed: () =>
        set((state) => ({
          currentFeedIndex: state.currentFeedIndex + 1,
          totalSwipes: state.totalSwipes + 1,
        })),
      checkStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const yd = new Date(); yd.setDate(yd.getDate() - 1);
          const yesterday = yd.toDateString();
          if (state.lastActiveDate === today) return {};
          if (state.lastActiveDate === yesterday) {
            return { dailyStreak: state.dailyStreak + 1, lastActiveDate: today };
          }
          return { dailyStreak: 1, lastActiveDate: today };
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
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        dailyStreak: state.dailyStreak,
        lastActiveDate: state.lastActiveDate,
        totalSwipes: state.totalSwipes,
        totalLoves: state.totalLoves,
      }),
    }
  )
);

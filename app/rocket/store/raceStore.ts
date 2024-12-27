import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RaceState } from "../types";

export const useRaceStore = create<RaceState>()(
  persist(
    (set) => ({
      activeRaceId: null,
      finishedRaces: [],
      selectedRockets: [],
      rocketProgress: {},

      setActiveRace: (raceId) => set({ activeRaceId: raceId }),

      addFinishedRace: (race) =>
        set((state) => ({
          finishedRaces: [race, ...state.finishedRaces].slice(0, 10), // Keep only last 10 races
        })),

      selectRocket: (rocketId) =>
        set((state) => {
          const currentSelected = state.selectedRockets;
          if (currentSelected.includes(rocketId)) {
            return {
              selectedRockets: currentSelected.filter((id) => id !== rocketId),
            };
          }
          if (currentSelected.length >= 2) {
            return {
              selectedRockets: [currentSelected[1], rocketId],
            };
          }
          return {
            selectedRockets: [...currentSelected, rocketId],
          };
        }),

      clearSelectedRockets: () => set({ selectedRockets: [] }),

      updateRocketProgress: (rocketId, progress) =>
        set((state) => ({
          rocketProgress: {
            ...state.rocketProgress,
            [rocketId]: progress,
          },
        })),

      clearRocketProgress: () => set({ rocketProgress: {} }),
    }),
    {
      name: "race-storage",
    }
  )
);

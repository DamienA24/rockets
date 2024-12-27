import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RaceState } from "../types/index";

// Create a broadcast channel for cross-tab communication
const channel =
  typeof window !== "undefined" ? new BroadcastChannel("race_channel") : null;

// Helper to prevent infinite loops
let isHandlingMessage = false;

export const useRaceStore = create<RaceState>()(
  persist(
    (set) => ({
      activeRaceId: null,
      finishedRaces: [],
      selectedRockets: [],
      rocketProgress: {},

      setActiveRace: (raceId: string | null) => {
        if (isHandlingMessage) return;
        set({ activeRaceId: raceId });
        channel?.postMessage({ type: "SET_ACTIVE_RACE", payload: raceId });
      },

      addFinishedRace: (race) => {
        if (isHandlingMessage) return;
        set((state) => {
          // Check if race already exists
          if (
            state.finishedRaces.some(
              (finishedRace) => finishedRace.id === race.id
            )
          ) {
            return state;
          }
          return {
            finishedRaces: [race, ...state.finishedRaces].slice(0, 10),
          };
        });
        channel?.postMessage({ type: "ADD_FINISHED_RACE", payload: race });
      },

      selectRocket: (rocketId) => {
        if (isHandlingMessage) return;
        set((state) => {
          const currentRockets = [...state.selectedRockets];

          if (currentRockets.includes(rocketId)) {
            const newRockets = currentRockets.filter((id) => id !== rocketId);
            channel?.postMessage({
              type: "SET_SELECTED_ROCKETS",
              payload: newRockets,
            });
            return { selectedRockets: newRockets };
          }

          if (currentRockets.length === 2) {
            const newRockets = [currentRockets[1], rocketId];
            channel?.postMessage({
              type: "SET_SELECTED_ROCKETS",
              payload: newRockets,
            });
            return { selectedRockets: newRockets };
          }

          const newRockets = [...currentRockets, rocketId];
          channel?.postMessage({
            type: "SET_SELECTED_ROCKETS",
            payload: newRockets,
          });
          return { selectedRockets: newRockets };
        });
      },

      clearSelectedRockets: () => {
        if (isHandlingMessage) return;
        set({ selectedRockets: [] });
        channel?.postMessage({ type: "SET_SELECTED_ROCKETS", payload: [] });
      },

      updateRocketProgress: (rocketId, progress) => {
        if (isHandlingMessage) return;
        set((state) => ({
          rocketProgress: {
            ...state.rocketProgress,
            [rocketId]: progress,
          },
        }));
        channel?.postMessage({
          type: "UPDATE_ROCKET_PROGRESS",
          payload: { rocketId, progress },
        });
      },

      clearRocketProgress: () => {
        if (isHandlingMessage) return;
        set({ rocketProgress: {} });
        channel?.postMessage({ type: "CLEAR_ROCKET_PROGRESS" });
      },
    }),
    {
      name: "race-storage",
    }
  )
);

// Set up broadcast channel listener
if (typeof window !== "undefined") {
  channel?.addEventListener("message", (event) => {
    try {
      isHandlingMessage = true;
      const { type, payload } = event.data;

      switch (type) {
        case "SET_ACTIVE_RACE":
          useRaceStore.setState({ activeRaceId: payload });
          break;

        case "ADD_FINISHED_RACE":
          useRaceStore.setState((state) => {
            if (state.finishedRaces.some((race) => race.id === payload.id)) {
              return state;
            }
            return {
              finishedRaces: [payload, ...state.finishedRaces].slice(0, 10),
            };
          });
          break;

        case "SET_SELECTED_ROCKETS":
          useRaceStore.setState({ selectedRockets: payload });
          break;

        case "UPDATE_ROCKET_PROGRESS":
          useRaceStore.setState((state) => ({
            rocketProgress: {
              ...state.rocketProgress,
              [payload.rocketId]: payload.progress,
            },
          }));
          break;

        case "CLEAR_ROCKET_PROGRESS":
          useRaceStore.setState({ rocketProgress: {} });
          break;
      }
    } finally {
      isHandlingMessage = false;
    }
  });
}

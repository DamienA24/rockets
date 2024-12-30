"use client";

import { useEffect, useCallback } from "react";
import {
  ApolloProvider,
  useQuery,
  useSubscription,
  useApolloClient,
} from "@apollo/client";
import { client } from "../lib/apollo-client";
import {
  GET_ROCKETS,
  START_RACE,
  ROCKET_PROGRESS_SUBSCRIPTION,
  GET_RACE,
} from "../graphql/queries";
import RocketCard from "../components/RocketCard";
import RaceTrack from "../components/RaceTrack";
import RaceResult from "../components/RaceResult";
import { Rocket } from "../types";
import { useRaceStore } from "../store/raceStore";
import { Button } from "@/components/ui/Button";

function RocketRace() {
  const client = useApolloClient();
  const { data: rocketsData, loading: rocketsLoading } = useQuery(GET_ROCKETS);

  const {
    activeRaceId: raceId,
    selectedRockets,
    rocketProgress,
    finishedRaces,
    setActiveRace,
    addFinishedRace,
    selectRocket,
    clearSelectedRockets,
    updateRocketProgress,
    clearRocketProgress,
  } = useRaceStore();

  const handleRocketSelect = (rocketId: string) => {
    selectRocket(rocketId);
  };

  const handleStartRace = async () => {
    if (selectedRockets.length !== 2) return;

    try {
      const result = await client.mutate({
        mutation: START_RACE,
        variables: {
          rocket1: selectedRockets[0],
          rocket2: selectedRockets[1],
        },
      });

      if (result.data?.startRace?.id) {
        setActiveRace(result.data.startRace.id);
        clearRocketProgress();
      }
    } catch (error) {
      console.error("Error starting race:", error);
    }
  };

  const checkRaceResult = useCallback(
    async (raceId: string, maxAttempts = 10) => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const result = await client.query({
            query: GET_RACE,
            variables: { id: raceId },
            fetchPolicy: "network-only",
          });

          if (result.data?.race) {
            return result.data.race;
          }
        } catch (error) {
          console.error("Error fetching race:", error);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      return null;
    },
    [client]
  );

  // Subscribe to progress updates for both rockets
  useSubscription(ROCKET_PROGRESS_SUBSCRIPTION, {
    variables: {
      raceId,
      rocketId: selectedRockets[0],
    },
    skip: !raceId || !selectedRockets[0],
    onData: ({ data }) => {
      if (data.data?.rocketProgress) {
        const { rocketId, progress, exploded } = data.data.rocketProgress;
        updateRocketProgress(rocketId, { progress, exploded });
      }
    },
  });

  useSubscription(ROCKET_PROGRESS_SUBSCRIPTION, {
    variables: {
      raceId,
      rocketId: selectedRockets[1],
    },
    skip: !raceId || !selectedRockets[1],
    onData: ({ data }) => {
      if (data.data?.rocketProgress) {
        const { rocketId, progress, exploded } = data.data.rocketProgress;
        updateRocketProgress(rocketId, { progress, exploded });
      }
    },
  });

  // Check race completion
  useEffect(() => {
    if (!raceId || selectedRockets.length !== 2) return;

    const rocket1Status = rocketProgress[selectedRockets[0]];
    const rocket2Status = rocketProgress[selectedRockets[1]];

    const raceFinished =
      rocket1Status?.progress === 100 ||
      rocket2Status?.progress === 100 ||
      rocket1Status?.exploded ||
      rocket2Status?.exploded;

    if (raceFinished) {
      const timer = setTimeout(async () => {
        const race = await checkRaceResult(raceId);
        if (race) {
          addFinishedRace(race);
          setActiveRace(null);
          clearSelectedRockets();
          clearRocketProgress();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    raceId,
    selectedRockets,
    rocketProgress,
    checkRaceResult,
    addFinishedRace,
    setActiveRace,
    clearSelectedRockets,
    clearRocketProgress,
  ]);

  if (rocketsLoading) {
    return <div className="text-center">Loading rockets...</div>;
  }

  const rockets = rocketsData?.rockets || [];
  const isRaceActive = raceId !== null;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">🚀 Rocket Race</h1>

      {!isRaceActive && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {rockets.map((rocket: Rocket) => (
              <RocketCard
                key={rocket.id}
                {...rocket}
                isSelected={selectedRockets.includes(rocket.id)}
                onSelect={() => handleRocketSelect(rocket.id)}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg ${
                selectedRockets.length === 2 ? "" : "cursor-not-allowed"
              }`}
              variant={selectedRockets.length === 2 ? "default" : "secondary"}
              onClick={
                selectedRockets.length === 2 ? handleStartRace : undefined
              }
            >
              Start Race
            </Button>
          </div>
        </>
      )}

      {isRaceActive && (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
          <RaceTrack
            rocket1Progress={rocketProgress[selectedRockets[0]]?.progress || 0}
            rocket2Progress={rocketProgress[selectedRockets[1]]?.progress || 0}
            rocket1Exploded={
              rocketProgress[selectedRockets[0]]?.exploded || false
            }
            rocket2Exploded={
              rocketProgress[selectedRockets[1]]?.exploded || false
            }
            rocket1Name={
              rockets.find((r: Rocket) => r.id === selectedRockets[0])?.name ||
              ""
            }
            rocket2Name={
              rockets.find((r: Rocket) => r.id === selectedRockets[1])?.name ||
              ""
            }
          />
        </div>
      )}

      {finishedRaces.length > 0 && (
        <div className="mt-8 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Previous Races</h2>
          <div className="space-y-4">
            {finishedRaces.map((race) => (
              <RaceResult key={race.id} raceId={race.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <RocketRace />
    </ApolloProvider>
  );
}

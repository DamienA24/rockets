"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ApolloProvider,
  useQuery,
  useMutation,
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
import { Rocket, RocketProgressState } from "../types";

function RocketRace() {
  const client = useApolloClient();
  const [selectedRockets, setSelectedRockets] = useState<string[]>([]);
  const [raceId, setRaceId] = useState<string | null>(null);
  const [finishedRaces, setFinishedRaces] = useState<string[]>([]);
  const [rocketProgress, setRocketProgress] = useState<RocketProgressState>({});

  const { data: rocketsData, loading: rocketsLoading } = useQuery(GET_ROCKETS);
  const [startRace] = useMutation(START_RACE);

  const handleRocketSelect = (rocketId: string) => {
    setSelectedRockets((prev) => {
      if (prev.includes(rocketId)) {
        return prev.filter((id) => id !== rocketId);
      }
      if (prev.length < 2) {
        return [...prev, rocketId];
      }
      return [prev[1], rocketId];
    });
  };

  const handleStartRace = async () => {
    if (selectedRockets.length !== 2) return;

    try {
      const { data } = await startRace({
        variables: {
          rocket1: selectedRockets[0],
          rocket2: selectedRockets[1],
        },
      });
      setRaceId(data.startRace.id);
      setRocketProgress({
        [selectedRockets[0]]: { progress: 0, exploded: false },
        [selectedRockets[1]]: { progress: 0, exploded: false },
      });
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

  useEffect(() => {
    if (!raceId || selectedRockets.length !== 2) return;

    const subscriptions = selectedRockets.map((rocketId) =>
      client
        .subscribe({
          query: ROCKET_PROGRESS_SUBSCRIPTION,
          variables: { raceId, rocketId },
        })
        .subscribe({
          next({ data }) {
            if (data?.rocketProgress) {
              setRocketProgress((prev) => ({
                ...prev,
                [data.rocketProgress.rocketId]: {
                  progress: data.rocketProgress.progress,
                  exploded: data.rocketProgress.exploded,
                },
              }));

              if (
                data.rocketProgress.progress === 100 ||
                data.rocketProgress.exploded
              ) {
                const currentProgress: RocketProgressState = {
                  ...rocketProgress,
                  [data.rocketProgress.rocketId]: {
                    progress: data.rocketProgress.progress,
                    exploded: data.rocketProgress.exploded,
                  },
                };

                const allRocketsFinished = selectedRockets.some(
                  (rocketId) =>
                    currentProgress[rocketId]?.progress === 100 ||
                    currentProgress[rocketId]?.exploded
                );

                if (allRocketsFinished && raceId) {
                  checkRaceResult(raceId).then((race) => {
                    if (race) {
                      setFinishedRaces((prev) => {
                        if (!prev.includes(raceId)) {
                          return [raceId, ...prev].slice(0, 5);
                        }
                        return prev;
                      });
                    }
                  });
                }
              }
            }
          },
          error(err) {
            console.error("Subscription error:", err);
          },
        })
    );

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [raceId, selectedRockets, checkRaceResult, client, rocketProgress]);

  if (rocketsLoading) {
    return <div className="text-center">Loading rockets...</div>;
  }

  const rockets = rocketsData?.rockets || [];
  const isRaceActive = raceId !== null;

  console.log("finishedRaces", finishedRaces);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">🚀 Rocket Race</h1>

      {isRaceActive ? (
        <div className="space-y-8">
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
          <button
            className="mx-auto block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setRaceId(null)}
          >
            New Race
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {rockets.map((rocket: Rocket) => (
              <RocketCard
                key={rocket.id}
                {...rocket}
                isSelected={selectedRockets.includes(rocket.id)}
                onSelect={() => handleRocketSelect(rocket.id)}
              />
            ))}
          </div>
          <button
            className={`mx-auto block px-6 py-3 rounded-lg transition-colors ${
              selectedRockets.length === 2
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleStartRace}
            disabled={selectedRockets.length !== 2}
          >
            Start Race
          </button>
        </>
      )}

      {finishedRaces.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Races</h2>
          <div className="space-y-4">
            {finishedRaces.map((id) => (
              <RaceResult key={id} raceId={id} />
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

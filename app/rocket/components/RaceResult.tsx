import { useQuery } from "@apollo/client";
import { GET_RACE, GET_ROCKETS } from "../graphql/queries";
import { RaceResultProps, Rocket } from "../types";
import RocketDisplay from "./RocketDisplay";

export default function RaceResult({ raceId }: RaceResultProps) {
  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useQuery(GET_RACE, {
    variables: { id: raceId },
    fetchPolicy: "no-cache",
  });

  const {
    data: rocketsData,
    loading: rocketsLoading,
    error: rocketsError,
  } = useQuery(GET_ROCKETS);

  if (raceLoading || rocketsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (raceError || rocketsError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">
          {raceError
            ? "Erreur lors du chargement de la course"
            : "Erreur lors du chargement des fusées"}
        </div>
      </div>
    );
  }

  if (!raceData?.race) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-gray-500">Course non trouvée</div>
      </div>
    );
  }

  const { rocket1, rocket2, winner } = raceData.race;
  const rockets = rocketsData?.rockets || [];

  const getRocketInfo = (rocketId: string) => {
    const rocket = rockets.find((r: Rocket) => r.id === rocketId);
    return {
      name: rocket?.name || "Fusée inconnue",
      description: rocket?.description || "",
      image: rocket?.image || "",
    };
  };

  const rocket1Info = getRocketInfo(rocket1.id);
  const rocket2Info = getRocketInfo(rocket2.id);

  const getRaceStatus = () => {
    if (rocket1.exploded && rocket2.exploded)
      return "Les deux fusées ont explosé ! 💥";
    if (winner) {
      const winningRocket = winner === rocket1.id ? rocket1Info : rocket2Info;
      return `${winningRocket.name} remporte la course ! 🏆`;
    }
    return "Course en cours...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl text-black font-bold mb-4">
        Course #{raceId.slice(-4)}
      </h3>
      <div className="space-y-6">
        <div className="text-center font-medium text-lg mb-4">
          <span className={winner ? "text-green-500" : "text-blue-500"}>
            {getRaceStatus()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <RocketDisplay
            progress={rocket1.progress}
            exploded={rocket1.exploded}
            isWinner={winner === rocket1.id}
            rocketInfo={rocket1Info}
          />
          <RocketDisplay
            progress={rocket2.progress}
            exploded={rocket2.exploded}
            isWinner={winner === rocket2.id}
            rocketInfo={rocket2Info}
          />
        </div>
      </div>
    </div>
  );
}

export interface Rocket {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface RaceState {
  activeRaceId: string | null;
  finishedRaces: Array<{
    id: string;
    uniqueKey: string; // Add uniqueKey field
    winner: string;
    duration: number;
    rocket1: string;
    rocket2: string;
  }>;
  selectedRockets: string[];
  rocketProgress: {
    [key: string]: {
      progress: number;
      exploded: boolean;
    };
  };
  setActiveRace: (raceId: string | null) => void;
  addFinishedRace: (race: {
    id: string;
    winner: string;
    duration: number;
    rocket1: string;
    rocket2: string;
  }) => void;
  selectRocket: (rocketId: string) => void;
  clearSelectedRockets: () => void;
  updateRocketProgress: (
    rocketId: string,
    progress: { progress: number; exploded: boolean }
  ) => void;
  clearRocketProgress: () => void;
}

export interface RaceResultProps {
  raceId: string;
  uniqueKey?: string;
}

export interface Race {
  id: string;
  winner: string;
  participants: string[];
  startTime: string;
  endTime: string;
}

export interface RocketDisplayProps {
  progress: number;
  exploded: boolean;
  isWinner: boolean;
  rocketInfo: {
    name: string;
    image: string;
  };
}

export interface RocketProgressItem {
  progress: number;
  exploded: boolean;
}

export interface RocketProgressState {
  [key: string]: RocketProgressItem;
}

export interface RaceTrackProps {
  rocket1Progress: number;
  rocket2Progress: number;
  rocket1Exploded: boolean;
  rocket2Exploded: boolean;
  rocket1Name: string;
  rocket2Name: string;
}

export interface RocketCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
}

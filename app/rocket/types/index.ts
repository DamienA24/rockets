export interface Rocket {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface RocketProgressItem {
  progress: number;
  exploded: boolean;
}

export interface RocketProgressState {
  [key: string]: RocketProgressItem;
}

export interface RocketCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
}

export interface RaceTrackProps {
  rocket1Progress: number;
  rocket2Progress: number;
  rocket1Exploded: boolean;
  rocket2Exploded: boolean;
  rocket1Name: string;
  rocket2Name: string;
}

export interface RocketDisplayProps {
  progress: number;
  exploded: boolean;
  isWinner: boolean;
  rocketInfo: {
    name: string;
    image: string;
  };
  name: string;
  image: string;
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

export interface RaceState {
  activeRaceId: string | null;
  finishedRaces: Race[];
  selectedRockets: string[];
  rocketProgress: Record<string, RocketProgressItem>;
  setActiveRace: (raceId: string | null) => void;
  addFinishedRace: (race: Race) => void;
  selectRocket: (rocketId: string) => void;
  clearSelectedRockets: () => void;
  updateRocketProgress: (rocketId: string, progress: RocketProgressItem) => void;
  clearRocketProgress: () => void;
}

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
}

export interface RaceResultProps {
  raceId: string;
}

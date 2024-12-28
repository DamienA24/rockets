# 🚀 Rocket Race Application

A real-time rocket racing application built with Next.js, GraphQL, and Zustand.

## 📋 Overview

Rocket Race is an interactive web application that allows users to select two rockets and race them against each other. The race progress is tracked in real-time, and rockets have a chance of exploding during the race, adding an element of excitement and unpredictability.

## 🏗 Technical Stack

- **Frontend Framework**: Next.js 15.1.2
- **State Management**: Zustand 5.0.2
- **API Communication**: Apollo Client 3.12.4
- **Real-time Updates**: GraphQL Subscriptions via graphql-ws 5.16.0
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Package Manager**: npm

## 🔧 Core Components

### 1. Main Page (`app/page.tsx`)
- Entry point of the application
- Manages rocket selection and race initiation
- Handles real-time race updates through GraphQL subscriptions
- Displays race history
- Implements tab synchronization via Zustand store

### 2. Race Components

#### RaceTrack (`components/RaceTrack.tsx`)
- Real-time progress visualization
- Handles explosion animations
- Manages winner state
- Props:
  ```typescript
  {
    rocket1Progress: number;
    rocket2Progress: number;
    rocket1Exploded: boolean;
    rocket2Exploded: boolean;
    rocket1Name: string;
    rocket2Name: string;
  }
  ```

#### RaceResult (`components/RaceResult.tsx`)
- Displays race outcomes
- Fetches detailed race information
- Shows participant information
- Handles loading and error states
- Props:
  ```typescript
  {
    raceId: string;
    uniqueKey?: string;
  }
  ```

#### RocketCard (`components/RocketCard.tsx`)
- Individual rocket selection card
- Manages selection state
- Visual feedback for selection
- Props:
  ```typescript
  {
    id: string;
    name: string;
    description: string;
    image: string;
    isSelected: boolean;
    onSelect: () => void;
  }
  ```

#### RocketDisplay (`components/RocketDisplay.tsx`)
- Visual representation during race
- Handles progress and explosion states
- Props:
  ```typescript
  {
    progress: number;
    exploded: boolean;
    isWinner: boolean;
    rocketInfo: {
      name: string;
      image: string;
    }
  }
  ```

## 🔄 State Management Architecture

### 1. Zustand Store (`store/raceStore.ts`)

#### Store Structure
```typescript
{
  activeRaceId: string | null;
  finishedRaces: Race[];
  selectedRockets: string[];
  rocketProgress: Record<string, RocketProgressItem>;
}
```

#### Actions
- **setActiveRace**: Manages current race state
- **addFinishedRace**: Updates race history
- **selectRocket**: Handles rocket selection logic
- **clearSelectedRockets**: Resets selection state
- **updateRocketProgress**: Updates race progress
- **clearRocketProgress**: Resets progress state

### 2. Tab Synchronization

The application implements cross-tab synchronization using multiple mechanisms:

#### Zustand Persistence Layer
```typescript
import { persist } from 'zustand/middleware';

const useRaceStore = create(
  persist(
    (set) => ({
      // store implementation
    }),
    {
      name: 'race-storage',
      partialize: (state) => ({
        finishedRaces: state.finishedRaces,
        selectedRockets: state.selectedRockets,
      }),
    }
  )
);
```

#### BroadcastChannel API Integration
- Synchronizes race state across tabs
- Handles race progress updates
- Manages rocket selection conflicts

```typescript
const broadcastChannel = new BroadcastChannel('rocket-race');

broadcastChannel.onmessage = (event) => {
  switch (event.data.type) {
    case 'RACE_START':
      synchronizeRaceStart(event.data.payload);
      break;
    case 'RACE_PROGRESS':
      synchronizeRaceProgress(event.data.payload);
      break;
    case 'RACE_END':
      synchronizeRaceEnd(event.data.payload);
      break;
  }
};
```

## 📡 GraphQL Integration

### 1. Apollo Client Configuration (`lib/apollo-client.ts`)
```typescript
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: {
      // Authentication parameters if needed
    }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);
```

### 2. GraphQL Operations (`graphql/queries.ts`)

#### Queries
```graphql
query GetRockets {
  rockets {
    id
    name
    description
    image
  }
}

query GetRace($id: ID!) {
  race(id: $id) {
    id
    winner
    participants
    startTime
    endTime
  }
}
```

#### Mutations
```graphql
mutation StartRace($rocketIds: [ID!]!) {
  startRace(rocketIds: $rocketIds) {
    id
    participants
    startTime
  }
}
```

#### Subscriptions
```graphql
subscription RocketProgress($raceId: ID!) {
  rocketProgress(raceId: $raceId) {
    rocketId
    progress
    exploded
  }
}
```

## 🔄 Race Lifecycle

### 1. Race Initialization
```typescript
const handleStartRace = async () => {
  const { data } = await startRace({
    variables: { rocketIds: selectedRockets }
  });
  setActiveRace(data.startRace.id);
  subscribeToRaceProgress(data.startRace.id);
};
```

### 2. Progress Tracking
```typescript
const onProgressUpdate = (data) => {
  const { rocketId, progress, exploded } = data.rocketProgress;
  updateRocketProgress(rocketId, { progress, exploded });
  
  if (progress === 100 || exploded) {
    checkRaceCompletion();
  }
};
```

### 3. Race Completion
```typescript
const checkRaceCompletion = () => {
  const allFinished = selectedRockets.every(
    (id) => rocketProgress[id]?.progress === 100 || rocketProgress[id]?.exploded
  );
  
  if (allFinished) {
    const winner = determineWinner();
    finalizeRace(winner);
  }
};
```


## 🛠 Development

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```


### 3. Build and Deployment
```bash
# Create production build
npm run build

# Start production server
npm run start
```

## 🔍 Performance Optimization

### 1. Code Splitting
- Dynamic imports for race components
- Lazy loading for race history
- Route-based code splitting

### 2. State Management
- Selective state persistence
- Optimized re-render prevention
- Efficient cross-tab synchronization

## 🔮 Future Enhancements

### 1. Feature Additions
- Multiple race tracks
- Tournament system
- Social features
- Achievement system


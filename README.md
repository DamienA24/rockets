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

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recruitment-challenge-front
   ```

2. **Start the entire stack with Docker**
   ```bash
   docker-compose up
   ```
   This will start:
   - GraphQL server on http://localhost:4000/graphql
   - Redis server on port 6379
   - Frontend application on http://localhost:3000

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000, 4000, and 6379 are available
   - Check running containers: `docker ps`
   - 
2. **Docker Issues**
   - Clear Docker cache: `docker-compose build --no-cache`
   - Reset containers: `docker-compose down && docker-compose up`

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

## 🎨 UI Components and Features

### 1. Progress Component (`components/ui/Progress.tsx`)
- Customizable progress bar with animations
- Support for different states (normal, exploded, winner)
- Responsive design with Tailwind CSS
- Props:
  ```typescript
  {
    value: number;
    className?: string;
    indicatorClassName?: string;
  }
  ```

### 2. Enhanced Race Animations
- Bounce animation for winner rockets (🏆)
- Pulse animation for progress bars
- Explosion effects (💥) with destructive styling

### 3. Responsive Design
- Adaptive layout for different screen sizes
- Dynamic text sizing (sm/base)
- Flexible spacing with gap utilities
- Mobile-first approach

### 4. Accessibility Improvements
- High contrast color schemes
- Clear visual feedback
- Semantic HTML structure
- Screen reader friendly status messages

## 🔄 Proposed Refactoring

### 1. Component Architecture
- Extract common UI patterns into shared components:
  - `RocketProgressBar`: Reusable progress component with explosion/winner states
  - `RaceStatus`: Component for displaying race status and results
  - `RocketSelector`: Unified component for rocket selection logic
- Create HOCs for common functionality:
  - `withRaceTracking`: Handle race progress tracking
  - `withExplosionHandling`: Manage explosion states and animations
- Implement compound components pattern for RaceTrack:
  - `RaceTrack.Lane`
  - `RaceTrack.Progress`
  - `RaceTrack.Status`

### 2. State Management
- Split raceStore into domain-specific slices:
  - `rocketSelectionSlice`
  - `raceProgressSlice`
  - `raceHistorySlice`
- Implement custom hooks:
  - `useRaceProgress`: Handle progress updates and explosions
  - `useRocketSelection`: Manage rocket selection logic
  - `useCrossTabSync`: Handle tab synchronization
- Add error boundaries for better error handling
- Implement proper loading states

## 🚀 Future Improvements

### 1. Features
- Player ranking system
- Real-time multiplayer mode
- Rocket customization
- Detailed race statistics
- Memorable race replays

### 2. UX/UI
- Dark/light mode
- Page transition animations
- Enhanced loading indicators
- More informative error messages

### 4. Testing
- Unit tests for critical components
- Integration tests for main flows
- Performance testing
- Accessibility testing

### 5. Infrastructure
- Automated CI/CD
- Performance monitoring
- Centralized log management
- Automated data backup

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

### Prerequisites
- Node.js (v18 or later)
- Docker and Docker Compose
- pnpm or yarn (recommended)

### Project Structure
```
recruitment-challenge-front/
├── app/
│   └── rocket/          # Frontend Next.js application
├── graphql/             # GraphQL server
└── docker-compose.yml   # Docker configuration
```


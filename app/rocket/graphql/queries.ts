import { gql } from "@apollo/client";

export const GET_ROCKETS = gql`
  query {
    rockets {
      id
      name
      description
      image
    }
  }
`;

export const START_RACE = gql`
  mutation ($rocket1: ID!, $rocket2: ID!) {
    startRace(rocket1: $rocket1, rocket2: $rocket2) {
      id
      rocket1 {
        id
        progress
        exploded
      }
      rocket2 {
        id
        progress
        exploded
      }
      winner
    }
  }
`;

export const GET_RACE = gql`
  query ($id: ID!) {
    race(id: $id) {
      id
      rocket1 {
        id
        progress
        exploded
      }
      rocket2 {
        id
        progress
        exploded
      }
      winner
    }
  }
`;

export const ROCKET_PROGRESS_SUBSCRIPTION = gql`
  subscription ($raceId: ID!, $rocketId: ID!) {
    rocketProgress(raceId: $raceId, rocketId: $rocketId) {
      raceId
      rocketId
      progress
      exploded
    }
  }
`;

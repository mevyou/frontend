import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

// The Graph Studio endpoint
const GRAPH_ENDPOINT = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT || 'https://api.studio.thegraph.com/query/87766/mevsyou/version/latest';

const httpLink = createHttpLink({
  uri: GRAPH_ENDPOINT,
  headers: {
    ...(process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN}`,
    }),
  },
  fetch: (uri, options) => {
    console.log('GraphQL Request:', { uri, headers: options?.headers });
    return fetch(uri, options);
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Simple test query
export const GET_SIMPLE_TEST = gql`
  query GetSimpleTest {
    deletedProfiles(first: 1) {
      id
      owner
    }
  }
`;

// GraphQL Queries
export const GET_USER_INVITATIONS = gql`
  query GetUserInvitations($user: String!) {
    userInvitations(where: { user: $user }, orderBy: id, orderDirection: desc) {
      id
      betId
      user
    }
  }
`;

export const GET_ACCEPTED_INVITES = gql`
  query GetAcceptedInvites($user: String!) {
    acceptedInvites(where: { user: $user }, orderBy: id, orderDirection: desc) {
      id
      betId
      user
    }
  }
`;

export const GET_DELETED_PROFILES = gql`
  query GetDeletedProfiles($first: Int = 5) {
    deletedProfiles(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      owner
      blockNumber
      blockTimestamp
    }
  }
`;

export const GET_UPDATED_PROFILES = gql`
  query GetUpdatedProfiles($first: Int = 5) {
    updatedProfiles(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      param0
      param1_user
      param1_name
    }
  }
`;

export const GET_USER_CREATEDS = gql`
  query GetUserCreateds {
    userCreateds(orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      username
      profile_user
      profile_name
      profile_username
      profile_timestamp
      profile_createdAt
      profile_image
      profile_description
      blockTimestamp
      blockNumber
    }
  }
`;

export const GET_BET_CREATEDS = gql`
  query GetBetCreateds($first: Int = 5) {
    betCreateds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      betId
      bet_name
      bet_link
      bet_description
      bet_owner
      bet_result
      bet_status
      bet_betDuration
      bet_privateBet
      bet_createdAt
      bet_updatedAt
      bet_betType
      bet_options
      user
      requestId
    }
  }
`;

// Combined query for dashboard data
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($first: Int = 5) {
    deletedProfiles(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      owner
      blockNumber
      blockTimestamp
    }
    updatedProfiles(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      param0
      param1_user
      param1_name
    }
    userCreateds(orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      username
      profile_user
      profile_name
      profile_username
      profile_timestamp
      profile_createdAt
      profile_image
      profile_description
      blockTimestamp
      blockNumber
    }
    betCreateds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      betId
      bet_name
      bet_link
      bet_description
      bet_owner
      bet_result
      bet_status
      bet_betDuration
      bet_privateBet
      bet_createdAt
      bet_updatedAt
      bet_betType
      bet_options
      user
      requestId
    }
  }
`;

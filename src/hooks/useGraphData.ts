import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/graphql';
import {
  GET_DELETED_PROFILES,
  GET_UPDATED_PROFILES,
  GET_USER_CREATEDS,
  GET_BET_CREATEDS,
  GET_DASHBOARD_DATA
} from '@/lib/graphql';

// Types for the GraphQL responses
export interface DeletedProfile {
  id: string;
  owner: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface UpdatedProfile {
  id: string;
  param0: string;
  param1_user: string;
  param1_name: string;
}

export interface UserCreated {
  id: string;
  user: string;
  username: string;
  profile_user: string;
  profile_name: string;
  profile_username: string;
  profile_timestamp: string;
  profile_createdAt: string;
  profile_image: string;
  profile_description: string;
  blockTimestamp: string;
  blockNumber: string;
}

export interface BetCreated {
  id: string;
  bet_name: string;
  bet_link: string;
  bet_description: string;
  bet_owner: string;
  bet_result: string;
  bet_status: string;
  bet_betDuration: string;
  bet_privateBet: boolean;
  bet_createdAt: string;
  bet_updatedAt: string;
  bet_betType: string;
  bet_options: string | string[];
  user: string;
  requestId: string;
}

export interface DashboardData {
  deletedProfiles: DeletedProfile[];
  updatedProfiles: UpdatedProfile[];
  userCreateds: UserCreated[];
  betCreateds: BetCreated[];
}

// Individual hooks for each data type
export function useDeletedProfiles(first: number = 5) {
  return useQuery({
    queryKey: ['deletedProfiles', first],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_DELETED_PROFILES,
        variables: { first },
      });
      return (data as { deletedProfiles: DeletedProfile[] }).deletedProfiles;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useUpdatedProfiles(first: number = 5) {
  return useQuery({
    queryKey: ['updatedProfiles', first],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_UPDATED_PROFILES,
        variables: { first },
      });
      return (data as { updatedProfiles: UpdatedProfile[] }).updatedProfiles;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useUserCreateds() {
  return useQuery({
    queryKey: ['userCreateds'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_USER_CREATEDS,
      });
      return (data as { userCreateds: UserCreated[] }).userCreateds;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useBetCreateds(first: number = 5) {
  return useQuery({
    queryKey: ['betCreateds', first],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_BET_CREATEDS,
        variables: { first },
      });
      return (data as { betCreateds: BetCreated[] }).betCreateds;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Combined hook for dashboard data
export function useDashboardData(first: number = 5) {
  return useQuery({
    queryKey: ['dashboardData', first],
    queryFn: async () => {
      console.log('Fetching dashboard data...');
      try {
        const { data, error } = await apolloClient.query({
          query: GET_DASHBOARD_DATA,
          variables: { first },
          errorPolicy: 'all',
        });

        console.log('GraphQL Response:', { data, error });

        if (error) {
          console.error('GraphQL Errors:', error);
          throw new Error(`GraphQL Error: ${error.message}`);
        }

        return data as DashboardData;
      } catch (err) {
        console.error('Query failed:', err);
        throw err;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: (failureCount, error) => {
      console.log('Retry attempt:', failureCount, error);
      return failureCount < 3;
    },
  });
}

// Utility function to format timestamps
export function formatTimestamp(timestamp: string): string {
  return new Date(parseInt(timestamp) * 1000).toLocaleString();
}

// Utility function to format block numbers
export function formatBlockNumber(blockNumber: string): string {
  return parseInt(blockNumber).toLocaleString();
}

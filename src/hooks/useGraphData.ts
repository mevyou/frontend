import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/graphql';
import {
  GET_DELETED_PROFILES,
  GET_UPDATED_PROFILES,
  GET_USER_CREATEDS,
  GET_BET_CREATEDS,
  GET_DASHBOARD_DATA,
  GET_USER_INVITATIONS,
  GET_ACCEPTED_INVITES
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
  id: number;
  betId: number;
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

export interface UserInvitation {
  id: string;
  userType: number; // 0 = Moderator, 1 = Participant
  betId: string;
  user: string;
}

export interface AcceptedInvite {
  id: string;
  betId: string;
  user: string;
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

export function useUserInvitations(user: string) {
  return useQuery({
    queryKey: ['userInvitations', user],
    queryFn: async () => {
      if (!user) return [] as UserInvitation[];
      const { data } = await apolloClient.query({
        query: GET_USER_INVITATIONS,
        variables: { user: user.toLowerCase() },
      });
      return (data as { userInvitations: UserInvitation[] }).userInvitations;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: !!user, // Only run query if user is provided
  });
}

export function useAcceptedInvites(user: string) {
  return useQuery({
    queryKey: ['acceptedInvites', user],
    queryFn: async () => {
      if (!user) return [] as AcceptedInvite[];
      const { data } = await apolloClient.query({
        query: GET_ACCEPTED_INVITES,
        variables: { user: user.toLowerCase() },
      });
      return (data as { acceptedInvites: AcceptedInvite[] }).acceptedInvites;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: !!user, // Only run query if user is provided
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

// Invites (notifications)
export interface InviteItem {
  id: string;
  invitee: string; // user being invited
  inviter: string; // who invited
  betId: string;
  bet_name?: string;
  bet_description?: string;
  bet_options?: string;
  createdAt: string;
  status?: string;
}

/**
 * Fetch invites for a particular wallet address. Polls by default.
 * The Graph schema assumed fields: inviteCreateds with fields (id, invitee, inviter, betId, bet_name, bet_description, bet_options, blockTimestamp)
 */
export function useInvites(address?: string, pollMs: number = 15000) {
  return useQuery({
    queryKey: ['invites', (address || '').toLowerCase()],
    queryFn: async () => {
      if (!address) return [] as InviteItem[];
      const query = /* GraphQL */ `
        query Invites($invitee: String!) {
          inviteCreateds(where: { invitee: $invitee }, orderBy: blockTimestamp, orderDirection: desc, first: 50) {
            id
            invitee
            inviter
            betId
            bet_name
            bet_description
            bet_options
            blockTimestamp
          }
        }
      `;
      const { data } = await apolloClient.query({
        query: (await import('@apollo/client')).gql(query),
        variables: { invitee: address.toLowerCase() },
        fetchPolicy: 'network-only',
      });
      const items = (data as { inviteCreateds?: unknown[] })?.inviteCreateds || [];
      return items.map((it: any) => ({
        id: it.id,
        invitee: it.invitee,
        inviter: it.inviter,
        betId: it.betId,
        bet_name: it.bet_name,
        bet_description: it.bet_description,
        bet_options: it.bet_options,
        createdAt: it.blockTimestamp,
      })) as InviteItem[];
    },
    staleTime: 5000,
    refetchInterval: pollMs,
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

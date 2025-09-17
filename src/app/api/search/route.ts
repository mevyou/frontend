import { NextRequest, NextResponse } from 'next/server';
import { apolloClient } from '@/lib/graphql';
import { GET_USER_CREATEDS, GET_BET_CREATEDS } from '@/lib/graphql';
import { SearchResult, SearchSuggestion } from '@/lib/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const types = searchParams.get('types')?.split(',') as ('user' | 'bet' | 'profile')[] || ['user', 'bet', 'profile'];
  const limit = parseInt(searchParams.get('limit') || '10');

  console.log('[Search API] Request:', { query, types, limit });

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
      suggestions: [],
      total: 0,
      hasMore: false
    });
  }

  try {
    const searchQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    const suggestions: SearchSuggestion[] = [];
    const graphqlErrors: unknown[] = [];

    // Search users/profiles
    if (types.includes('user') || types.includes('profile')) {
      try {
        console.log('[Search API] Fetching users...');
        const userResult = await apolloClient.query({
          query: GET_USER_CREATEDS,
          errorPolicy: 'all',
          fetchPolicy: 'cache-first', // Use cache if available
        });

        if (userResult.error) {
          console.error('[Search API] User query error:', userResult.error);
          graphqlErrors.push(userResult.error);
        }

        const users = (userResult.data as { userCreateds?: unknown[] })?.userCreateds || [];
        console.log('[Search API] Found users:', users.length);

        users.forEach((user: unknown) => {
          const userData = user as Record<string, unknown>;
          const matchesUsername = (userData.username as string)?.toLowerCase().includes(searchQuery);
          const matchesProfileName = (userData.profile_name as string)?.toLowerCase().includes(searchQuery);
          const matchesAddress = (userData.user as string)?.toLowerCase().includes(searchQuery);
          const matchesDescription = (userData.profile_description as string)?.toLowerCase().includes(searchQuery);

          if (matchesUsername || matchesProfileName || matchesAddress || matchesDescription) {
            const result: SearchResult = {
              id: userData.id as string,
              type: 'user',
              title: (userData.profile_name as string) || (userData.username as string) || 'Unknown User',
              subtitle: (userData.username as string) !== (userData.profile_name as string) ? (userData.username as string) : undefined,
              description: userData.profile_description as string,
              image: userData.profile_image as string,
              address: userData.user as string,
              timestamp: userData.blockTimestamp as string,
              blockNumber: userData.blockNumber as string,
            };

            results.push(result);

            // Add to suggestions if it's a good match
            if (matchesUsername || matchesProfileName) {
              suggestions.push({
                id: userData.id as string,
                type: 'user',
                title: (userData.profile_name as string) || (userData.username as string),
                subtitle: (userData.username as string) !== (userData.profile_name as string) ? (userData.username as string) : undefined,
                image: userData.profile_image as string,
                address: userData.user as string,
              });
            }
          }
        });
      } catch (userError) {
        console.error('[Search API] User search error:', userError);
        graphqlErrors.push(userError);
      }
    }

    // Search bets
    if (types.includes('bet')) {
      try {
        console.log('[Search API] Fetching bets...');
        const betResult = await apolloClient.query({
          query: GET_BET_CREATEDS,
          variables: { first: 50 }, // Get more bets for search
          errorPolicy: 'all',
          fetchPolicy: 'cache-first', // Use cache if available
        });

        if (betResult.error) {
          console.error('[Search API] Bet query error:', betResult.error);
          graphqlErrors.push(betResult.error);
        }

        const bets = (betResult.data as { betCreateds?: unknown[] })?.betCreateds || [];
        console.log('[Search API] Found bets:', bets.length);

        bets.forEach((bet: unknown) => {
          const betData = bet as Record<string, unknown>;
          const matchesName = (betData.bet_name as string)?.toLowerCase().includes(searchQuery);
          const matchesDescription = (betData.bet_description as string)?.toLowerCase().includes(searchQuery);
          const matchesOwner = (betData.bet_owner as string)?.toLowerCase().includes(searchQuery);

          if (matchesName || matchesDescription || matchesOwner) {
            const result: SearchResult = {
              id: betData.id as string,
              type: 'bet',
              title: (betData.bet_name as string) || 'Untitled Bet',
              subtitle: betData.bet_owner ? `${(betData.bet_owner as string).slice(0, 6)}...${(betData.bet_owner as string).slice(-4)}` : undefined,
              description: betData.bet_description as string,
              address: betData.bet_owner as string,
              timestamp: betData.bet_createdAt as string,
              blockNumber: betData.blockNumber as string,
            };

            results.push(result);

            // Add to suggestions if it's a good match
            if (matchesName) {
              suggestions.push({
                id: betData.id as string,
                type: 'bet',
                title: betData.bet_name as string,
                subtitle: betData.bet_owner ? `${(betData.bet_owner as string).slice(0, 6)}...${(betData.bet_owner as string).slice(-4)}` : undefined,
                address: betData.bet_owner as string,
              });
            }
          }
        });
      } catch (betError) {
        console.error('[Search API] Bet search error:', betError);
        graphqlErrors.push(betError);
      }
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchQuery;
      const bExact = b.title.toLowerCase() === searchQuery;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      return a.title.toLowerCase().indexOf(searchQuery) - b.title.toLowerCase().indexOf(searchQuery);
    });

    // Limit results
    const limitedResults = results.slice(0, limit);
    const limitedSuggestions = suggestions.slice(0, 5);

    console.log('[Search API] Final results:', {
      totalResults: results.length,
      limitedResults: limitedResults.length,
      suggestions: limitedSuggestions.length,
      graphqlErrors: graphqlErrors.length
    });

    return NextResponse.json({
      results: limitedResults,
      suggestions: limitedSuggestions,
      total: results.length,
      hasMore: results.length > limit,
      debug: {
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors.map(e => (e as Error).message || String(e)) : undefined,
        searchQuery,
        types
      }
    });

  } catch (error) {
    console.error('[Search API] Search error:', error);

    // Return fallback data if GraphQL fails
    const fallbackResults: SearchResult[] = [];
    const fallbackSuggestions: SearchSuggestion[] = [];

    // Add some fallback suggestions based on query
    if (query && (query.includes('test') || query.includes('demo'))) {
      fallbackSuggestions.push({
        id: 'fallback-1',
        type: 'user',
        title: 'Test User',
        subtitle: 'Demo Profile',
        address: '0x1234567890123456789012345678901234567890'
      });
    }

    return NextResponse.json({
      results: fallbackResults,
      suggestions: fallbackSuggestions,
      total: 0,
      hasMore: false,
      error: 'Search failed - GraphQL connection issue',
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error',
        searchQuery: query,
        types,
        fallback: true
      }
    }, { status: 200 }); // Return 200 with error info instead of 500
  }
}

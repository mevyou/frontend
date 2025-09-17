import { NextRequest, NextResponse } from 'next/server';
import { apolloClient } from '@/lib/graphql';
import { GET_USER_CREATEDS, GET_BET_CREATEDS } from '@/lib/graphql';
import { SearchResult, SearchSuggestion, SearchFilters } from '@/lib/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const types = searchParams.get('types')?.split(',') as ('user' | 'bet' | 'profile')[] || ['user', 'bet', 'profile'];
  const limit = parseInt(searchParams.get('limit') || '10');

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

    // Search users/profiles
    if (types.includes('user') || types.includes('profile')) {
      const { data: userData } = await apolloClient.query({
        query: GET_USER_CREATEDS,
        errorPolicy: 'all',
      });

      const users = (userData as any)?.userCreateds || [];

      users.forEach((user: any) => {
        const matchesUsername = user.username?.toLowerCase().includes(searchQuery);
        const matchesProfileName = user.profile_name?.toLowerCase().includes(searchQuery);
        const matchesAddress = user.user?.toLowerCase().includes(searchQuery);
        const matchesDescription = user.profile_description?.toLowerCase().includes(searchQuery);

        if (matchesUsername || matchesProfileName || matchesAddress || matchesDescription) {
          const result: SearchResult = {
            id: user.id,
            type: 'user',
            title: user.profile_name || user.username || 'Unknown User',
            subtitle: user.username !== user.profile_name ? user.username : undefined,
            description: user.profile_description,
            image: user.profile_image,
            address: user.user,
            timestamp: user.blockTimestamp,
            blockNumber: user.blockNumber,
          };

          results.push(result);

          // Add to suggestions if it's a good match
          if (matchesUsername || matchesProfileName) {
            suggestions.push({
              id: user.id,
              type: 'user',
              title: user.profile_name || user.username,
              subtitle: user.username !== user.profile_name ? user.username : undefined,
              image: user.profile_image,
              address: user.user,
            });
          }
        }
      });
    }

    // Search bets
    if (types.includes('bet')) {
      const { data: betData } = await apolloClient.query({
        query: GET_BET_CREATEDS,
        variables: { first: 50 }, // Get more bets for search
        errorPolicy: 'all',
      });

      const bets = (betData as any)?.betCreateds || [];

      bets.forEach((bet: any) => {
        const matchesName = bet.bet_name?.toLowerCase().includes(searchQuery);
        const matchesDescription = bet.bet_description?.toLowerCase().includes(searchQuery);
        const matchesOwner = bet.bet_owner?.toLowerCase().includes(searchQuery);

        if (matchesName || matchesDescription || matchesOwner) {
          const result: SearchResult = {
            id: bet.id,
            type: 'bet',
            title: bet.bet_name || 'Untitled Bet',
            subtitle: bet.bet_owner ? `${bet.bet_owner.slice(0, 6)}...${bet.bet_owner.slice(-4)}` : undefined,
            description: bet.bet_description,
            address: bet.bet_owner,
            timestamp: bet.bet_createdAt,
            blockNumber: bet.blockNumber,
          };

          results.push(result);

          // Add to suggestions if it's a good match
          if (matchesName) {
            suggestions.push({
              id: bet.id,
              type: 'bet',
              title: bet.bet_name,
              subtitle: bet.bet_owner ? `${bet.bet_owner.slice(0, 6)}...${bet.bet_owner.slice(-4)}` : undefined,
              address: bet.bet_owner,
            });
          }
        }
      });
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

    return NextResponse.json({
      results: limitedResults,
      suggestions: limitedSuggestions,
      total: results.length,
      hasMore: results.length > limit
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      results: [],
      suggestions: [],
      total: 0,
      hasMore: false,
      error: 'Search failed'
    }, { status: 500 });
  }
}

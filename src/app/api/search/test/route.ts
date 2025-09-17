import { NextResponse } from 'next/server';
import { apolloClient } from '@/lib/graphql';
import { GET_SIMPLE_TEST, GET_USER_CREATEDS, GET_BET_CREATEDS } from '@/lib/graphql';

export async function GET() {
  try {
    console.log('[Search Test API] Testing GraphQL connection...');

    // Test simple query first
    const simpleTest = await apolloClient.query({
      query: GET_SIMPLE_TEST,
      errorPolicy: 'all',
    });

    console.log('[Search Test API] Simple test result:', simpleTest);

    // Test user query
    const userTest = await apolloClient.query({
      query: GET_USER_CREATEDS,
      errorPolicy: 'all',
    });

    console.log('[Search Test API] User test result:', userTest);

    // Test bet query
    const betTest = await apolloClient.query({
      query: GET_BET_CREATEDS,
      variables: { first: 5 },
      errorPolicy: 'all',
    });

    console.log('[Search Test API] Bet test result:', betTest);

    return NextResponse.json({
      success: true,
      tests: {
        simple: {
          data: simpleTest.data,
          error: simpleTest.error
        },
        users: {
          data: userTest.data,
          error: userTest.error,
          count: (userTest.data as { userCreateds?: unknown[] })?.userCreateds?.length || 0
        },
        bets: {
          data: betTest.data,
          error: betTest.error,
          count: (betTest.data as { betCreateds?: unknown[] })?.betCreateds?.length || 0
        }
      },
      environment: {
        graphEndpoint: process.env.NEXT_PUBLIC_GRAPH_ENDPOINT,
        hasAuthToken: !!process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN,
        authTokenLength: process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN?.length || 0
      }
    });

  } catch (error) {
    console.error('[Search Test API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        graphEndpoint: process.env.NEXT_PUBLIC_GRAPH_ENDPOINT,
        hasAuthToken: !!process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN,
        authTokenLength: process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN?.length || 0
      }
    }, { status: 500 });
  }
}

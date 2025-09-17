'use client';

import { useState } from 'react';
import { apolloClient } from '@/lib/graphql';
import { GET_SIMPLE_TEST, GET_DASHBOARD_DATA } from '@/lib/graphql';

export function GraphQLDebug() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSimpleQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing simple GraphQL query...');
      console.log('Environment variables:', {
        endpoint: process.env.NEXT_PUBLIC_GRAPH_ENDPOINT,
        hasToken: !!process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN,
        tokenLength: process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN?.length || 0,
      });

      const response = await apolloClient.query({
        query: GET_SIMPLE_TEST,
        errorPolicy: 'all',
      });

      console.log('Simple query response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Simple query failed:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testFullQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing full GraphQL query...');
      const response = await apolloClient.query({
        query: GET_DASHBOARD_DATA,
        variables: { first: 1 },
        errorPolicy: 'all',
      });

      console.log('Full query response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Full query failed:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT || 'https://api.studio.thegraph.com/query/87766/mevsyou/version/latest';
      const token = process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const query = `
        query TestQuery {
          deletedProfiles(first: 1) {
            id
            owner
            blockNumber
            blockTimestamp
          }
        }
      `;

      console.log('Direct fetch test:', { endpoint, headers });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log('Direct fetch response:', data);
      setResult({ directFetch: data, status: response.status });
    } catch (err: any) {
      console.error('Direct fetch failed:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">GraphQL Debug</h3>

      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={testSimpleQuery}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Simple Query'}
          </button>

          <button
            onClick={testFullQuery}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Full Query'}
          </button>
        </div>

        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct Fetch'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-red-400 font-semibold mb-2">Error:</h4>
          <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">Result:</h4>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Environment Info:</h4>
        <div className="text-gray-300 text-sm space-y-1">
          <div>Endpoint: {process.env.NEXT_PUBLIC_GRAPH_ENDPOINT || 'Not set'}</div>
          <div>Has Token: {process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN ? 'Yes' : 'No'}</div>
          <div>Token Length: {process.env.NEXT_PUBLIC_GRAPH_AUTH_TOKEN?.length || 0}</div>
        </div>
      </div>
    </div>
  );
}

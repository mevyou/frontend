export interface SearchResult {
  id: string;
  type: 'user' | 'bet' | 'profile';
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  address?: string;
  timestamp?: string;
  blockNumber?: string;
}

export interface SearchSuggestion {
  id: string;
  type: 'user' | 'bet' | 'profile';
  title: string;
  subtitle?: string;
  image?: string;
  address?: string;
}

export interface SearchFilters {
  types?: ('user' | 'bet' | 'profile')[];
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  total: number;
  hasMore: boolean;
}

// Search utility functions
export function formatSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function isAddress(query: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(query);
}

export function isUsername(query: string): boolean {
  return /^@?[a-zA-Z0-9_]+$/.test(query);
}

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900">$1</mark>');
}

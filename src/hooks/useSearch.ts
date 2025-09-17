'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchResult, SearchSuggestion } from '@/lib/search';
import { useRouter } from 'next/navigation';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setResults([]);
      setSuggestions([]);
    }
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      const data = await response.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle result selection
  const handleSelect = useCallback((result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedIndex(-1);

    // Navigate based on result type
    switch (result.type) {
      case 'user':
      case 'profile':
        if (result.address) {
          router.push(`/profile?address=${result.address}`);
        }
        break;
      case 'bet':
        if (result.id) {
          router.push(`/bet/${result.id}`);
        }
        break;
    }
  }, [router]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = results.length + suggestions.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        } else if (selectedIndex >= results.length) {
          const suggestion = suggestions[selectedIndex - results.length];
          if (suggestion) {
            handleSelect(suggestion as SearchResult);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, selectedIndex, results, suggestions, handleSelect]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return {
    query,
    setQuery: handleQueryChange,
    isOpen,
    setIsOpen,
    results,
    suggestions,
    isLoading,
    selectedIndex,
    searchRef,
    performSearch,
    handleSelect,
    handleKeyDown,
  };
}

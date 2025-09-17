'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult, SearchSuggestion, formatSearchQuery, isAddress, isUsername } from '@/lib/search';
import { formatAddress, formatTimestamp } from '@/lib/utils';
import { Users, Trophy, User, Calendar, Hash, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AppIcons } from '@/lib/assets';

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
  className?: string;
}

export function SearchSuggestions({ query, isOpen, onClose, onSelect, className = '' }: SearchSuggestionsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
            onSelect(results[selectedIndex]);
          } else if (selectedIndex >= results.length) {
            const suggestion = suggestions[selectedIndex - results.length];
            if (suggestion) {
              onSelect(suggestion as SearchResult);
            }
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, suggestions, onSelect, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  if (!isOpen || (!query || query.length < 2)) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'bet':
        return <Trophy className="h-4 w-4 text-green-500" />;
      case 'profile':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-400';
      case 'bet':
        return 'text-green-400';
      case 'profile':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 mt-1 bg-[#1A1A1E] border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${className}`}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Searching...</p>
        </div>
      ) : (
        <>
          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 mb-2 font-semibold">
                RESULTS ({results.length})
              </div>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIndex === index
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                    }`}
                  onClick={() => onSelect(result)}
                >
                  <div className="flex-shrink-0">
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white truncate">
                        {highlightText(result.title, query)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)} bg-gray-700`}>
                        {result.type.toUpperCase()}
                      </span>
                    </div>
                    {result.subtitle && (
                      <p className="text-sm text-gray-400 truncate">
                        {highlightText(result.subtitle, query)}
                      </p>
                    )}
                    {result.description && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {highlightText(result.description, query)}
                      </p>
                    )}
                    {result.address && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {formatAddress(result.address)}
                        </span>
                        {result.timestamp && (
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(result.timestamp)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && results.length < 10 && (
            <div className="p-2 border-t border-gray-700">
              <div className="text-xs text-gray-500 px-2 py-1 mb-2 font-semibold">
                SUGGESTIONS
              </div>
              {suggestions.map((suggestion, index) => {
                const suggestionIndex = results.length + index;
                return (
                  <div
                    key={suggestion.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIndex === suggestionIndex
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                      }`}
                    onClick={() => onSelect(suggestion as SearchResult)}
                  >
                    <div className="flex-shrink-0">
                      {suggestion.image ? (
                        <Image
                          src={suggestion.image}
                          alt={suggestion.title}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          {getTypeIcon(suggestion.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white truncate">
                          {highlightText(suggestion.title, query)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(suggestion.type)} bg-gray-700`}>
                          {suggestion.type.toUpperCase()}
                        </span>
                      </div>
                      {suggestion.subtitle && (
                        <p className="text-sm text-gray-400 truncate">
                          {highlightText(suggestion.subtitle, query)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {results.length === 0 && suggestions.length === 0 && !isLoading && (
            <div className="p-4 text-center text-gray-400">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for users, bets, or addresses</p>
            </div>
          )}

          {/* Search Tips */}
          {query.length >= 2 && (results.length > 0 || suggestions.length > 0) && (
            <div className="p-2 border-t border-gray-700">
              <div className="text-xs text-gray-500 px-2 py-1">
                💡 Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> to select, <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">↑↓</kbd> to navigate, <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd> to close
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

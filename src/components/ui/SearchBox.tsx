'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WeatherSearchResult } from '@/types/weather';
import { WeatherAPI } from '@/lib/weather-api';

interface SearchBoxProps {
  onLocationSelect: (location: WeatherSearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBox({ 
  onLocationSelect, 
  placeholder = "Search for a city...", 
  className 
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await WeatherAPI.searchLocations(query);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleLocationClick = (location: WeatherSearchResult) => {
    setQuery(`${location.name}, ${location.country}`);
    setIsOpen(false);
    onLocationSelect(location);
  };

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-md z-[100]', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          title="Try searching for major cities or areas. If your exact location isn't found, try a nearby major city."
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden"
            style={{ 
              position: 'absolute',
              zIndex: 999999,
              transform: 'translateZ(0)',
              isolation: 'isolate'
            }}
                      >
              {results.length > 0 ? (
                results.map((location) => (
                  <motion.button
                    key={location.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationClick(location)}
                    className="w-full px-4 py-3 text-left flex items-center space-x-3 text-white hover:bg-white/5 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <MapPin className="w-4 h-4 text-white/60 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{location.name}</div>
                      <div className="text-sm text-white/60 truncate">
                        {location.state ? `${location.state}, ${location.country}` : location.country}
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : !isLoading && (
                <div className="px-4 py-3 text-center text-white/60">
                  <div className="text-sm">No locations found for "{query}"</div>
                  <div className="text-xs mt-1 text-white/40">
                    Try searching for a nearby major city or area
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
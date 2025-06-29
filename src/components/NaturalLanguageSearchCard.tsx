// src/components/NaturalLanguageSearchCard.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface NaturalLanguageSearchCardProps {
  onSearch: (query: string) => void;
}

export const NaturalLanguageSearchCard = ({ onSearch }: NaturalLanguageSearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4">Natural Language Search</h3>
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search your data using natural language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Search
        </Button>
      </div>
    </div>
  );
};
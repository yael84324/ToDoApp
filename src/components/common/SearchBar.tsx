import React from 'react';
import { Search } from 'lucide-react';
import { getThemeClasses } from '../../lib/theme';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  themeColor: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, themeColor }) => {
  const { border } = getThemeClasses(themeColor);

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${border} focus:outline-none focus:ring-2 focus:ring-primary`}
      />
    </div>
  );
};
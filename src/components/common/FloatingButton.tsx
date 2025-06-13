import React from 'react';
import { Plus } from 'lucide-react';
import { getThemeClasses } from '../../lib/theme';

interface FloatingButtonProps {
  onClick: () => void;
  themeColor: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, themeColor }) => {
  const { bg } = getThemeClasses(themeColor);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 h-12 w-12 rounded-full ${bg} text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center`}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};
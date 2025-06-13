import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEME_COLORS } from '../../types/shared';
import { getThemeClasses } from '../../lib/theme';
import { cn } from '../../lib/utils';

interface ThemePickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ currentColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { bg } = getThemeClasses(currentColor);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(`p-2 ${bg} text-white rounded-lg hover:opacity-90 shadow-sm`)}
      >
        <Palette className="h-5 w-5" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-3 z-50 w-40">
            <div className="grid grid-cols-4 gap-2">
              {THEME_COLORS.map((color) => {
                const { bg } = getThemeClasses(color.value);
                return (
                  <button
                    key={color.value}
                    onClick={() => {
                      onColorChange(color.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      `h-8 w-8 rounded ${bg} hover:scale-110 transition-transform flex items-center justify-center`
                    )}
                    title={color.name}
                  >
                    {currentColor === color.value && <Check className="h-4 w-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
import React from 'react';
import { getThemeClasses } from '../../lib/theme';
import { CompletionStats } from '../../types/shared';

interface ProgressBarProps {
  stats: CompletionStats;
  themeColor: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats, themeColor }) => {
  const { border } = getThemeClasses(themeColor);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className={`bg-white rounded-lg p-4 border ${border} mb-4 shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <svg className="h-full w-full -rotate-90">
            <circle cx="32" cy="32" r={radius} stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke={themeColor}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {stats.percentage}%
          </span>
        </div>
        <div>
          <h3 className="font-semibold">
            {stats.total - stats.completed} tasks remaining
          </h3>
          <p className="text-sm text-gray-500">
            {stats.completed} of {stats.total} completed
          </p>
        </div>
      </div>
    </div>
  );
};
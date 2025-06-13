
export const getThemeClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; hover: string; border: string; text: string; gradient: string }> = {
    purple: {
      bg: 'bg-purple-500 hover:bg-purple-600',
      hover: 'hover:bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      gradient: 'bg-purple-500',
    },
    blue: {
      bg: 'bg-blue-500 hover:bg-blue-600',
      hover: 'hover:bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      gradient: 'bg-blue-500',
    },
    green: {
      bg: 'bg-green-500 hover:bg-green-600',
      hover: 'hover:bg-green-50',
      border: 'border-green-100',
      text: 'text-green-600',
      gradient: 'bg-green-500',
    },
    pink: {
      bg: 'bg-pink-500 hover:bg-pink-600',
      hover: 'hover:bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-600',
      gradient: 'bg-pink-500',
    },
    indigo: {
      bg: 'bg-indigo-500 hover:bg-indigo-600',
      hover: 'hover:bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-600',
      gradient: 'bg-indigo-500',
    },
    red: {
      bg: 'bg-red-500 hover:bg-red-600',
      hover: 'hover:bg-red-50',
      border: 'border-red-100',
      text: 'text-red-600',
      gradient: 'bg-red-500',
    },
    orange: {
      bg: 'bg-orange-500 hover:bg-orange-600',
      hover: 'hover:bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-600',
      gradient: 'bg-orange-500',
    },
    teal: {
      bg: 'bg-teal-500 hover:bg-teal-600',
      hover: 'hover:bg-teal-50',
      border: 'border-teal-100',
      text: 'text-teal-600',
      gradient: 'bg-teal-500',
    },
  };
  return colorMap[color] || colorMap.purple;
};

export const getGradientBg = (color: string) => {
  const gradients: Record<string, string> = {
    purple: 'from-purple-50 to-pink-50',
    blue: 'from-blue-50 to-cyan-50',
    green: 'from-green-50 to-emerald-50',
    pink: 'from-pink-50 to-rose-50',
    indigo: 'from-indigo-50 to-purple-50',
    red: 'from-red-50 to-pink-50',
    orange: 'from-orange-50 to-yellow-50',
    teal: 'from-teal-50 to-cyan-50',
  };
  return gradients[color] || gradients.purple;
};
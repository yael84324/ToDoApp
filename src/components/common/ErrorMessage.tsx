import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className={cn(`bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 flex items-center justify-between`)}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-red-100 rounded">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
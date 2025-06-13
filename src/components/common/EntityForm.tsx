import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Priority, PRIORITY_CONFIG } from '../../types/shared';
import { cn } from '../../lib/utils';
import { getThemeClasses } from '../../lib/theme';

interface EntityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority?: Priority }) => void;
  initialData?: { title: string; description: string; priority?: Priority };
  type: 'list' | 'task';
  isEditing?: boolean;
  themeColor: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = { title: '', description: '', priority: Priority.None },
  type,
  isEditing = false,
  themeColor,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [priority, setPriority] = useState<Priority>(initialData.priority || Priority.None);
  const { gradient } = getThemeClasses(themeColor);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || Priority.None);
    }
  }, [isOpen, initialData.title, initialData.description, initialData.priority]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const data = { title, description, ...(type === 'task' ? { priority } : {}) };
      onSubmit(data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit ${type}` : `New ${type}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Enter ${type} title...`}
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>
        {type === 'task' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="space-y-2">
              {Object.entries(PRIORITY_CONFIG).map(([value, { label, color }]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={priority === value}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="sr-only"
                  />
                  <span className={cn(`h-3 w-3 rounded-full ${color}`)} />
                  <span className={priority === value ? 'font-medium' : 'text-gray-600'}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={cn(`flex-1 py-2 bg-gradient-to-r ${gradient} text-white rounded hover:opacity-90`)}
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
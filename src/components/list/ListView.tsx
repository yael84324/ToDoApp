import React, { useState } from 'react';
import { TaskList, CompletionStats } from '../../types/shared';
import { ProgressBar } from '../common/ProgressBar';
import { SearchBar } from '../common/SearchBar';
import { EntityCard } from '../common/EntityCard';
import { FloatingButton } from '../common/FloatingButton';
import { EntityForm } from '../common/EntityForm';
import { ThemePicker } from '../common/ThemePicker';
import { getGradientBg } from '../../lib/theme';

interface ListViewProps {
  lists: TaskList[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onListSelect: (listId: string) => void;
  onCreateList: (title: string, description: string) => void;
  onUpdateList: (id: string, title: string, description: string) => void;
  onDeleteList: (id: string) => void;
  stats: CompletionStats;
  themeColor: string;
  onThemeColorChange: (color: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  lists,
  searchTerm,
  onSearchChange,
  onListSelect,
  onCreateList,
  onUpdateList,
  onDeleteList,
  stats,
  themeColor,
  onThemeColorChange,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | null>(null);

  const handleSubmit = ({ title, description }: { title: string; description?: string }) => {
    if (editingList) {
      onUpdateList(editingList.id, title, description || '');
      setEditingList(null);
    } else {
      onCreateList(title, description || '');
    }
    setIsFormOpen(false);
  };

  return (
    <div className={`min-h-screen ${getGradientBg(themeColor)} p-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lists</h1>
          <ThemePicker currentColor={themeColor} onColorChange={onThemeColorChange} />
        </div>
        <ProgressBar stats={stats} themeColor={themeColor} />
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} themeColor={themeColor} />
        <div className="space-y-3">
          {lists.length ? (
            lists.map((list) => (
              <EntityCard
                key={list.id}
                entity={list}
                items={('items' in list && Array.isArray((list as any).items)) ? (list as any).items : []}
                onClick={() => onListSelect(list.id)}
                onEdit={() => {
                  setEditingList(list);
                  setIsFormOpen(true);
                }}
                onDelete={() => onDeleteList(list.id)}
                themeColor={themeColor}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No lists found. Create one to start!
            </div>
          )}
        </div>
        <FloatingButton onClick={() => setIsFormOpen(true)} themeColor={themeColor} />
        <EntityForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingList(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingList ? { title: editingList.title, description: editingList.description } : { title: '', description: '' }}
          type="list"
          isEditing={!!editingList}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};
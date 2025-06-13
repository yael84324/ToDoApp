import React, { useState } from 'react';
import { ArrowLeft, Calendar, ArrowUpDown } from 'lucide-react';
import { TaskList, Priority, CompletionStats, Task } from '../../types/shared';
import { ProgressBar } from './ProgressBar';
import { SearchBar } from './SearchBar';
import { EntityCard } from './EntityCard';
import { FloatingButton } from './FloatingButton';
import { EntityForm } from './EntityForm';
import { ThemePicker } from './ThemePicker';
import { getGradientBg, getThemeClasses } from '../../lib/theme';
import { cn } from '../../lib/utils';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface EntityViewProps {
  type: 'list' | 'task';
  lists?: TaskList[];
  list?: TaskList;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSelect?: (id: string) => void;
  onBack?: () => void;
  onCreate: (data: { title: string; description: string; priority?: Priority; listId?: string }) => void;
  onUpdate: (id: string, data: { title: string; description: string; priority?: Priority }) => void;
  onReorder: (orderedIds: string[], listId?: string) => void;
  onDelete: (id: string) => void;
  onToggle?: (id: string) => void;
  stats?: CompletionStats;
  themeColor: string;
  onThemeColorChange?: (color: string) => void;
}

export const EntityView: React.FC<EntityViewProps> = ({
  type,
  lists,
  list,
  searchTerm,
  onSearchChange,
  onSelect,
  onBack,
  onCreate,
  onUpdate,
  onReorder,
  onDelete,
  onToggle,
  stats,
  themeColor,
  onThemeColorChange,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Task | TaskList | null>(null);
  const [dragMode, setDragMode] = useState(false);
  const { border, hover, text, bg } = getThemeClasses(themeColor);
  const entities = type === 'list' ? lists! : list!.tasks;
  const { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, isDragging, draggedId, targetId } =
    type === 'list'
      ? useDragAndDrop<TaskList>(entities as TaskList[], (orderedIds: string[]) => onReorder(orderedIds, list?.id))
      : useDragAndDrop<Task>(entities as Task[], (orderedIds: string[]) => onReorder(orderedIds, list?.id));

  const handleSubmit = (data: { title: string; description: string; priority?: Priority }) => {
    if (editingEntity) {
      onUpdate(editingEntity.id, data);
      setEditingEntity(null);
    } else {
      onCreate({ ...data, listId: list?.id });
    }
    setIsFormOpen(false);
  };

  const getStats = () => {
    if (type === 'list') return stats!;
    const total = list!.tasks.length;
    const completed = list!.tasks.filter((t: Task) => t.completed).length;
    return {
      total,
      completed,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    };
  };

  return (
    <div className={cn(`min-h-screen ${getGradientBg(themeColor)} p-4`)}>
      <div className="max-w-3xl mx-auto">
        {type === 'list' ? (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Lists</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDragMode(!dragMode)}
                className={cn(
                  `p-2 rounded-lg shadow-sm`,
                  dragMode ? `${bg} text-white` : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                )}
                title={dragMode ? 'Disable Reorder' : 'Enable Reorder'}
              >
                <ArrowUpDown className="h-5 w-5" />
              </button>
              <ThemePicker currentColor={themeColor} onColorChange={onThemeColorChange!} />
            </div>
          </div>
        ) : (
          <div className={cn(`bg-white rounded-lg p-4 border ${border} mb-4 shadow-sm`)}>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={onBack} className={cn(`p-2 ${hover} rounded`)}>
                <ArrowLeft className={cn(`h-5 w-5 ${text}`)} />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <h1 className="text-xl font-bold">{list!.title}</h1>
              </div>
              <button
                onClick={() => setDragMode(!dragMode)}
                className={cn(
                  `p-2 rounded-lg shadow-sm`,
                  dragMode ? `${bg} text-white` : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                )}
                title={dragMode ? 'Disable Reorder' : 'Enable Reorder'}
              >
                <ArrowUpDown className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {list!.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-right">
                <div>
                  {getStats().completed}/{getStats().total} tasks
                </div>
                <div className={cn(`font-semibold ${text}`)}>{getStats().percentage}%</div>
              </div>
            </div>
          </div>
        )}
        {type === 'list' && <ProgressBar stats={getStats()} themeColor={themeColor} />}
        {type === 'list' && (
          <SearchBar searchTerm={searchTerm!} onSearchChange={onSearchChange!} themeColor={themeColor} />
        )}
        <div className="space-y-3">
          {entities.length ? (
            entities.map((entity: TaskList | Task) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                items={entities}
                onClick={type === 'list' && !dragMode && onSelect ? () => onSelect(entity.id) : undefined}
                onEdit={() => {
                  setEditingEntity(entity);
                  setIsFormOpen(true);
                }}
                onDelete={() => onDelete(entity.id)}
                onToggle={type === 'task' && !dragMode ? () => onToggle!(entity.id) : undefined}
                themeColor={themeColor}
                draggable={dragMode}
                onDragStart={dragMode ? handleDragStart : undefined}
                onDragOver={dragMode ? handleDragOver : undefined}
                onDragEnter={dragMode ? handleDragOver : undefined} 
                onDragLeave={dragMode ? handleDragLeave : undefined}
                onDrop={dragMode ? handleDrop : undefined}
                onDragEnd={dragMode ? handleDragEnd : undefined}
                isDragging={dragMode ? isDragging : false}
                draggedId={dragMode ? draggedId : null}
                targetId={dragMode ? targetId : null}
              />
            ))
          ) : (
            <div className={cn(`text-center py-8 bg-white rounded-lg border ${border}`)}>
              <p className="text-gray-500">No {type}s yet. Add one to start!</p>
            </div>
          )}
        </div>
        <FloatingButton onClick={() => setIsFormOpen(true)} themeColor={themeColor} />
        <EntityForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEntity(null);
          }}
          onSubmit={handleSubmit}
          initialData={
            editingEntity
              ? { title: editingEntity.title, description: editingEntity.description, priority: (editingEntity as Task).priority }
              : { title: '', description: '' }
          }
          type={type}
          isEditing={!!editingEntity}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};
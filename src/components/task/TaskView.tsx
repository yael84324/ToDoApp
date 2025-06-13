import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { TaskList, Priority, Task } from '../../types/shared';
import { EntityCard } from '../common/EntityCard';
import { FloatingButton } from '../common/FloatingButton';
import { EntityForm } from '../common/EntityForm';
import { getGradientBg, getThemeClasses } from '../../lib/theme';

interface TaskViewProps {
  list: TaskList;
  onBack: () => void;
  onCreateTask: (listId: string, title: string, priority: Priority) => void;
  onUpdateTask: (taskId: string, title: string, priority: Priority) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  themeColor: string;
}

export const TaskView: React.FC<TaskViewProps> = ({
  list,
  onBack,
  onCreateTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  themeColor,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { border, hover, text } = getThemeClasses(themeColor);
  const stats = {
    completed: list.tasks.filter((t) => t.completed).length,
    total: list.tasks.length,
    percentage: list.tasks.length ? Math.round((list.tasks.filter((t) => t.completed).length / list.tasks.length) * 100) : 0,
  };

  const handleSubmit = ({ title, priority }: { title: string; priority?: Priority }) => {
    const safePriority: Priority = priority ?? ('low' as Priority);
    if (editingTask) {
      onUpdateTask(editingTask.id, title, safePriority);
      setEditingTask(null);
    } else {
      onCreateTask(list.id, title, safePriority);
    }
    setIsFormOpen(false);
  };

  return (
    <div className={`min-h-screen ${getGradientBg(themeColor)} p-4`}>
      <div className="max-w-3xl mx-auto">
        <div className={`bg-white rounded-lg p-4 border ${border} mb-4 shadow-sm`}>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className={`p-2 ${hover} rounded`}>
              <ArrowLeft className={`h-5 w-5 ${text}`} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{list.title}</h1>
              {list.description && <p className="text-sm text-gray-500">{list.description}</p>}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {list.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-right">
              <div>
                {stats.completed}/{stats.total} tasks
              </div>
              <div className={`font-semibold ${text}`}>{stats.percentage}%</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {list.tasks.length ? (
            list.tasks.map((task) => (
              <EntityCard
                key={task.id}
                entity={task}
                items={list.tasks}
                onToggle={() => onToggleTask(task.id)}
                onEdit={() => {
                  setEditingTask(task);
                  setIsFormOpen(true);
                }}
                onDelete={() => onDeleteTask(task.id)}
                themeColor={themeColor}
              />
            ))
          ) : (
            <div className={`text-center py-8 bg-white rounded-lg border ${border}`}>
              <p className="text-gray-500">No tasks yet. Add one to start!</p>
            </div>
          )}
        </div>
        <FloatingButton onClick={() => setIsFormOpen(true)} themeColor={themeColor} />
        <EntityForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmit}
          initialData={
            editingTask
              ? { title: editingTask.title, description: editingTask.description ?? '', priority: editingTask.priority }
              : { title: '', description: '' }
          }
          type="task"
          isEditing={!!editingTask}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};
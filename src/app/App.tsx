import { useState } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import { EntityView } from '../components/common/EntityView';
import { Priority } from '../types/shared';

function App() {
  const {
    lists,
    searchTerm,
    setSearchTerm,
    settings,
    isLoading,
    createList,
    updateList,
    reorderLists,
    deleteList,
    createTask,
    updateTask,
    reorderTasks,
    toggleTask,
    deleteTask,
    updateThemeColor,
    getCompletionStats,
  } = useTaskManager();

  const [view, setView] = useState<'list' | 'task'>('list');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleCreate = ({ title, description, priority, listId }: { title: string; description: string; priority?: Priority; listId?: string }) => {
    if (view === 'list') {
      createList(title, description);
    } else {
      createTask(listId!, title, description, priority || Priority.None);
    }
  };

  const handleUpdate = (id: string, { title, description, priority }: { title: string; description: string; priority?: Priority }) => {
    if (view === 'list') {
      updateList(id, title, description);
    } else {
      updateTask(id, title, description, priority || Priority.None);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedListId(id);
    setView('task'); // Ensure view changes to task
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const selectedList = lists.find((list) => list.id === selectedListId);

  const handleReorder = (orderedIds: string[], listId?: string) => {
    if (view === 'list') {
      reorderLists(orderedIds);
    } else if (view === 'task' && listId) {
      reorderTasks(orderedIds);
    }
  };

  return (
    <EntityView
      type={view}
      lists={view === 'list' ? lists : undefined}
      list={view === 'task' ? selectedList : undefined}
      searchTerm={view === 'list' ? searchTerm : undefined}
      onSearchChange={view === 'list' ? setSearchTerm : undefined}
      onSelect={view === 'list' ? handleSelect : undefined}
      onBack={view === 'task' ? () => setView('list') : undefined}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onReorder={handleReorder}
      onDelete={view === 'list' ? deleteList : deleteTask}
      onToggle={view === 'task' ? toggleTask : undefined}
      stats={view === 'list' ? getCompletionStats() : undefined}
      themeColor={settings.themeColor}
      onThemeColorChange={view === 'list' ? updateThemeColor : undefined}
    />
  );
}

export default App;
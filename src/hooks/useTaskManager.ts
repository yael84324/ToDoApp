import { useState, useEffect, useCallback } from 'react';
import { TaskList, Priority, AppSettings, CompletionStats } from '../types/shared';
import * as db from '../lib/db';

export const useTaskManager = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState<AppSettings>({ themeColor: 'purple' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await db.initDb();
        const [loadedLists, loadedSettings] = await Promise.all([db.getLists(), db.getSettings()]);
        setLists(loadedLists);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Database initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const refreshLists = useCallback(async () => {
    setLists(await db.getLists());
  }, []);

  const createList = useCallback(async (title: string, description: string) => {
    await db.createList(title, description);
    await refreshLists();
  }, [refreshLists]);

  const updateList = useCallback(async (id: string, title: string, description: string) => {
    await db.updateList(id, title, description);
    await refreshLists();
  }, [refreshLists]);

  const reorderLists = useCallback(async (orderedIds: string[]) => {
    orderedIds.forEach((id, index) => db.updateListOrder(id, index + 1));
    await refreshLists();
  }, [refreshLists]);

  const deleteList = useCallback(async (id: string) => {
    await db.deleteList(id);
    await refreshLists();
  }, [refreshLists]);

  const createTask = useCallback(async (listId: string, title: string, description: string, priority: Priority) => {
    await db.createTask(listId, title, description, priority);
    await refreshLists();
  }, [refreshLists]);

  const updateTask = useCallback(async (taskId: string, title: string, description: string, priority: Priority) => {
    await db.updateTask(taskId, title, description, priority);
    await refreshLists();
  }, [refreshLists]);

  const reorderTasks = useCallback(async (orderedIds: string[]) => {
    orderedIds.forEach((id, index) => db.updateTaskOrder(id, index + 1));
    await refreshLists();
  }, [refreshLists]);

  const toggleTask = useCallback(async (taskId: string) => {
    await db.toggleTask(taskId);
    await refreshLists();
  }, [refreshLists]);

  const deleteTask = useCallback(async (taskId: string) => {
    await db.deleteTask(taskId);
    await refreshLists();
  }, [refreshLists]);

  const updateThemeColor = useCallback(async (color: string) => {
    await db.updateSettings({ themeColor: color });
    setSettings((prev: AppSettings) => ({ ...prev, themeColor: color }));
  }, []);

  const filteredLists = lists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.tasks.some(
        (task: any) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getCompletionStats = useCallback((): CompletionStats => {
    const total = lists.reduce((sum, list) => sum + list.tasks.length, 0);
    const completed = lists.reduce((sum, list) => sum + list.tasks.filter((task: typeof list.tasks[number]) => task.completed).length, 0);
    return {
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [lists]);

  return {
    lists: filteredLists,
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
  };
};
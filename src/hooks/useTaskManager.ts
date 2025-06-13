import { useState, useEffect, useCallback } from 'react';
import { TaskList, Priority, AppSettings, CompletionStats } from '../types/shared';
import * as db from '../lib/db';

export const useTaskManager = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState<AppSettings>({ themeColor: 'purple' });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await db.initDb();
        const [loadedLists, loadedSettings] = await Promise.all([db.getLists(), db.getSettings()]);
        setLists(loadedLists);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Database initialization failed:', error);
        setErrorMessage('Failed to initialize the application. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const refreshLists = useCallback(async () => {
    try {
      setLists(await db.getLists());
    } catch (error) {
      console.error('Failed to refresh lists:', error);
      setErrorMessage('Failed to load lists. Please try again.');
    }
  }, []);

  const createList = useCallback(async (title: string, description: string) => {
    try {
      if (!title.trim()) {
        setErrorMessage('List title cannot be empty.');
        return;
      }
      await db.createList(title, description);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to create list:', error);
      setErrorMessage('Failed to create list. Please try again.');
    }
  }, [refreshLists]);

  const updateList = useCallback(async (id: string, title: string, description: string) => {
    try {
      if (!title.trim()) {
        setErrorMessage('List title cannot be empty.');
        return;
      }
      await db.updateList(id, title, description);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to update list:', error);
      setErrorMessage('Failed to update list. Please try again.');
    }
  }, [refreshLists]);

  const deleteList = useCallback(async (id: string) => {
    try {
      await db.deleteList(id);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to delete list:', error);
      setErrorMessage('Failed to delete list. Please try again.');
    }
  }, [refreshLists]);

  const createTask = useCallback(async (listId: string, title: string, description: string, priority: Priority) => {
    try {
      if (!title.trim()) {
        setErrorMessage('Task title cannot be empty.');
        return;
      }
      await db.createTask(listId, title, description, priority);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to create task:', error);
      setErrorMessage('Failed to create task. Please try again.');
    }
  }, [refreshLists]);

  const updateTask = useCallback(async (taskId: string, title: string, description: string, priority: Priority) => {
    try {
      if (!title.trim()) {
        setErrorMessage('Task title cannot be empty.');
        return;
      }
      await db.updateTask(taskId, title, description, priority);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to update task:', error);
      setErrorMessage('Failed to update task. Please try again.');
    }
  }, [refreshLists]);

  const toggleTask = useCallback(async (taskId: string) => {
    try {
      await db.toggleTask(taskId);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to toggle task:', error);
      setErrorMessage('Failed to toggle task. Please try again.');
    }
  }, [refreshLists]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await db.deleteTask(taskId);
      await refreshLists();
      clearError();
    } catch (error) {
      console.error('Failed to delete task:', error);
      setErrorMessage('Failed to delete task. Please try again.');
    }
  }, [refreshLists]);

  const updateThemeColor = useCallback(async (color: string) => {
    try {
      await db.updateSettings({ themeColor: color });
      setSettings((prev: AppSettings) => ({ ...prev, themeColor: color }));
      clearError();
    } catch (error) {
      console.error('Failed to update theme color:', error);
      setErrorMessage('Failed to update theme color. Please try again.');
    }
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
    errorMessage,
    clearError,
    createList,
    updateList,
    deleteList,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    updateThemeColor,
    getCompletionStats,
  };
};
import { renderHook, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { useTaskManager } from '../../hooks/useTaskManager';
import * as db from '../../lib/db';
import { Priority, TaskList } from '../../types/shared';
import { waitFor } from '@testing-library/react';

vi.mock('../../lib/db');

describe('useTaskManager', () => {
  const mockList: TaskList = {
    id: '1',
    title: 'Test List',
    description: 'Description',
    tasks: [],
    createdAt: new Date(),
    order: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (db.initDb as Mock).mockResolvedValue({});
    (db.getLists as Mock).mockResolvedValue([mockList]);
    (db.getSettings as Mock).mockResolvedValue({ themeColor: 'purple' });
    (db.createList as Mock).mockResolvedValue('1');
    (db.createTask as Mock).mockResolvedValue('1');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with loading state and loads data', async () => {
    const { result } = renderHook(() => useTaskManager());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.lists).toEqual([mockList]);
    expect(result.current.settings).toEqual({ themeColor: 'purple' });
  });

  it('creates a list', async () => {
    const { result } = renderHook(() => useTaskManager());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.createList('Test List', 'Description');
    });
    expect(db.createList).toHaveBeenCalledWith('Test List', 'Description');
    expect(db.getLists).toHaveBeenCalledTimes(2);
  });

  it('creates a task', async () => {
    const { result } = renderHook(() => useTaskManager());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.createTask('list1', 'Test Task', 'Task Description', Priority.Medium);
    });
    expect(db.createTask).toHaveBeenCalledWith('list1', 'Test Task', 'Task Description', Priority.Medium);
    expect(db.getLists).toHaveBeenCalledTimes(2);
  });

  it('filters lists by search term', async () => {
    const mockLists: TaskList[] = [
      {
        ...mockList,
        id: '1',
        title: 'Matching List',
        tasks: [
          {
            id: 't1',
            title: 'Matching Task',
            description: '',
            completed: false,
            priority: Priority.None,
            createdAt: new Date(),
            order: 1,
          },
        ],
      },
      {
        ...mockList,
        id: '2',
        title: 'Non-matching List',
        tasks: [],
      },
    ];
    (db.getLists as Mock).mockResolvedValue(mockLists);
    const { result } = renderHook(() => useTaskManager());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      result.current.setSearchTerm('Matching');
    });
    expect(result.current.lists).toHaveLength(2);
    expect(result.current.lists.some((list) => list.title === 'Matching List')).toBe(true);
  });
});

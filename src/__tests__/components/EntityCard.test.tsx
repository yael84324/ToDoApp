import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { EntityCard } from '../../components/common/EntityCard';
import { Priority, Task, TaskList } from '../../types/shared';

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnToggle = vi.fn();
const mockOnClick = vi.fn();

describe('EntityCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    priority: Priority.Medium,
    createdAt: new Date('2023-01-01T12:00:00Z'),
    order: 1,
  };

  const mockList: TaskList = {
    id: '1',
    title: 'Test List',
    description: 'Test List Description',
    tasks: [mockTask],
    createdAt: new Date('2023-01-01T12:00:00Z'),
    order: 1,
  };

  const mockProps = {
    entity: mockTask,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onToggle: mockOnToggle,
    onClick: mockOnClick,
    themeColor: 'purple',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task card correctly', () => {
    render(<EntityCard {...mockProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
  });

  it('renders list card correctly', () => {
    render(<EntityCard {...mockProps} entity={mockList} />);
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('Test List Description')).toBeInTheDocument();
    expect(screen.getByText(/0\s*\/\s*1\s*tasks/)).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calls onToggle when clicking the toggle button for a task', () => {
    render(<EntityCard {...mockProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('opens menu and calls onEdit when clicking edit', () => {
    render(<EntityCard {...mockProps} />);
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('opens menu and calls onDelete when clicking delete', () => {
    render(<EntityCard {...mockProps} />);
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when clicking the card', () => {
    render(<EntityCard {...mockProps} />);
    const card = screen.getByText('Test Task').closest('div')!;
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { EntityForm } from '../../components/common/EntityForm';
import { Priority } from '../../types/shared';
import userEvent from '@testing-library/user-event';

describe('EntityForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    type: 'task' as const,
    themeColor: 'purple',
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form correctly for task', () => {
    render(<EntityForm {...mockProps} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders form correctly for list', () => {
    render(<EntityForm {...mockProps} type="list" />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.queryByText('Priority')).not.toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('submits task form with correct data', async () => {
    const user = userEvent.setup();
    render(<EntityForm {...mockProps} />);
    await user.type(screen.getByLabelText('Title'), 'New Task');
    await user.type(screen.getByLabelText('Description'), 'Task Description');
    await user.click(screen.getByText('Medium Priority'));
    await user.click(screen.getByText('Create'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description',
      priority: Priority.Medium,
    });
  });

  it('submits list form with correct data', async () => {
    const user = userEvent.setup();
    render(<EntityForm {...mockProps} type="list" />);
    await user.type(screen.getByLabelText('Title'), 'New List');
    await user.type(screen.getByLabelText('Description'), 'List Description');
    await user.click(screen.getByText('Create'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New List',
      description: 'List Description',
    });
  });

  it('closes form when clicking cancel', async () => {
    const user = userEvent.setup();
    render(<EntityForm {...mockProps} />);
    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders initial data correctly when editing', () => {
    render(
      <EntityForm
        {...mockProps}
        isEditing={true}
        initialData={{
          title: 'Existing Task',
          description: 'Existing Description',
          priority: Priority.High,
        }}
      />
    );
    expect(screen.getByLabelText('Title')).toHaveValue('Existing Task');
    expect(screen.getByLabelText('Description')).toHaveValue('Existing Description');
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemePicker } from '../../components/common/ThemePicker';
import userEvent from '@testing-library/user-event';

describe('ThemePicker', () => {
  const mockOnColorChange = vi.fn();

  const baseProps = {
    currentColor: 'purple',
    onColorChange: mockOnColorChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current theme color', () => {
    render(<ThemePicker {...baseProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-purple-500');
  });

  it('opens color picker and selects a new color', async () => {
    const user = userEvent.setup();
    render(<ThemePicker {...baseProps} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByTitle('Blue'));
    expect(mockOnColorChange).toHaveBeenCalledWith('blue');
  });
});
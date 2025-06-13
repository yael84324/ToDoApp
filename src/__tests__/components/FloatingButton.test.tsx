import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FloatingButton } from '../../components/common/FloatingButton';
import userEvent from '@testing-library/user-event';

describe('FloatingButton', () => {
  const mockOnClick = vi.fn();

  const baseProps = {
    onClick: mockOnClick,
    themeColor: 'purple',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with theme color', () => {
    render(<FloatingButton {...baseProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-purple-500');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingButton {...baseProps} />);
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
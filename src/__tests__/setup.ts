import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
});

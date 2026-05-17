import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../src/hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onNavigate with "generator" when Cmd+1 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '1',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('generator');
  });

  it('calls onNavigate with "analytics" when Cmd+2 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '2',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('analytics');
  });

  it('calls onNavigate with "builder" when Cmd+3 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '3',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('builder');
  });

  it('calls onNavigate with "templates" when Cmd+4 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '4',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('templates');
  });

  it('does not call onNavigate for unregistered keys', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '9',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('does not trigger when user is typing in an input field', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '1',
          metaKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('works with Ctrl key on non-Mac platforms', () => {
    renderHook(() => useKeyboardShortcuts(mockOnNavigate));
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '1',
          ctrlKey: true,
          bubbles: true,
        })
      );
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('generator');
  });
});

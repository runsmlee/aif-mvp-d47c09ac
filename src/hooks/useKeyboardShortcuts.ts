import { useEffect, useCallback } from 'react';
import type { AppView } from '../types';

type NavigateFn = (view: AppView) => void;

/**
 * Keyboard shortcuts for developer workflow navigation.
 * Cmd/Ctrl + 1-4 maps to the four main views.
 * Does not trigger when user is typing in input/textarea/select.
 */
export function useKeyboardShortcuts(onNavigate: NavigateFn): void {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      const viewMap: Record<string, AppView> = {
        '1': 'generator',
        '2': 'analytics',
        '3': 'builder',
        '4': 'templates',
      };

      const view = viewMap[e.key];
      if (view) {
        e.preventDefault();
        onNavigate(view);
      }
    },
    [onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

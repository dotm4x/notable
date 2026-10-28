import { Button } from '@notable/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const storageKey = 'notable-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
    );
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
    setTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Dark mode"
      aria-pressed={isDark}
      onClick={toggle}
    >
      {isDark ? (
        <Moon aria-hidden="true" size={18} />
      ) : (
        <Sun aria-hidden="true" size={18} />
      )}
    </Button>
  );
}

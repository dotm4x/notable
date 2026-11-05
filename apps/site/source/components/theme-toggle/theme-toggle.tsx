'use client';

import { Button } from '@dotm4x/one/components';
import { Moon, Sun } from '@dotm4x/one/icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface ThemeToggleProps {
  size?: 'icon' | 'icon-small' | 'icon-large';
}

/** Toggles between the light and dark One themes. */
export function ThemeToggle({ size = 'icon' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const iconSize = size === 'icon-large' ? 20 : 18;

  return (
    <Button
      aria-label="Toggle color theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size={size}
      variant="ghost"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={iconSize} />
      ) : (
        <Moon aria-hidden="true" size={iconSize} />
      )}
    </Button>
  );
}

'use client';

import { Button, Header, NavigationMenu } from '@one/components';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import './header.css';
import { SiGithub } from '@icons-pack/react-simple-icons';

export function SiteHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }

  return (
    <Header className="site-header" mode="dynamic">
      <a className="site-header__brand" href="#overview">
        One
      </a>
      <div className="site-header__navigation">
        <NavigationMenu aria-label="Primary navigation">
          <NavigationMenu.List className="site-header__links">
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/">Overview</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/components">
                Catalog
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
        <div className="site-header__actions">
          <Button asChild variant="ghost" size="icon-large">
            <a
              href="https://github.com/dotm4x/one"
              target="_blank"
              rel="noreferrer"
              aria-label="One on GitHub"
            >
              <SiGithub size={20} />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon-large"
            aria-label="Toggle color theme"
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun size={20} aria-hidden="true" />
            ) : (
              <Moon size={20} aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </Header>
  );
}

'use client';

import { Button, Header, NavigationMenu } from '@dotm4x/one/components';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { ThemeToggle } from '../theme-toggle';
import './header.css';

export function SiteHeader() {
  return (
    <Header className="site-header" mode="dynamic">
      <a className="site-header__brand" href="/">
        One
      </a>
      <div className="site-header__navigation">
        <NavigationMenu aria-label="Primary navigation">
          <NavigationMenu.List className="site-header__links">
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/">Overview</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/docs/components">
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
          <ThemeToggle size="icon-large" />
        </div>
      </div>
    </Header>
  );
}

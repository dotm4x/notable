'use client';

import { Button, Header, NavigationMenu } from '@dotm4x/one/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Logo } from '../logo';
import { ThemeToggle } from '../theme-toggle';
import './header.css';

export function SiteHeader() {
  const router = useRouter();
  return (
    <Header className="site-header" mode="dynamic">
      <Link className="site-header__brand" href="/" aria-label="One">
        <Logo className="site-header__logo" />
      </Link>
      <div className="site-header__navigation">
        <NavigationMenu aria-label="Primary navigation">
          <NavigationMenu.List className="site-header__links">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  router.push('/');
                }}
              >
                Overview
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/docs/components"
                onClick={(event) => {
                  event.preventDefault();
                  router.push('/docs/components');
                }}
              >
                Components
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/docs/icons"
                onClick={(event) => {
                  event.preventDefault();
                  router.push('/docs/icons');
                }}
              >
                Icons
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/docs"
                onClick={(event) => {
                  event.preventDefault();
                  router.push('/docs');
                }}
              >
                Docs
              </NavigationMenu.Link>
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

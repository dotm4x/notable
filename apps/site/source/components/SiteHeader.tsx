import { Button, Header, NavigationMenu } from '@notable/components';
import { SiGithub } from '@icons-pack/react-simple-icons';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  return (
    <Header mode="dynamic" className="site-header">
      <div className="site-nav">
        <a className="site-brand" href="/">
          Notable
        </a>
        <NavigationMenu aria-label="Primary" className="site-nav__menu">
          <NavigationMenu.List className="site-nav__links">
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/docs/catalog">
                Catalog
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/docs/icons">
                Icons
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
        <div className="site-nav__actions">
          <Button variant="ghost" asChild>
            <a
              href="https://github.com/dotm4x/notable"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Notable on GitHub (opens in a new tab)"
            >
              <SiGithub aria-hidden="true" size={18} />
              <span>GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </Header>
  );
}

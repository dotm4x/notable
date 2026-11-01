import { Folder, Home } from 'lucide-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from './sidebar.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Sidebar', () => {
  it('toggles uncontrolled expansion and marks the active link', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Root defaultOpen={false}>
        <Sidebar.Header>
          <Sidebar.Brand icon={<Home aria-hidden="true" />}>
            Workspace
          </Sidebar.Brand>
          <Sidebar.Trigger />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.Item
                    href="/overview"
                    icon={<Home aria-hidden="true" />}
                    active
                  >
                    Overview
                  </Sidebar.Item>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Inset>
          <main>Page content</main>
        </Sidebar.Inset>
      </Sidebar.Root>,
    );

    const activeLink = screen.getByRole('link', { name: 'Overview' });

    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveAttribute('aria-label', 'Overview');
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'data-state',
      'collapsed',
    );

    await user.hover(activeLink);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Overview');

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'data-state',
      'expanded',
    );
    expect(
      screen.getByRole('button', { name: 'Collapse sidebar' }),
    ).toBeVisible();
  });

  it('supports controlled expansion and reports toggle requests', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Sidebar.Root open={false} onOpenChange={onOpenChange}>
        <Sidebar.Trigger />
        <Sidebar.Content />
      </Sidebar.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'data-state',
      'collapsed',
    );

    rerender(
      <Sidebar.Root open onOpenChange={onOpenChange}>
        <Sidebar.Trigger />
        <Sidebar.Content />
      </Sidebar.Root>,
    );

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'data-state',
      'expanded',
    );
  });

  it('supports collapsible nested navigation and custom widths', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Root width="18rem" collapsedWidth="4rem">
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.Submenu
                label="Projects"
                icon={<Folder aria-hidden="true" />}
              >
                <Sidebar.SubmenuItem href="/projects/alpha">
                  Alpha
                </Sidebar.SubmenuItem>
              </Sidebar.Submenu>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.Root>,
    );

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'style',
      expect.stringContaining('--notable-sidebar-width: 18rem'),
    );
    expect(
      screen.queryByRole('link', { name: 'Alpha' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Projects' }));

    expect(await screen.findByRole('link', { name: 'Alpha' })).toBeVisible();
  });

  it('opens the mobile drawer and closes it after navigation', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    render(
      <Sidebar.Root>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.Item href="#overview">Overview</Sidebar.Item>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.Item label="Refresh data" onClick={() => undefined}>
                <strong>Refresh</strong>
              </Sidebar.Item>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
        <Sidebar.Inset>
          <Sidebar.Trigger />
          <main>Page</main>
        </Sidebar.Inset>
      </Sidebar.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open sidebar' }));

    expect(
      await screen.findByRole('dialog', { name: 'Sidebar' }),
    ).toBeVisible();
    expect(
      await screen.findByRole('navigation', { name: 'Sidebar' }),
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Refresh data' }));

    expect(screen.getByRole('dialog', { name: 'Sidebar' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Close sidebar' }));

    expect(
      screen.queryByRole('dialog', { name: 'Sidebar' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open sidebar' }));
    await user.click(screen.getByRole('link', { name: 'Overview' }));

    expect(
      screen.queryByRole('dialog', { name: 'Sidebar' }),
    ).not.toBeInTheDocument();
  });

  it('toggles from the platform keyboard shortcut', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar.Root defaultOpen={false}>
        <Sidebar.Content />
      </Sidebar.Root>,
    );

    await user.keyboard('{Control>}b{/Control}');

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveAttribute(
      'data-state',
      'expanded',
    );
  });
});

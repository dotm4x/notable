import { useState, type ComponentProps } from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavigationMenu } from './navigation-menu.js';
import { NavigationMenu as PublicNavigationMenu } from '../../index.js';

function SiteNavigation(
  props: Partial<ComponentProps<typeof NavigationMenu>> = {},
) {
  return (
    <NavigationMenu aria-label="Main" {...props}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/editor">Editor</NavigationMenu.Link>
            <NavigationMenu.Link href="/sync">Sync</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs">
              Documentation
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="pricing">
          <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('exposes its compound parts from the public entry point', () => {
    expect(PublicNavigationMenu).toBe(NavigationMenu);
    expect(Object.keys(NavigationMenu)).toEqual(
      expect.arrayContaining(['List', 'Item', 'Trigger', 'Content', 'Link']),
    );
  });

  it('renders a labelled navigation landmark with a list of items', () => {
    render(<SiteNavigation />);

    const navigation = screen.getByRole('navigation', { name: 'Main' });
    const list = within(navigation).getByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders native links that navigate to their href', () => {
    render(<SiteNavigation />);

    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/pricing',
    );
  });

  it('calls the link click handler without opening a dropdown', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());

    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing" onClick={onClick}>
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    await user.click(screen.getByRole('link', { name: 'Pricing' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks the active link as the current page', () => {
    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing" active>
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('opens a dropdown panel when its trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(
      await screen.findByRole('link', { name: 'Editor' }),
    ).toBeInTheDocument();
  });

  it('links the trigger to its panel through aria-controls', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);

    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(
      await screen.findByRole('link', { name: 'Editor' }),
    ).toBeInTheDocument();
    expect(document.getElementById(panelId!)).toContainElement(
      screen.getByRole('link', { name: 'Editor' }),
    );
  });

  it('closes an open dropdown when the same trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await screen.findByRole('link', { name: 'Editor' });
    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('closes an open dropdown when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await screen.findByRole('link', { name: 'Editor' });
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('opens a dropdown from the keyboard and moves focus into the panel', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    screen.getByRole('button', { name: 'Products' }).focus();
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('link', { name: 'Editor' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('moves focus between triggers with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    screen.getByRole('button', { name: 'Products' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveFocus();
  });

  it('keeps several items independent when one opens after another', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    await user.click(screen.getByRole('button', { name: 'Products' }));
    await screen.findByRole('link', { name: 'Editor' });
    await user.hover(screen.getByRole('button', { name: 'Resources' }));

    expect(
      await screen.findByRole('link', { name: 'Documentation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resources' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  it('highlights the item under the pointer and clears it when the pointer leaves', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.hover(trigger);
    expect(trigger).toHaveAttribute('data-highlighted');

    await user.unhover(trigger);
    expect(trigger).not.toHaveAttribute('data-highlighted');
  });

  it('keeps the open item highlighted once the pointer has left it', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await user.unhover(trigger);

    expect(trigger).toHaveAttribute('data-highlighted');
  });

  it('marks a link as highlighted only for top-level items, not dropdown links', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation />);

    const pricing = screen.getByRole('link', { name: 'Pricing' });
    await user.hover(pricing);
    expect(pricing).toHaveAttribute('data-highlighted');

    await user.click(screen.getByRole('button', { name: 'Products' }));
    const editor = await screen.findByRole('link', { name: 'Editor' });
    expect(editor).not.toHaveAttribute('data-highlighted');
  });

  it('renders the highlight outside the accessibility tree', () => {
    render(<SiteNavigation />);

    const highlight = screen
      .getByRole('navigation', { name: 'Main' })
      .querySelector('.notable-navigation-menu__highlight');

    expect(highlight).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not open a disabled trigger', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger disabled>
              Coming soon
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/soon">Preview</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Coming soon' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.queryByRole('link', { name: 'Preview' }),
    ).not.toBeInTheDocument();
  });

  it('follows a controlled value and reports changes through onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function ControlledNavigation() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <>
          <p>Open item: {value ?? 'none'}</p>
          <SiteNavigation
            value={value}
            onValueChange={(nextValue) => {
              setValue(nextValue);
              onValueChange(nextValue);
            }}
          />
        </>
      );
    }

    render(<ControlledNavigation />);
    await user.click(screen.getByRole('button', { name: 'Resources' }));

    expect(
      await screen.findByRole('link', { name: 'Documentation' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Open item: resources')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith('resources');
  });

  it('keeps a controlled item closed when the parent does not update its value', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation value={null} />);

    await user.click(screen.getByRole('button', { name: 'Products' }));

    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens an uncontrolled item from defaultValue', async () => {
    render(<SiteNavigation defaultValue="products" />);

    expect(
      await screen.findByRole('link', { name: 'Editor' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes the dropdown after a link is activated when closeOnClick is set', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/editor" closeOnClick>
                Editor
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await user.click(await screen.findByRole('link', { name: 'Editor' }));

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('renders custom composed content inside the dropdown panel', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="account">
            <NavigationMenu.Trigger>Account</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div>
                <h3>Signed in</h3>
                <button type="button">Sign out</button>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Account' }));

    expect(
      await screen.findByRole('heading', { name: 'Signed in' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign out' }),
    ).toBeInTheDocument();
  });

  it('applies the consumer className to the root and the item parts', () => {
    render(
      <NavigationMenu className="custom-root" aria-label="Main">
        <NavigationMenu.List className="custom-list">
          <NavigationMenu.Item className="custom-item">
            <NavigationMenu.Link href="/" className="custom-link">
              Home
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>,
    );

    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass(
      'notable-navigation-menu',
      'custom-root',
    );
    expect(screen.getByRole('list')).toHaveClass(
      'notable-navigation-menu__list',
      'custom-list',
    );
    expect(screen.getByRole('listitem')).toHaveClass('custom-item');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass(
      'notable-navigation-menu__link',
      'custom-link',
    );
  });

  it('renders a labelled group with its own highlight outside the accessibility tree', async () => {
    const user = userEvent.setup();
    render(<GroupedNavigation />);

    await user.click(screen.getByRole('button', { name: 'Resources' }));

    const group = await screen.findByRole('group', { name: 'Learn' });
    const highlight = group.querySelector(
      '.notable-navigation-menu__highlight',
    );
    expect(highlight).toHaveAttribute('aria-hidden', 'true');
  });

  it('moves a group highlight between its links on hover', async () => {
    const user = userEvent.setup();
    render(<GroupedNavigation />);

    await user.click(screen.getByRole('button', { name: 'Resources' }));
    const docs = await screen.findByRole('link', { name: 'Documentation' });
    const forum = screen.getByRole('link', { name: 'Forum' });

    await user.hover(docs);
    expect(docs).toHaveAttribute('data-highlighted');
    expect(forum).not.toHaveAttribute('data-highlighted');

    await user.unhover(docs);
    expect(docs).not.toHaveAttribute('data-highlighted');
  });

  it('keeps highlight state separate for each group', async () => {
    const user = userEvent.setup();
    render(<GroupedNavigation />);

    await user.click(screen.getByRole('button', { name: 'Resources' }));
    const docs = await screen.findByRole('link', { name: 'Documentation' });
    const forum = screen.getByRole('link', { name: 'Forum' });

    await user.hover(docs);
    await user.hover(forum);

    expect(forum).toHaveAttribute('data-highlighted');
    expect(docs).not.toHaveAttribute('data-highlighted');
  });

  it('highlights a group link that receives keyboard focus', async () => {
    const user = userEvent.setup();
    render(<GroupedNavigation />);

    await user.click(screen.getByRole('button', { name: 'Resources' }));
    const docs = await screen.findByRole('link', { name: 'Documentation' });

    act(() => docs.focus());

    expect(docs).toHaveAttribute('data-highlighted');
  });
});

function GroupedNavigation() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenu.List>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div>
              <NavigationMenu.Group aria-label="Learn">
                <NavigationMenu.Link href="/docs">
                  Documentation
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/tutorials">
                  Tutorials
                </NavigationMenu.Link>
              </NavigationMenu.Group>
              <NavigationMenu.Group aria-label="Community">
                <NavigationMenu.Link href="/forum">Forum</NavigationMenu.Link>
              </NavigationMenu.Group>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}

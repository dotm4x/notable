import { Box, FileText, Home } from '../../icons/index.js';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tree as PublicTree } from '../../components/index.js';
import { Sidebar } from '../sidebar/sidebar.js';
import { Tree } from './tree.js';
import type { TreeNode } from './types.js';

const items: TreeNode[] = [
  {
    id: 'intro',
    label: 'Introduction',
    href: '/docs',
    icon: <Home aria-hidden="true" />,
  },
  {
    id: 'components',
    label: 'Components',
    icon: <Box aria-hidden="true" />,
    children: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/docs/components',
      },
      {
        id: 'button',
        label: 'Button',
        href: '/docs/components/button',
        icon: <FileText aria-hidden="true" />,
      },
      {
        id: 'nested',
        label: 'Nested',
        children: [
          {
            id: 'deep',
            label: 'Deep link',
            href: '/docs/components/button/deep',
          },
        ],
      },
    ],
  },
  {
    id: 'installation',
    label: 'Installation',
    href: '/docs/installation',
  },
];

describe('Tree', () => {
  it('renders items as a labelled navigation list', () => {
    render(<Tree aria-label="Contents" items={items} />);

    const list = screen.getByRole('list', { name: 'Contents' });
    expect(list).toHaveClass('one-tree');
    expect(
      within(list).getByRole('link', { name: 'Introduction' }),
    ).toHaveAttribute('href', '/docs');
    expect(
      within(list).getByRole('button', { name: 'Components' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the active link with aria-current', () => {
    render(<Tree activeId="button" aria-label="Contents" items={items} />);

    expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('moves the animated highlight to the hovered row', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Contents" items={items} />);

    const intro = screen.getByRole('link', { name: 'Introduction' });
    const installation = screen.getByRole('link', { name: 'Installation' });

    await user.hover(intro);
    expect(intro).toHaveAttribute('data-highlighted');

    await user.hover(installation);
    expect(intro).not.toHaveAttribute('data-highlighted');
    expect(installation).toHaveAttribute('data-highlighted');

    await user.unhover(installation);
    expect(installation).not.toHaveAttribute('data-highlighted');
  });

  it('moves the animated highlight to the focused row', () => {
    render(<Tree aria-label="Contents" items={items} />);

    const intro = screen.getByRole('link', { name: 'Introduction' });
    const installation = screen.getByRole('link', { name: 'Installation' });

    intro.focus();
    expect(intro).toHaveAttribute('data-highlighted');

    installation.focus();
    expect(intro).not.toHaveAttribute('data-highlighted');
    expect(installation).toHaveAttribute('data-highlighted');
  });

  it('renders branch rows with tree-owned layout classes', () => {
    render(<Tree aria-label="Contents" items={items} />);

    const branch = screen.getByRole('button', { name: 'Components' });

    expect(branch).toHaveClass('one-tree__row', 'one-tree__row--branch');
    expect(branch.className).not.toContain('one-button');
  });

  it('expands and collapses a branch with the disclosure button', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Contents" items={items} />);

    const branch = screen.getByRole('button', { name: 'Components' });
    expect(branch).toHaveAttribute('aria-expanded', 'false');

    await user.click(branch);
    expect(branch).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();

    await user.click(branch);
    expect(branch).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled expansion', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <Tree
        aria-label="Contents"
        expandedIds={['components']}
        items={items}
        onExpandedChange={onExpandedChange}
      />,
    );

    const branch = screen.getByRole('button', { name: 'Components' });
    expect(branch).toHaveAttribute('aria-expanded', 'true');

    await user.click(branch);
    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });

  it('collapses branches and hides children in compact mode', async () => {
    const user = userEvent.setup();
    const onCompactBranchClick = vi.fn();
    render(
      <Tree
        aria-label="Contents"
        compact
        defaultExpandedIds={['components']}
        items={items}
        onCompactBranchClick={onCompactBranchClick}
      />,
    );

    const branch = screen.getByRole('button', { name: 'Components' });
    expect(branch).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: 'Overview' }),
    ).not.toBeInTheDocument();

    await user.click(branch);

    expect(onCompactBranchClick).toHaveBeenCalledTimes(1);
    expect(branch).toHaveAttribute('aria-expanded', 'false');
  });

  it('reserves icon space when siblings have icons', () => {
    render(
      <Tree
        aria-label="Contents"
        items={[
          {
            id: 'with-icon',
            label: 'With icon',
            href: '/with-icon',
            icon: <Home aria-hidden="true" />,
          },
          { id: 'without-icon', label: 'Without icon', href: '/without-icon' },
        ]}
      />,
    );

    const row = screen.getByRole('link', { name: 'Without icon' });
    expect(row.querySelector('.one-tree__icon')).toBeEmptyDOMElement();
  });

  it('supports default expanded ids', () => {
    render(
      <Tree
        aria-label="Contents"
        defaultExpandedIds={['components']}
        items={items}
      />,
    );

    expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('auto-expands the ancestors of the active item', async () => {
    render(<Tree activeId="deep" aria-label="Contents" items={items} />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Components' }),
      ).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: 'Nested' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
    expect(screen.getByRole('link', { name: 'Deep link' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('calls onNavigate when a link is activated', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <Tree aria-label="Contents" items={items} onNavigate={onNavigate} />,
    );

    await user.click(screen.getByRole('link', { name: 'Introduction' }));

    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'intro' }),
    );
  });

  it('supports action leaves without an href', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Tree
        aria-label="Contents"
        items={[{ id: 'action', label: 'Run action' }]}
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Run action' }));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'action' }),
    );
  });

  it('moves focus with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Contents" items={items} />);

    const intro = screen.getByRole('link', { name: 'Introduction' });
    const components = screen.getByRole('button', { name: 'Components' });
    intro.focus();

    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(document.activeElement).toBe(components));

    await user.keyboard('{ArrowUp}');
    await waitFor(() => expect(document.activeElement).toBe(intro));

    await user.keyboard('{End}');
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('link', { name: 'Installation' }),
      ),
    );

    await user.keyboard('{Home}');
    await waitFor(() => expect(document.activeElement).toBe(intro));
  });

  it('expands with ArrowRight and focuses the first child', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Contents" items={items} />);

    const components = screen.getByRole('button', { name: 'Components' });
    components.focus();

    await user.keyboard('{ArrowRight}');
    expect(components).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('link', { name: 'Overview' }),
      ),
    );
  });

  it('collapses with ArrowLeft and focuses the parent branch', async () => {
    const user = userEvent.setup();
    render(
      <Tree
        aria-label="Contents"
        defaultExpandedIds={['components']}
        items={items}
      />,
    );

    const components = screen.getByRole('button', { name: 'Components' });
    const button = screen.getByRole('link', { name: 'Button' });
    button.focus();

    await user.keyboard('{ArrowLeft}');
    await waitFor(() => expect(document.activeElement).toBe(components));

    await user.keyboard('{ArrowLeft}');
    expect(components).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports typeahead navigation', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Contents" items={items} />);

    const intro = screen.getByRole('link', { name: 'Introduction' });
    intro.focus();

    await user.keyboard('i');
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('link', { name: 'Installation' }),
      ),
    );
  });

  it('skips disabled items in keyboard navigation', () => {
    render(
      <Tree
        aria-label="Contents"
        items={[
          { id: 'one', label: 'One', href: '/one' },
          { id: 'two', label: 'Two', href: '/two', disabled: true },
          { id: 'three', label: 'Three', href: '/three' },
        ]}
      />,
    );

    const disabled = screen.getByText('Two').closest('a');
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    expect(disabled).toHaveAttribute('tabindex', '-1');
  });

  it('can render inside Sidebar.Tree without a second highlight', () => {
    const { container } = render(
      <Sidebar.Root defaultOpen={false}>
        <Sidebar.Tree aria-label="Contents" items={items} />
      </Sidebar.Root>,
    );

    expect(screen.getByRole('list', { name: 'Contents' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Introduction' }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.one-tree__highlight'),
    ).not.toBeInTheDocument();
  });

  it('is exported from the package entry point', () => {
    expect(PublicTree).toBe(Tree);
  });
});

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Breadcrumb } from './breadcrumb.js';

afterEach(cleanup);

describe('Breadcrumb', () => {
  describe('core trail', () => {
    it('renders a labelled navigation landmark with an ordered list', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item current>Settings</Breadcrumb.Item>
        </Breadcrumb>,
      );

      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(within(nav).getByRole('list')).toBeInTheDocument();
      expect(within(nav).getAllByRole('listitem')).toHaveLength(2);
    });

    it('renders items with href as links and the current item with aria-current', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
          <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
        </Breadcrumb>,
      );

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'href',
        '/',
      );
      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
        'href',
        '/docs',
      );
      expect(screen.getByText('Breadcrumb')).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByText('Breadcrumb').tagName).toBe('SPAN');
    });

    it('renders an item without href as plain text, not a link', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Projects</Breadcrumb.Item>
        </Breadcrumb>,
      );

      expect(screen.getByText('Projects').tagName).toBe('SPAN');
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('hides separators from assistive technology and omits them before the first item', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
          <Breadcrumb.Item current>B</Breadcrumb.Item>
        </Breadcrumb>,
      );

      const separators = container.querySelectorAll(
        '.notable-breadcrumb__separator',
      );
      expect(separators).toHaveLength(2);
      separators.forEach((separator) => {
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
      expect(
        container
          .querySelectorAll('.notable-breadcrumb__entry')[0]
          .querySelector('.notable-breadcrumb__separator'),
      ).toBeNull();
    });

    it('renders a custom separator', () => {
      render(
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item current>Docs</Breadcrumb.Item>
        </Breadcrumb>,
      );

      expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
    });

    it('forwards the ref and passes class names and native props to the nav element', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Breadcrumb ref={ref} className="custom" data-testid="trail">
          <Breadcrumb.Item current>Home</Breadcrumb.Item>
        </Breadcrumb>,
      );

      const nav = screen.getByTestId('trail');
      expect(ref.current).toBe(nav);
      expect(nav.tagName).toBe('NAV');
      expect(nav).toHaveClass('notable-breadcrumb', 'custom');
    });
  });

  describe('collapsing', () => {
    function LongTrail(props: { maxVisibleItems?: number }) {
      return (
        <Breadcrumb maxVisibleItems={props.maxVisibleItems}>
          <Breadcrumb.Item href="/">Root</Breadcrumb.Item>
          <Breadcrumb.Item href="/a">A</Breadcrumb.Item>
          <Breadcrumb.Item href="/b">B</Breadcrumb.Item>
          <Breadcrumb.Item href="/c">C</Breadcrumb.Item>
          <Breadcrumb.Item href="/d">D</Breadcrumb.Item>
          <Breadcrumb.Item current>E</Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    it('renders every entry when maxVisibleItems is omitted', () => {
      render(<LongTrail />);

      expect(
        screen.queryByRole('button', { name: 'Show hidden breadcrumb items' }),
      ).toBeNull();
      expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    it('keeps the first entry, the ellipsis, and the trailing entries', () => {
      render(<LongTrail maxVisibleItems={4} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(screen.getByRole('link', { name: 'Root' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'D' })).toBeInTheDocument();
      expect(screen.getByText('E')).toHaveAttribute('aria-current', 'page');
      expect(screen.queryByRole('link', { name: 'A' })).toBeNull();
      expect(screen.queryByRole('link', { name: 'C' })).toBeNull();
      expect(
        screen.getByRole('button', { name: 'Show hidden breadcrumb items' }),
      ).toBeInTheDocument();
    });

    it('lists hidden entries in the ellipsis menu as links', async () => {
      const user = userEvent.setup();
      render(<LongTrail maxVisibleItems={4} />);

      await user.click(
        screen.getByRole('button', { name: 'Show hidden breadcrumb items' }),
      );

      const menu = await screen.findByRole('menu');
      expect(within(menu).getByRole('menuitem', { name: 'A' })).toHaveAttribute(
        'href',
        '/a',
      );
      expect(within(menu).getByRole('menuitem', { name: 'B' })).toHaveAttribute(
        'href',
        '/b',
      );
    });

    it('marks hidden entries without href as disabled in the menu', async () => {
      const user = userEvent.setup();
      render(
        <Breadcrumb maxVisibleItems={3}>
          <Breadcrumb.Item href="/">Root</Breadcrumb.Item>
          <Breadcrumb.Item>Unlinked</Breadcrumb.Item>
          <Breadcrumb.Item href="/b">B</Breadcrumb.Item>
          <Breadcrumb.Item current>C</Breadcrumb.Item>
        </Breadcrumb>,
      );

      await user.click(
        screen.getByRole('button', { name: 'Show hidden breadcrumb items' }),
      );

      const menu = await screen.findByRole('menu');
      expect(
        within(menu).getByRole('menuitem', { name: 'Unlinked' }),
      ).toHaveAttribute('aria-disabled', 'true');
    });

    it('treats values below 3 as 3', () => {
      render(<LongTrail maxVisibleItems={1} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.getByText('E')).toHaveAttribute('aria-current', 'page');
    });

    it('does not collapse when the trail fits the limit', () => {
      render(<LongTrail maxVisibleItems={6} />);

      expect(
        screen.queryByRole('button', { name: 'Show hidden breadcrumb items' }),
      ).toBeNull();
      expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });
  });

  describe('dropdown', () => {
    it('opens a menu of destinations as links', async () => {
      const user = userEvent.setup();
      render(
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Dropdown
            label="Projects"
            items={[
              { label: 'Alpha', href: '/projects/alpha' },
              { label: 'Beta', href: '/projects/beta' },
            ]}
          />
          <Breadcrumb.Item current>Alpha</Breadcrumb.Item>
        </Breadcrumb>,
      );

      await user.click(screen.getByRole('button', { name: /Projects/ }));

      const menu = await screen.findByRole('menu');
      expect(
        within(menu).getByRole('menuitem', { name: 'Alpha' }),
      ).toHaveAttribute('href', '/projects/alpha');
      expect(
        within(menu).getByRole('menuitem', { name: 'Beta' }),
      ).toHaveAttribute('href', '/projects/beta');
    });

    it('renders the trigger as a button that is not a link', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Dropdown
            label="Projects"
            items={[{ label: 'Alpha', href: '/a' }]}
          />
        </Breadcrumb>,
      );

      expect(screen.getByRole('button', { name: /Projects/ })).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('groups a dropdown entry inside the collapsed menu', async () => {
      const user = userEvent.setup();
      render(
        <Breadcrumb maxVisibleItems={3}>
          <Breadcrumb.Item href="/">Root</Breadcrumb.Item>
          <Breadcrumb.Dropdown
            label="Projects"
            items={[{ label: 'Alpha', href: '/projects/alpha' }]}
          />
          <Breadcrumb.Item href="/x">X</Breadcrumb.Item>
          <Breadcrumb.Item current>Current</Breadcrumb.Item>
        </Breadcrumb>,
      );

      await user.click(
        screen.getByRole('button', { name: 'Show hidden breadcrumb items' }),
      );

      const menu = await screen.findByRole('menu');
      expect(within(menu).getByText('Projects')).toBeInTheDocument();
      expect(
        within(menu).getByRole('menuitem', { name: 'Alpha' }),
      ).toHaveAttribute('href', '/projects/alpha');
    });
  });
});

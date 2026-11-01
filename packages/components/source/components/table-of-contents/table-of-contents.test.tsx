import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableOfContents } from './table-of-contents.js';
import { TableOfContents as PublicTableOfContents } from '../../index.js';

const observers: TestIntersectionObserver[] = [];

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [0];
  readonly observed: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(target: Element, top: number, isIntersecting = true) {
    const rect = {
      x: 0,
      y: top,
      top,
      left: 0,
      right: 100,
      bottom: top + 20,
      width: 100,
      height: 20,
      toJSON: () => ({}),
    } as DOMRectReadOnly;

    this.callback(
      [
        {
          boundingClientRect: rect,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: rect,
          isIntersecting,
          rootBounds: null,
          target,
          time: 0,
        },
      ],
      this,
    );
  }
}

function renderTableOfContents() {
  return render(
    <>
      <section id="overview">Overview section</section>
      <section id="installation">Installation section</section>
      <TableOfContents.Root>
        <TableOfContents.Header>On this page</TableOfContents.Header>
        <TableOfContents.List>
          <TableOfContents.Item href="#overview" label="Overview" />
          <TableOfContents.Item href="#installation" label="Installation">
            <TableOfContents.List>
              <TableOfContents.Item href="#overview" label="Overview details" />
            </TableOfContents.List>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents.Root>
    </>,
  );
}

afterEach(() => {
  observers.length = 0;
  vi.unstubAllGlobals();
});

describe('TableOfContents', () => {
  it('exports composable parts and renders nested anchor navigation', () => {
    expect(PublicTableOfContents).toBe(TableOfContents);

    renderTableOfContents();

    expect(
      screen.getByRole('navigation', { name: 'On this page' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'On this page' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '#overview',
    );
    expect(
      screen.getByRole('link', { name: 'Overview details' }),
    ).toBeVisible();
  });

  it('marks the section reported by IntersectionObserver as current', () => {
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
    renderTableOfContents();

    const installation = document.getElementById('installation');
    const observer = observers[0];
    expect(installation).not.toBeNull();
    expect(observer?.observed).toContain(installation);

    act(() => observer?.trigger(installation!, 100));

    expect(screen.getByRole('link', { name: 'Installation' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  it('resolves percent-encoded fragment links to their section IDs', async () => {
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
    const user = userEvent.setup();
    const { container } = render(
      <>
        <section id="api reference">API reference section</section>
        <TableOfContents.Root>
          <TableOfContents.List>
            <TableOfContents.Item
              href="#api%20reference"
              label="API reference"
            />
          </TableOfContents.List>
        </TableOfContents.Root>
      </>,
    );
    const section = container.querySelector<HTMLElement>(
      '[id="api reference"]',
    );
    const scrollTo = vi.fn();
    const originalScrollTo = window.scrollTo;
    window.scrollTo = scrollTo;

    if (!section) {
      throw new Error('API reference section was not rendered.');
    }

    expect(observers[0]?.observed).toContain(section);
    await user.click(screen.getByRole('link', { name: 'API reference' }));

    expect(window.location.hash).toBe('#api%20reference');
    expect(scrollTo).toHaveBeenCalled();

    window.scrollTo = originalScrollTo;
  });

  it('smoothly scrolls to the anchor and updates the URL when activated', async () => {
    const user = userEvent.setup();
    const { container } = renderTableOfContents();
    const overview = container.querySelector<HTMLElement>('#overview');
    const scrollTo = vi.fn();
    const originalScrollTo = window.scrollTo;
    window.scrollTo = scrollTo;

    if (!overview) {
      throw new Error('Overview section was not rendered.');
    }
    await user.click(screen.getByRole('link', { name: 'Overview' }));

    expect(window.location.hash).toBe('#overview');
    expect(scrollTo).toHaveBeenCalled();

    window.scrollTo = originalScrollTo;
  });
});

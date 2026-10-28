import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { ScrollArea } from './scroll-area.js';
import { ScrollArea as PublicScrollArea } from '../../index.js';

function mockOverflow({
  scrollHeight,
  clientHeight,
  scrollWidth,
  clientWidth,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
}): void {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(
    scrollHeight,
  );
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockReturnValue(
    clientHeight,
  );
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(
    scrollWidth,
  );
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(
    clientWidth,
  );
}

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected ScrollArea to render a root element');
  }

  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ScrollArea', () => {
  describe('rendering', () => {
    it('renders children inside the viewport by default', () => {
      // Arrange & Act
      render(
        <ScrollArea aria-label="Messages">
          <p>First message</p>
        </ScrollArea>,
      );

      // Assert
      const viewport = screen.getByLabelText('Messages');
      expect(viewport).toContainElement(screen.getByText('First message'));
    });

    it('applies className and style to the root and other attributes to the viewport', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea
          className="custom-root"
          style={{ height: 120 }}
          id="notes"
          aria-label="Notes"
          data-testid="notes-viewport"
        >
          Content
        </ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      expect(root).toHaveClass('notable-scroll-area', 'custom-root');
      expect(root.style.height).toBe('120px');
      expect(root).not.toHaveAttribute('id');

      const viewport = screen.getByTestId('notes-viewport');
      expect(viewport).toHaveClass('notable-scroll-area__viewport');
      expect(viewport).toHaveAttribute('id', 'notes');
      expect(viewport).toHaveAttribute('aria-label', 'Notes');
    });

    it('forwards the ref to the scrollable viewport element', () => {
      // Arrange
      const ref = createRef<HTMLDivElement>();

      // Act
      render(<ScrollArea ref={ref}>Content</ScrollArea>);

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('notable-scroll-area__viewport');
    });

    it('is exported from the package entry point', () => {
      expect(PublicScrollArea).toBe(ScrollArea);
    });
  });

  describe('orientation', () => {
    it('clips horizontal overflow for a vertical scroll area', () => {
      // Arrange & Act
      render(<ScrollArea aria-label="Vertical">Content</ScrollArea>);

      // Assert
      const viewport = screen.getByLabelText('Vertical');
      expect(viewport.style.overflowX).toBe('hidden');
      expect(viewport.style.overflowY).toBe('');
    });

    it('clips vertical overflow for a horizontal scroll area', () => {
      // Arrange & Act
      render(
        <ScrollArea aria-label="Horizontal" orientation="horizontal">
          Content
        </ScrollArea>,
      );

      // Assert
      const viewport = screen.getByLabelText('Horizontal');
      expect(viewport.style.overflowY).toBe('hidden');
      expect(viewport.style.overflowX).toBe('');
    });

    it('constrains the content to the viewport width for a vertical scroll area', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea aria-label="Vertical">Content</ScrollArea>,
      );

      // Assert
      const content = container.querySelector('.notable-scroll-area__content');
      expect(content).toHaveClass('notable-scroll-area__content--vertical');
      expect(content).toHaveStyle({ minWidth: '100%' });
    });

    it('does not constrain the content width when horizontal scrolling is enabled', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea aria-label="Horizontal" orientation="horizontal">
          Content
        </ScrollArea>,
      );

      // Assert
      const content = container.querySelector('.notable-scroll-area__content');
      expect(content).not.toHaveClass('notable-scroll-area__content--vertical');
      expect(content).not.toHaveStyle({ minWidth: '100%' });
    });

    it('does not clip either axis when both directions scroll', () => {
      // Arrange & Act
      render(
        <ScrollArea aria-label="Both" orientation="both">
          Content
        </ScrollArea>,
      );

      // Assert
      const viewport = screen.getByLabelText('Both');
      expect(viewport.style.overflowX).toBe('');
      expect(viewport.style.overflowY).toBe('');
    });
  });

  describe('scrollbars', () => {
    it('hides both scrollbar orientations by default, even when content overflows', () => {
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      const { container } = render(
        <ScrollArea orientation="both">Content</ScrollArea>,
      );

      expect(
        container.querySelector('.notable-scroll-area__scrollbar'),
      ).toBeNull();
    });

    it.each([
      ['vertical', 'vertical'],
      ['horizontal', 'horizontal'],
    ] as const)(
      'renders only the %s scrollbar when that axis overflows',
      async (scrollbar, expectedOrientation) => {
        mockOverflow({
          scrollHeight: 500,
          clientHeight: 200,
          scrollWidth: 500,
          clientWidth: 200,
        });

        const { container } = render(
          <ScrollArea orientation="both" scrollbar={scrollbar}>
            Content
          </ScrollArea>,
        );

        await waitFor(() => {
          expect(
            container.querySelector(
              `.notable-scroll-area__scrollbar--${expectedOrientation}`,
            ),
          ).not.toBeNull();
        });
        expect(
          container.querySelector(
            `.notable-scroll-area__scrollbar--${expectedOrientation === 'vertical' ? 'horizontal' : 'vertical'}`,
          ),
        ).toBeNull();
      },
    );

    it('renders both scrollbars and their corner when both axes overflow', async () => {
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      const { container } = render(
        <ScrollArea orientation="both" scrollbar="both">
          Content
        </ScrollArea>,
      );

      await waitFor(() => {
        expect(
          container.querySelectorAll('.notable-scroll-area__scrollbar'),
        ).toHaveLength(2);
        expect(
          container.querySelector('.notable-scroll-area__corner'),
        ).not.toBeNull();
      });
    });

    it('does not render a scrollbar when its orientation has no overflow', async () => {
      mockOverflow({
        scrollHeight: 200,
        clientHeight: 200,
        scrollWidth: 200,
        clientWidth: 200,
      });

      const { container } = render(
        <ScrollArea orientation="both" scrollbar="both">
          Content
        </ScrollArea>,
      );

      await waitFor(() => {
        expect(
          container.querySelector('.notable-scroll-area__scrollbar'),
        ).toBeNull();
      });
    });

    it('does not render a scrollbar for an axis that is not scrollable', async () => {
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      const { container } = render(
        <ScrollArea orientation="horizontal" scrollbar="vertical">
          Content
        </ScrollArea>,
      );

      await waitFor(() => {
        expect(
          container.querySelector('.notable-scroll-area__scrollbar'),
        ).toBeNull();
      });
    });

    it('keeps legacy visibility values working', async () => {
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      const { container, rerender } = render(
        <ScrollArea orientation="both" scrollbar="visible">
          Content
        </ScrollArea>,
      );

      await waitFor(() => {
        expect(
          container.querySelectorAll('.notable-scroll-area__scrollbar'),
        ).toHaveLength(2);
      });

      rerender(
        <ScrollArea orientation="both" scrollbar="auto">
          Content
        </ScrollArea>,
      );

      expect(getRoot(container)).toHaveClass(
        'notable-scroll-area--auto-scrollbar',
      );

      rerender(
        <ScrollArea orientation="both" scrollbar="hidden">
          Content
        </ScrollArea>,
      );

      expect(
        container.querySelector('.notable-scroll-area__scrollbar'),
      ).toBeNull();
    });

    it('keeps viewport focus and programmatic scrolling available when bars are hidden', () => {
      render(
        <ScrollArea aria-label="Scrollable content" tabIndex={0}>
          Content
        </ScrollArea>,
      );

      const viewport = screen.getByLabelText('Scrollable content');
      expect(viewport).toHaveClass('base-ui-disable-scrollbar');
      expect(viewport).toHaveAttribute('tabindex', '0');
      viewport.scrollTop = 40;
      viewport.scrollLeft = 20;
      expect(viewport.scrollTop).toBe(40);
      expect(viewport.scrollLeft).toBe(20);
    });
  });

  describe('fade edges', () => {
    it('does not apply the fade class by default', () => {
      // Arrange & Act
      const { container } = render(<ScrollArea>Content</ScrollArea>);

      // Assert
      expect(getRoot(container)).not.toHaveClass('notable-scroll-area--fade');
    });

    it('applies the fade class when fadeEdges is enabled', () => {
      // Arrange & Act
      const { container } = render(<ScrollArea fadeEdges>Content</ScrollArea>);

      // Assert
      expect(getRoot(container)).toHaveClass('notable-scroll-area--fade');
    });

    it('sets the fade size as a custom property on the root', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea fadeEdges fadeSize="2rem">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(
        getRoot(container).style.getPropertyValue(
          '--notable-scroll-area-fade-size',
        ),
      ).toBe('2rem');
    });

    it('keeps a custom style alongside the fade size variable', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea fadeSize="16px" style={{ maxHeight: 200 }}>
          Content
        </ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      expect(root.style.maxHeight).toBe('200px');
      expect(
        root.style.getPropertyValue('--notable-scroll-area-fade-size'),
      ).toBe('16px');
    });
  });

  describe('edge effects', () => {
    function getEdgeOverlays(container: HTMLElement): string[] {
      return Array.from(
        container.querySelectorAll('.notable-scroll-area__edge'),
        (overlay) =>
          Array.from(overlay.classList).find((className) =>
            className.startsWith('notable-scroll-area__edge--'),
          ) ?? '',
      );
    }

    it('applies no edge effect by default', () => {
      // Arrange and Act
      const { container } = render(<ScrollArea>Content</ScrollArea>);

      // Assert
      const root = getRoot(container);
      expect(root).not.toHaveClass('notable-scroll-area--fade');
      expect(root).not.toHaveClass('notable-scroll-area--blur');
      expect(getEdgeOverlays(container)).toEqual([]);
    });

    it('applies the fade class without overlays for edgeEffect="fade"', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="fade">Content</ScrollArea>,
      );

      // Assert
      expect(getRoot(container)).toHaveClass('notable-scroll-area--fade');
      expect(getEdgeOverlays(container)).toEqual([]);
    });

    it('renders vertical overlays only for a vertical orientation', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" orientation="vertical">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(getRoot(container)).toHaveClass('notable-scroll-area--blur');
      expect(getEdgeOverlays(container)).toEqual([
        'notable-scroll-area__edge--top',
        'notable-scroll-area__edge--bottom',
      ]);
    });

    it('renders horizontal overlays only for a horizontal orientation', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" orientation="horizontal">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(getEdgeOverlays(container)).toEqual([
        'notable-scroll-area__edge--start',
        'notable-scroll-area__edge--end',
      ]);
    });

    it('renders overlays on all four edges for a bidirectional orientation', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" orientation="both">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(getEdgeOverlays(container)).toEqual([
        'notable-scroll-area__edge--top',
        'notable-scroll-area__edge--bottom',
        'notable-scroll-area__edge--start',
        'notable-scroll-area__edge--end',
      ]);
    });

    it('renders empty overlays that are not focusable', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" orientation="both">
          Content
        </ScrollArea>,
      );

      // Assert
      const overlays = container.querySelectorAll('.notable-scroll-area__edge');
      overlays.forEach((overlay) => {
        expect(overlay).not.toHaveAttribute('tabindex');
        expect(overlay).toBeEmptyDOMElement();
      });
    });

    it('lets edgeEffect take precedence over the deprecated fadeEdges', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" fadeEdges>
          Content
        </ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      expect(root).toHaveClass('notable-scroll-area--blur');
      expect(root).not.toHaveClass('notable-scroll-area--fade');
    });

    it('sets the edge size from edgeEffectSize and prefers it over fadeSize', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea edgeEffect="blur" edgeEffectSize="2rem" fadeSize="10px">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(
        getRoot(container).style.getPropertyValue(
          '--notable-scroll-area-edge-size',
        ),
      ).toBe('2rem');
    });

    it('keeps a custom style alongside the edge size variable', () => {
      // Arrange and Act
      const { container } = render(
        <ScrollArea
          edgeEffect="blur"
          edgeEffectSize="16px"
          style={{ maxHeight: 200 }}
        >
          Content
        </ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      expect(root.style.maxHeight).toBe('200px');
      expect(
        root.style.getPropertyValue('--notable-scroll-area-edge-size'),
      ).toBe('16px');
    });

    it('marks the overflowing edge for blur so overlays track overflow', async () => {
      // Arrange
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 100,
        clientWidth: 100,
      });

      // Act
      const { container } = render(
        <ScrollArea edgeEffect="blur">Content</ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      await waitFor(() => expect(root).toHaveAttribute('data-overflow-y-end'));
      expect(root).not.toHaveAttribute('data-overflow-y-start');
    });

    it('does not mark an edge when content fits the viewport', () => {
      // Arrange
      mockOverflow({
        scrollHeight: 100,
        clientHeight: 100,
        scrollWidth: 100,
        clientWidth: 100,
      });

      // Act
      const { container } = render(
        <ScrollArea edgeEffect="blur">Content</ScrollArea>,
      );

      // Assert
      const root = getRoot(container);
      expect(root).not.toHaveAttribute('data-overflow-y-end');
      expect(root).not.toHaveAttribute('data-overflow-y-start');
    });
  });

  describe('overflow state', () => {
    it('reports no overflow when content fits the viewport', () => {
      // Arrange
      mockOverflow({
        scrollHeight: 100,
        clientHeight: 100,
        scrollWidth: 100,
        clientWidth: 100,
      });

      // Act
      const { container } = render(<ScrollArea fadeEdges>Content</ScrollArea>);

      // Assert
      const root = getRoot(container);
      expect(root).not.toHaveAttribute('data-has-overflow-y');
      expect(root).not.toHaveAttribute('data-overflow-y-end');
    });

    it('reports vertical overflow at the end when content extends below the viewport', async () => {
      // Arrange
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 100,
        clientWidth: 100,
      });

      // Act
      const { container } = render(<ScrollArea fadeEdges>Content</ScrollArea>);

      // Assert
      const root = getRoot(container);
      await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'));
      expect(root).toHaveAttribute('data-overflow-y-end');
      expect(root).not.toHaveAttribute('data-overflow-y-start');
    });

    it('keeps overflow detection when no scrollbar orientation is requested', async () => {
      // Arrange
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      // Act
      const { container } = render(
        <ScrollArea orientation="both">Content</ScrollArea>,
      );

      const root = getRoot(container);
      await waitFor(() => {
        expect(root).toHaveAttribute('data-has-overflow-y');
        expect(root).toHaveAttribute('data-has-overflow-x');
      });
      expect(
        container.querySelector(
          '.notable-scroll-area__scrollbar, .notable-scroll-area__thumb, .notable-scroll-area__corner',
        ),
      ).toBeNull();
    });
  });

  describe('native attributes', () => {
    it('forwards event handlers to the viewport', () => {
      // Arrange
      const onScroll = vi.fn();
      render(
        <ScrollArea aria-label="Feed" onScroll={onScroll}>
          Content
        </ScrollArea>,
      );

      // Act
      screen
        .getByLabelText('Feed')
        .dispatchEvent(new Event('scroll', { bubbles: false }));

      // Assert
      expect(onScroll).toHaveBeenCalledTimes(1);
    });

    it('lets a consumer make the viewport focusable with tabIndex', () => {
      // Arrange & Act
      render(
        <ScrollArea aria-label="Focusable" tabIndex={0}>
          Content
        </ScrollArea>,
      );

      // Assert
      expect(screen.getByLabelText('Focusable')).toHaveAttribute(
        'tabindex',
        '0',
      );
    });
  });
});

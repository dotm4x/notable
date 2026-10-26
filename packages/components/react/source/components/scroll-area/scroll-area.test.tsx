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

    it('renders only the vertical scrollbar for a vertical scroll area', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea scrollbar="visible">Content</ScrollArea>,
      );

      // Assert
      expect(
        container.querySelector('.notable-scroll-area__scrollbar--vertical'),
      ).not.toBeNull();
      expect(
        container.querySelector('.notable-scroll-area__scrollbar--horizontal'),
      ).toBeNull();
      expect(
        container.querySelector('.notable-scroll-area__corner'),
      ).toBeNull();
    });

    it('renders both scrollbars for a bidirectional scroll area', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea orientation="both" scrollbar="visible">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(
        container.querySelector('.notable-scroll-area__scrollbar--vertical'),
      ).not.toBeNull();
      expect(
        container.querySelector('.notable-scroll-area__scrollbar--horizontal'),
      ).not.toBeNull();
    });
  });

  describe('scrollbar modes', () => {
    it('keeps the scrollbar mounted in visible mode', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea scrollbar="visible">Content</ScrollArea>,
      );

      // Assert
      expect(
        container.querySelector('.notable-scroll-area__thumb'),
      ).not.toBeNull();
    });

    it('does not render any scrollbar in hidden mode while keeping the content scrollable', () => {
      // Arrange & Act
      const { container } = render(
        <ScrollArea orientation="both" scrollbar="hidden" aria-label="Hidden">
          Content
        </ScrollArea>,
      );

      // Assert
      expect(
        container.querySelector('.notable-scroll-area__scrollbar'),
      ).toBeNull();
      expect(
        container.querySelector('.notable-scroll-area__corner'),
      ).toBeNull();
      expect(screen.getByLabelText('Hidden')).toHaveClass(
        'notable-scroll-area__viewport',
      );
    });

    it('marks the root for auto scrollbar visibility only in auto mode', () => {
      // Arrange
      const { container, rerender } = render(<ScrollArea>Content</ScrollArea>);

      // Act & Assert
      expect(getRoot(container)).toHaveClass(
        'notable-scroll-area--auto-scrollbar',
      );

      rerender(<ScrollArea scrollbar="visible">Content</ScrollArea>);

      expect(getRoot(container)).not.toHaveClass(
        'notable-scroll-area--auto-scrollbar',
      );
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

    it('renders the corner only when both axes overflow', async () => {
      // Arrange
      mockOverflow({
        scrollHeight: 500,
        clientHeight: 200,
        scrollWidth: 500,
        clientWidth: 200,
      });

      // Act
      const { container } = render(
        <ScrollArea orientation="both" scrollbar="visible">
          Content
        </ScrollArea>,
      );

      // Assert
      await waitFor(() =>
        expect(getRoot(container)).toHaveAttribute('data-has-overflow-y'),
      );
      expect(
        container.querySelector('.notable-scroll-area__corner'),
      ).not.toBeNull();
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

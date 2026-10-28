import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnimatedHighlight } from './animated-highlight.js';

type Layout = {
  top: number;
  left: number;
  width: number;
  height: number;
  offsetParent: HTMLElement | null;
};

/** jsdom performs no layout, so offset metrics are stubbed per element. */
function setLayout(element: HTMLElement, layout: Layout): void {
  Object.defineProperties(element, {
    offsetTop: { configurable: true, value: layout.top },
    offsetLeft: { configurable: true, value: layout.left },
    offsetWidth: { configurable: true, value: layout.width },
    offsetHeight: { configurable: true, value: layout.height },
    offsetParent: { configurable: true, value: layout.offsetParent },
  });
}

function renderHighlightList(): {
  container: HTMLElement;
  highlight: HTMLElement;
  first: HTMLElement;
  second: HTMLElement;
  disabled: HTMLElement;
} {
  const { container } = render(
    <div data-testid="container">
      <AnimatedHighlight />
      <div data-testid="first" />
      <div data-testid="second" />
      <div data-testid="disabled" data-disabled="" />
    </div>,
  );

  const containerElement = container.querySelector<HTMLElement>(
    '[data-testid="container"]',
  );
  const highlight = container.querySelector<HTMLElement>(
    '.notable-animated-highlight',
  );
  const first = container.querySelector<HTMLElement>('[data-testid="first"]');
  const second = container.querySelector<HTMLElement>('[data-testid="second"]');
  const disabled = container.querySelector<HTMLElement>(
    '[data-testid="disabled"]',
  );

  if (!containerElement || !highlight || !first || !second || !disabled) {
    throw new Error('Highlight fixture failed to render');
  }

  setLayout(first, {
    top: 10,
    left: 4,
    width: 100,
    height: 32,
    offsetParent: containerElement,
  });
  setLayout(second, {
    top: 60,
    left: 4,
    width: 140,
    height: 48,
    offsetParent: containerElement,
  });
  setLayout(disabled, {
    top: 120,
    left: 4,
    width: 80,
    height: 24,
    offsetParent: containerElement,
  });

  return { container: containerElement, highlight, first, second, disabled };
}

function readHighlight(highlight: HTMLElement): {
  width: string;
  height: string;
  transform: string;
  opacity: string;
} {
  return {
    width: highlight.style.width,
    height: highlight.style.height,
    transform: highlight.style.transform,
    opacity: highlight.style.opacity,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AnimatedHighlight', () => {
  it('is hidden from assistive technology', () => {
    // Arrange
    const { highlight } = renderHighlightList();

    // Act
    const hidden = highlight.getAttribute('aria-hidden');

    // Assert
    expect(hidden).toBe('true');
  });

  it('starts hidden when no item is highlighted', async () => {
    // Arrange
    const { highlight } = renderHighlightList();

    // Act
    await waitFor(() => {
      expect(readHighlight(highlight).opacity).toBe('0');
    });

    // Assert
    expect(readHighlight(highlight).opacity).toBe('0');
  });

  it('covers the highlighted item with its position and size', async () => {
    // Arrange
    const { highlight, first } = renderHighlightList();

    // Act
    first.setAttribute('data-highlighted', '');

    // Assert
    await waitFor(() => {
      expect(readHighlight(highlight)).toMatchObject({
        width: '100px',
        height: '32px',
        opacity: '1',
      });
    });
    expect(readHighlight(highlight).transform).toContain('4px');
    expect(readHighlight(highlight).transform).toContain('10px');
  });

  it('moves to the newly highlighted item', async () => {
    // Arrange
    const { highlight, first, second } = renderHighlightList();
    first.setAttribute('data-highlighted', '');
    await waitFor(() => {
      expect(readHighlight(highlight).height).toBe('32px');
    });

    // Act
    first.removeAttribute('data-highlighted');
    second.setAttribute('data-highlighted', '');

    // Assert
    await waitFor(() => {
      const style = readHighlight(highlight);
      expect(style).toMatchObject({
        width: '140px',
        height: '48px',
        opacity: '1',
      });
      expect(style.transform).toContain('60px');
    });
  });

  it('never targets disabled items', async () => {
    // Arrange
    const { highlight, disabled } = renderHighlightList();

    // Act
    disabled.setAttribute('data-highlighted', '');

    // Assert
    await waitFor(() => {
      expect(readHighlight(highlight).opacity).toBe('0');
    });
  });

  it('fades out when the highlighted item is removed', async () => {
    // Arrange
    const { highlight, first } = renderHighlightList();
    first.setAttribute('data-highlighted', '');
    await waitFor(() => {
      expect(readHighlight(highlight).opacity).toBe('1');
    });

    // Act
    first.removeAttribute('data-highlighted');

    // Assert
    await waitFor(() => {
      expect(readHighlight(highlight).opacity).toBe('0');
    });
  });

  it('disconnects its observers when unmounted', () => {
    // Arrange
    const disconnectMutation = vi.spyOn(
      MutationObserver.prototype,
      'disconnect',
    );
    const disconnectResize = vi.spyOn(ResizeObserver.prototype, 'disconnect');
    const { unmount } = render(
      <div>
        <AnimatedHighlight />
      </div>,
    );

    // Act
    unmount();

    // Assert
    expect(disconnectMutation).toHaveBeenCalled();
    expect(disconnectResize).toHaveBeenCalled();
  });
});

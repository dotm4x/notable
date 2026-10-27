import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { AutoSize, type AutoSizeProps } from './auto-size.js';

const motionState = vi.hoisted(() => ({ prefersReducedMotion: false }));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    useReducedMotion: () => motionState.prefersReducedMotion,
  };
});

type ResizeCallback = (
  entries: Array<{ contentRect: DOMRectReadOnly }>,
) => void;

const observers: Array<{
  callback: ResizeCallback;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

function reportContentSize(
  width: number,
  height: number,
  index = observers.length - 1,
) {
  const observer = observers[index];

  if (!observer) {
    throw new Error('No ResizeObserver is registered.');
  }

  act(() => {
    observer.callback([{ contentRect: { width, height } as DOMRectReadOnly }]);
  });
}

const fastTransition = { type: 'tween', duration: 0.01 } as const;

describe('AutoSize', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  );
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  );

  beforeEach(() => {
    observers.length = 0;
    motionState.prefersReducedMotion = false;

    globalThis.ResizeObserver = class {
      callback: ResizeCallback;
      disconnect = vi.fn();
      unobserve = vi.fn();

      constructor(callback: ResizeCallback) {
        this.callback = callback;
        observers.push(this);
      }

      observe = vi.fn();
    } as unknown as typeof ResizeObserver;

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get(this: HTMLElement) {
        return parseFloat(this.style.width) || 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get(this: HTMLElement) {
        return parseFloat(this.style.height) || 0;
      },
    });
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;

    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetWidth',
        originalOffsetWidth,
      );
    }
    if (originalOffsetHeight) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetHeight',
        originalOffsetHeight,
      );
    }
  });

  function renderAutoSize(props: Partial<AutoSizeProps> = {}) {
    return render(
      <AutoSize {...props}>
        <p>Content</p>
      </AutoSize>,
    );
  }

  function getContainer() {
    return screen
      .getByText('Content')
      .closest<HTMLElement>('.notable-auto-size') as HTMLElement;
  }

  it('renders its children inside a content wrapper with a vertical axis by default', () => {
    // Arrange, Act
    renderAutoSize();

    // Assert
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(getContainer()).toHaveAttribute('data-axis', 'vertical');
  });

  it('forwards the ref to the animated container', () => {
    // Arrange
    const ref = createRef<HTMLDivElement>();

    // Act
    render(
      <AutoSize ref={ref}>
        <p>Content</p>
      </AutoSize>,
    );

    // Assert
    expect(ref.current).toBe(getContainer());
  });

  it('sets the first measured size without animating', () => {
    // Arrange
    renderAutoSize();

    // Act
    reportContentSize(320, 96);

    // Assert
    expect(getContainer().style.height).toBe('96px');
    expect(getContainer()).not.toHaveAttribute('data-animating');
  });

  it('animates the height to the new content height when the vertical axis grows', async () => {
    // Arrange
    renderAutoSize({ transition: fastTransition });
    reportContentSize(320, 96);

    // Act
    reportContentSize(320, 240);

    // Assert
    await waitFor(() => {
      expect(getContainer().style.height).toBe('240px');
    });
    await waitFor(() => {
      expect(getContainer()).not.toHaveAttribute('data-animating');
    });
  });

  it('animates the height down when the vertical axis shrinks', async () => {
    // Arrange
    renderAutoSize({ transition: fastTransition });
    reportContentSize(320, 240);

    // Act
    reportContentSize(320, 64);

    // Assert
    await waitFor(() => {
      expect(getContainer().style.height).toBe('64px');
    });
  });

  it('marks the container as animating while the size changes', () => {
    // Arrange
    renderAutoSize({ transition: { type: 'tween', duration: 1 } });
    reportContentSize(320, 96);

    // Act
    reportContentSize(320, 240);

    // Assert
    expect(getContainer()).toHaveAttribute('data-animating');
  });

  it('animates only the width on the horizontal axis', async () => {
    // Arrange
    renderAutoSize({ axis: 'horizontal', transition: fastTransition });
    reportContentSize(120, 40);

    // Act
    reportContentSize(260, 40);

    // Assert
    await waitFor(() => {
      expect(getContainer().style.width).toBe('260px');
    });
    expect(getContainer().style.height).toBe('');
  });

  it('animates both dimensions on the both axis', async () => {
    // Arrange
    renderAutoSize({ axis: 'both', transition: fastTransition });
    reportContentSize(120, 40);

    // Act
    reportContentSize(260, 180);

    // Assert
    await waitFor(() => {
      expect(getContainer().style.width).toBe('260px');
      expect(getContainer().style.height).toBe('180px');
    });
  });

  it('applies the final size immediately when reduced motion is preferred', () => {
    // Arrange
    motionState.prefersReducedMotion = true;
    renderAutoSize({ transition: { type: 'tween', duration: 10 } });
    reportContentSize(320, 96);

    // Act
    reportContentSize(320, 240);

    // Assert
    expect(getContainer().style.height).toBe('240px');
    expect(getContainer()).not.toHaveAttribute('data-animating');
  });

  it('settles on the latest content size after rapid updates', async () => {
    // Arrange
    renderAutoSize({ transition: fastTransition });
    reportContentSize(320, 96);

    // Act
    reportContentSize(320, 200);
    reportContentSize(320, 120);
    reportContentSize(320, 160);

    // Assert
    await waitFor(() => {
      expect(getContainer().style.height).toBe('160px');
    });
    await waitFor(() => {
      expect(getContainer()).not.toHaveAttribute('data-animating');
    });
  });

  it('skips animation when the measured size has not changed', () => {
    // Arrange
    renderAutoSize({ transition: { type: 'tween', duration: 1 } });
    reportContentSize(320, 96);

    // Act
    reportContentSize(320, 96);

    // Assert
    expect(getContainer()).not.toHaveAttribute('data-animating');
  });

  it('disconnects the ResizeObserver on unmount', () => {
    // Arrange
    const { unmount } = renderAutoSize();
    const observer = observers[0];

    // Act
    unmount();

    // Assert
    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });
});

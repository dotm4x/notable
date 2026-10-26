import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Skeleton } from './skeleton.js';
import { Skeleton as PublicSkeleton } from '../../index.js';

function renderSkeleton(
  props: Parameters<typeof Skeleton>[0] = {},
): HTMLElement {
  const { container } = render(<Skeleton {...props} />);
  const element = container.firstElementChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error('Expected Skeleton to render an HTML element');
  }

  return element;
}

describe('Skeleton', () => {
  it('renders a decorative rectangular placeholder with shimmer by default', () => {
    // Arrange, Act
    const skeleton = renderSkeleton();

    // Assert
    expect(skeleton.tagName).toBe('SPAN');
    expect(skeleton).toHaveClass(
      'notable-skeleton',
      'notable-skeleton--rectangular',
      'notable-skeleton--shimmer',
    );
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('adds no role, label, children, or focusable element', () => {
    const skeleton = renderSkeleton();

    expect(skeleton).toBeEmptyDOMElement();
    expect(skeleton).not.toHaveAttribute('role');
    expect(skeleton).not.toHaveAttribute('tabindex');
  });

  it('applies custom width and height as CSS lengths', () => {
    const skeleton = renderSkeleton({ width: '100%', height: '2rem' });

    expect(skeleton.style.width).toBe('100%');
    expect(skeleton.style.height).toBe('2rem');
  });

  it('treats numeric dimensions as pixels', () => {
    const skeleton = renderSkeleton({ width: 120, height: 16 });

    expect(skeleton.style.width).toBe('120px');
    expect(skeleton.style.height).toBe('16px');
  });

  it('keeps width and height from the style prop when the props are omitted', () => {
    const skeleton = renderSkeleton({
      style: { width: '40px', height: '8px' },
    });

    expect(skeleton.style.width).toBe('40px');
    expect(skeleton.style.height).toBe('8px');
  });

  it('prefers the width and height props over conflicting style entries', () => {
    const skeleton = renderSkeleton({
      width: '10px',
      height: '20px',
      style: { width: '40px', height: '8px' },
    });

    expect(skeleton.style.width).toBe('10px');
    expect(skeleton.style.height).toBe('20px');
  });

  it('maps a Notable radius token to its radius variable', () => {
    const skeleton = renderSkeleton({ radius: 'lg' });

    expect(skeleton.style.borderRadius).toBe('var(--notable-radius-lg)');
  });

  it('treats a numeric radius as pixels', () => {
    const skeleton = renderSkeleton({ radius: 6 });

    expect(skeleton.style.borderRadius).toBe('6px');
  });

  it('uses any other radius string as provided', () => {
    const skeleton = renderSkeleton({ radius: '0 4px 4px 0' });

    expect(skeleton.style.borderRadius).toBe('0 4px 4px 0');
  });

  it.each(['text', 'circular', 'rectangular'] as const)(
    'supports the %s variant',
    (variant) => {
      const skeleton = renderSkeleton({ variant });

      expect(skeleton).toHaveClass(`notable-skeleton--${variant}`);
    },
  );

  it('keeps a circular placeholder circular when only the width is set', () => {
    const skeleton = renderSkeleton({ variant: 'circular', width: 48 });

    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('');
  });

  it('keeps a circular placeholder circular when only the height is set', () => {
    const skeleton = renderSkeleton({ variant: 'circular', height: 48 });

    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('48px');
  });

  it('honors both dimensions on a circular placeholder when both are set', () => {
    const skeleton = renderSkeleton({
      variant: 'circular',
      width: 64,
      height: 32,
    });

    expect(skeleton.style.width).toBe('64px');
    expect(skeleton.style.height).toBe('32px');
  });

  it('does not apply the circular fallback to other variants', () => {
    const skeleton = renderSkeleton({ variant: 'text', height: 24 });

    expect(skeleton.style.width).toBe('');
    expect(skeleton.style.height).toBe('24px');
  });

  it('uses shimmer as the default animation', () => {
    const skeleton = renderSkeleton();

    expect(skeleton).toHaveClass('notable-skeleton--shimmer');
    expect(skeleton).not.toHaveClass('notable-skeleton--pulse');
  });

  it('supports the pulse animation', () => {
    const skeleton = renderSkeleton({ animation: 'pulse' });

    expect(skeleton).toHaveClass('notable-skeleton--pulse');
    expect(skeleton).not.toHaveClass('notable-skeleton--shimmer');
  });

  it('supports disabling the animation', () => {
    const skeleton = renderSkeleton({ animation: 'none' });

    expect(skeleton).toHaveClass('notable-skeleton--none');
    expect(skeleton).not.toHaveClass('notable-skeleton--shimmer');
    expect(skeleton).not.toHaveClass('notable-skeleton--pulse');
  });

  it('forwards a custom class and native attributes', () => {
    const skeleton = renderSkeleton({
      className: 'avatar-placeholder',
      id: 'profile-skeleton',
      title: 'Loading profile',
    });

    expect(skeleton).toHaveClass('notable-skeleton', 'avatar-placeholder');
    expect(skeleton).toHaveAttribute('id', 'profile-skeleton');
    expect(skeleton).toHaveAttribute('title', 'Loading profile');
  });

  it('lets consumers override aria-hidden when a placeholder should be exposed', () => {
    const skeleton = renderSkeleton({ 'aria-hidden': false });

    expect(skeleton).not.toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['shimmer', 'pulse'] as const)(
    'adds the hover spotlight for the %s animation',
    (animation) => {
      const skeleton = renderSkeleton({ animation });

      expect(skeleton).toHaveClass('notable-skeleton--spotlight');
    },
  );

  it('omits the hover spotlight when animation is none', () => {
    const skeleton = renderSkeleton({ animation: 'none' });

    expect(skeleton).not.toHaveClass('notable-skeleton--spotlight');
  });

  it('publishes the pointer position as CSS variables on move', () => {
    const skeleton = renderSkeleton();

    fireEvent.pointerMove(skeleton, { clientX: 30, clientY: 12 });

    expect(
      skeleton.style.getPropertyValue('--notable-skeleton-pointer-x'),
    ).not.toBe('');
    expect(
      skeleton.style.getPropertyValue('--notable-skeleton-pointer-y'),
    ).not.toBe('');
  });

  it('calls a consumer onPointerMove handler alongside the spotlight update', () => {
    const onPointerMove = vi.fn();
    const skeleton = renderSkeleton({ onPointerMove });

    fireEvent.pointerMove(skeleton, { clientX: 5, clientY: 5 });

    expect(onPointerMove).toHaveBeenCalledTimes(1);
  });

  it('is available from the public package entry point', () => {
    expect(PublicSkeleton).toBe(Skeleton);
  });
});

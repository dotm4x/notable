import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NumberFlow } from './number-flow.js';
import { NumberFlow as PublicNumberFlow } from '../../index.js';

function getDigitValues(container: HTMLElement): number[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('.notable-number-flow__digit'),
    (digit) => Number(digit.dataset.digit),
  );
}

function getStripOffsets(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('.notable-number-flow__strip'),
    (strip) => strip.style.getPropertyValue('--notable-number-flow-digit'),
  );
}

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected NumberFlow to render an HTML element');
  }

  return root;
}

describe('NumberFlow', () => {
  it('is exported from the package entry point', () => {
    // Arrange, Act, Assert
    expect(PublicNumberFlow).toBe(NumberFlow);
  });

  it('renders the initial value with one animated column per digit', () => {
    // Arrange
    const { container, getByText } = render(<NumberFlow value={1234} />);

    // Act
    const visibleText = getByText('1,234');

    // Assert
    expect(visibleText).toHaveClass('notable-number-flow__sr-only');
    expect(getDigitValues(container)).toEqual([1, 2, 3, 4]);
    expect(getStripOffsets(container)).toEqual(['1', '2', '3', '4']);
  });

  it('keeps the root element free of entrance animation state', () => {
    // Arrange, Act
    const { container } = render(<NumberFlow value={42} />);

    // Assert
    expect(getRoot(container)).toHaveClass('notable-number-flow');
    expect(
      getRoot(container).style.getPropertyValue(
        '--notable-number-flow-duration',
      ),
    ).toBe('');
  });

  it('updates the digits when the value increases', () => {
    // Arrange
    const { container, rerender } = render(<NumberFlow value={12} />);

    // Act
    rerender(<NumberFlow value={37} />);

    // Assert
    expect(getDigitValues(container)).toEqual([3, 7]);
    expect(getStripOffsets(container)).toEqual(['3', '7']);
  });

  it('updates the digits when the value decreases', () => {
    // Arrange
    const { container, rerender } = render(<NumberFlow value={250} />);

    // Act
    rerender(<NumberFlow value={180} />);

    // Assert
    expect(getDigitValues(container)).toEqual([1, 8, 0]);
  });

  it('adds a leading column when the value rolls from 9 to 10', () => {
    // Arrange
    const { container, getByText, rerender } = render(<NumberFlow value={9} />);

    // Act
    rerender(<NumberFlow value={10} />);

    // Assert
    expect(getByText('10')).toHaveClass('notable-number-flow__sr-only');
    expect(getDigitValues(container)).toEqual([1, 0]);
  });

  it('adds a leading column when the value rolls from 99 to 100', () => {
    // Arrange
    const { container, rerender } = render(<NumberFlow value={99} />);

    // Act
    rerender(<NumberFlow value={100} />);

    // Assert
    expect(getDigitValues(container)).toEqual([1, 0, 0]);
  });

  it('removes a leading column when the value rolls from 100 to 99', () => {
    // Arrange
    const { container, getByText, rerender } = render(
      <NumberFlow value={100} />,
    );

    // Act
    rerender(<NumberFlow value={99} />);

    // Assert
    expect(getByText('99')).toHaveClass('notable-number-flow__sr-only');
    expect(getDigitValues(container)).toEqual([9, 9]);
  });

  it('keeps the element for an unchanged place value when digit count changes', () => {
    // Arrange
    const { container, rerender } = render(<NumberFlow value={9} />);
    const onesBefore = container.querySelectorAll(
      '.notable-number-flow__digit',
    )[0];

    // Act
    rerender(<NumberFlow value={10} />);

    // Assert
    const digits = container.querySelectorAll('.notable-number-flow__digit');
    expect(digits[1]).toBe(onesBefore);
    expect(digits[1]).toHaveAttribute('data-digit', '0');
  });

  it('formats negative values with a static minus sign', () => {
    // Arrange
    const { container, getByText } = render(<NumberFlow value={-12.5} />);

    // Act
    const visibleText = getByText('-12.5');

    // Assert
    expect(visibleText).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([1, 2, 5]);
  });

  it('animates fraction digits in addition to integer digits', () => {
    // Arrange
    const { container, getByText, rerender } = render(
      <NumberFlow value={3} format={{ minimumFractionDigits: 2 }} />,
    );

    // Act
    rerender(<NumberFlow value={3.75} format={{ minimumFractionDigits: 2 }} />);

    // Assert
    expect(getByText('3.75')).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([3, 7, 5]);
  });

  it('formats values with the requested locale grouping and decimal separators', () => {
    // Arrange
    const { container, getByText } = render(
      <NumberFlow value={1234.5} locale="de-DE" />,
    );

    // Act
    const visibleText = getByText('1.234,5');

    // Assert
    expect(visibleText).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([1, 2, 3, 4, 5]);
  });

  it('animates locale-specific numerals when the locale uses them', () => {
    // Arrange
    const { container, getByText, rerender } = render(
      <NumberFlow value={12} locale="ar-EG" />,
    );

    // Act
    rerender(<NumberFlow value={34} locale="ar-EG" />);

    // Assert
    expect(getByText('٣٤')).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([3, 4]);
  });

  it('applies currency formatting and keeps the currency symbol static', () => {
    // Arrange
    const { container, getByText } = render(
      <NumberFlow
        value={1250}
        locale="en-US"
        format={{ style: 'currency', currency: 'USD' }}
      />,
    );

    // Act
    const visibleText = getByText('$1,250.00');

    // Assert
    expect(visibleText).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([1, 2, 5, 0, 0, 0]);
  });

  it('applies percent formatting', () => {
    // Arrange
    const { container, getByText } = render(
      <NumberFlow value={0.256} format={{ style: 'percent' }} />,
    );

    // Act
    const visibleText = getByText('26%');

    // Assert
    expect(visibleText).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([2, 6]);
  });

  it('applies compact notation and keeps the compact suffix static', () => {
    // Arrange
    const { container, getByText } = render(
      <NumberFlow value={1200} format={{ notation: 'compact' }} />,
    );

    // Act
    const visibleText = getByText('1.2K');

    // Assert
    expect(visibleText).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([1, 2]);
  });

  it('respects grouping options', () => {
    // Arrange
    const { getByText } = render(
      <NumberFlow value={1234567} format={{ useGrouping: false }} />,
    );

    // Act, Assert
    expect(getByText('1234567')).toBeInTheDocument();
  });

  it('applies the duration as a CSS custom property', () => {
    // Arrange
    const { container } = render(<NumberFlow value={5} duration={300} />);

    // Act
    const root = getRoot(container);

    // Assert
    expect(root.style.getPropertyValue('--notable-number-flow-duration')).toBe(
      '300ms',
    );
  });

  it('merges className and native attributes onto the root element', () => {
    // Arrange
    const { container } = render(
      <NumberFlow
        value={5}
        className="custom-flow"
        id="total"
        style={{ color: 'rebeccapurple' }}
      />,
    );

    // Act
    const root = getRoot(container);

    // Assert
    expect(root).toHaveClass('notable-number-flow', 'custom-flow');
    expect(root).toHaveAttribute('id', 'total');
    expect(root.style.color).toBe('rebeccapurple');
  });

  it('settles on the final value after rapid successive updates', () => {
    // Arrange
    const { container, getByText, rerender } = render(<NumberFlow value={0} />);

    // Act
    for (let value = 1; value <= 25; value += 1) {
      rerender(<NumberFlow value={value} />);
    }

    // Assert
    expect(getByText('25')).toBeInTheDocument();
    expect(getDigitValues(container)).toEqual([2, 5]);
    expect(getStripOffsets(container)).toEqual(['2', '5']);
  });

  it('exposes the formatted value once to assistive technology', () => {
    // Arrange
    const { container, getByText } = render(<NumberFlow value={2048} />);

    // Act
    const accessibleText = getByText('2,048');

    // Assert
    expect(accessibleText.closest('[aria-hidden="true"]')).toBeNull();
    expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
    expect(getRoot(container)).not.toHaveAttribute('aria-live');
  });

  it('hides the animated digits from assistive technology', () => {
    // Arrange
    const { container } = render(<NumberFlow value={808} />);

    // Act
    const visualLayer = container.querySelector('.notable-number-flow__visual');

    // Assert
    expect(visualLayer).toHaveAttribute('aria-hidden', 'true');
  });
});

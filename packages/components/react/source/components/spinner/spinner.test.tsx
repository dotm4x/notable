import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner.js';
import { Spinner as PublicSpinner } from '../../index.js';

describe('Spinner', () => {
  it('renders a status with the default accessible label and size', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass(
      'notable-spinner--medium',
    );
  });

  it.each(['small', 'medium', 'large'] as const)(
    'supports the %s size',
    (size) => {
      render(<Spinner size={size} label={`${size} loading`} />);

      expect(
        screen.getByRole('status', { name: `${size} loading` }),
      ).toHaveClass(`notable-spinner--${size}`);
    },
  );

  it('forwards a custom class and renders its icon decoratively', () => {
    const { container } = render(
      <Spinner
        className="custom-spinner"
        id="saving-spinner"
        title="Saving changes"
        aria-label="Saving changes"
      />,
    );

    expect(screen.getByRole('status', { name: 'Saving changes' })).toHaveClass(
      'custom-spinner',
    );
    expect(screen.getByRole('status')).toHaveAttribute('id', 'saving-spinner');
    expect(screen.getByRole('status')).toHaveAttribute(
      'title',
      'Saving changes',
    );
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('is available from the public package entry point', () => {
    expect(PublicSpinner).toBe(Spinner);
  });
});

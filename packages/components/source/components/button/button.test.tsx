import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button.js';
import { Spinner } from '../spinner/spinner.js';

describe('Button', () => {
  it('renders its label and handles clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports native button properties', () => {
    render(
      <Button type="submit" className="custom-button">
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('notable-button', 'custom-button');
  });

  it('defaults to type button', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('supports visual variants', () => {
    render(<Button variant="secondary">Cancel</Button>);

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
      'notable-button--secondary',
    );
  });

  it('supports sizes', () => {
    render(<Button size="large">Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass(
      'notable-button--large',
    );
  });

  it.each(['icon', 'icon-small', 'icon-large'] as const)(
    'supports the %s icon size',
    (size) => {
      render(
        <Button size={size} aria-label="Search">
          <span aria-hidden="true">Search icon</span>
        </Button>,
      );

      expect(screen.getByRole('button', { name: 'Search' })).toHaveClass(
        `notable-button--${size}`,
      );
    },
  );

  it('composes a spinner without coupling it to disabled or busy state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button onClick={onClick}>
        <Spinner size="small" />
        <span>Save</span>
      </Button>,
    );

    const button = screen.getByRole('button');

    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not handle clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports long labels', () => {
    render(<Button>Continue to checkout</Button>);

    expect(
      screen.getByRole('button', { name: 'Continue to checkout' }),
    ).toBeInTheDocument();
  });

  it('supports asChild to render custom elements like links', () => {
    render(
      <Button asChild variant="outline">
        <a href="https://github.com">GitHub</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveClass('notable-button', 'notable-button--outline');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button.js';

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
    expect(button).toHaveClass('bodypop-button', 'custom-button');
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
      'bodypop-button--secondary',
    );
  });

  it('supports sizes', () => {
    render(<Button size="lg">Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass(
      'bodypop-button--lg',
    );
  });

  it('supports icon-only buttons with accessible labels', () => {
    render(
      <Button iconOnly aria-label="Search">
        <span aria-hidden="true">⌕</span>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Search' })).toHaveClass(
      'bodypop-button--icon-only',
    );
  });

  it('disables interaction when loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Saving...
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Saving\.\.\./ });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.bodypop-spinner')).not.toBeNull();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
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
});

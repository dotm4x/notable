import { render, screen } from '@testing-library/react';
import { Check, CircleHelp } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge.js';
import { Badge as PublicBadge } from '../../index.js';

describe('Badge', () => {
  it('defaults to the default variant and medium size', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New')).toHaveClass(
      'notable-badge',
      'notable-badge--default',
      'notable-badge--medium',
    );
  });

  it.each([
    'default',
    'secondary',
    'outline',
    'success',
    'warning',
    'danger',
    'info',
  ] as const)('supports the %s variant', (variant) => {
    render(<Badge variant={variant}>{variant}</Badge>);

    expect(screen.getByText(variant)).toHaveClass(`notable-badge--${variant}`);
  });

  it.each(['small', 'medium'] as const)('supports the %s size', (size) => {
    render(<Badge size={size}>Label</Badge>);

    expect(screen.getByText('Label')).toHaveClass(`notable-badge--${size}`);
  });

  it('forwards custom classes, HTML attributes, and accessibility attributes', () => {
    render(
      <Badge
        className="custom-badge"
        id="status-badge"
        title="Current status"
        data-testid="badge"
        aria-label="Status: complete"
      >
        Complete
      </Badge>,
    );

    const badge = screen.getByTestId('badge');

    expect(badge).toHaveClass('custom-badge');
    expect(badge).toHaveAttribute('id', 'status-badge');
    expect(badge).toHaveAttribute('title', 'Current status');
    expect(badge).toHaveAccessibleName('Status: complete');
  });

  it('renders arbitrary React content and Lucide icons', () => {
    render(
      <Badge>
        <Check aria-hidden="true" data-testid="check-icon" />
        <span>Ready</span>
      </Badge>,
    );

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('supports icon-only content with visually hidden text', () => {
    render(
      <Badge>
        <CircleHelp aria-hidden="true" />
        <span className="notable-badge__sr-only">More information</span>
      </Badge>,
    );

    expect(screen.getByText('More information')).toBeInTheDocument();
    expect(screen.getByText('More information')).toHaveClass(
      'notable-badge__sr-only',
    );
  });

  it('is available from the public package entry point', () => {
    expect(PublicBadge).toBe(Badge);
  });
});

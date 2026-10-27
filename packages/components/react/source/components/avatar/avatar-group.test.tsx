import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar.js';
import { AvatarGroup } from './avatar-group.js';
import { AvatarGroup as PublicAvatarGroup } from '../../index.js';

const avatars = ['Max', 'Alex', 'Sam', 'Taylor'].map((name) => (
  <Avatar key={name} data-testid={`avatar-${name}`}>
    <Avatar.Fallback>{name}</Avatar.Fallback>
  </Avatar>
));

describe('AvatarGroup', () => {
  it('renders its children', () => {
    render(<AvatarGroup>{avatars.slice(0, 2)}</AvatarGroup>);

    expect(screen.getByText('Max')).toBeVisible();
    expect(screen.getByText('Alex')).toBeVisible();
  });

  it('applies its size and overlap to child avatars', () => {
    render(
      <AvatarGroup size="large" spacing={12} data-testid="group">
        {avatars.slice(0, 2)}
      </AvatarGroup>,
    );

    expect(screen.getByTestId('group')).toHaveClass(
      'notable-avatar-group--large',
    );
    expect(screen.getByTestId('group')).toHaveStyle(
      '--notable-avatar-group-overlap: 12px',
    );
    expect(screen.getByTestId('avatar-Max')).toHaveClass(
      'notable-avatar--medium',
    );
  });

  it('clamps invalid overlap to zero', () => {
    render(
      <AvatarGroup spacing={-4} data-testid="group">
        {avatars.slice(0, 1)}
      </AvatarGroup>,
    );

    expect(screen.getByTestId('group')).toHaveStyle(
      '--notable-avatar-group-overlap: 0px',
    );
  });

  it.each(['horizontal', 'vertical'] as const)(
    'supports %s orientation',
    (orientation) => {
      render(
        <AvatarGroup orientation={orientation} spacing={10} data-testid="group">
          {avatars.slice(0, 2)}
        </AvatarGroup>,
      );

      expect(screen.getByTestId('group')).toHaveClass(
        `notable-avatar-group--${orientation}`,
      );
      expect(screen.getByTestId('avatar-Max').parentElement).toHaveClass(
        'notable-avatar-group__item',
      );
      expect(screen.getByTestId('group')).toHaveStyle(
        '--notable-avatar-group-overlap: 10px',
      );
    },
  );

  it('limits visible avatars and reports the accurate hidden count', () => {
    render(<AvatarGroup max={2}>{avatars}</AvatarGroup>);

    expect(screen.getByText('Max')).toBeVisible();
    expect(screen.getByText('Alex')).toBeVisible();
    expect(screen.queryByText('Sam')).not.toBeInTheDocument();
    expect(screen.queryByText('Taylor')).not.toBeInTheDocument();
    expect(screen.getByLabelText('2 more avatars')).toBeVisible();
    expect(screen.getByText('+2')).toBeVisible();
  });

  it('handles empty groups and a zero maximum safely', () => {
    const { rerender } = render(<AvatarGroup data-testid="group" />);

    expect(screen.getByTestId('group').childElementCount).toBe(0);

    rerender(
      <AvatarGroup max={0} data-testid="group">
        {avatars.slice(0, 2)}
      </AvatarGroup>,
    );

    expect(screen.queryByText('Max')).not.toBeInTheDocument();
    expect(screen.getByLabelText('2 more avatars')).toBeVisible();
  });

  it('renders custom overflow content with an accessible hidden count', () => {
    render(
      <AvatarGroup max={1} overflow="and others">
        {avatars.slice(0, 3)}
      </AvatarGroup>,
    );

    expect(screen.getByLabelText('2 more avatars')).toBeVisible();
    expect(screen.getByText('and others')).toBeVisible();
    expect(screen.queryByText('+2')).not.toBeInTheDocument();
  });

  it('does not render an overflow indicator when all avatars fit', () => {
    render(<AvatarGroup max={4}>{avatars}</AvatarGroup>);

    expect(screen.queryByRole('img', { name: /more avatars/ })).toBeNull();
  });

  it('preserves native interactive wrappers around avatars', () => {
    render(
      <AvatarGroup>
        <a href="#max" aria-label="Max profile">
          <Avatar>
            <Avatar.Fallback>MX</Avatar.Fallback>
          </Avatar>
        </a>
        <button type="button" aria-label="Alex profile">
          <Avatar>
            <Avatar.Fallback>AL</Avatar.Fallback>
          </Avatar>
        </button>
      </AvatarGroup>,
    );

    expect(screen.getByRole('link', { name: 'Max profile' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Alex profile' })).toBeVisible();
  });

  it('forwards classes and HTML attributes', () => {
    render(
      <AvatarGroup
        className="custom-group"
        id="team-avatars"
        title="Team members"
        data-testid="group"
      >
        {avatars.slice(0, 1)}
      </AvatarGroup>,
    );

    expect(screen.getByTestId('group')).toHaveClass('custom-group');
    expect(screen.getByTestId('group')).toHaveAttribute('id', 'team-avatars');
    expect(screen.getByTestId('group')).toHaveAttribute(
      'title',
      'Team members',
    );
  });

  it('is available from the public package entry point', () => {
    expect(PublicAvatarGroup).toBe(AvatarGroup);
  });
});
